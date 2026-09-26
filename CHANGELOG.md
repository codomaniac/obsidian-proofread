# Changelog

Newest first. Each entry: what changed and why, three sentences at most.

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
