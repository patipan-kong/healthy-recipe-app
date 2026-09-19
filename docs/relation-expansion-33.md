# GoodFood V2 — Slice 33: High-Confidence Relation Expansion

Status: **Implemented.** All 11 HIGH-confidence candidates from Slice 32's audit were reconfirmed against current source and added. No schema, UI, recipe, or restaurant content changes. Nothing has been committed or pushed.

## Entry Baseline

- Branch: `main`, HEAD `5d76ce8cdef831816d3bf2d50db611707985f5f8` ("docs: audit recipe restaurant relation coverage")
- `git status --short`: clean at entry.
- `git diff --stat 71712b9 5d76ce8` confirmed the only change since the audit's own baseline commit was the audit doc itself (359 insertions, 1 file) — no recipe, restaurant, or relation source changed between the audit and this slice, so its classifications remained valid to implement as-is.
- Counts confirmed from source: 208 recipes, 208 manifest entries, 208 WebPs, 13 restaurants, 84 menu items, 12 relations — exact match to expected baseline. `validateRecipes()` and `validateRecipeRestaurantRelations()` both returned `[]`. Baseline relation/catalog tests (68 tests across 4 files) passed before any change.

## Slice 32 Handoff

Read `docs/relation-coverage-audit-32.md` in full. Extracted exactly 11 candidate edges (Sections 6–7 of that document):

**7 HIGH SAME_DISH:**
1. `spicy-grilled-pork-salad` :: `salad-factory-spicy-pork-tenderloin`
2. `chicken-vegetable-sukiyaki` :: `seven-eleven-chicken-sukiyaki`
3. `chicken-green-curry-brown-rice` :: `seven-eleven-green-curry-chicken`
4. `grilled-chicken-jaew` :: `santa-fe-chicken-steak-jaew`
5. `herb-grilled-chicken` :: `nittaya-grilled-chicken-quarter`
6. `herb-grilled-chicken` :: `zaab-eli-grilled-chicken`
7. `japanese-shioyaki-salmon-sweet-potato` :: `fuji-salmon-shioyaki-brown-rice-set`

**4 HIGH SIMILAR_DISH:**
8. `salmon-poke-bowl` :: `salad-factory-salmon-sashimi-shoyu`
9. `baked-cod-lemon-herbs` :: `santa-fe-dory-fish-steak`
10. `chicken-larb-brown-rice` :: `nittaya-larb-moo`
11. `chicken-larb-brown-rice` :: `zaab-eli-larb-moo`

No IDs were invented from dish names — every one was resolved by exact string match against `src/recipes.ts` and `src/restaurants.ts` source.

## Candidate Reconfirmation

Each of the 11 edges was programmatically re-checked against current source for: (1) recipe exists, (2) menu item exists, (3) relation doesn't already exist, (4) no menu item ends up with more than one relation. **All 11 passed with zero problems** — no candidate was skipped, no substitution was made.

## SAME_DISH Relations Added

