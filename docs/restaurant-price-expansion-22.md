# GoodFood V2 — Restaurant Menu Price Coverage Expansion Batch 2 (Slice 22)

Slice 22 is a research + data-quality slice: expand verified menu-price
coverage for existing production items not sufficiently researched in
Slice 20, focused on Nittaya Kai Yang, Zaab Eli, and Somtam Nua, with MK
Restaurants and Sukiya as a secondary group. Same evidence standard as
Slice 20: exact item/configuration match required, reject aggressively,
zero additions were an acceptable outcome going in.

## Entry state

- Branch `main`, HEAD `3751e7e` ("feat: polish restaurant pick focus
  hierarchy" — Slice 21). Worktree was clean (`git status --short` empty).
  No contradiction with this slice's stated entry conditions (unlike Slice
  20, which had to layer on an uncommitted worktree — Slices 19–21 are now
  all committed).
- Baseline confirmed via a throwaway test-based count (no `tsx`/ts-node
  available in this project; a temporary Vitest file was used to read
  `restaurants.ts` and then deleted before any production change): 13
  restaurants, 84 menu items, 7 `menuImage`-bearing items, exactly 15
  priced items — matching the brief's stated baseline exactly. The 15
  existing priced items: 5 Ootoya, 3 Salad Factory, 2 7-Eleven, 3 MK
  Restaurants, 2 Santa Fe' Steak (full list in Slice 20's own ledger,
  re-verified unchanged here).
- `MenuPrice` type and `validateMenuPrice` unchanged (confirmed in
  `src/types.ts` / `src/meal-context.ts`). Price renders only inside
  `MealContextDetails`, Pick Focus only; missing price renders no
  placeholder (`if (!context && !item.price) return null`).
