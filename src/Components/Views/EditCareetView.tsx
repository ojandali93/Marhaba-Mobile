import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {Camera, ChevronsDown, ChevronsUp, X} from 'react-native-feather';
import EditSelect from '../Select/EditSelect';
import EditTextInput from '../Select/EditTextInput';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';
import {industries} from '../../Utils/SelectOptions';

const EditCareetView = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandedAbout, setExpandedAbout] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [job, setJob] = useState<string>('');
  const [company, setCompoany] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [relocateWork, setRelocateWork] = useState<string>('');
  const [site, setSite] = useState<string>('');
  const [education, setEducation] = useState<string>('');

  const [isEmpty, setIsEmpty] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCoreViews();
    }, []),
  );

  const loadCoreViews = () => {
    setJob(profile?.Career[0]?.job || '');
    setCompoany(profile?.Career[0]?.company || '');
    setEducation(profile?.Career[0]?.education || '');
    setSite(profile?.Career[0]?.site || '');
    setIndustry(profile?.Career[0]?.location || '');
    setRelocateWork(profile?.Career[0]?.fiveYear || '');

    const isAllEmpty =
      !job && !company && !education && !site && !industry && !relocateWork;
    setIsEmpty(isAllEmpty);
  };
  const updateJob = async (newJob: string) => {
    if (newJob !== job) {
      setJob(newJob);
      setChangeDetected(true);
    } else {
      setJob(newJob);
    }
  };

  const updateCompany = async (newValue: string) => {
    if (newValue !== company) {
      setCompoany(newValue);
      setChangeDetected(true);
    } else {
      setCompoany(newValue);
    }
  };

  const updateEducation = async (newEducation: string) => {
    if (newEducation !== education) {
      setEducation(newEducation);
      setChangeDetected(true);
    } else {
      setEducation(newEducation);
    }
  };

  const updateSite = async (newValue: string) => {
    if (newValue !== site) {
      setSite(newValue);
      setChangeDetected(true);
    } else {
      setSite(newValue);
    }
  };

  const updateIndustry = async (newValue: string) => {
    if (newValue !== industry) {
      setIndustry(newValue);
      setChangeDetected(true);
    } else {
      setIndustry(newValue);
    }
  };

  const updateRelocateWork = async (newValue: string) => {
    console.log('Updating relocate work');
    console.log(newValue);
    if (newValue !== relocateWork) {
      setRelocateWork(newValue);
      setChangeDetected(true);
    } else {
      setRelocateWork(newValue);
    }
  };

  const updateUserProfile = async () => {
    try {
      if (changeDetected) {
        console.log('Updating user profile');
        console.log(job, company, site, relocateWork, education, industry);
        const response = await axios.put(
          'https://marhaba-server.onrender.com/api/account/updateCareer',
          {
            userId: profile?.userId,
            job,
            company,
            site,
            relocate: relocateWork,
            education,
            industry,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          },
        );
        if (response.data.success) {
          setChangeDetected(false);
          await grabUserProfile(profile?.userId);
          loadCoreViews();
          setExpandedAbout(false);
        } else {
          console.error('Error updating user profile:', response.data.error);
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={tailwind`w-full flex flex-col mt-2 px-2`}
        onPress={() => setExpandedAbout(!expandedAbout)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <View style={tailwind`flex flex-row items-center`}>
            <Text style={tailwind`text-base font-semibold`}>
              Career & Education
            </Text>
            {isEmpty && (
              <View
                style={tailwind`w-2 h-2 rounded-full bg-orange-400 mr-2 ml-3`}
              />
            )}
          </View>
          {expandedAbout ? (
            changeDetected ? (
              <TouchableOpacity onPress={updateUserProfile}>
                <Text
                  style={[
                    tailwind`text-base font-bold px-2 py-1 rounded-md text-white`,
                    {backgroundColor: themeColors.primary},
                  ]}>
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setExpandedAbout(false)}>
                <ChevronsUp
                  height={24}
                  width={24}
                  color={themeColors.primary}
                />
              </TouchableOpacity>
            )
          ) : (
            <ChevronsDown height={24} width={24} color={themeColors.primary} />
          )}
        </View>
      </TouchableOpacity>
      <View style={tailwind`flex-1`}>
        {expandedAbout && (
          <View
            style={[
              tailwind`w-full flex flex-row items-center mb-5 mt-4 pb-3 rounded-2`,
              {backgroundColor: themeColors.secondary},
            ]}>
            <View style={tailwind`w-full pr-1`}>
              <EditTextInput
                fieldName="Job"
                selected={job}
                onSelect={updateJob}
              />
              <EditTextInput
                fieldName="Company"
                selected={company}
                onSelect={updateCompany}
              />
              <EditSelect
                fieldName="Industry"
                selected={industry}
                onSelect={updateIndustry}
                options={industries}
              />
              <EditSelect
                fieldName="Work Site"
                selected={site}
                onSelect={updateSite}
                options={['Remote', 'On Site', 'Hybrid', 'Other']}
              />
              <EditSelect
                fieldName="Relocate"
                selected={relocateWork}
                onSelect={updateRelocateWork}
                options={['Yes', 'No', 'Maybe']}
              />
              <EditTextInput
                fieldName="Education"
                selected={education}
                onSelect={updateEducation}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default EditCareetView;
