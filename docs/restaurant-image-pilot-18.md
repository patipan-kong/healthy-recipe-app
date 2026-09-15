# GoodFood V2 — Real Food Image Pilot (Slice 18)

Slice 18 asks one product question: does a real food image materially help
Restaurant Pick Focus without creating copyright, maintenance, performance, or
visual-density problems? This is a pilot, not a dataset-wide image rollout —
images are scoped to Pick Focus only, for a small, researched set of items.

## Scope split: Slice 18 research vs Slice 18B validation

Slice 18 was the source, rights, data-model, and implementation pilot. Its
research findings remain in the sections below: two Ootoya Thailand
official-remote images were accepted, one misleading Shima Hokke image was
rejected, and no image files were bundled.

Slice 18B is the real-browser validation pass requested after that pilot. It
used the local dev build in the Codex in-app browser at 390×844, 360×800, and
1440×900, in both English and Thai. The observations, measured facts, and
product judgment are kept separate below. Slice 18B made no production-code
changes because the browser pass did not prove a concrete P1–P3 defect.

## Entry state

- Branch `main`, HEAD `df7ff65` ("feat: add restaurant meal context research").
- The worktree already contained the expected uncommitted Slice 18 changes;
  Slice 18B did not discard or overwrite them.
- Baseline confirmed before browser work: 13 restaurants, 84 menu items, the
  two intended Ootoya image records, and the existing Pick Focus /
  RestaurantIdentity / restaurant-menu-favorites behavior.
- One brief-premise correction: `RestaurantMenuItem` already declared an optional `image?: string` field (`src/types.ts`), but no data populated it. It was unused dead weight, not an existing image feature — replaced outright by the new `menuImage` model below rather than kept alongside it.

## Research methodology

Candidates researched, in the brief's source priority order (official site →
official ordering/menu page → official social → other first-party → third
party for facts only, never for images):

1. `WebSearch` to find each brand's official web presence.
2. `WebFetch` against the official page(s) found, to read menu structure and
   locate any first-party photo URLs in the page markup.
3. `curl` (via Bash) to check whether the discovered image URL is actually
   fetchable as a plain, unauthenticated GET — with and without a `Referer`
   header — to test for hotlink protection, without ever sending a spoofed
   Referer in the product itself.
4. Downloaded the candidate images to a local scratch directory purely for
   inspection (format, pixel dimensions, file size, and — critically — a
   visual check of whether the photographed serving actually matches what our
   production record describes) and then discarded them; no restaurant image
   file is bundled into the repository.

## Candidates and findings

### Ootoya Thailand

Official site: `https://www.ootoya.co.th/` (operator: CRG International Food
Co., Ltd. — a large, established Thai F&B group; also runs Ootoya's other
regional pages). Menu listing at `/menu.php`, with a per-item detail page at
`/menu-details.php?id=N` that carries a full-resolution photo for most items.
Footer copyright: "© 2016 CRG International Food Co., Ltd." — standard
all-rights-reserved notice, no reuse/redistribution grant found anywhere on
the site (no Terms of Use page with an image license was located).

| Item | Source URL | First-party | Format / dims | Stable-looking URL | Hotlink needed | Redistribution permission | Depicts our exact production serving | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Charcoal-Grilled Mackerel (`ootoya-grilled-mackerel`) | `ootoya.co.th/menu-details.php?id=3` | Yes | PNG, 800×600 (628 KB) | Static file path under the brand's own domain; not a signed/expiring URL | No — loads with no `Referer` and any `Referer` alike (no hotlink protection) | Not explicit (standard copyright only) | **Yes** — plate shows the grilled fish with grated daikon and a seaweed side only, no rice/soup, matching our item's "served à la carte" note | **Accept — remote (official-remote)** |
| Charcoal-Grilled Shima Hokke (`ootoya-shima-hokke-grilled`) | `ootoya.co.th/menu-details.php?id=1` | Yes | PNG, 800×600 (1.08 MB) | Same pattern as above | No | Not explicit | **No** — the photo shows the full teishoku *set* (rice, miso soup, chawanmushi, extra sides), but our production record for this item is explicitly à la carte ("rice and miso soup are not included in this figure"). Using this photo would visually contradict our own serving note and overstate the portion. | **Reject — serving mismatch, not a rights issue** |
| Charcoal-Grilled Tonteki Pork Chop Set (`ootoya-tonteki-pork-chop-set`) | `ootoya.co.th/menu-details.php?id=30` | Yes | PNG, 800×600 (1.05 MB) | Same pattern as above | No | Not explicit | **Yes, reasonably** — our production item is explicitly the Set version (750 kcal, already-complete meal context, includes rice/miso soup/pickles); the photo shows the pork chop with cabbage salad, potato salad, and set-style items visible in the background (soup bowl, chawanmushi cup) | **Accept — remote (official-remote)**, alt text kept modest about exactly what's visible rather than asserting every listed component is in frame |

