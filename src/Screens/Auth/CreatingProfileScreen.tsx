import React, {useEffect} from 'react';
import {ActivityIndicator, Alert, Dimensions, Text, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useNavigation} from '@react-navigation/native';
import {Activity, Heart} from 'react-native-feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const screenHeight = Dimensions.get('window').height;

const CreatingProfileScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    createAccount();

    const timer = setTimeout(() => {
      (async () => {
        Alert.alert(
          'Verify Your Account',
          'We’ve sent a verification email to your inbox. Please check your email and verify your account before logging in.',
          [{text: 'OK'}],
        );

        await AsyncStorage.clear();
        navigation.navigate('Login');
      })();
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  const createAccount = async () => {
    const email = await AsyncStorage.getItem('email');
    const password = await AsyncStorage.getItem('password');
    const name = await AsyncStorage.getItem('name');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createAccount', {
        email,
        password,
        name,
      })
      .then(response => {
        console.log('response: ', response.data);
        console.log('response data: ', response.data.data);
        createProfile(response.data.data);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error);
        }
      });
  };

  const createProfile = async (userId: string) => {
    console.log('user id: ', userId);
    const email = await AsyncStorage.getItem('email');
    const name = await AsyncStorage.getItem('name');
    const dob = await AsyncStorage.getItem('dob');
    const gender = await AsyncStorage.getItem('gender');
    const height = await AsyncStorage.getItem('height');
    console.log('grabbed all asyn info');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createProfile', {
        userId,
        email,
        name,
        dob,
        gender,
        height,
        fcmToken: null,
        approved: 'review',
        tier: 1,
        longitude: null,
        latitude: null,
      })
      .then(response => {
        console.log('profile response: ', response);
        createAbout(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createAbout = async (userId: string) => {
    const lookingFor = await AsyncStorage.getItem('lookingMe');
    const background = await AsyncStorage.getItem('background');
    const religion = await AsyncStorage.getItem('religion');
    const sect = await AsyncStorage.getItem('sect');
    const views = await AsyncStorage.getItem('views');
    const smoke = await AsyncStorage.getItem('smoke');
    const drink = await AsyncStorage.getItem('drink');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createAbout', {
        userId,
        lookingFor,
        background,
        religion,
        sect,
        views,
        smoke,
        drink,
      })
      .then(response => {
        console.log('about response: ', response);
        createCareer(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createCareer = async (userId: string) => {
    const job = await AsyncStorage.getItem('job');
    const company = await AsyncStorage.getItem('company');
    const site = await AsyncStorage.getItem('site');
    const location = await AsyncStorage.getItem('location');
    const education = await AsyncStorage.getItem('education');
    const fiveYear = await AsyncStorage.getItem('fiveYear');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createCareer', {
        userId,
        job,
        company,
        site,
        location,
        education,
        fiveYear,
      })
      .then(response => {
        console.log('about response: ', response);
        createTraits(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createTraits = async (userId: string) => {
    const traits = await AsyncStorage.getItem('traits');
    console.log('traits: ', traits);
    console.log('type of traits', typeof traits);
    axios
      .post('https://marhaba-server.onrender.com/api/account/createTraits', {
        userId,
        traits,
      })
      .then(response => {
        console.log('about response: ', response);
        createPreferences(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createPreferences = async (userId: string) => {
    const gender = await AsyncStorage.getItem('prefGender');
    const radius = await AsyncStorage.getItem('preRadius');
    const views = await AsyncStorage.getItem('prefViews');
    const sect = await AsyncStorage.getItem('prefSect');
    const religion = await AsyncStorage.getItem('prefReligion');
    const ageMin = await AsyncStorage.getItem('preAgeMin');
    const ageMax = await AsyncStorage.getItem('prefAgeMax');
    console.log('age max: ', ageMax);
    axios
      .post(
        'https://marhaba-server.onrender.com/api/account/createPreferences',
        {
          userId,
          gender,
          distance: radius,
          religion,
          sect,
          views,
          ageMin,
          ageMax,
        },
      )
      .then(response => {
        console.log('about response: ', response);
        createPropmts(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createPropmts = async (userId: string) => {
    const prompts = await AsyncStorage.getItem('prompts');
    axios
      .post('https://marhaba-server.onrender.com/api/account/createPrompts', {
        userId,
        prompts,
      })
      .then(response => {
        console.log('about response: ', response);
        createPhotos(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createPhotos = async (userId: string) => {
    const photos = await AsyncStorage.getItem('images');
    axios
      .post('https://marhaba-server.onrender.com/api/account/createPhotos', {
        userId,
        photos,
      })
      .then(response => {
        console.log('about response: ', response);
        createSurvey(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createSurvey = async (userId: string) => {
    try {
      const friday = await AsyncStorage.getItem('onafridaynightidrather');
      const energy = await AsyncStorage.getItem('myenergylevelisusually');
      const planning = await AsyncStorage.getItem('iprefertoplan');
      const morningEnergy = await AsyncStorage.getItem('immoreofa');
      const social = await AsyncStorage.getItem('insocialsituationsi');
      const verted = await AsyncStorage.getItem('immore');
      const pineapple = await AsyncStorage.getItem('pineappleonpizza');
      const giveUp = await AsyncStorage.getItem('idrathergiveup');
      const communication = await AsyncStorage.getItem('textingvscalling');
      const firstSight = await AsyncStorage.getItem(
        'doyoubelieveinloveatfirstsight',
      );
      const morning = await AsyncStorage.getItem('inthemorningi');
      const travel = await AsyncStorage.getItem('whentravelingiprefer');
      const spicy = await AsyncStorage.getItem('ilikemyfood');
      const decisions = await AsyncStorage.getItem('whenmakingdecisions');
      const arrive = await AsyncStorage.getItem('iusuallyarrive');
      const partner = await AsyncStorage.getItem('ivaluemoreinapartner');
      const move = await AsyncStorage.getItem('wouldyoumoveforlove');
      const opposites = await AsyncStorage.getItem('dooppositesattract');
      const ghost = await AsyncStorage.getItem('isitokaytoghossomeone');
      const longDistance = await AsyncStorage.getItem(
        'longdistancerelationshipscanwork',
      );

      const surveyPayload = {
        userId,
        friday,
        energy,
        planning,
        morningEnergy,
        social,
        verted,
        pineapple,
        giveUp,
        communication,
        firstSight,
        morning,
        travel,
        spicy,
        decisions,
        arrive,
        partner,
        move,
        opposites,
        ghost,
        longDistance,
      };

      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/account/createSurvey',
        surveyPayload,
      );

      console.log('✅ Survey response:', response.data);
    } catch (error) {
      console.log(
        '❌ Survey creation error:',
        error?.response?.data || error.message,
      );
    }
  };

  return (
    <View
      style={[
        tailwind`flex-1 w-full h-full justify-center items-center px-6`,
        {backgroundColor: themeColors.secondary},
      ]}>
      <Text
        style={[
          tailwind`text-3xl font-bold text-center mb-4`,
          {color: themeColors.primary},
        ]}>
        Creating Your Profile
      </Text>
      <Text style={tailwind`text-base text-center text-gray-700`}>
        Your profile is currently being created and prepared for review.{'\n\n'}
        <Text style={tailwind`font-semibold`}>
          {' '}
          All new profiles are carefully reviewed by our team
        </Text>{' '}
        to ensure they meet our community standards and help create meaningful
        connections.
        {'\n\n'}
        We may ask you to adjust certain details if they don't meet our
        guidelines. This process ensures the
        <Text style={tailwind`font-semibold`}>
          {' '}
          quality of users and the integrity of the app
        </Text>
        .{'\n\n'}
        Most profiles are approved within 1 hour. We'll notify you once your
        profile has been reviewed.
      </Text>
      <View style={tailwind`mt-8`}>
        <ActivityIndicator size={'large'} color={themeColors.primary} />
      </View>
    </View>
  );
};

export default CreatingProfileScreen;
