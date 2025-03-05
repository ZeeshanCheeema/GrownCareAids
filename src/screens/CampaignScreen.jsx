import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDonateMutation} from '../services/Auth/AuthApi';

const CampaignScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [donate, {isLoading, error}] = useDonateMutation();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const {
    images = [],
    title = 'No Title',
    raisedAmount = 0,
    amount = 1,
    category = {},
    location = 'Unknown',
    description = 'No description available.',
    campaignId = campaignId,
  } = route.params || {};

  const progress = amount > 0 ? (raisedAmount / amount) * 100 : 0;
  const imageUrl = images.length > 0 ? images[0] : '';

  // Handle Donation
  const onDonatePress = async () => {
    if (!campaignId) {
      Alert.alert('Error', 'Campaign ID is missing.');
      return;
    }

    try {
      const response = await donate({campaignId, amount: 10}).unwrap(); // Example amount: $10
      Alert.alert('Success', 'Donation successful!');
      console.log('Donation Response:', response);
    } catch (err) {
      Alert.alert('Error', err?.data?.message || 'Failed to donate.');
      console.error('Donation Error:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campaign Details</Text>
      </View>

      {/* Campaign Image */}
      {imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      {/* Campaign Details */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {/* Expandable Description */}
        <Text
          style={styles.description}
          numberOfLines={showFullDescription ? undefined : 4}>
          {description}
        </Text>

        {/* View More / View Less Button */}
        {description.length > 200 && (
          <TouchableOpacity
            onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={styles.readMore}>
              {showFullDescription ? 'View Less' : 'View More'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Fundraising Info */}
        <View style={styles.row}>
          <Text style={styles.label}>Total Raised</Text>
          <Text style={styles.label}>Donation Target</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>${raisedAmount.toLocaleString()}</Text>
          <Text style={styles.value}>${amount.toLocaleString()}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progress, {width: `${progress}%`}]} />
        </View>

        {/* Category & Location */}
        <View style={styles.row}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.label}>Location</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.boldValue}>{category?.name || 'N/A'}</Text>
          <Text style={styles.boldValue}>{location}</Text>
        </View>

        {/* Donate Button */}
        <TouchableOpacity
          style={styles.donateButton}
          onPress={onDonatePress}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.donateText}>Donate</Text>
          )}
        </TouchableOpacity>

        {/* Error Message */}
        {error && <Text style={styles.errorText}>Failed to donate</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A3F1E',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  backButton: {marginRight: 10},
  headerTitle: {fontSize: 18, fontWeight: 'bold', color: 'white'},
  image: {width: '100%', height: 250},
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {color: '#555', fontSize: 14},
  content: {padding: 20},
  title: {fontSize: 22, fontWeight: 'bold', color: '#333'},
  description: {fontSize: 14, color: '#666', marginVertical: 10},
  readMore: {color: '#EA7E24', fontWeight: 'bold', marginTop: 5},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {fontSize: 14, color: '#666'},
  value: {fontSize: 16, fontWeight: 'bold'},
  progressBar: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginVertical: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#1A3F1E',
    borderRadius: 4,
  },
  boldValue: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  donateButton: {
    backgroundColor: '#1A3F1E',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  donateText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  errorText: {color: 'red', textAlign: 'center', marginTop: 10},
});

export default CampaignScreen;
