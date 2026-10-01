import { expect, it } from 'vitest'
import { everydayMeals, hasEverydayMealDiscoveryTag } from './everyday-meals'

it('discovers base and option tags without changing locked catalog tags', () => {
  const before = structuredClone(everydayMeals)
  expect(everydayMeals.filter(meal => hasEverydayMealDiscoveryTag(meal, 'light')).map(meal => meal.nameTh)).toEqual([
    'สุกี้หมู', 'สุกี้ไก่', 'สุกี้ทะเล', 'ข้าวต้มหมู', 'ข้าวต้มปลา', 'ข้าวต้มกุ้ง', 'เกาเหลาหมู + ข้าว', 'เกาเหลาเนื้อ + ข้าว', 'ก๋วยเตี๋ยวหมูน้ำใส',
  ])
  expect(everydayMeals.filter(meal => hasEverydayMealDiscoveryTag(meal, 'high-protein'))).toHaveLength(10)
  expect(everydayMeals.filter(meal => hasEverydayMealDiscoveryTag(meal, 'veggie-rich'))).toHaveLength(6)
  expect(everydayMeals).toEqual(before)
  expect(hasEverydayMealDiscoveryTag({ ...everydayMeals[0], tags: [], optionGroups: undefined }, 'light')).toBe(false)
  expect(hasEverydayMealDiscoveryTag({ ...everydayMeals[0], tags: [], optionGroups: [{ id: 'prep', labelTh: 'รูปแบบ', choices: [{ id: 'dry', labelTh: 'แห้ง' }] }] }, 'light')).toBe(false)
})
