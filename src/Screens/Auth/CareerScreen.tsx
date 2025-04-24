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
import StandardInputBordered from '../../Components/Inputs/StandardInputBordered';
import RemoteSelect from '../../Components/Select/RemoteSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LongTextInput from '../../Components/Inputs/LongTextInput';

const screenHeight = Dimensions.get('window').height;

const CareerScreen = () => {
  const navigation = useNavigation();

  const [job, setJob] = useState<string>('');
  const [company, setCompoany] = useState<string>('');
  const [site, setSite] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [fiveYear, setFiveYear] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedJob = await AsyncStorage.getItem('job');
    const storedCompany = await AsyncStorage.getItem('company');
    const storeSite = await AsyncStorage.getItem('site');
    const storeLocation = await AsyncStorage.getItem('location');
    const storedEducation = await AsyncStorage.getItem('education');
    const storeFiveYear = await AsyncStorage.getItem('fiveYear');

    if (storedJob) {
      setJob(storedJob);
    }
    if (storedCompany) {
      setCompoany(storedCompany);
    }
    if (storeSite) {
      setSite(storeSite);
    }
    if (storeLocation) {
      setLocation(storeLocation);
    }
    if (storedEducation) {
      setEducation(storedEducation);
    }
    if (storeFiveYear) {
      setFiveYear(storeFiveYear);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (job != '' && education != '') {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('job', job);
    await AsyncStorage.setItem('company', company);
    await AsyncStorage.setItem('site', site);
    await AsyncStorage.setItem('location', location);
    await AsyncStorage.setItem('education', education);
    await AsyncStorage.setItem('fiveYear', fiveYear);
    navigation.navigate('Personality');
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
              Career & Background
            </Text>
          </View>
        </View>
        <View
          style={[
            tailwind`w-full flex flex-row items-center`,
            {marginTop: screenHeight * 0.05},
          ]}></View>
        <AithInputStandard
          fieldName="Education"
          value={education}
          changeText={setEducation}
          valid={true}
        />
        <AithInputStandard
          fieldName="Current job"
          value={job}
          changeText={setJob}
          valid={true}
        />
        <AithInputStandard
          fieldName="Current Company"
          value={company}
          changeText={setCompoany}
          valid={true}
          optional
        />
        <RemoteSelect
          fieldName="Site"
          selected={site}
          onSelect={setSite}
          optional
        />
        <AithInputStandard
          fieldName="Location"
          value={location}
          changeText={setLocation}
          valid={true}
          optional
        />
        <LongTextInput
          fieldName="In 5 years..."
          value={fiveYear}
          changeText={setFiveYear}
          optional
          multiline
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

export default CareerScreen;
