# mpoupon.github.io

My website code

## How the site is served

The site is a static React SPA on GitHub Pages. The browser loads **precompiled**
scripts from `build/` (no in-browser Babel, no CDN: React itself is self-hosted
as `build/react.js`, a minified production bundle of react + react-dom that
exposes `window.React` / `window.ReactDOM`).
The `.jsx` files are the sources — they are not loaded by the browser.

- Editing `data/*.json` (publications, conferences, notes…): no rebuild needed.
- Editing any `.jsx` file: rebuild `build/` before committing, with [bun](https://bun.sh):

```sh
bun tools/build.mjs
```

- `build/react.js` is a vendored artifact (react + react-dom, production,
  bundled with bun). It only needs regenerating to upgrade React itself.

Pages are routed by URL hash: `#pubs`, `#research`, `#engage`, `#essays`,
`#contact`, `#note/<slug>` — links are shareable and back/forward work.
