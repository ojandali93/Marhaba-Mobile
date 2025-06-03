import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import {track} from '@amplitude/analytics-react-native';
import {ChevronsLeft} from 'react-native-feather';
import ContinueButton from '../../Components/Buttons/ContinueButton';
import StandardText from '../../Components/Select/StandardText';
import StandardInputBordered from '../../Components/Inputs/StandardInputBordered';
const screenHeight = Dimensions.get('window').height;

const T4Prompts = () => {
  const navigation = useNavigation();

  const [moment, setMoment] = useState<string>('');
  const [deeply, setDeeply] = useState<string>('');
  const [partner, setPartner] = useState<string>('');
  const [lifelong, setLifelong] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      track('T1 Prompts Started');
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedMoment = await AsyncStorage.getItem('T4_Moment');
    const storedDeeply = await AsyncStorage.getItem('T4_Deeply');
    const storedPartner = await AsyncStorage.getItem('T4_Partner');
    const storedLifelong = await AsyncStorage.getItem('T4_Lifelong');
    if (storedMoment) {
      setMoment(storedMoment);
    }
    if (storedDeeply) {
      setDeeply(storedDeeply);
    }
    if (storedPartner) {
      setPartner(storedPartner);
    }
    if (storedLifelong) {
      setLifelong(storedLifelong);
    }
  };

  const redirectToPersonalityScreen = () => {
    const hasAtLeastOne =
      moment !== '' || deeply !== '' || partner !== '' || lifelong !== '';
    if (hasAtLeastOne) {
      storeNextScreen();
    } else {
      Alert.alert(
        'Requirements',
        'Please answer at least one prompt before continuing.',
      );
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('T4_Moment', moment);
    await AsyncStorage.setItem('T4_Deeply', deeply);
    await AsyncStorage.setItem('T4_Partner', partner);
    await AsyncStorage.setItem('T4_Lifelong', lifelong);
    track('T2 Prompts Completed');
    navigation.navigate('Video');
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-full flex-1 flex mb-24`}>
        <View style={[tailwind`flex`, {marginTop: screenHeight * 0.07}]}>
          <View style={tailwind`mt-2 px-3`}>
            <View style={tailwind`w-full flex flex-row items-center`}>
              <TouchableWithoutFeedback
                style={tailwind`w-20 h-20`}
                onPress={() => {
                  navigation.goBack();
                }}>
                <View style={tailwind``}>
                  <ChevronsLeft
                    height={30}
                    width={30}
                    color={themeColors.primary}
                    style={tailwind`mr-1`}
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text
                style={[
                  tailwind`text-3xl font-semibold`,
                  {color: themeColors.primary},
                ]}>
                Bonding
              </Text>
            </View>
            <Text style={tailwind`text-sm mt-1`}>
              Answer as many prompts as you'd like. (1 required)
            </Text>
          </View>
        </View>
        <View style={tailwind`w-full flex justify-center mt-1`}></View>
        <ScrollView style={tailwind`w-full flex-1 px-3 mt-2`}>
          <StandardInputBordered
            value={moment}
            changeValue={text => setMoment(text)}
            fieldName={'One moment that shaped how I love is…'}
            longContent
            placeholder={'Enter your answer...'}
          />
          <StandardInputBordered
            value={deeply}
            changeValue={text => setDeeply(text)}
            fieldName={'I feel deeply connected to people when…'}
            longContent
            placeholder={'Enter your answer...'}
          />
          <StandardInputBordered
            value={partner}
            changeValue={text => setPartner(text)}
            fieldName={'The kind of partner I strive to be is…'}
            longContent
            placeholder={'Enter your answer...'}
          />
          <StandardInputBordered
            value={lifelong}
            changeValue={text => setLifelong(text)}
            fieldName={'What I want most in a lifelong partnership is…'}
            longContent
            placeholder={'Enter your answer...'}
          />
        </ScrollView>
      </View>
      <View
        style={tailwind`w-full absolute bottom-0 flex flex-row justify-between px-5 mb-12`}>
        <View style={tailwind`flex flex-row items-center`}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.popToTop();
            }}>
            <View style={tailwind``}>
              <Text style={tailwind`text-base font-bold text-red-400`}>
                Cancel
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ContinueButton text={'Photos'} click={redirectToPersonalityScreen} />
      </View>
    </View>
  );
};

export default T4Prompts;
