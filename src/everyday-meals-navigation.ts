/** Shared addressing for Home entry and Browse-to-Detail navigation. */
export function addressEverydayMeals(mealId?: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('everyday-meals', '')
  if (mealId) url.searchParams.set('everyday-meal', mealId)
  else url.searchParams.delete('everyday-meal')
  const previous = window.history.state
  // Track only entries created here; direct URLs keep their local fallback.
  const origin = new URL(window.location.href).searchParams.has('everyday-meals')
    ? previous?.everydayMealsOrigin : undefined
  const state = {
    everydayMealsOrigin: origin ?? crypto.randomUUID(),
    everydayMealsDepth: origin ? previous.everydayMealsDepth + 1 : 1,
    everydayMealsEntry: crypto.randomUUID(),
  }
  window.history.pushState(state, '', url)
  return state
}

export function leaveEverydayMeals() {
  const url = new URL(window.location.href)
  url.searchParams.delete('everyday-meals')
  url.searchParams.delete('everyday-meal')
  window.history.replaceState({}, '', url)
}
