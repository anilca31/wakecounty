// Run with: node tests/questions.test.js
// Loads the browser scripts into a sandbox and fuzzes every question generator.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ctx = vm.createContext({ Math, console });
for (const f of ['util.js', 'diagrams.js', 'questions.js']) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', f), 'utf8');
  vm.runInContext(`${src}\n;globalThis.${f === 'util.js' ? 'Util = Util' : f === 'diagrams.js' ? 'Diagrams = Diagrams' : 'Questions = Questions'};`, ctx);
}
const { Util, Diagrams, Questions } = ctx;

// parseRatio
assert.strictEqual(JSON.stringify(Util.parseRatio('3:2')), JSON.stringify([3, 2]));
assert.strictEqual(JSON.stringify(Util.parseRatio(' 3 : 2 ')), JSON.stringify([3, 2]));
assert.strictEqual(JSON.stringify(Util.parseRatio('3 to 2')), JSON.stringify([3, 2]));
assert.strictEqual(JSON.stringify(Util.parseRatio('3/2')), JSON.stringify([3, 2]));
assert.strictEqual(JSON.stringify(Util.parseRatio('3 TO 2')), JSON.stringify([3, 2]));
assert.strictEqual(Util.parseRatio('3'), null);
assert.strictEqual(Util.parseRatio('three to two'), null);
assert.strictEqual(Util.parseRatio(''), null);

const N = 2000;
for (const [type, gen] of Object.entries(Questions.GENERATORS)) {
  for (let i = 0; i < N; i++) {
    const q = gen(1);
    assert.ok(q.prompt && q.hint && q.explanation && q.solution && q.skill, `${type}: missing text`);
    if (q.visual) assert.match(Diagrams.render(q.visual), /^<svg/);

    if (q.format === 'mc') {
      const correct = q.options.filter((o) => o.correct);
      assert.strictEqual(correct.length, 1, `${type}: exactly one correct option`);
      assert.strictEqual(q.options.length, 4, `${type}: 4 distinct options (${q.options.map((o) => o.key ?? o.html)})`);
      assert.strictEqual(q.check(correct[0].id).status, 'correct');
      for (const o of q.options.filter((o) => !o.correct)) {
        const res = q.check(o.id);
        assert.strictEqual(res.status, 'incorrect');
        assert.ok(res.message, `${type}: wrong option has a targeted hint`);
      }
      assert.strictEqual(q.check(undefined).status, 'invalid');
    } else {
      const [x, y] = Util.parseRatio(q.solution.replace(/\s/g, ''));
      assert.strictEqual(q.check(`${x}:${y}`).status, 'correct');
      assert.strictEqual(q.check(`${x} to ${y}`).status, 'correct');
      assert.strictEqual(q.check(`${x * 2}/${y * 2}`).status, 'correct', 'equivalent ratio accepted');
      const rev = q.check(`${y}:${x}`);
      assert.strictEqual(rev.status, 'incorrect', `${type}: reversed is wrong`);
      assert.ok(rev.message, `${type}: reversed answer gets a targeted hint`);
      assert.strictEqual(q.check('hello').status, 'invalid');
    }
  }
}

// Sessions: right length, and every question type in the lesson appears.
for (const lesson of [1, 2]) {
  for (let i = 0; i < 500; i++) {
    const s = Questions.buildSession(lesson, 5);
    assert.strictEqual(s.length, 5);
    const types = new Set(s.map((q) => q.type));
    for (const t of Questions.LESSON_TYPES[lesson]) assert.ok(types.has(t), `lesson ${lesson} covers ${t}`);
    assert.strictEqual(new Set(s.map((q) => q.summary)).size, 5, 'no duplicate questions in a session');
  }
}

