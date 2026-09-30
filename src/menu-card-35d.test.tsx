// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ExploreView, RestaurantMenuView } from './App'
import { restaurantMenuItems, restaurants } from './restaurants'
import type { RestaurantMenuItem } from './types'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const find = (predicate: (item: RestaurantMenuItem) => boolean, label: string) => {
  const item = restaurantMenuItems.find(predicate)
  if (!item) throw new Error(`Fixture missing: ${label}`)
  return item
}
const imagePrice = find(item => !!item.menuImage && !!item.price, 'image + price')
const imageNoPrice = find(item => !!item.menuImage && !item.price, 'image + no price')
const textPrice = find(item => !item.menuImage && !!item.price, 'no image + price')
const textNoPrice = find(item => !item.menuImage && !item.price, 'no image + no price')

function Explore({ items }: { items: RestaurantMenuItem[] }) {
  const [favorites, setFavorites] = useState<string[]>([])
  return <ExploreView locale="en" onOpenRestaurant={() => undefined} favoriteIds={favorites} onFavorite={id => setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id])} storageAvailable menuItems={items} />
}

describe('Slice 35D ordinary menu cards', () => {
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
  const card = (item: RestaurantMenuItem) => [...container.querySelectorAll<HTMLElement>('.menu-list .menu-card')].find(node => node.querySelector('h3')?.textContent === item.name.en)!

  it('covers all four image/price combinations in Explore', () => {
    act(() => root.render(<Explore items={[imagePrice, imageNoPrice, textPrice, textNoPrice]} />))
    const a = card(imagePrice), b = card(imageNoPrice), c = card(textPrice), d = card(textNoPrice)
    expect(a.querySelector('.menu-item-image-compact img')?.getAttribute('src')).toBe(imagePrice.menuImage!.src)
    expect(a.querySelector('.menu-card-price')?.textContent).toBe(`฿${imagePrice.price!.amount}`)
    expect(b.querySelector('.menu-item-image-compact img')).not.toBeNull()
    expect(b.querySelector('.menu-card-price')).toBeNull()
    expect(c.querySelector('.menu-item-image')).toBeNull()
    expect(c.querySelector('.menu-card-price')?.textContent).toBe(`฿${textPrice.price!.amount}`)
    expect(d.querySelector('.menu-item-image')).toBeNull()
    expect(d.querySelector('.menu-card-price')).toBeNull()
    // no empty price placeholder, and kcal/protein are always present in the primary row
    for (const node of [a, b, c, d]) {
      expect(node.textContent).not.toMatch(/฿\s*(0|—|-)?\s*(?!\d)/)
      const primary = node.querySelector('.menu-item-nutrition-primary')!.textContent!
      expect(primary).toMatch(/\d+\s*kcal|kcal/i)
      expect(node.querySelector('.menu-item-nutrition-secondary')).not.toBeNull()
    }
  })

  it('falls back to a clean text card when the remote image fails', () => {
    act(() => root.render(<Explore items={[imagePrice]} />))
    act(() => { card(imagePrice).querySelector('img')!.dispatchEvent(new Event('error')) })
    expect(card(imagePrice).querySelector('.menu-item-image')).toBeNull()
    expect(card(imagePrice).querySelector('img')).toBeNull()
    expect(card(imagePrice).querySelector('.menu-card-price')).not.toBeNull()
  })

  it('keeps image provenance as a quiet caption inside the card', () => {
    act(() => root.render(<Explore items={[imagePrice]} />))
    const caption = card(imagePrice).querySelector('.menu-item-image-caption a')
    expect(caption?.getAttribute('href')).toBe(imagePrice.menuImage!.sourceUrl)
  })

  it('shows the restaurant in global Explore but not on restaurant-local cards', () => {
    const ootoyaItem = find(item => item.restaurantId === 'ootoya-thailand' && !!item.price, 'ootoya priced')
    act(() => root.render(<Explore items={[ootoyaItem]} />))
    expect(card(ootoyaItem).querySelector('.menu-item-restaurant')?.textContent).toBe('Ootoya')
    expect(card(ootoyaItem).querySelector('.explore-view-restaurant')).not.toBeNull()
    act(() => root.render(<RestaurantMenuView locale="en" restaurantId="ootoya-thailand" onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={[ootoyaItem]} />))
    expect(card(ootoyaItem).querySelector('.menu-item-restaurant-line')).toBeNull()
    expect(card(ootoyaItem).querySelector('.explore-view-restaurant')).toBeNull()
    expect(card(ootoyaItem).querySelector('.menu-card-price')).not.toBeNull()
  })

  it('keeps favorite toggling working on the new cards', () => {
    act(() => root.render(<Explore items={[textPrice]} />))
    const toggle = () => card(textPrice).querySelector<HTMLButtonElement>('.menu-favorite-toggle')!
    expect(toggle().getAttribute('aria-pressed')).toBe('false')
    act(() => toggle().click())
    expect(toggle().getAttribute('aria-pressed')).toBe('true')
  })

  it('offers price qualifications on demand only when the price has a note', () => {
    const noted = find(item => !!item.price?.note, 'price note')
    const plain = { ...noted, id: 'synthetic-plain', name: { th: 'ทดสอบ', en: 'Synthetic plain' }, price: { ...noted.price!, note: undefined } }
    act(() => root.render(<Explore items={[noted, plain]} />))
    expect(card(noted).querySelector('.menu-card-price-details p')?.textContent).toBe(noted.price!.note!.en)
    expect(card(plain as RestaurantMenuItem).querySelector('.menu-card-price-details')).toBeNull()
  })

  it('leaves catalog counts and logos unchanged', () => {
    expect(restaurants).toHaveLength(13)
    expect(restaurantMenuItems).toHaveLength(84)
    expect(restaurantMenuItems.filter(item => item.price)).toHaveLength(44)
    expect(restaurantMenuItems.filter(item => item.menuImage)).toHaveLength(22)
    expect(restaurants.filter(restaurant => restaurant.logo)).toHaveLength(8)
  })
})
