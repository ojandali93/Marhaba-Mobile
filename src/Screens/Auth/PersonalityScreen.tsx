import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import StandardInputBordered from '../../Components/Inputs/StandardInputBordered';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {track} from '@amplitude/analytics-react-native';
import {ChevronsLeft} from 'react-native-feather';
import ContinueButton from '../../Components/Buttons/ContinueButton';

const screenHeight = Dimensions.get('window').height;

const promptList = [
  'Who am I?',
  // Light-hearted/fun
  "What's your go-to guilty pleasure snack?",
  'If I were a superhero, my power would be...',
  'The weirdest talent I have is...',
  'A perfect weekend includes...',

  // Serious/personal
  'Faith is important to me',
  'My ideal partner is...',
  'A value I live by is...',
  'To me, marriage means...',
  'In 5 years, I hope to...',
  'Best advice I got was...',

  // Fun questions
  'If I could visit anywhere right now...',
  'My dream job as a kid was...',
  'On weekends I usually...',
];

const PersonalityScreen = () => {
  const navigation = useNavigation();

  const [promptResponses, setPromptResponses] = useState<
    {
      prompt: string;
      response: string;
    }[]
  >(promptList.map(prompt => ({prompt, response: ''})));

  useFocusEffect(
    useCallback(() => {
      track('Personality Started');
      const loadStoredResponses = async () => {
        try {
          const stored = await AsyncStorage.getItem('prompts');
          if (stored) {
            const parsed = JSON.parse(stored);
            const updated = promptList.map(prompt => {
              const existing = parsed.find(p => p.prompt === prompt);
              return existing || {prompt, response: ''};
            });
            setPromptResponses(updated);
          }
        } catch (err) {
          console.error('Failed to load prompts:', err);
        }
      };

      loadStoredResponses();
    }, []),
  );

  const updateCurrentResponse = (prompt: string, text: string) => {
    setPromptResponses(prev =>
      prev.map(entry =>
        entry.prompt === prompt ? {...entry, response: text} : entry,
      ),
    );
  };

  const redirectToCareer = () => {
    const validResponses = promptResponses.filter(
      p => p.response.trim().length > 0,
    );
    if (validResponses.length >= 1) {
      storeNextScreen(validResponses);
    } else {
      Alert.alert('Responses', 'You must submit at least 1 prompt responses.');
    }
  };

  const storeNextScreen = async responses => {
    await AsyncStorage.setItem('prompts', JSON.stringify(responses));
    track('Personality Completed');
    navigation.navigate('LifestyleHabits');
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-11/12 flex-1 flex mb-24`}>
        <View style={[tailwind`flex`, {marginTop: screenHeight * 0.07}]}>
          <View style={tailwind`mt-2`}>
            <View
              style={tailwind`w-full flex flex-row items-center justify-between`}>
              <View style={tailwind`flex flex-row items-center`}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ChevronsLeft
                    height={30}
                    width={30}
                    color={themeColors.primary}
                    style={tailwind`mr-1`}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    tailwind`text-3xl font-semibold`,
                    {color: themeColors.primary},
                  ]}>
                  Who am I?
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  track('Personality Skipped');
                  navigation.navigate('LifestyleHabits');
                }}
                style={tailwind`mt-2`}>
                <Text style={tailwind`text-base font-semibold text-red-500`}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={tailwind`mt-2 text-sm font-semibold text-gray-500`}>
              Answer as many prompts as you'd like.
            </Text>
          </View>
        </View>

        <ScrollView style={tailwind`w-full flex-1 mt-4`}>
          {promptResponses.map(p => (
            <View key={p.prompt} style={tailwind`mb-4`}>
              <StandardInputBordered
                value={p.response}
                changeValue={text => updateCurrentResponse(p.prompt, text)}
                fieldName={p.prompt}
                longContent
                placeholder={'Enter your answer...'}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <View
        style={tailwind`w-full absolute bottom-0 flex flex-row justify-between px-5 mb-12`}>
        <View style={tailwind`flex flex-row items-center`}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.popToTop();
            }}>
            <View style={tailwind``}>
              <Text style={tailwind`text-sm font-bold text-red-400`}>
                Cancel
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ContinueButton text={'About You'} click={redirectToCareer} />
      </View>
    </View>
  );
};

export default PersonalityScreen;
