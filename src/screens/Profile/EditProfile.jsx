// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ImageBackground,
//   ScrollView,
//   Alert,
//   Platform,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';

// import CountryPicker from 'react-native-country-picker-modal';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import Entypo from 'react-native-vector-icons/Entypo';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {useNavigation, useRoute} from '@react-navigation/native';
// import {useEditProfileMutation} from '../../services/Auth/AuthApi';

// const EditProfileScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const userProfile = route.params?.userProfile ?? {};

//   // API Mutation
//   const [editProfile, {isLoading}] = useEditProfileMutation();

//   // State Variables
//   const [profileImage, setProfileImage] = useState(
//     userProfile.profileImage || '',
//   );
//   const [firstName, setFirstName] = useState(userProfile.firstName || '');
//   const [lastName, setLastName] = useState(userProfile.lastName || '');
//   const [phone, setPhone] = useState(userProfile.phone || '');
//   const [dob, setDob] = useState(userProfile.dob || '');
//   const [gender, setGender] = useState(userProfile.gender || '');
//   const [country, setCountry] = useState(userProfile.country || '');
//   const [city, setCity] = useState(userProfile.address || '');
//   const [bio, setBio] = useState(userProfile.aboutMe || '');
//   const [countryCode, setCountryCode] = useState(
//     userProfile.countryCode || 'US',
//   );

//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showCountryPicker, setShowCountryPicker] = useState(false);

//   // Image Picker
//   const handleImagePick = () => {
//     Alert.alert('Upload Image', 'Choose an option', [
//       {text: 'Cancel', style: 'cancel'},
//       {
//         text: 'Take Photo',
//         onPress: () =>
//           launchCamera({mediaType: 'photo'}, response => {
//             if (response?.assets?.length > 0) {
//               setProfileImage(response.assets[0].uri);
//             }
//           }),
//       },
//       {
//         text: 'Choose from Gallery',
//         onPress: () =>
//           launchImageLibrary({mediaType: 'photo'}, response => {
//             if (response?.assets?.length > 0) {
//               setProfileImage(response.assets[0].uri);
//             }
//           }),
//       },
//     ]);
//   };

//   const handleSave = async () => {
//     try {
//       const updatedProfile = new userProfile();
//       updatedProfile.append('firstName', firstName);
//       updatedProfile.append('lastName', lastName);
//       updatedProfile.append('aboutMe', bio);
//       updatedProfile.append('countryCode', countryCode);
//       updatedProfile.append('phone', phone);
//       updatedProfile.append('address', city);
//       updatedProfile.append('dob', dob);
//       updatedProfile.append('gender', gender);

//       if (profileImage && profileImage.startsWith('file://')) {
//         updatedProfile.append('profileImage', {
//           uri: profileImage,
//           name: 'profile.jpg',
//           type: 'image/jpeg',
//         });
//       }

//       const response = await editProfile(updatedProfile).unwrap();

//       if (response.status === 200) {
//         Alert.alert('Success', response?.message);
//         navigation.goBack();
//       } else {
//         Alert.alert('Error', response?.message || 'Failed to update profile.');
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Profile Image Section */}
//       <ImageBackground
//         source={{
//           uri: profileImage || 'https://randomuser.me/api/portraits/men/9.jpg',
//         }}
//         style={styles.headerBackground}
//         imageStyle={{opacity: 0.7}}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity
//             style={styles.backIcon}
//             onPress={() => navigation.goBack()}>
//             <Entypo name="circle-with-cross" size={30} color="white" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
//             <Ionicons name="camera-outline" size={20} color="white" />
//           </TouchableOpacity>
//         </View>
//       </ImageBackground>

//       {/* Form Section */}
//       <View style={styles.formContainer}>
//         <TextInput
//           style={styles.input}
//           placeholderTextColor="#858585"
//           value={firstName}
//           onChangeText={setFirstName}
//           placeholder="First Name"
//         />
//         <TextInput
//           style={styles.input}
//           value={lastName}
//           placeholderTextColor="#858585"
//           onChangeText={setLastName}
//           placeholder="Last Name"
//         />
//         <TextInput
//           style={styles.input}
//           value={phone}
//           placeholderTextColor="#858585"
//           onChangeText={setPhone}
//           placeholder="Phone Number"
//           keyboardType="phone-pad"
//         />

