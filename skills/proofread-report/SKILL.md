---
name: proofread-report
description: Proofread a note and write the findings to the JSON report the Obsidian Proofread plugin reads, instead of listing them in the conversation. Use when proofreading a note in an Obsidian vault that has the plugin installed, or when asked for a proofread report file.
---

# Proofreading into a report file

Proofread exactly as the `proofread` skill says — same three things reported, same
hard limits, same refusal to edit the file. This skill changes only where the report
goes: into a JSON file the plugin reads, rather than into the conversation.

If the `proofread` skill is not installed, read it first from
<https://github.com/codomaniac/resources/tree/main/skills/proofread>. Its rules are
the substance of the job; what follows is only the format.

## Where it goes

For a note at `<path>` inside the vault, write `<vault>/.proofread/<path>.json`,
creating the directories it needs. A note at `content/posts/one.md` gets
`.proofread/content/posts/one.md.json`.

Never write to the note itself. The plugin puts the findings in front of the author,
who types their own corrections.

## The format

```json
{
  "file": "content/posts/one.md",
  "generatedAt": "2026-09-20T12:00:00Z",
  "findings": [
    {
      "category": "clutter",
      "rule": "qualifier",
      "fragment": "very useful",
      "occurrence": 1,
      "line": 12,
      "note": "`very` weakens the word it was meant to strengthen."
    },
    {
      "category": "mechanical",
      "rule": "article",
      "fragment": "I opened terminal",
      "occurrence": 1,
      "line": 20,
      "note": "A countable singular noun needs an article: `the terminal`."
    },
    {
      "category": "vocabulary",
      "rule": "one word for the clause",
      "fragment": "the thing that happens before the main thing",
      "occurrence": 1,
      "line": 31,
      "note": "One word covers this.",
      "word": "prelude",
      "definition": "an action or event serving as an introduction to something more important."
    }
  ]
}
```

- `category` — `mechanical`, `vocabulary` or `clutter`. Nothing else is read.
- `rule` — the named principle, lowercase and short: `article`, `preposition`,
  `qualifier`, `nominalization`, `redundancy`, `passive voice`.
- `fragment` — text quoted from the note, and the only thing that anchors the
  finding. Quote the shortest run that is unique enough to find, and quote it
  **verbatim**: the plugin forgives straightened quotes, a collapsed line wrap and
  surrounding emphasis, and nothing else. An `...` inside a fragment stands for text
  skipped between two parts of it.
- `occurrence` — which occurrence of `fragment` in the note, 1-based. Count them.
- `line` — 1-based, a tie-breaker only. Do not rely on it.
- `note` — the sentence stating the rule. This is the part the author reads, so it
  carries the lesson, not a description of the mistake.
- `word` / `definition` — vocabulary findings only: the word being talked around and
  its dictionary definition. Offer the word; never a rewritten sentence.

Write the file, then say how many findings of each kind it holds and nothing more.
The author reads them in Obsidian.
