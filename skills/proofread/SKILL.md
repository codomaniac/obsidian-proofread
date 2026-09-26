---
name: proofread
description: Proofread a note by the rules in Zinsser's On Writing Well, Williams's Style, Lessons in Clarity and Grace, and Hacker and Sommers's A Writer's Reference, and write the findings to the JSON report the Obsidian Proofread plugin reads, instead of listing them in the conversation. Use when proofreading a note in an Obsidian vault that has the plugin installed, or when asked for a proofread report file.
---

# Proofreading into a report file

Proofread what the user points at: a note, or several. If nothing is named, ask which.

You *read* the prose and *report* on it. You never touch the note. The report is a
list the author works through by hand in Obsidian, where the plugin draws each finding
on the text it quotes and shows the rule behind it on hover. Every finding is a
lesson: the point is that the author stops making the mistake, not that this instance
gets fixed. Hacker and Sommers have the writer keep an editing log — the errors that
keep coming back, each with the rule that corrects it. The report is that log, kept
for the author: the same fault gets the same name every run.

Four things go into the report, and nothing else.

## 1. Mechanical errors

Errors of grammar, punctuation and usage. State the rule behind each in a sentence,
naming the pattern: "countable singular nouns need an article", "`depend` takes `on`,
never `from`". Hacker and Sommers's handbook is the reference here; the rules below
are theirs, by name.

- *Article.* A countable singular noun with no `a`, `an` or `the`; `the` on a general
  plural or an uncountable noun where none belongs; `a` where the next word starts
  with a vowel sound.
- *Preposition.* The wrong one after a verb or adjective: `depend from`, `capable to`,
  `different to`, `arrive to`, `discuss about`; `in` for `into` where something moves;
  `wait on` for `wait for`; `agree to` a person, `agree with` a plan.
- *Agreement.* Subject and verb that disagree, and the traps that produce it: words
  between them (`The list of options are`), a subject after the verb (`There is three
  reasons`), subjects joined by `and` (plural) or by `or` / `nor` (agree with the
  nearer one), an indefinite pronoun (`each`, `everyone`, `neither`, `nobody`: singular),
  a `who` / `which` / `that` whose verb must agree with its antecedent.
- *Verb form.* An irregular past participle gone wrong (`had went`, `has drank`),
  `lie` for `lay`, a dropped `-ed` (`suppose to`, `use to`, `prejudice against`) or
  `-s`, a helping verb or a `be` left out (`We going to`).
- *Tense.* The wrong tense in a sentence: a present for a past that is over, a simple
  past where a perfect is needed for an earlier past (`By the time it shipped, we
  found`), a past for a text or a program that still says what it says (write about
  what a book or the code *does* in the present).
- *Pronoun case.* `me and him went`, `between you and I`, `myself` where `me` or `I`
  belongs, `us developers` as a subject. Hacker's test: drop the other half of the pair
  and hear which form is left.
- *Modifier form.* An adjective doing an adverb's job (`runs quick`, `real good`,
  `did bad`); `good` for `well`; a double comparative or superlative (`more better`,
  `most fastest`); a degree given to an absolute (`most unique`, `more perfect`).
- *Double negative.* `can't hardly`, `didn't do nothing`, `haven't got no`. Two
  negatives are fine only when a positive is meant (`not unhappy`).
- *Fragment.* A subordinate clause or a phrase punctuated as a sentence: `When the
  cat leaped onto the table.` `Running for the bus.` `Which is why the build broke.`
  Hacker's test: a sentence has a subject and a verb and does not begin with a
  subordinating word. A fragment set down for emphasis in a voice that allows it
  (`Especially my mother.`) is left alone; report the ones a reader trips over.
- *Run-on.* Two independent clauses fused with nothing between them, or spliced with
  a comma alone. `however`, `therefore`, `then` are not conjunctions: `It compiled,
  however it failed at runtime` is a splice. The seven words that may join clauses
  after a comma are `and`, `but`, `or`, `nor`, `for`, `so`, `yet`.
