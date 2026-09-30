# GoodFood V2 — Slice 34: Inline ad placement prototype

## Entry and product rationale

Entry branch: `main`. HEAD: `5596ea2994fb8de4868cbe4e62e2153bc5ffb9e3`.
`git status --short` was empty. Git needed a per-command `safe.directory`
exception because the sandbox account differs from the checkout owner; no global
Git settings were changed. No applicable AGENTS.md was found.

Imported production source counts: 208 recipes, 13 restaurants, 84 restaurant
menu items, 23 recipe/restaurant relations. These are asserted in the new test.

GoodFood helps people decide what to eat. Inline ads are secondary and appear
only after substantial browsing or a complete answer and its actions.

## UI inspection and placements

- Recipe Browse: repeated full-row sibling slots after each 8 cards in one column,
  10 cards in two columns, or 12 cards in three columns, only with content following.
  No slot in Favorites, Pantry, Shopping, or a Browse continuation under Pick Focus.
- Restaurant Browse: the 13-row directory is the natural long browsing surface.
  One sibling slot after restaurant 10, only with at least 11 matching rows.
- Recipe Pick Focus: one slot after the entire result section, including Pick
  Again, View Recipe, favorite, nutrition, and the list continuation toggle.
- Random Restaurant: one slot after the complete result section and actions.
- Random Meal on the restaurant directory: one slot after the complete shared
  card, including any Cook/Buy bridge.
- Restaurant-local menu pick and Explore pick: one slot after the whole decision
  section and its continuation toggle.
- Recipe Detail: one bottom ad after core content, ingredients, instructions,
  and the complete Cook/Buy bridge when present. No ad inside the bridge.
- All-restaurant Menu Search (Explore): repeated full-width sibling ads using
  the shared responsive 8 / 10 / 12 policy and currently visible results.
  Pick Focus and its continuation retain the existing single result ad.
- Favorites, Pantry, and Shopping List: zero ads. This is the final V1 boundary;
  no additional surfaces, sticky ads, popups, overlays, interstitials, or rewarded ads.

The directory can retain both independent restaurant and meal results. Each has
one slot; with the directory feed slot that page can contain three ads. This is
intentional per-result behavior, not shared-card duplication, and a density
tradeoff to evaluate before real advertising. Shared `ExploreItemCard` and bridge
components contain no AdSlot.

## API and flag

`src/ad-slot.tsx` exports:

```tsx
<AdSlot placement="recipe-feed" />
<AdSlot placement="menu-feed" />
<AdSlot placement="recipe-detail" />
<AdSlot placement="restaurant-feed" />
<AdSlot placement="recipe-pick" />
<AdSlot placement="restaurant-pick" />
```

`AdFeed` inserts repeated recipe and global menu separators using one pure cadence policy.
The existing CSS uses one column below 560px and three columns from 560px upward;
its base two-column rule is overridden at every width. A matchMedia subscription
mirrors that breakpoint and updates placement on resize, with listener cleanup.
The two-column cadence (10) is covered independently for a future tablet range;
this change does not introduce a new grid layout. Restaurant feeds retain one
slot after row 10. Catalog arrays and selection inputs remain untouched.

Density follows substantial real content between ads, with no page-level maximum.
Short recipe results up to the cadence have no ad. Exact multiples have no final
ad; any separator requires at least one real recipe afterward. Filtering naturally
changes the number of separators. Result/decision ads and ad-free bridge interiors
remain unchanged. Recipe Detail now has its approved bottom slot.
`adPrototypeEnabled()` is the sole configuration check:
`import.meta.env.VITE_SHOW_AD_PROTOTYPE === 'true'`.

Enable locally in PowerShell:

```powershell
$env:VITE_SHOW_AD_PROTOTYPE = 'true'
npm run dev
```

Restart Vite after changing the flag. Alternatively add
`VITE_SHOW_AD_PROTOTYPE=true` to an untracked `.env.local`, and remove it when done.
An explicitly enabled preview build uses the same flag and `npm run build`.

Normal production builds with the flag absent render no mock ads. To explicitly
force them off even if local env files exist:

```powershell
$env:VITE_SHOW_AD_PROTOTYPE = 'false'
npm run build
```

Do not set the opt-in flag in normal production deployment configuration.

## Accessibility and responsive behavior

Semantic `aside` with visible, bilingual `Sponsored · โฆษณา` labeling and an
explicit prototype description. No brand, fake CTA, interactive element, focus
management, tab stop, live region, timer, or popup. Slots are siblings outside
existing polite announcement sections and decision cards.

Muted background, dashed border, readable 14px sponsorship label, 20px padding
and vertical margins. Width follows page gutters, capped at 720px. Recipe grid
slots span all columns. Normal document flow; nothing sticky or floating.

Real browser QA with the flag enabled covered Thai and English at 360×800,
390×844, 430×844, and 1440×900. At each size: Home/Browse, no-match search,
category-filtered Browse, recipe pick, recipe detail, restaurant Browse,
restaurant pick, directory Random Meal, restaurant-local pick, Explore pick,
and a Shioyaki recipe detail containing the Cook/Buy bridge.

88 page-state measurements found no horizontal overflow and `window.scrollX=0`.
Document/body scrollWidth equaled clientWidth:

