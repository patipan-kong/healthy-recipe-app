import { describe, expect, it } from 'vitest'
import { canonicalIngredients } from './pantry'
import { recipes, validateRecipes } from './recipes'
import { aggregateShoppingIngredients } from './shopping'
import { parseIngredientMeasurement } from './measurements'

const highPriorityIds = [
  'herb-grilled-chicken',
  'veggie-bibimbap',
  'steamed-lime-seabass',
  'chicken-basil-rice-egg',
  'lean-beef-bibimbap',
  'mediterranean-chicken-bowl',
  'thai-pork-satay-brown-rice',
  'thai-vegetable-pad-see-ew',
  'thai-lentil-larb',
  'thai-eggplant-tofu-salad',
  'thai-chicken-rice-noodle-soup',
  'thai-beef-basil-mushroom',
  'thai-papaya-tofu-salad',
  'korean-beef-lettuce-bowl',
  'korean-salmon-rice-bowl',
  'korean-egg-roll-rice',
  'vietnamese-chicken-pho',
  'baked-cod-lemon-herbs',
  'turkey-meatballs-tomato-quinoa',
  'lentil-quinoa-herb-salad',
  'roasted-vegetable-couscous',
  'mushroom-barley-bowl',
  'shakshuka-whole-wheat-toast',
  'black-bean-sweet-potato-chili',
] as const



const mediumPriorityIds = [
  'tom-yum-prawns', 'glass-noodle-seafood-salad', 'tofu-mince-soup', 'gazpacho-chickpea', 'broccoli-prawn-stirfry',
  'grilled-chicken-jaew', 'chicken-larb-brown-rice', 'grilled-tilapia-herb-salad', 'shrimp-lemongrass-salad', 'chicken-green-curry-brown-rice',
  'spicy-grilled-pork-salad', 'tofu-basil-stir-fry', 'chicken-soba-bowl', 'salmon-soba-salad', 'tuna-onigiri-plate',
  'korean-tofu-glass-noodles', 'grilled-chicken-caesar-salad', 'chicken-avocado-wrap', 'shrimp-tomato-pasta', 'chicken-pesto-pasta',
  'thai-red-curry-tofu', 'thai-pumpkin-chicken-soup', 'thai-mushroom-cashew-stir-fry', 'thai-steamed-chicken-cabbage', 'chicken-oyakodon',
  'salmon-ochazuke', 'tofu-yakisoba-vegetables', 'edamame-egg-sushi-bowl', 'soba-tuna-cucumber-bowl', 'japanese-mushroom-chestnut-rice',
  'korean-bean-sprout-chicken-soup', 'light-mapo-tofu', 'white-bean-tomato-soup', 'hummus-chicken-pita',
] as const

const recipeById = (id: string) => {
  const recipe = recipes.find(candidate => candidate.id === id)
  if (!recipe) throw new Error(`Missing recipe fixture: ${id}`)
  return recipe
}

