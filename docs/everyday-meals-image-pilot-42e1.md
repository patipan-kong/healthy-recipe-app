# Everyday Meals image pilot — Slice 42E-1

Preflight: main, HEAD `4fca3312148c1bd10a7de70f7b49930ae20a4516`, clean working tree.

Six images generated with the built-in image generation tool. No external photos,
nutrition research, source mappings, or source access dates were introduced.
The generated photos are illustrative meal identity assets, not measured portions
or depictions of selected options. Originals remain outside the repository.

## Existing conventions and integration

Recipes use `/recipes/<semantic-id>.webp`, a recipe generation manifest, and an
explicit failed-image fallback. Restaurant images use `/menu/` bundled WebP or
official remote image metadata; their provenance model does not apply to these
generated assets. Existing recipe sources inspected were 1254×1254. Asset tests
check RIFF/WEBP signatures, dimensions and file sizes.

This pilot uses the existing optional `EverydayMeal.image` field and
`/everyday-meals/<locked-meal-id>.webp`. A small shared component handles Browse
and Detail images and failed loads. There is no separate manifest subsystem.
Card images are decorative because each button already announces its meal name;
Detail images have the localized meal name as alt text. Cards load lazily; the
Detail hero does not. Both decode asynchronously.

Containers retain 90px Browse and 160px Detail heights. Images use centered
`object-fit: cover`, fixed dimensions and overflow clipping. The existing card
border radius applies. Missing/failed images retain the utensil fallback.
All 50 meals remain in their original order, with 6 images and 44 placeholders.

## Production assets

All are opaque 800×800 WebP, downsampled from 1254×1254 generated PNG using
Lanczos, quality 83, WebP method 6. Paths below are relative to repository root.

| Meal | Locked ID | Asset | Bytes | Browse | Detail | Concern |
| --- | --- | --- | ---: | --- | --- | --- |
| สุกี้หมู | pork-suki | public/everyday-meals/pork-suki.webp | 95,956 | Clear pork/noodles/vegetables | Recognizable | Wide hero crops bowl rim and some broth |
| ข้าวต้มปลา | fish-rice-soup | public/everyday-meals/fish-rice-soup.webp | 76,294 | Fish and light broth visible | Recognizable | Rice grains are less distinct at thumbnail size |
| ก๋วยเตี๋ยวเรือหมู | pork-boat-noodles | public/everyday-meals/pork-boat-noodles.webp | 97,944 | Dark broth, pork and meatballs visible | Recognizable | Wide hero trims upper herbs and bowl edges |
| ข้าวกะเพราหมูสับ | minced-pork-basil-rice | public/everyday-meals/minced-pork-basil-rice.webp | 96,892 | Rice and basil pork visible | Recognizable | Slightly tidy rice mound; no egg |
| ข้าวมันไก่ | hainanese-chicken-rice | public/everyday-meals/hainanese-chicken-rice.webp | 68,456 | Chicken, rice, cucumber visible | Recognizable | Side sauce mostly outside desktop crop; visible skin is illustrative, not an option promise |
| ส้มตำ + ไก่ย่าง + ข้าวเหนียว | papaya-salad-grilled-chicken-sticky-rice | public/everyday-meals/papaya-salad-grilled-chicken-sticky-rice.webp | 74,594 | All three components visible | All three components visible | Grilled chicken has somewhat glossy skin; assess in visual review |

## Prompt set actually used

Shared direction: one square realistic natural food photograph, not a collage;
approximately 40-degree camera angle; centered modest single serving in simple
off-white ceramic ware; pale warm neutral dining surface; soft warm natural
daylight, gentle shadows, moderate depth of field, natural textures and moderate
saturation. Believable everyday Thai restaurant/home presentation. No luxury
advertising styling, people, hands, faces, text, branding, packaging, watermarks,
decorative scattered ingredients, excessive steam or unrelated dishes. Complete
serving and breathing room requested for responsive crops. Only dish content
varied, with a horizontal arrangement for the three-component meal.

- Pork suki: Thai soup preparation, light clear broth, sliced pork, translucent
  glass noodles, Chinese cabbage, morning glory, softly cooked egg. Not Japanese
  sukiyaki or dry noodles.
- Fish rice soup: white fish pieces, distinct cooked rice grains in light clear
  broth, ginger slivers, Thai celery/scallion. Not thick blended congee.
- Pork boat noodles: dark rich brown broth, rice noodles, sliced pork, a few
  meatballs, bean sprouts, Thai basil and spring onion; normal bowl.
