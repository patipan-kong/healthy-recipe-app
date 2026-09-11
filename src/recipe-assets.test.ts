import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { recipeImageManifest, recipeImageManifestIds } from './recipe-image-manifest'
import { recipes } from './recipes'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const assetDirectory = join(projectRoot, 'public', 'recipes')

describe('recipe image asset pipeline', () => {
  it('keeps a complete one-to-one manifest for all 100 recipes', () => {
    expect(recipes).toHaveLength(100)
    expect(recipeImageManifest).toHaveLength(100)
    expect(new Set(recipeImageManifestIds).size).toBe(100)
    expect(new Set(recipes.map(recipe => recipe.image)).size).toBe(100)
    expect(recipeImageManifest.map(entry => entry.id)).toEqual(recipes.map(recipe => recipe.id))
    expect(recipeImageManifest.every(entry => entry.prompt.includes(entry.nameEn) && entry.visualBrief.length > 40 && !entry.visualBrief.includes('plated as a single-serving healthy meal'))).toBe(true)
  })

  it('maps every expected local path to exactly one production WebP asset', () => {
    const expected = new Set(recipes.map(recipe => recipe.image.slice('/recipes/'.length)))
    const files = readdirSync(assetDirectory).filter(file => file.endsWith('.webp'))
    expect(files).toHaveLength(100)
    expect(new Set(files).size).toBe(100)
    expect(new Set(files)).toEqual(expected)
    for (const recipe of recipes) {
      expect(recipe.image).toMatch(/^\/recipes\/[a-z0-9]+(?:-[a-z0-9]+)*\.webp$/)
      const filePath = join(projectRoot, 'public', recipe.image.slice(1))
      expect(statSync(filePath).isFile()).toBe(true)
      const bytes = readFileSync(filePath)
      expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP')
      expect(bytes.length).toBeGreaterThan(10_000)
      expect(bytes.length).toBeLessThan(500_000)
    }
  })
})
