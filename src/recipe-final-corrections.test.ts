import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'
import { canonicalIngredients } from './pantry'
import { aggregateShoppingIngredients } from './shopping'

const bySlice = (n: number) => recipes.find(recipe => recipe.sourceId === `slice4-${String(n).padStart(2, '0')}`)!
const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex')

describe('bounded final-50 corrections', () => {
  it('preserves the entry first-150, PASS/LOW recipes and food source without object snapshots', () => {
    expect(hash(JSON.stringify(recipes.slice(0, 150)))).toBe('d506f0383f9f6e50edb3213057d905e48a20c281f72b38a033ae1903d61013d0')
    const frozen = [2, 4, 6, 8, 10, 11, 12, 13, 15, 18, 21, 27, 29, 31, 35, 36, 48].map(bySlice)
    expect(hash(JSON.stringify(frozen))).toBe('33d035560e409ac84802b97b4da671b90f5bf5f56cd22fdfe72ad0a8fcc810b8')
    expect(hash(readFileSync(new URL('../data/foods.json', import.meta.url)))).toBe('ff39f65f8122f15bb1715e58a34f3a3320422fa5a2a8da1b82eac220cb5e1d9a')
    expect(canonicalIngredients).toHaveLength(117)
  })

  it('uses the correct roots and measured dry red lentils', () => {
    expect(bySlice(5).ingredients.some(i => /galangal/i.test(i.item.en) && /ข่า/.test(i.item.th))).toBe(true)
    expect(bySlice(5).ingredients.some(i => /ginger/i.test(i.item.en))).toBe(false)
    for (const n of [26, 40]) {
      expect(bySlice(n).ingredients[0]).toMatchObject({ quantity: '120', unit: 'g', ingredientId: 'lentils' })
      expect(bySlice(n).ingredients[0].item.en).toMatch(/Red lentils, dry/)
      expect(bySlice(n).ingredients[0].item.th).toContain('แดง')
      expect(bySlice(n).instructions.map(i => i.en).join(' ')).toMatch(/20–25 minutes/)
    }
  })

  it('preserves vegetarian requirements in recipes and Shopping', () => {
    for (const n of [5, 42, 46]) expect(bySlice(n).ingredients.find(i => /stock/.test(i.item.en))?.item.en).toContain('vegetable')
    expect(bySlice(3).ingredients[1].item.en).toContain('vegetarian-certified')
    for (const n of [28, 50]) expect(bySlice(n).ingredients.find(i => /Feta/.test(i.item.en))?.item.en).toContain('vegetarian-certified')
    for (const n of [32, 34, 47]) {
      const cheese = bySlice(n).ingredients.find(i => /hard cheese/.test(i.item.en))!
      expect(cheese.item.en).toContain('microbial rennet')
      expect(aggregateShoppingIngredients(recipes, [bySlice(n).id]).some(i => i.item.en === cheese.item.en)).toBe(true)
    }
  })

  it('allocates crispy garnish and controls pancake moisture, binder and size', () => {
    expect(bySlice(1).ingredients[1].quantity).toBe('170')
    const khaoSoi = bySlice(1).instructions.map(i => i.en).join(' ')
    expect(khaoSoi).toContain('20 g')
    expect(khaoSoi).toContain('remaining 150 g')
    expect(khaoSoi).toContain('half the crispy noodles')
    const pancakes = bySlice(14)
    expect(pancakes.ingredients.find(i => /Oats/.test(i.item.en))?.quantity).toBe('30')
    const method = pancakes.instructions.map(i => i.en).join(' ')
    for (const text of ['squeeze', 'evaporates', 'Rest 10 minutes', 'twelve small', '72°C']) expect(method).toContain(text)
  })

  it('keeps corrected nutrition plausible for the measured two-serving batches', () => {
    expect(bySlice(5).nutrition.kcal).toBeGreaterThan(100)
    expect(bySlice(5).nutrition.kcal).toBeLessThan(190)
    expect(bySlice(9).nutrition.carbs).toBeLessThan(30)
    expect(bySlice(9).nutrition.kcal).toBeLessThan(410)
    expect(bySlice(20).nutrition.fat).toBeGreaterThanOrEqual(16)
    for (const n of [1, 3, 5, 7, 9, 14, 16, 19, 20, 22, 23, 24, 25, 26, 28, 38, 40, 41, 42, 45]) {
      const { kcal, protein, carbs, fat } = bySlice(n).nutrition
      expect(Math.abs(kcal - (4 * protein + 4 * carbs + 9 * fat))).toBeLessThan(70)
    }
  })

  it('separates actual new dry noodles from frozen cooked noodles at scaled servings', () => {
    for (const n of [1, 17, 20]) {
      const dry = bySlice(n)
      const noodle = dry.ingredients.find(i => /noodles, dry/i.test(i.item.en))!
      const cooked = recipes.slice(0, 150).find(r => r.ingredients.some(i => i.ingredientId === noodle.ingredientId && /cooked/.test(i.item.en) && i.unit === noodle.unit))!
      expect(cooked).toBeDefined()
      const lines = aggregateShoppingIngredients(recipes, [dry.id, cooked.id], { [dry.id]: 4 }).filter(i => i.ingredientId === noodle.ingredientId)
      expect(lines.some(i => i.id.includes('::dry') && i.quantity === String(Number(noodle.quantity) * 2))).toBe(true)
      expect(lines.some(i => i.id.includes('::cooked'))).toBe(true)
    }
  })

  it('keeps the Greek soup title consistent with its lemon ingredient', () => {
    expect(bySlice(30).name.th).toContain('เลมอน')
    expect(bySlice(30).name.th).not.toContain('มะนาว')
  })
})
