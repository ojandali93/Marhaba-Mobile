import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, Alert, ScrollView} from 'react-native';
import tailwind from 'twrnc';
import {ChevronsLeft, Check, X} from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';
import * as RNIap from 'react-native-iap';

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
      'Limited Filters: Age, Distance, Looking For',
    ],
  },
  {
    id: 2,
    name: 'Marhabah Pro',
    priceAmount: 9.99,
    price: '$9.99/mo',
    originalPrice: '',
    features: [
      'Unlimited Likes',
      '15 Super Likes / Week',
      'See who liked you',
      'Advanced filters: Religion, Background, Timeline',
      'Priority profile review',
    ],
  },
  {
    id: 3,
    name: 'Marhabah Pro+',
    price: '$24.99/mo',
    priceAmount: 24.99,
    originalPrice: '$34.99/mo',
    features: [
      'Everything in Pro',
      '20 Super Likes / Week',
      '1 Weekly Boost / Month',
      'Match Priority',
      'See who viewed your profile',
      'Filter by values, love languages, etc.',
      'Verified Pro badge',
      'Early feature access',
      'Connect socials to Marhabah',
    ],
  },
];

const UpgradeView = ({updateTab}: {updateTab: (tab: string) => void}) => {
  const {profile} = useProfile();
  const currentTier = profile?.data?.tier || 1;
  const [availableSubs, setAvailableSubs] = useState<any[]>([]);

  const productIds = [
    'marhabah_pro_999_tier',
    'marhabah_pro_2499_tier',
    'marhabah_pro_999_sub',
    'marhabah_pro_2499_sub',
  ];
  useEffect(() => {
    const initIAP = async () => {
      try {
        await RNIap.initConnection();
        const subscriptions = await RNIap.getSubscriptions(productIds);
        setAvailableSubs(subscriptions);
      } catch (err) {
        console.warn('IAP init error:', err);
      }
    };

    initIAP();

    return () => {
      RNIap.endConnection();
    };
  }, []);

  useEffect(() => {
    const purchaseUpdate = RNIap.purchaseUpdatedListener(async purchase => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        console.log('✅ Purchase complete:', {
          transactionId: purchase.transactionId,
          productId: purchase.productId,
          transactionDate: purchase.transactionDate,
          receipt: receipt,
        });

        await RNIap.finishTransaction(purchase);
        // In production, send receipt to your server to verify & store
      }
    });

    const purchaseError = RNIap.purchaseErrorListener(error => {
      console.error('❌ Purchase error:', error);
    });

    return () => {
      purchaseUpdate.remove();
      purchaseError.remove();
    };
  }, []);

  const handleUpgradeConfirm = (tierId: number) => {
    const tier = tiers.find(t => t.id === tierId);
    const sku =
      tierId === 2 ? productIds[0] : tierId === 3 ? productIds[1] : null;

    if (!sku) return;

    Alert.alert(
      `Upgrade to ${tier?.name}`,
      `Features:\n\n${tier?.features.join('\n')}\n\nPrice: ${tier?.price}`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await RNIap.requestSubscription({sku});
            } catch (err) {
              console.warn('❌ Error starting subscription:', err);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={tailwind`flex-1`}>
      <TouchableOpacity
        onPress={() => updateTab('profile')}
        style={tailwind`flex-row items-center pt-2`}>
        <ChevronsLeft height={28} width={28} color={themeColors.primary} />
        <Text
          style={tailwind`text-2xl font-semibold ml-2 text-[${themeColors.primary}]`}>
          Profile
        </Text>
      </TouchableOpacity>

      <View style={tailwind`mt-5`}>
        <Text style={tailwind`text-lg text-white`}>Your current plan:</Text>
        <Text style={tailwind`text-2xl font-bold mt-1 text-white`}>
          {tiers.find(t => t.id === currentTier)?.name}
        </Text>
      </View>

      <ScrollView style={tailwind`mt-4`}>
        {tiers.map(tier => {
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
              ]}>
              <View
                style={tailwind`flex-row justify-between items-center mb-2`}>
                <Text
                  style={[
                    tailwind`text-xl font-bold`,
                    {
                      color: isCurrent
                        ? themeColors.darkSecondary
                        : themeColors.primary,
                    },
                  ]}>
                  {tier.name}
                </Text>
                <Text
                  style={[
                    tailwind`text-white`,
                    {
                      color: isCurrent
                        ? themeColors.darkSecondary
                        : themeColors.primary,
                    },
                  ]}>
                  {tier.price}{' '}
                  <Text style={tailwind`text-gray-400 line-through`}>
                    {tier.originalPrice}
                  </Text>
                </Text>
              </View>

              {tier.features.map((feature, index) => (
                <View key={index} style={tailwind`flex-row items-center mt-1`}>
                  {feature.includes('Limited') ? (
                    <X
                      height={16}
                      width={16}
                      color={
                        isCurrent
                          ? themeColors.darkSecondary
                          : themeColors.primary
                      }
                    />
                  ) : (
                    <Check
                      height={16}
                      width={16}
                      color={
                        isCurrent
                          ? themeColors.darkSecondary
                          : themeColors.primary
                      }
                    />
                  )}
                  <Text
                    style={[
                      tailwind`ml-2 text-sm`,
                      {
                        color: isCurrent
                          ? themeColors.darkSecondary
                          : themeColors.primary,
                      },
                    ]}>
                    {feature}
                  </Text>
                </View>
              ))}

              {!isCurrent && (
                <TouchableOpacity
                  onPress={() => handleUpgradeConfirm(tier.id)}
                  style={tailwind`mt-4 bg-white py-2 px-4 rounded-full`}>
                  <Text
                    style={tailwind`text-center font-bold text-[${themeColors.primary}]`}>
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
