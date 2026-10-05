// Interactive lesson content. Each step has static `html` plus an optional `mount(el)` that wires up interactivity.
const Lessons = (() => {
  const D = Diagrams;
  const r = (x, y) => `${x} : ${y}`;

  // Inline check with instant feedback. options: [{ label, correct, feedback }]
  function miniCheck(el, selector, options) {
    const host = el.querySelector(selector);
    host.innerHTML = `
      <div class="mini-options">${options.map((o, i) => `<button type="button" class="btn btn-option" data-i="${i}">${o.label}</button>`).join('')}</div>
      <p class="mini-feedback" role="status"></p>`;
    const fb = host.querySelector('.mini-feedback');
    host.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const o = options[+btn.dataset.i];
        host.querySelectorAll('button').forEach((b) => b.classList.remove('is-correct', 'is-wrong'));
        btn.classList.add(o.correct ? 'is-correct' : 'is-wrong');
        fb.className = `mini-feedback ${o.correct ? 'good' : 'bad'}`;
        fb.innerHTML = `${o.correct ? '✅ ' : '🤔 '}${o.feedback}`;
      });
    });
  }

  // A +/- stepper; calls onChange(value) and returns a setter.
  function stepper(el, selector, { value, min = 0, max = 10, label, onChange }) {
    const host = el.querySelector(selector);
    host.innerHTML = `
      <span class="stepper-label">${label}</span>
      <button type="button" class="btn btn-round" data-d="-1" aria-label="Remove one ${label}">−</button>
      <output class="stepper-value">${value}</output>
      <button type="button" class="btn btn-round" data-d="1" aria-label="Add one ${label}">+</button>`;
    const out = host.querySelector('output');
    host.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = Math.min(max, Math.max(min, value + +btn.dataset.d));
        if (next === value) return;
        value = next;
        out.textContent = value;
        onChange(value);
      });
    });
  }

  const lesson1 = {
    id: 1,
    short: 'Lesson 1',
    title: 'Lesson 1: What Is a Ratio?',
    blurb: 'Compare two quantities, write ratios three ways, and learn why order matters.',
    art: D.render({ a: 3, b: 2, itemA: 'red', itemB: 'blue' }),
    steps: [
      {
        title: 'What is a ratio?',
        html: `
          <p>A <strong>ratio</strong> compares two quantities.</p>
          <div class="diagram-box">${D.render({ a: 3, b: 2, itemA: 'red', itemB: 'blue' })}</div>
          <p>Count the shapes. How many ${D.chip('red')} are there? How many ${D.chip('blue')}?</p>
          <button type="button" class="btn btn-secondary" id="reveal">Show the ratio</button>
          <div class="reveal-box" id="revealBox" hidden>
            <p>There are <strong>3</strong> red circles and <strong>2</strong> blue squares.</p>
            <p class="big-ratio">3 : 2</p>
            <p>We say: <em>"For every 3 red circles, there are 2 blue squares."</em></p>
          </div>`,
        mount(el) {
          el.querySelector('#reveal').addEventListener('click', (e) => {
            el.querySelector('#revealBox').hidden = false;
            e.currentTarget.hidden = true;
          });
        },
      },
      {
        title: 'What two quantities are being compared?',
        html: `
          <p>Every ratio compares <strong>two</strong> things. Before you write a ratio, ask: <em>what am I comparing?</em></p>
          <div class="callout">A zoo has <strong>4 penguins</strong> and <strong>6 seals</strong>.<br>Find the ratio of penguins to seals.</div>
          <p>Which two quantities does this ratio compare?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: 'Penguins and seals', correct: true, feedback: 'Right! The ratio compares the number of penguins (4) to the number of seals (6): <strong>4 : 6</strong>.' },
            { label: 'Penguins and all animals', correct: false, feedback: 'The question says "penguins to seals", so we compare penguins with seals, not with the total.' },
            { label: 'Seals and penguins', correct: false, feedback: 'Close, but the question says penguins <em>first</em>. The order of the words tells you the order of the numbers.' },
          ]);
        },
      },
      {
        title: 'Ratio notation',
        html: `
          <p>There are three ways to write the same ratio. Tap each one.</p>
          <div class="diagram-box">${D.render({ a: 3, b: 2, itemA: 'red', itemB: 'blue' })}</div>
          <div class="notation-tabs" role="tablist">
            <button type="button" class="btn btn-option" role="tab" data-n="words">3 to 2</button>
            <button type="button" class="btn btn-option" role="tab" data-n="colon">3 : 2</button>
            <button type="button" class="btn btn-option" role="tab" data-n="frac">3/2</button>
          </div>
          <div class="callout" id="notationInfo">Tap a notation above.</div>
          <p class="muted">All three mean the same thing: 3 red circles for every 2 blue squares.</p>`,
        mount(el) {
          const info = {
            words: '<strong>3 to 2</strong>: the ratio written in words. Read it just like it looks: "three to two".',
            colon: '<strong>3 : 2</strong>: colon notation. The colon is read as "to", so this is also "three to two".',
            frac: '<strong>3/2</strong>: fraction notation. It <em>looks</em> like a fraction, but here it still means "3 to 2". It does <em>not</em> mean 3 out of 2.',
          };
          const box = el.querySelector('#notationInfo');
          el.querySelectorAll('[data-n]').forEach((btn) => btn.addEventListener('click', () => {
            el.querySelectorAll('[data-n]').forEach((b) => b.classList.toggle('is-selected', b === btn));
            box.innerHTML = info[btn.dataset.n];
          }));
        },
      },
      {
        title: 'Ratio language',
        html: `
          <p>Use the buttons to change the shapes. Watch how we describe the ratio.</p>
          <div class="stepper-row">
            <div class="stepper" id="stepA"></div>
            <div class="stepper" id="stepB"></div>
          </div>
          <div class="diagram-box" id="langDiagram"></div>
          <ul class="language-list" id="langList"></ul>`,
        mount(el) {
          let a = 3, b = 2;
          const draw = () => {
            el.querySelector('#langDiagram').innerHTML = D.render({ a, b, itemA: 'red', itemB: 'blue' });
            el.querySelector('#langList').innerHTML = `
              <li>The ratio of red circles to blue squares is <strong>${a} to ${b}</strong>.</li>
              <li>For every <strong>${a}</strong> ${a === 1 ? 'red circle' : 'red circles'}, there ${b === 1 ? 'is' : 'are'} <strong>${b}</strong> ${b === 1 ? 'blue square' : 'blue squares'}.</li>
              <li>For each <strong>${a}</strong> red, there ${b === 1 ? 'is' : 'are'} <strong>${b}</strong> blue.</li>
              <li>Written with symbols: <strong>${r(a, b)}</strong> or <strong>${a}/${b}</strong></li>`;
          };
          stepper(el, '#stepA', { value: a, min: 1, max: 8, label: 'red', onChange: (v) => { a = v; draw(); } });
          stepper(el, '#stepB', { value: b, min: 1, max: 8, label: 'blue', onChange: (v) => { b = v; draw(); } });
          draw();
        },
      },
      {
        title: 'Order matters',
        html: `
          <p>The <strong>order</strong> of a ratio matches the order of the words.</p>
          <div class="diagram-box">${D.render({ a: 3, b: 5, itemA: 'green', itemB: 'orange' })}</div>
          <div class="callout" id="orderBox"></div>
          <button type="button" class="btn btn-secondary" id="swap">⇄ Swap the order</button>
          <p class="muted" id="orderNote"></p>`,
        mount(el) {
          let flipped = false;
          const draw = () => {
            el.querySelector('#orderBox').innerHTML = flipped
              ? 'Orange stars <strong>to</strong> green triangles = <span class="big-ratio inline">5 : 3</span>'
              : 'Green triangles <strong>to</strong> orange stars = <span class="big-ratio inline">3 : 5</span>';
            el.querySelector('#orderNote').textContent = flipped
              ? 'Same shapes, but now orange stars come first. 5 : 3 is a different ratio from 3 : 5.'
              : 'Green triangles are named first, so their number comes first.';
          };
          el.querySelector('#swap').addEventListener('click', () => { flipped = !flipped; draw(); });
          draw();
        },
      },
      {
        title: 'Quick check',
        html: `
          <div class="callout">A class has <strong>7 pencils</strong> and <strong>2 pens</strong>.</div>
          <p>What is the ratio of <strong>pens to pencils</strong>?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: '7 : 2', correct: false, feedback: 'That is pencils to pens. The question asks for pens first.' },
            { label: '2 : 7', correct: true, feedback: 'Yes! Pens come first (2), then pencils (7): <strong>2 : 7</strong>.' },
            { label: '2 : 9', correct: false, feedback: '9 is the total. The ratio compares pens to pencils, not pens to everything.' },
          ]);
        },
      },
    ],
  };

  const lesson2 = {
    id: 2,
    short: 'Lesson 2',
    title: 'Lesson 2: Ratios and Diagrams',
    blurb: 'Show ratios with objects, read ratios from diagrams, and build your own diagrams.',
    art: D.render({ a: 2, b: 4, itemA: 'green', itemB: 'orange', layout: 'rows' }),
    steps: [
      {
        title: 'Representing ratios with objects',
        html: `
          <p>We can show a ratio by drawing one object for each thing being counted.</p>
          <div class="callout" id="repText"></div>
          <div class="diagram-box" id="repDiagram"></div>
          <button type="button" class="btn btn-secondary" id="another">Show another ratio</button>`,
        mount(el) {
          const draw = () => {
            const [ka, kb] = Util.pickTwo(D.ITEM_KEYS);
            const [a, b] = Util.twoCounts(1, 6);
            const A = D.ITEMS[ka], B = D.ITEMS[kb];
            el.querySelector('#repText').innerHTML = `The ratio of ${A.name} to ${B.name} is <strong>${r(a, b)}</strong>.<br>So we draw <strong>${a}</strong> ${a === 1 ? A.single : A.name} and <strong>${b}</strong> ${b === 1 ? B.single : B.name}.`;
            el.querySelector('#repDiagram').innerHTML = D.render({ a, b, itemA: ka, itemB: kb });
          };
          el.querySelector('#another').addEventListener('click', draw);
          draw();
        },
      },
      {
        title: 'Reading ratios from diagrams',
        html: `
          <p>To read a ratio from a diagram, count one kind of object at a time. <strong>Tap each shape</strong> to count it.</p>
          <div class="diagram-box countable" id="countDiagram">${D.render({ a: 4, b: 5, itemA: 'purple', itemB: 'green', layout: 'mixed', countable: true, order: ['a', 'b', 'b', 'a', 'b', 'a', 'b', 'b', 'a'] })}</div>
          <p class="counters">${D.chip('purple')} <strong id="cntA">0</strong> &nbsp; ${D.chip('green')} <strong id="cntB">0</strong></p>
          <div class="callout" id="countResult" hidden>You counted <strong>4</strong> purple diamonds and <strong>5</strong> green triangles.<br>Ratio of purple diamonds to green triangles: <span class="big-ratio inline">4 : 5</span></div>`,
        mount(el) {
          const counted = { a: new Set(), b: new Set() };
          el.querySelectorAll('[data-obj]').forEach((node) => {
            node.setAttribute('tabindex', '0');
            const toggle = () => {
              const set = counted[node.dataset.obj];
              const id = node.dataset.i;
              set.has(id) ? set.delete(id) : set.add(id);
              node.classList.toggle('counted', set.has(id));
              el.querySelector('#cntA').textContent = counted.a.size;
              el.querySelector('#cntB').textContent = counted.b.size;
              el.querySelector('#countResult').hidden = !(counted.a.size === 4 && counted.b.size === 5);
            };
            node.addEventListener('click', toggle);
            node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
          });
        },
      },
      {
        title: 'Creating diagrams from ratios',
        html: `
          <div class="callout">Make a diagram that shows the ratio of red circles to blue squares <span class="big-ratio inline">4 : 3</span></div>
          <div class="stepper-row">
            <div class="stepper" id="stepA"></div>
            <div class="stepper" id="stepB"></div>
          </div>
          <div class="diagram-box" id="buildDiagram"></div>
          <button type="button" class="btn btn-primary" id="checkBuild">Check my diagram</button>
          <p class="mini-feedback" id="buildFb" role="status"></p>`,
        mount(el) {
          let a = 0, b = 0;
          const fb = el.querySelector('#buildFb');
          const draw = () => {
            el.querySelector('#buildDiagram').innerHTML = a + b === 0
              ? '<p class="muted">Add some shapes with the + buttons.</p>'
              : D.render({ a, b, itemA: 'red', itemB: 'blue' });
            fb.textContent = '';
            fb.className = 'mini-feedback';
          };
          stepper(el, '#stepA', { value: a, min: 0, max: 8, label: 'red', onChange: (v) => { a = v; draw(); } });
          stepper(el, '#stepB', { value: b, min: 0, max: 8, label: 'blue', onChange: (v) => { b = v; draw(); } });
          el.querySelector('#checkBuild').addEventListener('click', () => {
            let msg;
            if (a === 4 && b === 3) msg = ['good', '✅ Perfect! 4 red circles and 3 blue squares show the ratio 4 : 3.'];
            else if (a === 3 && b === 4) msg = ['bad', '🤔 You have 3 red and 4 blue. That is reversed! Red comes first in 4 : 3.'];
            else msg = ['bad', `🤔 You have ${a} red and ${b} blue (${r(a, b)}). The first number tells you how many red; the second tells you how many blue.`];
            fb.className = `mini-feedback ${msg[0]}`;
            fb.textContent = msg[1];
          });
          draw();
        },
      },
      {
        title: 'The ratio and its diagram',
        html: `
          <p>A diagram can be arranged in different ways. Tap each style.</p>
          <div class="notation-tabs">
            <button type="button" class="btn btn-option is-selected" data-l="grouped">Groups</button>
            <button type="button" class="btn btn-option" data-l="mixed">Mixed</button>
            <button type="button" class="btn btn-option" data-l="rows">Rows</button>
            <button type="button" class="btn btn-option" data-l="tape">Tape</button>
          </div>
          <div class="diagram-box" id="layoutDiagram"></div>
          <div class="callout">In every style there are <strong>3</strong> orange stars and <strong>4</strong> blue squares. The ratio is always <span class="big-ratio inline">3 : 4</span></div>
          <p class="muted">Moving the objects around doesn't change the ratio. Only changing <em>how many</em> of each kind does.</p>`,
        mount(el) {
          const order = ['b', 'a', 'b', 'b', 'a', 'b', 'a'];
          const draw = (layout) => {
            el.querySelector('#layoutDiagram').innerHTML = D.render({ a: 3, b: 4, itemA: 'orange', itemB: 'blue', layout, order });
          };
          el.querySelectorAll('[data-l]').forEach((btn) => btn.addEventListener('click', () => {
            el.querySelectorAll('[data-l]').forEach((b) => b.classList.toggle('is-selected', b === btn));
            draw(btn.dataset.l);
          }));
          draw('grouped');
        },
      },
      {
        title: 'Quick check',
        html: `
          <div class="diagram-box">${D.render({ a: 5, b: 2, itemA: 'purple', itemB: 'green' })}</div>
          <p>What is the ratio of <strong>purple diamonds to green triangles</strong>?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: '2 : 5', correct: false, feedback: 'That is green to purple. Purple comes first here.' },
            { label: '5 : 7', correct: false, feedback: '7 is the total number of shapes. Compare purple to green only.' },
            { label: '5 : 2', correct: true, feedback: 'Correct! 5 purple diamonds for every 2 green triangles: <strong>5 : 2</strong>.' },
          ]);
        },
      },
    ],
  };

  return { all: [lesson1, lesson2], byId: { 1: lesson1, 2: lesson2 }, miniCheck };
})();
