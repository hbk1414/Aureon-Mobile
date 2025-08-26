"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Zap,
  Wifi,
  Car,
  Shield,
  Smartphone,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Sparkles,
  ExternalLink,
} from "lucide-react"

interface Bill {
  id: string
  name: string
  provider: string
  category: "utilities" | "insurance" | "subscriptions" | "telecom"
  currentAmount: number
  dueDate: string
  status: "active" | "negotiating" | "optimized"
  icon: React.ReactNode
  autoOptimize: boolean
}

interface Recommendation {
  id: string
  billId: string
  type: "switch" | "negotiate" | "bundle" | "cancel"
  title: string
  description: string
  currentCost: number
  newCost: number
  savings: number
  effort: "low" | "medium" | "high"
  confidence: number
  provider?: string
  status: "pending" | "accepted" | "declined"
}

const mockBills: Bill[] = [
  {
    id: "1",
    name: "Electricity",
    provider: "ConEd",
    category: "utilities",
    currentAmount: 145.5,
    dueDate: "2024-05-28",
    status: "active",
    icon: <Zap className="w-4 h-4" />,
    autoOptimize: true,
  },
  {
    id: "2",
    name: "Internet",
    provider: "Verizon",
    category: "telecom",
    currentAmount: 89.99,
    dueDate: "2024-05-25",
    status: "negotiating",
    icon: <Wifi className="w-4 h-4" />,
    autoOptimize: true,
  },
  {
    id: "3",
    name: "Car Insurance",
    provider: "Geico",
    category: "insurance",
    currentAmount: 156.0,
    dueDate: "2024-06-01",
    status: "optimized",
    icon: <Car className="w-4 h-4" />,
    autoOptimize: false,
  },
  {
    id: "4",
    name: "Phone Plan",
    provider: "T-Mobile",
    category: "telecom",
    currentAmount: 75.0,
    dueDate: "2024-05-30",
    status: "active",
    icon: <Smartphone className="w-4 h-4" />,
    autoOptimize: true,
  },
  {
    id: "5",
    name: "Home Insurance",
    provider: "State Farm",
    category: "insurance",
    currentAmount: 98.0,
    dueDate: "2024-06-15",
    status: "active",
    icon: <Shield className="w-4 h-4" />,
    autoOptimize: false,
  },
]

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    billId: "2",
    type: "switch",
    title: "Switch to Optimum Internet",
    description: "Get the same speed for 40% less with Optimum's promotional rate",
    currentCost: 89.99,
    newCost: 54.99,
    savings: 35.0,
    effort: "medium",
    confidence: 92,
    provider: "Optimum",
    status: "pending",
  },
  {
    id: "2",
    billId: "4",
    type: "negotiate",
    title: "Negotiate T-Mobile Plan",
    description: "Call retention department for loyalty discount - 87% success rate",
    currentCost: 75.0,
    newCost: 55.0,
    savings: 20.0,
    effort: "low",
    confidence: 87,
    status: "pending",
  },
  {
    id: "3",
    billId: "1",
    type: "switch",
    title: "Switch to Green Energy Plan",
    description: "ConEd's renewable energy plan offers 15% savings",
    currentCost: 145.5,
    newCost: 123.68,
    savings: 21.82,
    effort: "low",
    confidence: 78,
    status: "pending",
  },
  {
    id: "4",
    billId: "5",
    type: "bundle",
    title: "Bundle Home & Auto Insurance",
    description: "Combine with your car insurance for multi-policy discount",
    currentCost: 254.0,
    newCost: 203.2,
    savings: 50.8,
    effort: "medium",
    confidence: 85,
    status: "pending",
  },
]

