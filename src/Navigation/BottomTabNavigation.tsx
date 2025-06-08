// BottomTabNavigation.tsx
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Grid,
  Heart,
  MessageSquare,
  Shield,
  User,
  Users,
  Home,
  FileText,
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
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  const {unViewedInteractions, hasUnreadMessages, userId, profile} =
    useProfile();

  const [isAdmin, setIsAdmin] = useState(false);
  const [incompleteProfile, setIncompleteProfile] = useState(false);

  useEffect(() => {
    if (profile) {
      const optionalTables = [
        'About',
        'Career',
        'Core',
        'Future',
        'Habits',
        'Intent',
        'Notifications',
        'Photos',
        'Prompts',
        'Preferences',
        'Relationships',
        'Religion',
        'Survey',
        'Tags',
        'Social',
      ];

      const hasEmptyTable = optionalTables.some(table => {
        const tableData = profile[table];
        return !Array.isArray(tableData) || tableData.length === 0;
      });

      setIncompleteProfile(hasEmptyTable);
    }
  }, [profile]);

  useEffect(() => {
    if (userId && profile?.admin) {
      setIsAdmin(userId === 'c09a80ce-0af1-4d0c-806c-64ffaf5c8ac5');
    }
  }, [userId, profile]);

  const transparentScreens = []; // No transparent screens used currently

  const getTabBarStyle = route => {
    const focusedRoute = getFocusedRouteNameFromRoute(route) ?? route.name;

    return {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
      height: 76,
      paddingTop: 10,
      backgroundColor: transparentScreens.includes(focusedRoute)
        ? themeColors.darkGrey
        : themeColors.darkSecondary,
    };
  };

  const renderIcon = (IconComponent, focused) => {
    const strokeColor = focused ? themeColors.primary : 'black';

    return (
      <IconComponent
        stroke={strokeColor}
        strokeWidth={focused ? 2.75 : 2}
        height={26}
        width={26}
      />
    );
  };

  const screenOptions = ({route}) => ({
    headerShown: false,
    tabBarStyle: getTabBarStyle(route),
    tabBarShowLabel: false,
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {/* Feed */}
      <Tab.Screen
        name="Feed"
        component={FeedStackNavigation}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <View style={tailwind`items-center`}>
              {renderIcon(Home, focused)}
            </View>
          ),
        })}
      />

      {/* List */}
      <Tab.Screen
        name="List"
        component={LikeStackNavigation}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <View style={tailwind`items-center`}>
              {renderIcon(Users, focused)}
              {unViewedInteractions && (
                <View
                  style={tailwind`absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full`}
                />
              )}
            </View>
          ),
        })}
      />

      {/* Search */}
      <Tab.Screen
        name="Search"
        component={SearchStackNavigation}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <View style={tailwind`items-center`}>
              {renderIcon(Grid, focused)}
            </View>
          ),
        })}
      />

      {/* Conversations */}
      <Tab.Screen
        name="Conversations"
        component={ConversationStackNavigation}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <View style={tailwind`items-center`}>
              {renderIcon(MessageSquare, focused)}
              {hasUnreadMessages && (
                <View
                  style={tailwind`absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full`}
                />
              )}
            </View>
          ),
        })}
      />

      {/* Admin (optional) */}
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminReviewScreen}
          options={({route}) => ({
            tabBarIcon: ({focused}) => (
              <View style={tailwind`items-center`}>
                {renderIcon(Shield, focused)}
              </View>
            ),
          })}
        />
      )}

      {/* Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigation}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <View style={tailwind`items-center`}>
              {renderIcon(User, focused)}
              {incompleteProfile && (
                <View
                  style={tailwind`absolute top-0 right-0 w-2.5 h-2.5 bg-orange-400 rounded-full`}
                />
              )}
            </View>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
