/**
 * Text normalisation shared by finding ids and by anchoring.
 *
 * A model quoting a fragment back will not reproduce the note's typography: it
 * straightens curly quotes, spells an ellipsis as three dots, and turns a line
 * wrap into a space. Both sides are normalised before they are compared.
 */

const CHARACTERS: Record<string, string> = {
	"‘": "'",
	"’": "'",
	"‚": "'",
	"‛": "'",
	"′": "'",
	"“": '"',
	"”": '"',
	"„": '"',
	"″": '"',
	"–": "-",
	"—": "-",
	"―": "-",
	"−": "-",
	"…": "...",
};

/** The replacement for one source character; may be longer than one character. */
export function mapCharacter(character: string): string {
	return CHARACTERS[character] ?? character;
}

export function isWhitespace(character: string): boolean {
	return /\s/.test(character);
}

/** Collapses whitespace, straightens typography, trims the ends. */
export function normalizeText(input: string): string {
	let out = "";
	let pendingSpace = false;

	for (const character of input) {
		if (isWhitespace(character)) {
			pendingSpace = out.length > 0;
			continue;
		}
		if (pendingSpace) {
			out += " ";
			pendingSpace = false;
		}
		out += mapCharacter(character);
	}

	return out;
}
