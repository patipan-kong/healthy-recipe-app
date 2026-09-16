// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { menuCategoryLabel } from './i18n'
import { restaurantMenuItems, restaurants } from './restaurants'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Random Meal Restaurants flow (Slice 23)', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    window.localStorage.clear()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  function renderApp(randomValue = 0) {
    vi.spyOn(Math, 'random').mockReturnValue(randomValue)
    act(() => root.render(<App />))
  }

  function openRestaurants() {
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
  }

  function clickRandomMeal() {
    const button = container.querySelector<HTMLButtonElement>('.restaurant-meal-pick-trigger')
    if (!button) throw new Error('Missing Surprise me button')
    act(() => button.click())
  }

  function mealResult() {
    const result = container.querySelector<HTMLElement>('[data-random-meal-result="true"]')
    if (!result) throw new Error('Missing Random Meal result')
    return result
  }

  function chooseRandomMealIndex(index: number) {
    vi.mocked(Math.random).mockReturnValue((index + 0.25) / restaurantMenuItems.length)
  }

  it('exposes distinct Random Restaurant and Random Meal actions while keeping the list visible', () => {
    renderApp()
    openRestaurants()

    const restaurantButton = container.querySelector<HTMLButtonElement>('.restaurant-pick-trigger')
    const mealButton = container.querySelector<HTMLButtonElement>('.restaurant-meal-pick-trigger')
    expect(restaurantButton?.textContent).toContain('สุ่มร้านให้หน่อย')
    expect(mealButton?.textContent).toContain('สุ่มมื้อให้เลย')
    expect(restaurantButton).not.toBe(mealButton)
    expect(container.querySelector('.restaurant-pick')).not.toBeNull()
    expect(container.querySelector('.restaurant-meal-pick')).not.toBeNull()
    expect(container.querySelectorAll('.restaurant-row')).toHaveLength(restaurants.length)
  })

  it('shows one focal meal with ownership, nutrition, confidence, and no duplicated menu list', () => {
    renderApp()
    openRestaurants()
    clickRandomMeal()

    const result = mealResult()
    const item = restaurantMenuItems[0]
    const restaurant = restaurants.find(candidate => candidate.id === item.restaurantId)
    if (!restaurant) throw new Error('Fixture item needs a matching restaurant')

    expect(result.dataset.menuItemId).toBe(item.id)
    expect(result.dataset.restaurantId).toBe(restaurant.id)
    expect(result.querySelector('.restaurant-identity')).not.toBeNull()
    expect(result.querySelector('.menu-item-restaurant')?.textContent).toBe(restaurant.name.th)
    expect(result.querySelector('.card-category')?.textContent).toBe(menuCategoryLabel('th', item.category))
    expect(result.textContent).toContain(String(item.nutrition.kcal))
    expect(result.textContent).toContain(String(item.nutrition.protein))
    expect(result.textContent).toContain(String(item.nutrition.carbs))
    expect(result.textContent).toContain(String(item.nutrition.fat))
    expect(result.querySelector('.confidence-badge')).not.toBeNull()
    expect(container.querySelectorAll('.restaurant-view .menu-item-row')).toHaveLength(1)
    expect(container.querySelector('.restaurant-list .menu-item-row')).toBeNull()
    expect(container.querySelectorAll('.restaurant-row')).toHaveLength(restaurants.length)
  })

  it('changes the focal meal on Pick again and keeps both randomizers independent', () => {
    renderApp()
    openRestaurants()

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-pick-trigger')?.click())
    const firstRestaurant = container.querySelector('.restaurant-pick-card h3')?.textContent
    clickRandomMeal()
    const firstMealId = mealResult().dataset.menuItemId

    clickRandomMeal()
    const secondMealId = mealResult().dataset.menuItemId
    expect(secondMealId).not.toBe(firstMealId)
    expect(container.querySelector('.restaurant-pick-card h3')?.textContent).toBe(firstRestaurant)

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-pick-again')?.click())
    expect(container.querySelector('.restaurant-pick-card h3')?.textContent).not.toBe(firstRestaurant)
    expect(mealResult().dataset.menuItemId).toBe(secondMealId)
  })

  it('hands View restaurant to the correct menu and preserves normal local Pick behavior', () => {
    renderApp()
    openRestaurants()
    clickRandomMeal()
    const itemId = mealResult().dataset.menuItemId
    const item = restaurantMenuItems.find(candidate => candidate.id === itemId)
    if (!item) throw new Error('Random Meal result needs a matching item')
    const restaurant = restaurants.find(candidate => candidate.id === item.restaurantId)
    if (!restaurant) throw new Error('Fixture item needs a matching restaurant')

    const viewButton = mealResult().querySelector<HTMLButtonElement>('.explore-view-restaurant')
    if (!viewButton) throw new Error('Missing View restaurant button')
    act(() => viewButton.click())

    expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()
    expect(container.querySelector('.restaurant-heading h2')?.textContent).toBe(restaurant.name.th)
    expect(container.querySelector('.explore-view')).toBeNull()
    expect(container.querySelector('.explore-search-clear')).toBeNull()
    expect(container.querySelector('.menu-filter-panel')).toBeNull()

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-menu-view .menu-pick-header button')?.click())
    expect(container.querySelector('.restaurant-menu-view .menu-pick-card')).not.toBeNull()

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-back')?.click())
    expect(container.querySelector('.restaurant-view')).not.toBeNull()
  })

  it('uses shared restaurant-menu favorites from Random Meal through Favorites and back', () => {
    renderApp()
    openRestaurants()
    clickRandomMeal()
    const result = mealResult()
    const item = restaurantMenuItems[0]
    const favorite = result.querySelector<HTMLButtonElement>('.menu-favorite-toggle')
    if (!favorite) throw new Error('Missing Random Meal favorite button')

    expect(favorite.getAttribute('aria-pressed')).toBe('false')
    act(() => favorite.click())
    expect(favorite.getAttribute('aria-pressed')).toBe('true')
    expect(JSON.parse(window.localStorage.getItem('healthy-restaurant-menu-favorites-v1') ?? '[]')).toEqual([item.id])

    act(() => container.querySelector<HTMLButtonElement>('.icon-button')?.click())
    const favoriteRow = [...container.querySelectorAll<HTMLElement>('.menu-item-row')].find(row => row.querySelector('h3')?.textContent === item.name.th)
    expect(favoriteRow?.textContent).toContain(item.name.th)
    expect(favoriteRow?.textContent).toContain(restaurants.find(candidate => candidate.id === item.restaurantId)?.name.th ?? '')

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
    clickRandomMeal()
    expect(mealResult().querySelector<HTMLButtonElement>('.menu-favorite-toggle')?.getAttribute('aria-pressed')).toBe('true')
  })

  it('reflects a favorite created in Explore when the same item is later picked by Random Meal', () => {
    renderApp()
    act(() => container.querySelector<HTMLButtonElement>('.explore-nav')?.click())
    const exploreFavorite = container.querySelector<HTMLButtonElement>('.explore-view .menu-list .menu-favorite-toggle')
    if (!exploreFavorite) throw new Error('Missing Explore favorite button')
    act(() => exploreFavorite.click())

    openRestaurants()
    clickRandomMeal()
    expect(mealResult().dataset.menuItemId).toBe(restaurantMenuItems[0].id)
    expect(mealResult().querySelector<HTMLButtonElement>('.menu-favorite-toggle')?.getAttribute('aria-pressed')).toBe('true')
  })

  it('renders rich Random Meal metadata without inventing any missing fields', () => {
    const richItem = restaurantMenuItems.find(item => item.menuImage && item.price && item.mealContext)
    if (!richItem) throw new Error('Fixture needs a rich menu item')
    renderApp()
    chooseRandomMealIndex(restaurantMenuItems.indexOf(richItem))
    openRestaurants()
    clickRandomMeal()

    const result = mealResult()
    expect(result.dataset.menuItemId).toBe(richItem.id)
    expect(result.querySelector('.menu-item-image')).not.toBeNull()
    expect(result.querySelector('.meal-context-details')).not.toBeNull()
    expect(result.querySelector('.meal-context-price')).not.toBeNull()
    expect(result.textContent).toContain(String(richItem.price!.amount))
    expect(result.textContent).toContain(richItem.servingNote!.th)
  })

  it('renders a new Slice 24 image-backed item via Random Meal without any special-casing', () => {
    const slice24Item = restaurantMenuItems.find(item => item.id === 'mk-special-kurobuta-set')
    if (!slice24Item) throw new Error('Fixture needs the Slice 24 mk-special-kurobuta-set item')
    renderApp()
    chooseRandomMealIndex(restaurantMenuItems.indexOf(slice24Item))
    openRestaurants()
    clickRandomMeal()

    const result = mealResult()
    expect(result.dataset.menuItemId).toBe(slice24Item.id)
    const img = result.querySelector<HTMLImageElement>('.menu-item-image img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe(slice24Item.menuImage!.src)
  })

  it('keeps sparse Random Meal metadata natural without placeholders', () => {
    const sparseItem = restaurantMenuItems.find(item => !item.menuImage && !item.price && !item.mealContext)
    if (!sparseItem) throw new Error('Fixture needs a sparse menu item')
    renderApp()
    chooseRandomMealIndex(restaurantMenuItems.indexOf(sparseItem))
    openRestaurants()
    clickRandomMeal()

    const result = mealResult()
    expect(result.dataset.menuItemId).toBe(sparseItem.id)
    expect(result.querySelector('.menu-item-image')).toBeNull()
    expect(result.querySelector('.meal-context-details')).toBeNull()
    expect(result.textContent).not.toContain('ไม่มีภาพ')
    expect(result.textContent).not.toContain('No image')
    expect(result.textContent).not.toContain('ราคา')
    expect(result.textContent).not.toContain('Price')
  })

  it('localizes the two actions and focal result in English', () => {
    renderApp()
    act(() => container.querySelector<HTMLButtonElement>('.language-switcher button:last-child')?.click())
    openRestaurants()

    expect(container.querySelector('.restaurant-pick-trigger')?.textContent).toContain('Pick a restaurant')
    expect(container.querySelector('.restaurant-meal-pick-trigger')?.textContent).toContain('Surprise me')
    clickRandomMeal()
    expect(container.querySelector('.restaurant-meal-pick h3')?.textContent).toBe('Your random meal')
    expect(container.querySelector('.restaurant-meal-pick-trigger')?.textContent).toContain('Pick again')
    expect(container.querySelector<HTMLButtonElement>('.restaurant-meal-pick-trigger')?.getAttribute('aria-label')).toBe('Pick again')
    expect(mealResult().querySelector('.explore-view-restaurant')?.textContent).toContain('View ')
  })

  it('keeps Random Meal actions keyboard-reachable with meaningful favorite state', () => {
    renderApp()
    openRestaurants()
    clickRandomMeal()

    const result = mealResult()
    const buttons = [...result.querySelectorAll<HTMLButtonElement>('button')]
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    expect(buttons.every(button => button.tagName === 'BUTTON')).toBe(true)
    expect(result.querySelector('.restaurant-identity')?.getAttribute('aria-hidden')).toBe('true')
    const favorite = result.querySelector<HTMLButtonElement>('.menu-favorite-toggle')
    expect(favorite?.getAttribute('aria-label')).toContain(restaurantMenuItems[0].name.th)
    expect(favorite?.getAttribute('aria-pressed')).toBe('false')
    expect(result.parentElement?.getAttribute('aria-live')).toBe('polite')
  })
})
