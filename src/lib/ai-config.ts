/**
 * AI Configuration for the Open Food Facts project.
 * Update the model name here to change it globally across the application.
 */
export const AI_CONFIG = {
  // The Gemini model to use for analysis and insights
  // Recommended: "gemini-1.5-flash", "gemini-1.5-pro", or "gemini-3.1-flash-lite"
  model: "gemini-3.1-flash-lite",
  
  // Default generation settings
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
  }
};
