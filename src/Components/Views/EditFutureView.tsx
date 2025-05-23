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
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';

const EditFutureView = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandedAbout, setExpandedAbout] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [marriage, setMarriage] = useState(profile?.Future[0].marriage || '');
  const [children, setChildren] = useState(profile?.Future[0].children || '');
  const [career, setCareer] = useState(profile?.Future[0].career || '');
  const [finances, setFinances] = useState(profile?.Future[0].finances || '');
  const [pace, setPace] = useState(profile?.Future[0].pace || '');
  const [live, setLive] = useState(profile?.Future[0].live || '');

  useFocusEffect(
    useCallback(() => {
      loadCoreViews();
    }, []),
  );

  const loadCoreViews = () => {
    setMarriage(profile?.Future[0].marriage);
    setChildren(profile?.Future[0].children);
    setCareer(profile?.Future[0].career);
    setFinances(profile?.Future[0].finances);
    setPace(profile?.Future[0].pace);
  };

  const updateMarriage = async (newMarriage: string) => {
    if (newMarriage !== marriage) {
      setMarriage(newMarriage);
      setChangeDetected(true);
    } else {
      setMarriage(newMarriage);
    }
  };

  const updateChildren = async (newValue: string) => {
    if (newValue !== children) {
      setChildren(newValue);
      setChangeDetected(true);
    } else {
      setChildren(newValue);
    }
  };

  const updateCareer = async (newCareer: string) => {
    if (newCareer !== career) {
      setCareer(newCareer);
      setChangeDetected(true);
    } else {
      setCareer(newCareer);
    }
  };

  const updateFinances = async (newValue: string) => {
    if (newValue !== finances) {
      setFinances(newValue);
      setChangeDetected(true);
    } else {
      setFinances(newValue);
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

  const updateLive = async (newValue: string) => {
    if (newValue !== live) {
      setLive(newValue);
      setChangeDetected(true);
    } else {
      setLive(newValue);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (changeDetected) {
        const response = await axios.put(
          'https://marhaba-server.onrender.com/api/account/updateFuture',
          {
            userId: profile?.data?.userId,
            marriage: marriage,
            children: children,
            career: career,
            finances: finances,
            pace: pace,
            live: live,
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
            Future
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
                fieldName="Marriage"
                selected={marriage}
                onSelect={updateMarriage}
                options={[
                  'Essential',
                  'Important',
                  'Flexible',
                  'Not Important',
                  'Other',
                ]}
              />
              <EditSelect
                fieldName="Children"
                selected={children}
                onSelect={updateChildren}
                options={[
                  'Essential',
                  'Important',
                  'Open/Natural',
                  'Prefer No Children',
                  'Other',
                ]}
              />
              <EditSelect
                fieldName="Personal Ambition"
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
                fieldName="Finances Ambition"
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
                fieldName="Pace of Like"
                selected={pace}
                onSelect={updatePace}
                options={['Fast', 'Moderate', 'Slow', 'Flexible', 'Other']}
              />
              <EditSelect
                fieldName="Long Term Living"
                selected={live}
                onSelect={updateLive}
                options={[
                  'Stay near family',
                  'Open to relocating',
                  'Desire to move abroad',
                  'No strong preference',
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

export default EditFutureView;
