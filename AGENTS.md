# Repository Guidelines

## Project Structure & Module Organization
Main tools live in `umalator/` (classic simulator) and `umalator-global/` (dark UI + worker). Shared UI sits in `components/`, navigation assets in `strings/`, `courseimages/`, `fonts/`, `icons/`, while JSON inputs such as `skill_meta.json` and `umas.json` stay in the repo root. Data and skill logic are synced from the `uma-skill-tools/` submodule (`CourseData`, `RaceParameters`, and `skill_data.json`). Supporting tools (`build-planner/`, `skill-visualizer/`, `rougelike/`, `umadle/`) mirror the same TypeScript + esbuild setup and reuse shared components. Keep generated bundles (`bundle.js`, `bundle.css`, `simulator.worker.js`) inside `umalator-global/`.

## Build, Test, and Development Commands
`git submodule update --init --remote uma-skill-tools` keeps balance patches synced.  
`npm install` pulls the Node dependencies (Preact, esbuild, immutable, @floating-ui).  
`cd umalator-global && node build.mjs` performs a one-off esbuild that outputs bundles and embeds the current skill data.  
`cd umalator-global && node build.mjs --serve 8000` runs the hot-reload dev server at `http://localhost:8000` and watches TSX/CSS.  
`node umalator-global/build.mjs` (from repo root) is the shortcut used after merges or asset refreshes.

## Coding Style & Naming Conventions
Use TypeScript/TSX with Preact hooks and the factories configured in `tsconfig.json` (`h`/`Fragment`). Stick to tab indentation, single quotes for strings, and descriptive PascalCase component files (e.g., `RaceTrack.tsx`). Keep shared logic in `components/` and import immutable Records rather than plain objects. Reference assets through `assetPath()` so GitHub Pages deploys resolve correctly, and prefer JSON camelCase keys that mirror upstream data.

## Testing Guidelines
The project relies on build-time validation plus manual QA. Treat `node build.mjs` as the TypeScript/lint gate: the build must succeed with no warnings. Validate UI or data changes via `node build.mjs --serve` and regression-click through `umalator` presets; spot-check race presets defined in `umalator/champions_meetings.json`. There is no automated coverage requirement, so document manual verification steps in your PR.

## Commit & Pull Request Guidelines
Follow the existing history: short, present-tense subjects that start with the touched area (`Lock umalator desktop layout...`). Include regenerated artifacts (`bundle.js`, `simulator.worker.js`, `skill_data.json`, etc.) in the same commit when they change. PRs should describe intent, list affected directories, link issues, and add screenshots/GIFs for layout adjustments. Call out data refresh steps (“synced uma-skill-tools, rebuilt global bundle”) so reviewers can repeat them.

## Data & Submodule Sync
Before shipping new skills or tracks, run `git submodule update --remote uma-skill-tools`. Copy fresh data into the global bundle, e.g.:

```
node -e "const fs=require('fs');fs.writeFileSync('umalator-global/skill_data.json',fs.readFileSync('uma-skill-tools/data/skill_data.json'))"
node -e "const fs=require('fs');fs.writeFileSync('umalator-global/skill_meta.json',fs.readFileSync('skill_meta.json'))"
node umalator-global/build.mjs
```

Rebuild afterward so `bundle.js` and `simulator.worker.js` embed the updated payloads.
