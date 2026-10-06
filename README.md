# Ratio Explorer

An interactive learning app with a practice engine, organized by subject:

- **Maths 6+**: 10 units (Area & Surface Area, Introducing Ratios, Unit Rates & Percentages, Scale Drawings, Dividing Fractions, Arithmetic in Base 10, Expressions and Equations, Introducing Proportional Relationships, Proportional Relationships and Percentages, Rational Numbers). Unit 2 (Introducing Ratios) has 10 lesson sections covering Lessons 1–16: ratio language, diagrams, recipes, color mixtures, equivalent ratios, double number lines, unit price, constant speed, tables, part-part-whole, and mixed problems. The other units are coming soon
- **ELA 6th Grade**: test prep for Chapters 1–8 of The Lightning Thief and the Hero's Journey: Start Here (test tips, Q&A, full review), Gist & Sequence, The Hero's Journey & the Plot Diagram, Percy's Character & R.A.C.E.S., Chapter-by-Chapter Questions & Answers
- **Social Studies**: Unit 1: River Valley Civilizations (NC 6th-grade standards): Start Here (rivers and civilization, timeline), Mesopotamia, Ancient Egypt, Indus Valley (with the roots of Hinduism and Buddhism), Ancient China, and a Unit Review with a mixed 12-question test, plus "Master Grade 6 River Valley Civilizations" flashcards (115 cards in 7 decks)
- **Science, Spanish**: subject cards in place, lessons coming soon

## Run

Open `index.html` in a browser. No build step or server is needed.

## Test

```sh
node tests/questions.test.js
```

Fuzzes every question generator: each answer key passes its own checker, MC options are distinct with exactly one correct, reversed answers get a targeted hint, and sessions cover every question type. Also checks the ELA question bank (4 distinct options, hints on every wrong answer, sessions cover every skill).

## Structure

- `js/util.js`: random helpers, ratio parsing (`3:2`, `3 to 2`, `3/2`)
- `js/diagrams.js`: SVG diagrams generated from `{ a, b, itemA, itemB, layout }` (grouped, mixed, rows, tape)
- `js/questions.js`: the 6 P0 question generators and session builder
- `js/lessons.js`: interactive maths lesson steps (ratio basics)
- `js/ratio-unit.js`: Maths Unit 2 sections (learning targets, lesson steps) and their practice generators
- `js/ela-questions.js`: ELA data (chapters, events, 10 Hero's Journey stages, plot diagram, traits, R.A.C.E.S.) and practice questions
- `js/ela.js`: ELA lessons
- `js/celebrate.js`: slam-dunk animation shown when a lesson or practice session is completed
- `js/social-studies.js`: Social Studies Unit 1 lessons, Q&A, and question bank
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
