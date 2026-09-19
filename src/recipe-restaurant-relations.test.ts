import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'
import { restaurantMenuItems, restaurants } from './restaurants'
import { recipeRestaurantRelations, relatedMenuItemsForRecipe, relatedRecipesForMenuItem, validateRecipeRestaurantRelations } from './recipe-restaurant-relations'

describe('recipe-restaurant relation validation', () => {
  it('accepts the curated production relation set', () => {
    expect(validateRecipeRestaurantRelations(recipeRestaurantRelations, recipes, restaurantMenuItems)).toEqual([])
  })

  it('rejects a relation referencing an unknown recipeId', () => {
    const bad = [{ recipeId: 'no-such-recipe', restaurantMenuItemId: restaurantMenuItems[0].id, relationKind: 'similar-dish' as const }]
    expect(validateRecipeRestaurantRelations(bad, recipes, restaurantMenuItems)).toContain('Unknown recipeId: no-such-recipe')
  })

  it('rejects a relation referencing an unknown restaurantMenuItemId', () => {
    const bad = [{ recipeId: recipes[0].id, restaurantMenuItemId: 'no-such-item', relationKind: 'similar-dish' as const }]
    expect(validateRecipeRestaurantRelations(bad, recipes, restaurantMenuItems)).toContain('Unknown restaurantMenuItemId: no-such-item')
  })

  it('rejects a duplicate relation pair', () => {
    const pair = { recipeId: recipes[0].id, restaurantMenuItemId: restaurantMenuItems[0].id, relationKind: 'similar-dish' as const }
    const duplicated = [pair, { ...pair }]
    expect(validateRecipeRestaurantRelations(duplicated, recipes, restaurantMenuItems)).toContain(`Duplicate relation pair: ${pair.recipeId}::${pair.restaurantMenuItemId}`)
  })

  it('rejects an invalid relationKind', () => {
    const bad = [{ recipeId: recipes[0].id, restaurantMenuItemId: restaurantMenuItems[0].id, relationKind: 'suggested' as never }]
    expect(validateRecipeRestaurantRelations(bad, recipes, restaurantMenuItems)).toContain(`Invalid relationKind: ${recipes[0].id} -> ${restaurantMenuItems[0].id}`)
  })

  it('does not throw on a malformed relation array', () => {
    expect(() => validateRecipeRestaurantRelations('not-an-array' as never, recipes, restaurantMenuItems)).not.toThrow()
    expect(validateRecipeRestaurantRelations('not-an-array' as never, recipes, restaurantMenuItems)).toEqual(['Invalid relation array'])
  })

  it('keeps the curated set small and high-confidence (5-12 relations)', () => {
    expect(recipeRestaurantRelations.length).toBeGreaterThanOrEqual(5)
    expect(recipeRestaurantRelations.length).toBeLessThanOrEqual(12)
  })

  it('leaves the relation count and pairs exactly as Slice 28 shipped them — Slice 29 is image-only', () => {
    expect(recipeRestaurantRelations).toHaveLength(5)
    expect(recipeRestaurantRelations.map(relation => `${relation.recipeId}::${relation.restaurantMenuItemId}`).sort()).toEqual([
      'chicken-teriyaki-rice-bowl::fuji-chicken-teriyaki',
      'glass-noodle-seafood-salad::steak-and-more-yum-woon-sen',
      'grilled-chicken-caesar-salad::jones-caesar-chicken-salad',
      'grilled-mackerel-bowl::ootoya-grilled-mackerel',
      'japanese-shioyaki-salmon-sweet-potato::fuji-salmon-shioyaki',
    ])
  })
})

describe('relation lookups', () => {
  it('resolves the related menu item(s) and restaurant for a recipe that has a relation', () => {
    const relation = recipeRestaurantRelations[0]
    const entries = relatedMenuItemsForRecipe(relation.recipeId)
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].item.id).toBe(relation.restaurantMenuItemId)
    expect(entries[0].restaurant.id).toBe(entries[0].item.restaurantId)
  })

  it('resolves the related recipe(s) for a menu item that has a relation', () => {
    const relation = recipeRestaurantRelations[0]
    const relatedRecipes = relatedRecipesForMenuItem(relation.restaurantMenuItemId)
    expect(relatedRecipes.map(recipe => recipe.id)).toContain(relation.recipeId)
  })

  it('returns an empty array for a recipe with no curated relation', () => {
    const unrelated = recipes.find(recipe => !recipeRestaurantRelations.some(relation => relation.recipeId === recipe.id))
    expect(unrelated).toBeTruthy()
    expect(relatedMenuItemsForRecipe(unrelated!.id)).toEqual([])
  })

  it('returns an empty array for a menu item with no curated relation', () => {
    const unrelated = restaurantMenuItems.find(item => !recipeRestaurantRelations.some(relation => relation.restaurantMenuItemId === item.id))
    expect(unrelated).toBeTruthy()
    expect(relatedRecipesForMenuItem(unrelated!.id)).toEqual([])
  })

  it('every curated relation resolves to a real, correctly-linked restaurant', () => {
    for (const relation of recipeRestaurantRelations) {
      const item = restaurantMenuItems.find(candidate => candidate.id === relation.restaurantMenuItemId)
      expect(item).toBeTruthy()
      const restaurant = restaurants.find(candidate => candidate.id === item!.restaurantId)
      expect(restaurant).toBeTruthy()
    }
  })
})