// ELA: every bank item has 4 distinct options with hints, and sessions cover every skill.
const paSrc = fs.readFileSync(path.join(__dirname, '..', 'js', 'plot-align.js'), 'utf8');
vm.runInContext(`${paSrc}\n;globalThis.PlotAlign = PlotAlign;`, ctx);
{
  // Plot alignment: answer key passes, mistakes are marked, gaps are invalid, the Call may also go in rising action.
  const PA = ctx.PlotAlign;
  const all = PA.STAGES.map((_, i) => i);
  const key = Object.fromEntries(all.map((i) => [i, PA.STAGES[i].parts[0]]));
  assert.strictEqual(PA.STAGES.length, 10);
  assert.strictEqual(PA.check(all, key).status, 'correct');
  assert.strictEqual(PA.check(all, { ...key, 1: 'rising' }).status, 'correct', 'Call to Adventure accepted in rising action');
  const oops = PA.check(all, { ...key, 6: 'falling' });
  assert.strictEqual(oops.status, 'incorrect');
  assert.strictEqual(oops.marks[6], false);
  assert.strictEqual(oops.marks[0], true);
  assert.match(oops.message, /9 of 10/);
  assert.strictEqual(PA.check(all, { 0: 'exposition' }).status, 'invalid');
  assert.strictEqual(PA.answerKey(all), 'Exposition: 1 · Inciting incident: 2 · Rising action: 3, 4, 5, 6 · Climax: 7 · Falling action: 8, 9 · Resolution: 10');
  // Taps snap to the right part of the mountain.
  assert.strictEqual(PA.nearestPart(60, 230), 'exposition');
  assert.strictEqual(PA.nearestPart(152, 238), 'inciting');
  assert.strictEqual(PA.nearestPart(230, 140), 'rising');
  assert.strictEqual(PA.nearestPart(305, 30), 'climax');
  assert.strictEqual(PA.nearestPart(380, 130), 'falling');
  assert.strictEqual(PA.nearestPart(540, 214), 'resolution');
}
const elaSrc = fs.readFileSync(path.join(__dirname, '..', 'js', 'ela-questions.js'), 'utf8');
vm.runInContext(`${elaSrc}\n;globalThis.ElaQuestions = ElaQuestions;`, ctx);
const Ela = ctx.ElaQuestions;
assert.strictEqual(Ela.STAGES.length, 10, 'ELA: 10 Hero\'s Journey stages');
for (const s of Ela.STAGES) assert.ok(Ela.PLOT[s.plot], `ELA: ${s.name} maps to a plot part`);
for (const item of Ela.BANK) {
  assert.ok(Ela.SKILLS[item.skill], `ELA: unknown skill ${item.skill}`);
  assert.strictEqual(item.options.length, 4, `ELA: 4 options for "${item.prompt}"`);
  assert.strictEqual(new Set(item.options.map(([html]) => html)).size, 4, `ELA: distinct options for "${item.prompt}"`);
  item.options.slice(1).forEach(([, hint]) => assert.ok(hint, `ELA: wrong option has a hint in "${item.prompt}"`));
  assert.ok(item.explanation);
}
assert.strictEqual(new Set(Ela.BANK.map((q) => q.prompt)).size, Ela.BANK.length, 'ELA: no duplicate prompts');
// Generated questions (gist, sequence): 4 distinct options, exactly one correct.
for (const [skill, factories] of Object.entries(Ela.FACTORIES)) {
  for (let i = 0; i < 300; i++) {
    const q = factories[i % factories.length]();
    if (q.format === 'custom') continue;
    assert.strictEqual(new Set(q.options.map((o) => o.html)).size, 4, `ELA ${skill}: 4 distinct options (${q.options.map((o) => o.html)})`);
  }
}
// Sessions for each ELA lesson: [skills, length].
const elaLessons = [[Object.keys(Ela.SKILLS), 12], [['early', 'camp', 'meaning', 'journey', 'traits'], 10], [['gist', 'sequence', 'early', 'camp', 'characters'], 8], [['stages', 'journey', 'plot', 'align'], 8], [['traits', 'races'], 8]];
for (let i = 0; i < 2000; i++) {
  const [skills, len] = elaLessons[i % elaLessons.length];
  const s = Ela.buildSession(skills, len);
  assert.strictEqual(s.length, len);
  assert.strictEqual(new Set(s.map((q) => q.summary)).size, len, 'ELA: no duplicate questions in a session');
  for (const k of skills) assert.ok(s.some((q) => q.type === k), `ELA session covers ${k}`);
  for (const q of s) {
    if (q.format === 'custom') {
      assert.strictEqual(q.check({}).status, 'invalid', 'ELA align: empty diagram is invalid');
      assert.ok(q.solution && q.explanation && typeof q.mount === 'function');
      continue;
    }
    const correct = q.options.filter((o) => o.correct);
    assert.strictEqual(correct.length, 1);
    assert.strictEqual(q.check(correct[0].id).status, 'correct');
    q.options.filter((o) => !o.correct).forEach((o) => assert.ok(q.check(o.id).message));
    assert.strictEqual(q.check(undefined).status, 'invalid');
  }
}

