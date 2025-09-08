import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
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
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
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