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
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
} from '../../services/Auth/AuthApi';
import color from '../../utils/color';

const {width, height} = Dimensions.get('window');

const ReviewScreen = ({route}) => {
  const navigation = useNavigation();

  const [createCampaign, {isLoading, error}] = useCreateCampaignMutation();
  const [updateCampaign, {isLoading: isUpdating}] = useUpdateCampaignMutation();

  // Extract data from route params
  const {id, item = {}} = route.params || {};
  const {
    title = '',
    category = item?.category || {},
    location = '',
    amount = '',
    duration = [],
    description = '',
    images = [],
  } = item || {};

  // Ensure category is properly formatted
  const categoryId = category?._id || null;
  const categoryName = category?.name || 'N/A';

  const [startDate, endDate] = duration || [];
  const formatDate = date => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate)
      ? 'Invalid Date'
      : parsedDate.toLocaleDateString('en-US');
  };

  const formattedDuration =
    startDate &&
    endDate &&
    !isNaN(new Date(startDate)) &&
    !isNaN(new Date(endDate))
      ? `${formatDate(startDate)} to ${formatDate(endDate)}`
      : 'N/A';

  // Function to handle create/update campaign
  const handleSaveCampaign = async () => {
    try {
      const campaignData = {
        title,
        category: categoryId,
        location,
        amount,
        duration: [startDate, endDate],
        description,
        images,
      };

      let response;
      if (id) {
        response = await updateCampaign({id, ...campaignData}).unwrap();
      } else {
        response = await createCampaign(campaignData).unwrap();
      }

      if (response.status === 200) {
        Alert.alert('Success', response?.message);
        navigation.navigate('BottomTab');
        console.log(response);
      } else {
        Alert.alert('Error', response?.message);
      }
    } catch (err) {
      console.error('Error saving campaign:', err);
      Alert.alert('Failed to save campaign. Please try again.');
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
      <Text style={styles.sectionTitle}>Fundraiser Details</Text>
      <View style={styles.detailBox}>
        <View style={styles.row}>
          <View style={styles.labelColumn}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.label}>Location</Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.value}>{title || 'N/A'}</Text>
            <Text style={styles.value}>{categoryName}</Text>
            <Text style={styles.value}>{location || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Amount Details */}
      <Text style={styles.sectionTitle}>Amount Details</Text>
      <View style={styles.detailBox}>
        <View style={styles.row}>
          <View style={styles.labelColumn}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.label}>Duration</Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.value}>{amount ? `$${amount}` : 'N/A'}</Text>
            <Text style={styles.value}>{formattedDuration}</Text>
          </View>
        </View>

        {/* Attached Images */}
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
      <Text style={styles.sectionTitle}>Description</Text>
      <View style={styles.detailBox}>
        <Text style={styles.descriptionText}>
          {description || 'No description provided.'}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButtonStyle}
          onPress={() => navigation.goBack()}>
          <Text style={styles.ButtonText}>Back</Text>
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

// Styles
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.background},
  headerTop: {
    backgroundColor: color.secondary,
    height: height * 0.15,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  backButton: {position: 'absolute', left: 15, top: 20},
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: color.white,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 25,
  },
  completedLine: {
    width: width * 0.3,
    height: 3,
    backgroundColor: color.grey,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {backgroundColor: color.secondary},
  stepText: {color: color.white, fontWeight: 'bold'},
  detailBox: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  subTitle: {
    color: color.grey,
    fontWeight: 'bold',
  },
  row: {flexDirection: 'row', marginHorizontal: 30},
  labelColumn: {flex: 1},
  valueColumn: {flex: 1},
  label: {
    color: color.grey,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  value: {color: color.black, marginBottom: 15},
  imageSection: {
    width: '90%',
    flexDirection: 'row',
    marginHorizontal: 30,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    overflow: 'hidden',
    marginLeft: 20,
  },
  selectedImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 5,
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginBottom: 40,
  },
  backButtonStyle: {
    borderColor: color.aqua,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },

  createButton: {
    backgroundColor: color.secondary,
    padding: 12,
    borderRadius: 8,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {color: color.white, fontSize: 16, fontWeight: 'bold'},
  ButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {opacity: 0.6},
});

export default ReviewScreen;
