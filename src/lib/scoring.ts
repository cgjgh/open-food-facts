export type ScoreCategory = "excellent" | "good" | "mediocre" | "poor" | "bad";

export interface ScoreResult {
  score: number;
  category: ScoreCategory;
  color: string;
  label: string;
}

export interface AttributeReason {
  id: string;
  type: "positive" | "negative" | "warning";
  title: string;
  value?: string;
}

export interface OffProduct {
  product_name?: string;
  brands?: string;
  image_front_url?: string;
  ingredients_text?: string;
  quantity?: string;
  nutriscore_grade?: string;
  nutrition_grades?: string;
  nutrition_grade_fr?: string;
  additives_n?: number;
  nova_group?: number;
  ecoscore_grade?: string;
  nutrient_levels?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nutriments?: Record<string, any>;
  product_type?: "food" | "beauty";
  ingredients_analysis_tags?: string[];
}

/**
 * Extracts and normalizes the Nutri-Score grade from various product fields.
 * 
 * @param product - The product data from Open Food Facts API.
 * @returns The normalized grade (a-e) or undefined if not found or invalid.
 */
export function getValidNutriscore(product: OffProduct): string | undefined {
  const grade = product.nutriscore_grade || product.nutrition_grades || product.nutrition_grade_fr;
  if (!grade) return undefined;
  const lower = grade.toLowerCase();
  if (lower === 'unknown' || lower === 'not-applicable' || lower === 'null') {
    return undefined;
  }
  return lower;
}

/**
 * Calculates a custom 0-100 health score inspired by Yuka's methodology.
 * 
 * The score is weighted as follows:
 * - 60%: Nutri-Score
 * - 30%: Additive penalties
 * - 10%: NOVA group penalties & Eco-Score bonuses
 * 
 * @param product - The product data from Open Food Facts API.
 * @returns A ScoreResult object containing the numeric score, category, color, and label.
 */
export function calculateYukaScore(product: OffProduct): ScoreResult {
  let baseScore = 50;

  const validNutriScore = getValidNutriscore(product);

  // 1. Nutri-Score Base (represents ~60% of Yuka's score)
  if (validNutriScore) {
    switch (validNutriScore) {
      case 'a': baseScore = 90; break;
      case 'b': baseScore = 75; break;
      case 'c': baseScore = 55; break;
      case 'd': baseScore = 35; break;
      case 'e': baseScore = 15; break;
    }
  } else {
    // Fallback: estimate base score from nutrient levels if available
    const levels = product.nutrient_levels || {};
    let penalty = 0;
    
    const checkLevel = (level?: string) => {
      if (level === 'high') penalty += 15;
      else if (level === 'moderate') penalty += 5;
      else if (level === 'low') penalty -= 5;
    };

    checkLevel(levels.fat);
    checkLevel(levels['saturated-fat']);
    checkLevel(levels.sugars);
    checkLevel(levels.salt);

    baseScore = 70 - penalty; // start at 70 (approx B), subtract penalties
  }

  // 2. Additives Penalties (represents ~30% of Yuka's score)
  const additivesCount = product.additives_n || 0;
  baseScore -= additivesCount * 5; 

  // 3. Nova Group (Process level)
  const nova = product.nova_group;
  if (nova === 4) {
    baseScore -= 15;
  } else if (nova === 3) {
    baseScore -= 5;
  } else if (nova === 1) {
    baseScore += 5;
  }

  // 4. Eco-Score Bonus
  if (product.ecoscore_grade?.toLowerCase() === 'a') {
    baseScore += 5;
  }

  // Clamp between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(baseScore)));

  // Determine Category & Color
  if (finalScore >= 75) {
    return { score: finalScore, category: "excellent", color: "text-emerald-500", label: "Excellent" };
  } else if (finalScore >= 50) {
    return { score: finalScore, category: "good", color: "text-green-500", label: "Good" };
  } else if (finalScore >= 25) {
    return { score: finalScore, category: "poor", color: "text-orange-500", label: "Poor" };
  } else {
    return { score: finalScore, category: "bad", color: "text-red-500", label: "Bad" };
  }
}

/**
 * Analyzes a product and returns a list of positive and negative attributes
 * explaining the calculated score.
 * 
 * @param product - The product data from Open Food Facts API.
 * @returns An object containing arrays of positive and negative AttributeReason.
 */
