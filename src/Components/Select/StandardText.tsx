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
  multiline?: boolean;
}

const screenHeight = Dimensions.get('window').height;

const StandardText: React.FC<InputProps> = ({
  fieldName,
  value,
  changeText,
  secure = false,
  valid,
  optional = false,
  label,
  multiline = false,
}) => {
  return (
    <View style={tailwind`w-full mt-3`}>
      {label && (
        <Text style={tailwind`italic text-lg font-semibold px-2 pb-2`}>
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
          tailwind`w-full border rounded-lg px-3 py-2`,
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
          multiline={multiline}
          style={tailwind`text-base mb-1`}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );
};

export default StandardText;
