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

const ProSettingsView = ({updateTab}: SettingsViewProps) => {
  const {userId, profile, grabUserProfile} = useProfile();
  const [hideVerified, setHideVerified] = useState(profile.showPro);

  const updateHideVerified = async () => {
    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/user/showBadge',
        {
          userId,
          show: !hideVerified,
        },
      );
      if (response.status === 200) {
        setHideVerified(!hideVerified);
        grabUserProfile(userId);
      } else {
        console.error('saveNotifications', response);
      }
    } catch (error) {
      console.error('saveNotifications', error);
    }
  };

  return (
    <View style={tailwind`flex-1`}>
      <View style={tailwind`flex flex-row items-center justify-between mb-3`}>
        <TouchableOpacity
          onPress={() => updateTab('settings')}
          style={tailwind`flex flex-row items-center mb-3 mt-2`}>
          <ChevronsLeft height={30} width={30} color={themeColors.primary} />
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Pro Settings
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tailwind`flex-1`}>
        <View style={tailwind`flex-row items-center justify-between mb-1`}>
          <Text style={tailwind`text-base font-semibold text-white`}>
            Show Pro Badge
          </Text>
          <View style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}>
            <Switch
              value={hideVerified}
              onValueChange={updateHideVerified}
              trackColor={{false: '#ccc', true: themeColors.primaryDark}}
              thumbColor={hideVerified ? themeColors.primary : '#f4f3f4'}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProSettingsView;
