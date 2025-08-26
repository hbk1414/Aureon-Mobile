"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Sparkles, MessageCircle } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const aiSuggestions = [
  "How can I reduce my spending?",
  "Should I increase my savings goal?",
  "What's my biggest expense category?",
  "Help me create a budget plan",
  "When should I invest more?",
  "Analyze my spending patterns",
]

const aiResponses = {
  "reduce spending":
    "Based on your data, I notice you're spending $850 on dining out. Try meal prepping 3 days a week - you could save $200-300 monthly! Also, consider switching to a cheaper phone plan to save $30/month.",
  "savings goal":
    "Great question! You're currently at 82% of your $10,000 goal. Since you're under budget by $530 this month, I recommend increasing your goal to $12,000 and setting up automatic transfers of $400/month.",
  "biggest expense":
    "Your biggest expense is Bills & Utilities at $1,200/month. I've found 3 ways to reduce this: switch to a cheaper internet plan (-$25/month), use smart thermostats (-$40/month), and bundle insurance (-$60/month).",
  "budget plan":
    "Perfect! Based on your $3,470 spending pattern, here's an optimized budget: Housing (30% - $1,200), Food (20% - $600), Transportation (10% - $300), Entertainment (8% - $240), Savings (25% - $750), Miscellaneous (7% - $210).",
  "invest more":
    "Your micro-investing is doing well! With $530 left in your budget, consider investing an additional $200/month in your Global ETF fund. Your risk tolerance suggests this could grow to $2,800 over the next year.",
  "spending patterns":
    "I've analyzed your habits: You spend 40% more on weekends, 60% of dining expenses are after 6PM (stress eating?), and you overspend by $150 when you shop online late at night. Try the 24-hour rule for purchases over $50!",
}

export function AIFinancialCoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi Alex! I'm your AI Financial Coach. I've analyzed your spending patterns and I'm here to help you optimize your finances. What would you like to know?",
      timestamp: new Date(),
      suggestions: aiSuggestions.slice(0, 3),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    for (const [key, response] of Object.entries(aiResponses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }

    // Default responses for common patterns
    if (lowerMessage.includes("help") || lowerMessage.includes("advice")) {
      return "I'm here to help! I can analyze your spending patterns, suggest budget optimizations, help with savings goals, and provide personalized financial advice. What specific area would you like to focus on?"
    }

    if (lowerMessage.includes("thank")) {
      return "You're welcome! I'm always here to help you achieve your financial goals. Is there anything else you'd like to know about your finances?"
    }

    return "That's an interesting question! Based on your current financial data, I'd recommend focusing on your top spending categories first. Would you like me to analyze your spending patterns or help you create a specific action plan?"
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(content),
        timestamp: new Date(),
        suggestions: aiSuggestions
          .filter((s) => !content.toLowerCase().includes(s.toLowerCase().split(" ")[0]))
          .slice(0, 2),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <Card className="border-0 shadow-sm h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              AI Financial Coach
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Smart
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Personalized financial guidance powered by AI</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  {message.type === "ai" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {message.type === "user" && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>

                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-11">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 bg-transparent hover:bg-primary/10"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 pb-6">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about your finances..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
              className="flex-1"
            />
            <Button onClick={() => handleSendMessage(inputValue)} disabled={!inputValue.trim() || isTyping} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
