// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import App from './App'
import { AdFeed, AdSlot, recipeAdCadence, recipeFeedAdAfter } from './ad-slot'
import { recipes, chooseRandom, filterRecipes, emptyFilters } from './recipes'
import { restaurants, restaurantMenuItems, searchRestaurantMenuItems } from './restaurants'
import { recipeRestaurantRelations } from './recipe-restaurant-relations'
;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let container: HTMLDivElement, root: Root
beforeEach(() => {
  localStorage.clear()
  vi.stubEnv('VITE_SHOW_AD_PROTOTYPE', 'true')
  container = document.createElement('div'); document.body.append(container)
  root = createRoot(container)
})
afterEach(() => { act(() => root.unmount()); container.remove(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks() })
function render(node = <App />) { act(() => root.render(node)) }
function click(selector: string) { const button = container.querySelector<HTMLButtonElement>(selector); expect(button).not.toBeNull(); act(() => button!.click()) }
function ads(placement: string) { return container.querySelectorAll(`[data-ad-placement="${placement}"]`) }
function after(selector: string, placement: string) {
  const result = container.querySelector(selector)!
  const ad = ads(placement)[0]
  expect(result).not.toBeNull(); expect(ad).toBeTruthy()
  expect(result.compareDocumentPosition(ad) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(result.contains(ad)).toBe(false)
}
it('requires explicit true opt-in, labels sponsorship and adds no tab stops', () => {
  for (const value of ['', 'false', 'TRUE']) { vi.stubEnv('VITE_SHOW_AD_PROTOTYPE', value); render(<AdSlot placement="recipe-pick" />); expect(container.children).toHaveLength(0) }
  vi.stubEnv('VITE_SHOW_AD_PROTOTYPE', 'true'); render(<AdSlot placement="recipe-pick" />)
  expect(container.querySelector('aside')?.textContent).toContain('Sponsored · โฆษณา')
  expect(container.querySelectorAll('button,a,input,[tabindex]')).toHaveLength(0)
})
it('defines cadence independently of browser pixel widths', () => {
  expect([recipeAdCadence(1), recipeAdCadence(2), recipeAdCadence(3)]).toEqual([8, 10, 12])
  for (const columns of [1, 2, 3] as const) {
    const cadence = recipeAdCadence(columns)
    for (const total of [0, 7, cadence, cadence + 1, cadence * 3, 208]) {
      const positions = Array.from({ length: total }, (_, i) => i + 1).filter(count => recipeFeedAdAfter(count, total, columns))
      expect(positions).toEqual(Array.from({ length: Math.max(0, Math.floor((total - 1) / cadence)) }, (_, i) => (i + 1) * cadence))
      expect(positions).not.toContain(total)
    }
  }
})
it('repeats recipe and menu separators with continuation while retaining every card', () => {
  for (const desktop of [false, true]) {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: desktop, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
    const cadence = recipeAdCadence(desktop ? 3 : 1)
    for (const placement of ['recipe-feed', 'menu-feed'] as const) for (const count of [0, 7, cadence, cadence + 1, cadence * 2, 208]) {
      act(() => root.unmount()); root = createRoot(container)
      render(<AdFeed placement={placement}>{Array.from({ length: count }, (_, i) => <article key={i}>{i}</article>)}</AdFeed>)
      expect(container.querySelectorAll('article')).toHaveLength(count)
      expect(ads(placement)).toHaveLength(Math.max(0, Math.floor((count - 1) / cadence)))
      expect(container.lastElementChild?.tagName).not.toBe('ASIDE')
      for (const ad of ads(placement)) {
        expect(ad.previousElementSibling?.tagName).toBe('ARTICLE')
        expect(ad.nextElementSibling?.tagName).toBe('ARTICLE')
        const siblings = Array.from(container.children)
        const before = siblings.slice(0, siblings.indexOf(ad)).filter(el => el.tagName === 'ARTICLE').length
        expect(before % cadence).toBe(0)
      }
    }
    vi.unstubAllGlobals()
  }
})
it('preserves source counts, filtering and random inputs', () => {
  expect([recipes.length, restaurants.length, restaurantMenuItems.length, recipeRestaurantRelations.length]).toEqual([208, 17, 97, 23])
  const filtered = filterRecipes(recipes, emptyFilters)
  expect(filtered).toHaveLength(recipes.length)
  expect(recipes).toContainEqual(chooseRandom(filtered))
})
it('places repeated recipe browse ads after eight recipes; pick answer/actions precede one ad; detail has one bottom ad', () => {
  render()
  expect(container.querySelectorAll('.recipe-card')).toHaveLength(recipes.length)
  expect(container.querySelector('#recipe-browse-grid')?.children[8]).toBe(ads('recipe-feed')[0])
  click('.recipe-discovery-random')
  expect(ads('recipe-pick')).toHaveLength(1); expect(ads('recipe-feed')).toHaveLength(0)
  after('.recipe-pick', 'recipe-pick')
  click('.recipe-pick-again'); expect(ads('recipe-pick')).toHaveLength(1)
  click('.recipe-pick-view'); expect(ads('recipe-detail')).toHaveLength(1)
})
it('search removes the feed ad for short results without changing matching cards', () => {
  render()
  const input = container.querySelector<HTMLInputElement>('.search input')!
  act(() => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'zzzz-no-match'); input.dispatchEvent(new Event('input', { bubbles: true })) })
  expect(ads('recipe-feed')).toHaveLength(0); expect(container.querySelectorAll('.recipe-card')).toHaveLength(0)
})
it('restaurant feed and each independent result have one sibling ad, shared cards have none', () => {
  render(); click('.meal-hub button:last-child')
  expect(container.querySelectorAll('.restaurant-row')).toHaveLength(17)
  expect(container.querySelector('.restaurant-grid')?.children[10]).toBe(ads('restaurant-feed')[0])
  click('.restaurant-pick-trigger'); expect(ads('restaurant-pick')).toHaveLength(1)
  after('.restaurant-pick', 'restaurant-pick')
  click('.restaurant-meal-pick-trigger'); expect(ads('restaurant-pick')).toHaveLength(2)
  expect(container.querySelector('.restaurant-meal-pick-card')?.querySelector('[data-ad-placement]')).toBeNull()
  click('.restaurant-row'); click('.menu-pick-header .random-button')
  expect(ads('restaurant-pick')).toHaveLength(1); after('.menu-pick', 'restaurant-pick')
  expect(container.querySelector('.menu-pick-card')?.querySelector('[data-ad-placement]')).toBeNull()
})
it('Explore result has one ad beneath shared focus card and bridge', () => {
  render(); click('.explore-nav'); click('.menu-pick-header .random-button')
  expect(ads('restaurant-pick')).toHaveLength(1); after('.menu-pick', 'restaurant-pick')
  expect(container.querySelector('.menu-pick-card')?.querySelector('[data-ad-placement]')).toBeNull()
})


