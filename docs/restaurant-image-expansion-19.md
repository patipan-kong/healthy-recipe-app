# GoodFood V2 — Restaurant Image Expansion Batch 1 (Slice 19)

Slice 19 tests whether the Slice 18 source/serving-match gate scales beyond
Ootoya to other restaurant brands, with a small (3–5 item) expansion batch.
This is a research + data slice; no UI, architecture, or feature work.

## Entry state

- Branch `main`, HEAD `a8e2269` ("feat: add restaurant menu image pilot") —
  worktree confirmed clean before any research or edits.
- Baseline confirmed: 13 restaurants, 84 menu items, `MenuImage` type
  unchanged (`src/types.ts`), exactly 2 existing `menuImage` records
  (`ootoya-grilled-mackerel`, `ootoya-tonteki-pork-chop-set`), Pick-Focus-only
  rendering (`MenuItemImage` wired into `RestaurantMenuView`'s pick card and
  `ExploreItemCard` only when `focus` is true), graceful `onError` failure in
  `src/menu-image.tsx`, and existing `validateMenuImage` validation in
  `src/meal-context.ts`.
- Baseline test run: `npx vitest run` → 24 files / 330 tests passing —
  matches Slice 18B's recorded baseline exactly.

## Research method

For each candidate: `WebSearch`/`WebFetch` to locate the brand's official
site or ordering platform, `curl` to extract the exact `<img src>` from the
raw page HTML (never guessed), `curl -I`/GET-with-and-without-`Referer` to
check hotlink/access-control behavior, then a direct download of the
candidate image into a scratch directory for pixel-level visual inspection
against the production `RestaurantMenuItem` record (serving basis, included
sides, dish identity) — discarded afterward, never bundled into the repo.

## Candidate decisions

