import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LikeScreen from '../Screens/LikeScreens/LikeScreen';
import SingleProfileScreen from '../Screens/ProfileScreens/SingleProfileScreen';
import ProfileScreen from '../Screens/ProfileScreens/ProfileScreen';

const Stack = createNativeStackNavigator();

const ProfileStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SingleProfile" component={SingleProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigation;
