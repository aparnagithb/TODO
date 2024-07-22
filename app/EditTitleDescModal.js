import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const EditTitleDescModal = ({ visible, onClose, task, saveChanges }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = () => {
    saveChanges(title, description);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.label}>Edit Title and Description</Text>
          <View style={styles.labelUnderline} />
          <TextInput
            style={styles.input}
            placeholder="Enter Task Name"
            placeholderTextColor="#fff"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter Task Description"
            placeholderTextColor="#fff"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalView: { width: '80%', backgroundColor: '#333', borderRadius: 20, padding: 20 },
  label: { color: '#fff', fontSize: 18, marginBottom: 10, textAlign: 'center' },
  labelUnderline: {
    borderBottomColor: '#979797',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  input: { 
    height: 40, 
    borderColor: '#979797', 
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 10, 
    color: '#fff', 
  },
  descriptionInput: { 
    height: 70, 
    borderWidth: 0, // Remove border
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', // Center buttons
    marginTop: 20,
  },
  saveButton: { 
    width:150,
    backgroundColor: '#8687E7', 
    padding: 10, 
    borderRadius: 5, 
    marginHorizontal: 18, // Add margin between buttons
  },
  cancelButton: { 
    backgroundColor: 'transparent', 
    padding: 10, 
    borderRadius: 5, 
    marginHorizontal: 38, 
  },
  saveButtonText: { textAlign:'center' ,color: '#fff' },
  cancelButtonText: { textAlign:'center',color: '#8687E7' },
});

export default EditTitleDescModal;
