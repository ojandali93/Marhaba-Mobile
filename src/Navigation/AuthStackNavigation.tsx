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
    </Stack.Navigator>
  );
};

export default AuthStack;
