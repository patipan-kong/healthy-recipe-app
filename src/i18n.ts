import type { Locale } from './types'
import type { IngredientCategory } from './pantry'

export const localeStorageKey = 'healthy-recipe-locale-v1'

type MessageSet = {
  language: string
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  random: string
  browse: string
  pantry: string
  pantryTitle: string
  pantryGuidance: string
  pantryNoSelection: string
  pantryModeLabel: string
  pantryIngredientsMode: string
  pantryRecipesMode: string
  pantryViewMatching: (count: number) => string
  pantryEditIngredients: string
  pantrySelectedSummary: (count: number) => string
  pantryDirectSummary: (name: string) => string
  pantryResultCount: (count: number) => string
  pantryResults: string
  pantrySingleResults: (name: string) => string
  pantryBack: string
  pantryClear: string
  pantrySearchPlaceholder: string
  pantrySelectedCount: (count: number) => string
  pantryMatches: (matched: number, selected: number) => string
  favorites: string
  browseAll: string
  searchPlaceholder: string
  openFilters: string
  recipeCategories: string
  allRecipes: string
  filters: string
  closeFilters: string
  clearAll: string
  category: string
  anyCategory: string
  nutritionPerServing: string
  maxKcal: string
  minProtein: string
  maxCarbs: string
  maxFat: string
  maxSodium: string
  tags: string
  filterNote: string
  showResults: string
  kcalEstimate: string
  protein: string
  carbs: string
  fat: string
  prep: string
  cook: string
  serves: string
  estimatedNote: string
  ingredients: string
  method: string
  back: string
  addFavorite: (name: string) => string
  removeFavorite: (name: string) => string
  openRecipe: (name: string) => string
  recipeImage: (name: string) => string
  unavailableImage: (name: string) => string
  emptyFilteredTitle: string
  emptyFilteredText: string
  emptyFavoritesTitle: string
  emptyFavoritesText: string
  emptyFavoriteFilteredTitle: string
  emptyFavoriteFilteredText: string
  clearFilters: string
  storageNote: string
}

