import assert from "node:assert/strict";
import { test } from "node:test";

import { findingId, parseReport } from "../src/findings/schema.ts";
import { normalizeText } from "../src/findings/text.ts";

test("normalizeText collapses whitespace and straightens typography", () => {
	assert.equal(normalizeText("  the\n  author’s  word  "), "the author's word");
	assert.equal(normalizeText("a — b"), "a - b");
	assert.equal(normalizeText("wait… then"), "wait... then");
	assert.equal(normalizeText("“quoted”"), '"quoted"');
});

test("a finding keeps its id when the note is retyped around it", () => {
	const a = findingId("clutter", "qualifier", "very useful", 1);
	const b = findingId("clutter", "Qualifier", "very  useful", 1);
	assert.equal(a, b);
});

test("a different occurrence is a different finding", () => {
	assert.notEqual(
		findingId("clutter", "qualifier", "very useful", 1),
		findingId("clutter", "qualifier", "very useful", 2),
	);
});

test("parseReport keeps the good findings and reports the rest", () => {
	const { report, problems } = parseReport({
		file: "posts/one.md",
		findings: [
			{ category: "clutter", rule: "qualifier", fragment: "very", note: "Weakens it." },
			{ category: "banter", rule: "tone", fragment: "hm", note: "" },
			{ category: "mechanical", rule: "article", note: "No fragment." },
			{ category: "clutter", rule: "qualifier", fragment: "very", note: "Again." },
		],
	});

	assert.ok(report);
	assert.equal(report.findings.length, 1);
	assert.equal(report.findings[0].category, "clutter");
	assert.equal(problems.length, 3);
});

test("occurrence defaults to the first and survives a bad value", () => {
	const { report } = parseReport({
		findings: [{ category: "clutter", rule: "clutter", fragment: "in order to", occurrence: 0 }],
	});
	assert.equal(report?.findings[0].occurrence, 1);
});

test("a report that is not a report is rejected rather than half-read", () => {
	assert.equal(parseReport(null).report, null);
	assert.equal(parseReport({ file: "x.md" }).report, null);
});
