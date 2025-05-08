import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import themeColors from '../../Utils/custonColors';
import tailwind from 'twrnc';
import {useProfile} from '../../Context/ProfileContext';

const ReviewAwaitingScreen = () => {
  const {removeSession, removeUserId, removeProfile, checkAuthenticated} =
    useProfile();

  const logout = async () => {
    try {
      removeSession();
      removeUserId();
      removeProfile();
      checkAuthenticated();
    } catch (err) {
      console.error('❌ Logout exception:', err);
    }
  };

  return (
    <View
      style={[
        tailwind`flex-1 justify-center items-center px-6`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <Image
        source={require('../../Assets/marhaba-icon-full-beige.png')} // Optional: Replace with your own image or illustration
        style={tailwind`w-40 h-40 mb-6`}
        resizeMode="contain"
      />
      <Text style={tailwind`text-2xl font-bold text-center text-gray-800 mb-2`}>
        Your Profile is Under Review
      </Text>
      <Text style={tailwind`text-base text-center text-gray-700`}>
        Thank you for completing your profile. Our team is currently reviewing
        your submission.
      </Text>
      <Text style={tailwind`text-base text-center text-gray-700 mt-2`}>
        You will be notified once a decision has been made.
      </Text>
      <Text style={tailwind`text-base text-center text-gray-500 mt-6`}>
        Please check back later.
      </Text>
      <TouchableOpacity
        style={tailwind`bg-red-500 p-2 rounded-md mt-6`}
        onPress={logout}>
        <Text style={tailwind`text-white text-center`}>Back To Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewAwaitingScreen;
