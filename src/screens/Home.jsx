import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import TopCampaigns from '../components/TopCampaigns';
import Categories from '../components/Categories';
import {
  useGetUserNotificationsQuery,
  useGetAllCampaignsQuery,
  apiSlice,
  useUserProfileQuery,
} from '../services/Auth/AuthApi';
import {useDispatch} from 'react-redux';
import color from '../utils/color';

const {width} = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [images, setImages] = useState({});
  const {data: userProfile} = useUserProfileQuery();
  const [profileImage, setProfileImage] = useState(null);
  useEffect(() => {
    if (userProfile?.data?.profileImage) {
      setProfileImage(userProfile.data.profileImage);
    }
  }, [userProfile]);
  // Fetch notifications
  const {data: notification, isLoading: notifLoading} =
    useGetUserNotificationsQuery();
  const notifications = notification?.data || [];
  const notificationCount = notifications.length;

  const {data, isLoading, error} = useGetAllCampaignsQuery();

  const fetchCampaignImages = async campaigns => {
    if (!campaigns || !campaigns.length) return;
    const imagePromises = campaigns.map(async campaign => {
      if (!campaign.images || !campaign.images.length)
        return {id: campaign._id, imageUrl: null};

      try {
        const result = await dispatch(
          apiSlice.endpoints.getImage.initiate(campaign.images[0]),
        ).unwrap();
        return {id: campaign._id, imageUrl: result.data};
      } catch (error) {
        return {id: campaign._id, imageUrl: null};
      }
    });
    const imageResults = await Promise.all(imagePromises);
    const imageMap = imageResults.reduce((acc, {id, imageUrl}) => {
      acc[id] = imageUrl;
      return acc;
    }, {});
    setImages(imageMap);
  };

  // When campaigns data loads, fetch images
  useEffect(() => {
    if (data?.data) {
      fetchCampaignImages(data.data);
    }
  }, [data]);

  // Update search results whenever searchQuery changes
  useEffect(() => {
    if (data?.data && searchQuery.trim()) {
      const filtered = data.data.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, data]);

  // Render header separately
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {/* Notification Icon with Badge */}
        <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
          <View style={styles.notificationContainer}>
            <Icon name="notifications" size={22} color="white" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        {/* Profile Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
          <Image
            source={
              profileImage ? {uri: profileImage} : require('../assets/user.png')
            }
            style={styles.userImg}
          />
        </TouchableOpacity>
      </View>
      {/* Welcome Message */}
      <View style={styles.headerText}>
        <Text style={styles.welcomeText}>Welcome 👋</Text>
        <Text style={styles.subtitle}>What do you want to donate today?</Text>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search here"
          placeholderTextColor="#858585"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Icon name="search" size={25} color="#858585" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({item}) => {
            const imageUrl =
              images[item._id] ||
              (item.images && item.images[0]) ||
              'https://via.placeholder.com/150';
            const progress =
              item.amount > 0
                ? ((item.raisedAmount / item.amount) * 100).toFixed(0)
                : 0;
            return (
              <TouchableOpacity
                style={styles.campaignCard}
                onPress={() =>
                  navigation.navigate('SearchViewCampaign', {
                    image:
                      images[item._id] || (item.images && item.images[0]) || '',
                    item,
                    id: item._id,
                  })
                }>
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
            );
          }}
          contentContainerStyle={styles.searchResultsContent}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Image
            source={require('../assets/SearchBg.png')}
            style={{
              width: 200,
              height: 200,
            }}
          />
          <Text style={styles.noDataText}>No campaigns found.</Text>
        </View>
      )}
    </View>
  );

  const renderDefaultContent = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{marginBottom: 50}}>
      {/* Funding Section */}
      <View style={styles.innerContainer}>
        <View style={styles.fundingCard}>
          <ImageBackground
            source={require('../assets/donation.png')}
            style={styles.fundingCardImage}
            imageStyle={{borderRadius: 10}}>
            <View style={styles.fundingCardContainer}>
              <Text style={styles.fundingTitle}>Start Your Own Funding</Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate('FundraiserDetails')}>
                <Text style={styles.startButtonText}>Start Campaign</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <Text style={styles.sectionTitle}>Category</Text>
        <Categories />
        <Text style={styles.sectionTitle}>Top Campaigns</Text>
        <TopCampaigns searchQuery={searchQuery} />
      </View>
    </ScrollView>
  );

  return (
    <>
      {renderHeader()}
      {searchQuery.trim() ? renderSearchResults() : renderDefaultContent()}
      {/* Notification Drawer Modal */}
      <Modal visible={isDrawerOpen} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.notificationDrawer}>
            <Text style={styles.drawerTitle}>Notifications</Text>
            {notifLoading ? (
              <Text>Loading...</Text>
            ) : notifications.length === 0 ? (
              <Text style={styles.noNotifications}>No new notifications</Text>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={item => item._id}
                renderItem={({item}) => (
                  <View style={styles.notificationItem}>
                    <Icon name="notifications" size={20} color="#EA7E24" />
                    <View style={styles.notificationTextContainer}>
                      <Text style={styles.notificationText}>
                        {item.event.replace('_', ' ')}
                      </Text>
                      <Text style={styles.notificationDate}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                )}
              />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsDrawerOpen(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.background},
  header: {
    backgroundColor: color.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  notificationContainer: {position: 'relative', marginRight: 20},
  badge: {
    position: 'absolute',
    top: -6,
    right: -5,
    backgroundColor: color.red,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {color: color.white, fontSize: 10, fontWeight: 'bold'},
  userImg: {
    width: 45,
    height: 45,
    borderRadius: 22,
  },
  headerText: {marginTop: 5},
  welcomeText: {
    color: color.secondary,
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 39,
    letterSpacing: -0.28,
  },
  subtitle: {
    color: color.white,
    fontSize: 20,
    marginTop: 5,
    width: 200,
    lineHeight: 30,
    letterSpacing: -0.28,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: color.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 15,
    height: 45,
  },
  searchInput: {flex: 1, fontSize: 16, color: color.grey},
  searchIcon: {padding: 10},
  innerContainer: {marginBottom: 50},
  fundingCard: {margin: 15, width: '100%'},
  fundingCardImage: {
    width: '100%',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  fundingCardContainer: {
    width: 219,
    height: 136,
    padding: 10,
    left: 30,
  },
  fundingTitle: {
    color: color.white,
    fontSize: 25,
    fontWeight: '700',
    left: 50,
    lineHeight: 37,
    letterSpacing: -0.28,
  },
  noResultsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
  },
  startButton: {
    width: '70%',
    backgroundColor: color.red,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    elevation: 5,
    left: 55,
  },
  startButtonText: {color: color.white, fontSize: 14, fontWeight: 'bold'},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.primary,
    marginLeft: 20,
    marginTop: 5,
  },
  content: {padding: 20, marginTop: 30},
  // Search Results Styles
  searchResultsContainer: {flex: 1, padding: 20},
  searchResultsContent: {paddingBottom: 50},
  campaignCard: {
    flexDirection: 'row',
    backgroundColor: color.white,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  campaignImage: {width: 120, borderRadius: 10},
  campaignDetails: {flex: 1, marginLeft: 10},
  campaignTitle: {fontSize: 14, fontWeight: 'bold', marginVertical: 5},
  progressBar: {
    height: 5,
    backgroundColor: color.progress,
    borderRadius: 5,
    marginVertical: 5,
    overflow: 'hidden',
  },
  progressFill: {height: 5, backgroundColor: color.primary},
  progressText: {
    fontSize: 12,
    textAlign: 'right',
    color: color.lightblack,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  infoLabel: {fontSize: 12, color: color.lightblack},
  infoValue: {fontSize: 12, fontWeight: '600', overflow: 'hidden'},
  infoValueDuration: {
    fontSize: 12,
    fontWeight: color.lightblack,
    width: 70,
    marginRight: 5,
    overflow: 'hidden',
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
    color: color.grey,
    marginTop: 20,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  notificationDrawer: {
    backgroundColor: color.white,
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  drawerTitle: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  notificationTextContainer: {marginLeft: 10},
  notificationText: {fontSize: 16, fontWeight: '500'},
  notificationDate: {fontSize: 12, color: color.gray},
  closeButton: {marginTop: 10, alignSelf: 'center'},
  closeButtonText: {color: color.red, fontSize: 16},
});

export default Home;