export function BillOptimization() {
  const [bills, setBills] = useState<Bill[]>(mockBills)
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations)
  const [isScanning, setIsScanning] = useState(false)

  const totalMonthlyBills = bills.reduce((sum, bill) => sum + bill.currentAmount, 0)
  const totalPotentialSavings = recommendations
    .filter((rec) => rec.status === "pending")
    .reduce((sum, rec) => sum + rec.savings, 0)
  const optimizedBills = bills.filter((bill) => bill.status === "optimized").length

  const handleAutoOptimizeToggle = (billId: string) => {
    setBills((prev) => prev.map((bill) => (bill.id === billId ? { ...bill, autoOptimize: !bill.autoOptimize } : bill)))
  }

  const handleRecommendationAction = (recId: string, action: "accepted" | "declined") => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === recId ? { ...rec, status: action } : rec)))

    if (action === "accepted") {
      const recommendation = recommendations.find((rec) => rec.id === recId)
      if (recommendation) {
        setBills((prev) =>
          prev.map((bill) =>
            bill.id === recommendation.billId
              ? {
                  ...bill,
                  currentAmount: recommendation.newCost,
                  status: "optimized" as const,
                  provider: recommendation.provider || bill.provider,
                }
              : bill,
          ),
        )
      }
    }
  }

  const scanForOpportunities = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      // In a real app, this would trigger AI analysis
    }, 2000)
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-blue-600 bg-blue-500/10 border-blue-500/20"
      case "negotiating":
        return "text-orange-600 bg-orange-500/10 border-orange-500/20"
      case "optimized":
        return "text-green-600 bg-green-500/10 border-green-500/20"
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
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Bill Optimization Engine
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                </CardTitle>
                <CardDescription>Automatically find better deals and negotiate lower bills</CardDescription>
              </div>
            </div>
            <Button onClick={scanForOpportunities} disabled={isScanning} className="gap-2">
              {isScanning ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Scan for Savings
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Monthly Bills</p>
                <p className="text-lg font-bold">${totalMonthlyBills.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Potential Savings</p>
                <p className="text-lg font-bold text-green-500">${totalPotentialSavings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Optimized Bills</p>
                <p className="text-lg font-bold">
                  {optimizedBills}/{bills.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Recommendations</p>
                <p className="text-lg font-bold">{recommendations.filter((r) => r.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Smart Recommendations</TabsTrigger>
          <TabsTrigger value="bills">My Bills</TabsTrigger>
          <TabsTrigger value="savings">Savings History</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations
            .filter((rec) => rec.status === "pending")
            .map((recommendation) => (
              <Card key={recommendation.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{recommendation.title}</h3>
                          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Current Cost</p>
                          <p className="font-semibold">${recommendation.currentCost.toFixed(2)}/mo</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">New Cost</p>
                          <p className="font-semibold text-green-600">${recommendation.newCost.toFixed(2)}/mo</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Monthly Savings</p>
                          <p className="font-semibold text-green-600">${recommendation.savings.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Annual Savings</p>
                          <p className="font-semibold text-green-600">${(recommendation.savings * 12).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <Badge className={getEffortColor(recommendation.effort)}>{recommendation.effort} effort</Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Confidence:</span>
                          <div className="flex items-center gap-1">
                            <Progress value={recommendation.confidence} className="w-16 h-2" />
                            <span className="text-sm font-medium">{recommendation.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRecommendationAction(recommendation.id, "declined")}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRecommendationAction(recommendation.id, "accepted")}
                        className="gap-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          {recommendations.filter((rec) => rec.status === "pending").length === 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground mb-4">
                  No new optimization opportunities found. We'll keep monitoring your bills.
                </p>
                <Button onClick={scanForOpportunities} variant="outline" className="gap-2 bg-transparent">
                  <Sparkles className="w-4 h-4" />
                  Scan Again
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bills" className="space-y-4">
          {bills.map((bill) => (
            <Card key={bill.id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center">
                      {bill.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{bill.name}</h3>
                      <p className="text-sm text-muted-foreground">{bill.provider}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold">${bill.currentAmount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Due {bill.dueDate}</p>
                    </div>

                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status === "active" && <Clock className="w-3 h-3 mr-1" />}
                      {bill.status === "negotiating" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {bill.status === "optimized" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {bill.status}
                    </Badge>

                    <div className="flex items-center gap-2">
                      <Label htmlFor={`auto-${bill.id}`} className="text-sm">
                        Auto-optimize
                      </Label>
                      <Switch
                        id={`auto-${bill.id}`}
                        checked={bill.autoOptimize}
                        onCheckedChange={() => handleAutoOptimizeToggle(bill.id)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Savings History</CardTitle>
              <CardDescription>Track your bill optimization success over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                      <Car className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Car Insurance Optimization</p>
                      <p className="text-sm text-muted-foreground">Switched to Progressive • March 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">$45/month saved</p>
                    <p className="text-xs text-muted-foreground">$540 annually</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Phone Plan Negotiation</p>
                      <p className="text-sm text-muted-foreground">T-Mobile retention discount • February 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">$25/month saved</p>
                    <p className="text-xs text-muted-foreground">$300 annually</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                      <Wifi className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Internet Plan Optimization</p>
                      <p className="text-sm text-muted-foreground">Switched to Xfinity promo • January 2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">$30/month saved</p>
                    <p className="text-xs text-muted-foreground">$360 annually</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Total Savings This Year</p>
                      <p className="text-sm text-muted-foreground">From bill optimization</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">$1,200</p>
                      <p className="text-sm text-muted-foreground">$100/month average</p>
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
