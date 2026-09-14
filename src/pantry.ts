import type { Locale, Recipe } from './types'

export type IngredientCategory = 'protein' | 'vegetable' | 'carbs' | 'fruit' | 'dairy' | 'plant-protein' | 'pantry'

export type CanonicalIngredient = {
  id: string
  category: IngredientCategory
  name: { th: string; en: string }
}

export const pantryStorageKey = 'goodfood-pantry-v1'

export const canonicalIngredients: readonly CanonicalIngredient[] = [
  { id: 'chicken-breast', category: 'protein', name: { th: 'อกไก่', en: 'Chicken breast' } },
  { id: 'chicken-thigh', category: 'protein', name: { th: 'น่องไก่', en: 'Chicken thigh' } },
  { id: 'chicken-mince', category: 'protein', name: { th: 'ไก่บด', en: 'Chicken mince' } },
  { id: 'pork-tenderloin', category: 'protein', name: { th: 'สันในหมู', en: 'Pork tenderloin' } },
  { id: 'pork-loin', category: 'protein', name: { th: 'สันนอกหมู', en: 'Pork loin' } },
  { id: 'pork-mince', category: 'protein', name: { th: 'หมูบด', en: 'Pork mince' } },
  { id: 'lean-beef', category: 'protein', name: { th: 'เนื้อไม่ติดมัน', en: 'Lean beef' } },
  { id: 'turkey-mince', category: 'protein', name: { th: 'ไก่งวงบด', en: 'Turkey mince' } },
  { id: 'salmon', category: 'protein', name: { th: 'ปลาแซลมอน', en: 'Salmon' } },
  { id: 'white-fish', category: 'protein', name: { th: 'ปลาเนื้อขาว', en: 'White fish' } },
  { id: 'mackerel', category: 'protein', name: { th: 'ปลาแมคเคอเรล', en: 'Mackerel' } },
  { id: 'prawns', category: 'protein', name: { th: 'กุ้ง', en: 'Prawns' } },
  { id: 'tuna', category: 'protein', name: { th: 'ทูน่า', en: 'Tuna' } },
  { id: 'mixed-seafood', category: 'protein', name: { th: 'อาหารทะเลรวม', en: 'Mixed seafood' } },
  { id: 'eggs', category: 'protein', name: { th: 'ไข่', en: 'Eggs' } },

  { id: 'tofu', category: 'plant-protein', name: { th: 'เต้าหู้', en: 'Tofu' } },
  { id: 'edamame', category: 'plant-protein', name: { th: 'ถั่วแระญี่ปุ่น', en: 'Edamame' } },
  { id: 'chickpeas', category: 'plant-protein', name: { th: 'ถั่วชิกพี', en: 'Chickpeas' } },
  { id: 'lentils', category: 'plant-protein', name: { th: 'ถั่วเลนทิล', en: 'Lentils' } },
  { id: 'black-beans', category: 'plant-protein', name: { th: 'ถั่วดำ', en: 'Black beans' } },
  { id: 'white-beans', category: 'plant-protein', name: { th: 'ถั่วขาว', en: 'White beans' } },
  { id: 'hummus', category: 'plant-protein', name: { th: 'ฮัมมุส', en: 'Hummus' } },

  { id: 'cucumber', category: 'vegetable', name: { th: 'แตงกวา', en: 'Cucumber' } },
  { id: 'tomatoes', category: 'vegetable', name: { th: 'มะเขือเทศ', en: 'Tomatoes' } },
  { id: 'mushrooms', category: 'vegetable', name: { th: 'เห็ด', en: 'Mushrooms' } },
  { id: 'broccoli', category: 'vegetable', name: { th: 'บรอกโคลี', en: 'Broccoli' } },
  { id: 'bok-choy', category: 'vegetable', name: { th: 'ผักกวางตุ้ง', en: 'Bok choy' } },
  { id: 'cabbage', category: 'vegetable', name: { th: 'กะหล่ำปลี', en: 'Cabbage' } },
  { id: 'carrot', category: 'vegetable', name: { th: 'แครอท', en: 'Carrot' } },
  { id: 'bell-pepper', category: 'vegetable', name: { th: 'พริกหวาน', en: 'Bell pepper' } },
  { id: 'onion', category: 'vegetable', name: { th: 'หอมใหญ่', en: 'Onion' } },
  { id: 'shallot', category: 'vegetable', name: { th: 'หอมแดง', en: 'Shallot' } },
  { id: 'spinach', category: 'vegetable', name: { th: 'ผักโขม', en: 'Spinach' } },
  { id: 'lettuce', category: 'vegetable', name: { th: 'ผักกาดหอม', en: 'Lettuce' } },
  { id: 'rocket', category: 'vegetable', name: { th: 'ร็อกเก็ต', en: 'Rocket leaves' } },
  { id: 'celery', category: 'vegetable', name: { th: 'ขึ้นฉ่าย', en: 'Celery' } },
  { id: 'zucchini', category: 'vegetable', name: { th: 'ซูกินี', en: 'Zucchini' } },
  { id: 'pumpkin', category: 'vegetable', name: { th: 'ฟักทอง', en: 'Pumpkin' } },
  { id: 'sweet-potato', category: 'vegetable', name: { th: 'มันหวาน', en: 'Sweet potato' } },
  { id: 'green-beans', category: 'vegetable', name: { th: 'ถั่วแขก', en: 'Green beans' } },
  { id: 'long-beans', category: 'vegetable', name: { th: 'ถั่วฝักยาว', en: 'Long beans' } },
  { id: 'eggplant', category: 'vegetable', name: { th: 'มะเขือยาว', en: 'Eggplant' } },
  { id: 'peas', category: 'vegetable', name: { th: 'ถั่วลันเตา', en: 'Green peas' } },
  { id: 'corn', category: 'vegetable', name: { th: 'ข้าวโพด', en: 'Corn' } },
  { id: 'bean-sprouts', category: 'vegetable', name: { th: 'ถั่วงอก', en: 'Bean sprouts' } },
  { id: 'daikon', category: 'vegetable', name: { th: 'หัวไชเท้า', en: 'Daikon' } },
  { id: 'avocado', category: 'vegetable', name: { th: 'อะโวคาโด', en: 'Avocado' } },
  { id: 'basil', category: 'vegetable', name: { th: 'โหระพาและกะเพรา', en: 'Basil' } },
  { id: 'coriander', category: 'vegetable', name: { th: 'ผักชี', en: 'Coriander' } },
  { id: 'mint', category: 'vegetable', name: { th: 'สะระแหน่', en: 'Mint' } },
  { id: 'parsley', category: 'vegetable', name: { th: 'พาร์สลีย์', en: 'Parsley' } },
  { id: 'spring-onion', category: 'vegetable', name: { th: 'ต้นหอม', en: 'Spring onion' } },
  { id: 'garlic', category: 'vegetable', name: { th: 'กระเทียม', en: 'Garlic' } },
  { id: 'ginger', category: 'vegetable', name: { th: 'ขิง', en: 'Ginger' } },
  { id: 'lemongrass', category: 'vegetable', name: { th: 'ตะไคร้', en: 'Lemongrass' } },

  { id: 'lime', category: 'fruit', name: { th: 'มะนาว', en: 'Lime' } },
  { id: 'lemon', category: 'fruit', name: { th: 'เลมอน', en: 'Lemon' } },
  { id: 'mango', category: 'fruit', name: { th: 'มะม่วง', en: 'Mango' } },
  { id: 'papaya', category: 'fruit', name: { th: 'มะละกอ', en: 'Papaya' } },
  { id: 'berries', category: 'fruit', name: { th: 'เบอร์รีรวม', en: 'Mixed berries' } },
  { id: 'mixed-fruit', category: 'fruit', name: { th: 'ผลไม้รวม', en: 'Mixed fruit' } },

  { id: 'greek-yogurt', category: 'dairy', name: { th: 'โยเกิร์ตกรีก', en: 'Greek yogurt' } },
  { id: 'feta', category: 'dairy', name: { th: 'ชีสเฟต้า', en: 'Feta cheese' } },
  { id: 'parmesan', category: 'dairy', name: { th: 'พาร์เมซาน', en: 'Parmesan' } },
  { id: 'milk', category: 'dairy', name: { th: 'นมไขมันต่ำ', en: 'Low-fat milk' } },

  { id: 'brown-rice', category: 'carbs', name: { th: 'ข้าวกล้อง', en: 'Brown rice' } },
  { id: 'jasmine-rice', category: 'carbs', name: { th: 'ข้าวหอมมะลิ', en: 'Jasmine rice' } },
  { id: 'sushi-rice', category: 'carbs', name: { th: 'ข้าวญี่ปุ่น', en: 'Sushi rice' } },
  { id: 'quinoa', category: 'carbs', name: { th: 'ควินัว', en: 'Quinoa' } },
  { id: 'barley', category: 'carbs', name: { th: 'ข้าวบาร์เลย์', en: 'Pearl barley' } },
  { id: 'couscous', category: 'carbs', name: { th: 'คูสคูสโฮลวีต', en: 'Whole-wheat couscous' } },
  { id: 'soba', category: 'carbs', name: { th: 'เส้นโซบะ', en: 'Soba' } },
  { id: 'rice-noodles', category: 'carbs', name: { th: 'เส้นข้าว', en: 'Rice noodles' } },
  { id: 'glass-noodles', category: 'carbs', name: { th: 'วุ้นเส้น', en: 'Glass noodles' } },
  { id: 'rice-vermicelli', category: 'carbs', name: { th: 'เส้นหมี่', en: 'Rice vermicelli' } },
  { id: 'whole-wheat-noodles', category: 'carbs', name: { th: 'เส้นโฮลวีต', en: 'Whole-wheat noodles' } },
  { id: 'udon', category: 'carbs', name: { th: 'เส้นอุด้ง', en: 'Udon' } },
  { id: 'pasta', category: 'carbs', name: { th: 'พาสต้าโฮลวีต', en: 'Whole-wheat pasta' } },
  { id: 'bread', category: 'carbs', name: { th: 'ขนมปังโฮลวีต', en: 'Whole-wheat bread' } },
  { id: 'tortillas', category: 'carbs', name: { th: 'แผ่นแป้งโฮลวีต', en: 'Whole-wheat tortillas' } },
  { id: 'pita', category: 'carbs', name: { th: 'พิต้าโฮลวีต', en: 'Whole-wheat pita' } },
  { id: 'oats', category: 'carbs', name: { th: 'ข้าวโอ๊ต', en: 'Oats' } },
  { id: 'rice-paper', category: 'carbs', name: { th: 'แผ่นแป้งเวียดนาม', en: 'Rice paper' } },

  { id: 'nori', category: 'pantry', name: { th: 'สาหร่ายโนริ', en: 'Nori' } },
  { id: 'stock', category: 'pantry', name: { th: 'น้ำสต๊อก', en: 'Stock' } },
  { id: 'dashi-stock', category: 'pantry', name: { th: 'น้ำซุปดาชิ', en: 'Dashi stock' } },
  { id: 'coconut-milk', category: 'pantry', name: { th: 'กะทิไขมันต่ำ', en: 'Light coconut milk' } },
  { id: 'soy-sauce', category: 'pantry', name: { th: 'ซีอิ๊ว', en: 'Soy sauce' } },
  { id: 'fish-sauce', category: 'pantry', name: { th: 'น้ำปลา', en: 'Fish sauce' } },
  { id: 'teriyaki-sauce', category: 'pantry', name: { th: 'ซอสเทอริยากิ', en: 'Teriyaki sauce' } },
  { id: 'yakisoba-sauce', category: 'pantry', name: { th: 'ซอสยากิโซบะ', en: 'Yakisoba sauce' } },
  { id: 'oyster-sauce', category: 'pantry', name: { th: 'ซอสหอยนางรม', en: 'Oyster sauce' } },
  { id: 'gochujang', category: 'pantry', name: { th: 'โคชูจัง', en: 'Gochujang' } },
  { id: 'kimchi', category: 'pantry', name: { th: 'กิมจิ', en: 'Kimchi' } },
  { id: 'curry-paste', category: 'pantry', name: { th: 'พริกแกง', en: 'Curry paste' } },
  { id: 'chilli-bean-paste', category: 'pantry', name: { th: 'เต้าเจี้ยวพริก', en: 'Chilli bean paste' } },
  { id: 'curry-powder', category: 'pantry', name: { th: 'ผงกะหรี่', en: 'Curry powder' } },
  { id: 'miso', category: 'pantry', name: { th: 'มิโสะ', en: 'Miso' } },
  { id: 'rice-vinegar', category: 'pantry', name: { th: 'น้ำส้มสายชูข้าว', en: 'Rice vinegar' } },
  { id: 'red-wine-vinegar', category: 'pantry', name: { th: 'น้ำส้มสายชูไวน์แดง', en: 'Red wine vinegar' } },
  { id: 'tomato-salsa', category: 'pantry', name: { th: 'ซัลซ่ามะเขือเทศ', en: 'Tomato salsa' } },
  { id: 'pesto', category: 'pantry', name: { th: 'เพสโต', en: 'Basil pesto' } },
  { id: 'peanut-butter', category: 'pantry', name: { th: 'เนยถั่ว', en: 'Peanut butter' } },
  { id: 'peanut-lime-sauce', category: 'pantry', name: { th: 'ซอสถั่วและมะนาว', en: 'Peanut-lime sauce' } },
  { id: 'peanuts', category: 'pantry', name: { th: 'ถั่วลิสง', en: 'Peanuts' } },
  { id: 'cashews', category: 'pantry', name: { th: 'เม็ดมะม่วงหิมพานต์', en: 'Cashews' } },
  { id: 'pumpkin-seeds', category: 'pantry', name: { th: 'เมล็ดฟักทอง', en: 'Pumpkin seeds' } },
  { id: 'chia-seeds', category: 'pantry', name: { th: 'เมล็ดเจีย', en: 'Chia seeds' } },
  { id: 'sesame-seeds', category: 'pantry', name: { th: 'งา', en: 'Sesame seeds' } },
  { id: 'green-tea', category: 'pantry', name: { th: 'ชาเขียว', en: 'Green tea' } },
  { id: 'tom-yum-herbs', category: 'pantry', name: { th: 'สมุนไพรต้มยำ', en: 'Tom yum herbs' } },
  { id: 'toasted-rice-powder', category: 'pantry', name: { th: 'ข้าวคั่ว', en: 'Toasted rice powder' } },
  { id: 'fresh-herbs', category: 'pantry', name: { th: 'สมุนไพรสด', en: 'Fresh herbs' } },
  { id: 'sukiyaki-sauce', category: 'pantry', name: { th: 'น้ำจิ้มสุกี้', en: 'Sukiyaki sauce' } },
  { id: 'ponzu-sauce', category: 'pantry', name: { th: 'ซอสพอนสึ', en: 'Ponzu sauce' } },
  { id: 'mayonnaise', category: 'pantry', name: { th: 'มายองเนส', en: 'Light mayonnaise' } },
  { id: 'chestnuts', category: 'pantry', name: { th: 'เกาลัด', en: 'Chestnuts' } },
]

