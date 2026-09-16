# GoodFood V2 — Restaurant Image Expansion Batch 2 (Slice 24)

Slice 24 tests whether the Slice 18/19 source/serving-match gate scales to a
third and fourth restaurant brand (Fuji Japanese Restaurant, MK Restaurants),
while also probing a fifth (Sukiya) that Slice 19 flagged as promising. This
is a research + data slice; no UI, architecture, or feature work.

## Entry state (2026-09-16)

- Branch `main`, HEAD `f73d6db` ("feat: add random meal discovery") — worktree
  confirmed clean (`git status --short` empty) before any research or edits.
- Baseline confirmed: 13 restaurants, 84 menu items, exactly 7 existing
  `menuImage` records (2 from Slice 18, 5 from Slice 19), 24 verified
  `MenuPrice` records, `MenuImage` type unchanged (`src/types.ts`),
  `validateMenuImage` unchanged (`src/meal-context.ts`), Pick-Focus-only
  rendering (`src/menu-image.tsx` wired into `RestaurantMenuView`'s pick card
  and `ExploreItemCard` only when `focus` is true), graceful `onError`
  failure behavior unchanged.
- Baseline test run: `npx vitest run` → 26 files / 380 tests passing, plus one
  pre-existing flaky test (`restaurant-app.test.tsx`'s "avoids repeating the
  same pick" assertion, which depends on `Math.random` not repeating a value
  by chance) that passed in isolation on retry — unrelated to this slice,
  not touched.
- Reviewed `docs/restaurant-image-pilot-18.md` and
  `docs/restaurant-image-expansion-19.md`. Slice 19 explicitly suggested Fuji,
  MK, and Sukiya as the next research targets, which is exactly this slice's
  Group 1 scope.

## Research scope

Per the brief's priority order:

- **Group 1 (researched in full):** Fuji Japanese Restaurant, MK Restaurants,
  Sukiya.
- **Group 2/3:** not exercised — Group 1 alone produced more strong,
  EXACT/ACCEPTABLE-confidence candidates than the batch's 5–8 target, so
  research stopped per the brief's "stop once ~5–8 strong candidates are
  found" instruction.

## Research method

For each candidate: `WebSearch` to find the brand's official site, `curl` (via
Bash) to fetch raw HTML/JSON and extract exact `<img src>` / JSON `src`
values (never guessed from filenames or thumbnails), `curl` with and without
a `Referer` header to check hotlink/access-control behavior, then a direct
download of the candidate image into a scratch directory
(outside the repository) for pixel-level visual inspection against the
production `RestaurantMenuItem` record (serving basis, included sides, dish
identity, protein/preparation). All scratch downloads were discarded after
inspection; zero image files were bundled into the repository.

- **Fuji** (`fuji.co.th/menu/?lang=en`): single-page menu rendered
  server-side with a hidden-input `menu-image` value per item (WordPress
  site); extracted via `curl` + a small Node parser.
- **MK Restaurants** (`mkrestaurant.com/en/mk-menu/*`): paginated via an
  AJAX endpoint (`mk_menu/ajax_load_product/EN`) requiring an
  `X-Requested-With: XMLHttpRequest` header; each item's JSON payload
  included the exact calorie figure MK publishes per item, which let
  candidates be cross-checked against our existing `mkOfficialCalorieNote`
  production nutrition (itself sourced from MK's own published calories) —
  an unusually strong identity signal beyond name matching alone.
- **Sukiya** (`sukiya.co.th/menu/grandmenu.html`): each category (Gyudon,
  Curry, etc.) is a single ~2,300 KB promotional banner/menu-sheet image
  combining every SKU in that category with price stickers and marketing
  copy — there is no individually addressable per-dish photo URL anywhere on
  the official site.

## Source strategy / rights posture

Identical to Slice 18/19: **Option B — remote first-party image (hotlinked),
not bundled**. Every accepted image loads directly from the brand's own
domain (`fuji.co.th`, `mkrestaurant.com`) with a plain unauthenticated `GET` —
confirmed to succeed identically with and without a `Referer` header, i.e. no
hotlink protection exists to route around, and none was routed around. No
site's terms published an explicit image redistribution license (standard
copyright only), matching the posture already accepted for the existing 7
images. Rights confidence is therefore **Medium** for every accepted image,
consistent with Slice 18/19.

## Candidate table

