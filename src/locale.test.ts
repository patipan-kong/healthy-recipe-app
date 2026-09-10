import { describe, expect, it } from 'vitest'
import { loadLocale, localeStorageKey, saveLocale } from './i18n'

describe('language persistence', () => {
  it('defaults safely to Thai and rejects unknown stored values', () => {
    let raw: string | null = null
    const store = { getItem: () => raw, setItem: (_key: string, value: string) => { raw = value } }
    expect(loadLocale(store)).toBe('th')
    raw = 'fr'
    expect(loadLocale(store)).toBe('th')
    expect(loadLocale(undefined)).toBe('th')
  })

  it('saves and restores both supported locales under the namespaced key', () => {
    let savedKey = ''
    let savedValue = ''
    const store = { getItem: (key: string) => key === localeStorageKey ? savedValue : null, setItem: (key: string, value: string) => { savedKey = key; savedValue = value } }
    expect(saveLocale('en', store)).toBe(true)
    expect(savedKey).toBe(localeStorageKey)
    expect(loadLocale(store)).toBe('en')
    expect(saveLocale('th', store)).toBe(true)
    expect(loadLocale(store)).toBe('th')
  })
})
