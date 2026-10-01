import { useState } from 'react'
import { ArrowLeft, Search, Utensils, X } from 'lucide-react'
import { filterEverydayMeals, hasEverydayMealDiscoveryTag, searchEverydayMeals } from './everyday-meals'
import type { EverydayMeal, EverydayMealCategory, EverydayMealTag } from './everyday-meals'
import type { Locale } from './types'
import './everyday-meals-browse.css'

const chips: { id: string; th: string; en: string; category?: EverydayMealCategory; tag?: EverydayMealTag }[] = [
  { id: 'all', th: 'ทั้งหมด', en: 'All' },
  { id: 'rice', th: 'ข้าว', en: 'Rice', category: 'rice' },
  { id: 'noodle', th: 'เส้น', en: 'Noodles', category: 'noodle' },
  { id: 'light', th: 'เบาๆ', en: 'Light', tag: 'light' },
  { id: 'high-protein', th: 'โปรตีนสูง', en: 'High protein', tag: 'high-protein' },
  { id: 'veggie-rich', th: 'ผักเยอะ', en: 'Veggie rich', tag: 'veggie-rich' },
]
export const tagLabels = {
  light: { th: 'เบาๆ', en: 'Light' },
  'high-protein': { th: 'โปรตีนสูง', en: 'High protein' },
  'veggie-rich': { th: 'ผักเยอะ', en: 'Veggie rich' },
}

function EverydayMealCard({ meal, locale, onOpen }: { meal: EverydayMeal; locale: Locale; onOpen: (id: string) => void }) {
  const preparations = meal.optionGroups?.find(group => group.id === 'preparation')?.choices.filter(choice => choice.nutrition?.kcal)
  const optionLight = !meal.tags.includes('light') && hasEverydayMealDiscoveryTag(meal, 'light')
  return <button type="button" className="menu-grid-card everyday-meal-card" data-everyday-meal-id={meal.id} aria-label={meal.nameTh} onClick={() => onOpen(meal.id)}>
    <div className="everyday-meal-fallback" aria-hidden="true"><Utensils size={32} strokeWidth={1.5} /></div>
    <div className="menu-grid-body">
      <h3>{meal.nameTh}</h3>
      <p className="everyday-meal-kcal">{preparations?.length
        ? <>{preparations.map(choice => <span key={choice.id}>{locale === 'th' ? choice.labelTh : choice.id === 'soup' ? 'Soup' : 'Dry'} {choice.nutrition!.kcal!.min}–{choice.nutrition!.kcal!.max} kcal</span>)}</>
        : <>{meal.nutrition.kcal.min}–{meal.nutrition.kcal.max} kcal</>}</p>
      {(meal.tags.length > 0 || optionLight) && <div className="everyday-meal-tags">
        {meal.tags.map(tag => <span key={tag}>{tagLabels[tag][locale]}</span>)}
        {optionLight && <span>{locale === 'th' ? 'เบาๆ เมื่อน้ำ' : 'Light with soup'}</span>}
      </div>}
    </div>
  </button>
}

export function EverydayMealsBrowse({ locale, onBack, onOpen }: { locale: Locale; onBack: () => void; onOpen: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [selectedChip, setSelectedChip] = useState('all')
  const chip = chips.find(item => item.id === selectedChip)!
  const categoryIds = new Set(filterEverydayMeals({ category: chip.category }).map(meal => meal.id))
  const results = searchEverydayMeals(query).filter(meal => categoryIds.has(meal.id) && (!chip.tag || hasEverydayMealDiscoveryTag(meal, chip.tag)))
  const reset = () => { setQuery(''); setSelectedChip('all') }
  const searchLabel = locale === 'th' ? 'ค้นหาเมนู...' : 'Search meals...'
  return <section className="content everyday-meals-view" aria-labelledby="everyday-meals-title">
    <button type="button" className="text-button restaurant-back" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" />{locale === 'th' ? 'เมนูทั่วไป' : 'Everyday Meals'}</button>
    <header className="everyday-meals-heading"><h1 id="everyday-meals-title">Everyday Meals</h1><p>{locale === 'th' ? 'วันนี้อยากกินอะไร?' : 'What would you like to eat today?'}</p></header>
    <div className="search-row">
      <label className="search"><Search size={18} aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={searchLabel} aria-label={searchLabel} /></label>
      {query && <button type="button" className="explore-search-clear" aria-label={locale === 'th' ? 'ล้างคำค้นหา' : 'Clear search'} onClick={() => setQuery('')}><X size={16} aria-hidden="true" /></button>}
    </div>
    <div className="chips everyday-meals-chips" role="group" aria-label={locale === 'th' ? 'ตัวกรองเมนู' : 'Meal filters'}>
      {chips.map(item => <button key={item.id} type="button" aria-pressed={selectedChip === item.id} className={selectedChip === item.id ? 'active' : ''} onClick={() => setSelectedChip(item.id)}>{item[locale]}</button>)}
    </div>
    <p className="explore-result-count" role="status">{results.length} {locale === 'th' ? 'เมนู' : 'meals'}</p>
    {results.length > 0 ? <div className="menu-grid everyday-meals-grid">{results.map(meal => <EverydayMealCard key={meal.id} meal={meal} locale={locale} onOpen={onOpen} />)}</div>
      : <div className="empty"><h3>{locale === 'th' ? 'ไม่พบเมนูที่ตรงกับการค้นหา' : 'No matching meals'}</h3><p>{locale === 'th' ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง' : 'Try another search or filter.'}</p><button type="button" className="text-button" onClick={reset}>{locale === 'th' ? 'ล้างคำค้นหาและตัวกรอง' : 'Reset search and filter'}</button></div>}
  </section>
}
