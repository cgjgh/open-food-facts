"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Clock, ScanBarcode, PlusCircle, Settings } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: Clock },
  { href: "__scan__", label: "Scan", icon: ScanBarcode },
  { href: "/submit", label: "Submit", icon: PlusCircle },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [scanOpen, setScanOpen] = useState(false)

  const handleScan = useCallback(
    (decodedText: string) => {
      setScanOpen(false)
      router.push(`/product/${decodedText}`)
    },
    [router]
  )

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null

    if (scanOpen) {
      const timeoutId = setTimeout(() => {
        scanner = new Html5QrcodeScanner(
          "bottom-nav-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            supportedScanTypes: [0],
          },
          false
        )

        scanner.render(
          (decodedText) => {
            handleScan(decodedText)
          },
          () => {
            // Ignore ongoing scan failures
          }
        )
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        if (scanner) {
          scanner.clear().catch((e) => console.error("Failed to clear scanner", e))
        }
      }
    }
  }, [scanOpen, handleScan])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href === "__scan__") return false
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className="bottom-nav glass-highlight md:hidden" id="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            const isScan = item.href === "__scan__"
            const Icon = item.icon

            if (isScan) {
              return (
                <button
                  key="scan"
                  type="button"
                  onClick={() => setScanOpen(true)}
                  className="bottom-nav-scan-btn"
                  aria-label="Scan barcode"
                >
                  <div className="bottom-nav-scan-circle">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </button>
              )
            }

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => router.push(item.href)}
                className={`bottom-nav-item ${active ? "bottom-nav-item-active" : ""}`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
                {active && <div className="bottom-nav-indicator" />}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Scanner Dialog */}
      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent className="sm:max-w-md glass-card-static border-[var(--glass-border)]">
          <DialogHeader>
            <DialogTitle className="gradient-text-teal text-lg">Scan Barcode</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Point your camera at a product barcode.
            </DialogDescription>
          </DialogHeader>
          <div id="bottom-nav-reader" className="w-full min-h-[300px] overflow-hidden rounded-xl border border-[var(--glass-border)] bg-black/20" />
        </DialogContent>
      </Dialog>
    </>
  )
}
