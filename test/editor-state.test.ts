import assert from "node:assert/strict";
import { test } from "node:test";

import { EditorState } from "@codemirror/state";

import {
	type EditorFinding,
	dropFinding,
	findingsAt,
	findingsField,
	openFindings,
	setFindings,
} from "../src/editor/state.ts";
import type { Finding } from "../src/findings/schema.ts";

function item(fragment: string, from: number, to: number, id = fragment): EditorFinding {
	const finding: Finding = {
		id,
		category: "clutter",
		rule: "qualifier",
		fragment,
		occurrence: 1,
		note: "",
	};
	return { finding, from, to, edited: false };
}

function stateWith(doc: string, items: EditorFinding[]): EditorState {
	const state = EditorState.create({ doc, extensions: [findingsField] });
	return state.update({ effects: setFindings.of(items) }).state;
}

test("a finding moves when text is inserted before it", () => {
	const state = stateWith("It was very useful.", [item("very useful", 7, 18)]);
	const next = state.update({ changes: { from: 0, insert: "Frankly: " } }).state;

	const [moved] = next.field(findingsField);
	assert.equal(next.doc.sliceString(moved.from, moved.to), "very useful");
	assert.equal(moved.edited, false);
});

test("a finding whose text the author rewrote is no longer decorated", () => {
	const state = stateWith("It was very useful.", [item("very useful", 7, 18)]);
	const next = state.update({ changes: { from: 7, to: 11, insert: "" } }).state;

	const [changed] = next.field(findingsField);
	assert.equal(changed.edited, true);
	assert.equal(openFindings(next.field(findingsField)).length, 0);
});

test("a finding typed away entirely is dropped", () => {
	const state = stateWith("It was very useful.", [item("very useful", 7, 18)]);
	const next = state.update({ changes: { from: 7, to: 18, insert: "" } }).state;

	assert.equal(next.field(findingsField).length, 0);
});

test("a fix applied in one transaction leaves nothing behind", () => {
	const state = stateWith("It was very useful.", [item("very useful", 7, 18)]);
	const next = state.update({
		changes: { from: 7, to: 18, insert: "useful" },
		effects: dropFinding.of("very useful"),
	}).state;

	assert.equal(next.doc.toString(), "It was useful.");
	assert.equal(next.field(findingsField).length, 0);
});

test("overlapping findings come back innermost first", () => {
	const state = stateWith("It was very useful, and it worked.", [
		item("whole clause", 0, 18, "outer"),
		item("very", 7, 11, "inner"),
	]);

	const here = findingsAt(state.field(findingsField), 9);
	assert.deepEqual(
		here.map((one) => one.finding.id),
		["inner", "outer"],
	);
});

test("a finding outside the clicked position is not offered", () => {
	const state = stateWith("It was very useful.", [item("very", 7, 11)]);
	assert.equal(findingsAt(state.field(findingsField), 2).length, 0);
});