// Maths Unit 2 (js/ratio-unit.js): fuzz every generator and every section's practice session.
for (const f of ['lessons.js', 'ratio-unit.js']) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', f), 'utf8');
  vm.runInContext(`${src}\n;globalThis.${f === 'lessons.js' ? 'Lessons = Lessons' : 'RatioUnit = RatioUnit'};`, ctx);
}
const { RatioUnit } = ctx;
const num = RatioUnit.parseNumber;
assert.strictEqual(num('12'), 12);
assert.strictEqual(num('$1.50'), 1.5);
assert.strictEqual(num('.5'), 0.5);
assert.strictEqual(num('3/2'), 1.5);
assert.strictEqual(num('15 cups of flour'), 15);
assert.strictEqual(num('1,200'), 1200);
assert.strictEqual(num('twelve'), null);
assert.strictEqual(num(''), null);

for (const [type, gen] of Object.entries(RatioUnit.GENERATORS)) {
  for (let i = 0; i < 2000; i++) {
    const q = gen();
    assert.strictEqual(q.type, type);
    assert.ok(q.prompt && q.hint && q.explanation && q.solution && q.skill && q.summary, `${type}: missing text`);
    if (q.format === 'mc') {
      assert.ok(q.options.length >= 3, `${type}: at least 3 options`);
      assert.strictEqual(new Set(q.options.map((o) => o.html)).size, q.options.length, `${type}: distinct options`);
      const correct = q.options.filter((o) => o.correct);
      assert.strictEqual(correct.length, 1, `${type}: exactly one correct option`);
      assert.strictEqual(q.check(correct[0].id).status, 'correct');
      for (const o of q.options.filter((o) => !o.correct)) {
        const res = q.check(o.id);
        assert.strictEqual(res.status, 'incorrect');
        assert.ok(res.message, `${type}: wrong option has a targeted hint`);
      }
      assert.strictEqual(q.check(undefined).status, 'invalid');
    } else if (q.format === 'number') {
      const ans = num(q.solution);
      assert.ok(ans != null && Number.isFinite(ans), `${type}: solution "${q.solution}" is a number`);
      assert.strictEqual(q.check(q.solution).status, 'correct', `${type}: solution checks`);
      assert.strictEqual(q.check(String(ans)).status, 'correct');
      assert.strictEqual(q.check(String(ans + 1000)).status, 'incorrect');
      assert.strictEqual(q.check('hello').status, 'invalid');
    } else {
      assert.strictEqual(q.format, 'ratio');
      assert.strictEqual(q.check(q.solution).status, 'correct', `${type}: solution checks`);
      assert.strictEqual(q.check('hello').status, 'invalid');
    }
  }
}
// makeEquiv: the same ratio or an "added" ratio is wrong; any multiple is right.
for (let i = 0; i < 500; i++) {
  const q = RatioUnit.GENERATORS.makeEquiv();
  const [a, b] = q.summary.match(/(\d+) : (\d+)/).slice(1).map(Number);
  assert.strictEqual(q.check(`${a}:${b}`).status, 'incorrect');
  assert.strictEqual(q.check(`${a * 5}:${b * 5}`).status, 'correct');
  assert.strictEqual(q.check(`${a + 2}:${b + 2}`).status, 'incorrect');
}
// Sessions: right length, no duplicates, every type in the section shows up.
assert.strictEqual(RatioUnit.sections.length, 10, 'Unit 2 has 10 sections');
assert.strictEqual(new Set(RatioUnit.sections.map((l) => l.id)).size, 10, 'section ids are unique');
for (const l of RatioUnit.sections) {
  assert.ok(l.steps.length >= 3 && l.steps[0].title === 'Learning targets', `${l.short}: starts with learning targets`);
  for (let i = 0; i < 300; i++) {
    const s = l.buildSession(l.sessionLength);
    assert.strictEqual(s.length, l.sessionLength, `${l.short}: session length`);
    assert.strictEqual(new Set(s.map((q) => q.summary)).size, s.length, `${l.short}: no duplicate questions`);
    for (const t of l.types) assert.ok(s.some((q) => q.type === t), `${l.short}: covers ${t}`);
  }
}