All 7 (see numbered list above) — added verbatim to `recipeRestaurantRelations` in `src/recipe-restaurant-relations.ts`, using the existing `relationKind: 'similar-dish'` (the model's only literal — no new kind was introduced, per the brief).

## SIMILAR_DISH-Strength Relations Added

All 4 (see numbered list above) — same data shape, same `relationKind: 'similar-dish'`. The audit's SAME_DISH/SIMILAR_DISH distinction is analytical only; production data does not encode it, exactly as instructed.

## Candidates Skipped

None. All 11 approved candidates were implemented as-is.

## Exclusion Preservation

No Medium/Ambiguous pair from Slice 32 Section 8 was added. Verified programmatically and via a dedicated test (`leaves every Slice 32 Medium/Ambiguous candidate unrelated`) covering all 8 listed pairs (salmon rice-bowl/teriyaki uncertainty, salmon-steak cross-cuisine, chirashi vs. poke, grilled-vs-steamed seabass, moromi chicken, shima hokke, plain Caesar, dry shredded chicken).

Also explicitly re-verified untouched:
- Slice 31 Som Tam exclusions (5 variants: salted egg ×2, corn+salted egg, fermented crab, tam muah)
- Slice 31 Gyudon exclusion (bonito/okra variant)
- Slice 31 Oyakodon correction (still present, still the sole relation for `ootoya-oyakodon`)
- MK Restaurants' 7 hot-pot items — none touched (no candidates from that cluster were approved by Slice 32)

## Files Changed

- `src/recipe-restaurant-relations.ts` — the only production data file changed. 11 new rows appended to `recipeRestaurantRelations`, with a two-line comment marking the Slice 33 block and noting the current model has one kind. No type, validator, or lookup-function changes.
- `src/recipe-restaurant-relations.test.ts` — updated the relation-count bound (5–12 → 5–23) and the full sorted-pairs assertion (12 → 23 entries), added a `relationKind` contract test, a no-duplicate-pair test, and a new `describe` block with 9 tests covering the 11 approved edges, exact coverage counts, one-menu-item-one-relation invariant, kai-yang/larb selectivity, Medium/Ambiguous exclusion, and Slice 31 exclusion/correction preservation.
- `src/recipe-restaurant-bridge-app.test.tsx` — added a `describe` block with 5 bridge-regression tests (see Bridge Regression below).

No recipe, restaurant, Pantry, image, or UI-copy files were touched.

## Tests Added / Updated

18 new/updated test cases across the two test files above, none based on array order — all keyed by ID lookups or set comparisons. Full new-test list:
- Relation count is exactly 23 (updated from 12).
- Full sorted pair list matches exactly (updated from 12 to 23 entries).
- Every relation still uses the single current `relationKind`.
- No duplicate recipe/menu-item pair exists.
- All 7 SAME_DISH edges are referentially valid in both lookup directions.
- All 4 SIMILAR_DISH edges are referentially valid in both lookup directions.
- Exact coverage counts: 23 relations, 23 covered menu items, 18 covered recipes.
- No restaurant menu item has more than one relation.
- Kai-yang cluster is exactly {Nittaya, Zaab Eli}, explicitly excluding 4 other grilled-chicken menu items that share only the cooking method.
- Pork-larb cluster is exactly {Nittaya, Zaab Eli}, explicitly excluding the liver variant (`somtam-nua-larb-moo`).
- All 8 Medium/Ambiguous candidates remain unrelated.
- Slice 31 Som Tam/Gyudon exclusions and the Oyakodon correction remain intact.
- One-to-many clusters resolve correctly through both lookup functions (`thai-papaya-salad` ×3, `herb-grilled-chicken` ×2, `chicken-larb-brown-rice` ×2, `japanese-shioyaki-salmon-sweet-potato` ×2).

## Relation Count

**12 → 23** (+11, exactly as approved).

## Restaurant Coverage

**12/84 (14.3%) → 23/84 (27.4%)** — calculated from the actual production array (`new Set(relations.map(r => r.restaurantMenuItemId)).size`), matching the audit's Scenario C prediction exactly.

## Recipe Coverage

**10/208 (4.8%) → 18/208 (8.7%)** — calculated the same way (`new Set(relations.map(r => r.recipeId)).size`), matching the audit's Scenario C prediction exactly.

## One-to-Many Verification

Confirmed programmatically: no restaurant menu item has more than one relation (every `restaurantMenuItemId` appears exactly once across all 23 rows). Four recipes now have multiple relations — this is expected and was approved by the audit as intentional clustering, not noise:

| Recipe | Related menu items | Status |
|---|---|---|
| `thai-papaya-salad` | 3 (Nittaya, Somtam Nua, Steak & More classic som tam) | Pre-existing (Slice 31) |
| `japanese-shioyaki-salmon-sweet-potato` | 2 (Fuji à la carte + Fuji rice-set) | 1 pre-existing + 1 new (Slice 33) |
| `herb-grilled-chicken` | 2 (Nittaya, Zaab Eli kai yang) | New (Slice 33) |
| `chicken-larb-brown-rice` | 2 (Nittaya, Zaab Eli pork larb) | New (Slice 33) |

The kai-yang and pork-larb clusters were explicitly verified to stop at exactly their 2 approved edges each — not expanded to every grilled-chicken or every larb item in the catalog (see Files Changed / Tests above).

## Bridge Regression

Verified through actual component rendering (jsdom), not just data assertions:
- **Recipe → Restaurant** (`herb-grilled-chicken`, 2 destinations): Recipe Detail page renders exactly 2 bridge cards, one per restaurant (`nittaya-kai-yang-thailand`, `zaab-eli-thailand`) — confirms the existing list-rendering (`relatedMenus.map(...)`) needed no changes to handle the new one-to-many cluster.
- **Restaurant → Recipe, new SAME_DISH** (`santa-fe-chicken-steak-jaew` → `grilled-chicken-jaew`): Pick Focus renders the bridge with unmodified "Want to make it?" copy and navigates to the correct recipe on click.
- **Restaurant → Recipe, new SIMILAR_DISH-strength** (`santa-fe-dory-fish-steak` → `baked-cod-lemon-herbs`): same unmodified copy and subtitle rendered — confirms the current UI does not (and was not made to) distinguish SAME_DISH from SIMILAR_DISH strength, consistent with the audit's finding that no schema/UI change was justified.
- **Existing Som Tam relation** (`thai-papaya-salad`, 3 destinations): still renders exactly 3 bridge cards after the expansion.
- **Existing Oyakodon relation**: still renders exactly 1 bridge card with the correct menu item name.
- Confirmed (assumption in Section K of the brief): no approved restaurant menu item ended up needing multiple recipe destinations — the Pick Focus `[0]`-only lookup was never exercised beyond its existing single-relation-per-item behavior. No UI change was required or made.

## Browser QA

No real browser tool was available in this session. All bridge-regression checks above were performed via jsdom component rendering (`recipe-restaurant-bridge-app.test.tsx`), which exercises the actual `App.tsx`/`RestaurantMenuView`/`ExploreView` components and real relation data, but does not verify visual layout, viewport overflow, or touch interaction. A manual pass at 390px and 1440px is recommended before this reaches real users, but this is not a blocker per the brief's instruction not to block the slice solely for lack of a browser tool.

## Full Verification

- `npx vitest run --exclude '**/.kilo/**' --exclude '**/node_modules/**'`: **32 test files, 497 tests, all passing** (up from 481 at entry — 16 net new tests: 11 in `recipe-restaurant-relations.test.ts`, 5 in `recipe-restaurant-bridge-app.test.tsx`).
- `npx tsc --noEmit`: clean.
- `npm run build`: succeeds (`✓ built in 679ms`, only the pre-existing chunk-size advisory warning, unrelated to this change).
- `git diff --check`: exit 0 (only benign pre-existing CRLF-will-be-replaced warnings, no actual whitespace errors).

## Production Integrity

`git status --short` shows exactly 3 modified files: `src/recipe-restaurant-relations.ts` (data), `src/recipe-restaurant-relations.test.ts`, `src/recipe-restaurant-bridge-app.test.tsx`, plus this new doc. No recipe content, restaurant content, Pantry, images, manifest, or UI-copy files changed.

## Remaining Relation Gaps

Per Slice 32 Section 12, even after this expansion: MK Restaurants (0/7, hot-pot format gap) and ThongSmith (0/5, boat-noodle format gap) remain effectively unconnected — both are structural format gaps, not something this relation-only slice could address. The 8 Medium/Ambiguous candidates and the tiered missing-recipe opportunities documented in Slice 32 remain open for a future slice's judgment; none were revisited or reinterpreted here.

## Recommendation

**SHIP.** All 11 approved candidates implemented exactly as specified, zero skipped, zero substitutions, zero scope creep into Medium/Ambiguous territory or model changes. Full verification clean.

## Commit Readiness

3 files modified + 1 new doc, all verified. **Not committed. Not pushed**, per instructions.
