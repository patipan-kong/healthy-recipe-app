import { describe, expect, it } from 'vitest'
import { chooseRandom, recipes } from './recipes'
import { explorePresetFilters, explorePresetIds, filterRestaurantMenuItems, matchingExplorePresetId, restaurantMenuItems, restaurants, searchRestaurantMenuItems, validateRestaurantMenuItems, validateRestaurants } from './restaurants'
import type { Restaurant, RestaurantMenuItem } from './types'
import { loadRestaurantMenuFavorites, saveRestaurantMenuFavorites, toggleRestaurantMenuFavorite } from './restaurant-menu-favorites'
import { normalizeFavorites, normalizeRestaurantMenuFavorites } from './App'

describe('restaurant validation', () => {
  it('accepts the fixture restaurants and menu items', () => {
    expect(validateRestaurants(restaurants)).toEqual([])
    expect(validateRestaurantMenuItems(restaurantMenuItems, restaurants)).toEqual([])
  })

  it('has real restaurant brands with a small, curated per-restaurant item count', () => {
    expect(restaurants.length).toBeGreaterThanOrEqual(13)
    expect(restaurantMenuItems.length).toBeGreaterThanOrEqual(80)
    expect(restaurantMenuItems.length).toBeLessThanOrEqual(105)
    for (const restaurant of restaurants) {
      const count = restaurantMenuItems.filter(item => item.restaurantId === restaurant.id).length
      expect(count).toBeGreaterThanOrEqual(5)
      expect(count).toBeLessThanOrEqual(8)
    }
  })

  it('rejects a duplicate restaurant id', () => {
    const duplicate = [restaurants[0], { ...restaurants[1], id: restaurants[0].id }]
    expect(validateRestaurants(duplicate)).toContain(`Duplicate restaurant id: ${restaurants[0].id}`)
  })

  it('rejects a duplicate menu item id', () => {
    const duplicate = [restaurantMenuItems[0], { ...restaurantMenuItems[1], id: restaurantMenuItems[0].id }]
    expect(validateRestaurantMenuItems(duplicate, restaurants)).toContain(`Duplicate menu item id: ${restaurantMenuItems[0].id}`)
  })

  it('rejects a menu item referencing an unknown restaurantId', () => {
    const orphan = { ...restaurantMenuItems[0], id: 'orphan-item', restaurantId: 'no-such-restaurant' }
    expect(validateRestaurantMenuItems([orphan], restaurants)).toContain('Unknown restaurantId: orphan-item')
  })

  it('rejects a missing or invalid bilingual restaurant name', () => {
    const missingThai = { ...restaurants[0], name: { ...restaurants[0].name, th: ' ' } }
    const missingEnglish = { ...restaurants[0], name: { ...restaurants[0].name, en: '' } }
    const missingName = { ...restaurants[0], name: undefined as never }
    expect(validateRestaurants([missingThai])).toContain(`Missing restaurant name: ${restaurants[0].id}`)
    expect(validateRestaurants([missingEnglish])).toContain(`Missing restaurant name: ${restaurants[0].id}`)
    expect(() => validateRestaurants([missingName])).not.toThrow()
    expect(validateRestaurants([missingName])).toContain(`Missing restaurant name: ${restaurants[0].id}`)
  })

  it('rejects a missing or invalid bilingual menu item name', () => {
    const missingThai = { ...restaurantMenuItems[0], name: { ...restaurantMenuItems[0].name, th: ' ' } }
    const missingEnglish = { ...restaurantMenuItems[0], name: { ...restaurantMenuItems[0].name, en: '' } }
    expect(validateRestaurantMenuItems([missingThai], restaurants)).toContain(`Missing menu item name: ${restaurantMenuItems[0].id}`)
    expect(validateRestaurantMenuItems([missingEnglish], restaurants)).toContain(`Missing menu item name: ${restaurantMenuItems[0].id}`)
  })

  it('rejects an invalid or unknown menu category', () => {
    const invalidCategory = { ...restaurantMenuItems[0], category: 'Dessert' as never }
    expect(validateRestaurantMenuItems([invalidCategory], restaurants)).toContain(`Invalid category: ${restaurantMenuItems[0].id}`)
  })

  it('rejects non-finite or negative nutrition values', () => {
    const nonFinite = { ...restaurantMenuItems[0], nutrition: { ...restaurantMenuItems[0].nutrition, kcal: Number.NaN } }
    const negative = { ...restaurantMenuItems[0], nutrition: { ...restaurantMenuItems[0].nutrition, protein: -5 } }
    expect(validateRestaurantMenuItems([nonFinite], restaurants)).toContain(`Invalid nutrition: ${restaurantMenuItems[0].id}`)
    expect(validateRestaurantMenuItems([negative], restaurants)).toContain(`Invalid nutrition: ${restaurantMenuItems[0].id}`)
  })

  it('rejects nutrition whose kcal is implausible against its own macros', () => {
    const implausible = { ...restaurantMenuItems[0], nutrition: { ...restaurantMenuItems[0].nutrition, kcal: 2000 } }
    expect(validateRestaurantMenuItems([implausible], restaurants)).toContain(`Nutrition sanity range: ${restaurantMenuItems[0].id}`)
  })

  it('rejects a missing or invalid nutritionSource.confidence', () => {
    const missingSource = { ...restaurantMenuItems[0], nutritionSource: undefined as never }
    const invalidConfidence = { ...restaurantMenuItems[0], nutritionSource: { confidence: 'guessed' as never } }
    expect(validateRestaurantMenuItems([missingSource], restaurants)).toContain(`Invalid nutrition source: ${restaurantMenuItems[0].id}`)
    expect(validateRestaurantMenuItems([invalidConfidence], restaurants)).toContain(`Invalid nutrition source: ${restaurantMenuItems[0].id}`)
  })

  it('accepts every documented confidence level', () => {
    for (const confidence of ['official', 'label', 'curated', 'estimated'] as const) {
      const item = { ...restaurantMenuItems[0], nutritionSource: { confidence } }
      expect(validateRestaurantMenuItems([item], restaurants)).toEqual([])
    }
  })

  it('rejects a missing or non-array tags field', () => {
    const missingTags = { ...restaurantMenuItems[0], tags: undefined as never }
    expect(validateRestaurantMenuItems([missingTags], restaurants)).toContain(`Invalid tags: ${restaurantMenuItems[0].id}`)
  })

  it('does not throw on a malformed items array', () => {
    expect(() => validateRestaurants('not-an-array' as never)).not.toThrow()
    expect(validateRestaurants('not-an-array' as never)).toEqual(['Invalid restaurant array'])
    expect(() => validateRestaurantMenuItems('not-an-array' as never, restaurants)).not.toThrow()
    expect(validateRestaurantMenuItems('not-an-array' as never, restaurants)).toEqual(['Invalid restaurant menu item array'])
  })
})

