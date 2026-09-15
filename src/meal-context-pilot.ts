import type { RestaurantMenuItem } from './types'

const demoNote = {
  th: 'ตัวเลขเดโมเพื่อทดสอบ UX เท่านั้น ไม่ใช่ข้อมูลจริงสำหรับการใช้งาน',
  en: 'Demo values for UX validation only — not production facts.',
}

const demoSource = {
  confidence: 'estimated' as const,
  note: demoNote,
  asOf: '2026-09-15',
}

export const mealContextPilotItems: RestaurantMenuItem[] = [
  {
    id: 'pilot-shima-hokke-add-on',
    restaurantId: 'ootoya-thailand',
    name: { th: 'ปลาชิมาฮอกเกะย่างถ่าน', en: 'Charcoal-Grilled Shima Hokke' },
    category: 'Grilled/BBQ',
    nutrition: { kcal: 282, protein: 39.5, carbs: 7.9, fat: 12 },
    nutritionSource: { confidence: 'curated', note: { th: 'ใช้ข้อมูลเมนูฐานที่มีอยู่ในโปรดักชันเพื่อทดสอบโมเดล', en: 'Uses the existing production base item to test the model.' }, asOf: '2026-09-14' },
    tags: ['pilot', 'add-on'],
    servingNote: { th: 'เสิร์ฟแบบเดี่ยว ไม่รวมข้าวและซุปมิโสะ', en: 'Served à la carte; rice and miso soup are not included in this figure.' },
    mealContext: {
      kind: 'add-on',
      label: { th: 'เพิ่มข้าวและซุปมิโสะ (เดโม)', en: 'Rice + miso soup (demo)' },
      additionNutrition: { kcal: 220, protein: 4.5, carbs: 45, fat: 1.5, fiber: 1, sodium: 360 },
      additionNutritionSource: demoSource,
      note: demoNote,
    },
    price: { amount: 299, currency: 'THB', asOf: '2026-09-15', note: { th: 'ราคาเดโม ไม่ใช่ราคาที่วิจัยหรือยืนยันจากร้าน', en: 'Demo price — not a researched or verified restaurant price.' } },
  },
  {
    id: 'pilot-complete-set',
    restaurantId: 'ootoya-thailand',
    name: { th: 'เซ็ตปลาย่างพร้อมข้าวและซุป (เดโม)', en: 'Grilled fish set with rice and soup (demo)' },
    category: 'Set meal',
    nutrition: { kcal: 670, protein: 32, carbs: 72, fat: 26 },
    nutritionSource: demoSource,
    tags: ['pilot', 'complete-set'],
    servingNote: { th: 'ข้อมูลเดโมสำหรับมื้อที่รวมชุดไว้แล้ว', en: 'Demo item representing a meal that already includes its set.' },
    mealContext: {
      kind: 'already-complete',
      label: { th: 'รวมข้าวและซุปแล้ว (เดโม)', en: 'Rice and soup already included (demo)' },
      note: { th: 'โภชนาการด้านบนรวมชุดอาหารนี้แล้ว ไม่ต้องบวกซ้ำ', en: 'Nutrition above already represents the set; do not add it again.' },
    },
  },
  {
    id: 'pilot-no-context',
    restaurantId: 'ootoya-thailand',
    name: { th: 'เมนูเดโมที่ยังไม่มีข้อมูลมื้ออาหาร', en: 'Demo menu without meal context data' },
    category: 'Rice & noodles',
    nutrition: { kcal: 480, protein: 24, carbs: 58, fat: 16 },
    nutritionSource: demoSource,
    tags: ['pilot', 'no-context'],
    servingNote: { th: 'ใช้ทดสอบการแสดงผลแบบเดิมเมื่อไม่มีข้อมูลมื้ออาหาร', en: 'Used to verify the clean default when no meal context is known.' },
  },
]
