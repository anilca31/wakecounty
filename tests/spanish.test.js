// Run with: node tests/spanish.test.js
// Validates Spanish country/territory data and all flashcard deck shapes.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ctx = vm.createContext({ Math, console });
const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'spanish.js'), 'utf8');
vm.runInContext(`${source}\n;globalThis.Spanish = Spanish;`, ctx);
const { places, DECKS } = ctx.Spanish;

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

console.log('All Spanish flashcard tests passed.');
