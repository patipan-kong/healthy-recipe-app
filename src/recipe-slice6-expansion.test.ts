import { readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { canonicalIngredientIds, canonicalIngredients, countRecipesByIngredient, isExcludedPantryIngredient } from './pantry'
import { parseIngredientMeasurement } from './measurements'
import { recipeImageManifest } from './recipe-image-manifest'
import { recipeImagePresentationSlice6, recipeSlice6Seeds } from './recipe-slice6-expansion'
import { thaiRecipeContentSlice6 } from './recipe-slice6-content'
import { recipes, searchRecipes, validateRecipes, chooseRandom } from './recipes'
import { relatedMenuItemsForRecipe, relatedRecipesForMenuItem, recipeRestaurantRelations } from './recipe-restaurant-relations'
import { restaurantMenuItems } from './restaurants'
import { aggregateShoppingIngredients } from './shopping'
import { loadFavorites, saveFavorites, toggleFavorite } from './favorites'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const slice6Ids = recipeSlice6Seeds.map(recipe => recipe.id)
const slice6Recipes = recipes.slice(204, 208)

describe('slice6 (restaurant-inspired batch 1) recipe expansion: Som Tam, Gyudon, Japanese curry rice, garlic pepper pork', () => {
  it('appends exactly the 4 new recipes after the frozen first 204', () => {
    expect(recipeSlice6Seeds).toHaveLength(4)
    expect(slice6Ids).toEqual(['thai-papaya-salad', 'japanese-beef-gyudon', 'japanese-vegetable-curry-rice', 'garlic-pepper-pork-fried-egg-rice'])
    expect(recipes).toHaveLength(208)
    expect(new Set(recipes.map(recipe => recipe.id)).size).toBe(208)
    expect(slice6Recipes.map(recipe => recipe.id)).toEqual(slice6Ids)
    expect(Object.keys(thaiRecipeContentSlice6).sort()).toEqual([...slice6Ids].sort())
    expect(Object.keys(recipeImagePresentationSlice6).sort()).toEqual([...slice6Ids].sort())
    expect(recipeImageManifest).toHaveLength(208)
    expect(recipeImageManifest.slice(204, 208).map(entry => entry.id)).toEqual(slice6Ids)
  })

  it('validates cleanly and stays nutritionally consistent with the real Atwater check', () => {
    expect(validateRecipes(recipes)).toEqual([])
    for (const recipe of slice6Recipes) {
      expect(recipe.name.th.trim()).not.toBe('')
      expect(recipe.name.en.trim()).not.toBe('')
      expect(recipe.ingredients.length).toBeGreaterThan(0)
      expect(recipe.instructions.length).toBeGreaterThan(0)
      expect(recipe.ingredients.every(ingredient => ingredient.item.th.trim() && ingredient.item.en.trim())).toBe(true)
      expect(recipe.instructions.every(instruction => instruction.th.trim() && instruction.en.trim())).toBe(true)
      for (const ingredient of recipe.ingredients) {
        expect(() => parseIngredientMeasurement(ingredient.amount ?? String(ingredient.quantity), ingredient.item.en)).not.toThrow()
      }
      const macroKcal = recipe.nutrition.protein * 4 + recipe.nutrition.carbs * 4 + recipe.nutrition.fat * 9
      expect(Math.abs(macroKcal - recipe.nutrition.kcal)).toBeLessThanOrEqual(180)
    }
  })

  it('maps every ingredient to a canonical Pantry ID or an already-excluded staple — zero new Pantry entries', () => {
    expect(canonicalIngredients).toHaveLength(119)
    for (const recipe of slice6Recipes) {
      for (const ingredient of recipe.ingredients) {
        const mapped = ingredient.ingredientId
        if (mapped) {
          expect(canonicalIngredientIds.has(mapped)).toBe(true)
        } else {
          expect(isExcludedPantryIngredient(ingredient.item.en)).toBe(true)
        }
      }
    }
  })

  it('keeps a plausible, previously-tracked cucumber count now that garlic pepper pork adds one more use', () => {
    expect(countRecipesByIngredient(recipes).cucumber).toBe(46)
  })

  it('is discoverable through search by English and Thai terms', () => {
    expect(searchRecipes(recipes, 'papaya salad').some(recipe => recipe.id === 'thai-papaya-salad')).toBe(true)
    expect(searchRecipes(recipes, 'ส้มตำ').some(recipe => recipe.id === 'thai-papaya-salad')).toBe(true)
    expect(searchRecipes(recipes, 'gyudon').some(recipe => recipe.id === 'japanese-beef-gyudon')).toBe(true)
    expect(searchRecipes(recipes, 'เกียวด้ง').some(recipe => recipe.id === 'japanese-beef-gyudon')).toBe(true)
    expect(searchRecipes(recipes, 'curry rice').some(recipe => recipe.id === 'japanese-vegetable-curry-rice')).toBe(true)
    expect(searchRecipes(recipes, 'แกงกะหรี่ญี่ปุ่น').some(recipe => recipe.id === 'japanese-vegetable-curry-rice')).toBe(true)
    expect(searchRecipes(recipes, 'garlic pepper pork').some(recipe => recipe.id === 'garlic-pepper-pork-fried-egg-rice')).toBe(true)
    expect(searchRecipes(recipes, 'หมูกระเทียมพริกไทย').some(recipe => recipe.id === 'garlic-pepper-pork-fried-egg-rice')).toBe(true)
  })

  it('keeps every previously existing recipe present and unchanged in count', () => {
    for (const id of ['thai-papaya-tofu-salad', 'chicken-oyakodon', 'tofu-egg-donburi', 'korean-beef-glass-noodles', 'lean-pork-pepper-rice']) {
      expect(recipes.filter(recipe => recipe.id === id)).toHaveLength(1)
    }
  })

  it('has exactly one production WebP asset per new recipe with the expected filename', () => {
    for (const id of slice6Ids) {
      const recipe = recipes.find(r => r.id === id)!
      expect(recipe.image).toBe(`/recipes/${id}.webp`)
      const filePath = join(projectRoot, 'public', recipe.image.slice(1))
      expect(statSync(filePath).isFile()).toBe(true)
      const bytes = readFileSync(filePath)
      expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP')
      expect(bytes.length).toBeGreaterThan(10_000)
      expect(bytes.length).toBeLessThan(500_000)
    }
  })

  it('is eligible for random/pick selection like any other recipe', () => {
    const candidates = recipes.filter(recipe => slice6Ids.includes(recipe.id))
    expect(candidates).toHaveLength(4)
    const result = chooseRandom(candidates, candidates[0].id, () => 0)
    expect(candidates.map(recipe => recipe.id)).toContain(result?.id)
  })

  it('round-trips through Favorites like any other recipe', () => {
    let raw: string | null = null
    const store = { getItem: () => raw, setItem: (_: string, value: string) => { raw = value } }
    saveFavorites(['thai-papaya-salad', 'japanese-beef-gyudon'], store)
    expect(loadFavorites(store)).toEqual(['thai-papaya-salad', 'japanese-beef-gyudon'])
    expect(toggleFavorite(loadFavorites(store), 'thai-papaya-salad')).toEqual(['japanese-beef-gyudon'])
  })

  it('produces valid, scalable Shopping List lines for each new recipe', () => {
    for (const id of slice6Ids) {
      const lines = aggregateShoppingIngredients(recipes, [id], { [id]: 4 })
      expect(lines.length).toBeGreaterThan(0)
      expect(lines.every(line => Number(line.quantity) >= 0 || line.quantity === '')).toBe(true)
    }
  })

  it('adds exactly the designed Slice 31 relations, all HIGH-confidence and referentially valid', () => {
    const newRelationPairs = [
      ['thai-papaya-salad', 'nittaya-som-tam-thai'],
      ['thai-papaya-salad', 'somtam-nua-papaya-salad-thai'],
      ['thai-papaya-salad', 'steak-and-more-som-tam'],
      ['japanese-beef-gyudon', 'sukiya-gyudon-regular'],
      ['japanese-vegetable-curry-rice', 'sukiya-curry-rice-regular'],
      ['garlic-pepper-pork-fried-egg-rice', 'seven-eleven-garlic-pork-egg-rice'],
    ]
    for (const [recipeId, menuItemId] of newRelationPairs) {
      expect(recipeRestaurantRelations.some(relation => relation.recipeId === recipeId && relation.restaurantMenuItemId === menuItemId)).toBe(true)
      expect(restaurantMenuItems.some(item => item.id === menuItemId)).toBe(true)
      expect(relatedRecipesForMenuItem(menuItemId).map(recipe => recipe.id)).toContain(recipeId)
      expect(relatedMenuItemsForRecipe(recipeId).map(entry => entry.item.id)).toContain(menuItemId)
    }
  })

  it('deliberately excludes every non-classic Som Tam variant from the relation set', () => {
    const excludedMenuItemIds = [
      'nittaya-som-tam-salted-egg',
      'zaab-eli-som-tam-salted-egg',
      'zaab-eli-corn-salted-egg-som-tam',
      'somtam-nua-papaya-salad-fermented-crab',
      'somtam-nua-tam-muah',
    ]
    for (const menuItemId of excludedMenuItemIds) {
      expect(restaurantMenuItems.some(item => item.id === menuItemId)).toBe(true)
      expect(relatedRecipesForMenuItem(menuItemId)).toEqual([])
    }
    expect(relatedMenuItemsForRecipe('thai-papaya-salad').map(entry => entry.item.id).sort()).toEqual([
      'nittaya-som-tam-thai',
      'somtam-nua-papaya-salad-thai',
      'steak-and-more-som-tam',
    ])
  })

  it('excludes the bonito/okra gyudon variant, keeping the relation to the plain dish only', () => {
    expect(relatedRecipesForMenuItem('sukiya-gyudon-okra-regular')).toEqual([])
  })
})