// Social Studies Unit 1 (js/social-studies.js): bank quality, generated questions, and sessions.
{
  const mapSrc = fs.readFileSync(path.join(__dirname, '..', 'js', 'south-asia-map.js'), 'utf8');
  vm.runInContext(`${mapSrc}\n;globalThis.SouthAsiaMap = SouthAsiaMap;`, ctx);
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'social-studies.js'), 'utf8');
  vm.runInContext(`${src}\n;globalThis.SocialStudies = SocialStudies;`, ctx);
  const SAM = ctx.SouthAsiaMap;
  // Map scale sanity: measurements match real-world distances closely.
  const near = (v, want, tol) => assert.ok(Math.abs(v - want) <= tol, `map distance ${Math.round(v)} should be about ${want}`);
  near(SAM.miles(SAM.PLACES.delhi.at, SAM.PLACES.kolkata.at), 815, 60);
  near(SAM.miles(SAM.PLACES.mumbai.at, SAM.PLACES.chennai.at), 640, 50);
  assert.strictEqual(SAM.direction(SAM.PLACES.chennai.at, SAM.PLACES.delhi.at).dir, 'north');
  assert.strictEqual(SAM.direction(SAM.PLACES.delhi.at, SAM.PLACES.colombo.at).dir, 'south');
  assert.match(SAM.render({ labels: false, line: [[70, 20], [80, 20]] }), /^<svg/);
  const SS = ctx.SocialStudies;
  for (const item of SS.BANK) {
    assert.ok(SS.SKILLS[item.skill], `SS: unknown skill ${item.skill}`);
    assert.strictEqual(item.options.length, 4, `SS: 4 options for "${item.prompt}"`);
    assert.strictEqual(new Set(item.options.map(([html]) => html)).size, 4, `SS: distinct options for "${item.prompt}"`);
    item.options.slice(1).forEach(([, hint]) => assert.ok(hint, `SS: wrong option has a hint in "${item.prompt}"`));
    assert.ok(item.explanation);
  }
  assert.strictEqual(new Set(SS.BANK.map((q) => q.prompt)).size, SS.BANK.length, 'SS: no duplicate prompts');
  for (const [skill, factories] of Object.entries(SS.FACTORIES)) {
    assert.ok(SS.SKILLS[skill], `SS: factory for unknown skill ${skill}`);
    for (const f of factories) {
      const q = f();
      assert.strictEqual(new Set(q.options.map((o) => o.html)).size, 4, `SS ${skill}: 4 distinct options (${q.prompt})`);
      const correct = q.options.filter((o) => o.correct);
      assert.strictEqual(correct.length, 1);
      assert.strictEqual(q.check(correct[0].id).status, 'correct');
      q.options.filter((o) => !o.correct).forEach((o) => assert.ok(q.check(o.id).message, `SS ${skill}: hint for wrong option (${q.prompt})`));
      assert.strictEqual(q.check(undefined).status, 'invalid');
    }
  }
  // Flashcards: every deck has cards with text on both sides and unique ids; "all" holds every topic card.
  const [all, ...topics] = SS.DECKS;
  assert.strictEqual(all.key, 'all');
  assert.strictEqual(all.cards.length, topics.reduce((n, d) => n + d.cards.length, 0));
  assert.ok(all.cards.length >= 100, `SS: at least 100 flashcards (${all.cards.length})`);
  assert.strictEqual(new Set(all.cards.map((c) => c.id)).size, all.cards.length, 'SS: flashcard ids are unique');
  for (const c of all.cards) assert.ok(c.front.trim() && c.back.trim() && c.tag, `SS: flashcard ${c.id} has both sides`);
  for (const d of SS.DECKS) assert.ok(d.title && d.short && d.icon && d.color && d.cards.length >= 15, `SS: deck ${d.key} is complete`);
  // Map questions: fuzz every map generator (factories are shared, so run them many times).
  for (const skill of ['distance', 'latlong', 'direction']) {
    for (let i = 0; i < 400; i++) {
      const q = SS.FACTORIES[skill][SS.FACTORIES[skill].length - 1]();
      assert.match(q.visualHtml, /^<svg/, `SS ${skill}: has a map`);
      assert.strictEqual(new Set(q.options.map((o) => o.html)).size, 4, `SS ${skill}: 4 distinct options (${q.options.map((o) => o.html)})`);
      assert.strictEqual(q.options.filter((o) => o.correct).length, 1);
      q.options.filter((o) => !o.correct).forEach((o) => assert.ok(q.check(o.id).message));
    }
  }
  assert.strictEqual(SS.lessons.length, 7);
  assert.strictEqual(new Set(SS.lessons.map((l) => l.id)).size, 7, 'SS: lesson ids are unique');
  for (const l of SS.lessons) {
    assert.strictEqual(l.steps[0].title, 'Learning targets', `SS ${l.short}: starts with targets`);
    for (let i = 0; i < 300; i++) {
      const s = l.buildSession(l.sessionLength);
      assert.strictEqual(s.length, l.sessionLength, `SS ${l.short}: session length`);
      assert.strictEqual(new Set(s.map((q) => q.summary)).size, s.length, `SS ${l.short}: no duplicates`);
      for (const k of l.skills) assert.ok(s.some((q) => q.type === k), `SS ${l.short}: covers ${k}`);
    }
  }
}
// Lesson ids must be unique across every subject.
{
  const ids = [...ctx.RatioUnit.sections, ...ctx.SocialStudies.lessons].map((l) => l.id).concat([3, 4, 5, 6, 7]);
  assert.strictEqual(new Set(ids).size, ids.length, 'lesson ids are unique across subjects');
}

// Progress: completion counts reading + practice per lesson; works with storage unavailable.
const progSrc = fs.readFileSync(path.join(__dirname, '..', 'js', 'progress.js'), 'utf8');
vm.runInContext(`${progSrc}\n;globalThis.Progress = Progress;`, ctx);
const { Progress } = ctx;
const lessonsA = [{ id: 1 }, { id: 2 }];
assert.strictEqual(Progress.completion(lessonsA).pct, 0);
Progress.markLearned(1);
Progress.addSession({ lessonId: 1, total: 5, correct: 4, missed: 1 });
assert.deepStrictEqual({ ...Progress.completion(lessonsA) }, { done: 2, total: 4, pct: 50 });
assert.strictEqual(Progress.percent(Progress.sessionsFor(1)[0]), 80);
assert.strictEqual(Progress.sessionsFor(2).length, 0);
Progress.reset();
assert.strictEqual(Progress.allSessions().length, 0);

console.log('All question tests passed.');
