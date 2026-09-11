import { describe, expect, it } from 'vitest'
import { adjustShoppingRecipeServings, aggregateShoppingIngredients, emptyShoppingSelection, loadPurchasedShoppingLines, loadShoppingSelection, loadShoppingState, normalizeShoppingServings, savePurchasedShoppingLines, saveShoppingSelection, saveShoppingState, shoppingMaxServings, shoppingMinServings, shoppingStorageKey, togglePurchasedShoppingLine, toggleShoppingRecipe, toggleShoppingRecipeState } from './shopping'
import { recipes } from './recipes'
import type { Ingredient, Recipe } from './types'

function ingredient(item: string, quantity: string | number, unit?: Ingredient['unit'], ingredientId?: string): Ingredient {
  return { item: { th: item, en: item }, quantity, unit, ingredientId }
}

function recipe(id: string, ingredients: Ingredient[], servings = 1): Recipe {
  return {
    id,
    sourceId: id,
    name: { th: id, en: id },
    category: 'Quick meals',
    cuisine: { th: 'นานาชาติ', en: 'International' },
    servings,
    prepMinutes: 1,
    cookMinutes: 1,
    ingredients,
    instructions: [{ th: 'ทำ', en: 'Cook' }],
    nutrition: { kcal: 100, protein: 10, carbs: 10, fat: 2 },
    tags: [],
    accent: 'lime',
    image: `/recipes/${id}.webp`,
  }
}

function line(lines: ReturnType<typeof aggregateShoppingIngredients>, id: string) {
  const found = lines.find(item => item.id === id)
  if (!found) throw new Error(`Missing shopping line: ${id}`)
  return found
}

