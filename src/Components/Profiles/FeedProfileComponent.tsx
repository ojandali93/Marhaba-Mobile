import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
  Linking,
  SafeAreaView,
} from 'react-native';
import tailwind from 'twrnc';
import {
  X,
  ChevronsDown,
  ChevronsUp,
  Video,
  Lock,
  Play,
  Pause,
} from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import {countryFlagMap} from '../../Utils/FlagMaps';
import SingleInfoFull from '../Info/SingleInfoFull';
import {useNavigation} from '@react-navigation/native';
import {useProfile} from '../../Context/ProfileContext';
import axios from 'axios';
import {calculateCompatibility} from '../../Utils/Functions/Comptability';
import {track} from '@amplitude/analytics-react-native';
import {getDistance} from 'geolib';
import {getSharedSimilarities} from '../../Utils/Functions/Simlarities';
import RNVideo from 'react-native-video';

interface LoveLanguage {
  language: string;
}

interface Prompt {
  prompt: string;
  response?: string;
}

interface FeedSummaryProps {
  profile: any;
  dislikeProfile: (profileId: string, reason: string) => void;
  likeProfile: (profileId: string, profile: any, reason: string) => void;
  isInteracting?: boolean;
  showFullProfile: boolean;
  setShowFullProfile: (showFullProfile: boolean) => void;
}

