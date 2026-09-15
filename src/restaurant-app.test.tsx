// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { restaurantMenuItems, restaurants, searchRestaurantMenuItems } from './restaurants'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Restaurant browsing flow', () => {
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

  function clickRestaurantsNav() {
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
  }

  function restaurantRow(name: string) {
    const row = [...container.querySelectorAll<HTMLElement>('.restaurant-row')].find(candidate => candidate.textContent?.includes(name))
    if (!row) throw new Error(`Missing restaurant row: ${name}`)
    return row
  }

  it('enters the restaurant section and lists every fixture restaurant', () => {
    expect(container.querySelector('.restaurant-view')).toBeNull()
    clickRestaurantsNav()
    expect(container.querySelector('.restaurant-nav')?.getAttribute('aria-pressed')).toBe('true')
    expect(container.querySelector('.restaurant-view')).not.toBeNull()
    const rows = container.querySelectorAll('.restaurant-row')
    expect(rows).toHaveLength(restaurants.length)
    for (const restaurant of restaurants) expect([...rows].some(row => row.textContent?.includes(restaurant.name.th))).toBe(true)
  })

  it('selects a restaurant and shows only that restaurant\'s menu items', () => {
    clickRestaurantsNav()
    const target = restaurants[0]
    const otherRestaurant = restaurants.find(candidate => candidate.id !== target.id)
    if (!otherRestaurant) throw new Error('Fixture needs at least two restaurants')
    const otherItem = restaurantMenuItems.find(item => item.restaurantId === otherRestaurant.id)
    if (!otherItem) throw new Error('Fixture needs at least one menu item for the other restaurant')
    act(() => restaurantRow(target.name.th).click())

    expect(container.querySelector('.restaurant-view')).toBeNull()
    expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()
    expect(container.querySelector('.restaurant-heading h2')?.textContent).toBe(target.name.th)

    const rows = container.querySelectorAll('.menu-item-row')
    const expectedItems = restaurantMenuItems.filter(item => item.restaurantId === target.id)
    expect(rows).toHaveLength(expectedItems.length)
    for (const item of expectedItems) expect([...rows].some(row => row.querySelector('h3')?.textContent === item.name.th)).toBe(true)
    expect([...rows].some(row => row.querySelector('h3')?.textContent === otherItem.name.th)).toBe(false)
  })

  it('returns to the restaurant list from a selected restaurant', () => {
    clickRestaurantsNav()
    act(() => restaurantRow(restaurants[0].name.th).click())
    expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-back')?.click())
    expect(container.querySelector('.restaurant-menu-view')).toBeNull()
    expect(container.querySelector('.restaurant-view')).not.toBeNull()
    expect(container.querySelectorAll('.restaurant-row')).toHaveLength(restaurants.length)
  })

  it('leaves the restaurant section via the nav toggle and returns to Browse', () => {
    clickRestaurantsNav()
    act(() => restaurantRow(restaurants[0].name.th).click())
    clickRestaurantsNav()
    expect(container.querySelector('.restaurant-view')).toBeNull()
    expect(container.querySelector('.restaurant-menu-view')).toBeNull()
    expect(container.querySelector('.recipe-grid')).not.toBeNull()
    expect(container.querySelector('.restaurant-nav')?.getAttribute('aria-pressed')).toBe('false')
  })

  it('surfaces each menu item\'s nutrition confidence badge, matching its actual source confidence', () => {
    clickRestaurantsNav()
    act(() => restaurantRow(restaurants[0].name.th).click())
    const expectedItems = restaurantMenuItems.filter(item => item.restaurantId === restaurants[0].id)
    const badges = container.querySelectorAll('.confidence-badge')
    expect(badges.length).toBeGreaterThan(0)
    expect(badges).toHaveLength(expectedItems.length)
    expect([...badges].every(badge => [...badge.classList].some(className => className.startsWith('confidence-')))).toBe(true)
    for (const item of expectedItems) expect(container.querySelector(`.confidence-${item.nutritionSource.confidence}`)).not.toBeNull()
  })

  function openMenuFilters() {
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-menu-nav .filter-button')?.click())
  }

  function setFilterField(label: string, value: string) {
    const input = [...container.querySelectorAll<HTMLElement>('.menu-filter-panel .field-label')]
      .find(field => field.textContent?.startsWith(label))
      ?.querySelector('input')
    if (!input) throw new Error(`Missing filter field: ${label}`)
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
    act(() => {
      setter.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  it('narrows the visible menu items to those matching an active max-kcal filter', () => {
    clickRestaurantsNav()
    const target = restaurants.find(candidate => restaurantMenuItems.some(item => item.restaurantId === candidate.id && item.nutrition.kcal <= 400) && restaurantMenuItems.some(item => item.restaurantId === candidate.id && item.nutrition.kcal > 400))
    if (!target) throw new Error('Fixture needs a restaurant with both low- and high-kcal items for this test')
    act(() => restaurantRow(target.name.th).click())
    openMenuFilters()
    setFilterField('แคลอรีสูงสุด', '400')

    const expectedItems = restaurantMenuItems.filter(item => item.restaurantId === target.id && item.nutrition.kcal <= 400)
    const excludedItems = restaurantMenuItems.filter(item => item.restaurantId === target.id && item.nutrition.kcal > 400)
    const rows = container.querySelectorAll('.menu-item-row')
    expect(rows).toHaveLength(expectedItems.length)
    for (const item of expectedItems) expect([...rows].some(row => row.querySelector('h3')?.textContent === item.name.th)).toBe(true)
    for (const item of excludedItems) expect([...rows].some(row => row.querySelector('h3')?.textContent === item.name.th)).toBe(false)
  })

  it('clears active menu filters and restores every item for the restaurant', () => {
    clickRestaurantsNav()
    act(() => restaurantRow(restaurants[0].name.th).click())
    const expectedTotal = restaurantMenuItems.filter(item => item.restaurantId === restaurants[0].id).length
    openMenuFilters()
    setFilterField('แคลอรีสูงสุด', '1')
    expect(container.querySelectorAll('.menu-item-row').length).toBeLessThan(expectedTotal)

    act(() => container.querySelector<HTMLButtonElement>('.menu-filter-panel .text-button')?.click())
    expect(container.querySelectorAll('.menu-item-row')).toHaveLength(expectedTotal)
  })

  it('resets menu filters when switching to a different restaurant', () => {
    clickRestaurantsNav()
    const target = restaurants[0]
    const other = restaurants.find(candidate => candidate.id !== target.id)
    if (!other) throw new Error('Fixture needs at least two restaurants')
    act(() => restaurantRow(target.name.th).click())
    openMenuFilters()
    setFilterField('แคลอรีสูงสุด', '1')
    expect(container.querySelector('.menu-filter-panel')).not.toBeNull()

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-back')?.click())
    act(() => restaurantRow(other.name.th).click())
    expect(container.querySelector('.menu-filter-panel')).toBeNull()
    const expectedTotal = restaurantMenuItems.filter(item => item.restaurantId === other.id).length
    expect(container.querySelectorAll('.menu-item-row')).toHaveLength(expectedTotal)
  })

  function pickButton() {
    const button = container.querySelector<HTMLButtonElement>('.menu-pick-header button')
    if (!button) throw new Error('Missing Pick for me button')
    return button
  }

  function clickPick() {
    act(() => pickButton().click())
  }

  function pickedName() {
    return container.querySelector('.menu-pick-card h3')?.textContent
  }

  it('picks a menu item from the selected restaurant and shows a highlighted result card', () => {
    clickRestaurantsNav()
    const target = restaurants.find(candidate => restaurantMenuItems.filter(item => item.restaurantId === candidate.id).length >= 3)
    if (!target) throw new Error('Fixture needs a restaurant with at least three menu items')
    act(() => restaurantRow(target.name.th).click())
    const eligibleNames = restaurantMenuItems.filter(item => item.restaurantId === target.id).map(item => item.name.th)

    expect(container.querySelector('.menu-pick-card')).toBeNull()
    expect(pickButton().textContent).toContain('สุ่มเลือกให้')
    clickPick()

    expect(pickedName()).toBeTruthy()
    expect(eligibleNames).toContain(pickedName())
    expect(pickButton().textContent).toContain('สุ่มใหม่')
    expect(container.querySelector('.menu-pick-card .confidence-badge')).not.toBeNull()
  })

  it('never repeats the same item on consecutive picks when more than one item is eligible', () => {
    clickRestaurantsNav()
    const target = restaurants.find(candidate => restaurantMenuItems.filter(item => item.restaurantId === candidate.id).length >= 3)
    if (!target) throw new Error('Fixture needs a restaurant with at least three menu items')
    act(() => restaurantRow(target.name.th).click())

    let previous: string | null | undefined = null
    for (let i = 0; i < 12; i++) {
      clickPick()
      const current = pickedName()
      expect(current).toBeTruthy()
      if (previous !== null) expect(current).not.toBe(previous)
      previous = current
    }
  })

  it('keeps returning the same item when filtering narrows the pool to exactly one', () => {
    clickRestaurantsNav()
    const target = restaurants.find(candidate => restaurantMenuItems.filter(item => item.restaurantId === candidate.id).length >= 3)
    if (!target) throw new Error('Fixture needs a restaurant with at least three menu items')
    act(() => restaurantRow(target.name.th).click())
    const soleSurvivor = restaurantMenuItems.filter(item => item.restaurantId === target.id).reduce((lowest, item) => item.nutrition.kcal < lowest.nutrition.kcal ? item : lowest)
    openMenuFilters()
    setFilterField('แคลอรีสูงสุด', String(soleSurvivor.nutrition.kcal))
    expect(container.querySelectorAll('.menu-item-row')).toHaveLength(1)

    for (let i = 0; i < 3; i++) {
      clickPick()
      expect(pickedName()).toBe(soleSurvivor.name.th)
    }
  })

  it('disables Pick for me and shows no-match copy when no items pass the active filters', () => {
    clickRestaurantsNav()
    act(() => restaurantRow(restaurants[0].name.th).click())
    openMenuFilters()
    setFilterField('แคลอรีสูงสุด', '1')

    expect(container.querySelectorAll('.menu-item-row')).toHaveLength(0)
    expect(pickButton().disabled).toBe(true)
    expect(container.querySelector('.menu-pick-empty')?.textContent).toBe('ไม่มีเมนูที่ตรงกับตัวกรองให้สุ่มเลือก')
  })

  it('clears an existing pick once it falls outside the active filters', () => {
    clickRestaurantsNav()
    const target = restaurants.find(candidate => restaurantMenuItems.filter(item => item.restaurantId === candidate.id).length >= 3)
    if (!target) throw new Error('Fixture needs a restaurant with at least three menu items')
    act(() => restaurantRow(target.name.th).click())
    clickPick()
    expect(pickedName()).toBeTruthy()

    openMenuFilters()
    setFilterField('แคลอรีสูงสุด', '1')
    expect(container.querySelector('.menu-pick-card')).toBeNull()
  })

  it('clears the picked result and repetition state when switching restaurants', () => {
    clickRestaurantsNav()
    const target = restaurants[0]
    const other = restaurants.find(candidate => candidate.id !== target.id)
    if (!other) throw new Error('Fixture needs at least two restaurants')
    act(() => restaurantRow(target.name.th).click())
    clickPick()
    expect(pickedName()).toBeTruthy()

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-back')?.click())
    act(() => restaurantRow(other.name.th).click())
    expect(container.querySelector('.menu-pick-card')).toBeNull()
    expect(pickButton().textContent).toContain('สุ่มเลือกให้')
  })
})

describe('Cross-restaurant explore flow', () => {
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

  function clickExploreNav() {
    act(() => container.querySelector<HTMLButtonElement>('.explore-nav')?.click())
  }

  function exploreRows() {
    return container.querySelectorAll<HTMLElement>('.explore-view .menu-list .menu-item-row')
  }

  function openExploreFilters() {
    act(() => container.querySelector<HTMLButtonElement>('.explore-view .restaurant-menu-nav .filter-button')?.click())
  }

  function setExploreFilterField(label: string, value: string) {
    const input = [...container.querySelectorAll<HTMLElement>('.explore-view .menu-filter-panel .field-label')]
      .find(field => field.textContent?.startsWith(label))
      ?.querySelector('input')
    if (!input) throw new Error(`Missing filter field: ${label}`)
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
    act(() => {
      setter.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  function explorePickButton() {
    const button = container.querySelector<HTMLButtonElement>('.explore-view .menu-pick-header button')
    if (!button) throw new Error('Missing Pick for me button')
    return button
  }

  function clickExplorePick() {
    act(() => explorePickButton().click())
  }

  function explorePickedName() {
    return container.querySelector('.explore-view .menu-pick-card h3')?.textContent
  }

  it('shows an Explore navigation entry', () => {
    const nav = container.querySelector('.explore-nav')
    expect(nav).not.toBeNull()
    expect(nav?.textContent).toContain('หาเมนู')
  })

  it('shows every production menu item from multiple restaurants without requiring a restaurant selection first', () => {
    clickExploreNav()
    expect(container.querySelector('.explore-view')).not.toBeNull()
    const rows = exploreRows()
    expect(rows).toHaveLength(restaurantMenuItems.length)
    const restaurantNamesShown = new Set([...rows].map(row => row.querySelector('.menu-item-restaurant')?.textContent))
    expect(restaurantNamesShown.size).toBeGreaterThan(1)
  })

  it('identifies the restaurant on every visible result', () => {
    clickExploreNav()
    const rows = exploreRows()
    expect(rows.length).toBeGreaterThan(0)
    for (const item of restaurantMenuItems) {
      const restaurant = restaurants.find(candidate => candidate.id === item.restaurantId)
      const row = [...rows].find(candidate => candidate.querySelector('h3')?.textContent === item.name.th)
      expect(row?.querySelector('.menu-item-restaurant')?.textContent).toBe(restaurant?.name.th)
    }
  })

  it('filters matching items down by max kcal across every restaurant', () => {
    clickExploreNav()
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '400')

    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.kcal <= 400)
    const excludedItems = restaurantMenuItems.filter(item => item.nutrition.kcal > 400)
    expect(expectedItems.length).toBeGreaterThan(0)
    expect(excludedItems.length).toBeGreaterThan(0)
    const rows = exploreRows()
    expect(rows).toHaveLength(expectedItems.length)
    for (const item of expectedItems) expect([...rows].some(row => row.querySelector('h3')?.textContent === item.name.th)).toBe(true)
    for (const item of excludedItems) expect([...rows].some(row => row.querySelector('h3')?.textContent === item.name.th)).toBe(false)
  })

  it('filters matching items down by min protein across every restaurant', () => {
    clickExploreNav()
    openExploreFilters()
    setExploreFilterField('โปรตีนขั้นต่ำ', '30')

    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.protein >= 30)
    expect(expectedItems.length).toBeGreaterThan(0)
    expect(expectedItems.length).toBeLessThan(restaurantMenuItems.length)
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('combines active filters with AND semantics across restaurants', () => {
    clickExploreNav()
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '400')
    setExploreFilterField('โปรตีนขั้นต่ำ', '30')

    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.kcal <= 400 && item.nutrition.protein >= 30)
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('updates the visible match count as filters change', () => {
    clickExploreNav()
    const initialCount = container.querySelector('.explore-result-count')?.textContent
    expect(initialCount).toContain(String(restaurantMenuItems.length))
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '400')
    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.kcal <= 400)
    expect(container.querySelector('.explore-result-count')?.textContent).toContain(String(expectedItems.length))
  })

  it('shows the zero-result state with a Clear filters action when nothing matches', () => {
    clickExploreNav()
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '1')

    expect(exploreRows()).toHaveLength(0)
    expect(container.querySelector('.explore-view .restaurant-empty')).not.toBeNull()
    expect(explorePickButton().disabled).toBe(true)
  })

  it('restores every item when filters are cleared', () => {
    clickExploreNav()
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '1')
    expect(exploreRows()).toHaveLength(0)

    act(() => container.querySelector<HTMLButtonElement>('.explore-view .restaurant-empty .random-button')?.click())
    expect(exploreRows()).toHaveLength(restaurantMenuItems.length)
  })

  it('picks only from the currently matching cross-restaurant results', () => {
    clickExploreNav()
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '400')
    const eligibleNames = restaurantMenuItems.filter(item => item.nutrition.kcal <= 400).map(item => item.name.th)

    clickExplorePick()
    expect(eligibleNames).toContain(explorePickedName())
  })

  it('avoids repeating the same pick on consecutive Pick again clicks when more than one item is eligible', () => {
    clickExploreNav()
    let previous: string | null | undefined = null
    for (let i = 0; i < 12; i++) {
      clickExplorePick()
      const current = explorePickedName()
      expect(current).toBeTruthy()
      if (previous !== null) expect(current).not.toBe(previous)
      previous = current
    }
  })

  it('clears an existing pick once filtering excludes it', () => {
    clickExploreNav()
    clickExplorePick()
    expect(explorePickedName()).toBeTruthy()

    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '1')
    expect(container.querySelector('.explore-view .menu-pick-card')).toBeNull()
  })

  it('shows a nutrition-confidence label on every result and on the pick', () => {
    clickExploreNav()
    const rows = exploreRows()
    expect(rows.length).toBeGreaterThan(0)
    expect([...rows].every(row => row.querySelector('.confidence-badge'))).toBe(true)

    clickExplorePick()
    expect(container.querySelector('.explore-view .menu-pick-card .confidence-badge')).not.toBeNull()
  })

  it('opens the correct restaurant-local menu from a View restaurant link', () => {
    clickExploreNav()
    const targetItem = restaurantMenuItems[0]
    const targetRestaurant = restaurants.find(candidate => candidate.id === targetItem.restaurantId)
    if (!targetRestaurant) throw new Error('Fixture item needs a matching restaurant')
    const row = [...exploreRows()].find(candidate => candidate.querySelector('h3')?.textContent === targetItem.name.th)
    const viewButton = row?.querySelector<HTMLButtonElement>('.explore-view-restaurant')
    if (!viewButton) throw new Error('Missing View restaurant button')

    act(() => viewButton.click())
    expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()
    expect(container.querySelector('.explore-view')).toBeNull()
    expect(container.querySelector('.restaurant-heading h2')?.textContent).toBe(targetRestaurant.name.th)
  })

  it('does not leak Explore filter state into the restaurant-local filter state', () => {
    clickExploreNav()
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '1')
    expect(exploreRows()).toHaveLength(0)

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
    act(() => [...container.querySelectorAll<HTMLElement>('.restaurant-row')].find(row => row.textContent?.includes(restaurants[0].name.th))?.click())
    const expectedTotal = restaurantMenuItems.filter(item => item.restaurantId === restaurants[0].id).length
    expect(container.querySelectorAll('.menu-item-row')).toHaveLength(expectedTotal)
    expect(container.querySelector('.menu-filter-panel')).toBeNull()
  })

  it('leaves existing restaurant browse and menu behavior functional alongside Explore', () => {
    clickExploreNav()
    expect(container.querySelector('.explore-view')).not.toBeNull()

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
    expect(container.querySelector('.restaurant-view')).not.toBeNull()
    expect(container.querySelector('.explore-view')).toBeNull()
    const rows = container.querySelectorAll('.restaurant-row')
    expect(rows).toHaveLength(restaurants.length)
  })
})