export const messages: Record<Locale, MessageSet> = {
  th: {
    language: 'ภาษา',
    heroEyebrow: 'ทำอาหารดี ๆ ให้ตัวเอง',
    heroTitle: 'วันนี้อยากทำเมนูอะไรดี?',
    heroDescription: 'สูตรง่าย ๆ วัตถุดิบดี ๆ ทำได้แบบไม่กดดัน',
    random: 'สุ่มเมนู',
    browse: 'เมนูทั้งหมด',
    pantry: 'วัตถุดิบที่มี',
    pantryTitle: 'วัตถุดิบที่มี',
    pantryGuidance: 'เลือกวัตถุดิบที่มีอยู่ แล้วเราจะช่วยหาเมนูที่ใช้ของเหล่านั้น',
    pantryNoSelection: 'เลือกวัตถุดิบอย่างน้อย 1 รายการเพื่อดูเมนูที่ทำได้',
    pantryModeLabel: 'โหมด Pantry',
    pantryIngredientsMode: 'เลือกวัตถุดิบ',
    pantryRecipesMode: 'เมนูที่ทำได้',
    pantryViewMatching: count => `ดูเมนูที่ทำได้ (${count})`,
    pantryEditIngredients: 'แก้ไขวัตถุดิบ',
    pantrySelectedSummary: count => `จากวัตถุดิบ ${count} อย่าง:`,
    pantryDirectSummary: name => `จากวัตถุดิบ: ${name}`,
    pantryResultCount: count => `${count} เมนูที่ตรงกัน`,
    pantryResults: 'เมนูจากวัตถุดิบที่มี',
    pantrySingleResults: name => `เมนูที่ใช้ ${name}`,
    pantryBack: 'กลับไปเลือกวัตถุดิบ',
    pantryClear: 'ล้างรายการ',
    pantrySearchPlaceholder: 'ค้นหาวัตถุดิบ',
    pantrySelectedCount: count => `เลือกแล้ว ${count} รายการ`,
    pantryMatches: (matched, selected) => `ตรงกับ ${matched}/${selected} วัตถุดิบที่เลือก`,
    favorites: 'รายการโปรด',
    browseAll: 'ดูเมนูทั้งหมด',
    searchPlaceholder: 'ค้นหาเมนูหรือวัตถุดิบ',
    openFilters: 'เปิดตัวกรอง',
    recipeCategories: 'หมวดหมู่เมนู',
    allRecipes: 'ทุกเมนู',
    filters: 'ตัวกรอง',
    closeFilters: 'ปิดตัวกรอง',
    clearAll: 'ล้างทั้งหมด',
    category: 'หมวดหมู่',
    anyCategory: 'ทุกหมวดหมู่',
    nutritionPerServing: 'โภชนาการต่อหนึ่งที่',
    maxKcal: 'แคลอรีสูงสุด',
    minProtein: 'โปรตีนขั้นต่ำ (กรัม)',
    maxCarbs: 'คาร์บสูงสุด (กรัม)',
    maxFat: 'ไขมันสูงสุด (กรัม)',
    maxSodium: 'โซเดียมสูงสุด (มก.)',
    tags: 'แท็ก',
    filterNote: 'โภชนาการเป็นค่าประมาณต่อหนึ่งที่ และอาจต่างกันตามยี่ห้อวัตถุดิบและปริมาณ',
    showResults: 'แสดงเมนูที่ตรงกัน',
    kcalEstimate: 'กิโลแคลอรีโดยประมาณ / หนึ่งที่',
    protein: 'โปรตีน',
    carbs: 'คาร์บ',
    fat: 'ไขมัน',
    prep: 'เตรียม',
    cook: 'ปรุง',
    serves: 'สำหรับ',
    estimatedNote: 'โภชนาการโดยประมาณต่อหนึ่งที่ · ค่าจริงอาจต่างกันตามวัตถุดิบและปริมาณ',
    ingredients: 'ส่วนผสม',
    method: 'วิธีทำ',
    back: 'ย้อนกลับ',
    addFavorite: name => `เพิ่ม ${name} ในรายการโปรด`,
    removeFavorite: name => `นำ ${name} ออกจากรายการโปรด`,
    openRecipe: name => `เปิดเมนู ${name}`,
    recipeImage: name => `ภาพเมนู ${name}`,
    unavailableImage: name => `ไม่มีภาพเมนู ${name}`,
    emptyFilteredTitle: 'ไม่พบเมนูที่ตรงกัน',
    emptyFilteredText: 'ลองขยายช่วงโภชนาการหรือล้างตัวกรอง',
    emptyFavoritesTitle: 'ยังไม่มีเมนูโปรด',
    emptyFavoritesText: 'แตะหัวใจบนเมนูเพื่อเก็บไว้ที่นี่',
    emptyFavoriteFilteredTitle: 'ไม่มีเมนูโปรดที่ตรงกัน',
    emptyFavoriteFilteredText: 'ลองล้างการค้นหาหรือตัวกรองเพื่อดูเมนูที่บันทึกไว้',
    clearFilters: 'ล้างตัวกรอง',
    storageNote: 'รายการโปรดยังใช้ได้ในเซสชันนี้ แต่เบราว์เซอร์ไม่พร้อมบันทึกข้อมูล',
  },
  en: {
    language: 'Language',
    heroEyebrow: 'MAKE SOMETHING GOOD',
    heroTitle: 'What feels good to cook today?',
    heroDescription: 'Simple recipes, nourishing ingredients, no pressure.',
    random: 'Pick a random recipe',
    browse: 'Browse recipes',
    pantry: 'Pantry',
    pantryTitle: 'Ingredients at home',
    pantryGuidance: 'Choose the ingredients you have and we’ll find recipes that use them.',
    pantryNoSelection: 'Select at least one ingredient to view matching recipes.',
    pantryModeLabel: 'Pantry view',
    pantryIngredientsMode: 'Ingredients',
    pantryRecipesMode: 'Recipes',
    pantryViewMatching: count => `View matching recipes (${count})`,
    pantryEditIngredients: 'Edit ingredients',
    pantrySelectedSummary: count => `From ${count} selected ingredients:`,
    pantryDirectSummary: name => `From ingredient: ${name}`,
    pantryResultCount: count => `${count} matching recipes`,
    pantryResults: 'Recipes from your pantry',
    pantrySingleResults: name => `Recipes using ${name}`,
    pantryBack: 'Back to ingredients',
    pantryClear: 'Clear',
    pantrySearchPlaceholder: 'Search ingredients',
    pantrySelectedCount: count => `${count} selected`,
    pantryMatches: (matched, selected) => `Matches ${matched}/${selected} selected ingredients`,
    favorites: 'Your favorites',
    browseAll: 'Browse all',
    searchPlaceholder: 'Search recipes or ingredients',
    openFilters: 'Open filters',
    recipeCategories: 'Recipe categories',
    allRecipes: 'All recipes',
    filters: 'Filters',
    closeFilters: 'Close filters',
    clearAll: 'Clear all',
    category: 'Category',
    anyCategory: 'Any category',
    nutritionPerServing: 'Nutrition per serving',
    maxKcal: 'Max kcal',
    minProtein: 'Min protein (g)',
    maxCarbs: 'Max carbs (g)',
    maxFat: 'Max fat (g)',
    maxSodium: 'Max sodium (mg)',
    tags: 'Tags',
    filterNote: 'Nutrition is an estimate per serving and can vary with ingredient brands and portions.',
    showResults: 'Show matching recipes',
    kcalEstimate: 'kcal est. / serving',
    protein: 'protein',
    carbs: 'carbs',
    fat: 'fat',
    prep: 'Prep',
    cook: 'Cook',
    serves: 'Serves',
    estimatedNote: 'Estimated nutrition per serving · values vary by ingredients and portions.',
    ingredients: 'Ingredients',
    method: 'Method',
    back: 'Back',
    addFavorite: name => `Add ${name} to favorites`,
    removeFavorite: name => `Remove ${name} from favorites`,
    openRecipe: name => `Open ${name}`,
    recipeImage: name => `${name} recipe image`,
    unavailableImage: name => `${name} recipe image unavailable`,
    emptyFilteredTitle: 'Nothing matches those filters',
    emptyFilteredText: 'Try widening your nutrition limits or clearing a filter.',
    emptyFavoritesTitle: 'No saved recipes yet',
    emptyFavoritesText: 'Tap the heart on any recipe to keep it here.',
    emptyFavoriteFilteredTitle: 'No saved recipes match',
    emptyFavoriteFilteredText: 'Try clearing your search or filters to see your saved recipes.',
    clearFilters: 'Clear filters',
    storageNote: 'Favorites will stay available for this session, but browser storage is unavailable.',
  },
}

