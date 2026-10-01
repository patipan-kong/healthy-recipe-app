import type { EverydayMealNutritionSource } from './everyday-meal-types'

/** Registry for defensible entity mappings. Pending mappings are omitted from entities.
 * Populate only when an actual supporting source is established; candidate URLs
 * alone do not belong here and never support GoodFood's normalized ranges.
 */
export const everydayMealNutritionSources: EverydayMealNutritionSource[] = []