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
    assert.strictEqual(new Set(q.options.map((o) => o.html)).size, 4, `ELA ${skill}: 4 distinct options (${q.options.map((o) => o.html)})`);
  }
}
// Sessions for each ELA lesson: [skills, length].
const elaLessons = [[Object.keys(Ela.SKILLS), 12], [['early', 'camp', 'meaning', 'journey', 'traits'], 10], [['gist', 'sequence', 'early', 'camp', 'characters'], 8], [['stages', 'journey', 'plot'], 8], [['traits', 'races'], 8]];
for (let i = 0; i < 2000; i++) {
  const [skills, len] = elaLessons[i % elaLessons.length];
  const s = Ela.buildSession(skills, len);
  assert.strictEqual(s.length, len);
  assert.strictEqual(new Set(s.map((q) => q.summary)).size, len, 'ELA: no duplicate questions in a session');
  for (const k of skills) assert.ok(s.some((q) => q.type === k), `ELA session covers ${k}`);
  for (const q of s) {
    const correct = q.options.filter((o) => o.correct);
    assert.strictEqual(correct.length, 1);
    assert.strictEqual(q.check(correct[0].id).status, 'correct');
    q.options.filter((o) => !o.correct).forEach((o) => assert.ok(q.check(o.id).message));
    assert.strictEqual(q.check(undefined).status, 'invalid');
  }
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
