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
  const {userId} = useProfile();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [superlikeMessage, setSuperlikeMessage] = useState('');
  const [photoIndex, setPhotoIndex] = useState(0);

  const [showReportBlockModal, setShowReportBlockModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  if (!profile) return null;

  const user = profile;
  const about = user?.About?.[0] ?? {};
  const anger = user?.Anger ?? {};
  const attachment = user?.Attachment ?? {};
  const career = user?.Career?.[0] ?? {};
  const communicationStyles = user?.Communication ?? [];
  const core = user?.Core[0] ?? [];
  const emotions = user?.Emotions[0] ?? [];
  const future = user?.Future[0] ?? [];
  const lifestyle = user?.Lifestyle[0] ?? [];
  const loveLanguages = user?.Love ?? [];
  const photos = user?.Photos ?? [];
  const preferences = user?.Preferences[0] ?? [];
  const prompts = user?.Prompts ?? [];
  const survey = user?.Survey[0] ?? [];
  const time = user?.Time ?? [];
  const tags = user?.Tags ?? [];
  const values: Value[] = user?.Values ?? [];
  const prompt = prompts?.[0];
  const age = user?.dob ? getAgeFromDOB(user.dob) : '—';
  const drink = about?.drink;
  const name = user?.name ?? 'N/A';
  const smoke = about?.smoke;
  const hasKids = about?.hasKids;
  let background: string[] = [];

  try {
    if (typeof about?.background === 'string') {
      background = about.background.includes('[')
        ? JSON.parse(about.background)
        : about.background.split(',').map(s => s.trim());
    } else if (Array.isArray(about?.background)) {
      background = about.background;
    }
  } catch (e) {
    console.warn('Failed to parse background:', about?.background, e);
    background = [];
  }
  const religion = about?.religion;
  const job = career?.job;
  const company = career?.company;
  const height = user?.height;
  const lookingFor = about?.lookingFor;
  const timeline = about?.timeline;
  const sect = about?.sect;
  const profileId = user?._id ?? user?.userId;

  const photoUrl = photos?.[photoIndex]?.photoUrl;

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

      {!showFullProfile ? (
        <>
          <View
            style={[
              tailwind`absolute bottom-42 left-4 right-4 rounded-4`,
              {backgroundColor: themeColors.darkSecondaryOpacity},
            ]}>
            <View
              style={tailwind`flex-row justify-between items-center p-4 pb-2`}>
              <View style={tailwind`flex-row justify-between w-full items-end`}>
                <Text
                  style={[
                    tailwind`text-3xl font-bold`,
                    {color: themeColors.primary},
                  ]}>
                  {name} {`(${age})`}
                </Text>
                <Text
                  style={[
                    tailwind`text-3xl font-semibold`,
                    {color: themeColors.primary},
                  ]}>
                  <View style={tailwind`flex-row flex-wrap items-center`}>
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
                </Text>
              </View>
            </View>

            <View style={tailwind` px-4`}>
              <Text style={tailwind`text-base text-gray-800`}>
                {height ? `${height} • ` : ''}
                {religion ? `${religion}${sect ? ` (${sect})` : ''} • ` : ''}
                {job ?? ''}
              </Text>
            </View>

            {(lookingFor || timeline) && (
              <View style={tailwind`mt-1 px-4`}>
                <Text style={tailwind`font-semibold text-base text-gray-900`}>
                  {lookingFor}
                  {lookingFor && timeline ? ' • ' : ''}
                  {timeline}
                </Text>
              </View>
            )}

            {prompt?.prompt && (
              <View style={tailwind`mt-2 px-4`}>
                <Text style={tailwind`text-lg italic`}>{prompt.prompt}</Text>
              </View>
            )}
            {prompt?.response && (
              <View style={tailwind`mt-2 px-4 pb-3`}>
                <Text numberOfLines={1} style={tailwind`font-semibold text-lg`}>
                  {`"${prompt.response}"`}
                </Text>
              </View>
            )}

            <TouchableWithoutFeedback onPress={handleToggleFullProfile}>
              <View
                style={[
                  tailwind`flex flex-row items-center justify-between rounded-5 p-4`,
                  {backgroundColor: themeColors.darkSecondary},
                ]}>
                <Text
                  style={[
                    tailwind`text-lg font-semibold`,
                    {color: themeColors.primary},
                  ]}>
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
            style={tailwind`absolute z-20 bottom-23 left-4 right-4 rounded-5 flex flex-row items-center justify-center`}>
            <View
              style={[
                tailwind`w-full flex flex-row items-center justify-center rounded-4 py-2`,
                {backgroundColor: themeColors.darkSecondaryOpacity},
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
                onPress={handleOpenSuperlikeModal}
                style={[
                  tailwind`p-3 rounded-full shadow-lg mx-7`,
                  {
                    backgroundColor: isInteracting
                      ? '#6ee7b7'
                      : themeColors.primary,
                  },
                ]}>
                <Heart height={30} width={30} color={'white'} strokeWidth={3} />
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
            style={tailwind`absolute z-20 bottom-23 left-4 right-4 rounded-5 flex flex-row items-center justify-center`}>
            <View
              style={[
                tailwind`w-full flex flex-row items-center justify-center rounded-4 py-2`,
                {backgroundColor: themeColors.darkSecondaryOpacity},
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
                onPress={handleOpenSuperlikeModal}
                style={[
                  tailwind`p-3 rounded-full shadow-lg mx-7`,
                  {
                    backgroundColor: isInteracting
                      ? '#6ee7b7'
                      : themeColors.primary,
                  },
                ]}>
                <Heart height={30} width={30} color={'white'} strokeWidth={3} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLikeProfile}
                style={tailwind`p-3 rounded-full shadow-lg bg-emerald-500`}>
                <Check height={24} width={24} color={'white'} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={tailwind`absolute z-20 bottom-42 left-4 right-4`}>
            <TouchableWithoutFeedback onPress={handleToggleFullProfile}>
              <View
                style={[
                  tailwind`flex flex-row items-center justify-between rounded-5 p-4`,
                  {backgroundColor: themeColors.darkSecondary},
                ]}>
                <Text
                  style={[
                    tailwind`text-lg font-semibold`,
                    {color: themeColors.primary},
                  ]}>
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
              tailwind`absolute top-16 bottom-42 left-4 right-4 rounded-5`,
              {backgroundColor: themeColors.darkSecondaryOpacity},
            ]}>
            <ScrollView
              style={tailwind`flex-1 p-4 pt-6`}
              contentContainerStyle={tailwind``}
              showsVerticalScrollIndicator={false}>
              <View style={tailwind`pb-12`}>
                <Text
                  style={[
                    tailwind`text-4xl font-bold`,
                    {color: themeColors.primary},
                  ]}>
                  {name}
                </Text>
                <View style={tailwind`mt-8 flex flex-col`}>
                  <View style={tailwind`flex flex-row items-center`}>
                    <View style={tailwind`pr-2 w-1/2`}>
                      <SingleInfoFull label="Height" value={height} />
                    </View>
                    <View style={tailwind`w-1/2`}>
                      <SingleInfoFull label="Age" value={`${age} years old`} />
                    </View>
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    <View style={tailwind`pr-2 w-1/2`}>
                      <SingleInfoFull
                        label="Looking For"
                        value={lookingFor ? `${lookingFor}` : ''}
                      />
                    </View>
                    <View style={tailwind`w-1/2`}>
                      <SingleInfoFull label="Timeline" value={timeline} />
                    </View>
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    <View style={tailwind`pr-2 w-1/2`}>
                      <SingleInfoFull
                        label="Drinking"
                        value={drink ? `${drink}` : 'Unknown'}
                      />
                    </View>
                    <View style={tailwind`w-1/2`}>
                      <SingleInfoFull
                        label="Smoking"
                        value={smoke ? `${smoke}` : 'Unknown'}
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
                      <SingleInfoFull label="Relocate" value={about.travel} />
                    </View>
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    <View style={tailwind`pr-2 w-1/2`}>
                      <SingleInfoFull label="Religion" value={religion} />
                    </View>
                    <View style={tailwind`w-1/2`}>
                      <SingleInfoFull
                        label="Sect"
                        value={sect ? `${sect}` : 'Unknown'}
                      />
                    </View>
                  </View>

                  <View style={tailwind`flex flex-row items-center mt-12`}>
                    <View style={tailwind`pr-2 w-full`}>
                      <SingleInfoFull
                        label="Career"
                        value={`${job} @ ${company}`}
                      />
                    </View>
                  </View>
                  <View style={tailwind`flex flex-row items-center mt-2`}>
                    <View style={tailwind`pr-2 w-full`}>
                      <SingleInfoFull
                        label="Education"
                        value={
                          career.education ? `${career.education}` : 'Unknown'
                        }
                      />
                    </View>
                  </View>
                  {career.fiveYears ? (
                    <View style={tailwind`flex flex-row items-center mt-2`}>
                      <View style={tailwind`pr-2 w-full`}>
                        <SingleInfoFull
                          label="Five Years"
                          value={career.fiveYears}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>

                {prompts.filter((p: Prompt) => p.response)?.length > 0 && (
                  <View style={tailwind`mt-4`}>
                    <Text
                      style={[
                        tailwind`text-3xl font-bold mb-1`,
                        {color: themeColors.primary},
                      ]}>
                      Prompts
                    </Text>
                    {prompts.map(
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
                )}

                <View style={tailwind`mt-4`}>
                  <Text
                    style={[
                      tailwind`text-3xl font-bold mb-4`,
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
                        <SingleInfoFull label="Honesty" value={core.honest} />
                      </View>
                      <View style={tailwind`w-1/2`}>
                        <SingleInfoFull label="Trust" value={core.trust} />
                      </View>
                    </View>
                    <View style={tailwind`flex flex-row items-center mt-2`}>
                      <View style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="Transparent"
                          value={core.transparent}
                        />
                      </View>
                      <View style={tailwind`w-1/2`}>
                        <SingleInfoFull label="Social" value={core.social} />
                      </View>
                    </View>
                    <View style={tailwind`flex flex-row items-center mt-2`}>
                      <View style={tailwind`pr-2 w-1/2`}>
                        <SingleInfoFull
                          label="Politics"
                          value={core.politics}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {tags.length > 0 && (
                  <View style={tailwind`mt-3`}>
                    <Text
                      style={[
                        tailwind`text-3xl font-bold mb-4`,
                        {color: themeColors.primary},
                      ]}>
                      Interests
                    </Text>
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
                  </View>
                )}

                <View style={tailwind`mt-4`}>
                  <Text
                    style={[
                      tailwind`text-3xl font-bold mb-4`,
                      {color: themeColors.primary},
                    ]}>
                    Lifestyle
                  </Text>
                  {profile.tier === 1 ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Profiles')}
                      style={[
                        tailwind`px-5 py-4 rounded-lg`,
                        {
                          backgroundColor: themeColors.darkSecondary,
                        },
                      ]}>
                      <Text
                        style={[
                          tailwind`text-lg font-semibold text-center`,
                          {color: themeColors.primary},
                        ]}>
                        This section is locked.
                      </Text>
                      <Text
                        style={[
                          tailwind`text-base  text-center mt-1`,
                          {color: themeColors.primary},
                        ]}>
                        Upgrade to Pro to view full profile insights like
                        lifestyle, career, and more.
                      </Text>
                      <Text
                        style={[
                          tailwind`text-lg font-bold text-yellow-800 text-center mt-2 underline`,
                          {color: themeColors.primary},
                        ]}>
                        Tap here to upgrade
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={tailwind`flex flex-col`}>
                      <View style={tailwind`flex flex-row items-center`}>
                        <View style={tailwind`pr-2 w-1/2`}>
                          <SingleInfoFull
                            label="Travelling"
                            value={lifestyle.travel}
                          />
                        </View>
                        <View style={tailwind`w-1/2`}>
                          <SingleInfoFull
                            label="Social"
                            value={lifestyle.social}
                          />
                        </View>
                      </View>
                      <View style={tailwind`flex flex-row items-center mt-2`}>
                        <View style={tailwind`pr-2 w-1/2`}>
                          <SingleInfoFull
                            label="Health"
                            value={lifestyle.health}
                          />
                        </View>
                        <View style={tailwind`w-1/2`}>
                          <SingleInfoFull
                            label="Finances"
                            value={lifestyle.finances}
                          />
                        </View>
                      </View>
                      <View style={tailwind`flex flex-row items-center mt-2`}>
                        <View style={tailwind`pr-2 w-1/2`}>
                          <SingleInfoFull
                            label="Living"
                            value={lifestyle.living}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                {loveLanguages.length > 0 && (
                  <View style={tailwind`mt-4`}>
                    <Text
                      style={[
                        tailwind`text-3xl font-bold mb-4`,
                        {color: themeColors.primary},
                      ]}>
                      Love Languages
                    </Text>
                    {profile.tier === 1 ? (
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Profiles')}
                        style={[
                          tailwind`px-5 py-4 rounded-lg`,
                          {
                            backgroundColor: themeColors.darkSecondary,
                          },
                        ]}>
                        <Text
                          style={[
                            tailwind`text-lg font-semibold text-center`,
                            {color: themeColors.primary},
                          ]}>
                          This section is locked.
                        </Text>
                        <Text
                          style={[
                            tailwind`text-base  text-center mt-1`,
                            {color: themeColors.primary},
                          ]}>
                          Upgrade to Pro to view full profile insights like
                          lifestyle, career, and more.
                        </Text>
                        <Text
                          style={[
                            tailwind`text-lg font-bold text-yellow-800 text-center mt-2 underline`,
                            {color: themeColors.primary},
                          ]}>
                          Tap here to upgrade
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                        {loveLanguages.map((item: LoveLanguage, index) => (
                          <View key={index} style={tailwind`pr-2 w-full mb-2`}>
                            <SingleInfoFull
                              label={''}
                              value={item.language.replace(/[\[\]"]/g, '')}
                            />
                          </View>
                        ))}
                      </>
                    )}
                  </View>
                )}

                {values.length > 0 && (
                  <View style={tailwind`mt-4`}>
                    <Text
                      style={[
                        tailwind`text-3xl font-bold mb-4`,
                        {color: themeColors.primary},
                      ]}>
                      Traits
                    </Text>
                    {profile.tier === 1 ? (
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Profiles')}
                        style={[
                          tailwind`px-5 py-4 rounded-lg`,
                          {
                            backgroundColor: themeColors.darkSecondary,
                          },
                        ]}>
                        <Text
                          style={[
                            tailwind`text-lg font-semibold text-center`,
                            {color: themeColors.primary},
                          ]}>
                          This section is locked.
                        </Text>
                        <Text
                          style={[
                            tailwind`text-base  text-center mt-1`,
                            {color: themeColors.primary},
                          ]}>
                          Upgrade to Pro to view full profile insights like
                          lifestyle, career, and more.
                        </Text>
                        <Text
                          style={[
                            tailwind`text-lg font-bold text-yellow-800 text-center mt-2 underline`,
                            {color: themeColors.primary},
                          ]}>
                          Tap here to upgrade
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={tailwind`flex flex-row flex-wrap`}>
                        {values.map((item: Value, index) => (
                          <View key={index} style={tailwind`pr-2 w-1/2 mb-2`}>
                            <SingleInfoFull
                              label={''}
                              value={item.value.replace(/[\[\]"]/g, '')}
                            />
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                <View style={tailwind`mt-4`}>
                  <Text
                    style={[
                      tailwind`text-3xl font-bold mb-4`,
                      {color: themeColors.primary},
                    ]}>
                    Future Goals
                  </Text>
                  {profile.tier === 1 ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Profiles')}
                      style={[
                        tailwind`px-5 py-4 rounded-lg mb-6`,
                        {
                          backgroundColor: themeColors.darkSecondary,
                        },
                      ]}>
                      <Text
                        style={[
                          tailwind`text-lg font-semibold text-center`,
                          {color: themeColors.primary},
                        ]}>
                        This section is locked.
                      </Text>
                      <Text
                        style={[
                          tailwind`text-base  text-center mt-1`,
                          {color: themeColors.primary},
                        ]}>
                        Upgrade to Pro to view full profile insights like
                        lifestyle, career, and more.
                      </Text>
                      <Text
                        style={[
                          tailwind`text-lg font-bold text-yellow-800 text-center mt-2 underline`,
                          {color: themeColors.primary},
                        ]}>
                        Tap here to upgrade
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={tailwind`flex flex-col mb-6`}>
                      <View style={tailwind`flex flex-row items-center`}>
                        <View style={tailwind`pr-2 w-1/2`}>
                          <SingleInfoFull
                            label="Desired Marriage"
                            value={future.marriage}
                          />
                        </View>
                        <View style={tailwind`w-1/2`}>
                          <SingleInfoFull
                            label="Children"
                            value={future.children}
                          />
                        </View>
                      </View>
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
                    </View>
                  )}
                </View>
                <View style={tailwind` mb-4`}>
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
                {backgroundColor: themeColors.darkSecondary},
              ]}>
              <Text style={tailwind`text-xl font-bold text-center mb-4`}>
                Add a message (Optional)
              </Text>
              <TextInput
                style={tailwind`border border-gray-600 rounded-md p-3 mb-4 text-base h-24`}
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
                  style={tailwind`px-5 py-3 rounded-md bg-gray-200`}>
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
