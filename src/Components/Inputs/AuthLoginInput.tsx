import React from 'react';
import {Dimensions, Text, TextInput, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import * as FeatherIcons from 'react-native-feather';

interface InputProps {
  fieldName: string;
  value: string;
  changeText: (data: string) => void;
  secure?: boolean;
  valid?: boolean;
  optional?: boolean;
  iconName?: keyof typeof FeatherIcons;
}

const screenHeight = Dimensions.get('window').height;

const AuthLoginInput: React.FC<InputProps> = ({
  fieldName,
  value,
  changeText,
  secure,
  valid = true,
  optional,
  iconName,
}) => {
  const IconComponent = iconName ? FeatherIcons[iconName] : null;

  return (
    <View
      style={[
        tailwind`w-full flex-row items-center px-4 rounded-full border-2`,
        {
          borderColor: valid ? themeColors.primary : 'red',
          backgroundColor: themeColors.darkSecondaryOpacity,
        },
      ]}>
      {IconComponent && (
        <View style={tailwind`mr-2`}>
          <IconComponent
            stroke={themeColors.primary}
            width={20}
            height={20}
            strokeWidth={2}
          />
        </View>
      )}
      <TextInput
        value={value}
        onChangeText={changeText}
        placeholder={fieldName}
        placeholderTextColor={'grey'}
        secureTextEntry={secure}
        style={[tailwind`flex-1 text-base py-3`]}
      />
    </View>
  );
};

export default AuthLoginInput;
