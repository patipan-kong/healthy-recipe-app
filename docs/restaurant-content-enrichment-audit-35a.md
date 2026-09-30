# GoodFood V2 — Slice 35A: Restaurant Menu Content Enrichment Audit

Research/check date: **2026-09-30**, Asia/Bangkok. Research and documentation only. Prices describe the identified menu/channel on this date, not a guarantee of future availability or every branch's price.

## 1. Executive summary

All **84 menu items across 13 restaurants** were audited independently for price and image quality. The safe enrichment batch is **20 new prices, one price correction, and five new official dish images**. Two existing Salad Factory image references require correction because the exact URLs return unrelated HTML rather than dish images. One Nittaya image loads but represents a whole chicken rather than the catalog's individual portion; it remains a withheld portion-review issue.

The catalog contains 24 price fields, but this audit reverified only 14 against current first-party evidence, identified one correction, and withheld nine existing prices. Existing fields must not be described collectively as 24 currently verified prices.

An important product finding: ordinary restaurant menu lists and Explore feed cards display **neither images nor prices**, even when both fields exist. Images and prices are visible in completed Pick cards and other existing detail/bridge presentations. Data enrichment improves those surfaces; it does not by itself resolve the visually dry discovery feed.

## 2. Entry state

- Original research entry: branch `main`, HEAD `4fc49593dbb964369a3ffd24e09b16bb8aad2dff` (`feat: prototype inline ad placements`). `git status --short` was empty. Slice 34 was committed, so the entry gate passed.
- Resumed entry: branch `main`, HEAD `3dfe328cc5e0c701a8583c1b332c0f60ea0a75b4` (`chore: remove ad build diagnostic`). Status was again empty. The intervening `debug build` and diagnostic-removal commits have no net tree difference from the original research HEAD; catalog/UI evidence remains applicable.
- No commit, push, production edit, dependency addition, or image download was performed by this audit.

## 3. Current catalog coverage

Source: `src/restaurants.ts`, checked rather than assuming the requested baseline.

| Measure | Count |
| --- | ---: |
| Restaurants | 13 |
| Menu items | 84 |
| Items with a price field | 24 |
| Items with an image field | 19 |
| Images marked `official-remote` | 19 |
| Bundled/local menu images | 0 |

`MenuPrice` in `src/types.ts` stores `amount`, currency restricted to `THB`, `asOf`, and optional localized `note`. It has no structured source URL or channel field. `MenuImage` stores `src`, localized `alt`, `kind`, optional `sourceUrl`, localized `sourceLabel`, and `asOf`. Provenance links therefore exist for images; price evidence lives primarily in documentation.

Earlier evidence is documented in `docs/restaurant-price-expansion-20.md`, `docs/restaurant-price-expansion-22.md`, image pilot/expansion documents 18/19/24/29, the restaurant nutrition pilot, and the visual-identity pilot. Those documents were discovery aids, not substitutes for current verification. Earlier Santa Fe, Nittaya and Zaab Eli prices include aggregator evidence accepted by older slices; Slice 35A applies the stricter first-party requirement.

## 4. Research/source policy

Research proceeded restaurant by restaurant, reusing official category menus, individual product pages, and brand-linked menu books. Every proposed addition has an exact item match, source locator, channel/portion note, and check date below. Search snippets, cached pages, review photographs, delivery aggregators, unrelated restaurants, and similar dishes were not promoted to production truth.

Live browser observations took precedence when search extraction was cached, incomplete, or contradicted the page. A browser-displayed image and positive natural dimensions establish that an image was served and decoded; they do **not** establish a particular HTTP status, content-type header, reuse license, or indefinite hotlink permission. Shell HEAD/fetch checks failed at the transport layer for the remote URLs, so those failures were not called broken assets. No status code was inferred from them.

Official websites can publish an undated menu currently linked from their navigation. Such menus are accepted as currently displayed, with a recheck required before implementation. Dated expired promotions and prices from another portion/set were withheld. No delivery-to-in-store equivalence was assumed. Where source channels or languages contradicted each other, the candidate was withheld.

### Source register

All entries were checked on **2026-09-30**. Keys in later tables resolve to these direct evidence pages.

