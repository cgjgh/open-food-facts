"use client"

import { useState, useEffect, useCallback } from "react"
import { getEvaluationDetail } from "@/app/actions/aiActions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Sparkles, Loader2, AlertCircle, Info } from "lucide-react"

interface EvaluationDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  productName: string
  evaluationTitle: string
}

export function EvaluationDetailDialog({
  isOpen,
  onOpenChange,
  productName,
  evaluationTitle,
}: EvaluationDetailDialogProps) {
  const [detail, setDetail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetail = useCallback(async () => {
    setLoading(true)
    setError(null)
    setDetail(null)
    try {
      const data = await getEvaluationDetail(productName, evaluationTitle)
      if (data.error) {
        setError(data.error)
      } else {
        setDetail(data.text || null)
      }
    } catch {
      setError("Failed to fetch evaluation details.")
    } finally {
      setLoading(false)
    }
  }, [productName, evaluationTitle])

  useEffect(() => {
    if (isOpen && evaluationTitle) {
      // Call asynchronously to avoid triggering cascading renders warning
      Promise.resolve().then(() => fetchDetail())
    }
  }, [isOpen, evaluationTitle, fetchDetail])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-[var(--glass-border)] sm:max-w-[425px] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
        
        <DialogHeader className="pt-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            AI Explanation
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium pt-1">
            Understanding &quot;{evaluationTitle}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 min-h-[150px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                <Sparkles className="w-4 h-4 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                Gemini is analyzing health data...
              </p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-foreground">Analysis Unavailable</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
              <button 
                onClick={fetchDetail}
                className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-4"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="glass-card p-4 bg-emerald-500/5 border-emerald-500/10">
                <p className="text-sm leading-relaxed text-foreground font-medium">
                  {detail}
                </p>
              </div>
              <div className="flex items-start gap-3 px-1">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-normal italic">
                  This analysis is specific to {productName} and considers its ingredients and nutritional profile.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center pb-2">
           <p className="text-[9px] text-muted-foreground/30 uppercase tracking-widest font-bold">
             Powered by Google Gemini AI
           </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
