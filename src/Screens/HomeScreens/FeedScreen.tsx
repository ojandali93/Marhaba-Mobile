import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useLayoutEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {
  clearSession,
  clearUserId,
  getUserId,
  setProfile,
} from '../../Services/AuthStoreage';
import FeedSummaryComponent from '../../Components/Profiles/FeedProfileComponent';
import {useProfile} from '../../Context/ProfileContext';
import FeedProfileComponent from '../../Components/Profiles/FeedProfileComponent';
import {ArrowLeft, Heart} from 'react-native-feather';

const FeedScreen = () => {
  const {setUserProfile, userProfile} = useProfile();
  const [totalLikes, setTotalLikes] = useState<number>(10);

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
        setProfile(JSON.stringify(response.data));
        setUserProfile(response.data);
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
      <View
        style={tailwind`absolute w-full flex flex-row justify-between z-10 top-20 px-6`}>
        <TouchableOpacity
          style={[
            tailwind`p-2 rounded-full`,
            {
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderWidth: 1,
              borderColor: themeColors.primary,
            },
          ]}>
          <ArrowLeft height={22} width={22} color="black" strokeWidth={3} />
        </TouchableOpacity>
        <View
          style={[
            tailwind`flex-row items-center p-2 rounded-full`,
            {
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderWidth: 1,
              borderColor: themeColors.primary, // ✅ green border
            },
          ]}>
          <Heart
            height={20}
            width={20}
            fill={themeColors.primary}
            color={themeColors.primary}
            strokeWidth={2.5}
          />
          <Text style={tailwind`ml-2 text-xl font-bold text-green-900`}>
            {totalLikes}
          </Text>
        </View>
      </View>
      <FeedProfileComponent profile={userProfile} />
    </View>
  );
};

export default FeedScreen;
