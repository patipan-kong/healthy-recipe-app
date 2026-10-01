// @vitest-environment jsdom
import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { MenuItemImage } from './menu-image'
import { validateMenuImage } from './meal-context'
import { imageFirstMenuItems } from './menu-presentation'
import { getEligibleRandomMealItems } from './random-meal'
import { explorePresetFilters, filterRestaurantMenuItems, restaurantMenuItems, restaurants, searchRestaurantMenuItems } from './restaurants'
import type { RestaurantMenuItem } from './types'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
const approvedIds = ['steak-and-more-yum-woon-sen', 'steak-and-more-som-tam', 'ootoya-shima-hokke-grilled']
const priorImageIds: string[] = ["ootoya-grilled-mackerel", "ootoya-grilled-moromi-chicken", "ootoya-oyakodon", "ootoya-tonteki-pork-chop-set", "salad-factory-grilled-chicken-sesame", "salad-factory-quinoa-chicken-basil", "salad-factory-kale-chicken-truffle", "salad-factory-rocket-skirt-steak", "seven-eleven-garlic-pork-egg-rice", "seven-eleven-green-curry-chicken", "jones-chicken-sesame-salad", "jones-grilled-salmon-salad", "jones-caesar-chicken-salad", "jones-chicken-larb-crispy-rice-salad", "jones-caribbean-chicken-steak", "fuji-salmon-shioyaki-brown-rice-set", "fuji-salmon-tataki", "fuji-kinoko-mushroom-salad", "fuji-chicken-teriyaki", "fuji-chirashi-sushi-don-set", "mk-health-vegetable-set-small", "mk-special-vegetable-set", "mk-special-kurobuta-set", "mk-special-kurobuta-plate", "mk-premium-suki-set", "mk-seafood-suki-broth", "mk-pork-shabu", "sukiya-gyudon-regular", "sukiya-beef-plate-no-rice", "santa-fe-salmon-steak", "santa-fe-dory-fish-steak", "santa-fe-kurobuta-pork-chop", "nittaya-grilled-chicken-quarter", "nittaya-grilled-pork-neck", "nittaya-som-tam-thai", "nittaya-som-tam-salted-egg", "nittaya-larb-moo", "nittaya-chiang-mai-fried-pork", "thongsmith-wagyu-ribeye-boat-noodle", "thongsmith-kurobuta-pork-boat-noodle", "thongsmith-dry-rice-kurobuta-braised-pork", "thongsmith-grilled-pork-meatballs"]
const remote = 'https://cdn.minorfood.com/uploaded/brand/tile/175757423068c2745661fb5.jpg'
const cropSources: Record<string, string> = {
  'steak-and-more-som-tam': 'https://cdn.minorfood.com/uploaded/editor/20250122/body-3.jpg',
  'ootoya-shima-hokke-grilled': 'https://www.ootoya.co.th/upload_file/menu/Fish-Menu/%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B8%8A%E0%B8%B4%E0%B8%A1%E0%B8%B2%E0%B8%AE%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%81%E0%B8%B0%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%99-big.png',
}
// Slice 40B adds five getfresh images, two restaurants and ten items; the 39A baselines below describe the catalog without them.
const slice40bImageIds = ['getfresh-clean-khao-man-gai', 'getfresh-clean-kaprao-gai', 'getfresh-vegan-mushroom-kaprao', 'getfresh-korean-pork-bulgogi-bowl', 'getfresh-chicken-burrito-bowl']
const slice40bBlockIds = [
  'getfresh-thailand', 'ginger-farm-kitchen-thailand', ...slice40bImageIds, 'getfresh-atlantic-salmon-steak', 'getfresh-minestrone',
  // Explicit 41B additions excluded from the unchanged historical hash.
  'fam-time-thailand', 'fa-pla-tahn-thailand', 'fam-time-spaghetti-spinach-garlic', 'fam-time-classic-nonna-carbonara-pancetta', 'fa-pla-tahn-seabass-rice-clear-soup',
  'ginger-farm-khao-soi-gai', 'ginger-farm-khanom-jeen-nam-ngiao', 'ginger-farm-herb-grilled-chicken-jaew',
]
const find = (id: string) => restaurantMenuItems.find(item => item.id === id)!
const ids = (items: RestaurantMenuItem[]) => items.map(item => item.id)

