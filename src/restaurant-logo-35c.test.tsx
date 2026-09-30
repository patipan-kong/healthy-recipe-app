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
]
const FIRST_PARTY_HOSTS = ['ootoya.co.th', '7eleven.co.th', 'jonessalad.com', 'fuji.co.th', 'mkrestaurant.com', 'sukiya.co.th', 'nittayakaiyang.com', 'minorfood.com']

describe('Slice 35C restaurant logos: data', () => {
  it('gives logos to exactly the verified restaurants, with unique ids and first-party provenance', () => {
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
        expect(FIRST_PARTY_HOSTS.some(h => host === h || host.endsWith(`.${h}`)), `${id} ${host}`).toBe(true)
      }
    }
  })

  it('leaves the other restaurants without a logo so initials remain their identity', () => {
    for (const restaurant of restaurants.filter(r => !LOGO_IDS.includes(r.id))) {
      expect(restaurant.logo).toBeUndefined()
      expect(restaurantIdentityMark(restaurant, 'en').mark.length).toBeGreaterThan(0)
    }
  })

  it('does not change catalog counts or menu-image semantics', () => {
    expect(restaurants).toHaveLength(13)
    expect(restaurantMenuItems).toHaveLength(84)
    expect(restaurantMenuItems.filter(item => item.price).length).toBe(44)
    const images = restaurantMenuItems.filter(item => item.menuImage)
    expect(images).toHaveLength(22)
    expect(images.every(item => item.menuImage!.kind === 'official-remote')).toBe(true)
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
    act(() => root.render(<><RestaurantIdentity restaurant={byId('ootoya-thailand')} locale="en" /><RestaurantIdentity restaurant={byId('zaab-eli-thailand')} locale="en" showLogo /></>))
    expect(container.querySelector('img')).toBeNull()
    expect([...container.querySelectorAll('[data-restaurant-identity]')].map(node => node.textContent)).toEqual(['OO', 'ZE'])
  })

  it('falls back to initials with no broken image when the logo fails', () => {
    act(() => root.render(<RestaurantIdentity restaurant={byId('sukiya-thailand')} locale="en" showLogo />))
    act(() => { container.querySelector('img')!.dispatchEvent(new Event('error')) })
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('[data-identity-source="pilot"]')!.textContent).toBe('SK')
  })

  it('shows all 13 rows with visible names, mixed logos and initials, and navigation still works', () => {
    act(() => root.render(<App />))
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
    const rows = [...container.querySelectorAll<HTMLElement>('.restaurant-row')]
    expect(rows).toHaveLength(13)
    expect(container.querySelectorAll('.restaurant-row img')).toHaveLength(8)
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
