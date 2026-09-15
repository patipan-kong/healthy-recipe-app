import type { ExplorePresetId, LocalizedText, MenuCategory, NutritionConfidence, Restaurant, RestaurantMenuFilters, RestaurantMenuItem } from './types'

export const menuCategories: readonly MenuCategory[] = ['Rice & noodles', 'Salad', 'Grilled/BBQ', 'Soup', 'Set meal']

const nutritionConfidences: readonly NutritionConfidence[] = ['official', 'label', 'curated', 'estimated']

// Production pilot dataset (Slice 5): three real restaurant brands with researched
// menu items. Sourcing, interpretation, and confidence rationale for every item are
// recorded in docs/restaurant-nutrition-pilot.md — do not add items here without a
// corresponding ledger entry.
const asOf = '2026-09-14'

const ootoyaSameChainNote = { th: 'อ้างอิงจากข้อมูลโภชนาการของเมนูชื่อเดียวกันจากร้านโอโตยะประเทศญี่ปุ่น (ฐานข้อมูล kalori.jp) เนื่องจากร้านโอโตยะในไทยไม่ได้เผยแพร่ข้อมูลโภชนาการ สูตรในไทยอาจแตกต่างเล็กน้อย', en: "Based on Ootoya Japan's published nutrition for the same-named item (kalori.jp aggregation); Ootoya Thailand does not publish nutrition data, so the Thailand recipe may vary slightly." }
const ootoyaStandardDishNote = { th: 'ไม่พบข้อมูลโภชนาการเฉพาะเมนูนี้จากร้านหรือแหล่งข้อมูลทางการ ค่าที่แสดงเป็นการประเมินโดยทีมงานจากข้อมูลโภชนาการทั่วไปของเมนูญี่ปุ่นประเภทนี้ตามขนาดเสิร์ฟมาตรฐาน', en: 'No restaurant-specific or official nutrition data was found for this dish; values are a professional estimate based on typical nutrition for this standard Japanese dish type and serving size.' }
const saladFactoryEstimateNote = { th: 'ตัวเลขแคลอรีบนเว็บไซต์ร้านไม่สามารถยืนยันได้ว่าแยกจากราคาที่แสดงไว้ จึงไม่ได้นำมาใช้โดยตรง ค่าที่แสดงเป็นการประเมินโดยทีมงานจากข้อมูลโภชนาการทั่วไปของส่วนประกอบที่ระบุไว้ (โปรตีน ผัก น้ำสลัด) ตามขนาดเสิร์ฟมาตรฐาน', en: "Salad Factory's website shows a calorie figure that could not be confirmed as distinct from the listed price, so it was not used. Values are a professional estimate based on typical nutrition for the listed ingredients (protein portion, vegetables, dressing) and standard serving sizes." }
const sevenElevenLabelNote = { th: 'แคลอรี โปรตีน คาร์โบไฮเดรต และโซเดียม อ้างอิงจากฉลากโภชนาการบนบรรจุภัณฑ์ตามที่รายงานไว้ในแหล่งข้อมูลรีวิวผลิตภัณฑ์ (ไม่ได้ตรวจสอบฉลากจริงด้วยตนเอง) ค่าไขมันคำนวณย้อนกลับจากแคลอรี โปรตีน และคาร์โบไฮเดรตตามฉลาก โดยใช้หลักคิด 4/4/9 แคลอรีต่อกรัม เนื่องจากแหล่งข้อมูลไม่แสดงตัวเลขไขมันชัดเจน', en: "Kcal, protein, carbs and sodium as reported from the package nutrition label via a secondary product-review source (package not directly inspected by us); fat is back-calculated from the labeled kcal, protein and carbs using the standard 4/4/9 kcal-per-gram convention, since the source did not clearly show a fat figure." }

// Batch 1 expansion (Slice 11): five more real Thailand restaurant brands. Full
// per-item sourcing, confidence rationale, and restaurant-level research summaries
// are recorded in docs/restaurant-nutrition-pilot.md alongside the Slice 5 pilot.
const asOf11 = '2026-09-15'

const jonesSaladEstimateNote = { th: 'แคลอรีคำนวณจากส่วนประกอบและเผยแพร่บนเว็บไซต์ทางการของร้าน ซึ่งร้านระบุไว้เองว่าอาจมีความคลาดเคลื่อนและไม่สามารถใช้อ้างอิงอย่างเป็นทางการได้ ค่าโปรตีน คาร์โบไฮเดรต และไขมันไม่มีเผยแพร่สำหรับเมนูนี้ จึงเป็นการประเมินโดยทีมงานให้สอดคล้องกับแคลอรีที่ร้านเผยแพร่', en: "Calories are published on the brand's own official nutrition page (an ingredient-based calculation); the brand itself discloses this may contain errors and should not be cited as an authoritative reference. Protein, carbs and fat are not published for this item, so they are a team estimate calibrated to match the brand's published calorie figure." }
const fujiEstimateNote = { th: 'ไม่พบข้อมูลโภชนาการที่เผยแพร่โดยร้านฟูจิหรือแหล่งข้อมูลบุคคลที่สามที่น่าเชื่อถือสำหรับเมนูนี้ (ร้านฟูจิเป็นแบรนด์สัญชาติไทยที่ก่อตั้งในกรุงเทพฯ ไม่มีเครือร้านฟูจิในญี่ปุ่นที่เทียบเคียงได้ จึงไม่สามารถใช้ข้อมูลข้ามตลาดได้) ค่าพลังงานและสารอาหารเป็นการประเมินโดยทีมงานจากส่วนประกอบและขนาดเสิร์ฟตามเมนูจริงของร้าน', en: "No nutrition data was found published by Fuji itself or by a credible third-party source for this item (Fuji is a Thailand-founded brand with no comparable Japan-based chain of the same name, so no cross-market proxy is available either). Values are a team estimate based on the dish's real ingredients and typical serving size as listed on the official menu." }
const mkOfficialCalorieNote = { th: 'ค่าแคลอรีเผยแพร่โดยเว็บไซต์ทางการของ MK ต่อเมนู แต่ร้านไม่ได้เผยแพร่ค่าโปรตีน คาร์โบไฮเดรต หรือไขมัน ค่าพลังงานจึงยึดตามตัวเลขที่ร้านเผยแพร่ ส่วนค่าโปรตีน คาร์โบไฮเดรต และไขมันเป็นการประเมินโดยทีมงานให้สอดคล้องกับแคลอรีดังกล่าว โดยอ้างอิงจากส่วนประกอบทั่วไปของเมนูสุกี้ประเภทนี้', en: "Calories are published per item on MK's own official website, but MK does not publish protein, carbs, or fat for any item. The stated calorie figure is taken directly from MK's site; protein, carbs, and fat are a team estimate calibrated to match that calorie figure, based on the typical composition of this type of suki dish." }
const sukiyaCuratedNote = { th: "ร้านสุคิยะสาขาประเทศไทยไม่เผยแพร่ข้อมูลโภชนาการ ค่าที่แสดงอ้างอิงจากตารางโภชนาการอย่างเป็นทางการของสุคิยะประเทศญี่ปุ่น (บริษัทเซ็นโช อัปเดตล่าสุด 8 ก.ย. 2026) สำหรับเมนูชื่อเดียวกัน/แนวคิดเดียวกัน โดยเทียบขนาดเสิร์ฟแบบ 'ปกติ' ของญี่ปุ่นกับขนาด 'M' ของไทย ซึ่งยังไม่สามารถยืนยันได้ว่ามีปริมาณเท่ากันทุกประการ สูตรอาหารระหว่างสองประเทศอาจแตกต่างกันเล็กน้อย ค่าโซเดียมคำนวณจากปริมาณเกลือ (กรัม) ที่ร้านเผยแพร่ โดยใช้สูตรมาตรฐาน โซเดียม(มก.) ≈ เกลือ(กรัม) × 1000 ÷ 2.5", en: "Sukiya's Thailand branches do not publish nutrition data. Figures shown are from Sukiya Japan's own official nutrition table (Zensho Co., Ltd.; source last updated 2026-09-08) for the same-named/same-concept dish, mapping Japan's 'regular' (並盛) serving to Thailand's 'M' size — this size correspondence is not confirmed to be exact, and recipes may differ slightly between the two markets. Sodium is derived from Japan's published salt-equivalent (g) using the standard conversion sodium(mg) ≈ salt(g) × 1000 ÷ 2.5." }
const santaFeEstimateNote = { th: 'ไม่พบข้อมูลโภชนาการที่เผยแพร่โดยร้านซานตาเฟ่หรือแหล่งข้อมูลบุคคลที่สามที่น่าเชื่อถือสำหรับเมนูนี้ ชื่อเมนูภาษาไทยยืนยันจากบล็อกอาหารบุคคลที่สาม (ไม่ใช่เว็บไซต์ทางการ เนื่องจากเมนูทางการอยู่ในรูปแบบภาพเท่านั้น) ค่าพลังงานและสารอาหารเป็นการประเมินโดยทีมงานจากส่วนประกอบและขนาดเสิร์ฟทั่วไปของเมนูประเภทนี้', en: "No nutrition data was found published by Santa Fe' Steak or by a credible third-party source for this item. The Thai menu name is confirmed via a third-party food-listing blog (not the official site, since the official site's menu is image-only). Values are a team estimate based on typical ingredients and serving size for this type of dish." }

