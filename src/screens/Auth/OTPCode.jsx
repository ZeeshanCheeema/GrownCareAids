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
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from '../../services/Auth/AuthApi';
import color from '../../utils/color';

const {width, height} = Dimensions.get('window');

const OTPCode = ({route}) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [verifyotp] = useVerifyOtpMutation();
  const [resendOtp, {isLoading}] = useResendOtpMutation();
  const email = route?.params?.email;

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
        Alert.alert(
          'Error',
          err?.data?.message || 'OTP verification failed, try again.',
        );
      }
    } else {
      Alert.alert('Invalid OTP', 'Please enter a 4-digit OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({email}).unwrap();
      console.log('Resend OTP Response:', response);
      Alert.alert('Success', response?.message || 'OTP resent successfully');
    } catch (err) {
      console.error('Resend OTP Error:', err);
      Alert.alert(
        'Error',
        err?.data?.message || 'Failed to resend OTP, try again.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={color.white} />
        </TouchableOpacity>
        <Text style={styles.title}>OTP Verification</Text>
        <Image
          source={require('../../assets/logoSmall.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.otpText}>
          We sent a verification code to your email. Enter verification code
          here!
        </Text>

        <View style={styles.otpInputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              placeholderTextColor={color.grey}
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

        <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
          <Text style={styles.resendText}>
            {isLoading ? 'Resending...' : 'Resend OTP'}
          </Text>
        </TouchableOpacity>

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
  otpText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: color.lightblack,
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
    borderColor: color.aqua,
    textAlign: 'center',
    fontSize: 25,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 30,
  },
  submitButton: {
    backgroundColor: color.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 250,
  },
  submitText: {
    color: color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    color: color.secondary,
    fontSize: 14,
    marginTop: 1,
  },
});

export default OTPCode;
