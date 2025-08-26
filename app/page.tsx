"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import PurchaseImpactAnalyzer from "@/components/purchase-impact-analyzer"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PiggyBank,
  Target,
  ArrowUpRight,
  DollarSign,
  Bell,
  Zap,
  Brain,
  Menu,
  Home,
  User,
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

const spendingData = [
  { name: "Food & Dining", value: 850, color: visionProColors[0] }, // iOS Blue
  { name: "Transportation", value: 420, color: visionProColors[1] }, // Purple
  { name: "Shopping", value: 680, color: visionProColors[2] }, // Violet
  { name: "Entertainment", value: 320, color: visionProColors[3] }, // Pink
  { name: "Bills & Utilities", value: 1200, color: visionProColors[4] }, // Red
]

const monthlyTrend = [
  { month: "Jan", spending: 3200, budget: 4000 },
  { month: "Feb", spending: 2800, budget: 4000 },
  { month: "Mar", spending: 3600, budget: 4000 },
  { month: "Apr", spending: 3470, budget: 4000 },
  { month: "May", spending: 3470, budget: 4000 },
]

const recentTransactions = [
  { id: 1, description: "Starbucks Coffee", amount: -12.5, category: "Food & Dining", date: "2 hours ago" },
  { id: 2, description: "Salary Deposit", amount: 3500.0, category: "Income", date: "1 day ago" },
  { id: 3, description: "Netflix Subscription", amount: -15.99, category: "Entertainment", date: "2 days ago" },
  { id: 4, description: "Uber Ride", amount: -18.75, category: "Transportation", date: "3 days ago" },
  { id: 5, description: "Amazon Purchase", amount: -89.99, category: "Shopping", date: "4 days ago" },
]

