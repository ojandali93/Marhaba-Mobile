import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Conversations from '../Screens/MessageScreens/Conversations';
import ChatScreen from '../Screens/MessageScreens/ChatScreen';
import SingleProfileScreen from '../Screens/ProfileScreens/SingleProfileScreen';

const Stack = createNativeStackNavigator();

const ConversationStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Conversation" component={Conversations} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="SingleProfile" component={SingleProfileScreen} />
    </Stack.Navigator>
  );
};

export default ConversationStackNavigation;
