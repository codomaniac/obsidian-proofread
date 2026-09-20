# Obsidian Proofread

Draws proofreading findings on a note, so they can be worked through where the prose
is rather than in a chat log. Hover a highlight for the rule behind it; click it to
correct the text in place and mark it done.

The plugin writes no prose of its own. The field in the card is seeded with the
note's own words, and what replaces them is what the author types. A vocabulary
finding offers a word and its definition — never a rewritten sentence.

## How it works

A proofread run leaves a JSON report per note under `.proofread/`. The plugin reads
the report for whichever note is open, anchors each finding to the text it quotes,
and underlines it: red for mechanical errors, accent for a word being talked around,
yellow for clutter.

Findings are anchored by the quoted fragment, not by line number — a model's line
numbers drift, and the note moves under them anyway. Positions are then mapped
through every keystroke, so a highlight never lags behind the text it belongs to,
and a finding whose text has been rewritten stops being drawn rather than sliding
onto prose it was never about.

## The report

`.proofread/<note path>.json`, so `content/posts/one.md` is read from
`.proofread/content/posts/one.md.json`. The folder is dot-prefixed, which keeps it
out of the file explorer, out of search and out of Obsidian's file index.

```json
{
  "file": "content/posts/one.md",
  "findings": [
    {
      "category": "clutter",
      "rule": "qualifier",
      "fragment": "very useful",
      "occurrence": 1,
      "line": 12,
      "note": "`very` weakens the word it was meant to strengthen."
    }
  ]
}
```

| Field | |
| --- | --- |
| `category` | `mechanical`, `vocabulary` or `clutter` |
| `rule` | the named principle — `article`, `qualifier`, `nominalization` |
| `fragment` | text quoted from the note; the anchor. `...` stands for text skipped |
| `occurrence` | which occurrence of `fragment`, 1-based |
| `line` | 1-based, a tie-breaker only |
| `note` | the sentence stating the rule |
| `word`, `definition` | vocabulary findings: the word being talked around |

A malformed finding is dropped and counted rather than costing the run; the panel
says how many.

Anything can write that file. `skills/proofread/SKILL.md` is a Claude Code skill
that does, by following the [standalone proofreading
skill](https://github.com/codomaniac/skills) and writing the result out instead of
listing it.

## Using it

- **Hover** a highlight for the category, the rule and the sentence behind it.
- **Click** it to open the same card with a field holding that text. Enter replaces
  exactly the range the finding covers — one ordinary edit, so undo covers it.
- **Resolve** marks it dealt with. **Dismiss** means the rule was read and the word
  stays; a dismissal survives every later run of the same note.
- The panel (`Proofread: open the findings panel`) lists the lot in document order,
  along with findings the note no longer contains and the ones already dealt with.

Commands: reload the report for this note, open the panel, and bring back everything
resolved or dismissed for this note.

Highlights are drawn in Source and Live Preview. Reading view renders its own HTML
and has none of them.

## Building it

Node is not assumed to be on the PATH; the flake carries it.

```sh
nix develop
npm install
npm run build     # type-check, then bundle to main.js
npm test          # anchoring, parsing, position mapping
npm run dev       # rebuild on change
```

To install it into a vault, copy `main.js`, `manifest.json` and `styles.css` into
`<vault>/.obsidian/plugins/proofread/`, or symlink the repo there.
