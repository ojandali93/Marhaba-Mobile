import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LikeScreen from '../Screens/LikeScreens/LikeScreen';

const Stack = createNativeStackNavigator();

const LikeStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Like" component={LikeScreen} />
    </Stack.Navigator>
  );
};

export default LikeStackNavigation;
