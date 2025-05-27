import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  Linking,
} from 'react-native';
import tailwind from 'twrnc';
import axios from 'axios';
import themeColors from '../../Utils/custonColors'; // Your color config
import {
  Calendar,
  Check,
  ChevronsLeft,
  Map,
  MapPin,
  MoreHorizontal,
  Plus,
  PlusCircle,
  Users,
  X,
} from 'react-native-feather';
import {
  cropCenterImageForPhone,
  pickImageFromGallery,
} from '../../Utils/Functions/ImageFunctions';
import {useProfile} from '../../Context/ProfileContext';
import {track} from '@amplitude/analytics-react-native';
import {useNavigation} from '@react-navigation/native';
import {addToken} from '../../Utils/Storeage';
import Geolocation from '@react-native-community/geolocation';

const EVENT_LOCATION = {
  latitude: 33.961, // replace with actual event location
  longitude: -117.618,
};

const isWithinFiveMiles = (userLat, userLong) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 3958.8; // Radius of Earth in miles

  const dLat = toRad(EVENT_LOCATION.latitude - userLat);
  const dLon = toRad(EVENT_LOCATION.longitude - userLong);
  const lat1 = toRad(userLat);
  const lat2 = toRad(EVENT_LOCATION.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c <= 5;
};

const EventScreen = ({route}) => {
  const {eventId} = route.params;
  const {userId} = useProfile();
  const navigation = useNavigation();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [withinDistance, setWithinDistance] = useState(false);

  const currentUserId = userId;

  const [event, setEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [posts, setPosts] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const [loadingStates, setLoadingStates] = useState<boolean>(true);

  const [modalVisible, setModalVisible] = useState(false);

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  useLayoutEffect(() => {
    grabEventDetails();
    getEventCheckins();
    getEventRsvp();
    getEventPosts();
    getUserLocation();
  }, []);

  const grabEventDetails = async () => {
    try {
      const {data, error} = await axios.get(
        `https://marhaba-server.onrender.com/api/events/${eventId}`,
      );
      console.log('event details', data.data);
      setEvent(data.data);
    } catch (error) {
      console.error('Error fetching event posts:', error);
    }
  };

  const getEventCheckins = async () => {
    try {
      const {data} = await axios.post(
        `https://marhaba-server.onrender.com/api/events/eventAttend`,
        {eventId},
      );
      setAttendees(data.data);
      setCheckedIn(data.data.some(att => att.userId.userId === userId));
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    }
  };

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        if (event?.latitude && event?.longitude) {
          const distance = calculateDistance(
            latitude,
            longitude,
            event.latitude,
            event.longitude,
          );
          setWithinDistance(distance <= 7);
        }
      },
      error => {
        console.error('Geolocation error:', error);
        Alert.alert('Location Error', 'Failed to get your location.');
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = x => (x * Math.PI) / 180;
    const R = 3958.8; // miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleCheckIn = async () => {
    if (!withinDistance) {
      Alert.alert(
        'Too Far',
        'You must be within 7 miles of the event to check in.',
      );
      return;
    }
    try {
      const {data} = await axios.post(
        `https://marhaba-server.onrender.com/api/events/createCheckin`,
        {
          eventId,
          userId,
        },
      );
      setAttendees(data.data);
      getEventCheckins();
      Alert.alert('Checked In', 'You have been checked in to the event.');
    } catch (error) {
      console.error('Error checking in:', error);
      Alert.alert('Error', 'Failed to check in.');
    }
  };

  const getEventRsvp = async () => {
    try {
      const {data, error} = await axios.post(
        `https://marhaba-server.onrender.com/api/events/eventRsvp`,
        {
          eventId: eventId,
        },
      );
      console.log('event rsvp', data.data);
      setRsvps(data.data);
      setLoadingStates(false);
    } catch (error) {
      console.error('Error fetching event posts:', error);
    }
  };

  const getEventPosts = async () => {
    try {
      const eventPosts = await axios.post(
        `https://marhaba-server.onrender.com/api/events/eventPosts`,
        {
          eventId: eventId,
          userId: userId,
        },
      );
      console.log('event posts', eventPosts.data.posts);
      if (eventPosts.data.posts) {
        setPosts(eventPosts.data.posts);
      }
    } catch (error) {
      console.error('Error fetching event posts:', error);
    }
  };

  const handleCreatePost = async () => {
    console.log(postImage);
    console.log(newPost.trim());
    if (newPost.trim() === '') {
      Alert.alert('Please enter a caption');
      return;
    }
    if (!postImage) {
      Alert.alert('Please add an image');
      return;
    }
    try {
      await axios.post(
        `https://marhaba-server.onrender.com/api/events/createEventPost`,
        {
          eventId,
          userId: userId,
          caption: newPost,
          image: postImage,
        },
      );
      setModalVisible(false);
      setNewPost('');
      setPostImage(null);
      getEventPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleReportProfile = async post => {
    console.log('post', post);
    console.log('userId', post.id);
    console.log('userId', post.userId.userId);
    track(`Profile Reported: ${selectedReason} `, {
      targetUserId: userId,
    });
    const finalReason =
      selectedReason === 'Other' ? customReason.trim() : selectedReason;

    if (!finalReason) {
      Alert.alert('Missing Reason', 'Please enter a reason for the report.');
      return;
    }

    try {
      await axios.post(
        'https://marhaba-server.onrender.com/api/user/reportUser',
        {
          reporterId: userId,
          reportedId: post.userId.userId,
          postId: post.id,
          reason: finalReason,
        },
      );
      setShowReasonModal(false);
      setShowOptions(false);
      Alert.alert('Reported', 'Profile has been reported successfully.');
    } catch (error) {
      console.error('Error reporting profile:', error);
      Alert.alert('Error', 'Failed to report profile. Please try again.');
    }
  };

  const handleBlockProfile = async post => {
    console.log('post', post);
    track('Profile Blocked', {
      targetUserId: userId,
    });
    try {
      await axios.post(
        'https://marhaba-server.onrender.com/api/user/blockUser',
        {
          blocker_id: userId,
          blocked_id: post.userId.userId,
        },
      );
      setShowOptions(false);
      Alert.alert('Blocked', 'Profile has been blocked successfully.');
    } catch (error) {
      console.error('Error blocking profile:', error);
      Alert.alert('Error', 'Failed to block profile. Please try again.');
    }
  };

  const handleDeletePost = async postId => {
    try {
      await axios.delete(
        `https://marhaba-server.onrender.com/api/posts/${postId}`,
      );
      setPosts(posts.filter(p => p.id !== postId));
      Alert.alert('✅ Post deleted');
    } catch (err) {
      Alert.alert('❌ Error deleting post');
    }
  };

  const handlePickImage = async () => {
    try {
      const image = await pickImageFromGallery();
      if (!image || !image.uri) return;

      const croppedImage = await cropCenterImageForPhone(
        image.uri,
        image.width,
        image.height,
        image.fileName,
      );

      if (!croppedImage?.uri) return;

      setLoadingStates(true);

      const uploadedUrl = await uploadImageToServer(
        croppedImage.uri,
        croppedImage.fileName,
      );

      if (uploadedUrl) {
        setPostImage(uploadedUrl);
      }
    } catch (error) {
      console.error('Image pick error:', error);
    } finally {
      setLoadingStates(false);
    }
  };

  const uploadImageToServer = async (
    localUri: string,
    originalFileName: string,
  ) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: localUri,
        name: originalFileName || 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/account/upoadImage',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        },
      );

      return response.data.success ? response.data.url : null;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    Linking.openURL(url).catch(err =>
      console.error('❌ Failed to open maps:', err),
    );
  };

  if (!event) {
    return (
      <View style={tailwind`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <View style={tailwind`flex-1`}>
        {/* 🔹 Event Info */}
        <View style={tailwind`pt-2 pl-4`}>
          <View style={tailwind`flex flex-row justify-between mb-3`}>
            <View style={tailwind`flex flex-row items-center`}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <ChevronsLeft
                  height={24}
                  width={24}
                  color={themeColors.primary}
                />
              </TouchableOpacity>
              <Text
                style={[
                  tailwind`text-2xl font-bold ml-2`,
                  {color: themeColors.primary},
                ]}>
                {event.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={checkedIn ? null : handleCheckIn}
              disabled={checkedIn}
              style={tailwind`mx-4 py-1 px-2 rounded-2 ${
                checkedIn ? 'bg-gray-400' : 'bg-green-600'
              }`}>
              <Text
                style={tailwind`text-center text-white font-semibold text-base`}>
                {checkedIn ? 'Checked In' : 'Check In'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={tailwind`flex-row items-center my-1`}>
            <MapPin height={16} width={16} color={themeColors.primary} />
            <Text style={tailwind`text-sm ml-1`}>{event.location}</Text>
          </View>
          <TouchableOpacity
            onPress={() => openMaps(event.address)}
            style={tailwind`flex-row items-center my-1`}>
            <Map height={16} width={16} color={themeColors.primary} />
            <Text
              style={[
                tailwind`text-sm ml-1 underline`,
                {color: themeColors.primary},
              ]}>
              {event.address}
            </Text>
          </TouchableOpacity>
          <View style={tailwind`flex-row items-center my-1`}>
            <Calendar height={16} width={16} color={themeColors.primary} />
            <Text style={tailwind`text-sm ml-1`}>
              {event.formattedDayOfWeek} {event.formattedMonth}{' '}
              {event.formattedDate} {event.formattedTime}
            </Text>
          </View>
          <View style={tailwind`flex-row items-center my-1`}>
            <Users height={16} width={16} color={themeColors.primary} />
            <Text style={tailwind`text-sm ml-1`}>
              {rsvps.length} / {event.capacity}
            </Text>
          </View>
        </View>

        <View
          style={tailwind`w-full flex flex-row border-b-2 border-gray-300 mt-3`}></View>

        {
          <View
            style={tailwind`w-full flex flex  my-2 pl-5 border-b-2 border-gray-300`}>
            <View style={tailwind`flex-row items-center`}>
              <Text style={tailwind`text-lg italic`}>RSVP</Text>
            </View>
            <ScrollView horizontal style={tailwind`py-2`}>
              {rsvps.map((user, index) => {
                const mainImage = user.userId.Photos[0].photoUrl;
                const isCheckedIn = attendees.some(
                  att => att.userId.userId === user.userId.userId,
                );

                return (
                  <View key={index} style={tailwind`mr-3 relative`}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('SingleProfile', {
                          profile: user.userId,
                        });
                      }}>
                      <Image
                        source={{uri: mainImage}}
                        style={tailwind`w-14 h-14 rounded-full`}
                      />
                    </TouchableOpacity>

                    {isCheckedIn && (
                      <View
                        style={tailwind`absolute bottom-0 right-0 bg-green-500 rounded-full p-1`}>
                        <Check height={12} width={12} color="white" />
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        }

        <View style={tailwind`px-5 mb-4 mt-2 flex flex-row justify-between`}>
          <View style={tailwind`flex-row items-center`}>
            <Text style={tailwind`text-lg italic`}>Posts</Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={tailwind`rounded-lg`}>
            <PlusCircle height={22} width={22} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={tailwind`px-4`}>
          {posts.map(post => (
            <View key={post.id} style={tailwind`rounded-lg mb-3 flex-col`}>
              {post.image && (
                <Image
                  source={{uri: post.image}}
                  style={tailwind`w-full h-90 rounded-lg`}
                  resizeMode="cover"
                />
              )}
              <View style={tailwind`flex-row justify-between mt-2 px-2`}>
                <View style={tailwind`flex-row items-center`}>
                  <Image
                    source={{uri: post.userId.Photos[0].photoUrl}}
                    style={tailwind`w-6 h-6 rounded-full`}
                  />
                  <Text style={tailwind`text-black text-base ml-2`}>
                    {post.userId.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPost(post);
                    setShowOptions(true);
                  }}>
                  <MoreHorizontal
                    height={24}
                    width={24}
                    color={themeColors.darkGrey}
                  />
                </TouchableOpacity>
              </View>
              <Text style={tailwind`text-black text-base mt-1 ml-8 px-2`}>
                {post.caption}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      {showOptions && selectedPost && (
        <Modal
          visible={showOptions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowOptions(false)}>
          <View
            style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-60 px-4`}>
            <View
              style={[
                tailwind`w-full p-5 rounded-lg`,
                {backgroundColor: themeColors.darkSecondary},
              ]}>
              <Text style={tailwind`text-xl font-bold text-center mb-4`}>
                What would you like to do?
              </Text>
              {selectedPost.userId.userId === userId && (
                <TouchableOpacity
                  onPress={() => {
                    handleDeletePost(selectedPost.id);
                    setShowOptions(false);
                  }}
                  style={[
                    tailwind`py-3 px-5 rounded-md mb-3`,
                    {backgroundColor: themeColors.primary},
                  ]}>
                  <Text style={tailwind`text-white text-center font-semibold`}>
                    Delete Post
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleBlockProfile(selectedPost)}
                style={[
                  tailwind`py-3 px-5 rounded-md mb-3`,
                  {backgroundColor: themeColors.primary},
                ]}>
                <Text style={tailwind`text-white text-center font-semibold`}>
                  Block User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowOptions(false);
                  setShowReasonModal(true);
                }}
                style={[
                  tailwind`py-3 px-5 rounded-md mb-3`,
                  {backgroundColor: themeColors.primary},
                ]}>
                <Text style={tailwind`text-white text-center font-semibold`}>
                  Report User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowOptions(false)}
                style={tailwind`mt-4`}>
                <Text
                  style={tailwind`text-center text-base font-semibold text-red-400`}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        visible={showReasonModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReasonModal(false)}>
        <View
          style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-60 px-4`}>
          <View
            style={[
              tailwind`w-full p-5 rounded-lg`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <Text style={tailwind`text-xl font-bold text-center mb-4`}>
              Select Report Reason
            </Text>

            {[
              'Offensive Content',
              'Inappropriate Behavior',
              'Spam or Scam',
              'Fake Profile',
              'Other',
            ].map(reason => (
              <TouchableOpacity
                key={reason}
                onPress={() => setSelectedReason(reason)}
                style={[
                  tailwind`py-2 px-4 rounded-md mb-2`,
                  {
                    backgroundColor:
                      selectedReason === reason
                        ? themeColors.primary
                        : themeColors.darkSecondary,
                  },
                ]}>
                <Text
                  style={[
                    tailwind`text-base font-semibold`,
                    {
                      color: selectedReason === reason ? 'white' : 'gray',
                    },
                  ]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Conditionally show input for "Other" */}
            {selectedReason === 'Other' && (
              <TextInput
                style={tailwind`border border-gray-600 rounded-md p-3 mt-2 text-base`}
                placeholder="Describe your reason..."
                placeholderTextColor="gray"
                value={customReason}
                onChangeText={setCustomReason}
              />
            )}

            <TouchableOpacity
              onPress={() => handleReportProfile(selectedPost)}
              style={[
                tailwind`mt-4 py-3 px-5 rounded-md`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Text style={tailwind`text-white text-center font-semibold`}>
                Submit Report
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowReasonModal(false);
                setSelectedReason('');
                setCustomReason('');
              }}
              style={tailwind`mt-4`}>
              <Text style={tailwind`text-center text-gray-400`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={tailwind`flex-1 bg-black bg-opacity-40 justify-start items-center px-4 pt-26`}>
          <View style={tailwind`bg-white w-full p-4 rounded-2xl`}>
            <Text style={tailwind`text-xl font-bold mb-3 text-black`}>
              Create Post
            </Text>
            {postImage ? (
              <View style={tailwind`relative w-full`}>
                <TouchableOpacity onPress={handlePickImage}>
                  <Image
                    source={{uri: postImage}}
                    style={tailwind`w-full h-84 rounded-lg mb-3`}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                {/* Overlay X Button */}
                <TouchableOpacity
                  onPress={() => setPostImage(null)}
                  style={tailwind`absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1`}>
                  <X height={16} width={16} color={'white'} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {loadingStates ? (
                  <View
                    style={tailwind`w-full h-84 rounded-lg p-3 mb-2 flex-row justify-center items-center bg-gray-200`}>
                    <ActivityIndicator
                      size="large"
                      color={themeColors.primary}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handlePickImage}
                    style={tailwind`w-full h-84 rounded-lg p-3 mb-2 flex-row justify-center items-center bg-gray-200`}>
                    <Plus
                      height={24}
                      width={24}
                      color={themeColors.primary}
                      strokeWidth={3}
                    />
                    <Text style={tailwind`ml-2 text-black text-lg`}>
                      Add Image
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            <TextInput
              placeholder="What's on your mind?"
              placeholderTextColor={themeColors.darkGrey}
              value={newPost}
              onChangeText={setNewPost}
              style={tailwind`bg-gray-200 rounded-lg p-3 mb-3 text-black`}
            />
            <View style={tailwind`flex-row justify-between`}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={tailwind`px-4 py-2 rounded-lg bg-gray-500`}>
                <Text style={tailwind`text-white`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreatePost}
                style={tailwind`px-4 py-2 rounded-lg bg-blue-600`}>
                <Text style={tailwind`text-white`}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EventScreen;
