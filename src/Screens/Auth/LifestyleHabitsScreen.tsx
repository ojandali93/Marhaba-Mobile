import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
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

const LifestyleHabitsScreen = () => {
  const navigation = useNavigation();

  const [smoking, setSmoking] = useState<string>('');
  const [drinking, setDrinking] = useState<string>('');
  const [hasKids, setHasKids] = useState<string>('');
  const [wantsKids, setWantsKids] = useState<string>('');
  const [sleep, setSleep] = useState<string>('');
  const [exercise, setExercise] = useState<string>('');
  const [diet, setDiet] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedSmoking = await AsyncStorage.getItem('LFH_Smoking');
    const storedDrinking = await AsyncStorage.getItem('LFH_Drinking');
    const storedHasKids = await AsyncStorage.getItem('LFH_HasKids');
    const storedWantsKids = await AsyncStorage.getItem('LFH_WantsKids');
    const storedSleep = await AsyncStorage.getItem('LFH_Sleep');
    const storedExercise = await AsyncStorage.getItem('LFH_Exercise');
    const storedDiet = await AsyncStorage.getItem('LFH_Diet');
    if (storedSmoking) {
      setSmoking(storedSmoking);
    }
    if (storedDrinking) {
      setDrinking(storedDrinking);
    }
    if (storedHasKids) {
      setHasKids(storedHasKids);
    }
    if (storedWantsKids) {
      setWantsKids(storedWantsKids);
    }
    if (storedSleep) {
      setSleep(storedSleep);
    }
    if (storedExercise) {
      setExercise(storedExercise);
    }
    if (storedDiet) {
      setDiet(storedDiet);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (
      smoking !== '' &&
      drinking !== '' &&
      hasKids !== '' &&
      wantsKids !== ''
    ) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out missing information');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('LFH_Smoking', smoking);
    await AsyncStorage.setItem('LFH_Drinking', drinking);
    await AsyncStorage.setItem('LFH_HasKids', hasKids);
    await AsyncStorage.setItem('LFH_WantsKids', wantsKids);
    await AsyncStorage.setItem('LFH_Sleep', sleep);
    await AsyncStorage.setItem('LFH_Exercise', exercise);
    await AsyncStorage.setItem('LFH_Diet', diet);
    navigation.navigate('Accept');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          <View
            style={tailwind`mt-2 flex flex-row justify-between items-center`}>
            <Text
              style={[
                tailwind`mt-2 text-3xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              Lifestyle Habits
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Accept')}
              style={[
                tailwind`mt-2 text-lg font-semibold`,
                {color: themeColors.primary},
              ]}>
              <Text style={tailwind`text-base font-semibold text-red-500`}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={tailwind`w-full flex justify-center`}></View>
        <ScrollView
          style={tailwind`w-full flex-1`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <StandardSelect
            fieldName="Smoking"
            selected={smoking}
            onSelect={setSmoking}
            options={['Yes', 'No', 'Sometimes']}
            label="Smoking"
          />
          <StandardSelect
            fieldName="Drinking"
            selected={drinking}
            onSelect={setDrinking}
            options={['Yes', 'No', 'Sometimes']}
            label="Drinking"
          />
          <StandardSelect
            fieldName="Has Kids"
            selected={hasKids}
            onSelect={setHasKids}
            options={['Yes', 'No']}
            label="Has Kids"
          />
          <StandardSelect
            fieldName="Wants Kids"
            selected={wantsKids}
            onSelect={setWantsKids}
            options={['Yes', 'No', 'In the future']}
            label="Wants Kids"
          />
          <StandardSelect
            fieldName="Sleep"
            selected={sleep}
            onSelect={setSleep}
            options={['Early Bird', 'Night Owl', 'Flexible']}
            label="Sleep"
            optional
          />
          <StandardSelect
            fieldName="Exercise"
            selected={exercise}
            onSelect={setExercise}
            options={['Daily', 'Often', 'Sometimes', 'Rarely', 'Never']}
            label="Exercise"
            optional
          />
          <StandardSelect
            fieldName="Diet"
            selected={diet}
            onSelect={setDiet}
            options={[
              'Halal',
              'Vegan',
              'Vegetarian',
              'Pescetarian',
              'Omnivore',
              'Other',
            ]}
            label="Diet"
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
    </KeyboardAvoidingView>
  );
};

export default LifestyleHabitsScreen;
