import { describe, expect, it } from 'vitest'
import { chooseRandom, filterRecipes, recipes, searchRecipes, validateRecipes } from './recipes'
import { loadFavorites, saveFavorites, toggleFavorite } from './favorites'
import { normalizeFavorites } from './App'

describe('recipe filtering', () => {
  it('uses AND semantics across category, nutrition, and tags', () => {
    const results = filterRecipes(recipes, { category: 'High protein', maxKcal: 430, minProtein: 30, tags: ['Meal prep'] })
    expect(results.map(recipe => recipe.id)).toEqual(['herb-grilled-chicken', 'grilled-mackerel-bowl', 'thai-steamed-chicken-cabbage', 'japanese-cabbage-pork-steam', 'steamed-chicken-ginger-scallion'])
  })
  it('applies numeric nutrition limits including sodium', () => {
    const results = filterRecipes(recipes, { category: 'Thai favorites', maxKcal: 250, minProtein: 24, maxCarbs: 15, maxFat: 12, maxSodium: 650, tags: [] })
    expect(results.map(recipe => recipe.id)).toEqual(['tofu-mince-soup'])
  })
  it('returns an empty result gracefully when nothing fits', () => expect(filterRecipes(recipes, { category: '', maxKcal: 20, tags: [] })).toEqual([]))
  it('does not treat unknown sodium as zero under an active sodium limit', () => {
    const unknownSodium = { ...recipes[0], nutrition: { ...recipes[0].nutrition, sodium: undefined } }
    expect(filterRecipes([unknownSodium], { category: '', maxSodium: 0, tags: [] })).toEqual([])
  })
})

describe('recipe search', () => {
  it('matches ingredient names and normalizes surrounding whitespace', () => {
    expect(searchRecipes(recipes, '  garlic  ').map(recipe => recipe.id)).toEqual(['tofu-mince-soup', 'herb-grilled-chicken', 'steamed-lime-seabass', 'broccoli-prawn-stirfry', 'chicken-basil-rice-egg', 'lean-beef-bibimbap', 'mediterranean-chicken-bowl', 'thai-steamed-fish-ginger', 'thai-vegetable-pad-see-ew', 'thai-salmon-nam-jim', 'thai-steamed-chicken-cabbage', 'thai-beef-basil-mushroom', 'thai-papaya-tofu-salad', 'korean-beef-lettuce-bowl', 'korean-salmon-rice-bowl', 'korean-bean-sprout-chicken-soup', 'baked-cod-lemon-herbs', 'turkey-meatballs-tomato-quinoa', 'mushroom-barley-bowl', 'shakshuka-whole-wheat-toast', 'black-bean-sweet-potato-chili'])
  })
  it('searches Thai and English recipe content across language modes', () => {
    expect(searchRecipes(recipes, 'ไก่ย่างแจ่ว').map(recipe => recipe.id)).toContain('grilled-chicken-jaew')
    expect(searchRecipes(recipes, 'grilled chicken with jaew').map(recipe => recipe.id)).toContain('grilled-chicken-jaew')
    expect(searchRecipes(recipes, 'อกไก่').map(recipe => recipe.id)).toContain('grilled-chicken-jaew')
    expect(searchRecipes(recipes, 'skinless chicken breast').map(recipe => recipe.id)).toContain('grilled-chicken-jaew')
  })
  it('searches newly added Thai and English names and ingredients', () => {
    expect(searchRecipes(recipes, 'ปลานึ่งขิงซีอิ๊ว').map(recipe => recipe.id)).toContain('thai-steamed-fish-ginger')
    expect(searchRecipes(recipes, 'Thai Steamed Fish with Ginger').map(recipe => recipe.id)).toContain('thai-steamed-fish-ginger')
    expect(searchRecipes(recipes, 'มันหวาน').map(recipe => recipe.id)).toContain('black-bean-sweet-potato-chili')
    expect(searchRecipes(recipes, 'sweet potato').map(recipe => recipe.id)).toContain('black-bean-sweet-potato-chili')
  })
  it('returns every recipe for a whitespace-only query', () => expect(searchRecipes(recipes, '   ')).toHaveLength(recipes.length))
})

describe('random recipes', () => {
  it('selects only from the provided filtered candidates and avoids the prior item', () => {
    const candidates = recipes.filter(recipe => recipe.tags.includes('Meal prep'))
    const result = chooseRandom(candidates, candidates[0].id, () => 0)
    expect(candidates.map(recipe => recipe.id)).toContain(result?.id)
    expect(result?.id).not.toBe(candidates[0].id)
  })
  it('returns undefined when no candidate exists', () => expect(chooseRandom([])).toBeUndefined())
})

describe('favorites persistence', () => {
  it('deduplicates and restores favorite ids', () => {
    let raw: string | null = null
    const store = { getItem: () => raw, setItem: (_: string, value: string) => { raw = value } }
    const updated = toggleFavorite(toggleFavorite([], 'tom-yum-prawns'), 'tom-yum-prawns')
    expect(updated).toEqual([])
    saveFavorites(['tom-yum-prawns', 'tom-yum-prawns'], store)
    expect(loadFavorites(store)).toEqual(['tom-yum-prawns'])
  })
  it('handles malformed reads, unavailable storage, and failed writes safely', () => {
    expect(loadFavorites({ getItem: () => '{bad json' })).toEqual([])
    expect(loadFavorites(undefined)).toEqual([])
    expect(saveFavorites(['tom-yum-prawns'], { setItem: () => { throw new Error('quota exceeded') } })).toBe(false)
  })
  it('removes duplicate and unknown favorite ids before displaying a count', () => {
    expect(normalizeFavorites(['tom-yum-prawns', 'tom-yum-prawns', 'unknown-id'])).toEqual(['tom-yum-prawns'])
  })
})

