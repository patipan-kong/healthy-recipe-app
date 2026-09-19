# GoodFood V2 — Slice 32: Recipe ↔ Restaurant Relation Coverage Audit

Status: **Read-only audit, complete.** No production data, schema, UI, or code was modified. This document is the only file this slice adds or changes. Nothing has been committed or pushed.

---

## 1. Entry Baseline

- Branch: `main`
- HEAD: `71712b9244a97060ae1ed8466a98f7af2a1a66b6` ("feat: add restaurant-inspired recipe batch")
- `git status --short`: clean at entry, clean at exit. No unexpected worktree changes.

Counts confirmed from source (not from memory of prior slices):

| Metric | Expected (per brief) | Actual (counted from source) |
|---|---|---|
| Recipes | ~208 | **208** |
| Unique recipe IDs | ~208 | **208** |
| Recipe manifest entries | ~208 | **208** |
| Recipe WebP assets (`public/recipes/*.webp`) | ~208 | **208** |
| Restaurants | 13 | **13** |
| Restaurant menu items | 84 | **84** |
| Restaurant menu images (`menuImage` present) | 19 | **19** |
| Verified prices (`price` present) | 24 | **24** |
| Recipe↔Restaurant relations | 12 | **12** |

All actual counts match the expected baseline exactly. Slice 31 is confirmed present (208 recipes, 12 relations, including the `chicken-oyakodon::ootoya-oyakodon` correction and the 6 Batch-1 relations).

Baseline validation: full Vitest suite run before any analysis — **32 test files, 481 tests, all passing.** `validateRecipes()` and `validateRecipeRestaurantRelations()` both return `[]` (no errors) on current production data.

---

## 2. Current Relation Model

From `src/recipe-restaurant-relations.ts`:

- **`relationKind`**: a single literal type, `'similar-dish'`. Every one of the 12 production relations uses this same value — there is no second kind in use today, and the type doesn't currently define one.
- **Data shape**: `{ recipeId, restaurantMenuItemId, relationKind, note? }` — a flat array, no directionality field, no confidence field, no per-relation copy override (the `note` field exists in the type but is unused across all 12 current entries).
- **Lookup functions**: `relatedMenuItemsForRecipe(recipeId)` returns **all** matching menu items (array), fully resolved with restaurant info. `relatedRecipesForMenuItem(menuItemId)` returns **all** matching recipes (array).
- **Validation**: `validateRecipeRestaurantRelations()` checks for unknown `recipeId`/`restaurantMenuItemId`, duplicate pairs, and invalid `relationKind`. It does not check semantic dish identity — that is (by design) a human curation step, not an automated one.
- **UI rendering direction asymmetry** (found while reading `App.tsx`):
  - **Recipe → Restaurant** (Recipe Detail page, `recipeBridgeHeading`): renders **all** related menu items as a list (`relatedMenus.map(...)`). Already handles one-recipe-to-many-restaurants cleanly (in use today for `thai-papaya-salad`, which has 3).
  - **Restaurant → Recipe** (Restaurant menu picker, `relatedRecipesForMenuItem(pickedItem.id)[0]`): renders only the **first** related recipe. No production menu item currently has more than one relation, so this hasn't surfaced as a problem, but it is a latent constraint: if a future slice ever gave one menu item two recipe relations, only the first would display. None of this audit's candidates create that situation.
- **UI copy** (`src/i18n.ts`):

  | Key | English | Thai |
  |---|---|---|
  | `recipeBridgeHeading` | "Rather buy it?" | "อยากซื้อกิน?" |
  | `recipeBridgeSubtitle` | "Similar dishes at restaurants" | "มีเมนูใกล้เคียงที่ร้าน" |
  | `menuBridgeHeading` | "Want to make it?" | "อยากทำเอง?" |
  | `menuBridgeSubtitle` | "Try a similar recipe" | "ลองทำเมนูใกล้เคียง" |

  Notably, **the subtitle in both languages already hedges with "similar" / "ใกล้เคียง"** ("similar dishes," "a similar recipe"), even though the heading ("Rather buy it?" / "Want to make it?") reads more assertively. This means the current copy is not purely a SAME_DISH promise — it already carries an implicit "similar" qualifier a user would read on the same screen. See Section 17.

---

## 3. Audit Methodology

All 84 restaurant menu items were checked against all 208 recipes using production data only: recipe name (EN/TH), full ingredient list, category, tags, cuisine, nutrition; restaurant menu item name, category, tags, serving note, meal context, nutrition. No web research was used or needed (Section 20 confirms this explicitly — see rule T in the brief).

