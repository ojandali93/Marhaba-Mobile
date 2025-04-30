import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tailwind from 'twrnc';

const PastTransactionsModalContent = ({ setActiveModal }: { setActiveModal: (modal: string | null) => void }) => {
  return (
    <View>
      <Text style={tailwind`text-lg font-semibold text-center mb-3`}>Past Transactions</Text>
      <Text style={tailwind`text-sm text-gray-700 mb-2`}>
        • May 10, 2025 – $9.99 – Marhabah Pro
      </Text>
      <Text style={tailwind`text-sm text-gray-700 mb-2`}>
        • April 10, 2025 – $9.99 – Marhabah Pro
      </Text>
      <Text style={tailwind`text-sm text-gray-700 mb-2`}>
        • March 10, 2025 – $9.99 – Marhabah Pro
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

export default PastTransactionsModalContent;