import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useUserProfileQuery} from '../../services/Auth/AuthApi';
import color from '../../utils/color';

const {width, height} = Dimensions.get('window');

const MyProfile = () => {
  const navigation = useNavigation();
  const {data, isLoading, error, refetch} = useUserProfileQuery();
  const userProfile = data?.data;

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1D4F27" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{color: 'red'}}>Error fetching campaigns!</Text>
        <TouchableOpacity style={styles.refetchButton} onPress={refetch}>
          <Text style={styles.refetchText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  console.log(userProfile);
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <ImageBackground
        source={
          userProfile?.profileImage
            ? {uri: userProfile.profileImage}
            : require('../../assets/user.png')
        }
        style={styles.headerBackground}
        imageStyle={{opacity: 0.7}}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.overlayContent}>
            <Text style={styles.userName}>
              {userProfile?.firstName} {userProfile?.lastName}
            </Text>
            <Text style={styles.userEmail}>{userProfile?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() =>
              navigation.navigate('EditProfile', {...userProfile})
            }>
            <Icon name="edit" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* User Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>My Info</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="event" size={25} color="#EA7E24" />
            <Text style={styles.infoText}>
              {userProfile?.dob || 'Date of birth'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="location-on" size={25} color="#EA7E24" />
            <Text style={styles.infoText}>
              {userProfile?.address || 'Location'}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="gender-male-female"
              size={25}
              color="#EA7E24"
            />
            <Text style={styles.infoText}>
              {userProfile?.gender || 'Female'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="phone" size={25} color="#EA7E24" />
            <Text style={styles.infoText}>{userProfile?.phone || 'Phone'}</Text>
          </View>
        </View>
      </View>

      {/* About Me Section */}
      <View style={styles.aboutContainer}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.aboutText}>{userProfile?.aboutMe}</Text>
      </View>

      {/* Contribution Section */}
      <View style={styles.contributionContainer}>
        <Text style={styles.sectionTitle}>Contribution</Text>

        <View style={styles.contributionRow}>
          <View style={styles.contributionBox}>
            <Text style={styles.contributionValue}>
              {userProfile?.totalCampaigns || 0}
            </Text>
            <Text style={styles.contributionLabel}>Campaign</Text>
          </View>

          <View style={styles.contributionBox}>
            <Text style={styles.contributionValue}>
              ${userProfile?.totalDonatedAmount || 0}
            </Text>
            <Text style={styles.contributionLabel}>Donated</Text>
          </View>

          <View style={styles.contributionBox}>
            <Text style={styles.contributionValue}>
              ${userProfile?.totalGeneratedAmount || 0}
            </Text>
            <Text style={styles.contributionLabel}>Generated</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.background},
  headerBackground: {
    height: height * 0.25,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 6,
  },
  editIcon: {
    position: 'absolute',
    bottom: 35,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 6,
    borderRadius: 10,
  },
  overlayContent: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 6,
    borderRadius: 10,
  },
  userName: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: color.white,
  },
  userEmail: {fontSize: width * 0.04, color: color.white},

  infoContainer: {
    backgroundColor: color.white,
    padding: width * 0.05,
    borderRadius: 15,
    marginHorizontal: width * 0.04,
    marginVertical: 30,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: color.primarytext,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    flex: 1,
  },
  infoText: {
    fontSize: width * 0.04,
    color: color.grey,
    marginLeft: 5,
  },

  aboutContainer: {
    backgroundColor: color.white,
    padding: width * 0.05,
    borderRadius: 15,
    marginHorizontal: width * 0.04,
    marginTop: -20,
  },
  aboutText: {fontSize: width * 0.04, color: color.lightblack, marginTop: 10},

  contributionContainer: {
    backgroundColor: color.white,
    padding: width * 0.05,
    borderRadius: 15,
    marginHorizontal: width * 0.04,
    marginTop: -20,
  },
  contributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contributionBox: {
    flex: 1,
    marginTop: 15,
    backgroundColor: color.secondary,
    paddingVertical: height * 0.05,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  refetchButton: {
    marginTop: 15,
    backgroundColor: color.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  refetchText: {color: color.white, fontWeight: 'bold'},
  contributionValue: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: color.white,
  },
  contributionLabel: {
    fontSize: width * 0.035,
    color: color.white,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: color.red,
  },
});

export default MyProfile;
