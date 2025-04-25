import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
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
  const [background, setBackground] = useState<string>('');

  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedGender = await AsyncStorage.getItem('prefGender');
    const storedRadius = await AsyncStorage.getItem('preRadius');
    const storedViews = await AsyncStorage.getItem('prefViews');
    const storedSect = await AsyncStorage.getItem('prefSect');
    const storedReligion = await AsyncStorage.getItem('prefReligion');
    const storeAgeMin = await AsyncStorage.getItem('preAgeMin');
    const storeAgeMax = await AsyncStorage.getItem('prefAgeMax');
    const storeBackground = await AsyncStorage.getItem('prefBackground');

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
      setBackground(storeBackground);
    }
    if (storeAgeMin && storeAgeMax) {
      setAgeRange([parseInt(storeAgeMin), parseInt(storeAgeMax)]);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (gender != '' && radius != '' && background != '') {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out missing info.');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('prefGender', gender);
    await AsyncStorage.setItem('preRadius', radius);
    await AsyncStorage.setItem('prefViews', views);
    await AsyncStorage.setItem('prefSect', sect);
    await AsyncStorage.setItem('prefReligion', religion);
    await AsyncStorage.setItem('prefBackground', background);
    await AsyncStorage.setItem('preAgeMin', ageRange[0].toString());
    await AsyncStorage.setItem('prefAgeMax', ageRange[1].toString());
    navigation.navigate('Photos');
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
              Preferences
            </Text>
          </View>
        </View>
        <View
          style={[
            tailwind`w-full flex flex items-center`,
            {marginTop: screenHeight * 0.02},
          ]}></View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <AgeSliderSelect
            fieldName="Age Range"
            minAge={18}
            maxAge={60}
            ageRange={ageRange}
            setAgeRange={setAgeRange}
          />
          <GenderSelector
            fieldName="Gender"
            selected={gender}
            onSelect={setGender}
          />
          <DistanceSelect
            fieldName="Distance"
            selected={radius}
            onSelect={setRaidus}
          />
          <BackgroundSelect
            fieldName="Background"
            selected={background}
            onSelect={setBackground}
          />
          <ReligionSelect
            fieldName="Religion"
            selected={religion}
            onSelect={setReligion}
            optional
          />
          <ReligiousSectSelect
            fieldName="Religious Sect."
            selected={sect}
            onSelect={setSect}
            optional
          />
          <ReligiousViewsSelect
            fieldName="Religious Views"
            selected={views}
            onSelect={setViews}
            optional
          />
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

export default PreferencesScreen;
