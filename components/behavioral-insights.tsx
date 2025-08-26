"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Brain, Clock, MapPin, Heart, AlertTriangle, Target, Lightbulb, Zap, Moon } from "lucide-react"

interface SpendingTrigger {
  id: string
  trigger: string
  category: string
  averageAmount: number
  frequency: number
  confidence: number
  impact: "high" | "medium" | "low"
  suggestion: string
}

interface TimePattern {
  hour: number
  amount: number
  transactions: number
  category: string
}

interface LocationPattern {
  location: string
  amount: number
  frequency: number
  category: string
  risk: "high" | "medium" | "low"
}

interface MoodSpending {
  mood: string
  amount: number
  category: string
  frequency: number
  icon: React.ReactNode
}

const spendingTriggers: SpendingTrigger[] = [
  {
    id: "1",
    trigger: "Stress Eating",
    category: "Food & Dining",
    averageAmount: 45.5,
    frequency: 12,
    confidence: 89,
    impact: "high",
    suggestion: "Try the 10-minute rule: wait 10 minutes before ordering food when stressed",
  },
  {
    id: "2",
    trigger: "Weekend Shopping",
    category: "Shopping",
    averageAmount: 127.3,
    frequency: 8,
    confidence: 76,
    impact: "high",
    suggestion: "Create a weekend shopping list on Friday to avoid impulse purchases",
  },
  {
    id: "3",
    trigger: "Late Night Purchases",
    category: "Entertainment",
    averageAmount: 23.8,
    frequency: 15,
    confidence: 82,
    impact: "medium",
    suggestion: "Set a phone reminder to review purchases after 9 PM before confirming",
  },
  {
    id: "4",
    trigger: "Social Pressure",
    category: "Entertainment",
    averageAmount: 89.2,
    frequency: 6,
    confidence: 71,
    impact: "medium",
    suggestion: "Suggest budget-friendly alternatives when friends propose expensive activities",
  },
]

const timePatterns: TimePattern[] = [
  { hour: 6, amount: 12, transactions: 2, category: "Coffee" },
  { hour: 7, amount: 8, transactions: 1, category: "Transport" },
  { hour: 8, amount: 15, transactions: 3, category: "Coffee" },
  { hour: 9, amount: 5, transactions: 1, category: "Snacks" },
  { hour: 12, amount: 25, transactions: 4, category: "Lunch" },
  { hour: 13, amount: 18, transactions: 2, category: "Lunch" },
  { hour: 15, amount: 8, transactions: 2, category: "Coffee" },
  { hour: 17, amount: 12, transactions: 1, category: "Transport" },
  { hour: 19, amount: 45, transactions: 3, category: "Dinner" },
  { hour: 20, amount: 35, transactions: 2, category: "Entertainment" },
  { hour: 21, amount: 28, transactions: 4, category: "Online Shopping" },
  { hour: 22, amount: 15, transactions: 2, category: "Subscriptions" },
]

const locationPatterns: LocationPattern[] = [
  { location: "Near Office", amount: 340, frequency: 45, category: "Food & Dining", risk: "medium" },
  { location: "Shopping Mall", amount: 890, frequency: 12, category: "Shopping", risk: "high" },
  { location: "Coffee Shops", amount: 180, frequency: 28, category: "Food & Dining", risk: "low" },
  { location: "Gas Stations", amount: 220, frequency: 8, category: "Transportation", risk: "low" },
  { location: "Bars & Restaurants", amount: 450, frequency: 16, category: "Entertainment", risk: "high" },
]

