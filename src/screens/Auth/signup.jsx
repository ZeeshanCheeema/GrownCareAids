import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSignUpMutation} from '../../services/Auth/AuthApi';
import color from '../../utils/color';

const {width, height} = Dimensions.get('window');

const Signup = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const [signup, {isLoading}] = useSignUpMutation();

  const isValidEmail = email => /\S+@\S+\.\S+/.test(email);

  const handleSignup = async () => {
    setError('');

    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const response = await signup({
        firstName,
        lastName,
        email,
        password,
      }).unwrap();

      console.log('Signup Response:', response);

      if (response?.status === 200 || response?.status === 201) {
        Alert.alert('Success', response.message);
        navigation.navigate('SignupOtp', {email});
      } else {
        Alert.alert('Error', response?.err || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup Error:', err);
      setError(err?.data?.message || 'Signup failed, try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Create Your Account</Text>
        <Image
          source={require('../../assets/logoSmall.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.formContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.nameRow}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor={color.grey}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor={color.grey}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            placeholderTextColor={color.grey}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor={color.grey}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={22}
              color={color.grey}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.signInButton, isLoading && styles.disabledButton]}
          onPress={handleSignup}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={color.white} />
          ) : (
            <Text style={styles.signInText}>Sign up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        {/* Google Login */}
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../assets/google.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Continue With Google</Text>
        </TouchableOpacity>

        {/* Facebook Login */}
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../assets/facebook.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Continue With Facebook</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.signUpText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: color.red,
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  disabledButton: {backgroundColor: color.aqua},
  container: {flex: 1, backgroundColor: color.white},
  headerTop: {
    backgroundColor: color.primary,
    height: height * 0.22,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
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
  formContainer: {paddingHorizontal: 20, marginTop: 40},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: color.aqua,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {flex: 1, height: 45, fontSize: 16, color: color.black},
  signInButton: {
    backgroundColor: color.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.background,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  socialText: {
    fontSize: 16,
    color: color.primary,
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: color.grey,
    marginVertical: 15,
  },
  signInText: {
    color: color.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  signUpText: {fontSize: 14, color: color.black, marginBottom: 30},
  signUpLink: {color: color.secondary, fontWeight: 'bold', marginBottom: 30},
});

export default Signup;
