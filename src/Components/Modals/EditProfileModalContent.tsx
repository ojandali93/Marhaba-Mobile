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
import EditBackgroundView from '../Views/EditBackgroundView';
import EditIntent from '../Views/EditIntent';
import EditHabits from '../Views/EditHabits';
import EditReligion from '../Views/EditReligion';
import EditCore from '../Views/EditCore';
import EditRelationshipDynamics from '../Views/EditRelationshipDynamics';
import EditFuture from '../Views/EditFuture';
import {useProfile} from '../../Context/ProfileContext';
import EditSocialsView from '../Views/EditSocialsView';

const EditProfileModalContent = ({
  updateTab,
}: {
  updateTab: (tab: string) => void;
}) => {
  const {profile} = useProfile();
  return (
    <View style={tailwind`flex-1 mb-3`}>
      <TouchableOpacity
        onPress={() => updateTab('profile')}
        style={tailwind`w-full flex flex-row items-center mb-3`}>
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
        <EditIntent />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditHabits />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditReligion />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditCore />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditRelationshipDynamics />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditCareetView />
      </View>
      <View style={tailwind`w-full flex flex-col`}>
        <EditFuture />
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
      {profile?.tier === 3 && (
        <View style={tailwind`w-full flex flex-col`}>
          <EditSocialsView />
        </View>
      )}
    </View>
  );
};

export default EditProfileModalContent;
