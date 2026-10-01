import { everydayMeals, mealAddOns } from './everyday-meal-data'
import type { EverydayMeal, EverydayMealCategory, EverydayMealTag, NutritionEstimate } from './everyday-meal-types'

export { everydayMeals, mealAddOns } from './everyday-meal-data'
export { everydayMealNutritionSources } from './everyday-meal-sources'
export type * from './everyday-meal-types'

export function getEverydayMeals(): EverydayMeal[] {
  return everydayMeals.slice()
}

export function getEverydayMealById(id: string): EverydayMeal | undefined {
  return everydayMeals.find(meal => meal.id === id)
}

export function searchEverydayMeals(rawQuery: string): EverydayMeal[] {
  const query = rawQuery.trim().toLocaleLowerCase()
  return everydayMeals.filter(meal => !query || [meal.nameTh, meal.nameEn].some(name => name.toLocaleLowerCase().includes(query)))
}

/** Base curated tags only. Soup-only suki light tags belong to its option. */
export function filterEverydayMeals(filters: { category?: EverydayMealCategory; tag?: EverydayMealTag }): EverydayMeal[] {
  return everydayMeals.filter(meal => (!filters.category || meal.category === filters.category) && (!filters.tag || meal.tags.includes(filters.tag)))
}

/** One equal-width interval per meal; options and add-ons never enter the pool. */
export function getRandomEverydayMeal(random = Math.random): EverydayMeal | undefined {
  return everydayMeals[Math.floor(random() * everydayMeals.length)]
}

/** Each selected ID represents one add-on. Duplicate/unavailable IDs are rejected. */
export function calculateNutritionWithAddOns(meal: EverydayMeal, selectedAddOnIds: readonly string[]): NutritionEstimate {
  const selected = new Set<string>()
  const addOns = selectedAddOnIds.map(id => {
    const addOn = mealAddOns.find(item => item.id === id)
    if (!addOn || !meal.addOnIds?.includes(id)) throw new Error(`Invalid add-on for ${meal.id}: ${id}`)
    if (selected.has(id)) throw new Error(`Duplicate add-on: ${id}`)
    selected.add(id)
    return addOn
  })
  const result = structuredClone(meal.nutrition)
  if (!addOns.length) return result
  for (const key of ['kcal', 'proteinG', 'carbsG', 'fatG'] as const) {
    const base = meal.nutrition[key]
    if (!base || addOns.some(addOn => !addOn.nutrition[key])) {
      if (key !== 'kcal') delete result[key]
      continue
    }
    result[key] = addOns.reduce((range, addOn) => {
      const addition = addOn.nutrition[key]!
      return { min: range.min + addition.min, max: range.max + addition.max }
    }, { ...base })
  }
  result.servingAssumption += ` + ${addOns.map(addOn => addOn.nameTh + ' 1 ฟอง').join(' + ')}`
  if (addOns.some(addOn => addOn.nutrition.confidence === 'medium')) result.confidence = 'medium'
  return result
}
