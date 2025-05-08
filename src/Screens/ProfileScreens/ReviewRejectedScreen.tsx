import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';
import {TextInput} from 'react-native-gesture-handler';
import {ChevronsDown, ChevronsUp} from 'react-native-feather';
import {pickImageFromGallery} from '../../Utils/Functions/ImageFunctions';

const ReviewRejectedScreen = () => {
  const {
    userId,
    profile,
    removeSession,
    removeUserId,
    removeProfile,
    checkAuthenticated,
  } = useProfile();
  const [reviewData, setReviewData] = useState<any>(null);
  const [expandedTab, setExpandedTab] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [uploadedImageUrls, setUploadedImageUrls] = useState<(string | null)[]>(
    () => (profile?.Photos || []).map(p => p.photoUrl),
  );
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(9).fill(false),
  );

  const handleTriggerUpdateTab = (tab: string) => {
    if (expandedTab === tab) {
      setExpandedTab('');
    } else {
      setExpandedTab(tab);
    }
  };

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const res = await axios.get(
          `https://marhaba-server.onrender.com/api/admin/reviewInfo/${profile.userId}`,
        );
        setReviewData(res.data.data[0]);
      } catch (err) {
        console.error('❌ Error fetching review details:', err);
      }
    };

    if (profile?.approved === 'rejected') {
      fetchReviewDetails();
    }
  }, [profile]);

  const logout = async () => {
    try {
      await removeSession();
      await removeUserId();
      await removeProfile();
      await checkAuthenticated();
    } catch (err) {
      console.error('❌ Logout exception:', err);
    }
  };

  const flaggedUrls = reviewData?.flaggedPhotos || [];
  const photoUrls = (profile?.Photos || []).map(p => p.photoUrl);
  const totalSlots = 9;

  useEffect(() => {
    console.log('🔴 Uploaded image urls:', uploadedImageUrls);
  }, [uploadedImageUrls]);

  const uploadImageToServer = async (
    localUri: string,
    originalFileName: string,
  ) => {
    try {
      const filePath = localUri.replace('file://', '');

      const formData = new FormData();
      formData.append('file', {
        uri: localUri,
        name: originalFileName || 'photo.jpg',
        type: 'image/jpeg',
      } as any); // 👈 Important for RN

      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/account/upoadImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        },
      );

      if (response.data.success) {
        return response.data.url;
      } else {
        console.error('❌ Upload server error:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Upload failed:', error);
      return null;
    }
  };

  const handlePickImage = async (index: number) => {
    try {
      const image = await pickImageFromGallery();
      if (!image || !image.uri) return;

      setLoadingStates(prev => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });

      const uploadedUrl = await uploadImageToServer(image.uri, image.fileName);

      if (uploadedUrl) {
        setUploadedImageUrls(prev => {
          const updated = [...prev];
          updated[index] = uploadedUrl;
          return updated;
        });
      }
    } catch (error) {
      console.error('Image pick error:', error);
    } finally {
      setLoadingStates(prev => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    }
  };

  const updateRequest = async () => {
    try {
      if (!userId) {
        throw new Error('User ID is not available.');
      }

      // Filter and clean the array (remove nulls or empty strings)
      const filteredPhotos = uploadedImageUrls.filter(
        photo => photo && photo !== 'null' && photo !== '',
      );

      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/account/updatePhotos',
        {
          userId,
          photos: filteredPhotos,
        },
      );

      console.log('🔴 Response:', response.data);

      if (response.data.success) {
        console.log('userId', userId);
        console.log('reviewNotes', reviewNotes);
        const updatedResponse = await axios.put(
          `https://marhaba-server.onrender.com/api/admin/reSubmitProfile`,
          {
            userId,
            message: reviewNotes,
          },
        );

        if (updatedResponse.data.success) {
          Alert.alert('Submission Status', 'Profile resubmitted successfully', [
            {
              text: 'OK',
              onPress: () => {
                logout();
              },
            },
          ]);
        } else {
          console.warn('⚠️ Failed to update profile:', response.data.error);
          return;
        }
      } else {
        console.warn('⚠️ Failed to update photos:', response.data.error);
        return;
      }
    } catch (error) {
      console.error('❌ Error updating photos:', error.message || error);
      return;
    }
  };

  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <ScrollView contentContainerStyle={tailwind`px-4 py-6`}>
        <Text style={tailwind`text-2xl font-bold text-red-600 mb-2`}>
          Your profile was rejected
        </Text>
        <Text style={tailwind`text-base text-gray-700 mb-4`}>
          Please update the flagged items below and resubmit for approval.
        </Text>

        {reviewData?.note && (
          <View style={tailwind`mt-6`}>
            <Text style={tailwind`text-lg font-bold text-red-600 mb-1`}>
              Admin Notes:
            </Text>
            <Text style={tailwind`text-gray-700`}>{reviewData.note}</Text>
          </View>
        )}

        <View style={tailwind`flex-col justify-between pb-1`}>
          <Text style={tailwind`text-2xl font-semibold `}>
            Reviewer Message
          </Text>
          <Text style={tailwind`text-gray-800 text-base `}>
            Leave a mesage for the reviewer
          </Text>
          <View style={tailwind`px-2`}>
            <TextInput
              style={[
                tailwind`text-gray-800 text-base my-2 p-3 rounded-2`,
                {backgroundColor: themeColors.secondaryHighlight},
              ]}
              value={reviewNotes}
              onChangeText={setReviewNotes}
              placeholder="Enter your message here"
              placeholderTextColor={'black'}
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>

        <View
          style={[
            tailwind`w-full flex flex-row items-center mb-3 mt-2 p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Photos
          </Text>
        </View>

        <View style={tailwind`px-3 rounded-2`}>
          <Text style={tailwind`text-base text-gray-700 mb-2`}>
            The photos that are highlighted in red are the ones that were
            flagged as inappropriate and need to be replaced.
          </Text>
          <Text style={tailwind`text-base text-gray-700 mb-2`}>
            If you feel like the photos are not inappropriate, you can ignore
            the flag and leave a note for the review before you resubmit for
            approval.
          </Text>
        </View>
        {/* Image Grid */}
        <View style={tailwind`flex-row flex-wrap justify-between`}>
          {Array.from({length: totalSlots}).map((_, index) => {
            const uri = uploadedImageUrls[index];
            const isFlagged = uri && flaggedUrls.includes(uri);
            return (
              <TouchableOpacity
                key={index}
                style={tailwind`w-1/3 h-52 p-1`}
                onPress={() => handlePickImage(index)}>
                <View
                  style={[
                    tailwind`w-full h-full rounded overflow-hidden items-center justify-center`,
                    isFlagged && {
                      borderColor: 'red',
                      borderWidth: 2,
                    },
                  ]}>
                  {loadingStates[index] ? (
                    <ActivityIndicator
                      size="large"
                      color={themeColors.primary}
                    />
                  ) : uri ? (
                    <Image
                      source={{uri}}
                      style={tailwind`w-full h-full`}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={tailwind`w-full h-full bg-gray-300 rounded`} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => handleTriggerUpdateTab('prompts')}
          style={[
            tailwind`w-full flex flex-row justify-between items-center mb-3 mt-2 p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Prompts
          </Text>
          {expandedTab === 'prompts' ? (
            <ChevronsUp height={24} width={24} color={themeColors.primary} />
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </TouchableOpacity>

        {expandedTab === 'prompts' && (
          <View>
            {(profile?.Prompts || []).map((p, idx) => (
              <View key={p.id} style={tailwind`mb-4 px-2`}>
                <Text style={tailwind`text-gray-800 text-base pb-2 italic`}>
                  {p.prompt}
                </Text>
                <Text style={tailwind`text-gray-700 text-lg font-semibold`}>
                  {p.response}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleTriggerUpdateTab('profileInfo')}
          style={[
            tailwind`w-full flex flex-row items-center justify-between mb-3 mt-2 p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Profile Info
          </Text>
          {expandedTab === 'profileInfo' ? (
            <ChevronsUp height={24} width={24} color={themeColors.primary} />
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </TouchableOpacity>

        {expandedTab === 'profileInfo' && (
          <View style={tailwind`flex-1 px-2`}>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Name</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.name || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Gender</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.gender || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Height</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.height || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Smoke</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.smoke || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Drink</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.drink || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Has Kids</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.hasKids || 'Not Specified'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleTriggerUpdateTab('essentials')}
          style={[
            tailwind`w-full flex flex-row items-center justify-between mb-3 mt-2 p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Essential Info
          </Text>
          {expandedTab === 'essentials' ? (
            <ChevronsUp height={24} width={24} color={themeColors.primary} />
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </TouchableOpacity>

        {expandedTab === 'essentials' && (
          <View style={tailwind`flex-1 px-2`}>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Looking For</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.About[0].lookingFor || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Timeline</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.About[0].timeline || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Background</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.About[0].background || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Religion</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.About[0].religion || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Sect</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.About[0].sect || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Views</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.About[0].views || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>
                Willing to relocate
              </Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.About[0].travel || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Wants Kids</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.About[0].wantsKids || 'Not Specified'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleTriggerUpdateTab('core')}
          style={[
            tailwind`w-full flex flex-row items-center justify-between mb-3 mt-2 p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Core Info
          </Text>
          {expandedTab === 'core' ? (
            <ChevronsUp height={24} width={24} color={themeColors.primary} />
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </TouchableOpacity>

        {expandedTab === 'core' && (
          <View style={tailwind`flex-1 px-2`}>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Family</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Core[0].family || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Faith</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Core[0].faith || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Trust</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Core[0].trust || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Honesty</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Core[0].honest || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Transparency</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Core[0].transparent || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>
                Career Ambition
              </Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Core[0].career || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>
                Financial Ambition
              </Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Core[0].ambition || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Socializing</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Core[0].social || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Politics</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Core[0].politics || 'Not Specified'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleTriggerUpdateTab('lifestyle')}
          style={[
            tailwind`w-full flex flex-row items-center justify-between mb-3 mt-2 p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Lifestyle
          </Text>
          {expandedTab === 'lifestyle' ? (
            <ChevronsUp height={24} width={24} color={themeColors.primary} />
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </TouchableOpacity>

        {expandedTab === 'lifestyle' && (
          <View style={tailwind`flex-1 px-2`}>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Health</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Lifestyle[0].health || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Living</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Lifestyle[0].living || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Social</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Lifestyle[0].social || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Travel</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Lifestyle[0].travel || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Finances</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Lifestyle[0].finances || 'Not Specified'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleTriggerUpdateTab('future')}
          style={[
            tailwind`w-full flex flex-row items-center justify-between mb-3 mt-2 p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Future
          </Text>
          {expandedTab === 'future' ? (
            <ChevronsUp height={24} width={24} color={themeColors.primary} />
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </TouchableOpacity>

        {expandedTab === 'future' && (
          <View style={tailwind`flex-1 px-2`}>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Marriage</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Future[0].mariiage || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Children</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Future[0].children || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Career</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Future[0].career || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Finances</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Future[0].finances || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Pace</Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Future[0].pace || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>
                Long Term Living
              </Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Future[0].living || 'Not Specified'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleTriggerUpdateTab('career')}
          style={[
            tailwind`w-full flex flex-row items-center justify-between mb-3 mt-2 p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Career & Background
          </Text>
          {expandedTab === 'career' ? (
            <ChevronsUp height={24} width={24} color={themeColors.primary} />
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </TouchableOpacity>

        {expandedTab === 'career' && (
          <View style={tailwind`flex-1 px-2`}>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Job</Text>
              <Text
                style={tailwind`max-w-2/3 text-gray-800 text-xl font-semibold`}>
                {profile.Career[0].job || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Company</Text>
              <Text
                style={tailwind`max-w-2/3 text-gray-800 text-xl font-semibold`}>
                {profile.Career[0].company || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Education</Text>
              <Text
                style={tailwind`max-w-2/3 text-gray-800 text-xl font-semibold`}>
                {profile.Career[0].education || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Location</Text>
              <Text
                style={tailwind`max-w-2/3 text-gray-800 text-xl font-semibold`}>
                {profile.Career[0].location || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>On Site</Text>
              <Text
                style={tailwind`max-w-2/3 text-gray-800 text-xl font-semibold`}>
                {profile.Career[0].site || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>fiveYear</Text>
              <Text
                style={tailwind`max-w-2/3 text-gray-800 text-xl font-semibold`}>
                {profile.Career[0].fiveYear || 'Not Specified'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleTriggerUpdateTab('hobbies')}
          style={[
            tailwind`w-full flex flex-row items-center justify-between mb-3 mt-2 p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Hobbies & Traits
          </Text>
          {expandedTab === 'hobbies' ? (
            <ChevronsUp height={24} width={24} color={themeColors.primary} />
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </TouchableOpacity>

        {expandedTab === 'hobbies' && (
          <View style={tailwind`flex-1 px-2`}>
            {profile.Tags.map((hobby, index) => (
              <View
                key={index}
                style={[
                  tailwind`flex-row items-center justify-center py-2 rounded-2 mb-2`,
                  {backgroundColor: themeColors.secondaryHighlight},
                ]}>
                <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                  {hobby.tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleTriggerUpdateTab('Preferences')}
          style={[
            tailwind`w-full flex flex-row items-center justify-between mb-3 mt-2 p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text
            style={[
              tailwind`text-2xl font-semibold`,
              {color: themeColors.primary},
            ]}>
            Preferences
          </Text>
          {expandedTab === 'Preferences' ? (
            <ChevronsUp height={24} width={24} color={themeColors.primary} />
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </TouchableOpacity>

        {expandedTab === 'Preferences' && (
          <View style={tailwind`flex-1 px-2`}>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Age Range</Text>
              <Text style={tailwind` text-gray-800 text-xl font-semibold`}>
                {profile.Preferences[0].ageMin} -{' '}
                {profile.Preferences[0].ageMax}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Gender</Text>
              <Text style={tailwind` text-gray-800 text-xl font-semibold`}>
                {profile.Preferences[0].gender || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Distance</Text>
              <Text style={tailwind` text-gray-800 text-xl font-semibold`}>
                {profile.Preferences[0].distance || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Background</Text>
              <Text style={tailwind` text-gray-800 text-xl font-semibold`}>
                {profile.Preferences[0].background || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>Religion</Text>
              <Text style={tailwind` text-gray-800 text-xl font-semibold`}>
                {profile.Preferences[0].religion || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>
                Religious Sect.
              </Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Preferences[0].sect || 'Not Specified'}
              </Text>
            </View>
            <View style={tailwind`flex-row items-center justify-between pb-1`}>
              <Text style={tailwind`text-gray-800 text-lg`}>
                Religious Views
              </Text>
              <Text style={tailwind`text-gray-800 text-xl font-semibold`}>
                {profile.Preferences[0].sect || 'Not Specified'}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={updateRequest}
          style={[
            tailwind`w-full flex flex-row items-center justify-center mt-2 py-3 rounded-2`,
            {backgroundColor: themeColors.primary},
          ]}>
          <Text style={tailwind`text-lg text-white font-semibold`}>
            Resubmit For Approval
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity onPress={logout} style={tailwind`mt-6 items-center`}>
          <Text style={tailwind`text-base text-blue-600`}>Back To Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewRejectedScreen;
