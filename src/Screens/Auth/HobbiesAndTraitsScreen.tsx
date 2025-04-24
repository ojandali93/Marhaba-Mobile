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
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {traitsAndHobbies} from '../../Utils/SelectOptions';

const screenHeight = Dimensions.get('window').height;

const HobbiesAndTraitsScreen = () => {
  const navigation = useNavigation();

  const [traits, setTraits] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedName = await AsyncStorage.getItem('traits');

    if (storedName) {
      setTraits(storedName.split(','));
    }
  };

  const toggleTrait = (trait: string) => {
    setTraits(prev => {
      if (prev.includes(trait)) {
        return prev.filter(t => t !== trait);
      } else if (prev.length < 8) {
        return [...prev, trait];
      } else {
        Alert.alert('Limit Reached', 'You can select up to 8 traits only.');
        return prev;
      }
    });
  };

  const redirectToPersonalityScreen = () => {
    if (traits.length >= 3) {
      storeNextScreen();
    } else {
      Alert.alert('Requirements', 'There is missing into');
    }
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('traits', traits.join(','));
    navigation.navigate('Questions');
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-3/4 flex`}>
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
              Hobbies & Traits
            </Text>
          </View>
        </View>
        <View style={{marginTop: screenHeight * 0.05}}>
          <View
            style={tailwind`w-full flex flex-row items-center justify-between`}>
            <Text style={tailwind`text-base mt-1`}>
              Select between 3 - 8 traits
            </Text>
            <Text style={tailwind`text-sm mt-1 text-gray-600`}>
              Selected: {traits.length} / 8
            </Text>
          </View>
          <ScrollView
            style={tailwind`h-7/12 mt-4`}
            showsVerticalScrollIndicator={false}>
            <View style={tailwind`flex-row flex-wrap justify-between`}>
              {traitsAndHobbies.map((trait, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleTrait(trait)}
                  style={[
                    tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                    {
                      backgroundColor: traits.includes(trait)
                        ? themeColors.primary
                        : themeColors.secondary,
                      borderColor: themeColors.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-center text-base`,
                      {
                        color: traits.includes(trait) ? 'white' : 'black',
                      },
                    ]}>
                    {trait}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
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

export default HobbiesAndTraitsScreen;
