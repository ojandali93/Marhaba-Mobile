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
import StaandardMultiSelect from '../../Components/Select/StaandardMultiSelect';

const screenHeight = Dimensions.get('window').height;

const CoreScreen = () => {
  const navigation = useNavigation();

  const [conflict, setConflict] = useState<string>('');
  const [apology,setApology] = useState<string>('');
  const [anger, setAnger] = useState<string[]>([]);
  const [stress, setStress] = useState<string>('');
  const [emotion, setEmotion] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedConflict = await AsyncStorage.getItem('emotionConflict');
    const storedApology = await AsyncStorage.getItem('emotionApology');
    const storedAnger = await AsyncStorage.getItem('emotionAnger');
    const storedStress = await AsyncStorage.getItem('emotionStress');
    const storedEmotion = await AsyncStorage.getItem('emotionEmotion');

    if (storedConflict) {
        setConflict(storedConflict);
    }
    if (storedApology) {
        setApology(storedApology);
    }
  if (storedAnger) {
    setAnger(JSON.parse(storedAnger)); // Load as array
  }
    if (storedStress) {
        setStress(storedStress);
    }
    if (storedEmotion) {
        setEmotion(storedEmotion);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (
      conflict != '' &&
      apology != null &&
      anger.length > 0 &&
      stress != '' &&
      emotion != ''
    ) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('emotionConflict', conflict);
    await AsyncStorage.setItem('emotionApology', apology);
    await AsyncStorage.setItem('emotionAnger', JSON.stringify(anger)); // Save as JSON
    await AsyncStorage.setItem('emotionStress', stress);
    await AsyncStorage.setItem('emotionEmotion', emotion);
    navigation.navigate('Attachment');
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
              Emotions & Maturity
            </Text>
          </View>
        </View>
        <View
          style={[
            tailwind`w-full flex flex-row items-center`,
            {marginTop: screenHeight * 0.02},
          ]}>
          <></>
        </View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <View style={tailwind`w-full pr-1`}>
            <StandardSelect
              fieldName="Handle Conflict"
              selected={conflict}
              onSelect={setConflict}
              options={['Discuss Immediately', 'Take A Break', 'Give Space, Revisit Later', 'Avoid Conflict', 'Let it Pass', 'Other']}
            />
            <StandardSelect
              fieldName="Apology"
              selected={apology}
              onSelect={setApology}
              options={['Immediate & Direct', 'Reflect, then Apologize', 'Need Encouragement', 'Need Encouragement', 'Rarely Apologize', 'Prefer Showing Action', 'Other']}
            />
            <StandardSelect
            fieldName="Stress Management"
            selected={stress}
            onSelect={setStress}
            options={['Talk it Out', 'Internalize', 'Need Alone Time', 'Need Encouragement', 'Active Outlet', 'Distraction', 'Other']}
            />
            <StandardSelect
            fieldName="Emotional Expression"
            selected={emotion}
            onSelect={setEmotion}
            options={['Very Expressive', 'Moderately Expressive', 'Selective Expressive', 'Rarely Expressive', 'Prefer Non-verbal Expression' , 'Other']}
            />
            <StaandardMultiSelect
  fieldName="Anger Trigger"
  selected={anger}
  onSelect={setAnger}
  options={[
    'Feeling Ignored',
    'Being Disrespected',
    'Lack of Trust',
    'Lack of Emotional Support',
    'Not Much Bothers Me',
    'Other'
  ]}
  min={1}
  max={3}
/>
          </View>
          
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

export default CoreScreen;
