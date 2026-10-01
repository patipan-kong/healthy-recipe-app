// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { EverydayMealDetail } from './everyday-meal-detail'
import { calculateEverydayMealNutrition, everydayMeals, getEverydayMealById, mealAddOns } from './everyday-meals'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let container: HTMLDivElement
let root: Root
beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  localStorage.clear()
  window.history.replaceState({}, '', '/?everyday-meals')
  container = document.createElement('div'); document.body.append(container)
  root = createRoot(container)
})
afterEach(() => { act(() => root.unmount()); container.remove(); window.history.replaceState({}, '', '/'); vi.restoreAllMocks() })
const meal = (id: string) => getEverydayMealById(id)!
function render(id: string) {
  window.history.replaceState({}, '', `/?everyday-meals&everyday-meal=${id}`)
  act(() => root.render(<App />))
}
const detail = () => container.querySelector<HTMLElement>('[data-everyday-meal-detail]')!
const kcal = () => detail().querySelector('[data-nutrition="kcal"]')?.textContent
function select(label: string) {
  const input = [...detail().querySelectorAll<HTMLInputElement>('input')].find(item => item.closest('label')?.textContent?.startsWith(label))!
  expect(input).toBeDefined()
  act(() => input.click())
  return input
}
function back() { act(() => detail().querySelector<HTMLButtonElement>('.detail-nav button')!.click()) }
function open(id: string) { act(() => container.querySelector<HTMLButtonElement>(`[data-everyday-meal-id="${id}"]`)!.click()) }
const tags = () => detail().querySelector('.everyday-meal-detail-tags')?.textContent

describe('Slice 42C navigation and base detail', () => {
  it('opens a semantic Browse card, addresses the meal, focuses identity and restores Browse filters and focus on Back', () => {
    act(() => root.render(<App />))
    const input = container.querySelector<HTMLInputElement>('.search input')!
    act(() => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'ข้าวต้ม'); input.dispatchEvent(new Event('input', { bubbles: true })) })
    act(() => [...container.querySelectorAll<HTMLButtonElement>('.everyday-meals-chips button')].find(item => item.textContent === 'เบาๆ')!.click())
    const card = container.querySelector<HTMLButtonElement>('[data-everyday-meal-id="fish-rice-soup"]')!
    expect(card.type).toBe('button'); expect(card.tabIndex).toBe(0); expect(card.getAttribute('aria-label')).toBe('ข้าวต้มปลา')
    open('fish-rice-soup')
    expect(detail().querySelector('h1')?.textContent).toBe('ข้าวต้มปลา')
    expect(document.activeElement).toBe(detail().querySelector('h1'))
    expect(new URLSearchParams(location.search).get('everyday-meal')).toBe('fish-rice-soup')
    back()
    expect(detail()).toBeNull(); expect(input.value).toBe('ข้าวต้ม')
    expect(container.querySelector('.everyday-meals-chips .active')?.textContent).toBe('เบาๆ')
    expect(container.querySelector('.explore-result-count')?.textContent).toBe('3 เมนู')
    expect(document.activeElement).toBe(card)
    expect(new URLSearchParams(location.search).has('everyday-meal')).toBe(false)
  })
  it('supports direct addressing and browser popstate', () => {
    render('fish-rice-soup')
    expect(kcal()).toBe('220–350 kcal')
    window.history.replaceState({}, '', '/?everyday-meals&everyday-meal=pork-suki')
    act(() => window.dispatchEvent(new PopStateEvent('popstate')))
    expect(detail().querySelector('h1')?.textContent).toBe('สุกี้หมู')
    window.history.replaceState({}, '', '/?everyday-meals')
    act(() => window.dispatchEvent(new PopStateEvent('popstate')))
    expect(detail()).toBeNull()
  })
  it('handles an unknown addressed ID with a way back', () => {
    render('unknown')
    expect(container.textContent).toContain('ไม่พบเมนูนี้')
    act(() => [...container.querySelectorAll<HTMLButtonElement>('button')].find(item => item.textContent === 'กลับไป Everyday Meals')!.click())
    expect(container.querySelector('[hidden]')).toBeNull()
    expect(container.querySelectorAll('[data-everyday-meal-id]')).toHaveLength(50)
  })
  it('shows fish nutrition, English identity, tags, serving and calm estimate copy without unsupported sections or provenance', () => {
    render('fish-rice-soup')
    expect(kcal()).toBe('220–350 kcal')
    expect(detail().querySelector('[data-nutrition="protein"]')?.textContent).toBe('14–22 g')
    expect(detail().querySelector('.detail-english')?.textContent).toBe(meal('fish-rice-soup').nameEn)
    expect(tags()).toBe('เบาๆ')
    expect(detail().querySelector('.everyday-meal-serving')?.textContent).toBe(meal('fish-rice-soup').nutrition.servingAssumption)
    expect(detail().textContent).toContain('ค่าพลังงานและสารอาหารเป็นค่าประมาณ')
    expect(detail().textContent).not.toMatch(/Sources|แหล่งข้อมูล|คาร์บ|ไขมัน|carbs|fat|sourceIds|confidence/)
    expect(detail().querySelector('fieldset, img, .everyday-meal-notes')).toBeNull()
    expect(detail().querySelector('.everyday-meal-option-estimate')).toBeNull()
    expect(detail().querySelector('.everyday-meal-detail-fallback')?.getAttribute('aria-hidden')).toBe('true')
  })
})