| Restaurant | Item | Source page | First-party | Serving match | Technical result | Rights result | Decision | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ootoya | `ootoya-grilled-moromi-chicken` | ootoya.co.th/menu-details.php?id=35 | Yes | Acceptable | PNG 800×600, 399 KB; no hotlink protection (200 with/without Referer); static path, Last-Modified 2025-02-14 | Standard copyright only, same as existing 2 accepted images | **ACCEPT — remote** | Single-plate photo: grilled chicken + garnish vegetables + a potato-salad-style side, no rice bowl/miso soup/chawanmushi in frame — structurally matches the already-accepted Mackerel precedent ("à la carte, sides only") rather than the rejected Shima Hokke pattern ("full teishoku spread") |
| Ootoya | `ootoya-shima-hokke-grilled` | ootoya.co.th/menu-details.php?id=1 | Yes | Mismatch | Same PNG as Slice 18 (unchanged) | N/A | **REJECT — confirmed, unchanged from Slice 18** | Re-downloaded and re-inspected the same image; it still shows the full teishoku set (rice, miso soup, chawanmushi, extra pickled sides) while the production record is explicitly à la carte. Brief explicitly forbids weakening this decision to gain coverage |
| Ootoya | `ootoya-oyakodon` | ootoya.co.th/menu-details.php?id=72 | Yes | Uncertain | PNG 800×600 | N/A | **REJECT** | Photo shows the donburi box plus a separate miso soup cup and two side dishes (mentaiko, nori) on the table. The site's own pricing distinguishes an "individual bowl" (199฿) from a "set" (229฿) version; the photographed spread cannot be confidently identified as the individual (non-set) version our record represents — same class of problem as the Shima Hokke rejection |
| Ootoya | `ootoya-grilled-salmon-rice-bowl` | ootoya.co.th/menu.php (Donburi section) | — | Mismatch | — | — | **REJECT — no matching item exists** | Current Ootoya menu has no *grilled* (ย่าง) salmon donburi. The only salmon donburi found (`menu-details.php?id=79`, "ข้าวหน้าปลาแซลมอน") is zuke-marinated raw sashimi salmon — confirmed visually (glossy raw fillets, no char/grill marks) — a different dish from our "Grilled Salmon Rice Bowl" record, not a serving variant of the same dish |
| Salad Factory | `salad-factory-grilled-chicken-sesame` | saladfactorythailand.com/menu/order | Yes | Exact | JPEG 1000×1000, 693 KB, Cloudflare CDN, no hotlink protection, cached (HIT) | Standard copyright, same posture as Ootoya | **ACCEPT — remote** | Current SKU "สลัดอกไก่ย่างงาญี่ปุ่น" matches our item's name/dressing exactly; photo shows sliced grilled chicken breast over greens, edamame, carrot, tomato, nori, with visible creamy sesame dressing |
| Salad Factory | `salad-factory-kale-chicken-truffle` | saladfactorythailand.com/menu/order | Yes | Acceptable | JPEG 1000×1000, 711 KB, same CDN/access pattern | Same as above | **ACCEPT — remote** | Current SKU "สลัดเคลอกไก่ทรัฟเฟิล" name-matches exactly; photo shows kale, sliced grilled chicken, apple, walnuts, chickpeas, cranberries — the truffle dressing itself isn't visually distinguishable (translucent dressing), but no rice/soup/other dish is in frame and the composition otherwise matches |
| Salad Factory | `salad-factory-quinoa-chicken-basil` | saladfactorythailand.com/menu/order | Yes | Uncertain | JPEG 1000×1000, 761 KB | — | **REJECT** | Name matches ("สลัดควินัวกระเพราอกไก่"), but the small pale protein cubes in the photographed quinoa could not be confidently identified as chicken breast rather than tofu, and the plate also shows a side green salad and grilled vegetables (corn, carrot, broccoli, zucchini) not mentioned in the production record. Genuinely uncertain, not confidently EXACT/ACCEPTABLE |
| Salad Factory | `salad-factory-rocket-skirt-steak` | saladfactorythailand.com/menu/order | Yes | Uncertain | — | — | **REJECT** | No SKU named exactly "rocket salad with grilled skirt steak" was found. The closest current items are "สลัดเนื้อสเกิร์ตแองกัสอินเดอะการ์เด้น" (Angus skirt steak, "In the Garden" line, 350฿) and "สลัดร็อกเก็ตเนื้อย่าง" (rocket salad, generic grilled beef, no "skirt" in the filename) — neither cleanly matches our named dish, so identity is unconfirmed |
| Salad Factory | `salad-factory-spicy-pork-tenderloin` | saladfactorythailand.com/menu/order | Yes | Mismatch | — | — | **REJECT** | Current menu has "สเต๊กหมูสันใน" (pork tenderloin *steak*, not a salad) and "ยำเส้นบุกหมูสันใน" (spicy konjac-noodle yum with pork tenderloin) — neither is a green salad matching our "Spicy Pork Tenderloin Salad" record |
| Salad Factory | `salad-factory-salmon-sashimi-shoyu` | saladfactorythailand.com/menu/order | Yes | Mismatch | — | — | **REJECT** | The current shoyu-wasabi-dressed item found ("สลัดซีฟู้ดโชยุวาซาบิ") is a mixed-seafood salad, not salmon-specific; a separate "สลัดแซลมอนซาซิมิอโวคาโด" (salmon sashimi + avocado) exists but doesn't carry the shoyu-wasabi dressing our record names. No SKU combines salmon-only sashimi with shoyu-wasabi dressing |
| 7-Eleven | `seven-eleven-garlic-pork-egg-rice` | allonline.7eleven.co.th product page /367920/ | Yes | Exact | JPEG 555×555, 174 KB; CloudFront CDN (GET 200 with/without Referer; HEAD returns 405, a CDN method restriction, not an access-control block) | CP ALL / 7-Eleven's own e-commerce platform; standard copyright | **ACCEPT — remote** | Product name "ข้าวหมูกระเทียมไข่ดาว (ตรา อีซี่โก)" / EZYGO brand is an exact match to the production item. Official composite marketing photo (styled plate + a visible inset of the actual sealed package) confirms the exact SKU |
| 7-Eleven | `seven-eleven-green-curry-chicken` | allonline.7eleven.co.th product page /334743/ | Yes | Exact | JPEG 555×555, 71 KB; same CDN/access pattern | Same as above | **ACCEPT — remote** | Product name "แกงเขียวหวานอกไก่และข้าวหอมมะลิ (ตรา เชฟแคร์ส)" / Chef Cares brand exactly matches "Green Curry with Chicken Breast and Jasmine Rice." Two other Chef Cares green-curry SKUs exist on the same site (a dry-stir-fried "ผัดแห้ง" variant, one with a fried egg) — this is specifically the rice-plus-curry-bowl variant matching our record's name, not one of the confusable siblings |
| 7-Eleven | `seven-eleven-chicken-sukiyaki` | allonline.7eleven.co.th product page /355384/ | Yes | Mismatch | — | — | **REJECT — SKU mismatch** | The only current "sukiyaki chicken" SKU found ("อีซี่ ช้อยส์ Hสุกี้ไก่ขลุกขลิก") is explicitly egg-coated **vermicelli noodles** (วุ้นเส้น) in sukiyaki sauce — no rice. Our production item is named "ข้าวหน้าไก่สุกี้" (chicken sukiyaki **rice**). This is exactly the "package photo of a similar-but-different SKU" trap the brief warned about; not substituted |
| 7-Eleven | `seven-eleven-pork-bulgogi-rice`, `seven-eleven-korean-chicken-fried-rice`, `seven-eleven-sticky-rice-dried-pork` | — | — | — | — | — | **Not further researched** | The 7-Eleven brief scope asked for 2–4 representative items; 3 were researched (1 accepted-adjacent rejection for SKU mismatch, 2 accepted) and the slice's overall 5-item cap was reached with higher-confidence candidates. `seven-eleven-korean-chicken-fried-rice`'s matching SKU was also observed out of stock on AllOnline at research time, which would add its own stability risk. Left for a future batch rather than rushed |

