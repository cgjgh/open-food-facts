"use client"

import { useEffect, useState, useCallback } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { ScanBarcode, Camera } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  /** Display as a large hero-style button instead of a small inline button */
  variant?: "default" | "hero"
}

export function BarcodeScanner({ onScan, variant = "default" }: BarcodeScannerProps) {
  const [open, setOpen] = useState(false)

  const handleScan = useCallback(
    (decodedText: string) => {
      setOpen(false)
      onScan(decodedText)
    },
    [onScan]
  )

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null

    if (open) {
      // Delay initialization slightly to ensure the dialog content and #reader div are fully mounted
      const timeoutId = setTimeout(() => {
        scanner = new Html5QrcodeScanner(
          "reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 150 },
            supportedScanTypes: [0] // 0 indicates camera only, no file selection
          },
          /* verbose= */ false
        )

        scanner.render(
          (decodedText) => {
            handleScan(decodedText)
          },
          () => {
            // Ignore ongoing scan failures (which happen continuously while waiting for a code)
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
  }, [open, handleScan])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {variant === "hero" ? (
        <DialogTrigger
          render={
            <button
              type="button"
              className="scan-hero-btn group"
            />
          }
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-lg font-bold text-white block">Scan Barcode</span>
              <span className="text-xs text-white/60 block">Point camera at any food product</span>
            </div>
          </div>
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button variant="outline" type="button" className="glass border-[var(--glass-border)] hover:glow-teal transition-all duration-300" />}>
          <ScanBarcode className="mr-2 h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Scan</span>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md glass-card-static border-[var(--glass-border)]">
        <DialogHeader>
          <DialogTitle className="gradient-text-teal text-lg">Scan Barcode</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Point your camera at a product barcode.
          </DialogDescription>
        </DialogHeader>
        <div id="reader" className="w-full min-h-[300px] overflow-hidden rounded-xl border border-[var(--glass-border)] bg-black/20"></div>
      </DialogContent>
    </Dialog>
  )
}
