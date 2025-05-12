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
import {ScrollView} from 'react-native-gesture-handler';

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
  options: string[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  maxSelect?: number;
}

const BackgroundSelect = ({
  fieldName,
  options,
  selected,
  setSelected,
  maxSelect = 2,
}: GenderPickerProps) => {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(item => item !== value));
    } else if (selected.length < maxSelect) {
      setSelected([...selected, value]);
    }
  };

  return (
    <>
      {/* Touchable input field */}
      <View
        style={[
          tailwind`w-full justify-center`,
          {
            borderColor: themeColors.primary,
            backgroundColor: themeColors.secondary,
            marginTop: screenHeight * 0.015,
          },
        ]}>
        <View style={tailwind``}>
          <Text style={tailwind`italic text-base px-2`}>
            {fieldName} <Text style={tailwind`text-red-500`}>*</Text>
          </Text>
        </View>

        {/* Display selected gender */}
        <ScrollView style={tailwind`w-full h-56 border-2 rounded-2 mt-1`}>
          <View style={tailwind`w-full flex flex-row items-center p-2`}>
            <View style={tailwind`flex-row flex-wrap`}>
              {background.map((country, index) => {
                const isSelected = selected.includes(country);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      handleToggle(country);
                    }}
                    style={[
                      tailwind`px-2 py-1 m-1 rounded-full border`,
                      {
                        backgroundColor: isSelected
                          ? themeColors.primary
                          : themeColors.secondary,
                        borderColor: themeColors.primary,
                      },
                    ]}>
                    <Text
                      style={[
                        tailwind`text-base font-semibold`,
                        {
                          color: isSelected ? 'white' : themeColors.primary,
                        },
                      ]}>
                      {country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default BackgroundSelect;
