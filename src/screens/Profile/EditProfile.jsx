import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import {useNavigation} from '@react-navigation/native';
import {
  useEditProfileMutation,
  useUserProfileQuery,
} from '../../services/Auth/AuthApi';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useEffect, useState} from 'react';

const {width, height} = Dimensions.get('window');

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const {data, isLoading, error} = useUserProfileQuery();
  const userProfile = data?.data;

  const [editProfile, {isLoading: isUpdating}] = useEditProfileMutation();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    gender: '',
    country: '',
    address: '',
    bio: '',
  });

  const [profileImage, setProfileImage] = useState('');

  // Update state when userProfile data is fetched
  useEffect(() => {
    if (userProfile) {
      setUser(prevState => ({
        ...prevState,
        firstName: userProfile?.firstName || prevState.firstName,
        lastName: userProfile?.lastName || prevState.lastName,
        phone: userProfile?.phone || prevState.phone,
        dob: userProfile?.dob || prevState.dob,
        gender: userProfile?.gender || prevState.gender,
        address: userProfile?.address || prevState.address,
        bio: userProfile?.bio || prevState.bio,
        country: userProfile?.country || prevState.country,
      }));
      setProfileImage(userProfile?.profileImage || '');
    }
  }, [userProfile]);

  // Image Picker
  const handleImagePick = () => {
    Alert.alert('Upload Image', 'Choose an option', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Take Photo',
        onPress: () =>
          launchCamera({mediaType: 'photo'}, response => {
            if (response?.assets?.length > 0) {
              setProfileImage(response.assets[0].uri);
            }
          }),
      },
      {
        text: 'Choose from Gallery',
        onPress: () =>
          launchImageLibrary({mediaType: 'photo'}, response => {
            if (response?.assets?.length > 0) {
              setProfileImage(response.assets[0].uri);
            }
          }),
      },
    ]);
  };

  const handleInputChange = (key, value) => {
    setUser(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Function to handle profile update
  const handleSave = async () => {
    try {
      const updatedData = {
        firstName: user.firstName,
        lastName: user.lastName,
        aboutMe: user.bio, // Ensure bio maps to aboutMe
        profileImage: profileImage,
        countryCode: user.country, // Ensure correct mapping
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        gender: user.gender,
      };

      console.log('Final Data Sent to API:', updatedData); // Debugging log

      const response = await editProfile(updatedData).unwrap();

      if (response.status === 200) {
        Alert.alert('Success', response?.message);
        navigation.goBack();
      } else {
        Alert.alert('Error', response?.message);
      }
    } catch (err) {
      console.error('API Error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1D4F27" />
      </View>
    );
  }

  if (error || !userProfile) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Image */}
      <ImageBackground
        source={
          profileImage ? {uri: profileImage} : require('../../assets/user.png')
        }
        style={styles.headerBackground}
        imageStyle={{opacity: 0.7}}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
            <Icon name="camera" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Profile Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={user.firstName}
          onChangeText={text => handleInputChange('firstName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={user.lastName}
          onChangeText={text => handleInputChange('lastName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={user.phone}
          keyboardType="phone-pad"
          onChangeText={text => handleInputChange('phone', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Date of Birth"
          value={user.dob}
          onChangeText={text => handleInputChange('dob', text)}
        />

        <RNPickerSelect
          placeholderTextColor="#858585"
          onValueChange={value => handleInputChange('gender', value)}
          items={[
            {label: 'Male', value: 'male'},
            {label: 'Female', value: 'female'},
            {label: 'Other', value: 'other'},
          ]}
          value={user.gender}
          placeholder={{label: 'Select Gender', value: null}}
          style={styles.inputAndroid}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={user.address}
          onChangeText={text => handleInputChange('address', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={user.bio}
          multiline
          onChangeText={text => handleInputChange('bio', text)}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isUpdating}>
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerBackground: {
    height: height * 0.25,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 6,
  },
  editIcon: {
    position: 'absolute',
    bottom: 35,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 6,
    borderRadius: 10,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#1A3F1E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
