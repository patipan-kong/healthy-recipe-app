import { calculateMealNutrition } from './meal-context'
import { messages, nutritionConfidenceLabel } from './i18n'
import type { Locale, RestaurantMenuItem } from './types'

function nutritionNumber(value: number) {
  return String(value)
}

export function MealContextDetails({ item, locale }: { item: RestaurantMenuItem; locale: Locale }) {
  const copy = messages[locale]
  const context = item.mealContext
  const total = context?.kind === 'add-on' && context.additionNutrition
    ? calculateMealNutrition(item.nutrition, context.additionNutrition)
    : undefined

  if (!context && !item.price) return null

  return <div className="meal-context-details">
    {context?.kind === 'add-on' && <section className="meal-context-section meal-context-addition" aria-label={copy.commonMeal}>
      <p className="meal-context-heading">{copy.commonMeal}</p>
      <p className="meal-context-name">{context.label[locale]}</p>
      {context.note && <p className="meal-context-note">{context.note[locale]}</p>}
      {context.additionNutrition && <div className="meal-context-nutrition">
        <span><b>+{nutritionNumber(context.additionNutrition.kcal)}</b> {copy.kcalEstimate}</span>
        <span><b>+{nutritionNumber(context.additionNutrition.protein)}g</b> {copy.protein}</span>
        <span><b>+{nutritionNumber(context.additionNutrition.carbs)}g</b> {copy.carbs}</span>
        <span><b>+{nutritionNumber(context.additionNutrition.fat)}g</b> {copy.fat}</span>
        {context.additionNutrition.sodium !== undefined && <span><b>+{nutritionNumber(context.additionNutrition.sodium)}mg</b> {copy.sodium}</span>}
        {context.additionNutritionSource && <span className={`confidence-badge confidence-${context.additionNutritionSource.confidence}`}>{nutritionConfidenceLabel(locale, context.additionNutritionSource.confidence)}</span>}
      </div>}
      {context.additionNutritionSource?.asOf && <p className="meal-context-note">{copy.nutritionChecked(context.additionNutritionSource.asOf)}</p>}
      {total && <div className="meal-context-total">
        <p className="meal-context-heading">{copy.estimatedMealTotal}</p>
        <div className="meal-context-total-values">
          <span><b>~{nutritionNumber(total.kcal)}</b> {copy.kcalEstimate}</span>
          <span><b>~{nutritionNumber(total.protein)}g</b> {copy.protein}</span>
          <span><b>~{nutritionNumber(total.carbs)}g</b> {copy.carbs}</span>
          <span><b>~{nutritionNumber(total.fat)}g</b> {copy.fat}</span>
          {total.sodium !== undefined && <span><b>~{nutritionNumber(total.sodium)}mg</b> {copy.sodium}</span>}
        </div>
      </div>}
    </section>}
    {context?.kind === 'configurable' && <section className="meal-context-section meal-context-configurable" aria-label={copy.configurableMeal}>
      <p className="meal-context-heading">{copy.configurableMeal}</p>
      <p className="meal-context-name">{context.label[locale]}</p>
      {context.note && <p className="meal-context-note">{context.note[locale]}</p>}
    </section>}
    {context?.kind === 'already-complete' && <section className="meal-context-section meal-context-complete" aria-label={copy.completeMeal}>
      <p className="meal-context-heading">{copy.completeMeal}</p>
      <p className="meal-context-name">{context.label[locale]}</p>
      <p className="meal-context-note">{context.note?.[locale] ?? copy.mealIncludesSet}</p>
    </section>}
    {item.price && <section className="meal-context-section meal-context-price" aria-label={copy.price}>
      <div className="meal-context-price-line"><span className="meal-context-heading">{copy.price}</span><strong>฿{nutritionNumber(item.price.amount)}</strong></div>
      <p className="meal-context-note">{copy.priceChecked(item.price.asOf)}</p>
      {item.price.note && <p className="meal-context-note">{item.price.note[locale]}</p>}
    </section>}
  </div>
}
