import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SingleProfileScreen from '../Screens/ProfileScreens/SingleProfileScreen';
import ProfileScreen from '../Screens/ProfileScreens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreens/SettingsScreen';
import EditProfileScreen from '../Screens/ProfileScreens/EditProfileScreen';
import SubSettingsScreen from '../Screens/ProfileScreens/SubSettingsScreen';
import UpgradeTiersScreen from '../Screens/ProfileScreens/UpgradeTiersScreen';
import VisibilityScreen from '../Screens/ProfileScreens/VisibilityScreen';
import NotificationsScreen from '../Screens/ProfileScreens/NotiifcationScreen';
import ViewedScreen from '../Screens/ProfileScreens/ViewedScreen';
import BlockedUserScreen from '../Screens/ProfileScreens/BlockedUserScreen';
import FAQScreen from '../Screens/ProfileScreens/FAQScreen';
import ContactUsScreen from '../Screens/ProfileScreens/ContactUsScreen';
import ReportBugScreen from '../Screens/ProfileScreens/ReportBugScreen';

const Stack = createNativeStackNavigator();

const ProfileStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profiles" component={ProfileScreen} />
      <Stack.Screen name="SingleProfile" component={SingleProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="SubSettings" component={SubSettingsScreen} />
      <Stack.Screen name="UpgradeTiers" component={UpgradeTiersScreen} />
      <Stack.Screen name="Visibility" component={VisibilityScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Viewed" component={ViewedScreen} />
      <Stack.Screen name="BlockedUsers" component={BlockedUserScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="ReportBug" component={ReportBugScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigation;
