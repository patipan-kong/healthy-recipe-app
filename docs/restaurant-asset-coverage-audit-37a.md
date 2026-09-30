# Slice 37A — Final Restaurant Asset Coverage Audit

Audit only. No production data, UI, tests or assets were changed or added. Research date: 2026-09-30.

## Executive summary

- **Logos:** 8/13 today. Five logo-less restaurants all have an authentic, browser-loadable brand mark: **5 VERIFIED_LOGO** (1 Tier A, 4 Tier B), 0 problematic-only, 0 weak, 0 not found. Potential 13/13 (100%) — but 4 of 5 come from Tier B channels (LINE Official Account or a Linktree hub), not first-party websites, and reuse rights are unestablished.
- **Menu images:** 22/84 (26.2%) today. Of 62 image-less items only **1 is VERIFIED_IMAGE** (7-Eleven Ezygo Korean Chicken Fried Rice). 6 are VERIFIED_VARIANT (set/size/topping mismatch), 13 are WEAK_CANDIDATE (mostly official menu collages), **42 NOT_FOUND**. Strict-policy potential: **23/84 (27.4%)**.
- The gap is structural, not a search failure: the 26 items of Salad Factory, Zaab Eli, Somtam Nua and ThongSmith exist only behind login-gated social media (or, for ThongSmith, a flipbook), the six The Steak & More items have no itemised digital menu at all, and the official menus of Jones' Salad and Santa Fe are collage sheets marked "for advertising purposes only".
- Facebook and Instagram media URLs are **not hotlink-safe** (Facebook profile URLs are crawler-only and redirect a real browser to a page; Instagram URLs carry `oe=` expiry) — both failed a browser decode test. Logos above were therefore taken from LINE/CRG/Linktree CDNs, which decode fine.

## Entry state

- Branch `main`, HEAD `f5f37f4c09a77d973d9369a4324dbdaa78998228` ("feat: unify cook and buy discovery"), worktree clean, last five commits as expected.
- Production recount (test-harness dump of `restaurants` / `restaurantMenuItems`, since deleted): 13 restaurants, 84 items, 8 logos, 22 menu images -> **5 logo-less restaurants, 62 image-less items**.
- Logo-less: `salad-factory-thailand`, `santa-fe-steak-thailand`, `zaab-eli-thailand`, `somtam-nua-thailand`, `thongsmith-boat-noodle-thailand`.

## Source policy

Tier A = restaurant/operator/corporate first-party site or CDN. Tier B = clearly brand-controlled social/LINE/link-hub, accepted only with a documented reason. Excluded: Google/Wongnai/TripAdvisor/blogs/customer or influencer posts/aggregators/stock/AI. Marketplace listings (Grab, LINE MAN, foodpanda) default to WITHHELD; none were used as evidence. Facebook/Instagram were read only through public link-preview metadata (`og:` tags via a crawler user-agent); no login, no personal session. Internet Archive was unavailable (HTTP 503) during the audit. Provenance, hotlink stability and reuse-right certainty are recorded separately; nothing was downloaded into the repo or bundled, and no legal conclusion is offered.

## Logo results

| Class | Count |
| --- | --- |
| VERIFIED_LOGO | 5 |
| VERIFIED_BUT_VISUALLY_PROBLEMATIC | 0 |
| WEAK_CANDIDATE | 0 |
| NOT_FOUND | 0 |

Coverage: 8/13 (61.5%) -> 13/13 (100%) if all five are accepted. Per-restaurant detail is in Appendix A.

## Menu image results

| Class | Count |
| --- | --- |
| VERIFIED_IMAGE | 1 |
| VERIFIED_VARIANT | 6 |
| WEAK_CANDIDATE | 13 |
| NOT_FOUND | 42 |

Coverage: 22/84 (26.2%) -> **23/84 (27.4%)** on the strict safe batch. If the owner accepted the 6 VERIFIED_VARIANT items it would be 29/84 (34.5%); if in addition a "crop a single dish from an official menu spread" policy were adopted, up to 33/84 (39.3%) (Santa Fe salmon steak, dory fish steak; and 2 more only with caveats). Those are not recommendations.

## Safe implementation candidates

Only `VERIFIED_LOGO` and `VERIFIED_IMAGE`; see "Recommended next implementation batch".

## Withheld candidates and reasons

- **Fuji, Ootoya, Sukiya (6 VERIFIED_VARIANT):** genuine first-party photos of a *set*, wrong size or wrong topping; the same rule that kept these out in 18–35B.
- **Jones' Salad (6) and Sukiya okra gyudon:** dishes exist only inside full-page menu sheets with an advertising-only disclaimer; no standalone photos.
- **Santa Fe salmon steak / dory fish steak:** exact dishes and prices in the official 2025 e-menu, but as portions of a two-page spread (2728x1972). Content is right; a crop would be a derivative of a collage.
- **Ootoya grilled salmon rice bowl:** the only salmon donburi is raw sashimi; the Fuji "SALMON-TERIYAKI" thumbnail is a roll. Both would be wrong-dish errors.
- **Facebook profile images (Santa Fe, Salad Factory, Somtam Nua, ThongSmith):** authentic marks but crawler-only `lookaside.fbsbx.com` URLs; a real browser is redirected to a Facebook page. Not usable for hotlinking.

## Coverage by restaurant

