import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import FeedProfileComponent from '../../Components/Profiles/FeedProfileComponent';
import {Check, Heart} from 'react-native-feather';
import {useProfile} from '../../Context/ProfileContext';
import TutorialModal from '../../Components/Modals/TutorialModal';

const FeedScreen = () => {
  const navigation = useNavigation();
  const {
    profile,
    userId,
    allProfiles,
    removeSession,
    removeUserId,
    removeProfile,
    checkAuthenticated,
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

  // useEffect(() => {
  //   if (profile?.Preferences) {
  //     fetchPotentialMatches();
  //   }
  // }, [profile, userId]);

  useEffect(() => {
    if (profile?.tier !== undefined && userId) {
      fetchUsage();
    }
    if (profile?.Preferences && userId) {
      fetchPotentialMatches();
    }
  }, [profile, userId, profile?.Preferences]);

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

  const fetchPotentialMatches = async () => {
    console.log('fetching potential matches');
    console.log('profile: ', profile);
    console.log('userId: ', userId);
    if (!profile || !userId) return;

    const preferences = profile.Preferences?.[0];
    const lat = profile?.latitude;
    const lng = profile?.longitude;

    const distanceMap = {
      'Close (50 miles)': 50,
      'Nearby (100 miles)': 100,
      'Far (250 miles)': 250,
      'Everywhere (1000+ miles)': 1000,
    };

    const distanceValue = distanceMap[preferences.distance] || 50;

    try {
      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/user/getMatches',
        {
          userId,
          ageMin: preferences.ageMin,
          ageMax: preferences.ageMax,
          gender: preferences.gender,
          background: parseCommaSeparated(preferences.background),
          religion: parseCommaSeparated(preferences.religion),
          sect: parseCommaSeparated(preferences.sect),
          distance: distanceValue,
          latitude: lat,
          longitude: lng,
        },
      );

      console.log('response.data: ', response.data);

      if (response.data?.success) {
        setResults(response.data.matches);
        setSelectedProfile(response.data.matches[0] || null);
      }
    } catch (err) {
      console.error('❌ Error fetching potential matches:', err);
    }
  };

  const parseCommaSeparated = (value: string | null | undefined): string[] => {
    if (!value || typeof value !== 'string') return [];
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  };

  const fetchUsage = async () => {
    if (!userId || profile?.tier === undefined || profile?.tier === null)
      return;

    try {
      const res = await axios.get(
        `https://marhaba-server.onrender.com/api/user/weeklyStats/${userId}`,
      );
      const {likesSentThisWeek, superLikesSentThisWeek} = res.data.data;

      let maxLikes = 10;
      let maxSuperLikes = 5;

      switch (profile.tier) {
        case 1:
          maxLikes = 15;
          maxSuperLikes = 10;
          break;
        case 2:
          maxLikes = 100;
          maxSuperLikes = 15;
          break;
        case 3:
          maxLikes = 100;
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
    } catch (error) {
      console.error('❌ Failed to fetch usage:', error);
    }
  };

  const removeTopProfile = () => {
    setResults(prev => {
      const next = prev.slice(1);
      setSelectedProfile(next[0] || null);
      return next;
    });
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
                borderColor: themeColors.primary,
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
        dislikeProfile={() => removeTopProfile()}
        likeProfile={() => removeTopProfile()}
        superlikeProfile={() => removeTopProfile()}
        showFullProfile={showFullProfile}
        setShowFullProfile={setShowFullProfile}
        handleToggleFullProfile={() => setShowFullProfile(!showFullProfile)}
      />
      <TutorialModal
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </View>
  );
};

export default FeedScreen;
