import { describe, expect, it } from 'vitest'
import { calculateMealNutrition } from './meal-context'
import { restaurantMenuItems, restaurants, validateRestaurantMenuItems } from './restaurants'
import type { RestaurantMenuItem } from './types'

const base = { kcal: 282, protein: 39.5, carbs: 7.9, fat: 12, fiber: 2, sodium: 180 }
const addition = { kcal: 220, protein: 4.5, carbs: 45, fat: 1.5, fiber: 1, sodium: 360 }

function item(overrides: Partial<RestaurantMenuItem> = {}): RestaurantMenuItem {
  return { ...restaurantMenuItems[0], id: 'meal-context-test-item', ...overrides }
}

describe('calculateMealNutrition', () => {
  it('sums kcal, protein, carbs, and fat', () => {
    expect(calculateMealNutrition(base, addition)).toMatchObject({ kcal: 502, protein: 44, carbs: 52.9, fat: 13.5 })
  })

  it('sums sodium when both components are known', () => {
    expect(calculateMealNutrition(base, addition).sodium).toBe(540)
  })

  it('keeps sodium unknown when either component is unknown', () => {
    expect(calculateMealNutrition({ ...base, sodium: undefined }, addition).sodium).toBeUndefined()
    expect(calculateMealNutrition(base, { ...addition, sodium: undefined }).sodium).toBeUndefined()
  })

  it('sums fiber when both components are known', () => {
    expect(calculateMealNutrition(base, addition).fiber).toBe(3)
  })

  it('keeps fiber unknown when either component is unknown', () => {
    expect(calculateMealNutrition({ ...base, fiber: undefined }, addition).fiber).toBeUndefined()
    expect(calculateMealNutrition(base, { ...addition, fiber: undefined }).fiber).toBeUndefined()
  })

  it('does not mutate either input', () => {
    const originalBase = { ...base }
    const originalAddition = { ...addition }
    calculateMealNutrition(originalBase, originalAddition)
    expect(originalBase).toEqual(base)
    expect(originalAddition).toEqual(addition)
  })

  it('keeps decimal values and zero values exact', () => {
    expect(calculateMealNutrition({ kcal: 0, protein: 0, carbs: 0, fat: 0 }, { kcal: 0.5, protein: 0.25, carbs: 0.75, fat: 0.1 })).toEqual({ kcal: 0.5, protein: 0.25, carbs: 0.75, fat: 0.1 })
  })

  it('rejects negative, non-finite, and malformed nutrition', () => {
    expect(() => calculateMealNutrition({ ...base, kcal: -1 }, addition)).toThrow()
    expect(() => calculateMealNutrition({ ...base, protein: Number.NaN }, addition)).toThrow()
    expect(() => calculateMealNutrition(base, { ...addition, fat: Number.POSITIVE_INFINITY })).toThrow()
    expect(() => calculateMealNutrition(base, { kcal: 1, protein: 1, carbs: 1 } as never)).toThrow()
  })
})

describe('optional restaurant meal context and price validation', () => {
  const addOn = {
    kind: 'add-on' as const,
    label: { th: 'เพิ่มข้าว (เดโม)', en: 'Rice add-on (demo)' },
    additionNutrition: { kcal: 120, protein: 2, carbs: 25, fat: 1 },
    additionNutritionSource: { confidence: 'estimated' as const, asOf: '2026-09-15' },
  }

  it('accepts an item without optional price or meal context', () => {
    expect(validateRestaurantMenuItems([item({ price: undefined, mealContext: undefined })], restaurants)).toEqual([])
  })

  it('accepts a valid THB price and valid add-on context', () => {
    expect(validateRestaurantMenuItems([item({ price: { amount: 299, currency: 'THB', asOf: '2026-09-15' }, mealContext: addOn })], restaurants)).toEqual([])
  })

  it('rejects negative and non-finite prices', () => {
    expect(validateRestaurantMenuItems([item({ price: { amount: -1, currency: 'THB', asOf: '2026-09-15' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ price: { amount: Number.NaN, currency: 'THB', asOf: '2026-09-15' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ price: { amount: Number.POSITIVE_INFINITY, currency: 'THB', asOf: '2026-09-15' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
  })

  it('rejects invalid currency and missing or invalid price asOf', () => {
    expect(validateRestaurantMenuItems([item({ price: { amount: 299, currency: 'USD' as never, asOf: '2026-09-15' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ price: { amount: 299, currency: 'THB', asOf: '' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ price: { amount: 299, currency: 'THB', asOf: '2026-02-30' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
  })

  it('requires a bilingual label and provenance for add-on nutrition', () => {
    expect(validateRestaurantMenuItems([item({ mealContext: { ...addOn, label: { th: '', en: 'Rice' } } })], restaurants)).toContain('Missing meal-context label: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ mealContext: { ...addOn, additionNutrition: { ...addOn.additionNutrition, kcal: -1 } } })], restaurants)).toContain('Invalid addition nutrition: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ mealContext: { ...addOn, additionNutritionSource: undefined } })], restaurants)).toContain('Missing meal-context provenance: meal-context-test-item')
  })

  it('accepts an already-complete context without addition nutrition', () => {
    expect(validateRestaurantMenuItems([item({ mealContext: { kind: 'already-complete', label: { th: 'ครบชุด', en: 'Complete set' } } })], restaurants)).toEqual([])
  })

  it('rejects double-countable fields on an already-complete context', () => {
    expect(validateRestaurantMenuItems([item({ mealContext: { kind: 'already-complete', label: { th: 'ครบชุด', en: 'Complete set' }, additionNutrition: addOn.additionNutrition } as never })], restaurants)).toContain('Complete meal context cannot include addition nutrition: meal-context-test-item')
  })

  it('reports malformed optional models without throwing', () => {
    expect(() => validateRestaurantMenuItems([item({ price: null as never, mealContext: 'broken' as never })], restaurants)).not.toThrow()
    const errors = validateRestaurantMenuItems([item({ price: null as never, mealContext: 'broken' as never })], restaurants)
    expect(errors).toContain('Invalid price: meal-context-test-item')
    expect(errors).toContain('Invalid meal context: meal-context-test-item')
  })

  it('keeps the production dataset at the expected baseline and valid', () => {
    expect(restaurants).toHaveLength(13)
    expect(restaurantMenuItems).toHaveLength(84)
    expect(validateRestaurantMenuItems(restaurantMenuItems, restaurants)).toEqual([])
  })
})
