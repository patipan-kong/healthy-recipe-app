import { useEffect, useRef, useState } from 'react'
import { EverydayMealsBrowse } from './everyday-meals-browse'
import { EverydayMealDetail } from './everyday-meal-detail'
import { getEverydayMealById } from './everyday-meals'
import { addressEverydayMeals } from './everyday-meals-navigation'
import type { Locale } from './types'

const addressedMeal = () => new URLSearchParams(window.location.search).get('everyday-meal')

export function EverydayMealsView({ locale, onBack, detailReturnsHome = false }: { locale: Locale; onBack: () => void; detailReturnsHome?: boolean }) {
  const [mealId, setMealId] = useState<string | null>(addressedMeal)
  const browseRef = useRef<HTMLDivElement>(null)
  const returnMealId = useRef<string | null>(null)
  const meal = mealId ? getEverydayMealById(mealId) : undefined
  useEffect(() => {
    const onPopState = () => setMealId(addressedMeal())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  useEffect(() => {
    if (!mealId && returnMealId.current) {
      const card = [...(browseRef.current?.querySelectorAll<HTMLButtonElement>('[data-everyday-meal-id]') ?? [])].find(item => item.dataset.everydayMealId === returnMealId.current)
      card?.focus()
      returnMealId.current = null
    }
  }, [mealId])
  function open(id: string) {
    addressEverydayMeals(id)
    returnMealId.current = id
    setMealId(id)
  }
  function close() {
    if (detailReturnsHome) { onBack(); return }
    const url = new URL(window.location.href)
    url.searchParams.delete('everyday-meal')
    window.history.replaceState({}, '', url)
    setMealId(null)
  }
  return <>
    <div ref={browseRef} hidden={Boolean(mealId)}><EverydayMealsBrowse locale={locale} onBack={onBack} onOpen={open} adsEnabled={!mealId} /></div>
    {mealId && (meal ? <EverydayMealDetail key={meal.id} meal={meal} locale={locale} onBack={close} />
      : <section className="content empty"><h1>{locale === 'th' ? 'ไม่พบเมนูนี้' : 'Meal not found'}</h1><button type="button" className="text-button restaurant-back" onClick={close}>{locale === 'th' ? 'กลับไป Everyday Meals' : 'Back to Everyday Meals'}</button></section>)}
  </>
}
