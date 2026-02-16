# bgGenerator `prod`

Ce dossier contient une version autonome et nettoyee de l'application, prete pour deploiement.

## Lancer en local

Utiliser un serveur HTTP local (ne pas ouvrir en `file://`).

Exemples:

```powershell
# Python
cd D:\sites\bgGenerator\prod
py -m http.server 8080
```

Puis ouvrir:

`http://localhost:8080/`

## Point d'entree

- `index.html`

## Arborescence utile

- `index.html`
- `js/`
  - `app.js` (logique principale front)
- `assets/`
  - `bgs/` (textures de fond)
  - `images/` (assets UI historiques)
  - `images/ui_gif/` (gifs UI)
  - `style/` (`designer.css`, `box.css`, `fixes.css`)
- `illustration/`
  - `svg_icons/` (source prioritaire pour rendu icones)
  - `png_x4/` (fallback)

## Notes runtime

- Le fond de page est applique automatiquement des qu'un parametre change (mode local, sans backend).
- `Download image`: exporte localement un PNG du motif courant (fallback sans backend).
- Le bouton `Save to "My patterns"` a ete retire.

## Deployment

Pour deployer, copier le contenu de ce dossier `prod` tel quel sur la cible.
L'application est statique cote front et ne depend pas des dossiers d'archives/recherche presents a la racine du projet original.
