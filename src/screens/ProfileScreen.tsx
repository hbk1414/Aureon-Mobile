"use client"

import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { GlassmorphismCard } from "../components/GlassmorphismCard"
import { visionProColors } from "../../App"

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [biometricsEnabled, setBiometricsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true)

  const menuItems = [
    {
      title: "Account Settings",
      subtitle: "Personal information, security",
      icon: "person-circle",
      color: [visionProColors.primary, visionProColors.lightBlue],
    },
    {
      title: "Payment Methods",
      subtitle: "Cards, bank accounts",
      icon: "card",
      color: [visionProColors.purple, visionProColors.violet],
    },
    {
      title: "Budget & Goals",
      subtitle: "Spending limits, savings targets",
      icon: "target",
      color: [visionProColors.green, visionProColors.yellow],
    },
    {
      title: "Investment Portfolio",
      subtitle: "Holdings, performance",
      icon: "trending-up",
      color: [visionProColors.orange, visionProColors.red],
    },
    {
      title: "Transaction History",
      subtitle: "Export, statements",
      icon: "document-text",
      color: [visionProColors.magenta, visionProColors.pink],
    },
    {
      title: "Help & Support",
      subtitle: "FAQ, contact us",
      icon: "help-circle",
      color: [visionProColors.lightBlue, visionProColors.primary],
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient colors={[visionProColors.primary, visionProColors.purple]} style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <LinearGradient
                colors={[visionProColors.lightBlue, visionProColors.primary]}
                style={styles.profileAvatar}
              >
                <Text style={styles.profileInitials}>AJ</Text>
              </LinearGradient>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>Alex Johnson</Text>
                <Text style={styles.profileEmail}>alex.johnson@email.com</Text>
                <View style={styles.profileBadge}>
                  <Ionicons name="star" size={12} color={visionProColors.yellow} />
                  <Text style={styles.profileBadgeText}>Premium Member</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Overview</Text>
          <View style={styles.statsGrid}>
            <GlassmorphismCard style={styles.statCard}>
              <Text style={styles.statValue}>$12,847</Text>
              <Text style={styles.statLabel}>Total Balance</Text>
            </GlassmorphismCard>
            <GlassmorphismCard style={styles.statCard}>
              <Text style={styles.statValue}>$1,234</Text>
              <Text style={styles.statLabel}>Invested</Text>
            </GlassmorphismCard>
            <GlassmorphismCard style={styles.statCard}>
              <Text style={styles.statValue}>$89.45</Text>
              <Text style={styles.statLabel}>Round-ups</Text>
            </GlassmorphismCard>
            <GlassmorphismCard style={styles.statCard}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </GlassmorphismCard>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <GlassmorphismCard>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <LinearGradient
                  colors={[visionProColors.primary, visionProColors.lightBlue]}
                  style={styles.settingIcon}
                >
                  <Ionicons name="notifications" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingSubtitle}>Transaction alerts, insights</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: `${visionProColors.primary}60` }}
                thumbColor={notificationsEnabled ? visionProColors.primary : "rgba(255, 255, 255, 0.6)"}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <LinearGradient colors={[visionProColors.purple, visionProColors.violet]} style={styles.settingIcon}>
                  <Ionicons name="finger-print" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View>
                  <Text style={styles.settingTitle}>Biometric Login</Text>
                  <Text style={styles.settingSubtitle}>Face ID, Touch ID</Text>
                </View>
              </View>
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: `${visionProColors.primary}60` }}
                thumbColor={biometricsEnabled ? visionProColors.primary : "rgba(255, 255, 255, 0.6)"}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <LinearGradient colors={[visionProColors.green, visionProColors.yellow]} style={styles.settingIcon}>
                  <Ionicons name="moon" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingSubtitle}>System default</Text>
                </View>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: "rgba(255, 255, 255, 0.2)", true: `${visionProColors.primary}60` }}
                thumbColor={darkModeEnabled ? visionProColors.primary : "rgba(255, 255, 255, 0.6)"}
              />
            </View>
          </GlassmorphismCard>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItemContainer}>
              <GlassmorphismCard style={styles.menuItem}>
                <View style={styles.menuItemContent}>
                  <LinearGradient colors={item.color} style={styles.menuIcon}>
                    <Ionicons name={item.icon as any} size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.6)" />
                </View>
              </GlassmorphismCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity>
            <GlassmorphismCard style={[styles.menuItem, styles.logoutItem]}>
              <View style={styles.menuItemContent}>
                <LinearGradient colors={[visionProColors.red, visionProColors.orange]} style={styles.menuIcon}>
                  <Ionicons name="log-out" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.menuItemInfo}>
                  <Text style={[styles.menuItemTitle, styles.logoutText]}>Sign Out</Text>
                  <Text style={styles.menuItemSubtitle}>Securely log out of your account</Text>
                </View>
              </View>
            </GlassmorphismCard>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  profileHeader: {
    padding: 16,
    paddingTop: 8,
  },
  profileCard: {
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  profileBadgeText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 4,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  menuItemContainer: {
    marginBottom: 12,
  },
  menuItem: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  logoutItem: {
    borderColor: `${visionProColors.red}40`,
  },
  logoutText: {
    color: visionProColors.red,
  },
})
