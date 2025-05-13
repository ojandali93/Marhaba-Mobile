import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {ChevronsLeft, ChevronsRight} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {faqs} from '../../Utils/SelectOptions';

interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const FAQView = ({updateTab}: MenuViewProps) => {
  return (
    <View style={tailwind`flex-1`}>
      <TouchableOpacity
        onPress={() => updateTab('settings')}
        style={tailwind`w-full flex flex-row items-center mb-3 mt-2`}>
        <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        <Text
          style={[
            tailwind`text-2xl font-semibold`,
            {color: themeColors.primary},
          ]}>
          FAQ's
        </Text>
      </TouchableOpacity>
      <View style={tailwind``}>
        {faqs.map((item, idx) => (
          <View key={idx} style={tailwind`mb-4`}>
            <Text
              style={[
                tailwind`text-base font-semibold mb-1`,
                {color: themeColors.primary},
              ]}>
              {item.question}
            </Text>
            <Text style={tailwind`text-sm text-white`}>{item.answer}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default FAQView;
