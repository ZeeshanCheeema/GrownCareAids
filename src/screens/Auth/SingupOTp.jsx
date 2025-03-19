import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
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
import OtpInputs from 'react-native-otp-inputs';
import colors from '../../utils/color';

const {width, height} = Dimensions.get('window');

const SignupOtp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email;
  const [otp, setOtp] = useState('');
  const [verifyotp, {isLoading}] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  // Handle OTP updates safely
  const handleOtpChange = code => {
    if (code.length <= 4) {
      setOtp(code);
    }
  };

  useEffect(() => {
    if (otp.length === 4) {
      handleOtpSubmit();
    }
  }, [otp]);

  const handleOtpSubmit = async () => {
    if (otp.length === 4) {
      try {
        await verifyotp({email, otp}).unwrap();
        navigation.navigate('Login');
      } catch (err) {
        Alert.alert(
          'Error',
          err?.data?.message || 'OTP verification failed, try again.',
        );
      }
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
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>OTP Verification</Text>
        <Image
          source={require('../../assets/logoSmall.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.otpText}>
          We sent a verification code to your email. {email} Enter the code
          below.
        </Text>

        <View style={styles.otpInputContainer}>
          <OtpInputs
            handleChange={handleOtpChange}
            numberOfInputs={4}
            style={styles.otpInputContainer}
            inputStyles={styles.input}
          />
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
    backgroundColor: colors.white,
  },
  headerTop: {
    backgroundColor: colors.primary,
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
    color: colors.white,
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
    color: colors.lightblack,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },

  input: {
    width: 50,
    height: 60,
    fontSize: 24,
    borderWidth: 2,
    borderColor: colors.aqua,
    textAlign: 'center',
    borderRadius: 10,
    color: colors.dark,
    backgroundColor: colors.lightGray, // Optional for better visibility
    marginHorizontal: 8, // Spacing between input boxes
  },

  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 180,
  },
  submitText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    color: colors.secondary,
    fontSize: 14,
    marginTop: 1,
  },
});

export default SignupOtp;
