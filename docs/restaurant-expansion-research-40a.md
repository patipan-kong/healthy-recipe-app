# GoodFood V2 — Slice 40A: Restaurant Expansion Research

Research date: **2026-10-01 (Asia/Bangkok)**. Research only. No production code, tests, assets or existing documents were changed. This file is the only persistent output.

Governing rule: **missing data is better than confident-looking wrong data.** No candidate here has official nutrition. Every number proposed for implementation would be a clearly labelled curated estimate.

---

## 1. Executive summary

Nine candidate restaurants were researched. Their source quality differs a lot. Breadth of truthful records was the target, not item count.

| Restaurant | Identity | Menu source | Logo | Strong candidates | Verdict |
|---|---|---|---|---|---|
| getfresh | Strong (The Fresh Food Co., Ltd.; own WordPress site) | **USABLE_WITH_LIMITATIONS**: official composition text for every item, some prices, no nutrition | VERIFIED (wordmark + LINE square mark) | 7 first, 14 later | **Implement first** |
| Sizzler Thailand | Strong (SLRT Ltd., Minor Food Group) | **USABLE_WITH_LIMITATIONS**: official menu sheets with names, weights, member/regular prices and side rules; sheets dated 2025-03 | VERIFIED (transparent badge) | 4 first, ~6 later | **Implement after getfresh** (needs side/salad-bar disclosure) |
| Ginger Farm Kitchen | Strong (own Squarespace site, branch PDFs 2025–2026) | **USABLE_WITH_LIMITATIONS**: bilingual official names and prices, but **menus differ by branch** and most dishes are shared plates | VERIFIED (square transparent) | 3 first, 6 later | **Implement single-serve dishes only** |
| VT Namnueng | Moderate (own shop domain + "VT Namnueng Official" LINE OA) | **WEAK**: menu domain has a self-signed certificate; shop sells retail take-home packs | VERIFIED (transparent roundel) | 0 | Defer (shared DIY wrap sets) |
| Ohkajhu | Strong identity (OKJ / Pluk Phak Praw Rak Mae PCL) | **WEAK**: ohkajhu.com now redirects to the investor site; no first-party menu found | VERIFIED via LINE (OKJ-site WebP has black corners) | 0 | Defer (no menu evidence) |
| Subway Thailand | Strong identity (subway.com/en-TH → subway.co.th) | **UNSUITABLE now**: official site is "under construction", no Thai menu or nutrition | VERIFIED brandmark (transparent "S" PNG) + SVG wordmark | 0 | Defer (no source + no sandwich category + customization) |
| Eat Am Are | Weak (no website; branch Facebook; small Instagram) | **UNSUITABLE**: only third-party menu mirrors | NO_SAFE_LOGO_FOUND | 0 | Defer |
| Ponn / ป้อน | Weak (Facebook only) | **UNSUITABLE**: only review/marketplace menus | OFFICIAL_BUT_TECHNICALLY_UNSUITABLE (signed, expiring fbcdn URL) | 0 | Defer |
| Farmfactory | **Not establishable**: farmfactoryworld.com is a **Sedo-parked domain**; LINE OA not resolvable | **UNSUITABLE**: indexed menu text is stale and no longer first-party | NO_SAFE_LOGO_FOUND | 0 | Defer |

Totals: **97 candidates** were evaluated across nine restaurants (§14). **IMPLEMENT_FIRST: 14** items from 3 restaurants. **IMPLEMENT_LATER: 26.** **DEFER: 57** (including all 37 candidates from six restaurants).

Important catalog-truth risks found:
1. **farmfactoryworld.com is parked.** Search engines still show its old menu and prices. That data must not be used.
2. **getfresh reuses URL slugs.** For example, `/menu/cajun-chicken-steak/` is now "Grilled Pork Chop with Coconut Sticky Rice", and `/menu/spaghetti-mushroom-sauce/` is "Salmon Penne Pasta". Item identity must come from the page title and description, never the slug or image filename.
3. **Ginger Farm menus are branch-specific.** One Nimman (Chiang Mai, 2026) and Emporium (Bangkok, 2025) list different dishes.
4. **Sizzler's sheets may be stale.** They were uploaded in March 2025, and the newest site upload is June 2025. Prices may have changed.
5. **No candidate restaurant publishes nutrition.** That includes getfresh, which third-party articles describe as "nutrition transparent".

---

## 2. Entry state and current production baseline

### Entry state (recorded before any research)

| Item | Value |
|---|---|
| Branch | `main` |
| HEAD | `c8e672219294adc347564eb42637a363ef771e93` |
| origin/main | `c8e672219294adc347564eb42637a363ef771e93` |
| Last 5 commits | `c8e6722` return navigation · `1a34052` imagery to 45 · `42fc6f5` restaurant imagery · `11a8b37` brand identities · `f5f37f4` unified discovery |
| Concurrent (foreign) changes present at entry | ` M src/restaurant-imagery-39a.test.tsx`, ` M src/restaurants.ts`, `?? docs/catalog-truth-audit-39b.md`, `?? src/catalog-truth-39c.test.ts` |

The foreign `src/restaurants.ts` diff (Slice 39C, presumably) does two things. It renames `seven-eleven-chicken-sukiyaki` to the glass-noodle wording. It also moves `thongsmith-spicy-shredded-chicken-dry` from Salad to Rice & noodles and adds a noodle/no-noodle servingNote. This task left all of it untouched. **During research, the concurrent agent committed those four files as `b904b8421c66423423fb4e0bac7daaec0fa86659` ("fix: correct restaurant catalog identities").** At completion, HEAD = origin/main = `b904b84`. The working-tree counts below therefore equal the new HEAD.

### Production baseline (observed in the working tree, 2026-10-01)

| Metric | Value |
|---|---|
| Restaurants | **13** |
| Logos | **13/13** (all `official-remote` hotlinks; several are Tier B LINE/Linktree CDN assets) |
| Menu items | **84** (unchanged at HEAD) |
| Menu images | **45/84 (53.6%)**: 34 `official-remote`, 11 `bundled` crops. 39 items have no image. |
| Prices | 44 |
| Nutrition confidence tags in item data | estimated 70 · curated 9 · label 6 · official 0 (one of the 85 tags belongs to a meal-context addition) |
| Categories (`MenuCategory`, closed union) | Salad 27 · Grilled/BBQ 24 · Rice & noodles 18 · Soup 13 · Set meal 2 (at HEAD: Salad 28 / Rice & noodles 17, before the foreign 39C change) |
| Top tags | high-protein 34, salad 27, grilled 24, isan 22, chicken 22, pork 21, fish 15, low-carb 14, rice 13, spicy 10, vegetarian 9 |

**Current portfolio:** Ootoya, Fuji, Sukiya (Japanese); Salad Factory, Jones' Salad (salads); 7-Eleven (packaged); MK (suki/hot pot); Santa Fe' Steak, The Steak & More (steak); Nittaya Kai Yang, Zaab Eli, Somtam Nua (Isan); ThongSmith (boat noodles).

### Schema facts that constrain this expansion (`src/types.ts`)

- `RestaurantMenuItem.nutrition` is **required**, and the validator checks macro/kcal sanity. Every new item therefore needs at least a curated `estimated` value. "No nutrition" is not representable.
- `MenuCategory` is a closed five-value union. There is **no sandwich, wrap, burger, pasta or breakfast category**.
- `MealContext.kind: 'configurable'` already exists ("base serving is known, full plate varies by selection"). It is the right home for Sizzler side choices and salad-bar disclosure, with no schema change needed.
- `servingNote` and `customizationNotes` are free text, localized TH/EN.
- `MenuPrice` has `amount`, `asOf` and an optional localized `note`. A "from" price or a member price can only be kept honest through `note`.
- Logos are `official-remote` hotlinks, shown in a 34×34 white tile with `object-fit: contain`. White-on-transparent or black-cornered assets look wrong there.
- Explore Quick Goals are numeric: High protein ≤700 kcal and ≥30 g protein; Light meal ≤450 kcal; Balanced ≤650 kcal, ≥25 g protein, ≤25 g fat. Estimates must not be tuned to land inside a preset.
- `imageFirstMenuItems` / `logoFirstRestaurants` only change presentation order. Image-less items stay first-class.

---

## 3. Method and source policy

**Source tiers.** Tier A: official brand/operator site, its menu pages, PDFs, CDN assets and REST endpoints. Tier B: brand-controlled LINE OA, Facebook, Instagram or link hub, accepted only when linked from or naming the brand. Tier C (discovery only): Grab, LINE MAN, foodpanda, Wongnai, OpenRice, TripAdvisor, blogs, mall directories, auto-generated menu sites (`*.menufyy.com`, `thaimenu.org`, `salehere.co.th`).

**Method.** I read the repository schema and the prior research (39B catalog truth audit; SOL/Opus image research; 35C logos; 37A asset coverage) first. Then each brand's ecosystem was explored with anonymous HTTP. I used WordPress/WooCommerce REST endpoints where exposed (getfresh, VT shop), extracted embedded JPEG pages from image-only PDFs (Ginger Farm), and made temporary crops of composite menu sheets (Sizzler) to read names and fine print. Images and logos were visually inspected. All temporary files lived in the session scratchpad outside the repository and were deleted at the end.

**Not done, on purpose.** No logged-in browser, no social login, no certificate bypass (vtnamnueng.net), no marketplace data treated as first-party, no assets saved to the repository. The Internet Archive was **offline** during research, so historical snapshots (e.g. pre-construction subway.co.th, pre-parking farmfactoryworld.com) could not be checked.

**Confidence vocabulary.** Classifications describe how strong the evidence is for a field. They are not probabilities.

---

## 4. Portfolio gap analysis

These dimensions describe the portfolio. They are not quotas.

