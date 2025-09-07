import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useTransactions, useBudgetCategories, useUpcomingBills, formatCurrency } from "../services/dataService";

const COLORS = {
  bg: "#F7F8FB",
  card: "#FFFFFF",
  border: "#EAECEF",
  text: "#0F172A",
  mute: "#6B7280",
  blue: "#007AFF",
  green: "#30D158",
  red: "#FF3B30",
  orange: "#FF9F0A",
  purple: "#5856D6",
  violet: "#AF52DE",
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatbotProps {
  onClose?: () => void;
}

export default function AIChatbot({ onClose }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI financial assistant. Ask me anything about your spending, budgets, or financial goals. For example:\n\n• How much did I spend on Uber last month?\n• What's my biggest expense category?\n• Am I on track with my savings?\n• When are my next bills due?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { transactions } = useTransactions();
  const { budgetCategories } = useBudgetCategories();
  const { upcomingBills } = useUpcomingBills();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const processUserQuery = async (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Simulate AI processing
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    let response = "";
    
    // Uber spending query
    if (lowerQuery.includes("uber") && (lowerQuery.includes("spend") || lowerQuery.includes("last month"))) {
      const uberTransactions = transactions.filter(tx => 
        tx.merchant?.toLowerCase().includes("uber") && 
        tx.date.includes("week")
      );
      const total = uberTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      response = `In the last week, you spent ${formatCurrency(total)} on Uber rides across ${uberTransactions.length} trips.`;
    }
    
    // Biggest expense category
    else if (lowerQuery.includes("biggest") && lowerQuery.includes("expense")) {
      const categoryTotals: { [key: string]: number } = {};
      transactions.forEach(tx => {
        if (tx.amount < 0) {
          categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + Math.abs(tx.amount);
        }
      });
      
      const biggestCategory = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (biggestCategory) {
        response = `Your biggest expense category is ${biggestCategory[0]} with ${formatCurrency(biggestCategory[1])} spent this month.`;
      } else {
        response = "I don't have enough transaction data to determine your biggest expense category yet.";
      }
    }
    
    // Savings progress
    else if (lowerQuery.includes("savings") && (lowerQuery.includes("track") || lowerQuery.includes("progress"))) {
      const totalIncome = transactions
        .filter(tx => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0);
      const totalExpenses = transactions
        .filter(tx => tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      const savings = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
      
      if (savingsRate >= 20) {
        response = `Excellent! You're saving ${savingsRate.toFixed(1)}% of your income. You're on track for your financial goals! 🎉`;
      } else if (savingsRate >= 10) {
        response = `Good progress! You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing this to 20% for better financial security.`;
      } else {
        response = `You're currently saving ${savingsRate.toFixed(1)}% of your income. Try to increase this to at least 10-20% for better financial health.`;
      }
    }
    
    // Next bills due
    else if (lowerQuery.includes("bill") && (lowerQuery.includes("due") || lowerQuery.includes("next"))) {
      if (upcomingBills.length > 0) {
        const nextBill = upcomingBills[0];
        response = `Your next bill is ${nextBill.label} for ${formatCurrency(nextBill.amount)}, due ${nextBill.date}. You have ${upcomingBills.length} bills coming up in the next 7-10 days.`;
      } else {
        response = "Great news! You have no upcoming bills in the next 7-10 days. 🎉";
      }
    }
    
    // Budget status
    else if (lowerQuery.includes("budget") && (lowerQuery.includes("status") || lowerQuery.includes("track"))) {
      const overBudgetCategories = budgetCategories.filter(cat => cat.spent > cat.limit);
      if (overBudgetCategories.length > 0) {
        const categoryNames = overBudgetCategories.map(cat => cat.name).join(", ");
        response = `⚠️ You're currently over budget in: ${categoryNames}. Consider reducing spending in these areas.`;
      } else {
        response = "✅ You're doing great! All your budget categories are within their limits. Keep up the good work!";
      }
    }
    
    // General financial health
    else if (lowerQuery.includes("financial") && lowerQuery.includes("health")) {
      const totalIncome = transactions
        .filter(tx => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0);
      const totalExpenses = transactions
        .filter(tx => tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      const savings = totalIncome - totalExpenses;
      
      if (savings > 0) {
        response = `Your financial health looks good! You're spending less than you earn and building savings. Your current balance is ${formatCurrency(savings)}.`;
      } else {
        response = "⚠️ Your expenses are currently exceeding your income. Consider reviewing your spending habits and creating a budget to get back on track.";
      }
    }
    
    // Default response
    else {
      response = "I'm not sure I understood that question. Try asking about:\n\n• Your spending in specific categories\n• Budget status and progress\n• Upcoming bills and payments\n• Savings goals and progress\n• General financial health";
    }
    
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    
    const aiResponse = await processUserQuery(inputText.trim());
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.aiMessageText,
      ]}>
        {message.text}
      </Text>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Financial Assistant</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <Text style={styles.typingText}>AI is typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about your finances..."
          placeholderTextColor={COLORS.mute}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 0, // Remove border radius for full width
    borderWidth: 0, // Remove borders
    borderColor: "transparent",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.mute + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.mute,
    fontWeight: "600",
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.blue,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.bg,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: COLORS.card,
  },
  aiMessageText: {
    color: COLORS.text,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.mute,
    marginTop: 4,
    textAlign: "right",
  },
  typingText: {
    fontSize: 14,
    color: COLORS.mute,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginLeft: 12,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.mute,
  },
  sendButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: "600",
  },
});
