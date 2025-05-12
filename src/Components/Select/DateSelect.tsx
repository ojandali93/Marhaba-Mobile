import React, {useState} from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {Picker} from '@react-native-picker/picker';
import {useColorScheme} from 'react-native';

const screenHeight = Dimensions.get('window').height;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({length: 100}, (_, i) => currentYear - i);
};

const getDays = (month: number, year: number) => {
  return Array.from(
    {length: new Date(year, month + 1, 0).getDate()},
    (_, i) => i + 1,
  );
};

interface InputProps {
  fieldName: string;
  dob: Date;
  setDate: (date: Date) => void;
}

const DateSelect: React.FC<InputProps> = ({fieldName, dob, setDate}) => {
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme();

  const defaultDate = dob || new Date(2000, 0, 1);

  const [day, setDay] = useState(defaultDate.getDate());
  const [month, setMonth] = useState(defaultDate.getMonth());
  const [year, setYear] = useState(defaultDate.getFullYear());

  const confirmDate = () => {
    setOpen(false);
    setDate(new Date(year, month, day));
  };

  return (
    <>
      <View
        style={[
          tailwind`w-full h-14 flex justify-center rounded-2 mt-3`,
          {
            backgroundColor: themeColors.secondary,
          },
        ]}>
        <View style={tailwind``}>
          <Text style={tailwind`italic text-base px-2 pb-1`}>
            {fieldName}
            <Text style={tailwind`text-red-500`}> * </Text>
          </Text>
        </View>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Text
            style={tailwind`text-base text-gray-700 border-2 border-slate-600 rounded-2 px-2 py-2`}>
            {dob
              ? dob.toDateString().split(' ').slice(1).join(' ')
              : 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={open} animationType="slide" transparent>
        <View style={tailwind`flex-1 justify-end bg-black bg-opacity-30`}>
          <View
            style={[
              tailwind`rounded-xl p-4 pb-6 mx-4 mb-10`,
              {
                backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff',
              },
            ]}>
            <Text
              style={[
                tailwind`text-center font-semibold text-lg mb-4`,
                {color: colorScheme === 'dark' ? '#fff' : '#000'},
              ]}>
              Select Date of Birth
            </Text>

            <View style={tailwind`flex-row justify-between`}>
              <Picker
                selectedValue={month}
                onValueChange={setMonth}
                style={{
                  flex: 1,
                  color: colorScheme === 'dark' ? '#fff' : '#000',
                }}>
                {months.map((m, idx) => (
                  <Picker.Item label={m} value={idx} key={m} />
                ))}
              </Picker>
              <Picker
                selectedValue={day}
                onValueChange={setDay}
                style={{
                  flex: 1,
                  color: colorScheme === 'dark' ? '#fff' : '#000',
                }}>
                {getDays(month, year).map(d => (
                  <Picker.Item label={`${d}`} value={d} key={d} />
                ))}
              </Picker>
              <Picker
                selectedValue={year}
                onValueChange={setYear}
                style={{
                  flex: 1,
                  color: colorScheme === 'dark' ? '#fff' : '#000',
                }}>
                {getYears().map(y => (
                  <Picker.Item label={`${y}`} value={y} key={y} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              onPress={confirmDate}
              style={[
                tailwind`mt-4 py-4 rounded-2`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Text style={tailwind`text-center text-white text-base`}>
                Confirm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={tailwind`mt-2`}>
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

export default DateSelect;
