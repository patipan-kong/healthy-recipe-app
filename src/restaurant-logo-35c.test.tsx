// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { RestaurantIdentity, restaurantIdentityMark } from './restaurant-identity'
import { restaurantMenuItems, restaurants } from './restaurants'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const LOGO_IDS = [
  'ootoya-thailand',
  'seven-eleven-thailand',
  'jones-salad-thailand',
  'fuji-japanese-restaurant-thailand',
  'mk-restaurants-thailand',
  'sukiya-thailand',
  'nittaya-kai-yang-thailand',
  'steak-and-more-thailand',
  // Slice 37B: LINE Official Account / operator / brand link hub logos.
  'salad-factory-thailand',
  'santa-fe-steak-thailand',
  'zaab-eli-thailand',
  'somtam-nua-thailand',
  'thongsmith-boat-noodle-thailand',
]
const FIRST_PARTY_HOSTS = ['ootoya.co.th', '7eleven.co.th', 'jonessalad.com', 'fuji.co.th', 'mkrestaurant.com', 'sukiya.co.th', 'nittayakaiyang.com', 'minorfood.com']
// Slice 37B Tier A operator and Tier B brand-controlled channels, per docs/restaurant-asset-coverage-audit-37a.md.
const BRAND_CONTROLLED_HOSTS = ['crg.co.th', 'profile.line-scdn.net', 'page.line.me', 'ugc.production.linktr.ee', 'linktr.ee']
const ORIGINAL_ORDER = ['ootoya-thailand', 'salad-factory-thailand', 'seven-eleven-thailand', 'jones-salad-thailand', 'fuji-japanese-restaurant-thailand', 'mk-restaurants-thailand', 'sukiya-thailand', 'santa-fe-steak-thailand', 'nittaya-kai-yang-thailand', 'zaab-eli-thailand', 'somtam-nua-thailand', 'thongsmith-boat-noodle-thailand', 'steak-and-more-thailand']
const NEW_37B_LOGOS: Record<string, { src: string; sourceUrl: string }> = {
  'salad-factory-thailand': { src: 'https://profile.line-scdn.net/0hz4jveXzBJRtXDzk5qrpaTGtKK3YgISNTLzw4fycIcywqOmMYO2pqKXBdLCoqaDVFbWFsKSFYfC8p/preview', sourceUrl: 'https://page.line.me/pac6513g' },
  'santa-fe-steak-thailand': { src: 'https://profile.line-scdn.net/0hsv5twe1dLFkIDTBwDf5TDjRIIjR_IyoRcDlkayhadmwtaTwJMDxmNi5eemBwaG4OMWpraisLdjwk/preview', sourceUrl: 'https://page.line.me/santafesteak' },
  'zaab-eli-thailand': { src: 'https://profile.line-scdn.net/0hLoXsNM-aE0BlCg8MHNdsF1lPHS0SJBUIHTkIIUUIRHBMalNFWDlUcRUPT3QaaVAQDD8IJRcOSiQb/preview', sourceUrl: 'https://page.line.me/ntw0665w' },
  'somtam-nua-thailand': { src: 'https://crg.co.th/catalogue-assets/images/brand/brand-19-1-logo-1687057873.png', sourceUrl: 'https://crg.co.th/brand-details/19/SomtamNua' },
  'thongsmith-boat-noodle-thailand': { src: 'https://ugc.production.linktr.ee/xUhS40tTQxmfd8LZ6Lff_c2ASFv2sCRhR666E', sourceUrl: 'https://linktr.ee/thongsmith' },
}

