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
import {eitherOrQuestions} from '../../Utils/SelectOptions';

const screenHeight = Dimensions.get('window').height;

const QuestionsScreen = () => {
  const navigation = useNavigation();

  const [friday, setFriday] = useState<string>('');
  const [energy, setEnergy] = useState<string>('');
  const [planning, setPlanning] = useState<string>('');
  const [morningEnergy, setMorningEnergy] = useState<string>('');
  const [social, setSocial] = useState<string>('');
  const [verted, setVerted] = useState<string>('');
  const [pineapple, setPineapple] = useState<string>('');
  const [giveUP, setGiveUp] = useState<string>('');
  const [communication, setCommunication] = useState<string>('');
  const [firstSight, setFirstSight] = useState<string>('');
  const [morning, setMorning] = useState<string>('');
  const [travel, setTravel] = useState<string>('');
  const [spicy, setSpicy] = useState<string>('');
  const [decision, setDecision] = useState<string>('');
  const [arrive, setArrive] = useState<string>('');
  const [partner, setPartner] = useState<string>('');
  const [move, setMOve] = useState<string>('');
  const [opposite, setOpposite] = useState<string>('');
  const [ghost, setGhost] = useState<string>('');
  const [longDistance, setLongDistance] = useState<string>('');

  const questionStateMap = {
    'On a Friday night, I’d rather...': [friday, setFriday],
    'My energy level is usually...': [energy, setEnergy],
    'I prefer to plan...': [planning, setPlanning],
    'I’m more of a...': [morningEnergy, setMorningEnergy],
    'In social situations, I...': [social, setSocial],
    'I’m more...': [verted, setVerted],
    'Pineapple on pizza?': [pineapple, setPineapple],
    'I’d rather give up...': [giveUP, setGiveUp],
    'Texting vs Calling': [communication, setCommunication],
    'Do you believe in love at first sight?': [firstSight, setFirstSight],
    'In the morning, I...': [morning, setMorning],
    'When traveling, I prefer...': [travel, setTravel],
    'I like my food...': [spicy, setSpicy],
    'When making decisions...': [decision, setDecision],
    'I usually arrive...': [arrive, setArrive],
    'I value more in a partner...': [partner, setPartner],
    'Would you move for love?': [move, setMOve],
    'Do opposites attract?': [opposite, setOpposite],
    'Is it okay to ghost someone?': [ghost, setGhost],
    'Long-distance relationships can work?': [longDistance, setLongDistance],
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        for (const question in questionStateMap) {
          const key = question.toLowerCase().replace(/\W+/g, '');
          const value = await AsyncStorage.getItem(key);
          if (value) {
            questionStateMap[question][1](value);
          }
        }
      })();
    }, []),
  );

  const countAnswered = Object.values(questionStateMap).filter(
    ([value]) => value !== '',
  ).length;

  const redirectToNextScreen = () => {
    if (countAnswered >= 6) {
      storeNextScreen();
    } else {
      Alert.alert('Minimum Required', 'Please answer at least 6 questions.');
    }
  };

  const storeNextScreen = async () => {
    for (const question in questionStateMap) {
      const key = question.toLowerCase().replace(/\W+/g, '');
      const [value] = questionStateMap[question];
      await AsyncStorage.setItem(key, value);
    }
    navigation.navigate('Preferences');
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-3/4 flex`}>
        <View style={{marginTop: screenHeight * 0.1}}>
          <Text
            style={[
              tailwind`mt-2 text-3xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Either Or?
          </Text>
          <View
            style={tailwind`w-full flex flex-row items-center justify-between`}>
            <Text style={tailwind`text-sm text-gray-600 mt-1`}>
              Please answer at least 6 questions
            </Text>
            <Text style={tailwind`text-sm text-gray-600`}>
              Answered: {countAnswered}
            </Text>
          </View>
        </View>

        <ScrollView
          style={[tailwind`mt-4 h-6/12`, {marginTop: screenHeight * 0.05}]}>
          {eitherOrQuestions.map((q, index) => {
            const [selectedValue, setSelectedValue] =
              questionStateMap[q.question];
            return (
              <View key={index} style={tailwind`mb-4`}>
                <Text style={tailwind`text-lg font-semibold mb-2`}>
                  {q.question}
                </Text>
                <View style={tailwind`flex-row justify-between`}>
                  {q.options.map(option => {
                    const isSelected = selectedValue === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setSelectedValue(option)}
                        style={[
                          tailwind`flex-1 mx-1 py-2 rounded-md items-center border`,
                          isSelected
                            ? tailwind`bg-[#2e694b] border-[#2e694b]`
                            : tailwind`border-gray-400`,
                        ]}>
                        <Text
                          style={[
                            tailwind`text-base font-semibold`,
                            isSelected
                              ? tailwind`text-white`
                              : tailwind`text-black`,
                          ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={tailwind`absolute w-3/4 bottom-12`}>
        <View style={tailwind`w-full flex flex-row justify-end`}>
          <AuthMainButton text="Continue" click={redirectToNextScreen} />
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

export default QuestionsScreen;
