# GoodFood V2 — Independent restaurant menu image research — SOL

Research date: 2026-09-30 (Asia/Bangkok). Research only; no implementation.

## 1. Entry state

The supplied request describes an intentionally dirty Slice 38 worktree. Actual entry `git status --short` returned no changed/untracked paths. This discrepancy was reported during research. I did not assume HEAD represented the requested candidate: I derived the set directly from the current `src/restaurants.ts`. Its missing-image count was exactly 42, so the specified stop condition did not apply. HEAD: `42fc6f5fe98accd8308423dd9ab07f2a6bfd2921`.

No checkout, reset, clean, stash, revert, staging, commit, push, deployment, visibility change, or production asset crop occurred. Git required a per-command `safe.directory` override because of ownership; no global configuration was changed. Git emitted permission warnings about the user ignore file; the tracked-file checks and status commands nevertheless completed.

## 2. Current production/worktree baseline

| Measure | Derived count |
|---|---:|
| Restaurants | 13 |
| Restaurant logos | 13 |
| Menu items | 84 |
| Items with menuImage | 42 |
| Items without menuImage | 42 |

These are counts of current source records/properties, not counts of reachable URLs. The records were extracted between the restaurant/menu-array export boundaries and split at top-level object starts; image-bearing records were excluded by their `menuImage` property. All records have unique IDs. No prior research list was used. Current production source SHA-256: `9C43D7035622824820F9CF5C6C894108995836B81F92612CAAB31D9B650F3594`.

## 3. Independent research set and blind-rule confirmation

Exactly 42 unique image-less production IDs were independently derived before the web research and appear in section 18. **The blind rule was obeyed.** Neither the Opus report, the 37A audit, nor any previous restaurant asset/image research document was opened, searched, read, summarized or used. No later comparison was performed. Production comments were excluded as research hints; names, serving context and nutrition fields were used only for identity checks. Independent classification was completed before writing this report.

## 4. Research method

Brand-by-brand ecosystem mapping preceded candidate decisions. I used Thai/English exact names, simplified names, alternate official terminology, category and operator names, and discovered dish codes. Anonymous public HTTP downloads complemented web search: HTML, linked assets, Open Graph, menu image sources, WordPress REST media records, LINE page state and AnyFlip configuration were inspected. Public APIs were read without credentials. Observed older uploads and plausible sibling assets were investigated; no large namespace was brute-forced.

Serious image candidates were downloaded and visually examined, including official sheets, individual media-library assets and merchant-menu thumbnails. Contact sheets used only resized whole images for review; no dish crops were created. Native dimensions were measured with Pillow, separately from viewer display resizing. Santa Fe linked PDFs were downloaded and promising promotion/sourcing pages rendered with bundled Poppler under the PDF skill. A missing text-extraction binary did not prevent visual inspection. Scratch files were task-owned temporary downloads outside the repository.

Falsification asked whether protein, sauce, cooking method, topping, noodles/rice, set sides, portion, label/code, price, or date could contradict the catalog. Estimated nutrition did not override visible dish identity. A named dry dish is not automatically a no-noodle dish. No logged-in browser session was accessed; no browser processes were launched or killed, and no authentication or certificate failure was bypassed.

## 5. Source policy

Tier A is restaurant/operator/parent publication and their linked static assets. Tier B requires an actual first-party link or clear branded account relationship. A social username alone is insufficient. Wongnai ordering-menu images are retained only as MARKETPLACE_ONLY where merchant/image-supplier provenance cannot be established. Customer reviews, Google Maps uploads, blogs, stock, AI images and unrelated name matches were not accepted. Search/index snippets are discovery evidence, not proof that the live image is usable.

Official identity, runtime suitability, crop quality and reuse rights are separate judgments. NOT_FOUND means no useful candidate found in the investigated public surface, not proof that no image exists anywhere.

## 6. Official source ecosystems by restaurant

Evidence keys below are used in the appendix. MK has no remaining image-less records and needed no gap research.

