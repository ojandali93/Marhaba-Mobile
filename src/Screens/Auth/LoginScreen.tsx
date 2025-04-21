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
} from '../../Utils/Functions/AuthFuncation';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import GoogleButton from '../../Components/Buttons/GoogleButton';
import AppleButton from '../../Components/Buttons/AppleButton';
import {useNavigation} from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleEmailUpdate = (data: string) => {
    setEmail(usernameUpdate(data));
  };

  const handleUpdatePassword = (data: string) => {
    setPassword(passwordUpdate(data));
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
              fieldName="Password"
              value={password}
              changeText={handleUpdatePassword}
              secure={true}
              valid
            />
            <View style={tailwind`w-full flex flex-row justify-end mt-2 pr-2`}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setEmail('forgot password');
                }}>
                <View style={tailwind`bg-transparent`}>
                  <Text style={tailwind`font-semibold`}>Forgot Password?</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={tailwind`w-full flex flex-row justify-end`}>
              <AuthMainButton text={'Login'} />
            </View>
            <View style={tailwind`w-full flex flex-row justify-between`}>
              <View
                style={tailwind`${
                  Platform.OS === 'ios' ? 'w-1/2 pr-1' : 'w-full'
                }`}>
                <GoogleButton text="Login" />
              </View>
              {Platform.OS === 'ios' && (
                <View style={tailwind`w-1/2 pl-1`}>
                  <AppleButton text="Login" />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={tailwind`w-full flex-row justify-center items-center mb-14`}>
        <Text style={tailwind`text-base`}>I'm a new user. </Text>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('Signup');
          }}>
          <View style={tailwind``}>
            <Text
              style={[
                tailwind`text-base font-bold`,
                {color: themeColors.primary},
              ]}>
              Sign Up
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default LoginScreen;
