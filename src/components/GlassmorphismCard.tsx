import type React from "react"
import { View, StyleSheet, type ViewStyle } from "react-native"
import { BlurView } from "expo-blur"

interface GlassmorphismCardProps {
  children: React.ReactNode
  style?: ViewStyle
  intensity?: number
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({ children, style, intensity = 20 }) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} style={styles.blur}>
        <View style={styles.content}>{children}</View>
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  blur: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
})