Group 4 (optional additional restaurant) was **not exercised** — Groups 1–3
produced 5 accepted images, well within the target range, so the brief's
"only if Groups 1–3 produce very poor coverage" condition was not met.

## Images accepted (5)

1. `ootoya-grilled-moromi-chicken` — Ootoya Thailand
2. `salad-factory-grilled-chicken-sesame` — Salad Factory Thailand
3. `salad-factory-kale-chicken-truffle` — Salad Factory Thailand
4. `seven-eleven-garlic-pork-egg-rice` — 7-Eleven Thailand
5. `seven-eleven-green-curry-chicken` — 7-Eleven Thailand

All `kind: 'official-remote'`, hotlinked (not bundled), matching the Slice 18
model and rights posture exactly. No image file was added to the repository.

## Existing Slice 18 images

`ootoya-grilled-mackerel` and `ootoya-tonteki-pork-chop-set` were not
modified. No factual/source defect was found for either during this
research pass.

## Production data changes

`src/restaurants.ts`:

- Added constants: `asOf19` ('2026-09-15'), `saladFactoryImageSourceLabel`,
  `sevenElevenImageSourceLabel` (reused the existing `ootoyaImageSourceLabel`
  for the new Ootoya item, since it's the same brand/source as the two
  existing images).
- Added a `menuImage` object to the 5 accepted items listed above. No other
  field (nutrition, price, meal context, serving note, category, tags,
  restaurant/menu membership) was changed for any of the 84 items.

`src/meal-context.test.ts`, `src/menu-image.test.tsx`: updated two Slice-18-
era assertions that hardcoded "exactly 2 images total" / "≤5 images total"
(now outdated by design, since Slice 19 intentionally adds up to 5 more —
2 + 5 = 7), and added new tests for the Slice 19 batch specifically (see
Tests section below). No Slice 18 component-behavior tests were duplicated.

## Coverage

- Before: 2 / 84
- New: 5
- After: 7 / 84

By restaurant: Ootoya 3/6 items now image-backed (mackerel, tonteki, moromi
chicken), Salad Factory 2/6 (chicken sesame, kale truffle), 7-Eleven 2/6
(garlic pork egg rice, green curry chicken). All other 10 restaurants remain
at 0 image-backed items, unchanged.

