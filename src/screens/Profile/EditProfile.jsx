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
import AsyncStorage from '@react-native-async-storage/async-storage';

import logo from '../../assets/logo.png';
import Loader from '../../components/Loader';

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

  useEffect(() => {
    if (userProfile) {
      setUser(prevState => ({
        ...prevState,
        firstName: userProfile?.firstName || '',
        lastName: userProfile?.lastName || '',
        phone: userProfile?.phone || '',
        dob: userProfile?.dob || '',
        gender: userProfile?.gender || '',
        address: userProfile?.address || '',
        bio: userProfile?.bio || '',
        country: userProfile?.country || '',
      }));
      setProfileImage(userProfile?.profileImage || '');
    }
  }, [userProfile]);

  // Image Picker
  const handleImagePick = async () => {
    Alert.alert('Upload Image', 'Choose an option', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Take Photo',
        onPress: async () => {
          const result = await launchCamera({mediaType: 'photo'});
          if (result.assets && result.assets.length > 0) {
            uploadImage(result.assets[0]);
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const result = await launchImageLibrary({mediaType: 'photo'});
          if (result.assets && result.assets.length > 0) {
            uploadImage(result.assets[0]);
          }
        },
      },
    ]);
  };

  const uploadImage = async image => {
    if (!image?.uri) return;

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || 'profile.jpg',
    });

    const token = await AsyncStorage.getItem('accessToken');

    try {
      const uploadResponse = await fetch(
        'https://dev.api.crowdcareaid.com/api/uploadImage',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const uploadData = await uploadResponse.json();

      if (uploadData?.data) {
        const imageResponse = await fetch(
          `https://dev.api.crowdcareaid.com/api/getImage?key=${uploadData.data}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const imageJson = await imageResponse.json();
        if (imageJson?.data) {
          setProfileImage(imageJson.data);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleInputChange = (key, value) => {
    setUser(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        firstName: user.firstName,
        lastName: user.lastName,
        aboutMe: user.bio,
        profileImage: profileImage,
        countryCode: user.country,
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        gender: user.gender,
      };

      const response = await editProfile(updatedData).unwrap();

      if (response.status === 200) {
        Alert.alert('Success', response?.message);
        navigation.goBack();
      } else {
        Alert.alert('Error', response?.error?.message);
      }
    } catch (err) {
      console.error('API Error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  if (isLoading) {
    return <Loader message="Loading profile..." logoSource={logo} />;
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

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={'#858585'}
          placeholder="First Name"
          value={user.firstName}
          onChangeText={text => handleInputChange('firstName', text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={'#858585'}
          placeholder="Last Name"
          value={user.lastName}
          onChangeText={text => handleInputChange('lastName', text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={'#858585'}
          placeholder="Phone"
          value={user.phone}
          keyboardType="phone-pad"
          onChangeText={text => handleInputChange('phone', text)}
        />

        <RNPickerSelect
          onValueChange={value => handleInputChange('gender', value)}
          items={[
            {label: 'Male', value: 'male'},
            {label: 'Female', value: 'female'},
            {label: 'Other', value: 'other'},
          ]}
          value={user.gender}
          placeholder={{label: 'Select Gender', value: null, color: '#858585'}}
          style={{
            inputAndroid: {
              fontSize: 16,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: '#333',
              borderRadius: 20,
              color: 'black',
              backgroundColor: 'white',
              marginBottom: 12,
            },
            placeholder: {
              color: '#858585',
            },
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="address"
          placeholderTextColor={'#858585'}
          value={user.address}
          onChangeText={text => handleInputChange('address', text)}
        />
        <TextInput
          placeholderTextColor={'#858585'}
          style={styles.input}
          placeholder="Bio"
          value={user.bio}
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
