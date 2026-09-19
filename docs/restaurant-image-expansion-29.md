# GoodFood V2 — Restaurant Image Expansion Batch 3 (Slice 29)

Relation-aware content/visual-coverage slice. No product feature, no UI
redesign — the goal was to improve restaurant-menu image coverage, prioritizing
menu items that are visible through the Slice 28 Recipe ↔ Restaurant bridge.

## Entry state (2026-09-16)

- Branch `main`, HEAD `fa442d8` ("feat: connect recipes with restaurant
  menus") — worktree confirmed clean (`git status --short` empty) before any
  research or edits.
- Confirmed Slice 28 present: `src/recipe-restaurant-relations.ts` exists with
  exactly the 5 curated relations it shipped with.
- Confirmed actual counts (verified via a live dataset dump, not assumed from
  prior docs): **204 recipes, 13 restaurants, 84 menu items, 15 menuImage
  records, 24 verified MenuPrice records, 5 recipe↔restaurant relations** —
  exactly matched the brief's expected baseline.
- Focused baseline (`restaurants.test.ts` + `recipe-restaurant-relations.test.ts`
  + `recipe-restaurant-bridge-app.test.tsx` + `menu-image.test.tsx`): 4 files /
  104 tests passing.

## Existing image coverage (before this slice)

| Restaurant | Items | Images | Coverage |
| --- | --- | --- | --- |
| Ootoya | 6 | 3 | 50% |
| Salad Factory | 6 | 2 | 33% |
| 7-Eleven Thailand | 6 | 2 | 33% |
| Jones' Salad | 7 | 0 | 0% |
| Fuji Japanese Restaurant | 6 | 4 | 67% |
| MK Restaurants | 7 | 4 | 57% |
| Sukiya | 6 | 0 | 0% |
| Santa Fe' Steak | 7 | 0 | 0% |
| Nittaya Kai Yang | 7 | 0 | 0% |
| Zaab Eli | 7 | 0 | 0% |
| Somtam Nua | 8 | 0 | 0% |
| ThongSmith | 5 | 0 | 0% |
| The Steak & More | 6 | 0 | 0% |
| **Total** | **84** | **15** | **17.9%** |

## Relation-linked priority audit (before this slice)

Of the 5 Slice 28 relations, only 1 menu item already had an image:

| Recipe | Menu item | Image before? | Price before? |
| --- | --- | --- | --- |
| japanese-shioyaki-salmon-sweet-potato | `fuji-salmon-shioyaki` | No | No |
| grilled-mackerel-bowl | `ootoya-grilled-mackerel` | **Yes** | Yes |
| chicken-teriyaki-rice-bowl | `fuji-chicken-teriyaki` | No | No |
| grilled-chicken-caesar-salad | `jones-caesar-chicken-salad` | No | No |
| glass-noodle-seafood-salad | `steak-and-more-yum-woon-sen` | No | No |

The other 4 relation-linked menu items — the entire reason this slice
prioritizes relations — were the first and hardest-researched candidates.

## Research scope

Researched, in priority order:

1. **Relation-linked items lacking an image** (4): `fuji-salmon-shioyaki`,
   `fuji-chicken-teriyaki`, `jones-caesar-chicken-salad`,
   `steak-and-more-yum-woon-sen`.
2. **Deferred Slice 24 candidates** (2, reviewed via
   `docs/restaurant-image-expansion-24.md` first, as instructed):
   `mk-special-kurobuta-plate`, `mk-pork-shabu`.
3. **Coverage-balance restaurants** (6 zero-coverage brands suggested by the
   brief): Jones' Salad, The Steak & More, Nittaya Kai Yang, Zaab Eli, Somtam
   Nua, ThongSmith.

Roughly 16 serious item candidates were researched across 8 restaurant brands.
Research stopped once remaining sources for the unresearched brands (Zaab Eli,
Somtam Nua, ThongSmith) turned out to be third-party listing sites or social
accounts only, per the brief's stop-early rule ("only third-party/user-generated
photos remain").

## Research method

`WebSearch` to locate each brand's official site, `WebFetch`/`curl` to fetch
raw HTML and extract exact `<img>`/hidden-input `src` values (never guessed
from filenames), `curl` with and without headers to check hotlink/WAF
behavior, then a direct download to a scratch directory outside the repo for
pixel-level visual inspection against the production record (serving basis,
included sides, dish identity, protein/preparation). All scratch downloads
were discarded after inspection; zero image files were bundled into the repo.

- **Fuji** (`fuji.co.th/menu/?lang=en`): re-fetched the full menu HTML and
  searched for any individual (non-SET) photo for the à la carte shioyaki/
  teriyaki dishes. One new-looking `SALMON-TERIYAKI-*.png` file was found, but
  tracing its HTML context showed it belongs to "Salmon Teriyaki **Roll**" (a
  sushi roll SKU), not the grilled-fish dish — a near-miss that was correctly
  rejected on inspection. No individual à la carte photo exists for either
  target dish; only the combined dual-SKU SET photos Slice 24 already
  documented and rejected.
- **MK Restaurants** (`mkrestaurant.com/en/mk-menu/suki/`): re-fetched the
  suki menu page and `curl`'d the two deferred image URLs directly. Both
  returned `200`, identical content-type and byte size to Slice 24's
  documented figures (93,407 B / 103,619 B) — confirming the source is stable
  and unchanged since Slice 24's original research.
- **Jones' Salad** (`jonessalad.com/menu/salad/`): every category (including
  "Western Style", which contains Chicken Caesar Salad) is a single ~750 KB
  poster-style image combining 5–6 dishes with names, prices, and an
  "advertising purposes only" disclaimer — the same menu-sheet-collage
  pattern Slice 24 rejected for Sukiya. No individually addressable photo
  exists for any Jones' Salad item on the official site.