| Key | Source URL / type | Scope and qualification |
| --- | --- | --- |
| O3 | [Ootoya mackerel](https://www.ootoya.co.th/menu-details.php?id=3), official item page | À la carte ฿279; set ฿339; exact main-dish photo. |
| O1 | [Ootoya Shima Hokke](https://www.ootoya.co.th/menu-details.php?id=1), official item page | À la carte ฿399; set ฿459; available photo depicts a set. |
| O35 | [Ootoya Moromi chicken](https://www.ootoya.co.th/menu-details.php?id=35), official item page | À la carte ฿259; set ฿319; exact main-dish photo. |
| O72 | [Ootoya Oyakodon](https://www.ootoya.co.th/menu-details.php?id=72), official item page | Bowl ฿199; set ฿229; photo includes accompanying set dishes. |
| O30 | [Ootoya Tonteki](https://www.ootoya.co.th/menu-details.php?id=30), official item page | À la carte ฿369; set ฿429. Catalog explicitly names the set. |
| O79 | [Ootoya salmon rice](https://www.ootoya.co.th/menu-details.php?id=79), official item page | Raw marinated salmon, not the catalog's grilled salmon bowl. Rejected match. |
| SF | [Former Salad Factory menu](https://www.saladfactorythailand.com/menu/order), historical provenance route | Live product and asset routes returned unrelated TKBTOP8/404 content. Cause/ownership of the change is not asserted. Cached menu extraction also conflated calories and prices. |
| SF-L | [Salad Factory LINE public profile](https://page.line.me/pac6513g), brand profile | Public profile links the former domain and an ordering route. [Ordering redirect](https://liff.line.me/1656471129-lNm4keQO) led toward LINE authentication; not used for item truth. |
| 7P | [7-Eleven garlic pork, 250g](https://www.allonline.7eleven.co.th/p/ข้าวหมูกระเทียมไข่ดาว-ตรา-อีซี่โก-250-กรัม/367920/), official product page | ฿49, listed in stock; displayed price window ends 30/09/2026. Online channel only. |
| 7G | [7-Eleven Chef Cares curry, 275g](https://www.allonline.7eleven.co.th/p/แกงเขียวหวานอกไก่และข้าวหอมมะลิ-ตรา-เชฟแคร์ส-275-กรัม/334743/), official product page | ฿49, listed in stock; displayed price window ends 30/09/2026. Online channel only. |
| 7K | [7-Eleven Korean chicken rice, 250g](https://allonline.7eleven.co.th/p/อีซี่โก-ข้าวผัดไก่เกาหลี-250g/328382/), official product page | ฿45, explicitly reformulated with additional egg, out of stock; price window ends check date. Withheld. |
| 7S | [7-Eleven Ezy Choice chicken suki, 250g](https://www.allonline.7eleven.co.th/p/อีซี่-ช้อยส์-Hสุกี้ไก่ขลุกขลิก-250-กรัม/355384/), official related-product link | Different naming/preparation from catalog's sukiyaki rice; related listing is insufficient. |
| J-W | [Jones salad menu](https://www.jonessalad.com/menu/salad/) → [Western sheet](https://www.jonessalad.com/wp-content/uploads/2026/08/Aug-12_Salad_Western.jpg), official current menu artwork | Chicken sesame M/L ฿115/135; chicken Caesar M/L ฿119/139; grilled salmon ฿369. Sheets are not standalone dish images. |
| J-T | [Jones spicy Thai sheet](https://www.jonessalad.com/wp-content/uploads/2026/08/Aug-13_Salad_SpicyThai.jpg), linked official artwork | Chicken larb and crispy rice salad M/L ฿129/149. |
| J-C | [Jones steak menu](https://www.jonessalad.com/menu/steak/) → [chicken breast sheet](https://www.jonessalad.com/wp-content/uploads/2026/08/Aug-18_Steak_Chicken-Breast.jpg) | Caribbean chicken ฿199. |
| J-F | [Jones fish sheet](https://jonessalad.com/wp-content/uploads/2026/03/menu-2026_Steak_Fish.jpg), linked official artwork | Current fish variants do not identify the catalog's honey-lemon basa. |
| J-S | [Jones soup menu](https://www.jonessalad.com/menu/soup/) → [soup sheet](https://www.jonessalad.com/wp-content/uploads/2026/07/Soup-Menu-AW.jpg) | Plain mushroom soup ฿59; truffle/topping alternatives differ. |
| F | [Fuji English menu](https://www.fuji.co.th/menu/?lang=en), official menu | Six exact prices; retain branch exceptions, especially Phuket/Koh Samui. No delivery price inferred. |
| M1 | [MK English suki](https://www.mkrestaurant.com/en/mk-menu/suki/), official menu | Existing Kurobuta and premium-set prices agree. Premium set has branch availability qualifications. |
| M2 | [MK English suki page 2](https://www.mkrestaurant.com/en/mk-menu/suki?p=2) and [Thai page 2](https://www.mkrestaurant.com/th/mk-menu/suki?p=2), official menus | Special vegetables ฿72; shabu pork ฿72. Health vegetables small English ฿188 versus Thai ฿193: unresolved conflict. |
| MS | [MK prepared single dishes](https://www.mkrestaurant.com/en/mk-menu/single-dish), official menu | Exact seafood suki soup ฿142. |
| S-G | [Sukiya grand menu](https://www.sukiya.co.th/menu/grandmenu.html) → [gyudon sheet](https://www.sukiya.co.th/menu/img/menu/menu_gyudon.jpg) | Exact M plain gyudon ฿89; M okra/bonito gyudon ฿119. |
| S-C | [Sukiya curry sheet](https://www.sukiya.co.th/menu/img/menu/menu_curry.jpg), linked official artwork | Plain M curry ฿89, distinct from beef curry. |
| S-A | [Sukiya à la carte sheet](https://www.sukiya.co.th/menu/img/menu/menu_alacarte.jpg), linked official artwork | M beef plate ฿75; salad ฿45; miso soup ฿30. |
| SF-ST | [Santa Fe main site](https://www.santafesteak.com/santafesteak/frontends/index/en) and [fish menu](https://www.santafesteak.com/santafesteak/frontends/fish/en), official routes | Category artwork missing/empty; linked dated 2024 news and February 2025 promotion are not a current menu. Existing third-party prices not reverified. |
| N-B | [Nittaya official menus](https://www.nittayakaiyang.com/en/menus/) → [brand-linked bookcase](https://pubhtml5.com/bookcase/vjih/) → [current book](https://online.pubhtml5.com/ecjt/fxjd/index.html), official-published menu hosted on PubHTML5 | Bookcase publication 08/12/2025; current official link. Viewer spreads 12–13, 14–15, 16–17, 20–21 supply grilled, papaya, larb and soup evidence. |
| N-R | [Nittaya recommended dishes](https://www.nittayakaiyang.com/en/nittaya-kai-yang-recommended-menu/), official page | Existing whole-chicken and salted-egg salad photos; Tom Yong is a different named soup. |
| N-G | [Nittaya fried/grilled category](https://www.nittayakaiyang.com/en/menus_categories/ปิ้ง-ย่าง-ทอด/), official menu | Individual Chiang Mai fried pork and plain grilled pork-neck photographs. |
| N-P | [Nittaya papaya category](https://www.nittayakaiyang.com/en/menus_categories/ส้มตำ/), official menu | Plain Thai papaya salad photograph. |
| N-L | [Nittaya larb category](https://www.nittayakaiyang.com/en/menus_categories/ลาบ-น้ำตก/), official menu | Exact pork larb; original 1042×1043 JPG loaded, unlike the earlier Slice 29 failure. |
| Z | [Zaab Eli Instagram discovery route](https://www.instagram.com/zaabeli/), probable brand social route | No accessible exact current menu evidence obtained. The similarly named US food-truck website was excluded. |
| SN | [Somtam Nua Thailand Facebook discovery route](https://www.facebook.com/Somtamnuathailand/), probable brand social route | Public menu evidence inaccessible through the available tools; no login attempted. |
| T | [ThongSmith profile](https://linktr.ee/thongsmith) → [brand-linked bookcase](https://anyflip.com/bookcase/jpekz) → [main menu](https://online.anyflip.com/iugnb/rchh/index.html), official-published menu hosted on AnyFlip | Main book supplies exact dry-rice and meatball prices. New-menu one-page book is a different supplement. Preserve stated 10% service-charge qualification. |
| ST | [Minor Food: The Steak & More](https://www.minorfood.com/en/our-business/the-steak-and-more), official corporate page | Brand route exists but no itemized current menu. Linked [official Facebook](https://www.facebook.com/profile.php?id=61571163564316) inaccessible to public extraction. Hero photographs cannot establish exact catalog dishes. |

## 5. Price audit summary

| Classification | Count |
| --- | ---: |
| `VERIFIED_EXISTING` | 14 |
| `CORRECTION_REQUIRED` | 1 |
| `VERIFIED_NEW` | 20 |
| `AMBIGUOUS` | 17 |
| `NOT_FOUND` | 32 |
| **Total** | **84** |

The 14 existing agreements are Ootoya's five prices, MK's three, 7-Eleven's two, and four Nittaya prices. Their item-level amounts and evidence appear in Appendix A. An existing price classified `NOT_FOUND` means it could not be reverified under this slice's policy; it does not prove the stored amount is wrong.

## 6. Image audit summary

| Classification | Count |
| --- | ---: |
| `VERIFIED_EXISTING` | 16 |
| `CORRECTION_REQUIRED` | 2 |
| `OFFICIAL_CANDIDATE` | 5 |
| `WEAK_CANDIDATE` | 23 |
| `NOT_FOUND` | 38 |
| **Total** | **84** |

Five additions are isolated official images: MK small health vegetables and Nittaya pork neck, plain Thai papaya, pork larb, and Chiang Mai fried pork. Menu sheets and set photographs remain withheld. First-party origin alone does not make a collage or wrong portion suitable.

## 7. Existing remote-image health

**16 healthy, one questionable, two broken.** All 19 are individually listed in Appendix B with exact stored URL, provenance page, format, confidence and check notes. Healthy means the exact image decoded on the official page or in direct browser navigation and its dish association was supported. HTTP headers/status could not be independently obtained; the result is a browser content/health assessment.

Static, nonsigned paths on brand domains appear persistent and were accessible without a session. That is an observation, not a promise of future hotlink access or rights. The two Salad Factory paths are unsuitable: an image extension in a URL does not establish image content.

## 8. Restaurant-by-restaurant coverage

| Restaurant ID/name | Items | Existing prices | New prices | Price corrections | Ambiguous / not found | Existing images | New official images | Weak / not found | Image corrections |
| --- | ---: | ---: | ---: | ---: | --- | ---: | ---: | --- | ---: |
| `ootoya-thailand` / Ootoya | 6 | 5 | 0 | 0 | 1 / 0 | 3 | 0 | 2 / 1 | 0 |
| `salad-factory-thailand` / Salad Factory | 6 | 3 | 0 | 0 | 6 / 0 | 2 | 0 | 0 / 4 | 2 |
| `seven-eleven-thailand` / 7-Eleven Thailand | 6 | 2 | 0 | 0 | 2 / 2 | 2 | 0 | 2 / 2 | 0 |
| `jones-salad-thailand` / Jones' Salad | 7 | 0 | 3 | 0 | 3 / 1 | 0 | 0 | 6 / 1 | 0 |
| `fuji-japanese-restaurant-thailand` / Fuji Japanese Restaurant | 6 | 0 | 6 | 0 | 0 / 0 | 4 | 0 | 2 / 0 | 0 |
| `mk-restaurants-thailand` / MK Restaurants | 7 | 3 | 3 | 0 | 1 / 0 | 6 | 1 | 0 / 0 | 0 |
| `sukiya-thailand` / Sukiya | 6 | 0 | 6 | 0 | 0 / 0 | 0 | 0 | 6 / 0 | 0 |
| `santa-fe-steak-thailand` / Santa Fe' Steak | 7 | 2 | 0 | 0 | 0 / 7 | 0 | 0 | 0 / 7 | 0 |
| `nittaya-kai-yang-thailand` / Nittaya Kai Yang | 7 | 5 | 0 | 1 | 2 / 0 | 2 | 4 | 1 / 1 | 0 |
| `zaab-eli-thailand` / Zaab Eli | 7 | 4 | 0 | 0 | 0 / 7 | 0 | 0 | 0 / 7 | 0 |
| `somtam-nua-thailand` / Somtam Nua | 8 | 0 | 0 | 0 | 0 / 8 | 0 | 0 | 0 / 8 | 0 |
| `thongsmith-boat-noodle-thailand` / ThongSmith | 5 | 0 | 2 | 0 | 2 / 1 | 0 | 0 | 4 / 1 | 0 |
| `steak-and-more-thailand` / The Steak & More | 6 | 0 | 0 | 0 | 0 / 6 | 0 | 0 | 0 / 6 | 0 |

Existing columns count populated source fields, not current verification. The Nittaya weak-image count includes its existing whole-chicken photograph.

Fuji and Sukiya are the clearest price batches; Nittaya is the clearest new image batch. MK is mostly strong except for the bilingual health-vegetable price conflict. Jones offers three unambiguous additions but its size-dependent salads remain withheld. ThongSmith's endorsed book supplies two exact additions, while noodle combinations remain ambiguous. Ootoya's five stored prices agree; the sixth catalog dish has no exact match. 7-Eleven's two stored prices agree only for the displayed online window; expiry and reformulation limit further enrichment. Santa Fe, Zaab Eli, Somtam Nua and The Steak & More remain incomplete. Salad Factory's live domain/provenance failure prevents relying on its cached menu.

## 9. VERIFIED_NEW price candidates

Every row has currency **THB**, current GoodFood price **absent**, and check date **2026-09-30**. Brand names/IDs and exact item names are resolved in Appendix A. Source keys resolve to direct URLs and source types in section 4. Listed amounts are for the specified dish/portion, not delivery equivalents or a different set.

| Restaurant | Item ID | Verified amount (THB) | Source | Exact serving/evidence note |
| --- | --- | ---: | --- | --- |
| Jones' Salad | `jones-grilled-salmon-salad` | 369 | J-W | Exact grilled salmon salad at single listed price; menu collage is not a standalone dish asset. |
| Jones' Salad | `jones-caribbean-chicken-steak` | 199 | J-C | Exact Caribbean chicken breast steak; menu collage withheld as image. |
| Jones' Salad | `jones-mushroom-soup` | 59 | J-S | Plain mushroom soup, excluding truffle/topping alternatives; menu collage withheld as image. |
| Fuji Japanese Restaurant | `fuji-salmon-shioyaki-brown-rice-set` | 330 | F | Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes. |
| Fuji Japanese Restaurant | `fuji-salmon-shioyaki` | 290 | F | Shioyaki à la carte, not set; branch exceptions apply. Set/combined photograph withheld. |
| Fuji Japanese Restaurant | `fuji-salmon-tataki` | 270 | F | Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes. |
| Fuji Japanese Restaurant | `fuji-kinoko-mushroom-salad` | 180 | F | Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes. |
| Fuji Japanese Restaurant | `fuji-chicken-teriyaki` | 170 | F | Chicken teriyaki à la carte ฿170, not ฿210 set; branch exceptions apply. Set photograph withheld. |
| Fuji Japanese Restaurant | `fuji-chirashi-sushi-don-set` | 390 | F | Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes. |
| MK Restaurants | `mk-special-vegetable-set` | 72 | M2 | Exact special vegetable set, agreeing English/Thai menus; existing JPG decodes. |
| MK Restaurants | `mk-seafood-suki-broth` | 142 | MS | Exact prepared seafood suki soup, not loose ingredients; existing JPG decodes. |
| MK Restaurants | `mk-pork-shabu` | 72 | M2 | Exact pork shabu plate, agreeing current menus; existing JPG decodes. |
| Sukiya | `sukiya-gyudon-regular` | 89 | S-G | Exact plain gyudon size M; S/L/LL excluded. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| Sukiya | `sukiya-gyudon-okra-regular` | 119 | S-G | Exact bonito/okra gyudon size M; other sizes excluded. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| Sukiya | `sukiya-curry-rice-regular` | 89 | S-C | Plain curry rice size M; beef curry and other toppings excluded. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| Sukiya | `sukiya-beef-plate-no-rice` | 75 | S-A | Exact beef plate size M without rice. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| Sukiya | `sukiya-salad` | 45 | S-A | Exact standalone salad, not bowl topping. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| Sukiya | `sukiya-miso-soup` | 30 | S-A | Plain miso soup, not pork miso soup. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| ThongSmith | `thongsmith-dry-rice-kurobuta-braised-pork` | 239 | T | Spread 14–15, G8 exact sliced Kurobuta and braised-pork rice bowl. Listed amount; stated 10% service charge additional. Photograph embedded in menu collage, withheld. |
| ThongSmith | `thongsmith-grilled-pork-meatballs` | 119 | T | Spread 2–3, A1 grilled pork meatballs, three skewers/plate with sweet chili dip. Listed amount; stated 10% service charge additional. Photograph embedded in menu collage, withheld. |

Recheck these sources immediately before Slice 35B. Carry channel, branch, set/portion and service-charge qualifications into localized notes. Do not change nutrition or relation semantics to make a price fit.

## 10. CORRECTION_REQUIRED prices

| Restaurant ID/name | Item ID/name | Current | Verified | Currency | Evidence | Check date |
| --- | --- | ---: | ---: | --- | --- | --- |
| `nittaya-kai-yang-thailand` / Nittaya Kai Yang | `nittaya-grilled-pork-neck` / Grilled Pork Neck | 130 | 140 | THB | N-B, viewer spread 12–13: plain grilled pork neck, not the separately named salt-seasoned variant. Official-published current linked menu. | 2026-09-30 |

No other price was called wrong without current exact first-party evidence. Cached Salad Factory amounts and older Santa Fe/Zaab Eli aggregator prices are withheld, not automatic corrections.

## 11. OFFICIAL_CANDIDATE images

Current image is **absent** for every candidate. All are **JPG**, checked **2026-09-30**, with high exact-dish confidence supported by the official adjacent item name and visual inspection. Static URLs have no visible token/expiry and loaded read-only; hotlink continuity and rights remain subject to recheck. No asset was downloaded or added.

| Restaurant ID/name | Item ID | Exact candidate asset | Source/type | Suitability |
| --- | --- | --- | --- | --- |
| `mk-restaurants-thailand` / MK Restaurants | `mk-health-vegetable-set-small` | [500×500 photo](https://www.mkrestaurant.com/public/uploads/mk_menu/images/9618d5c6fad45c5a7d6dd01524873ca7.jpg) | M2 Thai page, official static asset | Exact small health-vegetable plate; image eligibility is independent of the unresolved price. |
| `nittaya-kai-yang-thailand` / Nittaya Kai Yang | `nittaya-grilled-pork-neck` | [Original dish photo](https://www.nittayakaiyang.com/wp-content/uploads/2023/04/คอหมูย่าง-07.jpg) | N-G, official WordPress asset | Individual plate with dipping sauce; matches plain grilled pork neck. |
| `nittaya-kai-yang-thailand` / Nittaya Kai Yang | `nittaya-som-tam-thai` | [Original dish photo](https://www.nittayakaiyang.com/wp-content/uploads/2023/03/ส้มตำไทย-1.jpg) | N-P, official WordPress asset | Plain Thai papaya salad, not salted-egg variant. |
| `nittaya-kai-yang-thailand` / Nittaya Kai Yang | `nittaya-larb-moo` | [1042×1043 photo](https://www.nittayakaiyang.com/wp-content/uploads/2023/04/ลาบหมู-07.jpg) | N-L, official WordPress asset | Exact minced-pork spicy salad; original decoded successfully in final verification. |
| `nittaya-kai-yang-thailand` / Nittaya Kai Yang | `nittaya-chiang-mai-fried-pork` | [Original dish photo](https://www.nittayakaiyang.com/wp-content/uploads/2023/04/หมูทอดเชียงใหม่-07.jpg) | N-G, official WordPress asset | Exact fried pork; distinct from semi-dried pork. |

## 12. Existing-image corrections/issues

- **Two corrections:** `salad-factory-grilled-chicken-sesame` and `salad-factory-kale-chicken-truffle`. Exact stored JPG URLs serve unrelated HTML/404 content, and the historical source page no longer establishes restaurant provenance. No verified replacement was found. Slice 35B should remove the failing references or replace them only after new exact evidence; it must not transplant a logo/placeholder returned by those routes.
- **One withheld review:** `nittaya-grilled-chicken-quarter`. The PNG still loads and is official, but it shows a whole chopped chicken. The existing serving note explains whole/half sales and individual portion estimation, so this is classified `WEAK_CANDIDATE`/questionable rather than a proven broken URL. Do not present the photograph as exact quarter-portion evidence. No replacement or automatic removal is approved by this audit's safe batch.
- **Crop issue, not a correction:** healthy square/portrait official images are rendered with `object-fit: cover` in a capped 4:3 frame. At desktop the frame can become much wider than the source composition. Image-specific crop QA is needed in any later integration; no crop was fabricated here.

## 13. Ambiguous/weak candidates withheld

| Group | Reason for withholding |
| --- | --- |
| Ootoya grilled salmon bowl | O79 is raw marinated salmon. ฿329/359 cannot price the grilled dish; its photo is rejected, not an exact candidate. |
| Ootoya Hokke/Oyakodon photographs | Exact dish occurs in a set photograph, whereas the catalog serving is à la carte/single bowl. No automatic crop or inclusion of unpriced sides. |
| Salad Factory six prices / four missing images | Former product pages are cached; live routes do not verify the brand's menu. Calorie values duplicated into currency fields in extraction are not prices. Public social/profile discovery did not provide exact current item truth. |
| 7-Eleven Korean chicken rice | Reformulated product, additional egg, out of stock, and price window ending check date. Do not silently attach current packaging/price to unchanged catalog semantics. |
| 7-Eleven chicken suki | The related-product link is chicken suki without an exact rice/variant match. No new price or photo accepted from it. |
| Jones chicken sesame / chicken Caesar / chicken larb | M/L prices differ; GoodFood does not define the size. The menu sheets are collages. |
| Jones honey-lemon basa | Current fish sheet offers other preparations. Their price/photo cannot stand in for honey-lemon basa. |
| Fuji à la carte salmon / chicken images | Current combined/set artwork cannot verify the catalog's à la carte photo independently. Price evidence remains usable. |
| MK health vegetables small | English ฿188 versus Thai ฿193 for the small health set. No silently preferred language/channel. Exact Thai image is separately acceptable. |
| Sukiya images | Individual plain-bowl thumbnail does not identify M size; other evidence is menu-sheet photography or different curry toppings. No menu screenshot/collage extraction accepted. |
| Nittaya chicken / soup | Menu prices whole/half chicken at ฿230/120, not a sold quarter. Tom Yong ฿145 is not the catalog's Tom Saep. Whole chicken image remains a portion concern. |
| ThongSmith noodles | Main menu distinguishes ribeye alone versus ribeye with meatball/braised additions (฿499/529), and Kurobuta alone versus combinations (฿229/259). Catalog names lack exact combination codes. All available photos are part of menu layouts. |

## 14. NOT_FOUND summary

`NOT_FOUND` is bounded research failure under the source policy, not proof that a restaurant no longer sells a dish or that an image does not exist anywhere. Exact missing IDs and separate price/image outcomes are in Appendix A.

Santa Fe's live category pages lack usable menu artwork and dated news is insufficient. Zaab Eli and Somtam Nua discovery leads did not yield accessible exact current official evidence. The Steak & More has a corporate first-party route but no accessible itemized menu. 7-Eleven bulgogi and sticky-rice variants, Jones honey-lemon basa, ThongSmith shredded chicken, and the mismatched Ootoya/Nittaya variants were left incomplete after reasonable brand-level paths. No attempt was made to equalize coverage.

The Salad Factory ordering redirect reached LINE authentication. **Automatic approval review rejected access to that authentication origin because a sign-in/session flow was outside the read-only audit.** No bypass, alternate authentication route, or sign-in was attempted. The user subsequently instructed that all sign-in routes remain excluded. Public profile information alone does not verify item prices or images.

## 15. Menu-card visual audit

Read-only browser inspection used a prototype-enabled Vite preview at `127.0.0.1:5174`, English locale, at **390×844** and **1440×900**. The four catalog combinations were inspected in completed Explore Pick cards at both sizes, using unique search results so no data or random pool was changed:

| Combination | Representative | Observed treatment |
| --- | --- | --- |
| Image + price | Ootoya charcoal-grilled mackerel | Real photo and small provenance link precede name/identity. Nutrition precedes serving context, price ฿279, recipe bridge, restaurant action; one sponsored separator follows completed result/actions. |
| Image + no price | Fuji Kinoko salad | Photo, name, Fuji identity, nutrition and restaurant action remain coherent. Price section is omitted entirely; no broken dash or empty price panel. |
| No image + price | Ootoya Shima Hokke | Card begins directly with category/name; nutrition and detailed set context occupy much of the card before ฿399. No blank image rectangle is reserved. |
| No image + no price | Jones chicken Caesar | Compact text card, restaurant identity, nutrition, customization, recipe bridge/action. The bridge recipe thumbnail is a separate recipe image, not a restaurant-food substitute. |

Concrete observations:

- Dish name is the strongest text element; small uppercase category and orange restaurant name establish context. Identity initials help orientation but are visually quiet; several brands use derived initials rather than bespoke metadata.
- Focus nutrition gives kcal and protein stronger weight than carbs/fat and confidence. Ordinary feed puts all nutrient values into one small wrapping row, which is denser and harder to scan on mobile.
- Missing-image cards do not look technically broken: `MenuItemImage` returns nothing for absent/failed images. However, many consecutive text cards offer little visual differentiation. Height varies with serving/customization notes, so long notes can dominate content more than the dish identity.
- Missing-price Pick cards look intentional because the section is omitted. The user loses buying context without an explicit statement of unknown price; do not introduce estimated prices to fill that gap.
- Mobile photographs contribute clear food identity; small provenance text remains legible but subordinate. Desktop focus cards remain in a narrow centered content column; the 240px image-height cap makes wide images visibly cropped. Kinoko's bowl composition demonstrates this crop, although the food is recognizable.
- At desktop, ordinary Explore cards measured **640px wide**, stacked in a single column. The 84-result feed contained six sponsored separators in the prototype-enabled DOM. Those observations concern the existing layout; this audit does not revise Slice 34 cadence.
- The ordinary Explore feed has **zero menu-image figures and no price sections by design**, regardless of the catalog combination. Source confirms `focus && <MenuItemImage ...>` and `focus && <MealContextDetails ...>` in `ExploreItemCard`. Restaurant-local ordinary lists also omit image/price. Consequently data-only Slice 35B cannot promise a richer ordinary browse feed.
- Sponsored separators use a dashed, muted box with explicit **Sponsored · โฆษณา** text, unlike a white menu card with heart/action controls. In the reviewed completed-result screens the single ad follows the result/actions; it does not interrupt the Recipe ↔ Restaurant bridge. Real photographs are more salient than the mock ad; text-only cards rely more heavily on typography and identity.
- No horizontal overflow was observed in the reviewed mobile/desktop samples. At the 390px override the document's content/scroll widths were both 375px after the browser's vertical scrollbar; at 1440px both were 1425px. These are rendered client-width measurements, not changed viewport targets.

No screenshots were downloaded, no markup/style was altered, and no final design was selected.

## 16. No-image card improvement options

| Complexity | Small option | Existing system to reuse / boundary |
| --- | --- | --- |
| LOW | Give restaurant identity/name slightly more visual weight in text-only cards | Reuse the existing initials component and orange brand-name line; use already present cuisine/category metadata, without inventing a logo or new brand claim. |
| LOW | Apply the existing focus kcal/protein hierarchy to ordinary menu rows | Reuse primary/secondary nutrition typography and confidence badges; keep serving context secondary. This improves scanning without requiring an image. |
| MEDIUM | Define a deliberate compact text-only card spacing variant | Conditionally tune padding/gaps and category/name grouping when no usable image exists. Preserve the existing palette, favorite/action placement and truthful content; reserve no large empty media box. |

These are options ranked by complexity, not an approved redesign. The visual audit supports a small typography/identity improvement, but feed exposure of images/prices is a separate product decision. Do not use generated food, stock food, arbitrary filler gradients, or recipe photos as restaurant menu photos.

## 17. Recommended scope for Slice 35B

1. Add **20** prices listed in section 9, preserving exact portion/channel/branch qualifications and rechecking the live menu.
2. Correct **one** price: Nittaya plain grilled pork neck **฿130 → ฿140**.
3. Add **five** official image candidates in section 11 after normal asset/provenance and crop verification.
4. Correct **two** existing image references: remove the broken Salad Factory references if no new exact replacement is verified. This audit supplies no safe replacement for them.
5. Keep **one** additional existing image under explicit portion review: Nittaya whole-chicken photograph. It is not counted as a safe correction or new image.

After this evidence-based batch, **64 items intentionally remain incomplete in at least one dimension**: 49 lack a currently verified exact price, 63 lack a verified/safe exact image, and 48 lack both. Only 20 have strong evidence in both dimensions. These counts include existing unverified fields rather than treating them as trustworthy by presence alone.

Raw populated-field counts would become **44 prices** (24 + 20) and **22 images** (19 + 5 − 2 broken references), assuming removal of both broken references and retention of the one questionable portion image. Strongly supported totals would be **35 prices** and **21 images**. The nine existing unverified prices are not silently deleted or reclassified as verified.

Keep the narrow implementation batch focused on these data/reference changes. A small no-image typography/identity adjustment is supported by the visual audit, but requires a distinct approved UI scope; it is not implemented or silently included here. Exposing existing data in ordinary discovery cards should be decided explicitly because the approved current UI intentionally omits it.

## 18. Explicit non-goals / withheld changes

- No production catalog, UI, filtering, counts, favorites, random candidate pools, nutrition, serving semantics, relations, bridge structure, or ad behavior changed.
- No dependencies or tests changed; no image downloaded, bundled, cropped, generated or replaced.
- No guesses for missing prices, no cached/aggregator promotion to current truth, and no inferred portion/set price.
- No sign-in, order, cart submission, social message, or source-access bypass.
- No Slice 35B implementation, commit or push.

### Verification

| Check | Result |
| --- | --- |
| Relevant active-checkout tests | `npx vitest run src/restaurants.test.ts src/restaurant-app.test.tsx src/menu-image.test.tsx src/restaurant-identity.test.tsx --exclude '**/.kilo/**' --maxWorkers 2`: **4 files, 194 tests passed**. Final run 25.61s; baseline active-checkout run also passed 194 tests. |
| TypeScript | `npx tsc --noEmit`: passed, exit 0. |
| Git whitespace | `git diff --check`: passed. The new untracked document was also checked against an empty file using `git diff --no-index --check`; no whitespace errors. Its exit 1 denotes differing files; Git also emitted an LF→CRLF normalization warning, not a whitespace error. |
| Appendix reconciliation | 84 unique item IDs match current source; exactly one independent price and image classification per item; 19 existing-image entries; all 18 requested sections. Summary and per-brand totals agree. |
| Catalog recount | Current source reconfirmed 13 restaurants, 84 items, 24 prices, 19 images, 19 official-remote, zero bundled images. |
| Production files unchanged | `git diff --name-only HEAD -- src package.json package-lock.json` returned no changes. Final status contains only the new audit document. |
| Visual inspection | Four content combinations at 390×844 and 1440×900, plus ordinary Explore feed and completed-result sponsored separators; findings in section 15. Temporary viewport override reset. |

An initial broad test-file invocation also matched historical `.kilo` copies (12 files/582 tests). That run is not used as the active-checkout verification claim; the explicit exclusion above isolates the four relevant current test files. No test or configuration edit was needed.

## Appendix A. All 84 menu items — independent classifications

Check date for **every row: 2026-09-30**. Currency for every populated price: **THB**. A dash means no verified amount/asset, not zero. Current values are catalog values at audit entry; verified amounts are restricted to `VERIFIED_EXISTING`, `VERIFIED_NEW` and `CORRECTION_REQUIRED`. Keys refer to section 4; image corrections and existing exact asset URLs are detailed in Appendix B. Candidate image URLs are in section 11. Item names and restaurant IDs are retained for unambiguous implementation mapping.

### Ootoya — `ootoya-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `ootoya-grilled-mackerel` / Charcoal-Grilled Mackerel | 279 | `VERIFIED_EXISTING` | 279 | Present | `VERIFIED_EXISTING` | O3: Exact à la carte main dish; set price excluded. Official PNG decodes. |
| `ootoya-shima-hokke-grilled` / Charcoal-Grilled Shima Hokke | 399 | `VERIFIED_EXISTING` | 399 | Absent | `WEAK_CANDIDATE` | O1: À la carte price agrees; available photo depicts full set, withheld. |
| `ootoya-grilled-moromi-chicken` / Charcoal-Grilled Chicken with Moromi Sauce | 259 | `VERIFIED_EXISTING` | 259 | Present | `VERIFIED_EXISTING` | O35: Exact à la carte main dish; official main-plate PNG decodes. |
| `ootoya-oyakodon` / Oyakodon (Chicken & Egg Rice Bowl) | 199 | `VERIFIED_EXISTING` | 199 | Absent | `WEAK_CANDIDATE` | O72: Single bowl price agrees; photograph includes set sides, withheld. |
| `ootoya-tonteki-pork-chop-set` / Charcoal-Grilled Tonteki Pork Chop Set | 429 | `VERIFIED_EXISTING` | 429 | Present | `VERIFIED_EXISTING` | O30: Catalog explicitly names set. Existing photo represents its exact main plate. |
| `ootoya-grilled-salmon-rice-bowl` / Grilled Salmon Rice Bowl | — | `AMBIGUOUS` | — | Absent | `NOT_FOUND` | O79: Official raw marinated salmon bowl is a different preparation; ฿329/359 and its photo rejected. |

### Salad Factory — `salad-factory-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `salad-factory-grilled-chicken-sesame` / Japanese-Style Grilled Chicken Breast Salad, Sesame Dressing | 155 | `AMBIGUOUS` | — | Present | `CORRECTION_REQUIRED` | SF / SF-L: Cached possible menu evidence is contradicted by live unrelated domain/404 content; no safe current price or replacement. |
| `salad-factory-quinoa-chicken-basil` / Quinoa Salad with Grilled Chicken Breast, Spicy Holy Basil | 195 | `AMBIGUOUS` | — | Absent | `NOT_FOUND` | SF / SF-L: Cached possible menu evidence is contradicted by live unrelated domain/404 content; no safe current price or replacement. |
| `salad-factory-kale-chicken-truffle` / Kale Salad with Chicken Breast, Truffle Dressing | 235 | `AMBIGUOUS` | — | Present | `CORRECTION_REQUIRED` | SF / SF-L: Cached possible menu evidence is contradicted by live unrelated domain/404 content; no safe current price or replacement. |
| `salad-factory-rocket-skirt-steak` / Rocket Salad with Grilled Skirt Steak, Balsamic | — | `AMBIGUOUS` | — | Absent | `NOT_FOUND` | SF / SF-L: Cached possible menu evidence is contradicted by live unrelated domain/404 content; no safe current price or replacement. |
| `salad-factory-spicy-pork-tenderloin` / Spicy Pork Tenderloin Salad | — | `AMBIGUOUS` | — | Absent | `NOT_FOUND` | SF / SF-L: Cached possible menu evidence is contradicted by live unrelated domain/404 content; no safe current price or replacement. |
| `salad-factory-salmon-sashimi-shoyu` / Salmon Sashimi Salad, Shoyu-Wasabi Dressing | — | `AMBIGUOUS` | — | Absent | `NOT_FOUND` | SF / SF-L: Cached possible menu evidence is contradicted by live unrelated domain/404 content; no safe current price or replacement. |

### 7-Eleven Thailand — `seven-eleven-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `seven-eleven-chicken-sukiyaki` / Ezy Choice Chicken Sukiyaki Rice | — | `AMBIGUOUS` | — | Absent | `WEAK_CANDIDATE` | 7S: Related chicken suki 250g listing does not verify catalog rice/preparation variant; price/photo withheld. |
| `seven-eleven-garlic-pork-egg-rice` / Ezygo Garlic Pork with Fried Egg and Rice | 49 | `VERIFIED_EXISTING` | 49 | Present | `VERIFIED_EXISTING` | 7P: Exact Ezygo 250g online product; displayed window ends 30/09/2026. JPG decodes; no in-store inference. |
| `seven-eleven-green-curry-chicken` / Chef Cares Green Curry with Chicken Breast and Jasmine Rice | 49 | `VERIFIED_EXISTING` | 49 | Present | `VERIFIED_EXISTING` | 7G: Exact Chef Cares 275g online product; displayed window ends 30/09/2026. JPG decodes; no in-store inference. |
| `seven-eleven-pork-bulgogi-rice` / Happy Chef Pork Bulgogi Rice | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | 7P / 7G / 7K / 7S: No exact current first-party price or suitable dish image obtained. |
| `seven-eleven-korean-chicken-fried-rice` / Ezygo Korean Chicken Fried Rice | — | `AMBIGUOUS` | — | Absent | `WEAK_CANDIDATE` | 7K: ฿45 reformulated 250g product adds egg; out of stock and window ends check date. Not assigned to unchanged catalog. |
| `seven-eleven-sticky-rice-dried-pork` / Sticky Rice with Dried Pork and Jaew Sauce | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | 7P / 7G / 7K / 7S: No exact current first-party price or suitable dish image obtained. |

### Jones' Salad — `jones-salad-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `jones-chicken-sesame-salad` / Grilled Chicken Breast Salad, Roasted Sesame Dressing | — | `AMBIGUOUS` | — | Absent | `WEAK_CANDIDATE` | J-W: M/L prices differ; catalog has no size. Official menu-sheet collage withheld as image. |
| `jones-grilled-salmon-salad` / Grilled Salmon Salad | — | `VERIFIED_NEW` | 369 | Absent | `WEAK_CANDIDATE` | J-W: Exact grilled salmon salad at single listed price; menu collage is not a standalone dish asset. |
| `jones-caesar-chicken-salad` / Caesar Chicken Salad | — | `AMBIGUOUS` | — | Absent | `WEAK_CANDIDATE` | J-W: M/L prices differ; catalog has no size. Official menu-sheet collage withheld as image. |
| `jones-chicken-larb-crispy-rice-salad` / Chicken Larb & Crispy Rice Salad | — | `AMBIGUOUS` | — | Absent | `WEAK_CANDIDATE` | J-T: M/L prices differ; catalog has no size. Official menu-sheet collage withheld as image. |
| `jones-caribbean-chicken-steak` / Caribbean Chicken Breast Steak | — | `VERIFIED_NEW` | 199 | Absent | `WEAK_CANDIDATE` | J-C: Exact Caribbean chicken breast steak; menu collage withheld as image. |
| `jones-honey-lemon-basa-steak` / Honey Lemon Basa Fish Steak | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | J-F: Current sheet contains other basa sauces, not exact honey-lemon preparation. Their prices/images rejected. |
| `jones-mushroom-soup` / Mushroom Soup | — | `VERIFIED_NEW` | 59 | Absent | `WEAK_CANDIDATE` | J-S: Plain mushroom soup, excluding truffle/topping alternatives; menu collage withheld as image. |

### Fuji Japanese Restaurant — `fuji-japanese-restaurant-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `fuji-salmon-shioyaki-brown-rice-set` / Salmon Shioyaki with Brown Rice Set | — | `VERIFIED_NEW` | 330 | Present | `VERIFIED_EXISTING` | F: Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes. |
| `fuji-salmon-shioyaki` / Grilled Salmon Shioyaki | — | `VERIFIED_NEW` | 290 | Absent | `WEAK_CANDIDATE` | F: Shioyaki à la carte, not set; branch exceptions apply. Set/combined photograph withheld. |
| `fuji-salmon-tataki` / Salmon Tataki Salad | — | `VERIFIED_NEW` | 270 | Present | `VERIFIED_EXISTING` | F: Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes. |
| `fuji-kinoko-mushroom-salad` / Kinoko (Mushroom) Salad | — | `VERIFIED_NEW` | 180 | Present | `VERIFIED_EXISTING` | F: Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes. |
| `fuji-chicken-teriyaki` / Chicken Teriyaki | — | `VERIFIED_NEW` | 170 | Absent | `WEAK_CANDIDATE` | F: Chicken teriyaki à la carte ฿170, not ฿210 set; branch exceptions apply. Set photograph withheld. |
| `fuji-chirashi-sushi-don-set` / Chirashi Sushi Rice Bowl Set | — | `VERIFIED_NEW` | 390 | Present | `VERIFIED_EXISTING` | F: Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes. |

### MK Restaurants — `mk-restaurants-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `mk-health-vegetable-set-small` / Health Vegetable Set (Small) | — | `AMBIGUOUS` | — | Absent | `OFFICIAL_CANDIDATE` | M2: Thai ฿193 conflicts with English ฿188. Exact small-set Thai image verified independently, 500×500 JPG. |
| `mk-special-vegetable-set` / Special Vegetable Set | — | `VERIFIED_NEW` | 72 | Present | `VERIFIED_EXISTING` | M2: Exact special vegetable set, agreeing English/Thai menus; existing JPG decodes. |
| `mk-special-kurobuta-set` / Special Kurobuta Set | 223 | `VERIFIED_EXISTING` | 223 | Present | `VERIFIED_EXISTING` | M1: Exact special Kurobuta set; existing JPG decodes. |
| `mk-special-kurobuta-plate` / Special Kurobuta (Single Plate) | 75 | `VERIFIED_EXISTING` | 75 | Present | `VERIFIED_EXISTING` | M1: Exact single Kurobuta plate; existing JPG decodes. |
| `mk-premium-suki-set` / Premium Suki Set (Single Pot) | 259 | `VERIFIED_EXISTING` | 259 | Present | `VERIFIED_EXISTING` | M1: Exact single-pot premium set; branch-limited availability must remain qualified. Existing JPG decodes. |
| `mk-seafood-suki-broth` / Seafood Suki (Prepared, Broth Style) | — | `VERIFIED_NEW` | 142 | Present | `VERIFIED_EXISTING` | MS: Exact prepared seafood suki soup, not loose ingredients; existing JPG decodes. |
| `mk-pork-shabu` / Pork Shabu | — | `VERIFIED_NEW` | 72 | Present | `VERIFIED_EXISTING` | M2: Exact pork shabu plate, agreeing current menus; existing JPG decodes. |

### Sukiya — `sukiya-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `sukiya-gyudon-regular` / Gyudon Beef Rice Bowl (M) | — | `VERIFIED_NEW` | 89 | Absent | `WEAK_CANDIDATE` | S-G: Exact plain gyudon size M; S/L/LL excluded. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| `sukiya-gyudon-okra-regular` / Gyudon with Bonito Flakes & Okra (M) | — | `VERIFIED_NEW` | 119 | Absent | `WEAK_CANDIDATE` | S-G: Exact bonito/okra gyudon size M; other sizes excluded. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| `sukiya-curry-rice-regular` / Japanese Curry Rice (M) | — | `VERIFIED_NEW` | 89 | Absent | `WEAK_CANDIDATE` | S-C: Plain curry rice size M; beef curry and other toppings excluded. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| `sukiya-beef-plate-no-rice` / Beef Plate, No Rice (M) | — | `VERIFIED_NEW` | 75 | Absent | `WEAK_CANDIDATE` | S-A: Exact beef plate size M without rice. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| `sukiya-salad` / Salad | — | `VERIFIED_NEW` | 45 | Absent | `WEAK_CANDIDATE` | S-A: Exact standalone salad, not bowl topping. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |
| `sukiya-miso-soup` / Miso Soup | — | `VERIFIED_NEW` | 30 | Absent | `WEAK_CANDIDATE` | S-A: Plain miso soup, not pork miso soup. Current official grand-menu sheet; no delivery inference. Only menu artwork / size-unspecified category thumbnail; no exact standalone M-portion asset accepted. |

### Santa Fe' Steak — `santa-fe-steak-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `santa-fe-grilled-chicken-pepper-steak` / Grilled Chicken Steak, Pepper Sauce | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SF-ST: Official category menu artwork unavailable; dated promotions and older aggregator amounts do not establish current exact item evidence. |
| `santa-fe-salmon-steak` / Salmon Steak | 329 | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SF-ST: Official category menu artwork unavailable; dated promotions and older aggregator amounts do not establish current exact item evidence. |
| `santa-fe-dory-fish-steak` / Dory Fish Steak | 209 | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SF-ST: Official category menu artwork unavailable; dated promotions and older aggregator amounts do not establish current exact item evidence. |
| `santa-fe-seabass-steak` / Seabass Steak | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SF-ST: Official category menu artwork unavailable; dated promotions and older aggregator amounts do not establish current exact item evidence. |
| `santa-fe-kurobuta-pork-chop` / Kurobuta Pork Chop | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SF-ST: Official category menu artwork unavailable; dated promotions and older aggregator amounts do not establish current exact item evidence. |
| `santa-fe-chicken-steak-jaew` / Chicken Steak (2 Pieces), Jaew Sauce | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SF-ST: Official category menu artwork unavailable; dated promotions and older aggregator amounts do not establish current exact item evidence. |
| `santa-fe-premium-beef-steak` / Premium Fattened Beef Steak, Imported | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SF-ST: Official category menu artwork unavailable; dated promotions and older aggregator amounts do not establish current exact item evidence. |

### Nittaya Kai Yang — `nittaya-kai-yang-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `nittaya-grilled-chicken-quarter` / Original Recipe Grilled Chicken (Leg-Thigh Quarter) | — | `AMBIGUOUS` | — | Present | `WEAK_CANDIDATE` | N-B / N-R: Whole/half sold at ฿230/120, no quarter sale verified. Existing official whole-chicken PNG loads but portion remains questionable. |
| `nittaya-grilled-pork-neck` / Grilled Pork Neck | 130 | `CORRECTION_REQUIRED` | 140 | Absent | `OFFICIAL_CANDIDATE` | N-B / N-G: Spread 12–13 plain grilled pork neck ฿140, stored ฿130. Exact isolated official photo available. |
| `nittaya-som-tam-thai` / Thai-Style Papaya Salad | 75 | `VERIFIED_EXISTING` | 75 | Absent | `OFFICIAL_CANDIDATE` | N-B / N-P: Spread 14–15 plain Thai papaya salad ฿75 agrees. Exact isolated official photo available. |
| `nittaya-som-tam-salted-egg` / Papaya Salad with Salted Egg | 85 | `VERIFIED_EXISTING` | 85 | Present | `VERIFIED_EXISTING` | N-B / N-R: Spread 14–15 salted-egg papaya ฿85 agrees. Existing exact JPG decodes. |
| `nittaya-larb-moo` / Pork Larb | 95 | `VERIFIED_EXISTING` | 95 | Absent | `OFFICIAL_CANDIDATE` | N-B / N-L: Spread 16–17 pork larb ฿95 agrees. Exact original JPG loaded at 1042×1043. |
| `nittaya-tom-saep-grilled-chicken-soup` / Spicy Grilled-Chicken Tom Saep Soup | — | `AMBIGUOUS` | — | Absent | `NOT_FOUND` | N-B / N-R: Tom Yong ฿145 is not exact Tom Saep; price/photo rejected as variant mismatch. |
| `nittaya-chiang-mai-fried-pork` / Chiang Mai-Style Fried Pork | 105 | `VERIFIED_EXISTING` | 105 | Absent | `OFFICIAL_CANDIDATE` | N-B / N-G: Spread 12–13 Chiang Mai fried pork ฿105 agrees. Exact isolated official photo available. |

### Zaab Eli — `zaab-eli-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `zaab-eli-grilled-chicken` / Zaab Eli Grilled Chicken | 299 | `NOT_FOUND` | — | Absent | `NOT_FOUND` | Z: No accessible exact current brand menu from reasonable social/discovery paths; older aggregator prices not reverified. |
| `zaab-eli-fried-chicken` / Zaab Eli Fried Chicken | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | Z: No accessible exact current brand menu from reasonable social/discovery paths; older aggregator prices not reverified. |
| `zaab-eli-grilled-pork-neck` / Grilled Pork Neck | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | Z: No accessible exact current brand menu from reasonable social/discovery paths; older aggregator prices not reverified. |
| `zaab-eli-som-tam-salted-egg` / Thai Papaya Salad with Salted Egg | 120 | `NOT_FOUND` | — | Absent | `NOT_FOUND` | Z: No accessible exact current brand menu from reasonable social/discovery paths; older aggregator prices not reverified. |
| `zaab-eli-corn-salted-egg-som-tam` / Corn & Salted Egg Papaya Salad | 120 | `NOT_FOUND` | — | Absent | `NOT_FOUND` | Z: No accessible exact current brand menu from reasonable social/discovery paths; older aggregator prices not reverified. |
| `zaab-eli-larb-moo` / Pork Larb | 125 | `NOT_FOUND` | — | Absent | `NOT_FOUND` | Z: No accessible exact current brand menu from reasonable social/discovery paths; older aggregator prices not reverified. |
| `zaab-eli-tom-saep-beef-tendon-soup` / Spicy Beef Shank & Tendon Soup | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | Z: No accessible exact current brand menu from reasonable social/discovery paths; older aggregator prices not reverified. |

### Somtam Nua — `somtam-nua-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `somtam-nua-papaya-salad-thai` / Thai-Style Papaya Salad (Dried Shrimp & Peanut) | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SN: Brand social discovery route did not yield safely accessible exact current menu; no login or third-party substitution. |
| `somtam-nua-papaya-salad-fermented-crab` / Papaya Salad with Salted Crab & Fermented Fish Sauce | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SN: Brand social discovery route did not yield safely accessible exact current menu; no login or third-party substitution. |
| `somtam-nua-tam-muah` / Mixed Papaya Salad with Rice Noodles & Crispy Pork Rind | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SN: Brand social discovery route did not yield safely accessible exact current menu; no login or third-party substitution. |
| `somtam-nua-larb-moo` / Pork Larb with Liver | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SN: Brand social discovery route did not yield safely accessible exact current menu; no login or third-party substitution. |
| `somtam-nua-larb-fried-fish` / Crispy Fried Fish Larb | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SN: Brand social discovery route did not yield safely accessible exact current menu; no login or third-party substitution. |
| `somtam-nua-fried-chicken` / Thai Fried Chicken Wings | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SN: Brand social discovery route did not yield safely accessible exact current menu; no login or third-party substitution. |
| `somtam-nua-tom-saep-pork-bone-soup` / Spicy Isan Pork-Bone Soup | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SN: Brand social discovery route did not yield safely accessible exact current menu; no login or third-party substitution. |
| `somtam-nua-sticky-rice` / Sticky Rice | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | SN: Brand social discovery route did not yield safely accessible exact current menu; no login or third-party substitution. |

### ThongSmith — `thongsmith-boat-noodle-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `thongsmith-wagyu-ribeye-boat-noodle` / Wagyu Ribeye "Waterfall" Beef Boat Noodle | — | `AMBIGUOUS` | — | Absent | `WEAK_CANDIDATE` | T: Spread 6–7 differentiates ribeye alone ฿499 versus combinations ฿529; catalog lacks combination code. Menu-layout photos withheld. |
| `thongsmith-kurobuta-pork-boat-noodle` / Kurobuta Pork Boat Noodle | — | `AMBIGUOUS` | — | Absent | `WEAK_CANDIDATE` | T: Spread 10–11 distinguishes Kurobuta alone ฿229 versus combinations ฿259; catalog lacks exact code. Menu-layout photos withheld. |
| `thongsmith-dry-rice-kurobuta-braised-pork` / Dry Rice with Kurobuta Pork & Braised Pork | — | `VERIFIED_NEW` | 239 | Absent | `WEAK_CANDIDATE` | T: Spread 14–15, G8 exact sliced Kurobuta and braised-pork rice bowl. Listed amount; stated 10% service charge additional. Photograph embedded in menu collage, withheld. |
| `thongsmith-spicy-shredded-chicken-dry` / Spicy Shredded Chicken (Dry, No Soup) | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | T: No exact shredded-chicken dry item identified in endorsed main/supplement menus; no substitute used. |
| `thongsmith-grilled-pork-meatballs` / Grilled Pork Meatballs with Sweet Chili Dip | — | `VERIFIED_NEW` | 119 | Absent | `WEAK_CANDIDATE` | T: Spread 2–3, A1 grilled pork meatballs, three skewers/plate with sweet chili dip. Listed amount; stated 10% service charge additional. Photograph embedded in menu collage, withheld. |

### The Steak & More — `steak-and-more-thailand`

| Item ID / exact catalog name | Current price | Price classification | Verified price | Current image | Image classification | Evidence / qualification |
| --- | ---: | --- | ---: | --- | --- | --- |
| `steak-and-more-chicken-steak` / Chicken Steak | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | ST: Official corporate page lacks itemized prices/dish assets; linked official social source inaccessible. Generic brand hero excluded. |
| `steak-and-more-pork-chop` / Pork Chop Steak | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | ST: Official corporate page lacks itemized prices/dish assets; linked official social source inaccessible. Generic brand hero excluded. |
| `steak-and-more-squid-ink-spaghetti-shrimp` / Black Squid-Ink Spaghetti with Shrimp | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | ST: Official corporate page lacks itemized prices/dish assets; linked official social source inaccessible. Generic brand hero excluded. |
| `steak-and-more-caesar-salad` / Caesar Salad | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | ST: Official corporate page lacks itemized prices/dish assets; linked official social source inaccessible. Generic brand hero excluded. |
| `steak-and-more-som-tam` / Som Tam (Thai Papaya Salad) | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | ST: Official corporate page lacks itemized prices/dish assets; linked official social source inaccessible. Generic brand hero excluded. |
| `steak-and-more-yum-woon-sen` / Yum Woon Sen (Glass Noodle Salad) | — | `NOT_FOUND` | — | Absent | `NOT_FOUND` | ST: Official corporate page lacks itemized prices/dish assets; linked official social source inaccessible. Generic brand hero excluded. |

## Appendix B. Every existing remote image

Check date for **every entry: 2026-09-30**. These are the exact stored URLs, not substitute thumbnails. None has a visible signed/session token. Stable appearance/hotlink access is provisional; rights and continued access are not certified. No numeric HTTP success code is claimed.

### `ootoya-grilled-mackerel` — Ootoya / Charcoal-Grilled Mackerel

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.ootoya.co.th/upload_file/menu/Fish-Menu/%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B8%8B%E0%B8%B2%E0%B8%9A%E0%B8%B0%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%99-big.png).
- Stored provenance: [source page](https://www.ootoya.co.th/menu-details.php?id=3); current evidence O3.
- Format: PNG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact à la carte main dish; set price excluded. Official PNG decodes.

### `ootoya-grilled-moromi-chicken` — Ootoya / Charcoal-Grilled Chicken with Moromi Sauce

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.ootoya.co.th/upload_file/menu/Grilled-Menu/%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%8B%E0%B8%AD%E0%B8%AA%E0%B9%82%E0%B8%A1%E0%B9%82%E0%B8%A3%E0%B8%A1%E0%B8%B4-big.png).
- Stored provenance: [source page](https://www.ootoya.co.th/menu-details.php?id=35); current evidence O35.
- Format: PNG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact à la carte main dish; official main-plate PNG decodes.

### `ootoya-tonteki-pork-chop-set` — Ootoya / Charcoal-Grilled Tonteki Pork Chop Set

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.ootoya.co.th/upload_file/menu/Grilled-Menu/%E0%B8%9E%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%84%E0%B8%8A%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%81%E0%B8%B4-big.png).
- Stored provenance: [source page](https://www.ootoya.co.th/menu-details.php?id=30); current evidence O30.
- Format: PNG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Catalog explicitly names set. Existing photo represents its exact main plate.

### `salad-factory-grilled-chicken-sesame` — Salad Factory / Japanese-Style Grilled Chicken Breast Salad, Sesame Dressing

- Current image: `official-remote`; classification **CORRECTION_REQUIRED**; health **broken**.
- Exact stored asset: [asset URL](https://www.saladfactorythailand.com/65ed250caef8ed66454c2464/668f96e30990d230026c05bb_Main%20Salad-%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%8D%E0%B8%B5%E0%B9%88%E0%B8%9B%E0%B8%B8%E0%B9%88%E0%B8%99.jpg).
- Stored provenance: [source page](https://www.saladfactorythailand.com/menu/order); current evidence SF / SF-L.
- Format: JPG in the stored filename only; live response is unrelated HTML.
- Exact-dish confidence: unverifiable on live source.
- Stability/hotlink assessment: not usable; old static path no longer serves dish photography.
- Evidence: Cached possible menu evidence is contradicted by live unrelated domain/404 content; no safe current price or replacement.

### `salad-factory-kale-chicken-truffle` — Salad Factory / Kale Salad with Chicken Breast, Truffle Dressing

- Current image: `official-remote`; classification **CORRECTION_REQUIRED**; health **broken**.
- Exact stored asset: [asset URL](https://www.saladfactorythailand.com/65ed250caef8ed66454c2464/6672a5a9ba3a36f4c933ca72_Kale%20Salad-%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%84%E0%B8%A5%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%9F%E0%B9%80%E0%B8%9F%E0%B8%B4%E0%B8%A5.jpg).
- Stored provenance: [source page](https://www.saladfactorythailand.com/menu/order); current evidence SF / SF-L.
- Format: JPG in the stored filename only; live response is unrelated HTML.
- Exact-dish confidence: unverifiable on live source.
- Stability/hotlink assessment: not usable; old static path no longer serves dish photography.
- Evidence: Cached possible menu evidence is contradicted by live unrelated domain/404 content; no safe current price or replacement.

### `seven-eleven-garlic-pork-egg-rice` — 7-Eleven Thailand / Ezygo Garlic Pork with Fried Egg and Rice

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://media.allonline.7eleven.co.th/pdmain/735977-00-allonline-sm-NewOnlyat.jpg).
- Stored provenance: [source page](https://www.allonline.7eleven.co.th/p/%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%84%E0%B8%82%E0%B9%88%E0%B8%94%E0%B8%B2%E0%B8%A7-%E0%B8%95%E0%B8%A3%E0%B8%B2-%E0%B8%AD%E0%B8%B5%E0%B8%8B%E0%B8%B5%E0%B9%88%E0%B9%82%E0%B8%81-250-%E0%B8%81%E0%B8%A3%E0%B8%B1%E0%B8%A1/367920/); current evidence 7P.
- Format: JPG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact Ezygo 250g online product; displayed window ends 30/09/2026. JPG decodes; no in-store inference. Official packaging/brand graphics coexist with the exact dish; assess the existing cover crop before reuse.

### `seven-eleven-green-curry-chicken` — 7-Eleven Thailand / Chef Cares Green Curry with Chicken Breast and Jasmine Rice

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://media.allonline.7eleven.co.th/pdmain/742077-00-allonline-sm-NewOnlyat.jpg).
- Stored provenance: [source page](https://www.allonline.7eleven.co.th/p/%E0%B9%81%E0%B8%81%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B8%AB%E0%B8%A7%E0%B8%B2%E0%B8%99%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B0%E0%B8%A5%E0%B8%B4-%E0%B8%95%E0%B8%A3%E0%B8%B2-%E0%B9%80%E0%B8%8A%E0%B8%9F%E0%B9%81%E0%B8%84%E0%B8%A3%E0%B9%8C%E0%B8%AA-275-%E0%B8%81%E0%B8%A3%E0%B8%B1%E0%B8%A1/334743/); current evidence 7G.
- Format: JPG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact Chef Cares 275g online product; displayed window ends 30/09/2026. JPG decodes; no in-store inference. Official packaging/brand graphics coexist with the exact dish; assess the existing cover crop before reuse.

### `fuji-salmon-shioyaki-brown-rice-set` — Fuji Japanese Restaurant / Salmon Shioyaki with Brown Rice Set

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.fuji.co.th/wp-content/uploads/2026/06/SALMON-SHIOYAKI-WITH-BROWN-RICE-SET-1-768x768.png).
- Stored provenance: [source page](https://www.fuji.co.th/menu/?lang=en); current evidence F.
- Format: PNG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes.

### `fuji-salmon-tataki` — Fuji Japanese Restaurant / Salmon Tataki Salad

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.fuji.co.th/wp-content/uploads/2026/06/SALMON-TATAKI.png-768x768.png).
- Stored provenance: [source page](https://www.fuji.co.th/menu/?lang=en); current evidence F.
- Format: PNG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes.

### `fuji-kinoko-mushroom-salad` — Fuji Japanese Restaurant / Kinoko (Mushroom) Salad

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.fuji.co.th/wp-content/uploads/2026/06/KINOKO-SALAD-768x768.png).
- Stored provenance: [source page](https://www.fuji.co.th/menu/?lang=en); current evidence F.
- Format: PNG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes.

### `fuji-chirashi-sushi-don-set` — Fuji Japanese Restaurant / Chirashi Sushi Rice Bowl Set

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.fuji.co.th/wp-content/uploads/2026/06/CHIRASHI-SUSHI-DON-SET-768x768.png).
- Stored provenance: [source page](https://www.fuji.co.th/menu/?lang=en); current evidence F.
- Format: PNG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact named dish/set on current official menu; branch exceptions apply. Existing 768px PNG decodes.

### `mk-special-vegetable-set` — MK Restaurants / Special Vegetable Set

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.mkrestaurant.com/public/uploads/mk_menu/images/2d90e4421809ab3c838e94db744ce7df.JPG).
- Stored provenance: [source page](https://www.mkrestaurant.com/en/mk-menu/suki/); current evidence M2.
- Format: JPG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact special vegetable set, agreeing English/Thai menus; existing JPG decodes.

### `mk-special-kurobuta-set` — MK Restaurants / Special Kurobuta Set

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.mkrestaurant.com/public/uploads/mk_menu/images/c46d73452576ddbb21c542893e6efbed.jpg).
- Stored provenance: [source page](https://www.mkrestaurant.com/en/mk-menu/suki/); current evidence M1.
- Format: JPG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact special Kurobuta set; existing JPG decodes.

### `mk-special-kurobuta-plate` — MK Restaurants / Special Kurobuta (Single Plate)

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.mkrestaurant.com/public/uploads/mk_menu/images/6e5bc4cef819eb5ecb4b8a08fa92cc2b.jpg).
- Stored provenance: [source page](https://www.mkrestaurant.com/en/mk-menu/suki/); current evidence M1.
- Format: JPG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact single Kurobuta plate; existing JPG decodes.

### `mk-premium-suki-set` — MK Restaurants / Premium Suki Set (Single Pot)

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.mkrestaurant.com/public/uploads/mk_menu/images/759b93dc4b3d0153a14656015262c135.JPG).
- Stored provenance: [source page](https://www.mkrestaurant.com/en/mk-menu/suki/); current evidence M1.
- Format: JPG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact single-pot premium set; branch-limited availability must remain qualified. Existing JPG decodes.

### `mk-seafood-suki-broth` — MK Restaurants / Seafood Suki (Prepared, Broth Style)

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.mkrestaurant.com/public/uploads/mk_menu/images/74e40820714e487e931bbf7f83d8eb65.jpg).
- Stored provenance: [source page](https://www.mkrestaurant.com/en/mk-menu/single-dish); current evidence MS.
- Format: JPG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact prepared seafood suki soup, not loose ingredients; existing JPG decodes.

### `mk-pork-shabu` — MK Restaurants / Pork Shabu

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.mkrestaurant.com/public/uploads/mk_menu/images/dd1aba57e93fec743c1bbf2b1cbb3e1f.jpg).
- Stored provenance: [source page](https://www.mkrestaurant.com/en/mk-menu/suki/); current evidence M2.
- Format: JPG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Exact pork shabu plate, agreeing current menus; existing JPG decodes.

### `nittaya-grilled-chicken-quarter` — Nittaya Kai Yang / Original Recipe Grilled Chicken (Leg-Thigh Quarter)

- Current image: `official-remote`; classification **WEAK_CANDIDATE**; health **questionable**.
- Exact stored asset: [asset URL](https://www.nittayakaiyang.com/wp-content/uploads/2023/04/%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%95%E0%B8%B1%E0%B8%A7-07-768x769.png).
- Stored provenance: [source page](https://www.nittayakaiyang.com/en/nittaya-kai-yang-recommended-menu/); current evidence N-B / N-R.
- Format: PNG; browser decoded image content.
- Exact-dish confidence: dish identity high, individual portion low.
- Stability/hotlink assessment: static nonsigned path loads; portion representation unresolved.
- Evidence: Whole/half sold at ฿230/120, no quarter sale verified. Existing official whole-chicken PNG loads but portion remains questionable.

### `nittaya-som-tam-salted-egg` — Nittaya Kai Yang / Papaya Salad with Salted Egg

- Current image: `official-remote`; classification **VERIFIED_EXISTING**; health **healthy**.
- Exact stored asset: [asset URL](https://www.nittayakaiyang.com/wp-content/uploads/2023/05/%E0%B8%AA%E0%B9%89%E0%B8%A1%E0%B8%95%E0%B8%B3%E0%B9%84%E0%B8%97%E0%B8%A2%E0%B9%84%E0%B8%82%E0%B9%88%E0%B9%80%E0%B8%84%E0%B9%87%E0%B8%A1-1024x1024.jpg).
- Stored provenance: [source page](https://www.nittayakaiyang.com/en/nittaya-kai-yang-recommended-menu/); current evidence N-B / N-R.
- Format: JPG; browser decoded image content.
- Exact-dish confidence: high.
- Stability/hotlink assessment: static nonsigned path loads without authentication; continued hotlink access not guaranteed.
- Evidence: Spread 14–15 salted-egg papaya ฿85 agrees. Existing exact JPG decodes.
