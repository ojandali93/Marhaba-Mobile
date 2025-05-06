import 'react-native-url-polyfill/auto';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import BottomTabNavigation from './src/Navigation/BottomTabNavigation';
import AuthStack from './src/Navigation/AuthStackNavigation';
import {useProfile} from './src/Context/ProfileContext';

function App(): React.JSX.Element {
  const {
    authenticated,
    setAuthenticated,
    checkAuthenticated,
    requestLocation,
    loadProfile,
    loadUserId,
    loadSession,
    fetchLikes,
    fetchUnreadMessages,
    profile,
  } = useProfile();

  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  // Hydrate profile/session on first load
  useLayoutEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await loadProfile(); // this sets profile + userId
      await loadUserId();
      await loadSession();
      await checkAuthenticated();
      await requestLocation();
      setReady(true);
    } catch (e) {
      console.error('❌ App initialization error:', e);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Wait until profile is fully set before fetching likes
  useEffect(() => {
    if (ready && profile?.userId) {
      fetchLikes(profile.userId);
      fetchUnreadMessages(profile.jwtToken, profile.userId);
    }
  }, [ready, profile?.userId]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <NavigationContainer>
          {loading ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            />
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
