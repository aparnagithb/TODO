import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Button, FlatList, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './editstyle'; // Import styles
import EditTitleDescModal from './EditTitleDescModal'; // Import the new modal

const EditTaskModal = ({ visible, onClose, task, fetchTasks }) => {
  const initialTaskState = {
    title: '',
    description: '',
    category: '',
    priorityFlag: 1,
    timeLimit: new Date(),
    finishTime: null,
  };

  const [editedTask, setEditedTask] = useState(initialTaskState);
  const [categories, setCategories] = useState([]);
  const [categorySelection, setCategorySelection] = useState('');
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [prioritySelection, setPrioritySelection] = useState(1);
  const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);
  const [isEditingTitleDesc, setIsEditingTitleDesc] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTasks(); // Refresh the task list

  }, []);

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...initialTaskState,
        ...task,
        timeLimit: task.timeLimit ? new Date(task.timeLimit) : new Date(),
        finishTime: task.finishTime ? new Date(task.finishTime) : null,
      });
      setCategorySelection(task.category?._id || '');
      setPrioritySelection(task.priorityFlag || 1);
      fetchTasks(); // Refresh the task list

    }
    fetchTasks(); // Refresh the task list

  }, [task]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.5.54:5000/categories');
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

  const handleSaveCategory = async () => {
    try {
      const selectedCategory = categories.find(cat => cat._id === categorySelection);
      const updatedTask = { ...editedTask, category: selectedCategory };

      await axios.put(`http://192.168.5.54:5000/tasks/${task._id}`, updatedTask);

      setEditedTask(updatedTask);
      setIsCategoryModalVisible(false);
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleSavePriority = async () => {
    try {
      const updatedTask = { ...editedTask, priorityFlag: prioritySelection };

      await axios.put(`http://192.168.5.54:5000/tasks/${task._id}`, updatedTask);

      setEditedTask(updatedTask);
      setIsPriorityModalVisible(false);
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error saving priority:', error);
    }
  };

  const saveChanges = async () => {
    if (!task) return;

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
      const response = await axios.put(`http://192.168.5.54:5000/tasks/${task._id}`, taskData);
      console.log('Task updated successfully:', response.data.task);
      fetchTasks();
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSaveTitleDesc = async (title, description) => {
    try {
      const updatedTask = { ...editedTask, title, description };

      await axios.put(`http://192.168.5.54:5000/tasks/${task._id}`, updatedTask);

      setEditedTask(updatedTask);
      setIsEditingTitleDesc(false);
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error saving title and description:', error);
    }
  };

  const handleDateUpdate = async (date) => {
    try {
      const updatedTask = { ...editedTask, timeLimit: date };

      await axios.put(`http://192.168.5.54:5000/tasks/${task._id}`, updatedTask);

      setEditedTask(updatedTask);
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error updating date:', error);
    }
  };

  const handleTimeUpdate = async (time) => {
    try {
      const updatedTask = { ...editedTask, finishTime: time };

      await axios.put(`http://192.168.5.54:5000/tasks/${task._id}`, updatedTask);

      setEditedTask(updatedTask);
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error updating time:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || editedTask.timeLimit;
    setShowDatePicker(false);
    setEditedTask((prevTask) => ({
      ...prevTask,
      timeLimit: currentDate,
    }));
    handleDateUpdate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || editedTask.finishTime;
    setShowTimePicker(false);
    setEditedTask((prevTask) => ({
      ...prevTask,
      finishTime: currentTime,
    }));
    handleTimeUpdate(currentTime);
  };

  const deleteTask = async () => {
    if (!task) return;

    try {
      const response = await axios.delete(`http://192.168.5.54:5000/tasks/${task._id}`);
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
          <Text style={[styles.value, { fontSize: 24 }]}>     {editedTask.title}</Text>
          <TouchableOpacity onPress={() => setIsEditingTitleDesc(true)}>
              <Icon name="pencil" size={20} color="#fff" style={styles.editIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>       {editedTask.description}</Text>
          </View>
          <EditTitleDescModal
            visible={isEditingTitleDesc}
            onClose={() => setIsEditingTitleDesc(false)}
            task={editedTask}
            saveChanges={handleSaveTitleDesc}
          />
<View style={[styles.row, { marginTop: 35 }]}>
            <Icon name="tag" size={30} color="#fff" />
            <Text style={styles.label}>Category:</Text>
            <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => setIsCategoryModalVisible(true)}>
              <Text style={styles.val}>
                {categories.find((cat) => cat._id === categorySelection)?.name || 'Select Category'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.row, { marginTop: 35 }]}>
            <Icon name="flag" size={30} color="#fff" />
            <Text style={styles.label}>Priority:</Text>
            <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => setIsPriorityModalVisible(true)}>
              <Text style={styles.val}>{prioritySelection}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.dateRow, { marginTop: 35 }]}>
            <Icon name="calendar" size={30} color="#fff" />
            <Text style={styles.label}>Task Date:</Text>
            <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.val}>{editedTask.timeLimit ? editedTask.timeLimit.toDateString() : 'Set Date'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={editedTask.timeLimit || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={[styles.dateRow, { marginTop: 35 }]}>
            <Icon name="clock-o" size={30} color="#fff" />
            <Text style={styles.label}>Finish Time:</Text>
            <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.val}>{editedTask.finishTime ? editedTask.finishTime.toLocaleTimeString() : 'Set Time'}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={editedTask.finishTime || new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
          <Modal visible={isCategoryModalVisible} animationType="slide" transparent={true}>
  <View style={styles.centeredView}>
    <View style={styles.categoryModalView}>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity 
            key={item._id} 
            onPress={() => handleSelectCategory(item)} 
            style={styles.categoryItemContainer}
          >
            <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
            <Text style={styles.categoryItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        numColumns={3} // Display 3 items per row
        contentContainerStyle={styles.categoryGrid}
      />
      <View style={styles.categoryButtonContainer}>
  <TouchableOpacity style={styles.categoryButton} onPress={handleSaveCategory}>
    <Text style={styles.categoryButtonText}>Save</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.cancelButton} onPress={() => setIsCategoryModalVisible(false)}>
    <Text style={styles.ct}>Cancel</Text>
  </TouchableOpacity>
</View>

    </View>
  </View>
</Modal>
<Modal visible={isPriorityModalVisible} animationType="slide" transparent={true}>
  <View style={styles.centeredView}>
    <View style={styles.categoryModalView}>
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        renderItem={({ item: priority }) => (
          <TouchableOpacity 
            key={priority} 
            onPress={() => handleSelectPriority(priority)} 
            style={styles.categoryItemContainer}
          >
    <Icon name="flag" size={30} color="white" />
    <Text style={styles.categoryItemText}>{priority}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.toString()}
        numColumns={3} // Display 3 items per row
        contentContainerStyle={styles.categoryGrid}
      />
      <View style={styles.categoryButtonContainer}>
        <TouchableOpacity style={styles.categoryButton} onPress={handleSavePriority}>
          <Text style={styles.categoryButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsPriorityModalVisible(false)}>
          <Text style={styles.ct}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    
          <View style={styles.deleteIconRow}>

  <TouchableOpacity onPress={deleteTask} style={styles.deleteIcon}>
    <Icon name="trash" size={30} color="red" />
  </TouchableOpacity>
  <Text style={styles.deleteText}>Delete</Text>

</View>
        </View>
      </View>
    </Modal>
  );
};





export default EditTaskModal;
