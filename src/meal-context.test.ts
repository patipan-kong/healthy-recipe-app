import { describe, expect, it } from 'vitest'
import { calculateMealNutrition, validateMenuImage, validateMenuPrice } from './meal-context'
import { explorePresetFilters, filterRestaurantMenuItems, restaurantMenuItems, restaurants, searchRestaurantMenuItems, validateRestaurantMenuItems } from './restaurants'
import type { RestaurantMenuItem } from './types'

const base = { kcal: 282, protein: 39.5, carbs: 7.9, fat: 12, fiber: 2, sodium: 180 }
const addition = { kcal: 220, protein: 4.5, carbs: 45, fat: 1.5, fiber: 1, sodium: 360 }

function item(overrides: Partial<RestaurantMenuItem> = {}): RestaurantMenuItem {
  return { ...restaurantMenuItems[0], id: 'meal-context-test-item', ...overrides }
}

describe('calculateMealNutrition', () => {
  it('sums kcal, protein, carbs, and fat', () => {
    expect(calculateMealNutrition(base, addition)).toMatchObject({ kcal: 502, protein: 44, carbs: 52.9, fat: 13.5 })
  })

  it('sums sodium when both components are known', () => {
    expect(calculateMealNutrition(base, addition).sodium).toBe(540)
  })

  it('keeps sodium unknown when either component is unknown', () => {
    expect(calculateMealNutrition({ ...base, sodium: undefined }, addition).sodium).toBeUndefined()
    expect(calculateMealNutrition(base, { ...addition, sodium: undefined }).sodium).toBeUndefined()
  })

  it('sums fiber when both components are known', () => {
    expect(calculateMealNutrition(base, addition).fiber).toBe(3)
  })

  it('keeps fiber unknown when either component is unknown', () => {
    expect(calculateMealNutrition({ ...base, fiber: undefined }, addition).fiber).toBeUndefined()
    expect(calculateMealNutrition(base, { ...addition, fiber: undefined }).fiber).toBeUndefined()
  })

  it('does not mutate either input', () => {
    const originalBase = { ...base }
    const originalAddition = { ...addition }
    calculateMealNutrition(originalBase, originalAddition)
    expect(originalBase).toEqual(base)
    expect(originalAddition).toEqual(addition)
  })

  it('keeps decimal values and zero values exact', () => {
    expect(calculateMealNutrition({ kcal: 0, protein: 0, carbs: 0, fat: 0 }, { kcal: 0.5, protein: 0.25, carbs: 0.75, fat: 0.1 })).toEqual({ kcal: 0.5, protein: 0.25, carbs: 0.75, fat: 0.1 })
  })

  it('rejects negative, non-finite, and malformed nutrition', () => {
    expect(() => calculateMealNutrition({ ...base, kcal: -1 }, addition)).toThrow()
    expect(() => calculateMealNutrition({ ...base, protein: Number.NaN }, addition)).toThrow()
    expect(() => calculateMealNutrition(base, { ...addition, fat: Number.POSITIVE_INFINITY })).toThrow()
    expect(() => calculateMealNutrition(base, { kcal: 1, protein: 1, carbs: 1 } as never)).toThrow()
  })
})

