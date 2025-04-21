import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  return await AsyncStorage.getItem('access_token');
};

export const addToken = async () => {
  return await AsyncStorage.setItem('access_token', 'LGN');
};