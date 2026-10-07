// Social Studies Unit 1: River Valley Civilizations (Mesopotamia, Egypt, Indus Valley, China).
// Topics follow the NC 6th-grade standards: how geography and water shaped early human organization.
// Practice questions use the same shape as js/questions.js (multiple choice only).
const SocialStudies = (() => {
  const { pick, shuffle } = Util;
  const { miniCheck } = Lessons;

  const SKILLS = {
    rivers:  'Rivers and the rise of civilization',
    meso:    'Mesopotamia',
    egypt:   'Ancient Egypt',
    indus:   'Indus Valley civilization',
    beliefs: 'Roots of Hinduism and Buddhism',
    china:   'Ancient China',
    compare: 'Compare river valley civilizations',
    distance:  'Find distance with a map scale',
    latlong:   'Latitude, longitude & absolute location',
    direction: 'Directions & relative location',
  };

  // ---------- Civilization data ----------
  const CIVS = [
    {
      key: 'meso', span: 'from Sumer to the fall of Babylon', name: 'Mesopotamia', icon: '🏛️', river: 'Tigris and Euphrates Rivers', today: 'Iraq (and parts of Syria and Turkey)',
      color: '#c2410c', from: 3500, to: 539,
      clues: ['built ziggurats', 'wrote in cuneiform on clay tablets', 'had the Code of Hammurabi', 'had city-states like Ur and Uruk'],
      floods: 'unpredictable and sometimes violent',
      achievement: 'cuneiform writing and the Code of Hammurabi',
    },
    {
      key: 'egypt', span: 'until Roman rule', name: 'Ancient Egypt', icon: '🔺', river: 'Nile River', today: 'Egypt',
      color: '#b45309', from: 3100, to: 30,
      clues: ['was ruled by pharaohs', 'wrote in hieroglyphics on papyrus', 'built pyramids as tombs', 'depended on a yearly, predictable flood'],
      floods: 'predictable, every year',
      achievement: 'pyramids, hieroglyphics, and a strong central government under the pharaoh',
    },
    {
      key: 'indus', span: 'including its decline', name: 'Indus Valley', icon: '🧱', river: 'Indus River', today: 'Pakistan and northwest India',
      color: '#0f766e', from: 3300, to: 1300,
      clues: ['planned cities on a grid, like Mohenjo-daro', 'had covered drains and sewer systems', 'used standard bricks and weights', 'made stamp seals with a script no one can read yet'],
      floods: 'fed by Himalayan snowmelt and monsoon rains',
      achievement: 'carefully planned cities with drainage systems',
    },
    {
      key: 'china', span: 'the Shang and Zhou dynasties', name: 'Ancient China', icon: '🐉', river: 'Yellow River (Huang He)', today: 'China',
      color: '#a16207', from: 1600, to: 256,
      clues: ['wrote on oracle bones', 'followed the Mandate of Heaven', 'was shaped by deserts, mountains, and an ocean that isolated it', 'had the Shang and Zhou dynasties'],
      floods: 'so deadly the river was called "China\'s Sorrow"',
      achievement: 'oracle-bone writing, bronze work, and the Mandate of Heaven',
    },
  ];
  const civ = (key) => CIVS.find((c) => c.key === key);

  // ---------- Question bank ----------
  // options[0] is correct; every other option carries a hint shown when it is chosen.
  const BANK = [
    // Rivers and civilization
    { skill: 'rivers', prompt: 'Why did the first civilizations grow up along rivers?',
      options: [['Rivers gave water, rich soil for farming, food, and a way to travel and trade'], ['Rivers kept away every invader', 'Rivers helped, but they did not stop all invaders. Think about farming.'], ['There were no deserts near rivers', 'Egypt and Mesopotamia were right next to deserts. Think about what rivers gave farmers.'], ['Rivers made the weather cold', 'Most early river valleys were hot. Think about water and soil.']],
      explanation: 'Rivers provided fresh water, fertile soil from floods, fish, and an easy way to move people and goods. That let people farm and settle down.' },
    { skill: 'rivers', prompt: 'What is <strong>silt</strong>, and why did farmers want it?',
      options: [['Rich soil left behind by floods that helps crops grow'], ['A type of stone used to build pyramids', 'Silt is not stone. It comes from the river.'], ['A tool for digging canals', 'Silt is not a tool. Think about what floods leave behind.'], ['Salt water from the ocean', 'Salt actually harms crops. Silt helps them.']],
      explanation: 'When rivers flood, they spread silt (fine, fertile soil) across the land. Crops grow well in it.' },
    { skill: 'rivers', prompt: 'What is <strong>irrigation</strong>?',
      options: [['Bringing water to fields with canals or ditches'], ['Storing grain for the winter', 'That is a granary or a surplus. Irrigation is about water.'], ['Trading goods with other cities', 'That is trade. Irrigation moves water to crops.'], ['Writing laws on stone', 'That describes Hammurabi\'s Code, not irrigation.']],
      explanation: 'Irrigation means moving water from a river to farm fields using canals, ditches, or tools like the shaduf.' },
    { skill: 'rivers', prompt: 'How did a food <strong>surplus</strong> help civilizations grow?',
      options: [['Not everyone had to farm, so people could become priests, builders, traders, and scribes'], ['It made people move around more to hunt', 'A surplus let people settle in one place, not move around.'], ['It ended the need for government', 'A surplus actually led to more government to organize and protect it.'], ['It stopped rivers from flooding', 'A surplus is extra food. It has nothing to do with stopping floods.']],
      explanation: 'A surplus is extra food. With extra food, some people could do other jobs (specialization), which helped cities, trade, and government grow.' },
    { skill: 'rivers', prompt: 'Which is a sign of a <strong>civilization</strong>?',
      options: [['Cities with an organized government and a system of writing'], ['A small group that moves often to hunt and gather', 'That describes nomads, not a civilization.'], ['Living without any rules', 'Civilizations have governments and laws.'], ['Using only stone tools and no farming', 'Civilizations farm and usually develop new tools and technology.']],
      explanation: 'Civilizations have cities, organized government, religion, job specialization, social classes, art and architecture, and writing.' },

    // Mesopotamia
    { skill: 'meso', prompt: 'What does the word <strong>Mesopotamia</strong> mean?',
      options: [['"Land between the rivers"'], ['"Black land"', 'That is what Egyptians called the fertile land along the Nile (Kemet).'], ['"Middle Kingdom"', 'That is how the Chinese described China.'], ['"City of the king"', 'Think about its location between the Tigris and Euphrates.']],
      explanation: 'Mesopotamia is a Greek word meaning "land between the rivers": the Tigris and the Euphrates.' },
    { skill: 'meso', prompt: 'What was a Sumerian <strong>city-state</strong>?',
      options: [['A city and the farmland around it with its own government and ruler'], ['A country ruled by one pharaoh', 'Pharaohs ruled all of Egypt. Sumer was split into many independent cities.'], ['A small village with no leader', 'City-states had kings, laws, and armies.'], ['A temple built in the shape of a pyramid', 'That describes a ziggurat.']],
      explanation: 'Sumer was made of independent city-states like Ur, Uruk, and Lagash. Each had its own king, army, and patron god, and they often fought over water and land.' },
    { skill: 'meso', prompt: 'What was <strong>cuneiform</strong>?',
      options: [['Wedge-shaped writing pressed into clay tablets'], ['Picture writing painted on papyrus', 'That is Egyptian hieroglyphics.'], ['Writing carved on turtle shells and bones', 'That is Chinese oracle-bone writing.'], ['A kind of irrigation canal', 'Cuneiform is a writing system.']],
      explanation: 'Sumerians wrote cuneiform by pressing a reed stylus into wet clay, making wedge-shaped marks. It is one of the first writing systems.' },
    { skill: 'meso', prompt: 'Why did Sumerians first start writing?',
      options: [['To keep records of trade, taxes, and goods'], ['To write long adventure novels', 'Stories like the Epic of Gilgamesh came later. The first writing tracked business.'], ['To send messages to Egypt', 'Writing began for local record keeping.'], ['To decorate their pottery', 'Writing had a practical job: keeping track of things.']],
      explanation: 'Cuneiform began as a way to keep track of grain, animals, trade, and taxes. Later it was used for laws, letters, and stories.' },
    { skill: 'meso', prompt: 'What was a <strong>ziggurat</strong>?',
      options: [['A tall, stepped temple at the center of a Sumerian city'], ['A tomb for a pharaoh', 'Pyramids were Egyptian tombs. Ziggurats were temples.'], ['A clay tablet for writing', 'That is where cuneiform was written.'], ['A wall to keep out floods', 'That is a levee.']],
      explanation: 'A ziggurat was a large, stepped temple built for the city\'s patron god. It showed how important religion was in Sumer.' },
    { skill: 'meso', prompt: 'Who was <strong>Hammurabi</strong>?',
      options: [['A king of Babylon who wrote a famous set of laws'], ['The first pharaoh of Egypt', 'That was Menes (Narmer).'], ['The founder of Buddhism', 'That was Siddhartha Gautama.'], ['A Shang dynasty king', 'Hammurabi ruled Babylon in Mesopotamia.']],
      explanation: 'Hammurabi ruled the Babylonian Empire (about 1792–1750 BCE) and created a code of 282 laws.' },
    { skill: 'meso', prompt: 'Why was the <strong>Code of Hammurabi</strong> important?',
      options: [['It was an early written set of laws, so everyone could know the rules and punishments'], ['It gave every person exactly the same rights', 'Punishments were different depending on social class.'], ['It ended all wars in Mesopotamia', 'Laws did not stop invasions or wars.'], ['It explained how to build pyramids', 'It was a set of laws, not building instructions.']],
      explanation: 'The laws were carved on a stone pillar for all to see. Writing laws down made them public and more consistent, an idea that still matters today.' },
    { skill: 'meso', prompt: '"An eye for an eye" describes which idea from the Code of Hammurabi?',
      options: [['The punishment should match the crime'], ['Everyone should forgive every crime', 'The code was strict. Punishments were often harsh.'], ['Only kings could be punished', 'The laws applied to everyone, though not equally.'], ['Crimes should be ignored if no one saw them', 'Think about what "an eye for an eye" means.']],
      explanation: '"An eye for an eye" means the punishment was meant to match the harm done.' },
    { skill: 'meso', prompt: 'How did the floods of the Tigris and Euphrates affect farmers?',
      options: [['They were unpredictable, so farmers built canals and levees to control water'], ['They came at the same time every year, so farming was easy', 'That describes the Nile. Mesopotamia\'s floods were hard to predict.'], ['They never flooded at all', 'They did flood, sometimes violently.'], ['They only brought salt water from the sea', 'The rivers brought fresh water and silt.']],
      explanation: 'The Tigris and Euphrates flooded unpredictably and sometimes violently. Farmers worked together to build irrigation canals and levees, which needed organized government.' },
    { skill: 'meso', prompt: 'Mesopotamia had few natural barriers. What was one result?',
      options: [['It was often invaded and conquered by other groups'], ['It was completely cut off from other people', 'That is closer to ancient China. Mesopotamia was open on many sides.'], ['It never needed an army', 'Without barriers, city-states needed armies and walls.'], ['It had no trade with others', 'Open land made trade easier, too.']],
      explanation: 'Flat, open land made Mesopotamia easy to reach. Groups like the Akkadians, Babylonians, Assyrians, and Persians took control over time.' },

    // Egypt
    { skill: 'egypt', prompt: 'How were the Nile\'s floods different from Mesopotamia\'s?',
      options: [['They came at about the same time every year, so farmers could plan'], ['They were violent and unpredictable', 'That describes the Tigris and Euphrates.'], ['They happened only once every 100 years', 'The Nile flooded every year.'], ['They brought no soil', 'The Nile left behind rich black silt.']],
      explanation: 'The Nile flooded predictably each year (the season of inundation), leaving rich silt. Egyptians planned their year around it: flooding, growing, and harvest.' },
    { skill: 'egypt', prompt: 'Which way does the Nile River flow?',
      options: [['North, into the Mediterranean Sea'], ['South, into the Indian Ocean', 'It is the other way around, which is why the south is called Upper Egypt.'], ['East, into the Red Sea', 'The Nile flows north.'], ['West, into the Atlantic Ocean', 'The Nile flows north.']],
      explanation: 'The Nile flows north to the Mediterranean. That\'s why Upper Egypt is in the south (upstream) and Lower Egypt is in the north (the delta).' },
    { skill: 'egypt', prompt: 'How did the deserts around Egypt help it?',
      options: [['They were natural barriers that protected Egypt from invaders'], ['They were the best land for farming', 'Crops grew in the black land along the river, not the desert.'], ['They flooded every year', 'The river flooded, not the desert.'], ['They made trade with others impossible', 'Egyptians still traded by river and sea.']],
      explanation: 'Deserts on both sides of the Nile made it hard for armies to attack, helping Egypt stay stable for a very long time.' },
    { skill: 'egypt', prompt: 'What was <strong>papyrus</strong> used for?',
      options: [['Making paper, baskets, sandals, and boats'], ['Building the pyramids', 'Pyramids were built from stone like limestone and granite.'], ['Making bronze weapons', 'Papyrus is a plant, not a metal.'], ['Feeding animals only', 'Papyrus was a very useful natural resource for much more.']],
      explanation: 'Papyrus is a reed that grew along the Nile. Egyptians used it to make a paper-like writing material, plus rope, baskets, sandals, and boats.' },
    { skill: 'egypt', prompt: 'Who was at the <strong>top</strong> of Egypt\'s social hierarchy?',
      options: [['The pharaoh'], ['Farmers', 'Farmers were the largest group, near the bottom.'], ['Scribes', 'Scribes were respected, but in the middle.'], ['Merchants', 'Merchants and artisans were in the middle.']],
      explanation: 'The pharaoh was at the top, then government officials, priests, and nobles; then scribes; then artisans and merchants; then farmers; and servants and enslaved people at the bottom.' },
    { skill: 'egypt', prompt: 'Why did Egyptians believe the pharaoh had so much power?',
      options: [['They believed the pharaoh was a god-king'], ['The pharaoh was elected by the people', 'Pharaohs were not elected. Power passed through families.'], ['The pharaoh owned the only boat on the Nile', 'Think about religion.'], ['The pharaoh wrote the Code of Hammurabi', 'That was a king of Babylon.']],
      explanation: 'Egyptians saw the pharaoh as a god on Earth. Government and religion were joined, and the pharaoh owned the land and led the army.' },
    { skill: 'egypt', prompt: 'Who united Upper and Lower Egypt into one kingdom?',
      options: [['Menes (also called Narmer)'], ['Hammurabi', 'He ruled Babylon in Mesopotamia.'], ['Ramses II', 'Ramses II ruled much later.'], ['Tutankhamun', 'King Tut ruled much later, as a boy pharaoh.']],
      explanation: 'Around 3100 BCE, Menes (Narmer) united Upper and Lower Egypt and started the first dynasty. He wore a double crown to show both lands.' },
    { skill: 'egypt', prompt: 'What were the pyramids built for?',
      options: [['Tombs for pharaohs, to prepare them for the afterlife'], ['Temples where Sumerians prayed', 'Those were ziggurats in Mesopotamia.'], ['Storage for extra grain', 'Grain was kept in granaries.'], ['Homes for farmers', 'Farmers lived in mud-brick houses.']],
      explanation: 'Pyramids were tombs. Egyptians believed in an afterlife, so pharaohs were mummified and buried with things they would need.' },
    { skill: 'egypt', prompt: 'What are <strong>hieroglyphics</strong>?',
      options: [['Egyptian writing that uses pictures and symbols'], ['Wedge-shaped marks on clay', 'That is Sumerian cuneiform.'], ['Marks on oracle bones', 'That is Shang Chinese writing.'], ['Symbols on Indus seals', 'The Indus script is different, and still not decoded.']],
      explanation: 'Hieroglyphics used hundreds of picture symbols. The Rosetta Stone helped scholars learn to read them in the 1800s.' },

    // Indus Valley
    { skill: 'indus', prompt: 'Where did the Indus Valley civilization develop?',
      options: [['Along the Indus River in present-day Pakistan and northwest India'], ['Along the Nile in Africa', 'That is Egypt.'], ['Between the Tigris and Euphrates', 'That is Mesopotamia.'], ['Along the Yellow River', 'That is ancient China.']],
      explanation: 'The Indus Valley (Harappan) civilization grew along the Indus River in South Asia, in today\'s Pakistan and northwest India.' },
    { skill: 'indus', prompt: 'What made Harappa and Mohenjo-daro special?',
      options: [['They were carefully planned, with streets in a grid and covered drains'], ['They were built around giant pyramids', 'Pyramids were in Egypt.'], ['They were ruled by pharaohs', 'Pharaohs ruled Egypt.'], ['They were built on islands in the ocean', 'They were river cities.']],
      explanation: 'Indus cities had straight streets in a grid, standard-sized baked bricks, wells, bathrooms, and covered drains: some of the best city planning in the ancient world.' },
    { skill: 'indus', prompt: 'What was the <strong>Great Bath</strong>?',
      options: [['A large, waterproof pool at Mohenjo-daro, probably used for ritual bathing'], ['A canal that connected two rivers', 'It was a building in the city, not a canal.'], ['The pharaoh\'s private swimming pool', 'There were no pharaohs in the Indus Valley.'], ['A flood that destroyed Harappa', 'The Great Bath was a structure people built.']],
      explanation: 'The Great Bath was a large brick pool sealed with tar. Many historians think it was used for religious cleansing.' },
    { skill: 'indus', prompt: 'What do standard bricks and weights tell historians about Indus cities?',
      options: [['There was likely a strong, organized system that set the same rules across many cities'], ['Every family made their own different bricks', 'The bricks were the same size in many cities.'], ['The people did not trade', 'Standard weights helped with trade.'], ['The cities were built by Egyptians', 'Indus cities were built by their own people.']],
      explanation: 'Bricks and weights were the same across many cities. That suggests careful planning, organized government, and fair trade.' },
    { skill: 'indus', prompt: 'How do we know the Indus Valley traded with Mesopotamia?',
      options: [['Indus seals and beads have been found in Mesopotamia'], ['They wrote letters that we can read today', 'The Indus script has not been deciphered yet.'], ['They shared the same river', 'They were on different rivers, far apart.'], ['Hammurabi visited Mohenjo-daro', 'There is no record of that.']],
      explanation: 'Archaeologists have found Indus seals, beads, and other goods in Mesopotamian cities. Traders likely traveled by land and by sea.' },
    { skill: 'indus', prompt: 'Why can\'t historians read Indus Valley writing yet?',
      options: [['The script has not been deciphered: no one has found a "key" to translate it'], ['They never had any writing', 'They did. Their symbols appear on seals.'], ['All of it was destroyed in floods', 'Many seals with writing survive.'], ['It is the same as cuneiform', 'It is a different, unknown script.']],
      explanation: 'The Indus script appears on many small seals, but the texts are very short and there is no bilingual "Rosetta Stone," so it remains a mystery.' },
    { skill: 'indus', prompt: 'Which is a possible reason the Indus Valley cities declined around 1900 BCE?',
      options: [['Changes in climate and rivers, such as drought or shifting rivers'], ['They were conquered by the Shang dynasty', 'China was far away and the Shang came later.'], ['Hammurabi destroyed them', 'There is no evidence of that.'], ['They ran out of bricks', 'Historians point to environmental changes instead.']],
      explanation: 'Historians are not sure, but likely causes include climate change, drought, flooding, and rivers changing course.' },

    // Roots of Hinduism and Buddhism
    { skill: 'beliefs', prompt: 'Which belief is part of <strong>Hinduism</strong>?',
      options: [['Reincarnation: the soul is reborn in a new body'], ['There is only one life and no rebirth', 'Hinduism teaches that souls are reborn many times.'], ['The pharaoh is a god-king', 'That was an Egyptian belief.'], ['The Mandate of Heaven', 'That was a Chinese idea about rulers.']],
      explanation: 'Hindus believe in reincarnation, karma (actions have consequences), and dharma (doing one\'s duty).' },
    { skill: 'beliefs', prompt: 'What is <strong>karma</strong>?',
      options: [['The idea that good or bad actions affect your future lives'], ['A type of temple', 'A temple is a building. Karma is an idea about actions.'], ['A sacred river', 'The Ganges is a sacred river. Karma is about actions.'], ['The founder of Buddhism', 'That was Siddhartha Gautama.']],
      explanation: 'Karma means that a person\'s actions (good or bad) shape what happens to them in the future, including in their next life.' },
    { skill: 'beliefs', prompt: 'What were the <strong>Vedas</strong>?',
      options: [['Ancient sacred texts that are the roots of Hinduism'], ['Laws carved on a stone pillar', 'That is the Code of Hammurabi.'], ['Bones used to ask questions of ancestors', 'Those are Chinese oracle bones.'], ['The rules of Buddhism', 'The Vedas are older, Hindu texts.']],
      explanation: 'The Vedas are hymns and teachings written in Sanskrit, brought by the Indo-Aryans who moved into India around 1500 BCE. They became the roots of Hinduism.' },
    { skill: 'beliefs', prompt: 'How did the <strong>caste system</strong> organize society in ancient India?',
      options: [['People were born into social groups that set their jobs and status'], ['Everyone could pick any job they wanted', 'In the caste system, your group was set at birth.'], ['Only farmers were allowed to own land', 'Castes organized all of society, not just farmers.'], ['The pharaoh chose each person\'s job', 'There were no pharaohs in India.']],
      explanation: 'The caste system divided people into groups by birth. Brahmins (priests) were at the top, then Kshatriyas (rulers and warriors), Vaishyas (merchants and farmers), and Shudras (laborers).' },
    { skill: 'beliefs', prompt: 'Who founded <strong>Buddhism</strong>?',
      options: [['Siddhartha Gautama, a prince who became the Buddha'], ['Hammurabi', 'He was a king of Babylon.'], ['Confucius', 'Confucius was a Chinese thinker.'], ['Menes', 'Menes united Egypt.']],
      explanation: 'Siddhartha Gautama was a prince who left his wealthy life to understand suffering. After reaching enlightenment, he was called the Buddha, "the enlightened one."' },
    { skill: 'beliefs', prompt: 'What is the goal in Buddhism?',
      options: [['Reaching nirvana, a state of peace that ends suffering'], ['Becoming a pharaoh', 'That is Egyptian, not Buddhist.'], ['Building the tallest temple', 'Buddhism focuses on the mind, not buildings.'], ['Moving up the caste system', 'The Buddha taught that anyone could reach enlightenment, whatever their caste.']],
      explanation: 'Buddhists follow the Four Noble Truths and the Eightfold Path to end suffering and reach nirvana.' },
    { skill: 'beliefs', prompt: 'How was Buddhism different from the caste system?',
      options: [['The Buddha taught that people of any caste could reach enlightenment'], ['Buddhism made the castes stricter', 'It was the opposite: the Buddha welcomed everyone.'], ['Buddhism only allowed priests to pray', 'Buddhism was open to all people.'], ['Buddhism said karma does not exist', 'Buddhism kept the ideas of karma and rebirth.']],
      explanation: 'The Buddha rejected the idea that birth decides your spiritual worth. Anyone who followed the Eightfold Path could reach enlightenment.' },

    // China
    { skill: 'china', prompt: 'Why is the Yellow River called "yellow"?',
      options: [['It carries yellow silt called loess'], ['Its water is full of gold', 'Think about the soil, not gold.'], ['It is lined with yellow flowers', 'The color comes from the silt in the water.'], ['The emperor painted it', 'The color is natural.']],
      explanation: 'The Huang He (Yellow River) carries huge amounts of fine yellow soil called loess, which makes farmland rich.' },
    { skill: 'china', prompt: 'Why was the Yellow River also called "China\'s Sorrow"?',
      options: [['Its floods were huge and often deadly'], ['It never had enough water for farming', 'It had plenty of water, sometimes too much.'], ['It was where wars were fought', 'The name comes from the river itself.'], ['It was too cold to live near', 'Think about floods.']],
      explanation: 'The Yellow River\'s floods could destroy villages and kill many people, so the river was both a blessing (rich soil) and a sorrow (dangerous floods).' },
    { skill: 'china', prompt: 'Which geographic features isolated ancient China?',
      options: [['Mountains, deserts, and the ocean'], ['The Nile and the Mediterranean Sea', 'Those are near Egypt.'], ['The Tigris and Euphrates Rivers', 'Those are in Mesopotamia.'], ['Flat open plains on every side', 'Open plains would make China easy to reach, not isolated.']],
      explanation: 'The Himalayas and Tibetan Plateau, the Gobi and Taklamakan Deserts, and the Pacific Ocean cut China off from other civilizations.' },
    { skill: 'china', prompt: 'How did being isolated affect ancient China?',
      options: [['Its culture developed mostly on its own, and Chinese people saw China as the center of the world'], ['It copied everything from Egypt', 'Isolation meant very little contact with Egypt.'], ['It was conquered by Mesopotamia', 'Mesopotamia was far away beyond mountains and deserts.'], ['It had no farming', 'China had rich farmland along its rivers.']],
      explanation: 'Isolation let China develop its own writing, beliefs, and traditions. The Chinese called their land the "Middle Kingdom."' },
    { skill: 'china', prompt: 'What were <strong>oracle bones</strong>?',
      options: [['Bones or shells that Shang kings used to ask ancestors questions'], ['Clay tablets for laws', 'Clay tablets were used in Mesopotamia.'], ['Tools for planting rice', 'Oracle bones were used for religion and fortune-telling.'], ['Weights used in Indus trade', 'Those were standard stone weights.']],
      explanation: 'Priests carved questions on turtle shells or animal bones, heated them until they cracked, and read the cracks as answers. These carvings are the oldest known Chinese writing.' },
    { skill: 'china', prompt: 'What is a <strong>dynasty</strong>?',
      options: [['A series of rulers from the same family'], ['A type of temple', 'A dynasty is about rulers.'], ['A flood season', 'A dynasty is a ruling family.'], ['A trade route', 'A dynasty is a ruling family.']],
      explanation: 'A dynasty is a line of rulers from one family. Chinese history is often told dynasty by dynasty.' },
    { skill: 'china', prompt: 'The Shang dynasty is known for…',
      options: [['oracle-bone writing and bronze work'], ['building the pyramids', 'That was Egypt.'], ['the Code of Hammurabi', 'That was Babylon.'], ['planned cities with the Great Bath', 'That was the Indus Valley.']],
      explanation: 'The Shang (about 1600–1046 BCE) left the first written Chinese records on oracle bones and made beautiful bronze vessels.' },
    { skill: 'china', prompt: 'What was the <strong>Mandate of Heaven</strong>?',
      options: [['The belief that heaven gave a ruler the right to rule, but could take it away if he ruled badly'], ['A list of 282 laws', 'That was Hammurabi\'s Code.'], ['A prayer to the Nile', 'That is Egyptian.'], ['The path to nirvana', 'That is Buddhism.']],
      explanation: 'The Zhou used the Mandate of Heaven to explain why they overthrew the Shang: an unjust ruler loses heaven\'s support. Floods, famine, or revolts were seen as signs.' },
    { skill: 'china', prompt: 'Which dynasty lasted the longest in Chinese history?',
      options: [['The Zhou dynasty'], ['The Shang dynasty', 'The Shang lasted about 550 years. Another lasted longer.'], ['The Xia dynasty', 'The Xia is mostly known from legends.'], ['The Babylonian dynasty', 'Babylon was in Mesopotamia.']],
      explanation: 'The Zhou dynasty ruled from about 1046 to 256 BCE, almost 800 years. Thinkers like Confucius lived near its end.' },
    { skill: 'china', prompt: 'How did the Zhou organize their large kingdom?',
      options: [['The king gave land to loyal lords, who ruled it and sent soldiers when needed'], ['Every city was fully independent like Sumer', 'Zhou lords owed loyalty to the king.'], ['The pharaoh owned all the land', 'There were no pharaohs in China.'], ['Priests elected a new king each year', 'Rule passed through the royal family.']],
      explanation: 'The Zhou used a system like feudalism: the king granted land to nobles in return for loyalty and military service. Over time, the lords became powerful and fought each other.' },

    // Compare
    { skill: 'compare', prompt: 'Which two civilizations had floods that were hard to predict and very dangerous?',
      options: [['Mesopotamia and ancient China'], ['Egypt and Mesopotamia', 'Egypt\'s Nile flooded predictably.'], ['Egypt and the Indus Valley', 'Egypt\'s floods were predictable.'], ['Only Egypt', 'Egypt\'s floods were the most predictable of all.']],
      explanation: 'The Tigris and Euphrates and the Yellow River flooded unpredictably and sometimes violently. The Nile was the most predictable.' },
    { skill: 'compare', prompt: 'What did ALL four river valley civilizations have in common?',
      options: [['They farmed rich soil left by river floods and developed cities and writing'], ['They were all ruled by pharaohs', 'Only Egypt had pharaohs.'], ['They all built pyramids', 'Only Egypt built pyramids.'], ['They all had the same religion', 'Their beliefs were very different.']],
      explanation: 'All four depended on rivers for farming, grew food surpluses, built cities, formed governments, and developed writing.' },
    { skill: 'compare', prompt: 'Which writing system goes with which civilization?',
      options: [['Cuneiform – Mesopotamia; hieroglyphics – Egypt; oracle bones – China'], ['Cuneiform – Egypt; hieroglyphics – China; oracle bones – Mesopotamia', 'Mixed up! Cuneiform was pressed into clay in Sumer.'], ['Hieroglyphics – Mesopotamia; cuneiform – China; oracle bones – Egypt', 'Mixed up! Hieroglyphics are Egyptian.'], ['All of them used the same alphabet', 'Each civilization developed its own writing.']],
      explanation: 'Mesopotamia: cuneiform on clay. Egypt: hieroglyphics on papyrus and stone. China: characters on oracle bones. The Indus script is still undeciphered.' },
    { skill: 'compare', prompt: 'Which civilization was the MOST protected by natural barriers?',
      options: [['Ancient China (mountains, deserts, and ocean)'], ['Mesopotamia', 'Mesopotamia was open and often invaded.'], ['Sumer\'s city-states', 'Sumer was in open Mesopotamia.'], ['Babylon', 'Babylon was in open Mesopotamia and was conquered several times.']],
      explanation: 'China was surrounded by mountains, deserts, and the ocean. Egypt had desert protection too. Mesopotamia had very little.' },
  ];

  BANK.push(
    // Map skills
    { skill: 'distance', prompt: 'What does a <strong>map scale</strong> tell you?',
      options: [['How a distance on the map compares to the real distance on Earth'], ['Which way is north', 'That is the compass rose.'], ['What the symbols on the map mean', 'That is the map key (legend).'], ['The exact latitude of a place', 'Latitude comes from the grid lines, not the scale.']],
      explanation: 'A scale bar shows how much real distance one length on the map stands for, like "this bar = 200 miles."' },
    { skill: 'distance', prompt: 'The scale bar on a map stands for <strong>200 miles</strong>. A line between two cities is exactly <strong>3 scale bars</strong> long. How far apart are the cities?',
      options: [['600 miles'], ['3 miles', 'That is the number of scale bars. Each bar stands for 200 miles.'], ['203 miles', 'Multiply, don\'t add: 3 × 200.'], ['200 miles', 'That is just one scale bar. The line is 3 bars long.']],
      explanation: '3 scale bars × 200 miles per bar = 600 miles.' },
    { skill: 'distance', prompt: 'How can you measure a distance with a scale bar if you don\'t have a ruler?',
      options: [['Mark the two points on the edge of a strip of paper, then lay the strip along the scale bar'], ['Guess based on how big the country looks', 'Guessing isn\'t measuring. Use the scale bar.'], ['Count the latitude lines', 'Latitude lines help find location, but the scale bar finds distance.'], ['Measure the compass rose', 'The compass rose shows direction, not distance.']],
      explanation: 'Mark both points on a paper strip, then lay it along the scale bar to count how many bars long it is. Multiply by the bar\'s distance.' },
    { skill: 'distance', prompt: 'Sri Lanka measures about <strong>130 miles</strong> wide and <strong>270 miles</strong> long on the map. Using Length × Width, about what is its area?',
      options: [['About 35,000 square miles'], ['About 400 square miles', '130 + 270 = 400, but area means multiplying: 130 × 270.'], ['About 3,500 square miles', 'Check your zeros: 130 × 270 = 35,100.'], ['About 270 miles', 'That is just the length. Area is length × width, in square miles.']],
      explanation: '130 × 270 = 35,100, so about 35,000 square miles. (Sri Lanka\'s real area is about 25,000 square miles, because it isn\'t a rectangle.)' },
    { skill: 'distance', prompt: 'Why is Length × Width only an <strong>estimate</strong> of Sri Lanka\'s area?',
      options: [['Sri Lanka isn\'t a perfect rectangle, so the rectangle includes some ocean'], ['Because it is not an absolute location', 'Absolute location is about latitude and longitude, not area.'], ['Because islands do not have an area', 'Every island has an area. The problem is its shape.'], ['Because the scale bar only works on land', 'The scale works everywhere on the map.']],
      explanation: 'L × W gives the exact area of a rectangle. Sri Lanka is shaped more like a teardrop, so the rectangle covers extra water. Map measurements are also rounded.' },
    { skill: 'latlong', prompt: 'Lines of <strong>latitude</strong> measure distance…',
      options: [['north or south of the Equator'], ['east or west of the Prime Meridian', 'That is longitude.'], ['from one city to another', 'That is what a map scale measures.'], ['above sea level', 'That is elevation.']],
      explanation: 'Latitude lines run east–west and measure how far north or south a place is from the Equator (0°).' },
    { skill: 'latlong', prompt: 'Lines of <strong>longitude</strong> measure distance…',
      options: [['east or west of the Prime Meridian'], ['north or south of the Equator', 'That is latitude.'], ['between mountains', 'Longitude is about east–west position.'], ['across an ocean only', 'Longitude lines cover the whole Earth.']],
      explanation: 'Longitude lines run from the North Pole to the South Pole and measure how far east or west a place is from the Prime Meridian (0°).' },
    { skill: 'latlong', prompt: 'How do you write an absolute location?',
      options: [['Latitude first, then longitude, like (20°N, 80°E)'], ['Longitude first, then latitude, like (80°E, 20°N)', 'Latitude always comes first.'], ['Just the country name', 'That is a place name, not an absolute location.'], ['The distance in miles', 'Distance comes from the scale bar.']],
      explanation: 'Absolute location is written (latitude, longitude). Remember: "latitude is like the rungs of a ladder (lat-der)," and it goes first.' },
    { skill: 'latlong', prompt: 'What is <strong>absolute location</strong>?',
      options: [['The exact spot of a place, given by latitude and longitude'], ['Where a place is compared to other places', 'That is relative location.'], ['How far apart two places are', 'That is distance.'], ['The biggest city in a country', 'Absolute location is about an exact position on Earth.']],
      explanation: 'Absolute location is an exact address on Earth, like (28°N, 87°E) for Mount Everest.' },
    { skill: 'latlong', prompt: 'India is in which two hemispheres?',
      options: [['Northern and Eastern'], ['Southern and Western', 'India is north of the Equator and east of the Prime Meridian.'], ['Northern and Western', 'India\'s longitudes are °E, so it is in the Eastern Hemisphere.'], ['Southern and Eastern', 'India\'s latitudes are °N, so it is in the Northern Hemisphere.']],
      explanation: 'All of India\'s latitudes are °N and its longitudes are °E, so it is in the Northern and Eastern Hemispheres.' },
    { skill: 'latlong', prompt: 'Which is the best estimate for the absolute location of the <strong>mouth of the Ganges River</strong>?',
      options: [['(22°N, 90°E)'], ['(34°N, 85°E)', 'That is up in the mountains of Tibet. The mouth is where the river meets the Bay of Bengal.'], ['(22°N, 68°E)', 'That is near the mouth of the Indus, on the Arabian Sea.'], ['(90°N, 22°E)', 'Latitude and longitude are switched. Write latitude first.']],
      explanation: 'The Ganges flows east and empties into the Bay of Bengal at about 22°N, 90°E (in Bangladesh).' },
    { skill: 'direction', prompt: 'What is <strong>relative location</strong>?',
      options: [['Describing where a place is compared to other places'], ['The exact latitude and longitude of a place', 'That is absolute location.'], ['How many people live in a place', 'That is population.'], ['The distance shown on a scale bar', 'That is map scale.']],
      explanation: 'Relative location uses other places: "Sri Lanka is southeast of India, in the Indian Ocean."' },
    { skill: 'direction', prompt: 'Which sentence describes the <strong>relative location</strong> of Sri Lanka?',
      options: [['Sri Lanka is an island southeast of India, in the Indian Ocean.'], ['Sri Lanka is at about 7°N, 81°E.', 'That is absolute location (latitude and longitude).'], ['Sri Lanka is about 270 miles long.', 'That is its size, not its location.'], ['Sri Lanka is a country.', 'That doesn\'t say where it is. Compare it to nearby places.']],
      explanation: 'Relative location compares a place to its neighbors: Sri Lanka is off the southeast tip of India, across the Palk Strait, in the Indian Ocean.' },
    { skill: 'direction', prompt: 'Mount Everest is mostly north and a little west of the middle of the Bay of Bengal. Which <strong>intermediate direction</strong> fits best?',
      options: [['Northwest'], ['Northeast', 'Everest is a little west of the Bay\'s middle, not east.'], ['Southeast', 'Everest is north of the Bay, up in the Himalayas.'], ['Southwest', 'Everest is north of the Bay, not south.']],
      explanation: 'Everest (about 87°E) is north of the Bay of Bengal and slightly west of its middle (about 88–90°E), so northwest is the best fit.' },
    { skill: 'direction', prompt: 'What are the <strong>intermediate directions</strong>?',
      options: [['Northeast, southeast, southwest, and northwest'], ['North, south, east, and west', 'Those are the cardinal directions.'], ['Up, down, left, and right', 'Maps use compass directions instead.'], ['Latitude and longitude', 'Those are grid lines, not directions.']],
      explanation: 'Intermediate directions fall between the cardinal directions: NE, SE, SW, and NW.' },
    { skill: 'direction', prompt: 'Which body of water is <strong>west</strong> of India?',
      options: [['The Arabian Sea'], ['The Bay of Bengal', 'The Bay of Bengal is east of India.'], ['The Mediterranean Sea', 'That is far away, near Egypt.'], ['The Yellow River', 'That is a river in China.']],
      explanation: 'The Arabian Sea is west of India, the Bay of Bengal is east, and the Indian Ocean is south.' },
  );

  const toQuestion = (skill, prompt, options, explanation, hint) => {
    const opts = shuffle(options.map(([html, h], i) => ({ html, correct: i === 0, hint: h })))
      .map((o, i) => ({ ...o, id: 'ABCD'[i] }));
    return {
      type: skill, skill: SKILLS[skill],
      prompt, summary: prompt.replace(/<[^>]+>/g, ''),
      format: 'mc', options: opts, textOptions: true,
      check: (id) => {
        const opt = opts.find((o) => o.id === id);
        if (!opt) return { status: 'invalid', message: 'Choose one of the answers.' };
        return opt.correct ? { status: 'correct' } : { status: 'incorrect', message: opt.hint };
      },
      hint: hint || 'Think back to the lesson. Which civilization, river, or idea does this describe?',
      explanation, solution: options[0][0],
    };
  };

  // ---------- Generated questions ----------
  // "Which river…?" and "Which civilization…?" built from the data, one factory per civilization.
  const riverFactories = CIVS.map((c) => () => toQuestion('compare',
    `${c.name} developed along which river (or rivers)?`,
    [[c.river], ...shuffle(CIVS.filter((o) => o !== c)).map((o) => [o.river, `The ${o.river} ${o.key === 'meso' ? 'are' : 'is'} where ${o.name} grew.`])],
    `${c.name} grew along the ${c.river}, in what is now ${c.today}.`,
    'Match each civilization to its river: Tigris & Euphrates, Nile, Indus, Yellow.'));

  const clueFactories = CIVS.map((c) => c.clues.map((clue) => () => toQuestion(c.key,
    `Which civilization ${clue}?`,
    [[c.name], ...CIVS.filter((o) => o !== c).map((o) => [o.name, `${o.name} is known for ${o.achievement}.`])],
    `${c.name} ${clue}. It is known for ${c.achievement}.`)));

  // Map questions drawn on the South Asia map.
  const M = SouthAsiaMap;
  const PLACE_KEYS = Object.keys(M.PLACES);
  const placeName = (p) => p.short || p.name;

  function mapDistance() {
    let a; let b; let d;
    do {
      [a, b] = Util.pickTwo(PLACE_KEYS).map((k) => M.PLACES[k]);
      d = M.miles(a.at, b.at);
    } while (d < 300 || d > 1700);
    const ans = M.roundTo(d, 50);
    const bars = d / M.SCALE_MILES;
    const q = toQuestion('distance',
      `Use the map scale. About how far is it from <strong>${placeName(a)}</strong> to <strong>${placeName(b)}</strong>?`,
      [
        [`About ${ans.toLocaleString()} miles`],
        [`About ${M.roundTo(d * 0.5, 50).toLocaleString()} miles`, 'Too short. Count how many scale bars fit along the dashed line, then multiply by 200.'],
        [`About ${M.roundTo(d * 1.6, 50).toLocaleString()} miles`, 'Too long. Lay the scale bar along the line again and count carefully.'],
        [`About ${Math.max(1, Math.round(bars))} miles`, 'That is how many scale bars long the line is. Each bar stands for 200 miles, so multiply by 200.'],
      ],
      `The line is about ${bars.toFixed(1)} scale bars long. ${bars.toFixed(1)} × 200 ≈ ${ans.toLocaleString()} miles.`,
      'Mark the line\'s length (a paper strip works), count how many 200-mile scale bars fit, then multiply by 200.');
    q.visualHtml = M.render({ labels: false, line: [a.at, b.at], markers: [{ at: a.at, label: placeName(a) }, { at: b.at, label: placeName(b) }] });
    q.summary = `Distance ${placeName(a)} to ${placeName(b)}`;
    return q;
  }

  function mapLatLon() {
    const lat = pick([10, 15, 20, 25, 30, 35]);
    const lon = pick([65, 70, 75, 80, 85, 90, 95]);
    const letter = pick(['A', 'B', 'C', 'D']);
    const loc = (la, lo) => `(${la}°N, ${lo}°E)`;
    const lat2 = lat + 5 <= 35 ? lat + 5 : lat - 5;
    const lon2 = lon + 5 <= 95 ? lon + 5 : lon - 5;
    const q = toQuestion('latlong',
      `What is the latitude and longitude of point <strong>${letter}</strong>?`,
      [
        [loc(lat, lon)],
        [`(${lon}°N, ${lat}°E)`, 'Latitude and longitude are switched. Write latitude (°N) first, then longitude (°E).'],
        [loc(lat2, lon), `Check the latitude: find the °N line that runs east–west through point ${letter}.`],
        [loc(lat, lon2), `Check the longitude: find the °E line that runs north–south through point ${letter}.`],
      ],
      `Point ${letter} sits where the ${lat}°N latitude line crosses the ${lon}°E longitude line: ${loc(lat, lon)}.`,
      'Follow the horizontal line to the right edge for latitude (°N). Follow the vertical line to the top for longitude (°E).');
    q.visualHtml = M.render({ labels: false, markers: [{ at: [lon, lat], label: letter, kind: 'letter' }] });
    q.summary = `Lat/long of ${loc(lat, lon)}`;
    return q;
  }

  function mapDirection() {
    let a; let b; let dir;
    do {
      [a, b] = Util.pickTwo(PLACE_KEYS).map((k) => M.PLACES[k]);
      dir = M.direction(a.at, b.at);
    } while (dir.off > 15 || M.miles(a.at, b.at) < 250);
    const D = M.DIRS;
    const i = dir.index;
    const cap = (t) => t[0].toUpperCase() + t.slice(1);
    const q = toQuestion('direction',
      `Look at the map. <strong>${cap(placeName(b))}</strong> is ________ of <strong>${placeName(a)}</strong>.`,
      [
        [D[i]],
        [D[(i + 4) % 8], `That is backwards. Start at ${placeName(a)} and look toward ${placeName(b)}.`],
        [D[(i + 2) % 8], 'Use the compass rose: north is toward the top of the map.'],
        [D[(i + 6) % 8], 'Use the compass rose: north is toward the top of the map.'],
      ],
      `Starting at ${placeName(a)}, you travel ${D[i]} to reach ${placeName(b)}.`,
      'Put your finger on the starting place, then see which way you move to reach the other place. Top = north, right = east.');
    q.visualHtml = M.render({ labels: false, markers: [{ at: a.at, label: placeName(a) }, { at: b.at, label: placeName(b) }] });
    q.summary = `Direction from ${placeName(a)} to ${placeName(b)}`;
    return q;
  }

  const FACTORIES = {};
  BANK.forEach((item) => (FACTORIES[item.skill] ||= []).push(() => toQuestion(item.skill, item.prompt, item.options, item.explanation)));
  FACTORIES.compare.push(...riverFactories);
  CIVS.forEach((c, i) => FACTORIES[c.key].push(...clueFactories[i]));
  // Map questions show up about as often as all the written ones for the skill.
  FACTORIES.distance.push(...Array(5).fill(mapDistance));
  FACTORIES.latlong.push(...Array(6).fill(mapLatLon));
  FACTORIES.direction.push(...Array(5).fill(mapDirection));

  // Picks `count` different questions from the given skills, rotating so each skill shows up.
  function buildSession(skills, count) {
    const seen = new Set();
    const picked = [];
    for (let tries = 0; picked.length < count && tries < 60; tries++) {
      for (const skill of shuffle(skills)) {
        if (picked.length >= count) break;
        const q = pick(FACTORIES[skill])();
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
      <p>By the end of this lesson, you should be able to say:</p>
      <ul class="checklist targets">${list.map((t) => `<li>${t}</li>`).join('')}</ul>
      <p class="muted small">Come back to this list when you finish. Can you do each one?</p>`,
  });

  const qa = (items) => `<div class="qa-list">${items.map(([q, a]) => `
    <details class="qa"><summary>${q}</summary><div class="qa-answer">${a}</div></details>`).join('')}</div>`;

  const glossary = (items) => `<dl class="glossary">${items.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>`;

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

  // Location card: river, modern country, and how the floods behaved.
  const factCard = (c, extra = '') => `
    <div class="fact-card" style="--civ:${c.color}">
      <span class="fact-icon" aria-hidden="true">${c.icon}</span>
      <dl>
        <div><dt>River</dt><dd>${c.river}</dd></div>
        <div><dt>Today</dt><dd>${c.today}</dd></div>
        <div><dt>Floods</dt><dd>${c.floods}</dd></div>
        <div><dt>When</dt><dd>about ${c.from} – ${c.to} BCE (${c.span})</dd></div>
        ${extra}
      </dl>
    </div>`;

  // Bars on a 3500 BCE → 0 timeline.
  const timeline = () => `
    <div class="civ-timeline" role="img" aria-label="Timeline: ${CIVS.map((c) => `${c.name} about ${c.from} to ${c.to} BCE`).join('; ')}">
      ${CIVS.map((c) => `
        <div class="civ-row">
          <span class="civ-name">${c.icon} ${c.name}</span>
          <span class="civ-track"><span class="civ-bar" style="--civ:${c.color};left:${((3500 - c.from) / 3500) * 100}%;width:${((c.from - c.to) / 3500) * 100}%">${c.from}–${c.to} BCE</span></span>
        </div>`).join('')}
      <div class="civ-row civ-axis"><span></span><span class="civ-track"><span>3500 BCE</span><span>2500</span><span>1500</span><span>500</span><span>0</span></span></div>
    </div>`;

  // ---------- Lessons ----------
  const startHere = {
    id: 40,
    short: 'Start here',
    navTitle: 'Start here: Rivers & civilization',
    title: 'Start Here: How Rivers Shaped Civilization',
    blurb: 'Why the first civilizations grew along rivers, what makes a civilization, and a timeline of all four.',
    art: '<span class="lesson-emoji">🌊🌾🏙️</span>',
    sessionLength: 6,
    skills: ['rivers', 'compare'],
    steps: [
      targets([
        'I can explain why early people settled along rivers.',
        'I can describe how floods, silt, and irrigation helped farming.',
        'I can explain how a food surplus led to cities, jobs, and government.',
        'I can name the four river valley civilizations and their rivers.',
      ]),
      {
        title: 'From farms to cities',
        html: `
          <p>Long ago, most people were <strong>nomads</strong> who moved to hunt and gather food. When people learned to farm, they could stay in one place. The best farmland was next to <strong>rivers</strong>.</p>
          <ol class="language-list">
            <li><strong>Water</strong>: for drinking, crops, and animals.</li>
            <li><strong>Floods</strong> left <strong>silt</strong>: rich soil that made crops grow.</li>
            <li><strong>Irrigation</strong> canals carried river water to fields.</li>
            <li>Farmers grew a <strong>surplus</strong> (extra food).</li>
            <li>Not everyone had to farm, so people could do other jobs: <strong>specialization</strong>.</li>
            <li>Villages grew into <strong>cities</strong> that needed leaders, laws, and record keeping: <strong>government</strong> and <strong>writing</strong>.</li>
          </ol>
          <div class="callout">Big idea: <strong>geography and water shaped how early humans organized</strong> their societies.</div>`,
      },
      {
        title: 'What makes a civilization?',
        html: `
          <p>Historians use these features to decide if a society is a <strong>civilization</strong>:</p>
          <ul class="tips">
            <li>🏙️ <strong>Cities</strong> with many people</li>
            <li>👑 <strong>Organized government</strong> and laws</li>
            <li>🙏 <strong>Religion</strong></li>
            <li>🔨 <strong>Job specialization</strong></li>
            <li>📊 <strong>Social classes</strong> (a social hierarchy)</li>
            <li>🏛️ <strong>Art and architecture</strong></li>
            <li>✍️ A system of <strong>writing</strong></li>
          </ul>
          <p>Which is <strong>not</strong> a feature of a civilization?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: 'A system of writing', correct: false, feedback: 'Writing is a key feature. It let people keep records and laws.' },
            { label: 'Moving often to follow animal herds', correct: true, feedback: 'Right! That describes nomads. Civilizations settle in cities.' },
            { label: 'Job specialization', correct: false, feedback: 'Specialization is a feature. A surplus let people take on other jobs.' },
          ]);
        },
      },
      {
        title: 'Four river valley civilizations',
        html: `
          <table class="map-table">
            <thead><tr><th>Civilization</th><th>River</th><th>Today</th><th>Known for</th></tr></thead>
            <tbody>${CIVS.map((c) => `<tr><td><strong>${c.icon} ${c.name}</strong></td><td>${c.river}</td><td>${c.today}</td><td>${c.achievement}</td></tr>`).join('')}</tbody>
          </table>
          <h3>Timeline (dates are approximate)</h3>
          ${timeline()}
          <p class="muted small">BCE means "before the Common Era." Bigger BCE numbers are <em>longer ago</em>, so time moves left to right toward 0.</p>`,
      },
      {
        title: 'Questions & answers',
        html: qa([
          ['Why did early civilizations form near rivers?', 'Rivers gave fresh water, fertile soil (silt) from floods, fish, and transportation for trade. This let people farm and settle in one place.'],
          ['How did farming lead to government?', 'Farming produced a surplus, cities grew, and people needed leaders to organize irrigation projects, store food, settle arguments, and protect the city.'],
          ['What is the difference between a nomad and a farmer?', 'Nomads move from place to place to hunt and gather. Farmers stay in one place to grow crops and raise animals.'],
          ['Were all river floods helpful?', 'Floods brought silt, but they could also destroy homes. The Nile flooded predictably; the Tigris, Euphrates, and Yellow Rivers were harder to predict and could be deadly.'],
          ['What is a social hierarchy?', 'A ranking of groups in a society from most to least powerful, such as rulers and priests at the top and farmers and enslaved people near the bottom.'],
        ]),
      },
    ],
  };

  // ---------- Map skills ----------
  const PRESET_TEXT = (m) => `📏 The line is <strong>${m.bars.toFixed(1)}</strong> scale bars long → ${m.bars.toFixed(1)} × 200 ≈ <strong>${M.roundTo(m.miles, 10).toLocaleString()} miles</strong>.`;
  const FIND = [
    ['indus', 'Indus River'], ['ganges', 'Ganges River'], ['brahmaputra', 'Brahmaputra River'],
    ['arabianSea', 'Arabian Sea'], ['bayOfBengal', 'Bay of Bengal'], ['indianOcean', 'Indian Ocean'],
    ['himalayas', 'Himalayas'], ['everest', 'Mt. Everest'], ['hinduKush', 'Hindu Kush'],
    ['westernGhats', 'Western Ghats'], ['easternGhats', 'Eastern Ghats'], ['deccan', 'Deccan Plateau'],
    ['thar', 'Thar Desert'], ['sriLanka', 'Sri Lanka'],
  ];

  const maps = {
    id: 46,
    short: 'Map skills',
    navTitle: 'Map skills: Distance & location',
    title: 'Map Skills: Distance, Location & Direction in South Asia',
    blurb: 'Use a map scale to measure distance, find latitude and longitude, describe direction and relative location, and estimate area.',
    art: '<span class="lesson-emoji">🗺️📏</span>',
    sessionLength: 8,
    skills: ['distance', 'latlong', 'direction'],
    steps: [
      targets([
        'I can use a map scale to find the distance between two places.',
        'I can find the latitude and longitude (absolute location) of a place.',
        'I can use cardinal and intermediate directions.',
        'I can describe the relative location of a place.',
        'I can estimate area using Length × Width and explain why it is an estimate.',
      ]),
      {
        title: 'Reading a map scale',
        html: `
          <p>A <strong>map scale</strong> (scale bar) shows how a distance on the map compares to the real distance on Earth. On our map, one bar stands for <strong>200 miles</strong>.</p>
          <ol class="language-list">
            <li>Lay the edge of a strip of paper between the two places. Make a mark at each place.</li>
            <li>Line up the first mark with <strong>0</strong> on the scale bar.</li>
            <li>Count how many scale bars fit between the marks (you can use halves!).</li>
            <li><strong>Multiply</strong>: number of bars × 200 miles.</li>
          </ol>
          <div class="callout">Example: the line is <strong>4½</strong> scale bars long → 4.5 × 200 = <strong>900 miles</strong>.</div>
          <p>A line is <strong>2½</strong> scale bars long. How far is that?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: '2.5 miles', correct: false, feedback: 'That is how many bars long it is. Each bar is 200 miles.' },
            { label: '500 miles', correct: true, feedback: 'Yes! 2.5 × 200 = 500 miles.' },
            { label: '202.5 miles', correct: false, feedback: 'Multiply, don\'t add: 2.5 × 200.' },
          ]);
        },
      },
      {
        title: 'Measure it!',
        html: `
          <p><strong>Tap two places on the map</strong> to measure the distance between them, or try a measurement from the worksheet:</p>
          <div class="find-buttons">${M.PRESETS.map((p, i) => `<button type="button" class="fc-toggle" data-preset="${i}">${p.label}</button>`).join('')}</div>
          <div class="ruler-map">${M.render({ labels: true })}</div>
          <p class="ruler-readout callout" role="status">Tap a starting point on the map.</p>`,
        mount(el) {
          const out = el.querySelector('.ruler-readout');
          const ruler = M.attachRuler(el.querySelector('.sa-map'), (m) => {
            out.innerHTML = m ? PRESET_TEXT(m) : 'Now tap the second point.';
          });
          el.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => {
            const p = M.PRESETS[+b.dataset.preset];
            el.querySelectorAll('[data-preset]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
            ruler.show(p.a, p.b);
          }));
        },
      },
      {
        title: 'Find the features',
        html: `
          <p>Can you find each feature before you tap its name? Tap a name to show it on the map.</p>
          <div class="find-buttons">${FIND.map(([k, n]) => `<button type="button" class="fc-toggle" data-find="${k}" aria-pressed="false">${n}</button>`).join('')}
            <button type="button" class="fc-toggle" data-find-all>Show all</button></div>
          <div class="map-highlight">${M.render({ labels: false, gridLines: false })}</div>`,
        mount(el) {
          const toggle = (key, on) => {
            el.querySelectorAll(`[data-key="${key}"]`).forEach((n) => n.classList.toggle(n.classList.contains('map-label') ? 'is-on' : 'is-hl', on));
            el.querySelector(`[data-find="${key}"]`).setAttribute('aria-pressed', String(on));
          };
          el.querySelectorAll('[data-find]').forEach((b) => b.addEventListener('click', () => toggle(b.dataset.find, b.getAttribute('aria-pressed') !== 'true')));
          el.querySelector('[data-find-all]').addEventListener('click', () => FIND.forEach(([k]) => toggle(k, true)));
        },
      },
      {
        title: 'Latitude & longitude',
        html: `
          <ul class="language-list">
            <li><strong>Latitude</strong> lines run east–west. They measure how far <strong>north or south</strong> of the Equator a place is (°N or °S).</li>
            <li><strong>Longitude</strong> lines run north–south. They measure how far <strong>east or west</strong> of the Prime Meridian a place is (°E or °W).</li>
            <li><strong>Absolute location</strong> = (latitude, longitude). Latitude always goes <strong>first</strong>.</li>
          </ul>
          <div class="diagram-box">${M.render({ labels: false, markers: [{ at: [85, 35], label: 'A', kind: 'letter' }, { at: [90, 10], label: 'B', kind: 'letter' }] })}</div>
          <p>What is the absolute location of point <strong>A</strong>?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: '(35°N, 85°E)', correct: true, feedback: 'Yes! A is on the 35°N line and the 85°E line. (B is at 10°N, 90°E.)' },
            { label: '(85°N, 35°E)', correct: false, feedback: 'Switched! Latitude (°N) goes first.' },
            { label: '(30°N, 85°E)', correct: false, feedback: 'Check the latitude: follow A\'s line to the right edge.' },
          ]);
        },
      },
      {
        title: 'Direction & relative location',
        html: `
          <p>The <strong>compass rose</strong> shows direction. <strong>Cardinal</strong> directions: N, E, S, W. <strong>Intermediate</strong> directions are in between: NE, SE, SW, NW.</p>
          <table class="map-table">
            <thead><tr><th>Absolute location</th><th>Relative location</th></tr></thead>
            <tbody><tr>
              <td>An exact spot using latitude and longitude.<br><em>Sri Lanka is at about (7°N, 81°E).</em></td>
              <td>Where a place is compared to other places.<br><em>Sri Lanka is an island southeast of India, in the Indian Ocean.</em></td>
            </tr></tbody>
          </table>
          <p>Mount Everest is mostly north and a little west of the middle of the Bay of Bengal. Which direction fits best?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: 'NE', correct: false, feedback: 'Everest (about 87°E) is a little west of the Bay\'s middle, not east.' },
            { label: 'SE', correct: false, feedback: 'Everest is north of the Bay, up in the Himalayas.' },
            { label: 'NW', correct: true, feedback: 'Yes! North and a little west = northwest.' },
            { label: 'SW', correct: false, feedback: 'Everest is north of the Bay, not south.' },
          ]);
        },
      },
      {
        title: 'Estimating area',
        html: `
          <p>The area of a rectangle is <strong>Length × Width</strong>. We can use it to <em>estimate</em> the area of Sri Lanka:</p>
          <ul class="language-list">
            <li>Width (east to west): about <strong>130 miles</strong></li>
            <li>Length (north to south): about <strong>270 miles</strong></li>
            <li>130 × 270 = 35,100 → about <strong>35,000 square miles</strong></li>
          </ul>
          <p>Sri Lanka's real area is about <strong>25,000 square miles</strong>. Why is our answer too big?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: 'Sri Lanka is not an absolute location', correct: false, feedback: 'Absolute location is about latitude and longitude. This question is about shape and area.' },
            { label: 'Sri Lanka is not a rectangle, so the rectangle includes ocean too', correct: true, feedback: 'Yes! Sri Lanka is shaped like a teardrop, so L × W counts extra water. Our map measurements are rounded too.' },
            { label: 'We should have added 130 + 270', correct: false, feedback: 'Area means multiplying length × width, and the answer is in square miles.' },
          ]);
        },
      },
      {
        title: 'Worksheet questions & answers',
        html: `
          <p class="muted small">Use the "Measure it!" map to check each one. Answers are measured on this app's map, so your worksheet's map may give slightly different numbers.</p>
          ${qa([
            ['How wide is India at 20°N?', 'About <strong>880 miles</strong> (about 4.4 scale bars × 200).'],
            ['How wide is India at 10°N?', 'About <strong>240 miles</strong> (a little more than 1 scale bar). India gets narrower toward the south.'],
            ['What is the distance from the mouth of the Indus River to the mouth of the Ganges River?', 'About <strong>1,500 miles</strong> (about 7½ scale bars × 200).'],
            ['Mount Everest is (NE, SE, NW, SW) of the Bay of Bengal.', '<strong>NW</strong>: Everest is north of the bay and a little west of its middle.'],
            ['Best estimate for the absolute location of the Ganges River\'s mouth?', 'About <strong>(22°N, 90°E)</strong>, where the river meets the Bay of Bengal in Bangladesh.'],
            ['Write a sentence describing the relative location of Sri Lanka.', '<strong>"Sri Lanka is an island southeast of India, in the Indian Ocean."</strong> (Relative location compares a place to other places. Latitude and longitude would be absolute location.)'],
            ['Estimate the area of Sri Lanka (L × W).', 'About 130 miles × 270 miles ≈ <strong>35,000 square miles</strong>.'],
            ['Why is your answer to the area question only an estimate?', 'Because <strong>Sri Lanka is not a perfect rectangle</strong>: the rectangle also covers some ocean, and map measurements are rounded.'],
            ['Which mountains are in the north of India? Which are along the coasts?', 'The <strong>Himalayas</strong> (with Mt. Everest) are in the north and the <strong>Hindu Kush</strong> is in the northwest. The <strong>Western Ghats</strong> and <strong>Eastern Ghats</strong> run along the west and east coasts, with the <strong>Deccan Plateau</strong> between them.'],
          ])}`,
      },
    ],
  };

  const meso = {
    id: 41,
    short: 'Mesopotamia',
    navTitle: 'Mesopotamia',
    title: 'Mesopotamia: Sumer, Babylon, Cuneiform & Hammurabi',
    blurb: 'The Tigris and Euphrates, Sumerian city-states, cuneiform writing, and the Code of Hammurabi.',
    art: '<span class="lesson-emoji">🏛️📜</span>',
    sessionLength: 8,
    skills: ['meso', 'rivers', 'compare'],
    steps: [
      targets([
        'I can explain how the Tigris and Euphrates Rivers shaped life in Mesopotamia.',
        'I can describe Sumerian city-states and why they formed.',
        'I can explain what cuneiform was and why it was created.',
        'I can explain the Code of Hammurabi and why written laws matter.',
      ]),
      {
        title: 'The land between the rivers',
        html: `
          ${factCard(civ('meso'), '<div><dt>Region</dt><dd>Part of the Fertile Crescent</dd></div>')}
          <p><strong>Mesopotamia</strong> means "land between the rivers." It sat between the <strong>Tigris</strong> and <strong>Euphrates</strong> Rivers, in a curved strip of good farmland called the <strong>Fertile Crescent</strong>.</p>
          <ul class="language-list">
            <li>The floods were <strong>unpredictable</strong> and sometimes violent, so farmers worked together to build <strong>irrigation canals</strong> and <strong>levees</strong>.</li>
            <li>Big water projects needed planning and leaders, which helped create <strong>governments</strong>.</li>
            <li>There was little stone, wood, or metal, so Mesopotamians <strong>traded</strong> grain and cloth for them and built with <strong>mud bricks</strong>.</li>
            <li>The land was flat and open, with few natural barriers, so it was <strong>often invaded</strong>.</li>
          </ul>`,
      },
      {
        title: 'Sumer and its city-states',
        html: `
          <p><strong>Sumer</strong>, in southern Mesopotamia, was one of the world's first civilizations (about 3500 BCE). Tap each topic:</p>
          <div id="tabs"></div>`,
        mount(el) {
          tabs(el, '#tabs', [
            { label: 'City-states', html: 'Sumer was split into <strong>city-states</strong> like <strong>Ur</strong>, <strong>Uruk</strong>, and <strong>Lagash</strong>. Each was a city plus nearby farmland with its <strong>own king, army, and patron god</strong>. They often fought over water and land.' },
            { label: 'Ziggurats', html: 'At the center of each city stood a <strong>ziggurat</strong>, a tall, stepped temple to the city\'s god. Sumerians were <strong>polytheistic</strong> (they believed in many gods).' },
            { label: 'Cuneiform', html: '<strong>Cuneiform</strong> (about 3200 BCE) was wedge-shaped writing pressed into wet <strong>clay tablets</strong> with a reed <strong>stylus</strong>. It began as a way to keep <strong>records</strong> of trade and taxes. Trained writers were called <strong>scribes</strong>. Later, people wrote stories like the <em>Epic of Gilgamesh</em>.' },
            { label: 'Inventions', html: 'Sumerians are credited with the <strong>wheel</strong>, the <strong>plow</strong>, the <strong>sailboat</strong>, and a number system based on <strong>60</strong> (that\'s why an hour has 60 minutes!).' },
            { label: 'Social classes', html: 'At the top: <strong>kings, priests, and nobles</strong>. In the middle: <strong>merchants and artisans</strong>. Then <strong>farmers</strong> (the most people). At the bottom: <strong>enslaved people</strong>.' },
          ]);
        },
      },
      {
        title: 'Babylon and the Code of Hammurabi',
        html: `
          <p>Around 2300 BCE, <strong>Sargon of Akkad</strong> conquered the Sumerian city-states and created the first <strong>empire</strong>. Later, the city of <strong>Babylon</strong> became powerful.</p>
          <p><strong>Hammurabi</strong> ruled Babylon from about <strong>1792 to 1750 BCE</strong>. He created the <strong>Code of Hammurabi</strong>: <strong>282 laws</strong> carved on a tall stone pillar for everyone to see.</p>
          <ul class="language-list">
            <li>Laws covered trade, family, property, and crimes.</li>
            <li>Punishments were often harsh: "<strong>an eye for an eye</strong>."</li>
            <li>Punishments were <strong>different for different social classes</strong>.</li>
            <li>Why it mattered: laws were <strong>written down and public</strong>, so people could know the rules.</li>
          </ul>
          <p>What was the biggest change the Code of Hammurabi brought?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: 'Everyone got exactly equal treatment', correct: false, feedback: 'Not quite. Punishments depended on your social class.' },
            { label: 'Laws were written down for everyone to see', correct: true, feedback: 'Yes! Written, public laws meant people could know the rules ahead of time.' },
            { label: 'It ended all crime', correct: false, feedback: 'No set of laws ends all crime. Think about what made it new.' },
          ]);
        },
      },
      {
        title: 'Vocabulary',
        html: glossary([
          ['Fertile Crescent', 'A curved region of rich farmland in Southwest Asia that includes Mesopotamia.'],
          ['City-state', 'A city and its surrounding land with its own government.'],
          ['Ziggurat', 'A stepped temple at the center of a Sumerian city.'],
          ['Cuneiform', 'Wedge-shaped writing pressed into clay tablets.'],
          ['Scribe', 'A person trained to read and write and keep records.'],
          ['Empire', 'Many lands and peoples ruled by one ruler.'],
          ['Code of Hammurabi', 'A set of 282 written laws from Babylon.'],
          ['Polytheism', 'Belief in many gods.'],
        ]),
      },
      {
        title: 'Questions & answers',
        html: qa([
          ['How did the geography of Mesopotamia affect how people lived?', 'The rivers gave water and silt for farming, but floods were unpredictable, so people built canals and levees together. The flat, open land had few barriers, so it was often invaded.'],
          ['Why did Sumerians form city-states?', 'Cities grew around farmland and needed government to organize irrigation, defend against attacks, and settle disputes. Each city ruled itself.'],
          ['Why was cuneiform important?', 'It is one of the first writing systems. It let people keep records, write laws, and pass down stories and knowledge.'],
          ['What was a ziggurat used for?', 'It was a temple to the city\'s patron god and the center of religious and city life.'],
          ['What can the Code of Hammurabi teach us about Babylonian society?', 'That they valued order and justice, had strict punishments, and had social classes that were treated differently.'],
          ['How is the Code of Hammurabi like laws today?', 'Laws today are also written and public so people know the rules. Unlike Hammurabi\'s code, modern U.S. law says everyone should be treated equally.'],
        ]),
      },
    ],
  };

  const egypt = {
    id: 42,
    short: 'Ancient Egypt',
    navTitle: 'Ancient Egypt',
    title: 'Ancient Egypt: The Nile, Pharaohs & Social Hierarchy',
    blurb: 'The Nile\'s flooding cycle, natural resources, pharaohs, pyramids, and Egypt\'s social pyramid.',
    art: '<span class="lesson-emoji">🔺🐪</span>',
    sessionLength: 8,
    skills: ['egypt', 'rivers', 'compare'],
    steps: [
      targets([
        'I can explain the Nile\'s flooding cycle and how it helped farming.',
        'I can name natural resources Egyptians used and how they used them.',
        'I can describe the role and power of the pharaoh.',
        'I can describe Egypt\'s social hierarchy.',
      ]),
      {
        title: 'The gift of the Nile',
        html: `
          ${factCard(civ('egypt'), '<div><dt>Direction</dt><dd>Flows north to the Mediterranean</dd></div>')}
          <p>Egypt has been called "the gift of the Nile." Without the river, it would be desert.</p>
          <ul class="language-list">
            <li>The Nile is the world's <strong>longest river</strong> and flows <strong>north</strong>. So <strong>Upper Egypt</strong> is in the south, and <strong>Lower Egypt</strong> (the delta) is in the north.</li>
            <li>The rich land along the river was the <strong>"black land"</strong> (Kemet). The desert was the <strong>"red land"</strong>.</li>
            <li><strong>Deserts</strong> on both sides were <strong>natural barriers</strong> that protected Egypt from invaders.</li>
          </ul>`,
      },
      {
        title: 'The flooding cycle',
        html: `
          <p>Unlike Mesopotamia, the Nile flooded <strong>predictably</strong>, at about the same time every year. Egyptians built their calendar around three seasons:</p>
          <div class="season-row">
            <div class="season"><span aria-hidden="true">🌊</span><strong>Flooding</strong><span>The Nile rises and covers the fields with water and silt.</span></div>
            <div class="season"><span aria-hidden="true">🌱</span><strong>Growing</strong><span>Water goes down. Farmers plant wheat, barley, and flax in the black silt.</span></div>
            <div class="season"><span aria-hidden="true">🌾</span><strong>Harvest</strong><span>Crops are gathered before the next flood.</span></div>
          </div>
          <p>Farmers used canals and a lifting tool called a <strong>shaduf</strong> to irrigate. Too little flood meant famine; too much could wash away villages.</p>
          <p>Why could Egyptian farmers plan ahead better than Mesopotamian farmers?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: 'The Nile never flooded', correct: false, feedback: 'It flooded every year. That was the key to farming.' },
            { label: 'The Nile flooded at about the same time every year', correct: true, feedback: 'Yes! A predictable flood meant farmers knew when to plant and harvest.' },
            { label: 'Egypt had more rain', correct: false, feedback: 'Egypt gets very little rain. The river did the work.' },
          ]);
        },
      },
      {
        title: 'Natural resources',
        html: `
          <table class="map-table">
            <thead><tr><th>Resource</th><th>How Egyptians used it</th></tr></thead>
            <tbody>
              <tr><td><strong>Silt / fertile soil</strong></td><td>Growing wheat, barley, and flax (for linen cloth)</td></tr>
              <tr><td><strong>Papyrus</strong> (reed plant)</td><td>Paper for writing, rope, baskets, sandals, and boats</td></tr>
              <tr><td><strong>Stone</strong> (limestone, granite)</td><td>Pyramids, temples, and statues</td></tr>
              <tr><td><strong>Mud</strong></td><td>Bricks for homes</td></tr>
              <tr><td><strong>Gold</strong> and gems</td><td>Jewelry and tomb treasures, often from Nubia to the south</td></tr>
              <tr><td><strong>The river itself</strong></td><td>Fish, water, and a "highway" for boats and trade</td></tr>
            </tbody>
          </table>`,
      },
      {
        title: 'Pharaohs and the social pyramid',
        html: `
          <p>Around <strong>3100 BCE</strong>, <strong>Menes</strong> (Narmer) united Upper and Lower Egypt. The ruler, the <strong>pharaoh</strong>, was seen as a <strong>god-king</strong>. Government and religion were joined: this is called a <strong>theocracy</strong>.</p>
          <p>Famous pharaohs: <strong>Khufu</strong> (Great Pyramid at Giza), <strong>Hatshepsut</strong> (a woman pharaoh who expanded trade), <strong>Ramses II</strong>, and <strong>Tutankhamun</strong>.</p>
          <div class="hierarchy" aria-label="Egyptian social hierarchy, from top to bottom">
            <div style="--w:30%">Pharaoh</div>
            <div style="--w:45%">Government officials, priests & nobles</div>
            <div style="--w:58%">Scribes</div>
            <div style="--w:70%">Artisans & merchants</div>
            <div style="--w:85%">Farmers (most people)</div>
            <div style="--w:100%">Servants & enslaved people</div>
          </div>
          <p>Egyptians believed in an <strong>afterlife</strong>. Pharaohs were <strong>mummified</strong> and buried in <strong>pyramids</strong> (later in the Valley of the Kings) with things they would need. They wrote in <strong>hieroglyphics</strong>.</p>`,
      },
      {
        title: 'Questions & answers',
        html: qa([
          ['Why is Egypt called "the gift of the Nile"?', 'The Nile\'s yearly floods turned desert into rich farmland. Without the river, Egypt could not have grown food or built a civilization.'],
          ['How did the Nile\'s flooding cycle affect Egyptian life?', 'Egyptians planned their year around three seasons (flooding, growing, harvest). Predictable floods meant reliable food and a surplus.'],
          ['How did geography protect Egypt?', 'Deserts to the east and west, and waterfalls (cataracts) on the Nile to the south, made Egypt hard to invade.'],
          ['Why did the pharaoh have so much power?', 'Egyptians believed the pharaoh was a god-king. He owned the land, led the army and religion, and collected taxes.'],
          ['Why were scribes respected?', 'Few people could read and write hieroglyphics. Scribes kept records, counted taxes, and wrote laws for the government.'],
          ['Where were most people in the social hierarchy?', 'Most Egyptians were farmers near the bottom. During the flood season, many worked on building projects for the pharaoh.'],
        ]),
      },
    ],
  };

  const indus = {
    id: 43,
    short: 'Indus Valley',
    navTitle: 'Indus Valley',
    title: 'Indus Valley: Harappa, Mohenjo-daro & the Roots of Hinduism and Buddhism',
    blurb: 'Planned cities, trade networks, an unsolved script, and the beginnings of Hinduism and Buddhism.',
    art: '<span class="lesson-emoji">🧱🪷</span>',
    sessionLength: 8,
    skills: ['indus', 'beliefs', 'compare'],
    steps: [
      targets([
        'I can describe the geography of the Indus River valley.',
        'I can explain how Harappa and Mohenjo-daro were planned.',
        'I can describe Indus Valley trade networks.',
        'I can explain the main beliefs of Hinduism and Buddhism and where they began.',
      ]),
      {
        title: 'The Indus River valley',
        html: `
          ${factCard(civ('indus'), '<div><dt>Also called</dt><dd>The Harappan civilization</dd></div>')}
          <ul class="language-list">
            <li>The Indus River starts in the <strong>Himalaya Mountains</strong>. Melting snow and <strong>monsoon</strong> rains (seasonal winds that bring heavy rain) made it flood, leaving rich silt.</li>
            <li>Mountains to the north and west (the <strong>Himalayas</strong> and <strong>Hindu Kush</strong>) and desert to the east gave some protection. Passes like the <strong>Khyber Pass</strong> let people move through.</li>
            <li>It was the <strong>largest</strong> of the early river civilizations by area, with over 1,000 settlements.</li>
          </ul>`,
      },
      {
        title: 'Planned cities',
        html: `
          <p><strong>Harappa</strong> and <strong>Mohenjo-daro</strong> were among the best-planned cities in the ancient world. Tap each feature:</p>
          <div id="tabs"></div>`,
        mount(el) {
          tabs(el, '#tabs', [
            { label: 'Grid streets', html: 'Wide main streets crossed at right angles in a <strong>grid</strong>, like a checkerboard. The cities were planned <em>before</em> they were built.' },
            { label: 'Drains & water', html: 'Many homes had <strong>bathrooms</strong> and <strong>wells</strong>. <strong>Covered drains</strong> under the streets carried wastewater away: one of the first sewer systems.' },
            { label: 'Standard bricks', html: 'Builders used <strong>baked bricks</strong> of the same size and shape in city after city. That suggests a strong, organized government.' },
            { label: 'Citadel & Great Bath', html: 'A raised area called a <strong>citadel</strong> held important buildings like the <strong>Great Bath</strong> at Mohenjo-daro, a waterproof pool probably used for <strong>ritual bathing</strong>, and large <strong>granaries</strong> for storing grain.' },
            { label: 'Seals & script', html: 'Small stone <strong>seals</strong> show animals and symbols. Their writing has <strong>never been deciphered</strong>, so much about their government and beliefs is still a mystery.' },
          ]);
        },
      },
      {
        title: 'Trade networks',
        html: `
          <ul class="language-list">
            <li>Indus people used <strong>standard weights and measures</strong>, which made trade fair.</li>
            <li>They were among the first to grow <strong>cotton</strong> and weave it into cloth.</li>
            <li>They traded <strong>cotton, beads, jewelry, and gems</strong> (like carnelian) for metals and other goods.</li>
            <li>Indus <strong>seals and beads have been found in Mesopotamia</strong>, showing long-distance trade by land and by sea through the Persian Gulf.</li>
          </ul>
          <p>Around <strong>1900 BCE</strong> the cities began to decline. Historians think <strong>climate change, drought, floods, or rivers changing course</strong> may be the reasons.</p>`,
      },
      {
        title: 'Roots of Hinduism',
        html: `
          <p>Around <strong>1500 BCE</strong>, people called the <strong>Indo-Aryans</strong> moved into northern India. Their sacred hymns, the <strong>Vedas</strong>, were written in <strong>Sanskrit</strong>. Vedic beliefs, mixed with local traditions, slowly grew into <strong>Hinduism</strong>. Some historians think a few Indus practices, like ritual bathing, may have carried on too.</p>
          ${glossary([
            ['Brahman', 'The one universal spirit; Hindus worship many gods as forms of it.'],
            ['Reincarnation', 'The soul is reborn in a new body after death.'],
            ['Karma', 'Your good or bad actions affect your future lives.'],
            ['Dharma', 'Your duty, or doing what is right for your role in life.'],
            ['Moksha', 'Freedom from the cycle of rebirth.'],
            ['Caste system', 'Social groups set by birth: Brahmins (priests), Kshatriyas (rulers & warriors), Vaishyas (merchants & farmers), Shudras (laborers).'],
          ])}`,
      },
      {
        title: 'Roots of Buddhism',
        html: `
          <p><strong>Siddhartha Gautama</strong> was a prince born around 563 BCE in what is now Nepal. After seeing old age, sickness, and death, he left his palace to understand suffering. While meditating under a tree, he reached <strong>enlightenment</strong> and became the <strong>Buddha</strong> ("the enlightened one").</p>
          <ul class="language-list">
            <li><strong>Four Noble Truths</strong>: life has suffering; suffering comes from wanting things; suffering can end; the way to end it is the Eightfold Path.</li>
            <li><strong>Eightfold Path</strong>: right thinking and right actions, like being honest and kind.</li>
            <li>Goal: <strong>nirvana</strong>, a state of peace free from suffering.</li>
            <li>The Buddha taught that people of <strong>any caste</strong> could reach enlightenment.</li>
            <li>Later, Emperor <strong>Ashoka</strong> helped Buddhism spread across Asia.</li>
          </ul>
          <p>Which idea did Hinduism and Buddhism share?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: 'Karma and rebirth', correct: true, feedback: 'Yes! Both teach that actions matter (karma) and that souls are reborn.' },
            { label: 'The caste system decides who can be enlightened', correct: false, feedback: 'The Buddha rejected that: anyone could reach enlightenment.' },
            { label: 'The pharaoh is a god', correct: false, feedback: 'That is an Egyptian belief.' },
          ]);
        },
      },
      {
        title: 'Questions & answers',
        html: qa([
          ['What does the planning of Mohenjo-daro tell us about Indus society?', 'That it was well organized, probably with a strong government that set rules for building, water, and trade.'],
          ['Why was the drainage system important?', 'It kept the city clean and healthier by carrying wastewater away from homes.'],
          ['What evidence shows the Indus Valley traded with others?', 'Indus seals, beads, and goods have been found in Mesopotamia, and standard weights show organized trade.'],
          ['Why is so much about the Indus Valley still a mystery?', 'Their script has not been deciphered, so we cannot read their own records.'],
          ['How are Hinduism and Buddhism connected?', 'Both began in India and share ideas like karma and rebirth. Buddhism grew out of Hindu traditions but rejected the caste system and the authority of the Vedas.'],
          ['What is the goal of each religion?', 'Hinduism: moksha, freedom from the cycle of rebirth. Buddhism: nirvana, the end of suffering.'],
        ]),
      },
    ],
  };

  const china = {
    id: 44,
    short: 'Ancient China',
    navTitle: 'Ancient China',
    title: 'Ancient China: The Yellow River, Shang & Zhou Dynasties',
    blurb: 'How geography isolated China, the Yellow River\'s gifts and dangers, oracle bones, and the Mandate of Heaven.',
    art: '<span class="lesson-emoji">🐉🏔️</span>',
    sessionLength: 8,
    skills: ['china', 'rivers', 'compare'],
    steps: [
      targets([
        'I can explain how the Yellow River helped and harmed early Chinese people.',
        'I can explain how mountains, deserts, and oceans isolated China.',
        'I can describe the Shang dynasty and its achievements.',
        'I can explain the Zhou dynasty and the Mandate of Heaven.',
      ]),
      {
        title: 'The Yellow River',
        html: `
          ${factCard(civ('china'), '<div><dt>Other river</dt><dd>Yangtze (Chang Jiang), farther south</dd></div>')}
          <ul class="language-list">
            <li>The <strong>Huang He</strong> (Yellow River) is named for the yellow silt it carries, called <strong>loess</strong>.</li>
            <li>The silt made the <strong>North China Plain</strong> rich farmland for <strong>millet</strong> and <strong>wheat</strong>. Rice grew in the wetter south.</li>
            <li>Its floods were so huge and deadly that it was called <strong>"China's Sorrow."</strong> People built dikes and canals to control it.</li>
          </ul>`,
      },
      {
        title: 'Geographic isolation',
        html: `
          <p>China was surrounded by natural barriers that cut it off from other civilizations:</p>
          <div class="season-row">
            <div class="season"><span aria-hidden="true">🏔️</span><strong>West & southwest</strong><span>The Himalayas and Tibetan Plateau</span></div>
            <div class="season"><span aria-hidden="true">🏜️</span><strong>North & northwest</strong><span>The Gobi and Taklamakan Deserts</span></div>
            <div class="season"><span aria-hidden="true">🌊</span><strong>East</strong><span>The Pacific Ocean (Yellow Sea and East China Sea)</span></div>
          </div>
          <p>Because of this <strong>isolation</strong>, China's culture, writing, and beliefs developed mostly <strong>on their own</strong>. The Chinese called their land <strong>Zhongguo</strong>, the <strong>"Middle Kingdom,"</strong> because they saw it as the center of the world.</p>
          <p>How did isolation affect ancient China?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: 'China copied Egypt\'s writing', correct: false, feedback: 'China developed its own writing, partly because it was isolated.' },
            { label: 'China developed its own culture with little outside influence', correct: true, feedback: 'Yes! Mountains, deserts, and the sea kept outside influence low.' },
            { label: 'China was invaded more than any other civilization', correct: false, feedback: 'The barriers made invasion harder, not easier.' },
          ]);
        },
      },
      {
        title: 'The Shang dynasty',
        html: `
          <p>A <strong>dynasty</strong> is a series of rulers from the same family. The <strong>Shang</strong> (about <strong>1600–1046 BCE</strong>) is the first Chinese dynasty with written records.</p>
          <ul class="language-list">
            <li><strong>Oracle bones</strong>: priests carved questions on turtle shells or ox bones, heated them until they cracked, and read the cracks as answers from the ancestors. These are the <strong>oldest Chinese writing</strong>.</li>
            <li><strong>Ancestor worship</strong>: people honored family members who had died and asked them for help.</li>
            <li><strong>Bronze</strong>: Shang artisans made beautiful bronze pots, weapons, and tools.</li>
            <li><strong>Society</strong>: the king and nobles at the top, then warriors, artisans, and farmers (most people), with enslaved people at the bottom.</li>
          </ul>`,
      },
      {
        title: 'The Zhou dynasty & the Mandate of Heaven',
        html: `
          <p>In <strong>1046 BCE</strong>, the <strong>Zhou</strong> overthrew the Shang. The Zhou ruled until <strong>256 BCE</strong>, almost 800 years: the <strong>longest dynasty</strong> in Chinese history.</p>
          <div class="callout"><strong>Mandate of Heaven</strong>: heaven gives a good ruler the right to rule. If a ruler is unjust, heaven takes the mandate away, and a new dynasty can take over. Floods, famine, and rebellions were seen as signs.</div>
          <p>This created the <strong>dynastic cycle</strong>: a new dynasty rises → rules well → grows weak and unjust → loses the mandate → is replaced.</p>
          <ul class="language-list">
            <li>The Zhou king gave land to loyal <strong>lords</strong>, who ruled it and supplied soldiers (similar to <strong>feudalism</strong>).</li>
            <li>Later, the lords grew powerful and fought each other in the <strong>Warring States</strong> period.</li>
            <li>Great thinkers like <strong>Confucius</strong> lived during the late Zhou.</li>
          </ul>`,
      },
      {
        title: 'Questions & answers',
        html: qa([
          ['How was the Yellow River both a blessing and a sorrow?', 'Blessing: its loess silt made rich farmland. Sorrow: its huge floods destroyed villages and killed many people.'],
          ['How did geography isolate ancient China, and what was the effect?', 'Mountains, deserts, and the ocean cut China off. Its culture developed mostly on its own, and the Chinese saw themselves as the Middle Kingdom.'],
          ['What were oracle bones used for?', 'Shang kings and priests used them to ask the ancestors questions about the future, such as harvests or battles. They are the earliest Chinese writing.'],
          ['How did the Zhou justify overthrowing the Shang?', 'With the Mandate of Heaven: they said the last Shang king was cruel, so heaven had given the right to rule to the Zhou.'],
          ['What is the dynastic cycle?', 'The pattern of dynasties rising, ruling, declining, losing the Mandate of Heaven, and being replaced.'],
          ['How did the Zhou control their large kingdom?', 'The king gave land to lords in exchange for loyalty and soldiers. Over time the lords grew too powerful.'],
        ]),
      },
    ],
  };

  const review = {
    id: 45,
    short: 'Unit review',
    navTitle: 'Unit review: Compare all four',
    title: 'Unit Review: Comparing River Valley Civilizations',
    blurb: 'Side-by-side comparison of all four civilizations plus a full mixed practice test.',
    art: '<span class="lesson-emoji">🗺️⚖️</span>',
    sessionLength: 12,
    skills: Object.keys(SKILLS),
    steps: [
      targets([
        'I can compare how geography shaped each river valley civilization.',
        'I can compare writing, government, and social structure across the four civilizations.',
        'I can explain how water shaped early human organization.',
      ]),
      {
        title: 'Side-by-side comparison',
        html: `
          <div class="table-scroll">
            <table class="map-table">
              <thead><tr><th></th>${CIVS.map((c) => `<th>${c.icon} ${c.name}</th>`).join('')}</tr></thead>
              <tbody>
                <tr><th>River</th>${CIVS.map((c) => `<td>${c.river}</td>`).join('')}</tr>
                <tr><th>Floods</th>${CIVS.map((c) => `<td>${c.floods}</td>`).join('')}</tr>
                <tr><th>Protection</th><td>Few barriers, often invaded</td><td>Deserts on both sides</td><td>Mountains and desert</td><td>Mountains, deserts, ocean (isolated)</td></tr>
                <tr><th>Government</th><td>City-states, then empires (Hammurabi)</td><td>Pharaoh, a god-king</td><td>Organized, but unknown rulers</td><td>Dynasties (Shang, Zhou), Mandate of Heaven</td></tr>
                <tr><th>Writing</th><td>Cuneiform on clay</td><td>Hieroglyphics on papyrus</td><td>Seal script (undeciphered)</td><td>Oracle bones</td></tr>
                <tr><th>Beliefs</th><td>Many gods; ziggurats</td><td>Many gods; afterlife; pyramids</td><td>Possible roots of Hindu practices</td><td>Ancestor worship</td></tr>
              </tbody>
            </table>
          </div>`,
      },
      {
        title: 'How water shaped human organization',
        html: `
          <p>In all four civilizations, people had to <strong>work together</strong> to use and control their rivers:</p>
          <ul class="language-list">
            <li>Building <strong>canals, levees, and dikes</strong> took planning and many workers → <strong>leaders and government</strong>.</li>
            <li>Tracking water, crops, and taxes → <strong>writing and record keeping</strong>.</li>
            <li>Surplus food → <strong>specialized jobs</strong> and <strong>social classes</strong>.</li>
            <li>Rivers as highways → <strong>trade</strong> between cities and with other civilizations.</li>
          </ul>
          <p>Which civilization's flood was the most <strong>predictable</strong>?</p>
          <div id="check"></div>`,
        mount(el) {
          miniCheck(el, '#check', [
            { label: 'Mesopotamia', correct: false, feedback: 'The Tigris and Euphrates were unpredictable.' },
            { label: 'Egypt', correct: true, feedback: 'Yes! The Nile flooded at about the same time every year.' },
            { label: 'China', correct: false, feedback: 'The Yellow River was "China\'s Sorrow" because its floods were so dangerous.' },
          ]);
        },
      },
      {
        title: 'Study tips',
        html: `
          <ul class="checklist">
            <li>Match each civilization to its <strong>river</strong> and modern country.</li>
            <li>Know one <strong>writing system</strong>, one <strong>leader or government</strong>, and one <strong>achievement</strong> for each.</li>
            <li>Be ready to explain <strong>how geography helped and hurt</strong> each one (floods, barriers, resources).</li>
            <li>Practice explaining ideas in your own words: <em>surplus, specialization, city-state, dynasty, Mandate of Heaven, karma, caste</em>.</li>
          </ul>
          <p class="muted small">Then take the mixed practice test: 12 questions from every lesson.</p>`,
      },
    ],
  };

  // ---------- Flashcard decks ----------
  // [front, back] pairs. Fronts are terms or quick questions; backs are short, memorable answers.
  const DECK_DATA = [
    {
      key: 'rivers', title: 'Big Ideas & Geography', short: 'Big Ideas', icon: '🌊', color: '#1d4ed8',
      cards: [
        ['Civilization', 'A complex society with cities, organized government, religion, job specialization, social classes, art and architecture, and writing.'],
        ['Nomad', 'A person who moves from place to place to hunt and gather food.'],
        ['Agriculture', 'Farming: growing crops and raising animals. It let people settle in one place.'],
        ['River valley', 'Low land along a river with water and fertile soil: where the first civilizations began.'],
        ['Silt', 'Rich, fine soil left behind by floodwater. It helps crops grow.'],
        ['Irrigation', 'Bringing water to fields with canals, ditches, or tools.'],
        ['Levee', 'A raised bank of earth built along a river to stop flooding.'],
        ['Surplus', 'Extra food or goods: more than people need right away.'],
        ['Specialization', 'When people do one kind of job (priest, potter, scribe) because others grow the food.'],
        ['Social hierarchy', 'A ranking of groups in a society from most to least powerful.'],
        ['Natural barrier', 'A landform like a mountain, desert, or ocean that protects a place or keeps people apart.'],
        ['Archaeologist', 'A scientist who learns about the past by studying artifacts and ruins.'],
        ['Artifact', 'An object made by people long ago, like a tool, pot, or seal.'],
        ['BCE', '"Before the Common Era." Larger BCE numbers are longer ago (3000 BCE is older than 1000 BCE).'],
        ['Why did civilizations start near rivers?', 'Water, fertile silt for farming, fish, and easy travel and trade.'],
        ['The four river valley civilizations and their rivers', 'Mesopotamia: Tigris & Euphrates · Egypt: Nile · Indus Valley: Indus · China: Yellow (Huang He).'],
        ['How did water shape how early people organized?', 'Controlling rivers took teamwork and planning, which led to leaders, laws, record keeping (writing), and government.'],
      ],
    },
    {
      key: 'maps', title: 'Map Skills', short: 'Map Skills', icon: '🗺️', color: '#0369a1',
      cards: [
        ['Map scale', 'Shows how a distance on the map compares to the real distance on Earth (for example, 1 bar = 200 miles).'],
        ['How to measure distance with a scale bar', 'Mark the two places on a paper strip, count how many scale bars fit, then multiply by the bar\'s distance.'],
        ['Latitude', 'Lines that run east–west and measure distance north or south of the Equator.'],
        ['Longitude', 'Lines that run north–south and measure distance east or west of the Prime Meridian.'],
        ['Equator', 'The 0° line of latitude that divides Earth into the Northern and Southern Hemispheres.'],
        ['Prime Meridian', 'The 0° line of longitude that divides Earth into the Eastern and Western Hemispheres.'],
        ['Absolute location', 'The exact spot of a place, written (latitude, longitude), like (28°N, 87°E).'],
        ['Relative location', 'Where a place is compared to other places: "Sri Lanka is southeast of India."'],
        ['Which comes first: latitude or longitude?', 'Latitude first, then longitude: (20°N, 80°E).'],
        ['Compass rose', 'The symbol on a map that shows directions.'],
        ['Cardinal directions', 'North, south, east, and west.'],
        ['Intermediate directions', 'Northeast, southeast, southwest, and northwest.'],
        ['Hemisphere', 'Half of Earth. India is in the Northern and Eastern Hemispheres.'],
        ['Map key (legend)', 'Explains what the symbols and colors on a map mean.'],
        ['Area of a rectangle', 'Length × Width. Using it on a real country gives only an estimate, because countries are not rectangles.'],
        ['Physical features of South Asia', 'Himalayas, Hindu Kush, Western & Eastern Ghats, Deccan Plateau, Thar Desert, and the Indus, Ganges & Brahmaputra Rivers.'],
      ],
    },
    {
      key: 'meso', title: 'Mesopotamia', short: 'Mesopotamia', icon: '🏛️', color: '#c2410c',
      cards: [
        ['Mesopotamia', 'Greek for "land between the rivers": the land between the Tigris and Euphrates, in today\'s Iraq.'],
        ['Tigris and Euphrates Rivers', 'The two rivers of Mesopotamia. Their floods were unpredictable and sometimes violent.'],
        ['Fertile Crescent', 'A curved region of rich farmland in Southwest Asia that includes Mesopotamia.'],
        ['Sumer', 'One of the first civilizations (about 3500 BCE), in southern Mesopotamia.'],
        ['City-state', 'A city and the farmland around it with its own government, ruler, and army (like Ur and Uruk).'],
        ['Ur and Uruk', 'Two important Sumerian city-states.'],
        ['Ziggurat', 'A tall, stepped temple at the center of a Sumerian city, built for the city\'s god.'],
        ['Polytheism', 'Belief in many gods (Mesopotamians and Egyptians were polytheistic).'],
        ['Cuneiform', 'Wedge-shaped writing pressed into wet clay tablets: one of the first writing systems.'],
        ['Stylus', 'A pointed reed tool used to press cuneiform into clay.'],
        ['Scribe', 'A person trained to read, write, and keep records.'],
        ['Why did Sumerians invent writing?', 'To keep records of trade, taxes, and goods.'],
        ['Epic of Gilgamesh', 'A Sumerian story about a hero-king: one of the oldest written stories.'],
        ['Sumerian inventions', 'The wheel, the plow, the sailboat, and a number system based on 60.'],
        ['Sargon of Akkad', 'Conquered the Sumerian city-states about 2300 BCE and created the first empire.'],
        ['Empire', 'Many lands and peoples ruled by one ruler or government.'],
        ['Babylon', 'A powerful Mesopotamian city; capital of Hammurabi\'s empire.'],
        ['Hammurabi', 'King of Babylon (about 1792–1750 BCE) who created a famous code of laws.'],
        ['Code of Hammurabi', '282 written laws carved on a stone pillar so everyone could see them.'],
        ['"An eye for an eye"', 'The idea in Hammurabi\'s Code that a punishment should match the crime.'],
        ['Why was Mesopotamia often invaded?', 'Its flat, open land had few natural barriers.'],
      ],
    },
    {
      key: 'egypt', title: 'Ancient Egypt', short: 'Egypt', icon: '🔺', color: '#b45309',
      cards: [
        ['Nile River', 'The world\'s longest river. It flows north into the Mediterranean Sea.'],
        ['"The gift of the Nile"', 'A name for Egypt: without the Nile\'s floods, Egypt would be desert.'],
        ['Upper Egypt vs. Lower Egypt', 'Upper Egypt is in the south (upstream). Lower Egypt is in the north, at the delta.'],
        ['Delta', 'Fan-shaped land at a river\'s mouth, made of silt (the Nile Delta).'],
        ['Black land (Kemet)', 'The rich, dark farmland along the Nile.'],
        ['Red land', 'The desert on both sides of the Nile.'],
        ['The Nile\'s three seasons', 'Flooding (inundation), growing, and harvest.'],
        ['How was the Nile\'s flood different from Mesopotamia\'s?', 'It was predictable: it came at about the same time every year.'],
        ['Shaduf', 'A bucket on a long pole used to lift water from the Nile to fields.'],
        ['Cataract', 'A waterfall or rapids on the Nile that blocked boats and invaders from the south.'],
        ['How did deserts help Egypt?', 'They were natural barriers that protected Egypt from invaders.'],
        ['Papyrus', 'A reed plant used to make paper, rope, baskets, sandals, and boats.'],
        ['Egypt\'s natural resources', 'Silt, papyrus, stone (limestone, granite), mud for bricks, gold, and fish.'],
        ['Menes (Narmer)', 'United Upper and Lower Egypt about 3100 BCE and became the first pharaoh.'],
        ['Pharaoh', 'The ruler of Egypt, believed to be a god-king.'],
        ['Theocracy', 'A government where religious leaders rule, or the ruler is seen as a god.'],
        ['Egypt\'s social hierarchy (top to bottom)', 'Pharaoh → officials, priests & nobles → scribes → artisans & merchants → farmers → servants & enslaved people.'],
        ['Pyramid', 'A huge stone tomb built for a pharaoh (the Great Pyramid of Khufu at Giza).'],
        ['Mummification', 'Preserving a body after death so the soul could use it in the afterlife.'],
        ['Hieroglyphics', 'Egyptian writing that uses pictures and symbols.'],
        ['Rosetta Stone', 'A stone with the same text in three scripts that helped scholars read hieroglyphics.'],
        ['Hatshepsut', 'A woman pharaoh who expanded trade, including a famous expedition to Punt.'],
      ],
    },
    {
      key: 'indus', title: 'Indus Valley', short: 'Indus Valley', icon: '🧱', color: '#0f766e',
      cards: [
        ['Indus River', 'River in South Asia (today\'s Pakistan and northwest India) where the Indus Valley civilization grew.'],
        ['Harappan civilization', 'Another name for the Indus Valley civilization, named after the city of Harappa.'],
        ['Harappa and Mohenjo-daro', 'The two largest, best-known Indus Valley cities.'],
        ['Grid pattern', 'Streets that cross at right angles like a checkerboard: a sign of city planning.'],
        ['Covered drains', 'Underground drains that carried wastewater away from homes: an early sewer system.'],
        ['Standardized bricks', 'Baked bricks of the same size used in many cities, showing strong organization.'],
        ['Citadel', 'A raised, fortified area of a city with important buildings.'],
        ['Great Bath', 'A large waterproof pool at Mohenjo-daro, probably used for ritual bathing.'],
        ['Granary', 'A building for storing grain.'],
        ['Seals', 'Small carved stones with animals and symbols, probably used to mark goods for trade.'],
        ['Indus script', 'Indus writing on seals that has never been deciphered (read).'],
        ['Standard weights and measures', 'Same-sized weights used across cities to make trade fair.'],
        ['Indus trade', 'Cotton, beads, and gems traded with Mesopotamia by land and by sea.'],
        ['Monsoon', 'Seasonal winds that bring heavy rains to South Asia.'],
        ['Himalayas and Hindu Kush', 'Mountains that partly protected the Indus Valley.'],
        ['Khyber Pass', 'A path through the mountains that people used to enter South Asia.'],
        ['Why did Indus cities decline (about 1900 BCE)?', 'Historians aren\'t sure: likely climate change, drought, floods, or rivers changing course.'],
      ],
    },
    {
      key: 'beliefs', title: 'Hinduism & Buddhism', short: 'Beliefs', icon: '🪷', color: '#7c3aed',
      cards: [
        ['Indo-Aryans', 'People who moved into northern India about 1500 BCE and brought the Vedas.'],
        ['Vedas', 'Ancient sacred hymns and teachings in Sanskrit: the roots of Hinduism.'],
        ['Sanskrit', 'The ancient language of India\'s sacred texts.'],
        ['Hinduism', 'A religion that grew in India from Vedic beliefs and local traditions.'],
        ['Brahman', 'In Hinduism, the one universal spirit. Many gods are seen as forms of it.'],
        ['Reincarnation', 'The belief that the soul is reborn in a new body after death.'],
        ['Karma', 'The idea that good or bad actions affect your future lives.'],
        ['Dharma', 'Your duty: doing what is right for your role in life.'],
        ['Moksha', 'In Hinduism, freedom from the cycle of rebirth.'],
        ['Caste system', 'Social groups set by birth that decided a person\'s job and status.'],
        ['The four varnas (castes)', 'Brahmins (priests) · Kshatriyas (rulers & warriors) · Vaishyas (merchants & farmers) · Shudras (laborers).'],
        ['Siddhartha Gautama', 'A prince (born about 563 BCE) who left his palace to understand suffering and became the Buddha.'],
        ['Buddha', '"The enlightened one": the title given to Siddhartha Gautama.'],
        ['Enlightenment', 'A state of deep understanding and wisdom about life.'],
        ['Four Noble Truths', 'Life has suffering; suffering comes from wanting; suffering can end; the Eightfold Path ends it.'],
        ['Eightfold Path', 'The Buddha\'s guide to right thinking and right living.'],
        ['Nirvana', 'In Buddhism, a state of perfect peace, free from suffering.'],
        ['How did Buddhism view the caste system?', 'The Buddha taught that people of any caste could reach enlightenment.'],
        ['Ashoka', 'An Indian emperor who became Buddhist and helped spread Buddhism across Asia.'],
      ],
    },
    {
      key: 'china', title: 'Ancient China', short: 'China', icon: '🐉', color: '#a16207',
      cards: [
        ['Huang He (Yellow River)', 'The river where Chinese civilization began, named for its yellow silt.'],
        ['Loess', 'Fine, yellow, fertile soil carried by the Yellow River.'],
        ['"China\'s Sorrow"', 'A name for the Yellow River because its floods were so deadly.'],
        ['Yangtze River (Chang Jiang)', 'China\'s longest river, farther south, good for growing rice.'],
        ['North China Plain', 'Flat, fertile land along the Yellow River where millet and wheat grew.'],
        ['Natural barriers around China', 'Himalayas & Tibetan Plateau (west), Gobi & Taklamakan Deserts (north), Pacific Ocean (east).'],
        ['Isolation', 'Being cut off from others. It let China\'s culture develop mostly on its own.'],
        ['Middle Kingdom (Zhongguo)', 'What the Chinese called China, because they saw it as the center of the world.'],
        ['Dynasty', 'A series of rulers from the same family.'],
        ['Shang dynasty', 'About 1600–1046 BCE: the first Chinese dynasty with written records.'],
        ['Oracle bones', 'Shells or bones carved with questions, heated until they cracked, and read as answers: the oldest Chinese writing.'],
        ['Ancestor worship', 'Honoring family members who have died and asking them for help.'],
        ['Shang bronze', 'Shang artisans cast beautiful bronze vessels, weapons, and tools.'],
        ['Zhou dynasty', 'About 1046–256 BCE: overthrew the Shang; the longest dynasty in Chinese history.'],
        ['Mandate of Heaven', 'The belief that heaven gives a just ruler the right to rule, and takes it away from an unjust one.'],
        ['Dynastic cycle', 'The pattern of dynasties rising, ruling, weakening, losing the Mandate of Heaven, and being replaced.'],
        ['Feudalism (Zhou)', 'The king gave land to lords in exchange for loyalty and soldiers.'],
        ['Warring States period', 'The end of the Zhou, when powerful lords fought each other.'],
        ['Confucius', 'A great Chinese thinker who lived in the late Zhou and taught respect, family duty, and good government.'],
      ],
    },
  ];

  const slug = (t) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const topicDecks = DECK_DATA.map((d) => ({
    ...d,
    blurb: `${d.cards.length} cards`,
    cards: d.cards.map(([front, back]) => ({ id: `${d.key}:${slug(front)}`, front, back, tag: d.title })),
  }));
  const DECKS = [
    { key: 'all', title: 'All River Valley Civilizations', short: 'All cards', icon: '🃏', color: '#be185d', cards: topicDecks.flatMap((d) => d.cards) },
    ...topicDecks,
  ];

  const lessons = [startHere, maps, meso, egypt, indus, china, review];
  lessons.forEach((l) => { l.buildSession = (count) => buildSession(l.skills, count); });

  return { SKILLS, CIVS, BANK, FACTORIES, DECKS, lessons, buildSession };
})();
