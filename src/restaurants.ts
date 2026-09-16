import type { ExplorePresetId, LocalizedText, MenuCategory, NutritionConfidence, Restaurant, RestaurantMenuFilters, RestaurantMenuItem } from './types'
import { isValidNutrition, validateMealContext, validateMenuImage, validateMenuPrice } from './meal-context'

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

// Batch 2 expansion (Slice 14): five more real Thailand restaurant brands,
// selected from an eight-candidate research pool (three deferred — see
// docs/restaurant-nutrition-pilot.md for the full selection gate and
// per-restaurant research summaries, including the three deferred
// candidates). No official/label/curated nutrition source was found for any
// of the eight candidates researched; every Batch 2 item is `estimated`.
const asOf14 = '2026-09-15'

const nittayaEstimateNote = { th: 'ร้านนิตยาไก่ย่างไม่เผยแพร่ข้อมูลโภชนาการต่อเมนู ชื่อเมนูและราคายืนยันจากเว็บไซต์ทางการ (nittayakaiyang.com) และหน้าร้านสาขาต่างๆ บน Wongnai ค่าพลังงานและสารอาหารเป็นการประเมินโดยทีมงานจากส่วนประกอบและขนาดเสิร์ฟทั่วไปของเมนูแต่ละจาน โดยไม่ปัดตัวเลขน้ำตาลหรือน้ำปลาในส้มตำและไข่เค็มให้ต่ำกว่าความเป็นจริง', en: "Nittaya Kai Yang does not publish nutrition data for any item. Menu names and prices are confirmed via the official site (nittayakaiyang.com) and multiple branch listings on Wongnai. Kcal/macros are a team estimate based on typical ingredients and serving size for each dish, without underestimating the sugar/fish-sauce/salted-egg content that drives sodium in the papaya-salad items." }
const zaabEliEstimateNote = { th: 'ร้านแซ่บอีลี่ไม่มีเว็บไซต์ทางการ แต่มีตัวตนที่ยืนยันได้ชัดเจนผ่านบัญชี Instagram/Facebook ทางการและรายชื่อสาขาบน Wongnai/OpenRice ไม่พบข้อมูลโภชนาการที่เผยแพร่จากร้านหรือแหล่งข้อมูลที่น่าเชื่อถือ ค่าพลังงานและสารอาหารเป็นการประเมินโดยทีมงานจากส่วนประกอบและขนาดเสิร์ฟทั่วไป', en: "Zaab Eli has no dedicated corporate website, but its identity is well confirmed via official Instagram/Facebook accounts and multiple branch listings on Wongnai/OpenRice. No nutrition data was found published by the brand or any credible third party. Kcal/macros are a team estimate based on typical ingredients and serving size." }
const zaabEliFusionNote = { th: 'เมนูนี้เป็นสูตรฟิวชันที่ไม่สามารถยืนยันส่วนประกอบที่แน่นอนได้ (เช่น น้ำจิ้ม/ซอสหวานเพิ่มเติม) ค่าคาร์โบไฮเดรตที่แสดงจึงเป็นค่าประมาณขั้นต่ำ ไม่ใช่ค่าสูงสุด', en: "This is a fusion recipe whose exact composition (e.g. added sweet sauces) could not be confirmed, so the carb figure shown is a floor estimate, not a ceiling." }
const somtamNuaEstimateNote = { th: 'ส้มตำนัวเป็นร้านอิสระที่มีชื่อเสียง ไม่ใช่เชนขนาดใหญ่ และไม่มีเว็บไซต์ทางการหรือข้อมูลโภชนาการที่เผยแพร่ ชื่อเมนูยืนยันจากบล็อกอาหารอิสระหลายแหล่งที่สอดคล้องกัน ค่าพลังงานเป็นการประเมินจากส่วนประกอบ โดยใช้ฐาน "เสิร์ฟทั้งจาน" ตามที่ร้านขายจริง เนื่องจากส้มตำ/ลาบ/ไก่ทอด มักสั่งเป็นจานเดียวสำหรับแบ่งกันกิน ไม่ใช่หนึ่งที่ต่อคน และไม่มีข้อมูลว่าปกติแบ่งกันกี่คน', en: "Somtam Nua is a well-known independent restaurant, not a large chain, and has no official website or published nutrition data. Menu item names are confirmed via multiple independent food blogs that agree with each other. Kcal/macros are composition-based estimates using a whole-dish serving basis, matching how these dishes are actually ordered (papaya salad/larb/fried chicken are typically one shared plate per table) — since no reliable per-person split is known, the figures shown are for the whole plate as served, not a fabricated per-person portion." }
const thongSmithEstimateNote = { th: 'ทองสมิทธ์เป็นร้านก๋วยเตี๋ยวเรือ/ข้าวต้มพรีเมียมที่มีสาขาจำนวนมากในห้างสรรพสินค้า ไม่ใช่ร้านไก่ย่าง/อีสานตามที่สันนิษฐานไว้ในตอนแรกของการวิจัย ไม่มีเว็บไซต์ทางการที่แสดงเมนูและราคา ชื่อเมนูยืนยันจากรายงานสื่อ (THE STANDARD, Tatler Asia) และบล็อกรีวิวอาหาร ไม่พบข้อมูลโภชนาการที่เผยแพร่จากร้านหรือแหล่งข้อมูลที่น่าเชื่อถือ ค่าพลังงานและสารอาหารเป็นการประเมินโดยทีมงานจากส่วนประกอบและขนาดเสิร์ฟทั่วไปของก๋วยเตี๋ยว/ข้าวหนึ่งชาม', en: "ThongSmith is a premium boat-noodle/rice-soup restaurant with many mall branches — not a grilled-chicken/Isan brand as originally assumed when this research began. It has no official website with menu/prices; item names are confirmed via media coverage (THE STANDARD, Tatler Asia) and food-review blogs. No nutrition data was found published by the brand or any credible third party. Kcal/macros are a team estimate based on typical ingredients and serving size for one noodle/rice bowl." }
const steakAndMoreEstimateNote = { th: 'เดอะสเต๊กแอนด์มอร์ดำเนินการโดยไมเนอร์ฟู้ด เปิดตัวปลายปี 2024 และขยายสาขาอย่างรวดเร็ว ยืนยันตัวตนจากเว็บไซต์บริษัทแม่ (minorfood.com) แต่ไม่มีข้อมูลโภชนาการเผยแพร่ที่ใดเลยเนื่องจากเป็นแบรนด์ใหม่ ชื่อเมนูยืนยันจากหน้าสาขาบน Wongnai และเอกสารประชาสัมพันธ์ของไมเนอร์ฟู้ด ค่าพลังงานและสารอาหารเป็นการประเมินโดยทีมงาน โดยเมนูสเต็กรวมค่าประมาณของเครื่องเคียง/สลัด/ขนมปังที่มักเสิร์ฟมาด้วยตามชุด', en: "The Steak & More is operated by Minor Food, launched in late 2024 and has expanded rapidly. Brand identity is confirmed via the parent company's own site (minorfood.com), but no nutrition data is published anywhere for this new brand. Menu item names are confirmed via Wongnai branch listings and Minor Food's own press materials. Kcal/macros are a team estimate; steak items' estimates include the bundled side salad/bread typically served with the set, not just the protein alone." }

