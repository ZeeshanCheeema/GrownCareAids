import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import color from '../utils/color';

const {width, height} = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Connect',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    image: img1,
  },
  {
    key: '2',
    title: 'Donate',
    text: 'Help others by donating items and making an impact.',
    image: img2,
  },
  {
    key: '3',
    title: 'Campaign',
    text: 'Start and support campaigns to create change.',
    image: img3,
  },
];

const Slide = ({item}) => (
  <View style={styles.slide}>
    <Image source={item.image} style={styles.image} />
  </View>
);

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  const handleNext = () => {
    if (activeIndex === slides.length - 1) {
      navigation.replace('Login');
    } else {
      sliderRef.current?.goToSlide(activeIndex + 1, true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppIntroSlider
        ref={sliderRef}
        renderItem={({item}) => <Slide item={item} />}
        data={slides}
        onSlideChange={setActiveIndex}
        onDone={() => navigation.replace('Login')}
        showSkipButton={false}
        renderPagination={() => (
          <View style={styles.bottomContainer}>
            <Text style={styles.title}>{slides[activeIndex].title}</Text>
            <Text style={styles.text}>{slides[activeIndex].text}</Text>

            <View style={styles.paginationDots}>
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, activeIndex === i && styles.activeDot]}
                />
              ))}
            </View>

            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>
                {activeIndex === slides.length - 1
                  ? 'Continue To Login'
                  : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
  },
  slide: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.white,
  },
  image: {
    width: width * 0.9,
    height: height * 0.45,
    resizeMode: 'contain',
    backgroundColor: color.white,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: height * 0.12,
    width: '100%',
    backgroundColor: color.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.35,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    marginVertical: 10,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: '700',
    color: color.primary,
    marginBottom: height * 0.01,
  },
  text: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: color.grey,
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.05,
    fontWeight: '400',
    lineHeight: width * 0.05,
    letterSpacing: -0.28,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.02,
  },
  dot: {
    width: width * 0.035,
    height: width * 0.035,
    borderRadius: width * 0.0175,
    backgroundColor: color.aqua,
    marginHorizontal: width * 0.02,
    marginTop: height * 0.04,
  },
  activeDot: {
    backgroundColor: color.primary,
    marginTop: height * 0.04,
  },
  nextButton: {
    width: width * 0.9,
    height: height * 0.06,
    backgroundColor: color.white,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    alignItems: 'center',
    position: 'absolute',
    bottom: -height * 0.08,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: color.primary,
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});