- *Comma.* Where one is missing: before a coordinating conjunction that joins two
  independent clauses; after an introductory clause or phrase the reader would
  otherwise run into the subject; between all items in a series; between coordinate
  adjectives (those that could take `and` between them: `a warm, gentle voice`); around
  a nonrestrictive element, the `which` clause or the appositive the sentence could
  lose. Where one intrudes: with a conjunction that joins only two words, phrases or
  verbs (`I opened the file, and saved it`); between subject and verb, or verb and
  object; before the first or after the last item of a series; between cumulative
  adjectives (`three, large, gray shapes`); around a restrictive element (`Scientists,
  who study the earth's structure, are`); before a concluding `because`, `if`, `unless`,
  `when` clause; after `although`, `such as`, `like`; before a parenthesis. The note
  names the case.
- *Semicolon.* One between an independent clause and a fragment (`We tested it; every
  branch.`), or one introducing a list where a colon belongs.
- *Colon.* One splitting a verb from its object or a preposition from its object (`The
  tools are: git, make and tmux`), or one after `such as`, `including`, `for example`.
  A colon follows a complete clause.
- *Apostrophe.* `it's` for `its`, `who's` for `whose`, `you're` for `your`; a plural
  with an apostrophe (`API's`, `the 1990's`, `PDF's`); a possessive without one (`the
  users settings`); `s'` and `'s` swapped on a plural.
- *Hyphen.* A compound adjective before its noun left open (`well known author`, `web
  delivered content`, `long running job`); the same compound hyphenated after the noun,
  where it is not (`the job is long-running`); a hyphen after an `-ly` adverb
  (`slowly-moving`); a spelled-out fraction or a number from twenty-one to ninety-nine
  without one.
- *Usage.* A word confused with its neighbour, from Hacker's glossary: `affect` /
  `effect`, `accept` / `except`, `advice` / `advise`, `allusion` / `illusion`, `amount`
  / `number`, `between` / `among`, `capital` / `capitol`, `complement` / `compliment`,
  `continual` / `continuous`, `council` / `counsel`, `disinterested` / `uninterested`,
  `elicit` / `illicit`, `emigrate` / `immigrate`, `explicit` / `implicit`, `farther` /
  `further`, `imply` / `infer`, `lead` / `led`, `lie` / `lay`, `loose` / `lose`,
  `passed` / `past`, `precede` / `proceed`, `principal` / `principle`, `than` / `then`,
  `their` / `there` / `they're`, `to` / `too`, `weather` / `whether`, `e.g.` / `i.e.`,
  `allude` for `refer`. Nonwords and casual forms: `alot`, `irregardless`, `could of`,
  `would of`, `try and`, `sure and`, `being as`, `anyways`, `kind of a`. `as` or `while`
  for `because` or `although` only where the sentence can be read the other way. The
  note gives the distinction, because that is what the author will remember.
- *Dangling modifier.* An opening phrase whose implied subject is not the sentence's
  subject: `Upon entering the office, a skeleton caught my attention`. Hacker's note:
  moving the phrase does not fix it; the one who acts has to enter the sentence, as
  its subject or inside the modifier.
- *Noninclusive.* A generic `he` for a person of unknown gender (`A user should back up
  his data`), `he or she` in a note that could say `they` or go plural, and nouns
  with a gender built in where a plain one exists: `chairman`, `mankind`, `manpower`,
  `man-hours`, `guys` for a mixed group. Hacker's three fixes: a plural antecedent, a
  recast sentence, or singular `they`.

Williams's lesson on correctness sorts the rules into three kinds, and only the first
two are errors:

- *Real rules* — the grammar of the language: articles, agreement, word order, tense.
  Report them.
- *Social rules* — standard against nonstandard: `he don't`, `irregardless`,
  `between you and I`, `should of`. Report them; they are what readers judge.
- *Invented rules* — folklore, and options that only formal prose insists on. Do not
  report a sentence that begins with `and` or `but`, a split infinitive, a preposition
  at the end, `which` in a restrictive clause, `since` or `while` meaning `because` or
  `although` where the meaning is plain, `hopefully`, `less` where `fewer` would be
  more elegant, `who` where `whom` would be, `different than` where `from` would be
  awkward, `data is`, singular `they`, or a contraction. Williams's test: a rule that
  careful writers break as a matter of course is not a rule. Hacker's handbook keeps
  some of these for college prose; where the two disagree, Williams's test decides.

