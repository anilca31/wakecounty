// ELA 6th Grade data and practice questions: The Lightning Thief (Chapters 1–8) and the Hero's Journey.
// Questions use the same shape as js/questions.js (multiple choice only).
const ElaQuestions = (() => {
  const { pick, shuffle } = Util;

  const SKILLS = {
    gist:       'Identify the gist',
    sequence:   'Sequence key events',
    early:      'Key events: Chapters 1–4',
    camp:       'Key events: Chapters 5–8',
    characters: 'Characters',
    stages:     'Hero\'s Journey stages',
    journey:    'Connect Percy to the Hero\'s Journey',
    plot:       'Hero\'s Journey and the plot diagram',
    align:      'Align the 10 stages with the plot diagram (worksheet)',
    traits:     'Analyze Percy\'s character with evidence',
    races:      'Answer with R.A.C.E.S.',
    meaning:    'Inference, symbols, and theme',
  };

  // [chapter, title, summary, gist, minor detail (true, but not the gist)]
  const CHAPTERS = [
    [1, 'I Accidentally Vaporize My Pre-Algebra Teacher',
      'On a field trip to the Metropolitan Museum of Art, Nancy Bobofit ends up in a fountain after picking on Grover, and Percy gets blamed. Mrs. Dodds pulls him aside and turns into a winged monster. Mr. Brunner throws him a pen that becomes a bronze sword, and Percy turns her to dust. Afterward everyone says there has never been a Mrs. Dodds.',
      'On a school trip, Percy\'s math teacher turns into a monster and attacks him, and he destroys her with a sword from Mr. Brunner.',
      'Percy\'s class takes a bus to a museum in New York City.'],
    [2, 'Three Old Ladies Knit the Socks of Death',
      'Percy overhears Grover and Mr. Brunner talking about protecting him, a "summer solstice deadline," and "the Kindly Ones." On the way home, he and Grover see three old women knitting giant socks at a fruit stand. One snips a yarn, and Grover panics.',
      'Strange things keep happening around Percy: Grover and Mr. Brunner secretly talk about protecting him, and three old women cut a yarn that terrifies Grover.',
      'Percy studies for his Latin final exam.'],
    [3, 'Grover Unexpectedly Loses His Pants',
      'Back in New York, Percy deals with his rude stepfather, Gabe Ugliano. Sally takes Percy to a cabin at Montauk, where she buys him blue food (a small rebellion against Gabe, who claimed blue food doesn\'t exist) and talks about his father. During a storm, Grover shows up, and Percy sees he has goat legs instead of feet.',
      'Percy escapes his mean stepfather for a trip with his mom, but it ends when Grover arrives, revealing he is part goat and that they are in danger.',
      'Gabe is playing poker with his friends when Percy gets home.'],
    [4, 'My Mother Teaches Me Bullfighting',
      'Lightning hits their car. The Minotaur attacks near Camp Half-Blood and Sally vanishes in a flash of golden light. Percy jumps aside at the last second, breaks off the Minotaur\'s horn, and stabs it. He carries Grover to the farmhouse and passes out.',
      'While racing to a safe place, Percy loses his mom to the Minotaur, then defeats the monster and reaches Camp Half-Blood.',
      'Lightning strikes the car during the storm.'],
    [5, 'I Play Pinochle with a Horse',
      'Percy wakes at the Big House, where Annabeth feeds him ambrosia. He meets Mr. D (Dionysus) and learns that Mr. Brunner is really Chiron, a centaur. Chiron explains that the Greek gods are real and that they move with the heart of Western civilization, which is now in America. Percy mostly wants to know if his mom is alive.',
      'Percy wakes up at Camp Half-Blood and learns from Chiron that the Greek gods are real and that he is a demigod.',
      'Mr. D and Chiron play a card game called pinochle.'],
    [6, 'I Become Supreme Lord of the Bathroom',
      'Annabeth, a daughter of Athena, gives Percy a tour. He is placed in the Hermes cabin with Luke because he is "undetermined." Clarisse, daughter of Ares, tries to dunk his head in a toilet, but the water explodes out at her.',
      'Percy explores camp and joins the Hermes cabin, and when Clarisse bullies him, he discovers a strange power over water.',
      'Annabeth shows Percy the different cabins.'],
    [7, 'My Dinner Goes Up in Smoke',
      'Percy settles into the crowded Hermes cabin. Luke shows that he is bitter about the gods ignoring their children. At dinner, Percy asks his goblet for a blue Coke, which reminds him of his mom, and campers scrape part of their food into a fire as an offering to the gods. Percy asks his unknown father for a sign.',
      'Percy feels left out as an undetermined camper and hopes his godly parent will finally claim him.',
      'Campers eat dinner together at the dining pavilion.'],
    [8, 'We Capture a Flag',
      'Percy surprises Luke by disarming him during sword practice. During capture the flag, Annabeth puts Percy on guard by the creek. The Ares kids attack him, but the water heals and strengthens him. Luke wins the game. Then a hellhound attacks. Hellhounds shouldn\'t be able to get into camp, so someone must have summoned it. A glowing trident appears over Percy\'s head: he is claimed as the son of Poseidon.',
      'During capture the flag, water heals Percy, a hellhound attacks him, and he is finally claimed as a son of Poseidon.',
      'Annabeth wears a cap that makes her invisible.'],
  ];

  // Key events, in order. Questions only compare events from different chapters, so the order is never ambiguous.
  const EVENTS = [
    [1, 'Nancy Bobofit ends up in the museum fountain.'],
    [1, 'Mrs. Dodds turns into a monster and Percy destroys her.'],
    [2, 'Percy overhears Grover and Mr. Brunner talking about him.'],
    [2, 'Percy and Grover see three old women cut a piece of yarn.'],
    [3, 'Percy and his mom go to the cabin at Montauk.'],
    [3, 'Percy sees that Grover has goat legs.'],
    [4, 'The Minotaur grabs Sally, and she vanishes.'],
    [4, 'Percy breaks off the Minotaur\'s horn.'],
    [5, 'Percy learns that Mr. Brunner is really Chiron.'],
    [6, 'Water from the toilets blasts Clarisse.'],
    [7, 'Campers burn part of their dinner as an offering to the gods.'],
    [8, 'A glowing trident appears over Percy\'s head.'],
  ];

  // The 10 stages we study, the part of the plot diagram each one fits, and how it shows up in Chapters 1–8.
  const STAGES = [
    { name: 'The Ordinary World', plot: 'exposition',
      what: 'The hero\'s normal, everyday life before the adventure begins.',
      percy: 'Percy is a 12-year-old at Yancy Academy, a boarding school for troubled kids. At home he lives with his mom, Sally, and his awful stepfather, Gabe (Ch. 1–3).' },
    { name: 'The Call to Adventure', plot: 'rising',
      what: 'Something happens that pulls the hero toward a new world or challenge.',
      percy: 'Strange events pile up: Mrs. Dodds turns into a monster (Ch. 1), the three old women snip a yarn (Ch. 2), and Grover arrives at Montauk warning that monsters are coming (Ch. 3).' },
    { name: 'Refusal of the Call', plot: 'rising',
      what: 'The hero (or someone close to them) hesitates, doubts, or tries to avoid the adventure.',
      percy: 'Percy tries to explain away the weird events, and Sally admits she has put off sending him to the special camp because she didn\'t want to let him go (Ch. 3). At camp, Percy struggles to believe Chiron and just wants his mom back (Ch. 5). He doesn\'t fully refuse, but he resists.' },
    { name: 'Meeting the Mentor', plot: 'rising',
      what: 'A wise guide gives the hero advice, training, or a gift.',
      percy: 'Mr. Brunner tosses Percy a pen that becomes a sword (Ch. 1). At camp, he is revealed to be Chiron, the centaur who trains heroes (Ch. 5). Grover also guides and protects Percy.' },
    { name: 'Crossing the Threshold', plot: 'rising',
      what: 'The hero leaves the ordinary world and enters the special world of the adventure.',
      percy: 'After the Minotaur attack and losing his mom, Percy crosses the property line into Camp Half-Blood (Ch. 4).' },
    { name: 'Tests, Allies, and Enemies', plot: 'rising',
      what: 'In the special world, the hero faces challenges and learns who to trust.',
      percy: 'Allies: Annabeth, Grover, Luke. Enemies: Clarisse and the Ares cabin. Tests: the bathroom fight (Ch. 6), sword practice, capture the flag, and the hellhound (Ch. 8). This is where Percy is at the end of Chapter 8.' },
    { name: 'Approach to the Inmost Cave', plot: 'rising',
      what: 'The hero gets closer to the most dangerous place or challenge.',
      percy: 'This happens after Chapter 8, once Percy starts his quest.' },
    { name: 'The Ordeal', plot: 'climax',
      what: 'The hero faces the biggest, most dangerous challenge of the story.',
      percy: 'This happens after Chapter 8.' },
    { name: 'The Reward', plot: 'falling',
      what: 'The hero survives the ordeal and gains something: an object, knowledge, or a new strength.',
      percy: 'This happens after Chapter 8.' },
    { name: 'Return with the Elixir', plot: 'resolution',
      what: 'The hero returns home, changed, bringing back something that helps others.',
      percy: 'This happens at the end of the book.' },
  ];

  const PLOT = {
    exposition: { name: 'Exposition', what: 'Introduces the characters, the setting, and the hero\'s normal life.' },
    rising:     { name: 'Rising Action', what: 'Events and conflicts build up and the tension grows. It starts with the inciting incident.' },
    climax:     { name: 'Climax', what: 'The turning point: the moment of highest tension.' },
    falling:    { name: 'Falling Action', what: 'Events after the climax, as the conflict starts to wind down.' },
    resolution: { name: 'Resolution', what: 'The conflict is solved and the story wraps up.' },
  };

  // Percy's character traits with text evidence (paraphrased: find the exact words in your book).
  const TRAITS = [
    { trait: 'Loyal', evidence: 'In Chapter 1, Percy gets angry when Nancy Bobofit picks on Grover and stands up for his friend. In Chapter 4, he carries Grover up the hill to the farmhouse even though he is exhausted and hurt.',
      explain: 'Percy sticks by his friend even when it gets him in trouble or when he is suffering himself.' },
    { trait: 'Brave', evidence: 'In Chapter 4, Percy faces the Minotaur alone, waits until the last second to jump aside, and breaks off its horn to defeat it.',
      explain: 'Instead of running away, Percy fights a monster much bigger and stronger than him.' },
    { trait: 'Quick-tempered', evidence: 'Percy has been kicked out of several schools. In Chapter 1, he loses his temper at the museum when Nancy picks on Grover.',
      explain: 'Percy\'s strong feelings sometimes make him react before he thinks, which gets him into trouble.' },
    { trait: 'Loving toward his mom', evidence: 'In Chapter 3, Percy is overjoyed to spend time with his mom at Montauk. In Chapter 4, he is heartbroken and furious when the Minotaur takes her.',
      explain: 'His mom is the most important person in his life, and losing her drives his feelings and actions.' },
    { trait: 'Feels like an outsider', evidence: 'Percy describes himself as a troubled kid who keeps getting kicked out of school (Ch. 1). At camp, he feels left out as an undetermined camper waiting for his father to claim him (Ch. 7).',
      explain: 'Percy has never felt like he fits in, which is why being claimed in Chapter 8 matters so much to him.' },
  ];

  // A model R.A.C.E.S. answer, one sentence per letter. Grade 6 materials use Chapter 8 to assess this.
  const RACES = {
    question: 'How does Percy\'s experience in Chapter 8 align with the Hero\'s Journey?',
    parts: [
      ['R', 'Restate', 'Percy\'s experience in Chapter 8 aligns with the Hero\'s Journey.'],
      ['A', 'Answer', 'It shows the stage called Tests, Allies, and Enemies, when the hero is tested in the special world, gets help from allies, and faces enemies.'],
      ['C', 'Cite', 'In Chapter 8, during capture the flag, Annabeth puts Percy on guard by the creek, Clarisse and the Ares campers attack him, and the water heals him. Later, a glowing trident appears above his head.'],
      ['E', 'Explain', 'This shows Tests, Allies, and Enemies because Percy must prove himself against enemies like Clarisse, works with allies like Annabeth and Luke, and discovers who he really is when Poseidon claims him.'],
      ['S', 'Summarize', 'In conclusion, Chapter 8 shows Percy changing from a confused outsider into a hero who is starting to understand his powers.'],
    ],
  };

  const SCOPE = [
    [1, 'Percy at Yancy Academy; Mrs. Dodds; strange events begin'],
    [2, 'Everyone denies Mrs. Dodds existed; warnings from Grover and Mr. Brunner; the Fates'],
    [3, 'Percy\'s home life with Gabe; Montauk; the storm and Grover\'s arrival'],
    [4, 'The Minotaur attack; Sally\'s sacrifice; Percy reaches Camp Half-Blood'],
    [5, 'The camp\'s Greek-mythology world; Chiron\'s explanation'],
    [6, 'Cabins, the Clarisse conflict, and Percy\'s mysterious abilities'],
    [7, 'Camp culture, Luke, Annabeth, and Percy\'s growing belonging'],
    [8, 'Capture the flag, the hellhound, and Poseidon claiming Percy'],
  ];

  // Short-answer practice by chapter: [question, answer].
  const CHAPTER_QA = {
    1: [
      ['What kind of school does Percy attend at the beginning of the novel?', 'Yancy Academy, a boarding school for troubled kids in upstate New York.'],
      ['Why does Nancy Bobofit\'s behavior upset Percy?', 'Nancy bullies Grover and throws food at him. Percy is protective of Grover, so her cruelty makes him angry.'],
      ['What happens to Mrs. Dodds at the museum?', 'She transforms into a monster (a Fury) and attacks Percy. Percy uses the pen Mr. Brunner throws him, which becomes a sword, to destroy her.'],
      ['What details suggest something supernatural is happening before Percy understands it?', 'Mrs. Dodds pulls Percy away from the class and turns into a winged monster, Mr. Brunner\'s pen becomes a sword, and afterward everyone acts as if Mrs. Dodds never existed.'],
      ['What can readers infer about Percy from how he responds to Nancy and Mrs. Dodds?', 'Percy is loyal and brave. He reacts strongly when others are treated unfairly, even though his anger sometimes gets him into trouble.'],
      ['What is the effect of telling the story from Percy\'s first-person point of view?', 'Readers experience the confusing events at the same time Percy does. Because Percy doesn\'t understand what is happening, the mystery and tension increase.'],
    ],
    2: [
      ['Why does Percy think Yancy Academy may be playing a trick on him?', 'After Mrs. Dodds disappears, everyone, including the teachers, acts as if she never existed. Percy doubts his own memory because no one confirms what he saw.'],
      ['What evidence shows that Grover knows more than he tells Percy?', 'Grover acts nervous, talks privately with Mr. Brunner about protecting Percy, panics when he sees the Fates, and insists on staying with Percy on the trip home.'],
      ['What is unusual about the three old women Percy sees cutting yarn?', 'They are like the Fates from Greek mythology, who control the thread of each person\'s life. Cutting the yarn foreshadows danger or death.'],
      ['How does the title "Three Old Ladies Knit the Socks of Death" create suspense?', 'The funny wording makes the scene memorable, but the word "death" signals that Percy has seen something threatening. It prepares readers for danger.'],
      ['What does Percy\'s decision to study for the Latin exam reveal about him?', 'He cares about Mr. Brunner\'s opinion and wants to succeed, even though school is hard for him.'],
    ],
    3: [
      ['Why is Montauk important to Percy and his mother?', 'It is where they escape Gabe. It stands for safety, happiness, and their close relationship.'],
      ['Why does Sally buy blue food?', 'It is a small act of rebellion against Gabe, who claimed blue food doesn\'t exist. It shows Sally and Percy resisting Gabe\'s controlling behavior.'],
      ['What does Percy learn about his father at Montauk?', 'Sally says his father was special and that she loved him, and that he left before Percy could know him. Percy still doesn\'t learn who his father is.'],
      ['Why does Sally want Percy to go to the special camp?', 'She knows Percy is in danger from monsters and believes the camp is the place where he can be protected.'],
      ['Which Hero\'s Journey stage do the events at Montauk show?', 'The Call to Adventure. Grover\'s warning and the danger push Percy out of his ordinary life. (When he actually enters camp in Chapter 4, that is Crossing the Threshold.)'],
    ],
    4: [
      ['How does Sally show courage during the Minotaur attack?', 'She drives through the storm, gets Percy and Grover to the hill at the edge of camp, and tells Percy how to escape, even though she can\'t enter camp herself.'],
      ['How does the Minotaur attack change Percy\'s life?', 'It destroys the ordinary world he knew. He loses his mother, learns monsters are real, and is forced into a new and dangerous world.'],
      ['Why does Percy attack the Minotaur?', 'He is grieving and furious after the Minotaur makes his mother disappear. His emotions give him the determination to fight.'],
      ['What does Percy\'s victory over the Minotaur reveal about him?', 'His courage, strength, and ability to act under pressure. It also hints that he is more powerful than he realizes.'],
      ['Which Hero\'s Journey stage does Percy enter when he arrives at Camp Half-Blood?', 'Crossing the Threshold. He leaves his normal world and enters the special world of gods, monsters, and demigods.'],
    ],
    5: [
      ['Who is Mr. Brunner really?', 'Chiron, the centaur from Greek mythology who trains heroes.'],
      ['Why is Percy confused when he wakes up at Camp Half-Blood?', 'Nothing makes sense to him: he meets a god and a centaur, and people talk calmly about things he thought were only myths.'],
      ['Why does Percy struggle to believe Chiron\'s explanation about the gods?', 'It goes against everything Percy believed about reality. He has only just learned that mythological creatures are real.'],
      ['Why does Chiron say the gods are in America?', 'The gods move with the heart of Western civilization, which Chiron says is now in the United States.'],
      ['What is Percy\'s greatest concern after learning about the mythological world?', 'Whether his mother is alive and whether he can save her.'],
      ['How does Chiron act as a mentor in Percy\'s Hero\'s Journey?', 'He gives Percy knowledge, explains the new world, and helps prepare him for the challenges ahead.'],
    ],
    6: [
      ['Why does Percy feel uncomfortable around the cabins?', 'Each cabin belongs to the children of one god, but Percy doesn\'t know who his godly parent is. He feels different and unsure where he belongs.'],
      ['Why does Clarisse challenge Percy?', 'She sees him as a weak outsider and uses intimidation to show her power.'],
      ['What happens during Percy\'s conflict with Clarisse in the bathroom?', 'Water bursts out of the toilets and drenches Clarisse and her friends.'],
      ['What does the bathroom incident suggest about Percy?', 'He has a special connection to water and may be the child of a sea-related god.'],
      ['How does Annabeth\'s attitude toward Percy change after the bathroom incident?', 'She becomes more curious and interested in him, because his powers might reveal who his godly parent is.'],
      ['How does the bathroom scene develop the conflict between Percy and Clarisse?', 'Percy embarrasses Clarisse, so their rivalry grows. The scene sets Clarisse up as an antagonist at camp.'],
    ],
    7: [
      ['What does it mean that Percy is "undetermined"?', 'His godly parent hasn\'t claimed him yet, so no one knows which god is his father.'],
      ['Why does Luke feel bitter about the gods?', 'He believes the gods neglect their demigod children and don\'t act like responsible parents.'],
      ['What do the burnt offerings at dinner symbolize?', 'Campers burn part of their meal for the gods. It shows their connection to the gods and their hope that the gods will notice and help them.'],
      ['Why does Percy ask for a blue Coke?', 'It reminds him of his mom and their blue-food tradition. It shows he is grieving and wants to hold on to his connection with Sally.'],
      ['How does Percy begin to change at camp in this chapter?', 'He starts to feel less alone. He meets possible friends, learns about camp life, and starts to believe he might belong in this new world.'],
      ['What Hero\'s Journey element do Grover, Annabeth, and Luke represent?', 'Allies. They give Percy information, friendship, training, or support as he adjusts to the special world.'],
    ],
    8: [
      ['Why can\'t the counselors figure out Percy\'s godly parent?', 'Percy doesn\'t show a clear talent that matches any one god\'s children, so his parentage is hard to determine.'],
      ['How does Percy surprise Luke during sword practice?', 'He disarms Luke, showing unusual skill with a sword even though he has almost no training.'],
      ['Why did Zeus, Poseidon, and Hades swear not to have more children?', 'The Big Three feared a prophecy that one of their children could become powerful enough to cause great destruction.'],
      ['Why does the story of Thalia make Percy feel guilty?', 'Grover failed to save Thalia, and now Grover is responsible for protecting Percy. Percy feels guilty because Grover could suffer again if something happens to him.'],
      ['Why does Percy feel left out during capture the flag?', 'He is treated as inexperienced. Annabeth puts him on guard by the creek instead of in the middle of the action.'],
      ['How does Percy defeat Clarisse and the Ares campers?', 'When he steps into the creek, the water heals and strengthens him, and he fights them off.'],
      ['How is Percy claimed?', 'After the hellhound attack, Percy\'s wounds heal in the water, and a glowing green trident appears above his head. Poseidon has claimed him as his son.'],
      ['Why is the hellhound\'s appearance important?', 'A hellhound shouldn\'t be able to get into Camp Half-Blood. Someone must have summoned it, which suggests betrayal or an enemy inside camp.'],
      ['How does Chapter 8 create a new problem even as Percy learns who his father is?', 'Being Poseidon\'s son makes Percy important and dangerous, and the hellhound shows that an enemy may already be inside camp.'],
    ],
  };

  const JOURNEY_QA = [
    ['What is Percy\'s Ordinary World?', 'His difficult life as a student at Yancy Academy and at home with Sally and Gabe. He has problems, but he doesn\'t yet know that gods and monsters are real.'],
    ['What is Percy\'s Call to Adventure?', 'It begins when Mrs. Dodds attacks him and becomes impossible to ignore when the Minotaur attacks Percy, Grover, and Sally. Percy has to leave ordinary life and go to Camp Half-Blood.'],
    ['Does Percy refuse the call? Explain.', 'Not completely, but he resists. He questions Chiron\'s explanation, wants his mother back, and struggles to accept that he is a demigod. Sally also held back from sending him to camp.'],
    ['Who is Percy\'s mentor in Chapters 1–8?', 'Chiron. He explains the mythological world, teaches Percy about who he is, and guides him at camp. As Mr. Brunner, he already played this role before Percy knew the truth.'],
    ['What threshold does Percy cross?', 'He crosses into Camp Half-Blood. From then on, he lives in the world of Greek mythology instead of the ordinary human world.'],
    ['Name two allies Percy has by Chapter 8.', 'Grover protects Percy and brings him to camp. Annabeth helps him learn about camp and plans the strategy for capture the flag. (Luke is also an ally.)'],
    ['Name two tests Percy faces at camp by Chapter 8.', 'Clarisse\'s bullying, sword practice, capture the flag, and the hellhound. (The Fury and the Minotaur happen <em>before</em> he crosses the threshold, so they fit better with the Call to Adventure.)'],
    ['How does Percy\'s experience in Chapter 8 align with the Hero\'s Journey?', 'Percy faces tests, gets help from allies, and discovers a major part of his identity when Poseidon claims him. It confirms he has crossed into a new world and is changing from a confused outsider into a hero.'],
  ];

  const MODEL_RESPONSES = [
    ['Characterization', 'How does Percy respond to challenges in Chapters 1–8, and what do his responses reveal about him?',
      'Percy usually responds to challenges with loyalty, courage, and quick action. For example, he becomes angry when Nancy bullies Grover, even though standing up to her gets him in trouble. Later, Percy fights the Minotaur after his mother disappears, even though he is scared and confused. At Camp Half-Blood, he stands up to Clarisse and defends himself during capture the flag. These reactions show that Percy is not always calm, but he is brave and strongly protective of the people he cares about.'],
    ['Hero\'s Journey', 'Explain how Percy\'s experiences in Chapter 8 connect to the Hero\'s Journey.',
      'Chapter 8 connects to the Hero\'s Journey because Percy faces important tests after entering the special world of Camp Half-Blood. During capture the flag, he works with Annabeth and defends himself against Clarisse and the Ares campers. Percy also discovers that water gives him strength and heals him. At the end of the chapter, Poseidon claims him, which reveals that Percy has a larger role in the mythological world. These events show Percy moving from an uncertain newcomer toward becoming a hero.'],
    ['Theme', 'What theme about identity develops in Chapters 1–8?',
      'One theme is that understanding your identity can be difficult but empowering. At first, Percy believes he is just a student who struggles in school and gets into trouble. At Camp Half-Blood, he learns that his differences, like his dyslexia, his ADHD, and his connection to water, have a larger meaning. When Poseidon claims him, Percy begins to understand who he is. This doesn\'t solve all his problems, but it gives him a clearer sense of belonging and purpose.'],
  ];

  const CH8_KEY = [
    ['Percy\'s parent', 'Poseidon'],
    ['Symbol above Percy', 'A glowing green trident'],
    ['Why water matters', 'It heals and strengthens Percy'],
    ['Main rivals in the game', 'Clarisse and the Ares cabin'],
    ['Annabeth\'s role', 'Ally and strategist'],
    ['Threat inside camp', 'A hellhound, suggesting betrayal or an intruder'],
    ['Hero\'s Journey stage', 'Tests, Allies, and Enemies'],
    ['Major change in Percy', 'From "undetermined" outsider to recognized son of Poseidon'],
  ];

  // ---------- Fixed question bank. The first option is correct; the others carry a targeted hint. ----------
  const BANK = [
    // Chapters 1–4
    { skill: 'early', prompt: 'What does Mr. Brunner throw to Percy when Mrs. Dodds attacks?',
      options: [['A pen that turns into a sword'], ['A bow and arrows', 'Think smaller. It looks like something a teacher would carry.'], ['A shield', 'Percy needs something to strike with, and it starts out looking like a school supply.'], ['A cap of invisibility', 'That is Annabeth\'s magic item at camp.']],
      explanation: 'Mr. Brunner tosses Percy a ballpoint pen that becomes a bronze sword, and Percy uses it to destroy Mrs. Dodds.' },
    { skill: 'early', prompt: 'After Mrs. Dodds disappears, what do Grover and the other students say?',
      options: [['That there was never a Mrs. Dodds'], ['That Percy should be expelled for attacking her', 'No one talks about an attack. They act like she never existed.'], ['That she moved to another school', 'They don\'t give any reason she left. Remember who they say the pre-algebra teacher is.'], ['That they saw the monster too', 'Nobody admits to seeing anything, which makes Percy feel crazy.']],
      explanation: 'Everyone insists the pre-algebra teacher has always been Mrs. Kerr, and that there was never a Mrs. Dodds.' },
    { skill: 'early', prompt: 'Why is Grover so frightened when one of the old women snips the yarn?',
      options: [['The women are the Fates, and a cut thread means someone\'s life will end'], ['He is afraid of sharp scissors', 'Think about who the three women really are in Greek mythology.'], ['The yarn was his favorite color', 'The yarn matters because of what it stands for.'], ['He thinks the women will chase the bus', 'The women stay at the fruit stand. Think about what the cut yarn means.']],
      explanation: 'The three women are the Fates, who spin, measure, and cut the thread of life. A cut thread means someone will die.' },
    { skill: 'early', prompt: 'How does Percy defeat the Minotaur in Chapter 4?',
      options: [['He breaks off its horn and stabs it'], ['He drowns it in the ocean', 'Water helps Percy later, but not in this fight.'], ['He uses his pen-sword', 'Percy doesn\'t have the sword with him during the Minotaur fight.'], ['Chiron shoots it with arrows', 'Percy fights the Minotaur alone.']],
      explanation: 'Percy jumps aside at the last second (like a bullfighter), climbs onto the Minotaur, snaps off its horn, and stabs it. The monster turns to dust.' },
    { skill: 'early', prompt: 'What happens to Sally Jackson in Chapter 4?',
      options: [['The Minotaur grabs her and she vanishes in a golden light'], ['She drives back to New York', 'She never leaves the hill. Think about the Minotaur.'], ['She enters Camp Half-Blood with Percy', 'Sally is mortal and can\'t cross into camp.'], ['She is turned to stone', 'That isn\'t what happens. Look back at the Minotaur attack.']],
      explanation: 'The Minotaur grabs Sally, and she dissolves into a shimmering golden light. Percy believes she is gone.' },

    // Chapters 5–8
    { skill: 'camp', prompt: 'What surprising thing does Percy learn about Mr. Brunner in Chapter 5?',
      options: [['He is Chiron, a centaur'], ['He is Percy\'s father', 'Percy\'s father is a god. Think about why Mr. Brunner uses a wheelchair.'], ['He is a satyr like Grover', 'Grover is the satyr. Mr. Brunner is half horse, not half goat.'], ['He is Mr. D in disguise', 'Mr. D is Dionysus. Mr. Brunner is a different camp leader.']],
      explanation: 'Mr. Brunner is Chiron the centaur. His magic wheelchair hides his horse body.' },
    { skill: 'camp', prompt: 'Why is Percy placed in the Hermes cabin?',
      options: [['He is "undetermined": his godly parent hasn\'t claimed him yet'], ['His father is Hermes', 'Hermes is the god of travelers, so his cabin takes in campers whose parent is still unknown.'], ['Annabeth chose it for him', 'It isn\'t Annabeth\'s decision. It\'s about who his parent is.'], ['It\'s the cabin closest to the Big House', 'The reason is about his godly parent, not location.']],
      explanation: 'Hermes, god of travelers, welcomes all guests, so undetermined campers like Percy stay in his cabin until they are claimed.' },
    { skill: 'camp', prompt: 'What happens when Clarisse tries to stick Percy\'s head in a toilet?',
      options: [['The water explodes out of the toilets and blasts her'], ['Annabeth fights her off', 'Annabeth is there, but she doesn\'t stop it.'], ['Luke stops her', 'Luke isn\'t in the bathroom. Think about what the water does.'], ['Percy gives up and gets dunked', 'This is how Percy earns the title "Supreme Lord of the Bathroom."']],
      explanation: 'The water from the toilets shoots out at Clarisse and her friends, a clue that Percy can control water.' },
    { skill: 'camp', prompt: 'During capture the flag, what happens when Percy steps into the creek?',
      options: [['His wounds heal and he feels stronger'], ['He gets swept downstream', 'The water does the opposite. It helps him.'], ['He becomes invisible', 'Annabeth is the one who becomes invisible, using her cap.'], ['He loses his sword', 'Think about how the water affects his injuries.']],
      explanation: 'The water heals Percy\'s cuts and gives him energy. It\'s a strong clue that his father is the sea god.' },
    { skill: 'camp', prompt: 'How is Percy "claimed" by his father at the end of Chapter 8?',
      options: [['A glowing green trident appears above his head'], ['A lightning bolt strikes near him', 'The lightning bolt is the symbol of Zeus, not Percy\'s father.'], ['Chiron reads a letter from his father', 'The claiming is a magical sign, not a letter.'], ['An owl lands on his shoulder', 'The owl is the symbol of Athena, Annabeth\'s mother.']],
      explanation: 'A shimmering green trident, the symbol of Poseidon, glows above Percy\'s head, showing he is the son of the sea god.' },

    // Characters
    { skill: 'characters', prompt: 'Who is Grover Underwood really?',
      options: [['A satyr sent to protect Percy'], ['A son of Hermes', 'Luke is the son of Hermes. Grover is half goat.'], ['A centaur', 'Chiron is the centaur. Grover is half goat.'], ['One of the Furies', 'Mrs. Dodds was the Fury. Grover is Percy\'s friend.']],
      explanation: 'Grover is a satyr (half man, half goat) whose job is to find demigods and bring them safely to camp.' },
    { skill: 'characters', prompt: 'Which character is the daughter of Athena?',
      options: [['Annabeth'], ['Clarisse', 'Clarisse is a daughter of Ares, god of war.'], ['Sally', 'Sally is Percy\'s mortal mother.'], ['Nancy Bobofit', 'Nancy is the mean girl from Yancy Academy, a mortal.']],
      explanation: 'Annabeth Chase is a daughter of Athena, goddess of wisdom, which fits how smart and strategic she is.' },
    { skill: 'characters', prompt: 'Who is Mr. D?',
      options: [['Dionysus, the camp director'], ['Mr. Brunner', 'Mr. Brunner is Chiron. Mr. D is a different camp leader.'], ['Percy\'s stepfather', 'Percy\'s stepfather is Gabe Ugliano.'], ['Hermes', 'Hermes is Luke\'s father. Mr. D is the god of wine.']],
      explanation: 'Mr. D is Dionysus, god of wine, who runs the camp and grumpily calls Percy "Peter Johnson."' },
    { skill: 'characters', prompt: 'Which word best describes Gabe Ugliano?',
      options: [['Selfish'], ['Brave', 'Gabe does nothing heroic. Think about how he treats Sally and Percy.'], ['Wise', 'Gabe spends his time playing poker and bossing Sally around.'], ['Protective', 'Grover is the protector. Gabe only cares about himself.']],
      explanation: 'Gabe is lazy and selfish. He orders Sally around and cares mostly about his poker games and his car.' },
    { skill: 'characters', prompt: 'Who is Mrs. Dodds really?',
      options: [['One of the Furies'], ['One of the Fates', 'The Fates are the three women knitting at the fruit stand.'], ['Annabeth\'s mother', 'Annabeth\'s mother is the goddess Athena.'], ['A satyr', 'Grover is the satyr. Mrs. Dodds is a monster.']],
      explanation: 'Mrs. Dodds is one of the Furies, also called "the Kindly Ones," monsters who punish people.' },

    // Hero's Journey stages
    { skill: 'stages', prompt: 'In the Hero\'s Journey, what is the "Ordinary World"?',
      options: [['The hero\'s normal life before the adventure'], ['The special world where the hero is tested', 'That describes the world the hero enters <em>after</em> crossing the threshold.'], ['The place the hero returns to with a reward', 'That is the end of the journey. The ordinary world comes first.'], ['The moment the hero meets a guide', 'That is "Meeting the Mentor."']],
      explanation: 'The Ordinary World is the hero\'s everyday life at the start of the story, before the adventure changes everything.' },
    { skill: 'stages', prompt: 'What is the role of a mentor in the Hero\'s Journey?',
      options: [['To guide, train, or give the hero a helpful gift'], ['To fight the hero', 'Someone who fights the hero is an enemy.'], ['To be rescued by the hero', 'The mentor helps the hero, not the other way around.'], ['To start the adventure by causing trouble', 'The mentor\'s job is to help and advise.']],
      explanation: 'A mentor is a wise guide who prepares the hero with advice, training, or a gift.' },
    { skill: 'stages', prompt: 'What happens in the "Crossing the Threshold" stage?',
      options: [['The hero leaves the ordinary world and enters the special world'], ['The hero returns home changed', 'That happens at the very end: "Return with the Elixir."'], ['The hero refuses to go on the adventure', 'That is "Refusal of the Call."'], ['The hero faces the biggest challenge of the story', 'That is "The Ordeal," much later in the journey.']],
      explanation: 'Crossing the Threshold is the point of no return, when the hero commits to the adventure and enters a new world.' },
    { skill: 'stages', prompt: 'Which stage comes right after "Meeting the Mentor"?',
      options: [['Crossing the Threshold'], ['The Call to Adventure', 'The call comes earlier, before the mentor.'], ['The Ordeal', 'The Ordeal is much later, near the climax.'], ['The Ordinary World', 'The Ordinary World is the very first stage.']],
      explanation: 'After the mentor prepares the hero, the hero is ready to cross the threshold into the special world.' },
    { skill: 'stages', prompt: 'What happens in "Refusal of the Call"?',
      options: [['The hero (or someone close to them) hesitates or tries to avoid the adventure'], ['The hero gets a gift from a guide', 'That is "Meeting the Mentor."'], ['The hero defeats the main enemy', 'That is "The Ordeal."'], ['The hero brings something helpful home', 'That is "Return with the Elixir."']],
      explanation: 'In Refusal of the Call, fear or doubt makes the hero (or someone who cares about them) hold back from the adventure.' },

    // Percy's journey
    { skill: 'journey', prompt: 'Which event is part of Percy\'s Ordinary World?',
      options: [['Getting in trouble at Yancy Academy'], ['Playing capture the flag', 'Capture the flag happens at camp, in the special world.'], ['Being claimed by Poseidon', 'This happens at camp, in the special world.'], ['Living in the Hermes cabin', 'The Hermes cabin is at camp, in the special world.']],
      explanation: 'Percy\'s ordinary world is his life at Yancy Academy and at home with Sally and Gabe.' },
    { skill: 'journey', prompt: 'Who is Percy\'s main mentor in Chapters 1–8?',
      options: [['Chiron (Mr. Brunner)'], ['Clarisse', 'Clarisse is an enemy who tests Percy.'], ['Gabe Ugliano', 'Gabe is part of Percy\'s ordinary world and doesn\'t help him.'], ['Mrs. Dodds', 'Mrs. Dodds is a monster who attacks Percy.']],
      explanation: 'Chiron is the classic mentor: he gives Percy the pen-sword, teaches him, and trains heroes at camp.' },
    { skill: 'journey', prompt: 'Percy\'s fights with Clarisse and the hellhound best fit which stage?',
      options: [['Tests, Allies, and Enemies'], ['The Ordinary World', 'These events happen at camp, in the special world.'], ['Refusal of the Call', 'Percy isn\'t avoiding the adventure here. He\'s being tested.'], ['Return with the Elixir', 'That\'s the end of the journey. Percy has only just arrived at camp.']],
      explanation: 'At camp Percy faces challenges (tests), makes friends like Annabeth and Luke (allies), and meets rivals like Clarisse (enemies).' },
    { skill: 'journey', prompt: 'Which event is part of Percy\'s "Call to Adventure"?',
      options: [['Mrs. Dodds attacks him at the museum'], ['He wakes up at the Big House', 'By then Percy has already crossed into the special world.'], ['He wins capture the flag', 'That is a test at camp, later in the journey.'], ['He moves into the Hermes cabin', 'By then Percy is already at camp.']],
      explanation: 'The attack at the museum is the first sign that Percy\'s life is about to change. The call keeps growing with the Fates and the Minotaur.' },
    { skill: 'journey', prompt: 'Which event best shows Percy "Crossing the Threshold"?',
      options: [['He enters Camp Half-Blood after the Minotaur attack'], ['He goes on the field trip to the museum', 'The museum is still part of his ordinary world.'], ['He sees the Fates cut the yarn', 'That is part of the call to adventure, a warning that things are changing.'], ['He is claimed by Poseidon', 'By then he has already crossed into the special world.']],
      explanation: 'When Percy enters camp in Chapter 4, he leaves his old life behind and enters the special world of gods and monsters.' },
    { skill: 'journey', prompt: 'Which stage of the Hero\'s Journey is Percy in at the end of Chapter 8?',
      options: [['Tests, Allies, and Enemies'], ['The Ordinary World', 'Percy left his ordinary world when he entered camp.'], ['The Ordeal', 'The Ordeal is the biggest challenge of the whole story, near the climax.'], ['Return with the Elixir', 'That is the very last stage, when the hero comes home.']],
      explanation: 'At camp Percy is still being tested and learning who his allies (Annabeth, Luke, Grover) and enemies (Clarisse) are.' },
    { skill: 'journey', prompt: 'Which detail could be evidence for "Refusal of the Call"?',
      options: [['Sally admits she put off sending Percy to the special camp because she didn\'t want to let him go'], ['Percy breaks off the Minotaur\'s horn', 'That shows Percy facing the danger, not avoiding it.'], ['Annabeth gives Percy a tour of camp', 'That happens after Percy has crossed into the special world.'], ['Percy is claimed by Poseidon', 'That happens during tests at camp, much later.']],
      explanation: 'Refusal of the Call can come from someone close to the hero. Sally held Percy back from the adventure because she wanted to keep him with her.' },

    // Plot diagram
    { skill: 'plot', prompt: 'Which part of the plot diagram does "The Ordinary World" match?',
      options: [['Exposition'], ['Climax', 'The climax is the turning point. The Ordinary World comes at the very beginning.'], ['Falling Action', 'Falling action comes after the climax.'], ['Resolution', 'The resolution is the end. The Ordinary World is the beginning.']],
      explanation: 'The exposition introduces the characters and setting, just as the Ordinary World shows the hero\'s normal life.' },
    { skill: 'plot', prompt: 'Which stage of the Hero\'s Journey matches the climax?',
      options: [['The Ordeal'], ['The Ordinary World', 'That matches the exposition, at the beginning.'], ['Meeting the Mentor', 'That is part of the rising action, while tension is still building.'], ['Return with the Elixir', 'That matches the resolution, at the end.']],
      explanation: 'The climax is the moment of highest tension. In the Hero\'s Journey, that is the Ordeal, the hero\'s biggest challenge.' },
    { skill: 'plot', prompt: '"Tests, Allies, and Enemies" fits which part of the plot diagram?',
      options: [['Rising Action'], ['Exposition', 'The exposition is the hero\'s normal life. Tests happen after the adventure has started.'], ['Climax', 'The tests build up <em>toward</em> the climax.'], ['Resolution', 'The resolution is the end of the story.']],
      explanation: 'Tests, allies, and enemies build up the conflict and tension, which is what happens in the rising action.' },
    { skill: 'plot', prompt: '"Return with the Elixir" matches which part of the plot diagram?',
      options: [['Resolution'], ['Rising Action', 'The rising action builds tension. Returning home happens at the very end.'], ['Climax', 'The climax is the biggest challenge (the Ordeal).'], ['Exposition', 'The exposition is the beginning of the story.']],
      explanation: 'When the hero returns home changed, the conflict is solved and the story wraps up: the resolution.' },
    { skill: 'plot', prompt: 'Where on the plot diagram are Chapters 1–8 of The Lightning Thief?',
      options: [['Exposition and rising action'], ['Climax', 'Percy hasn\'t faced his biggest challenge yet. The tension is still building.'], ['Falling action and resolution', 'Those come after the climax, near the end of the book.'], ['Only the resolution', 'The resolution is the very end of the story.']],
      explanation: 'Chapters 1–8 introduce Percy\'s world (exposition) and build tension as his adventure begins (rising action).' },
    { skill: 'plot', prompt: '"The Reward" happens right after the Ordeal. Which part of the plot diagram is it?',
      options: [['Falling Action'], ['Rising Action', 'Rising action happens <em>before</em> the climax.'], ['Exposition', 'The exposition is the beginning of the story.'], ['Climax', 'The Ordeal is the climax. The Reward comes just after it.']],
      explanation: 'After the climax, the tension starts to drop as the hero gains a reward: that is the falling action.' },
    { skill: 'plot', prompt: 'Which part of the plot diagram includes the most Hero\'s Journey stages?',
      options: [['Rising Action'], ['Exposition', 'The exposition only matches the Ordinary World.'], ['Climax', 'The climax only matches the Ordeal.'], ['Resolution', 'The resolution only matches Return with the Elixir.']],
      explanation: 'Stages 2–7 (from the Call to Adventure to the Approach) all build tension, so they are all part of the rising action.' },

    // Character analysis
    { skill: 'traits', prompt: 'Which evidence best supports the idea that Percy is <strong>loyal</strong>?',
      options: [['He carries Grover up the hill to the farmhouse even though he is exhausted (Ch. 4)'], ['He breaks off the Minotaur\'s horn (Ch. 4)', 'That shows bravery more than loyalty. Look for Percy standing by a friend.'], ['Annabeth gives Percy a tour of camp (Ch. 6)', 'That is about Annabeth\'s actions, not Percy\'s.'], ['Gabe plays poker with his friends (Ch. 3)', 'That is about Gabe, not Percy.']],
      explanation: 'Carrying Grover to safety when he is hurt himself shows Percy won\'t abandon his friend.' },
    { skill: 'traits', prompt: 'Which evidence best supports the idea that Percy is <strong>brave</strong>?',
      options: [['He faces the Minotaur alone and defeats it (Ch. 4)'], ['He scrapes some of his dinner into the fire (Ch. 7)', 'That shows respect for the gods and hope, not bravery.'], ['He studies for his Latin final (Ch. 2)', 'That shows he cares about Mr. Brunner\'s opinion, not bravery.'], ['Mr. D calls him "Peter Johnson" (Ch. 5)', 'That is about Mr. D, not Percy.']],
      explanation: 'Fighting a giant monster instead of running away is strong evidence of bravery.' },
    { skill: 'traits', prompt: 'Percy carries Grover up the hill even though he is exhausted (Ch. 4). Which trait does this evidence best show?',
      options: [['Loyal'], ['Selfish', 'A selfish person would save only himself.'], ['Lazy', 'Carrying someone up a hill is the opposite of lazy.'], ['Dishonest', 'Nothing in this evidence is about lying.']],
      explanation: 'Percy puts his friend\'s safety first, even when he is hurt himself. That shows loyalty.' },
    { skill: 'traits', prompt: 'At camp, Percy feels left out while he waits to be claimed (Ch. 7). Which trait does this evidence best show?',
      options: [['He feels like an outsider'], ['He is cruel to others', 'Nothing here shows Percy being mean.'], ['He is very confident', 'Feeling left out shows the opposite of confidence.'], ['He is lazy', 'This evidence is about his feelings, not his effort.']],
      explanation: 'Percy has never fit in anywhere, and being undetermined at camp makes him feel like he doesn\'t belong there either.' },
    { skill: 'traits', prompt: 'Percy has been kicked out of several schools and loses his temper at the museum (Ch. 1). Which trait does this best show?',
      options: [['Quick-tempered'], ['Patient', 'Losing his temper is the opposite of patient.'], ['Shy', 'A shy person would probably stay quiet.'], ['Wise', 'Getting kicked out of school isn\'t usually a sign of wisdom.']],
      explanation: 'Percy\'s strong feelings make him react quickly, which often gets him into trouble.' },
    { skill: 'traits', prompt: 'What makes text evidence <strong>strong</strong> when you analyze a character?',
      options: [['It comes from the book and clearly supports the trait you named'], ['It is your opinion about the character', 'An opinion is your answer. Evidence has to come from the text.'], ['It is the longest quote you can find', 'Longer isn\'t better. The evidence has to clearly prove your point.'], ['It describes a different character', 'The evidence should show what <em>your</em> character says, does, or thinks.']],
      explanation: 'Strong evidence comes straight from the text (what the character says, does, thinks, or how others react) and clearly proves the trait.' },
    { skill: 'traits', prompt: 'Which sentence is a character trait, not an event?',
      options: [['Percy is loyal to his friends.'], ['Percy goes to Camp Half-Blood.', 'That is something that happens. A trait describes what Percy is <em>like</em>.'], ['Percy fights the Minotaur.', 'That is an event. It could be <em>evidence</em> for a trait like brave.'], ['Percy sees three old women at a fruit stand.', 'That is an event. A trait describes what Percy is <em>like</em>.']],
      explanation: 'A trait is a word that describes someone\'s personality, like loyal, brave, or quick-tempered. Events are the evidence that prove it.' },

    // More key events from the chapter-by-chapter review
    { skill: 'early', prompt: 'What kind of school is Yancy Academy?',
      options: [['A boarding school for troubled kids'], ['A school for demigods', 'That describes Camp Half-Blood, not Yancy.'], ['A school for gifted athletes', 'Percy describes Yancy as a place for kids who get in trouble.'], ['A public school in Manhattan', 'Yancy is a boarding school in upstate New York.']],
      explanation: 'Yancy Academy is a boarding school for troubled kids in upstate New York.' },
    { skill: 'early', prompt: 'Why does Nancy Bobofit make Percy angry on the field trip?',
      options: [['She bullies Grover and throws food at him'], ['She steals Percy\'s lunch', 'Nancy\'s target is someone else. Think about who Percy protects.'], ['She tells Mr. Brunner a lie about Percy', 'Think about how Nancy treats Percy\'s best friend.'], ['She pushes Percy into the fountain', 'Nancy is the one who ends up in the fountain.']],
      explanation: 'Nancy picks on Grover and throws food at him. Percy is protective of his friend, so it makes him furious.' },
    { skill: 'camp', prompt: 'Why does Chiron say the Greek gods are now in America?',
      options: [['They move with the heart of Western civilization'], ['They were banished from Greece', 'Chiron describes the gods moving on purpose, following something.'], ['Mount Olympus was destroyed', 'The gods still have Olympus. It moves with them.'], ['They wanted to watch over Percy', 'The reason is much bigger than one demigod.']],
      explanation: 'Chiron explains that the gods move with the heart of Western civilization, which is now in the United States.' },
    { skill: 'camp', prompt: 'How does Percy surprise Luke during sword practice?',
      options: [['He disarms Luke'], ['He refuses to fight', 'Percy does fight, and better than expected.'], ['He controls water to knock Luke over', 'There is no water involved in this moment. It\'s about sword skill.'], ['He beats Luke in an archery contest', 'This is sword practice, not archery.']],
      explanation: 'Even with almost no training, Percy knocks the sword out of Luke\'s hand, a sign of his hidden abilities.' },

    // Inference, symbols, and theme
    { skill: 'meaning', prompt: 'Why does Sally buy blue food?',
      options: [['It is a small rebellion against Gabe, who said blue food doesn\'t exist'], ['Blue is Poseidon\'s favorite color', 'Sally never says that. Think about Gabe.'], ['It is cheaper than other food', 'The reason is about Gabe, not money.'], ['Percy is allergic to other food', 'The reason is about standing up to Gabe.']],
      explanation: 'Gabe claimed there is no such thing as blue food, so Sally buys it to quietly resist his controlling behavior.' },
    { skill: 'meaning', prompt: 'Why does Percy ask for a blue Coke at dinner in Chapter 7?',
      options: [['It reminds him of his mom and their blue-food tradition'], ['It is the only drink at camp', 'The goblets can fill with any drink. Percy chooses blue on purpose.'], ['Blue drinks give demigods power', 'There\'s no magic in the color. It\'s about a memory.'], ['Luke dares him to', 'Percy chooses it himself. Think about Sally.']],
      explanation: 'The blue Coke connects Percy to his mom. It shows he is grieving and wants to hold on to her.' },
    { skill: 'meaning', prompt: 'What is the effect of telling the story from Percy\'s first-person point of view?',
      options: [['Readers experience confusing events at the same time Percy does, which builds mystery'], ['Readers know what every character is thinking', 'In first person we only know Percy\'s thoughts.'], ['Readers learn the ending right away', 'Percy doesn\'t know what will happen, so neither do we.'], ['It makes the story less exciting', 'It actually builds tension, because we\'re as confused as Percy.']],
      explanation: 'Because Percy narrates and doesn\'t understand what\'s happening, readers are kept in suspense right alongside him.' },
    { skill: 'meaning', prompt: 'How does the title "Three Old Ladies Knit the Socks of Death" create suspense?',
      options: [['The funny wording is memorable, but "death" signals danger ahead'], ['It tells readers exactly who will die', 'It hints at danger without saying what will happen.'], ['It shows the chapter is only a joke', 'The humor hides a real threat.'], ['It explains who Percy\'s father is', 'The title is about the Fates, not Percy\'s father.']],
      explanation: 'The humorous title grabs attention, while the word "death" warns that something threatening is coming.' },
    { skill: 'meaning', prompt: 'Why is the hellhound\'s appearance at camp so important?',
      options: [['Hellhounds shouldn\'t be able to get in, so someone inside camp may have summoned it'], ['It shows hellhounds are friendly to demigods', 'The hellhound attacks Percy. It is a threat.'], ['It proves Percy is the son of Hades', 'Percy is claimed by Poseidon right after.'], ['It means capture the flag was canceled', 'The game had already ended. Think about the bigger danger.']],
      explanation: 'Camp is protected, so the hellhound must have been summoned from inside. That suggests betrayal or an enemy at camp.' },
    { skill: 'meaning', prompt: 'Which theme about identity develops in Chapters 1–8?',
      options: [['Understanding who you are can be difficult but empowering'], ['It is best to hide what makes you different', 'Percy\'s differences turn out to be strengths.'], ['Family doesn\'t matter', 'Percy\'s connection to his mom and his search for his father matter a lot.'], ['Winning games is the most important thing', 'Capture the flag matters because of what Percy learns about himself.']],
      explanation: 'Percy goes from feeling like a troubled kid to learning that his differences (dyslexia, ADHD, his link to water) have meaning, which gives him a sense of belonging.' },
    { skill: 'meaning', prompt: 'What does Montauk represent for Percy and his mom?',
      options: [['Safety, happiness, and their close relationship, away from Gabe'], ['The place where Percy first fights a monster', 'Percy first fights a monster at the museum.'], ['The entrance to Camp Half-Blood', 'Camp is on Long Island, but Montauk is their beach getaway.'], ['A place Percy hates visiting', 'Percy loves Montauk because he gets time alone with his mom.']],
      explanation: 'Montauk is where Percy and Sally escape Gabe, so it stands for safety and their close bond.' },
    { skill: 'meaning', prompt: 'What do the burnt offerings at camp dinners symbolize?',
      options: [['The campers\' connection to the gods and their hope the gods will notice them'], ['That the food at camp tastes bad', 'The offerings are a ritual, not a complaint about food.'], ['A punishment for breaking camp rules', 'Every camper makes an offering, not just rule-breakers.'], ['That the campers are not hungry', 'They burn only part of their meal, as a gift to the gods.']],
      explanation: 'Burning part of their food for the gods shows the campers\' connection to their godly parents and their hope for help.' },

    // More Hero's Journey connections
    { skill: 'journey', prompt: 'Which characters are Percy\'s allies by the end of Chapter 8?',
      options: [['Grover, Annabeth, and Luke'], ['Clarisse, Gabe, and Mrs. Dodds', 'Those are enemies or obstacles, not allies.'], ['Nancy Bobofit and Clarisse', 'Both of them pick on Percy or his friends.'], ['The Minotaur and the hellhound', 'Those are monsters that attack Percy.']],
      explanation: 'Grover protects Percy, Annabeth teaches him and plans their strategy, and Luke helps him settle in at camp.' },
    { skill: 'journey', prompt: 'Which is the best example of a <strong>test</strong> Percy faces after crossing the threshold?',
      options: [['Capture the flag'], ['The Mrs. Dodds attack', 'That happens before Percy crosses into camp. It is part of his call to adventure.'], ['Studying for his Latin exam', 'That is part of his ordinary world at Yancy.'], ['Going to Montauk with his mom', 'That is still Percy\'s ordinary world.']],
      explanation: 'Tests happen in the special world. Capture the flag is a test Percy faces at Camp Half-Blood.' },

    { skill: 'traits', prompt: 'What can readers infer about Percy from how he responds to Nancy and Mrs. Dodds in Chapter 1?',
      options: [['He is loyal and brave, though his anger can get him in trouble'], ['He is shy and avoids conflict', 'Percy reacts strongly. He doesn\'t avoid conflict.'], ['He doesn\'t care about his friends', 'He gets angry because he cares about Grover.'], ['He is calm in every situation', 'Percy often reacts with strong emotions.']],
      explanation: 'Percy stands up for Grover and fights Mrs. Dodds, showing loyalty and bravery, but his temper also causes trouble.' },

    // R.A.C.E.S.
    { skill: 'races', prompt: 'In R.A.C.E.S., what does the <strong>C</strong> stand for?',
      options: [['Cite evidence from the text'], ['Compare two characters', 'Comparing might be part of your answer, but C is about evidence.'], ['Copy the question', 'You restate the question in your own words (R). C is about evidence.'], ['Conclude your answer', 'Wrapping up is the S (Summarize).']],
      explanation: 'C means cite evidence: give a detail or quote from the text that supports your answer, and say where it is.' },
    { skill: 'races', prompt: 'In R.A.C.E.S., what does the <strong>E</strong> stand for?',
      options: [['Explain how the evidence supports your answer'], ['Give an example from your own life', 'Your evidence and explanation should be about the text.'], ['End the paragraph', 'Ending is the S (Summarize).'], ['Edit your spelling', 'Editing is good, but E is about explaining your evidence.']],
      explanation: 'E means explain: tell the reader <em>how</em> or <em>why</em> your evidence proves your answer.' },
    { skill: 'races', prompt: 'In R.A.C.E.S., what does the <strong>R</strong> stand for?',
      options: [['Restate the question'], ['Read the chapter again', 'Rereading helps, but R is the first part of your written answer.'], ['Retell the whole story', 'Retelling the whole story isn\'t needed. R turns the question into a statement.'], ['Rate the book', 'Your opinion of the book isn\'t part of R.A.C.E.S.']],
      explanation: 'R means restate: turn the question into the start of your answer sentence.' },
    { skill: 'races', prompt: `${RACES.question}<br>Which sentence is the <strong>Cite</strong> part of a strong answer?`,
      options: [[RACES.parts[2][2]], [RACES.parts[1][2], 'That sentence answers the question. Cite gives a detail from the book.'], [RACES.parts[3][2], 'That sentence explains the evidence. Cite <em>gives</em> the evidence.'], [RACES.parts[4][2], 'That sentence sums up the answer.']],
      explanation: 'The Cite sentence points to specific details from Chapter 8 that support the answer.' },
    { skill: 'races', prompt: `${RACES.question}<br>Which sentence is the <strong>Explain</strong> part of a strong answer?`,
      options: [[RACES.parts[3][2]], [RACES.parts[2][2], 'That sentence gives the evidence (Cite). Explain tells <em>why</em> it proves the answer.'], [RACES.parts[0][2], 'That sentence restates the question.'], [RACES.parts[4][2], 'That sentence sums up the answer.']],
      explanation: 'The Explain sentence connects the evidence to the answer, using the word "because."' },
    { skill: 'races', prompt: 'Question: "How does Percy show bravery in Chapter 4?" Which sentence best <strong>restates</strong> it?',
      options: [['Percy shows bravery in Chapter 4.'], ['How does Percy show bravery?', 'Restating means turning the question into a statement, not repeating the question.'], ['In conclusion, Percy is brave.', 'That is a summary sentence, used at the end.'], ['I really like Percy.', 'That is your opinion and doesn\'t restate the question.']],
      explanation: 'Restate by turning the question into a statement that begins your answer.' },
    { skill: 'races', prompt: 'A student answers: "Percy is brave because he fights the Minotaur." What is still missing?',
      options: [['Explaining how the evidence proves the answer and summarizing'], ['Nothing, the answer is complete', 'A full R.A.C.E.S. answer also explains the evidence and sums it up.'], ['Restating the question', 'The student did restate and answer. Look at what comes after the evidence.'], ['A quote from a different book', 'Evidence should come from The Lightning Thief.']],
      explanation: 'The student restated, answered, and gave evidence, but still needs to explain <em>why</em> the evidence shows bravery and add a summary.' },
    { skill: 'races', prompt: 'Which is the best way to start a <strong>Cite</strong> sentence?',
      options: [['"In Chapter 4, the text says…"'], ['"I think that…"', 'That introduces your opinion. Cite introduces evidence from the text.'], ['"In conclusion…"', 'That starts a summary, the last part.'], ['"The question asks…"', 'That restates the question, the first part.']],
      explanation: 'Point to where your evidence comes from, like "In Chapter 4, the text says…" or "On page __, it states…"' },
  ];

  const toQuestion = (skill, prompt, options, explanation, hint) => {
    const opts = shuffle(options.map(([html, h], i) => ({ html, correct: i === 0, hint: h })))
      .map((o, i) => ({ ...o, id: 'ABCD'[i] }));
    return {
      type: skill, skill: SKILLS[skill],
      prompt, summary: prompt.replace(/<br>/g, ' ').replace(/<[^>]+>/g, ''),
      format: 'mc', options: opts, textOptions: true,
      check: (id) => {
        const opt = opts.find((o) => o.id === id);
        if (!opt) return { status: 'invalid', message: 'Choose one of the answers.' };
        return opt.correct ? { status: 'correct' } : { status: 'incorrect', message: opt.hint };
      },
      hint: hint || 'Look back at the lesson, and use your book to check the details.',
      explanation, solution: options[0][0],
    };
  };

  // ---------- Generated questions ----------

  const VAGUE = ['Percy has a strange day.', 'Some things happen to Percy.', 'Percy learns a lot.', 'Percy goes on an adventure.'];

  // "Which is the best gist of Chapter N?" One factory per chapter.
  const gistFactories = CHAPTERS.map(([n, , , gist, detail]) => () => {
    const [other] = shuffle(CHAPTERS.filter((c) => c[0] !== n));
    return toQuestion('gist', `Which sentence is the best <strong>gist</strong> of Chapter ${n}?`, [
      [gist],
      [detail, 'That is a true detail, but it is too small. A gist covers the main idea of the whole chapter.'],
      [pick(VAGUE), 'That is too general. A gist says who, what happens, and why it matters.'],
      [other[3], `That is the gist of Chapter ${other[0]}.`],
    ], `The gist of Chapter ${n}: ${gist}`, 'A gist is a short summary of the most important idea: who, what happens, and why it matters.');
  });

  // Four events from four different chapters, so their order is clear.
  function pickEvents(k) {
    const chosen = [];
    for (const e of shuffle(EVENTS)) {
      if (!chosen.some((c) => c[0] === e[0])) chosen.push(e);
      if (chosen.length === k) break;
    }
    return chosen.sort((a, b) => a[0] - b[0]);
  }

  const sequenceFactories = [
    () => {
      const ev = pickEvents(4);
      return toQuestion('sequence', 'Which event happens <strong>first</strong>?', [
        [ev[0][1]], ...ev.slice(1).map((e) => [e[1], `That happens in Chapter ${e[0]}. Look for an event from an earlier chapter.`]),
      ], `${ev[0][1]} happens in Chapter ${ev[0][0]}, before the others.`, 'Think about where each event happens: Yancy, home, the road to camp, or at camp.');
    },
    () => {
      const ev = pickEvents(4);
      return toQuestion('sequence', 'Which event happens <strong>last</strong>?', [
        [ev[3][1]], ...ev.slice(0, 3).map((e) => [e[1], `That happens in Chapter ${e[0]}. Look for an event from a later chapter.`]),
      ], `${ev[3][1]} happens in Chapter ${ev[3][0]}, after the others.`, 'Think about where each event happens: Yancy, home, the road to camp, or at camp.');
    },
    () => {
      // A, then the answer, then B; distractors happen outside that window.
      const [before, a, mid, b, after] = pickEvents(5);
      return toQuestion('sequence', `Which event happens <strong>between</strong> these two?<br>1. ${a[1]}<br>2. ${b[1]}`, [
        [mid[1]],
        [before[1], `That happens in Chapter ${before[0]}, before "${a[1]}"`],
        [after[1], `That happens in Chapter ${after[0]}, after "${b[1]}"`],
        [a[1], 'That is the first event listed. Find one that happens after it.'],
      ], `The order is: ${a[1]} (Ch. ${a[0]}) → ${mid[1]} (Ch. ${mid[0]}) → ${b[1]} (Ch. ${b[0]})`, 'Put the two listed events in order, then find what happens in the middle.');
    },
  ];

  const FACTORIES = {
    gist: gistFactories,
    sequence: sequenceFactories,
  };
  // Worksheet-style: place the class's 10 stages on the plot diagram (js/plot-align.js).
  FACTORIES.align = PlotAlign.factories('align', SKILLS.align);
  BANK.forEach((item) => (FACTORIES[item.skill] ||= []).push(() => toQuestion(item.skill, item.prompt, item.options, item.explanation)));

  // Picks `count` different questions from the given skills, rotating through skills so each one shows up.
  function buildSession(skills, count) {
    const seen = new Set();
    const pools = shuffle(skills).map((skill) => FACTORIES[skill]);
    const picked = [];
    for (let tries = 0; picked.length < count && tries < 50; tries++) {
      for (const pool of pools) {
        if (picked.length >= count) break;
        const q = pick(pool)();
        if (seen.has(q.summary)) continue;
        seen.add(q.summary);
        picked.push(q);
      }
    }
    return shuffle(picked);
  }

  return { SKILLS, CHAPTERS, EVENTS, STAGES, PLOT, TRAITS, RACES, SCOPE, CHAPTER_QA, JOURNEY_QA, MODEL_RESPONSES, CH8_KEY, BANK, FACTORIES, buildSession };
})();
