---
name: proofread
description: Proofread a note by the rules in Zinsser's On Writing Well and Williams's Style, Lessons in Clarity and Grace, and write the findings to the JSON report the Obsidian Proofread plugin reads, instead of listing them in the conversation. Use when proofreading a note in an Obsidian vault that has the plugin installed, or when asked for a proofread report file.
---

# Proofreading into a report file

Proofread what the user points at: a note, or several. If nothing is named, ask which.

You *read* the prose and *report* on it. You never touch the note. The report is a
list the author works through by hand in Obsidian, where the plugin draws each finding
on the text it quotes and shows the rule behind it on hover. Every finding is a
lesson: the point is that the author stops making the mistake, not that this instance
gets fixed.

Three things go into the report, and nothing else.

## 1. Mechanical errors

Typos, missing or wrong articles (`a` / `an` / `the`), wrong prepositions (`at` /
`on` / `in` / `of` / `to`), subject–verb agreement, plurals, verb tense, comma splices
and missing commas, doubled or dropped words, a modifier dangling from a subject it
does not describe. State the rule behind each in a sentence, naming the pattern:
"countable singular nouns need an article", "`depend` takes `on`, never `from`".

Williams's lesson on correctness sorts the rules into three kinds, and only the first
two are errors:

- *Real rules* — the grammar of the language: articles, agreement, word order, tense.
  Report them.
- *Social rules* — standard against nonstandard: `he don't`, `irregardless`,
  `between you and I`, `should of`. Report them; they are what readers judge.
- *Invented rules* — folklore, and options that only formal prose insists on. Do not
  report a sentence that begins with `and` or `but`, a split infinitive, a preposition
  at the end, `which` in a restrictive clause, `since` or `while` meaning `because` or
  `although`, `hopefully`, `less` where `fewer` would be more elegant, `who` where
  `whom` would be, or a contraction. Williams's test: a rule that careful writers break
  as a matter of course is not a rule.

## 2. Words the author is talking around

When a sentence spends a clause describing something a single word already covers,
name that word and give its dictionary definition, so the author's active vocabulary
grows over time. Offer the word — do not rewrite the sentence around it.

## 3. Clutter and unclear sentences

Point at words that can come out, and at sentences a reader has to work to follow.
Every finding names the specific word or phrase and the principle it violates. This
is a closed checklist, not an invitation to comment on the writing in general.

### By Zinsser, *On Writing Well*

- *Clutter.* Words doing no work: `in order to` for `to`, `at this point in time` for
  `now`, `the reason why is that` for `because`, `referred to as` for `called`,
  `despite the fact that` for `although`, `in the event that` for `if`, `has the
  ability to` for `can`, `prior to` for `before`. Also words that mean nothing at
  all: `actually`, `basically`, `really`, `certain`, `various`, `particular`,
  `individual`, `given`, `for all intents and purposes`.
- *Qualifiers and hedges.* `very`, `quite`, `rather`, `a bit`, `sort of`, `kind of`,
  `pretty much`, `in a sense`. They weaken the sentence they were meant to soften.
- *Adverbs that repeat the verb.* `blared loudly`, `gripped tightly` — the verb
  already says it. Same for adjectives that repeat the noun.
- *Long word where a short one exists.* `assistance`/`help`, `numerous`/`many`,
  `facilitate`/`ease`, `implement`/`do`, `utilize`/`use`, `initial`/`first`.
- *Nominalization.* A verb buried in an `-ion`/`-ment`/`-ance` noun, or an adjective
  in an `-ness`/`-ity` one — `made a decision` for `decided`, `performed an
  evaluation` for `evaluated`, `the applicability of` for `applies`. Williams's
  patterns, below, say where to look.
- *Passive voice* where an active verb would carry the sentence. Williams's test,
  below, says when it would.