- **The Steak & More**: a new (Dec 2024) Minor Food Group concept. No
  standalone official website with a menu was found — only a corporate
  overview page (no dish photos) and social channels (Facebook/LINE/TikTok).
  Checked whether it's onboarded to Minor's own `1112 Delivery` platform; it
  is not one of the 8 listed core brands. No verifiable first-party structured
  source found.
- **Nittaya Kai Yang** (`nittayakaiyang.com`): a genuine WordPress site with
  individually addressable per-dish photos (not collages), found across a
  "recommended menu" blog post and a paginated `/menus-go/` product-style
  grid. Cross-checked each candidate's Thai dish name against the production
  record's exact Thai name before accepting.
- **Zaab Eli / Somtam Nua / ThongSmith**: no verifiable first-party website
  was found for any of the three (only Tripadvisor/OpenRice/mall-directory
  listings, or Facebook/Instagram-only presence; one search surfaced a
  same-named but unrelated US food-truck business for "Zaab Eli" that was
  correctly not used). Research stopped here per the brief's stop-early rule.

## Candidate decisions

| Restaurant | Item id | Candidate | Serving match | Decision | Reason |
| --- | --- | --- | --- | --- | --- |
| Fuji | `fuji-salmon-shioyaki` | dual-SKU SET photo (re-confirmed) | Mismatch | **REJECT** | Only photo is the combined teriyaki/shioyaki SET card; record is à la carte, no rice. Same defect Slice 24 found. |
| Fuji | `fuji-chicken-teriyaki` | dual-SKU SET photo (re-confirmed) | Mismatch | **REJECT** | Only photo is the SET card; record is à la carte. Same defect Slice 24 found. |
| Jones' Salad | `jones-caesar-chicken-salad` | "Western Style" collage poster | N/A | **REJECT — image quality gate** | Menu-sheet collage combining 6 dishes with prices/disclaimer in one file; no individually addressable photo. |
| The Steak & More | `steak-and-more-yum-woon-sen` | — | — | **REJECT — no source** | No official website, no structured menu platform found within budget. |
| MK | `mk-special-kurobuta-plate` | reconfirmed Slice 24 candidate | Exact | **ACCEPT — remote** | Byte-identical to Slice 24's documented research; source still live. |
| MK | `mk-pork-shabu` | reconfirmed Slice 24 candidate | Exact | **ACCEPT — remote** | Byte-identical to Slice 24's documented research; source still live. |
| Nittaya Kai Yang | `nittaya-grilled-chicken-quarter` | "ไก่ย่างสูตรต้นตำรับ" (Original Recipe Grilled Chicken) photo | Acceptable | **ACCEPT — remote** | Site's own #1 signature dish, explicitly named "ต้นตำรับ" (original recipe) matching the record's Thai name; photo shows the whole/half chicken the record's servingNote says it's sold as (one leg-thigh-quarter portion of that same dish). |
| Nittaya Kai Yang | `nittaya-som-tam-salted-egg` | "ส้มตำไข่เค็ม" photo, English alt "Papaya salad with salted egg" | Exact | **ACCEPT — remote** | Thai name is byte-identical to the production record; English alt text matches the record's English name exactly. |
| Nittaya Kai Yang | `nittaya-tom-saep-grilled-chicken-soup` | "ต้มโย้งไก่ย่าง" (Tom Yong) photo | Mismatch | **REJECT** | Site's dish is named "ต้มโย้ง" (Tom Yong); production record is "ต้มแซ่บ" (Tom Saep) — a different named soup preparation, not a naming variant. |
| Nittaya Kai Yang | `nittaya-grilled-pork-neck` | "Grilled pork neck spicy salad" (ลาบ-style) | Mismatch | **REJECT** | This is a larb-style salad made with grilled pork neck, not the standalone grilled-pork-neck dish the production record represents. |
| Nittaya Kai Yang | `nittaya-larb-moo` | "ลาบหมู" ("Minced pork spicy salad") — exact name match | Exact (identity) | **REJECT — source unreachable** | Every size variant of this specific file returned a consistent `403` across repeated attempts (including with a browser User-Agent and Referer), while every other file on the same domain succeeded. Left image-free rather than forcing an unreliable source. |
| Zaab Eli | (whole restaurant) | — | — | **REJECT — no source** | No verifiable official website for the Thai restaurant chain (only third-party listings, plus one same-named but unrelated US food truck). |
| Somtam Nua | (whole restaurant) | — | — | **REJECT — no source** | No standalone official website; only a Facebook page. |
| ThongSmith | (whole restaurant) | — | — | **REJECT — no source** | No standalone official website; only Instagram and third-party press/mall pages. |