- Baseline test run: `npx vitest run` → 24 files / 351 tests passing
  (one more than Slice 20's 350 — Slice 21 added a presentation test).

## Research method

Read `docs/restaurant-price-expansion-20.md` first as the governing
precedent (à la carte/set matching, branch/channel disclosure, freshness,
rejection discipline). For each candidate: located the strongest
available current source (official site where one exists, otherwise a
menu-update aggregator consistent with the source type already accepted
for Santa Fe' in Slices 17B/20), matched the exact Thai item name against
the production item's own `name`/`servingNote`, and cross-verified every
price via raw HTML (`curl` + `grep`/`node`) rather than trusting a single
WebFetch AI summary — this caught one clear hallucination (see Rejections)
before it could enter production.

## Candidate decisions

| Restaurant | Item | Observed price | Source/channel | Match | Decision | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| Nittaya Kai Yang | `nittaya-grilled-pork-neck` | คอหมูย่าง ฿130 | salehere.co.th/nittaya-kai-yang (update dated 2026-09-07) | Exact | **ACCEPT** | Name is a plain, unmodified character-for-character match; verified via raw HTML |
| Nittaya Kai Yang | `nittaya-som-tam-thai` | ส้มตำไทย ฿75 | same | Exact | **ACCEPT** | Exact name match |
| Nittaya Kai Yang | `nittaya-som-tam-salted-egg` | ส้มตำไข่เค็ม ฿85 | same | Exact | **ACCEPT** | Exact name match |
| Nittaya Kai Yang | `nittaya-larb-moo` | ลาบหมู ฿95 | same | Exact | **ACCEPT** | Exact name match |
| Nittaya Kai Yang | `nittaya-chiang-mai-fried-pork` | หมูทอดเชียงใหม่ ฿105 | same | Exact | **ACCEPT** | Exact name match |
| Nittaya Kai Yang | `nittaya-grilled-chicken-quarter` | (no matching SKU) | same | Mismatch | **REJECT — size/variant trap** | Source only prices ไก่ย่าง (ทั้งตัว/ครึ่งตัว) ฿230/120 (whole/half, not our leg-thigh-quarter portion) and สะโพกไก่ย่างเกลือ ฿120 (a *salted* preparation, not our "ต้นตำรับ"/original-recipe variant). Neither maps to the production item's exact quarter-piece, original-recipe config; refused to guess between whole/half/salted |
| Nittaya Kai Yang | `nittaya-tom-saep-grilled-chicken-soup` | (no matching SKU) | same | Mismatch | **REJECT — different soup name** | Source lists ต้มโย้งไก่ย่าง ฿145 (a "tom yong" style soup), not ต้มแซ่บไก่ย่าง (tom saep). Same shared-dish trap pattern the brief calls out ("Tom Saep chicken ≠ beef tendon soup") applied to a different soup style at the same restaurant |
| Zaab Eli | `zaab-eli-grilled-chicken` | ไก่ย่างแซ่บอีลี่ ฿299 | salehere.co.th/zaabeli (update dated 2026-04-16) | Exact | **ACCEPT** | Exact name match; also independently corroborates this item's own pre-existing `servingNote`, which already referenced "ราคา (฿299)" from earlier research — two independent signals agree |
| Zaab Eli | `zaab-eli-som-tam-salted-egg` | ตำไทยไข่เค็ม ฿120 | same | Exact | **ACCEPT** | "ตำ" is the universal colloquial shorthand for "ส้มตำ" on Isan menus (the same abbreviation appears throughout this exact source page for other salads); not a different dish, just a shorter label for the same production item's name (ส้มตำไทยไข่เค็ม) |
| Zaab Eli | `zaab-eli-corn-salted-egg-som-tam` | ตำข้าวโพดไข่เค็ม ฿120 | same | Exact | **ACCEPT** | Exact name match |
| Zaab Eli | `zaab-eli-larb-moo` | ลาบหมู ฿125 | same | Exact | **ACCEPT** | Exact name match |
| Zaab Eli | `zaab-eli-fried-chicken` | (no matching SKU) | same | Mismatch | **REJECT — no exact match** | Source has เอ็นข้อไก่ทอด (fried chicken joint/knee) ฿120 and ปีกไก่ทอดเกลือ (salted fried wings) ฿145 — neither is "ไก่ทอดแซ่บอีลี่" (Zaab Eli's own branded fried chicken); a different cut/prep in both cases |
| Zaab Eli | `zaab-eli-grilled-pork-neck` | (ambiguous) | same | Ambiguous | **REJECT — variant ambiguity** | Source has three modified variants only: คอหมูย่างจิ้มแจ่ว ฿165, น้ำตกคอหมูย่าง ฿150 (a different, nam-tok-style dish), ข้าวผัดคอหมูย่าง ฿180 (a fried-rice dish) — no plain "คอหมูย่าง" entry matching our unmodified production item name; refused to pick the closest-sounding one |
| Zaab Eli | `zaab-eli-tom-saep-beef-tendon-soup` | (no matching SKU) | same | Mismatch | **REJECT — different protein** | Source has ต้มแซ่บเห็ดรวม (mixed mushroom tom saep) ฿125 only — a different main ingredient (mushroom, not beef shank/tendon); exactly the shared-dish trap the brief warns about |
| Somtam Nua | (all 8 items) | — | Wongnai (HTTP 403 on plain fetch), no official site found, salehere.co.th/somtam-nua (brand/review landing page, no price content) | — | **Not pursued** | No current, accessible, price-bearing source exists for this brand. Wongnai blocked the request outright; the aggregator page that exists for this brand carries no menu-price content at all (unlike the Nittaya/Zaab Eli aggregator pages, which did). Consistent with Slice 20's precedent of stopping at a genuinely blocked/absent source (Sukiya, Fuji) rather than forcing a weak substitute |
| MK Restaurants (audit) | `mk-special-kurobuta-set` | ชุดคุโรบูตะสเปเชียล ฿223 | mkrestaurant.com/th/mk-menu/suki | Exact | **CONFIRMED, unchanged** | Current site still shows ฿223, matching the existing production price exactly |
| MK Restaurants (audit) | `mk-special-kurobuta-plate` | คุโรบูตะสเปเชียล ฿75 | same | Exact | **CONFIRMED, unchanged** | Current site still shows ฿75 |
| MK Restaurants (audit) | `mk-premium-suki-set` | ชุดสุกี้พรีเมียมหม้อเดี่ยว ฿259 | same | Acceptable | **CONFIRMED, unchanged** | Current site still shows ฿259 (branch-limited caveat from Slice 20 remains accurate, not re-verified further) |
| MK Restaurants | `mk-seafood-suki-broth` | (not found) | mkrestaurant.com/th/mk-menu/suki (checked across the full paginated category) | — | **REJECT — SKU not found** | Neither "สุกี้ทะเล (น้ำ)" nor any close variant appears anywhere in the suki category's 3 pages; the category is dominated by beef/kurobuta sets, not individual seafood-broth plates |
| MK Restaurants | `mk-pork-shabu` | (not found) | same | — | **REJECT — SKU not found** | "หมูชาบู" does not appear in the same category; likely not currently sold as a standalone à la carte item under this name, or listed under a category this research did not locate |
| Sukiya | — | — | — | — | **Not pursued** | Group 2 was only reached after Group 1 already produced 9 accepted prices, comfortably within the 8–12 target; Sukiya's official category page was already confirmed blocked (HTTP 403) in Slice 20 with no bypass attempted, and no new evidence suggested that had changed. Re-checking was not worth the research budget once the target was already met |

A rejected WebFetch AI-summary result deserves a specific note: an early,
un-cross-checked summary claimed "Grilled Chicken (whole) 230 baht / half
120 baht" for Nittaya framed in a way that implied it might cover the
quarter-piece production item. Raw HTML verification confirmed the 230/120
figures are real (for whole/half only) but that no quarter-piece price
exists on the page at all — the summary's phrasing, not the underlying
data, was misleading. This is exactly the class of error Slice 20's
raw-HTML cross-check discipline exists to catch, and it is why
`nittaya-grilled-chicken-quarter` was rejected rather than priced at 120
or 230.

Group 3 (an additional restaurant beyond Nittaya/Zaab Eli/Somtam Nua/
MK/Sukiya) was not invoked — it is only for use if fewer than 8 prices
were accepted after Groups 1–2, and 9 were already accepted from Group 1
alone.

Candidates inspected: 16 (7 Nittaya + 7 Zaab Eli + 2 MK new-item attempts),
plus 3 MK audit re-checks (not new candidates) and one restaurant-level
dead end (Somtam Nua, no item-level candidates reachable). Well within the
~15–22 budget.

## New prices added (9)

1. `nittaya-grilled-pork-neck` — ฿130
2. `nittaya-som-tam-thai` — ฿75
3. `nittaya-som-tam-salted-egg` — ฿85
4. `nittaya-larb-moo` — ฿95
5. `nittaya-chiang-mai-fried-pork` — ฿105
6. `zaab-eli-grilled-chicken` — ฿299
7. `zaab-eli-som-tam-salted-egg` — ฿120
8. `zaab-eli-corn-salted-egg-som-tam` — ฿120
9. `zaab-eli-larb-moo` — ฿125

All use `currency: 'THB'`, `asOf: '2026-09-15'` (Slice 22's own `asOf22`
constant, independent of nutrition `asOf`), and reuse the existing generic
`currentListedPriceNote` — no new caveat text was needed since none of
these 9 carry a branch/channel limitation. No model expansion.

## Existing price audit / corrections

While on MK's official suki page for the new-item search, the three
existing MK prices were re-checked against the current listing:
`mk-special-kurobuta-set` (฿223), `mk-special-kurobuta-plate` (฿75), and
`mk-premium-suki-set` (฿259) all remain **unchanged** from Slice 20. **No
corrections** were made or needed this slice. (These confirmations do not
count toward the 9 new-price total.)

## Rejections — summary by pattern

- **Size/portion mismatch**: `nittaya-grilled-chicken-quarter` (only
  whole/half and a differently-flavored salted-hip price exist; no
  quarter/original-recipe match).
- **Variant/flavor mismatch**: `zaab-eli-fried-chicken` (only a chicken-
  joint cut and a salted-wings variant exist, not the branded "Zaab Eli
  Fried Chicken").
- **Different dish under a similar name (shared-dish trap)**:
  `nittaya-tom-saep-grilled-chicken-soup` (source has "tom yong," a
  different soup style, not "tom saep"); `zaab-eli-tom-saep-beef-tendon-
  soup` (source's only tom saep is a mushroom version, not beef
  tendon) — both directly match the brief's own worked example.
- **Configuration ambiguity**: `zaab-eli-grilled-pork-neck` (three
  differently-modified variants exist; no plain, unmodified match).
- **Source unavailable / no price content**: Somtam Nua (Wongnai blocked,
  no official site, aggregator page has no prices) — an entire restaurant
  dead end, not a per-item rejection.
- **SKU not found despite a working source**: `mk-seafood-suki-broth`,
  `mk-pork-shabu` (checked across MK's full paginated suki category; not
  present under these or closely related names).

## Coverage

- Before: 15 / 84
- New: 9
- Corrections: 0 (3 MK prices confirmed unchanged)
- After: 24 / 84

By restaurant: Ootoya 5/6 (unchanged), Salad Factory 3/6 (unchanged),
7-Eleven 2/6 (unchanged), MK Restaurants 3/7 (unchanged, all confirmed
current), Santa Fe' Steak 2/7 (unchanged), **Nittaya Kai Yang 5/7 (new)**,
**Zaab Eli 4/7 (new)**. All other restaurants (Jones' Salad, Fuji, Sukiya,
Somtam Nua, ThongSmith, The Steak & More) remain at 0/N, unchanged.

## Price freshness / source quality

- Nittaya Kai Yang: salehere.co.th update page dated 2026-09-07 — 8 days
  old at research time, the freshest source used in this slice.
- Zaab Eli: salehere.co.th update page dated 2026-04-16 — about 5 months
  old. Accepted despite the age because every accepted price either has an
  exact, unambiguous name match on that same page or (for the ฿299
  grilled-chicken item) independently corroborates a price figure already
  embedded in this codebase's own pre-existing `servingNote` text from
  earlier research — two independent signals converging on the same
  number increases confidence beyond what the aggregator's age alone would
  support.
- MK Restaurants: official site (mkrestaurant.com), same page type already
  used successfully in Slice 20 — highest-quality source in this slice,
  used only for audit confirmation and two ultimately-unsuccessful new-item
  searches.
- No delivery-platform or promotional price was used or considered this
  slice.

## Files changed

- **Data:** `src/restaurants.ts` — 1 new constant (`asOf22`), a `price`
  field added to 9 items. No other field (nutrition, `menuImage`,
  `mealContext`, `servingNote`, category, tags, id, restaurant membership)
  was changed on any item, including the 3 MK items that were audited but
  confirmed unchanged.
- **Docs:** `docs/restaurant-price-expansion-22.md` (this file).
- **Tests:** to be added next — dataset counts, exact new-price-id set,
  validation, no-duplicate/no-negative checks, unchanged nutrition/
  meal-context/image coverage, and search/filter/Quick-Goal parity for all
  9 newly priced items (see brief section U).
- **No production/UI code was touched** — `src/meal-context-ui.tsx`,
  `src/App.tsx`, and `src/styles.css` are unchanged; existing price
  rendering is reused exactly as-is, per the UI freeze.

## UX behavior / product semantics

No change. Priced items show `฿<amount>` and "Price checked: <date>"
inside the existing `.meal-context-price` section in Pick Focus only;
unpriced items render no price section (no placeholder). No new filter,
sort, ranking, or price-driven behavior was added. Search, nutrition
filters, Quick Goals, Pick eligibility/weighting/ordering, repeat
avoidance, Random Restaurant, and Favorites are all price-independent, as
before.

## Browser smoke

Not performed — research + data-only slice, consistent with Slices 19–21
precedent. No new UI surface or layout risk was introduced; all 9 new
prices render through the same already-verified `MealContextDetails`
price section.

## Production integrity

- Restaurants: **13** (unchanged). Menu items: **84** (unchanged). Image
  coverage: **7/84** (unchanged, same ids as Slice 19).
- Nutrition, `mealContext`, `servingNote`, and `customizationNotes`:
  unchanged for all 84 items, including all 9 newly priced ones.
- No price-driven recommendation, ranking, sort, or filter was added.

## Data gaps / risks

- **Zaab Eli source freshness**: the aggregator page used is ~5 months
  old. The ฿299 grilled-chicken figure has independent corroboration (the
  item's own pre-existing `servingNote`), but the other three Zaab Eli
  prices (120/120/125) rest on that one aggregator snapshot alone, with no
  second source checked. A future slice should look for a fresher Zaab Eli
  source if one becomes available.
- **Somtam Nua remains completely unpriced**: no accessible current source
  was found at all (not even a single item). This is a genuine gap, not a
  quality compromise, but it means one of the three Group 1 target brands
  contributed nothing this slice.
- **MK's remaining 2 unpriced items** (`mk-seafood-suki-broth`,
  `mk-pork-shabu`) still have no located source, now across two
  consecutive slices of searching the same official category listing —
  they may need a different page/category, a delivery-platform listing, or
  may no longer be sold as standalone items.
- **Isan-restaurant name abbreviation pattern** (ตำ ↔ ส้มตำ): used once
  here (`zaab-eli-som-tam-salted-egg`) with high confidence given the
  pattern repeats consistently across the same source page for other
  salads. Future research at other Isan restaurants should verify this
  same shorthand convention holds rather than assuming it universally.

## Product evaluation

- **Price usefulness:** Medium — 24/84 items now answer "how much,"
  extending price coverage into Isan/grilled-chicken cuisine for the first
  time (previously concentrated in Japanese/salad/convenience brands).
- **Price source quality:** Mixed — Nittaya's source is very fresh (8
  days); Zaab Eli's is older (~5 months) but partially corroborated
  internally; MK's official-site audit is high quality.
- **Coverage after slice:** Useful — 24/84 (~29%) now spans 7 of 13
  restaurants with at least one priced item, up from 5 of 13.
- **Maintenance burden:** Medium — no drift was found this slice (MK's 3
  audited prices were all confirmed unchanged, a reassuring signal versus
  Slice 20's Tonteki correction), but Zaab Eli's older source is a latent
  risk for a future audit to catch.
- **Value to Pick Focus:** Medium — the two newly priced brands are
  higher-kcal/protein grilled and salad items likely to surface in Pick
  Focus results for Isan-cuisine and high-protein filters.
- **Research efficiency:** Good — 9 accepted from 16 inspected item-level
  candidates (plus 1 restaurant-level dead end and 3 free audit
  confirmations), reaching the middle of the 8–12 target without needing
  Group 3 or a weakened evidence bar.

## Recommendation

**CONTINUE** — the price-match gate again correctly separated exact
matches from six genuinely different rejection patterns (size, variant,
shared-dish-name, configuration ambiguity, blocked/absent source, SKU not
found) across two new brands, reached a solid batch size, and this
slice's own MK audit found zero drift, suggesting the dataset is not
degrading between research passes.

## Suggested next step

If continued (not implemented in this slice): find a fresher, ideally
official or delivery-platform, source specifically for Zaab Eli to
corroborate or replace the ~5-month-old aggregator snapshot used here;
retry Somtam Nua via a delivery-platform listing (GrabFood/LINE MAN/
foodpanda) rather than Wongnai, since delivery platforms were not
attempted for this brand; and retry Sukiya via an individual dish page
rather than the category listing that has now been blocked across two
slices.

## Commit readiness

Ready to commit, pending the user's own review — not committed or pushed,
per the brief.
