# 🔑 Gemini API Setup Guide

This guide explains how to configure Google Gemini AI for the Open Food Facts project. This API powers the "AI Smart Insights" feature on product pages.

## 1. Obtain your API Key

1.  Go to the [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google Account.
3.  Click on **"Get API key"** in the sidebar.
4.  Click **"Create API key"**. You can choose to create it in a new Google Cloud project or an existing one.
5.  **Copy the API Key.** Store it securely.

## 2. Configure Local Environment

To use the AI features during development, you need to set the `GEMINI_API_KEY` environment variable.

1.  In the root of the project, create a file named `.env.local` (if it doesn't already exist).
2.  Add the following line to the file:
    ```bash
    GEMINI_API_KEY=your_actual_api_key_here
    ```
3.  Restart your development server:
    ```bash
    npm run dev
    ```

## 3. Production Configuration

When deploying (e.g., to Vercel, Netlify, or a VPS), you must set the `GEMINI_API_KEY` in your environment variables settings.

### Vercel Deployment
1.  Go to your Project Settings in Vercel.
2.  Select **Environment Variables**.
3.  Add `GEMINI_API_KEY` as the key and your API key as the value.
4.  Redeploy your application.

## 4. Quota and Pricing

The Open Food Facts project uses `gemini-1.5-flash` by default.

- **Free Tier**: Google AI Studio offers a generous free tier that is perfect for development and small-scale production. Note that in the free tier, your data may be used to improve Google's models.
- **Pay-as-you-go**: If you need higher rate limits or want to ensure your data is not used for model training, you can enable billing in Google AI Studio.

## 5. Changing the AI Model

You can easily switch between different Gemini models by editing the `src/lib/ai-config.ts` file.

```typescript
export const AI_CONFIG = {
  model: "gemini-3.1-flash-lite", // Change this to "gemini-1.5-pro" for higher quality
  // ...
};
```

## 6. Troubleshooting

### `API_KEY_INVALID`
Ensure you have copied the key correctly and that it is active in Google AI Studio.

### `RESOURCE_EXHAUSTED` (Rate Limit)
If you are on the free tier, you may hit rate limits if you scan products too quickly. Wait a few seconds and try again.

### AI analysis not appearing
Check the browser console and server logs. If the `GEMINI_API_KEY` is not set, the UI will display a helpful error message.

---

> [!CAUTION]
> **Security Warning**: Never commit your `.env.local` file or hardcode your API key in the source code. The `.gitignore` file is already configured to exclude `.env.local`.