describe('Slice 35C restaurant logos: data', () => {
  it('gives logos to exactly the verified restaurants, with unique ids and documented brand-controlled provenance', () => {
    const withLogo = restaurants.filter(restaurant => restaurant.logo)
    expect(withLogo.map(restaurant => restaurant.id).sort()).toEqual([...LOGO_IDS].sort())
    expect(new Set(restaurants.map(restaurant => restaurant.id)).size).toBe(restaurants.length)
    for (const { id, logo } of withLogo) {
      expect(logo!.kind, id).toBe('official-remote')
      expect(logo!.asOf, id).toBe('2026-09-30')
      expect(logo!.alt.th.trim() && logo!.alt.en.trim(), id).toBeTruthy()
      expect(logo!.sourceLabel.th.trim() && logo!.sourceLabel.en.trim(), id).toBeTruthy()
      for (const url of [logo!.src, logo!.sourceUrl]) {
        const host = new URL(url).hostname
        expect(url.startsWith('https://'), id).toBe(true)
        const allowed = [...FIRST_PARTY_HOSTS, ...BRAND_CONTROLLED_HOSTS]
        expect(allowed.some(h => host === h || host.endsWith(`.${h}`)), `${id} ${host}`).toBe(true)
      }
    }
  })

  it('Slice 37B: the five new logos match the audited URLs exactly (source of truth: 37A audit)', () => {
    for (const [id, expected] of Object.entries(NEW_37B_LOGOS)) {
      const logo = restaurants.find(r => r.id === id)!.logo!
      expect(logo.src, id).toBe(expected.src)
      expect(logo.sourceUrl, id).toBe(expected.sourceUrl)
    }
  })

  it('every restaurant now has a logo, and initials remain available as the runtime fallback', () => {
    expect(restaurants.filter(r => !r.logo)).toHaveLength(0)
    for (const restaurant of restaurants) expect(restaurantIdentityMark(restaurant, 'en').mark.length).toBeGreaterThan(0)
  })

  it('keeps the restaurant source order unchanged', () => {
    expect(restaurants.map(r => r.id)).toEqual(ORIGINAL_ORDER)
  })

  it('does not change catalog counts or menu-image semantics', () => {
    expect(restaurants).toHaveLength(13)
    expect(restaurantMenuItems).toHaveLength(84)
    expect(restaurantMenuItems.filter(item => item.price).length).toBe(44)
    const images = restaurantMenuItems.filter(item => item.menuImage)
    expect(images).toHaveLength(42) // 22 before Slice 38
    expect(images.every(item => item.menuImage!.kind === 'official-remote' || (item.menuImage!.kind === 'bundled' && item.menuImage!.cropOf))).toBe(true)
  })
})