## Rights / source assessment

Identical posture to Slice 18/19/24: **Option B — remote first-party image
(hotlinked), not bundled**. Every accepted image loads directly from the
brand's own domain (`mkrestaurant.com`, `nittayakaiyang.com`) via a plain
`GET`. No explicit redistribution license was found on either site (standard
copyright only) — rights confidence is **Medium**, consistent with every
prior batch.

`nittayakaiyang.com` occasionally returned an intermittent `403` from a
generic hosting WAF on the very first request to a given path (observed once
on the whole-chicken URL, resolved on retry with no special headers) and
consistently on the `nittaya-larb-moo` file specifically (not intermittent —
confirmed 403 across every size variant, with and without a browser
User-Agent/Referer). This is documented rather than routed around: the
intermittent case was retried honestly (not masked), and the consistently
unreachable file was left unaccepted rather than forced.

## Serving-match assessment

| Item | Rating |
| --- | --- |
| Special Kurobuta (Single Plate) (MK) | Exact |
| Pork Shabu (MK) | Exact |
| Papaya Salad with Salted Egg (Nittaya) | Exact |
| Original Recipe Grilled Chicken, Leg-Thigh Quarter (Nittaya) | Acceptable — photo shows the whole/half chicken the record's own servingNote says this quarter-portion is carved from, not a standalone thigh-only SKU |

No Uncertain or Mismatch item is present in the accepted set.

## Existing image health check