| Brand / keys | Official ecosystem and investigation | Outcome / boundaries |
|---|---|---|
| Ootoya / O1,O2 | [Official Thai menu](https://www.ootoya.co.th/menu.php), product detail IDs 1 and 79, linked `upload_file/menu` assets; homepage links CRG and official social/LINE. Detail HTML inspected. | O1 [hokke page](https://www.ootoya.co.th/menu-details.php?id=1) exposes a set image; no separately proven à-la-carte sibling. O2 [salmon page](https://www.ootoya.co.th/menu-details.php?id=79) shows raw salmon bowl. |
| Salad Factory / SF1,SF2 | Current [saladfactorythailand.com](https://www.saladfactorythailand.com/) full-shop/compact menu and product pages, Webflow calculator link, Thai/English searches. Copyright footer identifies SALAD FACTORY Ltd. Former similarly named domain returned gambling/unrelated content and was rejected. | SF1 [pork/konjac product](https://www.saladfactorythailand.com/product/spicy-pork-tenderloin-salad-with-seaweed-konjac-and-wakame); SF2 [full-shop list](https://www.saladfactorythailand.com/en/menu/menu---full-shop-en?b6b9cd6e_page=2). Anonymous live fetches 403; Webflow root 404. Indexed content usable for discovery only; no downloaded dish image. |
| 7-Eleven / SE1–SE3 | Retailer's official new-product/lifestyle surfaces and [ALL ONLINE](https://allonline.7eleven.co.th/), product HTML/OG and retailer media host; Thai brand spellings Ezy Choice/Ezygo/Happy Chef and alternate terminology. | SE1 product 355384 chicken sukiyaki; SE2 365809 Happy Chef bulgogi cached page, live404 twice; SE3 328382 Korean fried rice with explicit new-recipe description. Sticky pork-floss/jaew exact package not found. |
| Jones / J1,J2 | [Soup page](https://www.jonessalad.com/menu/soup/), [steak page](https://www.jonessalad.com/menu/steak/), public `wp-json/wp/v2/media` searches soup/fish/basa/honey/เลมอน, attachment dimensions; current 2026 and older 2025 sheets examined. | J1 plain soup clearly distinguished from bacon/truffle/spinach; J2 current and older fish sheets have different basa sauces. 2019 Fish-01 asset proved to be an infographic, not a dish. |
| Fuji / F1 | [Official paired salmon product](https://www.fuji.co.th/menus/2026/06/30/5135/), public WordPress media search SHIOYAKI, SET and non-SET sibling assets. | Successful à-la-carte sibling discovery, but visible glaze and shared teriyaki/shioyaki title prevent salt-only verification. |
| Sukiya / SU1–SU3 | [Official Thai grand menu](https://www.sukiya.co.th/th/menu/grandmenu.html), observed gyudon/curry/alacarte JPEG sheets and codes105/609/812/819; source/static paths inspected. | Tiny crop regions, CMYK encoding and text-only plain curry/sides listings. Pork miso differs from standard miso; pickled vegetables differ from salad. No useful higher-resolution exact sibling established. |
| Santa Fe / SA,SA1 | [Official website](https://www.santafesteak.com/santafesteak/frontends/index/th), chicken/fish/beef category pages, public menu JS, [promotions](https://www.santafesteak.com/santafesteak/frontends/promotion/th), linked newsletter PDFs, [official LINE](https://page.line.me/gsl5541k) and its Facebook link `santafesteak.th`. Footer identifies KT Restaurant. | Category image path ends in empty `/img/menus/`; JS is layout logic, not a recovered menu API. Linked 2024 promotion and meat-sourcing PDFs reachable; one baked-cheese PDF404. Jaew-containing mixed chicken set is a variant. No verified pepper chicken, seabass or exact imported beef. |
| Nittaya / N1 | [Official menus](https://www.nittayakaiyang.com/th/menus/), WordPress media searches ต้มแซ่บ/ไก่ย่าง/โย้ง, [Tom Yong product](https://www.nittayakaiyang.com/th/food_menus/ต้มโย้งไก่ย่าง/), [official recommendation article](https://www.nittayakaiyang.com/en/nittaya-kai-yang-recommended-menu/); site links official FB/LINE/TikTok. | Tom Saep searches yielded pork versions; Tom Yong grilled chicken has a high-quality standalone image, but official explanation is a different named soup blend. |
| Zaab Eli / Z1,Z2 | [Branded LINE OA](https://page.line.me/ntw0665w), premium ID @zaabeli, address/phone and link to `facebook.com/zaabeli`; anonymous FB requires login. [Bang Khae merchant menu](https://www.wongnai.com/delivery/businesses/2902410DR/order) and [Silom menu](https://www.wongnai.com/delivery/businesses/27234fo/order) inspected for discovery. | All seven dishes have merchant-menu candidates. Images downloaded/viewed; first-party supply not established. LINE branch poster is not an exact dish source. San Diego Sab-E-Lee site is unrelated. |
| Somtam Nua / SN1,SN2 | [CRG brand page19](https://crg.co.th/brand-details/19/SomtamNua), linked [Facebook](https://www.facebook.com/Somtamnuathailand), [Instagram](https://www.instagram.com/somtamnua/), CRG news pagination1–7, public catalogue banner; LINE @somtamnua discovery, CRG-linked Foodhunt; [Rama9 merchant menu](https://www.wongnai.com/delivery/businesses/3573111Ae/order). | CRG proves operator presence and official social identity. Banner is unlabelled. Anonymous social HTML exposed profile/login metadata, no useful accessible labelled dish feed; Instagram no post image state. LINE route gave add-friend shell. Foodhunt TLS failed; HTTP404, no insecure bypass. News pages yielded no exact labelled asset. Six marketplace-only items, one weak Tam Muah, one not found fish larb. |
| ThongSmith / T1 | [Official Linktree](https://linktr.ee/thongsmith) links [AnyFlip bookcase](https://anyflip.com/bookcase/jpekz); iberry-group author and account links. Public mobile `javascript/config.js` for rchh/vgit/xuak/zlin inspected. rchh16-page menu and Sept11 vgit update downloaded. | rchh page13 has codeF2 exact dry shredded chicken, explicitly noodle/no-noodle choices. Photo has noodles; production says no soup only. September update contains unrelated stir-fried noodle specials. |
| The Steak & More / SM1,SM2 | [Minor Food official brand page](https://www.minorfood.com/th/our-business/the-steak-and-more), observed linked CDN tiles/content, [official launch article](https://www.minorfood.com/th/news/minor-food-launches-the-steak-and-more), linked Facebook TheSteakandMore/LINE/TikTok. All ten brand visuals and relevant five news-body images inspected. | Operator names Som Tam/Yum Woon Sen among sides; preparation visible in corresponding dedicated tile/Thai-side composition. Bone-in pork has extra side; chicken combinations ambiguous; black pasta and Caesar collage regions too small/unlabelled. Anonymous Facebook yielded profile metadata, not a verified dish feed. |

## 7. Classification summary

| Primary classification | Count |
|---|---:|
| VERIFIED_STANDALONE | 1 |
| VERIFIED_CROP_CANDIDATE | 4 |
| VERIFIED_CURRENT_REFORMULATION | 1 |
| VERIFIED_VARIANT | 7 |
| CONTENT_VERIFIED_BUT_URL_UNSUITABLE | 0 |
| MARKETPLACE_ONLY | 13 |
| WEAK_CANDIDATE | 10 |
| NOT_FOUND | 6 |
| **Total** | **42** |

| Restaurant | Missing | Standalone | Crop | Reformulation | Variant | Marketplace | Weak | Not found |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Ootoya | 2 | 0 | 1 | 0 | 1 | 0 | 0 | 0 |
| Salad Factory | 2 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| 7-Eleven Thailand | 4 | 0 | 0 | 1 | 1 | 0 | 1 | 1 |
| Jones' Salad | 2 | 0 | 1 | 0 | 1 | 0 | 0 | 0 |
| Fuji Japanese Restaurant | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| Sukiya | 4 | 0 | 0 | 0 | 0 | 0 | 3 | 1 |
| Santa Fe' Steak | 4 | 0 | 0 | 0 | 1 | 0 | 0 | 3 |
| Nittaya Kai Yang | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| Zaab Eli | 7 | 0 | 0 | 0 | 0 | 7 | 0 | 0 |
| Somtam Nua | 8 | 0 | 0 | 0 | 0 | 6 | 1 | 1 |
| ThongSmith | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| The Steak & More | 6 | 1 | 1 | 0 | 1 | 0 | 3 | 0 |

## 8. SAFE_STANDALONE_CANDIDATES

**Count: 1. Exact ID: `steak-and-more-yum-woon-sen`.**

| Field | Finding |
|---|---|
| Restaurant | The Steak & More, Minor Food |
| Source | [Official brand page](https://www.minorfood.com/th/our-business/the-steak-and-more), supported by [operator launch article](https://www.minorfood.com/th/news/minor-food-launches-the-steak-and-more) naming Yum Woon Sen |
| Direct image | [Dedicated glass-noodle salad tile](https://cdn.minorfood.com/uploaded/brand/tile/175757423068c2745661fb5.jpg) |
| Dimensions / format | 500×500, JPEG, RGB, 83,332 bytes |
| Identity | Glass noodles lifted from salad bowl; minced meat, tomato, red onion, cucumber/lettuce. First-party menu context explicitly names this dish. Catalog is generic Yum Woon Sen and imposes no alternate protein, topping, portion or sauce version. This is high-confidence visual/context identification, not filename-only proof. |
| Falsification | It is not papaya salad, creamy Caesar or black pasta; no rice or second main protein added. No conflicting catalog customization. The operator asset lacks an individual printed dish code; this limits documentary certainty but does not create an observed meaningful variant. |
| Technical | Anonymous GET200 without cookies/auth/Referer; official Referer recheck also200, same MIME and byte length. Requested URL equals final URL; no signed query. No Cache-Control observed. |
| Caveats | Promotional fork/hand framing and tight composition; acceptable card/detail native resolution, avoid upscaling. Dish photo is not evidence validating estimated nutrition. Reuse rights unestablished. Current source can later be removed or replaced. |

## 9. VERIFIED_CROP_CANDIDATES

**Four candidates; four GOOD/ACCEPTABLE practical proposals, with the explicit constraints below. No actual crops made.** Coordinates are approximate native pixels from upper-left, not promises of a finished crop.

### `ootoya-shima-hokke-grilled`

- Source: [official publication](https://www.ootoya.co.th/menu-details.php?id=1); [direct image](https://www.ootoya.co.th/upload_file/menu/Fish-Menu/%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B8%8A%E0%B8%B4%E0%B8%A1%E0%B8%B2%E0%B8%AE%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%81%E0%B8%B0%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%99-big.png).
- Source dimensions: 800×600; region: Main fish plate approx x150–595,y240–545; fish-oriented useful region about400×245, excluding upper-right set vessel.
- Neighbors/overlap: Rice, soup, pickles and custard outside main fish region; black custard/lid near upper-right plate edge.
- Expected quality: **ACCEPTABLE**. Use a tight fish-oriented frame, not the whole rectangular main-plate bounds: those include a set-vessel edge. Entire fish and daikon can remain; plate edge/top garnish may be trimmed. Human review must confirm no optional set component survives. This is not a ready-made standalone image.

### `jones-mushroom-soup`

- Source: [official publication](https://www.jonessalad.com/menu/soup/); [direct image](https://www.jonessalad.com/wp-content/uploads/2026/07/Soup-Menu-AW.jpg).
- Source dimensions: 1157×1806; region: Plain white bowl x365–630,y1195–1405, ~265×210; slightly larger framing ~290×240.
- Neighbors/overlap: Truffle bowl left/below, spinach below, pumpkin right; none covers the plain soup bowl, but wooden pedestal should be trimmed.
- Expected quality: **ACCEPTABLE**. 59-baht plain Mushroom Soup label identifies correct bowl. No bacon/croutons/truffle. Native resolution supports modest cards; detail enlargement will be soft. Prefer higher resolution before large detail UI.

### `thongsmith-spicy-shredded-chicken-dry`

- Source: [official publication](https://online.anyflip.com/iugnb/rchh/); [direct image](https://online.anyflip.com/iugnb/rchh/files/large/149f53d9adcdaf5b0c5d7cf3e90ab16f.webp).
- Source dimensions: 1980×2800; region: Bottom F2 bowl approx x810–1640,y1940–2610; ~830×670.
- Neighbors/overlap: F1 clear-soup chicken above; F2 label to right, price text to left. No other dish overlaps F2 bowl.
- Expected quality: **GOOD**. Exact Thai F2 label and 139-baht price. Preserve visible noodles: catalog does not explicitly say no noodles. Do not crop away noodles to imply the no-noodle option. Resolve category/nutrition presentation before implementation.

### `steak-and-more-som-tam`

- Source: [official publication](https://www.minorfood.com/th/news/minor-food-launches-the-steak-and-more); [direct image](https://cdn.minorfood.com/uploaded/editor/20250122/body-3.jpg).
- Source dimensions: 1080×1350; region: Top papaya plate approx x455–920,y85–550; ~465×465.
- Neighbors/overlap: Pork larb left/below, rice to lower right, glass-noodle plate below; disjoint plate region.
- Expected quality: **GOOD**. Operator text names Som Tam; photo shows papaya, tomato, beans and peanuts, matching generic catalog name. No salted egg/crab/extra meat seen; sauce/nutrition not measured. Isolate whole top plate without adjacent rice/larb.

Sukiya code105 okra bowl is labelled but too small (~140×100) to join this section. Standard miso and salad regions are similarly too small; larger set presentations overlap or change components. These are WEAK_CANDIDATE, not theoretical crop credits.

## 10. Variants, reformulations and unsuitable URLs

Seven primary VERIFIED_VARIANT decisions are listed in the appendix: raw Ootoya salmon instead of grilled; glass-noodle Ezy Choice sukiyaki instead of rice; current Jones basa with different sauce; glazed Fuji paired teriyaki/shioyaki image; Santa Fe mixed chicken/jaew set; Nittaya Tom Yong instead of demonstrably equivalent Tom Saep; Steak & More pork chop with extra side.

Korean chicken fried rice is the single VERIFIED_CURRENT_REFORMULATION. [ALL ONLINE product328382](https://allonline.7eleven.co.th/p/อีซี่โก-ข้าวผัดไก่เกาหลี-250g/328382/) describes recipe and label changes. Its promotional asset uses EZY TASTE wording while page brand says EZYGO. A retailer-linked image exists, but historical 440-kcal catalog values cannot silently be attached to the updated recipe. The listed promotion date ended Sept11; page accessibility does not prove current store stock.

Zero CONTENT_VERIFIED_BUT_URL_UNSUITABLE: login/signed social metadata was not exact dish evidence, and inaccessible product pages without a viewed image do not qualify as content-verified. Technical obstruction is recorded without artificially upgrading identity.

## 11. Weak and marketplace-only candidates

Ten weak decisions and thirteen marketplace-only decisions appear individually in section18. For marketplace candidates, merchant-menu HTML pairs dish names to image URLs. These were not customer review galleries. That still does not establish image supplier or authorized reuse. Exact branch prices/portions may differ; a clean food photo and branded plate do not prove brand supply.

Somtam Nua is **not** uniformly NOT_FOUND: six labelled merchant-menu image candidates exist. Its official CRG banner is authentic but cannot prove the catalog Tam Muah (rice-noodle version). Visible sausage/rind is useful discovery evidence, not sufficient exact identity. The marketplace Tam Muah photo also cannot certify that separate banner. No candidate here is approved for implementation or visibility changes.

## 12. NOT_FOUND

- `seven-eleven-sticky-rice-dried-pork` — Official new-product/lifestyle and ALL ONLINE Thai/English name searches did not yield a labelled exact pork-floss plus jaew package. User reviews excluded.
- `sukiya-curry-rice-regular` — SU2: code609 M89 plain curry listed without photo; pictured curry dishes have meat/fried toppings. Cannot remove toppings to invent plain curry.
- `santa-fe-grilled-chicken-pepper-steak` — SA ecosystem: broken category image source, official promotion PDFs and exact pepper/เปปเปอร์ searches yielded no exact labelled usable image. Pork black-pepper photo is wrong protein.
- `santa-fe-seabass-steak` — SA ecosystem: official fish category image filename empty; current promotion is salmon, not seabass. Third-party customer photos excluded.
- `santa-fe-premium-beef-steak` — SA ecosystem: official imported-meat sourcing PDFs accessible but describe suppliers, not exact dish imagery. Review photos and historical promotional Easy/other cuts excluded.
- `somtam-nua-larb-fried-fish` — CRG, anonymous official socials, news and merchant menus yielded no exact fish-larb candidate. Merchant crispy fish and fried-chicken larb are different dishes; customer blog images excluded.

## 13. Technical URL findings

All following food image sources were actually downloaded and viewed. Status is a point-in-time anonymous GET, not a service guarantee. A dash in cache means no Cache-Control observed; it does not mean no caching. No listed URL had an expiring query. Public download without a Referer succeeded; only the safe standalone received a second official-Referer check. No credentials/cookies were supplied. No assumptions about arbitrary cross-site Referer policies or future availability.

| Candidate/source | Direct URL | HTTP/MIME | Native dimensions / mode | Bytes | Cache-Control | Runtime assessment |
|---|---|---|---|---:|---|---|
| Ootoya hokke | [asset](https://www.ootoya.co.th/upload_file/menu/Fish-Menu/%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B8%8A%E0%B8%B4%E0%B8%A1%E0%B8%B2%E0%B8%AE%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%81%E0%B8%B0%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%99-big.png) | 200 / image/png | 800×600 / RGBA | 1,076,642 | — | Crop; do not use full set |
| Ootoya salmon | [asset](https://www.ootoya.co.th/upload_file/menu/Donburi-Menu/%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B9%81%E0%B8%8B%E0%B8%A5%E0%B8%A1%E0%B8%AD%E0%B8%99-big.png) | 200 / image/png | 800×600 / RGBA | 394,026 | — | Raw variant |
| Jones soup | [asset](https://www.jonessalad.com/wp-content/uploads/2026/07/Soup-Menu-AW.jpg) | 200 / image/jpeg | 1157×1806 / RGB | 330,247 | — | Crop, small native region |
| Jones soup old promotion | [asset](https://www.jonessalad.com/wp-content/uploads/2025/11/7-Day-Soup-Promotion_LINEOA.jpg) | 200 / image/jpeg | 800×1038 / RGB | 860,609 | — | Historical green bowl; text near edge, not preferred |
| Jones current fish | [asset](https://www.jonessalad.com/wp-content/uploads/2026/03/menu-2026_Steak_Fish.jpg) | 200 / image/jpeg | 1500×2495 / RGB | 843,328 | — | Sauce variant |
| Fuji à-la-carte | [asset](https://www.fuji.co.th/wp-content/uploads/2026/06/SALMON-TERIYAKI-_-SHIOYAKI.png) | 200 / image/png | 1040×1040 / RGBA | 1,860,199 | — | Glaze ambiguity |
| Fuji set | [asset](https://www.fuji.co.th/wp-content/uploads/2026/06/SALMON-TERIYAKI-_-SHIOYAKI-SET.png) | 200 / image/png | 1040×1040 / RGBA | 1,917,237 | — | Set + glaze |
| Sukiya gyudon | [asset](https://www.sukiya.co.th/th/menu/img/menu/menu_gyudon.jpg) | 200 / image/jpeg | 1141×905 / CMYK | 2,293,530 | — | CMYK; tiny exact crop |
| Sukiya curry | [asset](https://www.sukiya.co.th/th/menu/img/menu/menu_curry.jpg) | 200 / image/jpeg | 1141×905 / CMYK | 2,394,886 | — | CMYK; no plain photo |
| Sukiya à-la-carte | [asset](https://www.sukiya.co.th/th/menu/img/menu/menu_alacarte.jpg) | 200 / image/jpeg | 571×905 / CMYK | 1,379,904 | — | CMYK; text-only sides |
| Ezy Choice sukiyaki | [asset](https://media.allonline.7eleven.co.th/pdmain/642775-00-meal-box-ezy-choice.jpg) | 200 / image/jpeg | 555×555 / RGB | 88,899 | max-age=604800 | Noodle variant |
| Korean rice | [asset](https://media.allonline.7eleven.co.th/pdmain/713057-00-allonline-sm-NewOnlyat.jpg) | 200 / image/jpeg | 555×555 / RGB | 168,563 | max-age=604800 | Reformulation/brand wording |
| Nittaya Tom Yong | [asset](https://www.nittayakaiyang.com/wp-content/uploads/2023/04/%E0%B8%95%E0%B9%89%E0%B8%A1%E0%B9%82%E0%B8%A2%E0%B9%89%E0%B8%87%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87-07.png) | 200 / image/png | 1042×1043 / RGB | 1,563,471 | max-age=10368000 | Named soup variant |
| CRG Somtam banner | [asset](https://crg.co.th/catalogue-assets/images/brand/brand-19-1-banner-1687416946.jpg) | 200 / image/jpeg | 1920×600 / RGB | 297,443 | — | Unlabelled, edge-clipped |
| ThongSmith page13 | [asset](https://online.anyflip.com/iugnb/rchh/files/large/149f53d9adcdaf5b0c5d7cf3e90ab16f.webp) | 200 / image/webp | 1980×2800 / RGB | 670,558 | — | GOOD crop; explicit noodle photo |
| ThongSmith Sept update | [asset](https://online.anyflip.com/iugnb/vgit/files/large/06e4cac9f018058a5ac9ce4424915f15.webp) | 200 / image/webp | 2240×2800 / RGB | 1,083,372 | — | Different new noodle specials |
| Steak & More Yum Woon Sen | [asset](https://cdn.minorfood.com/uploaded/brand/tile/175757423068c2745661fb5.jpg) | 200 / image/jpeg | 500×500 / RGB | 83,332 | — | SAFE |
| Steak & More Thai sides | [asset](https://cdn.minorfood.com/uploaded/editor/20250122/body-3.jpg) | 200 / image/jpeg | 1080×1350 / RGB | 814,426 | — | GOOD Som Tam crop |
| Steak & More pork | [asset](https://cdn.minorfood.com/uploaded/brand/tile/175757448468c275543004b.jpg) | 200 / image/jpeg | 500×500 / RGB | 85,237 | — | Extra side variant |
| Steak & More pasta collage | [asset](https://cdn.minorfood.com/uploaded/brand/tile/175757448468c275541669b.jpg) | 200 / image/jpeg | 500×500 / RGB | 94,321 | — | POOR tiny unlabelled region |

Representative merchant-menu assets (all anonymous200 JPEG,256×256 RGB, cache `public, max-age=16070400`) follow. They are technically accessible but provenance-limited, not runtime-approved. Full exact identity/portion caveats remain in the appendix.

| Brand | Merchant dish label | Direct image | Bytes |
|---|---|---|---:|
| zaab | ตำข้าวโพดไข่เค็ม | [merchant image](https://img.wongnai.com/p/256x256/2026/03/20/05e73467a67244fdb1c45ef1d80b0105.jpg) | 25,970 |
| zaab | ลาบหมู | [merchant image](https://img.wongnai.com/p/256x256/2026/03/20/660a47b4759140939a8437ad19e528be.jpg) | 27,493 |
| zaab | ไก่ย่างแซ่บอีลี่ | [merchant image](https://img.wongnai.com/p/256x256/2025/01/06/29fd31d376f6479aa9c0e39c97ea7138.jpg) | 29,770 |
| zaab | ไก่ทอดแซ่บอีลี่ | [merchant image](https://img.wongnai.com/p/256x256/2024/08/15/29e34de626474e708124c2a129c936c8.jpg) | 28,204 |
| zaab | ต้มแซ่บเอ็นแก้วเนื้อน่องลาย | [merchant image](https://img.wongnai.com/p/256x256/2025/08/22/0d0238495097440ca7c52ff48f17472b.jpg) | 22,855 |
| somtam | ส้มตำมั่ว | [merchant image](https://img.wongnai.com/p/256x256/2025/12/01/9f9822e8699040ccba438bf9159e8ef2.jpg) | 26,052 |
| somtam | ส้มตำปูปลาร้า | [merchant image](https://img.wongnai.com/p/256x256/2025/12/01/0847dac5ffb943f7a3f24f9817ef0ee9.jpg) | 26,958 |
| somtam | ส้มตำไทย | [merchant image](https://img.wongnai.com/p/256x256/2025/12/01/99ed9b052bac4570829af61d2686f95f.jpg) | 20,259 |
| somtam | ลาบหมู | [merchant image](https://img.wongnai.com/p/256x256/2025/12/01/1f0888611b6f41168c8fa92577b6c8e1.jpg) | 25,402 |
| somtam | ข้าวเหนียว | [merchant image](https://img.wongnai.com/p/256x256/2025/12/01/e06166556bfe4a8c9d4774e089518d4f.jpg) | 14,568 |
| Zaab | ตำไทยไข่เค็ม | [merchant image](https://img.wongnai.com/p/256x256/2026/03/20/8cda5ffb19df4cacb2534d21b46b404b.jpg) | 25,692 |
| Zaab | คอหมูย่างจิ้มแจ่ว | [merchant image](https://img.wongnai.com/p/256x256/2023/08/15/7649a763bf2a417e8fe0330186904397.jpg) | 22,217 |
| Somtam | ไก่ทอดเล็ก | [merchant image](https://img.wongnai.com/p/256x256/2025/12/01/c501c08d70444c30850d6c1ea317b08b.jpg) | 27,794 |
| Somtam | ต้มแซ่บกระดูกอ่อน | [merchant image](https://img.wongnai.com/p/256x256/2025/12/01/aebccfe731f44db8ba144ed51f0f98c8.jpg) | 23,187 |

Other limits: Salad Factory live403; indexed ALL ONLINE bulgogi live404; several official pages fail through the web text proxy but succeed in ordinary anonymous HTTP. Facebook/Instagram public profile shells are not logged-in content. Facebook CDN profile URLs include expiration parameters but contained logos, not verified missing dishes. AnyFlip hashed filenames are public/config-linked, without signed queries; edition replacement may invalidate them. Sukiya JPEGs are CMYK despite modest dimensions: a later implementation should convert only if separately authorized and visually verify colors. Official remote publication is not a runtime SLA.

## 14. Failed promising candidates and why

- Fuji non-SET sibling was found through WordPress media, but sauce ambiguity survived the strongest technical lead.
- Ootoya salmon title is generic; raw salmon flesh visibly falsifies a grilled mapping.
- Jones old Fish-01 was an omega-3 infographic. 2025 fish sheets retained different sauces; lemon-media matches included pork rice, not basa.
- Nittaya grilled-chicken soup looks tempting and is high resolution, but the official product names/describes Tom Yong. Similar appearance cannot establish Tom Saep.
- Sukiya code609 plain curry has only a listing. Removing meat from a topping photograph would invent a dish. Code105 set soup is pork miso, not standard miso.
- Santa Fe meat-sourcing documents prove supplier relationships, not plate identity. A 2024 two-chicken promotional set does not prove a two-piece jaew serving.
- CRG Somtam banner has no dish label and clipped plate boundaries. Sausage/rind cannot establish rice noodles or sauce. Wongnai crispy fried fish and fried-chicken larb are not fish larb.
- The Steak & More creamy salad and black pasta thumbnails look plausible, but exact toppings/labels and native region size are inadequate. Generic chicken meat in a mixed steak presentation is insufficient.
- Former Salad Factory domain's gambling content, similarly named Somtam Nuame, and overseas Sab-E-Lee were discarded. No review/customer photos were promoted to evidence.

## 15. Reuse-right uncertainty

Observable facts: first-party publication on restaurant/operator domains; retailer and AnyFlip vendor hosting; social-platform hosting; menu-sheet notices that pictures are for advertising purposes; Salad Factory copyright footer; Fuji copyright notice. No explicit third-party reuse licence was established. **Third-party reuse rights remain unestablished for every candidate, including SAFE_STANDALONE_CANDIDATES.** Anonymous download/hotlink success is a technical observation, not permission or a legal conclusion.

## 16. Findings that may indicate catalog-data errors

These are review flags, not production edits or definitive corrections:

1. Ootoya grilled salmon rice bowl has no equivalent grilled image in the inspected official product page; that page is raw salmon. Confirm whether catalog preparation/title references an actual distinct product.
2. Ezy Choice chicken sukiyaki official package/menu is glass noodles, not rice, and shows220 kcal versus catalog270. Could be a different product/version; do not simply rename from the image.
3. Korean fried rice has an explicitly changed recipe/label; page brand and image's EZY TASTE wording also differ. Confirm SKU/date and nutrition.
4. Salad Factory official pork salad adds konjac/wakame and lists376 kcal; generic catalog is380. Exact salmon sashimi list shows230, separate cooked and avocado entries400/652; the catalog340 estimate is not verified by those values. The indexed list's repeated currency/Cal formatting is inconsistent, so no price/nutrition inference should rely on list layout alone.
5. Nittaya uses Tom Yong, explicitly a Tom Yum/Tom Khlong blend. Catalog Tom Saep may be a loose translation or an incorrect soup identity; confirm before using its excellent image.
6. ThongSmith F2 is a dry chicken noodle dish with no-noodle option. Catalog Salad category and280-kcal/18g-carb estimate deserve review. Catalog does not expressly promise no noodles, so noodles alone are not a contradiction to its current name.
7. Shared dishes and retailer packages require portion matching: Zaab whole grilled chicken is not the per-person leg-quarter estimate; hotpots are not per-person nutrition photographs. Steak & More selectable sides can change calories. Caesar vegetarian tag should be checked against actual bacon/dressing ingredients; photo ambiguity is not proof of bacon.
8. Somtam Nua has a CRG operator ecosystem. Descriptions treating it simply as an independent non-chain restaurant should be reviewed. Current Tam Muah merchant naming emphasizes sausage/rind; catalog specifically adds rice noodles, which remain unverified in the official banner.

## 17. Potential implementation candidates and final validation

Research proposals only: one safe remote standalone (`steak-and-more-yum-woon-sen`) and four crop candidates in section9. Resolve their individual framing/catalog constraints and reuse permission before any future implementation. Jones is marginal for a large detail image; Ootoya requires a strict fish-oriented crop excluding the nearby set vessel. No crop or remote image was implemented. No Somtam Nua visibility decision was made; no first-party exact image is presently approved for its eight gaps.

Validation performed against the unchanged current source:

- Appendix:42 rows,42 unique IDs; exact set equality with image-less production records.
- Every appendix ID exists and lacks menuImage; no image-bearing ID is included.
- Classification totals42; exactly one primary classification per ID.
- SAFE set has one ID and is a subset of VERIFIED_STANDALONE.
- Previous research reports were never inspected, including after classification.
- Production files changed:NO. Tracked/staged diff remained empty; no pre-existing changes were disturbed (actual entry status was clean).
- Only new persistent file: `docs/restaurant-image-independent-research-sol.md`; no staged changes, commits, pushes or deployments.
- All task scratch downloads, helper scripts, metadata, contact sheets and PDF renders were deleted from the task-owned temporary directory after report generation and validation.

## 18. Appendix — all42 image-less production records

Names, category, price and nutrition below are current production values, not replacements from research. Nutrition units: kcal; protein/carbs/fat/fiber in grams, sodium in mg. A dash price means no production price. Serving/context dash means no explicit servingNote, not a guessed portion. Evidence keys refer to sections6–14.

| # | Menu ID | Restaurant ID / name | Thai / English name | Category | Production price THB | Production nutrition | Serving / meal context | Primary classification | Evidence / falsification |
|---:|---|---|---|---|---:|---|---|---|---|
| 1 | `ootoya-shima-hokke-grilled` | `ootoya-thailand` / Ootoya | ปลาชิมาฮอกเกะย่างถ่าน / Charcoal-Grilled Shima Hokke | Grilled/BBQ | 399 | kcal: 282, protein: 39.5, carbs: 7.9, fat: 12 | Served à la carte; rice and miso soup are not included in this figure. Meal context: add-on. | VERIFIED_CROP_CANDIDATE | O1: labelled official hokke set; fish-oriented crop can exclude rice/soup/custard, with plate/garnish framing limitations. ACCEPTABLE, conditional human crop review. |
| 2 | `ootoya-grilled-salmon-rice-bowl` | `ootoya-thailand` / Ootoya | ข้าวหน้าปลาแซลมอนย่าง / Grilled Salmon Rice Bowl | Rice & noodles | — | kcal: 640, protein: 30, carbs: 80, fat: 20 | One rice bowl, includes rice. | VERIFIED_VARIANT | O2: official salmon bowl depicts raw sashimi, contradicting grilled preparation. |
| 3 | `salad-factory-spicy-pork-tenderloin` | `salad-factory-thailand` / Salad Factory | สลัดสันในหมูรสแซ่บ / Spicy Pork Tenderloin Salad | Salad | — | kcal: 380, protein: 32, carbs: 20, fat: 17 | — | WEAK_CANDIDATE | SF1: official related title adds seaweed konjac and wakame; 376 kcal. Product source accessible through web index, direct anonymous fetch 403. No downloaded/viewed dish image; generic catalog equivalence unresolved. |
| 4 | `salad-factory-salmon-sashimi-shoyu` | `salad-factory-thailand` / Salad Factory | สลัดแซลมอนซาชิมิ ซอสโชยุวาซาบิ / Salmon Sashimi Salad, Shoyu-Wasabi Dressing | Salad | — | kcal: 340, protein: 24, carbs: 12, fat: 22 | — | WEAK_CANDIDATE | SF2: full-shop list has exact sashimi/shoyu-wasabi title (230 displayed), distinct cooked salmon (400) and avocado variant (652); exact card has no working product link in indexed page. No viewed image; 403 source. |
| 5 | `seven-eleven-chicken-sukiyaki` | `seven-eleven-thailand` / 7-Eleven Thailand | ข้าวหน้าไก่สุกี้ (อีซี่ ช้อยส์) / Ezy Choice Chicken Sukiyaki Rice | Rice & noodles | — | kcal: 270, protein: 19, carbs: 30, fat: 8, sodium: 1220 | One packaged ready-to-eat meal. | VERIFIED_VARIANT | SE1: official Ezy Choice chicken sukiyaki is glass noodles, egg and vegetables, not rice; package visibly says 250 g and 220 kcal. Catalog says rice and 270 kcal. |
| 6 | `seven-eleven-pork-bulgogi-rice` | `seven-eleven-thailand` / 7-Eleven Thailand | ข้าวหมูบูลโกกิ (แฮปปี้ เชฟ) / Happy Chef Pork Bulgogi Rice | Rice & noodles | — | kcal: 290, protein: 14, carbs: 54, fat: 2, sodium: 670 | One packaged ready-to-eat meal. | WEAK_CANDIDATE | SE2: ALL ONLINE indexed Happy Chef 260 g page matches title and has kimchi/spinach/pickled radish; both live page fetches 404. No direct image downloaded/viewed. Do not infer reformulation or safe match from indexed title. |
| 7 | `seven-eleven-korean-chicken-fried-rice` | `seven-eleven-thailand` / 7-Eleven Thailand | ข้าวผัดไก่เกาหลี (อีซี่โก) / Ezygo Korean Chicken Fried Rice | Rice & noodles | — | kcal: 440, protein: 17, carbs: 57, fat: 16, sodium: 890 | One packaged ready-to-eat meal. | VERIFIED_CURRENT_REFORMULATION | SE3: official product page explicitly documents new butter-fried rice, increased egg and changed label. Viewed promotion names EZY TASTE whereas page says EZYGO. Same retailer product mapping, historical recipe/label not suitable for unchanged catalog nutrition. |
| 8 | `seven-eleven-sticky-rice-dried-pork` | `seven-eleven-thailand` / 7-Eleven Thailand | ข้าวเหนียวหมูฝอย น้ำแจ่ว / Sticky Rice with Dried Pork and Jaew Sauce | Rice & noodles | — | kcal: 380, protein: 13, carbs: 63, fat: 8, sodium: 1030 | One packaged ready-to-eat meal. | NOT_FOUND | Official new-product/lifestyle and ALL ONLINE Thai/English name searches did not yield a labelled exact pork-floss plus jaew package. User reviews excluded. |
| 9 | `jones-honey-lemon-basa-steak` | `jones-salad-thailand` / Jones' Salad | สเต็กปลาบาซา ฮันนี่เลมอน / Honey Lemon Basa Fish Steak | Grilled/BBQ | — | kcal: 413, protein: 31, carbs: 32, fat: 16 | — | VERIFIED_VARIANT | J2: current and both 2025 fish sheets show Aow Thai Basa with Thai spicy sauce, truffle spinach or three sauces; no honey-lemon dish. Lemon media search yields pork rice, not basa. |
| 10 | `jones-mushroom-soup` | `jones-salad-thailand` / Jones' Salad | ซุปเห็ด / Mushroom Soup | Soup | 59 | kcal: 172, protein: 4, carbs: 14, fat: 10 | — | VERIFIED_CROP_CANDIDATE | J1: current sheet explicitly distinguishes plain 59-baht Mushroom Soup from truffle, bacon and spinach soups. Isolated white bowl ~265×210 native pixels; ACCEPTABLE card-only quality, detail view marginal. |
| 11 | `fuji-salmon-shioyaki` | `fuji-japanese-restaurant-thailand` / Fuji Japanese Restaurant | ปลาแซลมอนย่างเกลือ / Grilled Salmon Shioyaki | Grilled/BBQ | 290 | kcal: 340, protein: 30, carbs: 3, fat: 23 | Served à la carte; rice is not included. | VERIFIED_VARIANT | F1: WordPress à-la-carte sibling exists, but paired TERIYAKI/SHIOYAKI title uses visibly glazed fish. Cannot certify salt-only; full set adds further sides. |
| 12 | `sukiya-gyudon-okra-regular` | `sukiya-thailand` / Sukiya | ข้าวหน้าเนื้อโอคุระ (ไซส์ M) / Gyudon with Bonito Flakes & Okra (M) | Rice & noodles | 119 | kcal: 716, protein: 23.5, carbs: 103.5, fat: 23.5, sodium: 1320 | — | WEAK_CANDIDATE | SU1: exact labelled code105 M119 pictured, but standalone bowl ~140×100 px; larger set bowl ~220×175 has overlapping sides. POOR practical crop. |
| 13 | `sukiya-curry-rice-regular` | `sukiya-thailand` / Sukiya | ข้าวแกงกะหรี่ (ไซส์ M) / Japanese Curry Rice (M) | Rice & noodles | 89 | kcal: 653, protein: 12.8, carbs: 115.2, fat: 15.7, sodium: 1440 | — | NOT_FOUND | SU2: code609 M89 plain curry listed without photo; pictured curry dishes have meat/fried toppings. Cannot remove toppings to invent plain curry. |
| 14 | `sukiya-salad` | `sukiya-thailand` / Sukiya | สลัด / Salad | Salad | 45 | kcal: 28, protein: 1.5, carbs: 5.9, fat: 0.3, sodium: 40 | — | WEAK_CANDIDATE | SU1/SU3: code812 45-baht text only. Small salad in recommended set ~110×75 px; dressing and pickled-vegetable variants unresolved, POOR crop. |
| 15 | `sukiya-miso-soup` | `sukiya-thailand` / Sukiya | ซุปมิโสะ / Miso Soup | Soup | 30 | kcal: 38, protein: 2.4, carbs: 4.3, fat: 1.4, sodium: 880 | Sodium is disproportionately high relative to the calorie count — worth noting if tracking sodium intake. | WEAK_CANDIDATE | SU1/SU3: code819 30-baht text only; standard miso set photo ~130×90 px. Adjacent code105 soup is pork miso and wrong variant. POOR crop. |
| 16 | `santa-fe-grilled-chicken-pepper-steak` | `santa-fe-steak-thailand` / Santa Fe' Steak | สเต๊กไก่ ซอสเปปเปอร์ / Grilled Chicken Steak, Pepper Sauce | Grilled/BBQ | — | kcal: 320, protein: 34, carbs: 8, fat: 17 | — | NOT_FOUND | SA ecosystem: broken category image source, official promotion PDFs and exact pepper/เปปเปอร์ searches yielded no exact labelled usable image. Pork black-pepper photo is wrong protein. |
| 17 | `santa-fe-seabass-steak` | `santa-fe-steak-thailand` / Santa Fe' Steak | สเต๊กปลากระพง / Seabass Steak | Grilled/BBQ | — | kcal: 260, protein: 28, carbs: 6, fat: 15 | — | NOT_FOUND | SA ecosystem: official fish category image filename empty; current promotion is salmon, not seabass. Third-party customer photos excluded. |
| 18 | `santa-fe-chicken-steak-jaew` | `santa-fe-steak-thailand` / Santa Fe' Steak | สเต๊กไก่ 2 ชิ้น ซอสแจ่ว / Chicken Steak (2 Pieces), Jaew Sauce | Grilled/BBQ | — | kcal: 260, protein: 26, carbs: 10, fat: 13 | — | VERIFIED_VARIANT | SA1: labelled 2024 promo combines Space Chicken and Chicken Steak with Thai Spicy Sauce. Photo contains two different chicken preparations plus sides; cannot establish two-piece jaew-only catalog serving. |
| 19 | `santa-fe-premium-beef-steak` | `santa-fe-steak-thailand` / Santa Fe' Steak | สเต๊กโคขุน เนื้อนำเข้า / Premium Fattened Beef Steak, Imported | Grilled/BBQ | — | kcal: 430, protein: 35, carbs: 5, fat: 31 | — | NOT_FOUND | SA ecosystem: official imported-meat sourcing PDFs accessible but describe suppliers, not exact dish imagery. Review photos and historical promotional Easy/other cuts excluded. |
| 20 | `nittaya-tom-saep-grilled-chicken-soup` | `nittaya-kai-yang-thailand` / Nittaya Kai Yang | ต้มแซ่บไก่ย่าง / Spicy Grilled-Chicken Tom Saep Soup | Soup | — | kcal: 150, protein: 15, carbs: 5, fat: 7, sodium: 700 | Served as a shared bowl; this figure is a per-person portion (~250ml broth + ~80g chicken). | VERIFIED_VARIANT | N1: official standalone Tom Yong Grilled Chicken soup available, described as Tom Yum + Tom Khlong; no exact Tom Saep equivalence established. Shared hotpot also differs from catalog per-person nutrition portion. |
| 21 | `zaab-eli-grilled-chicken` | `zaab-eli-thailand` / Zaab Eli | ไก่ย่างแซ่บอีลี่ / Zaab Eli Grilled Chicken | Grilled/BBQ | 299 | kcal: 430, protein: 48, carbs: 4, fat: 23, sodium: 750 | The price point (฿299) implies a larger shared cut; this figure is for one leg-thigh quarter piece as a per-person portion. | MARKETPLACE_ONLY | Z1/Z2: Whole flattened grilled chicken pictured; catalog per-person leg-quarter estimate. Viewed merchant-menu image; brand-supplied provenance unestablished. |
| 22 | `zaab-eli-fried-chicken` | `zaab-eli-thailand` / Zaab Eli | ไก่ทอดแซ่บอีลี่ / Zaab Eli Fried Chicken | Grilled/BBQ | — | kcal: 480, protein: 28, carbs: 18, fat: 30, sodium: 700 | — | MARKETPLACE_ONLY | Z1/Z2: Fried thigh pieces with fried onion and dip. Viewed merchant-menu image; brand-supplied provenance unestablished. |
| 23 | `zaab-eli-grilled-pork-neck` | `zaab-eli-thailand` / Zaab Eli | คอหมูย่าง / Grilled Pork Neck | Grilled/BBQ | — | kcal: 460, protein: 33, carbs: 2, fat: 35, sodium: 500 | — | MARKETPLACE_ONLY | Z1/Z2: Merchant label คอหมูย่างจิ้มแจ่ว; grilled slices, not nam-tok salad. Viewed merchant-menu image; brand-supplied provenance unestablished. |
| 24 | `zaab-eli-som-tam-salted-egg` | `zaab-eli-thailand` / Zaab Eli | ส้มตำไทยไข่เค็ม / Thai Papaya Salad with Salted Egg | Salad | 120 | kcal: 270, protein: 9, carbs: 29, fat: 14, sodium: 1250 | Served as one shared plate; this figure is for the whole plate. | MARKETPLACE_ONLY | Z1/Z2: Merchant label ตำไทยไข่เค็ม. Viewed merchant-menu image; brand-supplied provenance unestablished. |
| 25 | `zaab-eli-corn-salted-egg-som-tam` | `zaab-eli-thailand` / Zaab Eli | ตำข้าวโพดไข่เค็ม / Corn & Salted Egg Papaya Salad | Salad | 120 | kcal: 280, protein: 8, carbs: 35, fat: 12, sodium: 1200 | Served as one shared plate; this figure is for the whole plate. | MARKETPLACE_ONLY | Z1/Z2: Merchant label ตำข้าวโพดไข่เค็ม; corn and salted egg visible. Viewed merchant-menu image; brand-supplied provenance unestablished. |
| 26 | `zaab-eli-larb-moo` | `zaab-eli-thailand` / Zaab Eli | ลาบหมู / Pork Larb | Salad | 125 | kcal: 270, protein: 25, carbs: 11, fat: 16, sodium: 650 | — | MARKETPLACE_ONLY | Z1/Z2: Merchant label ลาบหมู; minced pork salad. Viewed merchant-menu image; brand-supplied provenance unestablished. |
| 27 | `zaab-eli-tom-saep-beef-tendon-soup` | `zaab-eli-thailand` / Zaab Eli | ต้มแซ่บเอ็นแก้วเนื้อน่องลาย / Spicy Beef Shank & Tendon Soup | Soup | — | kcal: 220, protein: 20, carbs: 5, fat: 11, sodium: 750 | Served as a shared bowl; this figure is a per-person portion (~300ml broth + ~100g meat/tendon). | MARKETPLACE_ONLY | Z1/Z2: Merchant exact beef-shank/tendon Tom Saep label; separate bitter ต้มขม soup excluded. Viewed merchant-menu image; brand-supplied provenance unestablished. |
| 28 | `somtam-nua-papaya-salad-thai` | `somtam-nua-thailand` / Somtam Nua | ส้มตำไทย / Thai-Style Papaya Salad (Dried Shrimp & Peanut) | Salad | — | kcal: 190, protein: 5, carbs: 30, fat: 6, sodium: 1100 | Served as one shared plate; this figure is for the whole plate, not a per-person portion. | MARKETPLACE_ONLY | SN2: Thai papaya with peanuts/dried shrimp. Viewed merchant-menu image; official merchant/image-supplier provenance unestablished. |
| 29 | `somtam-nua-papaya-salad-fermented-crab` | `somtam-nua-thailand` / Somtam Nua | ส้มตำปูปลาร้า / Papaya Salad with Salted Crab & Fermented Fish Sauce | Salad | — | kcal: 220, protein: 7, carbs: 28, fat: 7, sodium: 2000 | Served as one shared plate; this figure is for the whole plate. Sodium is very high due to fermented fish sauce (plara). | MARKETPLACE_ONLY | SN2: Crab/plara papaya label; sauce not independently verified. Viewed merchant-menu image; official merchant/image-supplier provenance unestablished. |
| 30 | `somtam-nua-tam-muah` | `somtam-nua-thailand` / Somtam Nua | ตำมั่ว / Mixed Papaya Salad with Rice Noodles & Crispy Pork Rind | Salad | — | kcal: 400, protein: 10, carbs: 50, fat: 16, sodium: 1300 | Served as one shared plate; this figure is for the whole plate. | WEAK_CANDIDATE | SN1: CRG banner authentic but unlabelled, sausage/rind/papaya visible; rice noodles unproven, plate cut off at banner edges. SN2 marketplace labelled Tam Muah exists but cannot validate CRG image equivalence. Do not substitute Thai Muah or assume sauce. |
| 31 | `somtam-nua-larb-moo` | `somtam-nua-thailand` / Somtam Nua | ลาบหมู / Pork Larb with Liver | Salad | — | kcal: 400, protein: 28, carbs: 14, fat: 25, sodium: 1500 | Served as one shared plate; this figure is for the whole plate. | MARKETPLACE_ONLY | SN2: Pork larb label; liver presence not established at thumbnail resolution. Viewed merchant-menu image; official merchant/image-supplier provenance unestablished. |
| 32 | `somtam-nua-larb-fried-fish` | `somtam-nua-thailand` / Somtam Nua | ลาบปลาทอด / Crispy Fried Fish Larb | Salad | — | kcal: 450, protein: 26, carbs: 20, fat: 28, sodium: 1200 | Served as one shared plate; this figure is for the whole plate. | NOT_FOUND | CRG, anonymous official socials, news and merchant menus yielded no exact fish-larb candidate. Merchant crispy fish and fried-chicken larb are different dishes; customer blog images excluded. |
| 33 | `somtam-nua-fried-chicken` | `somtam-nua-thailand` / Somtam Nua | ไก่ทอด / Thai Fried Chicken Wings | Grilled/BBQ | — | kcal: 550, protein: 35, carbs: 15, fat: 38, sodium: 900 | Served as one plate (several pieces), typically shared; this figure is for the whole plate. | MARKETPLACE_ONLY | SN2: Small/large baskets visibly contain wings. Viewed merchant-menu image; official merchant/image-supplier provenance unestablished. |
| 34 | `somtam-nua-tom-saep-pork-bone-soup` | `somtam-nua-thailand` / Somtam Nua | ต้มแซ่บกระดูกหมูอ่อน / Spicy Isan Pork-Bone Soup | Soup | — | kcal: 250, protein: 18, carbs: 8, fat: 15, sodium: 1700 | Served as one shared bowl; this figure is for the whole bowl. | MARKETPLACE_ONLY | SN2: ต้มแซ่บกระดูกอ่อน hotpot, not per-person serving. Viewed merchant-menu image; official merchant/image-supplier provenance unestablished. |
| 35 | `somtam-nua-sticky-rice` | `somtam-nua-thailand` / Somtam Nua | ข้าวเหนียว / Sticky Rice | Rice & noodles | — | kcal: 200, protein: 4, carbs: 44, fat: 1, sodium: 2 | One standard individual-serving basket. | MARKETPLACE_ONLY | SN2: Individual rice basket; exact weight unknown. Viewed merchant-menu image; official merchant/image-supplier provenance unestablished. |
| 36 | `thongsmith-spicy-shredded-chicken-dry` | `thongsmith-boat-noodle-thailand` / ThongSmith | แซ่บแห้งไก่ฉีก / Spicy Shredded Chicken (Dry, No Soup) | Salad | — | kcal: 280, protein: 26, carbs: 18, fat: 12, sodium: 1100 | — | VERIFIED_CROP_CANDIDATE | T1: page13 F2 แซ่บแห้งไก่ฉีก / Chicken Noodles with Spicy Sauce, 139. Dry/no soup exact preparation; catalog does not explicitly exclude noodles. Isolated bottom bowl ~800×660 native px, GOOD. Category/nutrition require review; not evidence of no-noodle variant. |
| 37 | `steak-and-more-chicken-steak` | `steak-and-more-thailand` / The Steak & More | สเต็กไก่ / Chicken Steak | Grilled/BBQ | — | kcal: 380, protein: 38, carbs: 20, fat: 16, sodium: 650 | Includes an estimate for the bundled side salad/bread served with the set. | WEAK_CANDIDATE | SM1/SM2: operator photos include grilled chicken with fried fish and selectable sides. Generic single-chicken steak cannot be isolated with sufficient labelled protein/sauce identity. |
| 38 | `steak-and-more-pork-chop` | `steak-and-more-thailand` / The Steak & More | สเต็กหมู / Pork Chop Steak | Grilled/BBQ | — | kcal: 430, protein: 35, carbs: 18, fat: 25, sodium: 600 | Includes an estimate for the bundled side salad/bread served with the set. | VERIFIED_VARIANT | SM1: operator tile depicts bone-in pork chop with bread/salad and an additional Thai side bowl; catalog estimated serving names salad/bread. Extra side prevents unchanged-serving approval. |
| 39 | `steak-and-more-squid-ink-spaghetti-shrimp` | `steak-and-more-thailand` / The Steak & More | สปาเก็ตตี้หมึกดำกุ้ง / Black Squid-Ink Spaghetti with Shrimp | Rice & noodles | — | kcal: 520, protein: 24, carbs: 68, fat: 16, sodium: 950 | — | WEAK_CANDIDATE | SM1: black pasta with prawns in official 500px collage; unlabelled ~150×100 region is POOR, not practical. |
| 40 | `steak-and-more-caesar-salad` | `steak-and-more-thailand` / The Steak & More | ซีซาร์สลัด / Caesar Salad | Salad | — | kcal: 320, protein: 12, carbs: 16, fat: 24, sodium: 580 | — | WEAK_CANDIDATE | SM1: official collage has creamy lettuce salad, but Caesar identity/toppings cannot be established; bacon would conflict with vegetarian tag. No labelled separate asset. |
| 41 | `steak-and-more-som-tam` | `steak-and-more-thailand` / The Steak & More | ส้มตำ / Som Tam (Thai Papaya Salad) | Salad | — | kcal: 170, protein: 5, carbs: 25, fat: 6, sodium: 850 | — | VERIFIED_CROP_CANDIDATE | SM2: operator article names Som Tam; top dish clearly shredded papaya, beans, tomato and peanuts. Separate plate ~460×470, GOOD; no added protein visible, no variant stated in catalog. |
| 42 | `steak-and-more-yum-woon-sen` | `steak-and-more-thailand` / The Steak & More | ยำวุ้นเส้น / Yum Woon Sen (Glass Noodle Salad) | Salad | — | kcal: 280, protein: 14, carbs: 32, fat: 10, sodium: 900 | — | VERIFIED_STANDALONE | SM1: operator article explicitly offers Yum Woon Sen; dedicated tile visibly glass noodles, minced meat, onion, tomato, lettuce. Generic catalog has no conflicting protein/sauce customization. High-confidence identity from first-party context and preparation; 500×500 RGB usable. |
