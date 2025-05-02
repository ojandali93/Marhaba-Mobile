import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import { io } from 'socket.io-client';
import axios from 'axios';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import { ArrowUp, ChevronsLeft, Info } from 'react-native-feather';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../Context/ProfileContext';

let socket;

const ChatScreen = ({ route }) => {
  const {userId, jwtToken} = useProfile();
  const { conversation } = route.params; 
  const navigation  = useNavigation();
  const conversationId = conversation.id;
  const otherUser = conversation.profile1.userId === userId ? conversation.profile2 : conversation.profile1;

  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const scrollViewRef = useRef();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    const fetchPreviousMessages = async () => {
      try {
        const response = await axios.get(`https://marhaba-server.onrender.com/api/conversation/messages/${conversationId}`);
        if (response.data && response.data.data) {
          setMessages(response.data.data);
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
          }, 100);
        }
      } catch (err) {
        console.error('❌ Error fetching old messages:', err);
      }
    };

    fetchPreviousMessages();

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 30,
          height: 60,
          backgroundColor: themeColors.darkSecondary,
          paddingBottom: 10,
          paddingTop: 10,
          marginBottom: 8,
          marginLeft: 18,
          marginRight: 18,
          shadowColor: themeColors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
      });
    };
  }, [navigation]);

  useEffect(() => {
    const setupSocket = async () => {
      const token = jwtToken;
      socket = io('https://marhaba-server.onrender.com', {
        auth: { token },
      });

      socket.on('connect', () => {
        console.log('✅ Connected to socket');
        socket.emit('joinConversation', { conversationId });
      });

      socket.on('newMessage', (newMessage) => {
        console.log('📩 New real-time message:', newMessage);
        if (newMessage.conversationId === conversationId) {
          setMessages((prev) => [...prev, newMessage]);
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      });
    };

    setupSocket();

    return () => {
      socket.emit('leaveConversation', { conversationId });
      socket.off();
    };
  }, [conversationId]);

  const createViewed = async (profileId: string, otherUser: any) => {
    try {
      await axios.post(`https://marhaba-server.onrender.com/api/viewed/create`, {
        viewer: userId, 
        viewed: profileId
      });
      console.log(`✅ Created viewed with ${profileId}`);
      navigation.navigate('SingleProfile', { profile: otherUser })
    } catch (error) {
      console.error(`❌ Error creating conversation with ${profileId}:`, error);
    }
  };

  const sendMessage = () => {
    if (!textMessage.trim()) return;

    const newMessage = {
      conversationId,
      senderId: userId(),
      receiverId: otherUser.userId,
      text: textMessage,
      createdAt: new Date().toISOString(),
    };

    socket.emit('sendMessage', newMessage);
    setTextMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <View style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>

      <SafeAreaView  style={[tailwind`flex-1`, { backgroundColor: themeColors.secondary }]}>
        <View style={[tailwind`p-4 border-b border-gray-700 flex-row items-center justify-between`, { backgroundColor: themeColors.secondary }]}>
          <View style={tailwind`flex-row items-center`}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronsLeft color={themeColors.primary} height={24} width={24} />
            </TouchableOpacity>
            <Text style={tailwind`text-2xl font-bold text-gray-800 ml-2`}>
              {otherUser.name}
            </Text>
          </View>
          <TouchableOpacity onPress={() => createViewed(otherUser.userId, otherUser)}>
            <Info color={themeColors.primary} height={24} width={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={[tailwind`flex-1 px-3 py-2`, { backgroundColor: themeColors.secondary }]}
          contentContainerStyle={tailwind`pb-3`}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, idx) => {
            const isMe = msg.sender === userId; // ✅ CORRECT NOW
            return (
              <View
                key={idx}
                style={[
                  tailwind`my-2 max-w-[75%] p-3 rounded-lg`,
                  isMe ? tailwind`bg-blue-500 self-end` : tailwind`bg-stone-400 self-start`,
                ]}
              >
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
          keyboardVerticalOffset={60}
        >
          <View style={[tailwind`flex-row items-center border-t border-gray-700 p-3`, { backgroundColor: themeColors.secondary }]}>
            <TextInput
              value={textMessage}
              onChangeText={setTextMessage}
              placeholder="Type a message..."
              placeholderTextColor={'grey'}
              style={tailwind`flex-1 bg-gray-300 p-3 pb-4 rounded-2 text-base/5`}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage} style={tailwind`ml-2 bg-blue-500 p-2.3 rounded-2`}>
              <ArrowUp color={'white'} height={24} width={24} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ChatScreen;