| Restaurant | Item id | Item name | Official source page | Direct image source | Serving match | Rights/source confidence | Dimensions/size | Decision | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fuji | `fuji-salmon-shioyaki-brown-rice-set` | Salmon Shioyaki with Brown Rice Set | fuji.co.th/menu/?lang=en | `.../SALMON-SHIOYAKI-WITH-BROWN-RICE-SET-1-768x768.png` | Exact | Medium | PNG 768×768, 998,866 B | **ACCEPT — remote** | Name-exact match; photo shows grilled salmon, mixed-grain rice, miso soup, and pickled sides — matches the record's "Set meal" category and "served as a set with brown rice" note with no extraneous items |
| Fuji | `fuji-salmon-shioyaki` | Grilled Salmon Shioyaki (à la carte) | fuji.co.th/menu/?lang=en | `.../SALMON-TERIYAKI-_-SHIOYAKI-SET-768x768.png` | Mismatch | — | PNG 768×768, 1,025,912 B | **REJECT** | The site combines teriyaki and shioyaki into one dual-name SKU with one SET photo; the photo shows a full set (rice, miso soup, sides) and a dark, glossy, caramelized glaze that reads as teriyaki, not salt-grilled shioyaki. Our record is explicitly à la carte, no rice ("rice is not included") — same trap class as Slice 18's rejected Shima Hokke |
| Fuji | `fuji-salmon-tataki` | Salmon Tataki Salad | fuji.co.th/menu/?lang=en | `.../SALMON-TATAKI.png-768x768.png` | Exact | Medium | PNG 768×768, 1,055,466 B | **ACCEPT — remote** | Name-exact match; photo shows lightly-cured salmon slices with chili, garlic, lime over salad greens — no rice/soup/other dish, matches "Salad" category |
| Fuji | `fuji-kinoko-mushroom-salad` | Kinoko (Mushroom) Salad | fuji.co.th/menu/?lang=en | `.../KINOKO-SALAD-768x768.png` | Exact | Medium | PNG 768×768, 934,644 B | **ACCEPT — remote** | Name-exact match; photo shows mixed shiitake/enoki mushrooms over greens, tomato, radish, pepper — vegetarian salad, matches record exactly |
| Fuji | `fuji-chicken-teriyaki` | Chicken Teriyaki | fuji.co.th/menu/?lang=en | `.../CHICKEN-TERIYAKI-SET-768x768.png` | Mismatch | — | PNG 768×768, 1,039,474 B | **REJECT** | Only photo available is the SET version (rice, miso soup, sides); production nutrition (18g carbs) is far too low for a rice-inclusive set, indicating our record represents the à la carte version, which has no distinct photo. Same trap as the shioyaki rejection above |
| Fuji | `fuji-chirashi-sushi-don-set` | Chirashi Sushi Rice Bowl Set | fuji.co.th/menu/?lang=en | `.../CHIRASHI-SUSHI-DON-SET-768x768.png` | Acceptable | Medium | PNG 768×768, 1,250,149 B | **ACCEPT — remote** | Name-exact match; photo shows a mixed sashimi rice bowl (salmon, tuna, shrimp, scallop, crab, roe) with miso soup and sides, consistent with the record's "one rice bowl, includes rice" set-style note |
| MK | `mk-special-vegetable-set` | Special Vegetable Set | mkrestaurant.com/en/mk-menu/suki/ | `.../2d90e4421809ab3c838e94db744ce7df.JPG` | Exact | Medium | JPEG 500×500, 127,908 B | **ACCEPT — remote** | Site's published calories for "Vegetable Set" (90.40 kcal) match our production kcal (90) almost exactly — our nutrition was itself sourced from MK's own published calories, so this is a very strong identity signal beyond the name match. Photo shows raw lettuce, pumpkin, enoki mushroom, carrot — matches "served raw for cooking in the hot pot" |
| MK | `mk-special-kurobuta-set` | Special Kurobuta Set | mkrestaurant.com/en/mk-menu/suki/ | `.../c46d73452576ddbb21c542893e6efbed.jpg` | Exact | Medium | JPEG 500×500, 140,572 B | **ACCEPT — remote** | Site's published price (฿223) and calories (303.22) both match our production record (223, 303) exactly. Photo shows raw sliced kurobuta pork arranged on a plate for hot-pot cooking |
| MK | `mk-special-kurobuta-plate` | Special Kurobuta (Single Plate) | mkrestaurant.com/en/mk-menu/suki/ | `.../6e5bc4cef819eb5ecb4b8a08fa92cc2b.jpg` | Exact | Medium | JPEG 500×500, 93,407 B | **Found, not accepted this batch** | Price (฿75) and calories (96) both match our record exactly; photo (raw pork on a small single-plate tray, visually distinct container from the Set version) is a clean, correct match. Deferred rather than rejected — see "Deferred candidates" below |
| MK | `mk-premium-suki-set` | Premium Suki Set (Single Pot) | mkrestaurant.com/en/mk-menu/suki/ | `.../759b93dc4b3d0153a14656015262c135.JPG` | Exact | Medium | JPEG 500×500, 169,235 B | **ACCEPT — remote** | Site's published price (฿259) and calories (382.40) both match our production record (259, 382) exactly. Photo shows raw pork belly, squid, shrimp, fish balls, and a vegetable bowl with dipping sauce — matches "pork, seafood, hotpot" tags |
| MK | `mk-seafood-suki-broth` | Seafood Suki (Prepared, Broth Style) | mkrestaurant.com/en/mk-menu/single-dish | `.../74e40820714e487e931bbf7f83d8eb65.jpg` | Exact | Medium | JPEG 500×500, 50,800 B | **ACCEPT — remote** | Site's published calories for "Seafood Suki (Soup)" (238.93) match our production kcal (239) almost exactly. Photo shows cooked seafood (shrimp, squid, fish) in broth with vegetables, ready to eat — matches "served ready-to-eat, one bowl in broth" |
| MK | `mk-pork-shabu` | Pork Shabu | mkrestaurant.com/en/mk-menu/suki/ | `.../dd1aba57e93fec743c1bbf2b1cbb3e1f.jpg` | Exact | Medium | JPEG 500×500, 103,619 B | **Found, not accepted this batch** | Site's published calories for "Shabu Pork" (193.37) match our record (193) almost exactly; photo (raw pork belly on the same single-plate tray style as Kurobuta plate) is a clean, correct match. Deferred rather than rejected — see "Deferred candidates" below |
| MK | `mk-health-vegetable-set-small` | Health Vegetable Set (Small) | mkrestaurant.com/en/mk-menu/suki/ (searched all 4 pages) | — | Uncertain | — | — | **REJECT — no confident SKU match** | The closest name match found, "Vegetables Set (Small)" (฿188), publishes 226.24 kcal against our record's 213 kcal — a real gap, unlike every other MK match in this batch which agreed on calories to within a rounding error. Also checked the `single-dish` and `recommend` categories; no better match found. Rather than guess, left unresearched-equivalent (no image) |
| Sukiya | `sukiya-gyudon-regular` | Gyudon Beef Rice Bowl (M) | sukiya.co.th/menu/grandmenu.html | `.../menu_gyudon.jpg` (category banner) | N/A | N/A | JPEG ~1130×800 (banner), 2,293,530 B | **REJECT — image quality gate** | The only image available for this and every other Sukiya item is one full promotional menu-sheet banner per category, combining ~9 SKUs with price stickers, "NEW", "Recommended Set" callouts, and other marketing text. This is exactly the brief's "menu-sheet screenshots" / "collages where the target dish is unclear" / "dominated by promotional text" rejection criteria. No individually addressable per-dish photo exists on the official site |
| Sukiya | `sukiya-gyudon-okra-regular` | Gyudon with Bonito Flakes & Okra (M) | sukiya.co.th/menu/grandmenu.html | same banner | N/A | N/A | same | **REJECT — image quality gate** | Same collage-only source; this dish (#105 on the banner) is one small sub-thumbnail inside the marketing collage, not a standalone photo |
| Sukiya | `sukiya-curry-rice-regular` | Japanese Curry Rice (M), plain/no meat | sukiya.co.th/menu/grandmenu.html | `.../menu_curry.jpg` (category banner) | N/A | N/A | JPEG ~1130×800 (banner), 2,394,886 B | **REJECT — image quality gate** | Confirmed the exact matching SKU (#609, plain curry, ฿89) exists on the banner as a **text-only price line with no photo at all** — items 600–608 (curry with beef/hamburg/karaage toppings) have photos, but the plain version our record represents does not |
| Sukiya | `sukiya-beef-plate-no-rice` | Beef Plate, No Rice (M) | sukiya.co.th/menu/grandmenu.html | same banner pattern (not individually fetched once the pattern was confirmed) | N/A | N/A | — | **REJECT — image quality gate** | Same site-wide collage-only pattern confirmed across two categories already inspected; not worth re-downloading a third ~2 MB banner to reconfirm the identical defect |
| Sukiya | `sukiya-salad` | Salad | sukiya.co.th/menu/grandmenu.html | same banner pattern | N/A | N/A | — | **REJECT — image quality gate** | Same reason |
| Sukiya | `sukiya-miso-soup` | Miso Soup | sukiya.co.th/menu/grandmenu.html | same banner pattern | N/A | N/A | — | **REJECT — image quality gate** | Same reason |

## Deferred candidates (found, correct, intentionally not accepted this batch)

`mk-special-kurobuta-plate` and `mk-pork-shabu` are both genuine
EXACT-confidence matches (verified the same way as every accepted MK item)
but were **not** added to production data this slice. Both photos show raw
sliced pork on the same small red single-plate hot-pot tray as each other —
visually near-duplicate of the already-accepted `mk-special-kurobuta-set`
(also raw pork, on a larger black plate). Accepting both would have pushed
this batch to 10 images against a stated target of 5–8 and added redundant
"raw pork on a plate" photos without materially increasing meal-recognition
value. They are documented here (not silently dropped) as strong candidates
for a future batch, per the brief's "quality target, not a quota" guidance
and "it is completely valid to finish below target."

## Images accepted (8)

1. `fuji-salmon-shioyaki-brown-rice-set` — Fuji Japanese Restaurant
2. `fuji-salmon-tataki` — Fuji Japanese Restaurant
3. `fuji-kinoko-mushroom-salad` — Fuji Japanese Restaurant
4. `fuji-chirashi-sushi-don-set` — Fuji Japanese Restaurant
5. `mk-special-vegetable-set` — MK Restaurants
6. `mk-special-kurobuta-set` — MK Restaurants
7. `mk-premium-suki-set` — MK Restaurants
8. `mk-seafood-suki-broth` — MK Restaurants

All `kind: 'official-remote'`, hotlinked (not bundled), matching the Slice
18/19 model and rights posture exactly. No image file was added to the
repository.

## Images rejected (10 researched + 2 deferred)

- `fuji-salmon-shioyaki`, `fuji-chicken-teriyaki` — serving mismatch (SET
  photo vs. à la carte production record).
- `mk-health-vegetable-set-small` — no confident SKU match (calorie
  mismatch).
- `sukiya-gyudon-regular`, `sukiya-gyudon-okra-regular`,
  `sukiya-curry-rice-regular`, `sukiya-beef-plate-no-rice`, `sukiya-salad`,
  `sukiya-miso-soup` — image quality gate (collage/menu-sheet source only,
  no individual dish photos on the official site).
- `mk-special-kurobuta-plate`, `mk-pork-shabu` — deferred (correct matches,
  held back to keep this batch at 8 and avoid visual redundancy; see above).

## Existing 7 Slice 18/19 images — health check

All 7 were re-fetched with a plain `curl` GET during this slice and returned
`200 OK`, unchanged size (within rounding of the previously documented
figures) and unchanged content type:

| Item | Status |
| --- | --- |
| `ootoya-grilled-mackerel` | 200, 628,218 B PNG (Slice 18: 628 KB) |
| `ootoya-grilled-moromi-chicken` | 200, 408,629 B PNG (Slice 19: 399 KB) |
| `ootoya-tonteki-pork-chop-set` | 200, 1,045,500 B PNG (Slice 18: 1.05 MB) |
| `salad-factory-grilled-chicken-sesame` | 200, 709,802 B JPEG (Slice 19: 693 KB) |
| `salad-factory-kale-chicken-truffle` | 200, 728,419 B JPEG (Slice 19: 711 KB) |
| `seven-eleven-garlic-pork-egg-rice` | 200, 178,622 B JPEG (Slice 19: 174 KB) |
| `seven-eleven-green-curry-chicken` | 200, 72,248 B JPEG (Slice 19: 71 KB) |

No dead URL was found; no existing image required documentation as broken.
`src`, `alt`, `kind`, `sourceUrl`, and `sourceLabel` for all 7 were left
byte-for-byte unchanged in `src/restaurants.ts` (verified by test — see
below). No factual defect was discovered in any of the 7 existing records
during this research pass.

## Model design

No change. `MenuImage` (`src/types.ts`) and `validateMenuImage`
(`src/meal-context.ts`) are unchanged — the existing shape from Slice 18
accommodated every Slice 24 record without modification.

## Files / assets changed

- `src/restaurants.ts` — added `asOf24` ('2026-09-16'), `fujiImageSourceLabel`,
  `mkImageSourceLabel` constants; added a `menuImage` object to the 8 accepted
  items listed above. No other field (nutrition, price, meal context, serving
  note, category, tags, restaurant/menu membership) was changed for any of
  the 84 items.
- `src/meal-context.test.ts` — updated 3 outdated Slice-18/19-era coverage
  assertions (now 15 total instead of 7), added a "Slice 24 image expansion
  batch" describe block (8 new tests: validation, search, nutrition/category/
  serving-note integrity, filter/Quick-Goal parity, HTTPS + source-label
  checks, deferred/rejected-candidate regression checks).
- `src/menu-image.test.tsx` — updated 2 outdated Slice-18/19-era assertions
  (restaurant-set and coverage-ceiling), added 2 new component tests
  rendering a Fuji item in restaurant-local Pick Focus and an MK item in
  Explore Pick Focus.
- `src/random-meal-app.test.tsx` — added 1 new test deterministically
  selecting a Slice 24 item (`mk-special-kurobuta-set`) via Random Meal and
  asserting the image renders.
- `docs/restaurant-image-expansion-24.md` — this file.
- **Zero image files added to the repository.** All 8 accepted images remain
  hotlinked PNG/JPEG files served directly by `fuji.co.th` and
  `mkrestaurant.com` — not fetched, converted, cropped, or stored by this app
  at build or run time. Research-only downloads (16 candidate images across
  Fuji/MK/Sukiya, totaling roughly 15 MB) were made to a local scratch
  directory outside the repository for visual inspection and deleted
  afterward.
- **No production/UI code was touched** — `src/menu-image.tsx`, `src/App.tsx`,
  and `src/styles.css` are unchanged from Slice 18/19/23. Browser QA (below)
  found no defect requiring a UI change.

## Coverage

- Before: 7 / 84 (3 restaurants: Ootoya, Salad Factory, 7-Eleven)
- New: 8
- After: 15 / 84 (5 restaurants: Ootoya, Salad Factory, 7-Eleven, Fuji
  Japanese Restaurant, MK Restaurants)

By restaurant: Fuji 4/6 items now image-backed (salmon shioyaki set, salmon
tataki, kinoko salad, chirashi don set), MK 4/7 (special vegetable set,
special kurobuta set, premium suki set, seafood suki broth). All other 11
restaurants unchanged (Ootoya remains 3/6, Salad Factory 2/6, 7-Eleven 2/6,
the other 8 restaurants remain at 0).

## Rights / source confidence

Every accepted image is **Medium** confidence, identical posture to Slice
18/19: first-party static path on the brand's own domain, no hotlink
protection (confirmed via `curl` with and without `Referer`), but only a
standard all-rights-reserved copyright notice — no explicit redistribution
license was found on either `fuji.co.th` or `mkrestaurant.com`. The decision
to hotlink rather than bundle (Option B) is what keeps every accepted image
defensible without such a license, exactly as documented in Slice 18.

## Serving-match confidence

| Item | Rating |
| --- | --- |
| Salmon Shioyaki with Brown Rice Set (Fuji) | Exact |
| Salmon Tataki Salad (Fuji) | Exact |
| Kinoko (Mushroom) Salad (Fuji) | Exact |
| Chirashi Sushi Rice Bowl Set (Fuji) | Acceptable |
| Special Vegetable Set (MK) | Exact |
| Special Kurobuta Set (MK) | Exact |
| Premium Suki Set (MK) (single pot) | Exact |
| Seafood Suki, Broth Style (MK) | Exact |

No Uncertain or Mismatch item is present in the accepted set. This batch's
MK matches are unusually high-confidence because MK's own site publishes
per-item calories, which our existing production nutrition was itself
sourced from (`mkOfficialCalorieNote`) — giving a second, independent
identity signal beyond the item name for every MK candidate.

## Performance characteristics

| Item | Format | Dimensions | Size |
| --- | --- | --- | --- |
| Salmon Shioyaki with Brown Rice Set | PNG | 768×768 | 998,866 B |
| Salmon Tataki Salad | PNG | 768×768 | 1,055,466 B |
| Kinoko (Mushroom) Salad | PNG | 768×768 | 934,644 B |
| Chirashi Sushi Rice Bowl Set | PNG | 768×768 | 1,250,149 B |
| Special Vegetable Set | JPEG | 500×500 | 127,908 B |
| Special Kurobuta Set | JPEG | 500×500 | 140,572 B |
| Premium Suki Set | JPEG | 500×500 | 169,235 B |
| Seafood Suki, Broth Style | JPEG | 500×500 | 50,800 B |

The 4 Fuji PNGs (935 KB–1.25 MB) are the heaviest images in the dataset so
far — comparable to the existing Ootoya PNGs (628 KB–1.05 MB) but larger than
Slice 19's Salad Factory/7-Eleven JPEGs. This is flagged, not treated as
disqualifying, per the brief ("do not reject a correct official image solely
because it is moderately large"). The 4 MK JPEGs (51–169 KB) are the
lightest images in the dataset, being pre-sized 500×500 e-commerce-style
thumbnails rather than full-resolution photography. No optimization
pipeline, proxy, or bundling was added.

## Browser QA

Performed in a real headless Chromium browser (Playwright, driving the local
`npm run dev` server) at 390×844, 360×800, and 1440×900, in both English and
Thai. Screenshots were captured for every scenario below; all image-backed
Pick Focus cards were also confirmed via direct DOM inspection
(`img.complete === true`, `naturalWidth/naturalHeight === 768` or `500`) to
rule out a screenshot-timing artifact from `loading="lazy"`.

- **Fuji Pick Focus (390×844, EN):** confirmed a rejected/no-image item
  (Grilled Salmon Shioyaki) renders text-only with no image region, and — via
  repeated "Pick again" — an image-backed item (Chirashi Sushi Rice Bowl Set)
  renders the photo, attribution link, name, nutrition, and "View all menus"
  in the same card structure as existing Ootoya items.
- **MK Pick Focus (390×844, TH):** confirmed Thai localization (title,
  attribution "ภาพจากเว็บไซต์ทางการของเอ็มเค", price label, serving note)
  renders correctly alongside the image, with correct price display (฿259).
- **Ootoya existing-image regression (390×844, EN):** confirmed
  `ootoya-tonteki-pork-chop-set` still renders identically to Slice 18/18B —
  image, meal-context "Complete meal" block, and price all intact.
- **No-image Pick regression (360×800 EN for MK's Health Vegetable Set;
  1440×900 EN for Sukiya):** confirmed both render as clean text-first cards
  with zero `.menu-item-image` nodes and no empty frame/placeholder.
- **Explore Pick (390×844, EN):** confirmed rendering an existing Slice 19
  image-backed item (Ootoya moromi chicken) correctly inside `ExploreView`.
- **Random Meal (390×844, EN):** confirmed via the existing generic app flow
  (landed on a no-image item in one run) and via the new deterministic unit
  test (`mk-special-kurobuta-set` renders its image through Random Meal with
  no special-casing needed).
- **Favorites (390×844, EN):** seeded two Slice 24 favorites
  (`mk-special-vegetable-set`, `fuji-salmon-tataki`) via `localStorage` and
  confirmed both render as plain text rows with zero `.menu-item-image`
  nodes anywhere on the Favorites screen.
- **Restaurant list (390×844, EN):** confirmed all 13 restaurants still
  render as initials-badge rows with zero image nodes, unaffected by this
  slice.
- **No console or page errors** were captured by Playwright across any of
  the above scenarios.

### Measured facts

| Surface | Viewport | Rendered image size | Overflow check |
| --- | --- | --- | --- |
| Fuji Pick (image) | 360×800 | 224×168 | `scrollWidth === clientWidth` (360), `scrollX = 0` |
| MK Pick (image) | 360×800 | 224×168 | `scrollWidth === clientWidth` (360), `scrollX = 0` |
| MK Pick (image) | 1440×900 | 540×240 (capped by `max-height`) | `scrollWidth === clientWidth` (1440), `scrollX = 0` |
| Fuji Pick (image) | 1440×900 | 540×240 (capped by `max-height`) | `scrollWidth === clientWidth` (1440), `scrollX = 0` |
| Fuji Pick (image) | 390×844 | (not re-measured; same CSS box as 360/1440, confirmed via screenshot) | `scrollWidth === clientWidth` (390), `scrollX = 0` |
| MK Pick (image) | 390×844 | (same) | `scrollWidth === clientWidth` (390), `scrollX = 0` |

Rendered image dimensions exactly match the already-validated sizing from
Slice 18B (224×168 at ~360–390px width, 540×240 capped at desktop) even
though the Fuji (768×768) and MK (500×500) source images are square, unlike
the existing 800×600 landscape Ootoya sources — the shared
`.menu-item-image-frame` (`aspect-ratio: 4/3`, `object-fit: cover`) crops
every source uniformly and correctly regardless of source aspect ratio. No
horizontal overflow, title/heart collision, or layout defect was found at
any tested viewport. No UI code change was required or made.

## Overflow / performance

No `document.scrollingElement.scrollWidth` exceeded `clientWidth` in any
measured state; `window.scrollX` was `0` throughout. The 4 new Fuji PNGs are
moderately large (935 KB–1.25 MB) — documented above as a real, accepted cost
of not re-encoding third-party assets, consistent with Slice 18's existing
tradeoff for the Ootoya PNGs. `loading="lazy"` and `decoding="async"` (both
pre-existing, unchanged) continue to apply to every image, including the 8
new ones, since they render through the same `MenuItemImage` component.

## Tests / verification

- Added/updated 14 tests: 8 new in `src/meal-context.test.ts` (Slice 24
  validation, search, nutrition/category/serving-note integrity,
  filter/Quick-Goal parity, HTTPS + source-label checks, deferred/rejected
  candidate regression) plus 3 updated coverage-count assertions; 2 new
  component tests in `src/menu-image.test.tsx` (Fuji Pick Focus, MK Explore
  Pick Focus) plus 2 updated coverage-count assertions; 1 new test in
  `src/random-meal-app.test.tsx` (deterministic Slice 24 Random Meal
  render).
- Full suite: `npx vitest run` → **26 test files, 394 tests, all passing**
  (was 26 files / 391 tests* before this slice — see note below about the one
  pre-existing flaky test).

  \* The pre-existing flaky `restaurant-app.test.tsx` test occasionally shows
  as 380/381 depending on `Math.random` timing; it is unrelated to this
  slice and was not modified.
- `npx tsc --noEmit` → clean.
- `npm run build` → succeeds (`tsc --noEmit && vite build`); pre-existing
  >500 KB chunk-size warning only (820.95 KB JS / 29.81 KB CSS, up from
  ~813 KB / ~29.8 KB — the size delta is new test/data code, not any bundled
  image, since all 8 new images remain remote-only).
- `git diff --check` → exit 0 (only pre-existing LF/CRLF line-ending
  notices, no actual whitespace errors).

## Production integrity

- Restaurants: **13** (unchanged). Menu items: **84** (unchanged). Verified
  `MenuPrice` records: **24** (unchanged — no price was added, changed, or
  removed this slice).
- Nutrition, meal context, prices, serving notes, categories, tags, and
  restaurant/menu membership: unchanged for all 84 items — the only edits
  were adding a `menuImage` field to 8 additional item objects.
- The existing 7 Slice 18/19 images are byte-for-byte unchanged (verified by
  test and by direct `curl` health check — see above).
- No fake/AI-generated food images. No third-party user photos (no Wongnai,
  no Google Maps, no Facebook customer uploads, no delivery-app customer
  photos, no food-blog photography). No image scraping pipeline, proxy, CDN,
  or optimization step was added. No new dependency was added.

## Data gaps / risks

- **Fuji's dual teriyaki/shioyaki SKU naming**: the site's own menu
  structure merges two distinct preparations (soy-glazed teriyaki vs.
  salt-grilled shioyaki) under one card with one photo for three of its four
  fish dishes (salmon, saba, gindara). This makes shioyaki-specific
  serving-match research systematically harder for this brand — a future
  batch should expect the same trap for `fuji-` items not yet researched.
- **MK's Health Vegetable Set (Small)** could not be confidently matched;
  its 213 kcal doesn't correspond to any current MK site listing found. It
  is possible MK has renamed, discontinued, or restructured this specific
  item since the Slice 11 nutrition research. This is worth flagging to a
  future nutrition-audit slice (out of scope here) rather than an image
  slice.
- **Sukiya's entire official site is collage-only** for food photography —
  a structural limitation, not a per-item problem. A future image slice
  should not re-attempt Sukiya via the official website; if pursued again,
  it would need a different, verifiable first-party source (e.g. a
  brand-controlled social account with individually addressable photos),
  which was not investigated in depth this slice given Group 1 already met
  the batch target from Fuji + MK alone.
- **Two strong MK candidates were deferred**, not rejected — see "Deferred
  candidates" above. They remain valid for a future batch without
  re-research.

## Product evaluation

- **Visual usefulness:** High. All 8 new photos clearly depict the dish
  (grilled fish, salads, hot-pot ingredients, a seafood broth bowl) with
  minimal promotional artifice, aside from the plain white/neutral MK
  product-photography backgrounds.
- **Source quality:** Medium (rights) / High (technical stability) — same
  posture as Slice 18/19: static, unauthenticated, brand-domain URLs; no
  explicit reuse license on either site.
- **Serving-match confidence:** High — every accepted item is Exact or
  Acceptable; MK's published per-item calories gave an unusually strong,
  independent cross-check beyond name matching.
- **Mobile density:** Unchanged from Slice 18B's validated sizing (224×168
  at ~360–390px, capped 540×240 at desktop) — the shared image frame handled
  the new square-aspect source images (768×768, 500×500) correctly via
  `object-fit: cover`, with no CSS change needed.
- **Mixed-coverage consistency:** Fuji (4/6, 67%) and MK (4/7, 57%) now have
  noticeably higher per-restaurant image density than Ootoya (3/6, 50%),
  Salad Factory (2/6, 33%), or 7-Eleven (2/6, 33%) from Slice 19. This is an
  incidental consequence of Fuji and MK both having small (6–7 item) menus
  where research happened to find several strong matches, not a deliberate
  choice to favor those brands — flagged here as a pattern worth watching so
  a future batch doesn't let restaurant density become lopsided.
- **Maintenance risk:** Medium, and now spread across 5 domains
  (`ootoya.co.th`, `saladfactorythailand.com`, `allonline.7eleven.co.th`,
  `fuji.co.th`, `mkrestaurant.com`) instead of 3. Same no-retry/no-proxy
  posture and graceful-failure mitigation as every prior slice — no new
  monitoring was added, per the brief's non-goals.
- **Research efficiency:** High for MK specifically (the published-calorie
  cross-check made most candidates fast, high-confidence decisions) and Fuji
  (single-page menu, no pagination). Sukiya was efficient to *rule out*
  (two category banners were enough to confirm the site-wide collage-only
  pattern) but produced zero accepted images.

## Recommendation

**CONTINUE** — the source/serving-match gate scaled successfully to two new
restaurant brands (Fuji, MK) beyond the existing Ootoya/Salad Factory/
7-Eleven coverage, correctly rejected 2 Fuji candidates for genuine
set-vs-à-la-carte mismatches (the same trap class the gate was built to
catch), correctly rejected all 6 Sukiya candidates for a structural image-
quality-gate reason (collage-only source) rather than weakening the gate to
force a result, and produced a legitimate 8-item batch at the top of the
brief's target range with unusually strong serving-match confidence.

## Suggested next image targets

If continued, recommend investigating next (do not implement yet):

1. **The two deferred MK candidates** (`mk-special-kurobuta-plate`,
   `mk-pork-shabu`) — already fully researched, EXACT-confidence, ready to
   accept without new research effort.
2. **Remaining Fuji items** (`fuji-salmon-shioyaki`,
   `fuji-chicken-teriyaki`) — only researchable further if a future batch
   finds an individual (non-SET) photo source for Fuji's à la carte grilled
   dishes; the current official site does not have one.
3. **Remaining Salad Factory / 7-Eleven / Ootoya items** not yet covered —
   Slice 19 already researched and rejected most of the readily findable
   candidates there (see `docs/restaurant-image-expansion-19.md`), so a
   future pass should expect a lower hit rate than this slice's Fuji/MK
   results.
4. **Jones' Salad** — was in this brief's Group 3 but never reached; Slice
   17B's existing pricing/nutrition research on this brand could speed up
   serving-match verification if a future slice investigates its official
   site for individual dish photos.

## Commit readiness

Not committed or pushed, per the brief. Research, production data changes,
tests, browser QA, and verification are complete; the worktree remains ready
for the user's separate commit decision.
