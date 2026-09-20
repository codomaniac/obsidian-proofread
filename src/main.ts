import { EditorView } from "@codemirror/view";
import { MarkdownView, Notice, Plugin, TFile, debounce } from "obsidian";

import { anchorFindings } from "./findings/anchor.ts";
import type { Finding } from "./findings/schema.ts";
import { readSidecar, sidecarModified, sidecarPath } from "./findings/sidecar.ts";
import { FindingStore, type FindingStatus } from "./findings/store.ts";
import { findingHover } from "./editor/hover.ts";
import { pinFinding, proofreadPin } from "./editor/pin.ts";
import { type EditorFinding, findingDecorations, findingsField, setFindings } from "./editor/state.ts";
import { DEFAULT_SETTINGS, type ProofreadSettings } from "./settings.ts";
import { FindingsPanel, PANEL_VIEW_TYPE } from "./view/panel.ts";

interface PluginData {
	settings: Partial<ProofreadSettings>;
	files: unknown;
}

export default class ProofreadPlugin extends Plugin {
	override settings: ProofreadSettings = { ...DEFAULT_SETTINGS };

	readonly store = new FindingStore();

	/** Sidecar mtimes already loaded, so polling only reads what changed. */
	private loadedAt = new Map<string, number>();

	/** Everything the last report held, decorated or not, for the panel to list. */
	report: Finding[] = [];
	problems: string[] = [];
	unanchored: string[] = [];
	/** How many findings the editor is currently drawing. */
	shown = 0;

	private readonly persist = debounce(() => void this.saveState(), 400, true);
	private readonly refreshSoon = debounce(() => this.refreshPanels(), 300, true);

	override async onload(): Promise<void> {
		await this.restore();

		this.registerEditorExtension([
			findingsField,
			findingDecorations,
			findingHover,
			proofreadPin({
				onResolve: (finding) => this.decide(finding, "resolved"),
				onDismiss: (finding) => this.decide(finding, "dismissed"),
			}),
		]);

		this.registerView(PANEL_VIEW_TYPE, (leaf) => new FindingsPanel(leaf, this));

		this.registerEvent(
			this.app.workspace.on("file-open", (file) => {
				if (file) void this.loadFindings(file);
			}),
		);

		this.registerEvent(this.app.workspace.on("editor-change", () => this.refreshSoon()));

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
			id: "open-panel",
			name: "Open the findings panel",
			callback: () => void this.openPanel(),
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

	async openPanel(): Promise<void> {
		const open = this.app.workspace.getLeavesOfType(PANEL_VIEW_TYPE);
		if (open.length > 0) {
			await this.app.workspace.revealLeaf(open[0]);
			return;
		}

		const leaf = this.app.workspace.getRightLeaf(false);
		if (!leaf) return;
		await leaf.setViewState({ type: PANEL_VIEW_TYPE, active: true });
		await this.app.workspace.revealLeaf(leaf);
	}

	refreshPanels(): void {
		for (const leaf of this.app.workspace.getLeavesOfType(PANEL_VIEW_TYPE)) {
			if (leaf.view instanceof FindingsPanel) leaf.view.render();
		}
	}

	/** Scrolls to a finding and opens its card. */
	revealFinding(id: string): void {
		const editor = this.editorView();
		if (!editor) return;

		const item = editor.state.field(findingsField).find((one) => one.finding.id === id);
		if (!item) return;

		editor.dispatch({
			effects: [EditorView.scrollIntoView(item.from, { y: "center" }), pinFinding.of(id)],
		});
		editor.focus();
	}

	setStatus(path: string, id: string, status: FindingStatus): void {
		if (status === "resolved") this.store.resolve(path, id);
		else if (status === "dismissed") this.store.dismiss(path, id);
		else this.store.reopen(path, id);

		this.persist();
		this.applyToEditor(path);
	}

	private decide(finding: Finding, status: FindingStatus): void {
		const path = this.app.workspace.getActiveFile()?.path;
		if (path) this.setStatus(path, finding.id, status);
	}

	/** The CodeMirror view behind the open note, when there is one. */
	editorView(): EditorView | null {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return null;
		return (view.editor as unknown as { cm?: EditorView }).cm ?? null;
	}

	/** Anchors whatever is still open against the note as it reads now. */
	private applyToEditor(path: string): void {
		const editor = this.editorView();
		if (!editor) return;

		const open = this.report.filter((finding) => this.store.statusOf(path, finding.id) === "open");
		const items: EditorFinding[] = [];
		const unanchored: string[] = [];

		for (const { finding, anchor } of anchorFindings(editor.state.doc.toString(), open)) {
			if (!anchor) {
				unanchored.push(finding.id);
				continue;
			}
			items.push({ finding, from: anchor.from, to: anchor.to, edited: false });
		}

		this.unanchored = unanchored;
		this.shown = items.length;
		editor.dispatch({ effects: setFindings.of(items) });
		this.refreshPanels();
	}

	/** Reads the sidecar for `file`, and hands what it holds to the editor. */
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
			this.shown = 0;
			editor.dispatch({ effects: setFindings.of([]) });
			this.refreshPanels();
			if (announce) new Notice(`No proofread report at ${path}`);
			return;
		}

		this.report = loaded.report.findings;
		this.problems = loaded.problems;
		this.loadedAt.set(file.path, loaded.modified);

		this.store.pruneResolved(
			file.path,
			this.report.map((finding) => finding.id),
		);
		this.persist();
		this.applyToEditor(file.path);

		if (announce) {
			const missed =
				this.unanchored.length > 0 ? `, ${this.unanchored.length} no longer in the note` : "";
			new Notice(`${this.shown} findings${missed}`);
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
