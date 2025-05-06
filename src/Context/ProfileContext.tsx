import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {initializeSocket} from '../Services/socket';
import {Alert} from 'react-native';

interface ProfileContextType {
  profile: any | null;
  session: string | null;
  userId: string | null;
  location: {latitude: number; longitude: number} | null;
  allProfiles: any[];
  matchedProfiles: any[];
  authenticated: boolean;
  setMatchedProfiles: (profiles: any[]) => void;
  grabUserProfile: (userId: string) => Promise<void>;
  addProfile: (profile: any) => Promise<void>;
  removeProfile: () => Promise<void>;
  addUserId: (userId: string) => Promise<void>;
  removeUserId: () => Promise<void>;
  addSession: (session: string) => Promise<void>;
  removeSession: () => Promise<void>;
  addLocation: (location: {
    latitude: number;
    longitude: number;
  }) => Promise<void>;
  removeLocation: () => Promise<void>;
  requestLocation: () => Promise<void>;
  setAuthenticated: (authenticated: boolean) => void;
  loadSession: () => Promise<void>;
  loadUserId: () => Promise<void>;
  grabUserProfileData: (session: string, userId: string) => Promise<void>;
  grabUserMatches: () => Promise<void>;
  checkAuthenticated: () => Promise<void>;
  loadProfile: () => Promise<void>;
  fetchLikes: (userId: string) => Promise<void>;
  unViewedInteractions: boolean;
  markLikesAsViewed: (userId: string) => Promise<void>;
  fetchUnreadMessages: (jwtToken: string, userId: string) => Promise<void>;
  hasUnreadMessages: boolean;
  activeConversationId: string | null;
  setActiveConversationId: (conversationId: string | null) => void;
  setHasUnreadMessages: (hasUnreadMessages: boolean) => void;
  setUnViewedInteractions: (unViewedInteractions: boolean) => void;
  setInteractions: (interactions: any[]) => void;
  interactions: any[];
  unreadMap: {[key: string]: number};
  setUnreadMap: (unreadMap: {[key: string]: number}) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({children}: {children: React.ReactNode}) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [matchedProfiles, setMatchedProfiles] = useState<any[]>([]);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState<boolean>(false);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  const [unreadMap, setUnreadMap] = useState<{[key: string]: number}>({});

  const [unViewedInteractions, setUnViewedInteractions] =
    useState<boolean>(false);