// Slice 17B production research (2026-09-15). Evidence and rejected sources
// are recorded item-by-item in docs/restaurant-meal-context-price-research-17b.md.
const asOf17b = '2026-09-15'
const currentListedPriceNote = { th: 'ราคาที่ตรวจสอบจากเมนูปัจจุบัน อาจแตกต่างตามสาขาหรือข้อยกเว้นที่ร้านระบุ', en: 'Current listed menu price; branch exceptions may apply.' }
const ootoyaSetMealContextNote = { th: 'หลักฐานเมนูไทยแสดงทั้งแบบจานเดี่ยวและแบบเซ็ต โดยเซ็ตมีข้าว ซุปมิโสะ และเครื่องเคียงเป็นองค์ประกอบของมื้อ แต่ยังไม่พบข้อมูลโภชนาการส่วนเพิ่มที่เป็นทางการของไทย', en: 'Thailand menu evidence shows both à la carte and set options with rice, miso soup, and side items; no Thailand-specific addition nutrition was published.' }
const ootoyaShimaAdditionNutritionNote = { th: 'โภชนาการส่วนเพิ่มเป็นค่าประมาณจากการหักค่าโภชนาการเมนูเดี่ยวออกจากค่าเซ็ตปลาชิมาฮอกเกะอย่างเป็นทางการของ Ootoya Japan ไม่ใช่ข้อมูลโภชนาการทางการของประเทศไทย และยังไม่ทราบโซเดียมของส่วนเพิ่ม', en: "Addition nutrition is estimated by subtracting Ootoya Japan's official Shima Hokke single-item values from its official set values; it is not Thailand-official, and addition sodium remains unknown." }
const ootoyaCompleteSetNote = { th: 'เซ็ตนี้รวมข้าว ซุปมิโสะ และผักดองแล้ว จึงไม่ควรบวกส่วนเพิ่มซ้ำ', en: 'This listed set already includes rice, miso soup, and pickled vegetables; do not add another meal component.' }
const santaFeConfigurableMealContext = {
  kind: 'configurable' as const,
  label: { th: 'เครื่องเคียงหรือซอสอาจแตกต่างตามที่เลือก', en: 'Sides or sauce may vary by selection.' },
  note: { th: 'สารอาหารด้านบนอ้างอิงจากเมนูหลัก จึงยังไม่ประเมินสารอาหารรวมทั้งมื้อ', en: 'Nutrition above refers to the base menu serving; a full-meal total is not estimated.' },
}

// Slice 18 real-food-image pilot (2026-09-15). Research methodology, rejected
// candidates, and rights assessment are recorded in docs/restaurant-image-pilot-18.md.
// Images are hotlinked to Ootoya Thailand's own official site (ootoya.co.th), not
// bundled, since redistribution rights are not explicit — only remote linking to
// the brand's own hosted copy was judged defensible.
const asOf18 = '2026-09-15'
const ootoyaImageSourceLabel = { th: 'ภาพจากเว็บไซต์ทางการของโอโตยะ', en: 'Image from Ootoya official website' }

// Slice 19 real-food-image expansion batch 1 (2026-09-15). Research methodology,
// rejected candidates, and rights assessment are recorded in
// docs/restaurant-image-expansion-19.md. Images remain hotlinked to each brand's
// own official site/ordering platform, not bundled, matching the Slice 18 policy.
const asOf19 = '2026-09-15'
const saladFactoryImageSourceLabel = { th: 'ภาพจากเว็บไซต์ทางการของสลัดแฟคทอรี่', en: 'Image from Salad Factory official website' }
const sevenElevenImageSourceLabel = { th: 'ภาพจากเว็บไซต์ทางการ All Online ของเซเว่น อีเลฟเว่น', en: 'Image from 7-Eleven official AllOnline website' }

// Slice 20 menu-price coverage expansion (2026-09-15). Research methodology,
// rejected candidates, and the Ootoya Tonteki price correction are recorded in
// docs/restaurant-price-expansion-20.md. Price freshness (`asOf20`) is tracked
// independently of nutrition `asOf` — a new price never backdates or forward-dates
// the nutrition record it sits next to.
const asOf20 = '2026-09-15'
const oyakodonIndividualPriceNote = { th: 'ราคานี้คือราคา "จานเดียว" ไม่ใช่ราคาชุดที่มีซุปมิโสะและเครื่องเคียงเพิ่มเติม ซึ่งมีราคาแยกต่างหาก', en: 'This is the "single plate" (individual bowl) price, not the set version, which adds miso soup and side dishes for an additional fee.' }
const mkPremiumSukiBranchPriceNote = { th: 'ราคานี้จำหน่ายเฉพาะสาขาเซ็นทรัลเวิลด์และสามย่านมิตรทาวน์เท่านั้น สาขาอื่นอาจมีราคาต่างกันหรือไม่มีเมนูนี้', en: 'This price applies only at the CentralWorld and Samyan Mitrtown branches; other branches may price this differently or not carry this item.' }

// Slice 22 menu-price coverage expansion batch 2 (2026-09-15). Research
// methodology, rejected candidates, and the MK audit confirmation are
// recorded in docs/restaurant-price-expansion-22.md.
const asOf22 = '2026-09-15'