describe('recipe data validation', () => {
  it('contains exactly 100 image-ready curated recipes with valid catalog fields', () => {
    const ids = new Set(recipes.map(recipe => recipe.id))
    const images = new Set(recipes.map(recipe => recipe.image))
    const categories = new Set(['Quick meals', 'Thai favorites', 'High protein', 'Plant-forward', 'Light bowls'])

    expect(recipes).toHaveLength(100)
    expect(ids.size).toBe(100)
    expect(images.size).toBe(100)
    expect(recipes.every(recipe => /^\/recipes\/[a-z0-9]+(?:-[a-z0-9]+)*\.webp$/.test(recipe.image))).toBe(true)
    expect(recipes.every(recipe => categories.has(recipe.category))).toBe(true)
    expect(recipes.every(recipe => Number.isInteger(recipe.servings) && recipe.servings > 0)).toBe(true)
    expect(recipes.every(recipe => [recipe.nutrition.kcal, recipe.nutrition.protein, recipe.nutrition.carbs, recipe.nutrition.fat].every(Number.isFinite))).toBe(true)
    expect(recipes.every(recipe => recipe.ingredients.length > 0 && recipe.instructions.length > 0)).toBe(true)
  })

  it('accepts the curated recipe dataset', () => expect(validateRecipes(recipes)).toEqual([]))
  it('accepts complete Thai and English content for all 100 recipes', () => {
    expect(recipes).toHaveLength(100)
    expect(recipes.every(recipe => recipe.name.th.trim() && recipe.name.en.trim())).toBe(true)
    expect(recipes.every(recipe => recipe.ingredients.length > 0 && recipe.ingredients.every(ingredient => ingredient.item.th.trim() && ingredient.item.en.trim() && String(ingredient.quantity).trim()))).toBe(true)
    expect(recipes.every(recipe => recipe.instructions.length > 0 && recipe.instructions.every(instruction => instruction.th.trim() && instruction.en.trim()))).toBe(true)
  })
  it('rejects non-finite nutrition and missing required recipe content', () => {
    const nonFinite = { ...recipes[0], nutrition: { ...recipes[0].nutrition, kcal: Number.NaN } }
    const incomplete = { ...recipes[1], id: 'incomplete', name: { ...recipes[1].name, en: ' ' }, ingredients: [], instructions: [], servings: 0 }
    expect(validateRecipes([nonFinite, incomplete])).toEqual(expect.arrayContaining(['Invalid nutrition: tom-yum-prawns', 'Missing required content: incomplete', 'Invalid timing or servings: incomplete']))
  })
  it('rejects duplicate or non-local image paths', () => {
    const duplicate = { ...recipes[1], image: recipes[0].image }
    const remote = { ...recipes[2], image: 'https://example.com/recipe.webp' }
    const invalidCategory = { ...recipes[3], category: 'Desserts' as never }
    expect(validateRecipes([recipes[0], duplicate])).toContain(`Duplicate image: ${recipes[0].image}`)
    expect(validateRecipes([remote])).toContain('Invalid image path: tofu-mince-soup')
    expect(validateRecipes([invalidCategory])).toContain('Invalid category: herb-grilled-chicken')
  })
  it('rejects missing localized names, ingredients, and instructions', () => {
    const missingThaiName = { ...recipes[0], name: { ...recipes[0].name, th: ' ' } }
    const missingEnglishIngredient = { ...recipes[1], ingredients: [{ ...recipes[1].ingredients[0], item: { ...recipes[1].ingredients[0].item, en: '' } }] }
    const missingThaiInstruction = { ...recipes[2], instructions: [{ ...recipes[2].instructions[0], th: '' }] }
    expect(validateRecipes([missingThaiName])).toContain('Missing Thai name: tom-yum-prawns')
    expect(validateRecipes([missingEnglishIngredient])).toContain('Missing English ingredients: glass-noodle-seafood-salad')
    expect(validateRecipes([missingThaiInstruction])).toContain('Missing Thai instructions: tofu-mince-soup')
  })
  it('rejects malformed ingredient measurements without throwing', () => {
    const missingQuantity = { ...recipes[0], ingredients: [{ ...recipes[0].ingredients[0], quantity: '' }] }
    const invalidQuantity = { ...recipes[0], ingredients: [{ ...recipes[0].ingredients[0], quantity: 'not-a-quantity' }] }
    const unknownUnit = { ...recipes[1], ingredients: [{ ...recipes[1].ingredients[0], unit: 'ounce' as never }] }
    const invalidArray = { ...recipes[2], ingredients: 'not-an-array' as never }
    expect(validateRecipes([missingQuantity])).toContain('Missing ingredient quantity: tom-yum-prawns')
    expect(validateRecipes([invalidQuantity])).toContain('Invalid ingredient quantity: tom-yum-prawns')
    expect(validateRecipes([unknownUnit])).toContain('Unknown ingredient unit: glass-noodle-seafood-salad')
    expect(() => validateRecipes([invalidArray])).not.toThrow()
    expect(validateRecipes([invalidArray])).toContain('Missing required content: tofu-mince-soup')
  })
  it('returns validation errors instead of throwing for a missing required name', () => {
    const missingName = { ...recipes[0], name: undefined as never }
    expect(() => validateRecipes([missingName])).not.toThrow()
    expect(validateRecipes([missingName])).toContain('Missing required content: tom-yum-prawns')
  })
})
