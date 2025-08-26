"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, Scan, CheckCircle, AlertCircle, Edit3 } from "lucide-react"

interface ScannedItem {
  id: string
  name: string
  price: number
  category: string
  quantity: number
  taxDeductible: boolean
}

interface Receipt {
  id: string
  merchant: string
  date: string
  total: number
  items: ScannedItem[]
  category: string
  status: "processing" | "completed" | "error"
  image?: string
}

const mockReceipts: Receipt[] = [
  {
    id: "1",
    merchant: "Whole Foods Market",
    date: "2024-05-15",
    total: 87.43,
    category: "Groceries",
    status: "completed",
    items: [
      { id: "1", name: "Organic Bananas", price: 4.99, category: "Groceries", quantity: 1, taxDeductible: false },
      { id: "2", name: "Almond Milk", price: 5.49, category: "Groceries", quantity: 2, taxDeductible: false },
      { id: "3", name: "Chicken Breast", price: 12.99, category: "Groceries", quantity: 1, taxDeductible: false },
      { id: "4", name: "Mixed Vegetables", price: 8.99, category: "Groceries", quantity: 1, taxDeductible: false },
    ],
  },
  {
    id: "2",
    merchant: "Office Depot",
    date: "2024-05-14",
    total: 156.78,
    category: "Business",
    status: "completed",
    items: [
      { id: "5", name: "Laptop Stand", price: 89.99, category: "Office Supplies", quantity: 1, taxDeductible: true },
      { id: "6", name: "Wireless Mouse", price: 45.99, category: "Office Supplies", quantity: 1, taxDeductible: true },
      { id: "7", name: "Notebook Pack", price: 20.8, category: "Office Supplies", quantity: 4, taxDeductible: true },
    ],
  },
  {
    id: "3",
    merchant: "Starbucks",
    date: "2024-05-13",
    total: 12.5,
    category: "Food & Dining",
    status: "processing",
    items: [],
  },
]

const categories = [
  "Groceries",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Business",
  "Office Supplies",
  "Healthcare",
  "Utilities",
  "Other",
]

