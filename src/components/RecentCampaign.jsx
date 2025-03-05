import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useGetRecentCampaignsQuery} from '../services/Auth/AuthApi';

const {width} = Dimensions.get('window');

const RecentCampaign = () => {
  const navigation = useNavigation();
  const {data, isLoading, error} = useGetRecentCampaignsQuery();
  console.log(data);
  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#1A3F1E" style={styles.loader} />
    );
  }

  if (error) {
    return <Text style={styles.error}>Failed to load campaigns</Text>;
  }

  const renderItem = ({item}) => {
    const progress = item?.target > 0 ? (item?.raised / item?.target) * 100 : 0;

    const imageUrl = item?.images?.[0] || '';
    const title = item?.title || 'No Title';
    const raisedAmount = item?.raisedAmount || 0;
    const targetAmount = item?.amount || 0;
    const category = item?.category?.name || 'N/A';
    const location = item?.location || 'Unknown';

    return (
      <>
        <Text style={styles.sectionTitle}>Recent Campaigns</Text>
        <View style={styles.card}>
          {imageUrl ? (
            <Image source={{uri: imageUrl}} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, {width: `${progress}%`}]} />
            </View>
            <Text style={styles.percentage}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.detailsRow}>
            <View>
              <Text style={styles.label}>Raised</Text>
              <Text style={styles.value}>${raisedAmount.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.label}>Target</Text>
              <Text style={styles.value}>${targetAmount.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.location}>{location}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CampaignScreen', {...item})}>
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <FlatList
      data={data?.data || []}
      horizontal
      keyExtractor={item => item?._id?.toString() || Math.random().toString()}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: 10, paddingVertical: 10}}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width * 0.6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 10,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#555',
  },
  content: {
    marginTop: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A3F1E',
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '90%',
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginTop: 5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1A3F1E',
    borderRadius: 10,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A3F1E',
    textAlign: 'right',
    marginTop: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingLeft: 10,
  },
  label: {
    fontSize: 12,
    color: '#555',
    paddingRight: 20,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A3F1E',
    paddingRight: 10,
  },
  category: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  location: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
    paddingRight: 10,
  },
  button: {
    backgroundColor: '#1A3F1E',
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RecentCampaign;
