// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { pantryStorageKey } from './pantry'
import { shoppingPurchasedStorageKey, shoppingStorageKey } from './shopping'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Shopping application flow', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem(pantryStorageKey, JSON.stringify(['mushrooms']))
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<App />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function openRecipe(name: string) {
    const card = [...container.querySelectorAll<HTMLElement>('.recipe-card')].find(candidate => candidate.querySelector('h3')?.textContent === name)
    if (!card) throw new Error(`Missing recipe card: ${name}`)
    act(() => card.querySelector<HTMLButtonElement>('.food-art')?.click())
  }

  function clickBack() {
    act(() => container.querySelector<HTMLButtonElement>('.detail-nav .round-button')?.click())
  }

  function clickShopping() {
    act(() => container.querySelector<HTMLButtonElement>('.shopping-nav')?.click())
  }

  it('adds from detail, keeps Favorite separate, and reflects the Added state globally', () => {
    openRecipe('ต้มยำกุ้งน้ำใส')
    act(() => container.querySelector<HTMLButtonElement>('.shopping-action')?.click())
    expect(container.querySelector('.shopping-action')?.textContent).toBe('อยู่ในรายการซื้อแล้ว')
    expect(container.querySelector('.shopping-action')?.getAttribute('aria-pressed')).toBe('true')

    act(() => container.querySelector<HTMLButtonElement>('.detail-nav .round-button:nth-child(2)')?.click())
    expect(JSON.parse(window.localStorage.getItem('healthy-recipe-favorites-v1') ?? '[]')).toEqual(['tom-yum-prawns'])

    clickBack()
    clickShopping()
    expect(container.querySelectorAll('.shopping-recipe')).toHaveLength(1)
    expect(container.querySelector('.shopping-recipe-name')?.textContent).toBe('ต้มยำกุ้งน้ำใส')
    expect(container.querySelector('.shopping-line')).not.toBeNull()
  })

  it('keeps the Added state when the same detail is opened from Shopping, Favorites, and Pantry', () => {
    openRecipe('ต้มยำกุ้งน้ำใส')
    act(() => container.querySelector<HTMLButtonElement>('.shopping-action')?.click())
    act(() => container.querySelector<HTMLButtonElement>('.detail-nav .round-button:nth-child(2)')?.click())
    clickBack()

    clickShopping()
    act(() => container.querySelector<HTMLButtonElement>('.shopping-recipe-name')?.click())
    expect(container.querySelector('.shopping-action')?.textContent).toBe('อยู่ในรายการซื้อแล้ว')
    clickBack()

    act(() => container.querySelector<HTMLButtonElement>('.icon-button')?.click())
    openRecipe('ต้มยำกุ้งน้ำใส')
    expect(container.querySelector('.shopping-action')?.textContent).toBe('อยู่ในรายการซื้อแล้ว')
    clickBack()

    act(() => container.querySelector<HTMLButtonElement>('.pantry-nav')?.click())
    act(() => container.querySelector<HTMLButtonElement>('.pantry-view-action')?.click())
    openRecipe('ต้มยำกุ้งน้ำใส')
    expect(container.querySelector('.shopping-action')?.textContent).toBe('อยู่ในรายการซื้อแล้ว')
  })

  it('aggregates shared ingredients, marks Pantry items, persists purchased state across locale and remount, removes, and clears', () => {
    openRecipe('ต้มยำกุ้งน้ำใส')
    act(() => container.querySelector<HTMLButtonElement>('.shopping-action')?.click())
    clickBack()
    openRecipe('ต้มยำไก่ใส่เห็ดน้ำใส')
    act(() => container.querySelector<HTMLButtonElement>('.shopping-action')?.click())
    clickBack()
    clickShopping()

    expect(container.querySelectorAll('.shopping-recipe')).toHaveLength(2)
    const mushrooms = container.querySelector<HTMLElement>('[data-shopping-line-id="canonical:mushrooms::g"]')
    expect(mushrooms?.textContent).toContain('เห็ด')
    expect(mushrooms?.textContent).toContain('330 กรัม')
    expect(mushrooms?.textContent).toContain('มีแล้ว')
    expect(container.querySelectorAll('.shopping-line').length).toBeGreaterThan(1)

    const mushroomsCheckbox = container.querySelector<HTMLInputElement>('[data-shopping-line-checkbox="canonical:mushrooms::g"]')!
    act(() => mushroomsCheckbox.click())
    expect(mushroomsCheckbox.checked).toBe(true)

    act(() => [...container.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === 'EN')?.click())
    expect(container.querySelector('.shopping-recipe-name')?.textContent).toBe('Clear Tom Yum Prawns')
    expect(container.querySelector('[data-shopping-line-id="canonical:mushrooms::g"]')?.textContent).toContain('330 g')
    expect(container.querySelector<HTMLInputElement>('[data-shopping-line-checkbox="canonical:mushrooms::g"]')?.checked).toBe(true)
    expect(container.querySelector('[data-shopping-line-id="canonical:mushrooms::g"]')?.textContent).toContain('Already have')

    act(() => [...container.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === 'TH')?.click())
    const secondRecipe = [...container.querySelectorAll<HTMLElement>('.shopping-recipe')].find(row => row.textContent?.includes('ต้มยำไก่ใส่เห็ดน้ำใส'))
    act(() => secondRecipe?.querySelector<HTMLButtonElement>('.shopping-remove')?.click())
    expect(container.querySelectorAll('.shopping-recipe')).toHaveLength(1)
    expect(container.querySelector('[data-shopping-line-id="canonical:mushrooms::g"]')?.textContent).toContain('150 กรัม')
    expect(container.querySelector<HTMLInputElement>('[data-shopping-line-checkbox="canonical:mushrooms::g"]')?.checked).toBe(true)

    act(() => root.unmount())
    root = createRoot(container)
    act(() => root.render(<App />))
    clickShopping()
    expect(container.querySelectorAll('.shopping-recipe')).toHaveLength(1)
    expect(container.querySelector<HTMLInputElement>('[data-shopping-line-checkbox="canonical:mushrooms::g"]')?.checked).toBe(true)

    act(() => container.querySelector<HTMLButtonElement>('.shopping-clear')?.click())
    expect(container.querySelector('.shopping-empty')).not.toBeNull()
    expect(container.querySelectorAll('.shopping-section')).toHaveLength(0)
    expect(JSON.parse(window.localStorage.getItem(shoppingStorageKey) ?? '[]')).toEqual([])
    expect(JSON.parse(window.localStorage.getItem(shoppingPurchasedStorageKey) ?? '[]')).toEqual([])
  })

  it('ignores stale shopping recipe IDs and shows the localized empty state', () => {
    window.localStorage.setItem(shoppingStorageKey, JSON.stringify(['stale-id']))
    window.localStorage.setItem(shoppingPurchasedStorageKey, JSON.stringify(['canonical:stale::g']))
    act(() => root.unmount())
    root = createRoot(container)
    act(() => root.render(<App />))
    clickShopping()

    expect(container.querySelector('.shopping-empty')?.textContent).toContain('ยังไม่มีเมนูในรายการซื้อ')
    expect(container.querySelectorAll('.shopping-line')).toHaveLength(0)
    act(() => [...container.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === 'EN')?.click())
    expect(container.querySelector('.shopping-empty')?.textContent).toContain('No recipes in your shopping list')
  })
})
