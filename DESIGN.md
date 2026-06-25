# DESIGN.md — patternator

## Identité

Remake modernisé de l'historique `bgpatterns.com` (interface années 2000). On garde
l'esprit « atelier / designer » d'origine — panneaux à onglets, rendu live — mais
revisité proprement (CSS découpé par pane, responsive mobile).

## Mise en page

- **Single-page**, éditeur à colonnes : panneau de contrôles (onglets *Colors,
  Texture, Image, Rotate, Saved, About*) + aperçu canvas en temps réel + footer d'actions.
- CSS modularisé par zone : `designer.base`, `designer.left-tabs`, `designer.controls`,
  `designer.saved`, `designer.common-panes`, `designer.preview-footer`, `box`.
- Police d'accent : **Barrio** (`assets/fonts/Barrio-Regular.ttf`).

## Couleurs

- Le **fond courant** pilote la couleur d'accent de l'interface ET le favicon dynamique
  (`favicon.php?c=<hex>`). Couleur par défaut référencée : `#577d5d`.

## Responsive

- Cible mobile gérée (media queries dans `designer.*.css`). Tester ≤ 390px.

## Partage social

- Carte og/twitter complète dans `index.html` (image `assets/images/previewMiniature.png`).
