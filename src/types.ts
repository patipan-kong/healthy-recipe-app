export type Nutrition = { kcal: number; protein: number; carbs: number; fat: number; fiber?: number; sodium?: number }

export type Ingredient = { item: string; amount: string }

export type Recipe = {
  id: string
  sourceId: string
  name: string
  englishName: string
  category: 'Quick meals' | 'Thai favorites' | 'High protein' | 'Plant-forward' | 'Light bowls'
  cuisine: string
  servings: number
  prepMinutes: number
  cookMinutes: number
  ingredients: Ingredient[]
  instructions: string[]
  nutrition: Nutrition
  tags: string[]
  accent: string
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
