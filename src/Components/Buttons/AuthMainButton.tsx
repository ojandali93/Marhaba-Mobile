import React from 'react';
import {Text, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface ButtonProps {
  text: string;
}

const AuthMainButton: React.FC<ButtonProps> = ({text}) => {
  return (
    <View
      style={[
        tailwind`w-full flex justify-center items-center rounded-2 border-2 mt-6 py-2`,
        {
          borderColor: themeColors.primary,
          backgroundColor: themeColors.primary,
        },
      ]}>
      <Text style={tailwind`font-bold text-white text-lg`}>{text}</Text>
    </View>
  );
};

export default AuthMainButton;
