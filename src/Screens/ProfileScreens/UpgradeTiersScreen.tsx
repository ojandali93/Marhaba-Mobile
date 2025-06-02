// UpgradeTiersScreen.js
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Linking,
  Dimensions,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useNavigation} from '@react-navigation/native';
import {ChevronsLeft} from 'react-native-feather';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';

const {width: screenWidth} = Dimensions.get('window');

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

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

  const openLink = url => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);
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

      {/* Tiers - Full Screen Snap Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={tailwind`flex-grow`}>
        {tiers.map((tier, index) => {
          const isCurrentTier = profile?.tier === tierMapping[tier.name];
          return (
            <View
              key={index}
              style={[
                tailwind`m-4 p-6 rounded-3 justify-between`,
                {
                  width: screenWidth - 40,
                  backgroundColor: themeColors.secondary,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 4},
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 8,
                },
              ]}>
              {/* Tier Name */}
              <Text
                style={[
                  tailwind`text-center text-3xl font-bold mb-3`,
                  {color: themeColors.primary},
                ]}>
                {tier.name}
              </Text>

              {/* Price */}
              <Text style={tailwind`text-center text-2xl mb-4 `}>
                {tier.price}
              </Text>

              {/* Perks */}
              <View style={tailwind`mb-6`}>
                {tier.perks.map((perk, i) => (
                  <Text key={i} style={tailwind`text-base  mb-2 text-center`}>
                    • {perk}
                  </Text>
                ))}
              </View>

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
                  <Text style={tailwind` text-base font-semibold`}>
                    {isCurrentTier ? 'Current Plan' : `Switch to ${tier.name}`}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Page Indicator */}
      <View style={tailwind`flex-row justify-center mb-4`}>
        {tiers.map((_, index) => (
          <View
            key={index}
            style={[
              tailwind`mx-1 w-3 h-3 rounded-full`,
              {
                backgroundColor:
                  currentIndex === index
                    ? themeColors.primary
                    : themeColors.darkGrey,
                opacity: currentIndex === index ? 1 : 0.5,
              },
            ]}
          />
        ))}
      </View>

      {/* Disclaimer & Legal */}
      <View style={tailwind`px-5 pb-14`}>
        <Text style={tailwind`text-xs text-gray-400 leading-relaxed`}>
          Subscriptions automatically renew unless auto-renew is turned off at
          least 24-hours before the end of the current period. Payment will be
          charged to your iTunes Account at confirmation of purchase.
        </Text>
        <Text style={tailwind`text-xs text-gray-400 mt-2 leading-relaxed`}>
          By purchasing a subscription, you agree to our{' '}
          <Text
            style={tailwind`text-blue-400 underline`}
            onPress={() =>
              openLink('https://yourwebsite.com/terms-of-service')
            }>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={tailwind`text-blue-400 underline`}
            onPress={() => openLink('https://yourwebsite.com/eula')}>
            End User License Agreement (EULA)
          </Text>
          .
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UpgradeTiersScreen;