## 2. Words the author is talking around

When a sentence spends a clause describing something a single word already covers,
name that word and give its dictionary definition, so the author's active vocabulary
grows over time. Offer the word — do not rewrite the sentence around it.

Hacker's lesson on exact language adds the general noun standing where a specific one
was in hand: `the thing`, `stuff`, `the aspect`, `the factor`, `the issue`, `the area`,
`the situation`, `the tool` in a note that has already named the tool. Rule
`general noun`: offer the specific word, which is usually the note's own; `definition`
may stay out when it is.

## 3. Clutter

Point at words that can come out or be swapped for a plain one. Every finding names
the specific word or phrase and the principle it violates. This is a closed
checklist, not an invitation to comment on the writing in general.

### By Zinsser, *On Writing Well*

- *Clutter.* Words doing no work: `in order to` for `to`, `at this point in time` for
  `now`, `the reason why is that` for `because`, `referred to as` for `called`,
  `despite the fact that` for `although`, `in the event that` for `if`, `has the
  ability to` for `can`, `prior to` for `before`, `along the lines of` for `like`, `for
  the purpose of` for `for`, `in the neighborhood of` for `about`, `until such time
  as` for `until`, `has the capacity to` for `can`. Also words that mean nothing at
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
- *Passive voice* where an active verb would carry the sentence. Williams's test:
  flag it when the doer is a character the reader knows and putting it first would
  make a shorter, more direct sentence.
- *Redundancy.* A word implied by its neighbour: `personal friend`, `free gift`, `end
  result`, `past history`, `future plans`, `completely eliminate`, `cooperate
  together`, `basic essentials`. A pair where one word carries: `each and every`,
  `first and foremost`, `full and complete`, `any and all`. A category the word
  already belongs to: `period of time`, `pink in color`, `large in size`, `unusual in
  nature`.
- *Over-explaining.* A sentence that restates what the previous one already
  established — Zinsser's "trust the reader".

### By Williams, *Style: Lessons in Clarity and Grace*

Williams's concision lesson adds to Zinsser's list. These are still words to cut:

- *Negative.* A negation standing in for a word: `not many` for `few`, `not the
  same` for `different`, `did not remember` for `forgot`, `not allow` for `prevent`,
  `not include` for `omit`, `not often` for `rarely`. Two stacked: `not unless`, `not
  fail to`. State it in the affirmative, unless the negation is the point, as in a
  warning.