const categoryLabels: Record<string, { th: string; en: string }> = {
  'Quick meals': { th: 'เมนูทำเร็ว', en: 'Quick meals' },
  'Thai favorites': { th: 'เมนูไทย', en: 'Thai favorites' },
  'High protein': { th: 'โปรตีนสูง', en: 'High protein' },
  'Plant-forward': { th: 'เน้นผักและพืช', en: 'Plant-forward' },
  'Light bowls': { th: 'เมนูเบาสบาย', en: 'Light bowls' },
}

const cuisineLabels: Record<string, { th: string; en: string }> = {
  Thai: { th: 'ไทย', en: 'Thai' },
  Japanese: { th: 'ญี่ปุ่น', en: 'Japanese' },
  Korean: { th: 'เกาหลี', en: 'Korean' },
  Vietnamese: { th: 'เวียดนาม', en: 'Vietnamese' },
  Spanish: { th: 'สเปน', en: 'Spanish' },
  Hawaiian: { th: 'ฮาวาย', en: 'Hawaiian' },
  Chinese: { th: 'จีน', en: 'Chinese' },
  American: { th: 'อเมริกัน', en: 'American' },
  'Mexican-inspired': { th: 'สไตล์เม็กซิกัน', en: 'Mexican-inspired' },
  Italian: { th: 'อิตาเลียน', en: 'Italian' },
  Mexican: { th: 'เม็กซิกัน', en: 'Mexican' },
  Mediterranean: { th: 'เมดิเตอร์เรเนียน', en: 'Mediterranean' },
  International: { th: 'นานาชาติ', en: 'International' },
}

