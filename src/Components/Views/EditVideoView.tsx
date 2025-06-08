import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import tailwind from 'twrnc';
import {useProfile} from '../../Context/ProfileContext';
import themeColors from '../../Utils/custonColors';
import {
  Camera,
  ChevronsDown,
  ChevronsUp,
  X,
  Play,
  Pause,
  Repeat,
} from 'react-native-feather';
import Video from 'react-native-video';
import axios from 'axios';
import {pickVideoFromGallery} from '../../Utils/Functions/ImageFunctions';

const EditVideoView = () => {
  const {profile, userId, grabUserProfile} = useProfile();

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [originalVideoUrl, setOriginalVideoUrl] = useState<string | null>(null);
  const [expandVideo, setExpandVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadVideo();
    }, [profile]),
  );

  const loadVideo = () => {
    const about = profile?.About?.[0];
    const url = about?.videoIntro || null;

    setVideoUrl(url);
    setOriginalVideoUrl(url);
  };

  const hasVideoChanges = () => {
    return videoUrl !== originalVideoUrl;
  };

  const updateUserVideo = async () => {
    try {
      if (!userId) throw new Error('User ID not available');

      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/account/updateVideo',
        {
          userId,
          videoIntro: videoUrl,
        },
      );

      if (response.data.success) {
        await grabUserProfile(userId);
        loadVideo();
        setExpandVideo(false);
        return {success: true, data: response.data.data};
      } else {
        console.warn('⚠️ Failed to update video:', response.data.error);
        setExpandVideo(false);
        return {success: false, error: response.data.error};
      }
    } catch (error) {
      console.error('❌ Error updating video:', error.message || error);
      setExpandVideo(false);
      return {success: false, error: error.message || 'Unknown error'};
    }
  };

  const handlePickVideo = async () => {
    setLoading(true);
    try {
      const video = await pickVideoFromGallery();
      if (!video?.uri) return;
      if (video.duration < 14 || video.duration > 31) {
        Alert.alert(
          'Video duration',
          'Please upload a video between 15 and 30 seconds.',
        );
        return;
      }

      const uploadedVideo = await uploadVideoToServer(video.uri, 'video.mp4');
      if (uploadedVideo) {
        setVideoUrl(uploadedVideo);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Video pick error:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadVideoToServer = async (
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

      return response.data.success ? response.data.url : null;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl(null);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <View style={tailwind`w-full mt-2`}>
      {/* Header */}
      <TouchableOpacity
        style={tailwind`w-full flex flex-col px-2`}
        onPress={() => setExpandVideo(!expandVideo)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <View style={tailwind`flex flex-row items-center`}>
            <Text style={tailwind`text-base font-semibold`}>Intro Video</Text>
            {!videoUrl && (
              <View
                style={tailwind`w-2 h-2 rounded-full bg-orange-400 mr-2 ml-3`}
              />
            )}
          </View>
          {expandVideo ? (
            hasVideoChanges() ? (
              <TouchableOpacity onPress={updateUserVideo}>
                <Text
                  style={[
                    tailwind`text-base font-bold px-2 py-1 rounded-md text-white`,
                    {backgroundColor: themeColors.primary},
                  ]}>
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setExpandVideo(false)}>
                <ChevronsUp
                  height={24}
                  width={24}
                  color={themeColors.primary}
                />
              </TouchableOpacity>
            )
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </View>
      </TouchableOpacity>

      {/* Video */}
      {expandVideo && (
        <View style={tailwind`w-full items-center mt-5 mb-3`}>
          <TouchableOpacity
            onPress={videoUrl ? togglePlayPause : handlePickVideo}
            activeOpacity={0.9}
            style={[
              tailwind`w-11/12 h-150 border-2 items-center justify-center rounded-3 overflow-hidden relative`,
              {
                borderColor: themeColors.primary,
                backgroundColor: themeColors.secondary,
              },
            ]}>
            {videoUrl ? (
              <>
                <Video
                  source={{uri: videoUrl}}
                  style={tailwind`w-full h-full`}
                  paused={!isPlaying}
                  resizeMode="cover"
                />

                {/* Play/Pause */}
                <TouchableOpacity
                  onPress={togglePlayPause}
                  style={tailwind`absolute top-1/2 left-1/2 -mt-6 -ml-6 bg-black bg-opacity-50 rounded-full p-3`}>
                  {isPlaying ? (
                    <Pause height={24} width={24} color="#fff" />
                  ) : (
                    <Play height={24} width={24} color="#fff" />
                  )}
                </TouchableOpacity>

                {/* Remove */}
                <TouchableOpacity
                  onPress={handleRemoveVideo}
                  style={tailwind`absolute top-2 left-2 bg-black bg-opacity-50 rounded-full p-2`}>
                  <X height={18} width={18} color="#fff" />
                </TouchableOpacity>

                {/* Replace */}
                <TouchableOpacity
                  onPress={handlePickVideo}
                  style={tailwind`absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2`}>
                  <Repeat height={18} width={18} color="#fff" />
                </TouchableOpacity>
              </>
            ) : loading ? (
              <ActivityIndicator size="small" color={themeColors.primary} />
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
      )}
    </View>
  );
};

export default EditVideoView;