Classification model applied per pair, per the brief's own standard:
- **SAME_DISH** — same core dish identity; garnish/side/portion/presentation differences tolerated.
- **SIMILAR_DISH** — not the same dish, but close enough on protein + preparation + cuisine/flavor + format that "make/buy something similar" would be genuinely useful in **both** directions.
- **NO_RELATION** — surface overlap only (shared protein, shared cuisine, shared format) without matching identity.
- **MISSING_RECIPE** — a restaurant dish with no defensible SAME_DISH or SIMILAR_DISH destination in the current 208.

Every restaurant menu item was individually checked; this was not limited to re-inspecting the current 12 relations.

---

## 4. Existing Relation Re-Audit

All 12 production relations were re-classified independently against the model above.

| Recipe | Restaurant item | Classification | Note |
|---|---|---|---|
| `chicken-oyakodon` | `ootoya-oyakodon` | SAME_DISH | Exact: chicken, egg, onion, dashi-soy, rice bowl |
| `chicken-teriyaki-rice-bowl` | `fuji-chicken-teriyaki` | SAME_DISH | Matches the brief's own worked example (teriyaki chicken vs. teriyaki chicken rice bowl) |
| `garlic-pepper-pork-fried-egg-rice` | `seven-eleven-garlic-pork-egg-rice` | SAME_DISH | Exact |
| `glass-noodle-seafood-salad` | `steak-and-more-yum-woon-sen` | SAME_DISH | Yum Woon Sen literally means glass noodle salad |
| `grilled-chicken-caesar-salad` | `jones-caesar-chicken-salad` | SAME_DISH | Both explicitly "Caesar chicken salad" |
| `grilled-mackerel-bowl` | `ootoya-grilled-mackerel` | SAME_DISH | Matches the brief's own worked example |
| `japanese-beef-gyudon` | `sukiya-gyudon-regular` | SAME_DISH | Exact |
| `japanese-shioyaki-salmon-sweet-potato` | `fuji-salmon-shioyaki` | SAME_DISH | Matches the brief's own worked example |
| `japanese-vegetable-curry-rice` | `sukiya-curry-rice-regular` | SAME_DISH | Both vegetarian curry rice |
| `thai-papaya-salad` | `nittaya-som-tam-thai` | SAME_DISH | Classic som tam |
| `thai-papaya-salad` | `somtam-nua-papaya-salad-thai` | SAME_DISH | Classic som tam |
| `thai-papaya-salad` | `steak-and-more-som-tam` | SAME_DISH | Classic som tam |

**Finding: all 12 current relations are SAME_DISH-caliber. None are weak; none are flagged.** The graph as it exists is genuinely conservative in the way Section B describes — it hasn't just avoided noise, it has specifically avoided shipping anything below SAME_DISH strength, even though the schema's only literal value is named `'similar-dish'`.

**Slice 31 selective exclusions re-verified as still correct:**
- Som Tam: `nittaya-som-tam-salted-egg`, `zaab-eli-som-tam-salted-egg`, `zaab-eli-corn-salted-egg-som-tam` (salted egg / corn additions), `somtam-nua-papaya-salad-fermented-crab` (pla ra/fermented crab), `somtam-nua-tam-muah` (mixed noodles + crispy pork rind) — all correctly left unrelated to `thai-papaya-salad`. Each adds a defining component the recipe doesn't have.
- Gyudon: `sukiya-gyudon-okra-regular` (bonito flakes + okra topping) correctly left unrelated to `japanese-beef-gyudon`. This one is a genuinely defensible judgment call either way — the topping addition is arguably closer to a garnish than a new dish — but Slice 31's conservative choice not to claim it is reasonable and this audit does not recommend changing it.
- Curry rice relation is truthful specifically because Slice 31 authored `japanese-vegetable-curry-rice` as vegetarian to match `sukiya-curry-rice-regular`, which is explicitly meat-free. Confirmed still the case.

---

## 5. Current Coverage (Scenario A — production today)

- **Restaurant-side**: 12 of 84 menu items have ≥1 relation = **14.3%** covered; 72 have none.
- **Recipe-side**: 10 of 208 recipes have ≥1 relation = **4.8%** covered; 198 have none.
- **Total edges**: 12.
- **Relations per covered restaurant item**: 1.0 (no menu item has more than one relation today).
- **Relations per covered recipe**: 1.2 (`thai-papaya-salad` has 3; the other 9 recipes have 1 each).

---

## 6. New HIGH-Confidence SAME_DISH Candidates

7 new pairs, all bidirectionally sound ("make something similar" and "buy something similar" both feel reasonable).

