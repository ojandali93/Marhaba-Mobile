import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {ArrowUp, ChevronsLeft, Info} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import {useProfile} from '../../Context/ProfileContext';
import {
  getSocket,
  joinConversationRoom,
  leaveConversationRoom,
} from '../../Services/socket';

const ChatScreen = ({route}) => {
  const {userId, profile, setHasUnreadMessages} = useProfile();
  const jwtToken = profile?.jwtToken;
  const {conversation} = route.params;
  const navigation = useNavigation();
  const conversationId = conversation.id;

  const otherUser =
    conversation.profile1.userId === userId
      ? conversation.profile2
      : conversation.profile1;

  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const scrollViewRef = useRef();

  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://marhaba-server.onrender.com/api/conversation/messages/${conversationId}`,
        );
        setMessages(res.data.data || []);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        }, 100);
      } catch (err) {
        console.error('❌ Failed to fetch messages:', err);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Join socket room + listener for real-time messages
  useEffect(() => {
    if (!jwtToken || !userId) return;

    const socket = getSocket();
    if (!socket) return;

    const onNewMessage = async newMessage => {
      const isActive = newMessage.conversationId === conversationId;

      if (isActive) {
        try {
          await axios.put(
            `https://marhaba-server.onrender.com/api/conversation/read`,
            {conversationId, userId},
          );
          setMessages(prev => [...prev, newMessage]);
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({animated: true});
          }, 100);
        } catch (err) {
          console.error('❌ Error marking as read:', err);
        }
      } else {
        setHasUnreadMessages(true);
      }
    };

    joinConversationRoom(conversationId);
    socket.on('newMessage', onNewMessage);

    return () => {
      leaveConversationRoom(conversationId);
      socket.off('newMessage', onNewMessage);
    };
  }, [conversationId, jwtToken, userId]);

  const sendMessage = () => {
    const socket = getSocket();
    if (!textMessage.trim() || !socket?.connected) return;

    const newMessage = {
      conversationId,
      senderId: userId,
      receiverId: otherUser.userId,
      text: textMessage,
      createdAt: new Date().toISOString(),
    };

    socket.emit('sendMessage', newMessage);
    setTextMessage('');
  };

  const formatTime = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <View style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <SafeAreaView
        style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
        <View
          style={[
            tailwind`p-4 border-b border-gray-700 flex-row items-center justify-between`,
            {backgroundColor: themeColors.secondary},
          ]}>
          <View style={tailwind`flex-row items-center`}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronsLeft
                color={themeColors.primary}
                height={24}
                width={24}
              />
            </TouchableOpacity>
            <Text style={tailwind`text-2xl font-bold text-gray-800 ml-2`}>
              {otherUser.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SingleProfile', {profile: otherUser})
            }>
            <Info color={themeColors.primary} height={24} width={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={tailwind`flex-1 px-3 py-2`}
          contentContainerStyle={tailwind`pb-3`}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({animated: true})
          }>
          {messages.map((msg, idx) => {
            const isMe = msg.sender === userId;
            return (
              <View
                key={idx}
                style={[
                  tailwind`my-2 max-w-[75%] p-3 rounded-lg`,
                  isMe
                    ? tailwind`bg-blue-500 self-end`
                    : tailwind`bg-stone-400 self-start`,
                ]}>
                <Text style={tailwind`text-white`}>{msg.content}</Text>
                <Text style={tailwind`text-xs text-white mt-1 text-right`}>
                  {formatTime(msg.created_at)}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={60}>
          <View
            style={[
              tailwind`flex-row items-center border-t border-gray-700 p-3`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <TextInput
              value={textMessage}
              onChangeText={setTextMessage}
              placeholder="Type a message..."
              placeholderTextColor={'grey'}
              style={tailwind`flex-1 bg-gray-300 p-3 pb-4 rounded-2 text-base/5`}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={tailwind`ml-2 bg-blue-500 p-2.3 rounded-2`}>
              <ArrowUp color={'white'} height={24} width={24} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ChatScreen;
