import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
  Image,
  RefreshControl,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import {sha256} from 'js-sha256';
import tailwind from 'twrnc';
import {useProfile} from '../../Context/ProfileContext';
import themeColors from '../../Utils/custonColors';
import {useFocusEffect} from '@react-navigation/native';
import {track} from '@amplitude/analytics-react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const promptLabels = {
  t_who: 'Who am I?',
  t_makes_me: 'What makes me, me?',
  t_weekends: 'On weekends, you’ll usually find me…',
  t_friends: 'My friends would describe me as…',
  t_master: 'A skill I would instantly like to master is…',
  t_make_time: 'One thing I always make time for is…',
  t_daily: 'My daily rituals include…', // You didn’t list this one, placeholder text
  t_love: 'When it comes to love, I believe…',
  t_faith: 'Faith and values play a role in my life...',
  t_appreciate: 'I appreciate when someone…',
  t_lifestyle: 'The lifestyle I’m building includes…',
  t_refuse: 'A value I refuse to compromise on is…',
  t_show: 'When I care about someone…',
  t_grow: 'I’ve grown the most through…',
  t_life: 'I feel most at peace when…',
  t_moment: 'One moment that shaped how I love is…',
  t_deepl: 'I feel deeply connected to people when…',
  t_partner: 'The kind of partner I strive to be is…',
  t_lifelong: 'What I want most in a lifelong partnership is…',
};

