import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Grid,
  Heart,
  Home,
  MessageSquare,
  Search,
  Shield,
  User,
  Zap,
} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../Utils/custonColors';

import FeedStackNavigation from './FeedStackNavigation';
import ProfileStackNavigation from './ProfileStackNavigation';
import LikeStackNavigation from './LikeStackNavigation';
import ConversationStackNavigation from './ConversationStackNavigation';
import SearchStackNavigation from './SearchStackNavigation';
import AdminReviewScreen from '../Screens/HomeScreens/AdminReviewScreen';
import {useProfile} from '../Context/ProfileContext';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  const {unViewedInteractions, hasUnreadMessages, userId, profile} =
    useProfile();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (userId && profile) {
      const adminCheck =
        userId === '831a043d-ff7f-4d1a-81e5-86ddd48cfda8' &&
        profile?.admin === true;
      setIsAdmin(adminCheck);
    }
  }, [userId, profile]);

  const getTabBarStyle = routeName => {
    const transparentScreens = ['Feeds', 'List', 'Searchs'];
    const isTransparent = transparentScreens.includes(routeName);

    return {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopWidth: 0,
      backgroundColor: isTransparent
        ? 'rgba(0, 0, 0, 0.5)'
        : themeColors.secondary,
      elevation: 0,
      shadowOpacity: 0,
      height: 76,
      paddingTop: 10,
    };
  };

  const screenOptions = ({route}) => ({
    headerShown: false,
    tabBarStyle: getTabBarStyle(route.name),
    tabBarShowLabel: false,
    tabBarActiveTintColor: themeColors.primary,
    tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Feeds"
        component={FeedStackNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={tailwind`items-center`}>
              <Grid
                stroke={focused ? themeColors.primary : 'rgba(255,255,255,0.5)'}
                strokeWidth={2.5}
                height={26}
                width={26}
              />
              {unViewedInteractions && (
                <View
                  style={tailwind`absolute top--.25 right--1 w-2.5 h-2.5 bg-red-500 rounded-full`}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="List"
        component={LikeStackNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={tailwind`items-center`}>
              <Heart
                stroke={focused ? themeColors.primary : 'rgba(255,255,255,0.5)'}
                strokeWidth={2.5}
                height={26}
                width={26}
              />
              {unViewedInteractions && (
                <View
                  style={tailwind`absolute top--.25 right--1 w-2.5 h-2.5 bg-red-500 rounded-full`}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Searchs"
        component={SearchStackNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={tailwind`items-center`}>
              <Zap
                stroke={focused ? themeColors.primary : 'rgba(255,255,255,0.5)'}
                strokeWidth={2.5}
                height={26}
                width={26}
              />
              {unViewedInteractions && (
                <View
                  style={tailwind`absolute top--.25 right--1 w-2.5 h-2.5 bg-red-500 rounded-full`}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Conversations"
        component={ConversationStackNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={tailwind`items-center`}>
              <MessageSquare
                stroke={focused ? themeColors.primary : 'rgba(255,255,255,0.5)'}
                strokeWidth={2.5}
                height={26}
                width={26}
              />
              {hasUnreadMessages && (
                <View
                  style={tailwind`absolute top--.75 right--1 w-2.5 h-2.5 bg-red-500 rounded-full`}
                />
              )}
            </View>
          ),
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminReviewScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={tailwind`items-center`}>
                <Shield
                  stroke={
                    focused ? themeColors.primary : 'rgba(255,255,255,0.5)'
                  }
                  strokeWidth={2.5}
                  height={26}
                  width={26}
                />
                {unViewedInteractions && (
                  <View
                    style={tailwind`absolute top--.25 right--1 w-2.5 h-2.5 bg-red-500 rounded-full`}
                  />
                )}
              </View>
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Profiles"
        component={ProfileStackNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={tailwind`items-center`}>
              <User
                stroke={focused ? themeColors.primary : 'rgba(255,255,255,0.5)'}
                strokeWidth={2.5}
                height={26}
                width={26}
              />
              {unViewedInteractions && (
                <View
                  style={tailwind`absolute top--.25 right--1 w-2.5 h-2.5 bg-red-500 rounded-full`}
                />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
