# GoodFood V2 — Slice 39B: Catalog truth audit

Audit date: **2026-10-01, Asia/Bangkok**. Research only. No production correction or image implementation.

## 1. Executive summary

| Production ID | Owner bucket | Recommendation | What is established |
|---|---|---|---|
| `ootoya-grilled-salmon-rice-bowl` | NEEDS_MORE_EVIDENCE | NEEDS MORE EVIDENCE; do not rename to the raw bowl or remove automatically | The current official salmon donburi is raw sashimi in zuke sauce, not grilled. Its URL has represented other dishes historically. The original catalog's claimed grilled-bowl source cannot be reconstructed. |
| `seven-eleven-chicken-sukiyaki` | PARTIAL_CORRECTION | CORRECT names/rice tag only; hold numerical nutrition | The documented original secondary nutrition source identifies AllOnline product 355384, whose official description and pictures establish glass noodles. No historical rice SKU was verified. Package calorie evidence conflicts with the secondary report and needs a legible panel. |
| `nittaya-tom-saep-grilled-chicken-soup` | NEEDS_MORE_EVIDENCE | NEEDS MORE EVIDENCE; do not equate Tom Saep and Tom Yong automatically | Official Tom Yong is a specifically named soup. Original notes cite an unspecified Wongnai Tom Saep listing, rather than the Tom Yong product. Historical equivalence or a distinct chicken Tom Saep is unproven. |
| `thongsmith-spicy-shredded-chicken-dry` | PARTIAL_CORRECTION | CORRECT category/configuration disclosure; retain broad name and estimates | F2 has the same Thai name and is offered with noodles or no noodles. Salad is a misleading generic category. Neither the calorie estimate nor the category proves the catalog means the no-noodle option. |

Exactly four records, one bucket each: **READY_TO_CORRECT 0; PARTIAL_CORRECTION 2; KEEP_AS_IS 0; NEEDS_MORE_EVIDENCE 2**. KEEP_AS_IS is not appropriate merely because unsafe corrections are withheld.

The strongest actionable mismatch is the word **Rice / ข้าวหน้า** in the 7-Eleven record: its own documented source maps to a glass-noodle product. The strongest preparation contradiction is Ootoya's current sashimi description versus the catalog's grilled name, but the correct record identity remains unresolved.

## 2. Entry state

- Branch: `main`; clean `git status --short`.
- HEAD and `origin/main`: `c8e672219294adc347564eb42637a363ef771e93`.
- Last five commits: `c8e6722` restaurant return navigation; `1a34052` imagery to 45; `42fc6f5` restaurant imagery; `11a8b37` restaurant brand identities; `f5f37f4` unified discovery.
- Counts remain 13 restaurants, 13 logos, 84 menu items, 45 images, 39 image-less (53.6%). All four audited items lack images.
- Git used a per-command safe-directory override. Git's user-ignore permission warning did not prevent status/history/diff checks. No global configuration or pre-existing work was changed.

## 3. Method and source policy

Current records, notes, relations, implementation, tests, blame and introduction commits were inspected before new web research. SOL, Opus, 37A and earlier nutrition/image/price research were leads, not proof. No applicable AGENTS file or catalog seed/generation script was found in the repository searches.

Tier A: live official menu/product pages and their linked images; official Nittaya public WordPress records. Tier B: ThongSmith's branded Linktree links its iberry-group AnyFlip bookcase. Archived first-party pages are historical evidence only when their actual contents are read. Secondary MyFitMate is relevant to internal provenance, not promoted to first-party nutrition truth. Reviews, marketplace entries and editorial articles are discovery/corroboration only.

Anonymous ordinary HTTP successfully retrieved official sources where the web text proxy failed or returned 403. No credentials, logged-in browser, certificate bypass or authentication bypass was used. Package, salmon and F2 images were visually examined; a temporary enlarged label region was for inspection only and added no detail. No dish crops or production assets were created.

Confidence labels apply to **support for the field or recommendation**, not a numerical probability. HIGH = direct, clear evidence; MEDIUM = bounded inference or imperfect visual reading; LOW = weak mapping/portion basis; UNVERIFIED = no adequate independent support. Missing evidence is not proof of historical nonexistence.

## 4. Current production baseline

Nutrition units: kcal; protein/carbs/fat/fiber in grams; sodium in mg. “Absent” is not zero. No record has a price, fiber, mealContext, customizationNotes or menuImage. These absences were checked in the exact source objects.