- *Redundancy.* A word implied by its neighbour: `personal friend`, `free gift`, `end
  result`, `past history`, `future plans`, `completely eliminate`. A pair where one
  word carries: `each and every`, `first and foremost`, `full and complete`, `any and
  all`. A category the word already belongs to: `period of time`, `pink in color`,
  `large in size`, `unusual in nature`.
- *Over-explaining.* A sentence that restates what the previous one already
  established — Zinsser's "trust the reader".

### By Williams, *Style: Lessons in Clarity and Grace*

Williams's diagnosis of prose that readers call dense or abstract: the sentence's
main characters are not its subjects, and its main actions are not its verbs. His
test is to look at the first seven or eight words of a sentence. If the subject is
not a character, if the verb is not an action, or if the reader has not reached the
verb yet, the sentence is one of these:

- *Character.* The subject is an abstraction while the one who acts hides in a
  possessive, an `of`-phrase, or nowhere: `The intention of the committee is to
  audit`, `Our lack of data prevented evaluation`, `The analysis was conducted`. Name
  the doer and the verb; the author moves them into place. Quote from the subject
  through the verb, because that is the range the author will retype.
- *Nominalization*, by pattern. As the subject of an empty verb: `The intention of
  the committee is`. After `there is` / `there are`: `There is a need for review`.
  Subject and object both: `Our lack of data prevented evaluation`. Two joined by a
  preposition: `a review of the evolution of`. Fix the character first: cutting words
  from a sentence built on nominalizations leaves the nominalizations standing.
- *There is.* `There is`, `There are`, `It is … that` delaying the subject: `There
  are three reasons that`. Flag it when it carries a nominalization or holds no new
  information back for the end of the sentence.
- *Passive voice.* Flag it when the doer is a character the reader knows and putting
  it first would make a shorter, more direct sentence.
- *Noun stack.* Three or more nouns modifying one another: `early childhood thought
  disorder misdiagnosis`, `report generation pipeline failure`. Unpack from the last
  noun back. Two-noun compounds readers know (`file system`, `test suite`) are words.
- *Opener.* A long introductory phrase or clause before the subject, so the reader
  holds context with nothing to attach it to: `Given the state of the build after the
  second run on the shared runner, we`. A short one (`In 2019,`, `Since then,`) is
  fine. Quote the opener.
- *Long subject.* A subject that is a whole clause: `That the build failed on the
  second run for reasons nobody wrote down was`. The reader gets the point before the
  sentence starts; `the fact that` is the usual sign.
- *Interruption.* A phrase between subject and verb, or between verb and object:
  `The report, after the reviewers had read it twice and sent it back, went out`.
  Readers want the verb right after the subject; the interruption belongs at the
  start or the end. One or two words are not an interruption. Quote the interruption.
- *Tail.* A sentence ending on words that carry none of its point: `in the way we
  act in situations we are in every day`, `in this case`, `for the most part`, `as
  such`, `at the present time`. The end of a sentence is its stress position. Say
  whether the tail should go, or move to the front so the sentence ends on what
  matters.
- *Negative.* A negation standing in for a word: `not many` for `few`, `not the
  same` for `different`, `did not remember` for `forgot`, `not allow` for `prevent`,
  `not include` for `omit`, `not often` for `rarely`. Two stacked: `not unless`, `not
  fail to`. State it in the affirmative, unless the negation is the point, as in a
  warning.
- *Metadiscourse.* Writing about the writing: `it is important to note that`, `as I
  mentioned above`, `in this section I will`, `I would like to point out`, `it should
  be noted`. Flag it when the sentence says the same without it. A signpost a reader
  needs is not clutter.
- *Hedge.* `usually`, `often`, `almost`, `virtually`, `possibly`, `perhaps`,
  `apparently`, `seemingly`, `somewhat`, `to some extent`, `may`, `might`, `seem`,
  `tend`, `appear`, `suggest`. One hedge softens a claim that needs softening. Flag
  the second on the same clause, and any hedge on a statement that is not a claim.