export function getScoringReasons(product: OffProduct): { positives: AttributeReason[], negatives: AttributeReason[] } {
  const positives: AttributeReason[] = [];
  const negatives: AttributeReason[] = [];

  const levels = product.nutrient_levels || {};

  // -- FAT --
  if (levels.fat === 'low') {
    positives.push({ id: 'fat-low', type: 'positive', title: 'Low fat', value: `${product.nutriments?.fat_100g || 0}g` });
  } else if (levels.fat === 'high') {
    negatives.push({ id: 'fat-high', type: 'negative', title: 'High fat', value: `${product.nutriments?.fat_100g || 0}g` });
  } else if (levels.fat === 'moderate') {
    negatives.push({ id: 'fat-mod', type: 'warning', title: 'Moderate fat', value: `${product.nutriments?.fat_100g || 0}g` });
  }

  // -- SATURATED FAT --
  if (levels['saturated-fat'] === 'low') {
    positives.push({ id: 'satfat-low', type: 'positive', title: 'Low saturated fat', value: `${product.nutriments?.['saturated-fat_100g'] || 0}g` });
  } else if (levels['saturated-fat'] === 'high') {
    negatives.push({ id: 'satfat-high', type: 'negative', title: 'High saturated fat', value: `${product.nutriments?.['saturated-fat_100g'] || 0}g` });
  } else if (levels['saturated-fat'] === 'moderate') {
    negatives.push({ id: 'satfat-mod', type: 'warning', title: 'Moderate saturated fat', value: `${product.nutriments?.['saturated-fat_100g'] || 0}g` });
  }

  // -- SUGAR --
  if (levels.sugars === 'low') {
    positives.push({ id: 'sugar-low', type: 'positive', title: 'Low sugar', value: `${product.nutriments?.sugars_100g || 0}g` });
  } else if (levels.sugars === 'high') {
    negatives.push({ id: 'sugar-high', type: 'negative', title: 'High sugar', value: `${product.nutriments?.sugars_100g || 0}g` });
  } else if (levels.sugars === 'moderate') {
    negatives.push({ id: 'sugar-mod', type: 'warning', title: 'Moderate sugar', value: `${product.nutriments?.sugars_100g || 0}g` });
  }

  // -- SALT --
  if (levels.salt === 'low') {
    positives.push({ id: 'salt-low', type: 'positive', title: 'Low salt', value: `${product.nutriments?.salt_100g || 0}g` });
  } else if (levels.salt === 'high') {
    negatives.push({ id: 'salt-high', type: 'negative', title: 'High salt', value: `${product.nutriments?.salt_100g || 0}g` });
  } else if (levels.salt === 'moderate') {
    negatives.push({ id: 'salt-mod', type: 'warning', title: 'Moderate salt', value: `${product.nutriments?.salt_100g || 0}g` });
  }

  // -- ADDITIVES --
  const additivesCount = product.additives_n || 0;
  if (additivesCount === 0) {
    positives.push({ id: 'additives-0', type: 'positive', title: 'No additives', value: '0' });
  } else {
    negatives.push({ 
      id: 'additives-n', 
      type: additivesCount > 3 ? 'negative' : 'warning', 
      title: 'Additives to avoid', 
      value: `${additivesCount} additive${additivesCount > 1 ? 's' : ''}` 
    });
  }

  // -- NOVA GROUP (Processing) --
  const nova = product.nova_group;
  if (nova === 1) {
    positives.push({ id: 'nova-1', type: 'positive', title: 'Unprocessed food', value: 'NOVA 1' });
  } else if (nova === 4) {
    negatives.push({ id: 'nova-4', type: 'negative', title: 'Ultra-processed food', value: 'NOVA 4' });
  }

  // -- FIBER & PROTEINS (If they have significant amounts) --
  // Open Food Facts nutrient levels doesn't explicitly flag proteins/fiber as high/low, but we can do a simple heuristic
  const fiber = product.nutriments?.fiber_100g;
  if (fiber && fiber > 3.5) {
    positives.push({ id: 'fiber-high', type: 'positive', title: 'Excellent fiber', value: `${fiber}g` });
  }
  
  const proteins = product.nutriments?.proteins_100g;
  if (proteins && proteins > 8) {
    positives.push({ id: 'protein-high', type: 'positive', title: 'Excellent protein', value: `${proteins}g` });
  }

  // -- INGREDIENT ANALYSIS (Vegan, Palm Oil, etc.) --
  if (product.ingredients_analysis_tags) {
    product.ingredients_analysis_tags.forEach(tag => {
      if (tag === 'en:palm-oil-free') {
        positives.push({ id: 'palm-oil-free', type: 'positive', title: 'Palm oil free' });
      } else if (tag === 'en:vegan') {
        positives.push({ id: 'vegan', type: 'positive', title: 'Vegan' });
      } else if (tag === 'en:vegetarian') {
        positives.push({ id: 'vegetarian', type: 'positive', title: 'Vegetarian' });
      } else if (tag === 'en:palm-oil') {
        negatives.push({ id: 'palm-oil', type: 'warning', title: 'Contains palm oil' });
      }
    });
  }

  return { positives, negatives };
}