describe('high-priority recipe quality corrections', () => {
  it('pairs Thai garlic and fish sauce with the intended measurements', () => {
    const items = recipeById('chicken-basil-rice-egg').ingredients
    expect(items.find(i => i.item.th === 'กระเทียมสับ')?.amount).toBe('2 cloves')
    expect(items.find(i => i.item.th === 'น้ำปลา')?.amount).toBe('2 tsp')
  })

  it('preserves canonical identities when clarifying chicken cuts and noodles', () => {
    const chicken = recipeById('herb-grilled-chicken').ingredients[0]
    expect(chicken.item.en).toMatch(/thighs.*boneless/i)
    expect(chicken.item.th).toMatch(/สะโพก.*เลาะกระดูก/)
    expect(chicken.ingredientId).toBe('chicken-thigh')
    const noodles = recipeById('thai-vegetable-pad-see-ew').ingredients[0]
    expect(noodles.item.en).toMatch(/rice noodles.*flat/i)
    expect(noodles.item.th).toContain('ข้าวเส้นแบน')
    expect(noodles.item.en).not.toMatch(/wheat/i)
    expect(noodles.amount).toBe('300 g')
    expect(noodles.ingredientId).toBe('rice-noodles')
    expect(recipeById('thai-eggplant-tofu-salad').ingredients[1].ingredientId).toBe('eggplant')
  })

  it('allocates the single measured satay fish sauce across both components', () => {
    const satay = recipeById('thai-pork-satay-brown-rice')
    const fishSauce = satay.ingredients.filter(i => /fish sauce/i.test(i.item.en))
    expect(fishSauce).toHaveLength(1)
    expect(fishSauce[0].amount).toBe('1 tsp')
    expect(satay.instructions[0].en).toMatch(/half the fish sauce/)
    expect(satay.instructions[2].en).toMatch(/remaining fish sauce/)
    expect(satay.instructions[0].th).toContain('น้ำปลาครึ่งหนึ่ง')
    expect(satay.instructions[2].th).toContain('น้ำปลาที่เหลือ')
  })

  it('cooks beef-basil vegetables before finishing with basil and starts aromatics with water', () => {
    const steps = recipeById('thai-beef-basil-mushroom').instructions
    expect(steps[0].en).toMatch(/water.*non-stick/)
    expect(steps[0].th).toContain('น้ำ 2 ช้อนโต๊ะ')
    expect(steps[1].en).toMatch(/mushrooms soften.*beans are tender-crisp/)
    expect(steps[1].th).toContain('เห็ดนุ่มและถั่วสุกกรอบ')
    expect(steps[2].en).toMatch(/soy sauce.*basil/)
  })

  it('shares egg-roll soy and oil without increasing the measured totals', () => {
    const egg = recipeById('korean-egg-roll-rice')
    expect(egg.ingredients.find(i => /soy sauce/i.test(i.item.en))?.amount).toBe('1 tsp')
    expect(egg.ingredients.find(i => /sesame oil/i.test(i.item.en))?.amount).toBe('1 tsp')
    expect(egg.instructions[0].en).toContain('half the soy sauce')
    expect(egg.instructions[1].en).toContain('half the sesame oil')
    expect(egg.instructions[2].en).toMatch(/remaining soy sauce.*quarter of the sesame oil/)
    expect(egg.instructions[3].en).toContain('remaining quarter')
    expect(egg.instructions[1].th).toContain('น้ำมันงาครึ่งหนึ่ง')
    expect(egg.instructions[2].th).toContain('ซีอิ๊วขาวที่เหลือ')
    expect(egg.instructions[3].th).toContain('หนึ่งในสี่ส่วนที่เหลือ')
  })

  it('identifies chili seasoning as a mild blend in both languages', () => {
    const chili = recipeById('black-bean-sweet-potato-chili')
    const blend = chili.ingredients.find(i => /chili seasoning/i.test(i.item.en))
    expect(blend?.item.en).toMatch(/mild.*blend/i)
    expect(blend?.item.th).toMatch(/ผสม.*เผ็ดอ่อน/)
    expect(blend?.amount).toBe('1 tbsp')
    expect(chili.ingredients.some(i => i.item.th === 'พริกป่น')).toBe(false)
  })

  it('keeps the correction scope at exactly the audited HIGH set', () => {
    expect(highPriorityIds).toHaveLength(24)
    expect(new Set(highPriorityIds).size).toBe(24)
    expect(highPriorityIds.every(id => recipes.some(recipe => recipe.id === id))).toBe(true)
    expect(recipes).toHaveLength(100)
    expect(validateRecipes(recipes)).toEqual([])
  })

  it('keeps Thai and English content structurally equivalent for every corrected recipe', () => {
    for (const id of highPriorityIds) {
      const recipe = recipeById(id)
      expect(recipe.ingredients.length, `${id} ingredient count`).toBeGreaterThan(0)
      expect(recipe.instructions.length, `${id} instruction count`).toBeGreaterThan(0)
      expect(recipe.ingredients.every(ingredient => ingredient.item.th.trim() && ingredient.item.en.trim())).toBe(true)
      expect(recipe.instructions.every(instruction => instruction.th.trim() && instruction.en.trim())).toBe(true)
      for (const ingredient of recipe.ingredients) {
        expect(() => parseIngredientMeasurement(ingredient.amount ?? String(ingredient.quantity), ingredient.item.en)).not.toThrow()
      }
    }
  })

  it('covers the intended flavor, technique, and quantity corrections', () => {
    const bibimbap = recipeById('veggie-bibimbap')
    expect(bibimbap.ingredients.find(ingredient => ingredient.item.en === 'Gochujang')?.amount).toBe('1 tbsp')
    expect(bibimbap.instructions.some(step => step.en.includes('rice vinegar'))).toBe(true)

    const padSeeEw = recipeById('thai-vegetable-pad-see-ew')
    expect(padSeeEw.ingredients.find(ingredient => ingredient.item.en.startsWith('Rice noodles, flat'))?.amount).toBe('300 g')
    expect(padSeeEw.ingredients.map(ingredient => ingredient.item.en)).toEqual([
      'Rice noodles, flat, cooked', 'Eggs', 'Chinese broccoli, chopped', 'Firm tofu, sliced',
      'Reduced-sodium dark soy sauce', 'Reduced-sodium light soy sauce', 'Brown sugar', 'Neutral oil', 'Garlic, minced',
    ])

    const chickenBasil = recipeById('chicken-basil-rice-egg')
    expect(chickenBasil.instructions[0].en.toLowerCase()).toContain('fry the eggs')
    expect(chickenBasil.instructions[1].en.toLowerCase()).toContain('remaining oil')

    const pho = recipeById('vietnamese-chicken-pho')
    expect(pho.ingredients.map(ingredient => ingredient.item.en)).toEqual([
      'Skinless chicken breast, split horizontally to even thickness', 'Rice noodles, dry', 'Low-sodium stock', 'Bean sprouts', 'Thai basil leaves',
      'Lime juice', 'Ginger, sliced', 'Onion, halved', 'Star anise', 'Cinnamon', 'Fish sauce',
    ])
    expect(pho.instructions[2].en.toLowerCase()).toContain('separately')

    const shakshuka = recipeById('shakshuka-whole-wheat-toast')
    expect(shakshuka.ingredients.map(ingredient => ingredient.item.en)).toContain('Ground cumin')
    expect(shakshuka.ingredients.map(ingredient => ingredient.item.en)).toContain('Paprika')

    const chili = recipeById('black-bean-sweet-potato-chili')
    expect(chili.ingredients.map(ingredient => ingredient.item.en)).toEqual([
      'Black beans, rinsed', 'Sweet potato, cubed', 'Tomatoes, chopped', 'Bell pepper, diced', 'Corn kernels',
      'Olive oil', 'Onion, diced', 'Garlic, minced', 'Mild chili seasoning blend', 'Ground cumin', 'Paprika', 'Fine salt',
      'Brown rice, cooked',
    ])
    expect(chili.instructions[2].en).toContain('250 ml water')
  })

  it('preserves dietary labels while removing fish sauce from vegetarian corrections', () => {
    for (const id of ['thai-lentil-larb', 'thai-eggplant-tofu-salad', 'thai-papaya-tofu-salad']) {
      const recipe = recipeById(id)
      expect(recipe.tags).toContain('Vegetarian')
      expect(recipe.ingredients.some(ingredient => /fish sauce|oyster sauce|pork|chicken|beef|seafood/i.test(ingredient.item.en))).toBe(false)
    }
    expect(recipeById('thai-lentil-larb').tags).toContain('Vegan')
  })

  it('keeps the canonical pantry vocabulary stable and scales corrected shopping quantities', () => {
    expect(canonicalIngredients).toHaveLength(117)
    const padLines = aggregateShoppingIngredients(recipes, ['thai-vegetable-pad-see-ew'], { 'thai-vegetable-pad-see-ew': 4 })
    expect(padLines.find(line => line.ingredientId === 'tofu')?.quantity).toBe('360')
    const phoLines = aggregateShoppingIngredients(recipes, ['vietnamese-chicken-pho'], { 'vietnamese-chicken-pho': 4 })
    expect(phoLines.find(line => line.ingredientId === 'stock')?.quantity).toBe('1400')
    const baseLines = aggregateShoppingIngredients(recipes, ['baked-cod-lemon-herbs'])
    const doubledLines = aggregateShoppingIngredients(recipes, ['baked-cod-lemon-herbs'], { 'baked-cod-lemon-herbs': 4 })
    expect(doubledLines.find(line => line.ingredientId === 'white-fish')?.quantity).toBe('640')
    expect(baseLines.find(line => line.ingredientId === 'white-fish')?.quantity).toBe('320')
  })

  it('keeps all corrected recipe images on the existing WebP paths', () => {
    for (const id of highPriorityIds) expect(recipeById(id).image).toBe(`/recipes/${id}.webp`)
  })
})


