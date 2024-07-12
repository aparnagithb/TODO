import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';


const AddTaskModal = ({ visible, onClose,fetchTasks,username }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySelection, setCategorySelection] = useState(null);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [priorityFlag, setPriorityFlag] = useState(null);
  const [prioritySelection, setPrioritySelection] = useState(null);
  const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);
  const [timeLimit, setTimeLimit] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [finishTime, setFinishTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.178:5000/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSelectCategory = (category) => {
    setCategorySelection(category._id);
  };

  const handleSelectPriority = (priority) => {
    setPrioritySelection(priority);
  };

  const handleSaveCategory = () => {
    setSelectedCategory(categorySelection);
    setIsCategoryModalVisible(false);
  };

  const handleSavePriority = () => {
    setPriorityFlag(prioritySelection);
    setIsPriorityModalVisible(false);
  };

  const saveTask = async () => {
    try {
      const taskData = {
        title: taskName,
        description: taskDescription,
        category: selectedCategory,
        priorityFlag,
        timeLimit,
        finishTime,
        username // Include username here


      };
      const response = await axios.post('http://192.168.0.178:5000/tasks', taskData);
      console.log('Task saved successfully:', response.data.task);
      setTaskName('');
      setTaskDescription('');
      setSelectedCategory(null);
      setPriorityFlag(null);
      setTimeLimit(new Date());
      setFinishTime(new Date());
      fetchTasks(); // Refresh tasks after saving

      onClose();

    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const renderCategoryItem = ({ item }) => {
    const isSelected = item._id === categorySelection;
    return (
      <TouchableOpacity key={item._id} onPress={() => handleSelectCategory(item)} style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}>
        <Image
          source={{ uri: item.icon }}
          style={styles.categoryIcon}
          resizeMode="cover"
        />
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  
  const renderPriorityItem = ({ item }) => {
    const isSelected = item === prioritySelection;
    return (
      <TouchableOpacity
        key={item}
        onPress={() => handleSelectPriority(item)}
        style={[styles.priorityItem, isSelected && styles.selectedPriorityItem]}
      >
                <Icon name="flag" size={20} color="#fff" />

        <Text style={styles.priorityText}>{item}</Text>
      </TouchableOpacity>
    );
  };
  

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Add Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Task Name"
            placeholderTextColor="#fff"
            value={taskName}
            onChangeText={setTaskName}
          />
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter Task Description"
            placeholderTextColor="#fff"
            multiline
            numberOfLines={4}
            value={taskDescription}
            onChangeText={setTaskDescription}
          />
          <View style={styles.iconRow}>
            <View style={styles.leftIcons}>
              <TouchableOpacity onPress={() => setIsCategoryModalVisible(true)} style={styles.icon}>
              <Icon name="tag" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsPriorityModalVisible(true)} style={styles.icon}>
              <Icon name="flag" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.icon}>
              <Icon name="calendar" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.icon}>
                <Icon name="clock-o" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={saveTask} style={styles.icon}>
            <Icon name="send" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={timeLimit}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || timeLimit;
                setShowDatePicker(false);
                setTimeLimit(currentDate);
              }}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={finishTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setFinishTime(selectedTime);
                }
              }}
            />
          )}
          <Modal visible={isCategoryModalVisible} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)} style={styles.closeCategoryButton}>
                  <Text style={styles.closeCategoryButtonText}>X</Text>
                </TouchableOpacity>
                <ScrollView contentContainerStyle={styles.categoryList}>
                  {categories.map((item) => renderCategoryItem({ item }))}
                </ScrollView>
                <TouchableOpacity onPress={handleSaveCategory} style={styles.saveCategoryButton}>
                  <Text style={styles.saveCategoryButtonText}>Save Category</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal visible={isPriorityModalVisible} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <FlatList
                  data={Array.from({ length: 10 }, (_, i) => i + 1)}
                  renderItem={renderPriorityItem}
                  keyExtractor={(item) => item.toString()}
                  contentContainerStyle={styles.priorityList}
                  numColumns={3} // Display 3 columns in the grid
                />
                <TouchableOpacity onPress={handleSavePriority} style={styles.saveCategoryButton}>
                  <Text style={styles.saveCategoryButtonText}>Save Priority</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsPriorityModalVisible(false)} style={styles.closeCategoryButton}>
                  <Text style={styles.saveCategoryButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: '80%',
    maxWidth: '80%',
  },
  label: {
    color: '#fff',

    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#333',
  },
  descriptionInput: {
    borderWidth: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  leftIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 15,
  },
  iconText: {
    color: '#fff',
    fontSize: 16,
  },
  categoryItem: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedCategoryItem: {
    backgroundColor: '#e6f7ff',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  categoryText: {
    color: '#fff',
    textAlign: 'center',
  },
  priorityItem: {
    padding: 10,
  },
  selectedPriorityItem: {
    backgroundColor: '#979797',
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  saveCategoryButton: {
    width: '90%',
    padding: 15,
    backgroundColor: '#8687E7',
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  saveCategoryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeCategoryButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeCategoryButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  priorityList: {
    flexGrow: 1,
    justifyContent: 'space-around',
    flexDirection: 'column',
    marginTop: 20,
    maxHeight:300,
  }, 
  priorityText:{
    color:'#fff',
  },
});

export default AddTaskModal;
