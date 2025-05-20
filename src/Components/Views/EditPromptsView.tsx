import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {ChevronsDown, ChevronsUp} from 'react-native-feather';
import EditTextInput from '../Select/EditTextInput';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';

const EditPromptsView = () => {
  const {profile, userId, grabUserProfile} = useProfile();
  const [expanded, setExpanded] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [prompts, setPrompts] = useState<{id: string; prompt: string}[]>([]);
  const [originalPrompts, setOriginalPrompts] = useState<string[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  useFocusEffect(
    useCallback(() => {
      loadPrompts();
    }, []),
  );

  const loadPrompts = () => {
    const profilePrompts = profile?.Prompts || [];

    const formatted = profilePrompts.map(p => ({
      id: p.id,
      prompt: p.prompt,
      response: p.response || '',
    }));

    setPrompts(formatted);
    setOriginalPrompts(formatted.map(p => p.response));

    const isEmpty =
      profilePrompts.length === 0 || formatted.every(p => !p.response?.trim());

    setIsEmpty(isEmpty);
  };

  const updatePrompt = (index: number, newText: string) => {
    const updated = [...prompts];
    updated[index].response = newText; // ✅ update response
    setPrompts(updated);
    const hasChanged = updated.some(
      (p, i) => p.response !== originalPrompts[i],
    );
    setChangeDetected(hasChanged);
  };

  const updatePrompts = async () => {
    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/account/updatePrompts',
        {
          userId,
          prompts: prompts.map(p => ({
            prompt: p.prompt,
            response: p.response, // ✅ send the response
          })),
        },
      );

      if (response.data.success) {
        setOriginalPrompts(prompts.map(p => p.response)); // ✅ update with response
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
        style={tailwind`w-full flex flex-col mt-2`}
        onPress={() => setExpanded(!expanded)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkGrey},
          ]}>
          <View style={tailwind`flex flex-row items-center`}>
            <Text style={tailwind`text-base font-semibold text-white`}>
              Prompts
            </Text>
            {isEmpty && (
              <View
                style={tailwind`w-2 h-2 rounded-full bg-yellow-400 mr-2 ml-3`}
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
        <View
          style={[
            tailwind` pb-4 mb-3 mt-4 rounded-3`,
            {backgroundColor: themeColors.secondary},
          ]}>
          {prompts.map((p, index) => (
            <EditTextInput
              key={p.id}
              fieldName={p.prompt}
              selected={p.response}
              onSelect={newText => updatePrompt(index, newText)}
              multiline
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default EditPromptsView;
