// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RestaurantIdentity, fallbackRestaurantIdentityMark, restaurantIdentityMark } from './restaurant-identity'
import { restaurants } from './restaurants'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('RestaurantIdentity', () => {
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

  it('renders the four pilot text marks without replacing their restaurant names', () => {
    const pilotIds = ['seven-eleven-thailand', 'salad-factory-thailand', 'sukiya-thailand', 'nittaya-kai-yang-thailand']
    const pilotRestaurants = restaurants.filter(restaurant => pilotIds.includes(restaurant.id))
    act(() => root.render(<div>{pilotRestaurants.map(restaurant => <div key={restaurant.id}><RestaurantIdentity restaurant={restaurant} locale="en" />{restaurant.name.en}</div>)}</div>))

    expect([...container.querySelectorAll('[data-identity-source="pilot"]')].map(node => node.textContent)).toEqual(['SF', '7', 'SK', 'NKY'])
    for (const restaurant of pilotRestaurants) expect(container.textContent).toContain(restaurant.name.en)
  })

  it('uses a deterministic neutral fallback for non-pilot and malformed optional data', () => {
    const fallbackRestaurant = restaurants.find(restaurant => restaurant.id === 'ootoya-thailand')!
    const malformed = { ...fallbackRestaurant, visualIdentity: { kind: 'initials', label: undefined } } as typeof fallbackRestaurant

    expect(fallbackRestaurantIdentityMark(fallbackRestaurant)).toBe('OO')
    expect(fallbackRestaurantIdentityMark({ name: { th: 'เอ็มเคสุกี้', en: '' } })).toBe('เอ')
    expect(restaurantIdentityMark(malformed, 'th')).toEqual({ mark: 'OO', source: 'fallback' })
  })

  it('keeps identity decorative and safe when rendered in Thai', () => {
    const restaurant = restaurants.find(candidate => candidate.id === 'nittaya-kai-yang-thailand')!
    act(() => root.render(<RestaurantIdentity restaurant={restaurant} locale="th" size="md" />))

    const identity = container.querySelector('[data-restaurant-identity]')
    expect(identity?.textContent).toBe('นก')
    expect(identity?.getAttribute('aria-hidden')).toBe('true')
    expect(identity?.className).toContain('restaurant-identity-md')
  })
})
