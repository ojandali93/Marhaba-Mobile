import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {faker} from '@faker-js/faker';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useFocusEffect} from '@react-navigation/native';
import AithInputStandard from '../../Components/Inputs/AithInputStandard';
import AuthInputStandardNumber from '../../Components/Inputs/AuthInputStandardNumber';
import DateSelect from '../../Components/Select/DateSelect';
import StandardSelect from '../../Components/Select/StandardSelect';
import {
  backgroundOptions,
  intentionsOptions,
  timelineOptions,
  importanceMarriageOptions,
  marriageStatusOptions,
  religionOptions,
  religiousSectOptions,
  industries,
  traitsAndHobbies,
  eitherOrQuestions,
} from '../../Utils/SelectOptions';
import EditBackgroundView from '../../Components/Views/EditBackgroundView';
import BackgroundSelect from '../../Components/Select/BackgroundSelect';
import PromptSelect from '../../Components/Select/PromptSelect';
import StandardInputBordered from '../../Components/Inputs/StandardInputBordered';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AgeSliderSelect from '../../Components/Select/AgeSliderSelect';
import {
  cropCenterImageForPhone,
  pickImageFromGallery,
} from '../../Utils/Functions/ImageFunctions';
import {Camera} from 'react-native-feather';
import AuthMainButton from '../../Components/Buttons/AuthMainButton';
import {createUserAccount} from '../../Utils/Functions/AccountFunctions';
const communicationStyles = [
  'Direct & honest',
  'Playful & teasing',
  'Thoughtful & reflective',
  'Light & humorous',
  'Supportive & empathetic',
  'Straight to the point',
];

const loveLanguages = [
  'Words of Affirmation',
  'Quality Time',
  'Acts of Service',
  'Physical Touch',
  'Receiving Gifts',
];

const coreValuesList = [
  'Loyalty',
  'Ambition',
  'Empathy',
  'Faith',
  'Honesty',
  'Humor',
  'Stability',
  'Curiosity',
  'Independence',
  'Family',
];

