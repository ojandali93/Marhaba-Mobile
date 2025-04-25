import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AithInputStandard from '../../Components/Inputs/AithInputStandard';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../../Assets/marhaba-icon-full-beige.png';
import Logo from '../../Assets/marhaba-name-only-green.png';
import {supabase} from '../../Services/Supabase';

const screenHeight = Dimensions.get('window').height;

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdateEmail = (data: string) => {
    setEmail(data.toLowerCase());
  };

  const login = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/auth/loginUser',
        {email, password},
      );

      const {session, userId} = response.data;

      await AsyncStorage.setItem('session', JSON.stringify(session));
      await AsyncStorage.setItem('userId', userId);
      setLoading(false);
    } catch (error) {
      Alert.alert('Login Failed', 'Email / Password do not match our records.');
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
              changeText={handleUpdateEmail}
              valid
            />
            <AithInputStandard
              fieldName="Password"
              value={password}
              changeText={setPassword}
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
              <AuthMainButton text={'Login'} click={login} loading={loading} />
            </View>
            {/* <View style={tailwind`w-full flex flex-row justify-between`}>
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
            </View> */}
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
