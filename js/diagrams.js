// SVG ratio diagrams, generated entirely from data ({ a, b, itemA, itemB, layout }).
const Diagrams = (() => {
  // Each object kind has a distinct colour AND shape so diagrams are readable without colour vision.
  const ITEMS = {
    red:    { key: 'red',    name: 'red circles',     single: 'red circle',     color: '#e5484d', shape: 'circle' },
    blue:   { key: 'blue',   name: 'blue squares',    single: 'blue square',    color: '#2f7ae5', shape: 'square' },
    green:  { key: 'green',  name: 'green triangles', single: 'green triangle', color: '#2e9e5b', shape: 'triangle' },
    orange: { key: 'orange', name: 'orange stars',    single: 'orange star',    color: '#f08c00', shape: 'star' },
    purple: { key: 'purple', name: 'purple diamonds', single: 'purple diamond', color: '#8e4ec6', shape: 'diamond' },
  };
  const ITEM_KEYS = Object.keys(ITEMS);

  const CELL = 40;    // grid cell size in SVG units
  const R = 14;       // shape "radius"
  const PER_ROW = 5;  // objects per row inside a group
  const GROUP_GAP = 36;

  function shape(item, cx, cy, extra = '') {
    const fill = `fill="${item.color}" stroke="rgba(0,0,0,.28)" stroke-width="1.5" ${extra}`;
    switch (item.shape) {
      case 'circle':
        return `<circle cx="${cx}" cy="${cy}" r="${R}" ${fill}/>`;
      case 'square':
        return `<rect x="${cx - R + 1}" y="${cy - R + 1}" width="${2 * R - 2}" height="${2 * R - 2}" rx="3" ${fill}/>`;
      case 'triangle':
        return `<polygon points="${cx},${cy - R} ${cx + R},${cy + R - 2} ${cx - R},${cy + R - 2}" ${fill}/>`;
      case 'diamond':
        return `<polygon points="${cx},${cy - R} ${cx + R},${cy} ${cx},${cy + R} ${cx - R},${cy}" ${fill}/>`;
      case 'star': {
        const pts = [];
        for (let i = 0; i < 10; i++) {
          const rad = i % 2 === 0 ? R + 1 : R * 0.45;
          const ang = -Math.PI / 2 + (i * Math.PI) / 5;
          pts.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`);
        }
        return `<polygon points="${pts.join(' ')}" ${fill}/>`;
      }
      default:
        return '';
    }
  }

  function label(a, b, itemA, itemB) {
    return `Diagram showing ${a} ${a === 1 ? itemA.single : itemA.name} and ${b} ${b === 1 ? itemB.single : itemB.name}`;
  }

  function svgWrap(w, h, body, aria, cls = '') {
    return `<svg class="diagram ${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${aria}" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
  }

  // Draws one group as a block of rows; returns { body, w, h }.
  function groupBlock(n, item, x0, y0, dataAttr) {
    const cols = Math.max(1, Math.min(n, PER_ROW));
    const rows = Math.max(1, Math.ceil(n / PER_ROW));
    let body = '';
    for (let i = 0; i < n; i++) {
      const cx = x0 + (i % PER_ROW) * CELL + CELL / 2;
      const cy = y0 + Math.floor(i / PER_ROW) * CELL + CELL / 2;
      body += shape(item, cx, cy, dataAttr ? `data-obj="${dataAttr}" data-i="${i}"` : '');
    }
    return { body, w: cols * CELL, h: rows * CELL };
  }

  // Two separate groups side by side: [A A A]   [B B]
  function grouped({ a, b, itemA, itemB, countable = false }) {
    const pad = 6;
    const blockA = groupBlock(a, itemA, pad, pad, countable ? 'a' : null);
    const xB = pad + blockA.w + (a > 0 ? GROUP_GAP : 0);
    const blockB = groupBlock(b, itemB, xB, pad, countable ? 'b' : null);
    const w = xB + (b > 0 ? blockB.w : 0) + pad;
    const h = Math.max(blockA.h, blockB.h, CELL) + pad * 2;
    return svgWrap(w, h, blockA.body + blockB.body, label(a, b, itemA, itemB));
  }

  // Objects mixed together in a grid, in the given order (array of 'a' / 'b').
  function mixed({ a, b, itemA, itemB, order, countable = false }) {
    const seq = order || Util.shuffle([...Array(a).fill('a'), ...Array(b).fill('b')]);
    const cols = Math.min(seq.length, 6);
    const rows = Math.ceil(seq.length / cols);
    const pad = 6;
    let body = '';
    const counters = { a: 0, b: 0 };
    seq.forEach((k, i) => {
      const cx = pad + (i % cols) * CELL + CELL / 2;
      const cy = pad + Math.floor(i / cols) * CELL + CELL / 2;
      const attr = countable ? `data-obj="${k}" data-i="${counters[k]++}"` : '';
      body += shape(k === 'a' ? itemA : itemB, cx, cy, attr);
    });
    return svgWrap(cols * CELL + pad * 2, rows * CELL + pad * 2, body, label(a, b, itemA, itemB));
  }

  // One row per quantity: A on top, B below, lined up from the left.
  function rows({ a, b, itemA, itemB }) {
    const pad = 6;
    const cols = Math.max(a, b, 1);
    let body = '';
    for (let i = 0; i < a; i++) body += shape(itemA, pad + i * CELL + CELL / 2, pad + CELL / 2);
    for (let i = 0; i < b; i++) body += shape(itemB, pad + i * CELL + CELL / 2, pad + CELL * 1.5);
    return svgWrap(cols * CELL + pad * 2, CELL * 2 + pad * 2, body, label(a, b, itemA, itemB));
  }

  // Tape diagram: a strip of equal boxes per quantity, with a text label.
  function tape({ a, b, itemA, itemB }) {
    const pad = 6;
    const labelW = 70;
    const box = 34;
    const cols = Math.max(a, b, 1);
    let body = '';
    const row = (n, item, y, text) => {
      body += `<text x="${pad}" y="${y + box / 2 + 5}" class="tape-label">${text}</text>`;
      for (let i = 0; i < n; i++) {
        body += `<rect x="${pad + labelW + i * box}" y="${y}" width="${box}" height="${box}" fill="${item.color}" fill-opacity=".85" stroke="var(--ink)" stroke-width="1.5"/>`;
      }
    };
    const shortName = (item) => item.name.split(' ')[0];
    row(a, itemA, pad, shortName(itemA));
    row(b, itemB, pad + box + 10, shortName(itemB));
    return svgWrap(pad * 2 + labelW + cols * box, pad * 2 + box * 2 + 10, body, label(a, b, itemA, itemB), 'tape');
  }

  function render(spec) {
    const d = { ...spec, itemA: resolve(spec.itemA), itemB: resolve(spec.itemB) };
    switch (spec.layout) {
      case 'mixed': return mixed(d);
      case 'rows': return rows(d);
      case 'tape': return tape(d);
      default: return grouped(d);
    }
  }

  function resolve(item) {
    return typeof item === 'string' ? ITEMS[item] : item;
  }

  // Small inline legend chip, e.g. [● red circles]
  function chip(itemKey) {
    const item = resolve(itemKey);
    const icon = svgWrap(2 * R + 4, 2 * R + 4, shape(item, R + 2, R + 2), '', 'chip-icon');
    return `<span class="chip">${icon}<span>${item.name}</span></span>`;
  }

  return { ITEMS, ITEM_KEYS, render, chip, resolve };
})();
