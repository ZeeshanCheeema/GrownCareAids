import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ReportModel = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  const reportReasons = [
    'Identity fraud',
    'Undesirable or harmful',
    'Publication of inappropriate contents',
    'Harassment or bullying',
    'Other',
  ];

  return (
    <View style={styles.container}>
      {/* Modal for Reporting */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report the user</Text>
            {/* Close Modal */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <AntDesign name="closecircle" size={22} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalSubtitle}>
              Please help us and select a reason to understand what is going on.
            </Text>

            {/* Checkbox List */}
            {reportReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.checkboxRow}
                onPress={() => setSelectedReason(reason)}>
                <Text style={styles.reasonText}>{reason}</Text>
                <View style={styles.radioCircle}>
                  {selectedReason === reason && (
                    <View style={styles.selectedDot} />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                alert(`Reported: ${selectedReason}`);
                setModalVisible(false);
              }}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  iconButton: {position: 'absolute', top: 10, right: 10, padding: 10},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  modalSubtitle: {fontSize: 14, color: '#555', marginBottom: 15},
  checkboxRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 8},
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1A3F1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1A3F1E',
  },
  reasonText: {marginLeft: 10, fontSize: 14},
  submitButton: {
    marginTop: 20,
    backgroundColor: '#1A3F1E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  closeButton: {position: 'absolute', top: 10, right: 10},
});

export default ReportModel;
