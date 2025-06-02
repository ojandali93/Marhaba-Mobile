// UpgradeTiersScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useNavigation} from '@react-navigation/native';
import {ChevronsLeft} from 'react-native-feather';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';

// Tier definitions
const tiers = [
  {
    name: 'Marhabah Free',
    price: 'Free',
    perks: ['Basic matching', 'Basic chat', 'Browse profiles'],
  },
  {
    name: 'Marhabah Pro',
    price: '$4.99 / week',
    perks: [
      'See who liked you',
      'Unlimited likes',
      'Priority in search',
      'Access exclusive prompts',
    ],
  },
  {
    name: 'Marhabah Pro+',
    price: '$8.99 / week',
    perks: [
      'All Pro features',
      'Advanced filters',
      'Deeper profile insights',
      'VIP badge',
      'Priority in events',
    ],
  },
];

// Mapping names to DB values
const tierMapping = {
  'Marhabah Free': 1,
  'Marhabah Pro': 2,
  'Marhabah Pro+': 3,
};

const UpgradeTiersScreen = () => {
  const navigation = useNavigation();
  const [loadingTier, setLoadingTier] = useState(null);
  const {profile, userId} = useProfile();

  const handleUpgrade = async tierName => {
    setLoadingTier(tierName);

    const tier = tierMapping[tierName];

    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/user/upgrade',
        {
          userId,
          tier,
        },
      );

      if (response.data.success) {
        console.log(`✅ Tier updated to ${tierName}`);

        // Simulate processing
        setTimeout(() => {
          setLoadingTier(null);
          Alert.alert('You are all set!', `You have upgraded to ${tierName}.`);
        }, 2000);
      } else {
        console.error('⚠️ Failed to update tier:', response.data.error);
        setLoadingTier(null);
        Alert.alert('Error', 'Failed to upgrade your tier. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error updating tier:', error);
      setLoadingTier(null);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      {/* Header */}
      <View
        style={tailwind`p-4 border-b border-gray-700 flex-row items-center justify-between`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronsLeft color={themeColors.primary} height={24} width={24} />
        </TouchableOpacity>
        <Text style={tailwind`text-2xl font-bold text-gray-800 ml-2`}>
          Upgrade Tiers
        </Text>
        <View style={{width: 24}} />
      </View>

      {/* Body */}
      <ScrollView style={tailwind`flex-1 px-4 py-4 mb-8`}>
        {tiers.map((tier, index) => {
          const isCurrentTier = profile?.tier === tierMapping[tier.name];
          return (
            <View
              key={index}
              style={[
                tailwind`mb-5 p-4 rounded-3 border`,
                {
                  borderColor: themeColors.primary,
                  backgroundColor: themeColors.darkSecondary,
                },
              ]}>
              {/* Tier Name */}
              <Text
                style={[
                  tailwind`text-xl font-bold mb-2`,
                  {color: themeColors.primary},
                ]}>
                {tier.name}
              </Text>

              {/* Price */}
              <Text style={tailwind`text-lg mb-3`}>{tier.price}</Text>

              {/* Perks */}
              {tier.perks.map((perk, i) => (
                <Text key={i} style={tailwind`text-base mb-1`}>
                  • {perk}
                </Text>
              ))}

              {/* Action Button */}
              <TouchableOpacity
                disabled={loadingTier !== null || isCurrentTier}
                onPress={() => handleUpgrade(tier.name)}
                style={[
                  tailwind`mt-4 p-3 rounded-2 items-center`,
                  {
                    backgroundColor: isCurrentTier
                      ? 'gray'
                      : themeColors.primary,
                  },
                ]}>
                {loadingTier === tier.name ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={tailwind`text-white text-base font-semibold`}>
                    {isCurrentTier ? 'Current Plan' : `Switch to ${tier.name}`}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpgradeTiersScreen;
