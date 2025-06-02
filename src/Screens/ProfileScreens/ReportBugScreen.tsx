// BugScreen.js
import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {ChevronsLeft} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';
import {useNavigation} from '@react-navigation/native';

const BugScreen = () => {
  const navigation = useNavigation();
  const {profile} = useProfile();
  const [message, setMessage] = useState('');
  const [name, setName] = useState('—');
  const [email, setEmail] = useState('—');

  useEffect(() => {
    if (profile?.data) {
      setName(profile.data.name || '—');
      setEmail(profile.data.email || '—');
    }
  }, [profile]);

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert('Missing Fields', 'Please enter a message.');
      return;
    }

    // TODO: Replace with real API call
    Alert.alert('Message Sent', 'Thank you for reporting the bug!');
    setMessage('');
  };

  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      {/* Header */}
      <View
        style={tailwind`p-4 border-b border-gray-700 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        </TouchableOpacity>
        <Text
          style={[
            tailwind`text-2xl font-bold ml-2`,
            {color: themeColors.primary},
          ]}>
          Report A Bug
        </Text>
      </View>

      <ScrollView
        style={tailwind`flex-1 px-4 py-4`}
        contentContainerStyle={tailwind`pb-10`}>
        {/* Description */}
        <Text style={tailwind`text-base mb-4`}>
          Thank you for taking the time to report a bug — we truly appreciate
          it. Your feedback helps us improve Marhaba for everyone. Our team will
          review the issue, and while some bugs may take longer to investigate,
          we aim to respond or resolve within 72 hours. Thanks for being part of
          our journey!
        </Text>

        {/* User Info */}
        <Text style={tailwind`text-base mb-2`}>
          Name:{' '}
          <Text style={tailwind`font-semibold`}>{profile.About[0].name}</Text>
        </Text>
        <Text style={tailwind`text-base mb-4`}>
          Email:{' '}
          <Text style={tailwind`font-semibold`}>{profile.About[0].email}</Text>
        </Text>

        {/* Message Input */}
        <Text style={tailwind`text-base font-semibold mb-2`}>Message</Text>
        <TextInput
          placeholder="Write your message here..."
          placeholderTextColor={themeColors.primary}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
          style={[
            tailwind`border p-3 rounded-xl mb-6 text-base text-white`,
            {
              backgroundColor: themeColors.darkSecondary,
              borderColor: themeColors.primary,
              height: 140,
              textAlignVertical: 'top',
            },
          ]}
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            tailwind`p-4 rounded-xl mb-10`,
            {backgroundColor: themeColors.primary},
          ]}>
          <Text
            style={tailwind`text-center text-base font-semibold text-white`}>
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BugScreen;
