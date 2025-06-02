import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Text, TouchableOpacity, View, ScrollView, Alert} from 'react-native';
import tailwind from 'twrnc';
import {ChevronsDown, ChevronsUp} from 'react-native-feather';
import EditTextInput from '../Select/EditTextInput';
import axios from 'axios';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';
import EditSocialsInput from './EditSocialsInput';

const EditSocialsView = () => {
  const {profile, grabUserProfile} = useProfile();

  const [expandSocials, setExpandSocials] = useState(false);
  const [changeDetected, setChangeDetected] = useState(false);

  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [tiktok, setTiktok] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadSocials();
    }, []),
  );

  const loadSocials = () => {
    const socials = profile?.Socials?.[0];
    if (socials) {
      setInstagram(socials.instagram || '');
      setTwitter(socials.twitter || '');
      setFacebook(socials.facebook || '');
      setLinkedin(socials.linkedin || '');
      setTiktok(socials.tiktok || '');
    }
  };

  const markChange = (
    value: string,
    setter: (v: string) => void,
    current: string,
  ) => {
    if (value !== current) setChangeDetected(true);
    setter(value);
  };

  const updateSocials = async () => {
    try {
      if (!changeDetected) return;

      const res = await axios.put(
        'https://marhaba-server.onrender.com/api/user/socials',
        {
          userId: profile?.userId,
          instagram,
          twitter,
          facebook,
          linkedin,
          tiktok,
        },
      );

      if (res.data.success) {
        setChangeDetected(false);
        grabUserProfile(profile?.userId);
        setExpandSocials(false);
      } else {
        console.error('❌ Failed to save socials:', res.data.error);
        Alert.alert('Update Failed', 'Could not save your social links.');
      }
    } catch (err) {
      console.error('❌ Error updating socials:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={tailwind`w-full flex flex-col mt-2 px-2  `}
        onPress={() => setExpandSocials(!expandSocials)}>
        <View
          style={[
            tailwind`w-full flex flex-row items-center justify-between p-3 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>Social Handles</Text>
          {expandSocials ? (
            changeDetected ? (
              <TouchableOpacity onPress={updateSocials}>
                <Text
                  style={[
                    tailwind`text-base font-bold px-2 py-1 rounded-md text-white`,
                    {backgroundColor: themeColors.primary},
                  ]}>
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setExpandSocials(false)}>
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

      {expandSocials && (
        <ScrollView
          style={[
            tailwind`w-full rounded-3 my-3 px-3 py-2`,
            {backgroundColor: themeColors.secondary},
          ]}>
          <EditSocialsInput
            fieldName="Instagram"
            selected={instagram}
            onSelect={(val: string) => markChange(val, setInstagram, instagram)}
          />
          <EditSocialsInput
            fieldName="Twitter / X"
            selected={twitter}
            onSelect={(val: string) => markChange(val, setTwitter, twitter)}
          />
          <EditSocialsInput
            fieldName="Facebook"
            selected={facebook}
            onSelect={(val: string) => markChange(val, setFacebook, facebook)}
          />
          <EditSocialsInput
            fieldName="LinkedIn"
            selected={linkedin}
            onSelect={(val: string) => markChange(val, setLinkedin, linkedin)}
          />
          <EditSocialsInput
            fieldName="TikTok"
            selected={tiktok}
            onSelect={(val: string) => markChange(val, setTiktok, tiktok)}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default EditSocialsView;
