# GoodFood bounded correction pass — A–S

## A. Entry state

Branch main; HEAD 18363bd43c2f6093f183d2e790e3fe6b19f6dd43. Existing uncommitted +50 candidate preserved. Entry: 150 recipes, 150 unique IDs, 150 image paths, 150 production WebPs, 150 manifest entries and 117 canonical Pantry IDs. data/foods.json unchanged. Eleven tracked source/test files were already modified; recipe-additions.ts, its test and 50 new production WebPs were already untracked.

## B. First-100 freeze reconciliation

Used approved Thai culinary content retained in the committed expansion file as the semantic reference; did not restore its malformed seed objects. Repaired runnable seed representation remains intact. Reconciled English preparation, sequencing and Thai ingredient identity against that approved content. No first-100 image was changed. Of the 14 reviewed records, 13 runtime objects changed from entry and pumpkin chicken soup was already semantically correct. All other original-100 runtime recipe hashes match entry.

## C. Final disposition of all 14 records

| ID | Disposition |
|---|---|
| thai-red-curry-tofu | Restored soy and 3 tbsp coconut paste-blooming; remaining coconut added later; basil off heat. Soy quantity explicitly reconstructed as 1 tsp; bounded nutrition delta recorded. |
| thai-pumpkin-chicken-soup | Preserved justified state: stock/herb infusion, tender pumpkin, fully cooked chicken, lemongrass removed and lime/fish sauce off heat. Runtime content unchanged from entry. |
| thai-mushroom-cashew-stir-fry | Restored mushroom-edge browning, garlic in final 30 seconds and high-heat sauce coating. |
| thai-steamed-chicken-cabbage | Restored finely chopped shiitake identity; 12–15-minute steaming with cooked-through chicken endpoint. |
| chicken-oyakodon | Preserved sugar in dashi/soy; explicit fully cooked chicken before softly set egg. |
| salmon-ochazuke | Preserved divided soy: half on salmon and remaining half in green tea; bilingual method restored. |
| tofu-yakisoba-vegetables | Restored half/remaining sesame-oil allocation and high-heat coating. |
| edamame-egg-sushi-bowl | Restored non-stick thin omelet without extra oil; retained measured salt. |
| soba-tuna-cucumber-bowl | Preserved justified soy/vinegar/sesame-oil dressing and chilled serving; bilingual text restored. |
| japanese-mushroom-chestnut-rice | Fixed identity/order: sesame oil 1 tsp → sesame seeds 1 tsp → nori 1 sheet in both languages; restored mushroom browning. |
| korean-bean-sprout-chicken-soup | Restored explicit fully cooked chicken endpoint; retained sesame oil/chilli and rice. |
| light-mapo-tofu | Restored pork browning, aromatics for 30 seconds and exactly 3 tbsp water. |
| white-bean-tomato-soup | Restored garlic/oregano final 30 seconds and final taste/adjust checkpoint; retained approved salt. |
| hummus-chicken-pita | Restored Thai lemon (น้ำเลมอน), including divided lemon in both instructions; retained approved salt/marination. |

## D. HIGH corrections

- Massaman: red curry paste + named curry powder/cinnamon/cardamom, coconut blooming, peanuts and controlled sweet/salty/lime finish; no new Pantry ID.
- Japanese sukiyaki: soy/sugar/rice-vinegar/water home cooking liquid, not Thai dip; staged beef/vegetable/tofu/glass-noodle method and corrected photo.
- Tuna miso bowl: measured 100 g lettuce, truthful TH/EN title, lettuce used in serving and corrected photo.
- Caramel pork: lean loin retained; sugar caramelized separately, carefully quenched with measured water, controlled glaze and cooked-through endpoint; lean-pork photo. Food quantities/nutrition unchanged.
- Lentil bolognese: vegetarian-certified microbial-rennet hard cheese retained as a qualified raw Shopping line; full nutrition recalculation without manipulating amounts.
- Savory oats: vegetable stock, actual covered egg method with fully set whites, one egg per serving, full recalculation and removed High protein tag.

## E. MEDIUM corrections

