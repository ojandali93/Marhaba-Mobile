import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {ChevronsDown, ChevronsUp} from 'react-native-feather';
import EditTextInput from '../Select/EditTextInput';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';

const PROMPTS_CONFIG = [
  {key: 't_who', prompt: 'Who am I?'},
  {key: 't_makes_me', prompt: 'What makes me, me?'},
  {key: 't_weekends', prompt: 'On weekends, you’ll usually find me…'},
  {key: 't_friends', prompt: 'My friends would describe me as…'},
  {key: 't_master', prompt: 'A skill I would instantly like to master is…'},
  {key: 't_make_time', prompt: 'One thing I always make time for is…'},
  {key: 't_love', prompt: 'When it comes to love, I believe…'},
  {key: 't_faith', prompt: 'Faith and values play a role in my life...'},
  {key: 't_appreciate', prompt: 'I appreciate when someone…'},
  {key: 't_lifestyle', prompt: 'The lifestyle I’m building includes…'},
  {key: 't_refuse', prompt: 'A value I refuse to compromise on is…'},
  {key: 't_show', prompt: 'When I care about someone…'},
  {key: 't_grow', prompt: 'I’ve grown the most through…'},
  {key: 't_life', prompt: 'I feel most at peace when…'},
  {key: 't_moment', prompt: 'One moment that shaped how I love is…'},
  {key: 't_deepl', prompt: 'I feel deeply connected to people when…'},
  {key: 't_partner', prompt: 'The kind of partner I strive to be is…'},
  {key: 't_lifelong', prompt: 'What I want most in a lifelong partnership is…'},
];

const EditPromptsView = () => {
  const {profile, userId, grabUserProfile} = useProfile();
  const [expanded, setExpanded] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);
  const [promptValues, setPromptValues] = useState({});
  const [originalPromptValues, setOriginalPromptValues] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadPrompts();
    }, [profile]),
  );

  const loadPrompts = () => {
    const initialValues = {};
    PROMPTS_CONFIG.forEach(({key}) => {
      initialValues[key] = profile.Prompts[0]?.[key] || '';
    });

    setPromptValues(initialValues);
    setOriginalPromptValues(initialValues);

    const empty = Object.values(initialValues).every(val => !val?.trim());
    setIsEmpty(empty);
  };

  const updatePrompt = (key, newText) => {
    const updated = {...promptValues, [key]: newText};
    setPromptValues(updated);

    const hasChanged = Object.keys(updated).some(
      k => updated[k] !== originalPromptValues[k],
    );
    setChangeDetected(hasChanged);
  };

  const updatePrompts = async () => {
    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/account/updatePrompts',
        {
          userId,
          prompts: {...promptValues}, // Send as { t_who: "...", t_makes_me: "...", etc }
        },
      );

      if (response.data.success) {
        setOriginalPromptValues({...promptValues});
        setChangeDetected(false);
        await grabUserProfile(userId || '');
        loadPrompts();
        setExpanded(false);
      } else {
        console.error('⚠️ Failed to update prompts:', response.data.error);
      }
    } catch (error) {
      console.error('❌ Error updating prompts:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={tailwind`w-full flex flex-col mt-2 px-2`}
        onPress={() => setExpanded(!expanded)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <View style={tailwind`flex flex-row items-center`}>
            <Text style={tailwind`text-base font-semibold`}>Prompts</Text>
            {isEmpty && (
              <View
                style={tailwind`w-2 h-2 rounded-full bg-orange-400 mr-2 ml-3`}
              />
            )}
          </View>
          {expanded ? (
            changeDetected ? (
              <TouchableOpacity onPress={updatePrompts}>
                <Text
                  style={[
                    tailwind`text-base font-bold px-2 py-1 rounded-md text-white`,
                    {backgroundColor: themeColors.primary},
                  ]}>
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <ChevronsUp height={24} width={24} color={themeColors.primary} />
            )
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <ScrollView
          style={[
            tailwind`max-h-[600px] pb-4 mb-3 mt-4 rounded-3`,
            {backgroundColor: themeColors.secondary},
          ]}>
          {PROMPTS_CONFIG.map(({key, prompt}) => (
            <EditTextInput
              key={key}
              fieldName={prompt}
              selected={promptValues[key]}
              onSelect={newText => updatePrompt(key, newText)}
              multiline
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default EditPromptsView;
