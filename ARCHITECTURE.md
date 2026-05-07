# 🏗️ Architecture

This document describes the high-level architecture of the Open Food Facts project, its directory structure, and technical design patterns.

## 🏛️ System Overview

The application is built using **Next.js 16** with the **App Router**. It serves as a modern, user-friendly frontend for the Open Food Facts database.

### Core Architectural Principles
- **Server-First**: Heavy use of Server Components and Server Actions for data fetching and mutations.
- **Glassmorphism UI**: A consistent design language characterized by translucency, blurs, and vibrant gradients.
- **Local-First Persistence**: Scan history is stored locally in the browser to ensure privacy and offline availability.

## 📂 Directory Structure

```text
src/
├── app/                # App Router: Pages, Layouts, and Server Actions
│   ├── actions/        # Server Actions for API mutations
│   ├── history/        # Scan history page
│   ├── product/        # Dynamic product detail pages [barcode]
│   ├── settings/       # User preferences and settings
│   ├── submit/         # Product contribution flow
│   ├── globals.css     # Design system, CSS variables, and glassmorphism tokens
│   └── layout.tsx      # Root layout with theme provider and navigation
├── components/         # Reusable React components
│   ├── ui/             # Shadcn primitive components
│   ├── barcode-scanner.tsx # Browser-based scanning logic
│   ├── animated-background.tsx # Interactive background effects
│   └── ...
└── lib/                # Shared utilities and logic
    ├── off.ts          # Open Food Facts API client configuration
    ├── scoring.ts      # Product score calculation and formatting
    ├── scan-history.ts # Local storage management for history
    └── utils.ts        # Common helper functions
```

## 🔄 Data Flow

### 1. Product Discovery
- **Scanning**: The `barcode-scanner.tsx` component uses `html5-qrcode` to detect barcodes. Upon detection, it triggers a client-side navigation to `/product/[barcode]`.
- **Search**: Manual barcode entry navigates to the same dynamic route.

### 2. Data Fetching
- Product data is fetched on the server in `src/app/product/[barcode]/page.tsx` using the `@openfoodfacts/openfoodfacts-nodejs` client.
- This ensures fast initial page loads and better SEO.

### 3. History Tracking
- When a product page is visited, the `history-tracker.tsx` component (client-side) adds the barcode and basic product info to the local `IndexedDB` or `LocalStorage` via `lib/scan-history.ts`.

### 4. Product Submission
- New product data is submitted via **Server Actions** in `src/app/actions/foodActions.ts`, which handles authentication and API communication with Open Food Facts servers.

## 🎨 Design System

The design system is defined in `src/app/globals.css`. It uses Tailwind CSS 4 variables to define:
- **Glass Panels**: `.glass-panel`, `.glass-card`
- **Blurs**: Intense backdrop-blur utilities.
- **Vibrant Gradients**: Defined for health/wellness context (Emerald/Teal/Purple).
- **Animations**: Subtle entry animations and hover states.

## 🧮 Scoring Engine

The `src/lib/scoring.ts` module is the brain for product evaluations. It transforms raw API data into user-friendly ratings:
- **Nutri-Score**: Visual representation of nutritional quality.
- **Eco-Score**: Environmental impact visualization.
- **NOVA**: Level of processing indicator.
