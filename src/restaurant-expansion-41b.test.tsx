// @vitest-environment jsdom
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App, { RestaurantListView, RestaurantMenuView } from './App'
import { rankRestaurantsForGrid, restaurantCompleteness } from './menu-presentation'
import { getEligibleRandomMealItems } from './random-meal'
import { recipeRestaurantRelations } from './recipe-restaurant-relations'
import { loadRestaurantMenuFavorites, saveRestaurantMenuFavorites } from './restaurant-menu-favorites'
import { explorePresetFilters, filterRestaurantMenuItems, restaurantMenuItems, restaurants, searchRestaurantMenuItems, validateRestaurantMenuItems, validateRestaurants } from './restaurants'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
const brandIds = ['fam-time-thailand', 'fa-pla-tahn-thailand']
const menuIds = ['fam-time-spaghetti-spinach-garlic', 'fam-time-classic-nonna-carbonara-pancetta', 'fa-pla-tahn-seabass-rice-clear-soup']
const local = (id: string) => restaurantMenuItems.filter(item => item.restaurantId === id)
const items = menuIds.map(id => restaurantMenuItems.find(item => item.id === id)!)
const ids = (list: typeof restaurantMenuItems) => list.map(item => item.id)
let container: HTMLDivElement
let root: Root
beforeEach(() => {
  localStorage.clear()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => { act(() => root.unmount()); container.remove() })
const click = (element: Element | null | undefined) => { expect(element).toBeTruthy(); act(() => (element as HTMLElement).click()) }
const view = (id: string, locale: 'th' | 'en') => act(() => root.render(<RestaurantMenuView restaurantId={id} locale={locale} onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable />))

describe('Slice 41B exact catalog delta', () => {
  it('adds only the five explicitly approved objects and freezes every pre-41B source byte', () => {
    // Entire source at Phase B entry 674265b, normalized to LF; no runtime Git dependency.
    const baselineHash = '163498aebe4973b27770815dea01ac5940ed88e0eadc49bfc374d5a521eac507'
    let current = readFileSync(resolve(__dirname, 'restaurants.ts'), 'utf8').replace(/\r\n/g, '\n')
    for (const id of [...brandIds, ...menuIds]) {
      const start = current.indexOf(`  {\n    id: '${id}'`)
      expect(start, id).toBeGreaterThan(0)
      const end = current.indexOf('\n  },', start) + 6
      current = current.slice(0, start) + current.slice(end)
    }
    current = current.replace(/\n\/\/ Slice 41B:[\s\S]*?\n(?=\n\/\/ Slice 40B restaurant expansion)/, '')
    const hash = (s: string) => createHash('sha256').update(s).digest('hex')
    expect(hash(current)).toBe(baselineHash)
    expect(restaurants.slice(15).map(r => r.id)).toEqual(brandIds)
    expect(ids(restaurantMenuItems.slice(94))).toEqual(menuIds)
    expect(ids(local(brandIds[0]))).toEqual(menuIds.slice(0, 2))
    expect(ids(local(brandIds[1]))).toEqual(menuIds.slice(2))
    expect(validateRestaurants(restaurants)).toEqual([])
    expect(validateRestaurantMenuItems(restaurantMenuItems, restaurants)).toEqual([])
  })

  it('preserves exact official bilingual dish names, selected clear soup and existing category', () => {
    expect(items.map(i => i.name)).toEqual([
      { th: 'สปาเกตตี้ผักโขมกระเทียม', en: 'Spaghetti Spinach & Garlic' },
      { th: 'คลาสสิกคาโบนาร่า', en: 'Classic Nonna Carbonara With Pancetta' },
      { th: 'ข้าวต้มปลากะพง (น้ำ)', en: 'Boiled rice with seabass fillets — with clear soup' },
    ])
    expect(items.map(i => i.category)).toEqual(['Rice & noodles', 'Rice & noodles', 'Rice & noodles'])
    expect(restaurants.find(r => r.id === brandIds[0])?.name).toEqual({ th: 'FAM TIME', en: 'FAM TIME' })
    expect(items[1].servingNote?.en).toContain('egg, pancetta and pecorino')
    expect(items[1].servingNote?.en).toContain('no cream, butter or extra oil')
    expect(items[2].servingNote?.en).toContain('one bowl with clear soup only')
    expect(items[2].servingNote?.en).toContain('including rice and seabass')
    expect(JSON.stringify({ name: items[2].name, servingNote: items[2].servingNote, tags: items[2].tags })).not.toMatch(/dry|fried|grilled|steamed|noodle|แห้ง|ทอด|ย่าง|นึ่ง/i)
  })

  it('pins transparent serving estimates and withholds unsupported fields', () => {
    expect(items.map(i => i.nutrition)).toEqual([
      { kcal: 500, protein: 15, carbs: 70, fat: 18 },
      { kcal: 640, protein: 31, carbs: 64, fat: 29 },
      { kcal: 470, protein: 35, carbs: 59, fat: 9 },
    ])
    for (const item of items) {
      expect(item.nutritionSource).toMatchObject({ confidence: 'estimated', asOf: '2026-10-01' })
      expect(item.nutritionSource.note?.en).toMatch(/does not publish numerical nutrition.*inspected sources/)
      expect(item.nutritionSource.note?.en).toContain('GoodFood')
      expect(item.nutritionSource.note?.en).toContain('editorial portion assumptions')
      expect(item.nutritionSource.note?.en).toContain('https://')
      expect(item.nutritionSource.note?.th).toContain('ค่าประมาณ')
      expect(item.servingNote?.th && item.servingNote?.en).toBeTruthy()
      expect(item.price).toBeUndefined()
      expect(item.menuImage).toBeUndefined()
      expect(item.nutrition.sodium).toBeUndefined()
      expect(item.nutrition.fiber).toBeUndefined()
      const n = item.nutrition
      expect(Math.abs(n.kcal - (n.protein * 4 + n.carbs * 4 + n.fat * 9))).toBeLessThan(30)
    }
    expect(recipeRestaurantRelations).toHaveLength(23)
    expect(recipeRestaurantRelations.some(r => menuIds.includes(r.restaurantMenuItemId))).toBe(false)
  })

  it('pins official remote logo provenance and final counts without rank manipulation', () => {
    expect(brandIds.map(id => restaurants.find(r => r.id === id)!.logo)).toMatchObject([
      { kind: 'official-remote', src: 'https://static.wixstatic.com/media/b1718d_0eb4cca5312c425a91b61de24e802f09~mv2.png', sourceUrl: 'https://www.famtimebkk.com/', asOf: '2026-10-01' },
      { kind: 'official-remote', src: 'https://ugc.production.linktr.ee/56aac372-db7a-42a5-9c39-0af1c5c36ab0_logo.jpeg', sourceUrl: 'https://linktr.ee/faplatahn', asOf: '2026-10-01' },
    ])
    expect([restaurants.length, restaurants.filter(r => r.logo).length, restaurantMenuItems.length, restaurantMenuItems.filter(i => i.menuImage).length, restaurantMenuItems.filter(i => !i.menuImage).length, restaurantMenuItems.filter(i => i.price).length]).toEqual([17, 17, 97, 50, 47, 44])
    const ranked = rankRestaurantsForGrid(restaurants, restaurantMenuItems)
    expect(ranked.slice(-2).map(r => r.id)).toEqual(brandIds)
    for (const id of brandIds) expect(restaurantCompleteness(id, restaurantMenuItems)).toMatchObject({ imageCoverage: 0, priceCoverage: 0 })
    expect(restaurants.slice(-2).map(r => r.id)).toEqual(brandIds)
  })
})

describe('Slice 41B shared discovery and detail paths', () => {
  it('searches both languages and derives Quick Goals from estimates', () => {
    const search = (q: string) => ids(searchRestaurantMenuItems(restaurantMenuItems, restaurants, q))
    expect(search('FAM TIME')).toEqual(menuIds.slice(0, 2))
    expect(search('Spinach & Garlic')).toEqual(menuIds.slice(0, 1))
    expect(search('คลาสสิกคาโบนาร่า')).toEqual(menuIds.slice(1, 2))
    expect(search('ฟ้าปลาทาน')).toEqual(menuIds.slice(2))
    expect(search('seabass')).toContain(menuIds[2])
    expect(search('ข้าวต้มปลากะพง')).toEqual(menuIds.slice(2))
    expect(ids(filterRestaurantMenuItems(items, explorePresetFilters['high-protein']))).toEqual(menuIds.slice(1))
    expect(ids(filterRestaurantMenuItems(items, explorePresetFilters['light-meal']))).toEqual([])
    expect(ids(filterRestaurantMenuItems(items, explorePresetFilters.balanced))).toEqual(menuIds.slice(2))
    expect(filterRestaurantMenuItems(items, { maxSodium: 2000 })).toEqual([])
  })

  it('includes every item in Random Meal and favorites without custom integration', () => {
    expect(ids(getEligibleRandomMealItems(restaurantMenuItems, restaurants))).toEqual(ids(restaurantMenuItems))
    let stored = ''
    saveRestaurantMenuFavorites(menuIds, { setItem: (_k, v) => { stored = v } })
    expect(loadRestaurantMenuFavorites({ getItem: () => stored })).toEqual(menuIds)
  })

  it('renders the ranked grid and lets Random Restaurant select each from its original pool', () => {
    act(() => root.render(<App />))
    click(container.querySelector('.restaurant-nav'))
    const cards = [...container.querySelectorAll('.restaurant-grid .restaurant-card')]
    expect(cards).toHaveLength(17)
    for (const id of brandIds) {
      expect(cards.find(c => c.querySelector(`[data-restaurant-identity="${id}"]`))?.querySelector('img')?.getAttribute('src')).toBe(restaurants.find(r => r.id === id)!.logo!.src)
      const index = restaurants.findIndex(r => r.id === id)
      act(() => root.unmount()); root = createRoot(container)
      act(() => root.render(<RestaurantListView locale="en" onOpen={() => undefined} random={() => (index + 0.5) / restaurants.length} />))
      click(container.querySelector('.restaurant-pick-trigger'))
      expect(container.querySelector('.restaurant-pick-card h3')?.textContent).toBe(restaurants[index].name.en)
    }
  })

  it('renders exact local pools in both locales with readable estimates and no image or price', () => {
    for (const id of brandIds) for (const locale of ['th', 'en'] as const) {
      act(() => root.unmount()); root = createRoot(container)
      view(id, locale)
      const cards = [...container.querySelectorAll<HTMLElement>('.menu-grid-card')]
      expect(cards.map(c => c.dataset.menuItemId)).toEqual(ids(local(id)))
      for (const card of cards) {
        expect(card.querySelector('.menu-item-image-frame')).toBeNull()
      }
      click(container.querySelector('.menu-pick-header .random-button'))
      expect(local(id).map(i => i.name[locale])).toContain(container.querySelector('.menu-pick-card h3')?.textContent)
    }
  })
})
