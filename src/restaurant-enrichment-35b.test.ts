import { describe, expect, it } from 'vitest'
import { restaurantMenuItems, restaurants } from './restaurants'
import { validateMenuImage, validateMenuPrice } from './meal-context'

const find = (id: string) => {
  const item = restaurantMenuItems.find(candidate => candidate.id === id)
  if (!item) throw new Error(`missing item ${id}`)
  return item
}

describe('Slice 35B verified restaurant content enrichment', () => {
  const newPrices: Record<string, number> = {
    'jones-grilled-salmon-salad': 369,
    'jones-caribbean-chicken-steak': 199,
    'jones-mushroom-soup': 59,
    'fuji-salmon-shioyaki-brown-rice-set': 330,
    'fuji-salmon-shioyaki': 290,
    'fuji-salmon-tataki': 270,
    'fuji-kinoko-mushroom-salad': 180,
    'fuji-chicken-teriyaki': 170,
    'fuji-chirashi-sushi-don-set': 390,
    'mk-special-vegetable-set': 72,
    'mk-seafood-suki-broth': 142,
    'mk-pork-shabu': 72,
    'sukiya-gyudon-regular': 89,
    'sukiya-gyudon-okra-regular': 119,
    'sukiya-curry-rice-regular': 89,
    'sukiya-beef-plate-no-rice': 75,
    'sukiya-salad': 45,
    'sukiya-miso-soup': 30,
    'thongsmith-dry-rice-kurobuta-braised-pork': 239,
    'thongsmith-grilled-pork-meatballs': 119,
  }

  it('adds the 20 verified prices in THB with valid dated notes', () => {
    expect(Object.keys(newPrices)).toHaveLength(20)
    for (const [id, amount] of Object.entries(newPrices)) {
      const price = find(id).price
      expect(price, id).toMatchObject({ amount, currency: 'THB' })
      expect(validateMenuPrice(price), id).toEqual([])
      expect(price?.note?.en.length, id).toBeGreaterThan(0)
    }
  })

  it('keeps the price qualifications the audit requires', () => {
    expect(find('fuji-salmon-shioyaki').price?.note?.en).toMatch(/À la carte/)
    expect(find('fuji-chicken-teriyaki').price?.note?.en).toMatch(/À la carte/)
    expect(find('sukiya-gyudon-regular').price?.note?.en).toMatch(/size M/i)
    expect(find('thongsmith-grilled-pork-meatballs').price?.note?.en).toMatch(/10% service charge/)
    expect(find('jones-mushroom-soup').price?.note?.en).toMatch(/plain/i)
  })

  it('corrects the Nittaya grilled pork neck to THB 140 and leaves the other Nittaya prices alone', () => {
    expect(find('nittaya-grilled-pork-neck').price).toMatchObject({ amount: 140, currency: 'THB', asOf: '2026-09-30' })
    expect(find('nittaya-som-tam-thai').price?.amount).toBe(75)
    expect(find('nittaya-larb-moo').price?.amount).toBe(95)
    expect(find('nittaya-chiang-mai-fried-pork').price?.amount).toBe(105)
  })

  it('leaves the conflicting MK small health vegetable set unpriced', () => {
    expect(find('mk-health-vegetable-set-small').price).toBeUndefined()
  })

  it('leaves existing unrelated prices unchanged', () => {
    expect(find('ootoya-grilled-mackerel').price?.amount).toBe(279)
    expect(find('mk-premium-suki-set').price?.amount).toBe(259)
    expect(find('santa-fe-salmon-steak').price?.amount).toBe(329)
    expect(find('zaab-eli-grilled-chicken').price?.amount).toBe(299)
    expect(find('salad-factory-grilled-chicken-sesame').price?.amount).toBe(155)
    expect(find('salad-factory-kale-chicken-truffle').price?.amount).toBe(235)
  })

  it('adds the five official-remote images with official-page provenance', () => {
    const expected: Record<string, RegExp> = {
      'mk-health-vegetable-set-small': /^https:\/\/www\.mkrestaurant\.com\/public\/uploads\/mk_menu\/images\/9618d5c6fad45c5a7d6dd01524873ca7\.jpg$/,
      'nittaya-grilled-pork-neck': /^https:\/\/www\.nittayakaiyang\.com\/wp-content\/uploads\/2023\/04\/.+-07\.jpg$/,
      'nittaya-som-tam-thai': /^https:\/\/www\.nittayakaiyang\.com\/wp-content\/uploads\/2023\/03\/.+-1\.jpg$/,
      'nittaya-larb-moo': /^https:\/\/www\.nittayakaiyang\.com\/wp-content\/uploads\/2023\/04\/.+-07\.jpg$/,
      'nittaya-chiang-mai-fried-pork': /^https:\/\/www\.nittayakaiyang\.com\/wp-content\/uploads\/2023\/04\/.+-07\.jpg$/,
    }
    for (const [id, src] of Object.entries(expected)) {
      const image = find(id).menuImage
      expect(image?.kind, id).toBe('official-remote')
      expect(image?.src, id).toMatch(src)
      expect(image?.sourceUrl, id).toMatch(/^https:\/\/www\.(mkrestaurant|nittayakaiyang)\.com\//)
      expect(image?.sourceUrl, id).not.toBe(image?.src)
      expect(image?.sourceLabel, id).toBeDefined()
      expect(image?.asOf, id).toBe('2026-09-30')
      expect(validateMenuImage(image), id).toEqual([])
    }
  })

  it('keeps the two removed Salad Factory legacy-domain references gone (Slice 38 re-sourced them from the official storefront)', () => {
    for (const item of restaurantMenuItems.filter(candidate => candidate.restaurantId === 'salad-factory-thailand')) {
      expect(item.menuImage?.src ?? '', item.id).not.toMatch(/saladfactorythailand\.com/)
      expect(item.menuImage?.sourceUrl ?? '', item.id).not.toMatch(/saladfactorythailand\.com/)
    }
    expect(find('salad-factory-grilled-chicken-sesame').menuImage?.src).toMatch(/^https:\/\/img\.imageboss\.me\/foodie24x7\//)
    expect(find('salad-factory-kale-chicken-truffle').menuImage?.src).toMatch(/^https:\/\/img\.imageboss\.me\/foodie24x7\//)
  })

  it('leaves the questionable Nittaya whole-chicken image unchanged', () => {
    const image = find('nittaya-grilled-chicken-quarter').menuImage
    expect(image?.src).toBe('https://www.nittayakaiyang.com/wp-content/uploads/2023/04/%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%95%E0%B8%B1%E0%B8%A7-07-768x769.png')
    expect(image?.asOf).toBe('2026-09-16')
  })

  it('reaches the expected raw coverage; after Slice 38 the only bundled menu images are official-sheet crops', () => {
    expect(restaurants).toHaveLength(17) // 13 + 2 (Slice 40B) + 2 (Slice 41B)
    expect(restaurantMenuItems).toHaveLength(97) // 84 + 10 (Slice 40B) + 3 (Slice 41B)
    expect(restaurantMenuItems.filter(item => item.price)).toHaveLength(44)
    // Slice 38 raised this from 22 to 42; Slice 39A to 45; Slice 40B to 50 (five getfresh official-remote images); its only bundled images are local crops of official menu sheets.
    const images = restaurantMenuItems.filter(item => item.menuImage)
    expect(images).toHaveLength(50)
    expect(images.filter(item => item.menuImage?.kind === 'official-remote')).toHaveLength(39)
    expect(images.filter(item => item.menuImage?.kind === 'bundled').every(item => item.menuImage?.cropOf && item.menuImage.src.startsWith('/menu/'))).toBe(true)
  })
})
