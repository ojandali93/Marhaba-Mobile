import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../Utils/custonColors';

const HomeScreen = () => {
  const navigation = useNavigation();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('session');
      await AsyncStorage.removeItem('userId');
    } catch (err) {
      console.error('❌ Logout exception:', err);
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
