import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {track} from '@amplitude/analytics-react-native';
import {useNavigation} from '@react-navigation/native';
import ContinueButton from '../../Components/Buttons/ContinueButton';
import {ChevronsLeft} from 'react-native-feather';

const screenHeight = Dimensions.get('window').height;

const FinalAgreementsScreen = ({}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedEULA, setAcceptedEULA] = useState(false);
  const [acceptedPledge, setAcceptedPledge] = useState(false);

  const navigation = useNavigation();
  const allAccepted = acceptedTerms && acceptedEULA;

  useEffect(() => {
    track('Accept Started');
  }, []);

  const handleContinue = () => {
    if (allAccepted) {
      track('Accept Completed');
      navigation.navigate('Community');
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
                Agreements
              </Text>
            </View>
            <Text style={tailwind`text-sm mt-1`}>
              Please read and accept the following guidelines
            </Text>
          </View>
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
                View Terms
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
            onPress={() => navigation.navigate('Eula')}
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
              Read Marhabah's End User License Agreement (EULA) to understand
              your rights and responsibilities.
            </Text>

            {/* 👇 Apple-compliant UGC bullet points */}
            {/* <View style={tailwind`mt-3`}>
              <Text style={tailwind`text-sm text-gray-600 mt-2`}>
                • All users must treat others with respect and dignity.
              </Text>
              <Text style={tailwind`text-sm text-gray-600 mt-2`}>
                • Objectionable content, harassment, or abuse is not tolerated
                under any circumstances.
              </Text>
              <Text style={tailwind`text-sm text-gray-600 mt-2`}>
                • Users are responsible for the content they upload or send.
              </Text>
              <Text style={tailwind`text-sm text-gray-600 mt-2`}>
                • Inappropriate behavior can be reported and will be reviewed by
                our moderation team.
              </Text>
              <Text style={tailwind`text-sm text-gray-600 mt-2`}>
                • Repeated violations may result in account suspension or
                permanent removal.
              </Text>
            </View> */}

            <View style={tailwind`mt-4 flex-row justify-between items-center`}>
              <Text style={tailwind`text-base text-blue-500 underline`}>
                View EULA
              </Text>
              <Switch
                value={acceptedEULA}
                onValueChange={() => setAcceptedEULA(!acceptedEULA)}
                thumbColor={acceptedEULA ? themeColors.primary : '#ccc'}
                trackColor={{false: '#aaa', true: themeColors.primary}}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Continue Button */}
      <View
        style={tailwind`w-full absolute bottom-0 flex flex-row justify-between px-5 mb-12`}>
        <View style={tailwind`flex flex-row items-center`}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.popToTop();
            }}>
            <View style={tailwind``}>
              <Text style={tailwind`text-sm font-bold text-red-400`}>
                Cancel
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ContinueButton text={'Create Profile'} click={handleContinue} />
      </View>
    </View>
  );
};

export default FinalAgreementsScreen;