export const canonicalIngredientIds = new Set(canonicalIngredients.map(ingredient => ingredient.id))

const normalizeIngredientText = (value: string) => value.toLocaleLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

const mappingRules: readonly [RegExp, string][] = [
  [/^tomato salsa/, 'tomato-salsa'],
  [/^pumpkin seeds/, 'pumpkin-seeds'],
  [/^coriander root and garlic/, 'garlic'],
  [/^mint and coriander|^mixed mint and coriander|^parsley and mint/, 'fresh-herbs'],
  [/tom yum herbs/, 'tom-yum-herbs'],
  [/basil pesto/, 'pesto'],
  [/peanut lime sauce/, 'peanut-lime-sauce'],
  [/chilli bean paste/, 'chilli-bean-paste'],
  [/^curry paste|red curry paste|green curry paste/, 'curry-paste'],
  [/^skinless chicken breast/, 'chicken-breast'],
  [/^skinless chicken thigh|^skinless chicken thighs/, 'chicken-thigh'],
  [/^lean chicken mince|^skinless chicken mince/, 'chicken-mince'],
  [/^lean pork tenderloin/, 'pork-tenderloin'],
  [/^lean pork loin/, 'pork-loin'],
  [/^lean pork mince/, 'pork-mince'],
  [/^lean beef mince|^lean beef sirloin|^lean beef strips/, 'lean-beef'],
  [/^lean turkey mince/, 'turkey-mince'],
  [/^sushi grade salmon|^salmon fillets/, 'salmon'],
  [/^cod fillets|^sea bass fillets|^tilapia fillets|^white fish fillets/, 'white-fish'],
  [/^mackerel fillets/, 'mackerel'],
  [/^prawns peeled|^shrimp peeled/, 'prawns'],
  [/^tuna in spring water/, 'tuna'],
  [/^mixed seafood/, 'mixed-seafood'],
  [/^boiled eggs|^eggs?$|^egg$/, 'eggs'],
  [/^firm tofu/, 'tofu'],
  [/^shelled edamame|^edamame cooked/, 'edamame'],
  [/^chickpeas/, 'chickpeas'],
  [/^green lentils|^red lentils/, 'lentils'],
  [/^black beans/, 'black-beans'],
  [/^cannellini beans|^white beans/, 'white-beans'],
  [/^hummus$/, 'hummus'],
  [/^cucumber/, 'cucumber'],
  [/^cherry tomatoes|^ripe tomatoes|^tomatoes|^tomato/, 'tomatoes'],
  [/^mixed mushrooms|^mushrooms|^oyster mushrooms|^shiitake mushrooms/, 'mushrooms'],
  [/^broccoli|^chinese broccoli/, 'broccoli'],
  [/^bok choy/, 'bok-choy'],
  [/^napa cabbage|^chinese cabbage|^cabbage/, 'cabbage'],
  [/^carrot/, 'carrot'],
  [/^red bell pepper|^bell pepper/, 'bell-pepper'],
  [/^red onion|^onion/, 'onion'],
  [/^shallot/, 'shallot'],
  [/^spinach/, 'spinach'],
  [/^romaine lettuce|^butter lettuce|^lettuce/, 'lettuce'],
  [/^rocket leaves/, 'rocket'],
  [/^chinese celery|^celery/, 'celery'],
  [/^zucchini/, 'zucchini'],
  [/^pumpkin/, 'pumpkin'],
  [/^sweet potato/, 'sweet-potato'],
  [/^green beans/, 'green-beans'],
  [/^long beans/, 'long-beans'],
  [/^daikon/, 'daikon'],
  [/^long eggplant|^eggplant|^thai eggplant/, 'eggplant'],
  [/^green peas/, 'peas'],
  [/^corn kernels/, 'corn'],
  [/^bean sprouts/, 'bean-sprouts'],
  [/^avocado/, 'avocado'],
  [/^thai basil|^basil leaves|^thai holy basil/, 'basil'],
  [/^coriander/, 'coriander'],
  [/^mint leaves/, 'mint'],
  [/^parsley/, 'parsley'],
  [/^spring onion/, 'spring-onion'],
  [/^garlic/, 'garlic'],
  [/^ginger/, 'ginger'],
  [/^lemongrass|^galangal and lemongrass/, 'lemongrass'],
  [/^lime juice/, 'lime'],
  [/^green mango/, 'mango'],
  [/^lemon juice|^lemon$/, 'lemon'],
  [/^green papaya/, 'papaya'],
  [/^mixed berries/, 'berries'],
  [/^mixed fruit/, 'mixed-fruit'],
  [/^plain greek yogurt|^greek yogurt/, 'greek-yogurt'],
  [/^feta cheese/, 'feta'],
  [/^parmesan/, 'parmesan'],
  [/^low fat milk/, 'milk'],
  [/^brown rice|^cooked brown rice/, 'brown-rice'],
  [/^jasmine rice|^cooked jasmine rice/, 'jasmine-rice'],
  [/^sushi rice|^cooked sushi rice/, 'sushi-rice'],
  [/quinoa/, 'quinoa'],
  [/^pearl barley/, 'barley'],
  [/^whole wheat couscous/, 'couscous'],
  [/^buckwheat soba/, 'soba'],
  [/^whole wheat rice noodles|^rice noodles/, 'rice-noodles'],
  [/^glass noodles/, 'glass-noodles'],
  [/^rice vermicelli/, 'rice-vermicelli'],
  [/^whole wheat noodles/, 'whole-wheat-noodles'],
  [/^whole wheat udon/, 'udon'],
  [/^whole wheat penne|^whole wheat spaghetti/, 'pasta'],
  [/^whole wheat bread/, 'bread'],
  [/^whole wheat tortillas/, 'tortillas'],
  [/^whole wheat pita/, 'pita'],
  [/^rolled oats|^oats/, 'oats'],
  [/^rice paper sheets/, 'rice-paper'],
  [/^nori sheets/, 'nori'],
  [/^low sodium vegetable stock|^low sodium stock/, 'stock'],
  [/^dashi stock/, 'dashi-stock'],
  [/^light coconut milk/, 'coconut-milk'],
  [/^reduced sodium light soy sauce|^reduced sodium dark soy sauce|^reduced sodium soy sauce|^light soy sauce/, 'soy-sauce'],
  [/^fish sauce/, 'fish-sauce'],
  [/^reduced sodium teriyaki sauce/, 'teriyaki-sauce'],
  [/^reduced sodium yakisoba sauce/, 'yakisoba-sauce'],
  [/^oyster sauce/, 'oyster-sauce'],
  [/^sukiyaki sauce/, 'sukiyaki-sauce'],
  [/^ponzu sauce/, 'ponzu-sauce'],
  [/^light mayonnaise/, 'mayonnaise'],
  [/^gochujang/, 'gochujang'],
  [/^kimchi/, 'kimchi'],
  [/^curry powder/, 'curry-powder'],
  [/^chilli bean paste/, 'chilli-bean-paste'],
  [/^white miso|^miso/, 'miso'],
  [/^rice vinegar/, 'rice-vinegar'],
  [/^red wine vinegar/, 'red-wine-vinegar'],
  [/^tomato salsa/, 'tomato-salsa'],
  [/^natural peanut butter/, 'peanut-butter'],
  [/^roasted peanuts/, 'peanuts'],
  [/^unsalted cashews/, 'cashews'],
  [/^pumpkin seeds/, 'pumpkin-seeds'],
  [/^chia seeds/, 'chia-seeds'],
  [/^sesame seeds/, 'sesame-seeds'],
  [/^brewed green tea/, 'green-tea'],
  [/^toasted rice powder/, 'toasted-rice-powder'],
  [/^crushed tomatoes/, 'tomatoes'],
  [/^cooked chestnuts/, 'chestnuts'],
]

