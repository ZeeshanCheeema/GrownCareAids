import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import color from '../../utils/color';

const SettingsScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={25} color="#1a3c20" />
      </TouchableOpacity>

      <Text style={styles.header}>Settings</Text>

      <TouchableOpacity style={styles.item}>
        <Icon name="settings" size={25} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Version 0.2.1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('FAQ')}>
        <Icon name="help-outline" size={25} color="black" style={styles.icon} />
        <Text style={styles.itemText}>FAQ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('NewPassword')}>
        <Icon name="lock-outline" size={25} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, styles.deleteItem]}>
        <Icon name="delete" size={25} color="red" style={styles.icon} />
        <Text style={[styles.itemText, styles.deleteText]}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 10,
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: color.black,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    elevation: 6,
    height: 53,
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 14,
    color: color.lightblack,
    fontWeight: '600',
  },
  deleteItem: {
    backgroundColor: color.white,
  },
  deleteText: {
    color: color.black,
  },
});

export default SettingsScreen;
