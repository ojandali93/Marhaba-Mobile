import React, {useCallback, useState} from 'react';
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
import Logo from '../../Assets/marhaba-name-only-blue.png';
import Icon from '../../Assets/marhaba-icon-full-beige.png';
import AithInputStandard from '../../Components/Inputs/AithInputStandard';
import {
  emailUpdate,
  passwordUpdate,
  verifyUpdate,
} from '../../Utils/Functions/AuthFuncation';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthInputStandardNumber from '../../Components/Inputs/AuthInputStandardNumber';
import axios from 'axios';

const screenHeight = Dimensions.get('window').height;

const SignupScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verify, setVerify] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [availableEmail, setAvailableEmail] = useState<boolean>(true);
  const [validPassowrd, setValidPassword] = useState<boolean>(true);
  const [validVerify, setValidVerify] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, []),
  );

  const loadPreferences = async () => {
    const storedEmail = await AsyncStorage.getItem('email');
    const storedPassword = await AsyncStorage.getItem('password');
    const storedPhone = await AsyncStorage.getItem('phone');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedPassword) {
      setPassword(storedPassword);
      setVerify(storedPassword);
    }
    if (storedPhone) {
      setPhone(storedPhone);
    }
  };

  const handleEmailUpdate = async (data: string) => {
    setEmail(data.toLowerCase());
    if (email.length > 0) {
      setValidEmail(emailUpdate(data.toLowerCase()));
    }
    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/account/checkEmail/${data.toLowerCase()}`,
      );
      if (response.data.data.length > 0) {
        console.log('email response:', response);
        setAvailableEmail(false);
      } else {
        setAvailableEmail(true);
      }
    } catch (error) {
      console.log('❌ Server responded with status:', error);
    }
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

  const redirectToIdentity = () => {
    email.length > 0 &&
    password.length > 0 &&
    verify.length > 0 &&
    validEmail &&
    validPassowrd &&
    validVerify &&
    phone.length > 0
      ? storeNextScreen()
      : Alert.alert(
          'Requirements',
          'Please make sure all fields are filled out correctly.',
        );
  };

  const storeNextScreen = async () => {
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('password', password);
    await AsyncStorage.setItem('phone', phone);
    // createAccount(email, password);
    navigation.navigate('Identity');
  };

  // const createAccount = async (email: string, password: string) => {
  //   axios
  //     .post('https://marhaba-server.onrender.com/api/account/createAccount', {
  //       email,
  //       password,
  //       name: 'omar',
  //     })
  //     .then(response => {
  //       console.log('account response:', response);
  //     })
  //     .catch(error => {
  //       if (error) {
  //         console.log('❌ Server responded with status:', error);
  //       }
  //     });
  // };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
    const len = digits.length;

    if (len <= 3) return digits;
    if (len <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
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
              changeText={handleEmailUpdate}
              valid
            />
            {!validEmail && (
              <Text style={tailwind`text-xs text-red-600 mt-1`}>
                Enter valid email.
              </Text>
            )}
            {!availableEmail && (
              <Text style={tailwind`text-xs text-red-600 mt-1`}>
                Email is already in use.
              </Text>
            )}
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
            <AuthInputStandardNumber
              fieldName="Phone"
              value={phone}
              changeText={(text: string) => setPhone(formatPhoneNumber(text))}
              secure={false}
              valid={true}
            />
            <View style={tailwind`w-full flex flex-row justify-end`}>
              <AuthMainButton text={'Signup'} click={redirectToIdentity} />
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
