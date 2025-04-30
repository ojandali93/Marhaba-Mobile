import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ChevronsLeft } from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import { getProfile } from '../../Services/AuthStoreage';

interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const BugView = ({ updateTab }: MenuViewProps) => {
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('—');
  const [email, setEmail] = useState('—');

  useEffect(() => {
    const profile = getProfile();
    if (profile && profile.data) {
      setName(profile.data.name || '—');
      setEmail(profile.data.email || '—');
    }
  }, []);

  const handleSubmit = () => {
    if (!category || !message.trim()) {
      Alert.alert('Missing Fields', 'Please select a category and enter a message.');
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
        <Text style={[tailwind`text-2xl font-semibold`, { color: themeColors.primary }]}>
          Report A Bug
        </Text>
      </TouchableOpacity>

      {/* User Info */}
      <Text style={tailwind`text-base text-gray-700 mb-4`}>
  Thank you for taking the time to report a bug — we truly appreciate it. Your feedback helps us improve Marhaba for everyone. Our team will review the issue, and while some bugs may take longer to investigate, we aim to respond or resolve within 72 hours. Thanks for being part of our journey!
</Text>
      {/* Message Input */}
      <Text style={tailwind`text-base font-semibold mb-1`}>Message</Text>
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
          { backgroundColor: themeColors.primary },
        ]}>
        <Text style={tailwind`text-white text-center text-base font-semibold`}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BugView;