const moodSpending: MoodSpending[] = [
  {
    mood: "Stressed",
    amount: 156,
    category: "Food & Dining",
    frequency: 18,
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  { mood: "Happy", amount: 89, category: "Entertainment", frequency: 12, icon: <Heart className="w-4 h-4" /> },
  { mood: "Bored", amount: 67, category: "Shopping", frequency: 15, icon: <Clock className="w-4 h-4" /> },
  { mood: "Tired", amount: 34, category: "Food & Dining", frequency: 22, icon: <Moon className="w-4 h-4" /> },
  { mood: "Excited", amount: 123, category: "Shopping", frequency: 8, icon: <Zap className="w-4 h-4" /> },
]

const weeklyPattern = [
  { day: "Mon", amount: 45, mood: "neutral" },
  { day: "Tue", amount: 38, mood: "good" },
  { day: "Wed", amount: 52, mood: "stressed" },
  { day: "Thu", amount: 41, mood: "good" },
  { day: "Fri", amount: 78, mood: "excited" },
  { day: "Sat", amount: 125, mood: "happy" },
  { day: "Sun", amount: 89, mood: "relaxed" },
]

export function BehavioralInsights() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")

  const totalTriggerSpending = spendingTriggers.reduce(
    (sum, trigger) => sum + trigger.averageAmount * trigger.frequency,
    0,
  )
  const highImpactTriggers = spendingTriggers.filter((trigger) => trigger.impact === "high").length
  const averageConfidence =
    spendingTriggers.reduce((sum, trigger) => sum + trigger.confidence, 0) / spendingTriggers.length

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-500/10 border-red-500/20"
      case "medium":
        return "text-orange-600 bg-orange-500/10 border-orange-500/20"
      case "low":
        return "text-green-600 bg-green-500/10 border-green-500/20"
      default:
        return "text-gray-600 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-600 bg-red-500/10 border-red-500/20"
      case "medium":
        return "text-orange-600 bg-orange-500/10 border-orange-500/20"
      case "low":
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Behavioral Insights Engine
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                    <Brain className="w-3 h-3 mr-1" />
                    Psychology AI
                  </Badge>
                </CardTitle>
                <CardDescription>Understand your spending psychology and emotional triggers</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Analysis Confidence</p>
              <div className="flex items-center gap-2">
                <Progress value={averageConfidence} className="w-20 h-2" />
                <span className="text-sm font-medium">{averageConfidence.toFixed(0)}%</span>
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
              <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Trigger Spending</p>
                <p className="text-lg font-bold text-red-500">${totalTriggerSpending.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium">High Impact Triggers</p>
                <p className="text-lg font-bold">{highImpactTriggers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Peak Spending Time</p>
                <p className="text-lg font-bold">9 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Actionable Insights</p>
                <p className="text-lg font-bold">{spendingTriggers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="triggers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="triggers">Spending Triggers</TabsTrigger>
          <TabsTrigger value="patterns">Time Patterns</TabsTrigger>
          <TabsTrigger value="locations">Location Analysis</TabsTrigger>
          <TabsTrigger value="moods">Mood Spending</TabsTrigger>
        </TabsList>

        <TabsContent value="triggers" className="space-y-4">
          {spendingTriggers.map((trigger) => (
            <Card key={trigger.id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{trigger.trigger}</h3>
                        <p className="text-sm text-muted-foreground">{trigger.category}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Average Amount</p>
                        <p className="font-semibold">${trigger.averageAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Monthly Frequency</p>
                        <p className="font-semibold">{trigger.frequency}x</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Monthly Impact</p>
                        <p className="font-semibold text-red-600">
                          ${(trigger.averageAmount * trigger.frequency).toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <div className="flex items-center gap-1">
                          <Progress value={trigger.confidence} className="w-12 h-2" />
                          <span className="text-sm font-medium">{trigger.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getImpactColor(trigger.impact)}>{trigger.impact} impact</Badge>
                    </div>

                    <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">{trigger.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Daily Spending Patterns</CardTitle>
              <CardDescription>Your spending behavior throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timePatterns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(hour) => `${hour}:00`}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name) => [`$${value}`, "Average Spending"]}
                      labelFormatter={(hour) => `${hour}:00`}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Weekly Spending & Mood Correlation</CardTitle>
              <CardDescription>How your mood affects your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyPattern}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name) => [`$${value}`, "Daily Spending"]}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Location-Based Spending Analysis</CardTitle>
              <CardDescription>Where you spend the most and risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationPatterns.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{location.location}</h4>
                        <p className="text-sm text-muted-foreground">{location.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">${location.amount.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">{location.frequency} visits</p>
                      </div>
                      <Badge className={getRiskColor(location.risk)}>{location.risk} risk</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moods" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Emotional Spending Analysis</CardTitle>
              <CardDescription>How different moods influence your spending behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moodSpending.map((mood, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                        {mood.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">When {mood.mood}</h4>
                        <p className="text-sm text-muted-foreground">{mood.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">${mood.amount.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">{mood.frequency}x per month</p>
                      </div>
                      <div className="w-16">
                        <Progress value={(mood.amount / 200) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Behavioral Recommendations</CardTitle>
              <CardDescription>Personalized strategies to improve your spending habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-300">Stress Management</p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Try meditation or a 5-minute walk before making purchases when stressed. This could save you
                        $156/month.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-300">Time-Based Limits</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Set spending limits after 9 PM when you're most vulnerable to impulse purchases.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-700 dark:text-purple-300">Mood Tracking</p>
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                        Log your mood before purchases to build awareness of emotional spending patterns.
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
