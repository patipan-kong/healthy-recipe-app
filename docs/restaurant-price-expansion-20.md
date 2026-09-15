# GoodFood V2 — Restaurant Menu Price Coverage Expansion (Slice 20)

Slice 20 is a research + data-quality slice: expand verified menu-price
coverage for existing production items without guessing, estimating, or
deriving prices from a different item/branch/channel. Accuracy outranks
coverage; zero additions were an acceptable outcome going in.

## Entry state

- Branch `main`, HEAD `a8e2269` ("feat: add restaurant menu image pilot").
- The worktree was **not clean** at the start of this slice: it already
  contained Slice 19's full changeset (staged, uncommitted — Slice 19's own
  brief said "do not commit"), so there is no commit "after Slice 19." This
  contradicted this slice's stated entry conditions. Flagged to the user, who
  chose to layer Slice 20 on top of the existing uncommitted worktree rather
  than commit Slice 19 first or pause. All Slice 19 content (7 `menuImage`
  records, 3 pre-existing `price` records) was verified present and correct
  before starting.
- Baseline confirmed: 13 restaurants, 84 menu items, `MenuPrice` type
  unchanged (`amount`, `currency: 'THB'`, `asOf`, optional `note`),
  `validateMenuPrice` unchanged. Exactly 3 existing priced items:
  `ootoya-tonteki-pork-chop-set` (419 THB), `santa-fe-salmon-steak` (329 THB),
  `santa-fe-dory-fish-steak` (209 THB) — matching the brief's audit list
  exactly. Price renders only inside `MealContextDetails`, used in Restaurant
  Pick Focus, Explore Pick Focus, and a `DEV`-only URL-gated pilot panel —
  never in normal menu rows, Explore cards, Favorites, or the Restaurants
  list. No fake "unknown price" placeholder exists for unpriced items
  (`MealContextDetails` simply omits the price section).
- Baseline test run: `npx vitest run` → 24 files / 339 tests passing —
  matches Slice 19's final state exactly.

## Research method

For each candidate: located the brand's official site/ordering platform,
fetched the specific item's current listing (WebFetch, cross-checked against
raw HTML via `curl` + `grep` wherever a figure mattered enough to risk
WebFetch summarization error — this caught nothing wrong, but is how the
Tonteki correction below was independently confirmed), recorded the exact
Thai label distinguishing à la carte/individual vs. set/complete pricing
where the site exposed both, and matched that label against the production
item's own `servingNote`/`mealContext` to decide which figure applies.

## Candidate decisions