const excludedIngredientRules: readonly RegExp[] = [
  /^neutral oil$/,
  /^olive oil$/,
  /^sesame oil$/,
  /^ground black pepper$/,
  /^chilli flakes$/,
  /^dried chilli flakes$/,
  /^birds eye chilli sliced$/,
  /^cinnamon$/,
  /^ground cardamom$/,
  /^dried oregano$/,
  /^fine salt$/,
  /^brown sugar$/,
  /^star anise$/,
  /^cumin$/,
  /^ground cumin$/,
  /^paprika$/,
  /^chili powder$/,
  /^mild chili seasoning blend$/,
  /^dijon mustard$/,
  /^worcestershire sauce$/,
]

export function canonicalIngredientIdForItem(item: string): string | undefined {
  const normalized = normalizeIngredientText(item)
  if (excludedIngredientRules.some(rule => rule.test(normalized))) return undefined
  const match = mappingRules.find(([rule]) => rule.test(normalized))
  return match?.[1]
}

export function isExcludedPantryIngredient(item: string): boolean {
  return excludedIngredientRules.some(rule => rule.test(normalizeIngredientText(item)))
}

// This product requirement must remain visible as a raw Shopping line. Mapping it
// to ordinary Parmesan would erase the vegetarian-rennet requirement.
export function isShoppingOnlyIngredient(item: string): boolean {
  return /^(?:vegetarian certified hard cheese grated microbial rennet|galangal sliced)$/.test(normalizeIngredientText(item))
}

