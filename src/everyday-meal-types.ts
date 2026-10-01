export type EverydayMealCategory = 'rice' | 'noodle' | 'porridge' | 'soup' | 'suki'
export type EverydayMealTag = 'light' | 'high-protein' | 'veggie-rich'
export type EverydayMealNutritionConfidence = 'high' | 'medium'
export type NutritionRange = { min: number; max: number }
export type NutritionEstimate = {
  kcal: NutritionRange
  proteinG?: NutritionRange
  carbsG?: NutritionRange
  fatG?: NutritionRange
  servingAssumption: string
  confidence: EverydayMealNutritionConfidence
}
export type MealOptionGroup = {
  id: string
  labelTh: string
  choices: {
    id: string
    labelTh: string
    nutrition?: { kcal?: NutritionRange; kcalAdjustment?: number | NutritionRange }
    nutritionEffect?: 'lower-energy' | 'higher-protein' | 'more-vegetables'
    tags?: EverydayMealTag[]
  }[]
}
export type MealAddOn = {
  id: string
  nameTh: string
  nameEn: string
  nutrition: NutritionEstimate
  /** Omitted while evidence mapping is pending; present IDs must resolve in the registry. */
  sourceIds?: string[]
}
export type OrderingTip = {
  textTh: string
  type: 'lighter' | 'more-protein' | 'more-vegetables' | 'general'
}
export type EverydayMealNutritionSource = {
  id: string
  title: string
  publisher: string
  url?: string
  sourceType: 'official' | 'academic' | 'database' | 'secondary'
  appliesTo: 'whole-meal' | 'ingredient' | 'add-on'
  servingDescription?: string
  /** Record only an actual verified access date; omission makes no access claim. */
  accessedAt?: string
}
export type EverydayMeal = {
  id: string
  nameTh: string
  nameEn: string
  category: EverydayMealCategory
  tags: EverydayMealTag[]
  nutrition: NutritionEstimate
  optionGroups?: MealOptionGroup[]
  addOnIds?: string[]
  orderingTips?: OrderingTip[]
  nutritionNotes?: string[]
  image?: string
  /** Evidence links, never attribution of GoodFood's ranges. Omitted while mapping is pending. */
  sourceIds?: string[]
}
