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

const EditIntent = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandProfile, setExpandProfile] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [intentions, setIntentions] = useState(profile.name || '');
  const [timeline, setTimeline] = useState(profile.dob || '');
  const [marriage, setMarriage] = useState(profile.height || '');
  const [marriageStatus, setMarriageStatus] = useState(profile.height || '');
  const [longDistance, setLongDistance] = useState(profile.height || '');
  const [relocate, setRelocate] = useState(profile.height || '');
  const [firstStep, setFirstStep] = useState(profile.height || '');

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const loadProfile = () => {
    setIntentions(profile?.Intent[0]?.intentions);
    setTimeline(profile?.Intent[0]?.timeline);
    setMarriage(profile?.Intent[0]?.marriage);
    setMarriageStatus(profile?.Intent[0]?.marriageStatus);
    setLongDistance(profile?.Intent[0]?.longDistance);
    setRelocate(profile?.Intent[0]?.relocate);
    setFirstStep(profile?.Intent[0]?.firstStep);
  };

  const updateIntentions = async (newIntentions: string) => {
    if (newIntentions !== intentions) {
      setIntentions(newIntentions);
      setChangeDetected(true);
    } else {
      setIntentions(newIntentions);
    }
  };

  const updateTimeline = async (newTimeline: string) => {
    if (newTimeline !== timeline) {
      setTimeline(newTimeline);
      setChangeDetected(true);
    } else {
      setTimeline(newTimeline);
    }
  };

  const updateMarriage = async (newMarriage: string) => {
    if (newMarriage !== marriage) {
      setMarriage(newMarriage);
      setChangeDetected(true);
    } else {
      setMarriage(newMarriage);
    }
  };

  const updateMarriageStatus = async (newMarriageStatus: string) => {
    if (newMarriageStatus !== marriageStatus) {
      setMarriageStatus(newMarriageStatus);
      setChangeDetected(true);
    } else {
      setMarriageStatus(newMarriageStatus);
    }
  };

  const updateLongDistance = async (newLongDistance: string) => {
    if (newLongDistance !== longDistance) {
      setLongDistance(newLongDistance);
      setChangeDetected(true);
    } else {
      setLongDistance(newLongDistance);
    }
  };

  const updateRelocate = async (newRelocate: string) => {
    if (newRelocate !== relocate) {
      setRelocate(newRelocate);
      setChangeDetected(true);
    } else {
      setRelocate(newRelocate);
    }
  };

  const updateFirstStep = async (newFirstStep: string) => {
    if (newFirstStep !== firstStep) {
      setFirstStep(newFirstStep);
      setChangeDetected(true);
    } else {
      setFirstStep(newFirstStep);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (changeDetected) {
        const response = await axios.put(
          'https://marhaba-server.onrender.com/api/account/updateIntent',
          {
            userId: profile?.userId,
            intentions: intentions,
            timeline: timeline,
            marriage: marriage,
            marriageStatus: marriageStatus,
            longDistance: longDistance,
            relocate: relocate,
            firstStep: firstStep,
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
            Relationship Intent
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
                fieldName="Intentions"
                selected={intentions}
                onSelect={updateIntentions}
                options={intentionsOptions}
              />
              <EditSelect
                fieldName="Timeline"
                selected={timeline}
                onSelect={updateTimeline}
                options={timelineOptions}
              />
              <EditSelect
                fieldName="Marriage"
                selected={marriage}
                onSelect={updateMarriage}
                options={importanceMarriageOptions}
              />
              <EditSelect
                fieldName="Marriage Status"
                selected={marriageStatus}
                onSelect={updateMarriageStatus}
                options={marriageStatusOptions}
              />
              <EditSelect
                fieldName="Long Distance"
                selected={longDistance}
                onSelect={updateLongDistance}
                options={['Yes', 'No', 'Maybe']}
              />
              <EditSelect
                fieldName="Relocate"
                selected={relocate}
                onSelect={updateRelocate}
                options={['Yes', 'No', 'Maybe']}
              />
              <EditSelect
                fieldName="First Step"
                selected={firstStep}
                onSelect={updateFirstStep}
                options={[
                  'Chat on app',
                  'Video call',
                  'Meet in person',
                  'Exchange numbers',
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default EditIntent;
