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

const background = [
  // 🌍 Middle Eastern countries (in region-specific order)
  'Bahrain',
  'Cyprus',
  'Egypt',
  'Iran',
  'Iraq',
  'Israel',
  'Jordan',
  'Kuwait',
  'Lebanon',
  'Oman',
  'Palestine',
  'Qatar',
  'Saudi Arabia',
  'Syria',
  'Turkey',
  'United Arab Emirates',
  'Yemen',

  // 🌍 All other countries (alphabetical)
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Brazzaville)',
  'Congo (Kinshasa)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Ireland',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, North',
  'Korea, South',
  'Kosovo',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Macedonia',
  'Norway',
  'Pakistan',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'São Tomé and Príncipe',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Zambia',
  'Zimbabwe',
];

const screenHeight = Dimensions.get('window').height;

interface GenderPickerProps {
  fieldName: string;
  selected: string;
  onSelect: (gender: string) => void;
}

const BackgroundSelect = ({
  fieldName,
  selected,
  onSelect,
}: GenderPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelection, setTempSelection] = useState(selected || background[0]);

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
            {fieldName}
          </Text>
        </View>

        {/* Display selected gender */}
        <Text style={tailwind`text-base text-gray-800`}>
          {selected || 'Select Background'}
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
              Select Background
            </Text>

            <Picker
              selectedValue={tempSelection}
              onValueChange={itemValue => setTempSelection(itemValue)}
              style={{color: isDarkMode ? '#fff' : '#000'}}>
              {background.map(gender => (
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

export default BackgroundSelect;
