import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Text, View, Modal } from "react-native";

// Import screens
import DashboardClassic from "../screens/DashboardClassic";
import DashboardPolished from "../screens/DashboardPolished";
import TransactionsScreen from "../screens/TransactionsScreen";
import BudgetsGoalsScreen from "../screens/BudgetsGoalsScreen";
import AIScreen from "../screens/AIScreen";
import ProfileScreen from "../screens/ProfileScreen";
import BankConnectionScreen from "../screens/BankConnectionScreen";

const Tab = createBottomTabNavigator();

// Custom tab bar icons using emojis
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.6 }}>
      {name}
    </Text>
  </View>
);

// Enhanced Dashboard component that handles bank connection modal
function DashboardWithBankConnection() {
  const [showBankConnection, setShowBankConnection] = useState(false);

  return (
    <>
      <DashboardClassic onConnectBank={() => setShowBankConnection(true)} />
      <Modal
        visible={showBankConnection}
        animationType="slide"
        onRequestClose={() => setShowBankConnection(false)}
      >
        <BankConnectionScreen 
          navigation={{ goBack: () => setShowBankConnection(false) }}
          route={{}}
        />
      </Modal>
    </>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#EAECEF",
            paddingBottom: 8,
            paddingTop: 8,
            height: 88,
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#6B7280",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name="Home"
          component={DashboardPolished}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="🏠" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="📊" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Budgets"
          component={BudgetsGoalsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="🎯" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="AI"
          component={AIScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="🤖" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="👤" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