describe('filterRestaurantMenuItems', () => {
  it('returns every item when no filters are active', () => {
    expect(filterRestaurantMenuItems(restaurantMenuItems, {})).toEqual(restaurantMenuItems)
  })

  it('keeps only items at or under maxKcal', () => {
    const result = filterRestaurantMenuItems(restaurantMenuItems, { maxKcal: 400 })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(item => item.nutrition.kcal <= 400)).toBe(true)
    expect(result.length).toBeLessThan(restaurantMenuItems.length)
  })

  it('keeps only items at or above minProtein', () => {
    const result = filterRestaurantMenuItems(restaurantMenuItems, { minProtein: 30 })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(item => item.nutrition.protein >= 30)).toBe(true)
  })

  it('applies maxCarbs and maxFat as upper bounds', () => {
    const result = filterRestaurantMenuItems(restaurantMenuItems, { maxCarbs: 20, maxFat: 15 })
    expect(result.every(item => item.nutrition.carbs <= 20 && item.nutrition.fat <= 15)).toBe(true)
  })

  it('combines active constraints with AND semantics', () => {
    const result = filterRestaurantMenuItems(restaurantMenuItems, { maxKcal: 400, minProtein: 30 })
    expect(result.every(item => item.nutrition.kcal <= 400 && item.nutrition.protein >= 30)).toBe(true)
    const kcalOnly = filterRestaurantMenuItems(restaurantMenuItems, { maxKcal: 400 })
    expect(result.length).toBeLessThanOrEqual(kcalOnly.length)
  })

  it('excludes an item with unknown sodium under a maxSodium constraint instead of treating it as zero', () => {
    const unknownSodiumItem = { ...restaurantMenuItems[0], id: 'unknown-sodium-item', nutrition: { ...restaurantMenuItems[0].nutrition, sodium: undefined } }
    expect(unknownSodiumItem.nutrition.sodium).toBeUndefined()
    expect(filterRestaurantMenuItems([unknownSodiumItem], { maxSodium: 100000 })).toEqual([])
    expect(filterRestaurantMenuItems([unknownSodiumItem], {})).toEqual([unknownSodiumItem])
  })

  it('keeps items with known sodium at or under maxSodium', () => {
    const knownSodiumItem = { ...restaurantMenuItems[0], id: 'known-sodium-item', nutrition: { ...restaurantMenuItems[0].nutrition, sodium: 500 } }
    expect(filterRestaurantMenuItems([knownSodiumItem], { maxSodium: 500 })).toEqual([knownSodiumItem])
    expect(filterRestaurantMenuItems([knownSodiumItem], { maxSodium: 499 })).toEqual([])
  })
})