//         {/* DOB Picker */}
//         <TouchableOpacity
//           onPress={() => setShowDatePicker(true)}
//           style={styles.input}>
//           <Text>{dob ? dob : 'Select Date of Birth'}</Text>
//         </TouchableOpacity>
//         {showDatePicker && (
//           <DateTimePicker
//             placeholderTextColor="#858585"
//             value={dob ? new Date(dob) : new Date()}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={(event, selectedDate) => {
//               setShowDatePicker(false);
//               if (selectedDate)
//                 setDob(selectedDate.toISOString().split('T')[0]);
//             }}
//           />
//         )}

//         {/* Gender Picker */}
//         <RNPickerSelect
//           placeholderTextColor="#858585"
//           onValueChange={setGender}
//           items={[
//             {label: 'Male', value: 'Male'},
//             {label: 'Female', value: 'Female'},
//             {label: 'Other', value: 'Other'},
//           ]}
//           value={gender}
//           placeholder={{label: 'Select Gender', value: null}}
//           style={styles.inputAndroid}
//         />

//         <TouchableOpacity
//           onPress={() => setShowCountryPicker(true)}
//           style={styles.input}>
//           placeholderTextColor="#858585"
//           <CountryPicker
//             withFlag
//             withFilter
//             countryCode={countryCode} // Ensure a valid default
//             onSelect={({name, cca2}) => {
//               setCountry(name);
//               setCountryCode(cca2);
//             }}
//             visible={showCountryPicker}
//             onClose={() => setShowCountryPicker(false)}
//           />
//           <Text>{country || 'Select Country'}</Text>
//         </TouchableOpacity>

//         <TextInput
//           style={styles.input}
//           value={city}
//           placeholderTextColor="#858585"
//           onChangeText={setCity}
//           placeholder="City"
//         />
//         <TextInput
//           style={[styles.input, {height: 100}]}
//           value={bio}
//           placeholderTextColor="#858585"
//           onChangeText={setBio}
//           placeholder="About Me"
//           multiline
//         />

//         {/* Save Button */}
//         <TouchableOpacity
//           style={styles.button}
//           onPress={handleSave}
//           disabled={isLoading}>
//           {isLoading ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={{color: 'white'}}>Save</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#fff'},
//   headerBackground: {
//     height: 180,
//     borderBottomRightRadius: 20,
//     borderBottomLeftRadius: 20,
//     overflow: 'hidden',
//   },
//   headerContent: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   backIcon: {position: 'absolute', top: 20, left: 20},
//   editIcon: {
//     position: 'absolute',
//     bottom: 35,
//     right: 20,
//     backgroundColor: '#EA7E24',
//     padding: 6,
//     borderRadius: 10,
//   },
//   formContainer: {padding: 15},
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//   },
//   button: {
//     backgroundColor: '#1D4F27',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
// });

// export default EditProfileScreen;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import {useNavigation} from '@react-navigation/native';
import {
  useEditProfileMutation,
  useUserProfileQuery,
} from '../../services/Auth/AuthApi';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const {data, isLoading, error} = useUserProfileQuery();
  const userProfile = data?.data;

  const [editProfile, {isLoading: isUpdating}] = useEditProfileMutation();

  const [user, setUser] = useState({
    profileImage: '',
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    gender: '',
    country: '',
    address: '',
    bio: '',
  });

  useEffect(() => {
    if (editProfile) {
      setUser({
        profileImage: userProfile?.profileImage || '',
        firstName: userProfile?.firstName || '',
        lastName: userProfile?.lastName || '',
        phone: userProfile?.phone || '',
        dob: userProfile?.dob || '',
        gender: userProfile?.gender || '',
        address: userProfile?.address || '',
        countryCode: userProfile?.countryCode || '',
      });
    }
  }, [userProfile]);

  const handleInputChange = (key, value) => {
    setUser(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Function to handle profile update
  const handleSave = async () => {
    try {
      const response = await editProfile(user).unwrap();
      if (response.status === 200) {
        console.log(response);
        Alert.alert('Success', response?.message);
      } else {
        Alert.alert('error', response?.message);
      }
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', response?.data?.data.message);
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
      <View style={styles.header}>
        <Image
          source={
            user.profileImage
              ? {uri: user.profileImage}
              : require('../../assets/user.png')
          }
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => console.log('Edit Image')}>
          <Icon name="edit" size={18} color="white" />
        </TouchableOpacity>
      </View>

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
          onValueChange={text => handleInputChange('gender', text)}
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
          placeholder="address"
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
  header: {
    backgroundColor: '#1A3F1E',
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  editIcon: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#EA7E24',
    padding: 8,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
