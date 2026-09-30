`# Slice 36 — Unify Cook & Buy discovery
`
`Entry: branch `main`, HEAD `ca6b676` ("feat: polish restaurant discovery cards"), which is Slice 35D,
`committed and already contained in `origin/main` (0 ahead / 0 behind at entry). Worktree clean.
`Catalog at entry and exit: 13 restaurants, 84 menu items, 44 prices, 22 menu images, 8 logos
`(5 restaurants on initials), 23 recipe↔restaurant relations. No data files changed.
`
`## Information architecture
`
`| | Before | After |
`| --- | --- | --- |
`| Cook | Recipe Grid → Recipe Detail | unchanged |
`| Buy | Restaurant list → information-heavy menu list | Restaurant Grid → Menu Grid → Menu Detail |
`
`## Restaurant Grid
`
``.restaurant-grid` (2 columns on mobile, 3 from 560px, same breakpoint as the Recipe Grid). Each card is one
`button: a 84px-tall identity tile (official logo, `object-fit: contain`, unmodified) or, without a verified logo,
`the existing initials mark at the same size and in one neutral tint (pilot and fallback initials look identical
`here), then name, cuisine and a chevron. `RestaurantIdentity` gained a `tile` size; logo/initials/failure
`behaviour is unchanged. Presentation order: logo-bearing restaurants first (`logoFirstRestaurants`, a stable
`partition in `src/menu-presentation.ts`). The `restaurants` array, Random Restaurant pool, IDs, search and filters
`are untouched; the helper only orders what is rendered.
`
`## Menu Grid
`
`Shared by restaurant-local menus and global Explore (`MenuGridCard`). Concise browse card: optional image, category,
`dish name, optional restaurant line (Explore only), price only when present, kcal and protein. Carbs, fat,
`confidence, notes, price qualification and provenance moved to Menu Detail. The dish title is a button whose
``::after` stretches over the card, so the whole card opens the detail without nesting interactive elements; the
`favourite heart sits above it (36px tap target).
`
`- **Image card:** `MenuItemImage variant="card"` (4:3, cover, no caption). A failed image renders nothing and the
`  card becomes the text card with no reserved space (verified in the browser).
`- **No-image card:** same layout, no media box, no placeholder, no logo. Shorter cards are allowed (`align-items:start`).
`- **Image-first order (restaurant-local only):** `imageFirstMenuItems` stable partition at the view layer; Pick,
`  filters and the item set still use the unordered `items`. When both groups exist a quiet full-width divider,
`  "เมนูเพิ่มเติม / More menu items", separates them. Global Explore keeps its existing result order.
`
`## Menu Detail
`
`New overlay page (`MenuDetail`), sibling of Recipe Detail: back and favourite header, hero image with provenance
`caption (only when an image loads), restaurant link (logo/initials, name, cuisine), category, dish name, other-language name, price
`block (amount, qualification note, "price checked" date), nutrition card (kcal, protein, carbs, fat) with sodium
`and confidence badge, existing meal-context sections (`MealContextDetails`, with a new `showPrice` flag so the
`price is not shown twice), "Menu information" (serving and customization notes), "Sources" (nutrition note and
`date) and the "Want to make it?" Cook bridge. Each section is omitted when its data is absent. No-image
`items begin with the restaurant row and title; there is no hero placeholder.
`
`The overlay is state in `App` (`menuDetail`). The view underneath stays mounted but `hidden`, so Explore search text,
`filters, picks and restaurant selection survive Back; scroll position is restored. `fromRecipe` and
``recipeReturnMenu` remember the recipe page a detail was opened from, so Recipe → Menu Detail → Recipe → Back
`→ Menu Detail → Back → Recipe works. "View restaurant" from a detail goes to that restaurant's menu.
`
`## Cook ↔ Buy, Pick, Ads
`
`- Recipe Detail bridge cards keep "View restaurant" first and gain "View details" → Menu Detail. Menu Detail keeps
`  the "Want to make it?" bridge → Recipe Detail. Relation data and `relationKind` untouched.
`- Pick/Random result cards are unchanged apart from a "View details" action leading to Menu Detail.
`- Ads: `AdFeed`, cadence, labels, flag and placements are untouched. Full-width sponsored separators span the new
`  grids (`.restaurant-grid`/`.menu-grid > .ad-slot`). Cadence at the browser: Explore every 8 (2 columns) on
`  mobile and every 12 (3 columns) on desktop; restaurant directory: see "Corrective polish".
`- Favorites screen keeps its existing list rows (not redesigned).
`
`## Reuse / removal of 35D
`
`Kept: `MenuItemImage` failure handling, price rendering, provenance link (now on Menu Detail), tests' intent.
`Removed: `MenuListCard`, all `.menu-card*` and compact-image CSS, `menu-card-35d.test.tsx` (superseded by
``menu-grid-36.test.tsx`). `MenuItemImage`'s `compact` prop became `variant: 'card' | 'hero'`.
`Old class names `restaurant-row`, `menu-item-row` and `menu-list` are kept on the new elements, which keeps the
`existing suite's selectors valid.
`
`## Tests
`
``src/menu-grid-36.test.tsx` (19 tests): Restaurant Grid (13 cards, logo/initials, logo-first order, opening,
`pool untouched), Menu Grid (image and text cards, no blank media, image-first order and divider with an unchanged
`item set, price/no-price, kcal/protein visible, detail-only fields absent, favourites, image failure, restaurant
`line in Explore only), Menu Detail (hero, provenance, price qualification, nutrition, no-image, no-price, notes,
`Cook bridge and return to the same detail, Back keeps Explore search, Pick → detail, Recipe → detail → Back),
`ad position and catalog/relation counts.
`
`Existing tests updated because behaviour moved, not loosened: `.restaurant-list` → `.restaurant-grid`; logo
`test matches rows by identity rather than position (logo-first order); confidence badges are now asserted on Menu
`Detail (and asserted absent from cards); "View restaurant" from an Explore card now goes card → Menu Detail →
`restaurant link; two 35D-era image assertions had already been updated in 35D.
`
`## Browser QA (production preview, ad prototype on)
`
`390×844 and 1440×900, Thai and English: no horizontal overflow on Restaurant Grid, Menu Grid, Explore, Menu Detail
`(image, text-only), Pick → detail, or Recipe ↔ Menu Detail. Two columns on mobile, three on desktop. All 8 logos
`loaded and were legible and unclipped at 147×84 (first pass clipped tall logos; fixed). Sponsored separator stays
`dashed grey with its label. Forced image failure collapsed a card to the text card. Defects fixed in the pass:
`clipped logos, image inset by the legacy row padding, misaligned tiles in stretched rows, uneven link padding.
`
`## Deferred / known
`
`- Favorites list rows do not link to Menu Detail.
`- Hidden underlying view stays mounted while a detail is open (state is preserved by design).
`
`## Corrective polish (post visual QA)
`
`- **Random Restaurant identity:** the result card passes `showLogo` to `RestaurantIdentity`, so a verified logo is
`  shown (Fuji, and all other logo restaurants), otherwise initials. Layout and actions unchanged.
`- **Restaurant directory ad:** `restaurantFeedAdAfter` in `ad-slot.tsx`. The ad follows **9 cards on the 3-column
`  desktop grid** (3 full rows) and **10 cards on the 2-column mobile grid** (5 full rows), only when more cards
`  follow. Recipe Browse and Menu Explore cadence (8 / 12) is unchanged. Observed: 390px → ad at child index 10;
`  1440px → child index 9, full grid width, dashed and labelled.
`- **Equal-height Menu Grid cards:** `.menu-grid{align-items:stretch}`, card `height:100%` flex column, body
`  `flex:1`, and the price (or facts, when there is no price) gets `margin-top:auto` so metadata aligns to the card
`  bottom. No fixed heights; names wrap. Rows are equal within a grid; tiles in the Restaurant Grid are unchanged.
`- **Explore image-first:** the rendered Explore list is `imageFirstMenuItems(items)` (stable partition of the
`  search/filter result). Search, filters, Pick and Random pools use the unordered candidates. No sort control
`  exists, and no divider was added.
`
`## Responsive food-image presentation
`
`Rule: browse cards crop in a controlled, consistent ratio; detail heroes keep the source composition.
`- Recipe Detail (\`.detail-art\`): \`height:auto; aspect-ratio:1/1; max-height:520px\`, image \`object-fit:contain\` (recipe sources are
`  square). 390px → 390×390 (full image); 1440px → 680×520 box with the whole image centred (was 390×250 / 680×300 cover).
`  Also fixed: the image wrapper's \`detail\` class inherited the page-level \`.detail{min-height:100vh}\`; neutralised.
`- Mobile Recipe Card (<560px, \`.recipe-card .food-art\`): 4:3 (348×261, was 348×135 ≈ 39% of the square source visible, now ≈ 75%).
`  Desktop card unchanged (150px tall).
`- Menu Detail hero: natural aspect ratio (\`aspect-ratio:auto\`, image \`height:auto; max-height:520px; object-fit:contain\`);
`  390px → 390×293, 1440px → 680×510 for 4:3 sources. No-image items still have no hero; caption/provenance unchanged.
`- Menu Grid cards keep their 4:3 cover crop (verified reasonable at 390 and 1440).
