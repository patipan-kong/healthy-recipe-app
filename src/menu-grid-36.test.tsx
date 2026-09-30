// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App, { ExploreView, RestaurantListView, RestaurantMenuView } from './App'
import { imageFirstMenuItems, logoFirstRestaurants } from './menu-presentation'
import { chooseRandom, recipes } from './recipes'
import { recipeRestaurantRelations, relatedRecipesForMenuItem } from './recipe-restaurant-relations'
import { restaurantMenuItems, restaurants, searchRestaurantMenuItems } from './restaurants'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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
const bridgedItem = find(item => relatedRecipesForMenuItem(item.id).length > 0, 'item with a recipe relation')
const unbridgedItem = find(item => relatedRecipesForMenuItem(item.id).length === 0, 'item without a recipe relation')

let container: HTMLDivElement
let root: Root
beforeEach(() => {
  localStorage.clear()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllEnvs()
})

const q = <T extends Element = HTMLElement>(selector: string) => container.querySelector<T>(selector)
const qa = <T extends Element = HTMLElement>(selector: string) => [...container.querySelectorAll<T>(selector)]
const click = (element: Element | null | undefined) => { expect(element).toBeTruthy(); act(() => (element as HTMLElement).click()) }
const cardFor = (item: RestaurantMenuItem) => qa('.menu-grid-card').find(node => node.dataset.menuItemId === item.id)!
const openCard = (item: RestaurantMenuItem) => click(cardFor(item).querySelector('.menu-grid-open'))
const openRestaurantsGrid = () => { act(() => root.render(<App />)); click(q('.restaurant-nav')) }
const restaurantCard = (id: string) => qa('.restaurant-card').find(node => node.querySelector(`[data-restaurant-identity="${id}"]`))!
const backFromDetail = () => click(q('.menu-detail .detail-nav .round-button'))

function Cards({ items }: { items: RestaurantMenuItem[] }) {
  const [favorites, setFavorites] = useState<string[]>([])
  return <ExploreView locale="en" onOpenRestaurant={() => undefined} favoriteIds={favorites} onFavorite={id => { calls.push(id); setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]) }} storageAvailable menuItems={items} />
}
const calls: string[] = []

function LocalMenu({ restaurantId, items }: { restaurantId: string; items?: RestaurantMenuItem[] }) {
  return <RestaurantMenuView locale="en" restaurantId={restaurantId} onBack={() => undefined} favoriteIds={[]} onFavorite={() => undefined} storageAvailable menuItems={items} />
}

describe('Slice 36 Restaurant Grid', () => {
  it('renders all 13 restaurants as grid cards, every one with a logo and no initials-only card', () => {
    openRestaurantsGrid()
    const cards = qa('.restaurant-grid .restaurant-card')
    expect(cards).toHaveLength(13)
    for (const card of cards) {
      expect(card.querySelector('img')).not.toBeNull()
      expect(card.querySelector('[data-identity-source="logo"]')).not.toBeNull()
    }
    // a failing logo falls back to initials without changing the card
    act(() => { restaurantCard('zaab-eli-thailand').querySelector('img')!.dispatchEvent(new Event('error')) })
    const card = restaurantCard('zaab-eli-thailand')
    expect(card.querySelector('img')).toBeNull()
    expect(card.querySelector('[data-restaurant-identity]')!.textContent).not.toBe('')
  })

  it('presents logo-bearing restaurants first, in catalog order inside each group', () => {
    openRestaurantsGrid()
    const cards = qa('.restaurant-grid .restaurant-card')
    const withLogo = restaurants.filter(restaurant => restaurant.logo)
    const without = restaurants.filter(restaurant => !restaurant.logo)
    expect(cards.map(card => card.querySelector('[data-restaurant-identity]')!.getAttribute('data-restaurant-identity'))).toEqual([...withLogo, ...without].map(restaurant => restaurant.id))
    expect(cards.slice(0, withLogo.length).every(card => card.querySelector('img'))).toBe(true)
    expect(cards.slice(withLogo.length).every(card => !card.querySelector('img'))).toBe(true)
  })

  it('opens the restaurant menu from a card', () => {
    openRestaurantsGrid()
    click(restaurantCard('ootoya-thailand'))
    expect(q('.restaurant-menu-view')).not.toBeNull()
    expect(q('.restaurant-heading h2')!.textContent).toBe('โอโตยะ')
  })

  it('reorders only the view: input arrays and the Random Restaurant pool are untouched', () => {
    const ids = restaurants.map(restaurant => restaurant.id)
    const ordered = logoFirstRestaurants(restaurants)
    expect(restaurants.map(restaurant => restaurant.id)).toEqual(ids)
    expect([...ordered.map(restaurant => restaurant.id)].sort()).toEqual([...ids].sort())
    const random = () => 0.999
    act(() => root.render(<RestaurantListView locale="en" onOpen={() => undefined} random={random} />))
    click(q('.restaurant-pick-trigger'))
    const expected = chooseRandom(restaurants, undefined, random)!
    expect(q('.restaurant-pick-card h3')!.textContent).toBe(expected.name.en)
  })
})

