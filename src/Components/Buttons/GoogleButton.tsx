import React from 'react';
import {Image, Text, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import Icon from '../../Assets/google.png';

interface ButtonProps {
  text: string;
}

const GoogleButton: React.FC<ButtonProps> = ({text}) => {
  return (
    <View
      style={[
        tailwind`w-full flex flex-row justify-center items-center rounded-2 border-2 mt-2 py-2`,
        {
          borderColor: themeColors.primary,
          backgroundColor: themeColors.primary,
        },
      ]}>
      <Image style={tailwind`h-5 w-5 mr-3`} source={Icon} />
      <Text style={tailwind`font-bold text-white text-xl`}>{text}</Text>
    </View>
  );
};

export default GoogleButton;
