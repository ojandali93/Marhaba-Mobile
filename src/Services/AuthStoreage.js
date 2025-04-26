import AsyncStorage from '@react-native-async-storage/async-storage';

let currentUserId = null
let session = null
let currentProfile = null

// USERID

export const loadUserId = async () => {
  if (!currentUserId) {
    currentUserId = await AsyncStorage.getItem('userId');
  }
  return currentUserId;
};

export const getUserId = () => {
  return currentUserId;
};

export const setUserId = async (newUserId) => {
  currentUserId = newUserId;
  await AsyncStorage.setItem('userId', newUserId);
};

// Function to clear userId (when you log out)
export const clearUserId = async () => {
  currentUserId = null;
  await AsyncStorage.removeItem('userId');
};

// SESSION

export const loadSession = async () => {
  if (!session) {
    session = await AsyncStorage.getItem('session');
  }
  return session;
};

export const getSession = () => {
  return session;
};

export const setSession = async (newUserId) => {
  session = newUserId;
  await AsyncStorage.setItem('session', newUserId);
};

// Function to clear userId (when you log out)
export const clearSession = async () => {
  session = null;
  await AsyncStorage.removeItem('session');
};

// PROFILE

export const loadProfile = async () => {
  if (!currentProfile) {
    currentProfile = await AsyncStorage.getItem('currentProfile');
  }
  return JSON.parse(currentProfile);
};

export const getProfile = () => {
  return currentProfile;
};

export const setProfile = async (newProfile) => {
  currentProfile = newProfile;
  await AsyncStorage.setItem('currentProfile', currentProfile);
};

// Function to clear userId (when you log out)
export const clearProfile = async () => {
  currentProfile = null;
  await AsyncStorage.removeItem('currentProfile');
};