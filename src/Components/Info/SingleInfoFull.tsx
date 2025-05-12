import React from 'react';
import {View, Text} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors'; // Assuming this path is correct relative to the new file

interface SingleInfoFullProps {
  label: string;
  value: React.ReactNode; // Allow string, number, or other elements as value
  containerStyle?: object; // Optional additional styles for the outer container
  labelStyle?: object; // Optional additional styles for the label text
  valueStyle?: object; // Optional additional styles for the value text
}

const SingleInfoFull: React.FC<SingleInfoFullProps> = ({
  label,
  value,
  containerStyle = {},
  labelStyle = {},
  valueStyle = {},
}) => {
  const displayValue = value || '—';

  return (
    <View
      style={[
        tailwind`flex flex-col rounded-md py-2 px-3`,
        {
          borderColor: themeColors.primary,
          backgroundColor: themeColors.darkGrey,
        },
        containerStyle,
      ]}>
      {label != '' && (
        <Text
          style={[
            tailwind`text-sm italic text-white`, // Adjusted color slightly for standard label
            labelStyle, // Apply custom label styles
          ]}>
          {label}:
        </Text>
      )}
      <Text
        style={[
          tailwind`text-lg font-bold text-white mt-1`, // Added slight top margin
          valueStyle, // Apply custom value styles
        ]}>
        {displayValue}
      </Text>
    </View>
  );
};

export default SingleInfoFull;
