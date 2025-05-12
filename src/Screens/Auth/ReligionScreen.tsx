import React, {useCallback, useState} from 'react';
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
import LookingFormSelect from '../../Components/Select/LookingFormSelect';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ReligionSelect from '../../Components/Select/ReligionSelect';
import ReligiousSectSelect from '../../Components/Select/ReligiousSectSelect';
import ReligiousViewsSelect from '../../Components/Select/ReligiousViewsSelect';
import BackgroundSelect from '../../Components/Select/BackgroundSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimelineSelect from '../../Components/Select/TimelineSelect';
import TravelSelect from '../../Components/Select/TravelSelect';
import KidsSelect from '../../Components/Select/KidsSelect';
import StandardSelect from '../../Components/Select/StandardSelect';
import {
  intentionsOptions,
  timelineOptions,
  importanceMarriageOptions,
  marriageStatusOptions,
} from '../../Utils/SelectOptions';
import {religiousSectOptions, religionOptions} from '../../Utils/SelectOptions';
const screenHeight = Dimensions.get('window').height;

const ReligionScreen = () => {
  const navigation = useNavigation();

  const [religion, setReligion] = useState<string>('');
  const [sect, setSect] = useState<string>('');
  const [practices, setPractices] = useState<string>('');
  const [openness, setOpenness] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedReligion = await AsyncStorage.getItem('RG_Religion');
    const storedSect = await AsyncStorage.getItem('RG_Sect');
    const storedPractices = await AsyncStorage.getItem('RG_Practices');
    const storedOpenness = await AsyncStorage.getItem('RG_Openness');
    if (storedReligion) {
      setReligion(storedReligion);
    }
    if (storedSect) {
      setSect(storedSect);
    }
    if (storedPractices) {
      setPractices(storedPractices);
    }
    if (storedOpenness) {
      setOpenness(storedOpenness);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (religion !== '' && sect !== '') {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out missing information');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('RG_Religion', religion);
    await AsyncStorage.setItem('RG_Sect', sect);
    await AsyncStorage.setItem('RG_Practices', practices);
    await AsyncStorage.setItem('RG_Openness', openness);
    navigation.navigate('Core');
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
              Religion
            </Text>
          </View>
        </View>
        <View style={tailwind`w-full flex justify-center`}></View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <StandardSelect
            fieldName="Religion"
            selected={religion}
            onSelect={setReligion}
            options={religionOptions}
            label="Religion"
          />
          <StandardSelect
            fieldName="Sect"
            selected={sect}
            onSelect={setSect}
            options={religiousSectOptions}
            label="Sect"
          />
          <StandardSelect
            fieldName="Practices"
            selected={practices}
            onSelect={setPractices}
            options={[
              'Very Practicing',
              'Somewhat Practicing',
              'Not Practicing',
              'Prefer not to say',
            ]}
            label="Practices"
            optional
          />
          <StandardSelect
            fieldName="Openness"
            selected={openness}
            onSelect={setOpenness}
            options={[
              'Must align',
              'Open to other religions',
              'Open to other sects',
              'Open to other practices',
              'Prefer not to say',
            ]}
            label="Openness"
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

export default ReligionScreen;
