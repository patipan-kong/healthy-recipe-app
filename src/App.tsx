import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ChevronRight, Clock3, Heart, Search, Shuffle, SlidersHorizontal, X } from 'lucide-react'
import { categoryLabel, ingredientCategoryLabel, loadLocale, messages, saveLocale, tagLabel } from './i18n'
import { formatIngredientAmount } from './measurements'
import { chooseRandom, emptyFilters, filterRecipes, recipes, searchRecipes } from './recipes'
import { loadFavorites, saveFavorites, toggleFavorite } from './favorites'
import { canonicalIngredients, categoryIngredients, countRecipesByIngredient, filterRecipesByIngredient, ingredientCategoryOrder, loadPantrySelection, rankRecipesByPantry, savePantrySelection, togglePantryIngredient, type PantryMatch } from './pantry'
import type { Filters, Locale, Recipe } from './types'

const categories = ['Quick meals', 'Thai favorites', 'High protein', 'Plant-forward', 'Light bowls']
const tags = ['High protein', 'Quick', 'Light', 'Vegetarian', 'Vegan', 'No-cook', 'Fiber-rich', 'Meal prep']
const recipeIds = new Set(recipes.map(recipe => recipe.id))
type AppScreen = 'browse' | 'favorites' | 'pantry' | 'detail'
type PantryMode = 'selection' | 'results'
type PantryResultSource =
  | { kind: 'selection' }
  | { kind: 'direct'; ingredientId: string }

export function normalizeFavorites(ids: string[]) {
  return [...new Set(ids)].filter(id => recipeIds.has(id))
}

function otherLocale(locale: Locale): Locale {
  return locale === 'th' ? 'en' : 'th'
}

