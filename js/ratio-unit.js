// Maths Unit 2: Introducing Ratios — lesson sections, their teaching steps, and practice generators.
// Practice questions use the same shape as js/questions.js. New format: 'number' (a typed number, checked by `check`).
const RatioUnit = (() => {
  const D = Diagrams;
  const { randInt, pick, shuffle, pickTwo } = Util;
  const { miniCheck, stepper } = Lessons;
  const r = (x, y) => `${x} : ${y}`;
  const strong = (s) => `<strong>${s}</strong>`;
  const money = (n) => `$${n.toFixed(2)}`;
  const BATCH = { 1: 'single batch', 2: 'double batch', 3: 'triple batch', 4: 'quadruple batch' };

  const SKILLS = {
    batchScale:   'Double or triple a recipe',
    batchDiagram: 'Show batches with a diagram',
    colorMix:     'Equivalent color mixtures',
    makeEquiv:    'Create an equivalent ratio',
    isEquiv:      'Decide if ratios are equivalent',
    dnlMissing:   'Complete a double number line',
    dnlExtend:    'Extend a double number line',
    unitPrice:    'Find the price for one',
    costOfN:      'Use the price for one',
    betterDeal:   'Compare prices',
    speed:        'Find a constant speed',
    distance:     'Use a constant speed',
    sameRate:     'Compare situations with ratios',
    tableMissing: 'Complete a table of equivalent ratios',
    tableUnit:    'Find how much for one in a table',
    wordEquiv:    'Solve an equivalent ratio problem',
    pppWhole:     'Find a part from the total',
    pppTotal:     'Find the total from a part',
    tapeRead:     'Read a tape diagram',
  };

  // [first quantity, second quantity, what it makes]
  const RECIPES = [
    ['cups of flour', 'eggs', 'pancakes'],
    ['cups of rice', 'cups of water', 'rice'],
    ['scoops of lemonade mix', 'cups of water', 'lemonade'],
    ['cups of oats', 'cups of milk', 'oatmeal'],
    ['cups of peanuts', 'cups of raisins', 'trail mix'],
    ['bananas', 'cups of yogurt', 'smoothies'],
  ];
  const PAINTS = [
    ['cups of blue paint', 'cups of yellow paint', 'green paint'],
    ['cups of red paint', 'cups of white paint', 'pink paint'],
    ['cups of red paint', 'cups of yellow paint', 'orange paint'],
    ['drops of blue dye', 'cups of water', 'light blue water'],
  ];
  // [plural item, possible prices for one]
  const SHOP = [
    ['pens', [0.5, 0.75, 1.25, 1.5]],
    ['notebooks', [1.5, 2, 2.5, 3]],
    ['tacos', [1.25, 1.5, 2, 2.5]],
    ['bottles of water', [0.75, 1, 1.25]],
    ['bags of popcorn', [2, 2.5, 3, 3.5]],
    ['granola bars', [0.5, 0.75, 1]],
  ];
  const MOVERS = [
    ['A runner', 'meters', 'seconds'],
    ['A bike', 'miles', 'hours'],
    ['A snail', 'centimeters', 'minutes'],
    ['A train', 'miles', 'hours'],
    ['A swimmer', 'meters', 'minutes'],
  ];
  // [first group, second group, whole, short tape labels]
  const GROUPS = [
    ['boys', 'girls', 'students in the club', 'boys', 'girls'],
    ['cats', 'dogs', 'pets at the shelter', 'cats', 'dogs'],
    ['red marbles', 'blue marbles', 'marbles in the bag', 'red', 'blue'],
    ['fiction books', 'nonfiction books', 'books on the shelf', 'fiction', 'nonfiction'],
    ['cups of juice', 'cups of sparkling water', 'cups of punch', 'juice', 'sparkling'],
  ];

  // ---------- Answer checking ----------
  // Accepts 12, 1.5, .5, $1.50, 3/2, and a trailing unit word ("15 cups").
  function parseNumber(str) {
    if (typeof str !== 'string') return null;
    const m = str.trim().toLowerCase().replace(/[$,]/g, '').match(/^(\d+(?:\.\d+)?|\.\d+|\d+\s*\/\s*\d+)\s*[a-z ]*$/);
    if (!m) return null;
    if (m[1].includes('/')) {
      const [p, q] = m[1].split('/').map((x) => parseInt(x, 10));
      return q ? p / q : null;
    }
    return parseFloat(m[1]);
  }

  const near = (a, b) => Math.abs(a - b) < 1e-6;

  // wrong: [[value, targeted hint]] for common mistakes.
  function numberChecker(answer, wrong = []) {
    return (input) => {
      const n = parseNumber(input);
      if (n == null) return { status: 'invalid', message: 'Type just a number, like <strong>12</strong> or <strong>1.5</strong>.' };
      if (near(n, answer)) return { status: 'correct' };
      const w = wrong.find(([v]) => near(v, n) && !near(v, answer));
      return { status: 'incorrect', message: w ? w[1] : undefined };
    };
  }

  // opts: [{ html, correct?, hint }]; duplicates are dropped, then shuffled and lettered.
  function mc(opts) {
    const seen = new Set();
    const unique = opts.filter((o) => !seen.has(o.html) && seen.add(o.html));
    const options = shuffle(unique).map((o, i) => ({ ...o, id: 'ABCD'[i] }));
    return {
      format: 'mc',
      options,
      check: (id) => {
        const opt = options.find((o) => o.id === id);
        if (!opt) return { status: 'invalid', message: 'Choose one of the answers.' };
        return opt.correct ? { status: 'correct' } : { status: 'incorrect', message: opt.hint };
      },
    };
  }

  const number = (answer, wrong) => ({ format: 'number', check: numberChecker(answer, wrong) });

  // Two different whole numbers in [min, max] with no common factor, so the ratio is in simplest form.
  function coprime(min, max) {
    for (;;) {
      const a = randInt(min, max);
      const b = randInt(min, max);
      if (a !== b && Util.gcd(a, b) === 1) return [a, b];
    }
  }

  // ---------- Practice generators ----------
  function batchScale() {
    const [A, B, thing] = pick(RECIPES);
    const [a, b] = coprime(1, 5);
    const n = randInt(2, 4);
    const askB = Math.random() < 0.5;
    const [have, want, hv, wv] = askB ? [A, B, a, b] : [B, A, b, a];
    return {
      type: 'batchScale', skill: SKILLS.batchScale,
      prompt: `A recipe for ${thing} uses ${strong(`${a} ${A}`)} for every ${strong(`${b} ${B}`)}. How many ${strong(want)} do you need for a ${strong(BATCH[n])}?`,
      summary: `${BATCH[n]} of ${thing}: ${r(a, b)}, find ${want}`,
      ...number(wv * n, [
        [wv + n, `It looks like you added ${n}. A ${BATCH[n]} means <em>${n} times</em> as much of everything.`],
        [hv * n, `That is the ${have}. The question asks for the ${want}.`],
        [wv, 'That is a single batch. Multiply to make the bigger batch.'],
      ]),
      hint: `A ${BATCH[n]} uses ${n} times as much of each ingredient. Multiply ${wv} by ${n}.`,
      explanation: `${wv} × ${n} = ${wv * n}. The ${BATCH[n]} uses ${r(a * n, b * n)}, which is equivalent to ${r(a, b)}.`,
      solution: `${wv * n} ${want}`,
    };
  }

  function batchDiagram() {
    const [ka, kb] = pickTwo(D.ITEM_KEYS);
    const [A, B, thing] = pick(RECIPES);
    const [a, b] = coprime(1, 3);
    const n = randInt(2, 3);
    const opt = (bA, bB, count, extra) => ({ html: D.batches({ a: bA, b: bB, itemA: ka, itemB: kb, n: count }), ...extra });
    return {
      type: 'batchDiagram', skill: SKILLS.batchDiagram,
      prompt: `A recipe for ${thing} uses ${a} ${A} for every ${b} ${B}. In each diagram, ${D.chip(ka)} = 1 of the ${A} and ${D.chip(kb)} = 1 of the ${B}. Which diagram shows a ${strong(BATCH[n])}?`,
      summary: `Diagram for a ${BATCH[n]} of ${r(a, b)} ${thing}`,
      ...mc([
        opt(a, b, n, { correct: true }),
        opt(a, b, n + 1, { hint: `Count the batches. A ${BATCH[n]} has exactly ${n}.` }),
        opt(b, a, n, { hint: `Look at each batch. It should have ${a} ${D.ITEMS[ka].name} and ${b} ${D.ITEMS[kb].name}, not the other way around.` }),
        opt(a, b + 1, n, { hint: `Each batch must match the recipe: exactly ${b} ${D.ITEMS[kb].name} per batch.` }),
      ]),
      wideOptions: true,
      hint: `Find the diagram with ${n} batches that each match the recipe: ${a} ${D.ITEMS[ka].name} and ${b} ${D.ITEMS[kb].name}.`,
      explanation: `A ${BATCH[n]} is ${n} copies of the recipe. That makes ${a * n} ${A} and ${b * n} ${B}: ${r(a * n, b * n)}.`,
      solution: `${n} batches of ${r(a, b)}`,
    };
  }

  function colorMix() {
    const [A, B, color] = pick(PAINTS);
    const [a, b] = coprime(1, 5);
    const k = randInt(2, 4);
    return {
      type: 'colorMix', skill: SKILLS.colorMix,
      prompt: `Lin mixes ${strong(`${a} ${A}`)} with ${strong(`${b} ${B}`)} to make ${color}. Which mixture makes the ${strong('same shade')}?`,
      summary: `Same shade as ${r(a, b)} ${color}, ×${k}`,
      ...mc([
        { html: `${a * k} ${A} and ${b * k} ${B}`, correct: true },
        { html: `${a + k} ${A} and ${b + k} ${B}`, hint: 'Adding the same amount to both changes the shade. To keep the same color, <em>multiply</em> both amounts by the same number.' },
        { html: `${b * k} ${A} and ${a * k} ${B}`, hint: 'Those amounts are switched, so the color would come out different.' },
        { html: `${a * k} ${A} and ${b} ${B}`, hint: `Only the ${A} were multiplied. Both amounts must be multiplied by the same number.` },
      ]),
      hint: 'A double or triple batch keeps the same color. Look for both amounts multiplied by the same number.',
      explanation: `${r(a, b)} × ${k} = ${r(a * k, b * k)}. Multiplying both amounts by ${k} makes ${k} batches of the same color, so the ratios are equivalent.`,
      solution: `${a * k} ${A} and ${b * k} ${B}`,
    };
  }

  function makeEquiv() {
    const [a, b] = coprime(1, 9);
    return {
      type: 'makeEquiv', skill: SKILLS.makeEquiv,
      prompt: `Write a ratio that is ${strong('equivalent')} to ${strong(r(a, b))}. (There are many right answers!)`,
      summary: `Equivalent to ${r(a, b)}`,
      format: 'ratio',
      check: (input) => {
        const p = Util.parseRatio(input);
        if (!p) return { status: 'invalid', message: 'Type your answer as two numbers, like <strong>6:4</strong>.' };
        const [x, y] = p;
        if (x === a && y === b) return { status: 'incorrect', message: 'That is the same ratio. Make a new one by multiplying both numbers by the same number.' };
        if (x > 0 && y > 0 && x * b === y * a) {
          return { status: 'correct', message: x % a === 0 ? `${r(a, b)} × ${x / a} = ${r(x, y)}.` : `${r(x, y)} works because both numbers are ${x / a} times as big.` };
        }
        if (x - a === y - b) return { status: 'incorrect', message: 'You added the same number to both. Equivalent ratios come from <em>multiplying</em> (or dividing) both numbers by the same number.' };
        if (x * a === y * b) return { status: 'incorrect', message: 'Check the order: the first number should match the first number of the ratio.' };
        return { status: 'incorrect' };
      },
      hint: `Multiply both ${a} and ${b} by the same number, like 2 or 3.`,
      explanation: `Multiply both numbers by the same number: ${r(a, b)} × 2 = ${r(a * 2, b * 2)}, ${r(a, b)} × 3 = ${r(a * 3, b * 3)}, and so on.`,
      solution: r(a * 2, b * 2),
    };
  }

  function isEquiv() {
    const [a, b] = coprime(1, 6);
    const k = randInt(2, 5);
    return {
      type: 'isEquiv', skill: SKILLS.isEquiv,
      prompt: `Which ratio is ${strong('equivalent')} to ${strong(r(a, b))}?`,
      summary: `Which is equivalent to ${r(a, b)} (×${k})`,
      ...mc([
        { html: r(a * k, b * k), correct: true },
        { html: r(a + k, b + k), hint: `${a} + ${k} and ${b} + ${k}: adding does not keep the ratio the same. Look for both numbers multiplied by the same number.` },
        { html: r(b * k, a * k), hint: 'The order is switched. The first number must go with the first quantity.' },
        { html: r(a * k, b * (k + 1)), hint: `${a} was multiplied by ${k}, but ${b} was multiplied by ${k + 1}. Both must use the same number.` },
      ]),
      hint: 'Ask: is there one number I can multiply both parts by?',
      explanation: `${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}, so ${r(a * k, b * k)} is equivalent to ${r(a, b)}.`,
      solution: r(a * k, b * k),
    };
  }

  function dnlSpec(A, B, a, b, n, fmtB = String) {
    return {
      top: { label: A, values: Array.from({ length: n }, (_, i) => String(i * a)) },
      bottom: { label: B, values: Array.from({ length: n }, (_, i) => fmtB(i * b)) },
    };
  }

  function dnlMissing() {
    const [A, B] = pick([...RECIPES, ...PAINTS]);
    const [a, b] = coprime(1, 6);
    const n = 5;
    const i = randInt(2, n - 1);
    const onTop = Math.random() < 0.5;
    const spec = { ...dnlSpec(A, B, a, b, n), hidden: [`${onTop ? 't' : 'b'}${i}`] };
    const step = onTop ? a : b;
    const ans = i * step;
    return {
      type: 'dnlMissing', skill: SKILLS.dnlMissing,
      prompt: 'What number belongs in the box with the <strong>?</strong> on this double number line?',
      summary: `Double number line ${r(a, b)}, missing ${onTop ? 'top' : 'bottom'} #${i}`,
      visualHtml: D.doubleNumberLine(spec),
      ...number(ans, [
        [ans + 1, `Each tick mark adds ${step}, not 1.`],
        [i * (onTop ? b : a), 'That number belongs on the other line. Use the numbers on the same line as the box.'],
        [(i + 1) * step, 'Count the tick marks from 0 carefully.'],
      ]),
      hint: `On that line, each tick mark adds ${step}. Start at 0 and count up.`,
      explanation: `Each step on the ${onTop ? A : B} line adds ${step}. ${i} steps from 0 is ${i} × ${step} = ${ans}. That pairs with ${r(i * a, i * b)}.`,
      solution: String(ans),
    };
  }

  function dnlExtend() {
    const [A, B, thing] = pick(RECIPES);
    const [a, b] = coprime(1, 5);
    const n = 4;
    const m = randInt(5, 8);
    return {
      type: 'dnlExtend', skill: SKILLS.dnlExtend,
      prompt: `This double number line shows a recipe for ${thing}. If you keep going, how many ${strong(B)} go with ${strong(`${m * a} ${A}`)}?`,
      summary: `Extend ${r(a, b)} to ${m * a} ${A}`,
      visualHtml: D.doubleNumberLine(dnlSpec(A, B, a, b, n)),
      ...number(m * b, [
        [m * a, `That is the number of ${A}. The question asks for ${B}.`],
        [(n - 1) * b + (m * a - (n - 1) * a), `It looks like you added the same amount to both lines. Keep adding ${a} on top and ${b} on the bottom each step.`],
      ]),
      hint: `${m * a} is ${m} steps of ${a}. Take ${m} steps of ${b} on the bottom line.`,
      explanation: `${m * a} ÷ ${a} = ${m} steps. ${m} × ${b} = ${m * b} ${B}.`,
      solution: `${m * b}`,
    };
  }

  function unitPrice() {
    const [item, prices] = pick(SHOP);
    const unit = pick(prices);
    const n = randInt(2, 8);
    const total = unit * n;
    return {
      type: 'unitPrice', skill: SKILLS.unitPrice,
      prompt: `${n} ${item} cost ${strong(money(total))}. At this rate, how much does ${strong(`1`)} cost? (in dollars)`,
      summary: `${n} ${item} for ${money(total)}, price for one`,
      ...number(unit, [
        [total * n, `That multiplies. To find the price of 1, ${strong('divide')} the total by ${n}.`],
        [n / total, 'Divide the cost by the number of items, not the other way around.'],
        [total, `That is the price of all ${n}.`],
      ]),
      hint: `Split ${money(total)} into ${n} equal parts: ${money(total)} ÷ ${n}.`,
      explanation: `${money(total)} ÷ ${n} = ${money(unit)} for each one.`,
      solution: money(unit),
    };
  }

  function costOfN() {
    const [item, prices] = pick(SHOP);
    const unit = pick(prices);
    const n = randInt(2, 6);
    let m = randInt(2, 10);
    while (m === n) m = randInt(2, 10);
    const total = unit * n;
    return {
      type: 'costOfN', skill: SKILLS.costOfN,
      prompt: `${n} ${item} cost ${strong(money(total))}. At this rate, how much do ${strong(`${m} ${item}`)} cost? (in dollars)`,
      summary: `${n} ${item} for ${money(total)}, cost of ${m}`,
      ...number(unit * m, [
        [total + (m - n), 'It looks like you added $1 for each extra item. First find the price of one.'],
        [unit, `That is the price of 1. Now multiply by ${m}.`],
      ]),
      hint: `First find the price of 1: ${money(total)} ÷ ${n}. Then multiply by ${m}.`,
      explanation: `${money(total)} ÷ ${n} = ${money(unit)} each. ${money(unit)} × ${m} = ${money(unit * m)}.`,
      solution: money(unit * m),
    };
  }

  function betterDeal() {
    const [item, prices] = pick(SHOP);
    const [u1, u2] = pickTwo([...prices, prices[prices.length - 1] + 0.25]);
    const n1 = randInt(2, 6);
    let n2 = randInt(2, 8);
    while (n2 === n1) n2 = randInt(2, 8);
    const cheaper = u1 < u2 ? 'Store A' : 'Store B';
    return {
      type: 'betterDeal', skill: SKILLS.betterDeal,
      prompt: `Store A sells ${n1} ${item} for ${strong(money(u1 * n1))}. Store B sells ${n2} ${item} for ${strong(money(u2 * n2))}. Which store has the better deal (lower price for one)?`,
      summary: `Better deal: ${n1} for ${money(u1 * n1)} vs ${n2} for ${money(u2 * n2)}`,
      ...mc([
        { html: cheaper, correct: true },
        { html: cheaper === 'Store A' ? 'Store B' : 'Store A', hint: 'Find the price of 1 at each store, then compare.' },
        { html: 'They cost the same', hint: `Find the price for one at each store: they are not equal.` },
      ]),
      hint: `Store A: ${money(u1 * n1)} ÷ ${n1}. Store B: ${money(u2 * n2)} ÷ ${n2}. Which is less?`,
      explanation: `Store A: ${money(u1)} each. Store B: ${money(u2)} each. ${cheaper} is cheaper for one.`,
      solution: cheaper,
    };
  }

  function speed() {
    const [who, dist, time] = pick(MOVERS);
    const s = randInt(2, 12);
    const t = pick([2, 3, 4, 5, 6, 8, 10]);
    const d = s * t;
    const per = time.slice(0, -1);
    return {
      type: 'speed', skill: SKILLS.speed,
      prompt: `${who} goes ${strong(`${d} ${dist}`)} in ${strong(`${t} ${time}`)} at a constant speed. How many ${dist} does it go in ${strong(`1 ${per}`)}?`,
      summary: `${d} ${dist} in ${t} ${time}, speed`,
      ...number(s, [
        [d * t, `That multiplies. Divide the distance by the time: ${d} ÷ ${t}.`],
        [d - t, 'Subtracting does not give the speed. Divide the distance by the time.'],
      ]),
      hint: `Split ${d} ${dist} into ${t} equal parts, one for each ${per}.`,
      explanation: `${d} ÷ ${t} = ${s}, so the speed is ${s} ${dist} per ${per}.`,
      solution: `${s} ${dist} per ${per}`,
    };
  }

  function distance() {
    const [who, dist, time] = pick(MOVERS);
    const s = randInt(2, 9);
    const t = randInt(2, 5);
    let t2 = randInt(2, 10);
    while (t2 === t) t2 = randInt(2, 10);
    return {
      type: 'distance', skill: SKILLS.distance,
      prompt: `${who} goes ${strong(`${s * t} ${dist}`)} in ${strong(`${t} ${time}`)}. At the same speed, how far does it go in ${strong(`${t2} ${time}`)}?`,
      summary: `${s * t} ${dist} in ${t} ${time}, distance in ${t2}`,
      ...number(s * t2, [
        [s * t + (t2 - t), `Each extra ${time.slice(0, -1)} adds ${s} ${dist}, not 1.`],
        [s, `That is the distance in 1 ${time.slice(0, -1)}. Multiply by ${t2}.`],
      ]),
      hint: `First find the distance in 1 ${time.slice(0, -1)}: ${s * t} ÷ ${t}. Then multiply by ${t2}.`,
      explanation: `Speed: ${s * t} ÷ ${t} = ${s} ${dist} per ${time.slice(0, -1)}. In ${t2} ${time}: ${s} × ${t2} = ${s * t2} ${dist}.`,
      solution: `${s * t2} ${dist}`,
    };
  }

  function sameRate() {
    const [a, b] = coprime(1, 5);
    const k = randInt(2, 4);
    const kind = pick(['same', 'added', 'more']);
    const [c, d] = kind === 'same' ? [a * k, b * k] : kind === 'added' ? [a + k, b + k] : [a * k + 1, b * k];
    // Strength = scoops per cup of water; compare a/b with c/d.
    const diff = a * d - c * b;
    const answer = diff === 0 ? 'They taste the same' : diff > 0 ? 'Jada\'s is stronger' : 'Noah\'s is stronger';
    return {
      type: 'sameRate', skill: SKILLS.sameRate,
      prompt: `Jada mixes ${strong(`${a} scoops`)} of lemonade mix with ${strong(`${b} cups`)} of water. Noah mixes ${strong(`${c} scoops`)} with ${strong(`${d} cups`)} of water. How do they compare?`,
      summary: `Lemonade ${r(a, b)} vs ${r(c, d)}`,
      ...mc([
        { html: answer, correct: true },
        ...['They taste the same', 'Jada\'s is stronger', 'Noah\'s is stronger'].filter((x) => x !== answer).map((html) => ({
          html,
          hint: kind === 'added'
            ? 'Adding the same number to both amounts does not keep the same taste. Compare scoops per cup of water.'
            : `Check: multiply Jada's ${r(a, b)} by ${k}. Does it match Noah's ${r(c, d)}?`,
        })),
      ]),
      hint: `Scale Jada's recipe to use ${d} cups of water (or compare scoops for each cup of water).`,
      explanation: diff === 0
        ? `${r(a, b)} × ${k} = ${r(c, d)}. The ratios are equivalent, so they taste the same.`
        : `Jada: ${a} scoops for ${b} cups = ${(a / b).toFixed(2)} scoop per cup. Noah: ${c} for ${d} = ${(c / d).toFixed(2)} scoop per cup. More mix per cup tastes stronger.`,
      solution: answer,
    };
  }

  function tableMissing() {
    const [A, B] = pick([...RECIPES, ...PAINTS]);
    const [a, b] = coprime(1, 6);
    const ks = shuffle([1, 2, 3, 4, 5, 6, 10]).slice(0, 4).sort((x, y) => x - y);
    const ri = randInt(1, 3);
    const ci = randInt(0, 1);
    const rows = ks.map((k) => [k * a, k * b]);
    const ans = rows[ri][ci];
    return {
      type: 'tableMissing', skill: SKILLS.tableMissing,
      prompt: 'This table shows equivalent ratios. What number replaces the <strong>?</strong>',
      summary: `Table ${r(a, b)}, rows ×${ks.join(',')}, missing ${ri},${ci}`,
      visualHtml: D.ratioTable({ heads: [A, B], rows, hidden: [`${ri},${ci}`] }),
      ...number(ans, [
        [rows[ri][1 - ci], 'That number belongs in the other column.'],
        [rows[ri][1 - ci] + (ci === 0 ? a - b : b - a), 'Adding does not work in a ratio table. Multiply instead.'],
      ]),
      hint: `Every row is ${r(a, b)} with both numbers multiplied by the same number. Use the number you know in row ${ri + 1} to find that multiplier.`,
      explanation: `${r(a, b)} × ${ks[ri]} = ${r(ks[ri] * a, ks[ri] * b)}, so the missing number is ${ans}.`,
      solution: String(ans),
    };
  }

  function tableUnit() {
    const [item, prices] = pick(SHOP);
    const unit = pick(prices.filter((p) => p >= 1));
    const ns = shuffle([2, 3, 4, 5, 6, 8]).slice(0, 3).sort((x, y) => x - y);
    const rows = ns.map((n) => [n, money(n * unit)]);
    return {
      type: 'tableUnit', skill: SKILLS.tableUnit,
      prompt: `This table shows the cost of ${item}. How much does ${strong(`1`)} cost? (in dollars)`,
      summary: `Table of ${item} at ${money(unit)}`,
      visualHtml: D.ratioTable({ heads: [`number of ${item}`, 'cost (dollars)'], rows: [[1, '<span class="blank">?</span>'], ...rows] }),
      ...number(unit, [
        [ns[0] * unit, `That is the cost of ${ns[0]}. Divide by ${ns[0]} to find the cost of 1.`],
        [unit * ns[0] - unit, 'Subtracting a row does not give the price of one. Divide the cost by the number of items.'],
      ]),
      hint: `Pick any row and divide: ${money(ns[0] * unit)} ÷ ${ns[0]}.`,
      explanation: `${money(ns[0] * unit)} ÷ ${ns[0]} = ${money(unit)}. Every row gives the same price for one: that's what makes the ratios equivalent.`,
      solution: money(unit),
    };
  }

  function wordEquiv() {
    const [A, B, thing] = pick(RECIPES);
    let a; let b; let c;
    if (Math.random() < 0.5) {
      [a, b] = coprime(2, 5);
      c = a * randInt(2, 6);
    } else {
      a = randInt(2, 4);
      b = a * randInt(2, 4);
      c = randInt(2, 11);
      if (c === a) c += 1;
    }
    const ans = (b / a) * c;
    return {
      type: 'wordEquiv', skill: SKILLS.wordEquiv,
      prompt: `A recipe for ${thing} uses ${strong(`${a} ${A}`)} for every ${strong(`${b} ${B}`)}. How many ${strong(B)} go with ${strong(`${c} ${A}`)}?`,
      summary: `${r(a, b)} ${thing}, ${c} ${A}`,
      ...number(ans, [
        [b + (c - a), 'Adding the same amount to both does not keep an equivalent ratio. Multiply instead.'],
        [(a / b) * c, 'The numbers are flipped. Check which amount goes with which.'],
      ]),
      hint: c % a === 0
        ? `${c} is ${c / a} times ${a}. Multiply ${b} by the same number.`
        : `Find how many ${B} for 1 of the ${A}: ${b} ÷ ${a}. Then multiply by ${c}.`,
      explanation: c % a === 0
        ? `${c} ÷ ${a} = ${c / a}, and ${b} × ${c / a} = ${ans}. So ${r(a, b)} is equivalent to ${r(c, ans)}.`
        : `${b} ÷ ${a} = ${b / a} ${B} for each one. ${b / a} × ${c} = ${ans}.`,
      solution: `${ans} ${B}`,
    };
  }

  function partWhole(askTotal) {
    const [A, B, whole, sA, sB] = pick(GROUPS);
    const [a, b] = coprime(1, 5);
    const k = randInt(2, 8);
    const total = k * (a + b);
    const tape = (text, totalLabel) => D.tapeParts({
      rows: [{ label: sA, n: a, item: 'blue', text }, { label: sB, n: b, item: 'orange', text }],
      total: totalLabel,
    });
    if (askTotal) {
      return {
        type: 'pppTotal', skill: SKILLS.pppTotal,
        prompt: `The ratio of ${A} to ${B} is ${strong(r(a, b))}. There are ${strong(`${k * a} ${A}`)}. How many ${strong(whole)} are there in all?`,
        summary: `${r(a, b)} ${A}:${B}, ${k * a} ${A}, total`,
        ...number(total, [
          [k * b, `That is the number of ${B}. Add the ${A} too to get the total.`],
          [k * a + b, `Each box is worth ${k}, so there are ${b} × ${k} ${B}, not ${b}.`],
        ]),
        hint: `Draw a tape diagram: ${a} boxes for ${A}, ${b} for ${B}. ${k * a} ÷ ${a} tells you what each box is worth.`,
        explanation: `Each box is ${k * a} ÷ ${a} = ${k}. There are ${a + b} boxes, so ${a + b} × ${k} = ${total} in all.${tape(k, `${total} in all`)}`,
        solution: String(total),
      };
    }
    return {
      type: 'pppWhole', skill: SKILLS.pppWhole,
      prompt: `There are ${strong(`${total} ${whole}`)}. The ratio of ${A} to ${B} is ${strong(r(a, b))}. How many ${strong(B)} are there?`,
      summary: `${total} ${whole}, ${r(a, b)}, find ${B}`,
      ...number(k * b, [
        [k * a, `That is the number of ${A}. The question asks for ${B}.`],
        [k, `That is the value of one box. There are ${b} boxes for ${B}.`],
      ]),
      hint: `Make a tape diagram with ${a} + ${b} = ${a + b} equal boxes. Each box is ${total} ÷ ${a + b}.`,
      explanation: `${total} ÷ ${a + b} boxes = ${k} in each box. ${B}: ${b} × ${k} = ${k * b}.${tape(k, `${total} in all`)}`,
      solution: String(k * b),
    };
  }
  const pppWhole = () => partWhole(false);
  const pppTotal = () => partWhole(true);

  function tapeRead() {
    const [A, B, whole, sA, sB] = pick(GROUPS);
    const [a, b] = coprime(1, 5);
    const k = randInt(2, 9);
    const total = k * (a + b);
    return {
      type: 'tapeRead', skill: SKILLS.tapeRead,
      prompt: `The tape diagram shows ${A} and ${B} in a ratio of ${r(a, b)}. There are ${strong(`${total} ${whole}`)}. How much is ${strong('one box')} worth?`,
      summary: `Tape ${r(a, b)}, total ${total}`,
      visualHtml: D.tapeParts({
        rows: [{ label: sA, n: a, item: 'blue', text: '?' }, { label: sB, n: b, item: 'orange', text: '?' }],
        total: `${total} in all`,
      }),
      ...number(k, [
        [total / a, `Divide by all ${a + b} boxes, not just the ${a} for ${A}.`],
        [total / b, `Divide by all ${a + b} boxes, not just the ${b} for ${B}.`],
      ]),
      hint: `Count all the boxes: ${a} + ${b} = ${a + b}. Share ${total} equally among them.`,
      explanation: `${total} ÷ ${a + b} = ${k}. Each box is worth ${k}.`,
      solution: String(k),
    };
  }

  const GENERATORS = {
    batchScale, batchDiagram, colorMix, makeEquiv, isEquiv, dnlMissing, dnlExtend,
    unitPrice, costOfN, betterDeal, speed, distance, sameRate, tableMissing, tableUnit,
    wordEquiv, pppWhole, pppTotal, tapeRead,
  };
  // Practice can also mix in the ratio basics from js/questions.js.
  const ALL = { ...Questions.GENERATORS, ...GENERATORS };

  // Picks `count` different questions, rotating through the types so each one shows up.
  function buildSession(types, count) {
    const seen = new Set();
    const picked = [];
    for (let tries = 0; picked.length < count && tries < 60; tries++) {
      for (const type of shuffle(types)) {
        if (picked.length >= count) break;
        const q = ALL[type](0);
        if (seen.has(q.summary)) continue;
        seen.add(q.summary);
        picked.push(q);
      }
    }
    return shuffle(picked);
  }

  // ---------- Teaching helpers ----------
  const targets = (list) => ({
    title: 'Learning targets',
    html: `
      <p>By the end of this section, you should be able to say:</p>
      <ul class="checklist targets">${list.map((t) => `<li>${t}</li>`).join('')}</ul>
      <p class="muted small">Come back to this list when you finish. Can you do each one?</p>`,
  });

  // Mixes blue (hue 220) toward yellow (hue 55) through green; equivalent ratios give the same hue.
  function swatch(blue, yellow) {
    if (!blue && !yellow) return '<span class="swatch swatch-empty">empty</span>';
    const t = yellow / (blue + yellow);
    const hue = Math.round(235 - 190 * t * t);
    return `<span class="swatch" style="background:hsl(${hue} 75% ${30 + 34 * t}%)" aria-label="paint color"></span>`;
  }

  const art = (emoji) => `<span class="lesson-emoji">${emoji}</span>`;

  // ---------- Sections ----------
  const L1 = Lessons.byId[1];
  const L2 = Lessons.byId[2];

  const sections = [
    {
      id: 1,
      short: 'Lessons 1–2',
      navTitle: 'Lessons 1–2: Ratio language & diagrams',
      title: 'Lessons 1–2: Introducing Ratios and Ratio Language & Representing Ratios with Diagrams',
      blurb: 'Describe ratios with words and numbers in the right order, then draw labeled diagrams that show them.',
      art: L1.art,
      sessionLength: 6,
      types: ['objects', 'word', 'read', 'reverse', 'diagram', 'choose'],
      steps: [
        targets([
          'I can write or say a sentence that describes a ratio.',
          'I know how to say words and numbers in the correct order to accurately describe the ratio.',
          'I include labels when I draw a diagram representing a ratio, so that the meaning of the diagram is clear.',
          'I can draw a diagram that represents a ratio and explain what the diagram means.',
        ]),
        ...L1.steps,
        ...L2.steps,
      ],
    },
    {
      id: 21,
      short: 'Lessons 2–3',
      navTitle: 'Lessons 2–3: Diagrams & recipes',
      title: 'Lessons 2–3: Representing Ratios with Diagrams and Recipes',
      blurb: 'Label ratio diagrams, then use them to show a recipe as a single, double, and triple batch.',
      art: D.batches({ a: 2, b: 1, itemA: 'orange', itemB: 'blue', n: 2 }),
      sessionLength: 6,
      types: ['diagram', 'choose', 'batchScale', 'batchDiagram'],
      steps: [
        targets([
          'I include labels when I draw a diagram representing a ratio, so that the meaning of the diagram is clear.',
          'I can draw a diagram that represents a ratio and explain what the diagram means.',
          'I can use a diagram to represent a recipe, a double batch, and a triple batch of a recipe.',
          'I know what it means to double or triple a recipe.',
          'I can explain the meaning of equivalent ratios using a recipe as an example.',
        ]),
        {
          title: 'Labels make diagrams clear',
          html: `
            <p>Here is a diagram. What does it mean? Without labels, nobody can tell!</p>
            <div class="diagram-box">${D.render({ a: 3, b: 1, itemA: 'orange', itemB: 'blue' })}</div>
            <p>Add a ${strong('key')} or ${strong('labels')} so the reader knows what each shape stands for:</p>
            <div class="callout">${D.chip('orange')} = 1 cup of flour &nbsp;&nbsp; ${D.chip('blue')} = 1 egg</div>
            <p>Now the diagram says: <em>"For every 3 cups of flour, there is 1 egg."</em> The ratio of flour to eggs is ${strong('3 : 1')}.</p>
            <p>Which label best explains the diagram?</p>
            <div id="check"></div>`,
          mount(el) {
            miniCheck(el, '#check', [
              { label: '3 and 1', correct: false, feedback: 'Numbers alone do not say what is being counted. Add words!' },
              { label: '3 cups of flour for every 1 egg', correct: true, feedback: 'Yes! Words + numbers in the right order make the meaning clear.' },
              { label: '1 egg for every 3 eggs', correct: false, feedback: 'The orange stars stand for flour, not eggs. Check the key.' },
            ]);
          },
        },
        {
          title: 'Recipes and batches',
          html: `
            <p>A pancake recipe uses ${strong('2 cups of flour')} for every ${strong('1 egg')}. ${D.chip('orange')} = 1 cup of flour, ${D.chip('blue')} = 1 egg.</p>
            <div class="stepper-row"><div class="stepper" id="batchStep"></div></div>
            <div class="diagram-box" id="batchBox"></div>
            <p id="batchText" class="callout"></p>
            <p>A ${strong('double batch')} means 2 copies of the recipe: 2 times as much of <em>every</em> ingredient. A ${strong('triple batch')} is 3 copies.</p>`,
          mount(el) {
            const draw = (n) => {
              el.querySelector('#batchBox').innerHTML = D.batches({ a: 2, b: 1, itemA: 'orange', itemB: 'blue', n });
              el.querySelector('#batchText').innerHTML = `${n === 1 ? 'A single batch' : `A ${BATCH[n]}`}: ${strong(`${2 * n} cups of flour`)} and ${strong(`${n} egg${n === 1 ? '' : 's'}`)}. Ratio: ${strong(r(2 * n, n))}`;
            };
            stepper(el, '#batchStep', { value: 1, min: 1, max: 4, label: 'batches', onChange: draw });
            draw(1);
          },
        },
        {
          title: 'Equivalent ratios',
          html: `
            <p>Every batch tastes ${strong('the same')}, because the flour and eggs stay in the same proportion.</p>
            <p class="big-ratio inline">2 : 1</p> <p class="big-ratio inline">4 : 2</p> <p class="big-ratio inline">6 : 3</p>
            <p>Ratios like these are called ${strong('equivalent ratios')}. You get them by multiplying both numbers by the ${strong('same')} number.</p>
            <div class="callout">${strong('Watch out:')} adding 1 cup of flour and 1 egg (3 : 2) is <em>not</em> a double batch. The pancakes would taste different!</div>
            <p>A recipe uses 3 cups of oats for every 2 cups of milk. What is a ${strong('triple batch')}?</p>
            <div id="check"></div>`,
          mount(el) {
            miniCheck(el, '#check', [
              { label: '6 cups of oats, 5 cups of milk', correct: false, feedback: 'That adds 3 to each. A triple batch multiplies each amount by 3.' },
              { label: '9 cups of oats, 6 cups of milk', correct: true, feedback: 'Yes! 3 × 3 = 9 and 2 × 3 = 6. 9 : 6 is equivalent to 3 : 2.' },
              { label: '9 cups of oats, 2 cups of milk', correct: false, feedback: 'The milk needs to be tripled too.' },
            ]);
          },
        },
      ],
    },
    {
      id: 22,
      short: 'Lessons 3–5',
      navTitle: 'Lessons 3–5: Recipes, colors & equivalent ratios',
      title: 'Lessons 3–5: Recipes, Color Mixtures & Defining Equivalent Ratios',
      blurb: 'Double and triple recipes and paint mixtures, then define, create, and check equivalent ratios.',
      art: `<span class="swatch-row">${swatch(1, 2)}${swatch(2, 4)}${swatch(3, 6)}</span>`,
      sessionLength: 6,
      types: ['batchScale', 'colorMix', 'makeEquiv', 'isEquiv'],
      steps: [
        targets([
          'I can use a diagram to represent a recipe, a double batch, and a triple batch of a recipe.',
          'I know what it means to double or triple a recipe.',
          'I can explain the meaning of equivalent ratios using a recipe as an example.',
          'I know what it means to double or triple a color mixture.',
          'I can use a diagram to represent a single batch, a double batch, and a triple batch of a color mixture.',
          'I can explain the meaning of equivalent ratios using a color mixture as an example.',
          'If I have a ratio, I can create a new ratio that is equivalent to it.',
          'If I have two ratios, I can decide whether they are equivalent to each other.',
        ]),
        {
          title: 'Recipe review',
          html: `
            <p>A trail mix recipe uses ${strong('3 cups of peanuts')} for every ${strong('2 cups of raisins')}.</p>
            ${D.ratioTable({ heads: ['batches', 'cups of peanuts', 'cups of raisins'], rows: [['single', 3, 2], ['double', 6, 4], ['triple', 9, 6]] })}
            <p>Each batch size uses the same recipe, so they all taste the same. 3 : 2, 6 : 4 and 9 : 6 are ${strong('equivalent ratios')}.</p>`,
        },
        {
          title: 'Color mixtures',
          html: `
            <p>Green paint is made from ${strong('1 cup of blue')} for every ${strong('2 cups of yellow')}. Try to make the ${strong('same green')} with different amounts.</p>
            <div class="mix-lab">
              <div class="mix-target"><p class="small"><strong>Target</strong><br>1 blue : 2 yellow</p>${swatch(1, 2)}</div>
              <div>
                <div class="stepper-row">
                  <div class="stepper" id="blueStep"></div>
                  <div class="stepper" id="yellowStep"></div>
                </div>
                <div class="mix-result"><span id="mixSwatch"></span><p id="mixText" class="mini-feedback" role="status"></p></div>
              </div>
            </div>
            <p>A ${strong('double batch')} of paint is 2 blue : 4 yellow. A ${strong('triple batch')} is 3 blue : 6 yellow. Same color, more paint!</p>`,
          mount(el) {
            let blue = 2;
            let yellow = 3;
            const draw = () => {
              el.querySelector('#mixSwatch').innerHTML = swatch(blue, yellow);
              const same = blue > 0 && yellow === 2 * blue;
              const fb = el.querySelector('#mixText');
              fb.className = `mini-feedback ${same ? 'good' : ''}`;
              fb.innerHTML = same
                ? `✅ ${r(blue, yellow)} is the same green! It is ${blue} batch${blue === 1 ? '' : 'es'} of 1 : 2.`
                : `${r(blue, yellow)}: ${blue + yellow ? 'not quite the same shade. Keep trying!' : 'add some paint.'}`;
            };
            stepper(el, '#blueStep', { value: blue, min: 0, max: 6, label: 'blue', onChange: (v) => { blue = v; draw(); } });
            stepper(el, '#yellowStep', { value: yellow, min: 0, max: 12, label: 'yellow', onChange: (v) => { yellow = v; draw(); } });
            draw();
          },
        },
        {
          title: 'What are equivalent ratios?',
          html: `
            <div class="callout">Two ratios are ${strong('equivalent')} if you can multiply both numbers in one ratio by the ${strong('same number')} to get the other ratio.</div>
            <p>${strong('To create')} an equivalent ratio, pick a number and multiply both parts:</p>
            <p class="big-ratio inline">5 : 2</p> → × 3 → <p class="big-ratio inline">15 : 6</p>
            <p>${strong('To check')} if two ratios are equivalent, look for one number that works for both parts.</p>
            <ul class="language-list">
              <li>4 : 6 and 12 : 18? &nbsp;4 × 3 = 12 and 6 × 3 = 18 ✅ equivalent</li>
              <li>4 : 6 and 6 : 8? &nbsp;That adds 2 to each. There is no single number to multiply by ❌ not equivalent</li>
            </ul>
            <p>Are ${strong('3 : 4')} and ${strong('12 : 15')} equivalent?</p>
            <div id="check"></div>`,
          mount(el) {
            miniCheck(el, '#check', [
              { label: 'Yes', correct: false, feedback: '3 × 4 = 12, but 4 × 4 = 16, not 15. The same number has to work for both parts.' },
              { label: 'No', correct: true, feedback: 'Right! 3 × 4 = 12, but 4 × 4 = 16. 12 : 16 would be equivalent, not 12 : 15.' },
            ]);
          },
        },
      ],
    },
    {
      id: 23,
      short: 'Lessons 6–7',
      navTitle: 'Lessons 6–7: Double number lines',
      title: 'Lessons 6–7: Introducing Double Number Line Diagrams & Creating Double Number Line Diagrams',
      blurb: 'Use two lined-up number lines to show many equivalent ratios at once, and build your own.',
      art: D.doubleNumberLine({ top: { label: 'blue', values: ['0', '1', '2', '3'] }, bottom: { label: 'yellow', values: ['0', '2', '4', '6'] } }),
      sessionLength: 6,
      types: ['dnlMissing', 'dnlExtend', 'makeEquiv'],
      steps: [
        targets([
          'I can label a double number line diagram to represent equivalent ratios.',
          'I know what a double number line diagram is and what it is used for.',
          'I can create a double number line diagram and use it to find equivalent ratios.',
          'I can explain why the tick marks on a double number line must be equally spaced.',
        ]),
        {
          title: 'What is a double number line?',
          html: `
            <p>A ${strong('double number line')} is two number lines lined up, one for each quantity. Numbers that line up make ${strong('equivalent ratios')}.</p>
            <p>Green paint: 2 cups of blue for every 3 cups of yellow.</p>
            <div class="diagram-box">${D.doubleNumberLine({ top: { label: 'cups of blue paint', values: ['0', '2', '4', '6', '8'] }, bottom: { label: 'cups of yellow paint', values: ['0', '3', '6', '9', '12'] } })}</div>
            <p>Read it straight down: 2 : 3, 4 : 6, 6 : 9, 8 : 12 are all the same green.</p>`,
        },
        {
          title: 'How to make one',
          html: `
            <ol class="language-list">
              <li>Draw two lines and ${strong('label')} each one with what it counts (and the units).</li>
              <li>Both lines start at ${strong('0')}, lined up.</li>
              <li>Make the tick marks ${strong('equally spaced')}. Each step adds the same amount on each line.</li>
              <li>Write the first ratio at the first tick, then keep adding: +2 on top, +3 on the bottom.</li>
            </ol>
            <div class="callout">The spacing matters! Each step to the right is one more batch, so it must be the same size every time.</div>
            <p>A recipe uses 3 cups of rice for every 4 cups of water. What goes in the box?</p>
            <div class="diagram-box">${D.doubleNumberLine({ top: { label: 'cups of rice', values: ['0', '3', '6', '9'] }, bottom: { label: 'cups of water', values: ['0', '4', '8', '12'] }, hidden: ['b3'] })}</div>
            <div id="check"></div>`,
          mount(el) {
            miniCheck(el, '#check', [
              { label: '10', correct: false, feedback: 'Each step on the water line adds 4, not 2.' },
              { label: '12', correct: true, feedback: 'Yes! 0, 4, 8, 12. So 9 cups of rice go with 12 cups of water.' },
              { label: '9', correct: false, feedback: '9 is on the rice line. The box is on the water line.' },
            ]);
          },
        },
      ],
    },
    {
      id: 24,
      short: 'Lesson 8',
      navTitle: 'Lesson 8: How much for one?',
      title: 'Lesson 8: How Much for One?',
      blurb: 'Find the price of one item, use it to find any price, and compare deals.',
      art: art('🏷️'),
      sessionLength: 6,
      types: ['unitPrice', 'costOfN', 'betterDeal'],
      steps: [
        targets([
          'I can choose and create diagrams to help me reason about prices.',
          'I can explain what “at this rate” means, using prices as an example.',
          'If I know the price of multiple things, I can find the price per thing.',
        ]),
        {
          title: 'The price for one',
          html: `
            <p>4 pens cost ${strong('$6')}. How much is ${strong('1 pen')}?</p>
            <div class="diagram-box">${D.doubleNumberLine({ top: { label: 'number of pens', values: ['0', '1', '2', '3', '4'] }, bottom: { label: 'cost (dollars)', values: ['0', '?', '?', '?', '6'] } })}</div>
            <p>Split $6 into 4 equal parts: $6 ÷ 4 = ${strong('$1.50')}. That is the ${strong('price for one')} (also called the ${strong('unit price')}).</p>
            <p>"${strong('At this rate')}" means the price for one stays the same, no matter how many you buy.</p>`,
        },
        {
          title: 'Use the price for one',
          html: `
            <p>Once you know the price for one, you can find the price of ${strong('any number')}:</p>
            ${D.ratioTable({ heads: ['number of pens', 'cost (dollars)'], rows: [[1, '$1.50'], [4, '$6.00'], [7, '$10.50'], [10, '$15.00']] })}
            <p>To compare two deals, find the price for one at each store. The lower price for one is the better deal.</p>
            <p>3 tacos cost $6. How much do ${strong('5 tacos')} cost?</p>
            <div id="check"></div>`,
          mount(el) {
            miniCheck(el, '#check', [
              { label: '$8', correct: false, feedback: 'That adds $1 per taco. First find the price for one: $6 ÷ 3 = $2.' },
              { label: '$10', correct: true, feedback: 'Yes! $6 ÷ 3 = $2 per taco, and 5 × $2 = $10.' },
              { label: '$30', correct: false, feedback: 'That is 5 × $6. The $6 is for 3 tacos, not 1.' },
            ]);
          },
        },
      ],
    },
    {
      id: 25,
      short: 'Lessons 9–10',
      navTitle: 'Lessons 9–10: Constant speed & comparing',
      title: 'Lessons 9–10: Constant Speed & Comparing Situations by Examining Ratios',
      blurb: 'Use ratios to find speeds and distances, and decide whether two situations happen at the same rate.',
      art: art('🏃‍♀️💨'),
      sessionLength: 6,
      types: ['speed', 'distance', 'sameRate'],
      steps: [
        targets([
          'I can choose and create diagrams to help me reason about constant speed.',
          'If I know an object is moving at a constant speed, and I know two of these things: the distance it travels, the amount of time it takes, and its speed, I can find the other thing.',
          'I can decide whether or not two situations are happening at the same rate.',
          'I know that when two situations are described by equivalent ratios, they happen at the same rate.',
        ]),
        {
          title: 'Constant speed',
          html: `
            <p>A runner goes ${strong('15 meters in 3 seconds')} at a constant speed (the same speed the whole time).</p>
            <div class="diagram-box">${D.doubleNumberLine({ top: { label: 'distance (meters)', values: ['0', '5', '10', '15', '20', '25'] }, bottom: { label: 'time (seconds)', values: ['0', '1', '2', '3', '4', '5'] } })}</div>
            <p>${strong('Speed')} = distance in 1 unit of time. 15 ÷ 3 = ${strong('5 meters per second')}.</p>
            <ul class="language-list">
              <li>Know distance and time? Divide to find the speed.</li>
              <li>Know speed and time? Multiply to find the distance: 5 × 8 = 40 meters in 8 seconds.</li>
            </ul>`,
        },
        {
          title: 'Same rate or not?',
          html: `
            <p>Two situations happen at the ${strong('same rate')} when their ratios are ${strong('equivalent')}.</p>
            <ul class="language-list">
              <li>Ana walks 6 miles in 2 hours. Ben walks 9 miles in 3 hours. 6 : 2 × 1.5 = 9 : 3, so they walk at the ${strong('same speed')} (3 miles per hour).</li>
              <li>Lemonade A: 2 scoops in 3 cups of water. Lemonade B: 3 scoops in 4 cups. 2 : 3 is not equivalent to 3 : 4, so they ${strong('taste different')}.</li>
            </ul>
            <p>Tip: compare the ${strong('amount for one')} (per hour, per cup) for each situation.</p>
            <p>Car A goes 120 miles in 2 hours. Car B goes 150 miles in 3 hours. Which is faster?</p>
            <div id="check"></div>`,
          mount(el) {
            miniCheck(el, '#check', [
              { label: 'Car A', correct: true, feedback: 'Yes! Car A: 120 ÷ 2 = 60 mph. Car B: 150 ÷ 3 = 50 mph.' },
              { label: 'Car B', correct: false, feedback: 'Car B goes farther, but it also drives longer. Compare miles per hour.' },
              { label: 'Same speed', correct: false, feedback: '120 : 2 and 150 : 3 are not equivalent. Find miles per hour for each.' },
            ]);
          },
        },
      ],
    },
    {
      id: 26,
      short: 'Lessons 11–12',
      navTitle: 'Lessons 11–12: Ratio tables',
      title: 'Lessons 11–12: Representing Ratios with Tables & Navigating a Table of Equivalent Ratios',
      blurb: 'Organize equivalent ratios in a table and move around it by multiplying and dividing.',
      art: art('📋'),
      sessionLength: 6,
      types: ['tableMissing', 'tableUnit', 'isEquiv'],
      steps: [
        targets([
          'I can create a table that represents a set of equivalent ratios.',
          'I can include column labels that show what each number represents.',
          'I can explain why sometimes a table is easier to use than a double number line.',
          'I can solve problems about equivalent ratios using a table.',
          'I can use a table to find how much of one quantity goes with 1 of the other.',
        ]),
        {
          title: 'A table of equivalent ratios',
          html: `
            <p>Each ${strong('row')} is a ratio. All the rows are equivalent. ${strong('Column labels')} say what each number means.</p>
            ${D.ratioTable({ heads: ['cups of flour', 'cups of sugar'], rows: [[2, 3], [4, 6], [10, 15], [20, 30]] })}
            <p>Tables are handy when the numbers get ${strong('big')} or you need values that are far apart. On a double number line, you would need a lot of tick marks to get from 2 to 20!</p>`,
        },
        {
          title: 'Navigating the table',
          html: `
            <ul class="language-list">
              <li>${strong('Down a column')}: multiply both numbers in a row by the same number. 2 : 3 × 5 → 10 : 15.</li>
              <li>${strong('Find "1"')}: divide. 2 : 3 ÷ 2 → 1 : 1.5. Now you can get to any row: 7 cups of flour → 7 × 1.5 = 10.5 cups of sugar.</li>
              <li>${strong('Across a row')}: the second column is always the first × 1.5 here.</li>
            </ul>
            ${D.ratioTable({ heads: ['minutes', 'pages read'], rows: [[2, 8], [1, '<span class="blank">?</span>'], [5, 20]] })}
            <p>How many pages are read in ${strong('1 minute')}?</p>
            <div id="check"></div>`,
          mount(el) {
            miniCheck(el, '#check', [
              { label: '4', correct: true, feedback: 'Yes! 8 ÷ 2 = 4 pages per minute. Check: 5 × 4 = 20 ✓' },
              { label: '6', correct: false, feedback: 'That subtracts 2. Divide both numbers by 2 instead.' },
              { label: '16', correct: false, feedback: 'Going from 2 minutes to 1 minute means dividing by 2, not multiplying.' },
            ]);
          },
        },
      ],
    },
    {
      id: 27,
      short: 'Lessons 13–14',
      navTitle: 'Lessons 13–14: Tables, lines & problems',
      title: 'Lessons 13–14: Tables and Double Number Line Diagrams & Solving Equivalent Ratio Problems',
      blurb: 'Choose between tables and double number lines, and solve equivalent ratio problems step by step.',
      art: art('🧭'),
      sessionLength: 6,
      types: ['tableMissing', 'dnlMissing', 'wordEquiv', 'costOfN'],
      steps: [
        targets([
          'I can solve problems using both double number lines and tables, and I can explain the benefits of each.',
          'I can solve problems about equivalent ratios using any strategy.',
          'I can decide what information I need to know to solve problems.',
        ]),
        {
          title: 'Same ratios, two pictures',
          html: `
            <p>A recipe uses 3 cups of rice for every 5 cups of water. Both of these show the same equivalent ratios:</p>
            <div class="diagram-box">${D.doubleNumberLine({ top: { label: 'cups of rice', values: ['0', '3', '6', '9'] }, bottom: { label: 'cups of water', values: ['0', '5', '10', '15'] } })}</div>
            ${D.ratioTable({ heads: ['cups of rice', 'cups of water'], rows: [[3, 5], [6, 10], [9, 15], [30, 50]] })}
            <ul class="language-list">
              <li>${strong('Double number line')}: easy to see, great for small, evenly spaced values.</li>
              <li>${strong('Table')}: quick for big or out-of-order values like 30 : 50.</li>
            </ul>`,
        },
        {
          title: 'Solving a ratio problem',
          html: `
            <p>${strong('Problem:')} A recipe uses 4 eggs for every 6 cups of flour. How much flour for 10 eggs?</p>
            <ol class="language-list">
              <li>${strong('Find the ratio')}: eggs : flour = 4 : 6.</li>
              <li>${strong('Set up a table')} with labeled columns.</li>
              <li>${strong('Get to 1')} (or a helpful number): 4 : 6 ÷ 4 → 1 : 1.5.</li>
              <li>${strong('Scale up')}: 1 : 1.5 × 10 → 10 : 15. So ${strong('15 cups of flour')}.</li>
            </ol>
            <p>12 stickers cost $3. How much for 20 stickers?</p>
            <div id="check"></div>`,
          mount(el) {
            miniCheck(el, '#check', [
              { label: '$5', correct: true, feedback: 'Yes! $3 ÷ 12 = $0.25 each, and 20 × $0.25 = $5.' },
              { label: '$11', correct: false, feedback: 'That adds 8 to the price. Find the price for one sticker first.' },
              { label: '$60', correct: false, feedback: 'That multiplies 20 × $3, but $3 buys 12 stickers, not 1.' },
            ]);
          },
        },
      ],
    },
    {
      id: 28,
      short: 'Lesson 15',
      navTitle: 'Lesson 15: Part-part-whole',
      title: 'Lesson 15: Part-Part-Whole Ratios',
      blurb: 'Use tape diagrams to solve problems when you know a ratio and a total.',
      art: D.tapeParts({ rows: [{ label: 'boys', n: 2, item: 'blue', text: '6' }, { label: 'girls', n: 3, item: 'orange', text: '6' }] }),
      sessionLength: 6,
      types: ['pppWhole', 'pppTotal', 'tapeRead'],
      steps: [
        targets([
          'I can create tape diagrams to help me reason about problems involving a ratio and a total amount.',
          'I can solve problems when I know a ratio and a total amount.',
        ]),
        {
          title: 'Parts and the whole',
          html: `
            <p>A club has ${strong('30 students')}. The ratio of boys to girls is ${strong('2 : 3')}. How many are girls?</p>
            <p>Draw a ${strong('tape diagram')}: 2 boxes for boys, 3 boxes for girls. All the boxes are the same size.</p>
            <div class="diagram-box">${D.tapeParts({ rows: [{ label: 'boys', n: 2, item: 'blue', text: '?' }, { label: 'girls', n: 3, item: 'orange', text: '?' }], total: '30 students' })}</div>
            <p>There are 2 + 3 = ${strong('5 boxes')} in all, worth 30 together.</p>
            <button type="button" class="btn btn-secondary" id="reveal">Solve it</button>
            <div class="reveal-box" id="revealBox" hidden>
              <div class="diagram-box">${D.tapeParts({ rows: [{ label: 'boys', n: 2, item: 'blue', text: '6' }, { label: 'girls', n: 3, item: 'orange', text: '6' }], total: '30 students' })}</div>
              <p>30 ÷ 5 = ${strong('6')} in each box. Girls: 3 × 6 = ${strong('18')}. Boys: 2 × 6 = 12. Check: 12 + 18 = 30 ✓</p>
            </div>`,
          mount(el) {
            el.querySelector('#reveal').addEventListener('click', (e) => {
              el.querySelector('#revealBox').hidden = false;
              e.target.hidden = true;
            });
          },
        },
        {
          title: 'Quick check',
          html: `
            <p>A bag has red and blue marbles in a ratio of ${strong('1 : 4')}. There are ${strong('25 marbles')}. How many are blue?</p>
            <div id="check"></div>`,
          mount(el) {
            miniCheck(el, '#check', [
              { label: '5', correct: false, feedback: 'That is one box (25 ÷ 5). Blue has 4 boxes.' },
              { label: '20', correct: true, feedback: 'Yes! 1 + 4 = 5 boxes, 25 ÷ 5 = 5 each, and 4 × 5 = 20 blue.' },
              { label: '100', correct: false, feedback: '25 is the total, not one part. Split it into 5 equal boxes first.' },
            ]);
          },
        },
      ],
    },
    {
      id: 29,
      short: 'Lesson 16',
      navTitle: 'Lesson 16: Solving more ratio problems',
      title: 'Lesson 16: Solving More Ratio Problems',
      blurb: 'Pick the best tool (diagram, double number line, table, or tape diagram) for mixed ratio problems.',
      art: art('🧠'),
      sessionLength: 8,
      types: ['wordEquiv', 'pppWhole', 'sameRate', 'unitPrice', 'tableMissing', 'distance', 'betterDeal', 'colorMix'],
      steps: [
        targets([
          'I can choose which representation (diagram, double number line, table, or tape diagram) to use to solve a ratio problem.',
          'I can solve multi-step ratio problems and explain my reasoning.',
        ]),
        {
          title: 'Choose your tool',
          html: `
            <table class="map-table">
              <thead><tr><th>If the problem…</th><th>Try a…</th></tr></thead>
              <tbody>
                <tr><td>has small numbers you can picture</td><td>discrete diagram</td></tr>
                <tr><td>has values that grow by equal steps</td><td>double number line</td></tr>
                <tr><td>has big or out-of-order numbers, or needs "how much for one"</td><td>table</td></tr>
                <tr><td>gives a ${strong('total')} and a ratio of parts</td><td>tape diagram</td></tr>
              </tbody>
            </table>
            <div class="callout">Always ask: <em>What does each number mean? What am I trying to find?</em> Then label everything.</div>`,
        },
        {
          title: 'A multi-step problem',
          html: `
            <p>${strong('Problem:')} Purple paint uses 3 cups of red for every 5 cups of blue. Mai needs ${strong('24 cups')} of purple paint in all. How many cups of blue?</p>
            <p>This gives a ${strong('total')}, so use a tape diagram: 3 + 5 = 8 boxes. 24 ÷ 8 = 3 cups per box.</p>
            <p>How many cups of blue paint does Mai need?</p>
            <div id="check"></div>`,
          mount(el) {
            miniCheck(el, '#check', [
              { label: '9', correct: false, feedback: 'That is the red paint (3 boxes × 3). Blue has 5 boxes.' },
              { label: '15', correct: true, feedback: 'Yes! 5 boxes × 3 cups = 15 cups of blue (and 9 of red; 9 + 15 = 24 ✓).' },
              { label: '40', correct: false, feedback: '24 is the total. Divide it into 8 boxes first.' },
            ]);
          },
        },
      ],
    },
  ];

  sections.forEach((l) => { l.buildSession = (count) => buildSession(l.types, count); });

  return { SKILLS, GENERATORS, sections, buildSession, parseNumber };
})();
