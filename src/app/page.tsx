"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarcodeScanner } from "@/components/barcode-scanner"

export default function Home() {
  const [barcode, setBarcode] = useState("")
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
            Know What You Eat
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Search any food product to discover its nutritional score,
            ingredients, additives, and environmental impact.
          </p>
        </div>

        {/* Search Card */}
        <div className="relative glass-card p-8 gradient-border">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">
                Lookup Product
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter a barcode to view detailed product analysis. Try{" "}
              <button
                type="button"
                onClick={() => setBarcode("5000112546415")}
                className="text-primary hover:text-primary/80 font-mono font-medium transition-colors underline underline-offset-2"
              >
                5000112546415
              </button>
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 mt-4">
              <Input
                type="text"
                placeholder="e.g. 5000112546415"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1 glass-input h-12 text-base"
              />
              <BarcodeScanner onScan={(scanned) => setBarcode(scanned)} />
              <Button type="submit" className="btn-gradient h-12 px-6 font-semibold text-base rounded-xl">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Subtle footer hint */}
        <p className="text-xs text-muted-foreground/50 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          Data sourced from the Open Food Facts collaborative database
        </p>
      </div>
    </div>
  )
}