it('keeps category filtering and random picks inside the unchanged candidate pool', () => {
  render(); click('.chips button:nth-child(2)')
  const expected = recipes.filter(recipe => recipe.category === 'Quick meals')
  expect(container.querySelectorAll('.recipe-card')).toHaveLength(expected.length)
  expect(ads('recipe-feed')).toHaveLength(Math.floor((expected.length - 1) / 8))
  click('.recipe-discovery-random')
  expect(expected.map(recipe => recipe.name.th)).toContain(container.querySelector('.recipe-pick-card h3')?.textContent)
  const before = container.querySelector('.recipe-pick-card h3')?.textContent
  click('.recipe-pick-again')
  expect(container.querySelector('.recipe-pick-card h3')?.textContent).not.toBe(before)
})
it('keeps Favorites, Pantry and Shopping ad-free when prototype is enabled', () => {
  render(); click('.recipe-card .heart')
  click('.icon-button')
  expect(container.querySelectorAll('.recipe-card')).toHaveLength(1)
  expect(container.querySelectorAll('[data-ad-placement]')).toHaveLength(0)
  click('.pantry-nav')
  expect(container.querySelectorAll('[data-ad-placement]')).toHaveLength(0)
  click('.shopping-nav')
  expect(container.querySelectorAll('[data-ad-placement]')).toHaveLength(0)
})
it('retains an intact recipe-to-restaurant bridge with prototype enabled', () => {
  render()
  const input = container.querySelector<HTMLInputElement>('.search input')!
  act(() => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'Shioyaki'); input.dispatchEvent(new Event('input', { bubbles: true })) })
  click('.recipe-card .food-art')
  expect(container.querySelector('.recipe-restaurant-bridge')).not.toBeNull()
  expect(ads('recipe-detail')).toHaveLength(1)
  after('.recipe-restaurant-bridge', 'recipe-detail')
  expect(container.querySelector('.recipe-restaurant-bridge [data-ad-placement]')).toBeNull()
  after('.step:last-child', 'recipe-detail')
  click('.recipe-restaurant-bridge button')
  expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()
})

