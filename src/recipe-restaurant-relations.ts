import { recipes } from './recipes'
import { restaurantMenuItems, restaurants } from './restaurants'
import type { LocalizedText, Recipe, Restaurant, RestaurantMenuItem } from './types'

// A curated, editorial bridge between the two independent catalogs (Slice 28).
// Deliberately not a recommendation engine: every pair below was picked by
// hand because the dish identity genuinely matches, not because tags or
// cuisine overlap. See docs referenced in the Slice 28 report for the
// rejected candidates this list intentionally leaves out.
export type RelationKind = 'similar-dish'

export type RecipeRestaurantRelation = {
  recipeId: string
  restaurantMenuItemId: string
  relationKind: RelationKind
  note?: LocalizedText
}

export const recipeRestaurantRelations: RecipeRestaurantRelation[] = [
  { recipeId: 'japanese-shioyaki-salmon-sweet-potato', restaurantMenuItemId: 'fuji-salmon-shioyaki', relationKind: 'similar-dish' },
  { recipeId: 'grilled-mackerel-bowl', restaurantMenuItemId: 'ootoya-grilled-mackerel', relationKind: 'similar-dish' },
  { recipeId: 'chicken-teriyaki-rice-bowl', restaurantMenuItemId: 'fuji-chicken-teriyaki', relationKind: 'similar-dish' },
  { recipeId: 'grilled-chicken-caesar-salad', restaurantMenuItemId: 'jones-caesar-chicken-salad', relationKind: 'similar-dish' },
  { recipeId: 'glass-noodle-seafood-salad', restaurantMenuItemId: 'steak-and-more-yum-woon-sen', relationKind: 'similar-dish' },
  // Slice 31 correction: Slice 30's audit flagged this as an exact-identity match
  // (same dish, same technique, same format) that Slice 28 missed.
  { recipeId: 'chicken-oyakodon', restaurantMenuItemId: 'ootoya-oyakodon', relationKind: 'similar-dish' },
]

export type RelatedMenuEntry = { item: RestaurantMenuItem; restaurant: Restaurant }

// Resolved joins for the UI: a recipe may have zero or more related menu
// items, and a menu item may have zero or more related recipes. Today's
// curated dataset is 1:1 in both directions, but callers should not assume
// that and should simply render what comes back (usually taking the first).
export function relatedMenuItemsForRecipe(recipeId: string): RelatedMenuEntry[] {
  return recipeRestaurantRelations
    .filter(relation => relation.recipeId === recipeId)
    .map(relation => restaurantMenuItems.find(item => item.id === relation.restaurantMenuItemId))
    .filter((item): item is RestaurantMenuItem => Boolean(item))
    .map(item => ({ item, restaurant: restaurants.find(restaurant => restaurant.id === item.restaurantId) }))
    .filter((entry): entry is RelatedMenuEntry => Boolean(entry.restaurant))
}

export function relatedRecipesForMenuItem(menuItemId: string): Recipe[] {
  return recipeRestaurantRelations
    .filter(relation => relation.restaurantMenuItemId === menuItemId)
    .map(relation => recipes.find(recipe => recipe.id === relation.recipeId))
    .filter((recipe): recipe is Recipe => Boolean(recipe))
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

const relationKinds: readonly RelationKind[] = ['similar-dish']

export function validateRecipeRestaurantRelations(relations: RecipeRestaurantRelation[], knownRecipes: readonly Recipe[], knownMenuItems: readonly RestaurantMenuItem[]): string[] {
  const errors: string[] = []
  if (!Array.isArray(relations)) return ['Invalid relation array']
  const recipeIds = new Set(knownRecipes.map(recipe => recipe.id))
  const menuItemIds = new Set(knownMenuItems.map(item => item.id))
  const seenPairs = new Set<string>()
  for (const rawRelation of relations) {
    const relation = (rawRelation && typeof rawRelation === 'object' ? rawRelation : {}) as Partial<RecipeRestaurantRelation>
    const recipeId = hasText(relation.recipeId) ? relation.recipeId : '(missing recipeId)'
    const menuItemId = hasText(relation.restaurantMenuItemId) ? relation.restaurantMenuItemId : '(missing restaurantMenuItemId)'
    if (!hasText(relation.recipeId) || !recipeIds.has(relation.recipeId)) errors.push(`Unknown recipeId: ${recipeId}`)
    if (!hasText(relation.restaurantMenuItemId) || !menuItemIds.has(relation.restaurantMenuItemId)) errors.push(`Unknown restaurantMenuItemId: ${menuItemId}`)
    if (!relationKinds.includes(relation.relationKind as RelationKind)) errors.push(`Invalid relationKind: ${recipeId} -> ${menuItemId}`)
    const pairKey = `${recipeId}::${menuItemId}`
    if (seenPairs.has(pairKey)) errors.push(`Duplicate relation pair: ${pairKey}`)
    seenPairs.add(pairKey)
  }
  return errors
}