All 15 pre-existing `menuImage` URLs were re-fetched with a plain `curl` GET
during this slice. All returned `200 OK`, unchanged content-type, and byte
sizes matching the previously documented figures exactly (e.g. Ootoya
mackerel 628,218 B, Fuji chirashi 1,250,149 B, MK seafood suki 50,800 B —
every one matched Slice 18/19/24's own numbers to the byte). No dead URL, no
redirect to unrelated content, no existing image required documentation as
broken.

## Files changed

- `src/restaurants.ts` — added `asOf29` and `nittayaImageSourceLabel`
  constants; added a `menuImage` object to 4 existing items
  (`mk-special-kurobuta-plate`, `mk-pork-shabu`,
  `nittaya-grilled-chicken-quarter`, `nittaya-som-tam-salted-egg`). No other
  field (name, nutrition, price, meal context, serving note, category, tags,
  restaurant/menu membership, relation) was changed for any of the 84 items.
- `src/meal-context.test.ts` — updated 3 outdated Slice-24-era coverage
  assertions (15 → 19 items, updated id lists); replaced the now-inaccurate
  "leaves the deferred MK candidates without a menuImage" test with a new
  "Slice 29 image expansion batch" describe block (8 tests: MK
  reconfirmation, Nittaya acceptance, Priority-1 relation items confirmed
  still image-free, `nittaya-larb-moo` confirmed still image-free,
  price/restaurant/menu-item counts unchanged, nutrition/membership
  unchanged for the 2 new Nittaya items).
- `src/menu-image.test.tsx` — updated 2 outdated Slice-24-era coverage-ceiling
  assertions (15 → 19, five → six restaurants); added a new "Slice 29
  image-backed items render in Pick Focus" describe block (3 tests: renders
  in restaurant-local Pick Focus, renders in Explore Pick Focus, degrades
  gracefully on image failure).
- `src/random-meal-app.test.tsx` — added 1 new test deterministically
  selecting `nittaya-grilled-chicken-quarter` via Random Meal and asserting
  the image renders with no special-casing.
- `src/recipe-restaurant-relations.test.ts` — added 1 new test confirming the
  relation count and exact pairs are unchanged from Slice 28 (this is an
  image-only slice).
- `docs/restaurant-image-expansion-29.md` — this file.
- **Zero image files added to the repository.** All 4 new images remain
  hotlinked JPEG/PNG files served directly by `mkrestaurant.com` and
  `nittayakaiyang.com`.
- **No production/UI code was touched** — `src/App.tsx`, `src/menu-image.tsx`,
  `src/recipe-restaurant-relations.ts`, and `src/styles.css` are unchanged
  from Slice 28.

## Coverage after this slice

- Before: 15 / 84 (5 restaurants: Ootoya, Salad Factory, 7-Eleven, Fuji, MK)
- New: 4
- After: **19 / 84** (6 restaurants: Ootoya, Salad Factory, 7-Eleven, Fuji, MK,
  **Nittaya Kai Yang**)

By restaurant: MK now 6/7 (was 4/7), Nittaya Kai Yang now 2/7 (was 0/7). All
other 11 restaurants unchanged.

## Relation coverage before / after

| Relation-linked item | Image before | Image after |
| --- | --- | --- |
| `fuji-salmon-shioyaki` | No | No |
| `ootoya-grilled-mackerel` | Yes | Yes (unchanged) |
| `fuji-chicken-teriyaki` | No | No |
| `jones-caesar-chicken-salad` | No | No |
| `steak-and-more-yum-woon-sen` | No | No |

**Priority 1 yielded zero new accepted images.** Despite being researched
first and hardest, every relation-linked item without an image was blocked by
a genuine, independently-verified structural reason (SET-only photos,
menu-sheet collage, or no official source at all). This is reported plainly
rather than softened — see Product Evaluation below.

## Pick Focus integration

Both new Nittaya images render through the existing `MenuItemImage`
component in the restaurant-local Pick Focus card and the Explore Pick Focus
card, using the exact same `.menu-item-image`/`.menu-item-image-frame`
markup and CSS as every prior batch — no UI code was touched.

## Recipe ↔ Restaurant bridge QA