| Dimension | Current coverage | Candidates that could fill it |
|---|---|---|
| Thai "clean" everyday rice plates | Minimal (Isan grilled/salads, boat noodles) | getfresh Thai-inspired (Khao Man Gai, Kaprao) |
| Northern Thai | **None** | Ginger Farm (khao soi, nam ngiao, hang lay) |
| Vietnamese | **None** | VT Namnueng (deferred: shared DIY sets) |
| Sandwich / wrap / customizable | **None, and no category exists** | Subway, getfresh melts/paninis/wraps (deferred) |
| Grain/rice bowls (non-Japanese) | Low | getfresh burrito / bulgogi / Tokyo bowls |
| Fish steaks / salmon mains | Some (Japanese grills) | getfresh Atlantic Salmon Steak; Sizzler salmon / sea bass |
| Steak with salad-bar context | Santa Fe', Steak & More | Sizzler (adds fish, and the salad-bar meal model) |
| Plant-based mains | 9 vegetarian-tagged items | getfresh Vegan Mushroom Kaprao; Sizzler Beyond Burger (deferred: category) |
| Salads | **Already the largest category (27)** | getfresh/Ohkajhu/Farmfactory salads: largely redundant |
| Shared Thai family-style | Isan only | Ginger Farm curries/platters (deferred: portion semantics) |

Redundancy warning: salad (27) and steak (2 restaurants) are already well covered. Salad candidates from getfresh, Ohkajhu and Farmfactory add little unless they bring something new: a vegan composition, a non-salad bowl or a new cuisine.

---

## 5. Subway Thailand

### Official ecosystem
- `https://www.subway.com/en-TH` → **302 to `https://subway.co.th/`**. Subway's global property points here, which establishes subway.co.th as the official Thai site.
- `https://www.subway.co.th/` (every path) returns *"Subway Thailand – Under Construction"* ("เว็บไซต์อยู่ระหว่างการปรับปรุง"), © 2025. **No menu, no prices, no nutrition.**
- The page links Facebook `facebook.com/SubwayThailand`, Instagram `instagram.com/subway.th`, and LINE `page.line.me/620pylrb` (OA title "Subway").
- Master franchisee: About Passion Co., Ltd. (Subway newsroom, 2022-02-16). CPF press shows a MEAT ZERO plant-based patty collaboration. That proves the product existed at a past date, not that it is on the current menu.

### Logo
| Asset | Format | Size | Background | Assessment |
|---|---|---|---|---|
| `https://www.subway.co.th/contents/images/subway_icon.png` | PNG | 1200×1551 | Transparent (alpha) | **VERIFIED_OFFICIAL_BRANDMARK**: green/yellow arrow "S". Ideal for a 34 px tile. |
| `https://www.subway.co.th/contents/images/subway_logo.svg` | SVG | viewBox 187×37 (5:1) | Transparent | VERIFIED_OFFICIAL_LOGO, but the wordmark would be about 7 px tall in a 34 px tile. Prefer the icon. |
| LINE OA avatar (`profile.line-scdn.net/0hKS0q…/preview`) | JPEG | 200×200 | Opaque | Tier B fallback |