describe('Slice 35C restaurant logos: rendering', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    window.localStorage.clear()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  const byId = (id: string) => restaurants.find(restaurant => restaurant.id === id)!

  it('renders the logo (not initials) when showLogo is set, with localized alt', () => {
    act(() => root.render(<RestaurantIdentity restaurant={byId('ootoya-thailand')} locale="en" showLogo />))
    const img = container.querySelector('img')!
    expect(img.getAttribute('src')).toBe(byId('ootoya-thailand').logo!.src)
    expect(img.getAttribute('alt')).toBe('Ootoya logo')
    expect(container.querySelector('[data-identity-source="logo"]')).not.toBeNull()
    expect(container.textContent).toBe('')
    act(() => root.render(<RestaurantIdentity restaurant={byId('ootoya-thailand')} locale="th" showLogo />))
    expect(container.querySelector('img')!.getAttribute('alt')).toBe('โลโก้โอโตยะ')
  })

  it('keeps initials when showLogo is not requested or no logo exists', () => {
    const withoutLogo = { ...byId('zaab-eli-thailand'), logo: undefined }
    act(() => root.render(<><RestaurantIdentity restaurant={byId('ootoya-thailand')} locale="en" /><RestaurantIdentity restaurant={withoutLogo} locale="en" showLogo /></>))
    expect(container.querySelector('img')).toBeNull()
    expect([...container.querySelectorAll('[data-restaurant-identity]')].map(node => node.textContent)).toEqual(['OO', 'ZE'])
  })

  it('falls back to initials with no broken image when the logo fails', () => {
    act(() => root.render(<RestaurantIdentity restaurant={byId('sukiya-thailand')} locale="en" showLogo />))
    act(() => { container.querySelector('img')!.dispatchEvent(new Event('error')) })
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('[data-identity-source="pilot"]')!.textContent).toBe('SK')
  })

  it('Slice 37B: a new logo that fails at runtime falls back to initials with no broken image', () => {
    act(() => root.render(<RestaurantIdentity restaurant={byId('thongsmith-boat-noodle-thailand')} locale="en" showLogo />))
    expect(container.querySelector('img')).not.toBeNull()
    act(() => { container.querySelector('img')!.dispatchEvent(new Event('error')) })
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('[data-restaurant-identity]')!.textContent!.length).toBeGreaterThan(0)
  })

  function openRestaurant(id: string) {
    act(() => root.render(<App />))
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
    const card = container.querySelector(`[data-restaurant-identity="${id}"]`)!.closest<HTMLElement>('.restaurant-row')!
    act(() => card.click())
    return container.querySelector<HTMLElement>('.restaurant-brand-header')!
  }

  it('Slice 37B.1: Restaurant Detail header shows the selected restaurant logo beside name and cuisine', () => {
    for (const id of ['ootoya-thailand', 'santa-fe-steak-thailand', 'somtam-nua-thailand', 'thongsmith-boat-noodle-thailand']) {
      const restaurant = byId(id)
      const header = openRestaurant(id)
      const identity = header.querySelector('[data-restaurant-identity]')!
      expect(identity.getAttribute('data-restaurant-identity'), id).toBe(id)
      expect(identity.getAttribute('data-identity-source'), id).toBe('logo')
      expect(identity.classList.contains('restaurant-identity-lg'), id).toBe(true)
      expect(header.querySelector('img')!.getAttribute('src'), id).toBe(restaurant.logo!.src)
      expect(header.querySelector('h2')!.textContent, id).toBe(restaurant.name.th)
      expect(header.querySelector('.eyebrow')!.textContent, id).toBe(restaurant.cuisine!.th)
      // identity comes first, no source/provenance text in the header
      expect(header.firstElementChild).toBe(identity)
      expect(header.textContent).not.toContain('LINE')
      act(() => root.render(null))
    }
  })

  it('Slice 37B.1: header logo failure falls back to initials with no broken image; menu cards are unchanged', () => {
    const header = openRestaurant('somtam-nua-thailand')
    const cardsBefore = container.querySelectorAll('.restaurant-menu-view .menu-item-row').length
    expect(cardsBefore).toBe(restaurantMenuItems.filter(i => i.restaurantId === 'somtam-nua-thailand').length)
    act(() => { header.querySelector('img')!.dispatchEvent(new Event('error')) })
    expect(header.querySelector('img')).toBeNull()
    const identity = header.querySelector('[data-restaurant-identity]')!
    expect(identity.textContent!.length).toBeGreaterThan(0)
    expect(identity.classList.contains('restaurant-identity-lg')).toBe(true)
    expect(header.querySelector('h2')!.textContent).toBe('ส้มตำนัว')
    expect(container.querySelectorAll('.restaurant-menu-view .menu-item-row')).toHaveLength(cardsBefore)
  })

  it('shows all 13 rows with a logo each, and navigation still works', () => {
    act(() => root.render(<App />))
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
    const rows = [...container.querySelectorAll<HTMLElement>('.restaurant-row')]
    expect(rows).toHaveLength(13)
    expect(container.querySelectorAll('.restaurant-row img')).toHaveLength(13)
    for (const restaurant of restaurants) {
      // Slice 36 presents logo-bearing restaurants first, so match rows by identity, not position.
      const row = rows.find(candidate => candidate.querySelector(`[data-restaurant-identity="${restaurant.id}"]`))!
      expect(row).toBeDefined()
      expect(row.textContent).toContain(restaurant.name.th)
      const hasLogo = LOGO_IDS.includes(restaurant.id)
      expect(!!row.querySelector('img')).toBe(hasLogo)
      // initials and logo are never shown together
      expect(row.querySelectorAll('[data-restaurant-identity]')).toHaveLength(1)
      if (hasLogo) expect(row.querySelector('[data-restaurant-identity]')!.textContent).toBe('')
    }
    act(() => rows[0].click())
    expect(container.querySelector('.restaurant-row')).toBeNull()
    expect(container.textContent).toContain('โอโตยะ')
  })
})
