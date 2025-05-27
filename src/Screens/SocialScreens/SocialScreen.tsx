import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import tailwind from 'twrnc';
import axios from 'axios';
import themeColors from '../../Utils/custonColors';
import {
  Calendar,
  MapPin,
  Users,
  ChevronsDown,
  Map as MapIcon,
  Navigation,
  Map,
} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {useProfile} from '../../Context/ProfileContext';

const screenWidth = Dimensions.get('window').width;

const SocialScreen = () => {
  const {grabUserProfile, userId, profile} = useProfile();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewRelationships, setViewRelationships] = useState(profile.mainView);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation();

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        'https://marhaba-server.onrender.com/api/events',
      );
      setEvents(response.data.data);
    } catch (err) {
      console.error('❌ Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const updateView = async () => {
    setViewRelationships('Relationships');
    setShowDropdown(false);
    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/account/updateView',
        {
          userId: userId,
          view: 'Relationships',
        },
      );
      if (response.data?.success) {
        console.log('✅ View updated to Relationships');
        grabUserProfile(userId);
      } else {
        Alert.alert('Error', 'Failed to update view.');
      }
    } catch (error) {
      console.error('❌ View update error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    Linking.openURL(url).catch(err =>
      console.error('❌ Failed to open maps:', err),
    );
  };

  if (loading) {
    return (
      <View style={tailwind`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <View
        style={tailwind`w-full px-4 pt-4 pb-2 z-10 relative bg-[${themeColors.secondary}]`}>
        <TouchableOpacity
          onPress={() => setShowDropdown(prev => !prev)}
          style={tailwind`flex-row items-center`}>
          <Text style={tailwind`text-2xl font-semibold`}>
            {viewRelationships === 'Relationships' ? 'Relationships' : 'Social'}
          </Text>
          <ChevronsDown
            height={20}
            width={20}
            color={themeColors.primary}
            style={tailwind`ml-2`}
          />
        </TouchableOpacity>

        {showDropdown && (
          <View
            style={tailwind`absolute top-16 left-4 w-48 bg-white rounded-lg shadow-lg z-20`}>
            <TouchableOpacity
              onPress={updateView}
              style={tailwind`p-3 border-b border-gray-200`}>
              <Text style={tailwind`text-black`}>Switch to Relationships</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDropdown(false)}
              style={tailwind`p-3`}>
              <Text style={tailwind`text-black`}>Stay in Social</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={tailwind`pb-8`}>
        {events.map(event => (
          <TouchableOpacity
            key={event.id}
            onPress={() => navigation.navigate('Event', {eventId: event.id})}
            style={[
              tailwind`flex-row rounded-lg overflow-hidden m-3 items-center`,
              {backgroundColor: themeColors.darkGrey},
            ]}>
            <Image
              source={{
                uri: event.imageUrl || 'https://via.placeholder.com/150',
              }}
              style={{
                width: screenWidth * 0.33,
                height: 150,
                resizeMode: 'cover',
                borderRadius: 6,
                marginLeft: 8,
              }}
            />

            <View style={tailwind`p-3 flex-1`}>
              <Text
                style={tailwind`text-xl font-bold text-white`}
                numberOfLines={2}>
                {event.title}
              </Text>

              <View
                style={tailwind`flex-row items-center justify-between my-1`}>
                <View style={tailwind`flex-row items-center my-1`}>
                  <MapPin height={16} width={16} color={themeColors.primary} />
                  <Text
                    style={tailwind`text-sm text-gray-300 ml-1 flex-shrink`}>
                    {event.location}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => openMaps(event.address)}
                  style={tailwind`ml-2`}>
                  <Map height={16} width={16} color={themeColors.primary} />
                </TouchableOpacity>
              </View>

              <View style={tailwind`flex-row items-center my-1`}>
                <Calendar height={16} width={16} color={themeColors.primary} />
                <Text style={tailwind`text-sm text-gray-300 ml-1`}>
                  {event.formattedDayOfWeek} {event.formattedMonth}{' '}
                  {event.formattedDate} {event.formattedTime}
                </Text>
              </View>

              <View style={tailwind`flex-row items-center my-1`}>
                <Users height={16} width={16} color={themeColors.primary} />
                <Text style={tailwind`text-sm text-gray-300 ml-1`}>
                  {event.Event_Rsvp.length} / {event.capacity}
                </Text>
              </View>

              <View
                style={[
                  tailwind`flex-row items-center my-1 p-2 rounded-2 justify-center`,
                  {backgroundColor: themeColors.primary},
                ]}>
                <Text style={tailwind`text-white font-semibold`}>
                  Attending
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SocialScreen;
