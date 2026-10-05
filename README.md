# Ratio Explorer

An interactive learning app with a practice engine, organized by subject:

- **Maths 6+**: Lesson 1: What Is a Ratio?, Lesson 2: Ratios and Diagrams
- **ELA 6th Grade**: test prep for Chapters 1–8 of The Lightning Thief and the Hero's Journey: Start Here (test tips, Q&A, full review), Gist & Sequence, The Hero's Journey & the Plot Diagram, Percy's Character & R.A.C.E.S., Chapter-by-Chapter Questions & Answers

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
- `js/lessons.js`: interactive maths lesson steps
- `js/ela-questions.js`: ELA data (chapters, events, 10 Hero's Journey stages, plot diagram, traits, R.A.C.E.S.) and practice questions
- `js/ela.js`: ELA lessons
- `js/app.js`: subjects, views (home, lesson, practice, results) and the feedback flow

## Status

P0 (MVP) is complete. P1 (diagram-builder questions, more question types, 10/15-question sessions, difficulty, LocalStorage progress) is next.

## Share

```sh
node tools/build.js
```

Creates `dist/ratio-explorer.html`, a single self-contained file (all CSS/JS inlined, no internet needed). Send that file (or `dist/ratio-explorer.zip`) and it opens by double-clicking in any modern browser.
