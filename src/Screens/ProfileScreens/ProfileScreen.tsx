import React, {useState} from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
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
import BlockedUserViews from '../../Components/Views/BlockedUserViews';
import ProSettingsView from '../../Components/Views/ProSettingsView';

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
    <SafeAreaView
      style={[
        tailwind`w-full h-full`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <View style={tailwind``}>
        <View style={tailwind`w-full h-42`}>
          <ScrollView
            style={tailwind`flex-1 p-2`}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {profile.Photos.map((photo, index) => (
              <Image
                key={index}
                source={{uri: photo.photoUrl}}
                style={tailwind`h-full w-24 rounded-3 mr-2`}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={tailwind`flex-1 p-2`}>
        {activeTab === 'profile' && (
          <>
            <View
              style={tailwind`w-full flex flex-row items-center justify-between`}>
              <Text
                style={[
                  tailwind`text-3xl font-bold`,
                  {color: themeColors.primary},
                ]}>
                {profile.name} ({getAgeFromDOB(profile.About[0].dob)})
              </Text>
              <Text style={tailwind`text-3xl font-semibold`}>
                {countryFlagMap[profile.About[0].background] ?? ''}
              </Text>
            </View>
            <View style={tailwind``}>
              <Text style={tailwind`text-base`}>
                {profile?.About?.[0]?.height
                  ? `${profile.About[0].height} • `
                  : ''}
                {profile?.Religion?.length > 0 && profile.Religion[0].religion
                  ? `${profile.Religion[0].religion}${
                      profile.Religion[0].sect
                        ? ` (${profile.Religion[0].sect})`
                        : ''
                    } • `
                  : ''}
                {profile?.Career?.length > 0 ? profile.Career[0].job : ''}
              </Text>
            </View>
          </>
        )}
        <ScrollView style={tailwind`flex-1 mb-8`}>
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
          {activeTab === 'proSettings' && (
            <ProSettingsView updateTab={setActiveTab} />
          )}
          {activeTab === 'notifications' && (
            <NoticiationsView updateTab={setActiveTab} />
          )}
          {activeTab === 'visibility' && (
            <VisbilityViews updateTab={setActiveTab} />
          )}
          {activeTab === 'blockedUsers' && (
            <BlockedUserViews updateTab={setActiveTab} />
          )}
        </ScrollView>
      </View>
      {/* <View
        style={[
          tailwind`absolute left-0 right-0 bottom-19 rounded-t-2 ${
            activeTab === 'editProfile' ||
            activeTab === 'upgrade' ||
            activeTab === 'Viewed' ||
            activeTab === 'visibility'
              ? 'h-10/12'
              : 'h-5/12'
          }`,
          {backgroundColor: themeColors.darkGrey},
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
                {profile.name} ({getAgeFromDOB(profile.About[0].dob)})
              </Text>
              <Text style={tailwind`text-3xl font-semibold`}>
                {countryFlagMap[profile.About[0].background] ?? ''}
              </Text>
            </View>
            <View style={tailwind`px-4`}>
              <Text style={tailwind`text-base text-white`}>
                {profile?.About?.[0]?.height
                  ? `${profile.About[0].height} • `
                  : ''}
                {profile?.Religion?.length > 0 && profile.Religion[0].religion
                  ? `${profile.Religion[0].religion}${
                      profile.Religion[0].sect
                        ? ` (${profile.Religion[0].sect})`
                        : ''
                    } • `
                  : ''}
                {profile?.Career?.length > 0 ? profile.Career[0].job : ''}
              </Text>
            </View>
          </>
        )}
        <ScrollView style={tailwind`flex-1 mt-3 mb-4 px-4`}>
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
          {activeTab === 'proSettings' && (
            <ProSettingsView updateTab={setActiveTab} />
          )}
          {activeTab === 'notifications' && (
            <NoticiationsView updateTab={setActiveTab} />
          )}
          {activeTab === 'visibility' && (
            <VisbilityViews updateTab={setActiveTab} />
          )}
          {activeTab === 'blockedUsers' && (
            <BlockedUserViews updateTab={setActiveTab} />
          )}
          <View style={tailwind`w-full flex flex-row justify-center mt-3`}>
            <Text style={tailwind`text-sm font-semibold text-white`}>
              Marhabah Inc. © 2025 All Rights Reserved.
            </Text>
          </View>
          <View style={tailwind`w-full flex flex-row justify-center mb-3`}>
            <Text style={tailwind`text-sm font-semibold text-white`}>
              V. 1.0.1 (May 12, 2025)
            </Text>
          </View>
        </ScrollView>
      </View> */}
    </SafeAreaView>
  );
};

export default ProfileScreen;
