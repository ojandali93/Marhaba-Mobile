// VisibilityScreen.js
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {ChevronsLeft} from 'react-native-feather';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useProfile} from '../../Context/ProfileContext';

const VisibilityScreen = () => {
  const navigation = useNavigation();
  const {profile, grabUserProfile} = useProfile();

  const handleVisibility = async (visibility: string) => {
    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/user/updateVisibility',
        {userId: profile.userId, visibility},
      );
      if (response.status === 200) {
        await grabUserProfile(profile.userId);
        Alert.alert('Updated!', `Your visibility is now set to ${visibility}.`);
      } else {
        console.error('Visibility update failed');
        Alert.alert('Error', 'Failed to update visibility. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      {/* Header */}
      <View
        style={tailwind`p-4 border-b border-gray-700 flex-row items-center justify-between`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronsLeft color={themeColors.primary} height={30} width={30} />
        </TouchableOpacity>
        <Text style={tailwind`text-2xl font-bold text-gray-800 ml-2`}>
          Visibility
        </Text>
        <View style={{width: 30}} />
      </View>

      <ScrollView style={tailwind`flex-1 p-4`}>
        {/* Public */}
        <TouchableOpacity
          onPress={() => handleVisibility('Public')}
          style={[
            tailwind`items-start justify-between mb-3 p-3 rounded-2`,
            {
              backgroundColor:
                profile.visibility === 'Public'
                  ? themeColors.primary
                  : themeColors.darkSecondary,
            },
          ]}>
          <Text
            style={[
              tailwind`text-lg font-semibold`,
              {
                color: profile.visibility === 'Public' ? 'white' : 'black',
              },
            ]}>
            Public (Everyone)
          </Text>
          <Text
            style={[
              tailwind`text-sm mt-1`,
              {
                color: profile.visibility === 'Public' ? 'white' : 'black',
              },
            ]}>
            Your profile is public and can be seen by all users who meet your
            filters.
          </Text>
        </TouchableOpacity>

        {/* Matches */}
        <TouchableOpacity
          onPress={() => handleVisibility('Matches')}
          style={[
            tailwind`items-start justify-between mb-3 p-3 rounded-2`,
            {
              backgroundColor:
                profile.visibility === 'Matches'
                  ? themeColors.primary
                  : themeColors.darkSecondary,
            },
          ]}>
          <Text
            style={[
              tailwind`text-lg font-semibold`,
              {
                color: profile.visibility === 'Matches' ? 'white' : 'black',
              },
            ]}>
            Matches
          </Text>
          <Text
            style={[
              tailwind`text-sm mt-1`,
              {
                color: profile.visibility === 'Matches' ? 'white' : 'black',
              },
            ]}>
            Only users who you've liked and who have liked you back can see your
            profile.
          </Text>
        </TouchableOpacity>

        {/* Verified */}
        <TouchableOpacity
          onPress={() => handleVisibility('Verified')}
          style={[
            tailwind`items-start justify-between mb-3 p-3 rounded-2`,
            {
              backgroundColor:
                profile.visibility === 'Verified'
                  ? themeColors.primary
                  : themeColors.darkSecondary,
            },
          ]}>
          <Text
            style={[
              tailwind`text-lg font-semibold`,
              {
                color: profile.visibility === 'Verified' ? 'white' : 'black',
              },
            ]}>
            Verified
          </Text>
          <Text
            style={[
              tailwind`text-sm mt-1`,
              {
                color: profile.visibility === 'Verified' ? 'white' : 'black',
              },
            ]}>
            Your profile is visible only to users who are verified, adding a
            layer of safety.
          </Text>
        </TouchableOpacity>

        {/* Hidden (Tier 3 only) */}
        {profile.tier === 3 && (
          <TouchableOpacity
            onPress={() => handleVisibility('Hidden')}
            style={[
              tailwind`items-start justify-between mb-3 p-3 rounded-2`,
              {
                backgroundColor:
                  profile.visibility === 'Hidden'
                    ? themeColors.primary
                    : themeColors.darkSecondary,
              },
            ]}>
            <Text
              style={[
                tailwind`text-lg font-semibold`,
                {
                  color: profile.visibility === 'Hidden' ? 'white' : 'black',
                },
              ]}>
              Hidden
            </Text>
            <Text
              style={[
                tailwind`text-sm mt-1`,
                {
                  color: profile.visibility === 'Hidden' ? 'white' : 'black',
                },
              ]}>
              Your profile is completely hidden from everyone; you're in
              browse-only mode.
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VisibilityScreen;
