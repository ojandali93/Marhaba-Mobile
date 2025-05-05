import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import {Heart, Home, MessageSquare, Search, User, Zap} from 'react-native-feather';
import HomeScreen from '../Screens/HomeScreen';
import tailwind from 'twrnc';
import themeColors from '../Utils/custonColors';
import FeedStackNavigation from './FeedStackNavigation';
import ProfileScreen from '../Screens/ProfileScreens/ProfileScreen';
import LikeStackNavigation from './LikeStackNavigation';
import ConversationStackNavigation from './ConversationStackNavigation';
import ProfileStackNavigation from './ProfileStackNavigation';
import SearchStackNavigation from './SearchStackNavigation';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            borderRadius: 30,
            height: 60,
            backgroundColor: themeColors.darkSecondary,
            paddingBottom: 10,
            paddingTop: 10,
            marginBottom: 8,
            marginLeft: 18,
            marginRight: 18,
            shadowColor: themeColors.primary,
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 10,
          },
        }}>
        <Tab.Screen
          name="Feeds"
          component={FeedStackNavigation}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
              <View style={tailwind`items-center`}>
                <Home
                  stroke={focused ? themeColors.primary : 'black'}
                  strokeWidth={2}
                  height={26}
                  width={26}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="List"
          component={LikeStackNavigation}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
              <View style={tailwind`items-center`}>
                <Heart
                  stroke={focused ? themeColors.primary : 'black'}
                  strokeWidth={2}
                  height={26}
                  width={26}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Searchs"
          component={SearchStackNavigation}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
              <View style={tailwind`items-center`}>
                <Zap
                  stroke={focused ? themeColors.primary : 'black'}
                  strokeWidth={2}
                  height={26}
                  width={26}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Conversations"
          component={ConversationStackNavigation}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
              <View style={tailwind`items-center`}>
                <MessageSquare
                  stroke={focused ? themeColors.primary : 'black'}
                  strokeWidth={2}
                  height={26}
                  width={26}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profiles"
          component={ProfileStackNavigation}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
              <View style={tailwind`items-center`}>
                <User
                  stroke={focused ? themeColors.primary : 'black'}
                  strokeWidth={2}
                  height={26}
                  width={26}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default BottomTabNavigation;
