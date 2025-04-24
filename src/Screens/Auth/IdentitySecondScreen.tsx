import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
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
import LookingFormSelect from '../../Components/Select/LookingFormSelect';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import HeightSelect from '../../Components/Select/HeightSelect';
import SmokeSelect from '../../Components/Select/SmokeSelect';
import DrinkSelect from '../../Components/Select/DrinkSelect';
import ReligionSelect from '../../Components/Select/ReligionSelect';
import ReligiousSectSelect from '../../Components/Select/ReligiousSectSelect';
import ReligiousViewsSelect from '../../Components/Select/ReligiousViewsSelect';
import BackgroundSelect from '../../Components/Select/BackgroundSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;

const IdentitySecondScreen = () => {
  const navigation = useNavigation();

  const [lookingFor, setLookingFor] = useState<string>('');
  const [views, setViews] = useState<string>('');
  const [sect, setSect] = useState<string>('');
  const [religion, setReligion] = useState<string>('');
  const [background, setBackground] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedLookingFor = await AsyncStorage.getItem('lookingMe');
    const storedBackground = await AsyncStorage.getItem('background');
    const storedReligion = await AsyncStorage.getItem('religion');
    const storedSec = await AsyncStorage.getItem('sect');
    const storedViews = await AsyncStorage.getItem('views');

    if (storedLookingFor) {
      setLookingFor(storedLookingFor);
    }
    if (storedBackground) {
      setBackground(storedBackground);
    }
    if (storedReligion) {
      setReligion(storedReligion);
    }
    if (storedSec) {
      setSect(storedSec);
    }
    if (storedViews) {
      setViews(storedViews);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (lookingFor != '' && background != '' && religion != '') {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out missing information');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('lookingMe', lookingFor);
    await AsyncStorage.setItem('background', background);
    await AsyncStorage.setItem('religion', religion);
    await AsyncStorage.setItem('sect', sect);
    await AsyncStorage.setItem('views', views);
    navigation.navigate('Career');
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-3/4 flex`}>
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
              Essential Info
            </Text>
          </View>
        </View>
        <View
          style={[
            tailwind`w-full flex justify-center`,
            {marginTop: screenHeight * 0.05},
          ]}>
          <LookingFormSelect
            fieldName="Looking For"
            selected={lookingFor}
            onSelect={setLookingFor}
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
        </View>
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

export default IdentitySecondScreen;
