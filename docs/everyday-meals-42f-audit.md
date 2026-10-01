# Everyday Meals — Slice 42F-A Static / Code QA Audit

Baseline: `main` @ `d717e9c921cf68ff6b08e5927c658e71fe1e7687`, clean tree. Audit only; no source, test, config or asset changes.

## Summary

No P0 or P1 findings. Four P2 items, a handful of P3 notes. The default-parallelism test timeouts are CPU contention (per-test time scales with worker count), not an Everyday Meals regression, though two Everyday test files are among the heaviest in the suite.

## P0

None.

## P1

None.

## P2

### P2-1 Browse cards hide kcal and tags from screen readers
- Files: `src/everyday-meals-browse.tsx`, `EverydayMealCard`.
- Observed: the card is a `<button aria-label={meal.nameTh}>`. An `aria-label` replaces the accessible name; the kcal and tag text inside is not announced as the name. The label is also always Thai, even when `locale === 'en'` (the English name is available as `nameEn`).
- Why it matters: assistive-tech users get the name only, while sighted users scan kcal and tags. Existing menu cards may share the pattern, so check them first.
- Evidence: static JSX. Behaviour in a real screen reader needs manual confirmation.
- Smallest fix: drop `aria-label` and let the button content name itself, or add `aria-describedby` pointing at the kcal/tags block. Make the label locale-aware if kept.
- Regression risk: low. Existing tests query `[data-everyday-meal-id]`, not the label. Check `getByLabel`-style assertions.
- Tests: assert the accessible name or description contains the kcal text; assert English locale uses `nameEn`.

### P2-2 In-app Back leaves a dead browser-history entry
- Files: `src/everyday-meals-view.tsx` `close()`; `src/everyday-meals-navigation.ts` `leaveEverydayMeals()`; `src/App.tsx` `home()`.
- Observed: Browse→Detail uses `pushState`. In-app Back from Detail uses `replaceState`, so history becomes [Home, Browse, Browse]. Home's Back and the Random Back behave the same way ([Home, Home]).
- Why it matters: after tapping the in-app Back, the browser Back button needs one extra press that changes nothing visible. Minor, and not in the stated contract.
- Evidence: static reading of `addressEverydayMeals` (push) against `close()` / `leaveEverydayMeals` (replace). Not reproduced in a browser.
- Smallest fix: call `history.back()` when the entry was pushed in this session; keep `replaceState` for direct-entry URLs.
- Regression risk: medium. This touches the navigation that the Home/Random tests pin (they dispatch synthetic `popstate`). Do it only if browser QA confirms the annoyance.
- Tests: Browse→Detail→Back→browser-Back lands on Home; direct entry still falls back to Browse.

### P2-3 Detail hero image is not decorative, so the name is read twice
- Files: `src/everyday-meal-image.tsx`; `src/everyday-meal-detail.tsx` (`<h1>` next to the hero).
- Observed: the detail `<img alt>` equals the meal name, which is also the `<h1>`. A screen reader hears the name twice. The photo adds no information beyond the name.
- Smallest fix: `alt=""` for the detail variant, or a descriptive phrase.
- Regression risk: low, but `everyday-meal-images.test.tsx` asserts `image.alt === meal.nameTh` and would need updating.
- Tests: update that assertion.

### P2-4 `everyday-meals-ads` test runs close to the 5 s default timeout under load
- File: `src/everyday-meals-ads.test.tsx` (added in 42E).
- Observed: in the default full run, "Detail has the same single bottom recipe-detail ad…" took 4.78 s and "Browse uses the shared menu-feed cadence…" took 3.95 s (limit 5 s). Each renders the full App several times and unmounts/remounts roots. They did not fail in this run, but they are within about 0.2 s.
- Why it matters: it adds to the flake risk described below.
- Smallest fix: split into smaller tests, or reduce App re-renders. Raising timeouts or workers is a separate decision.
- Tests: n/a.

## P3 / future

