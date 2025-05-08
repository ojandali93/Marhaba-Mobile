import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Switch,
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
import {ChevronsDown, ChevronsUp} from 'react-native-feather';

const screenHeight = Dimensions.get('window').height;

const AcceptScreen = () => {
  const navigation = useNavigation();

  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [acceptEULA, setAcceptEULA] = useState<boolean>(false);
  const [expandedTab, setExpandedTab] = useState<string>('');

  const handleTriggerUpdateTab = (tab: string) => {
    if (expandedTab === tab) {
      setExpandedTab('');
    } else {
      setExpandedTab(tab);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (acceptEULA && acceptedTerms) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please accept the terms and conditions');
    }
  };

  const storeNextScreen = async () => {
    navigation.navigate('CreatingProfile');
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
              Legal Acceptance
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
          <TouchableOpacity
            onPress={() => handleTriggerUpdateTab('terms')}
            style={[
              tailwind`w-full flex flex-row justify-between items-center mb-3 mt-2 p-3 rounded-2`,
              {backgroundColor: themeColors.darkSecondary},
            ]}>
            <Text
              style={[
                tailwind`text-2xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              Terms of Service
            </Text>
          </TouchableOpacity>
          <View style={tailwind`px-2 pb-4`}>
            <Text style={tailwind`text-base text-gray-700`}>
              Marhabah's Terms of Service describe your rights,
              responsibilities, and the rules for using the app. You can view
              the full Terms of Service below.
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'https://app.termly.io/policy-viewer/policy.html?policyUUID=6c415447-ebe1-4647-9104-e89d1c3879c8',
                )
              }
              style={tailwind`mt-2 w-full flex flex-row justify-center`}>
              <Text
                style={[
                  tailwind`text-base font-bold`,
                  {color: themeColors.primary},
                ]}>
                View Terms of Service
              </Text>
            </TouchableOpacity>
            <View
              style={[
                tailwind`mt-4 flex-row justify-between items-center p-3 rounded-lg`,
                {backgroundColor: themeColors.darkSecondary},
              ]}>
              <Text style={tailwind`text-lg text-gray-800 font-semibold`}>
                Accept Terms
              </Text>
              <Switch
                value={acceptedTerms}
                onValueChange={value => setAcceptedTerms(!acceptedTerms)}
                thumbColor={acceptedTerms ? themeColors.primary : '#ccc'}
                trackColor={{false: '#aaa', true: themeColors.primary}}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleTriggerUpdateTab('eula')}
            style={[
              tailwind`w-full flex flex-row justify-between items-center mb-3 mt-2 p-3 rounded-2`,
              {backgroundColor: themeColors.darkSecondary},
            ]}>
            <Text
              style={[
                tailwind`text-2xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              EULA
            </Text>
          </TouchableOpacity>
          <View style={tailwind`px-2 pb-4`}>
            <Text style={tailwind`text-base text-gray-700`}>
              Marhabah is licensed to you under the End User License Agreement.
              This governs your use of the app, your contributions, and limits
              liability. You can review the full EULA below.
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'https://app.termly.io/policy-viewer/policy.html?policyUUID=2c96703e-b201-4b10-8414-c9a70374f352',
                )
              }
              style={tailwind`mt-2 w-full flex flex-row justify-center`}>
              <Text
                style={[
                  tailwind`text-base font-bold`,
                  {color: themeColors.primary},
                ]}>
                View EULA
              </Text>
            </TouchableOpacity>
            <View
              style={[
                tailwind`mt-4 flex-row justify-between items-center p-3 rounded-lg`,
                {backgroundColor: themeColors.darkSecondary},
              ]}>
              <Text style={tailwind`text-lg text-gray-800 font-semibold`}>
                Accept EULA
              </Text>
              <Switch
                value={acceptEULA}
                onValueChange={value => setAcceptEULA(!acceptEULA)}
                thumbColor={acceptEULA ? themeColors.primary : '#ccc'}
                trackColor={{false: '#aaa', true: themeColors.primary}}
              />
            </View>
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

export default AcceptScreen;
