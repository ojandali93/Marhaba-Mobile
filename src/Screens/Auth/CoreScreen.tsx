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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StandardSelect from '../../Components/Select/StandardSelect';

const screenHeight = Dimensions.get('window').height;

const CoreScreen = () => {
  const navigation = useNavigation();

  const [family, setFamily] = useState<string>('');
  const [faith, setFaith] = useState<string>('');
  const [ambition, setAmbition] = useState<string>('');
  const [careerVsFamily, setCareerVsFamily] = useState<string>('');
  const [conflicts, setConflicts] = useState<string>('');
  const [independence, setIndependence] = useState<string>('');
  const [decisions, setDecisions] = useState<string>('');
  const [politics, setPolitics] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedFamily = await AsyncStorage.getItem('CR_Family');
    const storedFaith = await AsyncStorage.getItem('CR_Faith');
    const storedAmbition = await AsyncStorage.getItem('CR_Ambition');
    const storedCareerVsFamily = await AsyncStorage.getItem(
      'CR_CareerVsFamily',
    );
    const storedConflicts = await AsyncStorage.getItem('CR_Conflicts');
    const storedIndependence = await AsyncStorage.getItem('CR_Independence');
    const storedDecisions = await AsyncStorage.getItem('CR_Decisions');
    const storedPolitics = await AsyncStorage.getItem('CR_Politics');

    if (storedFamily) {
      setFamily(storedFamily);
    }
    if (storedFaith) {
      setFaith(storedFaith);
    }
    if (storedAmbition) {
      setAmbition(storedAmbition);
    }
    if (storedCareerVsFamily) {
      setCareerVsFamily(storedCareerVsFamily);
    }
    if (storedConflicts) {
      setConflicts(storedConflicts);
    }
    if (storedIndependence) {
      setIndependence(storedIndependence);
    }
    if (storedDecisions) {
      setDecisions(storedDecisions);
    }
    if (storedPolitics) {
      setPolitics(storedPolitics);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (
      family !== '' &&
      faith !== '' &&
      ambition !== '' &&
      careerVsFamily !== '' &&
      conflicts !== '' &&
      decisions !== ''
    ) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('CR_Family', family);
    await AsyncStorage.setItem('CR_Faith', faith);
    await AsyncStorage.setItem('CR_Ambition', ambition);
    await AsyncStorage.setItem('CR_CareerVsFamily', careerVsFamily);
    await AsyncStorage.setItem('CR_Conflicts', conflicts);
    await AsyncStorage.setItem('CR_Independence', independence);
    await AsyncStorage.setItem('CR_Decisions', decisions);
    await AsyncStorage.setItem('CR_Politics', politics);
    navigation.navigate('IdentityThird');
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
              Core Values
            </Text>
          </View>
        </View>
        <View style={tailwind`w-full flex flex-row items-center`}>
          <></>
        </View>
        <ScrollView style={tailwind`w-full flex-1`}>
          <View style={tailwind`w-full pr-1`}>
            <StandardSelect
              fieldName="Building a Family"
              selected={family}
              onSelect={setFamily}
              options={['Essential', 'Important', 'Neutral', 'Not Important']}
              label="Building a Family"
            />
            <StandardSelect
              fieldName="Shared Faith"
              selected={faith}
              onSelect={setFaith}
              options={[
                'Essential',
                'Important',
                'Flexible',
                'Not Important',
                'Opposing Views',
              ]}
              label="Shared Faith"
            />
            <StandardSelect
              fieldName="Personal Ambition"
              selected={ambition}
              onSelect={setAmbition}
              options={[
                'Highly Ambitious',
                'Moderately Ambitious',
                'Low Ambition',
                'Not A Priority',
                'Still Exploring',
              ]}
              label="Personal Ambition"
            />
            <StandardSelect
              fieldName="Career vs Family"
              selected={careerVsFamily}
              onSelect={setCareerVsFamily}
              options={[
                'Career First',
                'Family First',
                'Balanced',
                'Flexible',
                'Career Options',
              ]}
              label="Career vs Family"
            />
            <StandardSelect
              fieldName="Conflicts"
              selected={conflicts}
              onSelect={setConflicts}
              options={[
                'Calm decisions',
                'Tackle head on',
                'Need space',
                'Emotional expression',
                'Avoid conflict',
              ]}
              label="Conflict Style"
            />
            <StandardSelect
              fieldName="Decisions"
              selected={decisions}
              onSelect={setDecisions}
              options={[
                'Lead the decision',
                'collaborate equally',
                'Let them decide',
                'No preference',
              ]}
              label="Decision Making"
            />
            <StandardSelect
              fieldName="Independence"
              selected={independence}
              onSelect={setIndependence}
              options={[
                'Need space',
                'Need to be close',
                'Flexible',
                'No preference',
              ]}
              label="Independence (Relationship)"
              optional
            />
            <StandardSelect
              fieldName="Political Views"
              selected={politics}
              onSelect={setPolitics}
              options={[
                'Aligned with my views',
                'Open to other views',
                'No preference',
              ]}
              label="Political Views"
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

export default CoreScreen;
