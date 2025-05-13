import React, {useState, useEffect} from 'react';
import {Text, TextInput, TouchableOpacity, View, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ChevronsLeft} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';

interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const ContactUsView = ({updateTab}: MenuViewProps) => {
  const {profile} = useProfile();
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('—');
  const [email, setEmail] = useState('—');

  useEffect(() => {
    if (profile && profile.data) {
      setName(profile.data.name || '—');
      setEmail(profile.data.email || '—');
    }
  }, []);

  const handleSubmit = () => {
    if (!category || !message.trim()) {
      Alert.alert(
        'Missing Fields',
        'Please select a category and enter a message.',
      );
      return;
    }

    // You can replace this with an actual API call
    Alert.alert('Message Sent', 'Thank you for contacting us!');
    setCategory('');
    setMessage('');
  };

  return (
    <View style={tailwind`flex-1`}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => updateTab('settings')}
        style={tailwind`flex-row items-center mb-4`}>
        <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        <Text
          style={[
            tailwind`text-2xl font-semibold`,
            {color: themeColors.primary},
          ]}>
          Contact Us
        </Text>
      </TouchableOpacity>

      {/* User Info */}
      <Text style={tailwind`text-base text-center text-white mb-4`}>
        We appreciate you reaching out to us. Whether you have feedback, a
        question, or need help with your account, we're here to support you.
        Please allow up to 48 hours for a member of our team to respond.
      </Text>
      {/* Message Input */}
      <Text style={tailwind`text-base font-semibold mb-2 text-white`}>
        Message
      </Text>
      <TextInput
        placeholder="Write your message here..."
        placeholderTextColor={themeColors.primary}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={6}
        style={[
          tailwind`border p-3 rounded-xl mb-6 text-base`,
          {
            backgroundColor: themeColors.secondary,
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
          tailwind`p-4 rounded-xl`,
          {backgroundColor: themeColors.primary},
        ]}>
        <Text style={tailwind`text-white text-center text-base font-semibold`}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactUsView;
