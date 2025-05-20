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
  Keyboard,
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
import {track} from '@amplitude/analytics-react-native';

const openingPrompts = [
  "What's your idea of a perfect first meeting?",
  'Would you rather live in a big city or a quiet town?',
  'What are you most passionate about right now?',
  'If you can travel anywhere in the world, where would you go?',
  "What's the most adventurous thing you've ever done?",
];

const ChatScreen = ({route}) => {
  const {userId, profile, setHasUnreadMessages} = useProfile();
  const jwtToken = profile?.jwtToken;
  const {conversation} = route.params;
  const navigation = useNavigation();

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const conversationId = conversation.id;

  const otherUser =
    conversation.profile1.userId === userId
      ? conversation.profile2
      : conversation.profile1;

  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const scrollViewRef = useRef();

  useEffect(() => {
    track(`Viewed chat: ${conversationId}`, {
      targetUserId: userId,
    });
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardOpen(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardOpen(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    // Set chat as active when screen is mounted
    const markChatActive = async () => {
      try {
        await axios.post(
          'https://marhaba-server.onrender.com/api/conversation/active',
          {
            userId,
            conversationId,
          },
        );
        console.log('✅ Active chat set');
      } catch (err) {
        console.error('❌ Failed to set active chat:', err);
      }
    };

    // Set chat as inactive when screen unmounts
    const markChatInactive = async () => {
      try {
        await axios.post(
          'https://marhaba-server.onrender.com/api/conversation/inactive',
          {
            userId,
          },
        );
        console.log('📴 Chat marked inactive');
      } catch (err) {
        console.error('❌ Failed to set inactive chat:', err);
      }
    };

    markChatActive();

    return () => {
      markChatInactive();
    };
  }, [conversationId]);

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

  const sendOpeningPrompt = async prompt => {
    setTextMessage(prompt);
    await sendMessage();
  };

  const sendMessage = async () => {
    console.log('the other user: ', otherUser);
    const socket = getSocket();
    if (!textMessage.trim() || !socket?.connected) return;

    const previewText =
      textMessage.length > 20
        ? textMessage.slice(0, 20).trim() + '...'
        : textMessage;

    const newMessage = {
      conversationId,
      senderId: userId,
      receiverId: otherUser.userId,
      text: textMessage,
      createdAt: new Date().toISOString(),
    };

    socket.emit('sendMessage', newMessage);
    track(`Sent message in chat: ${conversationId}`, {
      targetUserId: userId,
    });

    try {
      // ✅ Step 1: Get other user's profile
      const res = await axios.get(
        `https://marhaba-server.onrender.com/api/user/${otherUser.userId}`,
      );
      const recipientProfile = res.data?.data[0];
      console.log('recipientProfile: ', recipientProfile);
      // ✅ Step 2: Check their notification setting and activeChat status
      const wantsMessages = recipientProfile?.Notifications?.[0]?.messages;
      const isNotInChat = recipientProfile?.activeChat !== conversationId;
      console.log('wantsMessages: ', wantsMessages);
      console.log('isNotInChat: ', isNotInChat);

      if (wantsMessages && isNotInChat) {
        // ✅ Step 3: Send the push
        await axios.post(
          'https://marhaba-server.onrender.com/api/notifications/send',
          {
            token: recipientProfile.apnToken,
            title: `New Message: ${profile.name}`,
            body: `${previewText}`,
          },
        );
        console.log('📤 Message notification sent');
      } else {
        console.log('🔕 Skipped push – user is actively in chat or opted out');
      }
    } catch (err) {
      console.error('❌ Failed to fetch profile or send push:', err);
    }
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
          {messages.length === 0 && (
            <View style={tailwind`mb-4`}>
              <Text style={tailwind`text-gray-600 mb-2 text-base`}>
                Not sure how to start the conversation?
              </Text>
              {openingPrompts.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => sendOpeningPrompt(prompt)}
                  style={tailwind`bg-blue-100 p-3 rounded-xl mb-2`}>
                  <Text style={tailwind`text-gray-800 text-base`}>
                    {prompt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={[
              tailwind`flex-row items-center border-t border-gray-700 p-3 ${
                isKeyboardOpen ? 'mb-0' : 'mb-10'
              }`,
              {
                backgroundColor: themeColors.secondary,
              },
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
