// Small shared helpers. Everything hangs off window so the app runs from file:// with no build step.
const Util = (() => {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Two different items from a list.
  function pickTwo(arr) {
    const [x, y] = shuffle(arr);
    return [x, y];
  }

  // Two different counts in [min, max].
  function twoCounts(min, max) {
    const a = randInt(min, max);
    let b = randInt(min, max);
    while (b === a) b = randInt(min, max);
    return [a, b];
  }

  // Parses "3:2", "3 : 2", "3 to 2", "3/2". Returns [x, y] or null.
  function parseRatio(str) {
    if (typeof str !== 'string') return null;
    const m = str.trim().toLowerCase().match(/^(\d+)\s*(?::|\/|to)\s*(\d+)$/);
    if (!m) return null;
    return [parseInt(m[1], 10), parseInt(m[2], 10)];
  }

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  return { randInt, pick, shuffle, pickTwo, twoCounts, parseRatio, gcd, escapeHtml };
})();
