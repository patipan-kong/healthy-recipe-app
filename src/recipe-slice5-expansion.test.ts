import { readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { canonicalIngredientIdForItem, canonicalIngredientIds, canonicalIngredients, filterRecipesByIngredient } from './pantry'
import { parseIngredientMeasurement } from './measurements'
import { recipeImageManifest } from './recipe-image-manifest'
import { recipeImagePresentationSlice5, recipeSlice5Seeds } from './recipe-slice5-expansion'
import { thaiRecipeContentSlice5 } from './recipe-slice5-content'
import { recipes, searchRecipes, validateRecipes } from './recipes'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const slice5Ids = recipeSlice5Seeds.map(recipe => recipe.id)
const slice5Recipes = recipes.slice(200)

describe('slice5 (R3 batch 1) recipe expansion: tofu waffle, sweet potato kimchi, konjac noodles, wakame soup', () => {
  it('appends exactly the 4 new recipes after the frozen first 200', () => {
    expect(recipeSlice5Seeds).toHaveLength(4)
    expect(slice5Ids).toEqual(['tofu-waffle', 'sweet-potato-kimchi', 'konjac-kimchi-egg-noodles', 'wakame-egg-soup'])
    expect(recipes).toHaveLength(204)
    expect(new Set(recipes.map(recipe => recipe.id)).size).toBe(204)
    expect(slice5Recipes.map(recipe => recipe.id)).toEqual(slice5Ids)
    expect(Object.keys(thaiRecipeContentSlice5).sort()).toEqual([...slice5Ids].sort())
    expect(Object.keys(recipeImagePresentationSlice5).sort()).toEqual([...slice5Ids].sort())
    expect(recipeImageManifest).toHaveLength(204)
    expect(recipeImageManifest.slice(200).map(entry => entry.id)).toEqual(slice5Ids)
  })

  it('validates cleanly and stays nutritionally consistent with the real Atwater check', () => {
    expect(validateRecipes(recipes)).toEqual([])
    for (const recipe of slice5Recipes) {
      expect(recipe.name.th.trim()).not.toBe('')
      expect(recipe.name.en.trim()).not.toBe('')
      expect(recipe.ingredients.every(ingredient => ingredient.item.th.trim() && ingredient.item.en.trim())).toBe(true)
      expect(recipe.instructions.every(instruction => instruction.th.trim() && instruction.en.trim())).toBe(true)
      for (const ingredient of recipe.ingredients) {
        expect(() => parseIngredientMeasurement(ingredient.amount ?? String(ingredient.quantity), ingredient.item.en)).not.toThrow()
      }
      const macroKcal = recipe.nutrition.protein * 4 + recipe.nutrition.carbs * 4 + recipe.nutrition.fat * 9
      expect(Math.abs(macroKcal - recipe.nutrition.kcal)).toBeLessThanOrEqual(180)
    }
  })

  it('recognizes konjac noodles and wakame as canonical pantry ingredients used by these recipes', () => {
    expect(canonicalIngredients.some(ingredient => ingredient.id === 'konjac-noodles')).toBe(true)
    expect(canonicalIngredients.some(ingredient => ingredient.id === 'wakame')).toBe(true)
    const konjacRecipe = recipes.find(recipe => recipe.id === 'konjac-kimchi-egg-noodles')!
    const wakameRecipe = recipes.find(recipe => recipe.id === 'wakame-egg-soup')!
    expect(konjacRecipe.ingredients.find(i => i.item.en.startsWith('Konjac noodles'))?.ingredientId).toBe('konjac-noodles')
    expect(wakameRecipe.ingredients.find(i => i.item.en.startsWith('Wakame'))?.ingredientId).toBe('wakame')
    expect(canonicalIngredientIds.has('konjac-noodles')).toBe(true)
    expect(canonicalIngredientIds.has('wakame')).toBe(true)
    expect(canonicalIngredientIdForItem('Konjac noodles, drained and rinsed')).toBe('konjac-noodles')
    expect(canonicalIngredientIdForItem('Wakame, dried')).toBe('wakame')
    expect(filterRecipesByIngredient(recipes, 'konjac-noodles').some(recipe => recipe.id === 'konjac-kimchi-egg-noodles')).toBe(true)
    expect(filterRecipesByIngredient(recipes, 'wakame').some(recipe => recipe.id === 'wakame-egg-soup')).toBe(true)
  })

  it('is discoverable through search by English and Thai terms', () => {
    expect(searchRecipes(recipes, 'tofu waffle').some(recipe => recipe.id === 'tofu-waffle')).toBe(true)
    expect(searchRecipes(recipes, 'เต้าหู้').some(recipe => recipe.id === 'tofu-waffle')).toBe(true)
    expect(searchRecipes(recipes, 'kimchi').some(recipe => recipe.id === 'sweet-potato-kimchi')).toBe(true)
    expect(searchRecipes(recipes, 'กิมจิ').some(recipe => recipe.id === 'sweet-potato-kimchi')).toBe(true)
    expect(searchRecipes(recipes, 'konjac').some(recipe => recipe.id === 'konjac-kimchi-egg-noodles')).toBe(true)
    expect(searchRecipes(recipes, 'บุก').some(recipe => recipe.id === 'konjac-kimchi-egg-noodles')).toBe(true)
    expect(searchRecipes(recipes, 'wakame').some(recipe => recipe.id === 'wakame-egg-soup')).toBe(true)
    expect(searchRecipes(recipes, 'วากาเมะ').some(recipe => recipe.id === 'wakame-egg-soup')).toBe(true)
  })

  it('keeps every previously existing recipe present and unchanged in count', () => {
    for (const id of ['korean-tofu-egg-pancakes', 'kimchi-tofu-stew', 'korean-tofu-glass-noodles', 'pumpkin-soup-with-egg']) {
      expect(recipes.filter(recipe => recipe.id === id)).toHaveLength(1)
    }
  })

  it('has exactly one production WebP asset per new recipe with the expected filename', () => {
    for (const id of slice5Ids) {
      const recipe = recipes.find(r => r.id === id)!
      expect(recipe.image).toBe(`/recipes/${id}.webp`)
      const filePath = join(projectRoot, 'public', recipe.image.slice(1))
      expect(statSync(filePath).isFile()).toBe(true)
      const bytes = readFileSync(filePath)
      expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP')
    }
  })
})