describe('Slice 36 Menu Grid', () => {
  it('renders an image card and a text-first card without any blank media region', () => {
    act(() => root.render(<Cards items={[imagePrice, textPrice]} />))
    const withImage = cardFor(imagePrice)
    expect(withImage.querySelector('.menu-item-image-card img')?.getAttribute('src')).toBe(imagePrice.menuImage!.src)
    expect(withImage.querySelector('.menu-item-image-caption')).toBeNull()
    const text = cardFor(textPrice)
    expect(text.querySelector('.menu-item-image, img, .menu-item-image-frame')).toBeNull()
    expect(text.dataset.hasImage).toBe('false')
  })

  it('places image-bearing items first with a quiet divider, without changing the item set', () => {
    const restaurantId = find(item => !!item.menuImage && restaurantMenuItems.some(other => other.restaurantId === item.restaurantId && !other.menuImage), 'restaurant with mixed images').restaurantId
    act(() => root.render(<LocalMenu restaurantId={restaurantId} />))
    const expected = restaurantMenuItems.filter(item => item.restaurantId === restaurantId)
    const cards = qa('.menu-grid .menu-grid-card')
    expect(cards.map(card => card.dataset.menuItemId).sort()).toEqual(expected.map(item => item.id).sort())
    const flags = cards.map(card => card.dataset.hasImage === 'true')
    expect(flags).toEqual([...flags].sort((a, b) => Number(b) - Number(a)))
    const divider = q('.menu-grid-divider')!
    expect(divider.textContent).toBe('More menu items')
    expect(divider.previousElementSibling).toBe(cards[flags.lastIndexOf(true)])
    expect(divider.nextElementSibling).toBe(cards[flags.indexOf(false)])
    expect(imageFirstMenuItems(restaurantMenuItems).map(item => item.id).sort()).toEqual(restaurantMenuItems.map(item => item.id).sort())
  })

  it('shows price only when present, with kcal and protein always visible and detail-only fields absent', () => {
    act(() => root.render(<Cards items={[imagePrice, imageNoPrice, textPrice, textNoPrice]} />))
    for (const [item, hasPrice] of [[imagePrice, true], [imageNoPrice, false], [textPrice, true], [textNoPrice, false]] as const) {
      const card = cardFor(item)
      expect(card.querySelector('.menu-grid-price')?.textContent ?? null).toBe(hasPrice ? `฿${item.price!.amount}` : null)
      expect(card.textContent).not.toMatch(/฿\s*(0|—|-)?\s*(?!\d)/)
      expect(card.querySelector('.menu-grid-facts')!.textContent).toContain(`${item.nutrition.kcal} kcal`)
      expect(card.querySelector('.menu-grid-facts')!.textContent).toContain(`${item.nutrition.protein}g`)
      expect(card.querySelector('.confidence-badge, .menu-item-note, .menu-item-customizations, details, .menu-item-image-caption')).toBeNull()
      expect(card.textContent).not.toContain('carbs')
    }
  })

  it('keeps favorites working on grid cards', () => {
    calls.length = 0
    act(() => root.render(<Cards items={[textPrice]} />))
    const toggle = () => cardFor(textPrice).querySelector<HTMLButtonElement>('.menu-favorite-toggle')!
    expect(toggle().getAttribute('aria-pressed')).toBe('false')
    click(toggle())
    expect(calls).toEqual([textPrice.id])
    expect(toggle().getAttribute('aria-pressed')).toBe('true')
  })

  it('turns into the text-first card when the remote image fails', () => {
    act(() => root.render(<Cards items={[imagePrice]} />))
    act(() => { cardFor(imagePrice).querySelector('img')!.dispatchEvent(new Event('error')) })
    const card = cardFor(imagePrice)
    expect(card.querySelector('img, .menu-item-image, .menu-item-image-frame')).toBeNull()
    expect(card.querySelector('.menu-grid-price')).not.toBeNull()
    expect(card.querySelector('.menu-grid-open')).not.toBeNull()
  })

  it('identifies the restaurant on global Explore cards only', () => {
    act(() => root.render(<App />))
    click(q('.explore-nav'))
    expect(qa('.explore-view .menu-grid-card')).toHaveLength(84)
    expect(qa('.explore-view .menu-grid-card').every(card => card.querySelector('.menu-item-restaurant'))).toBe(true)
    act(() => root.render(<LocalMenu restaurantId="ootoya-thailand" />))
    expect(qa('.menu-grid-card .menu-item-restaurant-line')).toHaveLength(0)
  })
})

