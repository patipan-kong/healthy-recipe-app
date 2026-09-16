# GoodFood V1 — Recipe Research R1

## Clean Recipe PDF Corpus Audit + Existing Dataset Gap Analysis

Repository: `G:\work\ta\healthy-recipe-app`  
Scope: read-only research/audit; no production recipe, restaurant, UI, test, or asset changes.

### Method and limitations

All eight PDFs opened successfully. Their page counts were read with `pdfinfo`. The recipe pages are predominantly image-based: the PDF text layer contains little more than cover/disclaimer/QR or video-link text. I therefore rendered the pages with Poppler and visually reviewed the full 87-page corpus. No PDF image was extracted or reused, and no OCR output or new parser dependency was added.

The recipe counts below distinguish a recipe entry from an educational, shopping-list, disclaimer, or cover page. Nutrition and portion claims are recorded as evidence only. The PDFs themselves present approximate values and use inconsistent serving bases, so none of their numbers are production-ready.

## A. Entry State

Captured before the concurrent restaurant work advanced:

- Branch: `main`
- HEAD: `f73d6db87ad9c87aa0ab1de40939c31d2d7f65d4`
- `git status --short`:

  ```text
   M src/meal-context.test.ts
   M src/menu-image.test.tsx
   M src/random-meal-app.test.tsx
   M src/restaurants.ts
  ?? research/
  ```

The modified restaurant/test paths and the research corpus were treated as pre-existing or concurrent work. They were not edited, restored, staged, or otherwise disturbed.

## B. Production Recipe Baseline

The canonical runtime collection is [`src/recipes.ts`](<G:/work/ta/healthy-recipe-app/src/recipes.ts>). It assembles the initial recipes plus seed/content modules including [`src/recipe-expansion.ts`](<G:/work/ta/healthy-recipe-app/src/recipe-expansion.ts>), [`src/recipe-additions.ts`](<G:/work/ta/healthy-recipe-app/src/recipe-additions.ts>), and [`src/recipe-final-expansion.ts`](<G:/work/ta/healthy-recipe-app/src/recipe-final-expansion.ts>). Thai/English text and later content are held in [`src/recipe-content.ts`](<G:/work/ta/healthy-recipe-app/src/recipe-content.ts>) and related content modules.

Observed runtime baseline:

- 200 recipes, 200 unique IDs, 200 unique names, and 200 unique image paths.
- IDs are lowercase kebab-case slugs. `sourceId` is present and unique, with 15 early `f…` records and 185 `slice…` records observed; it is an internal identifier rather than a public provenance URL.
- Schema/type is in [`src/types.ts`](<G:/work/ta/healthy-recipe-app/src/types.ts>): bilingual localized name/cuisine/item/instruction values; category; servings; prep/cook minutes; ingredient quantity/unit and optional canonical `ingredientId`/`amount`; nutrition; tags; accent; image.
- Categories: Plant-forward 63, Quick meals 51, High protein 43, Light bowls 32, Thai favorites 11.
- Cuisines: Thai 54, Japanese 32, Korean 22, Mediterranean 19, Chinese 18, International 16, Vietnamese 12, Mexican 10, Italian 9, American 4, Spanish 2, Hawaiian 1, Mexican-inspired 1.
- Tags are led by High protein 119, Balanced 76, Quick 64, Vegetarian 55, Light 50, Fiber-rich 47, Meal prep 34, Plant protein 31, Vegan 26, Comforting 25, Gluten-free 23, Dairy-free 20, Omega-rich 16, and No-cook 12.
- Nutrition is complete for all 200 records for `kcal`, `protein`, `carbs`, and `fat`; the optional `fiber` and `sodium` fields are also populated for all 200. Observed kcal range is 149–656 and protein range is 6–55 g according to the source values.
- A simple non-exclusive English ingredient/name marker scan finds approximately: chicken 42, fish/seafood 49, tofu/soy 41, legumes 56, eggs 44, pork 11, beef 14, oats/chia 7, and sweet potato 10. These are heuristic overlaps, not schema fields or mutually exclusive protein totals.
- Existing repeated families include chicken-and-rice/bowl variants, tofu meals, Japanese/Korean noodles, kimchi meals, salads, overnight oats, sweet-potato mains, and egg-based light meals. This matters because the corpus often supplies a new format within an already-covered family rather than a wholly absent ingredient.
- [`src/types.ts`](<G:/work/ta/healthy-recipe-app/src/types.ts>) and [`src/recipes.ts`](<G:/work/ta/healthy-recipe-app/src/recipes.ts>) define the recipe contract. [`src/pantry.ts`](<G:/work/ta/healthy-recipe-app/src/pantry.ts>) contains the canonical ingredient IDs (117 observed), while [`data/foods.json`](<G:/work/ta/healthy-recipe-app/data/foods.json>) contains 828 separate food/menu records and is not imported by the runtime recipe source. The only current reference found for `foods.json` in `src/` is a hash assertion in `src/recipe-final-corrections.test.ts`.
- Search matches Thai/English name, category, cuisine, tags, ingredients, and instructions. Filters match category, tags, and nutrition ceilings/floors. Favorites are persisted as a deduplicated list of recipe IDs by [`src/favorites.ts`](<G:/work/ta/healthy-recipe-app/src/favorites.ts>).
- [`src/recipe-image-manifest.ts`](<G:/work/ta/healthy-recipe-app/src/recipe-image-manifest.ts>) maps the runtime recipes one-to-one to image metadata and local `/recipes/{id}.webp` paths. The asset directory contains 200 `.webp` files.

