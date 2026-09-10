import { recipes } from './recipes'

export type RecipeImageManifestEntry = {
  id: string
  nameTh: string
  nameEn: string
  image: string
  cuisine: string
  category: string
  visualBrief: string
  prompt: string
}

/**
 * The locked visual language used by every generated recipe image.
 * Keeping this in source makes the generation brief reviewable and repeatable.
 */
export const globalImageArtDirection = 'Realistic healthy food photography, natural believable home cooking, single serving, approximately 45-degree angle slightly above the dish, consistent square framing, soft natural daylight with gentle shadows, clean warm white or pale wood tabletop, simple off-white ceramic plate or bowl, modern meal-prep aesthetic, realistic portions, no text, logos, packaging, watermark, hands, people, duplicate plates, covering cutlery, surreal ingredients, or unrelated side dishes.'

const presentationById: Record<string, string> = {
  'tom-yum-prawns': 'clear Thai tom yum broth in a simple bowl with peeled prawns, mushrooms, tomatoes and lemongrass',
  'glass-noodle-seafood-salad': 'Thai glass noodle seafood salad in a wide bowl with prawns, squid, tomato, onion and celery',
  'tofu-mince-soup': 'clear Chinese cabbage soup in a bowl with small pork meatballs and cubes of tofu',
  'herb-grilled-chicken': 'sliced herb-grilled chicken with steamed broccoli, carrot and a neat portion of brown rice on a plate',
  'cold-soba-edamame': 'chilled buckwheat soba noodles with edamame, cucumber ribbons and carrot in a Japanese bowl',
  'salmon-teriyaki-bowl': 'teriyaki-glazed salmon with brown rice and bright steamed broccoli in a Japanese rice bowl',
  'veggie-bibimbap': 'Korean bibimbap bowl with brown rice, separate colorful vegetables and a fried egg',
  'mango-vietnamese-salad': 'fresh Vietnamese green mango, cucumber, mint and coriander salad in a wide bowl with peanuts',
  'steamed-lime-seabass': 'steamed lime sea bass fillet with garlic, chilli, celery and jasmine rice on a Thai plate',
  'prawn-rice-congee': 'warm ginger prawn rice congee in a ceramic bowl with mushrooms and spring onion',
  'gazpacho-chickpea': 'chilled red gazpacho in a bowl topped with a modest spoonful of chickpeas and herbs',
  'salmon-poke-bowl': 'Hawaiian salmon poke bowl with chilled salmon cubes, brown rice, edamame, cucumber and avocado',
  'grilled-mackerel-bowl': 'grilled mackerel with brown rice, green beans and lemon on a Japanese plate',
  'broccoli-prawn-stirfry': 'Chinese-style broccoli and prawn stir-fry with garlic served beside brown rice',
  'fruit-yogurt-bowl': 'plain Greek yogurt bowl with mixed fruit, oats, chia seeds and a light cinnamon dusting',
  'grilled-chicken-jaew': 'sliced Thai grilled chicken with brown rice, cucumber and a small bowl of jaew dipping sauce',
  'chicken-basil-rice-egg': 'Thai holy basil chicken over jasmine rice with one fried egg and sliced long beans',
  'chicken-larb-brown-rice': 'Thai chicken larb with herbs, shallot and cabbage alongside brown rice',
  'spicy-tuna-salad': 'Thai spicy tuna salad with romaine, cucumber, tomato, onion and chilli in a wide bowl',
  'grilled-tilapia-herb-salad': 'grilled tilapia fillet with fresh mint-coriander herb salad, cucumber, tomatoes and rice',
  'chicken-tom-yum-mushrooms': 'clear chicken tom yum soup with sliced chicken, torn oyster mushrooms, tomato and herbs',
  'shrimp-lemongrass-salad': 'Thai shrimp and lemongrass salad with cucumber, mint and peanuts in a broad bowl',
  'lean-pork-pepper-rice': 'lean pork and bell pepper pepper-rice plate with jasmine rice and spring onion',
  'chicken-green-curry-brown-rice': 'Thai green curry with sliced chicken and eggplant in a bowl beside brown rice',
  'pumpkin-egg-stir-fry': 'Thai pumpkin and egg stir-fry with tofu, basil and spring onion on a simple plate',
  'chicken-vegetable-sukiyaki': 'Japanese-style chicken and vegetable sukiyaki hot pot with glass noodles, cabbage and mushrooms',
  'spicy-grilled-pork-salad': 'Thai spicy grilled pork salad with mint, shallot, cabbage and toasted rice powder',
  'chili-lime-chicken-brown-rice': 'sliced chili-lime chicken with brown rice, green beans and coriander',
  'thai-vegetable-omelet': 'Thai vegetable omelet with mushrooms and tomato served with brown rice',
  'tofu-basil-stir-fry': 'Thai tofu basil stir-fry with long beans and chilli served over jasmine rice',
  'chicken-teriyaki-rice-bowl': 'Japanese chicken teriyaki rice bowl with broccoli, carrot ribbons and sesame',
  'lean-beef-bibimbap': 'Korean lean beef bibimbap with brown rice, spinach, carrot, bean sprouts and egg',
  'chicken-soba-bowl': 'Japanese chicken soba bowl with cucumber, edamame and spring onion',
  'salmon-soba-salad': 'chilled salmon soba salad with cucumber ribbons, edamame and sesame',
  'korean-chicken-lettuce-wraps': 'Korean chicken lettuce wraps with butter lettuce cups, carrot, cucumber, rice and gochujang',
  'tuna-onigiri-plate': 'Japanese tuna onigiri triangles with nori, cucumber and edamame on a plate',
  'miso-salmon-vegetables': 'miso-glazed salmon with roasted sweet potato, broccoli and sesame on a tray-style plate',
  'tofu-mushroom-rice-bowl': 'Japanese tofu mushroom rice bowl with shiitake, bok choy, brown rice and sesame',
  'tofu-egg-donburi': 'Japanese tofu and softly set egg donburi spooned over brown rice with spinach',
  'korean-tofu-glass-noodles': 'Korean tofu glass noodles with spinach, carrot and shiitake mushrooms',
  'grilled-chicken-caesar-salad': 'grilled chicken Caesar salad with romaine, whole-wheat croutons, parmesan and yogurt dressing',
  'chicken-avocado-wrap': 'whole-wheat chicken avocado wrap cut in half with lettuce and tomato visible',
  'tuna-whole-wheat-sandwich': 'whole-wheat tuna sandwich cut in half with lettuce, cucumber and celery filling',
  'shrimp-tomato-pasta': 'whole-wheat spaghetti with shrimp, tomato sauce, spinach, chilli and basil',
  'chicken-pesto-pasta': 'whole-wheat penne with chicken, pesto, cherry tomatoes, spinach and parmesan',
  'lean-beef-burrito-bowl': 'Mexican-inspired burrito bowl with lean beef, brown rice, black beans, corn, salsa and avocado',
  'mediterranean-chicken-bowl': 'Mediterranean chicken quinoa bowl with cucumber, cherry tomato, chickpeas and yogurt sauce',
  'chickpea-mediterranean-salad': 'Mediterranean chickpea salad with cucumber, tomato, red onion and feta',
  'pumpkin-soup-with-egg': 'smooth pumpkin soup in a bowl with halved boiled egg, yogurt and pumpkin seeds',
  'egg-avocado-toast': 'whole-wheat avocado toast topped with eggs, cherry tomatoes and pumpkin seeds'
}

const format = (entry: typeof recipes[number]) => presentationById[entry.id] ?? `${entry.name.en} plated as a single-serving healthy meal`

export const recipeImageManifest: RecipeImageManifestEntry[] = recipes.map(recipe => {
  const ingredients = recipe.ingredients.slice(0, 6).map(ingredient => ingredient.item.en.toLowerCase()).join(', ')
  const visualBrief = `${format(recipe)}; key ingredients: ${ingredients}.`
  return {
    id: recipe.id,
    nameTh: recipe.name.th,
    nameEn: recipe.name.en,
    image: recipe.image,
    cuisine: recipe.cuisine.en,
    category: recipe.category,
    visualBrief,
    prompt: `${globalImageArtDirection} Dish: ${recipe.name.en}. ${visualBrief}`
  }
})

export const recipeImageManifestIds = recipeImageManifest.map(entry => entry.id)