export const restaurants: Restaurant[] = [
  {
    id: 'ootoya-thailand',
    name: { th: 'โอโตยะ', en: 'Ootoya' },
    cuisine: { th: 'อาหารญี่ปุ่นสไตล์บ้าน (เซ็ตทีโชกุ)', en: 'Japanese home cooking (teishoku)' },
    tags: ['japanese'],
  },
  {
    id: 'salad-factory-thailand',
    name: { th: 'สลัดแฟคทอรี่', en: 'Salad Factory' },
    cuisine: { th: 'สลัดและอาหารเพื่อสุขภาพ', en: 'Salads & healthy bowls' },
    tags: ['salad'],
  },
  {
    id: 'seven-eleven-thailand',
    name: { th: 'เซเว่น อีเลฟเว่น', en: '7-Eleven Thailand' },
    cuisine: { th: 'อาหารพร้อมทานบรรจุภัณฑ์', en: 'Packaged ready-to-eat meals' },
    tags: ['convenience', 'packaged'],
  },
  {
    id: 'jones-salad-thailand',
    name: { th: 'โจนส์ สลัด', en: "Jones' Salad" },
    cuisine: { th: 'สลัดและอาหารเพื่อสุขภาพ', en: 'Healthy salads & fast real food' },
    tags: ['salad'],
  },
  {
    id: 'fuji-japanese-restaurant-thailand',
    name: { th: 'ฟูจิ', en: 'Fuji Japanese Restaurant' },
    cuisine: { th: 'อาหารญี่ปุ่น (ย่าง ซาซิมิ ข้าวหน้า)', en: 'Japanese cuisine (grilled dishes, sashimi-style salads, rice bowls)' },
    tags: ['japanese'],
  },
  {
    id: 'mk-restaurants-thailand',
    name: { th: 'เอ็มเคสุกี้', en: 'MK Restaurants' },
    cuisine: { th: 'สุกี้ยากี้และหม้อร้อน', en: 'Thai-style sukiyaki & hot pot' },
    tags: ['suki', 'hotpot'],
  },
  {
    id: 'sukiya-thailand',
    name: { th: 'สุคิยะ', en: 'Sukiya' },
    cuisine: { th: 'อาหารญี่ปุ่น (ข้าวหน้าเนื้อ)', en: 'Japanese cuisine (gyudon beef rice bowls)' },
    tags: ['japanese'],
  },
  {
    id: 'santa-fe-steak-thailand',
    name: { th: 'ซานตาเฟ่', en: "Santa Fe' Steak" },
    cuisine: { th: 'สเต็กและอาหารย่าง', en: 'Steaks & grilled dishes' },
    tags: ['steak'],
  },
]

