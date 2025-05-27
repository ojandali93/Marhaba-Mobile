import React from 'react';
import {Dimensions, Text, TextInput, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface AgeRangeSliderProps {
  fieldName: string;
  minAge: number;
  maxAge: number;
  ageRange: [number, number];
  setAgeRange: (range: [number, number]) => void;
}

const screenHeight = Dimensions.get('window').height;

const AgeRangeSlider: React.FC<AgeRangeSliderProps> = ({
  fieldName,
  minAge,
  maxAge,
  ageRange,
  setAgeRange,
}) => {
  return (
    <View
      style={[
        tailwind`w-full flex justify-center`,
        {
          borderColor: themeColors.primary,
          backgroundColor: themeColors.secondary,
          marginTop: screenHeight * 0.015,
        },
      ]}>
      <View style={tailwind``}>
        <Text style={tailwind`italic text-base font-semibold pb-2`}>
          {fieldName} <Text style={tailwind`text-red-500`}>*</Text>
        </Text>
      </View>
      <View style={tailwind`w-full flex items-center`}>
        <Text style={tailwind`text-sm font-semibold text-gray-700`}>
          {ageRange[0]} - {ageRange[1]} years old
        </Text>

        <MultiSlider
          values={[ageRange[0], ageRange[1]]}
          sliderLength={280}
          onValuesChange={values => {
            const [min, max] = values;
            if (max - min >= 4) setAgeRange([min, max]);
          }}
          min={minAge}
          max={maxAge}
          step={1}
          allowOverlap={false}
          snapped
          selectedStyle={{backgroundColor: themeColors.primary}}
          markerStyle={{
            backgroundColor: themeColors.primary,
            height: 20,
            width: 20,
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          }}
        />
      </View>
    </View>
  );
};

export default AgeRangeSlider;