it('places one bottom detail ad after complete content without a bridge, disabled by default', () => {
  render()
  click('.recipe-card .food-art')
  expect(container.querySelector('.recipe-restaurant-bridge')).toBeNull()
  expect(ads('recipe-detail')).toHaveLength(1)
  after('.step:last-child', 'recipe-detail')
  expect(container.querySelector('.detail-content')?.lastElementChild).toBe(ads('recipe-detail')[0])
  vi.stubEnv('VITE_SHOW_AD_PROTOTYPE', 'false')
  render()
  expect(container.querySelectorAll('[data-ad-placement]')).toHaveLength(0)
})
it('global menu search repeats shared feed cadence, filters naturally and keeps picks unchanged', () => {
  render(); click('.explore-nav')
  expect(container.querySelectorAll('#explore-menu-list > article')).toHaveLength(97)
  expect(ads('menu-feed')).toHaveLength(12) // shared cadence over 97 items after Slice 41B
  expect(container.querySelector('#explore-menu-list')?.lastElementChild?.tagName).toBe('ARTICLE')
  expect(container.querySelector('.menu-item-row [data-ad-placement]')).toBeNull()
  const input = container.querySelector<HTMLInputElement>('.explore-view .search input')!
  act(() => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'Shioyaki'); input.dispatchEvent(new Event('input', { bubbles: true })) })
  const count = container.querySelectorAll('#explore-menu-list > article').length
  const expected = searchRestaurantMenuItems(restaurantMenuItems, restaurants, 'Shioyaki')
  expect(count).toBe(expected.length); expect(count).toBeLessThan(8)
  expect(ads('menu-feed')).toHaveLength(0)
  click('.menu-pick-header .random-button')
  expect(ads('restaurant-pick')).toHaveLength(1)
  expect(ads('menu-feed')).toHaveLength(0)
  expect(expected.map(item => item.name.th)).toContain(container.querySelector('.menu-pick-card h3')?.textContent)
})

it('restaurant directory ad completes rows: after 9 cards on 3 columns, after 10 on 2 columns', () => {
  for (const [desktop, cardsBefore] of [[true, 9], [false, 10]] as const) {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: desktop, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
    act(() => root.unmount()); root = createRoot(container)
    render(); click('.meal-hub button:last-child')
    const grid = container.querySelector('.restaurant-grid')!
    expect(ads('restaurant-feed')).toHaveLength(1)
    expect(grid.children[cardsBefore]).toBe(ads('restaurant-feed')[0])
    expect(grid.querySelectorAll('.restaurant-card')).toHaveLength(17)
    expect(ads('restaurant-feed')[0].previousElementSibling?.classList.contains('restaurant-card')).toBe(true)
    expect(ads('restaurant-feed')[0].nextElementSibling?.classList.contains('restaurant-card')).toBe(true)
    vi.unstubAllGlobals()
  }
})
it('restaurant directory ad is absent when there are not enough cards to complete rows', () => {
  for (const [columns, count] of [[3, 9], [1, 10]] as const) {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: columns === 3, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
    act(() => root.unmount()); root = createRoot(container)
    render(<AdFeed placement="restaurant-feed">{Array.from({ length: count }, (_, i) => <article key={i}>{i}</article>)}</AdFeed>)
    expect(ads('restaurant-feed')).toHaveLength(0)
    vi.unstubAllGlobals()
  }
})
