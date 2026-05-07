const STORAGE_KEY = "off-scan-history"
const MAX_ITEMS = 50

export interface ScanHistoryItem {
  barcode: string
  productName: string
  brand?: string
  imageUrl?: string
  timestamp: number
}

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/**
 * Retrieves the scan history from LocalStorage.
 * 
 * @returns An array of ScanHistoryItem objects.
 */
export function getScanHistory(): ScanHistoryItem[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ScanHistoryItem[]) : []
  } catch {
    return []
  }
}

/**
 * Adds a new product scan to the history, maintaining a maximum item limit.
 * Deduplicates entries by barcode, moving the most recent scan to the top.
 * 
 * @param item - The product information to add to history.
 */
export function addScanToHistory(item: Omit<ScanHistoryItem, "timestamp">): void {
  if (!isBrowser()) return
  try {
    const history = getScanHistory()

    // Remove existing entry for same barcode (dedup — will re-add at top)
    const filtered = history.filter((h) => h.barcode !== item.barcode)

    const newItem: ScanHistoryItem = {
      ...item,
      timestamp: Date.now(),
    }

    // Prepend new item and cap at MAX_ITEMS
    const updated = [newItem, ...filtered].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage might be full or unavailable
  }
}

export function removeScanItem(barcode: string): void {
  if (!isBrowser()) return
  try {
    const history = getScanHistory()
    const updated = history.filter((h) => h.barcode !== barcode)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

export function clearScanHistory(): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