function App() {
  const [screen, setScreen] = useState<AppScreen>('browse')
  const [returnScreen, setReturnScreen] = useState<Exclude<AppScreen, 'detail'>>('browse')
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => normalizeFavorites(loadFavorites()))
  const [lastRandom, setLastRandom] = useState<string>()
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [pantryStorageAvailable, setPantryStorageAvailable] = useState(true)
  const [locale, setLocale] = useState<Locale>(() => loadLocale())
  const [pantrySelection, setPantrySelection] = useState<string[]>(() => loadPantrySelection())
  const [pantryResultSource, setPantryResultSource] = useState<PantryResultSource>({ kind: 'selection' })
  const [pantryMode, setPantryMode] = useState<PantryMode>('selection')
  const [pantryQuery, setPantryQuery] = useState('')
  const filterTriggerRef = useRef<HTMLButtonElement>(null)
  const copy = messages[locale]

  useEffect(() => setStorageAvailable(saveFavorites(favorites)), [favorites])
  useEffect(() => setPantryStorageAvailable(savePantrySelection(pantrySelection)), [pantrySelection])
  useEffect(() => { saveLocale(locale) }, [locale])

  const filtered = useMemo(() => searchRecipes(filterRecipes(recipes, filters), query), [query, filters])
  const visible = screen === 'favorites' ? filtered.filter(recipe => favorites.includes(recipe.id)) : filtered
  const pantryCounts = useMemo(() => countRecipesByIngredient(recipes), [])
  const activeFilterCount = Number(Boolean(filters.category)) + filters.tags.length + Object.entries(filters).filter(([key, value]) => !['category', 'tags'].includes(key) && value !== undefined).length

  function openRecipe(recipe: Recipe) {
    setReturnScreen(screen === 'favorites' ? 'favorites' : screen === 'pantry' ? 'pantry' : 'browse')
    setSelected(recipe)
    setScreen('detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function randomRecipe() {
    const result = chooseRandom(filtered, lastRandom)
    if (result) { setLastRandom(result.id); openRecipe(result) }
  }

  function updateNumber(field: keyof Omit<Filters, 'category' | 'tags'>, value: string) {
    setFilters(current => ({ ...current, [field]: value === '' ? undefined : Number(value) }))
  }

  function toggleTag(tag: string) {
    setFilters(current => ({ ...current, tags: current.tags.includes(tag) ? current.tags.filter(item => item !== tag) : [...current.tags, tag] }))
  }

  function favorite(id: string) { setFavorites(current => toggleFavorite(current, id)) }
  function togglePantry(id: string) { setPantryResultSource({ kind: 'selection' }); setPantryMode('selection'); setPantrySelection(current => togglePantryIngredient(current, id)) }
  function clearPantry() { setPantryResultSource({ kind: 'selection' }); setPantryMode('selection'); setPantrySelection([]) }
  function showPantryResults() { if (pantrySelection.length > 0) { setPantryResultSource({ kind: 'selection' }); setPantryMode('results') } }
  function browsePantryIngredient(id: string) { setPantryResultSource({ kind: 'direct', ingredientId: id }); setPantryMode('results') }
  function editPantryIngredients() { setPantryResultSource({ kind: 'selection' }); setPantryMode('selection') }
  function togglePantryScreen() {
    if (screen === 'pantry') {
      setPantryResultSource({ kind: 'selection' })
      setPantryMode('selection')
      setScreen('browse')
    } else {
      setPantryResultSource({ kind: 'selection' })
      setPantryMode('selection')
      setScreen('pantry')
    }
  }
  function closeFilters() { setFiltersOpen(false); requestAnimationFrame(() => filterTriggerRef.current?.focus()) }

  if (screen === 'detail' && selected) return <RecipeDetail recipe={selected} locale={locale} isFavorite={favorites.includes(selected.id)} onBack={() => setScreen(returnScreen)} onFavorite={() => favorite(selected.id)} />

  return <main className="app-shell">
    <header className="topbar">
      <button className="logo" onClick={() => setScreen('browse')} aria-label="Home"><span className="logo-mark">🍋</span><span>good<b>food</b></span></button>
      <div className="header-actions">
        <div className="language-switcher" role="group" aria-label={copy.language}>
          {(['th', 'en'] as Locale[]).map(option => <button key={option} className={locale === option ? 'active' : ''} onClick={() => setLocale(option)} aria-pressed={locale === option}>{option.toUpperCase()}</button>)}
        </div>
        <button className={`pantry-nav ${screen === 'pantry' ? 'active' : ''}`} onClick={togglePantryScreen} aria-label={copy.pantry} aria-pressed={screen === 'pantry'}><span aria-hidden="true">🥕</span><span>{copy.pantry}</span>{pantrySelection.length > 0 && <i>{pantrySelection.length}</i>}</button>
        <button className="icon-button" onClick={() => setScreen(screen === 'favorites' ? 'browse' : 'favorites')} aria-label={copy.favorites}><Heart size={21} fill={screen === 'favorites' ? 'currentColor' : 'none'} /><i>{favorites.length || ''}</i></button>
      </div>
    </header>
    {screen === 'pantry' ? <PantryView locale={locale} mode={pantryMode} selectedIds={pantrySelection} resultSource={pantryResultSource} query={pantryQuery} counts={pantryCounts} storageAvailable={pantryStorageAvailable} onQuery={setPantryQuery} onToggle={togglePantry} onBrowseIngredient={browsePantryIngredient} onViewResults={showPantryResults} onEditIngredients={editPantryIngredients} onClear={clearPantry} favorites={favorites} onOpen={openRecipe} onFavorite={favorite} /> : <>
      <section className="hero"><p className="eyebrow">{copy.heroEyebrow}</p><h1>{copy.heroTitle}</h1><p>{copy.heroDescription}</p><button className="random-button" disabled={!filtered.length} onClick={randomRecipe}><Shuffle size={19} /> {copy.random}</button></section>
      <section className="content">
        {!storageAvailable && <p className="storage-note" role="status">{copy.storageNote}</p>}
        <div className="search-row"><label className="search"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={copy.searchPlaceholder} /></label><button ref={filterTriggerRef} className="filter-button" onClick={() => setFiltersOpen(true)} aria-label={copy.openFilters}><SlidersHorizontal size={19} />{activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button></div>
        <div className="section-heading"><h2>{screen === 'favorites' ? copy.favorites : copy.browse}</h2>{screen === 'favorites' && <button className="text-button" onClick={() => setScreen('browse')}>{copy.browseAll}</button>}</div>
        {screen === 'browse' && <div className="chips" aria-label={copy.recipeCategories}><button className={!filters.category ? 'active' : ''} onClick={() => setFilters(current => ({ ...current, category: '' }))}>{copy.allRecipes}</button>{categories.map(category => <button key={category} className={filters.category === category ? 'active' : ''} onClick={() => setFilters(current => ({ ...current, category }))}>{categoryLabel(locale, category)}</button>)}</div>}
        {visible.length ? <div className="recipe-grid">{visible.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} locale={locale} favorite={favorites.includes(recipe.id)} onOpen={() => openRecipe(recipe)} onFavorite={() => favorite(recipe.id)} />)}</div> : <EmptyState locale={locale} favorites={screen === 'favorites'} hasSavedRecipes={favorites.length > 0} hasFilters={Boolean(query.trim() || activeFilterCount)} onClear={() => { setQuery(''); setFilters(emptyFilters) }} />}
      </section>
    </>}
    {filtersOpen && <FilterSheet locale={locale} filters={filters} updateNumber={updateNumber} toggleTag={toggleTag} onCategory={category => setFilters(current => ({ ...current, category }))} onClear={() => setFilters(emptyFilters)} onClose={closeFilters} />}
  </main>
}

