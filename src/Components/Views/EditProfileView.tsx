import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {Camera, ChevronsDown, ChevronsUp, X} from 'react-native-feather';
import EditSelect from '../Select/EditSelect';
import EditTextInput from '../Select/EditTextInput';
import {heightsOptions, backgroundOptions} from '../../Utils/SelectOptions';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';

const EditProfileView = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandProfile, setExpandProfile] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.dob || '');
  const [height, setHeight] = useState(profile.height || '');
  const [background, setBackground] = useState<string[]>([]);

  const [isEmpty, setIsEmpty] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [profile]),
  );

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [profile]),
  );

  const loadProfile = () => {
    const about = profile?.About?.[0] || {};

    setName(profile?.name || '');
    setPhone(about.phone || '');
    setHeight(about.height || '');

    let parsedBackground = [];
    if (about.background) {
      try {
        const parsed = JSON.parse(about.background);
        if (Array.isArray(parsed)) {
          parsedBackground = parsed;
          setBackground(parsedBackground);
        } else {
          setBackground([]);
        }
      } catch {
        setBackground([]);
      }
    } else {
      setBackground([]);
    }

    const isAllEmpty =
      !profile?.name &&
      !about.phone &&
      !about.height &&
      parsedBackground.length === 0;

    setIsEmpty(isAllEmpty); // ✅ assumes useState: const [isEmpty, setIsEmpty] = useState(false);
  };

  const updateName = async (newName: string) => {
    if (newName !== name) {
      setName(newName);
      setChangeDetected(true);
    } else {
      setName(newName);
    }
  };

  const updatePhone = async (newName: string) => {
    if (newName !== phone) {
      setPhone(newName);
      setChangeDetected(true);
    } else {
      setPhone(newName);
    }
  };

  const updateHeight = async (newName: string) => {
    if (newName !== height) {
      setHeight(newName);
      setChangeDetected(true);
    } else {
      setHeight(newName);
    }
  };
  const updateUserProfile = async () => {
    try {
      if (changeDetected) {
        const response = await axios.put(
          'https://marhaba-server.onrender.com/api/account/updateProfile',
          {
            userId: profile?.userId,
            name: name,
            phone: phone,
            height: height,
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
        style={tailwind`w-full flex flex-col mt-2 px-2`}
        onPress={() => setExpandProfile(!expandProfile)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <View style={tailwind`flex flex-row items-center`}>
            <Text style={tailwind`text-base font-semibold`}>Profile Info</Text>
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
              <EditTextInput
                fieldName="Name"
                selected={name}
                onSelect={updateName}
              />
              <EditTextInput
                fieldName="Phone"
                selected={phone}
                onSelect={updatePhone}
              />
              <EditSelect
                fieldName="Height"
                selected={height}
                onSelect={updateHeight}
                options={heightsOptions}
              />
              <View
                style={tailwind`w-full flex flex-row items-center justify-between px-4 mt-3`}>
                <Text style={tailwind`text-base text-gray-800 italic`}>
                  Background
                </Text>
              </View>
              <ScrollView
                style={[
                  tailwind`w-full h-70 px-4 pt-3 pb-4 rounded-3 mb-4`,
                  {backgroundColor: themeColors.secondary},
                ]}>
                <View style={tailwind`w-full flex flex-row items-center`}>
                  <View style={tailwind`flex-row flex-wrap`}>
                    {backgroundOptions.map((country, index) => {
                      const isSelected = background.includes(country);
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => updateBackground(country)}
                          style={[
                            tailwind`px-2 py-1 m-1 rounded-full border`,
                            {
                              backgroundColor: isSelected
                                ? themeColors.primary
                                : themeColors.secondary,
                              borderColor: themeColors.primary,
                            },
                          ]}>
                          <Text
                            style={[
                              tailwind`text-base font-semibold`,
                              {
                                color: isSelected
                                  ? 'white'
                                  : themeColors.primary,
                              },
                            ]}>
                            {country}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default EditProfileView;
