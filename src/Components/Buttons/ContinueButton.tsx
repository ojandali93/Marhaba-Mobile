import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {ChevronsRight} from 'react-native-feather';

interface ButtonProps {
  text: string;
  click?: () => void;
  loading?: boolean;
}

const ContinueButton: React.FC<ButtonProps> = ({text, click, loading}) => {
  return (
    <TouchableOpacity
      onPress={click}
      style={[
        tailwind`flex flex-row justify-center items-center rounded-full px-3 py-2`,
        {
          borderColor: themeColors.primary,
          backgroundColor: themeColors.primary,
        },
      ]}>
      {loading ? (
        <ActivityIndicator size={'small'} color={'white'} />
      ) : (
        <Text style={tailwind`font-semibold text-white text-sm`}>{text}</Text>
      )}
      <ChevronsRight
        height={20}
        width={20}
        color={'white'}
        style={tailwind`ml-2`}
      />
    </TouchableOpacity>
  );
};

export default ContinueButton;
