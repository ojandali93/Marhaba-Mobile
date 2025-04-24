import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {Picker} from '@react-native-picker/picker';

const heights = [
  '4\'0"',
  '4\'1"',
  '4\'2"',
  '4\'3"',
  '4\'4"',
  '4\'5"',
  '4\'6"',
  '4\'7"',
  '4\'8"',
  '4\'9"',
  '4\'10"',
  '4\'11"',
  '5\'0"',
  '5\'1"',
  '5\'2"',
  '5\'3"',
  '5\'4"',
  '5\'5"',
  '5\'6"',
  '5\'7"',
  '5\'8"',
  '5\'9"',
  '5\'10"',
  '5\'11"',
  '6\'0"',
  '6\'1"',
  '6\'2"',
  '6\'3"',
  '6\'4"',
  '6\'5"',
  '6\'6"',
  '6\'7"',
  '6\'8"',
  '6\'9"',
  '6\'10"',
  '6\'11"',
  '7\'0"',
];
const screenHeight = Dimensions.get('window').height;

interface GenderPickerProps {
  fieldName: string;
  selected: string;
  onSelect: (gender: string) => void;
  optional?: boolean;
}

const HeightSelect = ({
  fieldName,
  selected,
  onSelect,
  optional,
}: GenderPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelection, setTempSelection] = useState(selected || heights[0]);

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      {/* Touchable input field */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          tailwind`w-full h-14 justify-center px-4 rounded-2 border-2`,
          {
            borderColor: themeColors.primary,
            backgroundColor: themeColors.secondary,
            marginTop: screenHeight * 0.015,
          },
        ]}>
        {/* Floating label */}
        <View style={tailwind`absolute left-3 top--3.5`}>
          <Text
            style={[
              tailwind`text-sm font-semibold px-1`,
              {backgroundColor: themeColors.secondary, color: 'grey'},
            ]}>
            {fieldName} {optional ? '(optional)' : ''}
          </Text>
        </View>

        {/* Display selected gender */}
        <Text style={tailwind`text-base text-gray-800`}>
          {selected || 'Select Height'}
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
              Select Gender
            </Text>

            <Picker
              selectedValue={tempSelection}
              onValueChange={itemValue => setTempSelection(itemValue)}
              style={{color: isDarkMode ? '#fff' : '#000'}}>
              {heights.map(gender => (
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

export default HeightSelect;
