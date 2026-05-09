# 👩‍💻 Development Guide

Welcome to the development guide for Open Food Facts! This document outlines our coding standards, UI principles, and common workflows.

## 🎨 Design Philosophy: "Techy & Premium"

Every contribution should align with our core aesthetic:
- **Depth**: Use glassmorphism (`backdrop-blur`, `bg-opacity`) to create layered interfaces.
- **Motion**: Every interactive element should have a subtle micro-animation (use `transition`, `framer-motion` or `tw-animate`).
- **Precision**: Use the **Outfit** font and consistent spacing.
- **Vibrancy**: Stick to the emerald/teal/purple palette for health-related metrics.

## 🛠️ Common Tasks

### Adding a New Component
1. Place the component in `src/components/`.
2. Use **Tailwind CSS 4** for styling.
3. If it's a UI primitive, consider adding it to `src/components/ui/` via Shadcn.

### Running Quality Checks
Before submitting a PR, ensure everything is clean:
```bash
# Run linting
npm run lint

# Run type-checking
npm run type-check
```

## 📏 Coding Standards

- **TypeScript**: Mandatory for all new files. Avoid `any` at all costs.
- **Server Components**: Use by default. Only use `'use client'` when interactivity or browser APIs are required.
- **Server Actions**: Preferred for all form submissions and data mutations.
- **Accessibility**: Ensure all buttons have labels and images have alt text. Use semantic HTML (`<main>`, `<section>`, `<header>`).

## 🌓 Theming

We use `next-themes` for theme management. 
- Always test your UI in both **Light** and **Dark** modes.
- Use CSS variables from `globals.css` instead of hardcoded hex values where possible.

## 🤖 AI Development

This project uses Google Gemini for AI-powered product analysis. For a full breakdown of the system, see [AI_DOCUMENTATION.md](AI_DOCUMENTATION.md).

- **Integration**: All AI logic should live in `src/app/actions/aiActions.ts`.
- **Model Configuration**: Use the central `src/lib/ai-config.ts` to switch models or adjust parameters. Do not hardcode these in actions.
- **Configuration**: See [GEMINI_SETUP.md](GEMINI_SETUP.md) for instructions on setting up your API keys.
- **UX**: AI features should always have a loading state and graceful error handling (see `src/components/ai-insights.tsx` for implementation patterns).

## 🚀 Deployment

The project is optimized for **Vercel**. 
- Ensure `NEXT_PUBLIC_` environment variables are correctly set in the Vercel dashboard if you add new external service integrations.

## 🐛 Debugging

- **Network Logs**: Check the browser console for OFF API request failures.
- **Server Logs**: Check the terminal running `npm run dev` for Server Action or SSR errors.
