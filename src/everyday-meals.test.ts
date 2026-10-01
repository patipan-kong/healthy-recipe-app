import { describe, expect, it } from 'vitest'
import { calculateNutritionWithAddOns, everydayMealNutritionSources, everydayMeals, filterEverydayMeals, getEverydayMealById, getEverydayMeals, getRandomEverydayMeal, mealAddOns, searchEverydayMeals } from './everyday-meals'

const meal = (number: number) => everydayMeals[number - 1]
const thaiNames = 'สุกี้หมู|สุกี้ไก่|สุกี้ทะเล|ข้าวต้มหมู|ข้าวต้มปลา|ข้าวต้มกุ้ง|โจ๊กหมู|ต้มเลือดหมู + ข้าว|เกาเหลาหมู + ข้าว|เกาเหลาเนื้อ + ข้าว|ก๋วยเตี๋ยวหมูน้ำใส|ก๋วยเตี๋ยวหมูต้มยำ|ก๋วยเตี๋ยวเรือหมู|ก๋วยเตี๋ยวเรือเนื้อ|ก๋วยเตี๋ยวไก่มะระ|เย็นตาโฟ|บะหมี่เกี๊ยวหมูแดง|ราดหน้าหมู|ผัดซีอิ๊วหมู|ก๋วยเตี๋ยวคั่วไก่|ผัดไทยกุ้งสด|ข้าวกะเพราหมูสับ|ข้าวกะเพราไก่|ข้าวกะเพราเนื้อ|ข้าวหมูกระเทียม|ข้าวไก่กระเทียม|ข้าวพริกแกงหมู|ข้าวพริกแกงไก่|ข้าวคะน้าหมู|ข้าวผัดผักรวมหมู|ข้าวผัดหมู|ข้าวผัดกุ้ง|ข้าวผัดปู|ข้าวไข่เจียวหมูสับ|ข้าวไข่ข้นไก่|ข้าวมันไก่|ข้าวมันไก่ทอด|ข้าวหมูแดง|ข้าวหมูกรอบ|ข้าวขาหมู|ข้าวหน้าเป็ด|ข้าวหมูทอด|ข้าวไก่ย่าง|ข้าวคลุกกะปิ|ข้าวหมูย่างจิ้มแจ่ว|ข้าวไก่ย่างจิ้มแจ่ว|ข้าวลาบหมู|ข้าวน้ำตกหมู|ส้มตำ + ไก่ย่าง + ข้าวเหนียว|ลาบหมู + ข้าวเหนียว + ผัก'.split('|')
const kcalPairs = '220-450 200-430 200-400 250-350 220-350 230-350 300-500 300-450 250-400 250-400 280-400 320-450 300-450 300-450 300-450 300-450 350-500 400-550 500-700 500-700 450-650 450-650 400-600 450-650 450-650 400-600 450-650 400-600 450-650 400-600 500-650 450-600 450-600 500-700 450-650 500-650 500-700 400-550 600-750 600-750 500-700 500-700 400-600 500-650 450-650 400-600 400-550 400-550 500-750 400-600'.split(' ')
const proteinPairs = '20-30 20-30 18-28 12-20 14-22 12-20 17-24 25-35 15-25 15-25 15-25 15-25 15-25 18-28 18-28 12-22 18-28 15-25 15-25 20-30 15-25 15-25 15-25 18-28 18-28 18-28 15-25 15-25 15-25 15-25 15-25 15-25 15-25 15-25 20-30 20-30 18-28 15-25 15-25 20-30 25-32 20-30 25-35 20-25 25-35 25-35 20-30 22-32 25-40 20-30'.split(' ')
const range = (pair: string) => { const [min, max] = pair.split('-').map(Number); return { min, max } }

