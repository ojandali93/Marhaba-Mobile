import React, {useState, useEffect, useCallback} from 'react';
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
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import tailwind from 'twrnc';
import {
  Check,
  ChevronsDown,
  Heart,
  MessageSquare,
  X,
} from 'react-native-feather';

import themeColors from '../../Utils/custonColors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useProfile} from '../../Context/ProfileContext';
import {countryFlagMap} from '../../Utils/FlagMaps';
import {track} from '@amplitude/analytics-react-native';

interface Interaction {
  _id: string;
  liker: {
    _id: string;
    name?: string;
    Photos?: {photoUrl: string}[];
  };
  interaction: 'liked' | 'superliked';
}

interface ProcessedInteraction extends Interaction {
  isSuperLike: boolean;
}

const {width} = Dimensions.get('window');
const itemPadding = 8;
const numColumns = 2;
const imageSize = (width - itemPadding * (numColumns + 1)) / numColumns;

const LikeScreen = () => {
  const {profile, userId, markLikesAsViewed} = useProfile();
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [interactions, setInteractions] = useState<ProcessedInteraction[]>([]);
  const [viewed, setViewed] = useState<ProcessedInteraction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'likes' | 'views'>('likes');
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchLikes = useCallback(async (refreshing = false) => {
    if (!refreshing) {
      setLoading(true);
    }
    setError(null);
    if (!userId) {
      setError('User ID not found. Please log in again.');
      setLoading(false);
      if (refreshing) setIsRefreshing(false);
      return;
    }

    try {
      const response = await axios.get<Interaction[]>(
        `https://marhaba-server.onrender.com/api/user/liked/${userId}`,
      );

      if (response.data) {
        console.log('liked profiles', response.data.data);
        setInteractions(response.data.data);
      } else {
        setInteractions([]);
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

  const fetchViews = useCallback(async (refreshing = false) => {
    if (!refreshing) {
      setLoading(true);
    }
    setError(null);
    if (!userId) {
      setError('User ID not found. Please log in again.');
      setLoading(false);
      if (refreshing) setIsRefreshing(false);
      return;
    }

    try {
      const response = await axios.get<Interaction[]>(
        `https://marhaba-server.onrender.com/api/viewed/user/viewed/${userId}`,
      );

      if (response.data) {
        console.log('viewed profiles', response.data.data);
        setViewed(response.data.data);
      } else {
        setViewed([]);
      }
    } catch (err) {
      console.error('❌ Error fetching likes:', err);
      setError('Failed to load likes. Please try again later.');
      setViewed([]);
    } finally {
      setLoading(false);
      if (refreshing) setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      track('Viewed Likes Screen', {
        targetUserId: userId,
      });
      markLikesAsViewed(userId);
      fetchLikes(false);
      fetchViews(false);
    }, [fetchLikes, fetchViews]),
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchLikes(true);
    fetchViews(true);
  }, [fetchLikes, fetchViews]);

  const handleApproveLike = async (interactionId: any, userId2: string) => {
    console.log('🔄 Approving like interaction:', interactionId);
    track(`Approved like interaction (Likes Screen): ${userId2}`, {
      targetUserId: userId,
    });

    try {
      // 1. Approve the interaction
      const response = await axios.put(
        `https://marhaba-server.onrender.com/api/user/approved`,
        {
          id: interactionId.id,
        },
      );

      if (response.data) {
        fetchLikes(false); // refresh
        createConversation(userId2);

        // 2. Check if liker wants match notifications
        const liker = interactionId.likerProfile;
        const wantsMatchNotifications =
          liker?.Notifications?.[0]?.matches === true;
        const apnToken = liker?.apnToken;

        if (wantsMatchNotifications && apnToken) {
          try {
            await axios.post(
              'https://marhaba-server.onrender.com/api/notifications/send',
              {
                token: apnToken,
                title: 'New Match!',
                body: 'You have a new match!',
              },
            );
            console.log('📤 Match notification sent to liker');
          } catch (err) {
            console.error('❌ Failed to send push notification:', err);
          }
        } else {
          console.log('⚠️ User has match notifications turned off or no token');
        }
      } else {
        console.warn('⚠️ No data returned from approval endpoint.');
      }
    } catch (error) {
      console.error('❌ Error approving like:', error);
      setError('Failed to approve like. Please try again later.');
    }
  };

  const handleRejectLike = async (interactionId: string) => {
    track(`Rejected like interaction (Likes Screen): ${interactionId}`, {
      targetUserId: userId,
    });
    try {
      const response = await axios.delete(
        `https://marhaba-server.onrender.com/api/user/removeInteraction/${interactionId}`,
      );

      if (response.data) {
        fetchLikes(false);
      } else {
        console.log('No likes found or invalid data format.');
      }
    } catch (error) {
      console.error('❌ Error approving likes:', error);
      setError('Failed to load likes. Please try again later.');
    }
  };

  const createConversation = async (userId2: string) => {
    try {
      const response = await axios.post(
        `https://marhaba-server.onrender.com/api/conversation/create`,
        {
          userId,
          userId2: userId2,
          lastMessage: '',
          updatedAt: new Date().toISOString(),
        },
      );

      if (response.data) {
        fetchLikes(false);
        track(`Conversation Created with ${userId2}`, {
          targetUserId: userId,
        });
      } else {
        console.log('No likes found or invalid data format.');
      }
    } catch (error) {
      console.error('❌ Error approving likes:', error);
      setError('Failed to load likes. Please try again later.');
    }
  };

  const handleViewProfile = (userProfile: any) => {
    if (profile?.tier === 3) {
      navigation.navigate('SingleProfile', {profile: userProfile});
      track(`Viewed profile (Likes Screen): ${userProfile.name}`, {
        targetUserId: userId,
      });
    } else {
      null;
    }
  };

  const renderGridItem = ({item}: {item: ProcessedInteraction}) => {
    const userProfile = item.likerProfile || item.viewerProfile || item.profile;

    if (
      !userProfile ||
      !userProfile.Photos ||
      userProfile.Photos.length === 0
    ) {
      return null; // Skip rendering if no photos or invalid profile
    }

    const profilePicUrl = userProfile.Photos[0].photoUrl;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          handleViewProfile(item.likerProfile);
          track(`Viewed profile (Likes Screen): ${item.likerProfile.name}`, {
            targetUserId: userId,
          });
        }}>
        <View style={styles.gridItem}>
          <Image
            source={{uri: profilePicUrl}}
            style={styles.profileImage}
            resizeMode="cover"
            blurRadius={profile?.tier === 3 || profile?.tier === 2 ? 0 : 15}
          />
          <View
            style={[
              tailwind`absolute top-0 left-0 bottom-0 right-0 p-3`,
              {backgroundColor: themeColors.lightGreyOpacity},
            ]}>
            <View style={tailwind`flex flex-1 justify-between`}>
              <View style={tailwind`flex flex-row items-center`}>
                <Text style={tailwind`text-white text-2xl font-bold`}>
                  {item.likerProfile.name}
                </Text>
                <Text style={tailwind`text-white text-2xl font-bold ml-3`}>
                  {JSON.parse(item.likerProfile.About[0].background)
                    .slice(0, 2)
                    .map((bg: string, idx: number) => (
                      <Text key={idx} style={tailwind`text-xl font-bold ml-3`}>
                        {countryFlagMap[bg] ?? ''}
                      </Text>
                    ))}
                </Text>
              </View>
              <View style={tailwind`flex flex-row items-center w-full`}>
                {item.approved === false || item.approved === null ? (
                  <View
                    style={tailwind`w-full flex flex-row items-center justify-between`}>
                    <TouchableOpacity
                      onPress={() => handleRejectLike(item.id)}
                      style={tailwind`p-2 bg-red-400 rounded-full`}>
                      <X
                        height={28}
                        width={28}
                        color={'white'}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handleApproveLike(item, item.likerProfile.userId)
                      }
                      style={tailwind`p-2 bg-green-400 rounded-full`}>
                      <Check
                        height={28}
                        width={28}
                        color={'white'}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Conversations');
                      }}
                      style={tailwind` p-3 bg-neutral-400 rounded-full`}>
                      <MessageSquare
                        height={20}
                        width={20}
                        color={'white'}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
          {item.userInteraction === 'super' && (
            <View style={tailwind`absolute top-3 right-3`}>
              <Heart
                height={28}
                width={28}
                fill={themeColors.primary}
                color={themeColors.primary}
                strokeWidth={2}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
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
          <TouchableOpacity
            onPress={() => fetchLikes(false)}
            style={tailwind`mt-4 p-2 bg-gray-200 rounded`}>
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
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={themeColors.primary}
            />
          }>
          <Text style={tailwind`text-lg text-gray-500 text-center`}>
            No one has liked you yet.
          </Text>
          <Text style={tailwind`text-gray-400 text-center mt-1`}>
            Check back later!
          </Text>
        </ScrollView>
      );
    }

    return (
      <FlatList
        data={interactions}
        renderItem={renderGridItem}
        keyExtractor={(item: any, index: number) => JSON.stringify(index)}
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

  const renderViewedContent = () => {
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
          <TouchableOpacity
            onPress={() => fetchViews(false)}
            style={tailwind`mt-4 p-2 bg-gray-200 rounded`}>
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
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={themeColors.primary}
            />
          }>
          <Text style={tailwind`text-lg text-gray-500 text-center`}>
            No one has viewed your profile yet.
          </Text>
          <Text style={tailwind`text-gray-400 text-center mt-1`}>
            Check back later!
          </Text>
        </ScrollView>
      );
    }

    return (
      <FlatList
        data={viewed}
        renderItem={renderGridItem}
        keyExtractor={(item: any, index: number) => JSON.stringify(index)}
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
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <TouchableOpacity
        onPress={() => {
          if (profile?.tier === 3) setShowDropdown(prev => !prev);
        }}
        style={tailwind`w-full flex flex-row items-center p-4 rounded-2`}>
        <Text style={tailwind`text-2xl font-bold text-gray-800 mr-1`}>
          {viewType === 'likes' ? 'Likes' : 'Viewed You'}
        </Text>
        {profile?.tier === 3 && (
          <ChevronsDown height={20} width={20} color={themeColors.primary} /> // simple chevron down
        )}
      </TouchableOpacity>
      {showDropdown && profile?.tier === 3 && (
        <View
          style={[
            tailwind`absolute top-28 left-2 z-50 rounded-2 shadow p-2`,
            {
              backgroundColor: themeColors.darkSecondary,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              setViewType('likes');
              setShowDropdown(false);
              fetchLikes(); // reuse your existing function
            }}>
            <Text
              style={[
                tailwind`${
                  viewType === 'likes' ? 'text-white' : 'text-gray-800'
                } text-lg p-2 rounded-2`,
                {
                  backgroundColor:
                    viewType === 'likes'
                      ? themeColors.primary
                      : themeColors.darkSecondary,
                },
              ]}>
              Likes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setViewType('views');
              setShowDropdown(false);
              // fetchViews(); // you'll need to define this
            }}>
            <Text
              style={[
                tailwind`${
                  viewType === 'views' ? 'text-white' : 'text-gray-800'
                } text-lg p-2 rounded-2`,
                {
                  backgroundColor:
                    viewType === 'views'
                      ? themeColors.primary
                      : themeColors.darkSecondary,
                },
              ]}>
              Viewed You
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {viewType === 'views' ? renderViewedContent() : renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: itemPadding / 2,
    paddingBottom: itemPadding / 2,
    flexGrow: 1,
  },
  gridItem: {
    width: imageSize,
    height: imageSize * 1.25,
    margin: itemPadding / 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
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
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
});

export default LikeScreen;
