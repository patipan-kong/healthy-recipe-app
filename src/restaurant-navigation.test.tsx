// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { imageFirstMenuItems, logoFirstRestaurants } from './menu-presentation'
import { restaurantMenuItems, restaurants } from './restaurants'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let container: HTMLDivElement
let root: Root
beforeEach(() => {
  localStorage.clear()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(<App />))
})
afterEach(() => { act(() => root.unmount()); container.remove() })
const q = <T extends Element = HTMLElement>(selector: string) => container.querySelector<T>(selector)!
const click = (selector: string) => { expect(q(selector)).toBeTruthy(); act(() => q<HTMLButtonElement>(selector).click()) }
const openOotoya = () => click('.restaurant-card:has([data-restaurant-identity="ootoya-thailand"])')
const gridIds = () => [...container.querySelectorAll('.restaurant-grid [data-restaurant-identity]')].map(node => node.getAttribute('data-restaurant-identity'))

describe('Restaurant detail return navigation', () => {
  it.each([['th', 'ร้านอาหารทั้งหมด'], ['en', 'All restaurants']])('uses concise %s copy on a focusable semantic button with a decorative arrow', (locale, label) => {
    if (locale === 'en') act(() => [...container.querySelectorAll<HTMLButtonElement>('.language-switcher button')].find(button => button.textContent === 'EN')!.click())
    click('.restaurant-nav'); openOotoya()
    const back = q<HTMLButtonElement>('.restaurant-back')
    expect(back.tagName).toBe('BUTTON')
    expect(back.type).toBe('button')
    expect(back.textContent).toBe(label)
    expect(back.tabIndex).toBe(0)
    back.focus(); expect(document.activeElement).toBe(back)
    expect(back.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(q('.restaurant-menu-view').textContent).not.toContain('กลับไปที่ร้านอาหาร')
    expect(q('.restaurant-brand-header h2').textContent).toBe(restaurants.find(item => item.id === 'ootoya-thailand')!.name[locale as 'th' | 'en'])
    expect(q('.restaurant-brand-header [data-restaurant-identity]')).toBeTruthy()
    expect(q('.restaurant-menu-nav .filter-button').getAttribute('aria-label')).toBeTruthy()
    click('.restaurant-back')
    expect(gridIds()).toEqual(logoFirstRestaurants(restaurants).map(item => item.id))
    expect(container.querySelector('.restaurant-menu-view')).toBeNull()
  })

  it('retains existing list remount behavior, menu membership and app-level favorites', () => {
    click('.restaurant-nav')
    click('.restaurant-pick-trigger')
    expect(q('.restaurant-pick-card')).toBeTruthy()
    openOotoya()
    const expected = imageFirstMenuItems(restaurantMenuItems.filter(item => item.restaurantId === 'ootoya-thailand')).map(item => item.id)
    expect([...container.querySelectorAll<HTMLElement>('.menu-grid-card')].map(node => node.dataset.menuItemId)).toEqual(expected)
    click('.menu-grid-card .menu-favorite-toggle')
    click('.restaurant-menu-nav .filter-button')
    expect(q('.menu-filter-panel')).toBeTruthy()
    click('.restaurant-back')
    expect(container.querySelector('.restaurant-pick-card')).toBeNull()
    expect(gridIds()).toEqual(logoFirstRestaurants(restaurants).map(item => item.id))
    openOotoya()
    expect(container.querySelector('.menu-filter-panel')).toBeNull()
    expect(q('.menu-grid-card .menu-favorite-toggle').getAttribute('aria-pressed')).toBe('true')
  })

  it('intentionally returns to the restaurant grid after Explore entry', () => {
    click('.explore-nav')
    click('.menu-grid-open')
    click('.menu-detail-restaurant')
    expect(q('.restaurant-menu-view')).toBeTruthy()
    click('.restaurant-back')
    expect(gridIds()).toEqual(logoFirstRestaurants(restaurants).map(item => item.id))
    expect(container.querySelector('.explore-view')).toBeNull()
  })
})
