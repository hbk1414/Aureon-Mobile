import type React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { PieChart } from "react-native-chart-kit"
import { visionProColors } from "../../App"

const { width } = Dimensions.get("window")

const data = [
  {
    name: "Food & Dining",
    population: 456.78,
    color: visionProColors.primary,
    legendFontColor: "#FFFFFF",
    legendFontSize: 12,
  },
  {
    name: "Transportation",
    population: 234.5,
    color: visionProColors.purple,
    legendFontColor: "#FFFFFF",
    legendFontSize: 12,
  },
  {
    name: "Shopping",
    population: 189.23,
    color: visionProColors.green,
    legendFontColor: "#FFFFFF",
    legendFontSize: 12,
  },
  {
    name: "Entertainment",
    population: 145.67,
    color: visionProColors.orange,
    legendFontColor: "#FFFFFF",
    legendFontSize: 12,
  },
  {
    name: "Other",
    population: 98.45,
    color: visionProColors.lightBlue,
    legendFontColor: "#FFFFFF",
    legendFontSize: 12,
  },
]

export const SpendingChart: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Month's Spending</Text>
      <PieChart
        data={data}
        width={width - 80}
        height={180}
        chartConfig={{
          backgroundColor: "transparent",
          backgroundGradientFrom: "transparent",
          backgroundGradientTo: "transparent",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0"
        center={[0, 0]}
        absolute
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
})
