# Correction image prompts and visual QA

Built-in image generation mode, one image per call. Final files: `public/recipes/<recipe-id>.webp`, converted to 1024×1024 WebP quality 85 without content edits. Original generated PNGs remain outside the repository under the Codex generated-images directory. Existing production paths were intentionally replaced; no recipe ID/path changes.

All 19 generated images were visually inspected against final recipe ingredients and cooking form before format conversion. The final WebPs preserve those compositions. Each passed the defining-component check below. This is visual fidelity QA, not a claim of exact food-weight measurement from photographs.

The first 16 required images were regenerated; shrimp quick pickles and chicken tostadas were regenerated because their recipes were transformed. Dakgalbi was additionally regenerated after inspecting its old photograph: it contained unlisted mushrooms/pepper and large potato pieces, with no visible rice. The existing beef japchae photograph was retained: lean beef, translucent noodles, spinach, carrot, mushrooms and sesame remain compatible with the corrected sweet-savory treatment.

## thai-steamed-salmon-chilli-lime

Final: `public/recipes/thai-steamed-salmon-chilli-lime.webp`

Visual QA: PASS — Steamed salmon, garlic/chilli sauce, Chinese celery and jasmine rice are visible.

Prompt:

> Use case: photorealistic-natural. Square GoodFood recipe photograph. Healthy home cooking, single serving, 45-degree view, soft daylight, neutral tabletop, off-white plate, realistic modest portions. 140 g steamed salmon, light lime-fish-sauce dressing with garlic and red chilli, Chinese celery and half cup cooked jasmine rice alongside. No cabbage, lettuce, broccoli, coriander, extra sides, people, hands, text, logos or watermark.

## thai-egg-fried-rice-prawns

Final: `public/recipes/thai-egg-fried-rice-prawns.webp`

Visual QA: PASS — Brown-rice fried rice with clearly visible scrambled egg curds, peeled prawns, green peas, diced carrot, spring onion. No white rice.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Brown-rice fried rice with clearly visible scrambled egg curds, peeled prawns, green peas, diced carrot, spring onion. No white rice. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## thai-green-curry-white-fish

Final: `public/recipes/thai-green-curry-white-fish.webp`

Visual QA: PASS — Light green coconut curry with white fish chunks, green beans and red bell pepper. Half cup jasmine rice alongside. No broccoli, eggplant or chicken.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Light green coconut curry with white fish chunks, green beans and red bell pepper. Half cup jasmine rice alongside. No broccoli, eggplant or chicken. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## japanese-beef-tofu-sukiyaki

Final: `public/recipes/japanese-beef-tofu-sukiyaki.webp`

Visual QA: PASS — Japanese-style sukiyaki shallow bowl: thin lean beef, tofu cubes, napa cabbage, sliced mushrooms, visible thin translucent glass noodles, spring onion, modest amount brown sweet soy cooking liquid. Half cup brown rice alongside. No thick udon, no red Thai dipping sauce.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Japanese-style sukiyaki shallow bowl: thin lean beef, tofu cubes, napa cabbage, sliced mushrooms, visible thin translucent glass noodles, spring onion, modest amount brown sweet soy cooking liquid. Half cup brown rice alongside. No thick udon, no red Thai dipping sauce. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## japanese-chicken-miso-ginger-bowl

Final: `public/recipes/japanese-chicken-miso-ginger-bowl.webp`

Visual QA: PASS — Miso-ginger glazed browned chicken thigh slices, shredded cabbage and julienned carrot, sesame seeds, half cup brown rice. No broccoli.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Miso-ginger glazed browned chicken thigh slices, shredded cabbage and julienned carrot, sesame seeds, half cup brown rice. No broccoli. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## japanese-soba-mushroom-soup

Final: `public/recipes/japanese-soba-mushroom-soup.webp`