describe('Explore quick nutrition goals', () => {
  let container: HTMLDivElement
  let root: Root

  const HIGH_PROTEIN = 'โปรตีนสูง'
  const LIGHT_MEAL = 'มื้อเบา ๆ'
  const BALANCED = 'สมดุล'

  beforeEach(() => {
    window.localStorage.clear()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<App />))
    act(() => container.querySelector<HTMLButtonElement>('.explore-nav')?.click())
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function presetChip(label: string) {
    const chip = [...container.querySelectorAll<HTMLButtonElement>('.explore-preset-chip')].find(candidate => candidate.textContent?.includes(label))
    if (!chip) throw new Error(`Missing preset chip: ${label}`)
    return chip
  }

  function clickPreset(label: string) {
    act(() => presetChip(label).click())
  }

  function exploreRows() {
    return container.querySelectorAll<HTMLElement>('.explore-view .menu-list .menu-item-row')
  }

  function openExploreFilters() {
    act(() => container.querySelector<HTMLButtonElement>('.explore-view .restaurant-menu-nav .filter-button')?.click())
  }

  function filterField(label: string) {
    const input = [...container.querySelectorAll<HTMLElement>('.explore-view .menu-filter-panel .field-label')]
      .find(field => field.textContent?.startsWith(label))
      ?.querySelector<HTMLInputElement>('input')
    if (!input) throw new Error(`Missing filter field: ${label}`)
    return input
  }

  function setExploreFilterField(label: string, value: string) {
    const input = filterField(label)
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
    act(() => {
      setter.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  function explorePickButton() {
    const button = container.querySelector<HTMLButtonElement>('.explore-view .menu-pick-header button')
    if (!button) throw new Error('Missing Pick for me button')
    return button
  }

  function clickExplorePick() {
    act(() => explorePickButton().click())
  }

  function explorePickedName() {
    return container.querySelector('.explore-view .menu-pick-card h3')?.textContent
  }

  it('shows quick-goal preset controls in Explore', () => {
    expect(container.querySelector('.explore-presets')).not.toBeNull()
    expect(presetChip(HIGH_PROTEIN)).toBeTruthy()
    expect(presetChip(LIGHT_MEAL)).toBeTruthy()
    expect(presetChip(BALANCED)).toBeTruthy()
  })

  it('selecting High Protein sets max kcal 700 / min protein 30 and updates results', () => {
    clickPreset(HIGH_PROTEIN)
    openExploreFilters()
    expect(filterField('แคลอรีสูงสุด').value).toBe('700')
    expect(filterField('โปรตีนขั้นต่ำ').value).toBe('30')
    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.kcal <= 700 && item.nutrition.protein >= 30)
    expect(exploreRows()).toHaveLength(expectedItems.length)
    expect(presetChip(HIGH_PROTEIN).getAttribute('aria-pressed')).toBe('true')
  })

  it('selecting Light Meal sets max kcal 450 only and updates results', () => {
    clickPreset(LIGHT_MEAL)
    openExploreFilters()
    expect(filterField('แคลอรีสูงสุด').value).toBe('450')
    expect(filterField('โปรตีนขั้นต่ำ').value).toBe('')
    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.kcal <= 450)
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('selecting Balanced sets max kcal 650 / min protein 25 / max fat 25 and updates results', () => {
    clickPreset(BALANCED)
    openExploreFilters()
    expect(filterField('แคลอรีสูงสุด').value).toBe('650')
    expect(filterField('โปรตีนขั้นต่ำ').value).toBe('25')
    expect(filterField('ไขมันสูงสุด').value).toBe('25')
    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.kcal <= 650 && item.nutrition.protein >= 25 && item.nutrition.fat <= 25)
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('replaces the previous preset\'s values when a different preset is selected', () => {
    clickPreset(HIGH_PROTEIN)
    clickPreset(LIGHT_MEAL)
    openExploreFilters()
    expect(filterField('แคลอรีสูงสุด').value).toBe('450')
    expect(filterField('โปรตีนขั้นต่ำ').value).toBe('')
    expect(presetChip(LIGHT_MEAL).getAttribute('aria-pressed')).toBe('true')
    expect(presetChip(HIGH_PROTEIN).getAttribute('aria-pressed')).toBe('false')
  })

  it('switches to Custom once a preset-provided filter value is manually changed', () => {
    clickPreset(HIGH_PROTEIN)
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '600')
    expect(presetChip(HIGH_PROTEIN).getAttribute('aria-pressed')).toBe('false')
    expect(container.querySelector('.explore-preset-custom')?.textContent).toBe('กำหนดเอง')
  })

  it('preserves manually entered values while in the Custom state', () => {
    clickPreset(HIGH_PROTEIN)
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '600')
    expect(filterField('แคลอรีสูงสุด').value).toBe('600')
    expect(filterField('โปรตีนขั้นต่ำ').value).toBe('30')
    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.kcal <= 600 && item.nutrition.protein >= 30)
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('clears the active preset state when filters are cleared', () => {
    clickPreset(BALANCED)
    openExploreFilters()
    act(() => container.querySelector<HTMLButtonElement>('.menu-filter-panel .text-button')?.click())
    expect(presetChip(BALANCED).getAttribute('aria-pressed')).toBe('false')
    expect(container.querySelector('.explore-preset-custom')).toBeNull()
    expect(exploreRows()).toHaveLength(restaurantMenuItems.length)
  })

  it('updates the match count when a preset is selected', () => {
    const before = container.querySelector('.explore-result-count')?.textContent
    expect(before).toContain(String(restaurantMenuItems.length))
    clickPreset(LIGHT_MEAL)
    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.kcal <= 450)
    expect(container.querySelector('.explore-result-count')?.textContent).toContain(String(expectedItems.length))
  })

  it('Pick for me only selects from the preset-filtered pool', () => {
    clickPreset(HIGH_PROTEIN)
    const eligibleNames = restaurantMenuItems.filter(item => item.nutrition.kcal <= 700 && item.nutrition.protein >= 30).map(item => item.name.th)
    clickExplorePick()
    expect(eligibleNames).toContain(explorePickedName())
  })

  it('invalidates an existing pick that no longer matches after switching to an incompatible preset', () => {
    clickPreset(LIGHT_MEAL)
    let picked: string | null | undefined
    let pickedItem: typeof restaurantMenuItems[number] | undefined
    for (let i = 0; i < 30 && (!pickedItem || pickedItem.nutrition.protein >= 30); i++) {
      clickExplorePick()
      picked = explorePickedName()
      pickedItem = restaurantMenuItems.find(item => item.name.th === picked)
    }
    if (!pickedItem || pickedItem.nutrition.protein >= 30) throw new Error('Could not land on a Light Meal item with protein below 30 within 30 picks')

    clickPreset(HIGH_PROTEIN)
    expect(container.querySelector('.explore-view .menu-pick-card')).toBeNull()
  })

  it('never sets sodium when selecting any preset', () => {
    openExploreFilters()
    for (const label of [HIGH_PROTEIN, LIGHT_MEAL, BALANCED]) {
      clickPreset(label)
      expect(filterField('โซเดียมสูงสุด').value).toBe('')
    }
  })

  it('keeps manual filter controls fully usable without a preset selected', () => {
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '400')
    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.kcal <= 400)
    expect(exploreRows()).toHaveLength(expectedItems.length)
    expect(container.querySelector('.explore-preset-custom')?.textContent).toBe('กำหนดเอง')
  })

  it('does not affect restaurant-local filters when a preset is selected in Explore', () => {
    clickPreset(HIGH_PROTEIN)
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
    act(() => [...container.querySelectorAll<HTMLElement>('.restaurant-row')].find(row => row.textContent?.includes(restaurants[0].name.th))?.click())
    expect(container.querySelector('.menu-filter-panel')).toBeNull()
    const expectedTotal = restaurantMenuItems.filter(item => item.restaurantId === restaurants[0].id).length
    expect(container.querySelectorAll('.menu-item-row')).toHaveLength(expectedTotal)
  })

  it('still hands off correctly to the restaurant-local menu view while a preset is active', () => {
    clickPreset(LIGHT_MEAL)
    const targetItem = restaurantMenuItems.find(item => item.nutrition.kcal <= 450)
    if (!targetItem) throw new Error('Fixture needs a Light Meal-eligible item')
    const targetRestaurant = restaurants.find(candidate => candidate.id === targetItem.restaurantId)
    if (!targetRestaurant) throw new Error('Fixture item needs a matching restaurant')
    const row = [...exploreRows()].find(candidate => candidate.querySelector('h3')?.textContent === targetItem.name.th)
    const viewButton = row?.querySelector<HTMLButtonElement>('.explore-view-restaurant')
    if (!viewButton) throw new Error('Missing View restaurant button')

    act(() => viewButton.click())
    expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()
    expect(container.querySelector('.restaurant-heading h2')?.textContent).toBe(targetRestaurant.name.th)
  })
})

