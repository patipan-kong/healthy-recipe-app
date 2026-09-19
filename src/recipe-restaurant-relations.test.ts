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

  it('keeps the curated set small and high-confidence (5-23 relations)', () => {
    expect(recipeRestaurantRelations.length).toBeGreaterThanOrEqual(5)
    expect(recipeRestaurantRelations.length).toBeLessThanOrEqual(23)
  })

  it('leaves every prior relation pair intact and adds exactly the Slice 33 expansion on top', () => {
    expect(recipeRestaurantRelations).toHaveLength(23)
    expect(recipeRestaurantRelations.map(relation => `${relation.recipeId}::${relation.restaurantMenuItemId}`).sort()).toEqual([
      'baked-cod-lemon-herbs::santa-fe-dory-fish-steak',
      'chicken-green-curry-brown-rice::seven-eleven-green-curry-chicken',
      'chicken-larb-brown-rice::nittaya-larb-moo',
      'chicken-larb-brown-rice::zaab-eli-larb-moo',
      'chicken-oyakodon::ootoya-oyakodon',
      'chicken-teriyaki-rice-bowl::fuji-chicken-teriyaki',
      'chicken-vegetable-sukiyaki::seven-eleven-chicken-sukiyaki',
      'garlic-pepper-pork-fried-egg-rice::seven-eleven-garlic-pork-egg-rice',
      'glass-noodle-seafood-salad::steak-and-more-yum-woon-sen',
      'grilled-chicken-caesar-salad::jones-caesar-chicken-salad',
      'grilled-chicken-jaew::santa-fe-chicken-steak-jaew',
      'grilled-mackerel-bowl::ootoya-grilled-mackerel',
      'herb-grilled-chicken::nittaya-grilled-chicken-quarter',
      'herb-grilled-chicken::zaab-eli-grilled-chicken',
      'japanese-beef-gyudon::sukiya-gyudon-regular',
      'japanese-shioyaki-salmon-sweet-potato::fuji-salmon-shioyaki',
      'japanese-shioyaki-salmon-sweet-potato::fuji-salmon-shioyaki-brown-rice-set',
      'japanese-vegetable-curry-rice::sukiya-curry-rice-regular',
      'salmon-poke-bowl::salad-factory-salmon-sashimi-shoyu',
      'spicy-grilled-pork-salad::salad-factory-spicy-pork-tenderloin',
      'thai-papaya-salad::nittaya-som-tam-thai',
      'thai-papaya-salad::somtam-nua-papaya-salad-thai',
      'thai-papaya-salad::steak-and-more-som-tam',
    ])
  })

  it('uses only the current single relationKind for every relation, including the Slice 33 additions', () => {
    expect(new Set(recipeRestaurantRelations.map(relation => relation.relationKind))).toEqual(new Set(['similar-dish']))
  })

  it('has no duplicate recipe/menu-item pair anywhere in the curated set', () => {
    const pairs = recipeRestaurantRelations.map(relation => `${relation.recipeId}::${relation.restaurantMenuItemId}`)
    expect(new Set(pairs).size).toBe(pairs.length)
  })
})

