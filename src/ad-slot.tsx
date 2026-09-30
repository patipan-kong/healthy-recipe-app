import { Children, Fragment, useEffect, useState, type ReactNode } from 'react'

export type AdPlacement = 'recipe-feed' | 'menu-feed' | 'recipe-detail' | 'restaurant-feed' | 'recipe-pick' | 'restaurant-pick'

// Explicit opt-in in either development or a deliberately enabled preview build.
// Future platform-specific rendering belongs here, never in decision/catalog logic.
export function adPrototypeEnabled() {
  return import.meta.env.VITE_SHOW_AD_PROTOTYPE === 'true'
}

export function AdSlot({ placement }: { placement: AdPlacement }) {
  if (!adPrototypeEnabled()) return null
  return <aside className="ad-slot" aria-label="Sponsored · โฆษณา" data-ad-placement={placement}>
    <strong>Sponsored · โฆษณา</strong>
    <p>Advertisement placement prototype · พื้นที่โฆษณาตัวอย่าง</p>
  </aside>
}

export function recipeAdCadence(columns: 1 | 2 | 3) {
  return { 1: 8, 2: 10, 3: 12 }[columns]
}

export function recipeFeedAdAfter(cardCount: number, total: number, columns: 1 | 2 | 3) {
  return cardCount > 0 && cardCount < total && cardCount % recipeAdCadence(columns) === 0
}

// Mirrors the existing CSS: one column below 560px, three at/above it.
function useRecipeColumns(): 1 | 3 {
  const [columns, setColumns] = useState<1 | 3>(() =>
    typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 560px)').matches ? 3 : 1)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(min-width: 560px)')
    const update = () => setColumns(query.matches ? 3 : 1)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return columns
}

// Slots are presentation siblings; catalog arrays and candidate pools stay intact.
export function AdFeed({ children, placement, enabled = true }: { children: ReactNode; placement: AdPlacement; enabled?: boolean }) {
  const cards = Children.toArray(children)
  const columns = useRecipeColumns()
  return <>{cards.map((card, index) => <Fragment key={index}>{card}{enabled && ((placement === 'recipe-feed' || placement === 'menu-feed') ? recipeFeedAdAfter(index + 1, cards.length, columns) : cards.length > 10 && index === 9) && <AdSlot placement={placement} />}</Fragment>)}</>
}
