import React, {useState} from 'react';
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
import Icon from '../../Assets/marhaba-icon-full-beige.png';
import Logo from '../../Assets/marhaba-name-only-green.png';
import { useProfile } from '../../Context/ProfileContext';

const screenHeight = Dimensions.get('window').height;

const LoginScreen = () => {
  const navigation = useNavigation();
  const {grabUserProfileData} = useProfile();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdateEmail = (data: string) => {
    setEmail(data.toLowerCase());
  };

  const login = async () => {
    setLoading(true);
    try {
      console.log('login');
      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/auth/loginUser',
        {email, password},
      );
      console.log('response', response.data);
      if(response.data) {
        
        const {session, userId, token} = response.data;
        console.log('session', session);
        console.log('userId', userId);
        console.log('token', token);
        grabUserProfileData(session, userId, token)
      } else {
        Alert.alert('Login Failed', 'Email / Password do not match our records.');
        setLoading(false);
      }

      setLoading(false);
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Failed', error?.message || 'Please check your network or try again later.');
      setLoading(false);
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
            {marginTop: screenHeight * 0.1},
          ]}>
          <Image style={tailwind`w-22 h-22`} source={Icon} />
          <View style={tailwind`mt-2 items-center`}>
            <Image style={tailwind`w-62 h-12`} source={Logo} />
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
          </View>
        </View>
      </View>
      <View style={tailwind`w-full flex-row justify-center items-center mb-14`}>
        <Text style={tailwind`text-base`}>I'm a new user. </Text>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('Signup');
          }}>
          <View>
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
