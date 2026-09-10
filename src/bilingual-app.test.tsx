// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { localeStorageKey } from './i18n'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('bilingual application state', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    window.localStorage.clear()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<App />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function languageButton(locale: 'TH' | 'EN') {
    const button = [...container.querySelectorAll('button')].find(candidate => candidate.textContent === locale)
    if (!button) throw new Error(`Missing ${locale} language button`)
    return button
  }

  it('defaults to Thai, switches immediately, persists through remount, and switches back without changing favorites', () => {
    expect(container.querySelector('.card-body h3')?.textContent).toBe('ต้มยำกุ้งน้ำใส')
    expect(container.querySelector('input')?.getAttribute('placeholder')).toBe('ค้นหาเมนูหรือวัตถุดิบ')

    act(() => container.querySelector<HTMLButtonElement>('.heart')?.click())
    expect(container.querySelector('.icon-button i')?.textContent).toBe('1')
    act(() => languageButton('EN').click())
    expect(container.querySelector('.card-body h3')?.textContent).toBe('Clear Tom Yum Prawns')
    expect(container.querySelector('input')?.getAttribute('placeholder')).toBe('Search recipes or ingredients')
    expect(window.localStorage.getItem(localeStorageKey)).toBe('en')
    expect(container.querySelector('.icon-button i')?.textContent).toBe('1')

    act(() => root.unmount())
    root = createRoot(container)
    act(() => root.render(<App />))
    expect(container.querySelector('.card-body h3')?.textContent).toBe('Clear Tom Yum Prawns')
    act(() => languageButton('TH').click())
    expect(container.querySelector('.card-body h3')?.textContent).toBe('ต้มยำกุ้งน้ำใส')
    expect(window.localStorage.getItem(localeStorageKey)).toBe('th')
    expect(container.querySelector('.icon-button i')?.textContent).toBe('1')
  })
})
