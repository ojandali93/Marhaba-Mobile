import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SocialScreen from '../Screens/SocialScreens/SocialScreen';
import EventScreen from '../Screens/SocialScreens/EventScreen';
import SingleProfileScreenLike from '../Screens/ProfileScreens/SingleProfileScreenLike';
const Stack = createNativeStackNavigator();

const SocialStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Social" component={SocialScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="SingleProfile" component={SingleProfileScreenLike} />
    </Stack.Navigator>
  );
};

export default SocialStackNavigation;
