import type * as ChildProcess from "node:child_process";

export interface ProofreadRun {
	/** The `claude` executable, a bare name resolved on PATH or an absolute path. */
	command: string;
	/** A Claude Code alias for `--model`, such as sonnet or opus. */
	model: string;
	/** The vault root; the skill resolves the note and its report against it. */
	cwd: string;
	/** Vault-relative path of the note. */
	notePath: string;
	/** Vault-relative folder the report goes under. */
	reportFolder: string;
}

/**
 * Runs the proofread skill headless; the skill writes the report itself and
 * polling picks it up. Writes are limited to the report folder so a run can
 * never touch the note.
 */
export function runProofread(run: ProofreadRun): Promise<void> {
	const folder = run.reportFolder.replace(/\/+$/, "");
	// The skill writes under `.proofread` unless told otherwise.
	const ask =
		folder === ".proofread"
			? `/proofread:proofread ${run.notePath}`
			: `/proofread:proofread ${run.notePath} (report folder: ${folder})`;
	const args = [
		"-p",
		ask,
		"--allowedTools",
		"Skill",
		"Read",
		`Edit(${folder}/**)`,
		"--no-session-persistence",
	];
	args.push("--model", run.model);

	// Required here, not imported: mobile has no child_process and would fail at load.
	const { spawn } = require("child_process") as typeof ChildProcess;

	return new Promise((resolve, reject) => {
		const child = spawn(run.command, args, { cwd: run.cwd, stdio: ["ignore", "pipe", "pipe"] });

		let output = "";
		const collect = (chunk: Buffer) => {
			output = (output + chunk.toString()).slice(-2000);
		};
		child.stdout.on("data", collect);
		child.stderr.on("data", collect);

		child.on("error", (error) => reject(error));
		child.on("close", (code) => {
			if (code === 0) resolve();
			else reject(new Error(output.trim() || `claude exited with code ${code}`));
		});
	});
}
