# Patternator

Modernized remake of the old [bgpatterns.com](http://www.bgpatterns.com) interface
([archived reference](https://web.archive.org/web/20080828060206/http://www.bgpatterns.com/)).

**Live:** https://patternator.200.work

A single-page generator for seamless background patterns: adjust icons, colors,
textures, scale, rotation and opacity, preview live on canvas, and export the tile as PNG.

## Behavior

- Single-page pattern editor (Colors, Texture, Image, Rotate, Saved, About).
- Parameters applied in real time on the canvas preview.
- URL query string synced with current settings (`cw`, `ch`, `tx`, `to`, `im`, `ag`,
  `is`, `io`, `il`, `fg`, `bg`).
- Saved patterns stored in `localStorage`, reapplied without page reload.
- `Download image` exports the generated tile as a local PNG.
- Dynamic favicon driven by the current **background color** via
  `assets/images/favicon.php?c=<hex>` (rendered server-side on Hostinger).

## Run locally

Use HTTP (not `file://`). Run with PHP so the dynamic favicon works:

```bash
php -S localhost:8080
```

Without PHP the site still works, only the dynamic favicon is inert:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/`.

## Structure

- `index.html` — entry point (head, og/twitter meta, `<!-- GA_TAG -->` placeholder).
- `js/app.js` — front logic (controls, canvas render, URL state, save/share, favicon).
- `data/patterns.manifest.json` — generated image catalog (Image tab).
- `assets/` — `bgs/` (texture tiles), `images/` (UI + `favicon.php`), `style/` (CSS split per pane).
- `illustration/` — `svg_icons/` (primary source) + `png_x4/` (fallback).
- `scripts/generate-pattern-manifest.mjs` — rebuilds the catalog from the filesystem.

### Adding patterns

1. Add SVGs to `illustration/svg_icons/<category>/` and PNG fallbacks to
   `illustration/png_x4/icos/<category>/`.
2. Regenerate the manifest:

   ```bash
   npm run patterns:generate
   ```

The Image tab reads `data/patterns.manifest.json`, so new patterns appear without editing `index.html`.

## Linting

```bash
npm ci
npm run lint        # CSS (stylelint) + HTML (htmlhint)
```

Config: `.stylelintrc.cjs`, `.htmlhintrc`, `.prettierrc`, `.editorconfig`. Dev-only tooling —
it is never deployed to the site.

## Deployment (CI/CD)

Automated via GitHub Actions (`.github/workflows/deploy.yml`) on push — standard 200.work
FTPS pipeline:

| Branch | Target | URL |
|--------|--------|-----|
| `main` | prod | https://patternator.200.work |
| `dev`  | staging (Basic Auth) | https://patternator.200.work/dev/ |

No build step — the repo files are deployed as-is over FTPS (meta-files excluded). At deploy
time the `<!-- GA_TAG -->` placeholder is replaced with the Google Analytics snippet built
from the `GA_MEASUREMENT_ID` repo variable (nothing committed).

Workflow: push to `dev` → check staging → merge `dev` into `main` for production.

**Repo secrets:** `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `DEV_USER`, `DEV_PASS`.
**Repo variables:** `DEPLOY_DIR`, `DEPLOY_DIR_DEV`, `GA_MEASUREMENT_ID`.

### Local admin (not deployed)

A local-only PHP admin (`admin/`) can upload SVG/PNG and regenerate the manifest. The whole
`admin/` folder is gitignored and excluded from deployment — open it through a local PHP server.