describe('chooseRandom reused for restaurant menu items', () => {
  it('selects only from the provided candidates and avoids the prior item without weakening RestaurantMenuItem typing', () => {
    const candidates = restaurantMenuItems.filter(item => item.restaurantId === restaurantMenuItems[0].restaurantId)
    const result = chooseRandom(candidates, candidates[0].id, () => 0)
    expect(candidates.map(item => item.id)).toContain(result?.id)
    expect(result?.id).not.toBe(candidates[0].id)
    expect(result?.nutrition.kcal).toEqual(expect.any(Number))
  })
  it('returns undefined when no restaurant menu item candidate exists', () => expect(chooseRandom<typeof restaurantMenuItems[number]>([])).toBeUndefined())
})

describe('chooseRandom reused for restaurants', () => {
  it('selects only from the production restaurant dataset', () => {
    const result = chooseRandom(restaurants, undefined, () => 0.99)
    expect(result).toBe(restaurants[restaurants.length - 1])
  })

  it('avoids the previous restaurant when more than one candidate exists', () => {
    const result = chooseRandom(restaurants, restaurants[0].id, () => 0)
    expect(result).toBe(restaurants[1])
    expect(result?.id).not.toBe(restaurants[0].id)
  })

  it('returns the only restaurant safely and returns undefined for an empty array', () => {
    expect(chooseRandom([restaurants[0]], restaurants[0].id, () => 0.99)).toBe(restaurants[0])
    expect(chooseRandom<Restaurant>([])).toBeUndefined()
  })
})

describe('Explore quick-goal presets', () => {
  it('maps High Protein to max 700 kcal / min 30g protein', () => {
    expect(explorePresetFilters['high-protein']).toEqual({ maxKcal: 700, minProtein: 30 })
  })

  it('maps Light Meal to max 450 kcal only', () => {
    expect(explorePresetFilters['light-meal']).toEqual({ maxKcal: 450 })
  })

  it('maps Balanced to max 650 kcal / min 25g protein / max 25g fat', () => {
    expect(explorePresetFilters.balanced).toEqual({ maxKcal: 650, minProtein: 25, maxFat: 25 })
  })

  it('never sets sodium in any preset, since pilot sodium coverage is incomplete', () => {
    for (const id of explorePresetIds) expect(explorePresetFilters[id].maxSodium).toBeUndefined()
  })

  it('matches a preset id only when filters exactly equal that preset\'s field set', () => {
    expect(matchingExplorePresetId({ maxKcal: 700, minProtein: 30 })).toBe('high-protein')
    expect(matchingExplorePresetId({ maxKcal: 450 })).toBe('light-meal')
    expect(matchingExplorePresetId({ maxKcal: 650, minProtein: 25, maxFat: 25 })).toBe('balanced')
  })

  it('does not match a preset once any field is manually changed or an extra field is added', () => {
    expect(matchingExplorePresetId({ maxKcal: 600, minProtein: 30 })).toBeUndefined()
    expect(matchingExplorePresetId({ maxKcal: 700, minProtein: 30, maxFat: 20 })).toBeUndefined()
    expect(matchingExplorePresetId({})).toBeUndefined()
  })
})

