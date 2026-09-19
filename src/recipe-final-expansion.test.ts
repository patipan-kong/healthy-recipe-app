import { describe, expect, it } from 'vitest'
import { isExcludedPantryIngredient, isShoppingOnlyIngredient, filterRecipesByIngredient, rankRecipesByPantry } from './pantry'
import { parseIngredientMeasurement } from './measurements'
import { recipeImageManifest } from './recipe-image-manifest'
import { recipeFinalSeeds, recipeImagePresentationFinal } from './recipe-final-expansion'
import { thaiRecipeContentFinal } from './recipe-final-content'
import { filterRecipes, recipes, searchRecipes, validateRecipes } from './recipes'
import { aggregateShoppingIngredients } from './shopping'

const finalRecipes = recipes.slice(150, 200)
const finalIds = recipeFinalSeeds.map(recipe => recipe.id)

describe('final 50-recipe catalog expansion', () => {
  it('appends exactly 50 recipes after the frozen first 150', () => {
    expect(recipeFinalSeeds).toHaveLength(50)
    expect(new Set(finalIds).size).toBe(50)
    expect(recipes).toHaveLength(208)
    expect(finalRecipes.map(recipe => recipe.id)).toEqual(finalIds)
    expect(Object.keys(thaiRecipeContentFinal).sort()).toEqual([...finalIds].sort())
    expect(Object.keys(recipeImagePresentationFinal).sort()).toEqual([...finalIds].sort())
    expect(recipeImageManifest.slice(150, 200).map(entry => entry.id)).toEqual(finalIds)
  })

  it('keeps every new recipe bilingual, measurable, and nutritionally sane', () => {
    expect(validateRecipes(finalRecipes)).toEqual([])
    for (const recipe of finalRecipes) {
      expect(recipe.name.th.trim()).not.toBe('')
      expect(recipe.name.en.trim()).not.toBe('')
      expect(recipe.ingredients.every(ingredient => ingredient.item.th.trim() && ingredient.item.en.trim())).toBe(true)
      expect(recipe.instructions.every(instruction => instruction.th.trim() && instruction.en.trim())).toBe(true)
      for (const ingredient of recipe.ingredients) {
        expect(() => parseIngredientMeasurement(ingredient.amount ?? String(ingredient.quantity), ingredient.item.en)).not.toThrow()
        expect(ingredient.ingredientId || isExcludedPantryIngredient(ingredient.item.en) || isShoppingOnlyIngredient(ingredient.item.en)).toBeTruthy()
      }
      const macroKcal = recipe.nutrition.protein * 4 + recipe.nutrition.carbs * 4 + recipe.nutrition.fat * 9
      expect(Math.abs(macroKcal - recipe.nutrition.kcal)).toBeLessThanOrEqual(180)
    }
  })

  it('keeps dietary labels truthful and broadens useful cuisine and format coverage', () => {
    const vegetarian = finalRecipes.filter(recipe => recipe.tags.includes('Vegetarian') || recipe.tags.includes('Vegan'))
    expect(vegetarian.length).toBeGreaterThanOrEqual(20)
    expect(vegetarian.every(recipe => recipe.ingredients.every(ingredient => !/chicken|pork|beef|salmon|prawn|shrimp|tuna|fish sauce|oyster sauce|seafood|mackerel/i.test(ingredient.item.en)))).toBe(true)

    const cuisines = new Set(finalRecipes.map(recipe => recipe.cuisine.en))
    expect(cuisines).toEqual(new Set(['Thai', 'Japanese', 'Korean', 'Chinese', 'Vietnamese', 'Mediterranean', 'Italian', 'Mexican', 'International']))
    expect(new Set(finalRecipes.map(recipe => recipe.category)).size).toBe(5)
    expect(finalRecipes.filter(recipe => recipe.ingredients.some(ingredient => /noodles|udon|vermicelli|penne|spaghetti|couscous/i.test(ingredient.item.en))).length).toBeGreaterThanOrEqual(8)
    expect(finalRecipes.filter(recipe => recipe.instructions.some(instruction => /steam|อบ|นึ่ง/i.test(instruction.en + instruction.th))).length).toBeGreaterThanOrEqual(8)
  })

  it('participates in search, filters, Pantry matching, and scaled Shopping', () => {
    expect(searchRecipes(recipes, 'Thai Chicken Khao Soi').some(recipe => recipe.id === 'thai-chicken-khao-soi')).toBe(true)
    expect(searchRecipes(recipes, 'ข้าวซอยไก่').some(recipe => recipe.id === 'thai-chicken-khao-soi')).toBe(true)
    expect(filterRecipes(recipes, { category: 'Plant-forward', tags: ['Vegan'] }).some(recipe => recipe.id === 'international-mushroom-lentil-shepherds-pie')).toBe(true)
    for (const ingredientId of ['chicken-breast', 'eggs', 'cucumber', 'mushrooms', 'tofu', 'prawns', 'white-fish']) {
      expect(filterRecipesByIngredient(recipes, ingredientId).length).toBeGreaterThan(0)
    }
    expect(rankRecipesByPantry(recipes, ['tofu', 'mushrooms']).some(match => match.recipe.id === 'thai-steamed-tofu-lime' && match.matchCount === 2)).toBe(true)

    const shopping = aggregateShoppingIngredients(recipes, ['thai-chicken-khao-soi'], { 'thai-chicken-khao-soi': 4 })
    expect(shopping.find(line => line.ingredientId === 'whole-wheat-noodles')?.quantity).toBe('340')
    expect(shopping.find(line => line.ingredientId === 'chicken-breast')?.quantity).toBe('520')
  })
})