describe('Slice 36 Menu Detail', () => {
  const openLocal = (item: RestaurantMenuItem) => {
    act(() => root.unmount())
    root = createRoot(container)
    act(() => root.render(<App />))
    click(q('.restaurant-nav'))
    click(restaurantCard(item.restaurantId))
    openCard(item)
  }

  it('renders a hero image, provenance, price qualification and nutrition for an image + price item', () => {
    openLocal(imagePrice)
    const detail = q('.menu-detail')!
    expect(detail.querySelector('.menu-item-image-hero img')?.getAttribute('src')).toBe(imagePrice.menuImage!.src)
    expect(detail.querySelector('.menu-item-image-caption a')?.getAttribute('href')).toBe(imagePrice.menuImage!.sourceUrl)
    expect(detail.querySelector('h1')!.textContent).toBe(imagePrice.name.th)
    expect(detail.querySelector('.menu-detail-price strong')!.textContent).toBe(`฿${imagePrice.price!.amount}`)
    expect(detail.querySelector('.menu-detail-price')!.textContent).toContain(imagePrice.price!.asOf)
    if (imagePrice.price!.note) expect(detail.querySelector('.menu-detail-price')!.textContent).toContain(imagePrice.price!.note.th)
    const cells = [...detail.querySelectorAll('.nutrition-card b')].map(node => node.textContent)
    expect(cells).toEqual([imagePrice.nutrition.kcal, `${imagePrice.nutrition.protein}g`, `${imagePrice.nutrition.carbs}g`, `${imagePrice.nutrition.fat}g`].map(String))
    expect(detail.querySelector(`.confidence-${imagePrice.nutritionSource.confidence}`)).not.toBeNull()
  })

  it('starts cleanly without a hero for no-image items and omits the price when there is none', () => {
    openLocal(textNoPrice)
    const detail = q('.menu-detail')!
    expect(detail.querySelector('.menu-item-image')).toBeNull()
    expect(detail.querySelector('.menu-detail-price')).toBeNull()
    expect(detail.querySelector('h1')!.textContent).toBe(textNoPrice.name.th)
    expect(detail.querySelector('.nutrition-card')).not.toBeNull()
    expect(detail.textContent).not.toContain('฿')
  })

  it('shows a price for no-image + price items and no price for image + no price items', () => {
    openLocal(textPrice)
    expect(q('.menu-detail .menu-item-image')).toBeNull()
    expect(q('.menu-detail-price strong')!.textContent).toBe(`฿${textPrice.price!.amount}`)
    backFromDetail()
    act(() => root.render(<App />))
    openLocal(imageNoPrice)
    expect(q('.menu-detail .menu-item-image-hero img')).not.toBeNull()
    expect(q('.menu-detail-price')).toBeNull()
  })

  it('shows serving and customization notes only when the item has them', () => {
    const withNotes = find(item => !!item.servingNote && !!item.customizationNotes?.length, 'notes')
    const withoutNotes = find(item => !item.servingNote && !item.customizationNotes?.length, 'no notes')
    openLocal(withNotes)
    expect(q('.menu-detail-info .menu-item-note')!.textContent).toBe(withNotes.servingNote!.th)
    expect(qa('.menu-detail-info li')).toHaveLength(withNotes.customizationNotes!.length)
    backFromDetail()
    act(() => root.render(<App />))
    openLocal(withoutNotes)
    expect(q('.menu-detail-info')).toBeNull()
  })

  it('offers the Cook bridge only when a relation exists, and returns to the same Menu Detail', () => {
    openLocal(unbridgedItem)
    expect(q('.menu-detail .menu-recipe-bridge')).toBeNull()
    backFromDetail()
    act(() => root.render(<App />))
    openLocal(bridgedItem)
    const related = relatedRecipesForMenuItem(bridgedItem.id)[0]
    expect(q('.menu-detail .menu-recipe-bridge')!.textContent).toContain('อยากทำเอง?')
    click(q('.menu-recipe-bridge-view'))
    expect(q('.detail h1')!.textContent).toBe(related.name.th)
    expect(q('.menu-detail')).toBeNull()
    click(q('.detail-nav .round-button'))
    expect(q('.menu-detail h1')!.textContent).toBe(bridgedItem.name.th)
  })

  it('goes back to the same list context, keeping Explore search text', () => {
    act(() => root.render(<App />))
    click(q('.explore-nav'))
    const input = q<HTMLInputElement>('.explore-view input[type="search"]')!
    act(() => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'mackerel'); input.dispatchEvent(new Event('input', { bubbles: true })) })
    const before = qa('.explore-view .menu-grid-card').map(card => card.dataset.menuItemId)
    expect(before.length).toBeGreaterThan(0)
    openCard(restaurantMenuItems.find(item => item.id === before[0])!)
    expect(q('.menu-detail')).not.toBeNull()
    backFromDetail()
    expect(q('.menu-detail')).toBeNull()
    expect(q<HTMLInputElement>('.explore-view input[type="search"]')!.value).toBe('mackerel')
    expect(qa('.explore-view .menu-grid-card').map(card => card.dataset.menuItemId)).toEqual(before)
  })

  it('offers a route to Menu Detail from Pick results and from the Recipe Detail bridge', () => {
    act(() => root.render(<App />))
    click(q('.explore-nav'))
    click(qa('.explore-view .random-button').find(button => button.closest('.menu-pick')))
    click(q('.explore-view .menu-pick-card .menu-view-details'))
    expect(q('.menu-detail h1')).not.toBeNull()
    backFromDetail()
    expect(q('.explore-view .menu-pick-card')).not.toBeNull()

    const relation = recipeRestaurantRelations[0]
    const recipe = recipes.find(candidate => candidate.id === relation.recipeId)!
    act(() => root.unmount())
    root = createRoot(container)
    act(() => root.render(<App />))
    const search = q<HTMLInputElement>('.search input')!
    act(() => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(search, recipe.name.en); search.dispatchEvent(new Event('input', { bubbles: true })) })
    click(qa('.recipe-card').find(card => card.textContent?.includes(recipe.name.th))!.querySelector('.food-art'))
    click(q('.recipe-restaurant-bridge .menu-view-details'))
    expect(q('.menu-detail h1')).not.toBeNull()
    backFromDetail()
    expect(q('.detail h1')!.textContent).toBe(recipe.name.th)
  })
})

