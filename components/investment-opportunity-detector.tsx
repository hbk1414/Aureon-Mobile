"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Sparkles,
} from "lucide-react"

interface InvestmentOpportunity {
  id: string
  type: "stock" | "etf" | "crypto" | "bond" | "reit"
  symbol: string
  name: string
  currentPrice: number
  targetPrice: number
  potentialReturn: number
  riskLevel: "low" | "medium" | "high"
  confidence: number
  timeHorizon: string
  reason: string
  marketCap?: string
  sector?: string
  recommendation: "buy" | "hold" | "sell"
}

interface MarketTrend {
  date: string
  sp500: number
  nasdaq: number
  bonds: number
  crypto: number
}

interface PortfolioAllocation {
  category: string
  current: number
  recommended: number
  difference: number
  color: string
}

const investmentOpportunities: InvestmentOpportunity[] = [
  {
    id: "1",
    type: "etf",
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    currentPrice: 245.67,
    targetPrice: 275.0,
    potentialReturn: 11.9,
    riskLevel: "medium",
    confidence: 87,
    timeHorizon: "6-12 months",
    reason: "Strong market fundamentals and diversified exposure to US equity market",
    marketCap: "$1.3T",
    sector: "Diversified",
    recommendation: "buy",
  },
  {
    id: "2",
    type: "stock",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 428.9,
    targetPrice: 485.0,
    potentialReturn: 13.1,
    riskLevel: "medium",
    confidence: 82,
    timeHorizon: "3-6 months",
    reason: "AI integration driving revenue growth, strong cloud business",
    marketCap: "$3.2T",
    sector: "Technology",
    recommendation: "buy",
  },
  {
    id: "3",
    type: "crypto",
    symbol: "BTC",
    name: "Bitcoin",
    currentPrice: 67420,
    targetPrice: 85000,
    potentialReturn: 26.1,
    riskLevel: "high",
    confidence: 65,
    timeHorizon: "12-18 months",
    reason: "Institutional adoption and potential ETF approvals driving demand",
    marketCap: "$1.3T",
    sector: "Cryptocurrency",
    recommendation: "buy",
  },
  {
    id: "4",
    type: "bond",
    symbol: "TLT",
    name: "iShares 20+ Year Treasury Bond ETF",
    currentPrice: 92.45,
    targetPrice: 98.0,
    potentialReturn: 6.0,
    riskLevel: "low",
    confidence: 78,
    timeHorizon: "6-12 months",
    reason: "Interest rate cuts expected, long-term bonds positioned to benefit",
    marketCap: "$45B",
    sector: "Fixed Income",
    recommendation: "hold",
  },
]

const marketTrends: MarketTrend[] = [
  { date: "Jan", sp500: 4700, nasdaq: 14800, bonds: 95, crypto: 42000 },
  { date: "Feb", sp500: 4850, nasdaq: 15200, bonds: 93, crypto: 51000 },
  { date: "Mar", sp500: 5100, nasdaq: 16100, bonds: 91, crypto: 67000 },
  { date: "Apr", sp500: 5200, nasdaq: 16400, bonds: 89, crypto: 64000 },
  { date: "May", sp500: 5300, nasdaq: 16800, bonds: 92, crypto: 67400 },
]

const portfolioAllocation: PortfolioAllocation[] = [
  { category: "US Stocks", current: 45, recommended: 50, difference: 5, color: "hsl(var(--chart-1))" },
  { category: "International", current: 15, recommended: 20, difference: 5, color: "hsl(var(--chart-2))" },
  { category: "Bonds", current: 25, recommended: 20, difference: -5, color: "hsl(var(--chart-3))" },
  { category: "REITs", current: 5, recommended: 5, difference: 0, color: "hsl(var(--chart-4))" },
  { category: "Crypto", current: 10, recommended: 5, difference: -5, color: "hsl(var(--chart-5))" },
]