## C. PDF Corpus Located

The eight files were found in [`research/clean-recipes`](<G:/work/ta/healthy-recipe-app/research/clean-recipes>). The filenames are preserved below for traceability; the descriptions in section D are based on the actual pages, not filename assumptions.

| ID | PDF | Pages |
|---|---|---:|
| PDF01 | [`E-Book 9 สูตรลับ ไส้แน่น (ดิป สลัด ไส้แรป ไส้แซนว.pdf`](<G:/work/ta/healthy-recipe-app/research/clean-recipes/E-Book%209%20สูตรลับ%20ไส้แน่น%20(ดิป%20สลัด%20ไส้แรป%20ไส้แซนว.pdf>) | 12 |
| PDF02 | [`E-Book Healthy with Chia seed (รวมเมนูจาก Chia seed อร่อยแบบสุขภาพด.pdf`](<G:/work/ta/healthy-recipe-app/research/clean-recipes/E-Book%20Healthy%20with%20Chia%20seed%20(รวมเมนูจาก%20Chia%20seed%20อร่อยแบบสุขภาพด.pdf>) | 9 |
| PDF03 | [`E-Book High Protein Everyday! (รวมเมนูโปรตีนสูงจากอกไก่).pdf`](<G:/work/ta/healthy-recipe-app/research/clean-recipes/E-Book%20High%20Protein%20Everyday!%20(รวมเมนูโปรตีนสูงจากอกไก่).pdf>) | 10 |
| PDF04 | [`E-Book Simple Sweet Potato Meals (รวมเมนูเฮลตี้ อร่อย และทำง่าย .pdf`](<G:/work/ta/healthy-recipe-app/research/clean-recipes/E-Book%20Simple%20Sweet%20Potato%20Meals%20(รวมเมนูเฮลตี้%20อร่อย%20และทำง่าย%20.pdf>) | 14 |
| PDF05 | [`E-Book รวมทุกสูตร Overnight oat.pdf`](<G:/work/ta/healthy-recipe-app/research/clean-recipes/E-Book%20รวมทุกสูตร%20Overnight%20oat.pdf>) | 11 |
| PDF06 | [`E-Book รวมเมนูลีน โปรตีนล้วน จากไข่ขาว.pdf`](<G:/work/ta/healthy-recipe-app/research/clean-recipes/E-Book%20รวมเมนูลีน%20โปรตีนล้วน%20จากไข่ขาว.pdf>) | 10 |
| PDF07 | [`E-Book รวมเมนูเสริมโปรตีนพืชจากเต้าหู้.pdf`](<G:/work/ta/healthy-recipe-app/research/clean-recipes/E-Book%20รวมเมนูเสริมโปรตีนพืชจากเต้าหู้.pdf>) | 7 |
| PDF08 | [`E-Book รวมเมนูเฮลตี้ สไตล์ญี่ปุ่นและเกาหลี.pdf`](<G:/work/ta/healthy-recipe-app/research/clean-recipes/E-Book%20รวมเมนูเฮลตี้%20สไตล์ญี่ปุ่นและเกาหลี.pdf>) | 14 |

## D. PDF-by-PDF Inventory

| ID and actual title | Entries and actual recipe concepts | Themes, protein/base, techniques, meal mix | Nutrition, serving, quantity, instruction quality | Internal duplication and research usefulness |
|---|---|---|---|---|
| **PDF01 — “9 สูตรลับ ไส้แน่น”**; metadata/cover describes dips, salads, wrap/sandwich fillings | 9 recipes: Tuna Kimchi; Tuna Corn Salad; Shrimp Egg Salad; Crab-stick Shrimp Egg Salad; Healthy Egg Salad; Tuna Boiled-Egg Salad; Cucumber Salad; Tzatziki Dip; Buffalo Chicken Dip. | Tuna, shrimp, crab stick, egg, chicken, yogurt/cottage cheese; corn/cucumber/tomato are supporting bases. Mixing, chilling, boiling, and dip/spread assembly. Mostly snack, salad, dip, or filling rather than complete meals. | Quantities are generally explicit. Calories and protein/carbs/fat are shown, often for a batch with a 2-serving callout; herbs/spices sometimes say to taste. Instructions are short photo-step captions rather than full prose. | No strong internal duplicate, but all recipes sit in one dip/salad family. **Medium** value: useful portion/protein-spread formats, limited complete-meal coverage, processed-brand dependence. |
| **PDF02 — “Healthy with Chia seed” / “เมล็ดจิ๋ว ประโยชน์ใหญ่”** | 5 raw entries: Big Batch Chia Pudding; Chia Pudding Ice Cream; Chocolate “mouse” (visually a chocolate mousse); Strawberry Chia Jam; Egg-white Chia Bread. The first two use the same base and are one normalized concept. | Chia with Greek yogurt, plant milk, pea protein, strawberries, or egg white. Mixing, soaking, chilling/freezing, and simple baking. Breakfast/snack/dessert/component mix. | Quantities and batch nutrition are usually explicit. Fields are kcal/protein/carbs/fat; portions vary by cubes, jars, tablespoons, or unclear bread basis. Simple instructions are readable as captions. Protein/milk brands are part of the formulas. | Big Batch Chia Pudding and Chia Pudding Ice Cream are a near-duplicate; Egg-white Chia Bread is shared with PDF06. **Medium** value: useful chia/portion concepts, but not a broad meal source. |
| **PDF03 — “HIGH PROTEIN Everyday!”** | 7 recipes: Chicken Breast Chips; Shredded Chicken; Chicken Nuggets; Chicken Breast Bread; Chicken Waffle; Thai Chicken Cakes; Chicken Loaf/Sausage. | Almost entirely chicken breast; potato, egg white, Parmesan, enoki, vegetables, or starch are secondary. Baking, shaping, air-frying/frying-style preparation, and batch cooking. Mostly snack, protein prep, or portable formats. | Ingredient tables are explicit and total kcal/protein/carbs/fat are shown; some entries give pieces or per-piece values, but formal servings are inconsistent. Instructions are short and visual. | No exact internal duplicate, but many are format variations around chicken breast. **Medium** value: meaningful high-protein format evidence, limited protein diversity and existing dataset already has many chicken meals. |
| **PDF04 — “Sweet Potato — Simple Sweet Potato Meals”** | 9 recipes: Sweet Potato Rice; Sweet Potato Cereal; Sweet Potato Cream Waffle; Sweet Potato Waffle; Sweet Potato Nest/Nuggets; Baked Sweet Potato Cheese; Sweet Potato Kimchi; Sweet Potato with Yogurt Dip; Sweet Potato Smoothie. | Sweet potato is the dominant base, with rice, protein powder, yogurt, cheese, kimchi, or almond milk. Baking, waffle cooking, roasting, mixing, and blending. Breakfast, snack, side, and light meal mix; several are dessert-like. | Quantities are generally clear; kcal/protein/carbs/fat are usually batch totals with piece or serving callouts. “Season to taste” and brand-specific protein/yogurt occur. Instructions are short but usable. | No exact internal duplicate; two waffle variants are close family members. **Medium** value: adds format/meal-slot ideas despite current sweet-potato coverage. |
| **PDF05 — “Overnight Oat”** | 4 recipes: Tiramisu Oat; Cookie & Cream Oat; Blueberry Avocado Oat; Blueberry Cheesecake Oat. | Oats, yogurt, chia, plant protein, almond milk, fruit, avocado, granola, and branded toppings. No-cook mixing and overnight chilling. All are breakfast/snack/dessert jars. | Ingredient quantities and kcal/protein/carbs/fat totals are visible, but the per-container serving basis is not consistently explicit. Several formulas use Oreo, Biscoff, granola, spirulina, or protein brands. Photo captions are adequate for assembly. | No exact duplicate inside the PDF; all four are one flavored-overnight-oat family, and the app already has Berry Chia Overnight Oats. **Low** value for expansion; useful only for a clean variant/portion audit. |
| **PDF06 — “รวมเมนูลีน โปรตีนล้วน จากไข่ขาว”** | 11 raw entries: Egg-white Low-cal Porridge; Egg-white Fried Rice; Yaki Soba; Pork Shabu Curry; Shabu Ramen; Pork Rice-noodle Stir-fry; Cloud Bread; Flourless Egg-white Chia Bread; Garlic-cheese Egg-white Bread; Egg-white Cookies; Egg-white Chips. | Egg whites dominate; pork, Eggyday egg-white rice/noodles, chia, cheese, or vegetables are secondary. Boiling, stir-frying, broth, baking, and shaping. Breakfast, noodle meals, bread/snack formats, and dessert-like items. | Tables give explicit quantities and kcal/protein/carbs/fat; some use total plus pieces, but servings are inconsistent. Several recipes depend on proprietary Eggyday products. Instructions are short and mostly visual. | Yaki Soba, Pork Shabu Curry, and Shabu Ramen duplicate PDF08; Flourless Egg-white Chia Bread duplicates PDF02. **Low** value for direct expansion, though good evidence for a small low-cal egg-white format audit. |
| **PDF07 — “รวมเมนูเสริมโปรตีนพืชจากเต้าหู้”** | 6 recipes: Crispy Silken Tofu; Baked Soft Tofu; Tofu Waffle; Crispy Tofu Sheet; Vegan Tofu Cream Cheese; Dry Tofu-skin Noodles. | Silken/soft/firm tofu and tofu skin; egg, cornflakes, Parmesan, lemon, oil, chicken, and sauce are supporting ingredients. Baking, crisping, waffle cooking, blending, and noodle assembly. Snacks, spread, breakfast, and one noodle meal. | Quantities and total kcal/protein/carbs/fat are mostly explicit; simple 3–4 step instructions are usable. Tube tofu/tofu-skin products and oil amount need canonical normalization. | No exact internal duplicate. **Medium** value: the strongest source for new tofu formats, even though the production set already has many tofu meals. |
| **PDF08 — “รวมเมนูเฮลตี้ สไตล์ญี่ปุ่น และเกาหลี”** | 10 raw entries: Pork Rice Bowl; Pork Shabu Curry; Yaki Soba; Konjac Kimchi Noodles; Tuna Kimchi; Kimchi Soup; Wakame Egg Soup; Wakame Salad; Carrot Shabu; Shabu Ramen. | Pork, tuna, egg, tofu, and mushrooms; rice, konjac, or broth bases; kimchi, wakame, carrot, napa cabbage, and shabu flavors. Stir-fry, simmering, soup, shabu, salad mixing, and bowl assembly. Strongest complete-meal/soup/salad mix in the corpus. | Quantities and kcal/protein/carbs/fat are generally clear, with one-recipe nutrition basis; product-specific sauces/noodles remain. Most entries have 3–4 written steps, clearer than the snack-focused PDFs. | Pork Shabu Curry, Yaki Soba, Shabu Ramen, and Tuna Kimchi duplicate other PDFs. **High** value for technique/cuisine/seaweed/konjac evidence, but the duplicate entries should not be counted again. |

## E. Raw Recipe Count

61 raw recipe entries:

- PDF01: 9
- PDF02: 5
- PDF03: 7
- PDF04: 9
- PDF05: 4
- PDF06: 11
- PDF07: 6
- PDF08: 10

## F. Approximate Unique Concept Count

**Approximately 55 unique concepts**, using conservative dish-level normalization. A more aggressive family-level normalization would put the corpus closer to 50 because several books repeat the same base format with different toppings or flavor names.

## G. Existing Matches

One concept is classified as an **A — Existing Match**:

- **Kimchi Soup (PDF08)** ↔ current [`kimchi-tofu-stew`](<G:/work/ta/healthy-recipe-app/src/recipes.ts>) family. The exact canonical formulation still deserves a check, but the production dataset already represents the same kimchi/tofu/soup meal concept.

## H. Similar-but-Useful Concepts

There are **21 unique B concepts**. They add a meaningful variation but do not automatically justify a new production recipe: tuna/egg/yogurt salad formats; chia pudding; chicken nuggets and Thai chicken cakes; sweet-potato rice and waffle variants; tiramisu/fruit overnight oats; egg-white fried rice; yaki soba; pork shabu curry; shabu ramen; pork rice-noodle stir-fry; pork rice bowl; and carrot shabu.

The useful distinction is usually format, serving, or flavor profile—not a missing core ingredient. These should be selected only after comparing against the closest existing IDs and applying canonical nutrition calculations.

## I. Genuinely New Concepts

There are **25 unique C concepts** under the current product direction:

- Buffalo chicken dip as a protein spread.
- A clean egg-white/chia bread base.
- Chicken breast chips/sheet, shredded chicken prep, chicken breast bread, chicken waffle, and sliceable chicken loaf.
- Sweet-potato cereal, sweet-potato nest/nuggets, sweet-potato kimchi, and sweet-potato yogurt-herb dip.
- Egg-white savory porridge, cloud bread, garlic-cheese egg-white bread, and egg-white chips.
- Crispy silken tofu, baked soft tofu, tofu waffle, crispy tofu sheet, vegan tofu cream cheese, and tofu-skin noodles.
- A clean chia-protein mousse, konjac kimchi egg noodles, wakame egg soup, and wakame salad.

“New” here means a format or use case absent from the current dataset, not that the ingredient itself is absent.

## J. Existing-Recipe Improvement References

Two unique concepts are **D — Reference for Existing Recipe Improvement** rather than separate additions:

- **Tzatziki Dip (PDF01):** useful as a portion, yogurt/cottage-cheese, cucumber, and oil formulation reference for any future dip/spread treatment.
- **Baked Sweet Potato Cheese (PDF04):** useful for checking cheese quantity, portion basis, and the difference between a side/snack and a complete meal.

## K. Rejected / Low-Value Concepts

Six unique concepts are **E — Reject / Low Value** for the current product direction:

- Cucumber salad with nacho chips/ranch-style dressing: weak meal value and processed-component dependence.
- Strawberry chia jam: a component, not a standalone GoodFood meal.
- Sweet-potato cream waffle: dessert-like and brand/protein-powder dependent.
- Sweet-potato smoothie: dessert/snack format with weak meal differentiation.
- Cookie & Cream Oat: Oreo/dessert variation already far from the strongest healthy-meal need.
- Egg-white cookies: unclear serving claim and weak recipe/product value.

## L. Cross-PDF Duplication

Six strong duplicate/near-duplicate groups account for the reduction from 61 raw entries to approximately 55 concepts:

1. Tuna Kimchi: PDF01 and PDF08.
2. Big Batch Chia Pudding and Chia Pudding Ice Cream: PDF02; same ingredients and nutrition base, different frozen presentation.
3. Egg-white Chia Bread / Flourless Egg-white Chia Bread: PDF02 and PDF06.
4. Yaki Soba: PDF06 and PDF08.
5. Pork Shabu Curry: PDF06 and PDF08.
6. Shabu Ramen: PDF06 and PDF08.

Additional family similarity exists within the waffle, chicken-bread, sweet-potato, overnight-oat, and egg-white snack groups. Those are not automatically duplicates because format and use case can differ.

Unique-concept classification, with shared duplicate entries counted once:

| Class | Meaning | Count |
|---|---|---:|
| A | Existing match | 1 |
| B | Similar but potentially useful | 21 |
| C | Genuinely new | 25 |
| D | Improvement reference | 2 |
| E | Reject / low value | 6 |
| **Total** |  | **55** |

Normalized concept map by PDF (shared entries retain their one concept identity):

| PDF | Concepts and primary class |
|---|---|
| PDF01 | B Tuna Kimchi; B Tuna Corn Salad; B Shrimp Egg Salad; B Crab-stick Shrimp Egg Salad; B Healthy Egg Salad; B Tuna Boiled-Egg Salad; E Cucumber Salad; D Tzatziki Dip; C Buffalo Chicken Dip |
| PDF02 | C Chia Protein Pudding (Big Batch/Ice Cream merged); C Chocolate Chia Mousse; E Strawberry Chia Jam; C Egg-white Chia Bread (shared with PDF06) |
| PDF03 | C Chicken Breast Chips; C Shredded Chicken; B Chicken Nuggets; C Chicken Breast Bread; C Chicken Waffle; B Thai Chicken Cakes; C Chicken Loaf/Sausage |
| PDF04 | B Sweet Potato Rice; C Sweet Potato Cereal; E Sweet Potato Cream Waffle; B Sweet Potato Waffle; C Sweet Potato Nest/Nuggets; D Baked Sweet Potato Cheese; C Sweet Potato Kimchi; C Sweet Potato with Yogurt Dip; E Sweet Potato Smoothie |
| PDF05 | B Tiramisu Oat; E Cookie & Cream Oat; B Blueberry Avocado Oat; B Blueberry Cheesecake Oat |
| PDF06 | C Egg-white Porridge; B Egg-white Fried Rice; B Yaki Soba (shared with PDF08); B Pork Shabu Curry (shared with PDF08); B Shabu Ramen (shared with PDF08); B Pork Rice-noodle Stir-fry; C Cloud Bread; C Egg-white Chia Bread (shared with PDF02); C Garlic-cheese Egg-white Bread; E Egg-white Cookies; C Egg-white Chips |
| PDF07 | C Crispy Silken Tofu; C Baked Soft Tofu; C Tofu Waffle; C Crispy Tofu Sheet; C Vegan Tofu Cream Cheese; C Dry Tofu-skin Noodles |
| PDF08 | B Pork Rice Bowl; B Pork Shabu Curry (shared); B Yaki Soba (shared); C Konjac Kimchi Noodles; B Tuna Kimchi (shared with PDF01); A Kimchi Soup; C Wakame Egg Soup; C Wakame Salad; B Carrot Shabu; B Shabu Ramen (shared) |

## M. Nutrition / Serving Evidence Quality

The corpus is useful for sanity checks but not for direct production nutrition:

- The recurring fields are kcal, protein, carbs, and fat. Fiber and sodium are not consistently supplied.
- PDF01 commonly shows a total plus a 2-serving/per-serving callout. PDF02 mixes total batch, cube, jar, and tablespoon bases. PDF03 uses total and piece counts. PDF04 often uses total plus piece/serving callouts. PDF05 often appears to be per jar/container but does not make the basis consistently explicit. PDF06 mixes total and approximate per-piece claims. PDF07 and PDF08 are generally per-recipe figures, with serving interpretation still needing verification.
- Quantities are usually explicit, but herbs, spices, sauces, oil, and sweeteners often say to taste. Protein powders, granola, Oreo/Biscoff, Eggyday rice/noodles, Ketody-style sauces, tube tofu, and other branded products make direct comparison unreliable.
- The PDFs are valuable as relative checks: for example, a 2-serving high-protein bowl should not have a single-serving macro claim, and an oil/cheese-heavy dip should not appear to have negligible fat. They are not a canonical nutrition source.
- R2 should normalize servings first and recalculate from the app’s canonical ingredient/nutrition approach. `data/foods.json` is a separate menu/food catalog in this repository, not a drop-in replacement for the recipe source; any later nutrition implementation must explicitly resolve that boundary.

## N. Current Dataset Gap Analysis

Supported gaps and opportunities:

- **Breakfast/snack formats:** the production categories do not have a dedicated breakfast/snack category. Egg-white porridge, cloud bread, chia bread, tofu waffle, protein chips, and yogurt-dip sweet potato could fill meal-slot gaps if they are intentionally represented as Quick meals or Plant-forward.
- **Chia/protein formats:** only 7 current recipes have oats/chia markers, and the corpus supplies cleaner chia pudding/mousse/bread choices. One normalized chia pudding is more useful than multiple branded dessert jars.
- **Sweet-potato formats:** 10 current recipes contain sweet-potato markers, mostly as a meal component. The corpus contributes kimchi, dip, cereal, and snack formats rather than a missing ingredient.
- **Tofu formats:** the app already has many tofu/soy meals, but tofu waffle, crispy tofu sheet, and vegan tofu cream cheese are genuinely different use cases. This is a targeted format gap, not a reason to add another large tofu-meal batch.
- **Seaweed/light sides and soups:** wakame egg soup and wakame salad add a relatively underrepresented seaweed/light-soup profile; they need a decision about whether the product accepts side-like recipes.
- **Lower-calorie high-protein formats:** egg-white porridge, cloud bread, chips, and chicken sheet/loaf formats offer useful low-calorie or batch-prep evidence, but the source products and serving claims need recalculation.
- **Japanese/Korean techniques:** shabu, wakame soup, kimchi, konjac noodles, and simple broth/assembly methods add technique and flavor evidence even when the exact dish family already exists.

The corpus does not support a broad conclusion that GoodFood lacks chicken, fish/seafood, eggs, legumes, rice/noodles, soups, salads, Japanese-inspired meals, Korean-inspired meals, or high-protein meals. Those areas are already materially represented.

## O. Current Dataset Overrepresentation

The current 200 recipes already overrepresent or broadly cover:

- Chicken-breast and chicken-and-rice/bowl variants. PDF03’s seven chicken formats are useful for portable/batch-prep formats, but not as seven new main meals.
- Tofu/soy and plant-forward meals. The tofu PDF should produce at most a small format-focused selection.
- Japanese/Korean noodle, kimchi, shabu, and bowl families. PDF08 is valuable for technique and seaweed/konjac gaps, but its repeated yaki soba/curry/ramen entries should not inflate the candidate list.
- Overnight oats and yogurt/oat breakfast logic. PDF05 mostly supplies dessert-flavor variations around an existing family.
- Sweet-potato meal components. PDF04 should be mined for one or two new formats, not nine additions.

## P. Strong New-Recipe Shortlist

This is a future shortlist only; no recipe implementation is authorized in R1. The first bounded batch should be 12 candidates at most, subject to R2 audit and product decisions about snack/side formats.

| Proposed normalized concept | Source | Value and nearest existing recipe(s) / differentiation | Main protein/base; complexity | `foods.json` recalculation feasibility | Recommendation |
|---|---|---|---|---|---|
| High-protein chicken breast sheet/chips | PDF03 | Portable/batch-prep format absent from current chicken meals; nearest chicken bowls and patties, but different use case. | Chicken; medium | High after canonical chicken/seasoning mapping | CONSIDER |
| Shredded chicken protein prep | PDF03 | Make-ahead topping/snack rather than another plated chicken bowl; nearest grilled chicken/larb. | Chicken; low/medium | High | CONSIDER |
| Sliceable chicken protein loaf | PDF03 | Batchable, portionable protein format; distinct from current chicken mains. | Chicken; medium | High, with starch/seasoning review | CONSIDER |
| Savory egg-white low-cal porridge | PDF06 | Breakfast/light-meal gap; nearest `prawn-rice-congee` and savory oats, but egg-white base differs. | Egg white; low | Medium because the PDF uses a product-specific input | CONSIDER |
| Flourless egg-white chia bread | PDF02/PDF06 | New breakfast base and bread-like format; nearest `overnight-oats-berry-chia` only by meal slot. | Egg white/chia; medium | High after recalculation | CONSIDER |
| Tofu waffle | PDF07 | New vegetarian breakfast format; nearest `korean-tofu-egg-pancakes`, with a different texture/base. | Tofu; low/medium | High | CONSIDER |
| Crispy tofu sheet/chips | PDF07 | Plant-protein snack format absent from current tofu meals; nearest tofu mains are not interchangeable. | Tofu/tofu skin; medium | Medium because product form varies | CONSIDER |
| Vegan tofu cream-cheese spread | PDF07 | New plant-based spread; current set has no comparable dip/spread. | Silken tofu; low | High after fixing oil/serving basis | CONSIDER |
| Sweet potato with kimchi | PDF04 | Simple fermented-carb format that bridges current sweet-potato and kimchi families without duplicating a bowl. | Sweet potato/kimchi; low | High | ADD after audit |
| Sweet potato with yogurt-herb dip | PDF04 | Light breakfast/snack format; nearest `fruit-yogurt-bowl`, but savory sweet-potato base differs. | Sweet potato/yogurt; low | High | CONSIDER |
| Konjac kimchi egg noodles | PDF08 | Lower-calorie noodle format; nearest `korean-tofu-glass-noodles` and kimchi meals, but konjac/egg structure differs. | Egg/konjac/kimchi; low/medium | Medium due product-specific noodles | CONSIDER |
| Wakame egg soup | PDF08 | Adds seaweed and a light soup use case; nearest `pumpkin-soup-with-egg` is a different base. | Egg/wakame; low | High | ADD after audit |

Deferred, not selected for the first batch: Buffalo chicken dip; one clean chia-protein pudding; one non-dessert overnight-oat variant; wakame salad as a side; sweet-potato cereal. They remain useful if the product explicitly expands snack, side, or breakfast coverage.

## Q. Existing-Recipe Audit Shortlist

These are comparison targets for R2, not defects declared in R1.

| Production ID / current name | PDF comparison | Suspected issue or opportunity | Evidence | R2 action |
|---|---|---|---|---|
| `kimchi-tofu-stew` / current kimchi tofu stew | PDF08 Kimchi Soup | Possible same-family overlap; verify tofu type, broth, serving, and differentiation. | Strong | Compare and keep, differentiate, or merge conceptually |
| `overnight-oats-berry-chia` / Berry Chia Overnight Oats | PDF02 chia pudding; PDF05 overnight-oat variants | Check serving basis, topping quantities, and whether a clean variant adds more than a flavor rename. | Moderate | Recalculate and confirm differentiation |
| `fruit-yogurt-bowl` / Fruit Yogurt Seed Bowl | PDF02 chia pudding; PDF05 oat jars | Breakfast-base overlap and portion/nutrition sanity check. | Weak/Moderate | Verify; likely keep unchanged |
| `tofu-yakisoba-vegetables` / Tofu Yakisoba with Vegetables | PDF06/PDF08 Yaki Soba | Useful noodle/sauce/protein portion benchmark, not proof of an error. | Moderate | Verify quantities and family boundary |
| `japanese-pork-yaki-udon` / Japanese Pork Yaki Udon | PDF08 Yaki Soba | Check whether the catalog has two intentionally distinct pork/noodle meals or accidental family duplication. | Weak/Moderate | Review naming and differentiation |
| `korean-tuna-kimchi-rice` / Korean Tuna Kimchi Rice | PDF01/PDF08 Tuna Kimchi | Clarify rice-bowl versus spread/filling identity and avoid treating the PDF duplicate as a new dish. | Moderate | Keep if format is clear; otherwise refine naming/content |
| `greek-chicken-sweet-potato-tray` / Greek Chicken Sweet Potato Tray | PDF04 sweet-potato meals | Portion/base comparison only; current dish is a complete meal while most PDF variants are snacks/sides. | Weak | Recalculate only if numbers look implausible |
| `japanese-shioyaki-salmon-sweet-potato` / Japanese Shioyaki Salmon with Sweet Potato | PDF04 sweet-potato meals | Compare sweet-potato serving and meal balance, not title similarity. | Weak | Keep unless canonical check finds an issue |
| `korean-tofu-egg-pancakes` / Korean Tofu Egg Pancakes | PDF07 tofu waffle | Format-family overlap; confirm egg/tofu quantities and whether the waffle is materially distinct. | Weak/Moderate | Decide whether one format needs clearer differentiation |

## R. PDF Research-Value Assessment

| Rank | PDF | Research value | Reason |
|---|---|---|---|
| 1 | PDF08 Japanese/Korean menus | **HIGH** | Best complete-meal, soup, salad, broth, shabu, seaweed, and konjac evidence; explicit short instructions; duplicates are easy to remove. |
| 2 | PDF07 Tofu protein | **MEDIUM** | Strongest source for new tofu formats and a vegan spread, despite existing tofu-meal breadth. |
| 3 | PDF04 Sweet Potato | **MEDIUM** | Good breakfast/snack/side format evidence; current dataset already covers sweet-potato meals, so use selectively. |
| 4 | PDF02 Chia | **MEDIUM** | Useful chia/protein portion and no-cook/freezer concepts; only four unique concepts after merging and several are components/desserts. |
| 5 | PDF01 Dips/salads/fillings | **MEDIUM** | Good protein-spread and portion evidence; weak as a complete-meal corpus. |
| 6 | PDF03 High Protein Everyday | **MEDIUM** | Useful chicken snack/batch formats, but chicken is already abundant and the book is narrow. |
| 7 | PDF06 Egg-white meals | **LOW** | Several useful low-cal formats, but multiple cross-PDF duplicates, proprietary Eggyday inputs, and serving ambiguity reduce direct value. |
| 8 | PDF05 Overnight Oat | **LOW** | Mostly dessert-style flavor variants around an existing overnight-oat recipe family. |

This ranking is research value for the GoodFood dataset, not a ranking of the books themselves.

## S. Copyright / Image Handling Confirmation

No PDF images were extracted, copied, added to app assets, or used as image references. No PDF layout was recreated and no substantial prose or recipe instructions were copied. The report uses titles and short factual ingredient/concept descriptions only to identify and compare concepts. Any later production image must be created independently, and any later recipe text must be authored for GoodFood.

## T. Recommended R2 Direction

**Option A — R2: Existing 200 Recipe Quality Audit / Corrections** is the best next step.

The corpus has real value, but its strongest evidence is concentrated in targeted format gaps and portion/nutrition checks. The current dataset already has broad cuisine, protein, tofu, chicken, noodle, sweet-potato, and high-protein coverage. At the same time, the PDFs have inconsistent serving bases, approximate nutrition, product-specific ingredients, and six strong duplicate groups. Auditing first reduces the chance of adding redundant or numerically weak recipes.

Option C could follow after the audit, but it should not be the default. A small new batch can be selected from section P only after R2 verifies the existing family boundaries.

## U. Suggested R2 Batch Size / Scope

Recommended R2 scope:

1. Audit 8–12 existing recipes/families from section Q.
2. Recalculate serving basis and nutrition using canonical recipe ingredients; do not copy PDF values.
3. Decide whether snack, side, breakfast, and spread formats fit the product’s category model.
4. If new recipes are approved after the audit, cap the first implementation batch at **8–12**, selected from section P. Do not implement the full 55-concept corpus.

## V. Files Changed

Authorized change by this audit:

- [`docs/recipe-pdf-corpus-audit-r1.md`](<G:/work/ta/healthy-recipe-app/docs/recipe-pdf-corpus-audit-r1.md>) — this report only.

No production recipe files, `data/foods.json`, restaurant files, tests, UI, image manifest, or assets were modified by this agent. No file was staged, committed, pushed, reset, restored, stashed, or cleaned.

## W. Concurrency / Worktree Check

The concurrent restaurant work advanced during the audit. At exit, the checkout was on:

- Branch: `main`
- HEAD: `fb0e8b5a34eb4d762fed8ab6b31a4aa639788505` (`feat: expand restaurant menu images`)
- The pre-existing restaurant/test modifications from section A had been incorporated into that concurrent commit; this audit did not create or alter that commit.
- Before adding this report, the worktree had no tracked or visible untracked changes; after adding it, the only intentional new path is this report. The `research/` directory is the supplied, ignored corpus and was read only.

## X. Production Integrity

Read-only exit checks:

- Runtime recipe count: 200.
- Unique recipe IDs: 200.
- Unique recipe images: 200.
- `validateRecipes(recipes)`: no errors.
- Image manifest entries: 200.
- `public/recipes` `.webp` assets: 200.
- `data/foods.json` entries: 828.
- `data/foods.json` SHA-256: `FF39F65F8122F15BB1715E58A34F3A3320422FA5A2A8DA1B82EAC220CB5E1D9A`, matching the repository’s test-pinned hash.
- Exit hashes recorded for unchanged production references: `src/recipes.ts` `6516CD389DAA5299F53A177E7E1E21B0437E20E1A4A9A841B6E6EE82659508DB`; `src/recipe-content.ts` `463DDF11592FA4CFE86EEC80266C0082F8E9EFF4BC34C6618AF70EDD3F61DE66`; `src/recipe-image-manifest.ts` `F13B05363BABDE2AA7C7368D119081478B6FDE757126E33F018F1B400A0B4626`.
- Baseline tests: 26 test files passed, 394 tests passed. The only console noise was the existing jsdom `Window's scrollTo() method` notice.
- No restaurant path was touched by this audit.

## Y. Final Recommendation

The corpus should not trigger a broad recipe import. It provides meaningful targeted evidence for an existing-recipe audit and a later small batch focused on breakfast/snack formats, egg-white/chia, tofu formats, sweet-potato use cases, wakame/konjac, and carefully differentiated protein prep. The correct R2 sequence is audit first, then selectively implement no more than 8–12 candidates if the product model supports those formats.

Final status: LIMITED — useful only for targeted corrections/additions
