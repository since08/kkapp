import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import {ActionConst, Actions} from 'react-native-router-flux';
import {Metrics} from '../Themes';

let bootSplashLogo = require('../../assets/bootsplash_logo.png');

let fakeApiCallWithoutBadNetwork = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

let App = () => {
  let [bootSplashIsVisible, setBootSplashIsVisible] = useState(true);
  let [bootSplashLogoIsLoaded, setBootSplashLogoIsLoaded] = useState(false);
  let opacity = useRef(new Animated.Value(1));
  let translateY = useRef(new Animated.Value(0));

  let init = async () => {
    BootSplash.hide();

    // You can uncomment this line to add a delay on app startup
    // let data = await fakeApiCallWithoutBadNetwork(3000);
    Actions.replace('Main');
    let useNativeDriver = true;

    Animated.timing(opacity.current, {
      useNativeDriver,
      toValue: 0,
      duration: 150,
      delay: 350,
    }).start(() => {
      setBootSplashIsVisible(false);
    });
  };

  useEffect(() => {
    bootSplashLogoIsLoaded && init();
  }, [bootSplashLogoIsLoaded]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={bootSplashLogo}
        fadeDuration={0}
        onLoadEnd={() => setBootSplashLogoIsLoaded(true)}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
  },
});

export default App;
