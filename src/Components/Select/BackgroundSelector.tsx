import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface BackgroundSelectorProps {
  options: string[];
  selected: string[];
  setSelected: (updated: string[]) => void;
  maxSelect?: number;
}

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

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  options,
  selected,
  setSelected,
  maxSelect = 5,
}) => {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(item => item !== value));
    } else if (selected.length < maxSelect) {
      setSelected([...selected, value]);
    }
  };

  return (
    <ScrollView
      style={tailwind`h-full`}
      contentContainerStyle={tailwind``}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={true}>
      <View style={tailwind`flex flex-col`}>
        {background.map((option, index) => {
          const isSelected = selected.includes(option);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleToggle(option)}
              style={[
                tailwind`px-4 py-2 mb-2 rounded-lg`,
                {
                  backgroundColor: isSelected
                    ? themeColors.primary
                    : themeColors.secondaryHighlight,
                  borderColor: isSelected ? themeColors.primary : '#ccc',
                },
              ]}>
              <Text
                style={tailwind`text-base font-medium ${
                  isSelected ? 'text-white' : 'text-gray-800'
                }`}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default BackgroundSelector;
