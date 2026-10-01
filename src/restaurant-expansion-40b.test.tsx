// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App, { RestaurantListView, RestaurantMenuView } from './App'
import { imageFirstMenuItems } from './menu-presentation'
import { validateMenuImage } from './meal-context'
import { getEligibleRandomMealItems } from './random-meal'
import { recipeRestaurantRelations } from './recipe-restaurant-relations'
import { explorePresetFilters, filterRestaurantMenuItems, restaurantMenuItems, restaurants, searchRestaurantMenuItems, validateRestaurantMenuItems, validateRestaurants } from './restaurants'
import { loadRestaurantMenuFavorites, saveRestaurantMenuFavorites } from './restaurant-menu-favorites'
import type { RestaurantMenuItem } from './types'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const GETFRESH = 'getfresh-thailand'
const GINGER = 'ginger-farm-kitchen-thailand'
const getfreshImageIds = ['getfresh-clean-khao-man-gai', 'getfresh-clean-kaprao-gai', 'getfresh-vegan-mushroom-kaprao', 'getfresh-korean-pork-bulgogi-bowl', 'getfresh-chicken-burrito-bowl']
const getfreshNoImageIds = ['getfresh-atlantic-salmon-steak', 'getfresh-minestrone']
const getfreshIds = [...getfreshImageIds, ...getfreshNoImageIds]
const gingerIds = ['ginger-farm-khao-soi-gai', 'ginger-farm-khanom-jeen-nam-ngiao', 'ginger-farm-herb-grilled-chicken-jaew']
const newIds = [...getfreshIds, ...gingerIds]
const find = (id: string) => restaurantMenuItems.find(item => item.id === id)!
const ids = (items: RestaurantMenuItem[]) => items.map(item => item.id)
const local = (restaurantId: string) => restaurantMenuItems.filter(item => item.restaurantId === restaurantId)

// Exact official image URLs documented in docs/restaurant-expansion-research-40a.md and re-verified on 2026-10-01.
const imageUrls: Record<string, { src: string; sourceUrl: string }> = {
  'getfresh-clean-khao-man-gai': { src: 'https://getfresh.co.th/wp-content/uploads/2025/02/Clean-Khao-Man-Gai.png', sourceUrl: 'https://getfresh.co.th/menu/clean-khao-man-gai/' },
  'getfresh-clean-kaprao-gai': { src: 'https://getfresh.co.th/wp-content/uploads/2022/03/Clean-Kra-Pao-Gai-1024x1024.png', sourceUrl: 'https://getfresh.co.th/menu/clean-kaprao-gai/' },
  'getfresh-vegan-mushroom-kaprao': { src: 'https://getfresh.co.th/wp-content/uploads/2022/03/Vegan-Mushroom-Kaprao-1024x1024.png', sourceUrl: 'https://getfresh.co.th/menu/vegan-mushroom-kaprao/' },
  'getfresh-korean-pork-bulgogi-bowl': { src: 'https://getfresh.co.th/wp-content/uploads/2024/04/Korean-Bulgogi-Bowl-Pork.png', sourceUrl: 'https://getfresh.co.th/menu/spicy-pork-bulgogi-bowl/' },
  'getfresh-chicken-burrito-bowl': { src: 'https://getfresh.co.th/wp-content/uploads/2025/02/Chicken-Burrito-Bowl.png', sourceUrl: 'https://getfresh.co.th/menu/chicken-burrito-bowl/' },
}

let container: HTMLDivElement
let root: Root
beforeEach(() => {
  localStorage.clear()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllEnvs()
})
const q = <T extends Element = HTMLElement>(selector: string) => container.querySelector<T>(selector)
const qa = <T extends Element = HTMLElement>(selector: string) => [...container.querySelectorAll<T>(selector)]
const click = (element: Element | null | undefined) => { expect(element).toBeTruthy(); act(() => (element as HTMLElement).click()) }

