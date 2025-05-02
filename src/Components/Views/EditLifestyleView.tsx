import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {Camera, ChevronsDown, ChevronsUp, X} from 'react-native-feather';
import EditSelect from '../Select/EditSelect';
import axios from 'axios';
import { useProfile } from '../../Context/ProfileContext';

const EditLifestyleView = () => {
    const {profile}= useProfile();

    const [expandedAbout, setExpandedAbout] = useState(false);    
    const [changeDetected, setChangeDetected] = useState(false);  

    const [travel, setTravel] = useState('');
    const [social, setSocial] = useState('');
    const [health, setHealth] = useState('');
    const [finances, setFinances] = useState('');
    const [living, setLiving] = useState('');
    
    useFocusEffect(
        useCallback(() => {
            loadCoreViews();
        }, []),
      );

      const loadCoreViews = () => {
        console.log(profile?.data)
        console.log('single name', profile?.data?.About?.smoke)
        setTravel(profile?.data?.Lifestyle[0].travel)
        setSocial(profile?.data?.Lifestyle[0].social)
        setHealth(profile?.data?.Lifestyle[0].health)
        setFinances(profile?.data?.Lifestyle[0].finances)
        setLiving(profile?.data?.Lifestyle[0].living)
      };

      const updateTravel = async (newTravel: string) => {
        if(newTravel !== travel) {
            setTravel(newTravel)
            setChangeDetected(true)
        } else {
            setTravel(newTravel)
        }
      };

      const updateSocial = async (newValue: string) => {
        if(newValue !== social) {
            setSocial(newValue)
            setChangeDetected(true)
        } else {
            setSocial(newValue)
        }
      };

      const updateHealth = async (newHealth: string) => {
        if(newHealth !== health) {
            setHealth(newHealth)
            setChangeDetected(true)
        } else {
            setHealth(newHealth)
        }
      };

      const updateFinances = async (newValue: string) => {
        if(newValue !== finances) {
            setFinances(newValue)
            setChangeDetected(true)
        } else {
            setFinances(newValue)
        }
      };

      const updateLiving = async (newLiving: string) => {
        if(newLiving !== living) {
            setLiving(newLiving)
            setChangeDetected(true)
        } else {
            setLiving(newLiving)
        }
      };


      const updateUserProfile = async () => {
        try {
          if(changeDetected) {
            const response = await axios.put(
                'https://marhaba-server.onrender.com/api/account/updateLifestyle',
                {
                    userId: profile?.data?.userId,
                    travel: travel,
                    social: social,
                    health: health,
                    finances: finances,
                    living: living,
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
            <Text style={tailwind`text-base font-semibold text-gray-800`}>Lifestyle</Text>
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
              fieldName="Traveling"
              selected={travel}
              onSelect={updateTravel}
              options={['Frequent Travel', 'Enjoy Occasional Trip', 'Prefer Staycations', 'Rarely Travel', 'Other']}
            />
            <EditSelect
              fieldName="Social Life"
              selected={social}
              onSelect={updateSocial}
              options={['Very Social', 'Moderately Social', 'Selective Socializing', 'Not Very Social', 'Other']}
            />
            <EditSelect
            fieldName="Health"
              selected={health}
              onSelect={updateHealth}
              options={['Critical', 'Important', 'Moderate', 'Not Important', 'Other']}
            />
            <EditSelect
              fieldName="Finances"
              selected={finances}
              onSelect={updateFinances}
              options={['Saver', 'Spender', 'Balanced', 'Flexible', 'Other']}
            />
            <EditSelect
              fieldName="Living Preference"
              selected={living}
              onSelect={updateLiving}
              options={['In the City', 'In the Suburbs', 'In the Countryside', 'Flexible', 'Other']}
            />
          </View>
        </View>
        )}
        </View>
    </View>
  )
};

export default EditLifestyleView;