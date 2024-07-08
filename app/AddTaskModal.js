import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const AddTaskModal = ({ visible, onClose }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false); // State for category modal

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.4:5000/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category._id); // Assuming category object has _id field
    setIsCategoryModalVisible(false); // Close category modal after selecting a category
  };

  const saveTask = async () => {
    try {
      const taskData = {
        title: taskName,
        description: taskDescription,
        category: selectedCategory,
      };
      const response = await axios.post('http://192.168.0.4:5000/tasks', taskData);
      console.log('Task saved successfully:', response.data.task);
      // Reset form state
      setTaskName('');
      setTaskDescription('');
      setSelectedCategory(null);
      onClose(); // Close modal after saving
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const renderCategoryItem = ({ item }) => {
    const isSelected = item._id === selectedCategory;
    return (
      <TouchableOpacity onPress={() => handleSelectCategory(item)} style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter Task Name"
          value={taskName}
          onChangeText={setTaskName}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter Task Description"
          multiline
          numberOfLines={4}
          value={taskDescription}
          onChangeText={setTaskDescription}
        />
        <TouchableOpacity onPress={() => setIsCategoryModalVisible(true)}>
          <Text style={styles.categoryLabel}>Select Category:</Text>
        </TouchableOpacity>
        <Modal visible={isCategoryModalVisible} animationType="slide">
          <View style={styles.categoryModalContainer}>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item._id.toString()} // Assuming _id is a unique identifier
              style={styles.categoryList}
            />
          </View>
          <Button title="Close Categories" onPress={() => setIsCategoryModalVisible(false)} />
        </Modal>
        <Button title="Save Task" onPress={saveTask} disabled={!taskName || !selectedCategory} />
        <Button title="Close" onPress={onClose} color="red" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectedCategoryItem: {
    backgroundColor: '#e6f7ff', // Example background color for selected category
  },
  categoryModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  categoryList: {
    width: '80%',
    marginTop: 20,
  },
});

export default AddTaskModal;