| Restaurant | Menu item | Recipe | Evidence | Differences | Confidence |
|---|---|---|---|---|---|
| Salad Factory | `salad-factory-spicy-pork-tenderloin` — Spicy Pork Tenderloin Salad | `spicy-grilled-pork-salad` — Spicy Grilled Pork Salad | Same protein cut (pork tenderloin), same technique (grilled, sliced, tossed), same dressing family (lime, fish sauce, toasted rice powder, dried chilli — classic Thai larb/yam style), near-identical name | None material | HIGH |
| 7-Eleven | `seven-eleven-chicken-sukiyaki` — Ezy Choice Chicken Sukiyaki Rice | `chicken-vegetable-sukiyaki` — Chicken and Vegetable Sukiyaki | Both explicitly "sukiyaki," chicken, glass noodles, cabbage, mushroom, sukiyaki-style sauce | Rice-in-a-tray (packaged) vs. plated — presentation only | HIGH |
| 7-Eleven | `seven-eleven-green-curry-chicken` — Chef Cares Green Curry with Chicken Breast and Jasmine Rice | `chicken-green-curry-brown-rice` — Chicken Green Curry with Brown Rice | Green curry paste, coconut milk, chicken, rice — core identity matches | Jasmine vs. brown rice, packaged vs. plated | HIGH |
| Santa Fe' Steak | `santa-fe-chicken-steak-jaew` — Chicken Steak (2 Pieces), Jaew Sauce | `grilled-chicken-jaew` — Grilled Chicken with Jaew Sauce | Jaew sauce named explicitly on both sides; toasted rice powder, fish sauce, dried chilli, lime match the recipe's jaew | None material | HIGH |
| Nittaya Kai Yang | `nittaya-grilled-chicken-quarter` — Original Recipe Grilled Chicken | `herb-grilled-chicken` — Herb Grilled Chicken & Vegetables | Recipe's marinade (garlic, coriander root, fish sauce, pepper) is textbook Isan kai-yang marinade | Recipe adds broccoli/carrot/brown rice sides not part of kai yang tradition — tolerated as a side difference | HIGH |
| Zaab Eli | `zaab-eli-grilled-chicken` — Zaab Eli Grilled Chicken | `herb-grilled-chicken` — Herb Grilled Chicken & Vegetables | Same kai-yang identity as above, different restaurant | Same | HIGH |
| Fuji | `fuji-salmon-shioyaki-brown-rice-set` — Salmon Shioyaki with Brown Rice Set | `japanese-shioyaki-salmon-sweet-potato` — Japanese Shioyaki Salmon with Sweet Potato | Same dish already related to this recipe via `fuji-salmon-shioyaki` (à la carte); this is the same restaurant's rice-set variant of the identical dish | Rice-set vs. à la carte, sweet potato vs. rice — side-only | HIGH |

