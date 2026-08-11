# nieusync (Ghost theme)

Ghost theme for `blog.nieusync.com`, styled to match the marketing site in
[`nieusync/website`](https://github.com/nieusync/website).

Design tokens are a straight port of `website/src/index.css` — blue `#233877`,
purple `#9F8EC2`, page background `#F5F5F7`, 135° blue→purple gradient,
Exo 2 body with Magistral Bold for `h1`, 14px cards with the same shadow
pair, pill badges, uppercase letter-spaced buttons. If those change on the
site, change them here too; nothing is shared at build time.

## Layout

```
default.hbs        shell: fixed white nav, gradient-free body, dark blue footer
index.hbs          post grid
post.hbs           gradient header, feature image, content, author card, related
page.hbs           static pages
tag.hbs            per-tag archive
author.hbs         per-author archive
partials/
  hero.hbs         gradient hero (label / accent line / title / subtitle)
  post-card.hbs    article tile
  newsletter.hbs   Ghost members signup form, in the footer of every page
assets/css/screen.css   the only stylesheet
assets/fonts/           Magistral-Bold.woff2
assets/img/             logo, light and white
```

No build step and no JavaScript: the mobile nav is a checkbox toggle, and the
newsletter form is Ghost's own `data-members-form`. Editing a `.hbs` or the CSS
is the whole workflow.

## Install

```sh
node check-i18n.mjs        # the gate: no framework, no dependencies
zip -r nieusync.zip . -x '.git/*' -x '*.DS_Store'
```

Upload the zip in Ghost admin → Settings → Design → Change theme → Upload, then
activate. Requires Ghost >= 6.0 (theme translations landed in 6).

**There are two blogs, so this is two uploads.** `blog.nieusync.com/pt` and
`/en` are separate Ghost instances running this same package; the theme carries
both languages and each instance picks one.

## Languages

Ghost resolves `{{t "key"}}` against the site's own `locale` setting, one per
instance, which is why the split exists: there is no per-visitor language in a
Ghost theme. `locales/pt-PT.json` and `locales/en.json` hold every rendered
string, and `node check-i18n.mjs` fails if a key is used but undefined, defined
but unused, or empty. Worth running: Ghost prints a missing key verbatim instead
of erroring, so the failure mode is a reader seeing `nav.who_we_are`.

The `path.*` keys are URL segments on the marketing site, not prose. They must
match the routes in [`nieusync/website`](https://github.com/nieusync/website)
(`src/routes.ts`), so `quem-somos` and `who-we-are` are translated the same way
in both repos or the header links 404.

Three per-instance settings live in Ghost admin, not here:

| Setting | Where | PT | EN |
|---|---|---|---|
| `locale` | Settings → General | `pt-PT` | `en` |
| `site_url` | Settings → Design | `https://nieusync.com/pt` | `https://nieusync.com/en` |
| `alt_lang_url` | Settings → Design | `https://blog.nieusync.com/en` | `https://blog.nieusync.com/pt` |

`alt_lang_url` is what the header's language chip points at, so each instance
sends readers to its sibling without the theme knowing which one it is. Get
these backwards and the chip is a loop.

Site chrome that isn't in the templates comes from Ghost settings: the logo
falls back to the bundled `logo-nieusync.png` when Settings → Branding has none.
The nav links are hardcoded in `default.hbs` rather than read from Settings →
Navigation, so they stay identical to the marketing site's own header.

## Notes

- Portuguese is hardcoded in a few labels ("Ler artigo", "Continuar a ler",
  "Autor", newsletter copy). Ghost themes have no i18n dictionary like the
  website's; translating means editing the partials or adding locale files.
- `Magistral-Bold.woff2` is copied from the website repo. Same commercial font,
  same organisation using it — check the licence covers this second domain.
