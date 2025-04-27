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
} from 'react-native';
import tailwind from 'twrnc';
import {Check, Heart, X, ChevronsDown, Send} from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import cheers from '../../Assets/cheers.png';
import baby from '../../Assets/baby.png';
import ciggy from '../../Assets/cigarette.png';
import {countryFlagMap} from '../../Utils/FlagMaps';
import SingleInfoFull from '../Info/SingleInfoFull';

interface FeedSummaryProps {
  profile: any;
  likesLeft?: number;
  dislikeProfile: (profileId: string) => void;
  likeProfile: (profileId: string) => void;
  superlikeProfile: (profileId: string, message?: string) => void;
  isInteracting?: boolean;
}

const {width: screenWidth} = Dimensions.get('window');

const FeedProfileComponent: React.FC<FeedSummaryProps> = ({
  profile,
  dislikeProfile,
  likeProfile,
  superlikeProfile,
  isInteracting = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [superlikeMessage, setSuperlikeMessage] = useState('');
  const [isFullProfileVisible, setIsFullProfileVisible] = useState(false);

  if (!profile) return null;

  const user = profile;
  const about = user?.About?.[0] ?? {};
  const career = user?.Career?.[0] ?? {};
  const photoUrl = user?.Photos?.[0]?.photoUrl;
  const name = user?.name ?? 'N/A';
  const age = user?.dob ? getAgeFromDOB(user.dob) : '—';
  const drink = about?.drink;
  const smoke = about?.smoke;
  const hasKids = about?.hasKids;
  const background = about?.background;
  const religion = about?.religion;
  const job = career?.job;
  const company = career?.company;
  const height = user?.height;
  const lookingFor = about?.lookingFor;
  const timeline = about?.timeline;
  const sect = about?.sect;
  const prompt = user?.Prompts?.[0];
  const tags = user?.Tags?.map(t => t.tag) || [];
  const profileId = user?._id ?? user?.userId;

  const handleOpenSuperlikeModal = () => {
    if (isInteracting) return;
    setIsModalVisible(true);
  };

  const handleSendSuperlike = () => {
    if (!profileId) {
      console.error('Cannot super like profile, profile ID is missing.');
      setIsFullProfileVisible(false);
      setIsModalVisible(false);
      setSuperlikeMessage('');
      return;
    }
    setIsFullProfileVisible(false);
    setIsModalVisible(false);
    superlikeProfile(profileId, superlikeMessage.trim());
    setSuperlikeMessage('');
  };

  const handleLikeProfile = () => {
    if (!profileId) {
      console.error('Cannot like profile, profile ID is missing.');
      setIsFullProfileVisible(false);
      setIsModalVisible(false);
      setSuperlikeMessage('');
    }
    setIsFullProfileVisible(false);
    setIsModalVisible(false);
    likeProfile(profileId);
    setSuperlikeMessage('');
  };

  const handleDislikeProfile = () => {
    if (!profileId) {
      console.error('Cannot dislike profile, profile ID is missing.');
      setIsFullProfileVisible(false);
      setIsModalVisible(false);
      setSuperlikeMessage('');
    }
    setIsFullProfileVisible(false);
    setIsModalVisible(false);
    dislikeProfile(profileId);
    setSuperlikeMessage('');
  };

  const handleCancelModal = () => {
    setIsFullProfileVisible(false);
    setIsModalVisible(false);
    setSuperlikeMessage('');
  };

  return (
    <View style={tailwind`flex-1 relative`}>
      {photoUrl ? (
        <Image
          source={{uri: photoUrl}}
          style={tailwind`absolute w-full h-full`}
          resizeMode="cover"
        />
      ) : (
        <View style={tailwind`absolute w-full h-full bg-gray-300`} />
      )}

      <View
        style={[
          tailwind`absolute bottom-6 left-4 right-4 rounded-8 p-4 pb-18`,
          {backgroundColor: 'rgba(214, 203, 182, .8)'},
        ]}>
        {/* Profile Header */}
        <View style={tailwind`flex-row justify-between items-center`}>
          <View style={tailwind`flex-row justify-between w-full items-end`}>
            <Text style={tailwind`text-3xl font-bold text-green-900`}>
              {name} {`(${age})`}
            </Text>
            <Text style={tailwind`text-3xl font-semibold`}>
              {countryFlagMap[background] ?? ''}
            </Text>
          </View>
        </View>

        {/* About */}
        <View style={tailwind`mt-1`}>
          <Text style={tailwind`text-base text-gray-800`}>
            {height ? `${height} • ` : ''}
            {religion ? `${religion}${sect ? ` (${sect})` : ''} • ` : ''}
            {job ?? ''}
          </Text>
        </View>

        {(lookingFor || timeline) && (
          <View style={tailwind`mt-1`}>
            <Text style={tailwind`font-semibold text-base text-gray-900`}>
              {lookingFor}
              {lookingFor && timeline ? ' • ' : ''}
              {timeline}
            </Text>
          </View>
        )}

        {/* Lifestyle */}
        <View style={tailwind`mt-2 w-full flex flex-row items-center`}>
          {drink && (
            <View style={tailwind`flex flex-row items-center mr-2`}>
              <Image style={tailwind`h-6 w-6`} source={cheers} />
              <Text style={tailwind`text-lg ml-2`}>{drink}</Text>
            </View>
          )}
          {smoke && (
            <View style={tailwind`flex flex-row items-center mr-2`}>
              <Image style={tailwind`h-6 w-6`} source={ciggy} />
              <Text style={tailwind`text-lg ml-2`}>{smoke}</Text>
            </View>
          )}
          {hasKids === 'Yes' && (
            <View style={tailwind`flex flex-row items-center`}>
              <Image style={tailwind`h-6 w-6`} source={baby} />
              <Text style={tailwind`text-lg ml-2`}>{hasKids}</Text>
            </View>
          )}
        </View>

        {/* Prompts */}
        {prompt?.prompt && (
          <View style={tailwind`mt-2`}>
            <Text style={tailwind`text-lg italic`}>{prompt.prompt}</Text>
          </View>
        )}
        {prompt?.response && (
          <View style={tailwind``}>
            <Text numberOfLines={3} style={tailwind`font-semibold text-lg`}>
              {`"${prompt.response}"`}
            </Text>
          </View>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tailwind`mt-3`}>
            {tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  tailwind`px-4 py-1 mr-2 rounded-full border`,
                  {
                    borderColor: themeColors.primary,
                    backgroundColor: themeColors.darkSecondary,
                    borderWidth: 1,
                  },
                ]}>
                <Text style={tailwind`text-green-900 font-semibold`}>
                  {tag}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Buttons */}
        <View
          style={tailwind`w-full flex flex-row items-center justify-between mt-4`}>
          {/* Chevron Button */}
          <TouchableOpacity
            onPress={() => setIsFullProfileVisible(true)}
            style={tailwind`p-3 rounded-full bg-neutral-200`}>
            <ChevronsDown
              height={22}
              width={22}
              color="black"
              strokeWidth={3}
            />
          </TouchableOpacity>

          {/* Like / Dislike / Superlike */}
          <View style={tailwind`flex flex-row items-center`}>
            <TouchableOpacity
              onPress={handleDislikeProfile}
              style={tailwind`p-3 rounded-full bg-red-400`}>
              <X height={22} width={22} color="white" strokeWidth={3} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLikeProfile}
              style={[
                tailwind`p-4 rounded-full ml-4 shadow-lg`,
                {backgroundColor: isInteracting ? '#6ee7b7' : '#34d399'},
              ]}>
              <Check height={28} width={28} color="white" strokeWidth={3} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenSuperlikeModal}
              style={[
                tailwind`p-4 rounded-full ml-4`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Heart height={26} width={26} color="white" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Super Like Modal */}
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
      <Modal
        animationType="slide"
        transparent={false}
        visible={isFullProfileVisible}
        onRequestClose={() => setIsFullProfileVisible(false)}>
        <View
          style={[
            tailwind`flex-1 relative`,
            {backgroundColor: themeColors.secondary},
          ]}>
          {/* Floating Action Buttons */}
          <View style={tailwind`absolute bottom-8 right-4 z-50`}>
            <View style={tailwind`items-center space-y-4`}>
              {/* Dislike Button */}
              <TouchableOpacity
                onPress={() => {
                  setIsFullProfileVisible(false);
                  setTimeout(() => {
                    if (profileId && !isInteracting) dislikeProfile(profileId);
                  }, 300); // Wait a little so modal can close smoothly
                }}
                style={tailwind`p-3 rounded-full bg-red-400 shadow-lg`}>
                <X height={24} width={24} color="white" strokeWidth={3} />
              </TouchableOpacity>

              {/* Like Button */}
              <TouchableOpacity
                onPress={() => {
                  setIsFullProfileVisible(false);
                  setTimeout(() => {
                    if (profileId && !isInteracting) likeProfile(profileId);
                  }, 300);
                }}
                style={[
                  tailwind`p-4 rounded-full shadow-lg mt-2`,
                  {backgroundColor: isInteracting ? '#6ee7b7' : '#34d399'},
                ]}>
                <Check height={32} width={32} color="white" strokeWidth={3} />
              </TouchableOpacity>

              {/* Superlike Button */}
              <TouchableOpacity
                onPress={() => {
                  setIsFullProfileVisible(false);
                  setTimeout(() => {
                    setIsModalVisible(true); // 🟰 open the message modal instead of sending immediately
                  }, 300);
                }}
                style={[
                  tailwind`p-4 rounded-full shadow-lg mt-2`,
                  {backgroundColor: themeColors.primary},
                ]}>
                <Heart height={32} width={32} color="white" strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={tailwind`flex-1 pt-16`}
            contentContainerStyle={tailwind`pb-8`}
            showsVerticalScrollIndicator={false}>
            {/* Photos Section */}
            <View>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={tailwind`w-full`}>
                {user.Photos?.length > 0 ? (
                  user.Photos.map((photo, index) => (
                    <Image
                      key={index}
                      source={{uri: photo.photoUrl}}
                      style={{width: screenWidth, aspectRatio: 4 / 5}}
                      resizeMode="cover"
                    />
                  ))
                ) : (
                  <View
                    style={{width: screenWidth, height: (screenWidth * 4) / 5}}
                    className="bg-gray-300 justify-center items-center">
                    <Text>No Images</Text>
                  </View>
                )}
              </ScrollView>

              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setIsFullProfileVisible(false)}
                style={tailwind`absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg`}>
                <X height={24} width={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Profile Info */}
            <View style={tailwind`p-5 mt-4`}>
              <Text style={tailwind`text-4xl font-bold text-green-900`}>
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
                      value={`${countryFlagMap[background]} ${background}`}
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

              {/* Communication Style */}
              {user?.Communication?.length > 0 && (
                <View style={tailwind`mt-12`}>
                  <Text
                    style={tailwind`text-3xl font-bold text-green-900 mb-4`}>
                    Communication Style
                  </Text>
                  <View style={tailwind`flex flex-col flex-wrap`}>
                    {user.Communication.map((item: any, index: number) => (
                      <View key={index} style={tailwind`pr-2 w-full mb-2`}>
                        <SingleInfoFull
                          label={''}
                          value={item.style.replace(/[\[\]"]/g, '')}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Love Language */}
              {user?.Love?.length > 0 && (
                <View style={tailwind`mt-4`}>
                  <Text
                    style={tailwind`text-3xl font-bold text-green-900 mb-4`}>
                    Love Languages
                  </Text>
                  {user.Love.map((item: any, index: number) => (
                    <View key={index} style={tailwind`pr-2 w-full mb-2`}>
                      <SingleInfoFull
                        label={''}
                        value={item.language.replace(/[\[\]"]/g, '')}
                      />
                    </View>
                  ))}
                </View>
              )}

              {/* Prompts */}
              {user?.Prompts?.filter((p: any) => p.response)?.length > 0 && (
                <View style={tailwind`mt-4`}>
                  <Text
                    style={tailwind`text-3xl font-bold text-green-900 mb-4`}>
                    Prompts
                  </Text>
                  {user.Prompts.map(
                    (item: any, index: number) =>
                      item.response && (
                        <View style={tailwind`w-full`} key={index}>
                          <SingleInfoFull
                            label={prompt.prompt}
                            value={prompt.response}
                          />
                        </View>
                      ),
                  )}
                </View>
              )}

              {/* Values */}
              {user?.Values?.length > 0 && (
                <View style={tailwind`mt-4`}>
                  <Text
                    style={tailwind`text-3xl font-bold text-green-900 mb-4`}>
                    Values
                  </Text>
                  <View style={tailwind`flex flex-row flex-wrap`}>
                    {user.Values.map((item: any, index: number) => (
                      <View key={index} style={tailwind`pr-2 w-1/2 mb-2`}>
                        <SingleInfoFull
                          label={''}
                          value={item.value.replace(/[\[\]"]/g, '')}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <View style={tailwind`mt-8`}>
                  <Text
                    style={tailwind`text-3xl font-bold text-green-900 mb-4`}>
                    Interests
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tailwind`flex-row mt-2`}>
                    {tags.map((tag, idx) => (
                      <View
                        key={idx}
                        style={[
                          tailwind`px-4 py-2 mr-2 rounded-full border`,
                          {
                            borderColor: themeColors.primary,
                            backgroundColor: themeColors.darkSecondary,
                          },
                        ]}>
                        <Text style={tailwind`text-green-900 font-semibold`}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
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
