import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
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
import LinearGradient from 'react-native-linear-gradient';
import StandardText from '../../Components/Select/StandardText';
import {track} from '@amplitude/analytics-react-native';
import ContinueButton from '../../Components/Buttons/ContinueButton';
import {ChevronsLeft} from 'react-native-feather';

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
      track('Signup Started');
    }, []),
  );

  const loadPreferences = async () => {
    const storedEmail = await AsyncStorage.getItem('SU_email');
    const storedPassword = await AsyncStorage.getItem('SU_password');
    const storedPhone = await AsyncStorage.getItem('SU_phone');
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
    await AsyncStorage.setItem('SU_email', email);
    await AsyncStorage.setItem('SU_password', password);
    await AsyncStorage.setItem('SU_phone', phone);
    // createAccount(email, password);
    track('Signup Completed');
    navigation.navigate('Identity');
  };
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
    const len = digits.length;

    if (len <= 3) return digits;
    if (len <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tailwind`h-full w-full`}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#76ccc2', '#afdbd6']}
          style={tailwind`h-full w-full justify-between`}>
          <View
            style={[
              tailwind`flex-1 w-full h-full flex items-center`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <View style={tailwind`w-11/12 h-10/12 flex`}>
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
                      Signup
                    </Text>
                  </View>
                  <Text style={tailwind`text-sm mt-1`}>
                    Enter your details below.
                  </Text>
                </View>
              </View>
              <ScrollView
                contentContainerStyle={tailwind`flex-grow`}
                keyboardShouldPersistTaps="handled"
                style={tailwind`w-full`}>
                <View style={tailwind`w-full flex items-center mt-2`}>
                  <View style={tailwind`w-full`}>
                    <StandardText
                      fieldName="Email"
                      value={email}
                      changeText={handleEmailUpdate}
                      label="Email"
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
                    <StandardText
                      fieldName="Password:"
                      value={password}
                      changeText={handleUpdatePassword}
                      secure={true}
                      valid={validPassowrd}
                      label="Password"
                    />
                    {!validPassowrd && (
                      <Text style={tailwind`text-xs text-red-600 mt-1`}>
                        Password requirements: 8+ chars, capital letter, number,
                        and special character.
                      </Text>
                    )}
                    <StandardText
                      fieldName="Verify Password"
                      value={verify}
                      changeText={handleUpdateVerify}
                      secure={true}
                      valid={validVerify}
                      label="Verify Password"
                    />
                    {!validVerify && (
                      <Text style={tailwind`text-xs text-red-600 mt-1`}>
                        Passwords & Verify do not match.
                      </Text>
                    )}
                    <AuthInputStandardNumber
                      fieldName="Phone"
                      label="Phone"
                      value={phone}
                      changeText={(text: string) =>
                        setPhone(formatPhoneNumber(text))
                      }
                      secure={false}
                      valid={false}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
            <View
              style={tailwind`w-full absolute bottom-0 flex flex-row justify-between px-5 mb-12`}>
              <View style={tailwind`flex flex-row items-center`}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <View style={tailwind``}>
                    <Text style={tailwind`text-sm font-bold text-red-400`}>
                      Cancel
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <ContinueButton text={'About You'} click={redirectToIdentity} />
            </View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