- Heading levels: Browse cards use `<h3>` under an `<h1>` with no `<h2>`. This is shared with existing menu grids.
- Locale: Browse and Detail show Thai names, tips and notes in the English locale. The heading "Everyday Meals" is hardcoded. This looks like a Thai-first choice; confirm it is intended.
- Ads unmount and remount when Detail opens or closes (`adsEnabled={!mealId}`). Correct today (no hidden duplicates); a real ad network would re-request. Revisit only at ad-network integration.
- `src/everyday-meals-browse.css` declares `.everyday-meal-fallback` twice. The `:not(:has(.menu-item-image))` selector never excludes anything, because Everyday cards have no `.menu-item-image`. Both are harmless.
- Search is plain `toLocaleLowerCase().includes()` over the Thai and English names. There is no Unicode normalization or alias matching. Acceptable for 50 items.
- Nothing tests the image geometry (Browse 4:3 / cover; Detail 16:9 / max-height 360px). It is only guarded by approval. jsdom cannot compute layout, but a CSS-text assertion is possible.
- Home tests hardcode "17 ร้าน · 97 เมนู"; the UI derives these from data, so the tests will break when restaurant data grows. This is intentional but brittle.
- Detail hero has `aspect-ratio: 16/9` plus `max-height: 360px`. With a wide container the box is clamped and `object-fit: cover` crops. Needs a visual check (see the checklist).

## Test-suite stability (item 18)

Evidence gathered (8 logical cores; Vitest default workers is about cores−1):

| Run | Result | Slowest tests |
|---|---|---|
| Default full run (this audit) | 1 failed / 785 passed; 79.9 s | `restaurant-logo-35c` "Slice 37B.1…" **5.95 s** (timed out), `recipe-pick-app` 5.74 s, `shopping-app` 4.82 s, `everyday-meals-ads` 4.78 s |
| `--maxWorkers=2` full run | 786/786 passed; 84.7 s | `recipe-pick-app` 2.97 s, `restaurant-logo-35c` **1.62 s**, `shopping-app` 1.46 s |
| `restaurant-logo-35c` alone | 12/12 passed | — |

- The same test takes about 1.6 s with 2 workers and about 5.9 s with 7, so duration scales with CPU contention and not with test content.
- Wall time is almost identical (80 s vs 85 s), so the extra workers buy almost nothing. The suite is CPU-bound on full-App renders.
- The failing test moves between runs: `everyday-meals-home`, `shopping-app`, `restaurant-logo-35c` and `recipe-pick-app` were all seen over 4 s. Each passes alone. A single regression would not move around like that.
- No fake timers and no `waitFor` are used anywhere. Most tests render `<App />` synchronously with `act`, so there are no async-race risks. I found no cross-test global-state leakage (each file builds its own root and clears `localStorage`; the Everyday files restore mocks).
- Everyday Meals contribution: `everyday-meals-home.test.tsx` is 22 s as a file and `everyday-meals-ads.test.tsx` has two tests near 4–4.8 s. They are heavier than needed, but they are not the cause, and the failures landed in unrelated files.

Verdict: **D (CPU contention) with B as a contributing factor (many tests render the whole 208-recipe App).** Not an Everyday regression (A), no evidence of leakage (C). Evidence supports limiting workers (about 2–4) as a clean fix, since it costs no wall time. I did not implement it. I did not try other worker counts, so the best value is unmeasured.

## Accessibility (item 14)

A. Concrete static issues: P2-1, P2-3, and the heading-level jump (P3).

Verified in code:
- Cards, chips and the Back button are real `<button type="button">`.
- Chips have `aria-pressed` and sit in a labelled group.
- Options are native radios and checkboxes inside `<fieldset>` and `<legend>`.
- Controls are at least 44 px tall.
- `label:focus-within` gives a visible focus ring.
- The `<h1>` takes programmatic focus on Detail mount (`tabIndex=-1`).
- Browse restores focus to the opened card.
- The nutrition region is `aria-live` and `aria-atomic`.
- The ad is an `<aside>` with a label and no focusable descendants (tested).

B. Needs a browser or screen reader:
- Focus-ring appearance.
- `aria-live` verbosity when options change.
- Result-count `role="status"` chatter while typing.
- Tab order on Detail.

## Data / image / ad integrity (items 11, 12, 16)

- 50 meals, 50 unique WebPs, all paths resolve, all 800×800 (existing tests).
- Six pilot hashes plus the content hash excluding `image` are tested and pass.
- Nutrition logic is correct: only options carrying `kcal` override the base, add-ons add ranges, and semantic options never become numbers.
- `calculateNutritionWithAddOns` rejects duplicate and unassigned add-ons.
- `getRandomEverydayMeal` is uniform over the 50 entities with one interval per meal; options, add-ons, search and filters are not inputs.
- Detail is keyed by `meal.id`, so option and add-on state resets when the meal changes.
- Ads: Browse uses `AdFeed placement="menu-feed"` with cadence 8 (mobile) or 12 (desktop), none after the last card, and none while Detail is open; Detail has exactly one `recipe-detail` ad, and Random adds none. This matches the tests.
- Home counts derive from data.

