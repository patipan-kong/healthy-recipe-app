# Slice 35D: Restaurant discovery UI polish

## Entry state
Branch `main`. Slice 35C was committed first as `ac5e757` (`feat: add official restaurant logo identities`), then the tree was clean.
Catalog: 13 restaurants, 84 items, 44 prices, 22 menu images, 8 restaurant logos, 5 initials fallbacks. No data, schema or copy-key changes in this slice.

## Problem
Ordinary Explore and restaurant-local cards hid both the official menu image and the verified price, even though 35B populated them (35A had intentionally left them out). The cards were dry, and nothing was scannable by price.

## Treatment
A new shared `MenuListCard` in `src/App.tsx` replaces the two ordinary list card markups (Explore feed and restaurant-local list). Pick and result cards (`ExploreItemCard` focus, Pick Focus, Random Meal, the recipe bridge, Favorites) are unchanged. I removed the now-dead non-focus branches of `ExploreItemCard`.

Layout: row 1 is the compact image (108x81, 4:3, mild `cover` crop) beside category, dish name and restaurant. Row 2 spans the full card width:
1. **Primary row:** price (accent colour, 17px), kcal and protein. Kcal and protein are the bold numbers.
2. **Secondary row:** carbs, fat, sodium and the confidence badge, all quieter.
3. **Notes:** serving and customization notes.
4. **Price details:** a collapsed "ⓘ Price" `<details>` shown only when the price has a note (à la carte, size M, service charge). It keeps the qualification available without crowding the card.
5. **Attribution:** a small image caption link, shown only when there is an image.
6. **Action:** the "View restaurant" action in Explore. The favorite heart stays top-right.

## Image card and text card
- **Image card:** the thumbnail comes from the existing `MenuItemImage` with a new `compact` prop. It is the same figure, provenance and `onError` logic as before, so a failed remote image becomes the text card: no broken icon and no empty media area.
- **Text card:** the same layout without a media box. It has no placeholder, no decoration, and is naturally shorter.
- **Missing price:** the price element is omitted. There is no dash or zero placeholder, and no "from" price.

## Global vs restaurant-local
- **Explore:** shows the restaurant identity (initials mark) and name, plus the "View restaurant" action.
- **Restaurant-local:** the restaurant is already known, so there is no restaurant line and no action.
- **Logos:** they stay in the directory only (35C). A 24px logo in cards was judged too small to help.

## Ads
Slice 34 is untouched (cadence, placement, labels). Dashed, grey `Sponsored · โฆษณา` separators stay clearly unlike the white food cards, and there are no ads inside cards.

## Files changed
src/App.tsx, src/menu-image.tsx, src/styles.css, src/menu-image.test.tsx (two "no images in ordinary cards" assertions reversed to the new rule: images only where the item has one), src/menu-card-35d.test.tsx (new, 7 tests), this doc.

## Tests
- `npx vitest run src --exclude '**/.kilo/**' --maxWorkers 2`: 36 files, 533 tests passed.
- `npx tsc --noEmit`, `npm run build` and `git diff --check`: passed. The build shows the existing bundle-size warning.
- New tests cover the four image/price combinations, image failure fallback, provenance caption, Explore vs local restaurant identity, favorite toggle, price-note details and the 13/84/44/22/8 counts.

## Visual QA (production preview with ad prototype on, headless Edge)
Viewports 390x844 and 1440x900; Thai and English.
- **Overflow:** none anywhere. All 84 Explore cards render, with 10 ads on mobile and 6 on desktop.
- **Scanability:** price and kcal/protein read in a single glance, and carbs/fat/confidence recede. A first pass put the nutrition block in the narrow text column, where it wrapped into three lines. I moved it to full card width in a corrective pass.
- **Image card:** the food is recognizable and the crop is mild. A long Thai or English name wraps in the title column without touching the heart.
- **Failed image:** forcing a 404 turned the image card into the text card with no broken icon (296px to 257px, no overlap).
- **Desktop:** the same card in the existing content column, with no stretched empty row.
- **Ads:** the sponsored separator sits between food cards and stays visibly distinct.
- **Restaurant-local (Ootoya):** 6 cards, 3 with images, no restaurant line.

## Deferred
- Cards are taller than the old rows because price and carbs/fat now show. A denser variant could hide the secondary row.
- Price notes are collapsed, not inline.
- No restaurant logos in menu cards, and no image lightbox.