- *Metadiscourse.* Writing about the writing: `it is important to note that`, `as I
  mentioned above`, `in this section I will`, `I would like to point out`, `it should
  be noted`, and Hacker's apologies: `in my opinion`, `I think that`, `it seems to
  me`. Flag it when the sentence says the same without it. A signpost a reader needs
  is not clutter.
- *Hedge.* `usually`, `often`, `almost`, `virtually`, `possibly`, `perhaps`,
  `apparently`, `seemingly`, `somewhat`, `to some extent`, `may`, `might`, `seem`,
  `tend`, `appear`, `suggest`. One hedge softens a claim that needs softening. Flag
  the second on the same clause, and any hedge on a statement that is not a claim.
- *Intensifier.* `clearly`, `obviously`, `undoubtedly`, `certainly`, `of course`,
  `indeed`, `literally`, `invariably`, `always`, and adjectives that only insist:
  `key`, `central`, `crucial`, `fundamental`, `essential`. The louder the
  intensifier, the weaker the claim sounds: `clearly` in front of a statement invites
  the reader to doubt it.
- *Nominalization*, by pattern. As the subject of an empty verb: `The intention of
  the committee is`. After `there is` / `there are`: `There is a need for review`.
  Subject and object both: `Our lack of data prevented evaluation`. Two joined by a
  preposition: `a review of the evolution of`. Fix the character first: cutting words
  from a sentence built on nominalizations leaves the nominalizations standing.

### By Hacker and Sommers, *A Writer's Reference*

The handbook's chapters on wordy sentences, active verbs, appropriate language and
exact language. Each is a word to cut or a word to swap:

- *Repetition.* A word said twice where once carries, inside a sentence or across the
  joint of two: `His third speech ... was an outstanding speech`, `help each student
  become a better student`, `the system that the system depends on`. Repetition set
  down for effect is not this; the accidental kind is.
- *Be verb.* A form of `be` holding a noun or adjective that hides the verb: `be in
  violation of` / `violate`, `was resistant to` / `resisted`, `is indicative of` /
  `indicates`, `is reflective of` / `reflects`, `are in agreement` / `agree`, `is in
  need of` / `needs`, `were involved in studying` / `studied`, `is responsible for the
  destruction of` / `destroyed`. When the hidden verb sits in an `-ion` noun the
  finding is `nominalization`; `be verb` is for the adjective, and for the `involved
  in` / `responsible for` frames. A `be` that links a subject to what it is (`Orchard
  House was the home of Louisa May Alcott`) or helps a participle (`was fighting`) is
  doing its job.
- *Reduction.* A clause a phrase would carry, or a phrase a word would: `the report
  that was written by the team` / `the team's report`, `Monticello, which was the home
  of Jefferson` / `Monticello, the home of Jefferson`, `people who are working
  remotely` / `remote workers`, `in a careful manner` / `carefully`. Point at the `who
  is`, `which was`, `that are`, `in a ... manner`.
- *Jargon.* A word worn to sound like a member rather than to say something: `utilize`,
  `leverage`, `synergy`, `paradigm`, `parameters` for `limits`, `optimal`, `impact` as
  a verb, `prioritize`, `viable`, `facilitate`, `commence`, `endeavor`, `finalize`,
  `interface` as a verb, `going forward`, `circle back`, `deep dive`, `bandwidth` for
  `time`, `learnings`. Hacker's Writer's Choice: a discipline's own terms, used for
  readers who share them, are not jargon. In a note about software, `endpoint`,
  `refactor`, `race condition` and `pipeline` are words.
- *Euphemism.* A soft phrase for a plain word: `passed away`, `let go`, `downsizing`,
  `pre-owned`, `revenue enhancement`, `collateral damage`; in a note about software,
  `known issue` for `bug`, `learning opportunity` for `failure`, `suboptimal` for
  `bad`. A euphemism chosen out of tact for a person is allowed; doublespeak, which
  hides what happened, is not.
- *Cliché.* A phrase so worn the reader finishes it unread: `at the end of the day`,
  `low-hanging fruit`, `think outside the box`, `move the needle`, `game changer`,
  `perfect storm`, `the elephant in the room`, `tip of the iceberg`, `needle in a
  haystack`, `easier said than done`, `last but not least`, `crystal clear`, `hit the
  ground running`, `boil the ocean`, `a double-edged sword`, `it goes without saying`,
  `the bottom line`, `avoid like the plague`. Name the cliché; the plain words that
  replace it are the author's.
- *Mixed metaphor.* Two figures in one sentence that cannot both be pictured: `the
  low-hanging fruit that moves the needle`, `we hit the ground running and never
  looked back at the drawing board`. Keep one.

## 4. Unclear sentences

Williams's diagnosis of prose that readers call dense or abstract: the sentence's
main characters are not its subjects, and its main actions are not its verbs. His
test is to look at the first seven or eight words of a sentence. If the subject is
not a character, if the verb is not an action, or if the reader has not reached the
verb yet, the sentence is one of these. Nothing here is a word to cut; each names
something the reader is made to wait for, or a place where the sentence's parts fail
to fit together.

### By Williams

- *Character.* The subject is an abstraction while the one who acts hides in a
  possessive, an `of`-phrase, or nowhere: `The intention of the committee is to
  audit`, `Our lack of data prevented evaluation`, `The analysis was conducted`. Name
  the doer and the verb; the author moves them into place. Quote from the subject
  through the verb, because that is the range the author will retype.
- *There is.* `There is`, `There are`, `It is … that` delaying the subject: `There
  are three reasons that`. Flag it when it carries a nominalization or holds no new
  information back for the end of the sentence.
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

### By Hacker and Sommers

The handbook's chapter on sentence style, which its sister handbook titles *Clarity*:
sentences whose grammar the reader has to reassemble.

- *Parallelism.* Items in a series or a pair set in unlike forms: `reading, writing,
  and to code`; `not only ... but also` with unlike halves; a `than` or `as`
  comparison of a phrase with a clause; a function word (`that`, `to`, a preposition)
  present in one item and dropped from the next where the reader needs it repeated.
  Quote the item that breaks the pattern; the note names the form the others take.
- *Needed word.* A word dropped from a compound so one half no longer reads: `never
  has and never will accept` (`has accepted`), `believe and live by` (`believe in`); a
  `that` whose absence lets the reader take the wrong object (`We saw the build
  failed`); a comparison left incomplete or illogical (`faster than any tool` for
  `any other tool`, `more than the old version` with no *what*, `as fast or faster
  than` for `as fast as or faster than`); an article dropped from a pair that needs
  two (`a helper and interface` for `a helper and an interface`). The note names the
  word.
- *Limiting modifier.* `only`, `even`, `almost`, `nearly`, `just`, `hardly` set in
  front of the verb when it limits some other word: `students only learn vocabulary
  when they read` (`only when`), `if you just interview chemistry majors` (`just
  chemistry majors`). Quote the modifier; the note says which word it belongs in
  front of.
- *Misplaced modifier.* A phrase or clause far enough from what it modifies that the
  reader attaches it to the wrong word: `The player underwent surgery in a
  limousine`, `a book about debugging for children`. Quote the phrase; the note names
  the word it belongs beside.
- *Mixed construction.* A sentence that starts on one grammatical footing and
  finishes on another: `For most people who switch to a low-fat diet feel better`,
  `Although the tests passed, but the deploy failed`, `Because the cache was cold, so
  the first request was slow`. Illogical connection, where the subject cannot do what
  its verb says: `The rules of the game are prohibited`, `The elderly who receive free
  vaccines will be abolished`. And the three Hacker names outright: `is when`, `is
  where`, `the reason ... is because` (`A cache miss is when`, `The reason it failed is
  because`). Quote from the subject through the verb, or the `is when` / `is
  because`.
- *Pronoun reference.* `this`, `that`, `which` or `it` pointing at a whole preceding
  idea rather than a noun (`... which was a relief`), or at two nouns it could equally
  mean (`When the parser hands the token to the lexer, it`), or at a noun that exists
  only inside a possessive or an adjective (`In the compiler's output, it`); `they` or
  `it` with nobody named (`They say the API is slow`). Quote the pronoun with a word
  each side; the note names the noun the reader needs.
