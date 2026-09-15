// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ExploreView, RestaurantMenuView } from './App'
import { MealContextDetails } from './meal-context-ui'
import { mealContextPilotItems } from './meal-context-pilot'
import { filterRestaurantMenuItems } from './restaurants'

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
})
