// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import App from './App'
import { everydayMeals, getRandomEverydayMeal } from './everyday-meals'
import { chooseRandom } from './recipes'
import { restaurants } from './restaurants'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let container: HTMLDivElement
let root: Root
beforeEach(() => {
  localStorage.clear(); history.replaceState({}, '', '/')
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  container = document.createElement('div'); document.body.append(container)
  root = createRoot(container)
})
afterEach(() => { act(() => root.unmount()); container.remove(); history.replaceState({}, '', '/'); vi.restoreAllMocks() })
function render() { act(() => root.render(<App />)) }
function click(selector: string) { const button = container.querySelector<HTMLButtonElement>(selector); expect(button).not.toBeNull(); act(() => button!.click()) }
const detail = () => container.querySelector<HTMLElement>('[data-everyday-meal-detail]')
const randomButton = '.home-random-pair button:last-child'

it('derives content counts and exposes exactly four accessible peer actions', () => {
  render()
  const actions = [...container.querySelectorAll<HTMLButtonElement>('.home-entry')]
  expect(actions).toHaveLength(4)
  expect(actions[0].textContent).toContain('17 ร้าน · 97 เมนู')
  expect(actions[1].textContent).toContain(`${everydayMeals.length} เมนู`)
  expect(actions.map(button => button.type)).toEqual(['button', 'button', 'button', 'button'])
  expect(actions.every(button => button.tabIndex === 0 && !button.querySelector('button,a,input'))).toBe(true)
  expect(container.textContent).toContain('มื้อนี้ลอง...')
})
it('opens existing Browse, preserves Browse detail/back and returns Home with a clean address', () => {
  render(); click('.home-entry-pair:not(.home-random-pair) button:last-child')
  expect(container.querySelectorAll('[data-everyday-meal-id]')).toHaveLength(50)
  click('[data-everyday-meal-id="pork-suki"]')
  expect(detail()?.querySelector('h1')?.textContent).toBe('สุกี้หมู')
  click('.everyday-meal-detail .detail-nav button')
  expect(detail()).toBeNull()
  expect(document.activeElement?.getAttribute('data-everyday-meal-id')).toBe('pork-suki')
  click('.everyday-meals-view .restaurant-back')
  expect(container.querySelector('.meal-hub')).not.toBeNull()
  expect(location.search).toBe('')
})
it.each(['pork-suki', 'hainanese-chicken-rice', everydayMeals.at(-1)!.id])('random opens %s directly with normal defaults and no random options/add-ons', id => {
  const index = everydayMeals.findIndex(meal => meal.id === id)
  const rng = vi.spyOn(Math, 'random').mockReturnValue((index + 0.5) / everydayMeals.length)
  render(); click(randomButton)
  expect(detail()?.dataset.everydayMealDetail).toBe(id)
  expect(detail()?.querySelector('h1')?.textContent).toBe(everydayMeals[index].nameTh)
  expect(location.search).toContain(`everyday-meal=${id}`)
  for (const group of everydayMeals[index].optionGroups ?? []) {
    expect(detail()?.querySelector<HTMLInputElement>(`input[name="${id}-${group.id}"]:checked`)?.closest('label')?.textContent).toBe(group.choices[0].labelTh)
  }
  expect(detail()?.querySelectorAll('input[type="checkbox"]:checked')).toHaveLength(0)
  expect(rng).toHaveBeenCalledTimes(1)
  click('.everyday-meal-detail .detail-nav button')
  expect(container.querySelector('.meal-hub')).not.toBeNull()
  expect(location.search).toBe('')
  click(randomButton)
  expect(rng).toHaveBeenCalledTimes(2)
  expect(detail()?.dataset.everydayMealDetail).toBe(id)
})
it('refresh/direct entry retains random meal identity and direct-entry Back remains valid Browse', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  render(); click(randomButton)
  act(() => root.unmount()); root = createRoot(container); render()
  expect(detail()?.dataset.everydayMealDetail).toBe('pork-suki')
  click('.everyday-meal-detail .detail-nav button')
  expect(container.querySelectorAll('[data-everyday-meal-id]')).toHaveLength(50)
})
it('browser Back from Home random returns Home', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  render(); click(randomButton)
  history.replaceState({}, '', '/')
  act(() => window.dispatchEvent(new PopStateEvent('popstate')))
  expect(container.querySelector('.meal-hub')).not.toBeNull()
  expect(detail()).toBeNull()
})
it('random ignores prior Browse search/chips and makes a fresh selection on each Home activation', () => {
  render(); click('.home-entry-pair:not(.home-random-pair) button:last-child')
  const input = container.querySelector<HTMLInputElement>('.everyday-meals-view .search input')!
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'no matching meal')
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  click('.everyday-meals-chips button:nth-child(2)')
  expect(container.querySelectorAll('[data-everyday-meal-id]')).toHaveLength(0)
  click('.everyday-meals-view .restaurant-back')
  const rng = vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.999999)
  click(randomButton)
  expect(detail()?.dataset.everydayMealDetail).toBe(everydayMeals[0].id)
  click('.everyday-meal-detail .detail-nav button'); click(randomButton)
  expect(detail()?.dataset.everydayMealDetail).toBe(everydayMeals.at(-1)!.id)
  expect(rng).toHaveBeenCalledTimes(2)
})
it('Home restaurant random reuses the existing restaurant result and menu navigation', () => {
  const random = () => 0.999999
  const expected = chooseRandom(restaurants, undefined, random)!
  vi.spyOn(Math, 'random').mockImplementation(random)
  render(); click('.home-random-pair button:first-child')
  expect(container.querySelector('.restaurant-pick-text h3')?.textContent).toBe(expected.name.th)
  expect(detail()).toBeNull()
  click('.restaurant-pick-view-menu')
  expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()
})
it('retains exactly 50 equally sized entity intervals independent of variants', () => {
  expect(everydayMeals).toHaveLength(50)
  expect(getRandomEverydayMeal(() => 0)).toBe(everydayMeals[0])
  expect(getRandomEverydayMeal(() => 0.999999)).toBe(everydayMeals.at(-1))
  expect(Array.from({ length: 50 }, (_, index) => getRandomEverydayMeal(() => (index + 0.5) / 50))).toEqual(everydayMeals)
})
