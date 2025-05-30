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

const AithInputStandard: React.FC<InputProps> = ({
  fieldName,
  value,
  changeText,
  secure,
  valid,
  optional,
  label,
  multiline,
}) => {
  return (
    <View style={tailwind`w-full flex justify-center rounded-2 mt-1`}>
      <View style={tailwind``}>
        <Text style={tailwind`italic text-base px-2 pb-1`}>
          {label}{' '}
          {optional ? (
            ' (optional)'
          ) : (
            <Text style={tailwind`text-red-500`}>* </Text>
          )}
        </Text>
      </View>
      <View style={tailwind`border-2 border-slate-600 rounded-2 px-2 py-1`}>
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
          multiline={multiline}
        />
      </View>
    </View>
  );
};

export default AithInputStandard;