const tagLabels: Record<string, { th: string; en: string }> = {
  'High protein': { th: 'โปรตีนสูง', en: 'High protein' },
  Quick: { th: 'ทำเร็ว', en: 'Quick' },
  Light: { th: 'เบาสบาย', en: 'Light' },
  Vegetarian: { th: 'มังสวิรัติ', en: 'Vegetarian' },
  Vegan: { th: 'วีแกน', en: 'Vegan' },
  'No-cook': { th: 'ไม่ต้องปรุง', en: 'No-cook' },
  'Fiber-rich': { th: 'ใยอาหารสูง', en: 'Fiber-rich' },
  'Meal prep': { th: 'เตรียมล่วงหน้า', en: 'Meal prep' },
  'Gluten-free': { th: 'ปราศจากกลูเตน', en: 'Gluten-free' },
  'Dairy-free': { th: 'ปราศจากนม', en: 'Dairy-free' },
  Balanced: { th: 'สมดุล', en: 'Balanced' },
  Comforting: { th: 'อุ่นท้อง', en: 'Comforting' },
  'Low carb': { th: 'คาร์บต่ำ', en: 'Low carb' },
  'Plant protein': { th: 'โปรตีนจากพืช', en: 'Plant protein' },
  'Omega-rich': { th: 'โอเมก้าสูง', en: 'Omega-rich' },
}

const ingredientCategoryLabels: Record<IngredientCategory, { th: string; en: string }> = {
  protein: { th: 'โปรตีน', en: 'Protein' },
  vegetable: { th: 'ผัก', en: 'Vegetables' },
  carbs: { th: 'คาร์บและธัญพืช', en: 'Carbs & grains' },
  fruit: { th: 'ผลไม้', en: 'Fruits' },
  dairy: { th: 'ผลิตภัณฑ์นม', en: 'Dairy' },
  'plant-protein': { th: 'โปรตีนจากพืช', en: 'Plant protein' },
  pantry: { th: 'เครื่องปรุงและของแห้ง', en: 'Pantry & condiments' },
}

export function categoryLabel(locale: Locale, category: string) {
  return categoryLabels[category]?.[locale] ?? category
}

export function cuisineText(cuisine: string) {
  return cuisineLabels[cuisine] ?? { th: cuisine, en: cuisine }
}

export function tagLabel(locale: Locale, tag: string) {
  return tagLabels[tag]?.[locale] ?? tag
}

export function ingredientCategoryLabel(locale: Locale, category: IngredientCategory) {
  return ingredientCategoryLabels[category][locale]
}

type LocaleStore = Pick<Storage, 'getItem' | 'setItem'>

function getBrowserStorage(): LocaleStore | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export function loadLocale(store: Pick<Storage, 'getItem'> | undefined = getBrowserStorage()): Locale {
  try {
    return store?.getItem(localeStorageKey) === 'en' ? 'en' : 'th'
  } catch {
    return 'th'
  }
}

export function saveLocale(locale: Locale, store: Pick<Storage, 'setItem'> | undefined = getBrowserStorage()): boolean {
  try {
    if (!store) return false
    store.setItem(localeStorageKey, locale)
    return true
  } catch {
    return false
  }
}
