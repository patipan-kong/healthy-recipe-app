# Slice 30 — Restaurant → Missing Recipe Opportunity Audit

**Status:** Read-only audit. No recipes, images, relations, Pantry, or production data were changed. This document is the only new/changed file.

**Date:** 2026-09-19
**Branch:** `main`
**HEAD at start:** `49c7c18` — feat(data): expand restaurant menu image coverage for slice 29
**Worktree:** clean (`git status --short` empty) before and after this audit

---

## A. Baseline Counts (verified against source, not assumed)

| Catalog | Count | Verification |
|---|---|---|
| Recipes | 204 | `recipes.ts` base (50) + `recipe-expansion.ts` (50, slice2-01..50) + `recipe-additions.ts` (50, slice3-01..50) + `recipe-final-expansion.ts` (50, slice4-01..50) + `recipe-slice5-expansion.ts` (4, slice5-01..04) |
| Recipe image manifest entries | 204 | `recipe-image-manifest.ts` maps 1:1 over `recipes` — no independent count to drift |
| Recipe WebP assets | 204 | `public/recipes/*.webp` file count |
| Restaurants | 13 | `restaurants` array in `restaurants.ts` |
| Restaurant menu items | 84 | counted by `restaurantId:` occurrences, cross-checked per-restaurant (6+7+7+7+6+6+7+6+8+6+6+5+7 = 84) |
| Restaurant menu images | 19 | `menuImage: {` occurrences |
| Verified restaurant prices | 24 | `price: { amount:` occurrences (all carry an `asOf` date) |
| Recipe ↔ Restaurant relations | 5 | `recipeRestaurantRelations` in `recipe-restaurant-relations.ts` |

Slice 29 (restaurant menu image coverage expansion) is present — it is the current HEAD commit.