describe('Slice 40B restaurants', () => {
  it('adds exactly getfresh and Ginger Farm Kitchen after the original 13, with deterministic ids', () => {
    expect(restaurants).toHaveLength(15)
    expect(restaurants.slice(13).map(item => item.id)).toEqual([GETFRESH, GINGER])
    expect(validateRestaurants(restaurants)).toEqual([])
  })

  it('gives both new restaurants an official-remote logo with full provenance', () => {
    expect(restaurants.filter(item => item.logo)).toHaveLength(15)
    const getfresh = restaurants.find(item => item.id === GETFRESH)!.logo!
    expect(getfresh).toMatchObject({
      src: 'https://profile.line-scdn.net/0hlLjprtuSM2NXCS9GHq5MNGtMPQ4gJzUrL2ooUXEPOFYqPCY1OGcoBCZablp8aiFnaz11VXZaOQR8/preview',
      kind: 'official-remote', sourceUrl: 'https://page.line.me/700dmltt', asOf: '2026-10-01',
    })
    const ginger = restaurants.find(item => item.id === GINGER)!.logo!
    expect(ginger).toMatchObject({
      src: 'https://images.squarespace-cdn.com/content/v1/5dcac1b37b75f56509c0a367/1577359518038-F21TWZ1SK7S55O0AKTQI/GFKlogo.png',
      kind: 'official-remote', sourceUrl: 'https://www.gingerfarmkitchen.com/', asOf: '2026-10-01',
    })
    for (const logo of [getfresh, ginger]) {
      expect(logo.alt.th && logo.alt.en && logo.sourceLabel.th && logo.sourceLabel.en).toBeTruthy()
      expect(logo.src.startsWith('https://') && logo.sourceUrl.startsWith('https://')).toBe(true)
    }
  })
})

describe('Slice 40B menu items', () => {
  it('adds exactly 7 getfresh and 3 Ginger Farm items (94 total) with unique ids, valid categories and bilingual names', () => {
    expect(restaurantMenuItems).toHaveLength(94)
    expect(local(GETFRESH)).toHaveLength(7)
    expect(local(GINGER)).toHaveLength(3)
    expect(ids(local(GETFRESH))).toEqual(getfreshIds)
    expect(ids(local(GINGER))).toEqual(gingerIds)
    expect(new Set(ids(restaurantMenuItems)).size).toBe(94)
    expect(validateRestaurantMenuItems(restaurantMenuItems, restaurants)).toEqual([])
    for (const item of newIds.map(find)) {
      expect(item.name.th.trim() && item.name.en.trim(), item.id).toBeTruthy()
      expect(item.servingNote?.th && item.servingNote?.en, item.id).toBeTruthy()
    }
  })

  it('uses the approved official English names and categories', () => {
    expect(newIds.map(id => [find(id).name.en, find(id).category])).toEqual([
      ['Clean Khao Man Gai', 'Rice & noodles'],
      ['Clean Kaprao Gai', 'Rice & noodles'],
      ['Vegan Mushroom Kaprao', 'Rice & noodles'],
      ['Korean Pork Bulgogi Bowl', 'Rice & noodles'],
      ['Chicken Burrito Bowl', 'Rice & noodles'],
      ['Atlantic Salmon Steak', 'Grilled/BBQ'],
      ['Minestrone', 'Soup'],
      ['Khao Soi Northern Style Noodle Curry with Crispy Noodle and Chicken', 'Rice & noodles'],
      ['Northern Thai Brown Rice Noodle Soup with Minced Pork, Pork Ribs, Tomato and Pork Blood', 'Rice & noodles'],
      ['Herb-marinated Grilled Chicken served with Jaew Dip', 'Grilled/BBQ'],
    ])
    expect(find(gingerIds[0]).name.th).toBe('ข้าวซอยไก่')
    expect(find(gingerIds[1]).name.th).toBe('ขนมจีนน้ำเงี้ยวเส้นข้าวกล้องเล้งกระดูก')
    expect(find(gingerIds[2]).name.th).toBe('ไก่หมักสมุนไพรย่าง เสิร์ฟพร้อมน้ำจิ้มแจ่ว')
  })

  it('discloses the Ginger Farm source branch and that the grilled chicken excludes rice', () => {
    for (const id of gingerIds) {
      expect(find(id).servingNote?.en, id).toContain('One Nimman, Chiang Mai 2026')
      expect(find(id).servingNote?.th, id).toContain('วันนิมมาน')
      expect(find(id).nutritionSource.note?.en, id).toContain('One Nimman, Chiang Mai 2026')
    }
    expect(find(gingerIds[2]).servingNote?.en).toContain('rice is not included')
    expect(find(gingerIds[2]).servingNote?.th).toContain('ไม่รวมข้าว')
  })
})

