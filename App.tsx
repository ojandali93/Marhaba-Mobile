import React, {useEffect} from 'react';
import BottomTabNavigation from './src/Navigation/BottomTabNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSessionCheck} from './src/Hooks/useSessionCheck';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/Navigation/AuthStackNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/Services/FirebaseConfig';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

function App(): React.JSX.Element {
  const isAuthenticated = useSessionCheck();

  useEffect(() => {
    requestUserPermission();
    const clearStorageOnColdStart = async () => {
      try {
        await AsyncStorage.clear();
      } catch (e) {
        console.error('Error clearing storage:', e);
      }
    };

    clearStorageOnColdStart();
  }, []);

  const requestUserPermission = async () => {
    messaging()
      .requestPermission()
      .then(() => {
        Alert.alert('requested permission');
      })
      .catch(err => {
        console.log('Notification permission denied', err);
      });
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? <BottomTabNavigation /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