- *Intensifier.* `clearly`, `obviously`, `undoubtedly`, `certainly`, `of course`,
  `indeed`, `literally`, `invariably`, `always`, and adjectives that only insist:
  `key`, `central`, `crucial`, `fundamental`, `essential`. The louder the
  intensifier, the weaker the claim sounds: `clearly` in front of a statement invites
  the reader to doubt it.

### Leave it alone

Williams's lessons come with the cases where the diagnosis is wrong, and the report
is quieter for knowing them:

- A nominalization that is a short subject referring back to the previous sentence
  (`This decision …`), that names the object of the verb (`her meaning`), that names a
  concept so familiar it is a thing (`taxation`, `election`, `deployment`), or that
  replaces an awkward `the fact that`.
- A passive whose doer is unknown or beside the point, that puts a short familiar
  topic first and the long new information last, or that keeps a run of sentences on
  one subject.
- A `there is` that pushes new information into the stress position on purpose.
- A hedge on a claim that is genuinely uncertain. Hedging is how careful writers stay
  credible; over-hedging is the fault, not hedging.
- An abstraction as subject when the note is about that abstraction and the reader
  knows it: `The scheduler picks the next job`.

One finding per fragment. When `character`, `nominalization` and `passive voice`
would all land on the same words, report the one whose fix dissolves the rest, which
is usually `character`.

### Hard limits

- No stylistic feedback beyond the checklist above. Every item on it is a nameable
  rule with a word or phrase you can point at. Nothing about flow, tone, paragraphing,
  pacing, or "this would be stronger if…". Williams's lessons on coherence across
  paragraphs, on elegance and on ethics do not produce findings, because none of them
  points at a word.
- No rewritten sentences, not even as an illustration. Quote the fragment, name the
  rule, state it. A `character` or `nominalization` note may name the word that
  should be the subject and the verb that should carry the action, the way a
  vocabulary finding offers a word; it does not assemble the sentence.
- No edits to the note being proofread. Report only, even if the fix is a single
  missing comma and the author sounds impatient. If they want it applied, they will
  say so explicitly, and then it is a fix of exactly what was reported — nothing else
  in the file changes.

## Where the report goes

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
      "category": "clutter",
      "rule": "character",
      "fragment": "The intention of the committee is",
      "occurrence": 1,
      "line": 17,
      "note": "The committee acts here, but it sits inside `of the committee` while an abstraction holds the subject. Subject: `the committee`; verb: `intends`."
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
  Williams's sentence-level findings are `clutter`: the category is everything about
  the prose that is neither an error nor a missing word.
- `rule` — the named principle, lowercase and short, spelled the way this file spells
  it: `article`, `preposition`, `agreement`, `comma`, `dangling modifier`; `one word
  for the clause`; `clutter`, `qualifier`, `adverb`, `long word`, `nominalization`,
  `passive voice`, `redundancy`, `over-explaining`, `character`, `there is`, `noun
  stack`, `opener`, `long subject`, `interruption`, `tail`, `negative`,
  `metadiscourse`, `hedge`, `intensifier`. The same fault gets the same name every
  run, so the author sees which rules keep coming back.
- `fragment` — text quoted from the note, and the only thing that anchors the
  finding. Quote the shortest run that is unique enough to find, and quote it
  **verbatim**: the plugin forgives straightened quotes, a collapsed line wrap and
  surrounding emphasis, and nothing else. An `...` inside a fragment stands for text
  skipped between two parts of it. For a sentence-level finding, quote the part the
  author will retype: the opener, the interruption, the tail, or the subject through
  the verb.
- `occurrence` — which occurrence of `fragment` in the note, 1-based. Count them.
- `line` — 1-based, a tie-breaker only. Do not rely on it.
- `note` — the sentence stating the rule. This is the part the author reads, so it
  carries the lesson, not a description of the mistake.
- `word` / `definition` — vocabulary findings only: the word being talked around and
  its dictionary definition. Offer the word; never a rewritten sentence.

Write the file, then say how many findings of each kind it holds and nothing more.
The author reads them in Obsidian.