describe('restaurant menu favorites persistence', () => {
  it('loads an empty array when no storage value is present', () => {
    expect(loadRestaurantMenuFavorites({ getItem: () => null })).toEqual([])
  })

  it('loads valid stored ids correctly', () => {
    let raw: string | null = null
    const store = { getItem: () => raw, setItem: (_: string, value: string) => { raw = value } }
    saveRestaurantMenuFavorites([restaurantMenuItems[0].id, restaurantMenuItems[1].id], store)
    expect(loadRestaurantMenuFavorites(store)).toEqual([restaurantMenuItems[0].id, restaurantMenuItems[1].id])
  })

  it('fails safely on malformed JSON', () => {
    expect(loadRestaurantMenuFavorites({ getItem: () => '{bad json' })).toEqual([])
  })

  it('fails safely on non-array JSON', () => {
    expect(loadRestaurantMenuFavorites({ getItem: () => '{"a":1}' })).toEqual([])
  })

  it('adds an id via toggle', () => {
    expect(toggleRestaurantMenuFavorite([], restaurantMenuItems[0].id)).toEqual([restaurantMenuItems[0].id])
  })

  it('removes an existing id via toggle', () => {
    expect(toggleRestaurantMenuFavorite([restaurantMenuItems[0].id], restaurantMenuItems[0].id)).toEqual([])
  })

  it('does not create duplicates on repeated toggles', () => {
    const toggledTwice = toggleRestaurantMenuFavorite(toggleRestaurantMenuFavorite([], restaurantMenuItems[0].id), restaurantMenuItems[0].id)
    expect(toggledTwice).toEqual([])
    let raw: string | null = null
    const store = { getItem: () => raw, setItem: (_: string, value: string) => { raw = value } }
    saveRestaurantMenuFavorites([restaurantMenuItems[0].id, restaurantMenuItems[0].id], store)
    expect(loadRestaurantMenuFavorites(store)).toEqual([restaurantMenuItems[0].id])
  })

  it('saves successfully with writable storage', () => {
    let raw: string | null = null
    const store = { getItem: () => raw, setItem: (_: string, value: string) => { raw = value } }
    expect(saveRestaurantMenuFavorites([restaurantMenuItems[0].id], store)).toBe(true)
    expect(raw).toEqual(JSON.stringify([restaurantMenuItems[0].id]))
  })

  it('returns false on a failed write without throwing', () => {
    expect(() => saveRestaurantMenuFavorites([restaurantMenuItems[0].id], { setItem: () => { throw new Error('quota exceeded') } })).not.toThrow()
    expect(saveRestaurantMenuFavorites([restaurantMenuItems[0].id], { setItem: () => { throw new Error('quota exceeded') } })).toBe(false)
  })

  it('treats storage read exceptions as an empty state', () => {
    expect(loadRestaurantMenuFavorites({ getItem: () => { throw new Error('blocked') } })).toEqual([])
  })
})

describe('restaurant menu favorites normalization', () => {
  it('keeps valid production restaurant menu ids and drops stale ones', () => {
    const validId = restaurantMenuItems[0].id
    expect(normalizeRestaurantMenuFavorites([validId, 'stale-nonexistent-id'])).toEqual([validId])
  })

  it('deduplicates ids', () => {
    const validId = restaurantMenuItems[0].id
    expect(normalizeRestaurantMenuFavorites([validId, validId])).toEqual([validId])
  })

  it('keeps recipe and restaurant menu favorite normalization independent', () => {
    expect(normalizeRestaurantMenuFavorites([recipes[0].id])).toEqual([])
    expect(normalizeFavorites([restaurantMenuItems[0].id])).toEqual([])
  })
})

