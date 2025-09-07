import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";

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
};

// Mock profile data
const profileData = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  memberSince: "March 2023",
  avatar: "👤",
};

// Mock connected accounts
const connectedAccounts = [
  { id: "1", name: "Bank of America", type: "Checking", status: "connected", lastSync: "2 hours ago" },
  { id: "2", name: "Chase Bank", type: "Savings", status: "connected", lastSync: "1 day ago" },
  { id: "3", name: "American Express", type: "Credit Card", status: "connected", lastSync: "3 hours ago" },
  { id: "4", name: "PayPal", type: "Digital Wallet", status: "disconnected", lastSync: "Never" },
];

// Mock notification settings
const notificationSettings = [
  { id: "1", title: "Transaction Alerts", description: "Get notified of new transactions", enabled: true },
  { id: "2", title: "Budget Warnings", description: "Alert when approaching budget limits", enabled: true },
  { id: "3", title: "Bill Reminders", description: "Remind about upcoming bills", enabled: false },
  { id: "4", title: "Savings Goals", description: "Updates on savings progress", enabled: true },
  { id: "5", title: "Market Updates", description: "Investment and market news", enabled: false },
];

// Mock security settings
const securitySettings = [
  { id: "1", title: "Two-Factor Authentication", description: "Add an extra layer of security", enabled: true },
  { id: "2", title: "Biometric Login", description: "Use fingerprint or face ID", enabled: true },
  { id: "3", title: "Session Timeout", description: "Auto-logout after 30 minutes", enabled: false },
  { id: "4", title: "Login Notifications", description: "Alert on new device login", enabled: true },
];

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(notificationSettings);
  const [security, setSecurity] = useState(securitySettings);

  const toggleNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const toggleSecurity = (id: string) => {
    setSecurity(prev => 
      prev.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const renderConnectedAccount = (account: any) => (
    <View key={account.id} style={styles.accountItem}>
      <View style={styles.accountInfo}>
        <View style={styles.accountIcon}>
          <Text style={styles.accountIconText}>🏦</Text>
        </View>
        <View style={styles.accountDetails}>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.accountType}>{account.type}</Text>
          <Text style={styles.lastSync}>Last sync: {account.lastSync}</Text>
        </View>
      </View>
      <View style={[
        styles.statusBadge,
        { backgroundColor: account.status === "connected" ? COLORS.green + "20" : COLORS.mute + "20" }
      ]}>
        <Text style={[
          styles.statusText,
          { color: account.status === "connected" ? COLORS.green : COLORS.mute }
        ]}>
          {account.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );

  const renderSettingItem = (item: any, onToggle: (id: string) => void, type: "notification" | "security") => (
    <View key={item.id} style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingDescription}>{item.description}</Text>
      </View>
      <Switch
        value={item.enabled}
        onValueChange={() => onToggle(item.id)}
        trackColor={{ false: COLORS.border, true: COLORS.blue }}
        thumbColor={COLORS.card}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your account settings</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{profileData.avatar}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profileData.name}</Text>
              <Text style={styles.profileEmail}>{profileData.email}</Text>
              <Text style={styles.profilePhone}>{profileData.phone}</Text>
              <Text style={styles.memberSince}>Member since {profileData.memberSince}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Connected Accounts */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Connected Accounts</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>+ Add Account</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Manage your financial connections</Text>
          
          <View style={styles.accountsList}>
            {connectedAccounts.map(renderConnectedAccount)}
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <TouchableOpacity>
              <Text style={styles.configureButton}>Configure</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Customize your notification preferences</Text>
          
          <View style={styles.settingsList}>
            {notifications.map(item => renderSettingItem(item, toggleNotification, "notification"))}
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Security</Text>
            <TouchableOpacity>
              <Text style={styles.configureButton}>Configure</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Manage your account security</Text>
          
          <View style={styles.settingsList}>
            {security.map(item => renderSettingItem(item, toggleSecurity, "security"))}
          </View>
        </View>

        {/* Support & Help */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportSubtitle}>Get support and learn more about your account</Text>
          
          <View style={styles.supportButtons}>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Help Center</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.mute,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileHeader: {
    flexDirection: "row",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.blue + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatar: {
    fontSize: 40,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: COLORS.mute,
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    color: COLORS.mute,
  },
  editButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  editButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  addButton: {
    fontSize: 14,
    color: COLORS.blue,
    fontWeight: "600",
  },
  configureButton: {
    fontSize: 14,
    color: COLORS.blue,
    fontWeight: "600",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.mute,
    marginBottom: 20,
  },
  accountsList: {
    gap: 16,
  },
  accountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accountIconText: {
    fontSize: 20,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  accountType: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  lastSync: {
    fontSize: 12,
    color: COLORS.mute,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  settingsList: {
    gap: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.mute,
  },
  supportCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  supportSubtitle: {
    fontSize: 14,
    color: COLORS.mute,
    marginBottom: 20,
  },
  supportButtons: {
    flexDirection: "row",
    gap: 12,
  },
  supportButton: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  supportButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: COLORS.red + "20",
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.red + "30",
  },
  logoutButtonText: {
    color: COLORS.red,
    fontSize: 16,
    fontWeight: "600",
  },
});
