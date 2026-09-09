const key = 'healthy-recipe-favorites-v1'

type FavoriteStore = Pick<Storage, 'getItem' | 'setItem'>

function getBrowserStorage(): FavoriteStore | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export function loadFavorites(store: Pick<Storage, 'getItem'> | undefined = getBrowserStorage()): string[] {
  try {
    if (!store) return []
    const value = JSON.parse(store.getItem(key) ?? '[]')
    return Array.isArray(value) && value.every(id => typeof id === 'string') ? [...new Set(value)] : []
  } catch { return [] }
}

export function saveFavorites(ids: string[], store: Pick<Storage, 'setItem'> | undefined = getBrowserStorage()): boolean {
  try {
    if (!store) return false
    store.setItem(key, JSON.stringify([...new Set(ids)]))
    return true
  } catch {
    return false
  }
}

export function toggleFavorite(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]
}
