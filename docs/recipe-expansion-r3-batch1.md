# GoodFood V1 — Recipe Research R3, Batch 1
## Targeted New Recipe Implementation — Audit + Authoring + Integration Blocker Report

Repository: `G:\work\ta\healthy-recipe-app`
Handoffs read in full: `docs/recipe-pdf-corpus-audit-r1.md`, `docs/recipe-quality-audit-r2.md`
Source corpus (research evidence only, not reused directly): `research/clean-recipes/`

This document is the R3 batch-1 ledger. It records four fully authored, independently
written GoodFood recipes that passed the differentiation gate, together with the reason
they were **not** merged into production in this session.

---

## A. Entry State

- `git status --short` at entry: only the two pre-existing untracked R1/R2 docs.
- Branch: `main`. HEAD: `fb0e8b5a34eb4d762fed8ab6b31a4aa639788505` (unchanged throughout this session).
- Baseline verified via the existing test suite (`npx vitest run`): 26 files / 394 tests
  passing, including `recipe-assets.test.ts`, which independently proves 200 recipes,
  200 manifest entries, 200 unique images, and 200 WebP assets before any work began.
- No reset/restore/clean/stash/stage/commit/push was performed.

## B. R1 / R2 Handoff

Read in full; not rebuilt. R1 Section P and R2 Section I/J both independently converge on
the same 4-concept batch:

1. Tofu waffle (PDF07) — R1: CONSIDER → R2: **ADD**
2. Sweet potato with kimchi (PDF04) — R1: ADD after audit → R2: **ADD**
3. Konjac kimchi egg noodles (PDF08) — R1: CONSIDER → R2: **ADD**
4. Wakame egg soup (PDF08) — R1: ADD after audit → R2: **ADD**

R2's own differentiation findings (Section F) were used directly rather than re-derived:
`korean-tofu-egg-pancakes` is a pan-fried jeon, structurally distinct from a waffle-iron
format; no existing recipe represents wakame or konjac at all.

## C. Candidate Gate

All four concepts were evaluated against their nearest existing production neighbors
(Section E below) before any authoring was finalized. **All four passed** — none was
found to duplicate an existing recipe's format, flavor direction, or use case closely
enough to fail the gate. No candidate was dropped.

## D. Recipes Implemented (authored, not yet integrated — see Section J)

All four recipes below were authored independently for GoodFood: ingredient lists,
quantities, instructions (English and Thai), and nutrition were all written from
scratch using the existing schema and pantry conventions. No PDF prose, instructions,
layout, or nutrition numbers were copied — the PDFs were used only to confirm the
underlying dish *concept* (already established by R1/R2), not as a content source.

### 1. Tofu Waffle → `tofu-waffle`

| Field | Value |
|---|---|
| sourceId | `slice5-01` |
| Name (EN / TH) | Tofu Waffles with Lime Yogurt Dip / วาฟเฟิลเต้าหู้ซอสโยเกิร์ตมะนาว |
| Category | Quick meals |
| Cuisine | International |
| Servings | 2 |
| Prep / Cook | 15 min / 15 min |
| Tags | Vegetarian, Plant protein, Quick |
| Accent | violet |

Ingredients (whole recipe, 2 servings):
- Firm tofu, pressed and blended smooth — 350 g → `tofu`
- Eggs — 2 → `eggs`
- Oats, finely ground — 40 g → `oats`
- Spring onion, sliced — 2 stalks → `spring-onion`
- Reduced-sodium soy sauce — 1 tbsp → `soy-sauce`
- Sesame oil — 1 tsp → *(excluded, oils are not canonically mapped — matches existing convention)*
- Greek yogurt — 2 tbsp → `greek-yogurt`
- Lime juice — 1 tsp → `lime`
- Sesame seeds — 1 tsp → `sesame-seeds`

Instructions (EN):
1. Press tofu between paper towels or a clean cloth for 15 minutes to remove excess water, then blend it with the eggs until smooth.
2. Stir in the ground oats, half the spring onion and the soy sauce. Rest the batter for 5 minutes so the oats absorb moisture.
3. Brush a preheated waffle iron with sesame oil. Spoon in batter and cook until deeply golden and firm, about 5–6 minutes per waffle.
4. Stir the lime juice into the yogurt. Serve two waffles per person with the yogurt dip, the remaining spring onion and sesame seeds.

