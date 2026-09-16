import { describe, expect, it } from 'vitest'
import { chooseRandom } from './recipes'
import { chooseRandomMeal, getEligibleRandomMealItems, resolveRestaurantForMenuItem } from './random-meal'
import { restaurantMenuItems, restaurants } from './restaurants'

describe('Random Meal selection', () => {
  it('selects a valid production RestaurantMenuItem and resolves its owning Restaurant', () => {
    const result = chooseRandomMeal(restaurantMenuItems, restaurants, undefined, () => 0)

    expect(result).toBeDefined()
    expect(restaurantMenuItems).toContain(result!.item)
    expect(result!.restaurant.id).toBe(result!.item.restaurantId)
    expect(resolveRestaurantForMenuItem(result!.item, restaurants)).toBe(result!.restaurant)
  })

  it('avoids an immediate repetition when the valid pool has more than one item', () => {
    const first = chooseRandomMeal(restaurantMenuItems, restaurants, undefined, () => 0)
    const second = chooseRandomMeal(restaurantMenuItems, restaurants, first?.item.id, () => 0)

    expect(first).toBeDefined()
    expect(second).toBeDefined()
    expect(second!.item.id).not.toBe(first!.item.id)
  })

  it('keeps a single-item pool safe and returns that item again', () => {
    const item = restaurantMenuItems[0]
    const restaurant = restaurants.find(candidate => candidate.id === item.restaurantId)
    if (!restaurant) throw new Error('Fixture item needs a matching restaurant')

    const result = chooseRandomMeal([item], [restaurant], item.id, () => 0.75)

    expect(result).toEqual({ item, restaurant })
  })

  it('excludes unresolved restaurant references and fails safely for empty valid pools', () => {
    const item = restaurantMenuItems[0]
    const invalidItem = { ...item, id: 'invalid-owner-item', restaurantId: 'missing-restaurant' }

    expect(getEligibleRandomMealItems([item, invalidItem], restaurants)).toEqual([item])
    expect(chooseRandomMeal([invalidItem], restaurants, undefined, () => 0)).toBeUndefined()
    expect(chooseRandomMeal([], restaurants, undefined, () => 0)).toBeUndefined()
    expect(chooseRandomMeal([item], [], undefined, () => 0)).toBeUndefined()
  })

  it('keeps restaurant and meal repeat state independent', () => {
    const restaurantA = { id: 'restaurant-a', name: { th: 'ร้านเอ', en: 'Restaurant A' } }
    const restaurantB = { id: 'restaurant-b', name: { th: 'ร้านบี', en: 'Restaurant B' } }
    const itemA = { ...restaurantMenuItems[0], id: 'menu-a', restaurantId: restaurantA.id }
    const itemB = { ...restaurantMenuItems[1], id: 'menu-b', restaurantId: restaurantB.id }

    const pickedRestaurant = chooseRandom([restaurantA, restaurantB], undefined, () => 0)
    const pickedMeal = chooseRandomMeal([itemA, itemB], [restaurantA, restaurantB], undefined, () => 0)
    const nextRestaurant = chooseRandom([restaurantA, restaurantB], pickedRestaurant?.id, () => 0)
    const nextMeal = chooseRandomMeal([itemA, itemB], [restaurantA, restaurantB], pickedMeal?.item.id, () => 0)

    expect(pickedRestaurant?.id).toBe(restaurantA.id)
    expect(pickedMeal?.item.id).toBe(itemA.id)
    expect(nextRestaurant?.id).toBe(restaurantB.id)
    expect(nextMeal?.item.id).toBe(itemB.id)
  })
})
