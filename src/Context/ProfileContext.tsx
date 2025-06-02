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
import {identify, setUserId} from '@amplitude/analytics-react-native';

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
        await addProfile(response.data.data[0]);
        await addSession(JSON.stringify(session));
        await addUserId(userId);

        // 🟢 Now that userId is stored, request location
        setTimeout(() => {
          requestLocation(userId); // calls addLocation() which depends on userId
        }, 300); // give async setUserId a moment to settle
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

  const addLocation = async (
    userId: string,
    location: {
      latitude: number;
      longitude: number;
    },
  ) => {
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

      if (response.data?.success) {
        return;
      } else {
        console.error('Error updating location:', response.data?.message);
        return;
      }
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

  const requestLocation = async (userId: string) => {
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
          addLocation(userId, position?.coords);
        },
        error => console.log(error),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } catch (error) {
      console.log(error);
    }
  };

  const convertDistanceLabelToMiles = (label: string): number => {
    switch (label) {
      case 'Close (50 miles)':
        return 50;
      case 'Medium (100 miles)':
        return 100;
      case 'Far (150 miles)':
        return 150;
      case 'Everywhere (500+ miles)':
        return 500;
      default:
        return 50; // fallback to default
    }
  };

  const grabUserMatches = async () => {
    const distanceLabel = profile.Preferences[0].distance;
    const distance = convertDistanceLabelToMiles(distanceLabel);
    const latitude = profile.latitude;
    const longitude = profile.longitude;
    const ageMin = profile.Preferences[0].ageMin;
    const ageMax = profile.Preferences[0].ageMax;
    const gender = profile.Preferences[0].gender;
    try {
      const response = await axios.post(
        `https://marhaba-server.onrender.com/api/user/getMatches`,
        {
          userId,
          distance,
          latitude,
          longitude,
          ageMin,
          ageMax,
          gender,
        },
      );
      if (response.data) {
        console.log('matched profiles:', response.data.matches);
        setMatchedProfiles(response.data.matches);
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
      setUnreadMap(unreadMap);

      // ✅ If any value is true, set hasUnreadMessages to true
      const hasAnyUnread = Object.values(unreadMap).some(
        value => value === true,
      );
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
