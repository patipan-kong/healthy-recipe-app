import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createRoot, render } = vi.hoisted(() => {
  const render = vi.fn()
  return { createRoot: vi.fn(() => ({ render })), render }
})

vi.mock('react-dom/client', () => ({ createRoot }))
vi.mock('./App', () => ({ default: () => null }))

import { mountApp } from './mount'

describe('application mounting', () => {
  beforeEach(() => { createRoot.mockClear(); render.mockClear() })

  it('mounts the application into the supplied root element', () => {
    const root = {} as Element
    mountApp(root)
    expect(createRoot).toHaveBeenCalledWith(root)
    expect(render).toHaveBeenCalledOnce()
  })
})