| Field | Ootoya | 7-Eleven | Nittaya | ThongSmith |
|---|---|---|---|---|
| Menu ID | `ootoya-grilled-salmon-rice-bowl` | `seven-eleven-chicken-sukiyaki` | `nittaya-tom-saep-grilled-chicken-soup` | `thongsmith-spicy-shredded-chicken-dry` |
| Restaurant ID | `ootoya-thailand` | `seven-eleven-thailand` | `nittaya-kai-yang-thailand` | `thongsmith-boat-noodle-thailand` |
| Thai restaurant / English | โอโตยะ / Ootoya | เซเว่น อีเลฟเว่น / 7-Eleven Thailand | นิตยาไก่ย่าง / Nittaya Kai Yang | ทองสมิทธ์ / ThongSmith |
| Thai menu name | ข้าวหน้าปลาแซลมอนย่าง | ข้าวหน้าไก่สุกี้ (อีซี่ ช้อยส์) | ต้มแซ่บไก่ย่าง | แซ่บแห้งไก่ฉีก |
| English menu name | Grilled Salmon Rice Bowl | Ezy Choice Chicken Sukiyaki Rice | Spicy Grilled-Chicken Tom Saep Soup | Spicy Shredded Chicken (Dry, No Soup) |
| Category | Rice & noodles | Rice & noodles | Soup | Salad |
| Price | Absent | Absent | Absent | Absent |
| kcal / protein / carbs / fat | 640 / 30 / 80 / 20 | 270 / 19 / 30 / 8 | 150 / 15 / 5 / 7 | 280 / 26 / 18 / 12 |
| Fiber / sodium | Absent / absent | Absent / 1220 | Absent / 700 | Absent / 1100 |
| Nutrition confidence / asOf | estimated / 2026-09-14 | label / 2026-09-14 | estimated / 2026-09-15 | estimated / 2026-09-15 |
| Tags | fish, rice, high-protein | chicken, rice, ready-to-eat, packaged | chicken, soup, isan | chicken, salad, spicy |
| Thai servingNote | หนึ่งชาม รวมข้าว | บรรจุภัณฑ์พร้อมทาน 1 กล่อง | เสิร์ฟเป็นชามสำหรับแบ่งกัน ค่าพลังงานนี้คือส่วนแบ่งต่อคน (น้ำซุป 250 มล. + เนื้อไก่ 80 กรัม) | Absent |
| English servingNote | One rice bowl, includes rice. | One packaged ready-to-eat meal. | Served as a shared bowl; this figure is a per-person portion (~250ml broth + ~80g chicken). | Absent |
| Current relation | None | `chicken-vegetable-sukiyaki`, similar-dish | None | None |
| Quick Goals derived from current numbers | High protein; Balanced | Light meal | Light meal | Light meal; Balanced |

Quick Goals are numerical heuristics, not tags: High protein ≤700 kcal and ≥30g protein; Light meal ≤450 kcal; Balanced ≤650 kcal, ≥25g protein and ≤25g fat. No sodium limit in presets. The Ootoya high-protein tag is not proof of official nutrition.

Source notes: `ootoyaStandardDishNote` explicitly says no dish-specific official nutrition was found and uses a standard Japanese-dish estimate. `sevenElevenLabelNote` discloses secondary package reporting, no direct inspection, and derived fat. `nittayaEstimateNote` declares composition estimates and cites official/branch sources for names; the item-level historical report instead attributes this soup name to Wongnai. `thongSmithEstimateNote` declares typical single noodle/rice-bowl estimates and editorial names; its statement that no official menu website exists does not account for the now-verified official link-hub/flipbook route. These notes do not contain a recipe worksheet, exact protein weight for F2, or dated package-panel copy.

## 5. Internal provenance and git history

| Record | Introduction | What history establishes |
|---|---|---|
| Ootoya salmon bowl | `b99d4a803f5f666c4113593f797a040f3a87fa2b`, 2026-09-15 12:24 +0700 | Name/category/640-30-80-20/tags/servingNote were introduced together. `restaurant-nutrition-pilot.md` claims the exact Thai name at `ootoya.co.th/menu.php`; no captured original page/image backs the grilled wording. |
| 7-Eleven sukiyaki | Same initial commit | Name/category/270-19-30-8-1220/tags/servingNote introduced together. Original report cites MyFitMate's package-label reporting and explains calculated fat. |
| Nittaya soup | `7f137bdc8513fb14f2f0daa1d66ac856199514a4`, 2026-09-15 14:23 +0700 | Batch 2 report attributes Thai name to Wongnai at ฿155 and assumes ~500ml shared bowl/2–3 people, then estimates a ~250ml + 80g chicken portion. Exact branch/listing/snapshot absent. |
| ThongSmith F2 | Same expansion commit | Batch 2 report cites THE STANDARD for name and expressly rejects a “low-calorie” editorial adjective as nutrition evidence. Composition estimate, not an official 280-kcal declaration. |

Blame attributes all audited object fields to those introduction commits. No later independent name/category/nutrition correction was found. Later slices repeatedly withheld prices/images because candidate identities did not match. That repetition preserves the original values but does not validate them.

The data is literal, checked-in TypeScript, accompanied by curated research documentation. The expansion report describes agent-assisted research and lead verification, not a scraping pipeline. No retained generation inputs or formula worksheet were found. Git author identity alone cannot establish whether a person or assistant originated a particular value.

Relevant internal references: `docs/restaurant-nutrition-pilot.md`; `restaurant-meal-context-price-research-17b.md`; `restaurant-image-expansion-19.md`; `restaurant-price-expansion-20.md`; `restaurant-price-expansion-22.md`; `restaurant-image-expansion-29.md`; `restaurant-content-enrichment-audit-35a.md`; SOL and Opus; 37A's coverage findings. None provides the missing original Ootoya snapshot or Nittaya exact marketplace source.

## 6. Ootoya audit

Current official [O1] explicitly identifies a zuke-sauce **sashimi** bowl with nori, cucumber and sushi rice; the linked image visibly shows uncooked salmon slices. This establishes raw preparation from text plus image, not filename. It is neither grilled nor described as seared. Separate [O2] describes charcoal-grilled salmon, sold à la carte or as a set; this is not proof of a grilled salmon donburi. [O3] lists both separately.

Historical [O4] was actually fetched at two dates: ID79 in 2017 is **Okaka Furikake Rice**, and ID79 in 2024 is a **mini charcoal-grilled Sumiyaki pork bowl with cold soba/udon**. Product IDs were reused. This corrects the prior research's implication that ID79/62 provides a stable salmon identity: current ID62 is White Fish Tatsuta [O5], not salmon. Neither archived page proves a former grilled salmon bowl.