| Restaurant | Images now | New VERIFIED_IMAGE | Safe total | VERIFIED_VARIANT | WEAK | Still none (strict) | Logo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ootoya | 3/6 | 0 | 3/6 | 2 | 1 | 3 | logo |
| Salad Factory | 0/6 | 0 | 0/6 | 0 | 0 | 6 | logo candidate (B) |
| 7-Eleven Thailand | 2/6 | 1 | 3/6 | 0 | 0 | 3 | logo |
| Jones' Salad | 0/7 | 0 | 0/7 | 0 | 6 | 7 | logo |
| Fuji Japanese Restaurant | 4/6 | 0 | 4/6 | 2 | 0 | 2 | logo |
| MK Restaurants | 7/7 | 0 | 7/7 | 0 | 0 | 0 | logo |
| Sukiya | 0/6 | 0 | 0/6 | 2 | 1 | 6 | logo |
| Santa Fe' Steak | 0/7 | 0 | 0/7 | 0 | 4 | 7 | logo candidate (B) |
| Nittaya Kai Yang | 6/7 | 0 | 6/7 | 0 | 1 | 1 | logo |
| Zaab Eli | 0/7 | 0 | 0/7 | 0 | 0 | 7 | logo candidate (B) |
| Somtam Nua | 0/8 | 0 | 0/8 | 0 | 0 | 8 | logo candidate (A) |
| ThongSmith | 0/5 | 0 | 0/5 | 0 | 0 | 5 | logo candidate (B) |
| The Steak & More | 0/6 | 0 | 0/6 | 0 | 0 | 6 | logo |

Descriptive read: **strong first-party visuals** — MK (7/7), Nittaya (6/7), Fuji (4/6, remaining 2 are set photos), Ootoya (3/6, remaining 3 are set/raw-salmon issues). **Partial** — 7-Eleven (2/6 +1: product-pack shots exist only for some SKUs). **Almost none usable** — Jones' and Santa Fe (collage menus only), Sukiya (bowl thumbnails; one variant), The Steak & More (no dish imagery), and the four social-only brands (Salad Factory, Zaab Eli, Somtam Nua, ThongSmith).

## Technical asset health

Browser decode (headless Edge, page origin `http://localhost:4173`, `Image()` load):

| Candidate | Result | Notes |
| --- | --- | --- |
| Salad Factory logo (LINE CDN) | OK 200x200 | ACAO *, max-age 86400, content-addressed URL |
| Santa Fe logo (LINE CDN) | OK 200x200 | same |
| Zaab Eli logo (LINE CDN) | OK 200x200 | same |
| Somtam Nua logo (crg.co.th) | OK 800x600 | static timestamped path |
| ThongSmith logo (linktr.ee UGC) | OK 600x600 | immutable, 1-year cache |
| 7-Eleven Korean chicken fried rice (-00 and -01) | OK 555x555 | official CDN, same family as existing images |
| Facebook lookaside profile URL | FAIL (redirects to a Facebook page for browsers; image only for crawler UA) | not hotlink-safe |
| Instagram scontent profile URL | FAIL | signed URL with `oe=` expiry |
| Existing Sukiya logo (control) | OK 270x223 | control passes |

curl vs browser: Ootoya asset paths return 403 to curl when non-ASCII path segments are not percent-encoded and load fine when encoded; allonline product pages return 400 to unencoded Thai URLs. No candidate needed a session. LINE profile URLs are content-addressed: a brand avatar change would orphan the URL (the initials fallback already handles image errors).

## Social-source findings

- Facebook pages checked through link-preview metadata: Salad Factory Thailand (50k followers), Santa Fe Happy Steak (749k), Somtamnua (5.5k), ThongSmith (33k). Only profile pictures are visible; posts are gated. Profile pictures prove the *logo* (provenance A/B) but are IMPLEMENTATION_REQUIRES_ASSET_STRATEGY (crawler-only URLs).
- Instagram (@zaabeli 8.5k, @somtamnua 4.3k, @thongsmith 94k): profile metadata only; no dish media accessible; profile-image URLs expire.
- Official-ness evidence that mattered: Somtam Nua FB/IG are linked from the operator page crg.co.th; Zaab Eli and Santa Fe FB are linked from their LINE OA pages; ThongSmith FB/IG/TikTok/LINE are all listed on the brand Linktree. Name match alone was never accepted.
- LINE OA public pages expose profile image and links but no feed or menu media in server-rendered data; the "media" sub-routes discovered by search returned 404.

## Coverage ceiling

- Logos: 13/13 (100%) reachable under the expanded policy (1 Tier A + 4 Tier B).
- Menu images: 23/84 (27.4%) reachable under the current strict policy. Realistic headroom by decision: +6 (variants), +4 to +11 (collage crops), and everything else needs new access, not new policy (see below).

## What prevents 100% coverage

Reason for the 61 items that do not reach VERIFIED_IMAGE:

| Reason | Items |
| --- | --- |
| Exact variant cannot be established (set/size/topping/preparation) | 8 |
| Official image exists only inside a menu sheet/spread (collage) | 11 |
| Official presence but the dish (or a standalone image) is absent | 10 |
| Only social/login-gated or flipbook evidence (no inspectable dish media) | 26 |
| No itemised official digital presence for dishes | 6 |

Items that could only be filled by relaxing the current truth/provenance policy (variants, collage crops, marketplace or login-gated social): 51. The remaining 10 have no known official image at all and would need customer/marketplace/AI imagery, which is disallowed. No relaxation is recommended here; this is the trade-off table only.

## Recommended next implementation batch

Only VERIFIED_LOGO and VERIFIED_IMAGE, no variants or weak candidates:

**Restaurant logos (5)** — `logo` entries would use `kind: official-remote`, the existing `RestaurantLogo` shape (`src`, alt, `sourceUrl`, `sourceLabel`, `asOf`):

