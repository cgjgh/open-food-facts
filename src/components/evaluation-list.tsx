"use client"

import { useState } from "react"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { EvaluationDetailDialog } from "./evaluation-detail-dialog"

interface Reason {
  id: string
  type: 'positive' | 'negative' | 'warning'
  title: string
  value?: string
}

interface EvaluationListProps {
  negatives: Reason[]
  positives: Reason[]
  productName: string
}

export function EvaluationList({ negatives, positives, productName }: EvaluationListProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleItemClick = (title: string) => {
    setSelectedItem(title)
    setIsDialogOpen(true)
  }

  if (negatives.length === 0 && positives.length === 0) {
    return <p className="text-muted-foreground px-1">Not enough data to provide a detailed evaluation.</p>
  }

  return (
    <>
      <div className="space-y-5">
        {/* Negatives List */}
        {negatives.length > 0 && (
          <div className="glass-card-static overflow-hidden">
            <div className="divide-y divide-[var(--glass-border)]">
              {negatives.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => handleItemClick(reason.title)}
                  className="w-full text-left p-4 flex items-center gap-4 transition-all hover:bg-red-500/5 group active:scale-[0.98]"
                >
                  {reason.type === 'negative' ? (
                    <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-orange-500/15 flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-red-400 transition-colors">{reason.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Tap for AI analysis</p>
                  </div>
                  {reason.value && (
                    <span className="text-sm font-bold text-muted-foreground glass px-3 py-1.5 rounded-lg text-xs font-mono">
                      {reason.value}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Positives List */}
        {positives.length > 0 && (
          <div className="glass-card-static overflow-hidden">
            <div className="divide-y divide-[var(--glass-border)]">
              {positives.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => handleItemClick(reason.title)}
                  className="w-full text-left p-4 flex items-center gap-4 transition-all hover:bg-emerald-500/5 group active:scale-[0.98]"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-emerald-400 transition-colors">{reason.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Tap for AI analysis</p>
                  </div>
                  {reason.value && (
                    <span className="text-sm font-bold text-muted-foreground glass px-3 py-1.5 rounded-lg text-xs font-mono">
                      {reason.value}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <EvaluationDetailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        productName={productName}
        evaluationTitle={selectedItem || ""}
      />
    </>
  )
}
