# Ratio Explorer

An interactive ratio learning app (Lesson 1: What Is a Ratio?, Lesson 2: Ratios and Diagrams) with a practice engine.

## Run

Open `index.html` in a browser. No build step or server is needed.

## Test

```sh
node tests/questions.test.js
```

Fuzzes every question generator: each answer key passes its own checker, MC options are distinct with exactly one correct, reversed answers get a targeted hint, and sessions cover every question type.

## Structure

- `js/util.js`: random helpers, ratio parsing (`3:2`, `3 to 2`, `3/2`)
- `js/diagrams.js`: SVG diagrams generated from `{ a, b, itemA, itemB, layout }` (grouped, mixed, rows, tape)
- `js/questions.js`: the 6 P0 question generators and session builder
- `js/lessons.js`: interactive lesson steps
- `js/app.js`: views (home, lesson, practice, results) and the feedback flow

## Status

P0 (MVP) is complete. P1 (diagram-builder questions, more question types, 10/15-question sessions, difficulty, LocalStorage progress) is next.

## Share

```sh
node tools/build.js
```

Creates `dist/ratio-explorer.html`, a single self-contained file (all CSS/JS inlined, no internet needed). Send that file (or `dist/ratio-explorer.zip`) and it opens by double-clicking in any modern browser.
