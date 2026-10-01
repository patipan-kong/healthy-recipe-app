# Slice 41B — FAM TIME and ฟ้าปลาทาน

Phase A research committed and pushed as `674265b191c7a40ab660f1845385c825d2f7b1dd`; Phase B entry HEAD and origin/main both equal that revision, with a clean worktree. Phase B is deliberately uncommitted.

## Identity and configuration decisions

FAM TIME retains its English brand in both locale fields, as the schema has no restaurant-name provenance field. No unverified Thai transliteration or operator is introduced. Official menu https://anyflip.com/tvkpa/qwwp/ p12 names **Spaghetti Spinach & Garlic / สปาเกตตี้ผักโขมกระเทียม**, listing spinach, garlic, chili and cherry tomato. P10 names **Classic Nonna Carbonara With Pancetta / คลาสสิกคาโบนาร่า**, listing egg, pancetta and pecorino. This is not the adjacent cream/bacon/soft-boiled-egg carbonara. Pasta shape for Nonna is not specified in the title: the estimate uses generic cooked fresh pasta, without asserting a shape.

ฟ้าปลาทาน / Fá Plā Tahń follows https://linktr.ee/faplatahn. Official linked menu https://online.anyflip.com/iugnb/gwmj/ p22 identifies **M.01 ข้าวต้มปลากะพง (น้ำ/แห้ง)** / **Boiled rice with seabass fillets (with / without clear soup)**. GoodFood selects only **ข้าวต้มปลากะพง (น้ำ)** / **Boiled rice with seabass fillets — with clear soup**. The parenthetical selection is editorial configuration, not a new official recipe. One bowl includes rice, seabass, clear broth and garnish; no mixed seafood or noodle variants. No cooking method is asserted for the fish.

All three use **Rice & noodles**: existing khao soi and nam ngiao soup bowls and ThongSmith rice dishes use this meal-format umbrella. Soup is more appropriate for standalone soup, rather than a rice-based whole meal. No taxonomy/schema changes.

## Portion-assumption ledger (fixed before calculation)

These are editorial assumptions, never measured restaurant weights. Ingredient composition references are generic USDA SR28 inputs, not restaurant nutrition or an overseas restaurant formula. Fresh cooked pasta is used rather than an asserted dry weight; no dry-to-cooked conversion is claimed.

| Dish | Assumed whole serving and calorie-bearing components |
|---|---|
| F1 | Cooked fresh pasta 250 g; spinach 50 g; garlic 10 g; cherry tomato 50 g; chili 5 g; retained cooking oil 15 g. No separate protein, cheese, egg, butter or cream added. Oil is an estimate of preparation, not an official ingredient amount. |
| F2 | Cooked fresh pasta 250 g; pancetta 40 g before cooking with its rendered fat retained in the dish; whole egg 50 g; pecorino 20 g. Egg/cheese and pasta water form the sauce; no cream, butter or extra oil. Pepper/herb garnish 1 g, nutritionally negligible at whole-gram rounding. Generic uncooked cured bacon is a disclosed pancetta composition proxy; generic Romano is a pecorino proxy. |
| M01 | Cooked white rice 180 g; seabass edible raw-equivalent 150 g (generic mixed-species seabass composition, not a claimed preparation); clear broth 300 ml; fresh herb garnish 10 g; garlic garnish 5 g with retained oil 5 g; dipping sauce allowance 15 g. Broth and sauce formula are unknown: separate editorial budgets of 15 kcal/P2/C1/F0.3 and 20 kcal/P0/C5/F0 respectively; these are not measured condiment data. The sauce allowance is about one tablespoon, with actual consumption variable. |

M01 garnish/oil allowance accounts for the visible calorie-bearing garnish without claiming an official fried-garlic recipe. Fish nutrient input is raw-equivalent to avoid naming an unsupported cooked method or pretending to know cooking yield. Sodium and fiber remain absent in all three records.

## Narrow asset verification

