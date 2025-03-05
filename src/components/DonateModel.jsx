import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDonateMutation} from '../services/Auth/AuthApi';

const DonationModal = ({visible, onClose, campaignId, onSuccess}) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donate, {isLoading}] = useDonateMutation();

  const donationAmounts = [10, 30, 40, 50, 100, 500, 1000];

  const handleSubmit = async () => {
    if (isLoading) return;

    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid donation amount.');
      return;
    }

    if (!campaignId) {
      Alert.alert('Error', 'Campaign ID is missing.');
      return;
    }
    console.log(donate);
    try {
      await donate({campaignId, amount}).unwrap();
      Alert.alert('Success', `You have donated $${amount}!`);
      console.log(`User donated: $${amount} to campaign ${campaignId}`);

      setSelectedAmount(null);
      setCustomAmount('');
      onClose();

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Donation failed:', error);
      Alert.alert('Error', 'Failed to process donation. Please try again.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={22} color="black" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Choose Amount</Text>

          <View style={styles.amountContainer}>
            {donationAmounts.map(amount => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && styles.selectedAmount,
                ]}
                onPress={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}>
                <Text
                  style={[
                    styles.amountText,
                    selectedAmount === amount && styles.selectedAmountText,
                  ]}>
                  ${amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.customInput}
            placeholder="Enter Custom Amount"
            keyboardType="numeric"
            placeholderTextColor={'#858585'}
            value={customAmount}
            onChangeText={text => {
              setCustomAmount(text);
              setSelectedAmount(null);
            }}
          />

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitText}>Donate</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  amountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  amountButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  selectedAmount: {
    backgroundColor: '#1A3F1E',
    borderColor: '#1A3F1E',
  },
  selectedAmountText: {
    color: 'white',
  },
  amountText: {
    color: 'black',
  },
  customInput: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#1A3F1E',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DonationModal;
