import type { EditorView } from "@codemirror/view";
import { MarkdownView, Notice, Plugin, type TFile } from "obsidian";

import { anchorFindings } from "./findings/anchor.ts";
import { readSidecar, sidecarModified, sidecarPath } from "./findings/sidecar.ts";
import { findingHover } from "./editor/hover.ts";
import { type EditorFinding, findingDecorations, findingsField, setFindings } from "./editor/state.ts";
import { DEFAULT_SETTINGS, type ProofreadSettings } from "./settings.ts";

export default class ProofreadPlugin extends Plugin {
	override settings: ProofreadSettings = { ...DEFAULT_SETTINGS };

	/** Sidecar mtimes already loaded, so polling only reads what changed. */
	private loadedAt = new Map<string, number>();

	/** What the last load of the open note could not make sense of. */
	problems: string[] = [];
	unanchored = 0;

	override async onload(): Promise<void> {
		await this.loadSettings();

		this.registerEditorExtension([findingsField, findingDecorations, findingHover]);

		this.registerEvent(
			this.app.workspace.on("file-open", (file) => {
				if (file) void this.loadFindings(file);
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

		this.app.workspace.onLayoutReady(() => {
			const file = this.app.workspace.getActiveFile();
			if (file) void this.loadFindings(file);
		});
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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
			this.problems = [];
			this.unanchored = 0;
			editor.dispatch({ effects: setFindings.of([]) });
			if (announce) new Notice(`No proofread report at ${path}`);
			return;
		}

		const source = editor.state.doc.toString();
		const items: EditorFinding[] = [];
		let unanchored = 0;

		for (const { finding, anchor } of anchorFindings(source, loaded.report.findings)) {
			if (!anchor) {
				unanchored++;
				continue;
			}
			items.push({ finding, from: anchor.from, to: anchor.to, edited: false });
		}

		this.loadedAt.set(file.path, loaded.modified);
		this.problems = loaded.problems;
		this.unanchored = unanchored;
		editor.dispatch({ effects: setFindings.of(items) });

		if (announce) {
			const missed = unanchored > 0 ? `, ${unanchored} no longer in the note` : "";
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
