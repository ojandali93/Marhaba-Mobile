import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import tailwind from 'twrnc';
import {ChevronsLeft, Check, X} from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';
import * as RNIap from 'react-native-iap';
import {track} from '@amplitude/analytics-react-native';

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

const UpgradeView = ({updateTab}) => {
  const {profile} = useProfile();
  const currentTier = profile?.data?.tier || 1;
  const [availableSubs, setAvailableSubs] = useState<RNIap.Subscription[]>([]);

  const productIds = React.useMemo(
    () => ['marhabah_pro_subscriptions', 'marhabah_pro_plus_subscriptions'],
    [],
  );

  useEffect(() => {
    track('Viewed Upgrade Screen', {
      targetUserId: profile.userId,
    });

    const initIAP = async () => {
      try {
        console.log('🔄 Initializing IAP connection...');
        await RNIap.initConnection();
        console.log('✅ IAP connection initialized');

        console.log('📦 Fetching subscriptions for product IDs:', productIds);
        const subscriptions = await RNIap.getSubscriptions({skus: productIds});
        console.log(
          '📦 Available Subscriptions:',
          JSON.stringify(subscriptions, null, 2),
        );
        setAvailableSubs(subscriptions);
      } catch (err: any) {
        console.warn('❌ IAP init error:', err);
        console.warn('❌ Error details:', {
          message: err?.message,
          code: err?.code,
          stack: err?.stack,
        });
      }
    };

    initIAP();

    return () => {
      RNIap.endConnection();
    };
  }, [productIds, profile.userId]);

  useEffect(() => {
    const purchaseUpdate = RNIap.purchaseUpdatedListener(async purchase => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        console.log('✅ Purchase complete:', purchase);

        try {
          const res = await fetch(
            'https://marhaba-server.onrender.com/api/subscription/verify-subscription',
            {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                userId: profile.userId,
                receipt: receipt,
                productId: purchase.productId,
              }),
            },
          );

          const data = await res.json();
          if (data.success) {
            console.log('🎉 Receipt verified and stored.');
            await RNIap.finishTransaction(purchase);
            Alert.alert('Success', 'Your subscription is now active!');
            updateTab('profile');
          } else {
            console.warn('❌ Receipt verification failed');
            Alert.alert(
              'Verification Failed',
              'Could not verify your subscription.',
            );
          }
        } catch (err) {
          console.error('❌ Server verification error:', err);
          Alert.alert('Error', 'There was an issue verifying the receipt.');
        }
      }
    });

    const purchaseError = RNIap.purchaseErrorListener(error => {
      console.error('❌ Purchase error:', error);
      Alert.alert(
        'Purchase Error',
        error?.message || 'An error occurred during purchase.',
      );
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
              track('Started Upgrade', {
                targetUserId: profile.userId,
                tier: tier?.name,
              });

              console.log('🚀 Requesting subscription for SKU:', sku);
              await RNIap.requestSubscription(sku);
            } catch (err) {
              console.warn('❌ Error requesting subscription:', err);
              Alert.alert(
                'Purchase Failed',
                'There was an issue starting the subscription.',
              );
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

      <TouchableOpacity
        style={tailwind`mt-4`}
        onPress={() =>
          Linking.openURL(
            'https://app.termly.io/policy-viewer/policy.html?policyUUID=36e1fc4b-c6f8-47a7-b03f-8fd1e1144c89',
          )
        }>
        <Text style={tailwind`underline text-gray-300`}>
          View Privacy Policy
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tailwind`mt-4`}
        onPress={() =>
          Linking.openURL(
            'https://app.termly.io/policy-viewer/policy.html?policyUUID=2c96703e-b201-4b10-8414-c9a70374f352',
          )
        }>
        <Text style={tailwind`underline text-gray-300`}>
          View Terms of Use (EULA)
        </Text>
      </TouchableOpacity>

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
