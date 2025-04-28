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

const AttachmentScreen = () => {
  const navigation = useNavigation();

  const [closeness, setCloseness] = useState<string>('');
  const [partnerNeed,setPartnerNeed] = useState<string>('');
  const [fear, setFear] = useState<string>('');
  const [independence, setIndependence] = useState<string>('');
  const [responseConfict, setResponseConfict] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedCloseness = await AsyncStorage.getItem('attachmentCloseness');
    const storedPartnerNeed = await AsyncStorage.getItem('attachmentPartnerNeed');
    const storedFear = await AsyncStorage.getItem('attachmentFear');
    const storedIndependence = await AsyncStorage.getItem('attachmentIndependence');
    const storedResponseConfict = await AsyncStorage.getItem('attachmentResponseConfict');

    if (storedCloseness) {
        setCloseness(storedCloseness);
    }
    if (storedPartnerNeed) {
        setPartnerNeed(storedPartnerNeed);
    }
  if (storedFear) {
    setFear(storedFear); // Load as array
  }
    if (storedIndependence) {
        setIndependence(storedIndependence);
    }
    if (storedResponseConfict) {
        setResponseConfict(storedResponseConfict);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (
      closeness != '' &&
      partnerNeed != '' &&
      fear != '' &&
      independence != '' &&
      responseConfict != ''
    ) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('attachmentCloseness', closeness);
    await AsyncStorage.setItem('attachmentPartnerNeed', partnerNeed);
    await AsyncStorage.setItem('attachmentFear', fear); // Save as JSON
    await AsyncStorage.setItem('attachmentIndependence', independence);
    await AsyncStorage.setItem('attachmentResponseConfict', responseConfict);
    navigation.navigate('Lifestyle');
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
              Attachment
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
              fieldName="Closeness in Relationships"
              selected={closeness}
              onSelect={setCloseness}
              options={['Very Close', 'Close', 'Somewhat Close', 'Unsure', 'Other']}
            />
            <StandardSelect
              fieldName="Partners Neediness"
              selected={partnerNeed}
              onSelect={setPartnerNeed}
              options={['Happy to Help', 'Willing to Reaasure', 'Prefer Some Distance', 'Get Overwhelmed', 'Other']}
            />
            <StandardSelect
            fieldName="Fear of Abandonment"
            selected={fear}
            onSelect={setFear}
            options={['Rarely or Never', 'Sometimes', 'Often', 'Flips', 'Other']}
            />
            <StandardSelect
            fieldName="Independent vs Togehter"
            selected={independence}
            onSelect={setIndependence}
            options={['Very Independent', 'Somewhat Independent', 'Balanced', 'Somewhat Together', 'Very Together', 'Other']}
            />
            <StandardSelect
            fieldName="Response to Conflict"
            selected={responseConfict}
            onSelect={setResponseConfict}
            options={['Talk Openly', 'Seek Reasurance', 'Withdrawl', 'Frozen', 'Other']}
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

export default AttachmentScreen;
