# GoodFood V2 — Slice 41A: independent restaurant portfolio audit

Research date/access date throughout: **2026-10-01 (Asia/Bangkok)**. Research only; no catalog, schema, tests, assets, or existing documentation changed. Recommendations are an editorial audit, not restaurant nutrition certification.

## 1. Executive summary

**Recommend FAM TIME and ฟ้าปลาทาน IMPLEMENT_FIRST, with three representative meals, estimated nutrition, official remote logos, and no menu images at launch.** Ñamñam Pasta and Tapas is IMPLEMENT_LATER: its official menu ecosystem is strong, but the pasta configuration and overlapping portfolio value warrant a separate pass. Defer สุกี้ช้างเผือก, Pepper Lunch Thailand, and Tudari pending current first-party dish/configuration evidence. The additional name “Bul gogi” cannot be uniquely identified and must not be merged with Tudari.

31 representative candidates evaluated, including one unresolved brand/dish placeholder: 9 READY_WITH_ESTIMATED_NUTRITION, 8 CONFIGURATION_REQUIRED, 10 MARKETPLACE_ONLY, 3 DEFER, 1 AMBIGUOUS_IDENTITY. Zero IMPLEMENTATION_READY and zero READY_NO_IMAGE as primary classifications: lack of full nutrition evidence takes precedence over image absence. Portfolio assignment: 3 IMPLEMENT_FIRST, 14 IMPLEMENT_LATER, 14 DEFER. Ready does not mean measured or ready to copy directly into production: the implementation must build and review an explicit portion-assumption ledger.

No complete or partial official Thai nutrition table was found in the inspected sources for any target. This is a bounded negative finding, not proof that unpublished information does not exist. No overseas nutrition was accepted. No final kcal/macros were calculated. Official menu prices exist for the three strongest source ecosystems, but all carry context; none is a universally applicable final bill price.

## 2. Entry state and concurrent-work note

The requested output did not exist at entry. HEAD and origin/main both resolved to `aab4b433a9c296aae1f9673a25131c6bc371a739`. Entry log:

```text
aab4b43 docs: research restaurant expansion candidates
b904b84 fix: correct restaurant catalog identities
c8e6722 fix: improve restaurant return navigation
1a34052 feat: expand menu imagery to 45 items
42fc6f5 feat: expand restaurant menu imagery
```

Foreign changes observed at entry and again before writing:

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
 M src/restaurant-imagery-38.test.tsx
 M src/restaurant-imagery-39a.test.tsx
 M src/restaurant-logo-35c.test.tsx
 M src/restaurants.test.ts
 M src/restaurants.ts
