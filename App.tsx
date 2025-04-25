import 'react-native-url-polyfill/auto';
import React, {useEffect, useState} from 'react';
import BottomTabNavigation from './src/Navigation/BottomTabNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/Navigation/AuthStackNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/Services/FirebaseConfig';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const requestUserPermission = async () => {
    try {
      await messaging().requestPermission();
      Alert.alert('Permission requested');
    } catch (err) {
      console.log('Notification permission denied', err);
    }
  };

  useEffect(() => {
    requestUserPermission();

    const initializeApp = async () => {
      try {
        // Preserve session and userId, remove everything else
        const session = await AsyncStorage.getItem('session');
        const userId = await AsyncStorage.getItem('userId');

        const allKeys = await AsyncStorage.getAllKeys();
        const keysToRemove = allKeys.filter(
          key => key !== 'session' && key !== 'userId',
        );

        await AsyncStorage.multiRemove(keysToRemove);

        if (session && userId) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error('Storage initialization error:', e);
        setIsAuthenticated(false);
      }
    };

    initializeApp();
  }, []);

  // Watch session changes
  useEffect(() => {
    const watchSession = setInterval(async () => {
      const session = await AsyncStorage.getItem('session');
      const userId = await AsyncStorage.getItem('userId');
      setIsAuthenticated(!!session && !!userId);
    }, 2000); // checks every 2 seconds (adjust if needed)

    return () => clearInterval(watchSession);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? <BottomTabNavigation /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
