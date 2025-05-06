import React, {useState} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {
  clearSession,
  clearUserId,
  getProfile,
  getUserId,
} from '../../Services/AuthStoreage';
import {countryFlagMap} from '../../Utils/FlagMaps';
import {ChevronsLeft, ChevronsRight} from 'react-native-feather';
import MenuView from '../../Components/Views/MenuView';
import SettingsView from '../../Components/Views/SettingsView';
import FAQView from '../../Components/Views/FAQView';
import ContactUsView from '../../Components/Views/ContactUsView';
import BugView from '../../Components/Views/BugView';
import TermsView from '../../Components/Views/TermsView';
import PrivacyView from '../../Components/Views/PrivacyView';
import EditProfileModalContent from '../../Components/Modals/EditProfileModalContent';
import UpgradeView from '../../Components/Views/UpgradeView';
import {useProfile} from '../../Context/ProfileContext';
import ViewedView from '../../Components/Views/ViewedView';
import NoticiationsView from '../../Components/Views/NoticiationsView';
import VisbilityViews from '../../Components/Views/VisbilityViews';

const ProfileScreen = () => {
  const {profile} = useProfile();
  if (!profile) {
    // 👇 Optional: render nothing or a loading spinner while navigating away
    return (
      <View
        style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}
      />
    );
  }

  const [activeTab, setActiveTab] = useState('profile');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  function getAgeFromDOB(
    dobString: string | null | undefined,
  ): string | number {
    if (!dobString) return '—';
    try {
      const birthDate = new Date(dobString);
      if (isNaN(birthDate.getTime())) return '—';
      const ageDiff = Date.now() - birthDate.getTime();
      const calculatedAge = Math.floor(
        ageDiff / (1000 * 60 * 60 * 24 * 365.25),
      );
      return calculatedAge > 0 && calculatedAge < 120 ? calculatedAge : '—';
    } catch (e) {
      console.error('Error parsing DOB:', e);
      return '—';
    }
  }

  return (
    <View
      style={[
        tailwind`w-full h-full`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind`absolute flex-1 w-full h-full`}>
        <View style={tailwind`flex-1`}>
          <Image
            source={{uri: profile?.Photos[0].photoUrl}}
            style={[
              tailwind`w-full h-full`,
              {resizeMode: 'cover', alignSelf: 'flex-start'},
            ]}
          />
        </View>
      </View>
      <View
        style={[
          tailwind`absolute left-4 right-4 bottom-6 ${
            activeTab === 'editProfile' ||
            activeTab === 'upgrade' ||
            activeTab === 'Viewed'
              ? 'h-10/12'
              : 'h-5/12'
          } rounded-8`,
          {backgroundColor: themeColors.secondary},
        ]}>
        {activeTab === 'profile' && (
          <>
            <View
              style={tailwind`w-full flex flex-row items-center justify-between px-4 pt-5 pb-3`}>
              <Text
                style={[
                  tailwind`text-3xl font-bold`,
                  {color: themeColors.primary},
                ]}>
                {profile.name} ({getAgeFromDOB(profile.dob)})
              </Text>
              <Text style={tailwind`text-3xl font-semibold`}>
                {countryFlagMap[profile.About[0].background] ?? ''}
              </Text>
            </View>
            <View style={tailwind`px-4`}>
              <Text style={tailwind`text-base text-gray-800`}>
                {profile.height ? `${profile.height} • ` : ''}
                {profile.About[0].religion
                  ? `${profile.About[0].religion}${
                      profile.About[0].sect ? ` (${profile.About[0].sect})` : ''
                    } • `
                  : ''}
                {profile.Career[0].job ?? ''}
              </Text>
            </View>
          </>
        )}
        <ScrollView style={tailwind`flex-1 mt-3 mb-16 px-4`}>
          {activeTab === 'profile' && <MenuView updateTab={setActiveTab} />}
          {activeTab === 'settings' && (
            <SettingsView updateTab={setActiveTab} />
          )}
          {activeTab === 'faq' && <FAQView updateTab={setActiveTab} />}
          {activeTab === 'contact' && (
            <ContactUsView updateTab={setActiveTab} />
          )}
          {activeTab === 'bug' && <BugView updateTab={setActiveTab} />}
          {activeTab === 'terms' && <TermsView updateTab={setActiveTab} />}
          {activeTab === 'privacy' && <PrivacyView updateTab={setActiveTab} />}
          {activeTab === 'editProfile' && (
            <EditProfileModalContent updateTab={setActiveTab} />
          )}
          {activeTab === 'upgrade' && <UpgradeView updateTab={setActiveTab} />}
          {activeTab === 'Viewed' && <ViewedView updateTab={setActiveTab} />}
          {activeTab === 'notifications' && (
            <NoticiationsView updateTab={setActiveTab} />
          )}
          {activeTab === 'visibility' && (
            <VisbilityViews updateTab={setActiveTab} />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;
