import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface GenderPickerProps {
  fieldName: string;
  selected: string;
  onSelect: (value: string) => void;
  optional?: boolean;
  options: string[];
  label: string;
}

const StandardSelect = ({
  fieldName,
  selected,
  onSelect,
  optional,
  options,
  label,
}: GenderPickerProps) => {
  return (
    <View style={tailwind`w-full mt-4 max-h-42`}>
      {/* Label */}
      <Text style={tailwind`italic text-lg font-semibold px-2 pb-2`}>
        {label}{' '}
        {optional ? (
          <Text>(optional)</Text>
        ) : (
          <Text style={tailwind`text-red-500`}>*</Text>
        )}
      </Text>

      {/* Scrollable Options with Max Height */}
      <ScrollView
        style={tailwind`w-full max-h-56`}
        contentContainerStyle={tailwind`flex-row flex-wrap`}>
        {options.map((option, index) => {
          const isSelected = selected === option;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onSelect(option)}
              style={[
                tailwind`rounded-full px-3.25 py-1.25 m-1 border`,
                {
                  borderColor: themeColors.primary,
                  backgroundColor: isSelected
                    ? themeColors.primary
                    : themeColors.secondary,
                },
              ]}>
              <Text
                style={[
                  tailwind`text-base`,
                  {
                    color: isSelected ? 'white' : 'black',
                  },
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default StandardSelect;
