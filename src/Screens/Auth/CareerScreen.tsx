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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RemoteSelect from '../../Components/Select/RemoteSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LongTextInput from '../../Components/Inputs/LongTextInput';
import StandardInputBordered from '../../Components/Inputs/StandardInputBordered';
import StandardSelect from '../../Components/Select/StandardSelect';
import {industries} from '../../Utils/SelectOptions';
import StandardText from '../../Components/Select/StandardText';

const screenHeight = Dimensions.get('window').height;

const CareerScreen = () => {
  const navigation = useNavigation();

  const [job, setJob] = useState<string>('');
  const [company, setCompoany] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [relocateWork, setRelocateWork] = useState<string>('');
  const [site, setSite] = useState<string>('');
  const [education, setEducation] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedJob = await AsyncStorage.getItem('CE_Job');
    const storedCompany = await AsyncStorage.getItem('CE_Company');
    const storedIndustry = await AsyncStorage.getItem('CE_Industry');
    const storedRelocateWork = await AsyncStorage.getItem('CE_RelocateWork');
    const storedSite = await AsyncStorage.getItem('CE_Site');
    const storedEducation = await AsyncStorage.getItem('CE_Education');

    if (storedJob) {
      setJob(storedJob);
    }
    if (storedCompany) {
      setCompoany(storedCompany);
    }
    if (storedIndustry) {
      setIndustry(storedIndustry);
    }
    if (storedRelocateWork) {
      setRelocateWork(storedRelocateWork);
    }
    if (storedSite) {
      setSite(storedSite);
    }
    if (storedEducation) {
      setEducation(storedEducation);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (job !== '' && education !== '' && company !== '') {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('CE_Job', job);
    await AsyncStorage.setItem('CE_Company', company);
    await AsyncStorage.setItem('CE_Industry', industry);
    await AsyncStorage.setItem('CE_RelocateWork', relocateWork);
    await AsyncStorage.setItem('CE_Site', site);
    await AsyncStorage.setItem('CE_Education', education);
    navigation.navigate('Future');
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-11/12 h-10/12 flex pb-12`}>
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
              Career & Background
            </Text>
          </View>
        </View>
        <View style={tailwind`w-full flex flex-row items-center`}></View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <StandardText
            fieldName="Current job"
            value={job}
            changeText={setJob}
            valid={true}
            label="Current job"
          />
          <StandardText
            fieldName="Current Company"
            value={company}
            changeText={setCompoany}
            valid={true}
            label="Current Company"
          />
          <StandardSelect
            fieldName="Industry"
            selected={industry}
            onSelect={setIndustry}
            optional
            options={industries}
            label="Industry"
          />
          <StandardSelect
            fieldName="Work Site"
            selected={site}
            onSelect={setSite}
            optional
            options={['Remote', 'On Site', 'Hybrid', 'Other']}
            label="Work Site"
          />
          <StandardSelect
            fieldName="Relocate Work"
            selected={relocateWork}
            onSelect={setRelocateWork}
            optional
            options={['Yes', 'No']}
            label="Relocate Work"
          />
          <StandardText
            fieldName="Education"
            value={education}
            changeText={setEducation}
            valid={true}
            label="Education"
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

export default CareerScreen;
