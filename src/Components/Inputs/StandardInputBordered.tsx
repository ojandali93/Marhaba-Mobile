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
const CHARACTER_LIMIT = 200;

const StandardInputBordered: React.FC<standardInput> = ({
  value,
  changeValue,
  fieldName,
  longContent,
  placeholder,
  removeClick,
  remove,
}) => {
  const handleTextChange = (text: string) => {
    if (text.length <= CHARACTER_LIMIT) {
      changeValue(text);
    }
  };

  return (
    <View
      style={[
        tailwind`w-full flex justify-center`,
        {backgroundColor: themeColors.secondary},
      ]}>
      {/* Label */}
      <View style={tailwind`w-full flex flex-row justify-between items-center`}>
        <Text style={tailwind`italic text-base font-semibold px-2 `}>
          {fieldName}
        </Text>
        {remove && removeClick && (
          <TouchableOpacity onPress={removeClick}>
            <Text style={tailwind`text-red-500 text-sm`}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Input Field */}
      <View
        style={[
          tailwind`border-2 rounded-3 px-3`,
          {borderColor: themeColors.primary},
        ]}>
        <TextInput
          value={value}
          onChangeText={handleTextChange}
          multiline={longContent}
          placeholder={placeholder}
          style={tailwind`text-base mb-2.5`}
          textAlignVertical={'center'}
          placeholderTextColor={'grey'}
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>

      {/* Character Counter */}
      <Text style={tailwind`text-right text-xs mt-1 pr-1 text-gray-400`}>
        {CHARACTER_LIMIT - value.length}
      </Text>
    </View>
  );
};

export default StandardInputBordered;
