# 🔗 API Reference

This document covers the internal Server Actions and external Open Food Facts (OFF) API integrations used in this project.

## 🟢 Internal Server Actions

### `submitFoodAction`
Handles the submission of new products or updates to existing ones, including image uploads.

- **File**: `src/app/actions/foodActions.ts`
- **Input**: `FormData` containing:
    - `username`: OFF user account.
    - `password`: OFF account password.
    - `barcode`: Product EAN/UPC.
    - `productName`: Name of the food item.
    - `brands`: Brand names.
    - `photo`: (Optional) Image file.
- **Returns**: `{ success: boolean, barcode?: string, error?: string }`

## 🌐 External API Integration

We use the official **Open Food Facts API** for all data operations.

### API Base URLs
- **Main API**: `https://world.openfoodfacts.org`
- **Product Submission**: `https://world.openfoodfacts.org/cgi/product_jqm2.pl`
- **Image Upload**: `https://world.openfoodfacts.org/cgi/product_image_upload.pl`

### Data Client
We use the `@openfoodfacts/openfoodfacts-nodejs` library for reading product data.
- **Configuration**: `src/lib/off.ts`

```typescript
import { createObjectClient } from "@openfoodfacts/openfoodfacts-nodejs";

export const offClient = createObjectClient({
  userAgent: "OpenFoodFactsNextJs - Web - Version 1.0",
});
```

### Usage in Product Page
Data is fetched on the server to leverage Next.js caching and SEO.

```typescript
// Example from src/app/product/[barcode]/page.tsx
const product = await offClient.getProductV3(barcode);
```

## 🔐 Authentication

The Open Food Facts API uses basic user/password authentication for write operations.
- This project does not store user credentials permanently.
- Credentials must be provided by the user during the submission flow.

## 🛠️ Environment Variables

Currently, no secret environment variables are required for basic operations as the OFF API is public for reads and uses user-provided credentials for writes.

However, for production deployments, you might want to configure:
- `NEXT_PUBLIC_SITE_URL`: Base URL for the application.
