// App shell: home → lesson → practice → results.
(() => {
  const app = document.getElementById('app');
  const SESSION_LENGTH = 5;
  const MAX_ATTEMPTS = 2;
  const POINTS = { first: 10, second: 5, missed: 0 };

  const SUBJECTS = [
    { title: 'Maths 6+', blurb: 'Learn ratios, one step at a time.', lessons: Lessons.all },
    { title: 'ELA 6th Grade', blurb: 'Get ready for the open-book test on Chapters 1–8 of <em>The Lightning Thief</em> and the Hero\'s Journey. It tests skills, not memory, so start with the tips.', lessons: Ela.lessons },
  ];
  const LESSONS = Object.fromEntries(SUBJECTS.flatMap((s) => s.lessons).map((l) => [l.id, l]));
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
  let activeNav = null;

  function renderNav() {
    sidebar.innerHTML = `
      <button type="button" class="nav-link nav-home" data-nav-home>🏠 Home</button>
      <button type="button" class="nav-link" data-nav-progress>📊 Progress &amp; scores</button>
      ${SUBJECTS.map((s, i) => `
        <div class="nav-group">
          <button type="button" class="nav-subject" data-nav-subject="${i}">${s.title}</button>
          ${completionBar(s.lessons, { compact: true })}
          ${s.lessons.map((l) => `<button type="button" class="nav-link" data-nav-lesson="${l.id}">${l.title}${lessonDone(l) ? ' <span class="nav-check" aria-label="completed">✓</span>' : ''}</button>`).join('')}
        </div>`).join('')}`;
    sidebar.querySelector('[data-nav-home]').addEventListener('click', () => { closeMenu(); renderHome(); });
    sidebar.querySelector('[data-nav-progress]').addEventListener('click', () => { closeMenu(); renderProgress(); });
    sidebar.querySelectorAll('[data-nav-subject]').forEach((b) => b.addEventListener('click', () => {
      closeMenu();
      renderHome();
      app.querySelectorAll('.subject')[+b.dataset.navSubject].scrollIntoView({ block: 'start' });
    }));
    sidebar.querySelectorAll('[data-nav-lesson]').forEach((b) => b.addEventListener('click', () => {
      closeMenu();
      renderLesson(+b.dataset.navLesson, 0);
    }));
  }

  // Highlights the current lesson id, 'progress', or Home (null).
  function setActive(id) {
    activeNav = id;
    sidebar.querySelectorAll('.nav-link').forEach((b) => {
      const on = id == null ? 'navHome' in b.dataset
        : id === 'progress' ? 'navProgress' in b.dataset
        : +b.dataset.navLesson === id;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }

  function refreshNav() {
    renderNav();
    setActive(activeNav);
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  function show(html) {
    app.innerHTML = html;
    window.scrollTo(0, 0);
    const heading = app.querySelector('h1, h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  }

  // ---------- Home ----------
  function renderHome() {
    setActive(null);
    show(`
      <section class="hero">
        <h1>Learn one step at a time</h1>
        <p class="muted">Pick a subject and a lesson. Learn the ideas, then practice.</p>
      </section>
      ${SUBJECTS.map((s) => `
        <section class="subject">
          <h2 class="subject-title">${s.title}</h2>
          <p class="muted">${s.blurb}</p>
          ${completionBar(s.lessons)}
          <div class="lesson-grid">
            ${s.lessons.map((l) => `
              <article class="card lesson-card">
                <div class="lesson-art" aria-hidden="true">${l.art}</div>
                <h3>${l.title}</h3>
                <p class="muted">${l.blurb}</p>
                ${lessonStatus(l)}
                <div class="actions">
                  <button type="button" class="btn btn-secondary" data-learn="${l.id}">Learn</button>
                  <button type="button" class="btn btn-primary" data-practice="${l.id}">Start practice</button>
                </div>
              </article>`).join('')}
          </div>
        </section>`).join('')}`);
    app.querySelectorAll('[data-learn]').forEach((b) => b.addEventListener('click', () => renderLesson(+b.dataset.learn, 0)));
    app.querySelectorAll('[data-practice]').forEach((b) => b.addEventListener('click', () => startPractice(+b.dataset.practice)));
  }

  // ---------- Lesson ----------
  function renderLesson(id, stepIndex) {
    const lesson = LESSONS[id];
    setActive(id);
    const step = lesson.steps[stepIndex];
    const last = stepIndex === lesson.steps.length - 1;
    if (last) { Progress.markLearned(id); refreshNav(); }
    show(`
      <section class="card">
        <p class="eyebrow">${lesson.title} · Step ${stepIndex + 1} of ${lesson.steps.length}</p>
        <div class="dots" aria-hidden="true">${lesson.steps.map((_, i) => `<span class="dot ${i <= stepIndex ? 'on' : ''}"></span>`).join('')}</div>
        <h2>${step.title}</h2>
        <div class="step-body">${step.html}</div>
        <div class="actions nav-actions">
          <button type="button" class="btn btn-ghost" id="back">${stepIndex === 0 ? '← Home' : '← Back'}</button>
          ${last
            ? `<button type="button" class="btn btn-primary" id="practice">Start practice →</button>`
            : `<button type="button" class="btn btn-primary" id="next">Next →</button>`}
        </div>
      </section>`);
    if (step.mount) step.mount(app.querySelector('.step-body'));
    app.querySelector('#back').addEventListener('click', () => (stepIndex === 0 ? renderHome() : renderLesson(id, stepIndex - 1)));
    if (last) app.querySelector('#practice').addEventListener('click', () => startPractice(id));
    else app.querySelector('#next').addEventListener('click', () => renderLesson(id, stepIndex + 1));
  }

  // ---------- Practice ----------
  let session = null;

  function startPractice(lessonId) {
    const lesson = LESSONS[lessonId];
    setActive(lessonId);
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

    const answerArea = q.format === 'mc'
      ? `<div class="options ${q.wideOptions ? 'options-wide' : ''} ${q.textOptions ? 'options-text' : ''}" role="radiogroup" aria-label="Answer choices">
          ${q.options.map((o) => `
            <button type="button" class="btn btn-option option" role="radio" aria-checked="false" data-id="${o.id}">
              <span class="opt-letter">${o.id}</span><span class="opt-body">${o.html}</span>
            </button>`).join('')}
        </div>`
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
        <form id="answerForm" novalidate>
          ${answerArea}
          <div id="feedback" class="feedback" role="status" aria-live="polite"></div>
          <div class="actions">
            <button type="submit" class="btn btn-primary" id="checkBtn">Check answer</button>
            <button type="button" class="btn btn-primary" id="continueBtn" hidden>${index + 1 < questions.length ? 'Continue →' : 'See results →'}</button>
          </div>
        </form>
      </section>`);

    const form = app.querySelector('#answerForm');
    const feedback = app.querySelector('#feedback');
    const checkBtn = app.querySelector('#checkBtn');
    const continueBtn = app.querySelector('#continueBtn');
    const input = app.querySelector('#answer');

    app.querySelector('#quit').addEventListener('click', renderHome);

    if (q.format === 'mc') {
      app.querySelectorAll('.option').forEach((btn) => btn.addEventListener('click', () => {
        if (finished || btn.disabled) return;
        selected = btn.dataset.id;
        app.querySelectorAll('.option').forEach((b) => {
          b.classList.toggle('is-selected', b === btn);
          b.setAttribute('aria-checked', String(b === btn));
        });
      }));
    } else {
      input.focus();
    }

    const setFeedback = (kind, html) => {
      feedback.className = `feedback ${kind}`;
      feedback.innerHTML = html;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (finished) return;
      const value = q.format === 'mc' ? selected : input.value;
      if (q.format === 'mc' && !value) {
        setFeedback('info', 'Choose an answer first.');
        return;
      }
      const res = q.check(value);
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
          <button type="button" class="btn btn-ghost" id="home">Home</button>
        </div>
      </section>`);

    app.querySelector('#again').addEventListener('click', () => startPractice(lessonId));
    app.querySelector('#review').addEventListener('click', () => renderLesson(lessonId, 0));
    app.querySelector('#home').addEventListener('click', renderHome);
  }

  // ---------- Progress page ----------
  function renderProgress() {
    setActive('progress');
    const all = Progress.allSessions();
    show(`
      <section class="card">
        <h2>Progress &amp; scores</h2>
        <p class="muted small">Saved in this browser on this device.</p>
        ${SUBJECTS.map((s) => {
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
      </section>`);
    app.querySelector('#resetProgress').addEventListener('click', () => {
      if (!window.confirm('Erase all saved progress and scores?')) return;
      Progress.reset();
      refreshNav();
      renderProgress();
    });
  }

  renderNav();
  renderHome();
})();
