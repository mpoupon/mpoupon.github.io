# mpoupon.github.io

My website code

## How the site is served

The site is a static React SPA on GitHub Pages. The browser loads **precompiled**
scripts from `build/` (production React from unpkg, no in-browser Babel).
The `.jsx` files are the sources — they are not loaded by the browser.

- Editing `data/*.json` (publications, conferences, notes…): no rebuild needed.
- Editing any `.jsx` file: rebuild `build/` before committing, with [bun](https://bun.sh):

```sh
bun tools/build.mjs
```

Pages are routed by URL hash: `#pubs`, `#research`, `#engage`, `#essays`,
`#contact`, `#note/<slug>` — links are shareable and back/forward work.
