import React from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import color from '../../utils/color';

const Logout = ({visible, onCancel, onConfirm, userName}) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign Out</Text>
          </View>
          <Text style={styles.userName}>{userName.toUpperCase()}</Text>
          <Text style={styles.message}>
            Are you sure you want to sign out of this account?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Keeping overlay consistent
  },
  modalContainer: {
    width: '80%',
    backgroundColor: color.background,
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    height: 255,
  },
  titleContainer: {
    marginBottom: 5,
    backgroundColor: color.primary,
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopEndRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: color.white,
  },
  userName: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: color.black,
    marginBottom: 20,
  },
  message: {
    fontSize: 14,
    color: color.grey,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 35,
    height: 45,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: color.red,
    padding: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: color.primary,
    padding: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: color.white,
    fontWeight: 'bold',
  },
  confirmText: {
    color: color.white,
    fontWeight: 'bold',
  },
});

export default Logout;
