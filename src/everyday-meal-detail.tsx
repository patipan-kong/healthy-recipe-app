import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Utensils } from 'lucide-react'
import { calculateEverydayMealNutrition, mealAddOns } from './everyday-meals'
import { tagLabels } from './everyday-meals-browse'
import type { EverydayMeal, NutritionRange } from './everyday-meals'
import type { Locale } from './types'
import './everyday-meal-detail.css'

const rangeText = ({ min, max }: NutritionRange) => min === max ? `${min}` : `${min}–${max}`
const effectLabels = {
  'lower-energy': { th: 'ตัวเลือกนี้ช่วยลดพลังงาน แต่ยังระบุปริมาณที่ลดไม่ได้', en: 'This choice lowers energy, but the reduction has not been quantified.' },
  'higher-protein': { th: 'โปรตีนเพิ่มขึ้น', en: 'More protein' },
  'more-vegetables': { th: 'ผักเพิ่มขึ้น', en: 'More vegetables' },
}

export function EverydayMealDetail({ meal, locale, onBack }: { meal: EverydayMeal; locale: Locale; onBack: () => void }) {
  const [options, setOptions] = useState<Record<string, string>>(() => Object.fromEntries((meal.optionGroups ?? []).map(group => [group.id, group.choices[0].id])))
  const [addOnIds, setAddOnIds] = useState<string[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0 })
  }, [])
  const selectedChoices = (meal.optionGroups ?? []).map(group => group.choices.find(choice => choice.id === options[group.id])!)
  const tags = [...new Set([...meal.tags, ...selectedChoices.flatMap(choice => choice.tags ?? [])])]
  const nutrition = calculateEverydayMealNutrition(meal, options, addOnIds)
  const addOns = mealAddOns.filter(addOn => meal.addOnIds?.includes(addOn.id))
  const nonNumericGroups = (meal.optionGroups ?? []).filter(group => group.choices.every(choice => !choice.nutrition?.kcal && choice.nutrition?.kcalAdjustment === undefined))
  const hasSemanticEffects = nonNumericGroups.some(group => group.choices.some(choice => choice.nutritionEffect))
  return <main className="detail everyday-meal-detail" data-everyday-meal-detail={meal.id}>
    <header className="detail-nav"><button type="button" className="round-button" onClick={onBack} aria-label={locale === 'th' ? 'กลับไป Everyday Meals' : 'Back to Everyday Meals'}><ArrowLeft aria-hidden="true" /></button></header>
    <div className="everyday-meal-fallback everyday-meal-detail-fallback" aria-hidden="true"><Utensils size={56} strokeWidth={1.5} /></div>
    <section className="detail-content">
      <h1 ref={titleRef} tabIndex={-1}>{meal.nameTh}</h1>
      <p className="detail-english">{meal.nameEn}</p>
      <section className="nutrition-card everyday-meal-nutrition" aria-label={locale === 'th' ? 'โภชนาการโดยประมาณ' : 'Estimated nutrition'} aria-live="polite" aria-atomic="true">
        <div><span>{locale === 'th' ? 'พลังงาน' : 'Energy'}</span><b data-nutrition="kcal">{rangeText(nutrition.kcal)} kcal</b></div>
        {nutrition.proteinG && <div><span>{locale === 'th' ? 'โปรตีน' : 'Protein'}</span><b data-nutrition="protein">{rangeText(nutrition.proteinG)} g</b></div>}
      </section>
      {hasSemanticEffects && <p className="estimate-note everyday-meal-option-estimate">{locale === 'th'
        ? `ค่าพลังงานเป็นช่วงประมาณของเมนูโดยรวม ยังไม่ปรับตามตัวเลือก${nonNumericGroups.map(group => group.labelTh).join('และ')}`
        : 'Energy is an estimated range for the overall meal. Choices without numeric estimates are not included in the calculation.'}</p>}
      {!nutrition.proteinG && addOnIds.length > 0 && <p className="estimate-note">{locale === 'th' ? 'ยังไม่มีค่าประมาณโปรตีนรวมสำหรับมื้อที่เพิ่มไข่' : 'A combined protein estimate is not available for this meal with added eggs.'}</p>}
      {tags.length > 0 && <div className="everyday-meal-tags everyday-meal-detail-tags" aria-label={locale === 'th' ? 'ลักษณะมื้อที่เลือก' : 'Selected meal tags'}>{tags.map(tag => <span key={tag}>{tagLabels[tag][locale]}</span>)}</div>}
      {(meal.optionGroups ?? []).map(group => {
        const choice = group.choices.find(item => item.id === options[group.id])!
        return <fieldset key={group.id} className="detail-section everyday-meal-options">
          <legend>{group.labelTh}</legend>
          <div className="chips">{group.choices.map(item => <label key={item.id} className={options[group.id] === item.id ? 'active' : ''}>
            <input type="radio" name={`${meal.id}-${group.id}`} checked={options[group.id] === item.id} onChange={() => setOptions(current => ({ ...current, [group.id]: item.id }))} />{item.labelTh}
          </label>)}</div>
          {choice.nutritionEffect && <p className="everyday-meal-effect">{effectLabels[choice.nutritionEffect][locale]}</p>}
        </fieldset>
      })}
      {addOns.length > 0 && <fieldset className="detail-section everyday-meal-options everyday-meal-addons">
        <legend>{locale === 'th' ? 'เพิ่มในมื้อนี้' : 'Add to this meal'}</legend>
        {addOns.map(addOn => <label key={addOn.id} className={addOnIds.includes(addOn.id) ? 'active' : ''}>
          <input type="checkbox" checked={addOnIds.includes(addOn.id)} onChange={() => setAddOnIds(current => current.includes(addOn.id) ? current.filter(id => id !== addOn.id) : [...current, addOn.id])} />
          <span>{locale === 'th' ? addOn.nameTh : addOn.nameEn}<small>~{rangeText(addOn.nutrition.kcal)} kcal</small></span>
        </label>)}
      </fieldset>}
      {Boolean(meal.orderingTips?.length) && <section className="detail-section everyday-meal-tips"><h2>{locale === 'th' ? 'สั่งแบบไหนดี' : 'Ordering tips'}</h2><ul>{meal.orderingTips!.map((tip, index) => <li key={index}>{tip.textTh}</li>)}</ul></section>}
      {Boolean(meal.nutritionNotes?.length) && <section className="detail-section everyday-meal-notes"><h2>{locale === 'th' ? 'เกี่ยวกับโภชนาการ' : 'Nutrition notes'}</h2><ul>{meal.nutritionNotes!.map((note, index) => <li key={index}>{note}</li>)}</ul></section>}
      <p className="estimate-note everyday-meal-serving">{nutrition.servingAssumption}</p>
      <p className="estimate-note">{locale === 'th' ? 'ค่าพลังงานและสารอาหารเป็นค่าประมาณ อาจแตกต่างตามปริมาณ วัตถุดิบ และวิธีปรุงของแต่ละร้าน' : 'Energy and nutrient values are estimates and vary with portions, ingredients, and preparation at each restaurant.'}</p>
    </section>
  </main>
}
