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

const T3Prompts = () => {
  const navigation = useNavigation();

  const [refuse, setRefuse] = useState<string>('');
  const [show, setShow] = useState<string>('');
  const [grown, setGrown] = useState<string>('');
  const [life, setLife] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      track('T1 Prompts Started');
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedRefuse = await AsyncStorage.getItem('T3_Refuse');
    const storedShow = await AsyncStorage.getItem('T3_Show');
    const storedGrown = await AsyncStorage.getItem('T3_Grown');
    const storedLife = await AsyncStorage.getItem('T3_Life');
    if (storedRefuse) {
      setRefuse(storedRefuse);
    }
    if (storedShow) {
      setShow(storedShow);
    }
    if (storedGrown) {
      setGrown(storedGrown);
    }
    if (storedLife) {
      setLife(storedLife);
    }
  };

  const redirectToPersonalityScreen = () => {
    const hasAtLeastOne =
      refuse !== '' || show !== '' || grown !== '' || life !== '';
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
    await AsyncStorage.setItem('T3_Refuse', refuse);
    await AsyncStorage.setItem('T3_Show', show);
    await AsyncStorage.setItem('T3_Grown', grown);
    await AsyncStorage.setItem('T3_Life', life);
    track('T2 Prompts Completed');
    navigation.navigate('T4Prompts');
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
                Depth & Emotions
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
            value={refuse}
            changeValue={text => setRefuse(text)}
            fieldName={'A value I refuse to compromise on is…'}
            longContent
            placeholder={'Enter your answer...'}
          />
          <StandardInputBordered
            value={show}
            changeValue={text => setShow(text)}
            fieldName={'When I care about someone…'}
            longContent
            placeholder={'Enter your answer...'}
          />
          <StandardInputBordered
            value={grown}
            changeValue={text => setGrown(text)}
            fieldName={'I’ve grown the most through…'}
            longContent
            placeholder={'Enter your answer...'}
          />
          <StandardInputBordered
            value={life}
            changeValue={text => setLife(text)}
            fieldName={'I feel most at peace when…'}
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
        <ContinueButton text={'Bonding'} click={redirectToPersonalityScreen} />
      </View>
    </View>
  );
};

export default T3Prompts;