## Leave alone

- The navigation split (`everyday-meals-navigation.ts` + `EverydayMealsView` state + App `popstate`). It works and is covered; only P2-2 is worth considering, and only after browser QA.
- The semantic-only nutrition model and the option/add-on calculators.
- The random helper.
- The `EverydayMealImage` component and its fallback.
- Reuse of `AdFeed` / `AdSlot` and the `adsEnabled` prop.
- The static data file and the `tags` curation.
- The hidden-but-mounted Browse, which preserves search/filter state.

## 42F-B browser checklist

Run at 360, 430, 768 and 1280 px.

1. **Home:** content pair then random pair; the random pair stacks to one column at ≤390 px; text is not clipped.
2. **Browse:** 2 columns at <560 px and 3 at ≥560 px; 4:3 crops are consistent; Thai names and "Soup/Dry kcal" lines don't overflow cards at 360 px.
3. **Search:** a Thai term and an English term; empty state and reset.
4. **Filters:** one chip active at a time; "light" includes suki; the count updates.
5. **Ads in Browse:** the first appears after 8 cards on mobile and after 12 on desktop, spans the full row, and the grid stays aligned.
6. **Browse→Detail:** hero crop (16:9, ≤360 px) at 1280 px; heading hierarchy; one ad at the bottom.
7. **Options and add-ons:** suki soup/dry changes kcal; chicken rice part and skin change tags only, with the semantic message; the egg add-on works (basil rice 450–650 → 600–800 with fried egg); controls wrap on one line.
8. **Semantic messaging:** the copy is readable and not too dense.
9. **Back:** returns to Browse with the same search/chip, focus and scroll position on the card; the browser Back button behaves sensibly (see P2-2).
10. **Random→Detail→Back:** lands on Home; no extra ad or delay.
11. **Direct URL + refresh:** `/?everyday-meals&everyday-meal=pork-suki` keeps its identity; Back falls back to Browse.
12. **Invalid ID:** `?everyday-meals&everyday-meal=bogus` shows "Meal not found" with a working Back.
13. **Image fallback:** block one asset in DevTools; the card and hero show the utensil icon.
14. **Keyboard/focus:** Tab through chips, cards, radios and checkboxes; visible focus ring on each; focus lands on the `<h1>` at Detail open.

## Final recommendation

**A. READY FOR 42F-B VISUAL QA.** There are no P0 or P1 findings. The default-run timeouts are CPU contention across unrelated files (C was not supported, B only partly), and they don't block product closure. The test-stability fix (fewer workers) and the P2 items can be decided after the browser pass.

## Verification (this audit)

- Focused Everyday and ad tests: 8 files, 177 tests passed.
- Default full run (once): 1 failed (`restaurant-logo-35c` 5 s timeout), 785 passed. That test passed alone (12/12).
- `--maxWorkers=2` full run: 50 files, 786 tests passed.
- `npx tsc --noEmit`: clean.
- `npm run build`: succeeds.
- `git diff --check`: no whitespace errors.

## 42F-B Browser QA / Closure

Date/pass: **2026-10-01, Slice 42F-B**. Preflight confirmed `main` at `d717e9c921cf68ff6b08e5927c658e71fe1e7687`; the only pre-existing Git status item was this intentional untracked report. The original 42F-A report above is preserved. No commit, push or deployment.

### Tooling and coverage