## Rights / source confidence

| Item | Confidence | Note |
| --- | --- | --- |
| Moromi chicken | Medium | Same posture as the 2 existing accepted Ootoya images: first-party static path, no hotlink protection, but only a standard copyright notice (no explicit reuse grant) |
| Chicken sesame salad | Medium | First-party Cloudflare-CDN-served asset on the brand's own domain, standard copyright only |
| Kale chicken truffle | Medium | Same as above |
| Garlic pork egg rice | Medium | First-party CP ALL/7-Eleven e-commerce CDN; standard copyright; HEAD requests return 405 (CDN method restriction) but GET works cleanly with or without a Referer header |
| Green curry chicken | Medium | Same as above |

No item reached High confidence because, as with the two existing Slice 18
images, none of the four source sites publish an explicit image
redistribution/reuse license — only standard all-rights-reserved copyright.
The decision to hotlink rather than bundle (Option B, per Slice 18 policy)
is what keeps this defensible without that license.

## Serving-match confidence

| Item | Rating |
| --- | --- |
| Moromi chicken | Acceptable |
| Chicken sesame salad | Exact |
| Kale chicken truffle | Acceptable |
| Garlic pork egg rice | Exact |
| Green curry chicken | Exact |

No Uncertain or Mismatch item is present in the accepted set.

## Performance characteristics

| Item | Format | Dimensions | Size |
| --- | --- | --- | --- |
| Moromi chicken | PNG | 800×600 | 399 KB |
| Chicken sesame salad | JPEG | 1000×1000 | 693 KB |
| Kale chicken truffle | JPEG | 1000×1000 | 711 KB |
| Garlic pork egg rice | JPEG | 555×555 | 174 KB |
| Green curry chicken | JPEG | 555×555 | 71 KB |

The two Salad Factory images (693 KB / 711 KB) are comparable in weight to
the existing Ootoya images (628 KB / 1.05 MB) — a real, documented cost of
not re-encoding third-party assets, consistent with Slice 18's existing
tradeoff. The two 7-Eleven images are notably lighter (71–174 KB) since they
are pre-sized 555×555 e-commerce thumbnails rather than full-resolution menu
photography. No optimization pipeline, proxy, or bundling was added, per the
brief's non-goals.

## Files changed

- **Data:** `src/restaurants.ts` (5 new `menuImage` records + 3 new
  constants; no other field touched)
- **Docs:** `docs/restaurant-image-expansion-19.md` (this file)
- **Tests:** `src/meal-context.test.ts`, `src/menu-image.test.tsx` (updated
  2 outdated Slice-18-era count assertions; added Slice 19 coverage — see
  below)
- **No production/UI code was touched** — `src/menu-image.tsx`, `src/App.tsx`,
  and `src/styles.css` are unchanged from Slice 18/18B.

## Browser smoke

