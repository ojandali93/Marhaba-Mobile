import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {ChevronsDown, ChevronsUp} from 'react-native-feather';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';

const communicationStyles = [
  'Direct & honest',
  'Playful & teasing',
  'Thoughtful & reflective',
  'Light & humorous',
  'Supportive & empathetic',
  'Straight to the point',
];

const loveLanguages = [
  'Words of Affirmation',
  'Quality Time',
  'Acts of Service',
  'Physical Touch',
  'Receiving Gifts',
];

const coreValuesList = [
  'Loyalty',
  'Ambition',
  'Empathy',
  'Faith',
  'Honesty',
  'Humor',
  'Stability',
  'Curiosity',
  'Independence',
  'Family',
];

const timePrioritiesList = [
  'Family Time',
  'Friend Time',
  'Career / Work',
  'Spiritual Growth',
  'Alone / Recharge Time',
  'Building Something New',
];

const hasChanged = (original, current) => {
  if (original.length !== current.length) return true;
  const o = [...original].sort();
  const c = [...current].sort();
  return !o.every((val, i) => val === c[i]);
};

const EditRelationshipDynamics = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandProfile, setExpandProfile] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [commStyle, setCommStyle] = useState([]);
  const [loveLanguage, setLoveLanguage] = useState([]);
  const [coreValues, setCoreValues] = useState([]);
  const [timePriority, setTimePriority] = useState([]);

  const [originalComm, setOriginalComm] = useState([]);
  const [originalLove, setOriginalLove] = useState([]);
  const [originalValues, setOriginalValues] = useState([]);
  const [originalTime, setOriginalTime] = useState([]);

  const [isEmpty, setIsEmpty] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  useEffect(() => {
    const changed =
      hasChanged(originalComm, commStyle) ||
      hasChanged(originalLove, loveLanguage) ||
      hasChanged(originalValues, coreValues) ||
      hasChanged(originalTime, timePriority);
    setChangeDetected(changed);
  }, [commStyle, loveLanguage, coreValues, timePriority]);

  const loadProfile = () => {
    const comm = JSON.parse(profile?.Relationships?.[0]?.communication || '[]');
    const love = JSON.parse(profile?.Relationships?.[0]?.loveLanguages || '[]');
    const values = JSON.parse(profile?.Relationships?.[0]?.values || '[]');
    const time = JSON.parse(profile?.Relationships?.[0]?.time || '[]');

    setCommStyle(comm);
    setOriginalComm(comm);
    setLoveLanguage(love);
    setOriginalLove(love);
    setCoreValues(values);
    setOriginalValues(values);
    setTimePriority(time);
    setOriginalTime(time);

    const isAllEmpty =
      (!comm || comm.length === 0) &&
      (!love || love.length === 0) &&
      (!values || values.length === 0) &&
      (!time || time.length === 0);

    setIsEmpty(isAllEmpty);
  };

  const updateUserProfile = async () => {
    try {
      if (changeDetected) {
        const response = await axios.put(
          'https://marhaba-server.onrender.com/api/account/updateRelationships',
          {
            userId: profile?.userId,
            communication: commStyle,
            loveLanguages: loveLanguage,
            values: coreValues,
            time: timePriority,
          },
        );
        if (response.data.success) {
          setChangeDetected(false);
          await grabUserProfile(profile?.userId);
          loadProfile();
          setExpandProfile(false);
        }
      }
    } catch (err) {
      console.error('❌ Failed to update:', err);
    }
  };

  const toggleSelection = (value, list, setList, max) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value));
    } else if (list.length < max) {
      setList([...list, value]);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={tailwind`w-full flex flex-col mt-2 px-2`}
        onPress={() => setExpandProfile(!expandProfile)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <View style={tailwind`flex flex-row items-center`}>
            <Text style={tailwind`text-base font-semibold`}>
              Relationship Dynamics
            </Text>
            {isEmpty && (
              <View
                style={tailwind`w-2 h-2 rounded-full bg-orange-400 mr-2 ml-3`}
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
              <ChevronsUp height={24} width={24} color={themeColors.primary} />
            )
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </View>
      </TouchableOpacity>

      {expandProfile && (
        <View
          style={[
            tailwind`w-full mb-5 mt-4 pb-3 rounded-2`,
            {backgroundColor: themeColors.secondary},
          ]}>
          <ScrollView style={tailwind`w-full h-72 px-2 py-4`}>
            {[
              {
                label: 'Communication Style (2)',
                options: communicationStyles,
                list: commStyle,
                setList: setCommStyle,
                max: 2,
              },
              {
                label: 'Love Languages (2)',
                options: loveLanguages,
                list: loveLanguage,
                setList: setLoveLanguage,
                max: 2,
              },
              {
                label: 'Core Values (4)',
                options: coreValuesList,
                list: coreValues,
                setList: setCoreValues,
                max: 4,
              },
              {
                label: 'Time Priorities (2)',
                options: timePrioritiesList,
                list: timePriority,
                setList: setTimePriority,
                max: 2,
              },
            ].map(({label, options, list, setList, max}, idx) => (
              <View key={idx}>
                <Text style={tailwind`italic text-xl px-3 pb-1 mb-2`}>
                  {label}
                </Text>
                <View style={tailwind`flex-row flex-wrap`}>
                  {options.map((val, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => toggleSelection(val, list, setList, max)}
                      style={[
                        tailwind`py-2 px-3 mb-3 rounded-full border mr-2`,
                        {
                          backgroundColor: list.includes(val)
                            ? themeColors.primary
                            : themeColors.secondary,
                          borderColor: themeColors.primary,
                        },
                      ]}>
                      <Text
                        style={[
                          tailwind`text-center text-base`,
                          {color: list.includes(val) ? 'white' : 'black'},
                        ]}>
                        {val}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default EditRelationshipDynamics;
