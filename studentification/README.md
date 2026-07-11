# Studentification — Oxford Housing Simulation

A no-build, browser-based educational city-builder about why housing has become so expensive in Oxford, Mississippi. Redesigned around the rendered "night city" asset pack: a looping cityscape video hero, photoreal isometric mode cards, and a dark charcoal-teal interface with a spring-green accent.

## Run it

Everything is static — open `index.html` from any web server:

```bash
python3 -m http.server 8298
```

> Note for Box users: macOS sandboxing can block servers from reading the Box folder directly. Copy the folder to a local path (e.g. `/private/tmp/studentification-preview`) and serve from there.

## What's here

- **Landing** — fullscreen seamless video loop (`assets/video/cityscape-loop.mp4`) with the text-free city render as poster/reduced-motion fallback, headline stats from local reporting.
- **Mode select** — the four rendered menu cards (checkerboard backdrop stripped to true transparency) as clickable scenario launchers: Build from Scratch, Fix the Chaotic City, Enrollment Shock, Council Table.
- **Game** — isometric canvas city with 8 zoning/policy tools, hover ghost previews, keyboard play, undo, budget, and four metrics (affordability, supply, displacement risk, commute burden).
- **Improvements over the demo package**
  - Per-mode win conditions actually checked, with an end-of-scenario debrief modal showing metric deltas from the start.
  - Random city events every 5 turns (insurance spikes, grants, second-home waves…) that force replanning.
  - Tools dim when the budget can't afford them; ghost preview shows what you're about to place.
  - Rebalanced scenario presets so Chaos starts in genuine crisis and Council isn't pre-solved.
  - Notebook, survey responses, and reflections persist in `localStorage`.
  - Hero video pauses off-landing, respects `prefers-reduced-motion` and the in-app motion toggle.
- **Evidence library** — 8 sourced cards from local reporting (Oxford Eagle, Daily Mississippian, city resources) with save-to-notebook.
- **Reflection studio** — 4 prompts + evidence basket → HTML / PDF / print export of a visual student report.
- **Accessibility** — keyboard canvas play, high-contrast mode, reduced-motion mode, ARIA drawers/modals.

## Files

- `index.html` / `styles.css` / `app.js` — the whole app
- `assets/video/` — landing loop
- `assets/cards/` — mode cards (processed to real transparency)
- `assets/backgrounds/` — text-free city render (video poster)
- `docs/` — original design-package docs (design system, gameplay roadmap, sources)

The city model is intentionally simplified and illustrative — the numbers are not forecasts. The exported reflection, not the score, is the assignment.
