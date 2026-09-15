# GoodFood V2 — Restaurant Visual Identity Pilot

Slice 15 evaluates whether a small, neutral restaurant identity marker improves
scanability without turning GoodFood into a delivery marketplace. The pilot is
limited to 7-Eleven Thailand, Salad Factory, Sukiya, and Nittaya Kai Yang.

## Research ledger

| Brand | Official source examined | Asset type / original format | Background assumptions | Rights / decision |
| --- | --- | --- | --- | --- |
| 7-Eleven Thailand | https://www.7eleven.co.th/ and CP All links from the official site | Official wordmark and brand imagery are visible on the site; remote image format was not established because the asset was not downloaded | Unknown and potentially context-dependent; no background was assumed | No clear redistribution permission was found on the examined pages. Do not bundle the logo. Use the app-owned text mark `7`. |
| Salad Factory | https://www.saladfactorythailand.com/ and the Salad Factory official LINE profile at https://page.line.me/pac6513g | Official wordmark/site imagery is visible; remote image format was not established because the asset was not downloaded | Unknown; no background was assumed | No clear redistribution permission was found. Do not bundle the logo. Use the app-owned text mark `SF`. |
| Sukiya | https://www.sukiya.co.th/th/ and its official menu/about pages | Official brand image/wordmark is visible; remote image format was not established because the asset was not downloaded | Unknown and likely dependent on the original site treatment | No clear redistribution permission was found. Do not bundle the logo. Use the app-owned text mark `SK`. |
| Nittaya Kai Yang | https://www.nittayakaiyang.com/th/ | Official logo image is visible; remote image format was not established because the asset was not downloaded | Unknown; no background was assumed | The site states that rights are reserved, and no redistribution permission was found. Do not bundle the logo. Use the app-owned text mark `นก` in Thai and `NKY` in English. |

## Chosen strategy

Option C from the Slice 15 rights gate: no official logo assets are bundled or
loaded remotely. Each pilot restaurant gets a short, app-owned text mark inside
the same neutral badge treatment used by the rest of the dataset. The other
nine restaurants receive a deterministic fallback derived from their English
display name. This keeps the asset count at zero, avoids brand-color guessing,
and makes the pilot reversible without an asset pipeline.

The marks are decorative because the adjacent restaurant name remains the
accessible identity. The component uses `aria-hidden="true"` and does not alter
keyboard order.

## Browser observations

Baseline and post-change screenshots were captured for Restaurants and Explore
in the real browser. Exact viewport override was unavailable; the measured
desktop-ish viewport was 819×856. The post-change evaluation records whether
the marks improve scanability, ownership recognition, hierarchy, density, and
fallback parity.

- Restaurants remained at 13 rows and 63px row height at the measured viewport.
  The marks made the list easier to scan while the restaurant names stayed the
  dominant text. The neutral fallback badges did not make the other nine brands
  look like a separate product tier.
- Explore remained at 84 cards. The small marker beside each restaurant name
  improved ownership recognition in the mixed list without moving the menu name,
  nutrition line, or favorite control out of its existing hierarchy.
- Random Restaurant showed both fallback and pilot marks during repeated picks.
  Pick Again and View menu retained their existing hierarchy.
- Explore Pick and Favorites reused the same marker component. Restaurant-detail
  headings intentionally omit the marker because the large heading already gives
  clear orientation and the extra badge did not add useful information there.
- At 819×856, all tested states reported document/body scroll width equal to
  client width (`804/804`) and `scrollX === 0`. No layout shift, broken image,
  network request, or scrolling degradation was introduced because no image
  assets are used.