| Viewport | Typical client/scroll width | Slot width |
| --- | --- | --- |
| 360×800 | 345 / 345 | 305 |
| 390×844 | 375 / 375 | 335 |
| 430×844 | 415 / 415 | 375 |
| 1440×900 | 1425 / 1425 (1440 without vertical scrollbar) | 640 |

Screenshot inspection at mobile and desktop confirmed the quiet placeholder
below the completed answer/actions. No nested ads were found. Each tested bridge
was present and ad-free. Browser viewport overrides were reset after QA.

## Tests and verification

Thirteen focused tests cover disabled/enabled flag, sponsorship, absence of tab stops,
responsive cadence, repeated feed order, no trailing ads, short sets, source counts, category/search filtering,
random candidate membership and Pick Again, recipe pick/detail placement,
restaurant directory/local/random placement, shared Explore cards, Favorites,
Shopping, and Cook/Buy bridge navigation.

- Baseline `npm test`: 95 files, 1462 tests; 1459 passed, 3 failed in ignored
  `.kilo/worktrees` checkouts (two existing food-data hash assertions and one
  random-pick assertion). Active checkout tests passed in that run.
- Post-change unscoped full suite: 96 files; 1467 passed, 2 failed, both the same
  nested-checkout food-data hash assertions. Vitest substring `src` does not
  exclude nested worktrees.
- Active checkout full suite: `npx vitest run --exclude '**/.kilo/**' --maxWorkers 2`.
  Final run: 33 files / 508 tests passed.
  An earlier concurrent run hit a pantry test timeout; limiting workers resolved it.
- Final focused suite: 11 tests passed. Related ad/bridge/random verification: 77 tests across 7 files passed.
- TypeScript: `npx tsc --noEmit` passed.
- Both prototype-enabled and disabled production builds passed. Vite reports the
  existing large-bundle warning; no dependencies were added.
- A real browser on the default production preview found zero ads in recipe Browse/Pick and restaurant Browse/Pick.
- `git diff --check` passed.

## Future integration and non-goals

AdSlot is the controlled future Android native-AdMob rendering boundary. Platform
behavior belongs inside that component/configuration boundary. Web remains
ad-free by default. This slice implements no Android detection or platform layer.

No AdMob/Google SDK, Capacitor, analytics, tracking, consent flow, ad unit/app IDs,
AndroidManifest changes, interstitials, rewarded ads, overlays, sticky banners,
modals, countdowns, provider, manager, or state machine. No catalog, relations,
random algorithm, filter logic, package files, commits, or pushes changed.

Remaining risks: production opt-in must stay unset; directory ad density with two
independent results needs product evaluation; real Android native-ad sizing,
lifecycle, and accessibility require a later Android-specific implementation.

## Repeated-feed follow-up QA

Prototype-enabled unfiltered Browse retained all 208 recipe cards:

| Viewport | Active columns | Cadence | Observed ads | Grid and ad width |
| --- | --- | --- | --- | --- |
| 360×800 | 1 | 8 | 25 | 305px |
| 390×844 | 1 | 8 | 25 | 335px |
| 430×844 | 1 | 8 | 25 | 375px |
| 1440×900 | 3 | 12 | 17 | 640px |

All separators spanned the grid width, had clear Sponsored · โฆษณา labels,
had real recipes on both sides, and produced no horizontal overflow. No
consecutive or trailing ads. Normal mobile scrolling revealed the first ad
after eight cards. Desktop separators follow four content rows. Screenshots
confirmed both mobile and desktop presentation. Directory smoke tests at
390×844 and 1440×900 retained 13 restaurants and one feed ad, without overflow.
The two-column policy yields 20 ads for 208 cards, but no current breakpoint
activates that layout.

Follow-up checks: 11 focused tests, 33 active-checkout files / 508 tests,
TypeScript, enabled build, default build, and git diff --check passed. Existing
Vite bundle-size warning remains. No commit or push.

## Final V1 additions QA

Prototype-enabled browser observations:

| Surface | 390×844 | 1440×900 | Order / results |
| --- | --- | --- | --- |
| Recipe Browse | 25 ads | 17 ads | 208 recipes, every 8 / 12 |
| Global menu search | 10 ads | 6 ads | 84 menus, every 8 / 12 |
| Menu search: Shioyaki | 0 ads | 0 ads | 2 menus |
| Recipe Detail with bridge | 1 ad | 1 ad | Ingredients → method → complete bridge → ad |
| Recipe Detail without bridge | 1 ad | 1 ad | Ingredients → method → ad |
| Favorites / Pantry / Shopping | 0 each | 0 each | Explicitly ad-free |

Global menu cards preserve their existing single-column flex layout at all widths.
The feed shares the responsive policy breakpoint with Browse (8 below 560px,
12 at/above it); the pure two-column cadence remains 10. No grid redesign.
Observed feed ads span 335px on mobile and 640px on desktop. Measured surfaces
had no horizontal overflow and clear sponsorship labels. Feed ads are card
siblings with no consecutive or trailing ads. Detail ads follow completed
content and intact bridges. Screenshots confirmed detail and menu presentation.
No data, result count, favorites, candidate pool, relation, or search/filter
behavior changes. No feed slots in Pick Focus continuations.

Final checks: 13 focused tests, 33 active-checkout files / 510 tests, TypeScript,
prototype-enabled build, default disabled build, and git diff --check passed.
The existing Vite bundle-size warning remains. No commit or push.
