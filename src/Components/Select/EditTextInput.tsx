import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  useColorScheme,
  Dimensions,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

const screenHeight = Dimensions.get('window').height;

interface EditTextInputProps {
  fieldName: string;
  selected: string;
  onSelect: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

const EditTextInput = ({
  fieldName,
  selected,
  onSelect,
  multiline = false,
  placeholder = 'Enter response...',
}: EditTextInputProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setModalVisible(true)}
      style={tailwind`w-full justify-center px-4 py-2`}>
      <View style={tailwind`w-full flex-row items-center justify-between`}>
        <Text style={tailwind`text-base text-gray-800 italic`}>
          {fieldName}
        </Text>
      </View>
      <View style={tailwind`border-2 rounded-2 px-2 py-1 mt-1`}>
        <TextInput
          value={selected}
          onChangeText={onSelect}
          multiline={multiline}
          placeholder={placeholder || 'Enter response...'}
          placeholderTextColor={'#999'}
          style={tailwind` text-base p-3 rounded-lg text-black`}
        />
      </View>
    </TouchableOpacity>
  );
};

export default EditTextInput;