Visual QA: PASS — Soba mushroom soup: visible grey-brown thin buckwheat noodles, sliced mushrooms, tofu cubes, spinach, julienned ginger and spring onion in clear vegetable broth. No egg or meat.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Soba mushroom soup: visible grey-brown thin buckwheat noodles, sliced mushrooms, tofu cubes, spinach, julienned ginger and spring onion in clear vegetable broth. No egg or meat. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## japanese-eggplant-miso-donburi

Final: `public/recipes/japanese-eggplant-miso-donburi.webp`

Visual QA: PASS — Brown rice donburi with browned miso-glazed eggplant slices and clearly visible golden tofu cubes, spring onion and sesame seeds. No edamame.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Brown rice donburi with browned miso-glazed eggplant slices and clearly visible golden tofu cubes, spring onion and sesame seeds. No edamame. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## japanese-tamago-edamame-rice

Final: `public/recipes/japanese-tamago-edamame-rice.webp`

Visual QA: PASS — Moist sushi rice folded with softly set scrambled egg, green edamame and spinach, sesame seeds and thin nori strips. No rolled omelet, no broth or fried egg.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Moist sushi rice folded with softly set scrambled egg, green edamame and spinach, sesame seeds and thin nori strips. No rolled omelet, no broth or fried egg. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## japanese-tuna-miso-lettuce-bowl

Final: `public/recipes/japanese-tuna-miso-lettuce-bowl.webp`

Visual QA: PASS — Chilled bowl with half cup brown rice, miso-dressed flaked tuna, clearly visible shredded lettuce, sliced cucumber and avocado, sesame seeds and nori strips. No salmon.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Chilled bowl with half cup brown rice, miso-dressed flaked tuna, clearly visible shredded lettuce, sliced cucumber and avocado, sesame seeds and nori strips. No salmon. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## korean-tofu-kimchi-lettuce-wraps

Final: `public/recipes/korean-tofu-kimchi-lettuce-wraps.webp`

Visual QA: PASS — Six butter lettuce wraps with browned sliced tofu, vegan kimchi, brown rice, cucumber matchsticks and sesame. Rice visible inside wraps. No meat.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Six butter lettuce wraps with browned sliced tofu, vegan kimchi, brown rice, cucumber matchsticks and sesame. Rice visible inside wraps. No meat. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## korean-egg-tofu-stew

Final: `public/recipes/korean-egg-tofu-stew.webp`

Visual QA: PASS — Korean lightly red vegetable broth stew with tofu cubes, sliced zucchini and mushrooms, one gently poached egg with fully set white, spring onion. Half cup brown rice alongside. No kimchi, meat or red pepper slices.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Korean lightly red vegetable broth stew with tofu cubes, sliced zucchini and mushrooms, one gently poached egg with fully set white, spring onion. Half cup brown rice alongside. No kimchi, meat or red pepper slices. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## chinese-steamed-tofu-egg-custard

Final: `public/recipes/chinese-steamed-tofu-egg-custard.webp`

Visual QA: PASS — Small shallow bowl of softly set steamed egg custard, tofu cubes and sliced mushrooms embedded in custard, spring onion and sesame garnish. Half cup brown rice alongside. No spinach, no fried egg, no soup.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Small shallow bowl of softly set steamed egg custard, tofu cubes and sliced mushrooms embedded in custard, spring onion and sesame garnish. Half cup brown rice alongside. No spinach, no fried egg, no soup. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## chinese-prawn-egg-drop-soup

Final: `public/recipes/chinese-prawn-egg-drop-soup.webp`

Visual QA: PASS — Clear prawn egg-drop soup with delicate egg ribbons, peeled prawns, sliced mushrooms and yellow corn kernels, ginger strips and spring onion. Half cup brown rice alongside. No tofu or leafy spinach.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Clear prawn egg-drop soup with delicate egg ribbons, peeled prawns, sliced mushrooms and yellow corn kernels, ginger strips and spring onion. Half cup brown rice alongside. No tofu or leafy spinach. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## chinese-chickpea-lettuce-cups

