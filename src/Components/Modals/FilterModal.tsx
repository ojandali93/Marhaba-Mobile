import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import StandardSelect from '../Select/StandardSelect';
import StandardSelectBorderless from '../Select/StandardSelectBorderless';
import AgeRangeSlider from '../Select/AgeSliderSelect';
import AgeRangeSelectBorderless from '../Select/AgeRangeSelectBorderless';
import BackgroundSelector from '../Select/BackgroundSelector';
import ReligionSelector from '../Select/ReligionSelector';
import SectSelector from '../Select/SectSelector';

const religiousViews = [
  'Very Practicing',
  'Practicing',
  'Somewhat Practicing',
  'Not practicing',
  'Prefer not to say',
];

const drinks = ['Yes', 'No', 'Sometimes', 'Prefer not to say'];
const smokes = ['Yes', 'No', 'Sometimes', 'Prefer not to say'];
const hasKidsOptions = ['Yes', 'No'];
const wantsKidsOptions = ['Yes', 'No'];
const genderOptions = ['Male', 'Female'];

const looking = [
  'Friendship',
  'Connect w/ Community',
  'Something Serious',
  'Marriage',
];

const timelineOptions = [
  'As soon as possible',
  'Within 6–12 months',
  'In 1–2 years',
  'In 3–5 years',
  'Not sure yet',
  'When the time feels right',
];

