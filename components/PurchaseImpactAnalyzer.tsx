import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const visionProColors = [
  '#007AFF', // iOS Blue (primary)
  '#5856D6', // Purple
  '#AF52DE', // Violet
  '#FF2D92', // Pink
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#30D158', // Green
  '#64D2FF', // Light Blue
  '#BF5AF2', // Magenta
];

interface PurchaseAnalysis {
  itemName: string;
  price: number;
  category: string;
  budgetImpact: number;
  recommendation: 'buy' | 'wait' | 'avoid';
  monthlyBudgetLeft: number;
  alternativeSuggestions: string[];
  paymentPlan?: {
    monthly: number;
    duration: number;
  };
}

export default function PurchaseImpactAnalyzer() {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'image' | 'url' | null>(null);
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PurchaseAnalysis | null>(null);

  const mockAnalyze = async (input: string | any) => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockAnalysis: PurchaseAnalysis = {
      itemName: 'MacBook Pro 16-inch',
      price: 2499,
      category: 'Electronics',
      budgetImpact: 72,
      recommendation: 'wait',
      monthlyBudgetLeft: 970,
      alternativeSuggestions: [
        'MacBook Air M2 - Save $800',
        'Refurbished MacBook Pro - Save $500',
        'Wait for Black Friday - Potential 15% off',
      ],
      paymentPlan: {
        monthly: 208,
        duration: 12,
      },
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        mockAnalyze(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleCameraCapture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        mockAnalyze(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const handleUrlAnalysis = () => {
    if (url.trim()) {
      mockAnalyze(url);
    } else {
      Alert.alert('Error', 'Please enter a valid URL');
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return visionProColors[7]; // Green
      case 'wait':
        return visionProColors[5]; // Orange
      case 'avoid':
        return visionProColors[4]; // Red
      default:
        return visionProColors[0];
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return 'checkmark-circle';
      case 'wait':
        return 'warning';
      case 'avoid':
        return 'close-circle';
      default:
        return 'checkmark-circle';
    }
  };

  if (!isOpen) {
    return (
      <TouchableOpacity
        style={[styles.container, { shadowColor: visionProColors[3] }]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[visionProColors[3], visionProColors[9]]}
          style={styles.iconContainer}
        >
          <Ionicons name="camera" size={24} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.content}>
          <Text style={styles.title}>Purchase Impact Analyzer</Text>
          <Text style={styles.subtitle}>See how purchases affect your budget</Text>
        </View>
        <View style={styles.aiIcons}>
          <Ionicons name="brain" size={20} color={visionProColors[3]} />
          <Ionicons name="flash" size={16} color={visionProColors[6]} />
        </View>
        <Text style={styles.clickText}>Click to analyze your next purchase</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { shadowColor: visionProColors[3] }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LinearGradient
            colors={[visionProColors[3], visionProColors[9]]}
            style={styles.iconContainer}
          >
            <Ionicons name="camera" size={24} color="#FFFFFF" />
          </LinearGradient>
          <View>
            <Text style={styles.title}>Purchase Impact Analyzer</Text>
            <Text style={styles.subtitle}>AI-powered budget impact analysis</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsOpen(false)}
        >
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {!analysis && !isAnalyzing && (
        <View style={styles.uploadSection}>
          <Text style={styles.uploadText}>
            Upload an image, receipt, or paste a product URL to see how it impacts your monthly budget
          </Text>

          <View style={styles.uploadOptions}>
            <TouchableOpacity
              style={styles.uploadOption}
              onPress={handleCameraCapture}
            >
              <Ionicons name="camera" size={24} color={visionProColors[3]} />
              <Text style={styles.uploadOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadOption}
              onPress={handleImageUpload}
            >
              <Ionicons name="cloud-upload" size={24} color={visionProColors[3]} />
              <Text style={styles.uploadOptionText}>Upload Receipt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadOption}
              onPress={() => setUploadMethod('url')}
            >
              <Ionicons name="link" size={24} color={visionProColors[3]} />
              <Text style={styles.uploadOptionText}>Paste URL</Text>
            </TouchableOpacity>
          </View>

          {uploadMethod === 'url' && (
            <View style={styles.urlSection}>
              <Text style={styles.inputLabel}>Product URL</Text>
              <TextInput
                style={styles.urlInput}
                placeholder="https://example.com/product"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={url}
                onChangeText={setUrl}
              />
              <TouchableOpacity
                style={[styles.analyzeButton, { backgroundColor: visionProColors[3] }]}
                onPress={handleUrlAnalysis}
              >
                <Text style={styles.analyzeButtonText}>Analyze Purchase Impact</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {isAnalyzing && (
        <View style={styles.analyzingSection}>
          <LinearGradient
            colors={[visionProColors[3], visionProColors[9]]}
            style={styles.analyzingIcon}
          >
            <Ionicons name="brain" size={32} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.analyzingTitle}>Analyzing Purchase Impact...</Text>
          <Text style={styles.analyzingText}>
            AI is processing the item details and calculating budget impact
          </Text>
        </View>
      )}

      {analysis && (
        <View style={styles.analysisSection}>
          {/* Item Summary */}
          <View style={styles.itemSummary}>
            <View>
              <Text style={styles.itemName}>{analysis.itemName}</Text>
              <Text style={[styles.itemPrice, { color: visionProColors[3] }]}>
                ${analysis.price.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.recommendationBadge, { backgroundColor: getRecommendationColor(analysis.recommendation) }]}>
              <Ionicons name={getRecommendationIcon(analysis.recommendation)} size={16} color="#FFFFFF" />
              <Text style={styles.recommendationText}>{analysis.recommendation.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.analysisGrid}>
            {/* Budget Impact */}
            <View style={styles.analysisCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="trending-down" size={20} color={visionProColors[4]} />
                <Text style={styles.cardTitle}>Budget Impact</Text>
              </View>
              <Text style={styles.cardValue}>{analysis.budgetImpact}%</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysis.budgetImpact}%`,
                      backgroundColor: analysis.budgetImpact > 50 ? visionProColors[4] : visionProColors[7],
                    },
                  ]}
                />
              </View>
              <Text style={styles.cardSubtext}>
                ${analysis.monthlyBudgetLeft} left in monthly budget
              </Text>
            </View>

            {/* Payment Plan */}
            {analysis.paymentPlan && (
              <View style={styles.analysisCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="cash" size={20} color={visionProColors[0]} />
                  <Text style={styles.cardTitle}>Payment Plan Option</Text>
                </View>
                <Text style={styles.cardValue}>${analysis.paymentPlan.monthly}/month</Text>
                <Text style={styles.cardSubtext}>for {analysis.paymentPlan.duration} months</Text>
              </View>
            )}
          </View>

          {/* Alternatives */}
          <View style={styles.alternativesCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="trending-up" size={20} color={visionProColors[7]} />
              <Text style={styles.cardTitle}>Smart Alternatives</Text>
            </View>
            <View style={styles.alternativesList}>
              {analysis.alternativeSuggestions.map((suggestion, index) => (
                <View key={index} style={styles.alternativeItem}>
                  <Text style={styles.alternativeText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: visionProColors[7] }]}
            >
              <Text style={styles.actionButtonText}>Add to Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => {
                setAnalysis(null);
                setUrl('');
                setUploadMethod(null);
              }}
            >
              <Text style={styles.outlineButtonText}>Analyze Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clickText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadSection: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  uploadOption: {
    flex: 1,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    gap: 8,
  },
  uploadOptionText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  urlSection: {
    width: '100%',
    gap: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  urlInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  analyzeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  analyzingSection: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  analyzingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  analyzingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  analyzingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  analysisSection: {
    gap: 24,
  },
  itemSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  recommendationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recommendationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  analysisGrid: {
    gap: 16,
  },
  analysisCard: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  alternativesCard: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  alternativesList: {
    gap: 8,
    marginTop: 12,
  },
  alternativeItem: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  alternativeText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  outlineButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  outlineButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
