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
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import tailwind from 'twrnc';
import {
  Check,
  Heart,
  X,
  ChevronsDown,
  Send,
  ChevronsUp,
} from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import cheers from '../../Assets/cheers.png';
import baby from '../../Assets/baby.png';
import ciggy from '../../Assets/cigarette.png';
import {countryFlagMap} from '../../Utils/FlagMaps';
import SingleInfoFull from '../Info/SingleInfoFull';
import {useNavigation} from '@react-navigation/native';
import {useProfile} from '../../Context/ProfileContext';
import axios from 'axios';
import {calculateCompatibility} from '../../Utils/Functions/Comptability';
import {track} from '@amplitude/analytics-react-native';

interface Photo {
  photoUrl: string;
}

interface Tag {
  tag: string;
}

interface Communication {
  style: string;
}

interface LoveLanguage {
  language: string;
}

interface Prompt {
  prompt: string;
  response?: string;
}

interface Value {
  value: string;
}

interface FeedSummaryProps {
  profile: any;
  likesLeft?: number;
  dislikeProfile: (profileId: string) => void;
  likeProfile: (profileId: string, profile: any) => void;
  superlikeProfile: (profileId: string, message?: string, profile: any) => void;
  isInteracting?: boolean;
  onExpandPress?: () => void;
  showFullProfile: boolean;
  handleToggleFullProfile: () => void;
  setShowFullProfile: (showFullProfile: boolean) => void;
}

const {width: screenWidth} = Dimensions.get('window');

