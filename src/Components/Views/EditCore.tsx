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

const EditCore = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandProfile, setExpandProfile] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [family, setFamily] = useState(profile.name || '');
  const [faith, setFaith] = useState(profile.dob || '');
  const [ambition, setAmbition] = useState(profile.height || '');
  const [careerVsFamily, setCareerVsFamily] = useState(profile.height || '');
  const [conflicts, setConflicts] = useState(profile.height || '');
  const [independence, setIndependence] = useState(profile.height || '');
  const [decisions, setDecisions] = useState(profile.height || '');
  const [politics, setPolitics] = useState(profile.height || '');

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const loadProfile = () => {
    setFamily(profile?.Core[0]?.family);
    setFaith(profile?.Core[0]?.faith);
    setAmbition(profile?.Core[0]?.ambition);
    setCareerVsFamily(profile?.Core[0]?.careerVsFamily);
    setConflicts(profile?.Core[0]?.conflicts);
    setIndependence(profile?.Core[0]?.independence);
    setDecisions(profile?.Core[0]?.decisions);
    setPolitics(profile?.Core[0]?.politics);
  };

  const updateFamily = async (newFamily: string) => {
    if (newFamily !== family) {
      setFamily(newFamily);
      setChangeDetected(true);
    } else {
      setFamily(newFamily);
    }
  };

  const updateFaith = async (newFaith: string) => {
    if (newFaith !== faith) {
      setFaith(newFaith);
      setChangeDetected(true);
    } else {
      setFaith(newFaith);
    }
  };

  const updateAmbition = async (newAmbition: string) => {
    if (newAmbition !== ambition) {
      setAmbition(newAmbition);
      setChangeDetected(true);
    } else {
      setAmbition(newAmbition);
    }
  };

  const updateCareerVsFamily = async (newCareerVsFamily: string) => {
    if (newCareerVsFamily !== careerVsFamily) {
      setCareerVsFamily(newCareerVsFamily);
      setChangeDetected(true);
    } else {
      setCareerVsFamily(newCareerVsFamily);
    }
  };

  const updateConflicts = async (newConflicts: string) => {
    if (newConflicts !== conflicts) {
      setConflicts(newConflicts);
      setChangeDetected(true);
    } else {
      setConflicts(newConflicts);
    }
  };

  const updateIndependence = async (newIndependence: string) => {
    if (newIndependence !== independence) {
      setIndependence(newIndependence);
      setChangeDetected(true);
    } else {
      setIndependence(newIndependence);
    }
  };

  const updateDecisions = async (newDecisions: string) => {
    if (newDecisions !== decisions) {
      setDecisions(newDecisions);
      setChangeDetected(true);
    } else {
      setDecisions(newDecisions);
    }
  };

  const updatePolitics = async (newPolitics: string) => {
    if (newPolitics !== politics) {
      setPolitics(newPolitics);
      setChangeDetected(true);
    } else {
      setPolitics(newPolitics);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (changeDetected) {
        const response = await axios.put(
          'https://marhaba-server.onrender.com/api/account/updateCore',
          {
            userId: profile?.userId,
            family: family,
            faith: faith,
            ambition: ambition,
            careerVsFamily: careerVsFamily,
            conflicts: conflicts,
            independence: independence,
            decisions: decisions,
            politics: politics,
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
            Core Values
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
                fieldName="Building a Family"
                selected={family}
                onSelect={updateFamily}
                options={['Essential', 'Important', 'Neutral', 'Not Important']}
              />
              <EditSelect
                fieldName="Shared Faith"
                selected={faith}
                onSelect={updateFaith}
                options={[
                  'Essential',
                  'Important',
                  'Flexible',
                  'Not Important',
                  'Opposing Views',
                ]}
              />
              <EditSelect
                fieldName="Personal Ambition"
                selected={ambition}
                onSelect={updateAmbition}
                options={[
                  'Highly Ambitious',
                  'Moderately Ambitious',
                  'Low Ambition',
                  'Not A Priority',
                  'Still Exploring',
                ]}
              />
              <EditSelect
                fieldName="Career vs Family"
                selected={careerVsFamily}
                onSelect={updateCareerVsFamily}
                options={[
                  'Career First',
                  'Family First',
                  'Balanced',
                  'Flexible',
                  'Career Options',
                ]}
              />
              <EditSelect
                fieldName="Conflicts"
                selected={conflicts}
                onSelect={updateConflicts}
                options={[
                  'Calm decisions',
                  'Tackle head on',
                  'Need space',
                  'Emotional expression',
                  'Avoid conflict',
                ]}
              />
              <EditSelect
                fieldName="Independence"
                selected={independence}
                onSelect={updateIndependence}
                options={[
                  'Need space',
                  'Need to be close',
                  'Flexible',
                  'No preference',
                ]}
              />
              <EditSelect
                fieldName="Decisions Making"
                selected={decisions}
                onSelect={updateDecisions}
                options={[
                  'Lead the decision',
                  'collaborate equally',
                  'Let them decide',
                  'No preference',
                ]}
              />
              <EditSelect
                fieldName="Political Views"
                selected={politics}
                onSelect={updatePolitics}
                options={[
                  'Aligned with my views',
                  'Open to other views',
                  'No preference',
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default EditCore;
