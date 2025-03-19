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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useForgetPasswordMutation} from '../../services/Auth/AuthApi';
import color from '../../utils/color';

const {width, height} = Dimensions.get('window');

const ForgetPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [forgotPassword] = useForgetPasswordMutation();

  // Email Validation Function
  const isValidEmail = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleOtpSubmit = async () => {
    if (!email.trim()) {
      return Alert.alert('Error', 'Email is required.');
    }
    if (!isValidEmail(email)) {
      return Alert.alert('Error', 'Please enter a valid email address.');
    }

    try {
      const response = await forgotPassword({email}).unwrap();
      console.log('Forgot Password Response:', response);
      if (response.status === 200) {
        Alert.alert('Success', response?.message);
        navigation.navigate('OTPCode', {email});
      } else {
        Alert.alert('Error', response?.err);
      }
    } catch (error) {
      console.error('Forgot Password Error:', error);
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to send OTP, try again.',
      );
    }
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
        <Text style={styles.title}>Forget Password</Text>
        <Image
          source={require('../../assets/logoSmall.png')}
          style={styles.logo}
        />
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.infoText}>
          Enter your email to receive an OTP for password reset.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="#858585"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleOtpSubmit}>
          <Text style={styles.submitText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  headerTop: {
    backgroundColor: color.secondary,
    height: height * 0.22,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: color.white,
    fontFamily: 'PT Serif',
  },
  logo: {
    width: 130,
    height: 33,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 1,
    left: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 40,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: color.grey,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: color.aqua,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: color.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgetPassword;
