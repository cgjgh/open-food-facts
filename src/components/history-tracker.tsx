"use client"

import { useEffect } from "react"
import { addScanToHistory } from "@/lib/scan-history"

interface HistoryTrackerProps {
  barcode: string
  productName: string
  brand?: string
  imageUrl?: string
  type?: "food" | "beauty"
}

export function HistoryTracker({ barcode, productName, brand, imageUrl, type }: HistoryTrackerProps) {
  useEffect(() => {
    addScanToHistory({ barcode, productName, brand, imageUrl, type })
  }, [barcode, productName, brand, imageUrl, type])

  return null
}
