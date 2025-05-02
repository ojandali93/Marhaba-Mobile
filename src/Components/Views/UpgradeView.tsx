import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import tailwind from 'twrnc';
import { ChevronsLeft, Check, X } from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import { useProfile } from '../../Context/ProfileContext';

const tiers = [
  {
    id: 1,
    name: 'Free Tier',
    price: 'Free',
    features: [
      '10 Likes / Week',
      '5 Super Likes / Week',
      'Standard approval time',
      'Limited Match Views',
      'Limited Profile Information',
      'Limited Filters: Age, Distance, Looking For'
    ],
  },
  {
    id: 2,
    name: 'Marhabah Pro',
    price: '$9.99/mo',
    originalPrice: '$14.99/mo',
    features: [
      'Unlimited Likes',
      '15 Super Likes / Week',
      'See who liked you',
      '3 extra profile photos',
      'Advanced filters: Religion, Background, Timeline',
      'Priority profile review',
      'Hide age & distance',
    ],
  },
  {
    id: 3,
    name: 'Marhabah Pro+',
    price: '$16.99/mo',
    originalPrice: '$24.99/mo',
    features: [
      'Everything in Pro',
      'Unlimited Super Likes',
      '1 Weekly Boost / Month',
      'Most Compatible Feed',
      'See who viewed your profile',
      'Match Priority',
      'Filter by values, love languages, etc.',
      'Verified Pro badge',
      'Early feature access',
    ],
  },
];

const UpgradeView = ({ updateTab }: { updateTab: (tab: string) => void }) => {
  const {profile} = useProfile();
  const currentTier = profile?.data?.tier || 1;
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const handleUpgradeConfirm = (tierId: number) => {
    Alert.alert(
      'Confirm Upgrade',
      `Are you sure you want to upgrade to ${tiers.find(t => t.id === tierId)?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // ✅ Here you'd call your API to upgrade the user
            setSelectedTier(null);
            Alert.alert('Success', 'Your plan has been updated!');
          },
        },
      ],
    );
  };

  return (
    <View style={tailwind`flex-1`}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => updateTab('profile')}
        style={tailwind`flex-row items-center mt-2 ml-3`}>
        <ChevronsLeft height={28} width={28} color={themeColors.primary} />
        <Text style={tailwind`text-2xl font-semibold ml-2 text-[${themeColors.primary}]`}>
          Profile
        </Text>
      </TouchableOpacity>

      {/* Current Plan */}
      <View style={tailwind`mt-5 px-5`}>
        <Text style={tailwind`text-lg text-gray-500`}>Your current plan:</Text>
        <Text style={tailwind`text-2xl font-bold mt-1`}>
          {tiers.find(t => t.id === currentTier)?.name}
        </Text>
      </View>

      {/* All Plans */}
      <ScrollView style={tailwind`mt-4 px-4`}>
        {tiers.map((tier) => {
          const isCurrent = tier.id === currentTier;
          return (
            <View
              key={tier.id}
              style={[
                tailwind`mb-4 p-4 rounded-xl`,
                {
                  backgroundColor: isCurrent
                    ? themeColors.primary
                    : themeColors.darkSecondary,
                },
              ]}
            >
              <View style={tailwind`flex-row justify-between items-center mb-2`}>
                <Text style={[tailwind`text-xl font-bold`, {color: isCurrent ? themeColors.darkSecondary : themeColors.primary}]}>{tier.name}</Text>
                <Text style={[tailwind`text-white`, {color: isCurrent ? themeColors.darkSecondary : themeColors.primary}]}>{tier.price} <Text style={tailwind`text-gray-400 line-through`}>{tier.originalPrice}</Text></Text>
              </View>

              {tier.features.map((feature, index) => (
                <View key={index} style={tailwind`flex-row items-center mt-1`}>
                    {
                        feature.includes('Limited') ? (
                            <X height={16} width={16} color={isCurrent ? themeColors.darkSecondary : themeColors.primary} />
                        ) : (
                            <Check height={16} width={16} color={isCurrent ? themeColors.darkSecondary : themeColors.primary} />
                        )
                    }
                  <Text style={[tailwind`ml-2 text-sm`, {color: isCurrent ? themeColors.darkSecondary : themeColors.primary}]}>{feature}</Text>
                </View>
              ))}

              {!isCurrent && (
                <TouchableOpacity
                  onPress={() => handleUpgradeConfirm(tier.id)}
                  style={tailwind`mt-4 bg-white py-2 px-4 rounded-full`}>
                  <Text style={tailwind`text-center font-bold text-[${themeColors.primary}]`}>
                    Upgrade to {tier.name}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default UpgradeView;
