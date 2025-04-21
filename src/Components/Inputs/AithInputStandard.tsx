import React from 'react';
import {Text, TextInput, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface InputProps {
  fieldName: string;
  value: string;
  changeText: (data: string) => void;
  secure?: boolean;
}

const AithInputStandard: React.FC<InputProps> = ({
  fieldName,
  value,
  changeText,
  secure,
}) => {
  return (
    <View
      style={[
        tailwind`w-full h-16 flex justify-center pl-3.5 rounded-2 border-2 mt-4`,
        {
          borderColor: themeColors.primary,
          backgroundColor: themeColors.secondary,
        },
      ]}>
      <View style={tailwind`absolute left-3 top--3.5`}>
        <Text
          style={[
            tailwind`font-semibold text-base px-2`,
            {backgroundColor: themeColors.secondary, color: 'grey'},
          ]}>
          {fieldName}
        </Text>
      </View>
      <View style={tailwind``}>
        <TextInput
          value={value}
          onChangeText={changeText}
          placeholder={fieldName.toLowerCase()}
          placeholderTextColor={'grey'}
          secureTextEntry={secure}
          style={[
            tailwind`text-lg font-semibold mx-1.5 mr-5`,
            {
              height: 64, // matches parent h-16
              paddingBottom: 8,
              paddingTop: 8,
              lineHeight: 24, // or match to font size
              textAlignVertical: 'center', // ensures proper vertical alignment
            },
          ]}
        />
      </View>
    </View>
  );
};

export default AithInputStandard;
