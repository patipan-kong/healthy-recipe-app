# Everyday Meals — Slice 42A

The catalog is a separate top-level content type with exactly 50 complete meals.
The slice specification supplies locked GoodFood V1 kcal/protein estimates and
curated tags. Tags are not calculated from nutrition. All estimates use medium
confidence: restaurant portions and preparation vary. Suki's enclosing range
comes solely from its supplied soup/dry ranges; soup alone carries the light tag.

Types live in `src/everyday-meal-types.ts`, data in `src/everyday-meal-data.ts`,
the source registry in `src/everyday-meal-sources.ts`, and pure selectors and
add-on calculation in `src/everyday-meals.ts`. Everyday-specific source and
confidence type names avoid collisions with existing restaurant nutrition types.
The conceptual Thai/English fields are retained because options/tips in this
slice provide Thai copy only; existing restaurant/recipe types are unchanged.

## Provenance gaps

No responsible per-meal mapping was established for **all 50 meals**, nor for
**boiled-egg and fried-egg**. Their optional sourceIds are deliberately omitted:
absence means mapping is pending and is valid, not a claim of source support. The prompt
provides real reference URLs but no per-meal evidence table. No source-specific
numeric observations are recorded, and no web research was performed.
The registry is empty. The supplied Siriraj PDF and Thai Food Composition
Database URLs were removed from runtime metadata because neither has a mapped
consumer or verified observation in this slice. The empty typed registry retains
the required source-reference contract, with tests checking every present ID
resolves. Add entries only alongside a defensible mapping. Broader agency
homepages are also omitted. Optional `accessedAt` records an actual access date
only when known; no null placeholders, access dates, or observations are fabricated.

An eventual verified observation may support an estimate, but must remain
distinct from GoodFood's normalized display range. Registry membership alone
must never be displayed as verified evidence for a meal.

Egg energies are rounded product estimates (~70 and ~150 kcal), represented as
point ranges for arithmetic, not laboratory precision. No egg macro estimates
were supplied. Combined macro totals are omitted when any selected add-on lacks
that macro, rather than treating missing values as zero. Calculation copies
nutrition, sums range endpoints, appends the serving additions, and rejects
unknown, unavailable, or duplicate selections. Each ID selects one egg.
Meal options are never applied implicitly by the add-on helper; semantic skin
removal effects have no invented kcal adjustment.

Selectors return catalog entities following the existing repository convention;
array-returning selectors produce a fresh array. Filtering uses base curated
tags only. Random selection uses one equal interval per entity with an injected
random function returning values in [0, 1), matching existing random helpers.
There is no UI integration in this slice.
