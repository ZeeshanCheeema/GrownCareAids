import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');

const AmountDetails = ({route}) => {
  const navigation = useNavigation();

  // Get passed parameters for editing
  const {
    id,
    title,
    category,
    location,
    city,
    description: initialDescription = 'no description',
    duration: initialDuration = '00',
    images: initialImages = [],
    totalFundraise: initialTotalFundraise = '',
  } = route.params || {};

  const [amount, setAmount] = useState(initialTotalFundraise);
  const [startDate, setStartDate] = useState(initialDuration);
  const [endDate, setEndDate] = useState(initialDuration);
  const [description, setDescription] = useState(initialDescription);
  const [images, setImages] = useState(initialImages);
  console.log('ïmages', images);

  const handleImagePicker = () => {
    const options = {mediaType: 'photo', quality: 1, selectionLimit: 8};
    launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        setImages(prev => [...prev, ...response.assets.map(img => img.uri)]);
      }
    });
  };

  // Camera Picker
  const handleCameraPicker = () => {
    const options = {mediaType: 'photo', quality: 1, saveToPhotos: true};
    launchCamera(options, response => {
      if (response.assets && response.assets.length > 0) {
        setImages(prev => [...prev, ...response.assets.map(img => img.uri)]);
      }
    });
  };

  // Remove image
  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Validation function
  const validateForm = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount');
      return false;
    }
    if (!startDate) {
      Alert.alert('Validation Error', 'Please enter a start date');
      return false;
    }
    if (!endDate) {
      Alert.alert('Validation Error', 'Please enter an end date');
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      Alert.alert('Validation Error', 'End date should be after start date');
      return false;
    }
    if (!description) {
      Alert.alert('Validation Error', 'Please write a description');
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerTop}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Amount Details</Text>
      </View>

      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <AntDesign name="checkcircle" size={24} color="green" />
        <View style={styles.activeLine} />
        <View style={[styles.step, styles.activeStep]}>
          <Text style={styles.stepText}>2</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.step}>
          <Text style={styles.stepText}>3</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 50}}>
        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor={'#858585'}
        />
        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD)"
          value={startDate}
          onChangeText={setStartDate}
          placeholderTextColor={'#858585'}
        />
        <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD)"
          value={endDate}
          onChangeText={setEndDate}
          placeholderTextColor={'#858585'}
        />

        {/* Attach Row: Left column for icons, right column for images */}
        <View style={styles.attachRow}>
          {/* Icon Column */}
          <View style={styles.iconColumn}>
            {/* Camera Button */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleCameraPicker}>
              <Icon name="camera-alt" size={22} color="#EA7E24" />
            </TouchableOpacity>
            {/* Gallery Button */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleImagePicker}>
              <Icon name="photo-library" size={22} color="#EA7E24" />
            </TouchableOpacity>
          </View>

          {/* Image Column */}
          <View style={styles.imageColumn}>
            {images.length > 0 && (
              <FlatList
                data={images}
                keyExtractor={(_, index) => String(index)}
                numColumns={3}
                style={styles.imageGrid}
                renderItem={({item, index}) => (
                  <View style={styles.imageWrapper}>
                    <Image source={{uri: item}} style={styles.selectedImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}>
                      <AntDesign name="closecircle" size={11} color="#EA7E24" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        </View>

        {/* Description */}
        <TextInput
          style={styles.textArea}
          placeholder="Write description here..."
          value={description}
          onChangeText={setDescription}
          multiline
          placeholderTextColor={'#858585'}
        />

        {/* Buttons */}
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
                navigation.navigate('Review', {
                  title,
                  category,
                  location,
                  city,
                  amount,
                  duration: [startDate, endDate],
                  description,
                  images,
                  id,
                });
              }
            }}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9F9F9'},
  headerTop: {
    backgroundColor: '#EA7E24',
    height: height * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  backButton: {position: 'absolute', left: 15, top: 10, zIndex: 1},
  title: {fontSize: 22, fontWeight: 'bold', color: 'white'},
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
  activeLine: {width: width * 0.25, height: 3, backgroundColor: '#EA7E24'},
  input: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    color: '#333',
  },
  attachRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  iconColumn: {
    width: 80,
    marginRight: 10,
    justifyContent: 'space-between',
  },
  iconButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  imageColumn: {
    flex: 1,
  },
  imageGrid: {
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedImage: {
    width: (width - 100 - 70) / 4,
    height: 47,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    width: 15,
    height: 15,
  },
  textArea: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    height: 100,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 30,
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
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default AmountDetails;
