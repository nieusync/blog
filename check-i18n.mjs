// Every {{t "key"}} in the templates must exist in both locale files, and
// neither file may carry a key nothing uses. Ghost falls back to printing the
// key itself, so a missing entry is not an error anywhere: it just renders
// "nav.who_we_are" to a reader. This is the only thing that catches it.
//
// Run: node check-i18n.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

let failed = 0;
const fail = (msg) => { console.error(`  ✗ ${msg}`); failed++; };

const templates = [
  ...readdirSync('.').filter((f) => f.endsWith('.hbs')),
  ...readdirSync('partials').map((f) => join('partials', f)),
];

const used = new Map(); // key -> first file that uses it
for (const file of templates) {
  const raw = readFileSync(file, 'utf8');

  // Ghost's own theme validator parses inside {{!-- --}}, so handlebars syntax
  // written as prose in a comment is real to it: a bare {{t}} in a comment is
  // an upload error even though nothing renders it. Keep comments plain.
  for (const c of raw.matchAll(/\{\{!--[\s\S]*?--\}\}/g)) {
    if (/\{\{/.test(c[0].slice(5, -4))) {
      fail(`${file}: handlebars syntax inside a comment — gscan parses it, write it as prose`);
    }
  }

  // Strip comments before looking for keys, so prose about the helper does not
  // register as a key nothing can define.
  const src = raw.replace(/\{\{!--[\s\S]*?--\}\}/g, '');

  // Text passed into a partial as a literal, e.g. {{> hero label="Categoria"}}.
  // Nothing else here can see it: it is not a translation key, so the key
  // checks below skip it, and it renders fine in both languages — in
  // Portuguese. Every param on these partials is user-facing, so a bare string
  // is always wrong; it should be (t "key").
  for (const call of src.matchAll(/\{\{>\s*[\w-]+([^}]*)\}\}/g)) {
    for (const param of call[1].matchAll(/([\w-]+)="([^"]+)"/g)) {
      fail(`${file}: ${param[1]}="${param[2]}" is a literal — use ${param[1]}=(t "key")`);
    }
  }
  // {{t "key"}} and the subexpression form (t "key")
  for (const m of src.matchAll(/\(?\bt\s+"([^"]+)"/g)) {
    if (!used.has(m[1])) used.set(m[1], file);
  }
}

const locales = Object.fromEntries(
  readdirSync('locales').map((f) => [f, JSON.parse(readFileSync(join('locales', f), 'utf8'))]),
);

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
