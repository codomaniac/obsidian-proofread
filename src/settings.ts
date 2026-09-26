import type { FindingCategory } from "./findings/schema.ts";

export interface ProofreadSettings {
	/** Vault-relative folder the sidecar reports live in. Dot-prefixed, so
	 * Obsidian keeps it out of the file explorer and out of search. */
	sidecarFolder: string;
	/** How often to restat the sidecar of the open note; 0 turns it off.
	 * Obsidian fires no vault events for dot-folders, so there is nothing to
	 * subscribe to. */
	pollSeconds: number;
	/** Which of the four kinds to draw. */
	show: Record<FindingCategory, boolean>;
	/** Open the panel by itself when a note turns out to have findings. */
	autoOpenPanel: boolean;
}

export const DEFAULT_SETTINGS: ProofreadSettings = {
	sidecarFolder: ".proofread",
	pollSeconds: 2,
	show: { mechanical: true, vocabulary: true, clutter: true, clarity: true },
	autoOpenPanel: false,
};