function recipeEmoji(recipe: Recipe) {
  return recipe.category === 'High protein' ? '🐟' : recipe.category === 'Plant-forward' ? '🥬' : recipe.category === 'Light bowls' ? '🥗' : '🍲'
}

export function RecipeImage({ recipe, variant, locale = 'en' }: { recipe: Recipe; variant: 'card' | 'detail'; locale?: Locale }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [recipe.image])
  const copy = messages[locale]
  const label = copy.recipeImage(recipe.name[locale])
  return <div className={`recipe-image ${variant} ${failed ? 'is-fallback' : ''}`} role={failed ? 'img' : undefined} aria-label={failed ? copy.unavailableImage(recipe.name[locale]) : undefined}>
    {failed ? <span className="food-emoji" aria-hidden="true">{recipeEmoji(recipe)}</span> : <img src={recipe.image} alt={label} loading={variant === 'card' ? 'lazy' : undefined} onError={() => setFailed(true)} />}
  </div>
}

type PantryViewProps = {
  locale: Locale
  mode: PantryMode
  selectedIds: string[]
  resultSource: PantryResultSource
  query: string
  counts: Record<string, number>
  storageAvailable: boolean
  onQuery(query: string): void
  onToggle(id: string): void
  onBrowseIngredient(id: string): void
  onViewResults(): void
  onEditIngredients(): void
  onClear(): void
  favorites: string[]
  onOpen(recipe: Recipe): void
  onFavorite(id: string): void
}