- *Shift.* A passage that changes person (`you` to `one` to `we`), tense (a story
  told in the past that slips into the present for a sentence), mood (statements that
  turn into commands and back), or voice (active to passive with the actor lost) for
  no reason the reader can see; a question that starts indirect and ends direct (`I
  wondered will it compile?`). Quote the sentence that shifts; a single wrong tense
  with no passage around it is `tense`, above.

### Leave it alone

Williams's and Hacker's lessons come with the cases where the diagnosis is wrong, and
the report is quieter for knowing them:

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
- A fragment set down for effect, in a voice that allows it. A comma left out between
  two short independent clauses with no chance of misreading (`The plane took off and
  we were on our way`). A split infinitive whose alternative is worse. Singular `they`.
- A discipline's own terms in a note for readers who share them. A cliché or a `be`
  verb inside a quotation, a title or a command.
- The note's register. Slang, contractions and a casual `you` are the author's voice,
  not findings; Hacker's advice on levels of formality is for college papers.
- Words repeated on purpose, in parallel structures or for emphasis.

One finding per fragment. When `character`, `nominalization` and `passive voice`
would all land on the same words, report the one whose fix dissolves the rest, which
is usually `character`. When `be verb` and `nominalization` would, it is
`nominalization`. When `interruption` and `misplaced modifier` would, it is
`misplaced modifier` if the reader misreads, `interruption` if the reader only waits.
The categories do not overlap either: a finding is `clutter` when the fix is to cut or
swap a word, `clarity` when it is to move one or to make the sentence's parts fit,
`mechanical` when the sentence breaks a rule of the language or of usage that readers
count as an error.

