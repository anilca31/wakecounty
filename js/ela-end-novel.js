// End-of-novel review: original explanations and cold reads, aligned to the shared guide.
const ElaEndNovel = (() => {
  const SKILLS = {
    vocabulary: 'Literary vocabulary',
    character: 'Characters & characterization',
    structure: 'Plot elements',
    hero: 'Later Hero’s Journey stages',
    myth: 'Elements of mythology',
    reading: 'Cold read: main idea, theme & context clues',
    chapters: 'Chapter gist: 9, 15, 19 & 21',
  };
  const VOCABULARY = [
    ['Gist / main idea', 'A brief statement of the most important information or events in a text.', 'Keep the main event; leave out small details.'],
    ['Plot', 'The connected events that make up a story.', 'Plot = what happens, not the lesson it teaches.'],
    ['Hero’s Journey', 'A pattern in which a hero leaves familiar life, faces trials, and returns changed.', 'A stage needs both a definition and an event that fits it.'],
    ['Elements of mythology', 'Common features of myths, such as supernatural beings, quests, and explanations of the world.', 'A myth can contain several elements at once.'],
    ['Connotation', 'The feelings and associations a word suggests beyond its literal meaning.', 'Compare “confident” and “arrogant”: similar territory, different feelings.'],
    ['Theme', 'A message about life or human behavior developed through a text.', 'Write a complete message, not just “friendship” or “courage.”'],
    ['Characterization', 'The ways a writer reveals a character’s personality.', 'Look at what the narrator states and what characters do.'],
    ['Conflict', 'A struggle between opposing forces that creates a problem in a story.', 'Ask who or what is opposing the character.'],
    ['Denotation', 'The literal dictionary meaning of a word.', 'Denotation defines; connotation adds a feeling.'],
  ];
  const CHARACTERS = [
    ['Annabeth', 'A daughter of Athena who becomes Percy’s friend and quest companion.'],
    ['Grover', 'A satyr assigned to protect Percy who accompanies him on the quest.'],
    ['Mr. D', 'Dionysus, the god who serves as Camp Half-Blood’s director.'],
    ['Chiron', 'Percy’s mentor, a centaur first known to him as Mr. Brunner.'],
    ['Sally', 'Percy’s mother, whose safety is an important personal motivation for him.'],
  ];
  const PLOT = [
    ['Exposition', 'Introduces the setting, characters, and starting situation.'],
    ['Rising action', 'Develops complications and increases tension around the conflict.'],
    ['Climax', 'The major turning point or moment of highest tension.'],
    ['Falling action', 'Shows consequences after the climax as events move toward the ending.'],
    ['Resolution', 'Shows how the central conflict is settled and what has changed.'],
  ];
  const JOURNEY = [
    ['The Road of Trials', 'Repeated challenges test the hero and develop skills and relationships.',
      'Camp training and later dangers, including Medusa and the water park, test Percy and his companions.'],
    ['The Supreme Ordeal', 'The hero faces an especially dangerous test involving high stakes or a difficult choice.',
      'In the Underworld, Percy must face Hades, discover the bolt, and choose how to escape when he cannot take everyone. The battle with Ares is also a major climactic test.'],
    ['The Magic Flight', 'The hero escapes danger or begins a difficult return, often with supernatural help.',
      'The pearls let Percy and his companions escape the Underworld to the sea.'],
    ['Confronting the Father', 'The hero faces a parent or powerful authority and seeks understanding.',
      'On Olympus, Percy meets Poseidon and asks questions about his identity and his father’s choices.'],
    ['Master of Two Worlds / Restoring the World', 'The changed hero brings greater understanding back to both worlds and helps restore balance.',
      'Returning Zeus’s bolt helps prevent war; Percy ends the story with a clearer sense of his mortal and demigod identities.'],
  ];
  const MYTHS = [
    ['Struggle for power', 'Opposing forces compete for control, authority, or influence.',
      'The conflict over Zeus’s stolen bolt threatens a war among the gods.'],
    ['Origins of life and the natural world', 'A myth explains how something began or why the world works as it does.',
      'Percy’s parentage connects his abilities to Poseidon’s role as god of the sea. The gods’ domains connect nature to divine forces.'],
    ['Fate and prophecy', 'A prediction or destined outcome influences characters’ choices.',
      'The Oracle’s prophecy shapes expectations for the quest, including the warning about betrayal.'],
    ['Supernatural beings and powers', 'Characters or events go beyond ordinary human abilities.',
      'Gods, the Minotaur, and Percy’s water-related abilities bring supernatural elements into the story.'],
    ['Quest / completion of a task', 'A character undertakes a difficult mission with a goal.',
      'Percy travels to recover and return Zeus’s stolen master bolt.'],
  ];
  const CHAPTERS = [
    [9, 'The Oracle and the quest',
      'Percy receives a prophecy and accepts a quest to recover Zeus’s master bolt before the summer solstice, traveling with Annabeth and Grover.',
      'Focus on the mission, deadline, and companions, not a prediction treated as already fulfilled.'],
    [15, 'Ares and the favor',
      'Ares meets the travelers at a diner and sends them to retrieve his shield from a water park, where they must work together to escape a trap.',
      'Ares gives a task; this is not the final battle with Ares.'],
    [19, 'The Underworld discovery',
      'In the Underworld, Percy learns Hades’s helm is also missing and finds Zeus’s bolt in his backpack. With only three pearls, he escapes with his friends while leaving Sally behind.',
      'Hades is missing his own symbol of power; finding the bolt does not mean Hades stole it.'],
    [21, 'Returning the bolt',
      'Percy reaches Olympus, returns the master bolt to Zeus, and meets Poseidon, helping avert war while learning more about his father.',
      'The helm is recovered after the Ares battle in Chapter 20 and sent back with a Fury. It is not returned to Zeus in Chapter 21.'],
  ];
  const PASSAGES = [
    {
      id: 'bridge', title: 'The bridge challenge',
      text: 'At the first science-club test, Imani’s paper bridge collapsed under two small weights. She felt that her design was inadequate: it could not hold even the minimum load. Building a stronger bridge seemed formidable, especially with only a week left. Instead of abandoning it, she recorded each failure, folded new supports, and tested again. On Friday, her bridge held twelve weights. Imani kept her first broken model beside the new one as a reminder of what careful revision could accomplish.',
      main: 'Imani improves a weak bridge through repeated tests and revisions.',
      theme: 'Learning from setbacks and revising your work can lead to improvement.',
      detail: 'Imani keeps a broken model beside her new bridge.',
    },
    {
      id: 'mural', title: 'Room on the mural',
      text: 'Owen was ecstatic when the art club chose his sketch for its wall mural; he grinned all the way home. He had yearned for this chance for months, imagining his own design on the wall every evening. At the planning meeting, the charismatic club captain charmed everyone with an easy smile and a lively speech, then suggested replacing most of Owen’s sketch. Owen nearly agreed just to win the captain’s approval. Instead, he explained which parts mattered to him and invited the club to add ideas around them. The finished mural included his central design and contributions from the whole group.',
      main: 'Owen speaks up for his design while making room for the group’s ideas.',
      theme: 'You can cooperate with others without giving up what matters to you.',
      detail: 'The captain speaks with a smile at the planning meeting.',
    },
  ];

  const BANK = [];
  function add(skill, prompt, options, explanation, hint, passageId) {
    BANK.push({ skill, prompt, options, explanation, hint, passageId });
  }
  function definitionQuestions(skill, rows, question) {
    rows.forEach(([term, definition, tip]) => {
      const others = rows.filter((row) => row[0] !== term).slice(0, 3);
      add(skill, question(term), [[definition], ...others.map(([otherTerm, otherDefinition]) =>
        [otherDefinition, `That describes ${otherTerm}.`])],
      `${term}: ${definition}${tip ? ` ${tip}` : ''}`, 'Match the term to its meaning, not just a related example.');
    });
  }
  definitionQuestions('vocabulary', VOCABULARY, (term) => `Which definition matches <strong>${term}</strong>?`);
  definitionQuestions('character', CHARACTERS, (name) => `How is <strong>${name}</strong> connected to Percy?`);
  definitionQuestions('structure', PLOT, (part) => `What happens during the <strong>${part.toLowerCase()}</strong> of a story?`);
  JOURNEY.forEach(([stage, definition, example]) => {
    const others = JOURNEY.filter((row) => row[0] !== stage).slice(0, 3);
    add('hero', `Which event best illustrates <strong>${stage}</strong> in this study guide?`,
      [[example], ...others.map(([otherStage, , otherExample]) => [otherExample, `That example fits ${otherStage}.`])],
      `${definition} ${example}`, 'Use the purpose of the stage, not only where an event occurs.');
  });
  MYTHS.forEach(([element, definition, example]) => {
    const others = MYTHS.filter((row) => row[0] !== element).slice(0, 3);
    add('myth', `Which example most clearly shows <strong>${element.toLowerCase()}</strong>?`,
      [[example], ...others.map(([otherElement, , otherExample]) => [otherExample, `That example most directly illustrates ${otherElement.toLowerCase()}.`])],
      `${definition} ${example}`, 'Several elements can coexist. Choose the example most directly tied to this definition.');
  });
  add('character', 'An original example: “Mara is patient and thoughtful.” What kind of characterization is this?',
    [['Direct: the narrator explicitly names the traits'], ['Indirect: readers infer traits from actions', 'Here the narrator states the traits instead of showing an action.'],
      ['Conflict: two forces oppose each other', 'No opposing forces are described.'], ['Setting: the place and time', 'The sentence describes a personality, not a place or time.']],
    'Direct characterization tells the reader a trait outright. The narrator explicitly describes Mara as patient and thoughtful.');
  add('character', 'An original example: “Mara sighed, folded her arms, and tapped her foot while the group debated.” How does this reveal character?',
    [['Indirectly: actions let readers infer impatience'], ['Directly: the narrator names Mara’s personality', 'The narrator shows behavior but does not state “Mara is impatient.”'],
      ['Through a dictionary definition', 'A definition would explain a word, not show behavior.'], ['Through exposition alone', 'The question asks how a trait is revealed, not where the scene occurs in the plot.']],
    'Indirect characterization reveals personality through behavior, words, thoughts, appearance, or other characters’ reactions. The sighing and tapping suggest impatience.');
  add('character', 'Which answer best explains Percy’s development across the whole novel?',
    [['He grows from feeling out of place to understanding his identity and making difficult, loyal choices'],
      ['He becomes physically stronger, so his thinking never matters', 'Character growth includes choices and understanding, not just strength.'],
      ['He stops caring about his friends once he meets the gods', 'His choices continue to show concern for his companions.'],
      ['He never learns anything about his family or himself', 'His quest and meeting with Poseidon deepen his understanding of his identity.']],
    'Percy gains confidence and a stronger sense of belonging. His Underworld choice and his return of the bolt show responsibility and loyalty. Explain a change with a beginning example and an ending example.');
  add('vocabulary', 'Which sentence describes connotation rather than denotation?',
    [['“Stubborn” can sound disapproving, even when it describes persistence'],
      ['A peninsula is land surrounded by water on three sides', 'That is a literal definition.'],
      ['A satyr is a mythological being with human and goat features', 'That gives a literal meaning.'],
      ['A quest is a journey undertaken to accomplish a goal', 'That is a dictionary-style definition.']],
    'Connotation is the emotional or cultural meaning suggested by a word. Denotation is its literal definition.');
  add('structure', 'Which sequence correctly follows the five-part plot diagram?',
    [['Exposition → Rising action → Climax → Falling action → Resolution'],
      ['Climax → Exposition → Resolution → Rising action → Falling action', 'A plot diagram begins by introducing the situation, not at its peak.'],
      ['Exposition → Climax → Resolution → Rising action → Falling action', 'Tension usually builds before the climax and settles afterward.'],
      ['Resolution → Falling action → Climax → Rising action → Exposition', 'That sequence runs backward through the plot diagram.']],
    'The exposition sets up the story, rising action builds tension, the climax turns the conflict, falling action follows its consequences, and resolution settles the central problem.');
  add('structure', 'On a plot mountain, which element belongs at the peak?',
    [['Climax'], ['Exposition', 'Exposition begins at the base, introducing the situation.'],
      ['Falling action', 'Falling action comes after the peak.'], ['Resolution', 'Resolution belongs at the ending.']],
    'The climax is shown at the peak because it is the major turning point or moment of highest tension.');
  CHAPTERS.forEach(([chapter, , gist, tip]) => {
    const others = CHAPTERS.filter((row) => row[0] !== chapter);
    add('chapters', `Which is the best gist of <strong>Chapter ${chapter}</strong>?`,
      [[gist], ...others.map(([otherChapter, , otherGist]) => [otherGist, `That summarizes Chapter ${otherChapter}, not Chapter ${chapter}.`])],
      `${gist} ${tip}`, 'Identify the central event, then check that it belongs to the requested chapter.');
  });
  add('chapters', 'Which revision would improve the vague gist “Percy does some important things on Olympus”?',
    [['Percy returns Zeus’s bolt on Olympus and meets Poseidon, helping avert war'],
      ['Percy has a day that is really interesting', 'This remains vague; specify the event and why it matters.'],
      ['Percy notices a small detail in a building', 'A minor detail is not the chapter’s central event.'],
      ['Percy is brave and friendship is important', 'That mixes a trait and a possible theme instead of summarizing an event.']],
    'An effective gist is brief but specific: who, the key event, and its importance. It is not a vague reaction or a list of small details.');
  add('chapters', 'Which statement avoids mixing up the bolt and the helm near the end of the quest?',
    [['The helm is recovered after the Chapter 20 Ares battle; Percy returns the bolt to Zeus in Chapter 21'],
      ['Percy returns Hades’s helm to Zeus as Zeus’s weapon', 'The helm belongs to Hades; the master bolt belongs to Zeus.'],
      ['Hades gives Percy the bolt because he had stolen it', 'Percy discovers the bolt in his backpack; Hades is missing his own helm.'],
      ['Annabeth returns the bolt to Ares in Chapter 15', 'Chapter 15 concerns Ares’s favor, not the return of the bolt.']],
    'Keep the objects and owners straight: Zeus’s master bolt and Hades’s helm of darkness. A Fury takes the recovered helm back to Hades after the Ares battle.');
  PASSAGES.forEach((passage) => {
    add('reading', `What is the <strong>main idea</strong> of “${passage.title}”?`,
      [[passage.main], [passage.detail, 'That is one detail, not the main idea of the whole passage.'],
        ['Something happens to someone', 'That is too vague to summarize the passage.'],
        [passage.theme, 'That is a general life message, not a summary of what happens.']],
      `The main idea is: ${passage.main} It covers the central situation, not just one detail.`,
      'Ask who the passage is about and what mainly happens.', passage.id);
    add('reading', `Which <strong>theme</strong> is best supported by “${passage.title}”?`,
      [[passage.theme], [passage.main, 'That summarizes events instead of stating a general lesson.'],
        ['Success means never listening to anyone else', 'The passage does not support ignoring every other person.'],
        ['A mistake or disagreement means you should stop trying', 'The character keeps working toward a solution.']],
      `A supported theme is: ${passage.theme} A theme states a message that can apply beyond this one character.`,
      'Look for a complete message supported by the character’s choices and the outcome.', passage.id);
  });
  const WORDS = [
    ['inadequate', 'bridge', 'Not sufficient for the task', 'The bridge cannot hold even the minimum load.'],
    ['formidable', 'bridge', 'Difficult or intimidating', 'The stronger design seems challenging with little time left.'],
    ['ecstatic', 'mural', 'Extremely joyful or excited', 'Owen grins all the way home after his sketch is chosen.'],
    ['yearned', 'mural', 'Strongly wanted or longed for', 'Owen has imagined this opportunity for months.'],
    ['charismatic', 'mural', 'Able to attract or influence people through personality', 'The captain charms the group with a smile and a lively speech.'],
  ];
  WORDS.forEach(([word, passageId, definition, clue]) => {
    const distractors = WORDS.filter((entry) => entry[0] !== word).slice(0, 3);
    add('reading', `In the passage, what does <strong>${word}</strong> mean?`,
      [[definition], ...distractors.map(([otherWord, , otherDefinition]) =>
        [otherDefinition, `That meaning fits ${otherWord}. Reread the words around ${word}.`])],
      `${word}: ${definition}. Context clue: ${clue}`, 'Read the surrounding sentences, then substitute each meaning to see which fits.', passageId);
  });

  const table = (headings, rows) => `<div class="table-scroll"><table class="map-table"><thead><tr>${headings.map((heading) => `<th scope="col">${heading}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell, index) => index ? `<td>${cell}</td>` : `<th scope="row">${cell}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const passageHtml = (passage) => `<section class="callout" aria-label="Reading passage"><h3>${passage.title}</h3><p>${passage.text}</p><p class="muted small">Original practice passage</p></section>`;
  const recall = (rows) => `<p>Answer in your own words before opening a model response.</p><div class="qa-list">${rows.map(([question, answer]) => `<details class="qa"><summary>${question}</summary><div class="qa-answer">${answer}</div></details>`).join('')}</div>`;
  const plotVisual = `<svg class="diagram plot" viewBox="0 0 600 220" role="img" aria-label="Plot mountain: exposition, rising action, climax at the peak, falling action, resolution">
    <path d="M25 175H135L300 40 465 175H575" fill="none" stroke="currentColor" stroke-width="4"/>
    <g fill="currentColor" font-size="15" text-anchor="middle">
      <text x="80" y="205">Exposition</text><text x="180" y="95">Rising action</text>
      <text x="300" y="25">Climax</text><text x="435" y="95">Falling action</text>
      <text x="520" y="205">Resolution</text>
    </g></svg>`;
  const definitions = [
    {
      id: 60, short: 'End-of-novel: words & people', title: 'End-of-Novel Guide: Vocabulary & Characters',
      blurb: 'Parts 1–2: literary terms, Percy’s relationships, direct and indirect characterization, and character growth.',
      art: '📖🔍', skills: ['vocabulary', 'character'], sessionLength: 10,
      targets: ['Define the nine literary terms and distinguish connotation from denotation.', 'Match five characters to their relationship with Percy.', 'Explain characterization and support Percy’s growth with evidence.'],
      notes: `${table(['Term', 'Definition', 'Study tip'], VOCABULARY)}
        ${table(['Character', 'Connection to Percy'], CHARACTERS)}
        <h3>Direct versus indirect</h3><p><strong>Direct</strong> characterization names a trait; <strong>indirect</strong> characterization shows actions, words, thoughts, appearance, or others’ reactions so you infer it. The guide’s description of Sally explicitly names caring traits, so it is direct. Annabeth’s gestures and dialogue let readers infer a feeling, so that example is indirect.</p>
        <div class="callout"><strong>Tip:</strong> “Tells the trait” = direct. “Shows clues” = indirect. A quotation can be either kind; using dialogue does not automatically make characterization direct.</div>`,
      recall: [['How does Percy change across the novel?', 'He begins unsure of himself and his place in the world. The quest helps him understand his identity, trust companions, and take responsibility. Pair an early example of not fitting in with a later choice, such as returning the bolt to avert war. Explain what the evidence reveals, not just that he becomes stronger.'],
        ['How can two words share a denotation but have different connotations?', 'Words can point to a similar idea while suggesting different feelings. “Confident” generally sounds approving, while “arrogant” suggests too much self-importance.']],
    },
    {
      id: 61, short: 'End-of-novel: plot & journey', title: 'End-of-Novel Guide: Plot & Hero’s Journey',
      blurb: 'Parts 3–4: the five-part plot mountain and the final five classroom journey stages.',
      art: '⛰️🧭', skills: ['structure', 'hero'], sessionLength: 8,
      targets: ['Put the five plot elements in order and define each.', 'Match later journey stages to events and explain the connection.', 'Separate a plot element from a Hero’s Journey stage.'],
      notes: `${plotVisual}${table(['Plot element', 'What it does'], PLOT)}
        ${table(['Journey stage', 'Meaning', 'Novel connection'], JOURNEY)}
        <div class="callout"><strong>Alignment tip:</strong> Journey labels vary across class models. This guide uses the five labels above. The Underworld confrontation and the Ares battle are both high-stakes tests; explain why an event fits instead of assuming every class uses the same single climax. The Underworld escape can illustrate Magic Flight even though the Ares fight follows it.</div>`,
      recall: [['How do rising action and falling action differ?', 'Rising action builds complications before the central turning point. Falling action follows that turning point and develops its consequences. Neither term is a synonym for “something good” or “something bad.”'],
        ['Why is meeting Poseidon more than simply finishing a trip?', 'It lets Percy confront a powerful father figure and ask about his identity. That purpose connects the event to Confronting the Father.']],
    },
    {
      id: 62, short: 'End-of-novel: mythology', title: 'End-of-Novel Guide: Elements of Mythology',
      blurb: 'Part 5: define five myth elements and connect each to a specific novel example.',
      art: '⚡🏛️', skills: ['myth'], sessionLength: 5,
      targets: ['Define the five myth elements in the guide.', 'Connect each element to a novel example and explain the match.'],
      notes: `${table(['Myth element', 'Definition', 'Novel example'], MYTHS)}
        <div class="callout"><strong>Evidence tip:</strong> A monster is evidence of the supernatural. A fight alone does not necessarily show a struggle for power; identify what control or authority the opposing sides seek.</div>`,
      recall: [['How are a quest and a prophecy different?', 'A quest is a mission the character undertakes; a prophecy predicts or warns about outcomes. Percy’s mission concerns the stolen bolt, while the Oracle’s words shape expectations about his journey.'],
        ['Can one event show more than one myth element?', 'Yes. A mission involving gods may include a quest, supernatural powers, and a struggle for power. Explain which aspect proves the element asked about.']],
    },
    {
      id: 63, short: 'End-of-novel: cold reads', title: 'End-of-Novel Guide: Cold-Read Practice',
      blurb: 'Part 6: original passages for main idea, theme, and all five context-clue vocabulary words.',
      art: '📝💡', skills: ['reading'], sessionLength: 9,
      targets: ['Distinguish a passage’s main idea from its theme.', 'Use surrounding sentences to infer unfamiliar words.', 'Support a reading answer with a relevant detail.'],
      notes: `<p>These new passages practice the same skills as the worksheet; you do not need outside facts or the novel to answer.</p>
        <div class="callout"><strong>Main idea:</strong> What is this mostly about? <strong>Theme:</strong> What message about life is supported? A one-word topic such as “perseverance” is not yet a theme statement.</div>
        ${PASSAGES.map(passageHtml).join('')}
        ${table(['Word', 'Meaning', 'Clue in the original passage'], WORDS.map(([word, , definition, clue]) => [word, definition, clue]))}
        <div class="callout"><strong>Context-clue tip:</strong> Read before and after the word. Replace it with your proposed meaning. Check that the meaning fits the whole scene, not only one familiar-looking syllable.</div>`,
      recall: PASSAGES.map((passage) => [`What are the main idea and a supported theme of “${passage.title}”?`, `<strong>Main idea:</strong> ${passage.main}<br><strong>Theme:</strong> ${passage.theme}`]),
    },
    {
      id: 64, short: 'End-of-novel: chapter gist', title: 'End-of-Novel Guide: Chapters 9, 15, 19 & 21',
      blurb: 'Part 7: concise chapter summaries, quest events, and common bolt-versus-helm mix-ups.',
      art: '📚⚡', skills: ['chapters'], sessionLength: 6,
      targets: ['Write a one- or two-sentence gist for each of the four chapters.', 'Keep the Oracle, Ares’s favor, Underworld discovery, and Olympus return in order.', 'Distinguish Zeus’s bolt from Hades’s helm.'],
      notes: `${table(['Chapter', 'Central event', 'Gist', 'Accuracy check'], CHAPTERS)}
        <div class="callout"><strong>Gist formula:</strong> Character + central action + why it matters. Leave out small details. Chapter numbers are more reliable than page numbers, which vary by edition.</div>
        <p><strong>Whole-novel connection:</strong> Chapter 22 reveals Luke’s betrayal. Do not confuse that final revelation with the earlier discovery of the bolt or the return to Olympus.</p>`,
      recall: CHAPTERS.map(([chapter, , gist, tip]) => [`What is the gist of Chapter ${chapter}?`, `${gist}<br><strong>Check:</strong> ${tip}`]),
    },
    {
      id: 65, short: 'End-of-novel: mixed review', title: 'End-of-Novel Guide: Mixed Practice Test',
      blurb: 'Review all seven worksheet parts, then take a 14-question mixed round with hints and explanations.',
      art: '🎯✅', skills: Object.keys(SKILLS), sessionLength: 14,
      targets: ['Recall the vocabulary and character relationships.', 'Explain plot, journey stages, and myth elements using evidence.', 'Summarize key chapters and analyze a fresh passage.'],
      notes: `<p><strong>Spoiler scope:</strong> This study guide covers the completed novel, including the ending. Earlier Chapters 1–8 lessons remain available separately.</p>
        <ul class="checklist"><li>Part 1: nine vocabulary terms, including connotation and denotation.</li>
        <li>Part 2: five character relationships, characterization, and Percy’s growth.</li>
        <li>Part 3: plot mountain labels and definitions.</li><li>Part 4: final five classroom Hero’s Journey stages.</li>
        <li>Part 5: five myth elements with examples.</li><li>Part 6: main idea, theme, and context clues.</li>
        <li>Part 7: gist statements for Chapters 9, 15, 19, and 21.</li></ul>
        <div class="callout"><strong>Before choosing:</strong> Identify whether the question wants an event, a trait, a general life message, or a definition. These are not interchangeable.</div>`,
      recall: [['How should I support a written answer?', 'Make a clear claim, give an accurate chapter or passage detail, and explain how it proves your claim. Use your own edition to locate a quotation if your teacher requires one; do not invent quotations or page numbers.'],
        ['How do I study a missed answer?', 'Name the skill, explain why the correct answer fits, and explain why your original choice does not. Revisit that lesson and try another practice round.']],
    },
  ];

  function buildSession(skills, count) {
    const pools = Util.shuffle(skills).map((skill) => Util.shuffle(BANK.filter((item) => item.skill === skill)));
    if (!Number.isInteger(count) || count < 1 || pools.some((pool) => !pool.length) ||
        pools.reduce((total, pool) => total + pool.length, 0) < count) {
      throw new Error('End-of-novel practice requires known skills and a count within the available question bank.');
    }
    const selected = [];
    while (selected.length < count) {
      for (const pool of pools) {
        if (selected.length === count) break;
        if (pool.length) selected.push(pool.pop());
      }
    }
    return Util.shuffle(selected).map((item) => {
      const question = ElaQuestions.toQuestion(item.skill, item.prompt, item.options,
        item.explanation, item.hint, SKILLS[item.skill]);
      if (item.passageId) question.visualHtml = passageHtml(PASSAGES.find((passage) => passage.id === item.passageId));
      return question;
    });
  }
  const lessons = definitions.map((lesson) => ({
    ...lesson,
    art: `<span class="lesson-emoji">${lesson.art}</span>`,
    steps: [
      { title: 'Learning targets', html: `<p class="callout"><strong>End-of-novel review:</strong> Includes spoilers through Chapter 22. These are original study notes, not a transcription of the worksheet.</p><ul class="checklist targets">${lesson.targets.map((target) => `<li>${target}</li>`).join('')}</ul>` },
      { title: 'Study guide & tips', html: lesson.notes },
      { title: 'Check your understanding', html: recall(lesson.recall) },
    ],
    buildSession: (count) => buildSession(lesson.skills, count),
  }));
  return { SKILLS, VOCABULARY, CHARACTERS, PLOT, JOURNEY, MYTHS, CHAPTERS, PASSAGES, WORDS, BANK, lessons, buildSession };
})();
