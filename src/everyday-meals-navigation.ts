/** Shared addressing for Home entry and Browse-to-Detail navigation. */
export function addressEverydayMeals(mealId?: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('everyday-meals', '')
  if (mealId) url.searchParams.set('everyday-meal', mealId)
  else url.searchParams.delete('everyday-meal')
  window.history.pushState({}, '', url)
}

export function leaveEverydayMeals() {
  const url = new URL(window.location.href)
  url.searchParams.delete('everyday-meals')
  url.searchParams.delete('everyday-meal')
  window.history.replaceState({}, '', url)
}