const FeedProfileComponent: React.FC<FeedSummaryProps> = ({
  profile,
  dislikeProfile,
  likeProfile,
  superlikeProfile,
  isInteracting = false,
  onExpandPress,
  showFullProfile,
  handleToggleFullProfile,
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

  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);

  if (!profile) return null;

  function limitString(input: string, maxLength = 12): string {
    if (!input) return '';
    return input.length > maxLength
      ? input.slice(0, maxLength).trim() + '...'
      : input;
  }

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

  const handleImageTap = () => {
    if (photos.length <= 1) return;
    setPhotoIndex(prev => (prev + 1) % photos.length);
  };

  const handleSendSuperlike = () => {
    if (!profileId) {
      console.error('Cannot super like profile, profile ID is missing.');
      setIsModalVisible(false);
      setSuperlikeMessage('');
      return;
    }
    setIsModalVisible(false);
    superlikeProfile(profileId, superlikeMessage.trim(), profile);
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
    setShowFullProfile(false);
    dislikeProfile(profileId);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSuperlikeMessage('');
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

  return (
    <View style={tailwind`flex-1 relative`}>
      <TouchableWithoutFeedback onPress={handleImageTap}>
        {photoUrl ? (
          <Image
            source={{uri: photoUrl}}
            style={tailwind`absolute w-full h-full`}
            resizeMode="cover"
          />
        ) : (
          <View style={tailwind`absolute w-full h-full bg-gray-300`} />
        )}
      </TouchableWithoutFeedback>
      {photos.length > 1 && (
        <View
          style={tailwind`absolute top-22 w-full flex-row justify-center z-30`}>
          {photos.map((_, idx) => (
            <View
              key={idx}
              style={[
                tailwind`mx-1 w-2 h-2 rounded-full`,
                {
                  backgroundColor:
                    idx === photoIndex
                      ? themeColors.primary
                      : themeColors.darkGrey,
                  opacity: idx === photoIndex ? 1 : 0.5,
                },
              ]}
            />
          ))}
        </View>
      )}

      {!showFullProfile ? (
        <>
          <View
            style={[
              tailwind`absolute bottom-39 left-0 right-0 rounded-t-2`,
              {backgroundColor: themeColors.darkGrey},
            ]}>
            <View
              style={tailwind`flex-row justify-between items-center p-3 pb-2`}>
              <View
                style={tailwind`flex-row justify-between w-full items-center`}>
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
                        tailwind`rounded-2 px-2 py-1 ml-2`,
                        {backgroundColor: themeColors.primary},
                      ]}>
                      <Text style={tailwind`text-xs text-white`}>Pro+</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => setShowCompatibilityModal(true)}
                  style={[
                    tailwind`flex-row flex-wrap items-center mr-1 py-1 px-3 rounded-full`,
                    {backgroundColor: themeColors.primary},
                  ]}>
                  <Text style={tailwind`text-base text-white`}>
                    {calculateCompatibility(profile, userProfile)}% match
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={tailwind`flex flex-row items-center justify-between px-3`}>
              <Text style={tailwind`text-base text-white`}>
                {age ? `${age} yrs • ` : ''}
                {about.height ? `${about.height} • ` : ''}
                {religion.religion
                  ? `${religion.religion}${
                      religion.sect ? ` (${religion.sect})` : ''
                    } • `
                  : ''}
                {career.job ?? ''}
              </Text>
              {background.map((bg: string, index: number) => (
                <Text
                  key={index}
                  style={[
                    tailwind`text-3xl font-semibold mr-2`,
                    {color: themeColors.primary},
                  ]}>
                  {countryFlagMap[bg] ?? ''}
                </Text>
              ))}
            </View>

            {(intentions.intentions || intentions.timeline) && (
              <View style={tailwind`mt-1 px-3 pb-3`}>
                <Text style={tailwind`font-semibold text-base text-white`}>
                  {intentions.intentions}
                  {intentions.timeline ? ' • ' : ''}
                  {intentions.timeline}
                </Text>
              </View>
            )}
            {/* 
            {prompt?.prompt && (
              <View style={tailwind`mt-2 px-3`}>
                <Text style={tailwind`text-lg italic text-white`}>
                  {prompt.prompt}
                </Text>
              </View>
            )} */}
            {prompts[0]?.response && (
              <View style={tailwind`mt-2 px-3 pb-3`}>
                <Text
                  numberOfLines={1}
                  style={tailwind`font-semibold text-lg text-white`}>
                  {`"${prompts[0].response}"`}
                </Text>
              </View>
            )}

            <TouchableWithoutFeedback onPress={handleToggleFullProfile}>
              <View
                style={[
                  tailwind`flex flex-row items-center justify-center p-4`,
                  {backgroundColor: themeColors.darkGrey},
                ]}>
                <ChevronsUp
                  height={24}
                  width={24}
                  color={themeColors.primary}
                />
                <Text style={tailwind`text-lg font-semibold text-white px-4`}>
                  More Details
                </Text>
                <ChevronsUp
                  height={24}
                  width={24}
                  color={themeColors.primary}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={tailwind`absolute z-20 bottom-19 left-0 right-0 flex flex-row items-center justify-center`}>
            <View
              style={[
                tailwind`w-full flex flex-row items-center justify-center py-4`,
                {backgroundColor: themeColors.darkGrey},
              ]}>
              <TouchableOpacity
                onPress={handleDislikeProfile}
                style={[
                  tailwind`p-3 rounded-full shadow-lg`,
                  {backgroundColor: isInteracting ? '#fca5a5' : '#f87171'},
                ]}>
                <X height={24} width={24} color={'white'} strokeWidth={3} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(true);
                }}
                style={[
                  tailwind`p-3 rounded-2 shadow-lg mx-4 px-6`,
                  {
                    backgroundColor: isInteracting
                      ? '#6ee7b7'
                      : themeColors.primary,
                  },
                ]}>
                <Text style={tailwind`text-white text-lg font-semibold`}>
                  Send Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLikeProfile}
                style={tailwind`p-3 rounded-full shadow-lg bg-emerald-500`}>
                <Check height={24} width={24} color={'white'} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <View
            style={tailwind`absolute z-20 bottom-19 left-0 right-0  flex flex-row items-center justify-center`}>
            <View
              style={[
                tailwind`w-full flex flex-row items-center justify-center  py-4`,
                {backgroundColor: themeColors.darkGrey},
              ]}>
              <TouchableOpacity
                onPress={handleDislikeProfile}
                style={[
                  tailwind`p-3 rounded-full shadow-lg`,
                  {backgroundColor: isInteracting ? '#fca5a5' : '#f87171'},
                ]}>
                <X height={24} width={24} color={'white'} strokeWidth={3} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(true);
                }}
                style={[
                  tailwind`p-3 rounded-2 shadow-lg mx-4 px-6`,
                  {
                    backgroundColor: isInteracting
                      ? '#6ee7b7'
                      : themeColors.primary,
                  },
                ]}>
                <Text style={tailwind`text-white text-lg font-semibold`}>
                  Send Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLikeProfile}
                style={tailwind`p-3 rounded-full shadow-lg bg-emerald-500`}>
                <Check height={24} width={24} color={'white'} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={tailwind`absolute z-20 bottom-39 left-0 right-0`}>
            <TouchableWithoutFeedback onPress={handleToggleFullProfile}>
              <View
                style={[
                  tailwind`flex flex-row items-center justify-center rounded-2 p-4`,
                  {backgroundColor: themeColors.darkGrey},
                ]}>
                <ChevronsDown
                  height={24}
                  width={24}
                  color={themeColors.primary}
                />
                <Text style={tailwind`text-lg font-semibold text-white px-4`}>
                  Less Details
                </Text>
                <ChevronsDown
                  height={24}
                  width={24}
                  color={themeColors.primary}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={[
              tailwind`absolute top-16 bottom-39 left-0 right-0  pb-14`,
              {backgroundColor: themeColors.darkGrey},
            ]}>
            <ScrollView
              style={tailwind`flex-1 p-4 pt-6`}
              contentContainerStyle={tailwind``}
              showsVerticalScrollIndicator={false}>
              <View style={tailwind`pb-12`}>
                <View
                  style={tailwind`flex flex-row items-center justify-between`}>
                  <View style={tailwind`flex flex-row items-center`}>
                    <Text
                      style={[
                        tailwind`text-4xl font-bold`,
                        {color: themeColors.primary},
                      ]}>
                      {about.name}
                    </Text>
                    {profile.tier === 3 && (
                      <View
                        style={[
                          tailwind`rounded-2 px-2 py-1 ml-2`,
                          {backgroundColor: themeColors.primary},
                        ]}>
                        <Text style={tailwind`text-xs text-white`}>Pro+</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowCompatibilityModal(true)}
                    style={[
                      tailwind`flex-row flex-wrap items-center mr-1 py-1 px-3 rounded-full`,
                      {backgroundColor: themeColors.primary},
                    ]}>
                    <Text style={tailwind`text-base text-white`}>
                      {calculateCompatibility(profile, userProfile)}% match
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={tailwind`mt-8 flex flex-col`}>
                  <View style={tailwind`flex flex-row items-center`}>
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
                          intentions.intentions
                            ? `${intentions.intentions}`
                            : ''
                        }
                      />
                    </View>
                    <View style={tailwind`w-1/2`}>
                      <SingleInfoFull
                        label="Timeline"
                        value={intentions.timeline}
                      />
                    </View>
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-12`}>
                    <View style={tailwind`pr-2 w-1/2`}>
                      <SingleInfoFull
                        label="Background"
                        value={
                          <View style={tailwind`flex flex-col`}>
                            {background.slice(0, 2).map((bg, idx) => (
                              <Text
                                key={idx}
                                style={tailwind`text-base font-bold`}>
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
                        label="Practicin"
                        value={
                          religion.practicing
                            ? `${religion.practicing}`
                            : PLACEHOLDER
                        }
                      />
                    </View>
                    <View style={tailwind`w-1/2`}>
                      <SingleInfoFull
                        label="Openness"
                        value={
                          religion.openness
                            ? `${religion.openness}`
                            : PLACEHOLDER
                        }
                      />
                    </View>
                  </View>

                  <View style={tailwind`flex flex-row items-center mt-12`}>
                    <View style={tailwind`pr-2 w-full`}>
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
                    <View style={tailwind`pr-2 w-full`}>
                      <SingleInfoFull
                        label="Education"
                        value={
                          career.education ? `${career.education}` : PLACEHOLDER
                        }
                      />
                    </View>
                  </View>
                  {career.industry || career.site ? (
                    <View style={tailwind`flex flex-row items-center mt-2`}>
                      <View style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="Industry"
                          value={
                            career.industry ? career.industry : PLACEHOLDER
                          }
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
                      <View style={tailwind`pr-2 w-full`}>
                        <SingleInfoFull
                          label="Five Years"
                          value={future.fiveYears || PLACEHOLDER}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>

                <View style={tailwind`mt-12`}>
                  <Text
                    style={[
                      tailwind`text-3xl font-bold mb-4`,
                      {color: themeColors.primary},
                    ]}>
                    Prompts
                  </Text>
                  {prompts.length > 0 &&
                    prompts.map(
                      (item: Prompt, index) =>
                        item.response && (
                          <View style={tailwind`w-full mt-3`} key={index}>
                            <SingleInfoFull
                              label={item.prompt} // ✅ Use item.prompt
                              value={item.response} // ✅ Use item.response
                            />
                          </View>
                        ),
                    )}
                </View>

                <View style={tailwind`mt-12`}>
                  <Text
                    style={[
                      tailwind`text-3xl font-bold mb-6`,
                      {color: themeColors.primary},
                    ]}>
                    Core Values
                  </Text>
                  <View style={tailwind`flex flex-col`}>
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
                        <SingleInfoFull
                          label="Ambition"
                          value={core.ambition}
                        />
                      </View>
                    </View>
                    <View style={tailwind`flex flex-row items-center mt-2`}>
                      <View style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="Conflicts"
                          value={core.conflicts}
                        />
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
                        <SingleInfoFull
                          label="Politics"
                          value={core.politics}
                        />
                      </View>
                    </View>
                    {/* <View style={tailwind`flex flex-row items-center mt-2`}>
                      <View style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="Politics"
                          value={core.politics}
                        />
                      </View>
                    </View> */}
                  </View>
                </View>

                <View style={tailwind`mt-12`}>
                  <Text
                    style={[
                      tailwind`text-3xl font-bold mb-4`,
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
                  <View style={tailwind`mt-12`}>
                    <Text
                      style={[
                        tailwind`text-3xl font-bold mb-4`,
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
                        contentContainerStyle={tailwind`flex-row mt-1`}>
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
                  <View style={tailwind`mt-12`}>
                    <Text
                      style={[
                        tailwind`text-3xl font-bold mb-4`,
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

                <View style={tailwind`mt-12`}>
                  <Text
                    style={[
                      tailwind`text-3xl font-bold mb-4`,
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

                <View style={tailwind`mt-12`}>
                  <Text
                    style={[
                      tailwind`text-3xl font-bold mb-4`,
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
                              value={limitString(
                                socials.instagram || PLACEHOLDER,
                              )}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={tailwind`pr-2 w-1/2`}>
                            <SingleInfoFull
                              label="instagram"
                              value={limitString(
                                socials.instagram || PLACEHOLDER,
                              )}
                            />
                          </View>
                        )}
                        {socials.twitter ? (
                          <TouchableOpacity
                            onPress={() => Linking.openURL(socials.twitter)}
                            style={tailwind`pr-2 w-1/2`}>
                            <SingleInfoFull
                              label="twitter"
                              value={limitString(
                                socials.twitter || PLACEHOLDER,
                              )}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={tailwind`pr-2 w-1/2`}>
                            <SingleInfoFull
                              label="twitter"
                              value={limitString(
                                socials.twitter || PLACEHOLDER,
                              )}
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
                              value={limitString(
                                socials.facebook || PLACEHOLDER,
                              )}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={tailwind`pr-2 w-1/2`}>
                            <SingleInfoFull
                              label="facebook"
                              value={limitString(
                                socials.facebook || PLACEHOLDER,
                              )}
                            />
                          </View>
                        )}
                        {socials.linkedin ? (
                          <TouchableOpacity
                            onPress={() => Linking.openURL(socials.linkedin)}
                            style={tailwind`pr-2 w-1/2`}>
                            <SingleInfoFull
                              label="linkedin"
                              value={limitString(
                                socials.linkedin || PLACEHOLDER,
                              )}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={tailwind`pr-2 w-1/2`}>
                            <SingleInfoFull
                              label="linkedin"
                              value={limitString(
                                socials.linkedin || PLACEHOLDER,
                              )}
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

                <View style={tailwind` mb-4 mt-8`}>
                  <TouchableOpacity
                    onPress={() => setShowReportBlockModal(true)}
                    style={[
                      tailwind`w-full py-3 px-4 rounded-lg`,
                      {backgroundColor: themeColors.primary},
                    ]}>
                    <Text
                      style={tailwind`text-white text-lg font-semibold text-center`}>
                      Block / Report
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </>
      )}

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
              {backgroundColor: themeColors.darkSecondary},
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
          style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-60 px-4`}>
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
                      color: selectedReason === reason ? 'white' : 'gray',
                    },
                  ]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Conditionally show input for "Other" */}
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
              tailwind`w-11/12 rounded-2xl p-5`,
              {backgroundColor: themeColors.darkGrey},
            ]}>
            <Text style={tailwind`text-xl font-bold text-white mb-3`}>
              How Compatibility Is Calculated
            </Text>

            <Text style={tailwind`text-base text-gray-300 mb-3`}>
              Your compatibility score is calculated by comparing values,
              habits, religious views, relationship goals, and lifestyle
              preferences between you and this profile.
            </Text>

            <Text
              style={tailwind`text-base text-yellow-300 font-semibold mb-4`}>
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
    </View>
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
