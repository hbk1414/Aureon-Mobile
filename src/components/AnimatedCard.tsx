"use client"

import type React from "react"
import { Animated, TouchableOpacity, type ViewStyle } from "react-native"
import { useRef } from "react"
import { GlassmorphismCard } from "./GlassmorphismCard"
import { HapticFeedback } from "./HapticFeedback"

interface AnimatedCardProps {
  children: React.ReactNode
  style?: ViewStyle
  onPress?: () => void
  hapticType?: "light" | "medium" | "heavy" | "selection"
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, style, onPress, hapticType = "light" }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    HapticFeedback[hapticType]()
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start()
  }

  if (onPress) {
    return (
      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} activeOpacity={1}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <GlassmorphismCard style={style}>{children}</GlassmorphismCard>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <GlassmorphismCard style={style}>{children}</GlassmorphismCard>
    </Animated.View>
  )
}
