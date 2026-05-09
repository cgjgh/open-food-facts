"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_CONFIG } from "@/lib/ai-config";

export async function getProductAIInsights(productData: {
  name: string;
  brands?: string;
  ingredients?: string;
  nutrition?: Record<string, unknown> | string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "Gemini API key is not configured." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: AI_CONFIG.model,
      generationConfig: {
        ...AI_CONFIG.generationConfig,
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      You are a professional dietitian and food scientist. 
      Analyze the following food product and provide structured insights in JSON format.
      
      Product Name: ${productData.name}
      Brands: ${productData.brands || "Unknown"}
      Ingredients: ${productData.ingredients || "Not provided"}
      Nutrition Data: ${JSON.stringify(productData.nutrition || {})}

      The JSON output should have the following structure:
      {
        "dietitians_view": "A concise, human-friendly summary (2-3 sentences) of the product's health impact.",
        "ingredient_analysis": [
          {
            "name": "Name of a complex or noteworthy ingredient",
            "explanation": "Simple explanation of what it is and its health impact."
          }
        ],
        "additives_to_avoid": [
          {
            "name": "Additive name or code",
            "risk": "Why it should be avoided or limited."
          }
        ],
        "healthy_swaps": [
          {
            "name": "A healthier alternative product or category",
            "reason": "Why it is a better choice."
          }
        ]
      }

      Focus on being accurate, helpful, and easy to understand. If information is missing, do your best with what's available.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("AI Insight Error:", errorMessage);
    return { error: `Failed to generate AI insights: ${errorMessage}` };
  }
}

export async function getEvaluationDetail(productName: string, evaluationTitle: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "Gemini API key is not configured." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: AI_CONFIG.model,
      generationConfig: AI_CONFIG.generationConfig
    });

    const prompt = `
      You are a professional dietitian. Explain why "${evaluationTitle}" is listed as an evaluation point for the product "${productName}".
      
      Provide a detailed but concise explanation (3-4 sentences) that covers:
      1. What this evaluation point means for the user's health.
      2. Any specific risks or benefits associated with it.
      3. A practical tip for managing this in their diet.

      Keep the tone helpful and professional.
    `;

    const result = await model.generateContent(prompt);
    return { text: result.response.text() };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("AI Evaluation Detail Error:", errorMessage);
    return { error: `Failed to get details: ${errorMessage}` };
  }
}
