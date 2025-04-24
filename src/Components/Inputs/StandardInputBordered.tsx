import React from 'react';
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import themeColors from '../../Utils/custonColors';
import tailwind from 'twrnc';
import {Trash, Trash2, X} from 'react-native-feather';

interface standardInput {
  value: string;
  changeValue: (data: string) => void;
  fieldName: string;
  longContent: boolean;
  placeholder: string;
  remove?: boolean;
  removeClick?: () => void;
}

const screenHeight = Dimensions.get('window').height;

const StandardInputBordered: React.FC<standardInput> = ({
  value,
  changeValue,
  fieldName,
  longContent,
  placeholder,
  removeClick,
  remove,
}) => {
  return (
    <View
      style={[
        tailwind`w-full flex justify-center pl-3.5 py-3 rounded-2 border-2`,
        {
          borderColor: themeColors.primary,
          backgroundColor: themeColors.secondary,
          marginTop: screenHeight * 0.015,
        },
      ]}>
      <View
        style={tailwind`w-full flex flex-row justify-between items-center mb-1.5`}>
        <Text style={tailwind`text-sm font-semibold text-gray-600`}>
          {fieldName}
        </Text>
        {remove && (
          <TouchableOpacity onPress={removeClick} style={tailwind`p-1 mr-2`}>
            <Trash2 height={18} width={18} color={themeColors.primary} />
          </TouchableOpacity>
        )}
      </View>
      <View style={tailwind`pr-3`}>
        <TextInput
          value={value}
          onChangeText={changeValue}
          multiline={longContent}
          placeholder={placeholder}
          style={tailwind`text-base mb-2`}
          placeholderTextColor={'grey'}
        />
      </View>
    </View>
  );
};

export default StandardInputBordered;