describe('Slice 36 unchanged boundaries', () => {
  it('keeps the feed ad after the 8th Explore card without adding ads to the grid cards', () => {
    vi.stubEnv('VITE_SHOW_AD_PROTOTYPE', 'true')
    act(() => root.render(<App />))
    click(q('.explore-nav'))
    const grid = q('.explore-view .menu-grid')!
    expect(grid.children[8].getAttribute('data-ad-placement')).toBe('menu-feed')
    expect(qa('.menu-grid-card [data-ad-placement]')).toHaveLength(0)
  })

  it('leaves catalog counts and relation data unchanged', () => {
    expect(restaurants).toHaveLength(13)
    expect(restaurantMenuItems).toHaveLength(84)
    expect(restaurantMenuItems.filter(item => item.price)).toHaveLength(44)
    expect(restaurantMenuItems.filter(item => item.menuImage)).toHaveLength(45) // 22 before Slice 38; 45 after Slice 39A
    expect(restaurants.filter(restaurant => restaurant.logo)).toHaveLength(13)
    expect(restaurants.filter(restaurant => !restaurant.logo)).toHaveLength(0)
    expect(recipeRestaurantRelations).toHaveLength(23)
  })
})

describe('Slice 36 polish', () => {
  const randomFor = (id: string) => {
    for (let i = 0; i < 200; i += 1) {
      const value = i / 200
      if (chooseRandom(restaurants, undefined, () => value)?.id === id) return () => value
    }
    throw new Error(`No random value selects ${id}`)
  }
  const pickIdentity = (id: string) => {
    act(() => root.render(<RestaurantListView locale="en" onOpen={() => undefined} random={randomFor(id)} />))
    click(q('.restaurant-pick-trigger'))
    return q('.restaurant-pick-card .restaurant-identity')!
  }

  it('Random Restaurant shows the official logo when one exists', () => {
    const fuji = restaurants.find(restaurant => restaurant.name.en.includes('Fuji'))!
    expect(fuji.logo).toBeTruthy()
    const identity = pickIdentity(fuji.id)
    expect(identity.getAttribute('data-identity-source')).toBe('logo')
    expect(identity.querySelector('img')?.getAttribute('src')).toBe(fuji.logo!.src)
  })

  it('Random Restaurant shows the new logo for a restaurant that previously had initials (Slice 37B)', () => {
    for (const id of ['salad-factory-thailand', 'santa-fe-steak-thailand', 'zaab-eli-thailand', 'somtam-nua-thailand', 'thongsmith-boat-noodle-thailand']) {
      const restaurant = restaurants.find(r => r.id === id)!
      act(() => root.render(null))
      const identity = pickIdentity(id)
      expect(identity.getAttribute('data-identity-source'), id).toBe('logo')
      expect(identity.querySelector('img')?.getAttribute('src'), id).toBe(restaurant.logo!.src)
    }
  })

  it('menu grid cards stretch to equal row height through layout structure, not fixed pixels', () => {
    const css = readFileSync(resolve(__dirname, 'styles.css'), 'utf8')
    expect(css).toMatch(/\.menu-grid\{align-items:stretch\}/)
    expect(css).toMatch(/\.menu-grid-card\{height:100%;/)
    expect(css).toMatch(/\.menu-grid-body\{flex:1 1 auto;display:flex;flex-direction:column/)
    expect(css).toMatch(/\.menu-grid-body > \.menu-grid-price[^{]*\{margin-top:auto\}/)
    const block = css.split('\n').filter(line => /^\.menu-grid(-card|-body)?\{/.test(line)).join('\n')
    expect(block).not.toMatch(/(?<!max-|min-)height:\s*\d+px/)
    act(() => root.render(<Cards items={[imagePrice, textNoPrice]} />))
    for (const item of [imagePrice, textNoPrice]) {
      const card = cardFor(item)
      expect(card.parentElement!.classList.contains('menu-grid')).toBe(true)
      expect(card.querySelector(':scope > .menu-grid-body')).not.toBeNull()
      expect(card.querySelector('.menu-grid-facts')).not.toBeNull()
    }
  })

  const typeQuery = (value: string) => {
    const input = q<HTMLInputElement>('.explore-view input[type="search"]')!
    act(() => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })) })
  }
  const renderedIds = () => qa('.menu-grid-card').map(card => card.dataset.menuItemId!)

  it('Explore presents image-bearing items first, stably, with the same item set', () => {
    act(() => root.render(<Cards items={restaurantMenuItems} />))
    const ids = renderedIds()
    expect(ids).toEqual(imageFirstMenuItems(restaurantMenuItems).map(item => item.id))
    expect(ids).toHaveLength(84)
    const flags = qa('.menu-grid-card').map(card => card.dataset.hasImage === 'true')
    expect(flags.filter(Boolean)).toHaveLength(45)
    expect(flags.indexOf(false)).toBe(45)
    expect(flags.lastIndexOf(true)).toBe(44)
    expect(ids.filter(id => restaurantMenuItems.find(item => item.id === id)!.menuImage)).toEqual(restaurantMenuItems.filter(item => item.menuImage).map(item => item.id))
    expect(qa('.menu-grid-divider')).toHaveLength(0)
  })

  it('Explore search partitions only the matching candidates and never changes membership', () => {
    act(() => root.render(<Cards items={restaurantMenuItems} />))
    const term = 'chicken'
    typeQuery(term)
    const expected = searchRestaurantMenuItems(restaurantMenuItems, restaurants, term)
    expect(expected.length).toBeGreaterThan(1)
    expect(renderedIds()).toEqual(imageFirstMenuItems(expected).map(item => item.id))
    expect([...renderedIds()].sort()).toEqual(expected.map(item => item.id).sort())
  })

  it('Explore Pick still draws from the unordered candidate set', () => {
    act(() => root.render(<Cards items={restaurantMenuItems} />))
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    click(q('.menu-pick-header .random-button'))
    random.mockRestore()
    expect(q('.menu-pick-card')).not.toBeNull()
    expect(chooseRandom(restaurantMenuItems, undefined, () => 0)!.id).toBe(restaurantMenuItems[0].id)
  })
})

