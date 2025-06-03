// UpgradeTiersScreen.js
import React, {useEffect, useState, useRef} from 'react';
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
import {useProfile} from '../../Context/ProfileContext';
import * as RNIap from 'react-native-iap';
import axios from 'axios';

const {width: screenWidth} = Dimensions.get('window');

// Tier definitions
const tiers = [
  {
    name: 'Marhabah Pro',
    price: '$4.99 / week',
    productId: 'marhabah_pro_499',
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
    productId: 'marhabah_pro_plus_899',
    perks: [
      'All Pro features',
      'Advanced filters',
      'Deeper profile insights',
      'VIP badge',
      'Priority in events',
    ],
  },
];

const UpgradeTiersScreen = () => {
  const navigation = useNavigation();
  const {profile, userId} = useProfile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize IAP
  useEffect(() => {
    RNIap.initConnection()
      .then(() => {
        console.log('✅ IAP connection initialized');
        getProducts();
      })
      .catch(err => {
        console.error('❌ IAP connection error:', err);
      });

    return () => {
      RNIap.endConnection();
    };
  }, []);

  // Fetch products from App Store
  const getProducts = async () => {
    try {
      const productIds = tiers.map(t => t.productId);
      console.log('🔍 Trying to fetch these product IDs:', productIds);

      const storeProducts = await RNIap.getSubscriptions({
        skus: productIds,
      });

      console.log('📦 Fetched products from App Store:', storeProducts);

      setProducts(storeProducts);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
    }
  };

  // Purchase flow
  const purchaseSubscription = async productId => {
    try {
      setLoading(true);
      const purchase = await RNIap.requestSubscription(productId);
      console.log('✅ Purchase successful:', purchase);

      const receipt = purchase.transactionReceipt;

      if (!receipt) {
        throw new Error('Missing receipt');
      }

      // 🔥 NOW hit your verify-subscription endpoint!
      const response = await axios.post(
        'https://marhabah-backend.onrender.com/api/subscription/verify-subscription',
        {
          userId,
          productId,
          receiptData: receipt,
        },
      );

      console.log('✅ Receipt verification response:', response.data);

      Alert.alert('Success', 'Subscription purchase completed!');
    } catch (err) {
      console.error('❌ Purchase error:', err);
      Alert.alert('Error', 'Purchase could not be completed.');
    } finally {
      setLoading(false);
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
          const isCurrentTier = profile?.tier === (index === 0 ? 2 : 3); // Assuming your tiers: Pro = 2, Pro+ = 3

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
              <Text style={tailwind`text-center text-2xl mb-4`}>
                {tier.price}
              </Text>

              {/* Perks */}
              <View style={tailwind`mb-6`}>
                {tier.perks.map((perk, i) => (
                  <Text key={i} style={tailwind`text-base mb-2 text-center`}>
                    • {perk}
                  </Text>
                ))}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                disabled={loading || isCurrentTier}
                onPress={() => purchaseSubscription(tier.productId)}
                style={[
                  tailwind`mt-4 p-3 rounded-2 items-center`,
                  {
                    backgroundColor: isCurrentTier
                      ? 'gray'
                      : themeColors.primary,
                  },
                ]}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={tailwind`text-base font-semibold text-white`}>
                    {isCurrentTier
                      ? 'Current Plan'
                      : `Subscribe to ${tier.name}`}
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
              openLink(
                'https://app.termly.io/policy-viewer/policy.html?policyUUID=6c415447-ebe1-4647-9104-e89d1c3879c8',
              )
            }>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={tailwind`text-blue-400 underline`}
            onPress={() =>
              openLink(
                'https://app.termly.io/policy-viewer/policy.html?policyUUID=2c96703e-b201-4b10-8414-c9a70374f352',
              )
            }>
            End User License Agreement (EULA)
          </Text>
          .
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UpgradeTiersScreen;
