// A simplified physical map of South Asia drawn from real latitude/longitude points, with a working scale bar.
// Projection: equirectangular, with longitude squeezed by cos(20°) so distances read correctly near the middle of India.
// Map distances are what a student would measure with a ruler and the scale bar (accurate to within a few percent).
const SouthAsiaMap = (() => {
  const W_LON = 62;
  const E_LON = 98;
  const N_LAT = 37;
  const S_LAT = 5;
  const K = 16; // SVG units per degree of latitude
  const SQUEEZE = Math.cos((20 * Math.PI) / 180);
  const MILES_PER_DEG = 69.17;
  const MILES_PER_UNIT = MILES_PER_DEG / K;
  const SCALE_MILES = 200;
  const PAD = 0;
  const WIDTH = (E_LON - W_LON) * SQUEEZE * K;
  const HEIGHT = (N_LAT - S_LAT) * K;

  const project = (lon, lat) => [PAD + (lon - W_LON) * SQUEEZE * K, PAD + (N_LAT - lat) * K];
  const unproject = (x, y) => [W_LON + (x - PAD) / (SQUEEZE * K), N_LAT - (y - PAD) / K];
  const pts = (list) => list.map(([lon, lat]) => project(lon, lat).map((v) => v.toFixed(1)).join(',')).join(' ');

  // Miles between two [lon, lat] points, measured on this map.
  function miles(a, b) {
    const dx = (b[0] - a[0]) * SQUEEZE;
    const dy = b[1] - a[1];
    return Math.hypot(dx, dy) * MILES_PER_DEG;
  }

  // ---------- Geography (lon, lat) ----------
  const LAND = [
    [62, 37], [98, 37], [98, 16.4], [97.6, 16.5], [96.3, 16.7], [95.4, 15.8], [94.25, 16], [94.6, 17.5], [94.2, 18.8],
    [92.9, 20.1], [92.3, 20.8], [91.97, 21.45], [91.8, 22.3], [91.5, 22.6], [91, 22.8], [90.6, 22.3], [90, 21.9],
    [89, 21.7], [88.1, 21.65], [87.4, 21.6], [87, 21.45], [86.7, 20.3], [86.3, 19.95], [85.8, 19.8], [85, 19.3],
    [84.2, 18.4], [83.3, 17.7], [82.3, 16.95], [81.7, 16.3], [81.15, 16.15], [80.9, 15.75], [80.3, 15.4],
    [80.15, 14.5], [80.3, 13.1], [79.85, 11.93], [79.85, 10.75], [79.87, 10.3], [79.3, 10.3], [79.2, 9.3],
    [78.9, 9.25], [78.15, 8.75], [77.55, 8.08], [76.95, 8.5], [76.25, 9.95], [75.75, 11.25], [74.85, 12.9],
    [74.4, 14.5], [73.8, 15.4], [73.3, 17], [72.85, 19], [72.7, 20.2], [72.7, 21.1], [72.6, 22.2], [72.15, 21.75],
    [71.4, 20.85], [70.95, 20.7], [70.35, 20.9], [69.6, 21.65], [68.95, 22.3], [69.6, 22.55], [70.2, 22.95],
    [69.7, 22.8], [68.9, 23.05], [68.5, 23.5], [68.2, 23.7], [67.6, 23.9], [67.2, 24.4], [66.95, 24.8], [66.6, 25.4],
    [64.6, 25.2], [62.35, 25.1], [62, 25.15],
  ];
  const SRI_LANKA = [
    [80.0, 9.8], [80.25, 9.6], [80.9, 9.0], [81.2, 8.6], [81.7, 7.7], [81.9, 7.0], [81.6, 6.4], [80.6, 5.92],
    [80.2, 6.03], [79.85, 6.93], [79.8, 8.0], [79.9, 9.0],
  ];
  const RIVERS = {
    indus: { name: 'Indus River', path: [[81.3, 31.1], [79.5, 32.6], [77.6, 34.1], [76, 34.9], [74.6, 35.5], [73.2, 35.3], [72.8, 34.3], [72.2, 33.9], [71.6, 32.9], [71, 30.9], [70.3, 29.2], [68.9, 27.6], [68.3, 25.4], [67.6, 24.2], [67.4, 23.95]], label: [69.6, 28.6] },
    ganges: { name: 'Ganges River', path: [[78.9, 30.95], [78.2, 29.95], [79.4, 27.6], [80.35, 26.45], [81.85, 25.45], [83, 25.3], [85.15, 25.6], [86.9, 25.3], [87.9, 24.8], [88.7, 24.2], [89.6, 23.8], [90.3, 23.2], [90.6, 22.3]], label: [82.2, 24.6] },
    brahmaputra: { name: 'Brahmaputra River', path: [[82.5, 30.3], [85, 29.3], [88.5, 29.3], [91, 29.3], [94, 29.5], [95.2, 28.6], [95, 27.8], [93.8, 26.9], [91.7, 26.2], [90, 25.9], [89.7, 25.1], [89.8, 23.9]], label: [89.8, 30.0] },
  };
  const RANGES = {
    himalayas: { name: 'Himalayas', peaks: [[73, 35.6], [75, 34.9], [77, 33.4], [78.8, 31.6], [80.6, 30.3], [82.5, 29.4], [84.4, 28.6], [86.2, 28.2], [88, 28], [89.8, 28], [91.6, 28.1], [93.4, 28.3]], label: [84.2, 31.4] },
    hinduKush: { name: 'Hindu Kush', peaks: [[68.6, 35.1], [69.8, 35.6], [71, 36.1]], label: [66.4, 34.4] },
    westernGhats: { name: 'Western Ghats', peaks: [[73.9, 19.5], [73.9, 18], [74.1, 16.5], [74.6, 15], [75.2, 13.4], [75.8, 11.9], [76.6, 10.4], [77.2, 9.2]], label: [69.4, 14.4] },
    easternGhats: { name: 'Eastern Ghats', peaks: [[79.2, 13.4], [79.5, 14.8], [80.4, 16.4], [81.8, 17.6], [83.2, 18.7], [84.4, 19.9]], label: [84.6, 13.8] },
  };
  const AREAS = {
    arabianSea: { name: 'Arabian Sea', at: [65.5, 16], cls: 'water' },
    bayOfBengal: { name: 'Bay of Bengal', at: [88.6, 16], cls: 'water' },
    indianOcean: { name: 'Indian Ocean', at: [87.5, 7.2], cls: 'water' },
    deccan: { name: 'Deccan Plateau', at: [77.6, 17.6], cls: 'land' },
    thar: { name: 'Thar Desert', at: [71.4, 27.1], cls: 'land' },
    sriLanka: { name: 'Sri Lanka', at: [83.9, 6.2], cls: 'land' },
  };

  // Places used for measuring and for practice questions.
  const PLACES = {
    indusMouth: { name: 'mouth of the Indus River', short: 'Indus mouth', at: [67.4, 23.95] },
    gangesMouth: { name: 'mouth of the Ganges River', short: 'Ganges mouth', at: [90.6, 22.3] },
    everest: { name: 'Mount Everest', short: 'Mt. Everest', at: [86.93, 27.99] },
    karachi: { name: 'Karachi', at: [67.0, 24.86] },
    lahore: { name: 'Lahore', at: [74.35, 31.55] },
    delhi: { name: 'Delhi', at: [77.2, 28.6] },
    mumbai: { name: 'Mumbai', at: [72.88, 19.08] },
    kolkata: { name: 'Kolkata', at: [88.36, 22.57] },
    chennai: { name: 'Chennai', at: [80.27, 13.08] },
    bengaluru: { name: 'Bengaluru', at: [77.59, 12.97] },
    hyderabad: { name: 'Hyderabad', at: [78.47, 17.39] },
    kathmandu: { name: 'Kathmandu', at: [85.32, 27.72] },
    dhaka: { name: 'Dhaka', at: [90.41, 23.81] },
    colombo: { name: 'Colombo', at: [79.86, 6.93] },
    kanyakumari: { name: 'Kanyakumari (southern tip of India)', short: 'Kanyakumari', at: [77.55, 8.08] },
  };

  // Ready-made measurements for the lesson.
  const PRESETS = [
    { key: 'rivers', label: 'Indus mouth → Ganges mouth', a: PLACES.indusMouth.at, b: PLACES.gangesMouth.at },
    { key: 'w20', label: 'Width of India at 20°N', a: [72.7, 20], b: [86.25, 20] },
    { key: 'w10', label: 'Width of India at 10°N', a: [76.22, 10], b: [79.85, 10] },
    { key: 'slW', label: 'Sri Lanka, east to west', a: [79.8, 7.8], b: [81.85, 7.8] },
    { key: 'slL', label: 'Sri Lanka, north to south', a: [80.05, 9.8], b: [80.05, 5.95] },
    { key: 'delhiKolkata', label: 'Delhi → Kolkata', a: PLACES.delhi.at, b: PLACES.kolkata.at },
  ];

  const roundTo = (n, step) => Math.round(n / step) * step;

  // ---------- Drawing ----------
  const [scaleX, scaleY] = [18, HEIGHT - 22];
  const SCALE_LEN = SCALE_MILES / MILES_PER_UNIT;

  function scaleBar() {
    const x2 = scaleX + SCALE_LEN;
    return `
      <g class="map-scale">
        <rect x="${scaleX - 8}" y="${scaleY - 26}" width="${SCALE_LEN + 52}" height="42" rx="6" class="map-panel"/>
        <line x1="${scaleX}" y1="${scaleY}" x2="${x2}" y2="${scaleY}"/>
        <line x1="${scaleX}" y1="${scaleY - 6}" x2="${scaleX}" y2="${scaleY + 6}"/>
        <line x1="${scaleX + SCALE_LEN / 2}" y1="${scaleY - 4}" x2="${scaleX + SCALE_LEN / 2}" y2="${scaleY + 4}"/>
        <line x1="${x2}" y1="${scaleY - 6}" x2="${x2}" y2="${scaleY + 6}"/>
        <text x="${scaleX}" y="${scaleY - 10}" text-anchor="middle">0</text>
        <text x="${x2}" y="${scaleY - 10}" text-anchor="middle">200 miles</text>
      </g>`;
  }

  function compass() {
    const [cx, cy] = [WIDTH - 34, HEIGHT - 44];
    return `
      <g class="map-compass" transform="translate(${cx} ${cy})">
        <circle r="24" class="map-panel"/>
        <polygon points="0,-18 5,0 0,18 -5,0" class="needle"/>
        <polygon points="-18,0 0,4 18,0 0,-4" class="needle-ew"/>
        <text y="-25" text-anchor="middle">N</text>
      </g>`;
  }

  function grid() {
    let g = '<g class="map-grid">';
    for (let lat = 10; lat <= 35; lat += 5) {
      const [, y] = project(W_LON, lat);
      g += `<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}"/><text x="${WIDTH - 4}" y="${y - 4}" text-anchor="end">${lat}°N</text>`;
    }
    for (let lon = 65; lon <= 95; lon += 5) {
      const [x] = project(lon, N_LAT);
      g += `<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}"/><text x="${x + 3}" y="12">${lon}°E</text>`;
    }
    return `${g}</g>`;
  }

  // Mountain range as a row of little peaks.
  const peaks = (list) => list.map(([lon, lat]) => {
    const [x, y] = project(lon, lat);
    return `<path d="M${(x - 7).toFixed(1)} ${(y + 4).toFixed(1)} L${x.toFixed(1)} ${(y - 6).toFixed(1)} L${(x + 7).toFixed(1)} ${(y + 4).toFixed(1)}"/>`;
  }).join('');

  const textAt = ([lon, lat], text, cls = '') => {
    const [x, y] = project(lon, lat);
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="${cls}" text-anchor="middle">${text}</text>`;
  };

  // opts: { labels: true | false, markers: [{ at, label, kind }], line: [a, b], grid: true, id }
  // With labels false, every feature label is still drawn but hidden until the container shows it (data-key).
  function render({ labels = true, markers = [], line = null, gridLines = true, aria = 'Map of South Asia' } = {}) {
    const lbl = (key, inner) => `<g class="map-label ${labels ? 'is-on' : ''}" data-key="${key}">${inner}</g>`;
    let body = `<rect width="${WIDTH}" height="${HEIGHT}" class="map-ocean"/>`;
    body += `<polygon points="${pts(LAND)}" class="map-land"/><polygon points="${pts(SRI_LANKA)}" class="map-land"/>`;
    if (gridLines) body += grid();
    Object.entries(RANGES).forEach(([key, r]) => {
      body += `<g class="map-range" data-key="${key}">${peaks(r.peaks)}</g>`;
      body += lbl(key, textAt(r.label, r.name, 'map-text'));
    });
    Object.entries(RIVERS).forEach(([key, r]) => {
      body += `<polyline points="${pts(r.path)}" class="map-river" data-key="${key}"/>`;
      body += lbl(key, textAt(r.label, r.name, 'map-text river-text'));
    });
    Object.entries(AREAS).forEach(([key, a]) => { body += lbl(key, textAt(a.at, a.name, `map-text ${a.cls}-text`)); });
    const [ex, ey] = project(...PLACES.everest.at);
    body += `<polygon points="${ex},${ey - 8} ${ex + 6},${ey + 3} ${ex - 6},${ey + 3}" class="map-everest"/>`;
    body += lbl('everest', `<text x="${ex + 8}" y="${ey + 14}" class="map-text">Mt. Everest</text>`);
    if (line) {
      const [x1, y1] = project(...line[0]);
      const [x2, y2] = project(...line[1]);
      body += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="map-measure"/>`;
    }
    markers.forEach((m) => {
      const [x, y] = project(...m.at);
      if (m.kind === 'letter') {
        body += `<circle cx="${x}" cy="${y}" r="11" class="map-letter"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" class="map-letter-text">${m.label}</text>`;
      } else {
        const right = x < WIDTH - 110;
        body += `<circle cx="${x}" cy="${y}" r="5" class="map-dot"/><text x="${x + (right ? 9 : -9)}" y="${y - 7}" text-anchor="${right ? 'start' : 'end'}" class="map-place">${m.label}</text>`;
      }
    });
    body += scaleBar() + compass();
    body += '<g class="map-ruler"></g>';
    return `<svg class="sa-map" viewBox="0 0 ${WIDTH.toFixed(0)} ${HEIGHT}" role="img" aria-label="${aria}">${body}</svg>`;
  }

  // Interactive ruler: tap two points; reports { miles, bars }. Presets draw a known measurement.
  function attachRuler(svg, onMeasure) {
    const layer = svg.querySelector('.map-ruler');
    let start = null;
    const toMap = (e) => {
      const p = svg.createSVGPoint();
      p.x = e.clientX;
      p.y = e.clientY;
      const q = p.matrixTransform(svg.getScreenCTM().inverse());
      return unproject(q.x, q.y);
    };
    function draw(a, b) {
      const [x1, y1] = project(...a);
      const pt = (x, y) => `<circle cx="${x}" cy="${y}" r="5" class="ruler-dot"/>`;
      if (!b) {
        layer.innerHTML = pt(x1, y1);
        return;
      }
      const [x2, y2] = project(...b);
      const m = miles(a, b);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const text = `≈ ${roundTo(m, 10)} mi`;
      layer.innerHTML = `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ruler-line"/>${pt(x1, y1)}${pt(x2, y2)}
        <rect x="${mx - 38}" y="${my - 24}" width="76" height="20" rx="10" class="ruler-tag"/>
        <text x="${mx}" y="${my - 10}" text-anchor="middle" class="ruler-text">${text}</text>`;
      onMeasure({ miles: m, bars: m / SCALE_MILES, a, b });
    }
    svg.addEventListener('click', (e) => {
      const at = toMap(e);
      if (!start) {
        start = at;
        draw(start);
        onMeasure(null);
      } else {
        draw(start, at);
        start = null;
      }
    });
    return { show: (a, b) => { start = null; draw(a, b); } };
  }

  // Compass direction (N, NE, …) from a to b, plus how far (in degrees) the bearing is from that direction's center.
  const DIRS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  function direction(a, b) {
    const dx = (b[0] - a[0]) * SQUEEZE;
    const dy = b[1] - a[1];
    const bearing = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
    const i = Math.round(bearing / 45) % 8;
    return { dir: DIRS[i], index: i, off: Math.abs(((bearing - i * 45 + 540) % 360) - 180) };
  }

  return {
    render, attachRuler, miles, direction, project, unproject, roundTo,
    PLACES, PRESETS, RIVERS, RANGES, AREAS, DIRS, SCALE_MILES, SCALE_LEN, MILES_PER_UNIT,
    bounds: { W_LON, E_LON, N_LAT, S_LAT },
  };
})();
