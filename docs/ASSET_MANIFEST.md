# Asset Manifest and Production Queue

## Included demo layers

| File | Z-order | Purpose | Later animation |
|---|---:|---|---|
| `00-sky-grid.svg` | 0 | atmosphere, sun, planning grid | drift grid, sun parallax |
| `01-distant-hills.svg` | 1 | regional landscape | slow scale/pan |
| `02-oxford-skyline.svg` | 2 | simplified civic/campus silhouette | window lights, subtle camera move |
| `03-campus-housing.svg` | 3 | student apartments, mixed buildings, crane | crane swing, construction stages |
| `04-rent-signs.svg` | 4 | rent-by-bedroom and weekend-vacancy signals | hanging sign sway |
| `05-foreground-street.svg` | 5 | bus, road, pedestrians | bus loop, pedestrian walk cycles |

All are editable SVGs with no embedded fonts or raster images.

## Next image-production batch

Create each as an individual transparent PNG **and** editable SVG/GLB where appropriate:

1. Oxford courthouse-inspired civic building (not a photoreal copy)
2. Campus residence hall, low-poly isometric
3. Rent-by-bedroom apartment complex
4. Mixed-income duplex cluster
5. Workforce townhomes
6. Energy-efficient affordable home
7. Seasonal/second-home condo
8. Small traditional rental house
9. Graduate student household character set
10. Teacher/city worker household character set
11. Service worker commuter character set
12. Landlord/developer stakeholder portrait
13. Tenant advocate stakeholder portrait
14. City planner stakeholder portrait
15. University enrollment officer stakeholder portrait
16. OUT bus and bus stop
17. Construction crane and active building site
18. Empty/vacant seasonal unit indicator
19. Property-tax incentive token
20. Housing trust fund token
21. Vacancy-tax token
22. Tenant advocacy office token
23. Utility-efficiency badge
24. Displacement warning marker
25. Leasing-season calendar card
26. Source evidence cards, front/back states
27. Survey clipboard and anonymous response cards
28. Reflection notebook pages
29. Export report cover illustration
30. Mobile toolbar icon set

## Safe-area rules

- Keep the central 42% of the landing composition free enough for responsive title overlap on narrow screens.
- Avoid baked-in text except environmental signage explicitly listed above.
- Deliver transparent objects with 8–12% edge padding.
- Use consistent 3/4 isometric lighting from upper left.
- Preserve the palette in `DESIGN_SYSTEM.md`.
- Every animation-ready object should have a stable anchor point noted in its filename or metadata.
