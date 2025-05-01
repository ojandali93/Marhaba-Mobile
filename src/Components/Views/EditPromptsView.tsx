import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tailwind from 'twrnc';
import { getProfile, getUserId } from '../../Services/AuthStoreage';
import themeColors from '../../Utils/custonColors';
import { ChevronsDown, ChevronsUp } from 'react-native-feather';
import EditTextInput from '../Select/EditTextInput';
import axios from 'axios';

const EditPromptsView = () => {
  const usersProfile = getProfile();
  const [expanded, setExpanded] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [prompts, setPrompts] = useState<{ id: string, prompt: string }[]>([]);
  const [originalPrompts, setOriginalPrompts] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPrompts();
    }, []),
  );

  const loadPrompts = () => {
    const profilePrompts = usersProfile?.data?.Prompts || [];
    const formatted = profilePrompts.map(p => ({
      id: p.id,
      prompt: p.prompt,
      response: p.response || '', // ✅ include response
    }));
    setPrompts(formatted);
    setOriginalPrompts(formatted.map(p => p.response));
  };
  
  const updatePrompt = (index: number, newText: string) => {
    const updated = [...prompts];
    updated[index].response = newText; // ✅ update response
    setPrompts(updated);
    const hasChanged = updated.some((p, i) => p.response !== originalPrompts[i]);
    setChangeDetected(hasChanged);
  };

  const updatePrompts = async () => {
    try {
      const userId = getUserId();
      const response = await axios.put('https://marhaba-server.onrender.com/api/account/updatePrompts', {
        userId,
        prompts: prompts.map(p => ({
          prompt: p.prompt,
          response: p.response, // ✅ send the response
        })),
      });
  
      if (response.data.success) {
        setOriginalPrompts(prompts.map(p => p.response)); // ✅ update with response
        setChangeDetected(false);
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
      <TouchableOpacity style={tailwind`w-full flex flex-col mt-2`} onPress={() => setExpanded(!expanded)}>
      <View style={[tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`, {backgroundColor: themeColors.darkSecondary}]}>
      <Text style={tailwind`text-base font-semibold text-gray-800`}>Prompts</Text>
          {expanded ? (
            changeDetected ? (
              <TouchableOpacity onPress={updatePrompts}>
                <Text style={[tailwind`text-base font-bold px-2 py-1 rounded-md text-white`, { backgroundColor: themeColors.primary }]}>
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
        <View style={tailwind`px-2 pb-4`}>
          {prompts.map((p, index) => (
            <EditTextInput
              key={p.id}
              fieldName={p.prompt}
              selected={p.response}
              onSelect={(newText) => updatePrompt(index, newText)}
              multiline
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default EditPromptsView;
