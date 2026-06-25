# AGENTS.md — patternator

## Mission

Générateur de **patterns / fonds d'écran seamless** en ligne — remake modernisé de
l'ancien `bgpatterns.com`. Éditeur single-page : on règle icônes, couleurs, textures,
échelle, rotation, opacité, et on exporte la tuile en PNG.

Site public : **https://patternator.200.work**

## Stack

- **Site statique** pur (HTML / CSS / JS vanilla) — **aucune étape de build**.
- `index.html` = point d'entrée unique. Toute la logique front est dans `js/app.js`.
- L'état courant est synchronisé dans le **query string** (`cw`, `ch`, `tx`, `to`,
  `im`, `ag`, `is`, `io`, `il`, `fg`, `bg`) et les patterns sauvegardés vivent en
  `localStorage`.
- **Favicon dynamique PHP** : `assets/images/favicon.php?c=<hex>` (rendu côté Hostinger,
  pilote la couleur de l'onglet selon le fond courant). C'est la seule dépendance PHP.
- **Google Analytics** injecté au déploiement (voir CI/CD), pas committé.

## Commandes

```
npm ci            # installe le tooling de lint (dev-only, ne part jamais sur le site)
npm run lint      # stylelint (CSS) + htmlhint (HTML)
npm run lint:css
npm run lint:html
npm run patterns:generate   # régénère data/patterns.manifest.json depuis illustration/
```

Servir en local (HTTP, pas `file://`) — PHP pour que le favicon dynamique marche :

```
php -S localhost:8080      # ou : python3 -m http.server 8080 (favicon PHP inerte)
```

## Structure

- `index.html` — page unique (head + meta og/twitter + placeholder `<!-- GA_TAG -->`).
- `js/app.js` — logique front (contrôles, rendu canvas, état URL, save/share, favicon).
- `data/patterns.manifest.json` — catalogue d'images généré (onglet Image).
- `assets/` — `bgs/` (textures), `images/` (UI + favicon.php), `style/` (CSS découpé
  par pane : `box.css`, `designer.*.css`).
- `illustration/` — `svg_icons/` (source primaire) + `png_x4/` (fallback).
- `scripts/generate-pattern-manifest.mjs` — reconstruit le manifest depuis le FS.

### Ajouter des patterns
1. SVG → `illustration/svg_icons/<categorie>/`, PNG fallback → `illustration/png_x4/icos/<categorie>/`.
2. `npm run patterns:generate` (réécrit `data/patterns.manifest.json`).
3. L'onglet Image lit le manifest → les patterns apparaissent sans toucher `index.html`.

## Déploiement (CI/CD FTPS Hostinger — pipeline standard 200.work)

GitHub Actions (`.github/workflows/deploy.yml`), sur push :

- **`main` → prod** : `patternator.200.work` (`/domains/200.work/public_html/patternator/`).
- **`dev` → staging** : `dev-patternator.200.work` (sous-domaine dédié,
  `/domains/200.work/public_html/dev-patternator/`) verrouillé par **Basic Auth**
  (`.htpasswd` généré au déploiement depuis les secrets `DEV_USER` / `DEV_PASS`).

Upload via **FTPS** (`SamKirkland/FTP-Deploy-Action`, port 21, retry 1×). Le placeholder
`<!-- GA_TAG -->` de `index.html` est remplacé au déploiement par le snippet GA construit
depuis la variable repo `GA_MEASUREMENT_ID` (rien de committé).

Secrets repo : `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `DEV_USER`, `DEV_PASS`.
Variables repo : `DEPLOY_DIR`, `DEPLOY_DIR_DEV`, `GA_MEASUREMENT_ID`.

Flux : pousser sur `dev` → vérifier le staging → merger `dev` → `main` pour la prod.

## Pièges / quirks

- **Pas de build** : on déploie les fichiers du repo tels quels (méta-fichiers exclus).
- Le dossier `admin/` (outil PHP local d'upload) est **gitignoré ET exclu du déploiement** ;
  il n'existe que côté poste local.
- L'ancien déploiement Windows (WinSCP + `Makefile` + `deploy.txt` + `scripts/prepare-deploy.ps1`)
  est **remplacé** par le CI/CD. `Makefile`/`deploy.txt` restent gitignorés.
- Lint dev-only (stylelint/htmlhint) : 0 vuln, ne part jamais sur le site.
