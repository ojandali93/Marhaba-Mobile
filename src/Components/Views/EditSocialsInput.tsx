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
}

const EditSocialsInput = ({
  fieldName,
  selected,
  onSelect,
  multiline = false,
}: EditTextInputProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setModalVisible(true)}
      style={tailwind`w-full justify-center px-2 py-2`}>
      <View style={tailwind`w-full flex-row items-center justify-between`}>
        <Text style={tailwind`text-base text-gray-800 italic`}>
          {fieldName}
        </Text>
      </View>
      <View
        style={tailwind`border-2 border-slate-600 rounded-2 px-2 py-1 mt-1 flex flex-row items-center`}>
        <Text style={tailwind`text-base font-semibold  pr-3`}>@</Text>
        <TextInput
          style={tailwind`w-full text-lg text-gray-800 pb-1`}
          value={selected}
          onChangeText={onSelect}
          placeholder={fieldName}
          placeholderTextColor={themeColors.darkGrey}
          multiline={multiline}
        />
      </View>
    </TouchableOpacity>
  );
};

export default EditSocialsInput;