export const restaurantMenuItems: RestaurantMenuItem[] = [
  {
    id: 'ootoya-grilled-mackerel',
    restaurantId: 'ootoya-thailand',
    name: { th: 'ปลาซาบะย่างถ่าน', en: 'Charcoal-Grilled Mackerel' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 540, protein: 29.9, carbs: 8.3, fat: 46.3 },
    nutritionSource: { confidence: 'curated', note: ootoyaSameChainNote, asOf },
    tags: ['fish', 'grilled', 'high-protein'],
    servingNote: { th: 'เสิร์ฟแบบเดี่ยว ไม่รวมข้าวและซุปมิโสะ', en: 'Served à la carte; rice and miso soup are not included in this figure.' },
  },
  {
    id: 'ootoya-shima-hokke-grilled',
    restaurantId: 'ootoya-thailand',
    name: { th: 'ปลาชิมาฮอกเกะย่างถ่าน', en: 'Charcoal-Grilled Shima Hokke' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 282, protein: 39.5, carbs: 7.9, fat: 12 },
    nutritionSource: { confidence: 'curated', note: ootoyaSameChainNote, asOf },
    tags: ['fish', 'grilled', 'high-protein', 'low-carb'],
    servingNote: { th: 'เสิร์ฟแบบเดี่ยว ไม่รวมข้าวและซุปมิโสะ', en: 'Served à la carte; rice and miso soup are not included in this figure.' },
  },
  {
    id: 'ootoya-grilled-moromi-chicken',
    restaurantId: 'ootoya-thailand',
    name: { th: 'ไก่ย่างถ่านซอสโมโรมิ', en: 'Charcoal-Grilled Chicken with Moromi Sauce' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 336, protein: 35.1, carbs: 21.5, fat: 13.6 },
    nutritionSource: { confidence: 'curated', note: ootoyaSameChainNote, asOf },
    tags: ['chicken', 'grilled', 'high-protein'],
    servingNote: { th: 'เสิร์ฟแบบเดี่ยว ไม่รวมข้าวและซุปมิโสะ', en: 'Served à la carte; rice and miso soup are not included in this figure.' },
    customizationNotes: [{ th: 'สามารถขอซอสโมโรมิแยกต่างหากเพื่อลดโซเดียมที่ได้รับ', en: 'You can ask for the moromi sauce on the side to manage sodium intake' }],
  },
  {
    id: 'ootoya-oyakodon',
    restaurantId: 'ootoya-thailand',
    name: { th: 'ข้าวหน้าไก่โอยาโกะ', en: 'Oyakodon (Chicken & Egg Rice Bowl)' },
    category: 'Rice & noodles',
    nutrition: { kcal: 610, protein: 27, carbs: 78, fat: 18 },
    nutritionSource: { confidence: 'estimated', note: ootoyaStandardDishNote, asOf },
    tags: ['chicken', 'rice'],
    servingNote: { th: 'หนึ่งชาม รวมข้าว', en: 'One rice bowl, includes rice.' },
  },
  {
    id: 'ootoya-tonteki-pork-chop-set',
    restaurantId: 'ootoya-thailand',
    name: { th: 'เซ็ตพอร์คช็อปย่างถ่านสไตล์ทงเทกิ', en: 'Charcoal-Grilled Tonteki Pork Chop Set' },
    category: 'Set meal',
    nutrition: { kcal: 750, protein: 40, carbs: 70, fat: 36 },
    nutritionSource: { confidence: 'estimated', note: ootoyaStandardDishNote, asOf },
    tags: ['pork', 'grilled', 'high-protein'],
    servingNote: { th: 'เสิร์ฟเป็นเซ็ต พร้อมข้าว ซุปมิโสะ และผักดอง', en: 'Served as a set with rice, miso soup, and pickled vegetables.' },
  },
  {
    id: 'ootoya-grilled-salmon-rice-bowl',
    restaurantId: 'ootoya-thailand',
    name: { th: 'ข้าวหน้าปลาแซลมอนย่าง', en: 'Grilled Salmon Rice Bowl' },
    category: 'Rice & noodles',
    nutrition: { kcal: 640, protein: 30, carbs: 80, fat: 20 },
    nutritionSource: { confidence: 'estimated', note: ootoyaStandardDishNote, asOf },
    tags: ['fish', 'rice', 'high-protein'],
    servingNote: { th: 'หนึ่งชาม รวมข้าว', en: 'One rice bowl, includes rice.' },
  },
  {
    id: 'salad-factory-grilled-chicken-sesame',
    restaurantId: 'salad-factory-thailand',
    name: { th: 'สลัดอกไก่ย่างสไตล์ญี่ปุ่น ซอสงา', en: 'Japanese-Style Grilled Chicken Breast Salad, Sesame Dressing' },
    category: 'Salad',
    nutrition: { kcal: 430, protein: 36, carbs: 18, fat: 22 },
    nutritionSource: { confidence: 'estimated', note: saladFactoryEstimateNote, asOf },
    tags: ['chicken', 'salad', 'high-protein', 'grilled'],
    customizationNotes: [{ th: 'หากต้องการลดพลังงาน แนะนำให้ขอน้ำสลัดแยกต่างหาก', en: 'For a lighter option, consider asking for the dressing on the side' }],
  },
  {
    id: 'salad-factory-quinoa-chicken-basil',
    restaurantId: 'salad-factory-thailand',
    name: { th: 'สลัดควินัวอกไก่ย่าง กะเพราเผ็ด', en: 'Quinoa Salad with Grilled Chicken Breast, Spicy Holy Basil' },
    category: 'Salad',
    nutrition: { kcal: 480, protein: 35, carbs: 46, fat: 16 },
    nutritionSource: { confidence: 'estimated', note: saladFactoryEstimateNote, asOf },
    tags: ['chicken', 'salad', 'high-protein'],
  },
  {
    id: 'salad-factory-kale-chicken-truffle',
    restaurantId: 'salad-factory-thailand',
    name: { th: 'สลัดคะน้าอกไก่ ซอสทรัฟเฟิล', en: 'Kale Salad with Chicken Breast, Truffle Dressing' },
    category: 'Salad',
    nutrition: { kcal: 450, protein: 32, carbs: 20, fat: 26 },
    nutritionSource: { confidence: 'estimated', note: saladFactoryEstimateNote, asOf },
    tags: ['chicken', 'salad', 'high-protein'],
  },
  {
    id: 'salad-factory-rocket-skirt-steak',
    restaurantId: 'salad-factory-thailand',
    name: { th: 'สลัดร็อกเก็ตเนื้อสเต็กย่าง ซอสบัลซามิก', en: 'Rocket Salad with Grilled Skirt Steak, Balsamic' },
    category: 'Salad',
    nutrition: { kcal: 400, protein: 30, carbs: 12, fat: 25 },
    nutritionSource: { confidence: 'estimated', note: saladFactoryEstimateNote, asOf },
    tags: ['beef', 'salad', 'high-protein', 'low-carb'],
  },
  {
    id: 'salad-factory-spicy-pork-tenderloin',
    restaurantId: 'salad-factory-thailand',
    name: { th: 'สลัดสันในหมูรสแซ่บ', en: 'Spicy Pork Tenderloin Salad' },
    category: 'Salad',
    nutrition: { kcal: 380, protein: 32, carbs: 20, fat: 17 },
    nutritionSource: { confidence: 'estimated', note: saladFactoryEstimateNote, asOf },
    tags: ['pork', 'salad', 'high-protein'],
    customizationNotes: [{ th: 'สามารถแจ้งขอน้ำยำแยกต่างหากได้ที่ร้าน', en: 'You can ask staff for the spicy dressing on the side' }],
  },
  {
    id: 'salad-factory-salmon-sashimi-shoyu',
    restaurantId: 'salad-factory-thailand',
    name: { th: 'สลัดแซลมอนซาชิมิ ซอสโชยุวาซาบิ', en: 'Salmon Sashimi Salad, Shoyu-Wasabi Dressing' },
    category: 'Salad',
    nutrition: { kcal: 340, protein: 24, carbs: 12, fat: 22 },
    nutritionSource: { confidence: 'estimated', note: saladFactoryEstimateNote, asOf },
    tags: ['fish', 'salad', 'high-protein', 'low-carb'],
  },
  {
    id: 'seven-eleven-chicken-sukiyaki',
    restaurantId: 'seven-eleven-thailand',
    name: { th: 'ข้าวหน้าไก่สุกี้ (อีซี่ ช้อยส์)', en: 'Ezy Choice Chicken Sukiyaki Rice' },
    category: 'Rice & noodles',
    nutrition: { kcal: 270, protein: 19, carbs: 30, fat: 8, sodium: 1220 },
    nutritionSource: { confidence: 'label', note: sevenElevenLabelNote, asOf },
    tags: ['chicken', 'rice', 'ready-to-eat', 'packaged'],
    servingNote: { th: 'บรรจุภัณฑ์พร้อมทาน 1 กล่อง', en: 'One packaged ready-to-eat meal.' },
  },
  {
    id: 'seven-eleven-garlic-pork-egg-rice',
    restaurantId: 'seven-eleven-thailand',
    name: { th: 'ข้าวหมูกระเทียมไข่ดาว (อีซี่โก)', en: 'Ezygo Garlic Pork with Fried Egg and Rice' },
    category: 'Rice & noodles',
    nutrition: { kcal: 390, protein: 22, carbs: 54, fat: 10, sodium: 520 },
    nutritionSource: { confidence: 'label', note: sevenElevenLabelNote, asOf },
    tags: ['pork', 'rice', 'ready-to-eat', 'packaged', 'high-protein'],
    servingNote: { th: 'บรรจุภัณฑ์พร้อมทาน 1 กล่อง', en: 'One packaged ready-to-eat meal.' },
  },
  {
    id: 'seven-eleven-green-curry-chicken',
    restaurantId: 'seven-eleven-thailand',
    name: { th: 'ข้าวแกงเขียวหวานอกไก่ (เชฟแคร์)', en: 'Chef Cares Green Curry with Chicken Breast and Jasmine Rice' },
    category: 'Rice & noodles',
    nutrition: { kcal: 360, protein: 19, carbs: 56, fat: 7, sodium: 640 },
    nutritionSource: { confidence: 'label', note: sevenElevenLabelNote, asOf },
    tags: ['chicken', 'rice', 'ready-to-eat', 'packaged'],
    servingNote: { th: 'บรรจุภัณฑ์พร้อมทาน 1 กล่อง', en: 'One packaged ready-to-eat meal.' },
  },
  {
    id: 'seven-eleven-pork-bulgogi-rice',
    restaurantId: 'seven-eleven-thailand',
    name: { th: 'ข้าวหมูบูลโกกิ (แฮปปี้ เชฟ)', en: 'Happy Chef Pork Bulgogi Rice' },
    category: 'Rice & noodles',
    nutrition: { kcal: 290, protein: 14, carbs: 54, fat: 2, sodium: 670 },
    nutritionSource: { confidence: 'label', note: sevenElevenLabelNote, asOf },
    tags: ['pork', 'rice', 'ready-to-eat', 'packaged'],
    servingNote: { th: 'บรรจุภัณฑ์พร้อมทาน 1 กล่อง', en: 'One packaged ready-to-eat meal.' },
  },
  {
    id: 'seven-eleven-korean-chicken-fried-rice',
    restaurantId: 'seven-eleven-thailand',
    name: { th: 'ข้าวผัดไก่เกาหลี (อีซี่โก)', en: 'Ezygo Korean Chicken Fried Rice' },
    category: 'Rice & noodles',
    nutrition: { kcal: 440, protein: 17, carbs: 57, fat: 16, sodium: 890 },
    nutritionSource: { confidence: 'label', note: sevenElevenLabelNote, asOf },
    tags: ['chicken', 'rice', 'ready-to-eat', 'packaged'],
    servingNote: { th: 'บรรจุภัณฑ์พร้อมทาน 1 กล่อง', en: 'One packaged ready-to-eat meal.' },
  },
  {
    id: 'seven-eleven-sticky-rice-dried-pork',
    restaurantId: 'seven-eleven-thailand',
    name: { th: 'ข้าวเหนียวหมูฝอย น้ำแจ่ว', en: 'Sticky Rice with Dried Pork and Jaew Sauce' },
    category: 'Rice & noodles',
    nutrition: { kcal: 380, protein: 13, carbs: 63, fat: 8, sodium: 1030 },
    nutritionSource: { confidence: 'label', note: sevenElevenLabelNote, asOf },
    tags: ['pork', 'rice', 'ready-to-eat', 'packaged'],
    servingNote: { th: 'บรรจุภัณฑ์พร้อมทาน 1 กล่อง', en: 'One packaged ready-to-eat meal.' },
  },
  {
    id: 'jones-chicken-sesame-salad',
    restaurantId: 'jones-salad-thailand',
    name: { th: 'สลัดอกไก่งาขาวคั่ว', en: 'Grilled Chicken Breast Salad, Roasted Sesame Dressing' },
    category: 'Salad',
    nutrition: { kcal: 385, protein: 28, carbs: 15, fat: 24 },
    nutritionSource: { confidence: 'estimated', note: jonesSaladEstimateNote, asOf: asOf11 },
    tags: ['chicken', 'salad', 'high-protein'],
    customizationNotes: [{ th: 'หากต้องการลดพลังงาน สามารถขอน้ำสลัดแยกต่างหากได้ (ค่าพลังงานแบบไม่ใส่น้ำสลัดคือประมาณ 262 กิโลแคลอรี ตามข้อมูลของร้าน)', en: "For fewer calories, you can ask for the dressing on the side (the brand's own without-dressing figure is about 262 kcal)." }],
  },
  {
    id: 'jones-grilled-salmon-salad',
    restaurantId: 'jones-salad-thailand',
    name: { th: 'สลัดแซลมอนย่าง', en: 'Grilled Salmon Salad' },
    category: 'Salad',
    nutrition: { kcal: 420, protein: 22, carbs: 12, fat: 32 },
    nutritionSource: { confidence: 'estimated', note: jonesSaladEstimateNote, asOf: asOf11 },
    tags: ['fish', 'salad', 'high-protein'],
    customizationNotes: [{ th: 'สามารถขอน้ำสลัดแยกต่างหากเพื่อลดพลังงานได้ (ไม่ใส่น้ำสลัดประมาณ 317 กิโลแคลอรี ตามข้อมูลของร้าน)', en: "You can ask for the dressing on the side to reduce calories (without dressing is about 317 kcal per the brand's figure)." }],
  },
  {
    id: 'jones-caesar-chicken-salad',
    restaurantId: 'jones-salad-thailand',
    name: { th: 'สลัดซีซาร์ไก่', en: 'Caesar Chicken Salad' },
    category: 'Salad',
    nutrition: { kcal: 372, protein: 26, carbs: 14, fat: 24 },
    nutritionSource: { confidence: 'estimated', note: jonesSaladEstimateNote, asOf: asOf11 },
    tags: ['chicken', 'salad'],
    customizationNotes: [{ th: 'สามารถขอน้ำสลัดแยกต่างหากเพื่อลดพลังงานได้ (ไม่ใส่น้ำสลัดประมาณ 213 กิโลแคลอรี ตามข้อมูลของร้าน)', en: "You can ask for the dressing on the side to reduce calories (without dressing is about 213 kcal per the brand's figure)." }],
  },
  {
    id: 'jones-chicken-larb-crispy-rice-salad',
    restaurantId: 'jones-salad-thailand',
    name: { th: 'สลัดลาบอกไก่และข้าวพอง', en: 'Chicken Larb & Crispy Rice Salad' },
    category: 'Salad',
    nutrition: { kcal: 345, protein: 22, carbs: 28, fat: 16 },
    nutritionSource: { confidence: 'estimated', note: jonesSaladEstimateNote, asOf: asOf11 },
    tags: ['chicken', 'salad'],
    customizationNotes: [{ th: 'สามารถขอน้ำยำแยกต่างหากเพื่อลดพลังงานได้ (ไม่ใส่น้ำยำประมาณ 228 กิโลแคลอรี ตามข้อมูลของร้าน)', en: "You can ask for the dressing on the side to reduce calories (without dressing is about 228 kcal per the brand's figure)." }],
  },
  {
    id: 'jones-caribbean-chicken-steak',
    restaurantId: 'jones-salad-thailand',
    name: { th: 'สเต็กอกไก่แคริบเบียน', en: 'Caribbean Chicken Breast Steak' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 446, protein: 38, carbs: 18, fat: 24 },
    nutritionSource: { confidence: 'estimated', note: jonesSaladEstimateNote, asOf: asOf11 },
    tags: ['chicken', 'grilled', 'high-protein'],
    customizationNotes: [{ th: 'สามารถขอซอสแยกต่างหากเพื่อลดพลังงานได้ (ไม่ใส่ซอสประมาณ 394 กิโลแคลอรี ตามข้อมูลของร้าน)', en: "You can ask for the sauce on the side to reduce calories (without sauce is about 394 kcal per the brand's figure)." }],
  },
  {
    id: 'jones-honey-lemon-basa-steak',
    restaurantId: 'jones-salad-thailand',
    name: { th: 'สเต็กปลาบาซา ฮันนี่เลมอน', en: 'Honey Lemon Basa Fish Steak' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 413, protein: 31, carbs: 32, fat: 16 },
    nutritionSource: { confidence: 'estimated', note: jonesSaladEstimateNote, asOf: asOf11 },
    tags: ['fish', 'grilled'],
    customizationNotes: [{ th: 'สามารถขอซอสแยกต่างหากเพื่อลดพลังงานได้ (ไม่ใส่ซอสประมาณ 357 กิโลแคลอรี ตามข้อมูลของร้าน)', en: "You can ask for the sauce on the side to reduce calories (without sauce is about 357 kcal per the brand's figure)." }],
  },
  {
    id: 'jones-mushroom-soup',
    restaurantId: 'jones-salad-thailand',
    name: { th: 'ซุปเห็ด', en: 'Mushroom Soup' },
    category: 'Soup',
    nutrition: { kcal: 172, protein: 4, carbs: 14, fat: 10 },
    nutritionSource: { confidence: 'estimated', note: jonesSaladEstimateNote, asOf: asOf11 },
    tags: ['vegetarian', 'soup'],
  },
  {
    id: 'fuji-salmon-shioyaki-brown-rice-set',
    restaurantId: 'fuji-japanese-restaurant-thailand',
    name: { th: 'ชุดปลาแซลมอนย่างเกลือข้าวกล้องธัญพืช', en: 'Salmon Shioyaki with Brown Rice Set' },
    category: 'Set meal',
    nutrition: { kcal: 520, protein: 34, carbs: 55, fat: 16 },
    nutritionSource: { confidence: 'estimated', note: fujiEstimateNote, asOf: asOf11 },
    tags: ['fish', 'grilled', 'high-protein'],
    servingNote: { th: 'เสิร์ฟเป็นเซ็ต พร้อมข้าวกล้องธัญพืช', en: 'Served as a set with brown rice.' },
  },
  {
    id: 'fuji-salmon-shioyaki',
    restaurantId: 'fuji-japanese-restaurant-thailand',
    name: { th: 'ปลาแซลมอนย่างเกลือ', en: 'Grilled Salmon Shioyaki' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 340, protein: 30, carbs: 3, fat: 23 },
    nutritionSource: { confidence: 'estimated', note: fujiEstimateNote, asOf: asOf11 },
    tags: ['fish', 'grilled', 'high-protein', 'low-carb'],
    servingNote: { th: 'เสิร์ฟแบบเดี่ยว ไม่รวมข้าว', en: 'Served à la carte; rice is not included.' },
  },
  {
    id: 'fuji-salmon-tataki',
    restaurantId: 'fuji-japanese-restaurant-thailand',
    name: { th: 'ยำปลาแซลมอน', en: 'Salmon Tataki Salad' },
    category: 'Salad',
    nutrition: { kcal: 270, protein: 20, carbs: 14, fat: 15 },
    nutritionSource: { confidence: 'estimated', note: fujiEstimateNote, asOf: asOf11 },
    tags: ['fish', 'salad', 'low-carb'],
  },
  {
    id: 'fuji-kinoko-mushroom-salad',
    restaurantId: 'fuji-japanese-restaurant-thailand',
    name: { th: 'สลัดเห็ด', en: 'Kinoko (Mushroom) Salad' },
    category: 'Salad',
    nutrition: { kcal: 150, protein: 5, carbs: 16, fat: 8 },
    nutritionSource: { confidence: 'estimated', note: fujiEstimateNote, asOf: asOf11 },
    tags: ['vegetarian', 'salad', 'low-carb'],
  },
  {
    id: 'fuji-chicken-teriyaki',
    restaurantId: 'fuji-japanese-restaurant-thailand',
    name: { th: 'ไก่ย่างซีอิ๊ว', en: 'Chicken Teriyaki' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 310, protein: 28, carbs: 18, fat: 14 },
    nutritionSource: { confidence: 'estimated', note: fujiEstimateNote, asOf: asOf11 },
    tags: ['chicken', 'grilled', 'high-protein'],
  },
  {
    id: 'fuji-chirashi-sushi-don-set',
    restaurantId: 'fuji-japanese-restaurant-thailand',
    name: { th: 'ชุดข้าวหน้าปลาดิบรวม', en: 'Chirashi Sushi Rice Bowl Set' },
    category: 'Rice & noodles',
    nutrition: { kcal: 560, protein: 26, carbs: 78, fat: 14 },
    nutritionSource: { confidence: 'estimated', note: fujiEstimateNote, asOf: asOf11 },
    tags: ['fish', 'rice'],
    servingNote: { th: 'หนึ่งชาม รวมข้าว', en: 'One rice bowl, includes rice.' },
  },
  {
    id: 'mk-health-vegetable-set-small',
    restaurantId: 'mk-restaurants-thailand',
    name: { th: 'ชุดผักเพื่อสุขภาพ เล็ก', en: 'Health Vegetable Set (Small)' },
    category: 'Soup',
    nutrition: { kcal: 213, protein: 9, carbs: 30, fat: 6 },
    nutritionSource: { confidence: 'estimated', note: mkOfficialCalorieNote, asOf: asOf11 },
    tags: ['vegetarian', 'hotpot', 'low-carb'],
    servingNote: { th: 'เสิร์ฟดิบสำหรับต้มในหม้อสุกี้', en: 'Served raw for cooking in the shared hot-pot broth.' },
  },
  {
    id: 'mk-special-vegetable-set',
    restaurantId: 'mk-restaurants-thailand',
    name: { th: 'ชุดผักพิเศษ', en: 'Special Vegetable Set' },
    category: 'Soup',
    nutrition: { kcal: 90, protein: 3, carbs: 14, fat: 2 },
    nutritionSource: { confidence: 'estimated', note: mkOfficialCalorieNote, asOf: asOf11 },
    tags: ['vegetarian', 'hotpot', 'low-carb'],
    servingNote: { th: 'เสิร์ฟดิบสำหรับต้มในหม้อสุกี้', en: 'Served raw for cooking in the shared hot-pot broth.' },
  },
  {
    id: 'mk-special-kurobuta-set',
    restaurantId: 'mk-restaurants-thailand',
    name: { th: 'ชุดคุโรบูตะสเปเชียล', en: 'Special Kurobuta Set' },
    category: 'Soup',
    nutrition: { kcal: 303, protein: 18, carbs: 10, fat: 22 },
    nutritionSource: { confidence: 'estimated', note: mkOfficialCalorieNote, asOf: asOf11 },
    tags: ['pork', 'hotpot'],
    servingNote: { th: 'เสิร์ฟดิบสำหรับต้มในหม้อสุกี้', en: 'Served raw for cooking in the shared hot-pot broth.' },
  },
  {
    id: 'mk-special-kurobuta-plate',
    restaurantId: 'mk-restaurants-thailand',
    name: { th: 'คุโรบูตะสเปเชียล', en: 'Special Kurobuta (Single Plate)' },
    category: 'Soup',
    nutrition: { kcal: 96, protein: 9, carbs: 1, fat: 6 },
    nutritionSource: { confidence: 'estimated', note: mkOfficialCalorieNote, asOf: asOf11 },
    tags: ['pork', 'hotpot', 'high-protein', 'low-carb'],
    servingNote: { th: 'เสิร์ฟดิบ 1 จาน สำหรับต้มในหม้อสุกี้', en: 'Served raw, one plate, for cooking in the shared hot-pot broth.' },
  },
  {
    id: 'mk-premium-suki-set',
    restaurantId: 'mk-restaurants-thailand',
    name: { th: 'ชุดสุกี้พรีเมียมหม้อเดี่ยว', en: 'Premium Suki Set (Single Pot)' },
    category: 'Soup',
    nutrition: { kcal: 382, protein: 24, carbs: 16, fat: 26 },
    nutritionSource: { confidence: 'estimated', note: mkOfficialCalorieNote, asOf: asOf11 },
    tags: ['pork', 'seafood', 'hotpot'],
    servingNote: { th: 'เสิร์ฟดิบสำหรับต้มในหม้อสุกี้ 1 หม้อ', en: 'Served raw for cooking in one shared hot pot.' },
  },
  {
    id: 'mk-seafood-suki-broth',
    restaurantId: 'mk-restaurants-thailand',
    name: { th: 'สุกี้ทะเล (น้ำ)', en: 'Seafood Suki (Prepared, Broth Style)' },
    category: 'Soup',
    nutrition: { kcal: 239, protein: 20, carbs: 18, fat: 10 },
    nutritionSource: { confidence: 'estimated', note: mkOfficialCalorieNote, asOf: asOf11 },
    tags: ['fish', 'seafood', 'hotpot', 'high-protein'],
    servingNote: { th: 'เสิร์ฟพร้อมทานในน้ำซุป 1 ชาม', en: 'Served ready-to-eat, one bowl in broth.' },
  },
  {
    id: 'mk-pork-shabu',
    restaurantId: 'mk-restaurants-thailand',
    name: { th: 'หมูชาบู', en: 'Pork Shabu' },
    category: 'Soup',
    nutrition: { kcal: 193, protein: 17, carbs: 2, fat: 13 },
    nutritionSource: { confidence: 'estimated', note: mkOfficialCalorieNote, asOf: asOf11 },
    tags: ['pork', 'hotpot', 'high-protein', 'low-carb'],
    servingNote: { th: 'เสิร์ฟดิบ 1 จาน สำหรับลวกในหม้อสุกี้', en: 'Served raw, one plate, for cooking in the shared hot-pot broth.' },
  },
  {
    id: 'sukiya-gyudon-regular',
    restaurantId: 'sukiya-thailand',
    name: { th: 'ข้าวหน้าเนื้อ (ไซส์ M)', en: 'Gyudon Beef Rice Bowl (M)' },
    category: 'Rice & noodles',
    nutrition: { kcal: 695, protein: 21.7, carbs: 99.8, fat: 23.4, sodium: 960 },
    nutritionSource: { confidence: 'curated', note: sukiyaCuratedNote, asOf: asOf11 },
    tags: ['beef', 'rice'],
    servingNote: { th: "ข้าวหน้าเนื้อไซส์ M ของไทย เทียบเคียงกับขนาด 'ปกติ' ของญี่ปุ่น (ยังไม่ยืนยันปริมาณเท่ากันทุกประการ)", en: "Thailand's M-size gyudon, mapped to Japan's 'regular' serving (exact portion match not confirmed)." },
  },
  {
    id: 'sukiya-gyudon-okra-regular',
    restaurantId: 'sukiya-thailand',
    name: { th: 'ข้าวหน้าเนื้อโอคุระ (ไซส์ M)', en: 'Gyudon with Bonito Flakes & Okra (M)' },
    category: 'Rice & noodles',
    nutrition: { kcal: 716, protein: 23.5, carbs: 103.5, fat: 23.5, sodium: 1320 },
    nutritionSource: { confidence: 'curated', note: sukiyaCuratedNote, asOf: asOf11 },
    tags: ['beef', 'rice', 'fiber'],
    servingNote: { th: "ข้าวหน้าเนื้อไซส์ M ของไทย เทียบเคียงกับขนาด 'ปกติ' ของญี่ปุ่น (ยังไม่ยืนยันปริมาณเท่ากันทุกประการ)", en: "Thailand's M-size gyudon, mapped to Japan's 'regular' serving (exact portion match not confirmed)." },
  },
  {
    id: 'sukiya-curry-rice-regular',
    restaurantId: 'sukiya-thailand',
    name: { th: 'ข้าวแกงกะหรี่ (ไซส์ M)', en: 'Japanese Curry Rice (M)' },
    category: 'Rice & noodles',
    nutrition: { kcal: 653, protein: 12.8, carbs: 115.2, fat: 15.7, sodium: 1440 },
    nutritionSource: { confidence: 'curated', note: sukiyaCuratedNote, asOf: asOf11 },
    tags: ['vegetarian', 'rice'],
    servingNote: { th: "ข้าวแกงกะหรี่ไซส์ M (สูตรพื้นฐาน ไม่ใส่เนื้อสัตว์) เทียบเคียงกับขนาด 'ปกติ' ของญี่ปุ่น (ยังไม่ยืนยันปริมาณเท่ากันทุกประการ)", en: "Plain M-size curry rice (no added meat topping), mapped to Japan's 'regular' serving (exact portion match not confirmed)." },
  },
  {
    id: 'sukiya-beef-plate-no-rice',
    restaurantId: 'sukiya-thailand',
    name: { th: 'เนื้อสุคิยะ (ไซส์ M)', en: 'Beef Plate, No Rice (M)' },
    category: 'Soup',
    nutrition: { kcal: 297, protein: 15, carbs: 9.9, fat: 22, sodium: 960 },
    nutritionSource: { confidence: 'curated', note: sukiyaCuratedNote, asOf: asOf11 },
    tags: ['beef', 'hotpot', 'low-carb'],
    servingNote: { th: "เนื้อไซส์ M ไม่รวมข้าว เทียบเคียงกับขนาด 'ปกติ' ของญี่ปุ่น เสิร์ฟดิบสำหรับต้มในหม้อสุกี้", en: "M-size beef without rice, mapped to Japan's 'regular' serving; served raw for cooking in the hot pot." },
  },
  {
    id: 'sukiya-salad',
    restaurantId: 'sukiya-thailand',
    name: { th: 'สลัด', en: 'Salad' },
    category: 'Salad',
    nutrition: { kcal: 28, protein: 1.5, carbs: 5.9, fat: 0.3, sodium: 40 },
    nutritionSource: { confidence: 'curated', note: sukiyaCuratedNote, asOf: asOf11 },
    tags: ['vegetarian', 'salad', 'low-carb'],
    servingNote: { th: 'ค่าพลังงานนี้ไม่รวมน้ำสลัด ไม่ทราบแน่ชัดว่าสลัดที่เสิร์ฟจริงในไทยใส่น้ำสลัดมาด้วยหรือไม่ หากมีน้ำสลัด พลังงานจริงอาจสูงกว่านี้', en: "This figure excludes dressing. It is unclear whether the Thailand-served salad includes dressing by default — if so, actual calories may be meaningfully higher." },
  },
  {
    id: 'sukiya-miso-soup',
    restaurantId: 'sukiya-thailand',
    name: { th: 'ซุปมิโสะ', en: 'Miso Soup' },
    category: 'Soup',
    nutrition: { kcal: 38, protein: 2.4, carbs: 4.3, fat: 1.4, sodium: 880 },
    nutritionSource: { confidence: 'curated', note: sukiyaCuratedNote, asOf: asOf11 },
    tags: ['soup', 'vegetarian'],
    servingNote: { th: 'โซเดียมค่อนข้างสูงเมื่อเทียบกับปริมาณแคลอรี ควรพิจารณาหากติดตามการบริโภคโซเดียม', en: 'Sodium is disproportionately high relative to the calorie count — worth noting if tracking sodium intake.' },
  },
  {
    id: 'santa-fe-grilled-chicken-pepper-steak',
    restaurantId: 'santa-fe-steak-thailand',
    name: { th: 'สเต๊กไก่ ซอสเปปเปอร์', en: 'Grilled Chicken Steak, Pepper Sauce' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 320, protein: 34, carbs: 8, fat: 17 },
    nutritionSource: { confidence: 'estimated', note: santaFeEstimateNote, asOf: asOf11 },
    tags: ['chicken', 'grilled', 'high-protein'],
  },
  {
    id: 'santa-fe-salmon-steak',
    restaurantId: 'santa-fe-steak-thailand',
    name: { th: 'แซลมอนสเต๊ก', en: 'Salmon Steak' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 400, protein: 32, carbs: 4, fat: 29 },
    nutritionSource: { confidence: 'estimated', note: santaFeEstimateNote, asOf: asOf11 },
    tags: ['fish', 'grilled', 'high-protein', 'low-carb'],
  },
  {
    id: 'santa-fe-dory-fish-steak',
    restaurantId: 'santa-fe-steak-thailand',
    name: { th: 'สเต๊กปลาดอรี่', en: 'Dory Fish Steak' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 280, protein: 26, carbs: 8, fat: 17 },
    nutritionSource: { confidence: 'estimated', note: santaFeEstimateNote, asOf: asOf11 },
    tags: ['fish', 'grilled'],
  },
  {
    id: 'santa-fe-seabass-steak',
    restaurantId: 'santa-fe-steak-thailand',
    name: { th: 'สเต๊กปลากระพง', en: 'Seabass Steak' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 260, protein: 28, carbs: 6, fat: 15 },
    nutritionSource: { confidence: 'estimated', note: santaFeEstimateNote, asOf: asOf11 },
    tags: ['fish', 'grilled', 'high-protein', 'low-carb'],
  },
  {
    id: 'santa-fe-kurobuta-pork-chop',
    restaurantId: 'santa-fe-steak-thailand',
    name: { th: 'หมูคุโรบุตะพอร์คช้อป', en: 'Kurobuta Pork Chop' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 410, protein: 33, carbs: 6, fat: 29 },
    nutritionSource: { confidence: 'estimated', note: santaFeEstimateNote, asOf: asOf11 },
    tags: ['pork', 'grilled', 'high-protein'],
  },
  {
    id: 'santa-fe-chicken-steak-jaew',
    restaurantId: 'santa-fe-steak-thailand',
    name: { th: 'สเต๊กไก่ 2 ชิ้น ซอสแจ่ว', en: 'Chicken Steak (2 Pieces), Jaew Sauce' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 260, protein: 26, carbs: 10, fat: 13 },
    nutritionSource: { confidence: 'estimated', note: santaFeEstimateNote, asOf: asOf11 },
    tags: ['chicken', 'grilled'],
  },
  {
    id: 'santa-fe-premium-beef-steak',
    restaurantId: 'santa-fe-steak-thailand',
    name: { th: 'สเต๊กโคขุน เนื้อนำเข้า', en: 'Premium Fattened Beef Steak, Imported' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 430, protein: 35, carbs: 5, fat: 31 },
    nutritionSource: { confidence: 'estimated', note: santaFeEstimateNote, asOf: asOf11 },
    tags: ['beef', 'grilled', 'high-protein'],
  },
]

