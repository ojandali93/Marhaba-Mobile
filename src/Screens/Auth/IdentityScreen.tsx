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

const screenHeight = Dimensions.get('window').height;

const IdentityScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState<string>('');

  const [dob, setDob] = useState<Date | null>(null);

  const [gender, setGender] = useState<string>('');

  const [height, setHeight] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedName = await AsyncStorage.getItem('E_name');
    const storedDob = await AsyncStorage.getItem('E_dob');
    const storedGender = await AsyncStorage.getItem('E_gender');
    const storeHeight = await AsyncStorage.getItem('E_height');

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
  };

  const redirectToPersonalityScreen = () => {
    if (name != '' && dob != null && gender != '' && height != '') {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('E_name', name);
    await AsyncStorage.setItem('E_dob', dob?.toString());
    await AsyncStorage.setItem('E_gender', gender);
    await AsyncStorage.setItem('E_height', height);
    navigation.navigate('Background');
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
              Essential Info
            </Text>
          </View>
        </View>
        <View style={tailwind`w-full flex flex-row items-center mt-2`}>
          <></>
        </View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <View style={tailwind`w-full`}>
            <AithInputStandard
              fieldName="Name"
              value={name}
              changeText={setName}
              valid
              label="Name"
            />
          </View>
          <DateSelect fieldName="Date of Birth" dob={dob} setDate={setDob} />
          <StandardSelect
            fieldName="Gender"
            selected={gender}
            onSelect={setGender}
            options={['Male', 'Female']}
            label="Gender"
          />
          <StandardSelect
            fieldName="Height"
            selected={height}
            onSelect={setHeight}
            options={[
              '5\'0"',
              '5\'1"',
              '5\'2"',
              '5\'3"',
              '5\'4"',
              '5\'5"',
              '5\'6"',
              '5\'7"',
              '5\'8"',
              '5\'9"',
              '5\'10"',
              '5\'11"',
              '6\'0"',
              '6\'1"',
              '6\'2"',
              '6\'3"',
              '6\'4"',
              '6\'5"',
              '6\'6"',
              '6\'7"',
              '6\'8"',
              '6\'9"',
              '6\'10"',
              '6\'11"',
              '7\'0"',
            ]}
            label="Height"
          />
          {/* <StandardSelect
            fieldName="Have Kids"
            selected={kids}
            onSelect={setKids}
            options={['Yes', 'No']}
            label="Have Kids"
          />
          <StandardSelect
            fieldName="Smoke"
            selected={smoke}
            onSelect={setSmoke}
            options={['Yes', 'No']}
            label="Smoke"
            optional
          />
          <StandardSelect
            fieldName="Drink"
            selected={drink}
            onSelect={setDrink}
            options={['Yes', 'No']}
            label="Drink"
            optional
          /> */}
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

export default IdentityScreen;
