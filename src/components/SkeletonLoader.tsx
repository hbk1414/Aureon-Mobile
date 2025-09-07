import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const COLORS = {
  bg: "#F7F8FB",
  skeleton: "#E9EAF2",
  shimmer: "#F0F2F5",
};

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonBox: React.FC<SkeletonProps> = ({ 
  width = "100%", 
  height = 20, 
  borderRadius = 8, 
  style 
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.skeletonBox, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity: shimmerOpacity,
          },
        ]}
      />
    </View>
  );
};

// Card skeleton
export const CardSkeleton: React.FC = () => (
  <View style={styles.cardSkeleton}>
    <SkeletonBox height={24} width="60%" style={styles.cardTitle} />
    <SkeletonBox height={16} width="40%" style={styles.cardSubtitle} />
    <View style={styles.cardContent}>
      <SkeletonBox height={16} width="100%" style={styles.contentLine} />
      <SkeletonBox height={16} width="80%" style={styles.contentLine} />
      <SkeletonBox height={16} width="90%" style={styles.contentLine} />
    </View>
  </View>
);

// Transaction list skeleton
export const TransactionListSkeleton: React.FC = () => (
  <View style={styles.listSkeleton}>
    {[1, 2, 3, 4, 5].map((item) => (
      <View key={item} style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <SkeletonBox width={40} height={40} borderRadius={20} />
          <View style={styles.transactionInfo}>
            <SkeletonBox height={16} width="70%" />
            <SkeletonBox height={12} width="50%" style={styles.metaLine} />
          </View>
        </View>
        <View style={styles.transactionRight}>
          <SkeletonBox height={16} width={60} />
          <SkeletonBox height={12} width={40} style={styles.metaLine} />
        </View>
      </View>
    ))}
  </View>
);

// Budget bar skeleton
export const BudgetBarSkeleton: React.FC = () => (
  <View style={styles.budgetItem}>
    <View style={styles.budgetHeader}>
      <SkeletonBox height={16} width="40%" />
      <SkeletonBox height={16} width="25%" />
    </View>
    <SkeletonBox height={8} width="100%" borderRadius={4} style={styles.progressBar} />
    <View style={styles.budgetStatus}>
      <SkeletonBox height={12} width="30%" />
    </View>
  </View>
);

// Budget list skeleton
export const BudgetListSkeleton: React.FC = () => (
  <View style={styles.budgetList}>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <BudgetBarSkeleton key={item} />
    ))}
  </View>
);

// Pie chart skeleton
export const PieChartSkeleton: React.FC = () => (
  <View style={styles.pieChartSkeleton}>
    <SkeletonBox width={200} height={200} borderRadius={100} />
    <View style={styles.pieCenter}>
      <SkeletonBox height={20} width={80} />
      <SkeletonBox height={14} width={60} />
    </View>
  </View>
);

// Legend skeleton
export const LegendSkeleton: React.FC = () => (
  <View style={styles.legendSkeleton}>
    {[1, 2, 3, 4, 5].map((item) => (
      <View key={item} style={styles.legendItem}>
        <SkeletonBox width={10} height={10} borderRadius={5} />
        <SkeletonBox height={14} width="60%" />
        <SkeletonBox height={14} width="25%" />
      </View>
    ))}
  </View>
);

// AI insight skeleton
export const AIInsightSkeleton: React.FC = () => (
  <View style={styles.insightSkeleton}>
    <View style={styles.insightHeader}>
      <SkeletonBox width={24} height={24} borderRadius={12} />
      <View style={styles.insightInfo}>
        <SkeletonBox height={16} width="80%" />
        <SkeletonBox height={12} width="40%" style={styles.badge} />
      </View>
    </View>
    <SkeletonBox height={14} width="100%" style={styles.description} />
    <SkeletonBox height={14} width="90%" style={styles.description} />
    <SkeletonBox height={12} width="70%" style={styles.recommendation} />
  </View>
);

const styles = StyleSheet.create({
  skeletonBox: {
    backgroundColor: COLORS.skeleton,
    overflow: "hidden",
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.shimmer,
  },
  cardSkeleton: {
    backgroundColor: COLORS.bg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EAECEF",
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardSubtitle: {
    marginBottom: 20,
  },
  cardContent: {
    gap: 12,
  },
  contentLine: {
    marginBottom: 4,
  },
  listSkeleton: {
    gap: 16,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAECEF",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  metaLine: {
    marginTop: 4,
  },
  budgetList: {
    gap: 16,
  },
  budgetItem: {
    gap: 8,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBar: {
    marginVertical: 8,
  },
  budgetStatus: {
    alignItems: "flex-end",
  },
  pieChartSkeleton: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 20,
  },
  pieCenter: {
    position: "absolute",
    alignItems: "center",
    gap: 4,
  },
  legendSkeleton: {
    gap: 12,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  insightSkeleton: {
    gap: 12,
    padding: 16,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAECEF",
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  insightInfo: {
    flex: 1,
  },
  badge: {
    marginTop: 8,
    borderRadius: 12,
  },
  description: {
    marginBottom: 4,
  },
  recommendation: {
    marginTop: 8,
  },
});
