import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, Dimensions} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {Picker} from '@react-native-picker/picker';
import {useColorScheme} from 'react-native';

const genders = ['Male', 'Female'];
const screenHeight = Dimensions.get('window').height;

interface GenderPickerProps {
  fieldName: string;
  selected: string;
  onSelect: (gender: string) => void;
  options: string[];
}

const EditSelect = ({
  fieldName,
  selected,
  onSelect,
  options,
}: GenderPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelection, setTempSelection] = useState(selected || options[0]);

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      {/* Touchable input field */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={tailwind`w-full justify-center px-4 py-2`}>
        <View
          style={tailwind`w-full flex flex-row items-center justify-between`}>
          <Text style={tailwind`text-base text-gray-800 italic`}>
            {fieldName}
          </Text>
        </View>

        {/* Display selected gender */}
        <Text
          style={tailwind`text-base text-gray-800 w-full border-2 border-slate-600 rounded-2 px-2 py-2 mt-1`}>
          {selected || `Select ${fieldName}`}
        </Text>
      </TouchableOpacity>

      {/* Picker in Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={tailwind`flex-1 justify-end bg-black bg-opacity-30`}>
          <View
            style={[
              tailwind`rounded-t-2xl p-4 pb-8`,
              {
                backgroundColor: isDarkMode ? '#1c1c1e' : '#fff',
              },
            ]}>
            <Text
              style={[
                tailwind`text-center font-semibold text-lg mb-4`,
                {color: isDarkMode ? '#fff' : '#000'},
              ]}>
              Select {fieldName}
            </Text>

            <Picker
              selectedValue={tempSelection}
              onValueChange={itemValue => setTempSelection(itemValue)}
              style={{color: isDarkMode ? '#fff' : '#000'}}>
              {options.map(gender => (
                <Picker.Item
                  label={gender}
                  value={gender}
                  key={gender}
                  color={isDarkMode ? '#fff' : '#000'}
                />
              ))}
            </Picker>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[
                tailwind`mt-4 py-4 rounded-2`,
                {backgroundColor: themeColors.primary},
              ]}
              onPress={() => {
                onSelect(tempSelection);
                setModalVisible(false);
              }}>
              <Text style={tailwind`text-center text-white text-base`}>
                Confirm
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={tailwind`mt-2 py-2`}
              onPress={() => setModalVisible(false)}>
              <Text style={tailwind`text-center text-red-500 text-base`}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EditSelect;