export function InvestmentOpportunityDetector() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [riskTolerance, setRiskTolerance] = useState("medium")

  const filteredOpportunities = investmentOpportunities.filter((opp) => {
    if (riskTolerance === "low") return opp.riskLevel === "low"
    if (riskTolerance === "high") return true
    return opp.riskLevel !== "high"
  })

  const averageReturn =
    filteredOpportunities.reduce((sum, opp) => sum + opp.potentialReturn, 0) / filteredOpportunities.length
  const highConfidenceOpps = filteredOpportunities.filter((opp) => opp.confidence >= 80).length
  const totalInvestmentValue = 25000 // Mock portfolio value

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-500/10 border-green-500/20"
      case "medium":
        return "text-orange-600 bg-orange-500/10 border-orange-500/20"
      case "high":
        return "text-red-600 bg-red-500/10 border-red-500/20"
      default:
        return "text-gray-600 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "buy":
        return "text-green-600 bg-green-500/10 border-green-500/20"
      case "hold":
        return "text-blue-600 bg-blue-500/10 border-blue-500/20"
      case "sell":
        return "text-red-600 bg-red-500/10 border-red-500/20"
      default:
        return "text-gray-600 bg-gray-500/10 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Investment Opportunity Detector
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Market AI
                  </Badge>
                </CardTitle>
                <CardDescription>
                  AI-powered market analysis and personalized investment recommendations
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-2xl font-bold text-emerald-600">${totalInvestmentValue.toLocaleString()}</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">+8.4% this month</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Avg. Expected Return</p>
                <p className="text-lg font-bold text-emerald-500">{averageReturn.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">High Confidence</p>
                <p className="text-lg font-bold">{highConfidenceOpps}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Opportunities</p>
                <p className="text-lg font-bold">{filteredOpportunities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Potential Gains</p>
                <p className="text-lg font-bold text-orange-500">$2,840</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="opportunities">Top Opportunities</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Optimization</TabsTrigger>
          <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{opportunity.symbol}</h3>
                          <Badge className={getRecommendationColor(opportunity.recommendation)}>
                            {opportunity.recommendation.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{opportunity.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Current Price</p>
                        <p className="font-semibold">${opportunity.currentPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target Price</p>
                        <p className="font-semibold text-emerald-600">${opportunity.targetPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Potential Return</p>
                        <p className="font-semibold text-emerald-600">+{opportunity.potentialReturn.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Time Horizon</p>
                        <p className="font-semibold">{opportunity.timeHorizon}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <div className="flex items-center gap-1">
                          <Progress value={opportunity.confidence} className="w-12 h-2" />
                          <span className="text-sm font-medium">{opportunity.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getRiskColor(opportunity.riskLevel)}>{opportunity.riskLevel} risk</Badge>
                      {opportunity.sector && (
                        <Badge variant="outline" className="bg-transparent">
                          {opportunity.sector}
                        </Badge>
                      )}
                      {opportunity.marketCap && (
                        <Badge variant="outline" className="bg-transparent">
                          {opportunity.marketCap}
                        </Badge>
                      )}
                    </div>

                    <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">{opportunity.reason}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Research
                    </Button>
                    <Button size="sm" className="gap-2">
                      <DollarSign className="w-3 h-3" />
                      Invest
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Market Trends Analysis</CardTitle>
              <CardDescription>AI-powered analysis of major market indices and asset classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="sp500" stroke="hsl(var(--chart-1))" strokeWidth={2} name="S&P 500" />
                    <Line type="monotone" dataKey="nasdaq" stroke="hsl(var(--chart-2))" strokeWidth={2} name="NASDAQ" />
                    <Line type="monotone" dataKey="bonds" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Bonds" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Market Sentiment</p>
                    <p className="text-lg font-bold text-green-500">Bullish</p>
                  </div>
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Based on 15 technical indicators</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Volatility Index</p>
                    <p className="text-lg font-bold text-orange-500">18.4</p>
                  </div>
                  <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Moderate volatility expected</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Confidence</p>
                    <p className="text-lg font-bold text-blue-500">84%</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">High confidence in predictions</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Portfolio Optimization Recommendations</CardTitle>
              <CardDescription>AI-suggested allocation adjustments based on your risk profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioAllocation.map((allocation, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{allocation.category}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Current: {allocation.current}%</span>
                        <span className="text-sm font-medium">Target: {allocation.recommended}%</span>
                        <span
                          className={`text-sm font-medium ${
                            allocation.difference > 0
                              ? "text-green-500"
                              : allocation.difference < 0
                                ? "text-red-500"
                                : "text-muted-foreground"
                          }`}
                        >
                          {allocation.difference > 0 ? "+" : ""}
                          {allocation.difference}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${allocation.current}%`,
                            backgroundColor: allocation.color,
                            opacity: 0.6,
                          }}
                        />
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${allocation.recommended}%`,
                            backgroundColor: allocation.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Rebalancing Suggestions</CardTitle>
              <CardDescription>Specific actions to optimize your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-300">Increase US Stock Allocation</p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Move $1,250 from bonds to US stocks (VTI) to reach target 50% allocation
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-300">Add International Exposure</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Invest $1,250 in VTIAX to increase international allocation from 15% to 20%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingDown className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium text-orange-700 dark:text-orange-300">Reduce Crypto Exposure</p>
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                        Consider reducing crypto allocation from 10% to 5% to manage risk
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Smart Investment Alerts</CardTitle>
              <CardDescription>AI-powered notifications for optimal investment timing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-green-700 dark:text-green-300">MSFT Buy Signal</p>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Microsoft hit your target buy price of $425. Consider investing now.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-blue-700 dark:text-blue-300">Market Volatility Alert</p>
                        <span className="text-xs text-muted-foreground">1 day ago</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        VIX increased 15%. Consider dollar-cost averaging your next investments.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-purple-700 dark:text-purple-300">Rebalancing Reminder</p>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                        Your portfolio has drifted 8% from target allocation. Time to rebalance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingDown className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-orange-700 dark:text-orange-300">Earnings Season Alert</p>
                        <span className="text-xs text-muted-foreground">1 week ago</span>
                      </div>
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                        Tech earnings season starts next week. Expect increased volatility in MSFT, AAPL.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
