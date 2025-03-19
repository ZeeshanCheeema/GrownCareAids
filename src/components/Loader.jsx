import React, {useEffect, useRef} from 'react';
import {
  Animated,
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import color from '../utils/color';

const Loader = ({message = 'Loading...', logoSource}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.loadingContainer, {opacity: fadeAnim}]}>
      {logoSource && <Image source={logoSource} style={styles.logo} />}
      <ActivityIndicator size="large" color="#EA7E24" style={styles.loader} />
      <Text style={styles.loadingText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.background,
  },
  logo: {
    width: 300,

    marginBottom: 20,
    resizeMode: 'contain',
  },
  loader: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: color.secondary,
    fontWeight: 'bold',
  },
});

export default Loader;
