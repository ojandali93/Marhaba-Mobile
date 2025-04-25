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
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;

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

const IdentityThirdScreen = () => {
  const navigation = useNavigation();

  const [commStyle, setCommStyle] = useState<string[]>([]);
  const [loveLanguage, setLoveLanguage] = useState<string[]>([]);
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [timePriority, setTimePriority] = useState<string[]>([]);

  const toggleCommStyle = (style: string) => {
    if (commStyle.includes(style)) {
      setCommStyle(prev => prev.filter(item => item !== style));
    } else if (commStyle.length < 2) {
      setCommStyle(prev => [...prev, style]);
    }
  };

  const toggleLoveLanguage = (lang: string) => {
    if (loveLanguage.includes(lang)) {
      setLoveLanguage(prev => prev.filter(item => item !== lang));
    } else if (loveLanguage.length < 2) {
      setLoveLanguage(prev => [...prev, lang]);
    }
  };

  const toggleCoreValue = (value: string) => {
    if (coreValues.includes(value)) {
      setCoreValues(prev => prev.filter(item => item !== value));
    } else if (coreValues.length < 3) {
      setCoreValues(prev => [...prev, value]);
    }
  };

  const toggleTimePriority = (value: string) => {
    if (timePriority.includes(value)) {
      setTimePriority(prev => prev.filter(item => item !== value));
    } else if (timePriority.length < 2) {
      setTimePriority(prev => [...prev, value]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedLookingFor = await AsyncStorage.getItem('commStyle');
    const storedLoveLanguage = await AsyncStorage.getItem('loveLanguage');
    const storedCoreValues = await AsyncStorage.getItem('coreValues');
    const storedTimePriority = await AsyncStorage.getItem('timePriority');

    if (storedLookingFor) {
      setCommStyle(JSON.parse(storedLookingFor));
    }
    if (storedLoveLanguage) {
      setLoveLanguage(JSON.parse(storedLoveLanguage));
    }
    if (storedCoreValues) {
      setCoreValues(JSON.parse(storedCoreValues));
    }
    if (storedTimePriority) {
      setTimePriority(JSON.parse(storedTimePriority));
    }
  };

  const redirectToPersonalityScreen = () => {
    storeNextScreen();
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('commStyle', JSON.stringify(commStyle));
    await AsyncStorage.setItem('loveLanguage', JSON.stringify(loveLanguage));
    await AsyncStorage.setItem('coreValues', JSON.stringify(coreValues));
    await AsyncStorage.setItem('timePriority', JSON.stringify(timePriority));
    navigation.navigate('Career');
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
            {marginTop: screenHeight * 0.1}, // 20% of screen height
          ]}>
          <View style={tailwind`mt-2`}>
            <Text
              style={[
                tailwind`mt-2 text-3xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              Essential Info (Continued)
            </Text>
          </View>
        </View>
        <View
          style={[
            tailwind`w-full flex justify-center`,
            {marginTop: screenHeight * 0.02},
          ]}></View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <View style={tailwind`mt-2`}>
            <Text style={tailwind`text-lg font-semibold mb-2`}>
              Communication Style (Max 2)
            </Text>

            <ScrollView
              style={tailwind`max-h-72`}
              showsVerticalScrollIndicator={false}>
              <View style={tailwind`flex-row flex-wrap justify-between`}>
                {communicationStyles.map((style, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleCommStyle(style)}
                    style={[
                      tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                      {
                        backgroundColor: commStyle.includes(style)
                          ? themeColors.primary
                          : themeColors.secondary,
                        borderColor: themeColors.primary,
                      },
                    ]}>
                    <Text
                      style={[
                        tailwind`text-center text-base`,
                        {
                          color: commStyle.includes(style) ? 'white' : 'black',
                        },
                      ]}>
                      {style}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/*  */}
            </ScrollView>
          </View>
          <View style={tailwind`mt-2`}>
            <Text style={tailwind`text-lg font-semibold mb-2`}>
              Love Language (Max 2)
            </Text>

            <ScrollView
              style={tailwind`max-h-72`}
              showsVerticalScrollIndicator={false}>
              <View style={tailwind`flex-row flex-wrap justify-between`}>
                {loveLanguages.map((lang, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleLoveLanguage(lang)}
                    style={[
                      tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                      {
                        backgroundColor: loveLanguage.includes(lang)
                          ? themeColors.primary
                          : themeColors.secondary,
                        borderColor: themeColors.primary,
                      },
                    ]}>
                    <Text
                      style={[
                        tailwind`text-center text-base`,
                        {
                          color: loveLanguage.includes(lang)
                            ? 'white'
                            : 'black',
                        },
                      ]}>
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          <View style={tailwind`mt-4`}>
            <Text style={tailwind`text-lg font-semibold mb-2`}>
              Core Values (Max 3)
            </Text>

            <ScrollView
              style={tailwind`max-h-72`}
              showsVerticalScrollIndicator={false}>
              <View style={tailwind`flex-row flex-wrap justify-between`}>
                {coreValuesList.map((value, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleCoreValue(value)}
                    style={[
                      tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                      {
                        backgroundColor: coreValues.includes(value)
                          ? themeColors.primary
                          : themeColors.secondary,
                        borderColor: themeColors.primary,
                      },
                    ]}>
                    <Text
                      style={[
                        tailwind`text-center text-base`,
                        {
                          color: coreValues.includes(value) ? 'white' : 'black',
                        },
                      ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          <View style={tailwind`mt-4`}>
            <Text style={tailwind`text-lg font-semibold mb-2`}>
              Time Priorities (Max 2)
            </Text>

            <ScrollView
              style={tailwind`max-h-72`}
              showsVerticalScrollIndicator={false}>
              <View style={tailwind`flex-row flex-wrap justify-between`}>
                {timePrioritiesList.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleTimePriority(item)}
                    style={[
                      tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                      {
                        backgroundColor: timePriority.includes(item)
                          ? themeColors.primary
                          : themeColors.secondary,
                        borderColor: themeColors.primary,
                      },
                    ]}>
                    <Text
                      style={[
                        tailwind`text-center text-base`,
                        {
                          color: timePriority.includes(item)
                            ? 'white'
                            : 'black',
                        },
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
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

export default IdentityThirdScreen;
