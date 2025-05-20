import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface MultiSelectProps {
  fieldName: string;
  selected: string[]; // now accepts an array of selected values
  onSelect: (newSelected: string) => void;
  optional?: boolean;
  options: string[];
  label: string;
  maxSelectable?: number; // optional maximum
}

const StandardMultiSelect = ({
  fieldName,
  selected,
  onSelect,
  optional,
  options,
  label,
}: MultiSelectProps) => {
  return (
    <View style={tailwind`w-full mt-4`}>
      <Text style={tailwind`italic text-lg font-semibold px-2 pb-2`}>
        {label}{' '}
        {optional ? (
          <Text>(optional)</Text>
        ) : (
          <Text style={tailwind`text-red-500`}>*</Text>
        )}
      </Text>

      <ScrollView
        style={tailwind`w-full max-h-56`}
        contentContainerStyle={tailwind`flex-row flex-wrap`}>
        {options.map((option, index) => {
          const isSelected = selected.includes(option);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onSelect(option)}
              style={[
                tailwind`rounded-full px-3 py-1 m-1 border`,
                {
                  borderColor: themeColors.primary,
                  backgroundColor: isSelected
                    ? themeColors.primary
                    : themeColors.secondary,
                },
              ]}>
              <Text
                style={[
                  tailwind`text-sm font-semibold`,
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

export default StandardMultiSelect;