describe('Slice 33: high-confidence relation expansion', () => {
  const sameDishEdges: Array<[string, string]> = [
    ['spicy-grilled-pork-salad', 'salad-factory-spicy-pork-tenderloin'],
    ['chicken-vegetable-sukiyaki', 'seven-eleven-chicken-sukiyaki'],
    ['chicken-green-curry-brown-rice', 'seven-eleven-green-curry-chicken'],
    ['grilled-chicken-jaew', 'santa-fe-chicken-steak-jaew'],
    ['herb-grilled-chicken', 'nittaya-grilled-chicken-quarter'],
    ['herb-grilled-chicken', 'zaab-eli-grilled-chicken'],
    ['japanese-shioyaki-salmon-sweet-potato', 'fuji-salmon-shioyaki-brown-rice-set'],
  ]
  const similarDishEdges: Array<[string, string]> = [
    ['salmon-poke-bowl', 'salad-factory-salmon-sashimi-shoyu'],
    ['baked-cod-lemon-herbs', 'santa-fe-dory-fish-steak'],
    ['chicken-larb-brown-rice', 'nittaya-larb-moo'],
    ['chicken-larb-brown-rice', 'zaab-eli-larb-moo'],
  ]

  it('implements exactly the 7 approved HIGH SAME_DISH edges, referentially valid both ways', () => {
    for (const [recipeId, menuItemId] of sameDishEdges) {
      expect(recipes.some(recipe => recipe.id === recipeId)).toBe(true)
      expect(restaurantMenuItems.some(item => item.id === menuItemId)).toBe(true)
      expect(recipeRestaurantRelations.some(relation => relation.recipeId === recipeId && relation.restaurantMenuItemId === menuItemId)).toBe(true)
      expect(relatedRecipesForMenuItem(menuItemId).map(recipe => recipe.id)).toContain(recipeId)
      expect(relatedMenuItemsForRecipe(recipeId).map(entry => entry.item.id)).toContain(menuItemId)
    }
  })

  it('implements exactly the 4 approved HIGH SIMILAR_DISH edges, referentially valid both ways', () => {
    for (const [recipeId, menuItemId] of similarDishEdges) {
      expect(recipes.some(recipe => recipe.id === recipeId)).toBe(true)
      expect(restaurantMenuItems.some(item => item.id === menuItemId)).toBe(true)
      expect(recipeRestaurantRelations.some(relation => relation.recipeId === recipeId && relation.restaurantMenuItemId === menuItemId)).toBe(true)
      expect(relatedRecipesForMenuItem(menuItemId).map(recipe => recipe.id)).toContain(recipeId)
      expect(relatedMenuItemsForRecipe(recipeId).map(entry => entry.item.id)).toContain(menuItemId)
    }
  })

  it('produces exactly 23 total relations, 23 covered restaurant items, and 18 covered recipes', () => {
    expect(recipeRestaurantRelations).toHaveLength(23)
    expect(new Set(recipeRestaurantRelations.map(relation => relation.restaurantMenuItemId)).size).toBe(23)
    expect(new Set(recipeRestaurantRelations.map(relation => relation.recipeId)).size).toBe(18)
  })

  it('gives no restaurant menu item more than one recipe relation', () => {
    const counts = new Map<string, number>()
    for (const relation of recipeRestaurantRelations) {
      counts.set(relation.restaurantMenuItemId, (counts.get(relation.restaurantMenuItemId) ?? 0) + 1)
    }
    for (const count of counts.values()) expect(count).toBe(1)
  })

  it('keeps the kai-yang grilled-chicken cluster to exactly the two approved restaurants, not every grilled-chicken item', () => {
    expect(relatedMenuItemsForRecipe('herb-grilled-chicken').map(entry => entry.item.id).sort()).toEqual([
      'nittaya-grilled-chicken-quarter',
      'zaab-eli-grilled-chicken',
    ])
    for (const excludedMenuItemId of [
      'ootoya-grilled-moromi-chicken',
      'santa-fe-grilled-chicken-pepper-steak',
      'jones-caribbean-chicken-steak',
      'steak-and-more-chicken-steak',
    ]) {
      expect(restaurantMenuItems.some(item => item.id === excludedMenuItemId)).toBe(true)
      expect(relatedRecipesForMenuItem(excludedMenuItemId)).toEqual([])
    }
  })

  it('keeps the pork-larb cluster to exactly the two approved restaurants, excluding the liver variant', () => {
    expect(relatedMenuItemsForRecipe('chicken-larb-brown-rice').map(entry => entry.item.id).sort()).toEqual([
      'nittaya-larb-moo',
      'zaab-eli-larb-moo',
    ])
    expect(restaurantMenuItems.some(item => item.id === 'somtam-nua-larb-moo')).toBe(true)
    expect(relatedRecipesForMenuItem('somtam-nua-larb-moo')).toEqual([])
  })

  it('leaves every Slice 32 Medium/Ambiguous candidate unrelated', () => {
    const excludedPairs: Array<[string, string]> = [
      ['salmon-teriyaki-bowl', 'ootoya-grilled-salmon-rice-bowl'],
      ['japanese-shioyaki-salmon-sweet-potato', 'santa-fe-salmon-steak'],
      ['salmon-poke-bowl', 'fuji-chirashi-sushi-don-set'],
      ['steamed-lime-seabass', 'santa-fe-seabass-steak'],
      ['chicken-tom-yum-mushrooms', 'nittaya-tom-saep-grilled-chicken-soup'],
      ['grilled-mackerel-bowl', 'ootoya-shima-hokke-grilled'],
      ['grilled-chicken-caesar-salad', 'steak-and-more-caesar-salad'],
      ['chicken-larb-brown-rice', 'thongsmith-spicy-shredded-chicken-dry'],
      ['grilled-chicken-jaew', 'thongsmith-spicy-shredded-chicken-dry'],
    ]
    for (const [recipeId, menuItemId] of excludedPairs) {
      expect(recipeRestaurantRelations.some(relation => relation.recipeId === recipeId && relation.restaurantMenuItemId === menuItemId)).toBe(false)
    }
  })

  it('still excludes every Slice 31 Som Tam and Gyudon variant, and keeps the Oyakodon correction', () => {
    for (const excludedMenuItemId of [
      'nittaya-som-tam-salted-egg',
      'zaab-eli-som-tam-salted-egg',
      'zaab-eli-corn-salted-egg-som-tam',
      'somtam-nua-papaya-salad-fermented-crab',
      'somtam-nua-tam-muah',
      'sukiya-gyudon-okra-regular',
    ]) {
      expect(relatedRecipesForMenuItem(excludedMenuItemId)).toEqual([])
    }
    expect(relatedRecipesForMenuItem('ootoya-oyakodon').map(recipe => recipe.id)).toEqual(['chicken-oyakodon'])
  })

  it('exposes the one-to-many clusters correctly through both lookup directions', () => {
    expect(relatedMenuItemsForRecipe('thai-papaya-salad')).toHaveLength(3)
    expect(relatedMenuItemsForRecipe('herb-grilled-chicken')).toHaveLength(2)
    expect(relatedMenuItemsForRecipe('chicken-larb-brown-rice')).toHaveLength(2)
    expect(relatedMenuItemsForRecipe('japanese-shioyaki-salmon-sweet-potato')).toHaveLength(2)
    // Reverse direction: every one of these recipes' related menu items resolves back to it.
    for (const recipeId of ['thai-papaya-salad', 'herb-grilled-chicken', 'chicken-larb-brown-rice', 'japanese-shioyaki-salmon-sweet-potato']) {
      for (const entry of relatedMenuItemsForRecipe(recipeId)) {
        expect(relatedRecipesForMenuItem(entry.item.id).map(recipe => recipe.id)).toContain(recipeId)
      }
    }
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