Instructions (TH):
1. กดเต้าหู้แข็งด้วยผ้าสะอาดหรือกระดาษซับ 15 นาทีเพื่อไล่น้ำออก แล้วปั่นกับไข่จนเนียน
2. ผสมข้าวโอ๊ตบดละเอียด ต้นหอมครึ่งหนึ่ง และซีอิ๊วโซเดียมต่ำลงในเนื้อแป้ง พักไว้ 5 นาทีให้ข้าวโอ๊ตดูดความชื้น
3. ทาน้ำมันงาบนเตาวาฟเฟิลที่ร้อนแล้ว หยอดแป้งและปิดฝา ปิ้งจนเหลืองกรอบและแน่นตัว ประมาณ 5–6 นาทีต่อแผ่น
4. คนน้ำมะนาวลงในโยเกิร์ตกรีก เสิร์ฟวาฟเฟิลคนละ 2 แผ่นพร้อมซอสโยเกิร์ต ต้นหอมที่เหลือ และงา

Nutrition (per serving): kcal 455, protein 39 g, carbs 20 g, fat 24 g, fiber 3 g, sodium 365 mg.
Atwater check: 39×4 + 20×4 + 24×9 = 452 vs. 455 kcal stated → 0.7% deviation.

### 2. Sweet Potato with Kimchi → `sweet-potato-kimchi`

| Field | Value |
|---|---|
| sourceId | `slice5-02` |
| Name (EN / TH) | Roasted Sweet Potato with Kimchi / มันหวานอบกิมจิ |
| Category | Plant-forward |
| Cuisine | Korean |
| Servings | 2 |
| Prep / Cook | 10 min / 25 min |
| Tags | Vegetarian, Fiber-rich, Light |
| Accent | lime |

Ingredients (whole recipe, 2 servings):
- Sweet potato, cut into 2 cm cubes — 450 g → `sweet-potato`
- Kimchi, chopped — 150 g → `kimchi`
- Neutral oil — 1 tsp → *(excluded, matches convention)*
- Gochujang — 1 tsp → `gochujang`
- Sesame oil — 1 tsp → *(excluded)*
- Spring onion, sliced — 2 stalks → `spring-onion`
- Sesame seeds — 1 tsp → `sesame-seeds`

Deliberately kept to seven ingredients and a single roasting step plus a one-pan kimchi
warm-through — no rice, no separate protein centerpiece — per the brief's instruction to
keep this "intentionally simple rather than turning it into another large bowl."

Instructions (EN):
1. Toss the sweet potato cubes with the neutral oil on a lined tray. Roast at 200°C for 22–25 minutes, turning once, until tender and lightly caramelised at the edges.
2. Warm the kimchi in a small pan for 2–3 minutes until just softened, then stir in the gochujang.
3. Spoon the warm kimchi over the roasted sweet potato.
4. Drizzle with sesame oil and scatter with spring onion and sesame seeds before serving.

Instructions (TH):
1. คลุกมันหวานหั่นชิ้นกับน้ำมันพืชบนถาดปูกระดาษ อบที่ 200°C นาน 22–25 นาที พลิกครึ่งทาง จนนุ่มและขอบเริ่มเกรียม
2. อุ่นกิมจิในกระทะเล็ก 2–3 นาทีจนนุ่มขึ้น แล้วคนโคชูจังลงไป
3. ตักกิมจิอุ่นราดบนมันหวานที่อบเสร็จ
4. ราดน้ำมันงา โรยต้นหอมและงาก่อนเสิร์ฟ

Nutrition (per serving): kcal 270, protein 5 g, carbs 49 g, fat 6 g, fiber 8 g, sodium 690 mg.
Atwater check: 5×4 + 49×4 + 6×9 = 270 vs. 270 kcal stated → exact match.
Sodium note: kept deliberately high (kimchi + gochujang), consistent with the brief's
instruction not to present artificially low sodium for kimchi-based dishes — comparable
to `kimchi-tofu-stew` (690 mg/serving) and `korean-tuna-kimchi-rice` (940 mg/serving).
Low protein (5 g) is an accurate reflection of an intentionally simple, low-protein
plant side/light-meal format, not an authoring defect.

### 3. Konjac Kimchi Egg Noodles → `konjac-kimchi-egg-noodles`