describe('Slice 36 responsive food-image presentation', () => {
  const css = readFileSync(resolve(__dirname, 'styles.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  // Last declaration block for an exact selector (later rules win at equal specificity).
  const finalRule = (selector: string) => {
    const hits = css.split('}').filter(part => part.includes('{')).map(part => {
      const open = part.lastIndexOf('{')
      const head = part.slice(0, open)
      return { selectors: head.slice(head.lastIndexOf('{') + 1).split(',').map(x => x.trim()), body: part.slice(open + 1) }
    }).filter(rule => rule.selectors.includes(selector))
    return hits.at(-1)?.body ?? ''
  }

  it('Recipe Detail hero keeps the source composition instead of a fixed-height cover crop', () => {
    const hero = finalRule('.detail-art')
    expect(hero).toMatch(/height:auto/)
    expect(hero).toMatch(/aspect-ratio:1\/1/)
    expect(finalRule('.detail-art .recipe-image.detail img')).toMatch(/object-fit:contain/)
    // the wrapper's "detail" class must not inherit the page-level min-height:100vh box
    expect(finalRule('.recipe-image.detail')).toMatch(/min-height:0/)
  })

  it('mobile Recipe Cards use one consistent 4:3 media region; desktop keeps the fixed-height card', () => {
    expect(css).toMatch(/@media\(max-width:559px\)\{\.recipe-card \.food-art\{height:auto;aspect-ratio:4\/3\}\}/)
    expect(css).toMatch(/@media\(min-width:560px\)\{[^\n]*\.food-art\{height:150px\}/)
  })

  it('Menu Detail hero preserves the image aspect ratio and browse cards keep their controlled crop', () => {
    expect(finalRule('.menu-detail .menu-item-image-frame')).toMatch(/aspect-ratio:auto/)
    expect(finalRule('.menu-detail .menu-item-image-frame img')).toMatch(/height:auto[^}]*object-fit:contain/)
    expect(finalRule('.menu-grid-card .menu-item-image-frame')).toMatch(/aspect-ratio:4\/3/)
    expect(finalRule('.menu-grid-card .menu-item-image-frame img')).toMatch(/object-fit:cover/)
  })

  it('no-image Menu Detail stays hero-free and a failed hero image collapses', () => {
    act(() => root.render(<App />))
    click(q('.explore-nav'))
    openCard(textPrice)
    expect(q('.menu-detail .menu-item-image')).toBeNull()
    backFromDetail()
    openCard(imagePrice)
    expect(q('.menu-detail .menu-item-image-hero img')).not.toBeNull()
    act(() => { q('.menu-detail .menu-item-image-hero img')!.dispatchEvent(new Event('error')) })
    expect(q('.menu-detail .menu-item-image')).toBeNull()
  })
})