const AdminReviewScreen = () => {
  const {userId, profile} = useProfile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [pin, setPin] = useState('');
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [notes, setNotes] = useState({});
  const [flaggedImages, setFlaggedImages] = useState({});
  const [flaggedPrompts, setFlaggedPrompts] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsAuthenticated(false);
        setExpandedIds({});
        setPassphrase('');
        setPin('');
        setNotes({});
        setFlaggedImages({});
        setFlaggedPrompts({});
      };
    }, []),
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingProfiles();
    }
  }, [isAuthenticated]);

  const fetchPendingProfiles = async () => {
    try {
      const res = await axios.get(
        `https://marhaba-server.onrender.com/api/admin/pendingProfiles`,
      );
      console.log('selected profile: ', JSON.stringify(res.data.data));
      setPendingProfiles(res.data.data);
    } catch (err) {
      console.error('❌ Error fetching profiles:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPendingProfiles();
    setRefreshing(false);
  };

  const verifyAccess = async () => {
    try {
      const hashedPhrase = sha256(passphrase);
      const hashedPin = sha256(pin);
      if (profile.passHash === hashedPhrase && profile.pinHash === hashedPin) {
        setIsAuthenticated(true);
      } else {
        Alert.alert('Access Denied', 'Incorrect passphrase or pin');
      }
    } catch (err) {
      console.error('❌ Error verifying admin:', err);
    }
  };

  const toggleExpand = id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds(prev => {
      const isExpanding = !prev[id];
      if (!isExpanding) {
        setFlaggedImages(prevImgs => ({...prevImgs, [id]: []}));
        setFlaggedPrompts(prevPrs => ({...prevPrs, [id]: []}));
      }
      return {...prev, [id]: isExpanding};
    });
  };

  const toggleFlagPhoto = (profileId, url) => {
    track(`Flagged photo for user: ${profileId}`, {
      targetUserId: userId,
    });
    const stringId = String(profileId);
    setFlaggedImages(prev => {
      const existing = prev[stringId] || [];
      const updated = existing.includes(url)
        ? existing.filter(i => i !== url)
        : [...existing, url];
      return {...prev, [stringId]: updated};
    });
  };

  const toggleFlagPrompt = (profileId, promptText) => {
    track(`Flagged prompt for user: ${profileId}`, {
      targetUserId: userId,
    });
    const stringId = String(profileId);
    setFlaggedPrompts(prev => {
      const existing = prev[stringId] || [];
      const updated = existing.includes(promptText)
        ? existing.filter(p => p !== promptText)
        : [...existing, promptText];
      return {...prev, [stringId]: updated};
    });
  };

  const handleApprove = async (userId, profile) => {
    track(`Approved profile: ${userId}`, {
      targetUserId: userId,
    });
    console.log('Profile:', JSON.stringify(profile));
    const profileToken = profile.apnToken;
    console.log('Profile Token:', profileToken);

    try {
      await axios.post(
        `https://marhaba-server.onrender.com/api/admin/approveProfile`,
        {userId},
      );

      if (profileToken) {
        try {
          await axios.post(
            'https://marhaba-server.onrender.com/api/notifications/send',
            {
              token: profileToken,
              title: 'Account Approved!',
              body: 'Your Marhabah profile has been approved. You can now start matching!',
            },
          );
          console.log('📤 Approval notification sent');
        } catch (notificationError) {
          console.error(
            '❌ Failed to send approval notification:',
            notificationError,
          );
        }
      } else {
        console.warn('⚠️ No APNs token available for this profile');
      }

      Alert.alert('Approved');
      fetchPendingProfiles();
    } catch (err) {
      console.error('❌ Error approving profile:', err);
    }
  };

  const handleReject = async (profileId: string, profile: any) => {
    track(`Rejected profile: ${profileId}`, {
      targetUserId: userId,
    });
    const idKey = String(profileId);

    console.log('🔴 Notes:', notes);
    console.log('🔴 Flagged Images:', flaggedImages);
    console.log('🔴 Flagged Prompts:', flaggedPrompts);
    console.log('Profile:', JSON.stringify(profile));
    const profileToken = profile.apnToken;
    console.log('Profile Token:', profileToken);

    const flaggedPhotosArray = flaggedImages?.[idKey] ?? [];
    const flaggedPromptsArray = flaggedPrompts?.[idKey] ?? [];

    try {
      await axios.post(
        `https://marhaba-server.onrender.com/api/admin/rejectProfile`,
        {
          userId: idKey,
          note: notes?.[idKey] ?? '',
          flaggedPhotos:
            flaggedPhotosArray.length > 0
              ? flaggedPhotosArray.join(', ')
              : null,
          flaggedPrompts:
            flaggedPromptsArray.length > 0
              ? flaggedPromptsArray.join(', ')
              : null,
        },
      );
      if (profileToken) {
        try {
          await axios.post(
            'https://marhaba-server.onrender.com/api/notifications/send',
            {
              token: profileToken,
              title: 'Account Rejected!',
              body: 'Your Marhabah profile requires some changes. Please update and resubmit!',
            },
          );
          console.log('📤 Rejection notification sent');
        } catch (notificationError) {
          console.error(
            '❌ Failed to send approval notification:',
            notificationError,
          );
        }
      } else {
        console.warn('⚠️ No APNs token available for this profile');
      }
      Alert.alert('Rejected');
      setPendingProfiles([]);
      fetchPendingProfiles();
    } catch (err) {
      console.error('❌ Error rejecting profile:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={tailwind`flex-1 justify-center items-center bg-white px-6`}>
        <Text style={tailwind`text-xl font-bold mb-4`}>Admin Access</Text>
        <TextInput
          value={passphrase}
          onChangeText={setPassphrase}
          placeholder="Enter Passphrase"
          placeholderTextColor={themeColors.primary}
          style={tailwind`border border-gray-300 w-full mb-4 p-3 rounded`}
          secureTextEntry
        />
        <TextInput
          value={pin}
          onChangeText={setPin}
          placeholder="Enter PIN"
          keyboardType="number-pad"
          placeholderTextColor={themeColors.primary}
          style={tailwind`border border-gray-300 w-full mb-4 p-3 rounded`}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={verifyAccess}
          style={tailwind`bg-blue-600 px-6 py-3 rounded`}>
          <Text style={tailwind`text-white text-base font-semibold`}>
            Unlock
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const promptRow = profile.Prompts?.[0] || {};

  return (
    <View style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <View
        style={[
          tailwind`w-full flex flex-row items-center justify-between p-4 rounded-2 mb-3 mt-16`,
          {backgroundColor: themeColors.secondary},
        ]}>
        <Text style={tailwind`text-2xl font-bold text-gray-800`}>
          Review Accounts
        </Text>
      </View>
      <ScrollView
        style={tailwind`flex-1 mb-24`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {pendingProfiles.map(profile => (
          <View
            key={profile.id}
            style={tailwind`mb-4 border rounded p-3 border-gray-300`}>
            <TouchableOpacity onPress={() => toggleExpand(profile.id)}>
              <Text style={tailwind`text-lg font-semibold`}>
                {profile.name}{' '}
                {profile.approved === 'resubmit' ? '(Resubmitted)' : null}
              </Text>
            </TouchableOpacity>
            {expandedIds[profile.id] && (
              <View style={tailwind`mt-3`}>
                <Text style={tailwind`font-bold text-lg`}>Overall Notes:</Text>
                <TextInput
                  placeholder="Add rejection reason..."
                  value={notes[profile.id] || ''}
                  onChangeText={text =>
                    setNotes(prev => ({...prev, [profile.id]: text}))
                  }
                  style={tailwind`border mt-3 border-gray-300 p-2 rounded mb-3`}
                />
                <Text style={tailwind`font-bold text-lg`}>About:</Text>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>UserId:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.userId}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Looking For:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Intent?.[0].intentions}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Timeline:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Intent?.[0].timeline}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Travel:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Intent?.[0].relocate}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Background:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.About?.[0].background}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Religion:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Religion[0]?.religion}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Sect:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Religion[0]?.sect}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Views:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Religion[0]?.practicing || 'Not Specified'}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Smoke:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Habits[0]?.smoking}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Drink:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Habits[0]?.drinking}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Has Kids:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Habits[0]?.hasKids}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Wants Kids:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Habits[0]?.wantsKids}
                  </Text>
                </View>
                <Text style={tailwind`font-bold text-lg py-2`}>Prompts:</Text>
                {Object.entries(promptLabels).map(([key, label]) => {
                  const response = promptRow[key];

                  // Skip if no response
                  if (!response) return null;

                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => toggleFlagPrompt(profile.userId, key)}
                      style={tailwind`mb-2`}>
                      <Text
                        style={tailwind`${
                          (flaggedPrompts[profile.userId] || []).includes(key)
                            ? 'text-red-500 font-bold italic'
                            : 'text-gray-700 font-bold italic'
                        }`}>
                        {label}
                      </Text>
                      <Text
                        style={tailwind`${
                          (flaggedPrompts[profile.userId] || []).includes(key)
                            ? 'text-red-500 italic'
                            : 'text-gray-700 italic'
                        }`}>
                        {response}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <Text style={tailwind`font-bold text-lg py-2`}>Photos:</Text>
                <View style={tailwind`flex-row flex-wrap justify-between`}>
                  {(profile.Photos || []).map((p, idx) => (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() =>
                        toggleFlagPhoto(profile.userId, p.photoUrl)
                      }
                      style={tailwind`w-1/3 p-1`}>
                      <Image
                        source={{uri: p.photoUrl}}
                        style={[
                          tailwind`w-full h-48 rounded`,
                          (flaggedImages[profile.userId] || []).includes(
                            p.photoUrl,
                          ) && {
                            borderColor: 'red',
                            borderWidth: 2,
                          },
                        ]}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={tailwind`flex-row justify-between mt-3`}>
                  <TouchableOpacity
                    onPress={() => handleApprove(profile.userId, profile)}
                    style={tailwind`bg-green-600 px-4 py-2 rounded`}>
                    <Text style={tailwind`text-white`}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleReject(profile.userId, profile)}
                    style={tailwind`bg-red-600 px-4 py-2 rounded`}>
                    <Text style={tailwind`text-white`}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AdminReviewScreen;
