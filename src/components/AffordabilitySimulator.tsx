import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { canIAffordIt, WishItem } from '../ai/affordability';
import { Txn, Recurring } from '../ai/forecast';

interface AffordabilitySimulatorProps {
  balance: number;
  transactions: Txn[];
  recurrings: Recurring[];
}

const COLORS = {
  bg: '#F7F8FB',
  text: '#1D2939',
  mute: '#667085',
  green: '#16A34A',
  amber: '#F59E0B',
  red: '#DC2626',
  card: '#FFFFFF',
  border: '#EAECF0',
  primary: '#007AFF',
};

export default function AffordabilitySimulator({ 
  balance, 
  transactions, 
  recurrings 
}: AffordabilitySimulatorProps) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemUrl, setItemUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [wishItems, setWishItems] = useState<WishItem[]>([]);

  const addItem = () => {
    const price = parseFloat(itemPrice);
    if (!itemName.trim() || isNaN(price) || price <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid item name and price');
      return;
    }

    const newItem: WishItem = {
      label: itemName.trim(),
      price: price,
      when: 'now'
    };

    setWishItems([...wishItems, newItem]);
    setItemName('');
    setItemPrice('');
    setItemUrl('');
    setSelectedImage(null);
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowImageModal(true);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowImageModal(true);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Photo',
      'How would you like to add a photo?',
      [
        { text: 'Camera', onPress: takePicture },
        { text: 'Gallery', onPress: pickFromGallery },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const extractPriceFromUrl = (url: string) => {
    // Simple price extraction from URL (basic patterns)
    const priceMatch = url.match(/[\£$€]?(\d+(?:\.\d{2})?)/);
    if (priceMatch) {
      return priceMatch[1];
    }
    return '';
  };

  const handleUrlChange = (url: string) => {
    setItemUrl(url);
    const extractedPrice = extractPriceFromUrl(url);
    if (extractedPrice && !itemPrice) {
      setItemPrice(extractedPrice);
    }
  };

  const removeItem = (index: number) => {
    setWishItems(wishItems.filter((_, i) => i !== index));
  };

  const analysis = useMemo(() => {
    if (wishItems.length === 0) return null;
    
    return canIAffordIt({
      balance,
      txns: transactions,
      recurrings,
      items: wishItems,
      minBuffer: 100
    });
  }, [balance, transactions, recurrings, wishItems]);

  const getVerdictColor = (verdict: 'green' | 'amber' | 'red') => {
    switch (verdict) {
      case 'green': return COLORS.green;
      case 'amber': return COLORS.amber;
      case 'red': return COLORS.red;
      default: return COLORS.mute;
    }
  };

  const getVerdictText = (verdict: 'green' | 'amber' | 'red') => {
    switch (verdict) {
      case 'green': return '✅ Safe to buy';
      case 'amber': return '⚠️ Proceed with caution';
      case 'red': return '❌ Not recommended';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💡 Can I afford it?</Text>
      <Text style={styles.subtitle}>Check if your wishlist fits your budget</Text>

      {/* Add Item Form */}
      <View style={styles.form}>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="Item name"
            value={itemName}
            onChangeText={setItemName}
            placeholderTextColor={COLORS.mute}
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 12 }]}
            placeholder="£0.00"
            value={itemPrice}
            onChangeText={setItemPrice}
            keyboardType="decimal-pad"
            placeholderTextColor={COLORS.mute}
          />
        </View>

        {/* URL Input */}
        <TextInput
          style={[styles.input, { marginBottom: 12 }]}
          placeholder="Paste product URL (optional)"
          value={itemUrl}
          onChangeText={handleUrlChange}
          placeholderTextColor={COLORS.mute}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.photoButton} onPress={showImageOptions}>
            <Ionicons name="camera" size={20} color={COLORS.primary} />
            <Text style={styles.photoButtonText}>Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>+ Add to Wishlist</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity 
              style={styles.removeImageButton} 
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={24} color={COLORS.red} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Wishlist Items */}
      {wishItems.length > 0 && (
        <View style={styles.wishlist}>
          <Text style={styles.wishlistTitle}>Your wishlist:</Text>
          {wishItems.map((item, index) => (
            <View key={index} style={styles.wishItem}>
              <View style={styles.wishItemContent}>
                <Text style={styles.wishItemName}>{item.label}</Text>
                <Text style={styles.wishItemPrice}>£{item.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(index)}>
                <Text style={styles.removeButton}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>
              Total: £{wishItems.reduce((s, i) => s + i.price, 0).toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {/* Analysis Results */}
      {analysis && (
        <View style={styles.analysis}>
          <View style={[styles.verdictCard, { borderLeftColor: getVerdictColor(analysis.verdict) }]}>
            <Text style={[styles.verdictText, { color: getVerdictColor(analysis.verdict) }]}>
              {getVerdictText(analysis.verdict)}
            </Text>
            <Text style={styles.projectionText}>
              After purchase: £{analysis.after.projectedEOM.toFixed(2)} left at month-end
            </Text>
            
            {analysis.suggestions.length > 0 && (
              <View style={styles.suggestions}>
                <Text style={styles.suggestionsTitle}>💡 Suggestions:</Text>
                {analysis.suggestions.map((suggestion, index) => (
                  <Text key={index} style={styles.suggestionItem}>
                    • {suggestion}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* Image Modal */}
      <Modal visible={showImageModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Photo captured!</Text>
            <Text style={styles.modalText}>
              Add item details and price manually, then tap "Add to Wishlist"
            </Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mute,
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFBFC',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    gap: 6,
  },
  photoButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 2,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 12,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.mute,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  wishlist: {
    marginBottom: 16,
  },
  wishlistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  wishItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 6,
  },
  wishItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wishItemName: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  wishItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
  },
  removeButton: {
    fontSize: 18,
    color: COLORS.red,
    fontWeight: 'bold',
    marginLeft: 12,
    width: 20,
    textAlign: 'center',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
  },
  analysis: {
    marginTop: 8,
  },
  verdictCard: {
    backgroundColor: '#FAFBFC',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  verdictText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  projectionText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },
  suggestions: {
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  suggestionItem: {
    fontSize: 13,
    color: COLORS.mute,
    marginBottom: 3,
    lineHeight: 18,
  },
});