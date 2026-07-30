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
index.hbs          post grid (+ newsletter aside when members are enabled)
post.hbs           gradient header, feature image, content, author card, related
page.hbs           static pages
tag.hbs            per-tag archive
author.hbs         per-author archive
partials/
  hero.hbs         gradient hero (label / accent line / title / subtitle)
  post-card.hbs    article tile
  newsletter.hbs   Ghost members signup form
assets/css/screen.css   the only stylesheet
assets/fonts/           Magistral-Bold.woff2
assets/img/             logo, light and white
```

No build step and no JavaScript: the mobile nav is a checkbox toggle, and the
newsletter form is Ghost's own `data-members-form`. Editing a `.hbs` or the CSS
is the whole workflow.

## Install

```sh
zip -r nieusync.zip . -x '.git/*' -x '*.DS_Store'
```

Upload the zip in Ghost admin → Settings → Design → Change theme → Upload, then
activate. Requires Ghost >= 5.0.

Site chrome that isn't in the templates comes from Ghost settings: the nav links
are Settings → Navigation (primary shows in the header, secondary in the
footer), and the logo falls back to the bundled `logo-nieusync.png` when
Settings → Branding has none. `@custom.site_url` sets the header button target
and defaults to `https://nieusync.com`.

## Notes

- Portuguese is hardcoded in a few labels ("Ler artigo", "Continuar a ler",
  "Autor", newsletter copy). Ghost themes have no i18n dictionary like the
  website's; translating means editing the partials or adding locale files.
- `Magistral-Bold.woff2` is copied from the website repo. Same commercial font,
  same organisation using it — check the licence covers this second domain.