- Actual Codex in-app Chromium browser, controlled through `cua_repl`: screenshots, browser Back/reload, DOM/accessibility snapshots, Playwright locator interactions, keyboard input and read-only computed layout inspection. Vite ran locally at `http://127.0.0.1:5174` with `VITE_SHOW_AD_PROTOTYPE=true`. Temporary viewport overrides were reset and the QA tab/server closed afterward. A final mobile screenshot is outside the repository in the chat's visualization directory.
- Viewports: **360 × 800, 430 × 850/800, 768 × 900, 1280 × 900**. Home and Browse were reviewed at all four widths; mobile received detailed interaction testing. Both Thai and English UI were inspected. Tablet/desktop Details received visual checks, including the representative meals below.
- Home: Restaurant/Everyday entry pair and Random pair, labels/counts (17 restaurants, 97 restaurant menu items, 50 Everyday meals), wrapping, balance and touch targets. The random pair stacks at 360 and sits side by side at 430 and larger.
- Browse: all 50 cards inspected through scrolling screenshots at 430; images loaded 50/50. Two columns at 360/430, three at 768/1280, no document horizontal overflow. Names, kcal, tags, final row and full-width ads were readable and aligned. Browse image wrappers measured 4:3; images use cover. No identity-obscuring crop found.
- Searches: กะเพรา (3), สุกี้ (3), ข้าวต้ม (3), ก๋วยเตี๋ยว (6), ไก่ (12), หมู (26), English `suki` (3), a zero-result query, clearing and reset. Short results have no ad; the last result remains a card. Empty state and search/filter composition work.
- All discovery chips at both mobile widths: ทั้งหมด 50, ข้าว 29, เส้น 11, เบาๆ 9, โปรตีนสูง 10, ผักเยอะ 6. Exactly one discovery chip is active. Light + สุกี้ returns the three suki meals; wrapping does not overflow.
- Representative Details: สุกี้หมู, บะหมี่เกี๊ยวหมูแดง, ข้าวกะเพราหมูสับ, ข้าวมันไก่, ข้าวขาหมู, ข้าวไก่ย่าง, ส้มตำ + ไก่ย่าง + ข้าวเหนียว, ข้าวต้มปลา, and ก๋วยเตี๋ยวคั่วไก่ (no options/add-ons). Identity, serving/estimate copy, nutrition, tags, controls, tips and bottom ad were checked. Desktop hero uses the 16:9 rule capped at 360px; measured 680 × 360 with cover, a usable crop. Mobile hero retains 16:9.
- Suki repeatedly switches 220–350 ↔ 350–450 kcal and removes/restores light with dry/soup. Wonton soup/dry remains 350–500. Chicken part and skin stay independent at 500–650; skinless shows the semantic lower-energy explanation. Pork-leg skin is also semantic only. No numeric accumulation or invented adjustment.
- Basil-pork eggs: base 450–650 → fried 600–800 → both 670–870 → boiled 520–720 → base 450–650, with repeated toggles. Second add-on check: pork-leg + boiled egg gives 670–820. Mobile controls remain usable, and nutrition has `aria-live="polite"` / `aria-atomic="true"`.
- Navigation: both Back controls, retained search/chip/card focus, repeated Random direct Detail entry with defaults/no selected add-ons, direct URL + refresh, invalid-ID fallback, and Home from an open Detail. Random has one normal Detail ad and returns Home. Fresh direct/refresh entry falls back to Browse rather than traversing an unowned history entry.
- Keyboard: search, clear, chips, card activation, Detail heading focus, native radios and checkboxes; visible orange focus rings observed on search/clear/chips/cards/options/add-ons. Back remains a native button. Browser return focuses the originating card and makes it visible. Exact pixel scroll restoration is not an additional V1 contract; current card-focused return is acceptable.

### Browser-observed findings and 42F-A P2 disposition

**P0: none. P1: none. Three small P2 issues confirmed and fixed.**

1. **Card accessible name (confirmed):** browser accessibility snapshot originally named the card only `สุกี้หมู`, while the visible card contained both kcal ranges and tags. Removed the overriding `aria-label` so native button contents supply the name. Verified afterward: `สุกี้หมู น้ำ 220–350 kcal แห้ง 350–450 kcal โปรตีนสูง ผักเยอะ เบาๆ เมื่อน้ำ`; English UI includes Soup/Dry and English tags. Visible meal names remain Thai as in the approved UI; broader translation is deferred.
2. **Dead Back entry (confirmed):** Home → Browse → Detail → in-app Back → browser Back stayed on the identical Browse URL/screen; an extra press was needed. App-created history entries now carry origin/depth/entry markers. Detail Back traverses an entry opened by that mounted view; Home/Random return traverses the owned origin depth. Direct/refresh entries retain local replace-state fallback. Browser recheck: in-app Detail Back restores Browse/filter/card focus, then one browser Back reaches Home. Random and Home-from-Detail also return correctly. Added actual asynchronous history regression tests, including Forward.
3. **Hero alt (confirmed):** accessibility snapshot exposed the meal-named image immediately followed by the same H1. Detail photo now has empty alt; the image remains visually unchanged and is absent as a named image from the accessibility snapshot.
4. **Ad-test runtime (deferred as a product issue):** no browser/ad regression. Ad tests were changed only to await real history traversal. No timeout, worker configuration, cadence or ad strategy changes. The accepted two-worker verification is used below.

