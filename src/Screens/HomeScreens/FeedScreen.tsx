import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useLayoutEffect, useState} from 'react';
import {Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {
  clearSession,
  clearUserId,
  getUserId,
  setProfile,
} from '../../Services/AuthStoreage';
import FeedSummaryComponent from '../../Components/Profiles/FeedProfileComponent';
import {useProfile} from '../../Context/ProfileContext';
import FeedProfileComponent from '../../Components/Profiles/FeedProfileComponent';
import {ArrowLeft, Heart} from 'react-native-feather';

const FeedScreen = () => {
  const navigation = useNavigation();
  const {setUserProfile, userProfile} = useProfile();
  const [totalLikes, setTotalLikes] = useState<number>(10);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likes, setLikes] = useState<number>(10);

  const [showFullProfile, setShowFullProfile] = useState<boolean>(false);
  const [matchedProfile, setMatchedProfile] = useState<any>(null);
const [showMatchModal, setShowMatchModal] = useState(false);

  useLayoutEffect(() => {
    grabAllUserProfiles();
    grabuserProfile();
  }, []);

  const handleToggleFullProfile = () => {
    setShowFullProfile(!showFullProfile);
  };

  const grabAllUserProfiles = async () => {
    console.log('about to grab all users');
    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/user/allUsers`,
      );
      if (response.data) {
        setMatches(response.data.data); // ✅ access .data inside the object
        setSelectedProfile(response.data.data[0]);
        setLoading(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const grabuserProfile = async () => {
    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/user/${getUserId()}`,
      );

      if (response.data) {
        setProfile(JSON.stringify(response.data));
        setUserProfile(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status outside 2xx
          console.error('❌ API Error Response:', {
            status: error.response.status,
            data: error.response.data,
          });
        } else if (error.request) {
          // Request made but no response
          console.error('❌ No response from server:', error.request);
        } else {
          // Something else happened
          console.error('❌ Axios Error:', error.message);
        }
      } else {
        console.error('❌ Non-Axios Error:', error);
      }
    }
  };

  const updateMatchStatus = async (interactionId: number) => {
    try {
      await axios.put(`https://marhaba-server.onrender.com/api/user/approved`, {
        id:interactionId
      });
      console.log(`✅ Approved match`);
    } catch (error) {
      console.error(`❌ Error approving match:`, error);
    }
  };

  const createConversation = async (profileId: string) => {
    try {
      await axios.post(`https://marhaba-server.onrender.com/api/conversation/create`, {
        userId: getUserId(), 
        userId2: profileId, 
        lastMessage: '', 
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ Created conversation with ${profileId}`);
    } catch (error) {
      console.error(`❌ Error creating conversation with ${profileId}:`, error);
    }
  };

  const dislikeProfile = async (profileId: string) => {
    console.log(`disliked profile: ${profileId}`);
    removeTopProfile();
  };

  const likeProfile = async (profileId: string, profile: any) => {
    try {
      // Check if already liked
      const checkRes = await axios.get(
        `https://marhaba-server.onrender.com/api/user/matchStatus/${getUserId()}/${profileId}`,
      );
  
      console.log('checkRes', checkRes.data);
      if (checkRes.data) {
        console.log(`🟢 Already interacted with profile: ${profileId}`);
        updateMatchStatus(checkRes.data.data[0].id);
        createConversation(profileId);
        setMatchedProfile(profile);
        setShowMatchModal(true);
        return;
      }
  
      // Proceed to like
      const response = await axios.post(
        `https://marhaba-server.onrender.com/api/user/interaction`,
        {
          userId: getUserId(),
          targetUserId: profileId,
          interaction: 'liked',
          viewed: false,
          approved: false,
        }
      );
  
      if (response.data?.success) {
        console.log(`✅ Successfully disliked profile: ${profileId}`);
        removeTopProfile();

        // Check for match
      }
    } catch (error) {
      console.error(`❌ Error liking profile ${profileId}:`, error);
    }
  };

  const superLikeProfile = async (profileId: string, message?: string, profile: any) => {
    console.log(`Liking profile: ${profileId}`);
    
    try {

      const checkRes = await axios.get(
        `https://marhaba-server.onrender.com/api/user/matchStatus/${getUserId()}/${profileId}`,
      );
  
      if (checkRes.data?.data.legnth > 0) {
        console.log(`🟢 Already interacted with profile: ${profileId}`);
        updateMatchStatus(checkRes.data.data[0].id);
        createConversation(profileId);
        setMatchedProfile(profile);
        setShowMatchModal(true);
        return;
      }

      const response = await axios.post(
        `https://marhaba-server.onrender.com/api/user/interaction`,
        {
          userId: getUserId(),
          targetUserId: profileId,
          interaction: 'super',
          viewed: false,
          approved: false,
          message: message,
        },
      );
      if (response.data?.success) {
        console.log(`✅ Successfully liked profile: ${profileId}`);
        removeTopProfile();
        setLikes(prev => prev - 1);
      } else {
        console.error(
          `⚠️ Server responded but like was not successful for ${profileId}:`,
          response.data,
        );
      }
    } catch (error) {
      console.error(`❌ Error liking profile ${profileId}:`, error);
    }
  };


  const removeTopProfile = () => {
    setMatches(prevMatches => {
      const newMatches = prevMatches?.length ? prevMatches.slice(1) : [];
      setSelectedProfile(newMatches[0] || null); // ✅ Update the selected profile
      return newMatches;
    });
  };

  return (
    <View
      style={[
        tailwind`w-full h-full`,
        {backgroundColor: themeColors.secondary},
      ]}>
      {
        !showFullProfile && (

      <View
        style={tailwind`absolute w-full flex flex-row justify-end z-10 top-18 px-6`}>
        <View
          style={[
            tailwind`flex-row items-center p-2 rounded-full`,
            {
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderWidth: 1,
              borderColor: themeColors.primary, // ✅ green border
            },
          ]}>
          <Heart
            height={20}
            width={20}
            fill={themeColors.primary}
            color={themeColors.primary}
            strokeWidth={2.5}
          />
          <Text style={tailwind`ml-2 text-xl font-bold text-green-900`}>
            {likes}
          </Text>
        </View>
      </View>
        )
      }
      <FeedProfileComponent
        profile={selectedProfile}
        dislikeProfile={dislikeProfile}
        likeProfile={likeProfile}
        superlikeProfile={superLikeProfile}
        showFullProfile={showFullProfile}
        setShowFullProfile={setShowFullProfile}
        handleToggleFullProfile={handleToggleFullProfile}
      />
      <Modal
  transparent
  visible={showMatchModal}
  animationType="fade"
  onRequestClose={() => setShowMatchModal(false)}
>
  <View style={tailwind`flex-1 bg-black bg-opacity-60 justify-center items-center px-6`}>
    <View style={[tailwind`rounded-lg p-5 items-center justify-center h-9/12 w-full`, {backgroundColor: themeColors.secondary}]}>
      <Text style={tailwind`text-4xl font-bold text-green-800 mb-2`}>
        You & {matchedProfile?.name}
      </Text>
      <Text style={tailwind`text-3xl font-bold text-green-800 mb-2`}>
        Connected!
      </Text>
      {matchedProfile?.Photos?.[0]?.photoUrl && (
        <Image
          source={{ uri: matchedProfile.Photos[0].photoUrl }}
          style={tailwind`w-11/12 h-7/12 rounded-8 mb-4`}
        />
      )}
      <Text style={tailwind`text-base text-center`}>
        You and {matchedProfile?.name} have liked each other!
      </Text>
      <Text style={tailwind`text-base mb-4 text-center`}>
        You can now start a conversation!
      </Text>
      <View style={tailwind`flex-col justify-between w-full`}>
        <TouchableOpacity
          onPress={() => {
            setShowMatchModal(false);
            removeTopProfile();
            navigation.navigate('Conversation'); // <-- Use the name of your Messages tab here
          }}
          style={tailwind`bg-green-700 px-4 py-4 rounded-md`}>
          <Text style={tailwind`text-white text-center font-semibold text-base`}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowMatchModal(false);
            removeTopProfile(); // go to next profile
          }}
          style={tailwind`p-4 rounded-md`}>
          <Text style={tailwind`text-black text-center font-semibold text-base`}>Next Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
};

export default FeedScreen;
