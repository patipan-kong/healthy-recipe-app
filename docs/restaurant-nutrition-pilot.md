# Restaurant Nutrition Pilot — Research Ledger

Slice 5 production pilot dataset (3 brands, retrieved/checked **2026-09-14**),
expanded by the Slice 11 "Batch 1" dataset expansion (5 more brands, retrieved/
checked **2026-09-15**). This document records how every value in
`src/restaurants.ts`'s production `restaurants`/`restaurantMenuItems` arrays
was sourced, so the data stays auditable and reviewable over time.

Do not surface these URLs or this document in the app UI — it is for
maintainability only.

## Ootoya (id: `ootoya-thailand`)

Ootoya Thailand's official menu site (ootoya.co.th/menu.php) lists real dish
names but publishes no nutrition data at all. Ootoya Japan (same chain, same
brand) is tracked by the third-party aggregator kalori.jp, which republishes
per-item kcal/protein/carbs/fat presumably sourced from Ootoya Japan's own
published data. Where a kalori.jp item name matched a real Ootoya Thailand
menu item closely, that data was reused as a same-chain proxy (`curated`).
Where no matching kalori.jp item was found, values are a standard-dish
estimate (`estimated`) — Ootoya Thailand does not publish nutrition, so no
`official`/`label` tier was reachable for this brand in this pilot.

