import { normalizeText } from "./text.ts";

/** The three things the proofread skill reports, and nothing else. */
export const CATEGORIES = ["mechanical", "vocabulary", "clutter"] as const;

export type FindingCategory = (typeof CATEGORIES)[number];

export interface Finding {
	/** Stable across runs, so a dismissal survives re-proofreading. */
	id: string;
	category: FindingCategory;
	/** The named principle: "article", "qualifier", "nominalization". */
	rule: string;
	/** Text quoted from the note, as the anchor. */
	fragment: string;
	/** Which occurrence of `fragment` in the note, 1-based. */
	occurrence: number;
	/** The sentence stating the rule — the point of the exercise. */
	note: string;
	/** Vocabulary findings: the word the author is talking around. */
	word?: string;
	definition?: string;
	/** A hint only. Models miscount lines; the fragment is what anchors. */
	line?: number;
}

export interface FindingReport {
	file: string;
	generatedAt?: string;
	findings: Finding[];
}

export interface ParseResult {
	report: FindingReport | null;
	problems: string[];
}

const CATEGORY_SET = new Set<string>(CATEGORIES);

/** FNV-1a, run twice with different offsets for a 64-bit id. */
function hash(input: string): string {
	const digest = (offset: number): string => {
		let value = offset;
		for (let i = 0; i < input.length; i++) {
			value ^= input.charCodeAt(i);
			value = Math.imul(value, 0x01000193) >>> 0;
		}
		return value.toString(36).padStart(7, "0");
	};
	return `${digest(0x811c9dc5)}${digest(0x1000193)}`;
}

/**
 * The identity of a finding is what it points at and what it says about it —
 * never its position, which moves as the note is edited.
 */
export function findingId(
	category: string,
	rule: string,
	fragment: string,
	occurrence: number,
): string {
	return hash(
		[category, rule.toLowerCase(), normalizeText(fragment), occurrence].join("\u0000"),
	);
}

function asString(value: unknown): string {
	return typeof value === "string" ? value.trim() : "";
}

function parseFinding(raw: unknown, index: number, problems: string[]): Finding | null {
	if (typeof raw !== "object" || raw === null) {
		problems.push(`finding ${index}: not an object`);
		return null;
	}
	const source = raw as Record<string, unknown>;

	const fragment = asString(source.fragment);
	if (fragment === "") {
		problems.push(`finding ${index}: no fragment to anchor to`);
		return null;
	}

	const category = asString(source.category).toLowerCase();
	if (!CATEGORY_SET.has(category)) {
		problems.push(`finding ${index}: unknown category ${JSON.stringify(source.category)}`);
		return null;
	}

	const occurrence =
		typeof source.occurrence === "number" && Number.isInteger(source.occurrence) && source.occurrence > 0
			? source.occurrence
			: 1;

	const rule = asString(source.rule);
	const finding: Finding = {
		id: asString(source.id) || findingId(category, rule, fragment, occurrence),
		category: category as FindingCategory,
		rule,
		fragment,
		occurrence,
		note: asString(source.note),
	};

	const word = asString(source.word);
	if (word !== "") finding.word = word;
	const definition = asString(source.definition);
	if (definition !== "") finding.definition = definition;
	if (typeof source.line === "number" && source.line > 0) finding.line = Math.floor(source.line);

	return finding;
}

/**
 * Tolerant on purpose: one malformed finding is dropped and reported rather
 * than costing the author the rest of the run.
 */
export function parseReport(raw: unknown): ParseResult {
	const problems: string[] = [];

	if (typeof raw !== "object" || raw === null) {
		return { report: null, problems: ["not a JSON object"] };
	}
	const source = raw as Record<string, unknown>;

	if (!Array.isArray(source.findings)) {
		return { report: null, problems: ["no findings array"] };
	}

	const findings: Finding[] = [];
	const seen = new Set<string>();
	source.findings.forEach((entry, index) => {
		const finding = parseFinding(entry, index, problems);
		if (!finding) return;
		if (seen.has(finding.id)) {
			problems.push(`finding ${index}: duplicate of an earlier one`);
			return;
		}
		seen.add(finding.id);
		findings.push(finding);
	});

	return {
		report: {
			file: asString(source.file),
			generatedAt: asString(source.generatedAt) || undefined,
			findings,
		},
		problems,
	};
}