?? src/restaurant-expansion-40b.test.tsx
```

These belong to the concurrent 40B work. No clean-tree requirement, reset, restore, checkout, stash, clean, stage, commit, push, or deploy was performed. Git's ownership guard required per-command `-c safe.directory=G:/work/ta/healthy-recipe-app`; no persistent Git configuration was changed. Git also warned that the user's global ignore file was unreadable; status and revision reads succeeded.

## 3. Current production baseline

Independent read-only source counts distinguish the committed baseline from the concurrent working tree. Counts were obtained from the restaurant/menu arrays, not copied from 40A.

| Snapshot | Restaurants | Menu items | Menu images | Prices | Logos |
|---|---:|---:|---:|---:|---:|
| Entry HEAD/origin/main | 13 | 84 | 45 | 44 | 13 |
| Working tree inspected during 40B | 15 | 94 | 50 | 44 | 15 |

Committed brands: Ootoya, Salad Factory, 7-Eleven, Jones' Salad, Fuji, MK, Sukiya, Santa Fe', Nittaya Kai Yang, Zaab Eli, Somtam Nua, ThongSmith, The Steak & More. Working additions include getfresh and Ginger Farm Kitchen. The recommendation below considers these additions, while avoiding any claim that unfinished foreign work is already released.

Read `src/types.ts`, restaurant data and validation, meal context, menu presentation/image/logo behavior, random-meal logic, relevant App discovery/detail flows, explicit recipe relations, 40A, and prior catalog-truth/logo research. 40A informed methodology only; it supplies no evidence about these six targets.

The actual nutrition type is `Nutrition` (rather than the request's generic “NutritionInfo”). Each menu item requires kcal, protein, carbs, fat, provenance, and tags; fiber/sodium are optional. Confidence values are official/label/curated/estimated. An item with unknown macros cannot be represented by zeros or an image-only placeholder. For new composition-based estimates use `estimated`, with a bilingual note and date; “curated estimate” in this audit does not automatically imply the schema's `curated` confidence.

The closed category union is Rice & noodles, Salad, Grilled/BBQ, Soup, Set meal. `servingNote` and `customizationNotes` provide prose context, not selectable portion arithmetic. `mealContext.configurable` assumes a known base serving: it cannot repair an unknown base recipe. Add-on nutrition covers additions only; already-complete must not cause rice/soup to be counted twice. MenuPrice supports one THB amount plus note/date, not structured branch/size/from-price variants.

At the initial read, logo-first and image-first were stable view partitions; no-image records remain eligible. Failed menu imagery renders no image. Initials remain the restaurant logo fallback. Random Restaurant uses the original restaurant pool; Random Meal joins valid restaurant IDs; local Pick uses its filtered menu pool. Images must not change those pools. Explore/Quick Goals use nutrition filters: high protein max700 kcal/min30g protein, light max450 kcal, balanced max650 kcal/min25g protein/max25g fat. These were not selection targets and no estimates were tuned to qualify. Tags should describe verified ingredients/format, not unsupported healthy/low-carb/high-protein promises. Recipe links are explicit editorial similar-dish relations; similar ingredients do not justify creating links automatically. At final inspection, foreign working code also introduced restaurant-grid ranking by image coverage, price coverage, item count, then original position. Its comment explicitly keeps the ranked copy out of random/pick pools; this unfinished presentation change is not attributed to 41A. No-image launch remains valid even if display rank changes.

## 4. Method and source policy

Tier A: Thai brand/operator sites, their menus and directly linked static assets. Tier B: attributable official LINE/social/link hubs. Tier C: marketplaces, directories, blogs, press and reviews, including Grab's press release and Wongnai listings marked “official.” Platform verification does not make their menu first-party under this task's policy.

Used web search/page reads plus anonymous HTTP requests and published JSON/static menu assets. Anyflip returned 403 in the web reader, but its public flipbook configuration and page assets were anonymously readable. This was ordinary public access, not authentication bypass. No logged-in browser, certificate bypass, private endpoint, or session token used. Default shell socket denial was an execution permission issue, not evidence of a broken restaurant site; approved anonymous network requests established the findings below.

Official linkage establishes source control sufficiently for research, not legal permission to redistribute every asset. Menu sheets were visually inspected; image crop candidates are not approved production assets. Page labels/metadata/cache tokens were kept distinct from genuine issue dates. Source register and direct-asset details appear in section 27. Research samples representative dishes, not an exhaustive menu.

## 5. Portfolio gaps

The existing catalog is strong in Japanese rice/grilled meals, salads, Isan grilled/shared plates, and steak. Working getfresh further broadens salad/bowl formats; Ginger Farm adds Northern Thai plates. Fish is present, but a named-species Thai rice-soup brand adds a distinct meal choice. Dedicated fresh-pasta restaurants add more value than another salmon salad or steak. Korean remains comparatively thin even with getfresh's Korean-style pork bowl; a genuinely identified Korean brand would add breadth, but source weakness outweighs that opportunity. Suki overlaps MK/7-Eleven but Thai dry wok suki would be distinct. Pepper Lunch adds a sizzling DIY format, while rice/meat components overlap Sukiya and Fuji.

## 6. FAM TIME

Identity **STRONG**; menu **STRONG**, with branch limitations. Canonical English FAM TIME; Thai rendering **แฟมไทม์ is proposed** unless a future implementer captures authoritative Thai brand styling. The brand site describes fresh homemade pasta, artisan pizza and steaks for family/social dining. It is not evidence of healthfulness. A current legal operating company was not independently established.

The official domain `famtimebkk.com` was accessible with matching brand content. Its branch list covers Bangkok/Nonthaburi destinations including Sukhumvit 16, Siam Square, Terminal 21 Rama 3, Mega Bangna and One Bangkok. Do not treat this as an audited complete branch count; one displayed hours range was internally suspect. Site-linked LINE @famtime and Tablein reservation support identity; Grab/Robinhood are marketplace ordering channels, not first-party nutrition evidence. The attributable Linktree corroborates the menu/social ecosystem. Its separately named Cottage concept must not be folded into FAM TIME automatically.

General menu qwwp has 24 pages, HTML publication metadata 2026-04-08 and modification metadata 2026-06-26. These are hosting dates, not a guaranteed effective price date. A distinct Siam menu dmvi is linked: the general menu must not silently become a Siam-wide assertion. Prices on inspected pages exclude a stated **10% service charge**; VAT treatment was not established. Individual pasta/salad/steak plates are reasonable whole-plate estimation units, but no serving weights were published. Pizza diameter/person count remains unknown.

Candidates F1–F7 below. Pasta shapes and differentiated carbonara recipes are named explicitly: Classic Nonna uses pancetta/egg/pecorino, while Fettuccine Carbonara elsewhere includes cream/bacon/soft-boiled egg. Never conflate them. Chicken Pesto Salad uses **thigh**, not breast. Steak estimates must include potato, aioli and accompanying vegetables rather than naked salmon. Six candidates have defensible composition-based estimation routes; pizza does not have a suitable current category or serving unit. Initial priority is F1/F2, not redundant salad/steak coverage.

## 7. ฟ้าปลาทาน

Identity **STRONG** through an attributable hub, matching brandmark and menu; menu **USABLE_WITH_LIMITATIONS**. Canonical Thai **ฟ้าปลาทาน**, English brandmark **Fá Plā Tahń**. It is primarily a fish-noodle/rice-soup concept, not a generic grilled-fish restaurant. iberry-group association is supported by third-party coverage and the linked bookcase's `iberryflavors.com` case metadata; the current exact legal operator was not independently verified. The old iberryflavors hostname did not resolve usable HTTP content during this audit; it is not a current menu source.

The hub links matching Instagram/Facebook, LINE and an Anyflip bookcase. Its branch labels include Siam Paragon, Central Park, Little Walk Bangna, Emporium and other Bangkok locations. Social login restrictions prevented a full post audit. The hub/menus were readable anonymously. Grab/LINE MAN links are marketplace channels.

The 28-page FPT MENU gwmj has bookcase newTime 2026-02-24; that is upload metadata. A separate two-page rice-soup title includes 23/04/69, but conflicting older metadata prevents declaring it the definitive latest menu. Inspected gwmj pages identify seabass, grouper and golden pomfret explicitly. Soup/dry/no-noodle variants, noodle selection and surcharges are real configuration differences. Fish noodles are not interchangeable with rice noodles. Do not call blanched seafood grilled, fried, or steamed. Some noodle photos contain accompaniments not fully explained by the abbreviated dish name.

M01 seabass rice soup is the best first record: choose **with clear soup**, include rice/fish/broth/garnish and disclose ordinary whole-bowl assumptions plus separately added dipping sauce uncertainty. It must not also represent the dry variant. No fish/rice weights were found. Species-level generic composition can support an explicitly estimated serving once quantities are documented as editorial assumptions; it cannot create official nutrition. Other fish/noodle permutations go later or defer. Inspected sheets add **10% service charge**, VAT unresolved. Prices are menu list amounts, not all-branch delivered totals.

## 8. สุกี้ช้างเผือก

Identity **MODERATE**; menu **WEAK**. Thai สุกี้ช้างเผือก; English **Suki Chang Phueak is proposed transliteration**, not a verified official English wordmark. Multiple historical/current sources identify the Chiang Mai-origin dry/soup suki business and Bangkok expansion. The attributed Facebook Changphuaksuki and Instagram sukichangphuak were not sufficiently readable to verify a current complete menu; no owned current menu domain was established. This is not proof the brand has no site.

Grab's dated 2025-08-20 press release names ณัฐสุวรรณ อิ่มใจบุญ and describes the Banthat Thong opening after six Chiang Mai locations. These are attributed historical platform claims, not proof of today's legal operator, branch count or exclusive ordering. A 2026 Cloud 11 directory is corroboration only. A company-directory match cannot prove that entity operates all branches.

S1–S3 are discovery leads, not implementable first-party records. Do not transplant historical Chiang Mai prices into Bangkok. Pork/chicken/seafood variants, egg inclusion, glass-noodle quantity, vegetables, sauce, and dry-version oil have not been fixed from a current official order. A plausible generic suki recipe alone is insufficient. Chicken variants were considered but no stronger current first-party candidate emerged; no quota is filled with a guessed chicken plate. No safe official logo or exact menu image was established. Defer the restaurant until a current branch-specific official menu/order and base configuration can be read.

## 9. Ñamñam Pasta and Tapas

Identity **STRONG**, menu **STRONG** but branch-specific. Canonical own-site styling **Ñamñam Pasta and Tapas**; Thai **ยัมยัม** is established by the menu cover's pronunciation. The supplied “น้ำน้ำ” is not accepted as an official alias. Exact current legal company remains unverified. The accessible official domain is namnampasta.com. It describes fresh globally inspired pasta; not every dish is Italian.

Official branch/menu hub enumerates RQ49, Central Embassy, Central Ladprao, Silom Edge and Central Westville, while nearby text claims six total: preserve this discrepancy rather than invent a sixth branch. Each has its own menu URL. Chickaletta and Spaghetti Tai Tai appear as companion concepts in the footer; their dishes must not be silently merged. Officially linked LINE @namnampasta, Instagram namnampastaandtapas and Facebook support identity. Chope is reservation, not verified brand-operated food ordering.

Central Embassy sheets directly list ingredient descriptions and prices. Some filenames contain 2026; the `v=202405291424` token is a cache/version parameter, not an issue date. Galleries say last updated 2025-07-15. No assured effective menu date was established. **VAT is not included**; service-charge treatment was not established. Kale Caesar and Butter Sauce And Parmigiano are marked Embassy-only. Salad's optional chicken breast is +80, not automatically included. Mushroom Soup includes cream/crouton. Tapas garlic prawns includes sourdough; sharing/serving count is not established.

Bolognese identifies ground beef, tomato and cheese; Kaprao Pasta Seafood identifies shrimp/squid and basil sauce. These are better composition evidence than marketing photos, but the sheets inspected do not fix pasta shape/weight. Chilli Ebiko's abbreviated ingredients omit seafood visibly present in its image: do not infer the photo is a verified base variant. No noodles-choice sheet was located in the inspected branch page; a guessed `EM_2026_04` URL returned a **No image available** placeholder and was discarded. All four shortlisted pasta records remain CONFIGURATION_REQUIRED. A future implementation can select and explicitly name an officially supported shape, rather than interpreting the photograph as an ordering rule. N1/N2 are feasible estimate routes but redundant salad/soup additions; no reason to launch a pasta brand with only these support dishes.

## 10. Pepper Lunch Thailand

Identity **STRONG** through **Central Restaurants Group (CRG)**; menu **WEAK** for current first-party Thai dish records. Canonical English Pepper Lunch; Thai เปปเปอร์ ลันช์ appears on the operator ecosystem. CRG's brand page provides matching logo, concept and Thai branch directory. Its sizzling DIY hot-plate concept is confirmed; the mentioned plate temperature is not nutrition evidence.

The old www.pepperlunchthailand.com redirects to the apex hostname, whose current content was unrelated Korean gambling rankings. Exclude it as an official menu source. This audit does not assert why the content changed or that the domain was hacked. The attributable LINE OA @pepperlunchth still links that stale domain; this does not rehabilitate the domain. CRG links Thai social accounts, but its website link points to Singapore: Singapore/Japan/global formulas and nutrition are not valid Thai substitutes.

CRG-linked Foodhunt was investigated as an ordering lead; anonymous retrieval failed with an SSL connection error, and the web reader also could not inspect it. No certificate bypass, authenticated request or private API probing followed. This is an access limitation, not proof of a specific certificate defect or that no public API exists. Public LINE data did not yield an adequately specified current menu.

P1–P4 are Thai marketplace leads only. Beef/pork pepper rice and pork/beef yakiudon would fit Rice & noodles if a current Thai base plate were documented. A credible estimate needs rice/noodle quantity, meat cut/quantity, butter/fat, corn/vegetables, sauces, and selected egg/cheese/extrameat. Combos, drinks/sides and branch-exclusive refill sets are separate meal scopes. Current schema can represent a fixed base plate plus optional notes; it cannot truthfully calculate arbitrary sauce/add-on/refill totals. Logo readiness is high but does not make the dish data ready. Defer this restaurant pending a usable first-party menu/order.

## 11. Tudari / Bul gogi

### Tudari

Identity **MODERATE**; current menu **WEAK**. Canonical English **TUDARI**, Thai **ทูดาริ** supported by the attributable Thai account ecosystem. Certified LINE OA @tudarithailand is a Korean restaurant account with matching brandmark and links to tudarithailand.com and Facebook tudarithailand. Both www and apex old-domain attempts failed DNS resolution; no redirect/parking conclusion is possible. Facebook restrictions prevented a current full menu audit. A mall directory corroborates a Future Park operation but is Tier C; a CentralWorld aggregator lists that particular branch permanently closed, so old broad branch lists cannot establish all-branch operation.

The public LINE “Tudari Menus” showcase was inspected through its embedded JSON: `itemList: []`. It establishes a menu heading, **not readable menu dishes**. Current legal operator not established. Historical sponsored coverage/old founder accounts are not enough; a company-directory hit with conflicting dates was rejected as operator proof. T1–T3 are marketplace leads: noodle plate, chicken/cheese plate and pork hotpot. Rice, banchan, size/person count, broth, egg and cheese must be fixed before estimating; shared BBQ/hotpots are not automatically individual Set meals. No full Thai nutrition found. A usable official-account logo is verified, but no dish image approved.

### “Bul gogi”

Identity **NOT_ESTABLISHABLE** for the intended Thai brand. Searches found generic bulgogi dishes, foreign same-name restaurants and historical Tudari bulgogi dishes; none established a uniquely identifiable second Thai brand, common operator, rename, replacement or sub-brand relationship. Historical bulgogi on Tudari's menu proves only a dish association, not a brand association. Keep B1 AMBIGUOUS_IDENTITY and defer. Required disambiguator: intended branch, Thai spelling, or official brand link. Do not merge names, infer ownership, or claim that a separate brand does not exist.

## 12. Cross-restaurant candidate matrix

Legend: **R** READY_WITH_ESTIMATED_NUTRITION; **C** CONFIGURATION_REQUIRED; **M** MARKETPLACE_ONLY; **D** DEFER; **A** AMBIGUOUS_IDENTITY. FIRST/LATER/DEFER are portfolio tiers. Every row has one primary readiness class. Thai/English names marked O are official menu names; P are editorial translations/transliterations. All prices THB. All undocumented weights below are **unknown**, not silently standardized. All meal scope is whole dish/bowl, never assumed fraction of a shared order. F source = F-M; A source = A-M; N source = N-M; S/P/T/B sources mapped in section 27.

| ID | Official/proposed Thai; English | Category | Identity/composition and serving scope | Price/context | Image class | Readiness; portfolio |
|---|---|---|---|---|---|---|
| F1 | สปาเกตตี้ผักโขมกระเทียม O; Spaghetti Spinach & Garlic O | Rice & noodles | Fixed spaghetti, spinach, garlic, chili, tomato; whole pasta plate, weight unknown; oil amount estimated, not vegan-certified | 135 F-M p12, +10% service | VERIFIED_CROP_CANDIDATE | R; FIRST |
| F2 | คลาสสิกคาโบนาร่า O; Classic Nonna Carbonara With Pancetta O | Rice & noodles | Named egg/pancetta/pecorino recipe; whole pasta plate, shape/portion assumptions explicit; not cream fettuccine | 235 F-M p10, +10% service | VERIFIED_CROP_CANDIDATE | R; FIRST |
| F3 | สปาเกตตี้ไส้อั่วน้ำพริกหนุ่ม O; Spaghetti Northern Thai Sausage O | Rice & noodles | Sausage, green-pepper sauce, eggplant/chili/shallot; whole fixed spaghetti plate; sausage fat/oil unknown | 185 F-M p14, +10% service | VERIFIED_CROP_CANDIDATE | R; LATER |
| F4 | สลัดแซลมอนกริลล์น้ำสลัดบัลซามิค O; Grilled Salmon Salad With Balsamic Dressing O | Salad | Salmon, mixed greens, balsamic; include dressing/oil; whole salad, weights unknown | 195 F-M p8, +10% service | VERIFIED_CROP_CANDIDATE | R; LATER |
| F5 | สลัดไก่เพสโต้ย่างน้ำสลัดบัลซามิค O; Chicken Pesto Salad O | Salad | Grilled THIGH/pesto, greens, balsamic, croutons; whole salad, weights unknown | 195 F-M p8, +10% service | VERIFIED_CROP_CANDIDATE | R; LATER |
| F6 | สเต๊กแซลมอนกริลล์ O; Grilled Salmon Steak O | Grilled/BBQ | Salmon, aioli, potato, cucumber, mushroom, tomato; full plate, no rice claim, weights unknown | 295 F-M p22, +10% service | VERIFIED_CROP_CANDIDATE | R; LATER |
| F7 | พิซซ่ามาร์เกริต้า P; Margherita O | None suitable | Whole pizza; cheese/tomato concept; size/share and dough quantity unknown | 195 F-M p16, +10% service | VERIFIED_CROP_CANDIDATE | D; DEFER |
| A1 | ข้าวต้มปลากะพง (น้ำ) O/config selected; Boiled rice with seabass fillets — with clear soup O/config selected | Rice & noodles | M01 soup version; seabass/rice/broth/garnish; whole bowl, dipping sauce separately variable; weights unknown | 219 A-M p22, +10% service | VERIFIED_CROP_CANDIDATE | R; FIRST |
| A2 | ข้าวต้มปลากะพงรวมมิตรกุ้งปลาหมึก O; Boiled rice with seabass, prawns and squid P | Rice & noodles | M02 mixed seafood; select soup/dry and component quantities; shared assumption not justified | 279 A-M p22, +10% service | COMPOSITE_ONLY; exact variant not approved | C; LATER |
| A3 | ก๋วยเตี๋ยวปลากะพง (น้ำ/แห้ง/เกาเหลา) O; Noodle with seabass fillets O | Rice & noodles for noodle version only | G01; soup/dry/no-noodle and noodle type change identity; establish accompaniments before base estimate | 259 A-M p14; surcharges, +10% service | VERIFIED_VARIANT | C; LATER |
| A4 | ก๋วยเตี๋ยวต้มยำปลาจาระเม็ดทอง O; Tom yum noodles with golden pomfret P | Rice & noodles | G06; named species, noodle choice and tomyum sauce/broth; quantities unknown | 329 A-M p14; surcharges, +10% service | VERIFIED_VARIANT | C; LATER |
| A5 | เส้นปลาลูกชิ้นหมูสับ P; Fish noodles with fishballs and minced pork P | Rice & noodles | K01; fish noodles, balls, pork; soup/dry and extra ordinary noodles require selection; species/formula unknown | 229 A-M p18; ordinary noodles+20, egg-white+85, +10% service | VERIFIED_VARIANT | C; LATER |
| A6 | กุ้งลวกจิ้ม O; Blanched shrimps with dipping sauce P | None cleanly suitable | D6; dip/side plate, sauce separate, portion/share unknown; cannot call grilled or a complete meal | 325 A-M p10, +10% service | VERIFIED_CROP_CANDIDATE | D; DEFER |
| S1 | สุกี้แห้งหมู C-source; Dry pork suki P | Rice & noodles | Discovery only: noodles/pork/veg/egg/sauce/oil not fixed by first-party menu; branch unknown | MARKETPLACE_ONLY; withhold amount | MARKETPLACE_ONLY | M; DEFER |
| S2 | สุกี้น้ำหมู C-source; Pork suki soup P | Rice & noodles if noodle bowl | Discovery only: noodle/broth/egg/sauce/portion scope unverified | MARKETPLACE_ONLY; withhold amount | MARKETPLACE_ONLY | M; DEFER |
| S3 | สุกี้แห้งทะเล C-source; Dry seafood suki P | Rice & noodles | Seafood mix and oil/noodles/sauce/egg unknown; not safe to infer from pork order | MARKETPLACE_ONLY; withhold amount | MARKETPLACE_ONLY | M; DEFER |
| N1 | สลัดเคลซีซาร์ P; Kale Caesar Salad O | Salad | Kale, bacon, crouton, anchovy/Parmigiano dressing/cheese; base only, optional chicken excluded; weight unknown, Embassy-only | 290 N-M sheet02; chicken+80; VAT extra | VERIFIED_VARIANT (chicken side pictured) | R; LATER |
| N2 | ซุปเห็ด P; Mushroom Soup O | Soup | Mushroom, cream, crouton; whole soup, not meal-size claim; weights unknown | 150 N-M sheet02; VAT extra | VERIFIED_CROP_CANDIDATE | R; LATER |
| N3 | พาสต้าโบโลเนส P; Bolognese O | Rice & noodles provisionally | Ground beef, tomato, cheese; select official pasta shape/base quantity, whole plate | 330 N-M sheet06; VAT extra | VERIFIED_VARIANT | C; LATER |
| N4 | พาสต้ากะเพราซีฟู้ด P; Kaprao Pasta Seafood O | Rice & noodles provisionally | Shrimp, squid, chili, garlic, holy-basil sauce, yellow chili; shape/quantity/oil unresolved | 295 N-M sheet08; VAT extra | VERIFIED_VARIANT | C; LATER |
| N5 | พาสต้าชิลลีเอบิโกะ P; Chilli Ebiko O | Rice & noodles provisionally | Chili/fish sauce/ebiko/lime listed; photo adds seafood not listed, shape/variant unresolved | 335 N-M sheet05; VAT extra | VERIFIED_VARIANT; mismatch unresolved | C; LATER |
| N6 | พาสต้าซอสเนยและพาร์มิจาโน P; Butter Sauce And Parmigiano O | Rice & noodles provisionally | Butter/cheese; Embassy-only, select supported pasta shape/quantity before estimate | 220 N-M sheet05; VAT extra | VERIFIED_VARIANT | C; LATER |
| N7 | กุ้งผัดกระเทียมน้ำมันมะกอก P; Gambas al Ajillo O | None suitable | Prawns, garlic, paprika, oil, lime, sourdough; tapas/share scope unknown, no clean category | 265 N-M sheet03; VAT extra | VERIFIED_CROP_CANDIDATE | D; DEFER |
| P1 | ข้าวเปปเปอร์เนื้อ C-source; Beef Pepper Rice C-source | Rice & noodles | Thai discovery; meat/rice/butter/corn/sauce quantities and base vs combo unresolved | MARKETPLACE_ONLY; amount withheld | MARKETPLACE_ONLY | M; DEFER |
| P2 | ข้าวเปปเปอร์หมู P; Pork Pepper Rice C-source | Rice & noodles | Same base/side/sauce uncertainty; do not transplant overseas formula | MARKETPLACE_ONLY; amount withheld | MARKETPLACE_ONLY | M; DEFER |
| P3 | ยากิอุด้งหมู P; Pork Pepper Yakiudon C-source | Rice & noodles | Noodle/pork hotplate, sauces/oil/add-ons and size unknown | 219 marketplace Union Mall; not production price | MARKETPLACE_ONLY | M; DEFER |
| P4 | ยากิอุด้งเนื้อ P; Beef Pepper Yakiudon C-source | Rice & noodles | Beef/noodle hotplate; exact base configuration unknown | 255 marketplace Union Mall; not production price | MARKETPLACE_ONLY | M; DEFER |
| T1 | จาจังมยอน P; Jajangmyeon C-source | Rice & noodles | Marketplace dish identity only; sauce/meat/noodle/size unresolved, no banchan assumption | NOT_FOUND usable official amount | MARKETPLACE_ONLY | M; DEFER |
| T2 | ไก่เผ็ดชีส P; Spicy chicken with cheese P | None fixed yet | Current review lead; shared/individual/rice inclusion unknown; not automatically Grilled/BBQ | NOT_FOUND usable official amount | MARKETPLACE_ONLY | M; DEFER |
| T3 | หม้อไฟหมูดับเบิล P; Double pork hotpot P | Soup only after scope fixed | Shared hotpot lead; pork types/noodles/broth/person count/rice/banchan unknown | NOT_FOUND usable official amount | MARKETPLACE_ONLY | M; DEFER |
| B1 | บุลโกกิ P/unresolved; Bul gogi supplied name | None yet | Unresolved Thai brand or dish; no operator/menu serving unit established | NOT_FOUND | NOT_FOUND | A; DEFER |

Official spellings are transcribed from inspected sheets; proposed English translations do not replace distinct menu codes/species. For C/M/A/D rows, nutrition provenance is NOT_PRACTICAL_TO_ESTIMATE_YET. For the nine R rows it is CURATED_ESTIMATE_REQUIRED, using the schema's `estimated` confidence. No row has an official nutrition amount. Sources F/A/N establish listed prices/composition, not weights. C-source explicitly means Tier C, not canonical first-party naming.

## 13. Logo readiness matrix

| Target | Classification; tier | Technical/visual result | Production treatment |
|---|---|---|---|
| FAM TIME | VERIFIED_OFFICIAL_LOGO; A | PNG1305×1305, transparent exterior, circular matching wordmark, good small-tile identity | official-remote original, source site/date |
| ฟ้าปลาทาน | VERIFIED_OFFICIAL_BRANDMARK; B | JPEG2000×2000, opaque teal square, ornate Thai/English sign; fine lettering loses detail small | official-remote; identity still recognizable, initials fallback |
| สุกี้ช้างเผือก | NO_SAFE_LOGO_FOUND | Attributed social inaccessible; third-party thumbnails do not establish safe asset | initials if later evidence unlocks restaurant |
| Ñamñam | VERIFIED_OFFICIAL_LOGO; A | PNG200×200 alpha, black stacked wordmark/tagline; suits white tile, tagline tiny | official-remote; no recoloring or crop |
| Pepper Lunch | VERIFIED_OFFICIAL_LOGO; A | PNG800×600 alpha, red/yellow logo with padding/Thai line; good recognizable emblem | official-remote CRG asset, never old domain |
| Tudari | VERIFIED_OFFICIAL_BRANDMARK; B | JPEG200×200, white background, redcircle/black TUDARI, small tagline; visually verified | official-remote LINE account profile; lifecycle risk higher than static CDN |
| Unresolved Bul gogi | NO_SAFE_LOGO_FOUND | Entity unknown | no borrowed Tudari/foreign logo |

All five verified logo URLs are anonymous, with no observed signature/expiry query parameters. URL stability is not guaranteed: LINE/Linktree profile assets can change when accounts update. Logos are never bundled or modified under the current schema. Dimensions/formats and exact URLs are in section 27.

## 14. Image readiness matrix

| Ecosystem | Image evidence | Match/crop limitations | Recommended treatment |
|---|---|---|---|
| FAM TIME | Official menu sheets, WebP2186×2800, unsigned hashed paths | Named dish panels distinguish recipes; F1–F6/F7 crop candidates, no approved standalone found in this audit | no-image first; optional bundled crop only after normal provenance/rights and exact-panel review |
| ฟ้าปลาทาน | Linked menu sheets, WebP2296×2800, unsigned hashes | A1 seabass soup photo matches; other species/mixed/dry photos cannot be reused indiscriminately; advertising photos do not prove grams | A1 no-image first; later exact crop, preserve code/species/configuration |
| Ñamñam | Brand-hosted JPEG sheets1920×2715 | Named photos clear, but selectable proteins/shape and optional chicken make variants noninterchangeable; Chilli Ebiko unresolved | no-image for unlocked records; exact crops later; don't hotlink an entire sheet as a dish hero |
| Suki / Pepper / Tudari | Marketplace/review photos only for shortlisted dishes | Neither exact first-party formula nor image control established | no-image, no marketplace crop approval |
| Bul gogi | NOT_FOUND | Identity not established | none |

VERIFIED_CROP_CANDIDATE means a visibly attributable, isolatable dish panel, not licensed production approval. Crop only the matching plate/bowl, retain source and `cropOf`, resize/crop only. Never use generative edits, neighboring dish panels, plate collages, or an image of the wrong species/protein. No VERIFIED_STANDALONE food asset was accepted. Direct menu sheets are retrievable but COMPOSITE_ONLY as whole assets; they should not be used directly as individual dish images. Missing images do not block the first batch and should not shrink eligible pools.

## 15. Price availability matrix

| Target | Classification | Reliability and recommendation |
|---|---|---|
| FAM TIME | OFFICIAL_BUT_CONTEXT_DEPENDENT | Live general menu list prices, +10% service, Siam separate; VAT unresolved. Use amount only with full note and source check; otherwise withhold |
| ฟ้าปลาทาน | OFFICIAL_BUT_CONTEXT_DEPENDENT | Linked live menu, +10% service, variant surcharges; uncertain effective date/branch applicability. A1 fixed listed base219 with note, no invented final bill |
| Ñamñam | OFFICIAL_BUT_CONTEXT_DEPENDENT | Embassy dine-in sheets; VAT explicitly extra; branch-only dishes/add-ons. No chain-wide or all-inclusive price claim |
| สุกี้ช้างเผือก | MARKETPLACE_ONLY | Branch/channel differences and historical prices; withhold production price |
| Pepper Lunch | MARKETPLACE_ONLY | Union Mall yakiudon amounts are discovery only; combo/promotional/refill sets separate; withhold production price |
| Tudari / Bul gogi | NOT_FOUND usable official amount | Historical/review prices not current first-party amounts; withhold |

No price is classified OFFICIAL_CURRENT without qualification in this audit. `asOf` records our observation date, not the menu's issuance date. Do not silently calculate service/VAT totals where the tax basis is unknown. Starting/from/promo/member prices were not converted to standard fixed amounts.

## 16. Nutrition provenance matrix

| Target | Availability | Practical route |
|---|---|---|
| FAM TIME | NO_OFFICIAL_NUTRITION found | Six named fixed-plate composition routes; quantify pasta/protein/cheese/dressing/oil/sides as assumptions, `estimated` |
| ฟ้าปลาทาน | NO_OFFICIAL_NUTRITION found | A1 named species/rice soup route; record rice/fish/broth/garnish and sauce scope; other variants require selections first |
| สุกี้ช้างเผือก | NO_OFFICIAL_NUTRITION found | NOT_PRACTICAL_TO_ESTIMATE_YET; current official recipe/configuration absent |
| Ñamñam | NO_OFFICIAL_NUTRITION found | N1/N2 estimates feasible; pasta configuration incomplete; marketing/freshness not calories |
| Pepper Lunch Thailand | NO_OFFICIAL_NUTRITION found | NOT_PRACTICAL_TO_ESTIMATE_YET; Thai portion/formula not proven, foreign table rejected |
| Tudari | NO_OFFICIAL_NUTRITION found | NOT_PRACTICAL_TO_ESTIMATE_YET; individual/shared scope unclear |
| Bul gogi | OTHER — target unresolved | Cannot meaningfully audit nutrition for unidentified entity |

For each feasible estimate, the future ledger must name the whole serving and assumed quantities, nutritional reference for each component, cooking oil, cheese/cream/dressing, broth and sides, sensitivity to reasonable quantity variation, and bilingual caveat. If the estimate cannot withstand that review, downgrade/defer rather than invent precision. Sodium is particularly uncertain in soups, fish sauce, suki sauce, cured meat and cheese; omit unsupported optional sodium instead of labeling meals low sodium. No official/label provenance can be inferred from an official menu photograph without a nutrition declaration.

## 17. Configuration and modeling issues

F1 fixed spaghetti and F2 named carbonara are practical single records. Their whole-plate assumptions need no new schema, but do not call an estimated portion measured. FAM steaks must cover all pictured/listed accompaniments, not protein only. No automatic rice add-on is proven.

A1 intentionally selects M01 with clear soup. Separate dry/seabass-mixed/species/noodle variants cannot share identical macros by default. Fish noodle surcharges and egg-white additions are not low-carb guarantees. A3's noodleless gaolao could fit Soup, while its ordinary noodle bowl fits Rice & noodles; a single record spanning both is misleading. The current prose configuration field cannot dynamically recompute them.

Ñamñam pasta names often identify sauce/protein, not shape. Proposed names should append the supported chosen configuration only after confirmation. Optional chicken on N1 is excluded from base nutrition; a future addition estimate is separate. Tapas and Korean hotpots need an explicit whole-order unit/person count, and a decision whether such records help individual meal choice. Pepper Lunch needs a standard base plate before optional egg/cheese/sauce combos. Suki needs dry/soup, protein and sauce/oil assumptions independently, not one generic suki estimate.

## 18. Category-fit analysis for 40D/41B

| Missing/contested category | Useful candidates affected in this audit | Existing fit | Recommendation |
|---|---:|---|---|
| Pasta | 7 (F1/F2/F3 and N3–N6) | Rice & noodles semantically defensible as noodles; existing Steak & More spaghetti is precedent | Dedicated Pasta would materially improve discovery for two specialist brands; no schema edit here. Four Ñamñam rows still blocked by configuration, not cured by category |
| Pizza | 1 F7 | Rice & noodles/Set meal misleading | Real taxonomy gap, but one poorly scoped shared pizza does not alone justify expansion |
| Tapas/side plates | 2 A6/N7 | Grilled/BBQ false for blanched/oil-cooked food; Set meal false without set | Defer these low-value individual-meal records; no broad Side category needed just for count |
| Korean shared/hotplate | 2 T2/T3 | Soup only if actual whole hotpot; chicken cannot be labeled grilled from a review lead | Potential format gap, but inadequate first-party/configuration evidence to justify union change yet |
| Sandwich | 0 | No shortlisted candidate to map | No evidence from this batch; don't add preemptively |
| Wrap | 0 | No shortlisted candidate to map | No evidence from this batch |
| Burger | 0 | No shortlisted candidate to map | No evidence from this batch |
| Breakfast | 0 | No shortlisted candidate to map | No evidence from this batch; time-of-day is not necessarily a dish category |

Only F7/A6/N7 are immediately excluded partly by taxonomy, and serving issues remain as well. Seven pasta records would benefit from clearer taxonomy, but the three fixed FAM pastas need not be technically blocked by the present umbrella. Never disguise taxonomy-dependent records as salads or sets.

## 19. Portfolio diversity analysis

FAM adds a specialist pasta restaurant, fixed vegetarian-ingredient and pancetta/egg dishes, plus later Northern fusion. It is not rewarded for its numerous near-identical salmon/cream/steak variants. ฟ้าปลาทาน adds Thai fish-forward rice soup and explicit seabass/grouper/golden-pomfret distinctions; prioritize one clear bowl rather than every species/shape permutation. Ñamñam adds a second fresh-pasta identity and Thai/other Asian sauce formats, but a second base butter/cream pasta and Caesar/soup can wait. Suki adds affordable everyday Thai dry wok format only if current evidence supports that affordability and exact order. Pepper adds sizzling self-mixed plates, but ordinary beef/pork rice overlaps current Japanese choices. Tudari adds genuine Korean brand breadth if unlocked; a pork hotpot and cheesy chicken would bring shared-format complexity. “Bul gogi” adds no defensible new restaurant until identified.

Redundant clusters: salmon salad/steak with Fuji, Santa Fe', Salad Factory and getfresh; chicken Caesar-style salads with Jones'/Salad Factory; Northern fusion with working Ginger Farm; creamy mushroom soup with working getfresh; multiple beef/pork rice variants with Sukiya/Fuji; generic suki with MK/7-Eleven. This explains why 9 technically estimable rows produce only 3 first-priority records.

## 20. IMPLEMENT_FIRST

**FAM TIME: F1 Spaghetti Spinach & Garlic, F2 Classic Nonna Carbonara With Pancetta. ฟ้าปลาทาน: A1 M01 seabass rice soup, with clear soup.** Two brands, three distinct meals; no equal-per-brand quota. Use official remote logos, no-image first, existing Rice & noodles with an explicit pasta tag/wording if supported by current conventions. No unsupported nutrition-goal tags. Prices may be attached only as context-rich observed list prices135/235/219; omitting price is valid if branch scope cannot be presented clearly.

These are research-feasible estimate candidates, not final production nutrition records. A future implementer must complete the normal component/quantity review. If F2's pasta quantity cannot be responsibly bounded or any estimate materially depends on unresolved inclusions, defer that row; do not replace the gate with fake precision.

## 21. IMPLEMENT_LATER

FAM F3–F6 (four already estimable but redundant); fish A2–A5 (four configuration-dependent); Ñamñam N1–N6 (two estimable support dishes, four configuration-dependent). **14 candidates**, with Ñamñam the only new later-priority restaurant beyond the two first brands. Later does not waive evidence: unlock four pasta/four fish configurations before implementation. Do not start Ñamñam solely to add a mushroom soup when its distinctive pasta is unresolved.

## 22. DEFER

14 candidates: F7/A6/N7 three unsuitable scope/category records; S1–S3, P1–P4, T1–T3 ten marketplace-only records; B1 one unidentified target. Restaurant deferrals: สุกี้ช้างเผือก, Pepper Lunch Thailand, Tudari; unresolved Bul gogi remains separate, not a seventh verified restaurant. This does not imply the businesses are invalid or closed. Missing current first-party dish evidence is the gate; images/brand fame are not substitutes.

## 23. Proposed implementation batches

1. **Core batch:** two brands/three rows F1/F2/A1, official logos, estimated nutrition, context-rich prices where safe, no menu images. Preserve stable IDs/order, existing eligibility/filter behavior, and no guessed recipe links.
2. **Evidence-unlock batch:** confirm Ñamñam pasta shape/portion/protein and fish variants. Consider N3/N4 for new brand breadth, A2/A3 only if they add a distinct choice; do not implement all 14 later rows as a quota. Resolve Pasta discovery decision separately.
3. **Optional image pass:** exact sheet crops for already accepted dishes, with crop provenance and source/rights review. Zero new restaurants or dishes required. Do not hold the core batch for imagery.
4. **Deferred identity/menu pass:** obtain owned current Suki/Pepper/Tudari menus and the intended Bul gogi branch/link. Reclassify only from new evidence; exclude unrelated Pepper domain and overseas tables.

## 24. Estimated catalog impact

| Scope | Restaurants | Items | Images | Prices | Logos |
|---|---:|---:|---:|---:|---:|
| Increment from proposed core batch | +2 | +3 | +0 | +0 to +3 | +2 |
| Projected against committed HEAD | 15 | 87 | 45 | 44–47 | 15 |
| Projected against inspected concurrent40B tree | 17 | 97 | 50 | 44–47 | 17 |

Image ratio would fall from50/94 to50/97 against the working tree; this is acceptable breadth-first behavior, not a defect. These are conditional future projections; no production increment occurred in 41A. If all 14 later candidates eventually pass and are chosen, the **upper planning bound** across first+later is +3 brands/+17 items, not a recommended quota: committed16/101 or inspected-working18/111; images unchanged until a separate pass. Only the nine currently estimable rows support an immediate estimate workflow. Price coverage for later records is not projected because variant/branch scope may require withholding. No relation increment is promised.

## 25. Catalog-truth risks

Highest risks: stale/wrong-business domain presented as official; “Bul gogi” falsely merged into Tudari; unverified น้ำน้ำ alias; replacing thigh with breast; mixing cream vs egg carbonara; mixed-seafood/grouper photos used for plain seabass; fish noodle/ordinary noodle equivalence; recipe photos interpreted as selectable defaults; omitted sauce/oil/rice/side calories; marketplace prices labeled official; VAT/service stripped from notes; shared dishes divided into invented personal servings; foreign nutrition silently imported; logo readiness mistaken for meal readiness; zero macros standing in for missing data. No imagery or growth target justifies these mistakes.

## 26. Open product decisions

Decide whether Rice & noodles remains the discoverability umbrella for fixed pasta, or whether future 40D/41B introduces Pasta across union/filter/localization/tests consistently. Decide whether whole shared tapas/pizza/hotpot belong in an individual meal-decision product before adding categories. Decide acceptable estimation uncertainty and disclosure for unweighed restaurant portions; this audit supplies feasibility, not measured portion sizes. Decide whether branch-specific list prices with tax/service caveats provide enough value to display, otherwise omit. Obtain a branch/link/Thai spelling for “Bul gogi” before further identity work. None of these decisions authorizes schema/code edits in this slice.

## 27. Source register and direct assets

All access dates below are **2026-10-01**. A source can establish current accessibility while its historic claim/menu issue date remains uncertain. Register includes rejected/access-limited sources so a later implementer does not repeat unsafe substitutions.

| Key / target | Tier; title | URL | What it establishes / limitation |
|---|---|---|---|
| F-W FAM | A; FAM TIME official site | https://www.famtimebkk.com/ | Matching concept, branch/menu/reservation/LINE/marketplace links; exact legal operator not established |
| F-H FAM | B; famtime.bkk Linktree | https://linktr.ee/famtime.bkk | Corroborating menus/socials; separately named Cottage not merged |
| F-M FAM F1–F7 | A via F-W; general menu | https://anyflip.com/tvkpa/qwwp/ | Named recipes/photos/list prices and10% service; host publish/modify metadata not issue date |
| F-S FAM | A via F-W; Siam menu | https://anyflip.com/tvkpa/dmvi/ | Separate branch menu exists; no claim its dishes/prices were exhaustively audited |
| F-J FAM | A-linked public menu configuration | https://online.anyflip.com/tvkpa/qwwp/mobile/javascript/config.js |24page asset map; unsigned public assets, no nutrition table in inspected sheets |
| A-H fish | B; Fá Plā Tahń hub | https://linktr.ee/faplatahn | Exact Thai/English brandmark, branch labels, menu/LINE/social/delivery links |
| A-B fish | B-linked menu bookcase | https://anyflip.com/bookcase/qndkq | FPT MENU upload metadata and separate rice-soup title; old iberryflavors case clue, not legal-operator proof |
| A-M fish A1–A6 | B-owned/linked official menu | https://online.anyflip.com/iugnb/gwmj/ |28pages species/config/price/photo evidence,10% service; branch/effective date uncertain |
| A-J fish | B-linked public configuration | https://online.anyflip.com/iugnb/gwmj/mobile/javascript/config.js |Published page asset map; no authentication needed |
| A-OLD fish | B-linked second menu | https://online.anyflip.com/iugnb/cqsq/ |Title date23/04/69 versus contradictory older metadata; not assumed definitive newest |
| A-C fish | C; Ratwinit Bangkeao delivery menu | https://www.wongnai.com/delivery/businesses/880932Xl/order |Corroboration only; conflicting English fish translations expose name risk |
| A-G fish | C; iberry group overview | https://www.punpro.com/p/17-restaurant-and-cafe-in-chain-of-iberry-thailand-2025 |Reported group association; not independently verified current legal company |
| S-P suki S1/S3 | C; GrabFood suki expansion release,2025-08-20 | https://www.grab.com/th/press/others/grabfoodsukitrend/ |Named owner/origin/Bangkok opening and dry variants as historical platform claims; not current recipe/price |
| S-W suki S1–S3 | C; Chiang Mai article/listing | https://www.wongnai.com/news/suki-chang-phueak-chiangmai ; https://www.wongnai.com/delivery/businesses/118963ig/order |Dry/soup variant discovery/social attribution; no first-party current Bangkok menu |
| S-D suki | C; Cloud11 directory | https://punnawithi.com/places/suki-changphuak-cloud-11 |2026 operation/social lead, not owned menu |
| S-F suki | B candidate, inaccessible; Facebook/Instagram | https://www.facebook.com/Changphuaksuki/ ; https://www.instagram.com/sukichangphuak/ |Attributed social leads; access restrictions limit confirmation, not used for canonical dish facts |
| N-W Nam | A; Ñamñam official site | https://www.namnampasta.com/ |Canonical styling/concept/socials/contact/footer; company not proven by email |
| N-H Nam | A; branches/menu | https://www.namnampasta.com/branchesmenu |Branch-specific menus, five enumerated versus six claimed, VAT context |
| N-M Nam N1–N7 | A; Central Embassy menu | https://www.namnampasta.com/ctmmenu |Official image-sheet links, ingredient/price/photo evidence, branch-only dishes; unknown effective date |
| N-B Nam | A; other branch menus | https://www.namnampasta.com/rq49menu ; https://www.namnampasta.com/ctlmenu ; https://www.namnampasta.com/slemenu ; https://www.namnampasta.com/cwvmenu |Separate branch scopes, not blanket Embassy price equivalence |
| N-G Nam | A; Classic gallery | https://www.namnampasta.com/album/2589/classic |First-party photo ecosystem,2025-07-15 gallery update; filenames alone not exact variant proof |
| P-O Pepper | A; CRG Pepper Lunch brand page | https://crg.co.th/brand-details/6/Pepper-Lunch |Thai operator, concept, branches, official logo/socials; website link points Singapore |
| P-L Pepper | B; LINE OA | https://page.line.me/ntq7973r |Thai attributable account/links; stale old-domain reference not sufficient menu evidence |
| P-X Pepper | Rejected; old Thai domain | https://www.pepperlunchthailand.com/ ; https://pepperlunchthailand.com/ |www redirects to unrelated Korean gambling content; excluded ownership/content mismatch, cause unknown |
| P-F Pepper | A-linked ordering lead, inaccessible | https://foodhunt.com |SSL retrieval failure; no authentication/certificate bypass; no usable public menu/API obtained |
| P-C Pepper P1/P2 | C; CRG Pepper Lunch collection | https://www.wongnai.com/collections/crg-pepper-lunch |Thai Beef/Pork Pepper Rice discovery, not first-party quantities or nutrition |
| P-U Pepper P3/P4 | C; Union Mall delivery menu | https://www.wongnai.com/restaurants/251106Rc-pepper-lunch-union-mall/menu?menuGroupId=items |219/255 yakiudon and addon discovery; marketplace prices withheld from production recommendation |
| P-R Pepper | C; CentralWorld promotion report | https://food.trueid.net/detail/jqLJnadP6alb |2026 branch-specific set/refill caution; not chain-wide base meal |
| T-L Tudari | B; certified Thai LINE OA | https://page.line.me/tqr1886j |Identity, Thai account, matching brandmark and official-link leads |
| T-M Tudari | B; Tudari Menus showcase | https://page.line.me/tqr1886j/showcase/77908949538793 |Public embedded itemList empty; heading not actual current menu |
| T-D Tudari | Access-limited attributed domain | http://www.tudarithailand.com ; https://tudarithailand.com |DNS failed; no current domain content/redirect/parking claim |
| T-F Tudari | B candidate; Facebook | https://www.facebook.com/tudarithailand |Attributed by LINE; login/access restrictions prevented current full menu inspection |
| T-C Tudari T1–T3 | C; Siam Paragon listing/reviews | https://www.wongnai.com/restaurants/9702DL-tudari-siam-paragon |Dish leads/reviews including2024; not current owned menu/portion confirmation |
| T-H Tudari/B1 | C; historical2015/2016 articles | https://www.wongnai.com/articles/tudari ; https://www.wongnai.com/articles/tudari-siam-paragon |Historical Korean plate/size examples only, not current pricing/operator proof |
| T-P Tudari/B1 | C; historical bulgogi report,2011 | https://www.posttoday.com/lifestyle/99755 |Bulgogi as historical Tudari dish; no second-brand relationship proof |
| T-S Tudari | C; Future Park shop directory | https://www.futurepark.co.th/en/shop-detail/future-park/b-floor/tudari |Mall corroboration of one operation, not all branches/current menu |
| T-Q Tudari | C; CentralWorld aggregator | https://wanderlog.com/place/details/16479823/tudari-korean-casual-dining-central-world |This branch marked permanently closed; do not generalize to brand closure |
| IA all | Historical archive service | https://web.archive.org/ |Root available; archived menus not used for current dish/price claims; no archive-dependent inference |

### Direct logo assets

Each is visually inspected; access date2026-10-01; source control inferred from the matching page/account, not from CDN host name alone. No asset was persisted in the repository.

| Target / source | Direct URL | Dimensions / format / background | Stability |
|---|---|---|---|
| FAM / F-W, TierA | https://static.wixstatic.com/media/b1718d_0eb4cca5312c425a91b61de24e802f09~mv2.png |1305×1305 PNG alpha |Unsigned static hash, no expiry observed |
| fish / A-H, TierB | https://ugc.production.linktr.ee/56aac372-db7a-42a5-9c39-0af1c5c36ab0_logo.jpeg |2000×2000 JPEG opaque teal |Unsigned profile asset, may be replaced |
| Nam / N-W, TierA | https://image.makewebcdn.com/makeweb/m_200x200/L4IODRqvs/DefaultData/namnam_logo_Final_09092019_HighRes_02.png?v=202405291424 |200×200 PNG alpha, blackmark |Transform/version query, not an observed signature/expiry |
| Pepper / P-O, TierA | https://crg.co.th/catalogue-assets/images/brand/brand-6-1-logo-1687057854.png |800×600 PNG alpha |Unsigned static path, replacement possible |
| Tudari / T-L, TierB | https://profile.line-scdn.net/0hJ7MBeDUUFRhwOwoIS3FqT0x-G3UHFRNQCAhSLVdsTXsIWFIeTQ0OfQU6TyxYDVJJTQ0Ke1Q9HHtY/preview |200×200 JPEG white |Opaque account path, no expiry/signature query observed; profile lifecycle risk |

### Direct inspected menu/image assets

FAM sheets below: TierA via F-M/F-J, **2186×2800 WebP**; fish sheets: TierB via A-M/A-J, **2296×2800 WebP**. All unsigned public hashed static paths; neither eternal stability nor redistribution rights guaranteed. Exact plate panels, not the entire sheet, are the crop candidates. Access date2026-10-01. Images establish presentation/identity but not measured portion weights.

| Target / candidate(s) / page | Direct asset URL | Establishes |
|---|---|---|
| FAM F4/F5 p8 | https://online.anyflip.com/tvkpa/qwwp/files/large/a0fdd139cb6abc17bd707b5c6784be82.webp |Named salads, thigh/dressing/price |
| FAM F2 p10 | https://online.anyflip.com/tvkpa/qwwp/files/large/84412c154539f282e3ce470a8fff7206.webp |Distinct carbonara recipes/pancetta/photo |
| FAM F1 p12 | https://online.anyflip.com/tvkpa/qwwp/files/large/1ffb3f1ef79f387c56601c674c6a5279.webp |Named spinach spaghetti/composition/photo |
| FAM F3 p14 | https://online.anyflip.com/tvkpa/qwwp/files/large/d246e7417e1dd2ccefccad26c4869619.webp |Northern sausage spaghetti and other distinct recipes |
| FAM F7 p16 | https://online.anyflip.com/tvkpa/qwwp/files/large/d8f42fc7e4d01e12368d9bb377298619.webp |Whole pizza images/prices, no audited serving count |
| FAM steak comparison p20 | https://online.anyflip.com/tvkpa/qwwp/files/large/daf2b19e952047c8e231e70bae8dedc1.webp |Pork variants/accompaniments, no additional candidate quota |
| FAM F6 p22 | https://online.anyflip.com/tvkpa/qwwp/files/large/f233e255429b405f640f993f0307862e.webp |Salmon steak variants and bundled listed sides |
| fish A6 p10 | https://online.anyflip.com/iugnb/gwmj/files/large/a7ea8860a8956a1fcce82b2d713cdffa.webp |Blanched dip plates, not grilled meals |
| fish suki-like noodle comparison p12 | https://online.anyflip.com/iugnb/gwmj/files/large/8599997cdee4549103144fce7660cf94.webp |Fishball/mincedpork variants, noodle and egg-white options |
| fish A3/A4 p14 | https://online.anyflip.com/iugnb/gwmj/files/large/fdfebf1053b54cc3237e3ca2c5e27a61.webp |Species and soup/dry/no-noodle options/prices |
| fish A5 p18 | https://online.anyflip.com/iugnb/gwmj/files/large/985cf1717bffd95990ae8103c9b2fbe7.webp |Fish-noodle identity/addon choices |
| fish creamy-tomyum comparison p20 | https://online.anyflip.com/iugnb/gwmj/files/large/494f3755d591781679bd518cbfde97fe.webp |Creamy seafood/mince variants, not plain clear soup equivalence |
| fish A1/A2 p22 | https://online.anyflip.com/iugnb/gwmj/files/large/995d74f4c71fb4117d32d0ea1785ad1b.webp |M01/M02 species/seafood/rice soup/dry distinctions; A1 photo matches soup |

Ñamñam following assets: **TierA, JPEG1920×2715**, unsigned brand CDN transformation paths; `v` is a version/cache query, not observed expiry. Source page N-M; access2026-10-01. Thai lines frequently describe ingredients, not official dish titles; proposed Thai translations in the matrix are deliberately marked P.

| Sheet / candidates | Direct asset URL | Establishes |
|---|---|---|
| Cover01 | https://image.makewebcdn.com/makeweb/m_1920x0/L4IODRqvs/CTM%2FMenu_EM_2026_01.jpg?v=202405291424 |Brandmark/pronunciation, not exact dish identification for cover photos |
|02 N1/N2 | https://image.makewebcdn.com/makeweb/m_1920x0/L4IODRqvs/CTM%2FEM_2026_02__2_.jpg?v=202405291424 |Kale Caesar optional chicken/Embassy-only, mushroom soup composition/prices |
|03 N7 | https://image.makewebcdn.com/makeweb/m_1920x0/L4IODRqvs/CTM%2FEM_2026_03.jpg?v=202405291424 |Gambas with bread/oil, tapas scope |
|05 N5/N6 | https://image.makewebcdn.com/makeweb/m_1920x0/L4IODRqvs/CTM%2FEM_2026_05.jpg?v=202405291424 |Chilli Ebiko mismatch risk; butter/cheese branch-only |
|06 N3 | https://image.makewebcdn.com/makeweb/m_1920x0/L4IODRqvs/CTM%2FEM_2026_06.jpg?v=202405291424 |Bolognese composition/price; photo shape not binding order rule |
|07 comparison | https://image.makewebcdn.com/makeweb/m_1920x0/L4IODRqvs/CTM%2FEM_2026_07.jpg?v=202405291424 |Selectable pancetta/seafood/meatball sauces and VAT exclusion |
|08 N4 | https://image.makewebcdn.com/makeweb/m_1920x0/L4IODRqvs/CTM%2FEM_2026_08.jpg?v=202405291424 |Kaprao seafood composition/price, VAT exclusion; separate ramen not conflated |

### Validation and cleanup

Research downloads were confined to `C:\Users\patip\AppData\Local\Temp\goodfood-41a-research` and removed after inspection, after checking the resolved exact cleanup path. Subsequent Test-Path returned false. No browser processes were killed. No temporary files/assets/scripts were placed in the repository. Final `git diff --check` passed (only foreign-file CRLF notices); the untracked report was separately checked for trailing whitespace. The matrix was mechanically recounted:31 rows,9 R/8 C/10 M/3 D/1 A,3 FIRST/14 LATER/14 DEFER.

Concurrent work advanced **HEAD and origin/main to `67eb7cfffa5ed47fba4f21f25a13a88e964c4f92`**, log title `feat: add getfresh and Ginger Farm menus`. The final catalog counts remain15 restaurants/94 items/50 images/44 prices/15 logos, now the committed catalog baseline. Thus the previously labeled working-tree projection17 restaurants/97 items is the current post-40B core-batch projection; the earlier committed13/84 projection is historical entry context only.

Final status snapshot:

```text
 M src/App.tsx
 M src/menu-grid-36.test.tsx
 M src/menu-presentation.ts
 M src/restaurant-logo-35c.test.tsx
 M src/restaurant-navigation.test.tsx
?? docs/restaurant-expansion-research-41a.md
?? src/restaurant-grid-ranking.test.tsx
```

Only `?? docs/restaurant-expansion-research-41a.md` belongs to this task. All other status paths and the concurrent commit are foreign work, untouched. No stage/commit/push/deploy was performed by 41A.
