// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { countRecipesByIngredient, filterRecipesByIngredient, pantryStorageKey } from './pantry'
import { recipes } from './recipes'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Pantry application flow', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    window.localStorage.clear()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<App />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function pantryRow(name: string) {
    const row = [...container.querySelectorAll<HTMLElement>('.pantry-row')].find(candidate => candidate.textContent?.includes(name))
    if (!row) throw new Error(`Missing pantry row: ${name}`)
    return row
  }

  function clickPantry() {
    act(() => container.querySelector<HTMLButtonElement>('.pantry-nav')?.click())
  }

  function select(name: string) {
    act(() => pantryRow(name).querySelector<HTMLInputElement>('input')?.click())
  }

  function button(text: string) {
    const found = [...container.querySelectorAll<HTMLButtonElement>('button')].find(candidate => candidate.textContent === text)
    if (!found) throw new Error(`Missing button: ${text}`)
    return found
  }

  function setInputValue(input: HTMLInputElement, value: string) {
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
      setter?.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  it('opens in Ingredient Selection, keeps search optional, and gates results until selection', () => {
    clickPantry()

    expect(container.querySelector('.pantry-selection')).not.toBeNull()
    expect(container.querySelector('.pantry-results')).toBeNull()
    expect(container.querySelectorAll('.pantry-category').length).toBeGreaterThan(1)
    expect(container.querySelectorAll('.pantry-mode-tabs button.active')[0]?.textContent).toBe('เลือกวัตถุดิบ')
    expect(container.querySelector('.pantry-zero-state')?.textContent).toContain('เลือกวัตถุดิบอย่างน้อย 1 รายการ')
    expect(container.querySelectorAll<HTMLButtonElement>('.pantry-mode-tabs button')[1]?.disabled).toBe(true)
    expect(container.querySelector<HTMLButtonElement>('.pantry-view-action')?.disabled).toBe(true)
    expect(container.querySelector<HTMLButtonElement>('.pantry-view-action')?.textContent).toBe('ดูเมนูที่ทำได้ (0)')

    select('แตงกวา')
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(1)
    expect(container.querySelector('.pantry-results')).toBeNull()
    expect(container.querySelector<HTMLButtonElement>('.pantry-view-action')?.disabled).toBe(false)
    expect(container.querySelector<HTMLButtonElement>('.pantry-view-action')?.textContent).toBe('ดูเมนูที่ทำได้ (1)')
  })

  it('separates ranked recipe results and preserves deterministic 3/3 before 2/3 ordering', () => {
    clickPantry()
    select('แตงกวา')
    select('ข้าวกล้อง')
    select('อกไก่')
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(3)
    expect(container.querySelector('.pantry-results')).toBeNull()

    act(() => container.querySelector<HTMLButtonElement>('.pantry-view-action')?.click())

    expect(container.querySelector('.pantry-selection')).toBeNull()
    expect(container.querySelector('.pantry-results')).not.toBeNull()
    expect(container.querySelectorAll('.pantry-category')).toHaveLength(0)
    expect(container.querySelector('.pantry-result-count')?.textContent).toBe('100 เมนูที่ตรงกัน')
    expect(container.querySelector('.pantry-selected-names')?.textContent).toContain('แตงกวา')
    expect(container.querySelectorAll('.pantry-results .recipe-card')).toHaveLength(100)
    expect(container.querySelector('.pantry-results .match-indicator')?.textContent).toBe('ตรงกับ 3/3 วัตถุดิบที่เลือก')
    expect(container.querySelectorAll('.pantry-results .match-indicator')[1]?.textContent).toContain('2/3')
    expect(container.querySelectorAll('.pantry-mode-tabs button.active')[0]?.textContent).toBe('เมนูที่ทำได้')
    expect(button('แก้ไขวัตถุดิบ')).toBeTruthy()

    act(() => button('แก้ไขวัตถุดิบ').click())
    expect(container.querySelector('.pantry-selection')).not.toBeNull()
    expect(container.querySelector('.pantry-results')).toBeNull()
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(3)
  })

  it('strictly filters direct browse, preserves checkbox state, and replaces the direct constraint', () => {
    clickPantry()
    const cucumberCount = countRecipesByIngredient(recipes).cucumber
    const cucumberRecipes = filterRecipesByIngredient(recipes, 'cucumber')
    expect(cucumberCount).toBe(24)
    expect(cucumberRecipes).toHaveLength(cucumberCount)
    expect(cucumberCount).toBeLessThan(recipes.length)
    expect(cucumberRecipes.every(recipe => recipe.ingredients.some(ingredient => ingredient.ingredientId === 'cucumber'))).toBe(true)

    select('ไข่')
    select('อกไก่')
    const search = container.querySelector<HTMLInputElement>('.pantry-search input')!
    setInputValue(search, 'แตงกวา')
    expect(pantryRow('แตงกวา').querySelector<HTMLButtonElement>('.pantry-browse-button')?.textContent).toContain(`(${cucumberCount})`)
    expect([...container.querySelectorAll('.pantry-row')].some(row => row.textContent?.includes('อกไก่'))).toBe(false)
    setInputValue(search, '')
    expect(pantryRow('อกไก่').querySelector<HTMLInputElement>('input')?.checked).toBe(true)

    act(() => pantryRow('แตงกวา').querySelector<HTMLButtonElement>('.pantry-browse-button')?.click())
    expect(container.querySelector('.pantry-results')).not.toBeNull()
    expect(container.querySelector('#pantry-mode-heading')?.textContent).toBe('เมนูที่ใช้ แตงกวา')
    expect(container.querySelector('.pantry-result-count')?.textContent).toBe(`${cucumberCount} เมนู`)
    expect(container.querySelector('.pantry-result-summary')?.textContent).toContain('แตงกวา')
    const cucumberCards = [...container.querySelectorAll<HTMLElement>('.pantry-results .recipe-card h3')].map(card => card.textContent)
    expect(cucumberCards).toEqual(cucumberRecipes.map(recipe => recipe.name.th))
    expect(container.querySelectorAll('.pantry-results .match-indicator')).toHaveLength(0)

    act(() => button('แก้ไขวัตถุดิบ').click())
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(2)
    act(() => container.querySelector<HTMLButtonElement>('.pantry-view-action')?.click())
    expect(container.querySelectorAll('.pantry-results .recipe-card')).toHaveLength(recipes.length)
    expect(container.querySelector('.pantry-results .match-indicator')).not.toBeNull()
    act(() => button('แก้ไขวัตถุดิบ').click())
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(2)

    const tomatoRecipes = filterRecipesByIngredient(recipes, 'tomatoes')
    act(() => pantryRow('มะเขือเทศ').querySelector<HTMLButtonElement>('.pantry-browse-button')?.click())
    expect(container.querySelector('#pantry-mode-heading')?.textContent).toBe('เมนูที่ใช้ มะเขือเทศ')
    expect(container.querySelector('.pantry-result-count')?.textContent).toBe(`${tomatoRecipes.length} เมนู`)
    expect([...container.querySelectorAll<HTMLElement>('.pantry-results .recipe-card h3')].map(card => card.textContent)).toEqual(tomatoRecipes.map(recipe => recipe.name.th))
    expect(container.querySelectorAll('.pantry-results .recipe-card')).toHaveLength(tomatoRecipes.length)
    expect(container.querySelectorAll('.pantry-results .match-indicator')).toHaveLength(0)
    expect(container.querySelectorAll('.pantry-results .heart')).toHaveLength(tomatoRecipes.length)
    act(() => button('เมนูที่ทำได้').click())
    expect(container.querySelectorAll('.pantry-results .recipe-card')).toHaveLength(tomatoRecipes.length)

    act(() => button('แก้ไขวัตถุดิบ').click())
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(2)

    act(() => button('EN').click())
    act(() => pantryRow('Tomatoes').querySelector<HTMLButtonElement>('.pantry-browse-button')?.click())
    expect(container.querySelector('#pantry-mode-heading')?.textContent).toBe('Recipes with Tomatoes')
    expect(container.querySelector('.pantry-result-count')?.textContent).toBe(`${tomatoRecipes.length} recipes`)
    expect([...container.querySelectorAll<HTMLElement>('.pantry-results .recipe-card h3')].map(card => card.textContent)).toEqual(tomatoRecipes.map(recipe => recipe.name.en))
    expect(container.querySelectorAll('.pantry-results .recipe-card')).toHaveLength(tomatoRecipes.length)

    act(() => container.querySelector<HTMLButtonElement>('.pantry-results .heart')?.click())
    expect(container.querySelector('.pantry-results .heart')?.getAttribute('aria-pressed')).toBe('true')
  })

  it('preserves selection, ranking, and favorites across locale changes and remounts, then clears from Results', () => {
    clickPantry()
    select('แตงกวา')
    select('ข้าวกล้อง')
    select('อกไก่')
    expect(JSON.parse(window.localStorage.getItem(pantryStorageKey) ?? '[]')).toEqual(['cucumber', 'brown-rice', 'chicken-breast'])
    act(() => container.querySelector<HTMLButtonElement>('.pantry-view-action')?.click())

    act(() => container.querySelector('.pantry-results .heart')?.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    act(() => button('EN').click())
    expect(container.querySelector('.pantry-results')).not.toBeNull()
    expect(container.querySelector('.pantry-results .match-indicator')?.textContent).toBe('Matches 3/3 selected ingredients')
    expect(container.querySelector('.pantry-selected-names')?.textContent).toContain('Cucumber')
    expect(container.querySelectorAll('.pantry-results .recipe-card .heart[aria-pressed="true"]')).toHaveLength(1)

    act(() => container.querySelector<HTMLButtonElement>('.icon-button')?.click())
    expect(container.querySelectorAll('.recipe-card')).toHaveLength(1)
    expect(container.querySelector('.recipe-card .heart')?.getAttribute('aria-pressed')).toBe('true')

    act(() => root.unmount())
    root = createRoot(container)
    act(() => root.render(<App />))
    clickPantry()
    expect(container.querySelector('.pantry-selection')).not.toBeNull()
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(3)

    act(() => container.querySelector<HTMLButtonElement>('.pantry-view-action')?.click())
    expect(container.querySelector('.pantry-results')).not.toBeNull()
    act(() => button('Clear').click())
    expect(container.querySelector('.pantry-selection')).not.toBeNull()
    expect(container.querySelector('.pantry-results')).toBeNull()
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(0)
    expect(JSON.parse(window.localStorage.getItem(pantryStorageKey) ?? '[]')).toEqual([])
  })

  it('ignores invalid stored pantry IDs safely', () => {
    window.localStorage.setItem(pantryStorageKey, JSON.stringify(['cucumber', 'stale-id']))
    act(() => root.unmount())
    root = createRoot(container)
    act(() => root.render(<App />))
    clickPantry()
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(1)
    expect(pantryRow('แตงกวา').querySelector<HTMLInputElement>('input')?.checked).toBe(true)
    expect(container.querySelector('.pantry-results')).toBeNull()
  })
})
