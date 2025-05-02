import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import { ChevronsRight } from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import { useProfile } from '../../Context/ProfileContext';
interface MenuViewProps {
    updateTab: (tab: string) => void;
}

const MenuView = ({updateTab}: MenuViewProps) => {
  const {removeJwtToken, removeProfile, removeSession, removeUserId, profile} = useProfile();

    const logout = async () => {
        try {
          removeSession();
          removeUserId();
          removeProfile();
          removeJwtToken();
        } catch (err) {
          console.error('❌ Logout exception:', err);
        }
      };

  return(
    <View style={tailwind`flex-1`}>
        <TouchableOpacity onPress={() => updateTab('editProfile')}  style={[tailwind`flex-row justify-between items-center p-4 rounded-2`, {backgroundColor: themeColors.darkSecondary}]}>
              <Text style={tailwind`text-base font-semibold text-gray-800`}>
                Edit Profile
              </Text>
              <ChevronsRight height={24} width={24} color={themeColors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateTab('settings')} style={[tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`, {backgroundColor: themeColors.darkSecondary}]}>
              <Text style={tailwind`text-base font-semibold text-gray-800`}>
                Settings
              </Text>
              <ChevronsRight height={24} width={24} color={themeColors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateTab('upgrade')} style={[tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`, {backgroundColor: themeColors.darkSecondary}]}>
              <Text style={[tailwind`text-base font-semibold`, {color: themeColors.primary}]}>
                Upgrade to Pro (50% off)
              </Text>
              <ChevronsRight height={24} width={24} color={themeColors.primary} />
          </TouchableOpacity>
          {
            profile.tier === 1 && (
              <TouchableOpacity onPress={() => updateTab('Viewed')} style={[tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`, {backgroundColor: themeColors.darkSecondary}]}>
                  <Text style={tailwind`text-base font-semibold`}>
                    Recently Viewed
                  </Text>
                  <ChevronsRight height={24} width={24} color={themeColors.primary} />
              </TouchableOpacity>
            )
          }
          <View style={[tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`, {backgroundColor: themeColors.darkSecondary}]}>
              <Text style={tailwind`text-base font-semibold text-gray-800`}>
               Visibility
              </Text>
              <View style={tailwind`flex-row items-center gap-2`}>
                <Text style={tailwind`text-base font-semibold text-gray-800`}>
                  Online
                </Text>
                <ChevronsRight height={24} width={24} color={themeColors.primary} />
              </View>
          </View>
          <View style={[tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`, {backgroundColor: themeColors.darkSecondary}]}>
              <Text style={tailwind`text-base font-semibold text-gray-800`}>
               Notifications
              </Text>
              <View style={tailwind`flex-row items-center gap-2`}>
                <Text style={tailwind`text-base font-semibold text-gray-800`}>
                  All enabled
                </Text>
                <ChevronsRight height={24} width={24} color={themeColors.primary} />
              </View>
          </View>
          <TouchableOpacity onPress={logout} style={[tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`, {backgroundColor: themeColors.darkSecondary}]}>
              <Text style={tailwind`text-base font-bold text-red-600`}>
               Logout
              </Text>
              <ChevronsRight height={24} width={24} color={themeColors.primary} />
          </TouchableOpacity>
          <View style={[tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2 mb-2`, {backgroundColor: themeColors.darkSecondary}]}>
              <Text style={tailwind`text-base font-bold text-red-600`}>
               Delete Account
              </Text>
              <ChevronsRight height={24} width={24} color={themeColors.primary} />
          </View>
    </View>
  )
};

export default MenuView;