Exact-name Thai/English searches and bounded archive inspection did not establish a matching current or discontinued grilled-salmon rice bowl. This is an unresolved existence/mapping problem, not proof it never existed. A mistaken initial menu reading is plausible; mistranslation, normalization and a discontinued distinct dish cannot be separated safely with the retained evidence.

**Recommendation: NEEDS MORE EVIDENCE.** Keep the ID and production fields pending owner evidence. Do not simply drop “grilled” to map to raw fish; that changes preparation and requires renewed estimate/serving review. Do not remove a potentially legitimate historical record solely from today's menu. The 640/30/80/20 figures are an explicit generic estimate, not documented Ootoya Thailand nutrition.

## 7. 7-Eleven audit

Official [S1] specifies a 250g Ezy Choice chicken sukiyaki made with egg-coated glass noodles; linked [S2–S4] show noodles and chicken. The package's English product name omits rice. Its barcode is **8858684518470**. The original secondary source [S5] identifies product **355384**, SKU **642775010**, and this same barcode, alongside the catalog's 270/19/30/1220 figures. This is substantially stronger mapping evidence than matching sodium alone.

The package visibly prints sodium **1,220mg per 250g**, consistent with the catalog. It strengthens product identity but cannot prove that every copied nutrient is correct or that no historical formula changed. The calorie area appears to read **220**, as SOL reported; it remains an imperfect small-image transcription, while MyFitMate claims **270** for the same retailer image. Do not treat the secondary claim as independent label verification. Full protein/carbs/fat panel transcription is **UNVERIFIED** here; a larger fresh label photograph is needed before numerical replacement. No readable lot/date or explicit reformulation notice bridges the discrepancy.

Exact-name official searches found no rice-based Ezy Choice version. A bounded archive query for product355384 timed out, so no historical panel comparison was obtained. Related older dry-suki references are discovery only, not proof of this barcode's history. Incorrect naming is strongly supported; reformulation or mixed-version nutrition remains unresolved. The initial secondary source itself calls the product chicken sukiyaki with a little broth, so “Rice” is not justified by that source.

**Recommendation: PARTIAL_CORRECTION.** Correct both names and the rice tag; retain category and packaged-meal identity. Hold numerical nutrition rather than replacing all values from an uncertain image. Clarify conflicting secondary/retailer evidence in the source note; do not present the numbers as newly verified official values.

## 8. Nittaya audit

Official [N1] names **ต้มโย้งไก่ย่าง**. Its public WordPress record [N2] has creation/modification metadata **2023-04-15**, supporting that this is not merely a newly renamed 2026 menu item (metadata is not a frozen recipe history). [N3] explains the restaurant's Tom Yong as combining Tom Khlong and Tom Yum. Current soup listings [N4] distinguish Tom Saep pork dishes, Tom Khlong dishes and Tom Yong chicken; official exact-name search [N5] returned no chicken Tom Saep result.

Thus Tom Yong is a specific restaurant preparation, and “Tom Saep” is not an established official synonym. This does not prove that Nittaya never served a separate chicken Tom Saep. The original GoodFood report's marketplace attribution means simply renaming to Tom Yong would silently assume that unresolved mapping. Generic spicy/sour resemblance does not establish equivalent seasoning, chicken cut, broth or portion.

The 150/15/5/7/700 values and ~250ml + 80g basis are explicitly curated estimates. The larger ~500ml bowl and sharing count are historical research assumptions, not a measured restaurant yield. Current official evidence does not validate that per-person split, nor prove a different whole-bowl nutrition value. “Soup” remains appropriate to the intended concept.

**Recommendation: NEEDS MORE EVIDENCE.** Recover the original branch menu/dated official chicken Tom Saep evidence or obtain owner confirmation that Tom Yong was intended. Keep current estimates and per-person basis pending that decision; do not convert them to whole-bowl values or attach Tom Yong's price/image.

## 9. ThongSmith audit

The live branded Linktree [T1] links the iberry-group bookcase [T2]; the main menu description is dated **24 April 2569 (2026)**. Its bookcase creation timestamp is 2022, which is not the edition date. A separate September2026 new-menu supplement is not proof that F2 was replaced.

Config-linked page13 [T3] explicitly prints **F2 แซ่บแห้งไก่ฉีก / Chicken Noodles with Spicy Sauce**, beneath a chicken-noodle section. It supplies two **139/139 THB** columns for noodles/no noodle. Five noodle types are pictured, including konjac with a surcharge. This is one named menu code with configuration choices; noodles are not mandatory. The page does not establish the ordering default. The pictured F2 bowl has noodles.

GoodFood's Thai and broad dry-chicken English names remain valid; “No Soup” does **not** mean “No Noodles.” Its Salad category does not follow the official classification. Within the existing taxonomy, **Rice & noodles** is the most truthful generic category for configurable F2, consistent with other noodle dishes that offer no-noodle options. Do not invent a category or declare the record permanently no-noodle from its 18g carbs.

The 280-kcal/18g-carb estimate could reflect a lower-starch configuration but cannot establish which one: dressing, peanuts, sprouts and noodle amount are unknown. Protein/fat/sodium and portions are equally unverified numerically. [T4], the original editorial-name lead, mentions a konjac option but supplies no measured nutrition; it cannot validate 280 kcal. Add a configuration/estimate caveat rather than replacing nutrition with values for an assumed noodle serving.

