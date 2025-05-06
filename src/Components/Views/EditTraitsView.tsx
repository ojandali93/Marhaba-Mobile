import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Text, TouchableOpacity, View, Alert} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {ChevronsDown, ChevronsUp} from 'react-native-feather';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';
import {traitsAndHobbies} from '../../Utils/SelectOptions';
const EditTraitsView = () => {
  const {profile, userId, grabUserProfile} = useProfile();
  const [expandedAbout, setExpandedAbout] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [traits, setTraits] = useState<string[]>([]);
  const [originalTraits, setOriginalTraits] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      const dbTraits = (profile?.Tags || []).map(t => t.tag); // extract tag strings
      setTraits(dbTraits);
      setOriginalTraits(dbTraits);
    }, []),
  );

  const toggleTrait = (trait: string) => {
    let updated;
    if (traits.includes(trait)) {
      updated = traits.filter(t => t !== trait);
    } else {
      if (traits.length >= 8) return; // ✅ Limit to 8
      updated = [...traits, trait];
    }

    setTraits(updated);

    const changed =
      updated.length !== originalTraits.length ||
      !updated.every(t => originalTraits.includes(t));
    setChangeDetected(changed);
  };

  const updateUserTraits = async () => {
    if (traits.length < 3) {
      Alert.alert(
        'Minimum Required',
        'Please select at least 3 traits before saving.',
      );
      return;
    }

    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/account/updateTags',
        {
          userId,
          tags: traits,
        },
      );

      if (response.data.success) {
        setOriginalTraits(traits);
        setChangeDetected(false);
        grabUserProfile(userId);
        setExpandedAbout(false);
      } else {
        console.error('Error updating traits:', response.data.error);
      }
    } catch (err) {
      console.error('❌ Error updating traits:', err);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={tailwind`w-full flex flex-col mt-2`}
        onPress={() => setExpandedAbout(!expandedAbout)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold text-gray-800`}>
            Hobbies & Traits
          </Text>
          {expandedAbout ? (
            changeDetected ? (
              <TouchableOpacity onPress={updateUserTraits}>
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

      {expandedAbout && (
        <>
          <View style={tailwind`px-5 pb-2`}>
            <Text style={tailwind`text-base text-gray-600`}>
              Selected {traits.length}/8 — select at least 3
            </Text>
          </View>
          <View style={tailwind`px-4 pb-4 flex flex-wrap flex-row`}>
            {traitsAndHobbies.map(trait => {
              const isSelected = traits.includes(trait);
              return (
                <TouchableOpacity
                  key={trait}
                  onPress={() => toggleTrait(trait)}
                  style={[
                    tailwind`px-3 py-1 m-1 rounded-full border`,
                    isSelected
                      ? {
                          backgroundColor: themeColors.primary,
                          borderColor: themeColors.primary,
                        }
                      : {borderColor: '#ccc'},
                  ]}>
                  <Text
                    style={tailwind`text-base ${
                      isSelected ? 'text-white' : 'text-black'
                    }`}>
                    {trait}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

export default EditTraitsView;
