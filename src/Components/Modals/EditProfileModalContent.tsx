import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {ChevronsDown, ChevronsLeft} from 'react-native-feather';
import EditPhotosView from '../Views/EditPhotosView';
import EditProfileView from '../Views/EditProfileView';
import EditEssentialsView from '../Views/EditEssentialsView';
import EditCoreViews from '../Views/EditCoreViews';
import EditLifestyleView from '../Views/EditLifestyleView';
import EditFutureView from '../Views/EditFutureView';
import EditCareetView from '../Views/EditCareetView';
import EditPromptsView from '../Views/EditPromptsView';
import EditTraitsView from '../Views/EditTraitsView';
import EitherOrEditView from '../Views/EitherOrView';

const EditProfileModalContent = ({
  updateTab,
}: {
  updateTab: (tab: string) => void;
}) => {
  return (
    <View style={tailwind`flex-1 mb-3`}>
      <TouchableOpacity
        onPress={() => updateTab('profile')}
        style={tailwind`w-full flex flex-row items-center mb-3 mt-2`}>
        <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        <Text
          style={[
            tailwind`text-2xl font-semibold`,
            {color: themeColors.primary},
          ]}>
          Edit Profile
        </Text>
      </TouchableOpacity>
      <View style={tailwind`w-full flex flex-col`}>
        <EditPhotosView />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditProfileView />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditEssentialsView />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditCoreViews />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditFutureView />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditCareetView />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditPromptsView />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditTraitsView />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EitherOrEditView />
      </View>
    </View>
  );
};

export default EditProfileModalContent;