export function ReceiptScanner() {
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts)
  const [isScanning, setIsScanning] = useState(false)
  const [editingReceipt, setEditingReceipt] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsScanning(true)

    // Simulate AI processing
    setTimeout(() => {
      const newReceipt: Receipt = {
        id: Date.now().toString(),
        merchant: "Target",
        date: new Date().toISOString().split("T")[0],
        total: 45.67,
        category: "Shopping",
        status: "completed",
        items: [
          {
            id: Date.now().toString(),
            name: "Household Cleaner",
            price: 8.99,
            category: "Household",
            quantity: 1,
            taxDeductible: false,
          },
          {
            id: (Date.now() + 1).toString(),
            name: "Paper Towels",
            price: 12.49,
            category: "Household",
            quantity: 2,
            taxDeductible: false,
          },
          {
            id: (Date.now() + 2).toString(),
            name: "Laundry Detergent",
            price: 24.19,
            category: "Household",
            quantity: 1,
            taxDeductible: false,
          },
        ],
      }

      setReceipts((prev) => [newReceipt, ...prev])
      setIsScanning(false)
    }, 3000)
  }

  const handleCameraCapture = () => {
    setIsScanning(true)

    // Simulate camera capture and AI processing
    setTimeout(() => {
      const newReceipt: Receipt = {
        id: Date.now().toString(),
        merchant: "McDonald's",
        date: new Date().toISOString().split("T")[0],
        total: 8.99,
        category: "Food & Dining",
        status: "completed",
        items: [
          {
            id: Date.now().toString(),
            name: "Big Mac Meal",
            price: 8.99,
            category: "Food & Dining",
            quantity: 1,
            taxDeductible: false,
          },
        ],
      }

      setReceipts((prev) => [newReceipt, ...prev])
      setIsScanning(false)
    }, 3000)
  }

  const updateReceiptCategory = (receiptId: string, category: string) => {
    setReceipts((prev) => prev.map((receipt) => (receipt.id === receiptId ? { ...receipt, category } : receipt)))
  }

  const updateItemCategory = (receiptId: string, itemId: string, category: string) => {
    setReceipts((prev) =>
      prev.map((receipt) =>
        receipt.id === receiptId
          ? {
              ...receipt,
              items: receipt.items.map((item) => (item.id === itemId ? { ...item, category } : item)),
            }
          : receipt,
      ),
    )
  }

  const toggleTaxDeductible = (receiptId: string, itemId: string) => {
    setReceipts((prev) =>
      prev.map((receipt) =>
        receipt.id === receiptId
          ? {
              ...receipt,
              items: receipt.items.map((item) =>
                item.id === itemId ? { ...item, taxDeductible: !item.taxDeductible } : item,
              ),
            }
          : receipt,
      ),
    )
  }

  const totalTaxDeductible = receipts.reduce(
    (sum, receipt) =>
      sum + receipt.items.filter((item) => item.taxDeductible).reduce((itemSum, item) => itemSum + item.price, 0),
    0,
  )

  const monthlySpending = receipts.reduce((sum, receipt) => sum + receipt.total, 0)

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Scan className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Smart Receipt Scanner
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                    <Camera className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                </CardTitle>
                <CardDescription>Automatically categorize expenses and track tax deductions</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCameraCapture} disabled={isScanning} className="gap-2">
                <Camera className="w-4 h-4" />
                Take Photo
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Scan className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Receipts Scanned</p>
                <p className="text-lg font-bold">{receipts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Tax Deductible</p>
                <p className="text-lg font-bold text-green-500">${totalTaxDeductible.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Monthly Total</p>
                <p className="text-lg font-bold">${monthlySpending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Scans</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="deductions">Tax Deductions</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {isScanning && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Scan className="w-4 h-4 text-blue-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-medium">Processing receipt...</p>
                    <p className="text-sm text-muted-foreground">AI is analyzing your receipt and categorizing items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {receipts.map((receipt) => (
            <Card key={receipt.id} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        receipt.status === "completed"
                          ? "bg-green-500/10"
                          : receipt.status === "processing"
                            ? "bg-blue-500/10"
                            : "bg-red-500/10"
                      }`}
                    >
                      {receipt.status === "completed" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : receipt.status === "processing" ? (
                        <Scan className="w-4 h-4 text-blue-500 animate-pulse" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{receipt.merchant}</h3>
                      <p className="text-sm text-muted-foreground">{receipt.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={receipt.category}
                      onValueChange={(value) => updateReceiptCategory(receipt.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-lg font-bold">${receipt.total.toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingReceipt(editingReceipt === receipt.id ? null : receipt.id)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {editingReceipt === receipt.id && receipt.items.length > 0 && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Items</h4>
                    {receipt.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select
                            value={item.category}
                            onValueChange={(value) => updateItemCategory(receipt.id, item.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant={item.taxDeductible ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleTaxDeductible(receipt.id, item.id)}
                            className="text-xs"
                          >
                            {item.taxDeductible ? "Tax Deductible" : "Personal"}
                          </Button>
                          <p className="font-bold text-sm w-16 text-right">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Automatically categorized from your receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => {
                  const categoryTotal = receipts
                    .filter((receipt) => receipt.category === category)
                    .reduce((sum, receipt) => sum + receipt.total, 0)

                  if (categoryTotal === 0) return null

                  return (
                    <div key={category} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{category}</p>
                        <p className="text-sm text-muted-foreground">
                          {receipts.filter((receipt) => receipt.category === category).length} receipts
                        </p>
                      </div>
                      <p className="font-bold">${categoryTotal.toFixed(2)}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Tax Deductible Items</CardTitle>
              <CardDescription>Items marked as business or tax deductible expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receipts.map((receipt) => {
                  const deductibleItems = receipt.items.filter((item) => item.taxDeductible)
                  if (deductibleItems.length === 0) return null

                  return (
                    <div key={receipt.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{receipt.merchant}</h4>
                        <p className="text-sm text-muted-foreground">{receipt.date}</p>
                      </div>
                      {deductibleItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20"
                        >
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                          <p className="font-bold text-green-600">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
