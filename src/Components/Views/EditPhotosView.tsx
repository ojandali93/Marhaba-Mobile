import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import { useProfile } from '../../Context/ProfileContext';
import themeColors from '../../Utils/custonColors';
import {Camera, ChevronsDown, ChevronsUp, X} from 'react-native-feather';
import {
  cropCenterImageForPhone,
  pickImageFromGallery,
} from '../../Utils/Functions/ImageFunctions';
import axios from 'axios';

const EditPhotosView = () => {
    const {profile, userId, grabUserProfile} = useProfile();

    const [originalImageUrls, setOriginalImageUrls] = useState<(string | null)[]>(Array(9).fill(null));

const [uploadedImageUrls, setUploadedImageUrls] = useState<(string | null)[]>(
    Array(9).fill(null),
    );
    const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(9).fill(false),
    );
    const [expandPhotos, setExpandPhotos] = useState(false);

    useFocusEffect(
        useCallback(() => {
          loadImages();
        }, []),
      );

      const loadImages = () => {
        const profilePhotos = usersProfile?.data?.Photos || [];
        const imageUrls = Array(9).fill(null);
    
        for (let i = 0; i < profilePhotos.length && i < 9; i++) {
          imageUrls[i] = profilePhotos[i].photoUrl;
        }
    
        setUploadedImageUrls(imageUrls);
        setOriginalImageUrls(imageUrls);
      };

      const hasImageChanges = () => {
        return uploadedImageUrls.some((url, index) => url !== originalImageUrls[index]);
      };

      const updateUserPhotos = async () => {
        try {
      
          if (!userId) {
            throw new Error('User ID is not available.');
          }
      
          // Filter and clean the array (remove nulls or empty strings)
          const filteredPhotos = uploadedImageUrls.filter(photo => photo && photo !== 'null' && photo !== '');
      
          const response = await axios.put('https://marhaba-server.onrender.com/api/account/updatePhotos', {
            userId,
            photos: filteredPhotos,
          });
      
          if (response.data.success) {
            console.log('✅ Photos updated successfully:', response.data.data);
            grabUserProfile(userId || '');
            setExpandPhotos(false);
            return { success: true, data: response.data.data };
          } else {
            console.warn('⚠️ Failed to update photos:', response.data.error);
            setExpandPhotos(false);
            return { success: false, error: response.data.error };  
          }
        } catch (error) {
          console.error('❌ Error updating photos:', error.message || error);
          setExpandPhotos(false);
          return { success: false, error: error.message || 'Unknown error' };
        }
      };

      const handlePickImage = async (index: number) => {
        try {
          const image = await pickImageFromGallery();
          if (!image || !image.uri) return;
    
          const croppedImage = await cropCenterImageForPhone(
            image.uri,
            image.width,
            image.height,
            image.fileName,
          );
    
          if (!croppedImage?.uri) {
            console.error('Cropping failed');
            return;
          }
    
          setLoadingStates(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
    
          const uploadedUrl = await uploadImageToServer(
            croppedImage.uri,
            croppedImage.fileName,
          );
    
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

      const handleRemoveImage = (index: number) => {
        setUploadedImageUrls(prev => {
          const updated = [...prev];
          // Shift all following images left
          for (let i = index; i < updated.length - 1; i++) {
            updated[i] = updated[i + 1];
          }
          updated[updated.length - 1] = null; // Last one is now empty
          return updated;
        });
      };
    
      // ✅ Upload cropped image directly
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
            console.log('✅ Uploaded image URL:', response.data.url);
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

  return(
    <View>
        <TouchableOpacity style={tailwind`w-full flex flex-col`} onPress={() => setExpandPhotos(!expandPhotos)}>
        <View style={[tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`, {backgroundColor: themeColors.darkSecondary}]}>
            <Text style={tailwind`text-base font-semibold text-gray-800`}>Photos</Text>
            {
                expandPhotos ? (
                    hasImageChanges() ? (
                    <TouchableOpacity onPress={updateUserPhotos}>
                        <Text style={[tailwind`text-base font-bold px-2 py-1 rounded-md text-white`, { backgroundColor: themeColors.primary }]}>
                        Save
                        </Text>
                    </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setExpandPhotos(false)}>
                            <ChevronsUp height={24} width={24} color={themeColors.primary} />
                        </TouchableOpacity>
                    )
                ) : (
                    <ChevronsDown height={24} width={24} color={themeColors.primary} />
                )
            }
        </View>
      </TouchableOpacity>
    <View style={tailwind`flex-1`}>
        {expandPhotos && (

        <View
          style={tailwind`w-full flex flex-row items-center mb-5 mt-4`}>
          <View style={tailwind`flex-1 flex-row flex-wrap`}>
            {uploadedImageUrls.map((_, index) => (
              <View
                style={tailwind`w-1/3 h-48 items-center justify-center p-1`}
                key={index}>
                    <TouchableOpacity onPress={() => handleRemoveImage(index)} style={tailwind`absolute z-20 top--1 right--1 p-1 rounded-full bg-red-500`}>
                        <X height={16} width={16} color={'white'} />
                    </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePickImage(index)}
                  style={[
                    tailwind`w-full h-full border-2 flex items-center justify-center rounded-3`,
                    {
                      borderColor:
                        index === 0
                          ? themeColors.primary
                          : themeColors.darkSecondary,
                    },
                  ]}>
                  {loadingStates[index] ? (
                    <ActivityIndicator
                      size="small"
                      color={themeColors.primary}
                    />
                  ) : uploadedImageUrls[index] ? (
                    <Image
                      source={{uri: uploadedImageUrls[index]!}}
                      style={tailwind`w-full h-full rounded-md`}
                      resizeMode="cover"
                    />
                  ) : (
                    <Camera
                      height={20}
                      width={20}
                      color={themeColors.primary}
                    />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        )}
        </View>
    </View>
  )
};

export default EditPhotosView;