describe('Restaurant menu favorites', () => {
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

  function clickRestaurantsNav() {
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
  }

  function clickExploreNav() {
    act(() => container.querySelector<HTMLButtonElement>('.explore-nav')?.click())
  }

  function clickFavoritesNav() {
    act(() => container.querySelector<HTMLButtonElement>('.icon-button')?.click())
  }

  function restaurantRow(name: string) {
    const row = [...container.querySelectorAll<HTMLElement>('.restaurant-row')].find(candidate => candidate.textContent?.includes(name))
    if (!row) throw new Error(`Missing restaurant row: ${name}`)
    return row
  }

  function menuRowByName(name: string) {
    const row = [...container.querySelectorAll<HTMLElement>('.menu-item-row')].find(candidate => candidate.querySelector('h3')?.textContent === name)
    if (!row) throw new Error(`Missing menu item row: ${name}`)
    return row
  }

  function favoriteToggleIn(row: HTMLElement) {
    const button = row.querySelector<HTMLButtonElement>('.menu-favorite-toggle')
    if (!button) throw new Error('Missing menu favorite toggle button')
    return button
  }

  function clickPick(scope: '.restaurant-menu-view' | '.explore-view') {
    const button = container.querySelector<HTMLButtonElement>(`${scope} .menu-pick-header button`)
    if (!button) throw new Error('Missing Pick for me button')
    act(() => button.click())
  }

  it('shows a favorite toggle button on every restaurant menu list row, initially unfavorited', () => {
    clickRestaurantsNav()
    act(() => restaurantRow(restaurants[0].name.th).click())
    const rows = container.querySelectorAll('.menu-item-row')
    const expectedTotal = restaurantMenuItems.filter(item => item.restaurantId === restaurants[0].id).length
    expect(rows).toHaveLength(expectedTotal)
    for (const row of rows) {
      const toggle = favoriteToggleIn(row as HTMLElement)
      expect(toggle.getAttribute('aria-pressed')).toBe('false')
      expect(toggle.tagName).toBe('BUTTON')
    }
  })

  it('toggles a restaurant menu item as favorite from the menu list without navigating away', () => {
    clickRestaurantsNav()
    act(() => restaurantRow(restaurants[0].name.th).click())
    const target = restaurantMenuItems.find(item => item.restaurantId === restaurants[0].id)
    if (!target) throw new Error('Fixture needs at least one menu item')
    const toggle = favoriteToggleIn(menuRowByName(target.name.th))

    act(() => toggle.click())
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
    expect(toggle.classList.contains('saved')).toBe(true)
    expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()

    act(() => toggle.click())
    expect(toggle.getAttribute('aria-pressed')).toBe('false')
  })

  it('toggles a favorite from the restaurant-local Pick for me result', () => {
    clickRestaurantsNav()
    const target = restaurants.find(candidate => restaurantMenuItems.filter(item => item.restaurantId === candidate.id).length >= 1)
    if (!target) throw new Error('Fixture needs a restaurant with at least one item')
    act(() => restaurantRow(target.name.th).click())
    clickPick('.restaurant-menu-view')
    const pickCard = container.querySelector<HTMLElement>('.restaurant-menu-view .menu-pick-card')
    if (!pickCard) throw new Error('Missing pick card')
    const toggle = favoriteToggleIn(pickCard)

    act(() => toggle.click())
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
  })

  it('shows a favorite toggle button on every Explore result card and the Explore pick result', () => {
    clickExploreNav()
    const rows = container.querySelectorAll('.explore-view .menu-list .menu-item-row')
    expect(rows).toHaveLength(restaurantMenuItems.length)
    for (const row of rows) expect(favoriteToggleIn(row as HTMLElement).getAttribute('aria-pressed')).toBe('false')

    clickPick('.explore-view')
    const pickCard = container.querySelector<HTMLElement>('.explore-view .menu-pick-card')
    if (!pickCard) throw new Error('Missing Explore pick card')
    expect(favoriteToggleIn(pickCard).getAttribute('aria-pressed')).toBe('false')
  })

  it('keeps favorite state synchronized between Explore and the restaurant-local menu for the same item', () => {
    clickExploreNav()
    const targetItem = restaurantMenuItems[0]
    const targetRestaurant = restaurants.find(candidate => candidate.id === targetItem.restaurantId)
    if (!targetRestaurant) throw new Error('Fixture item needs a matching restaurant')
    const exploreRow = menuRowByName(targetItem.name.th)
    act(() => favoriteToggleIn(exploreRow).click())
    expect(favoriteToggleIn(exploreRow).getAttribute('aria-pressed')).toBe('true')

    const viewButton = exploreRow.querySelector<HTMLButtonElement>('.explore-view-restaurant')
    if (!viewButton) throw new Error('Missing View restaurant button')
    act(() => viewButton.click())
    expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()

    const localRow = menuRowByName(targetItem.name.th)
    const localToggle = favoriteToggleIn(localRow)
    expect(localToggle.getAttribute('aria-pressed')).toBe('true')

    act(() => localToggle.click())
    expect(localToggle.getAttribute('aria-pressed')).toBe('false')

    clickExploreNav()
    const exploreRowAgain = menuRowByName(targetItem.name.th)
    expect(favoriteToggleIn(exploreRowAgain).getAttribute('aria-pressed')).toBe('false')
  })

  it('reflects a restaurant-local favorite inside the Favorites screen restaurant menus section, with required fields', () => {
    clickRestaurantsNav()
    const target = restaurantMenuItems[0]
    const targetRestaurant = restaurants.find(candidate => candidate.id === target.restaurantId)
    if (!targetRestaurant) throw new Error('Fixture item needs a matching restaurant')
    act(() => restaurantRow(targetRestaurant.name.th).click())
    act(() => favoriteToggleIn(menuRowByName(target.name.th)).click())

    clickFavoritesNav()
    expect(container.querySelector('h2')?.textContent).toBe('รายการโปรด')
    const card = menuRowByName(target.name.th)
    expect(card.textContent).toContain(targetRestaurant.name.th)
    expect(card.textContent).toContain(String(target.nutrition.kcal))
    expect(card.textContent).toContain(String(target.nutrition.protein))
    expect(card.querySelector('.confidence-badge')).not.toBeNull()
    expect(card.querySelector('.explore-view-restaurant')).not.toBeNull()
  })

  it('removes a restaurant-menu favorite directly from the Favorites screen without confirmation, disappearing immediately', () => {
    clickRestaurantsNav()
    const target = restaurantMenuItems[0]
    const targetRestaurant = restaurants.find(candidate => candidate.id === target.restaurantId)
    if (!targetRestaurant) throw new Error('Fixture item needs a matching restaurant')
    act(() => restaurantRow(targetRestaurant.name.th).click())
    act(() => favoriteToggleIn(menuRowByName(target.name.th)).click())

    clickFavoritesNav()
    const card = menuRowByName(target.name.th)
    act(() => favoriteToggleIn(card).click())
    expect([...container.querySelectorAll('.menu-item-row')].some(row => row.querySelector('h3')?.textContent === target.name.th)).toBe(false)
    expect(container.querySelector('.empty-restaurant-favorites')?.textContent).toBe('ยังไม่มีเมนูร้านอาหารที่บันทึกไว้')
  })

  it('navigates to the correct restaurant with reset filters via View restaurant from the Favorites screen', () => {
    clickExploreNav()
    const target = restaurantMenuItems[0]
    const targetRestaurant = restaurants.find(candidate => candidate.id === target.restaurantId)
    if (!targetRestaurant) throw new Error('Fixture item needs a matching restaurant')
    act(() => favoriteToggleIn(menuRowByName(target.name.th)).click())

    clickFavoritesNav()
    const card = menuRowByName(target.name.th)
    const viewButton = card.querySelector<HTMLButtonElement>('.explore-view-restaurant')
    if (!viewButton) throw new Error('Missing View restaurant button')
    act(() => viewButton.click())

    expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()
    expect(container.querySelector('.restaurant-heading h2')?.textContent).toBe(targetRestaurant.name.th)
    expect(container.querySelector('.menu-filter-panel')).toBeNull()
    const expectedTotal = restaurantMenuItems.filter(item => item.restaurantId === targetRestaurant.id).length
    expect(container.querySelectorAll('.menu-item-row')).toHaveLength(expectedTotal)
  })

  it('shows independent empty states for the Recipes and Restaurant menus sections on Favorites', () => {
    clickFavoritesNav()
    expect(container.querySelector('.empty h3')?.textContent).toBe('ยังไม่มีเมนูโปรด')
    expect(container.querySelector('.empty-restaurant-favorites')?.textContent).toBe('ยังไม่มีเมนูร้านอาหารที่บันทึกไว้')

    act(() => container.querySelector<HTMLButtonElement>('.text-button')?.click())
    act(() => container.querySelector<HTMLButtonElement>('.recipe-card .heart')?.click())
    clickFavoritesNav()
    expect(container.querySelector('.recipe-grid')).not.toBeNull()
    expect(container.querySelector('.empty-restaurant-favorites')?.textContent).toBe('ยังไม่มีเมนูร้านอาหารที่บันทึกไว้')
  })

  it('does not persist full menu item objects, only ids, and keeps a separate storage key from recipe favorites', () => {
    clickRestaurantsNav()
    const target = restaurantMenuItems[0]
    const targetRestaurant = restaurants.find(candidate => candidate.id === target.restaurantId)
    if (!targetRestaurant) throw new Error('Fixture item needs a matching restaurant')
    act(() => restaurantRow(targetRestaurant.name.th).click())
    act(() => favoriteToggleIn(menuRowByName(target.name.th)).click())

    const raw = window.localStorage.getItem('healthy-restaurant-menu-favorites-v1')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toEqual([target.id])
    expect(JSON.parse(window.localStorage.getItem('healthy-recipe-favorites-v1') ?? '[]')).toEqual([])
    expect(container.querySelector('.icon-button i')?.textContent).toBe('')
  })

  it('ignores a stale restaurant-menu favorite id from storage at initialization without crashing', () => {
    window.localStorage.setItem('healthy-restaurant-menu-favorites-v1', JSON.stringify([restaurantMenuItems[0].id, 'stale-nonexistent-id']))
    act(() => root.unmount())
    root = createRoot(container)
    act(() => root.render(<App />))

    clickFavoritesNav()
    const rows = container.querySelectorAll('.menu-item-row')
    expect(rows).toHaveLength(1)
    expect(rows[0].querySelector('h3')?.textContent).toBe(restaurantMenuItems[0].name.th)
  })
})

