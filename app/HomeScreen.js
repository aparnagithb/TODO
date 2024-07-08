import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AddTaskModal from './AddTaskModal'; // Import AddTaskModal component

const HomeScreen = ({ username, setIsLoggedIn }) => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#ffffff');
  const [numColumns, setNumColumns] = useState(3); // Default number of columns
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false); // State for AddTaskModal visibility

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.4:5000/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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
  
    console.log('Image Picker Result:', result); // Debugging line
  
    if (!result.canceled) {
      setNewCategoryIcon(`data:image/jpeg;base64,${result.base64}`);
      //setIsAddCategoryModalVisible(true); // Optionally, automatically show the modal after selecting an image

    }
     else {
      console.error('Image picking was canceled');
    }
  };
  
  const saveCategory = async () => {
    try {
      const category = {
        name: newCategoryName,
        icon: newCategoryIcon,
        color: newCategoryColor,
      };
      console.log('Saving Category:', category); // Debugging line
      await axios.post('http://192.168.0.4:5000/categories', category);
      setIsAddCategoryModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  // Function to toggle AddTaskModal visibility
  const toggleAddTaskModal = () => {
    setIsAddTaskModalVisible(!isAddTaskModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.indexText}>Home</Text>
        <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }} // Replace with your profile icon
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.centerContainer}>
        <Image source={require('../assets/images/pic4.jpg')} style={styles.centerImage} />
        <Text style={styles.centerText}> What do you want to do today?</Text>
        <Text style={styles.centerSubText}>Tap + to add your tasks</Text>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/images/home.jpg')} style={styles.buttonIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => setIsModalVisible(true) }>
          <Image source={require('../assets/images/calendar.jpg')} style={styles.buttonIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.addButtonContainer]} onPress={toggleAddTaskModal}>
          <Text style={[styles.buttonText, styles.addButtonText]}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/images/settings.jpg')} style={styles.buttonIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
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
                  <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
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
              <Text style={styles.closeButtonText}>Close</Text>
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
        <Text style={styles.label}>Category Name :</Text>
        <TextInput
          placeholder="Enter Category Name"
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

      {/* Color Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category color:</Text>
        <TextInput
          placeholder="Enter Category Color"
          value={newCategoryColor}
          onChangeText={setNewCategoryColor}
          style={styles.input}
        />
      </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveCategory}>
              <Text style={styles.saveButtonText}>Save Category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButtonBottom} onPress={() => setIsAddCategoryModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Task Modal */}
      <AddTaskModal visible={isAddTaskModalVisible} onClose={toggleAddTaskModal} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  indexText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  profileIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 45,
  },
  centerImage: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },
  centerText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  centerSubText: {
    fontSize: 16,
    color: '#888',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 25,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonIcon: {
    width: 30,
    height: 30,
    backgroundColor: 'black', // Ensure transparency is respected
  },
  addButtonContainer: {
    position: 'absolute',
    top: -15, // Adjust to position the button above the navbar line
    backgroundColor: '#8875FF', // Circle background color
    left: 172,
    borderRadius: 100,
    width: 75, // Circle diameter
    height: 75, // Circle diameter
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensure it appears above other elements
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#979797',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign:'center',
    color: '#fff',
  },
  modalTitleUnderline: {
    borderBottomWidth: 1,
    marginBottom: 10,
    borderBottomColor: '#fff', // Change the underline color to white



  },
  input: {
    borderWidth: 1,
    color:'#fff',
    borderColor: '#fff',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  imagePickerButton: {
    backgroundColor: '#808080',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width:'50%',
  },
  imagePickerButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#8687E7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute', // Position absolute to move it within the modal content
    top: 10, // Adjust as needed
    right: 10, // Adjust as needed
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButtonBottom: {
    position: 'absolute', // Position absolute to move it within the modal content
    top: 10, // Adjust as needed to position at the bottom
    right: 10, // Adjust as needed
    padding: 10,
    borderRadius: 5,
  },

  addCategoryButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#8687E7',
  }
 ,
  addCategoryButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  categoryList: {
    flexGrow: 0, // To ensure the FlatList does not grow infinitely
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    width: '30%', // Adjust based on the number of columns
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  categoryName: {
    marginTop: 5,
    textAlign: 'center',
    color: '#fff',

  },
  previewIcon: {
    width: 50,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
});

export default HomeScreen;
