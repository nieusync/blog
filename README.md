# nieusync (Ghost theme)

Ghost theme for `blog.nieusync.com`, styled to match the marketing site in
[`nieusync/website`](https://github.com/nieusync/website).

Design tokens are a port of `website/src/index.css`: dark page background
`#070B1D` (`--ink`), blue `#233877`, purple `#9F8EC2`, 135° blue→purple
gradient, Montserrat for body text and Magistral Bold for `h1` and `h2`,
translucent cards on the dark surface, pill badges, uppercase letter-spaced
buttons. If those change on the site, change them here too; nothing is shared
at build time.

## Layout

```
default.hbs        shell: dark nav, skip link, footer, cookie consent and GA4
index.hbs          post grid
post.hbs           header, feature image, content, author card, up to three related
page.hbs           static pages
tag.hbs            per-tag archive
author.hbs         per-author archive
partials/
  hero.hbs         gradient hero (label / accent line / title / subtitle)
  post-card.hbs    article tile
  newsletter.hbs   Ghost members signup form, in the footer of every page
  pagination.hbs   replaces Ghost's built-in one, whose labels are English
assets/css/screen.css   the only stylesheet
assets/fonts/           Magistral-Bold.woff2
assets/img/             logos and favicons
```

No build step: the mobile nav is a checkbox toggle, the newsletter form is
Ghost's own `data-members-form`, and `default.hbs` loads GA4 after consent.
Editing a `.hbs` or the CSS is the whole workflow.

## Install

```sh
node check-i18n.mjs        # the gate: no framework, no dependencies
zip -r nieusync.zip . -x '.git/*' -x '*.DS_Store'
```

Upload the zip in Ghost admin → Settings → Design → Change theme → Upload, then
activate. Requires Ghost >= 6.0 (theme translations landed in 6).

**There are two blogs, so this is two uploads.** `blog.nieusync.com/pt` and
`/en` are separate Ghost instances running this same package; the theme carries
both languages and each instance picks one. The shared `default.hbs` loads GA4
property `G-45LJD610R7` for both after consent. The decision is stored in the
parent-domain `nieusync_analytics_consent_v1` cookie, so it applies to the
website and both blogs. Remove any analytics snippet from each instance's Code
injection before activating this theme.

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

Per-instance settings live in Ghost admin, not here:

| Setting | Where | PT | EN |
|---|---|---|---|
| `locale` | Settings → General | `pt-PT` | `en` |
| `site_url` | Settings → Design | `https://nieusync.com/pt` | `https://nieusync.com/en` |
| `pt_url` | Settings → Design | `https://blog.nieusync.com/pt/` | same |
| `en_url` | Settings → Design | `https://blog.nieusync.com/en/` | same |

`pt_url` and `en_url` feed the language menu in the header. Both instances list
both languages; the current one is marked from `locale`.

Ghost helpers that print their own English text get it from the locale files
instead: `{{reading_time}}` through its `seconds`, `minute` and `minutes`
options, and the pagination through `partials/pagination.hbs`.

The nav links are hardcoded in `default.hbs` rather than read from Settings →
Navigation, so they stay identical to the marketing site's own header.

## Content rules the theme enforces

- **Tables** look the same in every article, whatever inline styles came with
  them (Google Docs borders, fixed widths, `nowrap` headers). On wider screens
  they fill the text column, centred in it. On phones (600 px and below) each
  row becomes a card with one value per line and its column name in front,
  copied from the header row by a short script in `default.hbs`. Nothing
  scrolls sideways and no word is split, on a phone or when zoomed in. The CSS uses
  `!important` on purpose: that is what overrides the pasted inline styles.
- **Legal notice at the end of articles** is written in each article, not added
  by the theme.

## Notes

- Planned, not done yet: self-host Montserrat (today it loads from Google
  Fonts before consent, which sends the visitor's IP to Google), and load
  `gtag.js` only after the visitor accepts analytics (today it loads in
  consent mode and Google receives cookieless pings before a choice).
- `Magistral-Bold.woff2` is copied from the website repo. Same commercial font,
  same organisation using it — check the licence covers this second domain.