export const emptyRestaurantMenuFilters: RestaurantMenuFilters = {}

// A missing nutrition field never satisfies a max/min constraint on that
// field — unknown is not treated as zero, so it cannot silently pass.
export function filterRestaurantMenuItems(items: RestaurantMenuItem[], filters: RestaurantMenuFilters): RestaurantMenuItem[] {
  return items.filter(item =>
    (filters.maxKcal === undefined || item.nutrition.kcal <= filters.maxKcal) &&
    (filters.minProtein === undefined || item.nutrition.protein >= filters.minProtein) &&
    (filters.maxCarbs === undefined || item.nutrition.carbs <= filters.maxCarbs) &&
    (filters.maxFat === undefined || item.nutrition.fat <= filters.maxFat) &&
    (filters.maxSodium === undefined || (item.nutrition.sodium !== undefined && item.nutrition.sodium <= filters.maxSodium))
  )
}

// Simple local substring search over the static pilot dataset (Slice 9): matches
// against menu-item and owning-restaurant names in both locales regardless of the
// current UI locale. Not a search index or ranking system — appropriate only for
// the current small item count.
export function searchRestaurantMenuItems(items: RestaurantMenuItem[], restaurantsList: Restaurant[], rawQuery: string): RestaurantMenuItem[] {
  const query = rawQuery.trim().toLocaleLowerCase()
  if (!query) return items
  return items.filter(item => {
    const restaurant = restaurantsList.find(candidate => candidate.id === item.restaurantId)
    return [item.name.th, item.name.en, restaurant?.name.th, restaurant?.name.en]
      .filter((value): value is string => Boolean(value))
      .join(' ')
      .toLocaleLowerCase()
      .includes(query)
  })
}

