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

const NoticiationsView = ({updateTab}: SettingsViewProps) => {
  const {userId, profile, grabUserProfile} = useProfile();
  const [messages, setMessages] = useState(profile.Notifications[0].messages);
  const [matches, setMatches] = useState(profile.Notifications[0].matches);
  const [likes, setLikes] = useState(profile.Notifications[0].likes);
  const [weeklyViews, setWeeklyViews] = useState(
    profile.Notifications[0].weeklyViews,
  );
  const [miscellanious, setMiscellanious] = useState(
    profile.Notifications[0].miscellanious,
  );

  const saveNotifications = async () => {
    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/user/updateNotifications',
        {
          userId,
          messages,
          matches,
          likes,
          weeklyViews,
          miscellanious,
        },
      );
      if (response.status === 200) {
        grabUserProfile(userId);
        updateTab('profile');
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
          onPress={() => updateTab('profile')}
          style={tailwind`flex flex-row items-center mb-3 mt-2`}>
          <ChevronsLeft height={30} width={30} color={themeColors.primary} />
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Notifications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveNotifications}
          style={[
            tailwind`px-2 py-1.5 rounded-2`,
            {backgroundColor: themeColors.primary},
          ]}>
          <Text style={tailwind`text-base font-semibold `}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={tailwind`flex-1`}>
        <View style={tailwind`flex-row items-center justify-between mb-1`}>
          <Text style={tailwind`text-base font-semibold `}>Messages</Text>
          <View style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}>
            <Switch
              value={messages}
              onValueChange={setMessages}
              trackColor={{false: '#ccc', true: themeColors.primaryDark}}
              thumbColor={messages ? themeColors.primary : '#f4f3f4'}
            />
          </View>
        </View>
        <View style={tailwind`flex-row items-center justify-between mb-1`}>
          <Text style={tailwind`text-base font-semibold `}>Matches</Text>
          <View style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}>
            <Switch
              value={matches}
              onValueChange={setMatches}
              trackColor={{false: '#ccc', true: themeColors.primaryDark}}
              thumbColor={matches ? themeColors.primary : '#f4f3f4'}
            />
          </View>
        </View>
        <View style={tailwind`flex-row items-center justify-between mb-1`}>
          <Text style={tailwind`text-base font-semibold `}>Likes</Text>
          <View style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}>
            <Switch
              value={likes}
              onValueChange={setLikes}
              trackColor={{false: '#ccc', true: themeColors.primaryDark}}
              thumbColor={likes ? themeColors.primary : '#f4f3f4'}
            />
          </View>
        </View>
        <View style={tailwind`flex-row items-center justify-between mb-1`}>
          <Text style={tailwind`text-base font-semibold `}>Weekly Views</Text>
          <View style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}>
            <Switch
              value={weeklyViews}
              onValueChange={setWeeklyViews}
              trackColor={{false: '#ccc', true: themeColors.primaryDark}}
              thumbColor={weeklyViews ? themeColors.primary : '#f4f3f4'}
            />
          </View>
        </View>
        <View style={tailwind`flex-row items-center justify-between mb-1`}>
          <Text style={tailwind`text-base font-semibold `}>Updates</Text>
          <View style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}>
            <Switch
              value={miscellanious}
              onValueChange={setMiscellanious}
              trackColor={{false: '#ccc', true: themeColors.primaryDark}}
              thumbColor={miscellanious ? themeColors.primary : '#f4f3f4'}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default NoticiationsView;
