import type { Locale, Restaurant } from './types'

export type RestaurantIdentitySize = 'xs' | 'sm' | 'md'

function sourceName(restaurant: Pick<Restaurant, 'name'>): string {
  const englishName = typeof restaurant.name?.en === 'string' ? restaurant.name.en.trim() : ''
  const thaiName = typeof restaurant.name?.th === 'string' ? restaurant.name.th.trim() : ''
  return englishName || thaiName
}

/**
 * Produces a stable, app-owned fallback mark. It is derived from the English
 * display name when available so the same neutral marker survives locale
 * changes without pretending to be a restaurant logo.
 */
export function fallbackRestaurantIdentityMark(restaurant: Pick<Restaurant, 'name'>): string {
  const name = sourceName(restaurant)
  const words = name.replace(/&/g, ' ').replace(/[^0-9A-Za-zก-๙]+/g, ' ').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return '•'
  if (words.length === 1) return words[0].slice(0, 2).toLocaleUpperCase()
  return words.slice(0, 3).map(word => word[0]).join('').toLocaleUpperCase()
}

export function restaurantIdentityMark(restaurant: Restaurant, locale: Locale): { mark: string; source: 'pilot' | 'fallback' } {
  const configured = restaurant.visualIdentity
  const configuredLabel = configured?.kind === 'initials' && typeof configured.label?.[locale] === 'string'
    ? configured.label[locale].trim()
    : ''
  return configuredLabel ? { mark: configuredLabel, source: 'pilot' } : { mark: fallbackRestaurantIdentityMark(restaurant), source: 'fallback' }
}

export function RestaurantIdentity({ restaurant, locale, size = 'sm' }: { restaurant: Restaurant; locale: Locale; size?: RestaurantIdentitySize }) {
  const identity = restaurantIdentityMark(restaurant, locale)
  return <span className={`restaurant-identity restaurant-identity-${size} restaurant-identity-${identity.source}`} data-restaurant-identity={restaurant.id} data-identity-source={identity.source} aria-hidden="true">{identity.mark}</span>
}
