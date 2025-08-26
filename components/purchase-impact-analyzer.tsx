"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Camera,
  Upload,
  Link,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  Zap,
  Brain,
} from "lucide-react"

const visionProColors = [
  "#007AFF", // iOS Blue (primary)
  "#5856D6", // Purple
  "#AF52DE", // Violet
  "#FF2D92", // Pink
  "#FF3B30", // Red
  "#FF9500", // Orange
  "#FFCC00", // Yellow
  "#30D158", // Green
  "#64D2FF", // Light Blue
  "#BF5AF2", // Magenta
]

interface PurchaseAnalysis {
  itemName: string
  price: number
  category: string
  budgetImpact: number
  recommendation: "buy" | "wait" | "avoid"
  monthlyBudgetLeft: number
  alternativeSuggestions: string[]
  paymentPlan?: {
    monthly: number
    duration: number
  }
}

export default function PurchaseImpactAnalyzer() {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"image" | "url" | null>(null)
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<PurchaseAnalysis | null>(null)

  const mockAnalyze = async (input: string | File) => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockAnalysis: PurchaseAnalysis = {
      itemName: "MacBook Pro 16-inch",
      price: 2499,
      category: "Electronics",
      budgetImpact: 72,
      recommendation: "wait",
      monthlyBudgetLeft: 970,
      alternativeSuggestions: [
        "MacBook Air M2 - Save $800",
        "Refurbished MacBook Pro - Save $500",
        "Wait for Black Friday - Potential 15% off",
      ],
      paymentPlan: {
        monthly: 208,
        duration: 12,
      },
    }

    setAnalysis(mockAnalysis)
    setIsAnalyzing(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      mockAnalyze(file)
    }
  }

  const handleUrlAnalysis = () => {
    if (url) {
      mockAnalyze(url)
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "buy":
        return visionProColors[7] // Green
      case "wait":
        return visionProColors[5] // Orange
      case "avoid":
        return visionProColors[4] // Red
      default:
        return visionProColors[0]
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "buy":
        return CheckCircle
      case "wait":
        return AlertTriangle
      case "avoid":
        return X
      default:
        return CheckCircle
    }
  }

  if (!isOpen) {
    return (
      <div
        className="backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl p-8 border border-white/20 dark:border-white/10 cursor-pointer hover:scale-[1.02] transition-all duration-300"
        style={{ boxShadow: `0 8px 40px ${visionProColors[3]}10` }}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
              style={{
                background: `linear-gradient(135deg, ${visionProColors[3]} 0%, ${visionProColors[9]} 100%)`,
                boxShadow: `0 0 25px ${visionProColors[3]}30`,
              }}
            >
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Purchase Impact Analyzer</h3>
              <p className="text-sm text-muted-foreground">See how purchases affect your budget</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" style={{ color: visionProColors[3] }} />
            <Zap className="w-4 h-4" style={{ color: visionProColors[6] }} />
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Click to analyze your next purchase</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl p-8 border border-white/20 dark:border-white/10"
      style={{ boxShadow: `0 8px 40px ${visionProColors[3]}10` }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
            style={{
              background: `linear-gradient(135deg, ${visionProColors[3]} 0%, ${visionProColors[9]} 100%)`,
              boxShadow: `0 0 25px ${visionProColors[3]}30`,
            }}
          >
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Purchase Impact Analyzer</h3>
            <p className="text-sm text-muted-foreground">AI-powered budget impact analysis</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 hover:bg-white/20 dark:hover:bg-black/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {!analysis && !isAnalyzing && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Upload an image, receipt, or paste a product URL to see how it impacts your monthly budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 hover:bg-white/20 dark:hover:bg-black/20"
              onClick={() => setUploadMethod("image")}
            >
              <Camera className="w-6 h-6" style={{ color: visionProColors[3] }} />
              <span>Take Photo</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 hover:bg-white/20 dark:hover:bg-black/20"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="w-6 h-6" style={{ color: visionProColors[3] }} />
              <span>Upload Receipt</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 hover:bg-white/20 dark:hover:bg-black/20"
              onClick={() => setUploadMethod("url")}
            >
              <Link className="w-6 h-6" style={{ color: visionProColors[3] }} />
              <span>Paste URL</span>
            </Button>
          </div>

          <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

          {uploadMethod === "url" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-url">Product URL</Label>
                <Input
                  id="product-url"
                  placeholder="https://example.com/product"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20"
                />
              </div>
              <Button
                onClick={handleUrlAnalysis}
                className="w-full"
                style={{
                  background: `linear-gradient(135deg, ${visionProColors[3]} 0%, ${visionProColors[9]} 100%)`,
                  boxShadow: `0 0 20px ${visionProColors[3]}30`,
                }}
              >
                Analyze Purchase Impact
              </Button>
            </div>
          )}
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center py-12">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"
            style={{
              background: `linear-gradient(135deg, ${visionProColors[3]} 0%, ${visionProColors[9]} 100%)`,
              boxShadow: `0 0 30px ${visionProColors[3]}40`,
            }}
          >
            <Brain className="w-8 h-8 text-white animate-bounce" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Analyzing Purchase Impact...</h4>
          <p className="text-sm text-muted-foreground">
            AI is processing the item details and calculating budget impact
          </p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl backdrop-blur-sm bg-white/20 dark:bg-black/20 border border-white/30">
            <div>
              <h4 className="text-lg font-semibold">{analysis.itemName}</h4>
              <p className="text-2xl font-bold" style={{ color: visionProColors[3] }}>
                ${analysis.price.toLocaleString()}
              </p>
            </div>
            <Badge
              className="text-white border-0"
              style={{ backgroundColor: getRecommendationColor(analysis.recommendation) }}
            >
              {analysis.recommendation.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5" style={{ color: visionProColors[4] }} />
                  <span className="font-semibold">Budget Impact</span>
                </div>
                <div className="text-2xl font-bold mb-2">{analysis.budgetImpact}%</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${analysis.budgetImpact}%`,
                      backgroundColor: analysis.budgetImpact > 50 ? visionProColors[4] : visionProColors[7],
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ${analysis.monthlyBudgetLeft} left in monthly budget
                </p>
              </div>

              {analysis.paymentPlan && (
                <div className="p-4 rounded-xl backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5" style={{ color: visionProColors[0] }} />
                    <span className="font-semibold">Payment Plan Option</span>
                  </div>
                  <div className="text-lg font-bold">${analysis.paymentPlan.monthly}/month</div>
                  <p className="text-sm text-muted-foreground">for {analysis.paymentPlan.duration} months</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={{ color: visionProColors[7] }} />
                  Smart Alternatives
                </h5>
                <div className="space-y-2">
                  {analysis.alternativeSuggestions.map((suggestion, index) => (
                    <div key={index} className="text-sm p-2 rounded-lg bg-white/10 dark:bg-black/10">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              style={{
                background: `linear-gradient(135deg, ${visionProColors[7]} 0%, ${visionProColors[8]} 100%)`,
                boxShadow: `0 0 20px ${visionProColors[7]}30`,
              }}
            >
              Add to Wishlist
            </Button>
            <Button
              variant="outline"
              className="flex-1 backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 hover:bg-white/20 dark:hover:bg-black/20"
              onClick={() => {
                setAnalysis(null)
                setUrl("")
                setUploadMethod(null)
              }}
            >
              Analyze Another
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
