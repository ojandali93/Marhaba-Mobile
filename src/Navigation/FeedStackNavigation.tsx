import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FeedScreen from '../Screens/HomeScreens/FeedScreen';
import SingleProfileScreen from '../Screens/ProfileScreens/SingleProfileScreen';

const Stack = createNativeStackNavigator();

const FeedStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Feeds" component={FeedScreen} />
      <Stack.Screen name="SingleProfile" component={SingleProfileScreen} />
    </Stack.Navigator>
  );
};

export default FeedStackNavigation;
