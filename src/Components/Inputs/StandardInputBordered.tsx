import React from 'react';
import {
  Dimensions,
  Keyboard,
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
        tailwind`w-full flex justify-center`,
        {
          backgroundColor: themeColors.secondary,
        },
      ]}>
      <View
        style={tailwind`w-full flex flex-row justify-between items-center mb-1.5`}>
        <Text style={tailwind`italic text-base font-semibold px-2 pb-1`}>
          {fieldName}
        </Text>
      </View>
      <View
        style={[
          tailwind`border-2 rounded-3 px-3`,
          {
            borderColor: themeColors.primary,
          },
        ]}>
        <TextInput
          value={value}
          onChangeText={changeValue}
          multiline={longContent}
          placeholder={placeholder}
          style={tailwind`text-base mb-2.5 mt-1`}
          textAlignVertical={'center'}
          placeholderTextColor={'grey'}
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>
    </View>
  );
};

export default StandardInputBordered;
