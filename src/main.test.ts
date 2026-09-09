import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mountApp = vi.hoisted(() => vi.fn())

vi.mock('./mount', () => ({ mountApp }))

describe('application entry point', () => {
  beforeEach(() => {
    vi.resetModules()
    mountApp.mockClear()
  })

  afterEach(() => vi.unstubAllGlobals())

  it('mounts the application when the real entry module loads', async () => {
    const root = {} as Element
    const getElementById = vi.fn(() => root)
    vi.stubGlobal('document', { getElementById })

    await import('./main')

    expect(getElementById).toHaveBeenCalledWith('root')
    expect(mountApp).toHaveBeenCalledOnce()
    expect(mountApp).toHaveBeenCalledWith(root)
  })
})
