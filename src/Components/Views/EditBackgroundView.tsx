import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {ChevronsDown, ChevronsUp} from 'react-native-feather';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';
import {backgroundOptions} from '../../Utils/SelectOptions';

const EditBackgroundView = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandProfile, setExpandProfile] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);
  const [background, setBackground] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (profile && profile?.About?.[0]?.background) {
        try {
          const parsed = JSON.parse(profile.About[0].background);
          if (Array.isArray(parsed)) {
            setBackground(parsed);
          } else {
            setBackground([]);
          }
        } catch {
          setBackground([]);
        }
      }
    }, [profile]),
  );

  const updateBackground = (country: string) => {
    const isSelected = background.includes(country);
    if (isSelected) {
      const newBackground = background.filter(c => c !== country);
      setBackground(newBackground);
      setChangeDetected(true);
    } else if (background.length < 2) {
      const newBackground = [...background, country];
      setBackground(newBackground);
      setChangeDetected(true);
    } else {
      Alert.alert('Limit Reached', 'You can select up to 2 countries.');
    }
  };

  const updateUserProfile = async () => {
    if (!changeDetected || !profile?.userId) return;

    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/account/updateBackground',
        {
          userId: profile.userId,
          background: JSON.stringify(background),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        setChangeDetected(false);
        grabUserProfile(profile.userId);
        setExpandProfile(false);
      } else {
        console.error('Error updating user profile:', response.data.error);
      }
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
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
            Background
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

      {expandProfile && (
        <ScrollView
          style={[
            tailwind`w-full h-70 p-4 rounded-3 my-3`,
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
                          color: isSelected ? 'white' : themeColors.primary,
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
      )}
    </View>
  );
};

export default EditBackgroundView;
