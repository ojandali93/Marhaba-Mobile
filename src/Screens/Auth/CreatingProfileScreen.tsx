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
    }, 6000); // 20 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  const createAccount = async () => {
    const email = await AsyncStorage.getItem('SU_email');
    const password = await AsyncStorage.getItem('SU_password');
    const name = await AsyncStorage.getItem('E_name');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createAccount', {
        email,
        password,
        name,
      })
      .then(response => {
        console.log('account response:', response);
        createProfile(response.data.data);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error);
        }
      });
  };

  const createProfile = async (userId: string) => {
    const email = await AsyncStorage.getItem('SU_email');
    const name = await AsyncStorage.getItem('E_name');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createProfile', {
        userId,
        email,
        name,
        fcmToken: null,
        approved: 'review',
        tier: 1,
        longitude: null,
        latitude: null,
        visibility: 'Public',
        agreements: true,
      })
      .then(response => {
        console.log('profile response:', response);
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
      .post(
        'https://marhaba-server.onrender.com/api/account/createNotifications',
        {
          userId,
          messages: true,
          matches: true,
          likes: true,
          weeklyViews: true,
          miscellanious: true,
        },
      )
      .then(response => {
        console.log('notifications response:', response);
        createSocials(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createSocials = async (userId: string) => {
    axios
      .post('https://marhaba-server.onrender.com/api/account/createSocial', {
        userId,
      })
      .then(response => {
        console.log('notifications response:', response);
        createAbout(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createAbout = async (userId: string) => {
    const name = await AsyncStorage.getItem('E_name');
    const email = await AsyncStorage.getItem('SU_email');
    const phone = await AsyncStorage.getItem('SU_phone');
    const dob = await AsyncStorage.getItem('E_dob');
    const gender = await AsyncStorage.getItem('E_gender');
    const height = await AsyncStorage.getItem('E_height');
    const backgroundArray = await AsyncStorage.getItem('BG_Background');
    const background = JSON.parse(backgroundArray);
    const backgroundString =
      background.length > 1 ? background.join(',') : background;

    axios
      .post('https://marhaba-server.onrender.com/api/account/createAbout', {
        userId,
        name,
        email,
        phone,
        dob,
        gender,
        height,
        background: backgroundString,
      })
      .then(response => {
        console.log('about response:', response);
        createIntent(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createIntent = async (userId: string) => {
    const intentions = await AsyncStorage.getItem('LF_Intentions');
    const timeline = await AsyncStorage.getItem('LF_Timeline');
    const marriage = await AsyncStorage.getItem('LF_Marriage');
    const marriageSttus = await AsyncStorage.getItem('LF_MarriageStatus');
    const longDistance = await AsyncStorage.getItem('LF_LongDistance');
    const relocate = await AsyncStorage.getItem('LF_Relocate');
    const firstStep = await AsyncStorage.getItem('LF_FirstStep');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createIntent', {
        userId,
        intentions,
        timeline,
        marriage,
        marriageSttus,
        longDistance,
        relocate,
        firstStep,
        updated_at: new Date().toISOString(),
      })
      .then(response => {
        console.log('intent response:', response);
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
        console.log('photos response:', response);
        createPreferences(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createPreferences = async (userId: string) => {
    const gender = await AsyncStorage.getItem('PR_Gender');
    const radius = await AsyncStorage.getItem('PR_Radius');
    const views = await AsyncStorage.getItem('PR_Views');
    const sect = await AsyncStorage.getItem('PR_Sect');
    const religion = await AsyncStorage.getItem('PR_Religion');
    const ageMin = await AsyncStorage.getItem('PR_AgeMin');
    const ageMax = await AsyncStorage.getItem('PR_AgeMax');
    const prefBackground = await AsyncStorage.getItem('PR_Background');
    const background = JSON.parse(prefBackground);
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
          background: background.length ? background.join(',') : '',
        },
      )
      .then(response => {
        console.log('preferences response:', response);
        createPropmts(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createPropmts = async (userId: string) => {
    try {
      const raw = await AsyncStorage.getItem('prompts');
      const parsedPrompts = raw ? JSON.parse(raw) : [];

      console.log('🧠 Parsed prompts to send:', parsedPrompts);

      axios
        .post('https://marhaba-server.onrender.com/api/account/createPrompts', {
          userId,
          prompts: parsedPrompts, // ✅ Always an array
        })
        .then(response => {
          console.log('✅ Prompts response:', response.data);
          createHabits(userId);
        })
        .catch(error => {
          console.log(
            '❌ Prompts API error:',
            error.response?.data || error.message,
          );
        });
    } catch (err) {
      console.log('❌ Failed to prepare prompts:', err.message);
    }
  };

  const createHabits = async (userId: string) => {
    const smoking = await AsyncStorage.getItem('LFH_Smoking');
    const drinking = await AsyncStorage.getItem('LFH_Drinking');
    const hasKids = await AsyncStorage.getItem('LFH_HasKids');
    const wantsKids = await AsyncStorage.getItem('LFH_WantsKids');
    const sleep = await AsyncStorage.getItem('LFH_Sleep');
    const exercise = await AsyncStorage.getItem('LFH_Exercise');
    const diet = await AsyncStorage.getItem('LFH_Diet');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createHabits', {
        userId,
        smoking: smoking || null,
        drinking: drinking || null,
        hasKids: hasKids || null,
        wantsKids: wantsKids || null,
        sleep: sleep || null,
        exercise: exercise || null,
        diet: diet || null,
        updated_at: new Date().toISOString(),
      })
      .then(response => {
        console.log('habits response:', response);
        createReligion(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  // ------------------------------------------------------------

  const createReligion = async (userId: string) => {
    axios
      .post('https://marhaba-server.onrender.com/api/account/createReligion', {
        userId,
        religion: null,
        sect: null,
        practicing: null,
        openness: null,
        updated_at: new Date().toISOString(),
      })
      .then(response => {
        console.log('religion response:', response);
        createCore(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createCore = async (userId: string) => {
    axios
      .post('https://marhaba-server.onrender.com/api/account/createCore', {
        userId,
        family: null,
        faith: null,
        ambition: null,
        career: null,
        conflicts: null,
        independence: null,
        decisions: null,
        politics: null,
        updated_at: new Date().toISOString(),
      })
      .then(response => {
        console.log('core response:', response);
        createRelationships(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createRelationships = async (userId: string) => {
    axios
      .post(
        'https://marhaba-server.onrender.com/api/account/createRelationships',
        {
          userId,
          commStyle: null,
          loveLanguages: null,
          values: null,
          time: null,
          updated_at: new Date().toISOString(),
        },
      )
      .then(response => {
        console.log('relationships response:', response);
        createCareer(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createCareer = async (userId: string) => {
    axios
      .post('https://marhaba-server.onrender.com/api/account/createCareer', {
        userId,
        job: null,
        company: null,
        industry: null,
        relocateWork: null,
        site: null,
        education: null,
        updated_at: new Date().toISOString(),
      })
      .then(response => {
        console.log('career response:', response);
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
      const surveyPayload = {
        userId,
        friday: null,
        energy: null,
        planning: null,
        morningEnergy: null,
        social: null,
        verted: null,
        pineapple: null,
        giveUp: null,
        communication: null,
        firstSight: null,
        morning: null,
        travel: null,
        spicy: null,
        decisions: null,
        arrive: null,
        partner: null,
        move: null,
        opposites: null,
        ghost: null,
        longDistance: null,
      };

      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/account/createSurvey',
        surveyPayload,
      );

      console.log('survey response:', response);
      createFuture(userId);
    } catch (error) {
      console.log(
        '❌ Survey creation error:',
        error?.response?.data || error.message,
      );
    }
  };

  const createFuture = async (userId: string) => {
    axios
      .post('https://marhaba-server.onrender.com/api/account/createFuture', {
        userId,
        career: null,
        finances: null,
        pace: null,
        live: null,
        fiveYears: null,
        updated_at: new Date().toISOString(),
      })
      .then(response => {
        console.log('future response:', response);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
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
