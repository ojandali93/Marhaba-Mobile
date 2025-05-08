import React, {useState, useEffect} from 'react';
import {Text, TextInput, TouchableOpacity, View, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ChevronsLeft} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';

interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const BlockedViews = ({updateTab}: MenuViewProps) => {
  const {profile} = useProfile();

  useEffect(() => {}, []);

  return (
    <View style={tailwind`flex-1`}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => updateTab('settings')}
        style={tailwind`flex-row items-center mb-4`}>
        <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        <Text
          style={[
            tailwind`text-2xl font-semibold`,
            {color: themeColors.primary},
          ]}>
          Blocked Users
        </Text>
      </TouchableOpacity>
      <View style={tailwind`flex-1`}>
        <Text>Blocked Users</Text>
      </View>
    </View>
  );
};

export default BlockedViews;
