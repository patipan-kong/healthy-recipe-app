// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { everydayMeals, hasEverydayMealDiscoveryTag } from './everyday-meals'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let container: HTMLDivElement
let root: Root
beforeEach(() => {
  localStorage.clear()
  window.history.replaceState({}, '', '/?everyday-meals')
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(<App />))
})
afterEach(() => { act(() => root.unmount()); container.remove(); window.history.replaceState({}, '', '/') })
const cards = () => [...container.querySelectorAll<HTMLElement>('[data-everyday-meal-id]')]
const ids = () => cards().map(card => card.dataset.everydayMealId)
function chip(label: string) {
  const button = [...container.querySelectorAll<HTMLButtonElement>('.everyday-meals-chips button')].find(item => item.textContent === label)!
  act(() => button.click())
  return button
}
function search(value: string) {
  const input = container.querySelector<HTMLInputElement>('.everyday-meals-view input')!
  act(() => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })) })
}

describe('Slice 42B Browse', () => {
  it('renders all 50 catalog meals with six semantic chips and no premature interactions', () => {
    expect(ids()).toEqual(everydayMeals.map(meal => meal.id))
    expect(container.querySelector('.everyday-meals-heading')?.textContent).toContain('วันนี้อยากกินอะไร?')
    const buttons = [...container.querySelectorAll('.everyday-meals-chips button')]
    expect(buttons.map(button => button.textContent)).toEqual(['ทั้งหมด','ข้าว','เส้น','เบาๆ','โปรตีนสูง','ผักเยอะ'])
    expect(buttons.map(button => button.getAttribute('aria-pressed'))).toEqual(['true','false','false','false','false','false'])
    expect(cards()[0].textContent).toContain('สุกี้หมู')
    expect(cards()[49].textContent).toContain('ลาบหมู + ข้าวเหนียว + ผัก')
    expect(container.querySelector('.everyday-meals-view input')?.getAttribute('aria-label')).toBe('ค้นหาเมนู...')
    expect(container.querySelector('[role="status"]')?.textContent).toBe('50 เมนู')
    for (const card of cards()) {
      expect(card.tagName).toBe('ARTICLE')
      expect(card.querySelector('button, input, select, a, img')).toBeNull()
      expect(card.textContent).not.toMatch(/proteinG|กรัม|ฟอง|confidence|1 จาน|1 ชาม/)
      expect(card.querySelector('.everyday-meal-fallback')?.getAttribute('aria-hidden')).toBe('true')
    }
    const fish = cards().find(card => card.dataset.everydayMealId === 'fish-rice-soup')!
    expect(fish.querySelector('.everyday-meal-kcal')?.textContent).toBe('220–350 kcal')
    expect([...cards()[0].querySelectorAll('.everyday-meal-kcal span')].map(line => line.textContent)).toEqual(['น้ำ 220–350 kcal', 'แห้ง 350–450 kcal'])
    expect(cards()[0].querySelector('.everyday-meal-kcal')?.childNodes).toHaveLength(2)
    expect(cards()[0].textContent).toContain('เบาๆ เมื่อน้ำ')
  })

  it.each([['ข้าว','rice',29],['เส้น','noodle',11]])('filters %s using category data', (label, category, count) => {
    expect(chip(label).getAttribute('aria-pressed')).toBe('true')
    expect(ids()).toEqual(everydayMeals.filter(meal => meal.category === category).map(meal => meal.id))
    expect(cards()).toHaveLength(count)
  })

  it.each([['โปรตีนสูง','high-protein',10],['ผักเยอะ','veggie-rich',6],['เบาๆ','light',9]] as const)('filters %s using discoverable tags', (label, tag, count) => {
    const before = structuredClone(everydayMeals)
    chip(label)
    expect(ids()).toEqual(everydayMeals.filter(meal => hasEverydayMealDiscoveryTag(meal, tag)).map(meal => meal.id))
    expect(cards()).toHaveLength(count)
    expect(container.querySelector('[role="status"]')?.textContent).toBe(`${count} เมนู`)
    expect(everydayMeals).toEqual(before)
    if (tag === 'light') expect(cards().slice(0,3).map(card => card.dataset.everydayMealId)).toEqual(everydayMeals.slice(0,3).map(meal => meal.id))
  })

  it('replaces the active chip and All resets only the filter', () => {
    chip('ข้าว'); chip('เบาๆ')
    expect(cards()).toHaveLength(9)
    expect(container.querySelectorAll('.everyday-meals-chips [aria-pressed="true"]')).toHaveLength(1)
    chip('ทั้งหมด'); expect(cards()).toHaveLength(50)
    search('ไก่'); chip('ข้าว'); chip('ทั้งหมด')
    expect(cards()).toHaveLength(everydayMeals.filter(meal => meal.nameTh.includes('ไก่')).length)
  })

  it('searches trimmed Thai and case-insensitive English, composing with the chip', () => {
    search(' ข้าวมันไก่ ')
    expect(cards()).toHaveLength(2)
    search(' HAINANESE ')
    expect(ids()).toEqual(['hainanese-chicken-rice'])
    search(' ไก่ '); chip('โปรตีนสูง')
    expect(cards().map(card => card.querySelector('h3')?.textContent)).toEqual(['สุกี้ไก่','ข้าวไก่ย่าง','ข้าวไก่ย่างจิ้มแจ่ว','ส้มตำ + ไก่ย่าง + ข้าวเหนียว'])
    search('   '); expect(cards()).toHaveLength(10)
  })

  it('shows an empty state and reset restores all results', () => {
    chip('เส้น'); search('impossible meal query')
    expect(cards()).toHaveLength(0)
    expect(container.querySelector('.empty')?.textContent).toContain('ไม่พบเมนูที่ตรงกับการค้นหา')
    act(() => container.querySelector<HTMLButtonElement>('.empty button')!.click())
    expect(cards()).toHaveLength(50)
    search('ไก่')
    act(() => container.querySelector<HTMLButtonElement>('.explore-search-clear')!.click())
    expect(cards()).toHaveLength(50)
  })

  it('leaves Home and existing restaurant/explore navigation intact', () => {
    act(() => container.querySelector<HTMLButtonElement>('.everyday-meals-view .restaurant-back')!.click())
    expect(container.querySelector('.meal-hub')).not.toBeNull()
    expect(container.querySelector('.everyday-meals-view')).toBeNull()
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')!.click())
    expect(container.querySelector('.restaurant-grid')).not.toBeNull()
    act(() => container.querySelector<HTMLButtonElement>('.explore-nav')!.click())
    expect(container.querySelector('.explore-view')).not.toBeNull()
  })
})
