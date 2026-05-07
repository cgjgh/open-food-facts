"use client"

import { useEffect } from "react"
import { addScanToHistory } from "@/lib/scan-history"

interface HistoryTrackerProps {
  barcode: string
  productName: string
  brand?: string
  imageUrl?: string
}

export function HistoryTracker({ barcode, productName, brand, imageUrl }: HistoryTrackerProps) {
  useEffect(() => {
    addScanToHistory({ barcode, productName, brand, imageUrl })
  }, [barcode, productName, brand, imageUrl])

  return null
}
