import { chooseRandom } from './recipes'
import type { Restaurant, RestaurantMenuItem } from './types'

export type RandomMealPick = {
  item: RestaurantMenuItem
  restaurant: Restaurant
}

/**
 * Keep the Random Meal pool honest when a malformed item references a
 * restaurant that is not in the current catalog. This is validation at the
 * UI boundary only; it does not alter the production dataset.
 */
export function getEligibleRandomMealItems(items: readonly RestaurantMenuItem[], knownRestaurants: readonly Restaurant[]): RestaurantMenuItem[] {
  const knownRestaurantIds = new Set(knownRestaurants.map(restaurant => restaurant.id))
  return items.filter(item => Boolean(item && typeof item.id === 'string' && knownRestaurantIds.has(item.restaurantId)))
}

export function resolveRestaurantForMenuItem(item: RestaurantMenuItem, knownRestaurants: readonly Restaurant[]): Restaurant | undefined {
  if (!item || typeof item !== 'object') return undefined
  return knownRestaurants.find(restaurant => restaurant.id === item.restaurantId)
}

export function chooseRandomMeal(items: readonly RestaurantMenuItem[], knownRestaurants: readonly Restaurant[], previousId?: string, random = Math.random): RandomMealPick | undefined {
  const eligibleItems = getEligibleRandomMealItems(items, knownRestaurants)
  const item = chooseRandom(eligibleItems, previousId, random)
  if (!item) return undefined

  const restaurant = resolveRestaurantForMenuItem(item, knownRestaurants)
  return restaurant ? { item, restaurant } : undefined
}
