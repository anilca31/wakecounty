// Question generators for the practice engine.
//
// Every generator returns a question object:
//   { type, skill, lesson, prompt, visual?, format: 'mc' | 'ratio',
//     options? [{ id, html, correct, hint? }], check(input) -> { status, message? },
//     hint, explanation, solution, summary }
// `check` returns status 'correct' | 'incorrect' | 'invalid' (invalid = unreadable input, not an attempt).
const Questions = (() => {
  const { randInt, pick, shuffle, pickTwo, twoCounts, parseRatio } = Util;
  const { ITEMS, ITEM_KEYS } = Diagrams;

  const SKILLS = {
    objects:  'Identify a ratio from a group of objects',
    word:     'Write a ratio from a word description',
    read:     'Read and write ratio notation',
    reverse:  'Reverse a ratio',
    diagram:  'Identify a ratio from a diagram',
    choose:   'Choose the diagram that represents a ratio',
  };

  // Word-problem contexts: [first thing, second thing, sentence template].
  const CONTEXTS = [
    ['cats', 'dogs', (a, b) => `At the animal shelter there are ${a} cats and ${b} dogs.`],
    ['apples', 'oranges', (a, b) => `A fruit bowl holds ${a} apples and ${b} oranges.`],
    ['boys', 'girls', (a, b) => `A soccer team has ${a} boys and ${b} girls.`],
    ['pencils', 'erasers', (a, b) => `Maya's pencil case has ${a} pencils and ${b} erasers.`],
    ['muffins', 'bagels', (a, b) => `A bakery tray has ${a} muffins and ${b} bagels.`],
    ['goldfish', 'turtles', (a, b) => `A pet store tank has ${a} goldfish and ${b} turtles.`],
    ['red cars', 'blue cars', (a, b) => `A parking lot has ${a} red cars and ${b} blue cars.`],
    ['cups of flour', 'cups of sugar', (a, b) => `A recipe uses ${a} cups of flour and ${b} cups of sugar.`],
    ['novels', 'comic books', (a, b) => `A shelf holds ${a} novels and ${b} comic books.`],
    ['sunny days', 'rainy days', (a, b) => `Last month had ${a} sunny days and ${b} rainy days.`],
  ];

  const r = (x, y) => `${x} : ${y}`;
  const strong = (s) => `<strong>${s}</strong>`;
  const count = (n, item) => `${n} ${n === 1 ? item.single : item.name}`;
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Shared checker for typed ratio answers. Accepts equivalent ratios (e.g. 2:3 for 4:6).
  function ratioChecker(x, y, firstName, secondName) {
    return (input) => {
      const parsed = parseRatio(input);
      if (!parsed) {
        return { status: 'invalid', message: 'Type your answer as two numbers, like <strong>3:2</strong> or <strong>3 to 2</strong>.' };
      }
      const [p, q] = parsed;
      if (p === x && q === y) return { status: 'correct' };
      if (p * y === q * x && p > 0 && q > 0) {
        return { status: 'correct', message: `${r(p, q)} is equivalent to ${r(x, y)}, so that works too!` };
      }
      if (p === y && q === x) {
        return { status: 'incorrect', message: `Careful with the order! The question asks for ${firstName} <em>first</em>, then ${secondName}.` };
      }
      return { status: 'incorrect' };
    };
  }

  function mcChecker(options) {
    return (id) => {
      const opt = options.find((o) => o.id === id);
      if (!opt) return { status: 'invalid', message: 'Choose one of the answers.' };
      return opt.correct ? { status: 'correct' } : { status: 'incorrect', message: opt.hint };
    };
  }

  // Shuffles options and assigns ids A, B, C, D; drops duplicate values.
  function finalizeOptions(opts) {
    const seen = new Set();
    const unique = opts.filter((o) => {
      const key = o.key ?? o.html;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return shuffle(unique).map((o, i) => ({ ...o, id: 'ABCD'[i] }));
  }

  // 1. Identify the ratio from a group of objects (typed answer).
  function objects(lesson) {
    const [ka, kb] = pickTwo(ITEM_KEYS);
    const [a, b] = twoCounts(1, 7);
    const order = shuffle([...Array(a).fill('a'), ...Array(b).fill('b')]);
    // Randomly ask for either order so students must read the question.
    const flip = Math.random() < 0.5;
    const [fx, fy, fItem, sItem] = flip ? [b, a, ITEMS[kb], ITEMS[ka]] : [a, b, ITEMS[ka], ITEMS[kb]];
    return {
      type: 'objects', skill: SKILLS.objects, lesson,
      prompt: `Write the ratio of ${strong(fItem.name)} to ${strong(sItem.name)}.`,
      summary: `Ratio of ${fItem.name} to ${sItem.name} (${count(a, ITEMS[ka])}, ${count(b, ITEMS[kb])})`,
      visual: { a, b, itemA: ka, itemB: kb, layout: 'mixed', order },
      format: 'ratio',
      check: ratioChecker(fx, fy, fItem.name, sItem.name),
      hint: `Count the ${fItem.name} first. Then count the ${sItem.name}. Write the numbers in that order.`,
      explanation: `There are ${fx} ${fItem.name} and ${fy} ${sItem.name}, so the ratio of ${fItem.name} to ${sItem.name} is ${strong(r(fx, fy))}.`,
      solution: r(fx, fy),
    };
  }

  // 2. Write a ratio from a word description (typed answer).
  function word(lesson) {
    const [nameA, nameB, sentence] = pick(CONTEXTS);
    const [a, b] = twoCounts(2, 9);
    const flip = Math.random() < 0.5;
    const [fx, fy, fName, sName] = flip ? [b, a, nameB, nameA] : [a, b, nameA, nameB];
    return {
      type: 'word', skill: SKILLS.word, lesson,
      prompt: `${sentence(a, b)}<br>Write the ratio of ${strong(fName)} to ${strong(sName)}.`,
      summary: `${sentence(a, b)} Ratio of ${fName} to ${sName}.`,
      format: 'ratio',
      check: ratioChecker(fx, fy, fName, sName),
      hint: `Find the number of ${fName} and the number of ${sName} in the sentence. The ${fName} come first.`,
      explanation: `The question names ${fName} first, so their number (${fx}) goes first: ${strong(r(fx, fy))}.`,
      solution: r(fx, fy),
    };
  }

  // 3. Read a ratio (multiple choice, three variants).
  function read(lesson) {
    const [a, b] = twoCounts(2, 9);
    const variant = randInt(0, 2);

    if (variant === 0) {
      const options = finalizeOptions([
        { html: `${a} to ${b}`, correct: true },
        { html: `${b} to ${a}`, hint: 'Read the numbers in the same order they are written, left to right.' },
        { html: `${a} out of ${b}`, hint: '"Out of" describes a part of a whole. A ratio compares two quantities: we say "to".' },
        { html: `${a} out of ${a + b}`, hint: 'A ratio compares the two numbers directly. It does not add them into a total.' },
      ]);
      return {
        type: 'read', skill: SKILLS.read, lesson,
        prompt: `How do you read the ratio ${strong(r(a, b))}?`,
        summary: `How do you read ${r(a, b)}?`,
        format: 'mc', options, check: mcChecker(options),
        hint: 'The colon ( : ) is read as the word "to".',
        explanation: `The colon is read as "to", so ${r(a, b)} is read as ${strong(`${a} to ${b}`)}.`,
        solution: `${a} to ${b}`,
      };
    }

    const [nameA, nameB] = pick(CONTEXTS);
    if (variant === 1) {
      const options = finalizeOptions([
        { html: r(a, b), correct: true },
        { html: r(b, a), hint: `Order matters: ${nameA} are mentioned first, so their number comes first.` },
        { html: r(a, a + b), hint: `That compares ${nameA} to the total. The question compares ${nameA} to ${nameB}.` },
        { html: r(a + b, b), hint: `That compares the total to ${nameB}. Use the two given numbers.` },
      ]);
      return {
        type: 'read', skill: SKILLS.read, lesson,
        prompt: `"For every ${a} ${nameA}, there are ${b} ${nameB}."<br>Which ratio compares ${strong(nameA)} to ${strong(nameB)}?`,
        summary: `For every ${a} ${nameA} there are ${b} ${nameB}: ratio of ${nameA} to ${nameB}.`,
        format: 'mc', options, check: mcChecker(options),
        hint: '"For every A, there are B" means the ratio A : B.',
        explanation: `"For every ${a} ${nameA}, there are ${b} ${nameB}" is the ratio ${strong(r(a, b))}.`,
        solution: r(a, b),
      };
    }

    // variant 2: which is NOT a way to write a to b
    const options = finalizeOptions([
      { html: r(b, a), correct: true },
      { html: r(a, b), hint: `${r(a, b)} <em>is</em> a correct way to write ${a} to ${b}. Look for the one that isn't.` },
      { html: `${a}/${b}`, hint: `${a}/${b} <em>is</em> a correct way to write ${a} to ${b}. Look for the one that isn't.` },
      { html: `${a} to ${b}`, hint: 'That is the ratio written in words, so it is correct. Look for the one that isn\'t.' },
    ]);
    return {
      type: 'read', skill: SKILLS.read, lesson,
      prompt: `Which of these is ${strong('NOT')} a way to write the ratio ${strong(`${a} to ${b}`)}?`,
      summary: `Which is NOT a way to write ${a} to ${b}?`,
      format: 'mc', options, check: mcChecker(options),
      hint: `A ratio can be written three ways: ${a} to ${b}, ${a} : ${b}, and ${a}/${b}. Check the order of the numbers in each.`,
      explanation: `${strong(r(b, a))} has the numbers in the wrong order, so it means ${b} to ${a}, a different ratio.`,
      solution: r(b, a),
    };
  }

  // 4. Reverse a ratio (typed answer).
  function reverse(lesson) {
    const [nameA, nameB] = pick(CONTEXTS);
    const [a, b] = twoCounts(2, 9);
    return {
      type: 'reverse', skill: SKILLS.reverse, lesson,
      prompt: `The ratio of ${nameA} to ${nameB} is ${strong(r(a, b))}.<br>What is the ratio of ${strong(nameB)} to ${strong(nameA)}?`,
      summary: `${cap(nameA)} to ${nameB} is ${r(a, b)}. What is ${nameB} to ${nameA}?`,
      format: 'ratio',
      check: (input) => {
        const res = ratioChecker(b, a, nameB, nameA)(input);
        // Equivalent-ratio acceptance is fine, but repeating the original ratio is the key mistake here.
        if (res.status === 'incorrect' && parseRatio(input)?.join() === `${a},${b}`) {
          return { status: 'incorrect', message: `That's the original ratio. Now ${nameB} come first, so the numbers swap places.` };
        }
        return res;
      },
      hint: `There are ${a} ${nameA} for every ${b} ${nameB}. Now put the ${nameB} first.`,
      explanation: `Reversing a ratio swaps the order of the numbers: ${nameA} to ${nameB} is ${r(a, b)}, so ${nameB} to ${nameA} is ${strong(r(b, a))}.`,
      solution: r(b, a),
    };
  }

  // 5. Identify a ratio from a diagram (multiple choice).
  function diagram(lesson) {
    const [ka, kb] = pickTwo(ITEM_KEYS);
    const [a, b] = twoCounts(1, 8);
    const A = ITEMS[ka], B = ITEMS[kb];
    const options = finalizeOptions([
      { html: r(a, b), correct: true },
      { html: r(b, a), hint: `Order matters. The question asks for ${A.name} first.` },
      { html: r(a, a + b), hint: `That compares ${A.name} to <em>all</em> the shapes. Compare ${A.name} to ${B.name} only.` },
      { html: r(a + 1, b), hint: `Count the ${A.name} again carefully. Try touching each one as you count.` },
    ]);
    return {
      type: 'diagram', skill: SKILLS.diagram, lesson,
      prompt: `What is the ratio of ${strong(A.name)} to ${strong(B.name)} in this diagram?`,
      summary: `Diagram: ratio of ${A.name} to ${B.name} (${count(a, A)}, ${count(b, B)})`,
      visual: { a, b, itemA: ka, itemB: kb, layout: 'grouped' },
      format: 'mc', options, check: mcChecker(options),
      hint: `Count each group separately. How many ${A.name}? How many ${B.name}?`,
      explanation: `The diagram shows ${a} ${A.name} and ${b} ${B.name}, so the ratio is ${strong(r(a, b))}.`,
      solution: r(a, b),
    };
  }

  // 6. Choose the diagram that represents a ratio (multiple choice with diagram options).
  function choose(lesson) {
    const [ka, kb] = pickTwo(ITEM_KEYS);
    const [a, b] = twoCounts(1, 6);
    const A = ITEMS[ka], B = ITEMS[kb];
    const mk = (x, y, extra) => ({
      key: `${x}:${y}`,
      html: Diagrams.render({ a: x, b: y, itemA: ka, itemB: kb, layout: 'grouped' }),
      ...extra,
    });
    const options = finalizeOptions([
      mk(a, b, { correct: true }),
      mk(b, a, { hint: `That diagram has ${b} ${A.name} and ${a} ${B.name}. The numbers are reversed.` }),
      mk(a, b + 1, { hint: `Count the ${B.name} in that diagram. There should be exactly ${b}.` }),
      mk(a + 1, b, { hint: `Count the ${A.name} in that diagram. There should be exactly ${a}.` }),
    ]);
    return {
      type: 'choose', skill: SKILLS.choose, lesson,
      prompt: `Which diagram shows a ratio of ${strong(A.name)} to ${strong(B.name)} of ${strong(r(a, b))}?`,
      summary: `Choose the diagram for ${A.name} to ${B.name} = ${r(a, b)}`,
      format: 'mc', options, check: mcChecker(options), wideOptions: true,
      hint: `Look for a diagram with exactly ${a} ${A.name} and exactly ${b} ${B.name}.`,
      explanation: `The ratio ${r(a, b)} means ${a} ${A.name} for every ${b} ${B.name}. The correct diagram shows exactly that.`,
      solution: `the diagram with ${a} ${A.name} and ${b} ${B.name}`,
      solutionVisual: { a, b, itemA: ka, itemB: kb, layout: 'grouped' },
    };
  }

  const GENERATORS = { objects, word, read, reverse, diagram, choose };

  const LESSON_TYPES = {
    1: ['objects', 'word', 'read', 'reverse'],
    2: ['objects', 'diagram', 'choose'],
  };

  // Builds a session that covers every question type in the lesson before repeating any.
  function buildSession(lesson, count = 5) {
    const types = LESSON_TYPES[lesson];
    const seq = [];
    while (seq.length < count) seq.push(...shuffle(types));
    const seen = new Set();
    return seq.slice(0, count).map((type) => {
      let q;
      let tries = 0;
      do {
        q = GENERATORS[type](lesson);
        tries++;
      } while (seen.has(q.summary) && tries < 20);
      seen.add(q.summary);
      return q;
    });
  }

  return { SKILLS, GENERATORS, LESSON_TYPES, buildSession };
})();
