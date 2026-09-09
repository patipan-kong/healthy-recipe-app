import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ChevronRight, Clock3, Heart, Search, Shuffle, SlidersHorizontal, X } from 'lucide-react'
import { chooseRandom, emptyFilters, filterRecipes, recipes, searchRecipes } from './recipes'
import { loadFavorites, saveFavorites, toggleFavorite } from './favorites'
import type { Filters, Recipe } from './types'

const categories = ['Quick meals', 'Thai favorites', 'High protein', 'Plant-forward', 'Light bowls']
const tags = ['High protein', 'Quick', 'Light', 'Vegetarian', 'Vegan', 'No-cook', 'Fiber-rich', 'Meal prep']
const filterLabels: Record<keyof Omit<Filters, 'category' | 'tags'>, string> = { maxKcal: 'Max kcal', minProtein: 'Min protein (g)', maxCarbs: 'Max carbs (g)', maxFat: 'Max fat (g)', maxSodium: 'Max sodium (mg)' }
const recipeIds = new Set(recipes.map(recipe => recipe.id))

export function normalizeFavorites(ids: string[]) {
  return [...new Set(ids)].filter(id => recipeIds.has(id))
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
  const filterTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setStorageAvailable(saveFavorites(favorites)), [favorites])

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

  if (screen === 'detail' && selected) return <RecipeDetail recipe={selected} isFavorite={favorites.includes(selected.id)} onBack={() => setScreen(returnScreen)} onFavorite={() => favorite(selected.id)} />

  return <main className="app-shell">
    <header className="topbar">
      <button className="logo" onClick={() => setScreen('browse')} aria-label="Home"><span className="logo-mark">🍋</span><span>good<b>food</b></span></button>
      <button className="icon-button" onClick={() => setScreen(screen === 'favorites' ? 'browse' : 'favorites')} aria-label="Favorites"><Heart size={21} fill={screen === 'favorites' ? 'currentColor' : 'none'} /><i>{favorites.length || ''}</i></button>
    </header>
    <section className="hero"><p className="eyebrow">MAKE SOMETHING GOOD</p><h1>What feels good<br />to cook today?</h1><p>Simple recipes, nourishing ingredients, no pressure.</p><button className="random-button" disabled={!filtered.length} onClick={randomRecipe}><Shuffle size={19} /> Pick a random recipe</button></section>
    <section className="content">
      {!storageAvailable && <p className="storage-note" role="status">Favorites will stay available for this session, but browser storage is unavailable.</p>}
      <div className="search-row"><label className="search"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search recipes or ingredients" /></label><button ref={filterTriggerRef} className="filter-button" onClick={() => setFiltersOpen(true)} aria-label="Open filters"><SlidersHorizontal size={19} />{activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button></div>
      <div className="section-heading"><h2>{screen === 'favorites' ? 'Your favorites' : 'Browse recipes'}</h2>{screen === 'favorites' && <button className="text-button" onClick={() => setScreen('browse')}>Browse all</button>}</div>
      {screen === 'browse' && <div className="chips" aria-label="Recipe categories"><button className={!filters.category ? 'active' : ''} onClick={() => setFilters(current => ({ ...current, category: '' }))}>All recipes</button>{categories.map(category => <button key={category} className={filters.category === category ? 'active' : ''} onClick={() => setFilters(current => ({ ...current, category }))}>{category}</button>)}</div>}
      {visible.length ? <div className="recipe-grid">{visible.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} favorite={favorites.includes(recipe.id)} onOpen={() => openRecipe(recipe)} onFavorite={() => favorite(recipe.id)} />)}</div> : <EmptyState favorites={screen === 'favorites'} hasSavedRecipes={favorites.length > 0} hasFilters={Boolean(query.trim() || activeFilterCount)} onClear={() => { setQuery(''); setFilters(emptyFilters) }} />}
    </section>
    {filtersOpen && <FilterSheet filters={filters} updateNumber={updateNumber} toggleTag={toggleTag} onCategory={category => setFilters(current => ({ ...current, category }))} onClear={() => setFilters(emptyFilters)} onClose={closeFilters} />}
  </main>
}

function RecipeCard({ recipe, favorite, onOpen, onFavorite }: { recipe: Recipe; favorite: boolean; onOpen(): void; onFavorite(): void }) {
  const favoriteLabel = favorite ? `Remove ${recipe.englishName} from favorites` : `Add ${recipe.englishName} to favorites`
  return <article className="recipe-card"><button className={`food-art ${recipe.accent}`} onClick={onOpen} aria-label={`Open ${recipe.englishName}`}><span className="food-emoji">{recipe.category === 'High protein' ? '🐟' : recipe.category === 'Plant-forward' ? '🥬' : recipe.category === 'Light bowls' ? '🥗' : '🍲'}</span><span className="time-pill"><Clock3 size={13} /> {recipe.prepMinutes + recipe.cookMinutes} min</span></button><div className="card-body"><div><p className="card-category">{recipe.category}</p><h3>{recipe.name}</h3><p className="english">{recipe.englishName}</p></div><button className={`heart ${favorite ? 'saved' : ''}`} onClick={onFavorite} aria-label={favoriteLabel} aria-pressed={favorite}><Heart size={20} fill={favorite ? 'currentColor' : 'none'} /></button></div><button className="nutrition-line" onClick={onOpen} aria-label={`Open ${recipe.englishName}, estimated nutrition per serving`}><span><b>{recipe.nutrition.kcal}</b> kcal est. / serving</span><span><b>{recipe.nutrition.protein}g</b> protein</span><ChevronRight size={17} /></button></article>
}

