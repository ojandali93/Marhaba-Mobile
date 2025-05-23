import React from 'react';
import {Dimensions, Text, TextInput, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface InputProps {
  fieldName: string;
  value: string;
  changeText: (data: string) => void;
  secure?: boolean;
  valid?: boolean;
  optional?: boolean;
  label?: string;
}

const screenHeight = Dimensions.get('window').height;

const AuthInputStandardNumber: React.FC<InputProps> = ({
  fieldName,
  value,
  changeText,
  secure,
  valid,
  optional,
  label,
}) => {
  return (
    <View style={tailwind`w-full flex justify-center rounded-2 mt-2`}>
      <View style={tailwind``}>
        <Text style={tailwind`italic text-lg font-semibold px-2 pb-2`}>
          {label} {optional ? ' (optional)' : null}
        </Text>
      </View>
      <View
        style={[
          tailwind`w-full border rounded-lg px-3 py-2`,
          {
            backgroundColor: themeColors.secondary,
            borderColor: themeColors.primary,
          },
        ]}>
        <TextInput
          value={value}
          onChangeText={changeText}
          placeholder={fieldName.toLowerCase()}
          placeholderTextColor={'grey'}
          secureTextEntry={secure}
          style={tailwind`text-base`}
          paddingBottom={8}
          paddingTop={0}
          lineHeight={24} // or match to font size
          textAlignVertical="center" // ensures proper vertical alignment
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
};

export default AuthInputStandardNumber;
