import { ThemeContext } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tailwind from 'twrnc';

const BillingModalContent = ({ setActiveModal }: { setActiveModal: (modal: string | null) => void }) => {
  return (
    <View>
      <Text style={tailwind`text-lg font-semibold text-center mb-3`}>Billing Details</Text>
      <Text style={tailwind`text-sm text-gray-700 mb-2`}>
        Your current plan: Marhabah Pro
      </Text>
      <Text style={tailwind`text-sm text-gray-700 mb-2`}>
        Next billing date: June 10, 2025
      </Text>
      <Text style={tailwind`text-sm text-gray-700`}>
        Payment method: **** **** **** 1234 (Visa)
      </Text>
      <TouchableOpacity
            onPress={() => setActiveModal(null)}
            style={tailwind`mt-2 py-3 rounded-xl`}
          >
            <Text style={tailwind`text-red-500 text-center text-base`}>Cancel</Text>
          </TouchableOpacity>
    </View>
  );
};

export default BillingModalContent;