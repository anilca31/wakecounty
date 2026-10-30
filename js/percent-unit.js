// Maths Unit 3: percent and fraction conversions, practice, and simplification.
const PercentUnit = (() => {
  const PERCENTS = [4, 5, 8, 10, 12, 13, 15, 18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50, 60, 66, 70, 72, 75, 80, 85, 90, 95, 96];
  const FRACTIONS = [
    [2, 5], [9, 10], [3, 25], [1, 50], [3, 5], [7, 10], [7, 20], [17, 20],
    [16, 25], [23, 50], [1, 4], [3, 4], [9, 100], [67, 100], [7, 100],
    [11, 20], [13, 25], [19, 50], [21, 25], [49, 50], [1, 20], [7, 25],
  ];

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const reduce = (n, d) => {
    const divisor = gcd(Math.abs(n), Math.abs(d));
    return [n / divisor, d / divisor];
  };
  const fractionText = ([n, d]) => d === 1 ? String(n) : `${n}/${d}`;
  const fractionKey = ([n, d]) => {
    const [a, b] = reduce(n, d);
    return `${a}/${b}`;
  };
  const percentText = (value) => `${Number.isInteger(value) ? value : Number(value.toFixed(2))}%`;

  function makeQuestion(skill, prompt, answer, choices, explanation, hint) {
    const seen = new Set();
    const options = Util.shuffle([
      { html: answer, correct: true },
      ...choices.map(([html, message]) => ({ html, hint: message })),
    ].filter((option) => {
      if (seen.has(option.html)) return false;
      seen.add(option.html);
      return true;
    })).map((option, index) => ({ ...option, id: 'ABCD'[index] }));
    if (options.length !== 4) throw new Error(`Percent question needs four distinct choices: ${prompt}`);
    return {
      type: skill,
      skill: skill === 'percentToFraction' ? 'Percent → fraction' : 'Fraction → percent',
      prompt,
      summary: prompt.replace(/<[^>]+>/g, ''),
      format: 'mc',
      textOptions: true,
      options,
      solution: answer,
      hint,
      explanation,
      check(id) {
        const selected = options.find((option) => option.id === id);
        if (!selected) return { status: 'invalid', message: 'Choose one of the answers.' };
        return selected.correct
          ? { status: 'correct' }
          : { status: 'incorrect', message: selected.hint || hint };
      },
    };
  }

  const percentQuestions = PERCENTS.map((percent) => {
    const reduced = reduce(percent, 100);
    const answer = fractionText(reduced);
    const distractors = [
      [fractionText(reduce(percent, 10)), 'Write a percent over 100 first. For example, 20% = 20/100, not 20/10.'],
      [fractionText(reduce(percent, 1000)), 'Check the place value: percent means “out of 100,” not out of 1,000.'],
      [fractionText(reduce(percent + 1, 100)), 'Make sure you use the given percent as the numerator over 100.'],
      [fractionText(reduce(100 - percent, 100)), 'That is the fraction for the complement percent. Use the percent in the question.'],
      [`${percent}/100`, 'You have written the percent over 100. Now reduce the fraction to lowest terms.'],
      [fractionText(reduce(percent + 3, 100)), 'Check the numerator: it should be the given percent before simplifying.'],
    ];
    const seen = new Set([fractionKey(reduced)]);
    const choices = [];
    for (const [text, message] of distractors) {
      const key = text.includes('/') ? fractionKey(text.split('/').map(Number)) : `${text}/1`;
      if (seen.has(key)) continue;
      seen.add(key);
      choices.push([text, message]);
      if (choices.length === 3) break;
    }
    return makeQuestion(
      'percentToFraction',
      `Write <strong>${percent}%</strong> as a fraction in lowest terms.`,
      answer,
      choices,
      `${percent}% = ${percent}/100. Divide the numerator and denominator by their greatest common factor, ${gcd(percent, 100)}, to get ${answer}.`,
      'Write the percent as a fraction over 100, then divide the numerator and denominator by their greatest common factor.',
    );
  });

  const fractionQuestions = FRACTIONS.map(([numerator, denominator]) => {
    const value = (numerator / denominator) * 100;
    const answer = percentText(value);
    const choices = [
      [percentText((numerator / denominator) * 10), 'Check whether you multiplied the fraction by 100. Multiplying by 10 shifts only one place.'],
      [percentText(numerator / denominator), 'This is the decimal value of the fraction. Multiply it by 100 to write a percent.'],
      [percentText(100 - value), 'That is the percent not included in the fraction. Convert the fraction itself.'],
      [percentText(value + 1), 'Recheck the equivalent fraction or decimal before converting to a percent.'],
      [percentText(value / 10), 'The percent is 100 times the decimal, not one tenth of it.'],
    ];
    const used = new Set([answer]);
    const uniqueChoices = choices.filter(([text]) => {
      if (used.has(text)) return false;
      used.add(text);
      return true;
    }).slice(0, 3);
    return makeQuestion(
      'fractionToPercent',
      `Write <strong>${numerator}/${denominator}</strong> as a percent.`,
      answer,
      uniqueChoices,
      `${numerator} ÷ ${denominator} = ${Number((numerator / denominator).toFixed(4))}. Multiply by 100: ${answer}.`,
      'Divide the numerator by the denominator to get a decimal, then multiply by 100 and add the percent sign.',
    );
  });

  const BANK = [...percentQuestions, ...fractionQuestions];
  const SKILLS = ['percentToFraction', 'fractionToPercent'];

  function buildSession(skills, count) {
    const uniqueSkills = [...new Set(skills)];
    const available = uniqueSkills.map((skill) => BANK.filter((question) => question.type === skill));
    if (!Number.isInteger(count) || count < 1 || available.some((pool) => !pool.length) ||
        available.reduce((total, pool) => total + pool.length, 0) < count) {
      throw new Error('Percent practice requires known skills and a count within the available question bank.');
    }
    const selected = [];
    const pools = available.map((pool) => Util.shuffle(pool));
    while (selected.length < count) {
      for (const pool of pools) {
        if (selected.length === count) break;
        if (pool.length) selected.push(pool.pop());
      }
    }
    return Util.shuffle(selected);
  }

  const sections = [
    {
      id: 30,
      short: 'Percents to fractions',
      navTitle: 'Write percents as fractions',
      title: 'Write Percents as Fractions in Lowest Terms',
      blurb: 'Turn a percent into a fraction over 100, then simplify it using the greatest common factor.',
      art: '<span class="lesson-emoji">💯➗</span>',
      sessionLength: 8,
      types: ['percentToFraction'],
      steps: [
        {
          title: 'Learning targets',
          html: `<p>By the end of this section, you should be able to:</p>
            <ul class="checklist targets"><li>Write a percent as a fraction with denominator 100.</li>
            <li>Reduce the fraction to lowest terms.</li><li>Check that the fraction has the same value as the original percent.</li></ul>`,
        },
        {
          title: 'Percent means “out of 100”',
          html: `<p>The percent sign <strong>%</strong> means “per 100.” To change a percent to a fraction, write the number over 100.</p>
            <p><strong>Example:</strong> 20% = 20/100. Both numbers can be divided by 20, so 20/100 = <strong>1/5</strong>.</p>
            <ol class="language-list"><li>Write the percent as a numerator over 100.</li><li>Find the greatest common factor (GCF) of the numerator and 100.</li><li>Divide both by the GCF.</li></ol>
            <div class="callout"><strong>Example:</strong> 36% = 36/100. The GCF is 4. Divide top and bottom by 4: <strong>9/25</strong>.</div>
            <div class="callout"><strong>Tip:</strong> “Lowest terms” means the numerator and denominator have no common factor greater than 1. Always reduce; 36/100 is equal to 9/25, but it is not simplified.</div>`,
        },
        {
          title: 'Try a quick check',
          html: `<p>Write <strong>45%</strong> as a fraction in lowest terms.</p><div id="percentCheck"></div>`,
          mount(el) {
            Lessons.miniCheck(el, '#percentCheck', [
              { label: '45/100', correct: false, feedback: 'That is the fraction before simplifying. Divide the top and bottom by their GCF, 5.' },
              { label: '9/20', correct: true, feedback: 'Yes! 45% = 45/100. Divide both by 5 to get 9/20.' },
              { label: '20/45', correct: false, feedback: 'Keep the percent as the numerator and 100 as the denominator, then simplify.' },
            ]);
          },
        },
      ],
    },
    {
      id: 31,
      short: 'Fractions to percents',
      navTitle: 'Write fractions as percents',
      title: 'Write Fractions as Percents',
      blurb: 'Use equivalent fractions or division to turn a fraction into a percent.',
      art: '<span class="lesson-emoji">🍕➡️💯</span>',
      sessionLength: 8,
      types: ['fractionToPercent'],
      steps: [
        {
          title: 'Learning targets',
          html: `<p>By the end of this section, you should be able to:</p>
            <ul class="checklist targets"><li>Convert a fraction to an equivalent fraction with denominator 100 when possible.</li>
            <li>Use division and multiplication by 100 to find a percent.</li><li>Include the percent sign and check that your answer is reasonable.</li></ul>`,
        },
        {
          title: 'Make 100 or divide',
          html: `<p><strong>Method 1: Make an equivalent fraction with denominator 100.</strong> If the denominator can be multiplied to make 100, multiply the numerator by the same number.</p>
            <div class="callout"><strong>Example:</strong> 3/5 = 60/100 = <strong>60%</strong>. Multiply both numerator and denominator by 20.</div>
            <p><strong>Method 2: Divide, then multiply by 100.</strong> This works for any fraction.</p>
            <div class="callout"><strong>Example:</strong> 7/20 = 7 ÷ 20 = 0.35. Then 0.35 × 100 = <strong>35%</strong>.</div>
            <div class="callout"><strong>Tip:</strong> A percent is a number out of 100. If the fraction is less than 1, its percent should be less than 100%.</div>`,
        },
        {
          title: 'Try a quick check',
          html: `<p>Write <strong>3/25</strong> as a percent.</p><div id="fractionCheck"></div>`,
          mount(el) {
            Lessons.miniCheck(el, '#fractionCheck', [
              { label: '12%', correct: true, feedback: 'Correct! Multiply the numerator and denominator by 4: 3/25 = 12/100 = 12%.' },
              { label: '0.12%', correct: false, feedback: '0.12 is the decimal. Multiply the decimal by 100 to convert it to a percent.' },
              { label: '75%', correct: false, feedback: 'Divide 3 by 25, then multiply the result by 100.' },
            ]);
          },
        },
      ],
    },
    {
      id: 32,
      short: 'Percent & fraction review',
      navTitle: 'Mixed percent and fraction practice',
      title: 'Percent and Fraction Conversion Review',
      blurb: 'Practice both directions and explain the conversion steps.',
      art: '<span class="lesson-emoji">🔄💯</span>',
      sessionLength: 10,
      types: SKILLS,
      steps: [
        {
          title: 'Learning targets',
          html: `<p>By the end of this section, you should be able to convert in either direction and explain how you know the values are equivalent.</p>
            <ul class="checklist targets"><li>Percent → fraction: put the percent over 100 and simplify.</li>
            <li>Fraction → percent: make an equivalent fraction over 100 or divide and multiply by 100.</li>
            <li>Check that a fraction is in lowest terms and a percent answer has the % sign.</li></ul>`,
        },
        {
          title: 'Choose the right direction',
          html: `<table class="map-table"><thead><tr><th scope="col">Direction</th><th scope="col">Steps</th><th scope="col">Example</th></tr></thead>
            <tbody><tr><th scope="row">Percent → fraction</th><td>Write over 100; divide top and bottom by the GCF.</td><td>25% = 25/100 = 1/4</td></tr>
            <tr><th scope="row">Fraction → percent</th><td>Make denominator 100 or divide and multiply by 100.</td><td>7/20 = 35/100 = 35%</td></tr></tbody></table>
            <div class="callout"><strong>Common mix-ups:</strong> Don’t leave a percent fraction unsimplified. Don’t confuse a decimal with a percent: 0.35 = 35%, not 0.35%.</div>`,
        },
        {
          title: 'Mixed quick check',
          html: `<p>Which pair shows two equivalent values?</p><div id="mixedCheck"></div>`,
          mount(el) {
            Lessons.miniCheck(el, '#mixedCheck', [
              { label: '80% = 4/5', correct: true, feedback: 'Yes! 80/100 simplifies by dividing both numbers by 20, giving 4/5.' },
              { label: '30% = 3/100', correct: false, feedback: 'Write 30% as 30/100, then reduce both numbers by 10.' },
              { label: '1/4 = 25', correct: false, feedback: 'One quarter is 0.25, which is 25%, not 25.' },
            ]);
          },
        },
      ],
    },
  ];

  sections.forEach((section) => { section.buildSession = (count) => buildSession(section.types, count); });
  return { PERCENTS, FRACTIONS, SKILLS, BANK, GENERATORS: { percentToFraction: percentQuestions, fractionToPercent: fractionQuestions }, sections, buildSession };
})();
