# ITSM NOEL PORTAL

Projet starter validé : index.html + styles.css + app.js, avec arborescence assets prête.

## Structure
```
/ITSM NOEL PORTAL/
├─ index.html
├─ styles.css
├─ app.js
└─ /assets/
   ├─ /icons/   ← déposez vos PNG ici
   ├─ /img/     ← bg-noel-hero.jpg (optionnel)
   └─ /video/   ← neige.mp4 (optionnel)
```

## Déploiement GitHub Pages
1. Créez un repository `ITSM-NOEL-PORTAL` (ou autre).
2. Uploadez **tout le contenu** du dossier racine (pas le dossier parent).
3. `Settings → Pages → Build and deployment → Source: Deploy from branch`.
4. Branch `main`, dossier `/ (root)` → Save.
5. URL attendue : `https://<user>.github.io/<repo>/`.

## Notes
- Icônes : mettez vos fichiers dans `/assets/icons/` et gardez les mêmes noms ou mettez à jour les `src` dans `index.html`.
- Background : image `/assets/img/bg-noel-hero.jpg` (mode `.bg-image`) ou vidéo `/assets/video/neige.mp4` (mode `.bg-video` via `BG.set('video')`).
- Couleurs : modifiables dans `:root` (voir `styles.css`).
