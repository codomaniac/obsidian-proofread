import assert from "node:assert/strict";
import { test } from "node:test";

import { FindingStore } from "../src/findings/store.ts";

test("resolving and dismissing are exclusive", () => {
	const store = new FindingStore();
	store.resolve("one.md", "a");
	assert.equal(store.statusOf("one.md", "a"), "resolved");

	store.dismiss("one.md", "a");
	assert.equal(store.statusOf("one.md", "a"), "dismissed");
	assert.deepEqual(store.toJSON()["one.md"], { resolved: [], dismissed: ["a"] });
});

test("a decision survives a round trip through data.json", () => {
	const store = new FindingStore();
	store.dismiss("one.md", "a");
	store.resolve("two.md", "b");

	const restored = new FindingStore();
	restored.load(JSON.parse(JSON.stringify(store.toJSON())));

	assert.equal(restored.statusOf("one.md", "a"), "dismissed");
	assert.equal(restored.statusOf("two.md", "b"), "resolved");
});

test("pruning forgets resolved findings but never dismissals", () => {
	const store = new FindingStore();
	store.resolve("one.md", "gone");
	store.resolve("one.md", "still-reported");
	store.dismiss("one.md", "kept");

	store.pruneResolved("one.md", ["still-reported"]);

	assert.equal(store.statusOf("one.md", "gone"), "open");
	assert.equal(store.statusOf("one.md", "still-reported"), "resolved");
	assert.equal(store.statusOf("one.md", "kept"), "dismissed");
});

test("a note with nothing decided about it leaves no record", () => {
	const store = new FindingStore();
	store.resolve("one.md", "a");
	store.pruneResolved("one.md", []);
	assert.deepEqual(store.toJSON(), {});
});

test("renaming a note carries its decisions across", () => {
	const store = new FindingStore();
	store.dismiss("old.md", "a");
	store.rename("old.md", "new.md");

	assert.equal(store.statusOf("new.md", "a"), "dismissed");
	assert.equal(store.statusOf("old.md", "a"), "open");
});

test("reopening puts a finding back in play", () => {
	const store = new FindingStore();
	store.dismiss("one.md", "a");
	store.reopen("one.md", "a");
	assert.equal(store.statusOf("one.md", "a"), "open");
});

test("junk in data.json is ignored rather than thrown over", () => {
	const store = new FindingStore();
	store.load({ "one.md": "not a state", "two.md": { dismissed: ["a"] } });
	assert.equal(store.statusOf("one.md", "a"), "open");
	assert.equal(store.statusOf("two.md", "a"), "dismissed");
});
