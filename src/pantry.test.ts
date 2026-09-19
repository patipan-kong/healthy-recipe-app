import { describe, expect, it } from 'vitest'
import { canonicalIngredientIdForItem, canonicalIngredientIds, canonicalIngredients, countRecipesByIngredient, filterRecipesByIngredient, isExcludedPantryIngredient, isShoppingOnlyIngredient, loadPantrySelection, pantryStorageKey, rankRecipesByPantry, savePantrySelection, togglePantryIngredient } from './pantry'
import { recipes } from './recipes'

describe('pantry ingredient model', () => {
  it('audits every recipe ingredient against the canonical vocabulary', () => {
    const entries = recipes.flatMap(recipe => recipe.ingredients)
    const unmapped = [...new Set(entries.filter(ingredient => !ingredient.ingredientId).map(ingredient => ingredient.item.en))]
    expect(entries).toHaveLength(1766)
    expect(entries.filter(ingredient => ingredient.ingredientId)).toHaveLength(1532)
    expect(unmapped.every(item => isExcludedPantryIngredient(item) || isShoppingOnlyIngredient(item))).toBe(true)
    expect(canonicalIngredients.length).toBeGreaterThan(20)
    expect(new Set(canonicalIngredients.map(ingredient => ingredient.id)).size).toBe(canonicalIngredients.length)
    expect(canonicalIngredients.every(ingredient => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(ingredient.id))).toBe(true)
    expect(recipes.every(recipe => recipe.ingredients.every(ingredient => !ingredient.ingredientId || canonicalIngredientIds.has(ingredient.ingredientId)))).toBe(true)
  })

  it('derives counts and filters by canonical ingredient IDs', () => {
    const counts = countRecipesByIngredient(recipes)
    const cucumberRecipes = filterRecipesByIngredient(recipes, 'cucumber')
    expect(counts.cucumber).toBe(cucumberRecipes.length)
    expect(cucumberRecipes.length).toBeGreaterThan(0)
    expect(cucumberRecipes.every(recipe => recipe.ingredients.some(ingredient => ingredient.ingredientId === 'cucumber'))).toBe(true)
    expect(new Set(recipes.map(recipe => countRecipesByIngredient([recipe]).cucumber)).size).toBeGreaterThan(1)
  })

  it('ranks multiple selected ingredients by match count, percentage, then source order', () => {
    const ranked = rankRecipesByPantry(recipes, ['cucumber', 'brown-rice', 'chicken-breast'])
    expect(ranked.length).toBeGreaterThan(0)
    expect(ranked.every(match => match.matchCount > 0)).toBe(true)
    expect(ranked[0].matchCount).toBeGreaterThanOrEqual(ranked[1].matchCount)
    expect(ranked.some(match => match.matchCount === 3)).toBe(true)
    expect(ranked.some(match => match.matchCount > 0 && match.matchCount < 3)).toBe(true)
    expect(ranked.findIndex(match => match.matchCount === 3)).toBeLessThan(ranked.findIndex(match => match.matchCount < 3))
    const cucumberMatches = filterRecipesByIngredient(recipes, 'cucumber')
    const tied = rankRecipesByPantry([cucumberMatches[1], cucumberMatches[0]], ['cucumber'])
    expect(tied.slice(0, 2).map(match => match.recipe.id)).toEqual([cucumberMatches[1].id, cucumberMatches[0].id])
    expect(rankRecipesByPantry(recipes, [])).toEqual([])

    const recipeWithoutCucumber = recipes.find(recipe => !recipe.ingredients.some(ingredient => ingredient.ingredientId === 'cucumber'))
    expect(recipeWithoutCucumber).toBeDefined()
    expect(rankRecipesByPantry([recipeWithoutCucumber!], ['cucumber'])).toEqual([])
  })

  it('persists only valid IDs and supports clear/toggle', () => {
    let raw: string | null = JSON.stringify(['cucumber', 'stale-id', 'cucumber'])
    const store = { getItem: (key: string) => key === pantryStorageKey ? raw : null, setItem: (_key: string, value: string) => { raw = value } }
    expect(loadPantrySelection(store)).toEqual(['cucumber'])
    expect(togglePantryIngredient(['cucumber'], 'eggs')).toEqual(['cucumber', 'eggs'])
    expect(togglePantryIngredient(['cucumber', 'eggs'], 'cucumber')).toEqual(['eggs'])
    expect(savePantrySelection(['cucumber', 'stale-id'], store)).toBe(true)
    expect(loadPantrySelection(store)).toEqual(['cucumber'])
    expect(savePantrySelection([], store)).toBe(true)
    expect(loadPantrySelection(store)).toEqual([])
    expect(canonicalIngredientIdForItem('Ground black pepper')).toBeUndefined()
  })

  it('recognizes the R3 batch-1 canonical additions: konjac noodles and wakame', () => {
    const konjac = canonicalIngredients.find(ingredient => ingredient.id === 'konjac-noodles')
    const wakame = canonicalIngredients.find(ingredient => ingredient.id === 'wakame')
    expect(konjac).toMatchObject({ id: 'konjac-noodles', category: 'carbs', name: { th: 'บุกเส้น', en: 'Konjac noodles' } })
    expect(wakame).toMatchObject({ id: 'wakame', category: 'pantry', name: { th: 'สาหร่ายวากาเมะ', en: 'Wakame' } })
    expect(canonicalIngredientIdForItem('Konjac noodles, drained and rinsed')).toBe('konjac-noodles')
    expect(canonicalIngredientIdForItem('Wakame, dried')).toBe('wakame')
    expect(canonicalIngredientIdForItem('Konjac noodles')).toBe('konjac-noodles')
    expect(canonicalIngredientIdForItem('Wakame')).toBe('wakame')
    expect(canonicalIngredientIds.has('konjac-noodles')).toBe(true)
    expect(canonicalIngredientIds.has('wakame')).toBe(true)
  })
})
