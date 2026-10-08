// ELA 6th Grade lessons: The Lightning Thief (Chapters 1–8) and the Hero's Journey.
// Data and practice questions live in js/ela-questions.js.
const Ela = (() => {
  const { shuffle } = Util;
  const { CHAPTERS, EVENTS, STAGES, PLOT, TRAITS, RACES, SKILLS, SCOPE, CHAPTER_QA, JOURNEY_QA, MODEL_RESPONSES, CH8_KEY } = ElaQuestions;

  // Buttons that each show their own text in a shared callout. items: [{ label, html }]
  function tabs(el, selector, items) {
    const host = el.querySelector(selector);
    host.innerHTML = `
      <div class="notation-tabs">${items.map((it, i) => `<button type="button" class="btn btn-option" data-t="${i}">${it.label}</button>`).join('')}</div>
      <div class="callout">Tap a button above.</div>`;
    const info = host.querySelector('.callout');
    host.querySelectorAll('[data-t]').forEach((btn) => btn.addEventListener('click', () => {
      host.querySelectorAll('[data-t]').forEach((b) => b.classList.toggle('is-selected', b === btn));
      info.innerHTML = items[+btn.dataset.t].html;
    }));
  }

  // Tap events in the order they happen. Correct taps move into the timeline.
  function sequencer(el, selector, events) {
    const host = el.querySelector(selector);
    let next = 0;
    const draw = () => {
      const shuffled = shuffle(events.map((e, i) => ({ ...e, i })));
      host.innerHTML = `
        <ol class="timeline"></ol>
        <div class="mini-options seq-options">${shuffled.map((e) => `<button type="button" class="btn btn-option" data-i="${e.i}">${e.text}</button>`).join('')}</div>
        <p class="mini-feedback" role="status"></p>
        <button type="button" class="btn btn-ghost small" data-reset>Start over</button>`;
      next = 0;
      const fb = host.querySelector('.mini-feedback');
      const timeline = host.querySelector('.timeline');
      host.querySelector('[data-reset]').addEventListener('click', draw);
      host.querySelectorAll('[data-i]').forEach((btn) => btn.addEventListener('click', () => {
        const i = +btn.dataset.i;
        if (i !== next) {
          btn.classList.add('is-wrong');
          setTimeout(() => btn.classList.remove('is-wrong'), 600);
          fb.className = 'mini-feedback bad';
          fb.textContent = '🤔 Not yet. Something else happens before that.';
          return;
        }
        btn.remove();
        timeline.insertAdjacentHTML('beforeend', `<li><span class="muted small">Ch. ${events[i].ch}</span> ${events[i].text}</li>`);
        next++;
        fb.className = 'mini-feedback good';
        fb.textContent = next === events.length ? '✅ All in order! You sequenced the key events.' : '✅ Yes! What happens next?';
      }));
    };
    draw();
  }

  // Click-to-reveal questions with model answers.
  const qa = (items) => `<div class="qa-list">${items.map(([q, a]) => `
    <details class="qa"><summary>${q}</summary><div class="qa-answer">${a}</div></details>`).join('')}</div>`;

  // Plot diagram "mountain" with the five parts; `on` highlights one part.
  function plotSvg(on) {
    const seg = (part, d) => `<path class="plot-seg ${on === part ? 'on' : ''}" d="${d}"/>`;
    return `
      <svg class="diagram plot" viewBox="0 0 600 230" role="img" aria-label="Plot diagram: exposition, rising action, climax, falling action, resolution">
        ${seg('exposition', 'M20 190 L150 190')}
        ${seg('rising', 'M150 190 L380 45')}
        ${seg('falling', 'M380 45 L500 150')}
        ${seg('resolution', 'M500 150 L585 150')}
        <circle class="plot-seg plot-dot ${on === 'climax' ? 'on' : ''}" cx="380" cy="45" r="9"/>
        <circle class="plot-here" cx="250" cy="127" r="7"/>
        <text class="tape-label" x="240" y="112" text-anchor="end">Ch. 1–8 so far</text>
        <text class="tape-label" x="85" y="215" text-anchor="middle">Exposition</text>
        <text class="tape-label" x="305" y="175" text-anchor="middle">Rising Action</text>
        <text class="tape-label" x="380" y="25" text-anchor="middle">Climax</text>
        <text class="tape-label" x="455" y="80">Falling Action</text>
        <text class="tape-label" x="542" y="175" text-anchor="middle">Resolution</text>
      </svg>`;
  }

  const chapterList = (chapters) => `
    <dl class="glossary">
      ${chapters.map(([n, t, summary, gist]) => `
        <dt>Ch. ${n}: “${t}”</dt>
        <dd>${summary}<p class="gist"><strong>Gist:</strong> ${gist}</p></dd>`).join('')}
    </dl>`;

  // ---------- Start here: tips + full review ----------
  const startHere = {
    id: 3,
    short: 'Full review',
    title: 'Start Here: Test Tips & Full Review',
    blurb: 'What the test is like, what to study, how to prepare, and a mixed practice test covering every skill.',
    art: '<span class="lesson-emoji">🎯</span>',
    sessionLength: 12,
    skills: Object.keys(SKILLS),
    steps: [
      {
        title: 'What kind of test is this?',
        html: `
          <div class="callout"><strong>You can use your copy of <em>The Lightning Thief</em> during the test.</strong> But this is an <strong>application test</strong>, not a test of simply remembering events.</div>
          <p>Your book helps you <strong>find evidence and details</strong>. You still have to <strong>apply the skills</strong> you practiced in class: finding the gist, sequencing, connecting to the Hero's Journey, analyzing Percy, and writing with R.A.C.E.S.</p>
          <p class="muted">That means you shouldn't just study <em>what</em> happened in Chapters 1–8. Practice thinking about <em>how</em> and <em>why</em> events connect to the skills.</p>`,
      },
      {
        title: 'What should I study?',
        html: `
          <p>You will need to be able to:</p>
          <ul class="checklist">
            <li>Identify the <strong>gist</strong> of a chapter or section. <span class="muted small">→ Gist &amp; Sequence lesson</span></li>
            <li><strong>Sequence</strong> key events in chronological order. <span class="muted small">→ Gist &amp; Sequence lesson</span></li>
            <li>Connect Percy's experiences to the <strong>Hero's Journey</strong>. <span class="muted small">→ Hero's Journey lesson</span></li>
            <li>Connect the <strong>10 stages</strong> of the Hero's Journey to the <strong>5 parts of a plot diagram</strong>. <span class="muted small">→ Hero's Journey lesson</span></li>
            <li>Analyze <strong>Percy's character</strong> using evidence from the text. <span class="muted small">→ Character &amp; R.A.C.E.S. lesson</span></li>
            <li>Explain how Percy's experiences align with the Hero's Journey using <strong>R.A.C.E.S.</strong> <span class="muted small">→ Character &amp; R.A.C.E.S. lesson</span></li>
          </ul>`,
      },
      {
        title: 'How should I prepare?',
        html: `
          <ul class="tips">
            <li>📝 <strong>Write a one-sentence gist for each chapter</strong> and keep it on a sticky note at the start of that chapter. It turns your book into a quick map.</li>
            <li>🔖 <strong>Flag key pages</strong> with sticky notes: Mrs. Dodds (Ch. 1), the Fates (Ch. 2), Grover's goat legs (Ch. 3), the Minotaur (Ch. 4), meeting Chiron (Ch. 5), the bathroom (Ch. 6), being claimed (Ch. 8).</li>
            <li>🗺️ <strong>Label each flag with a Hero's Journey stage</strong> (for example, "Crossing the Threshold"). Then you can find evidence fast during the test.</li>
            <li>💪 <strong>Mark evidence for Percy's traits</strong>: brave, loyal, quick-tempered, loving toward his mom, feels like an outsider.</li>
            <li>✍️ <strong>Practice one R.A.C.E.S. paragraph</strong> out loud or on paper before the test.</li>
            <li>🤔 <strong>Ask "how?" and "why?"</strong> for every event: why does it matter, and which skill does it connect to?</li>
            <li>🎮 Play the review games under <strong>Modules → "ELA Review Games"</strong>.</li>
            <li>📄 <strong>After Tuesday, complete the entire study guide</strong> and use it to study.</li>
          </ul>
          <p class="callout">You've got this, Leopards! 🐆</p>`,
      },
      {
        title: 'Questions & answers about the test',
        html: `
          <p class="muted">Tap a question to see the answer.</p>
          ${qa([
            ['Can I use my book during the test?', 'Yes! Use it to find evidence and check details. Tabbing important pages ahead of time will save you a lot of time.'],
            ['If I can use my book, do I still need to study?', 'Yes. The test asks you to <em>apply</em> skills, like explaining which Hero\'s Journey stage an event shows and why. The book won\'t do that thinking for you.'],
            ['What is the difference between a summary and a gist?', 'A summary retells the important events. A gist is shorter: one sentence with the main idea (who, what happens, and why it matters).'],
            ['How many Hero\'s Journey stages do I need to know?', 'All 10 stages, and which of the 5 plot diagram parts each one fits. Percy reaches stage 6 (Tests, Allies, and Enemies) by the end of Chapter 8.'],
            ['What does R.A.C.E.S. stand for?', '<strong>R</strong>estate the question, <strong>A</strong>nswer it, <strong>C</strong>ite evidence from the text, <strong>E</strong>xplain how the evidence supports your answer, <strong>S</strong>ummarize.'],
            ['What makes good evidence?', 'A detail or quote <em>from the book</em> that clearly proves your answer. Say where it comes from (chapter or page number).'],
          ])}
          <p class="muted">Ready? The 12-question practice test mixes every skill.</p>`,
      },
    ],
  };

  // ---------- Gist & sequence ----------
  const gistLesson = {
    id: 4,
    short: 'Gist & Sequence',
    title: 'Gist & Sequence: Chapters 1–8',
    blurb: 'Find the gist of each chapter, put key events in order, and keep the characters straight.',
    art: '<span class="lesson-emoji">📖</span>',
    sessionLength: 8,
    skills: ['gist', 'sequence', 'early', 'camp', 'characters'],
    steps: [
      {
        title: 'What is a gist?',
        html: `
          <p>The <strong>gist</strong> is the main idea of a chapter or section in your own words, usually <strong>one sentence</strong>.</p>
          <div class="callout"><strong>A strong gist answers:</strong> Who? What happens? Why does it matter?</div>
          <p>Which of these is the best gist of Chapter 1?</p>
          <div id="check"></div>
          <p class="muted small">Tip: if your gist could describe any chapter ("Percy has a weird day"), it's too general. If it's about one small moment, it's too detailed.</p>`,
        mount(el) {
          Lessons.miniCheck(el, '#check', [
            { label: 'Percy\'s class takes a bus to a museum.', correct: false, feedback: 'That\'s true, but it\'s a small detail. The gist covers the most important idea.' },
            { label: 'On a school trip, Percy\'s math teacher turns into a monster, and he destroys her.', correct: true, feedback: 'Yes! It says who, what happens, and why it matters, in one sentence.' },
            { label: 'Percy has a strange day.', correct: false, feedback: 'Too general. It doesn\'t say what actually happens.' },
          ]);
        },
      },
      {
        title: 'Chapters 1–4: The ordinary world breaks',
        html: `<p class="muted">Riordan's funny chapter titles hint at what happens. Read each summary, then its gist.</p>${chapterList(CHAPTERS.slice(0, 4))}`,
      },
      {
        title: 'Chapters 5–8: Camp Half-Blood',
        html: chapterList(CHAPTERS.slice(4)),
      },
      {
        title: 'Sequence the key events',
        html: `
          <p><strong>Chronological order</strong> means the order in which events happen. Tap the events from <strong>first to last</strong>.</p>
          <div id="seq"></div>
          <p class="muted small">Tip: think about <em>where</em> Percy is. Yancy Academy → home and Montauk → the road to camp → Camp Half-Blood.</p>`,
        mount(el) {
          const ch = [1, 2, 3, 4, 6, 8];
          sequencer(el, '#seq', ch.map((c) => EVENTS.filter((e) => e[0] === c).pop()).map(([c, text]) => ({ ch: c, text })));
        },
      },
      {
        title: 'Who\'s who',
        html: `
          <p>Many characters aren't what they first seem. Keep track of who they <em>really</em> are.</p>
          <dl class="glossary">
            <dt>Percy Jackson</dt><dd>The 12-year-old narrator. Has ADHD and dyslexia, gets in trouble at school, and turns out to be a demigod: the son of Poseidon.</dd>
            <dt>Grover Underwood</dt><dd>Percy's best friend from Yancy. Really a satyr (half goat) sent to protect him.</dd>
            <dt>Sally Jackson</dt><dd>Percy's loving mom. Vanishes during the Minotaur attack.</dd>
            <dt>Gabe Ugliano</dt><dd>"Smelly Gabe," Percy's lazy, selfish stepfather.</dd>
            <dt>Mr. Brunner / Chiron</dt><dd>Percy's Latin teacher, really Chiron, the centaur who trains heroes.</dd>
            <dt>Mrs. Dodds</dt><dd>Percy's pre-algebra teacher, really one of the Furies ("the Kindly Ones").</dd>
            <dt>Annabeth Chase</dt><dd>Smart, determined daughter of Athena who lives at Camp Half-Blood.</dd>
            <dt>Luke</dt><dd>Friendly counselor of the Hermes cabin, son of Hermes.</dd>
            <dt>Clarisse</dt><dd>Tough daughter of Ares who picks on Percy.</dd>
            <dt>Mr. D (Dionysus)</dt><dd>The grumpy camp director, god of wine, who keeps calling Percy "Peter Johnson."</dd>
          </dl>`,
      },
      {
        title: 'Practice Q&A',
        html: `
          <p>Try answering in your head (or on paper) first, then tap to check.</p>
          ${qa([
            ['Write a one-sentence gist of Chapter 4.', 'While racing to a safe place, Percy loses his mom to the Minotaur, then defeats the monster and reaches Camp Half-Blood.'],
            ['Write a one-sentence gist of Chapter 8.', 'During capture the flag, water heals Percy, a hellhound attacks him, and he is finally claimed as a son of Poseidon.'],
            ['Put these in order: Percy meets Chiron at camp · Grover shows up at Montauk · Mrs. Dodds attacks.', '1. Mrs. Dodds attacks (Ch. 1) → 2. Grover shows up at Montauk (Ch. 3) → 3. Percy meets Chiron at camp (Ch. 5).'],
            ['What happens right before Percy arrives at Camp Half-Blood?', 'The Minotaur attacks, Sally vanishes, and Percy defeats the Minotaur (Ch. 4).'],
            ['Why does the cut yarn in Chapter 2 matter?', 'The three women are the Fates. Cutting a thread means someone\'s life will end, which warns that Percy is in danger.'],
          ])}`,
      },
    ],
  };

  // ---------- Hero's Journey & plot diagram ----------
  const plotParts = Object.keys(PLOT);
  const journeyLesson = {
    id: 5,
    short: 'Hero\'s Journey',
    title: 'The Hero\'s Journey & the Plot Diagram',
    blurb: 'Learn the 10 stages, connect them to the 5 parts of a plot diagram, and map Percy\'s journey so far.',
    art: '<span class="lesson-emoji">⚡️🗺️</span>',
    sessionLength: 8,
    skills: ['stages', 'journey', 'plot', 'align'],
    steps: [
      {
        title: 'The 10 stages of the Hero\'s Journey',
        html: `
          <p>The <strong>Hero's Journey</strong> is a pattern found in hero stories all over the world. The hero leaves home, faces tests in a special world, and comes back changed.</p>
          <p>Tap a stage to learn what it means.</p>
          <div id="stages"></div>`,
        mount(el) {
          tabs(el, '#stages', STAGES.map((s, i) => ({ label: `${i + 1}. ${s.name}`, html: `<strong>${i + 1}. ${s.name}</strong>: ${s.what}` })));
        },
      },
      {
        title: 'The 5 parts of a plot diagram',
        html: `
          <p>Every story has a <strong>plot</strong>: the sequence of events. A plot diagram shows how tension rises and falls. Tap a part:</p>
          <div class="diagram-box" id="plotBox">${plotSvg()}</div>
          <div id="plotTabs"></div>`,
        mount(el) {
          const box = el.querySelector('#plotBox');
          tabs(el, '#plotTabs', plotParts.map((p) => ({ label: PLOT[p].name, html: `<strong>${PLOT[p].name}</strong>: ${PLOT[p].what}`, p })));
          el.querySelectorAll('#plotTabs [data-t]').forEach((btn) => btn.addEventListener('click', () => {
            box.innerHTML = plotSvg(plotParts[+btn.dataset.t]);
          }));
        },
      },
      {
        title: 'Connect the 10 stages to the plot diagram',
        html: `
          <p>Each Hero's Journey stage fits one part of the plot diagram. Tap a part to see its stages.</p>
          <div class="diagram-box" id="mapBox">${plotSvg()}</div>
          <div id="mapTabs"></div>
          <table class="map-table">
            <thead><tr><th>Plot diagram</th><th>Hero's Journey stages</th></tr></thead>
            <tbody>${plotParts.map((p) => `<tr><td><strong>${PLOT[p].name}</strong></td><td>${STAGES.map((s, i) => (s.plot === p ? `${i + 1}. ${s.name}` : null)).filter(Boolean).join('<br>')}</td></tr>`).join('')}</tbody>
          </table>
          <p class="muted small">The Call to Adventure is the <strong>inciting incident</strong>: the event that starts the rising action.</p>`,
        mount(el) {
          const box = el.querySelector('#mapBox');
          tabs(el, '#mapTabs', plotParts.map((p) => ({
            label: PLOT[p].name,
            html: `<strong>${PLOT[p].name}</strong> → ${STAGES.map((s, i) => (s.plot === p ? `${i + 1}. ${s.name}` : null)).filter(Boolean).join(', ')}`,
          })));
          el.querySelectorAll('#mapTabs [data-t]').forEach((btn) => btn.addEventListener('click', () => {
            box.innerHTML = plotSvg(plotParts[+btn.dataset.t]);
          }));
        },
      },
      {
        title: 'Worksheet: Align the 10 stages with the plot diagram',
        html: `
          <div class="callout"><strong>Heads up:</strong> books name the 10 stages a little differently. Your class worksheet uses the list below (for example, <em>Entering the Unknown</em> instead of <em>Crossing the Threshold</em>, and <em>The Supreme Ordeal</em> instead of <em>The Ordeal</em>). The big idea is the same.</div>
          <p>Place each stage on the plot diagram. Tap the part of the mountain where it belongs, or pick from the list. Stage numbers go on the diagram just like on the worksheet.</p>
          <div id="align"></div>
          <div class="actions">
            <button type="button" class="btn btn-primary" id="alignCheck">Check my diagram</button>
            <button type="button" class="btn btn-ghost" id="alignKey">Show the answer key</button>
          </div>
          <div id="alignFb" class="feedback" role="status"></div>`,
        mount(el) {
          let placer = PlotAlign.mount(el.querySelector('#align'));
          const all = PlotAlign.STAGES.map((_, i) => i);
          const fb = el.querySelector('#alignFb');
          el.querySelector('#alignCheck').addEventListener('click', () => {
            const res = PlotAlign.check(all, placer.value());
            if (res.marks) placer.mark(res.marks);
            fb.className = `feedback ${res.status === 'correct' ? 'good' : res.status === 'invalid' ? 'info' : 'hint'}`;
            fb.innerHTML = res.status === 'correct'
              ? `<p class="fb-title">✅ All 10 are right!</p>${res.message ? `<p>${res.message}</p>` : ''}`
              : `<p>${res.message}</p>`;
          });
          el.querySelector('#alignKey').addEventListener('click', () => {
            placer.reveal();
            fb.className = 'feedback info';
            fb.innerHTML = `
              <p class="fb-title">Answer key</p>
              <table class="map-table">
                <thead><tr><th>Plot diagram</th><th>Hero's Journey stages</th></tr></thead>
                <tbody>${PlotAlign.PART_KEYS.map((k) => `<tr><td><strong>${PlotAlign.PARTS[k].name}</strong></td><td>${PlotAlign.STAGES.map((st, i) => (st.parts[0] === k ? `${i + 1}. ${st.name}` : null)).filter(Boolean).join('<br>')}</td></tr>`).join('')}</tbody>
              </table>
              <p class="muted small">The Call to Adventure is the inciting incident, the event that starts the rising action, so some teachers also accept it in the rising action. <button type="button" class="btn btn-ghost small" id="alignAgain">Try again</button></p>`;
            el.querySelector('#alignAgain').addEventListener('click', () => {
              placer = PlotAlign.mount(el.querySelector('#align'));
              fb.className = 'feedback';
              fb.innerHTML = '';
            });
          });
        },
      },
      {
        title: 'What each worksheet stage means',
        html: `
          <p>Tap a stage to see what it means and where it shows up for Percy.</p>
          <div id="wsStages"></div>`,
        mount(el) {
          tabs(el, '#wsStages', PlotAlign.STAGES.map((st, i) => ({
            label: `${i + 1}. ${st.name}`,
            html: `<strong>${i + 1}. ${st.name}</strong> → <em>${PlotAlign.PARTS[st.parts[0]].name}</em><br>${st.what}<br><span class="muted">Percy: ${st.percy}</span>`,
          })));
        },
      },
      {
        title: 'Percy\'s journey so far (Chapters 1–8)',
        html: `
          <p>Tap a stage to see where it happens in the book. By the end of Chapter 8, Percy is in <strong>stage 6</strong>, which is still in the <strong>rising action</strong>.</p>
          <div id="percy"></div>
          <p class="muted small">Percy gets his official quest in Chapter 9, but his call to adventure starts in Chapter 1.</p>`,
        mount(el) {
          tabs(el, '#percy', STAGES.slice(0, 6).map((s, i) => ({ label: `${i + 1}. ${s.name}`, html: `<strong>${s.name}</strong>: ${s.percy}` })));
        },
      },
      {
        title: 'Quick check',
        html: `
          <p>Percy crosses the property line into Camp Half-Blood after the Minotaur attack. Which Hero's Journey stage is this?</p>
          <div id="check"></div>`,
        mount(el) {
          Lessons.miniCheck(el, '#check', [
            { label: 'Call to Adventure', correct: false, feedback: 'The call came earlier, with Mrs. Dodds and the Fates. Here Percy actually <em>enters</em> the special world.' },
            { label: 'Crossing the Threshold', correct: true, feedback: 'Correct! Percy leaves the ordinary world and enters the special world of Camp Half-Blood. On the plot diagram, that\'s rising action.' },
            { label: 'Meeting the Mentor', correct: false, feedback: 'He meets Chiron (his mentor) at camp in Chapter 5. Entering camp itself is a different stage.' },
          ]);
        },
      },
      {
        title: 'Practice Q&A',
        html: `
          <p>Try answering first, then tap to check.</p>
          ${qa([
            ['Which stage is Percy in at the end of Chapter 8? How do you know?', '<strong>Tests, Allies, and Enemies.</strong> He is in the special world (camp), making allies (Annabeth, Luke, Grover), facing enemies (Clarisse, the Ares cabin), and being tested (capture the flag, the hellhound).'],
            ['Why does the Ordinary World fit the exposition?', 'Both come at the start of the story and introduce the main character, the setting, and normal life before the conflict begins.'],
            ['Which stage matches the climax, and why?', '<strong>The Ordeal</strong>. It is the hero\'s biggest, most dangerous challenge, the moment of highest tension, just like the climax.'],
            ['Where on the plot diagram are Chapters 1–8?', 'In the <strong>exposition</strong> (Percy\'s ordinary life at Yancy and home) and the <strong>rising action</strong> (the call, the mentor, crossing into camp, and the tests there).'],
            ['Who is Percy\'s mentor, and what does he give Percy?', '<strong>Chiron</strong> (Mr. Brunner). He gives Percy the pen that turns into a sword (Ch. 1) and teaches him about the gods at camp (Ch. 5).'],
          ])}`,
      },
    ],
  };

  // ---------- Character & R.A.C.E.S. ----------
  const racesLesson = {
    id: 6,
    short: 'Character & R.A.C.E.S.',
    title: 'Percy\'s Character & R.A.C.E.S.',
    blurb: 'Analyze Percy using text evidence, and write strong R.A.C.E.S. answers about the Hero\'s Journey.',
    art: '<span class="lesson-emoji">✍️</span>',
    sessionLength: 8,
    skills: ['traits', 'races'],
    steps: [
      {
        title: 'Analyzing a character',
        html: `
          <p>To <strong>analyze a character</strong>, you name a <strong>trait</strong> (what the character is like) and prove it with <strong>evidence</strong> from the text.</p>
          <div class="callout"><strong>Trait</strong> + <strong>Evidence</strong> (what they say, do, think, or how others react) + <strong>Explanation</strong> (why it shows the trait)</div>
          <p>Tap a trait to see evidence for Percy:</p>
          <div id="traits"></div>
          <p class="muted small">These are paraphrased. Since the test is open book, find the exact words on the page and quote them with the page number.</p>`,
        mount(el) {
          tabs(el, '#traits', TRAITS.map((t) => ({
            label: t.trait,
            html: `<p><strong>Trait:</strong> ${t.trait}</p><p><strong>Evidence:</strong> ${t.evidence}</p><p class="mb0"><strong>Explanation:</strong> ${t.explain}</p>`,
          })));
        },
      },
      {
        title: 'What is R.A.C.E.S.?',
        html: `
          <p>R.A.C.E.S. is a way to write a complete, well-supported answer.</p>
          <dl class="glossary races-list">
            <dt>R: Restate</dt><dd>Turn the question into a statement.</dd>
            <dt>A: Answer</dt><dd>Answer every part of the question.</dd>
            <dt>C: Cite</dt><dd>Give evidence from the text. Say where it comes from: "In Chapter 4…" or "On page __, it says…"</dd>
            <dt>E: Explain</dt><dd>Explain <em>how</em> or <em>why</em> your evidence proves your answer. Try using "This shows… because…"</dd>
            <dt>S: Summarize</dt><dd>Sum up your answer in a closing sentence.</dd>
          </dl>`,
      },
      {
        title: 'A model R.A.C.E.S. answer',
        html: `
          <div class="callout"><strong>Question:</strong> ${RACES.question}</div>
          <p>Tap <strong>Show the parts</strong> to see how this answer is built.</p>
          <div class="races-model" id="model">
            ${RACES.parts.map(([letter, , sentence]) => `<p class="races-sentence"><span class="races-tag" hidden>${letter}</span> ${sentence}</p>`).join('')}
          </div>
          <button type="button" class="btn btn-secondary" id="showParts">Show the parts</button>`,
        mount(el) {
          el.querySelector('#showParts').addEventListener('click', (e) => {
            el.querySelectorAll('.races-tag').forEach((t) => { t.hidden = false; });
            el.querySelector('#model').classList.add('labeled');
            e.target.hidden = true;
          });
        },
      },
      {
        title: 'Quick check',
        html: `
          <p>"${RACES.parts[3][2]}"</p>
          <p>Which part of R.A.C.E.S. is this sentence?</p>
          <div id="check"></div>`,
        mount(el) {
          Lessons.miniCheck(el, '#check', [
            { label: 'Cite', correct: false, feedback: 'Cite <em>gives</em> the evidence. This sentence tells <em>why</em> the evidence matters.' },
            { label: 'Explain', correct: true, feedback: 'Yes! "This shows… because…" explains how the evidence supports the answer.' },
            { label: 'Summarize', correct: false, feedback: 'A summary wraps up the whole answer at the end, often with "In conclusion."' },
          ]);
        },
      },
      {
        title: 'Practice Q&A',
        html: `
          <p>Write your own answer first, then tap to compare with a model answer.</p>
          ${qa([
            ['Using R.A.C.E.S.: How does Percy\'s experience in Chapter 4 align with the Hero\'s Journey?',
              '<strong>R/A:</strong> Percy\'s experience in Chapter 4 shows the Crossing the Threshold stage, when the hero leaves the ordinary world for a special world. <strong>C:</strong> In Chapter 4, after the Minotaur takes his mom, Percy defeats the monster and carries Grover over the hill into Camp Half-Blood. <strong>E:</strong> This shows Crossing the Threshold because Percy can never go back to his normal life: his mom is gone, monsters are real, and he has entered a world of gods and heroes. <strong>S:</strong> In conclusion, Chapter 4 is when Percy crosses into his adventure.'],
            ['Using R.A.C.E.S.: How does Chiron fit the Meeting the Mentor stage?',
              '<strong>R/A:</strong> Chiron fits the Meeting the Mentor stage because he guides Percy and gives him a gift. <strong>C:</strong> In Chapter 1, Mr. Brunner throws Percy a pen that turns into a sword, and in Chapter 5 he reveals he is Chiron and explains that the gods are real. <strong>E:</strong> This shows he is a mentor because he gives Percy a weapon and the knowledge he needs to survive in the special world. <strong>S:</strong> In conclusion, Chiron is Percy\'s mentor on his Hero\'s Journey.'],
            ['Using R.A.C.E.S.: Which stage is Percy in at camp (Chapters 6–8)?',
              '<strong>R/A:</strong> At camp, Percy is in the Tests, Allies, and Enemies stage. <strong>C:</strong> In Chapter 6, Clarisse bullies him in the bathroom, and in Chapter 8, Annabeth and Luke are on his team during capture the flag. <strong>E:</strong> This shows the stage because Percy is being tested and learning who his friends and enemies are in the special world. <strong>S:</strong> Overall, Percy\'s time at camp is full of tests, allies, and enemies.'],
            ['What is one of Percy\'s character traits? Give evidence.',
              'Percy is <strong>loyal</strong>. In Chapter 4, he carries Grover up the hill to the farmhouse even though he is exhausted and has just lost his mom. This shows loyalty because he refuses to leave his friend behind, even when he is suffering.'],
            ['How does Percy change from Chapter 1 to Chapter 8?',
              'In Chapter 1, Percy feels like a troubled kid who doesn\'t fit in anywhere. By Chapter 8, he knows he is a demigod, has proven he is brave, and is claimed as the son of Poseidon, so he finally learns where he comes from.'],
          ])}`,
      },
    ],
  };

  // ---------- Chapter-by-chapter review ----------
  const reviewLesson = {
    id: 7,
    short: 'Chapter review',
    title: 'Chapter-by-Chapter Questions & Answers',
    blurb: 'Short-answer questions for every chapter, Hero\'s Journey questions, model written responses, and a Chapter 8 answer key.',
    art: '<span class="lesson-emoji">❓💬</span>',
    sessionLength: 10,
    skills: ['early', 'camp', 'meaning', 'journey', 'traits'],
    steps: [
      {
        title: 'What this review covers',
        html: `
          <p>Answer each question in your head or on paper <strong>before</strong> you tap to see the answer. Use your book to find the evidence, just like on the test.</p>
          <table class="map-table">
            <thead><tr><th>Ch.</th><th>Main focus</th></tr></thead>
            <tbody>${SCOPE.map(([n, focus]) => `<tr><td><strong>${n}</strong></td><td>${focus}</td></tr>`).join('')}</tbody>
          </table>
          <p class="muted small">Grade 6 materials often use Percy's Chapter 8 experiences to test the Hero's Journey, so give Chapter 8 extra attention.</p>`,
      },
      ...CHAPTERS.map(([n, title]) => ({
        title: `Chapter ${n}: “${title}”`,
        html: `<p class="muted">Tap a question to check your answer.</p>${qa(CHAPTER_QA[n])}`,
      })),
      {
        title: 'Hero\'s Journey questions',
        html: `<p class="muted">Tap a question to check your answer.</p>${qa(JOURNEY_QA)}`,
      },
      {
        title: 'Model written responses',
        html: `
          <p>Write your own answer first, then compare. Notice how each model makes a claim, gives evidence from several chapters, and explains it.</p>
          ${qa(MODEL_RESPONSES.map(([kind, q, a]) => [`<span class="skill-tag">${kind}</span><br>${q}`, a]))}`,
      },
      {
        title: 'Chapter 8 quick answer key',
        html: `
          <table class="map-table">
            <thead><tr><th>Question focus</th><th>Best answer</th></tr></thead>
            <tbody>${CH8_KEY.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`).join('')}</tbody>
          </table>
          <p class="muted small">Common test asks: find evidence from Chapters 1–8, explain how Percy responds to challenges, infer his strengths and weaknesses, and analyze how Chapter 8 fits the Hero's Journey.</p>`,
      },
    ],
  };

  const lessons = [startHere, gistLesson, journeyLesson, racesLesson, reviewLesson];
  lessons.forEach((l) => { l.buildSession = (count) => ElaQuestions.buildSession(l.skills, count); });

  return { lessons };
})();
