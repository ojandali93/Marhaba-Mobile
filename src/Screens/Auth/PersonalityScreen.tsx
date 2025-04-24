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
import AithInputStandard from '../../Components/Inputs/AithInputStandard';
import PromptSelect from '../../Components/Select/PromptSelect';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const loadStoredResponses = async () => {
        try {
          const stored = await AsyncStorage.getItem('prompts');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              setPromptResponses(parsed);
            }
          }
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
    setPromptResponses(prev => prev.filter(p => p.prompt !== promptToRemove));
    if (currentPrompt === promptToRemove) {
      setCurrentPrompt('');
    }
  };

  const redirectToCareer = () => {
    if (promptResponses.length >= 3) {
      storeNextScreen();
    } else {
      Alert.alert('Responses', 'You must submit 3+ response.');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('prompts', JSON.stringify(promptResponses));
    navigation.navigate('Hobbies');
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
              About Me
            </Text>
            <Text style={[tailwind`mt-2 text-sm font-semibold text-gray-500`]}>
              The more prompts you answer, the better matches we can find for
              you.
            </Text>
            <Text style={[tailwind`mt-1 text-sm font-semibold text-red-500`]}>
              ** 3 responses required **
            </Text>
          </View>
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
                remove
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
