// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { RestaurantMenuView, ExploreView } from './App'
import { restaurantMenuItems, restaurants } from './restaurants'
import type { Locale, RestaurantMenuItem } from './types'

function FavoritableRestaurantMenu({ locale, menuItems }: { locale: Locale; menuItems: RestaurantMenuItem[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const onFavorite = (id: string) => setFavoriteIds(current => current.includes(id) ? current.filter(existing => existing !== id) : [...current, id])
  return <RestaurantMenuView locale={locale} restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={favoriteIds} onFavorite={onFavorite} storageAvailable menuItems={menuItems} />
}

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const mackerel = restaurantMenuItems.find(item => item.id === 'ootoya-grilled-mackerel')!
const tonteki = restaurantMenuItems.find(item => item.id === 'ootoya-tonteki-pork-chop-set')!
const noImageItem = restaurantMenuItems.find(item => item.id === 'ootoya-oyakodon')!

if (!mackerel.menuImage || !tonteki.menuImage) throw new Error('Fixture expects the Slice 18 pilot items to carry a menu image')
if (noImageItem.menuImage) throw new Error('Fixture expects an Ootoya item without a menu image for contrast')

describe('MenuItemImage in Pick Focus', () => {
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

  function clickPick(scope = '') {
    act(() => container.querySelector<HTMLButtonElement>(`${scope} .menu-pick-header button`)?.click())
  }

  it('renders the image in the restaurant-local Pick Focus card', () => {
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[mackerel]} />))
    clickPick()
    const img = container.querySelector<HTMLImageElement>('.menu-pick-card .menu-item-image img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe(mackerel.menuImage!.src)
  })

  it('renders the image in the Explore Pick Focus card', () => {
    act(() => root.render(<ExploreView locale="en" onOpenRestaurant={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[mackerel]} />))
    clickPick('.explore-view')
    const img = container.querySelector<HTMLImageElement>('.explore-view .menu-pick-card .menu-item-image img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe(mackerel.menuImage!.src)
  })

  it('uses the Thai localized alt text in Thai locale', () => {
    act(() => root.render(<RestaurantMenuView locale="th" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[mackerel]} />))
    clickPick()
    expect(container.querySelector<HTMLImageElement>('.menu-item-image img')?.alt).toBe(mackerel.menuImage!.alt.th)
  })

  it('uses the English localized alt text in English locale', () => {
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[mackerel]} />))
    clickPick()
    expect(container.querySelector<HTMLImageElement>('.menu-item-image img')?.alt).toBe(mackerel.menuImage!.alt.en)
  })

  it('renders Pick Focus normally, without an image region, for an item that has none', () => {
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[noImageItem]} />))
    clickPick()
    expect(container.querySelector('.menu-pick-card .menu-item-image')).toBeNull()
    expect(container.querySelector('.menu-pick-card h3')?.textContent).toBe(noImageItem.name.en)
    expect(container.querySelector('.menu-pick-card .menu-item-nutrition')).not.toBeNull()
  })

  it('does not render menu images on normal restaurant-local list rows, even for items that have one', () => {
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={restaurantMenuItems} />))
    const rows = container.querySelectorAll('.menu-list .menu-item-row')
    expect(rows.length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.menu-list .menu-item-image')).toHaveLength(0)
  })

  it('does not render menu images on normal Explore result cards, even for items that have one', () => {
    act(() => root.render(<ExploreView locale="en" onOpenRestaurant={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={restaurantMenuItems} />))
    const rows = container.querySelectorAll('.explore-view .menu-list .menu-item-row')
    expect(rows.length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.explore-view .menu-list .menu-item-image')).toHaveLength(0)
  })

  it('keeps meal-context rendering intact alongside the image', () => {
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[mackerel]} />))
    clickPick()
    expect(container.querySelector('.menu-pick-card .menu-item-image')).not.toBeNull()
    expect(container.querySelector('.meal-context-addition .meal-context-name')?.textContent).toBe(mackerel.mealContext && mackerel.mealContext.kind === 'add-on' ? mackerel.mealContext.label.en : undefined)
  })

  it('keeps price rendering intact alongside the image', () => {
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[tonteki]} />))
    clickPick()
    expect(container.querySelector('.menu-pick-card .menu-item-image')).not.toBeNull()
    expect(container.querySelector('.meal-context-price strong')?.textContent).toBe(`฿${tonteki.price!.amount}`)
  })

  it('keeps the favorite toggle usable on an image-backed pick card', () => {
    act(() => root.render(<FavoritableRestaurantMenu locale="en" menuItems={[mackerel]} />))
    clickPick()
    const toggle = container.querySelector<HTMLButtonElement>('.menu-pick-card .menu-favorite-toggle')
    expect(toggle).not.toBeNull()
    expect(toggle?.getAttribute('aria-pressed')).toBe('false')
    act(() => toggle?.click())
    expect(toggle?.getAttribute('aria-pressed')).toBe('true')
  })

  it('keeps View restaurant usable on an image-backed Explore pick card', () => {
    let opened: string | undefined
    act(() => root.render(<ExploreView locale="en" onOpenRestaurant={id => { opened = id }} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[mackerel]} />))
    clickPick('.explore-view')
    const viewButton = container.querySelector<HTMLButtonElement>('.explore-view .menu-pick-card .explore-view-restaurant')
    expect(viewButton).not.toBeNull()
    act(() => viewButton?.click())
    expect(opened).toBe('ootoya-thailand')
  })

  it('degrades gracefully when the remote image fails to load, without removing menu information', () => {
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[mackerel]} />))
    clickPick()
    const img = container.querySelector('.menu-item-image img')
    expect(img).not.toBeNull()
    act(() => img?.dispatchEvent(new Event('error')))

    expect(container.querySelector('.menu-pick-card .menu-item-image')).toBeNull()
    expect(container.querySelector('.menu-pick-card h3')?.textContent).toBe(mackerel.name.en)
    expect(container.querySelector('.menu-pick-card .menu-item-nutrition')).not.toBeNull()
  })
})

