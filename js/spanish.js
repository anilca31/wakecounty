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

  return { places, DECKS };
})();
