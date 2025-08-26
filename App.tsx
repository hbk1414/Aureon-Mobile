import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Screens
import DashboardScreen from "./src/screens/DashboardScreen"
import TransactionsScreen from "./src/screens/TransactionsScreen"
import AIFeaturesScreen from "./src/screens/AIFeaturesScreen"
import ProfileScreen from "./src/screens/ProfileScreen"

// Icons
import { Ionicons } from "@expo/vector-icons"

const Tab = createBottomTabNavigator()

// Vision Pro Color Palette
export const visionProColors = {
  primary: "#007AFF",
  purple: "#5856D6",
  violet: "#AF52DE",
  pink: "#FF2D92",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#30D158",
  lightBlue: "#64D2FF",
  magenta: "#BF5AF2",
  background: "#000000",
  surface: "rgba(255, 255, 255, 0.1)",
  text: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap

              if (route.name === "Dashboard") {
                iconName = focused ? "home" : "home-outline"
              } else if (route.name === "Transactions") {
                iconName = focused ? "card" : "card-outline"
              } else if (route.name === "AI Features") {
                iconName = focused ? "sparkles" : "sparkles-outline"
              } else if (route.name === "Profile") {
                iconName = focused ? "person" : "person-outline"
              } else {
                iconName = "home-outline"
              }

              return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: visionProColors.primary,
            tabBarInactiveTintColor: visionProColors.textSecondary,
            tabBarStyle: {
              backgroundColor: "rgba(0, 0, 0, 0.95)",
              borderTopColor: "rgba(255, 255, 255, 0.1)",
              borderTopWidth: 1,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 0,
              height: 88,
              paddingBottom: 34,
              paddingTop: 8,
            },
            headerStyle: {
              backgroundColor: "rgba(0, 0, 0, 0.95)",
              borderBottomColor: "rgba(255, 255, 255, 0.1)",
              borderBottomWidth: 1,
            },
            headerTintColor: visionProColors.text,
            headerTitleStyle: {
              fontWeight: "600",
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Transactions" component={TransactionsScreen} />
          <Tab.Screen name="AI Features" component={AIFeaturesScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
