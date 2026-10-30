# Ratio Explorer

An interactive learning app with a practice engine, organized by subject:

- **Maths 6+**: 10 units (Area & Surface Area, Introducing Ratios, Unit Rates & Percentages, Scale Drawings, Dividing Fractions, Arithmetic in Base 10, Expressions and Equations, Introducing Proportional Relationships, Proportional Relationships and Percentages, Rational Numbers). Unit 2 (Introducing Ratios) has 10 lesson sections covering Lessons 1–16: ratio language, diagrams, recipes, color mixtures, equivalent ratios, double number lines, unit price, constant speed, tables, part-part-whole, and mixed problems. Unit 3 (Unit Rates & Percentages) now has three lessons on writing percents as fractions in lowest terms, writing fractions as percents, and mixed conversion practice; the remaining units are coming soon.
- **ELA 6th Grade**: test prep for Chapters 1–8 of The Lightning Thief and the Hero's Journey: Start Here (test tips, Q&A, full review), Gist & Sequence, The Hero's Journey & the Plot Diagram (with the class worksheet's "align the 10 stages" activity), Percy's Character & R.A.C.E.S., Chapter-by-Chapter Questions & Answers. Six additional **End-of-Novel Guide** lessons cover all seven parts of the shared study guide, with study tips, revealable model answers, original cold reads, and scored practice.
- **Social Studies**: Unit 1: River Valley Civilizations (NC 6th-grade standards): Start Here (rivers and civilization, timeline), Map Skills (measure distance with a map scale on an interactive South Asia map, latitude/longitude, direction, relative location, estimating area), Mesopotamia, Ancient Egypt, Indus Valley (with the roots of Hinduism and Buddhism), Ancient China, and a Unit Review with a mixed 12-question test, plus "Master Grade 6 River Valley Civilizations" flashcards (131 cards in 8 decks). Unit 2: Geography & Physical Features has five guided lessons and targeted practice on the five themes, map and timeline skills, farming and civilization, Greece and Rome, and geography's influence on the Inca, Indian Ocean sailors, Aztecs, Japan, Mesopotamia, and Mesoamerica.
- **Spanish**: Unit 1 has interactive flashcards for English/Spanish names of 20 Spanish-speaking countries plus Puerto Rico, country-to-capital recall, and a capital-to-country challenge (63 cards across 3 decks). Unit 2 adds 21 country/capital-to-continent flashcards with flags, simplified locator maps, self-check scoring, shuffle, and missed-card review.
- **Science**: Earthquake Waves: P Waves & S Waves, with particle-motion diagrams, a comparison table, an interactive quick check, Earth-layer evidence, S–P arrival intervals, and 10-question practice rounds from a 15-question bank.

## Run

Open `index.html` in a browser. No build step or server is needed.

## Test

```sh
node tests/questions.test.js
node tests/spanish.test.js
```

The question test fuzzes every question generator: each answer key passes its own checker, MC options are distinct with exactly one correct, reversed answers get a targeted hint, and sessions cover every question type. It also checks both ELA question banks (including end-of-novel coverage, self-contained cold reads, and complete mixed sessions) and both Social Studies units. The Spanish test checks the flashcard data and continent assignments.

### ELA end-of-novel study guide

Open **ELA**, then choose one of the **End-of-Novel Guide** lessons below the existing Chapters 1–8 lessons:

- **Vocabulary & Characters**: nine literary terms, five character relationships, direct/indirect characterization, and Percy's development.
- **Plot & Hero's Journey**: a five-part plot mountain, definitions, and the five later journey stages used in the classroom guide.
- **Elements of Mythology**: power struggles, origins and the natural world, fate/prophecy, the supernatural, and quests, with novel connections.
- **Cold-Read Practice**: two original passages, main idea versus theme, and context clues for inadequate, formidable, ecstatic, yearned, and charismatic. Every practice question includes its passage.
- **Chapters 9, 15, 19 & 21**: gist statements and accuracy checks, including distinguishing Hades's helm from Zeus's bolt.
- **Mixed Practice Test**: a 14-question round covering all seven skill groups.

Choose **Learn** for notes and tips, or **Practice** for shuffled questions, targeted hints, explanations, scoring, missed-question review, and saved session history. End-of-novel lessons include spoilers through Chapter 22. These are original study notes, not worksheet transcriptions. Journey-stage interpretations can vary; the notes explain the guide's labels and the relationship between the Underworld escape and Ares confrontation. Existing Chapters 1–8 lessons retain their original scope.

### Maths Unit 3: Unit Rates & Percentages

Open **Maths → Unit 3: Unit Rates & Percentages**. The percentage section follows the attached practice guide’s conversion skills: write a percent over 100 and simplify to lowest terms, convert a fraction to a percent by making an equivalent fraction over 100 or dividing and multiplying by 100, then practice both directions. Each lesson includes a quick check, worked examples, targeted multiple-choice hints, and a shuffled practice session. The conversion question bank includes more than 40 original examples.

### Science: P waves & S waves

Open **Science → Earthquake Waves: P Waves & S Waves**. Choose **Learn** for six guided steps or **Practice** for a shuffled 10-question round with hints, explanations, scoring, and saved progress. The lesson compares arrival order, parallel versus perpendicular particle motion, and the materials each wave can pass through. Diagrams are schematic models, not literal pictures of rock moving with a wave.

Memory aids: **P = Primary, Push–pull, Parallel**; **S = Secondary, Shear, Solids only**. The comparison table includes shaking patterns and memory aids, followed by a revealable solid-rock-versus-liquid test question and a Pacific Northwest Seismic Network reference. P and S are body waves, not surface waves. The lesson also explains evidence for the liquid outer core and how S–P arrival intervals help estimate distance (not magnitude or a unique direction). The question tests validate the science bank, correct answers, hints, diagrams, and skill coverage.

### Social Studies Unit 2

Open **Social Studies → Unit 2: Geography & Physical Features**. Each lesson has learning targets, detailed study notes with test tips, quick recall prompts, and its own practice session with hints and explanations. Topics follow the shared geography study guide: MR(LIP), map coordinates and hemispheres, chronological timelines and BC/BCE/AD/CE, flooding and irrigation, domestication and food surplus, ancient Greek and Roman geography, and how the Inca, Indian Ocean sailors, Aztecs, and Japanese communities adapted to their environments. The review lesson compares Mesopotamia and Mesoamerica.

### Spanish Unit 2

Open **Spanish → Unit 2 → Continents**. Read the Spanish country and capital, recall the continent, and tap the card (or press Space) to reveal the answer. Choose **I Know It** (key 2) or **Practice Again** (key 1). The end-of-round self-check score includes a list of missed cards and a button to practice just those cards. Shuffle restarts the current round; mastery is remembered on this device.

Classroom categories are **América del Norte (North America)**, **El Caribe (Caribbean)**, **América del Sur (South America)**, **Europa (Europe)**, and **África (Africa)**. Central American countries belong to North America in this activity. For Cuba, República Dominicana, and Puerto Rico, students may also mark North America as correct if their class uses that grouping. Puerto Rico is identified as a territory, and Bolivia uses Sucre (with La Paz noted as the seat of government). The offline maps show approximate country locations, not precise boundaries.

## Structure

- `js/util.js`: random helpers, ratio parsing (`3:2`, `3 to 2`, `3/2`)
- `js/diagrams.js`: SVG diagrams generated from `{ a, b, itemA, itemB, layout }` (grouped, mixed, rows, tape)
- `js/questions.js`: the 6 P0 question generators and session builder
- `js/lessons.js`: interactive maths lesson steps (ratio basics)
- `js/ratio-unit.js`: Maths Unit 2 sections (learning targets, lesson steps) and their practice generators
- `js/ela-questions.js`: ELA data (chapters, events, 10 Hero's Journey stages, plot diagram, traits, R.A.C.E.S.) and practice questions
- `js/plot-align.js`: place the worksheet's 10 Hero's Journey stages on a plot diagram (tap the diagram or use the list); also a practice question type
- `js/ela.js`: ELA lessons
- `js/ela-end-novel.js`: end-of-novel ELA study guide, original cold-read passages, and practice bank
- `js/celebrate.js`: slam-dunk animation shown when a lesson or practice session is completed
- `js/south-asia-map.js`: South Asia map drawn from real latitude/longitude, with a working 200-mile scale bar and tap-to-measure ruler
- `js/social-studies.js`: Social Studies Unit 1 lessons, Q&A, and question bank
- `js/geography-unit.js`: Social Studies Unit 2 study notes, geography question bank, and targeted practice sessions
- `js/spanish.js`: Spanish-speaking country and territory names, capitals, and flashcard decks
- `js/science.js`: P/S-wave lesson, schematic diagrams, interactive check, and science practice bank
- `js/flashcards.js`: flashcard study sessions (flip, Got it / Still learning, mastery saved in LocalStorage)
- `js/app.js`: subjects, views (home, lesson, practice, results) and the feedback flow

## Status

P0 (MVP) is complete. P1 (diagram-builder questions, more question types, 10/15-question sessions, difficulty, LocalStorage progress) is next.

## Copyright

© 2026 Arman Madath. All rights reserved. This is an independent study aid and is not affiliated with or endorsed by any school or school district.

## Share

```sh
node tools/build.js
```

Creates `dist/ratio-explorer.html`, a single self-contained file (all CSS/JS inlined, no internet needed). Send that file (or `dist/ratio-explorer.zip`) and it opens by double-clicking in any modern browser.
