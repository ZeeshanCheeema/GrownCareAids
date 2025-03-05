import React, {useState, useRef} from 'react';
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
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from '../../services/Auth/AuthApi';
useVerifyOtpMutation, useResendOtpMutation;
const {width, height} = Dimensions.get('window');

const SignupOtp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email;
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [verifyotp, {isLoading}] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length === 4) {
      try {
        await verifyotp({email, otp: otpCode}).unwrap();
        navigation.navigate('Login');
      } catch (err) {
        alert(err?.data?.message || 'OTP verification failed, try again.');
      }
    } else {
      alert('Please enter a 4-digit OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({email}).unwrap();
      console.log('Resend OTP Response:', response);
      if (response?.status === 200) {
        Alert.alert(response?.message);
      }
    } catch (err) {
      console.error('Resend OTP Error:', err); // <-- Log errors
      Alert.alert(err?.data?.message || 'Failed to resend OTP, try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>OTP verification</Text>
        <Image
          source={require('../../assets/logoSmall.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.otpText}>
          We sent a verification code to your email.{email} Enter verification
          code here!
        </Text>

        <View style={styles.otpInputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={value => handleOtpChange(index, value)}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleResendOtp}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleOtpSubmit}
          disabled={isLoading}>
          <Text style={styles.submitText}>
            {isLoading ? 'Verifying...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTop: {
    backgroundColor: '#1A3F1E',
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
    color: 'white',
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
  otpText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 25,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 30,
    left: 15,
  },
  submitButton: {
    backgroundColor: '#1A3F1E',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 180,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    color: '#EA7E24',
    fontSize: 14,
    marginTop: 1,
  },
});

export default SignupOtp;
