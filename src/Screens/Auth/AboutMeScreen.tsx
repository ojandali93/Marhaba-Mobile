import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {track} from '@amplitude/analytics-react-native';
import {ChevronsLeft} from 'react-native-feather';
import ContinueButton from '../../Components/Buttons/ContinueButton';
import StandardInputBordered from '../../Components/Inputs/StandardInputBordered';

const screenHeight = Dimensions.get('window').height;

const T1Prompts = () => {
  const navigation = useNavigation();

  const [whoAmI, setWhoAmI] = useState<string>('');
  const [whatMakesMe, setWhatMakesMe] = useState<string>('');
  const [showIntroModal, setShowIntroModal] = useState(true);

  useFocusEffect(
    useCallback(() => {
      track('T1 Prompts Started');
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedWhoAmI = await AsyncStorage.getItem('T0_WhoAmI');
    const storedWhatMakesMe = await AsyncStorage.getItem('T0_WhatMakesMe');
    if (storedWhoAmI) setWhoAmI(storedWhoAmI);
    if (storedWhatMakesMe) setWhatMakesMe(storedWhatMakesMe);
  };

  const redirectToPersonalityScreen = () => {
    const hasAtLeastOne = whoAmI !== '' || whatMakesMe !== '';
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
    await AsyncStorage.setItem('T0_WhoAmI', whoAmI);
    await AsyncStorage.setItem('T0_WhatMakesMe', whatMakesMe);
    track('T0 Prompts Completed');
    navigation.navigate('T1Prompts');
  };

  const AboutMeIntroModal = () => (
    <Modal transparent visible={showIntroModal} animationType="fade">
      <View
        style={tailwind`flex-1 bg-black bg-opacity-70 justify-center items-center px-5`}>
        <View style={tailwind`bg-white rounded-xl p-6 w-full`}>
          <Text style={tailwind`text-lg font-bold mb-2 text-center`}>
            Let’s Get to Know You
          </Text>
          <Text style={tailwind`text-sm text-gray-700 text-center mb-2`}>
            These questions are meant to help you express yourself and show your
            personality.
          </Text>
          <Text style={tailwind`text-sm text-gray-700 text-center mb-2`}>
            The answers you provide here will help others understand who you
            truly are and find meaningful connections.
          </Text>
          <Text style={tailwind`text-sm text-gray-700 text-center mb-4`}>
            Be honest, thoughtful, and take your time. Compatibility begins with
            authenticity.
          </Text>
          <TouchableOpacity
            onPress={() => setShowIntroModal(false)}
            style={tailwind`bg-[${themeColors.primary}] px-6 py-2 rounded-full self-center`}>
            <Text style={tailwind`text-white font-semibold text-base`}>
              Got it
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      {showIntroModal && <AboutMeIntroModal />}

      <View style={tailwind`w-full flex-1 flex mb-24`}>
        <View style={[tailwind`flex`, {marginTop: screenHeight * 0.07}]}>
          <View style={tailwind`mt-2 px-3`}>
            <View style={tailwind`w-full flex flex-row items-center`}>
              <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <View>
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
                Who am I?
              </Text>
            </View>
            <Text style={tailwind`text-sm mt-1`}>
              Answer as many prompts as you'd like. (1 required)
            </Text>
          </View>
        </View>

        <ScrollView style={tailwind`w-full flex-1 px-3 mt-2`}>
          <StandardInputBordered
            value={whoAmI}
            changeValue={text => setWhoAmI(text)}
            fieldName={'Who am I?'}
            longContent
            placeholder={'Enter your answer...'}
          />
          <StandardInputBordered
            value={whatMakesMe}
            changeValue={text => setWhatMakesMe(text)}
            fieldName={'What makes me, me?'}
            longContent
            placeholder={'Enter your answer...'}
          />
        </ScrollView>
      </View>

      <View
        style={tailwind`w-full absolute bottom-0 flex flex-row justify-between px-5 mb-12`}>
        <TouchableWithoutFeedback onPress={() => navigation.popToTop()}>
          <View>
            <Text style={tailwind`text-base font-bold text-red-400`}>
              Cancel
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <ContinueButton
          text={'Light & Relatable'}
          click={redirectToPersonalityScreen}
        />
      </View>
    </View>
  );
};

export default T1Prompts;
