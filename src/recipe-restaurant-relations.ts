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
  // Slice 31 batch 1: Som Tam relates to every restaurant item that is the same
  // classic dish concept — deliberately excluding salted egg, corn, fermented
  // crab/pla ra, and mixed-noodle variants, which are materially different dishes.
  { recipeId: 'thai-papaya-salad', restaurantMenuItemId: 'nittaya-som-tam-thai', relationKind: 'similar-dish' },
  { recipeId: 'thai-papaya-salad', restaurantMenuItemId: 'somtam-nua-papaya-salad-thai', relationKind: 'similar-dish' },
  { recipeId: 'thai-papaya-salad', restaurantMenuItemId: 'steak-and-more-som-tam', relationKind: 'similar-dish' },
  { recipeId: 'japanese-beef-gyudon', restaurantMenuItemId: 'sukiya-gyudon-regular', relationKind: 'similar-dish' },
  { recipeId: 'japanese-vegetable-curry-rice', restaurantMenuItemId: 'sukiya-curry-rice-regular', relationKind: 'similar-dish' },
  { recipeId: 'garlic-pepper-pork-fried-egg-rice', restaurantMenuItemId: 'seven-eleven-garlic-pork-egg-rice', relationKind: 'similar-dish' },
  // Slice 33: the 11 HIGH-confidence pairs approved by Slice 32's coverage
  // audit (docs/relation-coverage-audit-32.md). 7 SAME_DISH-caliber matches:
  { recipeId: 'spicy-grilled-pork-salad', restaurantMenuItemId: 'salad-factory-spicy-pork-tenderloin', relationKind: 'similar-dish' },
  { recipeId: 'chicken-vegetable-sukiyaki', restaurantMenuItemId: 'seven-eleven-chicken-sukiyaki', relationKind: 'similar-dish' },
  { recipeId: 'chicken-green-curry-brown-rice', restaurantMenuItemId: 'seven-eleven-green-curry-chicken', relationKind: 'similar-dish' },
  { recipeId: 'grilled-chicken-jaew', restaurantMenuItemId: 'santa-fe-chicken-steak-jaew', relationKind: 'similar-dish' },
  { recipeId: 'herb-grilled-chicken', restaurantMenuItemId: 'nittaya-grilled-chicken-quarter', relationKind: 'similar-dish' },
  { recipeId: 'herb-grilled-chicken', restaurantMenuItemId: 'zaab-eli-grilled-chicken', relationKind: 'similar-dish' },
  { recipeId: 'japanese-shioyaki-salmon-sweet-potato', restaurantMenuItemId: 'fuji-salmon-shioyaki-brown-rice-set', relationKind: 'similar-dish' },
  // 4 SIMILAR_DISH-caliber matches (still 'similar-dish' — the model has one kind):
  { recipeId: 'salmon-poke-bowl', restaurantMenuItemId: 'salad-factory-salmon-sashimi-shoyu', relationKind: 'similar-dish' },
  { recipeId: 'baked-cod-lemon-herbs', restaurantMenuItemId: 'santa-fe-dory-fish-steak', relationKind: 'similar-dish' },
  { recipeId: 'chicken-larb-brown-rice', restaurantMenuItemId: 'nittaya-larb-moo', relationKind: 'similar-dish' },
  { recipeId: 'chicken-larb-brown-rice', restaurantMenuItemId: 'zaab-eli-larb-moo', relationKind: 'similar-dish' },
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
