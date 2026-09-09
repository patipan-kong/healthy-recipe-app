import { describe, expect, it } from 'vitest'
import { chooseRandom, filterRecipes, recipes, searchRecipes, validateRecipes } from './recipes'
import { loadFavorites, saveFavorites, toggleFavorite } from './favorites'
import { normalizeFavorites } from './App'

describe('recipe filtering', () => {
  it('uses AND semantics across category, nutrition, and tags', () => {
    const results = filterRecipes(recipes, { category: 'High protein', maxKcal: 430, minProtein: 30, tags: ['Meal prep'] })
    expect(results.map(recipe => recipe.id)).toEqual(['herb-grilled-chicken', 'grilled-mackerel-bowl'])
  })
  it('applies numeric nutrition limits including sodium', () => {
    const results = filterRecipes(recipes, { category: 'Thai favorites', maxKcal: 250, minProtein: 24, maxCarbs: 15, maxFat: 12, maxSodium: 650, tags: [] })
    expect(results.map(recipe => recipe.id)).toEqual(['tofu-mince-soup'])
  })
  it('returns an empty result gracefully when nothing fits', () => expect(filterRecipes(recipes, { category: '', maxKcal: 20, tags: [] })).toEqual([]))
  it('does not treat unknown sodium as zero under an active sodium limit', () => {
    const unknownSodium = { ...recipes[0], nutrition: { ...recipes[0].nutrition, sodium: undefined } }
    expect(filterRecipes([unknownSodium], { category: '', maxSodium: 0, tags: [] })).toEqual([])
  })
})

describe('recipe search', () => {
  it('matches ingredient names and normalizes surrounding whitespace', () => {
    expect(searchRecipes(recipes, '  garlic  ').map(recipe => recipe.id)).toEqual(['tofu-mince-soup', 'herb-grilled-chicken', 'steamed-lime-seabass', 'broccoli-prawn-stirfry'])
  })
  it('returns every recipe for a whitespace-only query', () => expect(searchRecipes(recipes, '   ')).toHaveLength(recipes.length))
})

describe('random recipes', () => {
  it('selects only from the provided filtered candidates and avoids the prior item', () => {
    const candidates = recipes.filter(recipe => recipe.tags.includes('Meal prep'))
    const result = chooseRandom(candidates, candidates[0].id, () => 0)
    expect(candidates.map(recipe => recipe.id)).toContain(result?.id)
    expect(result?.id).not.toBe(candidates[0].id)
  })
  it('returns undefined when no candidate exists', () => expect(chooseRandom([])).toBeUndefined())
})

describe('favorites persistence', () => {
  it('deduplicates and restores favorite ids', () => {
    let raw: string | null = null
    const store = { getItem: () => raw, setItem: (_: string, value: string) => { raw = value } }
    const updated = toggleFavorite(toggleFavorite([], 'tom-yum-prawns'), 'tom-yum-prawns')
    expect(updated).toEqual([])
    saveFavorites(['tom-yum-prawns', 'tom-yum-prawns'], store)
    expect(loadFavorites(store)).toEqual(['tom-yum-prawns'])
  })
  it('handles malformed reads, unavailable storage, and failed writes safely', () => {
    expect(loadFavorites({ getItem: () => '{bad json' })).toEqual([])
    expect(loadFavorites(undefined)).toEqual([])
    expect(saveFavorites(['tom-yum-prawns'], { setItem: () => { throw new Error('quota exceeded') } })).toBe(false)
  })
  it('removes duplicate and unknown favorite ids before displaying a count', () => {
    expect(normalizeFavorites(['tom-yum-prawns', 'tom-yum-prawns', 'unknown-id'])).toEqual(['tom-yum-prawns'])
  })
})

describe('recipe data validation', () => {
  it('accepts the curated recipe dataset', () => expect(validateRecipes(recipes)).toEqual([]))
  it('rejects non-finite nutrition and missing required recipe content', () => {
    const nonFinite = { ...recipes[0], nutrition: { ...recipes[0].nutrition, kcal: Number.NaN } }
    const incomplete = { ...recipes[1], id: 'incomplete', englishName: ' ', ingredients: [], instructions: [], servings: 0 }
    expect(validateRecipes([nonFinite, incomplete])).toEqual(expect.arrayContaining(['Invalid nutrition: tom-yum-prawns', 'Missing required content: incomplete', 'Invalid timing or servings: incomplete']))
  })
  it('returns validation errors instead of throwing for a missing required name', () => {
    const missingName = { ...recipes[0], name: undefined as unknown as string }
    expect(() => validateRecipes([missingName])).not.toThrow()
    expect(validateRecipes([missingName])).toContain('Missing required content: tom-yum-prawns')
  })
})
