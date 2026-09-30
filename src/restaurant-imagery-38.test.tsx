// @vitest-environment jsdom
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { validateMenuImage } from './meal-context'
import { MenuItemImage } from './menu-image'
import { imageFirstMenuItems } from './menu-presentation'
import { getEligibleRandomMealItems } from './random-meal'
import { explorePresetFilters, filterRestaurantMenuItems, restaurantMenuItems, restaurants, searchRestaurantMenuItems, validateRestaurantMenuItems } from './restaurants'
import type { RestaurantMenuItem } from './types'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const find = (id: string) => {
  const item = restaurantMenuItems.find(candidate => candidate.id === id)
  if (!item) throw new Error(`missing item ${id}`)
  return item
}

// Pinned to docs/restaurant-image-independent-research-opus.md (SAFE_STANDALONE_CANDIDATES).
const standaloneUrls: Record<string, string> = {
  'ootoya-oyakodon': 'https://www.ootoya.co.th/upload_file/menu/Donburi-Menu/%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B9%84%E0%B8%81%E0%B9%88%E0%B9%82%E0%B8%AD%E0%B8%A2%E0%B8%B2%E0%B9%82%E0%B8%81%E0%B8%B0-big.png',
  'salad-factory-grilled-chicken-sesame': 'https://img.imageboss.me/foodie24x7/width/500/format:webp/723305ef-3a77-4d9d-a603-e295dd72087d.jpg',
  'salad-factory-quinoa-chicken-basil': 'https://img.imageboss.me/foodie24x7/width/500/format:webp/9f9aab2a-d4c5-4932-ab02-c89245cea8d6.jpg',
  'salad-factory-kale-chicken-truffle': 'https://img.imageboss.me/foodie24x7/width/500/format:webp/6a1fa2fc-cef0-4df9-b57f-e52b5cf40aa4.jpg',
  'salad-factory-rocket-skirt-steak': 'https://img.imageboss.me/foodie24x7/width/500/format:webp/27100880-a2c7-4731-9bdb-f7cfbcfce517.jpg',
  'jones-chicken-sesame-salad': 'https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%87%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%84%E0%B8%B1%E0%B9%88%E0%B8%A7.png',
  'jones-grilled-salmon-salad': 'https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B9%81%E0%B8%8B%E0%B8%A5%E0%B8%A1%E0%B8%AD%E0%B8%99%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87.png',
  'jones-caesar-chicken-salad': 'https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%8B%E0%B8%B5%E0%B8%8B%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%84%E0%B8%81%E0%B9%88.png',
  'jones-chicken-larb-crispy-rice-salad': 'https://www.jonessalad.com/wp-content/uploads/2026/07/%E0%B8%AA%E0%B8%A5%E0%B8%B1%E0%B8%94%E0%B8%A5%E0%B8%B2%E0%B8%9A%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%81%E0%B9%88%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%9E%E0%B8%AD%E0%B8%87.png',
  'fuji-chicken-teriyaki': 'https://www.fuji.co.th/wp-content/uploads/2026/06/CHICKEN-TERIYAKI-768x768.png',
  'sukiya-gyudon-regular': 'https://www.sukiya.co.th/th/upload/top/img_gyudon.jpg',
}

// Accepted local crops and the official sheet each one was cropped from.
const cropSheets: Record<string, string> = {
  'jones-caribbean-chicken-steak': 'https://www.jonessalad.com/wp-content/uploads/2026/08/Aug-18_Steak_Chicken-Breast.jpg',
  'sukiya-beef-plate-no-rice': 'https://www.sukiya.co.th/th/menu/img/menu/menu_alacarte.jpg',
  'santa-fe-salmon-steak': 'https://santafesteak.com/img/menuslide/AW%20Santa%20Fe_NewMenu_09Fish_Normal_1753171936.jpg',
  'santa-fe-dory-fish-steak': 'https://santafesteak.com/img/menuslide/AW%20Santa%20Fe_NewMenu_09Fish_Normal_1753171936.jpg',
  'santa-fe-kurobuta-pork-chop': 'https://santafesteak.com/img/menuslide/AW%20Santa%20Fe_NewMenu_07Pork_Normal_1753171850.jpg',
  'thongsmith-wagyu-ribeye-boat-noodle': 'https://online.anyflip.com/iugnb/rchh/files/large/b79e70f66715b55e7b194b73ec6009f9.webp',
  'thongsmith-kurobuta-pork-boat-noodle': 'https://online.anyflip.com/iugnb/rchh/files/large/73bd9be8ec7c33215a3f1d3b0cb60127.webp',
  'thongsmith-dry-rice-kurobuta-braised-pork': 'https://online.anyflip.com/iugnb/rchh/files/large/51b13b11230d8a9320db2447984fdeb9.webp',
  'thongsmith-grilled-pork-meatballs': 'https://online.anyflip.com/iugnb/rchh/files/large/9adb672aa0e3015bafcb205c9abbb688.webp',
}

