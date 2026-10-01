import { useEffect, useState } from 'react'
import { Utensils } from 'lucide-react'
import type { EverydayMeal } from './everyday-meals'
import type { Locale } from './types'

export function EverydayMealImage({ meal, locale, variant }: { meal: EverydayMeal; locale: Locale; variant: 'card' | 'detail' }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [meal.image])
  const className = `everyday-meal-fallback${variant === 'detail' ? ' everyday-meal-detail-fallback' : ''}`
  return <div className={className} aria-hidden={variant === 'card' || !meal.image || failed ? true : undefined}>
    {meal.image && !failed
      ? <img src={meal.image} alt="" width={800} height={800} loading={variant === 'card' ? 'lazy' : undefined} decoding="async" onError={() => setFailed(true)} />
      : <Utensils size={variant === 'card' ? 32 : 56} strokeWidth={1.5} />}
  </div>
}
