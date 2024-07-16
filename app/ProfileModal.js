import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import ChangeUsernameModal from './ChangeUsernameModal';
import ChangePasswordModal from './ChangePasswordModal';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileModal = ({ isVisible, toggleVisibility, username, setUsername }) => {
  const [userDetails, setUserDetails] = useState({});
  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isChangeUsernameModalVisible, setIsChangeUsernameModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://192.168.0.4:5000/user-details', { params: { username } });
      setUserDetails(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://192.168.0.4:5000/tasks', { params: { username } });
      setTasks(response.data.tasks);
      const todayTasks = response.data.tasks.filter(task => !task.completed);
      const completedTasks = response.data.tasks.filter(task => task.completed);
      setTodayTasks(todayTasks);
      setCompletedTasks(completedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchUserDetails();
      fetchTasks();
    }
  }, [isVisible, username]);

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
      const profileImage = `data:image/jpeg;base64,${base64}`;
      updateProfileImage(profileImage);
    }
  };

  const updateProfileImage = async (profileImage) => {
    try {
      const response = await axios.post('http://192.168.0.4:5000/update-profile-image', { username, profileImage });
      setUserDetails(response.data.user);
      Alert.alert('Success', 'Profile image updated successfully');
    } catch (error) {
      console.error('Failed to update profile image:', error);
      Alert.alert('Error', 'Failed to update profile image');
    }
  };

  const toggleChangeUsernameModal = () => {
    setIsChangeUsernameModalVisible(!isChangeUsernameModalVisible);
  };

  const toggleChangePasswordModal = () => {
    setIsChangePasswordModalVisible(!isChangePasswordModalVisible);
  };

  const handleUsernameUpdate = (newUsername) => {
    setUserDetails({ ...userDetails, username: newUsername });
    setUsername(newUsername); // Update the main username state
  };

  return (
    <>
      <Modal visible={isVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleVisibility}>
            <Text style={styles.closeButtonText}>x</Text>
          </TouchableOpacity>
            <Text style={styles.modalTitle}>Profile</Text>
            <View style={styles.profileContainer}>
              <Image source={{ uri: userDetails.profileImage || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
              <Text style={styles.username}>{userDetails.username || username}</Text>
              <View style={styles.tasksContainer}>
                <Text style={styles.taskInfo}>{completedTasks.length} Task done</Text>
                <Text style={styles.taskInfo}>{todayTasks.length} Task left</Text>
              </View>
            </View>
            <Text style={{ textAlign: 'left', width: '100%' , marginLeft:4,marginBottom:10,color :'white',}}>Account</Text>

            <TouchableOpacity style={styles.button} onPress={toggleChangeUsernameModal}>
  <View style={styles.buttonContent}>
    <Icon name="user" size={20} color="white" style={styles.icon} />
    <Text style={styles.buttonText}>Change Username</Text>
    <Icon name="chevron-right" size={20} color="white" style={styles.arrow} />
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.button} onPress={toggleChangePasswordModal}>
  <View style={styles.buttonContent}>
    <Icon name="lock" size={20} color="white" style={styles.icon} />
    <Text style={styles.buttonText}>Change Password</Text>
    <Icon name="chevron-right" size={20} color="white" style={styles.arrow} />
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.button} onPress={openImagePicker}>
  <View style={styles.buttonContent}>
    <Icon name="image" size={20} color="white" style={styles.icon} />
    <Text style={styles.buttonText}>Change Profile Image</Text>
    <Icon name="chevron-right" size={20} color="white" style={styles.arrow} />
  </View>
</TouchableOpacity>
<Text style={{ textAlign: 'left', width: '100%' , marginLeft:4,marginBottom:10,color :'white',}}>UpTodo</Text>

<TouchableOpacity style={styles.button} onPress={() => { /* Handle About Us */ }}>
    <View style={styles.buttonContent}>
      <Icon name="info" size={20} color="white" style={styles.icon} />
      <Text style={styles.buttonText}>About Us</Text>
      <Icon name="chevron-right" size={20} color="white" style={styles.arrow} />
    </View>
  </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={() => { /* Handle FAQ */ }}>
    <View style={styles.buttonContent}>
      <Icon name="question-circle" size={20} color="white" style={styles.icon} />
      <Text style={styles.buttonText}>FAQ</Text>
      <Icon name="chevron-right" size={20} color="white" style={styles.arrow} />
    </View>
  </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={() => { /* Handle Help & Feedback */ }}>
    <View style={styles.buttonContent}>
      <Icon name="comments" size={20} color="white" style={styles.icon} />
      <Text style={styles.buttonText}>Help & Feedback</Text>
      <Icon name="chevron-right" size={20} color="white" style={styles.arrow} />
    </View>
  </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={() => { /* Handle Support Us */ }}>
    <View style={styles.buttonContent}>
    <Icon name="thumbs-up" size={20} color="white" style={styles.icon} />
    <Text style={styles.buttonText}>Support Us</Text>
      <Icon name="chevron-right" size={20} color="white" style={styles.arrow} />
    </View>
  </TouchableOpacity>
  <TouchableOpacity style={styles.button} onPress={() => { /* logout */ }}>
    <View style={styles.buttonContent}>
    <Icon name="sign-out" size={20} color="red" style={styles.icon} />
    <Text style={styles.LogoutText}>Logout</Text>
    </View>
  </TouchableOpacity>

            
          </View>
        </View>
      </Modal>
      <ChangeUsernameModal
        isVisible={isChangeUsernameModalVisible}
        toggleVisibility={toggleChangeUsernameModal}
        currentUsername={username}
        onUpdate={handleUsernameUpdate}
      />
      <ChangePasswordModal
        isVisible={isChangePasswordModalVisible}
        toggleVisibility={toggleChangePasswordModal}
        username={username}
      />
    </>
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
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '100%', // Full height
color :'white',
    alignItems: 'center',
  },
  modalTitle: {
    color :'white',

    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 75,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color :'white',

  },
  tasksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  taskInfo: {
    fontSize: 20,
    color :'white',
    backgroundColor:'#333',
    padding:16,
    borderRadius:4,
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    fontSize: 15,

  },
  LogoutText:{
    color: 'red',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    fontSize: 15,
  },
  arrow: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProfileModal;