describe('Favorites screen stays image-free', () => {
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
  })

  it('never renders a menu image for a favorited item that has one', () => {
    window.localStorage.setItem('healthy-restaurant-menu-favorites-v1', JSON.stringify([mackerel.id]))
    act(() => root.render(<App />))
    act(() => container.querySelector<HTMLButtonElement>('.icon-button')?.click())

    const row = [...container.querySelectorAll<HTMLElement>('.menu-item-row')].find(candidate => candidate.querySelector('h3')?.textContent === mackerel.name.th)
    expect(row).toBeTruthy()
    expect(row?.querySelector('.menu-item-image')).toBeNull()
    expect(container.querySelectorAll('.menu-item-image')).toHaveLength(0)
  })
})

describe('production menu image dataset shape', () => {
  it('keeps every menuImage-bearing item within the small researched Slice 18 + Slice 19 batch', () => {
    const withImage: RestaurantMenuItem[] = restaurantMenuItems.filter(item => item.menuImage)
    expect(withImage.length).toBeGreaterThan(0)
    expect(withImage.length).toBeLessThanOrEqual(7)
    for (const item of withImage) expect(restaurants.some(restaurant => restaurant.id === item.restaurantId)).toBe(true)
  })

  it('spreads Slice 19 image coverage across three restaurants without changing restaurant/item counts', () => {
    const withImage: RestaurantMenuItem[] = restaurantMenuItems.filter(item => item.menuImage)
    const restaurantIds = new Set(withImage.map(item => item.restaurantId))
    expect(restaurantIds).toEqual(new Set(['ootoya-thailand', 'salad-factory-thailand', 'seven-eleven-thailand']))
    expect(restaurants.length).toBe(13)
    expect(restaurantMenuItems.length).toBe(84)
  })

  it('gives every menuImage-bearing item non-empty localized alt text', () => {
    const withImage: RestaurantMenuItem[] = restaurantMenuItems.filter(item => item.menuImage)
    for (const item of withImage) {
      expect(item.menuImage?.alt.th.trim().length).toBeGreaterThan(0)
      expect(item.menuImage?.alt.en.trim().length).toBeGreaterThan(0)
    }
  })

  it('never duplicates a menuImage src across items', () => {
    const withImage: RestaurantMenuItem[] = restaurantMenuItems.filter(item => item.menuImage)
    const srcs = withImage.map(item => item.menuImage!.src)
    expect(new Set(srcs).size).toBe(srcs.length)
  })
})
