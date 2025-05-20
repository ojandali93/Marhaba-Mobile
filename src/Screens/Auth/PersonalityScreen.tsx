import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import StandardInputBordered from '../../Components/Inputs/StandardInputBordered';
import PromptSelect from '../../Components/Select/PromptSelect';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {track} from '@amplitude/analytics-react-native';

const screenHeight = Dimensions.get('window').height;

const PersonalityScreen = () => {
  const navigation = useNavigation();

  const [prompt, setPrompt] = useState<string>('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [promptResponses, setPromptResponses] = useState<
    {prompt: string; response: string}[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      track('Personality Started');
      const loadStoredResponses = async () => {
        try {
          const stored = await AsyncStorage.getItem('prompts');
          let parsed: {prompt: string; response: string}[] = [];
          if (stored) {
            parsed = JSON.parse(stored);
          }

          const hasWhoAmI = parsed.some(p => p.prompt === 'Who am I?');
          if (!hasWhoAmI) {
            parsed.unshift({prompt: 'Who am I?', response: ''});
          }

          setPromptResponses(parsed);
          setCurrentPrompt('Who am I?');
        } catch (err) {
          console.error('Failed to load prompts:', err);
        }
      };

      loadStoredResponses();
    }, []),
  );

  const updateSelectedPrompt = (selectedPrompt: string) => {
    setCurrentPrompt(selectedPrompt);
    const exists = promptResponses.find(p => p.prompt === selectedPrompt);
    if (!exists) {
      setPromptResponses(prev => [
        ...prev,
        {prompt: selectedPrompt, response: ''},
      ]);
    }
  };

  const updateCurrentResponse = (prompt: string, text: string) => {
    setPromptResponses(prev =>
      prev.map(entry =>
        entry.prompt === prompt ? {...entry, response: text} : entry,
      ),
    );
  };

  const removePrompt = (promptToRemove: string) => {
    if (promptToRemove === 'Who am I?') return;
    setPromptResponses(prev => prev.filter(p => p.prompt !== promptToRemove));
    if (currentPrompt === promptToRemove) {
      setCurrentPrompt('');
    }
  };

  const redirectToCareer = () => {
    const validResponses = promptResponses.filter(
      p => p.response.trim().length > 0,
    );
    if (validResponses.length >= 3) {
      storeNextScreen(validResponses);
    } else {
      Alert.alert('Responses', 'You must submit at least 3 prompt responses.');
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
      <View style={tailwind`w-11/12 h-10/12 flex`}>
        <View style={[tailwind`flex`, {marginTop: screenHeight * 0.06}]}>
          <View style={tailwind`flex flex-row justify-between items-center`}>
            <Text
              style={[
                tailwind`mt-2 text-3xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              About Me
            </Text>
            <TouchableOpacity
              onPress={() => {
                track('Personality Skipped');
                navigation.navigate('LifestyleHabits');
              }}
              style={[
                tailwind`mt-2 text-lg font-semibold`,
                {color: themeColors.primary},
              ]}>
              <Text style={tailwind`text-base font-semibold text-red-500`}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[tailwind`mt-2 text-sm font-semibold text-gray-500`]}>
            The more prompts you answer, the better matches we can find for you.
          </Text>
          <Text style={[tailwind`mt-1 text-sm font-semibold text-red-500`]}>
            ** Minimum of 3 responses required **
          </Text>
        </View>
        <View style={[tailwind`w-full flex flex-col justify-center mt-4`]}>
          <PromptSelect
            fieldName="Prompts"
            selected={prompt}
            onSelect={updateSelectedPrompt}
          />
        </View>
        <ScrollView
          style={[tailwind`w-full h-8/12`, {marginTop: screenHeight * 0.01}]}>
          {[...promptResponses].reverse().map(p => (
            <View key={p.prompt} style={tailwind`flex-row items-center mb-2`}>
              <StandardInputBordered
                value={p.response}
                changeValue={text => updateCurrentResponse(p.prompt, text)}
                fieldName={p.prompt}
                longContent
                placeholder={'Enter response...'}
                remove={p.prompt !== 'Who am I?'}
                removeClick={() => removePrompt(p.prompt)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={tailwind`absolute w-3/4 bottom-12`}>
        <View style={tailwind` w-full flex flex-row justify-end`}>
          <AuthMainButton text={'Continue'} click={redirectToCareer} />
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

export default PersonalityScreen;