describe('shopping aggregation', () => {
  it('aggregates one recipe, deduplicates recipe IDs, and ignores stale IDs', () => {
    const items = [
      recipe('first', [ingredient('Cucumber, ribbons', '150', 'g', 'cucumber'), ingredient('Eggs', '1', 'egg', 'eggs'), ingredient('Olive oil', '1', 'tsp')]),
      recipe('second', [ingredient('Cucumber, chopped', '200', 'g', 'cucumber'), ingredient('Eggs', '2', 'egg', 'eggs')]),
    ]
    const lines = aggregateShoppingIngredients(items, ['first', 'first', 'second', 'stale-id'])

    expect(line(lines, 'canonical:cucumber::g').quantity).toBe('350')
    expect(line(lines, 'canonical:eggs::egg').quantity).toBe('3')
    expect(line(lines, 'raw:olive-oil::tsp').quantity).toBe('1')
    expect(lines).toHaveLength(3)
  })

  it('keeps incompatible units separate while merging canonical identities', () => {
    const items = [
      recipe('grams', [ingredient('Fresh tomatoes', '100', 'g', 'tomatoes')]),
      recipe('pieces', [ingredient('Tomatoes, whole', '2', 'medium', 'tomatoes')]),
    ]
    const lines = aggregateShoppingIngredients(items, ['grams', 'pieces'])

    expect(line(lines, 'canonical:tomatoes::g')).toMatchObject({ quantity: '100', item: { en: 'Tomatoes' } })
    expect(line(lines, 'canonical:tomatoes::medium')).toMatchObject({ quantity: '2', item: { en: 'Tomatoes' } })
    expect(lines).toHaveLength(2)
  })

  it('sums integer, half, mixed, and quarter fractions without floating-point artifacts', () => {
    const items = [
      recipe('halves', [ingredient('Rice', '½', 'cup', 'brown-rice'), ingredient('Quinoa', '1½', 'cup', 'quinoa'), ingredient('Barley', '¼', 'cup', 'barley')]),
      recipe('halves-two', [ingredient('Rice', '½', 'cup', 'brown-rice'), ingredient('Quinoa', '½', 'cup', 'quinoa'), ingredient('Barley', '¾', 'cup', 'barley')]),
    ]
    const lines = aggregateShoppingIngredients(items, ['halves', 'halves-two'])

    expect(line(lines, 'canonical:brown-rice::cup').quantity).toBe('1')
    expect(line(lines, 'canonical:quinoa::cup').quantity).toBe('2')
    expect(line(lines, 'canonical:barley::cup').quantity).toBe('1')
    expect(lines.every(item => !/[0-9]\.[0-9]{3,}/.test(item.quantity))).toBe(true)
  })

  it('preserves non-numeric quantities instead of guessing', () => {
    const items = [
      recipe('range', [ingredient('Bird’s eye chilli, sliced', '1–2')]),
      recipe('numeric', [ingredient('Bird’s eye chilli, sliced', '2')]),
    ]
    const lines = aggregateShoppingIngredients(items, ['range', 'numeric'])

    expect(lines).toHaveLength(2)
    expect(lines.find(item => item.quantity === '1–2')?.aggregatable).toBe(false)
    expect(lines.find(item => item.quantity === '2')?.aggregatable).toBe(true)
  })

  it('recalculates totals when a recipe is removed and keeps identity independent of locale', () => {
    const items = [
      recipe('one', [ingredient('Cucumber', '150', 'g', 'cucumber')]),
      recipe('two', [ingredient('Cucumber', '200', 'g', 'cucumber')]),
    ]
    const both = aggregateShoppingIngredients(items, ['one', 'two'])
    const one = aggregateShoppingIngredients(items, ['one'])

    expect(line(both, 'canonical:cucumber::g').quantity).toBe('350')
    expect(line(one, 'canonical:cucumber::g').quantity).toBe('150')
    expect(line(both, 'canonical:cucumber::g').id).toBe(line(one, 'canonical:cucumber::g').id)
  })

  it('keeps the base quantity by default and scales integer quantities per recipe', () => {
    const items = [recipe('chicken', [ingredient('Chicken', '260', 'g', 'chicken')], 2)]

    expect(line(aggregateShoppingIngredients(items, ['chicken']), 'canonical:chicken::g').quantity).toBe('260')
    expect(line(aggregateShoppingIngredients(items, ['chicken'], { chicken: 2 }), 'canonical:chicken::g').quantity).toBe('260')
    expect(line(aggregateShoppingIngredients(items, ['chicken'], { chicken: 4 }), 'canonical:chicken::g').quantity).toBe('520')
    expect(line(aggregateShoppingIngredients(items, ['chicken'], { chicken: 1 }), 'canonical:chicken::g').quantity).toBe('130')
    expect(line(aggregateShoppingIngredients(items, ['chicken'], { chicken: 3 }), 'canonical:chicken::g').quantity).toBe('390')
  })

  it('scales exact simple and mixed fractions before aggregation', () => {
    const items = [
      recipe('half', [ingredient('Rice', '½', 'cup', 'brown-rice')], 2),
      recipe('mixed', [ingredient('Sauce', '1½', 'tbsp', 'sauce')], 3),
      recipe('quarter', [ingredient('Flour', '¼', 'cup', 'flour')], 1),
    ]

    expect(line(aggregateShoppingIngredients(items, ['half'], { half: 3 }), 'canonical:brown-rice::cup').quantity).toBe('¾')
    expect(line(aggregateShoppingIngredients(items, ['mixed'], { mixed: 2 }), 'canonical:sauce::tbsp').quantity).toBe('1')
    expect(line(aggregateShoppingIngredients(items, ['quarter'], { quarter: 3 }), 'canonical:flour::cup').quantity).toBe('¾')
    expect(line(aggregateShoppingIngredients(items, ['half'], { half: 1 }), 'canonical:brown-rice::cup').quantity).toBe('¼')
  })

  it('scales each recipe independently before canonical aggregation', () => {
    const items = [
      recipe('a', [ingredient('Mushrooms', '150', 'g', 'mushrooms')], 2),
      recipe('b', [ingredient('Mushrooms', '180', 'g', 'mushrooms')], 4),
    ]

    expect(line(aggregateShoppingIngredients(items, ['a', 'b'], { a: 4, b: 2 }), 'canonical:mushrooms::g').quantity).toBe('390')
    expect(aggregateShoppingIngredients(items, ['a', 'b'], { a: 4, b: 2 }).map(item => item.id)).toEqual(['canonical:mushrooms::g'])
  })

  it('keeps non-scalable quantities deterministic', () => {
    const items = [recipe('range', [ingredient('Chilli', '1–2', undefined, 'chilli')], 2)]
    const lines = aggregateShoppingIngredients(items, ['range'], { range: 4 })

    expect(lines).toHaveLength(1)
    expect(lines[0]).toMatchObject({ quantity: '1–2', aggregatable: false })
  })
})

