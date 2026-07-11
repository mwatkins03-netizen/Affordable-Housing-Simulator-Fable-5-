# Studentification Design System

## Creative direction

**Civic editorial × city-builder.** The prototype combines the legibility of a municipal planning dashboard with tactile, playful game UI. It uses thick outlines, offset shadows, irregular rotations, floating data cards, and an isometric city stage. These choices were informed by contemporary city-building and isometric-map work on Dribbble, but the composition and assets are original.

## Visual principles

1. **Evidence should feel playable.** Statistics appear as objects within the city rather than as a detached reading list.
2. **No neutral map.** Color and interface labels make visible that zoning and development choices distribute benefits and burdens.
3. **Separate every animatable layer.** The landing scene uses six standalone SVG files plus three HTML data cards.
4. **Editorial contrast.** Large condensed display type is paired with serif explanatory text and compact utility labels.
5. **Accessible interaction.** All controls are buttons or form elements, the city canvas supports keyboard movement and building, a high-contrast mode is included, and motion can be reduced.

## Palette

- Ink: `#152B2C`
- Paper: `#F4EFE2`
- Brick: `#D65336`
- Lime: `#C5DD68`
- Gold: `#E5B84F`
- Transit blue: `#397D86`
- Sky: `#8BB9BD`
- Civic lavender: `#B4A4CC`

## Animation hooks

Every landing asset is an `<img>` with `.scene-layer` and a `data-depth` value. The demo uses pointer-based parallax. Replace this with GSAP, Framer Motion, Three.js planes, or scroll-linked animation without changing the markup.

Suggested movements:
- Sky grid: subtle horizontal drift.
- Hills: slow 1–2% scale breathing.
- Skyline: 8–12 px vertical parallax.
- Housing/construction: cranes and windows animated independently after redrawing as sub-assets.
- Rent signs: gentle pendulum rotation.
- Foreground street: bus traversal and pedestrian loops.
