"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Sparkles, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarcodeScanner } from "@/components/barcode-scanner"

export default function Home() {
  const [barcode, setBarcode] = useState("")
  const [manualOpen, setManualOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (barcode.trim()) {
      router.push(`/product/${barcode.trim()}`)
    }
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4.25rem)] px-4 py-12">
      <div className="w-full max-w-2xl text-center space-y-10 animate-fade-in-up">
        {/* Hero Text */}
        <div className="space-y-5">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary animate-float" />
            <span className="text-sm font-medium text-primary/80 tracking-wider uppercase">
              Powered by Open Data
            </span>
            <Sparkles className="w-5 h-5 text-primary animate-float" style={{ animationDelay: "1s" }} />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl gradient-text leading-tight">
            Know What You Use
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Scan food or beauty products to discover their scores,
            ingredients, additives, and environmental impact.
          </p>
        </div>

        {/* Scan-First Card */}
        <div className="relative glass-card p-8 gradient-border space-y-6">
          {/* Primary: Scan Barcode */}
          <BarcodeScanner
            onScan={(scanned) => router.push(`/product/${scanned}`)}
            variant="hero"
          />

          {/* Divider */}
          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--glass-border)]" />
            <button
              type="button"
              onClick={() => setManualOpen(!manualOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full glass border-[var(--glass-border)]"
            >
              Or enter barcode manually
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${manualOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="flex-1 h-px bg-[var(--glass-border)]" />
          </div>

          {/* Collapsible Manual Entry */}
          <div className={`collapsible-section ${manualOpen ? "collapsible-section-open" : ""}`}>
            <div className="space-y-3 pt-1">
              <p className="text-sm text-muted-foreground">
                Enter a barcode to view detailed product analysis. Try{" "}
                <button
                  type="button"
                  onClick={() => {
                    setBarcode("5000112546415")
                    setManualOpen(true)
                  }}
                  className="text-primary hover:text-primary/80 font-mono font-medium transition-colors underline underline-offset-2"
                >
                  5000112546415
                </button>
              </p>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g. 5000112546415"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="flex-1 glass-input h-12 text-base"
                />
                <Button type="submit" className="btn-gradient h-12 px-6 font-semibold text-base rounded-xl">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Subtle footer hint */}
        <p className="text-xs text-muted-foreground/50 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          Data sourced from Open Food Facts & Open Beauty Facts collaborative databases
        </p>
      </div>
    </div>
  )
}
