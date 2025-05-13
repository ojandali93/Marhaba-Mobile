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
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';
import {religiousSectOptions, religionOptions} from '../../Utils/SelectOptions';

const EditReligion = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandProfile, setExpandProfile] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [religion, setReligion] = useState(profile.name || '');
  const [sect, setSect] = useState(profile.dob || '');
  const [practiicing, setPractiicing] = useState(profile.height || '');
  const [openness, setOpenness] = useState(profile.height || '');

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const loadProfile = () => {
    setReligion(profile?.Religion[0]?.religion);
    setSect(profile?.Religion[0]?.sect);
    setPractiicing(profile?.Religion[0]?.practiicing);
    setOpenness(profile?.Religion[0]?.openness);
  };

  const updateReligion = async (newReligion: string) => {
    if (newReligion !== religion) {
      setReligion(newReligion);
      setChangeDetected(true);
    } else {
      setReligion(newReligion);
    }
  };

  const updateSect = async (newSect: string) => {
    if (newSect !== sect) {
      setSect(newSect);
      setChangeDetected(true);
    } else {
      setSect(newSect);
    }
  };

  const updatePractiicing = async (newPractiicing: string) => {
    if (newPractiicing !== practiicing) {
      setPractiicing(newPractiicing);
      setChangeDetected(true);
    } else {
      setPractiicing(newPractiicing);
    }
  };

  const updateOpenness = async (newOpenness: string) => {
    if (newOpenness !== openness) {
      setOpenness(newOpenness);
      setChangeDetected(true);
    } else {
      setOpenness(newOpenness);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (changeDetected) {
        const response = await axios.put(
          'https://marhaba-server.onrender.com/api/account/updateReligion',
          {
            userId: profile?.userId,
            religion: religion,
            sect: sect,
            practicing: practiicing,
            openness: openness,
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
            Religion
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
                fieldName="Religion"
                selected={religion}
                onSelect={updateReligion}
                options={religionOptions}
              />
              <EditSelect
                fieldName="Sect"
                selected={sect}
                onSelect={updateSect}
                options={religiousSectOptions}
              />
              <EditSelect
                fieldName="Practiicing"
                selected={practiicing}
                onSelect={updatePractiicing}
                options={[
                  'Very Practicing',
                  'Somewhat Practicing',
                  'Not Practicing',
                  'Prefer not to say',
                ]}
              />
              <EditSelect
                fieldName="Openness"
                selected={openness}
                onSelect={updateOpenness}
                options={[
                  'Must align',
                  'Open to other religions',
                  'Open to other sects',
                  'Open to other practices',
                  'Prefer not to say',
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default EditReligion;
