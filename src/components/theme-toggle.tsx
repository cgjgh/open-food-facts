"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  const [, startTransition] = React.useTransition()

  React.useEffect(() => {
    startTransition(() => {
      setMounted(true)
    })
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // SSR placeholder — same dimensions, no interactivity
  if (!mounted) {
    return <div className="theme-toggle-skeleton" aria-hidden="true" />
  }

  const isDark = theme === "dark"

  return (
    <button
      id="theme-toggle"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      className="theme-toggle-pill"
      onClick={toggleTheme}
    >
      <span className="theme-toggle-indicator" />
      <span className="theme-toggle-slot">
        <Sun className="theme-toggle-icon theme-toggle-icon--sun" />
      </span>
      <span className="theme-toggle-slot">
        <Moon className="theme-toggle-icon theme-toggle-icon--moon" />
      </span>
    </button>
  )
}
