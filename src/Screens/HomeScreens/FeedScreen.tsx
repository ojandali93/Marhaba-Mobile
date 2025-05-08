import {useNavigation} from '@react-navigation/native';
import axios, {all} from 'axios';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import FeedProfileComponent from '../../Components/Profiles/FeedProfileComponent';
import {Check, Heart, UserX} from 'react-native-feather';
import {useProfile} from '../../Context/ProfileContext';
import TutorialModal from '../../Components/Modals/TutorialModal';

const FeedScreen = () => {
  const navigation = useNavigation();
  const {
    checkAuthenticated,
    grabUserMatches,
    grabUserProfile,
    userId,
    allProfiles,
    profile,
    removeJwtToken,
    removeProfile,
    removeSession,
    removeUserId,
  } = useProfile();

  const [selectedProfile, setSelectedProfile] = useState<any>(allProfiles[0]);
  const [results, setResults] = useState<any[]>(allProfiles);
  const [tier, setTier] = useState<number | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [superLikes, setSuperLikes] = useState<number>(0);
  const [showFullProfile, setShowFullProfile] = useState<boolean>(false);
  const [matchedProfile, setMatchedProfile] = useState<any>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useLayoutEffect(() => {
    grabUserMatches();
    fetchUsage();
  }, []);

  useEffect(() => {
    if (profile?.tutorial) {
      setShowTutorial(true);
    } else {
      setShowTutorial(false);
    }
  }, [profile]);

  useEffect(() => {
    if (allProfiles && allProfiles.length > 0) {
      setResults(allProfiles);
      setSelectedProfile(allProfiles[0]);
    }
  }, [allProfiles]);

  const handleToggleTutorial = () => {
    setShowTutorial(!showTutorial);
  };

  const handleToggleFullProfile = () => {
    setShowFullProfile(!showFullProfile);
  };

  const updateMatchStatus = async (interactionId: number) => {
    try {
      await axios.put(`https://marhaba-server.onrender.com/api/user/approved`, {
        id: interactionId,
      });
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
    } catch (error) {
      console.error(`❌ Error creating conversation with ${profileId}:`, error);
    }
  };

  const fetchUsage = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `https://marhaba-server.onrender.com/api/user/weeklyStats/${userId}`,
      );
      const {likesSentThisWeek, superLikesSentThisWeek} = res.data.data;

      if (profile?.tier) {
        let maxLikes = 10;
        let maxSuperLikes = 5;

        switch (profile.tier) {
          case 1:
            maxLikes = 15;
            maxSuperLikes = 10;
            break;
          case 2:
            maxLikes = 100; // 100 = ∞
            maxSuperLikes = 15;
            break;
          case 3:
            maxLikes = 100; // 100 = ∞
            maxSuperLikes = 20;
            break;
        }

        setLikes(
          maxLikes === 100 ? 100 : Math.max(0, maxLikes - likesSentThisWeek),
        );
        setSuperLikes(
          maxSuperLikes === 100
            ? 100
            : Math.max(0, maxSuperLikes - superLikesSentThisWeek),
        );
      }
    } catch (error) {
      console.error('❌ Failed to fetch usage:', error);
    }
  };

  const dislikeProfile = async (profileId: string) => {
    createViewed(profileId);
    removeTopProfile();
  };

  const likeProfile = async (profileId: string, profile: any) => {
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
              userId: userId,
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
          createViewed(profileId);
          fetchUsage();
          removeTopProfile();
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
          createViewed(profileId);
          fetchUsage();
          removeTopProfile();
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

  const logout = async () => {
    try {
      removeSession();
      removeUserId();
      removeProfile();
      checkAuthenticated();
    } catch (err) {
      console.error('❌ Logout exception:', err);
    }
  };

  return (
    <View
      style={[
        tailwind`w-full h-full`,
        {backgroundColor: themeColors.secondary},
      ]}>
      {!showFullProfile && (
        <View
          style={tailwind`absolute w-full flex flex-row justify-end z-10 top-18 px-6`}>
          <View
            style={[
              tailwind`flex-row items-center p-2.5 py-2 rounded-2`,
              {
                backgroundColor: themeColors.secondary,
                borderWidth: 1,
                borderColor: themeColors.primary, // ✅ green border
              },
            ]}>
            {superLikes !== null && (
              <View style={tailwind`flex-row items-center`}>
                <Heart
                  height={16}
                  width={16}
                  color={themeColors.primary}
                  strokeWidth={3}
                />
                <Text style={tailwind`ml-1 text-xl font-bold`}>
                  {superLikes === 100 ? '∞' : superLikes}
                </Text>
              </View>
            )}
            {likes !== null && (
              <View style={tailwind`flex-row items-center`}>
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
            )}
          </View>
        </View>
      )}
      <FeedProfileComponent
        profile={selectedProfile}
        dislikeProfile={dislikeProfile}
        likeProfile={likeProfile}
        superlikeProfile={superLikeProfile}
        showFullProfile={showFullProfile}
        setShowFullProfile={setShowFullProfile}
        handleToggleFullProfile={handleToggleFullProfile}
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
        onClose={() => {
          handleToggleTutorial(); // Save to avoid showing again
        }}
      />
    </View>
  );
};

export default FeedScreen;
