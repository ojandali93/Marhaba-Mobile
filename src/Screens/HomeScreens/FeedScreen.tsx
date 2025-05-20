import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import FeedProfileComponent from '../../Components/Profiles/FeedProfileComponent';
import {Check, Heart} from 'react-native-feather';
import {useProfile} from '../../Context/ProfileContext';
import TutorialModal from '../../Components/Modals/TutorialModal';
import {getDistance} from 'geolib';

const FeedScreen = () => {
  const navigation = useNavigation();
  const {
    grabUserMatches,
    grabUserProfile,
    userId,
    profile,
    matchedProfiles,
    setMatchedProfiles,
  } = useProfile();

  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<number>(0);
  const [superLikes, setSuperLikes] = useState<number>(0);
  const [showFullProfile, setShowFullProfile] = useState<boolean>(false);
  const [showMatchModal, setShowMatchModal] = useState<boolean>(false);
  const [matchedProfile, setMatchedProfile] = useState<any>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const getDistanceInMiles = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const distanceInMeters = getDistance(
      {latitude: lat1, longitude: lon1},
      {latitude: lat2, longitude: lon2},
    );
    return (distanceInMeters / 1609.34).toFixed(1);
  };

  const distance =
    selectedProfile?.latitude &&
    selectedProfile?.longitude &&
    profile?.latitude &&
    profile?.longitude
      ? getDistanceInMiles(
          profile.latitude,
          profile.longitude,
          selectedProfile.latitude,
          selectedProfile.longitude,
        )
      : null;

  useLayoutEffect(() => {
    grabUserProfile(userId || '');
    fetchUsage();
  }, []);

  useEffect(() => {
    if (profile) {
      (async () => {
        setLoading(true);
        await grabUserMatches();
        setLoading(false);
      })();
    }
  }, [profile]);

  const handleToggleFullProfile = () => {
    setShowFullProfile(!showFullProfile);
  };

  useEffect(() => {
    setShowTutorial(!!profile?.tutorial);
  }, [profile]);

  useEffect(() => {
    if (matchedProfiles?.length > 0) {
      setResults(matchedProfiles);
      setSelectedProfile(matchedProfiles[0]);
    } else {
      setResults([]);
      setSelectedProfile(null);
    }
  }, [matchedProfiles]);

  const updateMatchStatus = async (interactionId: number) => {
    try {
      await axios.put(`https://marhaba-server.onrender.com/api/user/approved`, {
        id: interactionId,
      });
      console.log(`✅ Approved match`);
    } catch (error) {
      console.error(`❌ Error approving match:`, error);
    }
  };

  const createConversation = async (profileId: string) => {
    try {
      await axios.post(
        `https://marhaba-server.onrender.com/api/conversation/create`,
        {
          userId: userId,
          userId2: profileId,
          lastMessage: '',
          updatedAt: new Date().toISOString(),
        },
      );
      console.log(`✅ Created conversation with ${profileId}`);
    } catch (error) {
      console.error(`❌ Error creating conversation with ${profileId}:`, error);
    }
  };

  const createViewed = async (profileId: string) => {
    try {
      await axios.post(
        `https://marhaba-server.onrender.com/api/viewed/create`,
        {
          viewer: userId,
          viewed: profileId,
        },
      );
      console.log(`✅ Created viewed with ${profileId}`);
    } catch (error) {
      console.error(`❌ Error creating conversation with ${profileId}:`, error);
    }
  };

  const fetchUsage = async () => {
    if (!userId) return;
    try {
      let maxLikes = 15;
      let maxSuperLikes = 10;
      const res = await axios.get(
        `https://marhaba-server.onrender.com/api/user/weeklyStats/${userId}`,
      );
      const {likesSentThisWeek, superLikesSentThisWeek} = res.data.data;

      if (profile?.tier === 1) {
        maxLikes = 15;
        maxSuperLikes = 10;
        setLikes(Math.max(0, maxLikes - likesSentThisWeek));
        setSuperLikes(Math.max(0, maxSuperLikes - superLikesSentThisWeek));
      } else if (profile?.tier === 2) {
        maxSuperLikes = 15;
        setLikes(100);
        setSuperLikes(Math.max(0, maxSuperLikes - superLikesSentThisWeek));
      } else if (profile?.tier === 3) {
        maxSuperLikes = 20;
        setLikes(100);
        setSuperLikes(Math.max(0, maxSuperLikes - superLikesSentThisWeek));
      }
    } catch (error) {
      console.error('❌ Failed to fetch usage:', error);
    }
  };

  const dislikeProfile = async (profileId: string) => {
    console.log(`disliked profile: ${profileId}`);
    createViewed(profileId);
    removeTopProfile();
  };

  const likeProfile = async (profileId: string, profile: any) => {
    console.log(`likes: ${likes}`);
    if (likes === 0) {
      Alert.alert('Out of Likes', 'Upgrade to Pro to get more!', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Upgrade',
          onPress: () => navigation.navigate('Profiles'),
        },
      ]);
      return;
    } else if (likes && likes > 0) {
      console.log(`likes: ${likes}`);
      setLikes(prev => (prev ? prev - 1 : null));

      try {
        const checkRes = await axios.get(
          `https://marhaba-server.onrender.com/api/user/matchStatus/${userId}/${profileId}`,
        );

        const existingInteraction = checkRes.data?.data[0];

        if (existingInteraction) {
          const updatedRes = await axios.put(
            `https://marhaba-server.onrender.com/api/user/updateInteraction`,
            {
              id: existingInteraction.id,
              userId: existingInteraction.userId,
              targetUserId: existingInteraction.targetUserId,
              userInteraction: existingInteraction.userInteraction,
              targetInteraction: 'liked',
              viewed: true,
              approved: true,
              viewed_at: new Date().toISOString(),
              approved_at: new Date().toISOString(),
              message: null,
            },
          );

          updateMatchStatus(existingInteraction.id);
          createConversation(profileId);
          setMatchedProfile(profile);
          setShowMatchModal(true);
          const notificationsProfile = profile.Notifications[0];
          if (notificationsProfile.matches) {
            try {
              await axios.post(
                'https://marhaba-server.onrender.com/api/notifications/send',
                {
                  token: profile.apnToken, // this is the *receiver* of the like
                  title: 'New Match!',
                  body: 'You have a new match!',
                },
              );
              console.log('📤 Notification sent to liked profile');
            } catch (err) {
              console.error('❌ Failed to send push notification:', err);
            }
          }
          return;
        }

        const response = await axios.post(
          `https://marhaba-server.onrender.com/api/user/interaction`,
          {
            userId: userId,
            targetUserId: profileId,
            userInteraction: 'liked',
            targetInteraction: null,
            viewed: false,
            approved: false,
            viewed_at: null,
            approved_at: null,
            message: null,
          },
        );

        if (response.data?.success) {
          console.log(`✅ Liked profile: ${profile.apnToken}`);
          createViewed(profileId);
          fetchUsage();
          removeTopProfile();
          const notificationsProfile = profile.Notifications[0];
          if (notificationsProfile.likes) {
            try {
              await axios.post(
                'https://marhaba-server.onrender.com/api/notifications/send',
                {
                  token: profile.apnToken, // this is the *receiver* of the like
                  title: 'New Like!',
                  body: 'Someone liked your profile!',
                },
              );
              console.log('📤 Notification sent to liked profile');
            } catch (err) {
              console.error('❌ Failed to send push notification:', err);
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error liking profile ${profileId}:`, error);
      }
    }
  };

  const superLikeProfile = async (
    profileId: string,
    message?: string,
    profile: any,
  ) => {
    if (superLikes === 0) {
      Alert.alert('Out of Super Likes', 'Upgrade to Pro to get more!', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Upgrade',
          onPress: () => navigation.navigate('Profiles'),
        },
      ]);
      return;
    } else if (superLikes > 0) {
      setSuperLikes(prev => (prev ? prev - 1 : null));

      try {
        const checkRes = await axios.get(
          `https://marhaba-server.onrender.com/api/user/matchStatus/${userId}/${profileId}`,
        );

        const existingInteraction = checkRes.data?.data[0];

        if (existingInteraction) {
          const updatedRes = await axios.put(
            `https://marhaba-server.onrender.com/api/user/updateInteraction`,
            {
              id: existingInteraction.id,
              userId: existingInteraction.userId,
              targetUserId: existingInteraction.targetUserId,
              userInteraction: existingInteraction.userInteraction,
              targetInteraction: 'super',
              viewed: true,
              approved: true,
              viewed_at: new Date().toISOString(),
              approved_at: new Date().toISOString(),
              message: message,
            },
          );

          updateMatchStatus(existingInteraction.id);
          createConversation(profileId);
          setMatchedProfile(profile);
          setShowMatchModal(true);
          const notificationsProfile = profile.Notifications[0];
          if (notificationsProfile.matches) {
            try {
              await axios.post(
                'https://marhaba-server.onrender.com/api/notifications/send',
                {
                  token: profile.apnToken, // this is the *receiver* of the like
                  title: 'New Match!',
                  body: 'You have a new match!',
                },
              );
              console.log('📤 Notification sent to liked profile');
            } catch (err) {
              console.error('❌ Failed to send push notification:', err);
            }
          }
          removeTopProfile();
          return;
        }

        const response = await axios.post(
          `https://marhaba-server.onrender.com/api/user/interaction`,
          {
            userId: userId,
            targetUserId: profileId,
            userInteraction: 'super',
            targetInteraction: null,
            viewed: false,
            approved: false,
            viewed_at: null,
            approved_at: null,
            message: message,
          },
        );

        if (response.data?.success) {
          console.log(`✅ Super liked profile: ${profileId}`);
          createViewed(profileId);
          fetchUsage();
          removeTopProfile();
          const notificationsProfile = profile.Notifications[0];
          if (notificationsProfile.likes) {
            try {
              await axios.post(
                'https://marhaba-server.onrender.com/api/notifications/send',
                {
                  token: profile.apnToken, // this is the *receiver* of the like
                  title: 'New Super Like!',
                  body: 'Someone super liked your profile!',
                },
              );
              console.log('📤 Notification sent to liked profile');
            } catch (err) {
              console.error('❌ Failed to send push notification:', err);
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error super liking profile ${profileId}:`, error);
      }
    }
  };

  const removeTopProfile = () => {
    setResults(prevMatches => {
      const newMatches = prevMatches?.length ? prevMatches.slice(1) : [];
      setSelectedProfile(newMatches[0] || null); // ✅ Update the selected profile
      return newMatches;
    });
  };

  if (loading) {
    return (
      <View
        style={[
          tailwind`flex-1 justify-center items-center`,
          {backgroundColor: themeColors.secondary},
        ]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={tailwind`text-white mt-4 text-lg`}>
          Finding matches...
        </Text>
      </View>
    );
  }

  if (!selectedProfile) {
    return (
      <View
        style={[
          tailwind`flex-1 justify-center items-center px-6`,
          {backgroundColor: themeColors.secondary},
        ]}>
        <View style={tailwind`w-1/2`}>
          <Text style={tailwind`text-black text-xl text-center`}>
            No more suggested matches were found. Come back later!
          </Text>
        </View>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Filters')}
          style={tailwind`mt-4 bg-white px-4 py-2 rounded-md`}>
          <Text style={tailwind`text-black font-semibold`}>
            Adjust Preferences
          </Text>
        </TouchableOpacity> */}
      </View>
    );
  }

  return (
    <View
      style={[
        tailwind`w-full h-full`,
        {backgroundColor: themeColors.secondary},
      ]}>
      {!showFullProfile && (
        <View
          style={tailwind`absolute w-full flex-row justify-between items-center px-6 z-10 top-18`}>
          <View
            style={[
              tailwind`flex-row items-center p-2.5 py-2 rounded-2`,
              {
                backgroundColor: themeColors.secondary,
                borderWidth: 1,
                borderColor: themeColors.primary,
              },
            ]}>
            <Heart
              height={16}
              width={16}
              color={themeColors.primary}
              strokeWidth={3}
            />
            <Text style={tailwind`ml-1 text-xl font-bold`}>
              {superLikes === 100 ? '∞' : superLikes}
            </Text>
            <Check
              height={18}
              width={18}
              color={themeColors.primary}
              strokeWidth={3}
              style={tailwind`ml-3`}
            />
            <Text style={tailwind`ml-1 text-xl font-bold`}>
              {likes === 100 ? '∞' : likes}
            </Text>
          </View>
          {distance && (
            <View
              style={[
                tailwind`p-2.5 py-2 rounded-2`,
                {
                  backgroundColor: themeColors.secondary,
                  borderWidth: 1,
                  borderColor: themeColors.primary,
                },
              ]}>
              <Text style={tailwind`text-base font-semibold`}>
                {distance} mi away
              </Text>
            </View>
          )}
        </View>
      )}

      <FeedProfileComponent
        profile={selectedProfile}
        dislikeProfile={dislikeProfile}
        likeProfile={likeProfile}
        superlikeProfile={superLikeProfile}
        showFullProfile={showFullProfile}
        setShowFullProfile={setShowFullProfile}
        handleToggleFullProfile={() => setShowFullProfile(prev => !prev)}
      />

      <Modal
        transparent
        visible={showMatchModal}
        animationType="fade"
        onRequestClose={() => setShowMatchModal(false)}>
        <View
          style={tailwind`flex-1 bg-black bg-opacity-60 justify-center items-center px-6`}>
          <View
            style={[
              tailwind`rounded-lg p-5 items-center justify-center h-9/12 w-full`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <Text style={tailwind`text-4xl font-bold text-green-800 mb-2`}>
              You & {matchedProfile?.name}
            </Text>
            <Text style={tailwind`text-3xl font-bold text-green-800 mb-2`}>
              Connected!
            </Text>
            {matchedProfile?.Photos?.[0]?.photoUrl && (
              <Image
                source={{uri: matchedProfile.Photos[0].photoUrl}}
                style={tailwind`w-11/12 h-7/12 rounded-8 mb-4`}
              />
            )}
            <Text style={tailwind`text-base text-center`}>
              You and {matchedProfile?.name} have liked each other!
            </Text>
            <Text style={tailwind`text-base mb-4 text-center`}>
              You can now start a conversation!
            </Text>
            <View style={tailwind`flex-col justify-between w-full`}>
              <TouchableOpacity
                onPress={() => {
                  setShowMatchModal(false);
                  removeTopProfile();
                  navigation.navigate('Conversations'); // <-- Use the name of your Messages tab here
                }}
                style={tailwind`bg-green-700 px-4 py-4 rounded-md`}>
                <Text
                  style={tailwind`text-white text-center font-semibold text-base`}>
                  Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowMatchModal(false);
                  removeTopProfile(); // go to next profile
                }}
                style={tailwind`p-4 rounded-md`}>
                <Text
                  style={tailwind`text-black text-center font-semibold text-base`}>
                  Next Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TutorialModal
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </View>
  );
};

export default FeedScreen;
