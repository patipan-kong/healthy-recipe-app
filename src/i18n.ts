import type { ExplorePresetId, Locale, MenuCategory, NutritionConfidence } from './types'
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
  pantryDirectResultCount: (count: number) => string
  pantryNoMatchesTitle: string
  pantryNoMatchesText: string
  pantryResults: string
  pantrySingleResults: (name: string) => string
  pantryBack: string
  pantryClear: string
  pantrySearchPlaceholder: string
  pantrySelectedCount: (count: number) => string
  pantryMatches: (matched: number, selected: number) => string
  shopping: string
  shoppingTitle: string
  shoppingAdd: string
  shoppingAdded: string
  shoppingServings: string
  shoppingDecrease: string
  shoppingIncrease: string
  shoppingSelectedRecipes: string
  shoppingIngredients: string
  shoppingAlreadyHave: string
  shoppingPurchased: string
  shoppingRemove: string
  shoppingClear: string
  shoppingEmptyTitle: string
  shoppingEmptyText: string
  shoppingStorageNote: string
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
  restaurants: string
  restaurantsTitle: string
  restaurantPickHeading: string
  restaurantPickLabel: string
  pickRestaurant: string
  restaurantsBack: string
  restaurantsEmptyTitle: string
  restaurantsEmptyText: string
  menuEmptyTitle: string
  menuEmptyText: string
  openRestaurant: (name: string) => string
  viewMenu: string
  sodium: string
  pickForMe: string
  pickAgain: string
  yourPick: string
  randomMeal: string
  randomMealHeading: string
  viewAllMenus: string
  hideMenus: string
  commonMeal: string
  configurableMeal: string
  estimatedMealTotal: string
  completeMeal: string
  mealIncludesSet: string
  price: string
  priceChecked: (asOf: string) => string
  nutritionChecked: (asOf: string) => string
  mealContextPilotEyebrow: string
  mealContextPilotTitle: string
  mealContextPilotNotice: string
  mealContextPilotLocal: string
  mealContextPilotExplore: string
  mealContextPilotCases: string
  mealContextPilotLoading: string
  pickNoMatches: string
  explore: string
  exploreTitle: string
  exploreMatchCount: (count: number) => string
  viewRestaurant: (name: string) => string
  exploreGoals: string
  explorePresetCustomLabel: string
  exploreGoalsDisclaimer: string
  favoriteRecipesHeading: string
  favoriteRestaurantMenusHeading: string
  emptyRestaurantFavoritesText: string
  addMenuFavorite: (name: string) => string
  removeMenuFavorite: (name: string) => string
  restaurantFavoritesStorageNote: string
  exploreSearchPlaceholder: string
  clearSearch: string
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
    pantryDirectResultCount: count => `${count} เมนู`,
    pantryNoMatchesTitle: 'ไม่พบเมนูที่ตรงกับวัตถุดิบที่เลือก',
    pantryNoMatchesText: 'ลองเลือกวัตถุดิบอื่นเพิ่มหรือแก้ไขวัตถุดิบ',
    pantryResults: 'เมนูจากวัตถุดิบที่มี',
    pantrySingleResults: name => `เมนูที่ใช้ ${name}`,
    pantryBack: 'กลับไปเลือกวัตถุดิบ',
    pantryClear: 'ล้างรายการ',
    pantrySearchPlaceholder: 'ค้นหาวัตถุดิบ',
    pantrySelectedCount: count => `เลือกแล้ว ${count} รายการ`,
    pantryMatches: (matched, selected) => `ตรงกับ ${matched}/${selected} วัตถุดิบที่เลือก`,
    shopping: 'รายการซื้อ',
    shoppingTitle: 'รายการซื้อ',
    shoppingAdd: 'เพิ่มลงรายการซื้อ',
    shoppingAdded: 'อยู่ในรายการซื้อแล้ว',
    shoppingServings: 'จำนวนเสิร์ฟ',
    shoppingDecrease: 'ลดจำนวนเสิร์ฟ',
    shoppingIncrease: 'เพิ่มจำนวนเสิร์ฟ',
    shoppingSelectedRecipes: 'เมนูที่เลือก',
    shoppingIngredients: 'วัตถุดิบที่ต้องซื้อ',
    shoppingAlreadyHave: 'มีแล้ว',
    shoppingPurchased: 'ซื้อแล้ว',
    shoppingRemove: 'นำออก',
    shoppingClear: 'ล้างรายการซื้อ',
    shoppingEmptyTitle: 'ยังไม่มีเมนูในรายการซื้อ',
    shoppingEmptyText: 'เลือกเมนูที่อยากทำ แล้วกด “เพิ่มลงรายการซื้อ”',
    shoppingStorageNote: 'รายการซื้อยังใช้ได้ในเซสชันนี้ แต่เบราว์เซอร์ไม่พร้อมบันทึกข้อมูล',
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
    restaurants: 'ร้านอาหาร',
    restaurantsTitle: 'เลือกร้านอาหาร',
    restaurantPickHeading: 'ร้านที่สุ่มได้',
    restaurantPickLabel: 'ผลการสุ่มร้านอาหาร',
    pickRestaurant: 'สุ่มร้านให้หน่อย',
    restaurantsBack: 'กลับไปที่ร้านอาหาร',
    restaurantsEmptyTitle: 'ยังไม่มีร้านอาหาร',
    restaurantsEmptyText: 'เร็ว ๆ นี้จะมีร้านอาหารให้เลือกดู',
    menuEmptyTitle: 'ยังไม่มีเมนูของร้านนี้',
    menuEmptyText: 'ลองกลับไปเลือกร้านอื่นดูก่อน',
    openRestaurant: name => `เปิดร้าน ${name}`,
    viewMenu: 'ดูเมนู',
    sodium: 'โซเดียม',
    pickForMe: 'สุ่มเลือกให้',
    pickAgain: 'สุ่มใหม่',
    yourPick: 'เมนูที่เลือกให้',
    randomMeal: 'สุ่มมื้อให้เลย',
    randomMealHeading: 'มื้อนี้ลอง...',
    viewAllMenus: 'ดูเมนูทั้งหมด',
    hideMenus: 'ซ่อนเมนู',
    commonMeal: 'กินเป็นมื้อ',
    configurableMeal: 'มื้อนี้ปรับเปลี่ยนได้',
    estimatedMealTotal: 'รวมทั้งมื้อโดยประมาณ',
    completeMeal: 'มื้ออาหารครบชุด',
    mealIncludesSet: 'โภชนาการด้านบนรวมชุดอาหารนี้แล้ว',
    price: 'ราคา',
    priceChecked: asOf => `ข้อมูลราคา ณ วันที่ ${asOf}`,
    nutritionChecked: asOf => `ข้อมูลโภชนาการ ณ วันที่ ${asOf}`,
    mealContextPilotEyebrow: 'โหมดทดลองโมเดลมื้ออาหาร',
    mealContextPilotTitle: 'ทดลองข้อมูลมื้ออาหารและราคา',
    mealContextPilotNotice: 'ข้อมูลทั้งหมดในหน้านี้เป็นเดโมเพื่อทดสอบ UX เท่านั้น ไม่ใช่ข้อมูลจริงสำหรับการใช้งาน',
    mealContextPilotLocal: 'Pick Focus ในหน้าร้าน',
    mealContextPilotExplore: 'Pick Focus ในหน้าหาเมนู',
    mealContextPilotCases: 'กรณีทดสอบของโมเดล',
    mealContextPilotLoading: 'กำลังโหลดเดโม…',
    pickNoMatches: 'ไม่มีเมนูที่ตรงกับตัวกรองให้สุ่มเลือก',
    explore: 'หาเมนู',
    exploreTitle: 'หาเมนูจากทุกร้าน',
    exploreMatchCount: count => `${count} เมนูที่ตรงกัน`,
    viewRestaurant: name => `ดูร้าน ${name}`,
    exploreGoals: 'เป้าหมายด่วน',
    explorePresetCustomLabel: 'กำหนดเอง',
    exploreGoalsDisclaimer: 'เป้าหมายเหล่านี้เป็นตัวช่วยกรองเมนูทั่วไป ไม่ใช่คำแนะนำทางการแพทย์',
    favoriteRecipesHeading: 'สูตรอาหาร',
    favoriteRestaurantMenusHeading: 'เมนูร้านอาหาร',
    emptyRestaurantFavoritesText: 'ยังไม่มีเมนูร้านอาหารที่บันทึกไว้',
    addMenuFavorite: name => `บันทึก ${name}`,
    removeMenuFavorite: name => `นำ ${name} ออกจากรายการโปรด`,
    restaurantFavoritesStorageNote: 'เมนูร้านอาหารที่บันทึกไว้ยังใช้ได้ในเซสชันนี้ แต่เบราว์เซอร์ไม่พร้อมบันทึกข้อมูล',
    exploreSearchPlaceholder: 'ค้นหาเมนูหรือร้านอาหาร',
    clearSearch: 'ล้างการค้นหา',
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
    pantryDirectResultCount: count => `${count} recipes`,
    pantryNoMatchesTitle: 'No recipes match those ingredients',
    pantryNoMatchesText: 'Try choosing different ingredients or edit your pantry.',
    pantryResults: 'Recipes from your pantry',
    pantrySingleResults: name => `Recipes with ${name}`,
    pantryBack: 'Back to ingredients',
    pantryClear: 'Clear',
    pantrySearchPlaceholder: 'Search ingredients',
    pantrySelectedCount: count => `${count} selected`,
    pantryMatches: (matched, selected) => `Matches ${matched}/${selected} selected ingredients`,
    shopping: 'Shopping',
    shoppingTitle: 'Shopping list',
    shoppingAdd: 'Add to shopping',
    shoppingAdded: 'Added to shopping',
    shoppingServings: 'Servings',
    shoppingDecrease: 'Decrease servings',
    shoppingIncrease: 'Increase servings',
    shoppingSelectedRecipes: 'Selected recipes',
    shoppingIngredients: 'Ingredients to buy',
    shoppingAlreadyHave: 'Already have',
    shoppingPurchased: 'Purchased',
    shoppingRemove: 'Remove',
    shoppingClear: 'Clear shopping list',
    shoppingEmptyTitle: 'No recipes in your shopping list',
    shoppingEmptyText: 'Choose a recipe you want to make, then tap “Add to shopping”.',
    shoppingStorageNote: 'Shopping still works in this session, but the browser could not save it.',
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
    restaurants: 'Restaurants',
    restaurantsTitle: 'Choose a restaurant',
    restaurantPickHeading: 'Your restaurant',
    restaurantPickLabel: 'Random restaurant pick',
    pickRestaurant: 'Pick a restaurant',
    restaurantsBack: 'Back to restaurants',
    restaurantsEmptyTitle: 'No restaurants yet',
    restaurantsEmptyText: 'Restaurants will appear here soon.',
    menuEmptyTitle: 'No menu items yet',
    menuEmptyText: 'Try another restaurant for now.',
    openRestaurant: name => `Open ${name}`,
    viewMenu: 'View menu',
    sodium: 'sodium',
    pickForMe: 'Pick for me',
    pickAgain: 'Pick again',
    yourPick: 'Your pick',
    randomMeal: 'Surprise me',
    randomMealHeading: 'Your random meal',
    viewAllMenus: 'View all menus',
    hideMenus: 'Hide menus',
    commonMeal: 'Common meal',
    configurableMeal: 'Configurable meal',
    estimatedMealTotal: 'Estimated meal total',
    completeMeal: 'Complete meal',
    mealIncludesSet: 'Nutrition above already represents the set.',
    price: 'Price',
    priceChecked: asOf => `Price checked: ${asOf}`,
    nutritionChecked: asOf => `Nutrition checked: ${asOf}`,
    mealContextPilotEyebrow: 'Meal context model pilot',
    mealContextPilotTitle: 'Meal context + price pilot',
    mealContextPilotNotice: 'Everything on this page is demo data for UX validation only, not production facts.',
    mealContextPilotLocal: 'Restaurant-local Pick Focus',
    mealContextPilotExplore: 'Explore Pick Focus',
    mealContextPilotCases: 'Model fixture cases',
    mealContextPilotLoading: 'Loading demo…',
    pickNoMatches: 'No matching items available to pick',
    explore: 'Explore',
    exploreTitle: 'Explore menus across restaurants',
    exploreMatchCount: count => `${count} matching menus`,
    viewRestaurant: name => `View ${name}`,
    exploreGoals: 'Quick goals',
    explorePresetCustomLabel: 'Custom',
    exploreGoalsDisclaimer: 'These goals are general menu filters, not medical advice.',
    favoriteRecipesHeading: 'Recipes',
    favoriteRestaurantMenusHeading: 'Restaurant menus',
    emptyRestaurantFavoritesText: 'No favorite restaurant menus yet.',
    addMenuFavorite: name => `Favorite ${name}`,
    removeMenuFavorite: name => `Remove ${name} from favorites`,
    restaurantFavoritesStorageNote: 'Favorite restaurant menus will stay available for this session, but browser storage is unavailable.',
    exploreSearchPlaceholder: 'Search menus or restaurants',
    clearSearch: 'Clear search',
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

