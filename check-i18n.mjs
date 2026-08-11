// Every {{t "key"}} in the templates must exist in both locale files, and
// neither file may carry a key nothing uses. Ghost falls back to printing the
// key itself, so a missing entry is not an error anywhere: it just renders
// "nav.who_we_are" to a reader. This is the only thing that catches it.
//
// Run: node check-i18n.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const templates = [
  ...readdirSync('.').filter((f) => f.endsWith('.hbs')),
  ...readdirSync('partials').map((f) => join('partials', f)),
];

const used = new Map(); // key -> first file that uses it
for (const file of templates) {
  // Strip {{!-- … --}} first: the comments in default.hbs talk about {{t "path.*"}}
  // and would otherwise register as a key nothing can define.
  const src = readFileSync(file, 'utf8').replace(/\{\{!--[\s\S]*?--\}\}/g, '');
  // {{t "key"}} and the subexpression form (t "key")
  for (const m of src.matchAll(/\(?\bt\s+"([^"]+)"/g)) {
    if (!used.has(m[1])) used.set(m[1], file);
  }
}

const locales = Object.fromEntries(
  readdirSync('locales').map((f) => [f, JSON.parse(readFileSync(join('locales', f), 'utf8'))]),
);

let failed = 0;
const fail = (msg) => { console.error(`  ✗ ${msg}`); failed++; };

for (const [name, dict] of Object.entries(locales)) {
  for (const [key, file] of used) {
    if (!(key in dict)) fail(`${name} is missing "${key}" (used in ${file})`);
    else if (!String(dict[key]).trim()) fail(`${name} has an empty "${key}"`);
  }
  for (const key of Object.keys(dict)) {
    if (!used.has(key)) fail(`${name} defines "${key}", which no template uses`);
  }
}

// A path.* value becomes a URL segment on the marketing site, so a stray slash
// or a space is a broken link rather than a wrong word.
for (const [name, dict] of Object.entries(locales)) {
  for (const [key, value] of Object.entries(dict)) {
    if (key.startsWith('path.') && !/^[a-z0-9-]+$/.test(value)) {
      fail(`${name}: "${key}" is "${value}", not a bare URL segment`);
    }
  }
}

const names = Object.keys(locales);
console.log(
  failed
    ? `\n${failed} problem(s) across ${names.join(', ')}`
    : `✓ ${used.size} keys, consistent across ${names.join(', ')}`,
);
process.exit(failed ? 1 : 0);
