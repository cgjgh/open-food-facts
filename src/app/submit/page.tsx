"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Loader2, Info, FileImage } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitFoodAction } from "../actions/foodActions"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { getOffCredentials } from "@/lib/auth-store"

export default function SubmitFood() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [barcode, setBarcode] = useState("")
  const [hasCredentials, setHasCredentials] = useState(true)

  useState(() => {
    const creds = getOffCredentials()
    if (!creds.username || !creds.password) {
      setHasCredentials(false)
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const creds = getOffCredentials()
    
    if (!creds.username || !creds.password) {
      setError("Please configure your OFF credentials in Settings first.")
      setLoading(false)
      return
    }

    formData.append("username", creds.username)
    formData.append("password", creds.password)

    try {
      const result = await submitFoodAction(formData)
      if (result.success) {
        router.push(`/product/${result.barcode}`)
      } else {
        setError(result.error || "Failed to submit product")
      }
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl animate-fade-in-up">
      <div className="relative glass-card p-8 md:p-10 gradient-border">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold gradient-text mb-2">Submit New Product</h1>
          <p className="text-sm text-muted-foreground">
            Help expand the Open Food Facts database by adding a new product.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {error && (
            <div className="p-4 glass-card-static bg-red-500/5 border-red-500/20 flex items-start gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="h-4 w-4 text-red-400" />
              </div>
              <p className="text-red-300 pt-1.5">{error}</p>
            </div>
          )}

          {!hasCredentials && (
            <div className="p-4 glass-card-static bg-amber-500/5 border-amber-500/20 flex items-start gap-3 text-sm mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="h-4 w-4 text-amber-400" />
              </div>
              <div className="pt-1">
                <p className="text-amber-300 font-medium">Credentials missing</p>
                <p className="text-amber-300/70 text-xs">Please set your Open Food Facts username and password in <button type="button" onClick={() => router.push('/settings')} className="underline">Settings</button> to submit products.</p>
              </div>
            </div>
          )}

          {/* Product Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--glass-border)]">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <h3 className="text-xs font-semibold text-accent/80 uppercase tracking-widest">
                Product Details
              </h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode" className="text-sm font-medium text-foreground/80">
                Barcode (EAN/UPC)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="barcode"
                  name="barcode"
                  required
                  placeholder="e.g. 5000112546415"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="flex-1 glass-input h-11"
                />
                <BarcodeScanner onScan={(scanned) => setBarcode(scanned)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-medium text-foreground/80">
                Product Name
              </Label>
              <Input
                id="productName"
                name="productName"
                required
                placeholder="e.g. Coca-Cola Original Taste"
                className="glass-input h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brands" className="text-sm font-medium text-foreground/80">
                Brands
              </Label>
              <Input
                id="brands"
                name="brands"
                required
                placeholder="e.g. Coca-Cola"
                className="glass-input h-11"
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--glass-border)]">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <h3 className="text-xs font-semibold text-purple-400/80 uppercase tracking-widest">
                Media
              </h3>
            </div>
            <div className="space-y-3">
              <Label htmlFor="photo" className="text-sm font-medium text-foreground/80">
                Front Photo
              </Label>
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-[var(--glass-border)] hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FileImage className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground/80">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Clear, well-lit photo of the front packaging
                  </p>
                </div>
              </label>
              <Input id="photo" name="photo" type="file" accept="image/*" className="hidden" />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-gradient h-12 text-base font-semibold rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Product
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
