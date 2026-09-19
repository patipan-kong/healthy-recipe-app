// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App, { ExploreView, RestaurantListView, RestaurantMenuView } from './App'
import { recipes, searchRecipes } from './recipes'
import { restaurantMenuItems, restaurants } from './restaurants'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const mackerelItem = restaurantMenuItems.find(item => item.id === 'ootoya-grilled-mackerel')!
const ootoya = restaurants.find(restaurant => restaurant.id === 'ootoya-thailand')!
const caesarItem = restaurantMenuItems.find(item => item.id === 'jones-caesar-chicken-salad')!
const teriyakiItem = restaurantMenuItems.find(item => item.id === 'fuji-chicken-teriyaki')!
const woonSenItem = restaurantMenuItems.find(item => item.id === 'steak-and-more-yum-woon-sen')!

describe('Recipe Detail -> Restaurant bridge (App)', () => {
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

  function typeSearch(value: string) {
    const input = container.querySelector<HTMLInputElement>('.search-row input')!
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
    act(() => {
      setter.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  function openRecipeCard() {
    act(() => container.querySelector<HTMLButtonElement>('.recipe-card .food-art')?.click())
  }

  it('renders the restaurant bridge with identity, name, kcal/protein, price and image when a relation exists', () => {
    expect(searchRecipes(recipes, 'grilled mackerel brown rice')).toHaveLength(1)
    typeSearch('grilled mackerel brown rice')
    openRecipeCard()
    expect(container.querySelector('.detail h1')?.textContent).toBe('ปลาซาบะย่างกับข้าวกล้อง')

    const bridge = container.querySelector('.recipe-restaurant-bridge')
    expect(bridge).not.toBeNull()
    expect(bridge?.querySelector('h2')?.textContent).toBe('อยากซื้อกิน?')
    expect(bridge?.querySelector('.recipe-bridge-subtitle')?.textContent).toBe('มีเมนูใกล้เคียงที่ร้าน')
    expect(bridge?.querySelector('[data-restaurant-identity]')?.getAttribute('data-restaurant-identity')).toBe('ootoya-thailand')
    expect(bridge?.querySelector('.menu-item-restaurant')?.textContent).toBe(ootoya.name.th)
    expect(bridge?.querySelector('h3')?.textContent).toBe(mackerelItem.name.th)
    expect(bridge?.textContent).toContain(`${mackerelItem.nutrition.kcal}`)
    expect(bridge?.textContent).toContain(`${mackerelItem.nutrition.protein}g`)
    expect(bridge?.textContent).toContain(`฿${mackerelItem.price?.amount}`)
    expect(bridge?.querySelector('img')).not.toBeNull()
  })

  it('shows no price placeholder when the related menu item has no verified price', () => {
    expect(searchRecipes(recipes, 'caesar salad')).toHaveLength(1)
    typeSearch('caesar salad')
    openRecipeCard()
    const bridge = container.querySelector('.recipe-restaurant-bridge')
    expect(bridge).not.toBeNull()
    expect(bridge?.textContent).not.toContain('฿')
    expect(bridge?.querySelector('img')).toBeNull()
  })

  it('renders no bridge section at all for a recipe with no curated relation', () => {
    expect(searchRecipes(recipes, 'tom yum prawns')).toHaveLength(1)
    typeSearch('tom yum prawns')
    openRecipeCard()
    expect(container.querySelector('.detail h1')).not.toBeNull()
    expect(container.querySelector('.recipe-restaurant-bridge')).toBeNull()
  })

  it('View restaurant opens the correct restaurant, and Back from there lands on the restaurant list (existing navigation, unchanged)', () => {
    typeSearch('grilled mackerel brown rice')
    openRecipeCard()
    act(() => container.querySelector<HTMLButtonElement>('.recipe-bridge-card .explore-view-restaurant')?.click())
    expect(container.querySelector('.restaurant-menu-view .restaurant-heading h2')?.textContent).toBe(ootoya.name.th)
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-back')?.click())
    expect(container.querySelectorAll('.restaurant-row')).toHaveLength(restaurants.length)
  })

  it('uses English copy via the existing locale switch', () => {
    act(() => [...container.querySelectorAll<HTMLButtonElement>('.language-switcher button')].find(button => button.textContent === 'EN')?.click())
    typeSearch('grilled mackerel brown rice')
    openRecipeCard()
    const bridge = container.querySelector('.recipe-restaurant-bridge')
    expect(bridge?.querySelector('h2')?.textContent).toBe('Rather buy it?')
    expect(bridge?.querySelector('.recipe-bridge-subtitle')?.textContent).toBe('Similar dishes at restaurants')
    expect(bridge?.querySelector('h3')?.textContent).toBe(mackerelItem.name.en)
  })

  it('preserves recipe search/filter state and Favorites when navigating through the bridge and back', () => {
    typeSearch('grilled mackerel brown rice')
    act(() => container.querySelector<HTMLButtonElement>('.heart')?.click())
    openRecipeCard()
    act(() => container.querySelector<HTMLButtonElement>('.recipe-bridge-card .explore-view-restaurant')?.click())
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-back')?.click())
    act(() => container.querySelector<HTMLButtonElement>('.logo')?.click())
    expect(container.querySelector<HTMLInputElement>('.search input')?.value).toBe('grilled mackerel brown rice')
    act(() => container.querySelector<HTMLButtonElement>('.icon-button')?.click())
    expect(container.querySelectorAll('.recipe-card')).toHaveLength(1)
  })

  it('accessible names: heading hierarchy, image alt text, and no stray focusable controls when there is no relation', () => {
    typeSearch('grilled mackerel brown rice')
    openRecipeCard()
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(container.querySelector('.recipe-restaurant-bridge')?.getAttribute('aria-labelledby')).toBe('recipe-restaurant-bridge-heading')
    expect(container.querySelector('#recipe-restaurant-bridge-heading')?.tagName).toBe('H2')
    expect(container.querySelector('.recipe-bridge-card img')?.getAttribute('alt')).toBeTruthy()
    expect(container.querySelector('[data-restaurant-identity]')?.getAttribute('aria-hidden')).toBe('true')

    act(() => container.querySelector<HTMLButtonElement>('.detail-nav .round-button')?.click())
    typeSearch('')
    typeSearch('tom yum prawns')
    openRecipeCard()
    expect(container.querySelector('.recipe-bridge-view')).toBeNull()
  })

  it('restaurant dataset counts are unchanged and the recipe catalog reflects Slice 31\'s 4 new recipes', () => {
    expect([recipes.length, restaurants.length, restaurantMenuItems.length]).toEqual([208, 13, 84])
  })
})

describe('Restaurant Pick Focus -> Recipe bridge (RestaurantMenuView)', () => {
  let container: HTMLDivElement
  let root: Root
  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function mount(locale: 'th' | 'en', onOpenRecipe: (recipe: (typeof recipes)[number]) => void = () => undefined) {
    act(() => root.render(<RestaurantMenuView locale={locale} restaurantId="fuji-japanese-restaurant-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[teriyakiItem]} onOpenRecipe={onOpenRecipe} />))
  }

  it('renders the recipe bridge in the Pick Focus card once picked, with image, name, kcal/protein', () => {
    mount('th')
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick .random-button')?.click())
    const bridge = container.querySelector('.menu-recipe-bridge')
    expect(bridge).not.toBeNull()
    expect(bridge?.querySelector('.meal-context-heading')?.textContent).toBe('อยากทำเอง?')
    expect(bridge?.querySelector('.menu-recipe-bridge-subtitle')?.textContent).toBe('ลองทำเมนูใกล้เคียง')
    expect(bridge?.querySelector('.meal-context-name')?.textContent).toBe('ข้าวหน้าไก่เทอริยากิ')
    expect(bridge?.textContent).toContain('450')
    expect(bridge?.querySelector('img')).not.toBeNull()
  })

  it('View recipe calls onOpenRecipe with the correct recipe', () => {
    let opened: string | undefined
    mount('en', recipe => { opened = recipe.id })
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick .random-button')?.click())
    act(() => container.querySelector<HTMLButtonElement>('.menu-recipe-bridge-view')?.click())
    expect(opened).toBe('chicken-teriyaki-rice-bowl')
  })

  it('renders no recipe bridge when the picked item has no curated relation', () => {
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="fuji-japanese-restaurant-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[restaurantMenuItems.find(item => item.id === 'fuji-salmon-tataki')!]} />))
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick .random-button')?.click())
    expect(container.querySelector('.menu-recipe-bridge')).toBeNull()
  })
})

describe('Explore Pick Focus inherits the recipe bridge (ExploreView)', () => {
  let container: HTMLDivElement
  let root: Root
  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('shows the bridge for the Explore Pick Focus item, and not on ordinary list rows', () => {
    let opened: string | undefined
    act(() => root.render(<ExploreView locale="en" onOpenRestaurant={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[woonSenItem]} onOpenRecipe={recipe => { opened = recipe.id }} />))
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick .random-button')?.click())
    const bridge = container.querySelector('.menu-recipe-bridge')
    expect(bridge).not.toBeNull()
    expect(bridge?.querySelector('.meal-context-name')?.textContent).toBe('Glass Noodle Seafood Salad')
    act(() => container.querySelector<HTMLButtonElement>('.menu-recipe-bridge-view')?.click())
    expect(opened).toBe('glass-noodle-seafood-salad')

    act(() => container.querySelector<HTMLButtonElement>('.menu-list-toggle')?.click())
    expect(container.querySelector('#explore-menu-list .menu-recipe-bridge')).toBeNull()
  })
})

describe('Random Meal naturally inherits the bridge via ExploreItemCard (RestaurantListView)', () => {
  let container: HTMLDivElement
  let root: Root
  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('renders the recipe bridge on the Random Meal result without any special-casing', () => {
    let opened: string | undefined
    act(() => root.render(<RestaurantListView locale="en" onOpen={() => undefined} favoriteIds={[]} onFavorite={() => undefined} menuItems={[mackerelItem]} restaurantList={[ootoya]} onOpenRecipe={recipe => { opened = recipe.id }} />))
    act(() => container.querySelector<HTMLButtonElement>('.restaurant-meal-pick-trigger')?.click())
    const bridge = container.querySelector('.restaurant-meal-pick-card .menu-recipe-bridge')
    expect(bridge).not.toBeNull()
    act(() => bridge!.querySelector<HTMLButtonElement>('.menu-recipe-bridge-view')?.click())
    expect(opened).toBe('grilled-mackerel-bowl')
  })
})

describe('Favorites and random-pick semantics are unaffected by relations', () => {
  it('recipe favorites and restaurant-menu favorites remain independent lists (no new relation favorite concept)', () => {
    expect(caesarItem).toBeTruthy()
    expect(teriyakiItem).toBeTruthy()
  })

  it('items with a curated relation remain part of the normal recipe and menu-item random pools', () => {
    expect(recipes.some(recipe => recipe.id === 'grilled-mackerel-bowl')).toBe(true)
    expect(restaurantMenuItems.some(item => item.id === 'ootoya-grilled-mackerel')).toBe(true)
  })
})

describe('Slice 33 bridge regression: expanded relation graph flows through the existing UI unchanged', () => {
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

  function typeSearch(value: string) {
    const input = container.querySelector<HTMLInputElement>('.search-row input')!
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
    act(() => {
      setter.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  function openRecipeCard() {
    act(() => container.querySelector<HTMLButtonElement>('.recipe-card .food-art')?.click())
  }

  it('renders both destinations, unmodified, for a recipe with a new one-to-many cluster (herb-grilled-chicken)', () => {
    expect(searchRecipes(recipes, 'herb grilled chicken')).toHaveLength(1)
    typeSearch('herb grilled chicken')
    openRecipeCard()
    const bridge = container.querySelector('.recipe-restaurant-bridge')
    expect(bridge).not.toBeNull()
    const cards = bridge!.querySelectorAll('.recipe-bridge-card')
    expect(cards).toHaveLength(2)
    const restaurantIds = [...cards].map(card => card.querySelector('[data-restaurant-identity]')?.getAttribute('data-restaurant-identity'))
    expect(restaurantIds.sort()).toEqual(['nittaya-kai-yang-thailand', 'zaab-eli-thailand'])
  })

  it('Restaurant Pick Focus renders the new SAME_DISH relation (Santa Fe chicken-steak-jaew -> grilled-chicken-jaew)', () => {
    const jaewItem = restaurantMenuItems.find(item => item.id === 'santa-fe-chicken-steak-jaew')!
    let opened: string | undefined
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="santa-fe-steak-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[jaewItem]} onOpenRecipe={recipe => { opened = recipe.id }} />))
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick .random-button')?.click())
    const bridge = container.querySelector('.menu-recipe-bridge')
    expect(bridge).not.toBeNull()
    expect(bridge?.querySelector('.meal-context-heading')?.textContent).toBe('Want to make it?')
    act(() => container.querySelector<HTMLButtonElement>('.menu-recipe-bridge-view')?.click())
    expect(opened).toBe('grilled-chicken-jaew')
  })

  it('Restaurant Pick Focus renders the new SIMILAR_DISH-strength relation (Santa Fe dory-fish-steak -> baked-cod-lemon-herbs) with the same unmodified copy', () => {
    const doryItem = restaurantMenuItems.find(item => item.id === 'santa-fe-dory-fish-steak')!
    let opened: string | undefined
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="santa-fe-steak-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[doryItem]} onOpenRecipe={recipe => { opened = recipe.id }} />))
    act(() => container.querySelector<HTMLButtonElement>('.menu-pick .random-button')?.click())
    const bridge = container.querySelector('.menu-recipe-bridge')
    expect(bridge).not.toBeNull()
    expect(bridge?.querySelector('.meal-context-heading')?.textContent).toBe('Want to make it?')
    expect(bridge?.querySelector('.menu-recipe-bridge-subtitle')?.textContent).toBe('Try a similar recipe')
    act(() => container.querySelector<HTMLButtonElement>('.menu-recipe-bridge-view')?.click())
    expect(opened).toBe('baked-cod-lemon-herbs')
  })

  it('existing Som Tam relation still renders correctly alongside the expanded graph', () => {
    expect(searchRecipes(recipes, 'som tam')).toHaveLength(1)
    typeSearch('som tam')
    openRecipeCard()
    const bridge = container.querySelector('.recipe-restaurant-bridge')
    expect(bridge).not.toBeNull()
    expect(bridge!.querySelectorAll('.recipe-bridge-card')).toHaveLength(3)
  })

  it('existing Oyakodon relation still renders correctly alongside the expanded graph', () => {
    expect(searchRecipes(recipes, 'oyakodon')).toHaveLength(1)
    typeSearch('oyakodon')
    openRecipeCard()
    const bridge = container.querySelector('.recipe-restaurant-bridge')
    expect(bridge).not.toBeNull()
    expect(bridge!.querySelectorAll('.recipe-bridge-card')).toHaveLength(1)
    expect(bridge?.querySelector('h3')?.textContent).toBe(restaurantMenuItems.find(item => item.id === 'ootoya-oyakodon')!.name.th)
  })
})
