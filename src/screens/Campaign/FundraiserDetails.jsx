import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-picker/picker';
import {useGetCategoriesQuery} from '../../services/Auth/AuthApi';

const {width, height} = Dimensions.get('window');

const FundraiserDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {data, isLoading, error} = useGetCategoriesQuery();

  const {id = null, item = {}, images = []} = route.params || {};

  // Form states (pre-filled for editing)
  const [title, setTitle] = useState(item.title || '');
  const [category, setCategory] = useState(item.Category || '');
  const [location, setLocation] = useState(item.location || '');
  const [city, setCity] = useState(item.city || '');

  // Form validation
  const validateForm = () => {
    if (!title || !category || !location || !city) {
      Alert.alert('Validation Error', 'Please fill out all fields');
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.headerTop}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Fundraiser Details</Text>
      </View>

      {/* 🔹 Stepper */}
      <View style={styles.stepperContainer}>
        <View style={[styles.step, styles.activeStep]}>
          <Text style={styles.stepText}>1</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.step}>
          <Text style={styles.stepText}>2</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.step}>
          <Text style={styles.stepText}>3</Text>
        </View>
      </View>

      {/* 🔹 Input Fields */}
      <TextInput
        placeholderTextColor={'#858585'}
        style={styles.input}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Dropdown for Category */}
      <View style={styles.pickerContainer}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading categories...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Failed to load categories</Text>
        ) : (
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}>
            <Picker.Item label="Select Category" value="" color="grey" />
            {data?.data?.map(item => (
              <Picker.Item key={item._id} label={item.name} value={item._id} />
            ))}
          </Picker>
        )}
      </View>

      <TextInput
        placeholderTextColor={'#858585'}
        style={styles.input}
        placeholder="Enter Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor={'#858585'}
        value={city}
        onChangeText={setCity}
      />

      {/* 🔹 Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButtonStyle}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            if (validateForm()) {
              navigation.navigate('AmountDetails', {
                id,
                item: {
                  title,
                  category:
                    data?.data?.find(cat => cat._id === category) || null,
                  location,
                  city,
                },
                images,
              });
            }
          }}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9F9F9'},
  headerTop: {
    backgroundColor: '#EA7E24',
    height: height * 0.15,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  backButton: {position: 'absolute', left: 15, top: 10, zIndex: 1},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 25,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {backgroundColor: '#EA7E24'},
  stepText: {color: '#fff', fontWeight: 'bold'},
  line: {width: width * 0.25, height: 3, backgroundColor: '#D3D3D3'},
  input: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    width: width * 0.9,
    height: 53,
    color: '#333',
  },
  pickerContainer: {
    marginHorizontal: 20,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  picker: {height: 53, width: 350, color: '#000'},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 90,
  },
  backButtonStyle: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  backButtonText: {color: '#333', fontSize: 16, fontWeight: 'bold'},
  continueButton: {
    backgroundColor: '#EA7E24',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#EA7E24',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default FundraiserDetails;
