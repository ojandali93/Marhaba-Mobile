// NotificationsScreen.js
import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ChevronsLeft} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useProfile} from '../../Context/ProfileContext';

const NotificationsScreen = () => {
  const navigation = useNavigation();
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
        await grabUserProfile(userId);
        Alert.alert('Saved!', 'Your notification settings have been updated.');
      } else {
        console.error('saveNotifications', response);
        Alert.alert('Error', 'Failed to update notification settings.');
      }
    } catch (error) {
      console.error('saveNotifications', error);
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
          Notifications
        </Text>
        <TouchableOpacity
          onPress={saveNotifications}
          style={[
            tailwind`px-2 py-1.5 rounded-2`,
            {backgroundColor: themeColors.primary},
          ]}>
          <Text style={tailwind`text-base font-semibold text-white`}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={tailwind`flex-1 p-4`}>
        {/* Messages */}
        <View style={tailwind`flex-row items-center justify-between mb-3`}>
          <Text style={tailwind`text-base font-semibold`}>Messages</Text>
          <Switch
            value={messages}
            onValueChange={setMessages}
            trackColor={{false: '#ccc', true: themeColors.primaryDark}}
            thumbColor={messages ? themeColors.primary : '#f4f3f4'}
          />
        </View>

        {/* Matches */}
        <View style={tailwind`flex-row items-center justify-between mb-3`}>
          <Text style={tailwind`text-base font-semibold`}>Matches</Text>
          <Switch
            value={matches}
            onValueChange={setMatches}
            trackColor={{false: '#ccc', true: themeColors.primaryDark}}
            thumbColor={matches ? themeColors.primary : '#f4f3f4'}
          />
        </View>

        {/* Likes */}
        <View style={tailwind`flex-row items-center justify-between mb-3`}>
          <Text style={tailwind`text-base font-semibold`}>Likes</Text>
          <Switch
            value={likes}
            onValueChange={setLikes}
            trackColor={{false: '#ccc', true: themeColors.primaryDark}}
            thumbColor={likes ? themeColors.primary : '#f4f3f4'}
          />
        </View>

        {/* Weekly Views */}
        <View style={tailwind`flex-row items-center justify-between mb-3`}>
          <Text style={tailwind`text-base font-semibold`}>Weekly Views</Text>
          <Switch
            value={weeklyViews}
            onValueChange={setWeeklyViews}
            trackColor={{false: '#ccc', true: themeColors.primaryDark}}
            thumbColor={weeklyViews ? themeColors.primary : '#f4f3f4'}
          />
        </View>

        {/* Updates */}
        <View style={tailwind`flex-row items-center justify-between mb-3`}>
          <Text style={tailwind`text-base font-semibold`}>Updates</Text>
          <Switch
            value={miscellanious}
            onValueChange={setMiscellanious}
            trackColor={{false: '#ccc', true: themeColors.primaryDark}}
            thumbColor={miscellanious ? themeColors.primary : '#f4f3f4'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
