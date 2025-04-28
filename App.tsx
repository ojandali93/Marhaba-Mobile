import 'react-native-url-polyfill/auto';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import BottomTabNavigation from './src/Navigation/BottomTabNavigation';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'; // 👈 correct import
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/Navigation/AuthStackNavigation';
import './src/Services/FirebaseConfig';
import {
  loadSession,
  getSession,
  getUserId,
  loadUserId,
} from './src/Services/AuthStoreage';
import themeColors from './src/Utils/custonColors';
import {ProfileProvider} from './src/Context/ProfileContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useLayoutEffect(() => {
    const initializeApp = async () => {
      try {
        await loadSession();
        await loadUserId();
        const session = getSession();
        const userId = getUserId();
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

  useEffect(() => {
    const watchSession = setInterval(() => {
      const session = getSession();
      const userId = getUserId();
      setIsAuthenticated(!!session && !!userId);
    }, 1000);

    return () => clearInterval(watchSession);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <NavigationContainer>
        <ProfileProvider>
          {isAuthenticated ? <BottomTabNavigation /> : <AuthStack />}
        </ProfileProvider>
      </NavigationContainer>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
