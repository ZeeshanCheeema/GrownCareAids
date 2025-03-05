import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
} from '../../services/Auth/AuthApi';

const {width, height} = Dimensions.get('window');

const ReviewScreen = ({route}) => {
  const navigation = useNavigation();

  const [createCampaign, {isLoading, error}] = useCreateCampaignMutation();
  const [updateCampaign, {isLoading: isUpdating}] = useUpdateCampaignMutation();

  const {
    id,
    title,
    category,
    location,
    amount,
    duration = [],
    description,
    donationTarget,
    raisedAmount,
    images = [],
  } = route.params || {};

  // Destructure duration safely
  const [startDate, endDate] = duration;
  const formattedDuration = `${startDate} to ${endDate}`;

  const handleSaveCampaign = async () => {
    try {
      if (id) {
        const response = await updateCampaign({
          id,
          title,
          category,
          location,
          amount,
          duration: [startDate, endDate],
          description,
          donationTarget,
          raisedAmount,
          images,
        }).unwrap();
        console.log('Campaign Updated:', response);
        if (response.status === 200) {
          alert('suucess', response?.message);
          navigation.navigate('bottomTab');
        } else {
          alert('Error', response?.error?.data?.message);
        }
        alert('Campaign updated successfully!');
      } else {
        const response = await createCampaign({
          title,
          category,
          location,
          amount,
          duration: [startDate, endDate],
          description,
          donationTarget,
          raisedAmount,
          images,
        }).unwrap();
        console.log('Campaign Created:', response);
        if (response.status === 200) {
          alert('suucess', response?.message);
          navigation.navigate('MyCampaign');
        } else {
          alert('Error', response?.error?.data?.message);
        }
      }
    } catch (err) {
      console.error('Error saving campaign:', err);
      alert('Failed to save campaign. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerTop}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review</Text>
      </View>

      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <AntDesign name="checkcircle" size={24} color="green" />
        <View style={styles.completedLine} />
        <AntDesign name="checkcircle" size={24} color="green" />
        <View style={styles.completedLine} />
        <View style={[styles.step, styles.activeStep]}>
          <Text style={styles.stepText}>3</Text>
        </View>
      </View>

      {/* Fundraiser Details */}
      <View style={styles.detailBox}>
        <Text style={styles.sectionTitle}>Fundraiser Details</Text>
        <View style={styles.row}>
          <View style={styles.labelColumn}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.label}>Location</Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.value}>{title}</Text>
            <Text style={styles.value}>{category}</Text>
            <Text style={styles.value}>{location}</Text>
          </View>
        </View>
      </View>

      {/* Amount Details */}
      <View style={styles.detailBox}>
        <Text style={styles.sectionTitle}>Amount Details</Text>
        <View style={styles.row}>
          <View style={styles.labelColumn}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.label}>Duration</Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.value}>{amount}</Text>
            <Text style={styles.value}>{formattedDuration}</Text>
          </View>
        </View>

        <View style={styles.imageSection}>
          <Text style={styles.subTitle}>Attached Images</Text>
          <View style={styles.imagePlaceholder}>
            {images.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((imgUrl, index) => (
                  <Image
                    key={index}
                    source={{uri: imgUrl}}
                    style={styles.selectedImage}
                  />
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.imagePlaceholderText}>No image attached</Text>
            )}
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.detailBox}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButtonStyle}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.createButton,
            (isLoading || isUpdating) && styles.disabledButton,
          ]}
          onPress={handleSaveCampaign}
          disabled={isLoading || isUpdating}>
          {isLoading || isUpdating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{id ? 'Update' : 'Create'}</Text>
          )}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerTop: {
    backgroundColor: '#EA7E24',
    height: height * 0.12,
    borderBottomRightRadius: width * 0.05,
    borderBottomLeftRadius: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: width * 0.05,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'white',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.05,
  },
  step: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {
    backgroundColor: '#EA7E24',
  },
  completedLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#28A745',
    marginHorizontal: width * 0.02,
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailBox: {
    backgroundColor: '#fff',
    borderRadius: width * 0.03,
    padding: 10,
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.02,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.015,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  labelColumn: {
    flex: 1,
    paddingRight: 10,
  },
  valueColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  label: {
    fontSize: width * 0.04,
    color: '#555',
    marginBottom: height * 0.005,
  },
  value: {
    fontSize: width * 0.04,
    color: '#333',
    marginBottom: height * 0.005,
  },
  imageSection: {
    marginTop: height * 0.02,
  },
  subTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    marginBottom: height * 0.01,
  },
  imagePlaceholder: {
    borderRadius: width * 0.01,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.015,
  },
  imagePlaceholderText: {
    color: '#888',
    fontSize: width * 0.04,
  },
  selectedImage: {
    width: width * 0.12,
    height: height * 0.05,
    borderRadius: width * 0.03,
    marginRight: 10,
  },
  descriptionText: {
    fontSize: width * 0.04,
    color: '#333',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.04,
    marginBottom: height * 0.05,
  },
  backButtonStyle: {
    backgroundColor: '#E0E0E0',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.07,
    borderRadius: width * 0.03,
  },
  backButtonText: {
    color: '#333',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#EA7E24',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.07,
    borderRadius: width * 0.03,
    shadowColor: '#EA7E24',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#b0b0b0',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: height * 0.01,
  },
});

export default ReviewScreen;
