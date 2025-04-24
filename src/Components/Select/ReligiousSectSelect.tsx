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

const religiousSects = [
  'Sunni',
  'Shia',
  'Ibadi',
  'Ahmadi',
  'Sufi',
  'Other (Islam)',
  'Catholic',
  'Protestant',
  'Orthodox (Eastern)',
  'Evangelical',
  'Anglican',
  'Lutheran',
  'Baptist',
  'Methodist',
  'Pentecostal',
  'Coptic',
  'Other (Christianity)',
  'Orthodox',
  'Conservative',
  'Reform',
  'Reconstructionist',
  'Hasidic',
  'Secular',
  'Other (Judaism)',
  'Vaishnavism',
  'Shaivism',
  'Shaktism',
  'Smartism',
  'Theravāda',
  'Mahayāna',
  'Vajrayāna (Tibetan)',
  'Zen',
  'Nichiren',
  'Pure Land',
  'Other (Buddhism)',
  'Khalsa',
  'Nanakpanthi',
  'Namdhari',
  'Nirmala',
  'Other (Sikhism)',
  'Baháʼí Faith',
  'Druze',
  'Unitarian Universalist',
  'Pagan',
  'Wiccan',
  'Spiritual but not religious',
  'Agnostic',
  'Atheist',
  'Other',
  'Prefer not to say',
];

const screenHeight = Dimensions.get('window').height;

interface GenderPickerProps {
  fieldName: string;
  selected: string;
  onSelect: (gender: string) => void;
  optional?: boolean;
}

const ReligiousSectSelect = ({
  fieldName,
  selected,
  onSelect,
  optional,
}: GenderPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelection, setTempSelection] = useState(
    selected || religiousSects[0],
  );

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
          {selected || 'Select Religious Sect.'}
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
              Select Religious Sect.
            </Text>

            <Picker
              selectedValue={tempSelection}
              onValueChange={itemValue => setTempSelection(itemValue)}
              style={{color: isDarkMode ? '#fff' : '#000'}}>
              {religiousSects.map(gender => (
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

export default ReligiousSectSelect;
