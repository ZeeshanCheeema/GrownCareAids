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

      console.log('Signup Response:', response); // Debugging

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
              placeholderTextColor={'#858585'}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor={'#858585'}
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
            placeholderTextColor={'#858585'}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor={'#858585'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={22}
              color="#858585"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.signInButton, isLoading && styles.disabledButton]}
          onPress={handleSignup}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
          }}>
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
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  disabledButton: {backgroundColor: '#ccc'},
  container: {flex: 1, backgroundColor: '#fff'},
  headerTop: {
    backgroundColor: '#1A3F1E',
    height: height * 0.22,
    justifyContent: 'center',
    alignItems: 'center',
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
  formContainer: {paddingHorizontal: 20, marginTop: 40},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {flex: 1, height: 45, fontSize: 16, color: '#333'},
  signInButton: {
    backgroundColor: '#1A3F1E',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    color: '#1A3F1E',
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#858585',
    marginVertical: 15,
  },
  signInText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {fontSize: 14},
  signUpLink: {color: '#EA7E24', fontWeight: 'bold'},
});

export default Signup;
