import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogoutMutation, useUserProfileQuery} from '../services/Auth/AuthApi';
import Logout from './Auth/Logout';

import logo from '../assets/logo.png';
import Loader from '../components/Loader';

const MenuItem = ({icon, text, onPress}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Icon name={icon} size={24} color="#1D4F27" style={styles.icon} />
    <Text style={styles.menuText}>{text}</Text>
    <Icon name="chevron-right" size={22} color="#888" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [logout] = useLogoutMutation();
  const {data, isLoading, error} = useUserProfileQuery();
  const userProfile = data?.data;
  const [isLogoutVisible, setLogoutVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      AsyncStorage.removeItem('accessToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  console.log(userProfile);
  if (isLoading) {
    return <Loader message="Loading campaigns..." logoSource={logo} />;
  }

  if (error || !userProfile) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            userProfile?.profileImage
              ? {uri: userProfile.profileImage}
              : require('../assets/user.png')
          }
          style={styles.profileImage}
        />

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {userProfile?.firstName} {userProfile?.lastName}
          </Text>
          <Text style={styles.userEmail}>{userProfile?.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => navigation.navigate('EditProfile', {userProfile})}>
          <Icon name="edit" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          icon="person"
          text="My Profile"
          onPress={() => navigation.navigate('MyProfile')}
        />
        {/* <MenuItem
          icon="language"
          text="Language"
          onPress={() => navigation.navigate('Language')}
        /> */}
        <MenuItem
          icon="history"
          text="Donation History"
          onPress={() => navigation.navigate('DonationHistory')}
        />
        <MenuItem
          icon="campaign"
          text="My Campaign"
          onPress={() => navigation.navigate('MyCampaign')}
        />
        <MenuItem
          icon="settings"
          text="Settings"
          onPress={() => navigation.navigate('SettingsScreen')}
        />
        <MenuItem
          icon="policy"
          text="Privacy Policy"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
        <MenuItem
          icon="gavel"
          text="Terms & Conditions"
          onPress={() => navigation.navigate('TermCondition')}
        />
      </View>

      <MenuItem
        icon="logout"
        text="Sign Out"
        onPress={() => setLogoutVisible(true)}
      />

      <Logout
        visible={isLogoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
        userName={`${userProfile?.firstName} ${userProfile?.lastName}`}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginBottom: 90,
  },
  header: {
    backgroundColor: '#1A3F1E',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  userEmail: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  editIcon: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#EA7E24',
    padding: 8,
    borderRadius: 10,
  },
  menuContainer: {
    marginVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