function PantryView({ locale, mode, selectedIds, resultSource, query, counts, storageAvailable, onQuery, onToggle, onBrowseIngredient, onViewResults, onEditIngredients, onClear, favorites, onOpen, onFavorite }: PantryViewProps) {
  const copy = messages[locale]
  const selectionModeRef = useRef<HTMLButtonElement>(null)
  const resultsModeRef = useRef<HTMLButtonElement>(null)
  const directIngredientId = resultSource.kind === 'direct' ? resultSource.ingredientId : undefined
  const focusedIngredient = canonicalIngredients.find(ingredient => ingredient.id === directIngredientId)
  const hasSelection = selectedIds.length > 0
  const isDirectBrowse = resultSource.kind === 'direct'
  const showingResults = mode === 'results' || isDirectBrowse
  const canShowResults = hasSelection || isDirectBrowse
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const visibleForSearch = (ingredient: typeof canonicalIngredients[number]) => counts[ingredient.id] > 0 && (!normalizedQuery || `${ingredient.name.th} ${ingredient.name.en}`.toLocaleLowerCase().includes(normalizedQuery))
  const ranked = useMemo(() => resultSource.kind === 'direct'
    ? filterRecipesByIngredient(recipes, resultSource.ingredientId).map(recipe => ({ recipe, matchedIngredientIds: [resultSource.ingredientId], matchCount: 1, matchPercentage: 1 } satisfies PantryMatch))
    : rankRecipesByPantry(recipes, selectedIds), [resultSource, selectedIds])
  const resultHeading = focusedIngredient ? copy.pantrySingleResults(focusedIngredient.name[locale]) : copy.pantryResults
  const selectedNames = selectedIds.map(id => canonicalIngredients.find(ingredient => ingredient.id === id)?.name[locale]).filter((name): name is string => Boolean(name))

  function focusMode(modeToFocus: PantryMode) {
    requestAnimationFrame(() => (modeToFocus === 'selection' ? selectionModeRef : resultsModeRef).current?.focus())
  }

  function changeMode(nextMode: PantryMode) {
    if (nextMode === 'results' && !canShowResults) return
    if (nextMode === 'selection') {
      onEditIngredients()
    } else if (isDirectBrowse) {
      focusMode(nextMode)
      return
    } else {
      onViewResults()
    }
    focusMode(nextMode)
  }

  function browseIngredient(id: string) {
    onBrowseIngredient(id)
    focusMode('results')
  }

  function editIngredients() {
    onEditIngredients()
    focusMode('selection')
  }

  return <section className="content pantry-view">
    {!storageAvailable && <p className="storage-note" role="status">{copy.storageNote}</p>}
    <div className="section-heading pantry-heading"><div><p className="eyebrow">{copy.pantry}</p><h2 id="pantry-mode-heading">{showingResults ? resultHeading : copy.pantryTitle}</h2></div></div>
    <div className="pantry-mode-tabs" role="group" aria-label={copy.pantryModeLabel}>
      <button ref={selectionModeRef} className={mode === 'selection' && !isDirectBrowse ? 'active' : ''} onClick={() => changeMode('selection')} aria-pressed={mode === 'selection' && !isDirectBrowse}>{copy.pantryIngredientsMode}</button>
      <button ref={resultsModeRef} className={showingResults ? 'active' : ''} onClick={() => changeMode('results')} aria-pressed={showingResults} disabled={!canShowResults}>{copy.pantryRecipesMode}</button>
    </div>
    {showingResults ? <section className="pantry-results" aria-labelledby="pantry-mode-heading">
      <div className="pantry-results-toolbar"><p className="pantry-result-count">{isDirectBrowse ? copy.pantryDirectResultCount(ranked.length) : copy.pantryResultCount(ranked.length)}</p><div className="pantry-result-actions"><button className="text-button" onClick={onClear}>{copy.pantryClear}</button><button className="text-button" onClick={editIngredients}>{copy.pantryEditIngredients}</button></div></div>
      <div className="pantry-result-summary"><p>{isDirectBrowse ? copy.pantryDirectSummary(focusedIngredient?.name[locale] ?? '') : copy.pantrySelectedSummary(selectedIds.length)}</p>{!isDirectBrowse && <p className="pantry-selected-names">{selectedNames.join(' · ')}</p>}</div>
      {ranked.length ? <div className="recipe-grid">{ranked.map(match => <RecipeCard key={match.recipe.id} recipe={match.recipe} locale={locale} favorite={favorites.includes(match.recipe.id)} match={!isDirectBrowse ? { count: match.matchCount, total: selectedIds.length } : undefined} onOpen={() => onOpen(match.recipe)} onFavorite={() => onFavorite(match.recipe.id)} />)}</div> : <div className="empty pantry-empty" role="status"><span aria-hidden="true">🥕</span><h3>{copy.pantryNoMatchesTitle}</h3><p>{copy.pantryNoMatchesText}</p><button className="text-button" onClick={editIngredients}>{copy.pantryEditIngredients}</button></div>}
    </section> : <section className="pantry-selection" aria-labelledby="pantry-mode-heading">
      <label className="search pantry-search"><Search size={18} /><input value={query} onChange={event => onQuery(event.target.value)} placeholder={copy.pantrySearchPlaceholder} /></label>
      <p className="pantry-guidance">{copy.pantryGuidance}</p>
      {hasSelection && <div className="pantry-selection-summary"><span>{copy.pantrySelectedCount(selectedIds.length)}</span></div>}
      <div className="pantry-selection-action"><button className="text-button pantry-clear-action" onClick={onClear} disabled={!hasSelection}>{copy.pantryClear}</button><button className="pantry-view-action" onClick={() => changeMode('results')} disabled={!hasSelection}>{copy.pantryViewMatching(selectedIds.length)}</button></div>
      <div className="pantry-groups">
        {ingredientCategoryOrder.map(category => {
          const ingredients = categoryIngredients(category).filter(visibleForSearch)
          if (!ingredients.length) return null
          return <section className="pantry-category" key={category}><h3>{ingredientCategoryLabel(locale, category)}</h3><div className="pantry-list">{ingredients.map(ingredient => <div className="pantry-row" key={ingredient.id}><input id={`pantry-${ingredient.id}`} type="checkbox" checked={selectedIds.includes(ingredient.id)} onChange={() => onToggle(ingredient.id)} aria-label={`${ingredient.name[locale]} checkbox`} /><button className="pantry-browse-button" onClick={() => browseIngredient(ingredient.id)} aria-label={`${ingredient.name[locale]} (${counts[ingredient.id]})`}><span>{ingredient.name[locale]}</span><b>({counts[ingredient.id]})</b><em aria-hidden="true">›</em></button></div>)}</div></section>
        })}
      </div>
      {!hasSelection && <p className="pantry-zero-state" role="status">{copy.pantryNoSelection}</p>}
    </section>}
  </section>
}

