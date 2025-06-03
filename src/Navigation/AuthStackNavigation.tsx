import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Auth/LoginScreen';
import SignupScreen from '../Screens/Auth/SignupScreen';
import IdentityScreen from '../Screens/Auth/IdentityScreen';
import PersonalityScreen from '../Screens/Auth/PersonalityScreen';
import CareerScreen from '../Screens/Auth/CareerScreen';
import PhotosScreen from '../Screens/Auth/PhotosScreen';
import PreferencesScreen from '../Screens/Auth/PreferencesScreen';
import IdentitySecondScreen from '../Screens/Auth/IdentitySecondScreen';
import NotificationScreen from '../Screens/Auth/NotificationScreen';
import HobbiesAndTraitsScreen from '../Screens/Auth/HobbiesAndTraitsScreen';
import CreatingProfileScreen from '../Screens/Auth/CreatingProfileScreen';
import QuestionsScreen from '../Screens/Auth/QuestionsScreen';
import IdentityThirdScreen from '../Screens/Auth/IdentityThirdScreen';
import CoreScreen from '../Screens/Auth/CoreScreen';
import ConflictScreen from '../Screens/Auth/ConflictScreen';
import AttachmentScreen from '../Screens/Auth/AttachmentScreen';
import LifestyleScreen from '../Screens/Auth/LifestyleScreen';
import FutureScreen from '../Screens/Auth/FutureScreen';
import AcceptScreen from '../Screens/Auth/AcceptScreen';
import ForgotPasswordScreen from '../Screens/Auth/ForgotPasswordScreen';
import BackgroundScreen from '../Screens/Auth/BackgroundScreen';
import LookingForScreen from '../Screens/Auth/LookingForScreen';
import LifestyleHabitsScreen from '../Screens/Auth/LifestyleHabitsScreen';
import ReligionScreen from '../Screens/Auth/ReligionScreen';
import EulaScreen from '../Screens/Auth/EULAScreen';
import CommunityScreen from '../Screens/Auth/CommunityScreen';
import T1Prompts from '../Screens/Auth/T1Prompts';
import AboutMeScreen from '../Screens/Auth/AboutMeScreen';
import T2Prompts from '../Screens/Auth/T2Prompts';
import T3Prompts from '../Screens/Auth/T3Prompts';
import T4Prompts from '../Screens/Auth/T4Prompts';
import VideoScreen from '../Screens/Auth/VideoScreen';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Personality" component={PersonalityScreen} />
      <Stack.Screen name="Identity" component={IdentityScreen} />
      <Stack.Screen name="IdentitySecond" component={IdentitySecondScreen} />
      <Stack.Screen name="Career" component={CareerScreen} />
      <Stack.Screen name="Photos" component={PhotosScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Hobbies" component={HobbiesAndTraitsScreen} />
      <Stack.Screen name="CreatingProfile" component={CreatingProfileScreen} />
      <Stack.Screen name="Questions" component={QuestionsScreen} />
      <Stack.Screen name="IdentityThird" component={IdentityThirdScreen} />
      <Stack.Screen name="Core" component={CoreScreen} />
      <Stack.Screen name="Conflict" component={ConflictScreen} />
      <Stack.Screen name="Attachment" component={AttachmentScreen} />
      <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
      <Stack.Screen name="Future" component={FutureScreen} />
      <Stack.Screen name="Accept" component={AcceptScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Background" component={BackgroundScreen} />
      <Stack.Screen name="LookingFor" component={LookingForScreen} />
      <Stack.Screen name="LifestyleHabits" component={LifestyleHabitsScreen} />
      <Stack.Screen name="Religion" component={ReligionScreen} />
      <Stack.Screen name="Eula" component={EulaScreen} />
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="T0Prompts" component={AboutMeScreen} />
      <Stack.Screen name="T1Prompts" component={T1Prompts} />
      <Stack.Screen name="T2Prompts" component={T2Prompts} />
      <Stack.Screen name="T3Prompts" component={T3Prompts} />
      <Stack.Screen name="T4Prompts" component={T4Prompts} />
      <Stack.Screen name="Video" component={VideoScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