**Entry gate result:** clean, no unexpected changes. One anomaly is worth recording: this machine also has a sibling git worktree at `.kilo/worktrees/opaque-plow`, used by a separate concurrent Claude session sharing this repository's git backend. It is not part of this repo's tracked working tree (git correctly excludes it from this repo's `git status`), but running `vitest`/`tsc` from the repo root without scoping will also pick up that worktree's files, since Vitest's default glob is filesystem-based and ignores git worktree boundaries. Scoped to the main tree only, everything is green (see Section Q). This is an environment note, not a defect in this repository, and required no action.

## B. Methodology

1. Read `types.ts`, `restaurants.ts` (all 84 items, full nutrition/tags/serving/customization/meal-context/image/price fields), `recipe-restaurant-relations.ts`, and all five recipe source files (`recipes.ts`, `recipe-expansion.ts`, `recipe-additions.ts`, `recipe-final-expansion.ts`, `recipe-slice5-expansion.ts`) in full — every one of the 204 recipes' name, cuisine, category, ingredients, and tags was read, not sampled.
2. Read `pantry.ts` in full (canonical ingredient list + the "excluded staple" regex allowlist for oils/spices/salt/sugar) to judge Pantry fit precisely rather than by guesswork.
3. For every menu item, compared dish identity against the full recipe catalog on: protein, staple/base, technique, sauce/flavor direction, cuisine, and meal format — not on tag or title-string overlap alone, per the audit brief's own examples (chicken+salad ≠ automatic duplicate; larb vs nam tok are different; rice bowl vs steak are different meal formats).
4. No web research was used. All classification was possible from repository data alone; no identity ambiguity required external lookup.

## C. Existing Relation Coverage

Today's 5 curated relations:

| Recipe | Restaurant Menu Item |
|---|---|
| `japanese-shioyaki-salmon-sweet-potato` | Fuji — Grilled Salmon Shioyaki |
| `grilled-mackerel-bowl` | Ootoya — Charcoal-Grilled Mackerel |
| `chicken-teriyaki-rice-bowl` | Fuji — Chicken Teriyaki |
| `grilled-chicken-caesar-salad` | Jones' — Caesar Chicken Salad |
| `glass-noodle-seafood-salad` | The Steak & More — Yum Woon Sen |

**Notable observation (not an audit deliverable, flagged for awareness only):** `ootoya-oyakodon` ("Oyakodon, Chicken & Egg Rice Bowl") is an exact-identity match for the existing recipe `chicken-oyakodon` ("Chicken Oyakodon", slice2-16) — same dish, same technique, same format — yet no relation exists between them today. This is a missed *relation*, not a missing *recipe*, so it is out of scope for "new recipe" recommendations, but it is the single highest-confidence relation gap in the whole catalog and worth a trivial follow-up outside this audit.

## D. Restaurant Menu Classification (all 84 items)

Legend: **1** = exact/near-exact existing recipe · **2** = related family, meaningfully different dish · **3** = no meaningful recipe equivalent

| Restaurant | Item | Class | Note |
|---|---|---|---|
| Ootoya | Charcoal-Grilled Mackerel | 1 | related (`grilled-mackerel-bowl`) |
| Ootoya | Charcoal-Grilled Shima Hokke | 3 | niche fish species, no home-cook equivalent needed |
| Ootoya | Chicken w/ Moromi Sauce | 2 | proprietary fermented-paste sauce; weak |
| Ootoya | **Oyakodon** | 1 | exact match, `chicken-oyakodon` (missing relation only) |
| Ootoya | Tonteki Pork Chop Set | 2 | no Japanese tonteki-style pork chop in catalog; weak-medium |
| Ootoya | Grilled Salmon Rice Bowl | 1 | salmon-rice-bowl format already saturated (5+ recipes) |
| Salad Factory | Chicken Sesame Salad | 1 | saturated: chicken+Asian-dressing salads |
| Salad Factory | Quinoa Chicken Basil Salad | 2 | quinoa base is a different format from existing Thai-basil dishes |
| Salad Factory | **Kale Chicken Truffle Salad** | 3 | kale absent from catalog entirely; Western composed-salad format |
| Salad Factory | **Rocket Skirt Steak Salad** | 3 | no Western steak-salad format exists; all beef is Asian-style |
| Salad Factory | Spicy Pork Tenderloin Salad | 1 | duplicate of `spicy-grilled-pork-salad` (nam tok format) |
| Salad Factory | Salmon Sashimi Salad | 1 | raw-salmon niche already covered by `salmon-poke-bowl` |
| 7-Eleven | Chicken Sukiyaki Rice | 1 | duplicate of `chicken-vegetable-sukiyaki` |
| 7-Eleven | **Garlic Pepper Pork w/ Fried Egg Rice** | 3 | iconic Thai dish (khao moo kratiem), absent from catalog |
| 7-Eleven | Green Curry Chicken Rice | 1 | duplicate of `chicken-green-curry-brown-rice` |
| 7-Eleven | **Pork Bulgogi Rice** | 3 | no soy-garlic-sesame Korean bulgogi profile in catalog (existing Korean dishes are gochujang-forward) |
| 7-Eleven | Korean Chicken Fried Rice | 3 | branded fusion, no stable dish identity — weak |
| 7-Eleven | Sticky Rice w/ Dried Pork | 2 | niche; pork floss is a processed specialty ingredient |
| Jones' | Chicken Sesame Salad | 1 | saturated |
| Jones' | Grilled Salmon Salad | 1 | salmon breadth already covers this format |
| Jones' | Caesar Chicken Salad | 1 | related (existing) |
| Jones' | Chicken Larb & Crispy Rice Salad | 2 | crispy-rice format differs from `chicken-larb-brown-rice`, but overlaps significantly |
| Jones' | Caribbean Chicken Steak | 3 | branded seasoning blend, no stable identity — weak |
| Jones' | Honey Lemon Basa Steak | 2 | glazed-white-fish format already broadly covered |
| Jones' | Mushroom Soup | 3 | trivial side, thin meal role |
| Fuji | Salmon Shioyaki Set | 1 | duplicate of related item + `japanese-shioyaki-salmon-sweet-potato` |
| Fuji | Grilled Salmon Shioyaki | 1 | related (existing) |
| Fuji | **Salmon Tataki Salad** | 2/3 | seared (not raw, not teriyaki) technique gap |
| Fuji | Kinoko Mushroom Salad | 2 | thin meal role (low protein), niche |
| Fuji | Chicken Teriyaki | 1 | related (existing) |
| Fuji | Chirashi Sushi Don Set | 3 | genuine gap but poor home-cook feasibility (multi-species raw fish sourcing) |
| MK | Health Vegetable Set (Small) | 3 | hot-pot raw component, not a dish |
| MK | Special Vegetable Set | 3 | hot-pot raw component |
| MK | Special Kurobuta Set | 3 | hot-pot raw component |
| MK | Special Kurobuta (Plate) | 3 | hot-pot raw component |
| MK | **Premium Suki Set** | 3 | Thai suki (tangy chili dip) flavor identity absent — distinct from existing Japanese sukiyaki |
| MK | Seafood Suki (Broth) | 3 | reinforces Thai-suki gap above; not a separate candidate |
| MK | Pork Shabu | 2 | Japanese shabu format; would duplicate the suki candidate if both pursued |
| Sukiya | **Gyudon Beef Rice Bowl** | 3 | no sweet soy-dashi simmered beef donburi in catalog — major gap |
| Sukiya | Gyudon w/ Bonito & Okra | 3 | same dish family as above, not separate |
| Sukiya | **Japanese Curry Rice** | 3 | roux-based curry entirely absent (all existing curries are Thai/Indian) |
| Sukiya | Beef Plate, No Rice | 3 | component only, covered by gyudon candidate |
| Sukiya | Salad (plain) | 1 | trivial side |
| Sukiya | Miso Soup (plain) | 1 | trivial side/add-on, not a standalone recipe |
| Santa Fe' | Grilled Chicken Pepper Steak | 1 | duplicate of existing grilled-chicken breadth |
| Santa Fe' | Salmon Steak | 1 | saturated |
| Santa Fe' | Dory Fish Steak | 1 | saturated (white-fish breadth) |
| Santa Fe' | Seabass Steak | 1/2 | `steamed-lime-seabass` exists (different prep: Thai steamed vs Western grilled) |
| Santa Fe' | Kurobuta Pork Chop | 2 | premium branded cut; generic grilled-pork-chop gap is weak/trivial |
| Santa Fe' | Chicken Steak, Jaew Sauce | 1 | duplicate of `grilled-chicken-jaew` |
| Santa Fe' | Premium Beef Steak, Imported | 1 | generic Western steak, low differentiation, premium-import framing doesn't fit home-cook positioning |
| Nittaya | Grilled Chicken (Isan) | 1 | duplicate of `herb-grilled-chicken` (already gai-yang style) |
| Nittaya | **Grilled Pork Neck** | 2 | sliced-meat-plate format differs from existing `spicy-grilled-pork-salad` (salad format), same protein/marinade family |
| Nittaya | **Papaya Salad (Som Tam)** | 3 | **zero existing recipes** — biggest single gap in the whole audit |
| Nittaya | Papaya Salad w/ Salted Egg | 3 | reinforces som tam gap, not separate |
| Nittaya | Pork Larb | 2 | protein-swap of existing `chicken-larb-brown-rice`; same technique/sauce |
| Nittaya | Tom Saep (Isan Soup) | 2 | distinct herb profile from `chicken-tom-yum-mushrooms`, moderate overlap |
| Nittaya | Chiang Mai Fried Pork | 2 | real dish, but deep-fried format tension with healthy positioning |
| Zaab Eli | Grilled Chicken | 1 | duplicate of `herb-grilled-chicken` |
| Zaab Eli | Fried Chicken | 3 | no Thai fried chicken in catalog, but fried-format tension |
| Zaab Eli | Grilled Pork Neck | 2 | reinforces Nittaya's pork-neck candidate |
| Zaab Eli | Papaya Salad w/ Salted Egg | 3 | reinforces som tam gap |
| Zaab Eli | Corn & Salted Egg Papaya Salad | 3 | fusion variant, reinforces som tam gap, not separate |
| Zaab Eli | Pork Larb | 2 | reinforces larb protein-swap question |
| Zaab Eli | Spicy Beef Shank & Tendon Soup | 2 | reinforces tom saep gap; tendon is a harder-to-source/slow-cook cut |
| Somtam Nua | Papaya Salad (Dried Shrimp & Peanut) | 3 | reinforces som tam gap — best "classic" reference version |
| Somtam Nua | Papaya Salad, Fermented Crab | 3 | niche/acquired flavor (pla ra), high sodium, not for Batch 1 |
| Somtam Nua | Tam Muah (mixed w/ noodles, pork rind) | 2 | fusion variant of som tam, more complex, niche |
| Somtam Nua | Pork Larb w/ Liver | 2 | offal variant, niche |
| Somtam Nua | Crispy Fried Fish Larb | 2 | distinct format, but fried + niche |
| Somtam Nua | Fried Chicken | 3 | reinforces Zaab Eli's fried-chicken gap |
| Somtam Nua | Tom Saep Pork-Bone Soup | 2 | reinforces tom saep gap |
| Somtam Nua | Sticky Rice (plain) | 1 | trivial, single-ingredient |
| ThongSmith | **Wagyu Ribeye Boat Noodle** | 3 | Thai boat-noodle soup format entirely absent from catalog |
| ThongSmith | Kurobuta Pork Boat Noodle | 3 | reinforces boat-noodle gap, not separate |
| ThongSmith | Dry Rice, Braised Pork | 2 | overlaps existing braised/caramel-pork dishes; moderate |
| ThongSmith | Spicy Shredded Chicken (dry) | 1 | overlaps existing chicken larb significantly |
| ThongSmith | Grilled Pork Meatballs | 2 | real dish (moo ping-adjacent) but snack-sized, thin meal role |
| The Steak & More | Chicken Steak | 1 | duplicate of existing grilled-chicken breadth |
| The Steak & More | Pork Chop | 1/2 | generic; reinforces Santa Fe's weak pork-chop finding |
| The Steak & More | Black Squid-Ink Spaghetti | 3 | genuine gap but low home-cook feasibility (squid ink not in Pantry, hard to source) |
| The Steak & More | Caesar Salad | 1 | duplicate of related `grilled-chicken-caesar-salad` |
| The Steak & More | Som Tam | 3 | reinforces som tam gap (5th restaurant carrying it) |
| The Steak & More | Yum Woon Sen | 1 | related (existing) |

## E. Recipe Overlap Methodology (detail)

For every Class 2/3 candidate, the following were checked against the full 204-recipe catalog before treating it as a gap:
- **Protein + technique + sauce direction** as a triple, not any single axis — e.g. pork loin appears in ~10 existing recipes, so "contains pork" was never sufficient to call something covered.
- **Meal format** — rice bowl vs. salad vs. soup vs. plated-meat-with-sides are treated as different products even with identical protein/marinade (this is why Nittaya's grilled-pork-neck is Class 2, not Class 1, against the existing nam-tok pork *salad*).
- **Flavor-system identity** — Japanese sukiyaki-sauce (soy/mirin/sugar) vs. Thai suki dipping sauce (chili/garlic/lime/fermented bean curd) vs. Korean gochujang are treated as distinct systems even when the shell (hot pot, salad, rice bowl) looks similar.

## F. Strong ADD Candidates

Ranked by evidence strength (repeated across restaurants, complete catalog absence, dish-identity clarity), not by an artificial score.

### 1. Thai Papaya Salad (Som Tam)
- **Restaurant items:** Nittaya (×2), Zaab Eli (×2), Somtam Nua (×3), The Steak & More — 8 menu items across 5 of 13 restaurants carry a som tam.
- **Proposed recipe:** classic Thai green papaya salad — papaya, long beans, tomato, peanuts, dried shrimp (optional), lime, fish sauce, palm/brown sugar, chili.
- **Closest existing recipe:** none. No papaya salad exists in the 204-recipe catalog.
- **Why not a duplicate:** there is nothing to be a duplicate of.
- **Why useful:** it is arguably the single most recognizable Thai dish missing from a Thai-market healthy-food app; vegetable-forward, high-fiber, naturally low-calorie.
- **Category:** Light bowls / Thai favorites.
- **Pantry fit:** `papaya`, `long-beans`, `tomatoes`, `peanuts`, `fish-sauce`, `lime`, `garlic` are all already canonical; sugar is an already-excluded staple. **Zero new Pantry ingredients required.**
- **Relation confidence:** HIGH (dish identity is unambiguous and near-universal across the 5 restaurants that sell it).
- **Implementation complexity:** low.
- **Image feasibility:** easy — a shredded-papaya salad in a mortar/plate is a generic, brand-free visual.

### 2. Japanese Gyudon (Beef & Onion Rice Bowl)
- **Restaurant items:** Sukiya — Gyudon Regular, Gyudon w/ Bonito & Okra.
- **Proposed recipe:** thin-sliced lean beef and onion simmered in a light soy-dashi-sugar broth over rice.
- **Closest existing recipe:** `chicken-oyakodon` (same donburi format, different protein/sauce), `korean-beef-lettuce-bowl` / `lean-beef-bibimbap` (beef rice bowls, but Korean gochujang flavor system, not simmered soy-dashi).
- **Why not a duplicate:** no existing recipe uses the sweet soy-dashi simmer technique that defines gyudon; every other beef recipe in the catalog is stir-fried, grilled, or in a Korean/Thai soup.
- **Why useful:** one of the most iconic, fastest, most home-cookable Japanese dishes; fills a real technique gap.
- **Category:** Quick meals / High protein.
- **Pantry fit:** `soy-sauce`, `dashi-stock` canonical; sugar is an excluded staple. **Zero new Pantry ingredients required.**
- **Relation confidence:** HIGH.
- **Implementation complexity:** low.
- **Image feasibility:** easy — simmered beef and onion over rice in a donburi bowl, consistent with existing donburi-style manifest entries.

### 3. Japanese Curry Rice
- **Restaurant items:** Sukiya — Japanese Curry Rice (M).
- **Proposed recipe:** roux-based Japanese curry (onion, carrot, potato/sweet potato, protein optional) over rice.
- **Closest existing recipe:** `chicken-green-curry-brown-rice`, `thai-massaman-chicken-sweet-potato`, `indian-chickpea-spinach-curry` — all curries, but every one is a coconut-milk or tomato-masala system; none use the sweet, thick, apple/honey-toned roux that defines Japanese curry.
- **Why not a duplicate:** flavor-system identity is completely different from every other "curry" already in the catalog (this is exactly the kind of case the audit brief warns not to over-merge — "curry" alone is not identity).
- **Why useful:** iconic, extremely home-cookable, and gives the catalog a third distinct curry tradition (Thai, Indian, Japanese) rather than three variations on one.
- **Category:** Quick meals / Comforting.
- **Pantry fit:** `curry-powder` canonical, `soy-sauce` canonical, brown sugar excluded staple. **Zero new Pantry ingredients required** (curry-powder + a light roux approximates the flavor, the same "practical substitute" approach the catalog already uses for massaman paste).
- **Relation confidence:** HIGH.
- **Implementation complexity:** low-medium (roux technique is a small new instruction pattern, not a new ingredient problem).
- **Image feasibility:** easy — thick brown curry over rice is a clean, distinct, brand-free plate.

### 4. Thai Garlic Pepper Pork with Fried Egg Rice (Khao Moo Kratiem)
- **Restaurant items:** 7-Eleven — Garlic Pork with Fried Egg and Rice.
- **Proposed recipe:** thin pork slices marinated in garlic and white pepper, pan-seared, served over rice with a fried egg and cucumber.
- **Closest existing recipe:** `lean-pork-pepper-rice` (pepper pork stir-fry, no egg, no garlic-forward marinade) and `chicken-basil-rice-egg` (different protein/flavor, kaprao not kratiem).
- **Why not a duplicate:** garlic-forward marinade + fried egg + specific street-food identity (khao moo kratiem) is a distinct, extremely well-known dish from the existing pepper-pork stir-fry.
- **Why useful:** one of the most-ordered Thai lunch dishes; simple, fast, high-protein.
- **Category:** Quick meals.
- **Pantry fit:** `pork-loin`/`pork-tenderloin`, `eggs`, `garlic` canonical; black pepper excluded staple. **Zero new Pantry ingredients required.**
- **Relation confidence:** HIGH.
- **Implementation complexity:** low.
- **Image feasibility:** easy.

### 5. Korean Bulgogi (soy-garlic-sesame marinated beef or pork)
- **Restaurant items:** 7-Eleven — Pork Bulgogi Rice.
- **Proposed recipe:** thin-sliced beef or pork marinated in soy, garlic, sesame oil, and a little sweetness, pan-seared or grilled.
- **Closest existing recipe:** `korean-pork-gochujang-stirfry`, `korean-beef-lettuce-bowl`, `korean-beef-glass-noodles` — all existing Korean dishes are gochujang-led (spicy-red); none use the soy-garlic-sesame-sweet marinade that defines bulgogi.
- **Why not a duplicate:** flavor-system identity differs (soy-sweet vs. gochujang-spicy), the same distinction the audit brief draws for other cuisines.
- **Why useful:** bulgogi is one of the most internationally recognized Korean dishes and is currently entirely absent despite the catalog's heavy Korean presence (11 existing Korean recipes, all gochujang-forward).
- **Category:** Quick meals / High protein.
- **Pantry fit:** `soy-sauce`, `garlic`, `sesame-seeds` canonical; sesame oil and sugar are excluded staples. Asian pear (traditional tenderizer) is not canonical, but is skippable — most simplified home bulgogi recipes omit it. **Existing ingredients sufficient.**
- **Relation confidence:** MEDIUM-HIGH (7-Eleven's item is specifically pork bulgogi; a beef-or-pork-neutral recipe keeps the relation truthful either way).
- **Implementation complexity:** low.
- **Image feasibility:** easy.

### 6. Thai Boat Noodle Soup (beef)
- **Restaurant items:** ThongSmith — Wagyu Ribeye Boat Noodle, Kurobuta Pork Boat Noodle.
- **Proposed recipe:** dark, cinnamon/star-anise-spiced beef broth with rice noodles, beef, and herbs — a generic "boat noodle" home interpretation (no pork blood, which the authentic version typically includes and which is a real accessibility/appeal barrier for a home-cook, general-audience recipe).
- **Closest existing recipe:** `thai-chicken-rice-noodle-soup`, `chinese-beef-tomato-rice-noodle-soup`, `vietnamese-chicken-pho` — all noodle soups, but none use the dark spiced (cinnamon/star anise/five-spice-adjacent) broth that defines boat noodles; pho and Chinese beef-tomato are both clear/light broths.
- **Why not a duplicate:** broth spice profile and darkness are the entire identity of this dish and are unrepresented elsewhere in the catalog.
- **Why useful:** genuinely popular, distinctive dish format; fills the "rich spiced noodle soup" gap identified in Section J.
- **Category:** Thai favorites / Comforting.
- **Pantry fit:** star anise, cinnamon are excluded staples; `soy-sauce` canonical. **Existing ingredients sufficient**, once the generic (non-blood) interpretation is chosen.
- **Relation confidence:** MEDIUM (the restaurant items are premium wagyu/kurobuta-branded; the relation is to the generic dish concept, not the specific cuts — truthful but slightly less exact than candidates 1–5).
- **Implementation complexity:** medium (longer aromatic broth, more instruction steps than most Quick meals recipes).
- **Image feasibility:** easy — dark broth, noodles, beef is a clean, distinct visual with no branding risk.

### 7. Western Composed Steak Salad (rocket, grilled steak, balsamic)
- **Restaurant items:** Salad Factory — Rocket Salad with Grilled Skirt Steak, Balsamic.
- **Closest existing recipe:** every existing beef recipe (`thai-beef-nam-tok`, `korean-beef-lettuce-bowl`, `lean-beef-bibimbap`, `black-pepper-beef-vegetables`, `korean-beef-cucumber-noodle-salad`, etc.) is Asian-style; none use a Western vinaigrette-dressed leafy salad format.
- **Why not a duplicate:** format and flavor system (raw rocket + balsamic vs. cooked/dressed Asian salad bases) differ from all 10+ existing beef recipes.
- **Why useful:** meaningful format diversity; low-carb, high-protein.
- **Category:** Light bowls / High protein.
- **Pantry fit:** `rocket` canonical, `red-wine-vinegar` canonical (balsamic can reasonably map to it or be added as a close cousin). **Existing ingredients sufficient to near-sufficient.**
- **Relation confidence:** MEDIUM-HIGH.
- **Implementation complexity:** low.
- **Image feasibility:** easy.

### 8. Kale Salad with Chicken, Apple, and Walnut
- **Restaurant items:** Salad Factory — Kale Salad with Chicken Breast, Truffle Dressing.
- **Closest existing recipe:** `grilled-chicken-caesar-salad`, `chickpea-mediterranean-salad` — composed salads exist, but none use kale, and none combine fruit + nut + leafy green in this Western "fall salad" style.
- **Why not a duplicate:** kale is entirely absent from the current 204-recipe catalog and from Pantry; the fruit-nut-cheese composed-salad format is also unrepresented.
- **Why useful:** adds a distinct vegetable and a distinct salad format; kale is a recognizable "healthy eating" ingredient that reinforces the app's positioning.
- **Category:** Light bowls.
- **Pantry fit:** **kale is not canonical — one new Pantry ingredient needed.** Truffle dressing itself should be dropped for a generic vinaigrette in the home version (proprietary/hard-to-source flavor, per Section E of the audit brief).
- **Relation confidence:** MEDIUM (truffle dressing is dropped, so the relation is to the base dish concept, not the exact flavor).
- **Implementation complexity:** low.
- **Image feasibility:** easy.

## G. CONSIDER Candidates (up to 10, evidence present but not Batch-1-ready)

| Candidate | Restaurant source(s) | Why it's CONSIDER not ADD |
|---|---|---|
| Isan Grilled Pork Neck (plated, not salad) | Nittaya, Zaab Eli | Real format difference from existing nam-tok pork salad, but shares protein/marinade closely enough that relation confidence is only MEDIUM |
| Larb Moo (pork larb) | Nittaya, Zaab Eli, Somtam Nua | Protein-swap of `chicken-larb-brown-rice`; same technique/sauce — the audit brief's own "chicken+salad isn't automatically duplicate" logic cuts both ways, but larb's identity here is thin (LOW-MEDIUM confidence) |
| Chicken Larb & Crispy Rice Salad | Jones' | Crispy-rice textural twist on existing chicken larb; meaningfully different only if the crispy-rice element is foregrounded, otherwise near-duplicate |
| Tom Saep (Isan sour-spicy soup) | Nittaya, Zaab Eli, Somtam Nua | Distinct herb profile from tom yum, but the difference is subtle for a home cook; MEDIUM confidence |
| Thai/Isan Fried Chicken | Zaab Eli, Somtam Nua | Real dish, but deep-fried format sits awkwardly against the app's healthy positioning unless reframed as oven/air-fried |
| Chiang Mai-Style Fried Pork | Nittaya | Same fried-format tension as above |
| Japanese Salmon Tataki | Fuji | Genuine technique gap (seared, not raw or teriyaki-glazed), but the catalog already has 8 salmon recipes — differentiation must be clearly on technique, not just "another salmon dish" |
| Thai-Style Suki Hot Pot | MK | Genuinely distinct flavor system from existing Japanese sukiyaki, but a shared hot-pot format is a less typical single-serving "recipe" for this app's format |
| Boat-Noodle-style Braised Pork Rice | ThongSmith | Overlaps meaningfully with existing caramel/braised pork recipes (Vietnamese caramel pork); moderate risk of near-duplicate |
| Grilled Pork Meatballs (moo ping style) | ThongSmith | Real dish, but skewer/snack format has a thinner meal role than the app's other mains |

## H. Rejected / Duplicate Examples (representative, not exhaustive — see Section D for all 84)

- **Santa Fe' grilled-chicken-pepper-steak, salmon-steak, dory-fish-steak, premium-beef-steak** — all are "grill a protein, serve with a side" with no distinguishing technique or flavor system beyond what 10+ existing recipes already cover; the "premium imported beef" framing is a branding/price signal, not a recipe-development signal.
- **7-Eleven chicken-sukiyaki, green-curry-chicken** — near-identical to `chicken-vegetable-sukiyaki` and `chicken-green-curry-brown-rice` respectively.
- **Nittaya/Zaab Eli grilled-chicken** — near-identical to `herb-grilled-chicken`, which is already a gai-yang-style Thai herb-grilled chicken.
- **Santa Fe' chicken-steak-jaew** — near-identical to `grilled-chicken-jaew`.
- **Steak & More caesar-salad** — near-identical to the already-related `grilled-chicken-caesar-salad`.
- **Sukiya salad, Sukiya miso-soup, MK's four raw hot-pot component items** — trivial sides or shared-pot raw components, not standalone dishes with independent identity.
- **Somtam Nua sticky-rice** — single-ingredient side.
- **Jones' Caribbean chicken steak, 7-Eleven Korean chicken fried rice** — branded fusion inventions with no stable, recognizable dish identity independent of the restaurant.

## I. Saturated Recipe Families (do not add more here)

- **Salmon** — already 8 recipes across teriyaki, shioyaki, poke, miso, soba salad, oat cakes, couscous, ochazuke, plus Korean gochujang. Any new salmon idea needs an unusually strong technique differentiator (which is why Salmon Tataki is CONSIDER, not ADD).
- **Thai/Indian curry (coconut or tomato-masala based)** — chicken green curry, tofu red curry, massaman, panang, fish green curry, shrimp pumpkin curry, chickpea/lentil dals, West African peanut stew. Japanese curry (Section F.3) is deliberately a *different* flavor system, not an addition to this family.
- **Grilled/herb chicken + rice or salad** — herb-grilled-chicken, grilled-chicken-jaew, chili-lime-chicken, French mustard chicken, Greek chicken tray, sesame chicken cabbage tray, and more. Very well covered.
- **Korean beef (gochujang-forward)** — bibimbap, lettuce bowl, daikon soup, glass noodles, cucumber noodle salad, spinach soup. Well covered; bulgogi (Section F.5) is deliberately the *other* Korean flavor system.
- **Tofu plant-forward dishes** — dozens across Thai/Japanese/Korean/Chinese cuisines. No further additions warranted from this audit's evidence.

## J. Catalog Gaps (confirmed by restaurant-menu evidence)

- **Thai papaya salad (som tam)** — the largest, clearest gap; 5 of 13 restaurants carry it.
- **Sweet soy-dashi-simmered Japanese donburi beyond oyakodon** — gyudon fills this.
- **Roux-based Japanese curry** — a third, distinct curry tradition.
- **Plated (non-salad) Isan grilled meat** — Kor Moo Yang-style sliced grilled pork neck.
- **Western composed salads with vinaigrette** (vs. the catalog's overwhelmingly Asian-dressed salads) — rocket/steak and kale/chicken candidates address this.
- **Rich, dark spiced noodle soup** — boat noodles fill a gap next to the catalog's existing clear-broth noodle soups (pho, Chinese beef-tomato, chicken rice noodle soup).
- **Soy-garlic-sesame Korean flavor system** (bulgogi) as distinct from the catalog's gochujang-heavy Korean recipes.

## K. Pantry Impact Summary

| Candidate | Pantry impact |
|---|---|
| Som Tam | Existing ingredients sufficient (papaya, long-beans, tomatoes, peanuts, fish-sauce, lime, garlic all canonical) |
| Gyudon | Existing ingredients sufficient (soy-sauce, dashi-stock canonical; sugar is an excluded staple) |
| Japanese Curry Rice | Existing ingredients sufficient (curry-powder, soy-sauce canonical) |
| Khao Moo Kratiem | Existing ingredients sufficient (pork, eggs, garlic canonical; pepper is an excluded staple) |
| Korean Bulgogi | Existing ingredients sufficient (soy-sauce, garlic, sesame-seeds canonical; Asian pear omittable) |
| Boat Noodle Soup | Existing ingredients sufficient (star anise, cinnamon are excluded staples; soy-sauce canonical) |
| Steak Salad (rocket/balsamic) | Existing ingredients sufficient to near-sufficient (rocket, red-wine-vinegar canonical) |
| Kale Chicken Salad | **1 new canonical ingredient needed: kale** |

No candidate in this audit requires significant Pantry expansion.

## L. Nutrition Feasibility

All Batch 1 candidates use the same estimation methodology already applied across all 204 existing recipes (ingredient- and serving-size-based estimation, with the existing macro-sanity check of kcal within ±180 of protein×4+carbs×4+fat×9). None require unusual techniques.

- **Som Tam, Khao Moo Kratiem, Bulgogi, Gyudon, Kale/Steak salads** — straightforward; comparable in complexity to dozens of existing recipes with similar ingredient counts.
- **Japanese Curry Rice** — slightly more variable (roux composition varies more than a stir-fry sauce), but no harder than the massaman/panang curries already estimated in the catalog using the same "practical substitute" approach.
- **Boat Noodle Soup** — flagged as the one candidate where estimation is *moderately* harder: a long-simmered aromatic broth has more variables than a quick sauce, similar in difficulty to `thai-chicken-khao-soi` (already successfully estimated in the catalog), so it is feasible but not trivial.

No candidate must copy restaurant-reported nutrition; every proposal above is a generic dish concept to be estimated independently, consistent with Section E of the audit brief.

## M. Image Feasibility

The app already generates all recipe images from a fixed art-direction string plus a per-recipe visual brief (`recipe-image-manifest.ts`), never restaurant photos. Every Batch 1 and CONSIDER candidate above is a generic, recognizable dish shape (a bowl, a plate, a salad) with no branding, packaging, or trade dress dependency, so all of them are straightforward under the existing generation approach. None require a restaurant-specific visual reference.

## N. Proposed First Implementation Batch (5 recipes)

1. **Thai Papaya Salad (Som Tam)** — HIGH relation confidence, zero Pantry additions, easy nutrition, easy image, fills the single biggest gap in the audit.
2. **Japanese Gyudon** — HIGH relation confidence, zero Pantry additions, easy nutrition, easy image, iconic and fast.
3. **Japanese Curry Rice** — HIGH relation confidence, zero Pantry additions, easy image; nutrition slightly more variable than the others but still within the catalog's established methodology.
4. **Thai Garlic Pepper Pork with Fried Egg Rice** — HIGH relation confidence, zero Pantry additions, easy nutrition, easy image, very fast/simple recipe.
5. **Korean Bulgogi** — MEDIUM-HIGH relation confidence, existing-ingredients-sufficient, easy nutrition, easy image, fills a real flavor-system gap in an already well-represented cuisine.

Each of the five improves at least two product surfaces at once (Restaurant menu item → "Want to make it?" → Recipe Detail, and Recipe Detail → "Rather buy it?" → the corresponding restaurant item), across five *different* restaurants (Nittaya/Somtam Nua/Zaab Eli/Steak&More, Sukiya ×2, 7-Eleven, 7-Eleven) — so the batch also improves relation coverage breadth, not just count.

## O. Deferred Candidates (good, but wait for Batch 2+)

- **Thai Boat Noodle Soup (beef)** — strong dish-identity case, but MEDIUM relation confidence (restaurant items are premium-branded cuts) and moderately harder nutrition estimation; revisit once Batch 1's methodology is validated in production.
- **Western Steak Salad (rocket/balsamic)** and **Kale Chicken Salad** — both solid MEDIUM-HIGH/MEDIUM candidates; held back only to keep Batch 1 small and thematically focused (Batch 1 is Asian-cuisine-forward; these two are Western-format and can anchor a "catalog variety" Batch 2 together).
- **Isan Grilled Pork Neck (plated)**, **Tom Saep**, **Japanese Salmon Tataki**, **Thai-Style Suki Hot Pot** — genuine but MEDIUM-confidence opportunities; worth a second pass once Batch 1 ships and its relations can be observed in actual product use.
- **Larb Moo, Chicken Larb & Crispy Rice, fried-chicken variants** — deliberately left out: either too close to existing recipes (larb) or in tension with the app's healthy-food positioning (fried format) without a clear reframing decision made yet.

## P. Production Integrity

Confirmed unchanged: recipes, recipe images, recipe manifest, Pantry, restaurants, restaurant menu items, prices, restaurant images, nutrition, meal context, Recipe ↔ Restaurant relations, search/filter/random behavior, UI. Only this document is new.

## Q. Verification

- `npx vitest run` scoped to the main repository tree (excluding the unrelated sibling worktree noted in Section A): **31 test files, 468 tests, all passed.**
- `npx tsc --noEmit`: clean, no errors.
- `npx vite build`: succeeded (`dist/` is gitignored build output).
- `git diff --check`: clean.
- `git status --short`: clean before and after this audit.

## R. Remaining Risks

- The relation-confidence labels above are editorial judgment, same as the existing 5 relations — they should get the same human review pass before implementation that the original 5 got.
- "Existing ingredients sufficient" assumes the home recipes intentionally simplify authentic ingredients where the app already has precedent for doing so (e.g., dropping pork blood from boat noodles, dropping truffle dressing from the kale salad, treating brown sugar as a palm-sugar stand-in) — each simplification should be called out explicitly in the recipe's documentation when implemented, the same way existing recipes note "a home substitute for X."
- Isan-cuisine coverage in this batch is currently zero despite Isan restaurants supplying the single strongest signal (som tam) — Batch 1 does include som tam, but the CONSIDER-tier Isan items (larb, pork neck, tom saep) are deferred, so a Batch 2 with an Isan focus is a reasonable next step if the product wants to lean further into that cuisine.