describe('Slice 39A approved imagery', () => {
  it('adds only the three approved IDs and reaches 45/84 (before Slice 40B) without hiding Somtam Nua', () => {
    const pre40b = restaurantMenuItems.filter(item => !slice40bBlockIds.includes(item.id))
    expect(restaurants.filter(item => !slice40bBlockIds.includes(item.id))).toHaveLength(13)
    expect(restaurants.filter(item => item.logo && !slice40bBlockIds.includes(item.id))).toHaveLength(13)
    expect(pre40b).toHaveLength(84)
    expect(pre40b.filter(item => item.menuImage)).toHaveLength(45)
    expect(pre40b.filter(item => !item.menuImage)).toHaveLength(39)
    expect(ids(restaurantMenuItems.filter(item => item.menuImage && !slice40bImageIds.includes(item.id))).sort()).toEqual([...priorImageIds, ...approvedIds].sort())
    for (const id of ['jones-mushroom-soup', 'thongsmith-spicy-shredded-chicken-dry']) expect(find(id).menuImage, id).toBeUndefined()
    expect(restaurants.some(item => item.id === 'somtam-nua-thailand')).toBe(true)
    const somtam = restaurantMenuItems.filter(item => item.restaurantId === 'somtam-nua-thailand')
    expect(somtam).toHaveLength(8)
    expect(somtam.every(item => !item.menuImage)).toBe(true)
  })

  it('pins official remote and local crop provenance', () => {
    expect(find(approvedIds[0]).menuImage).toMatchObject({ src: remote, kind: 'official-remote', sourceUrl: 'https://www.minorfood.com/th/our-business/the-steak-and-more', asOf: '2026-09-30' })
    expect(find(approvedIds[0]).menuImage?.cropOf).toBeUndefined()
    for (const [id, cropOf] of Object.entries(cropSources)) {
      const image = find(id).menuImage
      expect(image).toMatchObject({ src: `/menu/${id}.webp`, kind: 'bundled', cropOf, asOf: '2026-09-30' })
      expect(image?.sourceLabel?.en).toMatch(/^Cropped from /)
      expect(image?.sourceUrl).toBe(id.startsWith('ootoya') ? 'https://www.ootoya.co.th/menu-details.php?id=1' : 'https://www.minorfood.com/th/news/minor-food-launches-the-steak-and-more')
    }
    for (const id of approvedIds) {
      expect(validateMenuImage(find(id).menuImage)).toEqual([])
      expect(find(id).menuImage?.sourceLabel?.th).toBeTruthy()
      expect(find(id).menuImage?.alt.en).toBeTruthy()
    }
  })

  it('ships opaque lossy WebP crops at their measured native export dimensions', () => {
    const dimensions: Record<string, [number, number]> = { 'steak-and-more-som-tam': [450, 440], 'ootoya-shima-hokke-grilled': [428, 235] }
    for (const [id, [width, height]] of Object.entries(dimensions)) {
      const path = resolve(__dirname, '..', 'public', 'menu', `${id}.webp`)
      expect(statSync(path).size).toBeGreaterThan(1000)
      const data = readFileSync(path)
      expect(data.subarray(0, 4).toString()).toBe('RIFF')
      expect(data.subarray(8, 12).toString()).toBe('WEBP')
      // Pillow RGB export uses the standard opaque VP8 frame, not a mislabeled JPEG or CMYK asset.
      expect(data.subarray(12, 16).toString()).toBe('VP8 ')
      expect(data.subarray(23, 26)).toEqual(Buffer.from([0x9d, 0x01, 0x2a]))
      expect(data.readUInt16LE(26) & 0x3fff).toBe(width)
      expect(data.readUInt16LE(28) & 0x3fff).toBe(height)
    }
  })

  it('pins catalog fields after the approved Slice 39C partial corrections and preserves recipe relations', () => {
    const source = readFileSync(resolve(__dirname, 'restaurants.ts'), 'utf8').replace(/\r\n/g, '\n')
    const withoutSlice40b = slice40bBlockIds.reduce((text, id) => {
      const start = text.indexOf(`  {\n    id: '${id}'`)
      expect(start, id).toBeGreaterThan(0)
      return text.slice(0, start) + text.slice(text.indexOf('\n  },', start) + 6)
    }, source)
    const catalog = withoutSlice40b.slice(withoutSlice40b.indexOf('export const restaurants:'), withoutSlice40b.indexOf('export const emptyRestaurantMenuFilters'))
      .replace(/^    menuImage: \{[\s\S]*?^    \},\n/gm, '')
    expect(createHash('sha256').update(catalog).digest('hex')).toBe('274bf04d731192e8ec565db750e823514560c9cbd4b073f339322b33ff350b9b')
    const relations = readFileSync(resolve(__dirname, 'recipe-restaurant-relations.ts'))
    expect(createHash('sha256').update(relations).digest('hex')).toBe('80e2b0ec4063909ef47659d2d0acd8b230143db91d201b80ddf7150b6b6feaea')
  })

  it('preserves search, filters, presets, random membership and presentation membership', () => {
    const before = restaurantMenuItems.map(item => approvedIds.includes(item.id) ? { ...item, menuImage: undefined } : item)
    for (const query of ['salad', 'steak', 'ไก่', 'ส้มตำ', 'hokke', 'noodle']) {
      expect(ids(searchRestaurantMenuItems(restaurantMenuItems, restaurants, query))).toEqual(ids(searchRestaurantMenuItems(before, restaurants, query)))
    }
    for (const filters of [...Object.values(explorePresetFilters), { maxKcal: 300 }, { minProtein: 25 }, { maxSodium: 900 }]) {
      expect(ids(filterRestaurantMenuItems(restaurantMenuItems, filters))).toEqual(ids(filterRestaurantMenuItems(before, filters)))
    }
    expect(ids(getEligibleRandomMealItems(restaurantMenuItems, restaurants))).toEqual(ids(getEligibleRandomMealItems(before, restaurants)))
    expect(ids(imageFirstMenuItems(restaurantMenuItems)).sort()).toEqual(ids(before).sort())
    expect(ids(restaurantMenuItems)).toEqual(ids(before))
  })

  it('removes failed remote/local images cleanly from both card and detail surfaces', () => {
    for (const id of [approvedIds[0], approvedIds[1]]) for (const variant of ['card', 'hero'] as const) {
      const container = document.createElement('article')
      document.body.append(container)
      const root = createRoot(container)
      act(() => root.render(<><MenuItemImage image={find(id).menuImage} locale="en" variant={variant} /><h3>Retained menu title</h3></>))
      const img = container.querySelector('img')!
      expect(img.getAttribute('src')).toBe(find(id).menuImage!.src)
      act(() => img.dispatchEvent(new Event('error')))
      expect(container.querySelector('img')).toBeNull()
      expect(container.querySelector('figure')).toBeNull()
      expect(container.querySelector('h3')?.textContent).toBe('Retained menu title')
      act(() => root.unmount())
      container.remove()
    }
  })
})
