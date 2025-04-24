import { launchImageLibrary } from 'react-native-image-picker';

export const pickImageFromGallery = async () => {
  return new Promise((resolve, reject) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          resolve(null); // User cancelled
        } else if (response.errorCode) {
          reject(new Error(response.errorMessage || 'Image pick failed'));
        } else {
          const asset = response.assets?.[0];
          resolve(asset || null); // Return the image object or null
        }
      }
    );
  });
};