The Shima Hokke rejection is the concrete example the brief asked us to watch
for: "does the image create a misleading expectation about exact serving?" —
here, yes, so it was excluded even though the source itself is clean.

### Santa Fe' Steak Thailand

No single official corporate website was found. `WebSearch` surfaced only:
review/aggregator sites (TripAdvisor, RestaurantGuru, Menustic), and a
fragmented social presence — at least half a dozen *separately run,
branch-specific* Facebook pages (e.g. "Santa Fe' Steak @ IT Square", "Santa Fe
Steak, Central Plaza, Suratthani", "Santa Fé Steak Pattanakarn") plus one
possible brand-wide account (`facebook.com/santafesteak.th`) and a possible
Instagram (`instagram.com/santafesteak_th`). `WebFetch` could not render
either Facebook or Instagram (both are JS-rendered/login-gated from a
non-browser fetch — confirmed by fetching both and getting only a login shell
or an Instagram app-icon placeholder back, no bio/content/links).

This independently corroborates something already recorded in this dataset:
`santaFeEstimateNote` in `src/restaurants.ts` (written for an earlier, unrelated
nutrition-research slice) already says *"the official site's menu is
image-only"* and that even the Thai menu item names had to be confirmed via a
third-party food blog, not the official site. Two independent research passes
now agree Santa Fe' Steak has no clean, brand-controlled, individually
addressable food-photo source.

| Item | Source examined | First-party | Decision |
| --- | --- | --- | --- |
| Salmon Steak (`santa-fe-salmon-steak`) | No official site with individual item photos found; only fragmented branch social pages, not renderable/verifiable from this session's tooling | No verifiable first-party source | **No image** |
| Dory Fish Steak (`santa-fe-dory-fish-steak`) | Same | Same | **No image** |

Per the brief, "publicly accessible" (e.g., a branch's Facebook photo) is not
treated as equivalent to "permission to redistribute," and an unverifiable
source fails the stability/provenance bar on its own regardless of rights.

## Rights / source decision

**Chosen strategy: Option B — remote first-party image (hotlinked), not
bundled**, for the two accepted Ootoya items only.

- Not bundled (Option A): CRG's site carries no explicit redistribution
  license, only a standard copyright notice. Downloading and shipping the PNG
  inside our own repo/build would be an uncompensated copy without a granted
  right, which the brief explicitly wants avoided ("do not treat 'publicly
  accessible' as equivalent to 'permission to redistribute'").
- Remote link is chosen instead of no image (Option C) because: the URL is
  clearly on the brand's own domain, requires no access-control bypass (`curl`
  confirmed the asset loads with no `Referer` and with an arbitrary one — no
  hotlink protection exists to work around), is a static file path rather than
  a signed/expiring URL, and technically renders correctly as a plain `<img>`
  from a foreign origin.
- **Maintenance risk (documented, not hidden):** Ootoya Thailand is one
  regional brand's own small site, not a CDN built for third-party embedding.
  If they redesign `ootoya.co.th`, rename the upload path, or take the item
  off the menu, the image will silently start 404ing. The pilot's graceful
  no-broken-image fallback (Section I) is exactly the mitigation for that —
  there is no retry system, proxy, or monitoring added, per the brief's
  explicit non-goals.

## Model design

`src/types.ts` adds:

```ts
export type MenuImage = {
  src: string
  alt: LocalizedText
  kind: 'official-remote' | 'bundled'
  sourceUrl?: string
  sourceLabel?: LocalizedText
  asOf?: string
}
```

and `RestaurantMenuItem.image?: string` (dead, unused) is replaced with
`menuImage?: MenuImage`. Design notes:

- `kind` keeps `'bundled'` as a documented-but-unused option even though this
  pilot uses only `'official-remote'` — the discriminator costs nothing (the
  renderer treats both identically, a plain `<img src>`) and avoids a type
  migration the moment a future slice finds a genuinely reusable asset.
- No gallery/array, no restaurant-wide image, no ranking — single optional
  object per menu item, exactly as scoped.
- `sourceLabel`/`sourceUrl` live on the image record (not global i18n copy)
  because provenance is inherently per-source data, not app chrome — this
  keeps the string "Image from Ootoya official website" as data the next
  restaurant's research can simply not populate, rather than a hardcoded
  Ootoya-specific UI string.
- Validation (`validateMenuImage` in `src/meal-context.ts`, following the
  existing `validateMenuPrice`/`validateMealContext` pattern exactly, wired
  into `validateRestaurantMenuItems`) fails safely: a malformed `menuImage`
  produces an `Invalid menu image: <id>` string, never a thrown exception.

## Pilot items (exactly 2, well under the 5-item cap)

- `ootoya-grilled-mackerel` — Ootoya Thailand, official-remote image.
- `ootoya-tonteki-pork-chop-set` — Ootoya Thailand, official-remote image.

No menu names, nutrition, confidence, meal context, price, serving notes, or
restaurant/menu membership were changed for any item. No factual defect was
discovered during this research pass (the Slice 17B provenance notes already
on file for these items held up).

## Files / assets changed

- `src/types.ts`, `src/meal-context.ts`, `src/restaurants.ts` — model + validation + pilot data (2 `menuImage` records).
- `src/menu-image.tsx` — new `MenuItemImage` component (image + graceful failure + attribution).
- `src/App.tsx` — three-line wire-up: render `MenuItemImage` in the restaurant-local Pick Focus card and in `ExploreItemCard` only when `focus` is true.
- `src/styles.css` — one new restrained image block (`.menu-item-image*`), no other rules touched.
- `src/menu-image.test.tsx` (new), `src/meal-context.test.ts` (extended) — 24 new tests.
- **Zero image files added to the repository.** Both images are hotlinked PNGs served by `ootoya.co.th` (628 KB and 1.05 MB respectively, 800×600 each) — not fetched, converted, or stored by this app at build or run time.

## Pick Focus UX

- Restaurant-local Pick Focus (`RestaurantMenuView`'s `.menu-pick-card`): image renders above the existing copy block, inside the same card; name/nutrition/meal-context/price/favorite control all keep their existing order and markup below it.
- Explore Pick Focus (`ExploreItemCard` with `focus` prop): identical placement, gated strictly on `focus` — the exact same component renders the non-focused list-row variant with the image intentionally omitted (a single boolean prop, not a duplicated component).
- Everywhere else — normal restaurant menu rows, normal Explore result cards, Favorites, Restaurants list, Random Restaurant result, recipe cards, navigation — was left untouched and verified via tests to render zero `.menu-item-image` nodes even when the underlying item has one.

## No-image / failure behavior

`MenuItemImage` (`src/menu-image.tsx`) returns `null` whenever `image` is
undefined or has already failed to load — no placeholder box, no "image
unavailable" text, no layout reservation. On the `<img>`'s `error` event it
sets local `failed` state and re-renders to `null`, matching the existing
`RecipeImage` failure pattern already used for recipe photos in this app,
except the fallback here is "nothing" rather than an emoji (recipes always
have an image; a menu item without a photo is meant to look identical to one
that was never photographed — no first-class "broken" state). Verified by a
test that dispatches a synthetic `error` event on the image and asserts the
image region disappears while the name/nutrition remain.

## Attribution / accessibility

- Alt text is `LocalizedText`, stored per image, written from what is actually
  visible in the photo rather than the full menu-item name (e.g. "Charcoal-
  grilled mackerel served with grated daikon and a wakame seaweed side" /
  Thai equivalent) — verified in Thai and English via tests.
- Attribution is shown as a small caption below the image using the brief's
  suggested copy exactly ("Image from Ootoya official website" / "ภาพจากเว็บไซต์ทางการของโอโตยะ"), as a link to the human-readable menu detail page (never
  the raw asset URL) with the label text itself as the link's accessible name.
- The image itself is a plain, non-interactive `<img>` — not wrapped in a link
  and not keyboard-focusable, since it doesn't navigate anywhere; only the
  attribution caption is a link.

## Performance

- Two images total, both remote (no bundle-size impact on the app's own JS/CSS
  — `vite build` output is unchanged in kind, 808 KB JS / 28 KB CSS, matching
  the pre-existing large-chunk warning already present before this slice).
- Each `<img>` uses `loading="lazy"` and `decoding="async"`.
- File sizes (628 KB, 1.05 MB PNG) are non-trivial for a single photo — this
  is a real cost of choosing "don't touch/convert a third party's asset" over
  bundling+optimizing; documented here rather than silently accepted. No
  optimization pipeline was added, per the brief's non-goals.
- Layout: the image box uses `aspect-ratio: 4/3` (matching the source images'
  real 800×600 ratio) capped at `max-height: 240px`, `object-fit: cover`.
  Slice 18B measured the resulting boxes in the real browser; see the
  measured-facts section below.

## Slice 18B — real-browser observations

### Entry and scope

- Tested the local dev server at `http://192.168.0.15:5178/` in the Codex
  in-app browser.
- Tested English and Thai, both Ootoya image-backed items, image → no-image
  and no-image → image transitions, Explore Pick, Favorites, normal menu rows,
  accessibility, overflow, and desktop treatment.
- The browser session began with the existing mackerel favorite intact and did
  not create a new persistent favorite or change production data.

### Measured facts

| Surface | Viewport | Observed result |
| --- | --- | --- |
| Restaurant Pick — tonteki set | 390×844 | image loaded; natural 800×600; rendered image 239×179.25; card 309×619.875; `scrollX=0`; document client/scroll width 375/375 |
| Restaurant Pick — mackerel | 390×844 | image loaded; natural 800×600; rendered image 239×179.25; card 309×533; localized English alt present |
| Restaurant Pick — Shima Hokke (no image) | 390×844 | no `.menu-item-image`, no empty frame; card 309×465.6875; `scrollX=0` |
| Thai Restaurant Pick — tonteki set | 390×844 | image loaded; natural 800×600; rendered image 239×179.25; localized Thai alt and attribution present; card 309×587.9375 |
| Explore Pick — tonteki set | 390×844 | image loaded; rendered image 239×179.25; normal result rows had zero image nodes; `scrollX=0` |
| Restaurant Pick — mackerel | 360×800 | image loaded; rendered image 209×156.75; card 279×535.5; document client/scroll width 345/345; `scrollX=0` |
| Restaurant Pick — Oyakodon (no image) | 360×800 | no empty frame; card 294×182; document client/scroll width 360/360 |
| Explore Pick — tonteki set | 360×800 | image loaded; rendered image 209×156.75; normal result rows had zero image nodes; document client/scroll width 345/345; `scrollX=0` |
| Explore Pick — tonteki set | 1440×900 | rendered image 540×240, capped by `max-height`; card 610×625.8125; normal result rows had zero image nodes; document client/scroll width 1425/1425 |
| Restaurant Pick — mackerel | 1440×900 | rendered image 540×240, capped by `max-height`; card 610×503.875; document client/scroll width 1440/1440 |
| Restaurant Pick — Oyakodon (no image) | 1440×900 | no empty frame; card 610×136; document client/scroll width 1440/1440 |

Every image-backed transition kept `scrollX=0`; the route remained vertically
scrollable only when the card exceeded the viewport, which is expected for the
long meal-context/price content. No horizontal overflow appeared in any
measured state.

### Browser behavior by surface

- Both accepted items rendered in Restaurant Pick Focus and Explore Pick
  Focus. The image stayed above the existing name, nutrition, meal-context,
  price, favorite, attribution, and restaurant controls.
- Image → no-image and no-image → image transitions updated the card without
  leaving a blank frame or shifting the page horizontally. The no-image cards
  read as intentional text-first cards rather than failed image placeholders.
- Normal Ootoya menu rows, normal Explore result cards, and Favorites remained
  image-free even when the underlying item had image metadata. Favorites kept
  the restaurant identity and `View Ootoya` action; that navigation was
  exercised successfully.
- Thai copy localized the title, source label, alt text, price/date label, and
  meal-context text without clipping in the inspected states.

### Network and failure behavior

- The browser asset inventory observed exactly two Ootoya menu-image URLs,
  both remote `https://www.ootoya.co.th/...` PNGs; no new local menu-image
  asset was added. Existing `/recipes/*.webp` assets are the separate recipe
  image system and were not changed by this pilot.
- In the browser, both `<img>` elements reached `complete=true` with natural
  dimensions 800×600. The browser console returned no warning or error entries
  during the pass.
- The browser inspection surface did not expose Resource Timing entries or
  request interception/route mocking. Therefore Slice 18B records load
  completion and natural/rendered dimensions, but does not invent response
  timings or transfer sizes and does not claim a live broken-request
  simulation. The existing component test still verifies that an image error
  removes only the image region and preserves the menu content.

### Accessibility and visual judgment

- The accessibility tree exposed the image alt text, the caption as a figure
  label, and the human-readable official source link. The `<img>` had
  `tabIndex=-1`; the favorite and Pick Again controls remained keyboard/
  accessibility named controls.
- Visually, the photo adds immediate meal recognition in Pick Focus without
  becoming a hero treatment: on mobile it is 209–239px wide and 156.75–
  179.25px high; desktop caps the frame at 240px. The nutrition-first copy
  remains readable underneath.
- The 2-of-84 partial rollout reads as occasional enhancement rather than a
  broken dataset because missing images do not reserve a placeholder and the
  text-first card retains the same controls and evidence hierarchy.

## Slice 18B files changed

- `docs/restaurant-image-pilot-18.md` — added the real-browser observations,
  measured facts, limitations, and product decision.
- No production source, data, styling, test, or image asset file was changed
  during Slice 18B. No corrective fix was required.

## Tests / verification

- 24 Slice 18 tests: 10 in `src/meal-context.test.ts`
  (`validateMenuImage` unit tests + dataset-shape assertions +
  filter/search/Quick-Goals-eligibility parity with and without image
  metadata), 14 in `src/menu-image.test.tsx` (component/integration behavior
  listed above).
- Full suite: `npx vitest run` → **24 test files, 330 tests, all passing**
  (was 23 files / 306 tests before this slice).
- `npx tsc --noEmit` → clean.
- `npm run build` → succeeds (`tsc --noEmit && vite build`); pre-existing
  >500 KB chunk-size warning only, unrelated to this slice.
- `git diff --check` → exit 0 (only pre-existing LF/CRLF line-ending notices,
  no actual whitespace errors).

## Production integrity

- Restaurants: **13** (unchanged). Menu items: **84** (unchanged).
- Nutrition, meal context, prices, serving notes, restaurant/menu membership:
  unchanged for all 84 items — the only edits were adding a `menuImage` field
  to 2 existing item objects.
- No fake/AI-generated food images. No third-party user photos (no Wongnai,
  no delivery-app customer photos). No image scraping pipeline, proxy, CDN, or
  optimization step was added.

## Slice 18B product decision

**SHIP — real images improve Pick Focus and partial coverage is acceptable.**

The real-browser pass answered the open question from Slice 18: both real
photos improve immediate meal recognition in Pick Focus, while no-image cards
remain complete, compact, and structurally equivalent. The image is confined
to the decision surface, normal rows and Favorites stay image-free, the
nutrition-first hierarchy survives, and the two-of-84 coverage reads as
occasional enhancement rather than a missing-data failure. The remote PNG
weight and lack of live request interception remain documented operational
risks, not browser-proven blockers for this deliberately small pilot.

## Rollout recommendation

Ship the two-item Pick Focus pilot as-is and monitor the remote sources and
user response before expanding coverage. If a next batch is approved, keep it
small (3–5 items) and reuse the same gate: identifiable first-party source,
photo visibly matching the exact production serving, no access-control bypass,
and graceful no-image fallback. Do not re-research Santa Fe' Steak without a
new official or verifiable brand-wide source lead.

## Commit readiness

Not committed or pushed, per the brief. Browser QA, automated verification,
and documentation are complete; the worktree remains ready for the user's
separate commit decision.
