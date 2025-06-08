// UpgradeTiersScreen.js
import React, {useEffect, useState, useRef, useCallback} from 'react';
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
  Image,
} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ChevronsLeft} from 'react-native-feather';
import {useProfile} from '../../Context/ProfileContext';
import * as RNIap from 'react-native-iap';
import axios from 'axios';
import Free from '../../Assets/free.png';
import Pro from '../../Assets/pro.png';
import ProPlus from '../../Assets/pro-plus.png';

const {width: screenWidth} = Dimensions.get('window');

// Tier definitions
const tiers = [
  {
    name: 'Marhabah Free',
    price: 'Free',
    productId: 'marhabah_free',
    tierNumber: 1,
    perks: [
      'Essential Matches',
      '7 Likes / Week',
      'Basic Search (Distance, Age, Background)',
      'Limited Profile Visibility',
    ],
    image: Free,
  },
  {
    name: 'Marhabah Pro',
    price: '$4.99 / week',
    productId: 'marhabah_pro_499',
    tierNumber: 2,
    perks: [
      '12 Likes / Week',
      'See who liked you (Unblurred)',
      'Essential Seach (Religion, Sect)',
      'Priority in Search',
      'Essential Profile Visibility',
      'Profile Video Visibility',
    ],
    image: Pro,
  },
  {
    name: 'Marhabah Pro+',
    price: '$8.99 / week',
    productId: 'marhabah_pro_plus_899',
    tierNumber: 3,
    perks: [
      '20 Likes / Week',
      'Advanced Filters',
      'Deeper Profile Insights',
      'Pro+ Badge',
      'Full Profile Visibility',
      'Profile Video Visibility',
    ],
    image: ProPlus,
  },
];

const UpgradeTiersScreen = () => {
  const navigation = useNavigation();
  const {profile, userId, checkActiveSubscription} = useProfile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize IAP
  useEffect(() => {
    RNIap.initConnection()
      .then(async () => {
        console.log('✅ IAP connection initialized');
        await getProducts();
      })
      .catch(err => {
        console.error('❌ IAP connection error:', err);
        Alert.alert(
          'IAP Connection Error',
          err?.message || JSON.stringify(err),
        );
      });

    return () => {
      RNIap.endConnection();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId && profile) {
        checkActiveSubscription(userId, profile);
      }
    }, [userId, profile]),
  );

  // Fetch products from App Store
  const getProducts = async () => {
    try {
      const productIds = tiers.map(t => t.productId);

      const storeProducts = await RNIap.getSubscriptions({skus: productIds});
      console.log('📦 Fetched products:', JSON.stringify(storeProducts));

      if (storeProducts.length === 0) {
        console.warn('⚠️ No products returned from App Store.');
        Alert.alert(
          'No Products',
          'No subscriptions were found. Please ensure your products are approved and Ready for Sale in App Store Connect.',
        );
      }

      setProducts(storeProducts);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      Alert.alert(
        'Error Fetching Products',
        err?.message || JSON.stringify(err),
      );
    }
  };

  // Purchase flow
  const purchaseSubscription = async productId => {
    try {
      setLoading(true);
      console.log(`🛒 Requesting subscription for productId: ${productId}`);

      const purchase = await RNIap.requestSubscription({sku: productId});
      console.log('✅ Purchase successful:', purchase);

      const receipt = purchase?.transactionReceipt;
      console.log('✅ Receipt:', receipt);

      if (!receipt) {
        throw new Error('Missing receipt');
      }

      // 🔥 Send receipt to server
      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/subscription/verify-subscription',
        {
          userId,
          productId,
          transactionDate: purchase.transactionDate,
          transactionId: purchase.transactionId,
          transactionReceipt: purchase.transactionReceipt,
        },
      );

      console.log('✅ Receipt verification response:', response.data);

      Alert.alert('Success', 'Subscription purchase completed!');
    } catch (err) {
      console.log('❌ Purchase error:', err);
      Alert.alert(
        'Purchase Error',
        `An error occurred during the purchase: ${
          err?.message || JSON.stringify(err)
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/user/cancelSubscription',
        {
          userId,
        },
      );
      console.log('✅ Subscription canceled:', response.data);
      if (response.data.success) {
        Alert.alert('Success', 'Subscription canceled successfully!');
        Linking.openURL('https://apps.apple.com/account/subscriptions').catch(
          err => console.error('Failed to open subscriptions URL:', err),
        );
      } else {
        Alert.alert('Error', 'Failed to cancel subscription.');
      }
    } catch (err) {
      console.log('❌ Cancel subscription error:', err);
    }
  };

  // Open Apple Manage Subscription link
  const openManageSubscriptions = () => {
    Alert.alert(
      'Manage Subscription',
      'Subscriptions can be canceled from your Apple ID settings. Would you like to open your Subscriptions page?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Cancel Subscription',
          onPress: async () => {
            cancelSubscription();
          },
        },
      ],
    );
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
        style={tailwind`p-4 border-b border-gray-700 flex-row items-center`}>
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
          const isCurrentTier = profile?.tier === tier.tierNumber;

          return (
            <View
              key={index}
              style={[
                tailwind`m-4 p-6 w-22/24 rounded-3 justify-between`,
                {
                  width: screenWidth - 35,
                  backgroundColor: themeColors.secondary,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 4},
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 8,
                },
              ]}>
              <View>
                {/* Tier Name */}
                <Text
                  style={[
                    tailwind`text-center text-3xl font-bold mb-3`,
                    {color: themeColors.primary},
                  ]}>
                  {tier.name}
                </Text>

                {/* Price */}
                <Text style={tailwind`text-center text-2xl mb-2`}>
                  {tier.price}
                </Text>
                <View style={tailwind`flex-row justify-center`}>
                  <Image source={tier.image} style={tailwind`w-1/2 h-50`} />
                </View>
              </View>

              <View>
                {/* Perks */}
                <View style={tailwind`mb-6`}>
                  {tier.perks.map((perk, i) => (
                    <Text key={i} style={tailwind`text-base mb-2 text-center`}>
                      • {perk}
                    </Text>
                  ))}
                </View>
                <View>
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
                      <Text
                        style={tailwind`text-base font-semibold text-white`}>
                        {isCurrentTier
                          ? 'Current Plan'
                          : `Subscribe to ${tier.name}`}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Cancel Subscription link for active paid tier */}
                  {isCurrentTier && tier.tierNumber !== 1 && (
                    <TouchableOpacity onPress={openManageSubscriptions}>
                      <Text
                        style={tailwind`text-center text-sm text-blue-500 underline mt-4`}>
                        Cancel Subscription
                      </Text>
                    </TouchableOpacity>
                  )}
                  {/* Action Button */}
                </View>
              </View>
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
