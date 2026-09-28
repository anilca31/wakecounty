// Run with: node tools/build.js
// Bundles index.html + css + js into one self-contained file: dist/ratio-explorer.html
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

let html = read('index.html');

html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, href) => `<style>\n${read(href)}\n</style>`);
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => {
  const js = read(src);
  if (js.includes('</script')) throw new Error(`${src} contains "</script", which would break inlining`);
  return `<script>\n${js}\n</script>`;
});

const outDir = path.join(root, 'dist');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'ratio-explorer.html');
fs.writeFileSync(out, html);
console.log(`Wrote ${path.relative(root, out)} (${(html.length / 1024).toFixed(1)} KB)`);
