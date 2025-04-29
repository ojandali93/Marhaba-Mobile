import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {clearSession, clearUserId, getProfile, getUserId} from '../../Services/AuthStoreage';

const ProfileScreen = () => {

  const userProfile = getProfile().data;
  const userId = getUserId();
  console.log('profile', userProfile);
  console.log('userId', userId);
  const logout = async () => {
    try {
      clearSession();
      clearUserId();
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
      <Text style={tailwind`mt-24`}>{userId}</Text>
      <TouchableOpacity onPress={logout}>
        <View style={tailwind`p-2`}>
          <Text>Logout User</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
