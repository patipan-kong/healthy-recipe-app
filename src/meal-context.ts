import type { LocalizedText, MealContext, MenuPrice, Nutrition, NutritionConfidence, NutritionSource } from './types'

const nutritionConfidences: readonly NutritionConfidence[] = ['official', 'label', 'curated', 'estimated']
const nutritionKeys = ['kcal', 'protein', 'carbs', 'fat', 'fiber', 'sodium'] as const

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function hasLocalizedText(value: unknown): value is LocalizedText {
  return typeof value === 'object' && value !== null && hasText((value as Record<string, unknown>).th) && hasText((value as Record<string, unknown>).en)
}

export function isValidNutrition(value: unknown): value is Nutrition {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  if (!['kcal', 'protein', 'carbs', 'fat'].every(key => typeof record[key] === 'number' && Number.isFinite(record[key]) && record[key] >= 0)) return false
  return Object.entries(record).every(([key, number]) => {
    if (!nutritionKeys.includes(key as typeof nutritionKeys[number])) return false
    if ((key === 'fiber' || key === 'sodium') && number === undefined) return true
    return typeof number === 'number' && Number.isFinite(number) && number >= 0
  })
}

function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function isValidNutritionSource(value: unknown): value is NutritionSource {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const source = value as Partial<NutritionSource>
  if (!nutritionConfidences.includes(source.confidence as NutritionConfidence)) return false
  if (source.note !== undefined && !hasLocalizedText(source.note)) return false
  return source.asOf === undefined || isValidIsoDate(source.asOf)
}

export function calculateMealNutrition(base: Nutrition, addition: Nutrition): Nutrition {
  if (!isValidNutrition(base) || !isValidNutrition(addition)) throw new Error('Cannot calculate meal nutrition from invalid nutrition')
  const total: Nutrition = {
    kcal: base.kcal + addition.kcal,
    protein: base.protein + addition.protein,
    carbs: base.carbs + addition.carbs,
    fat: base.fat + addition.fat,
  }
  if (base.fiber !== undefined && addition.fiber !== undefined) total.fiber = base.fiber + addition.fiber
  if (base.sodium !== undefined && addition.sodium !== undefined) total.sodium = base.sodium + addition.sodium
  return total
}

export function validateMenuPrice(value: unknown): string[] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return ['Invalid price']
  const price = value as Partial<MenuPrice>
  const errors: string[] = []
  if (typeof price.amount !== 'number' || !Number.isFinite(price.amount) || price.amount < 0) errors.push('Invalid price amount')
  if (price.currency !== 'THB') errors.push('Invalid price currency')
  if (!isValidIsoDate(price.asOf)) errors.push('Invalid price asOf')
  if (price.note !== undefined && !hasLocalizedText(price.note)) errors.push('Invalid price note')
  return errors
}

export function validateMealContext(value: unknown): string[] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return ['Invalid meal context']
  const context = value as Partial<MealContext> & Record<string, unknown>
  const errors: string[] = []
  if (context.kind !== 'add-on' && context.kind !== 'already-complete' && context.kind !== 'configurable') errors.push('Invalid meal context kind')
  if (!hasLocalizedText(context.label)) errors.push('Missing meal-context label')
  if (context.note !== undefined && !hasLocalizedText(context.note)) errors.push('Invalid meal-context note')

  if (context.kind === 'add-on') {
    const hasAdditionNutrition = context.additionNutrition !== undefined
    const hasAdditionSource = context.additionNutritionSource !== undefined
    if (hasAdditionNutrition && !isValidNutrition(context.additionNutrition)) errors.push('Invalid addition nutrition')
    if (hasAdditionNutrition && !hasAdditionSource) errors.push('Missing meal-context provenance')
    if (!hasAdditionNutrition && hasAdditionSource) errors.push('Meal-context provenance without addition nutrition')
    if (hasAdditionSource && !isValidNutritionSource(context.additionNutritionSource)) errors.push('Invalid meal-context provenance')
  }

  if (context.kind === 'already-complete' && (context.additionNutrition !== undefined || context.additionNutritionSource !== undefined)) errors.push('Complete meal context cannot include addition nutrition')
  if (context.kind === 'configurable' && (context.additionNutrition !== undefined || context.additionNutritionSource !== undefined)) errors.push('Configurable meal context cannot include addition nutrition')
  return errors
}
