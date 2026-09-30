# Independent Restaurant Menu Image Research

- Researcher: Claude Opus 5.5 (independent second pass)
- Date: 2026-09-30
- Baseline: `main` @ `11a8b379fc9b7360c416d9f9a3ebf03e8c77c29a` ("feat: complete restaurant brand identities")
- Scope: this is research only. No production data, code, tests or assets were changed, and no image was bundled or linked into the app.
- Independence: I did not open, search, or use `docs/restaurant-asset-coverage-audit-37a.md` or any other earlier restaurant asset/image audit document. The only project inputs were the production source (`src/restaurants.ts`, `src/types.ts`) and public web sources.

---

## Method

1. **Deriving the baseline.** I bundled `src/restaurants.ts` into a throwaway ESM file in the session scratchpad using the repo's own `rolldown`. I then listed every `restaurantMenuItems` entry without a `menuImage`. See [Production baseline](#production-baseline).
2. **Research order.** I worked restaurant by restaurant. For each brand I first mapped its official digital ecosystem: website, operator/parent, ordering storefront, LINE OA, Facebook, Linktree, and flipbooks. I then checked every image-less item against that ecosystem.
3. **Deep discovery on official properties.** Where a site exposed them, I read the underlying data directly rather than relying on the rendered pages alone:
   - public WordPress REST media APIs: `jonessalad.com` (4,350 media items), `fuji.co.th` (547), `nittayakaiyang.com` (541)
   - server-rendered Angular state (`ng-state` JSON) on Salad Factory's own ordering storefront
   - AnyFlip `config.js` for ThongSmith's official flipbook
   - Next.js `__NEXT_DATA__` on LINE OA pages and Linktree
   - Open Graph metadata on official Facebook posts, fetched with the public `facebookexternalhit` crawler user-agent
4. **Searches.** I searched in Thai and English, using the exact Thai catalog name, the official Thai name, the English name, restaurant + dish, and operator + brand.
5. **Checking every serious candidate.** I downloaded each one to the scratchpad (deleted afterwards) and **viewed it**. I then compared it to the catalog name, price, serving note, meal context and, where it helped, the catalog nutrition. Nutrition turned out to be decisive for two items; see 7-Eleven and ThongSmith.
6. **Technical checks.** I used `curl` to check HTTP status, content type, byte size, redirects, `Cache-Control` / `Access-Control-Allow-Origin`, and behaviour under a foreign `Referer` (to simulate hotlinking). I read pixel dimensions from the file headers. **No browser was launched.** Browser decoding was inferred from format only (standard RGB PNG/JPEG/WebP). The one exception is noted: Sukiya's menu *sheets* are CMYK JPEGs.
7. **Self-challenge.** I tried to falsify each VERIFIED_STANDALONE candidate (set vs à la carte, preparation, variant, provenance, association) before accepting it. Three strong-looking candidates were downgraded as a result.

## Source policy

- **Accepted as primary:**
  - Tier A: restaurant or operator website, official static/CDN asset, official ordering storefront whose merchant of record is the brand's operating company.
  - Tier B: brand-controlled social accounts, link hub, or hosted flipbook, with the reason for control documented.
- **Discovery clues only:** Wongnai, TripAdvisor, Lemon8, Pantip, food blogs, press articles, OpenFoodFacts, marketplace listings, and web-search summaries (which were wrong more than once).
- Marketplace images were **never** promoted to VERIFIED.
- An official image counts only when the image itself is associated with the dish, through a caption, column/card binding, filename, or a label printed on the sheet. Being "nearby on the page" is not enough.

## Production baseline

I confirmed these figures directly from the production data:

| Metric | Expected | Found |
|---|---|---|
| Restaurants | 13 | 13 |
| Restaurant logos | 13 | 13 |
| Menu items (unique IDs) | 84 | 84 (84 unique) |
| Menu items with `menuImage` | 22 | 22 |
| Image-less menu items | 62 | **62** (no discrepancy) |

Image-less items by restaurant:

| Restaurant | Items |
|---|---|
| Ootoya | 3 |
| Salad Factory | 6 |
| 7-Eleven | 4 |
| Jones' Salad | 7 |
| Fuji | 2 |
| Sukiya | 6 |
| Santa Fe' | 7 |
| Nittaya | 1 |
| Zaab Eli | 7 |
| Somtam Nua | 8 |
| ThongSmith | 5 |
| The Steak & More | 6 |
| MK | 0 |

## Official source ecosystems by restaurant

| Restaurant | Ecosystem found | Notes |
|---|---|---|
| **Ootoya** (CRG) | `ootoya.co.th` `menu.php` / `menu-details.php?id=N`, with `upload_file/menu/<Category>/<Thai name>-big.png` | The detail page binds the image to the Thai, Japanese and English names and gives *จานเดียว* (single) vs *เซ็ต* (set) prices. |
| **Salad Factory** (CRG / Green Food Factory) | ⚠️ **`saladfactorythailand.com` now serves an unrelated online-gambling site** (title "…สล็อตเว็บตรง…"); its old `/product/…` URLs 404 inside the gambling theme. The LINE OA (`page.line.me/pac6513g`) still links to that dead domain. **The official storefront found is `saladfactory.foodie24x7.co`** (reached via redirect from `saladfactory.foodie-delivery.com`). | The storefront's `BRAND_INFO_ENV` names the merchant as **GREEN FOOD FACTORY CO., LTD.**, tax ID 0105562174668, 306 Central Silom Tower (CRG's HQ address). Green Food Factory is the Salad Factory operator in which CRG bought 51% (Bangkok Post; Positioning Magazine). This is a single-brand, direct-order white-label storefront, **not a marketplace**. The product records carry `DishNameTH`/`DishNameEN`/`Price`/`ProductImage`. Images are served from `eworksdiag294.blob.core.windows.net/foodie/<uuid>.jpg` (1000×1000 original) and ImageBoss (`img.imageboss.me/foodie24x7/…`). |
| **7-Eleven** (CP ALL) | `allonline.7eleven.co.th` product pages, `media.allonline.7eleven.co.th/pdzoom|pdmain/<itemId>-NN-….jpg`; official Facebook `7ElevenThailand` | Products get delisted (the bulgogi page now returns 404). |
| **Jones' Salad** | `jonessalad.com` (WordPress, footer "บริษัท โจนส์สลัด จำกัด"); menu pages are image sheets; **Catering → Healthy Meal** page has per-dish PNG cards (`<img>` + `<h3>` Thai + `<h4>` English + price in the same column) | The public media API exposes the full library, including 2019-era per-dish assets. |
| **Fuji** | `fuji.co.th/menu/` cards (`data-id`, Thai + English, SET / À LA CARTE prices), WP media API | Live cards show the **‑SET** image. Matching à la carte PNGs (same upload batch, 2026‑06‑22) sit in the media library. |
| **Sukiya** (Zensho) | `sukiya.co.th/th/menu/grandmenu.html`: category thumbnails `/th/upload/top/img_*.jpg` and full menu sheets `/th/menu/img/menu/menu_*.jpg` | Sheets are CMYK JPEG. |
| **Santa Fe'** (FAB FOOD HOLDING Co., Ltd.) | `santafesteak.com` (footer names the operator; links to official FB, IG, LINE `lin.ee/F5PZPv96`, TikTok, X); menu = `/img/menuslide/AW Santa Fe_NewMenu_NN….jpg` sheets (2728×1972) | The `/frontends/menu/` page has no per-item assets. |
| **Nittaya Kai Yang** | `nittayakaiyang.com` (WordPress, custom post types `food_menus`, `go_menus`) | — |
| **Zaab Eli** | LINE OA `page.line.me/ntw0665w` (links `facebook.com/zaabeli`), Instagram `@zaabeli` | No website. ⚠️ `zaabelifoodtruck.com` is an **unrelated US food truck** and was rejected. LINE and Facebook post content is not publicly exposed. |
| **Somtam Nua** (CRG) | CRG brand page (logo only) links `facebook.com/Somtamnuathailand` and `instagram.com/somtamnua` | ⚠️ `somtamnua.com` is a **parked domain** (redirects to `/lander`). CRG's 1312 delivery endpoints are gone. Facebook timeline content is login-gated. |
| **ThongSmith** | `linktr.ee/thongsmith` → **AnyFlip bookcase `anyflip.com/bookcase/jpekz`**, book "MENU THONGSMITH" (`online.anyflip.com/iugnb/rchh/`, 16 pages, described "MENU THONGSMITH 24 04 2569") | Page images are at `files/large/<md5>.webp` (1980×2800); they are publicly accessible, no Referer required. |
| **The Steak & More** (Minor Food) | `minorfood.com` franchise and brand pages, tiles on `cdn.minorfood.com/uploaded/...` (500×500, **uncaptioned**); Facebook `TheSteakandMore` (id 61571163564316) | The Minor Food pages do not link that Facebook page, so its control was not cross-verified. |

## Results summary

| Classification | Count |
|---|---|
| VERIFIED_STANDALONE | **12** |
| VERIFIED_CROP_CANDIDATE | **12** |
| VERIFIED_CURRENT_REFORMULATION | **1** |
| VERIFIED_VARIANT | **5** |
| CONTENT_VERIFIED_BUT_URL_UNSUITABLE | **1** |
| MARKETPLACE_ONLY | **2** |
| WEAK_CANDIDATE | **7** |
| NOT_FOUND | **22** |
| **Total** | **62** |

