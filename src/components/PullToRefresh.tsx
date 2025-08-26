import type React from "react"
import { RefreshControl } from "react-native"
import { visionProColors } from "../../App"

interface PullToRefreshProps {
  refreshing: boolean
  onRefresh: () => void
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ refreshing, onRefresh }) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={visionProColors.primary}
      colors={[visionProColors.primary]}
      progressBackgroundColor="rgba(255, 255, 255, 0.1)"
    />
  )
}
