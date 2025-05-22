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
} from 'react-native';
import tailwind from 'twrnc';
import axios from 'axios';
import themeColors from '../../Utils/custonColors'; // your color config
import {Calendar, MapPin, Users} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const SocialScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        'https://marhaba-server.onrender.com/api/events',
      );
      console.log(response.data.data);
      setEvents(response.data.data); // Make sure your endpoint returns an array
    } catch (err) {
      console.error('❌ Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
      <ScrollView contentContainerStyle={tailwind`pb-8`}>
        {events.map(event => (
          <TouchableOpacity
            key={event.id}
            onPress={() => navigation.navigate('Event', {eventId: event.id})}
            style={[
              tailwind`flex-row rounded-lg overflow-hidden m-3 items-center`,
              {backgroundColor: themeColors.darkGrey},
            ]}>
            {/* Left Half: Image */}
            <Image
              source={{
                uri: event.imageUrl || 'https://via.placeholder.com/150',
              }}
              style={{
                width: screenWidth * 0.33,
                height: 150,
                resizeMode: 'cover',
                borderRadius: 8,
              }}
            />

            {/* Right Half: Event Info */}
            <View style={tailwind`p-3 flex-1`}>
              <Text
                style={tailwind`text-xl font-bold text-white`}
                numberOfLines={2}>
                {event.title}
              </Text>
              <View style={tailwind`flex-row items-center my-1`}>
                <MapPin height={16} width={16} color={themeColors.primary} />
                <Text style={tailwind`text-sm text-gray-300 ml-1`}>
                  {event.location}
                </Text>
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
