import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Welcome = ({ slides = [], onDone }) => {
  if (!slides || !slides.length) return null;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef();
  const navigation = useNavigation();

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentSlideIndex(index);
    }
  });

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleSkip = () => {
    flatListRef.current.scrollToEnd({ animated: true });
  };

  const handleGetStarted = () => {
    flatListRef.current.scrollToIndex({ index: slides.length - 1, animated: true });
  };

  const handleNext = () => {
    if (currentSlideIndex >= slides.length - 1) return;
    flatListRef.current.scrollToIndex({ index: currentSlideIndex + 1, animated: true });
  };

  const renderSlide = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        {item.logo ? (
          <Image source={item.logo} style={styles.logo} resizeMode="contain" />
        ) : (
          <>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </>
        )}

        {index > 0 && index < 4 && (
          <TouchableOpacity onPress={handleSkip} style={[styles.button, styles.leftButton]}>
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
        )}

        {index < slides.length - 1 && (
          <TouchableOpacity onPress={handleNext} style={[styles.button, styles.rightButton]}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}

        {index === slides.length - 2 && (
          <TouchableOpacity onPress={handleGetStarted} style={[styles.button, styles.rightButton]}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}

        {index === slides.length - 1 && (
          <View style={styles.bottomButtonsContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={[styles.button, styles.loginButton]}
            >
              <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={[styles.button, styles.registerButton]}
            >
              <Text style={[styles.buttonText, styles.registerText]}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      data={slides}
      keyExtractor={(item) => item.key.toString()}
      renderItem={renderSlide}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewConfig.current}
    />
  );
};

const { width } = Dimensions.get('screen');

const styles = StyleSheet.create({
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000000',
  },
  logo: {
    width: 470,
    height: 470,
    marginBottom: 20,
  },
  image: {
    width: '50%',
    height: '35%',
    marginBottom: 20,
  },
  title: {
    fontSize: 84,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 42,
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    backgroundColor: '#8875FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 64,
    color: '#fff',
  },
  leftButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
  },
  rightButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  bottomButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    width: '100%',
  },
  welcomeText: {
    fontSize: 42,
    color: '#fff',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#8875FF',
  },
  loginText: {
    backgroundColor: '#8875FF',
  },
  registerButton: {
    marginTop: 10,
    borderColor: '#8875FF',
    borderWidth: 1,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  registerText: {
    color: '#fff',
  },
});

export default Welcome;