**Recommendation: PARTIAL_CORRECTION.** Correct category and salad tag; disclose noodle/no-noodle choice. Keep broad name and numerical estimates. The previously proposed GOOD noodle crop would become truthful for a specifically disclosed noodle configuration; it still cannot establish that the unchanged nutrition belongs to that photograph. Keep image withheld until owner selection of image/configuration policy. No image implementation is proposed in this audit.

## 10. Field-by-field confidence

“Keep pending” means insufficient evidence to change, not validated restaurant accuracy. Production presence/absence itself is verified; confidence below concerns external truth.

### Ootoya

| Field | Current | Evidence | Confidence | Recommended action |
|---|---|---|---|---|
| ID / restaurant | Current stable ID / Ootoya | Git and source; current official brand | HIGH | Keep |
| Thai name | ข้าวหน้าปลาแซลมอนย่าง | Initial claimed menu reading; no matching retained capture | UNVERIFIED | Keep pending identity evidence |
| English name | Grilled Salmon Rice Bowl | Translation follows unsupported preparation | UNVERIFIED | Do not map to raw bowl automatically |
| Category | Rice & noodles | Intended rice-bowl concept | MEDIUM | Keep pending identity decision |
| Price | Absent | No verified exact grilled bowl | UNVERIFIED | Do not import raw-bowl price |
| kcal | 640 | Explicit standard-dish estimate | LOW | Keep estimated, not official |
| Protein | 30 | Same estimate | LOW | Keep pending recipe/portion review |
| Carbs | 80 | Same estimate | LOW | Keep pending rice/portion review |
| Fat | 20 | Same estimate | LOW | Keep pending recipe review |
| Fiber / sodium | Absent / absent | Not sourced | UNVERIFIED | Leave absent |
| ServingNote | One rice bowl, includes rice (TH/EN) | Assumed intended configuration | LOW | Do not replace with current raw-bowl/set basis |
| mealContext | Absent | None populated | UNVERIFIED | Leave absent |
| Tags / goals | fish/rice/high-protein; HP/Balanced | Derived from catalog concept/numbers | MEDIUM | Keep pending identity decision |
| Relations / image | None / absent | Exact source inventory | HIGH | Do not add guessed raw/grilled bridge/image |

### 7-Eleven

| Field | Current | Evidence | Confidence | Recommended action |
|---|---|---|---|---|
| ID / restaurant | Stable ID / 7-Eleven | Original source ties product355384/barcode to this nutrition record | HIGH | Keep |
| Thai name | ข้าวหน้าไก่สุกี้ (อีซี่ ช้อยส์) | Official product and original secondary naming disagree with rice | HIGH | Correct to สุกี้ไก่ขลุกขลิก (อีซี่ ช้อยส์) |
| English name | Ezy Choice Chicken Sukiyaki Rice | Package product name; glass-noodle description | HIGH | Correct to Ezy Choice Chicken Sukiyaki with a Little Broth |
| Category | Rice & noodles | Glass noodles remain within existing category | HIGH | Keep |
| Price | Absent | Listing price is not a retained historical catalog price | UNVERIFIED | Leave absent in the limited correction |
| kcal | 270 | Secondary report conflicts with apparent 220 on image | LOW | Hold replacement; disclose conflict |
| Protein | 19 | Secondary label attribution; panel not confidently transcribed | UNVERIFIED | Keep provisionally, not newly verified |
| Carbs | 30 | Same | UNVERIFIED | Keep provisionally |
| Fat | 8 | Calculated from 270/19/30, not directly inspected label | LOW | Keep provisional derivation; do not call official |
| Fiber | Absent | No reliable transcription | UNVERIFIED | Leave absent |
| Sodium | 1220 | Package prints 1220mg/250g | HIGH | Keep for pictured package; historical-version caution |
| ServingNote | One packaged meal (TH/EN) | Package/listing 250g | HIGH | Keep; may clarify one250g pack |
| mealContext | Absent | None required by this finding | UNVERIFIED | Leave absent |
| Tags / goals | chicken/rice/ready-to-eat/packaged; Light | Official noodles; numerical preset | HIGH / MEDIUM | rice→noodles; do not alter goal logic |
| Relation / image | Chicken vegetable sukiyaki / absent | Similar-dish relation; exact official product photo | HIGH / MEDIUM | Retain ID/relation; future image only after naming review |

### Nittaya

| Field | Current | Evidence | Confidence | Recommended action |
|---|---|---|---|---|
| ID / restaurant | Stable ID / Nittaya | Source/history | HIGH | Keep |
| Thai name | ต้มแซ่บไก่ย่าง | Original unspecified Wongnai assertion; official Tom Yong is distinct | UNVERIFIED | Keep pending original-source recovery |
| English name | Spicy Grilled-Chicken Tom Saep Soup | Internal conservative translation | LOW | Do not rename to Tom Yong without mapping decision |
| Category | Soup | Both intended concepts are soup | HIGH | Keep |
| Price | Absent | Tom Yong price is another named preparation | UNVERIFIED | Leave absent |
| kcal | 150 | Explicit composition estimate | LOW | Keep estimated |
| Protein | 15 | Same; assumed 80g chicken | LOW | Keep pending measured portion |
| Carbs | 5 | Same | LOW | Keep |
| Fat | 7 | Same | LOW | Keep |
| Fiber | Absent | Not sourced | UNVERIFIED | Leave absent |
| Sodium | 700 | Composition estimate, not measured broth | LOW | Keep estimated |
| ServingNote | Shared bowl; per-person250ml+80g (TH/EN) | Internal research assumption | LOW | Do not convert to whole bowl |
| mealContext | Absent | None populated | UNVERIFIED | Leave absent |
| Tags / goals | chicken/soup/isan; Light | Concept/estimated numbers | MEDIUM | Keep pending identity decision |
| Relations / image | None / absent | Exact inventory | HIGH | Withhold Tom Yong image/mapping |

