import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Conversations from '../Screens/MessageScreens/Conversations';
import ChatScreen from '../Screens/MessageScreens/ChatScreen';

const Stack = createNativeStackNavigator();

const ConversationStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Conversations" component={Conversations} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default ConversationStackNavigation;
