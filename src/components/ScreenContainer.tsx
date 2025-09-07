import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet } from "react-native";
import { colors, space } from "../theme";

export function ScreenContainer({ children }:{ children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.cc}>{children}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  cc: { 
    padding: space.xl, 
    gap: space.xl 
  } 
});
