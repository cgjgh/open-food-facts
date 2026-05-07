import Link from "next/link"
import { Utensils } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full md:hidden">
      <div className="glass-nav glass-highlight border-0 border-b border-[var(--glass-border)]">
        <div className="container flex h-16 items-center justify-center px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative">
              <Utensils className="h-6 w-6 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_oklch(0.72_0.15_180_/_50%)]" />
            </div>
            <span className="font-bold text-lg tracking-tight gradient-text">
              Open Food Facts
            </span>
          </Link>
          <nav className="hidden md:flex flex-1 items-center space-x-1 text-sm font-medium">
            <Link
              href="/"
              className="relative px-3 py-2 rounded-lg transition-all duration-300 text-foreground/60 hover:text-foreground hover:bg-[var(--glass-bg-hover)]"
            >
              Search
            </Link>
            <Link
              href="/submit"
              className="relative px-3 py-2 rounded-lg transition-all duration-300 text-foreground/60 hover:text-foreground hover:bg-[var(--glass-bg-hover)]"
            >
              Submit Food
            </Link>
          </nav>
        </div>
      </div>
      <div className="gradient-line" />
    </header>
  )
}
