# Umalator Global - Local Development Guide

This project now defaults to local testing before any GitHub Pages deployment.  
Use the steps below to keep simulator data in sync and iterate on the new dark UI.

## 1. Environment Setup

```powershell
git pull
git submodule update --init --remote uma-skill-tools
npm install
```

- `uma-skill-tools` tracks upstream skill logic.  
  Updating the submodule pulls the latest balance patch implementation.

## 2. Building & Serving Locally

Use the esbuild helper in `umalator-global`:

```powershell
cd umalator-global
# one-off build
node build.mjs

# hot-reload dev server (defaults to http://localhost:8000)
node build.mjs --serve 8000
```

Key artifacts are written to the `umalator-global` folder:

| File                       | Purpose                                 |
|---------------------------|-----------------------------------------|
| `bundle.js` / `bundle.css`| Main application bundle + styles        |
| `simulator.worker.js`     | Web worker that runs race simulations    |
| `skill_data.json`         | Global skill triggers & effects         |
| `skill_meta.json`         | Metadata used in UI/tooltips            |

Stop the dev server with `Ctrl+C` when you are done testing.

## 3. Updating Data After a Patch

1. Update the `uma-skill-tools` submodule (`git submodule update --remote`).
2. Refresh the global JSON caches so the redirect plugin sees the new values:

   ```powershell
   # overwrite local cache with submodule data
   node -e "const fs=require('fs');const path=require('path');const g=path.join('umalator-global','skill_data.json');const s=path.join('uma-skill-tools','data','skill_data.json');const gd=JSON.parse(fs.readFileSync(g,'utf8'));const sd=JSON.parse(fs.readFileSync(s,'utf8'));Object.keys(gd).forEach(k=>sd[k]&&(gd[k]=sd[k]));fs.writeFileSync(g,JSON.stringify(gd));"

   node -e "const fs=require('fs');const path=require('path');const g=path.join('umalator-global','skill_meta.json');const s=path.join('skill_meta.json');const gd=JSON.parse(fs.readFileSync(g,'utf8'));const sd=JSON.parse(fs.readFileSync(s,'utf8'));Object.keys(gd).forEach(k=>sd[k]&&(gd[k]=sd[k]));fs.writeFileSync(g,JSON.stringify(gd));"

   node umalator-global\build.mjs
   ```

   > The bundle step must run after copying so that `bundle.js` and `simulator.worker.js` embed the refreshed data.

3. Rebuild to regenerate `bundle.js` / `simulator.worker.js`.

## 4. Champions Meeting Presets

- Editable list lives at `umalator/champions_meetings.json`.
- Each entry is chronologically sorted and maps the GameTora schedule through Aries Cup.
- Course IDs are sourced from `umalator-global/course_data.json`.  
  Use `node tools/resolve-course-id.js` or the `CourseHelpers` lookup to match track/distance.

## 5. UI/UX Notes

- The layout uses CSS variables defined in `umalator/app.css`.
- Panels are rendered as frosted-glass surfaces; adjust variables at the top of the file for theming tweaks.
- The racetrack canvas is horizontally scrollable under 960 px.  
  Test responsive breakpoints (1200 px and 768 px) before shipping changes.

## 6. Troubleshooting

| Issue                                   | Fix                                                                 |
|-----------------------------------------|----------------------------------------------------------------------|
| Build script cannot find `app.tsx`      | Run commands from repo root or `umalator-global` directory.         |
| Skill values look outdated              | Re-run `git submodule update --remote` and rebuild.                 |
| Local server shows blank page           | Ensure `node build.mjs --serve` is running and visit the served URL. |

Documented: 2025-11-13

