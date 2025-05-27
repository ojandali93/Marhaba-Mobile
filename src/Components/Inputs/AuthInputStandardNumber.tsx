import React from 'react';
import {Dimensions, Text, TextInput, View, Keyboard} from 'react-native';
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
    <View style={tailwind`w-full mt-3`}>
      {fieldName && (
        <Text style={tailwind`italic text-base font-semibold px-2 pb-1`}>
          {label}{' '}
          {optional ? (
            <Text style={tailwind`text-sm italic text-gray-400`}>
              (optional)
            </Text>
          ) : (
            <Text style={tailwind`text-red-500`}>*</Text>
          )}
        </Text>
      )}
      <View
        style={[
          tailwind`w-full justify-center border rounded-full px-4 py-1`,
          {
            backgroundColor: themeColors.secondary,
            borderColor: themeColors.primary,
          },
        ]}>
        <TextInput
          value={value}
          onChangeText={changeText}
          placeholder={fieldName}
          placeholderTextColor="gray"
          secureTextEntry={secure}
          style={tailwind`text-base mb-2.5`}
          textAlignVertical={'center'}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>
    </View>
  );
};

export default AuthInputStandardNumber;