### Menu source
**UNSUITABLE (current).** The only menu data is Tier C: Wongnai, Lemon8, salehere, thaiest, TripAdvisor. These report items such as Veggie Delite 6" ฿85, Tuna/Ham 6" ฿95, a Thailand-specific Seafood Tom Yum (6" "from ฿145", Footlong "from ฿259", wrap "from ฿155", salad "from ฿170") and Subway Melt sets (฿254 / ฿378). None of it is first-party, and the "from" prices depend on configuration.

### Candidate items
Veggie Delite, Tuna, Ham, Seafood Tom Yum, Subway Melt, Plant-based Garlic & Herb Patty. **All MARKETPLACE_ONLY → DEFER.**

### Customization findings
Thai Subway is built to order: size (6" / Footlong), bread, protein, cheese, vegetables, sauces, add-ons, plus wrap and salad formats. No official Thai document defines a default build. Overseas Subway nutrition (US/UK calculators) **must not** be transplanted. Bread recipes, portions and sauces differ by market.

Representation options against current architecture:
- **A. Canonical base sandwich.** Not truthful. A Subway sandwich has no single base.
- **B. Official recommended build.** Would be best, but no Thai source publishes one.
- **C. Representative build with explicit servingNote** (e.g. "6-inch, [bread], no cheese, vegetables, [sauce]"). This is the smallest truthful model once an official Thai menu exists. It fits `servingNote` + `customizationNotes` + `mealContext: configurable`, with an estimate for only that build.
- **D. Defer.** **Recommended now.** No first-party menu exists, and there is no category for sandwiches/wraps. "Salad" fits only the salad format, and "Set meal" would be misleading.

### Prices
NOT_FOUND (first-party). Tier C only, so omit.

### Nutrition
NO_OFFICIAL_NUTRITION for Thailand.

### Images
NO_USEFUL_ASSETS (first-party). Social media only.

### Readiness
Logo ready. Menu **DEFER**. Revisit when subway.co.th relaunches with a menu, or a brand-controlled Thai menu PDF appears.

---

## 6. Eat Am Are

### Official ecosystem
- No website: `eatamare.com` and `eatamare.co.th` do not resolve.
- Facebook *"Eat Am Are Good Steak Center One"* is a **branch-level** page. Instagram `@eatamareofficial` has about 558 followers per the search snippet. Neither could be read without login.
- `eat-am-are.menufyy.com` and `eat-am-are-good-steak.menufyy.com` are JavaScript-rendered pages from a third-party menu-site generator, with no ownership statement. They are Tier C. Two names ("Eat Am Are" / "Eat Am Are Good Steak") suggest either rebranding or separate concepts. **Identity is ambiguous.**
- Mall directories (Mega Bangna) are Tier C.

### Logo
**NO_SAFE_LOGO_FOUND.** There is no first-party web asset. A branch Facebook avatar would be a signed, expiring fbcdn URL.

### Menu source / prices / nutrition / images
UNSUITABLE · MARKETPLACE_ONLY (thaimenu.org "Feb 2024", menufyy) · NO_OFFICIAL_NUTRITION · MARKETPLACE_ONLY.

### Candidate items
Garlic Pork Steak, Spicy Grilled Chicken Steak, Strip Loin 250 g, Rib Eye 250 g, Spaghetti, Burger. **All MARKETPLACE_ONLY → DEFER.**

### Side configuration (§10 brief)
Third-party menus suggest steaks come with fries/salad, but no first-party evidence says which sides are included or selectable. If this brand returns with an official menu, follow the Sizzler treatment: main-only nutrition plus `mealContext: configurable`.

### Readiness
**DEFER the restaurant.** It overlaps the existing value-steak cluster (Santa Fe', Steak & More) and has no trustworthy sources.

---

## 7. Ohkajhu (โอ้กะจู๋)

### Official ecosystem
- `www.ohkajhu.com/*` → **redirects to `www.okjgroup.com`** (investor/corporate site of Pluk Phak Praw Rak Mae PCL, "OKJ"). `/en/menu` and `/th/menu` return **404**.
- Brand page `okjgroup.com/en/business-and-brands/ohkajhu` describes organic farm-to-table salads, steaks, soups and spaghetti. It names the operator and links Instagram `@ohkajhu`, Facebook `ohkajhuorganic` and LINE OA `page.line.me/pcb3808y` (title "OHKAJHU"). **No menu, prices or nutrition.**
- Probed sub-domains (`shop.`, `order.`, `delivery.`) do not resolve.

### Logo
| Asset | Format | Size | Background | Assessment |
|---|---|---|---|---|
| `https://www.okjgroup.com/storage/business-and-brands/ohkajhu/ohkaju-logo.webp` | WebP (lossy, **no alpha**) | 800×800 | **Black corners** outside the roundel | OFFICIAL_BUT_TECHNICALLY_UNSUITABLE in a white tile |
| LINE OA avatar `https://profile.line-scdn.net/0hx8sUpogKJxdOLDgrdPVYQHJpKXo5AiFfNkpsdGN4eyRgHTMVJR9oIT8sfSJnTGlGJRg8dzwqfCJj/preview` | JPEG | 200×200 | White corners | **VERIFIED_OFFICIAL_LOGO** (Tier B, linked from Tier-A okjgroup.com). Same production pattern as Salad Factory and Santa Fe'. |

### Menu source
**WEAK.** Tier C sources (salehere "2569", Lemon8, menuinthai, Wongnai) list items such as Caesar salad ฿186, Grilled Chicken Thyme salad ฿325, Pork Spare Ribs Steak S ฿385 / L ฿820, Fish & Chips ฿215, and a ฿259 salad-bar buffet. These cannot be verified first-party. Portions are known to be very large, and S/L sizes exist.

### Health-claim separation (§11)
"Organic" and "farm-to-table" are **brand claims** about sourcing. They establish **no** nutrition facts. No official nutrition was found.

### Candidate items
Caesar Salad, Grilled Chicken Thyme Salad, Pork Spare Ribs Steak (S/L), Salmon Steak, Fish & Chips, Mixed Salad. **All MARKETPLACE_ONLY → DEFER.** They would also need size configuration and overlap the salad/steak clusters.

### Readiness
Logo ready (LINE). **DEFER the restaurant** until a first-party menu is found (e.g. a LINE OA rich menu read by the owner, or a menu PDF).

---

## 8. getfresh

### Official ecosystem
- `https://getfresh.co.th/` is WordPress. The footer names **The Fresh Food Company Limited** (102 Atthakawi 2 Bldg, Soi Aree, Sukhumvit 26), © 2026.
- Menu: `https://getfresh.co.th/menu/`. Item pages are at `/menu/<slug>/`.
- Official REST: `https://getfresh.co.th/wp-json/wp/v2/menu?per_page=100` (106 records), taxonomies `category_menu` and `diet`. This gives the official title, composition text, category, diet tags and modified date for every item.
- Ordering: site button `https://lin.ee/tGGVAKL` → LINE OA `page.line.me/700dmltt` ("getfresh | LINE Official Account").

### Logo
| Asset | Format | Size | Background | Assessment |
|---|---|---|---|---|
| `https://getfresh.co.th/wp-content/uploads/2026/06/getfresh-Logo-RGB_2026_6.png` (also `-1024x251`, `-300x74`) | PNG | 4245×1041 | Transparent (tRNS) | VERIFIED_OFFICIAL_LOGO (2026 olive wordmark + petal mark). Wide 4:1, so small in a tile. |
| LINE OA avatar `https://profile.line-scdn.net/0hlLjprtuSM2NXCS9GHq5MNGtMPQ4gJzUrL2ooUXEPOFYqPCY1OGcoBCZablp8aiFnaz11VXZaOQR8/preview` | JPEG | 200×200 | Olive square, cream petal mark | **VERIFIED_OFFICIAL_BRANDMARK**. **Recommended for the Grid** (square, legible). Tier B, linked from the official site's order button. |
| `https://getfresh.co.th/favicon.png` | PNG | 32×32 | Transparent, multicolour petals | Older palette; too small |

### Menu source
**USABLE_WITH_LIMITATIONS.**
- Strengths: official English names and ingredient-level composition for every item, diet tags, per-item studio photos.
- Limitations:
  - **No Thai names** on the site (the TH switch exists, but item titles are English).
  - **No nutrition.**
  - Prices appear on only some item pages, are undated and have no channel context.
  - Salads come in Size S / Size L.
  - Salads and wraps share names (`the-vegan-harvest` = salad, `the-vegan-harvest-2` = wrap).
  - Slugs are reused (see §1).

### Candidate items (official English names; descriptions condensed from the official text)
| # | Official name | Proposed category | Composition (official) | Price (official page, undated) | Image | Class |
|---|---|---|---|---|---|---|
| G1 | Clean Khao Man Gai | Rice & noodles | poached chicken breast, garlic-infused organic brown rice, steamed bok choy, clear soup; soy-bean, ginger–spring onion, and chili–ginger–vinegar sauces | not shown | VERIFIED_STANDALONE `…/uploads/2025/02/Clean-Khao-Man-Gai.png` (1000², transparent; visually matches every component) | **READY_WITH_ESTIMATED_NUTRITION** |
| G2 | Clean Kaprao Gai | Rice & noodles | chicken breast, Thai basil, bell peppers, roasted garlic, red chili, organic egg, over organic jasmine riceberry | not shown | VERIFIED_STANDALONE `…/2022/03/Clean-Kra-Pao-Gai-1024x1024.png` (rice not visible under the topping) | READY_WITH_ESTIMATED_NUTRITION |
| G3 | Vegan Mushroom Kaprao | Rice & noodles | mixed organic mushrooms, bell peppers, roasted garlic, red chili, Thai basil, over organic jasmine riceberry (diet: vegan, spicy) | ฿189 | VERIFIED_STANDALONE `…/2022/03/Vegan-Mushroom-Kaprao-1024x1024.png` | READY_WITH_ESTIMATED_NUTRITION |
| G4 | Korean Pork Bulgogi Bowl | Rice & noodles | Korean-spiced pork tenderloin, kimchi, pickled daikon, sesame carrots, spring onion, organic onsen egg, over organic jasmine riceberry | ฿289 | VERIFIED_STANDALONE `…/2024/04/Korean-Bulgogi-Bowl-Pork.png` | READY_WITH_ESTIMATED_NUTRITION |
| G5 | Chicken Burrito Bowl | Rice & noodles | sautéed chicken breast, onion, pepper, corn salsa, spiced red bean, lettuce, guacamole, sour cream, ranch, cheddar, tortilla chip, cilantro, organic brown rice, adobo chipotle sauce | ฿399 | VERIFIED_STANDALONE `…/2025/02/Chicken-Burrito-Bowl.png` (alpha) | READY_WITH_ESTIMATED_NUTRITION |
| G6 | Atlantic Salmon Steak | Grilled/BBQ | grilled Atlantic salmon steak, EVOO-infused mashed potato, warm organic mushroom salad, dill cream sauce | ฿499 | **VERIFIED_VARIANT**: `…/2024/04/Salmon-Steak.png` shows a pumpkin wedge not in the text. Withhold the image or disclose it. | READY_WITH_ESTIMATED_NUTRITION |
| G7 | Minestrone | Soup | diced Italian vegetables, tomato broth, orzo, basil (vegan) | ฿129 | **Ambiguous**: `…/2022/03/Minestrone_V2.png` looks very like a tomato-basil soup. Withhold. | READY_NO_IMAGE |
| G8 | Clean Salmon Tom Yum Fried Rice | Rice & noodles | diced Atlantic salmon, tom yum spices, organic brown rice, mushroom, lemongrass, tomato, kaffir lime, chili, cucumber, organic fried egg | not shown | `…/2025/02/Clean-Salmon-Tom-Yum-Fried-Rice.png` (not visually re-verified) | IMPLEMENT_LATER |
| G9 | Larb Chicken Steak | Grilled/BBQ | chicken breast, larb sauce, vegetables, organic jasmine rice | ฿269 | VERIFIED_VARIANT: photo shows riceberry, text says jasmine rice | IMPLEMENT_LATER (Isan flavour already covered) |
| G10 | Piri Piri Chicken Steak | Grilled/BBQ | 12-spice chicken breast, citrus salad, organic jasmine riceberry, piri piri sauce | ฿269 | `…/2022/03/PiriPiri_Chicken_Steak.png` | IMPLEMENT_LATER |
| G11 | Black Pepper Chicken Breast | Grilled/BBQ | black-pepper chicken breast, mash, warm mushroom salad, green peppercorn sauce | ฿299 | `…/2024/04/Black-Pepper-Chicken-Breast.png` | IMPLEMENT_LATER (near-duplicate of G6's plate format) |
| G12 | Pork Chop | Grilled/BBQ | bone-in sous-vide pork chop, mash, mushroom salad, green peppercorn sauce | ฿399 | not checked | IMPLEMENT_LATER |
| G13 | Beef Burrito Bowl | Rice & noodles | seared Australian tenderloin + burrito-bowl components | ฿399 | not checked | IMPLEMENT_LATER (variant of G5) |
| G14 | Tokyo Bowl | Rice & noodles | sashimi-grade tuna, raw salmon, salmon roe, avocado, pumpkin, radish, nori, soy vinaigrette, riceberry | not shown | `…/2024/04/Tokyo-Bowl.png` | IMPLEMENT_LATER (overlaps Japanese cluster) |
| G15 | Grilled Chicken Caesar (salad) | Salad | romaine, grilled chicken, bacon, quail egg, parmesan, croutons, Caesar dressing | **S ฿189 / L ฿269** | not checked | CONFIGURATION_REQUIRED (size) |
| G16 | Mexican Chop Job (salad) | Salad | lettuce, spiced chicken, red beans, avocado, jalapeño salsa, peppers, cheddar, corn, tomato, tortilla chips, avocado dressing | **S ฿269 / L ฿389** | not checked | CONFIGURATION_REQUIRED |
| G17 | The Greek (salad) | Salad | iceberg, cucumber, pepper, tomato, onion, kalamata, feta, lemon-lime vinaigrette; "+ Grilled Chicken ฿30" | **S ฿169 / L ฿239** | not checked | CONFIGURATION_REQUIRED (size + add-on) |
| G18 | Roasted Japanese Pumpkin (salad) | Salad | roasted kabocha, rocket, tomato, onion, peppers, sun-dried tomato, feta, sunflower seeds, honey balsamic | **S ฿199 / L ฿279** | `…/2022/03/Roasted-Japanese-Pumpkin-1024x1024.png` | CONFIGURATION_REQUIRED |
| G19 | Cobb (salad) | Salad | lettuce, grilled chicken, bacon, egg, blue cheese, avocado, tomato, Dijon vinaigrette | sizes, price not shown | `…/2022/03/Cobb_V2.png` | CONFIGURATION_REQUIRED |
| G20 | The Vegan Harvest (salad) | Salad | chickpeas, quinoa, pomegranate, seeds, cranberries, tempeh, mango, rocket, spicy yuzu dressing | not shown | (diet icon, not a dish photo) | CONFIGURATION_REQUIRED (likely sized) |
| G21 | Salmon Yuzu (salad) | Salad | lettuce, mango, lemongrass, mint, raw Atlantic salmon, almond, spicy yuzu dressing | not shown | `…/2025/02/Salmon-Yuzu.png` | CONFIGURATION_REQUIRED |
| G22 | Tomato & Basil / Japanese Pumpkin (soups) | Soup | official text | ฿129 each | not checked | IMPLEMENT_LATER (G7 represents soups) |
| G23 | Tuna Melt / Chicken Tikka / Roast Beef and Cheddar / Paris Ham & Cheddar (paninis, melts) | **no category** | official text, served with root-vegetable chips | ฿209 / ฿209 / ฿359 / — | some | DEFER (category gap) |
| G24 | Wraps (Cordon Bleu ฿229, Cobb, Greek, Italian Job, Vegan Amigo…) | **no category** | same names as salads, in tortilla | mixed | — | DEFER (category gap + name collision with salads) |
| G25 | Pastas (Chicken Penne Pesto ฿269 "+฿20 konjac", Spaghetti Carbonara, Plant-Based Bolognese…) | Rice & noodles? | official text | mixed | — | DEFER (category decision + konjac option) |
| G26 | Brunch (Shakshuka It Off, Shroom Frittata, Aussie Avo…) | **no category** | official text | not shown | Frittata file is named `Breakfast-Burrito-Recovered.png` and has dark alpha fringing | DEFER |

### Health-claim separation (§11)
Diet tags ("high-protein", "keto-friendly", "collagen") are official **labels**, not nutrition values. Third-party articles say getfresh "makes nutrition transparency part of its value proposition", but **no nutrition figure appears on any official page examined**. LINE ordering may show more, but that was not verified. Every getfresh item therefore needs `CURATED_ESTIMATE_REQUIRED`. The official ingredient lists make the estimates unusually well-grounded. The "high-protein" diet tag must **not** be copied as GoodFood's `high-protein` tag unless the estimate supports it.

### Prices
OFFICIAL_BUT_CONTEXT_DEPENDENT: official website, **undated**, channel not stated, present on only some items. Single-price items (G3–G6, G7) can carry `price` with a note saying "official website listing, accessed 2026-10-01". Sized salads must not be flattened. Leave them unpriced or note "S ฿X / L ฿Y".

### Nutrition
NO_OFFICIAL_NUTRITION.

### Images
**STRONG_EXACT_DISH_ASSETS**: transparent-background studio PNGs, 800–2560 px, `Cache-Control: public, max-age=31536000`, stable WordPress upload paths. Caveats: check every image against its text (two variants and one ambiguous image found among nine checked). Filenames are unreliable.

### Readiness
**Implement first: G1–G7.** Later: G8–G14, G22. Configuration: G15–G21. Deferred: G23–G26.

---

## 9. Farmfactory

### Official ecosystem — identity NOT established
- `www.farmfactoryworld.com` (DNS 91.195.240.94, name.com nameservers) serves a **Sedo parking page** ("farmfactoryworld.com – farmfactoryworld Resources and Information", Sedo logo, redirect script to `findonlineresults.com`). The search-indexed "Menu Farmfactory" (Special Caesar ฿170, Guacamole Mole ฿205, Avocobb ฿205, Magic Bowl ฿190, Smoked Salmon ฿220, MYO from ฿119) is therefore **stale, no longer first-party, and must not be used**.
- `page.line.me/farmfactory` returns placeholder metadata, and `line.me/R/ti/p/@farmfactory` returns 404. Instagram `@farmfactory_th` (~1.1k followers per snippet) and Facebook could not be read without login.
- Ownership signals conflict. One profile says it is founder-owned (BK Magazine). Press pieces (mgronline, wearecp.com) describe it as a CPF-group brand. The registered company is "Farmfactory World Co., Ltd." (dataforthai 0105561169512). Several Silom/other branches may have closed, per Tier C reports. **Current operating status is unverified.**
- Name collisions: Farm Factory (Nigeria, `farmfactory.ng`), Farm Factory (India, `@farmfactory.in`) and others.

### Logo / menu / price / nutrition / images
NO_SAFE_LOGO_FOUND · **UNSUITABLE** · MARKETPLACE_ONLY (foodpanda, Wongnai) · NO_OFFICIAL_NUTRITION · NO_USEFUL_ASSETS.

### Candidate items
Special Caesar, Guacamole Mole, Avocobb, Magic Bowl, Smoked Salmon, Spicy Zab salmon, Grilled-salmon rice with jaew sauce, Honey BBQ pork-rib steak. **All DEFER (identity).** They are also redundant with the salad cluster.

### Readiness
**DEFER the restaurant** until a live brand-controlled channel is confirmed.

---

## 10. Sizzler Thailand

### Official ecosystem
- `https://www.sizzler.co.th/th` and `/en`. The About page states: *"In Thailand, the Sizzler franchise is handled by SLRT Limited, a subsidiary of The Minor Food Group."*
- Menu category pages `/th/menu/{beefsteak, pork, chicken, seafood, plant-based, burger, combination-platter, premium-combination-platter, platter-for-two, kidsmenu, lunch-special, wednesday-all-day, …}`. Each embeds **one tall composite sheet** (1250×7083 JPEG) under `https://www.sizzler.co.th/storage/upload/202503/…` (`max-age=14400`).
- Delivery: "1112 Delivery" (Minor; the storefront is JavaScript-only and was not readable). The Linktree `linktr.ee/sizzlerthai` lists GrabFood, LINE MAN, ShopeeFood (Tier C) and LINE OA `page.line.me/mjg0575g`.
- **Recency:** menu sheets were uploaded 2025-03 (the plant-based sheet too). The newest upload anywhere on the site is 2025-06. The sheets are live today but may be about 18 months old.

### Logo
| Asset | Format | Size | Background | Assessment |
|---|---|---|---|---|
| `https://www.sizzler.co.th/img/global/logo-sizzler-footer_2x.png` | PNG | 510×222 | Transparent outside a dark-green rounded badge | **VERIFIED_OFFICIAL_LOGO**. Full-colour badge, readable on a white tile (wide, like MK's 412×277). |
| `/favicon.ico` | ICO | — | — | not needed |

### Menu source
**USABLE_WITH_LIMITATIONS.** The sheets give bilingual names, weights, two prices (member "Gold/Diamond" vs regular "ปกติ") and official fine print. That fine print (cropped and read) says:
> "All-you-can-eat soup, salads, dessert, and fruit are included when ordering a main dish at the restaurant. | The visual is used for advertising purpose only. | All prices include VAT. | Takeaway service charges 20 THB/box. | Member Price is for Sizzler E-Member Gold and Diamond Tier only."

Each steak panel also says *"เลือกเครื่องเคียงได้ฟรี 1 อย่าง / Choose one free side dish or add more for an additional charge"*. The sides are French fries, baked potato, cheese toast, organic rice and sticky rice, with a +฿20 "Level up" to truffle fries or loaded potato.

### Side / meal configuration (§10)
The **main** is one fixed protein item. The **meal** is that main, plus one chosen side, plus an unlimited salad/soup/dessert/fruit bar for dine-in only. Nutrition must cover **the main plate only**: protein, sauce and plated garnish, **excluding** the free side and the bar. The rest should be disclosed through:
- `servingNote`: "Steak plate with sauce; excludes the free side dish and the salad bar."
- `mealContext: { kind: 'configurable', label: "Choose 1 side; salad bar included for dine-in" }`.
- `customizationNotes`: the side list.

Photos show a specific side (baked potato, rice, fries), so a crop shows **one configuration**. Disclose it, or crop the protein only where possible.

### Candidate items (sheet 2025-03; Thai names read from the sheets)
| # | English (official) | Thai (official) | Category | Portion | Regular / member price | Image | Class |
|---|---|---|---|---|---|---|---|
| S1 | Hibachi Chicken Steak | สเต็กไก่ย่างฮิบาชิ | Grilled/BBQ | — | ฿349 / ฿315 | VERIFIED_CROP_CANDIDATE (chicken sheet ~y 2400–3200; plate includes baked potato, salad, pineapple) | **READY_WITH_ESTIMATED_NUTRITION** + configurable |
| S2 | Nordic Style Sous Vide Salmon Steak (170 g) | สเต็กปลาแซลมอนซูวีสไตล์นอร์ดิก | Grilled/BBQ | 170 g | ฿599 / ฿540 | VERIFIED_CROP_CANDIDATE (seafood sheet top; plate includes onion rings, edamame) | READY_WITH_ESTIMATED_NUTRITION |
| S3 | Sea Bass Steak with Seafood Mayo Sauce | สเต็กปลากะพงย่าง ซอสซีฟู้ดมาโย | Grilled/BBQ | — | ฿399 / ฿360 | VERIFIED_CROP_CANDIDATE (seafood sheet ~y 2600–4000) | READY_WITH_ESTIMATED_NUTRITION |
| S4 | Sizzling Beef Loin Steak (150 g) | สเต็กเนื้อบีฟลอยน์จานร้อนพร้อมหินร้อนสไตล์ญี่ปุ่น | Grilled/BBQ | 150 g | ฿659 / ฿594 | VERIFIED_CROP_CANDIDATE (beef sheet ~y 3700–4800; corn, potato, salsa) | READY_WITH_ESTIMATED_NUTRITION |
| S5 | Thai Style Jaew Chicken Steak | สเต็กไก่ย่าง ซอสแจ่ว | Grilled/BBQ | — | ฿319 / ฿288 | crop candidate (sticky rice shown) | IMPLEMENT_LATER (Thai-fusion near-duplicate of S1) |
| S6 | Spicy Chicken Steak | (sheet) | Grilled/BBQ | — | ฿299 / ฿270 | crop | IMPLEMENT_LATER |
| S7 | Hot & Spicy BBQ Chicken Steak | (sheet) | Grilled/BBQ | — | ฿299 / ฿270 | crop | IMPLEMENT_LATER |
| S8 | Teriyaki Saba Steak | (sheet) | Grilled/BBQ | — | ฿369 / ฿333 | crop | IMPLEMENT_LATER |
| S9 | Sizzling Ribeye Steak (250 g) | (sheet) | Grilled/BBQ | 250 g | ฿999 / ฿900 | crop | IMPLEMENT_LATER (premium variant of S4) |
| S10 | Southwest Chicken Steak | (sheet) | Grilled/BBQ | — | ฿399 / ฿360 | crop | IMPLEMENT_LATER |
| S11 | Sizzling Tenderloin (150 g) / New York Strip / Teriyaki Chopped Beef / Diced Angus | (sheet) | Grilled/BBQ | — | ฿799 / ฿899 / ฿449 / ฿499 | crop | DEFER (near-duplicates) |
| S12 | Asian Style Salmon Steak (100 g) & Grilled Tiger Prawn | (sheet) | Grilled/BBQ | 100 g + prawn | ฿599 / ฿540 | crop | DEFER (combination) |
| S13 | Fish & Chips | ฟิช แอนด์ ชิปส์ | Grilled/BBQ? (fried) | — | ฿299 / ฿270 | crop | DEFER (category fit poor) |
| S14 | Spicy Pesto Salmon Spaghetti (100 g) | (sheet) | — | 100 g | ฿499 / ฿450 | crop | DEFER (pasta category) |
| S15 | Beyond Burger (plant-based) | บียอนด์ เบอร์เกอร์ (ไม่มีเนื้อสัตว์) | — | — | ฿429 / ฿387, **28 branches only** | standalone sheet `…/202503/1743399061_S__5390698.jpg` (1240×1754, single product) | DEFER (no burger category; branch-limited) |
| S16 | Salad bar (stand-alone, ฿139/฿159 promos 2025-04) | — | Salad | unlimited | promo | — | DEFER (not portionable) |

The pork sheet (`1743362546_by category-03.jpg`) and the platter sheets were not transcribed item by item.

### Prices
OFFICIAL_BUT_CONTEXT_DEPENDENT: member vs regular, dine-in, VAT-inclusive, +฿20 takeaway box, sheet dated 2025-03. **Recommendation: withhold price** until a 2026 sheet or a branch check confirms it. If owner policy accepts sheet-dated prices, use the **regular** price only, with note "Regular (non-member) dine-in price incl. VAT; official menu sheet 2025-03". Never use the member price as the item price.

### Nutrition
NO_OFFICIAL_NUTRITION. Estimate the main plate only, using the stated weights for S2 and S4.

### Images
COMPOSITE_MENU_ONLY with good crop potential: large single-dish panels with text overlaid near the plates. Crops must exclude price and label boxes and neighbouring plates. Each crop shows a specific side configuration. If shipped, crops would be `bundled` with `cropOf` the sheet URL, following the existing 11-crop precedent.

### Readiness
**S1–S4 implement first** (after getfresh). The configurable-meal disclosure is mandatory.

---

## 11. Ginger Farm Kitchen

### Official ecosystem
- `https://www.gingerfarmkitchen.com/` (Squarespace). "Our Story": the founders came from fashion/retail, started with a farm outside Chiang Mai, use a "FARM TO CITY" concept, and have branches in Chiang Mai (One Nimman), Bangkok, Phuket and Pattaya. No operating company name is given on the site.
- Menu hub `https://www.gingerfarmkitchen.com/menu-2` links **per-branch PDFs** at `/s/…pdf`, including `One-Nimman-Menu-2026.pdf` (40 pages, image-only), `GFK-Pattaya-2026.pdf`, `Airport-Flr3-Menu_2026.pdf`, `King-Square-Menu-2025.pdf`, `Emporium-Menu-2025_1.pdf` (20 pages), `Menu-Central-Westville.pdf`, `GFK-Menu-ICONSIAM-2024.pdf`, `GFK-Phuket-Menu.pdf`, `breakfast.pdf`, and beverage menus.
- Social: `facebook.com/gingerfarmkitchen`, `instagram.com/gingerfarm_kitchen`.

### Logo
| Asset | Format | Size | Background | Assessment |
|---|---|---|---|---|
| `https://images.squarespace-cdn.com/content/v1/5dcac1b37b75f56509c0a367/1577359518038-F21TWZ1SK7S55O0AKTQI/GFKlogo.png` (`?format=500w` etc.) | Served as WebP (content-negotiated; `.png` path) with alpha | 1600×1600 | Transparent | **VERIFIED_OFFICIAL_LOGO**: square green house mark, "GINGER FARM kitchen". Ideal for a tile. `max-age=31536000`. |

### Menu source
**USABLE_WITH_LIMITATIONS.** Strengths: current (2026), official bilingual names, prices, allergen markers, and the footer *"Prices are subject to 10% service charge"*. Limitations:
- **Branch variance.** One Nimman 2026 lists khao soi, nam ngiao, hang lay, grills and crab dishes. Emporium 2025 is a different menu: khanom-jeen curry sets ฿195–225, tom yum noodles ฿195/225, boat noodles ฿255.
- **Most dishes are shared plates** served without rice.
- Image-only PDFs, so there is no text layer.

### Shared vs single-serve (§12)
Natural single servings: noodle bowls (khao soi, khanom jeen nam ngiao). Possible single protein plates: grilled chicken with jaew, *if* the servingNote says rice and vegetables are excluded or ordered separately. Shared and not representable without a defined portion: curries (hang lay, jackfruit, panang), whole fish ฿590, the Chiang Mai Platter ฿590, crab dishes, yum salads, and stir-fried vegetables.

### Candidate items (source: One Nimman 2026 PDF unless stated)
| # | Thai (official) | English (official) | Category | Price (One Nimman, before 10% SC) | Image | Class |
|---|---|---|---|---|---|---|
| F1 | ข้าวซอยไก่ | Khao Soi Northern Style Noodle Curry with Crispy Noodle and Chicken | Rice & noodles | ฿185 | VERIFIED_CROP_CANDIDATE: dedicated photo, PDF p.31 (also shown on p.5) | **READY_WITH_ESTIMATED_NUTRITION** |
| F2 | ขนมจีนน้ำเงี้ยวเส้นข้าวกล้องเล้งกระดูก | Northern Thai Brown Rice Noodle Soup with Minced Pork, Pork Ribs, Tomato and Pork Blood | Rice & noodles | ฿195 | VERIFIED_CROP_CANDIDATE (p.31) | READY_WITH_ESTIMATED_NUTRITION |
| F3 | ไก่หมักสมุนไพรย่าง เสิร์ฟพร้อมน้ำจิ้มแจ่ว | Herb-marinated Grilled Chicken served with Jaew Dip | Grilled/BBQ | ฿225 | VERIFIED_CROP_CANDIDATE (p.19) | READY_WITH_ESTIMATED_NUTRITION (servingNote: rice not included) |
| F4 | ข้าวซอยเนื้อตุ๋น | Khao Soi with Braised Beef | Rice & noodles | ฿250 | crop (p.31) | IMPLEMENT_LATER (variant of F1) |
| F5 | เนื้อริบอายย่าง (New Zealand) 200 ก. เสิร์ฟพร้อมน้ำจิ้มแจ่ว | Grilled New Zealand Ribeye Steak (200g.) Served with Jaew Dip | Grilled/BBQ | ฿690 | crop (p.19) | IMPLEMENT_LATER |
| F6 | คอหมูย่างจิ้มแจ่ว | Grilled Pork Neck served with Jaew Dip | Grilled/BBQ | ฿295 | crop (p.19) | IMPLEMENT_LATER (Isan cluster overlap) |
| F7 | แกงฮังเล | Northern Style Hang Lay Curry | Soup | ฿295 | crop (p.27) | CONFIGURATION_REQUIRED (shared portion) |
| F8 | แกงขนุน | Northern Style Spicy Young Jackfruit Soup with Pork | Soup | ฿195 | crop (p.27) | CONFIGURATION_REQUIRED |
| F9 | ตำมะม่วงปลาแห้ง | Northern Style Mango Salad mixed with Dried Fish Floss | Salad | ฿165 | crop (p.11) | IMPLEMENT_LATER (shared side) |
| F10 | แกงเขียวหวานไก่ / หมู | Green Curry with Chicken / Pork | Soup | ฿225 (braised beef ฿350) | crop | CONFIGURATION_REQUIRED (protein choice + shared) |
| F11 | เซ็ตแอ่วเหนือ | The Chiang Mai Platter | Set meal | ฿590 | crop | DEFER (platter) |
| F12 | หมูกรอบสามเกลอ… | Signature Crispy Pork Belly with Three Dippings and Housemade Pickles | Grilled/BBQ? (fried) | ฿395 | crop | DEFER (shared, fried) |
| F13 | ยำขนมจีนข้าวกล้องปลาทู | Spicy Brown Rice Noodle Salad with Fried Mackerel | Salad | ฿195 | crop (p.13) | IMPLEMENT_LATER |
| F14 | ชุดขนมจีนเขียวหวานไก่ (Emporium) | Rice Noodles with Green Curry with Chicken (set with boiled egg, pork cracklings, vegetables) | Set meal | ฿225 (Emporium 2025) | crop (Emporium p.14) | DEFER (branch-specific set) |

### Prices
OFFICIAL_BUT_CONTEXT_DEPENDENT: branch-specific, plus 10% service charge. **Recommendation: withhold price**, or include only with note "One Nimman (Chiang Mai) menu 2026, before 10% service charge". Do not present it as a chain-wide price.

### Nutrition
NO_OFFICIAL_NUTRITION. "No MSG" and "organic" are marketing statements, not nutrition.

### Images
PARTIAL_EXACT_DISH_ASSETS: many single-dish photos inside image-only PDFs at 1358×1890 per page. They are good crop sources. The PDF URL is the stable `cropOf`. Crops would be `bundled`. Also check whether the same photo appears in a Bangkok branch PDF, so the image is not tied only to Chiang Mai.

### Readiness
**F1–F3 implement first.** Their servingNote and nutrition note should name the source menu (One Nimman 2026) and state that availability varies by branch.

---

## 12. Ponn / ป้อน

### Official ecosystem
- Brand: **ป้อน – Ponn Café**, a Bangkok mall chain (Terminal 21 4F, MBK G, Q House Lumpini G, Fashion Island and others, per OpenRice/Wongnai, Tier C). Story per Tier C: a mother–daughter founding; the name means "to feed good things to loved ones".
- Only official channel found: Facebook `facebook.com/ponncafe`. Its public link-preview metadata reads "ป้อน – Ponn Café | Bangkok", about 15,668 followers, and the motto "ฉันจะป้อนสิ่งดีๆให้กับคนที่ฉันรัก". No website, LINE OA or menu PDF was found.
- **Name collisions:** "Pon's Thai Cuisine" (Asheville, USA) and "Ponn Cafe" in Pattaya (relationship unknown).

### Logo
OFFICIAL_BUT_TECHNICALLY_UNSUITABLE. The Facebook avatar `scontent.fbkk11-1.fna.fbcdn.net/v/t39.30808-1/735044054_…jpg?…oe=6AC3A840` is signed and **expires** (the `oe=` parameter). It is not hotlink-safe, consistent with 37A's finding.

### Menu / price / nutrition / images
UNSUITABLE · MARKETPLACE_ONLY · NO_OFFICIAL_NUTRITION · SOCIAL_ONLY.

### Candidate items (Tier C)
Crispy grouper with fish sauce, orange curry with quail eggs and prawns, crab and pork omelette with salted egg, fried pork with fish sauce and basil, Pad Thai with shrimp, stir-fried mixed mushrooms with basil on rice (vegetarian). **All MARKETPLACE_ONLY → DEFER.** Most are shared Thai plates in any case.

### Readiness
**DEFER the restaurant.** It would fill the "central Thai everyday" gap, but only with owner-supplied official menu evidence and a stable logo.

---

## 13. VT Namnueng / VT แหนมเนือง

### Official ecosystem
- `https://vtnamnuengonline.com/` (WordPress/WooCommerce), titled "VT Namnueng – วีที แหนมเนือง ตั้งใจจะส่งมอบสิ่งดีๆ ให้กับทุกคน". It links LINE `lin.ee/Xnt3KrE` → `page.line.me/926ruxqk` (**"VT Namnueng Official | LINE Official Account"**). The link runs one way, from site to LINE. No reverse link from Facebook/LINE to the site was confirmable.
- `https://www.vtnamnueng.net/` (menu-grid page indexed by search) presents a **self-signed / untrusted certificate**. It was not bypassed. Production cannot hotlink from it, and its content could not be verified.
- Facebook `facebook.com/VTNamnuengCommunity` ("วีที แหนมเนือง"), read via metadata only. Brand origin: Udon Thani family business (Tier C).
- The WooCommerce Store API (`/wp-json/wc/store/v1/products`, 34 products) is a **take-home / souvenir catalogue** ("good-to-go" category). Examples: "แหนมเนืองสำหรับเดินทาง พร้อมผัก" (5-stick box ฿220 / 10-stick box ฿320, keeps 16–24 h unrefrigerated), "กุ้งพันอ้อย" (3 sticks ฿150 / 5 sticks ฿250), Vietnamese bread ฿55, sausages, and dried noodles. Shelf-life notes confirm these are retail products, not the dine-in menu.

### Logo
| Asset | Format | Size | Background | Assessment |
|---|---|---|---|---|
| `https://vtnamnuengonline.com/wp-content/uploads/2019/07/cropped-LOGO_VT01-300x300.png` | PNG | 300×300 | Transparent | **VERIFIED_OFFICIAL_LOGO**: green roundel, "vt แหนมเนือง". Ideal for a tile. |
| `…/2023/12/LOGO_VT01.png` | PNG | 1253×1253 | Transparent | same mark, larger |
| LINE OA avatar `profile.line-scdn.net/0h_LqS8iz5AGNMKh76iSp_NHBvDg47BAYrNBhIV2srDAFlThA8c0oYVzkpDFVoT0E3dE0YAz55VgRh/preview` | JPEG | 200×200 | Opaque | Tier B fallback |

The site's identity is moderately strong: brand-named domain, active 2026 products, and a link to the "VT Namnueng Official" LINE OA. Treat the logo as ready, and record the one-way-link caveat.

### Menu source
**WEAK** for restaurant meals. Dine-in prices from search snippets (namnueng set L/M/S ฿320/270/220; Banh Beo ฿70, etc.) trace to the unverifiable vtnamnueng.net or to Wongnai.

### Shared-dish semantics (§12)
Namnueng is a DIY wrap set: grilled pork sausage, rice paper, a large vegetable/herb basket, and sauce, sold by stick count or size, and typically shared. A per-person nutrition value would require a **defined portion**, e.g. "5 sticks + 5 sheets + vegetables + 2 tbsp sauce". No official source defines one.

### Candidate items
Namnueng set (L/M/S), namnueng travel box (5/10 sticks), shrimp on sugarcane (3/5 sticks), Banh Beo, Khao Piak Sen (dine-in). **All CONFIGURATION_REQUIRED or MARKETPLACE_ONLY → DEFER.**

### Readiness
Logo ready. **DEFER items** to a shared-dish batch that defines portion policy. VT would be GoodFood's first Vietnamese restaurant, which is high diversity value once modelled.

---

## 14. Cross-restaurant candidate matrix

Each candidate has exactly one **primary readiness class** (§8 of the brief) and one **portfolio tier** (§§21–23). Counting rules: G22 counts as 2 soups, G23 as its 4 named sandwiches, and the G24 wraps, G25 pastas, G26 brunch and Sizzler S11 beef-variant groups as 1 candidate each. "READY" combines IMPLEMENT_READY, READY_WITH_ESTIMATED_NUTRITION and READY_NO_IMAGE (only G7 is READY_NO_IMAGE).

| Restaurant | Candidates | READY | CONFIG_REQUIRED | AMBIGUOUS | MARKETPLACE_ONLY | DEFER (class) | Tier: First / Later / Defer |
|---|---|---|---|---|---|---|---|
| getfresh | 30 | 16 (G1–G14, G22×2) | 7 (G15–G21) | 0 | 0 | 7 (G23×4, G24, G25, G26) | 7 / 14 / 9 |
| Sizzler | 16 | 10 (S1–S10) | 0 | 0 | 0 | 6 (S11–S16) | 4 / 6 / 6 |
| Ginger Farm | 14 | 8 (F1–F6, F9, F13) | 3 (F7, F8, F10) | 0 | 0 | 3 (F11, F12, F14) | 3 / 6 / 5 |
| VT Namnueng | 5 | 0 | 3 | 0 | 2 | 0 | 0 / 0 / 5 |
| Ohkajhu | 6 | 0 | 0 | 0 | 6 | 0 | 0 / 0 / 6 |
| Subway | 6 | 0 | 0 | 0 | 6 | 0 | 0 / 0 / 6 |
| Eat Am Are | 6 | 0 | 0 | 0 | 6 (brand-name ambiguity noted at restaurant level) | 0 | 0 / 0 / 6 |
| Ponn | 6 | 0 | 0 | 0 | 6 | 0 | 0 / 0 / 6 |
| Farmfactory | 8 | 0 | 0 | 0 | 0 | 8 (identity: parked domain) | 0 / 0 / 8 |
| **Total** | **97** | **34** | **13** | **0** | **26** | **24** | **14 / 26 / 57** |

Being READY does not mean an item goes first. Twenty READY candidates sit in IMPLEMENT_LATER for redundancy or priority reasons. Two CONFIGURATION_REQUIRED salads (G19, G21) and all CONFIGURATION_REQUIRED Ginger Farm/VT dishes except F7 are tiered DEFER.

---

## 15. Logo readiness matrix

| Restaurant | Classification | Recommended asset | Format / size | Tier | Production treatment |
|---|---|---|---|---|---|
| getfresh | VERIFIED_OFFICIAL_BRANDMARK | LINE OA avatar (petal mark) | JPEG 200×200 | B (linked from site) | hotlink as-is; wordmark PNG as alternate |
| Sizzler | VERIFIED_OFFICIAL_LOGO | `sizzler.co.th/img/global/logo-sizzler-footer_2x.png` | PNG 510×222, alpha | A | hotlink as-is |
| Ginger Farm | VERIFIED_OFFICIAL_LOGO | Squarespace `GFKlogo.png` | WebP/PNG 1600², alpha | A | hotlink; may append `?format=500w` |
| VT Namnueng | VERIFIED_OFFICIAL_LOGO | `cropped-LOGO_VT01-300x300.png` | PNG 300², alpha | A (own shop) | hotlink as-is |
| Subway | VERIFIED_OFFICIAL_BRANDMARK | `subway.co.th/contents/images/subway_icon.png` | PNG 1200×1551, alpha | A | hotlink as-is (SVG wordmark too wide) |
| Ohkajhu | VERIFIED (LINE) / OFFICIAL_BUT_TECHNICALLY_UNSUITABLE (OKJ WebP) | LINE OA avatar | JPEG 200×200 | B (linked from okjgroup.com) | hotlink LINE; never the black-cornered WebP |
| Ponn | OFFICIAL_BUT_TECHNICALLY_UNSUITABLE | — | fbcdn signed/expiring | B | none |
| Eat Am Are | NO_SAFE_LOGO_FOUND | — | — | — | none |
| Farmfactory | NO_SAFE_LOGO_FOUND | — | — | — | none |

LINE CDN avatars are content-addressed: a brand avatar change orphans the URL, and the existing initials fallback covers that case. No candidate has an SVG except Subway's wordmark. No conversion is required for any recommended asset.

---

## 16. Image readiness matrix

| Restaurant | Ecosystem | Usable for IMPLEMENT_FIRST | Notes |
|---|---|---|---|
| getfresh | STRONG_EXACT_DISH_ASSETS | G1–G5 VERIFIED_STANDALONE; G6 VARIANT (withhold or disclose); G7 ambiguous (withhold) | transparent PNGs, `max-age=31536000`, unsigned; `official-remote` hotlink |
| Sizzler | COMPOSITE_MENU_ONLY | S1–S4 VERIFIED_CROP_CANDIDATE | panels about 1250 px wide; exclude price boxes and overlay text; the plate shows a specific side, so disclose it |
| Ginger Farm | PARTIAL_EXACT_DISH_ASSETS (in PDFs) | F1–F3 VERIFIED_CROP_CANDIDATE | 1358×1890 page renders; F1/F2 sit on a clean two-photo page; F3 sits beside the pork-neck photo |
| VT Namnueng | PARTIAL (retail packs) | n/a | shop photos show take-home packs, not dine-in plates |
| Subway / Ohkajhu / Ponn / Eat Am Are / Farmfactory | SOCIAL_ONLY / MARKETPLACE_ONLY / NO_USEFUL_ASSETS | n/a | — |

Images are optional. Every IMPLEMENT_FIRST item is valid without one.

---

## 17. Price availability matrix

| Restaurant | Class | Context | Recommendation |
|---|---|---|---|
| getfresh | OFFICIAL_BUT_CONTEXT_DEPENDENT | undated website; channel unstated; S/L for salads | include single-price items with a note; leave sized items unpriced (or note both sizes) |
| Sizzler | OFFICIAL_BUT_CONTEXT_DEPENDENT | regular vs member; dine-in; VAT incl.; +฿20 takeaway box; sheet 2025-03 | **withhold** pending recency; if used, regular price only, with note |
| Ginger Farm | OFFICIAL_BUT_CONTEXT_DEPENDENT | branch-specific; +10% service charge | **withhold**, or note branch and service charge |
| VT Namnueng | OFFICIAL_BUT_CONTEXT_DEPENDENT (retail packs only) | stick-count / size | n/a (deferred) |
| Subway, Ohkajhu, Eat Am Are, Ponn, Farmfactory | MARKETPLACE_ONLY | — | omit |

---

## 18. Nutrition provenance matrix

| Restaurant | Availability | Per-candidate provenance |
|---|---|---|
| All nine | **NO_OFFICIAL_NUTRITION** | IMPLEMENT_FIRST items: **CURATED_ESTIMATE_REQUIRED** (`confidence: 'estimated'`, with a note citing the official composition source) |
| getfresh | none; only diet labels | estimates are well-grounded in official ingredient lists |
| Sizzler | none | estimate the main plate only; weights given for S2 (170 g) and S4 (150 g) |
| Ginger Farm | none | single-bowl estimates (F1, F2) are practical; F3 excludes rice |
| VT, shared curries/platters | none | NOT_PRACTICAL_TO_ESTIMATE_YET until a portion is defined |

No third-party nutrition was found for any of these Thai brands that would serve as a useful secondary lead. Overseas Subway data is explicitly excluded.

---

## 19. Configuration / modeling issues

1. **Missing categories.** Sandwich, wrap, burger, pasta and breakfast have no `MenuCategory`. This blocks Subway entirely, getfresh G23–G26, and Sizzler S14–S15. It is an owner decision whether to add categories or keep them out of scope. Do not force them into "Set meal" or "Salad".
2. **Sized items (S/L).** getfresh salads and Ohkajhu steaks are sized. Smallest truthful model: one record per size, **or** one record for one stated size, with the other size in `customizationNotes`. Never mix the nutrition of one size with the price of another.
3. **Side choice plus salad bar** (Sizzler; Eat Am Are if it returns). Use main-only nutrition, `mealContext: configurable`, and a servingNote. No schema change.
4. **Add-ons** (getfresh "+ Grilled Chicken ฿30", "+฿20 konjac"). Put them in `customizationNotes`. The base record excludes them.
5. **Branch variance** (Ginger Farm). Record the source branch/menu in the nutrition note and servingNote. Avoid chain-wide price claims.
6. **Shared dishes and platters** (Ginger Farm curries, VT namnueng). A portion-definition policy is needed before any estimate.
7. **Customizable sandwiches** (Subway). Model C (representative build) only after an official Thai menu exists.
8. **Identity hygiene** (getfresh). Never derive identity from slug or filename. Pin each record to the item's WordPress post ID (e.g. G1 = post 3674) in the research note.

---

## 20. Portfolio diversity analysis

Incremental value of each restaurant:
- **getfresh**: healthy fast-casual with **Thai "clean" rice plates** (new), **non-Japanese grain bowls** (Korean, Mexican), a **vegan main** and a **fish main**. Its salads are redundant with Jones'/Salad Factory, so only representative items go first.
- **Sizzler**: adds **fish steaks** and a known **salad-bar meal model** to the steak cluster. Beef and chicken steaks partly duplicate Santa Fe' and Steak & More, hence a deliberately small first set (2 fish, 1 chicken, 1 beef).
- **Ginger Farm**: **Northern Thai**, entirely new. Khao soi and nam ngiao are iconic single-bowl dishes.
- **VT Namnueng** (later): **Vietnamese**, entirely new, but needs shared-dish modelling.
- **Subway** (later): the **sandwich/customization** use case, blocked by category and sources.
- **Ponn** (later): **central Thai everyday family dishes**, blocked by sources.
- **Ohkajhu, Farmfactory, Eat Am Are**: mostly **redundant** (salads, value steaks) even if sources improve.

Redundant clusters avoided in IMPLEMENT_FIRST: getfresh's salad set (only representatives later); beef steak variants (S9, S11); khao soi variants (F4); Isan-flavoured grills (G9, F6).

---

## 21. IMPLEMENT_FIRST shortlist (14 items, 3 restaurants)

| ID | Restaurant | Item | Category | Why it adds coverage |
|---|---|---|---|---|
| G1 | getfresh | Clean Khao Man Gai | Rice & noodles | Thai classic in a lighter "clean" build; exact image; new everyday-Thai coverage |
| G2 | getfresh | Clean Kaprao Gai | Rice & noodles | Thailand's most-ordered rice plate, health-leaning version |
| G3 | getfresh | Vegan Mushroom Kaprao | Rice & noodles | Vegan main (scarce in the catalog); official price ฿189 |
| G4 | getfresh | Korean Pork Bulgogi Bowl | Rice & noodles | New cuisine (Korean); bowl format |
| G5 | getfresh | Chicken Burrito Bowl | Rice & noodles | New cuisine (Mexican); bowl format |
| G6 | getfresh | Atlantic Salmon Steak | Grilled/BBQ | Fish-forward high-protein main; image withheld (variant) unless disclosed |
| G7 | getfresh | Minestrone | Soup | Light vegan soup; ฿129; no image (ambiguous photo) |
| S1 | Sizzler | Hibachi Chicken Steak | Grilled/BBQ | Chicken main with the salad-bar/side model |
| S2 | Sizzler | Nordic Style Sous Vide Salmon Steak (170 g) | Grilled/BBQ | Fish steak with an official weight |
| S3 | Sizzler | Sea Bass Steak with Seafood Mayo Sauce | Grilled/BBQ | Second fish option; white fish |
| S4 | Sizzler | Sizzling Beef Loin Steak (150 g) | Grilled/BBQ | One representative beef steak with an official weight |
| F1 | Ginger Farm | Khao Soi Gai (ข้าวซอยไก่) | Rice & noodles | Iconic Northern Thai single bowl |
| F2 | Ginger Farm | Khanom Jeen Nam Ngiao (brown rice noodle) | Rice & noodles | Second Northern noodle with a distinct profile |
| F3 | Ginger Farm | Herb-marinated Grilled Chicken with Jaew Dip | Grilled/BBQ | Northern grilled protein; servingNote must exclude rice |

---

## 22. IMPLEMENT_LATER shortlist (26)

- **getfresh (9):** G8 Clean Salmon Tom Yum Fried Rice; G9 Larb Chicken Steak; G10 Piri Piri Chicken Steak; G11 Black Pepper Chicken Breast; G12 Pork Chop; G13 Beef Burrito Bowl; G14 Tokyo Bowl; G22 Tomato & Basil; G22 Japanese Pumpkin soup.
- **getfresh sized salads, after size policy (5):** G15 Grilled Chicken Caesar, G16 Mexican Chop Job, G17 The Greek, G18 Roasted Japanese Pumpkin, G20 The Vegan Harvest. *(G19 Cobb and G21 Salmon Yuzu deferred as redundant/unpriced.)*
- **Sizzler (6):** S5 Thai Style Jaew Chicken; S6 Spicy Chicken; S7 Hot & Spicy BBQ Chicken; S8 Teriyaki Saba; S9 Ribeye 250 g; S10 Southwest Chicken.
- **Ginger Farm (6):** F4 Khao Soi Beef; F5 NZ Ribeye 200 g; F6 Grilled Pork Neck; F9 Northern Mango Salad; F13 Spicy Brown Rice Noodle Salad with Mackerel; F7 Hang Lay Curry (after shared-portion policy).

## 23. DEFER list (57)

- **Restaurants deferred entirely (37):** Subway (6), Ohkajhu (6), Eat Am Are (6), Ponn (6), Farmfactory (8), VT Namnueng (5). Reasons: no first-party menu, identity problems, or shared-dish modelling.
- **getfresh (9):** G19 Cobb, G21 Salmon Yuzu; G23 paninis/melts (4 named); G24 wraps; G25 pastas; G26 brunch. Reasons: category gaps, name collisions, redundancy.
- **Sizzler (6):** S11 (beef variants), S12 combination, S13 Fish & Chips, S14 pesto spaghetti, S15 Beyond Burger (category; 28 branches only), S16 salad bar.
- **Ginger Farm (5):** F8 Jackfruit soup, F10 Green Curry (protein choice), F11 Chiang Mai Platter, F12 Crispy Pork Belly, F14 Emporium khanom-jeen set.

---

## 24. Proposed implementation batches

| Batch | Scope | Why grouped | Restaurants | Items | Logos | Images (potential) |
|---|---|---|---|---|---|---|
| **40B** | getfresh G1–G7 + Ginger Farm F1–F3 | Current schema only; single-serve; strong Tier-A identity; estimates from official composition | +2 | +10 | +2 | 5 getfresh hotlinks (G1–G5); GFK crops optional (3) |
| **40C** | Sizzler S1–S4 | One coherent pattern (`mealContext: configurable` + main-only nutrition); price policy decision; bundled crops | +1 | +4 | +1 | up to 4 bundled crops |
| **40D** *(decision first)* | Owner decisions: (a) sandwich/wrap/burger/pasta categories; (b) sized-item policy | Unblocks getfresh salads/melts, Sizzler burger/pasta, eventual Subway | 0 | 0 (enables ~10–15 later) | 0 | 0 |
| **40E** *(later)* | Shared-dish portion policy, then VT Namnueng + Ginger Farm curries | High-risk semantics kept apart from simple batches | +1 (VT) | ~3–6 | +1 | TBD |
| **Re-research** | Subway (on site relaunch), Ponn, Ohkajhu, Farmfactory, Eat Am Are | Needs new first-party evidence | — | — | — | — |

These are planning numbers, not targets.

---

## 25. Expected catalog impact (IMPLEMENT_FIRST = 40B + 40C)

| Metric | Now | After 40B | After 40B + 40C |
|---|---|---|---|
| Restaurants | 13 | 15 | **16** |
| Logos | 13/13 | 15/15 | **16/16** |
| Menu items | 84 | 94 | **98** |
| Menu images (conservative: getfresh hotlinks only) | 45 (53.6%) | 50 (53.2%) | 50 (51.0%) |
| Menu images (if all crops ship) | — | 53 | 57 (58.2%) |
| Official nutrition | 0 | 0 | 0 (all new items `estimated`) |
| Categories touched | — | Rice & noodles +7, Grilled/BBQ +2, Soup +1 | Grilled/BBQ +4 more |

The image share may fall slightly. That is acceptable: restaurant breadth matters more than image completeness.

---

## 26. Open questions (owner)

1. **Categories:** add Sandwich/Wrap, Burger and Pasta to `MenuCategory`, or keep those formats out of scope? This decides Subway and much of getfresh.
2. **Price policy for dated or branch-specific official prices:** accept Sizzler's 2025-03 regular price and Ginger Farm's One Nimman price with explanatory notes, or withhold? (Recommended: withhold.)
3. **Variant images:** may G6's photo (extra pumpkin side) ship with a disclosure, or should only exact images ship? (Recommended: exact only.)
4. **Sized salads:** one record per size, or one stated size per record?
5. **Ginger Farm:** is a Chiang Mai-sourced item acceptable for a Bangkok-heavy audience if the note names the branch? Should availability be re-checked against the Bangkok PDFs first?
6. **Thai names for getfresh:** the site has none. Approve conservative GoodFood Thai translations clearly marked as non-official (e.g. "ข้าวมันไก่ (คลีน)")?
7. **Hotlink reuse rights** for the getfresh PNGs and the Sizzler/GFK crop sources are not established by public availability. Same caveat as earlier slices.

---

## 27. Source references (accessed 2026-10-01)

| Restaurant | Source (type) | URL | Establishes |
|---|---|---|---|
| Subway | Global redirect (A) | https://www.subway.com/en-TH → https://subway.co.th/ | subway.co.th is the official Thai property |
| Subway | Official site (A) | https://www.subway.co.th/ | "Under Construction"; social links; no menu |
| Subway | Logo asset (A) | https://www.subway.co.th/contents/images/subway_icon.png | PNG 1200×1551 alpha; brandmark |
| Subway | Logo asset (A) | https://www.subway.co.th/contents/images/subway_logo.svg | SVG wordmark (5:1) |
| Subway | Newsroom (A, global) | https://newsroom.subway.com/2022-02-16-Subway-Announces-Master-Franchisee-Partnership-with-About-Passion-Co-Ltd-To-Expand-Its-Presence-in-Thailand | operator: About Passion Co., Ltd. |
| Subway | Tier C | https://salehere.co.th/subway/promotions/update-price-subway ; https://thaiest.com/thai-food/reviews/subway-in-thailand | discovery only (prices, Tom Yum) |
| Eat Am Are | Tier C | https://eat-am-are.menufyy.com/menu ; https://thaimenu.org/eat-am-are-menu/ ; https://www.facebook.com/p/Eat-Am-Are-Good-Steak-Center-One-100063895874853/ | no first-party menu; branch-level social only |
| Ohkajhu | Redirect (A) | https://www.ohkajhu.com/ → https://www.okjgroup.com/en/home ; /en/menu → 404 | brand site replaced by the investor site |
| Ohkajhu | Operator page (A) | https://www.okjgroup.com/en/business-and-brands/ohkajhu | operator, product scope, social/LINE links |
| Ohkajhu | Logo (A, unsuitable) | https://www.okjgroup.com/storage/business-and-brands/ohkajhu/ohkaju-logo.webp | WebP 800², no alpha, black corners |
| Ohkajhu | Logo (B) | https://page.line.me/pcb3808y ; https://profile.line-scdn.net/0hx8sUpogKJxdOLDgrdPVYQHJpKXo5AiFfNkpsdGN4eyRgHTMVJR9oIT8sfSJnTGlGJRg8dzwqfCJj/preview | JPEG 200², recommended logo |
| getfresh | Menu (A) | https://getfresh.co.th/menu/ | menu, soups ฿129 |
| getfresh | REST (A) | https://getfresh.co.th/wp-json/wp/v2/menu?per_page=100 ; …/category_menu ; …/diet | 106 records: names, composition, categories, diet tags, slug reuse |
| getfresh | Item pages (A) | https://getfresh.co.th/menu/clean-khao-man-gai/ ; …/clean-kaprao-gai/ ; …/vegan-mushroom-kaprao/ (฿189) ; …/spicy-pork-bulgogi-bowl/ (฿289) ; …/chicken-burrito-bowl/ (฿399) ; …/salmon-steak/ (฿499) ; …/minestrone/ (฿129) ; …/grilled-chicken-caesar-s/ (S ฿189 / L ฿269) | item identity and prices |
| getfresh | Images (A) | https://getfresh.co.th/wp-content/uploads/2025/02/Clean-Khao-Man-Gai.png (1000², verified) ; …/2022/03/Clean-Kra-Pao-Gai-1024x1024.png ; …/2022/03/Vegan-Mushroom-Kaprao-1024x1024.png ; …/2024/04/Korean-Bulgogi-Bowl-Pork.png ; …/2025/02/Chicken-Burrito-Bowl.png ; …/2024/04/Salmon-Steak.png (variant) ; …/2022/03/Minestrone_V2.png (ambiguous) | standalone images, stable, `max-age=31536000` |
| getfresh | Logo (A/B) | https://getfresh.co.th/wp-content/uploads/2026/06/getfresh-Logo-RGB_2026_6.png ; https://page.line.me/700dmltt | wordmark 4245×1041; LINE square mark |
| Farmfactory | Parked domain (evidence of loss) | https://www.farmfactoryworld.com/menu/menu-farmfactory | Sedo parking page; stale indexed menu |
| Farmfactory | Tier C | https://www.bkmagazine.com/restaurants/bangkok-restaurant-reviews/farmfactory/ ; https://www.wearecp.com/farmfactory-17112021/ ; https://www.dataforthai.com/company/0105561169512/ | conflicting ownership signals; historical menu |
| Sizzler | About (A) | https://www.sizzler.co.th/en/about | SLRT Ltd., Minor Food Group |
| Sizzler | Menu sheets (A) | https://www.sizzler.co.th/storage/upload/202503/1743362575_by%20category-04.jpg (chicken) ; …/1743362521_by%20category-02.jpg (seafood) ; …/1743362494_by%20category-01.jpg (beef) ; …/1743399061_S__5390698.jpg (Beyond Burger) | names, Thai names, weights, prices, side rule, fine print; 1250×7083 crop sources |
| Sizzler | Logo (A) | https://www.sizzler.co.th/img/global/logo-sizzler-footer_2x.png | PNG 510×222 alpha |
| Ginger Farm | Menu hub (A) | https://www.gingerfarmkitchen.com/menu-2 | branch PDF list |
| Ginger Farm | Menu PDF (A) | https://www.gingerfarmkitchen.com/s/One-Nimman-Menu-2026.pdf | F1–F13 names, prices, 10% SC; crop source (pp. 5, 11, 13, 19, 27, 31) |
| Ginger Farm | Menu PDF (A) | https://www.gingerfarmkitchen.com/s/Emporium-Menu-2025_1.pdf | branch variance (khanom-jeen sets, noodles) |
| Ginger Farm | Story (A) | https://www.gingerfarmkitchen.com/our-story | farm-to-city origin; branches |
| Ginger Farm | Logo (A) | https://images.squarespace-cdn.com/content/v1/5dcac1b37b75f56509c0a367/1577359518038-F21TWZ1SK7S55O0AKTQI/GFKlogo.png | 1600² transparent |
| Ponn | Social (B) | https://www.facebook.com/ponncafe/ | brand name, followers; expiring avatar URL |
| Ponn | Tier C | https://www.wongnai.com/chains/ponn ; https://th.openrice.com/en/bangkok/r-ponn-cafe-khlong-toei-nuea-thai-food-general-rice-made-to-order-r1347190 | branches, dish leads |
| VT Namnueng | Shop (A) | https://vtnamnuengonline.com/ ; https://vtnamnuengonline.com/wp-json/wc/store/v1/products | retail catalogue, stick-count prices |
| VT Namnueng | LINE (B) | https://lin.ee/Xnt3KrE → https://page.line.me/926ruxqk | "VT Namnueng Official" |
| VT Namnueng | Logo (A) | https://vtnamnuengonline.com/wp-content/uploads/2019/07/cropped-LOGO_VT01-300x300.png | PNG 300² alpha |
| VT Namnueng | Menu domain (unverifiable) | https://www.vtnamnueng.net/menu-grid.html | self-signed certificate; not used |

---

## 28. Research quality check

- **Thai operation verified?** Yes for Subway (global redirect), Sizzler (SLRT/Minor), getfresh (Thai company footer), Ginger Farm, Ohkajhu (OKJ PCL) and VT. No for Farmfactory (parked), and only weakly for Eat Am Are and Ponn.
- **Current vs historical confused?** Farmfactory's indexed menu was identified as historical. Sizzler's sheet date is flagged. getfresh slug reuse is flagged. Internet Archive was offline, so no historical claims are made.
- **Marketplace used as official?** No. Every Tier C datum is labelled, and no Tier C item is in IMPLEMENT_FIRST.
- **Set vs à-la-carte confused?** Sizzler's main is separated from side + salad bar. The Ginger Farm platter and Emporium sets are deferred. VT retail packs are not treated as dine-in.
- **Configurable item flattened?** Sized salads, Subway and side choices are not flattened. The getfresh add-ons are excluded from the base.
- **Nutrition attached to the wrong variant?** None proposed. Estimates must follow the stated composition. Image variants (G6, G9) are flagged.
- **Marketing treated as nutrition?** No. "Organic", "clean", "high-protein", "keto" and "no MSG" are recorded as labels only.
- **"From" pricing treated as fixed?** No. Subway "from" prices are excluded, and the Sizzler member/regular split is preserved.
- **Image showing a different dish selected?** The Minestrone image is ambiguous, so it is withheld. The Frittata filename mismatch is flagged.
- **Near-duplicates over-selected?** One beef steak, one khao soi, no salad duplicates.
- **Symmetric restaurant counts forced?** No: 7 / 4 / 3 / 0 × 6.

*Temporary research files (HTML, JSON, PDFs, extracted page images, crops, helper scripts) lived in the session scratchpad outside the repository and were deleted at completion. No assets were added to the repository.*