// Crop candidates rejected in Slice 38 (tiles too small to isolate truthfully / overlapping set or promo elements).
const rejectedCrops = ['sukiya-gyudon-okra-regular', 'sukiya-salad', 'sukiya-miso-soup']

// Classified in the research report as variant, reformulation, URL-unsuitable, marketplace-only, weak or not found.
const unapprovedIds = [
  'jones-mushroom-soup', 'seven-eleven-korean-chicken-fried-rice', 'seven-eleven-chicken-sukiyaki', 'seven-eleven-pork-bulgogi-rice',
  'fuji-salmon-shioyaki', 'ootoya-shima-hokke-grilled', 'sukiya-curry-rice-regular', 'thongsmith-spicy-shredded-chicken-dry',
  'zaab-eli-som-tam-salted-egg', 'zaab-eli-corn-salted-egg-som-tam',
  'salad-factory-spicy-pork-tenderloin', 'santa-fe-grilled-chicken-pepper-steak', 'santa-fe-chicken-steak-jaew', 'nittaya-tom-saep-grilled-chicken-soup',
  'steak-and-more-chicken-steak', 'steak-and-more-pork-chop', 'steak-and-more-yum-woon-sen',
  'ootoya-grilled-salmon-rice-bowl', 'salad-factory-salmon-sashimi-shoyu', 'seven-eleven-sticky-rice-dried-pork', 'jones-honey-lemon-basa-steak',
  'santa-fe-seabass-steak', 'santa-fe-premium-beef-steak', 'steak-and-more-squid-ink-spaghetti-shrimp', 'steak-and-more-caesar-salad', 'steak-and-more-som-tam',
]

const slice38Ids = [...Object.keys(standaloneUrls), ...Object.keys(cropSheets)]

