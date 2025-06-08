import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';

const BillingModalContent = ({setActiveModal}) => {
  const {profile} = useProfile();

  // Map profile.tier to plan name
  const getPlanName = () => {
    switch (profile?.tier) {
      case 1:
        return 'Marhabah Free';
      case 2:
        return 'Marhabah Pro';
      case 3:
        return 'Marhabah Pro+';
      default:
        return 'Unknown';
    }
  };

  const openManageSubscriptions = () => {
    Linking.openURL('https://apps.apple.com/account/subscriptions').catch(err =>
      console.error('Failed to open subscriptions URL:', err),
    );
  };

  return (
    <View>
      <Text style={tailwind`text-2xl font-bold mb-4 text-center`}>
        Billing Details
      </Text>

      {/* Current Plan */}
      <View style={tailwind`mb-4`}>
        <Text style={tailwind`text-base text-gray-500 mb-1`}>
          Current Plan:
        </Text>
        <Text style={tailwind`text-lg font-semibold text-gray-800`}>
          {getPlanName()}
        </Text>
      </View>

      {/* Renewal info */}
      <View style={tailwind`mb-4`}>
        <Text style={tailwind`text-base text-gray-500 mb-1`}>Renewal:</Text>
        <Text style={tailwind`text-lg font-semibold text-gray-800`}>
          Auto-renews via Apple
        </Text>
      </View>

      {/* Payment method */}
      <View style={tailwind`mb-4`}>
        <Text style={tailwind`text-base text-gray-500 mb-1`}>
          Payment Method:
        </Text>
        <Text style={tailwind`text-lg font-semibold text-gray-800`}>
          Managed by Apple
        </Text>
      </View>

      {/* Manage subscription */}
      {profile?.tier !== 1 && (
        <TouchableOpacity
          onPress={openManageSubscriptions}
          style={[
            tailwind`p-3 mt-4 rounded-2 items-center`,
            {backgroundColor: themeColors.primary},
          ]}>
          <Text style={tailwind`text-base font-semibold text-white`}>
            Manage Subscription
          </Text>
        </TouchableOpacity>
      )}

      {/* Close button */}
      <TouchableOpacity
        onPress={() => setActiveModal(null)}
        style={tailwind`mt-4`}>
        <Text style={tailwind`text-center text-blue-500 underline`}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BillingModalContent;
