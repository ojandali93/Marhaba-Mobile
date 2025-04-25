import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface ButtonProps {
  text: string;
  click?: () => void;
  loading?: boolean;
}

const AuthMainButton: React.FC<ButtonProps> = ({text, click, loading}) => {
  return (
    <TouchableOpacity
      onPress={click}
      style={[
        tailwind`w-full flex justify-center items-center rounded-2 border-2 mt-6 py-2`,
        {
          borderColor: themeColors.primary,
          backgroundColor: themeColors.primary,
        },
      ]}>
      {loading ? (
        <ActivityIndicator size={'small'} color={'white'} />
      ) : (
        <Text style={tailwind`font-semibold text-white text-lg`}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AuthMainButton;
