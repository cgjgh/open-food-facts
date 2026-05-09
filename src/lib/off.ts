import { OpenFoodFacts } from "@openfoodfacts/openfoodfacts-nodejs";

// Initialize the clients
export const offClient = new OpenFoodFacts(globalThis.fetch);
export const obfClient = new OpenFoodFacts(globalThis.fetch, { 
  type: "OBF" as NonNullable<ConstructorParameters<typeof OpenFoodFacts>[1]>["type"] 
});

/**
 * Fetches a product from Open Food Facts first, 
 * then falls back to Open Beauty Facts if not found.
 */
export async function fetchProduct(barcode: string) {
  // Try OFF first
  const foodResult = await offClient.getProductV3(barcode);
  
  if (foodResult.data?.status === "success" || foodResult.data?.status === "success_with_warnings") {
    return { ...foodResult, type: "food" as const };
  }

  // Fallback to OBF
  const beautyResult = await obfClient.getProductV3(barcode);
  if (beautyResult.data?.status === "success" || beautyResult.data?.status === "success_with_warnings") {
    return { ...beautyResult, type: "beauty" as const };
  }

  return { ...foodResult, type: "food" as const }; // Return original error if both fail
}
