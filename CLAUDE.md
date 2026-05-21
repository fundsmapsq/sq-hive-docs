# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start local dev server at http://localhost:5173/sq-hive-docs/
npm run build      # Build to dist/
npm run preview    # Preview the production build locally
npm run deploy     # Build then push dist/ to the gh-pages branch
```

## Architecture

This is a **vanilla JS documentation site** served via Vite. Despite having React/framer-motion in `package.json` and a `@vitejs/plugin-react` config (leftovers from an earlier React version), the codebase is pure DOM manipulation — no JSX, no React rendering.

### File roles

| File | Role |
|------|------|
| `index.html` | Full page HTML. All DOM elements that `app.js` queries must exist here. Currently references pre-built assets in `assets/` rather than source files directly. |
| `app.js` | Single IIFE wrapping all interactivity. Runs on `DOMContentLoaded`. Uses `$`/`$$` helper wrappers around `querySelector`/`querySelectorAll`. |
| `sample-data.js` | Sets `window.SQ_SAMPLES` — loaded as a plain `<script>` (not a module) so it executes synchronously before `app.js`. Must be loaded first. |
| `styles.css` | All styles via CSS custom properties. No Tailwind classes are used at runtime — Tailwind config exists but is not active. |
| `assets/` | Pre-built JS/CSS bundles committed directly to the repo and referenced by `index.html`. Multiple bundle versions exist; `index.html` pinpoints which pair is active. |

### How `app.js` is structured

`app.js` is one large IIFE with named `init*` functions, each wired to a page section:

- **`initApiKeyBar()`** — saves/loads the API key from `localStorage`, updates `#apiKeyStatus` in the nav.
- **`initQuickstart()`** — language tab switcher; rewrites `#snippet-quickstart` and `#snippet-verify` on tab click.
- **`initEndpointSamples()`** — builds syntax-highlighted request/response snippets for `#snippet-query-req`, `#snippet-query-resp`, `#snippet-assess-req`, `#snippet-assess-resp`. Re-renders on `sqh:envOrKeyChanged` event.
- **`initTypesGallery()`** — renders `#typeChips` chip buttons and `#typeStage` panel from `window.SQ_SAMPLES.deepdiveSamples`. Each type has a dedicated renderer function (`renderBlockDeal`, `renderBulkDeal`, etc.).
- **`initCategoryGallery()`** — fills `#catGrid` from `window.SQ_SAMPLES.filterCategories`.
- **`initPlayground()`** — wires `.play__pill` switcher, `.rtab` result tabs, and `[data-q]` / `[data-a]` form inputs. Calls `runQuery()` / `runAssessment()`.
- **`initWebhookPayloads()`** — tab switcher in `#whTabs` that rewrites `#snippet-webhook` from `window.SQ_SAMPLES.webhookSamples`.
- **`initHeroRotation()`** — cycles `#heroTitle` / `#heroDesc` through `window.SQ_SAMPLES.querySample.instrumentUpdateMessages`.

### Key conventions

- **CSS custom properties** (defined in `:root` in `styles.css`) drive the entire visual system — colors, spacing, fonts, shadows. Always use these vars rather than hard-coding values.
- **Reveal animations** — `initReveal()` adds `.reveal` to `.metric`, `.endpoint`, `.wh-card`, `.cat`, `.codeblock`, `.play`, `.type-stage` elements and an IntersectionObserver adds `.reveal--in` on scroll.
- **Environment switching** — `state.env` toggles between `staging` and `production` base URLs. A custom event `sqh:envOrKeyChanged` is dispatched when either changes, causing snippet re-renders.
- **Syntax highlighting** — `syntaxHighlightJson()` is a hand-rolled JSON highlighter; `buildSampleRequestSnippet()` produces pre-colored HTML strings using `<span class="kw|str|fn|key|cmt|num">` classes defined in `styles.css`.

### Deploying

`npm run deploy` runs `vite build` (output to `dist/`) then uses `gh-pages` to force-push `dist/` to the `gh-pages` branch. The live site at `https://fundsmapsq.github.io/sq-hive-docs/` is served from that branch.