function RecipeCard({ recipe, locale, favorite, onOpen, onFavorite, match }: { recipe: Recipe; locale: Locale; favorite: boolean; onOpen(): void; onFavorite(): void; match?: { count: number; total: number } }) {
  const copy = messages[locale]
  const name = recipe.name[locale]
  const secondaryName = recipe.name[otherLocale(locale)]
  const favoriteLabel = favorite ? copy.removeFavorite(name) : copy.addFavorite(name)
  return <article className="recipe-card"><button className={`food-art ${recipe.accent}`} onClick={onOpen} aria-label={copy.openRecipe(name)}><RecipeImage recipe={recipe} variant="card" locale={locale} /><span className="time-pill"><Clock3 size={13} /> {recipe.prepMinutes + recipe.cookMinutes} min</span></button><div className="card-body"><div><p className="card-category">{categoryLabel(locale, recipe.category)}</p><h3>{name}</h3><p className="english">{secondaryName}</p>{match && <p className="match-indicator">{copy.pantryMatches(match.count, match.total)}</p>}</div><button className={`heart ${favorite ? 'saved' : ''}`} onClick={onFavorite} aria-label={favoriteLabel} aria-pressed={favorite}><Heart size={20} fill={favorite ? 'currentColor' : 'none'} /></button></div><button className="nutrition-line" onClick={onOpen} aria-label={`${copy.openRecipe(name)}, ${copy.kcalEstimate}`}><span><b>{recipe.nutrition.kcal}</b> {copy.kcalEstimate}</span><span><b>{recipe.nutrition.protein}g</b> {copy.protein}</span><ChevronRight size={17} /></button></article>
}

export function FilterSheet({ filters, updateNumber, toggleTag, onCategory, onClear, onClose, locale = 'en' }: { filters: Filters; updateNumber(field: keyof Omit<Filters, 'category' | 'tags'>, value: string): void; toggleTag(tag: string): void; onCategory(category: string): void; onClear(): void; onClose(): void; locale?: Locale }) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const copy = messages[locale]
  const filterLabels: Record<keyof Omit<Filters, 'category' | 'tags'>, string> = { maxKcal: copy.maxKcal, minProtein: copy.minProtein, maxCarbs: copy.maxCarbs, maxFat: copy.maxFat, maxSodium: copy.maxSodium }

  useEffect(() => {
    closeRef.current?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); onCloseRef.current(); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!dialogRef.current.contains(document.activeElement) || (!event.shiftKey && document.activeElement === last)) { event.preventDefault(); first.focus() } else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return <div className="modal-backdrop" role="presentation"><section ref={dialogRef} className="filter-sheet" role="dialog" aria-modal="true" aria-label={copy.filters}><div className="sheet-top"><div className="grab" /><button ref={closeRef} className="close" onClick={onClose} aria-label={copy.closeFilters}><X /></button><h2>{copy.filters}</h2><button className="text-button" onClick={onClear}>{copy.clearAll}</button></div><div className="filter-content"><label className="field-label">{copy.category}<select value={filters.category} onChange={event => onCategory(event.target.value)}><option value="">{copy.anyCategory}</option>{categories.map(category => <option key={category} value={category}>{categoryLabel(locale, category)}</option>)}</select></label><h3>{copy.nutritionPerServing}</h3><div className="number-grid">{Object.entries(filterLabels).map(([field, label]) => <label key={field} className="field-label">{label}<input type="number" min="0" value={filters[field as keyof Omit<Filters, 'category' | 'tags'>] ?? ''} onChange={event => updateNumber(field as keyof Omit<Filters, 'category' | 'tags'>, event.target.value)} /></label>)}</div><h3>{copy.tags}</h3><div className="chips tags">{tags.map(tag => <button key={tag} className={filters.tags.includes(tag) ? 'active' : ''} onClick={() => toggleTag(tag)}>{tagLabel(locale, tag)}</button>)}</div><p className="estimate-note">{copy.filterNote}</p></div><button className="show-results" onClick={onClose}>{copy.showResults}</button></section></div>
}

