import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import Logo from '../../Assets/marhaba-name-only-green.png';
import Icon from '../../Assets/marhaba-icon-full-beige.png';
import AithInputStandard from '../../Components/Inputs/AithInputStandard';
import {
  usernameUpdate,
  passwordUpdate,
  verifyUpdate,
} from '../../Utils/Functions/AuthFuncation';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import GoogleButton from '../../Components/Buttons/GoogleButton';
import AppleButton from '../../Components/Buttons/AppleButton';
import {useNavigation} from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;

const SignupScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verify, setVerify] = useState<string>('');

  const [validPassowrd, setValidPassword] = useState<boolean>(true);
  const [validVerify, setValidVerify] = useState<boolean>(true);

  const handleEmailUpdate = (data: string) => {
    setEmail(usernameUpdate(data));
  };

  const handleUpdatePassword = (data: string) => {
    setPassword(data);
    if (data.length > 0) {
      setValidPassword(passwordUpdate(data));
    } else {
      setValidPassword(true);
    }
  };

  const handleUpdateVerify = (data: string) => {
    setVerify(data);
    if (data.length > 0) {
      setValidVerify(verifyUpdate(data, password));
    } else {
      setValidVerify(true);
    }
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex justify-between`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View>
        <View
          style={[
            tailwind`flex items-center justify-center`,
            {marginTop: screenHeight * 0.1}, // 20% of screen height
          ]}>
          <Image style={tailwind`w-22 h-22`} source={Icon} />
          <View style={tailwind`mt-2 items-center`}>
            <Image style={tailwind`w-56 h-12`} source={Logo} />
            <Text style={tailwind`mt-2 text-lg font-semibold text-gray-800`}>
              Where love begins with hello!
            </Text>
          </View>
        </View>
        <View style={tailwind`w-full flex items-center mt-6`}>
          <View style={tailwind`w-3/4`}>
            <AithInputStandard
              fieldName="Email"
              value={email}
              changeText={handleEmailUpdate}
              valid
            />
            <AithInputStandard
              fieldName="Password:"
              value={password}
              changeText={handleUpdatePassword}
              secure={true}
              valid={validPassowrd}
            />
            {!validPassowrd && (
              <Text style={tailwind`text-xs text-red-600 mt-1`}>
                Password requirements: 8+ chars, capital letter, number, and
                special character.
              </Text>
            )}
            <AithInputStandard
              fieldName="Verify Password"
              value={verify}
              changeText={handleUpdateVerify}
              secure={true}
              valid={validVerify}
            />
            {!validVerify && (
              <Text style={tailwind`text-xs text-red-600 mt-1`}>
                Passwords & Verify do not match.
              </Text>
            )}
            <View style={tailwind`w-full flex flex-row justify-end`}>
              <AuthMainButton text={'Signup'} />
            </View>
            <View style={tailwind`w-full flex flex-row justify-between`}>
              <View
                style={tailwind`${
                  Platform.OS === 'ios' ? 'w-1/2 pr-1' : 'w-full'
                }`}>
                <GoogleButton text="Signup" />
              </View>
              {Platform.OS === 'ios' && (
                <View style={tailwind`w-1/2 pl-1`}>
                  <AppleButton text="Signup" />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={tailwind`w-full flex-row justify-center items-center mb-14`}>
        <Text style={tailwind`text-base`}>I'm already a user. </Text>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <View style={tailwind``}>
            <Text
              style={[
                tailwind`text-base font-bold`,
                {color: themeColors.primary},
              ]}>
              Login
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default SignupScreen;
