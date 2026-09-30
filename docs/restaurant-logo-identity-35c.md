# Slice 35C: Restaurant logo and brand identity

## Entry state
Branch `main`, HEAD `cb497b803ae5293221c1568d137a8a6891844260` (Slice 35B committed), clean worktree.
Recount from source: 13 restaurants, 84 menu items, 44 prices, 22 menu images, 0 bundled.
`RestaurantIdentity` (src/restaurant-identity.tsx) rendered an app-owned initials mark; the
directory row in src/App.tsx uses it at size `sm` (34px).

## Audit (13 restaurants, first-party sources only)
| Restaurant | Initials | Classification | Asset / reason |
| --- | --- | --- | --- |
| Ootoya | OO | VERIFIED_OFFICIAL | ootoya.co.th/images/logo.gif (GIF 140x140, site header logo) |
| 7-Eleven Thailand | 7 | VERIFIED_OFFICIAL | 7eleven.co.th/static/imgs/711-logo-2026.svg (SVG, site header logo) |
| Jones' Salad | JS | VERIFIED_OFFICIAL | jonessalad.com site icon `cropped-Logo-WEB-1-192x192.png` (192x192). The header `web-logo.png` (345x150) is off-centre with blank space, so the square icon was used. |
| Fuji | FJR | VERIFIED_OFFICIAL | fuji.co.th theme `logo_fuji-whitebg.png` (200x200) |
| MK Restaurants | MR | VERIFIED_OFFICIAL | mkrestaurant.com `logo__mk.png` (412x277, transparent) |
| Sukiya | SK | VERIFIED_OFFICIAL | sukiya.co.th `head_logo_sk@2x.png` (270x223, site header logo) |
| Nittaya Kai Yang | NKY / นก | VERIFIED_OFFICIAL | nittayakaiyang.com site icon `cropped-logo-192x192.png` (192x192). The wide `logo.png` (414x100) is unreadable at 34px. |
| The Steak & More | TSM | VERIFIED_OFFICIAL | Minor Food (brand operator) franchise page, `cdn.minorfood.com/uploaded/franchise/logo/...png` (500x500). The brand has no website of its own. |
| Santa Fe' Steak | SFS | WEAK_CANDIDATE | santafesteak.com `/img/logo.png` is white-on-transparent and invisible on a light tile. Showing it would need a dark background, which is recoloring. Withheld. |
| Salad Factory | SF | NOT_FOUND | The former official domain is gone or unrelated (see 35A). The remaining route is a LINE profile, which was not used. |
| Zaab Eli | ZE | NOT_FOUND | No official website. Social profiles need login, which was not attempted. |
| Somtam Nua | SN | NOT_FOUND | No official website. |
| ThongSmith | TH | NOT_FOUND | `thongsmith.com` is a parked-domain redirect, not a brand site. |

Totals: VERIFIED 8, WEAK 1, NOT_FOUND 4. No coverage target was set. Every asset was fetched over
HTTPS from the named first-party host and shown in headless Edge.

## Implementation
- `src/types.ts`: new optional `Restaurant.logo?: RestaurantLogo` (`src`, localized `alt`, `kind: 'official-remote'`,
  `sourceUrl`, localized `sourceLabel`, `asOf`). `MenuImage` is unchanged, and logos are never bundled or modified.
- `src/restaurants.ts`: 8 `logo` entries, `asOf35c = '2026-09-30'`.
- `src/restaurant-identity.tsx`: new opt-in `showLogo` prop. With a logo it renders an `<img>` in the same fixed box.
  On `onError` it switches to the existing initials mark, so no broken-image icon appears. Without a logo or `showLogo`, behavior is unchanged.
- `src/App.tsx`: only the directory row passes `showLogo`. Menu cards, picks and bridges still show initials.
- `src/styles.css`: `.restaurant-identity-logo` (white tile, `object-fit: contain`, 3px padding). The box stays 34x34.

## Fallback behavior
Restaurants without a logo keep initials unchanged. A remote logo that fails at runtime swaps to the same initials.
The box size is fixed, so there is no layout shift.

## Files changed
src/types.ts, src/restaurants.ts, src/restaurant-identity.tsx, src/App.tsx, src/styles.css,
src/restaurant-app.test.tsx (row identity counts: logo 8, pilot 1, fallback 4),
src/restaurant-logo-35c.test.tsx (new, 7 tests), this doc.

## Verification
- `npx vitest run src --exclude '**/.kilo/**' --maxWorkers 2`: 35 files, 526 tests passed.
- `npx tsc --noEmit`, `npm run build` (existing bundle-size warning only) and `git diff --check`: passed.
- Catalog unchanged: 13 restaurants, 84 items, 44 prices, 22 images.

## Visual QA (production preview, headless Edge)
Viewports 390x844 and 1440x900, Thai and English.
- All 8 logos loaded (naturalWidth > 0) in all four combinations.
- Identity box was 34x34 on every row. Row height was 63px, except Fuji at 390 EN (79px), where the long cuisine subtitle wraps. That wrap was already the case before the logos.
- No horizontal overflow, and the name column was aligned across rows.
- Mixed logo and initials rows look consistent. The initials tiles read as intentional.
- Fuji, Ootoya and Steak & More marks are small but recognizable at 34px. Their fine print is not legible, which is expected for a compact logo.
- Forcing Sukiya's logo to a 404 URL at runtime swapped to its "SK" initials, with no `<img>` and no size change.

## Notes
Logos are hotlinked, consistent with the official-remote menu image policy. Hotlink stability and reuse rights are not guaranteed by being downloadable.
The Nittaya and Jones' assets are WordPress site icons that the brands publish themselves.
