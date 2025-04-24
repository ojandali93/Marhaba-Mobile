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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import HeightSelect from '../../Components/Select/HeightSelect';
import SmokeSelect from '../../Components/Select/SmokeSelect';
import DrinkSelect from '../../Components/Select/DrinkSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;

const IdentityScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState<string>('');

  const [dob, setDob] = useState<Date | null>(null);

  const [gender, setGender] = useState<string>('');

  const [height, setHeight] = useState<string>('');
  const [smoke, setSmoke] = useState<string>('');
  const [drink, setDrink] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedName = await AsyncStorage.getItem('name');
    const storedDob = await AsyncStorage.getItem('dob');
    const storedGender = await AsyncStorage.getItem('gender');
    const storeHeight = await AsyncStorage.getItem('height');
    const storedSmoke = await AsyncStorage.getItem('smoke');
    const storedDrink = await AsyncStorage.getItem('drink');

    if (storedName) {
      setName(storedName);
    }
    if (storedDob) {
      try {
        const parsedDate = new Date(storedDob);
        if (!isNaN(parsedDate.getTime())) {
          setDob(parsedDate);
        } else {
          console.warn('❌ Invalid date string:', storedDob);
        }
      } catch (err) {
        console.error('❌ Error parsing date:', err);
      }
    }
    if (storedGender) {
      setGender(storedGender);
    }
    if (storeHeight) {
      setHeight(storeHeight);
    }
    if (storedSmoke) {
      setSmoke(storedSmoke);
    }
    if (storedDrink) {
      setDrink(storedDrink);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (name != '' && dob != null && gender != '') {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('name', name);
    await AsyncStorage.setItem('dob', dob?.toString());
    await AsyncStorage.setItem('gender', gender);
    await AsyncStorage.setItem('height', height);
    await AsyncStorage.setItem('smoke', smoke);
    await AsyncStorage.setItem('drink', drink);
    navigation.navigate('IdentitySecond');
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
            tailwind`w-full flex flex-row items-center`,
            {marginTop: screenHeight * 0.05},
          ]}>
          <View style={tailwind`w-full pr-1`}>
            <AithInputStandard
              fieldName="Name"
              value={name}
              changeText={setName}
              valid
            />
          </View>
        </View>
        <DateSelect fieldName="Date of Birth" dob={dob} setDate={setDob} />
        <GenderSelector
          fieldName="Gender"
          selected={gender}
          onSelect={setGender}
        />
        <HeightSelect
          fieldName="Height"
          selected={height}
          onSelect={setHeight}
          optional
        />
        <SmokeSelect
          fieldName="Smoke"
          selected={smoke}
          onSelect={setSmoke}
          optional
        />
        <DrinkSelect
          fieldName="Drink"
          selected={drink}
          onSelect={setDrink}
          optional
        />
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

export default IdentityScreen;