describe('Slice 40B nutrition and prices', () => {
  it('estimates every new item, never claims official nutrition, and reconciles kcal with macros', () => {
    for (const id of newIds) {
      const item = find(id)
      expect(item.nutritionSource.confidence, id).toBe('estimated')
      expect(item.nutritionSource.asOf, id).toBe('2026-10-01')
      expect(item.nutritionSource.note?.en, id).toMatch(/does not publish numerical nutrition/)
      expect(item.nutritionSource.note?.th.trim(), id).toBeTruthy()
      const { kcal, protein, carbs, fat } = item.nutrition
      expect(Math.abs(kcal - (protein * 4 + carbs * 4 + fat * 9)), id).toBeLessThanOrEqual(180)
      expect(item.nutrition.sodium, `${id}: unpublished sodium stays unknown`).toBeUndefined()
    }
    expect(restaurantMenuItems.filter(item => item.nutritionSource.confidence === 'official')).toHaveLength(0)
  })

  it('pins the curated estimates', () => {
    expect(Object.fromEntries(newIds.map(id => [id, find(id).nutrition]))).toEqual({
      'getfresh-clean-khao-man-gai': { kcal: 490, protein: 48, carbs: 50, fat: 10 },
      'getfresh-clean-kaprao-gai': { kcal: 590, protein: 48, carbs: 55, fat: 18 },
      'getfresh-vegan-mushroom-kaprao': { kcal: 410, protein: 13, carbs: 63, fat: 12 },
      'getfresh-korean-pork-bulgogi-bowl': { kcal: 640, protein: 44, carbs: 72, fat: 17 },
      'getfresh-chicken-burrito-bowl': { kcal: 860, protein: 53, carbs: 78, fat: 38 },
      'getfresh-atlantic-salmon-steak': { kcal: 630, protein: 39, carbs: 34, fat: 36 },
      'getfresh-minestrone': { kcal: 140, protein: 5, carbs: 25, fat: 3 },
      'ginger-farm-khao-soi-gai': { kcal: 700, protein: 33, carbs: 62, fat: 36 },
      'ginger-farm-khanom-jeen-nam-ngiao': { kcal: 540, protein: 27, carbs: 60, fat: 21 },
      'ginger-farm-herb-grilled-chicken-jaew': { kcal: 420, protein: 45, carbs: 6, fat: 23 },
    })
  })

  it('withholds every 40B price (undated website prices; branch-specific prices plus service charge)', () => {
    for (const id of newIds) expect(find(id).price, id).toBeUndefined()
    expect(restaurantMenuItems.filter(item => item.price)).toHaveLength(44)
  })

  it('carries the high-protein tag only where the estimate independently meets the numeric rule', () => {
    for (const id of newIds) {
      const { kcal, protein } = find(id).nutrition
      expect(find(id).tags.includes('high-protein'), id).toBe(kcal <= 700 && protein >= 30)
    }
  })
})

describe('Slice 40B images', () => {
  it('gives G1-G5 pinned official-remote images with provenance, and nothing else', () => {
    expect(restaurantMenuItems.filter(item => item.menuImage)).toHaveLength(50)
    expect(ids(restaurantMenuItems.filter(item => item.menuImage && item.restaurantId === GETFRESH))).toEqual(getfreshImageIds)
    for (const id of getfreshImageIds) {
      const image = find(id).menuImage!
      expect(image, id).toMatchObject({ kind: 'official-remote', ...imageUrls[id], asOf: '2026-10-01' })
      expect(image.cropOf).toBeUndefined()
      expect(validateMenuImage(image), id).toEqual([])
      expect(image.src.startsWith('https://getfresh.co.th/wp-content/uploads/')).toBe(true)
      expect(image.src).not.toMatch(/[?&](oe|oh|sig|signature|expires|token)=/i)
      expect(image.alt.th && image.alt.en && image.sourceLabel?.th && image.sourceLabel?.en).toBeTruthy()
    }
  })

  it('intentionally leaves G6, G7 and all Ginger Farm items image-less with no placeholder', () => {
    for (const id of [...getfreshNoImageIds, ...gingerIds]) expect(find(id).menuImage, id).toBeUndefined()
    expect(restaurantMenuItems.filter(item => !item.menuImage)).toHaveLength(44)
    expect(JSON.stringify(find('getfresh-atlantic-salmon-steak'))).not.toMatch(/placeholder|Salmon-Steak\.png/i)
  })
})

