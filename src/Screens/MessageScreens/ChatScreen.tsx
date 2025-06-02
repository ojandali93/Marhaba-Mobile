// ===== Imports =====
import React, {useState, useEffect, useRef, useCallback} from 'react';
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
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {
  ArrowUp,
  ChevronsLeft,
  User,
  Settings,
  MessageSquare,
} from 'react-native-feather';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useProfile} from '../../Context/ProfileContext';
import {
  getSocket,
  joinConversationRoom,
  leaveConversationRoom,
} from '../../Services/socket';
import {track} from '@amplitude/analytics-react-native';

// ===== Component =====
const ChatScreen = ({route}) => {
  const {
    userId: currentUserId,
    profile,
    setHasUnreadMessages,
    fetchUnreadMessages,
  } = useProfile();
  const jwtToken = profile?.jwtToken;
  const {conversation} = route.params;
  const navigation = useNavigation();

  const conversationId = conversation.id;
  const otherUser =
    conversation.profile1.userId === currentUserId
      ? conversation.profile2
      : conversation.profile1;

  const [chatMode, setChatMode] = useState('standard');
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Deep Questions State
  const [layeredQuestions, setLayeredQuestions] = useState([]);
  const [unlockedQuestions, setUnlockedQuestions] = useState([]);
  const [myAnswer, setMyAnswer] = useState('');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [isProcessingLeave, setIsProcessingLeave] = useState(false);

  const scrollViewRef = useRef();

  // Setup listeners
  useEffect(() => {
    track(`Viewed chat: ${conversationId}`, {targetUserId: currentUserId});
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

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchLayeredQuestions();
    } catch (err) {
      console.error('❌ Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Load messages
  useEffect(() => {
    const markChatActive = async () => {
      await axios.post(
        'https://marhaba-server.onrender.com/api/conversation/active',
        {
          userId: currentUserId,
          conversationId,
        },
      );
    };
    const markChatInactive = async () => {
      await axios.post(
        'https://marhaba-server.onrender.com/api/conversation/inactive',
        {
          userId: currentUserId,
        },
      );
    };
    const fetchMessages = async () => {
      const res = await axios.get(
        `https://marhaba-server.onrender.com/api/conversation/messages/${conversationId}`,
      );
      setMessages(res.data.data || []);
    };

    markChatActive();
    fetchMessages();
    markMessagesAsRead();

    return () => {
      markChatInactive();
    };
  }, [conversationId]);

  const markMessagesAsRead = async () => {
    await axios.put(
      'https://marhaba-server.onrender.com/api/conversation/read',
      {
        conversationId,
        userId: currentUserId,
      },
    );
    fetchUnreadMessages(jwtToken, currentUserId);
  };

  // Socket setup
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !jwtToken || !currentUserId) return;

    const onNewMessage = async newMessage => {
      const isActive = newMessage.conversationId === conversationId;
      if (isActive) {
        await axios.put(
          `https://marhaba-server.onrender.com/api/conversation/read`,
          {
            conversationId,
            userId: currentUserId,
          },
        );
        setMessages(prev => [...prev, newMessage]);
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
  }, [conversationId, jwtToken, currentUserId]);

  // Deep Questions: Fetch when chatMode === 'deep'
  useFocusEffect(
    useCallback(() => {
      if (chatMode === 'deep') {
        fetchLayeredQuestions();
      }
    }, [chatMode, conversationId]),
  );

  const fetchLayeredQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const res = await axios.get(
        `https://marhaba-server.onrender.com/api/conversation/questions/${conversationId}`,
      );
      console.log('🔍 Layered Questions:', JSON.stringify(res.data, null, 2));
      const questions = res.data?.data || [];
      setLayeredQuestions(questions);

      const unlocked = questions
        .filter(q => q.locked === false)
        .sort((a, b) => a.question_number - b.question_number);

      setUnlockedQuestions(unlocked);
    } catch (err) {
      console.error('❌ Failed to fetch layered questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Get latest unlocked question
  const currentQuestion =
    unlockedQuestions.length > 0
      ? unlockedQuestions[unlockedQuestions.length - 1]
      : null;

  // Submit answer
  const submitAnswer = async () => {
    if (!myAnswer.trim() || !currentQuestion) return;
    try {
      await axios.post(
        'https://marhaba-server.onrender.com/api/conversation/questions/update',
        {
          questionId: currentQuestion.id,
          userId: currentUserId,
          answer: myAnswer,
          conversationId,
          currentQuestionLevel: currentQuestion.question_number,
        },
      );
      await fetchLayeredQuestions();
      setMyAnswer('');
    } catch (err) {
      console.error('❌ Failed to submit answer:', err);
    }
  };

  // Helpers
  const hasIAnswered = question => {
    if (!question) return false;
    return currentUserId === conversation.user1Id
      ? question.user1_answered
      : question.user2_answered;
  };

  const hasOtherUserAnswered = question => {
    if (!question) return false;
    return currentUserId === conversation.user1Id
      ? question.user2_answered
      : question.user1_answered;
  };

  const getOtherUserAnswer = question => {
    if (!question) return '';
    return currentUserId === conversation.user1Id
      ? question.user2_answer
      : question.user1_answer;
  };

  // Send normal message
  const sendMessage = async () => {
    const socket = getSocket();
    if (!textMessage.trim() || !socket?.connected) return;

    const newMessage = {
      conversationId,
      senderId: currentUserId,
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

  const handleLeaveConversation = async () => {
    setIsProcessingLeave(true);
    try {
      await axios.post(
        'https://marhaba-server.onrender.com/api/conversation/lock',
        {
          conversationId,
        },
      );
      navigation.goBack();
    } catch (err) {
      console.error('❌ Failed to leave conversation:', err);
    } finally {
      setIsProcessingLeave(false);
    }
  };

  // ========== RENDER ==========
  return (
    <View style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <SafeAreaView
        style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
        {/* HEADER */}
        <View
          style={tailwind`p-4 border-b border-gray-700 flex-row items-center justify-between`}>
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
          <View style={tailwind`flex-row items-center`}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SingleProfile', {profile: otherUser})
              }>
              <User color={themeColors.primary} height={24} width={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowSettingsModal(true)}
              style={tailwind`ml-3`}>
              <Settings color={'black'} height={24} width={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* CHAT MODE SWITCH */}
        <View style={tailwind`flex-row border-b border-gray-700`}>
          <TouchableOpacity
            onPress={() => setChatMode('standard')}
            style={[
              tailwind`flex-1 py-2`,
              {
                borderBottomWidth: chatMode === 'standard' ? 2 : 0,
                borderBottomColor: themeColors.primary,
              },
            ]}>
            <Text style={tailwind`text-center font-semibold text-base`}>
              Conversation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setChatMode('deep')}
            style={[
              tailwind`flex-1 py-2`,
              {
                borderBottomWidth: chatMode === 'deep' ? 2 : 0,
                borderBottomColor: themeColors.primary,
              },
            ]}>
            <Text style={tailwind`text-center font-semibold text-base`}>
              Deep Questions
            </Text>
          </TouchableOpacity>
        </View>

        {/* BODY */}
        {chatMode === 'standard' ? (
          <ScrollView
            ref={scrollViewRef}
            style={tailwind`flex-1 px-3 py-2`}
            contentContainerStyle={tailwind`pb-3 flex-grow`}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({animated: true})
            }>
            {messages.length === 0 ? (
              <View style={tailwind`mt-10 items-center`}>
                <Text
                  style={tailwind`text-lg font-semibold mb-4 text-gray-600`}>
                  Break the ice!
                </Text>

                {[
                  "What's your favorite travel destination?",
                  "What's your go-to comfort food?",
                  'Tell me a fun fact about yourself!',
                  "What's a hobby you'd love to try?",
                ].map((icebreaker, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setTextMessage(icebreaker)}
                    style={[
                      tailwind`mb-3 px-4 py-2 border bg-teal-100 rounded-full`,
                      {borderColor: themeColors.primary},
                    ]}>
                    <Text
                      style={[
                        tailwind`text-center`,
                        {color: themeColors.primary},
                      ]}>
                      {icebreaker}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.sender === currentUserId;
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
              })
            )}
          </ScrollView>
        ) : (
          <View style={{flex: 1}}>
            <ScrollView
              style={tailwind`flex-1 px-4 py-4`}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={themeColors.primary}
                />
              }>
              <View style={tailwind`flex-row items-center justify-center mb-4`}>
                <Image
                  source={{uri: profile?.Photos?.[0]?.photoUrl}}
                  style={tailwind`w-14 h-18 rounded-2`}
                />
                <View style={tailwind`mx-2`}>
                  <MessageSquare
                    color={themeColors.primary}
                    height={24}
                    width={24}
                  />
                </View>
                <Image
                  source={{uri: otherUser?.Photos?.[0]?.photoUrl}}
                  style={tailwind`w-14 h-18 rounded-2`}
                />
              </View>
              {loadingQuestions ? (
                <Text style={tailwind`text-center text-gray-500`}>
                  Loading questions...
                </Text>
              ) : unlockedQuestions.length > 0 ? (
                unlockedQuestions.map((q, index) => (
                  <View key={q.id} style={tailwind`mb-5`}>
                    <Text style={tailwind`font-semibold mb-2`}>
                      Question {q.question_number}: {q.question_text}
                    </Text>

                    {/* Other User Answer */}
                    {hasOtherUserAnswered(q) ? (
                      <View
                        style={tailwind`self-start max-w-[75%] bg-gray-400 p-3 rounded-lg mb-2`}>
                        <Text style={tailwind`text-white`}>
                          {getOtherUserAnswer(q)}
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={tailwind`text-base italic text-gray-500 mb-2 bg-gray-300 p-2 rounded-lg`}>
                        {otherUser.name} has not answered yet.
                      </Text>
                    )}

                    {/* My Answer */}
                    {(currentUserId === conversation.user1Id &&
                      q.user1_answered) ||
                    (currentUserId !== conversation.user1Id &&
                      q.user2_answered) ? (
                      <View
                        style={[
                          tailwind`self-end max-w-[75%] p-3 rounded-lg mb-2`,
                          {backgroundColor: themeColors.primary},
                        ]}>
                        <Text style={tailwind`text-white`}>
                          {currentUserId === conversation.user1Id
                            ? q.user1_answer
                            : q.user2_answer}
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={tailwind`text-base italic text-gray-500 mb-2`}>
                        You have not answered yet.
                      </Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={tailwind`text-center text-gray-500`}>
                  No unlocked questions yet.
                </Text>
              )}
            </ScrollView>
          </View>
        )}

        {/* INPUT */}
        {chatMode === 'standard' ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View
              style={[
                tailwind`flex-row items-center border-t border-gray-700 p-3 ${
                  isKeyboardOpen ? 'mb-0' : 'mb-10'
                }`,
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
                style={[
                  tailwind`ml-2 bg-blue-500 p-2.3 rounded-2`,
                  {backgroundColor: themeColors.primary},
                ]}>
                <ArrowUp color={'white'} height={24} width={24} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View
              style={[
                tailwind`flex-row items-center border-t border-gray-700 p-3 ${
                  isKeyboardOpen ? 'mb-0' : 'mb-10'
                }`,
                {backgroundColor: themeColors.secondary},
              ]}>
              <TextInput
                value={myAnswer}
                onChangeText={setMyAnswer}
                placeholder="Type your answer..."
                placeholderTextColor={'grey'}
                style={tailwind`flex-1 bg-gray-300 p-3 pb-4 rounded-2 text-base/5`}
                returnKeyType="send"
                onSubmitEditing={submitAnswer}
              />
              <TouchableOpacity
                onPress={submitAnswer}
                style={[
                  tailwind`ml-2 bg-blue-500 p-2.3 rounded-2`,
                  {backgroundColor: themeColors.primary},
                ]}>
                <ArrowUp color={'white'} height={24} width={24} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
        {showSettingsModal && (
          <View
            style={tailwind`absolute inset-0 bg-black/60 items-center justify-center px-6`}>
            <View style={tailwind`bg-white w-full rounded-2xl p-5`}>
              <Text style={tailwind`text-xl font-semibold mb-4 text-center`}>
                Conversation Options
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setShowSettingsModal(false);
                  // TODO: Hook this to your report flow
                  Alert.alert('Report User functionality coming soon.');
                }}
                style={tailwind`mb-3 bg-gray-100 border border-gray-400 px-4 py-3 rounded-xl`}>
                <Text style={tailwind`text-grey-600 text-center font-semibold`}>
                  Report User
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowSettingsModal(false);
                  setShowConfirmLeave(true);
                }}
                style={tailwind`mb-3 bg-red-400 border border-red-400 px-4 py-3 rounded-xl`}>
                <Text style={tailwind`text-white text-center font-semibold`}>
                  Leave Conversation
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowSettingsModal(false)}
                style={tailwind`mt-2 px-4 py-2 rounded-xl`}>
                <Text style={tailwind`text-center text-blue-600 font-semibold`}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {showConfirmLeave && (
          <View
            style={tailwind`absolute inset-0 bg-black/60 items-center justify-center px-6`}>
            <View style={tailwind`bg-white w-full rounded-2xl p-5`}>
              <Text
                style={tailwind`text-xl font-semibold mb-4 text-center text-red-600`}>
                Are you sure you want to leave this conversation?
              </Text>
              <Text style={tailwind`text-center mb-6 text-gray-600`}>
                This will permanently delete this conversation and messages.
              </Text>

              <TouchableOpacity
                disabled={isProcessingLeave}
                onPress={handleLeaveConversation}
                style={tailwind`mb-3 bg-red-500 px-4 py-3 rounded-xl`}>
                <Text style={tailwind`text-white text-center font-semibold`}>
                  {isProcessingLeave ? 'Leaving...' : 'Yes, Leave Conversation'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowConfirmLeave(false)}
                style={tailwind`mt-2 px-4 py-2 rounded-xl`}>
                <Text style={tailwind`text-center text-blue-600 font-semibold`}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default ChatScreen;