- `salad-factory-thailand` — Tier B; src `https://profile.line-scdn.net/0hz4jveXzBJRtXDzk5qrpaTGtKK3YgISNTLzw4fycIcywqOmMYO2pqKXBdLCoqaDVFbWFsKSFYfC8p/preview`; source https://page.line.me/pac6513g (LINE Official Account "Saladfactory", 202k friends; linked from brand FB https://www.facebook.com/saladfactoryofthailand/)
- `santa-fe-steak-thailand` — Tier B; src `https://profile.line-scdn.net/0hsv5twe1dLFkIDTBwDf5TDjRIIjR_IyoRcDlkayhadmwtaTwJMDxmNi5eemBwaG4OMWpraisLdjwk/preview`; source https://page.line.me/santafesteak (LINE OA "Santa Fe Happy Steak", 682k friends; links https://santafesteak.com/santafesteak/ and https://www.facebook.com/santafesteak.th/)
- `zaab-eli-thailand` — Tier B; src `https://profile.line-scdn.net/0hLoXsNM-aE0BlCg8MHNdsF1lPHS0SJBUIHTkIIUUIRHBMalNFWDlUcRUPT3QaaVAQDD8IJRcOSiQb/preview`; source https://page.line.me/ntw0665w (LINE OA "Zaab Eli", 121k friends; lists https://www.facebook.com/zaabeli; Instagram https://www.instagram.com/zaabeli/ 8.5k followers)
- `somtam-nua-thailand` — Tier A; src `https://crg.co.th/catalogue-assets/images/brand/brand-19-1-logo-1687057873.png`; source https://crg.co.th/brand-details/19/SomtamNua (Central Restaurants Group, the operator; page links the brand Facebook https://www.facebook.com/Somtamnuathailand and Instagram https://www.instagram.com/somtamnua/)
- `thongsmith-boat-noodle-thailand` — Tier B; src `https://ugc.production.linktr.ee/xUhS40tTQxmfd8LZ6Lff_c2ASFv2sCRhR666E`; source https://linktr.ee/thongsmith (brand link hub: FB, IG, TikTok, LINE OA lin.ee/o0KmEOk, Grab/LINE MAN, menu book, ~30 branch phone numbers)

**Menu images (1)**:

- `seven-eleven-korean-chicken-fried-rice` — src `https://media.allonline.7eleven.co.th/pdmain/713057-00-allonline-sm-NewOnlyat.jpg`; source page `https://allonline.7eleven.co.th/p/อีซี่โก-ข้าวผัดไก่เกาหลี-250g/328382/`; note the reformulation caveat.

Owner decisions before implementing: (1) whether Tier B LINE/Linktree logos are acceptable, especially Zaab Eli and ThongSmith (weakest provenance); (2) Santa Fe current vs legacy mark; (3) reuse-right exposure of hotlinking third-party brand marks. Expected UI effect if all five logos ship: Restaurant Grid logo-first row becomes all 13; menu image coverage moves 22 -> 23.

## Appendix A — 5 logo rows

| Restaurant ID | Name | Class | Tier | Official page | Asset URL | Format | Suitability | Provenance reasoning | Flags | Date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| salad-factory-thailand | Salad Factory | VERIFIED_LOGO | B | https://page.line.me/pac6513g (LINE Official Account "Saladfactory", 202k friends; linked from brand FB https://www.facebook.com/saladfactoryofthailand/) | https://profile.line-scdn.net/0hz4jveXzBJRtXDzk5qrpaTGtKK3YgISNTLzw4fycIcywqOmMYO2pqKXBdLCoqaDVFbWFsKSFYfC8p/preview | JPEG 200x200, opaque white background | Full colour oval mark on white; reads on the light tile. Same mark as the Facebook profile picture (1200x1200, crawler-only URL). | LINE OA is brand-operated and lists the brand website and ordering route; identical mark on the brand Facebook page. The former brand domain saladfactorythailand.com is now a gambling-spam site (re-confirmed today), so the LINE/Facebook channels are the only live brand-controlled endpoints. | Hotlink OK in browser (ACAO *, max-age 86400). URL is content-addressed; if the brand changes its avatar the old URL may stop resolving (initials fallback covers this). | 2026-09-30 |
| santa-fe-steak-thailand | Santa Fe' Steak | VERIFIED_LOGO | B | https://page.line.me/santafesteak (LINE OA "Santa Fe Happy Steak", 682k friends; links https://santafesteak.com/santafesteak/ and https://www.facebook.com/santafesteak.th/) | https://profile.line-scdn.net/0hsv5twe1dLFkIDTBwDf5TDjRIIjR_IyoRcDlkayhadmwtaTwJMDxmNi5eemBwaG4OMWpraisLdjwk/preview | JPEG 200x200, opaque orange tile | Current "Santa Fe Happy Steak" mark (white on brand orange), self-contained background, excellent on the tile. The official website header still shows the LEGACY train mark: /santafesteak/img/logo.png (916x916, white-on-transparent, invisible on light UI = VERIFIED_BUT_VISUALLY_PROBLEMATIC) and /santafesteak/img/logo2.png (334x338 black circle, legacy). The chain is mid-rebrand (public posts note branches changing logos), so the LINE/Facebook mark is the current one. | LINE OA links the official website and official Facebook; the website itself is Tier A but carries the outdated mark. | Hotlink OK in browser. Choice between current (Tier B) and legacy (Tier A) mark is an owner decision; the current mark is recommended. | 2026-09-30 |
| zaab-eli-thailand | Zaab Eli | VERIFIED_LOGO | B | https://page.line.me/ntw0665w (LINE OA "Zaab Eli", 121k friends; lists https://www.facebook.com/zaabeli; Instagram https://www.instagram.com/zaabeli/ 8.5k followers) | https://profile.line-scdn.net/0hLoXsNM-aE0BlCg8MHNdsF1lPHS0SJBUIHTkIIUUIRHBMalNFWDlUcRUPT3QaaVAQDD8IJRcOSiQb/preview | JPEG 200x200, opaque black tile | White Thai/Latin wordmark with chili on black. Self-contained background; legible at 84px. | Brand has no website (zaabeli.com/.co.th do not resolve). LINE OA is brand-operated and cross-links the brand Facebook; consistent name, phone and branch data. | Hotlink OK in browser. Weakest Tier B case: no first-party website to corroborate. Reuse rights unknown. | 2026-09-30 |
| somtam-nua-thailand | Somtam Nua | VERIFIED_LOGO | A | https://crg.co.th/brand-details/19/SomtamNua (Central Restaurants Group, the operator; page links the brand Facebook https://www.facebook.com/Somtamnuathailand and Instagram https://www.instagram.com/somtamnua/) | https://crg.co.th/catalogue-assets/images/brand/brand-19-1-logo-1687057873.png | PNG RGBA 800x600 | White "SOMTAM" + orange Thai word on a black bar, with transparent padding (bar occupies about 85% of width). Works with object-fit: contain on a light tile. | Published by the operating company on its own brand catalogue; also gives the first cross-link proving the brand Facebook/Instagram are official (useful for any later social-source work). somtamnua.com is a parked lander, not a brand site. | Static, non-signed, timestamped path; best hotlink stability of the five. | 2026-09-30 |
| thongsmith-boat-noodle-thailand | ThongSmith | VERIFIED_LOGO | B | https://linktr.ee/thongsmith (brand link hub: FB, IG, TikTok, LINE OA lin.ee/o0KmEOk, Grab/LINE MAN, menu book, ~30 branch phone numbers) | https://ugc.production.linktr.ee/xUhS40tTQxmfd8LZ6Lff_c2ASFv2sCRhR666E | JPEG 600x600, opaque charcoal square | White Thai wordmark + gold script + boat illustration on charcoal; self-contained background. Facebook profile picture uses the same wordmark without the boat. | Link hub is the same page that 35A used to reach the brand-endorsed menu book; content (all official channels and branch numbers) is brand-authored. Not linked back from a first-party website (thongsmith.com is a parked-domain redirect). | Cache-Control public, max-age=31536000, immutable: the most stable URL among Tier B candidates. Linktree is a third-party host; provenance is moderate rather than strong. | 2026-09-30 |