The Fuji case is a legitimate one-recipe-to-two-menu-items pattern **at the same restaurant** (like Som Tam's one-to-three-restaurants pattern), not noise: both Fuji items are genuinely the same base dish sold two ways.

---

## 7. New HIGH-Confidence SIMILAR_DISH Candidates

4 new pairs. All checked in both directions per Section H's test ("if I clicked make/buy something similar, would this feel reasonable?").

| Restaurant | Menu item | Recipe | Evidence | Differences | Confidence |
|---|---|---|---|---|---|
| Salad Factory | `salad-factory-salmon-sashimi-shoyu` — Salmon Sashimi Salad, Shoyu-Wasabi Dressing | `salmon-poke-bowl` — Salmon Poke Bowl | Raw sushi-grade salmon, soy-based dressing, no-cook, Japanese-adjacent | Salad plating vs. composed rice bowl (rice, edamame, avocado added) — enough of a format shift to keep this SIMILAR rather than SAME | HIGH |
| Santa Fe' Steak | `santa-fe-dory-fish-steak` — Dory Fish Steak | `baked-cod-lemon-herbs` — Mediterranean Baked Cod with Lemon Herbs | Both: mild white fish fillet, olive-oil/herb/lemon treatment, Western-style plated fish steak with vegetable side | Different fish species (dory vs. cod); recipe is baked, item is grilled | HIGH |
| Nittaya Kai Yang | `nittaya-larb-moo` — Pork Larb | `chicken-larb-brown-rice` — Chicken Larb with Brown Rice | Identical larb technique and dressing (mint, shallot, lime, toasted rice powder, fish sauce, dried chilli) — only the meat differs | Chicken vs. pork mince — a real but singular difference against an otherwise near-total match | HIGH |
| Zaab Eli | `zaab-eli-larb-moo` — Pork Larb | `chicken-larb-brown-rice` — Chicken Larb with Brown Rice | Same as above, different restaurant | Same | HIGH |

---

## 8. Medium / Ambiguous Candidates (not production-ready)

Recorded for completeness; none recommended for this slice. Reported, not proposed.

| Restaurant item | Recipe | Why it's ambiguous |
|---|---|---|
| `ootoya-grilled-salmon-rice-bowl` | `salmon-teriyaki-bowl` | Menu item doesn't name a sauce; recipe is specifically teriyaki-sauced. Could be a defining flavor mismatch or could be nothing — restaurant description is too generic to confirm. |
| `santa-fe-salmon-steak` | `japanese-shioyaki-salmon-sweet-potato` | Cross-cuisine framing (Western steakhouse, user-configurable sauce, vs. a specifically Japanese salt-grill preparation). The base "grilled salmon fillet + vegetable" overlaps, but the configurable sauce means the actual served dish could diverge either way. |
| `fuji-chirashi-sushi-don-set` | `salmon-poke-bowl` | Both are "raw fish over rice," but chirashi is plated sliced sashimi over vinegared sushi rice; poke is tossed/marinated Hawaiian-style. Different enough in presentation and technique to withhold. |
| `santa-fe-seabass-steak` | `steamed-lime-seabass` | Same fish species, but grilled (restaurant) vs. steamed (recipe) is a real technique difference, not just a side difference. |
| `nittaya-tom-saep-grilled-chicken-soup` | `chicken-tom-yum-mushrooms` | Tom saep and tom yum share an herb base (lemongrass, galangal, lime leaf, chilli) but tom saep traditionally uses grilled/charred meat; the recipe simmers raw sliced chicken. Related soup styles, not confirmed the same. |
| `ootoya-shima-hokke-grilled` | `grilled-mackerel-bowl` | Different fish species (Atka mackerel vs. mackerel) that the restaurant itself treats as a distinct menu line from its own mackerel dish. |
| `steak-and-more-caesar-salad` | `grilled-chicken-caesar-salad` | Restaurant item is a plain/vegetarian Caesar; the recipe is built around added chicken as a defining protein component. |
| `thongsmith-spicy-shredded-chicken-dry` | `chicken-larb-brown-rice` / `grilled-chicken-jaew` | Too little menu detail to confirm whether "dry shredded chicken" matches either dish's specific technique. |

---

## 9. Directional-Only Candidates

None of the HIGH-confidence candidates above required directional-only treatment — all 11 new relations (7 SAME_DISH + 4 SIMILAR_DISH) work sensibly in both "make something like this" and "buy something like this" directions.

One soft case worth naming: `santa-fe-salmon-steak` → `japanese-shioyaki-salmon-sweet-potato` (Section 8, Medium). The forward direction (seeing the restaurant item, wanting to make something like it) reads fine. The reverse direction is softer — a user looking at the shioyaki salmon recipe, told to "buy something similar," might land on a configurable Western steakhouse item whose actual sauce is unknown and could diverge from a Japanese salt-grill. This is exactly why it stays Medium rather than HIGH; it isn't proposed, so no directional-model decision is forced by it. No other candidate showed this asymmetry clearly enough to record separately.

**Conclusion for Section Q/decision question 9: the evidence does not justify directional relation semantics in this slice.** Zero production-ready candidates needed it.

---

## 10. NO_RELATION Findings (representative, not exhaustive — all 84 items were checked)

Confirms the conservative bar is doing its job — surface overlap alone was rejected repeatedly:

- `ootoya-grilled-moromi-chicken` vs. any grilled-chicken recipe — moromi (fermented soybean glaze) is a distinct sauce identity not replicated by teriyaki, jaew, or herb marinades.
- `mk-*` (all 7 items) vs. anything — hot-pot/shared-cooking format has no analogue among 208 individually-plated recipes. This is a **structural** format gap, not a curation gap.
- `sukiya-beef-plate-no-rice`, `sukiya-salad` — the former is another hot-pot raw component; the latter (28 kcal, no dressing specified) is too thin an identity to match against anything.
- `steak-and-more-squid-ink-spaghetti-shrimp` vs. `shrimp-tomato-pasta` — squid ink is a defining, unmistakable flavor/visual identity absent from the tomato-based recipe. Protein (shrimp) and format (spaghetti) overlap; the sauce doesn't.
- `thongsmith-wagyu-ribeye-boat-noodle` vs. `thai-beef-nam-tok` — genuine "near miss": both share nam-tok flavor DNA (herbs, lime, toasted rice powder), but boat noodle is a noodle soup and nam tok is a salad. Format difference is material enough to withhold, per the brief's own "one is soup and one is stir-fry" standard.
- `somtam-nua-larb-moo` (Pork Larb **with Liver**) vs. `chicken-larb-brown-rice` — correctly withheld even though the base larb technique matches `nittaya-larb-moo`/`zaab-eli-larb-moo`. The added liver is a defining organ-meat component the recipe doesn't have — same selectivity logic Slice 31 already applied to Som Tam variants.
- `zaab-eli-fried-chicken`, `somtam-nua-fried-chicken` — deep-fried whole chicken pieces have no analogue; every chicken recipe in the catalog is grilled, stir-fried, or simmered. Also arguably off-brand for a "healthy" positioning (see Section 18).

---

## 11. MISSING_RECIPE Findings

Recorded by priority tier. None are recommended for implementation in this slice — this is scouting only.

**STRONG FUTURE RECIPE OPPORTUNITY** (recurs across restaurants and/or clearly useful, healthy, Pantry-compatible, independently authorable):

| Concept | Evidence it recurs | Notes |
|---|---|---|
| Grilled pork chop (thick cut, tangy glaze) | Ootoya tonteki, Santa Fe kurobuta chop, Steak & More pork chop — **3 restaurants** | No recipe uses a whole chop; all pork recipes are thin strips or mince. Real gap, good Pantry fit (soy/garlic/black pepper components already exist). |
| Grilled pork neck/collar (kor moo yang) | Nittaya, Zaab Eli — **2 Isan restaurants** | Well-known standalone Isan dish, distinct from kai yang and larb. Good Pantry fit. |
| Thai boat noodle (dark rich beef/pork broth) | ThongSmith — **2 items** (wagyu ribeye, kurobuta pork) | Popular, well-loved dish with zero analogue; `thai-beef-nam-tok` is a near-miss but wrong format (salad vs. soup). |
| Pork bulgogi rice bowl | 7-Eleven `seven-eleven-pork-bulgogi-rice` | Reinforces a gap Slice 31 already found when it dropped Korean Bulgogi from Batch 1 (beef bulgogi marinade duplicate risk with `korean-beef-glass-noodles`) — a **pork**-based, rice-bowl-format version would sidestep that duplicate risk entirely and is a clean, distinct opportunity. |
| Grilled chicken salad, sesame dressing | Salad Factory, Jones' Salad — **2 restaurants** | No sesame-dressed chicken salad exists; catalog has sesame-dressed tofu/soba dishes but not this specific salad format. |

**CONSIDER** (plausible, but single-restaurant, more niche, or moderate authoring friction):

- Grilled chicken with pepper sauce (Santa Fe) — generic Western steak-style chicken.
- Quinoa + chicken + Thai basil (Salad Factory) — interesting fusion, single occurrence.
- Rocket/arugula + grilled beef + balsamic salad (Salad Factory) — decent Pantry fit, extends the existing Mediterranean-salad family.
- Grilled salmon salad, no carb (Jones') — plain green salad format not currently represented.
- Salmon tataki (Fuji) — searing rare fish at home is a reasonable ask but a step up in technique.
- Honey-lemon basa/white-fish steak (Jones') — generic enough to be low-differentiation.
- Chiang Mai-style fried pork (Nittaya) — regional specialty, single occurrence.
- Grilled pork meatballs with dip (ThongSmith) — decent Pantry fit, single occurrence.
- Dry rice with braised pork (ThongSmith) — single occurrence.
- Crispy fried fish larb (Somtam Nua) — single occurrence, distinct fried technique.
- Isan sour pork-bone soup / tom saep family — recurs 3× (Nittaya, Zaab Eli, Somtam Nua) as a *flavor profile*, but each instance uses a different cut (bone, tendon, grilled chicken) that would need its own recipe; bone/tendon cuts also cut against "quick healthy home cooking." One single tom-saep-style recipe (e.g., with a leaner cut) could plausibly become a SIMILAR_DISH umbrella for all three — worth a future look, not urgent.
- A simple plain miso soup (Sukiya) — trivial to author, but arguably too thin (4 ingredients) to be a differentiated "recipe" product in its own right.
- "Make your own suki at home" hot-pot recipe — could become a SIMILAR_DISH umbrella for several MK/Sukiya hot-pot items at once, but it's a different recipe *format* (shared pot, raw components) than anything currently in the catalog and would need product buy-in before being treated as a normal recipe.

**NOT WORTH ADDING**:

- Kale salad with truffle dressing (Salad Factory) — truffle is a poor Pantry/home-cooking fit for this catalog's positioning.
- Black squid-ink spaghetti with shrimp (Steak & More) — niche, premium ingredient, poor Pantry fit.
- Deep-fried whole chicken (Zaab Eli, Somtam Nua) — conflicts with the catalog's healthy-cooking positioning; every existing chicken recipe is grilled, stir-fried, or simmered by design.
- Plain sticky rice (Somtam Nua) — a side dish, not a standalone recipe.
- Plain unseasoned side salad (Sukiya) — too thin an identity to be a recipe.
- Beef shank & tendon soup (Zaab Eli) — slow-braise specialty, poor fit for "quick" positioning.
- Squid-ink/truffle/tendon-class items generally — recurring pattern: a handful of restaurant items lean into premium/specialty ingredients that sit outside this catalog's accessible, everyday-Pantry-ingredient model. Not a gap worth closing.

---

## 12. Restaurant-by-Restaurant Coverage

| Restaurant | Items | Currently related | +New SAME_DISH | +New SIMILAR_DISH | Remaining MISSING_RECIPE | Appropriately NO_RELATION |
|---|---|---|---|---|---|---|
| Ootoya | 6 | 2 | 0 | 0 | 3 (hokke, moromi chicken, tonteki chop) | 1 (salmon rice bowl — Medium, not pursued) |
| Salad Factory | 6 | 0 | 1 | 1 | 4 | 0 |
| 7-Eleven Thailand | 6 | 1 | 2 | 0 | 3 | 0 |
| Jones' Salad | 7 | 1 | 0 | 0 | 4 (+1 dup of Salad Factory's sesame-chicken gap) | 2 (larb-crispy-rice — Medium; mushroom soup — not worth adding) |
| Fuji Japanese Restaurant | 6 | 2 | 1 | 0 | 1 (tataki) | 2 (chirashi — Medium; kinoko salad — not worth adding) |
| MK Restaurants | 7 | 0 | 0 | 0 | 0 (cluster-level "consider," not per-item) | 7 |
| Sukiya | 6 | 2 | 0 | 0 | 1 (miso soup, low priority) | 3 (okra gyudon variant — correctly excluded; beef plate; plain salad) |
| Santa Fe' Steak | 7 | 0 | 1 | 1 | 3 | 2 (salmon steak, seabass steak — Medium) |
| Nittaya Kai Yang | 7 | 1 | 1 | 1 | 2 (pork neck, fried pork) | 2 (salted-egg som tam — correctly excluded; tom saep — Medium) |
| Zaab Eli | 7 | 0 | 1 | 1 | 1 (pork neck, dup of Nittaya's) | 4 (fried chicken, tendon soup — not worth; 2 salted-egg som tam variants — correctly excluded) |
| Somtam Nua | 8 | 1 | 0 | 0 | 2 (fried fish larb, pork-bone soup) | 4 (fermented-crab som tam, tam muah, pork-liver larb — correctly excluded; fried chicken — not worth; sticky rice — not worth) |
| ThongSmith | 5 | 0 | 0 | 0 | 4 (boat noodle ×2, braised pork rice, meatballs) | 1 (shredded chicken — Medium) |
| The Steak & More | 6 | 2 | 0 | 0 | 2 | 2 (squid-ink pasta — not worth; Caesar salad — Medium) |
| **Total** | **84** | **12** | **7** | **4** | **30** | **31** |

**Restaurants effectively absent from the bridge even after this audit's additions**: MK Restaurants (0 of 7, structural hot-pot format gap) and ThongSmith (0 of 5, boat-noodle format gap — the one format genuinely worth a future recipe). Sukiya and Jones' Salad remain thin (2/6 and 1/7) mostly because of format mismatches (hot-pot components) and premium/niche ingredients (truffle, Caribbean spice) rather than curation gaps.

---

## 13. Recipe-Family Coverage

**Families with real Buy-side potential** (confirmed by this audit, not assumed):
- Thai classic dishes tied to specific sauces/techniques (som tam, kai yang, jaew, larb, sukiyaki, curry rice, gyudon, garlic pepper pork) — these map cleanly onto Thai/Japanese-Thai restaurant menus because the restaurants in this catalog serve exactly these dish categories.
- Japanese donburi and grilled-fish formats (oyakodon, gyudon, shioyaki salmon, teriyaki chicken, mackerel bowl) — same reasoning, driven by Ootoya, Fuji, Sukiya.
- Western-style salads (Caesar, rocket, glass-noodle-adjacent) — driven by Jones' Salad, Salad Factory, Steak & More.

**Families that should stay sparse — not because of missed curation, but because no restaurant serves this food**: roughly half the catalog — the Mediterranean, Italian, Mexican/Latin, Indian, Moroccan, Turkish, French, and West African recipes (`mediterranean-*`, `italian-*`, `mexican-*`, `greek-*`, `spanish-*`, `turkish-*`, `moroccan-*`, `french-*`, `latin-*`, `indian-*`, `west-african-*` — roughly 45–50 recipes) — have **no corresponding restaurant category at all** among the current 13 restaurants, which are exclusively Thai, Japanese, Korean-Thai-fusion, or Western-salad-chain in character. This is a structural ceiling on recipe-side coverage that no amount of relation curation can close; it would require either new restaurants in a completely different category or accepting that this half of the catalog is Cook-only content by design.

---

## 14. Scenario A / B / C Coverage Metrics

| Scenario | Relations | Restaurant-side coverage | Recipe-side coverage |
|---|---|---|---|
| **A** — current production only | 12 | 12/84 = **14.3%** | 10/208 = **4.8%** |
| **B** — A + new HIGH SAME_DISH (7) | 19 | 19/84 = **22.6%** | 15/208 = **7.2%** |
| **C** — B + new HIGH SIMILAR_DISH (4) | 23 | 23/84 = **27.4%** | 18/208 = **8.7%** |

No target count was chased; 23 is simply what survived the evidence gate (Section 19, "S. No Target Count").

---

## 15. Many-to-Many / Noise Risks

- **`chicken-larb-brown-rice`** would gain 2 restaurant relations (Nittaya, Zaab Eli larb moo) under Scenario C — legitimate, not noisy: larb is a near-universal Isan-restaurant staple and both are the same classic dish concept, exactly like Som Tam's existing 3-restaurant pattern. Recommend allowing this the same way Som Tam was allowed.
- **`herb-grilled-chicken`** would gain 2 restaurant relations (Nittaya, Zaab Eli kai yang) under Scenario B — same reasoning, same pattern, legitimate.
- **`japanese-shioyaki-salmon-sweet-potato`** would gain a 2nd relation at the *same* restaurant (Fuji's à la carte item plus its rice-set item) — legitimate, since both are genuinely the same dish sold two ways by one restaurant, not cross-restaurant inflation.
- **Risk pattern identified but avoided**: it would have been easy to over-claim "grilled chicken" as a single umbrella connecting `herb-grilled-chicken` to every grilled-chicken item in the catalog (Ootoya moromi chicken, Santa Fe pepper-sauce chicken, Steak & More chicken steak, etc.) purely because "both are grilled chicken." This audit explicitly rejected that — only the 2 kai-yang-marinade matches survived, because sauce/marinade identity is what actually defines those dishes, not the shared cooking method. This is the exact "both contain chicken" trap the brief warns against in Section H, and it was checked for deliberately.
- No cluster in this audit resembles "one generic recipe mapped to every menu item sharing a protein" — every proposed pair required matching on sauce/technique/format, not just protein or cuisine.

---

## 16. Relation Model Options

Evaluated against actual evidence from this audit, not preference:

**Option 1 — Keep the current single relation semantic.**
Cost: none (no schema change). Benefit: simplicity. Given that all 23 candidate relations (12 current + 11 new) are HIGH-confidence and the existing `'similar-dish'` literal is generic enough to cover both SAME_DISH and SIMILAR_DISH strength without lying (see Section 17 — the subtitle copy already says "similar"), this option is fully sufficient for what this audit found. **No evidence in this slice forces a schema change.**

**Option 2 — Support same-dish + similar-dish as distinct kinds.**
Cost: schema change (`RelationKind` union), migration of 12 existing rows to an explicit kind, validation update, and — to be worth doing — a UI copy/label change so users can tell the two apart (otherwise the distinction only exists in data, not experience). Benefit: more precise semantics, useful if SIMILAR_DISH volume grows substantially later. At today's scale (7 new SAME_DISH, 4 new SIMILAR_DISH), the benefit is marginal — the ratio is not lopsided enough to make "everything is basically the same kind" feel dishonest. Worth revisiting only if a future slice pushes SIMILAR_DISH volume well past SAME_DISH volume.

**Option 3 — Support directional relation semantics.**
Not supported by evidence. Section 9 found zero HIGH-confidence candidates that needed asymmetric treatment. Building this now would be speculative engineering against a case that hasn't materialized.

**Option 4 — Don't expand the model; add only missing SAME_DISH edges (+ future recipes).**
This is close to what the evidence supports, with one caveat: this audit also found 4 legitimately HIGH-confidence SIMILAR_DISH pairs that are worth shipping under the *existing* single-kind model (per Option 1's reasoning) rather than being excluded on principle. So the practical recommendation is a blend of Option 1 and Option 4: expand relations using the current schema, do not add new recipes yet (the missing-recipe opportunities in Section 11 don't need to gate relation expansion), and don't touch the model.

**Avoiding over-engineering**: Options 2 and 3 are the ones the brief explicitly warns against defaulting to. Neither is justified by this audit's actual candidate set. Recommend Option 1/4 blend (see Section 19 recommendation).

---

## 17. UI Wording Implications

No copy was changed. Assessment only, per the brief's explicit "do not implement" instruction.

- **Current copy already tolerates SIMILAR_DISH**: both headings ("Rather buy it?" / "Want to make it?") pair with subtitles that already say "similar" ("Similar dishes at restaurants" / "Try a similar recipe," and the Thai equivalents use "ใกล้เคียง" = "close/similar"). A user reading the full card — heading + subtitle together — is not being told "this is exactly the same dish," they're told "here's something similar you might want to buy/make instead." This means **the existing copy is compatible with both SAME_DISH and SIMILAR_DISH strength as currently written**, without any change.
- If Option 2 (Section 16) is ever adopted, the natural refinement would be tightening the heading itself for confirmed SIMILAR_DISH entries (e.g., "Something similar?" instead of "Rather buy it?"), while leaving SAME_DISH entries on the current, more direct heading. That would require a per-relation kind + a UI branch — not needed today.
- Showing SAME and SIMILAR candidates together in one list (as the current recipe-detail bridge already does for `thai-papaya-salad`'s 3 relations) does not currently confuse anything, because the subtitle's "similar" framing already covers the whole list uniformly. A future kind-split would only need a light per-card label, not a structural redesign, if it's ever pursued.

---

## 18. Future Recipe Opportunities

See Section 11 for the full tiered list. Restated briefly, satisfying the brief's existing content standards (useful, healthy-fit, differentiated, Pantry-compatible, independently authorable, image-feasible):

- **STRONG**: grilled pork chop, grilled pork neck (kor moo yang), Thai boat noodle, pork bulgogi rice bowl, sesame-dressed grilled chicken salad.
- **CONSIDER**: ~10 single-restaurant or moderate-friction candidates (listed in Section 11).
- **NOT WORTH ADDING**: truffle/squid-ink/tendon-class niche items, deep-fried whole chicken (off-brand for healthy positioning), plain sides (sticky rice, unseasoned salad).

No recipes were created in this slice. This section is explicitly secondary to relation coverage, per the brief.

---

## 19. Recommended Next Slice

**Recommendation: A blend of Option A and Option 1/4 (Section 16/19) — implement the 11 newly discovered HIGH-confidence relations (7 SAME_DISH + 4 SIMILAR_DISH) under the existing single-kind schema, with no model change.**

Rationale:
- All 11 are HIGH-confidence, bidirectionally sound, and free of the "shared protein/cuisine only" trap.
- The existing schema and UI copy already accommodate them truthfully (Section 17) — no engineering beyond adding rows to `recipeRestaurantRelations` and updating relation-count tests, following exactly the pattern Slice 31 already established.
- SIMILAR_DISH volume (4) isn't yet large enough to justify Option 2's schema/copy work; revisit if a future audit finds substantially more SIMILAR_DISH candidates.
- Missing-recipe opportunities (Section 11) are real but secondary — recommend treating "grilled pork chop" and "Thai boat noodle" as strong candidates for a **future** recipe-expansion slice, not bundled into relation work.

This recommendation was not chosen to hit a round number — 23 total relations is simply the evidence-supported count.

---

## 20. Risks / Limitations

- This audit is a human/LLM semantic read of text fields (names, ingredients, tags, serving notes) — it is not a taste test. Confidence levels reflect textual/structural evidence, not verified sensory equivalence.
- Several restaurant menu items (`ootoya-grilled-moromi-chicken`, `thongsmith-spicy-shredded-chicken-dry`) have thin descriptions (no ingredient list, just a name + tags), which caps how confidently they could be classified; both were left at NO_RELATION/Medium rather than guessed into a HIGH bucket.
- No web research was used (per Section T of the brief) — all classifications rest on data already in this repository. If any of the thin-description items above are genuinely ambiguous enough to matter, a future slice could choose to do limited, explicitly-documented web verification for those specific items only.
- The Mediterranean/Italian/Mexican/Indian/etc. half of the recipe catalog is structurally capped at ~0% restaurant-side coverage given the current 13-restaurant roster (Section 13). This is not a defect in this audit; it's a real ceiling worth knowing about before anyone sets recipe-side coverage targets.
- MK Restaurants and Sukiya's hot-pot items represent a genuine format gap (shared-pot cooking) that no amount of relation curation under the current recipe format can close; closing it would require a new recipe *format*, which is out of scope here and flagged only as a "Consider" in Section 11.
- This audit did not re-verify restaurant nutrition/price/image data for correctness — those were assumed unchanged and out of scope, per the brief's non-goals.

---

## Files Changed

Only this file: `docs/relation-coverage-audit-32.md` (new). No production code, data, tests, or UI were touched.

## Tests / Verification

- `npx vitest run --exclude '**/.kilo/**' --exclude '**/node_modules/**'`: **32 test files, 481 tests, all passing** (baseline, run before and unaffected by this audit since nothing changed).
- `validateRecipes(recipes)` → `[]`
- `validateRecipeRestaurantRelations(recipeRestaurantRelations, recipes, restaurantMenuItems)` → `[]`
- `npx tsc --noEmit`, `npm run build`, `git diff --check`: to be run and confirmed clean as part of final verification (Section below / chat report).

## Production Integrity

Confirmed unchanged: recipe data, recipe content, recipe images, recipe manifest, Pantry, restaurant data, restaurant menu items, restaurant menu images, prices, nutrition, meal context, production relations, relation model/schema, UI, search, filters, randomization, Favorites, Shopping List. Only this markdown file is new.
