// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import App from './App'
import { recipeAdCadence } from './ad-slot'
import { everydayMeals } from './everyday-meals'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let container: HTMLDivElement
let root: Root
beforeEach(() => {
  localStorage.clear(); history.replaceState({}, '', '/')
  vi.stubEnv('VITE_SHOW_AD_PROTOTYPE', 'true')
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  container = document.createElement('div'); document.body.append(container)
  root = createRoot(container)
})
afterEach(() => { act(() => root.unmount()); container.remove(); history.replaceState({}, '', '/'); vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks() })
const render = () => act(() => root.render(<App />))
function click(selector: string) { const el = container.querySelector<HTMLElement>(selector); expect(el).not.toBeNull(); act(() => el!.click()) }
const ads = (placement: string) => container.querySelectorAll(`[data-ad-placement="${placement}"]`)
const detail = () => container.querySelector<HTMLElement>('[data-everyday-meal-detail]')!
const browseButton = '.home-entry-pair:not(.home-random-pair) button:last-child'
const randomButton = '.home-random-pair button:last-child'

function expectNormalDetailAd() {
  expect(detail()).not.toBeNull()
  expect(detail().querySelectorAll('[data-ad-placement]')).toHaveLength(1)
  expect(detail().querySelectorAll('[data-ad-placement="recipe-detail"]')).toHaveLength(1)
  expect(detail().querySelector('.detail-content')?.lastElementChild).toBe(ads('recipe-detail')[0])
  expect(ads('recipe-detail')).toHaveLength(1)
  expect(ads('recipe-pick')).toHaveLength(0)
  expect(ads('restaurant-pick')).toHaveLength(0)
}

it('Browse uses the shared menu-feed cadence inside the grid, never at the end, keeping every card', () => {
  for (const desktop of [false, true]) {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: desktop, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
    act(() => root.unmount()); root = createRoot(container); history.replaceState({}, '', '/')
    render(); click(browseButton)
    const grid = container.querySelector('.everyday-meals-grid')!
    const cadence = recipeAdCadence(desktop ? 3 : 1)
    expect(grid.querySelectorAll('[data-everyday-meal-id]')).toHaveLength(everydayMeals.length)
    expect(ads('menu-feed')).toHaveLength(Math.floor((everydayMeals.length - 1) / cadence))
    expect(grid.children[cadence]).toBe(ads('menu-feed')[0])
    expect(grid.lastElementChild?.tagName).toBe('BUTTON')
    expect(grid.querySelectorAll('[data-ad-placement] button,[data-ad-placement] a')).toHaveLength(0)
    vi.unstubAllGlobals()
  }
})
it('filtered/searched Browse results drop the ad when too short and keep matching cards', () => {
  render(); click(browseButton)
  const input = container.querySelector<HTMLInputElement>('.everyday-meals-view input[type="search"]')!
  act(() => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'หมู'); input.dispatchEvent(new Event('input', { bubbles: true })) })
  const count = container.querySelectorAll('[data-everyday-meal-id]').length
  expect(count).toBeGreaterThan(0); expect(count).toBeLessThan(everydayMeals.length)
  expect(ads('menu-feed')).toHaveLength(count > 8 ? Math.floor((count - 1) / 8) : 0)
  act(() => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'zzzz-no-match'); input.dispatchEvent(new Event('input', { bubbles: true })) })
  expect(ads('menu-feed')).toHaveLength(0)
})
it('Detail has the same single bottom recipe-detail ad from Browse, Random and direct entry', () => {
  render(); click(browseButton); click('[data-everyday-meal-id="pork-suki"]')
  expectNormalDetailAd()
  click('.everyday-meal-detail .detail-nav button')
  click('.everyday-meals-view .restaurant-back')

  vi.spyOn(Math, 'random').mockReturnValue(0)
  click(randomButton)
  expectNormalDetailAd()
  expect(detail().innerHTML).toContain('data-ad-placement="recipe-detail"')
  click('.everyday-meal-detail .detail-nav button')
  expect(container.querySelector('.meal-hub')).not.toBeNull(); expect(ads('recipe-detail')).toHaveLength(0)

  act(() => root.unmount()); root = createRoot(container)
  history.replaceState({}, '', '/?everyday-meals&everyday-meal=pork-suki'); render()
  expectNormalDetailAd()
})
it('Random adds no interstitial and no extra ad beyond the normal Detail slot; disabled prototype shows none', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  render(); const homeAds = container.querySelectorAll('[data-ad-placement]').length; expect(homeAds).toBeGreaterThan(0)
  click(randomButton)
  expect(container.querySelectorAll('[data-ad-placement]')).toHaveLength(1)
  vi.stubEnv('VITE_SHOW_AD_PROTOTYPE', 'false')
  act(() => root.unmount()); root = createRoot(container); render()
  expect(container.querySelectorAll('[data-ad-placement]')).toHaveLength(0)
})
