import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Linking,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import tailwind from 'twrnc';
import {
  Check,
  Heart,
  X,
  ChevronsDown,
  Send,
  ChevronsUp,
  ChevronLeft,
  ChevronsLeft,
} from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import {countryFlagMap} from '../../Utils/FlagMaps';
import SingleInfoFull from '../../Components/Info/SingleInfoFull';
import {useRoute, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';
import {calculateCompatibility} from '../../Utils/Functions/Comptability';
import {track} from '@amplitude/analytics-react-native';
import {getDistance} from 'geolib';

const SingleProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {profile} = route.params as {profile: any};
  const {userId, profile: userProfile} = useProfile();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [superlikeMessage, setSuperlikeMessage] = useState('');
  const [isInteracting, setIsInteracting] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [showReportBlockModal, setShowReportBlockModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const [showMatchModal, setShowMatchModal] = useState<boolean>(false);
  const [matchedProfile, setMatchedProfile] = useState<any>(null);

  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);

  const PLACEHOLDER = '—';

  const user = profile;
  const profileId = profile.userId;
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
  const prompts = Array.isArray(user?.Prompts) ? user.Prompts : [];
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

  function limitString(input: string, maxLength = 12): string {
    if (!input) return '';
    return input.length > maxLength
      ? input.slice(0, maxLength).trim() + '...'
      : input;
  }

  const handleImageTap = () => {
    if (photos.length <= 1) return;
    setPhotoIndex(prev => (prev + 1) % photos.length);
  };

  const handleOpenSuperlikeModal = () => {
    if (isInteracting) return;
    setShowFullProfile(false);
    setIsModalVisible(true);
  };

  const handleSendSuperlike = () => {
    if (!profileId) {
      console.error('Cannot super like profile, profile ID is missing.');
      setIsModalVisible(false);
      setSuperlikeMessage('');
      return;
    }
    setIsModalVisible(false);
    superLikeProfile(profileId, superlikeMessage.trim(), profile);
    setSuperlikeMessage('');
  };

  const handleLikeProfile = () => {
    if (!profileId || isInteracting) {
      console.warn(
        'Cannot like profile, profile ID is missing or interaction in progress.',
      );
      return;
    }
    setShowFullProfile(false);
    likeProfile(profileId, profile);
  };

  const handleDislikeProfile = () => {
    if (!profileId || isInteracting) {
      console.warn(
        'Cannot dislike profile, profile ID is missing or interaction in progress.',
      );
      return;
    }
    navigation.goBack();
    dislikeProfile(profileId);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSuperlikeMessage('');
  };

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

  const dislikeProfile = async (profileId: string) => {
    track('Profile Disliked', {
      targetUserId: userId,
    });
    console.log(`disliked profile: ${profileId}`);
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
            targetInteraction: 'disliked',
            viewed: true,
            approved: true,
            viewed_at: new Date().toISOString(),
            approved_at: new Date().toISOString(),
            message: null,
          },
        );
        navigation.goBack();
      }

      const response = await axios.post(
        `https://marhaba-server.onrender.com/api/user/interaction`,
        {
          userId: userId,
          targetUserId: profileId,
          userInteraction: 'disliked',
          targetInteraction: null,
          viewed: false,
          approved: false,
          viewed_at: null,
          approved_at: null,
          message: null,
        },
      );

      if (response.data?.success) {
        track('Profile disliked', {
          targetUserId: userId,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error(`❌ Error liking profile ${profileId}:`, error);
    }
  };

  const likeProfile = async (profileId: string, profile: any) => {
    const userId = profile?.userId;
    try {
      // Check if already liked
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

      // Proceed to like
      const response = await axios.post(
        `https://marhaba-server.onrender.com/api/user/interaction`,
        {
          userId: userId,
          targetUserId: profileId,
          interaction: 'liked',
          viewed: false,
          approved: false,
        },
      );

      if (response.data?.success) {
        navigation.popToTop();
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
    } catch (error) {
      console.error(`❌ Error liking profile ${profileId}:`, error);
    }
  };

  const superLikeProfile = async (
    profileId: string,
    message?: string,
    profile: any,
  ) => {
    const userId = profile?.userId;

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
        return;
      }

      const response = await axios.post(
        `https://marhaba-server.onrender.com/api/user/interaction`,
        {
          userId: userId,
          targetUserId: profileId,
          interaction: 'super',
          viewed: false,
          approved: false,
          message: message,
        },
      );
      if (response.data?.success) {
        navigation.popToTop();
      } else {
        console.error(
          `⚠️ Server responded but like was not successful for ${profileId}:`,
          response.data,
        );
      }
    } catch (error) {
      console.error(`❌ Error liking profile ${profileId}:`, error);
    }
  };

  const handleToggleFullProfile = () => {
    setShowFullProfile(prev => !prev);
  };

  const handleReportProfile = async () => {
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

  const handleBlockProfile = async () => {
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

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      {!showFullProfile ? (
        <>
          <View style={tailwind`w-full h-16/24 px-3`}>
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
            <TouchableOpacity
              style={tailwind`absolute left-6 top-8 p-2 rounded-full bg-black bg-opacity-50`}
              onPress={() => navigation.goBack()}>
              <ChevronsLeft
                height={24}
                width={24}
                color={'white'}
                strokeWidth={3}
              />
            </TouchableOpacity>
            <View
              style={tailwind`absolute left-3 right-3 top-4 w-full items-center`}>
              <View
                style={tailwind`flex-row w-11/12 justify-center items-center rounded-full`}>
                {photos.map((_, idx) => (
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
            <View style={tailwind`absolute bottom-3 right-5`}>
              <TouchableOpacity
                onPress={() => setShowCompatibilityModal(true)}
                style={[
                  tailwind`flex items-center mr-1 py-1 px-3 rounded-3`,
                  {backgroundColor: themeColors.primary},
                ]}>
                <Text style={tailwind`text-base text-white font-semibold`}>
                  {calculateCompatibility(profile, userProfile)}% match
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
              <View
                style={tailwind`flex flex-row items-center justify-between`}>
                {(intentions.intentions || intentions.timeline) && (
                  <View style={tailwind``}>
                    <Text style={tailwind`text-base`}>
                      {intentions.intentions}
                      {career.job ? ' • ' : ''}
                      {career.job}
                    </Text>
                  </View>
                )}
                <Text style={tailwind`text-base`}>{distance} mi away</Text>
              </View>
              {prompts[0]?.response && (
                <View style={tailwind`mt-2`}>
                  <Text
                    numberOfLines={2}
                    style={tailwind`font-semibold text-base`}>
                    {`"${prompts[0].response}"`}
                  </Text>
                </View>
              )}
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
            <View style={tailwind`flex flex-row items-center mt-8`}>
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
            <View style={tailwind`flex flex-row items-center mt-8`}>
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
              {userProfile.tier === 1 || userProfile.tier === 2 ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profiles')}
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
                {userProfile.tier === 1 || userProfile.tier === 2 ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Profiles')}
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
                    onPress={() => navigation.navigate('Profiles')}
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
                  onPress={() => navigation.navigate('Profiles')}
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
                  onPress={() => navigation.navigate('Profiles')}
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
        <TouchableOpacity
          onPress={() => {
            setShowFullProfile(!showFullProfile);
          }}
          style={tailwind`absolute left-2 p-2 rounded-full shadow-lg bg-stone-400`}>
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
          <X height={24} width={24} color={'white'} strokeWidth={3} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(true);
          }}
          style={[
            tailwind`p-2 rounded-2 shadow-lg mx-4 px-6`,
            {
              backgroundColor: isInteracting ? '#6ee7b7' : themeColors.primary,
            },
          ]}>
          <Text style={tailwind`text-white text-lg font-semibold`}>
            Send Message
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLikeProfile}
          style={tailwind`p-2 rounded-full shadow-lg bg-emerald-500`}>
          <Check height={24} width={24} color={'white'} strokeWidth={3} />
        </TouchableOpacity>
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
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancelModal}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={tailwind`flex-1 justify-center bg-black bg-opacity-50 px-4`}>
            <View
              style={[
                tailwind`bg-white p-5 rounded-xl`,
                {backgroundColor: themeColors.secondary},
              ]}>
              <Text style={tailwind`text-xl font-bold text-center mb-4`}>
                Add a message (Optional)
              </Text>
              <TextInput
                style={tailwind`border-b-2 border-b-gray-600 p-3 mb-4 text-base`}
                placeholder="Make your Super Like stand out..."
                value={superlikeMessage}
                onChangeText={setSuperlikeMessage}
                maxLength={140}
                multiline
                textAlignVertical="top"
                placeholderTextColor={'gray'}
              />
              <View style={tailwind`flex-row justify-between`}>
                <TouchableOpacity
                  onPress={handleCancelModal}
                  style={tailwind`px-5 py-3 rounded-md bg-gray-300`}>
                  <Text style={tailwind`text-base font-semibold text-gray-700`}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSendSuperlike}
                  style={[
                    tailwind`px-5 py-3 rounded-md flex-row items-center`,
                    {backgroundColor: themeColors.primary},
                  ]}>
                  <Send height={18} width={18} color="white" />
                  <Text
                    style={tailwind`text-base font-semibold text-white ml-2`}>
                    Send Super Like
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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

export default SingleProfileScreen;
