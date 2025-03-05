import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const InitialScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          'hasCompletedOnboarding',
        );

        if (token) {
          setRedirect('BottomTab');
        } else if (hasCompletedOnboarding === 'true') {
          setRedirect('Login');
        } else {
          setRedirect('Onboarding');
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!loading && redirect) {
      navigation.reset({index: 0, routes: [{name: redirect}]});
    }
  }, [loading, redirect, navigation]);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#EA7E24" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default InitialScreen;