function RecipeDetail({ recipe, locale, isFavorite, onBack, onFavorite }: { recipe: Recipe; locale: Locale; isFavorite: boolean; onBack(): void; onFavorite(): void }) {
  const copy = messages[locale]
  const name = recipe.name[locale]
  const favoriteLabel = isFavorite ? copy.removeFavorite(name) : copy.addFavorite(name)
  return <main className="detail"><header className="detail-nav"><button className="round-button" onClick={onBack} aria-label={copy.back}><ArrowLeft /></button><button className={`round-button ${isFavorite ? 'saved' : ''}`} onClick={onFavorite} aria-label={favoriteLabel} aria-pressed={isFavorite}><Heart fill={isFavorite ? 'currentColor' : 'none'} /></button></header><div className={`detail-art ${recipe.accent}`}><RecipeImage recipe={recipe} variant="detail" locale={locale} /></div><section className="detail-content"><p className="eyebrow">{recipe.cuisine[locale]} · {categoryLabel(locale, recipe.category)}</p><h1>{name}</h1><p className="detail-english">{recipe.name[otherLocale(locale)]}</p><div className="facts"><span><Clock3 size={17} /> {copy.prep} {recipe.prepMinutes} min</span><span>{copy.cook} {recipe.cookMinutes} min</span><span>{copy.serves} {recipe.servings}</span></div><div className="nutrition-card"><div><b>{recipe.nutrition.kcal}</b><span>kcal</span></div><div><b>{recipe.nutrition.protein}g</b><span>{copy.protein}</span></div><div><b>{recipe.nutrition.carbs}g</b><span>{copy.carbs}</span></div><div><b>{recipe.nutrition.fat}g</b><span>{copy.fat}</span></div></div><p className="estimate-note">{copy.estimatedNote}</p><div className="detail-section"><h2>{copy.ingredients}</h2>{recipe.ingredients.map((ingredient, index) => <div className="ingredient" key={index}><span>{ingredient.item[locale]}</span><b>{formatIngredientAmount(ingredient, locale)}</b></div>)}</div><div className="detail-section"><h2>{copy.method}</h2>{recipe.instructions.map((step, index) => <div className="step" key={index}><span>{index + 1}</span><p>{step[locale]}</p></div>)}</div></section></main>
}

function EmptyState({ locale, favorites, hasSavedRecipes, hasFilters, onClear }: { locale: Locale; favorites: boolean; hasSavedRecipes: boolean; hasFilters: boolean; onClear(): void }) {
  const copy = messages[locale]
  const filteredFavorites = favorites && hasSavedRecipes
  return <div className="empty"><span>{favorites ? '♡' : '⌕'}</span><h3>{filteredFavorites ? copy.emptyFavoriteFilteredTitle : favorites ? copy.emptyFavoritesTitle : copy.emptyFilteredTitle}</h3><p>{filteredFavorites ? copy.emptyFavoriteFilteredText : favorites ? copy.emptyFavoritesText : copy.emptyFilteredText}</p>{hasFilters && <button className="random-button" onClick={onClear}>{copy.clearFilters}</button>}</div>
}

export default App
