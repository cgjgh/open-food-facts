"use client"

import { useState, useEffect } from "react"
import { getProductAIInsights } from "@/app/actions/aiActions"
import { Sparkles, Brain, ArrowRight, Info, Loader2, AlertTriangle } from "lucide-react"

interface AIInsightsProps {
  productName: string
  brands?: string
  ingredients?: string
  nutrition?: Record<string, unknown> | string
  type?: "food" | "beauty"
}

interface AIInsightData {
  dietitians_view: string;
  ingredient_analysis: Array<{ name: string; explanation: string }>;
  additives_to_avoid: Array<{ name: string; risk: string }>;
  healthy_swaps: Array<{ name: string; reason: string }>;
}

export function AIInsights({ productName, brands, ingredients, nutrition, type }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInsights() {
      try {
        const data = await getProductAIInsights({
          name: productName,
          brands,
          ingredients,
          nutrition,
          type
        })
        
        if (data.error) {
          setError(data.error)
        } else {
          setInsights(data)
        }
      } catch {
        setError("Something went wrong while fetching AI insights.")
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [productName, brands, ingredients, nutrition, type])

  if (loading) {
    return (
      <div className="glass-card p-6 mt-8 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
          <h3 className="text-lg font-bold gradient-text-teal">AI is analyzing...</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-muted/20 rounded w-3/4" />
          <div className="h-4 bg-muted/20 rounded w-full" />
          <div className="h-4 bg-muted/20 rounded w-5/6" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-6 mt-8 border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-2 mb-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-lg font-bold">AI Analysis Unavailable</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {error}
        </p>
      </div>
    )
  }

  if (!insights) return null

  return (
    <div className="mt-10 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 px-1">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold gradient-text-teal">AI Smart Insights</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Dietitian's View */}
        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Brain className="w-12 h-12 text-emerald-400" />
          </div>
          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {type === "beauty" ? "Cosmetic Scientist's Perspective" : "Dietitian's Perspective"}
          </h4>
          <p className="text-foreground leading-relaxed relative z-10">
            {insights.dietitians_view}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ingredient Decoder */}
          <div className="glass-card p-6">
            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">
              Ingredient Decoder
            </h4>
            <div className="space-y-4">
              {insights.ingredient_analysis?.map((item, idx: number) => (
                <div key={idx} className="space-y-1">
                  <p className="text-sm font-bold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground leading-normal">
                    {item.explanation}
                  </p>
                </div>
              ))}
              {(!insights.ingredient_analysis || insights.ingredient_analysis.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No complex ingredients identified.</p>
              )}
            </div>
          </div>

          {/* Additives to Avoid */}
          <div className="glass-card p-6 border-red-500/10">
            <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4">
              Additives to Avoid
            </h4>
            <div className="space-y-4">
              {insights.additives_to_avoid?.map((item, idx: number) => (
                <div key={idx} className="space-y-1">
                  <p className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground leading-normal">
                    {item.risk}
                  </p>
                </div>
              ))}
              {(!insights.additives_to_avoid || insights.additives_to_avoid.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No harmful additives identified.</p>
              )}
            </div>
          </div>

          {/* Healthy Swaps */}
          <div className="glass-card p-6">
            <h4 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-4">
              Healthier Swaps
            </h4>
            <div className="space-y-4">
              {insights.healthy_swaps?.map((item, idx: number) => (
                <div key={idx} className="flex gap-3">
                  <div className="mt-1">
                    <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground leading-normal">
                      {item.reason}
                    </p>
                  </div>
                </div>
              ))}
              {(!insights.healthy_swaps || insights.healthy_swaps.length === 0) && (
                <p className="text-sm text-muted-foreground italic">This product is already a great choice!</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-center text-muted-foreground/50 italic px-4">
        AI-generated insights are for informational purposes only and should not replace professional medical advice.
      </p>
    </div>
  )
}
