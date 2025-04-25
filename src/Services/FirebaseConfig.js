import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';
import Config from 'react-native-config';

const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: "marhabaa-405f8.appspot.com",
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
  appId: Config.FIREBASE_APP_ID,
  measurementId: Config.FIREBASE_MEASURE_ID,
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);