export function FilterSheet({ filters, updateNumber, toggleTag, onCategory, onClear, onClose }: { filters: Filters; updateNumber(field: keyof Omit<Filters, 'category' | 'tags'>, value: string): void; toggleTag(tag: string): void; onCategory(category: string): void; onClear(): void; onClose(): void }) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
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
  return <div className="modal-backdrop" role="presentation"><section ref={dialogRef} className="filter-sheet" role="dialog" aria-modal="true" aria-label="Filters"><div className="sheet-top"><div className="grab" /><button ref={closeRef} className="close" onClick={onClose} aria-label="Close filters"><X /></button><h2>Filters</h2><button className="text-button" onClick={onClear}>Clear all</button></div><div className="filter-content"><label className="field-label">Category<select value={filters.category} onChange={event => onCategory(event.target.value)}><option value="">Any category</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label><h3>Nutrition per serving</h3><div className="number-grid">{Object.entries(filterLabels).map(([field, label]) => <label key={field} className="field-label">{label}<input type="number" min="0" value={filters[field as keyof Omit<Filters, 'category' | 'tags'>] ?? ''} onChange={event => updateNumber(field as keyof Omit<Filters, 'category' | 'tags'>, event.target.value)} /></label>)}</div><h3>Tags</h3><div className="chips tags">{tags.map(tag => <button key={tag} className={filters.tags.includes(tag) ? 'active' : ''} onClick={() => toggleTag(tag)}>{tag}</button>)}</div><p className="estimate-note">Nutrition is an estimate per serving and can vary with ingredient brands and portions.</p></div><button className="show-results" onClick={onClose}>Show matching recipes</button></section></div>
}

function RecipeDetail({ recipe, isFavorite, onBack, onFavorite }: { recipe: Recipe; isFavorite: boolean; onBack(): void; onFavorite(): void }) {
  const favoriteLabel = isFavorite ? `Remove ${recipe.englishName} from favorites` : `Add ${recipe.englishName} to favorites`
  return <main className="detail"><header className="detail-nav"><button className="round-button" onClick={onBack} aria-label="Back"><ArrowLeft /></button><button className={`round-button ${isFavorite ? 'saved' : ''}`} onClick={onFavorite} aria-label={favoriteLabel} aria-pressed={isFavorite}><Heart fill={isFavorite ? 'currentColor' : 'none'} /></button></header><div className={`detail-art ${recipe.accent}`}><span>{recipe.category === 'High protein' ? '🐟' : recipe.category === 'Plant-forward' ? '🥬' : recipe.category === 'Light bowls' ? '🥗' : '🍲'}</span></div><section className="detail-content"><p className="eyebrow">{recipe.cuisine} · {recipe.category}</p><h1>{recipe.name}</h1><p className="detail-english">{recipe.englishName}</p><div className="facts"><span><Clock3 size={17} /> Prep {recipe.prepMinutes} min</span><span>Cook {recipe.cookMinutes} min</span><span>Serves {recipe.servings}</span></div><div className="nutrition-card"><div><b>{recipe.nutrition.kcal}</b><span>kcal</span></div><div><b>{recipe.nutrition.protein}g</b><span>protein</span></div><div><b>{recipe.nutrition.carbs}g</b><span>carbs</span></div><div><b>{recipe.nutrition.fat}g</b><span>fat</span></div></div><p className="estimate-note">Estimated nutrition per serving · values vary by ingredients and portions.</p><div className="detail-section"><h2>Ingredients</h2>{recipe.ingredients.map((ingredient, index) => <div className="ingredient" key={index}><span>{ingredient.item}</span><b>{ingredient.amount}</b></div>)}</div><div className="detail-section"><h2>Method</h2>{recipe.instructions.map((step, index) => <div className="step" key={index}><span>{index + 1}</span><p>{step}</p></div>)}</div></section></main>
}

function EmptyState({ favorites, hasSavedRecipes, hasFilters, onClear }: { favorites: boolean; hasSavedRecipes: boolean; hasFilters: boolean; onClear(): void }) {
  const filteredFavorites = favorites && hasSavedRecipes
  return <div className="empty"><span>{favorites ? '♡' : '⌕'}</span><h3>{filteredFavorites ? 'No saved recipes match' : favorites ? 'No saved recipes yet' : 'Nothing matches those filters'}</h3><p>{filteredFavorites ? 'Try clearing your search or filters to see your saved recipes.' : favorites ? 'Tap the heart on any recipe to keep it here.' : 'Try widening your nutrition limits or clearing a filter.'}</p>{hasFilters && <button className="random-button" onClick={onClear}>Clear filters</button>}</div>
}

export default App
