import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ChevronRight, Clock3, Heart, Search, Shuffle, SlidersHorizontal, X } from 'lucide-react'
import { categoryLabel, loadLocale, messages, saveLocale, tagLabel } from './i18n'
import { formatIngredientAmount } from './measurements'
import { chooseRandom, emptyFilters, filterRecipes, recipes, searchRecipes } from './recipes'
import { loadFavorites, saveFavorites, toggleFavorite } from './favorites'
import type { Filters, Locale, Recipe } from './types'

const categories = ['Quick meals', 'Thai favorites', 'High protein', 'Plant-forward', 'Light bowls']
const tags = ['High protein', 'Quick', 'Light', 'Vegetarian', 'Vegan', 'No-cook', 'Fiber-rich', 'Meal prep']
const recipeIds = new Set(recipes.map(recipe => recipe.id))

export function normalizeFavorites(ids: string[]) {
  return [...new Set(ids)].filter(id => recipeIds.has(id))
}

function otherLocale(locale: Locale): Locale {
  return locale === 'th' ? 'en' : 'th'
}

function App() {
  const [screen, setScreen] = useState<'browse' | 'favorites' | 'detail'>('browse')
  const [returnScreen, setReturnScreen] = useState<'browse' | 'favorites'>('browse')
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => normalizeFavorites(loadFavorites()))
  const [lastRandom, setLastRandom] = useState<string>()
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [locale, setLocale] = useState<Locale>(() => loadLocale())
  const filterTriggerRef = useRef<HTMLButtonElement>(null)
  const copy = messages[locale]

  useEffect(() => setStorageAvailable(saveFavorites(favorites)), [favorites])
  useEffect(() => { saveLocale(locale) }, [locale])

  const filtered = useMemo(() => searchRecipes(filterRecipes(recipes, filters), query), [query, filters])
  const visible = screen === 'favorites' ? filtered.filter(recipe => favorites.includes(recipe.id)) : filtered
  const activeFilterCount = Number(Boolean(filters.category)) + filters.tags.length + Object.entries(filters).filter(([key, value]) => !['category', 'tags'].includes(key) && value !== undefined).length

  function openRecipe(recipe: Recipe) {
    setReturnScreen(screen === 'favorites' ? 'favorites' : 'browse')
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
  function closeFilters() { setFiltersOpen(false); requestAnimationFrame(() => filterTriggerRef.current?.focus()) }

  if (screen === 'detail' && selected) return <RecipeDetail recipe={selected} locale={locale} isFavorite={favorites.includes(selected.id)} onBack={() => setScreen(returnScreen)} onFavorite={() => favorite(selected.id)} />

  return <main className="app-shell">
    <header className="topbar">
      <button className="logo" onClick={() => setScreen('browse')} aria-label="Home"><span className="logo-mark">🍋</span><span>good<b>food</b></span></button>
      <div className="header-actions">
        <div className="language-switcher" role="group" aria-label={copy.language}>
          {(['th', 'en'] as Locale[]).map(option => <button key={option} className={locale === option ? 'active' : ''} onClick={() => setLocale(option)} aria-pressed={locale === option}>{option.toUpperCase()}</button>)}
        </div>
        <button className="icon-button" onClick={() => setScreen(screen === 'favorites' ? 'browse' : 'favorites')} aria-label={copy.favorites}><Heart size={21} fill={screen === 'favorites' ? 'currentColor' : 'none'} /><i>{favorites.length || ''}</i></button>
      </div>
    </header>
    <section className="hero"><p className="eyebrow">{copy.heroEyebrow}</p><h1>{copy.heroTitle}</h1><p>{copy.heroDescription}</p><button className="random-button" disabled={!filtered.length} onClick={randomRecipe}><Shuffle size={19} /> {copy.random}</button></section>
    <section className="content">
      {!storageAvailable && <p className="storage-note" role="status">{copy.storageNote}</p>}
      <div className="search-row"><label className="search"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={copy.searchPlaceholder} /></label><button ref={filterTriggerRef} className="filter-button" onClick={() => setFiltersOpen(true)} aria-label={copy.openFilters}><SlidersHorizontal size={19} />{activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button></div>
      <div className="section-heading"><h2>{screen === 'favorites' ? copy.favorites : copy.browse}</h2>{screen === 'favorites' && <button className="text-button" onClick={() => setScreen('browse')}>{copy.browseAll}</button>}</div>
      {screen === 'browse' && <div className="chips" aria-label={copy.recipeCategories}><button className={!filters.category ? 'active' : ''} onClick={() => setFilters(current => ({ ...current, category: '' }))}>{copy.allRecipes}</button>{categories.map(category => <button key={category} className={filters.category === category ? 'active' : ''} onClick={() => setFilters(current => ({ ...current, category }))}>{categoryLabel(locale, category)}</button>)}</div>}
      {visible.length ? <div className="recipe-grid">{visible.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} locale={locale} favorite={favorites.includes(recipe.id)} onOpen={() => openRecipe(recipe)} onFavorite={() => favorite(recipe.id)} />)}</div> : <EmptyState locale={locale} favorites={screen === 'favorites'} hasSavedRecipes={favorites.length > 0} hasFilters={Boolean(query.trim() || activeFilterCount)} onClear={() => { setQuery(''); setFilters(emptyFilters) }} />}
    </section>
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

function RecipeCard({ recipe, locale, favorite, onOpen, onFavorite }: { recipe: Recipe; locale: Locale; favorite: boolean; onOpen(): void; onFavorite(): void }) {
  const copy = messages[locale]
  const name = recipe.name[locale]
  const secondaryName = recipe.name[otherLocale(locale)]
  const favoriteLabel = favorite ? copy.removeFavorite(name) : copy.addFavorite(name)
  return <article className="recipe-card"><button className={`food-art ${recipe.accent}`} onClick={onOpen} aria-label={copy.openRecipe(name)}><RecipeImage recipe={recipe} variant="card" locale={locale} /><span className="time-pill"><Clock3 size={13} /> {recipe.prepMinutes + recipe.cookMinutes} min</span></button><div className="card-body"><div><p className="card-category">{categoryLabel(locale, recipe.category)}</p><h3>{name}</h3><p className="english">{secondaryName}</p></div><button className={`heart ${favorite ? 'saved' : ''}`} onClick={onFavorite} aria-label={favoriteLabel} aria-pressed={favorite}><Heart size={20} fill={favorite ? 'currentColor' : 'none'} /></button></div><button className="nutrition-line" onClick={onOpen} aria-label={`${copy.openRecipe(name)}, ${copy.kcalEstimate}`}><span><b>{recipe.nutrition.kcal}</b> {copy.kcalEstimate}</span><span><b>{recipe.nutrition.protein}g</b> {copy.protein}</span><ChevronRight size={17} /></button></article>
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
