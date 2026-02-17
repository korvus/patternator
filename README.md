# bgGenerator `prod`

This project is a modernized remake of the old [bgpatterns.com](http://www.bgpatterns.com) interface.
Archived reference:
https://web.archive.org/web/20080828060206/http://www.bgpatterns.com/

Live deployment:
https://patternator.200.work/

This `prod` folder is the deployable app.

## Current Behavior

- Single-page pattern editor (Colors, Texture, Image, Rotate, Saved, About).
- Parameters are applied in real time on the canvas preview.
- URL query string is synced with current settings (`cw`, `ch`, `tx`, `to`, `im`, `ag`, `is`, `io`, `il`, `fg`, `bg`).
- Saved patterns are stored in `localStorage` and can be reapplied without page reload.
- `Download image` exports the generated tile as a local PNG.
- Favicon is dynamic and driven by the current **background color** via `assets/images/favicon.php?c=<hex>`.

## Run Locally

Use HTTP (not `file://`).

```powershell
cd D:\sites\bgGenerator\prod
py -m http.server 8080
```

Open:
`http://localhost:8080/`

Note:
- If you want the dynamic PHP favicon to work locally, run with PHP instead:

```powershell
cd D:\sites\bgGenerator\prod
php -S localhost:8080
```

## Entry Point

- `index.html`

## Project Structure

- `index.html`
- `js/`
  - `app.js` (main frontend logic: controls, render, URL state, save/share, dynamic favicon update)
- `assets/`
  - `bgs/` (texture tiles)
  - `images/` (UI assets + favicon resources)
  - `style/`
    - `box.css` (panel container styles)
    - `designer.base.css`
    - `designer.left-tabs.css`
    - `designer.controls.css`
    - `designer.saved.css`
    - `designer.common-panes.css`
    - `designer.preview-footer.css`
- `illustration/`
  - `svg_icons/` (primary icon source)
  - `png_x4/` (fallback source)

## Linting and Formatting

Local tooling is configured in this folder:

- `npm run lint` (CSS + HTML)
- `npm run lint:css`
- `npm run lint:html`

Config files:

- `.stylelintrc.cjs`
- `.htmlhintrc`
- `.prettierrc`
- `.editorconfig`

## Deployment

Deployment is done with WinSCP script automation:

```powershell
make deploy
```

Files are synchronized using `deploy.txt` to:
`/home/u372623295/domains/200.work/public_html/patternator`

Excluded from deployment:
- `.git/`
- `node_modules/`
- local tooling files (as defined in `deploy.txt`)
