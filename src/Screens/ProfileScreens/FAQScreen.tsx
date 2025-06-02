// FAQScreen.js
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {ChevronsLeft} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {faqs} from '../../Utils/SelectOptions';
import {useNavigation} from '@react-navigation/native';

const FAQScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      {/* Header */}
      <View
        style={tailwind`p-4 border-b border-gray-700 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        </TouchableOpacity>
        <Text
          style={[
            tailwind`text-2xl font-bold ml-2`,
            {color: themeColors.primary},
          ]}>
          FAQ's
        </Text>
      </View>

      {/* Body */}
      <ScrollView
        style={tailwind`flex-1 px-4 py-4`}
        contentContainerStyle={tailwind`pb-10`}>
        {faqs.map((item, idx) => (
          <View
            key={idx}
            style={[
              tailwind`mb-4 p-4 rounded-3`,
              {backgroundColor: themeColors.darkSecondary},
            ]}>
            <Text
              style={[
                tailwind`text-base font-bold mb-2`,
                {color: themeColors.primary},
              ]}>
              {item.question}
            </Text>
            <Text style={tailwind`text-base text-white`}>{item.answer}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQScreen;