  const grabUserProfile = async (userId: string) => {
    console.log('grabUserProfile: ', userId);
    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/user/${userId}`,
      );
      if (response.data) {
        setProfile(response.data.data[0]);
        setUserId(userId);
      }
    } catch (error) {
      console.error('No Profile Found:', error);
    }
  };

  const grabUserProfileData = async (session: string, userId: string) => {
    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/user/${userId}`,
      );
      if (response.data) {
        addProfile(response.data.data[0]);
        addSession(JSON.stringify(session));
        addUserId(userId);
        setAuthenticated(true);
      }
    } catch (error) {
      console.error('No Profile Found:', error);
    }
  };

  const loadProfile = async () => {
    const storedProfile = await AsyncStorage.getItem('profile');
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      setProfile(parsed);
      setUserId(parsed.userId);
    } else {
      setProfile(null);
    }
  };

  const addProfile = async (profile: any) => {
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
    setProfile(profile);
  };

  const removeProfile = async () => {
    await AsyncStorage.removeItem('profile');
    setProfile(null);
  };

  const loadUserId = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setUserId(null);
    }
  };

  const addUserId = async (userId: string) => {
    await AsyncStorage.setItem('userId', userId);
    setUserId(userId);
  };

  const removeUserId = async () => {
    await AsyncStorage.removeItem('userId');
    setUserId(null);
  };

  const loadSession = async () => {
    const storedSession = await AsyncStorage.getItem('session');
    if (storedSession) {
      setSession(storedSession);
    } else {
      setSession(null);
    }
  };

  const addSession = async (session: string) => {
    await AsyncStorage.setItem('session', JSON.stringify(session));
    setSession(session);
  };

  const removeSession = async () => {
    await AsyncStorage.removeItem('session');
    setSession(null);
  };

  const addLocation = async (location: {
    latitude: number;
    longitude: number;
  }) => {
    await AsyncStorage.setItem('location', JSON.stringify(location));
    setLocation(location);
    try {
      const response = await axios.put(
        `https://marhaba-server.onrender.com/api/user/location`,
        {
          userId,
          longitude: location.longitude,
          latitude: location.latitude,
        },
      );
    } catch (error) {
      console.error('Error requesting location:', error);
    }
  };

  const removeLocation = async () => {
    await AsyncStorage.removeItem('location');
    setLocation(null);
  };

  const checkAuthenticated = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    const storedSession = await AsyncStorage.getItem('session');
    if (storedUserId && storedSession) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  };

  const requestLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      }
      Geolocation.getCurrentPosition(
        position => {
          addLocation(position?.coords);
        },
        error => console.log(error),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } catch (error) {
      console.log(error);
    }
  };

  const grabUserMatches = async () => {
    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/user/allUsers`,
      );
      if (response.data) {
        setAllProfiles(response.data.data);
        setMatchedProfiles(response.data.data);
      }
    } catch (error) {
      console.error('No Matches Found:', error);
    }
  };

  const fetchLikes = async (userId: string) => {
    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/user/liked/${userId}`,
      );

      if (response.data && Array.isArray(response.data.data)) {
        const likes = response.data.data;

        setInteractions(likes);

        const hasUnviewed = likes.some((like: any) => like.viewed === false);
        setUnViewedInteractions(hasUnviewed);
      } else {
        setInteractions([]);
        setUnViewedInteractions(false);
      }
    } catch (err) {
      console.error('❌ Error fetching likes:', err);
      setUnViewedInteractions(false);
    }
  };

  const markLikesAsViewed = async (userId: string) => {
    if (!userId) return;
    try {
      const response = await axios.put(
        `https://marhaba-server.onrender.com/api/user/updateViewed`,
        {userId},
      );

      if (response.data?.success) {
        fetchLikes(userId);
      }
    } catch (err) {
      console.error('❌ Error marking likes as viewed:', err);
    }
  };

  const fetchUnreadMessages = async (jwtToken: string, userId: string) => {
    if (!jwtToken || !userId) return;

    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/conversation/unread/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      const unreadMap = response.data.unreadMap || {};
      console.log('unreadMap:', unreadMap);
      setUnreadMap(unreadMap);

      // ✅ If any value is true, set hasUnreadMessages to true
      const hasAnyUnread = Object.values(unreadMap).some(
        value => value === true,
      );
      console.log('hasAnyUnread:', hasAnyUnread);
      setHasUnreadMessages(hasAnyUnread);
    } catch (err) {
      console.error('❌ Error fetching unread messages:', err);
      setHasUnreadMessages(false); // fallback to safe state
    }
  };

  useEffect(() => {
    if (authenticated && profile?.jwtToken && userId) {
      initializeSocket(profile.jwtToken, userId);
      fetchUnreadMessages(profile.jwtToken, userId);
    }
  }, [authenticated, profile?.jwtToken, userId]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        session,
        userId,
        location,
        allProfiles,
        matchedProfiles,
        authenticated,
        setMatchedProfiles,
        setAuthenticated,
        grabUserProfile,
        addProfile,
        removeProfile,
        addUserId,
        removeUserId,
        addSession,
        removeSession,
        addLocation,
        removeLocation,
        requestLocation,
        loadSession,
        loadUserId,
        grabUserProfileData,
        grabUserMatches,
        checkAuthenticated,
        loadProfile,
        fetchLikes,
        unViewedInteractions,
        markLikesAsViewed,
        fetchUnreadMessages,
        hasUnreadMessages,
        activeConversationId,
        setActiveConversationId,
        setHasUnreadMessages,
        setUnViewedInteractions,
        setInteractions,
        interactions,
        unreadMap,
        setUnreadMap,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
