import { canonicalIngredients } from './pantry'
import type { Ingredient, IngredientUnit, LocalizedText, Recipe } from './types'

export const shoppingStorageKey = 'goodfood-shopping-v1'
export const shoppingPurchasedStorageKey = 'goodfood-shopping-purchased-v1'

type ShoppingStore = Pick<Storage, 'getItem' | 'setItem'>

function getBrowserStorage(): ShoppingStore | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

function readStringArray(store: Pick<Storage, 'getItem'> | undefined, key: string): string[] {
  try {
    if (!store) return []
    const value = JSON.parse(store.getItem(key) ?? '[]')
    return Array.isArray(value) && value.every(item => typeof item === 'string') ? [...new Set(value)] : []
  } catch {
    return []
  }
}

function writeStringArray(ids: readonly string[], store: Pick<Storage, 'setItem'> | undefined, key: string): boolean {
  try {
    if (!store) return false
    store.setItem(key, JSON.stringify([...new Set(ids)]))
    return true
  } catch {
    return false
  }
}

export function normalizeShoppingRecipeIds(ids: readonly string[], validRecipeIds: readonly string[]): string[] {
  const valid = new Set(validRecipeIds)
  return [...new Set(ids)].filter(id => valid.has(id))
}

export function loadShoppingSelection(store: Pick<Storage, 'getItem'> | undefined = getBrowserStorage(), validRecipeIds?: readonly string[]): string[] {
  const ids = readStringArray(store, shoppingStorageKey)
  return validRecipeIds ? normalizeShoppingRecipeIds(ids, validRecipeIds) : ids
}

export function saveShoppingSelection(ids: readonly string[], store: Pick<Storage, 'setItem'> | undefined = getBrowserStorage()): boolean {
  return writeStringArray(ids, store, shoppingStorageKey)
}

export function toggleShoppingRecipe(ids: readonly string[], recipeId: string): string[] {
  return ids.includes(recipeId) ? ids.filter(id => id !== recipeId) : [...new Set([...ids, recipeId])]
}

export function loadPurchasedShoppingLines(store: Pick<Storage, 'getItem'> | undefined = getBrowserStorage()): string[] {
  return readStringArray(store, shoppingPurchasedStorageKey)
}

export function savePurchasedShoppingLines(ids: readonly string[], store: Pick<Storage, 'setItem'> | undefined = getBrowserStorage()): boolean {
  return writeStringArray(ids, store, shoppingPurchasedStorageKey)
}

export function togglePurchasedShoppingLine(ids: readonly string[], lineId: string): string[] {
  return ids.includes(lineId) ? ids.filter(id => id !== lineId) : [...new Set([...ids, lineId])]
}

export type ShoppingLine = {
  id: string
  ingredientId?: string
  item: LocalizedText
  quantity: string
  unit?: IngredientUnit
  aggregatable: boolean
}

type Rational = { numerator: number; denominator: number }

const fractionValues: Record<string, number> = { '¼': 1, '½': 2, '¾': 3 }
const fractionLabels = ['', '¼', '½', '¾']

function greatestCommonDivisor(a: number, b: number): number {
  let left = Math.abs(a)
  let right = Math.abs(b)
  while (right) [left, right] = [right, left % right]
  return left || 1
}

function simplify(value: Rational): Rational {
  const divisor = greatestCommonDivisor(value.numerator, value.denominator)
  return { numerator: value.numerator / divisor, denominator: value.denominator / divisor }
}

function parseShoppingQuantity(value: string | number): Rational | undefined {
  const raw = String(value).trim().replace(/\s+/g, '')
  if (raw === 'a' || raw === 'an' || raw.includes('–') || raw.includes('-')) return undefined

  const decimal = raw.match(/^(\d+)(?:\.(\d+))?$/)
  if (decimal) {
    const fractionDigits = decimal[2] ?? ''
    const denominator = 10 ** fractionDigits.length
    return { numerator: Number(decimal[1]) * denominator + Number(fractionDigits || 0), denominator }
  }

  const fraction = raw.match(/^(\d+)?([¼½¾])$/)
  if (!fraction) return undefined
  const whole = Number(fraction[1] ?? 0)
  return { numerator: whole * 4 + fractionValues[fraction[2]], denominator: 4 }
}