describe('Slice 38 restaurant menu imagery', () => {
  it('keeps catalog counts and reaches 42 of 84 menu images', () => {
    expect(restaurants).toHaveLength(13)
    expect(restaurants.filter(restaurant => restaurant.logo)).toHaveLength(13)
    expect(restaurantMenuItems).toHaveLength(84)
    expect(restaurantMenuItems.filter(item => item.menuImage)).toHaveLength(42)
    expect(restaurantMenuItems.filter(item => !item.menuImage)).toHaveLength(42)
    expect(validateRestaurantMenuItems(restaurantMenuItems, restaurants)).toEqual([])
  })

  it('adds the 11 approved standalone images, pinned to the researched official-remote URLs', () => {
    expect(Object.keys(standaloneUrls)).toHaveLength(11)
    for (const [id, url] of Object.entries(standaloneUrls)) {
      const image = find(id).menuImage
      expect(image?.kind, id).toBe('official-remote')
      expect(image?.src, id).toBe(url)
      expect(image?.sourceUrl, id).toMatch(/^https:\/\//)
      expect(image?.sourceLabel, id).toBeDefined()
      expect(image?.asOf, id).toBe('2026-09-30')
      expect(image?.cropOf, id).toBeUndefined()
      expect(validateMenuImage(image), id).toEqual([])
    }
  })

  it('adds the accepted crops as bundled WebP assets with official-sheet provenance', () => {
    expect(Object.keys(cropSheets)).toHaveLength(9)
    for (const [id, sheet] of Object.entries(cropSheets)) {
      const image = find(id).menuImage
      expect(image?.kind, id).toBe('bundled')
      expect(image?.src, id).toBe(`/menu/${id}.webp`)
      expect(image?.cropOf, id).toBe(sheet)
      expect(image?.sourceUrl, id).toMatch(/^https:\/\//)
      expect(image?.sourceLabel?.en, id).toMatch(/^Cropped from /)
      expect(image?.asOf, id).toBe('2026-09-30')
      expect(validateMenuImage(image), id).toEqual([])
    }
  })

  it('ships every local crop as a non-empty, browser-safe WebP file', () => {
    for (const id of Object.keys(cropSheets)) {
      const path = resolve(__dirname, '..', 'public', 'menu', `${id}.webp`)
      expect(existsSync(path), id).toBe(true)
      expect(statSync(path).size, id).toBeGreaterThan(1000)
      const header = readFileSync(path).subarray(0, 12)
      expect(header.subarray(0, 4).toString('ascii'), id).toBe('RIFF')
      expect(header.subarray(8, 12).toString('ascii'), id).toBe('WEBP')
    }
  })

  it('only bundles images that are crops of an official sheet', () => {
    const bundled = restaurantMenuItems.filter(item => item.menuImage?.kind === 'bundled')
    expect(bundled.map(item => item.id).sort()).toEqual(Object.keys(cropSheets).sort())
    expect(validateMenuImage({ src: 'https://example.com/a.jpg', alt: { th: 'ก', en: 'a' }, kind: 'official-remote', cropOf: 'https://example.com/sheet.jpg' })).toContain('Invalid menu image cropOf')
  })

  it('does not give an image to rejected crops or unapproved candidates', () => {
    for (const id of [...rejectedCrops, ...unapprovedIds]) expect(find(id).menuImage, id).toBeUndefined()
    expect(restaurantMenuItems.filter(item => item.restaurantId === 'somtam-nua-thailand').every(item => !item.menuImage)).toBe(true)
    expect(restaurantMenuItems.filter(item => item.restaurantId === 'somtam-nua-thailand')).toHaveLength(8)
    expect(restaurants.some(restaurant => restaurant.id === 'somtam-nua-thailand')).toBe(true)
  })

  it('leaves the documented price discrepancies untouched', () => {
    expect(find('thongsmith-dry-rice-kurobuta-braised-pork').price?.amount).toBe(239)
    expect(find('salad-factory-quinoa-chicken-basil').price?.amount).toBe(195)
    expect(find('jones-caribbean-chicken-steak').price?.amount).toBe(199)
    expect(find('santa-fe-salmon-steak').price?.amount).toBe(329)
    expect(find('santa-fe-dory-fish-steak').price?.amount).toBe(209)
  })

  it('never references the compromised Salad Factory legacy domain', () => {
    const source = readFileSync(resolve(__dirname, 'restaurants.ts'), 'utf8')
    expect(source).not.toMatch(/saladfactorythailand/i)
    for (const item of restaurantMenuItems) expect(JSON.stringify(item.menuImage ?? {}), item.id).not.toMatch(/saladfactorythailand/i)
  })

  it('does not let the new images change search, filter, preset or random-meal membership', () => {
    const stripped: RestaurantMenuItem[] = restaurantMenuItems.map(item => slice38Ids.includes(item.id) ? { ...item, menuImage: undefined } : item)
    const ids = (items: RestaurantMenuItem[]) => items.map(item => item.id)
    for (const query of ['salad', 'chicken', 'ไก่', 'steak', 'noodle']) {
      expect(ids(searchRestaurantMenuItems(restaurantMenuItems, restaurants, query)), query).toEqual(ids(searchRestaurantMenuItems(stripped, restaurants, query)))
    }
    for (const filters of Object.values(explorePresetFilters)) {
      expect(ids(filterRestaurantMenuItems(restaurantMenuItems, filters))).toEqual(ids(filterRestaurantMenuItems(stripped, filters)))
    }
    expect(ids(getEligibleRandomMealItems(restaurantMenuItems, restaurants))).toEqual(ids(getEligibleRandomMealItems(stripped, restaurants)))
    expect(ids(imageFirstMenuItems(restaurantMenuItems)).sort()).toEqual(ids(restaurantMenuItems).sort())
    expect(ids(restaurantMenuItems)).toEqual(ids(stripped))
  })

  it('renders nothing (no broken image) when a new remote or local image fails to load', () => {
    for (const id of ['salad-factory-grilled-chicken-sesame', 'thongsmith-wagyu-ribeye-boat-noodle']) {
      const container = document.createElement('div')
      document.body.append(container)
      const root = createRoot(container)
      act(() => root.render(<MenuItemImage image={find(id).menuImage} locale="en" variant="card" />))
      const img = container.querySelector('img')
      expect(img?.getAttribute('src'), id).toBe(find(id).menuImage!.src)
      act(() => { img!.dispatchEvent(new Event('error')) })
      expect(container.querySelector('img'), id).toBeNull()
      expect(container.querySelector('figure'), id).toBeNull()
      act(() => root.unmount())
      container.remove()
    }
  })
})
