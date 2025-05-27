import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import GenderSelector from '../../Components/Select/GenderSelect';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import DistanceSelect from '../../Components/Select/DistanceSelect';
import AgeSliderSelect from '../../Components/Select/AgeSliderSelect';
import ReligiousViewsSelect from '../../Components/Select/ReligiousViewsSelect';
import ReligiousSectSelect from '../../Components/Select/ReligiousSectSelect';
import ReligionSelect from '../../Components/Select/ReligionSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundSelect from '../../Components/Select/BackgroundSelect';
import StandardSelect from '../../Components/Select/StandardSelect';
import {
  backgroundOptions,
  religiousSectOptions,
  religionOptions,
} from '../../Utils/SelectOptions';
import StandardMultiSelect from '../../Components/Select/StandardMultiSelect';
import {track} from '@amplitude/analytics-react-native';
import {ChevronsLeft} from 'react-native-feather';
import ContinueButton from '../../Components/Buttons/ContinueButton';

const screenHeight = Dimensions.get('window').height;

// Religious Views (optional, dropdown or custom input)

// where I was born, background, height, drink, smoke, persona, interests, notifications,

const PreferencesScreen = () => {
  const navigation = useNavigation();
  const [gender, setGender] = useState<string>('');
  const [radius, setRaidus] = useState<string>('');
  const [views, setViews] = useState<string>('');
  const [sect, setSect] = useState<string>('');
  const [religion, setReligion] = useState<string>('');
  const [background, setBackground] = useState<string[]>([]);

  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);

  useFocusEffect(
    useCallback(() => {
      track('Preferences Started');
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedGender = await AsyncStorage.getItem('PR_Gender');
    const storedRadius = await AsyncStorage.getItem('PR_Radius');
    const storedViews = await AsyncStorage.getItem('PR_Views');
    const storedSect = await AsyncStorage.getItem('PR_Sect');
    const storedReligion = await AsyncStorage.getItem('PR_Religion');
    const storeAgeMin = await AsyncStorage.getItem('PR_AgeMin');
    const storeAgeMax = await AsyncStorage.getItem('PR_AgeMax');
    const storeBackground = await AsyncStorage.getItem('PR_Background');

    if (storedGender) {
      setGender(storedGender);
    }
    if (storedRadius) {
      setRaidus(storedRadius);
    }
    if (storedViews) {
      setViews(storedViews);
    }
    if (storedSect) {
      setSect(storedSect);
    }
    if (storedReligion) {
      setReligion(storedReligion);
    }
    if (storeBackground) {
      setBackground(JSON.parse(storeBackground));
    }
    if (storeAgeMin && storeAgeMax) {
      setAgeRange([parseInt(storeAgeMin), parseInt(storeAgeMax)]);
    }
  };

  const backgroundSelect = (country: string) => {
    if (background.includes(country)) {
      setBackground(prev => prev.filter(c => c !== country));
    } else if (background.length < 4) {
      setBackground(prev => [...prev, country]);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (gender !== '' && radius !== '' && background.length > 0) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out missing info.');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('PR_Gender', gender);
    await AsyncStorage.setItem('PR_Radius', radius);
    await AsyncStorage.setItem('PR_Views', views);
    await AsyncStorage.setItem('PR_Sect', sect);
    await AsyncStorage.setItem('PR_Religion', religion);
    await AsyncStorage.setItem('PR_Background', JSON.stringify(background));
    await AsyncStorage.setItem('PR_AgeMin', ageRange[0].toString());
    await AsyncStorage.setItem('PR_AgeMax', ageRange[1].toString());
    track('Preferences Completed');
    navigation.navigate('Personality');
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-11/12 flex-1 flex pb-24`}>
        <View style={[tailwind`flex`, {marginTop: screenHeight * 0.07}]}>
          <View style={tailwind`mt-2`}>
            <View style={tailwind`w-full flex flex-row items-center`}>
              <TouchableWithoutFeedback
                style={tailwind`w-20 h-20`}
                onPress={() => {
                  navigation.goBack();
                }}>
                <View style={tailwind``}>
                  <ChevronsLeft
                    height={30}
                    width={30}
                    color={themeColors.primary}
                    style={tailwind`mr-1`}
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text
                style={[
                  tailwind`text-3xl font-semibold`,
                  {color: themeColors.primary},
                ]}>
                Preferences
              </Text>
            </View>
            <Text style={tailwind`text-sm mt-1`}>
              Enter your details below.
            </Text>
          </View>
        </View>
        <View style={tailwind`w-full flex flex items-center`}></View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <AgeSliderSelect
            fieldName="Age Range"
            minAge={18}
            maxAge={60}
            ageRange={ageRange}
            setAgeRange={setAgeRange}
          />
          <StandardSelect
            fieldName="Gender"
            selected={gender}
            onSelect={setGender}
            options={['Male', 'Female', 'Other']}
            label="Gender"
          />
          <StandardSelect
            fieldName="Distance"
            selected={radius}
            onSelect={setRaidus}
            options={[
              'Close (50 miles)',
              'Medium (100 miles)',
              'Far (150 miles)',
              'Everywhere (500+ miles)',
            ]}
            label="Distance"
          />
          <StandardMultiSelect
            label="Background"
            options={backgroundOptions}
            selected={background}
            onSelect={backgroundSelect}
            maxSelectable={4}
            fieldName="Background"
          />
          <StandardSelect
            fieldName="Religion"
            selected={religion}
            onSelect={setReligion}
            options={religionOptions}
            label="Religion"
          />
          <StandardSelect
            fieldName="Religious Sect."
            selected={sect}
            onSelect={setSect}
            options={religiousSectOptions}
            label="Religious Sect."
            optional
          />
          <StandardSelect
            fieldName="Religious Views"
            selected={views}
            onSelect={setViews}
            options={[
              'Must align',
              'Open to other religions',
              'Open to other sects',
              'Open to other practices',
              'Prefer not to say',
            ]}
            label="Religious Views"
            optional
          />
        </ScrollView>
      </View>
      <View
        style={tailwind`w-full absolute bottom-0 flex flex-row justify-between px-5 mb-12`}>
        <View style={tailwind`flex flex-row items-center`}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.popToTop();
            }}>
            <View style={tailwind``}>
              <Text style={tailwind`text-base font-bold text-red-400`}>
                Cancel
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ContinueButton text={'Prompts'} click={redirectToPersonalityScreen} />
      </View>
    </View>
  );
};

export default PreferencesScreen;
