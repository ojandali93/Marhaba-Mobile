import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {track} from '@amplitude/analytics-react-native';

const screenHeight = Dimensions.get('window').height;

const FinalAgreementsScreen = ({navigation}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedEULA, setAcceptedEULA] = useState(false);
  const [acceptedPledge, setAcceptedPledge] = useState(false);

  const allAccepted = acceptedTerms && acceptedEULA && acceptedPledge;

  useEffect(() => {
    track('Accept Started');
  }, []);

  const handleContinue = () => {
    if (allAccepted) {
      track('Accept Completed');
      navigation.navigate('CreatingProfile');
    } else {
      Alert.alert(
        'Agreements Required',
        'Please accept all agreements to proceed.',
      );
    }
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-11/12 h-10/12`}>
        <View style={[tailwind`flex`, {marginTop: screenHeight * 0.06}]}>
          <Text
            style={[
              tailwind`text-3xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Final Agreements
          </Text>
          <Text style={tailwind`text-sm text-gray-600 mt-2`}>
            Please read and accept the following to complete your signup.
          </Text>
        </View>

        <ScrollView style={tailwind`w-full mt-6`}>
          {/* Terms of Service */}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://app.termly.io/policy-viewer/policy.html?policyUUID=6c415447-ebe1-4647-9104-e89d1c3879c8',
              )
            }
            style={[
              tailwind`p-4 rounded-lg mb-2`,
              {backgroundColor: themeColors.darkSecondary},
            ]}>
            <Text
              style={[
                tailwind`text-xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              Terms of Service
            </Text>
            <Text style={tailwind`text-sm text-gray-700 mt-1`}>
              Read Marhabah's Terms of Service to understand your rights and
              responsibilities.
            </Text>
            <View style={tailwind`mt-2 flex-row justify-between items-center`}>
              <Text style={tailwind`text-base text-blue-500 underline`}>
                Accept Terms
              </Text>
              <Switch
                value={acceptedTerms}
                onValueChange={() => setAcceptedTerms(!acceptedTerms)}
                thumbColor={acceptedTerms ? themeColors.primary : '#ccc'}
                trackColor={{false: '#aaa', true: themeColors.primary}}
              />
            </View>
          </TouchableOpacity>

          {/* EULA */}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://app.termly.io/policy-viewer/policy.html?policyUUID=2c96703e-b201-4b10-8414-c9a70374f352',
              )
            }
            style={[
              tailwind`p-4 rounded-lg mb-2`,
              {backgroundColor: themeColors.darkSecondary},
            ]}>
            <Text
              style={[
                tailwind`text-xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              End User License Agreement (EULA)
            </Text>
            <Text style={tailwind`text-sm text-gray-700 mt-1`}>
              Learn about your license to use Marhabah and limits of liability.
            </Text>
            <View style={tailwind`mt-2 flex-row justify-between items-center`}>
              <Text style={tailwind`text-base text-blue-500 underline`}>
                Accept EULA
              </Text>
              <Switch
                value={acceptedEULA}
                onValueChange={() => setAcceptedEULA(!acceptedEULA)}
                thumbColor={acceptedEULA ? themeColors.primary : '#ccc'}
                trackColor={{false: '#aaa', true: themeColors.primary}}
              />
            </View>
          </TouchableOpacity>

          {/* Community Pledge */}
          <View
            style={[
              tailwind`p-4 rounded-lg mb-2`,
              {backgroundColor: themeColors.darkSecondary},
            ]}>
            <Text
              style={[
                tailwind`text-xl font-semibold`,
                {color: themeColors.primary},
              ]}>
              Community Pledge
            </Text>
            <Text style={tailwind`text-sm text-gray-700 mt-1`}>
              By joining Marhabah, I pledge to:
            </Text>
            <Text style={tailwind`text-sm text-gray-600 mt-2`}>
              • Treat all users with kindness and respect
            </Text>
            <Text style={tailwind`text-sm text-gray-600 mt-2`}>
              • Be honest and authentic in my profile and conversations
            </Text>
            <Text style={tailwind`text-sm text-gray-600 mt-2`}>
              • Never harass, discriminate, or harm others
            </Text>
            <Text style={tailwind`text-sm text-gray-600 mt-2`}>
              • Report inappropriate behavior or suspicious activity
            </Text>
            <Text style={tailwind`text-sm text-gray-600 mt-2`}>
              • Prioritize safety in all interactions
            </Text>
            <Text style={tailwind`text-sm text-gray-600 mt-2`}>
              • Use Marhabah for sincere, marriage-intended connections
            </Text>
            <View style={tailwind`mt-4 flex-row justify-between items-center`}>
              <Text style={tailwind`text-base text-gray-800`}>
                Accept Pledge
              </Text>
              <Switch
                value={acceptedPledge}
                onValueChange={() => setAcceptedPledge(!acceptedPledge)}
                thumbColor={acceptedPledge ? themeColors.primary : '#ccc'}
                trackColor={{false: '#aaa', true: themeColors.primary}}
              />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Continue Button */}
      <View style={tailwind`absolute w-3/4 bottom-12`}>
        <View style={tailwind`w-full flex-row justify-end`}>
          <AuthMainButton text={'Continue'} click={handleContinue} />
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

export default FinalAgreementsScreen;