const distances = [
  'Close (50 miles)',
  'Nearby (100 miles)',
  'Far (150 miles)',
  'Everywhere (500+ miles)',
];

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
  gender: string;
  setGender: (gender: string) => void;
  distance: string;
  setDistance: (distance: string) => void;
  ageRange: [number, number];
  setAgeRange: (range: [number, number]) => void;
  religion: string[];
  setReligion: (religion: string[]) => void;
  background: string[];
  setBackground: (background: string[]) => void;
  sect: string[];
  setSect: (sect: string[]) => void;
  views: string[];
  setViews: (views: string[]) => void;
  smoke: string[];
  setSmoke: (smoke: string[]) => void;
  drink: string[];
  setDrink: (drink: string[]) => void;
  hasKids: string[];
  setHasKids: (hasKids: string[]) => void;
  wantsKids: string[];
  setWantsKids: (wantsKids: string[]) => void;
  lookingFor: string[];
  setLookingFor: (lookingFor: string[]) => void;
  timeline: string[];
  setTimeline: (timeline: string[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onReset,
  onApply,
  gender,
  setGender,
  distance,
  setDistance,
  ageRange,
  setAgeRange,
  religion,
  setReligion,
  background,
  setBackground,
  sect,
  setSect,
  views,
  setViews,
  smoke,
  setSmoke,
  drink,
  setDrink,
  hasKids,
  setHasKids,
  wantsKids,
  setWantsKids,
  lookingFor,
  setLookingFor,
  timeline,
  setTimeline,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={tailwind`flex-1 bg-black bg-opacity-50 justify-end`}>
        <View
          style={[
            tailwind`rounded-t-2xl p-4 h-[85%]`,
            {backgroundColor: themeColors.secondary},
          ]}>
          {/* Header */}
          <View style={tailwind`flex-row justify-between items-center mb-4`}>
            <Text style={tailwind`text-2xl font-bold`}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={tailwind`text-red-500 text-base font-bold`}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Filters */}
          <ScrollView contentContainerStyle={tailwind`pb-20`}>
            <Text style={tailwind`text-gray-600 font-bold text-lg italic mb-3`}>
              Age Range
            </Text>
            <AgeRangeSelectBorderless
              fieldName="ageRange"
              minAge={18}
              maxAge={65}
              ageRange={ageRange}
              setAgeRange={setAgeRange}
            />

            <Text
              style={tailwind`text-gray-600 font-bold text-lg italic mb-3 mt-5`}>
              Distance
            </Text>

            <View style={tailwind`w-full flex-row flex-wrap justify-between`}>
              {distances.map((view, index) => {
                const isSelected = distance.includes(view);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setDistance(view);
                    }}
                    style={[
                      tailwind`px-4 py-2 mb-2 rounded-lg w-full`,
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
                      {view}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={tailwind`text-gray-600 font-bold text-lg italic mb-3 mt-5`}>
              Background (Max 5)
            </Text>
            <View style={tailwind`w-full h-56`}>
              <BackgroundSelector
                options={[]}
                selected={background}
                setSelected={setBackground}
              />
            </View>

            <Text
              style={tailwind`text-gray-600 font-bold text-lg italic mb-3 mt-5`}>
              Religion (Max 2)
            </Text>
            <View style={tailwind`w-full h-42`}>
              <ReligionSelector selected={religion} setSelected={setReligion} />
            </View>

            <Text
              style={tailwind`text-gray-600 font-bold text-base italic mb-2 mt-5`}>
              Sect (Max 2)
            </Text>
            <View style={tailwind`w-full h-42`}>
              <SectSelector selected={sect} setSelected={setSect} />
            </View>
            {/* Add more filters here like background, religion, etc. */}

            <Text
              style={tailwind`text-gray-600 font-bold text-lg italic mb-3 mt-5`}>
              Religious Views (Max 2)
            </Text>

            <View style={tailwind`w-full flex-row flex-wrap justify-between`}>
              {religiousViews.map((view, index) => {
                const isSelected = views.includes(view);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (isSelected) {
                        setViews(views.filter(v => v !== view));
                      } else if (views.length < 2) {
                        setViews([...views, view]);
                      }
                    }}
                    style={[
                      tailwind`px-4 py-2 mb-2 rounded-lg w-[48%]`,
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
                      {view}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={tailwind`text-gray-600 font-bold text-lg italic mb-3 mt-5`}>
              Drinking (Max 2)
            </Text>

            <View style={tailwind`w-full flex-row flex-wrap justify-between`}>
              {drinks.map((view, index) => {
                const isSelected = drink.includes(view);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (isSelected) {
                        setDrink(drink.filter(v => v !== view));
                      } else if (drink.length < 2) {
                        setDrink([...drink, view]);
                      }
                    }}
                    style={[
                      tailwind`px-4 py-2 mb-2 rounded-lg w-[48%]`,
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
                      {view}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={tailwind`text-gray-600 font-bold text-lg italic mb-3 mt-5`}>
              Smoking (Max 2)
            </Text>

            <View style={tailwind`w-full flex-row flex-wrap justify-between`}>
              {smokes.map((view, index) => {
                const isSelected = smoke.includes(view);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (isSelected) {
                        setSmoke(smoke.filter(v => v !== view));
                      } else if (smoke.length < 2) {
                        setSmoke([...smoke, view]);
                      }
                    }}
                    style={[
                      tailwind`px-4 py-2 mb-2 rounded-lg w-[48%]`,
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
                      {view}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={tailwind`text-gray-600 font-bold text-lg italic mb-3 mt-5`}>
              Has Children
            </Text>

            <View style={tailwind`w-full flex-row flex-wrap justify-between`}>
              {hasKidsOptions.map((view, index) => {
                const isSelected = hasKids.includes(view);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (isSelected) {
                        setHasKids(hasKids.filter(v => v !== view));
                      } else if (hasKids.length < 1) {
                        setHasKids([...hasKids, view]);
                      }
                    }}
                    style={[
                      tailwind`px-4 py-2 mb-2 rounded-lg w-[48%]`,
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
                      {view}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={tailwind`text-gray-600 font-bold text-lg italic mb-3 mt-5`}>
              Wants Children
            </Text>

            <View style={tailwind`w-full flex-row flex-wrap justify-between`}>
              {wantsKidsOptions.map((view, index) => {
                const isSelected = wantsKids.includes(view);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (isSelected) {
                        setWantsKids(wantsKids.filter(v => v !== view));
                      } else if (wantsKids.length < 1) {
                        setWantsKids([...wantsKids, view]);
                      }
                    }}
                    style={[
                      tailwind`px-4 py-2 mb-2 rounded-lg  w-[48%]`,
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
                      {view}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={tailwind`text-gray-600 font-bold text-lg italic mb-3 mt-5`}>
              Looking For (Max 2)
            </Text>

            <View style={tailwind`w-full flex-row flex-wrap justify-between`}>
              {looking.map((view, index) => {
                const isSelected = lookingFor.includes(view);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (isSelected) {
                        setLookingFor(lookingFor.filter(v => v !== view));
                      } else if (lookingFor.length < 2) {
                        setLookingFor([...lookingFor, view]);
                      }
                    }}
                    style={[
                      tailwind`px-4 py-2 mb-2 rounded-lg w-full`,
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
                      {view}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={tailwind`text-gray-600 font-bold text-lg italic mb-3 mt-5`}>
              Timeline (Max 2)
            </Text>

            <View style={tailwind`w-full flex-row flex-wrap justify-between`}>
              {timelineOptions.map((view, index) => {
                const isSelected = timeline.includes(view);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (isSelected) {
                        setTimeline(timeline.filter(v => v !== view));
                      } else if (timeline.length < 2) {
                        setTimeline([...timeline, view]);
                      }
                    }}
                    style={[
                      tailwind`px-4 py-2 mb-2 rounded-lg w-full`,
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
                      {view}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View
            style={[
              tailwind`absolute pt-3 bottom-4 left-4 right-4 flex-row justify-between pb-8`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <View />
            {/* <TouchableOpacity
              onPress={onReset}
              style={tailwind`bg-gray-200 px-4 py-2 rounded-lg`}>
              <Text style={tailwind`text-gray-700 font-semibold text-base`}>
                Reset
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={onApply}
              style={[
                tailwind`px-4 py-2 rounded-lg`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Text style={tailwind`text-white font-semibold text-base`}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
