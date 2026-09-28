// App shell: home → lesson → practice → results.
(() => {
  const app = document.getElementById('app');
  const SESSION_LENGTH = 5;
  const MAX_ATTEMPTS = 2;
  const POINTS = { first: 10, second: 5, missed: 0 };

  function show(html) {
    app.innerHTML = html;
    window.scrollTo(0, 0);
    const heading = app.querySelector('h1, h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  }

  // ---------- Home ----------
  function renderHome() {
    show(`
      <section class="hero">
        <h1>Learn ratios, one step at a time</h1>
        <p class="muted">Pick a lesson. Learn the idea, then practice with ${SESSION_LENGTH} questions.</p>
      </section>
      <section class="lesson-grid">
        ${Lessons.all.map((l) => `
          <article class="card lesson-card">
            <div class="lesson-art" aria-hidden="true">${Diagrams.render(l.id === 1
              ? { a: 3, b: 2, itemA: 'red', itemB: 'blue' }
              : { a: 2, b: 4, itemA: 'green', itemB: 'orange', layout: 'rows' })}</div>
            <h2>${l.title}</h2>
            <p class="muted">${l.blurb}</p>
            <div class="actions">
              <button type="button" class="btn btn-secondary" data-learn="${l.id}">Learn</button>
              <button type="button" class="btn btn-primary" data-practice="${l.id}">Start practice</button>
            </div>
          </article>`).join('')}
      </section>`);
    app.querySelectorAll('[data-learn]').forEach((b) => b.addEventListener('click', () => renderLesson(+b.dataset.learn, 0)));
    app.querySelectorAll('[data-practice]').forEach((b) => b.addEventListener('click', () => startPractice(+b.dataset.practice)));
  }

  // ---------- Lesson ----------
  function renderLesson(id, stepIndex) {
    const lesson = Lessons.byId[id];
    const step = lesson.steps[stepIndex];
    const last = stepIndex === lesson.steps.length - 1;
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
    session = {
      lessonId,
      questions: Questions.buildSession(lessonId, SESSION_LENGTH),
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
      ? `<div class="options ${q.wideOptions ? 'options-wide' : ''}" role="radiogroup" aria-label="Answer choices">
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
          <p class="eyebrow">Lesson ${lessonId} practice · Question ${index + 1} of ${questions.length}</p>
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
    const needsPractice = results.filter((r) => r.outcome !== 'first');

    // Group the questions needing practice by skill.
    const bySkill = {};
    needsPractice.forEach((r) => { (bySkill[r.q.skill] ||= []).push(r); });

    const headline = incorrect === 0 && needsPractice.length === 0
      ? 'Perfect session! 🌟'
      : correct >= Math.ceil(total * 0.6) ? 'Nice work! 👏' : 'Keep practicing, you\'re learning! 💪';

    show(`
      <section class="card">
        <p class="eyebrow">Lesson ${lessonId} practice · Results</p>
        <h2>${headline}</h2>
        <div class="stats">
          <div class="stat"><span class="stat-value">${score}<small>/${maxScore}</small></span><span class="stat-label">Score</span></div>
          <div class="stat good"><span class="stat-value">${correct}</span><span class="stat-label">Correct</span></div>
          <div class="stat bad"><span class="stat-value">${incorrect}</span><span class="stat-label">Incorrect</span></div>
          <div class="stat"><span class="stat-value">${accuracy}%</span><span class="stat-label">Accuracy</span></div>
        </div>
        <p class="muted small">Score: ${POINTS.first} points for a correct first try, ${POINTS.second} for a correct second try.
          Accuracy: ${correctSubmissions} of ${submissions} answers checked were correct.</p>

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

  document.getElementById('homeBtn').addEventListener('click', renderHome);
  renderHome();
})();
