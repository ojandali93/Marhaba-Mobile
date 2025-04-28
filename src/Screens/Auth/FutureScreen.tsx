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
import StaandardMultiSelect from '../../Components/Select/StaandardMultiSelect';

const screenHeight = Dimensions.get('window').height;

const FutureScreen = () => {
  const navigation = useNavigation();

  const [marriage, setMarriage] = useState<string>('');
  const [children,setChildren] = useState<string>('');
  const [career, setCareer] = useState<string>('');
  const [finances, setFinances] = useState<string>('');
  const [pace, setPace] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedMarriage = await AsyncStorage.getItem('futureMarriage');
    const storedChildren = await AsyncStorage.getItem('futureChildren');
    const storedCareer = await AsyncStorage.getItem('futureCareer');
    const storedFinances = await AsyncStorage.getItem('futureFinances');
    const storedPace = await AsyncStorage.getItem('futurePace');
    const storedLocation = await AsyncStorage.getItem('futureLocation');

    if (storedMarriage) {
        setMarriage(storedMarriage);
    }
    if (storedChildren) {
        setChildren(storedChildren);
    }
  if (storedCareer) {
    setCareer(storedCareer); // Load as array
  }
    if (storedFinances) {
        setFinances(storedFinances);
    }
    if (storedPace) {
        setPace(storedPace);
    }
    if (storedLocation) {
        setLocation(storedLocation);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (
      marriage != '' &&
      children != '' &&
      career != '' &&
      finances != '' &&
      pace != '' &&
      location != ''
    ) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('futureMarriage', marriage);
    await AsyncStorage.setItem('futureChildren', children);
    await AsyncStorage.setItem('futureCareer', career); // Save as JSON
    await AsyncStorage.setItem('futureFinances', finances);
    await AsyncStorage.setItem('futurePace', pace);
    await AsyncStorage.setItem('futureLocation', location);
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
              Future
            </Text>
          </View>
        </View>
        <View
          style={[
            tailwind`w-full flex flex-row items-center`,
            {marginTop: screenHeight * 0.02},
          ]}>
          <></>
        </View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <View style={tailwind`w-full pr-1`}>
            <StandardSelect
              fieldName="Desired Marriage"
              selected={marriage}
              onSelect={setMarriage}
              options={['Essential', 'Important', 'Flexible', 'Not Important', 'Other']}
            />
            <StandardSelect
              fieldName="Children"
              selected={children}
              onSelect={setChildren}
              options={['Essential', 'Important', 'Open/Natural', 'Prefer No Children', 'Other']}
            />
            <StandardSelect
            fieldName="Career Ambition"
            selected={career}
            onSelect={setCareer}
            options={['Very Ambitious', 'Balanced', 'Flexible', 'Simple Lifestyle', 'Other']}
            />
            <StandardSelect
            fieldName="Financial Ambition"
            selected={finances}
            onSelect={setFinances}
            options={['Very Ambitious', 'Balanced', 'Flexible', 'Simple Lifestyle', 'Other']}
            />
            <StandardSelect
            fieldName="Pace of Life"
            selected={pace}
            onSelect={setPace}
            options={['Fast', 'Moderate', 'Slow', 'Flexible', 'Other']}
            />
            <StandardSelect
            fieldName="Long Term Living"
            selected={location}
            onSelect={setLocation}
            options={['Stay near family', 'Open to relocating', 'Desire to move abroad', 'No strong preference', 'Other']}
            />
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

export default FutureScreen;