- Minced pork basil rice: white jasmine rice beside coarsely minced pork with
  holy basil/red chili. Explicitly no fried/boiled egg or omelet, long beans, or
  luxury garnish.
- Hainanese chicken rice: seasoned rice, sliced poached chicken, cucumber, tiny
  ginger soybean sauce bowl if it fits. Natural mixed chicken appearance, no
  specific breast/thigh/skin option advertising, no fried chicken or egg.
- Papaya salad set: modest som tam with tomatoes left, small sliced grilled
  chicken portion middle, small sticky rice portion right on one ordinary plate.
  One-person serving, all three within the central band for wide crops; no feast.

The set matches in lighting, tabletop, ceramics and realism. Most generated
servings occupy more of the square than the requested 65–70%, so wide hero
crops are close views. Food identity survives, but this remains a visual review
decision. No image currently requires regeneration to render correctly; chicken
gloss and tight desktop crops are the primary review concerns.

## Verification

- Focused 42E-1: 11 tests passed.
- Focused 42A–D and image/asset/Home/ad regression checks: 11 files, 163 passed
  including those 11 pilot tests. 42A 10, 42B Browse/discovery 11, 42C 71,
  42D Home 10; existing image/asset tests and Home/ad integration also passed.
- Full main-checkout suite: 49 files, 737 passed. Command:
  `node node_modules/vitest/vitest.mjs run --exclude '.kilo/**'`.
  Exclusion is only for hidden worktree copies whose failures were previously
  established as unrelated; no test configuration changed.
- `npx tsc --noEmit`: passed. `npm run build`: passed.
- `git diff --check`: passed.
- Full baseline catalog comparison after removing only image fields: identical.
  UTF-8 JSON SHA256 is
  `1aad81ae9d0476e3365d1130b5822dea36a62287fe7d41fd9b1d0c96fe191cc5`.
  A direct source comparison also confirms exactly six image lines added.
- Initial new-test failures were corrected: PowerShell pipeline encoding
  corrupted the initial baseline hash; binary UTF-8 baseline retrieval confirmed
  equality. jsdom lacks the image `loading` property, so the assertion uses the
  actual loading attribute. All subsequent tests pass.
- Warnings: jsdom's unimplemented `window.scrollTo` in existing tests; Vite's
  existing >500kB chunk warning (JS 950.96kB, gzip 204.73kB); Git's inaccessible
  global ignore file and LF/CRLF notices. No new dependencies.

## Responsive review and screenshots

Reviewed normal Browse, all six pilot cards/Details, and non-pilot chicken suki
and garlic pork rice at 360, 430, 768 and 1280px. Screenshots inspected as contact
sheets as well as individual pages. No horizontal overflow or stretching; all
50 Browse visual frames are 90px. All Detail heroes are 160px. Nutrition bottom
is about 487px from viewport top (526px for the long set title at 360px), keeping
nutrition readily visible. Search, options, add-ons and navigation remain covered
by existing regression tests. A grid image sizing issue discovered during review
was corrected with absolute image positioning inside the fixed frame.

Review URL: `http://127.0.0.1:5176/?everyday-meals`.
Detail: append `&everyday-meal=<locked-id>` from the asset table.
No permanent gallery was added.

Screenshots are outside production assets under:
`C:/Users/patip/.codex/visualizations/2026/10/01/01a0f601-0faf-7dc3-8fd1-88c228d2047c/`.

- `42e1-browse-{360,430,768,1280}.jpg`: complete unfiltered Browse.
- `42e1-detail-<locked-id>-<width>.jpg`: all six and two fallback Details.
- `42e1-detail-contact-<width>.jpg`: eight Detail views together.
- `42e1-card-contact-<width>.jpg`: six searched pilot cards and two fallbacks.

Exactly six production assets. Remaining 44 image associations absent. Nutrition,
names, IDs, categories, tags, options, add-ons, notes, tips, serving assumptions,
provenance, Home and uniform 1-of-50 random behavior unchanged. No full batch,
commit, push, deployment or Slice 42F.


## Subsequent approved presentation and complete production

The initial fixed-height observations above are historical. The approved 42E-1
presentation correction replaced them with 4:3 Browse and 16:9 Detail
(max-height 360px), retaining cover and placeholder parity. Slice 42E-2
preserves that CSS and all six pilot bytes, and completes the other 44 assets.
See [42E-2 production review](everyday-meals-image-production-42e2.md) for the
final 50-image integrity, visual review, asset table and verification record.
