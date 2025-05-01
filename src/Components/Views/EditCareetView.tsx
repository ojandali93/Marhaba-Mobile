import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import { getProfile, getUserId, grabUpdateuserProfile } from '../../Services/AuthStoreage';
import themeColors from '../../Utils/custonColors';
import {Camera, ChevronsDown, ChevronsUp, X} from 'react-native-feather';
import EditSelect from '../Select/EditSelect';
import EditTextInput from '../Select/EditTextInput';
import axios from 'axios';
import { lookingForOptions, timelineOptions, backgroundOptions, religionOptions, religiousSectOptions, religiousViewsOptions } from '../../Utils/SelectOptions';

const EditCareetView = () => {
    const usersProfile = getProfile()

    const [expandedAbout, setExpandedAbout] = useState(false);    
    const [changeDetected, setChangeDetected] = useState(false);  

    const [job, setJob] = useState('');
    const [company, setCompany] = useState('');
    const [education, setEducation] = useState('');
    const [site, setSite] = useState('');
    const [location, setLocation] = useState('');
    const [fiveYear, setFiveYear] = useState('');
    
    useFocusEffect(
        useCallback(() => {
            loadCoreViews();
        }, []),
      );

      const loadCoreViews = () => {
        console.log(usersProfile?.data)
        console.log('single name', usersProfile?.data?.About?.smoke)
        setJob(usersProfile?.data?.Career[0].job)
        setCompany(usersProfile?.data?.Career[0].company)
        setEducation(usersProfile?.data?.Career[0].education)
        setSite(usersProfile?.data?.Career[0].site)
        setLocation(usersProfile?.data?.Career[0].location)
        setFiveYear(usersProfile?.data?.Career[0].fiveYear)
      };

      const updateJob = async (newJob: string) => {
        if(newJob !== job) {
            setJob(newJob)
            setChangeDetected(true)
        } else {
            setJob(newJob)
        }
      };

      const updateCompany = async (newValue: string) => {
        if(newValue !== company) {
            setCompany(newValue)
            setChangeDetected(true)
        } else {
            setCompany(newValue)
        }
      };

      const updateEducation = async (newEducation: string) => {
        if(newEducation !== education) {
            setEducation(newEducation)
            setChangeDetected(true)
        } else {
            setEducation(newEducation)
        }
      };

      const updateSite = async (newValue: string) => {
        if(newValue !== site) {
            setSite(newValue)
            setChangeDetected(true)
        } else {
            setSite(newValue)
        }
      };

      const updateLocation = async (newValue: string) => {
        if(newValue !== location) {
            setLocation(newValue)
            setChangeDetected(true)
        } else {
            setLocation(newValue)
        }
      };

      const updateFiveYear = async (newValue: string) => {
        if (newValue !== fiveYear) {
          setFiveYear(newValue);
          setChangeDetected(true);
        } else {
          setFiveYear(newValue);
        }
      };

      const updateUserProfile = async () => {
        try {
          if(changeDetected) {
            const response = await axios.put(
                'https://marhaba-server.onrender.com/api/account/updateCareer',
                {
                    userId: usersProfile?.data?.userId,
                    job: job,
                    company: company,
                    education: education,
                    site: site,
                    location: location,
                    fiveYear: fiveYear,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  maxContentLength: Infinity,
                  maxBodyLength: Infinity,
                },
              );
              if(response.data.success) {
                setChangeDetected(false)
                setExpandedAbout(false)
              } else {
                console.error('Error updating user profile:', response.data.error);
              }
          }
        } catch (error) {
          console.error('Error updating user profile:', error);
        }
      };

  return(
    <View>
        <TouchableOpacity style={tailwind`w-full flex flex-col mt-2`} onPress={() => setExpandedAbout(!expandedAbout)}>
        <View style={[tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`, {backgroundColor: themeColors.darkSecondary}]}>
            <Text style={tailwind`text-base font-semibold text-gray-800`}>Career & Education</Text>
            {
                expandedAbout ? (
                    changeDetected ? (
                    <TouchableOpacity onPress={updateUserProfile}>
                        <Text style={[tailwind`text-base font-bold px-2 py-1 rounded-md text-white`, { backgroundColor: themeColors.primary }]}>
                        Save
                        </Text>
                    </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setExpandedAbout(false)}>
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
        {expandedAbout && (
        <View
          style={tailwind`w-full flex flex-row items-center mb-5`}>
         <View style={tailwind`w-full pr-1`}>
            <EditTextInput
              fieldName="Current Job"
              selected={job}
              onSelect={updateJob}
            />
            <EditTextInput
              fieldName="Current Company"
              selected={company}
              onSelect={updateCompany}
            />
            <EditTextInput
              fieldName="Education"
              selected={education}
              onSelect={updateEducation}
            />
            <EditSelect
              fieldName="Site"
              selected={site}
              onSelect={updateSite}
              options={['On Site', 'Remote', 'Hybrid', 'Other']}
            />
            <EditTextInput
              fieldName="Location"
              selected={location}
              onSelect={updateLocation}
            />
            <EditTextInput
              fieldName="Five Year Plan"
              selected={fiveYear}
              onSelect={updateFiveYear}
            />
          </View>
        </View>
        )}
        </View>
    </View>
  )
};

export default EditCareetView;