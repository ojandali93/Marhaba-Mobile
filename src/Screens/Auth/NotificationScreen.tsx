import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeft, ArrowRight} from 'react-native-feather';

const screenHeight = Dimensions.get('window').height;

const NotificationScreen = () => {
  const navigation = useNavigation();

  const redirectToPersonalityScreen = () => {
    navigation.navigate('');
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
              Notifications
            </Text>
            <View style={tailwind`w-full flex mt-6`}>
              <Text style={tailwind`text-xl font-semibold`}>
                Stay in the loop.
              </Text>
              <Text style={tailwind`text-xl font-semibold`}>
                Don’t miss a moment.
              </Text>
              <Text style={tailwind`text-base my-4`}>
                Turning on notifications ensures you're instantly alerted when
                someone sends you a message, likes your profile, matches with
                you, or even checks out your profile. It's the easiest way to
                stay connected and never miss a potential spark or meaningful
                connection. Let us keep you updated, so you’re always one step
                closer to meeting someone special.
              </Text>
              <View style={tailwind`ml-5`}>
                <View style={tailwind`w-full flex flex-row items-center`}>
                  <ArrowRight
                    height={20}
                    width={20}
                    color={themeColors.primary}
                  />
                  <Text style={tailwind`text-base font-semibold ml-3`}>
                    New Messages
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row items-center`}>
                  <ArrowRight
                    height={20}
                    width={20}
                    color={themeColors.primary}
                  />
                  <Text style={tailwind`text-base font-semibold ml-3`}>
                    New Likes
                  </Text>
                </View>
                <View style={tailwind`w-full flex flex-row items-center`}>
                  <ArrowRight
                    height={20}
                    width={20}
                    color={themeColors.primary}
                  />
                  <Text style={tailwind`text-base font-semibold ml-3`}>
                    New Matches
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={tailwind`absolute w-3/4 bottom-12`}>
        <View style={tailwind` w-full flex flex-row justify-end`}>
          <AuthMainButton text="Enable Notifications" click={() => {}} />
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

export default NotificationScreen;
