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

const EditFuture = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandProfile, setExpandProfile] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [career, setCareer] = useState(profile.name || '');
  const [finances, setFinances] = useState(profile.dob || '');
  const [pace, setPace] = useState(profile.height || '');
  const [location, setLocation] = useState(profile.height || '');
  const [fiveYears, setFiveYears] = useState(profile.height || '');

  const [isEmpty, setIsEmpty] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const loadProfile = () => {
    const future = profile?.Future?.[0] || {};

    const careerValue = future.career || '';
    const financesValue = future.finances || '';
    const paceValue = future.pace || '';
    const locationValue = future.location || '';
    const fiveYearsValue = future.fiveYear || '';

    setCareer(careerValue);
    setFinances(financesValue);
    setPace(paceValue);
    setLocation(locationValue);
    setFiveYears(fiveYearsValue);

    const isAllEmpty =
      !careerValue &&
      !financesValue &&
      !paceValue &&
      !locationValue &&
      !fiveYearsValue;

    setIsEmpty(isAllEmpty);
  };

  const updateCareer = async (newCareer: string) => {
    if (newCareer !== career) {
      setCareer(newCareer);
      setChangeDetected(true);
    } else {
      setCareer(newCareer);
    }
  };

  const updateFinances = async (newFinances: string) => {
    if (newFinances !== finances) {
      setFinances(newFinances);
      setChangeDetected(true);
    } else {
      setFinances(newFinances);
    }
  };

  const updatePace = async (newPace: string) => {
    if (newPace !== pace) {
      setPace(newPace);
      setChangeDetected(true);
    } else {
      setPace(newPace);
    }
  };

  const updateLocation = async (newLocation: string) => {
    if (newLocation !== location) {
      setLocation(newLocation);
      setChangeDetected(true);
    } else {
      setLocation(newLocation);
    }
  };

  const updateFiveYears = async (newFiveYears: string) => {
    if (newFiveYears !== fiveYears) {
      setFiveYears(newFiveYears);
      setChangeDetected(true);
    } else {
      setFiveYears(newFiveYears);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (changeDetected) {
        const response = await axios.put(
          'https://marhaba-server.onrender.com/api/account/updateIntent',
          {
            userId: profile?.userId,
            career: career,
            finances: finances,
            pace: pace,
            location: location,
            fiveYear: fiveYears,
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
          await grabUserProfile(profile?.userId);
          loadProfile();
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
          <View style={tailwind`flex flex-row items-center`}>
            <Text style={tailwind`text-base font-semibold text-white`}>
              The Future
            </Text>
            {isEmpty && (
              <View
                style={tailwind`w-2 h-2 rounded-full bg-yellow-400 mr-2 ml-3`}
              />
            )}
          </View>
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
                fieldName="Career Ambition"
                selected={career}
                onSelect={updateCareer}
                options={[
                  'Very Ambitious',
                  'Balanced',
                  'Flexible',
                  'Simple Lifestyle',
                  'Other',
                ]}
              />
              <EditSelect
                fieldName="Financial Ambition"
                selected={finances}
                onSelect={updateFinances}
                options={[
                  'Very Ambitious',
                  'Balanced',
                  'Flexible',
                  'Simple Lifestyle',
                  'Other',
                ]}
              />
              <EditSelect
                fieldName="Pace"
                selected={pace}
                onSelect={updatePace}
                options={['Fast', 'Moderate', 'Slow', 'Flexible', 'Other']}
              />
              <EditSelect
                fieldName="Location"
                selected={location}
                onSelect={updateLocation}
                options={[
                  'Stay near family',
                  'Open to relocating',
                  'Desire to move abroad',
                  'No strong preference',
                  'Other',
                ]}
              />
              <EditTextInput
                fieldName="Five Years"
                value={fiveYears}
                changeText={setFiveYears}
                valid={true}
                label="5 Year Plan"
                multiline
                optional
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default EditFuture;
