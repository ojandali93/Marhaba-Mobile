import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {ChevronsRight} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {track} from '@amplitude/analytics-react-native';
import {Switch} from 'react-native-gesture-handler';
interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const MenuView = ({updateTab}: MenuViewProps) => {
  const {
    removeProfile,
    removeSession,
    removeUserId,
    profile,
    checkAuthenticated,
  } = useProfile();

  const {grabUserProfile, userId} = useProfile();

  const navigation = useNavigation();
  const [incompleteProfile, setIncompleteProfile] = useState(false);
  const [viewRelationships, setViewRelationships] = useState(false);
  const logout = async () => {
    try {
      removeSession();
      removeUserId();
      removeProfile();
      checkAuthenticated();
      await axios.post(
        'https://marhaba-server.onrender.com/api/notifications/store-device-token',
        {
          userId: profile.userId,
          token: '',
        },
      );
    } catch (err) {
      console.error('❌ Logout exception:', err);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? All your data will be lost.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await axios.delete(
                'https://marhaba-server.onrender.com/api/account/delete',
                {data: {userId: profile.userId}}, // `data` key is required for DELETE body
              );
              if (response.data?.success) {
                console.log('✅ Account successfully deleted');
                await removeSession();
                await removeUserId();
                await removeProfile();
              } else {
                Alert.alert('Error', 'Failed to delete account.');
              }
            } catch (error) {
              console.error('❌ Delete account error:', error);
              Alert.alert('Error', 'An unexpected error occurred.');
            }
          },
        },
      ],
    );
  };

  const updateView = async () => {
    setViewRelationships(!viewRelationships);
    console.log(
      'viewRelationships',
      viewRelationships ? 'Relationships' : 'Social',
    );
    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/account/updateView',
        {
          userId: userId,
          view: viewRelationships ? 'Relationships' : 'Social',
        }, // `data` key is required for DELETE body
      );
      if (response.data?.success) {
        console.log('✅ Account successfully deleted');
        grabUserProfile(userId);
      } else {
        Alert.alert('Error', 'Failed to delete account.');
      }
    } catch (error) {
      console.error('❌ Delete account error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    if (profile) {
      const optionalTables = [
        'About',
        'Career',
        'Core',
        'Future',
        'Habits',
        'Intent',
        'Notifications',
        'Photos',
        'Prompts',
        'Preferences',
        'Relationships',
        'Religion',
        'Survey',
        'Tags',
        'Social',
      ];

      const hasEmptyTable = optionalTables.some(table => {
        const tableData = profile[table];
        return !Array.isArray(tableData) || tableData.length === 0;
      });

      setIncompleteProfile(hasEmptyTable);
    }
  }, [profile]);

  return (
    <View style={tailwind`flex-1`}>
      <TouchableOpacity
        onPress={() => updateTab('editProfile')}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <View style={tailwind`flex flex-row items-center`}>
          <Text style={tailwind`text-base font-semibold text-white`}>
            Edit Profile
          </Text>
          {incompleteProfile && (
            <View
              style={tailwind`w-2 h-2 rounded-full bg-yellow-400 mr-2 ml-3`}
            />
          )}
        </View>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => updateTab('settings')}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Settings
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          track('Viewed Upgrade Screen', {
            targetUserId: profile.userId,
          });
          updateTab('upgrade');
        }}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text
          style={[
            tailwind`text-base font-semibold`,
            {color: themeColors.primary},
          ]}>
          Upgrade to Pro (30% off)
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          track('toggles between social and relationships', {
            targetUserId: profile.userId,
          });
        }}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text
          style={[
            tailwind`text-base font-semibold`,
            {color: themeColors.primary},
          ]}>
          {viewRelationships ? 'Social' : 'Relationships'}
        </Text>

        <View style={{transform: [{scale: 0.7}]}}>
          <Switch value={viewRelationships} onValueChange={updateView} />
        </View>
      </TouchableOpacity>

      {profile.tier === 3 && (
        <TouchableOpacity
          onPress={() => updateTab('Viewed')}
          style={[
            tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
            {backgroundColor: themeColors.darkGrey},
          ]}>
          <Text style={tailwind`text-base font-semibold text-white`}>
            Recently Viewed
          </Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => updateTab('visibility')}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Visibility
        </Text>
        <View style={tailwind`flex-row items-center gap-2`}>
          <Text style={tailwind`text-base font-semibold text-white`}>
            {profile.visibility}
          </Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => updateTab('notifications')}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Notifications
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={logout}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-bold text-red-600`}>Logout</Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleDeleteAccount}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2 mb-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-bold text-red-600`}>
          Delete Account
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default MenuView;
