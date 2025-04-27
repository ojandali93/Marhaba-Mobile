import React, { useState } from 'react';
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
  Keyboard, TouchableWithoutFeedback
} from 'react-native';
import tailwind from 'twrnc';
import {
  Check,
  Heart,
  X,
  ChevronsDown,
  Send,
} from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import cheers from '../../Assets/cheers.png';
import baby from '../../Assets/baby.png';
import ciggy from '../../Assets/cigarette.png';
import { countryFlagMap } from '../../Utils/FlagMaps';

interface FeedSummaryProps {
  profile: any;
  likesLeft?: number;
  dislikeProfile: (profileId: string) => void;
  likeProfile: (profileId: string) => void;
  superlikeProfile: (profileId: string, message?: string) => void;
  isInteracting?: boolean;
}

const FeedProfileComponent: React.FC<FeedSummaryProps> = ({
  profile,
  dislikeProfile,
  likeProfile,
  superlikeProfile,
  isInteracting = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [superlikeMessage, setSuperlikeMessage] = useState('');

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
      console.error("Cannot superlike, profile ID is missing.");
      setIsModalVisible(false);
      setSuperlikeMessage('');
      return;
    }
    superlikeProfile(profileId, superlikeMessage.trim());
    setIsModalVisible(false);
    setSuperlikeMessage('');
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSuperlikeMessage('');
  };

  return (
    <View style={tailwind`flex-1 relative`}>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
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
        <View style={tailwind`w-full flex flex-row items-center justify-between mt-4`}>
          {/* Chevron Button */}
          <View>
            <TouchableOpacity style={tailwind`p-3 rounded-full bg-neutral-200`}>
              <ChevronsDown height={22} width={22} color="black" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          {/* Like / Dislike / Superlike */}
          <View style={tailwind`flex flex-row items-center`}>
            <TouchableOpacity
              onPress={() => profileId && !isInteracting && dislikeProfile(profileId)}
              style={tailwind`p-3 rounded-full bg-red-400`}>
              <X height={22} width={22} color="white" strokeWidth={3} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => profileId && !isInteracting && likeProfile(profileId)}
              style={[
                tailwind`p-4 rounded-full ml-4 shadow-lg`,
                { backgroundColor: isInteracting ? '#6ee7b7' : '#34d399' },
              ]}>
              <Check height={28} width={28} color="white" strokeWidth={3} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenSuperlikeModal}
              style={[tailwind`p-4 rounded-full ml-4`, { backgroundColor: themeColors.primary }]}>
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
  onRequestClose={handleCancelModal}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tailwind`flex-1 justify-center bg-black bg-opacity-50 px-4`}
    >
      <View style={[tailwind`bg-white p-5 rounded-xl`, {backgroundColor: themeColors.darkSecondary}]}>
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
            <Text style={tailwind`text-base font-semibold text-gray-700`}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSendSuperlike}
            style={[
              tailwind`px-5 py-3 rounded-md flex-row items-center`,
              { backgroundColor: themeColors.primary }
            ]}
          >
            <Send height={18} width={18} color="white" />
            <Text style={tailwind`text-base font-semibold text-white ml-2`}>
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
    console.error("Error parsing DOB:", e);
    return '—';
  }
}

export default FeedProfileComponent;
