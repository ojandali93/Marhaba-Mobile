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
  const [honesty, setHonesty] = useState<string>('');
  const [transparency, setTransparency] = useState<string>('');
  const [trust, setTrust] = useState<string>('');
  const [politics, setPolitics] = useState<string>('');
  const [social, setSocial] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedFamily = await AsyncStorage.getItem('coreFamily');
    const storedFaith = await AsyncStorage.getItem('coreFaith');
    const storedAmbition = await AsyncStorage.getItem('coreAmbition');
    const storedCareerVsFamily = await AsyncStorage.getItem(
      'coreCareerVsFamily',
    );
    const storedHonesty = await AsyncStorage.getItem('coreHonesty');
    const storedTransparency = await AsyncStorage.getItem('coreTransparency');
    const storedTrust = await AsyncStorage.getItem('coreTrust');
    const storedPolitics = await AsyncStorage.getItem('corePolitics');
    const storedSocial = await AsyncStorage.getItem('coreSocial');

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
    if (storedHonesty) {
      setHonesty(storedHonesty);
    }
    if (storedTransparency) {
      setTransparency(storedTransparency);
    }
    if (storedTrust) {
      setTrust(storedTrust);
    }
    if (storedPolitics) {
      setPolitics(storedPolitics);
    }
    if (storedSocial) {
      setSocial(storedSocial);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (
      family != '' &&
      faith != '' &&
      ambition != '' &&
      careerVsFamily != '' &&
      honesty != '' &&
      transparency != '' &&
      trust != '' &&
      politics != '' &&
      social != ''
    ) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('coreFamily', family);
    await AsyncStorage.setItem('coreFaith', faith);
    await AsyncStorage.setItem('coreAmbition', ambition);
    await AsyncStorage.setItem('coreCareerVsFamily', careerVsFamily);
    await AsyncStorage.setItem('coreHonesty', honesty);
    await AsyncStorage.setItem('coreTransparency', transparency);
    await AsyncStorage.setItem('coreTrust', trust);
    await AsyncStorage.setItem('corePolitics', politics);
    await AsyncStorage.setItem('coreSocial', social);
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
              Core Values
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
              fieldName="Building a Family"
              selected={family}
              onSelect={setFamily}
              options={['Essential', 'Important', 'Neutral', 'Not Important']}
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
            />
            <StandardSelect
              fieldName="Honesty"
              selected={honesty}
              onSelect={setHonesty}
              options={[
                'Non-negotiable',
                'Very Important',
                'Important',
                'Flexible',
                'Depends on Situation',
              ]}
            />
            <StandardSelect
              fieldName="Transparency"
              selected={transparency}
              onSelect={setTransparency}
              options={[
                'Non-negotiable',
                'Very Important',
                'Important',
                'Flexible',
                'Depends on Situation',
              ]}
            />
            <StandardSelect
              fieldName="Trust"
              selected={trust}
              onSelect={setTrust}
              options={[
                'Non-negotiable',
                'Very Important',
                'Important',
                'Flexible',
                'Depends on Situation',
              ]}
            />
            <StandardSelect
              fieldName="Political Views"
              selected={politics}
              onSelect={setPolitics}
              options={[
                'Essential',
                'Important',
                'Flexible',
                'Not Important',
                'Opposing Views',
              ]}
            />
            <StandardSelect
              fieldName="Social"
              selected={social}
              onSelect={setSocial}
              options={[
                'Very Important',
                'Somewhat Important',
                'Important',
                'Not Important',
              ]}
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
