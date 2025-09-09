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
  console.log('[CompactAIAgent] Component starting to render...');
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  console.log('[CompactAIAgent] Component rendered, isExpanded:', isExpanded);

  // Simple test - just show the button

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.arrowButton}
        onPress={() => {
          console.log('[CompactAIAgent] Button pressed!');
          setIsExpanded(!isExpanded);
        }}
      >
        <Text style={styles.arrowText}>💬</Text>
        <Text style={styles.arrowLabel}>AI</Text>
      </TouchableOpacity>
    </View>
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