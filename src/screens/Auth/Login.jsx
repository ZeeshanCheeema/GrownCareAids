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
import {useLoginMutation} from '../../services/Auth/AuthApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setCredentials} from '../../services/Auth/AuthReducer';

const {width, height} = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const [login, {isLoading}] = useLoginMutation();

  const isValidEmail = email => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');

    try {
      const response = await login({
        email,
        password,
        loginType: 'email',
      }).unwrap();

      if (response?.data?.access_token) {
        await AsyncStorage.setItem('accessToken', response.data.access_token);
        console.log(response);
        dispatch(
          setCredentials({
            token: response.data.access_token,
            user: response.user,
          }),
        );
        if (response.status === 200) {
          Alert.alert('Success', response?.message);
          navigation.navigate('BottomTab');
        }
      } else {
        Alert.alert('Error', response?.message);
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Logo */}
      <View style={styles.headerTop}>
        <Text style={styles.title}>Welcome Back</Text>
        <Image
          source={require('../../assets/logoSmall.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.formContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            placeholderTextColor={'#858585'}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Icon
            name="email"
            size={22}
            color="#858585"
            style={styles.inputIcon}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            value={password}
            placeholderTextColor={'#858585'}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={22}
              color="#858585"
              style={styles.inputIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgetPassword')}
          style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[
            styles.signInButton,
            (!email || !password || isLoading) && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={!email || !password || isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInText}>Sign In</Text>
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

        {/* Sign Up Link */}
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signUpLink}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  headerTop: {
    backgroundColor: '#1A3F1E',
    height: height * 0.22,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 10,
    position: 'absolute',
    bottom: 1,
    left: 1,
  },
  formContainer: {paddingHorizontal: 20, marginTop: 40},
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {flex: 1, height: 45, fontSize: 14, color: 'black'},
  inputIcon: {marginLeft: 10},
  forgotPasswordContainer: {alignSelf: 'flex-end'},
  forgotPassword: {
    color: '#EA7E24',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 21,
  },
  signInButton: {
    backgroundColor: '#1A3F1E',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  disabledButton: {backgroundColor: '#ccc'},
  signInText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#858585',
    marginVertical: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  socialIcon: {width: 24, height: 24, marginHorizontal: 10},
  socialText: {fontSize: 16, color: '#1A3F1E', textAlign: 'center'},
  signUpText: {fontSize: 14},
  signUpLink: {color: '#EA7E24', fontWeight: 'bold'},
});

export default Login;