### ThongSmith

| Field | Current | Evidence | Confidence | Recommended action |
|---|---|---|---|---|
| ID / restaurant | Stable ID / ThongSmith | F2 exact Thai name | HIGH | Keep |
| Thai name | แซ่บแห้งไก่ฉีก | Official F2 wording | HIGH | Keep |
| English name | Spicy Shredded Chicken (Dry, No Soup) | Broad description compatible with dry F2; official English emphasizes noodles | HIGH | Keep broad name with configuration note |
| Category | Salad | Official chicken-noodle section and configurable noodle dish | HIGH | Correct to Rice & noodles |
| Price | Absent | Page has139/139 plus service charge and configurable surcharge | MEDIUM | Leave absent in this scoped correction |
| kcal | 280 | Explicit composition estimate, unspecified configuration | LOW | Keep estimated; disclose configuration uncertainty |
| Protein | 26 | Same | LOW | Keep |
| Carbs | 18 | Not proof of no-noodle selection | LOW | Keep; do not infer configuration |
| Fat | 12 | Same | LOW | Keep |
| Fiber | Absent | Not sourced | UNVERIFIED | Leave absent |
| Sodium | 1100 | Estimate, not official panel | LOW | Keep estimated |
| ServingNote | Absent | Official noodles/no-noodle choices | HIGH | Add configuration/estimate caveat |
| mealContext | Absent | No verified additions modeled | UNVERIFIED | Leave absent |
| Tags / goals | chicken/salad/spicy; Light/Balanced | Salad contradicted; goals from estimates | HIGH / MEDIUM | Remove salad tag; retain numerical goal logic |
| Relations / image | None / absent | Exact inventory; pictured F2 has noodles | HIGH | Keep relations; image contingent on future configuration policy |

## 11. Nutrition provenance findings

| Record | A: official documented | B: derived from official portion/label | C: explicit curated estimate | D: unknown/unsupported component |
|---|---|---|---|---|
| Ootoya | None found for this exact grilled bowl | No | All four numbers explicitly estimated | Exact recipe/portion and grilled-item existence |
| 7-Eleven | Pictured package supports250g and1220mg sodium; full macros not freshly verified | Fat is internally derived from secondary-reported numbers, **not a verified official panel** | Not labeled as a composition estimate | Secondary kcal/protein/carbs and image calorie conflict; historical formula |
| Nittaya | None found | No measured serving split | kcal/macros/sodium and per-person basis explicitly estimated | Actual yield and exact Tom Saep mapping |
| ThongSmith | No official full-bowl nutrition; konjac's small calorie notation does not validate F2 totals | No measured portion | kcal/macros/sodium explicitly estimated | Which noodle configuration and gram weights |

7-Eleven fat calculation: `(270 − 4×19 − 4×30) / 9 = 8.22g`, rounded to8g. This explains provenance, not nutritional verification. A lower calorie reading would invalidate that same derivation if all other values belonged to the same panel; do not mix versions to recalculate it. Estimates for the other records remain useful if honestly labeled and attached to a defensible dish/portion. No estimate is recommended for deletion solely because official nutrition is unavailable.

## 12. Historical/current-version findings

- **Ootoya:** archived ID79 contents prove URL reuse, not a historical grilled bowl. Today's raw bowl cannot disprove every discontinued variant; original exact evidence is missing.
- **7-Eleven:** original secondary report already points to the current glass-noodle product/barcode. Rice naming error is stronger than a historical rice-SKU theory. No official historical rice product or reformulation notice was verified; archive timeout leaves nutrition-version history unresolved.
- **Nittaya:** Tom Yong official post metadata dates to2023. No official chicken Tom Saep synonym or distinct historical listing was established. Older marketplace/general “Tom Saep” mentions do not resolve chicken-specific identity.
- **ThongSmith:** current main-menu metadata dates to April2026; its2022 bookcase timestamp is not publication proof for today's page. Original editorial lead is older and corroborates configurable noodles, not Salad or280kcal. No evidence of F2 being reformulated into a mandatory noodle-only SKU.

## 13. Downstream impact of later corrections

