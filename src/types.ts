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

export type Restaurant = {
  id: string
  name: LocalizedText
  cuisine?: LocalizedText
  tags?: string[]
  visualIdentity?: {
    kind: 'initials'
    label?: LocalizedText
  }
}

export type MenuCategory = 'Rice & noodles' | 'Salad' | 'Grilled/BBQ' | 'Soup' | 'Set meal'

export type NutritionConfidence = 'official' | 'label' | 'curated' | 'estimated'

export type NutritionSource = {
  confidence: NutritionConfidence
  note?: LocalizedText
  asOf?: string
}

export type MenuPrice = {
  amount: number
  currency: 'THB'
  asOf: string
  note?: LocalizedText
}

export type MealContext =
  | {
      kind: 'add-on'
      label: LocalizedText
      /** Nutrition for the addition only; never the whole meal. */
      additionNutrition?: Nutrition
      additionNutritionSource?: NutritionSource
      note?: LocalizedText
    }
  | {
      kind: 'already-complete'
      label: LocalizedText
      note?: LocalizedText
    }

export type RestaurantMenuItem = {
  id: string
  restaurantId: string
  name: LocalizedText
  category: MenuCategory
  nutrition: Nutrition
  nutritionSource: NutritionSource
  tags: string[]
  servingNote?: LocalizedText
  customizationNotes?: LocalizedText[]
  image?: string
  mealContext?: MealContext
  price?: MenuPrice
}

export type RestaurantMenuFilters = {
  maxKcal?: number
  minProtein?: number
  maxCarbs?: number
  maxFat?: number
  maxSodium?: number
}

export type ExplorePresetId = 'high-protein' | 'light-meal' | 'balanced'
