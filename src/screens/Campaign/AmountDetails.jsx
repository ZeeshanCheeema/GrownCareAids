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
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');

const AmountDetails = ({route}) => {
  const navigation = useNavigation();
  const {id, item, image = []} = route.params || {};

  const [amount, setAmount] = useState(item?.amount || '');
  const [startDate, setStartDate] = useState(item?.startDate || new Date());
  const [endDate, setEndDate] = useState(item?.endDate || new Date());
  const [description, setDescription] = useState(item?.description || '');
  const [images, setImages] = useState(image || []);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Open Image Library
  const handleImagePicker = () => {
    const options = {mediaType: 'photo', quality: 1, selectionLimit: 8};
    launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        setImages(prev => [...prev, ...response.assets.map(img => img.uri)]);
      }
    });
  };

  // Open Camera
  const handleCameraPicker = () => {
    const options = {mediaType: 'photo', quality: 1, saveToPhotos: true};
    launchCamera(options, response => {
      if (response.assets && response.assets.length > 0) {
        setImages(prev => [...prev, ...response.assets.map(img => img.uri)]);
      }
    });
  };

  // Remove Image
  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateForm = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount');
      return false;
    }
    if (!startDate) {
      Alert.alert('Validation Error', 'Please select a start date');
      return false;
    }
    if (!endDate) {
      Alert.alert('Validation Error', 'Please select an end date');
      return false;
    }
    if (new Date(startDate).getTime() >= new Date(endDate).getTime()) {
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
        {/* Amount Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor={'#858585'}
        />

        {/* Start Date Picker */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStartPicker(true)}>
          <Text style={{color: '#858585'}}>
            {startDate ? startDate.toDateString() : 'Select Start Date'}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {/* End Date Picker */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowEndPicker(true)}>
          <Text style={{color: '#858585'}}>
            {endDate ? endDate.toDateString() : 'Select End Date'}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        {/* Attachments */}
        <View style={styles.attachRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleCameraPicker}>
            <Icon name="camera-alt" size={22} color="#EA7E24" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleImagePicker}>
            <Icon name="photo-library" size={22} color="#EA7E24" />
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        {images.length > 0 ? (
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
        ) : (
          <Text style={styles.placeholderText}>No images selected</Text>
        )}

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
                  id,
                  item: {
                    ...item,
                    amount,
                    duration: [startDate.toISOString(), endDate.toISOString()], // Pass as array
                    description,
                    images,
                  },
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

export default AmountDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
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
  backButton: {
    position: 'absolute',
    left: 15,
    top: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {
    backgroundColor: '#EA7E24',
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  line: {
    width: width * 0.25,
    height: 3,
    backgroundColor: '#D3D3D3',
  },
  activeLine: {
    width: width * 0.25,
    height: 3,
    backgroundColor: '#EA7E24',
  },
  input: {
    borderWidth: 1,
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
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 2,
  },
  iconButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    marginHorizontal: 10,
  },
  imageGrid: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedImage: {
    width: (width - 80) / 4,
    height: 60,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 2,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    borderWidth: 1,
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
  placeholderText: {
    textAlign: 'center',
    color: '#858585',
    fontSize: 14,
    marginTop: 10,
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
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#EA7E24',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
