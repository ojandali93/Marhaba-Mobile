import React from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface VerifyModalContentProps {
  email: string;
  verificationCode: string;
  setVerificationCode: (verificationCode: string) => void;
  setActiveModal: (modal: string | null) => void;
  themeColors: { primary: string };
}

const VerifyModalContent = ({ email, verificationCode, setVerificationCode, setActiveModal }: VerifyModalContentProps) => {
  return (
    <View>
      <Text style={tailwind`text-lg font-semibold mb-3 text-center`}>
      Verify Your Email
    </Text>

    {/* Obfuscated Email */}
    <View style={tailwind`mb-2`}>
      <Text style={tailwind`text-base text-center text-gray-700`}>
        Your email: <Text style={tailwind`font-semibold`}>{email.replace(/(.{2}).+(@.+)/, '$1*****$2')}</Text>
      </Text>
    </View>

    {/* Instructions */}
    <Text style={tailwind`text-sm text-gray-600 text-center mb-4`}>
      A 6-digit verification code will be sent to your email. Please enter the code below to verify your account.
    </Text>

    {/* Send Code Button */}
    <TouchableOpacity
      onPress={() => {
        // TODO: Add send code logic here
        Alert.alert('Code Sent', 'A verification code has been sent to your email.');
      }}
      style={[tailwind`mb-4 py-3 rounded-xl`, { backgroundColor: themeColors.primary }]}
    >
      <Text style={tailwind`text-white text-center text-base`}>Send Code</Text>
    </TouchableOpacity>

    <View style={tailwind`w-full mt-2`}>
            <Text style={tailwind`text-sm font-semibold`}>Verification Code:</Text>
            <TextInput
                placeholder="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholderTextColor="gray"
                secureTextEntry
                style={tailwind`border-b border-gray-400 py-2 mb-4 text-center text-base`}
                />
          </View>

    {/* Verify Button */}
    <TouchableOpacity
      onPress={() => {
        // TODO: Add verification logic here
        Alert.alert('Verified', 'Your email has been successfully verified.');
        setActiveModal(null);
      }}
      style={[tailwind`py-3 rounded-xl`, { backgroundColor: themeColors.primary }]}
    >
      <Text style={tailwind`text-white text-center text-base`}>Verify Email</Text>
    </TouchableOpacity>
    <TouchableOpacity
            onPress={() => {
                setActiveModal(null)
            }}
            style={tailwind`mt-2 py-2 rounded-xl`}
          >
            <Text style={tailwind`text-red-500 text-center text-base`}>Cancel</Text>
          </TouchableOpacity>
    </View>
  );
};

export default VerifyModalContent;