| Recipe ID | Implemented correction |
|---|---|
| thai-steamed-salmon-chilli-lime | Regenerated celery/rice photo. |
| thai-egg-fried-rice-prawns | Regenerated brown rice, egg and prawns photo. |
| thai-tom-yum-tofu-noodles | Explicit vegetable stock; corrected image brief to existing whole-wheat noodles. |
| thai-green-curry-white-fish | Regenerated actual fish/green-bean/pepper curry photo. |
| japanese-chicken-miso-ginger-bowl | Measured oil, brown first/glaze later, explicit doneness, nutrition and cabbage/carrot photo. |
| japanese-tofu-teriyaki-vegetables | 3 tbsp sauce with evaporation/coating endpoint; nutrition recalculated. |
| japanese-soba-mushroom-soup | Vegetable stock and tofu/spinach/soba photo. |
| japanese-eggplant-miso-donburi | Measured divided oil, stronger miso/sugar/vinegar glaze; tender eggplant, nutrition and tofu photo. |
| japanese-tamago-edamame-rice | 60 ml vegetable stock, wide pan, reduce liquid, softly set egg; nutrition and folded-egg photo. |
| korean-chicken-dakgalbi | 1 cm sweet potato with staged covered cooking and chicken doneness; corrected photo. |
| korean-beef-glass-noodles | Korean sweet-potato noodles, beef-specific marinade/sear, onion and sweet-savory sesame balance; nutrition. |
| korean-tofu-kimchi-lettuce-wraps | Regenerated tofu/kimchi/cucumber/rice wraps photo. |
| korean-egg-tofu-stew | Vegetable stock; regenerated actual zucchini/mushroom/egg/tofu photo. |
| chinese-tofu-broccoli-sesame | Measured soy/vinegar/sugar glaze, water evaporation and coating; nutrition. |
| chinese-steamed-tofu-egg-custard | Vegetable stock; shallow covered dish, depth, gentle steam, center-setting/recheck/rest; corrected photo. |
| chinese-prawn-egg-drop-soup | Regenerated prawn, egg ribbons, mushroom/corn photo. |
| chinese-beef-celery-rice-noodles | Measured sauce, separate beef browning, water reduction and hot coating; nutrition. |
| chinese-chickpea-lettuce-cups | Measured oil/soy/vinegar; mushroom browning and bound filling; nutrition and actual rice/pepper photo. |
| vietnamese-beef-vermicelli-salad | Thai title corrected to เส้นหมี่. |
| vietnamese-shrimp-lemongrass-rice | Carrot/daikon quick pickles and divided fish/sugar chilli-lime dressing; differentiated title, nutrition and photo. |
| vietnamese-tomato-tofu-braise | Regenerated tomato/onion/tofu/spinach photo. |
| greek-chicken-sweet-potato-tray | 1.5 cm potato cubes, chicken thickness/doneness, lemon divided 1 tbsp + 1 tbsp; nutrition reassessed. |
| italian-tuna-white-bean-pasta | Recalculated actual dry pasta + tuna + beans without changing composition. |
| mexican-chicken-bean-tortilla | Open crisp tostada with mashed black beans/chicken/salsa, distinct from avocado wrap; same ID/path, nutrition and photo. |
| one-pan-chicken-vegetable-quinoa | 80 ml stock reduced before folding already-cooked quinoa; nutrition reassessed. |

## F. TH/EN consistency

Manually compared the 14 first-100 records and all 25 new recipe-content records touched: ingredient identity/order/preparation, shared quantity/unit, sequence, timing, divided oil/soy/sugar/lemon, sauce meaning and doneness. Array-length validation is additional, not the sole check. Image-only recipes retained their content. No untranslated new ingredient.

## G. Dietary corrections

Six affected generic-stock recipes now explicitly specify vegetable stock. Lentil bolognese remains Vegetarian with a qualified non-animal-rennet cheese requirement. Savory oats remains Vegetarian but is no longer tagged High protein. Existing vegan kimchi requirement preserved.

## H. Nutrition recalculations

18 bounded ingredient-level recalculations plus one first-100 soy delta. See [full nutrition ledger](correction-nutrition.md) for all profiles, ingredient weights, product assumptions and results. Per serving: oats 298 kcal/17 g protein; lentil bolognese 582/30; tuna pasta 524/42; Greek tray 356/38; quinoa chicken 368/40. All 18 have finite/nonnegative values and acceptable macro-derived energy differences. These remain approximate food-table/product-assumption estimates, not lab-verified nutrition. Stock-identity-only and method-only recipes were not unnecessarily recalculated.

## I. Pantry impact

Exactly 117 canonical IDs. No architecture changes. Ground cardamom is an excluded seasoning. Vegetarian hard cheese deliberately has no ordinary-Parmesan ID; an explicit shopping-only audit helper documents that exception. All other additions map or are recognized excluded seasonings. Lettuce direct browse and tuna + lettuce ranking verified.

Canonical display limitations remain: red curry paste appears as generic Curry paste; vegetable stock as Stock; Korean sweet-potato noodles as Glass noodles. Recipe detail retains precise purchasing requirements. These existing coarse categories were not redesigned.

