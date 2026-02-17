# bgGenerator `prod`

This project is a remake of the old [bgpatterns.com](http://www.bgpatterns.com) website, which is no longer online.
You can still visit the archived version on Wayback Machine:
https://web.archive.org/web/20080828060206/http://www.bgpatterns.com/

A live version of this repository is available at:
https://patternator.200.work/

This folder contains a standalone, cleaned-up version of the app, ready for deployment.

## Run Locally

Use a local HTTP server (do not open with `file://`).

Example:

```powershell
# Python
cd D:\sites\bgGenerator\prod
py -m http.server 8080
```

Then open:

`http://localhost:8080/`

## Entry Point

- `index.html`

## Useful Structure

- `index.html`
- `js/`
  - `app.js` (main frontend logic)
- `assets/`
  - `bgs/` (background textures)
  - `images/` (legacy UI assets)
  - `images/ui_gif/` (UI GIFs)
  - `style/` (`designer.css`, `box.css`, `fixes.css`)
- `illustration/`
  - `svg_icons/` (preferred source for icon rendering)
  - `png_x4/` (fallback)

## Runtime Notes

- The page background updates automatically whenever a parameter changes (local mode, no backend).
- `Download image`: exports the current pattern as a local PNG (no-backend fallback).
- The `Save to "My patterns"` button has been removed.

## Deployment

To deploy, copy the content of this `prod` folder as-is to your target.
The app is fully frontend/static and does not depend on the archive/research folders present at the root of the original project.
