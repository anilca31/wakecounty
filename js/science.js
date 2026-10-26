// Earth science lessons use the shared study, practice, and saved-progress flow.
const Science = (() => {
  const BANK = [
    {
      skill: 'Wave basics', prompt: 'What are P waves and S waves?',
      options: [['Seismic body waves that travel through Earth’s interior'],
        ['Ocean waves caused by wind', 'Seismic waves carry energy from an earthquake through Earth.'],
        ['Only waves that travel along Earth’s surface', 'Surface waves are a different group; P and S are body waves.'],
        ['Pieces of rock that travel from an earthquake to a station', 'Wave energy travels; particles vibrate around their positions.']],
      explanation: 'Earthquakes release energy as seismic waves. P and S waves are body waves, meaning they can travel through Earth’s interior.',
    },
    {
      skill: 'Arrival order', prompt: 'What does the P in P wave mean?',
      options: [['Primary: it is the first seismic wave to arrive'],
        ['Pressure-free: it does not compress material', 'P waves compress and stretch material.'],
        ['Perpendicular: particles move across its travel direction', 'Perpendicular particle motion describes S waves.'],
        ['Permanent: the ground never returns', 'Particles vibrate rather than permanently traveling with the wave.']],
      explanation: 'P means primary. P waves travel faster than S waves through the same material and arrive first at a recording station.',
    },
    {
      skill: 'Arrival order', prompt: 'What does the S in S wave mean?',
      options: [['Secondary: it arrives after the P wave'],
        ['Solid-proof: it cannot move through solids', 'S waves can travel through solids.'],
        ['Surface: it only moves along Earth’s surface', 'S waves are body waves, not surface waves.'],
        ['Speediest: it always arrives first', 'P waves are faster and arrive before S waves.']],
      explanation: 'S means secondary. An S wave travels more slowly than a P wave through the same material, so it arrives later.',
    },
    {
      skill: 'Particle motion', prompt: 'How do particles move as a P wave passes?',
      options: [['Back and forth parallel to the wave’s travel direction'],
        ['Only perpendicular to the wave’s travel direction', 'Perpendicular motion describes an S wave.'],
        ['They travel all the way from the earthquake to the station', 'The disturbance travels; the particles vibrate locally.'],
        ['They do not move at all', 'The passing wave causes particles to vibrate.']],
      explanation: 'P waves are longitudinal or compressional waves. Particles vibrate parallel to the wave’s direction, creating compressions and expansions.',
    },
    {
      skill: 'Particle motion', prompt: 'How do particles move as an S wave passes?',
      options: [['Perpendicular to the direction the wave travels'],
        ['Only parallel to the direction the wave travels', 'Parallel compression describes a P wave.'],
        ['They stay still while no energy moves', 'S waves carry energy and cause particle motion.'],
        ['They follow the wave from the source to the station', 'Particles move locally; they do not travel along with the wave.']],
      explanation: 'S waves are transverse or shear waves. Particle motion is perpendicular to wave travel; it can be side-to-side or up-and-down depending on orientation.',
    },
    {
      skill: 'Particle motion', prompt: 'A spring is pushed and pulled along its length, producing crowded and spread-out coils. Which seismic wave is this modeling?',
      options: [['A P wave'],
        ['An S wave', 'An S-wave model moves material perpendicular to wave travel.'],
        ['A surface wave only', 'This compressional model represents a body wave.'],
        ['No wave, because the coils must travel to the far end', 'The disturbance can travel even when each coil only vibrates locally.']],
      explanation: 'Crowded coils model compression and spread-out coils model expansion. Both happen along the travel direction, like a P wave.',
    },
    {
      skill: 'Particle motion', prompt: 'A rope’s disturbance travels to the right while a marked point moves up and down. Which seismic wave does this model?',
      options: [['An S wave'],
        ['A P wave', 'A P-wave model moves particles parallel to travel, not across it.'],
        ['Both waves have exactly this particle motion', 'P and S waves differ in the direction particles vibrate.'],
        ['It cannot be a wave because the marked point stays in one area', 'Waves transfer energy while particles vibrate locally.']],
      explanation: 'The motion is perpendicular to wave travel. This transverse motion models an S wave, even though a rope is only an analogy for rock.',
    },
    {
      skill: 'Materials & Earth’s layers', prompt: 'Which materials can P waves travel through?',
      options: [['Solids, liquids, and gases'],
        ['Only solids', 'P waves also travel through fluids.'],
        ['Only liquids', 'P waves can travel through solids as well.'],
        ['Only empty space', 'Seismic waves need material; they cannot travel through a vacuum.']],
      explanation: 'P waves compress material and can pass through solids, liquids, and gases. In Earth, they can travel through both solid layers and the liquid outer core.',
    },
    {
      skill: 'Materials & Earth’s layers', prompt: 'Which material can carry S waves?',
      options: [['Solid rock'],
        ['Liquid water', 'Liquids do not sustain the shear needed for S-wave propagation.'],
        ['A gas such as air', 'Gases do not sustain shear like a solid.'],
        ['A vacuum', 'A vacuum has no material to carry seismic waves.']],
      explanation: 'S waves require a material that resists shear. Solids do; liquids and gases do not support S-wave propagation.',
    },
    {
      skill: 'Materials & Earth’s layers', prompt: 'What happens to a direct S wave that reaches Earth’s liquid outer core?',
      options: [['It cannot propagate through the outer core as an S wave'],
        ['It speeds up and remains an S wave through the liquid', 'Liquid cannot carry S-wave shear motion.'],
        ['It proves the outer core is empty space', 'The outer core is liquid, not empty.'],
        ['It means P waves also cannot pass through liquid', 'P waves can pass through liquids, unlike S waves.']],
      explanation: 'Direct S waves do not pass through the liquid outer core. Together with other seismic evidence, this helps scientists infer that the outer core is liquid.',
    },
    {
      skill: 'Materials & Earth’s layers', prompt: 'Why can scientists use earthquakes to learn about Earth’s interior?',
      options: [['Wave travel, speed changes, and missing arrivals provide evidence about materials inside Earth'],
        ['Every seismic wave travels straight through every layer at one fixed speed', 'Wave paths and speeds change with the material.'],
        ['S waves pass through liquids but P waves never do', 'The material rule is the other way around: S waves cannot pass through liquids.'],
        ['An earthquake brings core material directly to every station', 'Stations record wave motion, not samples delivered from the core.']],
      explanation: 'Different wave behaviors reveal properties of Earth’s layers. P waves bend and change speed at boundaries; the absence of direct S waves through the outer core is evidence for liquid there.',
    },
    {
      skill: 'Arrival order', prompt: 'A station records a P-wave arrival at 10:02:15 and an S-wave arrival at 10:02:45. What is the S–P interval?',
      options: [['30 seconds'],
        ['15 seconds', 'Subtract the P arrival time from the S arrival time.'],
        ['45 seconds', 'That is a clock reading, not the difference between arrivals.'],
        ['60 seconds', 'Both arrivals occur within the same minute.']],
      explanation: '10:02:45 minus 10:02:15 is 30 seconds. This is the S–P interval, the gap between the two arrivals.',
    },
    {
      skill: 'Arrival order', prompt: 'For the same earthquake and comparable travel paths, Station A has a 10-second S–P gap and Station B has a 40-second gap. Which is generally farther away?',
      options: [['Station B'],
        ['Station A', 'P and S arrivals generally spread farther apart as distance increases.'],
        ['They must be the same distance away', 'Different gaps generally indicate different distances for comparable paths.'],
        ['A larger gap means the station caused a stronger earthquake', 'The gap is used to estimate distance, not to determine which station caused a quake.']],
      explanation: 'Because P waves are faster, they gain a larger lead over S waves with distance. A travel-time curve converts an S–P interval into an estimated distance.',
    },
    {
      skill: 'Arrival order', prompt: 'Can one station’s S–P interval alone tell you the exact direction to an earthquake’s epicenter?',
      options: [['No. It estimates distance, not a unique direction'],
        ['Yes. It always points north', 'An arrival-time difference does not provide a compass direction.'],
        ['Yes. It gives the epicenter’s exact latitude and longitude', 'Many possible locations can share the same distance from a station.'],
        ['No. It only measures how hot the core is', 'The S–P interval is used with travel-time data to estimate distance.']],
      explanation: 'One distance can be drawn as a circle around a station. In the classroom locating method, distances from at least three stations help identify an epicenter near the circle intersections.',
    },
    {
      skill: 'Wave basics', prompt: 'Which statement correctly compares P and S waves?',
      options: [['Both carry energy through Earth; P waves compress material and S waves shear it'],
        ['S waves are surface waves because S means surface', 'S means secondary; S waves are body waves.'],
        ['P waves pass only through solids and S waves pass through liquids', 'P waves can pass through liquids; S waves cannot.'],
        ['Both move every rock particle all the way to the recording station', 'Energy travels, while particles vibrate around their positions.']],
      explanation: 'Both are seismic body waves. P waves are faster compressional waves; S waves are slower shear waves that travel through solids only.',
    },
  ];

  function motionDiagram(kind) {
    const isP = kind === 'P';
    const particles = Array.from({ length: 18 }, (_, index) => {
      const x = isP ? 45 + index * 26 + Math.sin(index * 1.2) * 9 : 45 + index * 26;
      const y = isP ? 115 : 115 + Math.sin(index * .65) * 25;
      return `<circle cx="${x}" cy="${y}" r="5" fill="${isP ? '#6fdcc4' : '#f5c35b'}"/>`;
    }).join('');
    return `<svg class="diagram" viewBox="0 0 550 200" role="img" aria-label="${kind} wave schematic: energy travels right; particles vibrate ${isP ? 'parallel, left and right' : 'perpendicular, up and down'}">
      <g fill="currentColor" font-size="16"><text x="25" y="25">${kind} wave: ${isP ? 'push–pull (compression)' : 'shear (transverse)'}</text>
      <text x="25" y="60">Wave travels right</text><text x="25" y="185">Particles vibrate ${isP ? 'parallel' : 'perpendicular'} to travel</text></g>
      <path d="M215 55H500M490 48L500 55 490 62" fill="none" stroke="currentColor" stroke-width="2"/>
      ${particles}
      <path d="${isP ? 'M225 145H285M233 139L225 145 233 151M277 139L285 145 277 151' : 'M260 85V145M254 93L260 85 266 93M254 137L260 145 266 137'}" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`;
  }

  function buildSession(count) {
    if (!Number.isInteger(count) || count < 1 || count > BANK.length) {
      throw new Error('Seismic-wave practice count must be between 1 and the question-bank size.');
    }
    const skills = [...new Set(BANK.map((item) => item.skill))];
    const pools = Util.shuffle(skills).map((skill) => Util.shuffle(BANK.filter((item) => item.skill === skill)));
    const selected = [];
    while (selected.length < count) {
      for (const pool of pools) {
        if (selected.length === count) break;
        if (pool.length) selected.push(pool.pop());
      }
    }
    return Util.shuffle(selected).map((item) => {
      const options = Util.shuffle(item.options.map(([html, hint], index) => ({
        html, hint, correct: index === 0,
      }))).map((option, index) => ({ ...option, id: 'ABCD'[index] }));
      return {
        type: item.skill, skill: item.skill, prompt: item.prompt, summary: item.prompt,
        format: 'mc', textOptions: true, options, solution: item.options[0][0],
        hint: 'Compare speed, particle motion, and the materials each wave can pass through.',
        explanation: item.explanation,
        check(id) {
          const option = options.find((entry) => entry.id === id);
          if (!option) return { status: 'invalid', message: 'Choose one of the answers.' };
          return option.correct ? { status: 'correct' } : { status: 'incorrect', message: option.hint };
        },
      };
    });
  }

  const lessons = [{
    id: 70, short: 'P waves & S waves', title: 'Earthquake Waves: P Waves & S Waves',
    blurb: 'Compare seismic-wave speed, particle motion, and travel through Earth’s layers, then try a 10-question practice round.',
    art: '<span class="lesson-emoji">🌍〰️</span>', sessionLength: 10,
    steps: [
      {
        title: 'Learning targets',
        html: `<p>Earthquakes release energy that travels as <strong>seismic waves</strong>. P waves and S waves are <strong>body waves</strong>: they travel through Earth’s interior. Surface waves are a different group.</p>
          <ul class="checklist targets"><li>I can explain why P waves arrive before S waves.</li>
          <li>I can compare particle motion with wave travel.</li><li>I can identify which waves pass through solids and liquids.</li>
          <li>I can explain what wave arrivals reveal about an earthquake and Earth’s interior.</li></ul>`,
      },
      {
        title: 'P waves: primary, push–pull',
        html: `${motionDiagram('P')}<p><strong>P = primary</strong>: P waves arrive first because they travel faster than S waves through the same material. They are <strong>longitudinal (compressional)</strong> waves.</p>
          <p>As energy travels forward, particles vibrate back and forth <strong>parallel</strong> to the travel direction. Material is squeezed together and spread apart.</p>
          <p>P waves can travel through <strong>solids, liquids, and gases</strong>. In Earth, that includes the liquid outer core.</p>
          <div class="callout"><strong>Memory tip:</strong> P = Primary, Push–pull, Parallel. A spring pushed and pulled along its length is a useful model.</div>`,
      },
      {
        title: 'S waves: secondary, shear',
        html: `${motionDiagram('S')}<p><strong>S = secondary</strong>: S waves arrive after P waves. They are <strong>transverse (shear)</strong> waves.</p>
          <p>Particles vibrate <strong>perpendicular</strong> to the direction of wave travel. If a wave moves right, the motion could be up and down or side to side.</p>
          <p>S waves travel through <strong>solids only</strong>, not liquids or gases, because fluids cannot sustain the shear needed to carry them.</p>
          <div class="callout"><strong>Memory tip:</strong> S = Secondary, Shear, Solids only. Shaking a rope across its length models transverse motion. S does <em>not</em> mean surface wave.</div>`,
      },
      {
        title: 'Compare and check',
        html: `<h3>P waves versus S waves</h3>
          <p>Earthquakes release energy as seismic waves. P and S waves are body waves: they travel through Earth’s interior, rather than only along its surface.</p>
          <div class="table-scroll"><table class="map-table"><thead><tr><th scope="col">Property</th><th scope="col">P waves</th><th scope="col">S waves</th></tr></thead>
          <tbody><tr><th scope="row">Name</th><td>Primary</td><td>Secondary</td></tr>
          <tr><th scope="row">Relative speed</th><td>Faster; arrive first</td><td>Slower; arrive second</td></tr>
          <tr><th scope="row">Wave type</th><td>Longitudinal / compressional</td><td>Transverse / shear</td></tr>
          <tr><th scope="row">Particle motion</th><td>Back and forth, parallel to travel</td><td>Perpendicular to travel</td></tr>
          <tr><th scope="row">Materials</th><td>Solids, liquids, gases</td><td>Solids; not liquids or gases</td></tr>
          <tr><th scope="row">Typical shaking</th><td>Squeezing and stretching</td><td>Shearing; side-to-side or up-and-down motion</td></tr>
          <tr><th scope="row">Memory aid</th><td>P = Primary, Push–pull, Parallel</td><td>S = Secondary, Shear, Solids only</td></tr></tbody></table></div>
          <p><strong>Key differences:</strong> Compare particle motion, arrival order, and whether the wave can pass through liquids.</p>
          <p class="muted small">Learn more: <a href="https://pnsn.org/education/seismology/earthquake-waves">Pacific Northwest Seismic Network: Earthquake Waves</a>.</p>
          <div class="callout"><strong>Watch the wording:</strong> Energy moves through the material, but the particles vibrate locally. They do not ride the wave all the way to a recording station. Actual speeds vary with material, so there is no single speed for all P or S waves.</div>
          <details class="qa"><summary>An earthquake wave travels through solid rock but cannot pass through a liquid layer. Is it a P wave or an S wave?</summary><div class="qa-answer"><strong>An S wave.</strong> S waves require a material that supports shear motion; liquids do not transmit S waves. P waves can pass through liquids.</div></details>
          <p>A seismic wave travels right while particles move up and down. Which wave is it?</p><div id="waveCheck"></div>`,
        mount(el) {
          Lessons.miniCheck(el, '#waveCheck', [
            { label: 'P wave', correct: false, feedback: 'P-wave motion is parallel to travel. Here the particle motion is across it.' },
            { label: 'S wave', correct: true, feedback: 'Yes! Up–down motion is perpendicular to rightward travel, so this models an S wave.' },
          ]);
        },
      },
      {
        title: 'Reading Earth’s clues',
        html: `<h3>Earth’s interior</h3><p>Direct S waves cannot pass through the <strong>liquid outer core</strong>. This is one important piece of evidence that the outer core is liquid. P waves can pass through it, but change speed and bend as they cross boundaries. Scientists combine many recordings to infer Earth’s layers.</p>
          <h3>Seismograms and the S–P interval</h3><p>A <strong>seismograph</strong> records ground motion; its recording is a <strong>seismogram</strong>. The gap between P and S arrivals is the <strong>S–P interval</strong>. For the same earthquake and comparable travel paths, a larger gap generally means a more distant station.</p>
          <p><strong>Example:</strong> P arrives at 10:02:15 and S arrives at 10:02:45. The S–P interval is <strong>30 seconds</strong>. Use a travel-time curve to estimate distance; the time gap alone is not a distance in kilometers.</p>
          <p>One station’s distance does not give a unique direction. In the classroom method, circles drawn around at least three stations help locate the <strong>epicenter</strong>, the point on Earth’s surface above the earthquake’s starting point (the <strong>focus</strong>).</p>
          <div class="callout"><strong>Study tip:</strong> Keep three questions separate: “Which arrived first?” = P. “Which passes through liquids?” = P. “Which has perpendicular particle motion?” = S.</div>`,
      },
      {
        title: 'Quick recall before practice',
        html: `<p>Answer first, then open a model explanation.</p><div class="qa-list">
          <details class="qa"><summary>Why does the P wave arrive first?</summary><div class="qa-answer">P waves travel faster than S waves through the same material, so P arrivals are recorded first.</div></details>
          <details class="qa"><summary>How can I tell parallel from perpendicular?</summary><div class="qa-answer">Compare particle motion to the direction of wave travel. Along the same line = parallel (P); across it at right angles = perpendicular (S).</div></details>
          <details class="qa"><summary>Why don’t direct S waves pass through the outer core?</summary><div class="qa-answer">The outer core is liquid, and liquids cannot sustain the shear needed for S waves. This behavior provides evidence about Earth’s interior.</div></details>
          <details class="qa"><summary>Does a larger S–P interval mean a stronger earthquake?</summary><div class="qa-answer">No. The interval is used with travel-time data to estimate distance. It is not a direct measure of earthquake strength.</div></details></div>`,
      },
    ],
    buildSession,
  }];
  return { BANK, lessons, buildSession, motionDiagram };
})();
