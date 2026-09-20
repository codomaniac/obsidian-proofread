import type { Finding } from "../findings/schema.ts";

const CATEGORY_LABELS: Record<Finding["category"], string> = {
	mechanical: "mechanical",
	vocabulary: "vocabulary",
	clutter: "clutter",
};

/**
 * The card is the teaching surface: the rule matters more than the finding.
 * It never carries a rewritten sentence — a vocabulary finding offers the word
 * and its definition, and the author decides what to do with it.
 */
export function renderCard(parent: HTMLElement, finding: Finding, alsoHere = 0): void {
	const head = parent.createDiv({ cls: "proofread-card-head" });
	head.createSpan({
		cls: `proofread-chip proofread-chip-${finding.category}`,
		text: CATEGORY_LABELS[finding.category],
	});
	if (finding.rule) head.createSpan({ cls: "proofread-rule", text: finding.rule });

	parent.createEl("blockquote", { cls: "proofread-fragment", text: finding.fragment });

	if (finding.note) parent.createEl("p", { cls: "proofread-note", text: finding.note });

	if (finding.word) {
		const offered = parent.createEl("p", { cls: "proofread-word" });
		offered.createEl("strong", { text: finding.word });
		if (finding.definition) offered.createSpan({ text: ` — ${finding.definition}` });
	}

	if (alsoHere > 0) {
		parent.createEl("p", {
			cls: "proofread-also",
			text: alsoHere === 1 ? "1 more finding here" : `${alsoHere} more findings here`,
		});
	}
}
