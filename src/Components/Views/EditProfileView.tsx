import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {Camera, ChevronsDown, ChevronsUp, X} from 'react-native-feather';
import EditSelect from '../Select/EditSelect';
import EditTextInput from '../Select/EditTextInput';
import { heightsOptions } from '../../Utils/SelectOptions';
import axios from 'axios';
import { useProfile } from '../../Context/ProfileContext';

const EditProfileView = () => {
  const {profile} = useProfile();

    const [expandProfile, setExpandProfile] = useState(false);    
    const [changeDetected, setChangeDetected] = useState(false);  

    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [smoker, setSmoker] = useState('');
    const [drink, setDrink] = useState('');
    const [hasKids, setHasKids] = useState('');
    
    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, []),
      );

      const loadProfile = () => {
        console.log(profile?.data)
        console.log('single name', profile?.data?.About?.smoke)
        setName(profile?.data?.name)
        setDob(profile?.data?.dob)
        setGender(profile?.data?.gender)
        setHeight(profile?.data?.height)
        setSmoker(profile?.data?.About[0]?.smoke)
        setDrink(profile?.data?.About[0]?.drink)
        setHasKids(profile?.data?.About[0]?.hasKids)
      };

      const updateName = async (newName: string) => {
        if(newName !== name) {
            setName(newName)
            setChangeDetected(true)
        } else {
            setName(newName)
        }
      };

      const updateGender = async (newValue: string) => {
        if(newValue !== gender) {
            setGender(newValue)
            setChangeDetected(true)
        } else {
            setGender(newValue)
        }
      };

      const updateHeight = async (newName: string) => {
        if(newName !== height) {
            setHeight(newName)
            setChangeDetected(true)
        } else {
            setHeight(newName)
        }
      };

      const updateSmoke = async (newValue: string) => {
        if(newValue !== smoker) {
            setSmoker(newValue)
            setChangeDetected(true)
        } else {
            setSmoker(newValue)
        }
      };

      const updateDrink = async (newName: string) => {
        if(newName !== drink) {
            setDrink(newName)
            setChangeDetected(true)
        } else {
            setDrink(newName)
        }
      };

      const updateHasKids = async (newValue: string) => {
        if(newValue !== hasKids) {
            setHasKids(newValue)
            setChangeDetected(true)
        } else {
            setHasKids(newValue)
        }
      };

      const updateUserProfile = async () => {
        console.log('new gender', gender)
        try {
          if(changeDetected) {
            const response = await axios.put(
                'https://marhaba-server.onrender.com/api/account/updateProfile',
                {
                    userId: profile?.data?.userId,
                    name: name,
                    gender: gender,
                    height: height,
                    smoke: smoker,
                    drink: drink,
                    hasKid: hasKids,
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
                setExpandProfile(false)
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
        <TouchableOpacity style={tailwind`w-full flex flex-col mt-2`} onPress={() => setExpandProfile(!expandProfile)}>
        <View style={[tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`, {backgroundColor: themeColors.darkSecondary}]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>Profile Info</Text>
            {
                expandProfile ? (
                    changeDetected ? (
                    <TouchableOpacity onPress={updateUserProfile}>
                        <Text style={[tailwind`text-base font-bold px-2 py-1 rounded-md text-white`, { backgroundColor: themeColors.primary }]}>
                        Save
                        </Text>
                    </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setExpandProfile(false)}>
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
        {expandProfile && (
        <View
          style={tailwind`w-full flex flex-row items-center mb-5`}>
         <View style={tailwind`w-full pr-1`}>
            <EditTextInput
              fieldName="Name"
              selected={name}
              onSelect={updateName}
            />
            <EditSelect
              fieldName="Gender"
              selected={gender}
              onSelect={updateGender}
              options={['Male', 'Female']}
            />
            <EditSelect
              fieldName="Height"
              selected={height}
              onSelect={updateHeight}
              options={heightsOptions}
            />
            <EditSelect
              fieldName="Smoker"
              selected={smoker}
              onSelect={updateSmoke}
              options={['Yes', 'No', 'Sometimes', 'Prefer not to say']}
            />
            <EditSelect
              fieldName="Drink"
              selected={drink}
              onSelect={updateDrink}
              options={['Yes', 'No', 'Sometimes', 'Prefer not to say']}
            />
            <EditSelect
              fieldName="Has Kids"
              selected={hasKids}
              onSelect={updateHasKids}
              options={['Yes', 'No']}
            />
          </View>
        </View>
        )}
        </View>
    </View>
  )
};

export default EditProfileView;
