import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  ChevronsLeft,
  Camera,
  X,
  Repeat,
  Play,
  Pause,
} from 'react-native-feather';
import ContinueButton from '../../Components/Buttons/ContinueButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {track} from '@amplitude/analytics-react-native';
import Video from 'react-native-video';
import {pickVideoFromGallery} from '../../Utils/Functions/ImageFunctions';
import axios from 'axios';

const screenHeight = Dimensions.get('window').height;

const VideoScreen = () => {
  const navigation = useNavigation();
  const videoRef = useRef(null);

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
    setLoading(true);
    try {
      const video = await pickVideoFromGallery();
      console.log('video from gallery', video);
      if (!video?.uri) return;
      if (video.duration < 14 || video.duration > 31) {
        Alert.alert(
          'Video duration',
          'Please upload a video between 15 and 30 seconds.',
        );
        return;
      }
      const uploadedVideo = await uploadImageToServer(video.uri, 'video.mp4');
      if (uploadedVideo) {
        setVideoUri(uploadedVideo);
        await AsyncStorage.setItem('videoIntro', uploadedVideo);
        setIsPlaying(false);
      }
      setLoading(false);
    } catch (err) {
      console.error('Video pick error:', err);
      setLoading(false);
    }
  };

  const uploadImageToServer = async (
    localUri: string,
    originalFileName: string,
  ) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: localUri,
        name: originalFileName || 'video.mp4',
        type: 'video/quicktime',
      } as any);

      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/account/uploadVideo',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        },
      );

      console.log('response', response.data.url);
      return response.data.success ? response.data.url : null;
    } catch (error) {
      console.error('Upload failed:', error);
      setLoading(false);
      return null;
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleRemoveVideo = async () => {
    setVideoUri(null);
    setIsPlaying(false);
  };

  const redirectToPersonalityScreen = async () => {
    if (!videoUri) {
      Alert.alert('Add a video', 'You need to upload a video to continue.');
      return;
    }
    await AsyncStorage.setItem('videoIntro', videoUri);
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
                  <View>
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
              Upload a 15 - 30 second video introduction.
            </Text>
          </View>
        </View>

        {/* Video Picker */}
        <View style={tailwind`w-full flex items-center mt-5`}>
          <TouchableOpacity
            onPress={videoUri ? togglePlayPause : handlePickVideo}
            activeOpacity={0.9}
            style={[
              tailwind`w-full h-22/24 border-2 items-center justify-center rounded-3 overflow-hidden relative`,
              {
                borderColor: themeColors.primary,
                backgroundColor: themeColors.secondary,
              },
            ]}>
            {videoUri ? (
              <>
                <Video
                  ref={videoRef}
                  source={{uri: videoUri}}
                  style={tailwind`w-full h-full`}
                  paused={!isPlaying}
                  resizeMode="cover"
                />

                {/* Play/Pause Button (center) */}
                <TouchableOpacity
                  onPress={togglePlayPause}
                  style={tailwind`absolute top-1/2 left-1/2 -mt-6 -ml-6 bg-black bg-opacity-50 rounded-full p-3`}>
                  {isPlaying ? (
                    <Pause height={24} width={24} color="#fff" />
                  ) : (
                    <Play height={24} width={24} color="#fff" />
                  )}
                </TouchableOpacity>

                {/* Remove Button (top-left) */}
                <TouchableOpacity
                  onPress={handleRemoveVideo}
                  style={tailwind`absolute top-2 left-2 bg-black bg-opacity-50 rounded-full p-2`}>
                  <X height={18} width={18} color="#fff" />
                </TouchableOpacity>

                {/* Replace Button (top-right) */}
                <TouchableOpacity
                  onPress={handlePickVideo}
                  style={tailwind`absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2`}>
                  <Repeat height={18} width={18} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                {loading ? (
                  <ActivityIndicator size="small" color={themeColors.primary} />
                ) : (
                  <>
                    <Camera
                      height={24}
                      width={24}
                      color={themeColors.primary}
                    />
                    <Text style={tailwind` text-base mt-2`}>
                      Tap to select video
                    </Text>
                  </>
                )}
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
