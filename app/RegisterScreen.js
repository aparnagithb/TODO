import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    try {
      if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
        throw new Error('Please fill in all fields');
      }

      // Example: Check if password is at least 8 characters long
      if (password.length < 4) {
        throw new Error('Password must be at least 8 characters long');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await fetch('http://192.168.0.4:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const data = await response.json();
      console.log('User registered:', data);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>&lt;</Text>
      </TouchableOpacity>
      <Text style={styles.loginText}>Register</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Enter Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="● ● ● ● ● ● ● ● "
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, styles.passwordInput]}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          placeholder="● ● ● ● ● ● ● ● "
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={[styles.input, styles.passwordInput]}
          placeholderTextColor="#888"
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Click <Text style={{ color: '#fff' }}>here</Text> to login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    fontSize: 20,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999,
  },
  loginText: {
    marginLeft: 25,
    fontSize: 40,
    color: '#fff',
    marginBottom: 70,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    marginLeft: 25,
    fontSize: 20,
    color: 'white',
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 15,
    color: '#fff',
  },
  input: {
    marginLeft: 25,
    borderRadius: 5,
    fontSize: 20,
    height: 55,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    color: '#fff',
    width: '90%', // Stretch to full width
  },
  passwordInput: {
    fontSize: 13, // Adjust the font size for password dots
  },
  loginButton: {
    height: 55,
    fontSize: 20,
    backgroundColor: '#8875FF',
    paddingVertical: 12,
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 5,
    marginTop: 60,
    marginLeft: 30,
    width: '90%', // Stretch to full width
  },
  buttonText: {
    color: '#dddddd',
    fontSize: 20,
  },
  link: {
    fontSize: 15,
    color: '#dddddd',
    marginTop: 70,
    textAlign: 'center',
  },
});

export default RegisterScreen;
