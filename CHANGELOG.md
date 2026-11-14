# Changelog

Newest first. Each entry: what changed and why, three sentences at most.

## 2026-11-14 — 0.4.1: screenshots in the README

The README now shows the plugin: a note with its findings, the hover and click card of
each category, the panel and the settings, taken from a demo note rather than a real
one. It also covers the Proofread button and the settings 0.4.0 added. No plugin code
changed; the release is what refreshes the page in the plugin directory.

## 2026-11-14 — 0.4.0: proofread from the note itself

A Proofread button in the note's header, and a command, run the skill through the
`claude` CLI on desktop, so a report no longer means switching to a terminal. Two
settings go with it: the path to `claude`, for when Obsidian does not find it on PATH,
and the model, picked from Claude Code's aliases and defaulting to sonnet. The run may
read files but write only under the report folder, so it can never touch the note.

## 2026-09-27 — 0.3.1: say what writes the report, and what it checks

The README now opens with how to set it up, since the plugin draws nothing without the
Claude Code skill writing a report first, and lays out the four categories against the
three books they come from, with the plugin installed from the community browser. No
plugin code changed; the release is what refreshes the page in the plugin directory.

## 2026-09-26 — proofread skill 0.3.1: the handbook's rules, by name

The skill now carries Hacker and Sommers's *A Writer's Reference* alongside Zinsser
and Williams: the handbook's punctuation, agreement, usage and word-choice rules under
`mechanical` and `clutter`, and its sentence-style chapter — parallelism, needed words,
misplaced modifiers, mixed constructions, pronoun reference, shifts — under `clarity`,
each with a fixed name so the report reads like the editing log the handbook asks the
writer to keep. Only the skill changed, so the Claude Code plugin moves to 0.3.1 and
the Obsidian plugin stays at 0.3.0; no release is needed.

## 2026-09-26 — 0.3.0: a fourth kind of finding, from Williams

The proofread skill deferred to a standalone skill that no longer exists, so it now
states its own rules and adds the ones from Williams's *Style: Lessons in Clarity
and Grace*. The sentence-level ones — a subject that is not the character, an
opener, an interruption, a tail — are a fourth category, `clarity`, drawn in blue,
because they are not words to cut. A `show` map saved by an earlier version no
longer hides a kind it never knew about.

## 2026-09-20 — 0.2.0: clear the directory review

The declared `minAppVersion` was a guess, and `workspace.revealLeaf` only became
awaitable in 1.7.2, so the floor is honest now. The settings tab also answers
Obsidian's declarative API, which is what puts its settings in the settings search,
and keeps `display()` for builds older than 1.13.

## 2026-09-20 — First working plugin

Reads a JSON proofread report per note, underlines each finding where the text it
quotes sits, and gives every highlight a hover card with the rule behind it and a
click-to-edit card that replaces exactly the range the finding covers. Resolved and
dismissed findings are remembered per note, so a re-run does not report the same
`very` the author already decided to keep.
