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

const LifestyleScreen = () => {
  const navigation = useNavigation();

  const [travelling, setTravelling] = useState<string>('');
  const [socialLife,setSocialLife] = useState<string>('');
  const [health, setHealth] = useState<string>('');
  const [finances, setFinances] = useState<string>('');
  const [living, setLiving] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedTravelling = await AsyncStorage.getItem('lifestyleTravelling');
    const storedSocialLife = await AsyncStorage.getItem('lifestyleSocialLife');
    const storedHealth = await AsyncStorage.getItem('lifestyleHealth');
    const storedFinances = await AsyncStorage.getItem('lifestyleFinances');
    const storedLiving = await AsyncStorage.getItem('lifestyleLiving');

    if (storedTravelling) {
        setTravelling(storedTravelling);
    }
    if (storedSocialLife) {
        setSocialLife(storedSocialLife);
    }
  if (storedHealth) {
    setHealth(storedHealth); // Load as array
  }
    if (storedFinances) {
        setFinances(storedFinances);
    }
    if (storedLiving) {
        setLiving(storedLiving);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (
      travelling != '' &&
      socialLife != '' &&
      health != '' &&
      finances != '' &&
      living != ''
    ) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('lifestyleTravelling', travelling);
    await AsyncStorage.setItem('lifestyleSocialLife', socialLife);
    await AsyncStorage.setItem('lifestyleHealth', health); // Save as JSON
    await AsyncStorage.setItem('lifestyleFinances', finances);
    await AsyncStorage.setItem('lifestyleLiving', living);
    navigation.navigate('Future');
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
              Lifestyle
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
              fieldName="Travel & Adventure"
              selected={travelling}
              onSelect={setTravelling}
              options={['Frequent Travel', 'Enjoy Occasional Trip', 'Prefer Staycations', 'Rarely Travel', 'Other']}
            />
            <StandardSelect
              fieldName="Social Life"
              selected={socialLife}
              onSelect={setSocialLife}
              options={['Very Social', 'Moderately Social', 'Selective Socializing', 'Not Very Social', 'Other']}
            />
            <StandardSelect
            fieldName="Health"
            selected={health}
            onSelect={setHealth}
            options={['Critical', 'Important', 'Moderate', 'Not Important', 'Other']}
            />
            <StandardSelect
            fieldName="Finances"
            selected={finances}
            onSelect={setFinances}
            options={['Saver', 'Spender', 'Balanced', 'Flexible', 'Other']}
            />
            <StandardSelect
            fieldName="Living Arrangement"
            selected={living}
            onSelect={setLiving}
            options={['In the City', 'In the Suburbs', 'In the Countryside', 'Flexible', 'Other']}
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

export default LifestyleScreen;
