import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { restaurantMenuItems, restaurants, filterRestaurantMenuItems, searchRestaurantMenuItems, explorePresetFilters } from './restaurants'
import { getEligibleRandomMealItems } from './random-meal'
import { recipeRestaurantRelations } from './recipe-restaurant-relations'
import { loadRestaurantMenuFavorites, saveRestaurantMenuFavorites } from './restaurant-menu-favorites'

const sevenId = 'seven-eleven-chicken-sukiyaki'
const thongId = 'thongsmith-spicy-shredded-chicken-dry'
const find = (id: string) => restaurantMenuItems.find(item => item.id === id)!
const source = readFileSync(new URL('./restaurants.ts', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
const block = (id: string) => {
  const start = source.indexOf(`  {\n    id: '${id}'`)
  expect(start).toBeGreaterThan(0)
  return source.slice(start, source.indexOf('\n  },', start) + 6)
}
// Slice 40B appends two restaurants, ten items and their constants; this freeze is of everything else, so the
// additions are stripped back out before hashing (the original 39C hash remains valid and unchanged).
const NEW_40B_BLOCK_IDS = [
  'getfresh-thailand', 'ginger-farm-kitchen-thailand',
  'getfresh-clean-khao-man-gai', 'getfresh-clean-kaprao-gai', 'getfresh-vegan-mushroom-kaprao', 'getfresh-korean-pork-bulgogi-bowl',
  'getfresh-chicken-burrito-bowl', 'getfresh-atlantic-salmon-steak', 'getfresh-minestrone',
  'ginger-farm-khao-soi-gai', 'ginger-farm-khanom-jeen-nam-ngiao', 'ginger-farm-herb-grilled-chicken-jaew',
]
const withoutSlice40bAdditions = (value: string) => NEW_40B_BLOCK_IDS
  .reduce((text, id) => text.replace(block(id), ''), value)
  .replace(/\n\/\/ Slice 40B restaurant expansion[\s\S]*?\n(?=\nexport const restaurants)/, '')
const NEW_41B_BLOCK_IDS = ['fam-time-thailand', 'fa-pla-tahn-thailand', 'fam-time-spaghetti-spinach-garlic', 'fam-time-classic-nonna-carbonara-pancetta', 'fa-pla-tahn-seabass-rice-clear-soup']
// Exclude only the explicit 41B additions; preserve the original 39C byte hash.
const withoutSlice41bAdditions = (value: string) => NEW_41B_BLOCK_IDS
  .reduce((text, id) => text.replace(block(id), ''), value)
  .replace(/\n\/\/ Slice 41B:[\s\S]*?\n(?=\n\/\/ Slice 40B restaurant expansion)/, '')
const hash = (value: string) => createHash('sha256').update(value).digest('hex')
const ids = (items: typeof restaurantMenuItems) => items.map(item => item.id)

describe('Slice 39C verified partial catalog corrections', () => {
  it('corrects only the sukiyaki identity and discloses provisional secondary nutrition', () => {
    const item = find(sevenId)
    expect(item.restaurantId).toBe('seven-eleven-thailand')
    expect(item.name).toEqual({ th: 'สุกี้ไก่ขลุกขลิก (อีซี่ ช้อยส์)', en: 'Ezy Choice Chicken Sukiyaki with a Little Broth' })
    expect(item.tags).toEqual(['chicken', 'noodles', 'ready-to-eat', 'packaged'])
    expect(item.category).toBe('Rice & noodles')
    expect(item.nutrition).toEqual({ kcal: 270, protein: 19, carbs: 30, fat: 8, sodium: 1220 })
    expect(item.nutritionSource.confidence).toBe('label')
    expect(item.nutritionSource.asOf).toBe('2026-09-14')
    expect(item.nutritionSource.note?.en).toContain('fat is back-calculated')
    expect(item.nutritionSource.note?.en).toContain('retailer imagery conflicts with that report on calories')
    expect(item.nutritionSource.note?.th).toContain('ยังไม่ได้ยืนยันสารอาหารครบทุกค่า')
    expect(item.servingNote).toEqual({ th: 'บรรจุภัณฑ์พร้อมทาน 1 กล่อง', en: 'One packaged ready-to-eat meal.' })
    expect(recipeRestaurantRelations).toContainEqual({ recipeId: 'chicken-vegetable-sukiyaki', restaurantMenuItemId: sevenId, relationKind: 'similar-dish' })
  })

  it('corrects F2 taxonomy and explains configuration without verifying the estimates', () => {
    const item = find(thongId)
    expect(item.restaurantId).toBe('thongsmith-boat-noodle-thailand')
    expect(item.name).toEqual({ th: 'แซ่บแห้งไก่ฉีก', en: 'Spicy Shredded Chicken (Dry, No Soup)' })
    expect(item.category).toBe('Rice & noodles')
    expect(item.tags).toEqual(['chicken', 'spicy'])
    expect(item.nutrition).toEqual({ kcal: 280, protein: 26, carbs: 18, fat: 12, sodium: 1100 })
    expect(item.nutritionSource.confidence).toBe('estimated')
    expect(item.nutritionSource.asOf).toBe('2026-09-15')
    expect(item.servingNote).toEqual({ th: 'เลือกเส้นก๋วยเตี๋ยวหรือเกาเหลา (ไม่ใส่เส้น) ได้ ค่าที่แสดงเป็นการประมาณเดิมสำหรับหนึ่งชาม ซึ่งยังไม่ได้ยืนยันชนิดหรือปริมาณเส้น', en: 'Available with a choice of noodles or without noodles. These are the existing one-bowl estimates; the noodle type and quantity used for the estimate have not been verified.' })
    expect(item.nutritionSource.note?.en).toContain('Linktree')
    expect(item.nutritionSource.note?.en).toContain('not verified for every noodle configuration')
  })

  it('freezes unresolved objects and every production source byte outside the two approved objects', () => {
    expect(hash(block('ootoya-grilled-salmon-rice-bowl'))).toBe('7e98581769860b4dc1c6e1b7dcb6cb60a05440aa71bbaaa993c7fbcb577d887c')
    expect(hash(block('nittaya-tom-saep-grilled-chicken-soup'))).toBe('3ef1582bb87a3cbede8c1aa3c9d1c6cdee350c52c9c6472cdbbc8256496d6644')
    expect(hash(withoutSlice40bAdditions(withoutSlice41bAdditions(source)).replace(block(sevenId), `APPROVED:${sevenId}`).replace(block(thongId), `APPROVED:${thongId}`))).toBe('b102eef065a0fa057017e14eddf871f497f5e4f02332bd9d2a955f8462f95213')
  })

  it('retains counts, absent prices/images and stable favorite IDs', () => {
    expect(restaurants).toHaveLength(17) // 13 + two 40B and two 41B restaurants
    expect(restaurants.filter(item => item.logo)).toHaveLength(17)
    expect(restaurantMenuItems).toHaveLength(97) // 84 + 10 (Slice 40B) + 3 (Slice 41B)
    expect(restaurantMenuItems.filter(item => item.menuImage)).toHaveLength(50) // 45 + five getfresh images (Slice 40B)
    expect(restaurantMenuItems.filter(item => !item.menuImage)).toHaveLength(47)
    for (const id of [sevenId, thongId]) {
      expect(find(id).menuImage).toBeUndefined()
      expect(find(id).price).toBeUndefined()
    }
    let saved = ''
    saveRestaurantMenuFavorites([sevenId, thongId], { setItem: (_key, value) => { saved = value } })
    expect(loadRestaurantMenuFavorites({ getItem: () => saved })).toEqual([sevenId, thongId])
  })

  it('changes identity search without keeping obsolete rice/salad aliases', () => {
    const items = [find(sevenId), find(thongId)]
    for (const query of ['ข้าวหน้า', 'Rice', 'salad']) expect(searchRestaurantMenuItems(items, restaurants, query)).toEqual([])
    for (const query of ['สุกี้ไก่ขลุกขลิก', 'Chicken Sukiyaki with a Little Broth']) expect(ids(searchRestaurantMenuItems(items, restaurants, query))).toEqual([sevenId])
    expect(ids(searchRestaurantMenuItems(items, restaurants, 'แซ่บแห้งไก่ฉีก'))).toEqual([thongId])
  })

  it('preserves Quick Goal and numeric Pick/filter pools, random eligibility and order', () => {
    const before = restaurantMenuItems.map(item => item.id === sevenId ? { ...item, name: { th: 'ข้าวหน้าไก่สุกี้ (อีซี่ ช้อยส์)', en: 'Ezy Choice Chicken Sukiyaki Rice' }, tags: ['chicken', 'rice', 'ready-to-eat', 'packaged'] } : item.id === thongId ? { ...item, category: 'Salad' as const, tags: ['chicken', 'salad', 'spicy'], servingNote: undefined } : item)
    for (const filters of [...Object.values(explorePresetFilters), { maxKcal: 280 }, { minProtein: 25 }, { maxCarbs: 20 }, { maxFat: 8 }, { maxSodium: 1200 }]) {
      expect(ids(filterRestaurantMenuItems(restaurantMenuItems, filters))).toEqual(ids(filterRestaurantMenuItems(before, filters)))
      for (const restaurantId of [find(sevenId).restaurantId, find(thongId).restaurantId]) {
        expect(ids(filterRestaurantMenuItems(restaurantMenuItems.filter(item => item.restaurantId === restaurantId), filters))).toEqual(ids(filterRestaurantMenuItems(before.filter(item => item.restaurantId === restaurantId), filters)))
      }
    }
    expect(ids(filterRestaurantMenuItems([find(sevenId), find(thongId)], explorePresetFilters['high-protein']))).toEqual([])
    expect(ids(filterRestaurantMenuItems([find(sevenId), find(thongId)], explorePresetFilters['light-meal']))).toEqual([sevenId, thongId])
    expect(ids(filterRestaurantMenuItems([find(sevenId), find(thongId)], explorePresetFilters.balanced))).toEqual([thongId])
    expect(ids(getEligibleRandomMealItems(restaurantMenuItems, restaurants))).toEqual(ids(getEligibleRandomMealItems(before, restaurants)))
  })
})
