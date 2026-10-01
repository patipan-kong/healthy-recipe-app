import { describe, expect, it } from 'vitest'
import { restaurantCompleteness, rankRestaurantsForGrid } from './menu-presentation'
import { restaurantMenuItems, restaurants } from './restaurants'
import { chooseRandom } from './recipes'
import type { MenuImage, MenuPrice, Restaurant, RestaurantMenuItem } from './types'

const image: MenuImage = { src: 'x.jpg', alt: { th: 'x', en: 'x' }, kind: 'bundled' }
const price: MenuPrice = { amount: 100, currency: 'THB', asOf: '2026-01-01' }
const r = (id: string): Restaurant => ({ id, name: { th: id, en: id } })
const make = (restaurantId: string, images: number, priced: number, total: number): RestaurantMenuItem[] => Array.from({ length: total }, (_, i) => ({
  id: `${restaurantId}-${i}`, restaurantId, name: { th: 'a', en: 'a' }, category: 'Set meal' as const,
  nutrition: { kcal: 1, protein: 1, carbs: 1, fat: 1 }, nutritionSource: { confidence: 'estimated' as const }, tags: [],
  ...(i < images ? { menuImage: image } : {}), ...(i < priced ? { price } : {}),
}))
const order = (list: Restaurant[]) => list.map(item => item.id)

describe('Restaurant Grid completeness ranking', () => {
  it('ranks higher image coverage first, not raw image count', () => {
    const items = [...make('big', 8, 0, 20), ...make('small', 5, 0, 5)]
    expect(order(rankRestaurantsForGrid([r('big'), r('small')], items))).toEqual(['small', 'big'])
  })
  it('breaks equal image coverage by price coverage', () => {
    const items = [...make('a', 2, 1, 4), ...make('b', 2, 3, 4)]
    expect(order(rankRestaurantsForGrid([r('a'), r('b')], items))).toEqual(['b', 'a'])
  })
  it('breaks equal image and price coverage by menu size', () => {
    const items = [...make('a', 1, 1, 2), ...make('b', 2, 2, 4)]
    expect(order(rankRestaurantsForGrid([r('a'), r('b')], items))).toEqual(['b', 'a'])
  })
  it('keeps original catalog order on a complete tie', () => {
    const items = [...make('a', 1, 1, 2), ...make('b', 1, 1, 2), ...make('c', 1, 1, 2)]
    expect(order(rankRestaurantsForGrid([r('c'), r('a'), r('b')], items))).toEqual(['c', 'a', 'b'])
  })
  it('is safe for a zero-item restaurant', () => {
    expect(restaurantCompleteness('empty', [])).toEqual({ totalMenuItems: 0, imageCount: 0, pricedItemCount: 0, imageCoverage: 0, priceCoverage: 0 })
    const items = make('full', 1, 1, 1)
    expect(order(rankRestaurantsForGrid([r('empty'), r('full')], items))).toEqual(['full', 'empty'])
    expect(order(rankRestaurantsForGrid([r('empty'), r('full')], items))).toEqual(['full', 'empty'])
  })
  it('does not mutate its inputs', () => {
    const list = [r('b'), r('a')]
    const items = make('a', 1, 1, 1)
    const snapshot = JSON.stringify([list, items])
    const ranked = rankRestaurantsForGrid(list, items)
    expect(ranked).not.toBe(list)
    expect(JSON.stringify([list, items])).toBe(snapshot)
  })
  it('is deterministic for the real catalog and keeps all restaurants', () => {
    const ids = restaurants.map(item => item.id)
    const first = order(rankRestaurantsForGrid(restaurants, restaurantMenuItems))
    expect(order(rankRestaurantsForGrid(restaurants, restaurantMenuItems))).toEqual(first)
    expect([...first].sort()).toEqual([...ids].sort())
    expect(restaurants.map(item => item.id)).toEqual(ids)
  })
  it('leaves the Random Restaurant pool on the canonical array', () => {
    const random = () => 0.999
    expect(chooseRandom(restaurants, undefined, random)!.id).toBe(restaurants[restaurants.length - 1].id)
  })
})
