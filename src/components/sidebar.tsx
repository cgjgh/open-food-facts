"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Clock, 
  PlusCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Utensils,
  Sparkles
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Search", icon: Home },
  { href: "/history", label: "History", icon: Clock },
  { href: "/submit", label: "Submit Food", icon: PlusCircle },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      setMounted(true)
      const saved = localStorage.getItem("sidebar-collapsed")
      if (saved) setIsCollapsed(saved === "true")
    })
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
    document.documentElement.style.setProperty("--sidebar-width", newState ? "80px" : "260px")
  }

  // Set initial width on mount
  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty("--sidebar-width", isCollapsed ? "80px" : "260px")
    }
  }, [mounted, isCollapsed])

  if (!mounted) return null

  return (
    <aside 
      className={cn(
        "hidden md:flex fixed left-0 top-0 h-screen z-50 flex-col transition-all duration-300 ease-in-out border-r border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 mb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative shrink-0">
            <Utensils className="h-7 w-7 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_oklch(0.72_0.15_180_/_50%)]" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight gradient-text whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
              Open Food Facts
            </span>
          )}
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                active 
                  ? "bg-primary/10 text-primary shadow-[inset_0_1px_0_oklch(1_0_0_/_5%)]" 
                  : "text-muted-foreground hover:bg-[var(--glass-bg-hover)] hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200", active && "scale-110")} />
              {!isCollapsed && (
                <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.label}
                </span>
              )}
              {active && (
                <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_10px_oklch(0.72_0.15_180_/_50%)]" />
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-16 px-2 py-1 rounded bg-popover text-popover-foreground text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-border shadow-md whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 mt-auto space-y-4">
        {!isCollapsed && (
          <div className="glass-card-static p-3 space-y-2 border-[var(--glass-border)] bg-white/5 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-[10px] font-semibold text-primary/80 uppercase tracking-widest">Premium UI</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Experience the future of food data analysis.
            </p>
          </div>
        )}

        <div className={cn("flex items-center gap-2", isCollapsed ? "flex-col" : "justify-between px-2")}>
          <ThemeToggle />
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-[var(--glass-bg-hover)] border border-[var(--glass-border)] text-muted-foreground hover:text-foreground transition-all hover:glow-teal"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>
    </aside>
  )
}