describe('Slice 42C meal options', () => {
  it.each([['pork-suki','220–350 kcal','350–450 kcal'],['chicken-suki','200–330 kcal','330–430 kcal'],['seafood-suki','200–330 kcal','300–400 kcal']])('scopes light to selected soup and uses exact preparation ranges for %s', (id, soup, dry) => {
    const before = structuredClone(meal(id))
    render(id)
    expect(detail().querySelector('fieldset legend')?.textContent).toBe('รูปแบบ')
    expect(detail().querySelector<HTMLInputElement>('input[type="radio"]')?.checked).toBe(true)
    expect(kcal()).toBe(soup); expect(tags()).toContain('เบาๆ')
    expect(detail().querySelector('.everyday-meal-option-estimate')).toBeNull()
    expect(detail().querySelector('input[type="checkbox"]')).toBeNull()
    expect(select('แห้ง').checked).toBe(true)
    expect(kcal()).toBe(dry); expect(tags()).not.toContain('เบาๆ')
    for (const tag of meal(id).tags) expect(tags()).toContain(tag === 'high-protein' ? 'โปรตีนสูง' : 'ผักเยอะ')
    select('น้ำ'); expect(kcal()).toBe(soup); expect(tags()).toContain('เบาๆ')
    expect(meal(id)).toEqual(before)
  })
  it('changes wonton preparation selection without inventing kcal or a light tag', () => {
    render('roast-pork-wonton-noodles')
    expect(kcal()).toBe('350–500 kcal')
    expect(select('แห้ง').checked).toBe(true)
    expect(kcal()).toBe('350–500 kcal'); expect(tags()).toBeUndefined()
    expect(detail().querySelector('.everyday-meal-option-estimate')).toBeNull()
    expect(detail().querySelector('.everyday-meal-effect')).toBeNull()
  })
  it('keeps chicken-part and skin independent, with semantic lower energy and unchanged nutrition', () => {
    render('hainanese-chicken-rice')
    expect([...detail().querySelectorAll('legend')].map(item => item.textContent)).toEqual(['ส่วนไก่','หนัง'])
    expect(detail().querySelectorAll('input:checked')).toHaveLength(2)
    const skinless = select('ลอกหนัง'); const thigh = select('สะโพก')
    expect(skinless.checked).toBe(true); expect(thigh.checked).toBe(true)
    expect(detail().querySelector('.everyday-meal-effect')?.textContent).toBe('ตัวเลือกนี้ช่วยลดพลังงาน แต่ยังระบุปริมาณที่ลดไม่ได้')
    expect(detail().querySelector('.everyday-meal-option-estimate')?.textContent).toBe('ค่าพลังงานเป็นช่วงประมาณของเมนูโดยรวม ยังไม่ปรับตามตัวเลือกส่วนไก่และหนัง')
    expect(kcal()).toBe('500–650 kcal')
    select('ติดหนัง'); expect(thigh.checked).toBe(true)
    expect(detail().querySelector('.everyday-meal-effect')).toBeNull()
    expect(detail().textContent).not.toMatch(/[-−]\d+\s*kcal/)
  })
  it.each(['braised-pork-leg-rice','roast-duck-rice','grilled-chicken-rice','grilled-chicken-jaew-rice','papaya-salad-grilled-chicken-sticky-rice'])('renders exact skin choices for %s with semantic-only nutrition', id => {
    render(id)
    const before = kcal()
    const group = meal(id).optionGroups![0]
    expect([...detail().querySelectorAll('input[type="radio"]')].map(item => item.closest('label')?.textContent)).toEqual(group.choices.map(choice => choice.labelTh))
    select(group.choices[1].labelTh)
    expect(kcal()).toBe(before)
    expect(detail().querySelector('.everyday-meal-effect')?.textContent).toBe('ตัวเลือกนี้ช่วยลดพลังงาน แต่ยังระบุปริมาณที่ลดไม่ได้')
    expect(detail().querySelector('.everyday-meal-option-estimate')?.textContent).toContain(`ยังไม่ปรับตามตัวเลือก${group.labelTh}`)
    expect(detail().textContent).not.toMatch(/[-−]\d+\s*kcal/)
    if (id.startsWith('papaya')) {
      expect(kcal()).toBe('500–750 kcal')
      expect(detail().querySelector('[data-nutrition="protein"]')?.textContent).toBe('25–40 g')
      expect(tags()).toBe('โปรตีนสูงผักเยอะ')
    }
  })
})

