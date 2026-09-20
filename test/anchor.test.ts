import assert from "node:assert/strict";
import { test } from "node:test";

import { anchorFindings, fragmentMatches, normalizeDocument } from "../src/findings/anchor.ts";
import type { Finding } from "../src/findings/schema.ts";

function finding(fragment: string, extra: Partial<Finding> = {}): Finding {
	return {
		id: "test",
		category: "clutter",
		rule: "qualifier",
		fragment,
		occurrence: 1,
		note: "",
		...extra,
	};
}

function anchored(source: string, one: Finding): string | null {
	const [result] = anchorFindings(source, [one]);
	return result.anchor ? source.slice(result.anchor.from, result.anchor.to) : null;
}

test("the offset map survives a collapsed line wrap", () => {
	const source = "It was a very\nuseful note.";
	assert.equal(anchored(source, finding("very useful")), "very\nuseful");
});

test("a straightened quote still finds the curly one", () => {
	const source = "The author’s own words.";
	assert.equal(anchored(source, finding("author's own")), "author’s own");
});

test("occurrence picks which one", () => {
	const source = "very good and very bad";
	assert.equal(anchorFindings(source, [finding("very", { occurrence: 2 })])[0].anchor?.from, 14);
});

test("an out-of-range occurrence falls back to the line hint", () => {
	const source = "very one\nvery two\nvery three\n";
	const result = anchorFindings(source, [finding("very", { occurrence: 9, line: 3 })])[0];
	assert.equal(result.anchor?.from, 18);
});

test("an ellipsis quote spans what it skipped", () => {
	const source = "In order to see the point, you must read it all the way through.";
	assert.equal(
		anchored(source, finding("In order to ... all the way")),
		"In order to see the point, you must read it all the way",
	);
});

test("emphasis markers do not hide the fragment", () => {
	const source = "It was *very* useful.";
	assert.equal(anchored(source, finding("very useful")), "*very* useful");
});

test("case is the last resort, not the first", () => {
	const source = "Very useful and very useful";
	assert.equal(anchorFindings(source, [finding("very useful")])[0].anchor?.from, 16);
	assert.equal(anchorFindings(source, [finding("Very useful")])[0].anchor?.from, 0);
});

test("a fragment that is gone anchors nowhere", () => {
	assert.equal(anchored("The note now reads differently.", finding("in order to")), null);
});

test("quote marks around the fragment are not part of it", () => {
	assert.equal(anchored("It was very useful.", finding('"very useful"')), "very useful");
});

test("fragmentMatches notices the author fixing it", () => {
	assert.ok(fragmentMatches("very  useful", "very useful"));
	assert.equal(fragmentMatches("useful", "very useful"), false);
});

test("fragmentMatches accepts an ellipsis quote it cannot compare whole", () => {
	assert.ok(fragmentMatches("In order to see the point, read on", "In order to ... read on"));
});

test("line starts are counted in source offsets", () => {
	const { lineStarts } = normalizeDocument("one\ntwo\nthree");
	assert.deepEqual(lineStarts, [0, 4, 8]);
});