None of the 4 new images belong to a relation-linked item, so the bridge's
visual behavior is unchanged from Slice 28. Verified directly in the browser:
the Caesar Chicken Salad Pick Focus card (relation-linked, still no
restaurant image) renders the Slice 28 "Want to make it? / Try a similar
recipe" bridge cleanly, with no restaurant photo, no fabricated price, and no
layout defect — confirming the two slices compose correctly. The
image-bearing Ootoya mackerel relation (unaffected by this slice) was also
re-verified: Recipe Detail → View restaurant → Restaurant Pick Focus and the
reverse both still work, with no navigation/state regression.

## Explore / Random Meal integration

Verified via a deterministic unit test (mirroring Slice 24's own pattern)
that `nittaya-grilled-chicken-quarter`'s image renders through Random Meal
with zero special-casing, exactly as every prior image batch has.

## Browser QA

Real headless Chromium (Playwright, driving `npm run dev`) at all 4 required
viewports — **360×800, 390×844, 430×844, 1440×900** — in English (locale
switched before each run) covering: the relation-linked no-image item
(Caesar Chicken Salad) rendering cleanly with its Slice 28 bridge, both new
Nittaya images rendering in Pick Focus, both reconfirmed MK images rendering
in Pick Focus, existing Ootoya/Fuji image regression, the Recipe Detail
bridge regression, Favorites (stayed image-free), the Cook/Buy Hub, and a
long-name sanity check (Somtam Nua). Zero console errors at any viewport.

## Overflow measurements

`document.documentElement`/`body` `scrollWidth` vs `clientWidth`, and
`window.scrollX`, measured at every step of every scenario at all 4
viewports: **equal / 0 at every single measurement, no exceptions.**

## Failure behavior

Simulated a failed image load (`error` event) on a new Nittaya image-backed
Pick Focus card: the image region disappears entirely (no broken-image icon,
no empty reserved frame), while the dish name and nutrition remain fully
usable — identical graceful behavior to every prior batch, verified by test.

## Performance findings

| Item | Format | Dimensions | Size |
| --- | --- | --- | --- |
| Special Kurobuta (Single Plate) | JPEG | 500×500 | 93,407 B |
| Pork Shabu | JPEG | 500×500 | 103,619 B |
| Original Recipe Grilled Chicken (whole/half) | PNG | 768×769 | 822,705 B |
| Papaya Salad with Salted Egg | JPEG | 1024×1024 | 91,028 B |

None exceed 1 MB (no HEAVY/VERY HEAVY flag needed). The Nittaya chicken PNG
(823 KB) is the heaviest of the four but is comparable to — not larger than —
the existing Ootoya/Fuji PNGs already in production (628 KB–1.25 MB).

## Tests / verification

- Added/updated 16 tests across 4 files (8 new in `meal-context.test.ts`, 3
  new + 2 updated in `menu-image.test.tsx`, 1 new in `random-meal-app.test.tsx`,
  1 new in `recipe-restaurant-relations.test.ts`).
- Full suite: **31 test files, 468 tests, all passing** (was 456 before this
  slice — net +12 after accounting for 1 removed/replaced test). One
  pre-existing flaky test (`restaurant-app.test.tsx`'s "avoids repeating the
  same pick", `Math.random`-timing-dependent, documented since Slice 24) was
  observed once and confirmed to pass in isolation on retry — unrelated to
  this slice, not touched.
- `npx tsc --noEmit` → clean.
- `npm run build` → succeeds; pre-existing >500 KB chunk-size warning only.

## Production integrity

- Restaurants: **13** (unchanged). Menu items: **84** (unchanged). Verified
  `MenuPrice` records: **24** (unchanged). Recipe ↔ Restaurant relations:
  **5**, same exact pairs as Slice 28 (unchanged).
- Nutrition, meal context, prices, serving notes, categories, tags, and
  restaurant/menu membership: unchanged for all 84 items — the only edits
  were adding a `menuImage` field to 4 additional item objects.
- The existing 15 images are byte-for-byte unchanged (verified by direct
  `curl` health check).
- No fake/AI-generated images. No third-party user photos. No image
  scraping pipeline, proxy, CDN, or optimization step was added. No new
  dependency was added to the project (Playwright QA remained scoped to the
  session scratchpad, outside `package.json`).

## Product evaluation

1. **Did prioritizing relations materially improve the bridge?** Not this
   batch — zero of the 4 image-less relation-linked items got an image, each
   for an independently verified reason. The prioritization was still the
   right process (it's what surfaced the Fuji SET-photo trap and the Jones'
   collage trap concretely, rather than assuming), it simply didn't pay off
   in accepted images this time.
2. **Does mixed image coverage still feel intentional?** Yes — every accepted
   image passed the same name/serving-identity gate as every prior batch; two
   restaurants gained partial coverage (MK 4→6/7, Nittaya 0→2/7) rather than
   spreading thin ineffectually.
3. **Weakest visually important coverage now?** Jones' Salad and The Steak &
   More remain at 0/7 and 0/6 respectively, and both are directly
   relation-linked restaurants — this is the most visible remaining gap.
4. **Are images becoming too prominent relative to nutrition?** No — the
   shared `MenuItemImage`/`.menu-item-image-frame` sizing is unchanged from
   Slice 18B; nutrition, price, and serving note all remain visible alongside
   every image.
5. **Do large remote images create a noticeable performance concern?** No —
   the heaviest new image (823 KB) is within the existing Ootoya/Fuji range;
   no HEAVY/VERY HEAVY threshold was crossed.
6. **Is the remote-hotlink strategy still acceptable for this pilot?** Yes,
   unchanged posture from Slice 18 — though this batch surfaced a new
   maintenance data point: `nittayakaiyang.com` has an intermittent WAF that
   occasionally 403s a fresh request (worth knowing if a future slice
   revisits this domain).
7. **What should the next work be?** **D — stop content expansion and
   polish.** Three consecutive image-focused slices (18/19, 24, 29) have each
   found a shrinking pool of genuinely strong candidates, with real,
   independently-verified structural blockers (collages, SET-only photos, no
   official sites) now covering most of the remaining zero-coverage
   restaurants (Jones', Santa Fe, Sukiya, Zaab Eli, Somtam Nua, ThongSmith,
   Steak & More). Another image batch is unlikely to find much left; recipe
   expansion or price expansion would touch fresh ground instead.

## Remaining gaps / risks

- Jones' Salad and The Steak & More — both directly relation-linked
  restaurants — remain fully image-free. Jones' is structurally blocked
  (collage-only source); Steak & More has no findable official source at all
  right now (it's a very new, small concept).
- `nittaya-larb-moo` is a confirmed EXACT-identity match that simply
  couldn't be downloaded during this slice (consistent 403). It's a ready,
  low-effort candidate for a future batch if the source becomes reliably
  reachable again.
- Nittaya Kai Yang's official site occasionally issues an intermittent 403
  challenge on a first request — worth a quick reachability re-check before
  any future slice adds more images from this domain.
- Zaab Eli, Somtam Nua, and ThongSmith remain fully unresearched beyond a
  single search pass each; a future slice with more time budget could dig
  deeper (e.g. verifying whether Instagram photos have clear-enough brand
  provenance to use under the brief's tier-4 source policy), but this was
  judged not worth forcing within this slice's budget.

## Recommendation — CONTINUE / ITERATE / STOP

**ITERATE toward D (stop content expansion, move to polish or a different
content axis)**, not another straight image batch. The gate held correctly
under real pressure this slice (it rejected the obvious padding options —
SET photos, collages, an unreachable file — rather than being weakened to
hit a number), and 4 honestly-earned images is a legitimate, smaller-than-usual
but defensible result.

## Suggested next step

Per the product evaluation above: **D — stop content expansion and polish**,
or if content work continues, **B — recipe expansion based on unmatched
restaurant dishes** (several Nittaya/Jones'/Steak & More dishes discovered
during this slice's research have no recipe counterpart yet and could seed
new Slice-28-style relations) rather than another image batch.

## Commit readiness

Not committed or pushed, per the brief. Research, production data changes,
tests, browser QA, and verification are complete; the worktree remains ready
for the user's separate commit decision.
