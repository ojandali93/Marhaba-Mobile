import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {Camera, ChevronsDown, ChevronsUp, X} from 'react-native-feather';
import EditSelect from '../Select/EditSelect';
import EditTextInput from '../Select/EditTextInput';
import {
  intentionsOptions,
  timelineOptions,
  importanceMarriageOptions,
  marriageStatusOptions,
} from '../../Utils/SelectOptions';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';

const EditHabits = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandProfile, setExpandProfile] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [smoking, setSmoking] = useState(profile.name || '');
  const [drinking, setDrinking] = useState(profile.dob || '');
  const [hasKids, setHasKids] = useState(profile.height || '');
  const [wantsKids, setWantsKids] = useState(profile.height || '');
  const [sleep, setSleep] = useState(profile.height || '');
  const [excersize, setExcersize] = useState(profile.height || '');
  const [diet, setDiet] = useState(profile.height || '');

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const loadProfile = () => {
    setSmoking(profile?.Habits[0]?.smoking);
    setDrinking(profile?.Habits[0]?.drinking);
    setHasKids(profile?.Habits[0]?.hasKids);
    setWantsKids(profile?.Habits[0]?.wantsKids);
    setSleep(profile?.Habits[0]?.sleep);
    setExcersize(profile?.Habits[0]?.excersize);
    setDiet(profile?.Habits[0]?.diet);
  };

  const updateSmoking = async (newSmoking: string) => {
    if (newSmoking !== smoking) {
      setSmoking(newSmoking);
      setChangeDetected(true);
    } else {
      setSmoking(newSmoking);
    }
  };

  const updateDrinking = async (newDrinking: string) => {
    if (newDrinking !== drinking) {
      setDrinking(newDrinking);
      setChangeDetected(true);
    } else {
      setDrinking(newDrinking);
    }
  };

  const updateHasKids = async (newHasKids: string) => {
    if (newHasKids !== hasKids) {
      setHasKids(newHasKids);
      setChangeDetected(true);
    } else {
      setHasKids(newHasKids);
    }
  };

  const updateWantsKids = async (newWantsKids: string) => {
    if (newWantsKids !== wantsKids) {
      setWantsKids(newWantsKids);
      setChangeDetected(true);
    } else {
      setWantsKids(newWantsKids);
    }
  };

  const updateSleep = async (newSleep: string) => {
    if (newSleep !== sleep) {
      setSleep(newSleep);
      setChangeDetected(true);
    } else {
      setSleep(newSleep);
    }
  };

  const updateExcersize = async (newExcersize: string) => {
    if (newExcersize !== excersize) {
      setExcersize(newExcersize);
      setChangeDetected(true);
    } else {
      setExcersize(newExcersize);
    }
  };

  const updateDiet = async (newDiet: string) => {
    if (newDiet !== diet) {
      setDiet(newDiet);
      setChangeDetected(true);
    } else {
      setDiet(newDiet);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (changeDetected) {
        const response = await axios.put(
          'https://marhaba-server.onrender.com/api/account/updateIntent',
          {
            userId: profile?.userId,
            smoking: smoking,
            drinking: drinking,
            hasKids: hasKids,
            wantsKids: wantsKids,
            sleep: sleep,
            excersize: excersize,
            diet: diet,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          },
        );
        if (response.data.success) {
          setChangeDetected(false);
          grabUserProfile(profile?.userId);
          setExpandProfile(false);
        } else {
          console.error('Error updating user profile:', response.data.error);
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={tailwind`w-full flex flex-col mt-2`}
        onPress={() => setExpandProfile(!expandProfile)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkGrey},
          ]}>
          <Text style={tailwind`text-base font-semibold text-white`}>
            Lifestyle Habits
          </Text>
          {expandProfile ? (
            changeDetected ? (
              <TouchableOpacity onPress={updateUserProfile}>
                <Text
                  style={[
                    tailwind`text-base font-bold px-2 py-1 rounded-md text-white`,
                    {backgroundColor: themeColors.primary},
                  ]}>
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setExpandProfile(false)}>
                <ChevronsUp
                  height={24}
                  width={24}
                  color={themeColors.primary}
                />
              </TouchableOpacity>
            )
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </View>
      </TouchableOpacity>
      <View style={tailwind`flex-1`}>
        {expandProfile && (
          <View
            style={[
              tailwind`w-full flex flex-row items-center mb-5 mt-4 pb-3 rounded-2`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <View style={tailwind`w-full pr-1`}>
              <EditSelect
                fieldName="Smoking"
                selected={smoking}
                onSelect={updateSmoking}
                options={['Yes', 'No', 'Sometimes']}
              />
              <EditSelect
                fieldName="Drinking"
                selected={drinking}
                onSelect={updateDrinking}
                options={['Yes', 'No', 'Sometimes']}
              />
              <EditSelect
                fieldName="Has Kids"
                selected={hasKids}
                onSelect={updateHasKids}
                options={['Yes', 'No']}
              />
              <EditSelect
                fieldName="Wants Kids"
                selected={wantsKids}
                onSelect={updateWantsKids}
                options={['Yes', 'No', 'In the future']}
              />
              <EditSelect
                fieldName="Sleep"
                selected={sleep}
                onSelect={updateSleep}
                options={['Early Bird', 'Night Owl', 'Flexible']}
              />
              <EditSelect
                fieldName="Excersize"
                selected={excersize}
                onSelect={updateExcersize}
                options={['Daily', 'Often', 'Sometimes', 'Rarely', 'Never']}
              />
              <EditSelect
                fieldName="Diet"
                selected={diet}
                onSelect={updateDiet}
                options={[
                  'Halal',
                  'Vegan',
                  'Vegetarian',
                  'Pescetarian',
                  'Omnivore',
                  'Other',
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default EditHabits;