### Hard limits

- No stylistic feedback beyond the checklists above. Every item on them is a nameable
  rule with a word or phrase you can point at. Nothing about flow, tone, paragraphing,
  pacing, or "this would be stronger if…". Williams's lessons on coherence across
  paragraphs, on elegance and on ethics do not produce findings, because none of them
  points at a word. Neither do Hacker's chapters on sentence emphasis and variety —
  choppy sentences, coordination and subordination, varied openings — nor the handbook's advice
  on connotation, on formality, or on composing, arguing and citing.
- No rewritten sentences, not even as an illustration. Quote the fragment, name the
  rule, state it. A `character` or `nominalization` note may name the word that
  should be the subject and the verb that should carry the action, the way a
  vocabulary finding offers a word; a `needed word`, `limiting modifier` or `usage`
  note may name the word that belongs; none of them assembles the sentence.
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
      "category": "clarity",
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
      "category": "mechanical",
      "rule": "usage",
      "fragment": "the change didn't effect the tests",
      "occurrence": 1,
      "line": 24,
      "note": "`affect` is the verb, to influence; `effect` is the noun, the result. The change did not affect the tests, or had no effect on them."
    },
    {
      "category": "clarity",
      "rule": "parallelism",
      "fragment": "and to deploy it",
      "occurrence": 1,
      "line": 28,
      "note": "The series runs `building`, `testing`, and then an infinitive. Readers expect items in a series in one grammatical form; the first two are `-ing` verbs."
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

- `category` — `mechanical`, `vocabulary`, `clutter` or `clarity`. Nothing else is
  read. The plugin draws each in its own colour, and the author can switch any one
  of them off, so a finding in the wrong category is a finding they may never see.
- `rule` — the named principle, lowercase and short, spelled the way this file spells
  it: `article`, `preposition`, `agreement`, `verb form`, `tense`, `pronoun case`,
  `modifier form`, `double negative`, `fragment`, `run-on`, `comma`, `semicolon`,
  `colon`, `apostrophe`, `hyphen`, `usage`, `dangling modifier`, `noninclusive`; `one
  word for the clause`, `general noun`; `clutter`, `qualifier`, `adverb`, `long word`,
  `nominalization`, `passive voice`, `redundancy`, `over-explaining`, `negative`,
  `metadiscourse`, `hedge`, `intensifier`, `repetition`, `be verb`, `reduction`,
  `jargon`, `euphemism`, `cliché`, `mixed metaphor`; `character`, `there is`, `noun
  stack`, `opener`, `long subject`, `interruption`, `tail`, `parallelism`, `needed
  word`, `limiting modifier`, `misplaced modifier`, `mixed construction`, `pronoun
  reference`, `shift`. The same fault gets the same name every run, so the author
  sees which rules keep coming back.
- `fragment` — text quoted from the note, and the only thing that anchors the
  finding. Quote the shortest run that is unique enough to find, and quote it
  **verbatim**: the plugin forgives straightened quotes, a collapsed line wrap and
  surrounding emphasis, and nothing else. An `...` inside a fragment stands for text
  skipped between two parts of it. For a sentence-level finding, quote the part the
  author will retype: the opener, the interruption, the tail, or the subject through
  the verb. For a missing word or a missing comma, quote the words either side of the
  gap, so the highlight lands where the fix goes.
- `occurrence` — which occurrence of `fragment` in the note, 1-based. Count them.
- `line` — 1-based, a tie-breaker only. Do not rely on it.
- `note` — the sentence stating the rule. This is the part the author reads, so it
  carries the lesson, not a description of the mistake.
- `word` / `definition` — vocabulary findings only: the word being talked around and
  its dictionary definition. Offer the word; never a rewritten sentence.

Write the file, then say how many findings of each kind it holds and nothing more.
The author reads them in Obsidian.
