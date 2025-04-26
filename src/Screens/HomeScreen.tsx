import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useLayoutEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../Utils/custonColors';
import {clearSession, clearUserId, getUserId} from '../Services/AuthStoreage';

const HomeScreen = () => {
  const navigation = useNavigation();

  const logout = async () => {
    try {
      clearSession();
      clearUserId();
    } catch (err) {
      console.error('❌ Logout exception:', err);
    }
  };

  useLayoutEffect(() => {
    grabuserProfile();
  }, []);

  const grabuserProfile = async () => {
    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/user/${getUserId()}`,
      );

      if (response.data) {
        console.log('✅ Grabbed user profile:', JSON.stringify(response.data));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status outside 2xx
          console.error('❌ API Error Response:', {
            status: error.response.status,
            data: error.response.data,
          });
        } else if (error.request) {
          // Request made but no response
          console.error('❌ No response from server:', error.request);
        } else {
          // Something else happened
          console.error('❌ Axios Error:', error.message);
        }
      } else {
        console.error('❌ Non-Axios Error:', error);
      }
    }
  };

  return (
    <View
      style={[
        tailwind`w-full h-full`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <Text style={tailwind`mt-24`}>Marhaba</Text>
      <TouchableOpacity onPress={logout}>
        <View style={tailwind`p-2`}>
          <Text>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
