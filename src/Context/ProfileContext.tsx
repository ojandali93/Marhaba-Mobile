import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { initializeSocket } from '../Services/socket';

interface ProfileContextType {
  profile: any | null;
  session: string | null;
  userId: string | null;
  location: { latitude: number; longitude: number } | null;
  allProfiles: any[];
  jwtToken: string | null;
  matchedProfiles: any[];
  authenticated: boolean;
  setMatchedProfiles: (profiles: any[]) => void;
  grabUserProfile: (userId: string) => Promise<void>;
  addProfile: (profile: any) => Promise<void>;
  removeProfile: (profileId: string) => Promise<void>;
  addUserId: (userId: string) => Promise<void>;
  removeUserId: () => Promise<void>;
  addSession: (session: string) => Promise<void>;
  removeSession: () => Promise<void>;
  addJwtToken: (token: string) => Promise<void>;
  removeJwtToken: () => Promise<void>;
  addLocation: (location: { latitude: number; longitude: number }) => Promise<void>;
  removeLocation: () => Promise<void>;
  requestLocation: () => Promise<void>;
  setAuthenticated: (authenticated: boolean) => void;
  loadSession: () => Promise<void>;
  loadUserId: () => Promise<void>;
  grabUserProfileData: (session: string, userId: string, token: string) => Promise<void>;
  grabUserMatches: () => Promise<void>; 
  checkAuthenticated: () => Promise<void>;
  loadProfile: () => Promise<void>;
  loadJwtToken: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {

  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [matchedProfiles, setMatchedProfiles] = useState<any[]>([]);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const grabUserProfile = async (userId: string) => {
    try {
      const response = await axios.get(`https://marhaba-server.onrender.com/api/user/${userId}`);
      if(response.data) {
        setProfile(response.data.data);
        setUserId(response.data.data.userId);
      }
    } catch (error) {
      console.error('No Profile Found:', error);
    }
  }

  const grabUserProfileData = async (session: string, userId: string, token: string) => {
    try {
      const response = await axios.get(`https://marhaba-server.onrender.com/api/user/${userId}`);
      if(response.data) {
        addProfile(JSON.stringify(response.data.data));
        addSession(JSON.stringify(session));
        addUserId(response.data.data.userId);
        addJwtToken(token);
        setAuthenticated(true)
      }
    } catch (error) {
      console.error('No Profile Found:', error);
    }
  }

  const updateProfileLocation = async () => {
    try {
      const response = await axios.get(`https://marhaba-server.onrender.com/api/user/${userId}`);
      if(response.data) {
        setProfile(response.data.data);
        setUserId(response.data.data.userId);
      }
    } catch (error) {
      console.error('No Profile Found:', error);
    }
  }

  const loadProfile = async () => {
    const storedProfile = await AsyncStorage.getItem('profile');
    if(storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      setSession(null);
    }
  }

  const addProfile = async (profile: any) => {
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
    setProfile(profile);
  }

  const removeProfile = async (profileId: string) => {
    await AsyncStorage.removeItem('profile');
    setProfile(null);
  }

  const loadUserId = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    if(storedUserId) {
      setUserId(storedUserId);
    } else {
      setUserId(null);
    }
  }
  const addUserId = async (userId: string) => {
    await AsyncStorage.setItem('userId', userId);
    setUserId(userId);
  }

  const removeUserId = async () => {
    await AsyncStorage.removeItem('userId');
    setUserId(null);
  }

  const loadSession = async () => {
    const storedSession = await AsyncStorage.getItem('session');
    if(storedSession) {
      setSession(storedSession);
    } else {
      setSession(null);
    }
  }
  const addSession = async (session: string) => {
    await AsyncStorage.setItem('session', session);
    setSession(session);
  }

  const removeSession = async () => {
    await AsyncStorage.removeItem('session');
    setSession(null);
  }

  const loadJwtToken = async () => {
    const storedJwtToken = await AsyncStorage.getItem('jwtToken');
    if(storedJwtToken) {
      setJwtToken(storedJwtToken);
    } else {
      setSession(null);
    }
  }

  const addJwtToken = async (token: string) => {
    await AsyncStorage.setItem('jwtToken', token);
    setJwtToken(token);
  }
  
  const removeJwtToken = async () => {
    await AsyncStorage.removeItem('jwtToken');
    setJwtToken(null);
  }

  const addLocation = async (location: { latitude: number; longitude: number }) => {
    await AsyncStorage.setItem('location', JSON.stringify(location));
    setLocation(location);
    try {
      const response = await axios.put(`https://marhaba-server.onrender.com/api/user/location`, {
        userId,
        longitude: location.longitude,
        latitude: location.latitude
      });
      if(response.data) {
        console.log('✅ Location added:', response.data);
      }
    } catch (error) {
      console.error('Error requesting location:', error);
    }
  }

  const removeLocation = async () => {
    await AsyncStorage.removeItem('location');
    setLocation(null);
  }

  const checkAuthenticated = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    const storedSession = await AsyncStorage.getItem('session');
    const storedJwtToken = await AsyncStorage.getItem('jwtToken');
    if(storedUserId && storedSession && storedJwtToken) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }

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
      const response = await axios.get(`https://marhaba-server.onrender.com/api/user/allUsers`);
      if(response.data) {
        setAllProfiles(response.data.data);
        setMatchedProfiles(response.data.data);
      }
    } catch (error) {
      console.error('No Matches Found:', error);
    }
  }

  useEffect(() => {
    if (authenticated) {
      initializeSocket();
    }
  }, [authenticated]); // 👈 move initializeSocket inside here

  return (
    <ProfileContext.Provider
      value={{
        profile,
        session,
        userId,
        location,
        allProfiles,
        jwtToken,
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
        addJwtToken,
        removeJwtToken,
        addLocation,
        removeLocation,
        requestLocation,
        loadSession,
        loadUserId,
        grabUserProfileData,
        grabUserMatches,
        checkAuthenticated,
        loadProfile,
        loadJwtToken
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
