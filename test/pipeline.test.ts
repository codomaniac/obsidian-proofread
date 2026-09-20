import assert from "node:assert/strict";
import { test } from "node:test";

import { EditorState } from "@codemirror/state";

import { type EditorFinding, findingsField, openFindings, setFindings } from "../src/editor/state.ts";
import { anchorFindings } from "../src/findings/anchor.ts";
import { parseReport } from "../src/findings/schema.ts";

const NOTE = `---
title: On drafts
---

In order to get the point across, I opened terminal and made a decision
about the thing that comes before the release.

It was *very* useful, and the results were very clear.
`;

const REPORT = {
	file: "posts/drafts.md",
	findings: [
		{ category: "clutter", rule: "clutter", fragment: "In order to", occurrence: 1, line: 5, note: "" },
		{ category: "mechanical", rule: "article", fragment: "I opened terminal", occurrence: 1, note: "" },
		{ category: "clutter", rule: "nominalization", fragment: "made a decision", occurrence: 1, note: "" },
		{
			category: "vocabulary",
			rule: "one word for the clause",
			fragment: "the thing that comes before the release",
			occurrence: 1,
			note: "",
			word: "prelude",
		},
		{ category: "clutter", rule: "qualifier", fragment: "very", occurrence: 2, line: 8, note: "" },
		{ category: "clutter", rule: "clutter", fragment: "at this point in time", occurrence: 1, note: "" },
	],
};

function pipeline(note: string): { state: EditorState; unanchored: number } {
	const { report } = parseReport(REPORT);
	assert.ok(report);

	const items: EditorFinding[] = [];
	let unanchored = 0;

	for (const { finding, anchor } of anchorFindings(note, report.findings)) {
		if (!anchor) {
			unanchored++;
			continue;
		}
		items.push({ finding, from: anchor.from, to: anchor.to, edited: false });
	}

	const state = EditorState.create({ doc: note, extensions: [findingsField] });
	return { state: state.update({ effects: setFindings.of(items) }).state, unanchored };
}

function highlighted(state: EditorState): string[] {
	return openFindings(state.field(findingsField))
		.slice()
		.sort((a, b) => a.from - b.from)
		.map((item) => state.doc.sliceString(item.from, item.to));
}

test("a whole report lands on the words it was written about", () => {
	const { state, unanchored } = pipeline(NOTE);

	assert.deepEqual(highlighted(state), [
		"In order to",
		"I opened terminal",
		"made a decision",
		"the thing that comes before the release",
		"very",
	]);
	assert.equal(unanchored, 1); // "at this point in time" is not in the note
});

test("occurrence counts every match, including one inside emphasis", () => {
	const { state } = pipeline(NOTE);
	const qualifier = state
		.field(findingsField)
		.find((item) => item.finding.rule === "qualifier");

	assert.ok(qualifier);
	assert.equal(state.doc.sliceString(qualifier.from, qualifier.to + 6), "very clear");
});

test("fixing one finding leaves the rest on their own words", () => {
	const { state } = pipeline(NOTE);
	const first = state.field(findingsField).find((item) => item.finding.fragment === "In order to");
	assert.ok(first);

	const fixed = state.update({ changes: { from: first.from, to: first.to, insert: "To" } }).state;

	assert.ok(fixed.doc.toString().startsWith("---\ntitle: On drafts\n---\n\nTo get the point"));
	assert.deepEqual(highlighted(fixed), [
		"I opened terminal",
		"made a decision",
		"the thing that comes before the release",
		"very",
	]);
});
