import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './app/Welcome';
import LoginScreen from './app/LoginScreen';
import RegisterScreen from './app/RegisterScreen';
import HomeScreen from './app/HomeScreen';

const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isFirstTimeLoad, setIsFirstTimeLoad] = useState(false);

  const slides = [
    {
      key: 1,
      logo: require('./assets/images/logo.jpg'), // Replace with your logo image path
    },
    {
      key: 2,
      title: 'Manage your tasks',
      subtitle: 'You can easily manage all of your daily tasks in DoMe for free',
      image: require('./assets/images/pic1.jpg'), // Replace with your image1 path
    },
    {
      key: 3,
      title: 'Create daily routine',
      subtitle: 'In Uptodo you can create your personalized routine to stay productive',
      image: require('./assets/images/pic2.jpg'), // Replace with your image2 path
    },
    {
      key: 4,
      title: 'Organize your tasks',
      subtitle: 'You can organize your daily tasks by adding your tasks into separate categories',
      image: require('./assets/images/pic3.jpg'), // Replace with your image3 path
    },
    {
      key: 5,
      title: 'Welcome to our app!',
      subtitle: 'Enjoy using our app!',
      backgroundColor: '#000000', // Black background
    },
  ];

  const checkForFirstTimeLoaded = async () => {
    // Uncomment the line below to clear the value in AsyncStorage for development purposes
     await AsyncStorage.removeItem('isFirstTimeOpen');

    const result = await AsyncStorage.getItem('isFirstTimeOpen');
    if (result === null) {
      setIsFirstTimeLoad(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkForFirstTimeLoaded();
  }, []);

  const handleDone = () => {
    setIsFirstTimeLoad(false);
    AsyncStorage.setItem('isFirstTimeOpen', 'no');
  };

  if (loading) return null;

  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstTimeLoad ? (
          <Stack.Screen name="Welcome">
            {(props) => <Welcome {...props} slides={slides} onDone={handleDone} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
