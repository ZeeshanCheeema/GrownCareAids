import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  useCreateReportMutation,
  useGetCampaignDonatorsQuery,
} from '../services/Auth/AuthApi';
import DonationModal from './DonateModel';
import {useSelector} from 'react-redux';
import logo from '../assets/logo.png';
import Loader from './Loader';
const SearchViewCampaign = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [donationModalVisible, setDonationModalVisible] = useState(false);

  const toggleModal = useCallback(() => setModalVisible(prev => !prev), []);
  const userId = useSelector(state => state.data?._id); // Adjust this according to your state structure

  const [createReport, {isLoading: reportLoading}] = useCreateReportMutation();

  const {id, image, item} = route.params || {};

  const {data, isLoading, error} = useGetCampaignDonatorsQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: false,
    keepUnusedDataFor: 300,
  });

  const donorList = useMemo(
    () => (Array.isArray(data?.data) ? data.data : []),
    [data],
  );

  const reportReasons = [
    'Identity fraud',
    'Undesirable or harmful',
    'Publication of inappropriate contents',
    'Harassment or bullying',
    'Other',
  ];

  const handleCreateReport = async () => {
    if (!id || !selectedReason) {
      Alert.alert('Error', 'Campaign ID or reason is missing!');
      return;
    }

    const loggedInUserId = 'YOUR_LOGGED_IN_USER_ID';

    if (loggedInUserId === item._id) {
      Alert.alert('Error', 'You cannot report your own campaign.');
      return;
    }

    try {
      console.log('Sending report with:', {
        campaignId: id,
        reason: selectedReason,
      });

      const response = await createReport({
        campaignId: id,
        reason: selectedReason,
      }).unwrap();

      console.log('Report Created:', response);
      if (response.status === 200) {
        Alert.alert('Success', response?.message);
      } else {
        Alert.alert('Error', response?.message);
      }
      setModalVisible(false);
    } catch (err) {
      console.error('Failed to create report:', err);
      Alert.alert(
        'Error',
        err?.data?.message || 'Failed to report the campaign.',
      );
    }
  };

  const handleDonationSubmit = amount => {
    console.log(`User donated: $${amount}`);
  };

  if (isLoading) {
    return <Loader message="Loading campaigns..." logoSource={logo} />;
  }

  if (error) {
    return (
      <Text style={styles.error}>
        {error?.data?.message ||
          'Failed to load donor list. Please try again later.'}
      </Text>
    );
  }

  const progress =
    item.raisedAmount > 0
      ? ((item.raisedAmount / item.amount) * 100).toFixed(1)
      : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={25} color="white" />
        </TouchableOpacity>

        {/* Right-side Buttons */}
        <TouchableOpacity
          onPress={() => Alert.alert('Share', 'Share this campaign')}
          style={styles.shareButton}>
          <AntDesign name="sharealt" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleModal} style={styles.warningButton}>
          <AntDesign name="warning" size={22} color="white" />
        </TouchableOpacity>

        {/* Campaign Image */}
        <Image
          source={image ? {uri: image} : require('../assets/SearchBg.png')}
          style={styles.campaignImage}
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.campaignTitle}>{item.title}</Text>
        <Text style={styles.campaignDescription} numberOfLines={4}>
          {item.description}
        </Text>

        {/* Fund Details */}
        <View style={styles.infoRow}>
          <Text style={styles.fundLabel}>Total Fundraise</Text>
          <Text style={styles.infoValues}>${item.raisedAmount}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.fundLabel}>Donation Target</Text>
          <Text style={styles.infoValues}>${item.amount}</Text>
        </View>

        {/* Progress Bar */}
        <Text style={styles.progressText}>{progress}%</Text>
        <View style={styles.progressBar}>
          <View style={{...styles.progress, width: `${progress}%`}} />
        </View>

        <Text style={styles.donorsTitle}>Donor List</Text>
        {donorList.length > 0 ? (
          donorList.map((donor, index) => {
            const donorName = donor?.donator
              ? `${donor?.donator.firstName || 'Anonymous'} ${
                  donor.donator.lastName || ''
                }`.trim()
              : 'Anonymous';
            const donorEmail = donor?.donator?.email || 'No email provided';
            const donorProfile = donor?.donator?.profileImage || 'profile img';
            const donationDate = donor?.createdAt
              ? new Date(donor.createdAt).toLocaleDateString()
              : 'N/A';
            const donationAmount = donor?.amount ? `$${donor.amount}` : 'N/A';

            return (
              <View key={donor._id || index} style={styles.donorItem}>
                <View style={styles.donorHeader}>
                  <View style={styles.donorAvatar}>
                    <Image
                      source={
                        donorProfile
                          ? {uri: donorProfile}
                          : require('../assets/user.png')
                      }
                      style={styles.donorProfileImage}
                    />
                  </View>
                  <View style={styles.donorInfo}>
                    <Text style={styles.donorName}>{donorName}</Text>
                    <Text style={styles.donorEmail}>{donorEmail}</Text>
                  </View>
                </View>

                <View style={styles.donationDetails}>
                  <Text style={styles.donationText}>
                    Donated on: {donationDate}
                  </Text>
                  <Text style={styles.amount}>Amount: {donationAmount}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noDonorsText}>No donors yet.</Text>
        )}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => setDonationModalVisible(true)}>
          <Text style={styles.submitText}>Donate</Text>
        </TouchableOpacity>
        <DonationModal
          visible={donationModalVisible}
          onClose={() => setDonationModalVisible(false)}
          onSubmit={handleDonationSubmit}
          campaignId={id}
        />
      </View>

      {/* Report Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Campaign</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
              <Entypo name="cross" size={25} />
            </TouchableOpacity>
            <Text style={styles.modalSubtitle}>
              Please select a reason to report this campaign.
            </Text>

            {reportReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.reasonItem,
                  selectedReason === reason && styles.selectedReasonItem,
                ]}
                onPress={() => setSelectedReason(reason)}>
                <Text style={styles.reasonText}>{reason}</Text>
                {selectedReason === reason && (
                  <AntDesign name="checkcircle" size={20} color="#1A3F1E" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.submitButton,
                !selectedReason && styles.disabledButton,
              ]}
              onPress={handleCreateReport}
              disabled={!selectedReason || reportLoading}>
              {reportLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(137, 131, 131, 0.8)',
    padding: 8,
    borderRadius: 10,
    zIndex: 10,
  },
  shareButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(137, 131, 131, 0.8)',
    padding: 8,
    borderRadius: 10,
    zIndex: 10,
  },
  warningButton: {
    position: 'absolute',
    top: 10,
    right: 60,
    backgroundColor: 'rgba(137, 131, 131, 0.8)',
    padding: 8,
    borderRadius: 10,
    zIndex: 10,
  },
  campaignImage: {
    width: '100%',
    height: 330,
    marginBottom: 0,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  campaignTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1A3F1E',
  },
  campaignDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fundLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  infoValues: {
    fontSize: 14,
    color: '#777',
  },
  progressText: {
    fontSize: 14,
    color: '#1A3F1E',
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progress: {
    height: '100%',
    backgroundColor: '#1A3F1E',
  },
  donorsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A3F1E',
    marginBottom: 10,
  },
  donorItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  donorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  donorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  donorProfileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    resizeMode: 'cover',
  },
  donorInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  donorEmail: {
    fontSize: 14,
    color: '#777',
  },
  donationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  donationText: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A3F1E',
  },
  noDonorsText: {
    textAlign: 'center',
    color: '#777',
    marginVertical: 20,
  },
  submitButton: {
    backgroundColor: '#1A3F1E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: 'white',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A3F1E',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
  },
  selectedReasonItem: {
    backgroundColor: '#E3FCEF',
    borderColor: '#1A3F1E',
    borderWidth: 1,
  },
  reasonText: {
    fontSize: 15,
    color: '#2D3436',
    flex: 1,
  },
  cancelButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default SearchViewCampaign;