Not performed. No real browser was exercised in this session (research and
data-entry only, per the brief's Section O making this optional for Slice
19). All 5 accepted images are plain photographs at ordinary aspect ratios
(800×600, 1000×1000, 555×555 — all within the range already validated by
Slice 18B's real-browser pass for 800×600 Ootoya images), so no unusual
aspect ratio triggers the brief's "browser QA becomes REQUIRED" condition.
A future slice should still browser-verify the 1000×1000 and 555×555 images
specifically, since Slice 18B only measured 800×600 in a real browser.

## Tests / verification

- Added 9 new tests: 5 in `src/meal-context.test.ts` (Slice 19 validation,
  search-by-name, nutrition/price/meal-context/serving-note integrity, and
  Pick/filter/Quick-Goal eligibility parity for all 5 new items — plus 2
  tests replacing the outdated Slice-18-only assertions), 4 in
  `src/menu-image.test.tsx` (restaurant spread, non-empty alt text, no
  duplicate `src`, updated total-coverage ceiling — plus 1 test replacing the
  outdated ≤5-total assertion).
- Full suite: `npx vitest run` → **24 test files, 339 tests, all passing**
  (was 24 files / 330 tests before this slice).
- `npx tsc --noEmit` → clean.
- `npm run build` → succeeds; same pre-existing >500 KB chunk-size warning as
  Slice 18/18B, unrelated to this slice (812 KB JS / 28 KB CSS, up from
  808 KB / 28 KB — the size delta is new test/data code, not any bundled
  image, since all 5 new images remain remote-only).
- `git diff --check` → exit 0 (only pre-existing LF/CRLF notices).

## Production integrity

- Restaurants: **13** (unchanged). Menu items: **84** (unchanged).
- Nutrition, price, meal context, serving notes, categories, tags, and
  restaurant/menu membership: unchanged for all 84 items — the only edits
  were adding a `menuImage` field to 5 additional item objects.
- The existing 2 Slice 18 images (`ootoya-grilled-mackerel`,
  `ootoya-tonteki-pork-chop-set`) are byte-for-byte unchanged.
- No third-party user photography (no Wongnai, no delivery-app customer
  photos, no food-blog photography) was used or considered as a production
  source. No AI-generated food images. No scraper, downloader, proxy, CDN,
  or image-optimization pipeline was added.

## Expansion evaluation

- **Official-source availability:** Mixed. Ootoya and Salad Factory (both
  CRG-operated brands) and 7-Eleven's own AllOnline e-commerce platform all
  have addressable, individually-linkable, first-party photography —
  but roughly half of the specific items researched (7 of 13 candidates
  actually inspected) had no exact matching photo on the current menu, most
  often because the brand's current menu has renamed, discontinued, or
  fragmented a dish into several similar-but-distinct SKUs since our
  production record was written.
- **Serving-match success:** Mixed. 5 of 13 inspected candidates passed
  (Exact or Acceptable); the rest failed specifically on serving/SKU
  identity, not on rights or technical access — confirming the gate is doing
  real work, not just rubber-stamping "found a photo."
- **Image-source maintainability:** Acceptable. Four different first-party
  domains now hotlinked (`ootoya.co.th`, `saladfactorythailand.com`,
  `allonline.7eleven.co.th`/`media.allonline.7eleven.co.th`) — more
  maintenance surface than Slice 18's single domain, same no-retry/no-proxy
  posture, same graceful-failure mitigation.
- **Research effort per accepted image:** Medium. Every accepted image
  required at least one rejected sibling-SKU investigation nearby (e.g. the
  sukiyaki noodle-vs-rice confusion, the three Chef Cares green-curry
  variants) — this is not a fast "grab the first photo" process.
- **Gradual rollout viability:** Acceptable. The gate scaled to 2 new
  restaurant brands and produced a real, if modest, batch; but the hit rate
  (5 accepted of 13 seriously inspected, before counting Ootoya's own 3
  rejections) suggests future batches should budget for roughly as much
  rejected research as accepted output.

## Recommendation

**CONTINUE** — the source/serving-match gate scaled successfully to two new
restaurant brands (Salad Factory, 7-Eleven) beyond the original Ootoya
pilot, correctly rejected 8 candidates for genuine serving/SKU-identity
reasons (not merely for being hard to find), and produced a legitimate
5-item batch. Another small batch is justified.

## Suggested next batch

If continued, recommend investigating next (do not implement yet):

1. **Fuji Japanese Restaurant Thailand** — same "Japanese grilled/rice-bowl"
   category as Ootoya, plausible first-party site given it's an established
   Bangkok-founded chain with its own nutrition-research history already on
   file (`fujiEstimateNote`).
2. **MK Restaurants** — large, well-established Thai chain; likely to have
   official site photography for its suki/hot-pot sets, though "set" items
   will need the same complete-vs-à-la-carte scrutiny that rejected Oyakodon
   here.
3. **Sukiya Thailand** — already has an official cross-market nutrition
   source relationship (Sukiya Japan, per `sukiyaCuratedNote`), which may
   extend to official photography as well; gyudon bowls are visually
   distinctive and easier to serving-match than a mixed set.

## Commit readiness

Not committed or pushed, per the brief. Research, production data changes,
tests, and verification are complete; the worktree remains ready for the
user's separate commit decision.
