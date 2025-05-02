import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../Context/ProfileContext';
interface Profile {
  _id: string;
  name?: string;
  Photos?: { photoUrl: string }[];
}

interface Conversation {
  id: string | number;
  user1Id: string;
  profile1: Profile;
  profile2: Profile;
  lastMessage?: string;
  updated_at: string;
}

const { width } = Dimensions.get('window');

const Conversations = () => {
  const {userId} = useProfile();
    const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
        grabConversations();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    grabConversations();
  }, []);

  const grabConversations = async () => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      if (isRefreshing) setIsRefreshing(false);
      return;
    }
    setError(null);

    try {
      const response = await axios.get<{ data: Conversation[] }>(
        `https://marhaba-server.onrender.com/api/conversation/${userId}`,
        { headers: { 'Cache-Control': 'no-cache' } }
      );

      if (response.data?.data.length > 0) {
        setConversations(response.data?.data);
      } else {
        console.warn('No conversations found or invalid data format:', response.data);
        setConversations([]);
      }
    } catch (error) {
      console.error('❌ Error grabbing conversations:', error);
      setError("Failed to load conversations.");
      setConversations([]);
    } finally {
      setLoading(false);
      if (isRefreshing) setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const messageDate = new Date(timestamp);
    const now = new Date();

    const isSameDay = (d1: Date, d2: Date): boolean => {
      return d1.getFullYear() === d2.getFullYear() &&
             d1.getMonth() === d2.getMonth() &&
             d1.getDate() === d2.getDate();
    };

    if (isSameDay(messageDate, now)) {
      return messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'numeric', day: 'numeric' }) +
             ' ' +
             messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const otherProfile = item.user1Id === userId ? item.profile2 : item.profile1;

    if (!otherProfile) return null;

    const photoUrl = otherProfile.Photos?.[0]?.photoUrl;
    const name = otherProfile.name || 'User';
    const lastMessage = item.lastMessage;
    const displayTime = formatTimestamp(item.updated_at);

    return (
      <TouchableOpacity
        style={[tailwind`flex-row items-center px-4 py-3 border-b border-gray-400`, {backgroundColor: themeColors.secondary}]}
        onPress={() => {
            console.log("Navigate to chat:", item.id);
            navigation.navigate('Chat', { conversation: item });
        }}>
        <Image
           source={{ uri: photoUrl }}
           style={tailwind`w-14 h-14 rounded-full mr-3 bg-gray-200`}
        />
        <View style={tailwind`flex-1 mr-2`}>
          <Text style={tailwind`text-base font-semibold text-gray-800`} numberOfLines={1}>{name}</Text>
          <Text style={tailwind`text-sm text-gray-500`} numberOfLines={1}>
            {lastMessage || 'No messages yet'}
          </Text>
        </View>
        <Text style={tailwind`text-xs text-gray-400 self-start mt-1`}>{displayTime}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <View style={[tailwind`px-4 py-3 border-b border-gray-700`, {backgroundColor: themeColors.darkSecondary}]}>
        <Text style={tailwind`text-2xl font-bold text-gray-800`}>Conversations</Text>
      </View>
      <View style={tailwind`flex-1`}>
            { loading ? (
                <View style={tailwind`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color={themeColors.primary} />
                 </View>
            ) : error && !isRefreshing ? (
                 <View style={tailwind`flex-1 justify-center items-center p-5`}>
                     <Text style={tailwind`text-red-500 text-center mb-4`}>{error}</Text>
                     <TouchableOpacity onPress={() => grabConversations(false)} style={tailwind`px-4 py-2 bg-gray-200 rounded`}>
                        <Text>Try Again</Text>
                     </TouchableOpacity>
                 </View>
            ) : conversations.length === 0 && !isRefreshing ? (
                 <ScrollView
                     contentContainerStyle={tailwind`flex-1 justify-center items-center p-5`}
                     refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={themeColors.primary} />
                     }
                 >
                    <Text style={tailwind`text-lg text-gray-500 text-center`}>No conversations yet.</Text>
                    <Text style={tailwind`text-gray-400 text-center mt-1`}>Start matching to chat!</Text>
                 </ScrollView>
            ) : (
                 <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderConversation}
                    refreshControl={
                      <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={themeColors.primary} colors={[themeColors.primary]} />
                    }
                    contentContainerStyle={tailwind`pb-4`}
                    ItemSeparatorComponent={() => <View style={tailwind`h-px bg-gray-200 ml-20`} />}
                />
            )}
        </View>
    </SafeAreaView>
  );
};

export default Conversations;
