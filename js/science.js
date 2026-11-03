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

  const LIGHT_BANK = [
    {
      skill: 'Transparent, translucent & opaque', prompt: 'What does it mean if a material is transparent?',
      options: [['Most light passes through, and you can see objects clearly through it'],
        ['No light passes through it', 'That describes an opaque material.'],
        ['Some light passes through but is scattered', 'That describes a translucent material.'],
        ['It reflects every color of light', 'Transparency describes how light passes through, not which colors are reflected.']],
      explanation: 'A transparent material lets most light pass through with little scattering, so objects on the other side look clear. A clean window is an example.',
    },
    {
      skill: 'Transparent, translucent & opaque', prompt: 'A frosted bathroom window lets light through but blurs the view. How is it classified?',
      options: [['Translucent'],
        ['Transparent', 'A transparent window gives a clear view through it.'],
        ['Opaque', 'An opaque material blocks nearly all light from passing through.'],
        ['Reflective only', 'The key clue is that some light passes through but is scattered.']],
      explanation: 'Translucent materials transmit some light but scatter it, so you see light or blurry shapes rather than a clear image. Frosted glass and wax paper are examples.',
    },
    {
      skill: 'Transparent, translucent & opaque', prompt: 'Which statement best describes an opaque material?',
      options: [['It blocks nearly all light from passing through'],
        ['It lets light pass through clearly', 'That is transparent.'],
        ['It lets light pass through but scatters it', 'That is translucent.'],
        ['It changes every light wave into sound', 'Opaque describes light transmission; it does not mean light becomes sound.']],
      explanation: 'Opaque objects, such as a wooden door or a book, block nearly all the light that reaches them.',
    },
    {
      skill: 'Reflection & absorption', prompt: 'What happens when light is reflected?',
      options: [['It bounces off a surface'],
        ['It passes through the material and disappears', 'Passing through is transmission; absorption is when material takes in light energy.'],
        ['It always bends into a new material', 'Bending as light changes speed in a new medium is refraction.'],
        ['It turns into matter', 'Reflection changes the light’s direction; it does not turn light into matter.']],
      explanation: 'Reflection is light bouncing off a surface. A mirror reflects light toward your eyes, which lets you see an image.',
    },
    {
      skill: 'Reflection & absorption', prompt: 'Why is a white shirt usually cooler than a black shirt on a sunny day?',
      options: [['A white shirt reflects more sunlight, while a black shirt absorbs more light energy'],
        ['White creates cold air around the person', 'The color changes how much light energy is reflected or absorbed.'],
        ['Black reflects all sunlight away', 'Dark surfaces usually absorb more visible light, not less.'],
        ['Light cannot reach white fabric', 'Sunlight reaches both; the fabrics reflect and absorb different amounts.']],
      explanation: 'White fabric reflects much of the visible light that hits it. Black fabric absorbs more of that light energy, which can warm the fabric.',
    },
    {
      skill: 'Reflection & absorption', prompt: 'Which statement correctly compares reflection and absorption?',
      options: [['Reflection sends light away from a surface; absorption transfers light energy to the material'],
        ['Reflection and absorption both mean light passes straight through', 'Passing through is transmission.'],
        ['Absorption bounces light into your eyes', 'Bouncing light away is reflection.'],
        ['Reflection destroys energy', 'Reflection changes the light’s direction; absorption transfers energy into the material.']],
      explanation: 'A surface can reflect some light and absorb some. Absorbed light energy may become thermal energy, warming the material.',
    },
    {
      skill: 'Seeing colors', prompt: 'Under white light, a leaf looks green. Which visible light is it mainly reflecting to your eyes?',
      options: [['Green light'],
        ['Only green light is absorbed', 'The green light is mainly reflected; much of the other visible light is absorbed.'],
        ['All colors equally', 'Reflecting all visible colors about equally would make an object look white.'],
        ['No light', 'Light from the leaf reaches your eyes, allowing you to see its color.']],
      explanation: 'A green object looks green because it reflects more green light toward your eyes and absorbs much of the other visible colors. The exact mix depends on the light source and material.',
    },
    {
      skill: 'Seeing colors', prompt: 'In white light, a red book looks red mostly because it…',
      options: [['Reflects red light and absorbs much of the other visible light'],
        ['Reflects every color equally', 'Reflecting all colors about equally would look white.'],
        ['Absorbs red light and reflects none', 'If little red light reached your eyes, it would not look red.'],
        ['Makes red light appear from nowhere', 'The book reflects light from the source; it does not create the color of light.']],
      explanation: 'We see an object’s color from the visible light it reflects into our eyes. A red book under white light reflects red wavelengths more than many other visible wavelengths.',
    },
    {
      skill: 'Seeing colors', prompt: 'A black object under white light usually looks black because it…',
      options: [['Absorbs most visible light and reflects very little toward your eyes'],
        ['Reflects all visible colors equally', 'Reflecting all visible colors about equally makes an object look white.'],
        ['Lets every color pass through clearly', 'That would describe a transparent material, not why a black object looks black.'],
        ['Reflects only green light', 'Reflecting green light would generally make it look green.']],
      explanation: 'A black object absorbs most of the visible light falling on it and reflects very little to your eyes. Real materials may still reflect a small amount.',
    },
    {
      skill: 'Refraction & rainbows', prompt: 'What is refraction?',
      options: [['A change in a light ray’s direction caused by a change in speed as it enters a different medium'],
        ['Light bouncing from a surface', 'That is reflection.'],
        ['Light being taken in by a material', 'That is absorption.'],
        ['Light splitting into sound waves', 'Refraction changes the path of light; it does not turn it into sound.']],
      explanation: 'Refraction happens when light changes speed as it moves from one medium to another. If it enters at an angle, its direction changes too; it does not bend when it travels straight along the boundary’s normal.',
    },
    {
      skill: 'Refraction & rainbows', prompt: 'Why can a straw look bent where it enters a glass of water?',
      options: [['Light from the straw changes direction as it moves between water and air'],
        ['The straw physically bends when light touches it', 'The apparent bend is an optical effect; the straw can remain straight.'],
        ['Water absorbs every ray from the straw', 'Some light travels from the straw through water and air to your eyes.'],
        ['The glass reflects the straw into a new shape', 'Refraction at the water-air boundary changes the light path and apparent position.']],
      explanation: 'Light from the part under water refracts as it leaves the water and enters the air. Your eyes trace the light back in a straight line, so the submerged part appears shifted.',
    },
    {
      skill: 'Refraction & rainbows', prompt: 'How does a raindrop help make a rainbow?',
      options: [['It refracts sunlight, separates colors, reflects light inside, and refracts light as it leaves'],
        ['It absorbs every color except white', 'A rainbow shows separated colors from white sunlight, not white light alone.'],
        ['It creates new colors from water', 'The colors are already present in sunlight and are separated by the drop.'],
        ['It reflects sunlight once without changing it', 'Refraction and dispersion separate colors; internal reflection also helps send light back out.']],
      explanation: 'Sunlight refracts as it enters a raindrop, and different wavelengths bend by different amounts (dispersion). Light reflects inside the drop and refracts again as it exits, spreading colors toward an observer.',
    },
    {
      skill: 'Electromagnetic spectrum', prompt: 'Which list puts the electromagnetic waves in order from longest wavelength to shortest?',
      options: [['Radio, microwaves, infrared, visible, ultraviolet, X-rays, gamma rays'],
        ['Gamma rays, X-rays, ultraviolet, visible, infrared, microwaves, radio', 'That order goes from shortest wavelength to longest.'],
        ['Visible, radio, X-rays, infrared, gamma rays, microwaves, ultraviolet', 'The spectrum follows a consistent progression in wavelength.'],
        ['Radio, visible, microwaves, ultraviolet, infrared, X-rays, gamma rays', 'Microwaves and infrared come between radio and visible light.']],
      explanation: 'From longest wavelength and lowest frequency to shortest wavelength and highest frequency: radio, microwaves, infrared, visible, ultraviolet, X-rays, gamma rays.',
    },
    {
      skill: 'Electromagnetic spectrum', prompt: 'Which part of the electromagnetic spectrum can humans see with unaided eyes?',
      options: [['Visible light'],
        ['Infrared', 'People can sense infrared as heat with skin, but it is outside the visible range.'],
        ['Ultraviolet', 'Ultraviolet is beyond violet and cannot be seen by unaided human eyes.'],
        ['Radio waves', 'Radio waves have wavelengths far outside the visible range.']],
      explanation: 'Visible light is the small part of the electromagnetic spectrum detected by human eyes. The other types are invisible to unaided eyes.',
    },
    {
      skill: 'Electromagnetic spectrum', prompt: 'Which electromagnetic wave is commonly used to create medical images of bones?',
      options: [['X-rays'],
        ['Radio waves', 'Radio waves are used for communication and other technologies, not standard bone images.'],
        ['Visible light only', 'Visible light does not usually pass through the body to make bone images.'],
        ['Microwaves', 'Microwaves are used in communication and heating, not standard bone imaging.']],
      explanation: 'X-rays pass through soft tissues more easily than dense bone, which helps create an image. Medical X-rays are used with safety precautions.',
    },
    {
      skill: 'Light & mediums', prompt: 'Where does light travel fastest?',
      options: [['In a vacuum, where it travels at its maximum speed'],
        ['In every material at the same speed', 'Light slows by different amounts in materials, depending on their optical properties.'],
        ['Only in water', 'Light travels more slowly in water than in a vacuum.'],
        ['Only in glass', 'Light travels more slowly in glass than in a vacuum.']],
      explanation: 'Light travels fastest in a vacuum, not in a state of matter. In familiar transparent materials it travels slower; the exact speed depends on the material’s optical properties.',
    },
    {
      skill: 'Light & mediums', prompt: 'Which is the best classroom comparison for light’s speed in familiar transparent materials?',
      options: [['It generally travels faster in air than in water or glass, but exact speed depends on optical properties'],
        ['It is faster in glass because glass is a solid', 'Being solid does not make light faster; light usually travels slower in glass than air.'],
        ['It travels at exactly the same speed in air, water, and glass', 'Light’s speed changes in different materials.'],
        ['It cannot travel through water or glass', 'Light can travel through transparent water and glass, though it slows.']],
      explanation: 'Light is fastest in a vacuum. Among common transparent materials, it generally travels faster in air (a gas) than in water (a liquid) or glass (a solid). This is about optical properties, not a universal rule that every gas beats every liquid or solid.',
    },
    {
      skill: 'Light & mediums', prompt: 'Why does light change speed when it enters a different transparent material?',
      options: [['It interacts with the material, so its effective speed depends on the material’s optical properties'],
        ['The light forgets its energy', 'Light still carries energy; its speed in the material changes.'],
        ['The material turns the light into a sound wave', 'Light remains electromagnetic radiation as it travels through transparent materials.'],
        ['Only the color name changes', 'The speed changes due to interactions with the material, not just a label change.']],
      explanation: 'Light’s speed in a material depends on how its electromagnetic wave interacts with that material. The ratio between vacuum speed and material speed is related to refractive index.',
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

  function createSession(bank, count, label) {
    if (!Number.isInteger(count) || count < 1 || count > bank.length) {
      throw new Error(`${label} practice count must be between 1 and the question-bank size.`);
    }
    const sessionHint = label === 'Light-wave'
      ? 'Use the clues in the question: light can pass through, bounce off, be absorbed, or change direction between materials.'
      : 'Compare speed, particle motion, and the materials each wave can pass through.';
    const skills = [...new Set(bank.map((item) => item.skill))];
    const pools = Util.shuffle(skills).map((skill) => Util.shuffle(bank.filter((item) => item.skill === skill)));
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
        hint: sessionHint,
        explanation: item.explanation,
        check(id) {
          const option = options.find((entry) => entry.id === id);
          if (!option) return { status: 'invalid', message: 'Choose one of the answers.' };
          return option.correct ? { status: 'correct' } : { status: 'incorrect', message: option.hint };
        },
      };
    });
  }

  function buildSession(count) {
    return createSession(BANK, count, 'Seismic-wave');
  }

  function buildLightSession(count) {
    return createSession(LIGHT_BANK, count, 'Light-wave');
  }

  const seismicLesson = {
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
  };

  const lightLesson = {
    id: 71, short: 'Light Waves', title: 'Light Waves Study Guide & Quiz',
    blurb: 'Learn how light passes through materials, reflects, refracts, and forms colors, then practice the electromagnetic spectrum and light in different media.',
    art: '<span class="lesson-emoji">🌈</span>', sessionLength: 10,
    steps: [
      {
        title: 'Quiz learning targets',
        html: `<p>Use this guide to review the Light Waves quiz topics. Read each section, try the quick checks, then use <strong>Practice</strong> for a shuffled review quiz.</p>
          <ul class="checklist targets"><li>I can compare transparent, translucent, and opaque materials.</li>
          <li>I can distinguish reflection from absorption and explain how objects appear colored.</li>
          <li>I can describe refraction and how raindrops make rainbows.</li>
          <li>I can name the electromagnetic spectrum in order and give uses for invisible waves.</li>
          <li>I can explain how a medium affects light’s speed.</li></ul>
          <div class="callout"><strong>Suggested class review:</strong> Light Energy Notes p. 45 · EM Waves Museum p. 46 · TARR Homework (Canvas) · Light Stations Lab Sheet p. 47.</div>`,
      },
      {
        title: 'Transparent, translucent, and opaque',
        html: `<p>These words describe how much light passes through a material and how clear the view is.</p>
          <div class="table-scroll"><table class="map-table"><thead><tr><th scope="col">Type</th><th scope="col">What happens to light?</th><th scope="col">Example</th></tr></thead><tbody>
          <tr><th scope="row">Transparent</th><td>Most light passes through with little scattering; objects look clear.</td><td>Clean window, clear water</td></tr>
          <tr><th scope="row">Translucent</th><td>Some light passes through but is scattered; objects look blurry.</td><td>Frosted glass, wax paper</td></tr>
          <tr><th scope="row">Opaque</th><td>Nearly all light is blocked from passing through.</td><td>Wooden door, book</td></tr></tbody></table></div>
          <p><strong>Tip:</strong> Transparent = clear through. Translucent = light through, blurry view. Opaque = light blocked.</p>
          <p>A frosted pane lets light through but blurs the view. What type is it?</p><div id="transmissionCheck"></div>`,
        mount(el) {
          Lessons.miniCheck(el, '#transmissionCheck', [
            { label: 'Transparent', correct: false, feedback: 'Transparent materials let you see clearly through them.' },
            { label: 'Translucent', correct: true, feedback: 'Right! Some light passes through, but scattering blurs the view.' },
            { label: 'Opaque', correct: false, feedback: 'Opaque materials block nearly all light; this pane lets some light through.' },
          ]);
        },
      },
      {
        title: 'Reflection, absorption, and color',
        html: `<p><strong>Reflection</strong> is light bouncing off a surface. <strong>Absorption</strong> is when a material takes in light energy; some absorbed energy can warm the material.</p>
          <p>A white shirt reflects much of the sunlight that hits it, while a black shirt absorbs more light energy. That is why a black shirt can feel hotter on a sunny day.</p>
          <h3>How we see colors</h3><p>We see the visible light that reaches our eyes. Under white light, a green leaf reflects more green light toward our eyes and absorbs much of the other visible colors. A red object reflects more red light; a white object reflects most visible colors, while a black object reflects very little.</p>
          <div class="callout"><strong>Remember:</strong> The color an object appears is the color of light it reflects to your eyes—not usually the color it absorbs.</div>
          <p>If an object looks green under white light, what is it mainly reflecting?</p><div id="colorCheck"></div>`,
        mount(el) {
          Lessons.miniCheck(el, '#colorCheck', [
            { label: 'Green light', correct: true, feedback: 'Correct! It reflects green light toward your eyes and absorbs much of the other visible light.' },
            { label: 'All visible colors equally', correct: false, feedback: 'Reflecting all visible colors about equally would make it look white.' },
            { label: 'No light', correct: false, feedback: 'Light reflected from the object reaches your eyes so you can see it.' },
          ]);
        },
      },
      {
        title: 'Refraction and rainbows',
        html: `<p><strong>Refraction</strong> is the change in a light ray’s direction when its speed changes as it enters a different medium. If light enters straight along the boundary’s normal, its speed changes but its direction does not.</p>
          <p>A straw can look bent at the surface of water because light from its submerged part changes direction as it moves from water into air. Your eyes trace the light back in a straight line, making that part appear shifted.</p>
          <h3>How a rainbow forms</h3><p>Sunlight contains many colors. In raindrops, light refracts as it enters, different wavelengths bend by different amounts (dispersion), light reflects inside the drop, and light refracts again as it exits. The separated colors reach your eyes as a rainbow.</p>
          <div class="callout"><strong>Sequence:</strong> Refraction in → color separation → reflection inside → refraction out.</div>
          <p>Why do different colors spread apart in a raindrop?</p><div id="rainbowCheck"></div>`,
        mount(el) {
          Lessons.miniCheck(el, '#rainbowCheck', [
            { label: 'Different wavelengths refract by different amounts', correct: true, feedback: 'Yes! Dispersion separates the colors, and internal reflection plus another refraction helps send them toward your eyes.' },
            { label: 'Water creates new colors from nothing', correct: false, feedback: 'The colors are already present in sunlight; the drop separates them.' },
            { label: 'The drop absorbs all colors except white', correct: false, feedback: 'A rainbow shows separated colors, not white light alone.' },
          ]);
        },
      },
      {
        title: 'The electromagnetic spectrum',
        html: `<p>Light is electromagnetic radiation. The full range is called the <strong>electromagnetic (EM) spectrum</strong>. In this order, wavelength gets shorter while frequency and energy generally increase:</p>
          <ol class="timeline"><li>Radio waves — broadcasting and communication</li><li>Microwaves — cooking and communication</li><li>Infrared — heat sensors, thermal cameras, and remote controls</li><li><strong>Visible light — the small part human eyes can see</strong></li><li>Ultraviolet — fluorescent lamps and sterilizing some equipment; too much can harm skin and eyes</li><li>X-rays — medical images of bones</li><li>Gamma rays — some cancer treatments and sterilizing medical equipment</li></ol>
          <p>All are electromagnetic waves, but our eyes detect only visible light. Some uses require safety precautions because higher-energy ultraviolet, X-rays, and gamma rays can damage living tissue.</p>
          <p>Which EM wave comes just beyond red light, outside the visible range?</p><div id="spectrumCheck"></div>`,
        mount(el) {
          Lessons.miniCheck(el, '#spectrumCheck', [
            { label: 'Infrared', correct: true, feedback: 'Correct! Infrared is just beyond red on the longer-wavelength side of visible light.' },
            { label: 'Ultraviolet', correct: false, feedback: 'Ultraviolet is just beyond violet, on the shorter-wavelength side.' },
            { label: 'X-rays', correct: false, feedback: 'X-rays have shorter wavelengths and higher frequencies than ultraviolet.' },
          ]);
        },
      },
      {
        title: 'Light in different media & quiz prep',
        html: `<p>Light travels fastest in a <strong>vacuum</strong>—empty space, which is not a state of matter. It travels more slowly through transparent materials because of interactions with the material.</p>
          <p>Among familiar transparent materials, light generally travels faster in air (a gas) than in water (a liquid) or glass (a solid). The exact speed depends on a material’s <strong>optical properties</strong>, so do not treat “state of matter” as a universal speed rule.</p>
          <h3>Study routine</h3><ol><li>Say each definition in your own words.</li><li>For color questions, ask: “What color reaches my eyes?”</li><li>For refraction, identify the two media and the change in speed.</li><li>For EM waves, practice the order and match each wave to a use.</li><li>Take the shuffled practice quiz and revisit any missed ideas.</li></ol>
          <h3>Practice games</h3><p>Try your class review activities:</p><ul>
          <li><a href="https://play.blooket.com/play?hwId=6ae22847a4e92e8d2529c994" target="_blank" rel="noopener noreferrer">EM Blooket</a></li>
          <li><a href="https://www.gimkit.com/join/6ae2289522753313a77e6df0" target="_blank" rel="noopener noreferrer">Light Waves Quiz Gimkit</a></li>
          <li><a href="https://play.blooket.com/play?hwId=6ae2281ea3d90deaf652361b" target="_blank" rel="noopener noreferrer">Light Quiz Review Blooket</a></li></ul>`,
      },
    ],
    buildSession: buildLightSession,
  };

  const lessons = [seismicLesson, lightLesson];
  return { BANK, LIGHT_BANK, lessons, buildSession, buildLightSession, motionDiagram };
})();
