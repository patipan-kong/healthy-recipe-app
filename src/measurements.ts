import type { Locale, Ingredient, IngredientUnit } from './types'

export const ingredientUnits: readonly IngredientUnit[] = [
  'g', 'ml', 'tbsp', 'tsp', 'cup', 'packed-cup', 'small-bundle',
  'small', 'medium', 'large', 'clove', 'leaf', 'slice', 'stalk', 'pinch', 'egg', 'sheet',
]

export const ingredientUnitLabels: Record<IngredientUnit, { th: string; en: string }> = {
  g: { th: 'กรัม', en: 'g' },
  ml: { th: 'มล.', en: 'ml' },
  tbsp: { th: 'ช้อนโต๊ะ', en: 'tbsp' },
  tsp: { th: 'ช้อนชา', en: 'tsp' },
  cup: { th: 'ถ้วย', en: 'cup' },
  'packed-cup': { th: 'ถ้วยอัดแน่น', en: 'packed cup' },
  'small-bundle': { th: 'มัดเล็ก', en: 'small bundle' },
  small: { th: 'ลูกเล็ก', en: 'small' },
  medium: { th: 'ลูกกลาง', en: 'medium' },
  large: { th: 'ลูกใหญ่', en: 'large' },
  clove: { th: 'กลีบ', en: 'clove' },
  leaf: { th: 'ใบ', en: 'leaf' },
  slice: { th: 'แผ่น', en: 'slice' },
  stalk: { th: 'ต้น', en: 'stalk' },
  pinch: { th: 'เล็กน้อย', en: 'pinch' },
  egg: { th: 'ฟอง', en: 'egg' },
  sheet: { th: 'แผ่น', en: 'sheet' },
}

const pluralUnits = new Set<IngredientUnit>(['cup', 'packed-cup', 'small-bundle', 'clove', 'leaf', 'slice', 'stalk', 'egg', 'sheet'])
const irregularPlural: Partial<Record<IngredientUnit, string>> = { leaf: 'leaves' }
const unitAliases: Record<string, IngredientUnit> = {
  g: 'g', ml: 'ml', tbsp: 'tbsp', tsp: 'tsp', cup: 'cup', cups: 'cup',
  'packed cup': 'packed-cup', 'small bundle': 'small-bundle',
  small: 'small', medium: 'medium', large: 'large',
  clove: 'clove', cloves: 'clove', leaf: 'leaf', leaves: 'leaf',
  slice: 'slice', slices: 'slice', stalk: 'stalk', stalks: 'stalk', pinch: 'pinch',
  egg: 'egg', eggs: 'egg', sheet: 'sheet', sheets: 'sheet',
}

const quantityPattern = /^(?:a|an|(?:\d+(?:[¼½¾])?|[¼½¾])(?:\s?[–-]\s?(?:\d+(?:[¼½¾])?|[¼½¾]))?)$/

function normalizeQuantity(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function isValidIngredientQuantity(value: unknown): value is string | number {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0
  if (typeof value !== 'string') return false
  const quantity = normalizeQuantity(value)
  return quantityPattern.test(quantity) || /^\d+(?:\.\d+)?$/.test(quantity)
}

function inferBareUnit(item: string | undefined): IngredientUnit | undefined {
  const normalized = item?.toLocaleLowerCase() ?? ''
  if (/\beggs?\b/.test(normalized)) return 'egg'
  if (/\bleaves\b/.test(normalized)) return 'leaf'
  if (/\bsheets\b/.test(normalized)) return 'sheet'
  return undefined
}

export function isIngredientUnit(value: unknown): value is IngredientUnit {
  return typeof value === 'string' && (ingredientUnits as readonly string[]).includes(value)
}

export function parseIngredientMeasurement(amount: string, item?: string): Pick<Ingredient, 'quantity' | 'unit'> {
  const raw = normalizeQuantity(amount)
  if (!raw) throw new Error('Ingredient measurement is empty')

  const match = raw.match(/^(.+?)\s+(.+)$/)
  if (!match) {
    if (!isValidIngredientQuantity(raw)) throw new Error(`Invalid ingredient quantity: ${amount}`)
    return { quantity: raw, unit: inferBareUnit(item) }
  }

  const quantity = normalizeQuantity(match[1])
  const unitText = match[2].toLocaleLowerCase()
  const unit = unitAliases[unitText]
  if (!isValidIngredientQuantity(quantity) || !unit) throw new Error(`Unknown ingredient measurement: ${amount}`)
  return { quantity, unit }
}

function isPluralQuantity(quantity: string) {
  const normalized = quantity.replace(/\s+/g, '')
  return normalized !== '1' && normalized !== 'a' && normalized !== 'an' && normalized !== '¼' && normalized !== '½' && normalized !== '¾'
}

function englishUnit(unit: IngredientUnit, quantity: string) {
  const label = ingredientUnitLabels[unit].en
  if (!pluralUnits.has(unit) || !isPluralQuantity(quantity)) return label
  return irregularPlural[unit] ?? `${label}s`
}

export function formatIngredientAmount(ingredient: Pick<Ingredient, 'quantity' | 'unit'>, locale: Locale): string {
  const quantity = String(ingredient.quantity ?? '').trim()
  if (!quantity) return ''
  if (!ingredient.unit) return quantity
  if (locale === 'th' && ingredient.unit === 'pinch' && (quantity === 'a' || quantity === 'an')) return ingredientUnitLabels.pinch.th
  const label = locale === 'en' ? englishUnit(ingredient.unit, quantity) : ingredientUnitLabels[ingredient.unit].th
  return `${quantity} ${label}`
}
