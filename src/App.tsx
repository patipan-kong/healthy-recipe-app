import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ChevronRight, Clock3, Compass, Heart, Search, Shuffle, ShoppingBasket, SlidersHorizontal, Store, X } from 'lucide-react'
import { categoryLabel, explorePresetLabel, explorePresetSummary, ingredientCategoryLabel, loadLocale, menuCategoryLabel, messages, nutritionConfidenceLabel, saveLocale, tagLabel } from './i18n'
import { formatIngredientAmount } from './measurements'
import { chooseRandom, emptyFilters, filterRecipes, recipes, searchRecipes } from './recipes'
import { loadFavorites, saveFavorites, toggleFavorite } from './favorites'
import { loadRestaurantMenuFavorites, saveRestaurantMenuFavorites, toggleRestaurantMenuFavorite } from './restaurant-menu-favorites'
import { canonicalIngredients, categoryIngredients, countRecipesByIngredient, filterRecipesByIngredient, ingredientCategoryOrder, loadPantrySelection, rankRecipesByPantry, savePantrySelection, togglePantryIngredient, type PantryMatch } from './pantry'
import { adjustShoppingRecipeServings, aggregateShoppingIngredients, emptyShoppingSelection, loadPurchasedShoppingLines, loadShoppingState, savePurchasedShoppingLines, saveShoppingState, togglePurchasedShoppingLine, toggleShoppingRecipeState, type ShoppingLine, type ShoppingSelection } from './shopping'
import { emptyRestaurantMenuFilters, explorePresetFilters, explorePresetIds, filterRestaurantMenuItems, matchingExplorePresetId, restaurantMenuItems, restaurants, searchRestaurantMenuItems } from './restaurants'
import { RestaurantIdentity } from './restaurant-identity'
import type { ExplorePresetId, Filters, Locale, Recipe, Restaurant, RestaurantMenuFilters, RestaurantMenuItem } from './types'

const categories = ['Quick meals', 'Thai favorites', 'High protein', 'Plant-forward', 'Light bowls']
const tags = ['High protein', 'Quick', 'Light', 'Vegetarian', 'Vegan', 'No-cook', 'Fiber-rich', 'Meal prep']
const recipeIds = new Set(recipes.map(recipe => recipe.id))
const restaurantMenuItemIds = new Set(restaurantMenuItems.map(item => item.id))
type AppScreen = 'browse' | 'favorites' | 'pantry' | 'shopping' | 'restaurants' | 'restaurant-detail' | 'explore' | 'detail'
type PantryMode = 'selection' | 'results'
type PantryResultSource =
  | { kind: 'selection' }
  | { kind: 'direct'; ingredientId: string }

export function normalizeFavorites(ids: string[]) {
  return [...new Set(ids)].filter(id => recipeIds.has(id))
}