describe('Explore search', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    window.localStorage.clear()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<App />))
    act(() => container.querySelector<HTMLButtonElement>('.explore-nav')?.click())
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function exploreRows() {
    return container.querySelectorAll<HTMLElement>('.explore-view .menu-list .menu-item-row')
  }

  function searchInput() {
    const input = container.querySelector<HTMLInputElement>('.explore-view .search input[type="search"]')
    if (!input) throw new Error('Missing Explore search input')
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

  function clickClearSearch() {
    act(() => container.querySelector<HTMLButtonElement>('.explore-search-clear')?.click())
  }

  function openExploreFilters() {
    act(() => container.querySelector<HTMLButtonElement>('.explore-view .restaurant-menu-nav .filter-button')?.click())
  }

  function filterField(label: string) {
    const input = [...container.querySelectorAll<HTMLElement>('.explore-view .menu-filter-panel .field-label')]
      .find(field => field.textContent?.startsWith(label))
      ?.querySelector<HTMLInputElement>('input')
    if (!input) throw new Error(`Missing filter field: ${label}`)
    return input
  }

  function setExploreFilterField(label: string, value: string) {
    const input = filterField(label)
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
    act(() => {
      setter.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  function explorePickButton() {
    const button = container.querySelector<HTMLButtonElement>('.explore-view .menu-pick-header button')
    if (!button) throw new Error('Missing Pick for me button')
    return button
  }

  function clickExplorePick() {
    act(() => explorePickButton().click())
  }

  function explorePickedName() {
    return container.querySelector('.explore-view .menu-pick-card h3')?.textContent
  }

  function menuRowByName(name: string) {
    const row = [...exploreRows()].find(candidate => candidate.querySelector('h3')?.textContent === name)
    if (!row) throw new Error(`Missing menu item row: ${name}`)
    return row
  }

  function favoriteToggleIn(row: HTMLElement) {
    const button = row.querySelector<HTMLButtonElement>('.menu-favorite-toggle')
    if (!button) throw new Error('Missing menu favorite toggle button')
    return button
  }

  it('shows a search input in Explore', () => {
    expect(searchInput()).toBeTruthy()
    expect(searchInput().getAttribute('type')).toBe('search')
  })

  it('narrows results by typing an English menu-item name', () => {
    typeSearch('mackerel')
    const expectedItems = restaurantMenuItems.filter(item => item.name.en.toLocaleLowerCase().includes('mackerel'))
    expect(expectedItems.length).toBeGreaterThan(0)
    expect(expectedItems.length).toBeLessThan(restaurantMenuItems.length)
    expect(exploreRows()).toHaveLength(expectedItems.length)
    for (const item of expectedItems) expect([...exploreRows()].some(row => row.querySelector('h3')?.textContent === item.name.th)).toBe(true)
  })

  it('narrows results by typing an English restaurant name', () => {
    typeSearch('ootoya')
    const expectedItems = restaurantMenuItems.filter(item => item.restaurantId === 'ootoya-thailand')
    expect(expectedItems.length).toBeGreaterThan(0)
    expect(expectedItems.length).toBeLessThan(restaurantMenuItems.length)
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('matches a Thai menu-item name regardless of UI locale', () => {
    typeSearch('ปลาซาบะ')
    const expectedItems = restaurantMenuItems.filter(item => item.name.th.includes('ปลาซาบะ'))
    expect(expectedItems.length).toBeGreaterThan(0)
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('matches a Thai restaurant name regardless of UI locale', () => {
    typeSearch('โอโตยะ')
    const expectedItems = restaurantMenuItems.filter(item => item.restaurantId === 'ootoya-thailand')
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('composes search with the High Protein quick goal using AND semantics', () => {
    const chip = [...container.querySelectorAll<HTMLButtonElement>('.explore-preset-chip')].find(candidate => candidate.textContent?.includes('โปรตีนสูง'))
    if (!chip) throw new Error('Missing High Protein preset chip')
    act(() => chip.click())
    typeSearch('chicken')

    const expectedItems = restaurantMenuItems.filter(item => item.name.en.toLocaleLowerCase().includes('chicken') && item.nutrition.kcal <= 700 && item.nutrition.protein >= 30)
    expect(expectedItems.length).toBeGreaterThan(0)
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('composes search with a manual nutrition filter using AND semantics', () => {
    typeSearch('salad')
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '400')

    const expectedItems = searchRestaurantMenuItems(restaurantMenuItems, restaurants, 'salad').filter(item => item.nutrition.kcal <= 400)
    expect(expectedItems.length).toBeGreaterThan(0)
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('reflects the final search+filter pool in the match count', () => {
    typeSearch('chicken')
    const expectedItems = restaurantMenuItems.filter(item => item.name.en.toLocaleLowerCase().includes('chicken'))
    expect(container.querySelector('.explore-result-count')?.textContent).toContain(String(expectedItems.length))
  })

  it('shows the zero-result state and disables Pick for me when nothing matches the search', () => {
    typeSearch('zzzznonexistentqueryxyz')
    expect(exploreRows()).toHaveLength(0)
    expect(container.querySelector('.explore-view .restaurant-empty')).not.toBeNull()
    expect(explorePickButton().disabled).toBe(true)
  })

  it('clearing search restores results while preserving active nutrition filters', () => {
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '400')
    typeSearch('zzzznonexistentqueryxyz')
    expect(exploreRows()).toHaveLength(0)

    clickClearSearch()
    expect(searchInput().value).toBe('')
    const expectedItems = restaurantMenuItems.filter(item => item.nutrition.kcal <= 400)
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('preserves the search query when Clear filters is used', () => {
    typeSearch('chicken')
    const expectedItems = restaurantMenuItems.filter(item => item.name.en.toLocaleLowerCase().includes('chicken'))
    openExploreFilters()
    setExploreFilterField('แคลอรีสูงสุด', '1')
    expect(exploreRows()).toHaveLength(0)

    act(() => container.querySelector<HTMLButtonElement>('.menu-filter-panel .text-button')?.click())
    expect(searchInput().value).toBe('chicken')
    expect(exploreRows()).toHaveLength(expectedItems.length)
  })

  it('lets Pick for me choose only from the searched+filtered pool', () => {
    typeSearch('mackerel')
    clickExplorePick()
    const expectedItem = restaurantMenuItems.find(item => item.name.en.toLocaleLowerCase().includes('mackerel'))
    expect(explorePickedName()).toBe(expectedItem?.name.th)
  })

  it('invalidates the current pick once a new query makes it ineligible', () => {
    clickExplorePick()
    expect(explorePickedName()).toBeTruthy()

    typeSearch('zzzznonexistentqueryxyz')
    expect(container.querySelector('.explore-view .menu-pick-card')).toBeNull()
  })

  it('lets a searched result be favorited', () => {
    typeSearch('mackerel')
    const item = restaurantMenuItems.find(candidate => candidate.name.en.toLocaleLowerCase().includes('mackerel'))
    if (!item) throw new Error('Fixture needs a mackerel item')
    const toggle = favoriteToggleIn(menuRowByName(item.name.th))
    expect(toggle.getAttribute('aria-pressed')).toBe('false')
    act(() => toggle.click())
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
    expect(JSON.parse(window.localStorage.getItem('healthy-restaurant-menu-favorites-v1') ?? '[]')).toEqual([item.id])
  })

  it('lets a searched Pick for me result be favorited', () => {
    typeSearch('mackerel')
    clickExplorePick()
    const pickCard = container.querySelector<HTMLElement>('.explore-view .menu-pick-card')
    if (!pickCard) throw new Error('Missing pick card')
    const toggle = favoriteToggleIn(pickCard)
    expect(toggle.getAttribute('aria-pressed')).toBe('false')
    act(() => toggle.click())
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
  })

  it('still opens the correct restaurant from a searched result', () => {
    typeSearch('mackerel')
    const item = restaurantMenuItems.find(candidate => candidate.name.en.toLocaleLowerCase().includes('mackerel'))
    if (!item) throw new Error('Fixture needs a mackerel item')
    const targetRestaurant = restaurants.find(candidate => candidate.id === item.restaurantId)
    if (!targetRestaurant) throw new Error('Fixture item needs a matching restaurant')
    const viewButton = menuRowByName(item.name.th).querySelector<HTMLButtonElement>('.explore-view-restaurant')
    if (!viewButton) throw new Error('Missing View restaurant button')

    act(() => viewButton.click())
    expect(container.querySelector('.restaurant-menu-view')).not.toBeNull()
    expect(container.querySelector('.restaurant-heading h2')?.textContent).toBe(targetRestaurant.name.th)
  })

  it('does not leak the Explore search query into restaurant-local filtering', () => {
    typeSearch('mackerel')
    expect(exploreRows().length).toBeLessThan(restaurantMenuItems.length)

    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
    const saladFactoryRow = [...container.querySelectorAll<HTMLElement>('.restaurant-row')].find(row => row.textContent?.includes(restaurants.find(r => r.id === 'salad-factory-thailand')?.name.th ?? ''))
    act(() => saladFactoryRow?.click())

    const expectedTotal = restaurantMenuItems.filter(item => item.restaurantId === 'salad-factory-thailand').length
    expect(container.querySelectorAll('.menu-item-row')).toHaveLength(expectedTotal)
    expect(container.querySelector('.search')).toBeNull()
  })

  it('leaves Quick Goal Custom detection based only on nutrition filters, unaffected by search', () => {
    const lightMealChip = [...container.querySelectorAll<HTMLButtonElement>('.explore-preset-chip')].find(candidate => candidate.textContent?.includes('มื้อเบา ๆ'))
    if (!lightMealChip) throw new Error('Missing Light Meal preset chip')
    act(() => lightMealChip.click())
    expect(lightMealChip.getAttribute('aria-pressed')).toBe('true')

    typeSearch('chicken')
    expect(lightMealChip.getAttribute('aria-pressed')).toBe('true')
    expect(container.querySelector('.explore-preset-custom')).toBeNull()
  })
})

// Slice 11 smoke coverage for the Batch 1 dataset expansion (Jones' Salad, Fuji,
// MK Restaurants, Sukiya, Santa Fe' Steak). No browser automation tool was
// available in this environment (see the Slice 11 final report), so this is the
// strongest available substitute for the spec's "browser smoke test" section: a
// jsdom interaction pass exercising the same flows against the expanded dataset.
describe('Batch 1 restaurant expansion (Slice 11)', () => {
  let container: HTMLDivElement
  let root: Root
  const newRestaurantIds = ['jones-salad-thailand', 'fuji-japanese-restaurant-thailand', 'mk-restaurants-thailand', 'sukiya-thailand', 'santa-fe-steak-thailand']

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

  function clickRestaurantsNav() {
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-nav')?.click())
  }

  function clickExploreNav() {
    act(() => container.querySelector<HTMLButtonElement>('.explore-nav')?.click())
  }

  function clickFavoritesNav() {
    act(() => container.querySelector<HTMLButtonElement>('.favorites-nav')?.click())
  }

  function restaurantRow(name: string) {
    const row = [...container.querySelectorAll<HTMLElement>('.restaurant-row')].find(candidate => candidate.textContent?.includes(name))
    if (!row) throw new Error(`Missing restaurant row: ${name}`)
    return row
  }

  function typeExploreSearch(value: string) {
    const input = container.querySelector<HTMLInputElement>('.explore-view .search input[type="search"]')
    if (!input) throw new Error('Missing Explore search input')
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
    act(() => {
      setter.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  function exploreRows() {
    return container.querySelectorAll<HTMLElement>('.explore-view .menu-list .menu-item-row')
  }

  it('shows all 8 restaurants (3 pilot + 5 Batch 1) cleanly in the restaurant list', () => {
    clickRestaurantsNav()
    const rows = container.querySelectorAll('.restaurant-row')
    expect(rows).toHaveLength(restaurants.length)
    expect(restaurants.length).toBe(8)
    for (const restaurant of restaurants) expect([...rows].some(row => row.textContent?.includes(restaurant.name.th))).toBe(true)
  })

  it('opens each of the five new restaurants and shows only that restaurant\'s real menu items', () => {
    clickRestaurantsNav()
    for (const restaurantId of newRestaurantIds) {
      const restaurant = restaurants.find(r => r.id === restaurantId)
      if (!restaurant) throw new Error(`Missing restaurant fixture: ${restaurantId}`)
      act(() => restaurantRow(restaurant.name.th).click())
      expect(container.querySelector('.restaurant-heading h2')?.textContent).toBe(restaurant.name.th)
      const expectedItems = restaurantMenuItems.filter(item => item.restaurantId === restaurantId)
      const rows = container.querySelectorAll('.menu-item-row')
      expect(rows).toHaveLength(expectedItems.length)
      expect(rows.length).toBeGreaterThanOrEqual(5)
      act(() => container.querySelector<HTMLButtonElement>('.restaurant-back')?.click())
    }
  })

  it('renders the expanded Explore dataset with items from every restaurant reachable', () => {
    clickExploreNav()
    expect(exploreRows().length).toBe(restaurantMenuItems.length)
  })

  it('finds a new restaurant/menu item by English name via Explore search', () => {
    clickExploreNav()
    typeExploreSearch('Sukiya')
    const results = searchRestaurantMenuItems(restaurantMenuItems, restaurants, 'Sukiya')
    expect(results.length).toBeGreaterThan(0)
    expect(exploreRows()).toHaveLength(results.length)
  })

  it('finds a new restaurant/menu item by Thai name via Explore search', () => {
    clickExploreNav()
    typeExploreSearch('เอ็มเคสุกี้')
    const results = searchRestaurantMenuItems(restaurantMenuItems, restaurants, 'เอ็มเคสุกี้')
    expect(results.length).toBeGreaterThan(0)
    expect(exploreRows()).toHaveLength(results.length)
  })

  it('still produces sensible Quick Goal results against the expanded pool', () => {
    clickExploreNav()
    const highProteinChip = [...container.querySelectorAll<HTMLButtonElement>('.explore-preset-chip')].find(candidate => candidate.textContent?.includes('โปรตีนสูง'))
    if (!highProteinChip) throw new Error('Missing High Protein preset chip')
    act(() => highProteinChip.click())
    expect(exploreRows().length).toBeGreaterThan(0)
    expect(exploreRows().length).toBeLessThan(restaurantMenuItems.length)
  })

  it('Pick for me works against the expanded pool', () => {
    clickExploreNav()
    const pickButton = container.querySelector<HTMLButtonElement>('.explore-view .menu-pick-header button')
    if (!pickButton) throw new Error('Missing Pick for me button')
    act(() => pickButton.click())
    const pickedName = container.querySelector('.explore-view .menu-pick-card h3')?.textContent
    expect(pickedName).toBeTruthy()
    expect(restaurantMenuItems.some(item => item.name.th === pickedName)).toBe(true)
  })

  it('favorites a new Batch 1 menu item and confirms it appears in Favorites', () => {
    clickExploreNav()
    typeExploreSearch('Sukiya')
    const row = [...exploreRows()][0]
    if (!row) throw new Error('Expected at least one Sukiya search result')
    const itemName = row.querySelector('h3')?.textContent
    const favoriteButton = row.querySelector<HTMLButtonElement>('.menu-favorite-toggle')
    if (!favoriteButton) throw new Error('Missing favorite toggle')
    act(() => favoriteButton.click())

    clickFavoritesNav()
    const favoritedRows = container.querySelectorAll('.menu-item-row')
    expect([...favoritedRows].some(favRow => favRow.querySelector('h3')?.textContent === itemName)).toBe(true)
  })
})
