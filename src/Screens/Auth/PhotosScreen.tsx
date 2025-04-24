import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Camera} from 'react-native-feather';
import {pickImageFromGallery} from '../../Utils/Functions/ImageFunctions';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import {storage} from '../../Services/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;

interface ImageInterface {
  uri: string;
  fileName: string;
  type: string;
  width: number;
  height: number;
}

const PhotosScreen = () => {
  const navigation = useNavigation();

  const [uploadedImageUrls, setUploadedImageUrls] = useState<(string | null)[]>(
    Array(12).fill(null),
  );
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(12).fill(false),
  );

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    try {
      const storedImages = await AsyncStorage.getItem('images');
      console.log('storedImages');
      if (storedImages) {
        const rawArray: (string | null)[] = JSON.parse(storedImages);

        // Convert empty strings ("") to nulls
        const imageArray = rawArray.map(item => (item?.trim() ? item : null));
        setUploadedImageUrls(imageArray);

        // Set loadingStates: all false by default
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
      setLoadingStates(prev => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
      const uploadedUrl = await uploadImageToDatabase(image);
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
      await AsyncStorage.setItem('images', JSON.stringify(uploadedImageUrls));
      setLoadingStates(prev => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    }
  };

  // make sure to update this it use the server rather than direct
  const uploadImageToDatabase = async (image: ImageInterface) => {
    try {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      if (blob.size > 5 * 1024 * 1024) {
        // 5MB
        Alert.alert('Image too large', 'Please select a smaller image.');
        return;
      }
      const uniqueName = `${Date.now()}_${image.fileName}`;
      const storageRef = ref(storage, `UserImages/${uniqueName}`);
      const snapshot = await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      console.error('❌ Upload failed due to issue:', err);
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
      console.log('stringified images; ', JSON.stringify(uploadedImageUrls));
      await AsyncStorage.setItem('images', JSON.stringify(uploadedImageUrls));
      navigation.navigate('CreatingProfile');
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
      <View style={tailwind`w-3/4 flex`}>
        <View
          style={[
            tailwind`flex`,
            {marginTop: screenHeight * 0.1}, // 20% of screen height
          ]}>
          <View style={tailwind`mt-2`}>
            <Text
              style={[
                tailwind`mt-2 text-3xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              Photos
            </Text>
            <Text style={tailwind`text-sm mt-1`}>Your best moments!</Text>
            <Text style={tailwind`text-sm mt-1 text-red-500`}>
              ** 1 image required **
            </Text>
          </View>
        </View>
        <View
          style={[
            tailwind`w-full flex flex-row items-center`,
            {marginTop: screenHeight * 0.03},
          ]}>
          <View style={tailwind`flex-row flex-wrap`}>
            {uploadedImageUrls.map((_, index) => (
              <View
                style={tailwind`w-1/3 h-32 items-center justify-center p-1`}
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
      <View style={tailwind`absolute w-3/4 bottom-12`}>
        <View style={tailwind` w-full flex flex-row justify-end`}>
          <AuthMainButton
            text={'Continue'}
            click={redirectToPersonalityScreen}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tailwind`w-full items-center mt-4`}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PhotosScreen;
