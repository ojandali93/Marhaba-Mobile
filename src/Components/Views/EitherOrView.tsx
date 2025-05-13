// EitherOrEditView.js
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

  const [friday, setFriday] = useState(profile?.Survey[0].friday || '');
  const [energy, setEnergy] = useState(profile?.Survey[0].energy || '');
  const [planning, setPlanning] = useState(profile?.Survey[0].planning || '');
  const [morningEnergy, setMorningEnergy] = useState(
    profile?.Survey[0].morningEnergy || '',
  );
  const [social, setSocial] = useState(profile?.Survey[0].social || '');
  const [verted, setVerted] = useState(profile?.Survey[0].verted || '');
  const [pineapple, setPineapple] = useState(
    profile?.Survey[0].pineapple || '',
  );
  const [giveUp, setGiveUp] = useState(profile?.Survey[0].giveUp || '');
  const [communication, setCommunication] = useState(
    profile?.Survey[0].communication || '',
  );
  const [firstSight, setFirstSight] = useState(
    profile?.Survey[0].firstSight || '',
  );
  const [morning, setMorning] = useState(profile?.Survey[0].morning || '');
  const [travel, setTravel] = useState(profile?.Survey[0].travel || '');
  const [spicy, setSpicy] = useState(profile?.Survey[0].spicy || '');
  const [decision, setDecision] = useState(profile?.Survey[0].decision || '');
  const [arrive, setArrive] = useState(profile?.Survey[0].arrive || '');
  const [partner, setPartner] = useState(profile?.Survey[0].partner || '');
  const [move, setMove] = useState(profile?.Survey[0].move || '');
  const [opposite, setOpposite] = useState(profile?.Survey[0].opposite || '');
  const [ghost, setGhost] = useState(profile?.Survey[0].ghost || '');
  const [longDistance, setLongDistance] = useState(
    profile?.Survey[0].longDistance || '',
  );

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

  useFocusEffect(
    useCallback(() => {
      const eo = profile?.Survey[0] || {};
      originalAnswers.current = eo;
      Object.values(questionStateMap).forEach(([_, setFunc, key]) => {
        setFunc(eo[key] || '');
      });
    }, []),
  );

  const countAnswered = () => {
    return Object.values(questionStateMap).filter(
      ([val]) => val && val.trim() !== '',
    ).length;
  };

  const trackChange = (key, newValue) => {
    if (originalAnswers.current[key] !== newValue) {
      setChangeDetected(true);
    }
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
          userId: userProfile?.data?.userId,
          eitherOr: questions,
        },
      );
      if (response.data.success) {
        setChangeDetected(false);
        grabUserProfile(profile?.userId);
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
          <Text style={tailwind`text-base font-semibold text-white`}>
            Either / Or
          </Text>
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
            tailwind`mt-4 px-2 py-4 rounded-3`,
            {
              marginTop: screenHeight * 0.02,
              backgroundColor: themeColors.darkSecondary,
            },
          ]}>
          {eitherOrQuestions.map((q, index) => {
            const [value, setFunc, key] = questionStateMap[q.question];
            return (
              <View key={index} style={tailwind`mb-4`}>
                <Text style={tailwind`text-lg font-semibold mb-2`}>
                  {q.question}
                </Text>
                <View style={tailwind`flex-row justify-between`}>
                  {q.options.map(option => {
                    const isSelected = option === value;
                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => updateValue(value, option, setFunc, key)}
                        style={[
                          tailwind`flex-1 mx-1 py-2 rounded-md items-center border`,
                          isSelected
                            ? tailwind`bg-[#008080] border-[#008080]`
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
      )}
    </View>
  );
};

export default EitherOrEditView;
