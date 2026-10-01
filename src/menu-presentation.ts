import type { Restaurant, RestaurantMenuItem } from './types'

// View-layer presentation order only. Callers keep the original arrays for search,
// filters, random/pick pools and favorites; nothing here mutates or reorders them.
function stablePartition<T>(list: readonly T[], first: (value: T) => boolean): T[] {
  return [...list.filter(first), ...list.filter(value => !first(value))]
}

/** Restaurants with a verified official logo first; original order kept inside each group. */
export function logoFirstRestaurants(list: readonly Restaurant[]): Restaurant[] {
  return stablePartition(list, restaurant => Boolean(restaurant.logo))
}

/** Menu items with an official image first; original order kept inside each group. */
export function imageFirstMenuItems(list: readonly RestaurantMenuItem[]): RestaurantMenuItem[] {
  return stablePartition(list, item => Boolean(item.menuImage))
}

export type RestaurantCompleteness = {
  totalMenuItems: number
  imageCount: number
  pricedItemCount: number
  imageCoverage: number
  priceCoverage: number
}

/** Derived (never stored) menu-data completeness for one restaurant; zero items yields 0 coverage, never NaN. */
export function restaurantCompleteness(restaurantId: string, menuItems: readonly RestaurantMenuItem[]): RestaurantCompleteness {
  const items = menuItems.filter(item => item.restaurantId === restaurantId)
  const totalMenuItems = items.length
  const imageCount = items.filter(item => Boolean(item.menuImage)).length
  const pricedItemCount = items.filter(item => Boolean(item.price)).length
  return {
    totalMenuItems,
    imageCount,
    pricedItemCount,
    imageCoverage: totalMenuItems > 0 ? imageCount / totalMenuItems : 0,
    priceCoverage: totalMenuItems > 0 ? pricedItemCount / totalMenuItems : 0,
  }
}

/**
 * Restaurant Grid presentation order: image coverage DESC, price coverage DESC, menu size DESC, then original
 * position ASC. Returns a ranked copy; the input is not mutated and this must not feed random/pick pools.
 */
export function rankRestaurantsForGrid(list: readonly Restaurant[], menuItems: readonly RestaurantMenuItem[]): Restaurant[] {
  return list
    .map((restaurant, position) => ({ restaurant, position, ...restaurantCompleteness(restaurant.id, menuItems) }))
    .sort((a, b) => b.imageCoverage - a.imageCoverage || b.priceCoverage - a.priceCoverage || b.totalMenuItems - a.totalMenuItems || a.position - b.position)
    .map(entry => entry.restaurant)
}
