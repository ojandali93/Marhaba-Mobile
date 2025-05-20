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
const screenHeight = Dimensions.get('window').height;

const LookingForScreen = () => {
  const navigation = useNavigation();

  const [intentions, setIntentions] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [marriage, setMarriage] = useState<string>('');
  const [marriageStatus, setMarriageStatus] = useState<string>('');
  const [longDistance, setLongDistance] = useState<string>('');
  const [relocate, setRelocate] = useState<string>('');
  const [firstStep, setFirstStep] = useState<string>('');
  const [parents, setParents] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedLookingFor = await AsyncStorage.getItem('LF_Intentions');
    const storedTimeline = await AsyncStorage.getItem('LF_Timeline');
    const storedMarriage = await AsyncStorage.getItem('LF_Marriage');
    const storedMarriageStatus = await AsyncStorage.getItem(
      'LF_MarriageStatus',
    );
    const storedLongDistance = await AsyncStorage.getItem('LF_LongDistance');
    const storedRelocate = await AsyncStorage.getItem('LF_Relocate');
    const storedFirstStep = await AsyncStorage.getItem('LF_FirstStep');
    const storedParents = await AsyncStorage.getItem('LF_Parents');
    if (storedLookingFor) {
      setIntentions(storedLookingFor);
    }
    if (storedTimeline) {
      setTimeline(storedTimeline);
    }
    if (storedMarriage) {
      setMarriage(storedMarriage);
    }
    if (storedMarriageStatus) {
      setMarriageStatus(storedMarriageStatus);
    }
    if (storedLongDistance) {
      setLongDistance(storedLongDistance);
    }
    if (storedRelocate) {
      setRelocate(storedRelocate);
    }
    if (storedFirstStep) {
      setFirstStep(storedFirstStep);
    }
    if (storedParents) {
      setParents(storedParents);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (
      intentions !== '' &&
      timeline !== '' &&
      marriage !== '' &&
      longDistance !== '' &&
      relocate !== ''
    ) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out missing information');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('LF_Intentions', intentions);
    await AsyncStorage.setItem('LF_Timeline', timeline);
    await AsyncStorage.setItem('LF_Marriage', marriage);
    await AsyncStorage.setItem('LF_MarriageStatus', marriageStatus);
    await AsyncStorage.setItem('LF_LongDistance', longDistance);
    await AsyncStorage.setItem('LF_Relocate', relocate);
    await AsyncStorage.setItem('LF_FirstStep', firstStep);
    await AsyncStorage.setItem('LF_Parents', parents);
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
            {marginTop: screenHeight * 0.06}, // 20% of screen height
          ]}>
          <View style={tailwind`mt-2`}>
            <Text
              style={[
                tailwind`mt-2 text-3xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              Relationship Intent
            </Text>
          </View>
        </View>
        <View style={tailwind`w-full flex justify-center`}></View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <StandardSelect
            fieldName="Intentions"
            selected={intentions}
            onSelect={setIntentions}
            options={intentionsOptions}
            label="Intentions"
          />
          <StandardSelect
            fieldName="Timeline"
            selected={timeline}
            onSelect={setTimeline}
            options={timelineOptions}
            label="Timeline"
          />
          <StandardSelect
            fieldName="Importance (Marriage)"
            selected={marriage}
            onSelect={setMarriage}
            options={importanceMarriageOptions}
            label="Importance (Marriage)"
          />
          <StandardSelect
            fieldName="Marriage Status"
            selected={marriageStatus}
            onSelect={setMarriageStatus}
            options={marriageStatusOptions}
            label="Marriage Status"
            optional
          />
          <StandardSelect
            fieldName="Long Distance"
            selected={longDistance}
            onSelect={setLongDistance}
            options={['Yes', 'No', 'Maybe']}
            label="Long Distance"
          />
          <StandardSelect
            fieldName="Relocate"
            selected={relocate}
            onSelect={setRelocate}
            options={['Yes', 'No', 'Maybe']}
            label="Relocate"
          />
          <StandardSelect
            fieldName="First Step"
            selected={firstStep}
            onSelect={setFirstStep}
            options={[
              'Chat on app',
              'Video call',
              'Meet in person',
              'Exchange numbers',
            ]}
            label="First Step"
            optional
          />
          <StandardSelect
            fieldName="Family Involvement"
            selected={parents}
            onSelect={setParents}
            options={[
              'Immediately',
              'After a few dates',
              'Once serious',
              'Not important',
            ]}
            label="Family Involvement"
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

export default LookingForScreen;