| Restaurant | Item | Observed price | Source/channel | Match | Decision | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| Ootoya | `ootoya-grilled-mackerel` | จานเดียว (à la carte) ฿279 | ootoya.co.th/menu-details.php?id=3, official site | Exact | **ACCEPT** | Item's `servingNote`/`mealContext` explicitly represent the à la carte config (rice/soup excluded); จานเดียว is that exact config |
| Ootoya | `ootoya-shima-hokke-grilled` | จานเดียว ฿399 | ootoya.co.th/menu-details.php?id=1 | Exact | **ACCEPT** | Same à la carte match as above. (Note: this item's *image* was rejected in Slice 19 for showing the full teishoku set — that was a serving-match problem specific to the photo, not the price. The จานเดียว price is a plain number tied to the same à la carte config our nutrition record already represents, so it is priceable independently.) |
| Ootoya | `ootoya-grilled-moromi-chicken` | จานเดียว ฿259 | ootoya.co.th/menu-details.php?id=35 | Exact | **ACCEPT** | Same as above |
| Ootoya | `ootoya-oyakodon` | จานเดียว (individual bowl) ฿199 | ootoya.co.th/menu-details.php?id=72 | Acceptable | **ACCEPT, with disclosed caveat** | The site prices this as two tiers: จานเดียว ฿199 (donburi box alone) vs. เซ็ต ฿229 (adds a miso soup cup + 2 side dishes — the same "extra soup/sides in frame" pattern that caused this item's *image* to be rejected in Slice 19). Our record's `servingNote` ("One rice bowl, includes rice") has no soup/sides, so it matches จานเดียว, not เซ็ต — this also retroactively confirms the Slice 19 image rejection was correct. A dedicated note (`oyakodonIndividualPriceNote`) discloses that this is the individual-bowl price, not the set |
| Ootoya | `ootoya-grilled-salmon-rice-bowl` | — | ootoya.co.th/menu.php (Donburi section) | Mismatch | **REJECT — no matching item exists** | Unchanged from Slice 19's finding: the current Ootoya menu has no *grilled* salmon donburi, only a zuke/sashimi salmon donburi (a different dish). No price can be attached to a dish that doesn't currently exist on the menu under this description |
| Ootoya (audit) | `ootoya-tonteki-pork-chop-set` | เซ็ต (set) ฿429 | ootoya.co.th/menu-details.php?id=30 | Exact | **CORRECTED 419 → 429** | Existing production price (419, from Slice 17B) conflicts with the current official site, confirmed independently via raw HTML (`<span class="ootoya-font-med">429</span> บาท` directly under a "เซ็ต" label). No configuration/channel explains the gap — same page, same item, same "set" label. Treated as a genuine price change since Slice 17B (or a minor original transcription slip) and corrected to the current, directly-verified figure. See "Existing price audit" below |
| Salad Factory | `salad-factory-grilled-chicken-sesame` | ฿155 | saladfactorythailand.com/menu/order (disambiguated from a similarly-named ฿160 pork variant via raw HTML) | Exact | **ACCEPT** | Name match confirmed exact in Slice 19; price is listed directly next to the item's name/image in the same page card |
| Salad Factory | `salad-factory-quinoa-chicken-basil` | ฿195 | saladfactorythailand.com/menu/order | Exact | **ACCEPT** | Name match "สลัดควินัวกระเพราอกไก่" confirmed exact (the same item whose *image* was rejected in Slice 19 for an uncertain protein/extra-sides photo — that uncertainty doesn't apply to the price, which is just the number listed next to the confirmed-exact name) |
| Salad Factory | `salad-factory-kale-chicken-truffle` | ฿235 | saladfactorythailand.com/menu/order | Exact | **ACCEPT** | Same pattern |
| Salad Factory | `salad-factory-rocket-skirt-steak` | — | saladfactorythailand.com/menu/order | Mismatch | **REJECT — no exact SKU (unchanged from Slice 19)** | No item named exactly "rocket salad with grilled skirt steak" exists; closest are a differently-scoped "Angus skirt steak in the garden" salad and a generic "grilled beef" rocket salad — neither confidently matches |
| Salad Factory | `salad-factory-spicy-pork-tenderloin` | — | saladfactorythailand.com/menu/order | Mismatch | **REJECT — unchanged from Slice 19** | Current items are a pork tenderloin *steak* and a spicy glass-noodle *yum*, not a green salad |
| Salad Factory | `salad-factory-salmon-sashimi-shoyu` | — | saladfactorythailand.com/menu/order | Mismatch | **REJECT — unchanged from Slice 19** | The shoyu-wasabi item is a mixed-seafood salad, not salmon-specific |
| 7-Eleven | `seven-eleven-garlic-pork-egg-rice` | ฿49 | allonline.7eleven.co.th product page /367920/ | Exact | **ACCEPT** | Exact SKU/brand match confirmed in Slice 19; price shown directly on the product page |
| 7-Eleven | `seven-eleven-green-curry-chicken` | ฿49 | allonline.7eleven.co.th product page /334743/ | Exact | **ACCEPT** | Exact SKU/brand match (the specific "rice + curry" variant, distinct from two confusable Chef Cares dry-stir-fried siblings) |
| 7-Eleven | `seven-eleven-chicken-sukiyaki` | — | allonline.7eleven.co.th product page /355384/ | Mismatch | **REJECT — unchanged from Slice 19** | The only current "sukiyaki chicken" SKU is vermicelli noodles, not rice |
| 7-Eleven | `seven-eleven-korean-chicken-fried-rice` | ฿45 (listed) | allonline.7eleven.co.th chilled-food category | Ambiguous | **REJECT — out of stock** | Name matches exactly, but the SKU is currently out of stock on the official platform; treated as too uncertain for freshness/availability, consistent with 7-Eleven's fast SKU turnover already observed in Slice 19 |
| 7-Eleven | `seven-eleven-pork-bulgogi-rice` | — | allonline.7eleven.co.th (search + category browse) | Mismatch | **REJECT — no matching SKU found** | No "Happy Chef" pork bulgogi rice product located; Happy Chef's current lineup on this platform is ramyeon only |
| 7-Eleven | `seven-eleven-sticky-rice-dried-pork` | — | allonline.7eleven.co.th (search + category browse) | Mismatch | **REJECT — no matching SKU found** | Only "ข้าวเหนียวหมูย่าง" (sticky rice with *grilled* pork, CP brand) was found — different protein prep (grilled vs. dried/floss) and a different, unspecified brand than our record |
| Fuji | (none) | — | WebSearch only | — | **Not pursued** | No official corporate site was found — only aggregators (Tripadvisor, menuinthai.com) and an unrelated US restaurant of the same name. Consistent with this brand's existing `fujiEstimateNote` on file. Stopped rather than pricing from an aggregator |
| Sukiya | `sukiya-gyudon-regular` (attempted) | — | sukiya.co.th/menu/gyudon.html | — | **REJECT — source blocked (403)** | The official site's category page returned HTTP 403 Forbidden to a plain fetch. Per the brief, no bypass (fabricated referrer, auth workaround) was attempted; stopped |
| MK Restaurants | `mk-special-kurobuta-set` | ฿223 | mkrestaurant.com/th/mk-menu/suki | Exact | **ACCEPT** | Thai name "ชุดคุโรบูตะสเปเชียล" is an exact character-for-character match to the production item's name |
| MK Restaurants | `mk-special-kurobuta-plate` | ฿75 | mkrestaurant.com/th/mk-menu/suki | Exact | **ACCEPT** | Thai name "คุโรบูตะสเปเชียล" (no "ชุด"/set prefix) exactly matches the production item's name, which is explicitly the single-plate (non-set) variant |
| MK Restaurants | `mk-premium-suki-set` | ฿259 | mkrestaurant.com/th/mk-menu/suki | Acceptable | **ACCEPT, with disclosed branch caveat** | Thai name "ชุดสุกี้พรีเมียมหม้อเดี่ยว" is an exact match, but the site explicitly states this item is "จำหน่ายเฉพาะสาขาเซ็นทรัลเวิลด์และสามย่านมิตรทาวน์" (sold only at the CentralWorld and Samyan Mitrtown branches). A dedicated note (`mkPremiumSukiBranchPriceNote`) truthfully discloses this branch restriction, per the brief's channel-disclosure allowance |
| MK Restaurants | `mk-seafood-suki-broth` | — | mkrestaurant.com/th/mk-menu/suki | Mismatch | **Not pursued** | The page's closest item ("ชุดสุกี้รวมมิตรหม้อเดี่ยว" — mixed/assorted, not seafood-specific) does not match this item's name; not researched further to stay within the slice's effort budget once the target coverage was already reached |

Group 3 (Nittaya Kai Yang, Zaab Eli, Somtam Nua) was **not researched** —
the brief only calls for it "if research remains efficient," and the target
coverage (12 accepted, within the 8–15 range) was already reached from
Groups 1–2 with room to spare under the ~20-candidate research budget
(22 candidates were actually inspected, including stopped/rejected ones).

## New prices added (12)

1. `ootoya-grilled-mackerel` — ฿279
2. `ootoya-shima-hokke-grilled` — ฿399
3. `ootoya-grilled-moromi-chicken` — ฿259
4. `ootoya-oyakodon` — ฿199 (individual/single-plate; disclosed)
5. `salad-factory-grilled-chicken-sesame` — ฿155
6. `salad-factory-quinoa-chicken-basil` — ฿195
7. `salad-factory-kale-chicken-truffle` — ฿235
8. `seven-eleven-garlic-pork-egg-rice` — ฿49
9. `seven-eleven-green-curry-chicken` — ฿49
10. `mk-special-kurobuta-set` — ฿223
11. `mk-special-kurobuta-plate` — ฿75
12. `mk-premium-suki-set` — ฿259 (CentralWorld/Samyan Mitrtown branches only; disclosed)

All use `currency: 'THB'`, `asOf: '2026-09-15'` (Slice 20's own `asOf20`
constant — never a copied-forward older date), and reuse the existing
`MenuPrice` model exactly (`amount`/`currency`/`asOf`/`note`). No model
expansion.

## Existing price audit

All three items the brief named for audit were checked against a live,
directly-verified source:

- **`ootoya-tonteki-pork-chop-set`** — **corrected**, ฿419 → ฿429. The
  current official site shows ฿429 for the "เซ็ต" (set) configuration, the
  same configuration our record has always represented (`already-complete`
  meal context, 750 kcal). Verified independently via raw HTML extraction
  (not just an AI-summarized fetch) to rule out a transcription artifact on
  this slice's end. No configuration/channel difference explains the ฿10
  gap; treated as either a genuine price increase since Slice 17B or a
  correction of a minor original transcription slip, and updated to the
  current, directly-confirmed figure with a fresh `asOf20`.
- **`santa-fe-salmon-steak`** — audited, **unchanged**. Current third-party
  menu-update source (salehere.co.th, the same source type Slice 17B used,
  since Santa Fe' has no official site with individual item prices) still
  shows ฿329.
- **`santa-fe-dory-fish-steak`** — audited, **unchanged**. Same source
  confirms ฿209 specifically for the garlic-butter preparation (there is
  also a ฿179 mushroom-sauce variant, which Slice 17B correctly did not use)
  — matches the existing record exactly.

## Coverage

- Before: 3 / 84
- Added: 12 (new) + 1 correction (not counted as new coverage)
- After: 15 / 84

By restaurant: Ootoya 5/6 (all but the salmon-rice-bowl mismatch), Salad
Factory 3/6, 7-Eleven 2/6, MK Restaurants 3/7, Santa Fe' Steak 2/7
(unchanged). All other 8 restaurants remain at 0/N, unchanged.

## Price freshness

Every new/corrected price uses `asOf20 = '2026-09-15'`, a slice-specific
constant kept independent of nutrition `asOf` values (no nutrition `asOf`
was touched by this slice). Two prices carry an explicit channel/config
caveat in their `note` field rather than a silent number: `ootoya-oyakodon`
(individual vs. set) and `mk-premium-suki-set` (branch-limited). All other
10 new/corrected prices reuse the existing generic `currentListedPriceNote`
("Current listed menu price; branch exceptions may apply."), consistent with
how the three pre-existing prices were already documented.

## Files changed

- **Data:** `src/restaurants.ts` — 3 new constants (`asOf20`,
  `oyakodonIndividualPriceNote`, `mkPremiumSukiBranchPriceNote`), a `price`
  field added to 12 items, 1 existing `price` corrected. No other field
  (nutrition, `menuImage`, `mealContext`, `servingNote`, category, tags,
  restaurant/menu membership) was changed.
- **Docs:** `docs/restaurant-price-expansion-20.md` (this file)
- **Tests:** `src/meal-context.test.ts` (new "Slice 20 price coverage
  expansion" block + fixes to outdated Slice-17B/18/19-era hardcoded
  assertions that the new prices and the Tonteki correction broke),
  `src/meal-context-ui.test.tsx` (updated two component tests whose
  premises — "Shima Hokke has no price," "Tonteki is ฿419" — were
  intentionally superseded by this slice's own data changes)
- **No production/UI code was touched** — `src/meal-context-ui.tsx`,
  `src/App.tsx`, and `src/styles.css` are unchanged; the existing price
  rendering in `MealContextDetails` was reused exactly as-is.

## UX behavior

Confirmed via the updated component tests: priced items show `฿<amount>`
and "Price checked: <date>" inside the existing `.meal-context-price`
section, only inside Pick Focus (`MealContextDetails`); unpriced items
render no price section at all (no "unknown price" placeholder — same
`if (!context && !item.price) return null` / conditional-section behavior
as before). No new UI surface, filter, sort, or ranking was added.

## Browser smoke

Not performed — no real browser was exercised in this research + data
session, consistent with Slice 19's precedent for a research/data-only
slice. All price rendering is plain text inside an already-shipped,
already-visually-verified (Slice 18B) component; no new layout risk was
introduced.

## Tests / verification

- Added 11 new tests to `src/meal-context.test.ts` ("Slice 20 price
  coverage expansion" describe block): dataset counts, exact new-price-id
  set within the 8–15/15 target, zero validation errors across all priced
  items, THB/positive-amount/valid-`asOf` checks, no negative/zero prices,
  no duplicate priced ids, the Tonteki correction, the two unchanged Santa
  Fe audits, unchanged `menuImage` coverage (still 7), unchanged nutrition/
  meal-context for all 12 newly priced items, and search/filter/Quick-Goal
  parity (with vs. without the new price) for all 12.
- Updated 5 existing tests whose hardcoded expectations this slice
  intentionally changed (outdated price counts, the old ฿419 Tonteki figure,
  "Shima Hokke has no price").
- Full suite: `npx vitest run` → **24 test files, 350 tests, all passing**
  (was 24 files / 339 tests before this slice).
- `npx tsc --noEmit` → clean.
- `npm run build` → succeeds; same pre-existing >500 KB chunk-size warning,
  unrelated to this slice (813.70 KB JS, up ~1.5 KB from Slice 19's 812.19 KB
  — new data/test code only, no new assets).
- `git diff --check` → exit 0 (only pre-existing LF/CRLF notices).

## Production integrity

- Restaurants: **13** (unchanged). Menu items: **84** (unchanged).
- Nutrition: unchanged for all 84 items, including all 12 newly priced ones
  (verified item-by-item in the new test block).
- Meal context: unchanged except no meal-context field was touched at all —
  the Tonteki correction only changed its `price.amount`/`asOf`, not its
  `already-complete` meal context.
- Image coverage: unchanged from Slice 19 — still exactly 7/84, same ids.
- Quick Goal counts / search results / Pick eligibility: unchanged, verified
  via with-price/without-price parity checks for every newly priced item.
- No price-driven recommendation, ranking, sort, or filter was added.

## Data gaps / risks

- **Branch-specific pricing** (`mk-premium-suki-set`) is disclosed in the
  price note, but the app has no per-branch selection UI — a user outside
  CentralWorld/Samyan Mitrtown will see a price their local branch may not
  honor. This is the same category of risk the brief explicitly allows when
  truthfully disclosed, but it's worth flagging as the first branch-limited
  price in this dataset (the three pre-existing prices were all
  generally-listed).
- **Configuration ambiguity resolved by inference, not an explicit source
  statement** (`ootoya-oyakodon`): the official site never says in words
  which price tier ("จานเดียว" vs "เซ็ต") corresponds to "just the rice
  bowl" — that mapping was inferred from our own `servingNote` plus the
  visual evidence gathered in Slice 19's image research (the rejected photo
  showed extra soup/sides, which now lines up with the more expensive
  "เซ็ต" tier). Reasonably confident, but it is an inference, not a directly
  stated fact.
- **Third-party source for Santa Fe'** (unchanged from Slice 17B): Santa
  Fe' still has no official site with individual prices, so both of its
  prices ultimately rest on a third-party menu-update aggregator
  (salehere.co.th), not the brand itself. Re-confirmed stable this slice,
  but the underlying source quality hasn't improved.
- **7-Eleven SKU churn**: this slice's own research hit three dead ends
  (sukiyaki noodle-vs-rice mismatch, an out-of-stock SKU, two entirely
  missing SKUs) in a single category page — 7-Eleven's ready-meal lineup
  turns over fast enough that this dataset's SKU-level records may need
  re-verification again fairly soon, independent of price.

## Product evaluation

- **Price usefulness:** Medium — 15/84 items now answer "how much," heavily
  weighted toward Pick-Focus-relevant Ootoya/Salad Factory/7-Eleven/MK items
  rather than spread evenly.
- **Price source quality:** Mixed — mostly official brand sites/ordering
  platforms (Good), but Santa Fe' still leans on a third-party aggregator
  and one accepted item carries a branch caveat.
- **Coverage after slice:** Sparse-to-Useful — 15/84 (~18%) is still a
  minority of the dataset, but it now covers the majority of Ootoya (5/6)
  and a meaningful slice of three other brands.
- **Maintenance burden:** Medium — prices move faster than nutrition
  research; the Tonteki correction found in this very slice (one price
  already drifted ฿10 since Slice 17B, same calendar date) is a concrete
  early signal that price freshness will need periodic re-checking sooner
  than nutrition data does.
- **Value to Pick Focus:** Medium-High — Pick Focus is exactly where price
  now appears, and coverage is deliberately concentrated on
  image-backed/high-protein/distinctive items likely to surface there.

## Recommendation

**CONTINUE** — the price-match gate (à la carte vs. set, branch scope,
promotional exclusion, SKU precision) held up across four different brands
and correctly rejected 10 candidates for genuine reasons (missing SKU, out
of stock, wrong dish, blocked source) rather than convenience, while still
reaching a legitimate 12-item batch. It also caught one real factual
discrepancy in existing data. Another small batch is justified.

## Suggested next step

If continued (not implemented in this slice): investigate Group 3
(Nittaya Kai Yang, Zaab Eli, Somtam Nua) plus the two MK items not yet
priced this slice (`mk-seafood-suki-broth`, `mk-pork-shabu`) and Sukiya via
a source that isn't blocking plain fetches (e.g. checking whether Sukiya's
individual dish pages, rather than the category listing, are reachable).

## Commit readiness

Ready to commit, pending the user's own review — not committed or pushed,
per the brief. This slice's changes sit on top of Slice 19's own
already-uncommitted, already-staged changes in the same worktree (see
Entry state above); the user chose that layering explicitly rather than
committing Slice 19 first.
