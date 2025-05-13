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
import {
  lookingForOptions,
  timelineOptions,
  backgroundOptions,
  religionOptions,
  religiousSectOptions,
  religiousViewsOptions,
} from '../../Utils/SelectOptions';
import {useProfile} from '../../Context/ProfileContext';
const EditEssentialsView = () => {
  const {profile} = useProfile();

  const [expandedAbout, setExpandedAbout] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [lookingFor, setLookingFor] = useState('');
  const [background, setBackground] = useState('');
  const [religion, setReligion] = useState('');
  const [sect, setSect] = useState('');
  const [view, setView] = useState('');
  const [timeline, setTimeline] = useState('');
  const [travel, setTravel] = useState('');
  const [future, setFuture] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const loadProfile = () => {
    setLookingFor(profile?.data?.About[0].lookingFor);
    setBackground(profile?.data?.About[0].background);
    setReligion(profile?.data?.About[0].religion);
    setSect(profile?.data?.About[0].sect);
    setView(profile?.data?.About[0].view);
    setTimeline(profile?.data?.About[0].timeline);
    setTravel(profile?.data?.About[0].travel);
    setFuture(profile?.data?.About[0]?.wantsKids);
  };

  const updateLookingFor = async (newLookingFor: string) => {
    if (newLookingFor !== lookingFor) {
      setLookingFor(newLookingFor);
      setChangeDetected(true);
    } else {
      setLookingFor(newLookingFor);
    }
  };

  const updateBackground = async (newValue: string) => {
    if (newValue !== background) {
      setBackground(newValue);
      setChangeDetected(true);
    } else {
      setBackground(newValue);
    }
  };

  const updateReligion = async (newReligion: string) => {
    if (newReligion !== religion) {
      setReligion(newReligion);
      setChangeDetected(true);
    } else {
      setReligion(newReligion);
    }
  };

  const updateSect = async (newValue: string) => {
    if (newValue !== sect) {
      setSect(newValue);
      setChangeDetected(true);
    } else {
      setSect(newValue);
    }
  };

  const updateView = async (newView: string) => {
    if (newView !== view) {
      setView(newView);
      setChangeDetected(true);
    } else {
      setView(newView);
    }
  };

  const updateTimeline = async (newValue: string) => {
    if (newValue !== timeline) {
      setTimeline(newValue);
      setChangeDetected(true);
    } else {
      setTimeline(newValue);
    }
  };

  const updateTravel = async (newValue: string) => {
    if (newValue !== travel) {
      setTravel(newValue);
      setChangeDetected(true);
    } else {
      setTravel(newValue);
    }
  };

  const updateFuture = async (newValue: string) => {
    if (newValue !== future) {
      setFuture(newValue);
      setChangeDetected(true);
    } else {
      setFuture(newValue);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (changeDetected) {
        const response = await axios.put(
          'https://marhaba-server.onrender.com/api/account/updateAbout',
          {
            userId: profile?.data?.userId,
            lookingFor: lookingFor,
            background: background,
            religion: religion,
            sect: sect,
            view: view,
            timeline: timeline,
            travel: travel,
            future: future,
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
          setExpandedAbout(false);
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
        onPress={() => setExpandedAbout(!expandedAbout)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkGrey},
          ]}>
          <Text style={tailwind`text-base font-semibold text-white`}>
            Essential
          </Text>
          {expandedAbout ? (
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
              <TouchableOpacity onPress={() => setExpandedAbout(false)}>
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
        {expandedAbout && (
          <View
            style={[
              tailwind`w-full flex flex-row items-center mb-5 mt-4 rounded-3`,
              {backgroundColor: themeColors.darkSecondary},
            ]}>
            <View style={tailwind`w-full pr-1`}>
              <EditSelect
                fieldName="Looking For"
                selected={lookingFor}
                onSelect={updateLookingFor}
                options={lookingForOptions}
              />
              <EditSelect
                fieldName="Timeline"
                selected={timeline}
                onSelect={updateTimeline}
                options={timelineOptions}
              />
              <EditSelect
                fieldName="Background"
                selected={background}
                onSelect={updateBackground}
                options={backgroundOptions}
              />
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
                fieldName="View"
                selected={view}
                onSelect={updateView}
                options={religiousViewsOptions}
              />
              <EditSelect
                fieldName="Travel"
                selected={travel}
                onSelect={updateTravel}
                options={['Yes', 'No', 'It Depends']}
              />
              <EditSelect
                fieldName="Future Kids"
                selected={future}
                onSelect={updateFuture}
                options={['Yes', 'No']}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default EditEssentialsView;
