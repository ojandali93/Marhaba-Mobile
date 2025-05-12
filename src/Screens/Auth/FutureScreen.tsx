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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StandardSelect from '../../Components/Select/StandardSelect';
import AithInputStandard from '../../Components/Inputs/AithInputStandard';

const screenHeight = Dimensions.get('window').height;

const FutureScreen = () => {
  const navigation = useNavigation();

  const [career, setCareer] = useState<string>('');
  const [finances, setFinances] = useState<string>('');
  const [pace, setPace] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [fiveYears, setFiveYears] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedCareer = await AsyncStorage.getItem('FTR_Career');
    const storedFinances = await AsyncStorage.getItem('FTR_Finances');
    const storedPace = await AsyncStorage.getItem('FTR_Pace');
    const storedLocation = await AsyncStorage.getItem('FTR_Location');
    const storedFiveYears = await AsyncStorage.getItem('FTR_FiveYears');

    if (storedCareer) {
      setCareer(storedCareer);
    }
    if (storedFinances) {
      setFinances(storedFinances);
    }
    if (storedPace) {
      setPace(storedPace);
    }
    if (storedLocation) {
      setLocation(storedLocation);
    }
    if (storedFiveYears) {
      setFiveYears(storedFiveYears);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (career !== '' && finances !== '') {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('FTR_Career', career);
    await AsyncStorage.setItem('FTR_Finances', finances);
    await AsyncStorage.setItem('FTR_Pace', pace);
    await AsyncStorage.setItem('FTR_Location', location);
    await AsyncStorage.setItem('FTR_FiveYears', fiveYears);
    navigation.navigate('Personality');
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
              The Future
            </Text>
          </View>
        </View>
        <View style={tailwind`w-full flex flex-row items-center`}>
          <></>
        </View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <View style={tailwind`w-full pr-1`}>
            <StandardSelect
              label="Career Ambition"
              fieldName="Career Ambition"
              selected={career}
              onSelect={setCareer}
              options={[
                'Very Ambitious',
                'Balanced',
                'Flexible',
                'Simple Lifestyle',
                'Other',
              ]}
            />
            <StandardSelect
              label="Financial Ambition"
              fieldName="Financial Ambition"
              selected={finances}
              onSelect={setFinances}
              options={[
                'Very Ambitious',
                'Balanced',
                'Flexible',
                'Simple Lifestyle',
                'Other',
              ]}
            />
            <StandardSelect
              label="Pace of Life"
              fieldName="Pace of Life"
              selected={pace}
              onSelect={setPace}
              options={['Fast', 'Moderate', 'Slow', 'Flexible', 'Other']}
              optional
            />
            <StandardSelect
              label="Long Term Living"
              fieldName="Long Term Living"
              selected={location}
              onSelect={setLocation}
              options={[
                'Stay near family',
                'Open to relocating',
                'Desire to move abroad',
                'No strong preference',
                'Other',
              ]}
              optional
            />
            <AithInputStandard
              fieldName="Education"
              value={fiveYears}
              changeText={setFiveYears}
              valid={true}
              label="5 Year Plan"
              multiline
              optional
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

export default FutureScreen;
