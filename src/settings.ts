import type { FindingCategory } from "./findings/schema.ts";

/** Claude Code's aliases, which always point at the newest model of each line. */
export const MODEL_ALIASES = ["sonnet", "opus", "haiku", "fable"] as const;

export type ModelAlias = (typeof MODEL_ALIASES)[number];

/** Anything that is not an alias, an empty value from 0.3.x included, means sonnet. */
export function modelFrom(value: unknown): ModelAlias {
	return MODEL_ALIASES.find((alias) => alias === value) ?? "sonnet";
}

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
	/** The `claude` executable the Proofread button runs. */
	claudePath: string;
	/** Claude Code alias passed to `claude --model`. */
	model: ModelAlias;
}

export const DEFAULT_SETTINGS: ProofreadSettings = {
	sidecarFolder: ".proofread",
	pollSeconds: 2,
	show: { mechanical: true, vocabulary: true, clutter: true, clarity: true },
	autoOpenPanel: false,
	claudePath: "claude",
	model: "sonnet",
};