// Quick Explore goals (Slice 6): a UX convenience layer that pre-fills
// RestaurantMenuFilters with product heuristics, not a nutrition engine or
// saved user profile. Sodium is deliberately excluded — the pilot dataset's
// sodium coverage is incomplete, and a preset maxSodium would silently
// exclude every item with unknown sodium (see filterRestaurantMenuItems).
export const explorePresetIds: readonly ExplorePresetId[] = ['high-protein', 'light-meal', 'balanced']

export const explorePresetFilters: Record<ExplorePresetId, RestaurantMenuFilters> = {
  'high-protein': { maxKcal: 700, minProtein: 30 },
  'light-meal': { maxKcal: 450 },
  balanced: { maxKcal: 650, minProtein: 25, maxFat: 25 },
}

const explorePresetFilterFields: readonly (keyof RestaurantMenuFilters)[] = ['maxKcal', 'minProtein', 'maxCarbs', 'maxFat', 'maxSodium']

// Preset selection is derived from `filters` rather than tracked as separate
// state, so there is exactly one effective RestaurantMenuFilters value: a
// manual edit that no longer matches any preset's exact field set simply
// stops matching here, with no extra state to keep in sync.
export function matchingExplorePresetId(filters: RestaurantMenuFilters): ExplorePresetId | undefined {
  return explorePresetIds.find(id => explorePresetFilterFields.every(field => filters[field] === explorePresetFilters[id][field]))
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function hasLocalizedText(value: unknown): value is LocalizedText {
  return typeof value === 'object' && value !== null && hasText((value as Record<string, unknown>).th) && hasText((value as Record<string, unknown>).en)
}

export function validateRestaurants(items: Restaurant[]): string[] {
  const errors: string[] = []
  if (!Array.isArray(items)) return ['Invalid restaurant array']
  const ids = new Set<string>()
  for (const rawRestaurant of items) {
    const restaurant = (rawRestaurant && typeof rawRestaurant === 'object' ? rawRestaurant : {}) as Partial<Restaurant>
    const id = hasText(restaurant.id) ? restaurant.id : '(missing id)'
    if (!hasText(restaurant.id)) errors.push(`Missing restaurant id: ${id}`)
    else if (ids.has(id)) errors.push(`Duplicate restaurant id: ${id}`)
    ids.add(id)
    if (!hasLocalizedText(restaurant.name)) errors.push(`Missing restaurant name: ${id}`)
  }
  return errors
}

export function validateRestaurantMenuItems(items: RestaurantMenuItem[], knownRestaurants: readonly Restaurant[]): string[] {
  const errors: string[] = []
  if (!Array.isArray(items)) return ['Invalid restaurant menu item array']
  const restaurantIds = new Set(knownRestaurants.map(restaurant => restaurant.id))
  const ids = new Set<string>()
  const hasNutrition = (value: unknown): value is RestaurantMenuItem['nutrition'] =>
    typeof value === 'object' && value !== null &&
    ['kcal', 'protein', 'carbs', 'fat'].every(key => typeof (value as Record<string, unknown>)[key] === 'number' && Number.isFinite((value as Record<string, number>)[key]) && (value as Record<string, number>)[key] >= 0) &&
    Object.values(value).every(number => typeof number === 'number' && Number.isFinite(number) && number >= 0)

  for (const rawItem of items) {
    const item = (rawItem && typeof rawItem === 'object' ? rawItem : {}) as Partial<RestaurantMenuItem>
    const id = hasText(item.id) ? item.id : '(missing id)'
    if (!hasText(item.id)) errors.push(`Missing menu item id: ${id}`)
    else if (ids.has(id)) errors.push(`Duplicate menu item id: ${id}`)
    ids.add(id)
    if (!hasLocalizedText(item.name)) errors.push(`Missing menu item name: ${id}`)
    if (!hasText(item.restaurantId) || !restaurantIds.has(item.restaurantId)) errors.push(`Unknown restaurantId: ${id}`)
    if (!menuCategories.includes(item.category as MenuCategory)) errors.push(`Invalid category: ${id}`)
    if (!hasNutrition(item.nutrition)) errors.push(`Invalid nutrition: ${id}`)
    else {
      const macroKcal = item.nutrition.protein * 4 + item.nutrition.carbs * 4 + item.nutrition.fat * 9
      if (Math.abs(item.nutrition.kcal - macroKcal) > 180) errors.push(`Nutrition sanity range: ${id}`)
    }
    if (!item.nutritionSource || typeof item.nutritionSource !== 'object' || !nutritionConfidences.includes(item.nutritionSource.confidence as NutritionConfidence)) errors.push(`Invalid nutrition source: ${id}`)
    if (!Array.isArray(item.tags)) errors.push(`Invalid tags: ${id}`)
  }
  return errors
}
