// Spanish-speaking countries and Puerto Rico, organized for bilingual name and capital practice.
const Spanish = (() => {
  const places = [
    { key: 'argentina', english: 'Argentina', spanish: 'Argentina', capital: 'Buenos Aires' },
    { key: 'bolivia', english: 'Bolivia', spanish: 'Bolivia', capital: 'Sucre', note: 'Sucre is Bolivia’s constitutional capital. La Paz is the seat of government.' },
    { key: 'chile', english: 'Chile', spanish: 'Chile', capital: 'Santiago' },
    { key: 'colombia', english: 'Colombia', spanish: 'Colombia', capital: 'Bogotá' },
    { key: 'costa-rica', english: 'Costa Rica', spanish: 'Costa Rica', capital: 'San José' },
    { key: 'cuba', english: 'Cuba', spanish: 'Cuba', capital: 'La Habana', capitalEnglish: 'Havana' },
    { key: 'dominican-republic', english: 'Dominican Republic', spanish: 'República Dominicana', capital: 'Santo Domingo' },
    { key: 'ecuador', english: 'Ecuador', spanish: 'Ecuador', capital: 'Quito' },
    { key: 'el-salvador', english: 'El Salvador', spanish: 'El Salvador', capital: 'San Salvador' },
    { key: 'equatorial-guinea', english: 'Equatorial Guinea', spanish: 'Guinea Ecuatorial', capital: 'Malabo' },
    { key: 'guatemala', english: 'Guatemala', spanish: 'Guatemala', capital: 'Ciudad de Guatemala', capitalEnglish: 'Guatemala City' },
    { key: 'honduras', english: 'Honduras', spanish: 'Honduras', capital: 'Tegucigalpa' },
    { key: 'mexico', english: 'Mexico', spanish: 'México', capital: 'Ciudad de México', capitalEnglish: 'Mexico City' },
    { key: 'nicaragua', english: 'Nicaragua', spanish: 'Nicaragua', capital: 'Managua' },
    { key: 'panama', english: 'Panama', spanish: 'Panamá', capital: 'Ciudad de Panamá', capitalEnglish: 'Panama City' },
    { key: 'paraguay', english: 'Paraguay', spanish: 'Paraguay', capital: 'Asunción' },
    { key: 'peru', english: 'Peru', spanish: 'Perú', capital: 'Lima' },
    { key: 'puerto-rico', english: 'Puerto Rico', spanish: 'Puerto Rico', capital: 'San Juan', type: 'territory', note: 'Puerto Rico is a U.S. territory, not an independent country.' },
    { key: 'spain', english: 'Spain', spanish: 'España', capital: 'Madrid' },
    { key: 'uruguay', english: 'Uruguay', spanish: 'Uruguay', capital: 'Montevideo' },
    { key: 'venezuela', english: 'Venezuela', spanish: 'Venezuela', capital: 'Caracas' },
  ];

  const countryCards = places.map((place) => ({
    id: `spanish-country:${place.key}`,
    front: place.english,
    back: place.spanish,
    tag: place.type === 'territory' ? 'Territory · English → Spanish' : 'Country · English → Spanish',
  }));

  const capitalCards = places.map((place) => ({
    id: `spanish-capital:${place.key}`,
    front: `What is the capital of ${place.english}? · ¿Cuál es la capital de ${place.spanish}?`,
    back: `${place.capital}${place.capitalEnglish ? ` · ${place.capitalEnglish}` : ''}${place.note ? `<br><span class="muted small">${place.note}</span>` : ''}`,
    tag: place.type === 'territory' ? 'Territory · Name → capital' : 'Country · Name → capital',
  }));

  const challengeCards = places.map((place) => ({
    id: `spanish-capital-challenge:${place.key}`,
    front: place.capital,
    back: `${place.english} · ${place.spanish}${place.note ? `<br><span class="muted small">${place.note}</span>` : ''}`,
    tag: place.type === 'territory' ? 'Territory · Capital → name' : 'Capital → country',
  }));

  const DECKS = [
    {
      key: 'country-names',
      title: 'Country names: English ↔ español',
      short: 'Country names',
      icon: '🌎',
      color: '#d42a3c',
      blurb: 'Recognize the English and Spanish names. Turn on “Definition first” to practice in both directions.',
      cards: countryCards,
    },
    {
      key: 'capitals',
      title: 'Name that capital',
      short: 'Capitals',
      icon: '📍',
      color: '#c2410c',
      blurb: 'Recall each capital from the country name in English and Spanish.',
      cards: capitalCards,
    },
    {
      key: 'capital-challenge',
      title: 'Capital challenge',
      short: 'Challenge',
      icon: '🧭',
      color: '#0f766e',
      blurb: 'See a capital and recall its country or territory in both languages.',
      cards: challengeCards,
    },
  ];

  const regions = {
    north: { spanish: 'América del Norte', english: 'North America' },
    caribbean: { spanish: 'El Caribe', english: 'Caribbean' },
    south: { spanish: 'América del Sur', english: 'South America' },
    europe: { spanish: 'Europa', english: 'Europe' },
    africa: { spanish: 'África', english: 'Africa' },
  };
  // Coordinates locate each country or territory, not its capital.
  const geography = {
    mexico: ['north', '🇲🇽', 23, -102],
    guatemala: ['north', '🇬🇹', 15.5, -90.2],
    honduras: ['north', '🇭🇳', 15, -86.5],
    'el-salvador': ['north', '🇸🇻', 13.8, -88.9],
    nicaragua: ['north', '🇳🇮', 13, -85],
    'costa-rica': ['north', '🇨🇷', 9.7, -84],
    panama: ['north', '🇵🇦', 8.5, -80],
    cuba: ['caribbean', '🇨🇺', 22, -79.5],
    'dominican-republic': ['caribbean', '🇩🇴', 19, -70.7],
    'puerto-rico': ['caribbean', '🇵🇷', 18.2, -66.5],
    colombia: ['south', '🇨🇴', 4, -73],
    venezuela: ['south', '🇻🇪', 8, -66],
    ecuador: ['south', '🇪🇨', -1.5, -78],
    peru: ['south', '🇵🇪', -10, -76],
    bolivia: ['south', '🇧🇴', -17, -65],
    chile: ['south', '🇨🇱', -30, -71],
    argentina: ['south', '🇦🇷', -34, -64],
    paraguay: ['south', '🇵🇾', -23, -58],
    uruguay: ['south', '🇺🇾', -33, -56],
    spain: ['europe', '🇪🇸', 40, -4],
    'equatorial-guinea': ['africa', '🇬🇶', 1.5, 10],
  };

  function locator(place, latitude, longitude) {
    const x = longitude + 180;
    const y = 90 - latitude;
    return `<svg class="geo-map" viewBox="0 0 360 180" role="img" aria-label="Approximate location of ${place.spanish} on a simplified world map">
      <rect width="360" height="180" rx="12" fill="#e0f2f1"/>
      <path d="M0 90H360M180 0V180M90 0V180M270 0V180" stroke="#badbd6" fill="none"/>
      <g fill="#8db6a1" stroke="#fff" stroke-width="1">
        <path d="M12 20L55 12 85 22 120 40 112 55 96 62 82 80 67 70 55 55 35 50Z"/>
        <path d="M82 80L99 84 110 100 120 110 110 132 100 148 90 136 85 110 77 94Z"/>
        <path d="M120 8L145 5 150 25 135 35 125 22Z"/>
        <path d="M170 32L190 25 207 35 200 48 183 55 170 49Z"/>
        <path d="M165 55L190 50 215 65 228 85 215 115 200 125 188 105 178 82 164 73Z"/>
        <path d="M200 25L245 15 290 22 335 40 320 65 295 70 280 90 265 75 245 65 225 50 210 48Z"/>
        <path d="M290 115L320 110 335 130 315 140 292 135Z"/>
      </g>
      <circle cx="${x}" cy="${y}" r="8" fill="#c2410c" fill-opacity=".2"/>
      <circle cx="${x}" cy="${y}" r="3.5" fill="#b83219" stroke="white" stroke-width="1.5"/>
    </svg>`;
  }

  const continentCards = Object.entries(geography).map(([key, [regionKey, flag, latitude, longitude]]) => {
    const place = places.find((entry) => entry.key === key);
    const region = regions[regionKey];
    const identity = `<span class="geo-country" lang="es">País: ${place.spanish}</span>
      <span class="geo-capital" lang="es">Capital: ${place.capital}</span>`;
    const regionName = `${region.spanish} (${region.english})`;
    return {
      id: `spanish-continent:${key}`,
      tag: place.type === 'territory' ? 'Unit 2 · Territory' : 'Unit 2 · Country',
      country: place.spanish,
      capital: place.capital,
      region: regionKey,
      acceptedRegions: regionKey === 'caribbean' ? ['caribbean', 'north'] : [regionKey],
      review: `${flag} ${place.spanish} — ${place.capital} — ${regionName}`,
      front: `<span class="geo-flag" role="img" aria-label="Flag of ${place.spanish}">${flag}</span>
        ${identity}<span class="geo-question" lang="es">¿En qué continente está ${place.spanish}?</span>
        <span class="geo-translation">Which continent is this country in?</span>`,
      back: `<span class="geo-answer"><span lang="es">Continente: ${region.spanish}</span> <span>(${region.english})</span></span>
        ${identity}${locator(place, latitude, longitude)}
        <span class="geo-map-caption">Approximate country location · simplified map</span>
        ${regionKey === 'caribbean' ? '<span class="geo-note">Classroom category: Caribbean. América del Norte (North America) is also correct if your class groups the Caribbean there.</span>' : ''}
        ${place.note ? `<span class="geo-note">${place.note}</span>` : ''}`,
    };
  });

  const UNIT2_DECKS = [{
    key: 'continents',
    title: 'Passport practice: ¿En qué continente?',
    short: 'Continents',
    icon: '🌎',
    color: '#0f766e',
    blurb: 'Read the country and capital, recall its continent, then flip to check.',
    geography: true,
    cards: continentCards,
  }];

  return { places, DECKS, UNIT2_DECKS };
})();
