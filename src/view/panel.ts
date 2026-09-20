import { ItemView, type WorkspaceLeaf, setIcon } from "obsidian";

import { renderCard } from "../editor/card.ts";
import { type EditorFinding, findingsField } from "../editor/state.ts";
import type { Finding } from "../findings/schema.ts";
import type { FindingStatus } from "../findings/store.ts";
import type ProofreadPlugin from "../main.ts";

export const PANEL_VIEW_TYPE = "proofread-findings";

interface Row {
	finding: Finding;
	status: FindingStatus;
	/** Where it sits in the note, when it still sits anywhere. */
	item: EditorFinding | undefined;
}

export class FindingsPanel extends ItemView {
	private showDealtWith = false;

	constructor(
		leaf: WorkspaceLeaf,
		private readonly plugin: ProofreadPlugin,
	) {
		super(leaf);
	}

	override getViewType(): string {
		return PANEL_VIEW_TYPE;
	}

	override getDisplayText(): string {
		return "Proofread findings";
	}

	override getIcon(): string {
		return "spell-check";
	}

	override async onOpen(): Promise<void> {
		this.render();
	}

	private rows(path: string | undefined): Row[] {
		if (!path) return [];

		const items = this.plugin.editorView()?.state.field(findingsField) ?? [];
		const byId = new Map(items.map((item) => [item.finding.id, item]));

		return this.plugin.report.map((finding) => ({
			finding,
			status: this.plugin.store.statusOf(path, finding.id),
			item: byId.get(finding.id),
		}));
	}

	render(): void {
		const container = this.contentEl;
		container.empty();
		container.addClass("proofread-panel");

		const file = this.app.workspace.getActiveFile();
		const rows = this.rows(file?.path);

		this.renderHeader(container, rows);

		if (rows.length === 0) {
			container.createEl("p", {
				cls: "proofread-empty",
				text: file
					? "No report for this note yet."
					: "Open a note to see its findings.",
			});
			return;
		}

		const open = rows.filter((row) => row.status === "open" && row.item && !row.item.edited);
		open.sort((a, b) => (a.item?.from ?? 0) - (b.item?.from ?? 0));

		const changed = rows.filter((row) => row.status === "open" && (!row.item || row.item.edited));
		const dealtWith = rows.filter((row) => row.status !== "open");

		this.renderGroup(container, open, null);
		this.renderGroup(container, changed, "Changed since the report");
		if (this.showDealtWith) this.renderGroup(container, dealtWith, "Resolved and dismissed");
	}

	private renderHeader(container: HTMLElement, rows: Row[]): void {
		const header = container.createDiv({ cls: "proofread-panel-head" });

		const open = rows.filter((row) => row.status === "open" && row.item && !row.item.edited).length;
		const dealtWith = rows.filter((row) => row.status !== "open").length;
		header.createSpan({
			cls: "proofread-count",
			text: open === 1 ? "1 open finding" : `${open} open findings`,
		});

		const buttons = header.createDiv({ cls: "proofread-panel-buttons" });

		const reload = buttons.createEl("button", { attr: { "aria-label": "Reload findings" } });
		setIcon(reload, "refresh-cw");
		reload.addEventListener("click", () => {
			const file = this.app.workspace.getActiveFile();
			if (file) void this.plugin.loadFindings(file, true);
		});

		if (dealtWith > 0) {
			const toggle = buttons.createEl("button", {
				text: this.showDealtWith ? `Hide ${dealtWith} dealt with` : `Show ${dealtWith} dealt with`,
			});
			toggle.addEventListener("click", () => {
				this.showDealtWith = !this.showDealtWith;
				this.render();
			});
		}

		if (this.plugin.problems.length > 0) {
			const problems = container.createDiv({ cls: "proofread-problems" });
			problems.createSpan({ text: `${this.plugin.problems.length} problems in the report` });
			problems.setAttribute("aria-label", this.plugin.problems.join("\n"));
		}
	}

	private renderGroup(container: HTMLElement, rows: Row[], title: string | null): void {
		if (rows.length === 0) return;

		if (title) container.createEl("h4", { cls: "proofread-group", text: title });

		for (const row of rows) {
			const entry = container.createDiv({
				cls: `proofread-row proofread-row-${row.status}`,
			});
			if (!row.item || row.item.edited) entry.addClass("proofread-row-adrift");

			renderCard(entry, row.finding);

			if (!row.item) {
				entry.createEl("p", {
					cls: "proofread-adrift-note",
					text: "Not in the note any more.",
				});
			} else if (row.item.edited) {
				entry.createEl("p", { cls: "proofread-adrift-note", text: "This text has changed." });
			} else {
				entry.addEventListener("click", () => this.plugin.revealFinding(row.finding.id));
			}

			this.renderActions(entry, row);
		}
	}

	private renderActions(entry: HTMLElement, row: Row): void {
		const path = this.app.workspace.getActiveFile()?.path;
		if (!path) return;

		const actions = entry.createDiv({ cls: "proofread-row-actions" });
		const stop = (event: MouseEvent): void => event.stopPropagation();

		if (row.status === "open") {
			const resolve = actions.createEl("button", { text: "Resolve" });
			resolve.addEventListener("click", (event) => {
				stop(event);
				this.plugin.setStatus(path, row.finding.id, "resolved");
			});

			const dismiss = actions.createEl("button", { text: "Dismiss" });
			dismiss.addEventListener("click", (event) => {
				stop(event);
				this.plugin.setStatus(path, row.finding.id, "dismissed");
			});
		} else {
			const reopen = actions.createEl("button", { text: "Bring back" });
			reopen.addEventListener("click", (event) => {
				stop(event);
				this.plugin.setStatus(path, row.finding.id, "open");
			});
		}
	}
}
