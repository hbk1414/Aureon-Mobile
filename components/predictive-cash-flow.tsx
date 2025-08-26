"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, Target, Zap, Brain } from "lucide-react"

const cashFlowPrediction = [
  { date: "Today", actual: 12450, predicted: 12450, income: 0, expenses: 0 },
  { date: "Tomorrow", actual: null, predicted: 12380, income: 0, expenses: 70 },
  { date: "3 Days", actual: null, predicted: 12200, income: 0, expenses: 180 },
  { date: "1 Week", actual: null, predicted: 11950, income: 0, expenses: 250 },
  { date: "2 Weeks", actual: null, predicted: 15200, income: 3500, expenses: 250 },
  { date: "3 Weeks", actual: null, predicted: 14800, income: 0, expenses: 400 },
  { date: "1 Month", actual: null, predicted: 17950, income: 3500, expenses: 350 },
]

const riskAnalysis = [
  {
    risk: "Low Balance Alert",
    probability: 15,
    impact: "Medium",
    date: "In 10 days",
    description: "Balance may drop below $500 if current spending continues",
    color: "orange",
  },
  {
    risk: "Bill Payment Risk",
    probability: 8,
    impact: "High",
    date: "In 5 days",
    description: "Rent payment of $1,200 due with potential insufficient funds",
    color: "red",
  },
  {
    risk: "Overdraft Risk",
    probability: 3,
    impact: "High",
    date: "In 2 weeks",
    description: "Possible overdraft if unexpected expense occurs",
    color: "red",
  },
]

const spendingPatterns = [
  { category: "Groceries", avgWeekly: 120, predictedNext: 135, trend: "up" },
  { category: "Dining Out", avgWeekly: 85, predictedNext: 75, trend: "down" },
  { category: "Transportation", avgWeekly: 45, predictedNext: 50, trend: "up" },
  { category: "Entertainment", avgWeekly: 60, predictedNext: 80, trend: "up" },
  { category: "Shopping", avgWeekly: 95, predictedNext: 70, trend: "down" },
]

const upcomingEvents = [
  { event: "Salary Deposit", amount: 3500, date: "In 12 days", type: "income" },
  { event: "Rent Payment", amount: -1200, date: "In 5 days", type: "expense" },
  { event: "Car Insurance", amount: -180, date: "In 8 days", type: "expense" },
  { event: "Freelance Payment", amount: 800, date: "In 18 days", type: "income" },
]

export function PredictiveCashFlow() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1month")

  const getBalanceStatus = (predicted: number) => {
    if (predicted < 1000) return { status: "critical", color: "text-red-500", bg: "bg-red-500/10" }
    if (predicted < 3000) return { status: "warning", color: "text-orange-500", bg: "bg-orange-500/10" }
    return { status: "healthy", color: "text-green-500", bg: "bg-green-500/10" }
  }

  const currentBalance = 12450
  const predictedBalance = cashFlowPrediction[cashFlowPrediction.length - 1].predicted
  const balanceChange = predictedBalance - currentBalance
  const balanceStatus = getBalanceStatus(predictedBalance)

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Predictive Cash Flow
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                    <Zap className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                </CardTitle>
                <CardDescription>AI-powered financial forecasting and risk analysis</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Predicted Balance (30 days)</p>
              <p className={`text-2xl font-bold ${balanceStatus.color}`}>${predictedBalance.toLocaleString()}</p>
              <div className="flex items-center gap-1 justify-end">
                {balanceChange > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${balanceChange > 0 ? "text-green-500" : "text-red-500"}`}>
                  {balanceChange > 0 ? "+" : ""}${balanceChange.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="forecast" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecast">Cash Flow Forecast</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Spending Patterns</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>30-Day Cash Flow Prediction</CardTitle>
              <CardDescription>AI analysis of your income, expenses, and balance trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowPrediction}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name) => [
                        `$${value?.toLocaleString()}`,
                        name === "predicted" ? "Predicted Balance" : "Actual Balance",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expected Income</p>
                    <p className="text-lg font-bold text-green-500">+$4,300</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Predicted Expenses</p>
                    <p className="text-lg font-bold text-red-500">-$1,800</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Net Change</p>
                    <p className="text-lg font-bold text-blue-500">+$2,500</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Financial Risk Assessment</CardTitle>
              <CardDescription>Potential financial risks based on your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAnalysis.map((risk, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      risk.color === "red"
                        ? "bg-red-500/10 border-red-500/20"
                        : risk.color === "orange"
                          ? "bg-orange-500/10 border-orange-500/20"
                          : "bg-yellow-500/10 border-yellow-500/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            risk.color === "red"
                              ? "bg-red-500/20"
                              : risk.color === "orange"
                                ? "bg-orange-500/20"
                                : "bg-yellow-500/20"
                          }`}
                        >
                          <AlertTriangle
                            className={`w-4 h-4 ${
                              risk.color === "red"
                                ? "text-red-500"
                                : risk.color === "orange"
                                  ? "text-orange-500"
                                  : "text-yellow-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{risk.risk}</h4>
                            <Badge
                              variant="secondary"
                              className={
                                risk.impact === "High"
                                  ? "bg-red-500/10 text-red-600 border-red-500/20"
                                  : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                              }
                            >
                              {risk.impact} Impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                          <p className="text-xs text-muted-foreground">{risk.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{risk.probability}%</p>
                        <p className="text-xs text-muted-foreground">Probability</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>AI Spending Pattern Analysis</CardTitle>
              <CardDescription>Predicted changes in your spending behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spendingPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium">{pattern.category}</h4>
                        <p className="text-sm text-muted-foreground">Avg: ${pattern.avgWeekly}/week</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">${pattern.predictedNext}</p>
                        <p className="text-xs text-muted-foreground">Next week</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {pattern.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        )}
                        <span className={`text-sm ${pattern.trend === "up" ? "text-red-500" : "text-green-500"}`}>
                          {pattern.trend === "up" ? "+" : "-"}${Math.abs(pattern.predictedNext - pattern.avgWeekly)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming Financial Events</CardTitle>
              <CardDescription>Scheduled income and expenses affecting your cash flow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.type === "income" ? "bg-green-500/10" : "bg-red-500/10"
                        }`}
                      >
                        {event.type === "income" ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{event.event}</h4>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          event.type === "income" ? "text-green-500" : "text-foreground"
                        }`}
                      >
                        {event.amount > 0 ? "+" : ""}${Math.abs(event.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
