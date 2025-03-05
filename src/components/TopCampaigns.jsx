import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useGetAllCampaignsQuery, apiSlice} from '../services/Auth/AuthApi';
import {useDispatch} from 'react-redux';

const TopCampaigns = ({searchQuery}) => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const {data, isLoading, error} = useGetAllCampaignsQuery();
  const [images, setImages] = useState({});
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (data?.data) {
      console.log('Fetched Campaign Data:', data.data);
      fetchCampaignImages(data.data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#1A3F1E" style={styles.loader} />
    );
  }

  if (error) {
    return <Text style={styles.error}>Failed to load campaigns</Text>;
  }

  const filteredCampaigns = data?.data?.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({item}) => {
    if (!item) return null;

    const progress =
      item.amount > 0 ? (item.raisedAmount / item.amount) * 100 : 0;
    const imageUrl = images[item._id] || 'https://via.placeholder.com/150'; // Fallback image

    return (
      <View style={[styles.card, {width: width * 0.6}]}>
        <Image
          source={{uri: imageUrl}}
          style={[styles.image, {height: height * 0.15}]}
        />
        <View style={styles.content}>
          <Text style={[styles.title, {fontSize: width * 0.04}]}>
            {item.title || 'No Title'}
          </Text>
          <Text style={styles.percentage}>{progress}%</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFill(progress)} />
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View>
            <Text style={styles.label}>
              Raised :${item.raisedAmount?.toLocaleString() || '0'}
            </Text>
            <Text style={styles.label}>{item.category.name}</Text>
          </View>
          <View>
            <Text style={styles.label}>
              Target:${item.amount?.toLocaleString() || '0'}
            </Text>
            <Text style={styles.label}>{item.location}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, {paddingVertical: height * 0.015}]}
          onPress={() =>
            navigation.navigate('SearchViewCampaign', {
              item,
              image: imageUrl,
              id: item._id,
            })
          }>
          <Text style={[styles.buttonText, {fontSize: width * 0.04}]}>
            View
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={filteredCampaigns || []}
      horizontal
      keyExtractor={item => item?._id?.toString() || ''}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.02,
      }}
      ListEmptyComponent={
        <Text style={styles.noResults}>No campaigns found</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    marginHorizontal: 12,
    paddingBottom: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontWeight: '600',
    color: '#1A3F1E',
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 7,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden', // Ensures the fill stays within bounds
  },
  progressBarFill: progress => ({
    width: `${progress}%`, // Dynamic width
    height: '100%',
    backgroundColor: '#1A3F1E',
    borderRadius: 10,
  }),
  percentage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A3F1E',
    marginTop: 5,
    alignSelf: 'flex-end', // Proper alignment
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 12,
    color: '#777',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A3F1E',
  },
  button: {
    backgroundColor: '#1A3F1E',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 12,
    width: 140,
    height: 40,
    left: 35,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
});

export default TopCampaigns;
