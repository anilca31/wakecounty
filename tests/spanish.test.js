// Run with: node tests/spanish.test.js
// Validates Spanish country/territory data and all flashcard deck shapes.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ctx = vm.createContext({ Math, console });
const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'spanish.js'), 'utf8');
vm.runInContext(`${source}\n;globalThis.Spanish = Spanish;`, ctx);
const { places, DECKS, UNIT2_DECKS } = ctx.Spanish;

assert.strictEqual(places.length, 21, '20 countries plus Puerto Rico');
assert.strictEqual(places.filter((place) => place.type !== 'territory').length, 20);
assert.strictEqual(places.filter((place) => place.type === 'territory').map((place) => place.key).join(','), 'puerto-rico');
assert.strictEqual(new Set(places.map((place) => place.key)).size, 21, 'place keys are unique');
assert.ok(places.every((place) => place.english && place.spanish && place.capital), 'every place has bilingual names and a capital');

assert.deepStrictEqual(Array.from(DECKS, (deck) => deck.key), ['country-names', 'capitals', 'capital-challenge']);
for (const deck of DECKS) {
  assert.strictEqual(deck.cards.length, 21, `${deck.key} has one card per country or territory`);
  assert.strictEqual(new Set(deck.cards.map((card) => card.id)).size, 21, `${deck.key} card ids are unique`);
  assert.ok(deck.cards.every((card) => card.front.trim() && card.back.trim() && card.tag), `${deck.key} cards have both sides and a tag`);
}

const countryCard = DECKS[0].cards.find((card) => card.id.endsWith(':spain'));
assert.strictEqual(countryCard.front, 'Spain');
assert.strictEqual(countryCard.back, 'España');
const boliviaCard = DECKS[1].cards.find((card) => card.id.endsWith(':bolivia'));
assert.match(boliviaCard.back, /Sucre/);
assert.match(boliviaCard.back, /La Paz/);
const puertoRicoCard = DECKS[1].cards.find((card) => card.id.endsWith(':puerto-rico'));
assert.match(puertoRicoCard.back, /territory/);

assert.strictEqual(UNIT2_DECKS.length, 1);
const geographyDeck = UNIT2_DECKS[0];
assert.strictEqual(geographyDeck.geography, true);
assert.strictEqual(geographyDeck.cards.length, 21);
assert.strictEqual(new Set(geographyDeck.cards.map((card) => card.id)).size, 21);
const expectedGroups = {
  north: ['mexico', 'guatemala', 'honduras', 'el-salvador', 'nicaragua', 'costa-rica', 'panama'],
  caribbean: ['cuba', 'dominican-republic', 'puerto-rico'],
  south: ['colombia', 'venezuela', 'ecuador', 'peru', 'bolivia', 'chile', 'argentina', 'paraguay', 'uruguay'],
  europe: ['spain'],
  africa: ['equatorial-guinea'],
};
const expectedLabels = {
  north: ['América del Norte', 'North America'],
  caribbean: ['El Caribe', 'Caribbean'],
  south: ['América del Sur', 'South America'],
  europe: ['Europa', 'Europe'],
  africa: ['África', 'Africa'],
};
for (const [region, keys] of Object.entries(expectedGroups)) {
  for (const key of keys) {
    const card = geographyDeck.cards.find((entry) => entry.id === `spanish-continent:${key}`);
    const place = places.find((entry) => entry.key === key);
    assert.ok(card, `${key} has a geography card`);
    assert.strictEqual(card.region, region, `${key} uses its classroom category`);
    assert.deepStrictEqual(Array.from(card.acceptedRegions), region === 'caribbean' ? ['caribbean', 'north'] : [region]);
    assert.strictEqual(card.country, place.spanish);
    assert.strictEqual(card.capital, place.capital);
    for (const side of [card.front, card.back]) {
      assert.ok(side.includes(`País: ${place.spanish}`));
      assert.ok(side.includes(`Capital: ${place.capital}`));
    }
    assert.ok(card.front.includes(`¿En qué continente está ${place.spanish}?`));
    assert.ok(card.front.includes('Which continent is this country in?'));
    assert.ok(card.front.includes('geo-flag'));
    assert.ok(!card.front.includes('Continente:'), 'question does not reveal the answer');
    for (const label of expectedLabels[region]) assert.ok(card.back.includes(label));
    assert.match(card.back, /<svg.*role="img"/);
    assert.ok(card.review.includes(place.spanish) && card.review.includes(place.capital));
    if (region === 'caribbean') assert.match(card.back, /North America.*also correct/);
  }
}

console.log('All Spanish flashcard tests passed.');
