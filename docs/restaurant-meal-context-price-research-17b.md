# GoodFood V2 — Slice 17B Research Ledger

Research date: 2026-09-15  
Scope: existing production menu items for Ootoya Thailand and Santa Fe' Steak Thailand only.

This ledger records the evidence used for the small production population in
`src/restaurants.ts`. It intentionally records unresolved facts instead of
turning every menu listing into a meal context.

## Source method and rejected evidence

Evidence priority was official Thailand menu/ordering material, official
same-chain nutrition documentation where a cross-market comparison was
defensible, then current secondary menu listings.

- [Ootoya Thailand menu](https://www.ootoya.co.th/menu.php) was attempted but
  timed out during this research run. The Ootoya Thailand Facebook page
  redirected to a blocked login page, so neither was treated as current
  first-party price evidence.
- [Ootoya Japan Shima Hokke nutrition page](https://www.ootoya.com/menu_list/view/27428/988)
  was used only for a disclosed same-chain nutrition proxy. Its official
  single-item and set values support the Shima addition estimate; they are not
  presented as Thailand-official values.
- [Ootoya Japan mackerel nutrition page](https://www.ootoya.com/menu_list/view/27292/1359)
  and [Ootoya Japan moromi chicken nutrition page](https://www.ootoya.com/menu_list/view/27292/1342)
  confirmed that the Japanese chain publishes separate single-item and set
  structures, but their values were not copied into Thailand production data
  where the Thailand base semantics or exact portion could not be reconciled.
- [Ootoya's current secondary menu update](https://salehere.co.th/ootoya/promotions/update-price-ootoya)
  was used for the Tonteki set price and for current menu structure. It notes
  branch exceptions.
- [Ootoya's current official delivery listings](https://www.wongnai.com/delivery/businesses/8526ee/order)
  and [a second current branch listing](https://www.wongnai.com/delivery/businesses/142538jf/order)
  were used for item existence, descriptions, and set/à-la-carte labels.
  Their delivery/branch prices were rejected as production dine-in prices when
  they conflicted with other current captures.
- [Santa Fe' official site](https://www.santafesteak.com/) and its
  [current promotion page](https://www.santafesteak.com/frontends/detail/1)
  confirm the brand and current promotion structure, but the base menu is
  image-led and does not expose a complete text menu for every existing item.
- [Santa Fe' current menu/price update](https://salehere.co.th/santa-fe-steak/promotions/update-price-santa-fe-steak)
  was used for current listed menu prices dated 2026-09-05. Its branch
  exclusions are retained as a price caveat.
- [Santa Fe' current official delivery listing](https://www.wongnai.com/delivery/businesses/214051RQ/order)
  is marked Official and was used for serving descriptions, side choices, and
  current item-name comparison. Delivery prices were rejected as dine-in
  prices.
- Older photos, reviews, and the earlier [Thai menu-name source](https://www.menuinthai.com/santa-fe-steak-price/)
  were retained only for historical/name interpretation. They were not used
  to populate a current price.

## Slice 17C product interpretation

The Slice 17B evidence shows that some Santa Fe steak plates have selectable
sides or sauces, but GoodFood is a nutrition-discovery tool, not an ordering
configurator. GoodFood therefore does not model side lists, sauce selectors,
portion builders, configuration combinations, or configurable prices.

The small `MealContext` `configurable` variant is informational only. It tells
the user that the base serving is documented while the actual plate may vary;
it carries no addition nutrition and never produces a meal total. It is shown
in Pick Focus alongside the existing add-on and complete-meal treatments, not
on normal Explore rows or Favorites.

Base nutrition remains the truth for search, filters, Quick Goals, and Pick
eligibility. This keeps those product behaviors stable while making the
uncertainty visible where a user is evaluating a pick.

## Ootoya Thailand

| Menu item | Observed serving/configuration | Price decision | Meal-context decision | Addition components / nutrition | Nutrition source and caveat |
|---|---|---|---|---|---|
| `ootoya-grilled-mackerel` — Charcoal-Grilled Mackerel | Thailand listings show the same fish in both à la carte and set forms. The GoodFood base remains the fish-only à-la-carte concept. | Not populated. Current captures conflict: the secondary menu update shows ฿269/฿329, while current branch delivery material shows ฿239/฿289. | **B — Base + verified common addition.** | Rice, miso soup, and side items are the verified set concept. No Thailand-specific addition nutrition was published, so `additionNutrition` is absent. | Existing base remains curated same-chain nutrition. No cross-market addition was copied because the Thailand base/macros did not reconcile cleanly with the Japanese mackerel page. |
| `ootoya-shima-hokke-grilled` — Charcoal-Grilled Shima Hokke | Thailand listings show à la carte and set forms. Current captures also distinguish regular and selected-large fish sizes. | Not populated. Current captures conflict between roughly ฿289/฿339 and ฿389/฿449, so one amount would falsely imply a single size/configuration. | **B — Base + verified common addition.** | Rice, miso soup, and side items. Addition estimate: 330 kcal, 6 g protein, 70 g carbs, 1.1 g fat, 1.4 g fiber; sodium unknown. Derived from official Ootoya Japan set minus single-item values and marked `estimated`. | The existing base matches the official Japanese Shima item closely, but its carbs differ by 2.2 g. No base correction was made; the calculated total therefore remains an estimate rather than an official Thailand total. |
| `ootoya-grilled-moromi-chicken` — Charcoal-Grilled Chicken with Moromi Sauce | Current Thailand ordering material exposes both set and à-la-carte entries and describes the chicken thigh with moromi sauce. The exact Thailand set components were not listed clearly enough for this item. | Not populated. Available figures are delivery/branch-dependent and conflict. | **A — Base only.** | No production meal context. Japanese same-chain set structure was not assumed to be Thailand-specific. | Existing base remains curated same-chain nutrition. Japanese official values were not used as an addition because the Thailand base portion does not reconcile. |
| `ootoya-oyakodon` — Oyakodon | Current listing describes grilled chicken and egg over Japanese rice with nori. GoodFood already represents it as one rice bowl. | Not populated. Current branch captures show different delivery prices (฿159 and ฿199). | **A — Base only.** Rice is already part of the represented bowl, but no separate set addition is needed. | None. | Existing estimated nutrition and “includes rice” serving note were not changed. |
| `ootoya-tonteki-pork-chop-set` — Charcoal-Grilled Tonteki Pork Chop Set | Current menu update lists ฿359 à la carte / ฿419 set. A recent Thai review describes the set as pork chop with Japanese rice, miso soup, and side dishes. | **Populated: ฿419 THB**, as of 2026-09-15; branch exceptions noted. | **C — Already-complete meal.** | The stored base is the full set; no addition nutrition and no calculated total are stored. | Existing nutrition remains an estimate. The set composition is researched, but no credible addition nutrition was needed because the base record already represents the set. |
| `ootoya-grilled-salmon-rice-bowl` — Grilled Salmon Rice Bowl | Current material shows grilled salmon as a set/à-la-carte item and separate small/raw salmon rice items, but not this exact existing grilled-salmon rice-bowl configuration. | Not populated. | **E — Still not representable truthfully.** | No context. | The current menu identity/configuration does not match confidently enough to populate price or context; existing estimated nutrition was not changed. |

## Santa Fe' Steak Thailand

All seven existing Santa Fe' records remain `estimated` nutrition. Current
ordering descriptions show that steak plates commonly include sauce, salad,
bread, and a selectable side or side configuration. That makes a single
addition impossible to represent without choosing an arbitrary configuration,
and the existing low-carb estimates cannot be treated as full-plate nutrition
without new evidence.

| Menu item | Observed serving/configuration | Price decision | Meal-context decision | Addition components / nutrition | Nutrition source and caveat |
|---|---|---|---|---|---|
| `santa-fe-grilled-chicken-pepper-steak` — Grilled Chicken Steak, Pepper Sauce | Historical Thai menu evidence confirms the name and a steak plate with sides, but the exact item is not present in the current text-accessible menu. | Not populated. | **E — Still not representable truthfully.** | No context. | Current sides/configuration and current price are not defensible. Existing estimated nutrition was not changed. |
| `santa-fe-salmon-steak` — Salmon Steak | Current menu update lists the item at ฿329. Santa Fe menu structure and current promotional/ordering material show plated steak service with sides, but not a single fixed nutrition configuration. | **Populated: ฿329 THB**, as of 2026-09-15; branch exclusions noted. | **D — Configurable/unresolved, truthfully represented.** | Informational configurable context only; no side, sauce, or whole-meal nutrition is assumed. | Existing estimated base nutrition was not changed and should not be read as a complete selectable-side plate. |
| `santa-fe-dory-fish-steak` — Dory Fish Steak | Current menu update lists the plain grilled dory item at ฿209. Current official delivery material describes the item with sauce, vegetables, mash, and a selectable side; delivery listing price was rejected. | **Populated: ฿209 THB**, as of 2026-09-15; branch exclusions noted. | **D — Configurable/unresolved, truthfully represented.** | Informational configurable context only; side choice and configuration remain unresolved. | Existing estimated base nutrition was not changed. |
| `santa-fe-seabass-steak` — Seabass Steak | Name is supported by older Thai menu evidence, but no current matching menu configuration was found. | Not populated. | **E — Still not representable truthfully.** | No context. | Current availability, sides, and price are unresolved. |
| `santa-fe-kurobuta-pork-chop` — Kurobuta Pork Chop | Current menu has multiple sauce/configuration variants with different descriptions and side arrangements. | Not populated. A generic record cannot select one variant without fabrication. | **D — Configurable/unresolved, truthfully represented.** | Informational configurable context only; no sauce, side, or whole-meal nutrition is assumed. | Existing estimated base nutrition was not changed. |
| `santa-fe-chicken-steak-jaew` — Chicken Steak (2 Pieces), Jaew Sauce | Existing two-piece name does not match the current “three-spice chicken steak with jaew sauce” listing. | Not populated. | **E — Still not representable truthfully.** | No context. | Historical and current configurations cannot be safely conflated. |
| `santa-fe-premium-beef-steak` — Premium Fattened Beef Steak, Imported | Current menu lists imported ribeye, but the existing Thai name means a fattened-cattle/imported beef item and is not safely interchangeable with ribeye. | Not populated. | **E — Still not representable truthfully.** | No context. | Existing research explicitly rejects conflating these two menu concepts; no production price or context was added. |

## Classification summary

- **A — Base only:** 2 items (`ootoya-grilled-moromi-chicken`, `ootoya-oyakodon`)
- **B — Base + verified common addition:** 2 items (`ootoya-grilled-mackerel`, `ootoya-shima-hokke-grilled`)
- **C — Already-complete meal:** 1 item (`ootoya-tonteki-pork-chop-set`)
- **D — Configurable/unresolved, truthfully represented:** 3 items (`santa-fe-salmon-steak`, `santa-fe-dory-fish-steak`, `santa-fe-kurobuta-pork-chop`)
- **E — Still not representable truthfully:** 5 items (`ootoya-grilled-salmon-rice-bowl`, `santa-fe-grilled-chicken-pepper-steak`, `santa-fe-seabass-steak`, `santa-fe-chicken-steak-jaew`, `santa-fe-premium-beef-steak`)

## Production population summary

Production changes are limited to:

- two Ootoya add-on contexts;
- one Ootoya already-complete context;
- one Ootoya verified set price;
- two Santa Fe' current listed prices;
- three Santa Fe' informational configurable contexts;
- one researched Shima addition nutrition estimate with explicit provenance.

No calculated meal total is stored. Every total is derived at render time from
the base and addition values; configurable contexts never calculate a total.
No existing base nutrition values were changed.

The remaining risk is that five researched records still do not match a
current, specific configuration closely enough for even a generic production
statement. They remain unchanged rather than being forced into the
configurable state.
