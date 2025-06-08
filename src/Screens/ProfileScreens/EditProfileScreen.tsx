import React from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import tailwind from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {ChevronsLeft} from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import EditPhotosView from '../../Components/Views/EditPhotosView';
import EditProfileView from '../../Components/Views/EditProfileView';
import EditIntent from '../../Components/Views/EditIntent';
import EditHabits from '../../Components/Views/EditHabits';
import EditReligion from '../../Components/Views/EditReligion';
import EditCore from '../../Components/Views/EditCore';
import EditRelationshipDynamics from '../../Components/Views/EditRelationshipDynamics';
import EditCareetView from '../../Components/Views/EditCareetView';
import EditFuture from '../../Components/Views/EditFuture';
import EditPromptsView from '../../Components/Views/EditPromptsView';
import EditTraitsView from '../../Components/Views/EditTraitsView';
import EitherOrEditView from '../../Components/Views/EitherOrView';
import EditSocialsView from '../../Components/Views/EditSocialsView';
import {useProfile} from '../../Context/ProfileContext';
import EditVideoView from '../../Components/Views/EditVideoView';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const {profile} = useProfile();

  return (
    <View style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <View
        style={[
          tailwind`w-full flex-row items-center pr-4 pl-2 py-2 rounded-2 mb-3 mt-14`,
          {backgroundColor: themeColors.secondary},
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronsLeft height={24} width={24} color={'black'} />
        </TouchableOpacity>
        <Text style={tailwind`text-2xl font-bold text-gray-800`}>
          Edit Profile
        </Text>
      </View>
      <ScrollView style={tailwind`flex-1 mb-8`}>
        <View style={tailwind`w-full flex flex-col`}>
          <EditPhotosView />
        </View>
        <View style={tailwind`w-full flex flex-col`}>
          <EditVideoView />
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
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;
