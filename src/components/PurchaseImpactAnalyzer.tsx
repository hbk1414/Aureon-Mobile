import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, spacing, shadow, fonts } from '../theme';

export default function PurchaseImpactAnalyzer() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleImagePicker = () => {
    Alert.alert(
      'Image Source',
      'Choose an image source',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => simulateImageCapture('camera') },
        { text: 'Photo Library', onPress: () => simulateImageCapture('library') },
      ]
    );
  };

  const simulateImageCapture = (source: string) => {
    Alert.alert(
      'Simulation Mode',
      `In a real app, this would open the ${source}. For now, let's simulate a receipt scan.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate Scan',
          onPress: () => {
            setSelectedImage('simulated-receipt');
            simulateAnalysis();
          },
        },
      ]
    );
  };

  const simulateAnalysis = () => {
    // Simulate AI analysis
    const mockAnalysis = {
      totalAmount: 89.99,
      items: [
        { name: 'Coffee Beans', price: 24.99, category: 'Food & Beverages' },
        { name: 'Organic Milk', price: 6.99, category: 'Dairy' },
        { name: 'Artisan Bread', price: 8.99, category: 'Bakery' },
        { name: 'Fresh Fruits', price: 15.99, category: 'Produce' },
        { name: 'Organic Eggs', price: 8.99, category: 'Dairy' },
        { name: 'Whole Grain Pasta', price: 4.99, category: 'Pantry' },
        { name: 'Extra Virgin Olive Oil', price: 19.99, category: 'Pantry' },
      ],
      impact: {
        monthlyBudget: -89.99,
        savingsGoal: -89.99,
        categorySpending: {
          'Food & Beverages': 24.99,
          'Dairy': 15.98,
          'Bakery': 8.99,
          'Produce': 15.99,
          'Pantry': 24.98,
        },
      },
      recommendations: [
        'Consider buying coffee beans in bulk to save 15%',
        'Switch to store-brand milk to save $2 per week',
        'Buy seasonal fruits to reduce produce costs by 20%',
      ],
      sustainability: {
        score: 85,
        factors: ['Organic products', 'Local sourcing', 'Minimal packaging'],
      },
    };

    setAnalysisResult(mockAnalysis);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handleImagePicker}>
        <LinearGradient
          colors={[`${colors.iosBlue}20`, `${colors.iosPurple}20`]}
          style={styles.gradient}
        />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="camera" size={32} color={colors.iosBlue} />
          </View>
          <Text style={styles.title}>Purchase Impact Analyzer</Text>
          <Text style={styles.description}>
            Scan receipts to analyze spending impact and get AI-powered recommendations
          </Text>
          <TouchableOpacity style={styles.scanButton} onPress={handleImagePicker}>
            <Ionicons name="scan" size={20} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Scan Receipt</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Analysis Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Purchase Analysis</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Receipt Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Receipt Summary</Text>
              <View style={styles.totalAmount}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>${analysisResult?.totalAmount}</Text>
              </View>
              <Text style={styles.itemCount}>
                {analysisResult?.items.length} items purchased
              </Text>
            </View>

            {/* Budget Impact */}
            <View style={styles.impactCard}>
              <Text style={styles.impactTitle}>Budget Impact</Text>
              <View style={styles.impactRow}>
                <View style={styles.impactItem}>
                  <Text style={styles.impactLabel}>Monthly Budget</Text>
                  <Text style={[styles.impactValue, { color: colors.iosRed }]}>
                    -${Math.abs(analysisResult?.impact.monthlyBudget)}
                  </Text>
                </View>
                <View style={styles.impactItem}>
                  <Text style={styles.impactLabel}>Savings Goal</Text>
                  <Text style={[styles.impactValue, { color: colors.iosRed }]}>
                    -${Math.abs(analysisResult?.impact.savingsGoal)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Category Breakdown */}
            <View style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>Spending by Category</Text>
              {analysisResult?.impact.categorySpending && 
                Object.entries(analysisResult.impact.categorySpending).map(([category, amount]) => (
                  <View key={category} style={styles.categoryRow}>
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryAmount}>${amount}</Text>
                  </View>
                ))
              }
            </View>

            {/* AI Recommendations */}
            <View style={styles.recommendationsCard}>
              <Text style={styles.recommendationsTitle}>AI Recommendations</Text>
              {analysisResult?.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={[styles.recommendationIcon, { backgroundColor: `${colors.iosGreen}20` }]}>
                    <Ionicons name="bulb" size={16} color={colors.iosGreen} />
                  </View>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>

            {/* Sustainability Score */}
            <View style={styles.sustainabilityCard}>
              <Text style={styles.sustainabilityTitle}>Sustainability Score</Text>
              <View style={styles.sustainabilityScore}>
                <Text style={styles.scoreValue}>{analysisResult?.sustainability.score}</Text>
                <Text style={styles.scoreLabel}>/ 100</Text>
              </View>
              <Text style={styles.sustainabilitySubtitle}>Based on your purchase choices</Text>
              <View style={styles.factorsContainer}>
                {analysisResult?.sustainability.factors.map((factor, index) => (
                  <View key={index} style={styles.factorItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.iosGreen} />
                    <Text style={styles.factorText}>{factor}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  content: {
    padding: spacing.xl,
    backgroundColor: colors.cardGlass,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.iosBlue}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...fonts.title,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    ...fonts.body,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.iosBlue,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 24,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    padding: spacing.xl,
  },
  summaryCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  totalAmount: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  totalValue: {
    ...fonts.kpi,
  },
  itemCount: {
    ...fonts.body,
    textAlign: 'center',
  },
  impactCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  impactRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  impactItem: {
    flex: 1,
    alignItems: 'center',
  },
  impactLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  impactValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryName: {
    fontSize: 16,
    color: colors.text,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  recommendationsCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  recommendationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  sustainabilityCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sustainabilityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sustainabilityScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.iosGreen,
  },
  scoreLabel: {
    fontSize: 20,
    color: colors.textMuted,
  },
  sustainabilitySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  factorsContainer: {
    gap: spacing.xs,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  factorText: {
    fontSize: 14,
    color: colors.text,
  },
});
