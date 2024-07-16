import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AddTaskModal from './AddTaskModal'; // Import AddTaskModal component
import Icon from 'react-native-vector-icons/FontAwesome';
import EditTaskModal from './EditTaskModal';
import ProfileModal from './ProfileModal'; // Import ProfileModal component
import styles from './styles'; // Import styles


const HomeScreen = ({ username, setIsLoggedIn ,setUsername}) => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#ffffff');
  const [numColumns, setNumColumns] = useState(3); // Default number of columns
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false); // State for AddTaskModal visibility
  const [tasks, setTasks] = useState([]); // State to hold tasks
  const [todayTasks, setTodayTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);
const [isProfileModalVisible, setIsProfileModalVisible] = useState(false); // State for Profile Modal visibility
const [selectedColor, setSelectedColor] = useState(null);
const [userDetails, setUserDetails] = useState({});


  useEffect(() => {
    fetchCategories();
    fetchTasks(); // Fetch tasks when component mounts
    fetchUserDetails();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.4:5000/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://192.168.0.4:5000/tasks', { params: { username } });
      //const response = await axios.get('http://192.168.0.178:5000/tasks');
      setTasks(response.data.tasks);
      const todayTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    setTodayTasks(todayTasks);
    setCompletedTasks(completedTasks);
    console.log(todayTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://192.168.0.4:5000/user-details', { params: { username } });
      setUserDetails(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    setIsLoggedIn(false);
    navigation.navigate('Login');
  };

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const base64 = result.assets[0].base64;
      setNewCategoryIcon(`data:image/jpeg;base64,${base64}`);
    }
  };

  const saveCategory = async () => {
    if (!newCategoryName) {
      alert('Category name is required!');
      return;
    }
  
    try {
      const category = {
        name: newCategoryName,
        icon: newCategoryIcon,
        color: newCategoryColor,
      };
  
      await axios.post('http://192.168.0.4:5000/categories', category);
      
      // Reset values after saving
      setNewCategoryName('');
      setNewCategoryIcon(null); // Assuming null is the default state for the icon
      setNewCategoryColor(''); // Reset color to an empty string or default color
      setIsAddCategoryModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };
  

  const toggleAddTaskModal = () => {
    setIsAddTaskModalVisible(!isAddTaskModalVisible);
  };
  const handleCheckboxChange = async (taskId, isChecked) => {
    try {
      await axios.put(`http://192.168.0.4:5000/tasks/${taskId}`, { completed: isChecked });
  
      // After updating, fetch tasks again to reflect the updated status
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      {/* Row 1: Task Name */}
      <View style={styles.rowItem}>
        <TouchableOpacity onPress={() => handleCheckboxChange(item._id, !item.completed)}>
          <Icon
            name={item.completed ? 'check-square-o' : 'square-o'}
            size={24}
            color={item.completed ? '#4CAF50' : '#757575'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openEditTaskModal(item)}>
        <Text style={[styles.taskTitle, { marginLeft: 10 }]}>{item.title}</Text>
        </TouchableOpacity>

      </View>
  
      {/* Row 2: Finish by */}
      <View style={styles.rowItem}>
        <Text style={styles.label}>Finish by</Text>
        <Text style={styles.taskDetails}>{new Date(item.finishTime).toLocaleString()}</Text>
      </View>
  
      {/* Row 3: Category and Priority */}
      <View style={[styles.rowItem, styles.categoryPriorityRow]}>
      <Icon name="tag" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.taskDetails}>{item.category ? item.category.name : 'None'}</Text>
        <Image source={{ uri: item.priorityFlag.icon }} style={styles.priorityIcon} />
        <Icon name="flag" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.taskDetails}>{item.priorityFlag}</Text>
      </View>
    </View>
  );
  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setIsEditTaskModalVisible(true);
  };
  
  // Function to close the Edit Task modal
  const closeEditTaskModal = () => {
    setIsEditTaskModalVisible(false);
  };
  const toggleProfileModal = () => {
    setIsProfileModalVisible(!isProfileModalVisible);
  };


  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.indexText}>Home</Text>
        <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: userDetails.profileImage || 'https://via.placeholder.com/40' }} // Use profile image or placeholder
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      {tasks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Image source={require('../assets/images/pic4.jpg')} style={styles.centerImage} />
          <Text style={styles.centerText}> What do you want to do today?</Text>
          <Text style={styles.centerSubText}>Tap + to add your tasks</Text>
        </View>
      ) : (
        <FlatList
          data={[{ title: 'Today\'s Tasks', data: todayTasks }, { title: 'Completed Tasks', data: completedTasks }]}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <FlatList
                data={item.data}
                keyExtractor={(task) => task._id}
                renderItem={renderTaskItem}
              />
            </>
          )}
        />
      )}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/images/home.jpg')} style={styles.buttonIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => setIsModalVisible(true)}>
          <Image source={require('../assets/images/calendar.jpg')} style={styles.buttonIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.addButtonContainer]} onPress={toggleAddTaskModal}>
          <Text style={[styles.buttonText, styles.addButtonText]}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/images/settings.jpg')} style={styles.buttonIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={toggleProfileModal}>
        <Image source={require('../assets/images/profile.jpg')} style={styles.buttonIcon} />
      </TouchableOpacity>
      </View>

      {/* Category Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Category</Text>
            <View style={styles.modalTitleUnderline} />
            <FlatList
  key={numColumns} // Update key to force re-render
  data={categories}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <View style={styles.categoryItem}>
      <View style={styles.iconContainer}>
        <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
        <View style={[styles.iconOverlay, { backgroundColor: item.color }]} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </View>
  )}
  numColumns={numColumns} // Use the state for number of columns
  style={styles.categoryList}
/>

            <TouchableOpacity style={styles.addCategoryButton} onPress={() => setIsAddCategoryModalVisible(true)}>
              <Text style={styles.addCategoryButtonText}>Add New Category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Category Modal */}
      <Modal visible={isAddCategoryModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>
            {/* Category Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category Name * :</Text>
              <TextInput
                placeholder="Enter Category Name"
                placeholderTextColor="#FFFFFF"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                style={styles.input}
              />
            </View>

            {/* Icon Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category icon:</Text>
              <TouchableOpacity style={styles.imagePickerButton} onPress={openImagePicker}>
                <Text style={styles.imagePickerButtonText}>Pick Icon</Text>
              </TouchableOpacity>
              {newCategoryIcon ? <Image source={{ uri: newCategoryIcon }} style={styles.previewIcon} /> : null}
            </View>

      {/* Color Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category color:</Text>
        <View style={styles.colorPickerContainer}>
        {['#FFB6C1', '#9370DB', '#00BFFF', '#FFD700', '#FF69B4'].map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorBox,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColorBox,
              ]}
              onPress={() => {
                setNewCategoryColor(color);
                setSelectedColor(color); // Set selected color
              }}
            />
          ))}
        </View>
      </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={saveCategory}>
              <Text style={styles.saveButtonText}>Save Category</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setIsAddCategoryModalVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Task Modal */}
      <AddTaskModal visible={isAddTaskModalVisible} onClose={toggleAddTaskModal} fetchTasks={fetchTasks} username={username} />
      <EditTaskModal visible={isEditTaskModalVisible} onClose={closeEditTaskModal} task={selectedTask} fetchTasks={fetchTasks} />
      <ProfileModal
        isVisible={isProfileModalVisible}
        toggleVisibility={toggleProfileModal}
        username={username}
        setUsername={setUsername}
      />
    
    </View>
  );
};



export default HomeScreen;