describe('medium-priority culinary corrections', () => {
  it('keeps the bounded MEDIUM set complete and structurally valid', () => {
    expect(mediumPriorityIds).toHaveLength(34)
    expect(new Set(mediumPriorityIds).size).toBe(34)
    expect(mediumPriorityIds.every(id => recipes.some(recipe => recipe.id === id))).toBe(true)
    for (const id of mediumPriorityIds) {
      const recipe = recipeById(id)
      expect(recipe.ingredients.every(i => i.item.th.trim() && i.item.en.trim())).toBe(true)
      expect(recipe.instructions.every(step => step.th.trim() && step.en.trim())).toBe(true)
      for (const ingredient of recipe.ingredients) expect(() => parseIngredientMeasurement(ingredient.amount ?? String(ingredient.quantity), ingredient.item.en)).not.toThrow()
      expect(recipe.image).toBe(`/recipes/${id}.webp`)
    }
    expect(validateRecipes(recipes)).toEqual([])
  })

  it('adds flavor identity without losing canonical pantry identities', () => {
    expect(recipeById('tofu-basil-stir-fry').ingredients.map(i => i.item.en)).toContain('Garlic, minced')
    expect(recipeById('tofu-basil-stir-fry').ingredients.find(i => i.item.en === 'Garlic, minced')?.ingredientId).toBe('garlic')
    expect(recipeById('shrimp-lemongrass-salad').ingredients.find(i => i.item.en.startsWith('Lemongrass'))?.ingredientId).toBe('lemongrass')
    expect(recipeById('thai-pumpkin-chicken-soup').ingredients.map(i => i.item.en)).toContain('Fish sauce')
    expect(recipeById('light-mapo-tofu').ingredients.map(i => i.item.en)).toEqual(expect.arrayContaining(['Garlic, minced', 'Ginger, minced', 'Chilli bean paste']))
  })

  it('makes the previously thin noodle and bowl sauces executable', () => {
    const yakisoba = recipeById('tofu-yakisoba-vegetables')
    expect(yakisoba.ingredients.find(i => /noodles/i.test(i.item.en))?.amount).toBe('300 g')
    expect(yakisoba.ingredients.find(i => /yakisoba sauce/i.test(i.item.en))?.amount).toBe('2 tbsp')
    expect(yakisoba.instructions[0].en).toContain('half the sesame oil')
    expect(yakisoba.instructions[1].en).toContain('remaining sesame oil')

    const soba = recipeById('soba-tuna-cucumber-bowl')
    expect(soba.ingredients.map(i => i.item.en)).toEqual(expect.arrayContaining(['Rice vinegar', 'Sesame oil']))
    expect(recipeById('salmon-ochazuke').ingredients.map(i => i.item.en)).toContain('Reduced-sodium soy sauce')
  })

  it('keeps representative corrected quantities compatible with Shopping scaling', () => {
    const yakisoba = aggregateShoppingIngredients(recipes, ['tofu-yakisoba-vegetables'], { 'tofu-yakisoba-vegetables': 4 })
    expect(yakisoba.find(line => line.ingredientId === 'whole-wheat-noodles')?.quantity).toBe('600')
    const soup = aggregateShoppingIngredients(recipes, ['thai-pumpkin-chicken-soup'], { 'thai-pumpkin-chicken-soup': 4 })
    expect(soup.find(line => line.ingredientId === 'stock')?.quantity).toBe('1200')
  })

  it('keeps vegetarian and vegan corrected recipes free of obvious animal seasonings', () => {
    for (const id of ['gazpacho-chickpea', 'tofu-basil-stir-fry', 'korean-tofu-glass-noodles', 'thai-red-curry-tofu', 'thai-mushroom-cashew-stir-fry', 'tofu-yakisoba-vegetables', 'edamame-egg-sushi-bowl', 'soba-tuna-cucumber-bowl', 'japanese-mushroom-chestnut-rice', 'white-bean-tomato-soup']) {
      const recipe = recipeById(id)
      expect(recipe.ingredients.some(i => /fish sauce|oyster sauce|chicken|pork|beef|seafood/i.test(i.item.en))).toBe(false)
    }
  })
})