describe('restaurant menu search', () => {
  const fixtureRestaurants: Restaurant[] = [
    { id: 'r1', name: { th: 'ร้านหนึ่ง', en: 'Restaurant One' } },
    { id: 'r2', name: { th: 'ร้านสอง', en: 'Restaurant Two' } },
  ]
  const fixtureItems: RestaurantMenuItem[] = [
    { id: 'a', restaurantId: 'r1', name: { th: 'ผัดไทย', en: 'Pad Thai' }, category: 'Rice & noodles', nutrition: { kcal: 1, protein: 1, carbs: 1, fat: 1 }, nutritionSource: { confidence: 'estimated' }, tags: [] },
    { id: 'b', restaurantId: 'r2', name: { th: 'สลัดไก่', en: 'Chicken Salad' }, category: 'Salad', nutrition: { kcal: 1, protein: 1, carbs: 1, fat: 1 }, nutritionSource: { confidence: 'estimated' }, tags: [] },
    { id: 'c', restaurantId: 'missing-restaurant', name: { th: 'ไม่ทราบร้าน', en: 'Unknown Restaurant Item' }, category: 'Soup', nutrition: { kcal: 1, protein: 1, carbs: 1, fat: 1 }, nutritionSource: { confidence: 'estimated' }, tags: [] },
  ]

  it('returns all items for an empty query', () => {
    expect(searchRestaurantMenuItems(restaurantMenuItems, restaurants, '')).toEqual(restaurantMenuItems)
  })

  it('returns all items for a whitespace-only query', () => {
    expect(searchRestaurantMenuItems(restaurantMenuItems, restaurants, '   ')).toEqual(restaurantMenuItems)
  })

  it('matches an English menu-item name', () => {
    const result = searchRestaurantMenuItems(restaurantMenuItems, restaurants, 'mackerel')
    expect(result.map(item => item.id)).toContain('ootoya-grilled-mackerel')
  })

  it('matches a Thai menu-item name', () => {
    const result = searchRestaurantMenuItems(restaurantMenuItems, restaurants, 'ปลาซาบะ')
    expect(result.map(item => item.id)).toContain('ootoya-grilled-mackerel')
  })

  it('matches an English restaurant name regardless of item name', () => {
    const result = searchRestaurantMenuItems(restaurantMenuItems, restaurants, 'ootoya')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(item => item.restaurantId === 'ootoya-thailand')).toBe(true)
  })

  it('matches a Thai restaurant name regardless of item name', () => {
    const result = searchRestaurantMenuItems(restaurantMenuItems, restaurants, 'โอโตยะ')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(item => item.restaurantId === 'ootoya-thailand')).toBe(true)
  })

  it('matches case-insensitively for Latin text', () => {
    const result = searchRestaurantMenuItems(restaurantMenuItems, restaurants, 'MACKEREL')
    expect(result.map(item => item.id)).toContain('ootoya-grilled-mackerel')
  })

  it('matches on a substring, not just a full word', () => {
    const result = searchRestaurantMenuItems(fixtureItems, fixtureRestaurants, 'thai')
    expect(result.map(item => item.id)).toEqual(['a'])
  })

  it('returns an empty array for a non-matching query', () => {
    expect(searchRestaurantMenuItems(restaurantMenuItems, restaurants, 'zzzznonexistentquery')).toEqual([])
  })

  it('does not crash when an item has no resolvable restaurant', () => {
    expect(() => searchRestaurantMenuItems(fixtureItems, fixtureRestaurants, 'unknown restaurant')).not.toThrow()
    expect(searchRestaurantMenuItems(fixtureItems, fixtureRestaurants, 'unknown restaurant').map(item => item.id)).toEqual(['c'])
  })

  it('preserves input ordering when multiple items match', () => {
    const result = searchRestaurantMenuItems(fixtureItems, fixtureRestaurants, 'restaurant')
    expect(result.map(item => item.id)).toEqual(['a', 'b', 'c'])
  })

  it('does not mutate the input arrays', () => {
    const itemsCopy = JSON.parse(JSON.stringify(fixtureItems))
    const restaurantsCopy = JSON.parse(JSON.stringify(fixtureRestaurants))
    searchRestaurantMenuItems(fixtureItems, fixtureRestaurants, 'salad')
    expect(fixtureItems).toEqual(itemsCopy)
    expect(fixtureRestaurants).toEqual(restaurantsCopy)
  })
})
