// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RecipeImage } from './App'
import { recipes } from './recipes'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('recipe image fallback', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<RecipeImage recipe={recipes[0]} variant="card" />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('replaces a broken local image with an intentional accessible fallback', () => {
    const image = container.querySelector<HTMLImageElement>('img')
    expect(image?.getAttribute('src')).toBe('/recipes/tom-yum-prawns.webp')
    expect(image?.getAttribute('alt')).toBe('Clear Tom Yum Prawns recipe image')
    expect(image?.getAttribute('loading')).toBe('lazy')

    act(() => image?.dispatchEvent(new Event('error')))

    expect(container.querySelector('img')).toBeNull()
    const fallback = container.querySelector<HTMLElement>('[role="img"]')
    expect(fallback?.getAttribute('aria-label')).toBe('Clear Tom Yum Prawns recipe image unavailable')
    expect(fallback?.className).toContain('is-fallback')
  })
})
