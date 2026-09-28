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

console.log('All question tests passed.');