function formatShoppingQuantity(value: Rational): string {
  const simplified = simplify(value)
  const quarterValue = simplified.numerator * 4 / simplified.denominator
  if (Number.isInteger(quarterValue)) {
    const whole = Math.floor(quarterValue / 4)
    const fraction = quarterValue % 4
    return `${whole || ''}${fractionLabels[fraction]}` || '0'
  }

  const decimal = (simplified.numerator / simplified.denominator).toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
  return decimal || '0'
}

function normalizeFallbackIdentity(item: string): string {
  return item.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function shoppingIngredientLineId(ingredient: Pick<Ingredient, 'ingredientId' | 'item' | 'unit'>): string {
  const identity = ingredient.ingredientId ? `canonical:${ingredient.ingredientId}` : `raw:${normalizeFallbackIdentity(ingredient.item.en)}`
  return `${identity}::${ingredient.unit ?? 'none'}`
}

function displayIngredient(ingredient: Ingredient): { item: LocalizedText; order: number } {
  if (ingredient.ingredientId) {
    const canonical = canonicalIngredients.find(candidate => candidate.id === ingredient.ingredientId)
    if (canonical) return { item: canonical.name, order: canonicalIngredients.indexOf(canonical) }
  }
  return { item: ingredient.item, order: canonicalIngredients.length }
}

function compareLines(left: ShoppingLine & { order: number }, right: ShoppingLine & { order: number }): number {
  return left.order - right.order || (left.item.en < right.item.en ? -1 : left.item.en > right.item.en ? 1 : 0) || left.id.localeCompare(right.id)
}

export function aggregateShoppingIngredients(items: readonly Recipe[], selectedRecipeIds: readonly string[]): ShoppingLine[] {
  const recipesById = new Map(items.map(recipe => [recipe.id, recipe]))
  const selectedIds = [...new Set(selectedRecipeIds)].filter(id => recipesById.has(id))
  const numericLines = new Map<string, ShoppingLine & { total: Rational; order: number }>()
  const nonNumericLines: Array<ShoppingLine & { order: number }> = []

  for (const recipeId of selectedIds) {
    const recipe = recipesById.get(recipeId)
    if (!recipe) continue
    recipe.ingredients.forEach((ingredient, ingredientIndex) => {
      const baseId = shoppingIngredientLineId(ingredient)
      const display = displayIngredient(ingredient)
      const quantity = parseShoppingQuantity(ingredient.quantity)
      if (!quantity) {
        nonNumericLines.push({ id: `${baseId}::non-numeric:${recipe.id}:${ingredientIndex}`, ingredientId: ingredient.ingredientId, item: display.item, quantity: String(ingredient.quantity), unit: ingredient.unit, aggregatable: false, order: display.order })
        return
      }

      const existing = numericLines.get(baseId)
      if (existing) {
        existing.total = simplify({ numerator: existing.total.numerator * quantity.denominator + quantity.numerator * existing.total.denominator, denominator: existing.total.denominator * quantity.denominator })
      } else {
        numericLines.set(baseId, { id: baseId, ingredientId: ingredient.ingredientId, item: display.item, quantity: formatShoppingQuantity(quantity), unit: ingredient.unit, aggregatable: true, total: simplify(quantity), order: display.order })
      }
    })
  }

  const lines = [...numericLines.values()].map(({ total, order, ...line }) => ({ ...line, quantity: formatShoppingQuantity(total), order }))
  return [...lines, ...nonNumericLines].sort(compareLines).map(({ order: _order, ...line }) => line)
}
