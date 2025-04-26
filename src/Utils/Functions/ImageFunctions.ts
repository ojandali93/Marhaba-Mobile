import { launchImageLibrary } from 'react-native-image-picker';
import PhotoManipulator from 'react-native-photo-manipulator';

export const pickImageFromGallery = async () => {
  return new Promise((resolve, reject) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: .8,
        maxWidth: 2500,
        maxHeight: 2500,
        includeBase64: false,
        selectionLimit: 1,
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

const TARGET_ASPECT_RATIO = 9 / 16; // Portrait mode

export const cropCenterImageForPhone = async (
  uri: string,
  width: number,
  height: number,
  originalFileName?: string
) => {
  try {
    console.log('Original image size:', width, height);

    const desiredWidth = Math.floor(height * TARGET_ASPECT_RATIO);

    if (desiredWidth > width) {
      console.warn('Desired width is larger than original width. Skipping crop.');
      const fallbackFileName = (originalFileName ?? 'photo.jpg')
        .replace(/\.[^/.]+$/, '') + '.jpg';
      return { uri, fileName: fallbackFileName };
    }

    const xOffset = Math.floor((width - desiredWidth) / 2);

    const cropRegion = {
      x: xOffset,
      y: 0,
      width: desiredWidth,
      height: height,
    };

    const resultUri = await PhotoManipulator.crop(uri, cropRegion);

    console.log('✅ Cropped image saved at:', resultUri);

    const finalFileName = (originalFileName ?? 'photo.jpg')
      .replace(/\.[^/.]+$/, '') + '.jpg';

    return {
      width: width,
      height,
      uri: resultUri,
      fileName: finalFileName,
    };
  } catch (error) {
    console.error('❌ Image cropping failed:', error);
    throw error;
  }
};
