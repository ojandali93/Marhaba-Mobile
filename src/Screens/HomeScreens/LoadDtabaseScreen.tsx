import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {faker} from '@faker-js/faker';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useFocusEffect} from '@react-navigation/native';
import AithInputStandard from '../../Components/Inputs/AithInputStandard';
import AuthInputStandardNumber from '../../Components/Inputs/AuthInputStandardNumber';
import DateSelect from '../../Components/Select/DateSelect';
import StandardSelect from '../../Components/Select/StandardSelect';
import {
  backgroundOptions,
  intentionsOptions,
  timelineOptions,
  importanceMarriageOptions,
  marriageStatusOptions,
  religionOptions,
  religiousSectOptions,
  industries,
  traitsAndHobbies,
  eitherOrQuestions,
} from '../../Utils/SelectOptions';
import EditBackgroundView from '../../Components/Views/EditBackgroundView';
import BackgroundSelect from '../../Components/Select/BackgroundSelect';
import PromptSelect from '../../Components/Select/PromptSelect';
import StandardInputBordered from '../../Components/Inputs/StandardInputBordered';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AgeSliderSelect from '../../Components/Select/AgeSliderSelect';
import {
  cropCenterImageForPhone,
  pickImageFromGallery,
} from '../../Utils/Functions/ImageFunctions';
import {Camera} from 'react-native-feather';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {createUserAccount} from '../../Utils/Functions/AccountFunctions';
import axios from 'axios';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LoadDtabaseScreen = () => {
  const [gptPrompt, setGptPrompt] = useState('');
  const [gptResponse, setGptResponse] = useState([]);
  const [gptNumber, setGptNumber] = useState('1');
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handlePickImage = async (userIndex, imageIndex) => {
    try {
      const image = await pickImageFromGallery();
      if (!image || !image.uri) return;

      const croppedImage = await cropCenterImageForPhone(
        image.uri,
        image.width,
        image.height,
        image.fileName,
      );

      const uploadedUrl = await uploadImageToServer(
        croppedImage.uri,
        croppedImage.fileName,
      );

      if (uploadedUrl) {
        const newImages = [...uploadedImages];
        if (!newImages[userIndex]) newImages[userIndex] = Array(5).fill(null);
        newImages[userIndex][imageIndex] = uploadedUrl;
        setUploadedImages(newImages);
      }
    } catch (error) {
      console.error('Image pick error:', error);
    }
  };

  const uploadImageToServer = async (localUri, originalFileName) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: localUri,
        name: originalFileName || 'photo.jpg',
        type: 'image/jpeg',
      });

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

  const callGenerateProfilePrompt = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'https://marhaba-server.onrender.com/api/generate/user',
        {
          description: gptPrompt,
          count: parseInt(gptNumber),
        },
      );

      const data = res.data;

      if (!data.success) {
        console.error('❌ GPT generation failed:', data.error || data.message);
        return;
      }

      setGptResponse(data.profiles);
    } catch (error) {
      console.error('❌ Error calling GPT profile generator:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log('gptResponse', gptResponse);

  return (
    <View style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <View
        style={[
          tailwind`w-full flex-row items-center justify-between p-4 mt-12`,
          {backgroundColor: themeColors.secondary},
        ]}>
        <Text style={tailwind`text-2xl font-bold text-gray-800`}>
          Create A User
        </Text>
      </View>

      <TextInput
        value={gptPrompt}
        onChangeText={setGptPrompt}
        placeholder="Enter a prompt"
        style={tailwind`border-2 border-gray-300 rounded-md p-2 mb-2 mx-3`}
      />
      <TextInput
        value={gptNumber}
        onChangeText={setGptNumber}
        placeholder="Enter number of profiles"
        keyboardType="number-pad"
        style={tailwind`border-2 border-gray-300 rounded-md p-2 mb-2 mx-3`}
      />
      <TouchableOpacity
        onPress={callGenerateProfilePrompt}
        style={[
          tailwind`mx-3 rounded-md p-2 mb-2`,
          {backgroundColor: themeColors.primary},
        ]}>
        <Text style={tailwind`text-white text-center`}>Generate</Text>
      </TouchableOpacity>

      <ScrollView style={tailwind`mb-32`}>
        {loading && (
          <ActivityIndicator
            size="large"
            color={themeColors.primary}
            style={tailwind`mt-4`}
          />
        )}

        {gptResponse.map((user, userIndex) => (
          <View
            key={userIndex}
            style={tailwind`m-3 p-4 rounded-xl bg-white shadow`}>
            <Text style={tailwind`text-lg font-bold mb-2`}>
              User {userIndex + 1}
            </Text>

            {Object.entries(user).map(([key, value]) => (
              <View key={key} style={tailwind`mb-1`}>
                <Text style={tailwind`text-sm font-semibold text-gray-700`}>
                  {key}
                </Text>
                <Text style={tailwind`text-sm text-gray-600`}>
                  {Array.isArray(value) ? value.join(', ') : value}
                </Text>
              </View>
            ))}

            <View style={tailwind`flex-row flex-wrap mt-2`}>
              {Array(9)
                .fill(null)
                .map((_, imageIndex) => (
                  <TouchableOpacity
                    key={imageIndex}
                    style={tailwind`w-1/3 aspect-square m-1 bg-gray-100 rounded-lg items-center justify-center border border-gray-300`}
                    onPress={() => handlePickImage(userIndex, imageIndex)}>
                    {uploadedImages[userIndex]?.[imageIndex] ? (
                      <Image
                        source={{uri: uploadedImages[userIndex][imageIndex]}}
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
                ))}
            </View>

            <TouchableOpacity
              style={tailwind`mt-4 py-2 px-4 rounded-full bg-green-600`}
              onPress={() => Alert.alert('Create Account logic here')}>
              <Text style={tailwind`text-white text-center font-semibold`}>
                Create This Account
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default LoadDtabaseScreen;
