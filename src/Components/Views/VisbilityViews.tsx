import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  Switch,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Check,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';

interface SettingsViewProps {
  updateTab: (tab: string) => void;
}

const VisbilityViews = ({updateTab}: SettingsViewProps) => {
  const {profile, grabUserProfile} = useProfile();

  const handleVisibility = async (visibility: string) => {
    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/user/updateVisibility',
        {userId: profile.userId, visibility},
      );
      if (response.status === 200) {
        grabUserProfile(profile.userId);
        updateTab('profile');
      } else {
        console.error('Visibility update failed');
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={tailwind`flex-1`}>
      <View style={tailwind`flex flex-row items-center justify-between mb-3`}>
        <TouchableOpacity
          onPress={() => updateTab('profile')}
          style={tailwind`flex flex-row items-center mb-3 mt-2`}>
          <ChevronsLeft height={30} width={30} color={themeColors.primary} />
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Visibility
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tailwind`flex-1`}>
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
              tailwind`text-lg font-semibold text-gray-800`,
              {
                backgroundColor:
                  profile.visibility === 'Public'
                    ? themeColors.primary
                    : themeColors.darkSecondary,
                color: profile.visibility === 'Public' ? 'white' : 'black',
              },
            ]}>
            Public (Everyone)
          </Text>
          <Text
            style={[
              tailwind`text-sm text-gray-800 mt-1`,
              {
                backgroundColor:
                  profile.visibility === 'Public'
                    ? themeColors.primary
                    : themeColors.darkSecondary,
                color: profile.visibility === 'Public' ? 'white' : 'black',
              },
            ]}>
            Your profile is public and can be seen by all users who meet your
            filters.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleVisibility('Matches')}
          style={[
            tailwind`items-start justify-between mb-3 p-3 rounded-2`,
            {
              backgroundColor:
                profile.visibility === 'Matches'
                  ? themeColors.primary
                  : themeColors.darkSecondary,
              color: profile.visibility === 'Matches' ? 'white' : 'black',
            },
          ]}>
          <Text
            style={[
              tailwind`text-lg font-semibold text-gray-800`,
              {
                backgroundColor:
                  profile.visibility === 'Matches'
                    ? themeColors.primary
                    : themeColors.darkSecondary,
                color: profile.visibility === 'Matches' ? 'white' : 'black',
              },
            ]}>
            Matches
          </Text>
          <Text
            style={[
              tailwind`text-sm text-gray-800 mt-1`,
              {
                backgroundColor:
                  profile.visibility === 'Matches'
                    ? themeColors.primary
                    : themeColors.darkSecondary,
                color: profile.visibility === 'Matches' ? 'white' : 'black',
              },
            ]}>
            Only users who you've liked and who have liked you back can see your
            profile.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleVisibility('Verified')}
          style={[
            tailwind`items-start justify-between mb-3 p-3 rounded-2`,
            {
              backgroundColor:
                profile.visibility === 'Verified'
                  ? themeColors.primary
                  : themeColors.darkSecondary,
              color: profile.visibility === 'Verified' ? 'white' : 'black',
            },
          ]}>
          <Text
            style={[
              tailwind`text-lg font-semibold text-gray-800`,
              {
                backgroundColor:
                  profile.visibility === 'Verified'
                    ? themeColors.primary
                    : themeColors.darkSecondary,
                color: profile.visibility === 'Verified' ? 'white' : 'black',
              },
            ]}>
            Verified
          </Text>
          <Text
            style={[
              tailwind`text-sm text-gray-800 mt-1`,
              {
                backgroundColor:
                  profile.visibility === 'Verified'
                    ? themeColors.primary
                    : themeColors.darkSecondary,
                color: profile.visibility === 'Verified' ? 'white' : 'black',
              },
            ]}>
            Your profile is visible only to users who are verified, adding a
            layer of safety.
          </Text>
        </TouchableOpacity>
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
                color: profile.visibility === 'Hidden' ? 'white' : 'black',
              },
            ]}>
            <Text style={tailwind`text-lg font-semibold text-gray-800`}>
              Hidden
            </Text>
            <Text style={tailwind`text-sm text-gray-800 mt-1`}>
              Your profile is completely hidden from everyone; you're in
              browse-only mode.
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default VisbilityViews;
