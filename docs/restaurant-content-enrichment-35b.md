# GoodFood V2 — Slice 35B: Verified restaurant content enrichment

Implements only the safe batch approved in `docs/restaurant-content-enrichment-audit-35a.md`
(sections 9–12 and 17). No new research. Data/reference changes in `src/restaurants.ts` only;
no schema, UI, ad, relation, nutrition, filter, search or random-pool change.

## Entry state

Branch `main`, HEAD `0237d6c261ee74843233d64e66fe0dfcd3502088`
(`docs: add restaurant content enrichment audit`); `git status --short` empty.
Baseline recounted from source: 13 restaurants, 84 items, 24 prices, 19 images
(all `official-remote`), 0 bundled.

## Price additions (20, THB, asOf 2026-09-30)

| Restaurant | Item ID | THB | Qualification carried in the note |
| --- | --- | ---: | --- |
| Jones' Salad | `jones-grilled-salmon-salad` | 369 | current listed price |
| Jones' Salad | `jones-caribbean-chicken-steak` | 199 | current listed price |
| Jones' Salad | `jones-mushroom-soup` | 59 | plain soup, excludes truffle/topping alternatives |
| Fuji | `fuji-salmon-shioyaki-brown-rice-set` | 330 | branch exceptions may apply |
| Fuji | `fuji-salmon-shioyaki` | 290 | à la carte, not the set; branch exceptions |
| Fuji | `fuji-salmon-tataki` | 270 | branch exceptions may apply |
| Fuji | `fuji-kinoko-mushroom-salad` | 180 | branch exceptions may apply |
| Fuji | `fuji-chicken-teriyaki` | 170 | à la carte, not the ฿210 set; branch exceptions |
| Fuji | `fuji-chirashi-sushi-don-set` | 390 | branch exceptions may apply |
| MK | `mk-special-vegetable-set` | 72 | current listed price |
| MK | `mk-seafood-suki-broth` | 142 | current listed price |
| MK | `mk-pork-shabu` | 72 | current listed price |
| Sukiya | `sukiya-gyudon-regular` | 89 | size M; not a delivery price |
| Sukiya | `sukiya-gyudon-okra-regular` | 119 | size M; not a delivery price |
| Sukiya | `sukiya-curry-rice-regular` | 89 | size M; not a delivery price |
| Sukiya | `sukiya-beef-plate-no-rice` | 75 | size M; not a delivery price |
| Sukiya | `sukiya-salad` | 45 | current menu; not a delivery price |
| Sukiya | `sukiya-miso-soup` | 30 | current menu; not a delivery price |
| ThongSmith | `thongsmith-dry-rice-kurobuta-braised-pork` | 239 | 10% service charge additional |
| ThongSmith | `thongsmith-grilled-pork-meatballs` | 119 | 10% service charge additional |

## Price correction (1)

`nittaya-grilled-pork-neck`: THB 130 → **140** (plain grilled pork neck, 35A spread 12–13); asOf 2026-09-30.

## Image additions (5, `official-remote`, asOf 2026-09-30)

Lightweight recheck on 2026-09-30: all five documented assets decode in a real browser
(headless Edge `Image` load): MK 500×500, Nittaya pork neck 1042×1043, papaya salad 1920×1920,
larb 1042×1043, fried pork 1042×1043. Plain `curl` receives HTTP 403 from nittayakaiyang.com
(bot protection), so browser decoding is the evidence used, consistent with 35A's method.
`sourceUrl` points at the documented official menu page, not the raw asset.

| Item ID | Source page |
| --- | --- |
| `mk-health-vegetable-set-small` | mkrestaurant.com Thai suki page 2 |
| `nittaya-grilled-pork-neck` | nittayakaiyang.com fried/grilled category |
| `nittaya-som-tam-thai` | nittayakaiyang.com papaya category |
| `nittaya-larb-moo` | nittayakaiyang.com larb category |
| `nittaya-chiang-mai-fried-pork` | nittayakaiyang.com fried/grilled category |

## Removed broken image references (2)

`salad-factory-grilled-chicken-sesame`, `salad-factory-kale-chicken-truffle`. No replacement
was approved by 35A, so no logo, placeholder or substitute was added. Their prices are unchanged.

## Intentionally withheld

- `mk-health-vegetable-set-small` price stays absent (English ฿188 vs Thai ฿193 conflict).
- All AMBIGUOUS / NOT_FOUND prices and WEAK_CANDIDATE / NOT_FOUND images.
- The nine existing prices 35A could not reverify are neither changed nor deleted.
- `nittaya-grilled-chicken-quarter` image unchanged (whole-chicken portion review pending).
- No candidate was withheld because its source changed.

## Coverage (raw populated fields)

| Measure | Before | After |
| --- | ---: | ---: |
| Restaurants | 13 | 13 |
| Menu items | 84 | 84 |
| Price fields | 24 | 44 |
| Image fields | 19 | 22 |
| Bundled images | 0 | 0 |

Raw counts are not verified counts; see 35A section 17 for strongly supported totals.

## Tests and verification

- New `src/restaurant-enrichment-35b.test.ts` (9 tests).
- Historical snapshot assertions in `src/meal-context.test.ts` and `src/menu-image.test.tsx`
  (pinned to 19 images / 24 prices / six imaged restaurants / larb unreachable / pork neck 130)
  were updated to the new state and renamed to reference Slice 35B; no assertion was loosened.
- `npx vitest run src --exclude '**/.kilo/**' --maxWorkers 2`: 34 files / 519 tests passed.
- `npx tsc --noEmit`, `npm run build`, `git diff --check`: passed (existing Vite bundle-size warning).
- Runtime (jsdom render of completed Explore Pick cards, en + th): Fuji tataki ฿270 with image;
  Sukiya gyudon ฿89 and miso soup ฿30; Nittaya pork neck ฿140 / larb ฿95 with new image and localized alt;
  MK small health vegetable set shows the image and no price element; Salad Factory sesame
  shows ฿155 with no image element; ThongSmith meatballs ฿119. No empty price block. Fuji shioyaki and
  Sukiya gyudon still show their recipe-bridge thumbnails, which are recipe images, unchanged.
