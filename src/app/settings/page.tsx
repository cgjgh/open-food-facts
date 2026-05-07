"use client"

import { useState, useEffect, useTransition } from "react"
import { Settings, Palette, Database, Info, Trash2, ExternalLink, AlertTriangle, Utensils, UserCircle, Save, CheckCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { getScanHistory, clearScanHistory } from "@/lib/scan-history"
import { getOffCredentials, setOffCredentials } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [historyCount, setHistoryCount] = useState(0)
  const [confirmClear, setConfirmClear] = useState(false)
  
  // Auth state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  const [, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      setMounted(true)
      setHistoryCount(getScanHistory().length)
      
      const creds = getOffCredentials()
      if (creds.username) setUsername(creds.username)
      if (creds.password) setPassword(creds.password)
    })
  }, [])

  const handleSaveAuth = () => {
    setSaveStatus("saving")
    setOffCredentials({ username, password })
    setTimeout(() => {
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 500)
  }

  const handleClearHistory = () => {
    clearScanHistory()
    setHistoryCount(0)
    setConfirmClear(false)
  }

  const themeOptions = [
    { value: "dark", label: "Dark", emoji: "🌙" },
    { value: "light", label: "Light", emoji: "☀️" },
    { value: "system", label: "System", emoji: "💻" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* OFF Account Section */}
        <div className="glass-card-static overflow-hidden">
          <div className="p-5 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-semibold text-primary/80 uppercase tracking-widest">
                OFF Account
              </h2>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your Open Food Facts credentials to submit new products.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-medium text-foreground/70">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="OFF Username" 
                  className="glass-input h-10 text-sm" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-foreground/70">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="glass-input h-10 text-sm" 
                />
              </div>
            </div>
            <Button 
              onClick={handleSaveAuth}
              className="w-full btn-gradient h-10 text-sm rounded-lg"
              disabled={saveStatus !== "idle"}
            >
              {saveStatus === "saving" ? "Saving..." : 
               saveStatus === "saved" ? (
                 <><CheckCircle className="w-4 h-4 mr-2" /> Saved</>
               ) : (
                 <><Save className="w-4 h-4 mr-2" /> Save Credentials</>
               )}
            </Button>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="glass-card-static overflow-hidden">
          <div className="p-5 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-semibold text-primary/80 uppercase tracking-widest">
                Appearance
              </h2>
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm text-muted-foreground mb-4">Choose your preferred theme</p>
            {mounted && (
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTheme(opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                      theme === opt.value
                        ? "border-primary/50 bg-primary/10 shadow-[var(--glow-teal)]"
                        : "border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] hover:bg-[var(--glass-bg-hover)]"
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className={`text-xs font-medium ${
                      theme === opt.value ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Data Section */}
        <div className="glass-card-static overflow-hidden">
          <div className="p-5 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-accent" />
              <h2 className="text-xs font-semibold text-accent/80 uppercase tracking-widest">
                Data
              </h2>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Scan History</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {historyCount} {historyCount === 1 ? "product" : "products"} saved locally
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmClear(true)}
                disabled={historyCount === 0}
                className="glass border-[var(--glass-border)] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs disabled:opacity-30"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="glass-card-static overflow-hidden">
          <div className="p-5 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" />
              <h2 className="text-xs font-semibold text-purple-400/80 uppercase tracking-widest">
                About
              </h2>
            </div>
          </div>
          <div className="p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Open Food Facts</p>
                <p className="text-xs text-muted-foreground">v1.0.0</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A free, open, collaborative database of food products from around the world.
              This app lets you scan and explore product information including nutritional
              scores, ingredients, and environmental impact.
            </p>
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Visit Open Food Facts
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Dialog */}
      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent className="sm:max-w-sm glass-card-static border-[var(--glass-border)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Clear All History
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This will permanently remove all {historyCount} items from your scan history. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 glass border-[var(--glass-border)]"
              onClick={() => setConfirmClear(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-500/80 hover:bg-red-500 text-white"
              onClick={handleClearHistory}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
