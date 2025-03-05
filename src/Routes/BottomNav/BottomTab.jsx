import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Home from '../../screens/Home';
import ProfileScreen from '../../screens/ProfileScreen';
import Search from '../../screens/Search';
import MyCampaign from '../../screens/MyCampaign';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
      }}>
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.iconContainer}>
              <Icon
                name="home"
                size={30}
                color={focused ? '#1A3F1E' : '#999'}
              />
            </View>
          ),
        }}
      />

      {/* Search Tab */}
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.iconContainer}>
              <Icon
                name="search"
                size={30}
                color={focused ? '#1A3F1E' : '#999'}
              />
            </View>
          ),
        }}
      />

      {/* Notifications Tab */}
      <Tab.Screen
        name="MyCampaign"
        component={MyCampaign}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/Charity.png')}
                style={[
                  styles.imageIcon,
                  {tintColor: focused ? '#1A3F1E' : '#999'},
                ]}
              />
            </View>
          ),
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.iconContainer}>
              <Icon
                name="person"
                size={30}
                color={focused ? '#1A3F1E' : '#999'}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    marginHorizontal: 15,
  },
  iconContainer: {
    top: 7,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  imageIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});

export default BottomTab;
