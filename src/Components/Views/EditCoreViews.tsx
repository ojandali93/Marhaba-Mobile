import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {Camera, ChevronsDown, ChevronsUp, X} from 'react-native-feather';
import EditSelect from '../Select/EditSelect';
import axios from 'axios';
import { useProfile } from '../../Context/ProfileContext';
const EditCoreViews = () => {
    const {profile} = useProfile();
    const [expandedAbout, setExpandedAbout] = useState(false);    
    const [changeDetected, setChangeDetected] = useState(false);  

    const [family, setFamily] = useState('');
    const [faith, setFaith] = useState('');
    const [ambition, setAmbition] = useState('');
    const [career, setCareer] = useState('');
    const [honest, setHonest] = useState('');
    const [transparency, setTransparency] = useState('');
    const [trust, setTrust] = useState('');
    const [politics, setPolitics] = useState('');
    const [social, setSocial] = useState('');
    
    useFocusEffect(
        useCallback(() => {
            loadCoreViews();
        }, []),
      );

      const loadCoreViews = () => {
        console.log(profile?.data)
        console.log('single name', profile?.data?.About?.smoke)
        setFamily(profile?.data?.Core[0].family)
        setFaith(profile?.data?.Core[0].faith)
        setAmbition(profile?.data?.Core[0].ambition)
        setCareer(profile?.data?.Core[0].career)
        setHonest(profile?.data?.Core[0].honest)
        setTransparency(profile?.data?.Core[0].transparent)
        setTrust(profile?.data?.Core[0].trust)
        setPolitics(profile?.data?.Core[0].politics)
        setSocial(profile?.data?.Core[0].social)
      };

      const updateFamily = async (newFamily: string) => {
        if(newFamily !== family) {
            setFamily(newFamily)
            setChangeDetected(true)
        } else {
            setFamily(newFamily)
        }
      };

      const updateFaith = async (newValue: string) => {
        if(newValue !== faith) {
            setFaith(newValue)
            setChangeDetected(true)
        } else {
            setFaith(newValue)
        }
      };

      const updateAmbition = async (newAmbition: string) => {
        if(newAmbition !== ambition) {
            setAmbition(newAmbition)
            setChangeDetected(true)
        } else {
            setAmbition(newAmbition)
        }
      };

      const updateCareer = async (newValue: string) => {
        if(newValue !== career) {
            setCareer(newValue)
            setChangeDetected(true)
        } else {
            setCareer(newValue)
        }
      };

      const updateHonest = async (newHonest: string) => {
        if(newHonest !== honest) {
            setHonest(newHonest)
            setChangeDetected(true)
        } else {
            setHonest(newHonest)
        }
      };

      const updateTransparency = async (newValue: string) => {
        if (newValue !== transparency) {
          setTransparency(newValue);
          setChangeDetected(true);
        } else {
          setTransparency(newValue);
        }
      };
      
      const updateTrust = async (newValue: string) => {
        if (newValue !== trust) {
          setTrust(newValue);
          setChangeDetected(true);
        } else {
          setTrust(newValue);
        }
      };
      
        const updatePolitics = async (newValue: string) => {
            if (newValue !== politics) {
            setPolitics(newValue);
            setChangeDetected(true);
            } else {
            setPolitics(newValue);
            }
        };

      const updateSocial = async (newValue: string) => {
        if (newValue !== social) {
          setSocial(newValue);
          setChangeDetected(true);
        } else {
          setSocial(newValue);
        }
      };



      const updateUserProfile = async () => {
        try {
          if(changeDetected) {
            const response = await axios.put(
                'https://marhaba-server.onrender.com/api/account/updateCore',
                {
                    userId: profile?.data?.userId,
                    family: family,
                    faith: faith,
                    ambition: ambition,
                    career: career,
                    honest: honest,
                    transparent: transparency,
                    trust: trust,
                    politics: politics,
                    social: social,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  maxContentLength: Infinity,
                  maxBodyLength: Infinity,
                },
              );
              if(response.data.success) {
                setChangeDetected(false)
                setExpandedAbout(false)
              } else {
                console.error('Error updating user profile:', response.data.error);
              }
          }
        } catch (error) {
          console.error('Error updating user profile:', error);
        }
      };

  return(
    <View>
        <TouchableOpacity style={tailwind`w-full flex flex-col mt-2`} onPress={() => setExpandedAbout(!expandedAbout)}>
        <View style={[tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`, {backgroundColor: themeColors.darkSecondary}]}>
            <Text style={tailwind`text-base font-semibold text-gray-800`}>Core Values</Text>
            {
                expandedAbout ? (
                    changeDetected ? (
                    <TouchableOpacity onPress={updateUserProfile}>
                        <Text style={[tailwind`text-base font-bold px-2 py-1 rounded-md text-white`, { backgroundColor: themeColors.primary }]}>
                        Save
                        </Text>
                    </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setExpandedAbout(false)}>
                            <ChevronsUp height={24} width={24} color={themeColors.primary} />
                        </TouchableOpacity>
                    )
                ) : (
                    <ChevronsDown height={24} width={24} color={themeColors.primary} />
                )
            }
        </View>
      </TouchableOpacity>
        <View style={tailwind`flex-1`}>
        {expandedAbout && (
        <View
          style={tailwind`w-full flex flex-row items-center mb-5`}>
         <View style={tailwind`w-full pr-1`}>
            <EditSelect
              fieldName="Family"
              selected={family}
              onSelect={updateFamily}
              options={['Essential', 'Important', 'Neutral', 'Not Important']}
            />
            <EditSelect
              fieldName="Faith"
              selected={faith}
              onSelect={updateFaith}
              options={['Essential', 'Important', 'Flexible', 'Not Important', 'Opposing Views']}
            />
            <EditSelect
            fieldName="Personal Ambition"
              selected={ambition}
              onSelect={updateAmbition}
              options={['Highly Ambitious', 'Moderately Ambitious', 'Low Ambition', 'Not A Priority', 'Still Exploring']}
            />
            <EditSelect
              fieldName="Career Vs Family"
              selected={career}
              onSelect={updateCareer}
              options={['Career First', 'Family First', 'Balanced', 'Flexible', 'Career Options']}
            />
            <EditSelect
              fieldName="Honesty"
              selected={honest}
              onSelect={updateHonest}
              options={['Non-negotiable', 'Very Important', 'Important', 'Flexible', 'Depends on Situation']}
            />
            <EditSelect
              fieldName="Transparency"
              selected={transparency}
              onSelect={updateTransparency}
              options={['Non-negotiable', 'Very Important', 'Important', 'Flexible', 'Depends on Situation']}
            />
            <EditSelect
              fieldName="Trust"
              selected={trust}
              onSelect={updateTrust}
              options={['Non-negotiable', 'Very Important', 'Important', 'Flexible', 'Depends on Situation']}
            />
            <EditSelect
              fieldName="Political Views"
              selected={politics}
              onSelect={updatePolitics}
              options={['Essential', 'Important', 'Flexible', 'Not Important', 'Opposing Views']}
            />
            <EditSelect
              fieldName="Social"
              selected={social}
              onSelect={updateSocial}
              options={['Very Important', 'Somewhat Important', 'Important', 'Not Important']}
            />
          </View>
        </View>
        )}
        </View>
    </View>
  )
};

export default EditCoreViews;