# GoodFood V1 — Recipe Research R2

## Existing Recipe Quality Audit / Canonical Recalculation

Repository: `G:\work\ta\healthy-recipe-app`
Primary research handoff: [`docs/recipe-pdf-corpus-audit-r1.md`](<G:/work/ta/healthy-recipe-app/docs/recipe-pdf-corpus-audit-r1.md>)
Scope: audit-only. No new recipes. No PDF re-extraction beyond one narrowly bounded, ultimately blocked attempt (see Section D).

## A. Entry State

- Branch: `main`
- HEAD: `fb0e8b5a34eb4d762fed8ab6b31a4aa639788505` (`feat: expand restaurant menu images`) — unchanged throughout this audit.
- `git status --short` at entry: only `?? docs/recipe-pdf-corpus-audit-r1.md` (R1's own report, untracked). No other unrelated worktree changes were present or needed preservation.
- Production baseline confirmed before any work: 200 recipes, 200 unique IDs, 200 image-manifest entries, 200 `public/recipes/*.webp` assets, `validateRecipes(recipes)` clean, full suite 26 files / 394 tests passing. All match R1's own recorded exit checkpoint exactly.

## B. R1 Handoff Used

`docs/recipe-pdf-corpus-audit-r1.md` was read in full. Sections B, G, H, J, M, N, O, P, Q, T, U were used directly to scope this audit. R1 was **not** independently rebuilt; its PDF-by-PDF inventory, concept classification (A–E), and existing-recipe shortlist (Section Q) were treated as authoritative research cache, per the handoff instruction.

## C. Audit Scope

Exactly the 9 recipes named in R1 Section Q, no more:

1. `kimchi-tofu-stew`
2. `overnight-oats-berry-chia`
3. `fruit-yogurt-bowl`
4. `tofu-yakisoba-vegetables`
5. `japanese-pork-yaki-udon`
6. `korean-tuna-kimchi-rice`
7. `greek-chicken-sweet-potato-tray`
8. `japanese-shioyaki-salmon-sweet-potato`
9. `korean-tofu-egg-pancakes`

No related recipe was edited; a small number of adjacent recipes were read only for family-differentiation comparison (see Section J of the main report).

## D. Canonical Nutrition Method

The repository has **no gram-level, per-ingredient nutrition database wired into the runtime.** [`src/pantry.ts`](<G:/work/ta/healthy-recipe-app/src/pantry.ts>) (117 canonical ingredients) is an identity/category/shopping-list mapping layer only — it carries no kcal/protein/carbs/fat per ingredient. `data/foods.json` (828 entries) is a separate, disconnected catalog not imported by the recipe runtime, as R1 Section B already established; nothing in this audit changes that boundary.

The project's actual canonical nutrition safeguard is the Atwater macro-consistency check built into `validateRecipes()` ([`src/recipes.ts:116`](<G:/work/ta/healthy-recipe-app/src/recipes.ts>)): `kcal` must be within **180 kcal** of `protein*4 + carbs*4 + fat*9`, or the recipe fails validation outright. A tighter, precedent-setting **12%** tolerance was already used in a prior slice's regression test ([`src/recipe-corrections.test.ts:72-94`](<G:/work/ta/healthy-recipe-app/src/recipe-corrections.test.ts>)) for `greek-chicken-sweet-potato-tray` and four sibling recipes. R2 adopted both existing thresholds rather than inventing a new one: **flag for investigation at >12% Atwater deviation or >180 kcal absolute deviation.**

Applied to all 9 targets, the deviation was 0.4%–3.6% — comfortably inside both thresholds, with no recipe close to the line (worst case `overnight-oats-berry-chia` at 3.6%).

Because no canonical per-ingredient database exists, a true bottom-up recalculation is architecturally unsupported for **any** production recipe, not only these 9 — this is a repository-wide `LIMITED` condition, not specific to this audit. As corroboration only (not as the canonical method), two representative recipes were manually cross-checked against standard reference nutrition figures for their named ingredients (extra-firm tofu, Atlantic salmon, sweet potato, etc.):

- `kimchi-tofu-stew`: ingredient-level estimate ≈ 300–320 kcal / ~21–22 g protein / ~13–15 g fat per serving against stored 300 kcal / 22 g / 15 g — consistent once a standard extra-firm (not silken) tofu profile is assumed.
- `japanese-shioyaki-salmon-sweet-potato`: estimate ≈ 480 kcal / ~30 g protein / ~35 g carbs / ~21 g fat against stored 450 / 31 / 42 / 17 — within normal estimation variance.

Both corroborate the stored values as plausible. `greek-chicken-sweet-potato-tray` additionally already carries a prior-slice, explicitly audited nutrition band (330–380 kcal, 35–41 g protein) that its current stored values (356 kcal, 38 g protein) still satisfy — the strongest evidence of any of the 9.

## E. Audit Results — 9 Recipes

| ID | Servings basis | Ingredient/instruction consistency | Atwater deviation | Bilingual parity | Family differentiation | Classification |
|---|---|---|---|---|---|---|
| `kimchi-tofu-stew` | Coherent (500 ml stock / 2 = 250 ml bowl, 300 g tofu / 2 = 150 g/serving) | All 7 ingredients used exactly once, nothing orphaned | 1.7% | 7/7 items match | Only production kimchi+tofu+soup concept; no in-app duplicate | **LIMITED** (see F) |
| `overnight-oats-berry-chia` | Coherent | All 6 ingredients used; berries deliberately split pre/post chill | 3.6% | 6/6 match | Oat-forward, milk-soaked, overnight technique — distinct from `fruit-yogurt-bowl` | **PASS** |
| `fruit-yogurt-bowl` | Coherent (servings=1, no scaling ambiguity) | All 5 ingredients used, single-step assembly | 1.7% | 5/5 match | Yogurt-forward, no-cook, instant-serve — distinct from overnight oats | **PASS** |
| `tofu-yakisoba-vegetables` | Coherent | All 7 ingredients used; sesame oil correctly split across 2 steps | 1.5% | 7/7 match | Thin wheat noodles, tofu, yakisoba sauce, Plant-forward/Vegetarian — distinct from udon dish below | **PASS** |
| `japanese-pork-yaki-udon` | Coherent | All 10 ingredients used; "water" only appears in-instruction as an untracked staple, matching repo-wide convention | 1.5% | 10/10 match | Thick udon, lean pork, miso-ginger-rice-vinegar sauce, High protein/Quick — distinct from yakisoba above | **PASS** |
| `korean-tuna-kimchi-rice` | Coherent | All 7 ingredients used | 0.4% | 7/7 match | Explicitly a fried-rice meal (ข้าวผัด = fried rice; rice is the bulk base at 1½ cups), not a spread/filling | **PASS** |
| `greek-chicken-sweet-potato-tray` | Coherent | All 8 ingredients used; lemon juice and oregano correctly split across steps | 1.7% | 8/8 match | Complete tray-bake meal, not a PDF-style side/snack; already has a prior explicit nutrition-band audit it still satisfies | **PASS** |
| `japanese-shioyaki-salmon-sweet-potato` | Coherent | All 7 ingredients used; salt correctly split across steps | 1.1% | 7/7 match | Complete plated meal with independent bottom-up corroboration (Section D) | **PASS** |
| `korean-tofu-egg-pancakes` | Coherent (12 pancakes / 2 servings = 6/person, explicit in both text and instructions) | All 9 ingredients used; explicit 72°C food-safety instruction | 2.5% | 9/9 match | Already carries an explicit anti-duplication note ("Small 6 cm pancakes, not four giant fritters") from a prior correction; format is a pan-fried Korean jeon, not a waffle | **PASS** |

## F. R1-Specific Questions — Answered

- **`kimchi-tofu-stew` vs PDF08 Kimchi Soup — sufficiently differentiated? Serving/tofu/broth issue?** No internal issue found: serving basis, tofu quantity (150 g/serving), and broth ratio (250 ml/serving) are all internally coherent and plausible for a Korean stew. However, R1 explicitly flagged that "the exact canonical formulation still deserves a check" against PDF08's actual page, and this session could **not** perform that check — no PDF rasterization tool (`pdftoppm`/poppler, ImageMagick, Ghostscript, `mutool`) is installed or reachable in this environment, unlike R1's session, and the PDFs are confirmed image-dominant text so text-only extraction would not substitute. This is classified **LIMITED**, not PASS, purely on that unresolved evidence gap — no defect was found, none is claimed to have been ruled out.
- **`overnight-oats-berry-chia` — serving basis coherent? Quantities plausible? Distinct from generic chia pudding?** Yes to all three. 1 tbsp chia (0.5 tbsp/serving) is a light, plausible topping-level amount; the milk-soak-overnight technique and oat-forward ratio distinguish it from a chia-forward pudding format.
- **`fruit-yogurt-bowl` — internally coherent? Reason to change?** Yes coherent; no reason to change. It is a single-serving, no-cook, yogurt-forward format, structurally different from the corpus's soaked jars.
- **`tofu-yakisoba-vegetables` vs `japanese-pork-yaki-udon` — intentionally distinct? Generic/duplicative?** Intentionally and clearly distinct: different protein (tofu vs. pork), different noodle format (thin wheat noodles vs. thick udon), different sauce base (yakisoba sauce vs. miso-ginger-rice vinegar), different category and tags (Plant-forward/Vegetarian vs. Quick meals/High protein). Both English and Thai names name the distinguishing noodle format explicitly (yakisoba vs. yaki udon; โซบะ vs. อุด้ง).
- **`korean-tuna-kimchi-rice` — clearly a rice meal, not a spread/filling?** Yes — unambiguously a kimchi fried rice (ข้าวผัดกิมจิทูน่าใส่ไข่ = "kimchi tuna fried rice with egg"), with 1½ cups cooked rice as the structural base, not a dip/spread/sandwich filling as in PDF01/PDF08.
- **`greek-chicken-sweet-potato-tray` / `japanese-shioyaki-salmon-sweet-potato` — sweet-potato portions and meal nutrition plausible?** Yes for both; not changed merely because the PDF's sweet-potato formats differ (per the brief's explicit instruction). Both are complete tray/plate meals with a sweet-potato side portion (150 g/serving in both cases), not a PDF-style standalone sweet-potato snack.
- **`korean-tofu-egg-pancakes` — distinct from a future tofu waffle? Would a waffle add diversity?** Yes on both counts. The current recipe is a pan-fried Korean jeon-style pancake (soft interior, dipping sauce, savory, cooked in batches on a flat pan) — structurally different from a waffle-iron format (crisp, grid-pressed). A future tofu waffle would add genuine format diversity, not duplicate this recipe. This directly informed the R3 reclassification in Section O.