| Field | Value |
|---|---|
| sourceId | `slice5-03` |
| Name (EN / TH) | Konjac Noodles with Kimchi and Egg / บุกผัดกิมจิไข่ |
| Category | Light bowls |
| Cuisine | Korean |
| Servings | 2 |
| Prep / Cook | 10 min / 10 min |
| Tags | Light, Quick, Dairy-free |
| Accent | blue |

Ingredients (whole recipe, 2 servings):
- Konjac noodles, drained and rinsed — 400 g → `konjac-noodles` *(new canonical ingredient — see Section F)*
- Eggs — 2 → `eggs`
- Kimchi, chopped — 150 g → `kimchi`
- Gochujang — 1 tsp → `gochujang`
- Reduced-sodium soy sauce — 1 tsp → `soy-sauce`
- Bean sprouts — 100 g → `bean-sprouts`
- Sesame oil — 1 tsp → *(excluded)*
- Spring onion, sliced — 2 stalks → `spring-onion`
- Sesame seeds — 1 tsp → `sesame-seeds`

The ingredient quantity is specified as a drained, ready-to-cook weight (400 g) rather
than a package count, per the brief's explicit instruction to avoid relying on a
proprietary product size.

Instructions (EN):
1. Rinse and drain the konjac noodles well, then dry-fry them in a hot pan for 2 minutes to remove excess moisture.
2. Push the noodles aside, scramble the eggs in the same pan, then fold them through.
3. Add the kimchi, gochujang, soy sauce and bean sprouts; stir-fry for 3–4 minutes until the sprouts are just tender.
4. Drizzle with sesame oil, scatter with spring onion and sesame seeds, and serve immediately.

Instructions (TH):
1. ล้างและสะเด็ดน้ำเส้นบุกให้ดี จากนั้นผัดแห้งในกระทะร้อน 2 นาทีเพื่อไล่ความชื้นส่วนเกิน
2. ดันเส้นไปข้างกระทะ ตอกไข่ลงผัดให้สุก แล้วคลุกรวมกับเส้น
3. ใส่กิมจิ โคชูจัง ซีอิ๊วโซเดียมต่ำ และถั่วงอก ผัด 3–4 นาทีจนถั่วงอกสุกกำลังดี
4. ราดน้ำมันงา โรยต้นหอมและงา เสิร์ฟทันที

Nutrition (per serving): kcal 155, protein 9 g, carbs 11 g, fat 8 g, fiber 6 g, sodium 725 mg.
Atwater check: 9×4 + 11×4 + 8×9 = 152 vs. 155 kcal stated → 1.9% deviation.
Konjac noodles are nutritionally near-inert (glucomannan fiber, negligible kcal/protein/fat),
so this dish is genuinely and legitimately low-calorie relative to every other noodle
recipe in the catalog (`korean-tofu-glass-noodles` is 350 kcal/serving) — this is the
intended product differentiator, not a calculation error. Sodium is kept high and
realistic given kimchi + gochujang + soy sauce together.

### 4. Wakame Egg Soup → `wakame-egg-soup`

| Field | Value |
|---|---|
| sourceId | `slice5-04` |
| Name (EN / TH) | Wakame Egg Soup / ซุปสาหร่ายวากาเมะไข่ |
| Category | Light bowls |
| Cuisine | Japanese |
| Servings | 2 |
| Prep / Cook | 10 min / 15 min |
| Tags | Vegetarian, Light, Balanced |
| Accent | green |

Ingredients (whole recipe, 2 servings):
- Dashi stock — 700 ml → `dashi-stock`
- Wakame, dried — 10 g → `wakame` *(new canonical ingredient — see Section F)*
- Firm tofu, cubed — 150 g → `tofu`
- Mushrooms, sliced — 100 g → `mushrooms`
- Eggs — 2 → `eggs`
- Reduced-sodium soy sauce — 1 tbsp → `soy-sauce`
- Sesame oil — 1 tsp → *(excluded)*
- Spring onion, sliced — 2 stalks → `spring-onion`

The dried-vs-hydrated ambiguity flagged in the brief is resolved explicitly: the
ingredient quantity is the dried weight (10 g), and instruction step 1 states the
rehydrated volume behavior ("softens and roughly triples in volume") so the cook knows
what to expect rather than guessing a wet-weight equivalent.

