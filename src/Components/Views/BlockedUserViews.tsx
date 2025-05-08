import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {ChevronsLeft} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';
import axios from 'axios';

interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const BlockedUserViews = ({updateTab}: MenuViewProps) => {
  const {profile} = useProfile();
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    loadBlockedUsers();
  }, [profile]);

  const loadBlockedUsers = async () => {
    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/user/blockedUsers/${profile?.userId}`,
      );
      if (response.data.success) {
        setBlockedUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error loading blocked users:', error);
    }
  };

  const handleUnblockUser = async (blockedId: string) => {
    try {
      await axios.post(
        `https://marhaba-server.onrender.com/api/user/unblockUser`,
        {
          blocker_id: profile.userId,
          blocked_id: blockedId,
        },
      );
      Alert.alert('Unblocked', 'User has been unblocked successfully.');
      loadBlockedUsers(); // refresh list
    } catch (err) {
      console.error('Error unblocking user:', err);
      Alert.alert('Error', 'Failed to unblock user.');
    }
  };

  return (
    <View style={tailwind`flex-1`}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => updateTab('settings')}
        style={tailwind`flex-row items-center mb-4`}>
        <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        <Text
          style={[
            tailwind`text-2xl font-semibold ml-2`,
            {color: themeColors.primary},
          ]}>
          Blocked Users
        </Text>
      </TouchableOpacity>

      <ScrollView style={tailwind`flex-1`}>
        {blockedUsers.length === 0 ? (
          <Text style={tailwind`text-center text-lg text-gray-600 mt-10`}>
            You haven’t blocked anyone yet.
          </Text>
        ) : (
          blockedUsers.map((item: any, index: number) => {
            const user = item.blockedId;
            const name = user?.name ?? 'N/A';
            const age = getAgeFromDOB(user?.dob);
            const photoUrl = user?.Photos?.[0]?.photoUrl;
            const religion = user?.About?.[0]?.religion;
            const sect = user?.About?.[0]?.sect;
            const background = user?.About?.[0]?.background;
            const userId = user?.userId;

            return (
              <View
                key={index}
                style={[
                  tailwind`mb-4 p-4 rounded-lg`,
                  {backgroundColor: themeColors.darkSecondary},
                ]}>
                <View style={tailwind`flex-row items-center`}>
                  <Image
                    source={{uri: photoUrl}}
                    style={tailwind`w-16 h-16 rounded-full mr-4`}
                  />
                  <View style={tailwind`flex-1`}>
                    <Text style={tailwind`text-lg font-bold`}>
                      {name} ({age})
                    </Text>
                    <Text style={tailwind`text-sm text-gray-800`}>
                      {religion}
                      {sect ? ` (${sect})` : ''} • {background}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleUnblockUser(userId)}
                  style={[
                    tailwind`mt-3 py-2 rounded-md`,
                    {backgroundColor: themeColors.primary},
                  ]}>
                  <Text style={tailwind`text-center text-white font-semibold`}>
                    Unblock
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const getAgeFromDOB = (
  dobString: string | null | undefined,
): string | number => {
  if (!dobString) return '—';
  try {
    const birthDate = new Date(dobString);
    const age = Math.floor(
      (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
    );
    return age > 0 && age < 120 ? age : '—';
  } catch {
    return '—';
  }
};

export default BlockedUserViews;
