# Studentification Export Manifest

This package updates the original Studentification browser demo with newly rendered visual assets.

## Added asset folders

### `/assets/renders/backgrounds`
- `studentification_city_background_text_free.png`
  - Text-free city background based on the selected first render.

### `/assets/renders/menu-cards`
- `build_from_scratch_card.png`
- `fix_the_chaotic_city_card.png`
- `enrollment_shock_card.png`
- `council_table_card.png`

These menu card PNGs are intended as export-ready UI assets for the main game mode selector.

### `/assets/renders/source-renders`
Reference renders from the concept phase for future asset extraction, UI iteration, and promotional use.

## Suggested integration
- Use the text-free background as the main landing-page hero image.
- Overlay navigation, title, and stats in HTML/CSS rather than baking them into the image.
- Use the four menu-card PNGs as clickable mode selectors.
- Keep all exported assets in their own files to simplify later animation and replacement.

## Note
The current menu-card files contain their own small icons embedded within each card design. If you want standalone icon PNGs for each mode in a follow-up pass, generate those as separate exports next.
