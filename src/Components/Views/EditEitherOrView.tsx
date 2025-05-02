import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {Camera, ChevronsDown, ChevronsUp, X} from 'react-native-feather';
import EditSelect from '../Select/EditSelect';
import EditTextInput from '../Select/EditTextInput';
import axios from 'axios';
import { useProfile } from '../../Context/ProfileContext';
const EditEitherOrView = () => {
    const {profile} = useProfile();

    const [expandedAbout, setExpandedAbout] = useState(false);    
    const [changeDetected, setChangeDetected] = useState(false);  

    const [friday, setFriday] = useState('');
    const [energy, setEnergy] = useState('');
    const [planning, setPlanning] = useState('');
    const [morningEnergy, setMorningEnergy] = useState('');
    const [social, setSocial] = useState('');
    const [veted, setVeted] = useState('');
    const [pineapple, setPineapple] = useState('');
    const [giveUp, setGiveUp] = useState('');
    const [communication, setCommunication] = useState('');
    const [firstSight, setFirstSight] = useState('');
    const [morning, setMorning] = useState('');
    const [travel, setTravel] = useState('');
    const [spicy, setSpicy] = useState('');
    const [decision, setDecision] = useState('');
    const [arrive, setArrive] = useState('');
    const [partner, setPartner] = useState('');
    const [move, setMove] = useState('');
    const [opposite, setOpposite] = useState('');
    const [ghost, setGhost] = useState('');
    const [longDistance, setLongDistance] = useState('');
    
    useFocusEffect(
        useCallback(() => {
            loadCoreViews();
        }, []),
      );

      const loadCoreViews = () => {
        const eo = profile?.data?.Survey[0] || {};
        setFriday(eo.friday || '');
        setEnergy(eo.energy || '');
        setPlanning(eo.planning || '');
        setMorningEnergy(eo.morningEnergy || '');
        setSocial(eo.social || '');
        setVeted(eo.veted || '');
        setPineapple(eo.pineapple || '');
        setGiveUp(eo.giveUp || '');
        setCommunication(eo.communication || '');
        setFirstSight(eo.firstSight || '');
        setMorning(eo.morning || '');
        setTravel(eo.travel || '');
        setSpicy(eo.spicy || '');
        setDecision(eo.decision || '');
        setArrive(eo.arrive || '');
        setPartner(eo.partner || '');
        setMove(eo.move || '');
        setOpposite(eo.opposite || '');
        setGhost(eo.ghost || '');
        setLongDistance(eo.longDistance || '');
      };

      const updateFriday = async (newTravel: string) => {
        if(newTravel !== friday) {
            setFriday(newTravel)
            setChangeDetected(true)
        } else {
            setFriday(newTravel)
        }
      };

      const updateEnergy = async (newValue: string) => {
        if(newValue !== energy) {
            setEnergy(newValue)
            setChangeDetected(true)
        } else {
            setEnergy(newValue)
        }
      };

      const updatePlanning = async (newTravel: string) => {
        if(newTravel !== planning) {
            setPlanning(newTravel)
            setChangeDetected(true)
        } else {
            setPlanning(newTravel)
        }
      };

      const updateMorningEnergy = async (newValue: string) => {
        if(newValue !== morningEnergy) {
            setMorningEnergy(newValue)
            setChangeDetected(true)
        } else {
            setMorningEnergy(newValue)
        }
      };

      const updateSocial = async (newTravel: string) => {
        if(newTravel !== social) {
            setSocial(newTravel)
            setChangeDetected(true)
        } else {
            setSocial(newTravel)
        }
      };

      const uppdateVeted = async (newValue: string) => {
        if(newValue !== veted) {
            setVeted(newValue)
            setChangeDetected(true)
        } else {
            setVeted(newValue)
        }
      };

      const updatePineapple = async (newTravel: string) => {
        if(newTravel !== pineapple) {
            setPineapple(newTravel)
            setChangeDetected(true)
        } else {
            setPineapple(newTravel)
        }
      };

      const updateGiveUp = async (newValue: string) => {
        if(newValue !== giveUp) {
            setGiveUp(newValue)
            setChangeDetected(true)
        } else {
            setGiveUp(newValue)
        }
      };

      const updateCommunication = async (newValue: string) => {
        if(newValue !== communication) {
            setCommunication(newValue)
            setChangeDetected(true)
        } else {
            setCommunication(newValue)
        }
      };

      const updateFirstSight = async (newValue: string) => {
        if(newValue !== firstSight) {
            setFirstSight(newValue)
            setChangeDetected(true)
        } else {
            setFirstSight(newValue)
        }
      };

      const updateMorning = async (newValue: string) => {
        if(newValue !== morning) {
            setMorning(newValue)
            setChangeDetected(true)
        } else {
            setMorning(newValue)
        }
      };

      const updateTravel = async (newValue: string) => {
        if(newValue !== travel) {
            setTravel(newValue)
            setChangeDetected(true)
        } else {
            setTravel(newValue)
        }
      };

      const updateSpicy = async (newValue: string) => {
        if(newValue !== spicy) {
            setSpicy(newValue)
            setChangeDetected(true)
        } else {
            setSpicy(newValue)
        }
      };

      const updateDecision = async (newValue: string) => {
        if(newValue !== decision) {
            setDecision(newValue)
            setChangeDetected(true)
        } else {
            setDecision(newValue)
        }
      };

      const updateArrive = async (newValue: string) => {
        if(newValue !== arrive) {
            setArrive(newValue)
            setChangeDetected(true)
        } else {
            setArrive(newValue)
        }
      };

      const updatePartner = async (newValue: string) => {
        if(newValue !== partner) {
            setPartner(newValue)
            setChangeDetected(true)
        } else {
            setPartner(newValue)
        }
      };

      const updateMove = async (newValue: string) => {
        if(newValue !== move) {
            setMove(newValue)
            setChangeDetected(true)
        } else {
            setMove(newValue)
        }
      };

      const updateOpposite = async (newValue: string) => {
        if(newValue !== opposite) {
            setOpposite(newValue)
            setChangeDetected(true)
        } else {
            setOpposite(newValue)
        }
      };

      const updateGhost = async (newValue: string) => {
        if(newValue !== ghost) {
            setGhost(newValue)
            setChangeDetected(true)
        } else {
            setGhost(newValue)
        }
      };

      const updateLongDistance = async (newValue: string) => {
        if(newValue !== longDistance) {
            setLongDistance(newValue)
            setChangeDetected(true)
        } else {
            setLongDistance(newValue)
        }
      };

      const updateUserProfile = async () => {
        try {
          if(changeDetected) {
            const response = await axios.put(
                'https://marhaba-server.onrender.com/api/account/updateLifestyle',
                {
                    userId: profile?.data?.userId,
                    travel: travel,
                    social: social,
                    health: health,
                    finances: finances,
                    living: living,
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
        <TouchableOpacity style={tailwind`w-full flex flex-col`} onPress={() => setExpandedAbout(!expandedAbout)}>
        <View style={tailwind`w-full flex flex-row items-center justify-between border-t border-t-gray-600 p-3`}>
            <Text style={tailwind`text-2xl font-semibold`}>Lifestyle</Text>
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
            <EditSelect
              fieldName="Traveling"
              selected={travel}
              onSelect={updateTravel}
              options={['Frequent Travel', 'Enjoy Occasional Trip', 'Prefer Staycations', 'Rarely Travel', 'Other']}
            />
            <EditSelect
              fieldName="Social Life"
              selected={social}
              onSelect={updateSocial}
              options={['Very Social', 'Moderately Social', 'Selective Socializing', 'Not Very Social', 'Other']}
            />
            <EditSelect
            fieldName="Health"
              selected={health}
              onSelect={updateHealth}
              options={['Critical', 'Important', 'Moderate', 'Not Important', 'Other']}
            />
            <EditSelect
              fieldName="Finances"
              selected={finances}
              onSelect={updateFinances}
              options={['Saver', 'Spender', 'Balanced', 'Flexible', 'Other']}
            />
            <EditSelect
              fieldName="Living Preference"
              selected={living}
              onSelect={updateLiving}
              options={['In the City', 'In the Suburbs', 'In the Countryside', 'Flexible', 'Other']}
            />
          </View>
        </View>
        )}
        </View>
    </View>
  )
};

export default EditEitherOrView;