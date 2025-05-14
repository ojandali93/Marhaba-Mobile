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

const meaningfulPrompts = [
  'Faith is important to me',
  'My ideal partner is...',
  'A tradition I love is...',
  'I feel at peace when...',
  'My family says I am...',
  'A value I live by is...',
  'To me, marriage means...',
  'On weekends I usually...',
  'I learned from love that...',
  'My love language is...',
  "I'm passionate about...",
  'I appreciate when you...',
  "I'm grateful for...",
  'In 5 years, I hope to...',
  'A quote I live by is...',
  'Friends know me as...',
  'My culture taught me...',
  'I pray my partner is...',
  "I'm working on...",
  'Best advice I got was...',
];

const screenHeight = Dimensions.get('window').height;

interface GenderPickerProps {
  fieldName: string;
  selected: string;
  onSelect: (data: string) => void;
}

const PromptSelect = ({fieldName, selected, onSelect}: GenderPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelection, setTempSelection] = useState(
    selected || meaningfulPrompts[0],
  );

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      {/* Touchable input field */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          tailwind`w-full justify-center rounded-2 mt-1`,
          {
            borderColor: themeColors.primary,
            backgroundColor: themeColors.secondary,
          },
        ]}>
        <View style={tailwind``}>
          <Text style={tailwind`italic text-base px-2 pb-1`}>{fieldName}</Text>
        </View>
        <Text
          style={tailwind`text-base text-gray-800 w-full border-2 border-slate-600 rounded-2 px-2 py-2`}>
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
              Select Looking For
            </Text>

            <Picker
              selectedValue={tempSelection}
              onValueChange={itemValue => setTempSelection(itemValue)}
              style={{color: isDarkMode ? '#fff' : '#000'}}>
              {meaningfulPrompts.map(gender => (
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

export default PromptSelect;
