import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  View,
  Dimensions,
} from 'react-native';
import {useGetCategoriesQuery} from '../services/Auth/AuthApi';

const {width, height} = Dimensions.get('window');

// Category Card Component
const CategoryCard = ({icon, title}) => (
  <TouchableOpacity style={styles.categoryCard}>
    <Image
      source={icon ? {uri: icon} : require('../assets/stethoscope.png')}
      style={styles.categoryImage}
    />
    <Text style={styles.categoryText} numberOfLines={1}>
      {title}
    </Text>
  </TouchableOpacity>
);

const Categories = () => {
  const {data, isLoading, error} = useGetCategoriesQuery();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1A3F1E" />
      </View>
    );
  }

  if (error) {
    console.log('Error fetching categories:', error);
    return <Text style={styles.error}>Failed to load categories</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryScroll}>
      {data?.data?.map(item => (
        <CategoryCard key={item._id} icon={item.logo} title={item.name} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryScroll: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
  },
  categoryCard: {
    backgroundColor: '#fff',
    width: width * 0.26, // Responsive Width
    height: height * 0.12, // Responsive Height
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    marginRight: width * 0.03,
    paddingHorizontal: width * 0.01,
    marginLeft: 6,
  },
  categoryImage: {
    width: width * 0.12,
    height: width * 0.12,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: width * 0.03,
    color: '#1A3F1E',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: height * 0.005,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.12,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: width * 0.04,
  },
});

export default Categories;
