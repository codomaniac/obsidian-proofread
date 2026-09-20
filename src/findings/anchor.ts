import type { Finding } from "./schema.ts";
import { isWhitespace, mapCharacter, normalizeText } from "./text.ts";

export interface Anchor {
	from: number;
	to: number;
}

export interface AnchoredFinding {
	finding: Finding;
	/** Null when the fragment is no longer in the note. */
	anchor: Anchor | null;
}

/** How much text an ellipsis inside a quoted fragment may stand for. */
const GAP_LIMIT = 240;

/** Dropped on the second pass, so a quote of *emphasised* prose still lands. */
const MARKDOWN_MARKS = new Set(["*", "_", "`", "~"]);

interface NormalizedDocument {
	text: string;
	/** Source offset each normalised character came from. */
	starts: number[];
	/** Source offset just past it. */
	ends: number[];
	lineStarts: number[];
}

/** Lowercases a character only when doing so keeps the offset map honest. */
function lowerSafely(character: string): string {
	const lowered = character.toLowerCase();
	return lowered.length === character.length ? lowered : character;
}

export function normalizeDocument(source: string, drop?: Set<string>): NormalizedDocument {
	const text: string[] = [];
	const starts: number[] = [];
	const ends: number[] = [];
	const lineStarts: number[] = [0];

	let pendingSpaceFrom = -1;
	let index = 0;

	while (index < source.length) {
		const codePoint = source.codePointAt(index) as number;
		const character = String.fromCodePoint(codePoint);
		const width = character.length;

		if (character === "\n") lineStarts.push(index + width);

		if (isWhitespace(character)) {
			if (text.length > 0 && pendingSpaceFrom < 0) pendingSpaceFrom = index;
			index += width;
			continue;
		}

		if (drop?.has(character)) {
			index += width;
			continue;
		}

		if (pendingSpaceFrom >= 0) {
			text.push(" ");
			starts.push(pendingSpaceFrom);
			ends.push(index);
			pendingSpaceFrom = -1;
		}

		for (const mapped of mapCharacter(character)) {
			text.push(mapped);
			starts.push(index);
			ends.push(index + width);
		}
		index += width;
	}

	return { text: text.join(""), starts, ends, lineStarts };
}

function indexOfAll(haystack: string, needle: string): number[] {
	const found: number[] = [];
	let at = haystack.indexOf(needle);
	while (at >= 0) {
		found.push(at);
		at = haystack.indexOf(needle, at + 1);
	}
	return found;
}

/** Each segment must follow the last, close enough that the ellipsis is plausible. */
function findSequences(haystack: string, segments: string[]): Array<[number, number]> {
	const matches: Array<[number, number]> = [];

	for (const start of indexOfAll(haystack, segments[0])) {
		let cursor = start + segments[0].length;
		let complete = true;

		for (let i = 1; i < segments.length; i++) {
			const next = haystack.indexOf(segments[i], cursor);
			if (next < 0 || next - cursor > GAP_LIMIT) {
				complete = false;
				break;
			}
			cursor = next + segments[i].length;
		}

		if (complete) matches.push([start, cursor]);
	}

	return matches;
}

/** A model quotes with whatever punctuation it likes; the quote marks are not the fragment. */
function unquote(fragment: string): string {
	return fragment.replace(/^["'`“‘]+/, "").replace(/["'`”’]+$/, "");
}

function segmentsOf(fragment: string): string[] {
	return fragment
		.split("...")
		.map((part) => part.trim())
		.filter((part) => part.length > 0);
}

function chooseMatch(
	matches: Array<[number, number]>,
	occurrence: number,
	hintOffset: number | null,
	starts: number[],
): [number, number] | null {
	if (matches.length === 0) return null;
	if (occurrence <= matches.length) return matches[occurrence - 1];

	// The model counted occurrences that are no longer all there. Trust the
	// line hint if we have one, and the first match otherwise.
	if (hintOffset === null) return matches[0];

	let best = matches[0];
	let bestDistance = Number.POSITIVE_INFINITY;
	for (const match of matches) {
		const distance = Math.abs(starts[match[0]] - hintOffset);
		if (distance < bestDistance) {
			bestDistance = distance;
			best = match;
		}
	}
	return best;
}

function searchIn(
	document: NormalizedDocument,
	fragment: string,
	occurrence: number,
	line: number | undefined,
): Anchor | null {
	const segments = segmentsOf(normalizeText(unquote(fragment)));
	if (segments.length === 0) return null;

	const hintOffset =
		line !== undefined && line >= 1 && line <= document.lineStarts.length
			? document.lineStarts[line - 1]
			: null;

	let matches = findSequences(document.text, segments);

	if (matches.length === 0) {
		const lowerText = [...document.text].map(lowerSafely).join("");
		const lowerSegments = segments.map((segment) => [...segment].map(lowerSafely).join(""));
		matches = findSequences(lowerText, lowerSegments);
	}

	const match = chooseMatch(matches, occurrence, hintOffset, document.starts);
	if (!match) return null;

	return { from: document.starts[match[0]], to: document.ends[match[1] - 1] };
}

/**
 * A loose match stops at the prose, leaving the emphasis it sits inside half
 * covered. Take the adjacent markers in too, so the highlight is a whole word.
 */
function expandOverMarks(source: string, anchor: Anchor): Anchor {
	let { from, to } = anchor;
	while (from > 0 && MARKDOWN_MARKS.has(source[from - 1])) from--;
	while (to < source.length && MARKDOWN_MARKS.has(source[to])) to++;
	return { from, to };
}

/**
 * Anchors every finding in one pass over the note. Strict first; anything that
 * misses is retried against a copy with emphasis markers removed, since a
 * quoted fragment rarely carries the asterisks around it.
 */
export function anchorFindings(source: string, findings: Finding[]): AnchoredFinding[] {
	const strict = normalizeDocument(source);
	let loose: NormalizedDocument | null = null;

	return findings.map((finding) => {
		let anchor = searchIn(strict, finding.fragment, finding.occurrence, finding.line);

		if (!anchor) {
			loose ??= normalizeDocument(source, MARKDOWN_MARKS);
			anchor = searchIn(loose, finding.fragment, finding.occurrence, finding.line);
			if (anchor) anchor = expandOverMarks(source, anchor);
		}

		return { finding, anchor };
	});
}

/** True while the note still reads the way the finding says it does. */
export function anchorStillMatches(source: string, anchor: Anchor, fragment: string): boolean {
	const inNote = normalizeText(source.slice(anchor.from, anchor.to));
	const quoted = normalizeText(unquote(fragment));
	if (inNote === quoted) return true;

	// An ellipsis quote never matches whole; compare what it does pin down.
	const segments = segmentsOf(quoted);
	return segments.length > 1 && findSequences(inNote, segments).length > 0;
}
