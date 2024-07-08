import React, { useState, useRef, useEffect } from 'react';
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
  const handleBack = () => {
    if (currentSlideIndex <= 0) return;
    flatListRef.current.scrollToIndex({ index: currentSlideIndex - 1, animated: true });
  };

  const handleNext = () => {
    if (currentSlideIndex >= slides.length - 1) return;
    flatListRef.current.scrollToIndex({ index: currentSlideIndex + 1, animated: true });
  };
  useEffect(() => {
    if (currentSlideIndex === 0) {
      const timer = setTimeout(() => {
        handleNext();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentSlideIndex]);

  const renderSlide = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        {item.logo ? (
          <Image source={item.logo} style={styles.logo} resizeMode="contain" />
        ) : (
          <>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={index === slides.length - 1 ? styles.lastSlideTitle : styles.title}>{item.title}</Text>
            <Text style={index === slides.length - 1 ? styles.lastSlideSubtitle : styles.subtitle}>{item.subtitle}</Text>
          </>
        )}

        {index > 0 && index < 4 && (
          <TouchableOpacity onPress={handleSkip} style={[styles.button, styles.leftButton]}>
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
        )}
        {index > 0 && index < slides.length - 1 && (
          <TouchableOpacity onPress={handleBack} style={[styles.button, styles.leftbottomButton]}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}

{index < slides.length - 1 && index !== 0 && (
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
          <View style={styles.lastSlide}>
            <View style={styles.bottomButtonsContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={[styles.button, styles.loginButton]}
              >
                <Text style={[styles.buttonText, styles.loginText]}>         Login         </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={[styles.button, styles.registerButton]}
              >
                <Text style={[styles.buttonText, styles.registerText]}>Create Account</Text>
              </TouchableOpacity>
            </View>
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
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  image: {
    width: '50%',
    height: '35%',
    marginBottom: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 48,
    textAlign: 'center',
    color: '#fff',
  },
  lastSlideTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    position: 'absolute',
    top: 150,
    left: 20,
    right: 20,
  },
  subtitle: {
    fontSize: 22,
    textAlign: 'center',
    color: '#dddddd',
  },
  lastSlideSubtitle: {
    fontSize: 22,
    textAlign: 'center',
    color: '#fff',
    position: 'absolute',
    top: 235,
    left: 20,
    right: 20,
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#8875FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 22,
    color: '#fff',
  },
  leftbottomButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: 'transparent',
    color: '#DCDCDC',
  },
  leftButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    backgroundColor: 'transparent',
    color: '#DCDCDC',
  },
  rightButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  lastSlide: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeText: {
    fontSize: 42,
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
  },
  welcomeSubText: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
  },
  bottomButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#8875FF',
    marginTop: 20,
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
