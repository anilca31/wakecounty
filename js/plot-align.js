// "Align the 10 stages of the Hero's Journey with the plot diagram" — the class worksheet's version of the stages.
// Students place each stage number on the plot "mountain" by tapping the diagram or choosing from a list.
const PlotAlign = (() => {
  const { shuffle } = Util;

  // The worksheet's 10 stages, with the plot part(s) each one belongs to (first = best answer).
  const STAGES = [
    { name: 'The Ordinary World', parts: ['exposition'],
      what: 'The hero\'s normal, everyday life before the adventure.',
      percy: 'Percy\'s life at Yancy Academy and at home with his mom and Gabe (Ch. 1–3).' },
    { name: 'The Call to Adventure', parts: ['inciting', 'rising'],
      what: 'Something happens that pulls the hero out of normal life and starts the adventure.',
      percy: 'Mrs. Dodds attacks Percy (Ch. 1), and strange events keep happening until Grover warns him monsters are coming (Ch. 3).' },
    { name: 'Entering the Unknown', parts: ['rising'],
      what: 'The hero leaves the familiar world and steps into a new, unfamiliar one.',
      percy: 'Percy crosses into Camp Half-Blood after the Minotaur attack (Ch. 4–5).' },
    { name: 'Supernatural Aid/Meeting with the Mentor', parts: ['rising'],
      what: 'A wise guide gives the hero advice, training, or a magical gift.',
      percy: 'Mr. Brunner (Chiron) gives Percy the pen that becomes a sword, and teaches him at camp (Ch. 1, 5).' },
    { name: 'Allies/Helpers', parts: ['rising'],
      what: 'The hero gains friends who help along the way.',
      percy: 'Grover, Annabeth, and Luke help Percy at camp (Ch. 5–8).' },
    { name: 'The Road of Trials', parts: ['rising'],
      what: 'A series of tests and challenges that make the hero stronger.',
      percy: 'The fight with Clarisse, sword practice, capture the flag, and the hellhound (Ch. 6–8).' },
    { name: 'The Supreme Ordeal', parts: ['climax'],
      what: 'The hero\'s greatest, most dangerous challenge: the moment of highest tension.',
      percy: 'This happens later in the book, after Chapter 8.' },
    { name: 'The Magic Flight', parts: ['falling'],
      what: 'After the ordeal, the hero escapes or heads home with the prize, often while being chased.',
      percy: 'This happens later in the book.' },
    { name: 'Confronting the Father', parts: ['falling'],
      what: 'The hero faces a powerful father figure or authority, settling the conflict.',
      percy: 'This happens near the end of the book.' },
    { name: 'Master of Two Worlds/Restoring the World', parts: ['resolution'],
      what: 'The hero returns, changed, able to live in both worlds and make things right.',
      percy: 'This happens at the end of the book.' },
  ];

  const PARTS = {
    exposition: { name: 'Exposition', why: 'The exposition introduces the hero\'s normal life, before the conflict starts.' },
    inciting:   { name: 'Inciting incident', why: 'The inciting incident is the event that starts the conflict and kicks off the rising action.' },
    rising:     { name: 'Rising action', why: 'In the rising action, the hero enters the adventure and faces helpers and tests as tension builds.' },
    climax:     { name: 'Climax', why: 'The climax is the turning point, the hero\'s biggest challenge.' },
    falling:    { name: 'Falling action', why: 'In the falling action, events after the climax wind the conflict down.' },
    resolution: { name: 'Resolution', why: 'In the resolution, the conflict is solved and the hero\'s world is set right.' },
  };
  const PART_KEYS = Object.keys(PARTS);
  const isRight = (i, part) => STAGES[i].parts.includes(part);

  // ---------- Diagram ----------
  // Each part is a segment of the mountain; placed stage numbers line up along it.
  const SEG = {
    exposition: { a: [24, 236], b: [150, 236], off: [0, -22], label: [70, 262] },
    inciting:   { a: [150, 236], b: [150, 236], off: [0, 26], label: [150, 292], star: true },
    rising:     { a: [175, 205], b: [292, 62], off: [-22, -12], label: [112, 140] },
    climax:     { a: [305, 34], b: [305, 34], off: [0, -24], label: [370, 30] },
    falling:    { a: [340, 92], b: [430, 196], off: [22, -10], label: [492, 118] },
    resolution: { a: [460, 214], b: [580, 214], off: [0, -22], label: [520, 248] },
  };
  const CHIP = 24;

  function chipSpots(part, n) {
    const { a, b, off } = SEG[part];
    if (!n) return [];
    if (a[0] === b[0] && a[1] === b[1]) {
      // A single point: spread the chips sideways.
      return Array.from({ length: n }, (_, i) => [a[0] + off[0] + (i - (n - 1) / 2) * (CHIP + 2), a[1] + off[1]]);
    }
    return Array.from({ length: n }, (_, i) => {
      const t = n === 1 ? 0.5 : i / (n - 1);
      return [a[0] + (b[0] - a[0]) * t + off[0], a[1] + (b[1] - a[1]) * t + off[1]];
    });
  }

  function svg(placed, marks = {}, picking = null) {
    let body = `
      <path d="M24 236 H150 L305 34 L445 214 H580" class="pa-line"/>
      <polygon points="150,224 153.5,232 162,232 155,237 158,245 150,240 142,245 145,237 138,232 146.5,232" class="pa-star"/>`;
    PART_KEYS.forEach((k) => {
      const s = SEG[k];
      body += `<text x="${s.label[0]}" y="${s.label[1]}" text-anchor="middle" class="pa-label" data-label="${k}">${PARTS[k].name}</text>`;
    });
    // One tap area; a tap snaps to the nearest part of the mountain.
    body += `<rect width="600" height="300" class="pa-zone ${picking != null ? 'is-armed' : ''}"/>`;
    PART_KEYS.forEach((k) => {
      const nums = Object.keys(placed).filter((i) => placed[i] === k).map(Number).sort((x, y) => x - y);
      chipSpots(k, nums.length).forEach(([cx, cy], j) => {
        const i = nums[j];
        const cls = marks[i] === true ? 'is-right' : marks[i] === false ? 'is-wrong' : '';
        body += `<g class="pa-chip ${cls}" data-chip="${i}"><circle cx="${cx}" cy="${cy}" r="${CHIP / 2}"/><text x="${cx}" y="${cy + 5}" text-anchor="middle">${i + 1}</text></g>`;
      });
    });
    return `<svg class="pa-svg" viewBox="0 0 600 300" role="img" aria-label="Plot diagram with stage numbers placed on it">${body}</svg>`;
  }

  // Nearest plot part to an SVG point. The two single-point parts (inciting incident, climax) get a little extra pull.
  function nearestPart(x, y) {
    const dist = ({ a, b }) => {
      const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
      const len = dx * dx + dy * dy;
      const t = len ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / len)) : 0;
      return Math.hypot(x - (a[0] + t * dx), y - (a[1] + t * dy));
    };
    let best = null;
    PART_KEYS.forEach((k) => {
      const d = dist(SEG[k]) * (SEG[k].a === SEG[k].b || (SEG[k].a[0] === SEG[k].b[0] && SEG[k].a[1] === SEG[k].b[1]) ? 0.55 : 1);
      if (!best || d < best.d) best = { k, d };
    });
    return best.k;
  }

  // ---------- Interactive placer ----------
  // stageIdxs: which stages to place. Returns { value(), mark(marks), reveal(), disable() }.
  function mount(host, stageIdxs = STAGES.map((_, i) => i)) {
    const placed = {};
    let marks = {};
    let picking = stageIdxs[0];
    let locked = false;

    function draw() {
      const next = stageIdxs.find((i) => !placed[i]);
      host.innerHTML = `
        <p class="pa-prompt" role="status">${locked ? '' : picking != null
          ? `Where does <strong>${picking + 1}. ${STAGES[picking].name}</strong> go? Tap that part of the diagram.`
          : 'All placed! Tap a stage below to move it, then press <strong>Check</strong>.'}</p>
        <div class="pa-diagram">${svg(placed, marks, locked ? null : picking)}</div>
        <ol class="pa-list">
          ${stageIdxs.map((i) => `
            <li class="pa-row ${i === picking && !locked ? 'is-picking' : ''} ${marks[i] === true ? 'is-right' : marks[i] === false ? 'is-wrong' : ''}">
              <button type="button" class="pa-pick" data-pick="${i}" ${locked ? 'disabled' : ''}><span class="pa-num">${i + 1}</span>${STAGES[i].name}</button>
              <label class="sr-only" for="pa-sel-${i}">Plot part for ${STAGES[i].name}</label>
              <select id="pa-sel-${i}" data-sel="${i}" ${locked ? 'disabled' : ''}>
                <option value="">Choose…</option>
                ${PART_KEYS.map((k) => `<option value="${k}" ${placed[i] === k ? 'selected' : ''}>${PARTS[k].name}</option>`).join('')}
              </select>
            </li>`).join('')}
        </ol>`;
      if (locked) return;
      const svgEl = host.querySelector('.pa-svg');
      const toSvg = (e) => {
        const p = svgEl.createSVGPoint();
        p.x = e.clientX;
        p.y = e.clientY;
        return p.matrixTransform(svgEl.getScreenCTM().inverse());
      };
      host.querySelector('.pa-zone').addEventListener('click', (e) => {
        const target = picking ?? next;
        if (target == null) return;
        const { x, y } = toSvg(e);
        place(target, nearestPart(x, y));
      });
      svgEl.addEventListener('pointermove', (e) => {
        const { x, y } = toSvg(e);
        const k = nearestPart(x, y);
        svgEl.querySelectorAll('[data-label]').forEach((t) => t.classList.toggle('is-hot', t.dataset.label === k));
      });
      svgEl.addEventListener('pointerleave', () => svgEl.querySelectorAll('.is-hot').forEach((t) => t.classList.remove('is-hot')));
      host.querySelectorAll('[data-chip]').forEach((c) => c.addEventListener('click', (e) => {
        e.stopPropagation();
        picking = +c.dataset.chip;
        draw();
      }));
      host.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => { picking = +b.dataset.pick; draw(); }));
      host.querySelectorAll('[data-sel]').forEach((sel) => sel.addEventListener('change', () => {
        const i = +sel.dataset.sel;
        if (sel.value) place(i, sel.value, false);
        else { delete placed[i]; delete marks[i]; draw(); }
      }));
    }

    function place(i, part, advance = true) {
      placed[i] = part;
      delete marks[i];
      picking = advance ? stageIdxs.find((j) => !placed[j]) ?? null : picking;
      if (!advance && picking === i) picking = stageIdxs.find((j) => !placed[j]) ?? null;
      draw();
    }

    draw();
    return {
      value: () => ({ ...placed }),
      mark: (m) => { marks = { ...m }; draw(); },
      reveal: () => {
        stageIdxs.forEach((i) => { placed[i] = STAGES[i].parts[0]; marks[i] = true; });
        locked = true;
        draw();
      },
      disable: () => { locked = true; draw(); },
    };
  }

  // Checks a placement map { stageIndex: partKey } for the given stages.
  function check(stageIdxs, placed) {
    if (!placed || stageIdxs.some((i) => !placed[i])) {
      return { status: 'invalid', message: 'Place every stage on the diagram first.' };
    }
    const marks = {};
    stageIdxs.forEach((i) => { marks[i] = isRight(i, placed[i]); });
    const wrong = stageIdxs.filter((i) => !marks[i]);
    if (!wrong.length) {
      const callNote = placed[1] === 'rising' ? ' (The Call to Adventure is also the <strong>inciting incident</strong>: the event that starts the rising action.)' : '';
      return { status: 'correct', marks, message: callNote || undefined };
    }
    const first = wrong[0];
    const right = STAGES[first].parts[0];
    return {
      status: 'incorrect',
      marks,
      message: `${stageIdxs.length - wrong.length} of ${stageIdxs.length} are right. The ones in red need to move. For example, <strong>${first + 1}. ${STAGES[first].name}</strong>: ${STAGES[first].what.charAt(0).toLowerCase()}${STAGES[first].what.slice(1)} ${PARTS[right].why}`,
    };
  }

  const answerKey = (idxs) => PART_KEYS
    .map((k) => [k, idxs.filter((i) => STAGES[i].parts[0] === k)])
    .filter(([, list]) => list.length)
    .map(([k, list]) => `${PARTS[k].name}: ${list.map((i) => i + 1).join(', ')}`)
    .join(' · ');

  // ---------- Practice questions ----------
  // Place a set of stages on the diagram (the whole worksheet, or a quick subset).
  function placeQuestion(skill, skillLabel, idxs = STAGES.map((_, i) => i)) {
    const all = idxs.length === STAGES.length;
    return {
      type: skill, skill: skillLabel,
      prompt: all
        ? 'Align the 10 stages of the Hero\'s Journey with the plot diagram. Place every stage number on the diagram.'
        : `Place these Hero's Journey stages on the plot diagram: ${idxs.map((i) => `<strong>${i + 1}. ${STAGES[i].name}</strong>`).join(', ')}.`,
      summary: all ? 'Align all 10 Hero\'s Journey stages with the plot diagram' : `Place stages ${idxs.map((i) => i + 1).join(', ')} on the plot diagram`,
      format: 'custom',
      mount: (el) => mount(el, idxs),
      check: (placed) => check(idxs, placed),
      hint: 'Stage 1 sets up normal life (exposition), stage 2 starts the conflict (inciting incident), the hardest challenge is the climax, and the hero coming home is the resolution.',
      explanation: `Answer key: ${answerKey(idxs)}.`,
      solution: answerKey(idxs),
    };
  }

  // Multiple choice: which plot part does one stage belong to?
  function partQuestion(skill, skillLabel, i) {
    const right = STAGES[i].parts[0];
    const wrong = shuffle(PART_KEYS.filter((k) => !STAGES[i].parts.includes(k))).slice(0, 3);
    const opts = shuffle([right, ...wrong]).map((k, j) => ({
      id: 'ABCD'[j], html: PARTS[k].name, correct: k === right,
      hint: k === right ? undefined : `Not quite. ${STAGES[i].name}: ${STAGES[i].what}`,
    }));
    return {
      type: skill, skill: skillLabel,
      prompt: `On the plot diagram, where does stage <strong>${i + 1}. ${STAGES[i].name}</strong> belong?`,
      summary: `Plot part for stage ${i + 1} (${STAGES[i].name})`,
      format: 'mc', options: opts, textOptions: true,
      check: (id) => {
        const o = opts.find((x) => x.id === id);
        if (!o) return { status: 'invalid', message: 'Choose one of the answers.' };
        return o.correct ? { status: 'correct' } : { status: 'incorrect', message: o.hint };
      },
      hint: 'Think about when this stage happens: before the conflict, as it builds, at the peak, as it winds down, or at the very end.',
      explanation: `${STAGES[i].name}: ${STAGES[i].what} ${PARTS[right].why}`,
      solution: PARTS[right].name,
    };
  }

  // Factories for a practice skill: the full worksheet, quick 4-stage rounds, and one-stage MC questions.
  function factories(skill, skillLabel) {
    const quick = () => {
      const idxs = shuffle(STAGES.map((_, i) => i)).slice(0, 4).sort((a, b) => a - b);
      return placeQuestion(skill, skillLabel, idxs);
    };
    return [
      () => placeQuestion(skill, skillLabel),
      quick, quick,
      ...STAGES.map((_, i) => () => partQuestion(skill, skillLabel, i)),
    ];
  }

  return { STAGES, PARTS, PART_KEYS, svg, mount, check, answerKey, factories, nearestPart };
})();
