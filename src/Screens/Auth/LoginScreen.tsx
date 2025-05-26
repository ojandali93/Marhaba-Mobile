import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AithInputStandard from '../../Components/Inputs/AithInputStandard';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Icon from '../../Assets/marhaba-icon-full-white.png';
import Logo from '../../Assets/marhaba-name-only-blue.png';
import {useProfile} from '../../Context/ProfileContext';
import AuthLoginInput from '../../Components/Inputs/AuthLoginInput';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {identify, setUserId, track} from '@amplitude/analytics-react-native';
import backgroundIMage from '../../Assets/m-flow-1-3.png';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

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
      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/auth/loginUser',
        {email, password},
      );

      const {session, userId, user} = response.data;

      if (!user?.email_confirmed_at) {
        Alert.alert(
          'Email Not Verified',
          'Please verify your email before logging in. Check your inbox or spam folder.',
        );
        setLoading(false);
        return;
      }

      const deviceToken = await AsyncStorage.getItem('APN_TOKEN_KEY');

      console.log('deviceToken', deviceToken);
      console.log('userId', userId);

      setUserId(userId);
      track('User Logged In', {
        userId: userId,
      });

      await axios.post(
        'https://marhaba-server.onrender.com/api/notifications/store-device-token',
        {
          userId,
          token: deviceToken,
        },
      );

      // 📥 Grab user data and finish login
      grabUserProfileData(session, userId);
      setLoading(false);
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert(
        'Login Failed',
        error?.response?.data?.error ||
          'Please check your credentials or try again later.',
      );
      setLoading(false);
    }
  };

  //#76ccc2

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{width: screenWidth, height: screenHeight}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{width: screenWidth, height: screenHeight}}>
          <Image
            source={backgroundIMage}
            style={[
              tailwind`absolute z-0`,
              {width: screenWidth, height: screenHeight},
            ]}
            resizeMode="cover"
          />
          <View
            style={[
              tailwind`absolute z-1`,
              {
                width: screenWidth,
                height: screenHeight,
                backgroundColor: themeColors.lightGreyOpacity,
              },
            ]}></View>
          <View
            style={tailwind`absolute z-2 w-full h-full flex flex-col justify-between items-center pb-8`}>
            <View
              style={[
                tailwind`flex items-center justify-center`,
                {marginTop: screenHeight * 0.09},
              ]}>
              <Image style={tailwind`w-20 h-20`} source={Icon} />
              <View style={tailwind`mt-6 items-center`}>
                <Image style={tailwind`w-62 h-12`} source={Logo} />
                <Text style={tailwind`mt-2 text-lg font-semibold text-white`}>
                  Where love begins with hello!
                </Text>
              </View>
            </View>
            <View
              style={tailwind`w-full flex items-center justify-center mt-4`}>
              <View style={tailwind`w-11/12 p-6 rounded-2`}>
                <AuthLoginInput
                  fieldName="Email"
                  value={email}
                  changeText={handleUpdateEmail}
                  iconName="Mail"
                  valid
                />
                <View style={tailwind`mt-3`}>
                  <AuthLoginInput
                    fieldName="Password"
                    value={password}
                    changeText={setPassword}
                    secure={true}
                    iconName="Lock"
                    valid
                  />
                </View>
                <View
                  style={tailwind`w-full flex flex-row justify-end pr-2 mt-2`}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ForgotPassword');
                    }}>
                    <View style={tailwind`bg-transparent`}>
                      <Text style={tailwind`font-semibold text-white`}>
                        Forgot Password?
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={tailwind`w-full flex flex-row justify-end`}>
                  <AuthMainButton
                    text={'Login'}
                    click={login}
                    loading={loading}
                  />
                </View>
                <View
                  style={tailwind`w-full flex-row justify-center items-center mt-4`}>
                  <Text style={tailwind`text-base text-white font-semibold`}>
                    I'm a new user.
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.navigate('Signup');
                    }}>
                    <View>
                      <Text
                        style={[
                          tailwind`text-base font-bold ml-2`,
                          {color: themeColors.primary},
                        ]}>
                        Sign Up
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
