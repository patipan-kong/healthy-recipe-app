import { describe, expect, it } from 'vitest'
import { filterRecipesByIngredient, isExcludedPantryIngredient, isShoppingOnlyIngredient, rankRecipesByPantry } from './pantry'
import { parseIngredientMeasurement } from './measurements'
import { recipeImageManifest } from './recipe-image-manifest'
import { recipeAdditionSeeds, recipeImagePresentationAdditions, thaiRecipeContentAdditions } from './recipe-additions'
import { filterRecipes, recipes, searchRecipes, validateRecipes } from './recipes'
import { aggregateShoppingIngredients } from './shopping'

const additionIds = [
  'thai-chicken-cashew-stir-fry', 'thai-red-curry-chicken-green-beans', 'thai-garlic-prawns-brown-rice',
  'thai-pork-ginger-stirfry', 'thai-glass-noodle-chicken-stirfry', 'thai-tofu-peanut-lime-noodles',
  'thai-massaman-chicken-sweet-potato', 'thai-steamed-salmon-chilli-lime', 'thai-pumpkin-chickpea-salad',
  'thai-egg-fried-rice-prawns', 'thai-tom-yum-tofu-noodles', 'thai-green-curry-white-fish',
  'japanese-beef-tofu-sukiyaki', 'japanese-chicken-miso-ginger-bowl', 'japanese-tofu-teriyaki-vegetables',
  'japanese-soba-mushroom-soup', 'japanese-eggplant-miso-donburi', 'japanese-tamago-edamame-rice',
  'japanese-tuna-miso-lettuce-bowl', 'korean-chicken-dakgalbi', 'korean-pork-gochujang-stirfry',
  'korean-beef-glass-noodles', 'korean-tuna-kimchi-rice', 'korean-tofu-kimchi-lettuce-wraps',
  'korean-beef-spinach-soup', 'korean-egg-tofu-stew', 'korean-chicken-bibim-noodles',
  'chinese-ginger-scallion-prawns', 'chinese-tofu-broccoli-sesame', 'chinese-steamed-tofu-egg-custard',
  'chinese-prawn-egg-drop-soup', 'chinese-beef-celery-rice-noodles', 'chinese-chickpea-lettuce-cups',
  'vietnamese-lemongrass-chicken-rice', 'vietnamese-beef-vermicelli-salad', 'vietnamese-shrimp-lemongrass-rice',
  'vietnamese-caramel-pork', 'vietnamese-tomato-tofu-braise', 'mediterranean-salmon-couscous',
  'greek-chicken-sweet-potato-tray', 'italian-lentil-bolognese', 'italian-tuna-white-bean-pasta',
  'spanish-chickpea-spinach-stew', 'mediterranean-turkey-stuffed-zucchini', 'french-white-bean-ratatouille',
  'greek-shrimp-tomato-feta', 'mexican-shrimp-fajita-rice', 'mexican-chicken-bean-tortilla',
  'savory-oats-egg-mushrooms', 'one-pan-chicken-vegetable-quinoa',
] as const

const addedRecipes = additionIds.map(id => recipes.find(recipe => recipe.id === id)!)

describe('50-recipe catalog expansion', () => {
  it('appends exactly 50 recipes while keeping the reviewed catalog first', () => {
    expect(recipeAdditionSeeds).toHaveLength(50)
    expect(new Set(additionIds).size).toBe(50)
    expect(recipes).toHaveLength(200)
    expect(recipes.slice(100, 150).map(recipe => recipe.id)).toEqual(additionIds)
    expect(recipeAdditionSeeds.map(recipe => recipe.id)).toEqual(additionIds)
    expect(Object.keys(thaiRecipeContentAdditions).sort()).toEqual([...additionIds].sort())
    expect(Object.keys(recipeImagePresentationAdditions).sort()).toEqual([...additionIds].sort())
    expect(recipeImageManifest.slice(100, 150).map(entry => entry.id)).toEqual(additionIds)
  })

  it('keeps every addition bilingual, measurable, nutritionally sane, and pantry-compatible', () => {
    expect(addedRecipes.every(Boolean)).toBe(true)
    expect(validateRecipes(addedRecipes)).toEqual([])
    for (const recipe of addedRecipes) {
      expect(recipe.name.th.trim()).not.toBe('')
      expect(recipe.name.en.trim()).not.toBe('')
      expect(recipe.ingredients.every(ingredient => ingredient.item.th.trim() && ingredient.item.en.trim())).toBe(true)
      expect(recipe.instructions.every(instruction => instruction.th.trim() && instruction.en.trim())).toBe(true)
      for (const ingredient of recipe.ingredients) {
        expect(() => parseIngredientMeasurement(ingredient.amount ?? String(ingredient.quantity), ingredient.item.en)).not.toThrow()
      }
      expect(recipe.ingredients.every(ingredient => ingredient.ingredientId || isExcludedPantryIngredient(ingredient.item.en) || isShoppingOnlyIngredient(ingredient.item.en))).toBe(true)
      const macroKcal = recipe.nutrition.protein * 4 + recipe.nutrition.carbs * 4 + recipe.nutrition.fat * 9
      expect(Math.abs(macroKcal - recipe.nutrition.kcal)).toBeLessThanOrEqual(180)
    }
  })

  it('preserves dietary integrity and participates in bilingual search and filters', () => {
    const vegetarianOrVegan = addedRecipes.filter(recipe => recipe.tags.some(tag => tag === 'Vegetarian' || tag === 'Vegan'))
    expect(vegetarianOrVegan.every(recipe => recipe.ingredients.every(ingredient => !/chicken|pork|beef|salmon|prawn|shrimp|tuna|fish sauce|oyster sauce|dashi|anchovy|seafood/i.test(ingredient.item.en)))).toBe(true)

    expect(searchRecipes(recipes, 'Thai Tofu Peanut-Lime Noodles').some(recipe => recipe.id === 'thai-tofu-peanut-lime-noodles')).toBe(true)
    expect(searchRecipes(recipes, 'เส้นโฮลวีตเต้าหู้ซอสถั่วมะนาว').some(recipe => recipe.id === 'thai-tofu-peanut-lime-noodles')).toBe(true)
    expect(filterRecipes(recipes, { category: 'Plant-forward', tags: [] }).some(recipe => recipe.id === 'thai-tofu-peanut-lime-noodles')).toBe(true)
  })

  it('flows through pantry filtering, ranking, and serving-scaled shopping', () => {
    const tofuMatches = filterRecipesByIngredient(recipes, 'tofu')
    expect(tofuMatches.some(recipe => recipe.id === 'thai-tofu-peanut-lime-noodles')).toBe(true)

    const ranked = rankRecipesByPantry(recipes, ['tofu', 'cucumber'])
    expect(ranked.some(match => match.recipe.id === 'thai-tofu-peanut-lime-noodles' && match.matchCount === 2)).toBe(true)

    const shopping = aggregateShoppingIngredients(recipes, ['thai-tofu-peanut-lime-noodles'], { 'thai-tofu-peanut-lime-noodles': 4 })
    expect(shopping.find(line => line.ingredientId === 'tofu')?.quantity).toBe('480')
    expect(shopping.find(line => line.ingredientId === 'whole-wheat-noodles')?.quantity).toBe('560')
  })
})
