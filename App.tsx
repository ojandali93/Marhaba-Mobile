import 'react-native-url-polyfill/auto';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import axios from 'axios';

import BottomTabNavigation from './src/Navigation/BottomTabNavigation';
import AuthStack from './src/Navigation/AuthStackNavigation';
import {useProfile} from './src/Context/ProfileContext';
import ReviewRejectedScreen from './src/Screens/ProfileScreens/ReviewRejectedScreen';
import ReviewAwaitingScreen from './src/Screens/ProfileScreens/ReviewAwaitScreen';

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
  const [reviewNotes, setReviewNotes] = useState(null);

  useLayoutEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await loadProfile();
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

  useEffect(() => {
    if (ready && profile?.userId) {
      fetchLikes(profile.userId);
      fetchUnreadMessages(profile.jwtToken, profile.userId);

      if (profile.approved === 'rejected') {
        fetchReviewNotes(profile.userId);
      }
    }
  }, [ready, profile?.userId]);

  const fetchReviewNotes = async (userId: string) => {
    try {
      const res = await axios.get(
        `https://marhaba-server.onrender.com/api/admin/reviewInfo/${userId}`,
      );
      setReviewNotes(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch review notes:', err);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <NavigationContainer>
          {loading ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" />
            </View>
          ) : authenticated ? (
            profile?.approved === 'review' ? (
              <ReviewAwaitingScreen />
            ) : profile?.approved === 'rejected' ? (
              <ReviewRejectedScreen
                profile={profile}
                reviewNotes={reviewNotes}
              />
            ) : (
              <BottomTabNavigation />
            )
          ) : (
            <AuthStack />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