2026-10-01: both URLs re-fetched successfully (HTTP 200, no redirect), decoded and visually inspected. No signature/token/expiry query. FAM TIME PNG 1305×1305 with alpha: https://static.wixstatic.com/media/b1718d_0eb4cca5312c425a91b61de24e802f09~mv2.png, attributable to https://www.famtimebkk.com/. Fish JPEG 2000×2000 opaque teal: https://ugc.production.linktr.ee/56aac372-db7a-42a5-9c39-0af1c5c36ab0_logo.jpeg, attributable to its official Linktree. Both are recognizable at tile size; the fish logo's fine lettering becomes small. Profile asset replacement remains possible; existing initials fallback applies. Logos remain unchanged official-remote assets. Three official menu sheets were re-fetched/visually inspected only in a temporary directory, not bundled or used as menu images.

## Conservative scope

Exactly two brands and three dishes. No prices: branch/date/channel context, 10% service charge and unresolved VAT remain. No menu images, crop assets, generated imagery, recipe relations, ranking/random/search changes or new dependencies. No other restaurant additions. 41A's conditional price recommendation is explicitly narrowed to withholding all prices in 41B, as requested.

## Ingredient inputs and resulting estimates

USDA SR28 reports, retrieved 2026-10-01 (per 100 g, kcal/P/C/F): [grains](https://www.ars.usda.gov/ARSUserFiles/80400535/Data/SR/SR28/reports/sr28fg20.pdf) p207 fresh cooked pasta 131/5.15/24.93/1.05; p325 cooked white rice 130/2.69/28.17/0.28. [Dairy/eggs](https://www.ars.usda.gov/ARSUserFiles/80400535/Data/SR/SR28/reports/sr28fg01.pdf) p265 Romano 387/31.8/3.63/26.94; p402 whole raw egg 143/12.56/0.72/9.51. [Pork](https://www.ars.usda.gov/ARSUserFiles/80400535/Data/SR/SR28/reports/sr28fg10.pdf) p62 unprepared cured bacon 417/12.62/1.28/39.69, used only as a pancetta nutrient proxy, not a change to the menu composition. [Fish](https://www.ars.usda.gov/ARSUserFiles/80400535/Data/SR/SR28/reports/sr28fg15.pdf) p473 mixed-species raw sea bass 97/18.43/0/2: a generic sea-bass proxy, not an exact identified Thai farmed species or cooked restaurant assay.

Minor ingredient reference inputs per 100 g (kcal/P/C/F): spinach 23/2.86/3.63/0.39; garlic 149/6.36/33.06/0.5; tomato 18/0.88/3.89/0.2; chili 40/2/9.5/0.2; oil 884/0/0/100. These are generic ingredient approximations; fresh fish-bowl herbs use the spinach profile as a small greens proxy. Broth/sauce budgets above remain editorial estimates, not USDA entries.

Multiply inputs by assumed grams/100 and sum; no Quick Goal thresholds enter the calculation. Unrounded totals and production rounding:

| Dish | Unrounded kcal/P/C/F | Production kcal/P/C/F |
|---|---|---|
| F1 | 497.5 / 15.481 / 69.866 / 17.98 | 500 / 15 / 70 / 18 |
| F2 | 643.2 / 30.563 / 63.923 / 28.644 | 640 / 31 / 64 / 29 |
| M01 | 468.45 / 35.091 / 58.722 / 8.868 | 470 / 35 / 59 / 9 |

Kcal rounded to nearest 10, macros to whole grams; sodium/fiber absent. F1 matches no current preset. F2 matches High Protein only; its protein is borderline at 31 g against 30 g and fat exceeds Balanced's 25 g. M01 matches High Protein and Balanced; Light Meal misses by 20 kcal. These memberships describe point estimates, not certainty. Sensitivity: ±50 g cooked pasta changes about ±66 kcal/P2.6/C12.5; ±5 g oil about ±44 kcal/F5; ±10 g pancetta proxy about ±42 kcal/P1.3/F4; ±50 g rice ±65 kcal/C14; ±30 g raw-equivalent fish ±29 kcal/P5.5. Broth/sauce consumption and ingredient proxy choice add uncertainty; no confident health claims or threshold tuning.

## Catalog and discovery outcome

| Measure | Before | After |
|---|---:|---:|
| Restaurants | 15 | 17 |
| Logos | 15/15 | 17/17 |
| Menu items | 94 | 97 |
| Menu images | 50 | 50 |
| Image-less items | 44 | 47 |
| Menu image coverage | 53.19% | 51.55% |
| Priced items | 44 | 44 |
| Price coverage | 46.81% | 45.36% |
| Recipe relations | 23 | 23 |

Restaurant Grid positions: FAM TIME **16**, ฟ้าปลาทาน **17**. Both have zero image/price coverage; menu count breaks their tie (2 before 1). Prior 15 retain relative ranked order. Search naturally finds FAM TIME, its English/Thai pasta names, ฟ้าปลาทาน, seabass and ข้าวต้มปลากะพง. All three remain eligible for Random Meal, local Pick and favorites. Both brands participate in the canonical uniform Random Restaurant pool; no ranking copy or special weights used.

## Verification and browser QA

Focused 41B: **8/8 pass**. Latest focused 40B+41B: **28/28 pass**. Full `npx vitest run src --exclude "**/.kilo/**"`: **43 files, 624 tests pass**. `npx tsc --noEmit`: pass, including after the final focused-test refinement. `npm run build`: pass, 1875 modules; JS 909.22 kB / gzip197.88 kB. Existing >500 kB chunk warning remains; no new warning category. `git diff --check`: pass, with line-ending notices only. Historical 39A/39C hashes remain unchanged; only named 41B additions are excluded. New whole-source byte freeze also verifies every pre-41B restaurant source byte against Phase B entry (hash `163498aebe4973b27770815dea01ac5940ed88e0eadc49bfc374d5a521eac507`). Tiny representative portfolios have explicit exact-count exceptions; the prior brands retain the minimum-three check.

Built preview at localhost:4173 used isolated headless Chrome contexts, fresh storage per viewport/locale; no user's logged-in profile. All six combinations **390×844, 768×844, 1440×900 × Thai/English** passed: 17 ranked cards, both decoded official logos, exact 2/1 local menus, three Menu Details with bilingual names/estimate notes, no images/prices, favorite/unfavorite for every new dish, local Pick, Explore searches, both Random Restaurant candidates, Random Meal, and All Restaurants restoring the complete ranked order. No horizontal document overflow or page exceptions. Screenshot review covered grid, restaurant pages and all three details at each locale/size; long English/Thai titles wrap, no-image cards have no media placeholder, and serving/source notes are readable. Grid screenshots were repeated after explicitly decoding lazy logos; earlier partially loaded captures were not treated as logo failure. Existing remote logos can load later independently; existing cards/layout and fallback behavior are unchanged.

Browser harness corrections were QA-only: avoid toggling Explore closed between searches and set deterministic Math.random before the view captures its default prop. The production algorithm was never modified. Automated functional QA used temporary RNG overrides in isolated contexts to prove candidate membership; they do not affect production.

## Continuity and final scope

41A dish/composition/logo findings survived narrow verification. FAM Thai brand rendering was downgraded from proposed transliteration to retained English in both fields. M01 whole-bowl assumptions explicitly account for visible garnish oil and a variable 15 g sauce allowance; generic sea bass and cured-pork/cheese proxies remain disclosed assumptions. No measured portion or full nutrition emerged. Conditional 41A prices are withheld under the stricter 41B policy. No broad six-brand rediscovery.

No Ñamñam, สุกี้ช้างเผือก, Pepper Lunch, Tudari/Bul gogi, Sizzler or other new brand. No category/schema/dependency changes. No new menu images, prices, relations, ranking/search/random changes. Phase B not staged, committed or pushed; no deployment in either phase.

Exact Phase B file status (all paths below belong to this slice; expected entry was clean):

```text
 M src/ad-slot.test.tsx
 M src/catalog-truth-39c.test.ts
 M src/hub-app.test.tsx
 M src/meal-context.test.ts
 M src/menu-grid-36.test.tsx
 M src/menu-image.test.tsx
 M src/recipe-restaurant-bridge-app.test.tsx
 M src/restaurant-app.test.tsx
 M src/restaurant-enrichment-35b.test.ts
 M src/restaurant-expansion-40b.test.tsx
 M src/restaurant-imagery-38.test.tsx
 M src/restaurant-imagery-39a.test.tsx
 M src/restaurant-logo-35c.test.tsx
 M src/restaurants.test.ts
 M src/restaurants.ts
?? docs/restaurant-expansion-implementation-41b.md
?? src/restaurant-expansion-41b.test.tsx
```

Only `src/restaurants.ts` changes production behavior; the other TypeScript files are focused tests and deliberate baseline/freeze maintenance. Research 41A remains exactly the Phase A committed document. Temporary QA/download files and the task's preview process are cleaned up after validation.
