import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tailwind from 'twrnc';

const RestorePurchaseModalContent = ({ onRestore, setActiveModal }: { onRestore: () => void, setActiveModal: (modal: string | null) => void }) => {
  return (
    <View>
      <Text style={tailwind`text-lg font-semibold text-center mb-4`}>Restore Purchase</Text>
      <Text style={tailwind`text-sm text-gray-700 text-center mb-6`}>
        If you've purchased a subscription or features previously, you can restore them here.
      </Text>
      <TouchableOpacity
        onPress={onRestore}
        style={[tailwind`py-3 px-6 rounded-xl`, { backgroundColor: '#008060' }]}
      >
        <Text style={tailwind`text-white text-center text-base`}>Restore</Text>
      </TouchableOpacity>
      <TouchableOpacity
            onPress={() => setActiveModal(null)}
            style={tailwind`mt-2 py-3 rounded-xl`}
          >
            <Text style={tailwind`text-red-500 text-center text-base`}>Cancel</Text>
          </TouchableOpacity>
    </View>
  );
};

export default RestorePurchaseModalContent;