describe('Slice 40B discovery', () => {
  it('finds the new items by Thai and English search, including by restaurant name', () => {
    const search = (query: string) => ids(searchRestaurantMenuItems(restaurantMenuItems, restaurants, query))
    expect(search('Khao Man Gai')).toContain('getfresh-clean-khao-man-gai')
    expect(search('กะเพราเห็ดวีแกน')).toEqual(['getfresh-vegan-mushroom-kaprao'])
    expect(search('Bulgogi')).toContain('getfresh-korean-pork-bulgogi-bowl') // also matches 7-Eleven's bulgogi rice
    expect(search('Minestrone')).toEqual(['getfresh-minestrone'])
    expect(search('getfresh')).toEqual(getfreshIds)
    expect(search('Khao Soi')).toEqual(['ginger-farm-khao-soi-gai'])
    expect(search('น้ำเงี้ยว')).toEqual(['ginger-farm-khanom-jeen-nam-ngiao'])
    expect(search('Jaew')).toContain('ginger-farm-herb-grilled-chicken-jaew') // other restaurants also serve jaew dishes
    expect(search('Ginger Farm')).toEqual(gingerIds)
    expect(search('จินเจอร์')).toEqual(gingerIds)
  })

  it('derives Quick Goal membership solely from the estimates, not from data flags', () => {
    const goal = (preset: keyof typeof explorePresetFilters) => ids(filterRestaurantMenuItems(local(GETFRESH).concat(local(GINGER)), explorePresetFilters[preset]))
    const expected = (match: (n: RestaurantMenuItem['nutrition']) => boolean) => newIds.filter(id => match(find(id).nutrition))
    expect(goal('high-protein')).toEqual(expected(n => n.kcal <= 700 && n.protein >= 30))
    expect(goal('light-meal')).toEqual(expected(n => n.kcal <= 450))
    expect(goal('balanced')).toEqual(expected(n => n.kcal <= 650 && n.protein >= 25 && n.fat <= 25))
  })

  it('lets every new item be eligible for Random Meal and survive a favorites round trip', () => {
    const eligible = ids(getEligibleRandomMealItems(restaurantMenuItems, restaurants))
    for (const id of newIds) expect(eligible).toContain(id)
    let saved = ''
    saveRestaurantMenuFavorites(newIds, { setItem: (_key, value) => { saved = value } })
    expect(loadRestaurantMenuFavorites({ getItem: () => saved })).toEqual(newIds)
  })

  it('adds no recipe relations', () => {
    expect(recipeRestaurantRelations).toHaveLength(23)
    expect(recipeRestaurantRelations.some(relation => newIds.includes(relation.restaurantMenuItemId))).toBe(false)
  })

  it('lists both restaurants in the Restaurant Grid with logos, and Random Restaurant can pick each', () => {
    act(() => root.render(<App />))
    click(q('.restaurant-nav'))
    const cards = qa('.restaurant-grid .restaurant-card')
    expect(cards).toHaveLength(15)
    for (const id of [GETFRESH, GINGER]) {
      const card = cards.find(node => node.querySelector(`[data-restaurant-identity="${id}"]`))!
      expect(card, id).toBeDefined()
      expect(card.querySelector('img')?.getAttribute('src')).toBe(restaurants.find(item => item.id === id)!.logo!.src)
      expect(card.querySelector('[data-identity-source="logo"]')).not.toBeNull()
    }
    for (const [index, id] of [[restaurants.length - 2, GETFRESH], [restaurants.length - 1, GINGER]] as const) {
      act(() => root.unmount()); root = createRoot(container)
      act(() => root.render(<RestaurantListView locale="en" onOpen={() => undefined} random={() => (index + 0.5) / restaurants.length} />))
      click(q('.restaurant-pick-trigger'))
      expect(q('.restaurant-pick-card h3')?.textContent).toBe(restaurants.find(item => item.id === id)!.name.en)
    }
  })
})

describe('Slice 40B restaurant menus', () => {
  const view = (restaurantId: string, locale: 'th' | 'en' = 'en') => act(() => root.render(<RestaurantMenuView locale={locale} restaurantId={restaurantId} onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable />))

  it('shows getfresh G1-G5 image-first and G6/G7 as valid no-image cards', () => {
    view(GETFRESH)
    const cards = qa('.menu-grid-card')
    expect(cards.map(node => node.dataset.menuItemId)).toEqual(ids(imageFirstMenuItems(local(GETFRESH))))
    expect(cards.map(node => node.dataset.hasImage === 'true')).toEqual([true, true, true, true, true, false, false])
    expect(cards.slice(0, 5).every(node => node.querySelector('img'))).toBe(true)
    expect(cards.slice(5).every(node => !node.querySelector('.menu-item-image img'))).toBe(true)
  })

  it('shows all three Ginger Farm items as no-image cards with no placeholder boxes', () => {
    view(GINGER)
    const cards = qa('.menu-grid-card')
    expect(cards).toHaveLength(3)
    expect(cards.every(node => node.dataset.hasImage !== 'true' && !node.querySelector('img'))).toBe(true)
    expect(q('.menu-item-image-frame')).toBeNull()
  })

  it('restaurant-local Pick only sees that restaurant\'s items', () => {
    for (const restaurantId of [GETFRESH, GINGER]) {
      act(() => root.unmount()); root = createRoot(container)
      view(restaurantId)
      click(q('.menu-pick-header .random-button'))
      expect(local(restaurantId).map(item => item.name.en)).toContain(q('.menu-pick-card h3')?.textContent)
    }
  })

  it('renders the new restaurants in Thai without losing the official English wording elsewhere', () => {
    view(GINGER, 'th')
    expect(container.textContent).toContain('ข้าวซอยไก่')
    expect(container.textContent).toContain('ไก่หมักสมุนไพรย่าง เสิร์ฟพร้อมน้ำจิ้มแจ่ว')
  })
})