| Menu item | Thai menu name confirmed via | Nutrition source | Confidence |
|---|---|---|---|
| Charcoal-Grilled Mackerel | ootoya.co.th/menu.php ("ปลาซาบะย่างถ่าน") | kalori.jp "Grilled Mackerel (Single Item)": 540 kcal, 29.9g protein, 8.3g carbs, 46.3g fat | curated |
| Charcoal-Grilled Shima Hokke | ootoya.co.th/menu.php ("ปลาชิมาฮอกเกะย่างถ่าน") | kalori.jp "Grilled Shima Hokke (Single Item)": 282 kcal, 39.5g protein, 7.9g carbs, 12g fat | curated |
| Charcoal-Grilled Chicken with Moromi Sauce | ootoya.co.th/menu.php ("ไก่ย่างถ่านซอสโมโรมิ") | kalori.jp "Steamed Chicken with Moromi Soy Sauce & Green Onion Sauce (A La Carte)": 336 kcal, 35.1g protein, 21.5g carbs, 13.6g fat | curated |
| Oyakodon (Chicken & Egg Rice Bowl) | ootoya.co.th/menu.php ("ข้าวหน้าไก่โอยาโกะ") | No item-specific data found (kalori.jp fetch did not surface an oyakodon entry). Team estimate for a standard oyakodon: 610 kcal, 27g protein, 78g carbs, 18g fat | estimated |
| Charcoal-Grilled Tonteki Pork Chop Set | ootoya.co.th/menu.php ("พอร์คช็อปย่างถ่านสไตล์ทงเทกิ", listed under the site's "Grilled/BBQ Sets" grouping — served with rice/soup) | No item-specific data found. Team estimate for a full teishoku-style tonteki set (protein + rice + miso soup): 750 kcal, 40g protein, 70g carbs, 36g fat | estimated |
| Grilled Salmon Rice Bowl | ootoya.co.th/menu.php ("ข้าวหน้าปลาแซลมอนย่าง") | No item-specific data found. Team estimate for a standard salmon donburi: 640 kcal, 30g protein, 80g carbs, 20g fat | estimated |

Assumption: kalori.jp figures for Ootoya Japan items are assumed to
reasonably approximate the same-named Ootoya Thailand dish, since it is the
same restaurant brand and format (Japanese teishoku/home cooking). This is
disclosed in-app via each item's `nutritionSource.note`. Sodium/fiber were
not available from kalori.jp or elsewhere and were left unset rather than
guessed.

Sources:
- https://www.ootoya.co.th/menu.php (real Thai menu item names)
- https://kalori.jp/en/shops/ootoya/products/ (Ootoya Japan nutrition aggregation)

## Salad Factory (id: `salad-factory-thailand`)

Salad Factory's official site (saladfactorythailand.com) lists real,
specific salad names on its "Full Shop" menu. Each item shows a number
labeled "Cal" — but on inspection, every checked item's "Cal" figure was
numerically identical to its price in Thai baht (e.g. an item priced 757฿
also showed "757 Cal"; this held across every item checked, both with and
without matching price). This is not plausible as independent nutrition
data — it indicates the site's calorie field is not a reliable, verified
calorie value (likely a CMS default/placeholder mirroring price). **This
figure was therefore not used.**

The site's separate "D.I.Y. Salad" calculator does show independently
varying per-component calorie values (e.g. dressings: Balsamic 83 kcal,
Caesar 293 kcal, Cream 402 kcal; toppings: grilled chicken breast 5pcs
112 kcal, boiled egg 50 kcal) which look like real, distinct figures, but
composing full dishes from these component values plus estimating
protein/carbs/fat was judged out of scope for a small pilot slice.

Given no full-dish nutrition source could be verified, every Salad Factory
item is `estimated`: the menu item **name** is real (confirmed on the
official site), but kcal/protein/carbs/fat are a team estimate based on
typical nutrition for the visible ingredients (a stated protein portion,
mixed greens/vegetables, and a dressing) at a standard restaurant-salad
serving size. Sodium/fiber were not estimated and are left unset.

| Menu item | Confirmed via | Confidence |
|---|---|---|
| Japanese-Style Grilled Chicken Breast Salad, Sesame Dressing | saladfactorythailand.com/en/menu/menu---full-shop-en | estimated |
| Quinoa Salad with Grilled Chicken Breast, Spicy Holy Basil | same | estimated |
| Kale Salad with Chicken Breast, Truffle Dressing | same | estimated |
| Rocket Salad with Grilled Skirt Steak, Balsamic | same | estimated |
| Spicy Pork Tenderloin Salad | same | estimated |
| Salmon Sashimi Salad, Shoyu-Wasabi Dressing | same | estimated |

Sources:
- https://www.saladfactorythailand.com/en/menu/menu---full-shop-en (real menu item names; "Cal" field found unreliable, not used)
- https://www.saladfactorythailand.com/menu/salad-diy (component-level calorie data; considered but not used for composed dishes in this pilot)

## 7-Eleven Thailand (id: `seven-eleven-thailand`)

7-Eleven Thailand sells house/partner-brand packaged ready meals (Ezygo, Ezy
Choice, Chef Cares, Happy Chef) whose nutrition panels appear on the
physical package. We did not have first-party access to photograph these
labels, so values were taken from a secondary fitness-focused blog
(MyFitMate) that explicitly attributes each figure to a specific package's
nutrition panel/label photo (its own sourcing notes per item: "current
retailer image", "photographed label", "Thai nutrition panel"). This is
treated as `label`-tier data with the secondary-sourcing caveat disclosed in
`nutritionSource.note`, per the research-rule priority order (package labels
rank above generic secondary estimates).

Every item's source listed kcal, protein, carbs, and sodium, but not fat.
Fat was back-calculated arithmetically from the labeled kcal minus protein
and carb calories (standard 4 kcal/g protein, 4 kcal/g carbs, 9 kcal/g fat),
and this derivation is disclosed in the note rather than presented as a
directly labeled figure.

| Menu item | Label-reported kcal / protein / carbs / sodium | Derived fat | Confidence |
|---|---|---|---|
| Ezy Choice Chicken Sukiyaki Rice | 270 kcal, 19g protein, 30g carbs, 1220mg sodium | 8g (derived) | label |
| Ezygo Garlic Pork with Fried Egg and Rice | 390 kcal, 22g protein, 54g carbs, 520mg sodium | 10g (derived) | label |
| Chef Cares Green Curry with Chicken Breast and Jasmine Rice | 360 kcal, 19g protein, 56g carbs, 640mg sodium | 7g (derived) | label |
| Happy Chef Pork Bulgogi Rice | 290 kcal, 14g protein, 54g carbs, 670mg sodium | 2g (derived) | label |
| Ezygo Korean Chicken Fried Rice | 440 kcal, 17g protein, 57g carbs, 890mg sodium | 16g (derived) | label |
| Sticky Rice with Dried Pork and Jaew Sauce | 380 kcal, 13g protein, 63g carbs, 1030mg sodium | 8g (derived) | label |

Sources:
- https://myfitmate.app/blog/7-eleven-ready-meals-thailand-fitness (per-item package label figures)
- https://thairanked.com/en/rankings/healthy-7-eleven-thailand-high-protein-snacks-post-workout/ (cross-reference, not directly used for final values)

## Items considered and dropped

- Several Salad Factory "out of stock" items (Caesar Salad, Honey Roasted
  Chicken Salad, etc.) were excluded because their calorie field showed 0,
  reinforcing that the site's per-dish "Cal" field is not trustworthy
  inventory-independent data.
- Several 7-Eleven items from the MyFitMate source (CP Pork Leg with Egg and
  Rice, Chef Cares Mixed Seafood and Fried Fish Basil, Chef Cares Chicken
  Tikka Masala, Ezygo Clam Spaghetti) were excluded because the source could
  not read a full protein value off the package image — including them
  would have required fabricating a required field.
- 7-Eleven sandwiches, boiled eggs, and yogurt-type items (suggested as
  examples in the task) were not included: no credible per-item label data
  for a specific real Thai 7-Eleven SKU in these categories was found within
  the time available for this pilot. The six rice-based ready meals above
  already exercise the model's filters and Pick-for-me flow with real,
  traceable data, so the pilot did not stretch to cover every suggested
  category.

---

# Batch 1 Expansion (Slice 11) — checked 2026-09-15

Five more real Thailand restaurant brands, researched via web search/fetch
(automated fetch + manual verification, not a scraping pipeline). Priority
order followed: official site → official nutrition → package label → same-
chain other-market nutrition → reputable secondary source → curated database
→ composition estimate. Every item below was rejected from `official`/`label`
tier unless a genuinely first-party or package-label source was found — see
each restaurant's notes for why.

## Jones' Salad (id: `jones-salad-thailand`)

Official site (jonessalad.com) has a real, text-based menu and — unusually —
a dedicated nutrition page at jonessalad.com/menu/nutrition-fact/ that
publishes per-item calories (as two figures: without dressing / with 2 tbsp
dressing). The page carries the brand's own disclaimer, translated: *"Data is
calorie calculations from each dish's ingredients, cross-checked against
[software name unclear from the page] and various websites only. May contain
errors and cannot be used as an authoritative reference."* Because the source
itself disclaims accuracy, and because it publishes calories only (no
protein/carbs/fat for savory items — only the separate Smoothie section gets
those), every item here is `estimated`: the "with dressing" calorie figure is
taken from the brand's own page, and protein/carbs/fat are a team estimate
calibrated to match that figure. The "without dressing" figure is surfaced
in-app as a `customizationNotes` entry. No suspicious price-equals-calorie
pattern was found (values vary independently of price).

| Menu item | Thai name confirmed via | Calorie figure used (with dressing) | Confidence |
|---|---|---|---|
| Grilled Chicken Breast Salad, Roasted Sesame Dressing | jonessalad.com/menu/nutrition-fact/ ("สลัดอกไก่งาขาวคั่ว") | 385 kcal (262 without dressing) | estimated |
| Grilled Salmon Salad | same ("สลัดแซลมอนย่าง") | 420 kcal (317 without) | estimated |
| Caesar Chicken Salad | same ("สลัดซีซาร์ไก่") | 372 kcal (213 without) | estimated |
| Chicken Larb & Crispy Rice Salad | same ("สลัดลาบอกไก่และข้าวพอง") | 345 kcal (228 without) | estimated |
| Caribbean Chicken Breast Steak | same ("สเต็กอกไก่แคริบเบียน") | 446 kcal (394 without sauce) | estimated |
| Honey Lemon Basa Fish Steak | same ("สเต็กปลาบาซา ฮันนี่เลมอน") | 413 kcal (357 without sauce) | estimated |
| Mushroom Soup | same ("ซุปเห็ด") | 172 kcal (single figure, no variant) | estimated |

Not included: the "smoothie" section (protein+carbs published, but sugary
drinks are out of scope per the slice's healthy-eating framing); Boiled Egg
Salad and the Grilled Salmon Dipping Rice item (kept the selection to 7 for
diversity without redundancy).

Sources:
- https://www.jonessalad.com/menu/ (real menu names/categories)
- https://www.jonessalad.com/menu/nutrition-fact/ (per-item calorie table + brand's own accuracy disclaimer)

## Fuji Japanese Restaurant (id: `fuji-japanese-restaurant-thailand`)

**Correction to a research assumption**: Fuji is *not* part of Central
Restaurants Group (CRG), despite an initial web-search summary suggesting
that. Fuji is operated by **Tana Group International Co., Ltd.**, a
Thailand-founded, family-owned brand (opened 1983 at CentralPlaza Lardprao —
"Central" is the mall landlord, not an ownership link); CRG's actual
Japanese-brand portfolio (Yoshinoya, Ootoya, Chabuton, Pepper Lunch, etc.)
does not include Fuji. Source: https://www.tgi.co.th/our-business/fuji/?lang=en,
https://www.bangkokpost.com/business/1175893/guiding-fuji-to-peak-performance.

Official site (fuji.co.th/menu) has real, text-based Thai/English menu item
names. **No nutrition data exists anywhere for this brand** — not on the
official site, and no credible secondary source was found either. Because
Fuji is a Thailand-originated brand (not a Thailand outpost of an existing
Japan chain of the same name), no legitimate cross-market proxy is available
either — unlike Ootoya, there is no genuine "Fuji Japan" to borrow figures
from. Every item is therefore `estimated` from ingredients/typical serving
size. One raw-fish item (Salmon Sashimi) and Beef/Pork Shabu Shabu were
considered and dropped: sashimi doesn't fit any existing `MenuCategory`, and
adding a new category for one restaurant's single item was judged
unwarranted (not a recurring gap across the five new chains — see main app
code comments on category fit).

| Menu item | Thai name confirmed via | Confidence |
|---|---|---|
| Salmon Shioyaki with Brown Rice Set | fuji.co.th/menu?lang=en ("ชุดปลาแซลมอนย่างเกลือข้าวกล้องธัญพืช") | estimated |
| Grilled Salmon Shioyaki | same ("ปลาแซลมอนย่างเกลือ") | estimated |
| Salmon Tataki Salad | same ("ยำปลาแซลมอน") | estimated |
| Kinoko (Mushroom) Salad | same ("สลัดเห็ด") | estimated |
| Chicken Teriyaki | same ("ไก่ย่างซีอิ๊ว") | estimated |
| Chirashi Sushi Rice Bowl Set | same ("ชุดข้าวหน้าปลาดิบรวม") | estimated |

Sources:
- https://www.fuji.co.th/menu?lang=en (real Thai/English menu item names — confirmed no nutrition data present)
- https://www.tgi.co.th/our-business/fuji/?lang=en (operator identity: Tana Group International, not CRG)

## MK Restaurants (id: `mk-restaurants-thailand`)

Official site (mkrestaurant.com) publishes a numeric "CALORIES" figure on
every menu item tile, to two decimal places (e.g. 303.22), on both the Thai
and English site — confirmed present in the raw page source, not an
extraction artifact. **No protein/carbs/fat/sodium is published anywhere for
any item** — calories only. The decimal precision suggests a standardized
recipe-database calculation rather than lab testing, and MK discloses no
methodology on the page. No suspicious price-equals-calorie pattern was
found (values vary independently and with realistic variance, e.g. 96 kcal
for a small pork plate up to 420+ kcal for a large vegetable set). Because
protein/carbs/fat are unavailable, every item's overall confidence is
`estimated` (the required macro fields are team estimates), even though
kcal itself is taken directly from MK's own published figure — this nuance
is disclosed in each item's `nutritionSource.note`. Rounded from MK's raw
decimal figures to whole kcal for display consistency with the rest of the
dataset (exact source figures recorded below).

| Menu item | Thai name (source) | MK's published kcal (exact) | Confidence |
|---|---|---|---|
| Health Vegetable Set (Small) | ชุดผักเพื่อสุขภาพ เล็ก | 212.62 | estimated |
| Special Vegetable Set | ชุดผักพิเศษ | 90.40 | estimated |
| Special Kurobuta Set | ชุดคุโรบูตะสเปเชียล | 303.22 | estimated |
| Special Kurobuta (Single Plate) | คุโรบูตะสเปเชียล | 96 (whole number on source) | estimated |
| Premium Suki Set (Single Pot) | ชุดสุกี้พรีเมียมหม้อเดี่ยว | 382.40 | estimated |
| Seafood Suki (Prepared, Broth Style) | สุกี้ทะเล (น้ำ) | 238.93 | estimated |
| Pork Shabu | หมูชาบู | 193.37 | estimated |

Not included (redundant near-duplicates of items above, dropped for
diversity rather than padding): Health Vegetable Set (Large) — same dish as
Small, bigger; Mixed Suki Set and Regular Mixed Suki (broth-style) — close
overlap with Premium Suki Set / Seafood Suki already selected.

Sources:
- https://www.mkrestaurant.com/en/mk-menu/suki/ and https://www.mkrestaurant.com/th/mk-menu/suki (official EN/TH menu + calories, cross-verified matching between language versions for items with EN labels)
- https://www.mkrestaurant.com/th/mk-menu/single-dish (Thai-only single-dish items; EN names for these are our own translation, not official copy)
- https://www.mkrestaurant.com/en/history (brand/operator background)

## Sukiya Thailand (id: `sukiya-thailand`)

Thailand site (sukiya.co.th) menu is delivered as photographed menu-board
images, not text — item names/prices below were read directly from those
images (https://www.sukiya.co.th/th/menu/img/menu/*.jpg), not parsed as
text, so they carry a higher transcription-error risk than a text-scraped
source; spot-check before further edits. **No Thailand-specific nutrition
data exists.** Sukiya Japan (operated by Zensho Co., Ltd.) publishes a
genuine official, methodology-stated, lab-tested nutrition PDF, last updated
2026-09-08: https://images.zensho.co.jp/materials/sukiya/allergen/nutrition.pdf
(states "検査機関で分析した数値および「日本食品標準成分表」に基づき算出" — values analyzed
by a testing laboratory and calculated per the Japan Standard Food
Composition Tables). Where a Thailand menu item has a genuine name/concept
match in Japan's table, that data is used as a `curated` cross-market proxy
— explicitly **not** `official`, since it is not first-party Thai data.
Japan uses six size tiers (mini/regular/large/mega/etc.); Thailand uses
S/M/L/LL. No confirmed gram-for-gram mapping exists between any Thai size
and any Japan size — Thailand's "M" is mapped to Japan's "regular" (並盛) as
the closest reasonable assumption, disclosed per-item. Sodium is derived
from Japan's published salt-equivalent (g) via the standard food-labelling
conversion sodium(mg) ≈ salt(g) × 1000 ÷ 2.5.

| Menu item (Thailand, image-read) | Japan proxy used | Confidence |
|---|---|---|
| Gyudon Beef Rice Bowl (M) — ข้าวหน้าเนื้อ | 牛丼 regular: 695 kcal / 21.7g protein / 99.8g carbs / 23.4g fat / 2.4g salt | curated |
| Gyudon with Bonito Flakes & Okra (M) — ข้าวหน้าเนื้อโอคุระ | かつぶしオクラ牛丼 regular: 716 kcal / 23.5g / 103.5g / 23.5g / 3.3g salt | curated |
| Japanese Curry Rice (M) — ข้าวแกงกะหรี่ | plain カレー regular: 653 kcal / 12.8g / 115.2g / 15.7g / 3.6g salt | curated |
| Beef Plate, No Rice (M) — เนื้อสุคิยะ | 牛皿 regular: 297 kcal / 15.0g / 9.9g / 22.0g / 2.4g salt | curated |
| Salad — สลัด | サラダ（ドレッシング除く）: 28 kcal / 1.5g / 5.9g / 0.3g / 0.1g salt (dressing excluded) | curated |
| Miso Soup — ซุปมิโสะ | みそ汁: 38 kcal / 2.4g / 4.3g / 1.4g / 2.2g salt | curated |

Two Thailand-exclusive items with no Japan equivalent (Gyudon with Mala,
Sesame Oil Water Spinach) and two side items with no clean `MenuCategory`
fit (Onsen Egg, Chicken Karaage) were considered and dropped rather than
forcing a taxonomy change or a from-scratch estimate for a single-market
item — 6 well-sourced curated items were judged preferable to 8 with weaker
grounding.

Sources:
- https://www.sukiya.co.th/th/menu/grandmenu.html → per-category menu images (Thailand item names/prices, image-read)
- https://images.zensho.co.jp/materials/sukiya/allergen/nutrition.pdf (Sukiya Japan official nutrition table, dated 2026-09-08)

## Santa Fe' Steak (id: `santa-fe-steak-thailand`)

Official site (santafesteak.com) menu is an image carousel with no
extractable text, so item-level Thai names could not be confirmed directly
from the official source. Thai names below are confirmed via a third-party
Thai food-listing blog (menuinthai.com) whose prices line up with other
independent sources, cross-checked by downloading raw HTML and grepping for
the literal Thai text (not an AI paraphrase). Two names were corrected from
the initial English-only research pass: "ปลากระพง" literally means seabass,
not grouper (the original assumption), so the item is named "Seabass Steak,"
not "Grouper Steak"; "สเต๊กโคขุน" means "fattened-cattle beef steak" (a Thai
grading term), not literally "ribeye" — an item that does say "ribeye"
(ริบอาย) exists on a newer price list at a different price point (359฿, out
of this item's 209-263฿ range), so the two are not conflated here; this item
is named "Premium Fattened Beef Steak," not "Ribeye." **No nutrition data
exists anywhere for this brand** — official site, secondary blogs, and forum
threads (including an unanswered Pantip question asking exactly this) all
came up empty. Every item is `estimated` from typical steakhouse portion
composition.

| Menu item | Thai name (source) | Confidence |
|---|---|---|
| Grilled Chicken Steak, Pepper Sauce | สเต๊กไก่ ซอสเปปเปอร์ | estimated |
| Salmon Steak | แซลมอนสเต๊ก | estimated |
| Dory Fish Steak | สเต๊กปลาดอรี่ | estimated |
| Seabass Steak | สเต๊กปลากระพง | estimated |
| Kurobuta Pork Chop | หมูคุโรบุตะพอร์คช้อป | estimated |
| Chicken Steak (2 Pieces), Jaew Sauce | สเต๊กไก่ 2 ชิ้น ซอสแจ่ว | estimated |
| Premium Fattened Beef Steak, Imported | สเต๊กโคขุน เนื้อนำเข้า | estimated |

Sources:
- https://www.menuinthai.com/santa-fe-steak-price/ (Thai-script item names, cross-checked via raw HTML)
- https://www.santafesteak.com/ (official brand identity, operator: FAB FOOD HOLDING Co., Ltd.; menu itself is images only, not text-extractable)