No CSS/style changes were justified: no clipping, broken columns, unusable options, material tag/kcal overflow or visual regression was found. P3 heading hierarchy, Thai-first copy, harmless CSS selectors, Home count brittleness and future ad-network remount behavior remain deferred.

### Exact changes

Production:
- `src/everyday-meals-navigation.ts`: mark app-created history entries and their origin/depth.
- `src/App.tsx`: traverse the owned Everyday origin when returning Home.
- `src/everyday-meals-view.tsx`: traverse Detail entries opened in this mount; retain direct-entry fallback.
- `src/everyday-meals-browse.tsx`: remove card accessible-name override.
- `src/everyday-meal-image.tsx`: decorative Detail alt.

Tests:
- `src/everyday-meals-home.test.tsx`: await actual Back traversal; add one-press browser Back/Forward and Home-from-Detail regressions.
- `src/everyday-meal-detail.test.tsx`: await traversal and update native card/decorative hero assertions.
- `src/everyday-meals-ads.test.tsx`: await navigation before asserting subsequent entry/ad behavior.
- `src/everyday-meals-browse.test.tsx`: assert native content naming without aria-label and preserved kcal.
- `src/everyday-meal-images.test.tsx`: assert decorative Detail alt across all 50 images.

### Ads, images and accessibility result

- Mobile feed ads after cards 8/16/24/32/40/48; desktop after 12/24/36/48. Every ad spans its entire grid. Final element is a meal card. No hidden Browse ads while Detail is active; exactly one normal bottom Detail ad; Random adds no special slot.
- All 50 approved image assets remain untouched. All loaded in the browser. Six pilot hashes, full catalog content hash, file/dimension integrity and error/missing-image fallbacks are covered by existing tests. Browser network-error simulation was not performed because this browser interface has no request-blocking control; fallback is not claimed as browser-tested.
- Accessibility DOM and keyboard checks passed after the two targeted fixes. No real screen-reader speech session was run; spoken live-region verbosity is not claimed as verified. DOM live-region semantics and focus behavior are verified.

### Verification and closure recommendation

- Focused behavioral rerun: 3 files / 86 tests passed after correcting the test helper to distinguish synchronous direct-entry fallback from asynchronous history traversal.
- Final broader targeted run: `node node_modules/vitest/vitest.mjs run everyday ad-slot random-meal recipe-pick restaurant-pick --maxWorkers=2` — **17 files / 281 tests passed**, 30.02s. Covers Everyday Meals, ads, Home/navigation/Random, image integrity and adjacent pick behavior.
- Final current-checkout full suite: `node node_modules/vitest/vitest.mjs run --maxWorkers=2 --exclude '**/.kilo/**'` — **50 files / 788 tests passed**, 63.00s (baseline 786 + two navigation regressions).
- Full-suite discovery caveat: an initial unrestricted two-worker command also discovered two pre-existing, git-ignored `.kilo/worktrees` checkouts and failed historical recipe tests there. That run was stopped. `git check-ignore .kilo/worktrees` confirms the ignored directory; the actual checkout has exactly 50 test files. The final command excludes those unrelated copies through CLI only; no worker/test configuration was changed.
- Intermediate runs: the first focused run exposed the helper waiting for a `popstate` that direct-entry fallback intentionally does not emit; corrected. A broader run while browser/typecheck activity continued had two Home timeouts, plus a new test's incorrect `.brand` selector; corrected to the existing `.logo`. With browser QA finished and that selector fixed, both the final targeted and full runs passed. No arbitrary timeouts or worker-setting changes. jsdom emits its existing `scrollTo`-not-implemented notices in adjacent suites.
- `npx tsc --noEmit`: **PASS**.
- `npm run build`: **PASS**, with the existing >500kB chunk advisory (953.78kB uncompressed application bundle). No bundle/config work added to closure.
- `git diff --check`: **PASS**, no whitespace errors. Git's CRLF notices are informational.
- No production catalog, image, nutrition, ad-policy, CSS, dependency or configuration changes. Report stays untracked for review, as requested.

**A. READY TO CLOSE EVERYDAY MEALS V1.** No P0/P1 or remaining closure-level issue was found; tested browser journeys, responsive layouts, ads, images, accessible DOM/focus and owned-history navigation pass. Stable current-checkout full suite, typecheck and build pass. Review this report and the working-tree diff before the separate closure commit.
