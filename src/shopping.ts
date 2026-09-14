import { canonicalIngredients } from './pantry'
import type { Ingredient, IngredientUnit, LocalizedText, Recipe } from './types'

export const shoppingStorageKey = 'goodfood-shopping-v1'
export const shoppingPurchasedStorageKey = 'goodfood-shopping-purchased-v1'
export const shoppingMinServings = 1
export const shoppingMaxServings = 20

type ShoppingStore = Pick<Storage, 'getItem' | 'setItem'>

export type ShoppingServingsByRecipeId = Record<string, number>

export type ShoppingSelection = {
  recipeIds: string[]
  servingsByRecipeId: ShoppingServingsByRecipeId
}

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

function readJson(store: Pick<Storage, 'getItem'> | undefined, key: string): unknown {
  try {
    if (!store) return undefined
    return JSON.parse(store.getItem(key) ?? '[]')
  } catch {
    return undefined
  }
}

function writeJson(value: unknown, store: Pick<Storage, 'setItem'> | undefined, key: string): boolean {
  try {
    if (!store) return false
    store.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function normalizeShoppingRecipeIds(ids: readonly string[], validRecipeIds: readonly string[]): string[] {
  const valid = new Set(validRecipeIds)
  return [...new Set(ids)].filter(id => valid.has(id))
}

export function normalizeShoppingServings(value: unknown, baseServings: number): number {
  const fallback = Number.isFinite(baseServings) && Number.isInteger(baseServings)
    ? Math.min(shoppingMaxServings, Math.max(shoppingMinServings, baseServings))
    : shoppingMinServings
  const numeric = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim() !== ''
      ? Number(value)
      : Number.NaN
  if (!Number.isFinite(numeric) || !Number.isInteger(numeric)) return fallback
  return Math.min(shoppingMaxServings, Math.max(shoppingMinServings, numeric))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function rawShoppingState(value: unknown): { recipeIds: string[]; servingsByRecipeId: Record<string, unknown> } {
  if (Array.isArray(value)) {
    return {
      recipeIds: value.filter((id): id is string => typeof id === 'string'),
      servingsByRecipeId: {},
    }
  }
  if (!isRecord(value)) return { recipeIds: [], servingsByRecipeId: {} }
  const recipeIds = Array.isArray(value.recipeIds) ? value.recipeIds.filter((id): id is string => typeof id === 'string') : []
  return {
    recipeIds,
    servingsByRecipeId: isRecord(value.servingsByRecipeId) ? value.servingsByRecipeId : {},
  }
}

export function loadShoppingState(
  store: Pick<Storage, 'getItem'> | undefined = getBrowserStorage(),
  availableRecipes: readonly Pick<Recipe, 'id' | 'servings'>[] = [],
): ShoppingSelection {
  const raw = rawShoppingState(readJson(store, shoppingStorageKey))
  const recipeById = new Map(availableRecipes.map(recipe => [recipe.id, recipe]))
  const recipeIds = availableRecipes.length
    ? normalizeShoppingRecipeIds(raw.recipeIds, availableRecipes.map(recipe => recipe.id))
    : [...new Set(raw.recipeIds)]
  const servingsByRecipeId = Object.fromEntries(recipeIds.map(recipeId => {
    const baseServings = recipeById.get(recipeId)?.servings ?? shoppingMinServings
    return [recipeId, normalizeShoppingServings(raw.servingsByRecipeId[recipeId], baseServings)]
  }))
  return { recipeIds, servingsByRecipeId }
}

export function saveShoppingState(
  state: ShoppingSelection,
  store: Pick<Storage, 'setItem'> | undefined = getBrowserStorage(),
): boolean {
  const recipeIds = [...new Set(state.recipeIds)]
  if (!recipeIds.length) return writeJson([], store, shoppingStorageKey)
  const servingsByRecipeId = Object.fromEntries(recipeIds.map(recipeId => [recipeId, state.servingsByRecipeId[recipeId]]).filter(([, servings]) => servings !== undefined))
  return writeJson({ recipeIds, servingsByRecipeId }, store, shoppingStorageKey)
}

export function loadShoppingSelection(store: Pick<Storage, 'getItem'> | undefined = getBrowserStorage(), validRecipeIds?: readonly string[]): string[] {
  const state = loadShoppingState(store, validRecipeIds?.map(id => ({ id, servings: shoppingMinServings })))
  return state.recipeIds
}

export function saveShoppingSelection(ids: readonly string[], store: Pick<Storage, 'setItem'> | undefined = getBrowserStorage()): boolean {
  return writeStringArray(ids, store, shoppingStorageKey)
}

export function toggleShoppingRecipe(ids: readonly string[], recipeId: string): string[] {
  return ids.includes(recipeId) ? ids.filter(id => id !== recipeId) : [...new Set([...ids, recipeId])]
}

export function emptyShoppingSelection(): ShoppingSelection {
  return { recipeIds: [], servingsByRecipeId: {} }
}

export function toggleShoppingRecipeState(state: ShoppingSelection, recipe: Pick<Recipe, 'id' | 'servings'>): ShoppingSelection {
  if (state.recipeIds.includes(recipe.id)) {
    const servingsByRecipeId = { ...state.servingsByRecipeId }
    delete servingsByRecipeId[recipe.id]
    return { recipeIds: state.recipeIds.filter(id => id !== recipe.id), servingsByRecipeId }
  }
  return {
    recipeIds: [...new Set([...state.recipeIds, recipe.id])],
    servingsByRecipeId: {
      ...state.servingsByRecipeId,
      [recipe.id]: normalizeShoppingServings(recipe.servings, recipe.servings),
    },
  }
}

export function setShoppingRecipeServings(
  state: ShoppingSelection,
  recipe: Pick<Recipe, 'id' | 'servings'>,
  value: unknown,
): ShoppingSelection {
  if (!state.recipeIds.includes(recipe.id)) return state
  const servings = normalizeShoppingServings(value, recipe.servings)
  if (state.servingsByRecipeId[recipe.id] === servings) return state
  return { ...state, servingsByRecipeId: { ...state.servingsByRecipeId, [recipe.id]: servings } }
}

export function adjustShoppingRecipeServings(
  state: ShoppingSelection,
  recipe: Pick<Recipe, 'id' | 'servings'>,
  delta: number,
): ShoppingSelection {
  const current = normalizeShoppingServings(state.servingsByRecipeId[recipe.id], recipe.servings)
  return setShoppingRecipeServings(state, recipe, current + delta)
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

function multiply(left: Rational, right: Rational): Rational {
  return simplify({ numerator: left.numerator * right.numerator, denominator: left.denominator * right.denominator })
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

const fractionGlyphs: Record<string, string> = {
  '1/2': '½',
  '1/3': '⅓',
  '2/3': '⅔',
  '1/4': '¼',
  '3/4': '¾',
  '1/5': '⅕',
  '2/5': '⅖',
  '3/5': '⅗',
  '4/5': '⅘',
  '1/6': '⅙',
  '5/6': '⅚',
  '1/8': '⅛',
  '3/8': '⅜',
  '5/8': '⅝',
  '7/8': '⅞',
}

function formatShoppingQuantity(value: Rational): string {
  const simplified = simplify(value)
  if (simplified.denominator === 1) return String(simplified.numerator)
  const whole = Math.floor(simplified.numerator / simplified.denominator)
  const remainder = simplified.numerator % simplified.denominator
  if (!remainder) return String(whole)
  const fractionKey = `${remainder}/${simplified.denominator}`
  const fraction = fractionGlyphs[fractionKey]
  return fraction
    ? `${whole ? `${whole}` : ''}${fraction}`
    : `${whole ? `${whole} ` : ''}${fractionKey}`
}

function normalizeFallbackIdentity(item: string): string {
  return item.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function shoppingIngredientLineId(ingredient: Pick<Ingredient, 'ingredientId' | 'item' | 'unit'>): string {
  const identity = ingredient.ingredientId ? `canonical:${ingredient.ingredientId}` : `raw:${normalizeFallbackIdentity(ingredient.item.en)}`
  const state = measurementState(ingredient)
  const requirement = productRequirement(ingredient.item.en)
  return `${identity}::${ingredient.unit ?? 'none'}${state ? `::${state}` : ''}${requirement ? `::${requirement}` : ''}`
}

// State refers to the quantity being measured, not what happens during cooking.
// Unspecified quantities are deliberately not inferred to be dry or cooked.
function measurementState(ingredient: Pick<Ingredient, 'ingredientId' | 'item'>): 'dry' | 'cooked' | undefined {
  if (!['whole-wheat-noodles', 'rice-noodles', 'rice-vermicelli', 'glass-noodles', 'soba', 'udon', 'pasta', 'brown-rice', 'jasmine-rice', 'sushi-rice', 'quinoa', 'barley', 'couscous', 'lentils', 'chickpeas'].includes(ingredient.ingredientId ?? '')) return undefined
  if (/\bdry\b/i.test(ingredient.item.en)) return 'dry'
  if (/\bcooked\b/i.test(ingredient.item.en) && !/\bnot cooked\b/i.test(ingredient.item.en)) return 'cooked'
  return undefined
}

function productRequirement(item: string): string | undefined {
  if (/vegetarian.certified/i.test(item)) return 'vegetarian-certified'
  if (/vegetable stock/i.test(item)) return 'vegetable'
  if (/^red lentils/i.test(item)) return 'red-lentils'
  return undefined
}

function displayIngredient(ingredient: Ingredient): { item: LocalizedText; order: number } {
  if (ingredient.ingredientId) {
    const canonical = canonicalIngredients.find(candidate => candidate.id === ingredient.ingredientId)
    if (canonical) {
      const state = measurementState(ingredient)
      // Preserve dietary/product requirements in the list used to buy the food.
      const item = productRequirement(ingredient.item.en) ? ingredient.item : state ? {
        en: `${canonical.name.en} (${state})`,
        th: `${canonical.name.th} (${state === 'dry' ? 'แห้ง' : 'สุก'})`,
      } : canonical.name
      return { item, order: canonicalIngredients.indexOf(canonical) }
    }
  }
  return { item: ingredient.item, order: canonicalIngredients.length }
}

function compareLines(left: ShoppingLine & { order: number }, right: ShoppingLine & { order: number }): number {
  return left.order - right.order || (left.item.en < right.item.en ? -1 : left.item.en > right.item.en ? 1 : 0) || left.id.localeCompare(right.id)
}

export function aggregateShoppingIngredients(
  items: readonly Recipe[],
  selectedRecipeIds: readonly string[],
  servingsByRecipeId: Readonly<Record<string, number>> = {},
): ShoppingLine[] {
  const recipesById = new Map(items.map(recipe => [recipe.id, recipe]))
  const selectedIds = [...new Set(selectedRecipeIds)].filter(id => recipesById.has(id))
  const numericLines = new Map<string, ShoppingLine & { total: Rational; order: number }>()
  const nonNumericLines: Array<ShoppingLine & { order: number }> = []

  for (const recipeId of selectedIds) {
    const recipe = recipesById.get(recipeId)
    if (!recipe) continue
    const targetServings = normalizeShoppingServings(servingsByRecipeId[recipe.id], recipe.servings)
    const scale = { numerator: targetServings, denominator: recipe.servings }
    recipe.ingredients.forEach((ingredient, ingredientIndex) => {
      const baseId = shoppingIngredientLineId(ingredient)
      const display = displayIngredient(ingredient)
      const quantity = parseShoppingQuantity(ingredient.quantity)
      if (!quantity) {
        nonNumericLines.push({ id: `${baseId}::non-numeric:${recipe.id}:${ingredientIndex}`, ingredientId: ingredient.ingredientId, item: display.item, quantity: String(ingredient.quantity), unit: ingredient.unit, aggregatable: false, order: display.order })
        return
      }

      const scaledQuantity = multiply(quantity, scale)

      const existing = numericLines.get(baseId)
      if (existing) {
        existing.total = simplify({ numerator: existing.total.numerator * scaledQuantity.denominator + scaledQuantity.numerator * existing.total.denominator, denominator: existing.total.denominator * scaledQuantity.denominator })
      } else {
        numericLines.set(baseId, { id: baseId, ingredientId: ingredient.ingredientId, item: display.item, quantity: formatShoppingQuantity(scaledQuantity), unit: ingredient.unit, aggregatable: true, total: scaledQuantity, order: display.order })
      }
    })
  }

  const lines = [...numericLines.values()].map(({ total, order, ...line }) => ({ ...line, quantity: formatShoppingQuantity(total), order }))
  return [...lines, ...nonNumericLines].sort(compareLines).map(({ order: _order, ...line }) => line)
}
