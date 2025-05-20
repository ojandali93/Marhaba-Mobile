import React from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface PasswordModalContentProps {
  password: string;
  setPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (newPassword: string) => void;
  verifyPassword: string;
  setVerifyPassword: (verifyPassword: string) => void;
  setActiveModal: (modal: string | null) => void;
  updatePasswordViaServer: () => void;
}

const PasswordModalContent = ({
  password,
  setPassword,
  newPassword,
  setNewPassword,
  verifyPassword,
  setVerifyPassword,
  setActiveModal,
  updatePasswordViaServer,
}: PasswordModalContentProps) => {
  return (
    <View>
      <Text style={tailwind`text-lg font-semibold mb-2 text-center`}>
        Change Password
      </Text>
      <View style={tailwind`w-full mt-2`}>
        <Text style={tailwind`text-sm font-semibold`}>Current Password:</Text>
        <TextInput
          placeholder="Current password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="gray"
          secureTextEntry
          style={tailwind`border-b border-gray-400 py-2 mb-2`}
        />
      </View>
      <View style={tailwind`w-full mt-2`}>
        <Text style={tailwind`text-sm font-semibold`}>New Password:</Text>
        <TextInput
          placeholder="New password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholderTextColor="gray"
          secureTextEntry
          style={tailwind`border-b border-gray-400 py-2 mb-2`}
        />
      </View>
      <View style={tailwind`w-full mt-2`}>
        <Text style={tailwind`text-sm font-semibold`}>
          Verify New Password:
        </Text>
        <TextInput
          placeholder="Verify New password"
          value={verifyPassword}
          onChangeText={setVerifyPassword}
          placeholderTextColor="gray"
          secureTextEntry
          style={tailwind`border-b border-gray-400 py-2 mb-2`}
        />
      </View>
      <TouchableOpacity
        onPress={updatePasswordViaServer}
        style={[
          tailwind`mt-2 py-3 rounded-xl`,
          {backgroundColor: themeColors.primary},
        ]}>
        <Text style={tailwind`text-white text-center text-base`}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setActiveModal(null);
        }}
        style={tailwind`mt-2 py-2 rounded-xl`}>
        <Text style={tailwind`text-red-500 text-center text-base`}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordModalContent;
