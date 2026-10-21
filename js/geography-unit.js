// Social Studies Unit 2: geography study guide lessons and targeted practice.
const GeographyUnit = (() => {
  const ITEMS = [
    {
      skill: 'themes', prompt: 'Which of the five themes asks how people, goods, and ideas travel?',
      options: [['Movement'], ['Region', 'A region is an area with shared characteristics.'], ['Location', 'Location describes where a place is.'], ['Place', 'Place describes what a location is like.']],
      explanation: 'Movement is the theme for how people, goods, and ideas travel from one place to another.',
    },
    {
      skill: 'themes', prompt: 'A desert climate and a nearby river are characteristics of a location. Which theme asks what makes a place unique?',
      options: [['Place'], ['Movement', 'Movement is about travel and exchange.'], ['Region', 'Region groups places with shared traits.'], ['Location', 'Location tells where a place is.']],
      explanation: 'Place describes the physical and human characteristics that make a location distinctive.',
    },
    {
      skill: 'themes', prompt: 'A geographer compares how people change a forest to build farms. Which theme is this?',
      options: [['Human-environment interaction (HEI)'], ['Location', 'Location asks where something is.'], ['Movement', 'Movement asks how people and things travel.'], ['Region', 'Region groups places with common characteristics.']],
      explanation: 'Human-environment interaction explores how people depend on, adapt to, and modify their environment.',
    },
    {
      skill: 'themes', prompt: 'Which theme groups places that share a language, climate, or landform?',
      options: [['Region'], ['Place', 'Place describes the character of one location.'], ['Movement', 'Movement is about travel and exchange.'], ['Location', 'Location describes where a place is.']],
      explanation: 'A region is an area whose places share one or more characteristics.',
    },
    {
      skill: 'map-time', prompt: 'On a timeline, what does chronological order mean?',
      options: [['Events are arranged in the order they happened'], ['Events are grouped by location', 'That organizes events geographically, not by time.'], ['The most important event comes first', 'A timeline follows dates, not importance.'], ['Dates are written from largest to smallest', 'Timeline order follows what happened first to last.']],
      explanation: 'Chronological means in time order: earlier events come before later events.',
    },
    {
      skill: 'map-time', prompt: 'Which statement about BC/BCE and AD/CE is correct?',
      options: [['BC and BCE label years before the common era; AD and CE label years after it begins'], ['BCE means after CE', 'BCE is the same era label as BC: before the common era.'], ['AD means a date before year 1', 'AD labels years after the start of the common era.'], ['BC years count upward toward the present', 'BC/BCE numbers count down as they approach year 1.']],
      explanation: 'BC and BCE are equivalent labels for years before the common era; AD and CE label years after it begins. There is no year zero in this system.',
    },
    {
      skill: 'map-time', prompt: 'Which line divides Earth into the Northern and Southern Hemispheres?',
      options: [['The Equator'], ['The Prime Meridian', 'The Prime Meridian divides the Eastern and Western Hemispheres.'], ['The International Date Line', 'That line roughly follows 180° longitude.'], ['The Tropic of Cancer', 'This is a latitude line north of the Equator.']],
      explanation: 'The Equator is at 0° latitude and separates the Northern and Southern Hemispheres.',
    },
    {
      skill: 'map-time', prompt: 'Which line divides Earth into the Eastern and Western Hemispheres?',
      options: [['The Prime Meridian'], ['The Equator', 'The Equator divides the Northern and Southern Hemispheres.'], ['The Arctic Circle', 'This is a line of latitude near the North Pole.'], ['The Tropic of Capricorn', 'This is a line of latitude south of the Equator.']],
      explanation: 'The Prime Meridian is at 0° longitude and is the starting line for east and west longitude.',
    },
    {
      skill: 'map-time', prompt: 'A place is listed at 18°N, 66°W. What do the coordinates tell you?',
      options: [['Its absolute location: latitude first, then longitude'], ['Its relative location compared with a nearby city', 'That is a description using other places.'], ['Its elevation above sea level', 'Coordinates here describe position, not elevation.'], ['Its distance from the Equator in miles', 'Degrees of latitude show angular position, not miles directly.']],
      explanation: 'Absolute location uses coordinates. Write latitude first (north or south of the Equator), then longitude (east or west of the Prime Meridian).',
    },
    {
      skill: 'map-time', prompt: 'A map says, “The island is southeast of India.” What kind of location is this?',
      options: [['Relative location'], ['Absolute location', 'Absolute location uses a precise address such as latitude and longitude.'], ['A map scale', 'A scale compares map distance with real distance.'], ['A hemisphere', 'A hemisphere is half of Earth.']],
      explanation: 'Relative location explains where a place is compared with another place.',
    },
    {
      skill: 'farming', prompt: 'How could a river flood both help and hurt nearby farmers?',
      options: [['Floodwater could leave fertile silt, but severe floods could destroy homes and kill people'], ['Floods always helped because they never damaged farms', 'Floods could be destructive as well as helpful.'], ['Floods made soil less fertile but prevented all danger', 'Silt often improved soil, but floods still brought danger.'], ['Floods stopped people from needing to grow food', 'People still needed farming; floods changed its risks and benefits.']],
      explanation: 'Floods could spread fertile silt that helped crops grow, but uncontrolled water could destroy homes, fields, and lives.',
    },
    {
      skill: 'farming', prompt: 'What is irrigation?',
      options: [['A way of bringing water to land or crops'], ['A method of storing extra grain', 'That describes a granary or food storage.'], ['The process of domesticating animals', 'Domestication is changing plants or animals for human use.'], ['A kind of river flood', 'Irrigation is a human-made way to direct water.']],
      explanation: 'Irrigation uses canals, ditches, or other systems to bring water to fields.',
    },
    {
      skill: 'farming', prompt: 'What does domestication mean?',
      options: [['People selectively raise plants or animals so they are useful to humans'], ['People move from place to place to hunt', 'That describes nomadic life, not domestication.'], ['People trade crops with distant cities', 'Trade exchanges goods; domestication changes plants or animals over generations.'], ['People build a wall around a village', 'That is construction, not domestication.']],
      explanation: 'Domestication is the process of changing plants or animals over generations so they can be grown or raised by people. Examples include wheat and sheep.',
    },
    {
      skill: 'farming', prompt: 'Which sequence best shows how farming could help a civilization grow?',
      options: [['Agriculture → food surplus → division of labor → government, arts, laws, and religion'], ['Government → surplus → agriculture → division of labor', 'A food surplus depends on farming and can support new jobs.'], ['Division of labor → agriculture → nomadism → surplus', 'Farming usually comes before surplus and job specialization.'], ['Trade → government → hunting → agriculture', 'This misses the farming-to-surplus chain.']],
      explanation: 'Farming could create a surplus (extra stored food). With food available, some people could take specialized jobs, and larger communities developed governments and shared institutions.',
    },
    {
      skill: 'farming', prompt: 'Why was a food surplus important to early settlements?',
      options: [['It meant not everyone had to farm, so people could do other specialized jobs'], ['It made irrigation unnecessary everywhere', 'A surplus did not remove the need to manage water.'], ['It caused everyone to leave the settlement', 'Stored food could support a larger, settled community.'], ['It stopped people from needing government', 'Larger communities often needed rules and organization.']],
      explanation: 'Extra stored food could support craftspeople, builders, leaders, and other specialists who did not farm full-time.',
    },
    {
      skill: 'greece-rome', prompt: 'Which set of features describes ancient Greece?',
      options: [['A mountainous peninsula with many islands, an archipelago, and few major rivers'], ['A broad, flat plain with many large rivers', 'That describes a different kind of landscape; Greece was mountainous.'], ['A desert surrounded by one continuous river', 'Greece had a rugged coast and many islands.'], ['A single island with fertile river valleys everywhere', 'Greece included a mainland peninsula and many islands, with limited farmland.']],
      explanation: 'Greece has a mountainous peninsula, many nearby islands (an archipelago), and few major rivers. Its rugged land made large-scale farming and overland travel difficult.',
    },
    {
      skill: 'greece-rome', prompt: 'How did Greece’s mountains and islands influence its communities?',
      options: [['They separated communities and encouraged seafaring, trade, and different local cultures'], ['They made every settlement part of one easy-to-reach plain', 'Mountains and water often made travel between communities difficult.'], ['They provided many broad rivers for easy inland travel', 'Greece had few major rivers.'], ['They prevented Greeks from traveling by sea', 'The sea became an important route for travel and trade.']],
      explanation: 'Mountains and islands could separate communities, while the surrounding seas encouraged sailors to travel and trade.',
    },
    {
      skill: 'greece-rome', prompt: 'Why was it difficult to farm much of ancient Greece?',
      options: [['Steep, mountainous land left limited flat farmland'], ['Greece had no coastline or access to water', 'Greece had a long coastline and many islands.'], ['The land was one broad, flat plain', 'Greece was rugged and mountainous, not a single flat plain.'], ['Farmers were not allowed to grow crops', 'The challenge was the physical landscape, not a ban on farming.']],
      explanation: 'Mountains covered much of Greece, leaving less flat land for large farms. Communities adapted by using the land they had and relying on sea routes.',
    },
    {
      skill: 'greece-rome', prompt: 'How did Rome’s Seven Hills help the city?',
      options: [['The hills offered defensible high ground that could help protect the city'], ['They made the city impossible to reach by river or road', 'Rome also benefited from access to routes and nearby trade.'], ['They created unlimited flat land for farming', 'Hills are not unlimited flat farmland.'], ['They stopped Romans from meeting neighboring peoples', 'Rome was connected to neighbors and exchange routes.']],
      explanation: 'The hills gave Rome high ground that could make defense easier. Rome’s location also connected it to routes and neighboring peoples.',
    },
    {
      skill: 'greece-rome', prompt: 'What does the study guide mean by Rome having a “lucky location”?',
      options: [['Its position helped with defense and connected Romans to nearby communities and exchange'], ['Rome had no neighbors and never needed trade', 'Rome interacted with surrounding peoples and routes.'], ['It was built on an island far from the Mediterranean', 'Rome was on the Italian Peninsula, near important routes.'], ['Its location guaranteed that Rome would never face danger', 'Geography can help, but it cannot guarantee safety.']],
      explanation: 'Rome’s hills helped with defense, while its position in central Italy helped connect it to nearby people and trade routes.',
    },
    {
      skill: 'civilizations', prompt: 'Why did the Inca use terrace farming in the Andes?',
      options: [['Stepped fields made steep mountain slopes easier to farm'], ['Terraces brought monsoon winds to the mountains', 'Monsoon winds are seasonal winds over South Asia.'], ['Terraces made the Andes completely flat', 'Terraces create steps; they do not flatten a whole mountain range.'], ['The Inca used terraces only to build sea ports', 'Terrace farming helped grow crops on mountain slopes.']],
      explanation: 'Terraces are step-like fields cut into slopes. They created usable farmland in the steep Andes and helped manage water and soil.',
    },
    {
      skill: 'civilizations', prompt: 'How could the Inca’s Andes location help and challenge them?',
      options: [['Mountains offered isolation and protection, but steep terrain made farming and travel difficult'], ['The mountains made every route flat and easy', 'Mountain terrain made movement challenging.'], ['The Andes gave the Inca no access to the coast', 'Parts of the empire reached the coast and used marine resources.'], ['The mountains prevented any crops from growing', 'The Inca adapted with methods such as terrace farming.']],
      explanation: 'The Andes helped shield the Inca from some outside contact, but steep slopes required adaptations such as terrace farming. Parts of the empire also reached the coast.',
    },
    {
      skill: 'civilizations', prompt: 'How did seasonal monsoon winds help ancient Indian Ocean sailors?',
      options: [['Predictable seasonal wind changes helped sailors plan voyages in one direction and return later'], ['Monsoon winds pointed north all year', 'Monsoon direction changes with the season.'], ['Sailors used the winds to make rivers flood on command', 'Winds affect sailing; river floods are a different process.'], ['The winds stopped all ships from crossing the ocean', 'Sailors learned to use changing winds for travel.']],
      explanation: 'Monsoon winds change direction with the seasons. Sailors could plan outward and return voyages around those predictable shifts.',
    },
    {
      skill: 'civilizations', prompt: 'What was the Valley of Mexico like for the Aztecs?',
      options: [['A high mountain plateau with lakes, freshwater, resources, and natural barriers'], ['A low, dry island with no freshwater', 'The valley had lakes and freshwater.'], ['A flat coastal plain without nearby mountains', 'The Valley of Mexico was a high plateau surrounded by mountains.'], ['A desert with no resources or natural protection', 'The valley offered water, resources, and protective barriers.']],
      explanation: 'The Valley of Mexico was a high plateau surrounded by mountains, with lakes, freshwater, resources, and natural barriers.',
    },
    {
      skill: 'civilizations', prompt: 'What were chinampas?',
      options: [['Raised garden plots built in shallow lake areas, sometimes called floating gardens'], ['Stone terraces built high in the Andes', 'Those are associated with Inca mountain farming.'], ['Seasonal winds used to cross the Indian Ocean', 'Those are monsoon winds.'], ['A kind of map coordinate', 'Chinampas were a farming method.']],
      explanation: 'Chinampas were carefully built raised plots in shallow lake areas that helped provide food for the large population of the Valley of Mexico.',
    },
    {
      skill: 'civilizations', prompt: 'What is one geographic feature that shaped life in Japan?',
      options: [['Japan is an island chain with mountainous land and limited flat farmland'], ['Japan is one large desert with no coastline', 'Japan is an archipelago surrounded by water.'], ['Japan has broad, flat plains covering every island', 'Much of Japan is mountainous, so flat land is limited.'], ['Japan is landlocked in the center of Asia', 'Japan is an island country in the Pacific.']],
      explanation: 'Japan is an archipelago. Much of its land is mountainous, so many people and farms are concentrated in limited lowland areas, contributing to high population density there.',
    },
    {
      skill: 'compare', prompt: 'Which statement correctly compares Mesopotamia and Mesoamerica?',
      options: [['They developed complex societies shaped by geography and used irrigation; Mesopotamia was in Asia and Mesoamerica between North and South America'], ['Both were in Africa and relied only on rainfall', 'Mesopotamia was in Southwest Asia; Mesoamerica was in the Americas.'], ['Mesoamerica was in Europe, while Mesopotamia was in South America', 'Their locations are reversed and neither is in those continents.'], ['They had no farming or complex societies', 'Both regions supported farming and complex societies.']],
      explanation: 'Both regions developed complex societies shaped by their environments and used irrigation. Mesopotamia was in Southwest Asia; Mesoamerica is the region between North and South America.',
    },
    {
      skill: 'compare', prompt: 'Which similarity between Aztecs and Sumerians appears in the study guide?',
      options: [['Both used irrigation for farming'], ['Both built the Inca road system', 'The Inca built roads in the Andes.'], ['Both sailed using Indian Ocean monsoons', 'Monsoon navigation was used in South Asia.'], ['Both lived in ancient Greece', 'The Aztecs lived in Mesoamerica and Sumerians in Mesopotamia.']],
      explanation: 'The guide compares the Aztecs and Sumerians as societies that used irrigation to support farming.',
    },
    {
      skill: 'compare', prompt: 'What does the study guide identify as a difference in religious practices?',
      options: [['Mesoamerican societies practiced human sacrifice; Mesopotamia did not in this comparison'], ['Mesopotamia used monsoon winds but Mesoamerica did not', 'Monsoon winds are a South Asian geography topic.'], ['Mesoamerica had no religious buildings', 'The guide notes pyramid-style structures used for religious purposes.'], ['Both societies had identical religious practices', 'The guide lists a difference in practices.']],
      explanation: 'The study guide identifies human sacrifice as a Mesoamerican practice that distinguishes it from Mesopotamia in this comparison.',
    },
    {
      skill: 'compare', prompt: 'How did Greece and Rome both show human-environment interaction?',
      options: [['People adapted to physical features: Greeks used sea routes among rugged communities, while Romans used hills for defense'], ['People ignored all physical features and moved inland', 'Their geography shaped choices about travel, defense, and settlement.'], ['Both depended on the Yellow River for irrigation', 'The Yellow River is in China.'], ['Both used chinampas in mountain lakes', 'Chinampas are associated with the Valley of Mexico.']],
      explanation: 'Human-environment interaction is how people adapt to, depend on, and modify their surroundings. Greek seafaring and Roman hilltop defense are examples.',
    },
  ];

  const LESSONS = [
    {
      id: 50, short: 'Geography foundations', navTitle: 'Geography: themes, maps & time',
      title: 'Geography Foundations: Themes, Maps & Time',
      blurb: 'Learn MR(LIP), hemispheres, coordinates, and timeline vocabulary.',
      art: '<span class="lesson-emoji">🧭🌐⏳</span>', sessionLength: 8, skills: ['themes', 'map-time'],
      targets: ['I can name the five themes of geography: Movement, Region, Location, Interaction, and Place.', 'I can identify the Equator, Prime Meridian, hemispheres, latitude, and longitude.', 'I can read a simple timeline in chronological order and explain BC/BCE and AD/CE.'],
      details: `
        <h3>Five themes: MR(LIP)</h3>
        <ul class="tips">
          <li><strong>Movement</strong> — how people, goods, and ideas travel.</li>
          <li><strong>Region</strong> — an area whose places share traits.</li>
          <li><strong>Location</strong> — where a place is; absolute (coordinates) or relative (compared with another place).</li>
          <li><strong>Interaction (HEI)</strong> — how people depend on, adapt to, and change the environment.</li>
          <li><strong>Place</strong> — the human and physical features that make a location unique.</li>
        </ul>
        <div class="callout"><strong>Memory tip:</strong> MR(LIP) = Movement, Region, Location, Interaction, Place. HEI means Human-Environment Interaction.</div>
        <h3>Map skills</h3>
        <p>The <strong>Equator</strong> (0° latitude) divides Northern and Southern Hemispheres. The <strong>Prime Meridian</strong> (0° longitude) is the reference for Eastern and Western Hemispheres. Coordinates are written <strong>latitude first, longitude second</strong>, such as (18°N, 66°W).</p>
        <p><strong>Absolute location</strong> is an exact coordinate. <strong>Relative location</strong> compares places: “southeast of India.”</p>
        <div class="callout"><strong>Coordinate tip:</strong> “Lat is flat” — latitude lines run east–west, but measure north–south. Longitude lines run pole to pole and measure east–west.</div>
        <h3>Timeline words</h3>
        <p><strong>Chronological order</strong> means time order. BC/BCE means before the common era; AD/CE means after it begins. BC/BCE numbers count down toward year 1. This system has no year zero.</p>
        <div class="callout"><strong>Remember:</strong> BC = BCE and AD = CE. BP means “before present”; in many history timelines, present is set at 1950.</div>`,
      questionSkills: ['themes', 'map-time'],
    },
    {
      id: 51, short: 'Farming & civilization', navTitle: 'Farming: water to civilization',
      title: 'Farming: From Water to Civilization',
      blurb: 'Study flooding, irrigation, domestication, surplus, and the steps toward civilization.',
      art: '<span class="lesson-emoji">🌧️🌾🏙️</span>', sessionLength: 5, skills: ['farming'],
      targets: ['I can explain one way floods helped and one way they hurt.', 'I can define irrigation, domestication, and surplus.', 'I can put the steps from agriculture to civilization in order.'],
      details: `
        <h3>Geography and farming</h3>
        <p>Water and fertile soil helped people grow food and settle in one place. Flooding could <strong>help</strong> by spreading nutrient-rich silt, and <strong>hurt</strong> by destroying fields, homes, and lives.</p>
        <p><strong>Irrigation</strong> is bringing water to fields through canals or other systems. <strong>Domestication</strong> is selectively raising plants and animals over generations for human use.</p>
        <h3>From farming to civilization</h3>
        <ol class="language-list">
          <li><strong>Agriculture</strong> produces food.</li>
          <li>A harvest can create a <strong>surplus</strong> (extra food to store).</li>
          <li>A surplus supports a <strong>division of labor</strong>: people can specialize in different jobs.</li>
          <li>Larger communities organize <strong>government, arts, laws, taxes, and religion</strong>.</li>
        </ol>
        <div class="callout"><strong>Test tip:</strong> Remember the chain: Agriculture → Surplus → Division of Labor → Organized society. If a question asks why new jobs appeared, connect them to stored extra food.</div>`,
      questionSkills: ['farming'],
    },
    {
      id: 52, short: 'Greece & Rome', navTitle: 'Greece and Rome: land & location',
      title: 'Ancient Greece & Rome: Land and Location',
      blurb: 'Connect Greek mountains and islands, and Rome’s hills, to travel, defense, and exchange.',
      art: '<span class="lesson-emoji">🏛️⛰️⛵</span>', sessionLength: 5, skills: ['greece-rome'],
      targets: ['I can describe Greece as a mountainous peninsula with many islands and few major rivers.', 'I can explain how Greek geography influenced farming, travel, and culture.', 'I can connect Rome’s Seven Hills and location to defense and exchange.'],
      details: `
        <h3>Greece: rugged land, connected by sea</h3>
        <ul>
          <li>The mainland is a <strong>peninsula</strong>, with water on three sides.</li>
          <li>An <strong>archipelago</strong> is a chain or group of islands. Islands and mountains dominated the landscape.</li>
          <li>There were few major rivers, and steep land made farming and overland travel difficult.</li>
        </ul>
        <p>Mountains separated communities, so Greek city-states developed distinct identities. The sea became important for sailing, trade, and exchange of ideas.</p>
        <div class="callout"><strong>Test tip:</strong> Match each feature to its effect: mountains → separation; islands and coastline → sailing and trade; limited flat land → challenges for farming.</div>
        <h3>Rome: hills and a useful location</h3>
        <p>Rome grew among the <strong>Seven Hills</strong>. High ground could help defenders spot and resist attackers. Rome’s location also connected it to nearby communities and routes, encouraging trade and exchange of ideas.</p>
        <div class="callout"><strong>Explain both sides:</strong> Geography can help and challenge a society at the same time. Use “because” to connect a physical feature to its effect.</div>`,
      questionSkills: ['greece-rome'],
    },
    {
      id: 53, short: 'Geography shapes societies', navTitle: 'Geography shapes societies',
      title: 'How Geography Shapes Societies',
      blurb: 'Review Inca terrace farming, Indian Ocean monsoons, the Valley of Mexico, and Japan.',
      art: '<span class="lesson-emoji">🏔️🌬️🛶</span>', sessionLength: 6, skills: ['civilizations'],
      targets: ['I can explain why the Inca used terrace farming.', 'I can explain how sailors used seasonal monsoon winds.', 'I can describe the Valley of Mexico, chinampas, and one feature of Japan.'],
      details: `
        <h3>Inca and the Andes</h3>
        <p>The Andes offered some protection and isolation, but steep slopes made farming difficult. The Inca adapted by building <strong>terraces</strong>—step-like fields—and parts of the empire reached the coast.</p>
        <h3>South Asia and the monsoons</h3>
        <p><strong>Monsoons</strong> are seasonal winds that change direction. Indian Ocean sailors used predictable seasonal wind shifts to plan voyages out and return trips.</p>
        <div class="callout"><strong>Watch the wording:</strong> A question about sailors asks how winds helped travel. A question about farming may ask how monsoon rains watered crops. Winds and rainfall are connected, but they are not the same answer.</div>
        <h3>Valley of Mexico</h3>
        <p>The high plateau had lakes, freshwater, resources, and natural barriers. The Aztecs built <strong>chinampas</strong>—raised garden plots in shallow lake areas—to grow food for a large population.</p>
        <h3>Japan</h3>
        <p>Japan is an <strong>archipelago</strong>. Much of its land is mountainous, leaving less flat land for farming and settlement. People are concentrated in lowlands, contributing to high population density there.</p>
        <div class="callout"><strong>Study strategy:</strong> For each society, make a two-column note: “Geographic feature” → “How people adapted.” Example: steep Andes → terrace farming.</div>`,
      questionSkills: ['civilizations'],
    },
    {
      id: 54, short: 'Unit 2 review', navTitle: 'Unit 2 review: Compare & connect',
      title: 'Unit 2 Review: Compare & Connect',
      blurb: 'Practice comparing Mesopotamia and Mesoamerica, then connect geography to human choices.',
      art: '<span class="lesson-emoji">🌎🔎📝</span>', sessionLength: 8, skills: ['compare', 'farming', 'greece-rome', 'civilizations', 'map-time'],
      targets: ['I can compare the locations and farming of Mesopotamia and Mesoamerica.', 'I can identify a similarity and a difference without mixing up civilizations.', 'I can use evidence to explain how physical geography shaped human choices.'],
      details: `
        <h3>Mesopotamia and Mesoamerica</h3>
        <p>Both regions supported complex societies shaped by geography. Both used irrigation to grow food. <strong>Mesopotamia</strong> was in Southwest Asia; <strong>Mesoamerica</strong> is the cultural region between North and South America.</p>
        <p>The study guide also contrasts religious practices: Mesoamerican societies practiced human sacrifice, while Mesopotamia did not in this class comparison. Both regions built pyramid-style structures for religious purposes, though their pyramids looked and functioned differently.</p>
        <div class="callout"><strong>Compare tip:</strong> Use “Both…” for a similarity, then “However…” for a difference. Check the place names carefully: Mesoamerica is not Mesopotamia.</div>
        <h3>Writing a geography explanation</h3>
        <p>Use this frame: <strong>“The physical feature was ____. People adapted by ____. This helped/hurt because ____.”</strong></p>
        <ul>
          <li>Greece: rugged mountains and islands → separated communities; sea travel supported trade.</li>
          <li>Rome: hills → helped defense; location → connected neighbors.</li>
          <li>Inca: steep mountains → terrace farming.</li>
          <li>Valley of Mexico: lakes → chinampas for farming.</li>
          <li>Japan: mountainous islands → settlement concentrated in limited lowlands.</li>
        </ul>
        <div class="callout"><strong>Final check:</strong> Can you define MR(LIP), read coordinates, explain a flood’s help and harm, and put Agriculture → Surplus → Division of Labor → Government/arts/laws/taxes/religion in order?</div>`,
      questionSkills: ['compare', 'farming', 'greece-rome', 'civilizations', 'map-time'],
    },
  ];

  function makeQuestion(item) {
    const options = Util.shuffle(item.options.map(([html, hint], index) => ({
      html, correct: index === 0, hint,
    }))).map((option, index) => ({ ...option, id: 'ABCD'[index] }));
    const question = {
      type: item.skill,
      skill: item.skill.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
      prompt: item.prompt,
      summary: item.prompt.replace(/<[^>]+>/g, ''),
      format: 'mc',
      textOptions: true,
      options,
      solution: item.options[0][0],
      explanation: item.explanation,
      hint: 'Think about the physical feature and how people responded to it.',
      check: (id) => {
        const option = options.find((entry) => entry.id === id);
        if (!option) return { status: 'invalid', message: 'Choose one of the answers.' };
        return option.correct ? { status: 'correct' } : { status: 'incorrect', message: option.hint };
      },
    };
    return question;
  }

  const FACTORIES = Object.fromEntries([...new Set(ITEMS.map((item) => item.skill))]
    .map((skill) => [skill, ITEMS.filter((item) => item.skill === skill).map((item) => () => makeQuestion(item))]));

  function buildSession(skills, count) {
    const selected = [];
    const used = new Set();
    for (let tries = 0; selected.length < count && tries < count * 10; tries++) {
      for (const skill of Util.shuffle(skills)) {
        if (selected.length >= count) break;
        const candidates = FACTORIES[skill].filter((factory) => !used.has(factory));
        if (!candidates.length) continue;
        const factory = Util.pick(candidates);
        used.add(factory);
        selected.push(factory());
      }
    }
    return Util.shuffle(selected);
  }

  const lessons = LESSONS.map((lesson) => {
    const lessonItems = ITEMS.filter((item) => lesson.questionSkills.includes(item.skill));
    const skills = [...new Set(lessonItems.map((item) => item.skill))];
    return {
      ...lesson,
      steps: [
        {
          title: 'Learning targets',
          html: `<p>By the end of this lesson, you should be able to:</p><ul class="checklist targets">${lesson.targets.map((target) => `<li>${target}</li>`).join('')}</ul><p class="muted small">Use the checklist to choose what to review before practice.</p>`,
        },
        { title: 'Study notes & tips', html: lesson.details },
        {
          title: 'Quick recall',
          html: `<p>Before you practice, explain these ideas in your own words:</p>
            <ul>${lesson.targets.map((target) => `<li>${target}</li>`).join('')}</ul>
            <div class="callout"><strong>Test tip:</strong> Read the whole question, underline the geography clue, and explain how it affected people. A clear answer links “feature → human response → result.”</div>`,
        },
      ],
      skills,
      buildSession: (count) => buildSession(skills, count),
    };
  });

  return { ITEMS, FACTORIES, lessons, buildSession };
})();
