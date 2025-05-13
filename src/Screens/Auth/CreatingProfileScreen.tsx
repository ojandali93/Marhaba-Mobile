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
        createHabits(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
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
        smoking,
        drinking,
        hasKids,
        wantsKids,
        sleep,
        exercise,
        diet,
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

  const createReligion = async (userId: string) => {
    const religion = await AsyncStorage.getItem('RG_Religion');
    const sect = await AsyncStorage.getItem('RG_Sect');
    const practicing = await AsyncStorage.getItem('RG_Practices');
    const openness = await AsyncStorage.getItem('RG_Openness');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createReligion', {
        userId,
        religion,
        sect,
        practicing,
        openness,
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
    const family = await AsyncStorage.getItem('CR_Family');
    const faith = await AsyncStorage.getItem('CR_Faith');
    const ambition = await AsyncStorage.getItem('CR_Ambition');
    const career = await AsyncStorage.getItem('CR_CareerVsFamily');
    const conflicts = await AsyncStorage.getItem('CR_Conflicts');
    const independence = await AsyncStorage.getItem('CR_Independence');
    const decisions = await AsyncStorage.getItem('CR_Decisions');
    const politics = await AsyncStorage.getItem('CR_Politics');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createCore', {
        userId,
        family,
        faith,
        ambition,
        career,
        conflicts,
        independence,
        decisions,
        politics,
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
    const commStyle = await AsyncStorage.getItem('RD_commStyle');
    const commStyleArray = JSON.parse(commStyle);
    const loveLanguages = await AsyncStorage.getItem('RD_loveLanguage');
    const loveLanguagesArray = JSON.parse(loveLanguages);
    const coreValues = await AsyncStorage.getItem('RD_coreValues');
    const coreValuesArray = JSON.parse(coreValues);
    const timePriority = await AsyncStorage.getItem('RD_timePriority');
    const timePriorityArray = JSON.parse(timePriority);

    axios
      .post(
        'https://marhaba-server.onrender.com/api/account/createRelationships',
        {
          userId,
          commStyle: commStyleArray,
          loveLanguages: loveLanguagesArray,
          values: coreValuesArray,
          time: timePriorityArray,
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
    const job = await AsyncStorage.getItem('CE_Job');
    const company = await AsyncStorage.getItem('CE_Company');
    const industry = await AsyncStorage.getItem('CE_Industry');
    const relocateWork = await AsyncStorage.getItem('CE_RelocateWork');
    const site = await AsyncStorage.getItem('CE_Site');
    const education = await AsyncStorage.getItem('CE_Education');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createCareer', {
        userId,
        job,
        company,
        industry,
        relocateWork,
        site,
        education,
        updated_at: new Date().toISOString(),
      })
      .then(response => {
        console.log('career response:', response);
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
        console.log('prompts response:', response);
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
        console.log('traits response:', response);
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

      console.log('survey response:', response);
      createPreferences(userId);
    } catch (error) {
      console.log(
        '❌ Survey creation error:',
        error?.response?.data || error.message,
      );
    }
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
        createFuture(userId);
      })
      .catch(error => {
        if (error) {
          console.log('❌ Server responded with status:', error.error);
        }
      });
  };

  const createFuture = async (userId: string) => {
    const career = await AsyncStorage.getItem('FTR_Career');
    const finances = await AsyncStorage.getItem('FTR_Finances');
    const pace = await AsyncStorage.getItem('FTR_Pace');
    const location = await AsyncStorage.getItem('FTR_Location');
    const fiveYears = await AsyncStorage.getItem('FTR_FiveYears');

    axios
      .post('https://marhaba-server.onrender.com/api/account/createFuture', {
        userId,
        career,
        finances,
        pace,
        live: location,
        fiveYears,
        updated_at: new Date().toISOString(),
      })
      .then(response => {
        console.log('future response:', response);
        // createSurvey(userId);
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
