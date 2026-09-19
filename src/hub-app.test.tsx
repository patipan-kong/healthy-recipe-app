// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { recipes } from './recipes'
import { restaurants, restaurantMenuItems } from './restaurants'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Meal Decision Hub', () => {
  let container: HTMLDivElement
  let root: Root
  function click(selector: string) {
    const button = container.querySelector<HTMLButtonElement>(selector)
    expect(button).not.toBeNull()
    act(() => button!.click())
  }
  function search(value: string) {
    const input = container.querySelector<HTMLInputElement>('.search input')!
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }
  function storageSnapshot() {
    return Object.fromEntries(Object.keys(localStorage).sort().map(key => [key, localStorage.getItem(key)]))
  }
  beforeEach(() => {
    localStorage.clear()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<App />))
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('renders one Thai decision heading and two named buttons before recipe discovery', () => {
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(container.querySelector('.meal-hub h1')?.textContent).toBe('วันนี้อยากกินอะไรดี?')
    expect(container.querySelector('.meal-hub p')?.textContent).toBe('ทำเองที่บ้าน หรือจะออกไปกินก็ได้')
    const buttons = [...container.querySelectorAll<HTMLButtonElement>('.meal-hub button')]
    expect(buttons.map(button => button.textContent)).toEqual(['ทำอาหารเอง', 'ซื้ออาหาร'])
    for (const button of buttons) {
      expect(button.type).toBe('button')
      expect(button.hasAttribute('tabindex')).toBe(false)
      expect(button.hasAttribute('aria-label')).toBe(false)
      expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
      expect(button.querySelector('svg title')).toBeNull()
    }
    expect(buttons[1].compareDocumentPosition(container.querySelector('.search input')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(container.querySelector('.meal-hub .random-button')).toBeNull()
    expect(container.querySelectorAll('.recipe-card')).toHaveLength(recipes.length)
  })

  it('uses English copy via the existing locale switch', () => {
    click('.language-switcher button:last-child')
    expect(container.querySelector('.meal-hub h1')?.textContent).toBe('What sounds good today?')
    expect(container.querySelector('.meal-hub p')?.textContent).toBe('Cook it yourself, or go grab it.')
    expect(container.querySelector('.meal-hub-cook')?.textContent).toBe('Cook at home')
    expect(container.querySelector('.meal-hub-buy')?.textContent).toBe('Buy food')
  })

  it('Cook focuses discovery and preserves the query, category, and current pick', () => {
    click('.chips button:nth-child(2)')
    search('egg')
    const titles = [...container.querySelectorAll('.recipe-card h3')].map(el => el.textContent)
    expect(titles.length).toBeGreaterThan(0)
    click('.meal-hub-cook')
    expect(document.activeElement).toBe(container.querySelector('.search input'))
    expect(container.querySelector<HTMLInputElement>('.search input')?.value).toBe('egg')
    expect(container.querySelector('.chips button:nth-child(2)')?.className).toBe('active')
    expect([...container.querySelectorAll('.recipe-card h3')].map(el => el.textContent)).toEqual(titles)
    expect(container.querySelector('.recipe-pick-card')).toBeNull()
    click('.recipe-discovery-random')
    const pick = container.querySelector('.recipe-pick-copy h3')?.textContent
    expect(titles).toContain(pick)
    click('.meal-hub-cook')
    expect(container.querySelector('.recipe-pick-copy h3')?.textContent).toBe(pick)
    expect(container.querySelector('#recipe-browse-grid')).toBeNull()
    click('.recipe-pick-again')
    expect(titles).toContain(container.querySelector('.recipe-pick-copy h3')?.textContent)
  })

  it('Buy opens exactly the existing Restaurants experience and returns to the same Browse state', () => {
    search('wakame')
    click('.meal-hub-buy')
    expect(container.querySelector('.meal-hub')).toBeNull()
    expect(container.querySelectorAll('.restaurant-row')).toHaveLength(restaurants.length)
    expect(container.querySelector('.restaurant-nav')?.getAttribute('aria-pressed')).toBe('true')
    const destination = container.querySelector('.restaurant-list')?.outerHTML
    expect(destination).toBeTruthy()
    click('.restaurant-nav')
    expect(container.querySelector<HTMLInputElement>('.search input')?.value).toBe('wakame')
    click('.restaurant-nav')
    expect(container.querySelector('.restaurant-list')?.outerHTML).toBe(destination)
    click('.logo')
    expect(container.querySelector('.meal-hub')).not.toBeNull()
    expect(container.querySelector<HTMLInputElement>('.search input')?.value).toBe('wakame')
    click('.recipe-discovery-random')
    expect(container.querySelector('.recipe-pick-card img')?.getAttribute('src')).toBe('/recipes/wakame-egg-soup.webp')
  })

  it.each([
    ['.pantry-nav', '.pantry-view'],
    ['.shopping-nav', '.shopping-view'],
    ['.explore-nav', '.explore-view'],
    ['.icon-button', '.favorites-section-heading'],
  ])('preserves %s navigation and return', (nav, destination) => {
    click(nav)
    expect(container.querySelector(destination)).not.toBeNull()
    expect(container.querySelector('.meal-hub')).toBeNull()
    click('.logo')
    expect(container.querySelector('.meal-hub')).not.toBeNull()
    expect(container.querySelectorAll('.recipe-card')).toHaveLength(recipes.length)
  })

  it('does not persist hub choices or leak a destination across remounts', () => {
    const before = storageSnapshot()
    click('.meal-hub-cook')
    click('.meal-hub-buy')
    expect(storageSnapshot()).toEqual(before)
    act(() => root.unmount())
    root = createRoot(container)
    act(() => root.render(<App />))
    expect(container.querySelector('.meal-hub')).not.toBeNull()
    expect(container.querySelector('.recipe-pick-card')).toBeNull()
    expect(storageSnapshot()).toEqual(before)
    expect([recipes.length, restaurants.length, restaurantMenuItems.length]).toEqual([208, 13, 84])
  })
})
