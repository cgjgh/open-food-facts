"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Clock, Trash2, Package, ChevronRight, AlertTriangle } from "lucide-react"
import { getScanHistory, clearScanHistory, removeScanItem, type ScanHistoryItem } from "@/lib/scan-history"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<ScanHistoryItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const [, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      setHistory(getScanHistory())
      setMounted(true)
    })
  }, [])

  const handleClearAll = () => {
    clearScanHistory()
    setHistory([])
    setConfirmClear(false)
  }

  const handleRemove = (barcode: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeScanItem(barcode)
    setHistory(getScanHistory())
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded-lg mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">History</h1>
            <p className="text-xs text-muted-foreground">
              {history.length} {history.length === 1 ? "product" : "products"} viewed
            </p>
          </div>
        </div>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmClear(true)}
            className="glass border-[var(--glass-border)] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear All
          </Button>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="glass-card-static p-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <Package className="w-10 h-10 text-primary/40" />
          </div>
          <h2 className="text-lg font-semibold text-foreground/80 mb-2">No Products Viewed Yet</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Products you look up will appear here so you can quickly revisit them.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="btn-gradient mt-6 rounded-xl px-6"
          >
            Search a Product
          </Button>
        </div>
      )}

      {/* History List */}
      {history.length > 0 && (
        <div className="glass-card-static overflow-hidden stagger-children">
          <div className="divide-y divide-[var(--glass-border)]">
            {history.map((item, index) => (
              <div
                key={item.barcode}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/product/${item.barcode}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    router.push(`/product/${item.barcode}`)
                  }
                }}
                className="w-full p-4 flex items-center gap-4 animate-fade-in-up transition-all duration-200 hover:bg-[var(--glass-bg-hover)] cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary/20"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center overflow-hidden shrink-0 border border-[var(--glass-border)]">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Package className="w-5 h-5 text-muted-foreground/40" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {item.productName || "Unknown Product"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.brand && (
                      <span className="text-xs text-muted-foreground truncate">{item.brand}</span>
                    )}
                    <span className="text-[10px] text-muted-foreground/50 font-mono">{item.barcode}</span>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-muted-foreground/60">{timeAgo(item.timestamp)}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(item.barcode, e)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-red-500/15 flex items-center justify-center transition-all"
                    aria-label={`Remove ${item.productName}`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Confirmation Dialog */}
      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent className="sm:max-w-sm glass-card-static border-[var(--glass-border)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Clear All History
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This will permanently remove all {history.length} items from your scan history. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 glass border-[var(--glass-border)]"
              onClick={() => setConfirmClear(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-500/80 hover:bg-red-500 text-white"
              onClick={handleClearAll}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