const timePrioritiesList = [
  'Family Time',
  'Friend Time',
  'Career / Work',
  'Spiritual Growth',
  'Alone / Recharge Time',
  'Building Something New',
];

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LoadDtabaseScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');

  const [background, setBackground] = useState<string[]>([]);

  const [intentions, setIntentions] = useState('');
  const [timeline, setTimeline] = useState('');
  const [marriage, setMarriage] = useState('');
  const [marriageStatus, setMarriageStatus] = useState('');
  const [longDistance, setLongDistance] = useState('');
  const [relocation, setRelocation] = useState('');
  const [firstStep, setFirstStep] = useState('');
  const [familyInvolvement, setFamilyInvolvement] = useState('');

  const [smoking, setSmoking] = useState('');
  const [drinking, setDrinking] = useState('');
  const [hasKids, setHasKids] = useState('');
  const [wantsKids, setWantsKids] = useState('');
  const [sleep, setSleep] = useState('');
  const [excersize, setExcersize] = useState('');
  const [diet, setDiet] = useState('');

  const [religion, setReligion] = useState('');
  const [sect, setSect] = useState('');
  const [practicing, setPracticing] = useState('');
  const [openness, setOpenness] = useState('');

  const [family, setFamily] = useState('');
  const [faith, setFaith] = useState('');
  const [ambition, setAmbition] = useState('');
  const [careerVsFamily, setCareerVsFamily] = useState('');
  const [conflicts, setConflicts] = useState('');
  const [decisions, setDecisions] = useState('');
  const [independence, setIndependence] = useState('');
  const [politics, setPolitics] = useState('');

  const [communication, setCommunication] = useState('');
  const [love, setLove] = useState('');
  const [coreValues, setCoreValues] = useState('');
  const [time, setTime] = useState('');

  const [job, setJob] = useState('');
  const [company, setCompany] = useState('');
  const [education, setEducation] = useState('');
  const [industry, setIndustry] = useState('');
  const [site, setSite] = useState('');
  const [reloocateWork, setRelocateWork] = useState('');

  const [careerAmbition, setCareerAmbition] = useState('');
  const [financialAmbition, setFinancialAmbition] = useState('');
  const [pace, setPace] = useState('');
  const [living, setLiving] = useState('');
  const [fiveYearPlan, setFiveYearPlan] = useState('');

  const [prompts, setPrompts] = useState<string>('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [promptResponses, setPromptResponses] = useState<
    {prompt: string; response: string}[]
  >([]);

  const [traits, setTraits] = useState<string[]>([]);

  const [friday, setFriday] = useState<string>('');
  const [energy, setEnergy] = useState<string>('');
  const [planning, setPlanning] = useState<string>('');
  const [morningEnergy, setMorningEnergy] = useState<string>('');
  const [social, setSocial] = useState<string>('');
  const [verted, setVerted] = useState<string>('');
  const [pineapple, setPineapple] = useState<string>('');
  const [giveUP, setGiveUp] = useState<string>('');
  const [communications, setCommunications] = useState<string>('');
  const [firstSight, setFirstSight] = useState<string>('');
  const [morning, setMorning] = useState<string>('');
  const [travel, setTravel] = useState<string>('');
  const [spicy, setSpicy] = useState<string>('');
  const [decision, setDecision] = useState<string>('');
  const [arrive, setArrive] = useState<string>('');
  const [partner, setPartner] = useState<string>('');
  const [move, setMOve] = useState<string>('');
  const [opposite, setOpposite] = useState<string>('');
  const [ghost, setGhost] = useState<string>('');
  const [longDistances, setLongDistances] = useState<string>('');

  const [prefGender, setPrefGender] = useState('');
  const [distance, setDistance] = useState('');
  const [prefBackground, setPrefBackground] = useState('');
  const [prefReligion, setPrefReligion] = useState('');
  const [prefSect, setPrefSect] = useState('');
  const [prefViews, setPrefViews] = useState('');
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);

  const [uploadedImageUrls, setUploadedImageUrls] = useState<(string | null)[]>(
    Array(9).fill(null),
  );
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(9).fill(false),
  );
  const [showGuidelines, setShowGuidelines] = useState(true);

  const questionStateMap = {
    'On a Friday night, I’d rather...': [friday, setFriday],
    'My energy level is usually...': [energy, setEnergy],
    'I prefer to plan...': [planning, setPlanning],
    'I’m more of a...': [morningEnergy, setMorningEnergy],
    'In social situations, I...': [social, setSocial],
    'I’m more...': [verted, setVerted],
    'Pineapple on pizza?': [pineapple, setPineapple],
    'I’d rather give up...': [giveUP, setGiveUp],
    'Texting vs Calling': [communications, setCommunications],
    'Do you believe in love at first sight?': [firstSight, setFirstSight],
    'In the morning, I...': [morning, setMorning],
    'When traveling, I prefer...': [travel, setTravel],
    'I like my food...': [spicy, setSpicy],
    'When making decisions...': [decision, setDecision],
    'I usually arrive...': [arrive, setArrive],
    'I value more in a partner...': [partner, setPartner],
    'Would you move for love?': [move, setMOve],
    'Do opposites attract?': [opposite, setOpposite],
    'Is it okay to ghost someone?': [ghost, setGhost],
    'Long-distance relationships can work?': [longDistances, setLongDistances],
  };

  useFocusEffect(
    useCallback(() => {
      loadFields();
    }, []),
  );

  const loadFields = async () => {
    console.log('loadFields');
    setPassword('Kraken21!');
    setPhone(faker.phone.number());
    setName(faker.person.fullName());
    setHeight(`5'3"`);
    setJob(faker.job.title());
    setCompany(faker.company.name());
    setEducation('MBA @ USC');
  };

  const countAnswered = Object.values(questionStateMap).filter(
    ([value]) => value !== '',
  ).length;

  const toggleCommStyle = (style: string) => {
    if (communication.includes(style)) {
      setCommunication(prev => prev.filter(item => item !== style));
    } else if (communication.length < 2) {
      setCommunication(prev => [...prev, style]);
    }
  };

  const toggleLoveLanguage = (lang: string) => {
    if (love.includes(lang)) {
      setLove(prev => prev.filter(item => item !== lang));
    } else if (love.length < 2) {
      setLove(prev => [...prev, lang]);
    }
  };

  const toggleCoreValue = (value: string) => {
    if (coreValues.includes(value)) {
      setCoreValues(prev => prev.filter(item => item !== value));
    } else if (coreValues.length < 4) {
      setCoreValues(prev => [...prev, value]);
    }
  };

  const toggleTimePriority = (value: string) => {
    if (time.includes(value)) {
      setTime(prev => prev.filter(item => item !== value));
    } else if (time.length < 2) {
      setTime(prev => [...prev, value]);
    }
  };

  const updateSelectedPrompt = (selectedPrompt: string) => {
    setCurrentPrompt(selectedPrompt);
    const exists = promptResponses.find(p => p.prompt === selectedPrompt);
    if (!exists) {
      setPromptResponses(prev => [
        ...prev,
        {prompt: selectedPrompt, response: ''},
      ]);
    }
  };

  const toggleTrait = (trait: string) => {
    setTraits(prev => {
      if (prev.includes(trait)) {
        return prev.filter(t => t !== trait);
      } else if (prev.length < 8) {
        return [...prev, trait];
      } else {
        Alert.alert('Limit Reached', 'You can select up to 8 traits only.');
        return prev;
      }
    });
  };

  const updateCurrentResponse = (prompt: string, text: string) => {
    setPromptResponses(prev =>
      prev.map(entry =>
        entry.prompt === prompt ? {...entry, response: text} : entry,
      ),
    );
  };

  const removePrompt = (promptToRemove: string) => {
    if (promptToRemove === 'Who am I?') return;
    setPromptResponses(prev => prev.filter(p => p.prompt !== promptToRemove));
    if (currentPrompt === promptToRemove) {
      setCurrentPrompt('');
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
    const len = digits.length;

    if (len <= 3) return digits;
    if (len <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
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

      if (!croppedImage?.uri) return;

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

  const uploadImageToServer = async (
    localUri: string,
    originalFileName: string,
  ) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: localUri,
        name: originalFileName || 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/account/upoadImage',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        },
      );

      return response.data.success ? response.data.url : null;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  return (
    <View style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <View
        style={[
          tailwind`w-full flex flex-row items-center justify-between p-4 rounded-2 mb-3 mt-16`,
          {backgroundColor: themeColors.secondary},
        ]}>
        <Text style={tailwind`text-2xl font-bold text-gray-800`}>
          Create A User
        </Text>
      </View>
      <ScrollView style={tailwind`flex-1 mb-24`}>
        <AithInputStandard
          fieldName="Email"
          value={email}
          changeText={setEmail}
          label="Email"
          valid
        />
        <AithInputStandard
          fieldName="Password:"
          value={password}
          changeText={setPassword}
          secure={true}
          valid={true}
          label="Password"
        />
        <AuthInputStandardNumber
          fieldName="Phone"
          value={phone}
          changeText={(text: string) => setPhone(formatPhoneNumber(text))}
          secure={false}
          valid={true}
          label="Phone"
        />
        <AithInputStandard
          fieldName="Name"
          value={name}
          changeText={setName}
          valid
          label="Name"
        />
        <DateSelect fieldName="Date of Birth" dob={dob} setDate={setDob} />
        <StandardSelect
          fieldName="Gender"
          selected={gender}
          onSelect={setGender}
          options={['Male', 'Female']}
          label="Gender"
        />
        <StandardSelect
          fieldName="Height"
          selected={height}
          onSelect={setHeight}
          options={[
            '5\'0"',
            '5\'1"',
            '5\'2"',
            '5\'3"',
            '5\'4"',
            '5\'5"',
            '5\'6"',
            '5\'7"',
            '5\'8"',
            '5\'9"',
            '5\'10"',
            '5\'11"',
            '6\'0"',
            '6\'1"',
            '6\'2"',
            '6\'3"',
            '6\'4"',
            '6\'5"',
            '6\'6"',
            '6\'7"',
            '6\'8"',
            '6\'9"',
            '6\'10"',
            '6\'11"',
            '7\'0"',
          ]}
          label="Height"
        />
        <BackgroundSelect
          fieldName="Background"
          options={backgroundOptions}
          selected={background}
          setSelected={setBackground}
          maxSelect={4}
        />
        <StandardSelect
          fieldName="Intentions"
          selected={intentions}
          onSelect={setIntentions}
          options={intentionsOptions}
          label="Intentions"
        />
        <StandardSelect
          fieldName="Timeline"
          selected={timeline}
          onSelect={setTimeline}
          options={timelineOptions}
          label="Timeline"
        />
        <StandardSelect
          fieldName="Importance (Marriage)"
          selected={marriage}
          onSelect={setMarriage}
          options={importanceMarriageOptions}
          label="Importance (Marriage)"
        />
        <StandardSelect
          fieldName="Marriage Status"
          selected={marriageStatus}
          onSelect={setMarriageStatus}
          options={marriageStatusOptions}
          label="Marriage Status"
          optional
        />
        <StandardSelect
          fieldName="Long Distance"
          selected={longDistance}
          onSelect={setLongDistance}
          options={['Yes', 'No', 'Maybe']}
          label="Long Distance"
        />
        <StandardSelect
          fieldName="Relocate"
          selected={relocation}
          onSelect={setRelocation}
          options={['Yes', 'No', 'Maybe']}
          label="Relocate"
        />
        <StandardSelect
          fieldName="First Step"
          selected={firstStep}
          onSelect={setFirstStep}
          options={[
            'Chat on app',
            'Video call',
            'Meet in person',
            'Exchange numbers',
          ]}
          label="First Step"
          optional
        />
        <StandardSelect
          fieldName="Family Involvement"
          selected={familyInvolvement}
          onSelect={setFamilyInvolvement}
          options={[
            'Immediately',
            'After a few dates',
            'Once serious',
            'Not important',
          ]}
          label="Family Involvement"
          optional
        />
        <StandardSelect
          fieldName="Smoking"
          selected={smoking}
          onSelect={setSmoking}
          options={['Yes', 'No', 'Sometimes']}
          label="Smoking"
        />
        <StandardSelect
          fieldName="Drinking"
          selected={drinking}
          onSelect={setDrinking}
          options={['Yes', 'No', 'Sometimes']}
          label="Drinking"
        />
        <StandardSelect
          fieldName="Has Kids"
          selected={hasKids}
          onSelect={setHasKids}
          options={['Yes', 'No']}
          label="Has Kids"
        />
        <StandardSelect
          fieldName="Wants Kids"
          selected={wantsKids}
          onSelect={setWantsKids}
          options={['Yes', 'No', 'In the future']}
          label="Wants Kids"
        />
        <StandardSelect
          fieldName="Sleep"
          selected={sleep}
          onSelect={setSleep}
          options={['Early Bird', 'Night Owl', 'Flexible']}
          label="Sleep"
          optional
        />
        <StandardSelect
          fieldName="Exercise"
          selected={excersize}
          onSelect={setExcersize}
          options={['Daily', 'Often', 'Sometimes', 'Rarely', 'Never']}
          label="Exercise"
          optional
        />
        <StandardSelect
          fieldName="Diet"
          selected={diet}
          onSelect={setDiet}
          options={[
            'Halal',
            'Vegan',
            'Vegetarian',
            'Pescetarian',
            'Omnivore',
            'Other',
          ]}
          label="Diet"
          optional
        />
        <StandardSelect
          fieldName="Religion"
          selected={religion}
          onSelect={setReligion}
          options={religionOptions}
          label="Religion"
        />
        <StandardSelect
          fieldName="Sect"
          selected={sect}
          onSelect={setSect}
          options={religiousSectOptions}
          label="Sect"
        />
        <StandardSelect
          fieldName="Practices"
          selected={practicing}
          onSelect={setPracticing}
          options={[
            'Very Practicing',
            'Somewhat Practicing',
            'Not Practicing',
            'Prefer not to say',
          ]}
          label="Practices"
          optional
        />
        <StandardSelect
          fieldName="Openness"
          selected={openness}
          onSelect={setOpenness}
          options={[
            'Must align',
            'Open to other religions',
            'Open to other sects',
            'Open to other practices',
            'Prefer not to say',
          ]}
          label="Openness"
          optional
        />
        <StandardSelect
          fieldName="Building a Family"
          selected={family}
          onSelect={setFamily}
          options={['Essential', 'Important', 'Neutral', 'Not Important']}
          label="Building a Family"
        />
        <StandardSelect
          fieldName="Shared Faith"
          selected={faith}
          onSelect={setFaith}
          options={[
            'Essential',
            'Important',
            'Flexible',
            'Not Important',
            'Opposing Views',
          ]}
          label="Shared Faith"
        />
        <StandardSelect
          fieldName="Personal Ambition"
          selected={ambition}
          onSelect={setAmbition}
          options={[
            'Highly Ambitious',
            'Moderately Ambitious',
            'Low Ambition',
            'Not A Priority',
            'Still Exploring',
          ]}
          label="Personal Ambition"
        />
        <StandardSelect
          fieldName="Career vs Family"
          selected={careerVsFamily}
          onSelect={setCareerVsFamily}
          options={[
            'Career First',
            'Family First',
            'Balanced',
            'Flexible',
            'Career Options',
          ]}
          label="Career vs Family"
        />
        <StandardSelect
          fieldName="Conflicts"
          selected={conflicts}
          onSelect={setConflicts}
          options={[
            'Calm decisions',
            'Tackle head on',
            'Need space',
            'Emotional expression',
            'Avoid conflict',
          ]}
          label="Conflict Style"
        />
        <StandardSelect
          fieldName="Decisions"
          selected={decisions}
          onSelect={setDecisions}
          options={[
            'Lead the decision',
            'collaborate equally',
            'Let them decide',
            'No preference',
          ]}
          label="Decision Making"
        />
        <StandardSelect
          fieldName="Independence"
          selected={independence}
          onSelect={setIndependence}
          options={[
            'Need space',
            'Need to be close',
            'Flexible',
            'No preference',
          ]}
          label="Independence (Relationship)"
          optional
        />
        <StandardSelect
          fieldName="Political Views"
          selected={politics}
          onSelect={setPolitics}
          options={[
            'Aligned with my views',
            'Open to other views',
            'No preference',
          ]}
          label="Political Views"
          optional
        />
        <View style={tailwind`mt-2`}>
          <Text style={tailwind`italic text-base px-2 pb-1 mb-2`}>
            Communication Style (Select 2)
          </Text>

          <ScrollView
            style={tailwind`max-h-72`}
            showsVerticalScrollIndicator={false}>
            <View style={tailwind`flex-row flex-wrap justify-between`}>
              {communicationStyles.map((style, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleCommStyle(style)}
                  style={[
                    tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                    {
                      backgroundColor: communication.includes(style)
                        ? themeColors.primary
                        : themeColors.secondary,
                      borderColor: themeColors.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-center text-base`,
                      {
                        color: communication.includes(style)
                          ? 'white'
                          : 'black',
                      },
                    ]}>
                    {style}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/*  */}
          </ScrollView>
        </View>
        <View style={tailwind`mt-2`}>
          <Text style={tailwind`italic text-base px-2 pb-1 mb-2`}>
            Love Language (Select 2)
          </Text>

          <ScrollView
            style={tailwind`max-h-72`}
            showsVerticalScrollIndicator={false}>
            <View style={tailwind`flex-row flex-wrap justify-between`}>
              {loveLanguages.map((lang, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleLoveLanguage(lang)}
                  style={[
                    tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                    {
                      backgroundColor: love.includes(lang)
                        ? themeColors.primary
                        : themeColors.secondary,
                      borderColor: themeColors.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-center text-base`,
                      {
                        color: love.includes(lang) ? 'white' : 'black',
                      },
                    ]}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={tailwind`mt-2`}>
          <Text style={tailwind`italic text-base px-2 pb-1 mb-2`}>
            Core Values (Select 4)
          </Text>

          <ScrollView
            style={tailwind`max-h-72`}
            showsVerticalScrollIndicator={false}>
            <View style={tailwind`flex-row flex-wrap justify-between`}>
              {coreValuesList.map((value, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleCoreValue(value)}
                  style={[
                    tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                    {
                      backgroundColor: coreValues.includes(value)
                        ? themeColors.primary
                        : themeColors.secondary,
                      borderColor: themeColors.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-center text-base`,
                      {
                        color: coreValues.includes(value) ? 'white' : 'black',
                      },
                    ]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={tailwind`mt-2`}>
          <Text style={tailwind`italic text-base px-2 pb-1 mb-2`}>
            Time Priorities (Select 2)
          </Text>

          <ScrollView
            style={tailwind`max-h-72`}
            showsVerticalScrollIndicator={false}>
            <View style={tailwind`flex-row flex-wrap justify-between`}>
              {timePrioritiesList.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleTimePriority(item)}
                  style={[
                    tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                    {
                      backgroundColor: time.includes(item)
                        ? themeColors.primary
                        : themeColors.secondary,
                      borderColor: themeColors.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-center text-base`,
                      {
                        color: time.includes(item) ? 'white' : 'black',
                      },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <AithInputStandard
          fieldName="Current job"
          value={job}
          changeText={setJob}
          valid={true}
          label="Current job"
        />
        <AithInputStandard
          fieldName="Current Company"
          value={company}
          changeText={setCompany}
          valid={true}
          label="Current Company"
        />
        <StandardSelect
          fieldName="Industry"
          selected={industry}
          onSelect={setIndustry}
          optional
          options={industries}
          label="Industry"
        />
        <StandardSelect
          fieldName="Work Site"
          selected={site}
          onSelect={setSite}
          optional
          options={['Remote', 'On Site', 'Hybrid', 'Other']}
          label="Work Site"
        />
        <StandardSelect
          fieldName="Relocate Work"
          selected={reloocateWork}
          onSelect={setRelocateWork}
          optional
          options={['Yes', 'No']}
          label="Relocate Work"
        />
        <AithInputStandard
          fieldName="Education"
          value={education}
          changeText={setEducation}
          valid={true}
          label="Education"
        />
        <StandardSelect
          label="Career Ambition"
          fieldName="Career Ambition"
          selected={careerAmbition}
          onSelect={setCareerAmbition}
          options={[
            'Very Ambitious',
            'Balanced',
            'Flexible',
            'Simple Lifestyle',
            'Other',
          ]}
        />
        <StandardSelect
          label="Financial Ambition"
          fieldName="Financial Ambition"
          selected={financialAmbition}
          onSelect={setFinancialAmbition}
          options={[
            'Very Ambitious',
            'Balanced',
            'Flexible',
            'Simple Lifestyle',
            'Other',
          ]}
        />
        <StandardSelect
          label="Pace of Life"
          fieldName="Pace of Life"
          selected={pace}
          onSelect={setPace}
          options={['Fast', 'Moderate', 'Slow', 'Flexible', 'Other']}
          optional
        />
        <StandardSelect
          label="Long Term Living"
          fieldName="Long Term Living"
          selected={living}
          onSelect={setLiving}
          options={[
            'Stay near family',
            'Open to relocating',
            'Desire to move abroad',
            'No strong preference',
            'Other',
          ]}
          optional
        />
        <AithInputStandard
          fieldName="Education"
          value={fiveYearPlan}
          changeText={setFiveYearPlan}
          valid={true}
          label="5 Year Plan"
          multiline
          optional
        />
        <View style={[tailwind`flex mt-4`]}>
          <Text style={tailwind`mt-2 text-base font-semibold`}>About Me</Text>
        </View>
        <View style={[tailwind`w-full flex flex-col justify-center`]}>
          <PromptSelect
            fieldName="Prompts"
            selected={prompts}
            onSelect={updateSelectedPrompt}
          />
        </View>
        <ScrollView style={[tailwind`w-full h-8/12 mt-4`]}>
          {[...promptResponses].reverse().map(p => (
            <View key={p.prompt} style={tailwind`flex-row items-center mb-2`}>
              <StandardInputBordered
                value={p.response}
                changeValue={text => updateCurrentResponse(p.prompt, text)}
                fieldName={p.prompt}
                longContent
                placeholder={'Enter response...'}
                remove={p.prompt !== 'Who am I?'}
                removeClick={() => removePrompt(p.prompt)}
              />
            </View>
          ))}
        </ScrollView>
        <View style={tailwind`mt-2`}>
          <View
            style={tailwind`w-full flex flex-row items-center justify-between`}>
            <Text style={tailwind`text-base mt-1`}>
              Select between 3 - 8 traits
            </Text>
            <Text style={tailwind`text-sm mt-1 text-gray-600`}>
              Selected: {traits.length} / 8
            </Text>
          </View>
          <ScrollView
            style={tailwind`h-92 mt-4`}
            showsVerticalScrollIndicator={false}>
            <View style={tailwind`flex-row flex-wrap justify-between`}>
              {traitsAndHobbies.map((trait, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleTrait(trait)}
                  style={[
                    tailwind`w-[48%] p-2 mb-3 rounded-xl border`,
                    {
                      backgroundColor: traits.includes(trait)
                        ? themeColors.primary
                        : themeColors.secondary,
                      borderColor: themeColors.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      tailwind`text-center text-base`,
                      {
                        color: traits.includes(trait) ? 'white' : 'black',
                      },
                    ]}>
                    {trait}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <AgeSliderSelect
          fieldName="Age Range"
          minAge={18}
          maxAge={60}
          ageRange={ageRange}
          setAgeRange={setAgeRange}
        />
        <StandardSelect
          fieldName="Gender"
          selected={prefGender}
          onSelect={setPrefGender}
          options={['Male', 'Female', 'Other']}
          label="Gender"
        />
        <StandardSelect
          fieldName="Distance"
          selected={distance}
          onSelect={setDistance}
          options={[
            'Close (50 miles)',
            'Medium (100 miles)',
            'Far (150 miles)',
            'Everywhere (500+ miles)',
          ]}
          label="Distance"
        />
        <BackgroundSelect
          fieldName="Background"
          options={backgroundOptions}
          selected={prefBackground}
          setSelected={setPrefBackground}
          maxSelect={4}
        />
        <StandardSelect
          fieldName="Religion"
          selected={prefReligion}
          onSelect={setPrefReligion}
          options={religionOptions}
          label="Religion"
        />
        <StandardSelect
          fieldName="Religious Sect."
          selected={prefSect}
          onSelect={setPrefSect}
          options={religiousSectOptions}
          label="Religious Sect."
          optional
        />
        <StandardSelect
          fieldName="Religious Views"
          selected={prefViews}
          onSelect={setPrefViews}
          options={[
            'Must align',
            'Open to other religions',
            'Open to other sects',
            'Open to other practices',
            'Prefer not to say',
          ]}
          label="Religious Views"
          optional
        />
        <View style={tailwind`w-full flex flex-row items-center mt-3`}>
          <View style={tailwind`flex-1 flex-row flex-wrap`}>
            {uploadedImageUrls.map((_, index) => (
              <View
                style={tailwind`w-1/3 h-48 items-center justify-center p-1`}
                key={index}>
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
        <View style={tailwind`w-full flex-row justify-end`}>
          <AuthMainButton text={'Continue'} click={createUserAccount} />
        </View>
      </ScrollView>
    </View>
  );
};

export default LoadDtabaseScreen;