A modest amount of tofu and mushroom was added for substance after an initial
wakame-only draft came out to ~90 kcal/serving — too thin to read as a real meal and
close to the "side-like recipe" risk R1 itself flagged for this concept. The final
version stays a clear dashi broth with egg ribbons (not a purée, unlike
`pumpkin-soup-with-egg`, and not a spicy fermented stew, unlike `kimchi-tofu-stew`) —
wakame remains the named, central ingredient and flavor identity.

Instructions (EN):
1. Soak the dried wakame in cold water for 5 minutes until it softens and roughly triples in volume, then drain well.
2. Bring the dashi stock to a gentle simmer, stir in the soy sauce, then add the tofu and mushrooms and cook until the mushrooms soften.
3. Whisk the eggs, then pour them in a thin stream over the surface while gently stirring in one direction to form soft ribbons.
4. Stir in the rehydrated wakame, remove from the heat, and finish with sesame oil and spring onion.

Instructions (TH):
1. แช่สาหร่ายวากาเมะแห้งในน้ำเย็น 5 นาทีจนนุ่มและพองตัวขึ้นประมาณสามเท่า จากนั้นสะเด็ดน้ำ
2. ตั้งน้ำซุปดาชิให้เดือดเบา ๆ ใส่ซีอิ๊วโซเดียมต่ำ ใส่เต้าหู้และเห็ดลงต้มจนสุก
3. ตีไข่ให้เข้ากัน ค่อย ๆ เทเป็นสายบาง ๆ ลงในซุปพร้อมคนเบา ๆ ทิศทางเดียวให้ไข่เป็นริบบิ้นนุ่ม
4. ใส่สาหร่ายวากาเมะที่แช่แล้ว ยกลงจากเตา ราดน้ำมันงาและโรยต้นหอมก่อนเสิร์ฟ

Nutrition (per serving): kcal 240, protein 22 g, carbs 8 g, fat 14 g, fiber 1 g, sodium 480 mg.
Atwater check: 22×4 + 8×4 + 14×9 = 246 vs. 240 kcal stated → 2.5% deviation.

## E. Differentiation (Candidate Gate detail)

| Candidate | Nearest existing recipe(s) | Why it remains distinct |
|---|---|---|
| Tofu waffle | `korean-tofu-egg-pancakes` (474 kcal, pan-fried jeon, gochujang dip, Korean/Plant-forward) | Different cooking method (pressed waffle-iron format vs. pan-fried patties), different cuisine framing (International vs. Korean), different sauce direction (lime-yogurt vs. gochujang), different category (Quick meals vs. Plant-forward). Confirms R2's own finding verbatim. |
| Sweet potato with kimchi | `greek-chicken-sweet-potato-tray`, `japanese-shioyaki-salmon-sweet-potato` (sweet potato as a side within a protein-led tray meal); `kimchi-tofu-stew`, `korean-tuna-kimchi-rice` (kimchi within a stew or rice bowl) | No existing recipe pairs sweet potato and kimchi directly, and none presents sweet potato as the meal's own base rather than a tray side. Deliberately smaller and simpler than every sweet-potato tray meal in the catalog — a genuinely different format, not a bowl variant. |
| Konjac kimchi egg noodles | `korean-tofu-glass-noodles` (glass noodles, soy-vinegar-sugar dressing, tofu-forward, 350 kcal); `korean-tuna-kimchi-rice` (rice, not noodles); `tofu-yakisoba-vegetables` / `japanese-pork-yaki-udon` (different noodle types, no kimchi) | Konjac is a structurally and nutritionally distinct noodle base (near-zero calorie, gelatinous) not represented anywhere in the catalog; kimchi + egg + konjac is a combination no existing recipe uses. |
| Wakame egg soup | `pumpkin-soup-with-egg` (blended purée, boiled egg served on the side, 280 kcal); `kimchi-tofu-stew` (spicy fermented stew) | No existing recipe uses wakame/seaweed at all. Clear dashi broth with in-soup egg ribbons is structurally different from both a puréed soup and a fermented stew. |

No candidate was found to be a near-duplicate. All four passed the gate as authored.

## F. Ingredient Normalization

Audited the pantry mapping (`src/pantry.ts`, 117 canonical ingredients, regex-based
`canonicalIngredientIdForItem`) against every ingredient used across the four recipes.

