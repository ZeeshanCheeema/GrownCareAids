import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  useGetAllCampaignsQuery,
  apiSlice,
  useUserProfileQuery,
} from '../services/Auth/AuthApi';
import {useDispatch} from 'react-redux';
import color from '../utils/color';

const {width} = Dimensions.get('window');

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [images, setImages] = useState({});
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Fetch user profile
  const {data: userProfile} = useUserProfileQuery();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (userProfile?.data?.profileImage) {
      setProfileImage(userProfile.data.profileImage);
    }
  }, [userProfile]);

  const {data, isLoading, error} = useGetAllCampaignsQuery();

  const fetchCampaignImages = async campaigns => {
    if (!campaigns || !campaigns.length) return;

    const imagePromises = campaigns.map(async fund => {
      if (!fund.images || !fund.images.length)
        return {id: fund._id, imageUrl: null};

      try {
        const result = await dispatch(
          apiSlice.endpoints.getImage.initiate(fund.images[0]),
        ).unwrap();
        return {id: fund._id, imageUrl: result.data};
      } catch (error) {
        return {id: fund._id, imageUrl: null};
      }
    });

    const imageResults = await Promise.all(imagePromises);
    const imageMap = imageResults.reduce((acc, {id, imageUrl}) => {
      acc[id] = imageUrl;
      return acc;
    }, {});

    setImages(imageMap);
  };

  const handleSearch = text => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredCampaigns([]);
      return;
    }
    const filtered = data?.data?.filter(item =>
      item?.title?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCampaigns(filtered || []);
  };

  useEffect(() => {
    if (data?.data) {
      fetchCampaignImages(data.data);
    }
  }, [data]);

  const donationTarget = data?.data?.raisedAmount || 0;
  const totalFundraise = data?.data?.amount || 0;
  const progress =
    donationTarget > 0
      ? ((totalFundraise / donationTarget) * 100).toFixed(1)
      : 0;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image source={require('../assets/logoSmall.png')} />
            {/* Profile Image */}
            <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
              <Image
                source={
                  profileImage
                    ? {uri: profileImage}
                    : require('../assets/user.png')
                }
                style={styles.userImg}
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={25}
              color="#858585"
              style={styles.searchIcon}
            />
            <TextInput
              placeholderTextColor={'#858585'}
              placeholder="Search here"
              style={styles.searchInput}
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
        </View>
        {/* Campaign List */}
        <View style={styles.content}>
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map(item => (
              <TouchableOpacity
                key={item._id}
                onPress={() =>
                  navigation.navigate('SearchViewCampaign', {
                    image:
                      images[item._id] || (item.images && item.images[0]) || '',
                    item,
                    id: item._id,
                  })
                }
                style={styles.campaignCard}>
                <Image
                  source={{
                    uri:
                      images[item._id] ||
                      (item.images && item.images[0]) ||
                      'https://via.placeholder.com/150',
                  }}
                  style={styles.campaignImage}
                />
                <View style={styles.campaignDetails}>
                  <Text style={styles.campaignTitle}>{item.title}</Text>
                  <Text style={styles.progressText}>{item.status}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {width: `${Math.min(progress, 100)}%`},
                      ]}
                    />
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Duration</Text>
                    <Text style={styles.infoLabel}>Location</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValueDuration}>
                      {item.duration}
                    </Text>
                    <Text style={styles.infoValue}>{item.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : searchText.trim() ? (
            <View style={{alignItems: 'center', marginTop: 20}}>
              <Image
                source={require('../assets/SearchBg.png')}
                style={{width: 200, height: 200}}
              />
              <Text style={styles.noDataText}>No campaigns found.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.background, marginBottom: 60},
  header: {
    backgroundColor: color.primary,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    height: 150,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userImg: {width: 40, height: 40, borderRadius: 20},
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: color.white,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    height: 50,
    width: width - 40,
    alignSelf: 'center',
    elevation: 2,
    position: 'absolute',
    bottom: -20,
  },
  searchInput: {flex: 1, fontSize: 16, color: color.lightblack},
  searchIcon: {padding: 10},
  content: {padding: 20, marginTop: 30},
  campaignCard: {
    flexDirection: 'row',
    backgroundColor: color.white,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: color.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    overflow: 'hidden',
    paddingVertical: 10,
  },
  campaignImage: {width: 120, borderRadius: 10},
  campaignDetails: {flex: 1, marginLeft: 10},
  campaignTitle: {fontSize: 14, fontWeight: 'bold', marginVertical: 5},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  infoLabel: {fontSize: 12, color: color.lightblack},
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  infoValueDuration: {
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
    width: 70,
    marginRight: 5,
  },
  progressBar: {
    height: 5,
    backgroundColor: color.progress,
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 5,
  },
  progressFill: {height: 5, backgroundColor: color.primary},
  progressText: {
    fontSize: 12,
    textAlign: 'right',
    color: color.primary,
    marginTop: 2,
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
    color: color.grey,
    marginTop: 20,
  },
  loader: {marginTop: 50},
  error: {color: color.red, textAlign: 'center', marginTop: 20},
});

export default Search;
