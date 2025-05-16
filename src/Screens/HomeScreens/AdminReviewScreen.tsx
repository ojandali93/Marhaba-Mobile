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

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AdminReviewScreen = () => {
  const {userId, profile} = useProfile();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
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
        setIsAuthenticated(true);
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
          style={tailwind`border border-gray-300 w-full mb-4 p-3 rounded`}
          secureTextEntry
        />
        <TextInput
          value={pin}
          onChangeText={setPin}
          placeholder="Enter PIN"
          keyboardType="number-pad"
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
                    {profile.Religion?.[0].religion}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Sect:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Religion?.[0].sect}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Views:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Religion?.[0].practicing || 'Not Specified'}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Smoke:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Habits?.[0].smoking}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Drink:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Habits?.[0].drinking}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Has Kids:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Habits?.[0].hasKids}
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row justify-between`}>
                  <Text>Wants Kids:</Text>
                  <Text style={tailwind`text-gray-700 mb-2`}>
                    {profile.Habits?.[0].wantsKids}
                  </Text>
                </View>
                <Text style={tailwind`font-bold text-lg py-2`}>Prompts:</Text>
                {(profile.Prompts || []).map((p, idx) => (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => toggleFlagPrompt(profile.userId, p.prompt)}>
                    <Text
                      style={tailwind`${
                        (flaggedPrompts[profile.userId] || []).includes(
                          p.prompt,
                        )
                          ? 'text-red-500 font-bold italic pb-2'
                          : 'text-gray-700  font-bold italic pb-2'
                      }`}>
                      {p.prompt}:
                    </Text>
                    <Text
                      style={tailwind`${
                        (flaggedPrompts[profile.userId] || []).includes(
                          p.prompt,
                        )
                          ? 'text-red-500 italic pb-2'
                          : 'text-gray-700 italic pb-2'
                      }`}>
                      {p.response}
                    </Text>
                  </TouchableOpacity>
                ))}
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
