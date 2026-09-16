import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'
import { canonicalIngredients, canonicalIngredientIdForItem, filterRecipesByIngredient, rankRecipesByPantry, isShoppingOnlyIngredient } from './pantry'
import { aggregateShoppingIngredients } from './shopping'

const recipe = (id: string) => recipes.find(entry => entry.id === id)!
const ingredient = (id: string, name: string) => recipe(id).ingredients.find(entry => entry.item.en === name)!

describe('bounded culinary correction regressions', () => {
  it('pairs the first-100 chestnut seasonings with their own Thai identity and measure', () => {
    const entries = recipe('japanese-mushroom-chestnut-rice').ingredients.slice(-3)
    expect(entries.map(i => [i.item.en, i.item.th, i.quantity, i.unit])).toEqual([
      ['Sesame oil', 'น้ำมันงา', '1', 'tsp'],
      ['Sesame seeds', 'งาขาว', '1', 'tsp'],
      ['Nori sheets', 'สาหร่ายโนริ', '1', 'sheet'],
    ])
    expect(recipe('japanese-mushroom-chestnut-rice').instructions[0].en).toMatch(/edges brown/)
    expect(ingredient('hummus-chicken-pita', 'Lemon juice').item.th).toBe('น้ำเลมอน')
  })

  it('retains approved first-100 cooking safeguards and seasoning', () => {
    expect(ingredient('thai-red-curry-tofu', 'Reduced-sodium soy sauce').quantity).toBe('1')
    expect(recipe('thai-red-curry-tofu').instructions[0].en).toMatch(/3 tablespoons.*coconut milk/)
    for (const id of ['thai-steamed-chicken-cabbage', 'korean-bean-sprout-chicken-soup']) {
      expect(recipe(id).instructions.map(i => i.en).join(' ')).toMatch(/fully cooked|cooked through/)
    }
    expect(recipe('light-mapo-tofu').instructions.map(i => i.en).join(' ')).toMatch(/3 tablespoons/)
    expect(recipe('edamame-egg-sushi-bowl').instructions.map(i => i.en).join(' ')).toMatch(/non-stick/)
  })

  it('keeps Japanese cooking sauce separate from Thai suki dipping sauce when scaled and combined', () => {
    const japanese = recipe('japanese-beef-tofu-sukiyaki')
    expect(japanese.ingredients.some(i => i.ingredientId === 'sukiyaki-sauce')).toBe(false)
    expect(ingredient(japanese.id, 'Reduced-sodium soy sauce').quantity).toBe('3')
    const thai = recipe('chicken-vegetable-sukiyaki')
    const thaiOnly = aggregateShoppingIngredients(recipes, [thai.id])
    const together = aggregateShoppingIngredients(recipes, [japanese.id, thai.id], { [japanese.id]: 3 })
    expect(together.find(i => i.ingredientId === 'sukiyaki-sauce')).toEqual(thaiOnly.find(i => i.ingredientId === 'sukiyaki-sauce'))
    expect(together.find(i => i.ingredientId === 'soy-sauce' && i.unit === 'tbsp')?.quantity).toBe('4½')
    expect(together.find(i => i.ingredientId === 'lean-beef')?.quantity).toBe('390')
    const fractions = aggregateShoppingIngredients(recipes, [japanese.id], { [japanese.id]: 3 })
    expect(fractions.find(i => i.item.en === 'Neutral oil')?.quantity).toBe('1½')
  })

  it('makes vegetarian stock and cheese requirements explicit without corrupting Pantry identity', () => {
    for (const id of ['thai-tom-yum-tofu-noodles', 'japanese-soba-mushroom-soup', 'japanese-tamago-edamame-rice', 'korean-egg-tofu-stew', 'chinese-steamed-tofu-egg-custard', 'savory-oats-egg-mushrooms']) {
      const stock = recipe(id).ingredients.find(i => /stock/i.test(i.item.en))!
      expect(stock.item.en).toMatch(/vegetable stock/)
      expect(stock.item.th).toContain('ผัก')
    }
    const cheese = recipe('italian-lentil-bolognese').ingredients.find(i => /rennet/.test(i.item.en))!
    expect(cheese.item.th).toContain('จุลินทรีย์')
    expect(cheese.ingredientId).toBeUndefined()
    expect(isShoppingOnlyIngredient(cheese.item.en)).toBe(true)
    expect(isShoppingOnlyIngredient('Parmesan')).toBe(false)
    const line = aggregateShoppingIngredients(recipes, ['italian-lentil-bolognese'], { 'italian-lentil-bolognese': 3 }).find(i => /rennet/.test(i.item.en))!
    expect(line.quantity).toBe('22½')
    expect(line.item.th).toContain('มังสวิรัติ')
    expect(canonicalIngredients).toHaveLength(119)
    expect(canonicalIngredientIdForItem('Glass noodles, Korean sweet-potato, dry')).toBe('glass-noodles')
  })

  it('makes the tuna lettuce title truthful and accessible through Pantry matching', () => {
    const id = 'japanese-tuna-miso-lettuce-bowl'
    expect(recipe(id).name.en).toMatch(/Lettuce/)
    expect(recipe(id).name.th).toContain('ผักกาดหอม')
    expect(ingredient(id, 'Lettuce, shredded')).toMatchObject({ quantity: '100', unit: 'g', ingredientId: 'lettuce' })
    expect(filterRecipesByIngredient(recipes, 'lettuce').some(r => r.id === id)).toBe(true)
    expect(rankRecipesByPantry(recipes, ['tuna', 'lettuce']).find(r => r.recipe.id === id)?.matchCount).toBe(2)
  })

  it('uses ingredient-based, per-serving nutrition instead of preserving old claims', () => {
    const ranges = [
      ['savory-oats-egg-mushrooms', 280, 320, 15, 19],
      ['italian-lentil-bolognese', 550, 620, 27, 33],
      ['italian-tuna-white-bean-pasta', 500, 550, 39, 45],
      ['greek-chicken-sweet-potato-tray', 330, 380, 35, 41],
      ['one-pan-chicken-vegetable-quinoa', 340, 395, 37, 43],
    ] as const
    for (const [id, low, high, pLow, pHigh] of ranges) {
      const { nutrition: n, servings } = recipe(id)
      expect(servings).toBe(2)
      expect(n.kcal).toBeGreaterThanOrEqual(low)
      expect(n.kcal).toBeLessThanOrEqual(high)
      expect(n.protein).toBeGreaterThanOrEqual(pLow)
      expect(n.protein).toBeLessThanOrEqual(pHigh)
      expect(Object.values(n).every(v => Number.isFinite(v) && v >= 0)).toBe(true)
      expect(Math.abs(4 * (n.protein + n.carbs) + 9 * n.fat - n.kcal)).toBeLessThan(n.kcal * 0.12)
    }
    expect(recipe('savory-oats-egg-mushrooms').tags).not.toContain('High protein')
    expect(ingredient('savory-oats-egg-mushrooms', 'Eggs').quantity).toBe('2')
    expect(ingredient('italian-lentil-bolognese', 'Whole-wheat spaghetti, dry').quantity).toBe('150')
    expect(ingredient('one-pan-chicken-vegetable-quinoa', 'Low-sodium stock').quantity).toBe('80')
  })

  it('keeps the required duplicate corrections genuinely distinct', () => {
    expect(recipe('mexican-chicken-bean-tortilla').name.en).toContain('Tostadas')
    expect(recipe('mexican-chicken-bean-tortilla').instructions[0].en).toContain('not rolled')
    expect(ingredient('vietnamese-shrimp-lemongrass-rice', 'Daikon, julienned').quantity).toBe('100')
    expect(recipe('korean-beef-glass-noodles').instructions[0].en).toMatch(/Marinate beef for 10 minutes/)
  })
})
