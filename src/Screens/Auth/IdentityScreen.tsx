import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import StandardText from '../../Components/Select/StandardText';
import {backgroundOptions} from '../../Utils/SelectOptions';
import StandardMultiSelect from '../../Components/Select/StandardMultiSelect';
import {track} from '@amplitude/analytics-react-native';
import ContinueButton from '../../Components/Buttons/ContinueButton';
import {ChevronsLeft} from 'react-native-feather';
const screenHeight = Dimensions.get('window').height;

const IdentityScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState<string>('');

  const [dob, setDob] = useState<Date | null>(null);

  const [gender, setGender] = useState<string>('');

  const [height, setHeight] = useState<string>('');

  const [background, setBackground] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      track('Essential Info Started');
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedName = await AsyncStorage.getItem('E_name');
    const storedDob = await AsyncStorage.getItem('E_dob');
    const storedGender = await AsyncStorage.getItem('E_gender');
    const storeHeight = await AsyncStorage.getItem('E_height');
    const storedBackground = await AsyncStorage.getItem('BG_Background');

    if (storedName) {
      setName(storedName);
    }
    if (storedDob) {
      try {
        const parsedDate = new Date(storedDob);
        if (!isNaN(parsedDate.getTime())) {
          setDob(parsedDate);
        } else {
          console.warn('❌ Invalid date string:', storedDob);
        }
      } catch (err) {
        console.error('❌ Error parsing date:', err);
      }
    }
    if (storedGender) {
      setGender(storedGender);
    }
    if (storeHeight) {
      setHeight(storeHeight);
    }
    if (storedBackground) {
      setBackground(JSON.parse(storedBackground));
    }
  };

  const backgroundSelect = (country: string) => {
    if (background.includes(country)) {
      setBackground(prev => prev.filter(c => c !== country));
    } else if (background.length < 2) {
      setBackground(prev => [...prev, country]);
    }
  };

  const redirectToPersonalityScreen = () => {
    if (
      name !== '' &&
      dob != null &&
      gender !== '' &&
      height !== '' &&
      background.length > 0
    ) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'Please fill out all of the fields');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('E_name', name);
    await AsyncStorage.setItem('E_dob', dob?.toString());
    await AsyncStorage.setItem('E_gender', gender);
    await AsyncStorage.setItem('E_height', height);
    await AsyncStorage.setItem('BG_Background', JSON.stringify(background));
    track('Essential Info Completed');
    navigation.navigate('LookingFor');
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-11/12 flex-1 flex`}>
        <View style={[tailwind`flex`, {marginTop: screenHeight * 0.07}]}>
          <View style={tailwind`mt-2`}>
            <View style={tailwind`w-full flex flex-row items-center`}>
              <TouchableWithoutFeedback
                style={tailwind`w-20 h-20`}
                onPress={() => {
                  navigation.goBack();
                }}>
                <View style={tailwind``}>
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
                Essential Info
              </Text>
            </View>
            <Text style={tailwind`text-sm mt-1`}>
              Enter your details below.
            </Text>
          </View>
        </View>
        <View style={tailwind`w-full flex flex-row items-center mt-2`}>
          <></>
        </View>
        <ScrollView style={tailwind`w-full flex-1 mb-24`}>
          <View style={tailwind`w-full`}>
            <StandardText
              fieldName="Name"
              value={name}
              changeText={setName}
              valid
              label="Name"
            />
          </View>
          <DateSelect fieldName="Date of Birth" dob={dob} setDate={setDob} />
          <StandardSelect
            fieldName="Gender"
            selected={gender}
            onSelect={setGender}
            options={['Male', 'Female']}
            label="Gender"
          />
          <StandardSelect
            fieldName="Height"
            selected={height}
            onSelect={setHeight}
            options={[
              '4\'6"',
              '4\'7"',
              '4\'8"',
              '4\'9"',
              '4\'10"',
              '4\'11"',
              '5\'0"',
              '5\'1"',
              '5\'2"',
              '5\'3"',
              '5\'4"',
              '5\'5"',
              '5\'6"',
              '5\'7"',
              '5\'8"',
              '5\'9"',
              '5\'10"',
              '5\'11"',
              '6\'0"',
              '6\'1"',
              '6\'2"',
              '6\'3"',
              '6\'4"',
              '6\'5"',
              '6\'6"',
              '6\'7"',
              '6\'8"',
            ]}
            label="Height"
          />
          <StandardMultiSelect
            fieldName="Background"
            selected={background}
            onSelect={backgroundSelect}
            options={backgroundOptions}
            label="Background"
            maxSelectable={2}
          />
          {/* <StandardSelect
            fieldName="Have Kids"
            selected={kids}
            onSelect={setKids}
            options={['Yes', 'No']}
            label="Have Kids"
          />
          <StandardSelect
            fieldName="Smoke"
            selected={smoke}
            onSelect={setSmoke}
            options={['Yes', 'No']}
            label="Smoke"
            optional
          />
          <StandardSelect
            fieldName="Drink"
            selected={drink}
            onSelect={setDrink}
            options={['Yes', 'No']}
            label="Drink"
            optional
          /> */}
        </ScrollView>
      </View>
      <View
        style={tailwind`w-full absolute bottom-0 flex flex-row justify-between px-5 mb-12 pt-4`}>
        <View style={tailwind`flex flex-row items-center`}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.popToTop();
            }}>
            <View style={tailwind``}>
              <Text style={tailwind`text-base font-bold text-red-400`}>
                Cancel
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ContinueButton
          text={'Intentions'}
          click={redirectToPersonalityScreen}
        />
      </View>
    </View>
  );
};

export default IdentityScreen;
