import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
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
  Heart,
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
      <TouchableOpacity
        onPress={updateView}
        style={[
          tailwind`absolute z-10 left-2 bottom-22 p-2.25 rounded-full shadow-lg`,
          {backgroundColor: themeColors.primary},
        ]}>
        <Heart height={20} width={20} color={'white'} strokeWidth={3} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={tailwind`pb-8 px-3`}>
        {events.map(event => (
          <View
            key={event.id}
            style={tailwind`rounded-2 overflow-hidden mb-6 shadow-md w-[48%]`}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Event', {eventId: event.id})}>
              <ImageBackground
                source={{
                  uri: event.imageUrl || 'https://via.placeholder.com/150',
                }}
                style={tailwind`w-full h-64 justify-between`}
                imageStyle={tailwind`rounded-2xl`}>
                <View style={tailwind`p-3`}>
                  <Text style={tailwind`text-white text-xl font-bold`}>
                    {event.title}
                  </Text>
                </View>

                <View
                  style={[
                    tailwind`p-3 flex-row justify-between items-end rounded-b-2`,
                    {backgroundColor: 'rgba(0, 0, 0, 0.4)'},
                  ]}>
                  <View>
                    <View style={tailwind`flex-row items-center mb-1`}>
                      <MapPin height={16} width={16} color="white" />
                      <Text style={tailwind`text-white text-sm ml-2`}>
                        {event.location}
                      </Text>
                    </View>
                    <View style={tailwind`flex-row items-center`}>
                      <Users height={16} width={16} color="white" />
                      <Text style={tailwind`text-white text-sm ml-2`}>
                        {event.Event_Rsvp.length} / {event.capacity}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={tailwind`text-white text-sm mt-1`}>
                      {event.formattedMonth} {event.formattedDate}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                tailwind`py-1 rounded-2 items-center mt-2`,
                {backgroundColor: themeColors.primary},
              ]}
              onPress={() => navigation.navigate('Event', {eventId: event.id})}>
              <Text style={tailwind`text-white font-semibold text-base`}>
                {event.isAttending ? 'Attending' : 'Will Attend'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SocialScreen;