| Surface | What would change or remain |
|---|---|
| Category filters | Existing menu filter function accepts numeric constraints only; current restaurant/Explore UI has no menu-category filter. Category labels and any future category consumer would change for F2. Recipe category filters are separate and unaffected. |
| Search | Searches both menu names and restaurant names; not menu tags/category/servingNote. 7-Eleven rice query matches would change with corrected names. Preserving a misleading name as a search alias is not proposed. |
| Quick Goals | Numeric-only; limited proposed names/category/notes/tag changes leave the membership matrix in section4 unchanged. Any later nutrition replacement requires threshold reevaluation. |
| Random meal | All four remain eligible because IDs/restaurants remain valid. Numeric changes could affect filtered Explore/local Pick pools, not the unfiltered random eligibility function. |
| Restaurant-local Pick / Explore | Limited corrections update displayed names/category/note; numeric pool is unchanged. Existing order uses image availability; no image addition is made here. |
| Recipe↔restaurant bridge | Only 7-Eleven has a current relation: `chicken-vegetable-sukiyaki`, similar-dish. Its glass-noodle concept is compatible with that recipe; retain and review wording. Other three have none. Tests explicitly list rejected potential pairs for Ootoya/Nittaya/ThongSmith; those are **not production relations**. |
| Favorites | Stored menu IDs remain stable. Neither partial correction requires migration. No ID is changed/removed in the proposal. |
| Tests | Future catalog changes affect `restaurant-imagery-39a.test.tsx`'s catalog hash; update intentionally after owner approval. Inspect name/search/category assertions in restaurant tests; relation fixtures; absent-price checks in meal-context tests; no-image fixtures in menu-image and imagery38/39A. Do not loosen unrelated behavior tests. |
| Image eligibility | 7-Eleven naming correction makes the linked noodle photo a plausible exact candidate, but still needs separate approval. F2 image contains noodles, so its configuration must be disclosed before reuse. Raw Ootoya/Tom Yong must not be attached to unresolved grilled/Tom Saep records. |
| Translations | Correct7-Eleven TH/EN together; F2 existing localized category label already supports Rice & noodles. Add TH/EN configuration note, not a new taxonomy or global translation redesign. |
| Serving-note display | Existing UI renders servingNote in detail/pick contexts. A note-only change should use those surfaces; no new mealContext model or global display changes required. |

## 14. Proposed future correction set

These are conceptual diffs only; **none implemented**.

### PARTIAL_CORRECTION — `seven-eleven-chicken-sukiyaki`

- Thai name: `ข้าวหน้าไก่สุกี้ (อีซี่ ช้อยส์)` → `สุกี้ไก่ขลุกขลิก (อีซี่ ช้อยส์)`.
- English name: `Ezy Choice Chicken Sukiyaki Rice` → `Ezy Choice Chicken Sukiyaki with a Little Broth`.
- Category: `Rice & noodles` → unchanged.
- Tags: `['chicken', 'rice', 'ready-to-eat', 'packaged']` → `['chicken', 'noodles', 'ready-to-eat', 'packaged']`.
- Nutrition: keep270/19/30/8/1220 provisionally; no numeric replacement authorized by this audit. Preserve disclosure that fat is calculated. Add item-specific provenance wording: TH `ตัวเลขเดิมมาจากแหล่งข้อมูลรองที่ระบุสินค้า 355384; ยังไม่ได้ยืนยันสารอาหารครบทุกค่าจากฉลากปัจจุบัน และภาพฉลากกับแหล่งข้อมูลรองมีข้อขัดแย้งเรื่องพลังงาน` / EN `Existing figures come from a secondary report identifying product355384. The full current panel has not been verified, and retailer imagery conflicts with that report on calories.` Keep original tier disclosure; do not silently upgrade verification or substitute guessed current macros.
- ServingNote: keep existing one-pack note; optional clarification `บรรจุภัณฑ์พร้อมทาน 1 กล่อง (250 กรัม)` / `One packaged ready-to-eat meal (250g).`
- ID, price, relation and image status: unchanged. No ID migration.

### PARTIAL_CORRECTION — `thongsmith-spicy-shredded-chicken-dry`

- Thai name: `แซ่บแห้งไก่ฉีก` → unchanged.
- English name: `Spicy Shredded Chicken (Dry, No Soup)` → unchanged; do not equate no soup with no noodles.
- Category: `Salad` → `Rice & noodles`.
- Tags: `['chicken', 'salad', 'spicy']` → `['chicken', 'spicy']`. Avoid a mandatory-noodle tag for the generic configurable record.
- Nutrition: keep280/26/18/12/1100 as estimates. Do not select a noodle/no-noodle variant from those numbers.
- ServingNote: absent → TH `เลือกเส้นก๋วยเตี๋ยวหรือเกาเหลา (ไม่ใส่เส้น) ได้ ค่าที่แสดงเป็นการประมาณเดิมสำหรับหนึ่งชาม ซึ่งยังไม่ได้ยืนยันชนิดหรือปริมาณเส้น` / EN `Available with a choice of noodles or without noodles. These are the existing one-bowl estimates; the noodle type and quantity used for the estimate have not been verified.`
- Source-note follow-up: replace the “no official menu” assertion for this item with the verified Linktree→bookcase→F2 route, while retaining estimated confidence and separating official identity from estimated nutrition.
- ID, price, relation and image status: unchanged. No ID migration.

### NEEDS_MORE_EVIDENCE — Ootoya and Nittaya

No safe production diff proposed. Keep stable IDs pending original-source or owner mapping evidence. If the owner later deliberately replaces the grilled bowl with a raw bowl, that is a preparation/record-identity decision requiring new nutrition and ID-migration review, not a spelling fix. If Tom Yong is later confirmed as the intended original soup, a same-ID naming correction could be appropriate, with unchanged per-person basis until separately re-estimated.

## 15. Items that should not change yet

Do not replace7-Eleven nutrition with a partially read panel; add price/image under this audit; infer no-noodle F2 from18g carbs; convert Nittaya per-person values to whole bowl; rename Ootoya to raw salmon by deleting one word; attach a different preparation's image; delete estimates simply for being estimates; migrate/remove stable IDs without an identity decision. No changes to other restaurants, Somtam Nua visibility, images, relations or navigation.

## 16. Open questions and validation