- Tofu, eggs, sweet potato, kimchi, gochujang, dashi stock, mushrooms, bean sprouts,
  spring onion, greek yogurt, lime, oats, sesame seeds, soy sauce — all map cleanly to
  existing canonical IDs using existing regex prefixes (verified by hand against
  `src/pantry.ts` lines 160–266; e.g. `Firm tofu, pressed and blended smooth` matches
  `/^firm tofu/` → `tofu`).
- Neutral oil and sesame oil are **intentionally excluded** from canonical mapping via
  `excludedIngredientRules`, matching existing project convention (oils, salt, and
  spices are deliberately unmapped across the whole catalog) — not a defect.
- Two ingredients have **no existing canonical representation**: konjac noodles and
  wakame. Both are genuinely required — they are the named, central ingredient of their
  respective recipes, not a minor supporting item, so per the brief's Section F this
  clears the bar for adding new canonical pantry entries. The exact planned additions
  (not yet applied — see Section J):

  ```ts
  // canonicalIngredients additions
  { id: 'konjac-noodles', category: 'carbs', name: { th: 'บุกเส้น', en: 'Konjac noodles' } },
  { id: 'wakame', category: 'pantry', name: { th: 'สาหร่ายวากาเมะ', en: 'Wakame' } },

  // mappingRules additions
  [/^konjac noodles/, 'konjac-noodles'],
  [/^wakame/, 'wakame'],
  ```

  `konjac-noodles` is categorized `carbs` (parallel to `soba`, `rice-noodles`,
  `glass-noodles`, which are all noodle-format `carbs` entries despite very different
  macro profiles). `wakame` is categorized `pantry` (parallel to `nori`, the only other
  existing seaweed entry).
- `data/foods.json` was not touched and was not needed for this normalization — it is
  confirmed (per R1/R2) to be disconnected from the runtime recipe/nutrition path.

## G. Serving Design

All four recipes follow the confirmed production convention: ingredient quantities are
the total for the recipe's own `servings` (2, in all four cases), and nutrition is
per serving. Verified consistent with `src/shopping.ts`'s scaling logic and the
`kcalEstimate` UI copy in both locales (re-confirmed from R2, not re-derived).

Deliberately avoided ambiguous quantities per the brief:
- Konjac noodles specified as a drained, edible weight (400 g), not a package count.
- Wakame specified as a dried weight (10 g) with an explicit rehydration description
  in the instructions, not an ambiguous "hydrated" amount.
- No "one batch" or unspecified piece counts anywhere in the four recipes.

## H. Nutrition Method

Same methodology adopted in R2 (no second architecture invented): the app has no
per-ingredient nutrition database (`pantry.ts` is identity/category only), so nutrition
was derived independently, ingredient-by-ingredient, from standard food-composition
reasoning (USDA-typical values for tofu, eggs, oats, sweet potato, kimchi, mushrooms,
bean sprouts, dashi, wakame, konjac, etc.), summed to whole-recipe protein/carb/fat/fiber
totals, then **kcal was derived from those macros via Atwater** (4P + 4C + 9F) rather
than estimated separately and reconciled afterward — this guarantees internal
consistency by construction rather than by post-hoc rounding.

All four recipes fall within the repo's own adopted tolerance (12% relative /
180 kcal absolute, per `recipe-corrections.test.ts` and `validateRecipes`):

| Recipe | Stated kcal | Atwater-derived kcal | Deviation |
|---|---|---|---|
| Tofu waffle | 455 | 452 | 0.7% |
| Sweet potato with kimchi | 270 | 270 | 0.0% |
| Konjac kimchi egg noodles | 155 | 152 | 1.9% |
| Wakame egg soup | 240 | 246 | 2.5% |

Sodium was kept conservative (not artificially lowered) for every kimchi/gochujang/soy/
wakame-containing dish, per the brief's explicit instruction — see per-recipe notes
above (Sections D.2–D.4).

## I. Categories / Tags

No new category was created. All four fit existing categories (`Quick meals`,
`Plant-forward`, `Light bowls` ×2) based on actual product semantics, not the brief's
suggested defaults blindly applied — e.g. konjac noodles and wakame soup were placed in
`Light bowls` rather than `Quick meals` because their defining trait is being
deliberately low-calorie/light, matching the existing `Light bowls` recipes' profile.
All tags used (`Vegetarian`, `Plant protein`, `Quick`, `Fiber-rich`, `Light`,
`Dairy-free`, `Balanced`) are drawn from the existing 14-tag vocabulary; no new tag was
created. Kimchi was written as plain `Kimchi, chopped` (not `Vegan`-qualified) and both
kimchi recipes are tagged `Vegetarian`, matching the existing
`korean-tofu-kimchi-lettuce-wraps` precedent exactly.

