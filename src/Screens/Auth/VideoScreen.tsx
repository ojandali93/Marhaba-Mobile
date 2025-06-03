import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ChevronsLeft, Camera} from 'react-native-feather';
import ContinueButton from '../../Components/Buttons/ContinueButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {track} from '@amplitude/analytics-react-native';
import Video from 'react-native-video';
import {pickVideoFromGallery} from '../../Utils/Functions/ImageFunctions';

const screenHeight = Dimensions.get('window').height;

const VideoScreen = () => {
  const navigation = useNavigation();

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(true);

  useFocusEffect(
    useCallback(() => {
      track('Video Started');
      loadVideo();
    }, []),
  );

  const loadVideo = async () => {
    try {
      const storedVideo = await AsyncStorage.getItem('videoIntro');
      if (storedVideo) {
        setVideoUri(storedVideo);
      }
    } catch (err) {
      console.error('Error loading video:', err);
    }
  };

  const handlePickVideo = async () => {
    try {
      const video = await pickVideoFromGallery();
      if (!video?.uri) return;

      console.log('✅ Video picked:', video.uri);

      setVideoUri(video.uri);
      await AsyncStorage.setItem('videoIntro', video.uri);
    } catch (err) {
      console.error('Video pick error:', err);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (!videoUri) {
      Alert.alert('Add a video', 'You need to upload a video to continue.');
      return;
    }

    track('Video Completed');
    navigation.navigate('Photos');
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      {/* 🎥 Guidelines Modal */}
      {showGuidelines && (
        <Modal transparent={true} visible={showGuidelines} animationType="fade">
          <View
            style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-60`}>
            <View style={tailwind`w-11/12 bg-white rounded-2xl p-5`}>
              <Text style={tailwind`text-xl font-bold text-center mb-2`}>
                🎥 Profile Video Guidelines
              </Text>
              <Text style={tailwind`text-gray-700 mb-3 text-sm`}>
                Your video is the{' '}
                <Text style={tailwind`font-bold`}>
                  realest first impression
                </Text>{' '}
                you can make! Keep it natural and show your personality.
              </Text>

              <Text style={tailwind`text-sm mb-3 text-red-600`}>
                All videos are reviewed before an account is approved. Follow
                the guidelines below to ensure your account is approved.
              </Text>

              <Text style={tailwind`text-base font-bold mb-1`}>
                ✅ Recommended:
              </Text>
              <Text style={tailwind`text-sm text-gray-800`}>
                • 30-60 seconds long{'\n'}• Clear and good lighting{'\n'}• Speak
                naturally or share about yourself{'\n'}• Smile and have fun!
              </Text>

              <Text style={tailwind`text-base font-bold mt-4 mb-1`}>
                🚫 Avoid:
              </Text>
              <Text style={tailwind`text-sm text-gray-800`}>
                • Videos under 15 seconds or over 60 seconds{'\n'}•
                Inappropriate content{'\n'}• Group videos{'\n'}• AI / deepfake /
                filters hiding identity
              </Text>

              <TouchableOpacity
                onPress={() => setShowGuidelines(false)}
                style={[
                  tailwind`mt-6 py-2 rounded-xl`,
                  {backgroundColor: themeColors.primary},
                ]}>
                <Text
                  style={tailwind`text-center text-white text-lg font-semibold`}>
                  Got it!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Header */}
      <View style={tailwind`w-11/12 h-10/12 flex`}>
        <View style={[tailwind`flex`, {marginTop: screenHeight * 0.07}]}>
          <View style={tailwind`mt-2`}>
            <View
              style={tailwind`w-full flex flex-row items-center justify-between`}>
              <View style={tailwind`flex-1 flex flex-row items-center`}>
                <TouchableWithoutFeedback
                  style={tailwind`w-20 h-20`}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <View style={tailwind``}>
                    <ChevronsLeft
                      height={30}
                      width={30}
                      color={themeColors.primary}
                      style={tailwind`mr-1`}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <Text
                  style={[
                    tailwind`text-3xl font-semibold`,
                    {color: themeColors.primary},
                  ]}>
                  Intro Video
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Photos');
                }}>
                <Text style={tailwind`text-sm text-red-500`}>Skip</Text>
              </TouchableOpacity>
            </View>
            <Text style={tailwind`text-sm mt-3`}>
              Upload a 15 - 60 second video introduction.
            </Text>
          </View>
        </View>

        {/* Video Picker */}
        <View style={tailwind`w-full flex items-center  mt-5`}>
          <TouchableOpacity
            onPress={handlePickVideo}
            style={[
              tailwind`w-full h-22/24 border-2 flex items-center justify-center rounded-3`,
              {
                borderColor: themeColors.primary,
                backgroundColor: themeColors.secondary,
              },
            ]}>
            {videoUri ? (
              <Video
                source={{uri: videoUri}}
                style={tailwind`w-full h-full rounded-2 overflow-hidden`}
                controls
                resizeMode="contain"
              />
            ) : (
              <>
                <Camera height={24} width={24} color={themeColors.primary} />
                <Text style={tailwind` text-base mt-2`}>
                  Tap to select video
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View
        style={tailwind`w-full absolute bottom-0 flex flex-row justify-between px-5 mb-12`}>
        <View style={tailwind`flex flex-row items-center`}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.popToTop();
            }}>
            <View>
              <Text style={tailwind`text-base font-bold text-red-400`}>
                Cancel
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <ContinueButton text={'Photos'} click={redirectToPersonalityScreen} />
      </View>
    </View>
  );
};

export default VideoScreen;