1. Where is the original Ootoya menu capture supporting the grilled bowl? Is it a discontinued product, a mistaken reading, or an invented preparation modifier?
2. Obtain a dated, legible product355384/barcode8858684518470 panel. Resolve220 versus270 and verify protein/carbs/fat/sodium for one version and serving. Has the barcode's formula changed?
3. Which Wongnai branch/menu and date supported Nittaya chicken Tom Saep at155baht? Does an official historical source corroborate it, or was Tom Yong normalized incorrectly?
4. Which F2 configuration/weights informed the280-kcal estimate? Until answered, configuration caveat is safer than declaring its nutrition valid for the photographed noodle bowl.

Final checks: tracked production/source/tests/assets unchanged; only this document created; all task scratch evidence/scripts/inspection images removed; task used no user browser/process; `git diff --check` clean and document trailing whitespace checked separately. Full application tests were not run because no production file changed. Nothing staged, committed, pushed or deployed.

## 17. Source references

External sources accessed2026-10-01. Live accessibility is a point-in-time observation, not product availability or a reuse licence.

- **O1:** [Ootoya current salmon bowl](https://www.ootoya.co.th/menu-details.php?id=79), direct anonymous200; [linked800×600 salmon photo](https://www.ootoya.co.th/upload_file/menu/Donburi-Menu/%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B9%81%E0%B8%8B%E0%B8%A5%E0%B8%A1%E0%B8%AD%E0%B8%99-big.png), downloaded/viewed200. Text proxy inaccessible; ordinary HTTP succeeded.
- **O2:** [Ootoya charcoal-grilled salmon](https://www.ootoya.co.th/menu-details.php?id=6),200.
- **O3:** [Ootoya current menu](https://www.ootoya.co.th/menu.php),200; exact names/details inspected.
- **O4:** [Archived official ID79,2017-11-11](https://web.archive.org/web/20171111125401id_/http://www.ootoya.co.th:80/menu-details.php?id=79) and [2024-02-24](https://web.archive.org/web/20240224065617id_/http://ootoya.co.th/menu-details.php?id=79), both200; actual non-salmon contents read. [Bounded CDX query](https://web.archive.org/cdx/search/cdx?url=www.ootoya.co.th/menu-details.php%3Fid%3D79&output=json&filter=statuscode:200&collapse=timestamp:4&limit=8),200. Two samples are not an exhaustive history.
- **O5:** [Current ID62](https://www.ootoya.co.th/menu-details.php?id=62),200; White Fish Tatsuta, illustrating why earlier URL mapping is not reliable truth.
- **S1:** [AllOnline official product355384](https://www.allonline.7eleven.co.th/p/%E0%B8%AD%E0%B8%B5%E0%B8%8B%E0%B8%B5%E0%B9%88-%E0%B8%8A%E0%B9%89%E0%B8%AD%E0%B8%A2%E0%B8%AA%E0%B9%8C-H%E0%B8%AA%E0%B8%B8%E0%B8%81%E0%B8%B5%E0%B9%89%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%82%E0%B8%A5%E0%B8%B8%E0%B8%81%E0%B8%82%E0%B8%A5%E0%B8%B4%E0%B8%81-250-%E0%B8%81%E0%B8%A3%E0%B8%B1%E0%B8%A1/355384/), ordinary HTTP200; web-proxy403 followed by indexed text discovery. Package images linked in page, not guessed unrelated SKUs. Promotional validity dates are not proof of reformulation or current store stock.
- **S2:** [1110×1110 package/dish composite](https://media.allonline.7eleven.co.th/pdzoom/642775-00-meal-box-ezy-choice.jpg),200, visually inspected. The linked01 image is byte-identical.
- **S3:** [1110×1110 package-only image](https://media.allonline.7eleven.co.th/pdzoom/642775-02-meal-box-ezy-choice.jpg),200, viewed; limited panel legibility.
- **S4:** [1110×1110 prepared-dish image](https://media.allonline.7eleven.co.th/pdzoom/642775-03-meal-box-ezy-choice.jpg),200, glass noodles visually evident.
- **S5 (secondary provenance only):** [MyFitMate ready-meals report](https://myfitmate.app/blog/7-eleven-ready-meals-thailand-fitness),200; page reports publication/update20August2026. Product ID/SKU/barcode tie directly to S1. Its270/19/30/1220 claim is not accepted as freshly verified official panel data.
- **N1:** [Official Tom Yong product](https://www.nittayakaiyang.com/th/food_menus/ต้มโย้งไก่ย่าง/).
- **N2:** [Official public post954](https://www.nittayakaiyang.com/th/wp-json/wp/v2/food_menus/954),200;2023-04-15 creation/modification metadata.
- **N3:** [Official recommended-menu article](https://www.nittayakaiyang.com/th/nittaya-kai-yang-recommended-menu/) and [English-route article](https://www.nittayakaiyang.com/en/nittaya-kai-yang-recommended-menu/), official preparation explanation; English route200.
- **N4:** [Official soup/curry category](https://www.nittayakaiyang.com/th/menus_categories/ต้มยำ-ทำแกง/),200; distinct named preparations.
- **N5:** [Exact official chicken Tom Saep search](https://www.nittayakaiyang.com/wp-json/wp/v2/search?search=ต้มแซ่บไก่ย่าง&per_page=20),200 empty array; [Tom Yong search](https://www.nittayakaiyang.com/wp-json/wp/v2/search?search=ต้มโย้งไก่ย่าง&per_page=20),200 finds product954. Search absence alone is not proof of historical absence.
- **T1:** [ThongSmith branded Linktree](https://linktr.ee/thongsmith), live menu link verified via web.
- **T2:** [Linked iberry-group bookcase](https://anyflip.com/bookcase/jpekz),200; publication/configuration metadata read. [Main-menu config](https://online.anyflip.com/iugnb/rchh/mobile/javascript/config.js),200.
- **T3:** [Official linked main-menu page13,1980×2800](https://online.anyflip.com/iugnb/rchh/files/large/149f53d9adcdaf5b0c5d7cf3e90ab16f.webp),200, viewed; exact F2 labels/options/food verified.
- **T4 (secondary corroboration only):** [THE STANDARD ThongSmith Ari article](https://thestandard.co/thong-smith-elevated-boat-noodle-restaurant/), search-index evidence for original editorial lead, name and konjac option; no numerical nutrition accepted.

Historical/discovery query limits: exact grilled-salmon Thai/English, official chicken-suki rice/noodle terms, exact Nittaya chicken Tom Saep, and related dated coverage were searched. The product355384 archive request timed out; no historical panel was read. Searches found adjacent dishes/reviews, not sufficient official evidence to validate the unresolved two records. No blanket claim of exhaustive worldwide/history coverage is made.

## 18. Slice 39C implementation outcome — 2026-10-01

This section records the approved implementation separately. Sections 1–17 remain byte-for-byte intact. Both corrected records remain PARTIAL_CORRECTION; this is not full official nutrition verification.

### Exact production changes

- `seven-eleven-chicken-sukiyaki`: `name.th` → `สุกี้ไก่ขลุกขลิก (อีซี่ ช้อยส์)`; `name.en` → `Ezy Choice Chicken Sukiyaki with a Little Broth`; `tags` → `['chicken', 'noodles', 'ready-to-eat', 'packaged']`; `nutritionSource.note.th/en` retain the original secondary-label/derived-fat disclosure and append the exact section14 product355384/current-panel/calorie-conflict caveat. The existing one-pack serving note is retained; the optional 250g wording was not added.
- `thongsmith-spicy-shredded-chicken-dry`: `category` → `Rice & noodles`; `tags` → `['chicken', 'spicy']`; `servingNote.th/en` added exactly as proposed in section14. Its item-specific `nutritionSource.note.th/en` now identifies the official Linktree → iberry group AnyFlip → F2 route, separates official dish/configuration identity from estimated nutrition, and says the estimates are not verified for every noodle configuration. Shared brand source-note constants are untouched, so other items are unchanged.

### Intentionally retained

All IDs, restaurant IDs, prices (absent), image status (absent), relations, nutrition confidence tiers/dates, meal context and other fields are retained. 7-Eleven remains 270 kcal / 19g protein / 30g carbs / 8g fat / 1220mg sodium, with provisional secondary evidence and calculated fat. ThongSmith remains 280 kcal / 26g protein / 18g carbs / 12g fat / 1100mg sodium, explicitly estimated. ThongSmith's broad Thai/English names remain unchanged. No migration or new category was introduced.

Ootoya `ootoya-grilled-salmon-rice-bowl` and Nittaya `nittaya-tom-saep-grilled-chicken-soup` production object bytes match entry HEAD exactly and remain NEEDS_MORE_EVIDENCE. All source content outside the two approved objects is unchanged. Restaurant logos, images, Somtam Nua and all other catalog records are untouched.

### Downstream behavior and image decision

Corrected 7-Eleven names replace obsolete rice-name search matches; no alias preserves them. Search uses names/restaurant names, not tags/category/serving notes. Existing restaurant/Explore filters are numeric; recipe category filtering is separate and unchanged. Quick Goals remain: 7-Eleven Light meal; ThongSmith Light meal and Balanced; neither High protein. Regression comparison confirms every numeric filtered global/local Pick pool and random eligibility/order remain unchanged. Stable favorite IDs and the 7-Eleven `chicken-vegetable-sukiyaki` similar-dish relation are retained.

**IMAGE_STILL_AMBIGUOUS:** the SOL GOOD crop depicts F2 with noodles. The corrected generic record offers noodles or no noodles, and the retained estimate's noodle configuration/quantity is unverified. Disclosure resolves the taxonomy error but does not establish that the photographed configuration matches the estimate. Owner configuration/image policy is still needed. No asset was downloaded, cropped or added for this evaluation.

### Verification

- Production Vite preview: both corrected items × Thai/English × 390×844/1440×900; restaurant-local grid, menu detail and Explore search/result/detail paths passed (24 surface checks). Detail screenshots for all eight item/locale/viewport combinations were visually inspected, with representative grid/Explore screenshots. Natural names, retained nutrients, configuration/provenance copy and no horizontal overflow confirmed. Existing generic Rice & noodles category label remains; 7-Eleven dish names no longer claim rice.
- Full required Vitest command: 40 files / 588 tests passed, including six focused Slice39C regressions. Existing jsdom scrollTo diagnostics remain non-failing.
- `npx tsc --noEmit`: passed. `npm run build`: passed with the existing bundle-size warning only. `git diff --check`: passed.
- Historical Slice39A catalog fingerprint intentionally refreshed for these approved data corrections; its relation fingerprint and all other assertions remain intact. New freeze coverage protects unresolved records and all unrelated production source content.
- Counts: 13 restaurants; 13 logos; 84 items; 45 menu images; 39 image-less; 53.6% coverage.
- Task preview and browser stopped; temporary QA script/screenshots removed. No staging, commit, push or deployment.
