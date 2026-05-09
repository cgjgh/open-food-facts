# 🤖 AI Documentation

The Open Food Facts project leverages Google's Gemini AI to provide users with deep nutritional insights and interactive health data.

## 🏗️ Architecture

The AI system is built using a client-server architecture with Next.js Server Actions:

1.  **Client-Side Components**: 
    - `AIInsights`: Displays the high-level dietitian's view, ingredient decoding, and additives to avoid.
    - `EvaluationList`: An interactive list of product pros/cons that triggers AI deep-dives.
    - `EvaluationDetailDialog`: A modal that fetches specific AI explanations for a given metric.
2.  **Server-Side Actions**:
    - `getProductAIInsights`: Generates a structured JSON summary of the product.
    - `getEvaluationDetail`: Generates a detailed explanation for a specific evaluation point.
3.  **Configuration**:
    - `src/lib/ai-config.ts`: Central location to manage the AI model ID and generation settings.

## ⚙️ Configuration

### Global Config (`src/lib/ai-config.ts`)

You can globally change the AI model or tweak generation parameters here:

```typescript
export const AI_CONFIG = {
  model: "gemini-3.1-flash-lite", // Change this to switch models
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
  }
};
```

### Environment Variables

The project requires a valid Gemini API Key:
- `GEMINI_API_KEY`: Set this in your `.env.local` file.

## 🚀 Features

### 1. Smart Nutritional Insights
The AI analyzes product data (ingredients, nutrition facts) to provide:
- **Dietitian's Perspective**: A human-friendly health summary.
- **Ingredient Decoder**: Plain-language explanations for complex ingredients.
- **Additives to Avoid**: Highlighted list of potentially harmful additives with risk explanations.
- **Healthy Swaps**: Evidence-based alternatives to current product choices.

### 2. Interactive Evaluation
Every positive or negative attribute of a product (e.g., "High in sugar", "Low saturated fat") is interactive. 
- **Tapping** any evaluation item triggers the `getEvaluationDetail` action.
- The AI explains **why** that metric matters for health and provides a **practical tip**.

## 🛠️ Development Guidelines

- **Always use `AI_CONFIG`**: Do not hardcode model IDs in server actions.
- **Handle Errors Gracefully**: Use the built-in loading and error states in UI components.
- **Structured JSON**: `getProductAIInsights` uses JSON mode. Ensure the prompt stays in sync with the expected UI data structure.

---
*Powered by Google Gemini AI*
