import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LikeScreen from '../Screens/LikeScreens/LikeScreen';
import SingleProfileScreen from '../Screens/ProfileScreens/SingleProfileScreen';

const Stack = createNativeStackNavigator();

const LikeStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Like" component={LikeScreen} />
      <Stack.Screen name="SingleProfile" component={SingleProfileScreen} />
    </Stack.Navigator>
  );
};

export default LikeStackNavigation;
