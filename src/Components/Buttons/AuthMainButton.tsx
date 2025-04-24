import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface ButtonProps {
  text: string;
  click?: () => void;
}

const AuthMainButton: React.FC<ButtonProps> = ({text, click}) => {
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
      <Text style={tailwind`font-semibold text-white text-lg`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default AuthMainButton;
