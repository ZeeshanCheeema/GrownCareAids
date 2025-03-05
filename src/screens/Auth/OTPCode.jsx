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
import {useResendOtpMutation} from '../../services/Auth/AuthApi'; // ✅ Import API function

const {width, height} = Dimensions.get('window');

const OTPCode = ({route}) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

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

  const handleOtpSubmit = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 4) {
      Alert.alert('Success', `OTP Submitted: ${otpCode}`);
      navigation.navigate('NewPassword');
    } else {
      Alert.alert('Error', 'Please enter a 4-digit OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({email}).unwrap();
      console.log('Resend OTP Response:', response);
      if (response.status == 200) {
        Alert.alert('success', response?.message);
      } else {
      }
    } catch (err) {
      console.error('Resend OTP Error:', err); // <-- Log errors
      alert(err?.data?.message || 'Failed to resend OTP, try again.');
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
              placeholderTextColor="#858585"
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
    backgroundColor: '#fff',
  },
  headerTop: {
    backgroundColor: '#EA7E24',
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
  },
  submitButton: {
    backgroundColor: '#EA7E24',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 250,
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

export default OTPCode;
