// Saved progress: which lessons were read to the end, and every finished practice session.
// Kept in localStorage on this device; falls back to memory if storage is blocked (private window, file:// quirks).
const Progress = (() => {
  const KEY = 'studyProgress.v1';
  const empty = () => ({ learned: {}, sessions: [] });
  let data = load();

  function load() {
    try {
      const saved = JSON.parse(globalThis.localStorage?.getItem(KEY) || 'null');
      if (saved && saved.learned && Array.isArray(saved.sessions)) return saved;
    } catch (e) { /* unreadable or blocked: start fresh */ }
    return empty();
  }

  function save() {
    try { globalThis.localStorage?.setItem(KEY, JSON.stringify(data)); } catch (e) { /* keep in memory only */ }
  }

  function markLearned(lessonId) {
    if (data.learned[lessonId]) return;
    data.learned[lessonId] = true;
    save();
  }

  // record: { lessonId, total, correct, missed }
  function addSession(record) {
    data.sessions.push({ ...record, date: new Date().toISOString() });
    save();
  }

  const isLearned = (lessonId) => !!data.learned[lessonId];
  const sessionsFor = (lessonId) => data.sessions.filter((s) => s.lessonId === lessonId);
  const allSessions = () => data.sessions.slice();
  const percent = (s) => (s.total ? Math.round((s.correct / s.total) * 100) : 0);

  // Each lesson has two parts to complete: read the lesson, and finish a practice session.
  function completion(lessons) {
    const total = lessons.length * 2;
    const done = lessons.reduce((n, l) => n + (isLearned(l.id) ? 1 : 0) + (sessionsFor(l.id).length ? 1 : 0), 0);
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function reset() {
    data = empty();
    save();
  }

  return { markLearned, addSession, isLearned, sessionsFor, allSessions, percent, completion, reset };
})();
