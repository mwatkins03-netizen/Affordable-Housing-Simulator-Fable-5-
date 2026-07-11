# Studentification Gameplay Roadmap

## Learning goals

Students should be able to:

1. Explain housing affordability as a system shaped by demand, supply, land use, finance, tourism, university growth, taxes, insurance, transportation, and tenant power.
2. Distinguish “more housing” from “more affordable housing.”
3. Identify tradeoffs and distributional effects: who benefits, who pays, who moves, and who commutes.
4. Use local reporting, public documents, and peer data to justify planning decisions.
5. Produce a transparent, evidence-based reflection rather than treating the simulation score as the answer.

## Demo loop implemented

1. Choose one of four modes.
2. Select a zoning or policy tool.
3. Place it on the isometric city grid.
4. Watch affordability, supply, displacement, commute, and budget change.
5. Pause every three turns for an evidence checkpoint.
6. Save source facts and decision rationales to the notebook.
7. Run a small anonymous peer survey.
8. Export a visual report as HTML or through browser PDF/print.

## Full simulation layer

Replace the demo equations with a transparent model composed of:

- **Households:** undergraduate students, graduate students, service workers, teachers, university staff, retirees, high-income second-home buyers, and long-term residents.
- **Housing stock:** dorms, rent-by-bedroom apartments, traditional rentals, starter homes, workforce units, subsidized units, short-term rentals, vacant/seasonal homes.
- **Costs:** land, construction, financing, insurance, property tax, utilities, transport, and maintenance.
- **Geography:** campus, Square, transit corridors, city limits, county commuter belt, flood/environment constraints.
- **Policy levers:** density, inclusionary incentives, tax assessment changes, vacancy tax, housing trust fund, tenant advocacy, transit investment, energy standards, master leases, and university-built housing.

Every formula should be viewable through a “How the model works” panel. Students should be able to challenge assumptions and run sensitivity tests.

## Modes for production

### Build from Scratch
Open map, generous time horizon, limited money. Best for introducing systems thinking.

### Fix the Chaotic City
Existing expensive housing, fragmented transit, second homes, and displacement pressure. Best for policy sequencing and unintended consequences.

### Enrollment Shock
Demand increases at fixed intervals. Best for exploring university-city interdependence and lead times in construction.

### Council Table
Students receive stakeholder roles and must pass a plan. Best for discussion, negotiation, and evidence evaluation.

### Budget of One Household
A narrative mode following a graduate assistant, teacher, service worker, or student household. Instead of managing the city, the player experiences rent increases, move costs, commute time, and leasing gaps.

### Oxford 2037
Long-horizon planning with climate, utility, transport, and demographic events. Best for final projects.

## Assessment design

The score is diagnostic, not a grade. Grade the exported reflection for:

- causal explanation;
- use of evidence;
- recognition of tradeoffs;
- attention to affected groups;
- revision after checkpoints;
- feasibility and coordination of recommendations.

## Technical path using the Three.js clone

The referenced project uses Vite, Three.js, a scene-level `Game` manager, a `City` simulation object, input/camera managers, modular buildings/services/vehicles, and separate public models/textures. Preserve this separation.

Recommended adaptation:

- Fork under the MIT license.
- Keep rendering (`Game`, camera, input) separate from housing logic.
- Add a `HousingModel` service that publishes metrics and events.
- Create Oxford-specific building classes and low-poly GLB assets.
- Add scenario JSON files so instructors can edit budgets, starting maps, events, and victory conditions without touching code.
- Store student notes locally by default; use Supabase only when instructors need class dashboards or shared surveys.
- Generate exports client-side to minimize student data collection.