describe('Everyday Meals catalog', () => {
  it('contains exactly 50 unique bilingual complete meals with valid nutrition', () => {
    expect(everydayMeals).toHaveLength(50)
    expect(everydayMeals.map(item => item.nameTh)).toEqual(thaiNames)
    expect(new Set(everydayMeals.map(item => item.id)).size).toBe(50)
    expect(new Set(everydayMeals.map(item => item.nameTh)).size).toBe(50)
    everydayMeals.forEach((item, index) => {
      expect(item.id).toMatch(/^[a-z]+(?:-[a-z]+)*$/)
      expect(item.nameTh.trim()).not.toBe('')
      expect(item.nameEn.trim()).not.toBe('')
      expect(item.category).toBe(index < 3 ? 'suki' : index < 7 ? 'porridge' : index < 10 ? 'soup' : index < 21 ? 'noodle' : 'rice')
      item.tags.forEach(tag => expect(['light', 'high-protein', 'veggie-rich']).toContain(tag))
      expect(['high', 'medium']).toContain(item.nutrition.confidence)
      expect(item.nutrition.servingAssumption.trim()).not.toBe('')
      for (const value of [item.nutrition.kcal, item.nutrition.proteinG]) {
        expect(value).toBeDefined()
        expect(Number.isFinite(value!.min) && Number.isFinite(value!.max)).toBe(true)
        expect(value!.min).toBeGreaterThanOrEqual(0)
        expect(value!.min).toBeLessThanOrEqual(value!.max)
      }
      expect(item.nutrition.kcal).toEqual(range(kcalPairs[index]))
      expect(item.nutrition.proteinG).toEqual(range(proteinPairs[index]))
      expect(item.image).toBeUndefined()
    })
  })

  it('preserves every locked curated tag assignment independently of protein', () => {
    expect(everydayMeals.filter(item => item.tags.includes('light'))).toHaveLength(6)
    expect(everydayMeals.filter(item => item.tags.includes('high-protein'))).toHaveLength(10)
    expect(everydayMeals.filter(item => item.tags.includes('veggie-rich'))).toHaveLength(6)
    const lightOptions = everydayMeals.flatMap(item => (item.optionGroups ?? []).flatMap(group => group.choices.filter(choice => choice.tags?.includes('light')).map(choice => [item.id, group.id, choice.id])))
    expect(lightOptions).toEqual([1,2,3].map(n => [meal(n).id, 'preparation', 'soup']))
    everydayMeals.forEach((item, index) => {
      const n = index + 1
      const expected = [4,5,6,9,10,11].includes(n) ? ['light'] : [1,2,49,50].includes(n) ? ['high-protein','veggie-rich'] : [3,30].includes(n) ? ['veggie-rich'] : [8,41,43,45,46,48].includes(n) ? ['high-protein'] : []
      expect(item.tags).toEqual(expected)
    })
  })

  it('resolves references and keeps option identifiers unique within their scopes', () => {
    const sources = new Set(everydayMealNutritionSources.map(source => source.id))
    const addOns = new Set(mealAddOns.map(addOn => addOn.id))
    expect(sources.size).toBe(everydayMealNutritionSources.length)
    expect(addOns.size).toBe(2)
    for (const item of [...everydayMeals, ...mealAddOns]) item.sourceIds?.forEach(id => expect(sources.has(id)).toBe(true))
    for (const item of everydayMeals) {
      item.addOnIds?.forEach(id => expect(addOns.has(id)).toBe(true))
      const groups = item.optionGroups ?? []
      expect(new Set(groups.map(group => group.id)).size).toBe(groups.length)
      groups.forEach(group => expect(new Set(group.choices.map(choice => choice.id)).size).toBe(group.choices.length))
    }
    // No unverified source is silently presented as supporting a meal or egg.
    expect([...everydayMeals, ...mealAddOns].every(item => !Object.hasOwn(item, 'sourceIds'))).toBe(true)
    expect(everydayMealNutritionSources).toEqual([])
  })

  it('keeps preparation ranges and semantic skin choices without flat variants', () => {
    const expected = [['220-350','350-450'],['200-330','330-430'],['200-330','300-400']]
    for (let i = 0; i < 3; i++) {
      expect(meal(i+1).optionGroups?.map(group => group.id)).toEqual(['preparation'])
      const choices = meal(i+1).optionGroups![0].choices
      expect(choices.map(choice => choice.id)).toEqual(['soup','dry'])
      expect(choices.map(choice => choice.nutrition?.kcal)).toEqual(expected[i].map(range))
      expect(choices[0].tags).toEqual(['light'])
      expect(choices[1].tags ?? []).not.toContain('light')
      expect(meal(i+1).addOnIds ?? []).toEqual([])
    }
    expect(meal(36).optionGroups?.map(group => group.id)).toEqual(['chicken-part','skin'])
    expect(meal(36).optionGroups![0].choices.map(choice => choice.id)).toEqual(['breast','drumstick','thigh'])
    expect(meal(17).optionGroups![0].choices.map(choice => choice.id)).toEqual(['soup','dry'])
    const options = everydayMeals.flatMap(item => item.optionGroups ?? [])
    expect(options).toHaveLength(11)
    expect(options.flatMap(group => group.choices)).toHaveLength(23)
    expect(everydayMeals.filter(item => item.optionGroups).map(item => item.id)).toEqual([1,2,3,17,36,40,41,43,46,49].map(n => meal(n).id))
    everydayMeals.slice(3).flatMap(item => item.optionGroups ?? []).flatMap(group => group.choices).forEach(choice => {
      expect(choice.nutrition).toBeUndefined()
      if (choice.id === 'skinless') expect(choice.nutritionEffect).toBe('lower-energy')
    })
  })
})

