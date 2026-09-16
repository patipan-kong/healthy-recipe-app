// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { recipes, searchRecipes } from './recipes'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Recipe Surprise me + Pick Focus flow', () => {
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

  function heroTrigger() {
    return container.querySelector<HTMLButtonElement>('.recipe-discovery-random')
  }

  function clickSurpriseMe() {
    const button = heroTrigger()
    if (!button) throw new Error('Missing Surprise me trigger')
    act(() => button.click())
  }

  function clickPickAgain() {
    const button = container.querySelector<HTMLButtonElement>('.recipe-pick-again')
    if (!button) throw new Error('Missing Pick again trigger')
    act(() => button.click())
  }

  function pickCard() {
    return container.querySelector<HTMLElement>('.recipe-pick-card')
  }

  function pickedName() {
    return pickCard()?.querySelector('h3')?.textContent
  }

  function searchInput() {
    const input = container.querySelector<HTMLInputElement>('.search-row input')
    if (!input) throw new Error('Missing search input')
    return input
  }

  function typeSearch(value: string) {
    const input = searchInput()
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
    act(() => {
      setter.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  function clickCategoryChip(label: string) {
    const chip = [...container.querySelectorAll<HTMLButtonElement>('.chips button')].find(candidate => candidate.textContent === label)
    if (!chip) throw new Error(`Missing category chip: ${label}`)
    act(() => chip.click())
  }

  function clickFavoritesNav() {
    act(() => container.querySelector<HTMLButtonElement>('.icon-button')?.click())
  }

  function clickBack() {
    act(() => container.querySelector<HTMLButtonElement>('.detail-nav .round-button')?.click())
  }

  it('shows a recipe discovery Surprise me trigger that seeds an eligible pick', () => {
    expect(heroTrigger()).not.toBeNull()
    expect(heroTrigger()?.disabled).toBe(false)
    expect(pickCard()).toBeNull()
    clickSurpriseMe()
    const name = pickedName()
    expect(name).toBeTruthy()
    expect(recipes.some(recipe => recipe.name.th === name)).toBe(true)
  })

  it('shows exactly one focal recommendation and hides the discovery trigger once picked', () => {
    clickSurpriseMe()
    expect(container.querySelectorAll('.recipe-pick-card')).toHaveLength(1)
    expect(heroTrigger()).toBeNull()
    expect(container.querySelector('.recipe-pick-again')).not.toBeNull()
  })

  it('collapses the normal grid after a pick and restores it via View all recipes / Hide recipes', () => {
    clickSurpriseMe()
    expect(container.querySelector('#recipe-browse-grid')).toBeNull()
    const toggle = container.querySelector<HTMLButtonElement>('.menu-list-toggle')
    if (!toggle) throw new Error('Missing recipe list toggle')
    expect(toggle.textContent).toBe('ดูสูตรทั้งหมด')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')

    act(() => toggle.click())
    expect(container.querySelector('#recipe-browse-grid')).not.toBeNull()
    expect(toggle.textContent).toBe('ซ่อนสูตร')
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(container.querySelector('.recipe-pick-card')).not.toBeNull()

    act(() => toggle.click())
    expect(container.querySelector('#recipe-browse-grid')).toBeNull()
  })

  it('never repeats the same recipe on consecutive Pick again clicks when more than one is eligible', () => {
    clickSurpriseMe()
    let previous = pickedName()
    for (let index = 0; index < 5; index += 1) {
      clickPickAgain()
      const next = pickedName()
      expect(next).toBeTruthy()
      expect(next).not.toBe(previous)
      expect(recipes.some(recipe => recipe.name.th === next)).toBe(true)
      previous = next
    }
  })

  it('safely repeats a one-result search pool without ever losing the pick', () => {
    typeSearch('tofu waffle')
    expect(searchRecipes(recipes, 'tofu waffle')).toHaveLength(1)
    clickSurpriseMe()
    expect(pickedName()).toBe('วาฟเฟิลเต้าหู้ซอสโยเกิร์ตมะนาว')
    for (let index = 0; index < 3; index += 1) {
      clickPickAgain()
      expect(pickedName()).toBe('วาฟเฟิลเต้าหู้ซอสโยเกิร์ตมะนาว')
    }
  })

  it('disables Surprise me when the search pool is empty', () => {
    typeSearch('zzzznonexistentrecipexyz')
    expect(heroTrigger()?.disabled).toBe(true)
  })

  it('invalidates the current pick once a new search makes it ineligible', () => {
    clickSurpriseMe()
    expect(pickCard()).not.toBeNull()

    typeSearch('zzzznonexistentrecipexyz')
    expect(pickCard()).toBeNull()
    expect(container.querySelector('.menu-list-toggle')).toBeNull()
  })

  it('invalidates the current pick once a category filter makes it ineligible', () => {
    clickCategoryChip('เน้นผักและพืช')
    clickSurpriseMe()
    const picked = recipes.find(recipe => recipe.name.th === pickedName())
    expect(picked?.category).toBe('Plant-forward')

    clickCategoryChip('โปรตีนสูง')
    expect(pickCard()).toBeNull()
    expect(heroTrigger()).not.toBeNull()
  })

  it('restores the full pool and re-enables Surprise me after clearing search', () => {
    typeSearch('zzzznonexistentrecipexyz')
    expect(heroTrigger()?.disabled).toBe(true)
    typeSearch('')
    expect(heroTrigger()?.disabled).toBe(false)
    clickSurpriseMe()
    expect(pickCard()).not.toBeNull()
  })

  it('synchronizes Favorite state between Pick Focus and Favorites', () => {
    clickSurpriseMe()
    const name = pickedName()
    const heart = pickCard()?.querySelector<HTMLButtonElement>('.heart')
    if (!heart) throw new Error('Missing favorite toggle in Pick Focus')
    expect(heart.getAttribute('aria-pressed')).toBe('false')

    act(() => heart.click())
    expect(heart.getAttribute('aria-pressed')).toBe('true')
    expect(JSON.parse(window.localStorage.getItem('healthy-recipe-favorites-v1') ?? '[]')).toEqual([recipes.find(recipe => recipe.name.th === name)?.id])

    clickFavoritesNav()
    expect([...container.querySelectorAll('.recipe-card h3')].some(node => node.textContent === name)).toBe(true)
  })

  it('opens recipe detail through the existing View recipe handoff and returns with the pick intact', () => {
    clickSurpriseMe()
    const name = pickedName()
    const viewButton = pickCard()?.querySelector<HTMLButtonElement>('.recipe-pick-view')
    if (!viewButton) throw new Error('Missing View recipe button')
    act(() => viewButton.click())

    expect(container.querySelector('.detail h1')?.textContent).toBe(name)
    clickBack()
    expect(pickedName()).toBe(name)
  })

  it('supports the existing Shopping List handoff from a fresh pick, including a newly added R3 recipe', () => {
    typeSearch('wakame')
    clickSurpriseMe()
    expect(pickedName()).toBe('ซุปสาหร่ายวากาเมะไข่')
    const viewButton = pickCard()?.querySelector<HTMLButtonElement>('.recipe-pick-view')
    act(() => viewButton!.click())
    act(() => container.querySelector<HTMLButtonElement>('.shopping-action')?.click())
    expect(container.querySelector('.shopping-action')?.getAttribute('aria-pressed')).toBe('true')
    clickBack()

    act(() => container.querySelector<HTMLButtonElement>('.shopping-nav')?.click())
    expect([...container.querySelectorAll('.shopping-recipe-name')].some(node => node.textContent === 'ซุปสาหร่ายวากาเมะไข่')).toBe(true)
  })

  it('handles all four newly added R3 recipes as one-result search picks without special casing', () => {
    const cases: Array<[string, string]> = [
      ['tofu-waffle', 'tofu waffle'],
      ['sweet-potato-kimchi', 'roasted sweet potato'],
      ['konjac-kimchi-egg-noodles', 'konjac'],
      ['wakame-egg-soup', 'wakame'],
    ]
    for (const [id, query] of cases) {
      typeSearch(query)
      const recipe = recipes.find(candidate => candidate.id === id)!
      expect(heroTrigger()?.disabled).toBe(false)
      clickSurpriseMe()
      expect(pickedName()).toBe(recipe.name.th)
      const image = pickCard()?.querySelector('img')
      expect(image?.getAttribute('src')).toBe(recipe.image)
      typeSearch('')
    }
  })

  it('finds the R3 recipes through Thai search terms and picks the sole match', () => {
    typeSearch('บุก')
    expect(searchRecipes(recipes, 'บุก').map(recipe => recipe.id)).toContain('konjac-kimchi-egg-noodles')
    clickSurpriseMe()
    expect(pickedName()).toBe('บุกผัดกิมจิไข่')

    typeSearch('')
    typeSearch('วากาเมะ')
    expect(searchRecipes(recipes, 'วากาเมะ').map(recipe => recipe.id)).toContain('wakame-egg-soup')
    clickSurpriseMe()
    expect(pickedName()).toBe('ซุปสาหร่ายวากาเมะไข่')
  })

  it('uses Thai and English copy consistent with the rest of the app', () => {
    clickSurpriseMe()
    expect(container.querySelector('.recipe-pick-header h3')?.textContent).toBe('เมนูที่เลือกให้')
    expect(container.querySelector('.recipe-pick-again')?.textContent).toContain('สุ่มใหม่')
    expect(container.querySelector('.recipe-pick-view')?.textContent).toBe('ดูสูตร')

    act(() => [...container.querySelectorAll<HTMLButtonElement>('.language-switcher button')].find(button => button.textContent === 'EN')?.click())
    expect(container.querySelector('.recipe-pick-header h3')?.textContent).toBe('Your pick')
    expect(container.querySelector('.recipe-pick-again')?.textContent).toContain('Pick again')
    expect(container.querySelector('.recipe-pick-view')?.textContent).toBe('View recipe')
  })

  it('exposes accessible names for Surprise me, Pick again, and the favorite toggle', () => {
    expect(heroTrigger()?.getAttribute('aria-label')).toBeNull()
    expect(heroTrigger()?.textContent).toContain('สุ่มเมนู')
    clickSurpriseMe()
    expect(container.querySelector('.recipe-pick')?.getAttribute('aria-live')).toBe('polite')
    const heart = pickCard()?.querySelector<HTMLButtonElement>('.heart')
    expect(heart?.getAttribute('aria-pressed')).toBe('false')
    expect(heart?.getAttribute('aria-label')).toBeTruthy()
    const image = pickCard()?.querySelector('img')
    expect(image?.getAttribute('alt')).toBeTruthy()
  })

  it('keeps a collapsed recipe list out of the DOM entirely (removed from keyboard traversal)', () => {
    clickSurpriseMe()
    expect(container.querySelector('.recipe-grid')).toBeNull()
  })
})
