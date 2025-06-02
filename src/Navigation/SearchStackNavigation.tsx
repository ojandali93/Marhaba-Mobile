import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FeedScreen from '../Screens/HomeScreens/FeedScreen';
import SearchScreent from '../Screens/SearchScreens/SearchScreent';
import SingleProfileScreen from '../Screens/ProfileScreens/SingleProfileScreen';

const Stack = createNativeStackNavigator();

const SearchStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Search" component={SearchScreent} />
      <Stack.Screen
        name="SingleProfileSearch"
        component={SingleProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default SearchStackNavigation;