// Slice 24 real-food-image expansion batch 2 (2026-09-16). Research methodology,
// rejected candidates (including the Sukiya menu-sheet-collage rejection), and
// rights assessment are recorded in docs/restaurant-image-expansion-24.md.
// Images remain hotlinked to each brand's own official site, not bundled,
// matching the Slice 18/19 policy.
const asOf24 = '2026-09-16'
const fujiImageSourceLabel = { th: 'ภาพจากเว็บไซต์ทางการของฟูจิ', en: 'Image from Fuji official website' }
const mkImageSourceLabel = { th: 'ภาพจากเว็บไซต์ทางการของเอ็มเค', en: 'Image from MK official website' }

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
    visualIdentity: { kind: 'initials', label: { th: 'SF', en: 'SF' } },
  },
  {
    id: 'seven-eleven-thailand',
    name: { th: 'เซเว่น อีเลฟเว่น', en: '7-Eleven Thailand' },
    cuisine: { th: 'อาหารพร้อมทานบรรจุภัณฑ์', en: 'Packaged ready-to-eat meals' },
    tags: ['convenience', 'packaged'],
    visualIdentity: { kind: 'initials', label: { th: '7', en: '7' } },
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
    visualIdentity: { kind: 'initials', label: { th: 'SK', en: 'SK' } },
  },
  {
    id: 'santa-fe-steak-thailand',
    name: { th: 'ซานตาเฟ่', en: "Santa Fe' Steak" },
    cuisine: { th: 'สเต็กและอาหารย่าง', en: 'Steaks & grilled dishes' },
    tags: ['steak'],
  },
  {
    id: 'nittaya-kai-yang-thailand',
    name: { th: 'นิตยาไก่ย่าง', en: 'Nittaya Kai Yang' },
    cuisine: { th: 'อาหารอีสาน (ไก่ย่าง ส้มตำ ลาบ)', en: 'Isan cuisine (grilled chicken, papaya salad, larb)' },
    tags: ['isan', 'grilled'],
    visualIdentity: { kind: 'initials', label: { th: 'นก', en: 'NKY' } },
  },
  {
    id: 'zaab-eli-thailand',
    name: { th: 'แซ่บอีลี่', en: 'Zaab Eli' },
    cuisine: { th: 'อาหารอีสานสมัยใหม่ (ส้มตำ ยำ ไก่ย่าง)', en: 'Modern Isan cuisine (papaya salad, spicy salads, grilled chicken)' },
    tags: ['isan', 'grilled'],
  },
  {
    id: 'somtam-nua-thailand',
    name: { th: 'ส้มตำนัว', en: 'Somtam Nua' },
    cuisine: { th: 'อาหารอีสาน (ส้มตำ ลาบ)', en: 'Isan cuisine (papaya salad, larb)' },
    tags: ['isan', 'salad'],
  },
  {
    id: 'thongsmith-boat-noodle-thailand',
    name: { th: 'ทองสมิทธ์', en: 'ThongSmith' },
    cuisine: { th: 'ก๋วยเตี๋ยวเรือพรีเมียมและข้าวต้ม', en: 'Premium boat noodles & Thai rice dishes' },
    tags: ['noodles'],
  },
  {
    id: 'steak-and-more-thailand',
    name: { th: 'เดอะสเต๊กแอนด์มอร์', en: 'The Steak & More' },
    cuisine: { th: 'สเต็กราคาย่อมเยาและอาหารไทยฟิวชัน', en: 'Value steaks & Thai-fusion sides' },
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
    mealContext: { kind: 'add-on', label: { th: 'ข้าว + ซุปมิโสะ + เครื่องเคียง (ตัวเลือกเซ็ต)', en: 'Rice + miso soup + side items (set option)' }, note: ootoyaSetMealContextNote },
    price: { amount: 279, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
    menuImage: {
      src: 'https://www.ootoya.co.th/upload_file/menu/Fish-Menu/%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B8%8B%E0%B8%B2%E0%B8%9A%E0%B8%B0%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%99-big.png',
      alt: { th: 'ปลาซาบะย่างถ่านเสิร์ฟกับหัวไชเท้าขูดและสลัดสาหร่ายวากาเมะ', en: 'Charcoal-grilled mackerel served with grated daikon and a wakame seaweed side' },
      kind: 'official-remote',
      sourceUrl: 'https://www.ootoya.co.th/menu-details.php?id=3',
      sourceLabel: ootoyaImageSourceLabel,
      asOf: asOf18,
    },
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
    mealContext: {
      kind: 'add-on',
      label: { th: 'ข้าว + ซุปมิโสะ + เครื่องเคียง (ตัวเลือกเซ็ต)', en: 'Rice + miso soup + side items (set option)' },
      additionNutrition: { kcal: 330, protein: 6, carbs: 70, fat: 1.1, fiber: 1.4 },
      additionNutritionSource: { confidence: 'estimated', asOf: asOf17b, note: ootoyaShimaAdditionNutritionNote },
      note: ootoyaSetMealContextNote,
    },
    price: { amount: 399, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
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
    price: { amount: 259, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
    menuImage: {
      src: 'https://www.ootoya.co.th/upload_file/menu/Grilled-Menu/%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%8B%E0%B8%AD%E0%B8%AA%E0%B9%82%E0%B8%A1%E0%B9%82%E0%B8%A3%E0%B8%A1%E0%B8%B4-big.png',
      alt: { th: 'ไก่ย่างถ่านราดซอสโมโรมิบนจานหินร้อน เสิร์ฟพร้อมผักรวมและมันฝรั่งบด', en: 'Charcoal-grilled chicken with moromi sauce on a hot stone plate, served with mixed vegetables and potato salad' },
      kind: 'official-remote',
      sourceUrl: 'https://www.ootoya.co.th/menu-details.php?id=35',
      sourceLabel: ootoyaImageSourceLabel,
      asOf: asOf19,
    },
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
    price: { amount: 199, currency: 'THB', asOf: asOf20, note: oyakodonIndividualPriceNote },
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
    price: { amount: 429, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
    mealContext: { kind: 'already-complete', label: { th: 'เซ็ตมื้ออาหารครบชุด', en: 'Complete set meal' }, note: ootoyaCompleteSetNote },
    menuImage: {
      src: 'https://www.ootoya.co.th/upload_file/menu/Grilled-Menu/%E0%B8%9E%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%84%E0%B8%8A%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%81%E0%B8%B4-big.png',
      alt: { th: 'พอร์คช็อปย่างถ่านสไตล์ทงเทกิราดซอส เสิร์ฟพร้อมกะหล่ำปลีซอยและเครื่องเคียง', en: 'Charcoal-grilled tonteki-style pork chop with sauce, served with shredded cabbage and side dishes' },
      kind: 'official-remote',
      sourceUrl: 'https://www.ootoya.co.th/menu-details.php?id=30',
      sourceLabel: ootoyaImageSourceLabel,
      asOf: asOf18,
    },
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
    price: { amount: 155, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
    menuImage: {
      src: 'https://www.saladfactorythailand.com/65ed250caef8ed66454c2464/668f96e30990d230026c05bb_Main%20Salad-%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%8D%E0%B8%B5%E0%B9%88%E0%B8%9B%E0%B8%B8%E0%B9%88%E0%B8%99.jpg',
      alt: { th: 'สลัดอกไก่ย่างกับผักรวม ถั่วแระ สาหร่ายโนริ และซอสงาครีมมี่', en: 'Grilled chicken breast salad with mixed greens, edamame, nori, and creamy sesame dressing' },
      kind: 'official-remote',
      sourceUrl: 'https://www.saladfactorythailand.com/menu/order',
      sourceLabel: saladFactoryImageSourceLabel,
      asOf: asOf19,
    },
  },
  {
    id: 'salad-factory-quinoa-chicken-basil',
    restaurantId: 'salad-factory-thailand',
    name: { th: 'สลัดควินัวอกไก่ย่าง กะเพราเผ็ด', en: 'Quinoa Salad with Grilled Chicken Breast, Spicy Holy Basil' },
    category: 'Salad',
    nutrition: { kcal: 480, protein: 35, carbs: 46, fat: 16 },
    nutritionSource: { confidence: 'estimated', note: saladFactoryEstimateNote, asOf },
    tags: ['chicken', 'salad', 'high-protein'],
    price: { amount: 195, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
  },
  {
    id: 'salad-factory-kale-chicken-truffle',
    restaurantId: 'salad-factory-thailand',
    name: { th: 'สลัดคะน้าอกไก่ ซอสทรัฟเฟิล', en: 'Kale Salad with Chicken Breast, Truffle Dressing' },
    category: 'Salad',
    nutrition: { kcal: 450, protein: 32, carbs: 20, fat: 26 },
    nutritionSource: { confidence: 'estimated', note: saladFactoryEstimateNote, asOf },
    tags: ['chicken', 'salad', 'high-protein'],
    price: { amount: 235, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
    menuImage: {
      src: 'https://www.saladfactorythailand.com/65ed250caef8ed66454c2464/6672a5a9ba3a36f4c933ca72_Kale%20Salad-%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%84%E0%B8%A5%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%9F%E0%B9%80%E0%B8%9F%E0%B8%B4%E0%B8%A5.jpg',
      alt: { th: 'สลัดคะน้ากับอกไก่ย่าง แอปเปิล วอลนัท ถั่วชิกพี และแครนเบอร์รี่', en: 'Kale salad with sliced grilled chicken, apple, walnuts, chickpeas, and dried cranberries' },
      kind: 'official-remote',
      sourceUrl: 'https://www.saladfactorythailand.com/menu/order',
      sourceLabel: saladFactoryImageSourceLabel,
      asOf: asOf19,
    },
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
    price: { amount: 49, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
    menuImage: {
      src: 'https://media.allonline.7eleven.co.th/pdmain/735977-00-allonline-sm-NewOnlyat.jpg',
      alt: { th: 'หมูกระเทียมพริกไทยไข่ดาวบนข้าว เสิร์ฟพร้อมแตงกวา บรรจุภัณฑ์ตราอีซี่โก', en: 'Garlic-pepper pork with a fried egg over rice and cucumber, EZYGO package shown' },
      kind: 'official-remote',
      sourceUrl: 'https://www.allonline.7eleven.co.th/p/%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%84%E0%B8%82%E0%B9%88%E0%B8%94%E0%B8%B2%E0%B8%A7-%E0%B8%95%E0%B8%A3%E0%B8%B2-%E0%B8%AD%E0%B8%B5%E0%B8%8B%E0%B8%B5%E0%B9%88%E0%B9%82%E0%B8%81-250-%E0%B8%81%E0%B8%A3%E0%B8%B1%E0%B8%A1/367920/',
      sourceLabel: sevenElevenImageSourceLabel,
      asOf: asOf19,
    },
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
    price: { amount: 49, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
    menuImage: {
      src: 'https://media.allonline.7eleven.co.th/pdmain/742077-00-allonline-sm-NewOnlyat.jpg',
      alt: { th: 'แกงเขียวหวานอกไก่เสิร์ฟคู่ข้าวหอมมะลิ บรรจุภัณฑ์ตราเชฟแคร์ส', en: 'Green curry with chicken breast served beside jasmine rice, Chef Cares package shown' },
      kind: 'official-remote',
      sourceUrl: 'https://www.allonline.7eleven.co.th/p/%E0%B9%81%E0%B8%81%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B8%AB%E0%B8%A7%E0%B8%B2%E0%B8%99%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B0%E0%B8%A5%E0%B8%B4-%E0%B8%95%E0%B8%A3%E0%B8%B2-%E0%B9%80%E0%B8%8A%E0%B8%9F%E0%B9%81%E0%B8%84%E0%B8%A3%E0%B9%8C%E0%B8%AA-275-%E0%B8%81%E0%B8%A3%E0%B8%B1%E0%B8%A1/334743/',
      sourceLabel: sevenElevenImageSourceLabel,
      asOf: asOf19,
    },
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
    menuImage: {
      src: 'https://www.fuji.co.th/wp-content/uploads/2026/06/SALMON-SHIOYAKI-WITH-BROWN-RICE-SET-1-768x768.png',
      alt: { th: 'แซลมอนย่างเกลือเสิร์ฟกับข้าวกล้องธัญพืช ซุปมิโสะ และเครื่องเคียงผักดอง', en: 'Grilled salmon with mixed-grain brown rice, miso soup, and pickled side dishes' },
      kind: 'official-remote',
      sourceUrl: 'https://www.fuji.co.th/menu/?lang=en',
      sourceLabel: fujiImageSourceLabel,
      asOf: asOf24,
    },
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
    menuImage: {
      src: 'https://www.fuji.co.th/wp-content/uploads/2026/06/SALMON-TATAKI.png-768x768.png',
      alt: { th: 'ยำปลาแซลมอนดิบสไตล์ทาทากิ ราดพริก กระเทียม และมะนาว บนผักสลัด', en: 'Salmon tataki slices with chili, garlic, and lime over mixed salad greens' },
      kind: 'official-remote',
      sourceUrl: 'https://www.fuji.co.th/menu/?lang=en',
      sourceLabel: fujiImageSourceLabel,
      asOf: asOf24,
    },
  },
  {
    id: 'fuji-kinoko-mushroom-salad',
    restaurantId: 'fuji-japanese-restaurant-thailand',
    name: { th: 'สลัดเห็ด', en: 'Kinoko (Mushroom) Salad' },
    category: 'Salad',
    nutrition: { kcal: 150, protein: 5, carbs: 16, fat: 8 },
    nutritionSource: { confidence: 'estimated', note: fujiEstimateNote, asOf: asOf11 },
    tags: ['vegetarian', 'salad', 'low-carb'],
    menuImage: {
      src: 'https://www.fuji.co.th/wp-content/uploads/2026/06/KINOKO-SALAD-768x768.png',
      alt: { th: 'สลัดเห็ดรวมชิตาเกะและเห็ดเข็มทอง บนผักสลัด มะเขือเทศ และหัวไชเท้า', en: 'Mixed mushroom salad with shiitake and enoki over greens, tomato, and radish' },
      kind: 'official-remote',
      sourceUrl: 'https://www.fuji.co.th/menu/?lang=en',
      sourceLabel: fujiImageSourceLabel,
      asOf: asOf24,
    },
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
    menuImage: {
      src: 'https://www.fuji.co.th/wp-content/uploads/2026/06/CHIRASHI-SUSHI-DON-SET-768x768.png',
      alt: { th: 'ข้าวหน้าปลาดิบรวมแซลมอน ทูน่า กุ้ง และหอยเชลล์ เสิร์ฟพร้อมซุปมิโสะ', en: 'Mixed sashimi rice bowl with salmon, tuna, shrimp, and scallop, served with miso soup' },
      kind: 'official-remote',
      sourceUrl: 'https://www.fuji.co.th/menu/?lang=en',
      sourceLabel: fujiImageSourceLabel,
      asOf: asOf24,
    },
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
    menuImage: {
      src: 'https://www.mkrestaurant.com/public/uploads/mk_menu/images/2d90e4421809ab3c838e94db744ce7df.JPG',
      alt: { th: 'ผักดิบสำหรับต้มสุกี้ ประกอบด้วยผักกาดหอม ฟักทอง เห็ดเข็มทอง และแครอท', en: 'Raw vegetables for hot-pot cooking, including lettuce, pumpkin, enoki mushroom, and carrot' },
      kind: 'official-remote',
      sourceUrl: 'https://www.mkrestaurant.com/en/mk-menu/suki/',
      sourceLabel: mkImageSourceLabel,
      asOf: asOf24,
    },
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
    price: { amount: 223, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
    menuImage: {
      src: 'https://www.mkrestaurant.com/public/uploads/mk_menu/images/c46d73452576ddbb21c542893e6efbed.jpg',
      alt: { th: 'หมูคุโรบุตะหั่นบางจัดเรียงบนจาน สำหรับต้มในหม้อสุกี้', en: 'Thinly sliced kurobuta pork arranged on a plate for hot-pot cooking' },
      kind: 'official-remote',
      sourceUrl: 'https://www.mkrestaurant.com/en/mk-menu/suki/',
      sourceLabel: mkImageSourceLabel,
      asOf: asOf24,
    },
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
    price: { amount: 75, currency: 'THB', asOf: asOf20, note: currentListedPriceNote },
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
    price: { amount: 259, currency: 'THB', asOf: asOf20, note: mkPremiumSukiBranchPriceNote },
    menuImage: {
      src: 'https://www.mkrestaurant.com/public/uploads/mk_menu/images/759b93dc4b3d0153a14656015262c135.JPG',
      alt: { th: 'หมูสามชั้นหั่นบาง ปลาหมึก กุ้ง และลูกชิ้นปลา พร้อมผักรวมและน้ำจิ้ม', en: 'Sliced pork belly, squid, shrimp, and fish balls with a vegetable bowl and dipping sauce' },
      kind: 'official-remote',
      sourceUrl: 'https://www.mkrestaurant.com/en/mk-menu/suki/',
      sourceLabel: mkImageSourceLabel,
      asOf: asOf24,
    },
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
    menuImage: {
      src: 'https://www.mkrestaurant.com/public/uploads/mk_menu/images/74e40820714e487e931bbf7f83d8eb65.jpg',
      alt: { th: 'สุกี้ทะเลน้ำ พร้อมกุ้ง ปลาหมึก และปลา เสิร์ฟพร้อมทาน', en: 'Seafood suki in broth with shrimp, squid, and fish, ready to eat' },
      kind: 'official-remote',
      sourceUrl: 'https://www.mkrestaurant.com/en/mk-menu/single-dish',
      sourceLabel: mkImageSourceLabel,
      asOf: asOf24,
    },
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
    mealContext: santaFeConfigurableMealContext,
    price: { amount: 329, currency: 'THB', asOf: asOf17b, note: currentListedPriceNote },
  },
  {
    id: 'santa-fe-dory-fish-steak',
    restaurantId: 'santa-fe-steak-thailand',
    name: { th: 'สเต๊กปลาดอรี่', en: 'Dory Fish Steak' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 280, protein: 26, carbs: 8, fat: 17 },
    nutritionSource: { confidence: 'estimated', note: santaFeEstimateNote, asOf: asOf11 },
    tags: ['fish', 'grilled'],
    mealContext: santaFeConfigurableMealContext,
    price: { amount: 209, currency: 'THB', asOf: asOf17b, note: currentListedPriceNote },
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
    mealContext: santaFeConfigurableMealContext,
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
  {
    id: 'nittaya-grilled-chicken-quarter',
    restaurantId: 'nittaya-kai-yang-thailand',
    name: { th: 'ไก่ย่าง (น่องสะโพกต้นตำรับ)', en: 'Original Recipe Grilled Chicken (Leg-Thigh Quarter)' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 420, protein: 50, carbs: 3, fat: 22, sodium: 700 },
    nutritionSource: { confidence: 'estimated', note: nittayaEstimateNote, asOf: asOf14 },
    tags: ['chicken', 'grilled', 'high-protein', 'isan'],
    servingNote: { th: 'ไก่ย่างเสิร์ฟเป็นตัว/ครึ่งตัวสำหรับแบ่งกัน ค่าพลังงานนี้คือส่วนน่องสะโพก 1 ชิ้นต่อคน', en: 'Grilled chicken is sold whole/half for sharing; this figure is for one leg-thigh quarter piece as a per-person portion.' },
  },
  {
    id: 'nittaya-grilled-pork-neck',
    restaurantId: 'nittaya-kai-yang-thailand',
    name: { th: 'คอหมูย่าง', en: 'Grilled Pork Neck' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 380, protein: 28, carbs: 2, fat: 29, sodium: 450 },
    nutritionSource: { confidence: 'estimated', note: nittayaEstimateNote, asOf: asOf14 },
    tags: ['pork', 'grilled', 'high-protein', 'isan'],
    price: { amount: 130, currency: 'THB', asOf: asOf22, note: currentListedPriceNote },
  },
  {
    id: 'nittaya-som-tam-thai',
    restaurantId: 'nittaya-kai-yang-thailand',
    name: { th: 'ส้มตำไทย', en: 'Thai-Style Papaya Salad' },
    category: 'Salad',
    nutrition: { kcal: 180, protein: 5, carbs: 28, fat: 6, sodium: 900 },
    nutritionSource: { confidence: 'estimated', note: nittayaEstimateNote, asOf: asOf14 },
    tags: ['salad', 'isan', 'spicy'],
    servingNote: { th: 'เสิร์ฟ 1 จานสำหรับแบ่งกันกิน ค่าพลังงานนี้คือทั้งจาน ไม่ใช่ต่อคน', en: 'Served as one shared plate; this figure is for the whole plate, not a per-person portion.' },
    price: { amount: 75, currency: 'THB', asOf: asOf22, note: currentListedPriceNote },
  },
  {
    id: 'nittaya-som-tam-salted-egg',
    restaurantId: 'nittaya-kai-yang-thailand',
    name: { th: 'ส้มตำไข่เค็ม', en: 'Papaya Salad with Salted Egg' },
    category: 'Salad',
    nutrition: { kcal: 260, protein: 9, carbs: 28, fat: 13, sodium: 1300 },
    nutritionSource: { confidence: 'estimated', note: nittayaEstimateNote, asOf: asOf14 },
    tags: ['salad', 'isan', 'spicy'],
    servingNote: { th: 'เสิร์ฟ 1 จานสำหรับแบ่งกันกิน (รวมไข่เค็ม 1 ฟอง) ค่าพลังงานนี้คือทั้งจาน', en: 'Served as one shared plate (includes 1 salted egg); this figure is for the whole plate.' },
    price: { amount: 85, currency: 'THB', asOf: asOf22, note: currentListedPriceNote },
  },
  {
    id: 'nittaya-larb-moo',
    restaurantId: 'nittaya-kai-yang-thailand',
    name: { th: 'ลาบหมู', en: 'Pork Larb' },
    category: 'Salad',
    nutrition: { kcal: 260, protein: 26, carbs: 10, fat: 15, sodium: 600 },
    nutritionSource: { confidence: 'estimated', note: nittayaEstimateNote, asOf: asOf14 },
    tags: ['pork', 'salad', 'isan', 'high-protein'],
    price: { amount: 95, currency: 'THB', asOf: asOf22, note: currentListedPriceNote },
  },
  {
    id: 'nittaya-tom-saep-grilled-chicken-soup',
    restaurantId: 'nittaya-kai-yang-thailand',
    name: { th: 'ต้มแซ่บไก่ย่าง', en: 'Spicy Grilled-Chicken Tom Saep Soup' },
    category: 'Soup',
    nutrition: { kcal: 150, protein: 15, carbs: 5, fat: 7, sodium: 700 },
    nutritionSource: { confidence: 'estimated', note: nittayaEstimateNote, asOf: asOf14 },
    tags: ['chicken', 'soup', 'isan'],
    servingNote: { th: 'เสิร์ฟเป็นชามสำหรับแบ่งกัน ค่าพลังงานนี้คือส่วนแบ่งต่อคน (น้ำซุป 250 มล. + เนื้อไก่ 80 กรัม)', en: 'Served as a shared bowl; this figure is a per-person portion (~250ml broth + ~80g chicken).' },
  },
  {
    id: 'nittaya-chiang-mai-fried-pork',
    restaurantId: 'nittaya-kai-yang-thailand',
    name: { th: 'หมูทอดเชียงใหม่', en: 'Chiang Mai-Style Fried Pork' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 480, protein: 30, carbs: 8, fat: 35, sodium: 550 },
    nutritionSource: { confidence: 'estimated', note: nittayaEstimateNote, asOf: asOf14 },
    tags: ['pork', 'fried', 'isan'],
    price: { amount: 105, currency: 'THB', asOf: asOf22, note: currentListedPriceNote },
  },
  {
    id: 'zaab-eli-grilled-chicken',
    restaurantId: 'zaab-eli-thailand',
    name: { th: 'ไก่ย่างแซ่บอีลี่', en: 'Zaab Eli Grilled Chicken' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 430, protein: 48, carbs: 4, fat: 23, sodium: 750 },
    nutritionSource: { confidence: 'estimated', note: zaabEliEstimateNote, asOf: asOf14 },
    tags: ['chicken', 'grilled', 'high-protein', 'isan'],
    servingNote: { th: 'ราคา (฿299) สื่อถึงชิ้นส่วนที่ใหญ่กว่าสำหรับแบ่งกัน ค่าพลังงานนี้คือส่วนน่องสะโพก 1 ชิ้นต่อคน', en: 'The price point (฿299) implies a larger shared cut; this figure is for one leg-thigh quarter piece as a per-person portion.' },
    price: { amount: 299, currency: 'THB', asOf: asOf22, note: currentListedPriceNote },
  },
  {
    id: 'zaab-eli-fried-chicken',
    restaurantId: 'zaab-eli-thailand',
    name: { th: 'ไก่ทอดแซ่บอีลี่', en: 'Zaab Eli Fried Chicken' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 480, protein: 28, carbs: 18, fat: 30, sodium: 700 },
    nutritionSource: { confidence: 'estimated', note: zaabEliEstimateNote, asOf: asOf14 },
    tags: ['chicken', 'fried', 'isan'],
  },
  {
    id: 'zaab-eli-grilled-pork-neck',
    restaurantId: 'zaab-eli-thailand',
    name: { th: 'คอหมูย่าง', en: 'Grilled Pork Neck' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 460, protein: 33, carbs: 2, fat: 35, sodium: 500 },
    nutritionSource: { confidence: 'estimated', note: zaabEliEstimateNote, asOf: asOf14 },
    tags: ['pork', 'grilled', 'high-protein', 'isan'],
  },
  {
    id: 'zaab-eli-som-tam-salted-egg',
    restaurantId: 'zaab-eli-thailand',
    name: { th: 'ส้มตำไทยไข่เค็ม', en: 'Thai Papaya Salad with Salted Egg' },
    category: 'Salad',
    nutrition: { kcal: 270, protein: 9, carbs: 29, fat: 14, sodium: 1250 },
    nutritionSource: { confidence: 'estimated', note: zaabEliEstimateNote, asOf: asOf14 },
    tags: ['salad', 'isan', 'spicy'],
    servingNote: { th: 'เสิร์ฟ 1 จานสำหรับแบ่งกันกิน ค่าพลังงานนี้คือทั้งจาน', en: 'Served as one shared plate; this figure is for the whole plate.' },
    price: { amount: 120, currency: 'THB', asOf: asOf22, note: currentListedPriceNote },
  },
  {
    id: 'zaab-eli-corn-salted-egg-som-tam',
    restaurantId: 'zaab-eli-thailand',
    name: { th: 'ตำข้าวโพดไข่เค็ม', en: 'Corn & Salted Egg Papaya Salad' },
    category: 'Salad',
    nutrition: { kcal: 280, protein: 8, carbs: 35, fat: 12, sodium: 1200 },
    nutritionSource: { confidence: 'estimated', note: zaabEliFusionNote, asOf: asOf14 },
    tags: ['salad', 'isan', 'spicy'],
    servingNote: { th: 'เสิร์ฟ 1 จานสำหรับแบ่งกันกิน ค่าพลังงานนี้คือทั้งจาน', en: 'Served as one shared plate; this figure is for the whole plate.' },
    price: { amount: 120, currency: 'THB', asOf: asOf22, note: currentListedPriceNote },
  },
  {
    id: 'zaab-eli-larb-moo',
    restaurantId: 'zaab-eli-thailand',
    name: { th: 'ลาบหมู', en: 'Pork Larb' },
    category: 'Salad',
    nutrition: { kcal: 270, protein: 25, carbs: 11, fat: 16, sodium: 650 },
    nutritionSource: { confidence: 'estimated', note: zaabEliEstimateNote, asOf: asOf14 },
    tags: ['pork', 'salad', 'isan', 'high-protein'],
    price: { amount: 125, currency: 'THB', asOf: asOf22, note: currentListedPriceNote },
  },
  {
    id: 'zaab-eli-tom-saep-beef-tendon-soup',
    restaurantId: 'zaab-eli-thailand',
    name: { th: 'ต้มแซ่บเอ็นแก้วเนื้อน่องลาย', en: 'Spicy Beef Shank & Tendon Soup' },
    category: 'Soup',
    nutrition: { kcal: 220, protein: 20, carbs: 5, fat: 11, sodium: 750 },
    nutritionSource: { confidence: 'estimated', note: zaabEliEstimateNote, asOf: asOf14 },
    tags: ['beef', 'soup', 'isan'],
    servingNote: { th: 'เสิร์ฟเป็นชามสำหรับแบ่งกัน ค่าพลังงานนี้คือส่วนแบ่งต่อคน (น้ำซุป 300 มล. + เนื้อ/เอ็น 100 กรัม)', en: 'Served as a shared bowl; this figure is a per-person portion (~300ml broth + ~100g meat/tendon).' },
  },
  {
    id: 'somtam-nua-papaya-salad-thai',
    restaurantId: 'somtam-nua-thailand',
    name: { th: 'ส้มตำไทย', en: 'Thai-Style Papaya Salad (Dried Shrimp & Peanut)' },
    category: 'Salad',
    nutrition: { kcal: 190, protein: 5, carbs: 30, fat: 6, sodium: 1100 },
    nutritionSource: { confidence: 'estimated', note: somtamNuaEstimateNote, asOf: asOf14 },
    tags: ['salad', 'isan', 'spicy'],
    servingNote: { th: 'เสิร์ฟ 1 จานสำหรับแบ่งกันกิน ค่าพลังงานนี้คือทั้งจาน ไม่ใช่ต่อคน', en: 'Served as one shared plate; this figure is for the whole plate, not a per-person portion.' },
  },
  {
    id: 'somtam-nua-papaya-salad-fermented-crab',
    restaurantId: 'somtam-nua-thailand',
    name: { th: 'ส้มตำปูปลาร้า', en: 'Papaya Salad with Salted Crab & Fermented Fish Sauce' },
    category: 'Salad',
    nutrition: { kcal: 220, protein: 7, carbs: 28, fat: 7, sodium: 2000 },
    nutritionSource: { confidence: 'estimated', note: somtamNuaEstimateNote, asOf: asOf14 },
    tags: ['salad', 'isan', 'spicy'],
    servingNote: { th: 'เสิร์ฟ 1 จานสำหรับแบ่งกันกิน ค่าพลังงานนี้คือทั้งจาน โซเดียมสูงมากจากน้ำปลาร้า', en: 'Served as one shared plate; this figure is for the whole plate. Sodium is very high due to fermented fish sauce (plara).' },
  },
  {
    id: 'somtam-nua-tam-muah',
    restaurantId: 'somtam-nua-thailand',
    name: { th: 'ตำมั่ว', en: 'Mixed Papaya Salad with Rice Noodles & Crispy Pork Rind' },
    category: 'Salad',
    nutrition: { kcal: 400, protein: 10, carbs: 50, fat: 16, sodium: 1300 },
    nutritionSource: { confidence: 'estimated', note: somtamNuaEstimateNote, asOf: asOf14 },
    tags: ['salad', 'isan', 'spicy'],
    servingNote: { th: 'เสิร์ฟ 1 จานสำหรับแบ่งกันกิน ค่าพลังงานนี้คือทั้งจาน', en: 'Served as one shared plate; this figure is for the whole plate.' },
  },
  {
    id: 'somtam-nua-larb-moo',
    restaurantId: 'somtam-nua-thailand',
    name: { th: 'ลาบหมู', en: 'Pork Larb with Liver' },
    category: 'Salad',
    nutrition: { kcal: 400, protein: 28, carbs: 14, fat: 25, sodium: 1500 },
    nutritionSource: { confidence: 'estimated', note: somtamNuaEstimateNote, asOf: asOf14 },
    tags: ['pork', 'salad', 'isan'],
    servingNote: { th: 'เสิร์ฟ 1 จานสำหรับแบ่งกันกิน ค่าพลังงานนี้คือทั้งจาน', en: 'Served as one shared plate; this figure is for the whole plate.' },
  },
  {
    id: 'somtam-nua-larb-fried-fish',
    restaurantId: 'somtam-nua-thailand',
    name: { th: 'ลาบปลาทอด', en: 'Crispy Fried Fish Larb' },
    category: 'Salad',
    nutrition: { kcal: 450, protein: 26, carbs: 20, fat: 28, sodium: 1200 },
    nutritionSource: { confidence: 'estimated', note: somtamNuaEstimateNote, asOf: asOf14 },
    tags: ['fish', 'salad', 'isan'],
    servingNote: { th: 'เสิร์ฟ 1 จานสำหรับแบ่งกันกิน ค่าพลังงานนี้คือทั้งจาน', en: 'Served as one shared plate; this figure is for the whole plate.' },
  },
  {
    id: 'somtam-nua-fried-chicken',
    restaurantId: 'somtam-nua-thailand',
    name: { th: 'ไก่ทอด', en: 'Thai Fried Chicken Wings' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 550, protein: 35, carbs: 15, fat: 38, sodium: 900 },
    nutritionSource: { confidence: 'estimated', note: somtamNuaEstimateNote, asOf: asOf14 },
    tags: ['chicken', 'fried', 'isan'],
    servingNote: { th: 'เสิร์ฟ 1 จาน (หลายชิ้น) สำหรับแบ่งกันกิน ค่าพลังงานนี้คือทั้งจาน', en: 'Served as one plate (several pieces), typically shared; this figure is for the whole plate.' },
  },
  {
    id: 'somtam-nua-tom-saep-pork-bone-soup',
    restaurantId: 'somtam-nua-thailand',
    name: { th: 'ต้มแซ่บกระดูกหมูอ่อน', en: 'Spicy Isan Pork-Bone Soup' },
    category: 'Soup',
    nutrition: { kcal: 250, protein: 18, carbs: 8, fat: 15, sodium: 1700 },
    nutritionSource: { confidence: 'estimated', note: somtamNuaEstimateNote, asOf: asOf14 },
    tags: ['pork', 'soup', 'isan'],
    servingNote: { th: 'เสิร์ฟเป็นชามสำหรับแบ่งกันกิน ค่าพลังงานนี้คือทั้งชาม', en: 'Served as one shared bowl; this figure is for the whole bowl.' },
  },
  {
    id: 'somtam-nua-sticky-rice',
    restaurantId: 'somtam-nua-thailand',
    name: { th: 'ข้าวเหนียว', en: 'Sticky Rice' },
    category: 'Rice & noodles',
    nutrition: { kcal: 200, protein: 4, carbs: 44, fat: 1, sodium: 2 },
    nutritionSource: { confidence: 'estimated', note: somtamNuaEstimateNote, asOf: asOf14 },
    tags: ['vegetarian', 'rice', 'isan'],
    servingNote: { th: 'เสิร์ฟ 1 กระติบมาตรฐานต่อคน', en: 'One standard individual-serving basket.' },
  },
  {
    id: 'thongsmith-wagyu-ribeye-boat-noodle',
    restaurantId: 'thongsmith-boat-noodle-thailand',
    name: { th: 'น้ำตกวากิวทองสมิทธ์ (ริบอาย)', en: 'Wagyu Ribeye "Waterfall" Beef Boat Noodle' },
    category: 'Rice & noodles',
    nutrition: { kcal: 480, protein: 28, carbs: 55, fat: 17, sodium: 1400 },
    nutritionSource: { confidence: 'estimated', note: thongSmithEstimateNote, asOf: asOf14 },
    tags: ['beef', 'noodles'],
    servingNote: { th: 'หนึ่งชาม เสิร์ฟแบบเดี่ยว', en: 'One noodle bowl, individual serving.' },
  },
  {
    id: 'thongsmith-kurobuta-pork-boat-noodle',
    restaurantId: 'thongsmith-boat-noodle-thailand',
    name: { th: 'ก๋วยเตี๋ยวเรือหมูคุโรบุตะ', en: 'Kurobuta Pork Boat Noodle' },
    category: 'Rice & noodles',
    nutrition: { kcal: 420, protein: 22, carbs: 52, fat: 14, sodium: 1300 },
    nutritionSource: { confidence: 'estimated', note: thongSmithEstimateNote, asOf: asOf14 },
    tags: ['pork', 'noodles'],
    servingNote: { th: 'หนึ่งชาม เสิร์ฟแบบเดี่ยว', en: 'One noodle bowl, individual serving.' },
  },
  {
    id: 'thongsmith-dry-rice-kurobuta-braised-pork',
    restaurantId: 'thongsmith-boat-noodle-thailand',
    name: { th: 'ข้าวต้มแห้งหมูคุโรบูตะ หมูตุ๋น', en: 'Dry Rice with Kurobuta Pork & Braised Pork' },
    category: 'Rice & noodles',
    nutrition: { kcal: 520, protein: 30, carbs: 60, fat: 18, sodium: 1350 },
    nutritionSource: { confidence: 'estimated', note: thongSmithEstimateNote, asOf: asOf14 },
    tags: ['pork', 'rice'],
    servingNote: { th: 'หนึ่งชาม เสิร์ฟแบบเดี่ยว', en: 'One bowl, individual serving.' },
  },
  {
    id: 'thongsmith-spicy-shredded-chicken-dry',
    restaurantId: 'thongsmith-boat-noodle-thailand',
    name: { th: 'แซ่บแห้งไก่ฉีก', en: 'Spicy Shredded Chicken (Dry, No Soup)' },
    category: 'Salad',
    nutrition: { kcal: 280, protein: 26, carbs: 18, fat: 12, sodium: 1100 },
    nutritionSource: { confidence: 'estimated', note: thongSmithEstimateNote, asOf: asOf14 },
    tags: ['chicken', 'salad', 'spicy'],
  },
  {
    id: 'thongsmith-grilled-pork-meatballs',
    restaurantId: 'thongsmith-boat-noodle-thailand',
    name: { th: 'ลูกชิ้นหมูปิ้ง', en: 'Grilled Pork Meatballs with Sweet Chili Dip' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 320, protein: 20, carbs: 20, fat: 18, sodium: 800 },
    nutritionSource: { confidence: 'estimated', note: thongSmithEstimateNote, asOf: asOf14 },
    tags: ['pork', 'grilled'],
    servingNote: { th: 'หนึ่งจาน เสิร์ฟแบบเดี่ยว', en: 'One plate, individual serving.' },
  },
  {
    id: 'steak-and-more-chicken-steak',
    restaurantId: 'steak-and-more-thailand',
    name: { th: 'สเต็กไก่', en: 'Chicken Steak' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 380, protein: 38, carbs: 20, fat: 16, sodium: 650 },
    nutritionSource: { confidence: 'estimated', note: steakAndMoreEstimateNote, asOf: asOf14 },
    tags: ['chicken', 'grilled', 'high-protein'],
    servingNote: { th: 'รวมค่าประมาณของสลัด/ขนมปังที่เสิร์ฟมาพร้อมชุด', en: 'Includes an estimate for the bundled side salad/bread served with the set.' },
  },
  {
    id: 'steak-and-more-pork-chop',
    restaurantId: 'steak-and-more-thailand',
    name: { th: 'สเต็กหมู', en: 'Pork Chop Steak' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 430, protein: 35, carbs: 18, fat: 25, sodium: 600 },
    nutritionSource: { confidence: 'estimated', note: steakAndMoreEstimateNote, asOf: asOf14 },
    tags: ['pork', 'grilled', 'high-protein'],
    servingNote: { th: 'รวมค่าประมาณของสลัด/ขนมปังที่เสิร์ฟมาพร้อมชุด', en: 'Includes an estimate for the bundled side salad/bread served with the set.' },
  },
  {
    id: 'steak-and-more-squid-ink-spaghetti-shrimp',
    restaurantId: 'steak-and-more-thailand',
    name: { th: 'สปาเก็ตตี้หมึกดำกุ้ง', en: 'Black Squid-Ink Spaghetti with Shrimp' },
    category: 'Rice & noodles',
    nutrition: { kcal: 520, protein: 24, carbs: 68, fat: 16, sodium: 950 },
    nutritionSource: { confidence: 'estimated', note: steakAndMoreEstimateNote, asOf: asOf14 },
    tags: ['seafood', 'noodles'],
  },
  {
    id: 'steak-and-more-caesar-salad',
    restaurantId: 'steak-and-more-thailand',
    name: { th: 'ซีซาร์สลัด', en: 'Caesar Salad' },
    category: 'Salad',
    nutrition: { kcal: 320, protein: 12, carbs: 16, fat: 24, sodium: 580 },
    nutritionSource: { confidence: 'estimated', note: steakAndMoreEstimateNote, asOf: asOf14 },
    tags: ['salad', 'vegetarian'],
  },
  {
    id: 'steak-and-more-som-tam',
    restaurantId: 'steak-and-more-thailand',
    name: { th: 'ส้มตำ', en: 'Som Tam (Thai Papaya Salad)' },
    category: 'Salad',
    nutrition: { kcal: 170, protein: 5, carbs: 25, fat: 6, sodium: 850 },
    nutritionSource: { confidence: 'estimated', note: steakAndMoreEstimateNote, asOf: asOf14 },
    tags: ['salad', 'spicy'],
  },
  {
    id: 'steak-and-more-yum-woon-sen',
    restaurantId: 'steak-and-more-thailand',
    name: { th: 'ยำวุ้นเส้น', en: 'Yum Woon Sen (Glass Noodle Salad)' },
    category: 'Salad',
    nutrition: { kcal: 280, protein: 14, carbs: 32, fat: 10, sodium: 900 },
    nutritionSource: { confidence: 'estimated', note: steakAndMoreEstimateNote, asOf: asOf14 },
    tags: ['seafood', 'salad', 'spicy'],
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
  for (const rawItem of items) {
    const item = (rawItem && typeof rawItem === 'object' ? rawItem : {}) as Partial<RestaurantMenuItem>
    const id = hasText(item.id) ? item.id : '(missing id)'
    if (!hasText(item.id)) errors.push(`Missing menu item id: ${id}`)
    else if (ids.has(id)) errors.push(`Duplicate menu item id: ${id}`)
    ids.add(id)
    if (!hasLocalizedText(item.name)) errors.push(`Missing menu item name: ${id}`)
    if (!hasText(item.restaurantId) || !restaurantIds.has(item.restaurantId)) errors.push(`Unknown restaurantId: ${id}`)
    if (!menuCategories.includes(item.category as MenuCategory)) errors.push(`Invalid category: ${id}`)
    if (!isValidNutrition(item.nutrition)) errors.push(`Invalid nutrition: ${id}`)
    else {
      const macroKcal = item.nutrition.protein * 4 + item.nutrition.carbs * 4 + item.nutrition.fat * 9
      if (Math.abs(item.nutrition.kcal - macroKcal) > 180) errors.push(`Nutrition sanity range: ${id}`)
    }
    if (!item.nutritionSource || typeof item.nutritionSource !== 'object' || !nutritionConfidences.includes(item.nutritionSource.confidence as NutritionConfidence)) errors.push(`Invalid nutrition source: ${id}`)
    if (!Array.isArray(item.tags)) errors.push(`Invalid tags: ${id}`)
    if (item.price !== undefined && validateMenuPrice(item.price).length > 0) errors.push(`Invalid price: ${id}`)
    if (item.menuImage !== undefined && validateMenuImage(item.menuImage).length > 0) errors.push(`Invalid menu image: ${id}`)
    if (item.mealContext !== undefined) {
      for (const error of validateMealContext(item.mealContext)) errors.push(`${error}: ${id}`)
      if (item.mealContext?.kind === 'add-on' && isValidNutrition(item.mealContext.additionNutrition)) {
        const macroKcal = item.mealContext.additionNutrition.protein * 4 + item.mealContext.additionNutrition.carbs * 4 + item.mealContext.additionNutrition.fat * 9
        if (Math.abs(item.mealContext.additionNutrition.kcal - macroKcal) > 180) errors.push(`Addition nutrition sanity range: ${id}`)
      }
    }
  }
  return errors
}
