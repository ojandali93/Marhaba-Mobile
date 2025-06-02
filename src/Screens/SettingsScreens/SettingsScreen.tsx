import React, {useState} from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import tailwind from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import SettingsView from '../../Components/Views/SettingsView';
import FAQView from '../../Components/Views/FAQView';
import ContactUsView from '../../Components/Views/ContactUsView';
import BugView from '../../Components/Views/BugView';
import TermsView from '../../Components/Views/TermsView';
import PrivacyView from '../../Components/Views/PrivacyView';
import ProSettingsView from '../../Components/Views/ProSettingsView';
import NoticiationsView from '../../Components/Views/NoticiationsView';
import VisbilityViews from '../../Components/Views/VisbilityViews';
import BlockedUserViews from '../../Components/Views/BlockedUserViews';
import EditProfileModalContent from '../../Components/Modals/EditProfileModalContent';
import MenuView from '../../Components/Views/MenuView';
import UpgradeView from '../../Components/Views/UpgradeView';
import ViewedView from '../../Components/Views/ViewedView';
import themeColors from '../../Utils/custonColors';
import {ChevronsLeft} from 'react-native-feather';
const SettingsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('profile');

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
        <Text style={tailwind`text-2xl font-bold text-gray-800`}>Settings</Text>
      </View>
      <ScrollView style={tailwind`flex-1 mb-8`}>
        {activeTab === 'profile' && <MenuView updateTab={setActiveTab} />}
        {activeTab === 'editProfile' && (
          <EditProfileModalContent updateTab={setActiveTab} />
        )}
        {activeTab === 'upgrade' && <UpgradeView updateTab={setActiveTab} />}
        {activeTab === 'Viewed' && <ViewedView updateTab={setActiveTab} />}
        {activeTab === 'settings' && <SettingsView updateTab={setActiveTab} />}
        {activeTab === 'faq' && <FAQView updateTab={setActiveTab} />}
        {activeTab === 'contact' && <ContactUsView updateTab={setActiveTab} />}
        {activeTab === 'bug' && <BugView updateTab={setActiveTab} />}
        {activeTab === 'terms' && <TermsView updateTab={setActiveTab} />}
        {activeTab === 'privacy' && <PrivacyView updateTab={setActiveTab} />}
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
  );
};

export default SettingsScreen;
