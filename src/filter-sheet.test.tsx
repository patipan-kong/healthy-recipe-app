// @vitest-environment jsdom
import { act, useRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { FilterSheet } from './App'
import { emptyFilters } from './recipes'
import type { Filters } from './types'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function FilterDialogHarness() {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [open, setOpen] = useState(true)
  const triggerRef = useRef<HTMLButtonElement>(null)
  function close() {
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }
  return <>
    <button ref={triggerRef} onClick={() => setOpen(true)}>Open filters</button>
    {open && <FilterSheet
      filters={filters}
      updateNumber={(field, value) => setFilters(current => ({ ...current, [field]: value === '' ? undefined : Number(value) }))}
      toggleTag={() => {}}
      onCategory={() => {}}
      onClear={() => setFilters(emptyFilters)}
      onClose={close}
    />}
  </>
}

describe('filter dialog focus', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<FilterDialogHarness />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function input(label: string) {
    const field = [...container.querySelectorAll('label')].find(element => element.textContent?.includes(label))?.querySelector('input')
    if (!field) throw new Error(`Missing ${label} input`)
    return field
  }

  function enterDigit(field: HTMLInputElement, digit: string) {
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
      setter?.call(field, `${field.value}${digit}`)
      field.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  it('keeps real numeric inputs focused through multi-digit filter updates', () => {
    const close = container.querySelector<HTMLButtonElement>('[aria-label="Close filters"]')!
    expect(document.activeElement).toBe(close)

    const maxKcal = input('Max kcal')
    maxKcal.focus()
    for (const expected of ['4', '43', '430']) {
      enterDigit(maxKcal, expected.at(-1)!)
      expect(maxKcal.value).toBe(expected)
      expect(document.activeElement).toBe(maxKcal)
    }

    const minProtein = input('Min protein')
    minProtein.focus()
    for (const expected of ['3', '30']) {
      enterDigit(minProtein, expected.at(-1)!)
      expect(minProtein.value).toBe(expected)
      expect(document.activeElement).toBe(minProtein)
    }
  })
})
