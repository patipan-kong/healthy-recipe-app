// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ExploreView, RestaurantMenuView } from './App'
import { MealContextDetails } from './meal-context-ui'
import { mealContextPilotItems } from './meal-context-pilot'
import { filterRestaurantMenuItems, restaurantMenuItems } from './restaurants'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Meal context Pick Focus presentation', () => {
  let container: HTMLDivElement
  let root: Root
  const addOn = mealContextPilotItems[0]
  const complete = mealContextPilotItems[1]
  const noContext = mealContextPilotItems[2]

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('shows base nutrition, addition nutrition, total, and separate addition confidence in a restaurant Pick Focus card', () => {
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable={true} menuItems={[addOn]} />))
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick-header .random-button')?.click())

    const focus = container.querySelector('.menu-pick-card')
    expect(focus?.textContent).toContain('282')
    expect(focus?.textContent).toContain('39.5g')
    expect(focus?.textContent).toContain('Rice + miso soup (demo)')
    expect(focus?.textContent).toContain('+220')
    expect(focus?.textContent).toContain('~502')
    expect(focus?.textContent).toContain('Estimated')
    expect(focus?.textContent).toContain('฿299')
    expect(focus?.textContent).toContain('Price checked: 2026-09-15')
    expect(focus?.textContent).toContain('Nutrition checked: 2026-09-15')
    expect(focus?.querySelectorAll('.meal-context-details')).toHaveLength(1)
  })

  it('keeps complete-meal and no-context behavior explicit and progressive', () => {
    act(() => root.render(<div><MealContextDetails locale="en" item={complete} /><MealContextDetails locale="en" item={noContext} /></div>))
    const details = container.querySelectorAll('.meal-context-details')
    expect(details).toHaveLength(1)
    expect(details[0].textContent).toContain('Complete meal')
    expect(details[0].textContent).toContain('already represents the set')
    expect(details[0].textContent).not.toContain('~')
    expect(container.textContent).not.toContain('Price')
  })

  it('supports the same meal context in Explore Pick and preserves restaurant identity and handoff', () => {
    const onOpenRestaurant = () => undefined
    act(() => root.render(<ExploreView locale="en" onOpenRestaurant={onOpenRestaurant} favoriteIds={[]} onFavorite={() => undefined} storageAvailable={true} menuItems={[addOn]} />))
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick-header .random-button')?.click())

    const focus = container.querySelector('.menu-pick-card')
    expect(focus?.querySelector('.restaurant-identity')).not.toBeNull()
    expect(focus?.textContent).toContain('Rice + miso soup (demo)')
    expect(focus?.textContent).toContain('~502')
    expect(focus?.querySelector('.explore-view-restaurant')).not.toBeNull()
    expect(focus?.querySelector('.menu-favorite-toggle')).not.toBeNull()
  })

  it('keeps meal details out of normal Explore cards', () => {
    act(() => root.render(<ExploreView locale="en" onOpenRestaurant={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable={true} menuItems={mealContextPilotItems} />))
    expect(container.querySelectorAll('.menu-list .meal-context-details')).toHaveLength(0)
    expect(container.querySelectorAll('.menu-list .menu-item-row')).toHaveLength(3)
  })

  it('keeps search and filter eligibility based on base nutrition, not the calculated meal total', () => {
    expect(filterRestaurantMenuItems([addOn], { maxKcal: 300 })).toEqual([addOn])
    expect(filterRestaurantMenuItems([addOn], { maxKcal: 500 })).toEqual([addOn])
    expect(filterRestaurantMenuItems([addOn], { maxKcal: 280 })).toEqual([])
  })

  it('renders bilingual model copy', () => {
    act(() => root.render(<MealContextDetails locale="th" item={addOn} />))
    expect(container.textContent).toContain('รวมทั้งมื้อโดยประมาณ')
    expect(container.textContent).toContain('ข้อมูลราคา ณ วันที่ 2026-09-15')
    act(() => root.render(<MealContextDetails locale="en" item={addOn} />))
    expect(container.textContent).toContain('Estimated meal total')
    expect(container.textContent).toContain('Price checked: 2026-09-15')
  })

  it('renders researched Shima Hokke meal context in production Pick without claiming a price', () => {
    const shima = restaurantMenuItems.find(item => item.id === 'ootoya-shima-hokke-grilled')!
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable={true} menuItems={[shima]} />))
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick-header .random-button')?.click())

    const focus = container.querySelector('.menu-pick-card')
    expect(focus?.textContent).toContain('282')
    expect(focus?.textContent).toContain('39.5g')
    expect(focus?.textContent).toContain('+330')
    expect(focus?.textContent).toContain('~612')
    expect(focus?.textContent).toContain('Estimated')
    expect(focus?.textContent).not.toContain('฿')
    expect(focus?.querySelector('.meal-context-price')).toBeNull()
    expect(focus?.querySelector('.meal-context-total')).not.toBeNull()
  })

  it('renders researched complete Ootoya set with price and no double-counted total', () => {
    const tonteki = restaurantMenuItems.find(item => item.id === 'ootoya-tonteki-pork-chop-set')!
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable={true} menuItems={[tonteki]} />))
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick-header .random-button')?.click())

    const focus = container.querySelector('.menu-pick-card')
    expect(focus?.textContent).toContain('Complete set meal')
    expect(focus?.textContent).toContain('฿419')
    expect(focus?.textContent).toContain('Price checked: 2026-09-15')
    expect(focus?.textContent).not.toContain('~')
    expect(focus?.querySelector('.meal-context-total')).toBeNull()
  })

  it('keeps researched Santa Fe price visible in Explore Pick and supports favorite handoff', () => {
    const dory = restaurantMenuItems.find(item => item.id === 'santa-fe-dory-fish-steak')!
    const onOpenRestaurant = vi.fn()
    const onFavorite = vi.fn()
    act(() => root.render(<ExploreView locale="en" onOpenRestaurant={onOpenRestaurant} favoriteIds={[]} onFavorite={onFavorite} storageAvailable={true} menuItems={[dory]} />))
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick-header .random-button')?.click())

    const focus = container.querySelector('.menu-pick-card')
    expect(focus?.textContent).toContain('฿209')
    expect(focus?.textContent).toContain('Price checked: 2026-09-15')
    expect(focus?.querySelector('.meal-context-price')).not.toBeNull()
    expect(focus?.querySelector('.meal-context-total')).toBeNull()
    expect(focus?.textContent).not.toContain('Common meal')

    act(() => focus?.querySelector<HTMLButtonElement>('.menu-favorite-toggle')?.click())
    expect(onFavorite).toHaveBeenCalledWith(dory.id)
    act(() => focus?.querySelector<HTMLButtonElement>('.explore-view-restaurant')?.click())
    expect(onOpenRestaurant).toHaveBeenCalledWith('santa-fe-steak-thailand')
  })

  it('renders configurable Santa Fe context as base-only information with no fake total', () => {
    const salmon = restaurantMenuItems.find(item => item.id === 'santa-fe-salmon-steak')!
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="santa-fe-steak-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable={true} menuItems={[salmon]} />))
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick-header .random-button')?.click())

    const focus = container.querySelector('.menu-pick-card')
    expect(focus?.textContent).toContain('400')
    expect(focus?.textContent).toContain('32g')
    expect(focus?.textContent).toContain('Configurable meal')
    expect(focus?.textContent).toContain('Sides or sauce may vary by selection.')
    expect(focus?.textContent).toContain('Nutrition above refers to the base menu serving')
    expect(focus?.textContent).toContain('฿329')
    expect(focus?.textContent).toContain('Price checked: 2026-09-15')
    expect(focus?.querySelector('.meal-context-configurable')).not.toBeNull()
    expect(focus?.querySelector('.meal-context-addition')).toBeNull()
    expect(focus?.querySelector('.meal-context-total')).toBeNull()
  })

  it('renders configurable context in Thai and keeps it out of normal Explore cards', () => {
    const dory = restaurantMenuItems.find(item => item.id === 'santa-fe-dory-fish-steak')!
    act(() => root.render(<MealContextDetails locale="th" item={dory} />))
    expect(container.textContent).toContain('มื้อนี้ปรับเปลี่ยนได้')
    expect(container.textContent).toContain('เครื่องเคียงหรือซอสอาจแตกต่างตามที่เลือก')
    expect(container.textContent).toContain('สารอาหารด้านบนอ้างอิงจากเมนูหลัก')
    expect(container.textContent).not.toContain('รวมทั้งมื้อโดยประมาณ')

    act(() => root.render(<ExploreView locale="en" onOpenRestaurant={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable={true} menuItems={[dory]} />))
    expect(container.querySelectorAll('.explore-view .menu-list .meal-context-details')).toHaveLength(0)
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick-header .random-button')?.click())
    expect(container.querySelector('.menu-pick-card .meal-context-configurable')).not.toBeNull()
    expect(container.querySelector('.menu-pick-card .meal-context-total')).toBeNull()
  })
})
