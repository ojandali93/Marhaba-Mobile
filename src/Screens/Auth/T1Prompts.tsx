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

const T1Prompts = () => {
  const navigation = useNavigation();

  const [weekends, setWeekends] = useState<string>('');
  const [friends, setFriends] = useState<string>('');
  const [mastger, setMastger] = useState<string>('');
  const [makeTime, setMakeTime] = useState<string>('');
  const [daily, setDaily] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      track('T1 Prompts Started');
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedWeekends = await AsyncStorage.getItem('T1_Weekends');
    const storedFriends = await AsyncStorage.getItem('T1_Friends');
    const storedMastger = await AsyncStorage.getItem('T1_Mastger');
    const storedMakeTime = await AsyncStorage.getItem('T1_MakeTime');
    const storedDaily = await AsyncStorage.getItem('T1_Daily');
    if (storedWeekends) {
      setWeekends(storedWeekends);
    }
    if (storedFriends) {
      setFriends(storedFriends);
    }
    if (storedMastger) {
      setMastger(storedMastger);
    }
    if (storedMakeTime) {
      setMakeTime(storedMakeTime);
    }
    if (storedDaily) {
      setDaily(storedDaily);
    }
  };

  const redirectToPersonalityScreen = () => {
    const hasAtLeastOne =
      weekends !== '' ||
      friends !== '' ||
      mastger !== '' ||
      makeTime !== '' ||
      daily !== '';
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
    await AsyncStorage.setItem('T1_Weekends', weekends);
    await AsyncStorage.setItem('T1_Friends', friends);
    await AsyncStorage.setItem('T1_Mastger', mastger);
    await AsyncStorage.setItem('T1_MakeTime', makeTime);
    await AsyncStorage.setItem('T1_Daily', daily);
    track('T1 Prompts Completed');
    navigation.navigate('T2Prompts');
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
                Light & Relatable
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
            value={weekends}
            changeValue={text => setWeekends(text)}
            fieldName={'On weekends, you’ll usually find me…'}
            longContent
            placeholder={'Enter your answer...'}
          />
          <StandardInputBordered
            value={friends}
            changeValue={text => setFriends(text)}
            fieldName={'My friends would describe me as…'}
            longContent
            placeholder={'Enter your answer...'}
          />
          <StandardInputBordered
            value={mastger}
            changeValue={text => setMastger(text)}
            fieldName={'A skill I would instatnly like to master is…'}
            longContent
            placeholder={'Enter your answer...'}
          />
          <StandardInputBordered
            value={makeTime}
            changeValue={text => setMakeTime(text)}
            fieldName={'One thing I always make time for is…'}
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
        <ContinueButton
          text={'Intentions & Identity'}
          click={redirectToPersonalityScreen}
        />
      </View>
    </View>
  );
};

export default T1Prompts;