describe('Everyday Meals add-ons', () => {
  it('uses exactly two reusable rounded egg estimates and conservative assignments', () => {
    expect(mealAddOns.map(addOn => [addOn.id, addOn.nutrition.kcal])).toEqual([['boiled-egg',range('70-70')],['fried-egg',range('150-150')]])
    expect(everydayMeals.filter(item => item.addOnIds?.includes('boiled-egg')).map(item => item.id)).toEqual([4,7,22,23,24,40].map(n => meal(n).id))
    expect(everydayMeals.filter(item => item.addOnIds?.includes('fried-egg')).map(item => item.id)).toEqual([22,23,24,25,26,27,28,29,31,32].map(n => meal(n).id))
    expect(meal(20).addOnIds).toBeUndefined()
  })

  it('adds endpoints without mutation and omits unknown combined macros', () => {
    const before = structuredClone(meal(22))
    const result = calculateNutritionWithAddOns(meal(22), ['fried-egg'])
    expect(result.kcal).toEqual(range('600-800'))
    expect(result.proteinG).toBeUndefined()
    expect(result.servingAssumption).toContain('ไข่ดาว 1 ฟอง')
    expect(result.confidence).toBe('medium')
    expect(calculateNutritionWithAddOns(meal(22), ['boiled-egg','fried-egg']).kcal).toEqual(range('670-870'))
    expect(meal(22)).toEqual(before)
    result.kcal.min = 0
    expect(meal(22)).toEqual(before)
    const unchanged = calculateNutritionWithAddOns(meal(22), [])
    expect(unchanged).toEqual(before.nutrition)
    expect(unchanged.kcal).not.toBe(meal(22).nutrition.kcal)
    expect(unchanged.proteinG).not.toBe(meal(22).nutrition.proteinG)
  })

  it('rejects unknown, unavailable and duplicate selections', () => {
    expect(() => calculateNutritionWithAddOns(meal(22), ['unknown'])).toThrow('Invalid add-on')
    expect(() => calculateNutritionWithAddOns(meal(1), ['fried-egg'])).toThrow('Invalid add-on')
    expect(() => calculateNutritionWithAddOns(meal(22), ['fried-egg','fried-egg'])).toThrow('Duplicate add-on')
  })
})

describe('Everyday Meals selectors', () => {
  it('looks up IDs and searches Thai and English locally with trimmed queries', () => {
    expect(getEverydayMealById(meal(36).id)).toBe(meal(36))
    expect(getEverydayMealById('unknown')).toBeUndefined()
    expect(searchEverydayMeals(' ข้าวมันไก่ ')).toEqual([meal(36),meal(37)])
    expect(searchEverydayMeals(' HAINANESE ')).toEqual([meal(36)])
    expect(searchEverydayMeals('  ')).toEqual(everydayMeals)
    expect(searchEverydayMeals('unknown')).toEqual([])
    const all = getEverydayMeals()
    all.pop()
    expect(everydayMeals).toHaveLength(50)
  })

  it('composes category and base curated tag filters without mutation', () => {
    const before = structuredClone(everydayMeals)
    expect(filterEverydayMeals({})).toEqual(everydayMeals)
    expect(filterEverydayMeals({category:'porridge'})).toEqual([4,5,6,7].map(meal))
    expect(filterEverydayMeals({tag:'light'})).toEqual([4,5,6,9,10,11].map(meal))
    expect(filterEverydayMeals({category:'porridge',tag:'light'})).toEqual([4,5,6].map(meal))
    expect(filterEverydayMeals({category:'suki',tag:'light'})).toEqual([])
    expect(everydayMeals).toEqual(before)
  })

  it('samples each of the 50 meal intervals once regardless of options or add-ons', () => {
    expect(getRandomEverydayMeal(() => 0)).toBe(meal(1))
    expect(getRandomEverydayMeal(() => 0.999999)).toBe(meal(50))
    expect(everydayMeals).toContain(getRandomEverydayMeal())
    expect(Array.from({length:50}, (_, i) => getRandomEverydayMeal(() => (i+0.5)/50))).toEqual(everydayMeals)
  })
})
