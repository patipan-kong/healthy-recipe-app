import { describe, expect, it } from 'vitest'
import { formatIngredientAmount, ingredientUnits, parseIngredientMeasurement } from './measurements'
import { recipes, searchRecipes, validateRecipes } from './recipes'

describe('bilingual ingredient measurements', () => {
  it('keeps the 150-recipe catalog valid and uses only canonical units', () => {
    expect(recipes).toHaveLength(150)
    expect(validateRecipes(recipes)).toEqual([])
    expect(recipes.flatMap(recipe => recipe.ingredients).every(ingredient => ingredient.unit === undefined || ingredientUnits.includes(ingredient.unit))).toBe(true)
  })

  it('localizes the canonical unit vocabulary in both languages', () => {
    const examples = [
      ['g', '220', '220 กรัม', '220 g'],
      ['ml', '150', '150 มล.', '150 ml'],
      ['tbsp', '2', '2 ช้อนโต๊ะ', '2 tbsp'],
      ['tsp', '1½', '1½ ช้อนชา', '1½ tsp'],
      ['cup', '1', '1 ถ้วย', '1 cup'],
      ['packed-cup', '1', '1 ถ้วยอัดแน่น', '1 packed cup'],
      ['small-bundle', '1', '1 มัดเล็ก', '1 small bundle'],
      ['small', '1', '1 ลูกเล็ก', '1 small'],
      ['medium', '1', '1 ลูกกลาง', '1 medium'],
      ['large', '½', '½ ลูกใหญ่', '½ large'],
      ['clove', '3', '3 กลีบ', '3 cloves'],
      ['leaf', '12', '12 ใบ', '12 leaves'],
      ['slice', '2', '2 แผ่น', '2 slices'],
      ['stalk', '2', '2 ต้น', '2 stalks'],
      ['pinch', 'a', 'เล็กน้อย', 'a pinch'],
      ['egg', '2', '2 ฟอง', '2 eggs'],
      ['sheet', '2', '2 แผ่น', '2 sheets'],
    ] as const

    for (const [unit, quantity, thai, english] of examples) {
      const ingredient = { quantity, unit }
      expect(formatIngredientAmount(ingredient, 'th')).toBe(thai)
      expect(formatIngredientAmount(ingredient, 'en')).toBe(english)
    }
    expect(formatIngredientAmount({ quantity: '1½', unit: 'cup' }, 'en')).toBe('1½ cups')
  })

  it('matches the catalog forms without changing quantities or fractions', () => {
    expect(parseIngredientMeasurement('220 g', 'Prawns, peeled')).toEqual({ quantity: '220', unit: 'g' })
    expect(parseIngredientMeasurement('1½ tsp', 'Fish sauce')).toEqual({ quantity: '1½', unit: 'tsp' })
    expect(parseIngredientMeasurement('1 small bundle', 'Tom yum herbs')).toEqual({ quantity: '1', unit: 'small-bundle' })
    expect(parseIngredientMeasurement('1 packed cup', 'Thai holy basil')).toEqual({ quantity: '1', unit: 'packed-cup' })
    expect(parseIngredientMeasurement('2', 'Eggs')).toEqual({ quantity: '2', unit: 'egg' })
    expect(recipes.flatMap(recipe => recipe.ingredients).every(ingredient => ingredient.amount === undefined || parseIngredientMeasurement(ingredient.amount, ingredient.item.en).quantity === ingredient.quantity)).toBe(true)
  })

  it('does not leak English units into Thai rendered measurements', () => {
    const englishUnitLeak = /\b(?:g|kg|ml|l|tsp|tbsp|cups?|cloves?|leaves?|slices?|stalks?|small bundle|pinch)\b/i
    const thaiAmounts = recipes.flatMap(recipe => recipe.ingredients.map(ingredient => formatIngredientAmount(ingredient, 'th')))
    const thaiInstructions = recipes.flatMap(recipe => recipe.instructions.map(instruction => instruction.th))
    expect(thaiAmounts.some(amount => englishUnitLeak.test(amount))).toBe(false)
    expect(thaiInstructions.some(instruction => englishUnitLeak.test(instruction))).toBe(false)
    expect(recipes.flatMap(recipe => recipe.ingredients.map(ingredient => formatIngredientAmount(ingredient, 'en'))).some(amount => /(?:กรัม|มล\.|ช้อนโต๊ะ|ช้อนชา|ถ้วย|กลีบ|ใบ|แผ่น|ต้น|ฟอง)/.test(amount))).toBe(false)
  })

  it('switches measurement presentation without changing recipe identity or search', () => {
    const recipe = recipes.find(candidate => candidate.id === 'tom-yum-prawns')!
    const thai = formatIngredientAmount(recipe.ingredients[4], 'th')
    const english = formatIngredientAmount(recipe.ingredients[4], 'en')
    expect(recipe.id).toBe('tom-yum-prawns')
    expect(thai).toBe('2 ช้อนโต๊ะ')
    expect(english).toBe('2 tbsp')
    expect(searchRecipes(recipes, 'ไก่ย่างแจ่ว').map(candidate => candidate.id)).toContain('grilled-chicken-jaew')
    expect(searchRecipes(recipes, 'grilled chicken with jaew').map(candidate => candidate.id)).toContain('grilled-chicken-jaew')
  })
})
