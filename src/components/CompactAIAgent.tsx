import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Platform, 
  Pressable 
} from "react-native";
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

export default function CompactAIAgent() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI assistant. Ask me about your spending, budgets, or financial goals!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  // Debug log to see if component is rendering
  console.log('[CompactAIAgent] Component rendered, isExpanded:', isExpanded);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const { transactions } = useTransactions();
  const { budgetCategories } = useBudgetCategories();
  const { upcomingBills } = useUpcomingBills();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isExpanded]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const processUserQuery = async (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    let response = "";
    
    // Uber spending query
    if (lowerQuery.includes("uber") && (lowerQuery.includes("spend") || lowerQuery.includes("last month"))) {
      const uberTransactions = transactions.filter(tx => 
        tx.merchant?.toLowerCase().includes("uber") && 
        tx.date.includes("week")
      );
      const total = uberTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      response = `Last week: ${formatCurrency(total)} on Uber (${uberTransactions.length} trips).`;
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
        response = `Biggest expense: ${biggestCategory[0]} (${formatCurrency(biggestCategory[1])})`;
      } else {
        response = "Need more transaction data to analyze categories.";
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
        response = `Excellent! Saving ${savingsRate.toFixed(1)}% - on track! 🎉`;
      } else if (savingsRate >= 10) {
        response = `Good progress! Saving ${savingsRate.toFixed(1)}% - aim for 20%.`;
      } else {
        response = `Currently saving ${savingsRate.toFixed(1)}% - try to reach 10-20%.`;
      }
    }
    
    // Next bills due
    else if (lowerQuery.includes("bill") && (lowerQuery.includes("due") || lowerQuery.includes("next"))) {
      if (upcomingBills.length > 0) {
        const nextBill = upcomingBills[0];
        response = `Next: ${nextBill.label} - ${formatCurrency(nextBill.amount)} on ${nextBill.date}`;
      } else {
        response = "No upcoming bills in the next 7-10 days! 🎉";
      }
    }
    
    // Default response
    else {
      const responses = [
        "I can help with spending analysis, budget tracking, and financial goals!",
        "Ask me about your transactions, savings rate, or upcoming bills.",
        "Try: 'What's my biggest expense?' or 'Am I saving enough?'",
        "I'm here to help with your financial questions!"
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    setIsTyping(false);
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    
    await processUserQuery(userMessage.text);
  };

  const containerWidth = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [56, 320], // From arrow button width to chat panel width
  });

  return (
    <Animated.View style={[styles.container, { width: containerWidth }]}>
      {!isExpanded ? (
        // Collapsed: Show arrow button
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={() => setIsExpanded(true)}
        >
          <Text style={styles.arrowText}>💬</Text>
          <Text style={styles.arrowLabel}>AI</Text>
        </TouchableOpacity>
      ) : (
        // Expanded: Show chat interface
        <View style={styles.chatPanel}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsExpanded(false)}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>
          
          {/* Messages */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View key={message.id} style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}>
                <Text style={[
                  styles.messageText,
                  message.isUser ? styles.userMessageText : styles.aiMessageText
                ]}>
                  {message.text}
                </Text>
              </View>
            ))}
            
            {isTyping && (
              <View style={[styles.messageContainer, styles.aiMessage]}>
                <Text style={styles.typingText}>Thinking...</Text>
              </View>
            )}
          </ScrollView>
          
          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything..."
              placeholderTextColor={COLORS.mute}
              multiline
              maxLength={200}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity 
              style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    top: 100,
    height: 400,
    zIndex: 9999,
    elevation: 10, // Android elevation
  },
  
  // Arrow button (collapsed state)
  arrowButton: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.purple,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2, // Add border for debugging
    borderColor: 'red', // Make it very visible for debugging
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: -2, height: 2 },
      },
      android: { elevation: 4 },
      web: { boxShadow: "-2px 2px 8px rgba(0,0,0,0.15)" },
    }),
  },
  arrowText: {
    fontSize: 20,
    marginBottom: 2,
  },
  arrowLabel: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
  
  // Chat panel (expanded state)
  chatPanel: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: -4, height: 0 },
      },
      android: { elevation: 6 },
      web: { boxShadow: "-4px 0px 12px rgba(0,0,0,0.1)" },
    }),
  },
  
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 18,
    color: COLORS.mute,
    fontWeight: "500",
  },
  
  // Messages
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: "85%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.blue,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.border,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  userMessageText: {
    color: "white",
  },
  aiMessageText: {
    color: COLORS.text,
  },
  typingText: {
    fontSize: 14,
    color: COLORS.mute,
    fontStyle: "italic",
  },
  
  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.text,
    maxHeight: 80,
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});