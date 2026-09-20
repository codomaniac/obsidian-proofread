import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";

import { fragmentMatches } from "../findings/anchor.ts";
import type { Finding } from "../findings/schema.ts";

export interface EditorFinding {
	finding: Finding;
	from: number;
	to: number;
	/** The author has changed this text since the finding was reported. */
	edited: boolean;
}

/** Replaces the lot; the values must be anchored against the current document. */
export const setFindings = StateEffect.define<EditorFinding[]>();

/** Takes one finding out — resolved, dismissed, or gone. */
export const dropFinding = StateEffect.define<string>();

export const findingsField = StateField.define<EditorFinding[]>({
	create() {
		return [];
	},

	update(items, transaction) {
		let next = items;

		if (transaction.docChanged) {
			const document = transaction.newDoc;
			next = [];
			for (const item of items) {
				const from = transaction.changes.mapPos(item.from, 1);
				const to = transaction.changes.mapPos(item.to, -1);
				if (to <= from) continue; // the range was typed away entirely
				next.push({
					...item,
					from,
					to,
					edited: !fragmentMatches(document.sliceString(from, to), item.finding.fragment),
				});
			}
		}

		for (const effect of transaction.effects) {
			if (effect.is(setFindings)) next = effect.value;
			else if (effect.is(dropFinding)) next = next.filter((item) => item.finding.id !== effect.value);
		}

		return next;
	},
});

export function openFindings(items: EditorFinding[]): EditorFinding[] {
	return items.filter((item) => !item.edited);
}

/**
 * Every finding covering `position`, innermost first — a comma splice and the
 * nominalization inside it can both be live at the same character.
 */
export function findingsAt(items: EditorFinding[], position: number): EditorFinding[] {
	return items
		.filter((item) => !item.edited && position >= item.from && position <= item.to)
		.sort((a, b) => a.to - a.from - (b.to - b.from));
}

function buildDecorations(items: EditorFinding[]): DecorationSet {
	const ranges = openFindings(items)
		.slice()
		.sort((a, b) => a.from - b.from || a.to - b.to)
		.map((item) =>
			Decoration.mark({
				class: `proofread-finding proofread-${item.finding.category}`,
				attributes: { "data-proofread-id": item.finding.id },
			}).range(item.from, item.to),
		);

	return Decoration.set(ranges, true);
}

export const findingDecorations = EditorView.decorations.compute([findingsField], (state) =>
	buildDecorations(state.field(findingsField)),
);