Final: `public/recipes/chinese-chickpea-lettuce-cups.webp`

Visual QA: PASS — Six butter lettuce cups filled with chickpeas, finely chopped browned mushrooms and diced bell pepper over visible brown rice, sesame seeds. No chicken, no raw tomato.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Six butter lettuce cups filled with chickpeas, finely chopped browned mushrooms and diced bell pepper over visible brown rice, sesame seeds. No chicken, no raw tomato. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## vietnamese-caramel-pork

Final: `public/recipes/vietnamese-caramel-pork.webp`

Visual QA: PASS — Vietnamese caramel-glazed thin lean pork loin pieces, minimal visible fat and no layered belly cubes; steamed bok choy, sliced cucumber, half cup brown rice. No thick pork belly.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Vietnamese caramel-glazed thin lean pork loin pieces, minimal visible fat and no layered belly cubes; steamed bok choy, sliced cucumber, half cup brown rice. No thick pork belly. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## vietnamese-tomato-tofu-braise

Final: `public/recipes/vietnamese-tomato-tofu-braise.webp`

Visual QA: PASS — Vietnamese tomato tofu braise: tofu cubes coated in chunky cooked red tomato and onion sauce, visibly wilted spinach, half cup brown rice. No bell pepper or broccoli.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Vietnamese tomato tofu braise: tofu cubes coated in chunky cooked red tomato and onion sauce, visibly wilted spinach, half cup brown rice. No bell pepper or broccoli. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## vietnamese-shrimp-lemongrass-rice

Final: `public/recipes/vietnamese-shrimp-lemongrass-rice.webp`

Visual QA: PASS — Lemongrass seared peeled shrimp with half cup jasmine rice, cucumber slices, mint and coriander, a clear serving of quick-pickled julienned carrot and white daikon, small chilli-lime dressing cup. No chicken.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: Lemongrass seared peeled shrimp with half cup jasmine rice, cucumber slices, mint and coriander, a clear serving of quick-pickled julienned carrot and white daikon, small chilli-lime dressing cup. No chicken. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## mexican-chicken-bean-tortilla

Final: `public/recipes/mexican-chicken-bean-tortilla.webp`

Visual QA: PASS — One flat crisp whole-wheat tostada, open-faced and NOT folded, spread with mashed black beans, cooked onion and bell pepper, topped with chopped browned chicken and red tomato salsa and fresh coriander. No avocado, no yogurt, no lettuce, no wrap.

Prompt:

> Use case: photorealistic-natural. Asset type: GoodFood recipe photo. Generate one square photograph, realistic healthy home cooking, single serving, approximately 45-degree view, soft daylight, neutral tabletop, off-white ceramic plateware, realistic modest portions. Subject: One flat crisp whole-wheat tostada, open-faced and NOT folded, spread with mashed black beans, cooked onion and bell pepper, topped with chopped browned chicken and red tomato salsa and fresh coriander. No avocado, no yogurt, no lettuce, no wrap. Constraints: only the listed dish components; no text, logos, watermark, people, hands or unrelated dishes.

## korean-chicken-dakgalbi

Final: `public/recipes/korean-chicken-dakgalbi.webp`

Visual QA: PASS — Chicken, cabbage, small sweet-potato cubes, sesame and brown rice; no unlisted mushrooms or peppers.

Prompt:

> Use case: photorealistic-natural. GoodFood square recipe photo. Realistic healthy home cooking, single serving, 45-degree view, soft daylight, neutral tabletop, off-white ceramic plate. Korean dakgalbi: browned boneless skinless chicken pieces, cabbage and SMALL 1 cm sweet potato cubes in red gochujang coating, sesame seeds, half cup cooked brown rice visibly alongside. Only those ingredients visible. No mushrooms, bell peppers, spring onions, large potato wedges, text, people, hands, logos or watermark.
