export type Locale = 'th' | 'en'

export type LocalizedText = { th: string; en: string }

export type IngredientUnit = 'g' | 'ml' | 'tbsp' | 'tsp' | 'cup' | 'packed-cup' | 'small-bundle' | 'small' | 'medium' | 'large' | 'clove' | 'leaf' | 'slice' | 'stalk' | 'pinch' | 'egg' | 'sheet'

export type Nutrition = { kcal: number; protein: number; carbs: number; fat: number; fiber?: number; sodium?: number }

export type Ingredient = {
  item: LocalizedText
  quantity: string | number
  unit?: IngredientUnit
  ingredientId?: string
  /** Original catalog wording retained for traceability and migration compatibility. */
  amount?: string
}

export type Recipe = {
  id: string
  sourceId: string
  name: LocalizedText
  category: 'Quick meals' | 'Thai favorites' | 'High protein' | 'Plant-forward' | 'Light bowls'
  cuisine: LocalizedText
  servings: number
  prepMinutes: number
  cookMinutes: number
  ingredients: Ingredient[]
  instructions: LocalizedText[]
  nutrition: Nutrition
  tags: string[]
  accent: string
  image: string
}

export type Filters = {
  category: string
  maxKcal?: number
  minProtein?: number
  maxCarbs?: number
  maxFat?: number
  maxSodium?: number
  tags: string[]
}