const FeedProfileComponent: React.FC<FeedSummaryProps> = ({
  profile,
  dislikeProfile,
  likeProfile,
  isInteracting = false,
  showFullProfile,
  setShowFullProfile,
}) => {
  const {userId, profile: userProfile} = useProfile();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [superlikeMessage, setSuperlikeMessage] = useState('');
  const [photoIndex, setPhotoIndex] = useState(0);

  const [showReportBlockModal, setShowReportBlockModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState<'like' | 'dislike' | ''>('');
  const [selectedDecisionReason, setSelectedDecisionReason] = useState('');
  const [customDecisionReason, setCustomDecisionReason] = useState('');

  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!profile) return null;

  function limitString(input: string, maxLength = 12): string {
    if (!input) return '';
    return input.length > maxLength
      ? input.slice(0, maxLength).trim() + '...'
      : input;
  }

  const PLACEHOLDER = '—';

  const user = profile.user2Profile;
  const profileId = profile.user2Profile.userId;
  const similarities = getSharedSimilarities(userProfile, user);
  const about =
    Array.isArray(user?.About) && user.About.length > 0 ? user.About[0] : {};
  const career =
    Array.isArray(user?.Career) && user.Career.length > 0 ? user.Career[0] : {};
  const core =
    Array.isArray(user?.Core) && user.Core.length > 0 ? user.Core[0] : {};
  const future =
    Array.isArray(user?.Future) && user.Future.length > 0 ? user.Future[0] : {};
  const habits =
    Array.isArray(user?.Habits) && user.Habits.length > 0 ? user.Habits[0] : {};
  const intentions =
    Array.isArray(user?.Intent) && user.Intent.length > 0 ? user.Intent[0] : {};
  const photos = Array.isArray(user?.Photos) ? user.Photos : [];
  const preferences =
    Array.isArray(user?.Preferences) && user.Preferences.length > 0
      ? user.Preferences[0]
      : {};

  const prompts = Array.isArray(user?.Prompts) ? user.Prompts[0] : [];
  const relationships =
    Array.isArray(user?.Relationships) && user.Relationships.length > 0
      ? user.Relationships[0]
      : {};
  const religion =
    Array.isArray(user?.Religion) && user.Religion.length > 0
      ? user.Religion[0]
      : {};
  const survey =
    Array.isArray(user?.Survey) && user.Survey.length > 0 ? user.Survey[0] : {};
  const tags = Array.isArray(user?.Tags) ? user.Tags : [];
  const socials = user?.Social ?? {};
  const age = about?.dob ? getAgeFromDOB(about.dob) : '—';

  let background = [];
  try {
    background = about?.background ? JSON.parse(about.background) : [];
  } catch (e) {
    background = [];
  }

  let loveLanguages = [];
  try {
    loveLanguages = relationships?.loveLanguages
      ? JSON.parse(relationships.loveLanguages)
      : [];
  } catch (e) {
    loveLanguages = [];
  }

  const photoUrl = photos?.[photoIndex]?.photoUrl;

  const handleImageTap = () => {
    if (photos.length <= 1) return;
    setPhotoIndex(prev => (prev + 1) % photos.length);
  };

  const handleLikeProfile = () => {
    if (!profileId || isInteracting) {
      console.warn('Cannot like profile');
      return;
    }
    setDecisionType('like');
    setShowDecisionModal(true); // 👈 Show modal first
  };

  const handleDislikeProfile = () => {
    if (!profileId || isInteracting) {
      console.warn('Cannot dislike profile');
      return;
    }
    setDecisionType('dislike');
    setShowDecisionModal(true); // 👈 Show modal first
  };

  const submitDecision = async () => {
    console.log('submit decision');

    // Determine final reason
    const finalReason =
      selectedDecisionReason === 'Other'
        ? customDecisionReason.trim()
        : selectedDecisionReason;

    if (!finalReason) {
      Alert.alert('Missing Reason', 'Please select or enter a reason.');
      return;
    }

    if (!profileId || isInteracting) {
      console.warn(
        'Cannot submit decision — profileId missing or interaction in progress.',
      );
      return;
    }

    // Like or Dislike logic
    if (decisionType === 'like') {
      console.log('Calling likeProfile with reason:', finalReason);
      likeProfile(profileId, profile, finalReason);
    } else if (decisionType === 'dislike') {
      console.log('Calling dislikeProfile with reason:', finalReason);
      dislikeProfile(profileId, finalReason);
    } else {
      console.warn('Unknown decision type:', decisionType);
      return;
    }

    // Reset modal state
    setShowDecisionModal(false);
    setDecisionType('');
    setSelectedDecisionReason('');
    setCustomDecisionReason('');

    // Optional: Track the decision (Amplitude)
    track(
      `Profile ${decisionType === 'like' ? 'Liked' : 'Disliked'} with Reason`,
      {
        profileId,
        reason: finalReason,
        targetUserId: userId,
      },
    );
  };

  const handleReportProfile = async () => {
    track(`Profile Reported: ${selectedReason} `, {
      targetUserId: userId,
    });
    const finalReason =
      selectedReason === 'Other' ? customReason.trim() : selectedReason;

    if (!finalReason) {
      Alert.alert('Missing Reason', 'Please enter a reason for the report.');
      return;
    }

    try {
      await axios.post(
        'https://marhaba-server.onrender.com/api/user/reportUser',
        {
          reporterId: userId,
          reportedId: profileId,
          reason: finalReason,
        },
      );
      setShowReasonModal(false);
      setSelectedReason('');
      setCustomReason('');
      handleDislikeProfile();
      Alert.alert('Reported', 'Profile has been reported successfully.');
    } catch (error) {
      console.error('Error reporting profile:', error);
      Alert.alert('Error', 'Failed to report profile. Please try again.');
    }
  };

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
    profile?.latitude &&
    profile?.longitude &&
    userProfile?.latitude &&
    userProfile?.longitude
      ? getDistanceInMiles(
          profile.latitude,
          profile.longitude,
          userProfile.latitude,
          userProfile.longitude,
        )
      : null;

  const handleBlockProfile = async () => {
    track('Profile Blocked', {
      targetUserId: userId,
    });
    try {
      await axios.post(
        'https://marhaba-server.onrender.com/api/user/blockUser',
        {
          blocker_id: userId,
          blocked_id: profileId,
        },
      );
      setShowReportBlockModal(false);
      Alert.alert('Blocked', 'Profile has been blocked successfully.');
      handleDislikeProfile();
    } catch (error) {
      console.error('Error blocking profile:', error);
      Alert.alert('Error', 'Failed to block profile. Please try again.');
    }
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      {!showFullProfile ? (
        <>
          <View style={tailwind`w-full h-15/24 px-3`}>
            <TouchableWithoutFeedback onPress={handleImageTap}>
              {photoUrl ? (
                <Image
                  source={{uri: photoUrl}}
                  style={tailwind`flex-1 rounded-3`}
                  resizeMode="cover"
                />
              ) : (
                <View style={tailwind`flex-1 bg-gray-300`} />
              )}
            </TouchableWithoutFeedback>
            <View
              style={tailwind`absolute left-3 right-3 top-4 w-full items-center`}>
              <View
                style={tailwind`flex-row w-11/12 justify-center items-center rounded-full`}>
                {photos.length > 1 &&
                  photos.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        tailwind`mx-1 h-1.5 rounded-full`,
                        {
                          width: screenWidth / photos.length - 24,
                          opacity: idx === photoIndex ? 1 : 0.5,
                          backgroundColor:
                            idx === photoIndex
                              ? themeColors.primary
                              : themeColors.secondary,
                        },
                      ]}
                    />
                  ))}
              </View>
            </View>
            <View
              style={[
                tailwind`absolute bottom-3 left-5 py-1 px-3 rounded-3`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Text style={tailwind`text-base text-white font-semibold`}>
                {intentions.intentions}
              </Text>
            </View>
            <View style={tailwind`absolute bottom-3 right-5`}>
              <TouchableOpacity
                onPress={() => setShowCompatibilityModal(true)}
                style={[
                  tailwind`flex items-center mr-1 py-1 px-3 rounded-3`,
                  {backgroundColor: themeColors.primary},
                ]}>
                <Text style={tailwind`text-base text-white font-semibold`}>
                  {profile.score}% match
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={tailwind`flex-1 px-3 pt-1 flex flex-col justify-between mb-14`}>
            <View>
              <View style={tailwind`flex-row items-center`}>
                <Text
                  style={[
                    tailwind`text-3xl font-bold text-white`,
                    {color: themeColors.primary},
                  ]}>
                  {about.name}
                </Text>
                {profile.tier === 3 && (
                  <View
                    style={[
                      tailwind`rounded-2 px-2 pt-1 ml-2`,
                      {backgroundColor: themeColors.primary},
                    ]}>
                    <Text style={tailwind`text-xs text-white`}>Pro+</Text>
                  </View>
                )}
              </View>
              <View
                style={tailwind`flex flex-row items-center justify-between`}>
                <Text style={tailwind`text-base`}>
                  {age ? `${age} yrs • ` : ''}
                  {about.height ? `${about.height} • ` : ''}
                  {religion.religion
                    ? `${religion.religion}${
                        religion.sect ? ` (${religion.sect})` : ''
                      } `
                    : ''}
                </Text>
                {background.map((bg: string, index: number) => (
                  <Text
                    key={index}
                    style={[
                      tailwind`text-3xl font-semibold`,
                      {color: themeColors.primary},
                    ]}>
                    {countryFlagMap[bg] ?? ''}
                  </Text>
                ))}
              </View>
              <View style={tailwind`mt-1`}>
                {prompts.t_who && (
                  <Text
                    numberOfLines={prompts.t_makes_me ? 1 : 2}
                    style={tailwind`font-semibold text-base`}>
                    {`"${prompts.t_who}"`}
                  </Text>
                )}
                {prompts.t_makes_me && (
                  <Text
                    numberOfLines={prompts.t_who ? 1 : 2}
                    style={tailwind`font-semibold text-base`}>
                    {`"${prompts.t_makes_me}"`}
                  </Text>
                )}
              </View>
              <View style={tailwind`mt-2`}>
                <Text style={tailwind`mb-1 text-base font-semibold`}>
                  Shared Similarities
                </Text>
                {similarities.length > 0 ? (
                  <View style={tailwind`flex flex-row flex-wrap`}>
                    {similarities.map((item, index) => (
                      <View
                        key={index}
                        style={[
                          tailwind`px-3 py-1 rounded-full mr-2 mb-2`,
                          {backgroundColor: themeColors.primary},
                        ]}>
                        <Text style={tailwind`text-white text-sm`}>{item}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={tailwind`text-base italic text-gray-500`}>
                    No obvious similarities yet
                  </Text>
                )}
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={tailwind`w-full h-full`}>
          <View style={tailwind`w-full h-42`}>
            <ScrollView
              style={tailwind`w-full h-full p-2`}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{uri: photo.photoUrl}}
                  style={tailwind`h-full w-24 rounded-3 mr-2`}
                />
              ))}
            </ScrollView>
          </View>
          <ScrollView style={tailwind`flex-1 mb-29 p-2`}>
            <Text
              style={[
                tailwind`text-2xl font-bold`,
                {color: themeColors.primary},
              ]}>
              {about.name}
            </Text>
            <View style={tailwind`flex flex-row items-center mt-2`}>
              <View style={tailwind`pr-2 w-1/2`}>
                <SingleInfoFull label="Height" value={about.height} />
              </View>
              <View style={tailwind`w-1/2`}>
                <SingleInfoFull label="Age" value={`${age} years old`} />
              </View>
            </View>
            <View style={tailwind`flex flex-row items-center mt-2`}>
              <View style={tailwind`pr-2 w-1/2`}>
                <SingleInfoFull
                  label="Looking For"
                  value={
                    intentions.intentions ? `${intentions.intentions}` : ''
                  }
                />
              </View>
              <View style={tailwind`w-1/2`}>
                <SingleInfoFull label="Timeline" value={intentions.timeline} />
              </View>
            </View>
            <View style={tailwind`flex flex-row items-center mt-2`}>
              <View style={tailwind`pr-2 w-1/2`}>
                <SingleInfoFull
                  label="Background"
                  value={
                    <View style={tailwind`flex flex-col`}>
                      {background.slice(0, 2).map((bg, idx) => (
                        <Text key={idx} style={tailwind`text-base font-bold`}>
                          {countryFlagMap[bg] ?? ''} {bg}
                        </Text>
                      ))}
                    </View>
                  }
                />
              </View>
              <View style={tailwind`w-1/2`}>
                <SingleInfoFull
                  label="Relocate"
                  value={intentions.relocate || PLACEHOLDER}
                />
              </View>
            </View>
            <View style={tailwind`flex flex-row items-center mt-2`}>
              <View style={tailwind`pr-2 w-1/2`}>
                <SingleInfoFull
                  label="Religion"
                  value={religion.religion || PLACEHOLDER}
                />
              </View>
              <View style={tailwind`w-1/2`}>
                <SingleInfoFull
                  label="Sect"
                  value={religion.sect || PLACEHOLDER}
                />
              </View>
            </View>
            <View style={tailwind`flex flex-row items-center mt-2`}>
              <View style={tailwind`pr-2 w-1/2`}>
                <SingleInfoFull
                  label="Practicing"
                  value={
                    religion.practicing ? `${religion.practicing}` : PLACEHOLDER
                  }
                />
              </View>
              <View style={tailwind`w-1/2`}>
                <SingleInfoFull
                  label="Openness"
                  value={
                    religion.openness ? `${religion.openness}` : PLACEHOLDER
                  }
                />
              </View>
            </View>

            <View style={tailwind`mt-8`}>
              {(prompts.t_who !== null || prompts.t_makes_me !== null) && (
                <Text
                  style={[
                    tailwind`text-xl font-bold mb-1`,
                    {color: themeColors.primary},
                  ]}>
                  I am...
                </Text>
              )}
              {prompts.t_who && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull label="Who am I?" value={prompts.t_who} />
                  </View>
                </View>
              )}
              {prompts.t_makes_me && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="What makes me, me?"
                      value={prompts.t_makes_me}
                    />
                  </View>
                </View>
              )}
              {(prompts.t_weekends !== null ||
                prompts.t_friends !== null ||
                prompts.t_master !== null ||
                prompts.t_make_time !== null) && (
                <Text
                  style={[
                    tailwind`text-xl font-bold mb-1 mt-4`,
                    {color: themeColors.primary},
                  ]}>
                  Light & Relatable
                </Text>
              )}
              {prompts.t_weekends && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="On weekends, you’ll usually find me…"
                      value={prompts.t_weekends}
                    />
                  </View>
                </View>
              )}
              {prompts.t_friends && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="My friends would describe me as…"
                      value={prompts.t_friends}
                    />
                  </View>
                </View>
              )}
              {prompts.t_master && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="A skill I would instatnly like to master is…"
                      value={prompts.t_master}
                    />
                  </View>
                </View>
              )}
              {prompts.t_make_time && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="One thing I always make time for is…"
                      value={prompts.t_make_time}
                    />
                  </View>
                </View>
              )}
              {/* {prompts.t_daily && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull label="Daily" value={prompts.t_daily} />
                  </View>
                </View>
              )} */}
              {(prompts.t_love !== null ||
                prompts.t_faith !== null ||
                prompts.t_appreciate !== null ||
                prompts.t_lifestyle !== null) && (
                <Text
                  style={[
                    tailwind`text-xl font-bold mb-1 mt-4`,
                    {color: themeColors.primary},
                  ]}>
                  Intentions & Identity
                </Text>
              )}
              {prompts.t_love && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="When it comes to love, I believe…"
                      value={prompts.t_love}
                    />
                  </View>
                </View>
              )}
              {prompts.t_faith && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="Faith and values play a role in my life..."
                      value={prompts.t_faith}
                    />
                  </View>
                </View>
              )}
              {prompts.t_appreciate && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="I appreciate when someone…"
                      value={prompts.t_appreciate}
                    />
                  </View>
                </View>
              )}
              {prompts.t_lifestyle && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="The lifestyle I’m building includes…"
                      value={prompts.t_lifestyle}
                    />
                  </View>
                </View>
              )}
              {(prompts.t_refuse !== null ||
                prompts.t_show !== null ||
                prompts.t_grow !== null ||
                prompts.t_life !== null) && (
                <Text
                  style={[
                    tailwind`text-xl font-bold mb-1 mt-4`,
                    {color: themeColors.primary},
                  ]}>
                  Depth & Emotions
                </Text>
              )}
              {prompts.t_refuse && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="A value I refuse to compromise on…"
                      value={prompts.t_refuse}
                    />
                  </View>
                </View>
              )}
              {prompts.t_show && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="When I care about someone…"
                      value={prompts.t_show}
                    />
                  </View>
                </View>
              )}
              {prompts.t_grow && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="I’ve grown the most through…"
                      value={prompts.t_grow}
                    />
                  </View>
                </View>
              )}
              {prompts.t_life && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="I feel most at peace when…"
                      value={prompts.t_life}
                    />
                  </View>
                </View>
              )}
              {(prompts.t_moment !== null ||
                prompts.t_deep !== null ||
                prompts.t_partner !== null ||
                prompts.t_lifelong !== null) && (
                <Text
                  style={[
                    tailwind`text-xl font-bold mb-1 mt-4`,
                    {color: themeColors.primary},
                  ]}>
                  Bonding
                </Text>
              )}
              {prompts.t_moment && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="Moment that shaped how I love…"
                      value={prompts.t_moment}
                    />
                  </View>
                </View>
              )}
              {prompts.t_deep && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="I feel deeply connected when…"
                      value={prompts.t_deep}
                    />
                  </View>
                </View>
              )}
              {prompts.t_partner && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="The partner I strive to be is…"
                      value={prompts.t_partner}
                    />
                  </View>
                </View>
              )}
              {prompts.t_lifelong && (
                <View style={tailwind`flex flex-row items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <SingleInfoFull
                      label="What I want in alifelong partnership is…"
                      value={prompts.t_lifelong}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={tailwind`flex flex-row items-center mt-10`}>
              <View style={tailwind`w-full`}>
                <SingleInfoFull
                  label="Career"
                  value={`${
                    career.job && career.company
                      ? `${career.job} @ ${career.company}`
                      : PLACEHOLDER
                  }`}
                />
              </View>
            </View>
            <View style={tailwind`flex flex-row items-center mt-2`}>
              <View style={tailwind`w-full`}>
                <SingleInfoFull
                  label="Education"
                  value={career.education ? `${career.education}` : PLACEHOLDER}
                />
              </View>
            </View>
            {career.industry || career.site ? (
              <View style={tailwind`flex flex-row items-center mt-2`}>
                <View style={tailwind`w-1/2`}>
                  <SingleInfoFull
                    label="Industry"
                    value={career.industry ? career.industry : PLACEHOLDER}
                  />
                </View>
                <View style={tailwind`w-1/2`}>
                  <SingleInfoFull
                    label="Site"
                    value={career.site ? `${career.site}` : PLACEHOLDER}
                  />
                </View>
              </View>
            ) : null}
            {career.fiveYears ? (
              <View style={tailwind`flex flex-row items-center mt-2`}>
                <View style={tailwind`w-full`}>
                  <SingleInfoFull
                    label="Five Years"
                    value={future.fiveYears || PLACEHOLDER}
                  />
                </View>
              </View>
            ) : null}
            <View style={tailwind`mt-8`}>
              {prompts.length > 0 &&
                prompts.map(
                  (item: Prompt, index) =>
                    item.response && (
                      <View style={tailwind`w-full mt-2`} key={index}>
                        <SingleInfoFull
                          label={item.prompt} // ✅ Use item.prompt
                          value={item.response} // ✅ Use item.response
                        />
                      </View>
                    ),
                )}
            </View>
            <View style={tailwind`mt-8`}>
              <Text
                style={[
                  tailwind`text-xl font-bold mb-1.5`,
                  {color: themeColors.primary},
                ]}>
                Core Values
              </Text>
              <View style={tailwind`flex flex-row items-center`}>
                <View style={tailwind`pr-2 w-1/2`}>
                  <SingleInfoFull label="Faith" value={core.faith} />
                </View>
                <View style={tailwind`w-1/2`}>
                  <SingleInfoFull label="Family" value={core.family} />
                </View>
              </View>
              <View style={tailwind`flex flex-row items-center mt-2`}>
                <View style={tailwind`pr-2 w-1/2`}>
                  <SingleInfoFull label="Career" value={core.career} />
                </View>
                <View style={tailwind`w-1/2`}>
                  <SingleInfoFull label="Ambition" value={core.ambition} />
                </View>
              </View>
              <View style={tailwind`flex flex-row items-center mt-2`}>
                <View style={tailwind`pr-2 w-1/2`}>
                  <SingleInfoFull label="Conflicts" value={core.conflicts} />
                </View>
                <View style={tailwind`w-1/2`}>
                  <SingleInfoFull
                    label="Decision Making"
                    value={core.decisions}
                  />
                </View>
              </View>
              <View style={tailwind`flex flex-row items-center mt-2`}>
                <View style={tailwind`pr-2 w-1/2`}>
                  <SingleInfoFull
                    label="Independence"
                    value={core.independence}
                  />
                </View>
                <View style={tailwind`w-1/2`}>
                  <SingleInfoFull label="Politics" value={core.politics} />
                </View>
              </View>
            </View>
            <View style={tailwind`mt-8`}>
              <Text
                style={[
                  tailwind`text-xl font-bold`,
                  {color: themeColors.primary},
                ]}>
                Lifestyle Habits
              </Text>
              {userProfile.tier === 1 ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={[
                    tailwind`px-5 py-4 rounded-lg mb-6`,
                    {
                      backgroundColor: themeColors.darkGrey,
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-lg font-semibold text-center`,
                      {color: 'white'},
                    ]}>
                    This section is locked.
                  </Text>
                  <Text
                    style={[
                      tailwind`text-base  text-center mt-1`,
                      {color: 'white'},
                    ]}>
                    Upgrade to Pro to view full profile insights like lifestyle,
                    career, and more.
                  </Text>
                  <Text
                    style={[
                      tailwind`text-lg font-bold text-yellow-800 text-center mt-2 underline`,
                      {color: 'white'},
                    ]}>
                    Tap here to upgrade
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={tailwind`flex flex-col`}>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    <View style={tailwind`pr-2 w-1/2`}>
                      <SingleInfoFull
                        label="Drinking"
                        value={habits.drinking || PLACEHOLDER}
                      />
                    </View>
                    <View style={tailwind`w-1/2`}>
                      <SingleInfoFull
                        label="Smoking"
                        value={habits.smoking || PLACEHOLDER}
                      />
                    </View>
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    <View style={tailwind`pr-2 w-1/2`}>
                      <SingleInfoFull
                        label="Sleep"
                        value={habits.sleep || PLACEHOLDER}
                      />
                    </View>
                    <View style={tailwind`w-1/2`}>
                      <SingleInfoFull
                        label="Excercise"
                        value={habits.excersize || PLACEHOLDER}
                      />
                    </View>
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    <View style={tailwind`pr-2 w-1/2`}>
                      <SingleInfoFull
                        label="Diet"
                        value={habits.diet || PLACEHOLDER}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
            {tags.length > 0 && (
              <View style={tailwind`mt-8`}>
                <Text
                  style={[
                    tailwind`text-xl font-bold`,
                    {color: themeColors.primary},
                  ]}>
                  Interests
                </Text>
                {userProfile.tier === 1 ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    style={[
                      tailwind`px-5 py-4 rounded-lg mb-6`,
                      {
                        backgroundColor: themeColors.darkGrey,
                      },
                    ]}>
                    <Text
                      style={[
                        tailwind`text-lg font-semibold text-center`,
                        {color: 'white'},
                      ]}>
                      This section is locked.
                    </Text>
                    <Text
                      style={[
                        tailwind`text-base  text-center mt-1`,
                        {color: 'white'},
                      ]}>
                      Upgrade to Pro to view full profile insights like
                      lifestyle, career, and more.
                    </Text>
                    <Text
                      style={[
                        tailwind`text-lg font-bold text-yellow-800 text-center mt-2 underline`,
                        {color: 'white'},
                      ]}>
                      Tap here to upgrade
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tailwind`flex-row mt-1.5`}>
                    {tags.map((tag, idx) => (
                      <View key={idx} style={tailwind`pr-2 mb-2`}>
                        <SingleInfoFull label={''} value={tag.tag} />
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
            {loveLanguages.length > 0 && (
              <View style={tailwind`mt-8`}>
                <Text
                  style={[
                    tailwind`text-xl font-bold`,
                    {color: themeColors.primary},
                  ]}>
                  Love Languages
                </Text>
                {userProfile.tier === 1 || userProfile.tier === 2 ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    style={[
                      tailwind`px-5 py-4 rounded-lg`,
                      {
                        backgroundColor: themeColors.darkGrey,
                      },
                    ]}>
                    <Text
                      style={[
                        tailwind`text-lg font-semibold text-center`,
                        {color: 'white'},
                      ]}>
                      This section is locked.
                    </Text>
                    <Text
                      style={[
                        tailwind`text-base  text-center mt-1`,
                        {color: 'white'},
                      ]}>
                      Upgrade to Pro+ to view full profile insights like
                      lifestyle, career, and more.
                    </Text>
                    <Text
                      style={[
                        tailwind`text-lg font-bold text-yellow-800 text-center mt-2 underline`,
                        {color: 'white'},
                      ]}>
                      Tap here to upgrade
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    {loveLanguages.map((item: LoveLanguage, index) => (
                      <View key={index} style={tailwind`pr-2 w-full mb-2`}>
                        <SingleInfoFull label={''} value={item} />
                      </View>
                    ))}
                  </>
                )}
              </View>
            )}
            <View style={tailwind`mt-8`}>
              <Text
                style={[
                  tailwind`text-xl font-bold`,
                  {color: themeColors.primary},
                ]}>
                Future Goals
              </Text>
              {userProfile.tier === 1 || userProfile.tier === 2 ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={[
                    tailwind`px-5 py-4 rounded-lg mb-6`,
                    {
                      backgroundColor: themeColors.darkGrey,
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-lg font-semibold text-center`,
                      {color: 'white'},
                    ]}>
                    This section is locked.
                  </Text>
                  <Text
                    style={[
                      tailwind`text-base  text-center mt-1`,
                      {color: 'white'},
                    ]}>
                    Upgrade to Pro+ to view full profile insights like
                    lifestyle, career, and more.
                  </Text>
                  <Text
                    style={[
                      tailwind`text-lg font-bold text-yellow-800 text-center mt-2 underline`,
                      {color: 'white'},
                    ]}>
                    Tap here to upgrade
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={tailwind`flex flex-col mb-4`}>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    <View style={tailwind`pr-2 w-1/2`}>
                      <SingleInfoFull
                        label="Career Ambition"
                        value={future.career}
                      />
                    </View>
                    <View style={tailwind`w-1/2`}>
                      <SingleInfoFull
                        label="Financial Ambition"
                        value={future.finances}
                      />
                    </View>
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    <View style={tailwind`pr-2 w-1/2`}>
                      <SingleInfoFull
                        label="Pace of Life"
                        value={future.pace}
                      />
                    </View>
                    <View style={tailwind`w-1/2`}>
                      <SingleInfoFull
                        label="Long Term Living"
                        value={future.live}
                      />
                    </View>
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    <View style={tailwind`pr-2 w-full`}>
                      <SingleInfoFull
                        label="5 Year Plan"
                        value={future.fiveYears}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
            <View style={tailwind`mt-8`}>
              <Text
                style={[
                  tailwind`text-xl font-bold`,
                  {color: themeColors.primary},
                ]}>
                Socials
              </Text>
              {userProfile.tier === 1 || userProfile.tier === 2 ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={[
                    tailwind`px-5 py-4 rounded-lg mb-6`,
                    {
                      backgroundColor: themeColors.darkGrey,
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-lg font-semibold text-center`,
                      {color: 'white'},
                    ]}>
                    This section is locked.
                  </Text>
                  <Text
                    style={[
                      tailwind`text-base  text-center mt-1`,
                      {color: 'white'},
                    ]}>
                    Upgrade to Pro+ to view full profile insights like
                    lifestyle, career, and more.
                  </Text>
                  <Text
                    style={[
                      tailwind`text-lg font-bold text-yellow-800 text-center mt-2 underline`,
                      {color: 'white'},
                    ]}>
                    Tap here to upgrade
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={tailwind`flex flex-col mb-4`}>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    {socials.instagram ? (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(socials.instagram)}
                        style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="instagram"
                          value={limitString(socials.instagram || PLACEHOLDER)}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="instagram"
                          value={limitString(socials.instagram || PLACEHOLDER)}
                        />
                      </View>
                    )}
                    {socials.twitter ? (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(socials.twitter)}
                        style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="twitter"
                          value={limitString(socials.twitter || PLACEHOLDER)}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="twitter"
                          value={limitString(socials.twitter || PLACEHOLDER)}
                        />
                      </View>
                    )}
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    {socials.facebook ? (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(socials.facebook)}
                        style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="facebook"
                          value={limitString(socials.facebook || PLACEHOLDER)}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="facebook"
                          value={limitString(socials.facebook || PLACEHOLDER)}
                        />
                      </View>
                    )}
                    {socials.linkedin ? (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(socials.linkedin)}
                        style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="linkedin"
                          value={limitString(socials.linkedin || PLACEHOLDER)}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="linkedin"
                          value={limitString(socials.linkedin || PLACEHOLDER)}
                        />
                      </View>
                    )}
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    {socials.tiktok ? (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(socials.tiktok)}
                        style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="tiktok"
                          value={limitString(socials.tiktok || PLACEHOLDER)}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="tiktok"
                          value={limitString(socials.tiktok || PLACEHOLDER)}
                        />
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
            <View style={tailwind`mt-8`}>
              <TouchableOpacity
                onPress={() => setShowReportBlockModal(true)}
                style={[
                  tailwind`w-full py-2 px-4 rounded-lg`,
                  {backgroundColor: themeColors.primary},
                ]}>
                <Text
                  style={tailwind`text-white text-lg font-semibold text-center`}>
                  Block / Report
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
      <View
        style={tailwind`absolute bottom-22 w-full flex flex-row items-center justify-center`}>
        {about.videoIntro && (
          <TouchableOpacity
            onPress={() => {
              profile.tier !== 1
                ? setShowVideoModal(true)
                : navigation.navigate('Profile');
            }}
            style={[
              tailwind`absolute left-2 p-2.7 rounded-full shadow-lg`,
              {backgroundColor: themeColors.primary},
            ]}>
            {about.videoIntro ? (
              <View style={tailwind`flex flex-row items-center`}>
                {profile.tier !== 1 ? null : (
                  <View
                    style={tailwind`flex-1 absolute right--4.5 top--4.5 bg-stone-400 rounded-full p-1.5 flex flex-row items-center`}>
                    <Lock
                      height={10}
                      width={10}
                      color={'white'}
                      strokeWidth={2}
                    />
                  </View>
                )}
                <Video height={20} width={20} color={'white'} strokeWidth={2} />
              </View>
            ) : (
              <></>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            setShowFullProfile(!showFullProfile);
          }}
          style={tailwind`absolute right-2 p-2 rounded-full shadow-lg bg-stone-400`}>
          {showFullProfile ? (
            <ChevronsDown
              height={24}
              width={24}
              color={'white'}
              strokeWidth={3}
            />
          ) : (
            <ChevronsUp
              height={24}
              width={24}
              color={'white'}
              strokeWidth={3}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDislikeProfile}
          style={[
            tailwind`p-2 rounded-full shadow-lg`,
            {backgroundColor: isInteracting ? '#fca5a5' : '#f87171'},
          ]}>
          <X height={20} width={20} color={'white'} strokeWidth={3} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLikeProfile}
          style={[
            tailwind`py-2.5 rounded-2 shadow-lg mx-4 px-6`,
            {
              backgroundColor: isInteracting ? '#6ee7b7' : themeColors.primary,
            },
          ]}>
          <Text style={tailwind`text-white text-lg font-semibold`}>
            Connect
          </Text>
        </TouchableOpacity>
        <View style={tailwind`p-2 rounded-full`}>
          <X
            height={24}
            width={24}
            color={themeColors.secondary}
            strokeWidth={3}
          />
        </View>
      </View>
      <Modal
        visible={showReportBlockModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReportBlockModal(false)}>
        <View
          style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-60 px-4`}>
          <View
            style={[
              tailwind`w-full p-5 rounded-lg`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <Text style={tailwind`text-xl font-bold text-center mb-4`}>
              What would you like to do?
            </Text>
            <TouchableOpacity
              onPress={handleBlockProfile}
              style={[
                tailwind`py-3 px-5 rounded-md mb-3`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Text style={tailwind`text-white text-center font-semibold`}>
                Block User
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowReportBlockModal(false);
                setShowReasonModal(true);
              }}
              style={[
                tailwind`py-3 px-5 rounded-md mb-3`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Text style={tailwind`text-white text-center font-semibold`}>
                Report User
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowReportBlockModal(false)}
              style={tailwind`mt-4`}>
              <Text
                style={tailwind`text-center text-base font-semibold text-red-400`}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showReasonModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReasonModal(false)}>
        <View
          style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-60 px-3`}>
          <View
            style={[
              tailwind`w-full p-5 rounded-lg`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <Text style={tailwind`text-xl font-bold text-center mb-4`}>
              Select Report Reason
            </Text>

            {[
              'Offensive Content',
              'Inappropriate Behavior',
              'Spam or Scam',
              'Fake Profile',
              'Other',
            ].map(reason => (
              <TouchableOpacity
                key={reason}
                onPress={() => setSelectedReason(reason)}
                style={[
                  tailwind`py-2 px-4 rounded-md mb-2`,
                  {
                    backgroundColor:
                      selectedReason === reason
                        ? themeColors.primary
                        : themeColors.darkSecondary,
                  },
                ]}>
                <Text
                  style={[
                    tailwind`text-base font-semibold`,
                    {
                      color: selectedReason === reason ? 'white' : 'black',
                    },
                  ]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            {selectedReason === 'Other' && (
              <TextInput
                style={tailwind`border border-gray-600 rounded-md p-3 mt-2 text-base`}
                placeholder="Describe your reason..."
                placeholderTextColor="gray"
                value={customReason}
                onChangeText={setCustomReason}
              />
            )}

            <TouchableOpacity
              onPress={handleReportProfile}
              style={[
                tailwind`mt-4 py-3 px-5 rounded-md`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Text style={tailwind`text-white text-center font-semibold`}>
                Submit Report
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowReasonModal(false);
                setSelectedReason('');
                setCustomReason('');
              }}
              style={tailwind`mt-4`}>
              <Text style={tailwind`text-center text-gray-400`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* everything below is just for testing the video modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showVideoModal}
        onRequestClose={() => setShowVideoModal(false)}>
        <View
          style={tailwind`flex-1 bg-black bg-opacity-50 justify-center items-center`}>
          <View
            style={[
              tailwind`w-11/12 h-10/12 rounded-2xl p-3 mb-3`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <View
              style={tailwind`w-full flex flex-row items-center justify-between`}>
              <Text style={tailwind`text-xl font-bold`}>Intro Video</Text>
              <TouchableOpacity onPress={() => setShowVideoModal(false)}>
                <X height={20} width={20} color={'red'} strokeWidth={3} />
              </TouchableOpacity>
            </View>
            <View
              style={tailwind`flex-1 relative bg-white mt-2 rounded-3 overflow-hidden`}>
              <RNVideo
                source={{uri: about.videoIntro}}
                style={tailwind`w-full h-full rounded-3 overflow-hidden`}
                resizeMode="cover"
                paused={!isPlaying} // controlled by button
                onEnd={() => setIsPlaying(false)} // stop when done
              />

              {/* Play/Pause button (center overlay) */}
              <TouchableOpacity
                onPress={() => setIsPlaying(prev => !prev)}
                style={tailwind`absolute top-1/2 left-1/2 -mt-6 -ml-6 bg-black bg-opacity-50 rounded-full p-3`}>
                {isPlaying ? (
                  <Pause height={24} width={24} color="#fff" />
                ) : (
                  <Play height={24} width={24} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Video Player */}
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showCompatibilityModal}
        onRequestClose={() => setShowCompatibilityModal(false)}>
        <View
          style={tailwind`flex-1 bg-black bg-opacity-50 justify-center items-center`}>
          <View
            style={[
              tailwind`w-10/12 rounded-2xl p-3`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <Text style={tailwind`text-xl font-bold mb-3`}>
              How Compatibility Is Calculated
            </Text>

            <Text style={tailwind`text-base mb-3`}>
              Your compatibility score is calculated by comparing values,
              habits, religious views, relationship goals, and lifestyle
              preferences between you and this profile.
            </Text>

            <Text style={tailwind`text-base font-semibold mb-4`}>
              AI-powered compatibility is coming soon. The algorithm will get
              smarter and more accurate over time!
            </Text>

            <TouchableOpacity
              onPress={() => setShowCompatibilityModal(false)}
              style={[
                tailwind`mt-2 py-2 px-4 rounded-xl`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Text style={tailwind`text-white text-center font-semibold`}>
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showDecisionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDecisionModal(false)}>
        <View
          style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-60 px-4`}>
          <View
            style={[
              tailwind`w-full p-5 rounded-lg`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <Text style={tailwind`text-xl font-bold text-center mb-4`}>
              {decisionType === 'like'
                ? 'What made you like this profile?'
                : 'What made you dislike this profile?'}
            </Text>
            <Text
              style={tailwind`text-sm italic text-center mb-3 text-gray-500`}>
              Your feedback is anonymous and helps us improve the algorithm.
            </Text>

            {/* Reasons based on decision type */}
            {(decisionType === 'like'
              ? [
                  'Great personality',
                  'Shared values',
                  'Attractive photos',
                  'Good first impression',
                  'Other', // <== Always include "Other"
                ]
              : [
                  'Not my type',
                  'Low compatibility',
                  'Dealbreaker traits',
                  'Concerns about values',
                  'Concerns about lifestyle',
                  'Other', // <== Always include "Other"
                ]
            ).map(reason => (
              <TouchableOpacity
                key={reason}
                onPress={() => setSelectedDecisionReason(reason)}
                style={[
                  tailwind`py-2 px-4 rounded-md mb-2`,
                  {
                    backgroundColor:
                      selectedDecisionReason === reason
                        ? themeColors.primary
                        : themeColors.darkSecondary,
                  },
                ]}>
                <Text
                  style={[
                    tailwind`text-base font-semibold`,
                    {
                      color:
                        selectedDecisionReason === reason ? 'white' : 'black',
                    },
                  ]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Optional text input if Other selected */}
            {selectedDecisionReason === 'Other' && (
              <TextInput
                style={tailwind`border border-gray-600 rounded-md p-3 mt-2 text-base`}
                placeholder="Describe your reason..."
                placeholderTextColor="gray"
                value={customDecisionReason}
                onChangeText={setCustomDecisionReason}
                maxLength={225}
              />
            )}

            {/* Submit */}
            <TouchableOpacity
              onPress={submitDecision}
              style={[
                tailwind`mt-4 py-3 px-5 rounded-md`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Text style={tailwind`text-white text-center font-semibold`}>
                Submit
              </Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              onPress={() => {
                setShowDecisionModal(false);
                setDecisionType('');
                setSelectedDecisionReason('');
                setCustomDecisionReason('');
              }}
              style={tailwind`mt-4`}>
              <Text style={tailwind`text-center text-gray-400`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

function getAgeFromDOB(dobString: string | null | undefined): string | number {
  if (!dobString) return '—';
  try {
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return '—';
    const ageDiff = Date.now() - birthDate.getTime();
    const calculatedAge = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
    return calculatedAge > 0 && calculatedAge < 120 ? calculatedAge : '—';
  } catch (e) {
    console.error('Error parsing DOB:', e);
    return '—';
  }
}

export default FeedProfileComponent;
