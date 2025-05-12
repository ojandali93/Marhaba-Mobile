import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AithInputStandard from '../../Components/Inputs/AithInputStandard';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import DateSelect from '../../Components/Select/DateSelect';
import GenderSelector from '../../Components/Select/GenderSelect';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import HeightSelect from '../../Components/Select/HeightSelect';
import SmokeSelect from '../../Components/Select/SmokeSelect';
import DrinkSelect from '../../Components/Select/DrinkSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KidsSelect from '../../Components/Select/KidsSelect';
import StandardSelect from '../../Components/Select/StandardSelect';
import {backgroundOptions} from '../../Utils/SelectOptions';

const screenHeight = Dimensions.get('window').height;

const BackgroundScreen = () => {
  const navigation = useNavigation();

  const [background, setBackground] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedBackground = await AsyncStorage.getItem('BG_Background');

    if (storedBackground) {
      setBackground(JSON.parse(storedBackground));
    }
  };

  const redirectToPersonalityScreen = () => {
    if (background.length > 0) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('BG_Background', JSON.stringify(background));
    navigation.navigate('LookingFor');
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-11/12 h-10/12 flex`}>
        <View
          style={[
            tailwind`flex`,
            {marginTop: screenHeight * 0.06}, // 20% of screen height
          ]}>
          <View style={tailwind`mt-2`}>
            <Text
              style={[
                tailwind`mt-2 text-3xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              Background
            </Text>
          </View>
        </View>
        <ScrollView style={tailwind`w-full flex-1 mt-3`}>
          <View style={tailwind`w-full flex flex-row items-center`}>
            <View style={tailwind`flex-row flex-wrap`}>
              {backgroundOptions.map((country, index) => {
                const isSelected = background.includes(country);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (isSelected) {
                        setBackground(prev => prev.filter(c => c !== country));
                      } else if (background.length < 2) {
                        setBackground(prev => [...prev, country]);
                      } else {
                        Alert.alert(
                          'Limit Reached',
                          'You can select up to 2 countries.',
                        );
                      }
                    }}
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
      </View>
      <View style={tailwind`absolute w-3/4 bottom-12`}>
        <View style={tailwind` w-full flex flex-row justify-end`}>
          <AuthMainButton
            text={'Continue'}
            click={redirectToPersonalityScreen}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tailwind`w-full items-center mt-4`}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BackgroundScreen;