## G. Correction Gate Outcome

**No concrete defect was found in any of the 9 targets.** Per the brief's explicit instruction, no production recipe file was edited, and no test was manufactured to create the appearance of a correction. The only unresolved item is the PDF-recheck tooling gap on `kimchi-tofu-stew` (Section F), which is an evidence gap, not a defect.

## H. Files Changed by This Audit

- `docs/recipe-quality-audit-r2.md` (this file) — new.

No production recipe file, `data/foods.json`, restaurant file, test file, UI file, image manifest, or asset was modified. Nothing was staged, committed, pushed, reset, restored, stashed, or cleaned.

## I. R3 Candidate Reclassification (R1 Section P, 12 concepts)

| Concept | Source | R1 rating | R2 rating | Why it moved (or didn't) |
|---|---|---|---|---|
| High-protein chicken breast sheet/chips | PDF03 | CONSIDER | CONSIDER | R2's 9 targets included no chicken recipe; no new evidence either way |
| Shredded chicken protein prep | PDF03 | CONSIDER | CONSIDER | Same — untouched by R2's audit scope |
| Sliceable chicken protein loaf | PDF03 | CONSIDER | CONSIDER | Same |
| Savory egg-white low-cal porridge | PDF06 | CONSIDER | **DEFER** | R2 found no new evidence to offset R1's own flagged concern (PDF06 rated LOW value, proprietary Eggyday-product dependent); being conservative absent confirming evidence |
| Flourless egg-white chia bread | PDF02/06 | CONSIDER | **DEFER** | Same reasoning — untouched, same sourcing-risk source PDFs |
| Tofu waffle | PDF07 | CONSIDER | **ADD** | R2's `korean-tofu-egg-pancakes` audit (Section F) directly and affirmatively answered the exact differentiation question R1 raised — genuine format diversity confirmed, not duplication |
| Crispy tofu sheet/chips | PDF07 | CONSIDER | CONSIDER | Adjacent family, but not directly audited; no new evidence |
| Vegan tofu cream-cheese spread | PDF07 | CONSIDER | CONSIDER | Same; relies on the D-class Tzatziki reference only |
| Sweet potato with kimchi | PDF04 | ADD after audit | **ADD** | R2 audited both sweet-potato mains and the one kimchi recipe; confirmed sweet potato never appears as a fermented-carb format and kimchi never pairs with sweet potato — reinforced, no overlap |
| Sweet potato with yogurt-herb dip | PDF04 | CONSIDER | CONSIDER | R2 confirms it's a genuinely novel intersection (sweet potato is otherwise savory-tray-only; yogurt is otherwise fruit-bowl-only), but kept at CONSIDER to keep the ADD tier small and high-confidence per the brief's "at most 8" batch discipline |
| Konjac kimchi egg noodles | PDF08 | CONSIDER | **ADD** | R2 audited all 4 nearest noodle/rice/soup recipes (`kimchi-tofu-stew`, `korean-tuna-kimchi-rice`, `tofu-yakisoba-vegetables`, `japanese-pork-yaki-udon`) and confirmed zero format overlap with any of them |
| Wakame egg soup | PDF08 | ADD after audit | **ADD** | R2 audited the one existing soup (`kimchi-tofu-stew`); confirmed no seaweed/wakame representation anywhere in the audited set — reinforced |

Totals: **4 ADD, 6 CONSIDER, 2 DEFER, 0 REJECT.**

## J. Recommended First R3 Batch

The 4 ADD-rated concepts, and only those 4 — each is independently justified by direct R2 audit evidence of zero family overlap with an existing production recipe, not merely by R1's original research:

1. Tofu waffle (PDF07)
2. Sweet potato with kimchi (PDF04)
3. Konjac kimchi egg noodles (PDF08)
4. Wakame egg soup (PDF08)

This is fewer than the permitted 8, by design — the brief allows recommending fewer, and a smaller, fully-evidenced batch is preferable to padding it with CONSIDER-tier concepts R2 did not directly examine. The 6 CONSIDER concepts remain available for a future R3 audit pass once chicken- and snack/spread-family recipes are in scope.

## K. Verification

- `npx vitest run` → **26 files / 394 tests, all passing** (unchanged from entry baseline)
- `npx tsc --noEmit` → clean
- `npm run build` → succeeds (820.95 KB JS / 29.81 KB CSS; pre-existing >500 KB chunk-size warning only)
- `git diff --check` → exit 0, no output
- Recipe count: 200 (unchanged). Unique IDs: 200 (unchanged). `public/recipes/*.webp`: 200 (unchanged). `validateRecipes(recipes)`: clean (unchanged).
- `data/foods.json` SHA-256: `ff39f65f8122f15bb1715e58a34f3a3320422fa5a2a8da1b82eac220cb5e1d9a` — matches R1's recorded hash exactly; file untouched.

## L. Final Recommendation

**PROCEED** — the audit found the 9-recipe sample structurally sound (correct serving semantics, complete ingredient/instruction coverage, Atwater-consistent nutrition, full bilingual parity, and clear family differentiation everywhere it was questioned), with only one narrow, tooling-caused evidence gap (`kimchi-tofu-stew`'s PDF08 cross-check) rather than any confirmed defect. This gives enough confidence to proceed with the small, tightly-scoped 4-recipe R3 batch in Section J. A broader R3 batch, or resolving the `kimchi-tofu-stew` PDF gap, should wait for a session with PDF rendering available.