## Appendix B — 62 menu-image rows

| # | Menu item ID | Restaurant | Catalog dish | Class | Tier | Evidence / reason | Date |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ootoya-shima-hokke-grilled | Ootoya | Charcoal-Grilled Shima Hokke | VERIFIED_VARIANT | A | Official item page https://www.ootoya.co.th/menu-details.php?id=1; image .../upload_file/menu/Fish-Menu/ปลาชิมาฮอกเกะย่างถ่าน-big.png (PNG 800x600, decodes in browser). Photo is the full set (rice, miso, side dishes, tea); catalog price 399 is à la carte. | 2026-09-30 |
| 2 | ootoya-oyakodon | Ootoya | Oyakodon (Chicken & Egg Rice Bowl) | VERIFIED_VARIANT | A | Official item page https://www.ootoya.co.th/menu-details.php?id=72; image .../Donburi-Menu/ข้าวหน้าไก่โอยาโกะ-big.png (PNG 800x600). Bowl is correct but the photo carries side dishes (chawanmushi cup, pickle, nori); bowl 199 vs set 229 not distinguishable. | 2026-09-30 |
| 3 | ootoya-grilled-salmon-rice-bowl | Ootoya | Grilled Salmon Rice Bowl | WEAK_CANDIDATE | A | Official https://www.ootoya.co.th/menu-details.php?id=79 (ข้าวหน้าปลาแซลมอน, 329/359) shows raw marinated salmon sashimi, not a grilled salmon bowl. Different preparation; rejected again. | 2026-09-30 |
| 4 | salad-factory-grilled-chicken-sesame | Salad Factory | Japanese-Style Grilled Chicken Breast Salad, Sesame Dressing | NOT_FOUND | - | Former site saladfactorythailand.com now serves gambling spam / 404 on menu routes (re-confirmed); Internet Archive returned 503 "Temporarily Offline" during this audit; brand Facebook and LINE OA expose no inspectable dish media without login. | 2026-09-30 |
| 5 | salad-factory-quinoa-chicken-basil | Salad Factory | Quinoa Salad with Grilled Chicken Breast, Spicy Holy Basil | NOT_FOUND | - | Former site saladfactorythailand.com now serves gambling spam / 404 on menu routes (re-confirmed); Internet Archive returned 503 "Temporarily Offline" during this audit; brand Facebook and LINE OA expose no inspectable dish media without login. | 2026-09-30 |
| 6 | salad-factory-kale-chicken-truffle | Salad Factory | Kale Salad with Chicken Breast, Truffle Dressing | NOT_FOUND | - | Former site saladfactorythailand.com now serves gambling spam / 404 on menu routes (re-confirmed); Internet Archive returned 503 "Temporarily Offline" during this audit; brand Facebook and LINE OA expose no inspectable dish media without login. | 2026-09-30 |
| 7 | salad-factory-rocket-skirt-steak | Salad Factory | Rocket Salad with Grilled Skirt Steak, Balsamic | NOT_FOUND | - | Former site saladfactorythailand.com now serves gambling spam / 404 on menu routes (re-confirmed); Internet Archive returned 503 "Temporarily Offline" during this audit; brand Facebook and LINE OA expose no inspectable dish media without login. | 2026-09-30 |
| 8 | salad-factory-spicy-pork-tenderloin | Salad Factory | Spicy Pork Tenderloin Salad | NOT_FOUND | - | Former site saladfactorythailand.com now serves gambling spam / 404 on menu routes (re-confirmed); Internet Archive returned 503 "Temporarily Offline" during this audit; brand Facebook and LINE OA expose no inspectable dish media without login. | 2026-09-30 |
| 9 | salad-factory-salmon-sashimi-shoyu | Salad Factory | Salmon Sashimi Salad, Shoyu-Wasabi Dressing | NOT_FOUND | - | Former site saladfactorythailand.com now serves gambling spam / 404 on menu routes (re-confirmed); Internet Archive returned 503 "Temporarily Offline" during this audit; brand Facebook and LINE OA expose no inspectable dish media without login. | 2026-09-30 |
| 10 | seven-eleven-chicken-sukiyaki | 7-Eleven Thailand | Ezy Choice Chicken Sukiyaki Rice | NOT_FOUND | A | Only related product is Ezy Choice "Hสุกี้ไก่ขลุกขลิก 250g" (egg-coated glass noodles in sukiyaki sauce, product 355384), a different dish from chicken sukiyaki rice. | 2026-09-30 |
| 11 | seven-eleven-pork-bulgogi-rice | 7-Eleven Thailand | Happy Chef Pork Bulgogi Rice | NOT_FOUND | A | Happy Chef brand listing on allonline shows ramyeon items only; no pork bulgogi rice product found. | 2026-09-30 |
| 12 | seven-eleven-korean-chicken-fried-rice | 7-Eleven Thailand | Ezygo Korean Chicken Fried Rice | VERIFIED_IMAGE | A | Official product page https://allonline.7eleven.co.th/p/อีซี่โก-ข้าวผัดไก่เกาหลี-250g/328382/ (Ezygo Korean Chicken Fried Rice 250g). Image https://media.allonline.7eleven.co.th/pdmain/713057-00-allonline-sm-NewOnlyat.jpg (og:image; also -01-allonline-sm.jpg, both JPEG 555x555, decode in browser). Same product class and image family as the two accepted 7-Eleven images. Caveat: page says the recipe was reformulated ("ปรับสูตรใหม่", extra egg) and the item was out of stock in 35A; the pack shows the current formula. | 2026-09-30 |
| 13 | seven-eleven-sticky-rice-dried-pork | 7-Eleven Thailand | Sticky Rice with Dried Pork and Jaew Sauce | NOT_FOUND | A | No matching product on allonline (only CP grilled-pork sticky rice, a different product). | 2026-09-30 |
| 14 | jones-chicken-sesame-salad | Jones' Salad | Grilled Chicken Breast Salad, Roasted Sesame Dressing | WEAK_CANDIDATE | A | Official https://www.jonessalad.com/menu/ ... Western sheet (Aug-12_Salad_Western.jpg): M 115 / L 135 sizes; catalog has no size. Full-page menu artwork (923x1536 class) that carries the disclaimer "The pictures are for advertising purposes only". No standalone dish photos exist on the site. Cropping a sheet would be modification of a collage. | 2026-09-30 |
| 15 | jones-grilled-salmon-salad | Jones' Salad | Grilled Salmon Salad | WEAK_CANDIDATE | A | Official https://www.jonessalad.com/menu/ ... Western sheet: grilled salmon salad 369 photographed in the sheet. Full-page menu artwork (923x1536 class) that carries the disclaimer "The pictures are for advertising purposes only". No standalone dish photos exist on the site. Cropping a sheet would be modification of a collage. | 2026-09-30 |
| 16 | jones-caesar-chicken-salad | Jones' Salad | Caesar Chicken Salad | WEAK_CANDIDATE | A | Official https://www.jonessalad.com/menu/ ... Western sheet: chicken Caesar M119 / L139. Full-page menu artwork (923x1536 class) that carries the disclaimer "The pictures are for advertising purposes only". No standalone dish photos exist on the site. Cropping a sheet would be modification of a collage. | 2026-09-30 |
| 17 | jones-chicken-larb-crispy-rice-salad | Jones' Salad | Chicken Larb & Crispy Rice Salad | WEAK_CANDIDATE | A | Official https://www.jonessalad.com/menu/ ... Spicy Thai sheet (Aug-13_Salad_SpicyThai.jpg): M129 / L149. Full-page menu artwork (923x1536 class) that carries the disclaimer "The pictures are for advertising purposes only". No standalone dish photos exist on the site. Cropping a sheet would be modification of a collage. | 2026-09-30 |
| 18 | jones-caribbean-chicken-steak | Jones' Salad | Caribbean Chicken Breast Steak | WEAK_CANDIDATE | A | Official https://www.jonessalad.com/menu/ ... Chicken-breast steak sheet (Aug-18_Steak_Chicken-Breast.jpg). Full-page menu artwork (923x1536 class) that carries the disclaimer "The pictures are for advertising purposes only". No standalone dish photos exist on the site. Cropping a sheet would be modification of a collage. | 2026-09-30 |
| 19 | jones-honey-lemon-basa-steak | Jones' Salad | Honey Lemon Basa Fish Steak | NOT_FOUND | A | Current fish sheet (menu-2026_Steak_Fish.jpg) lists other basa sauces, not honey-lemon. | 2026-09-30 |
| 20 | jones-mushroom-soup | Jones' Salad | Mushroom Soup | WEAK_CANDIDATE | A | Official https://www.jonessalad.com/menu/ ... Soup sheet (Soup-Menu-AW.jpg); topping/truffle alternatives differ. Full-page menu artwork (923x1536 class) that carries the disclaimer "The pictures are for advertising purposes only". No standalone dish photos exist on the site. Cropping a sheet would be modification of a collage. | 2026-09-30 |
| 21 | fuji-salmon-shioyaki | Fuji Japanese Restaurant | Grilled Salmon Shioyaki | VERIFIED_VARIANT | A | Official menu https://www.fuji.co.th/menu/?lang=en: "SALMON TERIYAKI / SHIOYAKI" (330 set / 290 à la carte) image .../2026/06/SALMON-TERIYAKI-_-SHIOYAKI-SET-768x768.png (PNG 768x768). Set photo (rice, miso, sides) with teriyaki-glazed salmon; catalog is à la carte shioyaki. Note the "SALMON-TERIYAKI" thumbnail is actually a roll and must NOT be used. | 2026-09-30 |
| 22 | fuji-chicken-teriyaki | Fuji Japanese Restaurant | Chicken Teriyaki | VERIFIED_VARIANT | A | Official menu: CHICKEN TERIYAKI (210 set / 170 à la carte) image .../2026/06/CHICKEN-TERIYAKI-SET-768x768.png (768x768; 1040x1040 original). Set photo; catalog is à la carte 170. | 2026-09-30 |
| 23 | sukiya-gyudon-regular | Sukiya | Gyudon Beef Rice Bowl (M) | VERIFIED_VARIANT | A | Official https://www.sukiya.co.th/menu/grandmenu.html; thumbnail https://www.sukiya.co.th/upload/top/img_gyudon.jpg (JPEG 350x350, white background). Plain gyudon bowl matches visually but portion size (catalog M) is not identified; small resolution. Closest to promotable if the owner accepts unlabeled size. | 2026-09-30 |
| 24 | sukiya-gyudon-okra-regular | Sukiya | Gyudon with Bonito Flakes & Okra (M) | WEAK_CANDIDATE | A | Only present inside the official gyudon menu sheet https://www.sukiya.co.th/menu/img/menu/menu_gyudon.jpg (1141x905 collage of many bowls). No standalone photo. | 2026-09-30 |
| 25 | sukiya-curry-rice-regular | Sukiya | Japanese Curry Rice (M) | VERIFIED_VARIANT | A | Official thumbnail https://www.sukiya.co.th/upload/top/img_curry.jpg (700x700) shows beef curry with tomato and pickles; catalog item is plain Japanese curry (89), which 35A distinguished from beef curry. | 2026-09-30 |
| 26 | sukiya-beef-plate-no-rice | Sukiya | Beef Plate, No Rice (M) | NOT_FOUND | A | No standalone image; only à la carte sheet menu_alacarte.jpg. Thumbnail img_alacarte.jpg is a stir-fried vegetable, not beef. | 2026-09-30 |
| 27 | sukiya-salad | Sukiya | Salad | NOT_FOUND | A | No standalone image; à la carte sheet only. Thumbnail img_alacarte.jpg is a stir-fried leafy vegetable, not the catalog salad. | 2026-09-30 |
| 28 | sukiya-miso-soup | Sukiya | Miso Soup | NOT_FOUND | A | No standalone image; à la carte sheet only. | 2026-09-30 |
| 29 | santa-fe-grilled-chicken-pepper-steak | Santa Fe' Steak | Grilled Chicken Steak, Pepper Sauce | NOT_FOUND | A | No chicken-with-pepper-sauce dish in the official 2025 e-menu chicken spread. | 2026-09-30 |
| 30 | santa-fe-salmon-steak | Santa Fe' Steak | Salmon Steak | WEAK_CANDIDATE | A | Exact dish and price (Salmon Steak 329) appear in the official e-menu spread https://www.santafesteak.com/santafesteak/img/emenu/normal/2025/AW Santa Fe_09Fish_Normal.jpg (2728x1972). Spread also says "This Visual is for Advertising Purpose only". Content is exact; only a cropped derivative of a collage would be usable -> IMPLEMENTATION_REQUIRES_ASSET_STRATEGY. | 2026-09-30 |
| 31 | santa-fe-dory-fish-steak | Santa Fe' Steak | Dory Fish Steak | WEAK_CANDIDATE | A | Grilled Dory Fish Steak 209 appears in the same official Fish spread (https://www.santafesteak.com/santafesteak/img/emenu/normal/2025/AW Santa Fe_09Fish_Normal.jpg). Exact name and price; collage only -> IMPLEMENTATION_REQUIRES_ASSET_STRATEGY. | 2026-09-30 |
| 32 | santa-fe-seabass-steak | Santa Fe' Steak | Seabass Steak | NOT_FOUND | A | Seabass is not in the official 2025 e-menu fish spread (salmon, dory, fried fish only). | 2026-09-30 |
| 33 | santa-fe-kurobuta-pork-chop | Santa Fe' Steak | Kurobuta Pork Chop | WEAK_CANDIDATE | A | Official Pork spread (https://www.santafesteak.com/santafesteak/img/emenu/normal/2025/AW Santa Fe_07Pork_Normal.jpg) shows three Kurobuta Pork Chop variants (black pepper 279, mushroom 279, Mexican 279); the catalog name does not say which sauce. Collage and variant ambiguity. | 2026-09-30 |
| 34 | santa-fe-chicken-steak-jaew | Santa Fe' Steak | Chicken Steak (2 Pieces), Jaew Sauce | WEAK_CANDIDATE | A | Official Chicken spread (https://www.santafesteak.com/santafesteak/img/emenu/normal/2025/AW Santa Fe_08Chicken_Normal_OL.jpg) shows a single-piece "Chicken Steak Marinated Sam Glur Sauce with Thai Spicy Sauce" (159); the catalog item is "2 Pieces, Jaew Sauce". Piece count and collage prevent acceptance. | 2026-09-30 |
| 35 | santa-fe-premium-beef-steak | Santa Fe' Steak | Premium Fattened Beef Steak, Imported | NOT_FOUND | A | Official beef spread shows imported rib-eye (359) and hamburger steak, not "premium fattened beef, imported" (โคขุน). | 2026-09-30 |
| 36 | nittaya-tom-saep-grilled-chicken-soup | Nittaya Kai Yang | Spicy Grilled-Chicken Tom Saep Soup | WEAK_CANDIDATE | A | Official category https://www.nittayakaiyang.com/en/menus_categories/ต้มยำ-ทำแกง/ has ต้มแซ่บหมูเด้ง, ต้มแซ่บโครงอ่อน and ต้มโย้งไก่ย่าง (.../2023/04/ต้มโย้งไก่ย่าง-07.png) but no grilled-chicken tom saep; tom yong is a different named soup (35A). | 2026-09-30 |
| 37 | zaab-eli-grilled-chicken | Zaab Eli | Zaab Eli Grilled Chicken | NOT_FOUND | - | No website. Brand exists only on Instagram/Facebook/LINE OA; posts are not inspectable without login and social CDN media URLs are signed/expiring (Instagram) or crawler-only (Facebook). | 2026-09-30 |
| 38 | zaab-eli-fried-chicken | Zaab Eli | Zaab Eli Fried Chicken | NOT_FOUND | - | No website. Brand exists only on Instagram/Facebook/LINE OA; posts are not inspectable without login and social CDN media URLs are signed/expiring (Instagram) or crawler-only (Facebook). | 2026-09-30 |
| 39 | zaab-eli-grilled-pork-neck | Zaab Eli | Grilled Pork Neck | NOT_FOUND | - | No website. Brand exists only on Instagram/Facebook/LINE OA; posts are not inspectable without login and social CDN media URLs are signed/expiring (Instagram) or crawler-only (Facebook). | 2026-09-30 |
| 40 | zaab-eli-som-tam-salted-egg | Zaab Eli | Thai Papaya Salad with Salted Egg | NOT_FOUND | - | No website. Brand exists only on Instagram/Facebook/LINE OA; posts are not inspectable without login and social CDN media URLs are signed/expiring (Instagram) or crawler-only (Facebook). | 2026-09-30 |
| 41 | zaab-eli-corn-salted-egg-som-tam | Zaab Eli | Corn & Salted Egg Papaya Salad | NOT_FOUND | - | No website. Brand exists only on Instagram/Facebook/LINE OA; posts are not inspectable without login and social CDN media URLs are signed/expiring (Instagram) or crawler-only (Facebook). | 2026-09-30 |
| 42 | zaab-eli-larb-moo | Zaab Eli | Pork Larb | NOT_FOUND | - | No website. Brand exists only on Instagram/Facebook/LINE OA; posts are not inspectable without login and social CDN media URLs are signed/expiring (Instagram) or crawler-only (Facebook). | 2026-09-30 |
| 43 | zaab-eli-tom-saep-beef-tendon-soup | Zaab Eli | Spicy Beef Shank & Tendon Soup | NOT_FOUND | - | No website. Brand exists only on Instagram/Facebook/LINE OA; posts are not inspectable without login and social CDN media URLs are signed/expiring (Instagram) or crawler-only (Facebook). | 2026-09-30 |
| 44 | somtam-nua-papaya-salad-thai | Somtam Nua | Thai-Style Papaya Salad (Dried Shrimp & Peanut) | NOT_FOUND | - | Operator page https://crg.co.th/brand-details/19/SomtamNua has only an unlabeled brand banner (1920x600 papaya salad with pork rind and sausage) that cannot be tied to a catalog dish; brand Facebook/Instagram (confirmed official via the CRG page) are not inspectable without login. | 2026-09-30 |
| 45 | somtam-nua-papaya-salad-fermented-crab | Somtam Nua | Papaya Salad with Salted Crab & Fermented Fish Sauce | NOT_FOUND | - | Operator page https://crg.co.th/brand-details/19/SomtamNua has only an unlabeled brand banner (1920x600 papaya salad with pork rind and sausage) that cannot be tied to a catalog dish; brand Facebook/Instagram (confirmed official via the CRG page) are not inspectable without login. | 2026-09-30 |
| 46 | somtam-nua-tam-muah | Somtam Nua | Mixed Papaya Salad with Rice Noodles & Crispy Pork Rind | NOT_FOUND | - | Operator page https://crg.co.th/brand-details/19/SomtamNua has only an unlabeled brand banner (1920x600 papaya salad with pork rind and sausage) that cannot be tied to a catalog dish; brand Facebook/Instagram (confirmed official via the CRG page) are not inspectable without login. | 2026-09-30 |
| 47 | somtam-nua-larb-moo | Somtam Nua | Pork Larb with Liver | NOT_FOUND | - | Operator page https://crg.co.th/brand-details/19/SomtamNua has only an unlabeled brand banner (1920x600 papaya salad with pork rind and sausage) that cannot be tied to a catalog dish; brand Facebook/Instagram (confirmed official via the CRG page) are not inspectable without login. | 2026-09-30 |
| 48 | somtam-nua-larb-fried-fish | Somtam Nua | Crispy Fried Fish Larb | NOT_FOUND | - | Operator page https://crg.co.th/brand-details/19/SomtamNua has only an unlabeled brand banner (1920x600 papaya salad with pork rind and sausage) that cannot be tied to a catalog dish; brand Facebook/Instagram (confirmed official via the CRG page) are not inspectable without login. | 2026-09-30 |
| 49 | somtam-nua-fried-chicken | Somtam Nua | Thai Fried Chicken Wings | NOT_FOUND | - | Operator page https://crg.co.th/brand-details/19/SomtamNua has only an unlabeled brand banner (1920x600 papaya salad with pork rind and sausage) that cannot be tied to a catalog dish; brand Facebook/Instagram (confirmed official via the CRG page) are not inspectable without login. | 2026-09-30 |
| 50 | somtam-nua-tom-saep-pork-bone-soup | Somtam Nua | Spicy Isan Pork-Bone Soup | NOT_FOUND | - | Operator page https://crg.co.th/brand-details/19/SomtamNua has only an unlabeled brand banner (1920x600 papaya salad with pork rind and sausage) that cannot be tied to a catalog dish; brand Facebook/Instagram (confirmed official via the CRG page) are not inspectable without login. | 2026-09-30 |
| 51 | somtam-nua-sticky-rice | Somtam Nua | Sticky Rice | NOT_FOUND | - | Operator page https://crg.co.th/brand-details/19/SomtamNua has only an unlabeled brand banner (1920x600 papaya salad with pork rind and sausage) that cannot be tied to a catalog dish; brand Facebook/Instagram (confirmed official via the CRG page) are not inspectable without login. | 2026-09-30 |
| 52 | thongsmith-wagyu-ribeye-boat-noodle | ThongSmith | Wagyu Ribeye "Waterfall" Beef Boat Noodle | NOT_FOUND | - | Only the official menu book (https://anyflip.com/bookcase/jpekz -> online.anyflip.com/iugnb/rchh/): flipbook page images are 403 outside the viewer and would be collages; delivery listings (Grab/LINE MAN) are marketplace evidence and were not used. Social posts not inspectable without login. | 2026-09-30 |
| 53 | thongsmith-kurobuta-pork-boat-noodle | ThongSmith | Kurobuta Pork Boat Noodle | NOT_FOUND | - | Only the official menu book (https://anyflip.com/bookcase/jpekz -> online.anyflip.com/iugnb/rchh/): flipbook page images are 403 outside the viewer and would be collages; delivery listings (Grab/LINE MAN) are marketplace evidence and were not used. Social posts not inspectable without login. | 2026-09-30 |
| 54 | thongsmith-dry-rice-kurobuta-braised-pork | ThongSmith | Dry Rice with Kurobuta Pork & Braised Pork | NOT_FOUND | - | Only the official menu book (https://anyflip.com/bookcase/jpekz -> online.anyflip.com/iugnb/rchh/): flipbook page images are 403 outside the viewer and would be collages; delivery listings (Grab/LINE MAN) are marketplace evidence and were not used. Social posts not inspectable without login. | 2026-09-30 |
| 55 | thongsmith-spicy-shredded-chicken-dry | ThongSmith | Spicy Shredded Chicken (Dry, No Soup) | NOT_FOUND | - | Only the official menu book (https://anyflip.com/bookcase/jpekz -> online.anyflip.com/iugnb/rchh/): flipbook page images are 403 outside the viewer and would be collages; delivery listings (Grab/LINE MAN) are marketplace evidence and were not used. Social posts not inspectable without login. | 2026-09-30 |
| 56 | thongsmith-grilled-pork-meatballs | ThongSmith | Grilled Pork Meatballs with Sweet Chili Dip | NOT_FOUND | - | Only the official menu book (https://anyflip.com/bookcase/jpekz -> online.anyflip.com/iugnb/rchh/): flipbook page images are 403 outside the viewer and would be collages; delivery listings (Grab/LINE MAN) are marketplace evidence and were not used. Social posts not inspectable without login. | 2026-09-30 |
| 57 | steak-and-more-chicken-steak | The Steak & More | Chicken Steak | NOT_FOUND | - | Operator page https://www.minorfood.com/en/our-business/the-steak-and-more has only storefront/interior photos and a franchise logo; no itemised dish imagery. Brand Facebook (profile id 61571163564316) and TikTok @thesteakandmore are not inspectable without login. | 2026-09-30 |
| 58 | steak-and-more-pork-chop | The Steak & More | Pork Chop Steak | NOT_FOUND | - | Operator page https://www.minorfood.com/en/our-business/the-steak-and-more has only storefront/interior photos and a franchise logo; no itemised dish imagery. Brand Facebook (profile id 61571163564316) and TikTok @thesteakandmore are not inspectable without login. | 2026-09-30 |
| 59 | steak-and-more-squid-ink-spaghetti-shrimp | The Steak & More | Black Squid-Ink Spaghetti with Shrimp | NOT_FOUND | - | Operator page https://www.minorfood.com/en/our-business/the-steak-and-more has only storefront/interior photos and a franchise logo; no itemised dish imagery. Brand Facebook (profile id 61571163564316) and TikTok @thesteakandmore are not inspectable without login. | 2026-09-30 |
| 60 | steak-and-more-caesar-salad | The Steak & More | Caesar Salad | NOT_FOUND | - | Operator page https://www.minorfood.com/en/our-business/the-steak-and-more has only storefront/interior photos and a franchise logo; no itemised dish imagery. Brand Facebook (profile id 61571163564316) and TikTok @thesteakandmore are not inspectable without login. | 2026-09-30 |
| 61 | steak-and-more-som-tam | The Steak & More | Som Tam (Thai Papaya Salad) | NOT_FOUND | - | Operator page https://www.minorfood.com/en/our-business/the-steak-and-more has only storefront/interior photos and a franchise logo; no itemised dish imagery. Brand Facebook (profile id 61571163564316) and TikTok @thesteakandmore are not inspectable without login. | 2026-09-30 |
| 62 | steak-and-more-yum-woon-sen | The Steak & More | Yum Woon Sen (Glass Noodle Salad) | NOT_FOUND | - | Operator page https://www.minorfood.com/en/our-business/the-steak-and-more has only storefront/interior photos and a franchise logo; no itemised dish imagery. Brand Facebook (profile id 61571163564316) and TikTok @thesteakandmore are not inspectable without login. | 2026-09-30 |
