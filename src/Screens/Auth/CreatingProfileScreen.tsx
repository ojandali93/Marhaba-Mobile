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
    }, 12000); // 20 seconds

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
        createProfile(response.data.data);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error);
        }
      });
  };

  const createProfile = async (userId: string) => {
    const email = await AsyncStorage.getItem('email');
    const name = await AsyncStorage.getItem('name');
    const dob = await AsyncStorage.getItem('dob');
    const gender = await AsyncStorage.getItem('gender');
    const height = await AsyncStorage.getItem('height');
    const phone = await AsyncStorage.getItem('phone');

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
        phone,
        visibility: 'Online',
      })
      .then(response => {
        createNotifications(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createNotifications = async (userId: string) => {
    axios
      .post('https://marhaba-server.onrender.com/api/account/createProfile', {
        userId,
        messages: true,
        matches: true,
        likes: true,
        weeklyViews: true,
        miscellanious: true,
      })
      .then(response => {
        createAbout(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createAbout = async (userId: string) => {
    const lookingFor = await AsyncStorage.getItem('lookingFor');
    const background = await AsyncStorage.getItem('background');
    const religion = await AsyncStorage.getItem('religion');
    const sect = await AsyncStorage.getItem('sect');
    const views = await AsyncStorage.getItem('views');
    const smoke = await AsyncStorage.getItem('smoke');
    const drink = await AsyncStorage.getItem('drink');

    const hasKids = await AsyncStorage.getItem('hasKids');
    const wantsKids = await AsyncStorage.getItem('futureKids');
    const timeline = await AsyncStorage.getItem('timeline');
    const travel = await AsyncStorage.getItem('travel');

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
        hasKids,
        wantsKids,
        timeline,
        travel,
      })
      .then(response => {
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
    axios
      .post('https://marhaba-server.onrender.com/api/account/createTraits', {
        userId,
        traits,
      })
      .then(response => {
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
        createCommunicationStyles(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createCommunicationStyles = async (userId: string) => {
    const commStyle = await AsyncStorage.getItem('commStyle');
    axios
      .post(
        'https://marhaba-server.onrender.com/api/account/createCommunication',
        {
          userId,
          commStyle,
        },
      )
      .then(response => {
        createLoveLanguage(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createLoveLanguage = async (userId: string) => {
    const loveLanguage = await AsyncStorage.getItem('loveLanguage');
    axios
      .post('https://marhaba-server.onrender.com/api/account/createLove', {
        userId,
        loveLanguage,
      })
      .then(response => {
        createCoreValues(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createCoreValues = async (userId: string) => {
    const coreValues = await AsyncStorage.getItem('coreValues');
    axios
      .post('https://marhaba-server.onrender.com/api/account/createValues', {
        userId,
        coreValues,
      })
      .then(response => {
        createTime(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createTime = async (userId: string) => {
    const timePriority = await AsyncStorage.getItem('timePriority');
    axios
      .post('https://marhaba-server.onrender.com/api/account/createTime', {
        userId,
        timePriority,
      })
      .then(response => {
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
        createCore(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createCore = async (userId: string) => {
    const family = await AsyncStorage.getItem('coreFamily');
    const faith = await AsyncStorage.getItem('coreFaith');
    const ambition = await AsyncStorage.getItem('coreAmbition');
    const career = await AsyncStorage.getItem('coreCareerVsFamily');
    const honest = await AsyncStorage.getItem('coreHonesty');
    const transparent = await AsyncStorage.getItem('coreTransparency');
    const trust = await AsyncStorage.getItem('coreTrust');
    const politics = await AsyncStorage.getItem('corePolitics');
    const social = await AsyncStorage.getItem('coreSocial');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createCore', {
        userId,
        family,
        faith,
        ambition,
        career,
        honest,
        transparent,
        trust,
        politics,
        social,
      })
      .then(response => {
        createEmotions(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createEmotions = async (userId: string) => {
    const conflict = await AsyncStorage.getItem('emotionConflict');
    const apology = await AsyncStorage.getItem('emotionApology');
    const stress = await AsyncStorage.getItem('emotionStress');
    const emotion = await AsyncStorage.getItem('emotionEmotion');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createEmotions', {
        userId,
        conflict,
        apology,
        stress,
        emotion,
      })
      .then(response => {
        createAttachment(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createAttachment = async (userId: string) => {
    const close = await AsyncStorage.getItem('attachmentCloseness');
    const partner = await AsyncStorage.getItem('attachmentPartnerNeed');
    const fear = await AsyncStorage.getItem('attachmentFear');
    const independent = await AsyncStorage.getItem('attachmentIndependence');
    const response = await AsyncStorage.getItem('attachmentResponseConfict');

    axios
      .post(
        'https://marhaba-server.onrender.com/api/account/createAttachment',
        {
          userId,
          close,
          partner,
          fear,
          independent,
          response,
        },
      )
      .then(response => {
        createLifestyle(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createLifestyle = async (userId: string) => {
    const travel = await AsyncStorage.getItem('lifestyleTravelling');
    const social = await AsyncStorage.getItem('lifestyleSocialLife');
    const health = await AsyncStorage.getItem('lifestyleHealth');
    const finances = await AsyncStorage.getItem('lifestyleFinances');
    const living = await AsyncStorage.getItem('lifestyleLiving');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createLifestyle', {
        userId,
        travel,
        social,
        health,
        finances,
        living,
      })
      .then(response => {
        createFuture(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createFuture = async (userId: string) => {
    const marriage = await AsyncStorage.getItem('futureMarriage');
    const children = await AsyncStorage.getItem('futureChildren');
    const career = await AsyncStorage.getItem('futureCareer');
    const finances = await AsyncStorage.getItem('futureFinances');
    const pace = await AsyncStorage.getItem('futurePace');
    const location = await AsyncStorage.getItem('futureLocation');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createFuture', {
        userId,
        marriage,
        children,
        career,
        finances,
        pace,
        location,
      })
      .then(response => {
        createAnger(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createAnger = async (userId: string) => {
    const triggerString = await AsyncStorage.getItem('emotionAnger');

    if (!triggerString) {
      return;
    }

    const triggers = JSON.parse(triggerString); // ✅ Now an array

    axios
      .post('https://marhaba-server.onrender.com/api/account/createAnger', {
        userId,
        triggers, // ✅ Notice: triggers (plural)
      })
      .then(response => {
        createSurvey(userId);
      })
      .catch(error => {
        console.error(
          '❌ Server responded with error:',
          error.response?.data || error.message,
        );
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
