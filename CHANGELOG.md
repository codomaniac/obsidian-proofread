# Changelog

Newest first. Each entry: what changed and why, three sentences at most.

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