describe('shopping persistence', () => {
  it('persists recipe IDs, purchased line IDs, deduplicates, ignores stale IDs, and clears', () => {
    const values = new Map<string, string>()
    const store = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
    }

    expect(saveShoppingSelection(['first', 'first', 'stale'], store)).toBe(true)
    expect(loadShoppingSelection(store, ['first', 'second'])).toEqual(['first'])
    expect(values.has(shoppingStorageKey)).toBe(true)

    expect(toggleShoppingRecipe(['first'], 'second')).toEqual(['first', 'second'])
    expect(toggleShoppingRecipe(['first', 'second'], 'first')).toEqual(['second'])
    expect(savePurchasedShoppingLines(['canonical:cucumber::g'], store)).toBe(true)
    expect(loadPurchasedShoppingLines(store)).toEqual(['canonical:cucumber::g'])
    expect(togglePurchasedShoppingLine(['canonical:cucumber::g'], 'canonical:eggs::egg')).toEqual(['canonical:cucumber::g', 'canonical:eggs::egg'])
    expect(togglePurchasedShoppingLine(['canonical:cucumber::g'], 'canonical:cucumber::g')).toEqual([])

    expect(saveShoppingSelection([], store)).toBe(true)
    expect(savePurchasedShoppingLines([], store)).toBe(true)
    expect(loadShoppingSelection(store, ['first', 'second'])).toEqual([])
    expect(loadPurchasedShoppingLines(store)).toEqual([])
  })

  it('loads old array storage with base servings and migrates valid serving overrides', () => {
    const values = new Map<string, string>()
    const store = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
    }
    const available = [recipe('first', [ingredient('Rice', '1', 'cup')], 2), recipe('second', [ingredient('Rice', '1', 'cup')], 4)]

    values.set(shoppingStorageKey, JSON.stringify(['first', 'stale']))
    expect(loadShoppingState(store, available)).toEqual({ recipeIds: ['first'], servingsByRecipeId: { first: 2 } })

    values.set(shoppingStorageKey, JSON.stringify({ recipeIds: ['first', 'second', 'stale'], servingsByRecipeId: { first: 4, second: 0, stale: 19 } }))
    expect(loadShoppingState(store, available)).toEqual({ recipeIds: ['first', 'second'], servingsByRecipeId: { first: 4, second: 1 } })
    expect(saveShoppingState({ recipeIds: ['first'], servingsByRecipeId: { first: 3, stale: 20 } }, store)).toBe(true)
    expect(JSON.parse(values.get(shoppingStorageKey)!)).toEqual({ recipeIds: ['first'], servingsByRecipeId: { first: 3 } })
  })

  it('normalizes serving values and clears an override when a recipe is removed and re-added', () => {
    expect(normalizeShoppingServings(0, 2)).toBe(shoppingMinServings)
    expect(normalizeShoppingServings(-2, 2)).toBe(shoppingMinServings)
    expect(normalizeShoppingServings(21, 2)).toBe(shoppingMaxServings)
    expect(normalizeShoppingServings('garbage', 2)).toBe(2)
    expect(normalizeShoppingServings(1.5, 2)).toBe(2)

    const selected = toggleShoppingRecipeState(emptyShoppingSelection(), { id: 'first', servings: 2 })
    const adjusted = adjustShoppingRecipeServings(selected, { id: 'first', servings: 2 }, 2)
    expect(adjusted).toEqual({ recipeIds: ['first'], servingsByRecipeId: { first: 4 } })
    const removed = toggleShoppingRecipeState(adjusted, { id: 'first', servings: 2 })
    expect(removed).toEqual(emptyShoppingSelection())
    expect(toggleShoppingRecipeState(removed, { id: 'first', servings: 2 })).toEqual({ recipeIds: ['first'], servingsByRecipeId: { first: 2 } })
  })

  it('aggregates the production catalog with its current quantity representation', () => {
    const lines = aggregateShoppingIngredients(recipes, ['tom-yum-prawns'])
    expect(lines.some(item => item.id === 'canonical:prawns::g' && item.quantity === '220')).toBe(true)
    expect(lines.every(item => item.quantity.trim().length > 0)).toBe(true)
  })
})