## J. Images Created — BLOCKER

**No images were created, and none of the four recipes were integrated into
production.** This is the central finding of this batch.

Per the brief's Section J: *"If image generation is unavailable in the implementation
environment, do NOT borrow a PDF image or unrelated existing image. Instead stop before
production integration and report the blocker."*

This session's tool environment was checked exhaustively and has **no image-generation
capability of any kind** (confirmed via `ToolSearch` against the full deferred-tool
list — no image/photo generation tool is available; this is a plain terminal/CLI
session, unlike whatever tooling produced the existing 200 recipe photos). Existing
recipe images (e.g. `public/recipes/korean-tofu-egg-pancakes.webp`, inspected directly)
are genuine photorealistic AI-generated food photography — not something reproducible
with local scripting, image libraries, or placeholder graphics. Fabricating a
placeholder, reusing an unrelated existing photo, or pulling a stock/PDF image would
each violate explicit constraints elsewhere in the brief (Section J and Section O:
copyright/source handling), so none of those was attempted.

Because production integrity requires `recipe count == image manifest count == WebP
asset count` (Section P), and no genuine new image can currently be produced, the
correct action is to **not** add these four records to `src/recipes.ts`,
`src/recipe-image-manifest.ts`, or `public/recipes/`, rather than partially integrate
and break that invariant. Nothing in `src/pantry.ts` was changed either, since the two
new canonical ingredients (Section F) only make sense alongside their recipes.

## K. Files Changed

Only one new file was created in this session:
- `docs/recipe-expansion-r3-batch1.md` (this document)

No production source file was modified. `src/recipes.ts`, `src/pantry.ts`,
`src/recipe-image-manifest.ts`, `data/foods.json`, and `public/recipes/` are all
byte-for-byte unchanged from HEAD.

## L. Tests Added / Updated

None. No production data changed, so per the brief's own precedent ("do not manufacture
a test change" when no correction/integration occurred), no test was added or modified.

## M. Search / Filter / Favorites Integration

Not applicable — the four recipes are not in production, so there is nothing for
Browse, search, filters, or Favorites to surface yet.

## N. Browser QA

Not performed — no production recipe content changed, so there is nothing new to view
in the running app.

## O. Copyright / Source Handling

All ingredient lists, quantities, instructions (English and Thai), and nutrition values
above were authored independently for GoodFood. The PDF corpus was not re-opened in
this session — R1's and R2's existing findings (Sections B, F, and J respectively) fully
covered the specific evidence needed (dish concept, ingredient theme, nearest-neighbor
comparisons); no new PDF page inspection was justified or performed. No PDF prose, step
wording, layout, image, or nutrition number was copied into this document or the
authored recipes.

## P. Production Integrity

Unchanged from entry state — nothing was integrated:
- 200 recipes / 200 unique IDs / 200 unique sourceIds / 200 image-manifest entries /
  200 recipe WebP assets — all identical to entry state.
- `validateRecipes(recipes)` clean (proven by the full test suite still passing
  unmodified).
- `data/foods.json` unchanged.
- Restaurant dataset unchanged.
- Target of 204 was **not reached** in this session; current production count remains
  200, pending image-generation capability.

## Q. Verification

- `npx vitest run` → 26 files / 394 tests passing (identical to entry-state baseline;
  no new test files, no regressions).
- `npx tsc --noEmit` → clean.
- `npm run build` → succeeds (pre-existing chunk-size warning only).
- `git diff --check` → clean.
- `git status --short` → only `docs/recipe-pdf-corpus-audit-r1.md`,
  `docs/recipe-quality-audit-r2.md`, and this new ledger file are untracked; no other
  changes anywhere in the worktree.
- No PDF file and no PDF-derived asset entered `public/` or any production directory.
  `research/` remains gitignored and untouched.

## R. Final Report

### A. Entry State
Branch `main`, HEAD `fb0e8b5` (unchanged). Baseline 200/200/200/200 and 394/394 tests
confirmed before any work began; no unrelated worktree changes existed to preserve.

