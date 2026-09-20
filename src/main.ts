import type { EditorView } from "@codemirror/view";
import { MarkdownView, Notice, Plugin, TFile, debounce } from "obsidian";

import { anchorFindings } from "./findings/anchor.ts";
import type { Finding } from "./findings/schema.ts";
import { readSidecar, sidecarModified, sidecarPath } from "./findings/sidecar.ts";
import { FindingStore } from "./findings/store.ts";
import { findingHover } from "./editor/hover.ts";
import { proofreadPin } from "./editor/pin.ts";
import { type EditorFinding, findingDecorations, findingsField, setFindings } from "./editor/state.ts";
import { DEFAULT_SETTINGS, type ProofreadSettings } from "./settings.ts";

interface PluginData {
	settings: Partial<ProofreadSettings>;
	files: unknown;
}

export default class ProofreadPlugin extends Plugin {
	override settings: ProofreadSettings = { ...DEFAULT_SETTINGS };

	readonly store = new FindingStore();

	/** Sidecar mtimes already loaded, so polling only reads what changed. */
	private loadedAt = new Map<string, number>();

	/** Everything the last load held, decorated or not, for the panel to list. */
	report: Finding[] = [];
	problems: string[] = [];
	unanchored: string[] = [];

	private readonly persist = debounce(() => void this.saveState(), 400, true);

	override async onload(): Promise<void> {
		await this.restore();

		this.registerEditorExtension([
			findingsField,
			findingDecorations,
			findingHover,
			proofreadPin({
				onResolve: (finding) => this.decide(finding, "resolve"),
				onDismiss: (finding) => this.decide(finding, "dismiss"),
			}),
		]);

		this.registerEvent(
			this.app.workspace.on("file-open", (file) => {
				if (file) void this.loadFindings(file);
			}),
		);

		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (!(file instanceof TFile)) return;
				this.store.rename(oldPath, file.path);
				this.loadedAt.delete(oldPath);
				this.persist();
			}),
		);

		this.registerEvent(
			this.app.vault.on("delete", (file) => {
				this.store.forget(file.path);
				this.loadedAt.delete(file.path);
				this.persist();
			}),
		);

		this.registerInterval(
			window.setInterval(() => void this.poll(), Math.max(1, this.settings.pollSeconds) * 1000),
		);

		this.addCommand({
			id: "reload-findings",
			name: "Reload findings for this note",
			callback: () => {
				const file = this.app.workspace.getActiveFile();
				if (file) void this.loadFindings(file, true);
			},
		});

		this.addCommand({
			id: "reopen-findings",
			name: "Bring back resolved and dismissed findings for this note",
			callback: () => {
				const file = this.app.workspace.getActiveFile();
				if (!file) return;
				this.store.forget(file.path);
				this.persist();
				void this.loadFindings(file, true);
			},
		});

		this.app.workspace.onLayoutReady(() => {
			const file = this.app.workspace.getActiveFile();
			if (file) void this.loadFindings(file);
		});
	}

	private async restore(): Promise<void> {
		const data = ((await this.loadData()) ?? {}) as Partial<PluginData>;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data.settings);
		this.store.load(data.files);
	}

	async saveState(): Promise<void> {
		await this.saveData({ settings: this.settings, files: this.store.toJSON() });
	}

	private decide(finding: Finding, what: "resolve" | "dismiss"): void {
		const path = this.app.workspace.getActiveFile()?.path;
		if (!path) return;

		if (what === "resolve") this.store.resolve(path, finding.id);
		else this.store.dismiss(path, finding.id);
		this.persist();
	}

	/** The CodeMirror view behind the open note, when there is one. */
	editorView(): EditorView | null {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return null;
		return (view.editor as unknown as { cm?: EditorView }).cm ?? null;
	}

	/** Reads the sidecar for `file`, anchors what it holds, and hands it to the editor. */
	async loadFindings(file: TFile, announce = false): Promise<void> {
		const editor = this.editorView();
		if (!editor || this.app.workspace.getActiveFile()?.path !== file.path) return;

		const path = sidecarPath(this.settings.sidecarFolder, file.path);
		const loaded = await readSidecar(this.app, path);

		if (!loaded) {
			this.loadedAt.delete(file.path);
			this.report = [];
			this.problems = [];
			this.unanchored = [];
			editor.dispatch({ effects: setFindings.of([]) });
			if (announce) new Notice(`No proofread report at ${path}`);
			return;
		}

		this.report = loaded.report.findings;
		this.store.pruneResolved(
			file.path,
			this.report.map((finding) => finding.id),
		);
		this.persist();

		const source = editor.state.doc.toString();
		const open = this.report.filter((finding) => this.store.statusOf(file.path, finding.id) === "open");

		const items: EditorFinding[] = [];
		const unanchored: string[] = [];

		for (const { finding, anchor } of anchorFindings(source, open)) {
			if (!anchor) {
				unanchored.push(finding.id);
				continue;
			}
			items.push({ finding, from: anchor.from, to: anchor.to, edited: false });
		}

		this.loadedAt.set(file.path, loaded.modified);
		this.problems = loaded.problems;
		this.unanchored = unanchored;
		editor.dispatch({ effects: setFindings.of(items) });

		if (announce) {
			const missed = unanchored.length > 0 ? `, ${unanchored.length} no longer in the note` : "";
			new Notice(`${items.length} findings${missed}`);
		}
	}

	/** Obsidian fires no vault events for a dot-folder, so the mtime is the signal. */
	private async poll(): Promise<void> {
		const file = this.app.workspace.getActiveFile();
		if (!file) return;

		const path = sidecarPath(this.settings.sidecarFolder, file.path);
		const modified = await sidecarModified(this.app, path);
		if (modified === null || modified === this.loadedAt.get(file.path)) return;

		await this.loadFindings(file);
	}
}
