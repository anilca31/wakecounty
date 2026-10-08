// App shell: home → lesson → practice → results.
(() => {
  const app = document.getElementById('app');
  const SESSION_LENGTH = 5;
  const MAX_ATTEMPTS = 2;
  const POINTS = { first: 10, second: 5, missed: 0 };

  function numberUnit(u, i) {
    return { ...u, short: `Unit ${i + 1}`, fullTitle: `Unit ${i + 1}: ${u.title}` };
  }

  // Maths is split into units; each unit holds its own lessons. Units with no lessons show as "Coming soon".
  const MATH_UNITS = [
    { title: 'Area & Surface Area', icon: '📐', color: '#e8590c', blurb: 'Reasoning about area of polygons, surface area, and solid nets.', lessons: [] },
    { title: 'Introducing Ratios', icon: '⚖️', color: '#d6336c', blurb: 'Understanding ratio concepts and using ratio reasoning.', lessons: RatioUnit.sections },
    { title: 'Unit Rates & Percentages', icon: '💯', color: '#e67700', blurb: 'Solving real-world rate and percentage problems.', lessons: [] },
    { title: 'Scale Drawings', icon: '🗺️', color: '#0c8599', blurb: 'Reproducing scale drawings and understanding scale factor.', lessons: [] },
    { title: 'Dividing Fractions', icon: '🍕', color: '#c92a2a', blurb: 'Extending multiplication and division to fractional values.', lessons: [] },
    { title: 'Arithmetic in Base 10', icon: '🔟', color: '#5f3dc4', blurb: 'Computing fluently with multi-digit decimals and numbers.', lessons: [] },
    { title: 'Expressions and Equations', icon: '🧮', color: '#2b8a3e', blurb: 'Introduction to variables, equivalent expressions, and simple equations.', lessons: [] },
    { title: 'Introducing Proportional Relationships', icon: '📈', color: '#1971c2', blurb: 'Identifying proportional relationships in tables, graphs, and equations.', lessons: [] },
    { title: 'Proportional Relationships and Percentages', icon: '🏷️', color: '#a61e4d', blurb: 'Advanced multi-step percentage and proportion applications.', lessons: [] },
    { title: 'Rational Numbers', icon: '🌡️', color: '#087f5b', blurb: 'Working with signed numbers, absolute value, and the coordinate plane.', lessons: [] },
  ].map(numberUnit);

  const SOCIAL_UNITS = [
    { title: 'River Valley Civilizations', icon: '🏺', color: '#b45309', blurb: 'How geography and water shaped early human organization in Mesopotamia, Egypt, the Indus Valley, and China.', lessons: SocialStudies.lessons, decks: SocialStudies.DECKS },
  ].map(numberUnit);

  // `color` tints the cover art and the page header gradient. Subjects with no lessons show as "Coming soon".
  // A subject with `units` lists those first; its `lessons` are all of its units' lessons.
  const SUBJECTS = [
    { id: 'maths', title: 'Maths', icon: '🔢', color: '#e8590c', tagline: 'Ratios, fractions, equations & more', blurb: 'Maths 6+ in 10 units, from area and ratios to equations and rational numbers. Pick a unit to see its lessons.', units: MATH_UNITS, lessons: MATH_UNITS.flatMap((u) => u.lessons) },
    { id: 'ela', title: 'ELA', icon: '📚', color: '#8d67ab', tagline: 'The Lightning Thief test prep', blurb: 'Get ready for the open-book test on Chapters 1–8 of <em>The Lightning Thief</em> and the Hero\'s Journey. It tests skills, not memory, so start with the tips.', lessons: Ela.lessons },
    { id: 'science', title: 'Science', icon: '🔬', color: '#148a5b', tagline: 'Cells, energy & Earth', blurb: 'Cells, energy, Earth\'s systems and the scientific method.', lessons: [] },
    { id: 'social', title: 'Social Studies', icon: '🌎', color: '#2d5bd7', tagline: 'Ancient river valley civilizations', blurb: 'Ancient civilizations and how geography shaped them. Topics follow the North Carolina 6th-grade standards. Pick a unit to see its lessons.', units: SOCIAL_UNITS, lessons: SOCIAL_UNITS.flatMap((u) => u.lessons) },
    { id: 'spanish', title: 'Spanish', icon: '💬', color: '#d42a3c', tagline: '¡Hola! Everyday Spanish', blurb: 'Greetings, numbers, and everyday conversations.', lessons: [] },
  ];
  const LESSONS = Object.fromEntries(SUBJECTS.flatMap((s) => s.lessons).map((l) => [l.id, l]));
  const subjectOf = (lessonId) => SUBJECTS.findIndex((s) => s.lessons.some((l) => l.id === lessonId));
  // Index of the unit holding a lesson, or -1 when its subject has no units.
  const unitOf = (lessonId) => (SUBJECTS[subjectOf(lessonId)].units || []).findIndex((u) => u.lessons.some((l) => l.id === lessonId));
  // The page a lesson lives on (its unit, else its subject): title, color, and how to open it.
  function parentOf(lessonId) {
    const si = subjectOf(lessonId);
    const ui = unitOf(lessonId);
    return ui < 0
      ? { title: SUBJECTS[si].title, color: SUBJECTS[si].color, open: () => renderSubject(si) }
      : { title: SUBJECTS[si].units[ui].short, color: SUBJECTS[si].units[ui].color, open: () => renderUnit(si, ui) };
  }
  const sessionLength = (lesson) => lesson.sessionLength || SESSION_LENGTH;

  // ---------- Progress display helpers ----------
  const lessonDone = (l) => Progress.isLearned(l.id) && Progress.sessionsFor(l.id).length > 0;

  function completionBar(lessons, { compact = false } = {}) {
    const c = Progress.completion(lessons);
    return `
      <div class="completion ${compact ? 'compact' : ''}">
        <div class="completion-head"><span>${compact ? '' : 'Completion'}</span><span>${c.pct}%</span></div>
        <div class="progress" role="progressbar" aria-label="Completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${c.pct}">
          <div class="progress-bar" style="width:${c.pct}%"></div>
        </div>
        ${compact ? '' : `<p class="muted small">${c.done} of ${c.total} done (read each lesson and finish a practice session)</p>`}
      </div>`;
  }

  const fmtDate = (iso) => new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  // Table of practice sessions, newest first.
  function sessionTable(sessions, { showLesson = false } = {}) {
    if (!sessions.length) return '<p class="muted">No practice sessions yet.</p>';
    return `
      <table class="map-table session-table">
        <thead><tr><th>Date</th>${showLesson ? '<th>Lesson</th>' : ''}<th>% correct</th><th>Correct</th><th>Failed</th></tr></thead>
        <tbody>${sessions.slice().reverse().map((s) => `
          <tr>
            <td>${fmtDate(s.date)}</td>
            ${showLesson ? `<td>${LESSONS[s.lessonId]?.title ?? 'Removed lesson'}</td>` : ''}
            <td><strong>${Progress.percent(s)}%</strong></td>
            <td class="good-text">${s.correct}</td>
            <td class="bad-text">${s.missed}</td>
          </tr>`).join('')}</tbody>
      </table>`;
  }

  // One-line status for a lesson card.
  function lessonStatus(l) {
    const sessions = Progress.sessionsFor(l.id);
    const last = sessions[sessions.length - 1];
    const best = Math.max(0, ...sessions.map(Progress.percent));
    return `
      <ul class="lesson-status">
        <li class="${Progress.isLearned(l.id) ? 'done' : ''}">${Progress.isLearned(l.id) ? '✓' : '○'} Lesson read</li>
        <li class="${last ? 'done' : ''}">${last
          ? `✓ Last practice: <strong>${Progress.percent(last)}% correct</strong>, ${last.missed} failed · best ${best}%`
          : '○ No practice yet'}</li>
      </ul>`;
  }

  // ---------- Sidebar ----------
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  // What's on screen: { view: 'home' | 'progress' | 'subject' | 'unit' | 'lesson', subject?, unit?, lesson? }
  let current = { view: 'home' };

  const cover = (s, cls = '') => `
    <span class="cover ${cls}" style="--cover:${s.color}" aria-hidden="true">
      <span class="cover-icon">${s.icon}</span>
      <span class="cover-title">${s.short || s.title}</span>
    </span>`;

  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const subjectMeta = (s) => (s.units
    ? `${plural(s.units.length, 'unit')} · ${Progress.completion(s.lessons).pct}% done`
    : s.lessons.length
      ? `${plural(s.lessons.length, 'lesson')} · ${Progress.completion(s.lessons).pct}% done`
      : 'Coming soon');

  const navLessons = (lessons) => `
    <div class="library-lessons">
      ${lessons.map((l) => `<button type="button" class="nav-link nav-lesson" data-nav-lesson="${l.id}">${l.navTitle || l.title}${lessonDone(l) ? ' <span class="nav-check" aria-label="completed">✓</span>' : ''}</button>`).join('')}
    </div>`;

  const navUnits = (si, units) => `
    <div class="library-lessons">
      ${units.map((u, ui) => `
        <button type="button" class="nav-link nav-lesson nav-unit ${u.lessons.length ? '' : 'is-soon'}" data-nav-unit="${si}:${ui}"
          ${u.lessons.length ? '' : 'title="Coming soon"'}><span aria-hidden="true">${u.icon}</span> ${u.fullTitle}${u.lessons.length ? '' : '<span class="sr-only"> (coming soon)</span>'}</button>
        ${current.unit === ui && u.lessons.length ? navLessons(u.lessons) : ''}
        ${current.unit === ui && u.decks ? `<div class="library-lessons"><button type="button" class="nav-link nav-lesson" data-nav-flash="${si}:${ui}">🃏 Flashcards</button></div>` : ''}`).join('')}
    </div>`;

  function renderNav() {
    sidebar.innerHTML = `
      <div class="side-panel">
        <div class="nav-brand">
          <span class="nav-brand-logo" aria-hidden="true">🚀</span>
          <span class="nav-brand-title">6th Grader<br>Learning Hub</span>
        </div>
        <button type="button" class="nav-link" data-nav-home><span class="nav-ico" aria-hidden="true">🏠</span>Home</button>
        <button type="button" class="nav-link" data-nav-progress><span class="nav-ico" aria-hidden="true">🏆</span>Progress &amp; scores</button>
      </div>
      <div class="side-panel side-library">
        <p class="library-head"><span aria-hidden="true">📚</span> Your Library</p>
        ${SUBJECTS.map((s, i) => `
          <div class="library-item">
            <button type="button" class="library-row" data-nav-subject="${i}">
              ${cover(s, 'cover-sm')}
              <span class="library-text">
                <span class="library-title">${s.title}</span>
                <span class="library-meta">${subjectMeta(s)}</span>
              </span>
            </button>
            ${current.subject !== i ? '' : s.units ? navUnits(i, s.units) : s.lessons.length ? navLessons(s.lessons) : ''}
          </div>`).join('')}
      </div>`;
    sidebar.querySelector('[data-nav-home]').addEventListener('click', () => { closeMenu(); renderHome(); });
    sidebar.querySelector('[data-nav-progress]').addEventListener('click', () => { closeMenu(); renderProgress(); });
    sidebar.querySelectorAll('[data-nav-subject]').forEach((b) => b.addEventListener('click', () => {
      closeMenu();
      renderSubject(+b.dataset.navSubject);
    }));
    sidebar.querySelectorAll('[data-nav-unit]').forEach((b) => b.addEventListener('click', () => {
      closeMenu();
      const [si, ui] = b.dataset.navUnit.split(':').map(Number);
      renderUnit(si, ui);
    }));
    sidebar.querySelectorAll('[data-nav-flash]').forEach((b) => b.addEventListener('click', () => {
      closeMenu();
      const [si, ui] = b.dataset.navFlash.split(':').map(Number);
      renderFlashcards(si, ui, 'all');
    }));
    sidebar.querySelectorAll('[data-nav-lesson]').forEach((b) => b.addEventListener('click', () => {
      closeMenu();
      renderLesson(+b.dataset.navLesson, 0);
    }));
    markActive();
  }

  function markActive() {
    const set = (el, on) => {
      el.classList.toggle('is-active', on);
      if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    };
    sidebar.querySelectorAll('[data-nav-home]').forEach((b) => set(b, current.view === 'home'));
    sidebar.querySelectorAll('[data-nav-progress]').forEach((b) => set(b, current.view === 'progress'));
    sidebar.querySelectorAll('[data-nav-subject]').forEach((b) => set(b, current.view === 'subject' && current.subject === +b.dataset.navSubject));
    sidebar.querySelectorAll('[data-nav-unit]').forEach((b) => set(b, current.view === 'unit' && b.dataset.navUnit === `${current.subject}:${current.unit}`));
    sidebar.querySelectorAll('[data-nav-flash]').forEach((b) => set(b, current.view === 'flashcards'));
    sidebar.querySelectorAll('[data-nav-lesson]').forEach((b) => set(b, current.lesson === +b.dataset.navLesson));
  }

  // Records the view, redraws the sidebar, and adds a browser-history entry so the Back button works.
  function setView(view, { push = true } = {}) {
    const same = JSON.stringify(view) === JSON.stringify(current);
    current = view;
    renderNav();
    if (push && !same && (view.view !== 'lesson')) history.pushState(view, '');
  }

  function refreshNav() { renderNav(); }

  window.addEventListener('popstate', (e) => {
    const v = e.state || { view: 'home' };
    if (v.view === 'subject') renderSubject(v.subject, { push: false });
    else if (v.view === 'unit') renderUnit(v.subject, v.unit, { push: false });
    else if (v.view === 'flashcards') renderFlashcards(v.subject, v.unit, v.deck, { push: false });
    else if (v.view === 'progress') renderProgress({ push: false });
    else renderHome({ push: false });
  });

  function closeMenu() {
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  // Top bar with a back arrow and breadcrumbs. crumbs: [{ label, go? }] — the last one is the current page.
  function topbar(crumbs, back) {
    return `
      <div class="topbar">
        <button type="button" class="round-btn" data-back ${back ? '' : 'disabled'} aria-label="Go back">‹</button>
        <nav class="crumbs" aria-label="Breadcrumb">
          ${crumbs.map((c, i) => (i < crumbs.length - 1
            ? `<button type="button" class="crumb" data-crumb="${i}">${c.label}</button><span aria-hidden="true">›</span>`
            : `<span class="crumb-current" aria-current="page">${c.label}</span>`)).join('')}
        </nav>
      </div>`;
  }

  function wireTopbar(crumbs, back) {
    if (back) app.querySelector('[data-back]').addEventListener('click', back);
    app.querySelectorAll('[data-crumb]').forEach((b) => b.addEventListener('click', crumbs[+b.dataset.crumb].go));
  }

  // Crumbs/back target for anything inside a lesson.
  function lessonNav(lessonId, extra) {
    const si = subjectOf(lessonId);
    const ui = unitOf(lessonId);
    const crumbs = [
      { label: 'Home', go: () => renderHome() },
      { label: SUBJECTS[si].title, go: () => renderSubject(si) },
      ...(ui < 0 ? [] : [{ label: SUBJECTS[si].units[ui].short, go: () => renderUnit(si, ui) }]),
      { label: extra },
    ];
    return { crumbs, back: parentOf(lessonId).open };
  }

  const FOOTER = `
    <footer class="site-footer">
      <p><strong>Disclaimer:</strong> 6th Grader Learning Hub is an independent study aid made for practice. It is not affiliated with or endorsed by any school or school district, and it does not replace your teacher's lessons, instructions or materials. Always check with your teacher about what will be on a test. <em>The Lightning Thief</em> is by Rick Riordan; the summaries here are for study only.</p>
      <p class="copyright">© ${new Date().getFullYear()} Arman Madath. All rights reserved.</p>
    </footer>`;

  // nav: { crumbs, back } for the top bar; color tints the header; wide pages skip the narrow reading column.
  function show(html, { nav, color = '#535353', wide = false } = {}) {
    app.style.setProperty('--tint', color);
    app.innerHTML = `
      <div class="view-tint" aria-hidden="true"></div>
      ${nav ? topbar(nav.crumbs, nav.back) : ''}
      <div class="${wide ? 'wide' : 'narrow'}">${html}</div>
      ${FOOTER}`;
    if (nav) wireTopbar(nav.crumbs, nav.back);
    window.scrollTo(0, 0);
    const heading = app.querySelector('h1, h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  }

  // ---------- Home ----------
  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }

  function renderHome({ push = true } = {}) {
    setView({ view: 'home' }, { push });
    show(`
      <section class="home-head">
        <p class="eyebrow">🚀 6th Grader Learning Hub</p>
        <h1>${greeting()} 👋</h1>
        <p class="muted">Pick a subject to see its lessons. Learn the ideas, then practice.</p>
      </section>
      <h2 class="shelf-title">Your subjects</h2>
      <div class="tile-grid">
        ${SUBJECTS.map((s, i) => `
          <button type="button" class="tile subject-tile" data-subject="${i}">
            <span class="tile-cover">
              ${cover(s)}
              ${s.lessons.length ? '<span class="play-fab" aria-hidden="true">▶</span>' : ''}
            </span>
            <span class="tile-title">${s.title}</span>
            <span class="tile-meta">${s.tagline}</span>
            ${s.lessons.length ? `<span class="tile-foot">${subjectMeta(s)}</span>` : '<span class="soon-pill">🚧 Coming soon</span>'}
          </button>`).join('')}
      </div>`, { wide: true, color: '#4b3f8f' });
    app.querySelectorAll('[data-subject]').forEach((b) => b.addEventListener('click', () => renderSubject(+b.dataset.subject)));
  }

  // ---------- Subject & unit pages ----------
  // Big header with cover art; `item` is a subject or a unit.
  const pageHero = (item, kind, title, meta) => `
    <section class="subject-hero">
      ${cover(item, 'cover-lg')}
      <div class="subject-hero-text">
        <p class="eyebrow">${kind}</p>
        <h1 class="subject-name ${title.length > 14 ? 'is-long' : ''}">${title}</h1>
        <p class="muted">${item.blurb}</p>
        <p class="small"><strong>6th Grader Learning Hub</strong> · ${meta}</p>
      </div>
    </section>`;

  // Play button, completion and lesson cards — or a "coming soon" note when there are none yet.
  const lessonsSection = (lessons, name, backLabel) => (lessons.length ? `
    <div class="subject-actions">
      <button type="button" class="play-fab play-fab-lg" data-play aria-label="Start the first lesson">▶</button>
      <div class="subject-progress">${completionBar(lessons)}</div>
    </div>
    <h2 class="shelf-title">Lessons</h2>
    <div class="tile-grid lesson-tiles">
      ${lessons.map((l) => `
        <article class="tile lesson-tile">
          <div class="lesson-art" aria-hidden="true">${l.art}</div>
          <h3 class="tile-title">${l.title}</h3>
          <p class="tile-meta">${l.blurb}</p>
          ${lessonStatus(l)}
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-learn="${l.id}">Learn</button>
            <button type="button" class="btn btn-primary" data-practice="${l.id}">▶ Practice</button>
          </div>
        </article>`).join('')}
    </div>` : `
    <div class="empty-state">
      <p class="empty-icon" aria-hidden="true">🚧</p>
      <h2>Lessons coming soon</h2>
      <p class="muted">We're still building ${name}. Try another one for now!</p>
      <button type="button" class="btn btn-primary" data-up>${backLabel}</button>
    </div>`);

  function wireLessons(lessons, up) {
    app.querySelector('[data-play]')?.addEventListener('click', () => renderLesson(lessons[0].id, 0));
    app.querySelector('[data-up]')?.addEventListener('click', up);
    app.querySelectorAll('[data-learn]').forEach((b) => b.addEventListener('click', () => renderLesson(+b.dataset.learn, 0)));
    app.querySelectorAll('[data-practice]').forEach((b) => b.addEventListener('click', () => startPractice(+b.dataset.practice)));
  }

  function renderSubject(i, { push = true } = {}) {
    const s = SUBJECTS[i];
    setView({ view: 'subject', subject: i }, { push });
    const home = () => renderHome();
    const body = s.units ? `
      <div class="subject-actions">
        <div class="subject-progress">${completionBar(s.lessons)}</div>
      </div>
      <h2 class="shelf-title">Units</h2>
      <div class="tile-grid">
        ${s.units.map((u, ui) => `
          <button type="button" class="tile subject-tile" data-unit="${ui}">
            <span class="tile-cover">
              ${cover(u)}
              ${u.lessons.length ? '<span class="play-fab" aria-hidden="true">▶</span>' : ''}
            </span>
            <span class="tile-title">${u.title}</span>
            <span class="tile-meta">${u.blurb}</span>
            ${u.lessons.length
              ? `<span class="tile-foot">${plural(u.lessons.length, 'lesson')} · ${Progress.completion(u.lessons).pct}% done</span>`
              : '<span class="soon-pill">🚧 Coming soon</span>'}
          </button>`).join('')}
      </div>` : lessonsSection(s.lessons, s.title, 'Browse subjects');
    show(pageHero(s, 'Subject', s.title, subjectMeta(s)) + body, {
      wide: true,
      color: s.color,
      nav: { crumbs: [{ label: 'Home', go: home }, { label: s.title }], back: home },
    });
    app.querySelectorAll('[data-unit]').forEach((b) => b.addEventListener('click', () => renderUnit(i, +b.dataset.unit)));
    wireLessons(s.lessons, home);
  }

  function renderUnit(si, ui, { push = true } = {}) {
    const s = SUBJECTS[si];
    const u = s.units[ui];
    setView({ view: 'unit', subject: si, unit: ui }, { push });
    const up = () => renderSubject(si);
    const meta = `${s.title} · ${u.lessons.length ? `${plural(u.lessons.length, 'lesson')} · ${Progress.completion(u.lessons).pct}% done` : 'Coming soon'}`;
    show(pageHero(u, u.short, u.title, meta) + lessonsSection(u.lessons, u.fullTitle, `Back to ${s.title} units`) + decksSection(u), {
      wide: true,
      color: u.color,
      nav: { crumbs: [{ label: 'Home', go: () => renderHome() }, { label: s.title, go: up }, { label: u.short }], back: up },
    });
    wireLessons(u.lessons, up);
    app.querySelectorAll('[data-deck]').forEach((b) => b.addEventListener('click', () => renderFlashcards(si, ui, b.dataset.deck)));
  }

  // ---------- Flashcards ----------
  const deckMeta = (d) => {
    const m = Flashcards.masteredCount(d.cards);
    return `${plural(d.cards.length, 'card')} · ${m} mastered`;
  };

  // "Master …" shelf of flashcard decks on a unit page.
  const decksSection = (u) => (u.decks ? `
    <section class="deck-shelf">
      <h2 class="shelf-title">🃏 Master Grade 6 ${u.title}</h2>
      <p class="muted">Flashcards for quick revision: review key vocabulary and facts, flip each card, and sort it into <strong>Got it</strong> or <strong>Still learning</strong>. Cards you master are remembered on this device.</p>
      <div class="tile-grid">
        ${u.decks.map((d) => {
          const pct = Math.round((Flashcards.masteredCount(d.cards) / d.cards.length) * 100);
          return `
            <button type="button" class="tile subject-tile deck-tile" data-deck="${d.key}">
              <span class="tile-cover">${cover(d)}<span class="play-fab" aria-hidden="true">▶</span></span>
              <span class="tile-title">${d.title}</span>
              <span class="tile-foot">${deckMeta(d)}</span>
              <span class="progress deck-progress" aria-hidden="true"><span class="progress-bar" style="width:${pct}%"></span></span>
            </button>`;
        }).join('')}
      </div>
    </section>` : '');

  function renderFlashcards(si, ui, key, { push = true } = {}) {
    const s = SUBJECTS[si];
    const u = s.units[ui];
    const deck = u.decks.find((d) => d.key === key) || u.decks[0];
    setView({ view: 'flashcards', subject: si, unit: ui, deck: deck.key }, { push });
    const up = () => renderUnit(si, ui);
    show(`
      <section class="card fc-page">
        <p class="eyebrow">Flashcards · ${u.fullTitle}</p>
        <h2>${deck.icon} ${deck.title}</h2>
        <div class="deck-switch" role="group" aria-label="Choose a deck">
          ${u.decks.map((d) => `<button type="button" class="fc-toggle" data-switch="${d.key}" aria-pressed="${d === deck}">${d.icon} ${d.short}</button>`).join('')}
        </div>
        <div id="fcHost"></div>
      </section>`, {
      color: deck.color,
      nav: { crumbs: [{ label: 'Home', go: () => renderHome() }, { label: s.title, go: () => renderSubject(si) }, { label: u.short, go: up }, { label: `Flashcards: ${deck.short}` }], back: up },
    });
    app.querySelectorAll('[data-switch]').forEach((b) => b.addEventListener('click', () => renderFlashcards(si, ui, b.dataset.switch)));
    Flashcards.study(app.querySelector('#fcHost'), deck, {
      onExit: up,
      onDone: () => Celebrate.play('Deck complete!'),
    });
  }

  // ---------- Lesson ----------
  function renderLesson(id, stepIndex) {
    const lesson = LESSONS[id];
    const parent = parentOf(id);
    setView({ view: 'lesson', subject: subjectOf(id), unit: unitOf(id), lesson: id });
    const step = lesson.steps[stepIndex];
    const last = stepIndex === lesson.steps.length - 1;
    if (last) { Progress.markLearned(id); refreshNav(); }
    const nav = lessonNav(id, lesson.short);
    show(`
      <section class="card">
        <p class="eyebrow">${lesson.title} · Step ${stepIndex + 1} of ${lesson.steps.length}</p>
        <div class="dots" aria-hidden="true">${lesson.steps.map((_, i) => `<span class="dot ${i <= stepIndex ? 'on' : ''}"></span>`).join('')}</div>
        <h2>${step.title}</h2>
        <div class="step-body">${step.html}</div>
        <div class="actions nav-actions">
          <button type="button" class="btn btn-ghost" id="back">${stepIndex === 0 ? `← ${parent.title}` : '← Back'}</button>
          ${last
            ? `<button type="button" class="btn btn-primary" id="practice">Start practice →</button>`
            : `<button type="button" class="btn btn-primary" id="next">Next →</button>`}
        </div>
      </section>`, { nav, color: parent.color });
    if (step.mount) step.mount(app.querySelector('.step-body'));
    if (last) Celebrate.play('Lesson complete!');
    app.querySelector('#back').addEventListener('click', () => (stepIndex === 0 ? nav.back() : renderLesson(id, stepIndex - 1)));
    if (last) app.querySelector('#practice').addEventListener('click', () => startPractice(id));
    else app.querySelector('#next').addEventListener('click', () => renderLesson(id, stepIndex + 1));
  }

  // ---------- Practice ----------
  let session = null;

  function startPractice(lessonId) {
    const lesson = LESSONS[lessonId];
    setView({ view: 'lesson', subject: subjectOf(lessonId), unit: unitOf(lessonId), lesson: lessonId });
    session = {
      lessonId,
      questions: lesson.buildSession
        ? lesson.buildSession(sessionLength(lesson))
        : Questions.buildSession(lessonId, sessionLength(lesson)),
      index: 0,
      results: [],         // { q, outcome: 'first' | 'second' | 'missed' }
      submissions: 0,      // every checked answer
      correctSubmissions: 0,
    };
    renderQuestion();
  }

  function renderQuestion() {
    const { questions, index, lessonId } = session;
    const q = questions[index];
    let attempts = 0;
    let selected = null;
    let finished = false;

    // 'custom' questions bring their own answer area: q.mount(el) → { value(), mark(marks), reveal(), disable() }.
    const answerArea = q.format === 'custom'
      ? '<div class="custom-answer"></div>'
      : q.format === 'mc'
      ? `<div class="options ${q.wideOptions ? 'options-wide' : ''} ${q.textOptions ? 'options-text' : ''}" role="radiogroup" aria-label="Answer choices">
          ${q.options.map((o) => `
            <button type="button" class="btn btn-option option" role="radio" aria-checked="false" data-id="${o.id}">
              <span class="opt-letter">${o.id}</span><span class="opt-body">${o.html}</span>
            </button>`).join('')}
        </div>`
      : q.format === 'number'
        ? `<label class="ratio-input">
            <span class="sr-only">Your answer</span>
            <input id="answer" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="e.g. 12">
          </label>
          <p class="muted small">Type just the number, like 12 or 1.5.</p>`
        : `<label class="ratio-input">
          <span class="sr-only">Your answer</span>
          <input id="answer" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="e.g. 3:2">
        </label>
        <p class="muted small">You can type 3:2, 3 to 2, or 3/2.</p>`;

    show(`
      <section class="card practice">
        <div class="practice-head">
          <p class="eyebrow">${LESSONS[lessonId].short} practice · Question ${index + 1} of ${questions.length}</p>
          <button type="button" class="btn btn-ghost small" id="quit">Quit</button>
        </div>
        <div class="progress" aria-hidden="true"><div class="progress-bar" style="width:${(index / questions.length) * 100}%"></div></div>
        <p class="skill-tag">${q.skill}</p>
        <h2 class="prompt">${q.prompt}</h2>
        ${q.visual ? `<div class="diagram-box">${Diagrams.render(q.visual)}</div>` : ''}
        ${q.visualHtml ? `<div class="diagram-box">${q.visualHtml}</div>` : ''}
        <form id="answerForm" novalidate>
          ${answerArea}
          <div id="feedback" class="feedback" role="status" aria-live="polite"></div>
          <div class="actions">
            <button type="submit" class="btn btn-primary" id="checkBtn">Check answer</button>
            <button type="button" class="btn btn-primary" id="continueBtn" hidden>${index + 1 < questions.length ? 'Continue →' : 'See results →'}</button>
          </div>
        </form>
      </section>`, { nav: lessonNav(lessonId, `${LESSONS[lessonId].short} practice`), color: parentOf(lessonId).color });

    const form = app.querySelector('#answerForm');
    const feedback = app.querySelector('#feedback');
    const checkBtn = app.querySelector('#checkBtn');
    const continueBtn = app.querySelector('#continueBtn');
    const input = app.querySelector('#answer');

    app.querySelector('#quit').addEventListener('click', parentOf(lessonId).open);

    if (q.format === 'mc') {
      app.querySelectorAll('.option').forEach((btn) => btn.addEventListener('click', () => {
        if (finished || btn.disabled) return;
        selected = btn.dataset.id;
        app.querySelectorAll('.option').forEach((b) => {
          b.classList.toggle('is-selected', b === btn);
          b.setAttribute('aria-checked', String(b === btn));
        });
      }));
    } else if (input) {
      input.focus();
    }
    const custom = q.format === 'custom' ? q.mount(app.querySelector('.custom-answer')) : null;

    const setFeedback = (kind, html) => {
      feedback.className = `feedback ${kind}`;
      feedback.innerHTML = html;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (finished) return;
      const value = custom ? custom.value() : q.format === 'mc' ? selected : input.value;
      if (q.format === 'mc' && !value) {
        setFeedback('info', 'Choose an answer first.');
        return;
      }
      const res = q.check(value);
      if (custom && res.marks) custom.mark(res.marks);
      if (res.status === 'invalid') {
        setFeedback('info', res.message);
        return;
      }

      attempts++;
      session.submissions++;

      if (res.status === 'correct') {
        session.correctSubmissions++;
        finish(attempts === 1 ? 'first' : 'second');
        markOption('is-correct');
        setFeedback('good', `
          <p class="fb-title">✅ Correct!</p>
          ${res.message ? `<p>${res.message}</p>` : ''}
          <p>${q.explanation}</p>`);
        return;
      }

      markOption('is-wrong', true);
      if (attempts < MAX_ATTEMPTS) {
        setFeedback('hint', `
          <p class="fb-title">🤔 Not quite. Try again!</p>
          <p><strong>Hint:</strong> ${res.message || q.hint}</p>
          ${res.message ? `<p class="muted">${q.hint}</p>` : ''}`);
        if (input) { input.select(); input.focus(); }
        selected = null;
        return;
      }

      finish('missed');
      revealCorrectOption();
      setFeedback('bad', `
        <p class="fb-title">Here's the solution</p>
        <p>The answer is <strong>${q.solution}</strong>.</p>
        ${q.solutionVisual && q.format !== 'mc' ? `<div class="diagram-box">${Diagrams.render(q.solutionVisual)}</div>` : ''}
        <p>${q.explanation}</p>`);
    });

    // Marks the currently selected MC option; optionally disables it so it can't be picked again.
    function markOption(cls, disable = false) {
      if (q.format !== 'mc' || !selected) return;
      const btn = app.querySelector(`.option[data-id="${selected}"]`);
      btn.classList.remove('is-selected');
      btn.classList.add(cls);
      btn.setAttribute('aria-checked', 'false');
      if (disable) btn.disabled = true;
    }

    function revealCorrectOption() {
      if (custom) { custom.reveal(); return; }
      if (q.format !== 'mc') return;
      const correct = q.options.find((o) => o.correct);
      app.querySelector(`.option[data-id="${correct.id}"]`).classList.add('is-answer');
    }

    function finish(outcome) {
      finished = true;
      session.results.push({ q, outcome, attempts });
      checkBtn.hidden = true;
      continueBtn.hidden = false;
      continueBtn.focus();
      if (input) input.readOnly = true;
      custom?.disable();
      app.querySelectorAll('.option').forEach((b) => { b.disabled = true; });
    }

    continueBtn.addEventListener('click', () => {
      session.index++;
      if (session.index < session.questions.length) renderQuestion();
      else renderResults();
    });
  }

  // ---------- Results ----------
  function renderResults() {
    const { results, lessonId, submissions, correctSubmissions } = session;
    const total = results.length;
    const score = results.reduce((s, r) => s + POINTS[r.outcome], 0);
    const maxScore = total * POINTS.first;
    const correct = results.filter((r) => r.outcome !== 'missed').length;
    const incorrect = total - correct;
    const accuracy = submissions ? Math.round((correctSubmissions / submissions) * 100) : 0;
    const pctCorrect = total ? Math.round((correct / total) * 100) : 0;
    const justFinished = !session.saved;
    if (!session.saved) {
      session.saved = true;
      Progress.addSession({ lessonId, total, correct, missed: incorrect });
      refreshNav();
    }
    const needsPractice = results.filter((r) => r.outcome !== 'first');

    // Group the questions needing practice by skill.
    const bySkill = {};
    needsPractice.forEach((r) => { (bySkill[r.q.skill] ||= []).push(r); });

    const headline = incorrect === 0 && needsPractice.length === 0
      ? 'Perfect session! 🌟'
      : correct >= Math.ceil(total * 0.6) ? 'Nice work! 👏' : 'Keep practicing, you\'re learning! 💪';

    show(`
      <section class="card">
        <p class="eyebrow">${LESSONS[lessonId].short} practice · Results</p>
        <h2>${headline}</h2>
        <div class="stats">
          <div class="stat"><span class="stat-value">${pctCorrect}%</span><span class="stat-label">Correct</span></div>
          <div class="stat good"><span class="stat-value">${correct}<small>/${total}</small></span><span class="stat-label">Questions right</span></div>
          <div class="stat bad"><span class="stat-value">${incorrect}</span><span class="stat-label">Failed</span></div>
          <div class="stat"><span class="stat-value">${score}<small>/${maxScore}</small></span><span class="stat-label">Score</span></div>
        </div>
        <p class="muted small">Failed means still wrong after ${MAX_ATTEMPTS} tries. Score: ${POINTS.first} points for a correct first try, ${POINTS.second} for a correct second try.
          ${correctSubmissions} of ${submissions} answers checked were correct (${accuracy}%).</p>

        <h3>Questions needing more practice</h3>
        ${needsPractice.length === 0
          ? '<p>None. You got every question right on the first try!</p>'
          : Object.entries(bySkill).map(([skill, items]) => `
              <div class="practice-group">
                <p class="skill-tag">${skill}</p>
                <ul class="review-list">
                  ${items.map((r) => `
                    <li>
                      <span class="badge ${r.outcome}">${r.outcome === 'missed' ? 'Missed' : 'Needed a hint'}</span>
                      <span>${Util.escapeHtml(r.q.summary)}</span>
                      <span class="muted">Answer: <strong>${r.q.solution}</strong></span>
                    </li>`).join('')}
                </ul>
              </div>`).join('')}

        <h3>Your sessions for this lesson</h3>
        ${sessionTable(Progress.sessionsFor(lessonId).slice(-10))}

        <div class="actions">
          <button type="button" class="btn btn-primary" id="again">Practice again</button>
          <button type="button" class="btn btn-secondary" id="review">Review lesson</button>
          <button type="button" class="btn btn-ghost" id="home">← Back to ${parentOf(lessonId).title}</button>
        </div>
      </section>`, { nav: lessonNav(lessonId, 'Results'), color: parentOf(lessonId).color });

    if (justFinished) Celebrate.play('Practice complete!');
    app.querySelector('#again').addEventListener('click', () => startPractice(lessonId));
    app.querySelector('#review').addEventListener('click', () => renderLesson(lessonId, 0));
    app.querySelector('#home').addEventListener('click', parentOf(lessonId).open);
  }

  // ---------- Progress page ----------
  function renderProgress({ push = true } = {}) {
    setView({ view: 'progress' }, { push });
    const all = Progress.allSessions();
    show(`
      <section class="card">
        <h2>Progress &amp; scores</h2>
        <p class="muted small">Saved in this browser on this device.</p>
        ${SUBJECTS.filter((s) => s.lessons.length).map((s) => {
          const ids = new Set(s.lessons.map((l) => l.id));
          const sessions = all.filter((x) => ids.has(x.lessonId));
          return `
            <h3>${s.title}</h3>
            ${completionBar(s.lessons)}
            <table class="map-table">
              <thead><tr><th>Lesson</th><th>Read</th><th>Sessions</th><th>Last</th><th>Best</th></tr></thead>
              <tbody>${s.lessons.map((l) => {
                const ls = Progress.sessionsFor(l.id);
                const last = ls[ls.length - 1];
                return `<tr>
                  <td>${l.title}</td>
                  <td>${Progress.isLearned(l.id) ? '✓' : '–'}</td>
                  <td>${ls.length}</td>
                  <td>${last ? `${Progress.percent(last)}% <span class="muted small">(${last.missed} failed)</span>` : '–'}</td>
                  <td>${ls.length ? `${Math.max(...ls.map(Progress.percent))}%` : '–'}</td>
                </tr>`;
              }).join('')}</tbody>
            </table>
            <details class="qa"><summary>All ${s.title} sessions (${sessions.length})</summary>${sessionTable(sessions, { showLesson: true })}</details>`;
        }).join('')}
        <div class="actions">
          <button type="button" class="btn btn-ghost" id="resetProgress">Reset all progress</button>
        </div>
      </section>`, { nav: { crumbs: [{ label: 'Home', go: () => renderHome() }, { label: 'Progress & scores' }], back: () => renderHome() }, color: '#b8860b' });
    app.querySelector('#resetProgress').addEventListener('click', () => {
      if (!window.confirm('Erase all saved progress, scores, and flashcard mastery?')) return;
      Progress.reset();
      Flashcards.reset();
      refreshNav();
      renderProgress();
    });
  }

  history.replaceState({ view: 'home' }, '');
  renderHome({ push: false });
})();