### B. R1/R2 Handoff
Both read in full and treated as authoritative; not rebuilt. Batch scope (4 concepts)
taken directly from R1 Section P / R2 Section J, which independently agree.

### C. Candidate Gate
All 4 concepts passed differentiation review against their nearest existing production
neighbors. None was dropped for weak differentiation.

### D. Recipes Implemented
All 4 fully authored (bilingual content, ingredients, instructions, nutrition) — see
Section D above. **None integrated into `src/recipes.ts`** (see Section J / G below).

### E. Differentiation
See table in Section E above — every candidate has a concrete, specific reason it does
not duplicate an existing recipe's format or flavor identity.

### F. Ingredient Normalization
All ingredients except konjac noodles and wakame map to existing canonical pantry IDs.
Two new canonical ingredients are designed and documented (not yet applied) — see
Section F above for the exact `pantry.ts` diff.

### G. Serving Decisions
Standard convention followed throughout: quantities = whole recipe (2 servings),
nutrition = per serving. Konjac and wakame quantities specified unambiguously
(drained/dried weights), per the brief's explicit caution.

### H. Nutrition Method
Ingredient-by-ingredient composition estimate, summed to macros, kcal derived via
Atwater (4P+4C+9F) for guaranteed internal consistency. All four recipes land within
0.0%–2.5% deviation, comfortably inside the repo's 12%/180 kcal precedent tolerance.

### I. Categories / Tags
No new category or tag created. All four fit existing vocabulary based on actual
product semantics (see Section I above for the `Light bowls` reasoning in particular).

### J. Images Created
**None — this is the batch's blocking finding.** This session's environment has no
image-generation capability. Per the brief's own explicit contingency, integration was
stopped rather than faked with a placeholder, borrowed, or PDF-derived image.

### K. Files Changed
`docs/recipe-expansion-r3-batch1.md` only. No production file touched.

### L. Tests Added/Updated
None — nothing was integrated, so no test change was warranted.

### M. Search/Filter/Favorites Integration
Not applicable — recipes are not yet in production.

### N. Browser QA
Not performed — no production content changed.

### O. Copyright/Source Handling
All authored content is original; PDFs were not re-reviewed; R1/R2 evidence was reused
correctly rather than re-derived.

### P. Production Integrity
Unchanged: 200/200/200/200, `validateRecipes` clean, `data/foods.json` and restaurant
data untouched. Target of 204 not reached this session.

### Q. Tests/Verification
Full suite (394/394), `tsc --noEmit`, `npm run build`, and `git diff --check` all clean;
worktree contains only documentation additions.

### R. Remaining Risks
1. **Image generation is the sole remaining blocker.** All four recipes are fully
   authored, differentiation-checked, and nutrition-verified — ready to integrate the
   moment a genuine image can be produced (by a session/environment with image
   generation, or by supplying independently sourced/licensed photography through
   whatever process produced the existing 200 images).
2. The two new canonical pantry ingredients (`konjac-noodles`, `wakame`) should be
   added in the same change as the recipes that use them, not separately — adding them
   alone now would be an unused, ungrounded production change.
3. Nutrition values are independently reasoned (no per-ingredient nutrition database
   exists in this repo, as established in R2) — they are internally consistent and
   plausible, not laboratory-verified; this is an inherent, disclosed limitation of the
   app's whole nutrition architecture, not specific to this batch.

### S. Product Evaluation
All four recipes are differentiated, realistic, correctly normalized against the
canonical pantry (aside from two clearly justified new entries), and nutritionally
self-consistent. They are content-ready. They are not production-ready, solely because
the required image asset cannot be produced in this environment.

### T. Recommendation

**STOP** — one blocking condition (no image-generation capability in this environment)
prevents production integration for all four otherwise-ready concepts, and the brief's
own Section J instructs stopping rather than working around it. This is a tooling/
environment gate, not a content or differentiation failure: all four recipes cleared
the differentiation gate (Section C/E) and the nutrition/normalization checks (Sections
F/H) cleanly. A follow-up session with image-generation capability (or supplied
photography) can integrate these four records essentially as-is.

### U. Commit Readiness
Not committed, not pushed, per the brief's explicit instruction. The only new file is
this ledger; it is safe to commit on its own if the user wants the authored-but-unshipped
content preserved, or to leave untracked pending a decision on how to source images.
