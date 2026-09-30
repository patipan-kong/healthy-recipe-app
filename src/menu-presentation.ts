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
