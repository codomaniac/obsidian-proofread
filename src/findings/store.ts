export type FindingStatus = "open" | "resolved" | "dismissed";

export interface StoredFileState {
	resolved: string[];
	dismissed: string[];
}

interface FileState {
	resolved: Set<string>;
	dismissed: Set<string>;
}

/**
 * What the author has already dealt with, per note.
 *
 * Resolved and dismissed are kept apart because they age differently. A
 * resolved finding is one whose text has changed, so the next run will not
 * report it and the record can be pruned. A dismissal is a judgement — the
 * author read the rule and kept the word — and has to outlive every re-run,
 * or the same `very` comes back every time.
 */
export class FindingStore {
	private files = new Map<string, FileState>();

	load(raw: unknown): void {
		this.files.clear();
		if (typeof raw !== "object" || raw === null) return;

		for (const [path, value] of Object.entries(raw as Record<string, unknown>)) {
			if (typeof value !== "object" || value === null) continue;
			const state = value as Partial<StoredFileState>;
			this.files.set(path, {
				resolved: new Set(Array.isArray(state.resolved) ? state.resolved : []),
				dismissed: new Set(Array.isArray(state.dismissed) ? state.dismissed : []),
			});
		}
	}

	toJSON(): Record<string, StoredFileState> {
		const out: Record<string, StoredFileState> = {};
		for (const [path, state] of this.files) {
			if (state.resolved.size === 0 && state.dismissed.size === 0) continue;
			out[path] = { resolved: [...state.resolved], dismissed: [...state.dismissed] };
		}
		return out;
	}

	private stateFor(path: string): FileState {
		let state = this.files.get(path);
		if (!state) {
			state = { resolved: new Set(), dismissed: new Set() };
			this.files.set(path, state);
		}
		return state;
	}

	statusOf(path: string, id: string): FindingStatus {
		const state = this.files.get(path);
		if (!state) return "open";
		if (state.dismissed.has(id)) return "dismissed";
		if (state.resolved.has(id)) return "resolved";
		return "open";
	}

	resolve(path: string, id: string): void {
		const state = this.stateFor(path);
		state.dismissed.delete(id);
		state.resolved.add(id);
	}

	dismiss(path: string, id: string): void {
		const state = this.stateFor(path);
		state.resolved.delete(id);
		state.dismissed.add(id);
	}

	/** Puts a finding back in play — the author changed their mind. */
	reopen(path: string, id: string): void {
		const state = this.files.get(path);
		state?.resolved.delete(id);
		state?.dismissed.delete(id);
	}

	/** A note that was renamed keeps what the author decided about it. */
	rename(from: string, to: string): void {
		const state = this.files.get(from);
		if (!state) return;
		this.files.delete(from);
		this.files.set(to, state);
	}

	forget(path: string): void {
		this.files.delete(path);
	}

	/**
	 * Drops resolved ids the latest report no longer mentions. Dismissals are
	 * left alone: not being reported is exactly what a dismissal buys.
	 */
	pruneResolved(path: string, reported: Iterable<string>): void {
		const state = this.files.get(path);
		if (!state) return;

		const live = new Set(reported);
		for (const id of state.resolved) {
			if (!live.has(id)) state.resolved.delete(id);
		}
		if (state.resolved.size === 0 && state.dismissed.size === 0) this.files.delete(path);
	}
}
