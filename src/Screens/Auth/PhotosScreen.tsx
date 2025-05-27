import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Camera, ChevronsLeft} from 'react-native-feather';
import {
  cropCenterImageForPhone,
  pickImageFromGallery,
} from '../../Utils/Functions/ImageFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {track} from '@amplitude/analytics-react-native';
import ContinueButton from '../../Components/Buttons/ContinueButton';

const screenHeight = Dimensions.get('window').height;

const PhotosScreen = () => {
  const navigation = useNavigation();

  const [uploadedImageUrls, setUploadedImageUrls] = useState<(string | null)[]>(
    Array(9).fill(null),
  );
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(9).fill(false),
  );
  const [showGuidelines, setShowGuidelines] = useState(true);

  useFocusEffect(
    useCallback(() => {
      track('Photos Started');
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    try {
      const storedImages = await AsyncStorage.getItem('images');
      if (storedImages) {
        const rawArray: (string | null)[] = JSON.parse(storedImages);
        const imageArray = rawArray.map(item => (item?.trim() ? item : null));
        setUploadedImageUrls(imageArray);
        setLoadingStates(Array(12).fill(false));
      }
    } catch (err) {
      console.error('Error parsing images:', err);
    }
  };

  const handlePickImage = async (index: number) => {
    try {
      const image = await pickImageFromGallery();
      if (!image || !image.uri) return;

      const croppedImage = await cropCenterImageForPhone(
        image.uri,
        image.width,
        image.height,
        image.fileName,
      );

      if (!croppedImage?.uri) return;

      setLoadingStates(prev => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });

      const uploadedUrl = await uploadImageToServer(
        croppedImage.uri,
        croppedImage.fileName,
      );

      if (uploadedUrl) {
        setUploadedImageUrls(prev => {
          const updated = [...prev];
          updated[index] = uploadedUrl;
          return updated;
        });
      }
    } catch (error) {
      console.error('Image pick error:', error);
    } finally {
      setLoadingStates(prev => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
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
        name: originalFileName || 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/account/upoadImage',
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

  const redirectToPersonalityScreen = () => {
    const hasImage = uploadedImageUrls.some(img => img !== null);
    if (!hasImage) {
      Alert.alert(
        'Add at least one photo',
        'You need to upload at least one image to continue.',
      );
      return;
    }
    storeNextScreen();
  };

  const storeNextScreen = async () => {
    try {
      await AsyncStorage.setItem('images', JSON.stringify(uploadedImageUrls));
      track('Photos Completed');
      navigation.navigate('Preferences');
    } catch (err) {
      console.error('Failed to store images:', err);
    }
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      {/* 📸 Guidelines Modal */}
      {showGuidelines && (
        <Modal transparent={true} visible={showGuidelines} animationType="fade">
          <View
            style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-60`}>
            <View style={tailwind`w-11/12 bg-white rounded-2xl p-5`}>
              <Text style={tailwind`text-xl font-bold text-center mb-2`}>
                📸 Profile Photo Guidelines
              </Text>
              <Text style={tailwind`text-gray-700 mb-3 text-sm`}>
                Your photos are the{' '}
                <Text style={tailwind`font-bold`}>first impression</Text>{' '}
                someone has of you. The right images create meaningful
                connections — while unclear or inappropriate ones may lead to
                rejection.
              </Text>

              <Text style={tailwind`text-base font-bold mb-1`}>
                ✅ Recommended:
              </Text>
              <Text style={tailwind`text-sm text-gray-800`}>
                • Make your <Text style={tailwind`font-bold`}>first image</Text>{' '}
                a clear photo of your face{'\n'}• Use bright, high-quality
                images{'\n'}• Show lifestyle photos (e.g., hobbies, travel)
                {'\n'}• Upload recent photos (within 6 months){'\n'}• Smile or
                use natural expressions
              </Text>

              <Text style={tailwind`text-base font-bold mt-4 mb-1`}>
                🚫 Avoid:
              </Text>
              <Text style={tailwind`text-sm text-gray-800`}>
                • Blurry, dark, or pixelated photos{'\n'}• Group photos as your
                first image{'\n'}• Inappropriate or revealing content{'\n'}•
                Heavy filters or AI-generated images{'\n'}• Photos with your
                face hidden
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

      <View style={tailwind`w-11/12 h-10/12 flex`}>
        <View style={[tailwind`flex`, {marginTop: screenHeight * 0.07}]}>
          <View style={tailwind`mt-2`}>
            <View style={tailwind`w-full flex flex-row items-center`}>
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
                Photos
              </Text>
            </View>
            <Text style={tailwind`text-sm mt-1`}>
              Show off your personality.
            </Text>
            <Text style={tailwind`text-sm mt-1 text-red-500`}>
              ** 1 image required **
            </Text>
          </View>
        </View>

        <View style={tailwind`w-full flex flex-row items-center mt-3`}>
          <View style={tailwind`flex-1 flex-row flex-wrap`}>
            {uploadedImageUrls.map((_, index) => (
              <View
                style={tailwind`w-1/3 h-52 items-center justify-center p-1`}
                key={index}>
                <TouchableOpacity
                  onPress={() => handlePickImage(index)}
                  style={[
                    tailwind`w-full h-full border-2 flex items-center justify-center rounded-3`,
                    {
                      borderColor:
                        index === 0
                          ? themeColors.primary
                          : themeColors.darkSecondary,
                    },
                  ]}>
                  {loadingStates[index] ? (
                    <ActivityIndicator
                      size="small"
                      color={themeColors.primary}
                    />
                  ) : uploadedImageUrls[index] ? (
                    <Image
                      source={{uri: uploadedImageUrls[index]!}}
                      style={tailwind`w-full h-full rounded-md`}
                      resizeMode="cover"
                    />
                  ) : (
                    <Camera
                      height={20}
                      width={20}
                      color={themeColors.primary}
                    />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View
        style={tailwind`w-full absolute bottom-0 flex flex-row justify-between px-5 mb-12`}>
        <View style={tailwind`flex flex-row items-center`}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.popToTop();
            }}>
            <View style={tailwind``}>
              <Text style={tailwind`text-base font-bold text-red-400`}>
                Cancel
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ContinueButton
          text={'Preferences'}
          click={redirectToPersonalityScreen}
        />
      </View>
    </View>
  );
};

export default PhotosScreen;
