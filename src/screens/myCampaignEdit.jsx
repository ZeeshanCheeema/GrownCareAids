import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDeleteCampaignMutation} from '../services/Auth/AuthApi';
const {width, height} = Dimensions.get('window');

const MyCampaignEdit = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {item, image = []} = route.params || {};

  const progress =
    item.amount > 0 ? (item.raisedAmount / item.amount) * 100 : 0;

  const [deleteCampaign] = useDeleteCampaignMutation();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const handleDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this campaign?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteCampaign(item._id).unwrap();
              Alert.alert('Success', 'Campaign deleted successfully.');
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                'Error',
                error?.data?.message || 'Failed to delete campaign',
              );
            }
          },
          style: 'destructive',
        },
      ],
    );
  };
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back">
          <Icon name="arrow-back" size={25} color="white" />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity style={styles.DeleteButton} onPress={handleDelete}>
          <AntDesign name="delete" size={25} color={'red'} />
        </TouchableOpacity>

        {/* Campaign Image */}
        <Image
          source={image ? {uri: image} : ''}
          style={styles.campaignImage}
        />
      </View>

      {/* Campaign Details */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>

        {/* Expandable Description */}
        <Text
          style={styles.description}
          numberOfLines={showFullDescription ? undefined : 4}>
          {item.description}
        </Text>

        {/* View More / View Less Button */}
        {item.description.length > 100 && (
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
          <Text style={styles.value}>
            ${item.raisedAmount.toLocaleString()}
          </Text>
          <Text style={styles.value}>$ {item.amount.toLocaleString()}</Text>
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
          <Text style={styles.boldValue}>{item.category?.name || 'N/A'}</Text>

          <Text style={styles.boldValue}>{item.location}</Text>
        </View>
        {/* Edit & Donate Buttons */}
        <View style={styles.Button}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('FundraiserDetails', {
                id: item._id,
                images,
                title: item.title,
                totalFundraise: item.amount,
                location: item.location,
                description: item.description,
                donationTarget: item.raisedAmount,
                category: item.category,
                duration: item.duration,
              })
            }>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.donateButton}>
            <Text style={styles.donateText}>Donate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(214, 210, 210, 0.8)',
    padding: 8,
    borderRadius: 10,
    zIndex: 10,
  },
  DeleteButton: {
    position: 'absolute',
    top: 10,
    right: 30,
    backgroundColor: 'rgba(214, 210, 210, 0.8)',
    padding: 8,
    borderRadius: 10,
    zIndex: 10,
    marginHorizontal: 5,
  },
  campaignImage: {
    width: '100%',
    height: 330,

    marginBottom: 20,
    resizeMode: 'cover',
  },
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
  Button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  donateButton: {
    flex: 1,
    backgroundColor: '#1A3F1E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  editButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    borderColor: '#1A3F1E',
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  editText: {
    color: '#1A3F1E',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  donateText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyCampaignEdit;
