import 'react-native-url-polyfill/auto';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import BottomTabNavigation from './src/Navigation/BottomTabNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/Navigation/AuthStackNavigation';
import './src/Services/FirebaseConfig';
import {useProfile} from './src/Context/ProfileContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View } from 'react-native';
import themeColors from './src/Utils/custonColors';

function App(): React.JSX.Element {
  const {
    authenticated,
    setAuthenticated,
    checkAuthenticated,
    requestLocation,
    loadProfile,
    loadUserId,
    loadSession,
    loadJwtToken,
  } = useProfile();

  const [loading, setLoading] = useState(true); // ✅ NEW

  useLayoutEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await loadProfile();
      await loadUserId();
      await loadSession();
      await loadJwtToken();
      await checkAuthenticated();
      await requestLocation();
    } catch (e) {
      console.error('Storage initialization error:', e);
      setAuthenticated(false);
    } finally {
      setLoading(false); // ✅ hide splash once done
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            </View>
          ) : authenticated ? (
            <BottomTabNavigation />
          ) : (
            <AuthStack />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
