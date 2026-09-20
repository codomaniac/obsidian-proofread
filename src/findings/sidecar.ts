import { type App, normalizePath } from "obsidian";

import { type FindingReport, parseReport } from "./schema.ts";

export interface SidecarLoad {
	report: FindingReport;
	problems: string[];
	modified: number;
}

/** `content/posts/one.md` → `.proofread/content/posts/one.md.json`. */
export function sidecarPath(folder: string, notePath: string): string {
	return normalizePath(`${folder}/${notePath}.json`);
}

/** The mtime of a note's sidecar, or null when there is none. */
export async function sidecarModified(app: App, path: string): Promise<number | null> {
	try {
		const stat = await app.vault.adapter.stat(path);
		return stat?.mtime ?? null;
	} catch {
		return null;
	}
}

/**
 * Read through the adapter rather than the vault: a dot-prefixed folder is not
 * in Obsidian's file index, so `getAbstractFileByPath` never finds it.
 */
export async function readSidecar(app: App, path: string): Promise<SidecarLoad | null> {
	const modified = await sidecarModified(app, path);
	if (modified === null) return null;

	let raw: unknown;
	try {
		raw = JSON.parse(await app.vault.adapter.read(path));
	} catch (error) {
		return {
			report: { file: "", findings: [] },
			problems: [`${path} is not readable JSON: ${String(error)}`],
			modified,
		};
	}

	const { report, problems } = parseReport(raw);
	return {
		report: report ?? { file: "", findings: [] },
		problems: report ? problems : [`${path} is not a findings report`, ...problems],
		modified,
	};
}
