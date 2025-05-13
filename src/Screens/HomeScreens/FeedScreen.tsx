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
import {getDistance} from 'geolib'; // ✅ import geolib for distance

const FeedScreen = () => {
  const navigation = useNavigation();
  const {grabUserMatches, grabUserProfile, userId, allProfiles, profile} =
    useProfile();

  const [selectedProfile, setSelectedProfile] = useState<any>(allProfiles[0]);
  const [results, setResults] = useState<any[]>(allProfiles);
  const [likes, setLikes] = useState<number>(0);
  const [superLikes, setSuperLikes] = useState<number>(0);
  const [showFullProfile, setShowFullProfile] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Calculate geodesic distance
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
    return (distanceInMeters / 1609.34).toFixed(1); // meters to miles
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
    grabUserMatches();
    fetchUsage();
  }, []);

  useEffect(() => {
    setShowTutorial(!!profile?.tutorial);
  }, [profile]);

  useEffect(() => {
    if (allProfiles?.length > 0) {
      setResults(allProfiles);
      setSelectedProfile(allProfiles[0]);
    }
  }, [allProfiles]);

  const fetchUsage = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `https://marhaba-server.onrender.com/api/user/weeklyStats/${userId}`,
      );
      const {likesSentThisWeek, superLikesSentThisWeek} = res.data.data;

      let maxLikes = 10;
      let maxSuperLikes = 5;
      switch (profile?.tier) {
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
      const newMatches = prev.slice(1);
      setSelectedProfile(newMatches[0] || null);
      return newMatches;
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
        dislikeProfile={() => removeTopProfile()}
        likeProfile={() => removeTopProfile()}
        superlikeProfile={() => removeTopProfile()}
        showFullProfile={showFullProfile}
        setShowFullProfile={setShowFullProfile}
        handleToggleFullProfile={() => setShowFullProfile(prev => !prev)}
      />

      <TutorialModal
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </View>
  );
};

export default FeedScreen;