describe('optional restaurant meal context and price validation', () => {
  const addOn = {
    kind: 'add-on' as const,
    label: { th: 'เพิ่มข้าว (เดโม)', en: 'Rice add-on (demo)' },
    additionNutrition: { kcal: 120, protein: 2, carbs: 25, fat: 1 },
    additionNutritionSource: { confidence: 'estimated' as const, asOf: '2026-09-15' },
  }

  it('accepts an item without optional price or meal context', () => {
    expect(validateRestaurantMenuItems([item({ price: undefined, mealContext: undefined })], restaurants)).toEqual([])
  })

  it('accepts a valid THB price and valid add-on context', () => {
    expect(validateRestaurantMenuItems([item({ price: { amount: 299, currency: 'THB', asOf: '2026-09-15' }, mealContext: addOn })], restaurants)).toEqual([])
  })

  it('rejects negative and non-finite prices', () => {
    expect(validateRestaurantMenuItems([item({ price: { amount: -1, currency: 'THB', asOf: '2026-09-15' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ price: { amount: Number.NaN, currency: 'THB', asOf: '2026-09-15' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ price: { amount: Number.POSITIVE_INFINITY, currency: 'THB', asOf: '2026-09-15' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
  })

  it('rejects invalid currency and missing or invalid price asOf', () => {
    expect(validateRestaurantMenuItems([item({ price: { amount: 299, currency: 'USD' as never, asOf: '2026-09-15' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ price: { amount: 299, currency: 'THB', asOf: '' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ price: { amount: 299, currency: 'THB', asOf: '2026-02-30' } })], restaurants)).toContain('Invalid price: meal-context-test-item')
  })

  it('requires a bilingual label and provenance for add-on nutrition', () => {
    expect(validateRestaurantMenuItems([item({ mealContext: { ...addOn, label: { th: '', en: 'Rice' } } })], restaurants)).toContain('Missing meal-context label: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ mealContext: { ...addOn, additionNutrition: { ...addOn.additionNutrition, kcal: -1 } } })], restaurants)).toContain('Invalid addition nutrition: meal-context-test-item')
    expect(validateRestaurantMenuItems([item({ mealContext: { ...addOn, additionNutritionSource: undefined } })], restaurants)).toContain('Missing meal-context provenance: meal-context-test-item')
  })

  it('accepts an already-complete context without addition nutrition', () => {
    expect(validateRestaurantMenuItems([item({ mealContext: { kind: 'already-complete', label: { th: 'ครบชุด', en: 'Complete set' } } })], restaurants)).toEqual([])
  })

  it('accepts an informational configurable context without addition nutrition', () => {
    const configurable = {
      kind: 'configurable' as const,
      label: { th: 'เครื่องเคียงอาจแตกต่าง', en: 'Sides may vary' },
      note: { th: 'อ้างอิงจากเมนูหลัก', en: 'Base serving only' },
    }
    expect(validateRestaurantMenuItems([item({ mealContext: configurable })], restaurants)).toEqual([])
    expect(validateRestaurantMenuItems([item({ mealContext: { ...configurable, additionNutrition: addition } as never })], restaurants)).toContain('Configurable meal context cannot include addition nutrition: meal-context-test-item')
  })

  it('rejects double-countable fields on an already-complete context', () => {
    expect(validateRestaurantMenuItems([item({ mealContext: { kind: 'already-complete', label: { th: 'ครบชุด', en: 'Complete set' }, additionNutrition: addOn.additionNutrition } as never })], restaurants)).toContain('Complete meal context cannot include addition nutrition: meal-context-test-item')
  })

  it('reports malformed optional models without throwing', () => {
    expect(() => validateRestaurantMenuItems([item({ price: null as never, mealContext: 'broken' as never })], restaurants)).not.toThrow()
    const errors = validateRestaurantMenuItems([item({ price: null as never, mealContext: 'broken' as never })], restaurants)
    expect(errors).toContain('Invalid price: meal-context-test-item')
    expect(errors).toContain('Invalid meal context: meal-context-test-item')
  })

  it('keeps the production dataset at the expected baseline and valid', () => {
    expect(restaurants).toHaveLength(13)
    expect(restaurantMenuItems).toHaveLength(84)
    expect(validateRestaurantMenuItems(restaurantMenuItems, restaurants)).toEqual([])
  })

  it('populates only the researched production price and meal-context fields', () => {
    const researchedItems = restaurantMenuItems.filter(item => item.restaurantId === 'ootoya-thailand' || item.restaurantId === 'santa-fe-steak-thailand')
    expect(researchedItems).toHaveLength(13)
    expect(researchedItems.filter(item => item.price)).toHaveLength(7)
    expect(researchedItems.filter(item => item.mealContext)).toHaveLength(6)
    expect(researchedItems.filter(item => item.mealContext?.kind === 'add-on')).toHaveLength(2)
    expect(researchedItems.filter(item => item.mealContext?.kind === 'add-on' && item.mealContext.additionNutrition)).toHaveLength(1)
    expect(researchedItems.filter(item => item.mealContext?.kind === 'already-complete')).toHaveLength(1)
    expect(researchedItems.filter(item => item.mealContext?.kind === 'configurable')).toHaveLength(3)
    for (const item of researchedItems) {
      expect(item).not.toHaveProperty('mealNutrition')
      expect(item).not.toHaveProperty('mealTotal')
      expect(item).not.toHaveProperty('totalNutrition')
    }

    const shima = restaurantMenuItems.find(item => item.id === 'ootoya-shima-hokke-grilled')
    const shimaContext = shima?.mealContext
    expect(shima?.mealContext).toMatchObject({
      kind: 'add-on',
      additionNutrition: { kcal: 330, protein: 6, carbs: 70, fat: 1.1, fiber: 1.4 },
      additionNutritionSource: { confidence: 'estimated', asOf: '2026-09-15' },
    })
    if (!shima || shimaContext?.kind !== 'add-on' || !shimaContext.additionNutrition) throw new Error('Expected researched Shima Hokke add-on context')
    expect(calculateMealNutrition(shima.nutrition, shimaContext.additionNutrition)).toEqual({ kcal: 612, protein: 45.5, carbs: 77.9, fat: 13.1 })

    const tonteki = restaurantMenuItems.find(item => item.id === 'ootoya-tonteki-pork-chop-set')
    expect(tonteki?.mealContext).toMatchObject({ kind: 'already-complete' })
    // Corrected in Slice 20: the official site's current "set" price is ฿429, not the ฿419 recorded in Slice 17B — see docs/restaurant-price-expansion-20.md.
    expect(tonteki?.price).toMatchObject({ amount: 429, currency: 'THB', asOf: '2026-09-15' })

    expect(restaurantMenuItems.find(item => item.id === 'santa-fe-salmon-steak')?.price).toMatchObject({ amount: 329, currency: 'THB', asOf: '2026-09-15' })
    expect(restaurantMenuItems.find(item => item.id === 'santa-fe-dory-fish-steak')?.price).toMatchObject({ amount: 209, currency: 'THB', asOf: '2026-09-15' })
    expect(restaurantMenuItems.find(item => item.id === 'santa-fe-salmon-steak')?.mealContext).toMatchObject({ kind: 'configurable' })
    expect(restaurantMenuItems.find(item => item.id === 'santa-fe-dory-fish-steak')?.mealContext).toMatchObject({ kind: 'configurable' })
    expect(restaurantMenuItems.find(item => item.id === 'santa-fe-kurobuta-pork-chop')?.mealContext).toMatchObject({ kind: 'configurable' })
    // Slice 20 added a price for the mackerel (279); it remains undefined for items where no evidence was found.
    expect(restaurantMenuItems.find(item => item.id === 'ootoya-grilled-mackerel')?.price).toMatchObject({ amount: 279, currency: 'THB' })
    expect(restaurantMenuItems.find(item => item.id === 'ootoya-grilled-salmon-rice-bowl')?.price).toBeUndefined()
    expect(restaurantMenuItems.find(item => item.id === 'santa-fe-seabass-steak')?.price).toBeUndefined()
  })

  it('keeps production search and goals based on base nutrition', () => {
    const shima = restaurantMenuItems.filter(item => item.id === 'ootoya-shima-hokke-grilled')
    expect(searchRestaurantMenuItems(shima, restaurants, 'shima')).toEqual(shima)
    expect(filterRestaurantMenuItems(shima, { maxKcal: 300 })).toEqual(shima)
    expect(filterRestaurantMenuItems(shima, explorePresetFilters['light-meal'])).toEqual(shima)
    expect(filterRestaurantMenuItems(shima, { maxKcal: 280 })).toEqual([])
  })
})

describe('optional menu image validation (Slice 18 pilot)', () => {
  const validImage = {
    src: 'https://www.ootoya.co.th/upload_file/menu/Fish-Menu/example-big.png',
    alt: { th: 'ตัวอย่างภาพเมนู', en: 'Example menu photo' },
    kind: 'official-remote' as const,
    sourceUrl: 'https://www.ootoya.co.th/menu-details.php?id=3',
    sourceLabel: { th: 'ภาพจากเว็บไซต์ทางการของโอโตยะ', en: 'Image from Ootoya official website' },
    asOf: '2026-09-15',
  }

  it('accepts an item without a menu image', () => {
    expect(validateRestaurantMenuItems([item({ menuImage: undefined })], restaurants)).toEqual([])
  })

  it('accepts a fully-populated valid menu image', () => {
    expect(validateMenuImage(validImage)).toEqual([])
    expect(validateRestaurantMenuItems([item({ menuImage: validImage })], restaurants)).toEqual([])
  })

  it('accepts a bundled image without source fields', () => {
    expect(validateMenuImage({ src: '/menu/example.webp', alt: { th: 'ตัวอย่าง', en: 'Example' }, kind: 'bundled' })).toEqual([])
  })

  it('rejects a missing src', () => {
    expect(validateMenuImage({ ...validImage, src: '' })).toContain('Invalid menu image src')
  })

  it('rejects missing or partial localized alt text', () => {
    expect(validateMenuImage({ ...validImage, alt: undefined })).toContain('Invalid menu image alt')
    expect(validateMenuImage({ ...validImage, alt: { th: 'ตัวอย่าง', en: '' } })).toContain('Invalid menu image alt')
  })

  it('rejects an invalid kind', () => {
    expect(validateMenuImage({ ...validImage, kind: 'ai-generated' })).toContain('Invalid menu image kind')
  })

  it('rejects a malformed sourceLabel or asOf when present', () => {
    expect(validateMenuImage({ ...validImage, sourceLabel: { th: 'ตัวอย่าง', en: '' } })).toContain('Invalid menu image sourceLabel')
    expect(validateMenuImage({ ...validImage, asOf: '2026-02-30' })).toContain('Invalid menu image asOf')
  })

  it('fails safely (without throwing) on a malformed menu image', () => {
    expect(() => validateRestaurantMenuItems([item({ menuImage: 'not-an-object' as never })], restaurants)).not.toThrow()
    expect(validateRestaurantMenuItems([item({ menuImage: 'not-an-object' as never })], restaurants)).toContain('Invalid menu image: meal-context-test-item')
  })

  it('keeps the two Slice 18 pilot items with a menu image, both Ootoya, both official-remote', () => {
    const withImage = restaurantMenuItems.filter(candidate => candidate.menuImage)
    const slice18Ids = ['ootoya-grilled-mackerel', 'ootoya-tonteki-pork-chop-set']
    for (const id of slice18Ids) expect(withImage.map(candidate => candidate.id)).toContain(id)
    for (const candidate of withImage.filter(candidate => slice18Ids.includes(candidate.id))) {
      expect(candidate.restaurantId).toBe('ootoya-thailand')
      expect(candidate.menuImage?.kind).toBe('official-remote')
      expect(candidate.menuImage?.sourceUrl).toMatch(/^https:\/\/www\.ootoya\.co\.th\//)
    }
  })

  it('has exactly the Slice 19 expansion batch of new image-backed items, each official-remote and each from its own restaurant\'s domain', () => {
    const withImage = restaurantMenuItems.filter(candidate => candidate.menuImage)
    const slice18Ids = ['ootoya-grilled-mackerel', 'ootoya-tonteki-pork-chop-set']
    const slice19Items = withImage.filter(candidate => !slice18Ids.includes(candidate.id))
    expect(slice19Items.map(candidate => candidate.id).sort()).toEqual([
      'ootoya-grilled-moromi-chicken',
      'salad-factory-grilled-chicken-sesame',
      'salad-factory-kale-chicken-truffle',
      'seven-eleven-garlic-pork-egg-rice',
      'seven-eleven-green-curry-chicken',
    ])
    const sourceDomainByRestaurant: Record<string, RegExp> = {
      'ootoya-thailand': /^https:\/\/www\.ootoya\.co\.th\//,
      'salad-factory-thailand': /^https:\/\/www\.saladfactorythailand\.com\//,
      'seven-eleven-thailand': /^https:\/\/(www\.allonline\.7eleven\.co\.th|media\.allonline\.7eleven\.co\.th)\//,
    }
    for (const candidate of slice19Items) {
      expect(candidate.menuImage?.kind).toBe('official-remote')
      expect(candidate.menuImage?.src).toMatch(sourceDomainByRestaurant[candidate.restaurantId])
      expect(candidate.menuImage?.sourceUrl).toMatch(sourceDomainByRestaurant[candidate.restaurantId])
    }
  })

  it('total menu-image coverage stays within Slice 18 + Slice 19 (7 of 84 items)', () => {
    const withImage = restaurantMenuItems.filter(candidate => candidate.menuImage)
    expect(withImage.length).toBe(7)
  })

  it('does not let menu image metadata affect filters, search, or Quick Goals eligibility', () => {
    const mackerel = restaurantMenuItems.find(candidate => candidate.id === 'ootoya-grilled-mackerel')!
    const withoutImage: RestaurantMenuItem = { ...mackerel, menuImage: undefined }
    expect(filterRestaurantMenuItems([mackerel], { maxKcal: 600 }).length).toBe(filterRestaurantMenuItems([withoutImage], { maxKcal: 600 }).length)
    expect(searchRestaurantMenuItems([mackerel], restaurants, 'mackerel').length).toBe(searchRestaurantMenuItems([withoutImage], restaurants, 'mackerel').length)
    const filters = explorePresetFilters['high-protein']
    expect(filterRestaurantMenuItems([mackerel], filters).length).toBe(filterRestaurantMenuItems([withoutImage], filters).length)
  })
})

describe('Slice 19 image expansion batch', () => {
  const slice19Ids = [
    'ootoya-grilled-moromi-chicken',
    'salad-factory-grilled-chicken-sesame',
    'salad-factory-kale-chicken-truffle',
    'seven-eleven-garlic-pork-egg-rice',
    'seven-eleven-green-curry-chicken',
  ]

  it('produces zero validation errors for every Slice 19 item', () => {
    const items = restaurantMenuItems.filter(candidate => slice19Ids.includes(candidate.id))
    expect(items).toHaveLength(5)
    expect(validateRestaurantMenuItems(items, restaurants)).toEqual([])
  })

  it('lets search find every Slice 19 item by its English name', () => {
    for (const id of slice19Ids) {
      const target = restaurantMenuItems.filter(candidate => candidate.id === id)
      const queryWord = target[0].name.en.split(/\s+/)[0].toLowerCase()
      expect(searchRestaurantMenuItems(restaurantMenuItems, restaurants, queryWord).some(candidate => candidate.id === id)).toBe(true)
    }
  })

  it('leaves nutrition, meal context, and serving notes unchanged for every Slice 19 item vs. its pre-Slice-19 record (price is expected to change: see Slice 20)', () => {
    const moromi = restaurantMenuItems.find(candidate => candidate.id === 'ootoya-grilled-moromi-chicken')
    expect(moromi?.nutrition).toEqual({ kcal: 336, protein: 35.1, carbs: 21.5, fat: 13.6 })
    expect(moromi?.mealContext).toBeUndefined()

    const chickenSesame = restaurantMenuItems.find(candidate => candidate.id === 'salad-factory-grilled-chicken-sesame')
    expect(chickenSesame?.nutrition).toEqual({ kcal: 430, protein: 36, carbs: 18, fat: 22 })

    const kaleTruffle = restaurantMenuItems.find(candidate => candidate.id === 'salad-factory-kale-chicken-truffle')
    expect(kaleTruffle?.nutrition).toEqual({ kcal: 450, protein: 32, carbs: 20, fat: 26 })

    const garlicPork = restaurantMenuItems.find(candidate => candidate.id === 'seven-eleven-garlic-pork-egg-rice')
    expect(garlicPork?.nutrition).toEqual({ kcal: 390, protein: 22, carbs: 54, fat: 10, sodium: 520 })
    expect(garlicPork?.servingNote?.en).toBe('One packaged ready-to-eat meal.')

    const greenCurry = restaurantMenuItems.find(candidate => candidate.id === 'seven-eleven-green-curry-chicken')
    expect(greenCurry?.nutrition).toEqual({ kcal: 360, protein: 19, carbs: 56, fat: 7, sodium: 640 })
    expect(greenCurry?.servingNote?.en).toBe('One packaged ready-to-eat meal.')
  })

  it('does not change Pick eligibility, filters, or Quick Goal counts for any Slice 19 item', () => {
    for (const id of slice19Ids) {
      const withImage = restaurantMenuItems.find(candidate => candidate.id === id)!
      const withoutImage: RestaurantMenuItem = { ...withImage, menuImage: undefined }
      for (const presetId of Object.keys(explorePresetFilters) as (keyof typeof explorePresetFilters)[]) {
        const filters = explorePresetFilters[presetId]
        expect(filterRestaurantMenuItems([withImage], filters).length).toBe(filterRestaurantMenuItems([withoutImage], filters).length)
      }
    }
  })
})

describe('Slice 20 price coverage expansion', () => {
  // The 12 items given a new price in Slice 20. `ootoya-tonteki-pork-chop-set`
  // already had a price before Slice 20 (corrected 419 -> 429) and is audited
  // separately, not counted as new coverage here.
  const newlyPricedIds = [
    'ootoya-grilled-mackerel',
    'ootoya-shima-hokke-grilled',
    'ootoya-grilled-moromi-chicken',
    'ootoya-oyakodon',
    'salad-factory-grilled-chicken-sesame',
    'salad-factory-quinoa-chicken-basil',
    'salad-factory-kale-chicken-truffle',
    'seven-eleven-garlic-pork-egg-rice',
    'seven-eleven-green-curry-chicken',
    'mk-special-kurobuta-set',
    'mk-special-kurobuta-plate',
    'mk-premium-suki-set',
  ]

  it('keeps the dataset at 13 restaurants / 84 items', () => {
    expect(restaurants).toHaveLength(13)
    expect(restaurantMenuItems).toHaveLength(84)
  })

  it('adds a new price to exactly the 12 targeted items, within the 8-15 target range and the 15 hard maximum', () => {
    const actualIds = restaurantMenuItems.filter(item => newlyPricedIds.includes(item.id)).map(item => item.id)
    expect(actualIds.sort()).toEqual([...newlyPricedIds].sort())
    expect(newlyPricedIds.length).toBeGreaterThanOrEqual(8)
    expect(newlyPricedIds.length).toBeLessThanOrEqual(15)
  })

  it('produces zero validation errors for every priced item', () => {
    const priced = restaurantMenuItems.filter(item => item.price)
    expect(validateRestaurantMenuItems(priced, restaurants)).toEqual([])
  })

  it('gives every price a valid THB amount, currency, and asOf date', () => {
    const priced = restaurantMenuItems.filter(item => item.price)
    expect(priced.length).toBeGreaterThan(0)
    for (const item of priced) {
      expect(validateMenuPrice(item.price)).toEqual([])
      expect(item.price?.currency).toBe('THB')
      expect(item.price?.amount).toBeGreaterThan(0)
      expect(Number.isFinite(item.price?.amount)).toBe(true)
      expect(item.price?.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('has no negative or zero prices anywhere in production', () => {
    for (const item of restaurantMenuItems) {
      if (item.price) expect(item.price.amount).toBeGreaterThan(0)
    }
  })

  it('never duplicates a price object reference or produces conflicting amounts for the same id', () => {
    const ids = restaurantMenuItems.filter(item => item.price).map(item => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('corrects the existing Ootoya Tonteki price (419 -> 429) with a fresh Slice 20 asOf, without touching its meal context or nutrition', () => {
    const tonteki = restaurantMenuItems.find(item => item.id === 'ootoya-tonteki-pork-chop-set')
    expect(tonteki?.price).toMatchObject({ amount: 429, currency: 'THB', asOf: '2026-09-15' })
    expect(tonteki?.nutrition).toEqual({ kcal: 750, protein: 40, carbs: 70, fat: 36 })
    expect(tonteki?.mealContext).toMatchObject({ kind: 'already-complete' })
  })

  it('leaves the two audited Santa Fe prices unchanged (confirmed still accurate, no correction needed)', () => {
    expect(restaurantMenuItems.find(item => item.id === 'santa-fe-salmon-steak')?.price).toMatchObject({ amount: 329, currency: 'THB' })
    expect(restaurantMenuItems.find(item => item.id === 'santa-fe-dory-fish-steak')?.price).toMatchObject({ amount: 209, currency: 'THB' })
  })

  it('leaves menuImage coverage exactly as Slice 19 left it (7 items, same ids)', () => {
    const withImage = restaurantMenuItems.filter(item => item.menuImage)
    expect(withImage).toHaveLength(7)
    expect(withImage.map(item => item.id).sort()).toEqual([
      'ootoya-grilled-mackerel',
      'ootoya-grilled-moromi-chicken',
      'ootoya-tonteki-pork-chop-set',
      'salad-factory-grilled-chicken-sesame',
      'salad-factory-kale-chicken-truffle',
      'seven-eleven-garlic-pork-egg-rice',
      'seven-eleven-green-curry-chicken',
    ])
  })

  it('leaves nutrition and meal-context semantics unchanged for every newly priced item', () => {
    const expectedNutrition: Record<string, object> = {
      'ootoya-grilled-mackerel': { kcal: 540, protein: 29.9, carbs: 8.3, fat: 46.3 },
      'ootoya-shima-hokke-grilled': { kcal: 282, protein: 39.5, carbs: 7.9, fat: 12 },
      'ootoya-grilled-moromi-chicken': { kcal: 336, protein: 35.1, carbs: 21.5, fat: 13.6 },
      'ootoya-oyakodon': { kcal: 610, protein: 27, carbs: 78, fat: 18 },
      'salad-factory-grilled-chicken-sesame': { kcal: 430, protein: 36, carbs: 18, fat: 22 },
      'salad-factory-quinoa-chicken-basil': { kcal: 480, protein: 35, carbs: 46, fat: 16 },
      'salad-factory-kale-chicken-truffle': { kcal: 450, protein: 32, carbs: 20, fat: 26 },
      'seven-eleven-garlic-pork-egg-rice': { kcal: 390, protein: 22, carbs: 54, fat: 10, sodium: 520 },
      'seven-eleven-green-curry-chicken': { kcal: 360, protein: 19, carbs: 56, fat: 7, sodium: 640 },
      'mk-special-kurobuta-set': { kcal: 303, protein: 18, carbs: 10, fat: 22 },
      'mk-special-kurobuta-plate': { kcal: 96, protein: 9, carbs: 1, fat: 6 },
      'mk-premium-suki-set': { kcal: 382, protein: 24, carbs: 16, fat: 26 },
    }
    for (const id of newlyPricedIds) {
      const found = restaurantMenuItems.find(item => item.id === id)
      expect(found?.nutrition).toEqual(expectedNutrition[id])
    }
    // Only the two items that already had an add-on/already-complete meal context keep one; none of the newly priced items gained a new mealContext.
    const withMealContext = newlyPricedIds.filter(id => restaurantMenuItems.find(item => item.id === id)?.mealContext)
    expect(withMealContext.sort()).toEqual(['ootoya-grilled-mackerel', 'ootoya-shima-hokke-grilled'])
  })

  it('lets search still find every newly priced item, and leaves eligibility/Quick-Goal counts unchanged with vs. without the new price', () => {
    for (const id of newlyPricedIds) {
      const withPrice = restaurantMenuItems.find(item => item.id === id)!
      expect(searchRestaurantMenuItems(restaurantMenuItems, restaurants, withPrice.name.en.split(/\s+/)[0].toLowerCase()).some(item => item.id === id)).toBe(true)

      const withoutPrice: RestaurantMenuItem = { ...withPrice, price: undefined }
      expect(searchRestaurantMenuItems([withPrice], restaurants, withPrice.name.en.split(/\s+/)[0]).length).toBe(searchRestaurantMenuItems([withoutPrice], restaurants, withPrice.name.en.split(/\s+/)[0]).length)
      for (const presetId of Object.keys(explorePresetFilters) as (keyof typeof explorePresetFilters)[]) {
        const filters = explorePresetFilters[presetId]
        expect(filterRestaurantMenuItems([withPrice], filters).length).toBe(filterRestaurantMenuItems([withoutPrice], filters).length)
      }
    }
  })
})
