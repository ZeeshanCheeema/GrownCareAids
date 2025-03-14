import React from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';

const DeleteAccount = ({visible, onCancel, onConfirm, userName}) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Delete Account</Text>
          </View>
          <Text style={styles.userName}>{userName.toUpperCase()}</Text>
          <Text style={styles.message}>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Delete</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    height: 255,
  },
  titleContainer: {
    marginBottom: 5,
    backgroundColor: '#B22222',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopEndRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  userName: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  message: {
    fontSize: 14,
    color: '#858585',
    textAlign: 'center',
    paddingHorizontal: 15,
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
    backgroundColor: '#EA7E24',
    padding: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#B22222',
    padding: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DeleteAccount;
