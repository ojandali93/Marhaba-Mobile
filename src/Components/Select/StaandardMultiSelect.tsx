import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  ScrollView,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

const screenHeight = Dimensions.get('window').height;

interface MultiSelectProps {
  fieldName: string;
  selected: string[];
  onSelect: (selectedOptions: string[]) => void;
  optional?: boolean;
  options: string[];
  min: number;
  max: number;
}

const StaandardMultiSelect = ({
  fieldName,
  selected,
  onSelect,
  optional,
  options,
  min,
  max,
}: MultiSelectProps) => {
  const isDarkMode = useColorScheme() === 'dark';

  const handleToggleSelect = (trait: string) => {
    if (selected.includes(trait)) {
      onSelect(selected.filter(item => item !== trait)); // remove
    } else {
      if (selected.length < max) {
        onSelect([...selected, trait]); // add
      }
    }
  };

  return (
    <>
      <Text style={[tailwind`text-xl mt-2 font-bold`, { color: themeColors.primary }]}>
        {fieldName}
      </Text>
      <View style={tailwind`w-full flex flex-row items-center justify-between`}>
        <Text style={tailwind`text-sm mt-1`}>
          Select {min} - {max} options
        </Text>
        <Text style={tailwind`text-sm mt-1 text-gray-600`}>
          Selected: {selected.length} / {max}
        </Text>
      </View>
      <ScrollView
        style={tailwind`h-9/12 mt-4`}
        showsVerticalScrollIndicator={false}>
        <View style={tailwind`flex-row flex-wrap justify-between`}>
          {options.map((trait, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleToggleSelect(trait)}
              style={[
                tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                {
                  backgroundColor: selected.includes(trait)
                    ? themeColors.primary
                    : themeColors.secondary,
                  borderColor: themeColors.primary,
                },
              ]}>
              <Text
                style={[
                  tailwind`text-center text-base`,
                  {
                    color: selected.includes(trait) ? 'white' : 'black',
                  },
                ]}>
                {trait}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default StaandardMultiSelect;
