import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditTaskModal = ({ visible, onClose, task, fetchTasks }) => {
  const initialTaskState = {
    title: '',
    description: '',
    category: '',
    priorityFlag: 1,
    timeLimit: new Date(),
    finishTime: null,
  };

  const [editedTask, setEditedTask] = useState(task ? { ...initialTaskState, ...task } : initialTaskState);
  const [categories, setCategories] = useState([]);
  const [categorySelection, setCategorySelection] = useState(task?.category?._id || '');
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [prioritySelection, setPrioritySelection] = useState(task?.priorityFlag || 1);
  const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (task) {
      setEditedTask({ ...initialTaskState, ...task });
      setCategorySelection(task.category._id);
      setPrioritySelection(task.priorityFlag);
    }
  }, [task]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.4:5000/categories');
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
    setEditedTask({ ...editedTask, category: categorySelection });
    setIsCategoryModalVisible(false);
  };

  const handleSavePriority = () => {
    setEditedTask({ ...editedTask, priorityFlag: prioritySelection });
    setIsPriorityModalVisible(false);
  };

  const saveChanges = async () => {
    try {
      const taskData = {
        _id: task._id,
        title: editedTask.title,
        description: editedTask.description,
        category: editedTask.category,
        priorityFlag: editedTask.priorityFlag,
        timeLimit: editedTask.timeLimit,
        finishTime: editedTask.finishTime,
      };
      const response = await axios.put(`http://192.168.0.4:5000/tasks/${task._id}`, taskData);
      console.log('Task updated successfully:', response.data.task);
      fetchTasks();
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async () => {
    try {
      const response = await axios.delete(`http://192.168.0.4:5000/tasks/${task._id}`);
      console.log('Task deleted successfully:', response.data.message);
      fetchTasks();
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!task) {
    return null; // Render nothing if no task is passed
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>x</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <Text style={styles.labeltop}>Edit Task</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Task:</Text>
            <View style={styles.editRow}>
              {isEditingTitle ? (
                <TextInput
                  style={styles.input}
                  placeholder="Enter Task Name"
                  placeholderTextColor="#fff"
                  value={editedTask.title}
                  onChangeText={(text) => setEditedTask({ ...editedTask, title: text })}
                  onBlur={() => setIsEditingTitle(false)}
                />
              ) : (
                <>
                  <Text style={styles.value}>{editedTask.title}</Text>
                  <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                    <Icon name="pencil" size={20} color="#fff" style={styles.editIcon} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Description:</Text>
            <View style={styles.editRow}>
              {isEditingDescription ? (
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="Enter Task Description"
                  placeholderTextColor="#fff"
                  multiline
                  numberOfLines={4}
                  value={editedTask.description}
                  onChangeText={(text) => setEditedTask({ ...editedTask, description: text })}
                  onBlur={() => setIsEditingDescription(false)}
                />
              ) : (
                <>
                  <Text style={styles.value}>{editedTask.description}</Text>
                  <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
                    <Icon name="pencil" size={20} color="#fff" style={styles.editIcon} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Category:</Text>
            <TouchableOpacity onPress={() => setIsCategoryModalVisible(true)}>
              <Text style={styles.value}>
                {categories.find((cat) => cat._id === categorySelection)?.name}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Priority:</Text>
            <TouchableOpacity onPress={() => setIsPriorityModalVisible(true)}>
              <Text style={styles.value}>{prioritySelection}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
            <View style={styles.leftIcons}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.icon}>
                <Icon name="calendar" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.icon}>
                <Icon name="clock-o" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={saveChanges} style={styles.icon}>
              <Icon name="send" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={editedTask.timeLimit}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || editedTask.timeLimit;
                setShowDatePicker(false);
                setEditedTask({ ...editedTask, timeLimit: currentDate });
              }}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={editedTask.finishTime || new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setEditedTask({ ...editedTask, finishTime: selectedTime });
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
                  {categories.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() => handleSelectCategory(item)}
                      style={[styles.categoryItem, item._id === categorySelection && styles.selectedCategoryItem]}
                    >
                      <Image source={{ uri: item.icon }} style={styles.categoryIcon} resizeMode="cover" />
                      <Text style={styles.categoryText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity onPress={handleSaveCategory} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal visible={isPriorityModalVisible} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity onPress={() => setIsPriorityModalVisible(false)} style={styles.closePriorityButton}>
                  <Text style={styles.closePriorityButtonText}>X</Text>
                </TouchableOpacity>
                <FlatList
                  data={[1, 2, 3]}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectPriority(item)}
                      style={[styles.priorityItem, item === prioritySelection && styles.selectedPriorityItem]}
                    >
                      <Text style={styles.priorityText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity onPress={handleSavePriority} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={styles.iconRow}>
            <View style={styles.leftIcons}>
              <TouchableOpacity onPress={deleteTask} style={styles.deleteButton}>
                <Icon name="trash" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
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
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#d32f2f',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
  },
  labeltop: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  value: {
    fontSize: 18,
    color: '#fff',
    flex: 2,
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 5,
    padding: 10,
    flex: 2,
  },
  descriptionInput: {
    height: 80,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  editIcon: {
    marginLeft: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  leftIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
  },
  closeCategoryButton: {
    alignSelf: 'flex-end',
  },
  closeCategoryButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  closePriorityButton: {
    alignSelf: 'flex-end',
  },
  closePriorityButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  categoryList: {
    width: '100%',
    alignItems: 'center',
  },
  categoryItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCategoryItem: {
    backgroundColor: '#ffcccc',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 18,
    color: '#000',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#000',
  },
  priorityItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  selectedPriorityItem: {
    backgroundColor: '#ffcccc',
  },
  priorityText: {
    fontSize: 18,
    color: '#000',
  },
});

export default EditTaskModal;
