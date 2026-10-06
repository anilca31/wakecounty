// Flashcard study sessions: flip a card, sort it into "Got it" or "Still learning", and remember mastered cards.
// Mastery is kept in localStorage on this device; falls back to memory if storage is blocked.
const Flashcards = (() => {
  const KEY = 'flashcards.v1';
  let mastered = load();
  let keyHandler = null;

  function load() {
    try {
      const saved = JSON.parse(globalThis.localStorage?.getItem(KEY) || 'null');
      if (saved && typeof saved === 'object') return saved;
    } catch (e) { /* unreadable or blocked: start fresh */ }
    return {};
  }

  function save() {
    try { globalThis.localStorage?.setItem(KEY, JSON.stringify(mastered)); } catch (e) { /* keep in memory only */ }
  }

  const isMastered = (id) => !!mastered[id];
  const masteredCount = (cards) => cards.filter((c) => isMastered(c.id)).length;

  function setMastered(id, on) {
    if (on) mastered[id] = true;
    else delete mastered[id];
    save();
  }

  function reset() {
    mastered = {};
    save();
  }

  // Runs a study session for `deck` ({ title, cards: [{ id, front, back, tag }] }) inside `host`.
  // opts: { onExit() — leave the deck, onDone() — finished a pass, onChange() — mastery changed }
  function study(host, deck, opts = {}) {
    const settings = { shuffle: false, reverse: false, onlyNew: false };
    let queue = [];
    let index = 0;
    let flipped = false;
    let results = {}; // id → 'got' | 'learning'

    function start(cards) {
      const base = cards || deck.cards.filter((c) => !settings.onlyNew || !isMastered(c.id));
      queue = settings.shuffle ? Util.shuffle(base) : base.slice();
      index = 0;
      flipped = false;
      results = {};
      draw();
    }

    const count = (kind) => Object.values(results).filter((r) => r === kind).length;
    const faces = (card) => (settings.reverse ? [card.back, card.front] : [card.front, card.back]);

    function toolbar() {
      const left = deck.cards.length - masteredCount(deck.cards);
      const toggle = (opt, label) => `<button type="button" class="fc-toggle" data-opt="${opt}" aria-pressed="${settings[opt]}">${label}</button>`;
      return `
        <div class="fc-toolbar">
          ${toggle('shuffle', '🔀 Shuffle')}
          ${toggle('reverse', '↔ Definition first')}
          ${toggle('onlyNew', `🎯 Not mastered yet (${left})`)}
        </div>`;
    }

    function draw() {
      if (!queue.length) {
        host.innerHTML = `
          ${toolbar()}
          <div class="fc-empty">
            <p class="empty-icon" aria-hidden="true">🏆</p>
            <h3>You've mastered every card in this deck!</h3>
            <p class="muted">Turn off "Not mastered yet" to review them all again.</p>
          </div>`;
        wireToolbar();
        return;
      }
      if (index >= queue.length) return summary();
      const card = queue[index];
      const [front, back] = faces(card);
      host.innerHTML = `
        ${toolbar()}
        <div class="fc-status">
          <span>Card <strong>${index + 1}</strong> of ${queue.length}</span>
          <span><span class="good-text">✅ ${count('got')}</span> · <span class="hint-text">😅 ${count('learning')}</span></span>
        </div>
        <div class="progress" aria-hidden="true"><div class="progress-bar" style="width:${(index / queue.length) * 100}%"></div></div>
        <button type="button" class="fc-card" aria-label="Flashcard. Press to flip.">
          <span class="fc-inner">
            <span class="fc-face fc-front">
              <span class="fc-tag">${card.tag}${isMastered(card.id) ? ' · ✅ mastered' : ''}</span>
              <span class="fc-text">${front}</span>
              <span class="fc-hint">Tap to flip</span>
            </span>
            <span class="fc-face fc-back" aria-hidden="true">
              <span class="fc-tag">${settings.reverse ? 'Term' : 'Answer'}</span>
              <span class="fc-text fc-text-back">${back}</span>
            </span>
          </span>
        </button>
        <div class="fc-actions" data-when="front">
          <button type="button" class="btn btn-ghost" data-act="prev" ${index === 0 ? 'disabled' : ''}>← Back</button>
          <button type="button" class="btn btn-primary" data-act="flip">Flip card</button>
          <button type="button" class="btn btn-ghost" data-act="skip">Skip →</button>
        </div>
        <div class="fc-actions" data-when="back" hidden>
          <button type="button" class="btn fc-learning" data-act="learning">😅 Still learning</button>
          <button type="button" class="btn btn-primary" data-act="got">✅ Got it</button>
        </div>
        <p class="muted small fc-keys">Keyboard: <kbd>Space</kbd> flip · <kbd>1</kbd> still learning · <kbd>2</kbd> got it · <kbd>←</kbd> <kbd>→</kbd> move</p>`;
      wireToolbar();
      host.querySelector('.fc-card').addEventListener('click', flip);
      host.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => act(b.dataset.act)));
      if (flipped) setFlipped(true);
      else if (index > 0 || Object.keys(results).length) host.querySelector('.fc-card').focus({ preventScroll: true });
    }

    function setFlipped(on) {
      flipped = on;
      const cardEl = host.querySelector('.fc-card');
      if (!cardEl) return;
      cardEl.classList.toggle('is-flipped', on);
      cardEl.querySelector('.fc-front').setAttribute('aria-hidden', String(on));
      cardEl.querySelector('.fc-back').setAttribute('aria-hidden', String(!on));
      host.querySelector('[data-when="front"]').hidden = on;
      host.querySelector('[data-when="back"]').hidden = !on;
      cardEl.focus({ preventScroll: true });
    }

    function flip() { setFlipped(!flipped); }

    function act(kind) {
      const card = queue[index];
      if (kind === 'flip') return flip();
      if (kind === 'prev') { if (index > 0) { index--; flipped = false; draw(); } return; }
      if (kind === 'skip') { index++; flipped = false; return draw(); }
      if (!flipped) return;
      results[card.id] = kind;
      setMastered(card.id, kind === 'got');
      opts.onChange?.();
      index++;
      flipped = false;
      draw();
    }

    function summary() {
      const got = count('got');
      const learning = queue.filter((c) => results[c.id] === 'learning');
      const total = deck.cards.length;
      const done = masteredCount(deck.cards);
      host.innerHTML = `
        <div class="fc-summary">
          <p class="empty-icon" aria-hidden="true">${learning.length ? '💪' : '🌟'}</p>
          <h3>${learning.length ? 'Nice work! Keep going.' : 'Perfect round!'}</h3>
          <div class="stats">
            <div class="stat good"><span class="stat-value">${got}</span><span class="stat-label">Got it</span></div>
            <div class="stat"><span class="stat-value">${learning.length}</span><span class="stat-label">Still learning</span></div>
            <div class="stat"><span class="stat-value">${done}<small>/${total}</small></span><span class="stat-label">Deck mastered</span></div>
          </div>
          <div class="actions">
            ${learning.length ? `<button type="button" class="btn btn-primary" data-sum="learning">Study the ${learning.length} I'm still learning</button>` : ''}
            <button type="button" class="btn btn-secondary" data-sum="again">Start the deck over</button>
            <button type="button" class="btn btn-ghost" data-sum="exit">← Back to unit</button>
          </div>
        </div>`;
      host.querySelector('[data-sum="learning"]')?.addEventListener('click', () => start(learning));
      host.querySelector('[data-sum="again"]').addEventListener('click', () => start());
      host.querySelector('[data-sum="exit"]').addEventListener('click', () => opts.onExit?.());
      opts.onDone?.();
    }

    function wireToolbar() {
      host.querySelectorAll('[data-opt]').forEach((b) => b.addEventListener('click', () => {
        settings[b.dataset.opt] = !settings[b.dataset.opt];
        if (b.dataset.opt === 'reverse') { flipped = false; draw(); } else start();
      }));
    }

    // One keyboard handler at a time; it removes itself once this deck leaves the page.
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = (e) => {
      if (!host.isConnected) { document.removeEventListener('keydown', keyHandler); keyHandler = null; return; }
      if (e.target.closest?.('input, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (!host.querySelector('.fc-card')) return;
      const keys = { ' ': 'flip', Enter: 'flip', 1: 'learning', 2: 'got', ArrowLeft: 'prev', ArrowRight: 'skip' };
      const kind = keys[e.key];
      if (!kind) return;
      // Let Enter/Space on a focused button act as a normal click.
      if ((e.key === ' ' || e.key === 'Enter') && e.target.closest?.('button')) return;
      e.preventDefault();
      act(kind);
    };
    document.addEventListener('keydown', keyHandler);

    start();
  }

  return { study, isMastered, masteredCount, reset };
})();