**SAFE_STANDALONE_CANDIDATES: 11**, listed in [Potential implementation candidates](#potential-implementation-candidates).

## VERIFIED_STANDALONE

| # | Menu ID | Evidence | Caveat |
|---|---|---|---|
| 1 | `ootoya-oyakodon` | `menu-details.php?id=72`: ข้าวหน้าไก่โอยาโกะ / 炭火焼き鶏の親子重 / "Charcoal grilled chicken and egg with rice", **จานเดียว ฿199** (catalog ฿199, single bowl). The big PNG is the page's own detail image. | The Ootoya version uses charcoal-grilled chicken in a lacquer box. Nori (listed as served with it), a pickle and a tea cup are visible as props. No miso soup or rice bowl is shown, so it does not look like the set. |
| 2 | `salad-factory-grilled-chicken-sesame` | Storefront record MS13: TH "สลัดอกไก่ย่างงาญี่ปุ่น", EN "Japanese-style Grilled Chicken Breast Salad with Sesame Dressing", **฿155** (catalog ฿155). Image shows sliced grilled breast, sesame dressing, nori. | — |
| 3 | `salad-factory-quinoa-chicken-basil` | Record MS25: EN "Quinoa Salad with Grilled Chicken Breast and Spicy Holy Basil". Image shows quinoa stir-fried with crispy holy basil and chillies, chicken, greens, grilled vegetables. | Storefront price **฿215**, catalog ฿195. This is a price difference, not a dish difference (storefront prices can differ). |
| 4 | `salad-factory-kale-chicken-truffle` | Record MS26: EN "Kale salad with Grilled Chicken Breast and Truffle Dressing", **฿235** (catalog ฿235). Image shows curly kale, sliced chicken, truffle dressing cup. | The catalog's Thai name uses "คะน้า"; the official Thai name is "เคล" (kale). The English names agree. |
| 5 | `salad-factory-rocket-skirt-steak` | Record RK10: EN "Rocket Salad with Grilled Skirt Steak and Balsamic", ฿315 (no catalog price). Image shows rocket, sliced skirt steak, balsamic jug. | — |
| 6 | `jones-chicken-sesame-salad` | Healthy Meal catering card: `<h3>สลัดอกไก่งาขาวคั่ว</h3>`, M ฿109 / L ฿129. Image shows sliced chicken breast plus a roasted-sesame dressing cup. | This is the Salad Box (take-home/catering) listing with M/L sizes; the image does not state a size. |
| 7 | `jones-grilled-salmon-salad` | Same page: `<h3>สลัดแซลมอนย่าง</h3><h4>(Grilled Salmon Salad)</h4><p>369.-</p>`, which is **฿369, identical to the catalog**. | — |
| 8 | `jones-caesar-chicken-salad` | Same page: สลัดซีซาร์ไก่ (Chicken Caesar Salad), M ฿119 / L ฿139. Image shows chicken, croutons, parmesan, Caesar dressing. | M/L sizes, as #6. |
| 9 | `jones-chicken-larb-crispy-rice-salad` | Same page: "สลัดลาบอกไก่ และข้าวพอง (Larb Chicken Breast Salad)", M ฿129 / L ฿149. Image shows larb chicken, crispy rice, larb-mayo dressing. | M/L sizes, as #6. |
| 10 | `jones-mushroom-soup` | Media library asset `2019/06/Asset-2_ซุปเห็ด.png` (500×500): plain cream mushroom soup in a white bowl with parsley. Identical presentation to "ซุปเห็ด 59.- Mushroom Soup" (catalog ฿59) on the **current** official soup sheet `2026/07/Soup-Menu-AW.jpg`. | The asset is from 2019 and **not referenced on any live page**; its association is by filename plus visual match to the current sheet. **Excluded from SAFE** for that reason. |
| 11 | `fuji-chicken-teriyaki` | `fuji.co.th/menu/` card `data-id=5171`: "CHICKEN TERIYAKI ไก่ย่างซีอิ๊ว 210.- (SET) / **170.- (A LA CARTE)**" (catalog ฿170). Asset `2026/06/CHICKEN-TERIYAKI.png` (à la carte sibling of the card's `CHICKEN-TERIYAKI-SET.png`, same upload batch). Image shows sliced teriyaki chicken, lettuce, pumpkin. No rice or soup. | The live card displays the SET image; the à la carte PNG is associated by filename and batch. |
| 12 | `sukiya-gyudon-regular` | Grand-menu category thumbnail `/th/upload/top/img_gyudon.jpg` (350×350), labelled "ข้าวหน้าเนื้อ". It is the same photo used as the hero of the menu sheet line "100 ข้าวหน้าเนื้อ Gyudon **M 89.-**" (catalog M ฿89). Plain gyudon, no toppings. | Size is not stated on the thumbnail. The canvas has white padding at the bottom. |

**Downgraded during self-challenge:**
- `fuji-salmon-shioyaki`: the official à la carte image shows **teriyaki glaze**.
- `ootoya-shima-hokke-grilled`: the image shows the **full teishoku set**, while the catalog item is à la carte.
- `seven-eleven-chicken-sukiyaki`: the official product is **glass noodles, not rice**.

## VERIFIED_CROP_CANDIDATE

The exact dish is clearly labelled inside an official sheet or collage. Nothing was cropped.

| Menu ID | Sheet | Evidence |
|---|---|---|
| `jones-caribbean-chicken-steak` | `jonessalad.com/wp-content/uploads/2026/08/Aug-18_Steak_Chicken-Breast.jpg` (1500×2495; also `2026/03/menu-2026_Steak_Chicken-Breast.jpg`) | Quadrant labelled "สเต๊กอกไก่ แคริบเบียน / Caribbean Chicken Breast Steak with Brown Sauce **199.-**" (catalog ฿199). Secondary: a 2019 standalone asset `Asset-1_สเต็กอกไก่แคริบเบียน.jpg` (920×920) shows an older plating (no spinach or croutons), so it is only a variant. |
| `sukiya-gyudon-okra-regular` | `sukiya.co.th/th/menu/img/menu/menu_gyudon.jpg` (1141×905, CMYK) | Tile "105 ข้าวหน้าเนื้อโอคุระ Gyudon with Bonito Flakes & Okra **M 119.-**" (catalog M ฿119). A small "ไข่ออนเซ็น 20.-" promo bubble overlaps the tile edge. |
| `sukiya-beef-plate-no-rice` | `.../menu_alacarte.jpg` (571×905, CMYK) | Large tile "800 เนื้อสุคิยะ Beef Plate **M 75.-**" (catalog ฿75). |
| `sukiya-salad` | `.../menu_curry.jpg` / `menu_gyudon.jpg` | The à la carte list has "812 สลัด Salad 45.-" as text only. The same side salad appears labelled as the "ชุดสลัด / Salad set" value-set tile and in the "604 … Salad Set" photo. Identity is by the set label, not a standalone tile. |
| `sukiya-miso-soup` | `.../menu_gyudon.jpg` / `menu_curry.jpg` | "819 ซุปมิโสะ Miso Soup 30.-" is text only. The bowl is shown in Recommended Set photos, with the callout "เปลี่ยนซุปมิโสะเป็นชาเขียวได้" pointing to it. Set 105 uses a *pork* miso soup (ชุปมิโสะหมู), so do not crop from that one. |
| `santa-fe-salmon-steak` | `santafesteak.com/img/menuslide/AW%20Santa%20Fe_NewMenu_09Fish_Normal_1753171936.jpg` (2728×1972) | Hero "สเต๊กแซลมอน Salmon Steak **329.-**" (catalog ฿329). Sides are configurable (catalog `mealContext: configurable`). |
| `santa-fe-dory-fish-steak` | same Fish sheet | "สเต๊กปลาดอรี่ย่าง 209.- Grilled Dory Fish Steak" (catalog ฿209). Do not confuse it with "…ซอสเห็ด 179.-" or "…เนยกระเทียม 209.-" on the same sheet. |
| `santa-fe-kurobuta-pork-chop` | `…_07Pork_Normal_1753171850.jpg` | Hero "สเต๊กคูโรบูตะพอร์คชอป ซอสพริกไทยดำ 279.-". Mushroom and Mexican sauce versions are also shown. The catalog item has no sauce and is `configurable`, so the sauce varies. |
| `thongsmith-wagyu-ribeye-boat-noodle` | AnyFlip p.7 `online.anyflip.com/iugnb/rchh/files/large/b79e70f66715b55e7b194b73ec6009f9.webp` (1980×2800) | "D10 น้ำตกวากิวริบอายทองสมิทธ์ 529 THB (wagyu ribeye, beef ball, braised shank, tendon)", pictured large. This matches the catalog "น้ำตกวากิวทองสมิทธ์ (ริบอาย)". D9 is ribeye only, so keep the two apart. |
| `thongsmith-kurobuta-pork-boat-noodle` | p.11 `…/files/large/73bd9be8ec7c33215a3f1d3b0cb60127.webp` | "E5 น้ำตกหมูคุโรบุตะ 229 THB, Sliced Kurobuta Pork", pictured. E6 and E7 are Kurobuta combinations, so E5 is the plain match. |
| `thongsmith-dry-rice-kurobuta-braised-pork` | p.15 `…/files/large/51b13b11230d8a9320db2447984fdeb9.webp` | "G8 ข้าวต้มแห้งหมูคุโรบูตะ หมูตุ๋น 259 THB, Rice topped with sliced Kurobuta pork and braised pork", pictured. ⚠️ The official price is **฿259**; the catalog price is ฿239. |
| `thongsmith-grilled-pork-meatballs` | p.2 `…/files/large/9adb672aa0e3015bafcb205c9abbb688.webp` | "A1 ลูกชิ้นหมูปิ้ง (3 ไม้) 119 THB, Grilled pork ball (3 skewers) with sweet chilli dip" (catalog ฿119), pictured with the dip. |

## VERIFIED_CURRENT_REFORMULATION

| Menu ID | Evidence | What changed |
|---|---|---|
| `seven-eleven-korean-chicken-fried-rice` | AllOnline `/p/…/328382/`: "อีซี่โก ข้าวผัดไก่เกาหลี 250g", brand EZYGO. Images `media.allonline.7eleven.co.th/pdzoom/713057-00-allonline-sm-NewOnlyat.jpg` (hero, 1110×1110) and `…/713057-01-allonline-sm.jpg` (packshot). | The page states "ข้าวผัดปรับสูตรใหม่ หอมกลิ่นเนยผัดกะทะร้อน พร้อม Topping เพิ่มปริมาณไข่" and "เปลี่ยนฉลากใหม่" (recipe reformulated with more egg, new label). The new pack label reads **460 kcal / 890 mg sodium**; the catalog has 440 kcal / 890 mg. The hero image caption oddly says "EZY TASTE Brand", while the packshot says EZYGO. The product is marked out of stock ("ขออภัยสินค้าหมด"). |

## VERIFIED_VARIANT

| Menu ID | Official image | Why it is not exact |
|---|---|---|
| `ootoya-shima-hokke-grilled` | `ootoya.co.th/upload_file/menu/Fish-Menu/ปลาชิมาฮอกเกะย่างถ่าน-big.png` (800×600), detail `menu-details.php?id=1` | The dish name and single price (฿399) match, but the photo is the full **teishoku set** (rice, miso, sides, chawanmushi). The catalog is à la carte with an add-on meal context. |
| `seven-eleven-chicken-sukiyaki` | AllOnline `/p/…/355384/` "อีซี่ ช้อยส์ Hสุกี้ไก่ขลุกขลิก 250 กรัม" (Chicken Sukiyaki with a Little Broth), `pdzoom/642775-00-meal-box-ezy-choice.jpg` (1110×1110) | The official product is **glass noodles, no rice**; the catalog name says "ข้าวหน้าไก่สุกี้ / … Rice". However, the pack label shows **sodium 1,220 mg per 250 g, exactly the catalog value**, and the catalog's 30 g carbs fit noodles. The catalog entry was probably built from this product with an incorrect "rice" name. **This is a catalog-data question for the owner.** |
| `fuji-salmon-shioyaki` | `fuji.co.th/wp-content/uploads/2026/06/SALMON-TERIYAKI-_-SHIOYAKI-768x768.png`, card 5135 "SALMON TERIYAKI / SHIOYAKI ปลาแซลมอนย่างซีอิ๊ว / ย่างเกลือ 330 set / **290 à la carte**" | The price matches, but the one official image depicts the **teriyaki** option (glossy soy glaze). Shioyaki is salt-grilled. |
| `sukiya-curry-rice-regular` | `/th/upload/top/img_curry.jpg` (700×700); sheet `menu_curry.jpg` | The official curry image is **curry topped with gyudon beef** ("600 Curry with Beef"). The catalog is plain curry ("609 ข้าวแกงกะหรี่ M 89.-"), which appears only as text. |
| `thongsmith-spicy-shredded-chicken-dry` | AnyFlip p.13 `…/files/large/149f53d9adcdaf5b0c5d7cf3e90ab16f.webp`, "F2 แซ่บแห้งไก่ฉีก 139 / 139, Chicken noodles with spicy sauce" | The pictured bowl **contains noodles**. The item is offered as noodles or no noodles (เกาเหลา), and the catalog's 18 g carbs and "Salad" category indicate the no-noodle version. |

## CONTENT_VERIFIED_BUT_URL_UNSUITABLE

| Menu ID | Evidence | Limitation |
|---|---|---|
| `seven-eleven-pork-bulgogi-rice` | Official **7-Eleven Thailand** Facebook post `facebook.com/7ElevenThailand/posts/1301293152024243`. Its OG description reads "#ของใหม่เซเว่น ข้าวหมูบูลโกกิ … ราคา 59 บาท". The OG image shows a pack printed "ข้าวหมูบูลโกกิ ตรา แฮปปี้เชฟ … 260 กรัม". | The image is a signed `scontent…fbcdn.net` URL with an `oe=` expiry, it is an in-hand packshot rather than a plated dish, and the AllOnline product page (`/p/…/365809/`) now returns **404**. |

## MARKETPLACE_ONLY

| Menu ID | Evidence | Why not verified |
|---|---|---|
| `zaab-eli-som-tam-salted-egg` | Wongnai / LINE MAN menu item "ตำไทยไข่เค็ม" (Zaab Eli ท่ามหาราช), photo `img.wongnai.com/p/_-x_/2018/10/02/e7caaa2118db403c84eccf1626845aa8.jpg` (**154×154**) | Uploader (merchant or user) is unknown, the photo dates from 2018, the listed price is ฿85 vs catalog ฿120, and it is tiny. |
| `zaab-eli-corn-salted-egg-som-tam` | Same source, "ตำข้าวโพดไข่เค็ม — Spicy sweet corn salad with salted egg", `img.wongnai.com/p/_-x_/2018/10/02/cc958850489f40479e9153cd6510f651.jpg` (800×800) | Same provenance and age concerns; price ฿89 vs catalog ฿120. |

## WEAK_CANDIDATE

| Menu ID | Candidate | Why it is weak |
|---|---|---|
| `salad-factory-spicy-pork-tenderloin` | Storefront: "Spicy Pork Tenderloin Salad with Seaweed Konjac and Wakame / ยำเส้นบุกหมูสันใน" ฿160, `eworksdiag294.blob.core.windows.net/foodie/dec32b14-c4f4-4e57-8b1a-248606fd8aae.jpg` | The English prefix matches the catalog exactly, but the official dish is a **konjac-noodle yum**, and the catalog's Thai name (สลัดสันในหมูรสแซ่บ) and composition do not mention konjac. It might be the same dish, but that cannot be shown. |
| `santa-fe-grilled-chicken-pepper-steak` | Combo sheet `…_14Combo189_Normal_OL_1753172165.jpg`: a plain "สเต๊กไก่ Chicken Steak" plate plus a "ซอสพริกไทยดำ Black Pepper Sauce" option | No official image of a pepper-sauce chicken steak exists on the current menu; it would only be a composite. |
| `santa-fe-chicken-steak-jaew` | Combo sheet: "สเต๊กไก่สามเกลอ และ สเต๊กไก่อวกาศ" (two chicken steaks) with a selectable "ซอสแจ่ว Thai Spicy Sauce". Chicken sheet: "สเต๊กไก่สามเกลอ ซอสแจ่ว 159.-" (one piece). | Neither is clearly "Chicken Steak (2 Pieces), Jaew Sauce". |
| `nittaya-tom-saep-grilled-chicken-soup` | Official `food_menus/ต้มโย้งไก่ย่าง`, asset `nittayakaiyang.com/wp-content/uploads/2023/04/ต้มโย้งไก่ย่าง-07.png` | The official menu has **ต้มโย้ง**ไก่ย่าง, not ต้มแซ่บไก่ย่าง. These are related spicy-sour Isan soups but have different names. The site search finds no ต้มแซ่บไก่ย่าง. |
| `steak-and-more-chicken-steak` | Minor Food tiles `cdn.minorfood.com/uploaded/brand/tile/175758016668c28b86973a1.jpg` (BBQ chicken + fried fish combo) and `…/175757414668c27402cbc90.jpg` | The tiles are **uncaptioned**, and they show combination plates. |
| `steak-and-more-pork-chop` | `cdn.minorfood.com/uploaded/brand/tile/175757448468c275541669b.jpg`: bone-in pork chop, salad, garlic bread, spicy side | Looks right but is uncaptioned, so dish identity rests on visual inference only. |
| `steak-and-more-yum-woon-sen` | `cdn.minorfood.com/uploaded/brand/tile/175757423068c2745661fb5.jpg`: glass-noodle salad | Uncaptioned, and another tile (`…/175757423068c2745640287.jpg`) shows the same salad as a **steak-set side**, so the à la carte association cannot be confirmed. |

## NOT_FOUND

22 items. Details are in the appendix.

- **Ootoya**
  - `ootoya-grilled-salmon-rice-bowl`: the only official salmon donburi is **raw zuke salmon on sushi rice** (id 79 / 62). Grilled salmon exists only as a teishoku.
- **Salad Factory**
  - `salad-factory-salmon-sashimi-shoyu`: it existed on the former official site (search index: "/product/salmon-sashimi-salad-with-japanese-shoyu-and-wasabi-dressing", ฿320). It is absent from the current storefront, the domain is hijacked, and Wayback returned HTTP 429 on both attempts.
- **7-Eleven**
  - `seven-eleven-sticky-rice-dried-pork`: only third-party reviews (Lemon8, Pantip) and OpenFoodFacts.
- **Jones' Salad**
  - `jones-honey-lemon-basa-steak`: named in the official nutrition-fact table (สเต็กปลาบาซา ฮันนี่เลมอน 357/413 kcal) but not on the current fish-steak sheet, and there is no media asset.
- **Santa Fe'**
  - `santa-fe-seabass-steak` and `santa-fe-premium-beef-steak`: not on the current official sheets; only third-party listings.
- **Zaab Eli (5)**: grilled chicken, fried chicken, grilled pork neck, larb moo, beef tendon soup.
- **Somtam Nua (8)**: all items.
- **The Steak & More**
  - squid-ink spaghetti with shrimp: only seen as a small side portion without shrimp.
  - Caesar salad and som tam: nothing on official properties.

## Technical URL findings

| Host | Status | Type | Cache / CORS | Hotlink (foreign Referer) | Notes |
|---|---|---|---|---|---|
| `www.ootoya.co.th/upload_file/…-big.png` | 200 | image/png, ~1.1 MB, 800×600 | no Cache-Control | OK | Heavy PNGs; Thai filenames must be percent-encoded. |
| `img.imageboss.me/foodie24x7/width/500/format:webp/<uuid>.jpg` | 200 | image/webp, 33–44 KB, 500 px | `public, max-age=31536000, immutable`, `ACAO: *` | OK | Third-party image CDN account belonging to the ordering platform. The best runtime option of all hosts. |
| `eworksdiag294.blob.core.windows.net/foodie/<uuid>.jpg` | 200 | image/jpeg, 0.2–0.8 MB, 1000×1000 | none | OK | Platform-vendor Azure blob (origin). |
| `www.jonessalad.com/wp-content/uploads/…` | 200 | PNG 400×410 (~330 KB), JPEG sheets 1500×2495 | none | OK | Thai filenames must be percent-encoded. |
| `www.fuji.co.th/wp-content/uploads/2026/06/…-768x768.png` | 200 | image/png ~1 MB | none | OK | 1040×1040 originals are about 1.9 MB. |
| `www.sukiya.co.th/th/upload/top/img_gyudon.jpg` | 200 | image/jpeg 73 KB, 350×350 RGB | none | OK | Menu sheets are **CMYK** JPEG. Modern browsers decode CMYK, but it is an edge case worth a visual check. |
| `santafesteak.com/img/menuslide/…` | 200 | JPEG ~4 MB, 2728×1972 | `max-age=604800` | OK | Filenames contain spaces and a timestamp, so they will change when the menu is updated. |
| `online.anyflip.com/iugnb/rchh/files/large/<md5>.webp` | 200 | WebP 1980×2800 | none | OK (no Referer needed) | `files/mobile/…` and `files/large/N.jpg` return **403**. Hash filenames change if the book is re-uploaded. |
| `media.allonline.7eleven.co.th/pdzoom/…` | 200 | JPEG 1110×1110 | — | OK | Products get delisted (the bulgogi page is now 404). |
| `scontent…fbcdn.net` (Facebook OG) | 200 at fetch time | JPEG | — | — | **Signed and expiring** (`oe=`, `oh=`): not suitable for runtime. |
| `img.wongnai.com/p/_-x_/…` | — | — | — | — | Marketplace; not assessed for runtime. |

**Not verified:** actual in-browser rendering. No browser was launched; decodability was inferred from format and header inspection.

## Reuse-right uncertainty

This is not a legal conclusion. Every candidate here is published by the brand or its operator for promoting its own menu. None of the sources publishes an explicit licence for third-party reuse. Specific observations:

- **Salad Factory:** the images live on an ordering-platform vendor's infrastructure (Foodie24x7 / ImageBoss / Azure), not on a brand domain. Provenance comes from the storefront's merchant record, but the host is a vendor, and hotlinking consumes the vendor's ImageBoss quota.
- **Jones' Salad, Santa Fe', ThongSmith** sheets carry "The pictures are for advertising purposes only" or similar.
- **AnyFlip-hosted ThongSmith pages:** the host is AnyFlip. Control is established via the official Linktree, not via a brand domain.
- **Wongnai / Facebook images:** platform terms apply in addition to brand rights.

## Potential implementation candidates

### SAFE_STANDALONE_CANDIDATES (11)

Each of these is VERIFIED_STANDALONE, with high confidence in both dish identity and provenance, a standalone image, a stable HTTP 200 remote URL that works with a foreign Referer, and no known meaningful variant mismatch.

| Menu ID | Direct URL | Dims |
|---|---|---|
| `ootoya-oyakodon` | `https://www.ootoya.co.th/upload_file/menu/Donburi-Menu/%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B9%84%E0%B8%81%E0%B9%88%E0%B9%82%E0%B8%AD%E0%B8%A2%E0%B8%B2%E0%B9%82%E0%B8%81%E0%B8%B0-big.png` | 800×600 |
| `salad-factory-grilled-chicken-sesame` | `https://img.imageboss.me/foodie24x7/width/500/format:webp/723305ef-3a77-4d9d-a603-e295dd72087d.jpg` | 500×500 (origin 1000×1000) |
| `salad-factory-quinoa-chicken-basil` | `https://img.imageboss.me/foodie24x7/width/500/format:webp/9f9aab2a-d4c5-4932-ab02-c89245cea8d6.jpg` | 500×500 |
| `salad-factory-kale-chicken-truffle` | `https://img.imageboss.me/foodie24x7/width/500/format:webp/6a1fa2fc-cef0-4df9-b57f-e52b5cf40aa4.jpg` | 500×500 |
| `salad-factory-rocket-skirt-steak` | `https://img.imageboss.me/foodie24x7/width/500/format:webp/27100880-a2c7-4731-9bdb-f7cfbcfce517.jpg` | 500×500 |
| `jones-chicken-sesame-salad` | `https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%87%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%84%E0%B8%B1%E0%B9%88%E0%B8%A7.png` | 400×410 |
| `jones-grilled-salmon-salad` | `https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B9%81%E0%B8%8B%E0%B8%A5%E0%B8%A1%E0%B8%AD%E0%B8%99%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87.png` | 400×410 |
| `jones-caesar-chicken-salad` | `https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%8B%E0%B8%B5%E0%B8%8B%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%84%E0%B8%81%E0%B9%88.png` | 400×410 |
| `jones-chicken-larb-crispy-rice-salad` | `https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%A5%E0%B8%B2%E0%B8%9A%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%9E%E0%B8%AD%E0%B8%87.png` | 400×410 |
| `fuji-chicken-teriyaki` | `https://www.fuji.co.th/wp-content/uploads/2026/06/CHICKEN-TERIYAKI-768x768.png` | 768×768 |
| `sukiya-gyudon-regular` | `https://www.sukiya.co.th/th/upload/top/img_gyudon.jpg` | 350×350 |

Residual notes for the owner:
- The quinoa storefront price is ฿215; the catalog price is ฿195.
- The Jones salads come from the catering Salad Box listing with M/L sizes.
- The Fuji à la carte image is associated by filename; the live card shows the set image.
- The Sukiya thumbnail is small and has bottom whitespace.
- Salad Factory's legacy domain is compromised. Nothing should ever be linked to `saladfactorythailand.com`, and any existing references to it deserve an audit.

### Secondary pools (not safe as-is)

- **12 crop candidates**: Sukiya (4), Santa Fe' (3), ThongSmith (4), Jones Caribbean (1). They need a crop decision, and ThongSmith's G8 has a price discrepancy.
- **`jones-mushroom-soup`**: a verified standalone image, but an orphaned 2019 asset.
- **5 variants and 1 reformulation**: owner decisions. In particular, the 7-Eleven sukiyaki item looks like a catalog *naming* error rather than an image problem.

---

## Appendix: all 62 image-less menu items

Tier key: **A** = official site/CDN/operator/brand storefront. **B** = brand-controlled social, link hub or flipbook. **M** = marketplace. **—** = none.

| # | Menu ID | Restaurant | Catalog dish (TH / EN) | Classification | Tier | Source page / post | Direct image URL | Dims | Exact-dish reasoning / caveat | Technical URL status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | ootoya-shima-hokke-grilled | ootoya-thailand / Ootoya | ปลาชิมาฮอกเกะย่างถ่าน / Charcoal-Grilled Shima Hokke | VERIFIED_VARIANT | A | https://www.ootoya.co.th/menu-details.php?id=1 | https://www.ootoya.co.th/upload_file/menu/Fish-Menu/%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B8%8A%E0%B8%B4%E0%B8%A1%E0%B8%B2%E0%B8%AE%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%81%E0%B8%B0%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%99-big.png | 800×600 | Exact name and single price ฿399, but the photo is the full teishoku set; catalog is à la carte. | 200 image/png 1.08 MB; hotlink OK | 定食 photo |
| 2 | ootoya-oyakodon | ootoya-thailand / Ootoya | ข้าวหน้าไก่โอยาโกะ / Oyakodon | VERIFIED_STANDALONE (SAFE) | A | https://www.ootoya.co.th/menu-details.php?id=72 | https://www.ootoya.co.th/upload_file/menu/Donburi-Menu/%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B9%84%E0%B8%81%E0%B9%88%E0%B9%82%E0%B8%AD%E0%B8%A2%E0%B8%B2%E0%B9%82%E0%B8%81%E0%B8%B0-big.png | 800×600 | Exact Thai name; single ฿199 = catalog; bowl, nori and props only. | 200 image/png 1.17 MB; hotlink OK | Charcoal-grilled-chicken oyako-ju style |
| 3 | ootoya-grilled-salmon-rice-bowl | ootoya-thailand / Ootoya | ข้าวหน้าปลาแซลมอนย่าง / Grilled Salmon Rice Bowl | NOT_FOUND | — | https://www.ootoya.co.th/menu-details.php?id=79 (rejected) | — | — | Official ข้าวหน้าปลาแซลมอน is raw zuke salmon on sushi rice, contradicting "grilled". Grilled salmon exists only as a teishoku. | — | A search-summary claim of "grilled" was wrong. |
| 4 | salad-factory-grilled-chicken-sesame | salad-factory-thailand / Salad Factory | สลัดอกไก่ย่างสไตล์ญี่ปุ่น ซอสงา / Japanese-Style Grilled Chicken Breast Salad, Sesame Dressing | VERIFIED_STANDALONE (SAFE) | A (brand storefront; merchant Green Food Factory Co.) | https://saladfactory.foodie24x7.co/ (record MS13) | https://img.imageboss.me/foodie24x7/width/500/format:webp/723305ef-3a77-4d9d-a603-e295dd72087d.jpg (origin https://eworksdiag294.blob.core.windows.net/foodie/723305ef-3a77-4d9d-a603-e295dd72087d.jpg) | 500 / 1000×1000 | EN name verbatim; ฿155 = catalog. | 200 webp, immutable cache, ACAO *; hotlink OK | Vendor-hosted |
| 5 | salad-factory-quinoa-chicken-basil | salad-factory-thailand / Salad Factory | สลัดควินัวอกไก่ย่าง กะเพราเผ็ด / Quinoa Salad with Grilled Chicken Breast, Spicy Holy Basil | VERIFIED_STANDALONE (SAFE) | A | https://saladfactory.foodie24x7.co/ (MS25) | https://img.imageboss.me/foodie24x7/width/500/format:webp/9f9aab2a-d4c5-4932-ab02-c89245cea8d6.jpg | 500 / 1000×1000 | EN name verbatim; visuals match. | 200 webp; hotlink OK | Storefront ฿215 vs catalog ฿195 |
| 6 | salad-factory-kale-chicken-truffle | salad-factory-thailand / Salad Factory | สลัดคะน้าอกไก่ ซอสทรัฟเฟิล / Kale Salad with Chicken Breast, Truffle Dressing | VERIFIED_STANDALONE (SAFE) | A | https://saladfactory.foodie24x7.co/ (MS26) | https://img.imageboss.me/foodie24x7/width/500/format:webp/6a1fa2fc-cef0-4df9-b57f-e52b5cf40aa4.jpg | 500 / 1000×1000 | EN verbatim; ฿235 = catalog; kale, chicken, truffle dressing. | 200 webp; hotlink OK | Official TH "เคล" vs catalog "คะน้า" |
| 7 | salad-factory-rocket-skirt-steak | salad-factory-thailand / Salad Factory | สลัดร็อกเก็ตเนื้อสเต็กย่าง ซอสบัลซามิก / Rocket Salad with Grilled Skirt Steak, Balsamic | VERIFIED_STANDALONE (SAFE) | A | https://saladfactory.foodie24x7.co/ (RK10) | https://img.imageboss.me/foodie24x7/width/500/format:webp/27100880-a2c7-4731-9bdb-f7cfbcfce517.jpg | 500 / 1000×1000 | EN verbatim; skirt steak and balsamic visible. | 200 webp; hotlink OK | ฿315 (no catalog price) |
| 8 | salad-factory-spicy-pork-tenderloin | salad-factory-thailand / Salad Factory | สลัดสันในหมูรสแซ่บ / Spicy Pork Tenderloin Salad | WEAK_CANDIDATE | A | https://saladfactory.foodie24x7.co/ ("Spicy Pork Tenderloin Salad with Seaweed Konjac and Wakame") | https://eworksdiag294.blob.core.windows.net/foodie/dec32b14-c4f4-4e57-8b1a-248606fd8aae.jpg | 1000×1000 | EN prefix matches, but the official dish is a konjac-noodle yum (ยำเส้นบุกหมูสันใน) and the catalog does not mention konjac. | 200 jpeg | Identity unproven |
| 9 | salad-factory-salmon-sashimi-shoyu | salad-factory-thailand / Salad Factory | สลัดแซลมอนซาชิมิ ซอสโชยุวาซาบิ / Salmon Sashimi Salad, Shoyu-Wasabi Dressing | NOT_FOUND | — | Former official https://www.saladfactorythailand.com/product/salmon-sashimi-salad-with-japanese-shoyu-and-wasabi-dressing (now gambling-site 404) | — | — | Not on the current storefront; the old official page is unrecoverable (Wayback 429 twice). | — | Retry Wayback later |
| 10 | seven-eleven-chicken-sukiyaki | seven-eleven-thailand / 7-Eleven | ข้าวหน้าไก่สุกี้ (อีซี่ ช้อยส์) / Ezy Choice Chicken Sukiyaki Rice | VERIFIED_VARIANT | A | https://www.allonline.7eleven.co.th/p/%E0%B8%AD%E0%B8%B5%E0%B8%8B%E0%B8%B5%E0%B9%88-%E0%B8%8A%E0%B9%89%E0%B8%AD%E0%B8%A2%E0%B8%AA%E0%B9%8C-H%E0%B8%AA%E0%B8%B8%E0%B8%81%E0%B8%B5%E0%B9%89%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%82%E0%B8%A5%E0%B8%B8%E0%B8%81%E0%B8%82%E0%B8%A5%E0%B8%B4%E0%B8%81-250-%E0%B8%81%E0%B8%A3%E0%B8%B1%E0%B8%A1/355384/ | https://media.allonline.7eleven.co.th/pdzoom/642775-00-meal-box-ezy-choice.jpg | 1110×1110 | Official Ezy Choice chicken sukiyaki is glass noodles, no rice. The label's sodium 1,220 mg/250 g equals the catalog value. | 200 jpeg; in stock at fetch | Probable catalog naming error |
| 11 | seven-eleven-pork-bulgogi-rice | seven-eleven-thailand / 7-Eleven | ข้าวหมูบูลโกกิ (แฮปปี้ เชฟ) / Happy Chef Pork Bulgogi Rice | CONTENT_VERIFIED_BUT_URL_UNSUITABLE | B (official 7-Eleven Thailand FB) | https://www.facebook.com/7ElevenThailand/posts/1301293152024243/ | (signed fbcdn OG image; expires) | 600×600 | Pack reads "ข้าวหมูบูลโกกิ ตรา แฮปปี้เชฟ 260 กรัม", ฿59. | fbcdn `oe=` expiry; AllOnline /p/…/365809/ = 404 | Packshot, not plated |
| 12 | seven-eleven-korean-chicken-fried-rice | seven-eleven-thailand / 7-Eleven | ข้าวผัดไก่เกาหลี (อีซี่โก) / Ezygo Korean Chicken Fried Rice | VERIFIED_CURRENT_REFORMULATION | A | https://www.allonline.7eleven.co.th/p/%E0%B8%AD%E0%B8%B5%E0%B8%8B%E0%B8%B5%E0%B9%88%E0%B9%82%E0%B8%81-%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%9C%E0%B8%B1%E0%B8%94%E0%B9%84%E0%B8%81%E0%B9%88%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%AB%E0%B8%A5%E0%B8%B5-250g/328382/ | https://media.allonline.7eleven.co.th/pdzoom/713057-00-allonline-sm-NewOnlyat.jpg (packshot …/713057-01-allonline-sm.jpg) | 1110×1110 | Same product and brand; the page says recipe reformulated (more egg, butter wok aroma) and new label. Label 460 kcal vs catalog 440; sodium 890 on both. | 200 jpeg; out of stock | Hero caption says "EZY TASTE Brand" |
| 13 | seven-eleven-sticky-rice-dried-pork | seven-eleven-thailand / 7-Eleven | ข้าวเหนียวหมูฝอย น้ำแจ่ว / Sticky Rice with Dried Pork and Jaew Sauce | NOT_FOUND | — | AllOnline search "หมูฝอย" / "ข้าวเหนียวหมู": no product; FB search: none | — | — | Only Lemon8, Pantip and OpenFoodFacts. | — | — |
| 14 | jones-chicken-sesame-salad | jones-salad-thailand / Jones' Salad | สลัดอกไก่งาขาวคั่ว / Grilled Chicken Breast Salad, Roasted Sesame Dressing | VERIFIED_STANDALONE (SAFE) | A | https://www.jonessalad.com/catering/healthy-meal/ | https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%87%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%84%E0%B8%B1%E0%B9%88%E0%B8%A7.png | 400×410 | Card h3 = exact Thai name; chicken and roasted-sesame dressing visible. | 200 png 317 KB; hotlink OK | Salad Box M/L |
| 15 | jones-grilled-salmon-salad | jones-salad-thailand / Jones' Salad | สลัดแซลมอนย่าง / Grilled Salmon Salad | VERIFIED_STANDALONE (SAFE) | A | https://www.jonessalad.com/catering/healthy-meal/ | https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B9%81%E0%B8%8B%E0%B8%A5%E0%B8%A1%E0%B8%AD%E0%B8%99%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87.png | 400×410 | Exact TH and EN; ฿369 = catalog. | 200 png 341 KB; hotlink OK | — |
| 16 | jones-caesar-chicken-salad | jones-salad-thailand / Jones' Salad | สลัดซีซาร์ไก่ / Caesar Chicken Salad | VERIFIED_STANDALONE (SAFE) | A | https://www.jonessalad.com/catering/healthy-meal/ | https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%8B%E0%B8%B5%E0%B8%8B%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%84%E0%B8%81%E0%B9%88.png | 400×410 | Exact TH; chicken, croutons and parmesan visible. | 200 png 327 KB; hotlink OK | Salad Box M/L |
| 17 | jones-chicken-larb-crispy-rice-salad | jones-salad-thailand / Jones' Salad | สลัดลาบอกไก่และข้าวพอง / Chicken Larb & Crispy Rice Salad | VERIFIED_STANDALONE (SAFE) | A | https://www.jonessalad.com/catering/healthy-meal/ | https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%A5%E0%B8%B2%E0%B8%9A%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%9E%E0%B8%AD%E0%B8%87.png | 400×410 | Exact TH; larb chicken, crispy rice and larb-mayo dressing. | 200 png 342 KB; hotlink OK | Salad Box M/L |
| 18 | jones-caribbean-chicken-steak | jones-salad-thailand / Jones' Salad | สเต็กอกไก่แคริบเบียน / Caribbean Chicken Breast Steak | VERIFIED_CROP_CANDIDATE | A | https://www.jonessalad.com/menu/steak/ | https://www.jonessalad.com/wp-content/uploads/2026/08/Aug-18_Steak_Chicken-Breast.jpg | 1500×2495 | Labelled quadrant "…แคริบเบียน / Caribbean Chicken Breast Steak with Brown Sauce 199.-" = catalog ฿199. | 200 jpeg 930 KB; hotlink OK | 2019 standalone `Asset-1_สเต็กอกไก่แคริบเบียน.jpg` (920×920) is an older plating, i.e. a variant |
| 19 | jones-honey-lemon-basa-steak | jones-salad-thailand / Jones' Salad | สเต็กปลาบาซา ฮันนี่เลมอน / Honey Lemon Basa Fish Steak | NOT_FOUND | — | https://www.jonessalad.com/menu/nutrition-fact/ (text only); fish sheet `2026/03/menu-2026_Steak_Fish.jpg` has no honey-lemon basa | — | — | Named only in the nutrition table; no image in 4,350 media items. | — | Possibly discontinued |
| 20 | jones-mushroom-soup | jones-salad-thailand / Jones' Salad | ซุปเห็ด / Mushroom Soup | VERIFIED_STANDALONE (not SAFE) | A | https://www.jonessalad.com/menu/soup/ (sheet https://www.jonessalad.com/wp-content/uploads/2026/07/Soup-Menu-AW.jpg shows "ซุปเห็ด 59.-") | https://www.jonessalad.com/wp-content/uploads/2019/06/Asset-2_%E0%B8%8B%E0%B8%B8%E0%B8%9B%E0%B9%80%E0%B8%AB%E0%B9%87%E0%B8%94.png | 500×500 | Plain mushroom soup, white bowl, parsley: same presentation as the current ฿59 sheet (catalog ฿59). | 200 png 132 KB; hotlink OK | Orphaned 2019 asset; the current sheet is a crop fallback |
| 21 | fuji-salmon-shioyaki | fuji-japanese-restaurant-thailand / Fuji | ปลาแซลมอนย่างเกลือ / Grilled Salmon Shioyaki | VERIFIED_VARIANT | A | https://www.fuji.co.th/menu/ (card 5135) | https://www.fuji.co.th/wp-content/uploads/2026/06/SALMON-TERIYAKI-_-SHIOYAKI-768x768.png | 768 (1040 orig) | À la carte ฿290 matches, but the image shows the teriyaki glaze, not salt-grilled. | 200 png; hotlink OK | Shared teriyaki/shioyaki listing |
| 22 | fuji-chicken-teriyaki | fuji-japanese-restaurant-thailand / Fuji | ไก่ย่างซีอิ๊ว / Chicken Teriyaki | VERIFIED_STANDALONE (SAFE) | A | https://www.fuji.co.th/menu/ (card 5171) | https://www.fuji.co.th/wp-content/uploads/2026/06/CHICKEN-TERIYAKI-768x768.png | 768×768 | Exact TH and EN; à la carte ฿170 = catalog; no rice or soup in the image. | 200 png ~1 MB; hotlink OK | The card shows the -SET sibling |
| 23 | sukiya-gyudon-regular | sukiya-thailand / Sukiya | ข้าวหน้าเนื้อ (ไซส์ M) / Gyudon Beef Rice Bowl (M) | VERIFIED_STANDALONE (SAFE) | A | https://www.sukiya.co.th/th/menu/grandmenu.html | https://www.sukiya.co.th/th/upload/top/img_gyudon.jpg | 350×350 | Labelled "ข้าวหน้าเนื้อ"; same photo as the sheet hero "Gyudon M 89.-" = catalog. | 200 jpeg 73 KB RGB; hotlink OK | Size not printed on the image |
| 24 | sukiya-gyudon-okra-regular | sukiya-thailand / Sukiya | ข้าวหน้าเนื้อโอคุระ (ไซส์ M) / Gyudon with Bonito Flakes & Okra (M) | VERIFIED_CROP_CANDIDATE | A | https://www.sukiya.co.th/th/menu/grandmenu.html | https://www.sukiya.co.th/th/menu/img/menu/menu_gyudon.jpg | 1141×905 | Tile "105 … Gyudon with Bonito Flakes & Okra M 119.-" = catalog. | 200 jpeg **CMYK** | An onsen-egg promo bubble overlaps the tile |
| 25 | sukiya-curry-rice-regular | sukiya-thailand / Sukiya | ข้าวแกงกะหรี่ (ไซส์ M) / Japanese Curry Rice (M) | VERIFIED_VARIANT | A | https://www.sukiya.co.th/th/menu/grandmenu.html | https://www.sukiya.co.th/th/upload/top/img_curry.jpg | 700×700 | The official image is curry with gyudon beef; the catalog is plain curry ("609 … M 89.-", text only). | 200 jpeg; hotlink OK | — |
| 26 | sukiya-beef-plate-no-rice | sukiya-thailand / Sukiya | เนื้อสุคิยะ (ไซส์ M) / Beef Plate, No Rice (M) | VERIFIED_CROP_CANDIDATE | A | https://www.sukiya.co.th/th/menu/grandmenu.html | https://www.sukiya.co.th/th/menu/img/menu/menu_alacarte.jpg | 571×905 | Tile "800 เนื้อสุคิยะ Beef Plate M 75.-" = catalog. | 200 jpeg CMYK | Serving note says "served raw for hot pot"; the photo shows cooked beef, as sold |
| 27 | sukiya-salad | sukiya-thailand / Sukiya | สลัด / Salad | VERIFIED_CROP_CANDIDATE | A | https://www.sukiya.co.th/th/menu/grandmenu.html | https://www.sukiya.co.th/th/menu/img/menu/menu_curry.jpg | 1141×905 | "812 สลัด 45.-" is text only; the salad is shown as the "ชุดสลัด / Salad set" tile and in the "604 … Salad Set" photo. | 200 jpeg CMYK | Identity via set label; the dressing question remains |
| 28 | sukiya-miso-soup | sukiya-thailand / Sukiya | ซุปมิโสะ / Miso Soup | VERIFIED_CROP_CANDIDATE | A | https://www.sukiya.co.th/th/menu/grandmenu.html | https://www.sukiya.co.th/th/menu/img/menu/menu_gyudon.jpg | 1141×905 | Miso bowl in Recommended Sets with the "เปลี่ยนซุปมิโสะเป็นชาเขียวได้" callout. | 200 jpeg CMYK | Avoid set 105 (pork miso) |
| 29 | santa-fe-grilled-chicken-pepper-steak | santa-fe-steak-thailand / Santa Fe' | สเต๊กไก่ ซอสเปปเปอร์ / Grilled Chicken Steak, Pepper Sauce | WEAK_CANDIDATE | A | https://santafesteak.com/ (menu slides) | https://santafesteak.com/img/menuslide/AW%20Santa%20Fe_NewMenu_14Combo189_Normal_OL_1753172165.jpg | 2728×1972 | Only a plain "Chicken Steak" plate plus a black-pepper sauce option on the combo sheet; no pepper-sauce chicken photo. | 200 jpeg ~4 MB | — |
| 30 | santa-fe-salmon-steak | santa-fe-steak-thailand / Santa Fe' | แซลมอนสเต๊ก / Salmon Steak | VERIFIED_CROP_CANDIDATE | A | https://santafesteak.com/ | https://santafesteak.com/img/menuslide/AW%20Santa%20Fe_NewMenu_09Fish_Normal_1753171936.jpg | 2728×1972 | Hero "สเต๊กแซลมอน Salmon Steak 329.-" = catalog ฿329. | 200 jpeg ~4 MB; max-age 7d | Sides configurable |
| 31 | santa-fe-dory-fish-steak | santa-fe-steak-thailand / Santa Fe' | สเต๊กปลาดอรี่ / Dory Fish Steak | VERIFIED_CROP_CANDIDATE | A | https://santafesteak.com/ | https://santafesteak.com/img/menuslide/AW%20Santa%20Fe_NewMenu_09Fish_Normal_1753171936.jpg | 2728×1972 | "สเต๊กปลาดอรี่ย่าง 209.- Grilled Dory Fish Steak" = catalog ฿209. | 200 jpeg | Garlic-butter and mushroom variants are on the same sheet |
| 32 | santa-fe-seabass-steak | santa-fe-steak-thailand / Santa Fe' | สเต๊กปลากระพง / Seabass Steak | NOT_FOUND | — | Current official Fish, Must Try, Mixed Grill and Combo sheets have no sea bass | — | — | Third-party listings only. | — | Possibly discontinued |
| 33 | santa-fe-kurobuta-pork-chop | santa-fe-steak-thailand / Santa Fe' | หมูคุโรบุตะพอร์คช้อป / Kurobuta Pork Chop | VERIFIED_CROP_CANDIDATE | A | https://santafesteak.com/ | https://santafesteak.com/img/menuslide/AW%20Santa%20Fe_NewMenu_07Pork_Normal_1753171850.jpg | 2728×1972 | Hero "สเต๊กคูโรบูตะพอร์คชอป ซอสพริกไทยดำ 279.-"; mushroom and Mexican versions also shown. | 200 jpeg | Sauce varies (catalog `configurable`) |
| 34 | santa-fe-chicken-steak-jaew | santa-fe-steak-thailand / Santa Fe' | สเต๊กไก่ 2 ชิ้น ซอสแจ่ว / Chicken Steak (2 Pieces), Jaew Sauce | WEAK_CANDIDATE | A | https://santafesteak.com/ | https://santafesteak.com/img/menuslide/AW%20Santa%20Fe_NewMenu_08Chicken_Normal_OL_1753171870.jpg (and Combo189 sheet) | 2728×1972 | "สเต๊กไก่สามเกลอ ซอสแจ่ว 159.-" is one piece; the combo shows two chicken steaks with a selectable jaew sauce. Neither is exact. | 200 jpeg | — |
| 35 | santa-fe-premium-beef-steak | santa-fe-steak-thailand / Santa Fe' | สเต๊กโคขุน เนื้อนำเข้า / Premium Fattened Beef Steak, Imported | NOT_FOUND | — | Current Beef sheet `…_10BeefSTD_Normal_1753171981.jpg` has only rib eye and hamburg | — | — | No โคขุน item on the current official menu. | — | — |
| 36 | nittaya-tom-saep-grilled-chicken-soup | nittaya-kai-yang-thailand / Nittaya | ต้มแซ่บไก่ย่าง / Spicy Grilled-Chicken Tom Saep Soup | WEAK_CANDIDATE | A | https://www.nittayakaiyang.com/th/food_menus/ต้มโย้งไก่ย่าง/ | https://www.nittayakaiyang.com/wp-content/uploads/2023/04/%E0%B8%95%E0%B9%89%E0%B8%A1%E0%B9%82%E0%B8%A2%E0%B9%89%E0%B8%87%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87-07.png | not measured | The official dish is ต้มโย้งไก่ย่าง, a different named soup; there is no ต้มแซ่บไก่ย่าง on the official site. | not tested | Name mismatch |
| 37 | zaab-eli-grilled-chicken | zaab-eli-thailand / Zaab Eli | ไก่ย่างแซ่บอีลี่ / Zaab Eli Grilled Chicken | NOT_FOUND | — | LINE OA https://page.line.me/ntw0665w (no feed data); FB/IG login-gated | — | — | No official image reachable. | — | — |
| 38 | zaab-eli-fried-chicken | zaab-eli-thailand / Zaab Eli | ไก่ทอดแซ่บอีลี่ / Zaab Eli Fried Chicken | NOT_FOUND | — | as above | — | — | Wongnai has only "ปีกไก่ทอดสมุนไพร" (a different dish). | — | — |
| 39 | zaab-eli-grilled-pork-neck | zaab-eli-thailand / Zaab Eli | คอหมูย่าง / Grilled Pork Neck | NOT_FOUND | — | as above | — | — | — | — | — |
| 40 | zaab-eli-som-tam-salted-egg | zaab-eli-thailand / Zaab Eli | ส้มตำไทยไข่เค็ม / Thai Papaya Salad with Salted Egg | MARKETPLACE_ONLY | M | https://www.wongnai.com/restaurants/zaabeli-thamaharat/menu/items/1755475 | https://img.wongnai.com/p/_-x_/2018/10/02/e7caaa2118db403c84eccf1626845aa8.jpg | 154×154 | Name matches; the uploader is unknown. | not tested | 2018; ฿85 vs catalog ฿120 |
| 41 | zaab-eli-corn-salted-egg-som-tam | zaab-eli-thailand / Zaab Eli | ตำข้าวโพดไข่เค็ม / Corn & Salted Egg Papaya Salad | MARKETPLACE_ONLY | M | https://www.wongnai.com/restaurants/zaabeli-thamaharat/menu/items/1755475 | https://img.wongnai.com/p/_-x_/2018/10/02/cc958850489f40479e9153cd6510f651.jpg | 800×800 | Name matches; the uploader is unknown. | not tested | 2018; ฿89 vs ฿120 |
| 42 | zaab-eli-larb-moo | zaab-eli-thailand / Zaab Eli | ลาบหมู / Pork Larb | NOT_FOUND | — | as #37 | — | — | — | — | — |
| 43 | zaab-eli-tom-saep-beef-tendon-soup | zaab-eli-thailand / Zaab Eli | ต้มแซ่บเอ็นแก้วเนื้อน่องลาย / Spicy Beef Shank & Tendon Soup | NOT_FOUND | — | as #37 | — | — | Mentioned in third-party reviews only. | — | — |
| 44 | somtam-nua-papaya-salad-thai | somtam-nua-thailand / Somtam Nua | ส้มตำไทย / Thai-Style Papaya Salad | NOT_FOUND | — | CRG brand page https://crg.co.th/brand-details/19/SomtamNua (logo only); FB https://www.facebook.com/Somtamnuathailand/ (timeline gated) | — | — | No official menu asset reachable. | — | somtamnua.com is parked |
| 45 | somtam-nua-papaya-salad-fermented-crab | somtam-nua-thailand / Somtam Nua | ส้มตำปูปลาร้า / Papaya Salad with Salted Crab & Fermented Fish Sauce | NOT_FOUND | — | as #44 | — | — | — | — | — |
| 46 | somtam-nua-tam-muah | somtam-nua-thailand / Somtam Nua | ตำมั่ว / Mixed Papaya Salad | NOT_FOUND | — | as #44 | — | — | Press articles mention it as a signature dish; not official images. | — | — |
| 47 | somtam-nua-larb-moo | somtam-nua-thailand / Somtam Nua | ลาบหมู / Pork Larb with Liver | NOT_FOUND | — | as #44 | — | — | — | — | — |
| 48 | somtam-nua-larb-fried-fish | somtam-nua-thailand / Somtam Nua | ลาบปลาทอด / Crispy Fried Fish Larb | NOT_FOUND | — | as #44 | — | — | — | — | — |
| 49 | somtam-nua-fried-chicken | somtam-nua-thailand / Somtam Nua | ไก่ทอด / Thai Fried Chicken Wings | NOT_FOUND | — | as #44 | — | — | Press mention only. | — | — |
| 50 | somtam-nua-tom-saep-pork-bone-soup | somtam-nua-thailand / Somtam Nua | ต้มแซ่บกระดูกหมูอ่อน / Spicy Isan Pork-Bone Soup | NOT_FOUND | — | as #44 | — | — | — | — | — |
| 51 | somtam-nua-sticky-rice | somtam-nua-thailand / Somtam Nua | ข้าวเหนียว / Sticky Rice | NOT_FOUND | — | as #44 | — | — | — | — | — |
| 52 | thongsmith-wagyu-ribeye-boat-noodle | thongsmith-boat-noodle-thailand / ThongSmith | น้ำตกวากิวทองสมิทธ์ (ริบอาย) / Wagyu Ribeye "Waterfall" Beef Boat Noodle | VERIFIED_CROP_CANDIDATE | B (AnyFlip via official Linktree) | https://online.anyflip.com/iugnb/rchh/ (p.7) | https://online.anyflip.com/iugnb/rchh/files/large/b79e70f66715b55e7b194b73ec6009f9.webp | 1980×2800 | "D10 น้ำตกวากิวริบอายทองสมิทธ์ 529" pictured (ribeye, ball, shank, tendon). | 200 webp; no Referer needed | D9 is ribeye only |
| 53 | thongsmith-kurobuta-pork-boat-noodle | thongsmith-boat-noodle-thailand / ThongSmith | ก๋วยเตี๋ยวเรือหมูคุโรบุตะ / Kurobuta Pork Boat Noodle | VERIFIED_CROP_CANDIDATE | B | https://online.anyflip.com/iugnb/rchh/ (p.11) | https://online.anyflip.com/iugnb/rchh/files/large/73bd9be8ec7c33215a3f1d3b0cb60127.webp | 1980×2800 | "E5 น้ำตกหมูคุโรบุตะ 229, Sliced Kurobuta Pork" pictured. | 200 webp | E6/E7 are combinations |
| 54 | thongsmith-dry-rice-kurobuta-braised-pork | thongsmith-boat-noodle-thailand / ThongSmith | ข้าวต้มแห้งหมูคุโรบูตะ หมูตุ๋น / Dry Rice with Kurobuta Pork & Braised Pork | VERIFIED_CROP_CANDIDATE | B | https://online.anyflip.com/iugnb/rchh/ (p.15) | https://online.anyflip.com/iugnb/rchh/files/large/51b13b11230d8a9320db2447984fdeb9.webp | 1980×2800 | "G8 ข้าวต้มแห้งหมูคุโรบูตะ หมูตุ๋น" pictured. | 200 webp | Official ฿259 vs catalog ฿239 |
| 55 | thongsmith-spicy-shredded-chicken-dry | thongsmith-boat-noodle-thailand / ThongSmith | แซ่บแห้งไก่ฉีก / Spicy Shredded Chicken (Dry, No Soup) | VERIFIED_VARIANT | B | https://online.anyflip.com/iugnb/rchh/ (p.13) | https://online.anyflip.com/iugnb/rchh/files/large/149f53d9adcdaf5b0c5d7cf3e90ab16f.webp | 1980×2800 | "F2 แซ่บแห้งไก่ฉีก 139/139" pictured **with noodles**; catalog carbs 18 g and "Salad" category imply the no-noodle version. | 200 webp | Also a crop |
| 56 | thongsmith-grilled-pork-meatballs | thongsmith-boat-noodle-thailand / ThongSmith | ลูกชิ้นหมูปิ้ง / Grilled Pork Meatballs with Sweet Chili Dip | VERIFIED_CROP_CANDIDATE | B | https://online.anyflip.com/iugnb/rchh/ (p.2) | https://online.anyflip.com/iugnb/rchh/files/large/9adb672aa0e3015bafcb205c9abbb688.webp | 1980×2800 | "A1 ลูกชิ้นหมูปิ้ง (3 ไม้) 119 THB … with sweet chilli dip" = catalog ฿119. | 200 webp | — |
| 57 | steak-and-more-chicken-steak | steak-and-more-thailand / The Steak & More | สเต็กไก่ / Chicken Steak | WEAK_CANDIDATE | A (operator CDN) | https://www.minorfood.com/en/our-business/the-steak-and-more | https://cdn.minorfood.com/uploaded/brand/tile/175758016668c28b86973a1.jpg | 500×500 | Uncaptioned; BBQ chicken shown in a combo with fried fish. | 200 jpeg; hotlink OK | — |
| 58 | steak-and-more-pork-chop | steak-and-more-thailand / The Steak & More | สเต็กหมู / Pork Chop Steak | WEAK_CANDIDATE | A (operator CDN) | https://www.minorfood.com/en/our-business/the-steak-and-more | https://cdn.minorfood.com/uploaded/brand/tile/175757448468c275541669b.jpg | 500×500 | Bone-in chop plate; uncaptioned. | 200 jpeg | Closest of the Steak & More candidates |
| 59 | steak-and-more-squid-ink-spaghetti-shrimp | steak-and-more-thailand / The Steak & More | สปาเก็ตตี้หมึกดำกุ้ง / Black Squid-Ink Spaghetti with Shrimp | NOT_FOUND | — | Minor Food tiles show squid-ink spaghetti only as a small side, without shrimp | — | — | — | — | — |
| 60 | steak-and-more-caesar-salad | steak-and-more-thailand / The Steak & More | ซีซาร์สลัด / Caesar Salad | NOT_FOUND | — | Minor Food pages; FB `TheSteakandMore` posts checked are unrelated | — | — | — | — | — |
| 61 | steak-and-more-som-tam | steak-and-more-thailand / The Steak & More | ส้มตำ / Som Tam | NOT_FOUND | — | as above | — | — | — | — | — |
| 62 | steak-and-more-yum-woon-sen | steak-and-more-thailand / The Steak & More | ยำวุ้นเส้น / Yum Woon Sen | WEAK_CANDIDATE | A (operator CDN) | https://www.minorfood.com/en/franchise/thailand/the-steak-and-more | https://cdn.minorfood.com/uploaded/brand/tile/175757423068c2745661fb5.jpg | 500×500 | Clearly yum woon sen, but uncaptioned, and the same salad appears as a steak-set side. | 200 jpeg | — |

## Candidates that looked promising but failed

- **Ootoya "ข้าวหน้าปลาแซลมอน"** is raw zuke salmon, not grilled. A web-search summary claimed "grilled salmon rice bowl", which was wrong.
- **Fuji `SALMON-TERIYAKI-_-SHIOYAKI.png`**: the price and listing are right, but the photo is the teriyaki preparation.
- **7-Eleven "Hสุกี้ไก่ขลุกขลิก"**: right brand and weight, but glass noodles, not rice. Its nutrition matches the catalog, so the catalog name is suspect.
- **Salad Factory konjac pork-tenderloin yum**: the English name matches, but the composition cannot be reconciled.
- **Santa Fe' combo chicken steaks** and **Nittaya ต้มโย้ง**: related dishes, but not the catalog dishes.
- **Minor Food tiles**: visually right for pork chop and yum woon sen, but uncaptioned and partly shown as set sides.
- **Jones 2019 Caribbean steak asset**: an older plating from before the current menu.
- **`zaabelifoodtruck.com`**: an unrelated US business with the same name.

## Research hygiene

- The previous 37A audit and all other earlier restaurant asset/research documents under `docs/` were **not opened, searched, or compared**.
- No browser was launched and no user browser or login session was used. The only external clients were `curl`, WebSearch and WebFetch.
- All temporary files (bundle, scripts, downloaded images and HTML) were kept in the session scratchpad and deleted before completion.

---

## Slice 38 implementation outcome (2026-09-30)

This section records what was implemented from this report. The research sections above are unchanged.

- **Standalone (11/11 implemented):** every SAFE_STANDALONE_CANDIDATE, as `official-remote` with the exact URLs listed above. Salad Factory uses the ImageBoss storefront URLs. Nothing links to `saladfactorythailand.com`.
- **Crops (9/12 implemented):** local WebP crops under `public/menu/<menu-id>.webp`. They were made only by crop, resize and RGB WebP conversion (the CMYK Sukiya sheet was converted to sRGB). There were no generative or retouching edits. Provenance is recorded as `kind: 'bundled'` plus a new optional `cropOf` field (the official sheet URL), `sourceUrl` (the official menu page), a "Cropped from … official menu sheet" label, and `asOf: 2026-09-30`.

| Menu ID | Crop (px) | Source sheet |
|---|---|---|
| jones-caribbean-chicken-steak | 680×530 | Aug-18_Steak_Chicken-Breast.jpg (bottom-right quadrant, food only) |
| sukiya-beef-plate-no-rice | 228×180 | menu_alacarte.jpg tile 800 (native resolution; the weakest accepted crop) |
| santa-fe-salmon-steak | 1000×561 | 09Fish sheet hero |
| santa-fe-dory-fish-steak | 615×425 | 09Fish sheet, "สเต๊กปลาดอรี่ย่าง 209.-" plate (not the mushroom or garlic-butter versions) |
| santa-fe-kurobuta-pork-chop | 1000×553 | 07Pork sheet hero (black-pepper sauce as pictured; metadata implies no fixed sauce) |
| thongsmith-wagyu-ribeye-boat-noodle | 960×715 | AnyFlip p.7, D10 bowl (the D9 bowl is excluded) |
| thongsmith-kurobuta-pork-boat-noodle | 750×615 | AnyFlip p.11, E5 bowl |
| thongsmith-dry-rice-kurobuta-braised-pork | 990×730 | AnyFlip p.15, G8 bowl (official price ฿259; catalog ฿239 left unchanged) |
| thongsmith-grilled-pork-meatballs | 845×522 | AnyFlip p.2, A1 plate with sweet chilli dip |

- **Rejected crops (3):**
  - `sukiya-gyudon-okra-regular`: the tile is about 185×120 px, and the onsen-egg promo bubble overlaps the bowl. It cannot be cropped out without cutting the dish.
  - `sukiya-salad`: the only usable salad is inside set photos (about 130 px). The set's curry bowl and price overlap it.
  - `sukiya-miso-soup`: the ordinary miso bowl (set 100, not the pork-miso set 105) is about 160×120 px, with a callout bubble and neighbouring set items.
- **Coverage:** 22 → 42 of 84 menu items (50.0%). The 45 target was not reached because of the three rejections above.