export default function FinTechDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [expandedSections, setExpandedSections] = useState({
    microInvesting: false,
    predictive: false,
    receiptScanner: false,
    billOptimization: false,
    behavioral: false,
    investment: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const totalSpent = spendingData.reduce((sum, item) => sum + item.value, 0)
  const monthlyBudget = 4000
  const remainingBudget = monthlyBudget - totalSpent
  const budgetProgress = (totalSpent / monthlyBudget) * 100

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/20 backdrop-blur-xl bg-white/10 dark:bg-black/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm"
                style={{
                  backgroundColor: `${visionProColors[0]}20`,
                  border: `1px solid ${visionProColors[0]}30`,
                  boxShadow: `0 0 20px ${visionProColors[0]}20`,
                }}
              >
                <Wallet className="w-5 h-5" style={{ color: visionProColors[0] }} />
              </div>
              <h1 className="text-lg font-bold text-foreground">FinanceFlow</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
                style={{ boxShadow: `0 0 15px ${visionProColors[1]}10` }}
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
                style={{ boxShadow: `0 0 15px ${visionProColors[1]}10` }}
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="relative mb-8 rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20 dark:border-white/10">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `linear-gradient(135deg, ${visionProColors[0]}20 0%, ${visionProColors[1]}20 50%, ${visionProColors[2]}20 100%)`,
            }}
          />
          <div className="relative p-6 bg-white/5 dark:bg-black/5">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Welcome back, Alex!</h2>
              <p className="text-sm text-muted-foreground">Your financial overview for May 2024</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 backdrop-blur-sm border border-white/20"
                  style={{
                    backgroundColor: `${visionProColors[0]}15`,
                    boxShadow: `0 0 30px ${visionProColors[0]}20`,
                  }}
                >
                  <DollarSign className="w-6 h-6" style={{ color: visionProColors[0] }} />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">$12,450</div>
                <div className="text-sm text-muted-foreground">Total Balance</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" style={{ color: visionProColors[7] }} />
                  <span className="text-xs" style={{ color: visionProColors[7] }}>
                    +2.5%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 backdrop-blur-sm border border-white/20"
                    style={{
                      backgroundColor: `${visionProColors[4]}15`,
                      boxShadow: `0 0 20px ${visionProColors[4]}20`,
                    }}
                  >
                    <CreditCard className="w-5 h-5" style={{ color: visionProColors[4] }} />
                  </div>
                  <div className="text-xl font-bold text-foreground mb-1">${totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Monthly Spending</div>
                </div>

                <div className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 backdrop-blur-sm border border-white/20"
                    style={{
                      backgroundColor: `${visionProColors[7]}15`,
                      boxShadow: `0 0 20px ${visionProColors[7]}20`,
                    }}
                  >
                    <PiggyBank className="w-5 h-5" style={{ color: visionProColors[7] }} />
                  </div>
                  <div className="text-xl font-bold text-foreground mb-1">$8,200</div>
                  <div className="text-xs text-muted-foreground">Savings Goal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground mb-1">Spending Breakdown</h3>
            <p className="text-sm text-muted-foreground">Your spending across different categories</p>
          </div>

          <div className="space-y-6">
            {/* Mobile-first pie chart */}
            <div className="relative">
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={6}
                      dataKey="value"
                      className="animate-pulse"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">${totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Spent</div>
                </div>
              </div>
            </div>

            {/* Budget progress */}
            <div className="relative p-4 rounded-xl" style={{ backgroundColor: `${visionProColors[0]}10` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold">Budget Progress</span>
                <Badge variant="secondary" className="text-xs">
                  {budgetProgress.toFixed(1)}% used
                </Badge>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out animate-pulse"
                  style={{
                    width: `${budgetProgress}%`,
                    background: `linear-gradient(90deg, ${visionProColors[7]} 0%, ${visionProColors[0]} 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Spent: ${totalSpent.toLocaleString()}</span>
                <span>Left: ${remainingBudget.toLocaleString()}</span>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="space-y-2">
              {spendingData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">${item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8 mb-8">
          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 hover:bg-white/20 dark:hover:bg-black/20"
                style={{
                  color: visionProColors[0],
                  boxShadow: `0 0 15px ${visionProColors[0]}10`,
                }}
              >
                View All
              </Button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentTransactions.slice(0, 4).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-2xl backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
                  style={{
                    boxShadow: `0 4px 20px ${transaction.amount > 0 ? visionProColors[7] : visionProColors[4]}10`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: transaction.amount > 0 ? `${visionProColors[7]}20` : `${visionProColors[4]}20`,
                      }}
                    >
                      {transaction.amount > 0 ? (
                        <TrendingUp className="w-4 h-4" style={{ color: visionProColors[7] }} />
                      ) : (
                        <TrendingDown className="w-4 h-4" style={{ color: visionProColors[4] }} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: transaction.amount > 0 ? visionProColors[7] : "hsl(var(--foreground))",
                      }}
                    >
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">AI Insights</h3>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" style={{ color: visionProColors[0] }} />
                <Zap className="w-3 h-3" style={{ color: visionProColors[6] }} />
              </div>
            </div>
            <div className="space-y-3">
              <div
                className="p-3 rounded-xl border-l-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20"
                style={{
                  borderLeftColor: visionProColors[0],
                  boxShadow: `0 4px 25px ${visionProColors[0]}15`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/30"
                    style={{
                      background: `linear-gradient(135deg, ${visionProColors[0]} 0%, ${visionProColors[1]} 100%)`,
                      boxShadow: `0 0 25px ${visionProColors[0]}30`,
                    }}
                  >
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: visionProColors[0] }}>
                      Great Progress!
                    </p>
                    <p className="text-xs mt-1" style={{ color: visionProColors[0] }}>
                      You're 18% under budget this month.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-3 rounded-xl border-l-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20"
                style={{
                  borderLeftColor: visionProColors[7],
                  boxShadow: `0 4px 25px ${visionProColors[7]}15`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/30"
                    style={{
                      background: `linear-gradient(135deg, ${visionProColors[7]} 0%, ${visionProColors[8]} 100%)`,
                      boxShadow: `0 0 25px ${visionProColors[7]}30`,
                    }}
                  >
                    <PiggyBank className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: visionProColors[7] }}>
                      Savings Tip
                    </p>
                    <p className="text-xs mt-1" style={{ color: visionProColors[7] }}>
                      Save $120/month by reducing dining out by 30%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-1">AI-Powered Features</h2>
            <p className="text-sm text-muted-foreground">Advanced tools to optimize your finances</p>
          </div>

          <PurchaseImpactAnalyzer />

          {/* AI Financial Coach - Mobile optimized */}
          <div className="relative">
            <div
              className="absolute -top-1 -left-1 w-4 h-4 rounded-full animate-pulse"
              style={{
                backgroundColor: visionProColors[0],
                boxShadow: `0 0 20px ${visionProColors[0]}50`,
              }}
            ></div>
            <div
              className="backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-2xl p-6 border border-white/20 dark:border-white/10"
              style={{ boxShadow: `0 8px 40px ${visionProColors[0]}10` }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/30"
                  style={{
                    background: `linear-gradient(135deg, ${visionProColors[0]} 0%, ${visionProColors[1]} 100%)`,
                    boxShadow: `0 0 25px ${visionProColors[0]}30`,
                  }}
                >
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2">AI Financial Coach</h3>
                  <div className="backdrop-blur-sm bg-white/20 dark:bg-black/20 rounded-xl p-3 border border-white/30">
                    <p className="text-xs text-muted-foreground mb-1">💬 Your AI assistant says:</p>
                    <p className="text-sm text-foreground">
                      "Based on your spending patterns, I recommend setting aside $200 more for your emergency fund."
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="text-xs rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${visionProColors[0]} 0%, ${visionProColors[1]} 100%)`,
                    boxShadow: `0 0 20px ${visionProColors[0]}30`,
                  }}
                >
                  Ask Question
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs rounded-full backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/30 hover:bg-white/20 dark:hover:bg-black/20"
                >
                  History
                </Button>
              </div>
            </div>
          </div>

          {/* Other AI features with mobile optimization */}

          <div
            className="backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl p-8 border border-white/20 dark:border-white/10"
            style={{ boxShadow: `0 8px 40px ${visionProColors[5]}10` }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Predictive Cash Flow</h3>
                  <p className="text-sm text-muted-foreground">Next 30 days forecast</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
              >
                ⚠️ Low Balance Alert
              </Badge>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Today</span>
                <span className="text-sm font-medium">30 Days</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full mb-4"></div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">$12,450</div>
                  <div className="text-xs text-muted-foreground">Current</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">$8,200</div>
                  <div className="text-xs text-muted-foreground">Week 1</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">$4,100</div>
                  <div className="text-xs text-muted-foreground">Week 2</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">$1,200</div>
                  <div className="text-xs text-muted-foreground">Week 3</div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl p-8 border border-white/20 dark:border-white/10"
            style={{ boxShadow: `0 8px 40px ${visionProColors[7]}10` }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Smart Receipt Scanner</h3>
                    <p className="text-sm text-muted-foreground">AI-powered expense tracking</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">23 receipts processed this month</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm">98.5% accuracy rate</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center border-4 border-dashed border-green-300 dark:border-green-700">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Drop receipt here</p>
                    <p className="text-xs text-muted-foreground">or click to upload</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl p-8 border border-white/20 dark:border-white/10"
            style={{ boxShadow: `0 8px 40px ${visionProColors[2]}10` }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Bill Optimization Engine</h3>
                  <p className="text-sm text-muted-foreground">Save money on subscriptions</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">$89</div>
                <div className="text-xs text-muted-foreground">Monthly Savings</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Netflix</span>
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    Expensive
                  </Badge>
                </div>
                <div className="text-lg font-bold">$15.99/mo</div>
                <div className="text-xs text-green-600">Save $3/mo with annual plan</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Spotify</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Optimized
                  </Badge>
                </div>
                <div className="text-lg font-bold">$9.99/mo</div>
                <div className="text-xs text-muted-foreground">Best available rate</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Phone Plan</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Review
                  </Badge>
                </div>
                <div className="text-lg font-bold">$85/mo</div>
                <div className="text-xs text-green-600">Save $25/mo with competitor</div>
              </div>
            </div>
          </div>

          <div
            className="backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl p-8 border border-white/20 dark:border-white/10"
            style={{ boxShadow: `0 8px 40px ${visionProColors[1]}10` }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Behavioral Insights</h3>
                <p className="text-sm text-muted-foreground">Understanding your spending psychology</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weekend Spending</span>
                    <span className="text-sm text-red-600">+40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Emotional Spending</span>
                    <span className="text-sm text-orange-600">Moderate</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <h4 className="font-semibold mb-3">💡 Insights</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• You spend 40% more on weekends</li>
                  <li>• Coffee purchases spike during stressful periods</li>
                  <li>• Best saving days: Tuesday & Wednesday</li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className="backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl p-8 border border-white/20 dark:border-white/10"
            style={{ boxShadow: `0 8px 40px ${visionProColors[8]}10` }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Investment Opportunities</h3>
                  <p className="text-sm text-muted-foreground">AI-powered market analysis</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                3 New Opportunities
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Tech Growth ETF</div>
                    <div className="text-sm text-muted-foreground">Low risk • High potential</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold">+12.5%</div>
                  <div className="text-xs text-muted-foreground">Expected return</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">S&P 500 Index</div>
                    <div className="text-sm text-muted-foreground">Stable • Long-term</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-blue-600 font-bold">+8.2%</div>
                  <div className="text-xs text-muted-foreground">Expected return</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 dark:bg-black/10 border-t border-white/20 dark:border-white/10">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
              activeTab === "dashboard" ? "bg-white/20 dark:bg-black/20" : "hover:bg-white/10 dark:hover:bg-black/10"
            }`}
            style={{
              color: activeTab === "dashboard" ? visionProColors[0] : "hsl(var(--muted-foreground))",
            }}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
              activeTab === "transactions" ? "bg-white/20 dark:bg-black/20" : "hover:bg-white/10 dark:hover:bg-black/10"
            }`}
            style={{
              color: activeTab === "transactions" ? visionProColors[0] : "hsl(var(--muted-foreground))",
            }}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs font-medium">Cards</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
              activeTab === "ai" ? "bg-white/20 dark:bg-black/20" : "hover:bg-white/10 dark:hover:bg-black/10"
            }`}
            style={{
              color: activeTab === "ai" ? visionProColors[0] : "hsl(var(--muted-foreground))",
            }}
          >
            <Zap className="w-5 h-5" />
            <span className="text-xs font-medium">AI</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
              activeTab === "profile" ? "bg-white/20 dark:bg-black/20" : "hover:bg-white/10 dark:hover:bg-black/10"
            }`}
            style={{
              color: activeTab === "profile" ? visionProColors[0] : "hsl(var(--muted-foreground))",
            }}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
