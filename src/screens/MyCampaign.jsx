import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  useGetAuthUserCampaignQuery,
  apiSlice,
  useUserProfileQuery,
} from '../services/Auth/AuthApi';
import {useDispatch} from 'react-redux';
import logo from '../assets/logo.png';
import Loader from '../components/Loader';
const {width} = Dimensions.get('window');

const Mycampaign = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {data, isLoading, error, refetch} = useGetAuthUserCampaignQuery();
  const {data: userProfile} = useUserProfileQuery();

  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState('Active');
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [images, setImages] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  // Set profile image from user data
  useEffect(() => {
    if (userProfile?.data?.profileImage) {
      setProfileImage(userProfile.data.profileImage);
    }
  }, [userProfile]);

  // Fetch campaign images
  const fetchCampaignImages = async campaigns => {
    if (!campaigns?.length) return;

    const newImages = {...images};
    const imagePromises = campaigns.map(async fund => {
      if (!fund.images?.length || newImages[fund._id]) return;
      try {
        const result = await dispatch(
          apiSlice.endpoints.getImage.initiate(fund.images[0]),
        ).unwrap();
        newImages[fund._id] = result.data;
      } catch (error) {
        newImages[fund._id] = null;
      }
    });

    await Promise.all(imagePromises);
    setImages(newImages);
  };

  // Filter campaigns based on tab selection
  useEffect(() => {
    if (data?.data) {
      const filtered = data.data.filter(
        item => item.status.toLowerCase() === selectedTab.toLowerCase(),
      );
      setFilteredCampaigns(filtered);
      fetchCampaignImages(filtered); // Fetch only necessary images
    }
  }, [data, selectedTab]);
  const formatDate = dateString => {
    if (!dateString) return 'N/A'; // Handle empty values

    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date'; // Handle invalid dates

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Returns DD-MM-YYYY format
  };

  // Handle search
  const handleSearch = text => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredCampaigns(
        data?.data?.filter(
          item => item.status.toLowerCase() === selectedTab.toLowerCase(),
        ) || [],
      );
      return;
    }
    const filtered = data?.data?.filter(
      item =>
        item.title.toLowerCase().includes(text.toLowerCase()) &&
        item.status.toLowerCase() === selectedTab.toLowerCase(),
    );
    setFilteredCampaigns(filtered || []);
  };

  // Loading state

  if (isLoading) {
    return <Loader message="Loading campaigns..." logoSource={logo} />;
  }

  // Error state

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
            <Image
              source={{uri: profileImage || 'https://via.placeholder.com/150'}}
              style={styles.userImg}
            />
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

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['Active', 'Pending', 'Completed'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTab,
              ]}
              onPress={() => setSelectedTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Campaign List */}
        <View style={styles.content}>
          {filteredCampaigns?.length > 0 ? (
            filteredCampaigns.map(item => (
              <TouchableOpacity
                key={item._id}
                onPress={() =>
                  navigation.navigate('myCampaignEdit', {
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
                        {
                          width: `${
                            (item.raisedAmount / item.amount) * 100 || 0
                          }%`,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Duration</Text>
                    <Text style={styles.infoLabel}>Location</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValueDate}>
                      {Array.isArray(item.duration)
                        ? item.duration
                            .map(date => formatDate(date))
                            .join(' - ')
                        : formatDate(item.duration)}
                    </Text>

                    <Text style={styles.infoValue}>{item.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{alignItems: 'center', marginTop: 20}}>
              <Image
                source={require('../assets/SearchBg.png')}
                style={{width: 200, height: 200}}
              />
              <Text style={styles.noDataText}>No campaigns found.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9F9F9', marginBottom: 70},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  loader: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#EA7E24',
    fontWeight: 'bold',
  },
  errorContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  header: {
    backgroundColor: '#1A3F1E',
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
    backgroundColor: '#F2F2F2',
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
  searchInput: {flex: 1, fontSize: 16, color: '#333'},
  searchIcon: {padding: 10},

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    width: width * 0.9,
    left: 20,
    borderWidth: 0.5,
    borderColor: '#1A3F1E',
    padding: 15,
    borderRadius: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ddd',
    overflow: 'hidden',
    justifyContent: 'space-around',
  },
  activeTab: {
    backgroundColor: '#1A3F1E',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  refetchButton: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A3F1E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 130,
  },
  refetchText: {color: 'white', fontWeight: 'bold'},
  tabText: {fontWeight: 'bold', color: '#666'},
  activeTabText: {color: 'white'},
  content: {padding: 20, marginTop: 10},
  campaignCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    overflow: 'hidden',
    paddingVertical: 10,
  },
  campaignImage: {width: 120, height: 'auto', borderRadius: 10},
  campaignDetails: {flex: 1, marginLeft: 10},
  campaignTitle: {fontSize: 14, fontWeight: 'bold', marginVertical: 5},
  progressBar: {
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5,
  },
  progressFill: {height: 5, backgroundColor: '#1A3F1E'},
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#858585',
    marginTop: 20,
    width: 100,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  infoLabel: {fontSize: 12, color: '#888'},
  infoValue: {
    fontSize: 14,
    color: '#777',
  },
  infoValueDate: {width: 80, color: '#858585'},
});

export default Mycampaign;
