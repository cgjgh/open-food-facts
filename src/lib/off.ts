import { OpenFoodFacts } from "@openfoodfacts/openfoodfacts-nodejs";

// Initialize the Open Food Facts client
// In Node.js environment, we use the global fetch
export const offClient = new OpenFoodFacts(globalThis.fetch);
