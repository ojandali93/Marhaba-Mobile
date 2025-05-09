import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {useNavigation} from '@react-navigation/native';
import AithInputStandard from '../../Components/Inputs/AithInputStandard';
import {supabase} from '../../Utils/supabaseClient'; // adjust path if needed
import axios from 'axios';

const screenHeight = Dimensions.get('window').height;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendResetEmail = async () => {
    if (!email) {
      return Alert.alert('Error', 'Please enter your email');
    }

    try {
      setLoading(true);

      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/user/requestResetPassword',
        {
          email: email.toLowerCase(),
        },
      );

      if (response.data.success) {
        Alert.alert(
          'Email Sent',
          'Please check your inbox to reset your password.',
        );
        setEmail('');
        navigation.goBack();
      } else {
        Alert.alert(
          'Error',
          response.data.error || 'Failed to send reset email.',
        );
      }
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data?.error || 'Failed to send reset email.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full flex items-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`w-11/12 h-10/12 flex`}>
        <View style={[tailwind`flex`, {marginTop: screenHeight * 0.1}]}>
          <Text
            style={[
              tailwind`mt-2 text-3xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Forgot Password
          </Text>
          <Text style={tailwind`text-sm text-gray-500 mt-2`}>
            Enter your email to receive a link to reset your password.
          </Text>
        </View>

        <ScrollView style={tailwind`w-full flex-1 mt-4`}>
          <View style={tailwind`w-full pr-1`}>
            <AithInputStandard
              fieldName="Email"
              value={email}
              changeText={setEmail}
              valid
            />
          </View>
        </ScrollView>
      </View>

      <View style={tailwind`absolute w-3/4 bottom-12`}>
        <View style={tailwind`w-full flex flex-row justify-end`}>
          <AuthMainButton
            text={'Send Reset Email'}
            click={handleSendResetEmail}
            loading={loading}
          />
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

export default ForgotPasswordScreen;
