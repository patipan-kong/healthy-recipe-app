// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { pantryStorageKey } from './pantry'

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

  it('opens Pantry, supports direct ingredient browse, and ranks multi-select matches', () => {
    clickPantry()
    expect(container.querySelector('.pantry-heading h2')?.textContent).toBe('วัตถุดิบที่มี')
    expect(container.querySelectorAll('.pantry-category').length).toBeGreaterThan(1)
    expect(pantryRow('แตงกวา').textContent).toContain('(')

    act(() => pantryRow('แตงกวา').querySelector<HTMLButtonElement>('.pantry-browse-button')?.click())
    expect(container.querySelector('.pantry-heading h2')?.textContent).toContain('แตงกวา')
    expect(container.querySelectorAll('.pantry-view > .recipe-grid .recipe-card').length).toBeGreaterThan(0)
    act(() => container.querySelector<HTMLButtonElement>('.pantry-back')?.click())

    select('แตงกวา')
    select('ข้าวกล้อง')
    select('อกไก่')
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(3)
    expect(container.querySelectorAll('.pantry-results .recipe-card')).toHaveLength(100)
    expect(container.querySelector('.pantry-results .match-indicator')?.textContent).toBe('ตรงกับ 3/3 วัตถุดิบที่เลือก')
    expect(container.querySelectorAll('.pantry-results .match-indicator')[1]?.textContent).toContain('2/3')
  })

  it('persists selections and favorites, keeps canonical results through locale changes, and clears', () => {
    clickPantry()
    select('แตงกวา')
    select('ข้าวกล้อง')
    select('อกไก่')
    expect(JSON.parse(window.localStorage.getItem(pantryStorageKey) ?? '[]')).toEqual(['cucumber', 'brown-rice', 'chicken-breast'])

    act(() => container.querySelector<HTMLButtonElement>('.pantry-results .heart')?.click())
    act(() => [...container.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === 'EN')?.click())
    expect(container.querySelector('.pantry-results .match-indicator')?.textContent).toBe('Matches 3/3 selected ingredients')
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(3)

    act(() => container.querySelector<HTMLButtonElement>('.icon-button')?.click())
    expect(container.querySelectorAll('.recipe-card')).toHaveLength(1)
    expect(container.querySelector('.recipe-card .heart')?.getAttribute('aria-pressed')).toBe('true')

    act(() => root.unmount())
    root = createRoot(container)
    act(() => root.render(<App />))
    clickPantry()
    expect(container.querySelectorAll('.pantry-row input:checked')).toHaveLength(3)
    expect(container.querySelector('.icon-button i')?.textContent).toBe('1')

    act(() => container.querySelector('.pantry-selection-summary .text-button')?.dispatchEvent(new MouseEvent('click', { bubbles: true })))
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
  })
})
