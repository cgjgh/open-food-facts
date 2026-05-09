import { offClient } from "@/lib/off"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { calculateYukaScore, getScoringReasons, getValidNutriscore } from "@/lib/scoring"
import { Leaf, Shield } from "lucide-react"
import { HistoryTracker } from "@/components/history-tracker"
import { AIInsights } from "@/components/ai-insights"
import { EvaluationList } from "@/components/evaluation-list"

interface PageProps {
  params: Promise<{ barcode: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { barcode } = await params

  const { data, error } = await offClient.getProductV3(barcode)

  if (error || !data || (data.status !== "success" && data.status !== "success_with_warnings")) {
    notFound()
  }

  if (!data.product) {
    notFound()
  }

  const product = data.product
  const scoreData = calculateYukaScore(product)
  const reasons = getScoringReasons(product)
  const validNutriScore = getValidNutriscore(product)

  // Determine Nutri-Score Color
  const getNutriscoreColor = (grade: string) => {
    switch (grade?.toLowerCase()) {
      case 'a': return 'bg-emerald-600 shadow-[0_0_20px_oklch(0.65_0.18_155_/_40%)]';
      case 'b': return 'bg-green-500 shadow-[0_0_20px_oklch(0.72_0.15_145_/_40%)]';
      case 'c': return 'bg-yellow-500 shadow-[0_0_20px_oklch(0.80_0.15_85_/_40%)]';
      case 'd': return 'bg-orange-500 shadow-[0_0_20px_oklch(0.70_0.18_55_/_40%)]';
      case 'e': return 'bg-red-600 shadow-[0_0_20px_oklch(0.60_0.20_25_/_40%)]';
      default: return 'bg-slate-400';
    }
  }

  // Score color for gauge glow
  const getScoreGlow = () => {
    if (scoreData.score >= 75) return 'drop-shadow(0 0 12px oklch(0.65 0.18 155 / 60%))';
    if (scoreData.score >= 50) return 'drop-shadow(0 0 12px oklch(0.72 0.15 145 / 60%))';
    if (scoreData.score >= 25) return 'drop-shadow(0 0 12px oklch(0.70 0.18 55 / 60%))';
    return 'drop-shadow(0 0 12px oklch(0.60 0.20 25 / 60%))';
  }

  // Stroke color (raw CSS)
  const getStrokeColor = () => {
    if (scoreData.score >= 75) return 'oklch(0.65 0.18 155)';
    if (scoreData.score >= 50) return 'oklch(0.72 0.15 145)';
    if (scoreData.score >= 25) return 'oklch(0.70 0.18 55)';
    return 'oklch(0.60 0.20 25)';
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in-up">
      {/* HEADER SECTION */}
      <div className="flex flex-col items-center text-center space-y-5 mb-10">
        <div className="glass-card p-5 h-64 w-64 flex items-center justify-center overflow-hidden">
          {product.image_front_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_front_url}
              alt={product.product_name || "Product image"}
              className="object-contain h-full w-full rounded-xl"
            />
          ) : (
            <div className="text-muted-foreground text-sm">No Image Available</div>
          )}
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {product.product_name || "Unknown Product"}
          </h1>
          {product.brands && (
            <p className="text-lg text-muted-foreground font-medium">
              {product.brands}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="outline" className="glass text-xs text-muted-foreground font-mono border-[var(--glass-border)]">
              {barcode}
            </Badge>
            {product.quantity && (
              <Badge variant="secondary" className="text-xs glass border-[var(--glass-border)]">
                {product.quantity}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* SCORE SECTION */}
      <div className="glass-card p-6 mb-8 relative overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer pointer-events-none rounded-[inherit]" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Circular Gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
                style={{ filter: getScoreGlow() }}
              >
                <path
                  className="stroke-current"
                  style={{ color: 'oklch(1 0 0 / 8%)' }}
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-current"
                  style={{
                    color: getStrokeColor(),
                    strokeDasharray: `${scoreData.score}, 100`,
                    animation: 'gaugeReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
                  }}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-black ${scoreData.color}`}>{scoreData.score}</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">/ 100</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className={`text-2xl font-bold ${scoreData.color}`}>
                {scoreData.label}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
                Based on nutritional value, additives, and processing.
              </p>
            </div>
          </div>

          {/* Nutri-Score Metric */}
          <div className="flex items-center sm:border-l sm:pl-6 border-[var(--glass-border)]">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Nutri-Score
              </span>
              {validNutriScore ? (
                <div className={`text-white font-black text-2xl uppercase w-13 h-13 flex items-center justify-center rounded-xl transition-all ${getNutriscoreColor(validNutriScore)}`}>
                  {validNutriScore}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EVALUATION SECTION */}
      <div className="space-y-5 mb-10">
        <h3 className="text-xl font-bold px-1 gradient-text-teal">Evaluation Details</h3>
        <EvaluationList 
          negatives={reasons.negatives} 
          positives={reasons.positives} 
          productName={product.product_name || "this product"}
        />
      </div>

      {/* AI INSIGHTS */}
      <AIInsights 
        productName={product.product_name || "Unknown Product"}
        brands={product.brands}
        ingredients={product.ingredients_text}
        nutrition={product.nutriments}
      />

      {/* ADDITIONAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up mt-8" style={{ animationDelay: '0.4s' }}>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            Ingredients
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.ingredients_text || "Ingredients not available."}
          </p>
          {product.ecoscore_grade && (
             <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
               <span className="text-sm font-medium">Eco-Score</span>
               <Badge variant="outline" className="uppercase font-bold glass border-[var(--glass-border)]">
                 {product.ecoscore_grade}
               </Badge>
             </div>
          )}
        </div>
      </div>

      {/* History Tracker — records this product view */}
      <HistoryTracker
        barcode={barcode}
        productName={product.product_name || "Unknown Product"}
        brand={product.brands}
        imageUrl={product.image_front_url}
      />
    </div>
  )
}
