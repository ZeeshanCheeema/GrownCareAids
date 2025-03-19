import React, {useEffect, useState, useCallback} from 'react';
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
import Loader from './Loader';
import logo from '../assets/logo.png';
import color from '../utils/color';

const TopCampaigns = ({searchQuery = ''}) => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const {data, isLoading, error, refetch} = useGetAllCampaignsQuery();
  const dispatch = useDispatch();

  const [images, setImages] = useState({});

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
      fetchCampaignImages(data.data);
    }
  }, [data, fetchCampaignImages]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1A3F1E" />
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

  const filteredCampaigns =
    data?.data?.filter(item =>
      item?.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const renderItem = ({item}) => {
    if (!item) return null;

    const progress =
      item.amount > 0 ? (item.raisedAmount / item.amount) * 100 : 0;

    return (
      <View style={[styles.card, {width: width * 0.6}]}>
        <Image
          source={{
            uri:
              images[item._id] ||
              (item.images && item.images[0]) ||
              'https://via.placeholder.com/150',
          }}
          style={[styles.image, {height: height * 0.15}]}
        />

        <View style={styles.content}>
          <Text style={[styles.title, {fontSize: width * 0.04}]}>
            {item.title || 'No Title'}
          </Text>
          <Text style={styles.percentage}>{progress.toFixed(1)}%</Text>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, {width: `${progress}%`}]} />
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View>
            <Text style={styles.label}>
              Raised: ${item.raisedAmount?.toLocaleString() || '0'}
            </Text>
            <Text style={styles.label}>{item.category?.name || 'N/A'}</Text>
          </View>
          <View>
            <Text style={styles.label}>
              Target: ${item.amount?.toLocaleString() || '0'}
            </Text>
            <Text style={styles.label}>{item.location || 'Unknown'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, {paddingVertical: height * 0.015}]}
          onPress={() => {
            navigation.navigate('SearchViewCampaign', {
              image:
                images[item._id] ||
                (Array.isArray(item.images) && item.images.length > 0
                  ? item.images[0]
                  : require('../assets/SearchBg.png')),
              item,
              id: item._id,
            });
          }}>
          <Text style={[styles.buttonText, {fontSize: width * 0.04}]}>
            View
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={filteredCampaigns}
      horizontal
      keyExtractor={item => item?._id?.toString() || ''}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <Text style={styles.noResults}>No campaigns found</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: color.white,
    borderRadius: 12,
    shadowColor: color.black,
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
  errorContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    color: color.red,

    alignItems: 'center',
  },
  refetchButton: {
    marginTop: 15,
    backgroundColor: color.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
  },
  refetchText: {color: color.white, fontWeight: 'bold'},
  title: {
    fontWeight: '600',
    color: color.primary,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '90%',
    height: 7,
    backgroundColor: color.progress,
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: color.primary,
    borderRadius: 10,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
    color: color.primary,
    marginTop: 5,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 13,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 12,
    color: color.lightblack,
  },
  button: {
    backgroundColor: color.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    marginTop: 12,
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    color: color.white,
    fontWeight: '500',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: color.lightblack,
    marginTop: 20,
  },
});

export default TopCampaigns;
