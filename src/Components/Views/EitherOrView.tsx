import React, {useCallback, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import axios from 'axios';
import {ChevronsDown, ChevronsUp} from 'react-native-feather';
import {eitherOrQuestions} from '../../Utils/SelectOptions';
import {useProfile} from '../../Context/ProfileContext';

const screenHeight = Dimensions.get('window').height;

const EitherOrEditView = () => {
  const {profile, grabUserProfile} = useProfile();
  const [expanded, setExpanded] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const [friday, setFriday] = useState('');
  const [energy, setEnergy] = useState('');
  const [planning, setPlanning] = useState('');
  const [morningEnergy, setMorningEnergy] = useState('');
  const [social, setSocial] = useState('');
  const [verted, setVerted] = useState('');
  const [pineapple, setPineapple] = useState('');
  const [giveUp, setGiveUp] = useState('');
  const [communication, setCommunication] = useState('');
  const [firstSight, setFirstSight] = useState('');
  const [morning, setMorning] = useState('');
  const [travel, setTravel] = useState('');
  const [spicy, setSpicy] = useState('');
  const [decision, setDecision] = useState('');
  const [arrive, setArrive] = useState('');
  const [partner, setPartner] = useState('');
  const [move, setMove] = useState('');
  const [opposite, setOpposite] = useState('');
  const [ghost, setGhost] = useState('');
  const [longDistance, setLongDistance] = useState('');

  const originalAnswers = useRef({});

  const questionStateMap = {
    'On a Friday night, I’d rather...': [friday, setFriday, 'friday'],
    'My energy level is usually...': [energy, setEnergy, 'energy'],
    'I prefer to plan...': [planning, setPlanning, 'planning'],
    'I’m more of a...': [morningEnergy, setMorningEnergy, 'morningEnergy'],
    'In social situations, I...': [social, setSocial, 'social'],
    'I’m more...': [verted, setVerted, 'verted'],
    'Pineapple on pizza?': [pineapple, setPineapple, 'pineapple'],
    'I’d rather give up...': [giveUp, setGiveUp, 'giveUp'],
    'Texting vs Calling': [communication, setCommunication, 'communication'],
    'Do you believe in love at first sight?': [
      firstSight,
      setFirstSight,
      'firstSight',
    ],
    'In the morning, I...': [morning, setMorning, 'morning'],
    'When traveling, I prefer...': [travel, setTravel, 'travel'],
    'I like my food...': [spicy, setSpicy, 'spicy'],
    'When making decisions...': [decision, setDecision, 'decisions'],
    'I usually arrive...': [arrive, setArrive, 'arrive'],
    'I value more in a partner...': [partner, setPartner, 'partner'],
    'Would you move for love?': [move, setMove, 'move'],
    'Do opposites attract?': [opposite, setOpposite, 'opposites'],
    'Is it okay to ghost someone?': [ghost, setGhost, 'ghost'],
    'Long-distance relationships can work?': [
      longDistance,
      setLongDistance,
      'longDistance',
    ],
  };

  const loadProfile = () => {
    const eo = profile?.Survey?.[0] || {};
    originalAnswers.current = eo;

    Object.values(questionStateMap).forEach(([_, setFunc, key]) => {
      setFunc(eo[key] || '');
    });

    const answered = Object.keys(eo).filter(key => eo[key] && eo[key] !== '');
    setIsEmpty(answered.length < 6); // show yellow dot if < 6 answered
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [profile?.Survey]),
  );

  const countAnswered = () => {
    return Object.values(questionStateMap).filter(
      ([val]) => val && val.trim() !== '',
    ).length;
  };

  const updateValue = (currentValue, newValue, setFunc, key) => {
    if (newValue !== currentValue) {
      setFunc(newValue);
      if (originalAnswers.current[key] !== newValue) {
        setChangeDetected(true);
      }
    }
  };

  const handleUpdate = async () => {
    if (!changeDetected || countAnswered() < 6) return;

    const questions = Object.fromEntries(
      Object.values(questionStateMap).map(([value, , key]) => [key, value]),
    );

    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/account/updateSurvey',
        {
          userId: profile?.userId,
          eitherOr: questions,
        },
      );
      if (response.data.success) {
        setChangeDetected(false);
        await grabUserProfile(profile?.userId);
        loadProfile(); // ✅ Re-evaluate for yellow dot after update
        setExpanded(false);
      }
    } catch (err) {
      console.error('Failed to update either/or answers:', err);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={tailwind`w-full flex flex-col mt-2`}
        onPress={() => setExpanded(!expanded)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkGrey},
          ]}>
          <View style={tailwind`flex flex-row items-center`}>
            <Text style={tailwind`text-base font-semibold text-white`}>
              Either / Or
            </Text>
            {isEmpty && (
              <View
                style={tailwind`w-2 h-2 rounded-full bg-yellow-400 mr-2 ml-3`}
              />
            )}
          </View>
          {expanded ? (
            changeDetected && countAnswered() >= 6 ? (
              <TouchableOpacity onPress={handleUpdate}>
                <Text
                  style={[
                    tailwind`text-base font-bold px-2 py-1 rounded-md text-white`,
                    {backgroundColor: themeColors.primary},
                  ]}>
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <ChevronsUp height={24} width={24} color={themeColors.primary} />
            )
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <ScrollView
          style={[
            tailwind`mt-4 px-2 py-4 rounded-3 h-92`,
            {
              backgroundColor: themeColors.secondary,
            },
          ]}>
          {eitherOrQuestions.map((q, index) => {
            const [value, setFunc, key] = questionStateMap[q.question];
            const isSelected = option => option === value;
            return (
              <View key={index} style={tailwind`mb-4`}>
                <Text style={tailwind`text-lg font-semibold mb-2`}>
                  {q.question}
                </Text>
                <View style={tailwind`flex-row justify-between`}>
                  {q.options.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => updateValue(value, option, setFunc, key)}
                      style={[
                        tailwind`flex-1 mx-1 py-2 rounded-md items-center border`,
                        isSelected(option)
                          ? tailwind`bg-[#008080] border-[#008080]`
                          : tailwind`border-gray-400`,
                      ]}>
                      <Text
                        style={[
                          tailwind`text-base font-semibold`,
                          isSelected(option)
                            ? tailwind`text-white`
                            : tailwind`text-black`,
                        ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default EitherOrEditView;
