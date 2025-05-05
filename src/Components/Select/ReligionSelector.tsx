import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface ReligionSelectorProps {
  selected: string[];
  setSelected: (updated: string[]) => void;
  maxSelect?: number;
}

const religions = [
  'Islam',
  'Christianity',
  'Judaism',
  'Hinduism',
  'Buddhism',
  'Agnostic',
  'Atheist',
  'Other',
];

const ReligionSelector: React.FC<ReligionSelectorProps> = ({
  selected,
  setSelected,
  maxSelect = 2,
}) => {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(item => item !== value));
    } else if (selected.length < maxSelect) {
      setSelected([...selected, value]);
    }
  };

  return (
    <ScrollView
      style={tailwind`h-full`}
      contentContainerStyle={tailwind``}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={true}>
      <View style={tailwind`flex flex-col`}>
        {religions.map((option, index) => {
          const isSelected = selected.includes(option);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleToggle(option)}
              style={[
                tailwind`px-4 py-2 mb-2 rounded-lg`,
                {
                  backgroundColor: isSelected
                    ? themeColors.primary
                    : themeColors.secondaryHighlight,
                  borderColor: isSelected ? themeColors.primary : '#ccc',
                },
              ]}>
              <Text
                style={tailwind`text-base font-medium ${
                  isSelected ? 'text-white' : 'text-gray-800'
                }`}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ReligionSelector;