export const ingredientCategoryOrder: readonly IngredientCategory[] = ['protein', 'vegetable', 'carbs', 'fruit', 'dairy', 'plant-protein', 'pantry']

export function categoryIngredients(category: IngredientCategory) {
  return canonicalIngredients.filter(ingredient => ingredient.category === category)
}

export function countRecipesByIngredient(items: readonly Recipe[]): Record<string, number> {
  const counts: Record<string, number> = Object.fromEntries(canonicalIngredients.map(ingredient => [ingredient.id, 0]))
  for (const recipe of items) {
    const ids = new Set(recipe.ingredients.map(ingredient => ingredient.ingredientId).filter((id): id is string => typeof id === 'string' && canonicalIngredientIds.has(id)))
    for (const id of ids) counts[id] += 1
  }
  return counts
}

export function filterRecipesByIngredient(items: readonly Recipe[], ingredientId: string): Recipe[] {
  if (!canonicalIngredientIds.has(ingredientId)) return []
  return items.filter(recipe => recipe.ingredients.some(ingredient => ingredient.ingredientId === ingredientId))
}

export type PantryMatch = {
  recipe: Recipe
  matchedIngredientIds: string[]
  matchCount: number
  matchPercentage: number
}

export function rankRecipesByPantry(items: readonly Recipe[], selectedIds: readonly string[]): PantryMatch[] {
  const selected = [...new Set(selectedIds)].filter(id => canonicalIngredientIds.has(id))
  if (!selected.length) return []
  const selectedSet = new Set(selected)
  return items.map((recipe, index) => {
    const matchedIngredientIds = [...new Set(recipe.ingredients.map(ingredient => ingredient.ingredientId).filter((id): id is string => typeof id === 'string' && selectedSet.has(id)))]
    return { recipe, matchedIngredientIds, matchCount: matchedIngredientIds.length, matchPercentage: matchedIngredientIds.length / selected.length, index }
  }).filter(match => match.matchCount > 0).sort((a, b) => b.matchCount - a.matchCount || b.matchPercentage - a.matchPercentage || a.index - b.index).map(({ index: _index, ...match }) => match)
}

