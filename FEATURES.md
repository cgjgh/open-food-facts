# 🚀 Features Deep Dive

This document provides a technical look at the core features of the Open Food Facts application.

## 🔍 Barcode Scanner

The scanner is the heart of the "Scan-First" experience.

- **Component**: `src/components/barcode-scanner.tsx`
- **Library**: `html5-qrcode`
- **Logic**:
    - Uses the device's camera to scan for EAN/UPC barcodes.
    - Optimized for mobile viewports with a 1:1 aspect ratio.
    - Upon success, it vibrates (if supported) and redirects the user to `/product/[barcode]`.

## 🧮 Scoring Engine (Yuka-Inspired)

We calculate a "Yuka-style" score out of 100 to give users a quick understanding of product healthiness.

- **Module**: `src/lib/scoring.ts`
- **Weights**:
    - **Nutri-Score (60%)**: Grade A (+40) to E (-35) relative to a base of 50.
    - **Additives (30%)**: Penalties for known harmful additives.
    - **Nova Group (Process level)**: Penalties for ultra-processed foods (Nova 4).
    - **Eco-Score**: Bonus points for environmentally friendly products (Grade A).

### Scoring Breakdown
| Score | Category | Color |
|-------|----------|-------|
| 75-100 | Excellent | Emerald |
| 50-74 | Good | Green |
| 25-49 | Poor | Orange |
| 0-24 | Bad | Red |

## 📜 Scan History

Privacy-focused history tracking that keeps your data on your device.

- **Module**: `src/lib/scan-history.ts`
- **Storage**: `localStorage` (Key: `off-scan-history`)
- **Capacity**: Maximum 50 items (Last In, First Out).
- **Triggers**: History is updated automatically when a product page is visited via the `history-tracker.tsx` component.

## ✨ Glassmorphism UI

The "Premium" look is achieved through a set of custom CSS utilities and Tailwind 4 features.

- **File**: `src/app/globals.css`
- **Key Classes**:
    - `.glass-panel`: High blur (20px), low opacity (10% - 20%), frosted border.
    - `.glass-card`: Slightly more opaque for content contrast.
    - `.animate-in`: Custom entry animations for smooth page transitions.

## 📥 Product Submission

Allows users to contribute back to the Open Food Facts database.

- **Route**: `src/app/submit/page.tsx`
- **Action**: `src/app/actions/foodActions.ts`
- **Features**:
    - Image capture and upload.
    - Secure multi-part form submission.
    - Immediate redirection to the newly created product page.
