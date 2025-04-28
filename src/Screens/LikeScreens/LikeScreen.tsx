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
import { Heart } from 'react-native-feather';

import { getUserId } from '../../Services/AuthStoreage';
import themeColors from '../../Utils/custonColors';
import { useFocusEffect } from '@react-navigation/native';

interface Interaction {
  _id: string;
  liker: {
    _id: string;
    name?: string;
    Photos?: { photoUrl: string }[];
  };
  interaction: 'liked' | 'superliked';
}

interface ProcessedInteraction extends Interaction {
  isSuperLike: boolean;
}

const { width } = Dimensions.get('window');
const itemPadding = 8;
const numColumns = 3;
const imageSize = (width - itemPadding * (numColumns + 1)) / numColumns;

const LikeScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [interactions, setInteractions] = useState<ProcessedInteraction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = useCallback(async (refreshing = false) => {
    if (!refreshing) {
      setLoading(true);
    }
    setError(null);
    const userId = getUserId();
    if (!userId) {
      setError('User ID not found. Please log in again.');
      setLoading(false);
      if (refreshing) setIsRefreshing(false);
      return;
    }

    try {
      const response = await axios.get<Interaction[]>(
        `https://marhaba-server.onrender.com/api/user/liked/${userId}`
      );

      if (response.data) {
        setInteractions(response.data.data);
      } else {
        setInteractions([]);
        console.log('No likes found or invalid data format.');
      }
    } catch (err) {
      console.error('❌ Error fetching likes:', err);
      setError('Failed to load likes. Please try again later.');
      setInteractions([]);
    } finally {
      setLoading(false);
      if (refreshing) setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLikes(false);
    }, [fetchLikes])
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchLikes(true);
  }, [fetchLikes]);

  const renderGridItem = ({ item }: { item: ProcessedInteraction }) => {
    const profilePicUrl = item.likerProfile.Photos![0].photoUrl;

    return (
      <TouchableOpacity
        style={styles.gridItem}
      >
        <Image
          source={{ uri: profilePicUrl }}
          style={styles.profileImage}
          resizeMode="cover"
          blurRadius={15}
        />
        {item.interaction === 'super' && (
          <View style={tailwind`absolute bottom-2 right-2`}>
            <Heart
              height={28}
              width={28}
              fill={themeColors.primary}
              color={themeColors.primary}
              strokeWidth={2}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={tailwind`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      );
    }
    if (error && !isRefreshing) {
      return (
        <View style={tailwind`flex-1 justify-center items-center p-5`}>
          <Text style={tailwind`text-red-500 text-center`}>{error}</Text>
          <TouchableOpacity onPress={() => fetchLikes(false)} style={tailwind`mt-4 p-2 bg-gray-200 rounded`}>
             <Text>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (interactions.length === 0 && !isRefreshing) {
      return (
        <ScrollView
          contentContainerStyle={tailwind`flex-1 justify-center items-center p-5`}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={themeColors.primary}/>
          }
        >
          <Text style={tailwind`text-lg text-gray-500 text-center`}>No one has liked you yet.</Text>
          <Text style={tailwind`text-gray-400 text-center mt-1`}>Check back later!</Text>
        </ScrollView>
      );
    }

    return (
      <FlatList
        data={interactions}
        renderItem={renderGridItem}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={themeColors.primary}
            colors={[themeColors.primary]}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <View style={tailwind`px-4 py-3 border-b border-gray-500 mb-3`}>
        <Text style={tailwind`text-2xl font-bold text-gray-800`}>Likes</Text>
      </View>

      {renderContent()}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: itemPadding / 2,
    paddingBottom: itemPadding /2,
    flexGrow: 1,
  },
  gridItem: {
    width: imageSize,
    height: imageSize * 1.25,
    margin: itemPadding / 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  superLikeIndicator: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 4,
  },
  nameText: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default LikeScreen;
