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

const screenHeight = Dimensions.get('window').height;

const IdentitySecondScreen = () => {
  const navigation = useNavigation();

  const [lookingFor, setLookingFor] = useState<string>('');
  const [views, setViews] = useState<string>('');
  const [sect, setSect] = useState<string>('');
  const [religion, setReligion] = useState<string>('');
  const [background, setBackground] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [travel, setTravel] = useState<string>('');
  const [futureKids, setFutureKids] = useState<string>('');

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
    const storedTimeline = await AsyncStorage.getItem('timeline');
    const storedTravels = await AsyncStorage.getItem('travel');
    const storedFutureKids = await AsyncStorage.getItem('futureKids');

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
    if (storedTimeline) {
      setTimeline(storedTimeline);
    }
    if (storedTravels) {
      setTravel(storedTravels);
    }
    if (storedFutureKids) {
      setFutureKids(storedFutureKids);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (
      lookingFor != '' &&
      background != '' &&
      religion != '' &&
      timeline != '' &&
      travel != ''
    ) {
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
    await AsyncStorage.setItem('timeline', timeline);
    await AsyncStorage.setItem('travel', travel);
    await AsyncStorage.setItem('futureKids', futureKids);
    navigation.navigate('IdentityThird');
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
              Essential Info (Continued)
            </Text>
          </View>
        </View>
        <View
          style={[
            tailwind`w-full flex justify-center`,
            {marginTop: screenHeight * 0.02},
          ]}></View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <TimelineSelect
            fieldName="Timeline (Marriage)"
            selected={timeline}
            onSelect={setTimeline}
          />
          <TravelSelect
            fieldName="Willing to travel"
            selected={travel}
            onSelect={setTravel}
          />
          <LookingFormSelect
            fieldName="Intentions"
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
          <KidsSelect
            fieldName="Want Kids"
            selected={futureKids}
            onSelect={setFutureKids}
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

export default IdentitySecondScreen;