const menuCategoryLabels: Record<MenuCategory, { th: string; en: string }> = {
  'Rice & noodles': { th: 'ข้าวและเส้น', en: 'Rice & noodles' },
  Salad: { th: 'สลัด', en: 'Salad' },
  'Grilled/BBQ': { th: 'ปิ้งย่าง', en: 'Grilled/BBQ' },
  Soup: { th: 'ซุป', en: 'Soup' },
  'Set meal': { th: 'เซ็ต', en: 'Set meal' },
}

export function menuCategoryLabel(locale: Locale, category: MenuCategory) {
  return menuCategoryLabels[category][locale]
}

const nutritionConfidenceLabels: Record<NutritionConfidence, { th: string; en: string }> = {
  official: { th: 'ข้อมูลทางการจากร้าน', en: 'Official' },
  label: { th: 'จากฉลากผลิตภัณฑ์', en: 'Label' },
  curated: { th: 'ประเมินโดยทีมงาน', en: 'Curated estimate' },
  estimated: { th: 'ค่าประมาณ', en: 'Estimated' },
}

export function nutritionConfidenceLabel(locale: Locale, confidence: NutritionConfidence) {
  return nutritionConfidenceLabels[confidence][locale]
}

const explorePresetLabels: Record<ExplorePresetId, { th: string; en: string }> = {
  'high-protein': { th: 'โปรตีนสูง', en: 'High Protein' },
  'light-meal': { th: 'มื้อเบา ๆ', en: 'Light Meal' },
  balanced: { th: 'สมดุล', en: 'Balanced' },
}

const explorePresetSummaries: Record<ExplorePresetId, { th: string; en: string }> = {
  'high-protein': { th: 'โปรตีนอย่างน้อย 30 กรัม • ไม่เกิน 700 kcal', en: 'At least 30g protein • Up to 700 kcal' },
  'light-meal': { th: 'ไม่เกิน 450 kcal', en: 'Up to 450 kcal' },
  balanced: { th: 'ไม่เกิน 650 kcal • โปรตีนอย่างน้อย 25 กรัม • ไขมันไม่เกิน 25 กรัม', en: 'Up to 650 kcal • At least 25g protein • Up to 25g fat' },
}

export function explorePresetLabel(locale: Locale, id: ExplorePresetId) {
  return explorePresetLabels[id][locale]
}

export function explorePresetSummary(locale: Locale, id: ExplorePresetId) {
  return explorePresetSummaries[id][locale]
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