describe('Slice 42C add-ons and supporting data', () => {
  it('composes independent eggs, deselects accurately, omits unknown combined protein and never mutates data', () => {
    const before = structuredClone({ everydayMeals, mealAddOns })
    render('minced-pork-basil-rice')
    expect(kcal()).toBe('450–650 kcal')
    expect(detail().querySelector('.everyday-meal-option-estimate')).toBeNull()
    expect(detail().querySelector('[data-nutrition="protein"]')?.textContent).toBe('15–25 g')
    expect([...detail().querySelectorAll('.everyday-meal-addons label')].map(item => item.textContent)).toEqual(['ไข่ต้ม~70 kcal','ไข่ดาว~150 kcal'])
    expect(select('ไข่ดาว').checked).toBe(true); expect(kcal()).toBe('600–800 kcal')
    expect(detail().querySelector('[data-nutrition="protein"]')).toBeNull()
    expect(detail().textContent).toContain('ยังไม่มีค่าประมาณโปรตีนรวม')
    select('ไข่ต้ม'); expect(kcal()).toBe('670–870 kcal')
    expect(detail().querySelector('.everyday-meal-serving')?.textContent).toContain('ไข่ต้ม 1 ฟอง')
    select('ไข่ดาว'); expect(kcal()).toBe('520–720 kcal')
    select('ไข่ต้ม'); expect(kcal()).toBe('450–650 kcal')
    expect(detail().querySelector('[data-nutrition="protein"]')?.textContent).toBe('15–25 g')
    expect(detail().querySelectorAll('input[type="number"], select')).toHaveLength(0)
    expect({ everydayMeals, mealAddOns }).toEqual(before)
  })
  it.each(everydayMeals.map(item => [item.id] as const))('offers exactly the assigned add-ons for %s', id => {
    render(id)
    expect([...detail().querySelectorAll('.everyday-meal-addons label')].map(label => label.textContent?.split('~')[0])).toEqual(mealAddOns.filter(addOn => meal(id).addOnIds?.includes(addOn.id)).map(addOn => addOn.nameTh))
  })
  it('uses real tips and conditional notes and omits empty sections', () => {
    render('fish-rice-soup')
    expect([...detail().querySelectorAll('.everyday-meal-tips li')].map(item => item.textContent)).toEqual(meal('fish-rice-soup').orderingTips!.map(tip => tip.textTh))
    back(); open('minced-pork-omelet-rice')
    expect([...detail().querySelectorAll('.everyday-meal-notes li')].map(item => item.textContent)).toEqual(meal('minced-pork-omelet-rice').nutritionNotes)
    back(); open('chicken-kua-noodles')
    expect(detail().querySelector('.everyday-meal-tips, .everyday-meal-notes, .everyday-meal-addons')).toBeNull()
  })
  it('resets eggs and preparation on reentry and remounts independently selected meals', () => {
    render('minced-pork-basil-rice'); select('ไข่ดาว'); back()
    open('pork-suki'); select('แห้ง'); back()
    open('minced-pork-basil-rice'); expect(kcal()).toBe('450–650 kcal')
    expect(detail().querySelector('input:checked')).toBeNull(); back()
    open('pork-suki'); expect(kcal()).toBe('220–350 kcal'); back()
    open('hainanese-chicken-rice'); select('ลอกหนัง'); back()
    open('roast-duck-rice'); expect(detail().querySelector('input:checked')?.closest('label')?.textContent).toBe('ติดหนัง')
  })
  it('resets options when an addressed meal changes without returning through Browse', () => {
    render('pork-suki'); select('แห้ง')
    window.history.replaceState({}, '', '/?everyday-meals&everyday-meal=chicken-suki')
    act(() => window.dispatchEvent(new PopStateEvent('popstate')))
    expect(kcal()).toBe('200–330 kcal')
    expect(detail().querySelector('input:checked')?.closest('label')?.textContent).toBe('น้ำ')
  })
  it('does not render empty arrays as supporting sections', () => {
    const item = { ...meal('fish-rice-soup'), orderingTips: [], nutritionNotes: [] }
    act(() => root.render(<EverydayMealDetail meal={item} locale="th" onBack={() => undefined} />))
    expect(detail().querySelector('.everyday-meal-tips, .everyday-meal-notes')).toBeNull()
  })
  it('derives semantic explanation from option data even on an unrelated meal ID', () => {
    const item = { ...structuredClone(meal('fish-rice-soup')), optionGroups: structuredClone(meal('hainanese-chicken-rice').optionGroups) }
    act(() => root.render(<EverydayMealDetail meal={item} locale="th" onBack={() => undefined} />))
    select('ลอกหนัง')
    expect(kcal()).toBe('220–350 kcal')
    expect(detail().querySelector('.everyday-meal-option-estimate')?.textContent).toContain('ยังไม่ปรับตามตัวเลือกส่วนไก่และหนัง')
    expect(detail().querySelector('.everyday-meal-effect')?.textContent).toContain('ยังระบุปริมาณที่ลดไม่ได้')
    expect(detail().textContent).not.toMatch(/[-−]\d+\s*kcal/)
  })
})

describe('Slice 42C option/add-on composition', () => {
  it('applies the selected preparation before shared add-on arithmetic even on a future meal supporting both', () => {
    const item = { ...structuredClone(meal('pork-suki')), addOnIds: ['fried-egg'] }
    const before = structuredClone(item)
    expect(calculateEverydayMealNutrition(item, {}, []).kcal).toEqual({ min: 220, max: 350 })
    expect(calculateEverydayMealNutrition(item, { preparation: 'dry' }, ['fried-egg']).kcal).toEqual({ min: 500, max: 600 })
    expect(calculateEverydayMealNutrition(item, { preparation: 'soup' }, ['fried-egg']).proteinG).toBeUndefined()
    expect(() => calculateEverydayMealNutrition(item, { preparation: 'unknown' }, [])).toThrow('Invalid option')
    expect(() => calculateEverydayMealNutrition(item, {}, ['fried-egg', 'fried-egg'])).toThrow('Duplicate add-on')
    expect(item).toEqual(before)
  })
})
