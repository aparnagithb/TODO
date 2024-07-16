import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const ChangePasswordModal = ({ isVisible, toggleVisibility, username }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = async () => {
    try {
      const response = await axios.post('http://192.168.0.4:5000/update-password', { username, oldPassword, newPassword });
      toggleVisibility(); // Close the modal
      Alert.alert('Success', 'Password updated successfully');
    } catch (error) {
      console.error('Failed to update password:', error);
      Alert.alert('Error', 'Failed to update password');
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change Password</Text>
          <TextInput
            style={styles.input}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Enter old password"
            placeholderTextColor="#979797" // Set placeholder text color
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#979797" // Set placeholder text color
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleVisibility}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Edit</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 25,
    color: '#fff',

  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#fff',

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop:30,

  },
  saveButton: {
    backgroundColor: '#8687E7',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,

  },
  closeButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#8687E7',
    fontWeight: 'bold',
    fontSize: 15,

  },
});

export default ChangePasswordModal;