## J. Shopping impact

Japanese sukiyaki has no sukiyaki-sauce ingredient; only the existing Thai chicken suki recipe uses that canonical item. Combined aggregation leaves the Thai sauce unchanged. Three Japanese servings produce 390 g beef, 90 g noodles, 4½ tbsp soy and 1½ tsp oil/vinegar. Vegetarian cheese remains explicitly qualified in TH/EN and scales to 22½ g for three servings. Existing incompatible-unit aggregation tests remain in the passing suite. No Shopping implementation file changed.

## K. Duplication corrections

Chicken tortilla is now a flat crisp black-bean tostada, not an avocado wrap. Shrimp lemongrass rice has actual carrot/daikon quick pickles and a separate chilli-lime dipping dressing. Beef japchae has beef-specific marination/searing and a stronger sweet-savory-sesame sauce.

## L. Images regenerated and visual QA

19 production paths replaced, all local 1024×1024 WebPs; built-in image generation (not CLI fallback). Every generated composition visually inspected for defining ingredients, serving form and forbidden substitutions before format conversion. See [image QA and prompt set](correction-images.md) for individual findings and every final path. Required 16 + transformed shrimp/tostada + dakgalbi correction. All other image hashes match entry, including every original-100 photo.

## M. Tests added/updated

Added recipe-corrections.test.ts: seven targeted tests cover chestnut Thai identity/order/quantities, lemon, original cooking safeguards, Japanese/Thai sauce separation, vegetarian stock/cheese, lettuce/Pantry, nutrition, fractional Shopping scaling and distinct recipe concepts. Updated existing Pantry/additions/filter expectations for corrected ingredient counts and nutrition. Existing 150-ID/manifest/asset tests retained. No whole-object recipe snapshots added.

## N. Runtime verification

Local browser smoke passed: Browse/search, English detail, Favorites add/view, Shopping selection, Thai/English switching, three-serving fractional quantities, Pantry ingredient view, direct lettuce browse (12 recipes) and tuna + lettuce multi-select (17 matching recipes; corrected tuna bowl among two-ingredient matches). Used supported 360×800 viewport; inspected detail, Shopping and Pantry results screenshots. No horizontal layout clipping observed. Test-only Favorites, Shopping and Pantry selections removed afterward; search cleared and viewport reset.

## O. Automated checks

- Final default npm test: 16 files / 91 tests passed in 12.81 seconds. Two-worker full-suite run also passed.
- Earlier runs exposed corrected expectations and, separately, three existing 5-second UI-test timeouts under machine load. No timeout settings or app behavior were changed; both final default and bounded-worker reruns passed.
- Repository-compatible Node 24.19.0 TypeScript --noEmit: passed.
- npm run build: passed. Existing >500 kB chunk warning remains (601.89 kB JS); no bundling redesign in this correction scope.
- git diff --check: passed (only Git line-ending advisory warnings).
- Counts: 150 recipes / unique IDs / image paths / manifest entries / WebPs; 117 Pantry IDs. One-to-one assets and no remote production URLs verified by tests.

## P. Files changed

This correction pass edited src/recipe-expansion.ts, src/recipe-additions.ts, src/pantry.ts, src/recipe-additions.test.ts, src/pantry.test.ts and src/recipes.test.ts; added src/recipe-corrections.test.ts and three docs/correction-*.md records; replaced the 19 WebPs listed in the image record. Other already-modified candidate files were preserved rather than rewritten. No UI, Favorites, Shopping, backend, dependency or build configuration files changed in this pass.

## Q. Repository hygiene

data/foods.json unchanged; HEAD/branch unchanged; no commit, push or staging. 150 production WebPs, no orphan image and no temporary PNG/JPG/draft/script files added to the repository. Generated PNG originals remain outside the repository in the tool-owned output directory. Build output is ignored. Hash comparison confirms all PASS/LOW new recipe objects and unrelated images unchanged from entry.

## R. Remaining findings / limitations

No known required HIGH/MEDIUM correction remains unimplemented. LOW/optional audit items intentionally deferred. Independent review should specifically challenge the documented 1 tsp historical-soy reconstruction, ingredient/profile assumptions in nutrition, and photo fidelity. Generic Pantry/Shopping category limitations are documented above. Automated tests do not establish culinary authenticity, taste or food safety under every kitchen condition. No production-ready claim.

## S. Final verdict

CORRECTION PASS COMPLETE — READY FOR INDEPENDENT RE-REVIEW

Next step: independent bounded re-review. Leave the complete candidate and corrections uncommitted.