type PantryStore = Pick<Storage, 'getItem' | 'setItem'>

function getBrowserStorage(): PantryStore | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export function loadPantrySelection(store: Pick<Storage, 'getItem'> | undefined = getBrowserStorage()): string[] {
  try {
    if (!store) return []
    const value = JSON.parse(store.getItem(pantryStorageKey) ?? '[]')
    return Array.isArray(value) && value.every(id => typeof id === 'string')
      ? [...new Set(value)].filter(id => canonicalIngredientIds.has(id))
      : []
  } catch {
    return []
  }
}

export function savePantrySelection(ids: readonly string[], store: Pick<Storage, 'setItem'> | undefined = getBrowserStorage()): boolean {
  try {
    if (!store) return false
    const valid = [...new Set(ids)].filter(id => canonicalIngredientIds.has(id))
    store.setItem(pantryStorageKey, JSON.stringify(valid))
    return true
  } catch {
    return false
  }
}

export function togglePantryIngredient(ids: readonly string[], ingredientId: string): string[] {
  if (!canonicalIngredientIds.has(ingredientId)) return [...ids].filter(id => canonicalIngredientIds.has(id))
  return ids.includes(ingredientId) ? ids.filter(id => id !== ingredientId) : [...ids, ingredientId]
}

export function ingredientName(ingredient: CanonicalIngredient, locale: Locale) {
  return ingredient.name[locale]
}
