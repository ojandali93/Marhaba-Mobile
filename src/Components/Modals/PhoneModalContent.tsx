import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface PhoneModalContentProps {
  phone: string;
  setPhone: (phone: string) => void;
  setActiveModal: (modal: string | null) => void;
}

const PhoneModalContent = ({ phone, setPhone, setActiveModal }: PhoneModalContentProps) => {
  return (
    <View>
      <Text style={tailwind`text-lg font-semibold mb-2 text-center`}>Edit Phone Number</Text>
          <TextInput
            placeholder="Enter new phone number"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="gray"
            keyboardType="phone-pad"
            style={tailwind`border-b border-gray-400 py-2 mb-4`}
          />
          <TouchableOpacity
            onPress={() => setActiveModal(null)}
            style={[tailwind`mt-2 py-3 rounded-xl`, { backgroundColor: themeColors.primary }]}
          >
            <Text style={tailwind`text-white text-center text-base`}>Save</Text>
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

export default PhoneModalContent;