export function normalizeRestaurantMenuFavorites(ids: string[]) {
  return [...new Set(ids)].filter(id => restaurantMenuItemIds.has(id))
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
  const [restaurantMenuFavorites, setRestaurantMenuFavorites] = useState<string[]>(() => normalizeRestaurantMenuFavorites(loadRestaurantMenuFavorites()))
  const [restaurantFavoritesStorageAvailable, setRestaurantFavoritesStorageAvailable] = useState(true)
  const [shoppingSelection, setShoppingSelection] = useState<ShoppingSelection>(() => loadShoppingState(undefined, recipes))
  const [shoppingPurchasedIds, setShoppingPurchasedIds] = useState<string[]>(() => loadPurchasedShoppingLines())
  const [lastRandom, setLastRandom] = useState<string>()
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [pantryStorageAvailable, setPantryStorageAvailable] = useState(true)
  const [shoppingStorageAvailable, setShoppingStorageAvailable] = useState(true)
  const [shoppingPurchasedStorageAvailable, setShoppingPurchasedStorageAvailable] = useState(true)
  const [locale, setLocale] = useState<Locale>(() => loadLocale())
  const [pantrySelection, setPantrySelection] = useState<string[]>(() => loadPantrySelection())
  const [pantryResultSource, setPantryResultSource] = useState<PantryResultSource>({ kind: 'selection' })
  const [pantryMode, setPantryMode] = useState<PantryMode>('selection')
  const [pantryQuery, setPantryQuery] = useState('')
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)
  const filterTriggerRef = useRef<HTMLButtonElement>(null)
  const copy = messages[locale]

  useEffect(() => setStorageAvailable(saveFavorites(favorites)), [favorites])
  useEffect(() => setRestaurantFavoritesStorageAvailable(saveRestaurantMenuFavorites(restaurantMenuFavorites)), [restaurantMenuFavorites])
  useEffect(() => setPantryStorageAvailable(savePantrySelection(pantrySelection)), [pantrySelection])
  useEffect(() => setShoppingStorageAvailable(saveShoppingState(shoppingSelection)), [shoppingSelection])
  useEffect(() => setShoppingPurchasedStorageAvailable(savePurchasedShoppingLines(shoppingPurchasedIds)), [shoppingPurchasedIds])
  useEffect(() => { saveLocale(locale) }, [locale])

  const filtered = useMemo(() => searchRecipes(filterRecipes(recipes, filters), query), [query, filters])
  const visible = screen === 'favorites' ? filtered.filter(recipe => favorites.includes(recipe.id)) : filtered
  const favoriteRestaurantMenuEntries = useMemo(() => restaurantMenuFavorites
    .map(id => restaurantMenuItems.find(item => item.id === id))
    .filter((item): item is RestaurantMenuItem => Boolean(item))
    .map(item => ({ item, restaurant: restaurants.find(candidate => candidate.id === item.restaurantId) }))
    .filter((entry): entry is { item: RestaurantMenuItem; restaurant: Restaurant } => Boolean(entry.restaurant))
  , [restaurantMenuFavorites])
  const pantryCounts = useMemo(() => countRecipesByIngredient(recipes), [])
  const shoppingLines = useMemo(() => aggregateShoppingIngredients(recipes, shoppingSelection.recipeIds, shoppingSelection.servingsByRecipeId), [shoppingSelection])
  const activeFilterCount = Number(Boolean(filters.category)) + filters.tags.length + Object.entries(filters).filter(([key, value]) => !['category', 'tags'].includes(key) && value !== undefined).length

  useEffect(() => {
    const availableLineIds = new Set(shoppingLines.map(line => line.id))
    setShoppingPurchasedIds(current => {
      const next = current.filter(id => availableLineIds.has(id))
      return next.length === current.length ? current : next
    })
  }, [shoppingLines])

  function openRecipe(recipe: Recipe) {
    setReturnScreen(screen === 'favorites' ? 'favorites' : screen === 'pantry' ? 'pantry' : screen === 'shopping' ? 'shopping' : 'browse')
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
  function favoriteRestaurantMenuItem(id: string) { setRestaurantMenuFavorites(current => toggleRestaurantMenuFavorite(current, id)) }
  function toggleShoppingRecipeFromDetail(id: string) {
    const recipe = recipes.find(candidate => candidate.id === id)
    if (recipe) setShoppingSelection(current => toggleShoppingRecipeState(current, recipe))
  }
  function removeShoppingRecipe(id: string) {
    const recipe = recipes.find(candidate => candidate.id === id)
    if (recipe) setShoppingSelection(current => toggleShoppingRecipeState(current, recipe))
  }
  function adjustShoppingServings(id: string, delta: number) {
    const recipe = recipes.find(candidate => candidate.id === id)
    if (recipe) setShoppingSelection(current => adjustShoppingRecipeServings(current, recipe, delta))
  }
  function toggleShoppingPurchased(lineId: string) { setShoppingPurchasedIds(current => togglePurchasedShoppingLine(current, lineId)) }
  function clearShopping() { setShoppingSelection(emptyShoppingSelection()); setShoppingPurchasedIds([]) }
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
  function toggleShoppingScreen() { setScreen(current => current === 'shopping' ? 'browse' : 'shopping') }
  function toggleRestaurantsScreen() {
    setSelectedRestaurantId(null)
    setScreen(current => current === 'restaurants' || current === 'restaurant-detail' ? 'browse' : 'restaurants')
  }
  function openRestaurant(id: string) { setSelectedRestaurantId(id); setScreen('restaurant-detail') }
  function backToRestaurants() { setSelectedRestaurantId(null); setScreen('restaurants') }
  function toggleExploreScreen() { setScreen(current => current === 'explore' ? 'browse' : 'explore') }
  function closeFilters() { setFiltersOpen(false); requestAnimationFrame(() => filterTriggerRef.current?.focus()) }

  if (screen === 'detail' && selected) return <RecipeDetail recipe={selected} locale={locale} isFavorite={favorites.includes(selected.id)} isInShopping={shoppingSelection.recipeIds.includes(selected.id)} onBack={() => setScreen(returnScreen)} onFavorite={() => favorite(selected.id)} onToggleShopping={() => toggleShoppingRecipeFromDetail(selected.id)} />

  return <main className="app-shell">
    <header className="topbar">
      <button className="logo" onClick={() => setScreen('browse')} aria-label="Home"><span className="logo-mark">🍋</span><span>good<b>food</b></span></button>
      <div className="header-actions">
        <div className="language-switcher" role="group" aria-label={copy.language}>
          {(['th', 'en'] as Locale[]).map(option => <button key={option} className={locale === option ? 'active' : ''} onClick={() => setLocale(option)} aria-pressed={locale === option}>{option.toUpperCase()}</button>)}
        </div>
        <button className={`pantry-nav ${screen === 'pantry' ? 'active' : ''}`} onClick={togglePantryScreen} aria-label={copy.pantry} aria-pressed={screen === 'pantry'}><span aria-hidden="true">🥕</span><span>{copy.pantry}</span>{pantrySelection.length > 0 && <i>{pantrySelection.length}</i>}</button>
        <button className={`shopping-nav ${screen === 'shopping' ? 'active' : ''}`} onClick={toggleShoppingScreen} aria-label={copy.shopping} aria-pressed={screen === 'shopping'}><ShoppingBasket size={16} aria-hidden="true" /><span>{copy.shopping}</span>{shoppingSelection.recipeIds.length > 0 && <i>{shoppingSelection.recipeIds.length}</i>}</button>
        <button className={`restaurant-nav ${screen === 'restaurants' || screen === 'restaurant-detail' ? 'active' : ''}`} onClick={toggleRestaurantsScreen} aria-label={copy.restaurants} aria-pressed={screen === 'restaurants' || screen === 'restaurant-detail'}><Store size={16} aria-hidden="true" /><span>{copy.restaurants}</span></button>
        <button className={`explore-nav ${screen === 'explore' ? 'active' : ''}`} onClick={toggleExploreScreen} aria-label={copy.explore} aria-pressed={screen === 'explore'}><Compass size={16} aria-hidden="true" /><span>{copy.explore}</span></button>
        <button className="icon-button" onClick={() => setScreen(screen === 'favorites' ? 'browse' : 'favorites')} aria-label={copy.favorites}><Heart size={21} fill={screen === 'favorites' ? 'currentColor' : 'none'} /><i>{favorites.length || ''}</i></button>
      </div>
    </header>
    {screen === 'pantry' ? <PantryView locale={locale} mode={pantryMode} selectedIds={pantrySelection} resultSource={pantryResultSource} query={pantryQuery} counts={pantryCounts} storageAvailable={pantryStorageAvailable} onQuery={setPantryQuery} onToggle={togglePantry} onBrowseIngredient={browsePantryIngredient} onViewResults={showPantryResults} onEditIngredients={editPantryIngredients} onClear={clearPantry} favorites={favorites} onOpen={openRecipe} onFavorite={favorite} /> : screen === 'shopping' ? <ShoppingView locale={locale} recipeIds={shoppingSelection.recipeIds} servingsByRecipeId={shoppingSelection.servingsByRecipeId} lines={shoppingLines} purchasedIds={shoppingPurchasedIds} pantryIds={pantrySelection} storageAvailable={shoppingStorageAvailable && shoppingPurchasedStorageAvailable} onTogglePurchased={toggleShoppingPurchased} onChangeServings={adjustShoppingServings} onRemoveRecipe={removeShoppingRecipe} onClear={clearShopping} onOpen={openRecipe} /> : screen === 'restaurants' ? <RestaurantListView locale={locale} onOpen={openRestaurant} /> : screen === 'restaurant-detail' ? <RestaurantMenuView locale={locale} restaurantId={selectedRestaurantId} onBack={backToRestaurants} favoriteIds={restaurantMenuFavorites} onFavorite={favoriteRestaurantMenuItem} storageAvailable={restaurantFavoritesStorageAvailable} /> : screen === 'explore' ? <ExploreView locale={locale} onOpenRestaurant={openRestaurant} favoriteIds={restaurantMenuFavorites} onFavorite={favoriteRestaurantMenuItem} storageAvailable={restaurantFavoritesStorageAvailable} /> : <>
      <section className="hero"><p className="eyebrow">{copy.heroEyebrow}</p><h1>{copy.heroTitle}</h1><p>{copy.heroDescription}</p><button className="random-button" disabled={!filtered.length} onClick={randomRecipe}><Shuffle size={19} /> {copy.random}</button></section>
      <section className="content">
        {!storageAvailable && <p className="storage-note" role="status">{copy.storageNote}</p>}
         <div className="search-row"><label className="search"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={copy.searchPlaceholder} aria-label={copy.searchPlaceholder} /></label><button ref={filterTriggerRef} className="filter-button" onClick={() => setFiltersOpen(true)} aria-label={copy.openFilters}><SlidersHorizontal size={19} />{activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button></div>
        <div className="section-heading"><h2>{screen === 'favorites' ? copy.favorites : copy.browse}</h2>{screen === 'favorites' && <button className="text-button" onClick={() => setScreen('browse')}>{copy.browseAll}</button>}</div>
        {screen === 'browse' && <div className="chips" aria-label={copy.recipeCategories}><button className={!filters.category ? 'active' : ''} onClick={() => setFilters(current => ({ ...current, category: '' }))}>{copy.allRecipes}</button>{categories.map(category => <button key={category} className={filters.category === category ? 'active' : ''} onClick={() => setFilters(current => ({ ...current, category }))}>{categoryLabel(locale, category)}</button>)}</div>}
        {screen === 'favorites' && <h3 className="favorites-section-heading">{copy.favoriteRecipesHeading}</h3>}
        {visible.length ? <div className="recipe-grid">{visible.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} locale={locale} favorite={favorites.includes(recipe.id)} onOpen={() => openRecipe(recipe)} onFavorite={() => favorite(recipe.id)} />)}</div> : <EmptyState locale={locale} favorites={screen === 'favorites'} hasSavedRecipes={favorites.length > 0} hasFilters={Boolean(query.trim() || activeFilterCount)} onClear={() => { setQuery(''); setFilters(emptyFilters) }} />}
        {screen === 'favorites' && <>
          <h3 className="favorites-section-heading">{copy.favoriteRestaurantMenusHeading}</h3>
          {!restaurantFavoritesStorageAvailable && <p className="storage-note" role="status">{copy.restaurantFavoritesStorageNote}</p>}
          {favoriteRestaurantMenuEntries.length ? <div className="menu-list">{favoriteRestaurantMenuEntries.map(({ item, restaurant }) => <article className="menu-item-row" key={item.id}>
            <MenuFavoriteButton locale={locale} name={item.name[locale]} favorite={true} onToggle={() => favoriteRestaurantMenuItem(item.id)} />
            <div className="menu-item-copy">
              <p className="card-category">{menuCategoryLabel(locale, item.category)}</p>
              <h3>{item.name[locale]}</h3>
              <div className="menu-item-restaurant-line"><RestaurantIdentity restaurant={restaurant} locale={locale} size="xs" /><p className="menu-item-restaurant">{restaurant.name[locale]}</p></div>
              {item.servingNote && <p className="menu-item-note">{item.servingNote[locale]}</p>}
            </div>
            <div className="menu-item-nutrition">
              <span><b>{item.nutrition.kcal}</b> {copy.kcalEstimate}</span>
              <span><b>{item.nutrition.protein}g</b> {copy.protein}</span>
              <span className={`confidence-badge confidence-${item.nutritionSource.confidence}`}>{nutritionConfidenceLabel(locale, item.nutritionSource.confidence)}</span>
            </div>
            <button className="text-button explore-view-restaurant" onClick={() => openRestaurant(restaurant.id)}>{copy.viewRestaurant(restaurant.name[locale])}</button>
          </article>)}</div> : <p className="empty-restaurant-favorites">{copy.emptyRestaurantFavoritesText}</p>}
        </>}
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

type ShoppingViewProps = {
  locale: Locale
  recipeIds: string[]
  servingsByRecipeId: Readonly<Record<string, number>>
  lines: ShoppingLine[]
  purchasedIds: string[]
  pantryIds: string[]
  storageAvailable: boolean
  onTogglePurchased(lineId: string): void
  onChangeServings(recipeId: string, delta: number): void
  onRemoveRecipe(recipeId: string): void
  onClear(): void
  onOpen(recipe: Recipe): void
}

function ShoppingView({ locale, recipeIds, servingsByRecipeId, lines, purchasedIds, pantryIds, storageAvailable, onTogglePurchased, onChangeServings, onRemoveRecipe, onClear, onOpen }: ShoppingViewProps) {
  const copy = messages[locale]
  const selectedRecipes = recipeIds.map(id => recipes.find(recipe => recipe.id === id)).filter((recipe): recipe is Recipe => Boolean(recipe))
  const purchased = new Set(purchasedIds)

  return <section className="content shopping-view">
    {!storageAvailable && <p className="storage-note" role="status">{copy.shoppingStorageNote}</p>}
    <div className="section-heading shopping-heading"><div><p className="eyebrow">{copy.shopping}</p><h2>{copy.shoppingTitle}</h2></div></div>
    {selectedRecipes.length ? <>
      <section className="shopping-section" aria-labelledby="shopping-selected-heading">
        <h3 id="shopping-selected-heading">{copy.shoppingSelectedRecipes}</h3>
        <div className="shopping-recipes">{selectedRecipes.map(recipe => {
          const targetServings = servingsByRecipeId[recipe.id] ?? recipe.servings
          return <div className="shopping-recipe" key={recipe.id}>
            <button className="shopping-recipe-name" onClick={() => onOpen(recipe)}>{recipe.name[locale]}</button>
            <div className="shopping-serving-control-wrap">
              <span className="shopping-serving-label">{copy.shoppingServings}</span>
              <div className="shopping-serving-control" role="group" aria-label={`${copy.shoppingServings}: ${recipe.name[locale]}`}>
                <button className="shopping-serving-button" onClick={() => onChangeServings(recipe.id, -1)} disabled={targetServings <= 1} aria-label={`${copy.shoppingDecrease}: ${recipe.name[locale]}`}>−</button>
                <span className="shopping-serving-value" aria-live="polite" data-shopping-servings={recipe.id}>{targetServings}</span>
                <button className="shopping-serving-button" onClick={() => onChangeServings(recipe.id, 1)} disabled={targetServings >= 20} aria-label={`${copy.shoppingIncrease}: ${recipe.name[locale]}`}>+</button>
              </div>
            </div>
            <button className="text-button shopping-remove" onClick={() => onRemoveRecipe(recipe.id)} aria-label={`${copy.shoppingRemove} ${recipe.name[locale]}`}>{copy.shoppingRemove}</button>
          </div>
        })}</div>
      </section>
      <section className="shopping-section" aria-labelledby="shopping-ingredients-heading">
        <h3 id="shopping-ingredients-heading">{copy.shoppingIngredients}</h3>
        <div className="shopping-lines">{lines.map(line => {
          const isPurchased = purchased.has(line.id)
          const displayName = line.item[locale]
          const amount = formatIngredientAmount(line, locale)
          const alreadyHave = Boolean(line.ingredientId && pantryIds.includes(line.ingredientId))
          return <label className={`shopping-line ${isPurchased ? 'purchased' : ''}`} key={line.id} data-shopping-line-id={line.id}><input type="checkbox" checked={isPurchased} onChange={() => onTogglePurchased(line.id)} aria-label={`${displayName}, ${amount}${isPurchased ? `, ${copy.shoppingPurchased}` : ''}`} data-shopping-line-checkbox={line.id} /><span className="shopping-line-copy"><span className="shopping-line-name">{displayName}</span><b>{amount}</b>{alreadyHave && <em>{copy.shoppingAlreadyHave}</em>}{isPurchased && <small>{copy.shoppingPurchased}</small>}</span></label>
        })}</div>
      </section>
      <button className="shopping-clear" onClick={onClear}>{copy.shoppingClear}</button>
    </> : <div className="empty shopping-empty" role="status"><span aria-hidden="true">🛒</span><h3>{copy.shoppingEmptyTitle}</h3><p>{copy.shoppingEmptyText}</p></div>}
  </section>
}

function RestaurantListView({ locale, onOpen }: { locale: Locale; onOpen(id: string): void }) {
  const copy = messages[locale]
  const [pickedRestaurantId, setPickedRestaurantId] = useState<string>()
  const [lastPickedRestaurantId, setLastPickedRestaurantId] = useState<string>()
  const pickedRestaurant = restaurants.find(restaurant => restaurant.id === pickedRestaurantId)

  function pickRestaurant() {
    const result = chooseRandom(restaurants, lastPickedRestaurantId)
    if (result) {
      setLastPickedRestaurantId(result.id)
      setPickedRestaurantId(result.id)
    }
  }

  return <section className="content restaurant-view">
    <div className="section-heading restaurant-heading"><div><p className="eyebrow">{copy.restaurants}</p><h2>{copy.restaurantsTitle}</h2></div></div>
    <section className="restaurant-pick" aria-live="polite">
      <div className="restaurant-pick-header">
        <h3>{copy.restaurantPickHeading}</h3>
        {!pickedRestaurant && <button className="random-button restaurant-pick-trigger" disabled={!restaurants.length} onClick={pickRestaurant} aria-label={copy.pickRestaurant}><Shuffle size={17} /> {copy.pickRestaurant}</button>}
      </div>
      {pickedRestaurant && <article className="restaurant-pick-card">
        <div className="restaurant-pick-copy">
          <div className="restaurant-pick-identity">
            <RestaurantIdentity restaurant={pickedRestaurant} locale={locale} size="md" />
            <div className="restaurant-pick-text">
              <p className="restaurant-pick-label">{copy.restaurantPickLabel}</p>
              <h3>{pickedRestaurant.name[locale]}</h3>
              {pickedRestaurant.cuisine && <p className="restaurant-pick-cuisine">{pickedRestaurant.cuisine[locale]}</p>}
            </div>
          </div>
        </div>
        <div className="restaurant-pick-actions">
          <button className="random-button restaurant-pick-again" onClick={pickRestaurant}><Shuffle size={16} /> {copy.pickAgain}</button>
          <button className="restaurant-pick-view-menu" onClick={() => onOpen(pickedRestaurant.id)}>{copy.viewMenu}</button>
        </div>
      </article>}
    </section>
    {restaurants.length ? <div className="restaurant-list">{restaurants.map(restaurant => <button key={restaurant.id} className="restaurant-row" onClick={() => onOpen(restaurant.id)} aria-label={copy.openRestaurant(restaurant.name[locale])}><RestaurantIdentity restaurant={restaurant} locale={locale} size="sm" /><span className="restaurant-row-copy"><b>{restaurant.name[locale]}</b>{restaurant.cuisine && <em>{restaurant.cuisine[locale]}</em>}</span><ChevronRight size={17} aria-hidden="true" /></button>)}</div>
      : <div className="empty restaurant-empty" role="status"><span aria-hidden="true">🍽️</span><h3>{copy.restaurantsEmptyTitle}</h3><p>{copy.restaurantsEmptyText}</p></div>}
  </section>
}

function MenuFavoriteButton({ locale, name, favorite, onToggle }: { locale: Locale; name: string; favorite: boolean; onToggle(): void }) {
  const copy = messages[locale]
  const label = favorite ? copy.removeMenuFavorite(name) : copy.addMenuFavorite(name)
  return <button className={`heart menu-favorite-toggle ${favorite ? 'saved' : ''}`} onClick={onToggle} aria-label={label} aria-pressed={favorite}><Heart size={18} fill={favorite ? 'currentColor' : 'none'} /></button>
}

function RestaurantMenuView({ locale, restaurantId, onBack, favoriteIds, onFavorite, storageAvailable }: { locale: Locale; restaurantId: string | null; onBack(): void; favoriteIds: string[]; onFavorite(id: string): void; storageAvailable: boolean }) {
  const copy = messages[locale]
  const restaurant = restaurants.find(candidate => candidate.id === restaurantId)
  const allItems = restaurantId ? restaurantMenuItems.filter(item => item.restaurantId === restaurantId) : []
  const [filters, setFilters] = useState<RestaurantMenuFilters>(emptyRestaurantMenuFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [pickedId, setPickedId] = useState<string>()
  const [lastPickedId, setLastPickedId] = useState<string>()
  useEffect(() => { setFilters(emptyRestaurantMenuFilters); setFiltersOpen(false); setPickedId(undefined); setLastPickedId(undefined) }, [restaurantId])
  useEffect(() => { setPickedId(undefined); setLastPickedId(undefined) }, [filters])
  const items = filterRestaurantMenuItems(allItems, filters)
  const activeFilterCount = Object.values(filters).filter(value => value !== undefined).length
  const filterLabels: Record<keyof RestaurantMenuFilters, string> = { maxKcal: copy.maxKcal, minProtein: copy.minProtein, maxCarbs: copy.maxCarbs, maxFat: copy.maxFat, maxSodium: copy.maxSodium }
  const pickedItem = items.find(item => item.id === pickedId)
  function updateNumber(field: keyof RestaurantMenuFilters, value: string) {
    setFilters(current => ({ ...current, [field]: value === '' ? undefined : Number(value) }))
  }
  function pickForMe() {
    const result = chooseRandom(items, lastPickedId)
    if (result) { setLastPickedId(result.id); setPickedId(result.id) }
  }
  return <section className="content restaurant-menu-view">
    <div className="restaurant-menu-nav">
      <button className="text-button restaurant-back" onClick={onBack}>{copy.restaurantsBack}</button>
      <button className="filter-button" onClick={() => setFiltersOpen(open => !open)} aria-pressed={filtersOpen} aria-label={copy.openFilters}><SlidersHorizontal size={17} />{activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button>
    </div>
    <div className="section-heading restaurant-heading"><div><p className="eyebrow">{restaurant?.cuisine?.[locale] ?? copy.restaurants}</p><h2>{restaurant?.name[locale] ?? copy.restaurants}</h2></div></div>
    {!storageAvailable && <p className="storage-note" role="status">{copy.restaurantFavoritesStorageNote}</p>}
    {filtersOpen && <div className="menu-filter-panel">
      <div className="number-grid">{Object.entries(filterLabels).map(([field, label]) => <label key={field} className="field-label">{label}<input type="number" min="0" value={filters[field as keyof RestaurantMenuFilters] ?? ''} onChange={event => updateNumber(field as keyof RestaurantMenuFilters, event.target.value)} /></label>)}</div>
      {activeFilterCount > 0 && <button className="text-button" onClick={() => setFilters(emptyRestaurantMenuFilters)}>{copy.clearFilters}</button>}
    </div>}
    {allItems.length > 0 && <section className="menu-pick" aria-live="polite">
      <div className="menu-pick-header">
        <h3>{copy.yourPick}</h3>
        <button className="random-button" disabled={!items.length} onClick={pickForMe}><Shuffle size={17} /> {pickedItem ? copy.pickAgain : copy.pickForMe}</button>
      </div>
      {pickedItem ? <article className="menu-item-row menu-pick-card">
        <MenuFavoriteButton locale={locale} name={pickedItem.name[locale]} favorite={favoriteIds.includes(pickedItem.id)} onToggle={() => onFavorite(pickedItem.id)} />
        <div className="menu-item-copy">
          <p className="card-category">{menuCategoryLabel(locale, pickedItem.category)}</p>
          <h3>{pickedItem.name[locale]}</h3>
          {pickedItem.servingNote && <p className="menu-item-note">{pickedItem.servingNote[locale]}</p>}
          {pickedItem.customizationNotes?.length ? <ul className="menu-item-customizations">{pickedItem.customizationNotes.map((note, index) => <li key={index}>{note[locale]}</li>)}</ul> : null}
        </div>
        <div className="menu-item-nutrition">
          <span><b>{pickedItem.nutrition.kcal}</b> {copy.kcalEstimate}</span>
          <span><b>{pickedItem.nutrition.protein}g</b> {copy.protein}</span>
          <span><b>{pickedItem.nutrition.carbs}g</b> {copy.carbs}</span>
          <span><b>{pickedItem.nutrition.fat}g</b> {copy.fat}</span>
          {pickedItem.nutrition.sodium !== undefined && <span><b>{pickedItem.nutrition.sodium}mg</b> {copy.sodium}</span>}
          <span className={`confidence-badge confidence-${pickedItem.nutritionSource.confidence}`}>{nutritionConfidenceLabel(locale, pickedItem.nutritionSource.confidence)}</span>
        </div>
      </article> : !items.length && <p className="menu-pick-empty">{copy.pickNoMatches}</p>}
    </section>}
    {items.length ? <div className="menu-list">{items.map(item => <article className="menu-item-row" key={item.id}>
      <MenuFavoriteButton locale={locale} name={item.name[locale]} favorite={favoriteIds.includes(item.id)} onToggle={() => onFavorite(item.id)} />
      <div className="menu-item-copy">
        <p className="card-category">{menuCategoryLabel(locale, item.category)}</p>
        <h3>{item.name[locale]}</h3>
        {item.servingNote && <p className="menu-item-note">{item.servingNote[locale]}</p>}
        {item.customizationNotes?.length ? <ul className="menu-item-customizations">{item.customizationNotes.map((note, index) => <li key={index}>{note[locale]}</li>)}</ul> : null}
      </div>
      <div className="menu-item-nutrition">
        <span><b>{item.nutrition.kcal}</b> {copy.kcalEstimate}</span>
        <span><b>{item.nutrition.protein}g</b> {copy.protein}</span>
        <span className={`confidence-badge confidence-${item.nutritionSource.confidence}`}>{nutritionConfidenceLabel(locale, item.nutritionSource.confidence)}</span>
      </div>
    </article>)}</div>
      : <div className="empty restaurant-empty" role="status"><span aria-hidden="true">🍽️</span><h3>{activeFilterCount > 0 ? copy.emptyFilteredTitle : copy.menuEmptyTitle}</h3><p>{activeFilterCount > 0 ? copy.emptyFilteredText : copy.menuEmptyText}</p>{activeFilterCount > 0 && <button className="random-button" onClick={() => setFilters(emptyRestaurantMenuFilters)}>{copy.clearFilters}</button>}</div>}
  </section>
}

function ExploreItemCard({ locale, item, restaurant, onOpenRestaurant, favorite, onFavorite }: { locale: Locale; item: RestaurantMenuItem; restaurant: Restaurant | undefined; onOpenRestaurant(id: string): void; favorite: boolean; onFavorite(): void }) {
  const copy = messages[locale]
  return <>
    <MenuFavoriteButton locale={locale} name={item.name[locale]} favorite={favorite} onToggle={onFavorite} />
    <div className="menu-item-copy">
      <p className="card-category">{menuCategoryLabel(locale, item.category)}</p>
      <h3>{item.name[locale]}</h3>
      {restaurant && <div className="menu-item-restaurant-line"><RestaurantIdentity restaurant={restaurant} locale={locale} size="xs" /><p className="menu-item-restaurant">{restaurant.name[locale]}</p></div>}
      {item.servingNote && <p className="menu-item-note">{item.servingNote[locale]}</p>}
      {item.customizationNotes?.length ? <ul className="menu-item-customizations">{item.customizationNotes.map((note, index) => <li key={index}>{note[locale]}</li>)}</ul> : null}
    </div>
    <div className="menu-item-nutrition">
      <span><b>{item.nutrition.kcal}</b> {copy.kcalEstimate}</span>
      <span><b>{item.nutrition.protein}g</b> {copy.protein}</span>
      <span><b>{item.nutrition.carbs}g</b> {copy.carbs}</span>
      <span><b>{item.nutrition.fat}g</b> {copy.fat}</span>
      {item.nutrition.sodium !== undefined && <span><b>{item.nutrition.sodium}mg</b> {copy.sodium}</span>}
      <span className={`confidence-badge confidence-${item.nutritionSource.confidence}`}>{nutritionConfidenceLabel(locale, item.nutritionSource.confidence)}</span>
    </div>
    {restaurant && <button className="text-button explore-view-restaurant" onClick={() => onOpenRestaurant(restaurant.id)}>{copy.viewRestaurant(restaurant.name[locale])}</button>}
  </>
}

function ExploreView({ locale, onOpenRestaurant, favoriteIds, onFavorite, storageAvailable }: { locale: Locale; onOpenRestaurant(id: string): void; favoriteIds: string[]; onFavorite(id: string): void; storageAvailable: boolean }) {
  const copy = messages[locale]
  const [filters, setFilters] = useState<RestaurantMenuFilters>(emptyRestaurantMenuFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [pickedId, setPickedId] = useState<string>()
  const [lastPickedId, setLastPickedId] = useState<string>()
  const [query, setQuery] = useState('')
  const searched = searchRestaurantMenuItems(restaurantMenuItems, restaurants, query)
  const items = filterRestaurantMenuItems(searched, filters)
  const activeFilterCount = Object.values(filters).filter(value => value !== undefined).length
  const filterLabels: Record<keyof RestaurantMenuFilters, string> = { maxKcal: copy.maxKcal, minProtein: copy.minProtein, maxCarbs: copy.maxCarbs, maxFat: copy.maxFat, maxSodium: copy.maxSodium }
  const pickedItem = items.find(item => item.id === pickedId)
  const selectedPresetId = matchingExplorePresetId(filters)
  function restaurantFor(item: RestaurantMenuItem) { return restaurants.find(candidate => candidate.id === item.restaurantId) }
  useEffect(() => { setPickedId(undefined); setLastPickedId(undefined) }, [query, filters])
  function updateNumber(field: keyof RestaurantMenuFilters, value: string) {
    setFilters(current => ({ ...current, [field]: value === '' ? undefined : Number(value) }))
  }
  function clearFilters() { setFilters(emptyRestaurantMenuFilters) }
  function clearSearch() { setQuery('') }
  function selectPreset(id: ExplorePresetId) { setFilters({ ...explorePresetFilters[id] }) }
  function pickForMe() {
    const result = chooseRandom(items, lastPickedId)
    if (result) { setLastPickedId(result.id); setPickedId(result.id) }
  }
  return <section className="content explore-view">
    <div className="restaurant-menu-nav">
      <p className="eyebrow">{copy.explore}</p>
      <button className="filter-button" onClick={() => setFiltersOpen(open => !open)} aria-pressed={filtersOpen} aria-label={copy.openFilters}><SlidersHorizontal size={17} />{activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button>
    </div>
    <div className="section-heading restaurant-heading"><div><h2>{copy.exploreTitle}</h2></div></div>
    {!storageAvailable && <p className="storage-note" role="status">{copy.restaurantFavoritesStorageNote}</p>}
    <div className="search-row">
      <label className="search"><Search size={18} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={copy.exploreSearchPlaceholder} aria-label={copy.exploreSearchPlaceholder} /></label>
      {query.trim() && <button type="button" className="explore-search-clear" aria-label={copy.clearSearch} onClick={clearSearch}><X size={16} /></button>}
    </div>
    <div className="explore-goals">
      <p className="explore-goals-label">{copy.exploreGoals}</p>
      <div className="explore-presets" role="group" aria-label={copy.exploreGoals}>
        {explorePresetIds.map(id => <button key={id} className={`explore-preset-chip ${selectedPresetId === id ? 'active' : ''}`} aria-pressed={selectedPresetId === id} onClick={() => selectPreset(id)}><b>{explorePresetLabel(locale, id)}</b><span>{explorePresetSummary(locale, id)}</span></button>)}
        {!selectedPresetId && activeFilterCount > 0 && <span className="explore-preset-custom">{copy.explorePresetCustomLabel}</span>}
      </div>
      <p className="explore-goals-disclaimer">{copy.exploreGoalsDisclaimer}</p>
    </div>
    {filtersOpen && <div className="menu-filter-panel">
      <div className="number-grid">{Object.entries(filterLabels).map(([field, label]) => <label key={field} className="field-label">{label}<input type="number" min="0" value={filters[field as keyof RestaurantMenuFilters] ?? ''} onChange={event => updateNumber(field as keyof RestaurantMenuFilters, event.target.value)} /></label>)}</div>
      {activeFilterCount > 0 && <button className="text-button" onClick={clearFilters}>{copy.clearFilters}</button>}
    </div>}
    <p className="explore-result-count">{copy.exploreMatchCount(items.length)}</p>
    <section className="menu-pick" aria-live="polite">
      <div className="menu-pick-header">
        <h3>{copy.yourPick}</h3>
        <button className="random-button" disabled={!items.length} onClick={pickForMe}><Shuffle size={17} /> {pickedItem ? copy.pickAgain : copy.pickForMe}</button>
      </div>
      {pickedItem ? <article className="menu-item-row menu-pick-card"><ExploreItemCard locale={locale} item={pickedItem} restaurant={restaurantFor(pickedItem)} onOpenRestaurant={onOpenRestaurant} favorite={favoriteIds.includes(pickedItem.id)} onFavorite={() => onFavorite(pickedItem.id)} /></article> : !items.length && <p className="menu-pick-empty">{copy.pickNoMatches}</p>}
    </section>
    {items.length ? <div className="menu-list">{items.map(item => <article className="menu-item-row" key={item.id}><ExploreItemCard locale={locale} item={item} restaurant={restaurantFor(item)} onOpenRestaurant={onOpenRestaurant} favorite={favoriteIds.includes(item.id)} onFavorite={() => onFavorite(item.id)} /></article>)}</div>
      : <div className="empty restaurant-empty" role="status"><span aria-hidden="true">🍽️</span><h3>{copy.emptyFilteredTitle}</h3><p>{copy.emptyFilteredText}</p><button className="random-button" onClick={clearFilters}>{copy.clearFilters}</button></div>}
  </section>
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

function RecipeDetail({ recipe, locale, isFavorite, isInShopping, onBack, onFavorite, onToggleShopping }: { recipe: Recipe; locale: Locale; isFavorite: boolean; isInShopping: boolean; onBack(): void; onFavorite(): void; onToggleShopping(): void }) {
  const copy = messages[locale]
  const name = recipe.name[locale]
  const favoriteLabel = isFavorite ? copy.removeFavorite(name) : copy.addFavorite(name)
  return <main className="detail"><header className="detail-nav"><button className="round-button" onClick={onBack} aria-label={copy.back}><ArrowLeft /></button><button className={`round-button ${isFavorite ? 'saved' : ''}`} onClick={onFavorite} aria-label={favoriteLabel} aria-pressed={isFavorite}><Heart fill={isFavorite ? 'currentColor' : 'none'} /></button></header><div className={`detail-art ${recipe.accent}`}><RecipeImage recipe={recipe} variant="detail" locale={locale} /></div><section className="detail-content"><p className="eyebrow">{recipe.cuisine[locale]} · {categoryLabel(locale, recipe.category)}</p><h1>{name}</h1><p className="detail-english">{recipe.name[otherLocale(locale)]}</p><div className="facts"><span><Clock3 size={17} /> {copy.prep} {recipe.prepMinutes} min</span><span>{copy.cook} {recipe.cookMinutes} min</span><span>{copy.serves} {recipe.servings}</span></div><div className="nutrition-card"><div><b>{recipe.nutrition.kcal}</b><span>kcal</span></div><div><b>{recipe.nutrition.protein}g</b><span>{copy.protein}</span></div><div><b>{recipe.nutrition.carbs}g</b><span>{copy.carbs}</span></div><div><b>{recipe.nutrition.fat}g</b><span>{copy.fat}</span></div></div><button className={`shopping-action ${isInShopping ? 'added' : ''}`} onClick={onToggleShopping} aria-pressed={isInShopping}>{isInShopping ? copy.shoppingAdded : copy.shoppingAdd}</button><p className="estimate-note">{copy.estimatedNote}</p><div className="detail-section"><h2>{copy.ingredients}</h2>{recipe.ingredients.map((ingredient, index) => <div className="ingredient" key={index}><span>{ingredient.item[locale]}</span><b>{formatIngredientAmount(ingredient, locale)}</b></div>)}</div><div className="detail-section"><h2>{copy.method}</h2>{recipe.instructions.map((step, index) => <div className="step" key={index}><span>{index + 1}</span><p>{step[locale]}</p></div>)}</div></section></main>
}

function EmptyState({ locale, favorites, hasSavedRecipes, hasFilters, onClear }: { locale: Locale; favorites: boolean; hasSavedRecipes: boolean; hasFilters: boolean; onClear(): void }) {
  const copy = messages[locale]
  const filteredFavorites = favorites && hasSavedRecipes
  return <div className="empty"><span>{favorites ? '♡' : '⌕'}</span><h3>{filteredFavorites ? copy.emptyFavoriteFilteredTitle : favorites ? copy.emptyFavoritesTitle : copy.emptyFilteredTitle}</h3><p>{filteredFavorites ? copy.emptyFavoriteFilteredText : favorites ? copy.emptyFavoritesText : copy.emptyFilteredText}</p>{hasFilters && <button className="random-button" onClick={onClear}>{copy.clearFilters}</button>}</div>
}

export default App
