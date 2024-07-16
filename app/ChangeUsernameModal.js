import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const ChangeUsernameModal = ({ isVisible, toggleVisibility, currentUsername, onUpdate }) => {
  const [newUsername, setNewUsername] = useState('');

  const handleSave = async () => {
    try {
      const response = await axios.post('http://192.168.0.4:5000/update-username', { oldUsername: currentUsername, newUsername });
      onUpdate(newUsername); // Notify parent component
      toggleVisibility(); // Close the modal
      Alert.alert('Success', 'Username updated successfully');
    } catch (error) {
      console.error('Failed to update username:', error);
      Alert.alert('Error', 'Failed to update username');
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change Username</Text>
          <TextInput
            style={styles.input}
            value={newUsername}
            onChangeText={setNewUsername}
            placeholder={`Current: ${currentUsername}`}
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
    marginBottom: 10,
    color: '#fff',
    marginBottom:30,


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

export default ChangeUsernameModal;
