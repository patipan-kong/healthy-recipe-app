// @vitest-environment jsdom
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { everydayMeals } from './everyday-meals'
import { EverydayMealsBrowse } from './everyday-meals-browse'
import { EverydayMealDetail } from './everyday-meal-detail'
import { EverydayMealImage } from './everyday-meal-image'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
const pilotIds = ['pork-suki', 'fish-rice-soup', 'pork-boat-noodles', 'minced-pork-basil-rice', 'hainanese-chicken-rice', 'papaya-salad-grilled-chicken-sticky-rice']
const assetDirectory = resolve(__dirname, '..', 'public', 'everyday-meals')

describe('Slice 42E production images', () => {
  it('preserves the provisionally approved source assets byte-for-byte', () => {
    const hashes: Record<string, string> = {
      'fish-rice-soup': '39fca8ac2a3a96d6f4811907b74acc88d93babf5f0b6ce34c181c927b21e897e',
      'hainanese-chicken-rice': '65b40b711bbf9b1990d7b043b718e5ae95ed1c77545fdf304a5cadfc8ce879e3',
      'minced-pork-basil-rice': 'e16839e0a56d748ceee0f72ba1983945dcdc4b81078eb094a6bcce147699a504',
      'papaya-salad-grilled-chicken-sticky-rice': '373f7b001b6b4b99f21ffb609d775c5f23c4c39eb30a6199c99cc57d14d8f594',
      'pork-boat-noodles': 'a0169e05f701a996172c1f592fb352a9629550764eee6203d24089cf834966db',
      'pork-suki': 'a3d4528340315ea2f8b7cc1d7e9ab95f1bf3e09b79e85f62f0bb31f2ac79e776',
    }
    for (const id of pilotIds) {
      expect(createHash('sha256').update(readFileSync(resolve(assetDirectory, `${id}.webp`))).digest('hex')).toBe(hashes[id])
    }
  })

  it('assigns exactly 50 unique local WebPs with valid production dimensions', () => {
    const pilots = everydayMeals.filter(meal => meal.image)
    expect(everydayMeals).toHaveLength(50)
    expect(pilots).toHaveLength(50)
    expect(new Set(pilots.map(meal => meal.image)).size).toBe(50)
    expect(readdirSync(assetDirectory).sort()).toEqual(everydayMeals.map(meal => `${meal.id}.webp`).sort())
    for (const meal of pilots) {
      expect(meal.image).toBe(`/everyday-meals/${meal.id}.webp`)
      const bytes = readFileSync(resolve(assetDirectory, `${meal.id}.webp`))
      expect(bytes.subarray(0, 4).toString()).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString()).toBe('WEBP')
      expect(bytes.subarray(12, 16).toString()).toBe('VP8 ')
      expect(bytes.readUInt16LE(26) & 0x3fff).toBe(800)
      expect(bytes.readUInt16LE(28) & 0x3fff).toBe(800)
      expect(bytes.length).toBeGreaterThan(10_000)
      expect(bytes.length).toBeLessThan(500_000)
    }
  })

  it('preserves the entire locked catalog apart from image associations', () => {
    const content = everydayMeals.map(({ image: _image, ...meal }) => meal)
    expect(createHash('sha256').update(JSON.stringify(content)).digest('hex')).toBe('1aad81ae9d0476e3365d1130b5822dea36a62287fe7d41fd9b1d0c96fe191cc5')
  })

  it('renders 50 decorative Browse images and replaces a failed image', () => {
    const container = document.createElement('div')
    const root = createRoot(container)
    try {
      act(() => root.render(<EverydayMealsBrowse locale="th" onBack={() => {}} onOpen={() => {}} />))
      expect(container.querySelectorAll('[data-everyday-meal-id]')).toHaveLength(50)
      expect(container.querySelectorAll('img')).toHaveLength(50)
      expect(container.querySelectorAll('.everyday-meal-fallback svg')).toHaveLength(0)
      for (const image of container.querySelectorAll('img')) {
        expect(image.alt).toBe('')
        expect(image.getAttribute('loading')).toBe('lazy')
        expect(image.width).toBe(800)
      }
      act(() => container.querySelector('img')!.dispatchEvent(new Event('error')))
      expect(container.querySelectorAll('img')).toHaveLength(49)
      expect(container.querySelectorAll('.everyday-meal-fallback svg')).toHaveLength(1)
    } finally { act(() => root.unmount()) }
  })

  it.each(everydayMeals.map(meal => meal.id))('renders the appropriate Detail visual for %s', id => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const container = document.createElement('div')
    const root = createRoot(container)
    const meal = everydayMeals.find(item => item.id === id)!
    try {
      act(() => root.render(<EverydayMealDetail meal={meal} locale="th" onBack={() => {}} />))
      const image = container.querySelector('img')
      if (meal.image) {
        expect(image?.getAttribute('src')).toBe(meal.image)
        expect(image?.alt).toBe('')
        expect(image?.hasAttribute('loading')).toBe(false)
        act(() => image!.dispatchEvent(new Event('error')))
      } else expect(image).toBeNull()
      expect(container.querySelector('.everyday-meal-detail-fallback svg')).not.toBeNull()
      expect(container.querySelector('.everyday-meal-detail-fallback')?.getAttribute('aria-hidden')).toBe('true')
    } finally { act(() => root.unmount()); vi.restoreAllMocks() }
  })

  it.each(['card', 'detail'] as const)('retains defensive missing-image fallback for %s', variant => {
    const container = document.createElement('div')
    const root = createRoot(container)
    const { image: _image, ...meal } = everydayMeals[0]
    try {
      act(() => root.render(<EverydayMealImage meal={meal} locale="th" variant={variant} />))
      expect(container.querySelector('img')).toBeNull()
      expect(container.querySelector('.everyday-meal-fallback svg')).not.toBeNull()
      expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
    } finally { act(() => root.unmount()) }
  })
})
