// "Slam dunk" celebration: a kid jumps and dunks a basketball in the corner of the screen.
// Plays when a section is completed. Purely decorative; it never blocks clicks.
const Celebrate = (() => {
  const DURATION = 3600; // ms on screen, including the fade-out

  // The kid is drawn with feet at (0, 0); CSS keyframes move the whole group.
  const KID = `
    <g class="dunk-kid-body">
      <ellipse cx="-8" cy="0" rx="6" ry="3" fill="#ffffff"/>
      <ellipse cx="8" cy="0" rx="6" ry="3" fill="#ffffff"/>
      <line x1="-5" y1="-28" x2="-8" y2="-2" stroke="#8d5524" stroke-width="5" stroke-linecap="round"/>
      <line x1="5" y1="-28" x2="8" y2="-2" stroke="#8d5524" stroke-width="5" stroke-linecap="round"/>
      <rect x="-11" y="-36" width="22" height="11" rx="3" fill="#ffffff"/>
      <line x1="-8" y1="-54" x2="5" y2="-86" stroke="#8d5524" stroke-width="5" stroke-linecap="round"/>
      <line x1="8" y1="-54" x2="13" y2="-86" stroke="#8d5524" stroke-width="5" stroke-linecap="round"/>
      <rect x="-11" y="-60" width="22" height="27" rx="5" fill="#1ed760"/>
      <text x="0" y="-41" text-anchor="middle" font-size="13" font-weight="900" fill="#000">6</text>
      <circle cx="0" cy="-70" r="10" fill="#8d5524"/>
      <path d="M-10 -72 Q-9 -84 0 -83 Q10 -84 10 -72 Q5 -78 -10 -72Z" fill="#2b1a0e"/>
      <circle cx="4" cy="-70" r="1.4" fill="#000"/>
      <path d="M1 -65 Q4 -62 7 -65" stroke="#000" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    </g>`;

  const BALL = `
    <circle r="8" fill="#f08c00" stroke="#7a3d00" stroke-width="1.2"/>
    <path d="M-8 0 H8 M0 -8 V8 M-5.5 -5.5 Q0 0 -5.5 5.5 M5.5 -5.5 Q0 0 5.5 5.5" stroke="#7a3d00" stroke-width="1" fill="none"/>`;

  const SCENE = `
    <svg class="dunk-svg" viewBox="0 0 200 200" aria-hidden="true">
      <line x1="0" y1="186" x2="200" y2="186" stroke="#3a3a3a" stroke-width="3"/>
      <rect x="183" y="30" width="5" height="156" fill="#555"/>
      <rect x="164" y="28" width="8" height="56" rx="2" fill="#e8e8e8"/>
      <g class="dunk-hoop">
        <path d="M134 74 L138 98 M142 74 L144 98 M150 74 L150 98 M158 74 L156 98 M164 74 L160 98 M138 98 H160"
              stroke="#d9d9d9" stroke-width="1.4" fill="none"/>
        <line x1="130" y1="73" x2="166" y2="73" stroke="#ff4d2e" stroke-width="4" stroke-linecap="round"/>
      </g>
      <g transform="translate(30 185)"><g class="dunk-kid">${KID}</g></g>
      <g transform="translate(40 93)"><g class="dunk-ball">${BALL}</g></g>
      <text class="dunk-text" x="82" y="40" text-anchor="middle">SLAM DUNK!</text>
    </svg>`;

  let timer = null;

  function play(message = 'Section complete!') {
    document.querySelector('.dunk')?.remove();
    clearTimeout(timer);
    const el = document.createElement('div');
    el.className = 'dunk';
    el.setAttribute('role', 'status');
    el.innerHTML = `${SCENE}<p class="dunk-caption">🏀 ${message}</p>`;
    document.body.appendChild(el);
    timer = setTimeout(() => el.remove(), DURATION);
  }

  return { play };
})();
